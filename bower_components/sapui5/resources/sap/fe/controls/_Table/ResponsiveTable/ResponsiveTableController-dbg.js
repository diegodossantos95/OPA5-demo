/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

/**
 *
 *
 * @private
 * @name sap.fe.controls._Table.ResponsiveTable.ResponsiveTableController
 * @author SAP SE
 * @version 1.50.2
 * @since ??
 * @param {}
 * @returns {sap.fe.controls._Table.ResponsiveTable.ResponsiveTableController} new GridTable controller
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/fe/controls/_Table/TableController"
], function (jQuery, TableController) {
	"use strict";

	/**
	 * @private
	 * @constructor
	 * @param {}
	 */

	var ResponsiveTableController = TableController.extend("sap.fe.controls._Table.ResponsiveTable.ResponsiveTableController", {
		constructor: function (oTable) {
			TableController.apply(this, arguments);
			this.oTable = oTable;
		}
	});

	/**
	 *
	 * This method checks the multiplicity of the actions and sets the selection mode accordingly
	 * only sap.fe.controls.Action instances in the tables headerbar are considered
	 *
	 * @param {}
	 * @private
	 */

	ResponsiveTableController.prototype.setSelectionMode = function () {
		var aToolbarActions = this.getToolbarActions(this.oInnerTable.getHeaderToolbar().getContent());
		var iMultiplicityTo;
		var sSelectionMode = 'None';

		for (var i = 0; i < aToolbarActions.length; i++) {
			iMultiplicityTo = aToolbarActions[i].getMultiplicityTo();
			if (iMultiplicityTo > 1 || !iMultiplicityTo) {
				sSelectionMode = 'MultiSelect';
				break;
			} else if (iMultiplicityTo === 1) {
				sSelectionMode = 'SingleSelectLeft';
			}
		}

		this.oInnerTable.setMode(sSelectionMode);
	};


	/*
	 this method checks the multiplicity of the actions and sets the selection mode accordingly
	 only sap.fe.controls.Action instances in the tables headerbar are considered
	 */

	ResponsiveTableController.prototype.enableDisableActions = function () {
		var aToolbarActions = this.getToolbarActions(this.oInnerTable.getHeaderToolbar().getContent());
		var iSelected = this.oInnerTable.getSelectedContexts().length;
		this.enableDisableActionsUtil(iSelected, aToolbarActions);
	};

	ResponsiveTableController.prototype.bindTableCount = function () {
		var oTitle = this.oInnerTable.getHeaderToolbar().getContent()[0];
		this.bindTableCountUtil(oTitle);
	};


	ResponsiveTableController.prototype.handleDataReceived = function (oEvent) {
		var oError = oEvent.getParameter("error");
		var oResourceBundle = this.oInnerTable.getModel("sap.fe.i18n").getResourceBundle();
		if (oError) {
			// fire the showError event to show a message box via controllerImplementation
			this.oInnerTable.setNoDataText(oResourceBundle.getText("SAPFE_NODATA_TEXT_FOR_TABLE_TECHINCAL_ERROR"));
			this.oTable.fireShowError(oEvent);
		} else {
			this.oInnerTable.setNoDataText(oResourceBundle.getText("SAPFE_NODATA_TEXT_FOR_TABLE"));
		}
		this.oInnerTable.setBusy(false);
	};

	ResponsiveTableController.prototype.getListBinding = function () {
		return this.oInnerTable.getBinding("items");

	};

	ResponsiveTableController.prototype.getListBindingInfo = function () {
		return this.oInnerTable.getBindingInfo("items");
	};

	return ResponsiveTableController;

});
