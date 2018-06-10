/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.uiext.inbox.composite.InboxUploadAttachmentTileRenderer");

/**
 * @class InboxUploadAttachmentTile renderer. 
 * @static
 */
sap.uiext.inbox.composite.InboxUploadAttachmentTileRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.uiext.inbox.composite.InboxUploadAttachmentTileRenderer.render = function(oRm, oControl){ 
	oRm.write("<span"); // outer control starts
    oRm.writeControlData(oControl);  
    oRm.addClass("sapUiExtInboxAttachmentTileLayout");
	oRm.writeClasses();
	oRm.write(">");
	
		oRm.write("<span>"); // span for file type icon starts
		var aClasses = [];
		var mAttributes = {};
		aClasses.push("sapUiExtInboxAttachmentIcon");
		oRm.writeIcon(oControl.getFileTypeIcon(), aClasses);
		oRm.write("</span>"); // span for file type icon ends
		
		oRm.write("<span");
		oRm.addClass("sapUiExtInboxAttachmentDetails");
		oRm.writeClasses();
		oRm.write(">");
		
			oRm.write("<div"); // starts first row
			oRm.addClass("sapUiExtInboxAttachmentName");
			oRm.writeClasses();
			oRm.writeAttributeEscaped('title', oControl.getFileName());
			oRm.write(">");
			oRm.writeEscaped(oControl.getFileName());
			oRm.write("</div>"); // ends first row
				
			oRm.write("<div"); // starts second row
			oRm.addClass("sapUiExtInboxAttachmentUplodBtns");
			oRm.writeClasses();
			oRm.write(">");
			
				//this.renderTextField(oRm, oControl); // rendering TextField to enter description
				this.renderUploadButton(oRm, oControl); // rendering upload button 
				this.renderCancelButton(oRm, oControl); // rendering cancel button 
		
			oRm.write("</div>"); // second row ends
		oRm.write("</span>");
	oRm.write("</span>"); // outer control ends
};

/*sap.uiext.inbox.composite.InboxUploadAttachmentTileRenderer.renderTextField = function(oRm, oControl) {
	oRm.write("<span>");
	oRm.renderControl(oControl.getTextField());
	oRm.write("</span>");
};*/

sap.uiext.inbox.composite.InboxUploadAttachmentTileRenderer.renderUploadButton = function(oRm, oControl) {
	oRm.write("<span>");
	oRm.renderControl(oControl.getUploadButton());
	oRm.write("</span>");
};

sap.uiext.inbox.composite.InboxUploadAttachmentTileRenderer.renderCancelButton = function(oRm, oControl) {
	oRm.write("<span");
	oRm.addClass("sapUiExtInboxAttachmentCancelBtn");
	oRm.writeClasses();
	oRm.write(">");
	oRm.renderControl(oControl.getCancelButton());
	oRm.write("</span>");
};
