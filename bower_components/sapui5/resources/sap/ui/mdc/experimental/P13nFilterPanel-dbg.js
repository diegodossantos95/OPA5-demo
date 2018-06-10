/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */

sap.ui.define([
	'jquery.sap.global', 'sap/m/library', './P13nPanel', './P13nInternalModel'
], function(jQuery, MLibrary, P13nPanel, P13nInternalModel) {
	"use strict";

	/**
	 * Constructor for a new P13nFilterPanel.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The P13nFilterPanel control is used to define selection settings like the visibility or the order of items.
	 * @extends sap.ui.mdc.experimental.P13nPanel
	 * @author SAP SE
	 * @version 1.50.6
	 * @constructor
	 * @private
	 * @since 1.48.0
	 * @alias sap.ui.mdc.experimental.P13nFilterPanel
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var P13nFilterPanel = P13nPanel.extend("sap.ui.mdc.experimental.P13nFilterPanel", /** @lends sap.ui.mdc.experimental.P13nFilterPanel.prototype */
	{
		metadata: {
			library: "sap.ui.mdc",
			properties: {
				/**
				 * Due to the re-binding during execution of _filterTableItems() the sap.m.Table re-create all items.
				 * So we have to store the 'columnKey' in order to mark the item after re-binding.
				 */
				columnKeyOfMarkedItem: {
					type: "string",
					defaultValue: undefined,
					visibility: "hidden"

				},
				/**
				 * Store the state of the button "Show selected".
				 */
				showOnlySelectedItems: {
					type: "boolean",
					defaultValue: false,
					visibility: "hidden"
				},

				internalModel: {
					type: "sap.ui.mdc.experimental.P13nInternalModel",
					visibility: "hidden"
				}
			}
		}
	});

	// ----------------------- Overwrite Methods -----------------

	P13nFilterPanel.prototype.init = function() {
		P13nPanel.prototype.init.apply(this, arguments);

		this._proxyOnModelContextChange = jQuery.proxy(this._onModelContextChange, this);
		this.attachModelContextChange(this._proxyOnModelContextChange);
	};

	P13nFilterPanel.prototype.refreshInitialState = function() {
		this.setInternalModelToBeUpdated(true);
		this.invalidate();
	};

	P13nFilterPanel.prototype._onModelContextChange = function() {
		if (!this.getModel()) {
			return;
		}

		this._updateInternalModel();
	};

	P13nFilterPanel.prototype.onBeforeRendering = function() {
		this._updateInternalModel();
	};

	P13nFilterPanel.prototype.exit = function () {
		this.detachModelContextChange(this._proxyOnModelContextChange);
	};

	// ----------------------- Private Methods -----------------------------------------
	/**
	 * @private
	 */
	P13nFilterPanel.prototype._selectTableItem = function(oTableItem) {
		// 1. Change the 'position' on model items
		this.getInternalModel().selectModelItem(this.getInternalModel().getModelItemByColumnKey(this._getColumnKeyByTableItem(oTableItem)), oTableItem.getSelected());
		this._syncPosition();

		// //TODO: wenn es nur ein unselected item ist und man drückt auf "select All" das eine item wird selektiert und markiert (falsch!)
		// First set marked item
		this._toggleMarkedTableItem(oTableItem);
		// Then update move button according to marked item
		this._updateControlLogic();
		this._updateCounts();
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype._moveTableItem = function(oTableItemFrom, oTableItemTo) {
		var oMItemFrom = this.getInternalModel().getModelItemByColumnKey(this._getColumnKeyByTableItem(oTableItemFrom));
		var oMItemTo = this.getInternalModel().getModelItemByColumnKey(this._getColumnKeyByTableItem(oTableItemTo));

		// 1. Change the 'position' on model items
		this.getInternalModel().moveModelItemPosition(oMItemFrom, oMItemTo);
		this._syncPosition();
		// 2. Move the items inside of the model
		this.getInternalModel().moveModelItem(oMItemFrom, oMItemTo);
		// 3. Remove style of current table item (otherwise the style remains on the item after move)
		this._removeStyleFromTableItem(this._getMarkedTableItem());
		// 4. Sort table items according to the model items
		this._sortTableItemsAccordingToInternalModel();

		// First set marked item
		this._toggleMarkedTableItem(this._getMarkedTableItem());
		// Then update move button according to marked item
		this._updateControlLogic();
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype.onPressButtonMoveToTop = function() {
		this._moveTableItem(this._getMarkedTableItem(), this._getVisibleTableItems()[0]);
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype.onPressButtonMoveUp = function() {
		var aVisibleTableItems = this._getVisibleTableItems();
		this._moveTableItem(this._getMarkedTableItem(), aVisibleTableItems[aVisibleTableItems.indexOf(this._getMarkedTableItem()) - 1]);
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype.onPressButtonMoveDown = function() {
		var aVisibleTableItems = this._getVisibleTableItems();
		this._moveTableItem(this._getMarkedTableItem(), aVisibleTableItems[aVisibleTableItems.indexOf(this._getMarkedTableItem()) + 1]);
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype.onPressButtonMoveToBottom = function() {
		var aVisibleTableItems = this._getVisibleTableItems();
		this._moveTableItem(this._getMarkedTableItem(), aVisibleTableItems[aVisibleTableItems.length - 1]);
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype.onItemPressed = function(oEvent) {
		// First set marked item
		this._toggleMarkedTableItem(oEvent.getParameter('listItem'));
		// Then update move button according to marked item
		this._updateControlLogic();
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype.onSelectionChange = function(oEvent) {
		oEvent.getParameter("listItems").forEach(function(oTableItem) {
			this._selectTableItem(oTableItem);
		}, this);
	};

	/**
	 * Switches 'Show Selected' button to 'Show All' and back.
	 *
	 * @private
	 */
	P13nFilterPanel.prototype.onSwitchButtonShowSelected = function() {
		this.setShowOnlySelectedItems(!this.getShowOnlySelectedItems());

		this._removeStyleFromTableItem(this._getMarkedTableItem());
		this._filterTableItems();

		// First set marked item
		this._toggleMarkedTableItem(this._getMarkedTableItem());
		// Then update move button according to marked item
		this._updateControlLogic();
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype.onSearchFieldLiveChange = function() {
		this._removeStyleFromTableItem(this._getMarkedTableItem());
		this._filterTableItems();

		// First set marked item
		this._toggleMarkedTableItem(this._getMarkedTableItem());
		// Then update move button according to marked item
		this._updateControlLogic();
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype._filterTableItems = function() {
		var aFilters = [];
		if (this._isFilteredByShowSelected() === true) {
			aFilters.push(new sap.ui.model.Filter("selected", "EQ", true));
		}
		var sSearchText = this._getSearchText();
		if (sSearchText) {
			aFilters.push(new sap.ui.model.Filter([
				new sap.ui.model.Filter("text", sap.ui.model.FilterOperator.Contains, sSearchText), new sap.ui.model.Filter("tooltip", sap.ui.model.FilterOperator.Contains, sSearchText), new sap.ui.model.Filter("role", sap.ui.model.FilterOperator.Contains, sSearchText), new sap.ui.model.Filter("aggregationRole", sap.ui.model.FilterOperator.Contains, sSearchText)
			], false));
		}
		this._getTable().getBinding("items").filter(aFilters);
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype._sortTableItemsAccordingToInternalModel = function() {
		var fComparator = function(oItemA, oItemB) {
			var oMItemA = this.getInternalModel().getModelItemByColumnKey(oItemA.getColumnKey());
			var oMItemB = this.getInternalModel().getModelItemByColumnKey(oItemB.getColumnKey());
			var iIndexA = this.getInternalModel().getIndexOfModelItem(oMItemA);
			var iIndexB = this.getInternalModel().getIndexOfModelItem(oMItemB);
			if (iIndexA < iIndexB) {
				return -1;
			} else if (iIndexA > iIndexB) {
				return 1;
			}
			return 0;
		};
		this._getTable().getBinding("items").sort(new sap.ui.model.Sorter({
			path: '',
			descending: false,
			group: false,
			comparator: fComparator.bind(this)
		}));
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype._getVisibleTableItems = function() {
		return this._getTable().getItems().filter(function(oTableItem) {
			return !!oTableItem.getVisible();
		});
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype._getMarkedTableItem = function() {
		return this._getTableItemByColumnKey(this.getColumnKeyOfMarkedItem());
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype._toggleMarkedTableItem = function(oTableItem) {
		this._removeStyleFromTableItem(this._getMarkedTableItem());
		// When filter is set, the table items are reduced so marked table item can disappear.
		var sColumnKey = this._getColumnKeyByTableItem(oTableItem);
		if (sColumnKey) {
			this.setColumnKeyOfMarkedItem(sColumnKey);
			this._addStyleToTableItem(oTableItem);
		}
	};

	/**
	 * @returns {sap.m.ListItemBase || undefined}
	 * @private
	 */
	P13nFilterPanel.prototype._getStyledAsMarkedTableItem = function() {
		var aDomElements = this._getTable().$().find(".sapMP13nColumnsPanelItemSelected");
		return aDomElements.length ? jQuery(aDomElements[0]).control()[0] : undefined;
	};

	/**
	 * @returns {sap.m.ListItemBase || undefined}
	 * @private
	 */
	P13nFilterPanel.prototype._getTableItemByColumnKey = function(sColumnKey) {
		var aContext = this._getTable().getBinding("items").getContexts();
		return this._getTable().getItems().find(function(oTableItem, iIndex) {
			return aContext[iIndex].getObject().getColumnKey() === sColumnKey;
		});
	};

	/**
	 *
	 * @param {sap.m.ListItemBase} oTableItem
	 * @returns {string || null}
	 * @private
	 */
	P13nFilterPanel.prototype._getColumnKeyByTableItem = function(oTableItem) {
		var iIndex = this._getTable().indexOfItem(oTableItem);
		if (iIndex < 0) {
			return null;
		}
		return this._getTable().getBinding("items").getContexts()[iIndex].getObject().getColumnKey();
	};

	P13nFilterPanel.prototype._syncPosition = function() {
		this.getItems().forEach(function(oItem) {
			var oMItem = this.getInternalModel().getModelItemByColumnKey(oItem.getColumnKey());
			oItem.setPosition(oMItem.position);
		}, this);
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype._addStyleToTableItem = function(oTableItem) {
		if (oTableItem) {
			oTableItem.addStyleClass("sapMP13nColumnsPanelItemSelected");
		}
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype._removeStyleFromTableItem = function(oTableItem) {
		if (oTableItem) {
			oTableItem.removeStyleClass("sapMP13nColumnsPanelItemSelected");
		}
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype._isFilteredByShowSelected = function() {
		return !!this.getShowOnlySelectedItems();
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype._updateControlLogic = function() {
		var aVisibleTableItems = this._getVisibleTableItems();
		this._getManagedObjectModel().setProperty("/@custom/isMoveUpButtonEnabled", aVisibleTableItems.indexOf(this._getMarkedTableItem()) > 0);
		this._getManagedObjectModel().setProperty("/@custom/isMoveDownButtonEnabled", aVisibleTableItems.indexOf(this._getMarkedTableItem()) > -1 && aVisibleTableItems.indexOf(this._getMarkedTableItem()) < aVisibleTableItems.length - 1);
	};

	/**
	 * Updates count of selected items.
	 *
	 * @private
	 */
	P13nFilterPanel.prototype._updateCounts = function() {
		var iCountOfSelectedItems = 0;
		this.getItems().forEach(function(oItem) {
			if (oItem.getSelected()) {
				iCountOfSelectedItems++;
			}
		});
		this._getManagedObjectModel().setProperty("/@custom/countOfSelectedItems", iCountOfSelectedItems);
		this._getManagedObjectModel().setProperty("/@custom/countOfItems", this.getItems().length);
	};

	/**
	 * @private
	 */
	P13nFilterPanel.prototype._updateInternalModel = function() {
		if (!this.getInternalModelToBeUpdated()) {
			return;
		}
		this.setInternalModelToBeUpdated(false);

		// Remove the marking style before table items are updated
		this._removeStyleFromTableItem(this._getMarkedTableItem());

		this.setInternalModel(new P13nInternalModel({
			tableItems: this.getItems()
		}));
		this._sortTableItemsAccordingToInternalModel();
		this._filterTableItems();

		// Set marked item initially to the first table item if not defined yet via property 'columnKeyOfMarkedItem'
		if (!this.getColumnKeyOfMarkedItem()) {
			// First set marked item
			this.setColumnKeyOfMarkedItem(this._getColumnKeyByTableItem(this._getVisibleTableItems()[0]));
		}
		this._toggleMarkedTableItem(this._getMarkedTableItem());

		// Then update move button according to marked item
		this._updateControlLogic();
		this._updateCounts();
	};

	return P13nFilterPanel;

}, /* bExport= */true);
