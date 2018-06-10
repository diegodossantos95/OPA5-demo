/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.controller.InboxControllerFactory");jQuery.sap.require("sap.uiext.inbox.controller.InboxController");jQuery.sap.require("sap.uiext.inbox.controller.InboxControllerAsync");sap.ui.base.Object.extend("sap.uiext.inbox.controller.InboxControllerFactory",{constructor:function(c){sap.ui.base.Object.apply(this);this._bAsync=c.bAsyncValue;this._oController=null;}});
sap.uiext.inbox.controller.InboxControllerFactory.prototype.getController=function(){if(this._oController===null){if(this._bAsync===true){this._oController=new sap.uiext.inbox.controller.InboxControllerAsync();}else if(this._bAsync===false){this._oController=new sap.uiext.inbox.controller.InboxController();}else{if(window.console){console.error("Invalid argument specified in constructor. Please pass a boolean value - true/false.");}this._oController=null;}}return this._oController;};
