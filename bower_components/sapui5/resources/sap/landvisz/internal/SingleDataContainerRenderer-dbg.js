/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.SingleDataContainerRenderer");

/**
 * @class SingleDataContainer renderer.
 * @static
 */
sap.landvisz.internal.SingleDataContainerRenderer = {};

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
sap.landvisz.internal.SingleDataContainerRenderer.render = function(oRm,
		oControl) {
	// write the HTML into the render manager

	if (!this.initializationDone) {
		oControl.initControls();
		oControl.initializationDone = true;
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapLandviszSMVContainerAllSizes");
		oRm.addClass("svmContainer");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapLandviszSvmHeader");
		oRm.writeClasses();
		oRm.write(">");
		oControl.headerLabel.setText(oControl.getHeader());
		oControl.headerLabel.setTooltip(oControl.getHeader());
		oControl.headerLabel.addStyleClass("sapLandviszSvmHeaderLabel");
		oRm.renderControl(oControl.headerLabel);
		oRm.write("<div");
		oRm.writeAttributeEscaped("id", "closeVM");
		oRm.addClass("sapLandviszSvmSectorCloseBtn");
		oRm.writeClasses();

		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");
		var closeText = oBundle.getText("CLOSE");

		oRm.writeAttributeEscaped("title", closeText);
		oRm.write("></div>");
		oRm.write("</div>");

		oRm.write("<div");
		oRm.addClass("sapLandviszSvmDataContainer");
		oRm.writeClasses();
		oRm.write(">");
		var properties = oControl.getProperties();
		var property;
		for ( var i = 0; i < properties.length; i++) {
			property = properties[i];
			if (property.getRenderingSize())
				property.setRenderingSize(oControl.getRenderingSize());
			oRm.renderControl(property);
		}
		oRm.write("</div>");
		oRm.write("</div>");

		oControl.isModelOpen = true;
	}
};
