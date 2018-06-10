/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.declare('sap.apf.modeler.ui.utils.viewValidator');
(function() {
	'use strict';
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	/**
	* @class viewValidator
	* @memberOf sap.apf.modeler.ui.utils
	* @name viewValidator
	* @description helps checking for valid state of mandatory controls on a particular view
	* @param Accepts sap.ui.view
	*/
	sap.apf.modeler.ui.utils.ViewValidator = function(view) {
		this.aFieldIds = [];
		this.oView = view;
	};
	sap.apf.modeler.ui.utils.ViewValidator.prototype.constructor = sap.apf.modeler.ui.utils.ViewValidator;
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.viewValidator#stringTypeChecker
	* @returns if a control id is of string type or not
	* */
	function stringTypeChecker(sFieldId) {
		var isString = true;
		if ((typeof sFieldId) !== 'string') {
			isString = false;
		}
		return isString;
	}
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.viewValidator#checkIfControlIsPresentInView
	* @returns if a control id is part of view or not
	* */
	function checkIfControlIsPresentInView(oContext, sFieldId) {
		var isControlOfView = true;
		if (!oContext.oView.byId(sFieldId)) {
			isControlOfView = false;
		}
		return isControlOfView;
	}
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.viewValidator#addFields
	* @description adds multiple controls ids for validation
	* @param accepts an array of control ids
	* */
	sap.apf.modeler.ui.utils.ViewValidator.prototype.addFields = function(aFields) {
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aFields)) {
			return;
		}
		var counter, length = aFields.length;
		for(counter = 0; counter < length; counter++) {
			if (stringTypeChecker(aFields[counter]) && checkIfControlIsPresentInView(this, aFields[counter]) && this.aFieldIds.indexOf(aFields[counter]) === -1) {
				this.aFieldIds.push(aFields[counter]);
			}
		}
	};
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.viewValidator#addField
	* @description adds one control id for validation
	* @param accepts a control ids
	* */
	sap.apf.modeler.ui.utils.ViewValidator.prototype.addField = function(sFieldId) {
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sFieldId)) {
			return;
		}
		if (stringTypeChecker(sFieldId) && checkIfControlIsPresentInView(this, sFieldId) && this.aFieldIds.indexOf(sFieldId) === -1) {
			this.aFieldIds.push(sFieldId);
		}
	};
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.viewValidator#removeFields
	* @description removes multiple control ids from validation
	* @param accepts an array of control ids
	* */
	sap.apf.modeler.ui.utils.ViewValidator.prototype.removeFields = function(aFields) {
		var index = -1;
		var counter, length = aFields.length;
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aFields) === false) {
			return;
		}
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(this.aFieldIds) === false) {
			return;
		}
		for(counter = 0; counter < length; counter++) {
			index = this.aFieldIds.indexOf(aFields[counter]);
			if (stringTypeChecker(aFields[counter]) && checkIfControlIsPresentInView(this, aFields[counter]) && index !== -1) {
				this.aFieldIds.splice(index, 1);
			}
		}
	};
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.viewValidator#removeField
	* @description removes one control id from validation
	* @param accepts a control id
	* */
	sap.apf.modeler.ui.utils.ViewValidator.prototype.removeField = function(sFieldId) {
		var index = -1;
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sFieldId) === false) {
			return;
		}
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(this.aFieldIds) === false) {
			return;
		}
		index = this.aFieldIds.indexOf(sFieldId);
		if (stringTypeChecker(sFieldId) && checkIfControlIsPresentInView(this, sFieldId) && index !== -1) {
			this.aFieldIds.splice(index, 1);
		}
	};
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.viewValidator#getFields
	* @returns all control ids for validation
	* */
	sap.apf.modeler.ui.utils.ViewValidator.prototype.getFields = function() {
		return this.aFieldIds;
	};
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.viewValidator#getView
	* @returns view being validated
	* */
	sap.apf.modeler.ui.utils.ViewValidator.prototype.getView = function() {
		return this.oView;
	};
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.viewValidator#clearFields
	* @description removes all control ids from validation
	* */
	sap.apf.modeler.ui.utils.ViewValidator.prototype.clearFields = function() {
		var length = this.aFieldIds.length;
		this.aFieldIds.splice(0, length);
	};
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.viewValidator#getValidationState
	* @returns validation state of the view
	* */
	sap.apf.modeler.ui.utils.ViewValidator.prototype.getValidationState = function() {
		var bValidState = true, i;
		for(i = 0; i < this.aFieldIds.length; i++) {
			if (this.oView.byId(this.aFieldIds[i]) instanceof sap.m.MultiComboBox) {
				bValidState = (this.oView.byId(this.aFieldIds[i]).getSelectedKeys().length >= 1) ? true : false;
			} else if (this.oView.byId(this.aFieldIds[i]) instanceof sap.m.Input) {
				if (this.oView.byId(this.aFieldIds[i]) instanceof sap.m.MultiInput) {
					bValidState = (this.oView.byId(this.aFieldIds[i]).getTokens().length >= 1) ? true : false;
				} else {
					bValidState = (this.oView.byId(this.aFieldIds[i]).getValue().trim() !== "") ? true : false;
				}
			} else if (this.oView.byId(this.aFieldIds[i]) instanceof sap.m.ComboBox) {
				bValidState = (this.oView.byId(this.aFieldIds[i]).getValue().trim() !== "") ? true : false;
			} else if (this.oView.byId(this.aFieldIds[i]) instanceof sap.m.Select) {
				bValidState = (this.oView.byId(this.aFieldIds[i]).getSelectedKey().length >= 1) ? true : false;
			}
			if (bValidState === false) {
				break;
			}
		}
		return bValidState;
	};
})();