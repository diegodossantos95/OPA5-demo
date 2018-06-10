/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 *@class analysisPath 
 *@name analysisPath
 *@memberOf sap.apf.ui.reuse.view 
 *@description Layout holds title of Analysis Path, saved path name, Toolbar and Carousel
 *@returns  {AnalysisPath}  
 */
(function() {
	"use strict";
	sap.ui.jsview("sap.apf.ui.reuse.view.analysisPath", {
		/**
		 *@this {sap.apf.ui.reuse.view.analysisPath}
		 *@description anlaysisPath view
		 */
		/**
		 *@method getCarousel
		 *@memberOf sap.apf.ui.reuse.view.analysisPath
		 *@see sap.apf.ui.reuse.view.carousel
		 * KLS why no returns directive in the JSDOC. I also would propose to rename to getCarouselView 
		 */
		getCarousel : function() {
			return this.oCarousel;
		},
		/**
		 *@method getToolbar
		 *@see sap.apf.ui.reuse.view.analysisPath
		 *@memberOf sap.apf.ui.reuse.view.analysisPath
		 */
		getToolbar : function() {
			return this.oActionListItem;
		},
		/**
		 *@method getPathGallery
		 *@memberOf sap.apf.ui.reuse.view.analysisPath
		 */
		getPathGallery : function() {
			return this.pathGallery;
		},
		/**
		 *@method getPathGalleryWithDeleteMode
		 *@memberOf sap.apf.ui.reuse.view.analysisPath
		 */
		getPathGalleryWithDeleteMode : function() {
			return this.deleteAnalysisPath;
		},
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.analysisPath";
		},
		createContent : function(oController) {
			var self = this;
			this.oController = oController;
			this.oActionListPopover = new sap.m.Popover({
				showHeader : false,
				placement : sap.m.PlacementType.Bottom,
				contentWidth : "165px"
			});
			var oViewData = this.getViewData();
			self.oCoreApi = oViewData.oCoreApi;
			self.oUiApi = oViewData.uiApi;
			this.oActionListItem = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.toolbar",
				type : sap.ui.core.mvc.ViewType.JS,
				viewData : oViewData
			}).addStyleClass("toolbarView");
			this.oActionListPopover.addContent(this.oActionListItem);
			this.oSavedPathName = new sap.m.ObjectHeader({
				title : this.oCoreApi.getTextNotHtmlEncoded("unsaved"),
				showTitleSelector : true,
				condensed : true,
				titleSelectorPress : function(oEvent) {
					self.oActionListPopover.openBy(oEvent.getParameter("domRef"));
				}
			}).addStyleClass("sapApfObjectHeader");
			//accessing private variable to change the icon in the object header title selector, since there is no API for it.
			if (this.oSavedPathName._oTitleArrowIcon) {
				this.oSavedPathName._oTitleArrowIcon.setSrc("sap-icon://drop-down-list");
			}
			this.oCarousel = new sap.ui.view({
				type : sap.ui.core.mvc.ViewType.JS,
				viewName : "sap.apf.ui.reuse.view.carousel",
				viewData : {
					analysisPath : self,
					oInject : oViewData
				}
			});
			this.pathGallery = new sap.ui.view({
				type : sap.ui.core.mvc.ViewType.JS,
				viewName : "sap.apf.ui.reuse.view.pathGallery",
				viewData : {
					oInject : oViewData
				}
			});
			this.deleteAnalysisPath = new sap.ui.view({
				type : sap.ui.core.mvc.ViewType.JS,
				viewName : "sap.apf.ui.reuse.view.deleteAnalysisPath",
				viewData : {
					oInject : oViewData
				}
			});
			this.oAnalysisPath = new sap.ui.layout.VerticalLayout({
				content : [ self.oContentTitle, self.oSavedPathName, self.oCarousel ],
				width : '100%'
			});
			return this.oAnalysisPath;
		}
	});
}());