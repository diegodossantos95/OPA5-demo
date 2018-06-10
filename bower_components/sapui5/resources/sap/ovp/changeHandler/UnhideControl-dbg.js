/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

sap.ui.define([
	'jquery.sap.global',
	'sap/ui/fl/changeHandler/JsControlTreeModifier'
], function(jQuery, JsControlTreeModifier) {
	"use strict";

	/**
	 * Change handler for unhiding/revealing cards of the layout .
	 * @alias sap.ui.fl.changeHandler.UnhideControl
	 * @author SAP SE
	 * @version 1.50.4
	 * @experimental Since 1.27.0
	 */
	var UnhideControl = {
			"changeHandler": "default",
			"layers": {
				"CUSTOMER_BASE": false,
				"CUSTOMER": false,
				"USER": false
			}
	};


	return UnhideControl;
},
/* bExport= */true);
