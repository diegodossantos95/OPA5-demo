/**
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/Object'],function(q,O){"use strict";var r=q.sap.getModulePath("sap.collaboration.components")+"/resources/i18n/messagebundle.properties";var L=O.extend("sap.collaboration.components.util.LanguageBundle",{constructor:function(){this.i18nModel=new sap.ui.model.resource.ResourceModel({bundleUrl:r});this.oLangBundle=this.i18nModel.getResourceBundle();},getText:function(t,v){return this.oLangBundle.getText(t,v);},createResourceModel:function(){return this.i18nModel;}});return L;},true);
