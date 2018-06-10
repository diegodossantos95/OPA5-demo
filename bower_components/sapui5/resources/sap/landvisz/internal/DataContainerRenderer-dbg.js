/*!
 *  @copyright 2012-2014 SAP SE. All rights reserved@
 */
jQuery.sap.declare("sap.landvisz.internal.DataContainerRenderer");

/**
 * @class DataContainer renderer.
 * @static
 */
sap.landvisz.internal.DataContainerRenderer = {};

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
sap.landvisz.internal.DataContainerRenderer.render = function(oRm, oControl) {

	if (!this.initializationDone) {
		oControl.initControls();
		oControl.initializationDone = true;

		// write the HTML into the render manager

		oRm.write("<div tabIndex='0' ");
		oRm.writeControlData(oControl);
			oRm.addClass("sapLandviszDataContainerSize");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.Small)
			oRm.addClass("sapLandviszDataContainerSmallSize");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.RegularSmall)
			oRm.addClass("sapLandviszDataContainerRegularSmallSize");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.Regular)
			oRm.addClass("sapLandviszDataContainerRegularSize");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.Medium)
			oRm.addClass("sapLandviszDataContainerMediumSize");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.Large)
			oRm.addClass("sapLandviszDataContainerLargeSize");
		if (oControl.getSelected()){
		if(oControl.getType() == sap.landvisz.LandscapeObject.TechnicalSystem)
		oRm.addClass("sapLandviszSelectedTechnicalSystem");
		else if(oControl.getType() == sap.landvisz.LandscapeObject.ProductSystem)
		oRm.addClass("sapLandviszSelectedProductSystem");
		else if(oControl.getType() == sap.landvisz.LandscapeObject.SapComponent)
		oRm.addClass("sapLandviszSelectedSapComponent");	
		oRm.writeClasses();	
		}
			//oRm.addClass("sapLandviszSelected");
		else
			oRm.addClass("sapLandviszUnselected");

		if (oControl.width && oControl.width != '')
			oRm.addStyle("width", oControl.width);
//		if (oControl.visible == false)
//			oRm.addStyle("visibility","hidden");
//		else
//			oRm.addStyle("visibility","visible");
//oRm.addStyle("display","none");
		oRm.writeStyles();
		oRm.writeClasses();
		oRm.writeAttributeEscaped("title", oControl.getHeader());
		oRm.write(">"); // span element
		oRm.writeEscaped(oControl.getHeader());

		oRm.write("</div>");

//._renderDataContainer(oRm, oControl);


	}

};



sap.landvisz.internal.DataContainerRenderer._renderDataContainerProperties = function(
		oRm, oControl) {

	var continerId = oControl.getId();
	var oProperties = oControl.getValues();
	var rowField;
	if (oProperties.length) {

		for ( var i = 0; i < oProperties.length; i++) {

			rowField = new sap.landvisz.internal.LinearRowField(continerId + i
					+ oControl.getHeader() + "-CLVDatacontainerRowField");
			rowField.setLabel(oProperties[i].label);
			rowField.setValue(oProperties[i].value);
			rowField.placeAt("CLVEntityHLayout");
		}
	}

	else {

		rowField = new sap.landvisz.internal.LinearRowField(continerId
				+ oControl.getHeader() + "-CLVDatacontainerRowField");
		rowField.setLabel(oProperties.label);
		rowField.setValue(oProperties.value);
		rowField.placeAt("CLVEntityHLayout");
	}

};
