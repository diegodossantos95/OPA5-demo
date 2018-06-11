sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/test/actions/Press'
], function (Controller, Press) {
    "use strict";
    return Controller.extend("com.sap.CloudSCAME.OPA5Demo.controller.App", {
        onInit: function () {
            var oButton = this.byId("navigationButton");
            setTimeout(function () {
				// Opa will wait until the button is not busy
                oButton.setBusy(false);
            }, 5000);
        },

        onNavButtonPress : function () {
            this.byId("myApp").to(this.byId("secondPage").getId());
        },

        onBack: function () {
            this.byId("myApp").to(this.byId("firstPage").getId());
        },

        onPress: function () {
	        // You may also invoke actions without letting OPA do it
            new Press().executeOn(this.byId("secondPage"));
        },

        onDelete: function (oEvent) {
            this.byId("productList").removeItem(oEvent.getParameter("listItem"));
        }
    });
});