/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.representations.utils.UI5ChartHelper');
jQuery.sap.require('sap.apf.ui.utils.formatter');
jQuery.sap.require('sap.ui.layout.HorizontalLayout');
jQuery.sap.require('sap.m.Text');
jQuery.sap.require('sap.ui.model.json.JSONModel');
jQuery.sap.require('sap.apf.ui.representations.utils.UI5ChartHelper');
jQuery.sap.declare("sap.apf.ui.representations.BaseUI5ChartRepresentation");
/** 
 * @class representation base class constructor.
* @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
* @returns chart object
*/
(function() {
	'use strict';
	sap.apf.ui.representations.BaseUI5ChartRepresentation = function(oApi, oParameters) {
		this.oMessageObject = "";
		this.legendBoolean = true;
		this.aDataResponse = undefined;
		this.dataset = {};
		this.oModel = new sap.ui.model.json.JSONModel();
		this.bDataHasBeenSelected = false;
		this.parameter = oParameters;
		this.orderby = oParameters.orderby;
		this.dimension = oParameters.dimensions;
		this.measure = oParameters.measures;
		this.alternateRepresentation = oParameters.alternateRepresentationType;
		this.requiredFilters = oParameters.requiredFilters;
		this.UI5ChartHelper = new sap.apf.ui.representations.utils.UI5ChartHelper(oApi, this.parameter);
		this.chartInstance = {};
		this.chartParam = "";
		this.thumbnailChartParam = "";
		this.disableSelectEvent = false;
		this.oApi = oApi;
		this.showXaxisLabel = true;
		this.axisType = sap.apf.ui.utils.CONSTANTS.axisTypes.AXIS;
		this.topN = oParameters.top;
	};
	sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype = {
		/**
		* @method getParameter
		* @description returns the constructor arguments which will be used to create toggle representation.
		*/
		getParameter : function() {
			return this.parameter;
		},
		/**
		* @method setData
		* @param aDataResponse  Response from oData service
		* @param metadata Metadata of the oData service
		* @description Fetches the data from oData service and updates the selection if present
		* Handles data with multiple dimensions .
		*/
		setData : function(aDataResponse, metadata) {
			if(this.bIsAlternateView && this.toggleInstance && jQuery.isFunction(this.toggleInstance.setData)) {
				this.toggleInstance.setData(aDataResponse, metadata);
			}else {
				this.bIsGroupTypeChart = this.getIsGroupTypeChart();
				this.formatter = new sap.apf.ui.utils.formatter({
					getEventCallback : this.oApi.getEventCallback.bind(this.oApi),
					getTextNotHtmlEncoded : this.oApi.getTextNotHtmlEncoded,
					getExits:this.oApi.getExits()
				}, metadata, aDataResponse);
				this.UI5ChartHelper.init(aDataResponse, metadata, this.bIsGroupTypeChart, this.formatter);
				this.aDataResponse = aDataResponse || [];
				this.metadata = metadata;
				if (!this.metadata) {
					this.oMessageObject = this.oApi.createMessageObject({
						code : "6004",
						aParameters : [ this.oApi.getTextNotHtmlEncoded("step") ]
					});
					this.oApi.putMessage(this.oMessageObject);
				}
			}
		},
		/**
		* @method attachSelectionAndFormatValue
		* @description formats the measure values for the chart and also attaches all the selection events for the chart
		*/
		attachSelectionAndFormatValue : function(oStepTitle) {
			var self = this;
			if (!oStepTitle) {
				this.oMessageObject = this.oApi.createMessageObject({
					code : "6002",
					aParameters : [ "title", this.oApi.getTextNotHtmlEncoded("step") ]
				});
				this.oApi.putMessage(this.oMessageObject);
			}
			if (this.dimension.length === 0) {
				this.oMessageObject = this.oApi.createMessageObject({
					code : "6002",
					aParameters : [ "dimensions", oStepTitle ]
				});
				this.oApi.putMessage(this.oMessageObject);
			}
			if (this.measure.length === 0) {
				this.oMessageObject = this.oApi.createMessageObject({
					code : "6002",
					aParameters : [ "measures", oStepTitle ]
				});
				this.oApi.putMessage(this.oMessageObject);
			}
			if (!this.aDataResponse || this.aDataResponse.length === 0) {
				this.oMessageObject = this.oApi.createMessageObject({
					code : "6000",
					aParameters : [ oStepTitle ]
				});
				this.oApi.putMessage(this.oMessageObject);
			}
			/**
			* @method attachSelectData
			* @param event which is triggered on selection of data on chart
			* @description Adding selection to the chart based on the selected indices provided
			*/
			this.fnHandleSelection = this.handleSelection.bind(self);
			this.chart.attachSelectData(this.fnHandleSelection);
			/**
			* @method attachDeselectData
			* @param event handler on deselect of data
			* @description For deselect of data from the chart on user event
			*/
			this.fnHandleDeselection = this.handleDeselection.bind(self);
			this.chart.attachDeselectData(this.fnHandleDeselection);
		},
		/**
		* @method getFormatStringForMeasure
		* @param {measure}- a measure
		* @description gets the format string for axis label and tooltip
		* @return sFormatString , has the format string and also a boolean which indicated whether all the measure unit semantic are same or not
		*             sFormatString ="#,#0.0"
		
		*/
		getFormatStringForMeasure : function(measure) {
			var sFormatString = this.formatter.getFormatString(measure); // get the format string
			return sFormatString;
		},
		getFormatStringForMeasureTooltip : function(measure) {
			var sFormatStringTooltip = this.formatter.getFormatStringTooltip(measure); // get the format string for measure tooltip
			return sFormatStringTooltip;
		},
		/**
		* @method getIsAllMeasureSameUnit
		* @description checks if all the measures have same unit semantic and sets a boolean accordingly
		* @retun bAllMeasuresSameUnit - boolean to indicate if all the measures have same unit semantic. 
		 * This boolean is used to set the formatting to y axis only when all the measures have same unit (e.g. clustered column chart),
		* otherwise the formatting will not be applied to y axis.
		*/
		getIsAllMeasureSameUnit : function() {
			var bAllMeasuresSameUnit = true;
			var self = this;
			var firstMeasureUnitSemantic = this.metadata.getPropertyMetadata(this.measure[0].fieldName).unit ? this.metadata.getPropertyMetadata(this.metadata.getPropertyMetadata(this.measure[0].fieldName).unit).semantics : undefined;
			var measureUnitSemantic;
			this.measure.forEach(function(measure, index) {
				measureUnitSemantic = self.metadata.getPropertyMetadata(self.measure[index].fieldName).unit ? self.metadata.getPropertyMetadata(self.metadata.getPropertyMetadata(measure.fieldName).unit).semantics : undefined;
				if (bAllMeasuresSameUnit && firstMeasureUnitSemantic !== undefined && measureUnitSemantic && (firstMeasureUnitSemantic !== measureUnitSemantic)) {
					bAllMeasuresSameUnit = false; // bAllMeasuresSameUnit boolean is used to find out if there are measures with different unit semantics
				}
			});
			return bAllMeasuresSameUnit;
		},
		/**
		*@method createThumbnailLayout
		*@description creates a layout for Thumbnail for the current chart type and also shows "no data" in the thumbnail if data is not there 
		 */
		createThumbnailLayout : function() {
			this.thumbnailLayout = new sap.ui.layout.HorizontalLayout().addStyleClass('thumbnailLayout');
			this.thumbnailLayout.removeAllContent();
			if (this.aDataResponse !== undefined && this.aDataResponse.length !== 0) {
				this.thumbnailChart.setModel(this.oModel);
				this.thumbnailLayout.addContent(this.thumbnailChart);
				this.thumbnailChart.removeStyleClass('thumbnailNoData');
			} else {
				var noDataText = new sap.m.Text({
					text : this.oApi.getTextNotHtmlEncoded("noDataText")
				}).addStyleClass('noDataText');
				this.thumbnailLayout.addContent(noDataText);
				this.thumbnailLayout.addContent(this.thumbnailChart);
				this.thumbnailChart.addStyleClass('thumbnailNoData');
			}
		},
		/**
		* @method getAlternateRepresentation
		* @description returns the alternate representation of current step (i.e. list representation for the charts)
		*/
		getAlternateRepresentation : function() {
			return this.alternateRepresentation;
		},
		/**
		* @description returns meta data for representation type
		*/
		getMetaData : function() {
			return this.metadata;
		},
		/**
		* @description returns data for representation type
		*/
		getData : function() {
			return this.aDataResponse;
		},
		/**
		* @method getRequestOptions
		* @description provide optional filter properties for odata request URL such as pagging, sorting etc
		*/
		getRequestOptions : function(bFilterChanged) {
			if(this.bIsAlternateView && this.toggleInstance && jQuery.isFunction(this.toggleInstance.getRequestOptions)) {
				return this.toggleInstance.getRequestOptions(bFilterChanged, this.bIsAlternateView);
			}
			var oOptions = {
				paging : {},
				orderby : []
			};
			if (this.orderby && this.orderby.length) {
				var aOrderbyProps = this.orderby.map(function(oOrderby) {
					return {
						property : oOrderby.property,
						descending : !oOrderby.ascending
					};
				});
				oOptions.orderby = aOrderbyProps;
			}
			if (this.topN && this.topN > 0) {
				oOptions.paging.top = this.topN;
			}
			return oOptions;
		},
		/**
		* @method createDataset
		* @description Intantiates the dataset to be consumed by the chart
		*/
		createDataset : function() {
			this.dataset = this.UI5ChartHelper.getDataset();
			this.oModel = this.UI5ChartHelper.getModel();
		},
		/**
		* @method drawSelectionOnMainChart
		* @param
		* @description Draws the selection on main chart when chart is loaded
		*/
		drawSelectionOnMainChart : function() {
			var aSelections = this.UI5ChartHelper.getSelectionFromFilter(this.filter);
			if (aSelections.length > 0) {
				this.disableSelectEvent = true;
				this.setSelectionOnMainChart(aSelections);
			}
		},
		/**
		* @method drawSelectionOnThumbnailChart
		* @param
		* @description Draws the selection on the thumbnail chart  when chart is loaded
		*/
		drawSelectionOnThumbnailChart : function() {
			var aSelections = this.UI5ChartHelper.getSelectionFromFilter(this.filter);
			if (aSelections.length > 0) {
				this.clearSelectionFromThumbnailChart();
				this.setSelectionOnThumbnailChart(aSelections);
			}
		},
		/**
		* @method handleSelection
		* @param event
		* @description  plots the selections made on the chart
		*/
		handleSelection : function(evt) {
			if (!this.disableSelectEvent) {
				var aSelection = this.getSelectionFromChart();
				var ctxArray = this.UI5ChartHelper.getHighlightPointsFromSelectionEvent(aSelection);
				this.setSelectionOnThumbnailChart(ctxArray);
				this.setSelectionOnMainChart(ctxArray);
				this.bDataHasBeenSelected = true;
				this.oApi.selectionChanged();
			} else {
				this.disableSelectEvent = false;
			}
		},
		/**
		* @method handleDeselection
		* @param event
		* @description  de-selects the selected datapoints on the chart
		*/
		handleDeselection : function(evt) {
			if (!this.disableSelectEvent) {
				this.disableSelectEvent = true;
				var aSelection = this.getSelectionFromChart();
				var newSelection = this.UI5ChartHelper.getHighlightPointsFromDeselectionEvent(aSelection);
				this.removeAllSelection();
				this.setSelectionOnThumbnailChart(newSelection);
				this.setSelectionOnMainChart(newSelection);
				if (!newSelection.length) {
					this.disableSelectEvent = false;
				}
				this.bDataHasBeenSelected = true;
				this.oApi.selectionChanged();
			} else {
				this.disableSelectEvent = false;
			}
		},
		/**
		* @method getSelections
		* @description This method helps in determining the selection count, text and id of selected data of a representation
		* @returns the filter selections of the current representation.
		*/
		getSelections : function() {
			return this.UI5ChartHelper.getFilters();
		},
		/**
		* @deprecated since version 1.27.0 and using getSelections API instead
		* @method getSelectionCount
		* @description This method helps in determining the selection count of a representation
		* @returns the selection count of the current representation.
		*/
		getSelectionCount : function() {
			return this.UI5ChartHelper.getFilterCount();
		},
		/**
		* @method hasSelection
		* @description This method helps in determining the selections of a representation
		* @returns true if the representation holds any selections.
		*/
		hasSelection : function() {
			return this.bDataHasBeenSelected;
		},
		/**
		* @method removeAllSelection
		* @description removes all Selection from Chart
		*/
		removeAllSelection : function() {
			this.clearSelectionFromThumbnailChart();
			this.clearSelectionFromMainChart();
		},
		/**
		* @method getFilterMethodType
		* @description This method helps in determining which method has to be used for the filter retrieval from a representation.
		* @returns {sap.apf.constants.filterMethodTypes} The filter method type the representation supports
		*/
		getFilterMethodType : function() {
			return sap.apf.core.constants.filterMethodTypes.filter; // returns the filter method type the representation supports
		},
		getFilter : function() {
			this.filter = this.UI5ChartHelper.getFilterFromSelection();
			return this.filter;
		},
		/**
		* @method setFilter
		* @param {sap.apf.utils.Filter} oFilter
		* @description sets the initial filter to the representation. The filter holds the values of the start filter of the path.
		*/
		setFilter : function(oFilter) {
			this.filter = oFilter;
			this.bDataHasBeenSelected = false;
		},
		/**
		* @method adoptSelection
		* @param {object} oSourceRepresentation Source representation implementing the representationInterface.
		* @description Called on representation by binding when a representation type is set.
		*/
		adoptSelection : function(oSourceRepresentation) {
			if (oSourceRepresentation && oSourceRepresentation.getFilter) {
				this.UI5ChartHelper.filterValues = oSourceRepresentation.getFilter().getInternalFilter().getFilterTerms().map(function(term) {
					return [ term.getValue() ];
				});
			}
		},
		/**
		* @method serialize
		* @description Getter for Serialized data for a representation
		* @returns selectionObject
		*/
		serialize : function() {
			var orderby = {};
			if(this.toggleInstance) {
				orderby = this.toggleInstance.orderby;
			}
			return {
				oFilter : this.UI5ChartHelper.filterValues,
				bIsAlternateView : this.bIsAlternateView,
				orderby : orderby
			};
		},
		/**
		* @method deserialize
		* @description This method uses selection object from serialized data and sets the selection to representation
		*/
		deserialize : function(oSerializable) {
			this.UI5ChartHelper.filterValues = oSerializable.oFilter;
			this.bIsAlternateView = oSerializable.bIsAlternateView;
			if(this.bIsAlternateView) {
				this.toggleInstance = this.oApi.getUiApi().getStepContainer().getController().createToggleRepresentationInstance(this, oSerializable.orderby);
			}
		},
		getPrintContent : function() {
		},
		/**
		* @method destroy
		* @description Destroying instances
		*/
		destroy : function() {
			this.dataset = null;
			this.oModel.destroy();
			if (this.formatter) {
				this.formatter = null;
			}
			this.UI5ChartHelper.destroy();
			this.UI5ChartHelper = null;
			if (this.chart) {
				this.chart.detachSelectData(this.fnHandleSelection);
				this.fnHandleSelection = null;
				this.chart.detachDeselectData(this.fnHandleDeselection);
				this.fnHandleDeselection = null;
				this.chart.destroy();
				this.chart = null;
			}
			if (this.thumbnailChart) {
				this.thumbnailChart.destroy();
				this.thumbnailChart = null;
			}
			if (this.thumbnailLayout) {
				this.thumbnailLayout.removeAllContent();
			}
		}
	};
}());