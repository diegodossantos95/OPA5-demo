/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.utils.facetFilterListHandler');
jQuery.sap.require('sap.apf.ui.utils.facetFilterListConverter');
jQuery.sap.require('sap.apf.ui.utils.facetFilterValueFormatter');
jQuery.sap.require('sap.m.FacetFilter');
/**
* @class facetFilter
* @memberOf sap.apf.ui.reuse.controller
* @name facetFilter
* @description controller facetFilter view
*/
(function() {
	'use strict';
	/**
	* @private
	* @function
	* @name sap.apf.ui.reuse.controller.facetFilter#_createFilterLists
	* @param The facet filter controller context
	* @description Creates the FacetFilterLists together with a ListHandler for each one configured FacetFilter
	* */
	function _createFilterLists(oController) {
		oController.getView().byId("idAPFFacetFilter").removeAllLists();
		var oViewData = oController.getView().getViewData();
		var aConfiguredFilters = oViewData.aConfiguredFilters;
		aConfiguredFilters.forEach(function(oConfiguredFilter) {
			var oFacetFilterListHandler = new sap.apf.ui.utils.FacetFilterListHandler(oViewData.oCoreApi, oViewData.oUiApi, oConfiguredFilter);
			oController.getView().byId("idAPFFacetFilter").addList(oFacetFilterListHandler.createFacetFilterList());
		});
	}
	sap.ui.controller("sap.apf.ui.reuse.controller.facetFilter", {
		/**
		* @public
		* @function
		* @name sap.apf.ui.reuse.controller.facetFilter#onInit
		* @description Called on initialization of the view
		* Instantiates all facet filter list handlers
		* Populates and selects the filter values
		*/
		onInit : function() {
			var oController = this;
			if (sap.ui.Device.system.desktop) {
				oController.getView().addStyleClass("sapUiSizeCompact");
			}
			_createFilterLists(oController);
		},
		/**
		* @public
		* @function
		* @name sap.apf.ui.reuse.controller.facetFilter#onResetPress
		* @description Reset to the initial filter values for all the facet filter list controls
		*/
		onResetPress : function() {
			var oController = this;
			oController.getView().getViewData().oStartFilterHandler.resetVisibleStartFilters();
			//Trigger selection changed to update path
			oController.getView().getViewData().oUiApi.selectionChanged(true);
		}
	});
}());
