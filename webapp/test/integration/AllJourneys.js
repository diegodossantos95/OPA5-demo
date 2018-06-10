sap.ui.require([
  //Load page objects
  "sap/ui/test/Opa5",
  "com/sap/CloudSCAME/OPA5Demo/test/integration/pages/CommonPage",
  "sap/ui/qunit/qunit-css",
  "sap/ui/thirdparty/qunit",
  "sap/ui/qunit/qunit-junit"
], function (Opa5, CommonPage) {
  "use strict";
  QUnit.config.autostart = false;
    
  Opa5.extendConfig({
    arrangements: new CommonPage(),
    viewNamespace: "com.sap.CloudSCAME.OPA5Demo.view."
  });
    
  sap.ui.require([
    //Load journey objects
  ], function () {
    if (!/PhantomJS/.test(window.navigator.userAgent)) {
      QUnit.start();
    }
  });
});