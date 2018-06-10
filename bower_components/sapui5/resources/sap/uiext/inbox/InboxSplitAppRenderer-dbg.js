/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.uiext.inbox.InboxSplitAppRenderer");

/**
 * @class InboxSplitApp renderer. 
 * @static
 */
sap.uiext.inbox.InboxSplitAppRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.uiext.inbox.InboxSplitAppRenderer.render = function(oRm, oControl){ 
    // write the HTML into the render manager
	oRm.write("<div");
	oRm.writeControlData(oControl);
	oRm.writeAttribute("class","sapuiextinbox-inboxSplitApp"); 
	oRm.write(">"); // SPAN element
	oRm.renderControl(oControl.getAggregation("splitAppl"));
	oRm.write("</div>");
};
