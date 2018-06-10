/*!
 *  @copyright 2012-2014 SAP SE. All rights reserved@
 */
jQuery.sap.declare("sap.landvisz.internal.HeaderListRenderer");

/**
 * @class HeaderList renderer.
 * @static
 */
sap.landvisz.internal.HeaderListRenderer = {};

/**
 * Renders the HTML for the given control, using the provided
 * {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager}
 *            oRm the RenderManager that can be used for writing to the render
 *            output buffer
 * @param {sap.ui.core.Control}
 *            oControl an object representation of the control that should be
 *            rendered
 */
sap.landvisz.internal.HeaderListRenderer.render = function(oRm, oControl) {
	// write the HTML into the render manager
	if (!this.initializationDone) {
		oControl.initControls();

		oControl.initializationDone = true;
		oRm.write("<div tabIndex='0' ");
		oRm.writeControlData(oControl);
		if (oControl.getSelected()){
		oRm.addClass("sapLandviszMiniNavigationSelected");
		if(oControl.getType() == sap.landvisz.LandscapeObject.TechnicalSystem)
		oRm.addClass("sapLandviszTechnicalSystem");
		else if(oControl.getType() == sap.landvisz.LandscapeObject.ProductSystem)
		oRm.addClass("sapLandviszProductSystem");
		else if(oControl.getType() == sap.landvisz.LandscapeObject.SapComponent)
		oRm.addClass("sapLandviszSapComponent");	
		oRm.writeClasses();			
		}

		else if (oControl.inDisplay == true)
			oRm.addClass("sapLandviszMiniNavigationInDisplay");
		else
			oRm.addClass("sapLandviszMiniNavigationNormal");

		oRm.writeClasses();
		oRm.writeAttributeEscaped("id", oControl.getId() + "MiniHeader");
		oRm.writeAttributeEscaped("title", oControl.getHeaderTooltip());
		oRm.addStyle("width",oControl.headerWidth+"px");
		oRm.writeStyles();
		oRm.write(">");
		oRm.write("</div>");
	}
};
