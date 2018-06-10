/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.uiext.inbox.composite.InboxAttachmentsTileContainerRenderer");

/**
 * @class InboxAttachmentsTileContainer renderer. 
 * @static
 */
sap.uiext.inbox.composite.InboxAttachmentsTileContainerRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.uiext.inbox.composite.InboxAttachmentsTileContainerRenderer.render = function(oRm, oControl){
	oRm.write("<div");
	oRm.writeControlData(oControl);
	oRm.write(">");
		if (oControl.getShowAddTile())
			oRm.renderControl(oControl.getAggregation("firstTile"));
		for (var i = 0; i < oControl.getAttachments().length; i++) {
			oRm.renderControl(oControl.getAttachments()[i]);
		}
		oRm.write("<div"); 
		oRm.addClass("sapUiExtInboxAttachmentHidden");
		oRm.writeClasses();
		oRm.write(">");
		oRm.renderControl(oControl.oFileUploader);
		oRm.write("</div>");
	oRm.write("</div>");
};