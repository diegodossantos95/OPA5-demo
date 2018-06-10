/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2017 SAP SE. All rights reserved
	
 */

/**
 * Export progress dialog
 * @private
 */
sap.ui.define([ 'jquery.sap.global' ], function(jQuery) {
	'use strict';

	var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.export");
	
	var progressDialog;
	
	function createProgressDialog() {
		
		var dialog;

		var cancelButton = new sap.m.Button({
			text : oRb.getText("CANCEL_BUTTON"),
			press : function() {
				if (dialog && dialog.oncancel) {
					dialog.oncancel();
					dialog.finish();
				}
			}
		});

		var progressIndicator = new sap.m.ProgressIndicator({
			showValue : false,
			height : "0.75rem"
		});
		progressIndicator.addStyleClass("sapUiMediumMarginTop");

		dialog = new sap.m.Dialog(
				{
					title : oRb.getText("PROGRESS_TITLE"),
					type : sap.m.DialogType.Message,
					contentWidth : "500px",
					content : [ new sap.m.Text({
						text : oRb.getText("PROGRESS_FETCHING_MSG")
					}), progressIndicator ],
					endButton : cancelButton
				});



		dialog.updateStatus = function(nValue) {
			progressIndicator.setPercentValue(nValue);
		};

		dialog.finish = function() {
			progressDialog.close();
			progressIndicator.setPercentValue(0);
		};

		return dialog;
	}
	
	function getProgressDialogInstance() {
		progressDialog = progressDialog || createProgressDialog();
		return progressDialog;
	}
	
	return {
		getProgressDialog : getProgressDialogInstance
	};

}, /* bExport= */true);