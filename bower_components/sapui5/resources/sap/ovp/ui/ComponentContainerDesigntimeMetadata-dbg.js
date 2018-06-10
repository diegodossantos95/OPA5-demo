/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

sap.ui.define([
	'jquery.sap.global',
	'sap/ui/fl/changeHandler/JsControlTreeModifier',
    "sap/ui/rta/ui/SettingsDialog",
    "sap/ovp/cards/CommonUtils",
    "sap/ovp/cards/SettingsUtils",
    "sap/m/Dialog",
    "sap/m/Button"
], function(jQuery, JsControlTreeModifier, SettingsDialog, CommonUtils, SettingsUtils, Dialog, Button) {
	"use strict";

	return {
		name: {
            singular: sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Card"),
            plural: sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Cards")
        },
        actions: {
            remove: {
				changeType: "hideCardContainer",
				changeOnRelevantContainer: true
			},
			reveal: {
				changeType: "unhideCardContainer",
				changeOnRelevantContainer: true
			},
            settings: function() {
                return {
                    isEnabled: false,
                    changeOnRelevantContainer: true,
                    handler: function(oElement, fGetUnsavedChanges) {
                        SettingsUtils.getDialogBox(oElement).then(function(oDialogBox) {
                            oDialogBox.open();
                        });
                        // TODO: Pass the change specific content and the selector with resolve
                        return Promise.resolve();
                    }
                };
            }
        }
    };
},
/* bExport= */true);
