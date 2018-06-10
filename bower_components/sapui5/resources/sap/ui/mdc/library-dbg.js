/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/**
 * Initialization Code and shared classes of library sap.ui.mdc.
 */
sap.ui.define(['sap/ui/mdc/model/GenericType','sap/ui/mdc/experimental/provider/ProviderHook'], function(GenericType,ProviderHook) {
	"use strict";

	/**
	 * UI5 library: sap.ui.mdc containing controls that can be easily connected to rest service based models providing metadata.
	 *
	 * @namespace
	 * @name sap.ui.mdc
	 * @author SAP SE
	 * @version 1.50.6
	 * @public
	 */

	sap.ui.getCore().initLibrary({
		version: "1.50.6",
		name : "sap.ui.mdc",
		dependencies : ["sap.ui.core","sap.m"],
		types: ["sap.ui.mdc.FieldDisplay", "sap.ui.mdc.EditMode"],
		interfaces: [],
		controls: ["sap.ui.mdc.experimental.Field", "sap.ui.mdc.FilterField", "sap.ui.mdc.FilterToken"],
		elements: ["sap.ui.mdc.experimental.FieldHelpBase", "sap.ui.mdc.experimental.CustomFieldHelp"],
		noLibraryCSS: false
	});

	/**
	 * Defines how the fields display text should be formatted.
	 *
	 * @enum {string}
	 * @private
	 * @since 1.48.0
	 */
	sap.ui.mdc.FieldDisplay = {
		/**
		 * Only the value is displayed
		 * @public
		 */
		Value: "Value",
		/**
		 * Only the description is displayed
		 *
		 * if a <code>FieldHelp</code> is assigned to the <code>Field</code> the value is used as key for the <code>FieldHelp</code> items.
		 * @public
		 */
		Description: "Description",
		/**
		 * The value and the description is displayed in the field. The description is displayed after the value with brackets.
		 * @public
		 */
		ValueDescription: "ValueDescription",
		/**
		 * The description and the value is displayed in the field. The value is displayed after the description with brackets.
		 * @public
		 */
		DescriptionValue: "DescriptionValue"
	};

	/**
	 * Defines in what mode Filds are rendered
	 *
	 * @enum {string}
	 * @private
	 * @since 1.48.1
	 */
	sap.ui.mdc.EditMode = {
		/**
		 * Field is rendered in display mode
		 * @public
		 */
		Display: "Display",
		/**
		 * Field is rendered editable
		 * @public
		 */
		Editable: "Editable",
		/**
		 * Field is rendered readonly
		 * @public
		 */
		ReadOnly: "ReadOnly",
		/**
		 * Field is rendered disabled
		 * @public
		 */
		Disabled: "Disabled"
	};

	ProviderHook.apply();

	return sap.ui.mdc;

});
