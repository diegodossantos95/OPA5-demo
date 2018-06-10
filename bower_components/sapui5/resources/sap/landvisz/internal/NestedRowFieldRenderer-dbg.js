/*!
 *  @copyright 2012-2014 SAP SE. All rights reserved@
 */
jQuery.sap.declare("sap.landvisz.internal.NestedRowFieldRenderer");

/**
 * @class NestedRowField renderer.
 * @static
 */
sap.landvisz.internal.NestedRowFieldRenderer = {};

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
sap.landvisz.internal.NestedRowFieldRenderer.render = function(oRm, oControl) {

	if (!this.initializationDone) {
		oControl.initControls();
		oControl.initializationDone = true;

		// write the HTML into the render manager
		oRm.write("<div");

		oRm.writeControlData(oControl);
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.Small)
			oRm.addClass("sapLandviszNestedRowFieldSmallSize");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.RegularSmall)
			oRm.addClass("sapLandviszNestedRowFieldRegularSmallSize");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.Regular)
			oRm.addClass("sapLandviszNestedRowFieldRegularSize");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.Medium)
			oRm.addClass("sapLandviszNestedRowFieldMediumSize");
		if (oControl.getRenderingSize() == sap.landvisz.EntityCSSSize.Large)
			oRm.addClass("sapLandviszNestedRowFieldLargeSize");

		oRm.writeClasses();
		oRm.write(" >");
		oRm.write("<div");
		oRm.write(" >");
		oControl.oNestedRowFieldLabel.setText(oControl.getLabel());
		oControl.oNestedRowFieldLabel.setTooltip(oControl.getLabel());
		oControl.oNestedRowFieldLabel.addStyleClass("sapLandviszNestedRowFieldCommon");
		oControl.oNestedRowFieldLabel.addStyleClass("dataLabel");

		if (oControl.getType()) {
			this._assignIconSrc(oControl.getType(), oControl.iconLabel);
			oControl.iconLabel.addStyleClass("sapLandviszDataLabelIcon");
			oControl.iconLabel.setTooltip(oControl.getIconTitle());
			oRm.renderControl(oControl.iconLabel);
		}

		oRm.renderControl(oControl.oNestedRowFieldLabel);
		oRm.write("</div>");
		var rows = oControl.getLinearRows();
		var row;

		for ( var i = 0; i < rows.length; i++) {
			row = rows[i]
			row.setRenderingSize(oControl.getRenderingSize());
			row.addStyleClass("rowFieldinNestedRow");
			oRm.renderControl(row);
		}

		oRm.write("</div>");

	}

};

sap.landvisz.internal.NestedRowFieldRenderer._assignIconSrc = function(type,
		image) {
	if (type == "p")
		image.setSrc(
				sap.ui.resource("sap.landvisz",
						"themes/base/img/landscapeobjects/" + "24x24"
								+ "/Product_enable.png")).addStyleClass("img");
	else if (type == "pv")
		image.setSrc(
				sap.ui.resource("sap.landvisz",
						"themes/base/img/landscapeobjects/" + "24x24"
								+ "/ProductVersion_enable.png")).addStyleClass(
				"img");
	if (type == "pi")
		image.setSrc(
				sap.ui.resource("sap.landvisz",
						"themes/base/img/landscapeobjects/" + "24x24"
								+ "/ProductInstance_enable.png"))
				.addStyleClass("img");
	if (type == "ps")
		image.setSrc(
				sap.ui.resource("sap.landvisz",
						"themes/base/img/landscapeobjects/" + "24x24"
								+ "/ProductSystem_enable.png")).addStyleClass(
				"img");
};
