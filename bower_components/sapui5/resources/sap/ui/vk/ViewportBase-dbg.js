/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.ViewportBase.
sap.ui.define([
	"jquery.sap.global", "./library", "sap/ui/core/Control", "sap/ui/core/ResizeHandler", "./Loco", "./ViewportHandler",
	"./Smart2DHandler", "./Messages", "./ContentConnector", "./ViewStateManager"
], function(
	jQuery, library, Control, ResizeHandler, Loco, ViewportHandler,
	Smart2DHandler, Messages, ContentConnector, ViewStateManager
) {
	"use strict";

	/**
	 * Constructor for a new Viewport.
	 *
	 * @class
	 * Provides a rendering canvas for the 3D elements of a loaded scene.
	 *
	 * @param {string} [sId] ID for the new Viewport control. Generated automatically if no ID is given.
	 * @param {object} [mSettings] Initial settings for the new Viewport control.
	 * @public
	 * @abstract
	 * @author SAP SE
	 * @version 1.50.7
	 * @extends sap.ui.core.Control
	 * @alias sap.ui.vk.ViewportBase
	 * @experimental Since 1.50.0 This class is experimental and might be modified or removed in future versions.
	 */
	var ViewportBase = Control.extend("sap.ui.vk.ViewportBase", /** @lends sap.ui.vk.ViewportBase.prototype */ {
		metadata: {
			library: "sap.ui.vk",

			"abstract": true,

			properties: {
				/**
				 * Shows or hides the debug info.
				 */
				showDebugInfo: {
					type: "boolean",
					defaultValue: false
				},

				/**
				 * Viewport background top color in the CSS Color format
				 */
				backgroundColorTop: {
					type: "sap.ui.core.CSSColor",
					defaultValue: "rgba(0, 0, 0, 1)" // black
				},

				/**
				 * Viewport background bottom color in the CSS Color format
				 */
				backgroundColorBottom: {
					type: "sap.ui.core.CSSColor",
					defaultValue: "rgba(255, 255, 255, 1)" // white
				},

				/**
				 * Viewport width
				 */
				width: {
					type: "sap.ui.core.CSSSize",
					defaultValue: "100%"
				},

				/**
				 * Viewport height
				 */
				height: {
					type: "sap.ui.core.CSSSize",
					defaultValue: "100%"
				},

				/**
				 * Selection mode
				 */
				selectionMode: {
					type: "sap.ui.vk.SelectionMode",
					defaultValue: sap.ui.vk.SelectionMode.Sticky
				}
			},

			associations: {
				/**
				 * An association to the <code>ContentConnector</code> instance that manages content resources.
				 */
				contentConnector: {
					type: "sap.ui.vk.ContentConnector",
					multiple: false
				},

				/**
				 * An association to the <code>ViewStateManager</code> instance.
				 */
				viewStateManager: {
					type: "sap.ui.vk.ViewStateManager",
					multiple: false
				}
			},

			events: {
				resize: {
					parameters: {
						/**
						 * Returns the width and height of new size { width: number, height: number } in CSS pixels.
						 */
						size: "object"
					}
				},

				/**
				 * This event is fired when nodes in the scene are picked.
				 * If application requires different selection behaviour then it can handle this event and implement its own selection method.
				 * In this case selectionMode property should be set to 'none'
				 * Application can modify list of picked node references
				 */
				nodesPicked: {
					parameters: {
						/**
						 * References of the nodes that are picked.
						 */
						picked: {
							type: "any[]"
						}
					},
					enableEventBubbling: true
				}
			}
		}
	});

	/**
	 * Helper method to provide "sticky" selection method. If this method is used then nodes are
	 * added into selection if they were not selected before, otherwise they are removed from selection.
	 * If this is called with empty nodes list then all already selected nodes are deselected.
	 *
	 * @param {any[]} nodes Array of node references
	 * @protected
	 */
	ViewportBase.prototype.stickySelectionHandler = function(nodes) {
		if (this._viewStateManager == null){
			return;
		}

		if (nodes.length === 0) {
			// Clear selection.
			var currentlySelected = [];
			this._viewStateManager.enumerateSelection(function(selectedNode) {
				currentlySelected.push(selectedNode);
			});
			if (currentlySelected.length > 0) {
				this._viewStateManager.setSelectionState(currentlySelected, false, false);
			}
		} else {
			var select = [];
			var deselect = [];
			var isSelected = this._viewStateManager.getSelectionState(nodes);
			for (var ni = 0; ni < isSelected.length; ni++) {
				if (isSelected[ni]) {
					deselect.push(nodes[ni]);
				} else {
					select.push(nodes[ni]);
				}
			}
			this._viewStateManager.setSelectionState(select, true);
			this._viewStateManager.setSelectionState(deselect, false);
		}
	};

	/**
	 * Helper method used to provide exclusive selection method. If this method is used then nodes are
	 * marked as selected while all previously selected objects are deselected.
	 * If this is called with empty nodes list then all already selected nodes are deselected.
	 *
	 * @param {any[]} nodes Array of node references
	 * @protected
	 */
	ViewportBase.prototype.exclusiveSelectionHandler = function(nodes) {
		if (this._viewStateManager == null){
			return;
		}
		var notInCurrentSelection = true;
		if (nodes.length === 1) {
			notInCurrentSelection = !this._viewStateManager.getSelectionState(nodes[0]);
		} else if (nodes.length > 1) {
			var isSelected = this._viewStateManager.getSelectionState(nodes);
			for (var ni = 0; ni < isSelected.length; ni++) {
				if (isSelected[ ni ]) {
					notInCurrentSelection = false;
					break;
				}
			}
		}

		if (this._viewStateManager && (nodes.length === 0 || notInCurrentSelection)) {
			// Clear selection.
			var currentlySelected = [];
			this._viewStateManager.enumerateSelection(function(selectedNode) {
				currentlySelected.push(selectedNode);
			});
			if (currentlySelected.length > 0) {
				this._viewStateManager.setSelectionState(currentlySelected, false, false);
			}
		}

		if (this._viewStateManager && nodes.length) {
			this._viewStateManager.setSelectionState(nodes, true);
		}
	};

	return ViewportBase;
});
