/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"jquery.sap.global"
], function(jQuery) {
	"use strict";

	/**
	 * Viewport renderer.
	 * @namespace
	 */
	var ViewportRenderer = {};

	ViewportRenderer.render = function(rm, control) {
		rm.write("<div");
		rm.writeControlData(control);
		rm.addClass("sapVizKitViewport");
		rm.writeClasses();
		rm.writeAttribute("tabindex", 0);
		rm.addStyle("width", control.getWidth());
		rm.addStyle("height", control.getHeight());
		rm.writeStyles();
		rm.write(">");

		rm.write("</div>");
	};

	return ViewportRenderer;

}, true);
