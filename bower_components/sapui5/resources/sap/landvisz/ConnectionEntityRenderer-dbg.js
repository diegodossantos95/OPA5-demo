/*!
 * @copyright 2012-2014 SAP SE. All rights reserved@
 */
jQuery.sap.declare("sap.landvisz.ConnectionEntityRenderer");

/**
 * @class ConnectionEntity renderer.
 * @static
 */
sap.landvisz.ConnectionEntityRenderer = {};

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
sap.landvisz.ConnectionEntityRenderer.render = function(oRm, oControl) {
	// write the HTML into the render manager

	if (!this.initializationDone) {

		oControl.initControls();
		oControl.initializationDone = true;
		oRm.write("<div");
		oRm.writeControlData(oControl);

		if (oControl.viewType == sap.landvisz.DependencyType.NETWORK_VIEW)
			oRm.addClass("sapLandviszConnection_entity_container");
		else if (oControl.viewType == sap.landvisz.DependencyType.BOX_VIEW)
			oRm.addClass("sapLandviszConnectionBox");
		else if (oControl.viewType == sap.landvisz.ViewType.SOLUTION_VIEW)
			oRm.addClass("sapLandviszSolutionBox");
		oRm.writeClasses();
		if (this.left != 0)
			oRm.addStyle("left",oControl.left + "px");
		if (this.top != 0)
			oRm.addStyle("top",oControl.top + "px");
		if (oControl.width != 0)
			oRm.addStyle("width", oControl.width + "px");
		if (oControl.height != 0)
			oRm.addStyle("height",oControl.height + "px");
		oRm.addStyle("position", "absolute");
		oRm.writeStyles();
		oRm.write(" >");

		oRm.write("<div");
		oRm.writeAttributeEscaped("id", oControl.getId() + "connectionRow");
		oRm.addClass("connectionEntity");
		if (oControl.getType() == sap.landvisz.ConnectionType.ProductSystem)
			oRm.addClass("productSystem");
		if (oControl.getType() == sap.landvisz.ConnectionType.TechnicalSystem)
			oRm.addClass("technicalSystem");
		if (oControl.getType() == sap.landvisz.ConnectionType.MobileSolution && oControl.viewType != sap.landvisz.ViewType.SOLUTION_VIEW)
			oRm.addClass("mobileSolution");
		oRm.writeClasses();

		if (this.left != 0)
			oRm.addStyle("left", oControl.innerLeft + "px");
		if (this.top != 0)
			oRm.addStyle("top", oControl.innerTop + "px");
		if (oControl.width != 0)
			oRm.addStyle("width",oControl.innerWidth + "px");
		if (oControl.height != 0)
			oRm.addStyle("height", oControl.innerHeight + "px");
		oRm.addStyle("position","absolute");
		var connectionData = oControl.getConnectionData();
		if(connectionData.length > 1)
		oRm.addStyle("overflow", "auto");
		oRm.writeStyles();
		oRm.write(">");
		oRm.write("<div");
		oRm
				.writeAttributeEscaped("id", oControl.getId()
						+ "connectionRowField");
		oRm.addClass("boxRowDisplay");
		
		if(connectionData.length <= 1)
		oRm.addStyle("width", "100%");
		oRm.writeStyles();
		oRm.addClass("sapLandviszConnectionRowField");
		oRm.writeClasses();
		oRm.write(">");

		//var connectionData = oControl.getConnectionData();
		if (oControl.viewType == sap.landvisz.ViewType.SOLUTION_VIEW) {

			for ( var i = 0; i < connectionData.length; i++) {

				if (connectionData.length > 1) {
					connectionData[i]
							.setRenderingSize(sap.landvisz.EntityCSSSize.Medium);
					connectionData[i]
							.addStyleClass("sapLandviszConnectionDataNotopMargin");
					oRm.renderControl(connectionData[i]);

				} else {
					oControl.connectionImage.setSrc(
							sap.ui.resource("sap.landvisz",
									"themes/base/img/landscapeobjects/"
											+ "48x48" + "/Solution.png"))
							.addStyleClass("solutionImage");
					oControl.connectionImage.setTooltip(oControl
							.getDependencyTooltip());

					oRm.renderControl(oControl.connectionImage);

					oControl.connectionLabel.setText(connectionData[i]
							.getLabel());
					oControl.connectionLabel.setTooltip(connectionData[i]
							.getTooltip());
					oControl.connectionLabel.addStyleClass("solutionRow");
					oRm.renderControl(oControl.connectionLabel);
				}
			}

		} else {

			var connectionData = oControl.getConnectionData();
			if (connectionData.length > 0) {
				for ( var i = 0; i < connectionData.length; i++) {
					if(oControl.getSize() == sap.landvisz.EntityCSSSize.Small)
						connectionData[i]
					.setRenderingSize(sap.landvisz.EntityCSSSize.Small);
					else
					connectionData[i]
							.setRenderingSize(sap.landvisz.EntityCSSSize.Medium);
					connectionData[i]
							.addStyleClass("sapLandviszConnectionDataNotopMargin");
					oRm.renderControl(connectionData[i]);

				}

			}

			var row;

			if (connectionData.length > 0) {
				oControl.oVLayoutToolPopup.removeAllContent();
				oControl.oVLayoutToolPopup.addStyleClass("sapLandviszConnectionToolPopup");
				for ( var i = 0; i < connectionData.length; i++) {
					
					if(oControl.getSize() == sap.landvisz.EntityCSSSize.Small)
						connectionData[i]
					.setRenderingSize(sap.landvisz.EntityCSSSize.Small);
					else
					connectionData[i]
							.setRenderingSize(sap.landvisz.EntityCSSSize.Medium);
					row = new sap.landvisz.internal.LinearRowField();
					row.addStyleClass("overlayRow");
					row.setLabel(connectionData[i].getLabel());
					row.setValue(connectionData[i].getValue());
					row.setRenderingSize(connectionData[i].getRenderingSize());
					row.setIconType(connectionData[i].getIconType());
					row.setIconTitle(connectionData[i].getIconTitle());
					row.setLinkSource(connectionData[i].getLinkSource());
					row.setRightIconSrc(connectionData[i].getRightIconSrc());
					oControl.oVLayoutToolPopup.addContent(row);
				}
			}
		}
		oRm.write("</div>");
		oRm.write("</div>");
		oRm.write("</div>");

		var backup = oControl.oVLayoutCallout.getContent();
		for ( var i = 0; i < backup.length; i++) {
			oControl.addAggregation("connectionData", backup[i], false);
		}
	}
};
