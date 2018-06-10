sap.ui.define([
    "./common.constants",
    "../common/common.configure.ui5language",
    "../common/common.configure.ui5theme"
], function (oConstants, fnConfigureUI5Language, fnConfigureUI5Theme) {
    "use strict";

    return bootTask;

    function bootTask(sUshellBootstrapPlatform, fnContinueUI5Boot) {
        var oUshellConfig = window[oConstants.ushellConfigNamespace];

        // TODO: Declare dependency.
        window.jQuery.sap.require("sap.ushell.services.Container");

        fnConfigureUI5Language(oUshellConfig);
        fnConfigureUI5Theme(oUshellConfig);

        window.sap.ushell.bootstrap(sUshellBootstrapPlatform)
            .done(fnContinueUI5Boot);
    }
});