(function () {
	"use strict";
	/*global sap, jQuery */

	sap.ui.controller("sap.ovp.cards.charts.donut.DonutChart", {
		onInit: function () {
//				this.bFlag = true;
		},
		onBeforeRendering: function () {
			var utils = sap.ovp.cards.charts.Utils;
			var VizAnnotationManager = sap.ovp.cards.charts.VizAnnotationManager;
			VizAnnotationManager.validateCardConfiguration(this);
			var measureArrNames = [];
			var dimensionArrayNames = [];
			var vizFrame = this.getView().byId("donutChartCard");
			var navigation;
			if (!vizFrame) {
				jQuery.sap.log.error(utils.constants.ERROR_NO_CHART +
						": (" + this.getView().getId() + ")");
			} else {
				navigation = vizFrame.getModel('ovpCardProperties').getProperty("/navigation");
				if (navigation == "chartNav") {
					vizFrame.attachBrowserEvent("click", this.onHeaderClick.bind(this));
				} else {
					sap.ovp.cards.charts.VizAnnotationManager.getSelectedDataPoint(vizFrame, this);
				}
//				vizFrame.addEventDelegate(this.busyDelegate, vizFrame);
				var binding = vizFrame.getDataset().getBinding("data");
				if (binding.getPath()) {
					binding.attachDataReceived(jQuery.proxy(this.onDataReceived, this));
					binding.attachDataRequested(jQuery.proxy(this.onDataRequested, this));
				} else {
					var noDataDiv = sap.ui.xmlfragment("sap.ovp.cards.charts.generic.noData");
					var cardContainer = this.getCardContentContainer();
					cardContainer.removeAllItems();
					cardContainer.addItem(noDataDiv);
				}
				sap.ovp.cards.charts.Utils.validateMeasuresDimensions(vizFrame, "Donut");
				var entityTypeObject = this.getCardPropertiesModel().getProperty("/entityType");
				var columnLabels = utils.getAllColumnLabels(entityTypeObject);
				var measuresArr = vizFrame.getDataset().getMeasures();
				var dimensionsArr = vizFrame.getDataset().getDimensions();
	
				measureArrNames.push(measuresArr[0].getName());
				var dimensionName = columnLabels[dimensionsArr[0].getName()];
				dimensionArrayNames.push(dimensionName ? dimensionName : dimensionsArr[0].getName());
				var bDatapointNavigation = true;
				var dNav = vizFrame.getModel('ovpCardProperties').getProperty("/navigation");
				if (dNav == "chartNav") {
					bDatapointNavigation = false;
				}
				vizFrame.removeAllFeeds();
				vizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "size",
					'type': "Measure",
					'values': measureArrNames
				}));
				vizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "color",
					'type': "Dimension",
					'values': dimensionArrayNames
				}));
	
				vizFrame.setVizProperties({
					size:{
						title:{
							visible:false
						}
					},
					color:{
						title:{
							visible:false
						}
					},
					legend: {
						isScrollable: false
					},
	
					title: {
						visible: false
					},
					interaction:{
						noninteractiveMode: bDatapointNavigation ? false : true,
						selectability: {
							legendSelection: false,
							axisLabelSelection: false,
							mode: "EXCLUSIVE",
							plotLassoSelection: false,
							plotStdSelection: true
						}
					}
				});
				VizAnnotationManager.formatChartAxes();
			}
		},
		onDataReceived: function(oEvent) {
			var vizFrame = this.getView().byId("donutChartCard");
			if (this.bFlag == true) {
//				vizFrame.addEventDelegate(this.freeDelegate, vizFrame);
				this.bFlag = false;
				} else {
					setTimeout(function(){
						vizFrame.setBusy(false);
						},0);
				}
			sap.ovp.cards.charts.VizAnnotationManager.checkNoData(oEvent, this.getCardContentContainer(), vizFrame);
		},
		onDataRequested : function() {
			var vizFrame = this.getView().byId("donutChartCard");
//			vizFrame.removeEventDelegate(this.freeDelegate, vizFrame);
			vizFrame.setBusy(true);
		}
	});
})();
