/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.composite.InboxBusyIndicatorRenderer");sap.uiext.inbox.composite.InboxBusyIndicatorRenderer={};
sap.uiext.inbox.composite.InboxBusyIndicatorRenderer.render=function(r,c){r.write("<div ");r.writeControlData(c);r.addClass('sapUiextBusyContainer');r.writeClasses();r.write('>');r.write("</div>");};
