/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.composite.InboxUploadAttachmentTile");jQuery.sap.require("sap.uiext.inbox.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxUploadAttachmentTile",{metadata:{library:"sap.uiext.inbox",properties:{"fileName":{type:"string",group:"Misc",defaultValue:null},"fileTypeIcon":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null}},events:{"uploadSelectedFile":{}}}});sap.uiext.inbox.composite.InboxUploadAttachmentTile.M_EVENTS={'uploadSelectedFile':'uploadSelectedFile'};
/*!
 * @copyright@
 */

sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.init=function(){var t=this;this._oBundle=sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");this.oUploadButton=new sap.ui.commons.Button({tooltip:t._oBundle.getText("INBOX_UPLOAD_ATTACHMENT"),text:t._oBundle.getText("INBOX_UPLOAD_ATTACHMENT_TOOLTIP")});this.oCancelButton=new sap.ui.commons.Button({text:t._oBundle.getText("INBOX_CANCEL_TEXT"),tooltip:t._oBundle.getText("INBOX_CANCEL_TEXT"),});};
sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.onAfterRendering=function(){var f=this.oUploadButton.getFocusDomRef();if(f){jQuery.sap.focus(f);}};
sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.getUploadButton=function(){return this.oUploadButton;};
sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.getCancelButton=function(){return this.oCancelButton;};
