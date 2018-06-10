/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 *@class pathGallery
 *@name pathGallery
 *@memberOf sap.apf.ui.reuse.controller
 *@description controller of view.pathGallery
 */
(function() {
	"use strict";
	sap.ui.controller("sap.apf.ui.reuse.controller.pathGallery", {
		/**
		 *@this {sap.apf.ui.reuse.controller.pathGallery}
		 */
		onInit : function() {
			this.oCoreApi = this.getView().getViewData().oInject.oCoreApi;
			this.oUiApi = this.getView().getViewData().oInject.uiApi;
			this.oSerializationMediator = this.getView().getViewData().oInject.oSerializationMediator;
			if (sap.ui.Device.system.desktop) {
				this.getView().addStyleClass("sapUiSizeCompact");
			}
		},
		/**
		*@memberOf sap.apf.ui.reuse.controller.pathGallery
		*@method openPathGallery
		*@description opens the path gallery with list of all saved paths
		*/
		openPathGallery : function() {
			if (this.oDialog) {
				this.oDialog.destroy();
			}
			this.oDialog = new sap.ui.jsfragment("sap.apf.ui.reuse.fragment.pathGallery", this);
			var oModel = new sap.ui.model.json.JSONModel();
			var jsonData = this.getPathGalleryData();
			oModel.setData(jsonData);
			this.oDialog.setModel(oModel);
			if (sap.ui.Device.system.desktop) {
				this.oDialog.addStyleClass("sapUiSizeCompact");
			}
			this.oDialog.setInitialFocus(this.oDialog);
			this.oDialog.open();
		},
		/**
		*@memberOf sap.apf.ui.reuse.controller.pathGallery
		*@method getPathGalleryData
		*@description Gets data for building the path gallery
		*/
		getPathGalleryData : function() {
			var self = this;
			var jsonData = this.getView().getViewData() ? this.getView().getViewData().jsonData : {};
			//Get the application Configuration data
			var fetchConfigData = function() {
				var configData = {
					"steps" : self.oCoreApi.getStepTemplates()
				};
				return configData;
			};
			//Inject Image and Title in json data
			if (jsonData.GalleryElements.length !== 0) {
				var savedPaths = jsonData.GalleryElements;
				var configData = fetchConfigData();
				var i, j, k, index;
				for(i = 0; i < savedPaths.length; i++) {
					for(j = 0; j < savedPaths[i].StructuredAnalysisPath.steps.length; j++) {
						for(k = 0; k < configData.steps.length; k++) {
							var stepId = savedPaths[i].StructuredAnalysisPath.steps[j].stepId;
							var selectedRepresentationId = savedPaths[i].StructuredAnalysisPath.steps[j].selectedRepresentationId;
							if (stepId === configData.steps[k].id) {
								for(index in configData.steps[k].getRepresentationInfo()) {
									if (selectedRepresentationId === configData.steps[k].getRepresentationInfo()[index].representationId) {
										jsonData.GalleryElements[i].StructuredAnalysisPath.steps[j].imgSrc = configData.steps[k].getRepresentationInfo()[index].picture;
										jsonData.GalleryElements[i].StructuredAnalysisPath.steps[j].title = self.oCoreApi.getTextNotHtmlEncoded(configData.steps[k].title.key);
									}
								}
							}
						}
					}
				}
			}
			return jsonData;
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.pathGallery
		 *@method openPath
		 *@description opens a saved analysis path
		 *@param Takes analysis path name, guid and step which has been clicked as parameters
		 */
		openPath : function(pathName, guid, activeStepindex) {
			var self = this;
			var oMessageObject;
			var carousel = self.oUiApi.getAnalysisPath().getCarousel();
			this.oUiApi.getAnalysisPath().getCarousel().oController.removeAllSteps();
			self.oSerializationMediator.openPath(guid, (function(self) {
				return function(oResponse, oEntityTypeMetadata, msgObj) {
					if (msgObj === undefined && (typeof oResponse === "object")) {
						self.oUiApi.getAnalysisPath().getController().isOpenPath = true;
						self.oUiApi.contextChanged();
						//					self.oUiApi.getLayoutView().getController().setFilter(oResponse.path.SerializedAnalysisPath.context);
						self.oUiApi.getAnalysisPath().getController().refresh(-1);
						self.oCoreApi.updatePath(self.oUiApi.getAnalysisPath().getController().callBackForUpdatePath.bind(self.oUiApi.getAnalysisPath().getController()));
						self.oCoreApi.setDirtyState(false);
						self.oUiApi.getAnalysisPath().getController().setPathTitle();
						if (self.oDialog !== undefined) {
							self.oDialog.close();
						}
						carousel.rerender();
						self.oUiApi.getLayoutView().setBusy(false);
					} else {
						oMessageObject = self.oCoreApi.createMessageObject({
							code : "6008",
							aParameters : [ pathName ]
						});
						oMessageObject.setPrevious(msgObj);
						self.oUiApi.getLayoutView().setBusy(false);
						self.oCoreApi.putMessage(oMessageObject);
					}
				};
			}(this)), activeStepindex);
		}
	});
}());