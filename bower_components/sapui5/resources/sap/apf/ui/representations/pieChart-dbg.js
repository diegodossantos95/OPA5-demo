/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.declare("sap.apf.ui.representations.pieChart");
/** 
 * @class pieChart constructor.
* @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
* @returns chart object 
 */
(function() {
	"use strict";
	sap.apf.ui.representations.pieChart = function(oApi, oParameters) {
		sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.PIE_CHART;
		this.chartType = sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.PIE;
		this._addDefaultKind();
	};
	sap.apf.ui.representations.pieChart.prototype = Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to pieChart
	sap.apf.ui.representations.pieChart.prototype.constructor = sap.apf.ui.representations.pieChart;
	/**
	* @private 
	 * @method _addDefaultKind
	* @description reads the oParameters for chart and modifies it by including a default kind
	 * in case the "kind" property is not defined in dimension/measures
	*/
	sap.apf.ui.representations.pieChart.prototype._addDefaultKind = function() {
		this.parameter.measures.forEach(function(measure) {
			if (measure.kind === undefined) {//handle the scenario where the kind is not available
				measure.kind = sap.apf.core.constants.representationMetadata.kind.SECTORSIZE;
			}
		});
		this.parameter.dimensions.forEach(function(dimension) {
			if (dimension.kind === undefined) {//handle the scenario where the kind is not available
				dimension.kind = sap.apf.core.constants.representationMetadata.kind.SECTORCOLOR;
			}
		});
	};
	sap.apf.ui.representations.pieChart.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = sap.apf.core.constants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.SECTORCOLOR:
				axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.COLOR;
				break;
			case oSupportedTypes.SECTORSIZE:
				axisfeedItemId = sap.apf.core.constants.vizFrame.feedItemTypes.SIZE;
				break;
			default:
				break;
		}
		return axisfeedItemId;
	};
}());