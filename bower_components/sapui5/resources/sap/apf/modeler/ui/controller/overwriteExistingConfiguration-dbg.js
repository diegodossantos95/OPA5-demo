/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
sap.ui.define([ "sap/ui/core/mvc/Controller" ], function(Controller) {
	"use strict";
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	return Controller.extend("sap.apf.modeler.ui.controller.overwriteExistingConfiguration", {
		setOverwriteConfirmationDialogText : function(oTextReader) {
			sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfirmationDialog").setTitle(oTextReader("configAlreadyExists"));
			sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idConfirmationMessage").setText(oTextReader("overwriteDialogMsg"));
			sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idConfirmationMessage").addStyleClass("dialogText");
			sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfig").setText(oTextReader("overwriteConfig"));
			sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idDoNotOverwriteConfig").setText(oTextReader("doNotOverwriteConfig"));
			sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleLabel").setText(oTextReader("newConfigTitle"));
			sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idOkButton").setText(oTextReader("ok"));
			sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idCancelButton").setText(oTextReader("cancel"));
		},
		handleOkButtonPress : function() {
			var bSelectedButton, oNewConfigTitleInput, oOverwriteDialog, callbackOverwrite, callbackCreateNew;
			oOverwriteDialog = sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfirmationDialog");
			callbackOverwrite = oOverwriteDialog.getCustomData()[0].getValue().callbackOverwrite;
			callbackCreateNew = oOverwriteDialog.getCustomData()[0].getValue().callbackCreateNew;
			bSelectedButton = sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfigRadioGroup").getSelectedButton();
			oNewConfigTitleInput = sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleInput");
			if (bSelectedButton === sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfig")) {
				callbackOverwrite();
			} else {
				if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oNewConfigTitleInput.getValue().trim())) {
					oNewConfigTitleInput.setValueState(sap.ui.core.ValueState.None);
					callbackCreateNew(oNewConfigTitleInput.getValue());
				} else {
					oNewConfigTitleInput.setValueState(sap.ui.core.ValueState.Error);
				}
			}
		},
		handleCancelOfOverwriteDialog : function() {
			sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfirmationDialog").destroy();
		},
		handleChangeForOverwriteConfigOptions : function() {
			var bSelectedButton;
			bSelectedButton = sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idOverwriteConfigRadioGroup").getSelectedButton();
			if (bSelectedButton === sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idDoNotOverwriteConfig")) {
				sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleLayout").setVisible(true);
				sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleInput").setEnabled(true);
			} else {// If title for new config is not blank & we change the radio button option to overwrite the input fiels should be disabled and not hidden
				if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleInput").getValue().trim())) {
					sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleInput").setEnabled(false);
					sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleInput").setValueState(sap.ui.core.ValueState.None);
				} else {//In case input for new config title is left blank and we switch then both label and input for new title should be hidden
					sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleLayout").setVisible(false);
				}
			}
		}
	});
});