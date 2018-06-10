/*!
 *  @copyright 2012-2014 SAP SE. All rights reserved@
 */

jQuery.sap.declare("sap.landvisz.internal.ModelingStatusRenderer");

/**
 * @class ModelingStatusRenderer renderer.
 * @static
 */
sap.landvisz.internal.ModelingStatusRenderer = {};

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
sap.landvisz.internal.ModelingStatusRenderer.render = function(oRm, oControl) {
	// write the HTML into the render manager
	var rb = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");

	if (!this.initializationDone) {
		oControl.initControls();
		oRm.write("<div");
		oRm.writeControlData(oControl);
		if (oControl.entityMaximized != true) {
			if (oControl.renderSize == sap.landvisz.EntityCSSSize.Small) {
				oControl._imgFolderPath = "16x16/";
				oRm.addClass("sapLandviszStatusSectionSmallSize");
			} else if(oControl.renderSize == sap.landvisz.EntityCSSSize.RegularSmall || oControl.renderSize == sap.landvisz.EntityCSSSize.Regular 
			|| oControl.renderSize == sap.landvisz.EntityCSSSize.Medium || oControl.renderSize == sap.landvisz.EntityCSSSize.Large ){			
				oControl._imgFolderPath = "24x24/";
				oRm.addClass("sapLandviszStatusSectionAllSize");
			} 

		} else if (oControl.entityMaximized == true) {
			oControl._imgFolderPath = "24x24/";
			oRm.addClass("sapLandviszStatusSectionAllSize");
		}

		// write the HTML into the render manager

		oRm.writeClasses();

		if (oControl.getStatus() == sap.landvisz.ModelingStatus.ERROR
				|| oControl.getStatus() == sap.landvisz.ModelingStatus.WARNING)
			oRm.addStyle("border","1px solid #999999");
		oRm.writeStyles();
			oRm.writeAttributeEscaped("title",oControl.getStatusTooltip());
		oRm.write(">");
		//oControl.statusImage.setTooltip(oControl.getStatusTooltip());
		if(oControl.initializationDone == false){
		oControl.statusImage.attachPress(function(oEvent) {
		oControl.fireEvent("statusSelected");
		});
		}
		
		this._assignIconSrc(oRm, oControl);
		
		if (oControl.getStatus() == sap.landvisz.ModelingStatus.ERROR
				|| oControl.getStatus() == sap.landvisz.ModelingStatus.WARNING)
			oRm.renderControl(oControl.statusImage);
		if (oControl.getStateIconSrc() && "" != oControl.getStateIconSrc()) {
			oControl.stateImage.setSrc(oControl.getStateIconSrc());
			oControl.stateImage.setTooltip(oControl.getStateIconTooltip());
			oControl.stateImage.addStyleClass("stateIconClass");
			oRm.renderControl(oControl.stateImage);

		}
		oControl.initializationDone = true;
		oRm.write("</div>");
	}

};

sap.landvisz.internal.ModelingStatusRenderer._assignIconSrc = function(oRm,
		oControl) {
	if (oControl.getStatus() == sap.landvisz.ModelingStatus.ERROR)
		oControl.statusImage.setSrc(oControl._imgResourcePath
				+ oControl._imgFolderPath + "error.png");
	else if (oControl.getStatus() == sap.landvisz.ModelingStatus.WARNING)
		oControl.statusImage.setSrc(oControl._imgResourcePath
				+ oControl._imgFolderPath + "warning.png");
	else if (oControl.getStatus() == sap.landvisz.ModelingStatus.WARNING)
		oControl.statusImage.setSrc(oControl._imgResourcePath
				+ oControl._imgFolderPath + "success.png");

};