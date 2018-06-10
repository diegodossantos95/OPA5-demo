/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.EntityRenderer");

/**
 * @class Entity renderer. 
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
	}
};
