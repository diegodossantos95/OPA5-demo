/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require('sap.apf.modeler.ui.utils.nullObjectChecker');
jQuery.sap.declare('sap.apf.modeler.ui.utils.optionsValueModelBuilder');
(function() {
	'use strict';
	var DEFAULT_MODEL_LIMIT = 500;
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	/**
	* @class optionsValueModelBuilder
	* @memberOf sap.apf.modeler.ui.utils
	* @name optionsValueModelBuilder
	* @description helps creating models for UI controls
	*/
	sap.apf.modeler.ui.utils.OptionsValueModelBuilder = function() {
	};
	sap.apf.modeler.ui.utils.OptionsValueModelBuilder.prototype.constructor = sap.apf.modeler.ui.utils.OptionsValueModelBuilder;
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.optionsValueModelBuilder#prepareModel
	* @returns Returns a JSON model based on values and size limit received. If no size limit was passed it is defaulted to 500
	* */
	sap.apf.modeler.ui.utils.OptionsValueModelBuilder.prototype.prepareModel = function(objArr, limitOfModel) {
		var oModel;
		if (!nullObjectChecker.checkIsNotNullOrUndefined(limitOfModel)) {
			limitOfModel = DEFAULT_MODEL_LIMIT;
		}
		oModel = new sap.ui.model.json.JSONModel();
		oModel.setSizeLimit(limitOfModel);
		oModel.setData({
			Objects : objArr
		});
		return oModel;
	};
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.optionsValueModelBuilder#convert
	* @returns Makes an array of objects and returns a JSON model based on values and size limit received. If no size limit was passed it is defaulted to 500
	* */
	sap.apf.modeler.ui.utils.OptionsValueModelBuilder.prototype.convert = function(arrValues, limitOfModel) {
		var objArr = [], obj;
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(arrValues)) {
			return;
		}
		arrValues.forEach(function(value) {
			if (!nullObjectChecker.checkIsNotNullOrUndefined(value)) {
				return;
			}
			obj = {};
			obj.key = value instanceof Object ? value.key : value;
			obj.name = value instanceof Object ? value.name : value;
			objArr.push(obj);
		});
		return sap.apf.modeler.ui.utils.OptionsValueModelBuilder.prototype.prepareModel(objArr, limitOfModel);
	};
})();