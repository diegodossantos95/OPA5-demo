/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.composite.InboxTaskTitleControl");jQuery.sap.require("sap.uiext.inbox.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxTaskTitleControl",{metadata:{library:"sap.uiext.inbox",properties:{"taskTitle":{type:"string",group:"Misc",defaultValue:null},"categoryIconURI":{type:"sap.ui.core.URI",group:"Misc",defaultValue:'hasCategory'},"hasAttachments":{type:"boolean",group:"Misc",defaultValue:null},"hasComments":{type:"boolean",group:"Misc",defaultValue:null}},aggregations:{"titleLink":{type:"sap.ui.core.Control",multiple:false}}}});
/*!
 * @copyright@
 */
jQuery.sap.require("sap.ui.core.IconPool");
sap.uiext.inbox.composite.InboxTaskTitleControl.prototype.init=function(){};
sap.uiext.inbox.composite.InboxTaskTitleControl.prototype.setTaskTitle=function(v){this.setProperty("taskTitle",v,true);this.getAggregation("titleLink").setText(v);};
sap.uiext.inbox.composite.InboxTaskTitleControl.prototype.setTooltip=function(v){this.setProperty("taskTitle",v,true);this.getAggregation("titleLink").setTooltip(v);};
