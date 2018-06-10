/*!
 *  @copyright 2012-2014 SAP SE. All rights reserved@
 */
jQuery.sap.declare("sap.landvisz.internal.EntityCustomActionRenderer");

/**
 * @class EntityCustomAction renderer. 
 * @static
 */
sap.landvisz.internal.EntityCustomActionRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.landvisz.internal.EntityCustomActionRenderer.render = function(oRm, oControl){ 
	 // write the HTML into the render manager
	if (!this.initializationDone) {
		oControl.initControls();
		oControl.initializationDone = true;
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapLandviszAction");
		oRm.writeClasses();
		oRm.write("id=\"");
		oRm.write(oControl.getId()+"Action");
		oRm.write("\" title =\"");
		oRm.writeEscaped(oControl.getCustomAction());
		oRm.write("\">");
		oRm.writeEscaped(oControl.getCustomAction());
		oRm.write("</div>");
	}
};
