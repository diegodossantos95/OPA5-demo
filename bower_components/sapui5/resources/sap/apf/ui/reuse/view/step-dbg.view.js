/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2016 SAP SE. All rights reserved
 */

(function(){
	"use strict";
/**
 *@class step
 *@name step
 *@memberOf sap.apf.ui.reuse.view
 *@description Layout to hold stepThumbnail
 */
sap.ui.jsview("sap.apf.ui.reuse.view.step", {
	getControllerName : function() {
		return "sap.apf.ui.reuse.controller.step";
	},
	stepContent : function() {
		this.oCoreApi = this.getViewData().oCoreApi;
		this.oUiApi = this.getViewData().uiApi;
		this.oTopLayout = new sap.m.FlexBox({
			items : [ new sap.m.Text({
				text : '{/thumbnail/leftUpper}',
				tooltip : '{/thumbnail/leftUpper}',
				wrapping : true,
				maxLines : 2,
				textAlign : sap.ui.core.TextAlign.Left
			}).addStyleClass("thumbanilText"), new sap.m.Text({
				text : '{/thumbnail/rightUpper}',
				tooltip : '{/thumbnail/rightUpper}',
				wrapping : true,
				maxLines : 2,
				textAlign : sap.ui.core.TextAlign.Right
			}).addStyleClass("thumbanilText") ],
			alignItems : sap.m.FlexAlignItems.Start,
			justifyContent : sap.m.FlexJustifyContent.SpaceBetween
		}).addStyleClass("topLayout");
		this.oThumbnailChartLayout = new sap.m.VBox({
			height : "80px"
		}).addStyleClass('ChartArea');
		this.oThumbnailChartLayout.setBusy(true);
		this.oBottomLayout = new sap.m.FlexBox({
			items : [ new sap.m.Text({
				text : '{/thumbnail/leftLower}',
				tooltip : '{/thumbnail/leftLower}',
				wrapping : true,
				maxLines : 2,
				textAlign : sap.ui.core.TextAlign.Left
			}).addStyleClass("thumbanilText"), new sap.m.Text({
				text : '{/thumbnail/rightLower}',
				tooltip : '{/thumbnail/rightLower}',
				wrapping : true,
				maxLines : 2,
				textAlign : sap.ui.core.TextAlign.Right
			}).addStyleClass("thumbanilText") ],
			alignItems : sap.m.FlexAlignItems.Start,
			justifyContent : sap.m.FlexJustifyContent.SpaceBetween
		}).addStyleClass("bottomLayout");
		this.oThumbnailVLayout = new sap.m.VBox({
			items : [ this.oTopLayout, this.oThumbnailChartLayout, this.oBottomLayout ],
			height : "130px"
		}).addStyleClass('stepThumbnail');
		this.oStepTitle = new sap.m.Text({
			text : '{/title}',
			textAlign : sap.ui.core.TextAlign.Center,
			wrapping : true,
			width : "200px"
		}).addStyleClass('stepTitle');
		this.oVChartLayout = new sap.m.VBox({
			items : [ this.oThumbnailVLayout, this.oStepTitle ],
			width : "200px"
		}).addStyleClass("sapApfStepLayout");
		var htmlWrapper = new sap.m.VBox({
			items : []
		}).addStyleClass("block-overlay-container");
		var self = this;
		htmlWrapper.addEventDelegate({
			onAfterRendering : function() {
				//Show Master Button to be displayed on detail footer bottom for mobile device
				var showMasterButton = new sap.m.Button({
					text : self.oCoreApi.getTextNotHtmlEncoded("showAnalyticalPath"),
					press : function() {
						self.oUiApi.getLayoutView().byId("detailFooter").removeAllContentLeft();
						self.oUiApi.getLayoutView().byId("applicationView").backToTopMaster();
					},
					type : "Transparent"
				});
				//Events for hover and touch on step
				jQuery(htmlWrapper.getDomRef()).on("mouseenter", function() {
					jQuery(this).addClass("sapThemeBarBG");
					jQuery(this).css({
						"opacity" : "0.3"
					});
				});
				//On touch start show overlay with opacity 0.3
				//Mobile Device Bug Fix - on touch start prevent the default zoom 
				//which appears on double tap or hold on step
				jQuery(htmlWrapper.getDomRef()).on("touchstart", function(e) {
					//On Double Tap disable Zoom text focus and application 
					var t2 = e.timeStamp, t1 = jQuery(this).data('lastTouch') || t2, dt = t2 - t1, fingers = e.originalEvent.touches.length;
					jQuery(this).data('lastTouch', t2);
					if (!dt || dt > 500 || fingers > 1) {
						return; // not double-tap
					}
					e.preventDefault(); // double tap - prevent the zoom
					// also synthesize click events we just swallowed up
					jQuery(this).trigger('click').trigger('click');
					jQuery(this).addClass("sapThemeBarBG");
					jQuery(this).css({
						"opacity" : "0"
					});
				});
				jQuery(htmlWrapper.getDomRef()).on("mouseleave", function() {
					jQuery(this).removeClass("sapThemeBarBG");
					jQuery(this).css({
						"opacity" : "1"
					});
				});
				jQuery(htmlWrapper.getDomRef()).on("touchend touchmove", function() {
					jQuery(this).removeClass("sapThemeBarBG");
					jQuery(this).css({
						"opacity" : "0"
					});
				});
				//Device Phone: Hide/Show the Master/Detail Page 
				//On click of step go to the detail page
				//Add the text on bottom of footer and tap of text
				//go back to the master view 
				if (sap.ui.Device.system.phone) {
					jQuery(htmlWrapper.getDomRef()).on("tap", function() {
						self.oUiApi.getLayoutView().getController().hideMaster();
						self.oUiApi.getLayoutView().byId("detailFooter").removeContentLeft(showMasterButton);
						self.oUiApi.getLayoutView().getController().addDetailFooterContentLeft(showMasterButton);
						self.oUiApi.getStepContainer().getController().drawStepContent();
					});
				}
			}
		});
		this.oVChartTiltleLayout = new sap.m.VBox({
			items : [ htmlWrapper, this.oVChartLayout ],
			width : "200px"
		}).addStyleClass("sapAPFSelectedStep");
		return this.oVChartTiltleLayout;
	},
	createContent : function(oController) {
		var stepContent = this.stepContent();
		return stepContent;
	},
	toggleActiveStep : function() {
		var allSteps = this.oUiApi.getAnalysisPath().getCarousel().stepViews;
		for( var i in allSteps) {
			if (allSteps[i].oThumbnailVLayout.hasStyleClass('sapThemeBaseBG-asBackgroundColor')) {
				allSteps[i].oThumbnailVLayout.removeStyleClass('sapThemeBaseBG-asBackgroundColor');
				allSteps[i].oStepTitle.removeStyleClass('activeStepTitle');
				allSteps[i].oThumbnailVLayout.removeStyleClass('activeStepThumbnail');
				break;
			}
		}
		this.oThumbnailVLayout.addStyleClass('sapThemeBaseBG-asBackgroundColor');
		this.oStepTitle.addStyleClass('activeStepTitle');
		this.oThumbnailVLayout.addStyleClass('activeStepThumbnail');
	}
});

}());
