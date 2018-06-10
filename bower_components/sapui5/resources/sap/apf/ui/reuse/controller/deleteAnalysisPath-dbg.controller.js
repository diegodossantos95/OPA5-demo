/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global window*/
/**
 *@class deleteAnalysisPath
 *@name deleteAnalysisPath
 *@memberOf sap.apf.ui.reuse.controller
 *@description controller of view.deleteAnalysisPath
 */
(function() {
	"use strict";
	sap.ui.controller("sap.apf.ui.reuse.controller.deleteAnalysisPath", {
		/**
		 *@this {sap.apf.ui.reuse.controller.pathGallery}
		 */
		onInit : function() {
			this.oCoreApi = this.getView().getViewData().oInject.oCoreApi;
			this.oUiApi = this.getView().getViewData().oInject.uiApi;
			this.oSerializationMediator = this.getView().getViewData().oInject.oSerializationMediator;
		},
		/**
		*@memberOf sap.apf.ui.reuse.controller.pathGallery
		*@method openPathGallery
		*@description opens the path gallery with delete mode
		*/
		openPathGallery : function() {
			var pathGalleryModel = new sap.ui.model.json.JSONModel();
			pathGalleryModel.setData(this.getView().getViewData().jsonData);
			this.oDialog = this.getView().getContent()[0];
			this.oDialog.getContent()[0].setModel(pathGalleryModel);
			this.oDialog.setInitialFocus(this.oDialog);
			this.oDialog.open();
		},
		handleDeleteOfDialog : function(evt) {
			var self = this;
			var sPathName = evt.getParameter("listItem").getProperty('title');
			var oListInfo = {
				item : evt.getParameter("listItem"),
				list : self.getView().getContent()[0].getContent()[0],
				guid : self.getGuidForPath(sPathName, this.getView().getViewData().jsonData.GalleryElements),
				sPathName : sPathName
			};
			self.oUiApi.getAnalysisPath().getToolbar().getController().getConfirmDelDialog(oListInfo);
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.pathGallery
		 *@method getGuidForPath
		 *@description Fetches guid for a path
		 */
		getGuidForPath : function(sPathName, viewData) {
			var i;
			for(i = 0; i < viewData.length; i++) {
				var oData = viewData[i];
				if (oData.AnalysisPathName === sPathName) {
					return oData.guid;
				}
			}
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.pathGallery
		 *@method deleteSavedPath
		 *@description deletes the section and path from path gallery.
		 *@param {object} sectionDom
		 */
		deleteSavedPath : function(sPathName, oInfo) {
			var self = this;
			var guid = oInfo.guid;
			var pathName = sPathName;
			var oMessageObject;
			var currentPath = self.oUiApi.getAnalysisPath().oSavedPathName.getTitle();
			self.oSerializationMediator.deletePath(guid, function(oResponse, metaData, msgObj) {
				if (msgObj === undefined && (typeof oResponse === "object")) {
					oInfo.list.removeItem(oInfo.item);
					oInfo.list.rerender();
					self.oCoreApi.readPaths(function(oResponse, metaData, msgObj) {
						if (msgObj === undefined && (typeof oResponse === "object")) {
							var noOfPaths = oResponse.paths.length;
							//Text to be shown in galery when all paths are deleted
							if (noOfPaths === 0) {
								jQuery(".pathText").removeClass("pathTextDontShow");
								jQuery(".pathText").addClass("pathTextShow");
							}
						} else {
							oMessageObject = self.oCoreApi.createMessageObject({
								code : "6005",
								aParameters : [ pathName ]
							});
							oMessageObject.setPrevious(msgObj);
							self.oCoreApi.putMessage(oMessageObject);
						}
					});
				} else {
					oMessageObject = self.oCoreApi.createMessageObject({
						code : "6009",
						aParameters : [ pathName ]
					});
					oMessageObject.setPrevious(msgObj);
					self.oCoreApi.putMessage(oMessageObject);
				}
			});
			//If current path is deleted reset the analysis path
			if (self.oCoreApi.isDirty()) {
				currentPath = currentPath.substring(1);
			}
			if (currentPath === pathName) {
				self.oUiApi.getAnalysisPath().getToolbar().getController().resetAnalysisPath();
			}
		}
	});
}());