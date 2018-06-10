/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.utils.labelForRepresentationTypes');
(function() {
	'use strict';
	sap.apf.modeler.ui.utils.LabelForRepresentationTypes = function(oTextReader) {
		this.oTextReader = oTextReader;
	};
	sap.apf.modeler.ui.utils.LabelForRepresentationTypes.prototype.constructor = sap.apf.modeler.ui.utils.LabelForRepresentationTypes;
	sap.apf.modeler.ui.utils.LabelForRepresentationTypes.prototype.getLabelsForChartType = function(sRepresentationType, sKind) {
		var xyAxisChartLabel = {
			"xAxis" : this.oTextReader("dim-for-xaxis"),
			"legend" : this.oTextReader("dim-for-legend"),
			"yAxis" : this.oTextReader("meas-for-yaxis")
		};
		var yxAxisChartLabel = {
			"xAxis" : this.oTextReader("dim-for-yaxis"),
			"legend" : this.oTextReader("dim-for-legend"),
			"yAxis" : this.oTextReader("meas-for-xaxis")
		};
		var oRepresentationTypeLabels = {
			"ColumnChart" : xyAxisChartLabel,
			"BarChart" : yxAxisChartLabel,
			"LineChart" : xyAxisChartLabel,
			"LineChartWithTwoVerticalAxes" : {
				"xAxis" : this.oTextReader("dim-for-xaxis"),
				"legend" : this.oTextReader("dim-for-legend"),
				"yAxis" : this.oTextReader("meas-for-leftVAxis"),
				"yAxis2" : this.oTextReader("meas-for-rightVAxis")
			},
			"LineChartWithTimeAxis" : xyAxisChartLabel,
			"PieChart" : {
				"sectorColor" : this.oTextReader("dim-for-sectorColor"),
				"sectorSize" : this.oTextReader("meas-for-sectorSize")
			},
			"ScatterPlotChart" : {
				"regionColor" : this.oTextReader("dim-for-colorDataPoints"),
				"regionShape" : this.oTextReader("dim-for-shapeDataPoints"),
				"xAxis" : this.oTextReader("meas-for-xaxis"),
				"yAxis" : this.oTextReader("meas-for-yaxis")
			},
			"BubbleChart" : {
				"regionColor" : this.oTextReader("dim-for-bubbleColor"),
				"regionShape" : this.oTextReader("dim-for-bubbleShape"),
				"xAxis" : this.oTextReader("meas-for-xaxis"),
				"yAxis" : this.oTextReader("meas-for-yaxis"),
				"bubbleWidth" : this.oTextReader("meas-for-bubbleWidth")
			},
			"StackedColumnChart" : xyAxisChartLabel,
			"StackedBarChart" : yxAxisChartLabel,
			"PercentageStackedColumnChart" : xyAxisChartLabel,
			"PercentageStackedBarChart" : yxAxisChartLabel,
			"HeatmapChart" : {
				"xAxis" : this.oTextReader("dim-for-xaxis"),
				"xAxis2" : this.oTextReader("dim-for-yaxis"),
				"sectorColor" : this.oTextReader("meas-for-sectorColor")
			},
			"TableRepresentation" : {
				"column" : this.oTextReader("prop-for-column")
			},
			"TreeTableRepresentation" : {
				"hierarchicalColumn" : this.oTextReader("prop-for-hierarchy-column"),
				"column" : this.oTextReader("prop-for-column")
			}
		};
		return oRepresentationTypeLabels[sRepresentationType][sKind];
	};
})();