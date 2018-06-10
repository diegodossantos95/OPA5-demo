/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function() {
	'use strict';
	jQuery.sap.declare('sap.apf.utils.filter');
	jQuery.sap.require("sap.apf.core.utils.filterTerm");
	jQuery.sap.require("sap.apf.core.utils.filter");
	jQuery.sap.require("sap.apf.utils.hashtable");
	/**
	 * @public
	 * @class Filter object
	 * @description It is designed to be used for supplying context information for
	 *              the application. In addition, it can be used for exchanging
	 *              filter values between the path and the facet filters. This function object supports the top down
	 *              construction of filter expressions.
	 * @name sap.apf.utils.Filter
	 * @param {sap.apf.core.MessageHandler} oMessageHandler
	 * @returns {sap.apf.utils.Filter}
	 */
	sap.apf.utils.Filter = function(oMessageHandler) {
		// Private vars
		var oTopAnd;
		var that = this;
		var initialize = function() {
			oTopAnd = new sap.apf.utils.FilterAnd(oMessageHandler, sap.apf.utils.Filter.topAndId);
		};
		// Public functions
		/**
		 * @public
		 * @function
		 * @name sap.apf.utils.Filter#getById
		 * @description Returns filter object or expression for a given ID, if exists.
		 * @param {string} sId - ID of the object to be returned.
		 * @returns {(sap.apf.utils.FilterAnd|sap.apf.utils.FilterOr|sap.apf.utils.FilterExpression|undefined)}
		 */
		this.getById = function(sId) {
			if (oTopAnd) {
				if (sId === sap.apf.utils.Filter.topAndId) {
					return oTopAnd;
				}
				return oTopAnd.getById(sId);
			}
			return undefined;
		};
		/**
		 * @public
		 * @description Contains 'filter'
		 * @returns {string}
		 */
		this.type = "filter";
		/**
		 * @public
		 * @function
		 * @name sap.apf.utils.Filter#getExpressions
		 * @description Returns the logical operations and the boolean expressions of a Filter
		 *              object as nested arrays for the logical operations and single level objects
		 *              for the boolean expressions.
		 *              Depending on the nesting level of the arrays the logical operators
		 *              for the terms in the arrays alternates between AND and OR.
		 *              The array on the highest level has the logical operator AND.
		 *              It corresponds to the TopAnd filter term.
		 *              Terms in general can be composed of the logical operation AND (see the FilterAnd object)
		 *              or OR (see the FilterOr object) or be a boolean expression (see the FilterExpression object).
		 *              AND and OR terms are returned as arrays; boolean expressions are returned as objects.
		 * @returns {object[]} Array of AND terms, OR terms and expressions.
		 */
		this.getExpressions = function() {
			if (oTopAnd) {
				return oTopAnd.getExpressions();
			}
			return [];
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.Filter#getInternalFilter
		 * @description Do not use. Not part of the APF API. Method should only be
		 *              called internally by APF.
		 * @returns {sap.apf.core.utils.Filter}
		 */
		this.getInternalFilter = function() {
			return oTopAnd.getInternalFilter();
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.utils.Filter#getTopAnd
		 * @description Returns the top 'AND' object of the filter.
		 * @returns {sap.apf.utils.FilterAnd}
		 */
		this.getTopAnd = function() {
			return oTopAnd;
		};
		
		/**
		 * @public
		 * @function
		 * @name sap.apf.utils.Filter#updateExpression
		 * @description Updates an expression.
		 * @param {string} sId ID of expression to be updated
		 * @param {object} oExpression Expression object containing the updated properties
		 * @param {string} oExpression.id Updated expression ID
		 * @param {string} oExpression.name Updated expression name
		 * @param {string} oExpression.operator Updated expression operator of type  {sap.apf.core.constants.FilterOperators}
		 * @param {string|number} oExpression.value Updated expression low value
		 * @param {string|number }oExpression.high Updated expression high value
		 * @returns undefined
		 */
		this.updateExpression = function(sId, oExpression) {
			oMessageHandler.check(sId === oExpression.id, "sId differs from oExpression.id");
			var oExpressionObject = this.getById(sId);
			oExpressionObject.update(oExpression);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.utils.Filter#updateValue
		 * @description Updates a value of an expression object.
		 * @param {string} sId ID of the expression object to be updated
		 * @param {string} value The new low value for the expression (optional)
		 * @param {string} high The new high value for the expression (optional)
		 * @returns undefined
		 */
		this.updateValue = function(sId, value, high) {
			oMessageHandler.check(sId !== undefined, "Filter updateValue: parameter id required");
			oMessageHandler.check(value !== undefined, "Filter updateValue: parameter value is required");
			var oExpressionObject = this.getById(sId);
			oMessageHandler.check(oExpressionObject !== undefined, "Filter updateValue: id for expression not valid");
			oExpressionObject.updateValue(value, high);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.Filter#serialize
		 * @description Do not use. Not part of the APF API. Method should only be called internally by APF.
		 * @returns {object}
		 */
		this.serialize = function() {
			function getSerializableFilterObject(aCompoundExpressions, oTerm) {
				var oSerializableObject = {
					id : oTerm.getId(),
					type : oTerm.type,
					expressions : [],
					terms : []
				};
				aCompoundExpressions.forEach(function(compoundExpression, i) {
					if (compoundExpression instanceof Array) {
						if (oTerm.type === "filterAnd") {
							oSerializableObject.terms.push(getSerializableFilterObject(compoundExpression, oTerm.getAndTerms()[i]));
						} else if (oTerm.type === "filterOr") {
							oSerializableObject.terms.push(getSerializableFilterObject(compoundExpression, oTerm.getOrTerms()[i]));
						}
					} else {
						oSerializableObject.expressions.push(compoundExpression);
					}
				});
				return oSerializableObject;
			}
			return getSerializableFilterObject(this.getTopAnd().getExpression(), this.getTopAnd());
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.Filter#deserialize
		 * @description Do not use. Not part of the APF API. Method should only be called internally by APF.
		 * @param {object} oSerializableFilter
		 * @returns {object}
		 */
		this.deserialize = function(oSerializableFilter) {
			oTopAnd = undefined;
			initialize();
			function getDeserializedFilter(oSerializableFilter, oTerm) {
				if (oSerializableFilter.type === "filterAnd" && oSerializableFilter.id !== sap.apf.utils.Filter.topAndId) {
					oTerm = oTerm.addAnd(oSerializableFilter.id);
				} else if (oSerializableFilter.type === "filterOr" && oSerializableFilter.id !== sap.apf.utils.Filter.topAndId) {
					oTerm = oTerm.addOr(oSerializableFilter.id);
				}
				oSerializableFilter.expressions.forEach(function(expression) {
					oTerm.addExpression(expression);
				});
				oSerializableFilter.terms.forEach(function(term) {
					getDeserializedFilter(term, oTerm);
				});
			}
			getDeserializedFilter(oSerializableFilter, this.getTopAnd());
			return this;
		};
		/**
		 * @private
		 * @function
		 * @deprecated
		 * @name sap.apf.utils.Filter#addAnd
		 * @description Deprecated since 1.23.0. Will be discarded with 1.26.0
		 */
		this.addAnd = function(sId) {
			jQuery.sap.log.error("Method 'addAnd' is deprecated since 1.23.0", "Will be discarded with 1.26.0.");
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.utils.Filter#intersectWith
		 * @description Build the intersection of the this filter object with the supplied filter(s). The method does not change the "this"-instance.
		 * @param args {(...sap.apf.utils.Filter|sap.apf.utils.Filter[])} Single filter object {@link sap.apf.utils.Filter}, a comma separated parameter list of filter objects, or an array of filter objects
		 * @returns {sap.apf.utils.Filter} new filter object {@link sap.apf.utils.Filter} for the intersected filters
		 */
		this.intersectWith = function(args) {
			var i = 0;
			var aFilter = [];
			var oFilter;
			var oResultFilter = new sap.apf.utils.Filter(oMessageHandler);
			var oResultSerialization = that.serialize(); // Start-result is from "that"-instance
			setNewIds(oResultSerialization);
			//Handle different call types
			switch (arguments.length) {
				case 1:
					oFilter = arguments[0];
					if (oFilter instanceof Array) {
						aFilter = oFilter;
					} else {
						aFilter.push(oFilter);
					}
					break;
				default:
					aFilter = Array.prototype.slice.call(arguments, 0);
			}
			aFilter.forEach(function(oFilterItem) {
				oMessageHandler.check((oFilterItem instanceof sap.apf.utils.Filter), "Parameter value is not of type sap.apf.utils.Filter");
				var oItemSerialization = oFilterItem.serialize();
				setNewIds(oItemSerialization);
				//append the items of the second array to the first array:
				Array.prototype.push.apply(oResultSerialization.expressions, oItemSerialization.expressions);
				Array.prototype.push.apply(oResultSerialization.terms, oItemSerialization.terms);
			});
			oResultFilter.deserialize(oResultSerialization);
			return oResultFilter;
			function setNewIds(oSerializedFilter) {
				if (oSerializedFilter.id !== sap.apf.utils.Filter.topAndId) {
					oSerializedFilter.id = '#' + i++ + '#';
				}
				oSerializedFilter.terms.forEach(setNewIds);
			}
		};
		initialize();
		return this;
	};
	
	/**
	 * @public
	 * @function
	 * @name sap.apf.utils.Filter#createFilterFromSapUi5FilterJSON
	 * @description Creates a filter from json format, that comes from selection variant. Apf creates this filter format with
	 * method sap.apf.core.utils.Filter#mapToSapUI5FilterExpression. See there for description of the format.
	 * @returns {sap.apf.utils.Filter} 
	 */
	sap.apf.utils.Filter.createFilterFromSapUi5FilterJSON = function(messageHandler, sapUi5FilterFormat) {
		var result = new sap.apf.utils.Filter(messageHandler);
		function addNextLevel(filter, level, format) {
			var filterTerm;
			level++;
			if (format.aFilters) {
				if (format.bAnd) {
					if (level !== 1) {
						filterTerm = filter.addAnd();
					} else {
						filterTerm = filter;
					}
				} else {
					filterTerm = filter.addOr();
				}
				format.aFilters.forEach(function(element) {
					addNextLevel(filterTerm, level, element);
				});
			} else if (format.sOperator) { //TODO this is an additional check because mapToSapUI5FilterExpression() produces a an empty expression. Fix issue in mapToSapUI5FilterExpression()
				filter.addExpression({
					name : format.sPath,
					operator : format.sOperator,
					value : format.oValue1,
					high : format.oValue2
				});
			}
		}
		addNextLevel(result.getTopAnd(), 0, sapUi5FilterFormat);
		return result;
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.utils.Filter#getOperators
	 * @description Convenience function to get the OData operators which are
	 *              defined in {sap.apf.core.constants.FilterOperators}.
	 * @returns {sap.apf.core.constants.FilterOperators} 
	 */
	sap.apf.utils.Filter.getOperators = function() {
		return sap.apf.core.constants.FilterOperators;
	};
	sap.apf.utils.Filter.prototype.getOperators = sap.apf.utils.Filter.getOperators;
	// Static public vars
	sap.apf.utils.Filter.topAndId = 'filterTopAnd';
	/**
	 * @public
	 * @class FilterAnd
	 * @name sap.apf.utils.FilterAnd
	 * @param {sap.apf.core.MessageHandler} oMessageHandler
	 * @param {string} sId Identifier for the object
	 * @returns {sap.apf.utils.FilterAnd}
	 */
	sap.apf.utils.FilterAnd = function(oMessageHandler, sId) {
		// Private vars
		var id = sId;
		var aAndTerms = [];
		/** @type {sap.apf.utils.FilterAnd} */
		var that = this;
		// Private functions
		// Public functions
		/**
		 * @public
		 * @description Contains 'filter'
		 * @returns {string}
		 */
		this.type = "filterAnd";
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterAnd#getById
		 * @description Do not use. Not part of the APF API. Method should only be called internally by APF.
		 * @param {string} sId ID of the object to be returned
		 * @returns {(sap.apf.utils.FilterAnd|sap.apf.utils.FilterOr|sap.apf.utils.FilterExpression|undefined)}
		 */
		this.getById = function(sId) {
			if (sId === id) {
				return this;
			}
			var oTerm;
			var i;
			for(i = 0; i < aAndTerms.length; i++) {
				oTerm = aAndTerms[i].getById(sId);
				if (oTerm !== undefined) {
					return oTerm;
				}
			}
			return undefined;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterAnd#getCompoundExpressions
		 * @description Do not use. Not part of the APF API. Method should only be
		 *              called internally by APF.
		 * @returns {object[]}
		 */
		this.getExpressions = function() {
			// This method is only used for the topAnd filter expression due to compatibility requirements
			// It could be replaced by filterAnd.getExpression without these requirements.
			var aExpression = [];
			var oTerm;
			var i;
			for(i = 0; i < aAndTerms.length; i++) {
				oTerm = aAndTerms[i].getExpression();
				if (oTerm instanceof Array && oTerm.length === 0) {
					continue;
				}
				//Compatibility mode with respect to older UI5 shipments
				if (oTerm instanceof Array) {
					aExpression.push(oTerm);
				} else {
					aExpression.push([ oTerm ]);
				}
			}
			return aExpression;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterAnd#getExpressions
		 * @description Do not use. Not part of the APF API. Method should only be
		 *              called internally by APF.
		 * @returns {object[]} Array of expressions
		 */
		this.getExpression = function() {
			var aExpression = [];
			var oTerm;
			var i;
			for(i = 0; i < aAndTerms.length; i++) {
				oTerm = aAndTerms[i].getExpression();
				if (oTerm instanceof Array && oTerm.length === 0) {
					continue;
				}
				aExpression.push(oTerm);
			}
			return aExpression;
		};
		/**
		 * @private
		 * @function
		 * @deprecated
		 * @name sap.apf.utils.FilterAnd#getCompoundExpressions
		 * @description Do not use. Not part of the APF API. Method should only be
		 *              called internally by APF.
		 * @returns {object[]} Array of expressions
		 */
		this.getCompoundExpressions = function() {
			jQuery.sap.log.error("Method 'getExpressions' is deprecated since 1.23.0", "Will be discarded with 1.26.0.");
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.utils.FilterAnd#getId
		 * @description Returns ID of this filter object.
		 * @returns {string}
		 */
		this.getId = function() {
			return sId;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterAnd#getInternalFilter
		 * @description Do not use. Not part of the APF API. Method should only be
		 *              called internally by APF.
		 * @returns {sap.apf.core.utils.Filter}
		 */
		this.getInternalFilter = function() {
			var oFilter = new sap.apf.core.utils.Filter(oMessageHandler);
			var len = aAndTerms.length;
			var i;
			for(i = 0; i < len; i++) {
				oFilter.addAnd(aAndTerms[i].getInternalFilter());
			}
			return oFilter;
		};
		/**
		 * @private
		 * @function
		 * @deprecated
		 * @name sap.apf.utils.FilterAnd#addAndTerm
		 * @description Do not use. Not part of the APF API. Method should only be
		 *              called internally by APF.
		 * @returns undefined
		 */
		this.addAndTerm = function(oTerm) {
			jQuery.sap.log.error("Method 'addAndTerm' is deprecated since 1.23.0", "Will be discarded with 1.26.0.");
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterAnd#getAndTerms
		 * @description Do not use. Not part of the APF API. Method should only be called internally by APF.
		 * @returns {array}
		 */
		this.getAndTerms = function() {
			return aAndTerms;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.utils.FilterAnd#addOr
		 * @description Adds an object of type {sap.apf.utils.FilterOr}.
		 * @param {string} sId Identifier for the object to be added.
		 * @returns {sap.apf.utils.FilterOr}
		 */
		this.addOr = function(sId) {
			oMessageHandler.check((sId === undefined || this.getById(sId) === undefined), "Filter includes duplicated identifiers (IDs)");
			var or = new sap.apf.utils.FilterOr(oMessageHandler, sId, that);
			aAndTerms.push(or);
			return or;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.utils.FilterAnd#addExpression
		 * @description Adds an expression object to this filter.
		 * @param {object} oExpression Expression object
		 * @param oExpression.id Expression ID
		 * @param oExpression.name Expression name
		 * @param oExpression.operator Expression operator of type  {sap.apf.core.constants.FilterOperators}
		 * @param oExpression.value Expression value
		 * @returns {sap.apf.utils.FilterAnd} this to allow method chaining
		 */
		this.addExpression = function(oExpression) {
			if (oExpression.operator.length == 2) {
				oExpression.operator = oExpression.operator.toUpperCase();
			}
			oMessageHandler.check((oExpression.id === undefined || this.getById(oExpression.id) === undefined), "Filter includes duplicated identifiers (IDs)");
			oMessageHandler.check((oExpression.operator !== undefined), "sap.apf.utils.Filter oExpression.operator undefined");
			oMessageHandler.check((jQuery.inArray(oExpression.operator, sap.apf.core.constants.aSelectOpt) > -1), "sap.apf.core.utils.Filter oExpression.operator " + oExpression.operator + " not supported");
			aAndTerms.push(new sap.apf.utils.FilterExpression(oMessageHandler, oExpression));
			return this;
		};
	};
	/**
	 * @public
	 * @class FilterOr
	 * @name sap.apf.utils.FilterOr
	 * @param {sap.apf.core.MessageHandler} oMessageHandler
	 * @param {string} sId Identifier for the object
	 * @param {sap.apf.utils.FilterAnd} oAnd Parent object
	 * @returns {sap.apf.utils.FilterOr}
	 */
	sap.apf.utils.FilterOr = function(oMessageHandler, sId, oAnd) {
		// Private vars
		var id = sId;
		var aOrTerms = [];
		var oAndObject = oAnd;
		// Public functions
		/**
		 * @description Contains 'filter'
		 * @returns {string}
		 */
		this.type = "filterOr";
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterOr#getById
		 * @description Do not use. Not part of the APF API. Method should only be called internally by APF.
		 * @param {string} sId ID of the object to be returned
		 * @returns {(sap.apf.utils.FilterAnd|sap.apf.utils.FilterOr|sap.apf.utils.FilterExpression|undefined)}
		 */
		this.getById = function(sId) {
			if (sId === id) {
				return this;
			}
			var oTerm;
			for(var i = 0; i < aOrTerms.length; i++) {
				oTerm = aOrTerms[i].getById(sId);
				if (oTerm !== undefined) {
					return oTerm;
				}
			}
			return undefined;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterOr#getExpression
		 * @description Do not use. Not part of the APF API. Method should only be called internally by APF.
		 * @returns {object[]} array of expressions
		 */
		this.getExpression = function() {
			var aExpression = [];
			var oTerm;
			for(var i = 0; i < aOrTerms.length; i++) {
				oTerm = aOrTerms[i].getExpression();
				if (oTerm instanceof Array && oTerm.length === 0) {
					continue;
				}
				aExpression.push(oTerm);
			}
			return aExpression;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.utils.FilterOr#getId
		 * @description Retrieves an ID of the term.
		 * @returns {string} ID of the term.
		 */
		this.getId = function() {
			return sId;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterOr#getInternalFilter
		 * @description Do not use. Not part of the APF API. Method should only be called internally by APF.
		 * @returns {sap.apf.core.utils.Filter}
		 */
		this.getInternalFilter = function() {
			var oFilter = new sap.apf.core.utils.Filter(oMessageHandler);
			for(var i = 0; i < aOrTerms.length; i++) {
				oFilter.addOr(aOrTerms[i].getInternalFilter());
			}
			return oFilter;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterOr#getAndObject
		 * @description Do not use. Not part of the APF API. Method should only be called internally by APF.
		 * @returns {sap.apf.utils.FilterAnd}
		 */
		this.getAndObject = function() {
			return oAndObject;
		};
		/**
		 * @private
		 * @function
		 * @deprecated
		 * @name sap.apf.utils.FilterOr#addOrTerm
		 * @description Do not use. Not part of the APF API. Method should only be
		 *              called internally by APF.
		 * @returns undefined
		 */
		this.addOrTerm = function(oTerm) {
			jQuery.sap.log.error("Method 'addOr' is deprecated since 1.23.0", "Will be discarded with 1.26.0.");
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterOr#getOrTerms
		 * @description Do not use. Not part of the APF API. Method should only be
		 *              called internally by APF.
		 * @returns {array}
		 */
		this.getOrTerms = function() {
			return aOrTerms;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.utils.FilterOr#addExpression
		 * @description Adds an expression object to this filter.
		 * @param {object} oExpression Expression object
		 * @param oExpression.id Expression ID
		 * @param oExpression.name Expression name
		 * @param oExpression.operator Expression operator of type  {sap.apf.core.constants.FilterOperators}
		 * @param oExpression.value Expression value
		 * @returns {sap.apf.utils.FilterOr} this to allow method chaining
		 */
		this.addExpression = function(oExpression) {
			if (oExpression.operator.length == 2) {
				oExpression.operator = oExpression.operator.toUpperCase();
			}
			oMessageHandler.check((oExpression.id === undefined || this.getAndObject().getById(oExpression.id) === undefined), "Filter includes duplicated identifiers (IDs)");
			oMessageHandler.check((oExpression.operator !== undefined), "sap.apf.utils.Filter oExpression.operator undefined");
			oMessageHandler.check((jQuery.inArray(oExpression.operator, sap.apf.core.constants.aSelectOpt) > -1), "sap.apf.core.utils.Filter oExpression.operator " + oExpression.operator + " not supported");
			aOrTerms.push(new sap.apf.utils.FilterExpression(oMessageHandler, oExpression));
			return this;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.utils.FilterOr#addAnd
		 * @description Adds an object of type {@link sap.apf.utils.FilterAnd}.
		 * @param {string} sId Identifier for the object to be added.
		 * @returns {sap.apf.utils.FilterAnd}
		 */
		this.addAnd = function(sId) {
			oMessageHandler.check((sId === undefined || this.getById(sId) === undefined), "Filter includes duplicated identifiers (IDs)");
			var and = new sap.apf.utils.FilterAnd(oMessageHandler, sId);
			aOrTerms.push(and);
			return and;
		};
	};
	/**
	 * @public
	 * @class Filter expression
	 * @name sap.apf.utils.FilterExpression
	 * @param {sap.apf.core.MessageHandler} oMessageHandler
	 * @param {object} oExpression Expression object
	 * @param oExpression.id Expression ID
	 * @param oExpression.name Expression name
	 * @param oExpression.operator Expression operator of type  {sap.apf.core.constants.FilterOperators}
	 * @param oExpression.value Expression value
	 * @param oExpression.high Expression high value
	 * @returns {sap.apf.utils.FilterExpression}
	 */
	sap.apf.utils.FilterExpression = function(oMessageHandler, oExpression) {
		// Checks
		checkHighValue(oExpression.high, oExpression.operator);
		// Private vars
		var sId = oExpression.id;
		var sName = oExpression.name;
		var sOperator = oExpression.operator;
		var sValue = oExpression.value;
		var sHighValue = oExpression.high;
		// Public functions
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterExpression#getById
		 * @description Do not use. Not part of the APF API. Method should only be called internally by APF.
		 * @param {string} id
		 * @returns {sap.apf.utils.FilterExpression}
		 */
		this.getById = function(id) {
			if (sId === id) {
				return this;
			}
			return undefined;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterExpression#getExpression
		 * @description Do not use. Not part of the APF API. Method should only be called internally by APF.
		 * @returns {object}
		 */
		this.getExpression = function() {
			if (!sOperator || sOperator !== sap.apf.core.constants.FilterOperators.BT) {
				return {
					name : sName,
					operator : sOperator,
					value : sValue
				};
			}
			return {
				name : sName,
				operator : sOperator,
				value : sValue,
				high : sHighValue
			};
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterExpression#getInternalFilter
		 * @description Do not use. Not part of the APF API. Method should only be called internally by APF.
		 * @returns {sap.apf.core.utils.Filter}
		 */
		this.getInternalFilter = function() {
			return new sap.apf.core.utils.Filter(oMessageHandler, sName, sOperator, sValue, sHighValue);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterExpression#update
		 * @description Do not use. Not part of the APF API. Method should only be
		 *              called internally by APF.
		 * @param {object} oExpression Expression object
		 * @param oExpression.id Expression ID
		 * @param oExpression.name Expression name
		 * @param oExpression.operator Expression operator of type  {sap.apf.core.constants.FilterOperators}
		 * @param oExpression.value Expression low value
		 * @param oExpression.high Expression high value
		 * @returns undefined
		 */
		this.update = function(oExpression) {
			checkHighValue(oExpression.high, oExpression.operator);
			sName = oExpression.name;
			sOperator = oExpression.operator;
			sValue = oExpression.value;
			sHighValue = oExpression.high;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterExpression#updateValue
		 * @description Do not use. Not part of the APF API. Method should only be
		 *              called internally by APF.
		 * @param {string} value The new value for the expression
		 * @param {string} high The new high value for the expression
		 * @returns undefined
		 */
		this.updateValue = function(value, high) {
			sValue = value;
			if (high !== undefined) {
				sHighValue = high;
			}
			checkHighValue(sHighValue, sOperator);
		};
		function checkHighValue(high, operator) {
			if (!operator) {
				return;
			}
			if (operator === sap.apf.core.constants.FilterOperators.BT && (high === null || high === undefined)) {
				oMessageHandler.check(false, "sap.apf.utils.FilterExpression: High value needed for 'between' selection");
			} else if (operator !== sap.apf.core.constants.FilterOperators.BT && (high !== null && high !== undefined)) {
				oMessageHandler.check(false, "sap.apf.utils.FilterExpression: High value only needed for 'between' selection");
			}
		}
	};
}());
