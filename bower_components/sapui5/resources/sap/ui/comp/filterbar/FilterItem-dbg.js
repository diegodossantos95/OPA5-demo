/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.filterbar.FilterItem.
sap.ui.define([
	'jquery.sap.global', 'sap/m/Label', 'sap/ui/comp/library', 'sap/ui/core/Element', 'sap/ui/core/TooltipBase', 'sap/ui/comp/util/IdentifierUtil'
], function(jQuery, Label, library, Element, TooltipBase, IdentifierUtil) {
	"use strict";

	/**
	 * Constructor for a new FilterBar/FilterItem.
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class Represents a filter belonging to the basic group.
	 * @extends sap.ui.core.Element
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.filterbar.FilterItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FilterItem = Element.extend("sap.ui.comp.filterbar.FilterItem", /** @lends sap.ui.comp.filterbar.FilterItem.prototype */
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {

				/**
				 * Label of the filter.
				 */
				label: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Name of the filter. This is an identifier for the filter and has to be unique.
				 */
				name: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Mandatory flag.
				 */
				mandatory: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Visibility state of the filter.
				 */
				visible: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * Tooltip for the filter.
				 */
				labelTooltip: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Determines if a filter is part of the currently selected variant. <br>
				 * <b>Note:</b> This property can also be changed using the <code>visibleInFilterBar</code> property and by user interaction in the
				 * Select Filters dialog or the variant handling.
				 * @since 1.26.1
				 */
				partOfCurrentVariant: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * Controls the visibility of a filter item in the filter bar.
				 * @since 1.26.1
				 */
				visibleInFilterBar: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * A hidden filter will never be visible in the filter bar control
				 * @since 1.44.0
				 */
				hiddenFilter: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				}
			},
			aggregations: {

				/**
				 * The control of the filter.
				 */
				control: {
					type: "sap.ui.core.Control",
					multiple: false
				}
			},
			events: {

				/**
				 * This event is fired when one of the properties is changed.
				 */
				change: {
					parameters: {

						/**
						 * Name of the changed property
						 */
						propertyName: {
							type: "string"
						}
					}
				}
			}
		}
	});

	/**
	 * Initializes the filter item.
	 * @public
	 */
	FilterItem.prototype.init = function() {
		this._oLabel = null;
		this._bIsParameter = false;
	};

	/**
	 * @private
	 * @returns {boolean} indicates if this is a parameter.
	 */
	FilterItem.prototype._isParameter = function() {
		return this._bIsParameter;
	};

	/**
	 * Setter for visible property.
	 * @public
	 * @param {boolean} bVisible State of visibility
	 */
	FilterItem.prototype.setVisible = function(bVisible) {
		this.setProperty("visible", bVisible);
		this.fireChange({
			propertyName: "visible"
		});
	};

	/**
	 * Setter for visible in filter bar.
	 * @public
	 * @since 1.26.1
	 * @param {boolean} bVisible State of visibility in filter bar
	 */
	FilterItem.prototype.setVisibleInFilterBar = function(bVisible) {
		this.setProperty("visibleInFilterBar", bVisible);

		this.fireChange({
			propertyName: "visibleInFilterBar"
		});
	};

	/**
	 * Setter for partOfCurrentVariant in filter bar.
	 * @public
	 * @param {boolean} bVisible State of visibility in filter bar
	 */
	FilterItem.prototype.setPartOfCurrentVariant = function(bVisible) {
		this.setProperty("partOfCurrentVariant", bVisible);

		this.fireChange({
			propertyName: "partOfCurrentVariant"
		});
	};

	FilterItem.prototype._getGroupName = function() {

		var sName = "";
		if (this.getGroupName) {
			sName = IdentifierUtil.replace(this.getGroupName());
		}

		return sName;
	};

	FilterItem.prototype._getName = function() {
		var sName = IdentifierUtil.replace(this.getName());
		var sGroupName = this._getGroupName();

		if (sGroupName) {
			sName = sGroupName + "-" + sName;
		}

		return sName;

	};

	FilterItem.prototype._createLabelControl = function(sFilterBarId) {

		var sText = this.getLabel();

		var sId = "filterItem-" + this._getName();
		if (sFilterBarId) {
			sId = sFilterBarId + "-" + sId;
		}

		var oLabelCtrl = new Label({
			id: sId,
			text: sText,
			required: this.getMandatory(),
			tooltip: this.getLabelTooltip(),
			textAlign: "Begin"
		});

		return oLabelCtrl;
	};

	/**
	 * Setter for mandatory flag.
	 * @public
	 * @param {string} bValue Mandatory state
	 */
	FilterItem.prototype.setMandatory = function(bValue) {
		this.setProperty("mandatory", bValue);

		if (this._oLabel) {
			this._oLabel.setRequired(bValue);
		}

		this.fireChange({
			propertyName: "mandatory"
		});
	};

	/**
	 * Setter for label.
	 * @public
	 * @param {string} sValue Label text
	 */
	FilterItem.prototype.setLabel = function(sValue) {
		this.setProperty("label", sValue);

		if (this._oLabel) {
			this._oLabel.setText(sValue);
		}

		if (!this.getLabelTooltip()) {
			this.setLabelTooltip(sValue);
		}

		this.fireChange({
			propertyName: "label"
		});
	};

	/**
	 * Setter for tooltip.
	 * @public
	 * @param {string} sText Tooltip text
	 */
	FilterItem.prototype.setLabelTooltip = function(sText) {
		this.setProperty("labelTooltip", sText);

		if (this._oLabel) {
			this._oLabel.setTooltip(sText);
		}

		this.fireChange({
			propertyName: "labelTooltip"
		});
	};

	/**
	 * Returns the label control.
	 * @param {string} sFilterBarId The ID of the filter bar
	 * @returns {sap.m.Label} Label control
	 */
	FilterItem.prototype.getLabelControl = function(sFilterBarId) {

		if (!this._oLabel) {
			this._oLabel = this._createLabelControl(sFilterBarId);
		}

		return this._oLabel;
	};

	/**
	 * Destroys this element.
	 * @public
	 */
	FilterItem.prototype.destroy = function() {

		if (this._oLabel && !this._oLabel.bDestroyed) {
			this._oLabel.destroy();
		}

		Element.prototype.destroy.apply(this, arguments);

		this._oLabel = null;
	};

	return FilterItem;

}, /* bExport= */true);
