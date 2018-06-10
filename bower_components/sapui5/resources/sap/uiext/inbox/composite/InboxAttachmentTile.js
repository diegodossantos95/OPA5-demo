/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.composite.InboxAttachmentTile");jQuery.sap.require("sap.uiext.inbox.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxAttachmentTile",{metadata:{library:"sap.uiext.inbox",properties:{"fileName":{type:"string",group:"",defaultValue:null},"fileSize":{type:"string",group:"",defaultValue:null},"fileDescription":{type:"string",group:"Misc",defaultValue:null},"fileTypeIcon":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"creationDate":{type:"string",group:"Misc",defaultValue:null},"downloadUrl":{type:"string",group:"Misc",defaultValue:null},"createdBy":{type:"string",group:"Misc",defaultValue:null},"showDeleteButton":{type:"boolean",group:"Misc",defaultValue:true}},events:{"deleteAttachment":{}}}});sap.uiext.inbox.composite.InboxAttachmentTile.M_EVENTS={'deleteAttachment':'deleteAttachment'};
/*!
 * @copyright@
 */

sap.uiext.inbox.composite.InboxAttachmentTile.prototype.init=function(){this.oCore=sap.ui.getCore();this._oBundle=sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");};
sap.uiext.inbox.composite.InboxAttachmentTile.prototype.onclick=function(e){var t=e.target.getAttribute('ID');};
