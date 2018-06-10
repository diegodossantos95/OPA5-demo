/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.uiext.inbox.InboxLaunchPadRenderer");

/**
 * @class InboxLaunchPad renderer. 
 * @static
 */
sap.uiext.inbox.InboxLaunchPadRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.uiext.inbox.InboxLaunchPadRenderer.render = function(oRm, oControl){ 
    // write the HTML into the render manager
	 oRm.write("<div style=\"height:100%; width:100%;\"");
	 oRm.writeControlData(oControl);
	 oRm.addClass("sapUiextInboxInboxLaunchPadRfct");
	 oRm.writeClasses();
	 oRm.write(">");// span element	
	 oRm.renderControl(oControl.getAggregation("launchPadHeader"));
	 
	 //write Tile Container
	 oRm.write("<div style=\"height:90%; width:100%;\""); //
	 oRm.addClass("sapUiextInboxTileContainer");
	 oRm.writeClasses();
	 oRm.write(">");// span element
	 oRm.renderControl(oControl.getAggregation("launchPadTileContainer"));
	 oRm.write("</div>");
	 
	 oRm.write("</div>");
};
