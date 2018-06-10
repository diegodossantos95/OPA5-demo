/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function(){'use strict';jQuery.sap.declare("sap.apf.Component");jQuery.sap.require("sap.ui.core.UIComponent");jQuery.sap.require("sap.apf.api");sap.ui.core.UIComponent.extend("sap.apf.Component",{oApi:null,metadata:{"config":{"fullWidth":true},"name":"CoreComponent","version":"0.0.1","publicMethods":["getApi"],"dependencies":{"libs":["sap.m","sap.ui.layout","sap.viz","sap.ui.comp","sap.suite.ui.commons"]}},init:function(){if(!this.oApi){this.oApi=new sap.apf.Api(this);}var a=this.oApi.getStartParameterFacade().getApplicationConfigurationPath();if(a){this.oApi.loadApplicationConfig(a);}sap.ui.core.UIComponent.prototype.init.apply(this,arguments);},createContent:function(){sap.ui.core.UIComponent.prototype.createContent.apply(this,arguments);return this.oApi.startApf();},exit:function(){try{this.oApi.destroy();}catch(e){}},getApi:function(){return this.oApi;}});}());
