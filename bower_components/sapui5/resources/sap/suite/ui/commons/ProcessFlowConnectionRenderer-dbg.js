/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['./library'],
	function(library) {
	"use strict";

	/**
	 * @class ProcessFlowConnection renderer.
	 * @static
	 */
	var ProcessFlowConnectionRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered
	 */
	ProcessFlowConnectionRenderer.render = function (oRm, oControl) {
		var oConnection = oControl._traverseConnectionData();
		var sZoomLevel = oControl.getZoomLevel();

		oRm.write("<div");
		oRm.writeAttribute("id", oControl.getId());

		//Writes ARIA details.
		oRm.writeAttribute("role", "presentation");
		oRm.writeAttributeEscaped("aria-label", oControl._getAriaText(oConnection));
		oRm.write(">");

		//Writes the lines.
		if (oControl._isHorizontalLine(oConnection)) {
			this._writeHorizontalLine(oRm, oConnection, sZoomLevel, oControl);
		} else if (oControl._isVerticalLine(oConnection)) {
			this._writeVerticalLine(oRm, oConnection, sZoomLevel, oControl._getShowLabels());
		} else {
			this._writeSpecialLine(oRm, oConnection, sZoomLevel, oControl);
		}
		oRm.write("</div>");
	};

	/* =========================================================== */
	/* Helper methods                                              */
	/* =========================================================== */

	/**
	 * Writes the vertical line.
	 *
	 * @private
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {object} connection Connection which needs to be checked
	 * @param {object} zoomLevel Zoom level of control
	 * @param {boolean} showLabels Show labels
	 */
	ProcessFlowConnectionRenderer._writeVerticalLine = function (oRm, connection, zoomLevel, showLabels) {
		// Left column
		oRm.write("<div");
		oRm.addClass("floatLeft");
		if (showLabels) {
			oRm.addClass("sapSuiteUiPFWithLabel");
		}
		switch (zoomLevel) {
			case library.ProcessFlowZoomLevel.One:
				oRm.addClass("boxZoom1Width");
				oRm.addClass("boxWideZoom1Height");
				break;
			case library.ProcessFlowZoomLevel.Three:
				oRm.addClass("boxZoom3Width");
				oRm.addClass("boxWideZoom3Height");
				break;
			case library.ProcessFlowZoomLevel.Four:
				oRm.addClass("boxZoom4Width");
				oRm.addClass("boxWideZoom4Height");
				break;
			default:
				oRm.addClass("boxZoom2Width");
				oRm.addClass("boxWideZoom2Height");
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		// Middle column
		oRm.write("<div");
		oRm.addClass("floatLeft");
		oRm.addClass("boxMiddleBorderWidth");
		switch (zoomLevel) {
			case library.ProcessFlowZoomLevel.One:
				oRm.addClass("boxWideZoom1Height");
				break;
			case library.ProcessFlowZoomLevel.Three:
				oRm.addClass("boxWideZoom3Height");
				break;
			case library.ProcessFlowZoomLevel.Four:
				oRm.addClass("boxWideZoom4Height");
				break;
			default:
				oRm.addClass("boxWideZoom2Height");
		}
		oRm.addClass("borderLeft");
		if (connection.top.type === library.ProcessFlowConnectionType.Planned) {
			oRm.addClass("borderLeftTypePlanned");
		} else {
			oRm.addClass("borderLeftTypeNormal");
		}
		if (connection.top.state === library.ProcessFlowConnectionState.Highlighted) {
			oRm.addClass("borderLeftStateHighlighted");
			oRm.addClass("stateHighlighted");
		} else if (connection.top.state === library.ProcessFlowConnectionState.Dimmed) {
			oRm.addClass("borderLeftStateDimmed");
		} else if (connection.top.state === library.ProcessFlowConnectionState.Selected) {
			oRm.addClass("borderLeftStateSelected");
			oRm.addClass("stateSelected");
		} else {
			oRm.addClass("borderLeftStateRegular");
			oRm.addClass("stateRegular");
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		// Right column
		// Omitted

		ProcessFlowConnectionRenderer._resetFloat(oRm);
	};

	/**
	 * Writes the horizontal line.
	 *
	 * @private
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {object} connection Connection which needs to be checked
	 * @param {object} zoomLevel Zoom level of control
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 */
	ProcessFlowConnectionRenderer._writeHorizontalLine = function (oRm, connection, zoomLevel, oControl) {
		//1st row
		oRm.write("<div");
		oRm.addClass("boxWideWidth");
		switch (zoomLevel) {
			case library.ProcessFlowZoomLevel.One:
				oRm.addClass("boxTopZoom1Height");
				break;
			case library.ProcessFlowZoomLevel.Three:
				oRm.addClass("boxTopZoom3Height");
				break;
			case library.ProcessFlowZoomLevel.Four:
				oRm.addClass("boxTopZoom4Height");
				break;
			default:
				oRm.addClass("boxTopZoom2Height");
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		// 2nd row
		oRm.write("<div");
		if (connection.arrow) {
			// connection column
			oRm.addClass("parentPosition");
			if (oControl._getShowLabels()) {
				oRm.addClass("sapSuiteUiPFWithLabel");
			}
			switch (zoomLevel) {
				case library.ProcessFlowZoomLevel.One:
					oRm.addClass("boxWideArrowZoom1Width");
					break;
				case library.ProcessFlowZoomLevel.Three:
					oRm.addClass("boxWideArrowZoom3Width");
					break;
				case library.ProcessFlowZoomLevel.Four:
					oRm.addClass("boxWideArrowZoom4Width");
					break;
				default:
					oRm.addClass("boxWideArrowZoom2Width");
			}
		} else {
			oRm.addClass("boxWideWidth");
		}
		oRm.addClass("boxMiddleBorderHeight");
		oRm.addClass("borderBottom");
		if (connection.right.type === library.ProcessFlowConnectionType.Planned) {
			oRm.addClass("borderBottomTypePlanned");
		} else {
			oRm.addClass("borderBottomTypeNormal");
		}
		if (connection.right.state === library.ProcessFlowConnectionState.Highlighted) {
			oRm.addClass("borderBottomStateHighlighted");
			oRm.addClass("stateHighlighted");
		} else if (connection.right.state === library.ProcessFlowConnectionState.Dimmed) {
			oRm.addClass("borderBottomStateDimmed");
		} else if (connection.right.state === library.ProcessFlowConnectionState.Selected) {
			oRm.addClass("borderBottomStateSelected");
			oRm.addClass("stateSelected");
		} else {
			oRm.addClass("borderBottomStateRegular");
			oRm.addClass("stateRegular");
		}
		oRm.writeClasses();
		oRm.write(">");

		if (connection.labels && oControl._showLabels) {
			ProcessFlowConnectionRenderer._renderLabel(oRm, oControl, connection);
		}

		if (connection.arrow) {
			oRm.write("<div");
			oRm.addClass("arrowRight");
			if (connection.right.state === library.ProcessFlowConnectionState.Highlighted) {
				oRm.addClass("borderLeftStateHighlighted");
			} else if (connection.right.state === library.ProcessFlowConnectionState.Dimmed) {
				oRm.addClass("borderLeftStateDimmed");
			} else if (connection.right.state === library.ProcessFlowConnectionState.Selected) {
				oRm.addClass("borderLeftStateSelected");
			} else {
				oRm.addClass("borderLeftStateRegular");
			}
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");
		}
		oRm.write("</div>");

		// 3rd row
		// Omitted
	};

	/**
	 * Writes the special line (e.g. branch or corner).
	 *
	 * @private
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {object} connection Connection which needs to be checked
	 * @param {object} zoomLevel Zoom level of control
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 */
	ProcessFlowConnectionRenderer._writeSpecialLine = function (oRm, connection, zoomLevel, oControl) {
		ProcessFlowConnectionRenderer._writeFirstRowOfSpecialLine(oRm, connection, zoomLevel, oControl);
		ProcessFlowConnectionRenderer._writeSecondRowOfSpecialLine(oRm, connection, zoomLevel, oControl);
		ProcessFlowConnectionRenderer._writeThirdRowOfSpecialLine(oRm, connection, zoomLevel, oControl);
		ProcessFlowConnectionRenderer._resetFloat(oRm);
	};

	/**
	 * Writes the first row of a special line (e.g. branch).
	 *
	 * @private
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {object} connection Connection which needs to be checked
	 * @param {object} zoomLevel Zoom level of control
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 */
	ProcessFlowConnectionRenderer._writeFirstRowOfSpecialLine = function (oRm, connection, zoomLevel, oControl) {
		// Left column
		oRm.write("<div");
		oRm.addClass("floatLeft");
		if (oControl._getShowLabels()) {
			oRm.addClass("sapSuiteUiPFWithLabel");
		}
		switch (zoomLevel) {
			case library.ProcessFlowZoomLevel.One:
				oRm.addClass("boxZoom1Width");
				oRm.addClass("boxTopZoom1Height");
				break;
			case library.ProcessFlowZoomLevel.Three:
				oRm.addClass("boxZoom3Width");
				oRm.addClass("boxTopZoom3Height");
				break;
			case library.ProcessFlowZoomLevel.Four:
				oRm.addClass("boxZoom4Width");
				oRm.addClass("boxTopZoom4Height");
				break;
			default:
				oRm.addClass("boxZoom2Width");
				oRm.addClass("boxTopZoom2Height");
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		// Middle column
		oRm.write("<div");
		if (oControl._getShowLabels()) {
			oRm.addClass("sapSuiteUiPFWithLabel");
		}
		oRm.addClass("floatLeft");
		switch (zoomLevel) {
			case library.ProcessFlowZoomLevel.One:
				oRm.addClass("boxTopZoom1Height");
				break;
			case library.ProcessFlowZoomLevel.Three:
				oRm.addClass("boxTopZoom3Height");
				break;
			case library.ProcessFlowZoomLevel.Four:
				oRm.addClass("boxTopZoom4Height");
				break;
			default:
				oRm.addClass("boxTopZoom2Height");
		}
		if (connection.hasOwnProperty("top") && connection.top.draw) {
			oRm.addClass("boxMiddleBorderWidth");
			oRm.addClass("borderLeft");
			if (connection.top.type === library.ProcessFlowConnectionType.Planned) {
				oRm.addClass("borderLeftTypePlanned");
			} else {
				oRm.addClass("borderLeftTypeNormal");
			}
			if (connection.top.state === library.ProcessFlowConnectionState.Highlighted) {
				oRm.addClass("borderLeftStateHighlighted");
				oRm.addClass("stateHighlighted");
			} else if (connection.top.state === library.ProcessFlowConnectionState.Dimmed) {
				oRm.addClass("borderLeftStateDimmed");
			} else if (connection.top.state === library.ProcessFlowConnectionState.Selected) {
				oRm.addClass("borderLeftStateSelected");
				oRm.addClass("stateSelected");
			} else {
				oRm.addClass("borderLeftStateRegular");
				oRm.addClass("stateRegular");
			}
		} else {
			oRm.addClass("boxMiddleWidth");
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		// Right column
		// Omitted
	};

	/**
	 * Writes the second row of a special line (e.g. branch).
	 *
	 * @private
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {object} connection Connection which needs to be checked
	 * @param {object} zoomLevel Zoom level of control
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 */
	ProcessFlowConnectionRenderer._writeSecondRowOfSpecialLine = function (oRm, connection, zoomLevel, oControl) {
		ProcessFlowConnectionRenderer._resetFloat(oRm);

		// Left column
		oRm.write("<div");
		oRm.addClass("floatLeft");
		if (oControl._getShowLabels()) {
			oRm.addClass("sapSuiteUiPFWithLabel");
		}
		switch (zoomLevel) {
			case library.ProcessFlowZoomLevel.One:
				oRm.addClass("boxZoom1Width");
				break;
			case library.ProcessFlowZoomLevel.Three:
				oRm.addClass("boxZoom3Width");
				break;
			case library.ProcessFlowZoomLevel.Four:
				oRm.addClass("boxZoom4Width");
				break;
			default:
				oRm.addClass("boxZoom2Width");
		}
		if (connection.hasOwnProperty("left") && connection.left.draw) {
			oRm.addClass("boxMiddleBorderHeight");
			oRm.addClass("borderBottom");
			if (connection.left.type === library.ProcessFlowConnectionType.Planned) {
				oRm.addClass("borderBottomTypePlanned");
			} else {
				oRm.addClass("borderBottomTypeNormal");
			}
			if (connection.left.state === library.ProcessFlowConnectionState.Highlighted) {
				oRm.addClass("borderBottomStateHighlighted");
				oRm.addClass("stateHighlighted");
			} else if (connection.left.state === library.ProcessFlowConnectionState.Dimmed) {
				oRm.addClass("borderBottomStateDimmed");
			} else if (connection.left.state === library.ProcessFlowConnectionState.Selected) {
				oRm.addClass("borderBottomStateSelected");
				oRm.addClass("stateSelected");
			} else {
				oRm.addClass("borderBottomStateRegular");
				oRm.addClass("stateRegular");
			}
		} else {
			oRm.addClass("boxMiddleHeight");
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		// Middle column
		oRm.write("<div");
		oRm.addClass("floatLeft");
		if (oControl._getShowLabels()) {
			oRm.addClass("sapSuiteUiPFWithLabel");
		}
		oRm.addClass("boxMiddleWidth");
		oRm.addClass("boxMiddleBorderHeight");
		if ((connection.hasOwnProperty("left") && connection.left.draw) ||
			(connection.hasOwnProperty("right") && connection.right.draw) ||
			(connection.hasOwnProperty("top") && connection.top.draw) ||
			(connection.hasOwnProperty("bottom") && connection.bottom.draw)) {
			oRm.addClass("borderBottom");
			oRm.addClass("borderBottomTypeNormal");
			if (connection.right.state === library.ProcessFlowConnectionState.Highlighted ||
				connection.top.state === library.ProcessFlowConnectionState.Highlighted ||
				connection.left.state === library.ProcessFlowConnectionState.Highlighted ||
				connection.bottom.state === library.ProcessFlowConnectionState.Highlighted) {
				oRm.addClass("borderBottomStateHighlighted");
				oRm.addClass("stateHighlighted");
			} else if (connection.right.state === library.ProcessFlowConnectionState.Selected ||
				connection.top.state === library.ProcessFlowConnectionState.Selected ||
				connection.left.state === library.ProcessFlowConnectionState.Selected ||
				connection.bottom.state === library.ProcessFlowConnectionState.Selected) {
				oRm.addClass("borderBottomStateSelected");
				oRm.addClass("stateSelected");
			} else if (connection.right.state === library.ProcessFlowConnectionState.Dimmed ||
				connection.top.state === library.ProcessFlowConnectionState.Dimmed ||
				connection.left.state === library.ProcessFlowConnectionState.Dimmed ||
				connection.bottom.state === library.ProcessFlowConnectionState.Dimmed) {
				oRm.addClass("borderBottomStateDimmed");
			} else {
				oRm.addClass("borderBottomStateRegular");
				oRm.addClass("stateRegular");
			}
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		// Right column
		oRm.write("<div");
		oRm.addClass("floatLeft");
		if (oControl._getShowLabels()) {
			oRm.addClass("sapSuiteUiPFWithLabel");
		}
		if (connection.arrow) {
			oRm.addClass("parentPosition");
			switch (zoomLevel) {
				case library.ProcessFlowZoomLevel.One:
					oRm.addClass("boxArrowZoom1Width");
					break;
				case library.ProcessFlowZoomLevel.Three:
					oRm.addClass("boxArrowZoom3Width");
					break;
				case library.ProcessFlowZoomLevel.Four:
					oRm.addClass("boxArrowZoom4Width");
					break;
				default:
					oRm.addClass("boxArrowZoom2Width");
			}
		} else if (oControl._getShowLabels()) {
			switch (zoomLevel) {
				case library.ProcessFlowZoomLevel.One:
					oRm.addClass("boxZoom1WidthWithLabel");
					break;
				case library.ProcessFlowZoomLevel.Three:
					oRm.addClass("boxZoom3WidthWithLabel");
					break;
				case library.ProcessFlowZoomLevel.Four:
					oRm.addClass("boxZoom4WidthWithLabel");
					break;
				default:
					oRm.addClass("boxZoom2WidthWithLabel");
			}
		} else {
			switch (zoomLevel) {
				case library.ProcessFlowZoomLevel.One:
					oRm.addClass("boxZoom1Width");
					break;
				case library.ProcessFlowZoomLevel.Three:
					oRm.addClass("boxZoom3Width");
					break;
				case library.ProcessFlowZoomLevel.Four:
					oRm.addClass("boxZoom4Width");
					break;
				default:
					oRm.addClass("boxZoom2Width");
			}
		}
		if (connection.hasOwnProperty("right") && connection.right.draw) {
			oRm.addClass("boxMiddleBorderHeight");
			oRm.addClass("borderBottom");
			if (connection.right.type === library.ProcessFlowConnectionType.Planned) {
				oRm.addClass("borderBottomTypePlanned");
			} else {
				oRm.addClass("borderBottomTypeNormal");
			}
			if (connection.right.state === library.ProcessFlowConnectionState.Highlighted) {
				oRm.addClass("borderBottomStateHighlighted");
				oRm.addClass("stateHighlighted");
			} else if (connection.right.state === library.ProcessFlowConnectionState.Dimmed) {
				oRm.addClass("borderBottomStateDimmed");
			} else if (connection.right.state === library.ProcessFlowConnectionState.Selected) {
				oRm.addClass("borderBottomStateSelected");
				oRm.addClass("stateSelected");
			} else {
				oRm.addClass("borderBottomStateRegular");
				oRm.addClass("stateRegular");
			}
		} else {
			oRm.addClass("boxMiddleHeight");
		}
		oRm.writeClasses();
		oRm.write(">");

		if (connection.labels && oControl._showLabels) {
			ProcessFlowConnectionRenderer._renderLabel(oRm, oControl, connection);
		}

		if (connection.arrow) {
			oRm.write("<div");
			oRm.addClass("arrowRight");
			if (connection.hasOwnProperty("right")) {
				if (connection.right.state === library.ProcessFlowConnectionState.Highlighted) {
					oRm.addClass("borderLeftStateHighlighted");
				} else if (connection.right.state === library.ProcessFlowConnectionState.Dimmed) {
					oRm.addClass("borderLeftStateDimmed");
				} else if (connection.right.state === library.ProcessFlowConnectionState.Selected) {
					oRm.addClass("borderLeftStateSelected");
				} else {
					oRm.addClass("borderLeftStateRegular");
				}
			}
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");
		}
		oRm.write("</div>");
	};

	/**
	 * Writes the third row of a special line (e.g. branch).
	 *
	 * @private
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {object} connection Connection which needs to be checked
	 * @param {object} zoomLevel Zoom level of control
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 */
	ProcessFlowConnectionRenderer._writeThirdRowOfSpecialLine = function (oRm, connection, zoomLevel, oControl) {
		ProcessFlowConnectionRenderer._resetFloat(oRm);

		// Left column
		oRm.write("<div");
		oRm.addClass("floatLeft");
		if (oControl._getShowLabels()) {
			oRm.addClass("sapSuiteUiPFWithLabel");
		}
		switch (zoomLevel) {
			case library.ProcessFlowZoomLevel.One:
				oRm.addClass("boxZoom1Width");
				oRm.addClass("boxBottomZoom1Height");
				break;
			case library.ProcessFlowZoomLevel.Three:
				oRm.addClass("boxZoom3Width");
				oRm.addClass("boxBottomZoom3Height");
				break;
			case library.ProcessFlowZoomLevel.Four:
				oRm.addClass("boxZoom4Width");
				oRm.addClass("boxBottomZoom4Height");
				break;
			default:
				oRm.addClass("boxZoom2Width");
				oRm.addClass("boxBottomZoom2Height");
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		// Middle column
		oRm.write("<div");
		if (oControl._getShowLabels()) {
			oRm.addClass("sapSuiteUiPFWithLabel");
		}
		oRm.addClass("floatLeft");
		switch (zoomLevel) {
			case library.ProcessFlowZoomLevel.One:
				oRm.addClass("boxBottomZoom1Height");
				break;
			case library.ProcessFlowZoomLevel.Three:
				oRm.addClass("boxBottomZoom3Height");
				break;
			case library.ProcessFlowZoomLevel.Four:
				oRm.addClass("boxBottomZoom4Height");
				break;
			default:
				oRm.addClass("boxBottomZoom2Height");
		}
		if (connection.hasOwnProperty("bottom") && connection.bottom.draw) {
			oRm.addClass("boxMiddleBorderWidth");
			oRm.addClass("borderLeft");
			if (connection.bottom.type === library.ProcessFlowConnectionType.Planned) {
				oRm.addClass("borderLeftTypePlanned");
			} else {
				oRm.addClass("borderLeftTypeNormal");
			}
			if (connection.bottom.state === library.ProcessFlowConnectionState.Highlighted) {
				oRm.addClass("borderLeftStateHighlighted");
				oRm.addClass("stateHighlighted");
			} else if (connection.bottom.state === library.ProcessFlowConnectionState.Dimmed) {
				oRm.addClass("borderLeftStateDimmed");
			} else if (connection.bottom.state === library.ProcessFlowConnectionState.Selected) {
				oRm.addClass("borderLeftStateSelected");
				oRm.addClass("stateSelected");
			} else {
				oRm.addClass("borderLeftStateRegular");
				oRm.addClass("stateRegular");
			}
		} else {
			oRm.addClass("boxMiddleWidth");
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		// Right column
		// Omitted
	};

	/**
	 * Resets the float.
	 *
	 * @private
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 */
	ProcessFlowConnectionRenderer._resetFloat = function (oRm) {
		oRm.write("<div");
		oRm.addClass("floatClear");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");
	};

	/**
	 * Renders the label based on criteria like state and priority.
	 *
	 * @private
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 */
	ProcessFlowConnectionRenderer._renderLabel = function (oRm, oControl) {
		var oLabel = oControl._getVisibleLabel();
		if (oControl.getAggregation("_labels")) {
			var aLabels = oControl.getAggregation("_labels");
			for (var i = 0; i < aLabels.length; i++) {
				if (aLabels[i]._getSelected()) {
					oLabel._setDimmed(false);
					if (aLabels[i].getId() !== oLabel.getId()) {
						oLabel._setSelected(true);
						aLabels[i]._setSelected(false);
					}
				}
			}
		}
		if (oLabel) {
			oRm.renderControl(oLabel);
		}
	};


	return ProcessFlowConnectionRenderer;

}, /* bExport= */ true);
