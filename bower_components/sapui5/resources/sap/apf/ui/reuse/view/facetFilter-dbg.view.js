/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
*/
/**
* @class facetFilter
* @name  facetFilter
* @description Creates the facet filter
* @memberOf sap.apf.ui.reuse.view
* 
 */
(function() {
	'use strict';
	sap.ui.jsview("sap.apf.ui.reuse.view.facetFilter", {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.facetFilter";
		},
		createContent : function(oController) {
			var oFacetFilter = new sap.m.FacetFilter(oController.createId("idAPFFacetFilter"), {
				type : "Simple",
				showReset : true,
				showPopoverOKButton : true,
				reset : oController.onResetPress.bind(oController)
			}).addStyleClass('facetFilterInitialAlign');
			if (sap.ui.Device.system.desktop) {
				oFacetFilter.addStyleClass("facetfilter");
			}
			return oFacetFilter;
		}
	});
}());
