/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.heatmapChart");
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");
/**
 * @class heatMapChart constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
(function() {
	"use strict";
	sap.apf.ui.representations.heatmapChart = function(oApi, oParameters) {
		sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.HEATMAP_CHART;
		this.chartType = sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.HEATMAP;
		this._addDefaultKind();
	};
	sap.apf.ui.representations.heatmapChart.prototype = Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to heatMapChart
	sap.apf.ui.representations.heatmapChart.prototype.constructor = sap.apf.ui.representations.heatmapChart;
	/** 
	 * @private
	 * @method _addDefaultKind
	 * @description reads the oParameters for chart and modifies it by including a default feedItem id 
	 * in case the "kind" property is not defined in dimension/measures
	 * it adds kind only for minimum required parameters
	 */
	sap.apf.ui.representations.heatmapChart.prototype._addDefaultKind = function() {
		this.parameter.measures.forEach(function(measure) {
			if (measure.kind === undefined) {//handle the scenario where the kind is not available
				measure.kind = sap.apf.core.constants.representationMetadata.kind.SECTORCOLOR;
			}
		});
		this.parameter.dimensions.forEach(function(dimension, index) {
			if (dimension.kind === undefined) {//handle the scenario where the kind is not available
				dimension.kind = index === 0 ? sap.apf.core.constants.representationMetadata.kind.XAXIS : sap.apf.core.constants.representationMetadata.kind.XAXIS2;
			}
		});
	};
	/** 
	 * @method setVizPropsForSpecificRepresentation
	 * @description sets the vizProperies specific to the representation on main chart
	 */
	sap.apf.ui.representations.heatmapChart.prototype.setVizPropsForSpecificRepresentation = function() {
		this.chart.setVizProperties({
			categoryAxis2 : {
				visible : true,
				title : {
					visible : true
				},
				label : {
					visible : true
				}
			}
		});
	};
	/** 
	* @method setVizPropsForSpecificRepresentation
	* @description sets the vizProperies specific to the representation on thumbnail chart
	*/
	sap.apf.ui.representations.heatmapChart.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
		this.thumbnailChart.setVizProperties({
			categoryAxis2 : {
				visible : false,
				title : {
					visible : false
				}
			}
		});
	};
	sap.apf.ui.representations.heatmapChart.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = sap.apf.core.constants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.XAXIS:
				axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.CATEGORYAXIS;
				break;
			case oSupportedTypes.XAXIS2:
				axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.CATEGORYAXIS2;
				break;
			case oSupportedTypes.SECTORCOLOR:
				axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.COLOR;
				break;
			default:
				break;
		}
		return axisfeedItemId;
	};
}());