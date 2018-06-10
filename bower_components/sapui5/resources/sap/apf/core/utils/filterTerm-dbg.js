/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2015 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.apf.core.utils.filterTerm');
jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.require('sap.apf.utils.utils');
(function() {
	'use strict';
	/**
	 * @private
	 * @class This class implements a simple term in a filter in the form (property,
	 *        operator, value). It is used by sap.apf.core.utils.Filter.
	 * @param {sap.apf.core.MessageHandler} oMsgHandler
	 * @param {string} propertyName This is the property name of the term. Property name here relates
	 *            to oData and corresponds to a field/attribute/column name of an analytical
	 *            view.
	 * @param {string} operatorName Is the operator name. Operator must be a value of
	 *            {sap.apf.core.constants.FilterOperators}.
	 * @param {string|number|boolean|Date} value Some constant value like 1000 or 'Jan'.
	 * @param {string|number|boolean|Date} highvalue required, if operator is BT.
	 * @returns {sap.apf.core.utils.FilterTerm}
	 */
	sap.apf.core.utils.FilterTerm = function(oMsgHandler, propertyName, operatorName, value, highValue) {
		this.type = "filterTerm";
		this.propertyName = propertyName;
		this.operator = operatorName;
		this.value = value; // value can be string or number
		this.highValue = highValue;
		this.messageHandler = oMsgHandler;
		if (this.operator.length == 2) {
			this.operator = this.operator.toUpperCase();
		}
		// do some checks
		oMsgHandler.check(this.operator !== undefined, "sap.apf.utils.FilterTerm.constructor operator undefined");
		oMsgHandler.check(jQuery.inArray(this.operator, sap.apf.core.constants.aSelectOpt) > -1, "sap.apf.core.utils.FilterTerm operator " + this.operator + " not supported");
		oMsgHandler.check(this.propertyName !== undefined, "sap.apf.utils.core.FilterTerm propertyName undefined");
		oMsgHandler.check(this.value !== undefined, "sap.apf.utils.FilterTerm value undefined");
	};
	/**
	 * @description The method checks if "property EQ value" is logically consistent with this filter term.
	 * @param {string} property The property for the value.
	 * @param {string|number|boolean|Date} value The value to be checked.
	 * @returns {boolean} bContained Returns true, if the value is consistent.
	 *          Otherwise false. If the property differs, then true is returned,
	 *          because the filter term holds no restriction on the property.
	 */
	sap.apf.core.utils.FilterTerm.prototype.isConsistentWithFilter = function (property, valueChecked) {
		var prefix;
		var index;
		if (property !== this.propertyName) {
			return true;
		}
		if (this.operator === sap.apf.core.constants.FilterOperators.EQ) {
			if (this.value instanceof Date && valueChecked instanceof Date) {
				return (this.value.valueOf() === valueChecked.valueOf());
			}
			return (this.value === valueChecked);
		} else if (this.operator === sap.apf.core.constants.FilterOperators.LT) {
			if (this.value instanceof Date && valueChecked instanceof Date) {
				return (this.value.valueOf() > valueChecked.valueOf());
			}
			return (this.value > valueChecked);
		} else if (this.operator === sap.apf.core.constants.FilterOperators.LE) {
			if (this.value instanceof Date && valueChecked instanceof Date) {
				return (this.value.valueOf() >= valueChecked.valueOf());
			}
			return (this.value >= valueChecked);
		} else if (this.operator === sap.apf.core.constants.FilterOperators.GT) {
			if (this.value instanceof Date && valueChecked instanceof Date) {
				return (this.value.valueOf() < valueChecked.valueOf());
			}
			return (this.value < valueChecked);
		} else if (this.operator === sap.apf.core.constants.FilterOperators.BT) {
			if (this.value instanceof Date && valueChecked instanceof Date) {
				return (this.value.valueOf() <= valueChecked.valueOf() && valueChecked.valueOf() <= this.highValue.valueOf());
			}
			return (this.value <= valueChecked && valueChecked <= this.highValue);
		} else if (this.operator === sap.apf.core.constants.FilterOperators.GE) {
			if (this.value instanceof Date && valueChecked instanceof Date) {
				return (this.value.valueOf() <= valueChecked.valueOf());
			}
			return (this.value <= valueChecked);
		} else if (this.operator === sap.apf.core.constants.FilterOperators.NE) {
			if (this.value instanceof Date && valueChecked instanceof Date) {
				return !(this.value.valueOf() === valueChecked.valueOf());
			}
			return !(this.value === valueChecked);
		} else if (this.operator === sap.apf.core.constants.FilterOperators.StartsWith) {
			if (this.value.length > valueChecked.length) {
				return false;
			}
			prefix = valueChecked.slice(0, this.value.length);
			return (prefix === this.value);
		} else if (this.operator === sap.apf.core.constants.FilterOperators.EndsWith) {
			if (this.value.length > valueChecked.length) {
				return false;
			}
			prefix = valueChecked.slice(-this.value.length);
			return (prefix === this.value);
		} else if (this.operator === sap.apf.core.constants.FilterOperators.Contains) {
			index = valueChecked.indexOf(this.value);
			return (index > -1);
		}
	};
	/**
	 * @description Transforms the object into a string, that can be used in the
	 *              filter part of an odata request.
	 * @param {object} conf Configuration for returning the result.
	 * @param conf.formatValue callback function for correct rendering of the value. The callback function is called with property and value.
	 * @returns {string} expression that represents the filterterm
	 */
	sap.apf.core.utils.FilterTerm.prototype.toUrlParam = function (conf) {
		var strDelimiter = "'";
		var spaceCharacter = " ";
		var param = "";
		var value, hvalue;
		if (conf && conf.formatValue) {
			value = conf.formatValue(this.propertyName, this.value);
			if (this.highValue) {
				hvalue = conf.formatValue(this.propertyName, this.highValue);
			}
		} else {
			if (typeof this.value === 'number') {
				value = this.value;
			} else {
				value = strDelimiter + sap.apf.utils.escapeOdata(this.value) + strDelimiter;
			}
			if (this.highValue) {
				if (typeof this.value === 'number') {
					hvalue = this.highValue;
				} else {
					hvalue = strDelimiter + sap.apf.utils.escapeOdata(this.highValue) + strDelimiter;
				}
			}
		}
		if (this.operator === sap.apf.core.constants.FilterOperators.StartsWith) {
			param = 'startswith(' + sap.apf.utils.escapeOdata(this.propertyName) + ',' + value + ')';
			param = jQuery.sap.encodeURL(param);
		} else if (this.operator === sap.apf.core.constants.FilterOperators.EndsWith) {
			param = 'endswith(' + sap.apf.utils.escapeOdata(this.propertyName) + ',' + value + ')';
			param = jQuery.sap.encodeURL(param);
		} else if (this.operator === sap.apf.core.constants.FilterOperators.Contains) {
			// substringof is odata 2.0, and contains will be odata 4.0
			param = 'substringof(' + value + ',' + sap.apf.utils.escapeOdata(this.propertyName) + ')';
			param = jQuery.sap.encodeURL(param);
		} else if (this.operator === sap.apf.core.constants.FilterOperators.BT) {
			param = '((' + jQuery.sap.encodeURL(sap.apf.utils.escapeOdata(this.propertyName) + spaceCharacter + "ge" + spaceCharacter + value) + ')' + jQuery.sap.encodeURL(spaceCharacter + 'and' + spaceCharacter) + '('
				+ jQuery.sap.encodeURL(sap.apf.utils.escapeOdata(this.propertyName) + spaceCharacter + "le" + spaceCharacter + hvalue) + '))';
		} else {
			param = '(' + jQuery.sap.encodeURL(sap.apf.utils.escapeOdata(this.propertyName) + spaceCharacter + this.operator.toLowerCase() + spaceCharacter + value) + ')';
		}
		return param;
	};
	/**
	 * @description Returns the property.
	 * @returns {string} property
	 */
	sap.apf.core.utils.FilterTerm.prototype.getProperty = function () {
		return this.propertyName;
	};
	/**
	 * @description Returns the operator.
	 * @returns {string} op
	 */
	sap.apf.core.utils.FilterTerm.prototype.getOp = function () {
		return this.operator;
	};
	/**
	 * @description Returns the value.
	 * @returns {string|number|boolean} value
	 */
	sap.apf.core.utils.FilterTerm.prototype.getValue = function () {
		return this.value;
	};
	/**
	 * @description Returns the high value (.
	 * @returns {string|number|boolean} value
	 */
	sap.apf.core.utils.FilterTerm.prototype.getHighValue = function () {
		return this.highValue;
	};
	/**
	 * @description Returns the hash value of the filter term. The hash value is
	 *              needed for simple comparison. The hash uniquely identifies a
	 *              filter term.
	 * @returns {number} hash value - Hash as int32
	 */
	sap.apf.core.utils.FilterTerm.prototype.getHash = function () {
		var sString = this.propertyName + this.operator + this.value;
		if(this.highValue){
			sString += this.highValue;
		}
		return sap.apf.utils.hashCode(sString);
	};
	/**
	 * @description Copy constructor.
	 * @returns {sap.apf.core.utils.FilterTerm} Fiterterm
	 */
	sap.apf.core.utils.FilterTerm.prototype.copy = function () {
		return new sap.apf.core.utils.FilterTerm(this.messageHandler, this.propertyName, this.operator, this.value, this.highValue);
	};
	/**
	 * @description This function either returns undefined, if the filter term
	 *              is defined for the property or a copy of itself, if not.
	 * @param {string|string[]} property This is either a property or an array of properties.
	 *            If it is an array, then the test is done against each of the
	 *            properties.
	 * @returns {undefined|sap.apf.core.utils.FilterTerm} oFilterTerm Returns
	 *          filter term or undefined, if the property equals the property of
	 *          the filter term.
	 */
	sap.apf.core.utils.FilterTerm.prototype.removeTermsByProperty = function (property) {
		return this.internalRemoveTermsByProperty(property);
	};
	/**
	 * @description This function either returns undefined, if the filter term
	 *              is defined for the property or a copy of itself, if not.
	 * @param {string|string[]} property This is either a property or an array of properties.
	 *            If it is an array, then the test is done against each of the
	 *            properties.
	 * @returns {undefined|sap.apf.core.utils.FilterTerm} oFilterTerm Returns
	 *          filter term or undefined, if the property equals the property of
	 *          the filter term.
	 */
	sap.apf.core.utils.FilterTerm.prototype.internalRemoveTermsByProperty = function (property) {
		var i = 0;
		var len = 0;
		if (property instanceof Array) {
			len = property.length;
			for (i = 0; i < len; i++) {
				if (this.propertyName === property[i]) {
					return undefined;
				}
			}
			// not found - return copy
			return this.copy();
		}
		if (this.propertyName === property) {
			return undefined;
		}
		return this.copy();
	};
	/**
	 * @description This function either returns undefined, if the filter term
	 *              is defined for the property or a copy of itself, if not.
	 * @param {string|string[]} property This is either a property or an array of properties.
	 *            If it is an array, then the test is done against each of the
	 *            properties.
	 * @param {string} option option
	 * @param {boolean|number|string} value Value of the expression.
	 * @returns {sap.apf.core.utils.FilterTerm|undefined} oFilterTerm The filter
	 *          term or undefined is returned, if the property equals the
	 *          property of the filter term.
	 */
	sap.apf.core.utils.FilterTerm.prototype.removeTerms = function (property, option, value) {
		var i = 0;
		var len = 0;
		if (property instanceof Array) {
			len = property.length;
			for (i = 0; i < len; i++) {
				if (this.propertyName === property[i] && this.operator === option && this.value === value) {
					return undefined;
				}
			}
			// not found - return copy
			return this.copy();
		}
		if (this.propertyName === property && this.operator === option && this.value === value) {
			return undefined;
		}
		return this.copy();
	};
	/*
	 * returns an object, that is similar to constructor for sap ui5 filter
	 */
	sap.apf.core.utils.FilterTerm.prototype.mapToSapUI5FilterExpression = function () {
		if (this.operator === sap.apf.core.constants.FilterOperators.BT) {
			return new sap.ui.model.Filter({
			    path: this.propertyName,
			    operator: this.operator,
			    value1: this.value,
			    value2: this.highValue
			  });
		}
		return new sap.ui.model.Filter({
			    path: this.propertyName,
			    operator: this.operator,
			    value1:this.value
			  });
	};
	/**
	 * Structural traversal and application of a visitor, base case for FilterTerm.
	 * @param {*} visitor - A visitor.
	 * 		Shall at lest provide the following method:
	 * 			processTerm({sap.apf.core.utils.FilterTerm}),
	 * @returns {*}
	 */
	sap.apf.core.utils.FilterTerm.prototype.traverse = function(visitor) {
		return visitor.processTerm(this);
	};
}());
