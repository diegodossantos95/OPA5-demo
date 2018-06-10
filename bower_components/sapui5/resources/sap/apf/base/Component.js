/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2015 SAP SE. All rights reserved
 */
(function(){'use strict';jQuery.sap.declare("sap.apf.base.Component");jQuery.sap.require("sap.ui.core.UIComponent");jQuery.sap.require("sap.apf.api");sap.ui.core.UIComponent.extend("sap.apf.base.Component",{metadata:{"manifest":"json","library":"sap.apf","publicMethods":["getApi"]},oApi:null,init:function(){var b;var m;if(!this.oApi){b=sap.apf.base.Component.prototype.getMetadata().getManifest();m=jQuery.extend({},true,this.getMetadata().getManifest());this.oApi=new sap.apf.Api(this,undefined,{manifest:m,baseManifest:b});if(this.oApi.startupSucceeded()){sap.ui.core.UIComponent.prototype.init.apply(this,arguments);}}else{return;}},createContent:function(){sap.ui.core.UIComponent.prototype.createContent.apply(this,arguments);return this.oApi.startApf();},exit:function(){this.oApi.destroy();},getApi:function(){return this.oApi;},getInjections:function(){return{exits:{},instances:{},functions:{},constructors:{},probe:function(){}};}});}());
