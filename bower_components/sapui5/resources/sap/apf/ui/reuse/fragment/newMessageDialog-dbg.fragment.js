/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/* global window*/
/**
 *@class newMessageDialog
 *@name  newMessageDialog Fragment
 *@description Dialog to make sure dirty paths got saved
 *@memberOf sap.apf.ui.reuse.view
 * 
 */
(function() {
	"use strict";
	sap.ui.jsfragment("sap.apf.ui.reuse.fragment.newMessageDialog", {
		createContent : function(oController) {
			var yesButton = new sap.m.Button(oController.createId("idYesButton"), {
				text : oController.oCoreApi.getTextNotHtmlEncoded("yes")
			});
			var noButton = new sap.m.Button(oController.createId("idNoButton"), {
				text : oController.oCoreApi.getTextNotHtmlEncoded("no")
			});
			var newDialog = new sap.m.Dialog(oController.createId("idNewDialog"), {
				type : sap.m.DialogType.Standard,
				title : oController.oCoreApi.getTextNotHtmlEncoded("newPath"),
				content : new sap.m.Text({
					text : oController.oCoreApi.getTextNotHtmlEncoded("analysis-path-not-saved")
				}).addStyleClass("textStyle"),
				buttons : [ yesButton, noButton ],
				afterClose : function() {
					newDialog.destroy();
				}
			});
			return newDialog;
		}
	});
}());