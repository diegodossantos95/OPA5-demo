/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require('sap.apf.modeler.ui.utils.nullObjectChecker');
jQuery.sap.require('sap.apf.modeler.ui.controller.cornerTexts');
(function() {
	"use strict";
	var oNullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	function _getCornerText(oController, sCornerTextKey) {
		var oCornerText = sCornerTextKey && oController.oTextPool.get(sCornerTextKey);
		return oCornerText && oCornerText.TextElementDescription;
	}
	sap.apf.modeler.ui.controller.cornerTexts.extend("sap.apf.modeler.ui.controller.representationCornerTexts", {
		addStyleClasses : function() {
			var oController = this;
			oController.byId("idLeftUpper").addStyleClass("repLeftCornerText");
			oController.byId("idRightUpper").addStyleClass("repRightCornerText");
			oController.byId("idLeftLower").addStyleClass("repLeftCornerText");
			oController.byId("idRightLower").addStyleClass("repRightCornerText");
		},
		setChartIcon : function() {
			var oController = this;
			var sRepresentationType = oController.getView().getViewData().oParentObject.getRepresentationType();
			var oPicture = oController.getView().getViewData().oRepresentationTypeHandler.getPictureOfRepresentationType(sRepresentationType);
			oController.byId("idChartIcon").setSrc(oPicture);
			oController.byId("idChartIcon").addStyleClass("repChartIcon");
		},
		getTranslationFormatMap : function() {
			return sap.apf.modeler.ui.utils.TranslationFormatMap.REPRESENTATION_CORNER_TEXT;
		},
		getLeftUpperCornerText : function(sMethodName) {
			var oController = this;
			var sStepLeftUpperCornerTextKey = oController.getView().getViewData().oParentStep[sMethodName]();
			var sStepLeftUpperCornerText = _getCornerText(oController, sStepLeftUpperCornerTextKey);
			var sRepLeftUpperCornerTextKey = oController.getView().getViewData().oParentObject[sMethodName]();
			var sRepLeftUpperCornerText = _getCornerText(oController, sRepLeftUpperCornerTextKey);
			var sCornerText = oNullObjectChecker.checkIsNotUndefined(sRepLeftUpperCornerText) ? sRepLeftUpperCornerText : sStepLeftUpperCornerText;
			return sCornerText;
		},
		getRightUpperCornerText : function(sMethodName) {
			var oController = this;
			var sStepRightUpperCornerTextKey = oController.getView().getViewData().oParentStep[sMethodName]();
			var sStepRightUpperCornerText = _getCornerText(oController, sStepRightUpperCornerTextKey);
			var sRepRightUpperCornerTextKey = oController.getView().getViewData().oParentObject[sMethodName]();
			var sRepRightUpperCornerText = _getCornerText(oController, sRepRightUpperCornerTextKey);
			var sCornerText = oNullObjectChecker.checkIsNotUndefined(sRepRightUpperCornerText) ? sRepRightUpperCornerText : sStepRightUpperCornerText;
			return sCornerText;
		},
		getLeftLowerCornerText : function(sMethodName) {
			var oController = this;
			var sStepLeftLowerCornerTextKey = oController.getView().getViewData().oParentStep[sMethodName]();
			var sStepLeftLowerCornerText = _getCornerText(oController, sStepLeftLowerCornerTextKey);
			var sRepLeftLowerCornerTextKey = oController.getView().getViewData().oParentObject[sMethodName]();
			var sRepLeftLowerCornerText = _getCornerText(oController, sRepLeftLowerCornerTextKey);
			var sCornerText = oNullObjectChecker.checkIsNotUndefined(sRepLeftLowerCornerText) ? sRepLeftLowerCornerText : sStepLeftLowerCornerText;
			return sCornerText;
		},
		getRightLowerCornerText : function(sMethodName) {
			var oController = this;
			var sStepRightLowerCornerTextKey = oController.getView().getViewData().oParentStep[sMethodName]();
			var sStepRightLowerCornerText = _getCornerText(oController, sStepRightLowerCornerTextKey);
			var sRepRightLowerCornerTextKey = oController.getView().getViewData().oParentObject[sMethodName]();
			var sRepRightLowerCornerText = _getCornerText(oController, sRepRightLowerCornerTextKey);
			var sCornerText = oNullObjectChecker.checkIsNotUndefined(sRepRightLowerCornerText) ? sRepRightLowerCornerText : sStepRightLowerCornerText;
			return sCornerText;
		}
	});
}());