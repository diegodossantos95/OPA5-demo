/*!
 * @copyright 2012-2014 SAP SE. All rights reserved@
 */

///**
// * This file defines behavior for the control,
// */


jQuery.sap.declare("sap.landvisz.LongTextFieldRenderer");

/**
 * @class LongTextRenderer renderer. 
 * @static
 */
sap.landvisz.LongTextFieldRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.landvisz.LongTextFieldRenderer.render = function(oRm, oControl){ 
	 // write the HTML into the render manager

	// write the HTML into the render manager
	var rb = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");

	if (!this.initializationDone) {
		oControl.initControls();
		oControl.initializationDone = true;

		// write the HTML into the render manager
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapLandviszLongTextSizeCommon");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.RegularSmall)
		oRm.addClass("sapLandviszLongTextRegularSmallSize");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.Regular)
			oRm.addClass("sapLandviszLongTextRegularSize");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.Medium)
			oRm.addClass("sapLandviszLongTextMediumSize");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.Large)
			oRm.addClass("sapLandviszLongTextLargeSize");

		oRm.writeClasses();
		oRm.write(">"); // span element
		var rfText = oControl.getText();
		oControl.oLongText.setWrapping(true);
		oControl.oLongText.setText(rfText);
		oRm.renderControl(oControl.oLongText);
		oRm.write("</div>");
	}
};
