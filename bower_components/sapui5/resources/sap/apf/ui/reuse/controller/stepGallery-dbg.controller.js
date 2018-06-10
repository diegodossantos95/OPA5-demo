/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require('sap.apf.ui.utils.helper');
/**
 *@class stepGallery
 *@name stepGallery
 *@memberOf sap.apf.ui.reuse.controller
 *@description controller for step Gallery 
 * 
 */
(function() {
	"use strict";
	function _createMessageText(oMessageObject) {
		var text = oMessageObject.getMessage();
		while (oMessageObject.getPrevious()) {
			oMessageObject = oMessageObject.getPrevious();
			text = text + '\n' + oMessageObject.getMessage();
		}
		return text;
	}
	sap.ui.controller("sap.apf.ui.reuse.controller.stepGallery", {
		/**
		 *@this {sap.apf.ui.reuse.controller.stepGallery}
		 */
		/**
		*@memberOf sap.apf.ui.reuse.controller.stepGallery
		*@method getGalleryElementsData 
		*@description Returns array needed to draw step gallery content.
		*@returns   {object} jsonData
		*/
		getGalleryElementsData : function() {
			var self = this;
			var aGalleryElements = [];
			var aCategories = this.oCoreApi.getCategories();
			var label = this.oCoreApi.getTextNotHtmlEncoded("label");
			var steps = this.oCoreApi.getTextNotHtmlEncoded("steps");
			var category = this.oCoreApi.getTextNotHtmlEncoded("category");
			var oMessageObject;
			if (aCategories.length === 0) {
				oMessageObject = this.oCoreApi.createMessageObject({
					code : "6001",
					aParameters : [ "Categories" ]
				});
				this.oCoreApi.putMessage(oMessageObject);
			}
			var i;
			for(i = 0; i < aCategories.length; i++) {
				var oGalleryElement = {};
				var oCategory = aCategories[i];
				var categoryName;
				if (!oCategory.label) {
					oMessageObject = this.oCoreApi.createMessageObject({
						code : "6002",
						aParameters : [ label, category + ": " + categoryName ]
					});
					this.oCoreApi.putMessage(oMessageObject);
				} else {
					categoryName = this.oCoreApi.getTextNotHtmlEncoded(oCategory.label);
					oGalleryElement.title = this.oCoreApi.getTextNotHtmlEncoded(oCategory.label);
				}
				oGalleryElement.id = oCategory.id;
				oGalleryElement.stepTemplates = [];
				oCategory.stepTemplates.forEach(function(oStepTemplate) {
					var oStepDetail = {};
					if (!oStepTemplate.title) {
						oMessageObject = self.oCoreApi.createMessageObject({
							code : "6003",
							aParameters : [ "Title" ]
						});
						self.oCoreApi.putMessage(oMessageObject);
					} else {
						oStepDetail.title = self.oCoreApi.getTextNotHtmlEncoded(oStepTemplate.title);
					}
					oStepDetail.id = oStepTemplate.id;
					oStepDetail.representationtypes = oStepTemplate.getRepresentationInfo();
					oStepDetail.representationtypes.forEach(function(oRepresentation) {
						oRepresentation.title = self.oCoreApi.getTextNotHtmlEncoded(oRepresentation.label);
						if (oRepresentation.parameter && oRepresentation.parameter.orderby) { //if orderby has a value then only get the sort description
							new sap.apf.ui.utils.Helper(self.oCoreApi).getRepresentationSortInfo(oRepresentation).done(function(representationSortDetail) {
								var aSortDescription = [];
								for(var i = 0; i < representationSortDetail.length; i++) {
									representationSortDetail[i].done(function(sSortDescription) {
										aSortDescription.push(sSortDescription);
									});
								}
								oRepresentation.sortDescription = aSortDescription;
							});
						}
					});
					oStepDetail.defaultRepresentationType = oStepDetail.representationtypes[0];
					oGalleryElement.stepTemplates.push(oStepDetail);
				});
				aGalleryElements.push(oGalleryElement);
			}
			var aStepTemplates = this.oCoreApi.getStepTemplates();
			if (aStepTemplates.length === 0) {
				oMessageObject = this.oCoreApi.createMessageObject({
					code : "6002",
					aParameters : [ steps, category ]
				});
				this.oCoreApi.putMessage(oMessageObject);
			}
			var jsonData = {
				GalleryElements : aGalleryElements
			};
			return jsonData;
		},
		/**
		*@memberOf sap.apf.ui.reuse.controller.stepGallery
		*@method onInit 
		*@description Bind gallery elements data to step gallery view.
		*/
		onInit : function() {
			if (sap.ui.Device.system.desktop) {
				this.getView().addStyleClass("sapUiSizeCompact");
			}
			this.oCoreApi = this.getView().getViewData().oCoreApi;
			this.oUiApi = this.getView().getViewData().uiApi;
			var aGalleryElements = this.getGalleryElementsData().GalleryElements;
			var oModel = new sap.ui.model.json.JSONModel({
				"GalleryElements" : aGalleryElements
			});
			this.getView().setModel(oModel);
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.stepGallery
		 *@method getStepDetails
		 *@param {string} index of the category in the binding of step gallery dialog
		 *@param {string} index of the step in the binding of step gallery dialog
		 *@return details of a step i.e. id,representationTypes etc
		 */
		getStepDetails : function(categoryIndex, stepIndex) {
			var aGalleryElements = this.getGalleryElementsData().GalleryElements;
			var stepDetails = aGalleryElements[categoryIndex].stepTemplates[stepIndex];
			return stepDetails;
		},
		openHierarchicalSelectDialog : function() {
			if (this.oHierchicalSelectDialog) {
				this.oHierchicalSelectDialog.destroy();
			}
			this.oHierchicalSelectDialog = new sap.ui.jsfragment("sap.apf.ui.reuse.fragment.stepGallery", this);
			this.oHierchicalSelectDialog.setModel(this.getView().getModel());
			if (sap.ui.Device.system.desktop) {
				this.oHierchicalSelectDialog.addStyleClass("sapUiSizeCompact");
			}
			this.oHierchicalSelectDialog.open();
		},
		/**
		*@memberOf sap.apf.ui.reuse.controller.stepGallery
		*@method onStepPress
		*@param {string} sId Id for step being added
		*@param {object} oRepresentationType Representation
		*@description creates new step.
		*/
		onStepPress : function(sId, oRepresentationType) {
			var oController = this;
			this.oCoreApi.checkAddStep(sId).done(function(bCanStepBeAdded, oMessageObject) {
				if (bCanStepBeAdded) {
					oController.oHierchicalSelectDialog.close();
					oController.oCoreApi.createStep(sId, oController.oUiApi.getAnalysisPath().getController().callBackForUpdatePathAndSetLastStepAsActive.bind(oController.oUiApi.getAnalysisPath().getController()), oRepresentationType);
					oController.oUiApi.getAnalysisPath().getController().refresh(-1);
				} else {
					var sMessageText = _createMessageText(oMessageObject);
					var oFragmentParameter = {
						oController : oController,
						sMessageText : sMessageText
					};
					var addStepCheckDialog = new sap.ui.jsfragment("sap.apf.ui.reuse.fragment.addStepCheckDialog", oFragmentParameter);
					addStepCheckDialog.open();
					oController.oUiApi.getLayoutView().setBusy(false);
				}
			});
		}
	});
}());
