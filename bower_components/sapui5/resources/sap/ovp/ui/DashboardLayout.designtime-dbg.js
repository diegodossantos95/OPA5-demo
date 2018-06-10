sap.ui.define(["sap/ui/comp/navpopover/RTAHandler","sap/ovp/app/Component","sap/ui/rta/ui/SettingsDialog"],
    function(RTAHandler,oAppComponent,SettingsDialog) {
        "use strict";
        return {
            actions: {
            },
            aggregations: {
                content : {
                    domRef : ":sap-domref",
                    actions : {
                        move: "moveControls",
                        changeOnRelevantContainer: true
                    }
                }
            },
            name: {
            	singular: sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Card"),
                plural: sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Cards")
            }
        };
    }, false);
