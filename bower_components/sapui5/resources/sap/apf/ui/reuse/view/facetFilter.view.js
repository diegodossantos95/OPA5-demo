/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
*/
(function(){'use strict';sap.ui.jsview("sap.apf.ui.reuse.view.facetFilter",{getControllerName:function(){return"sap.apf.ui.reuse.controller.facetFilter";},createContent:function(c){var f=new sap.m.FacetFilter(c.createId("idAPFFacetFilter"),{type:"Simple",showReset:true,showPopoverOKButton:true,reset:c.onResetPress.bind(c)}).addStyleClass('facetFilterInitialAlign');if(sap.ui.Device.system.desktop){f.addStyleClass("facetfilter");}return f;}});}());
