/*!
 *  @copyright 2012-2014 SAP SE. All rights reserved@
 */

jQuery.sap.declare("sap.landvisz.internal.DeploymentTypeRenderer");

/**
 * @class LinearRowField renderer.
 * @static
 */
sap.landvisz.internal.DeploymentTypeRenderer = {};

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
sap.landvisz.internal.DeploymentTypeRenderer.render = function(oRm, oControl) {
	// write the HTML into the render manager
	if (!this.initializationDone) {
		oControl.initControls();
		oControl.initializationDone = true;
		var width;
		var margin = 5;
		if (oControl.count + 1 == 1)
			width = oControl.standardWidth;
		else
			width = oControl.standardWidth * (oControl.count + 1) + margin
					* (oControl.count);

		oRm.write("<div");
		oRm.addStyle("left", oControl.left + "px");
		oRm.addStyle("position", "absolute");
		oRm.addStyle("height", "40px");
		oRm.addStyle("width", width + "px");
		oRm.writeStyles();
		oRm.writeClasses();
		oRm.writeControlData(oControl);
		oRm.write(">"); // span element

		this._drawLeftLine(oRm, oControl, width);

		oRm.write("<div");
		oRm.addStyle("left", width / 2 - 40 + "px");
		oRm.addStyle("position", "absolute");
		oRm.addStyle("margin-top", "5px");
		oRm.addStyle("width", "80px");
		oRm.addStyle("text-align", "center");
		oRm.writeStyles();
		oRm.write(">"); // span element

		// type image to be drawn here
		if (oControl.type == sap.landvisz.ComponentType.onDemand)
			oControl.iconType.setSrc(sap.ui.resource("sap.landvisz",
					"themes/base/img/framework/" + "32x32" + "/sap_on_demand.png"));
		else if (oControl.type == sap.landvisz.ComponentType.onPremise)
			oControl.iconType
					.setSrc(sap.ui.resource("sap.landvisz",
							"themes/base/img/framework/" + "32x32"
									+ "/sap_on_premise.png"));
		oControl.iconType.setTooltip(oControl.getTooltip());
		oControl.iconType.addStyleClass("sapLandviszIconBorder");
		oRm.renderControl(oControl.iconType);
		oRm.write("</div>");
		this._drawRightLine(oRm, oControl, width);

		oRm.write("</div>");
	}

};

sap.landvisz.internal.DeploymentTypeRenderer._drawLeftLine = function(oRm,
		oControl, width) {

	var pixelWidth = width / 2 - 40 - 9;
	oRm.write("<div");
	oRm.addStyle("position", "absolute");
	oRm.addStyle("margin-top", "11px");
	oRm.writeStyles();
	oRm.write(">");
	oControl.iconLeft.setSrc(sap.ui
			.resource("sap.landvisz", "themes/base/img/framework/" + "16x16"
					+ "/leftnav_enable_dark.png"));
	oRm.renderControl(oControl.iconLeft);
	oRm.write("</div>");
	oRm.write("<h2 ");
	oRm.addStyle("left", "9px");
	oRm.addStyle("position", "absolute");
	oRm.addStyle("width", pixelWidth + "px");
	oRm.addStyle("margin", "18px 0px");
	oRm.addStyle("line-height", ".1em");
	oRm.addStyle("border-bottom", "2px solid black");
	oRm.addStyle("text-align", "center");
	oRm.writeStyles();
	oRm.write(">");
	oRm.write(" </h2>");
};

sap.landvisz.internal.DeploymentTypeRenderer._drawRightLine = function(oRm,
		oControl, width) {

	var pixelWidth = width / 2 - 40 - 9;
	var left = width / 2 + 40;
	oRm.write("<h2 ");
	oRm.addStyle("left", left + "px");
	oRm.addStyle("position", "absolute");
	oRm.addStyle("width", pixelWidth + "px");
	oRm.addStyle("margin", "18px 0px");
	oRm.addStyle("line-height", ".1em");
	oRm.addStyle("border-bottom", "2px solid black");
	oRm.addStyle("text-align", "center");
	oRm.writeStyles();
	oRm.write(">");
	oRm.write(" </h2>");

	oRm.write("<div");
	oRm.addStyle("position", "absolute");
	oRm.addStyle("margin-top", "11px");
	oRm.addStyle("left", width - 18 + "px");
	oRm.writeStyles();
	oRm.write(">");
	oControl.iconRight.setSrc(sap.ui.resource("sap.landvisz",
			"themes/base/img/framework/" + "16x16"
					+ "/rightnav_enable_dark.png"));
	oRm.renderControl(oControl.iconRight);
	oRm.write("</div>");
};