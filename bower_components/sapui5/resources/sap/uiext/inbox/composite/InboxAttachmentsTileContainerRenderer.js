/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.composite.InboxAttachmentsTileContainerRenderer");sap.uiext.inbox.composite.InboxAttachmentsTileContainerRenderer={};
sap.uiext.inbox.composite.InboxAttachmentsTileContainerRenderer.render=function(r,c){r.write("<div");r.writeControlData(c);r.write(">");if(c.getShowAddTile())r.renderControl(c.getAggregation("firstTile"));for(var i=0;i<c.getAttachments().length;i++){r.renderControl(c.getAttachments()[i]);}r.write("<div");r.addClass("sapUiExtInboxAttachmentHidden");r.writeClasses();r.write(">");r.renderControl(c.oFileUploader);r.write("</div>");r.write("</div>");};
