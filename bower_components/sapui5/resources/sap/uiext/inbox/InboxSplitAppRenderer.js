/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.InboxSplitAppRenderer");sap.uiext.inbox.InboxSplitAppRenderer={};
sap.uiext.inbox.InboxSplitAppRenderer.render=function(r,c){r.write("<div");r.writeControlData(c);r.writeAttribute("class","sapuiextinbox-inboxSplitApp");r.write(">");r.renderControl(c.getAggregation("splitAppl"));r.write("</div>");};
