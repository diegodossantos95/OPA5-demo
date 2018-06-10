sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "com/sap/CloudSCAME/OPA5Demo/model/utils"
], function (Controller, utils) {
  "use strict";
  return Controller.extend("com.sap.CloudSCAME.OPA5Demo.controller.App", {
    onInit: function () {
      this.getView().addStyleClass(utils.getContentDensityClass());
    }
  });
});