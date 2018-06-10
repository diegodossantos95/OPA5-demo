jQuery.sap.declare('sap.fiori.library-all');if(!jQuery.sap.isDeclared('sap.fiori.library')){
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.fiori.library');jQuery.sap.require('jquery.sap.global');jQuery.sap.require('sap.ui.core.Core');jQuery.sap.require('sap.ui.core.library');jQuery.sap.require('jquery.sap.resources');sap.ui.define("sap/fiori/library",['jquery.sap.global','sap/ui/core/Core','sap/ui/core/library','jquery.sap.resources'],function(q,C,l){"use strict";sap.ui.getCore().initLibrary({name:"sap.fiori",dependencies:["sap.ui.core"],types:[],interfaces:[],controls:[],elements:[],version:"1.50.6"});var c=sap.ui.getCore().getConfiguration(),L=c.getLanguage(),d=c.getLanguagesDeliveredWithCore(),a=q.sap.resources._getFallbackLocales(L,d);L=a[0];if(L&&!window["sap-ui-debug"]){q.sap.require("sap.fiori.messagebundle-preload_"+L);}return sap.fiori;});};
