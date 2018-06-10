/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.utils.facetFilterListHandler');jQuery.sap.require('sap.apf.ui.utils.facetFilterListConverter');jQuery.sap.require('sap.apf.ui.utils.facetFilterValueFormatter');jQuery.sap.require('sap.m.FacetFilter');(function(){'use strict';function _(c){c.getView().byId("idAPFFacetFilter").removeAllLists();var v=c.getView().getViewData();var C=v.aConfiguredFilters;C.forEach(function(o){var f=new sap.apf.ui.utils.FacetFilterListHandler(v.oCoreApi,v.oUiApi,o);c.getView().byId("idAPFFacetFilter").addList(f.createFacetFilterList());});}sap.ui.controller("sap.apf.ui.reuse.controller.facetFilter",{onInit:function(){var c=this;if(sap.ui.Device.system.desktop){c.getView().addStyleClass("sapUiSizeCompact");}_(c);},onResetPress:function(){var c=this;c.getView().getViewData().oStartFilterHandler.resetVisibleStartFilters();c.getView().getViewData().oUiApi.selectionChanged(true);}});}());
