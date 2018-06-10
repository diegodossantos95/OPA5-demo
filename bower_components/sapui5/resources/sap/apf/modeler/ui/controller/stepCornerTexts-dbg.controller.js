/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require('sap.apf.modeler.ui.controller.cornerTexts');
(function() {
	"use strict";
	function _getCornerText(oController, sCornerTextKey) {
		var oCornerText = sCornerTextKey && oController.oTextPool.get(sCornerTextKey);
		return oCornerText && oCornerText.TextElementDescription;
	}
	sap.apf.modeler.ui.controller.cornerTexts.extend("sap.apf.modeler.ui.controller.stepCornerTexts", {
		setChartIcon : function() {
			var oController = this;
			oController.byId("idChartIcon").setSrc("sap-icon://line-chart");
			oController.byId("idChartIcon").addStyleClass("stepChartIcon");
		},
		addStyleClasses : function() {
			var oController = this;
			oController.byId("idLeftUpper").addStyleClass("stepLeftCornerText");
			oController.byId("idRightUpper").addStyleClass("stepRightCornerText");
			oController.byId("idLeftLower").addStyleClass("stepLeftCornerText");
			oController.byId("idRightLower").addStyleClass("stepRightCornerText");
		},
		getTranslationFormatMap : function() {
			return sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_CORNER_TEXT;
		},
		getLeftUpperCornerText : function(sMethodName) {
			var oController = this;
			var sStepLeftUpperCornerTextKey = oController.getView().getViewData().oParentObject[sMethodName]();
			var sStepLeftUpperCornerText = _getCornerText(oController, sStepLeftUpperCornerTextKey);
			return sStepLeftUpperCornerText;
		},
		getRightUpperCornerText : function(sMethodName) {
			var oController = this;
			var sStepRightUpperCornerTextKey = oController.getView().getViewData().oParentObject[sMethodName]();
			var sStepRightUpperCornerText = _getCornerText(oController, sStepRightUpperCornerTextKey);
			return sStepRightUpperCornerText;
		},
		getLeftLowerCornerText : function(sMethodName) {
			var oController = this;
			var sStepLeftLowerCornerTextKey = oController.getView().getViewData().oParentObject[sMethodName]();
			var sStepLeftLowerCornerText = _getCornerText(oController, sStepLeftLowerCornerTextKey);
			return sStepLeftLowerCornerText;
		},
		getRightLowerCornerText : function(sMethodName) {
			var oController = this;
			var sStepRightLowerCornerTextKey = oController.getView().getViewData().oParentObject[sMethodName]();
			var sStepRightLowerCornerText = _getCornerText(oController, sStepRightLowerCornerTextKey);
			return sStepRightLowerCornerText;
		}
	});
}());