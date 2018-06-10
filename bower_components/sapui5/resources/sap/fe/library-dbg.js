/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

/**
 * @namespace reserved for Fiori Elements
 * @name sap.fe
 * @private
 * @experimental
 */

/**
 * Initialization Code and shared classes of library sap.fe
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/library"
], function (jQuery, library1) {
	"use strict";

	/**
	 * Fiori Elements Library
	 *
	 * @namespace
	 * @name sap.fe
	 * @private
	 * @experimental
	 */

	// library dependencies
	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name: "sap.fe",
		dependencies: [
			"sap.ui.core"
		],
		types: [],
		interfaces: [],
		controls: [],
		elements: [],
		extensions: {
			flChangeHandlers: {
				"sap.fe.Table" : "sap/fe/controls/_Table/Table"
			}
		},
		version: "1.50.2"
	});

	sap.ui.require(['sap/ui/core/XMLComposite', 'sap/ui/core/util/XMLPreprocessor'], function (XMLComposite, XMLPreprocessor) {
		XMLPreprocessor.plugIn(function (oNode, oVisitor) {
			oVisitor.visitAttributes(oNode);
			XMLComposite.initialTemplating(oNode, oVisitor, "sap.fe.Table");
		}, "sap.fe", "Table");

		XMLPreprocessor.plugIn(function (oNode, oVisitor) {
			oVisitor.visitAttributes(oNode);
			XMLComposite.initialTemplating(oNode, oVisitor, "sap.fe.FilterBar");
		}, "sap.fe", "FilterBar");

		// XMLPreprocessor.plugIn(function(oNode, oVisitor) {
		// 	oVisitor.visitAttributes(oNode);
		// 	XMLComposite.initialTemplating(oNode, oVisitor, "sap.fe.controls.Field");
		// },"sap.fe.controls","Field");
	});

	return sap.fe;

}, /* bExport= */false);
