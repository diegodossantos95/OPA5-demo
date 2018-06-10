/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.uiext.inbox.composite.InboxAddAttachmentTileRenderer");

/**
 * @class InboxAddAttachmentTile renderer. 
 * @static
 */
sap.uiext.inbox.composite.InboxAddAttachmentTileRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.uiext.inbox.composite.InboxAddAttachmentTileRenderer.render = function(oRm, oControl){
	oRm.write("<span");
	oRm.writeControlData(oControl);  
	oRm.addClass("sapUiExtInboxAddAttachmentTileLayout");
	oRm.writeClasses();
	oRm.write(">");
	
		oRm.write("<span>");
		var aClasses = [];
		var mAttributes = {};
		aClasses.push("sapUiExtInboxAttachmentIcon");
		oRm.writeIcon(sap.ui.core.IconPool.getIconURI("add"), aClasses);
		oRm.write("</span>");
		
		oRm.write("<span"); 
		oRm.addClass("sapUiExtInboxAddAttachmentText");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write('<a'); // starts link
		oRm.addClass("sapUiExtInboxAttachmentAddLink");
		oRm.writeClasses();
		oRm.writeAttribute('id', oControl.getId() + "_textAddAttachment");
		oRm.writeAttribute('title', oControl._oBundle.getText("INBOX_ADD_ATTACHMENT_TOOLTIP"));
		oRm.writeAttribute('href', 'javascript:void(0);');
		oRm.write('>');
		oRm.writeEscaped(oControl._oBundle.getText("INBOX_ADD_ATTACHMENT"));
		oRm.write('</a> '); // ends link
		oRm.write("</span>");
		
	oRm.write("</span>");
};
