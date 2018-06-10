/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.declare("sap.apf.ui.representations.stackedColumnChart");
/** 
 * @class stackedColumnChart constructor.
* @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
* @returns chart object 
 */
(function() {
	"use strict";
	sap.apf.ui.representations.stackedColumnChart = function(oApi, oParameters) {
		sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.STACKED_COLUMN_CHART;
		this.chartType = sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.STACKED_COLUMN;
		this._addDefaultKind();
	};
	sap.apf.ui.representations.stackedColumnChart.prototype = Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to stackedColumnChart
	sap.apf.ui.representations.stackedColumnChart.prototype.constructor = sap.apf.ui.representations.stackedColumnChart;
	/** 
	 * @private
	* @method _addDefaultKind
	* @description reads the oParameters for chart and modifies it by including a default kind
	 * in case the "kind" property is not defined in dimension/measures
	*/
	sap.apf.ui.representations.stackedColumnChart.prototype._addDefaultKind = function() {
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
	 * @private
	* @method _setVizPropsCommonToMainAndThumbnailCharts
	* @description since the property is same for main and thumbnail so for reusability purpose created this method
	*/
	function _setVizPropsCommonToMainAndThumbnailCharts(chart) {
		chart.setVizProperties({
			plotArea : {
				animation : {
					dataLoading : false,
					dataUpdating : false
				}
			}
		});
	}
	/** 
	 * @method setVizPropsForSpecificRepresentation
	 * @description sets the vizProperies specific to the representation on main chart
	 */
	sap.apf.ui.representations.stackedColumnChart.prototype.setVizPropsForSpecificRepresentation = function() {
		_setVizPropsCommonToMainAndThumbnailCharts(this.chart);
	};
	/** 
	* @method setVizPropsForSpecificRepresentation
	* @description sets the vizProperies specific to the representation on thumbnail chart
	*/
	sap.apf.ui.representations.stackedColumnChart.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
		_setVizPropsCommonToMainAndThumbnailCharts(this.thumbnailChart);
	};
	sap.apf.ui.representations.stackedColumnChart.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = sap.apf.core.constants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.XAXIS:
				axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.CATEGORYAXIS;
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