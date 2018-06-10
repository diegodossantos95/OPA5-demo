/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.BaseVizFrameChartRepresentation");
jQuery.sap.require("sap.apf.ui.representations.BaseUI5ChartRepresentation");
jQuery.sap.require("sap.apf.ui.utils.constants");
jQuery.sap.require("sap.viz.ui5.controls.VizFrame");
jQuery.sap.require("sap.viz.ui5.controls.common.feeds.FeedItem");
(function() {
	'use strict';
	sap.apf.ui.representations.BaseVizFrameChartRepresentation = function(oApi, oParameters) {
		sap.apf.ui.representations.BaseUI5ChartRepresentation.apply(this, [ oApi, oParameters ]);
	};
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype = Object.create(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype);
	//Set the "constructor" property to refer to BaseUI5ChartRepresentation
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.constructor = sap.apf.ui.representations.BaseVizFrameChartRepresentation;
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.destroy = function() {
		if (this.chart) {
			this.chart.destroyDataset();
			this.chart.destroyFeeds();
			this.chart.detachRenderComplete(this.fnDrawSelectionOnMainChart);
			this.fnDrawSelectionOnMainChart = null;
		}
		if (this.thumbnailChart) {
			this.thumbnailChart.destroyDataset();
			this.thumbnailChart.destroyFeeds();
			this.thumbnailChart.detachRenderComplete(this.fnDrawSelectionOnThumbnailChart);
			this.fnDrawSelectionOnThumbnailChart = null;
		}
		sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype.destroy.call(this);
	};
	/**
	 * @method getMeasures
	 * @return the measures for a chart
	 */
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.getMeasures = function() {
		return this.measure;
	};
	/**
	 * @method getMainContent
	 * @param oStepTitle title of the main chart
	 * @param width width of the main chart
	 * @param height height of the main chart
	 * @description draws Main chart into the Chart area
	 */
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.getMainContent = function(oStepTitle, width, height) {
		var self = this;
		var superClass = this;
		var chartHeight = height || 725;
		chartHeight = chartHeight + "px";
		var chartWidth = width || 1000;
		chartWidth = chartWidth + "px";
		this.title = oStepTitle;
		// vizFrame chart constructor
		this.createDataset();
		if (!this.chart) {//If chart instance does not exist create a new instance
			this.chart = new sap.viz.ui5.controls.VizFrame({
				vizType : this.chartType,//comes from specific representation
				dataset : this.dataset,
				width : chartWidth,
				height : chartHeight,
				uiConfig : {
					applicationSet : "fiori"
				}
			});
			this.setVizPropertiesOnChart();
			/**
			* @method attachRenderComplete
			* @param event which is triggered on when the chart is initialized
			* @description Draws the selection
			*/
			this.fnDrawSelectionOnMainChart = this.drawSelectionOnMainChart.bind(self);
			this.chart.attachRenderComplete(this.fnDrawSelectionOnMainChart);
			if (this.metadata) { //if metadata is available, do the formatting for measures
				var oMeasureWithFormatString = {};
				var sFormatStringForTooltip;
				this._createAndAddFeedItemBasedOnId(this.chart);
				this.measure.forEach(function(measure) {
					var sFormatString = superClass.getFormatStringForMeasure(measure); // get the format string for each measure
					sFormatStringForTooltip = superClass.getFormatStringForMeasureTooltip(measure);
					oMeasureWithFormatString.measure = measure;
					oMeasureWithFormatString.formatString = sFormatString; // associate the format string with each measure
					self.setFormatStringOnChart(oMeasureWithFormatString);
				});
				this.setFormatString("tooltip", sFormatStringForTooltip); //tooltip is not a feedItem Id, formatting has to be applied explicitly
				if (this.handleCustomFormattingOnChart) { //call the sub class formatting 
					this.handleCustomFormattingOnChart();
				}
			}
			superClass.attachSelectionAndFormatValue.call(this, oStepTitle); // call the base class attachSelectionAndFormatValue
		} else {//If chart instance exists only update dataset, feeds and model
			if (width) {
				this.chart.setWidth(chartWidth);
			}
			if (height) {
				this.chart.setHeight(chartHeight);
			}
			this.chart.destroyDataset();
			this.chart.removeAllFeeds();
			this.chart.destroyFeeds();
			this.chart.vizUpdate({
				'data' : this.dataset
			});
			this._createAndAddFeedItemBasedOnId(this.chart);
		}
		this.chart.setModel(this.oModel);
		return this.chart;
	};
	/**
	* @method setVizPropertiesOnChart
	* @description sets the vizProperties common to all charts
	*/
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.setVizPropertiesOnChart = function() {
		this.chart.setVizProperties({
			title : {
				visible : true,
				text : this.title
			},
			categoryAxis : {
				visible : true,
				title : {
					visible : true
				},
				label : {
					visible : true
				}
			},
			valueAxis : {
				visible : true,
				title : {
					visible : true
				},
				label : {
					visible : true
				}
			},
			legend : {
				visible : this.legendBoolean,
				title : {
					visible : this.legendBoolean
				},
				isScrollable : true
			},
			plotArea : {
				window : {
					start : null
				}
			},
			tooltip : {
				visible : true,
				label : {
					visible : true
				}
			},
			interaction : {
				behaviorType : null
			},
			general : {
				groupData : false
			}
		});
		this.validateSelectionModes();
		this.setVizPropsForSpecificRepresentation();//sets the vizProperties specific to the chart
	};
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.setVizPropsForSpecificRepresentation = function() {
	};
	/**
	* @method setFormatStringOnChart
	* @param {oMeasureFormatString}- 
	*              oMeasureFormatString : {
	*              measure : measure1,
	*              formatString : formatString
	              }
	* @description reads the boolean to indicate if all the measures have same unit semantic
	* and based on the axisFeedItemId from measures applies the formatting to the xAxis,yAxis,tooltip or sizeLegend
	*/
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.setFormatStringOnChart = function(oMeasureFormatString) {
		var sFormatString = oMeasureFormatString.formatString;
		var sChartPropertyName = oMeasureFormatString.measure.axisfeedItemId;
		this.setFormatString(sChartPropertyName, sFormatString); //based on the feedItem Id , set the format string on the chart
	};
	/**
	 * @method setFormatString
	 * @param sChartPropertyName ,chart property on which property has to be applied (e.g. xAxis, yAxis, tooltip) 
	 * @param sFormatString , the format string which has to be set for yAxis, xAxis or tooltip 
	 * @description sets the format string for axis label and tooltip
	 */
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.setFormatString = function(sChartPropertyName, formatString) {
		var superClass = this;
		var bIsAllMeasureSameUnit = superClass.getIsAllMeasureSameUnit();
		switch (sChartPropertyName) {
			case sap.apf.core.constants.vizFrame.feedItemTypes.VALUEAXIS:
				if (bIsAllMeasureSameUnit) { //apply the formatting only when all the measures have same unit semantic
					this.chart.setVizProperties({
						valueAxis : {
							label : {
								formatString : formatString
							}
						}
					});
				}
				break;
			case sap.apf.core.constants.vizFrame.feedItemTypes.VALUEAXIS2:
				if (bIsAllMeasureSameUnit) { //apply the formatting only when all the measures have same unit semantic
					this.chart.setVizProperties({
						valueAxis2 : {
							label : {
								formatString : formatString
							}
						}
					});
				}
				break;
			case sap.apf.core.constants.vizFrame.feedItemTypes.CATEGORYAXIS:
				this.chart.setVizProperties({
					categoryAxis : {
						label : {
							formatString : formatString
						}
					}
				});
				break;
			case sap.apf.core.constants.vizFrame.feedItemTypes.BUBBLEWIDTH:
				this.chart.setVizProperties({
					sizeLegend : {
						formatString : formatString
					}
				});
				break;
			case "tooltip":
				this.chart.setVizProperties({
					tooltip : {//takes one value unlike viz, in case of multiple measures which value should it be?
						formatString : formatString
					}
				});
				break;
			default:
				break;
		}
	};
	/**
	* @private
	* @function
	* @method _createAndAddFeedItemBasedOnId
	* @param {oChart}- instance of the chart
	* @description creates and adds the feedItem for dimensions/measures of a chart	
	*/
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype._createAndAddFeedItemBasedOnId = function(oChart) {
		var sameFeedItemMeasureGroup = this._createFeedItemGroup(this.parameter.measures); // create feedItem for all the measures
		this._addFeedItemsToChart(oChart, sameFeedItemMeasureGroup, "Measure"); // add measure feedItem to the chart	
		var sameFeedItemDimensionGroup = this._createFeedItemGroup(this.parameter.dimensions); // create feedItem for all the dimensions
		this._addFeedItemsToChart(oChart, sameFeedItemDimensionGroup, "Dimension"); // add dimension feedItem to the chart
	};
	/**
	* @private
	* @function
	* @method _createFeedItemGroup
	* @param {aDataToBeGrouped}- dimensions/measures for a chart, which have to be grouped based on the feedItem id assigned
	* @description reads the feedItem id from each dimension/measure
	*         
	*          e.g. dimensions = [{
	*				name : dimension.name,
	*				value : '{' + dimension.value + '}',
	*				axisfeedItemId : "categoryAxis"
	*			}];
	*
	*and groups the dimensions/measures based on the axisfeedItemId , 
	*@return sameFeedItemGroup - associative array for all the feedItems available in the dimensions/measures
	*
	*          e.g. sameFeedItemGroup = {
	*                                valueAxis : [{measure1},{measure2}],
	*                                categoryAxis : {{dimension1},{dimension2}]
	*                               }	
	*/
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype._createFeedItemGroup = function(aDataToBeGrouped) {
		var self = this;
		var sameFeedItemGroup = {};
		aDataToBeGrouped.forEach(function(data) { // group all the dimensions/measures based on the feedItem id
			data.axisfeedItemId = self.getAxisFeedItemId(data.kind);
			var feedItemList = sameFeedItemGroup[data.axisfeedItemId];
			if (feedItemList) { //if the group name exist for one feedItem id, push the data in that group
				var bFieldAlreadyExists = feedItemList.some(function(oData) {
					return oData.name === data.name;
				});
				if (!bFieldAlreadyExists) {
					feedItemList.push(data);
				}
			} else { //else create a new group name for the feedItem id and push the data into it
				sameFeedItemGroup[data.axisfeedItemId] = [ data ];
			}
		});
		return sameFeedItemGroup;
	};
	/**
	* @private
	* @function
	* @name _addFeedItemsToChart
	* @param {oChart}- instance of the chart
	* @param {oGroupedData}- associative array which has all the dimensions and measures grouped based on the feedItem Id
	* 
	*     oGroupedData = {
	*                     valueAxis : [{measure1},{measure2}],
	*                     categoryAxis : {{dimension1},{dimension2}]
	*                    }
	*
	*@param sFeedItemType- type of the feedItem (dimension/measure)
	*
	*@description creates an object which has the id and the values required for a feedItem
	*           oFeedItem = {
	*                         feedItemId : "categoryAxis" or "valueAxis" etc
	*                         value : [value1,value2]
	*                       }
	* 
	*creates chart feedItem and adds it to the vizFrame charts
	*/
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype._addFeedItemsToChart = function(oChart, oGroupedData, sFeedItemType) {
		for( var key in oGroupedData) { //loop through all the groups
			var oFeedItem = {};
			var aFeedItemValue = [];
			var i = 0;
			for(i in oGroupedData[key]) { //loop through all the measures/dimensions of one group
				aFeedItemValue.push(oGroupedData[key][i].name); //push all the measure/dimension name which has same feedIem id to an array
				oFeedItem.feedItemId = oGroupedData[key][0].axisfeedItemId; //assign one id to each feedItem object (all the id will be same in one group) 
			}
			oFeedItem.value = aFeedItemValue; //assign the values to each feedItem object
			var chartFeedItem = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid : oFeedItem.feedItemId,
				type : sFeedItemType,
				values : oFeedItem.value
			});
			oChart.addFeed(chartFeedItem);
		}
	};
	/**
	 * @method validateSelectionModes
	 * @description sets the different selection modes on the charts based on the required filter
	 */
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.validateSelectionModes = function() {
		if (this.parameter.requiredFilters === undefined || this.parameter.requiredFilters.length === 0) {
			this.chart.setVizProperties({
				interaction : {
					selectability : {
						mode : 'none'
					},
					behaviorType : null
				}
			});
		} else {
			this.chart.setVizProperties({
				interaction : {
					selectability : {
						mode : 'multiple'
					},
					behaviorType : null
				}
			});
			if (this.parameter.dimensions.length > 1) {
				if (this.parameter.requiredFilters[0] === this.parameter.dimensions[1].fieldName) {
					this.chart.setVizProperties({
						interaction : {
							selectability : {
								axisLabelSelection : false
							}
						}
					});
				} else if (this.parameter.requiredFilters[0] === this.parameter.dimensions[0].fieldName) {
					this.chart.setVizProperties({
						interaction : {
							selectability : {
								legendSelection : false
							}
						}
					});
				}
			}
		}
	};
	/**
	 *@method getThumbnailContent
	 *@description draws Thumbnail for the current chart type and returns to the calling object
	 *@returns thumbnail object for the chart type
	 */
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.getThumbnailContent = function() {
		var self = this;
		var superClass = this;
		var height = sap.apf.ui.utils.CONSTANTS.thumbnailDimensions.HEIGHT;
		var width = sap.apf.ui.utils.CONSTANTS.thumbnailDimensions.WIDTH;
		this.createDataset();
		if (!this.thumbnailChart) {//If thumbnail chart instance does not exist create a new instance
			this.thumbnailChart = new sap.viz.ui5.controls.VizFrame({
				vizType : this.chartType,
				width : width,
				height : height,
				dataset : this.dataset,
				uiConfig : {
					applicationSet : "fiori"
				}
			});
			this.setVizPropertiesOnThumbnailChart();
			this.fnDrawSelectionOnThumbnailChart = this.drawSelectionOnThumbnailChart.bind(self);
			this.thumbnailChart.attachRenderComplete(this.fnDrawSelectionOnThumbnailChart);
		} else {//If thumbnail chart instance exists only update dataset, feeds and model
			this.thumbnailChart.destroyDataset();
			this.thumbnailChart.removeAllFeeds();
			this.thumbnailChart.destroyFeeds();
			this.thumbnailChart.vizUpdate({
				'data' : this.dataset
			});
		}
		this._createAndAddFeedItemBasedOnId(this.thumbnailChart);
		superClass.createThumbnailLayout.call(this);// call the base class createThumbnailLayout
		return this.thumbnailLayout;
	};
	/**
	* @method setVizPropertiesOnChart
	* @description sets the vizProperties common to all charts(thumbnail)
	*/
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.setVizPropertiesOnThumbnailChart = function() {
		this.thumbnailChart.setVizProperties({
			title : {
				visible : false
			},
			categoryAxis : {
				visible : false,
				title : {
					visible : false
				}
			},
			valueAxis : {
				visible : false,
				title : {
					visible : false
				}
			},
			legend : {
				visible : false,
				title : {
					visible : false
				}
			},
			tooltip : {
				visible : false
			},
			interaction : {
				selectability : {
					axisLabelSelection : false,
					legendSelection : false,
					plotLassoSelection : false,
					plotStdSelection : false
				},
				enableHover : false,
				noninteractiveMode : true
			},
			background : {
				visible : false
			},
			general : {
				layout : {
					padding : 0
				},
				groupData : false
			},
			plotArea : {
				window : {
					start : null
				},
				gridline : {
					visible : false
				},
				dataLabel : {
					visible : false
				},
				seriesStyle : {
					rules : [ {
						properties : {
							width : 1
						}
					} ]
				}
			}
		});
		this.setVizPropsOfThumbnailForSpecificRepresentation();//sets the vizProperties specific to the chart
	};
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
	};
	/**
	 * @method setSelectionOnMainChart
	 * @param array of selected objects
	 * @description sets the Selection on main Chart
	 */
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.setSelectionOnMainChart = function(aSelection) {
		this.chart.vizSelection(aSelection);
	};
	/**
	 * @method setSelectionOnThumbnailChart
	 * @param array of selected objects
	 * @description sets the Selection on thumbnail Chart
	 */
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.setSelectionOnThumbnailChart = function(aSelection) {
		this.clearSelectionFromThumbnailChart();
		this.thumbnailChart.vizSelection(aSelection);
	};
	/**
	 * @method clearSelectionFromMainChart
	 * @description clears all Selection from main Chart
	 */
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.clearSelectionFromMainChart = function() {
		this.chart.vizSelection([], {
			clearSelection : true
		});
	};
	/**
	 * @method clearSelectionFromThumbnailChart
	 * @description clears all Selection from thumbnail Chart
	 */
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.clearSelectionFromThumbnailChart = function() {
		this.thumbnailChart.vizSelection([], {
			clearSelection : true
		});
	};
	/**
	 * @method getSelectionFromChart
	 * @description gets the selected datapoints on the chart
	 * @return the array of selections from the chart
	 */
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.getSelectionFromChart = function() {
		var aSelection = this.chart.vizSelection();
		return aSelection;
	};
	/**
	 * @method getIsGroupTypeChart
	 * @return a boolean to indicate if the chart is of type "group", e.g. scatter,bubble
	 */
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.getIsGroupTypeChart = function() {
		return this.bIsGroupTypeChart ? this.bIsGroupTypeChart : false;
	};
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.getAxisFeedItemId = function(sKind) {
	};
	/* 
	 * If the chart is vizframe clone the chart. Limitation with clone in viz frame as it does only shallow clone, Viz type and viz properties need to be set again
	 * Therefore we read existing viz properties set in the original chart and set in on the cloned chart
	 */
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype.getPrintContent = function(oStepTitle) {
		var oRepresentation, vizType = this.chartType, vizProperties = {}, aSelectionOnChart, oPrintObject;
		var oOriginalChart = this.getMainContent(oStepTitle);
		vizProperties = oOriginalChart.getVizProperties();
		oRepresentation = oOriginalChart.clone();
		oRepresentation.setVizType(vizType);
		oRepresentation.setVizProperties(vizProperties);
		oRepresentation.setWidth("1000px");
		oRepresentation.setHeight("600px");
		this.createDataset();
		oRepresentation.setDataset(this.dataset);
		oRepresentation.setModel(this.oModel);
		aSelectionOnChart = this.getSelectionFromChart();
		//attachRenderComplete() because drawing selection takes time
		oRepresentation.attachRenderComplete(function() {
			oRepresentation.vizSelection(aSelectionOnChart);
		});
		oPrintObject = {
			oRepresentation : oRepresentation
		};
		return oPrintObject;
	};
}());