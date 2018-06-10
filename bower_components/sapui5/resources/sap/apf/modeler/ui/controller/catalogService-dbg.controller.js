/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
/**
* @class catalogService
* @name catalogService
* @description Catalog service provides the options for service to be selected from lists the oData service in select dialog
* 			   The ViewData for this view needs the the following two parameters:
*  			   getCalatogServiceUri()- api to fetch uri
*  			   parentControl- control from which the view instantiated
*/
sap.ui.define([ "sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator" ], function(Controller, Filter, FilterOperator) {
	"use strict";
	// gets the service from API and returns oData model
	function _getServicesFromGatewayCatalogService(oController) {
		//getCalatogServiceUri- api to provide uri
		var serviceUri = oController.getView().getViewData().getCalatogServiceUri();
		return new sap.ui.model.odata.ODataModel(serviceUri, true);
	}
	// Sets static texts in UI
	function _setDisplayText(oController) {
		var oTextReader = oController.getView().getViewData().oTextReader;
		var oSelectDialog = oController.byId("idGatewayCatalogListDialog");
		oSelectDialog.setTitle(oTextReader("selectService"));
		oSelectDialog.setNoDataText(oTextReader("noDataText"));
	}
	return Controller.extend("sap.apf.modeler.ui.controller.catalogService", {
		handleSearch : function(oEvent) {
			var oController = this;
			var searchTerm = oEvent.getParameter("value").trim();
			var upperCaseSearchTerm = searchTerm.toUpperCase();
			var lowerCaseSearchTerm = searchTerm.toLowerCase();
			var aFilters = [ new Filter("TechnicalServiceName", FilterOperator.Contains, upperCaseSearchTerm), new Filter("TechnicalServiceName", FilterOperator.Contains, lowerCaseSearchTerm) ];
			// create an OR filter.
			var oFilter = new Filter(aFilters, false);
			var oSelectDialog = oController.byId("idGatewayCatalogListDialog");
			oSelectDialog.getBinding("items").filter(oFilter);
		},
		// Called on initialization of the view. Sets the static texts for all controls in UI
		onInit : function() {
			var oController = this;
			var catalogServices = _getServicesFromGatewayCatalogService(oController);
			var oSelectDialog = oController.byId("idGatewayCatalogListDialog");
			_setDisplayText(oController);
			oSelectDialog.setModel(catalogServices);
			oSelectDialog.open();
		},
		// called on selection of service from select dialog
		handleConfirm : function(oEvent) {
			var oController = this, selectedService = oEvent.getParameter('selectedItem').getProperty('title');
			// clear filter if any
			var oSelectDialog = oController.byId("idGatewayCatalogListDialog");
			//parent control from which view is getting instanitated
			var parentControl = oController.getView().getViewData().parentControl;
			oSelectDialog.getBinding("items").filter([]);
			parentControl.fireEvent("selectService", {
				"sSelectedService" : selectedService
			});
			oController.byId("idGatewayCatalogListDialog").destroy();
			oController.getView().destroy();
		},
		handleCancel : function() {
			var oController = this;
			oController.byId("idGatewayCatalogListDialog").destroy();
			oController.getView().destroy();
		},
		// formatter for the service path		
		handleFormatting : function(oService) {
			var sPathName = sap.apf.utils.extractPathnameFromUrl(oService);
			return sPathName;
		}
	});
});