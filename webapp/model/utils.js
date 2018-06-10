sap.ui.define([
  "sap/ui/Device"
], function (Device) {
  "use strict";

  return {
    // provide the density class that should be used according to the environment (may be "")
    getContentDensityClass: function () {
      var sCozyClass = "sapUiSizeCozy",
        sCompactClass = "sapUiSizeCompact";
        
      return Device.support.touch ? sCozyClass : sCompactClass;
    }
  };
});