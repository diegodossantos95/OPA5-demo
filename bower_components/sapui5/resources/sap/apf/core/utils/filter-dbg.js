/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap, jQuery */
/**
 * internally used filter object
 */
jQuery.sap.declare('sap.apf.core.utils.filter');
jQuery.sap.require('sap.apf.core.utils.filterTerm');
jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.require('sap.ui.model.Filter');
(function() {
	'use strict';
	/**
	 * @private
	 * @class Expression on properties for the filter of an odata request. Filters
	 *        represent an expression on properties for the filter of an odata
	 *        request. Allowed constructor calls are:
	 *        sap.apf.core.utils.Filter(oMsgHandler, property, op, value) or
	 *        sap.apf.core.utils.Filter(oMsgHandler, new sap.apf.core.utils.FilterTerm(...)) or
	 *        sap.apf.core.utils.Filter(oMsgHandler,new sap.apf.core.utils.Filter(...)).
	 * @param {sap.apf.core.MessageHandler} oMsgHandler
	 * @param {string|sap.apf.core.utils.Filter|sap.apf.core.utils.FilterTerm} arg1 - First argument is either a Filter or a FilterTerm or a property of a filter term
	 * @param {string} arg2 - if param arg2 is supplied, then an operator is expected , a property for arg1 and a value for arg3. Example: 'Country' 'EQ' 'BRA'
	 * @param {string} arg3 - value
	 * @param {string} arg4 - high-value
	 */
	var cLogicalAndText = "%20and%20";
	var cLogicalOrText = "%20or%20";
	sap.apf.core.utils.Filter = function(oMsgHandler, arg1, arg2, arg3, arg4) {
		this.type = "internalFilter"; //sap.utils.filter has type filter
		this.messageHandler = oMsgHandler;

		if (arg1 && (arg1 instanceof sap.apf.core.utils.FilterTerm || arg1 instanceof sap.apf.core.utils.Filter)) {
			this.leftExpr = arg1;
		} else if (arg1 !== undefined && arg2 !== undefined && arg3 !== undefined) {
			this.leftExpr = new sap.apf.core.utils.FilterTerm(oMsgHandler, arg1, arg2, arg3, arg4);
		} else if (arg1 !== undefined || arg2 !== undefined || arg3 !== undefined) {
			oMsgHandler.check(false, "wrong arguments in construction of sap.apf.core.utils.Filter");
		}
		/**
		 * @description this array holds the further parts of the filter
		 *              expression
		 */
		this.restExpr = [];
	};// Filter class
	/**
	 * @description Returns the properties of the sub filters
	 * @returns {string[]} aProperties Array with property (names), that are used in the filter.
	 */
	sap.apf.core.utils.Filter.prototype.getProperties = function() {
		var i;
		var aProperty = [];
		var aProperty2 = [];
		var property = "";
		if (this.leftExpr === undefined) {
			return aProperty;
		}
		if (this.leftExpr instanceof sap.apf.core.utils.FilterTerm) {
			property = this.leftExpr.getProperty();
			aProperty.push(property);
		} else if (this.leftExpr instanceof sap.apf.core.utils.Filter) {
			aProperty = this.leftExpr.getProperties();
		}
		for(i = 0; i < this.restExpr.length; i++) {
			if (this.restExpr[i] instanceof sap.apf.core.utils.FilterTerm) {
				aProperty.push(this.restExpr[i].getProperty());
			} else {
				aProperty2 = this.restExpr[i].getProperties();
				aProperty = aProperty.concat(aProperty2);
			}
		}
		return sap.apf.utils.eliminateDuplicatesInArray(this.messageHandler, aProperty);
	};
	/**
	 * @description Copy constructor
	 * @returns {sap.apf.core.utils.Filter} Filter New object as deep copy
	 */
	sap.apf.core.utils.Filter.prototype.copy = function() {
		var oFilter;
		var i;
		if (this.leftExpr === undefined) {
			return new sap.apf.core.utils.Filter(this.messageHandler);
		}
		oFilter = new sap.apf.core.utils.Filter(this.messageHandler, this.leftExpr);
		if (this.levelOperator === undefined) {
			return oFilter;
		}
		for(i = 0; i < this.restExpr.length; i++) {
			if (this.levelOperator === sap.apf.core.constants.BooleFilterOperators.AND) {
				oFilter.addAnd(this.restExpr[i].copy());
			} else {
				oFilter.addOr(this.restExpr[i].copy());
			}
		}
		return oFilter;
	};
	/**
	 * @description Returns true if the filter is empty, meaning it is not AND or OR and it does not contain any logical constraint.
	 * Technically it is a tree not containing any FilterTerm.
	 * @returns {boolean}
	 */
	sap.apf.core.utils.Filter.prototype.isEmpty = function() {
		if (this.leftExpr === undefined) {
			return true;
		}
		if ( this.leftExpr instanceof sap.apf.core.utils.FilterTerm) {
			return false;
		}
		if ( !this.leftExpr.isEmpty() ) {
			return false;
		}
		if ( this.restExpr.length === 0) {
			return true;
		}
		// AND or OR node
		var i;
		for (i = 0; i < this.restExpr.length; ++i ) {
			if ( !this.restExpr[i].isEmpty() ) { // this is the most probable case, important for efficiency
				return false;
			}
		}
		return true; // no match of FilterTerm
	};
	/**
	 * Returns true only if the Filter is an OR-Node and therefore non-empty, too.
	 * @returns {boolean}
	 */
	sap.apf.core.utils.Filter.prototype.isOr = function() {
		if (this.levelOperator === sap.apf.core.constants.BooleFilterOperators.OR) {
			return true;
		} else if (this.levelOperator === sap.apf.core.constants.BooleFilterOperators.AND ) {
			return false;
		}
		if (this.leftExpr) {
			if (this.leftExpr instanceof sap.apf.core.utils.Filter) {
				return this.leftExpr.isOr();
			}
		}
		return false;
	};
	/**
	 * @description Test on equality of two filters. Two filters are identical, if they have the same filter terms connected with the same operators.
	 * Commutative and associative law are considered.
	 * @param {sap.apf.core.utils.Filter} oFilter to compare with
	 * @returns {boolean} true  if filters are identical.
	 */
	sap.apf.core.utils.Filter.prototype.isEqual = function(oFilter) {
		if (this === oFilter) {
			return true;
		}
		if (oFilter === undefined) {
			return false; // never equal to a undefined
		}
		return this.getHash() === oFilter.getHash();
	};
	/**
	 * @description Compute hash for the filter object. Needed for compare with
	 *              other filter
	 * @param {number} iLevelOfExpression level in the expression structure.
	 * @returns {number} hashvalue Hash as number.
	 */
	sap.apf.core.utils.Filter.prototype.getHash = function(iLevelOfExpression) {
		var nCurrentLevel = iLevelOfExpression || 1;
		var nNextLevel = 0;
		if (this.restExpr.length === 0) {
			nNextLevel = nCurrentLevel;
		} else {
			nNextLevel = nCurrentLevel + 1;
		}
		if (this.leftExpr === undefined) {
			return 0;
		}
		var iHash = this.leftExpr.getHash(nNextLevel);
		var i;
		if (this.levelOperator === undefined) {
			return iHash;
		}
		if (this.levelOperator === sap.apf.core.constants.BooleFilterOperators.AND) {
			iHash = iHash + Math.pow(2, nCurrentLevel); // hash for and on this level = 2,4,8
		} else if (this.levelOperator === sap.apf.core.constants.BooleFilterOperators.OR) {
			iHash = iHash + Math.pow(3, nCurrentLevel); // = hash + 3,9,27,,...
		}
		for(i = 0; i < this.restExpr.length; i++) {
			iHash = iHash + this.restExpr[i].getHash(nNextLevel);
		}
		return iHash;
	};
	/**
	 * @description Get all terms for a filter per property.
	 * @param {string} property
	 *            This is the property, for which the terms are requested
	 * @returns {sap.apf.core.utils.FilterTerm[]} filterTerms An array with filter terms.
	 */
	sap.apf.core.utils.Filter.prototype.getFilterTermsForProperty = function(property) {
		var aTerm = [];
		var i;
		if (this.leftExpr === undefined) {
			return aTerm;
		}
		if (this.leftExpr instanceof sap.apf.core.utils.Filter) {
			aTerm = this.leftExpr.getFilterTermsForProperty(property);
		} else if (property === this.leftExpr.getProperty()) {
			aTerm.push(this.leftExpr);
		}
		for(i = 0; i < this.restExpr.length; i++) {
			if (this.restExpr[i] instanceof sap.apf.core.utils.FilterTerm) {
				if (property === this.restExpr[i].getProperty()) {
					aTerm.push(this.restExpr[i]);
				}
			} else {
				aTerm = aTerm.concat(this.restExpr[i].getFilterTermsForProperty(property));
			}
		}
		return aTerm;
	};
	/**
	 * Returns all filter terms recursively contained in the filter tree.
	 * Empty filters (filter w/o a filterTerm) are eliminated.
	 * @returns {{sap.apf.core.utils.Filter|sap.apf.core.utils.FilterTerm}[]} note 2 types are in array
	 */
	sap.apf.core.utils.Filter.prototype.getFilterTerms = function() {
		var aTerm = [];
		var i;
		if (this.leftExpr === undefined) {
			return aTerm;
		}
		if (this.leftExpr instanceof sap.apf.core.utils.Filter) {
			aTerm = this.leftExpr.getFilterTerms();
		} else {
			aTerm.push(this.leftExpr); // assumed to be a FilterTerm
		}
		for(i = 0; i < this.restExpr.length; i++) {
			if (this.restExpr[i] instanceof sap.apf.core.utils.FilterTerm) {
				aTerm.push(this.restExpr[i]);
			} else {
				aTerm = aTerm.concat(this.restExpr[i].getFilterTerms());
			}
		}
		return aTerm;
	};

	/**
	 * @description This is a test whether the given value of the given property satisfies the filter.
	 * 		Logically, the method implements a test if: Filter(this) AND (property EQ value) is consistent.
	 * 		Thereby, the empty filter is a neutral element (can be eliminated without changing the result).
	 * 		Furthermore, teh method returns true when the given property is disjoint with all properties in the filter (this).
	 * @param {string} property
	 *            This is either a single property or an array of properties.
	 * @param {boolean|string|number} value
	 *            This is either a value, if property is a single property or a
	 *            json object with pairs (property, value), if parameter property is of type array.
	 * @returns {boolean}
	 */
	sap.apf.core.utils.Filter.prototype.isConsistentWithFilter = function(property, value) {
		var i;
		var isConstrained = false;
		if (this.leftExpr === undefined) {
			return true; // no restriction
		}
		if (this.levelOperator === undefined) { // is wrapper around Filter
			return this.leftExpr.isConsistentWithFilter(property, value);
		}
		if (this.levelOperator === sap.apf.core.constants.BooleFilterOperators.AND) {
			if (!this.leftExpr.isConsistentWithFilter(property, value)) {
				return false;
			}
			for(i = 0; i < this.restExpr.length; i++) {
				if (!this.restExpr[i].isConsistentWithFilter(property, value)) {
					return false;
				}
			}
			return true;
		}
		if (this.levelOperator === sap.apf.core.constants.BooleFilterOperators.OR) {
			// when the property if not in the left branch then isConsistentWithFilter would return true.
			// but the other branches may still put a constraint.
			if (isPropertyMatch(this.leftExpr, property)) {  // note: creates O(n**2) complexity. to be optimized when performance is bad.
				isConstrained = true;
				if(this.leftExpr.isConsistentWithFilter(property, value)) {
					return true;
				}
			}
			for(i = 0; i < this.restExpr.length; i++) {
				if (isPropertyMatch(this.restExpr[i], property)) {
					isConstrained = true;
					if(this.restExpr[i].isConsistentWithFilter(property, value)) {
						return true;
					}
				}
			}
			// all subtrees processed, isConstrained===true then matched property, by no value match. Thus return false.
			// isConstrained===false means value is valid since not contrained, thus return true.
			return !isConstrained;

		}
		/*
		 * Returns true if the property is not disjoint from the filter's properties. Abstracts the filter type.
		 */
		function isPropertyMatch(filter, property) {
			if (filter instanceof sap.apf.core.utils.FilterTerm) {
				return filter.getProperty() === property ;
			}
			return filter.getProperties().indexOf(property) >= 0;
		}
	};
	/**
	 * @description Eliminates terms of the expression, that are defined for the
	 *              property
	 * @param {string} property
	 *           This  is the property, for which the terms are. If property is an
	 *            array, then the terms are removed for all properties.
	 * @returns {sap.apf.core.utils.Filter} oFilterExpression This is the filter without
	 *          filter terms on property, could also be an empty filter
	 */
	sap.apf.core.utils.Filter.prototype.removeTermsByProperty = function(property) {
		var filter = this.internalRemoveTermsByProperty(property);
		if(filter === undefined){
			return new sap.apf.core.utils.Filter(this.messageHandler);
		}
		return filter;
	};
	/**
	 * @description Eliminates terms of the expression, that are defined for the
	 *              property
	 * @param {string} property
	 *           This  is the property, for which the terms are. If property is an
	 *            array, then the terms are removed for all properties.
	 * @returns {sap.apf.core.utils.Filter | undefined} oFilterExpression This is the filter without
	 *          filter terms on property. Could return undefined.
	 */
	sap.apf.core.utils.Filter.prototype.internalRemoveTermsByProperty = function(property) {
		var i, oResultFilter, oReducedRestFilter;
		if (this.leftExpr === undefined) {
			return this.copy();
		}
		oResultFilter = this.leftExpr.internalRemoveTermsByProperty(property);
		if (oResultFilter instanceof sap.apf.core.utils.FilterTerm) {
			oResultFilter = new sap.apf.core.utils.Filter(this.messageHandler, oResultFilter.getProperty(), oResultFilter.getOp(), oResultFilter.getValue(), oResultFilter.getHighValue());
		}
		if (this.levelOperator === undefined) {
			return oResultFilter;
		}
		for(i = 0; i < this.restExpr.length; i++) {
			oReducedRestFilter = this.restExpr[i].internalRemoveTermsByProperty(property);
			if (oResultFilter === undefined) {
				if (oReducedRestFilter instanceof sap.apf.core.utils.FilterTerm) {
					oResultFilter = new sap.apf.core.utils.Filter(this.messageHandler, oReducedRestFilter);
				} else {
					oResultFilter = oReducedRestFilter;
				}
			} else if (oReducedRestFilter !== undefined) {
				if (this.levelOperator === sap.apf.core.constants.BooleFilterOperators.AND) {
					oResultFilter.addAnd(oReducedRestFilter);
				} else {
					oResultFilter.addOr(oReducedRestFilter);
				}
			}
		}
		if (oResultFilter) {
			return new sap.apf.core.utils.Filter(this.messageHandler, oResultFilter);
		}
	};
	/**
	 * @description Eliminates terms of the expression, that are defined for the
	 *              property
	 * @param {string} property
	 *            This is the property, for which the terms are. If property is an
	 *            array, then the terms are removed for all properties.
	 * @param {string} option
	 * @param {string|boolean|value} value
	 * @returns {sap.apf.core.utils.Filter} oFilterExpression This is the filter expression without
	 *          filter terms on property.
	 */
	sap.apf.core.utils.Filter.prototype.removeTerms = function(property, option, value) {
		var i;
		if (this.leftExpr === undefined) {
			return this.copy();
		}
		var oFilter = this.leftExpr.removeTerms(property, option, value);
		var oFilter2;
		if (oFilter instanceof sap.apf.core.utils.FilterTerm) {
			oFilter = new sap.apf.core.utils.Filter(this.messageHandler, oFilter.getProperty(), oFilter.getOp(), oFilter.getValue(), oFilter.getHighValue());
		}
		if (this.levelOperator === undefined) {
			return oFilter;
		}
		for(i = 0; i < this.restExpr.length; i++) {
			oFilter2 = this.restExpr[i].removeTerms(property, option, value);
			if (oFilter === undefined) {
				if (oFilter2 instanceof sap.apf.core.utils.FilterTerm) {
					oFilter = new sap.apf.core.utils.Filter(this.messageHandler, oFilter2);
				} else {
					oFilter = oFilter2;
				}
			} else if (oFilter2 !== undefined) {
				if (this.levelOperator === sap.apf.core.constants.BooleFilterOperators.AND) {
					oFilter.addAnd(oFilter2);
				} else {
					oFilter.addOr(oFilter2);
				}
			}
		}
		return oFilter;
	};
	/**
	 * @description add a new filter connected with OR
	 * @param {string|sap.apf.core.utils.Filter|sap.apf.core.utils.FilterTerm} arg1 -
	 *            Filter or filter term or property.
	 * @param {string} [arg2] operator, This makes only sense, if first argument is a property
	 * @param {boolean|string|number} [arg3] Value, if first argument is property and second argument is operator
	 * @param {string} arg4 high-value
	 * @returns {sap.apf.core.utils.Filter} this for method chaining.
	 */
	sap.apf.core.utils.Filter.prototype.addOr = function(arg1, arg2, arg3, arg4) {
		var oFilter;
		if (arg1 instanceof sap.apf.core.utils.Filter || arg1 instanceof sap.apf.core.utils.FilterTerm) {
			oFilter = arg1;
		} else if (arg1 !== undefined && arg2 !== undefined && arg3 !== undefined) {
			oFilter = new sap.apf.core.utils.FilterTerm(this.messageHandler, arg1, arg2, arg3, arg4);
		} else {
			this.messageHandler.check(false, "sap.apf.core.utils.Filter.addOr: wrong arguments in construction of  Filter");
		}
		if (this.leftExpr === undefined) {
			this.leftExpr = oFilter;
			return this;
		}
		if (this.levelOperator === undefined) {
			this.levelOperator = sap.apf.core.constants.BooleFilterOperators.OR;
		}
		this.restExpr.push(oFilter);
		this.messageHandler.check(this.levelOperator === sap.apf.core.constants.BooleFilterOperators.OR, "sap.apf.core.utils.Filter - addOr wrong operation");
		return this;
	};
	/**
	 * @description Add a new filter expression connected with AND
	 * @param {string|sap.apf.core.utils.Filter|sap.apf.core.utils.FilterTerm} arg1 - Filter or filter term or property.
	 * @param {string} [arg2] operator, This makes only sense, if first argument is a property
	 * @param {boolean|string|number} [arg3] Value, if first argument is property and second argument is operator
	 * @param {string} arg4 high-value
	 * @returns {sap.apf.core.utils.Filter} this For method chaining.
	 */
	sap.apf.core.utils.Filter.prototype.addAnd = function(arg1, arg2, arg3, arg4) {
		var oFilter;
		if (arg1 instanceof sap.apf.core.utils.Filter || arg1 instanceof sap.apf.core.utils.FilterTerm) {
			oFilter = arg1;
		} else if (arg1 !== undefined && arg2 !== undefined && arg3 !== undefined) {
			oFilter = new sap.apf.core.utils.FilterTerm(this.messageHandler, arg1, arg2, arg3, arg4);
		} else {
			this.messageHandler.check(false, "sap.apf.core.utils.Filter.addAnd: wrong arguments in construction of  Filter");
		}
		if (this.leftExpr === undefined) {
			this.leftExpr = oFilter;
			return this;
		}
		if (this.levelOperator === undefined) {
			this.levelOperator = sap.apf.core.constants.BooleFilterOperators.AND;
		}
		this.messageHandler.check(this.levelOperator === sap.apf.core.constants.BooleFilterOperators.AND, "sap.apf.core.utils.Filter - addAnd wrong operation");
		this.restExpr.push(oFilter);
		return this;
	};
	/**
	 * @description Transforms the filter into parameters for the URL in odata format suitable for xs engine
	 * @param conf configuration object.
	 * @param conf.formatValue callback function for correct rendering of the value. The callback function is called with
	 * property and value.
	 * @returns {string} expression that represents the filter
	 */
	sap.apf.core.utils.Filter.prototype.toUrlParam = function(conf) {
		var sExpr = "";
		if (this.leftExpr === undefined) {
			return "";
		}
		sExpr = this.leftExpr.toUrlParam(conf);
		var i = 0;
		var len = this.restExpr.length;
		var sConnector = "";
		if (len === 0) {
			return sExpr;
		}
		if (this.levelOperator === sap.apf.core.constants.BooleFilterOperators.AND) {
			sConnector = cLogicalAndText;
		} else {
			sConnector = cLogicalOrText;
		}
		var sRest = "";
		for(i = 0; i < len; i++) {
			sRest = this.restExpr[i].toUrlParam(conf);
			if (sExpr === "") {
				sExpr = sRest;
			} else if (sRest !== "") {
				sExpr = sExpr + sConnector + sRest;
			}
		}
		if(sExpr === "" ){
			return "";
		}
		return '(' + sExpr + ')';
	};
	/**
	 * creates an object, that is similar to the sap.ui5.model.Filter
	 */
	sap.apf.core.utils.Filter.prototype.mapToSapUI5FilterExpression = function() {
		var i, expression, aFilters = [];
		if (this.leftExpr === undefined) {
			return new sap.ui.model.Filter({filters: [], and: undefined});
		}
		if (this.restExpr.length === 0) {
			return this.leftExpr.mapToSapUI5FilterExpression();
		}
		if(!(this.leftExpr.type === "internalFilter" && this.leftExpr.isEmpty())){
			aFilters.push(this.leftExpr.mapToSapUI5FilterExpression());
		}
		for(i = 0; i < this.restExpr.length; i++) {
			if(!(this.restExpr[i].type === "internalFilter" && this.restExpr[i].isEmpty())){
				aFilters.push(this.restExpr[i].mapToSapUI5FilterExpression());
			}
		}
		expression = {
				aFilters : aFilters,
				bAnd : this.levelOperator === sap.apf.core.constants.BooleFilterOperators.AND
		};
		var resultFilter = new sap.ui.model.Filter({filters: expression.aFilters, and: expression.bAnd});
		// set bAnd explicitly, because boolean false is handled as undefined by sap.ui.model.Filter (this may lead to inconsistencies for apf applications)
		resultFilter.bAnd = expression.bAnd;
		return resultFilter;
	};
	/**
	 * @description Overwrites properties and adds new properties if they are not already existing
	 *  with new properties or/and properties, which overwrite the current ones.
	 * @param {sap.apf.core.utils.Filter} oFilter Filter, that holds the properties for the overwriting.
	 * @returns {sap.apf.core.utils.Filter} merged filter object
	 */
	sap.apf.core.utils.Filter.prototype.overwriteWith = function(oFilter) {
		var aPropertyNames = oFilter.getProperties();
		var oResultFilter;
		if (aPropertyNames.length !== 0) {
			oResultFilter = this.removeTermsByProperty(aPropertyNames);
			if (oResultFilter === undefined) {
				return oFilter.copy();
			}
			oResultFilter.addAnd(oFilter);
			return oResultFilter;
		}
		return this.copy();
	};
	/**
	 * @description removes all properties from the filter, that have not been requested
	 * @param {string[]} aProperties requested properties: Can be a single string for a single property, a list of parameters for single properties or an array of property strings
	 * @returns {sap.apf.core.utils.Filter} new filter object which has only the requested properties
	 */
	sap.apf.core.utils.Filter.prototype.restrictToProperties = function(aProperties) {

		//noinspection JSLint
		var aFilterPropertiesToBeRemoved = setAminusSetB(this.getProperties(), aProperties);
		//in case all terms are removed method 'removeTermsByProperty()' returns 'undefined', so we will need the OR part:
		return this.copy().removeTermsByProperty(aFilterPropertiesToBeRemoved) || new sap.apf.core.utils.Filter(this.messageHandler);
		//noinspection JSLint
		function setAminusSetB(aSetA, aSetB) {
			var i;
			var result = [];
			var hashB = {};
			var lengthA = aSetA ? aSetA.length : 0;
			var lengthB = aSetB ? aSetB.length : 0;
			for(i = 0; i < lengthB; i++) {
				hashB[aSetB[i]] = undefined;
			}
			for(i = 0; i < lengthA; i++) {
				if (!(aSetA[i] in hashB)) {
					result.push(aSetA[i]);
				}
			}
			return result;
		}
	};
	/**
	 * Returns true if and only if this Filter instance represents a single FilterTerm only.
	 * Note that if it returns true leftExpr not necessarily points to a FilterTerm, but may point to a Filter.
	 * @returns {boolean}
	 */
	sap.apf.core.utils.Filter.prototype.isFilterTerm = function() {
		if (this.restExpr.length > 0) {
			return false;
		}
		if (!this.leftExpr) {
			return false;
		}
		if (this.leftExpr instanceof sap.apf.core.utils.FilterTerm ) {
			return true;
		}
		return this.leftExpr.isFilterTerm();
	};
	/**
	 * Structural traversal and application of a visitor to each node.
	 * @param {*} visitor - A visitor.
	 * 		Shall provide the following methods:
	 * 			process({*}),
	 * 			processEmptyFilter(),
	 * 			processTerm({sap.apf.core.utils.FilterTerm}),
	 * 			processAnd({sap.apf.core.utils.Filter}, {sap.apf.core.utils.Filter}[]),
	 * 			processOr({sap.apf.core.utils.Filter}, {sap.apf.core.utils.Filter}[]),
	 * @returns {*}
	 */
	sap.apf.core.utils.Filter.prototype.traverse = function(visitor) {
		if ( !this.leftExpr) {
			return visitor.processEmptyFilter(); // undefined encodes an empty filter
		}
		if (this.leftExpr && this.restExpr.length === 0) {
			if ( this.leftExpr instanceof sap.apf.core.utils.FilterTerm) {
				return visitor.processTerm(this.leftExpr); // FilterTerm
			}
			return this.leftExpr.traverse(visitor); // Filter. This recursion shall unwrap Filter chains on leftExpr
		}
		if (this.levelOperator === sap.apf.core.constants.BooleFilterOperators.AND) {
			return visitor.processAnd(this.leftExpr, this.restExpr, this);
		}
		if (this.levelOperator === sap.apf.core.constants.BooleFilterOperators.OR) {
			return visitor.processOr(this.leftExpr, this.restExpr, this);
		}
		this.messageHandler.check(false, 'undefined case in traverse()');
		return false;
	};

	sap.apf.core.utils.Filter.prototype.isDisjunctionOverEqualities = function(){
		var isDisjunctionOverEqualities = true;

		if(this.levelOperator === sap.apf.core.constants.BooleFilterOperators.AND){
			return false;
		}
		if(this.getProperties().length > 1){
			return false;
		}
		if (this.leftExpr instanceof sap.apf.core.utils.Filter) {
			if(this.leftExpr.getFilterTerms().length > 1 && !this.leftExpr.isOr()){
				return false;
			}
		}
		this.getFilterTerms().forEach(function(filterTerm){
			if(filterTerm.getOp() !== sap.apf.core.constants.FilterOperators.EQ){
				isDisjunctionOverEqualities = false;
			}
		});
		this.restExpr.forEach(function(restExpr){
			if (restExpr instanceof sap.apf.core.utils.Filter) {
				if(restExpr.getFilterTerms().length > 1){
					isDisjunctionOverEqualities = false;
				}
			}
		});

		return isDisjunctionOverEqualities;
	};
	/**
	 * @description Converts the filter to an object containing SelectOptions and Parameters
	 * @param {Function} getAllParameters See {@link sap.apf.core.MetadataFacade#getAllParameterEntitySetKeyProperties}
	 * @returns {jQuery.Deferred.promise} Returns promise which will be resolved with an empty object when called on an empty filter, or with an object containing Parameters and SelectOptions
	 */
	sap.apf.core.utils.Filter.prototype.mapToSelectOptions = function(getAllParameters) {
		var deferred = jQuery.Deferred();
		var parameters;
		var that = this;
		getAllParameters(callback);

		function callback(parameterList){
			parameters = parameterList;
			var visitor = new Visitor();
			visitor.process(that);
			deferred.resolve(visitor.getSelectionVariant());
		}

		/**
		 * @description A Visitor class. Convert the given filter  to an object representing a selection variant. The selection variant contains zero or many select options.
		 * Assumption: The given filter needs to be simplified e.g. needs to be able to be represented as select options
		 * returns {Object | undefined} returns select variant or undefined for an empty filter
		 */
		function Visitor (){
			var selectionVariant = {};
			selectionVariant.SelectOptions = [];
			selectionVariant.Parameters = [];
			function getRangesOfProperty(propertyName){
				var propertySelectOption;
				selectionVariant.SelectOptions.forEach(function(selectOption){
					if(selectOption.PropertyName === propertyName){
						propertySelectOption = selectOption;
					}
				});
				if(!propertySelectOption){
					propertySelectOption = {
							PropertyName : propertyName,
							Ranges : []
					};
					selectionVariant.SelectOptions.push(propertySelectOption);
				}
				return propertySelectOption.Ranges;
			}
			function addProperty(term){
				var op, value;
				var ranges = getRangesOfProperty(term.getProperty());
				if( term.getHighValue() !== undefined && term.getHighValue() !== null){
					ranges.push({
						Sign : 'I',
						Option : term.getOp(),
						Low : term.getValue(),
						High : term.getHighValue()
					});
				} else {
					op = term.getOp();
					value = term.getValue();
					if (op === 'StartsWith') {
						op = 'CP';
						value = value + '*';
					} else if (op === 'EndsWith') {
						op = 'CP';
						value = '*' + value;
					} else if (op === 'Contains') {
						op = 'CP';
						value = '*' + value + '*';
					}
					ranges.push({
						Sign : 'I',
						Option : op,
						Low : value
					});
				}
			}
			function addParameter(term){
				selectionVariant.Parameters.push({
					PropertyName: term.getProperty(),
					PropertyValue: term.getValue()
				});
			}
			this.getSelectionVariant = function () {
				if(selectionVariant.SelectOptions.length > 0 || selectionVariant.Parameters.length > 0){
					return selectionVariant;
				}
				return {};
			};
			this.processEmptyFilter = function() {
				return;
			};
			this.processTerm = function(term) {
				if(jQuery.inArray(term.getProperty(), parameters) === -1){
					addProperty(term);
				} else {
					addParameter(term);
				}
			};
			this.processAnd = function(filter0, aFilters) {
				this.process(filter0);
				aFilters.forEach(function(filter){
					this.process(filter);
				}.bind(this));
			};
			this.processOr = function(filter0, aFilters) {
				this.process(filter0);
				aFilters.forEach(function(filter){
					this.process(filter);
				}.bind(this));
			};
			this.process = function(filter) {
				filter.traverse(this);
			};
		}
		return deferred.promise();
	};
	/**
	 * @private
	 * @description Static function to create a filter object from array with
	 *              objects (in json notation) with given properties. Example:
	 *              aProperties = [country, city], data = [ { country: 'a', city:
	 *              'a1' }, { country: 'b', city: 'b1' }]. This gives: (country =
	 *              'a' and city = 'a1') or (country = 'b' and city = 'b1')
	 * @param {sap.apf.core.MessageHandler} oMsgHandler
	 * @param {string[]} aProperties
	 *            Array with properties
	 * @param {object[]} aData
	 *            Array with data in json format fieldname : value.
	 * @param {number[]} aIndices indices that indicate, which data line is selected
	 * @static
	 */
	sap.apf.core.utils.Filter.createFromArray = function(oMsgHandler, aProperties, aData, aIndices) {
		var fLen = aProperties.length;
		var i;
		var nLine;
		var j;
		var oFilterData;
		var oFilterLine;
		var oFilter;
		oMsgHandler.check(aProperties instanceof Array && aProperties.length > 0, "sap.apf.core.utils.Filter.createFromArray incorrect argument aProperties");
		oMsgHandler.check(aData instanceof Array, "sap.apf.core.utils.Filter.createFromArray incorrect argument aData");
		if (aIndices.length > 0) {
			for(i = 0; i < aIndices.length; ++i) {
				oFilterLine = undefined;
				nLine = aIndices[i];
				if (!aData[nLine]) {
					continue;
				}
				for(j = 0; j < fLen; j++) {
					oFilter = new sap.apf.core.utils.Filter(oMsgHandler, aProperties[j], sap.apf.core.constants.FilterOperators.EQ, aData[nLine][aProperties[j]]);
					if (oFilterLine === undefined) {
						oFilterLine = new sap.apf.core.utils.Filter(oMsgHandler, oFilter);
					} else {
						oFilterLine.addAnd(oFilter);
					}
				}
				if (oFilterData === undefined) {
					oFilterData = new sap.apf.core.utils.Filter(oMsgHandler, oFilterLine);
				} else {
					oFilterData.addOr(oFilterLine);
				}
			}
			return oFilterData;
		}
		// return an empty filter in case of empty selection
		return new sap.apf.core.utils.Filter(oMsgHandler);
	};
	/**
	 * @private
	 * @description Static function to create a filter object that shall express a contradiction
	 *   and lead to an empty data response.
	 * @param {sap.apf.core.MessageHandler} oMsgHandler
	 * @param {string[]} aProperties  property names for the filter.
	 * @returns {sap.apf.core.utils.Filter}
	 * @static
	 */
	sap.apf.core.utils.Filter.createEmptyFilter = function(oMsgHandler, aProperties) {
		oMsgHandler.check(jQuery.isArray(aProperties) && aProperties.length > 0, "sap.apf.core.utils.Filter.createEmptyFilter - array with property names expected");
		return new sap.apf.core.utils.Filter(oMsgHandler, aProperties[0], sap.apf.core.constants.FilterOperators.EQ, '').addAnd(aProperties[0], sap.apf.core.constants.FilterOperators.NE, '');
	};
	/**
	 * @private
	 * @description Static function to transform a UI5 filter object into an internal filter 
	 * @param {sap.apf.core.MessageHandler} oMsgHandler
	 * @param {sap.ui.model.Filter} oUI5Filter UI5 filter 
	 * @returns {sap.apf.core.utils.Filter} APF Core internal filter
	 * @static
	 */
	sap.apf.core.utils.Filter.transformUI5FilterToInternal = function(oMsgHandler, oUI5Filter) {
		return transform(oUI5Filter, oUI5Filter.bAnd);
		function transform(oUI5Filter, bAnd) {
			var result = new sap.apf.core.utils.Filter(oMsgHandler);
			var subTree;
			if (oUI5Filter.aFilters) {
				oUI5Filter.aFilters.forEach(function(filter) {
					if (filter.aFilters) {
						subTree = transform(filter, filter.bAnd);
						if (bAnd) {
							result.addAnd(subTree);
						} else {
							result.addOr(subTree);
						}
					} else if (filter.sPath) { //TODO: sap.apf.core.utils.Filter.mapToSapUI5FilterExpression() creates an empty filter object, therefore an additional check for filter.path is required
						if (bAnd) {
							result.addAnd(filter.sPath, filter.sOperator, filter.oValue1, filter.oValue2);
						} else {
							result.addOr(filter.sPath, filter.sOperator, filter.oValue1, filter.oValue2);
						}
					}
				});
			} else {
				result = new sap.apf.core.utils.Filter(oMsgHandler, oUI5Filter.sPath, oUI5Filter.sOperator, oUI5Filter.oValue1, oUI5Filter.oValue2);
			}
			return result;
		}
	};
}());
