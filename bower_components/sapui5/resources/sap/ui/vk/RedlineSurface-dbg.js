/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
// Provides control sap.ui.vk.RedlineSurface.
sap.ui.define([
	"jquery.sap.global", "./library", "sap/ui/core/Control", "./Loco", "./RedlineGesturesHandler"
],
	function(jQuery, library, Control, Loco) {
		"use strict";

		/**
		 *  Constructor for a new RedlineSurface.
		 *
		 * @class Provides a bass class control for redlining.
		 *
		 * @public
		 * @author SAP SE
		 * @version 1.50.7
		 * @extends sap.ui.core.Control
		 * @alias sap.ui.vk.RedlineSurface
		 * @experimental Since 1.40.0 This class is experimental and might be modified or removed in future versions.
		 */
		var RedlineSurface = Control.extend("sap.ui.vk.RedlineSurface", /** @lends sap.ui.vk.RedlineDesign.prototype */ {
			metadata: {
				library: "sap.ui.vk",
				aggregations: {
					redlineElements: {
						type: "sap.ui.vk.RedlineElement"
					}
				},
				properties: {
					virtualLeft: {
						type: "float"
					},
					virtualTop: {
						type: "float"
					},
					virtualSideLength: {
						type: "float"
					},
					/*
					 * Panning ratio is applied to deltaX and deltaY when broadcasting pan events
					 */
					panningRatio: {
						type: "float",
						defaultValue: 1
					}
				},
				events: {
					pan: {
						parameters: {
							deltaX: "float",
							deltaY: "float"
						}
					},
					zoom: {
						parameters: {
							originX: "float",
							originY: "float",
							zoomFactor: "float"
						}
					}
				}
			}
		});

		RedlineSurface.prototype.init = function() {

		};

		RedlineSurface.prototype.onAfterRendering = function() {

		};

		/**
		 * Exports all the current redline elements as an array of JSON objects.
		 * @returns {object[]} An array of JSON objects.
		 * @public
		 */
		RedlineSurface.prototype.exportJSON = function() {
			return this.getRedlineElements().map(function(element) {
				return element.exportJSON();
			});
		};

		/**
		 * Iterates through all JSON objects from the array passed as parameter, and creates and restores
		 * the redline elements serialized in the array.
		 * @param {object[]} jsonElements An array of serialized redline elements.
		 * @returns {sap.ui.vk.RedlineSurface} <code>this</code> to allow method chaining.
		 * @public
		 */
		RedlineSurface.prototype.importJSON = function(jsonElements) {
			if (!jQuery.isArray(jsonElements)) {
				jsonElements = [ jsonElements ];
			}

			var virtualLeft = this.getVirtualLeft(),
				virtualTop = this.getVirtualTop(),
				virtualSideLength = this.getVirtualSideLength();

			jsonElements.forEach(function(json) {
				var ElementClass;
				switch (json.type) {
					case sap.ui.vk.Redline.ElementType.Rectangle:
						ElementClass = sap.ui.vk.RedlineElementRectangle;
						break;
					case sap.ui.vk.Redline.ElementType.Ellipse:
						ElementClass = sap.ui.vk.RedlineElementEllipse;
						break;
					case sap.ui.vk.Redline.ElementType.Freehand:
						ElementClass = sap.ui.vk.RedlineElementFreehand;
						break;
					default:
						// TO DO error handling for unsupported element type
				}
				this.addRedlineElement(new ElementClass().importJSON(json, virtualLeft, virtualTop, virtualSideLength));
			}.bind(this));
			return this;
		};

		/**
		 * Translates one or two values from the absolute pixel space to the relative values
		 * calculated in relation to the virtual viewport.
		 * @param {number} x A value in pixels.
		 * @param {number?} y A value in pixels.
		 * @returns {number | object} A relative value, or object containing two properties.
		 * @private
		 */
		RedlineSurface.prototype._toVirtualSpace = function(x, y) {
			if (arguments.length === 1) {
				return x / this.getVirtualSideLength();
			} else {
				return {
					x: (x - this.getVirtualLeft()) / this.getVirtualSideLength(),
					y: (y - this.getVirtualTop()) / this.getVirtualSideLength()
				};
			}
		};

		/**
		 * Translates one or two values from the relative space to the absolute pixel space.
		 * @param {number} x A relative value.
		 * @param {number?} y A relative value.
		 * @returns {number | object} Absolute pixel value corresponding to the parameters.
		 * @private
		 */
		RedlineSurface.prototype._toPixelSpace = function(x, y) {
			if (arguments.length === 1) {
				return x * this.getVirtualSideLength();
			} else {
				return {
					x: x * this.getVirtualSideLength() + this.getVirtualLeft(),
					y: y * this.getVirtualSideLength() + this.getVirtualTop()
				};
			}
		};

		RedlineSurface.prototype.setPanningRatio = function(panningRatio) {
			this.setProperty("panningRatio", panningRatio, true);
		};

		/**
		 * Updates the panning ratio by making calculations based on virtual viewport size and actual viewport size.
		 * @returns {sap.ui.vk.RedlineSurface} <code>this</code> to allow method chaining.
		 * @public
		 */
		RedlineSurface.prototype.updatePanningRatio = function() {
			var virtualLeft = this.getVirtualLeft(),
				virtualTop = this.getVirtualTop(),
				redlineDomRef = this.getDomRef(),
				redlineClientRect = redlineDomRef.getBoundingClientRect(),
				height = redlineClientRect.height,
				width = redlineClientRect.width,
				panningRatio;

			// Before broadcasting the pan event from within the redline gesture handler,
			// we need to apply a certain ratio to deltaX and deltaY.
			// Usually, the panning ratio is 1 which means no change, but we need to change the ratio when the
			// size of the virtual viewport is greater than the size of the actual viewport.
			if (virtualLeft === 0 && (height < width && virtualTop < 0 || (height > width && virtualTop > 0))) {
				panningRatio = height / width;
			} else {
				panningRatio = 1;
			}
			this.setPanningRatio(panningRatio);
			return this;
		};

		return RedlineSurface;

	});
