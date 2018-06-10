/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/**
 * Initialization Code and shared classes of library sap.fiori.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Core','sap/ui/core/library','jquery.sap.resources'],
	function(jQuery, Core, library/* , jQuerySap */) {

	"use strict";

	/**
	 * A hybrid UILibrary merged from the most common UILibraries that are used in Fiori apps
	 *
	 * @namespace
	 * @name sap.fiori
	 * @public
	 */


	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.fiori",
		dependencies : ["sap.ui.core"],
		types: [],
		interfaces: [],
		controls: [],
		elements: [],
		version: "1.50.6"
	});

	var oConfig = sap.ui.getCore().getConfiguration(),
		sLanguage = oConfig.getLanguage(),
		aDeliveredLanguages = oConfig.getLanguagesDeliveredWithCore(),
		aLanguages = jQuery.sap.resources._getFallbackLocales(sLanguage, aDeliveredLanguages); 

	// chose the most specific language first
	sLanguage=aLanguages[0];

	// if it is not undefined or the 'raw' language, load the corr. preload file 
	if ( sLanguage && !window["sap-ui-debug"] ) {
		jQuery.sap.require("sap.fiori.messagebundle-preload_" + sLanguage);
	}

	return sap.fiori;

});
