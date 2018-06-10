/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/* global window*/
/**
 *@class addStepCheckDialog
 *@name  addStepCheckDialog Fragment
 *@description Dialog to show the message when a step can not be added in the path
 *@memberOf sap.apf.ui.reuse.view
 * 
 */
(function() {
	"use strict";
	sap.ui.jsfragment("sap.apf.ui.reuse.fragment.addStepCheckDialog", {
		createContent : function(oFragmentParameter) {
			var oController = oFragmentParameter.oController;
			var oDialog = new sap.m.Dialog(oController.createId("idAddStepCheckDialog"), {
				title : oController.oCoreApi.getTextNotHtmlEncoded("warning"),
				type : sap.m.DialogType.Message,
				state : sap.ui.core.ValueState.Warning,
				content : [ new sap.m.Text({
					text : oController.oCoreApi.getTextNotHtmlEncoded("addStepCheck")
				}), new sap.m.VBox({
					alignItems : sap.m.FlexAlignItems.End,
					items : [ new sap.m.Link(oController.createId("idShowDetailsLinkForAddStep"), {
						text : oController.oCoreApi.getTextNotHtmlEncoded("showDetails"),
						press : function() {
							var oDetailLogDialog = new sap.m.Dialog(oController.createId("idShowDetailsDialogForAddStep"), {
								contentWidth : jQuery(window).height() * 0.6 + "px",
								contentHeight : jQuery(window).height() * 0.6 + "px",
								title : oController.oCoreApi.getTextNotHtmlEncoded("warning"),
								type : sap.m.DialogType.Message,
								state : sap.ui.core.ValueState.Warning,
								content : new sap.ui.core.HTML({
									content : [ '<div><p> ' + jQuery.sap.encodeHTML(oFragmentParameter.sMessageText) + '</p></div>' ].join(""),
									sanitizeContent : true
								}),
								beginButton : new sap.m.Button({
									text : oController.oCoreApi.getTextNotHtmlEncoded("close"),
									press : function() {
										oDetailLogDialog.close();
									}
								}),
								afterClose : function() {
									oDetailLogDialog.destroy();
								}
							});
							oDetailLogDialog.setInitialFocus(oDetailLogDialog);
							oDetailLogDialog.open();
						}
					}) ]
				}) ],
				beginButton : new sap.m.Button({
					text : oController.oCoreApi.getTextNotHtmlEncoded("close"),
					press : function() {
						oDialog.close();
					}
				}),
				afterClose : function() {
					oDialog.destroy();
				}
			});
			return oDialog;
		}
	});
}());