/*
 * Copyright(c) 2015 SAP SE
 */
/*global sap */
jQuery.sap.declare('sap.apf.core.utils.filterSimplify');
jQuery.sap.require('sap.apf.core.utils.filter');
jQuery.sap.require('sap.apf.core.utils.filterTerm');
jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.require('sap.apf.core.messageHandler');
(function() {
	'use strict';
	/**
	 * For any FilterTerm in the filter tree, collect its property name.
	 * For any equation in the filter tree, collect its value.
	 * Note: it even collects values of tree not representing disjunctive equalities over a single property (well-formed disjunctions).
	 * 
	 * @constructor
	 */
	sap.apf.core.utils.CollectPropertiesAndValuesVisitor = function() {
		var that = this;
		var aProperties = [];
		var aValues = [];
		var isPureEquality = true; // false if exists operator not EQ
		var isDisjunction = true;
		var nrAndNodes = 0;
		var nrOrNodes = 0;
		var nrEmptyFilters = 0;
		var nrFilterTerms = 0;

		/** Creates a set of properties, each property occurring only once */
		function addProperty(property) {
			var i, length = aProperties.length;
			for(i = 0; i < length; i++) {
				if (aProperties[i] === property) {
					return;
				}
			}
			aProperties.push(property);
		}
		this.getProperties = function() {
			return aProperties.slice(0);
		};
		this.getValues = function() {
			return aValues.slice(0);
		};
		this.isWellFormed = function() {
			return isPureEquality && isDisjunction && aProperties.length <= 1;
		};
		this.isEmptyFilter = function() {
			return nrAndNodes === 0 && nrOrNodes === 0 && nrEmptyFilters > 0 && nrFilterTerms === 0;
		};
		this.processEmptyFilter = function() {
			nrEmptyFilters++;
		};
		this.processAnd = function(filter, aFilters) {
			nrAndNodes++;
			isDisjunction = false;
			this.process(filter);
			this.processAndArray(aFilters);
		};
		this.processAndArray = function(aFilters) {
			aFilters.forEach(function(filter) {
				that.process(filter);
			});
		};
		this.processOr = function(filter, aFilters) {
			nrOrNodes++;
			this.process(filter);
			this.processOrArray(aFilters);
		};
		this.processOrArray = function(aFilters) {
			aFilters.forEach(function(filter) {
				that.process(filter);
			});
		};
		/**
		 * Terminal node filter term.
		 * @param term
		 */
		this.processTerm = function(term) {
			nrFilterTerms++;
			var property = term.getProperty();
			addProperty(property);
			switch (term.getOp()) { // all:
				case sap.apf.core.constants.FilterOperators.EQ:
					aValues.push(term.getValue());
					return;
				default:
					isPureEquality = false;
					return;
			}
		};
		/**
		 * This is the public API method that should be called with a filter.
		 * Process any Filter, e.g. a subtree over OR, And, or a FilterTerm.
		 * A filter null or undefined occurs in recursion by construction of Filter objects.
		 * It represents an empty filter and terminates recursion.
		 *
		 * @param {sap.apf.core.utils.Filter} filter must not be undefined
		 */
		this.process = function(filter) {
			if (filter instanceof sap.apf.core.utils.FilterTerm) {
				this.processTerm(filter);
			} else {
				filter.traverse(this);
			}
		};
	};

	/**
	 * A Visitor class. Collect children of an AND-filter, and of an AND spine topmost left-to-right.
	 * @constructor
	 * returns {Object[]|*|null} returns null when the filter is either undefined or an OR-filter, returns a list filters otherwise.
	 */
	sap.apf.core.utils.CollectChildrenOfAndNodeVisitor = function() {
		this.processEmptyFilter = function() {
			return null;
		};
		this.processTerm = function(term) {
			return [term];
		};
		this.processAnd = function(filter0, aFilters) {
			var result = [];
			result.push(filter0);
			aFilters.forEach(function(filter) {
				result.push(filter);
			});
			return result;
		};
		this.processOr = function(/* filter, aFilters */) {
			return null;
		};
		this.process = function(filter) {
			if (filter instanceof sap.apf.core.utils.FilterTerm) {
				this.processTerm(filter);
			} else {
				return filter.traverse(this);
			}
		};
	};
	/**
	 * Main methods for reducing a filter into an ABAP select option
	 * 
	 * @constructor
	 */
	sap.apf.core.utils.FilterReduction = function() {
		var that = this;
		var isContradicted = false;
		/**
		 * Transform a list of well-formed OR filters to a list of transform objects {property, values}
		 * 
		 * @param {[sap.apf.core.utils.Filter||sap.apf.core.utils.FilterTerm]} aFilters -
		 *            is an array of OR-filters. Each OR-filter
		 *            (disjunction) has one or more filter terms, these filter
		 *            terms have the same property but different values
		 * @returns {Object[]} aTransforms - an array of transform. Transform is
		 *          another form of OR-filter, which is an object {property,
		 *          values}. A transform has one property and one or multiple
		 *          values as an array.
		 */
		this.transformFilter = function(aFilters) {
			var aTransforms = [];
			var aProperties;
			var collector;
			if (aFilters) {
				aFilters.forEach(function(filter) {
					if (filter instanceof sap.apf.core.utils.FilterTerm) {
						aTransforms.push({
							property : filter.getProperty(),
							values : [ filter.getValue() ]
						});
					} else if (filter instanceof sap.apf.core.utils.Filter) {
						aProperties = filter.getProperties();
						collector = new sap.apf.core.utils.CollectPropertiesAndValuesVisitor();
						collector.process(filter);
						aTransforms.push({
							property : aProperties[0], // a child filter is in
							// normal form, meaning it
							// has exactly one property
							values : collector.getValues()
						});
					}
				});
			}
			return aTransforms;
		};
		/**
		 * Find (unique) common values of two transformed filters.
		 * 
		 * @param {Object} transform1 -
		 *            {property, values}. A transform has one
		 *            property and one or multiple values as an array.
		 * @param {Object} transform2 -
		 *            {property, values}. A transform has one
		 *            property and one or multiple values as an array.
		 * @returns {Object} resultTransform - {property, values}. This transform
		 *          contains the common values of two input transforms.
		 */
		this.intersection = function(transform1, transform2) {
			var resultTransform = {};
			var leftValues = transform1.values;
			var rightValues = transform2.values;
			var joinedValues = [];
			var lookup = {}; // using an object as a hash
			var i, length1 = leftValues.length;
			var j, rightLength = rightValues.length;
			// encoding each value of leftValues as a member of hash
			for(i = 0; i < length1; i++) {
				lookup[leftValues[i]] = leftValues[i];
			}
			for(j = 0; j < rightLength; j++) {
				// meaning any value not part of leftValues is an undefined member of lookup.
				if (lookup[rightValues[j]] !== undefined && joinedValues.indexOf(rightValues[j]) < 0) { // is linear in array size, so algorithm still quadratic.
					joinedValues.push(rightValues[j]);
				}
			}
			resultTransform.property = transform1.property;
			resultTransform.values = joinedValues;
			return resultTransform;
		};

		function FilterSeparationVisitor(messageHandler) {
			this.reducers = [];
			this.disjunctions = [];
			this.processTerm = function(term) {
				var wrapper = new sap.apf.core.utils.Filter(messageHandler, term);
				if (term.getOp() === sap.apf.core.constants.FilterOperators.EQ) {
					this.disjunctions.push(wrapper);
				} else {
					this.reducers.push(wrapper);
				}
			};
			this.processOr = function(leftFilter, aFilters, orNode) {
				var innerCollector = new sap.apf.core.utils.CollectPropertiesAndValuesVisitor();
				innerCollector.process(orNode);
				if (innerCollector.isWellFormed()) {
					this.disjunctions.push(orNode);
				} else {
					this.reducers.push(orNode);
				}
			};
			this.processAnd = function(leftFilter, aFilters, andNode) {
				var separation = that.filterSeparation(andNode, messageHandler);
				this.disjunctions = this.disjunctions.concat(separation.disjunctions);
				this.reducers = this.reducers.concat(separation.reducers);
			};
			this.processEmptyFilter = function() {
			};
			this.process = function(term) {
				term.traverse(this);
			};
		}

		/**
		 * Separate a filter into 2 parts, reducer and disjunctions.
		 * The disjunctions-part is an array, which contains well-formed disjunctions.
		 * The rest will be pushed into an array called reducer.
		 * Usage @see main function filterReduction(messageHandler, filter).
		 *
		 * Separate filter tree as follows:
		 * Separate well-formed disjunctive sub-filters from other parts.
		 * Well-formed disjunctive filters are:
		 * 		a FilterTerm that is an EQ, which is either coming from external context (SapClient), or a single selection in a step or facetFilter
		 * 		an EmptyFilter (wildcard), which is created always when a step has no selection
		 * 		or a well-formed disjunctive filter: which is the result of many selections on a step or FacetFilter.
		 * 		A well-formed disjunction is a filter which only contains equality terms of the same property.
		 *
		 * The filter parameter is well-formed if its top node is of the above form.
		 * When the filter parameter is an AND node, the separation extracts all directs subtrees which are maximal well-formed disjunctive filters.
		 * Maximal means that the method returns an OR node containing equations, not the equations.
		 * Thus, each direct sub-node of the AND either is a well-formed disjunction, or an empty filter which will be eliminated, or a non well-formed node.
		 * The function returns the filters separated into an array of well-formed ones and an array of non well-formed ones.
		 *
		 * @param {sap.apf.core.utils.Filter} filter - An internal filter. Assumed to be an AND node or FilterTerm. If not, returns empty arrays.
		 * @return {{reducers: sap.apf.core.utils.Filter[], disjunctions: sap.apf.core.utils.Filter[]}}
		 */
		this.filterSeparation = function (filter, messageHandler) {
			var collector = new sap.apf.core.utils.CollectChildrenOfAndNodeVisitor();
			var aFilters = collector.process(filter);
			var visitor;

			if ( !aFilters ) {
				return {
					reducers : [],
					disjunctions : []
				};
			}
			visitor = new FilterSeparationVisitor(messageHandler);
			aFilters.forEach(function(element) {
				element.traverse(visitor);
			});
			return {
				reducers : visitor.reducers,
				disjunctions : visitor.disjunctions
			};
		};
		/**
		 * Simplify an array of transformed filters. As a result, there is only
		 * one transformed filter for exactly one property.
		 * 
		 * @param {Object[]} aTransforms -
		 *            an array of transforms {property, values}. A
		 *            transform has one property and one or multiple values as
		 *            an array.
		 * @returns {Object[]} aSimplifiedTransforms - an array of transforms
		 *          {property, values}. There is only one transform for exactly
		 *          one property.
		 */
		this.simplifyTransforms = function(aTransforms) {
			var aSimplifiedTransforms = [];
			var reducedTransform;
			var aProcessedProperties = [];
			var length = aTransforms.length;
			var name;
			aTransforms.forEach(function(transform, i) {
				var j;
				name = transform.property;
				if (aProcessedProperties.indexOf(name) === -1) { // if not contained
					aProcessedProperties.push(name);
					reducedTransform = transform;
					for(j = i + 1; j < length; ++j) {
						if (name === aTransforms[j].property) {
							reducedTransform = that.intersection(reducedTransform, aTransforms[j]);
						}
					}
					aSimplifiedTransforms.push(reducedTransform);
				}
			});
			return aSimplifiedTransforms;
		};
		/**
		 * Compare the values in an array of transforms to a start filter,
		 * remove the transforms which do not fulfill the start filter
		 * condition.
		 * 
		 * @param {sap.apf.core.utils.Filter} startFilter -
		 *            is optional
		 * @param {Object[]} aTransformed -
		 *            is an array of simplified transformed filter
		 * @return {Object[]} aReducedTransformed - return an array of transforms
		 *         after apply the start filter.
		 */
		this.applyStartFilter = function(startFilter, aTransformed) {
			var aReducedTransformed = [];
			var aPropertiesOfStartFilter = startFilter.getProperties();
			aTransformed.forEach(function(transform) {
				var aResultValues = [];
				var j;
				var length = transform.values.length;
				var value;
				if (aPropertiesOfStartFilter.indexOf(transform.property) > -1) { // contained
					for(j = 0; j < length; j++) {
						value = transform.values[j];
						// apply the start filter as a predicate filter on values
						if (startFilter.isConsistentWithFilter(transform.property, value)) {
							aResultValues.push(value);
						}
					}
					aReducedTransformed.push({
						property : transform.property,
						values : aResultValues
					});
				} else {
					aReducedTransformed.push(transform);
				}
			});
			return aReducedTransformed;
		};
		/**
		 * Compare the properties in an array of transforms to a start filter.
		 * Remove terms of properties that occur in transformed. Note we removed
		 * terms of contradictory transformed filters, too.
		 * 
		 * @param {sap.apf.core.utils.Filter} startFilter -
		 *            is optional, ABAP select option
		 * @param {Object[]} aTransform -
		 *            is an array of transforms
		 * @returns {sap.apf.core.utils.Filter} resultStartFilter - return the
		 *          simplified start filter after apply it to the array of
		 *          transform
		 */
		this.simplifyInStartFilter = function(startFilter, aTransform) {
			var resultStartFilter = startFilter;
			aTransform.forEach(function(transform) {
				if (resultStartFilter) {
					resultStartFilter = resultStartFilter.removeTermsByProperty(transform.property);
				}
			});
			if(resultStartFilter.isEmpty()){
				return undefined;
			}
			return resultStartFilter;
		};
		/**
		 * Check if there is a contradiction (meaning empty reduced filter), and then roll back to the original filter.
		 * 
		 * @param {sap.apf.core.MessageHandler} messageHandler
		 *            
		 * @param {Object[]} aTransforms -
		 *            is an array of transforms
		 * @returns {boolean} isContradicted - return true if there is a 
		 * contradiction found. A contradiction means that after simplifying
		 * return empty
		 */
		this.containsContradiction = function(messageHandler, aTransforms) {
			var isContradicted = false;
			aTransforms.forEach(function(transform) {
				if (transform.values.length === 0) {
					isContradicted = true;
				}
			});
			if (isContradicted) {
				return isContradicted;
			}
			return isContradicted;
		};
		/**
		 * Rebuild the OR-filter in the transform format {property, values} back
		 * to the sap.apf.core.utils.Filter 
		 * 
		 * @param {sap.apf.core.MessageHandler} messageHandler
		 *            
		 * @param { {property:String, values:[]}} transform -
		 *           
		 * @returns {sap.apf.core.utils.Filter} resultFilter - internal filter
		 *          
		 */
		this.rebuildDisjunction = function(messageHandler, transform) {
			var resultFilter = new sap.apf.core.utils.Filter(messageHandler);
			var property = transform.property;
			var aValues = transform.values;
			aValues.forEach(function(value) {
				var filterTerm = new sap.apf.core.utils.FilterTerm(messageHandler, property, sap.apf.core.constants.FilterOperators.EQ, value);
				resultFilter.addOr(filterTerm);
			});
			return resultFilter;
		};
		/**
		 * The objective is to transform a filter created by APF path analysis into a filter
		 * that is representable as an ABAP select option.
		 * Any filter that cannot be transformed into such a form is returned directly and hence is supposed to fail on the server.
		 *
		 * This is the main filter reduction method which returns a simplified and reduced filter.
		 * The parameter "filter" is supposed to be the cumulative filter.
		 * The latter is formed by external context, footers, facet filters (value helps) and filters by steps.
		 * Returns null when the reduction detects a contradiction.
		 * A contradiction cannot be represented as a filter here.
		 * Hence, the calling context will then send the original filter (input parameter filter) to the request.
		 *
		 * Further, the following filters are returned immediately:
		 * A FilterTerm, an OR node, and an empty filter.
		 *
		 * @param {sap.apf.core.MessageHandler} messageHandler
		 *        
		 * @param {sap.apf.core.utils.Filter} filter -
		 *            is a filter start with AND in level 0, which could contains
		 *            start filter, value helps, and path filter
		 * @returns {sap.apf.core.utils.Filter|null} resultFilter - return a
		 *          filter reduction, which is representable to ABAP selection
		 *          option (including reduced start filter). Return null if there is a contradiction found.
		 * 
		 */
		this.filterReduction = function(messageHandler, filter) {
			var context = this;
			function mapTransformsToDisjunctions(aReducedTransforms) {
				var aReducedDisjunctions = [];
				aReducedTransforms.forEach(function(reducedTransform) {
					aReducedDisjunctions.push(that.rebuildDisjunction(messageHandler, reducedTransform));
				});
				return aReducedDisjunctions;
			}
			function addFiltersToAnd(andNode, aFilters) {
				aFilters.forEach(function(element) {
					andNode.addAnd(element);
				});
			}
			function applyReducersToTransforms(reducers, simplifiedTransforms) {
				var i;
				var aReducedTransforms = simplifiedTransforms;
				var aSimplifiedReducers = [];
				var simplifiedStartFilter;
				for(i = 0; i < reducers.length; ++i) {
					aReducedTransforms = context.applyStartFilter(reducers[i], simplifiedTransforms);
					if (context.containsContradiction(messageHandler, aReducedTransforms)) {
						return {
							contradiction: filter
						};
					}
					//removes only those reducer terms (reducers[i]) that have been applied to the transforms  
					simplifiedStartFilter = context.simplifyInStartFilter(reducers[i], simplifiedTransforms);
					if (simplifiedStartFilter) {
						aSimplifiedReducers.push(simplifiedStartFilter);
					}
				}
				return {
					reducedTransforms: aReducedTransforms,
					simplifiedReducers: aSimplifiedReducers
				};
			}

			var oSeparatedFilter;
			var aDisjunctions;
			var aTransforms;
			var aSimplifiedTransforms;
			var oResultFilter;
			var reducedDisjunctionsAndContext;

			// if filter is detected as filter term or is an empty filter, return filter
			if (filter.isFilterTerm() || filter.isOr() || filter.isEmpty() ) { // order matters for performance
				return filter;
			}
			// assert: filter is an AND node.
			oSeparatedFilter = this.filterSeparation(filter, messageHandler);
			aDisjunctions = oSeparatedFilter.disjunctions;
			aTransforms = this.transformFilter(aDisjunctions);
			aSimplifiedTransforms = this.simplifyTransforms(aTransforms);
			if (this.containsContradiction(messageHandler, aSimplifiedTransforms)) {
				isContradicted = true;
				return filter;
			}
			reducedDisjunctionsAndContext = applyReducersToTransforms(oSeparatedFilter.reducers, aSimplifiedTransforms);
			if ( reducedDisjunctionsAndContext.contradiction){
				isContradicted = true;
				return reducedDisjunctionsAndContext.contradiction;
			}
			// reconstruct AND over all remaining context filters
			oResultFilter = new sap.apf.core.utils.Filter(messageHandler);
			addFiltersToAnd(oResultFilter, reducedDisjunctionsAndContext.simplifiedReducers);
			// reconstruct AND over all reconstructed and reduced disjunctions
			addFiltersToAnd(oResultFilter, mapTransformsToDisjunctions(reducedDisjunctionsAndContext.reducedTransforms));
			return oResultFilter;
		};
		/**
		 *  @returns {boolean} returns if a contradiction was found in the reduction
		 */
		this.isContradicted = function(){
			return isContradicted;
		};
	};
}());
