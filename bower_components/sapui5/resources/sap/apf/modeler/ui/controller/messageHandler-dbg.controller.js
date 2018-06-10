/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.m.MessageBox");
(function() {
	'use strict';
	var oCoreApi;
	/**
	* @class messageHandler
	* @memberOf sap.apf.modeler.ui.controller
	* @name MessageHandler
	* @description helps in handling all types of errors in APF configuration modeler
	*/
	function _createMessageText(oMessageObject) {
		var text = oMessageObject.getMessage();
		while (oMessageObject.getPrevious()) {
			oMessageObject = oMessageObject.getPrevious();
			text = text + '\n' + oMessageObject.getMessage();
		}
		return text;
	}
	function _showErrorMessageBox(oMessageObject) {
		sap.m.MessageBox.error(oMessageObject.getMessage(), {
			styleClass : sap.ui.Device.system.desktop ? "sapUiSizeCompact" : ""
		});
	}
	function _showInformationMessageBox(oMessageObject) {
		sap.m.MessageBox.information(oMessageObject.getMessage(), {
			styleClass : sap.ui.Device.system.desktop ? "sapUiSizeCompact" : ""
		});
	}
	function _showSuccessMsgToast(oMessageObject) {
		sap.m.MessageToast.show(oMessageObject.getMessage(), {
			width : "20em"
		});
	}
	function _openDetailedLogDialog(oController, oMessageObject) {
		var oDetailLogDialog = new sap.m.Dialog(oController.createId("idShowDetailsDialog"), {
			contentWidth : jQuery(window).height() * 0.6 + "px",
			contentHeight : jQuery(window).height() * 0.6 + "px",
			title : oCoreApi.getText("error"),
			type : sap.m.DialogType.Message,
			state : sap.ui.core.ValueState.Error,
			content : new sap.ui.core.HTML({
				content : [ '<div><p> ' + jQuery.sap.encodeHTML(_createMessageText(oMessageObject)) + '</p></div>' ].join(""),
				sanitizeContent : true
			}),
			beginButton : new sap.m.Button({
				text : oCoreApi.getText("close"),
				press : function() {
					oDetailLogDialog.close();
				}
			}),
			afterClose : function() {
				oDetailLogDialog.destroy();
			}
		}).addStyleClass("dialogContentPadding");
		oDetailLogDialog.setInitialFocus(oDetailLogDialog);
		oDetailLogDialog.open();
	}
	function _showFatalErrorDialog(oController, oMessageObject) {
		var oDialog = new sap.m.Dialog(oController.createId("idFatalDialog"), {
			title : oCoreApi.getText("error"),
			type : sap.m.DialogType.Message,
			state : sap.ui.core.ValueState.Error,
			content : [ new sap.m.Text({
				text : oCoreApi.getText("fatalErrorMessage")
			}), new sap.m.VBox({
				alignItems : sap.m.FlexAlignItems.End,
				items : [ new sap.m.Link({
					text : oCoreApi.getText("showDetailsLink"),
					press : function() {
						_openDetailedLogDialog(oController, oMessageObject);
					}
				}) ]
			}) ],
			beginButton : new sap.m.Button({
				text : oCoreApi.getText("close"),
				press : function() {
					window.history.go(-1);
				}
			}),
			afterClose : function() {
				oDialog.destroy();
			}
		});
		oDialog.setInitialFocus(oDialog);
		oDialog.open();
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.messageHandler", {
		/**
		* @function
		* @name sap.apf.modeler.ui.controller.messageHandler#showMessage
		* @description shows message on UI using different UI controls based on the severity of the error
		* @param {sap.ui.core.MessageObject} Accepts core message object 
		* */
		onInit : function() {
			oCoreApi = this.getView().getViewData();
		},
		showMessage : function(oMessageObject) {
			var oController = this;
			var severity = oMessageObject.getSeverity();
			var oSeverityConstant = sap.apf.core.constants.message.severity;
			switch (severity) {
				case oSeverityConstant.fatal:
					_showFatalErrorDialog(oController, oMessageObject);
					break;
				case oSeverityConstant.error:
					_showErrorMessageBox(oMessageObject);
					break;
				case oSeverityConstant.success:
					_showSuccessMsgToast(oMessageObject);
					break;
				case oSeverityConstant.information:
					_showInformationMessageBox(oMessageObject);
					break;
				default:
					jQuery.sap.log.error("Error type not defined");
					break;
			}
		}
	});
})();