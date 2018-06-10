/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 *@class step
 *@name step
 *@memberOf sap.apf.ui.reuse.controller
 *@description handle actions possible over step (example: drag and drop , delete, set Active etc)
 *             
 */
(function() {
	"use strict";
	sap.ui.controller("sap.apf.ui.reuse.controller.step", {
		/**
		 *@memberOf sap.apf.ui.reuse.controller.step
		 *@method setActiveStep
		 *@param {number} index  of step to be set as active
		 *@description set step as active with given index
		 */
		setActiveStep : function(sIndex) {
			var oldActiveStep = this.oCoreApi.getActiveStep();
			var oldActiveStepIndex = this.oCoreApi.getSteps().indexOf(oldActiveStep);
			if (oldActiveStepIndex === sIndex) {
				return;
			}
			var activeStep = this.oCoreApi.getSteps()[sIndex];
			this.oCoreApi.setActiveStep(activeStep);
			this.oUiApi.getAnalysisPath().getController().drawMainChart();
			var stepView = this.oUiApi.getAnalysisPath().getCarousel().stepViews[sIndex];
			stepView.toggleActiveStep();
		},
		bindEvts : function() {
			var self = this;
			var oCarousel = this.oUiApi.getAnalysisPath().getCarousel();
			var stepLayout = this.getView().oVChartTiltleLayout;
			stepLayout.attachBrowserEvent('click', function() {
				var stepIndex = oCarousel.stepViews.indexOf(self.getView());
				self.setActiveStep(stepIndex);
				self.oUiApi.getLayoutView().getController().enableDisableOpenIn(); //Enable/disable open in based on step specific targets
			});
		},
		onAfterRendering : function() {
			this.bindEvts();
			this.oUiApi.getLayoutView().getController().enableDisableOpenIn(); //Enable/disable open in based on step specific targets
		},
		/*getActiveStepIndex : function() {
			var oCarousel = this.oUiApi.getAnalysisPath().getCarousel().getController();
			return oCarousel.getActiveStepIndex();
		},*///Deprecated
		/**
		 *@memberOf sap.apf.ui.reuse.controller.step
		 *@method showLoading
		 *@description show busy indicator
		 */
		/*showLoading : function() {
			var oView = this.getView();
			oView.oThumbnailChartLayout.removeAllContent();
			oView.oThumbnailChartLayout.setBusy(true);
			oView.bRefreshing = true;
		},*///Deprecated
		onInit : function() {
			this.oCoreApi = this.getView().getViewData().oCoreApi;
			this.oUiApi = this.getView().getViewData().uiApi;
			this.isSwitched = false;
			if (sap.ui.Device.system.desktop) {
				this.getView().addStyleClass("sapUiSizeCompact");
			}
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.step
		 *@method  showChart
		 *@param {boolean} bDrawThumbnail boolean to decide whether to redraw the thumbnail in case of any changes
		 *@description display thumbnail for the step
		 */
		drawThumbnailContent : function(bDrawThumbnail) {
			var oView = this.getView();
			var sIndex = this.oUiApi.getAnalysisPath().getCarousel().stepViews.indexOf(oView);
			if (this.representationInstance !== undefined) {
				if (this.representationInstance !== this.oCoreApi.getSteps()[sIndex].getSelectedRepresentation().type) {
					this.isSwitched = true;
				}
			}
			this.representationInstance = this.oCoreApi.getSteps()[sIndex].getSelectedRepresentation().type;
			if (this.oCoreApi.getSteps()[sIndex].getSelectedRepresentation().toggleInstance !== undefined) {
				this.bToggleInstanceExists = true;
			}
			if (this.isSwitched === true || bDrawThumbnail === undefined || bDrawThumbnail === true || this.bToggleInstanceExists === true) {
				this.isSwitched = false;
				oView.oThumbnailChartLayout.removeAllItems();
				var oStep = this.oCoreApi.getSteps()[sIndex];
				var oChart;
				if (oStep.getSelectedRepresentation().bIsAlternateView) {
					oChart = oStep.getSelectedRepresentation().toggleInstance.getThumbnailContent();
				} else {
					oChart = oStep.getSelectedRepresentation().getThumbnailContent();
				}
				var overLayThumbnailWrapper = new sap.m.VBox({}).addStyleClass("overlayThumbnailWrapper");
				oView.oThumbnailChartLayout.addItem(oChart);
				oView.oThumbnailChartLayout.addItem(overLayThumbnailWrapper);
				var oCarouselController = this.oUiApi.getAnalysisPath().getCarousel().getController();
				var oThumbnailDataset = oCarouselController.getThumbnailDataset(oStep);
				oView.getModel().getData().thumbnail = oThumbnailDataset;
				oView.getModel().updateBindings();
				oView.oThumbnailChartLayout.rerender();
				oView.oThumbnailChartLayout.setBusy(false);
			} else {
				oView.oThumbnailChartLayout.setBusy(false);
			}
		}
	});
}());