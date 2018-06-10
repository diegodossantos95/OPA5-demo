/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
/**
* @class cornerTexts
* @name cornerTexts
* @description General controller for setting corner texts for representation and step
* 			   The ViewData for this view needs the following parameters:
*  			   oTextReader           - to get translated texts to display them on UI
*  			   oConfigurationEditor  - to save corner text changes on the parent object (step/representation) 
*  			   oTextPool             - to get the text pool
*  			   oParentObject 		 - Object from which this view gets instantiated
*  			   oParentStep           - Parent step of representation (Passed only when representation view instantiates this view)
*/
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
(function() {
	"use strict";
	var oViewData, oTextReader, oParentObject, oConfigurationEditor;
	function _setDisplayText(oController) {
		oController.byId("idThumbnailTexts").setText(oTextReader("cornerTextLabel"));
		oController.byId("idLeftUpper").setPlaceholder(oTextReader("leftTop"));
		oController.byId("idRightUpper").setPlaceholder(oTextReader("rightTop"));
		oController.byId("idLeftLower").setPlaceholder(oTextReader("leftBottom"));
		oController.byId("idRightLower").setPlaceholder(oTextReader("rightBottom"));
	}
	//Setter method names are taken from custom data attached to each input control 
	function _setLeftUpperCornerText(oController) {
		var sMethodName = oController.byId("idLeftUpper").getCustomData()[1].getValue();
		var sText = oController.getLeftUpperCornerText(sMethodName, oParentObject, oViewData.oParentStep);
		oController.byId("idLeftUpper").setValue(sText);
	}
	function _setRightUpperCornerText(oController) {
		var sMethodName = oController.byId("idRightUpper").getCustomData()[1].getValue();
		var sText = oController.getRightUpperCornerText(sMethodName, oParentObject, oViewData.oParentStep);
		oController.byId("idRightUpper").setValue(sText);
	}
	function _setLeftLowerCornerText(oController) {
		var sMethodName = oController.byId("idLeftLower").getCustomData()[1].getValue();
		var sText = oController.getLeftLowerCornerText(sMethodName, oParentObject, oViewData.oParentStep);
		oController.byId("idLeftLower").setValue(sText);
	}
	function _setRightLowerCornerText(oController) {
		var sMethodName = oController.byId("idRightLower").getCustomData()[1].getValue();
		var sText = oController.getRightLowerCornerText(sMethodName, oParentObject, oViewData.oParentStep);
		oController.byId("idRightLower").setValue(sText);
	}
	sap.ui.core.mvc.Controller.extend("sap.apf.modeler.ui.controller.cornerTexts", {
		oTextPool : {},
		onInit : function() {
			var oController = this;
			oViewData = oController.getView().getViewData();
			oConfigurationEditor = oViewData.oConfigurationEditor;
			oTextReader = oViewData.oTextReader;
			oParentObject = oViewData.oParentObject;
			oController.oTextPool = oViewData.oTextPool;
			_setDisplayText(oController);
			oController.setDetailData();
		},
		setDetailData : function() {
			var oController = this;
			_setLeftUpperCornerText(oController);
			_setRightUpperCornerText(oController);
			_setLeftLowerCornerText(oController);
			_setRightLowerCornerText(oController);
			oController.setChartIcon();
			oController.addStyleClasses();
		},
		// Called on reset of parent object in order to update parent object instance and configuration editor instance
		updateSubViewInstancesOnReset : function(oEvent) {
			var oController = this;
			oController.oConfigurationEditor = oEvent.getParameter("oConfigurationEditor");
			oController.oParentObject = oEvent.getParameter("oParentObject");
			oController.setDetailData();
		},
		handleChangeForCornerText : function(oEvt) {
			var oController = this;
			var sMethodName = oEvt.getSource().getCustomData()[0].getValue(); //Getter method name is taken from custom data attached to each input control in view
			oController.oTextPool.setTextAsPromise(oEvt.getSource().getValue().trim(), oController.getTranslationFormatMap()).done(function(sTextKey){
				oParentObject[sMethodName](sTextKey);
				oConfigurationEditor.setIsUnsaved();
			});			
		},
		// handler for suggestions
		handleSuggestions : function(oEvent) {
			var oController = this;
			var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oController.oTextPool);
			oSuggestionTextHandler.manageSuggestionTexts(oEvent, oController.getTranslationFormatMap());
		},
		//Stub to be implemented in sub views
		setChartIcon : function() {
		},
		addStyleClasses : function() {
		},
		getTranslationFormatMap : function() {
		},
		getLeftUpperCornerText : function(sMethodName) {
		},
		getRightUpperCornerText : function(sMethodName) {
		},
		getLeftLowerCornerText : function(sMethodName) {
		},
		getRightLowerCornerText : function(sMethodName) {
		}
	});
}());