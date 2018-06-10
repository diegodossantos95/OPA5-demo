/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./library","sap/ui/core/Control"],function(l,C){"use strict";var a=C.extend("sap.ui.vk.ContainerContent",{metadata:{library:"sap.ui.vk",properties:{"icon":{type:"string",group:"Misc",defaultValue:null},"title":{type:"string",group:"Misc",defaultValue:null}},aggregations:{"content":{type:"sap.ui.core.Control",multiple:false}}}});a.prototype.setContent=function(c){if(c instanceof sap.ui.vbm.GeoMap){c.setNavcontrolVisible(false);c.setWidth("100%");c.setHeight("100%");}this.setAggregation("content",c);return this;};return a;});
