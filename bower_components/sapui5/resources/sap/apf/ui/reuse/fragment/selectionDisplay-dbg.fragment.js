/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/* global window*/
/**
 *@class selectionDisplay
 *@name  selectionDisplay Fragment
 *@description Holds the selections on the active step and displays them in a dialog using js fragment
 *@memberOf sap.apf.ui.reuse.view
 * 
 */
(function() {
	"use strict";
	sap.ui.jsfragment("sap.apf.ui.reuse.fragment.selectionDisplay", {
		createContent : function(oController) {
			var oActiveStep = oController.oCoreApi.getActiveStep();
			var selectedRepresentation = oActiveStep.getSelectedRepresentation();
			var selectionData = typeof selectedRepresentation.getSelections === "function" ? selectedRepresentation.getSelections() : []; //Returns the filter selections
			var oRequiredPropertyMetaData = selectedRepresentation.getMetaData().getPropertyMetadata(selectedRepresentation.getParameter().requiredFilters[0]);
			var selectedDimension = oRequiredPropertyMetaData.label || oRequiredPropertyMetaData.name;
			var selectionDisplayDialog = new sap.m.Dialog({
				id : this.createId("idSelectionDisplayDialog"),
				title : oController.oCoreApi.getTextNotHtmlEncoded("selected-required-filter", [ selectedDimension ]) + " (" + selectionData.length + ")",
				contentWidth : jQuery(window).height() * 0.6 + "px",
				contentHeight : jQuery(window).height() * 0.6 + "px",
				buttons : [ new sap.m.Button({
					text : oController.oCoreApi.getTextNotHtmlEncoded("close"),
					press : function() {
						selectionDisplayDialog.close();
						selectionDisplayDialog.destroy();
					}
				}) ],
				afterClose : function() {
					selectionDisplayDialog.destroy();
				}
			});
			//Preparing the data list in the dialog
			var oData = {
				selectionData : selectionData
			};
			var selectionList = new sap.m.List({
				items : {
					path : "/selectionData",
					template : new sap.m.StandardListItem({
						title : "{text}"
					})
				}
			});
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setSizeLimit(selectionData.length);
			oModel.setData(oData);
			selectionList.setModel(oModel);
			selectionDisplayDialog.addContent(selectionList);
			return selectionDisplayDialog;
		}
	});
}());