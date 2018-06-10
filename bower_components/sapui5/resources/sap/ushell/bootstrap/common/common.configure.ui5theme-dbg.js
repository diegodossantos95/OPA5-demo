sap.ui.define([
], function () {
    "use strict";

    return configureUI5Language;

    function configureUI5Language(oUshellConfig) {

        var oContainerAdapterConfig = oUshellConfig &&
                oUshellConfig.services &&
                oUshellConfig.services.Container &&
                oUshellConfig.services.Container.adapter &&
                oUshellConfig.services.Container.adapter.config,
            sDefaultTheme = oContainerAdapterConfig &&
                oContainerAdapterConfig.userProfile &&
                oContainerAdapterConfig.userProfile.defaults &&
                oContainerAdapterConfig.userProfile.defaults.theme,
            sPersonalizedTheme = oContainerAdapterConfig &&
                oContainerAdapterConfig.userProfilePersonalization &&
                oContainerAdapterConfig.userProfilePersonalization.theme,
            sAppliedTheme;

        sAppliedTheme = sPersonalizedTheme || sDefaultTheme;

        if (sAppliedTheme) {
            sap.ui.getCore().applyTheme(sAppliedTheme);
        }
    }

});