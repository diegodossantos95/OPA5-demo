/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
sap.ui.define([ "sap/apf/modeler/ui/controller/overwriteExistingConfiguration" ], function(BaseController) {
	"use strict";
	var oCoreApi, oParentControl, oApplicationHandler, overwriteConfirmationDialog, appIdFromConfigFile;
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	function _setDisplayText(oController) {
		var oTextReader = oCoreApi.getText;
		oController.byId("idImportFilesDialog").setTitle(oTextReader("importConfig"));
		oController.byId("idJsonFileLabel").setText(oTextReader("jsonFile"));
		oController.byId("idJsonFileUploader").setPlaceholder(oTextReader("jsonFileInputPlaceHolder"));
		oController.byId("idTextFileLabel").setText(oTextReader("textFile"));
		oController.byId("idTextFileUploader").setPlaceholder(oTextReader("textFileInputPlaceHolder"));
		oController.byId("idUploadOfConfig").setText(oTextReader("upload"));
		oController.byId("idCancelImportOfConfig").setText(oTextReader("cancel"));
	}
	function _openOverwriteConfirmationDialog(oController, callbackOverwrite, callbackCreateNew, configurationName) {
		var customData = new sap.ui.core.CustomData({
			value : {
				callbackOverwrite : callbackOverwrite,
				callbackCreateNew : callbackCreateNew
			}
		});
		overwriteConfirmationDialog = sap.ui.xmlfragment("idOverwriteConfirmationFragment", "sap.apf.modeler.ui.fragment.overwriteConfirmation", oController);
		oController.getView().addDependent(overwriteConfirmationDialog);
		oController.setOverwriteConfirmationDialogText(oCoreApi.getText);
		overwriteConfirmationDialog.removeAllCustomData();
		overwriteConfirmationDialog.addCustomData(customData);
		sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleInput").setValue(configurationName);
		overwriteConfirmationDialog.open();
	}
	function _closeAllOpenDialogs(oController) {
		var importFilesDialog = oController.byId("idImportFilesDialog");
		if (overwriteConfirmationDialog && overwriteConfirmationDialog.isOpen()) {
			oController.handleCancelOfOverwriteDialog();
		}
		if (importFilesDialog && importFilesDialog.isOpen()) {
			oController.handleCancelOfImportFilesDialog();
		}
	}
	function _showSuccessMessageToast(sMsgCode) {
		var oMessageObject = oCoreApi.createMessageObject({
			code : sMsgCode
		});
		oCoreApi.putMessage(oMessageObject);
	}
	function _callbackImport(configuration, metadata, messageObject) {
		var oController = this;
		var oTextPropertyFileUploader = oController.byId("idTextFileUploader");
		if (!nullObjectChecker.checkIsNotUndefined(messageObject)) {
			oParentControl.fireEvent("updateAppListEvent");
			_showSuccessMessageToast("11515");
			if (oTextPropertyFileUploader && oTextPropertyFileUploader.getValue()) {
				oTextPropertyFileUploader.upload();
			}
		} else {
			var oMessageObject = oCoreApi.createMessageObject({
				code : "11502"
			});
			oMessageObject.setPrevious(messageObject);
			oCoreApi.putMessage(oMessageObject);
		}
		if (oTextPropertyFileUploader && !oTextPropertyFileUploader.getValue()) {
			_closeAllOpenDialogs(oController);
		}
	}
	function _importPropertiesFile(oController, aPropertyTexts) {
		oCoreApi.importTexts(aPropertyTexts, function(messageObject) {
			if (!nullObjectChecker.checkIsNotUndefined(messageObject)) {
				_showSuccessMessageToast("11516");
			} else {
				var oMessageObject = oCoreApi.createMessageObject({
					code : "11503"
				});
				oMessageObject.setPrevious(messageObject);
				oCoreApi.putMessage(oMessageObject);
			}
		});
		_closeAllOpenDialogs(oController);
	}
	return BaseController.extend("sap.apf.modeler.ui.controller.importFiles", {
		onInit : function() {
			var oController = this;
			oCoreApi = oController.getView().getViewData().oCoreApi;
			oParentControl = oController.getView().getViewData().oParentControl;
			oCoreApi.getApplicationHandler(function(applicationHandler, messageObject) {
				if (applicationHandler && !nullObjectChecker.checkIsNotUndefined(messageObject)) {
					oApplicationHandler = applicationHandler;
				} else {
					var oMessageObject = oCoreApi.createMessageObject({
						code : "11508"
					});
					oMessageObject.setPrevious(messageObject);
					oCoreApi.putMessage(oMessageObject);
				}
			});
			_setDisplayText(oController);
			oController.byId("idImportFilesDialog").open();
		},
		addAcceptAttribute : function() {
			var oController = this;
			var jsonFileInput = jQuery("#" + oController.getView().getId() + "--idJsonFileUploader-fu");
			var propertyFileInput = jQuery("#" + oController.getView().getId() + "--idTextFileUploader-fu");
			jsonFileInput.attr('accept', '.json');
			propertyFileInput.attr('accept', '.properties');
		},
		handleTypeMissmatchForJSONFile : function() {
			_showSuccessMessageToast("11517");
		},
		handleTypeMissmatchForPropertiesFile : function() {
			_showSuccessMessageToast("11518");
		},
		handleJSONFileUploadComplete : function(oEvent) {
			var oController = this;
			var file = oEvent.getSource().oFileUpload.files[0];
			if (file) {
				var reader = new FileReader();
				reader.readAsText(file, "UTF-8");
				reader.onload = function(evt) {
					appIdFromConfigFile = JSON.parse(evt.target.result).configHeader.Application; //application id in the configuration file
					oCoreApi.importConfiguration(JSON.stringify(JSON.parse(evt.target.result)), function(callbackOverwrite, callbackCreateNew, configurationName) {
						_openOverwriteConfirmationDialog(oController, callbackOverwrite, callbackCreateNew, configurationName);
					}, _callbackImport.bind(oController));
				};
				reader.onerror = function() {
					_showSuccessMessageToast("11519");
				};
			}
		},
		handleTextFileUploadComplete : function(oEvent) {
			var oController = this, file, oJSONFileUploader;
			file = oEvent.getSource().oFileUpload.files[0];
			oJSONFileUploader = oController.byId("idJsonFileUploader");
			if (file) {
				var reader = new FileReader();
				reader.readAsText(file, "UTF-8");
				reader.onload = function(evt) {
					var aLines = evt.target.result.split(/\r?\n/);
					var applicationId, i, appIdFromTextFile;
					for(i = 0; i < aLines.length; i++) {
						applicationId = /^\#\s*ApfApplicationId=[0-9A-F]+\s*$/.exec(aLines[i]);
						if (nullObjectChecker.checkIsNotNull(applicationId)) {
							appIdFromTextFile = aLines[i].split('=')[1]; //application id in the properties file
						}
					}
					var bExistingApplication;
					if (oApplicationHandler) {
						for(i = 0; i < oApplicationHandler.getList().length; i++) { //check if the application exists
							if (appIdFromTextFile === oApplicationHandler.getList()[i].Application) {
								bExistingApplication = true;
								break;
							} else {
								bExistingApplication = false;
							}
						}
					}
					if (!bExistingApplication && oJSONFileUploader && !oJSONFileUploader.getValue()) {
						_showSuccessMessageToast("11520"); //JSON file has to be selected before properties file if the application does not exist
					} else if (oJSONFileUploader && oJSONFileUploader.getValue()) {
						if (appIdFromConfigFile && appIdFromTextFile && appIdFromTextFile !== appIdFromConfigFile) { //chcek if the id of application is same in both the files
							_showSuccessMessageToast("11521");
							_closeAllOpenDialogs(oController);
						} else {
							_importPropertiesFile(oController, evt.target.result); //only property file has to be imported
						}
					} else if (bExistingApplication && oJSONFileUploader && !oJSONFileUploader.getValue()) {
						_importPropertiesFile(oController, evt.target.result);
					}
				};
				reader.onerror = function() {
					_showSuccessMessageToast("11522");
				};
			}
		},
		handleUploadOfConfig : function() {
			var oController = this;
			var oJSONFileUploaderValue = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oController.byId("idJsonFileUploader").getValue());
			var oTextPropertyFileUploaderValue = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oController.byId("idTextFileUploader").getValue());
			if ((oJSONFileUploaderValue && oTextPropertyFileUploaderValue) || oJSONFileUploaderValue) {
				oController.byId("idJsonFileUploader").upload(); //upload the json file if both the files or only the json file have to be uploaded, properties file will be uploaded after json file
			} else {
				oController.byId("idTextFileUploader").upload(); //upload only the properties file
			}
		},
		handleCancelOfImportFilesDialog : function() {
			var oController = this;
			oController.getView().destroy();
		}
	});
});