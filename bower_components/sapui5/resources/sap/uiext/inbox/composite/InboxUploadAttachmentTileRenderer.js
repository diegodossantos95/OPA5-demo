/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.composite.InboxUploadAttachmentTileRenderer");sap.uiext.inbox.composite.InboxUploadAttachmentTileRenderer={};
sap.uiext.inbox.composite.InboxUploadAttachmentTileRenderer.render=function(r,c){r.write("<span");r.writeControlData(c);r.addClass("sapUiExtInboxAttachmentTileLayout");r.writeClasses();r.write(">");r.write("<span>");var C=[];var a={};C.push("sapUiExtInboxAttachmentIcon");r.writeIcon(c.getFileTypeIcon(),C);r.write("</span>");r.write("<span");r.addClass("sapUiExtInboxAttachmentDetails");r.writeClasses();r.write(">");r.write("<div");r.addClass("sapUiExtInboxAttachmentName");r.writeClasses();r.writeAttributeEscaped('title',c.getFileName());r.write(">");r.writeEscaped(c.getFileName());r.write("</div>");r.write("<div");r.addClass("sapUiExtInboxAttachmentUplodBtns");r.writeClasses();r.write(">");this.renderUploadButton(r,c);this.renderCancelButton(r,c);r.write("</div>");r.write("</span>");r.write("</span>");};
sap.uiext.inbox.composite.InboxUploadAttachmentTileRenderer.renderUploadButton=function(r,c){r.write("<span>");r.renderControl(c.getUploadButton());r.write("</span>");};
sap.uiext.inbox.composite.InboxUploadAttachmentTileRenderer.renderCancelButton=function(r,c){r.write("<span");r.addClass("sapUiExtInboxAttachmentCancelBtn");r.writeClasses();r.write(">");r.renderControl(c.getCancelButton());r.write("</span>");};
