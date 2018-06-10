/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.representationTypes");
jQuery.sap.require("sap.apf.core.constants");
(function() {
	'use strict';
	/**
	 * @memberOf sap.apf.core
	 * @description Default configuration of representation types. Can be overwritten in the analytical configuration file.
	 * @returns {object[]} representation types array with configuration objects for representation types
	 */
	sap.apf.core.representationTypes = function() {
		return [ {
			"type" : "representationType",
			"id" : "ColumnChart",
			"constructor" : "sap.apf.ui.representations.columnChart",
			"picture" : "sap-icon://bar-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "ColumnChart"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
						"min" : "1",
						"max" : "*"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND,
						"min" : "0",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
						"min" : "1",
						"max" : "*"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "BarChart",
			"constructor" : "sap.apf.ui.representations.barChart",
			"picture" : "sap-icon://horizontal-bar-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "BarChart"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
						"min" : "1",
						"max" : "*"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND,
						"min" : "0",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
						"min" : "1",
						"max" : "*"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "LineChart",
			"constructor" : "sap.apf.ui.representations.lineChart",
			"picture" : "sap-icon://line-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "LineChart"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
						"min" : "1",
						"max" : "*"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND,
						"min" : "0",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
						"min" : "1",
						"max" : "*"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "LineChartWithTwoVerticalAxes",
			"constructor" : "sap.apf.ui.representations.lineChartWithTwoVerticalAxes",
			"picture" : "sap-icon://line-chart-dual-axis",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "LineChartWithTwoVerticalAxes"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
						"min" : "1",
						"max" : "*"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND,
						"min" : "0",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
						"min" : "1",
						"max" : "*"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS2,
						"min" : "1",
						"max" : "*"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "LineChartWithTimeAxis",
			"constructor" : "sap.apf.ui.representations.lineChartWithTimeAxis",
			"picture" : "sap-icon://line-chart-time-axis",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "LineChartWithTimeAxis"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
						"min" : "1",
						"max" : "1"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND,
						"min" : "0",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
						"min" : "1",
						"max" : "*"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "PieChart",
			"constructor" : "sap.apf.ui.representations.pieChart",
			"picture" : "sap-icon://pie-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "PieChart"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.SECTORCOLOR,
						"min" : "1",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.SECTORSIZE,
						"min" : "1",
						"max" : "1"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "ScatterPlotChart",
			"constructor" : "sap.apf.ui.representations.scatterPlotChart",
			"picture" : "sap-icon://scatter-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "ScatterPlotChart"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.REGIONCOLOR,
						"min" : "1",
						"max" : "*"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.REGIONSHAPE,
						"min" : "0",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
						"min" : "1",
						"max" : "1"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
						"min" : "1",
						"max" : "1"
					} ]
				},
				"sortable" : false
			}
		}, {
			"type" : "representationType",
			"id" : "BubbleChart",
			"constructor" : "sap.apf.ui.representations.bubbleChart",
			"picture" : "sap-icon://bubble-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "BubbleChart"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.REGIONCOLOR,
						"min" : "1",
						"max" : "*"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.REGIONSHAPE,
						"min" : "0",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
						"min" : "1",
						"max" : "1"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
						"min" : "1",
						"max" : "1"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.BUBBLEWIDTH,
						"min" : "1",
						"max" : "1"
					} ]
				},
				"sortable" : false
			}
		}, {
			"type" : "representationType",
			"id" : "StackedColumnChart",
			"constructor" : "sap.apf.ui.representations.stackedColumnChart",
			"picture" : "sap-icon://vertical-stacked-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "StackedColumnChart"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
						"min" : "1",
						"max" : "*"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND,
						"min" : "0",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
						"min" : "1",
						"max" : "*"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "StackedBarChart",
			"constructor" : "sap.apf.ui.representations.stackedBarChart",
			"picture" : "sap-icon://horizontal-stacked-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "StackedBarChart"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
						"min" : "1",
						"max" : "*"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND,
						"min" : "0",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
						"min" : "1",
						"max" : "*"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "PercentageStackedColumnChart",
			"constructor" : "sap.apf.ui.representations.percentageStackedColumnChart",
			"picture" : "sap-icon://full-stacked-column-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "PercentageStackedColumnChart"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
						"min" : "1",
						"max" : "*"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND,
						"min" : "0",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
						"min" : "1",
						"max" : "*"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "PercentageStackedBarChart",
			"constructor" : "sap.apf.ui.representations.percentageStackedBarChart",
			"picture" : "sap-icon://full-stacked-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "PercentageStackedBarChart"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
						"min" : "1",
						"max" : "*"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND,
						"min" : "0",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS,
						"min" : "1",
						"max" : "*"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "HeatmapChart",
			"constructor" : "sap.apf.ui.representations.heatmapChart",
			"picture" : "sap-icon://heatmap-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "HeatmapChart"
			},
			"metadata" : {
				"dimensions" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS,
						"min" : "1",
						"max" : "*"
					}, {
						"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS2,
						"min" : "0",
						"max" : "*"
					} ]
				},
				"measures" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.SECTORCOLOR,
						"min" : "1",
						"max" : "1"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "TableRepresentation",
			"constructor" : "sap.apf.ui.representations.table",
			"picture" : "sap-icon://table-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "tableView"
			},
			"metadata" : {
				"properties" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.COLUMN,
						"min" : "1",
						"max" : "*"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "TreeTableRepresentation",
			"constructor" : "sap.apf.ui.representations.treeTable",
			"picture" : "sap-icon://tree",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "treeTable"
			},
			"metadata" : {
				"hierarchicalColumn" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.HIERARCHIALCOLUMN,
						"min" : "1",
						"max" : "1"
					} ]
				},
				"properties" : {
					"supportedKinds" : [ {
						"kind" : sap.apf.core.constants.representationMetadata.kind.COLUMN,
						"min" : "1",
						"max" : "*"
					} ]
				}
			}
		}, {
			"type" : "representationType",
			"id" : "ColumnChartSorted",
			"constructor" : "sap.apf.ui.representations.columnChart",
			"picture" : "sap-icon://vertical-bar-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "ColumnChartSorted"
			}
		}, {
			"type" : "representationType",
			"id" : "ColumnChartClustered",
			"constructor" : "sap.apf.ui.representations.columnChart",
			"picture" : "sap-icon://bar-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "ColumnChartClustered"
			}
		}, {
			"type" : "representationType",
			"id" : "ColumnChartClusteredSorted",
			"constructor" : "sap.apf.ui.representations.columnChart",
			"picture" : "sap-icon://vertical-bar-chart-2",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "ColumnChartClusteredSorted"
			}
		}, {
			"type" : "representationType",
			"id" : "StackedColumnSorted",
			"constructor" : "sap.apf.ui.representations.stackedColumnChart",
			"picture" : "sap-icon://upstacked-chart",
			"label" : {
				"type" : "label",
				"kind" : "text",
				"key" : "StackedColumnSorted"
			}
		} ];
	};
}());
