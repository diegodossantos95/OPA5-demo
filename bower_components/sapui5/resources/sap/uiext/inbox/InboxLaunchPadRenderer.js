/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.InboxLaunchPadRenderer");sap.uiext.inbox.InboxLaunchPadRenderer={};
sap.uiext.inbox.InboxLaunchPadRenderer.render=function(r,c){r.write("<div style=\"height:100%; width:100%;\"");r.writeControlData(c);r.addClass("sapUiextInboxInboxLaunchPadRfct");r.writeClasses();r.write(">");r.renderControl(c.getAggregation("launchPadHeader"));r.write("<div style=\"height:90%; width:100%;\"");r.addClass("sapUiextInboxTileContainer");r.writeClasses();r.write(">");r.renderControl(c.getAggregation("launchPadTileContainer"));r.write("</div>");r.write("</div>");};
