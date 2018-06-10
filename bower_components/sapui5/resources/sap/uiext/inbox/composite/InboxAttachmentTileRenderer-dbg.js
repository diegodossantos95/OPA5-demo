/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.uiext.inbox.composite.InboxAttachmentTileRenderer");

/**
 * @class InboxAttachmentTile renderer. 
 * @static
 */
sap.uiext.inbox.composite.InboxAttachmentTileRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.uiext.inbox.composite.InboxAttachmentTileRenderer.render = function(oRm, oControl){ 
	 oRm.write("<span"); // outer container starts
     oRm.writeControlData(oControl);  
     oRm.addClass("sapUiExtInboxAttachmentTileLayout");
	 oRm.writeClasses();
	 oRm.write(">");
		oRm.write("<span>"); // fileType icon span starts
		var aClasses = [];
		var mAttributes = {};
		mAttributes["id"] = oControl.getId() + "-fileTypeIcon";
		aClasses.push("sapUiExtInboxAttachmentIcon");
		oRm.writeIcon(oControl.getFileTypeIcon(), aClasses, mAttributes);
		oRm.write("</span>"); // fileType icon span ends
		
		oRm.write("<span"); //starts info column
		oRm.addClass("sapUiExtInboxAttachmentDetails");
		oRm.writeClasses();
		oRm.write(">");
			oRm.write("<div"); // starts first row for fileTitle and fileSize
			oRm.addClass("sapUiExtInboxInlineFlexRow");
			oRm.writeClasses();
			oRm.write(">");
			
			oRm.write("<span"); // starts file name and file size column
			oRm.addClass("sapUiExtInboxAttachmentTitle");
			oRm.writeClasses();
			oRm.write(">");
				
				oRm.write("<span"); // starts file name span
				oRm.addClass("sapUiExtInboxAttachmentInline");
				oRm.writeClasses();
				oRm.write(">");
				oRm.write('<a'); // starts file name link 
				oRm.addClass("sapUiExtInboxAttachmentFileLink");
				oRm.writeClasses();
				oRm.writeAttribute('id', oControl.getId() + "_downloadLink");
				oRm.writeAttributeEscaped('title', oControl._oBundle.getText("INBOX_ATTACHMENT_DOWNLOAD_TOOLTIP", [oControl.getFileName()] ));
				oRm.writeAttributeEscaped('href', oControl.getDownloadUrl());
				oRm.write('>');
				oRm.writeEscaped(oControl.getFileName());
				oRm.write('</a> '); // ends file name link  
				oRm.write("</span>"); // ends file name span
				
				oRm.write("<span"); // starts file size span
				oRm.addClass("sapUiExtInboxAttachmentFileSize");
				oRm.writeClasses();
				oRm.writeAttributeEscaped('title', oControl.getFileSize());
				oRm.write(">");
				oRm.writeEscaped(oControl.getFileSize());
				oRm.write("</span>"); // ends file size span
				
			oRm.write("</div>"); // ends first row for fileTitle and fileSize
				
			oRm.write("<div"); // starts second row for createdBy, createdAt and delete button
			oRm.addClass("sapUiExtInboxInlineFlexRow");
			oRm.writeClasses();
			oRm.write(">");
				oRm.write("<span");
				oRm.addClass("sapUiExtInboxAttachmentCreatedBy");
				oRm.writeClasses();
				oRm.writeAttributeEscaped('title', oControl._oBundle.getText("INBOX_ATTACHMENT_CREATED_BY_TOOLTIP", [oControl.getCreatedBy()] ));
				oRm.write(">");
				oRm.writeEscaped(oControl.getCreatedBy());
				oRm.write("</span>");
		
				oRm.write("<span");
				oRm.addClass("sapUiExtInboxAttachmentDate");
				oRm.writeClasses();
				oRm.writeAttributeEscaped('title', oControl._oBundle.getText("INBOX_ATTACHMENT_CREATION_DATE_TOOLTIP", [oControl.getCreationDate()] ));
				oRm.write(">");
				oRm.writeEscaped(oControl.getCreationDate());
				oRm.write("</span>");
				
				if (oControl.getShowDeleteButton())
					this.renderDeleteButton(oRm, oControl);
				
			oRm.write("</div>"); // ends second row for fileDisplayName, createdAt and delete button
		oRm.write("</span>"); // ends info column
	oRm.write("</span>"); // outer container ends
};

sap.uiext.inbox.composite.InboxAttachmentTileRenderer.renderDeleteButton = function(oRm, oControl) {
	oRm.write("<span");
	oRm.addClass("sapUiExtInboxAttachmentDeleteBtn");
	oRm.writeClasses();
	oRm.write(">");
	var oDeleteButton = new sap.ui.commons.Button({
			tooltip : oControl._oBundle.getText("INBOX_ATTACHMENT_DELETE_TOOLTIP"),
			icon :  sap.ui.core.IconPool.getIconURI("delete"),
			lite : true
	}).attachPress(function(oEvent) {
		oControl.fireDeleteAttachment();
	});
	oRm.renderControl(oDeleteButton);
	oRm.write("</span>");
};
