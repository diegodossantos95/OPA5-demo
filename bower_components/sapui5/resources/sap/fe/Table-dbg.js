/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/XMLComposite',
	'sap/fe/controls/_Table/GridTable/GridTableController',
	'sap/fe/controls/_Table/ResponsiveTable/ResponsiveTableController',
	'sap/fe/controls/_Field/FieldController',
	'sap/ui/table/Table',
	'sap/fe/core/AnnotationHelper',
	'sap/fe/controls/_Table/TableAnnotationHelper',
	'sap/fe/controls/_Field/FieldAnnotationHelper',
	'sap/ui/model/odata/v4/AnnotationHelper'
], function (jQuery, XMLComposite, GridTableController, ResponsiveTableController, FieldController, GridTable) {
	"use strict";

	var Table = XMLComposite.extend("sap.fe.Table", {
		metadata: {
			designTime: true,
			properties: {
				context: {
					type: "any",
					invalidate: "template"
				},
				tableBindingPath: {
					type: "string",
					invalidate: "template"
				},
				type: {
					type: "string",
					defaultValue: "ResponsiveTable",
					invalidate: "template"
				},
				interactionType: {
					type: "string",
					defaultValue: "Inactive",
					invalidate: "template"
				},
				"settingsDialogType": {
					type: "string",
					defaultValue: "ViewSettings"
				},
				filterBarId: {
					type: "string",
					invalidate: false
				},
				enabled: {
					type: "boolean",
					defaultValue: true,
					invalidate: false
				}
			},
			events: {
				"itemPress": {},
				"callAction": {},
				"showError": {}
			},
			publicMethods: []
		},
		alias: "this",
		fragment: "sap.fe.controls._Table.Table"
	});

	var fnInitialize = function () {
		if (!this.bInitialized) {
			this.oTableController.attachToFilterBar();
			this.oTableController.setSelectionMode();
			this.oTableController.enableDisableActions();
			this.oTableController.bindTableCount();
			this.bInitialized = true;
			this.detachModelContextChange(fnInitialize);
		}
	};


	Table.prototype.init = function () {
		var oInnerTable = this.getInnerTable();
		if (oInnerTable instanceof GridTable) {
			this.oTableController = new GridTableController(this);
		} else {
			this.oTableController = new ResponsiveTableController(this);
		}
		this.oFieldController = new FieldController(null, this);
		this.attachModelContextChange(fnInitialize);

	};

	Table.prototype.getInnerTable = function () {
		/*
		 get access to the rendered table - currently it's the second one in the layout. whenever we change the
		 layout we need to adapt this coding. Going upwards to the the view and to access it via ID would take
		 much longer. Any other ideas are welcome
		 */
		return this.get_content();
	};

	Table.prototype.handleDataRequested = function (oEvent) {
		this.oTableController.handleDataRequested(oEvent);
	};

	Table.prototype.handleDataReceived = function (oEvent) {
		this.oTableController.handleDataReceived(oEvent);
	};

	Table.prototype.handleSelectionChange = function (oEvent) {
		this.oTableController.enableDisableActions();
	};

	Table.prototype.handleItemPress = function (oEvent) {
		this.fireItemPress({listItem: oEvent.getParameter("listItem")});
	};

	Table.prototype.handleCallAction = function (oEvent) {
		this.oTableController.handleCallAction(oEvent);
	};

	Table.prototype.getSelectedContexts = function () {
		var oInnerTable = this.getInnerTable();
		var aSelectedContext = [];
		if (oInnerTable instanceof  GridTable) {
			var aSeletedIndices = oInnerTable.getSelectedIndices();
			for (var index in aSeletedIndices) {
				aSelectedContext.push(oInnerTable.getContextByIndex(index));
			}
		} else {
			aSelectedContext = oInnerTable.getSelectedContexts();
		}

		return aSelectedContext;
	};

	Table.prototype.getEntitySet = function () {
		var sListBindingPath = this.getListBinding().getPath();
		// return the path without the / - this works for absolute bindings only
		// this needs to be enhanced once relative bindings are supported as well
		return sListBindingPath.substr(1);
	};

	Table.prototype.getListBinding = function () {
		return this.oTableController.getListBinding();
	};

	Table.prototype.getListBindingInfo = function () {
		return this.oTableController.getListBindingInfo();
	};

	/* Delegate field events to the field controller */
	Table.prototype.onContactDetails = function (oEvent) {
		this.oFieldController.onContactDetails(oEvent);
	};

	Table.prototype.onDraftLinkPressed = function (oEvent) {
		this.oFieldController.onDraftLinkPressed(oEvent);

	};

	Table.prototype.onDataFieldWithIntentBasedNavigationPressed = function (oEvent) {
		this.oFieldController.onDataFieldWithIntentBasedNavigationPressed(oEvent);
	};

	Table.prototype.onStandardActionClick = function (oEvent) {
		this.oTableController.onStandardActionClick(oEvent);
	};

	return Table;

}, /* bExport= */true);
