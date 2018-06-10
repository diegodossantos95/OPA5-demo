/*!
 * SAP APF Analysis Path Framework 
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 * @class stepContainer
 * @name stepContainer
 * @memberOf sap.apf.ui.reuse.view
 * @description Creates ChartContainer and add it into the layout 
 * @returns {stepContainerLayout}
 */
(function() {
	"use strict";
	jQuery.sap.require("sap.suite.ui.commons.ChartContainer");
	
	sap.ui.jsview("sap.apf.ui.reuse.view.stepContainer", {
		/**
		 * @this {sap.apf.ui.reuse.view.stepContainer}
		 *
		 */
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.stepContainer";
		},
		createContent : function(oController) {
			if (sap.ui.Device.system.desktop) {
				oController.getView().addStyleClass("sapUiSizeCompact");
			}
			var chartContainer = new sap.suite.ui.commons.ChartContainer({
				id : oController.createId("idChartContainer"),
				showFullScreen : true,
				customZoomInPress : oController.handleZoomInPress.bind(oController),
				customZoomOutPress : oController.handleZoomOutPress.bind(oController)
			}).addStyleClass("chartContainer");
			
			var stepLayout = new sap.ui.layout.VerticalLayout({
				id : oController.createId("idStepLayout"),
				content : [ chartContainer ],
				width : "100%"
			});
			var initialText = new sap.m.Label({
				id: oController.createId("idInitialText")
			}).addStyleClass('initialText');
			this.stepLayout = stepLayout;
			stepLayout.setBusy(true);
			return stepLayout;
		}
	});
}());
