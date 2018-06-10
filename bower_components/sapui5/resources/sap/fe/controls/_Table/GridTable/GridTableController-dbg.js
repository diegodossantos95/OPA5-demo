/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

/**
 *
 *
 * @private
 * @name sap.fe.controls._Table.GridTable.GridTableController
 * @author SAP SE
 * @version 1.50.2
 * @since ??
 * @param {}
 * @returns {sap.fe.controls._Table.GridTable.GridTableController} new GridTable controller
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

	var GridTableController = TableController.extend("sap.fe.controls._Table.GridTable.GridTableController", {
		constructor: function (oTable) {
			TableController.apply(this, arguments);
			this.oTable = oTable;
		}
	});

	/**
	 *
	 *
	 * @param {}
	 * @private
	 */

     /*
	 this method checks the multiplicity of the actions and sets the selection mode accordingly
	 only sap.fe.controls.Action instances in the tables headerbar are considered
	 */

	GridTableController.prototype.setSelectionMode = function () {
		var aToolbarActions = this.getToolbarActions(this.oInnerTable.getExtension()[0].getContent());
		var iMultiplicityTo;
		var sSelectionMode = 'None';

		for (var i = 0; i < aToolbarActions.length; i++) {
			iMultiplicityTo = aToolbarActions[i].getMultiplicityTo();
			if (iMultiplicityTo > 1 || !iMultiplicityTo) {
				sSelectionMode = 'MultiToggle';
				break;
			} else if (iMultiplicityTo === 1) {
				sSelectionMode = 'Single';
			}
		}

	    this.oInnerTable.setSelectionMode(sSelectionMode);

	};



	/*
	 this method checks the multiplicity of the actions and sets the selection mode accordingly
	 only sap.fe.controls.Action instances in the tables headerbar are considered
	 */

	GridTableController.prototype.enableDisableActions = function () {
		var aToolbarActions = this.getToolbarActions(this.oInnerTable.getExtension()[0].getContent());
		var iSelected = this.oInnerTable.getSelectedIndices().length;
		this.enableDisableActionsUtil(iSelected,aToolbarActions);

	};

	GridTableController.prototype.bindTableCount = function () {
		var oTitle = this.oInnerTable.getExtension()[0].getContent()[0];
		this.bindTableCountUtil(oTitle);
	};



	GridTableController.prototype.handleDataReceived = function (oEvent) {
		var oError = oEvent.getParameter("error");
		var oResourceBundle = this.oInnerTable.getModel("sap.fe.i18n").getResourceBundle();
		if (oError) {
			// fire the showError event to show a message box via controllerImplementation
			this.oInnerTable.setNoData(oResourceBundle.getText("SAPFE_NODATA_TEXT_FOR_TABLE_TECHINCAL_ERROR"));
			this.oTable.fireShowError(oEvent);
		} else {
			this.oInnerTable.setNoData(oResourceBundle.getText("SAPFE_NODATA_TEXT_FOR_TABLE"));
		}
		//This is work around for Table data loading issue when visibleRowCountMode is auto in initial
		if (this.oInnerTable.getVisibleRowCountMode() != "Auto") {
			this.oInnerTable.setVisibleRowCountMode("Auto");
		}
		this.oInnerTable.setBusy(false);
	};


	GridTableController.prototype.getListBinding = function () {
		return this.oInnerTable.getBinding("rows");

	};

	GridTableController.prototype.getListBindingInfo = function () {
		return this.oInnerTable.getBindingInfo("rows");
	};

	return GridTableController;

});
