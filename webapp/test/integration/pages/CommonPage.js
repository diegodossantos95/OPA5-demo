sap.ui.define("com.sap.CloudSCAME.OPA5Demo.test.integration.pages.CommonPage", [
  'sap/ui/test/Opa5'
],function (Opa5) {
  "use strict";

  function getFrameUrl(sHash, sUrlParameters) {
    var sUrl = jQuery.sap.getResourcePath("com/sap/CloudSCAME/OPA5Demo/test", "/mockServer.html");

    if (sUrlParameters) {
      sUrlParameters = "?" + sUrlParameters;
      sUrl = sUrl + sUrlParameters;
    }

    if (sHash) {
      sUrl = sUrl + "#" + sHash;
    }
        
    return sUrl;
  }

  return Opa5.extend("com.sap.CloudSCAME.OPA5Demo.test.integration.pages.CommonPage", {

    constructor: function (oConfig) {
      Opa5.apply(this, arguments);

      this._oConfig = oConfig;
    },

    iStartMyApp: function (oOptions) {
      var sUrlParameters;
      oOptions = oOptions || { delay: 0 };

      sUrlParameters = "serverDelay=" + oOptions.delay;

      this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, sUrlParameters));
    },

    iLookAtTheScreen: function () {
      return this;
    }
  });
});
