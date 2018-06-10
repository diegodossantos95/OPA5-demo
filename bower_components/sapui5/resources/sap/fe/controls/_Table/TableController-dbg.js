/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

/**
 *
 *
 * @private
 * @name sap.fe.controls._Table.TableController
 * @author SAP SE
 * @version 1.50.2
 * @since ??
 * @param {}
 * @returns {sap.fe.controls._Table.TableController} new Table controller
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/fe/core/CommonUtils",
	"sap/fe/Action",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Sorter"
], function (jQuery, BaseObject, CommonUtils, Action, JSONModel, Sorter) {
	"use strict";

	/**
	 * @private
	 * @constructor
	 * @param {}
	 */

	var TableController = BaseObject.extend("sap.fe.controls._Table.TableController", {
		constructor: function (oTable) {
			BaseObject.apply(this, arguments);
			this.oTable = oTable;
			this.oInnerTable = oTable.getInnerTable();
		}
	});

	/**
	 *
	 *
	 * @param {}
	 * @private
	 */

	TableController.prototype.attachToFilterBar = function () {
		var oQueryParameters, oTableController = this;

		// currently entity set is not checked in query parameters, keep it as remarker
		var sEntitySet;

		if (this.oTable.getFilterBarId()) {
			var oView = CommonUtils.getParentViewOfControl(this.oTable);
			var oFilterBar = oView.byId(this.oTable.getFilterBarId());
			oFilterBar.attachSearch(function () {
				var oQueryParameters;
				oQueryParameters = oFilterBar.getQueryParameters(sEntitySet);
				oTableController.updateQueryParameters(oQueryParameters);
			});

			// if the FilterBar is already ready we ask for the query parameters immediately
			if (oFilterBar.isReady()) {
				oQueryParameters = oFilterBar.getQueryParameters(sEntitySet);
				oTableController.updateQueryParameters(oQueryParameters);
			}
		}
	};

	TableController.prototype.updateQueryParameters = function (oQueryParameters) {
		var oTable = this.oTable;
		var oConditionModel;
		var oListBinding = oTable.getListBinding();
		if (oQueryParameters) {
			oConditionModel = oQueryParameters.conditionModel;
		}

		var fnChangeParametersAndSubmit = function () {
			var bFilterWithoutErrors = true;
			if (!oListBinding) {
				oListBinding = oTable.getListBinding();
			}

			if (oConditionModel) {
				// applyFilters returns false if there is a validation error in the condition model
				bFilterWithoutErrors = oConditionModel.applyFilters();
			}
			if (bFilterWithoutErrors) {
				if (oQueryParameters) {
					delete oQueryParameters.conditionModel;
					oListBinding.changeParameters(oQueryParameters);
				}
			}
			oTable.getInnerTable().setShowOverlay(!bFilterWithoutErrors);
		};

		var fnModelContextChangeListener = function () {
			fnChangeParametersAndSubmit();
			oTable.detachModelContextChange(fnModelContextChangeListener);
		};

		if (oListBinding) {
			fnChangeParametersAndSubmit();
		} else {
			oTable.attachModelContextChange(fnModelContextChangeListener);
		}
	};

	TableController.prototype.handleDataRequested = function (oEvent) {
		// this should not be needed at all -> raised this info to the OData model team
		this.oInnerTable.setBusy(true);
	};


	TableController.prototype.handleCallAction = function (oEvent) {
		var mActionHandlerParameters = oEvent.getParameters();
		var oAction = oEvent.getSource();
		mActionHandlerParameters.mode = oAction.getMode();

		if (mActionHandlerParameters.mode === 'Inline') {
			mActionHandlerParameters.contexts = [oAction.getBindingContext()];
		} else {
			mActionHandlerParameters.contexts = this.oTable.getSelectedContexts();
		}

		// set application to busy, do not execute action if application is busy
		mActionHandlerParameters.setBusy = true;
		mActionHandlerParameters.checkBusy = true;
		this.oTable.fireCallAction(mActionHandlerParameters);
	};

	//This function is to get the toolbar action from given toolbar content
	TableController.prototype.getToolbarActions = function (aToolbarContent) {
		// there might be a better solution than looping through all controls of the header toolbar
		var aToolbarActions = [];

		for (var i = 0; i < aToolbarContent.length; i++) {
			if (aToolbarContent[i] instanceof Action) {
				aToolbarActions.push(aToolbarContent[i]);
			}
		}

		return aToolbarActions;
	};


	//This is a Util function to set the button in Table toolbar enabled/disabled
	TableController.prototype.enableDisableActionsUtil = function (iSelected, aToolbarActions) {
		var iFrom, iTo, oAction;

		if (iSelected != null) {
			for (var i = 0; i < aToolbarActions.length; i++) {
				oAction = aToolbarActions[i];
				iFrom = oAction.getMultiplicityFrom();
				iTo = oAction.getMultiplicityTo();

				if ((!iFrom || (iSelected >= iFrom) && (!iTo || iSelected <= iTo))) {
					oAction.setEnabled(true);
				} else {
					oAction.setEnabled(false);
				}
			}
		}

	};

	//This is a Util Function used to set binding count in title.
	TableController.prototype.bindTableCountUtil = function (oTitle) {
		if (oTitle != null) {
			oTitle.setModel(this.oInnerTable.getModel(), "headerContext");
		}

		var oBinding = this.oTable.getListBinding();
		if (oBinding) {
			oTitle.setBindingContext(oBinding.getHeaderContext(), "headerContext");
		}
	};

	TableController.prototype.createAndOpenViewSettingsDialog = function (oViewSettingsPropertyObject, iSelectedColumnItems, iColumnItems, oDialogPropertiesModel) {
		if (this.oViewSettingsPropertyModel == null && this.oViewSettingsPropertyModel == undefined) {
			var sSelectAllText = this.oInnerTable.getModel("sap.fe.i18n").getResourceBundle()
				.getText("SAPFE_VIEWSETTINGS_COLUMN_SELECTALL", [iSelectedColumnItems, iColumnItems]);
			oViewSettingsPropertyObject["selectAllText"] = sSelectAllText;
			oViewSettingsPropertyObject["sortDesecending"] = false;
			oViewSettingsPropertyObject["groupDescending"] = false;
			this.oViewSettingsPropertyModel = new JSONModel(oViewSettingsPropertyObject);
		}
		var oViewSettings = new sap.ui.view("viewSettingsXMLView", {
			viewName: "sap.fe.controls._ViewSettings.ViewSettings",
			type: "XML",
			async: true,
			preprocessors: {
				xml: {
					bindingContexts: {
						propertiesModel: this.oViewSettingsPropertyModel.createBindingContext("/"),
						dialogProperties: oDialogPropertiesModel.createBindingContext("/")
					},
					models: {
						propertiesModel: this.oViewSettingsPropertyModel,
						dialogProperties: oDialogPropertiesModel
					}
				}
			}
		});
		oViewSettings.setModel(this.oViewSettingsPropertyModel);
		this.oTable.addDependent(oViewSettings);
		oViewSettings.loaded().then(function () {
			var sActionName = (oDialogPropertiesModel.getData().InitialVisiblePanel === "columns") ? "viewSettingsXMLView--columns" : oDialogPropertiesModel.getData().InitialVisiblePanel;
			var oController = oViewSettings.getController();
			oController.oTableController = this;
			oViewSettings.byId("viewSettingsDialog").open(sActionName);
		}.bind(this));
	};


	TableController.prototype.createAndOpenP13nSettingsDialog = function (oP13nSettingsPropertyObject, oDialogPropertiesModel) {
		if (this.oP13nSettingsPropertyModel == null && this.oP13nSettingsPropertyModel == undefined) {
			oP13nSettingsPropertyObject["p13nSortItems"] = [];
			oP13nSettingsPropertyObject["p13nGroupItems"] = [];
			this.oP13nSettingsPropertyModel = new JSONModel(oP13nSettingsPropertyObject);
		}
		var oP13nSettings = new sap.ui.view("p13nSettingsXMLView", {
			viewName: "sap.fe.controls._P13nSettings.P13nSettings",
			type: "XML",
			async: true,
			preprocessors: {
				xml: {
					bindingContexts: {
						propertiesModel: this.oP13nSettingsPropertyModel.createBindingContext("/"),
						dialogProperties: oDialogPropertiesModel.createBindingContext("/")
					},
					models: {
						propertiesModel: this.oP13nSettingsPropertyModel,
						dialogProperties: oDialogPropertiesModel
					}
				}
			}
		});
		oP13nSettings.setModel(this.oP13nSettingsPropertyModel);
		this.oTable.addDependent(oP13nSettings);

		oP13nSettings.loaded().then(function () {
			var oController = oP13nSettings.getController();
			oController.oTableController = this;
			oP13nSettings.byId("p13nDialog").open();
		}.bind(this));
	};

	//Event handler for sort, group, column buttons in table toolbar
	TableController.prototype.onStandardActionClick = function (oEvent) {
		var sActionName = oEvent.getSource().getText(),
			oInnerTableMetaModel = this.oInnerTable.getModel().getMetaModel(),
			oEntityType = oInnerTableMetaModel.getObject("/" + this.oTable.getEntitySet() + "/"),
			isMultiTab = false,
			aTableColumns = this.oInnerTable.getColumns(),
			iColumnCount = aTableColumns.length,
			aColumnId = [],
			iSelectedPropCount = 0,
			aSortItems = [],
			aGroupItems = [],
			aColumnItems = [],
			sSettingsDialogType = this.oTable.getSettingsDialogType(),
			aEntityLineItems = this.oInnerTable.getModel().getMetaModel().getMetaContext(this.oTable.getContext()).getObject();

		for (var index = 0; index < iColumnCount; index++) {
			var oColumn = aTableColumns[index];
			var aColumnsIds = oColumn.getId().split("::");
			aColumnId.push(aColumnsIds[aColumnsIds.length - 1]);
		}

		for (var property in oEntityType) {
			if (typeof (oEntityType[property]) == "object" && oEntityType[property].$kind && oEntityType[property].$kind === "Property") {
				var _propertyName = oInnerTableMetaModel.getObject("/" + this.oTable.getEntitySet() + "/" + property + "@com.sap.vocabularies.Common.v1.Label");
				iSelectedPropCount = (aColumnId.indexOf(property) > -1 ) ? iSelectedPropCount + 1 : iSelectedPropCount;
				var oItem = {
					"name": (_propertyName != null && _propertyName != undefined) ? _propertyName : property,
					"columnKey": property,
					"selected": false
				};
				//Using JSON Stringify to avoid mutation of original object after changing one of the property in copied object.
				aSortItems.push(JSON.parse(JSON.stringify(oItem)));
				aGroupItems.push(JSON.parse(JSON.stringify(oItem)));
				var columnItem = JSON.parse(JSON.stringify(oItem));
				columnItem.selected = !!(aColumnId.indexOf(property) > -1);
				aColumnItems.push(columnItem);
			}
		}

		for (var item in aEntityLineItems) {
			if (typeof (aEntityLineItems[item]) == "object" && aEntityLineItems[item].$Type
				&& aEntityLineItems[item].$Type == "com.sap.vocabularies.UI.v1.DataFieldForAction") {
				iSelectedPropCount = (aColumnId.indexOf(aEntityLineItems[item].Action) > -1) ? iSelectedPropCount + 1 : iSelectedPropCount;
				var oAddtionalItem = {
					"name": (aEntityLineItems[item].Label) ? aEntityLineItems[item].Label : aEntityLineItems[item].Action,
					"columnKey": aEntityLineItems[item].Action,
					"selected": false
				};
				oAddtionalItem.selected = !!(aColumnId.indexOf(aEntityLineItems[item].Action) > -1);
				aColumnItems.push(oAddtionalItem);
			}
		}

		var oPropertyObject = {
			"sortPanelItems": aSortItems,
			"groupPanelItems": aGroupItems,
			"columnPanelItems": aColumnItems.sort(function (x, y) {
				if (x.selected === y.selected) {
					return 0;
				} else if (x.selected) {
					return -1;
				} else {
					return 1;
				}
			})
		};

		var oDialogPropertiesModel = new JSONModel({
			"InitialVisiblePanel": sActionName,
			"showSortPanel": !!(isMultiTab || sActionName === "sort"),
			"showGroupPanel": !!((isMultiTab || sActionName === "group") && (this.oInnerTable.getMetadata().getName() === "sap.m.Table")),
			//"showFilterPanel": !!(isMultiTab || sActionName === "filter"),
			"showColumnPanel": !!(isMultiTab || sActionName === "column")
		});

		if (sSettingsDialogType === "P13nDialog") {
			this.createAndOpenP13nSettingsDialog(oPropertyObject, oDialogPropertiesModel);
		} else {
			this.createAndOpenViewSettingsDialog(oPropertyObject, iSelectedPropCount, aColumnItems.length, oDialogPropertiesModel);
		}
	};

	TableController.prototype.applyGroupAndSort = function (aSorters) {
		if (aSorters.length > 0) {
			var oBinding = this.getListBinding();
			oBinding.sort(aSorters);
			this.updateQueryParameters();
		}
	};

	return TableController;

});
