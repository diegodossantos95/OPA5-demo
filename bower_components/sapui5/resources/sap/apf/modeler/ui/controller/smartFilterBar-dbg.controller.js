/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
/**
* @class smartFilterBar
* @name smartFilterBar
* @description Smart filter controller of modeler
* 			   The ViewData for this view needs the following parameters:
*  			   getCalatogServiceUri()- api to fetch uri
*  			   updateSelectedNode - Updates the tree node with ID of new face filter
*  			   updateTitleAndBreadCrumb - Updates the title of smart filter in breadcrumb
*  			   oParams - Object contains URL Context
*  			   oConfigurationHandler - Handler for configuration
*  			   oConfigurationEditor -  manages the facet filter object
*/
(function() {
	"use strict";
	var oParams, oTextReader, oConfigurationHandler, oConfigurationEditor, oSmartFilter;
	// Called on initialization to retrieve smart filter
	function _retrieveSFBObject(oController) {
		if (oParams && oParams.arguments && oParams.arguments.smartFilterId) {
			oSmartFilter = oConfigurationEditor.getSmartFilterBar();
		}
	}
	// Called on initialization to create sub views SFB Request
	function _instantiateSubViews(oController) {
		var requestOptionsSFBController, oSFBRequestView;
		var oViewData = {
			oTextReader : oTextReader,
			oConfigurationHandler : oConfigurationHandler,
			oConfigurationEditor : oConfigurationEditor,
			oParentObject : oSmartFilter,
			getCalatogServiceUri : oController.getView().getViewData().getCalatogServiceUri
		};
		//use specific controller type to reuse request options view
		requestOptionsSFBController = new sap.ui.controller("sap.apf.modeler.ui.controller.smartFilterBarRequest");
		oSFBRequestView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.requestOptions",
			type : sap.ui.core.mvc.ViewType.XML,
			id : oController.createId("idSFBRequestView"),
			viewData : oViewData,
			controller : requestOptionsSFBController
		});
		oController.byId("idSFBRequestVBox").insertItem(oSFBRequestView);
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.smartFilterBar", {
		// Called on initialization of the view.Initializes SFB request subview. Retrieves smart filter object
		onInit : function() {
			var oController = this;
			var oViewData = oController.getView().getViewData();
			oTextReader = oViewData.getText;
			oParams = oViewData.oParams;
			oConfigurationHandler = oViewData.oConfigurationHandler;
			oConfigurationEditor = oViewData.oConfigurationEditor;
			_retrieveSFBObject(oController);
			_instantiateSubViews(oController);
		},
		setDetailData : function() {
		},
		// returns the current validation state of parent view along with sub views VHR and FRR
		getValidationState : function() {
			var oController = this;
			return oController.byId("idSFBRequestView").getController().getValidationState();
		},
		// Triggered when facet filter view is destroyed and destroys sub views VHR and FRR
		onExit : function() {
			var oController = this;
			oController.byId("idSFBRequestView").destroy();
		}
	});
}());