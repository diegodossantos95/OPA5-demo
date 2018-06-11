sap.ui.require([
  //Load page objects
    "sap/ui/test/Opa5",
    "sap/ui/qunit/qunit-css",
    "sap/ui/thirdparty/qunit",
    "sap/ui/qunit/qunit-junit",
    "com/sap/CloudSCAME/OPA5Demo/test/integration/pages/AppPage"
], function (Opa5) {
    "use strict";
    QUnit.config.autostart = false;
    
    sap.ui.require([
        //Load journey objects
        "com/sap/CloudSCAME/OPA5Demo/test/integration/journeys/AppJourney"
    ], function () {
        if (!/PhantomJS/.test(window.navigator.userAgent)) {
            QUnit.start();
        }
    });
});