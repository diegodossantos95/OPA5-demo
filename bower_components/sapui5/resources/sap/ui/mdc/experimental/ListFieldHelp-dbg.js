/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */

sap.ui.define([
	'sap/ui/mdc/experimental/FieldHelpBase', 'sap/ui/model/base/ManagedObjectModel', 'sap/m/List', 'sap/m/DisplayListItem'
], function(FieldHelpBase, ManagedObjectModel, List, DisplayListItem) {
	"use strict";

	/**
	 * Constructor for a new ListFieldHelp.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class A field help used in the <code>FieldFelp</code> aggregation in <code>Field</code> controls that shows a list of items
	 * @extends sap.ui.core.Element
	 * @version 1.50.6
	 * @constructor
	 * @private
	 * @since 1.50.0
	 * @alias sap.ui.mdc.experimental.ListFieldHelp
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ListFieldHelp = FieldHelpBase.extend("sap.ui.mdc.experimental.ListFieldHelp", /** @lends sap.ui.mdc.experimental.ListFieldHelp.prototype */
	{
		metadata: {
			library: "sap.ui.mdc",
			properties: {
				},
			aggregations: {
				/**
				 * items of the Field help
				 */
				items: {
					type: "sap.ui.core.ListItem",
					multiple: true,
					singularName : "item"
				}
			},
			defaultAggregation: "items",
			events: {

			}
		}
	});

//	ListFieldHelp._myItem = DisplayListItem.extend("ListFieldHelpItem", {
//		metadata: {
//			properties: {
//				key : {type : "string", group : "Data", defaultValue : ""}
//			}
//		},
//		renderer: "sap.m.DisplayListItemRenderer"
//	});

	ListFieldHelp.prototype.init = function() {

		FieldHelpBase.prototype.init.apply(this, arguments);

		this._oManagedObjectModel = new ManagedObjectModel(this);

	};

	ListFieldHelp.prototype.exit = function() {

		FieldHelpBase.prototype.exit.apply(this, arguments);

		this._oManagedObjectModel.destroy();
		delete this._oManagedObjectModel;

	};

	ListFieldHelp.prototype._createPopover = function() {

		var oPopover = FieldHelpBase.prototype._createPopover.apply(this, arguments);

		var oParent = this.getParent();
		if (oParent) {
			oPopover.setInitialFocus(oParent);
		}

//		var oItemTemplate = new ListFieldHelp._myItem({
		var oItemTemplate = new DisplayListItem({
			label: "{$field>text}",
			value: "{$field>additionalText}"//,
//			key: "{$field>key}"
		});

		var oFilter = new sap.ui.model.Filter("text", _suggestFilter.bind(this));

		this._oList = new List(this.getId() + "-List", {
			width: "100%",
			showNoData: false,
			mode: sap.m.ListMode.SingleSelectMaster,
			rememberSelections: false,
			items: {path: "$field>items", template: oItemTemplate, filters: oFilter},
//			itemPress: _handleItemPress.bind(this),
			selectionChange: _hanldeSelectionChange.bind(this)
		});

		this._oList.setModel(this._oManagedObjectModel, "$field");
		this._oList.bindElement({ path: "/", model: "$field" });

		this._setContent(this._oList);

		return oPopover;

	};

	ListFieldHelp.prototype.setParent = function(oParent, sAggregationName, bSuppressInvalidate) {

		FieldHelpBase.prototype.setParent.apply(this, arguments);

		// focus should stay on Field
		var oPopover = this.getAggregation("_popover");
		if (oPopover) {
			oPopover.setInitialFocus(oParent);
		}

		return this;

	};

	ListFieldHelp.prototype.setSelectedKey = function(sKey) {

		FieldHelpBase.prototype.setSelectedKey.apply(this, arguments);

		if (this._oList) {
			var aItems = this._oList.getItems();
			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				var oOriginalItem = _getOriginalItem.call(this, oItem);
				if (oOriginalItem.getKey() == sKey) {
					oItem.setSelected(true);
				} else {
					oItem.setSelected(false);
				}
			}
		}

		return this;

	};

	ListFieldHelp.prototype.setFilterValue = function(sFilterValue) {

		FieldHelpBase.prototype.setFilterValue.apply(this, arguments);

		if (this._oList) {
			var oBinding = this._oList.getBinding("items");
			oBinding.update();
			this._oList.updateItems();
			this.setSelectedKey(this.getSelectedKey()); // to update selection
		}

		return this;

	};

	ListFieldHelp.prototype.addItem = function(oItem) {

		this.addAggregation("items", oItem);

		if (!this._bUpdateItems) {
			this.fireDataUpdate();
		}

		return this;

	};

	ListFieldHelp.prototype.insertItem = function(oItem, iIndex) {

		this.insertAggregation("items", oItem, iIndex);

		if (!this._bUpdateItems) {
			this.fireDataUpdate();
		}

		return this;

	};

	ListFieldHelp.prototype.removeItem = function(vItem) {

		var oResult = this.removeAggregation("items", vItem);

		if (!this._bUpdateItems) {
			this.fireDataUpdate();
		}

		return oResult;

	};

	ListFieldHelp.prototype.removeAllItems = function() {

		var aResult = this.removeAllAggregation("items");

		if (!this._bUpdateItems) {
			this.fireDataUpdate();
		}

		return aResult;

	};

	ListFieldHelp.prototype.destroyItems = function() {

		this.destroyAggregation("items");

		if (!this._bUpdateItems) {
			this.fireDataUpdate();
		}

		return this;

	};

	ListFieldHelp.prototype.updateItem = function() {

		this._bUpdateItems = true;
		this.updateAggregation("items");
		this._bUpdateItems = false;

		this.fireDataUpdate();

	};

//	ListFieldHelp.prototype._handleAfterOpen = function() {
//
//		var oField = this.getParent();
//
//		if (oField) {
//			oField.focus();
//		}
//
//	};

	ListFieldHelp.prototype.openByTyping = function() {

		return true;

	};

//	ListFieldHelp.prototype.getFocusOnField = function() {
//
//		return true;
//
//	};

	ListFieldHelp.prototype.navigate = function(iStep) {

		var oPopover = this._getPopover();
		var oSelectedItem = this._oList.getSelectedItem();
		var aItems = this._oList.getItems();
		var iItems = aItems.length;
		var iSelectedIndex = 0;

		if (oSelectedItem) {
			iSelectedIndex = this._oList.indexOfItem(oSelectedItem);
			iSelectedIndex = iSelectedIndex + iStep;
			if (iSelectedIndex < 0) {
				iSelectedIndex = 0;
			} else if (iSelectedIndex >= iItems - 1) {
				iSelectedIndex = iItems - 1;
			}
		} else if (iStep >= 0){
			iSelectedIndex = iStep - 1;
		} else {
			iSelectedIndex = iItems + iStep;
		}

		var oItem = aItems[iSelectedIndex];
		if (oItem) {
			var oOriginalItem = _getOriginalItem.call(this, oItem);
			oItem.setSelected(true);
			this.setProperty("selectedKey", oOriginalItem.getKey(), true); // do not invalidate while FieldHelp

			if (!oPopover.isOpen()) {
				this.open();
			}

			this.fireNavigate({value: oItem.getLabel(), additionalValue: oItem.getValue(), key: oOriginalItem.getKey()});
		}

	};

	FieldHelpBase.prototype.getTextforKey = function(sKey) {

		var aItems = this.getItems();

		for (var i = 0; i < aItems.length; i++) {
			var oItem = aItems[i];
			if (oItem.getKey() == sKey) {
				return oItem.getText();
			}
		}

		return "";

	};

//	function _handleItemPress(oEvent) {
//		var oItem = oEvent.getParameter("listItem");
//
//	}

	function _hanldeSelectionChange(oEvent) {
		var oItem = oEvent.getParameter("listItem");
		var bSelected = oEvent.getParameter("selected");

		if (bSelected) {
			var oOriginalItem = _getOriginalItem.call(this, oItem);
			this.setProperty("selectedKey", oOriginalItem.getKey(), true); // do not invalidate while FieldHelp
			this.close();
			this.fireSelect({value: oItem.getLabel(), additionalValue: oItem.getValue(), key: oOriginalItem.getKey()});
		}
	}

	// returns ListFieldHelp item for inner list item
	function _getOriginalItem(oItem) {

		var sPath = oItem.getBindingContextPath();
		return this._oManagedObjectModel.getProperty(sPath);

	}

	function _suggestFilter(sText) {

		var sFilterValue = this.getFilterValue();

		if (!sFilterValue || jQuery.sap.startsWithIgnoreCase(sText, sFilterValue)) {
			return true;
		} else {
			return false;
		}

	}

	return ListFieldHelp;

}, /* bExport= */true);
