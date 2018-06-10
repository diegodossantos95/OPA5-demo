/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.lineChartWithTimeAxis");
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");
/**
 * @class lineChartWithTimeAxis constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
(function() {
	"use strict";
	sap.apf.ui.representations.lineChartWithTimeAxis = function(oApi, oParameters) {
		sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.LINE_CHART_WITH_TIME_AXIS;
		this.chartType = sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.LINE_CHART_WITH_TIME_AXIS;
		this.setDateType();
		this._addDefaultKind();
	};
	sap.apf.ui.representations.lineChartWithTimeAxis.prototype = Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to lineChartWithTimeAxis
	sap.apf.ui.representations.lineChartWithTimeAxis.prototype.constructor = sap.apf.ui.representations.lineChartWithTimeAxis;
	sap.apf.ui.representations.lineChartWithTimeAxis.prototype.setDateType = function() {
		var i;
		for(i = 0; i < this.parameter.dimensions.length; i++) {
			if (this.parameter.dimensions[i].kind === sap.apf.core.constants.representationMetadata.kind.XAXIS) {
				this.parameter.dimensions[i].dataType = "date";
			}
		}
	};
	/** 
	 * @method _addDefaultKind
	* @description reads the oParameters for chart and modifies it by including a default feedItem id 
	 * in case the "kind" property is not defined in dimension/measures
	*/
	sap.apf.ui.representations.lineChartWithTimeAxis.prototype._addDefaultKind = function() {
		this.parameter.measures.forEach(function(measure) {
			if (measure.kind === undefined) {//handle the scenario where the kind is not available
				measure.kind = sap.apf.core.constants.representationMetadata.kind.YAXIS;
			}
		});
		this.parameter.dimensions.forEach(function(dimension, index) {
			if (dimension.kind === undefined) {//handle the scenario where the kind is not available
				dimension.kind = index === 0 ? sap.apf.core.constants.representationMetadata.kind.XAXIS : sap.apf.core.constants.representationMetadata.kind.LEGEND;
			}
		});
	};
	/** 
	 * @method setVizPropsForSpecificRepresentation
	 * @description sets the vizProperies specific to the representation on main chart
	 */
	sap.apf.ui.representations.lineChartWithTimeAxis.prototype.setVizPropsForSpecificRepresentation = function() {
		this.chart.setVizProperties({
			timeAxis : {
				visible : true,
				title : {
					visible : true
				},
				label : {
					visible : true
				}
			},
			plotArea : {
				window : {
					start : "firstDataPoint",
					end : "lastDataPoint"
				}
			}
		});
	};
	/** 
	* @method setVizPropsForSpecificRepresentation
	* @description sets the vizProperies specific to the representation on thumbnail chart
	*/
	sap.apf.ui.representations.lineChartWithTimeAxis.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
		this.thumbnailChart.setVizProperties({
			timeAxis : {
				visible : false,
				title : {
					visible : false
				}
			},
			plotArea : {
				window : {
					start : "firstDataPoint",
					end : "lastDataPoint"
				}
			}
		});
	};
	sap.apf.ui.representations.lineChartWithTimeAxis.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = sap.apf.core.constants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.XAXIS:
				axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.TIMEAXIS;
				break;
			case oSupportedTypes.YAXIS:
				axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.VALUEAXIS;
				break;
			case oSupportedTypes.LEGEND:
				axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.COLOR;
				break;
			default:
				break;
		}
		return axisfeedItemId;
	};
}());