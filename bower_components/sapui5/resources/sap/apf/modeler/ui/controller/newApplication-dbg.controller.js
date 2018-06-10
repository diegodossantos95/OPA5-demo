/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
/**
* @class newApplication
* @name newApplication
* @description New Application controller of modeler
* 			   The ViewData for this view needs the following parameters:
*  			   oParentControl 	   - table where list of applications are stored
*   		   oCoreApi 	       - core instance
*/
(function() {
	"use strict";
	var oParentControl, oCoreApi;
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	function _setDisplayText(oController) {
		var oTextReader = oCoreApi.getText;
		oController.byId("idNewAppDialog").setTitle(oTextReader("newApplication"));
		oController.byId("idDescriptionLabel").setText(oTextReader("description"));
		oController.byId("idSemanticObjectLabel").setText(oTextReader("semanticObject"));
		oController.byId("idSaveButton").setText(oTextReader("save"));
		oController.byId("idCancelButton").setText(oTextReader("cancel"));
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.newApplication", {
		onInit : function() {
			var oController = this;
			oParentControl = oController.getView().getViewData().oParentControl;
			oCoreApi = oController.getView().getViewData().oCoreApi;
			oController.byId("idDescriptionInput").setValue("");
			oController.byId("idSemanticObjectInput").setValue("FioriApplication");
			_setDisplayText(oController);
			oController.byId("idNewAppDialog").open();
		},
		handleAppDescriptionLiveChange : function(oEvent) {
			var oController = this;
			var bIsAppDescriptionChanged = oEvent.getParameters().value.trim().length !== 0 ? true : false;
			oController.byId("idSaveButton").setEnabled(bIsAppDescriptionChanged);
		},
		handleSavePress : function() {
			var oController = this;
			var appObject = {};
			appObject.ApplicationName = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oController.byId("idDescriptionInput").getValue().trim()) ? oController.byId("idDescriptionInput").getValue().trim() : undefined;
			appObject.SemanticObject = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oController.byId("idSemanticObjectInput").getValue().trim()) ? oController.byId("idSemanticObjectInput").getValue().trim() : undefined;
			oCoreApi.getApplicationHandler(function(oApplicationHandler, messageObject) {
				if (oApplicationHandler && !nullObjectChecker.checkIsNotUndefined(messageObject)) {
					oApplicationHandler.setAndSave(appObject, function(oResponse, oMetadata, msgObj) {
						if (!nullObjectChecker.checkIsNotUndefined(msgObj) && (typeof oResponse === "string")) {
							oParentControl.fireEvent("addNewAppEvent", {
								"appId" : oResponse
							});
						} else {
							var oMessageObject = oCoreApi.createMessageObject({
								code : "11500"
							});
							oMessageObject.setPrevious(msgObj);
							oCoreApi.putMessage(oMessageObject);
						}
					});
				} else {
					var oMessageObject = oCoreApi.createMessageObject({
						code : "11509"
					});
					oMessageObject.setPrevious(messageObject);
					oCoreApi.putMessage(oMessageObject);
				}
			});
			oController.getView().destroy();
		},
		handleCancelPress : function() {
			var oController = this;
			oController.getView().destroy();
		}
	});
}());