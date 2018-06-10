/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function() {
	"use strict";
	/* global window*/
	sap.ui.jsview("sap.apf.ui.reuse.view.deleteAnalysisPath", {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.deleteAnalysisPath";
		},
		createContent : function(oController) {
			var contentWidth = jQuery(window).height() * 0.6 + "px"; // height and width for the dialog relative to the window
			var contentHeight = jQuery(window).height() * 0.6 + "px";
			this.oCoreApi = this.getViewData().oInject.oCoreApi;
			this.oUiApi = this.getViewData().oInject.uiApi;
			var self = this;
			var list = new sap.m.List({
				mode : sap.m.ListMode.Delete,
				items : {
					path : "/GalleryElements",
					template : new sap.m.StandardListItem({
						title : "{AnalysisPathName}",
						description : "{description}",
						tooltip : "{AnalysisPathName}"
					})
				},
				"delete" : oController.handleDeleteOfDialog.bind(oController)
			});
			var oDialog = new sap.m.Dialog({
				title : self.oCoreApi.getTextNotHtmlEncoded("select-analysis-path"),
				contentWidth : contentWidth,
				contentHeight : contentHeight,
				content : list,
				leftButton : new sap.m.Button({
					text : self.oCoreApi.getTextNotHtmlEncoded("close"),
					press : function() {
						oDialog.close();
						self.oUiApi.getLayoutView().setBusy(false);
					}
				}),
				afterClose : function() {
					oDialog.getParent().destroy();
				}
			});
			if (sap.ui.Device.system.desktop) {
				this.addStyleClass("sapUiSizeCompact");
				oDialog.addStyleClass("sapUiSizeCompact");
			}
			return oDialog;
		}
	});
}());