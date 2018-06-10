/*!
 *  @copyright 2012-2014 SAP SE. All rights reserved@
 */

jQuery.sap.declare("sap.landvisz.internal.EntityActionRenderer");
/**
 * @class EntityAction renderer.
 * @static
 */
sap.landvisz.internal.EntityActionRenderer = {};

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
sap.landvisz.internal.EntityActionRenderer.render = function(oRm, oControl) {

	if (!this.initializationDone) {
		oControl.initControls();
		oControl.initializationDone = true;
		oRm.write("<div tabIndex='0' ");
		oRm.writeControlData(oControl);
		var renderSize = oControl.getRenderingSize();
		if (oControl.entityMaximized != true) {
			if (renderSize == sap.landvisz.EntityCSSSize.Small
					|| renderSize == sap.landvisz.EntityCSSSize.RegularSmall
					|| renderSize == sap.landvisz.EntityCSSSize.Regular
					|| renderSize == sap.landvisz.EntityCSSSize.Medium) {
				oRm.addClass("sapLandviszIcon_buttonSmall");
			} else
				oRm.addClass("sapLandviszIcon_button");
		} else if (oControl.entityMaximized == true) {
			oRm.addClass("sapLandviszIcon_button");
			oControl.entityActionIcon.setWidth("16px");
			oControl.entityActionIcon.setHeight("16px");
		}

		oRm.writeClasses();
		oRm.write(">");
		oControl.setTooltip(oControl.getActionTooltip());
		oControl.entityActionIcon.setSrc(oControl.getIconSrc());
		oControl.entityActionIcon.setTooltip(oControl.getActionTooltip());
		oRm.renderControl(oControl.entityActionIcon);
		oRm.write("</div>");
	}

};
