
// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The NavigationMode module
 *
 * <p>This module provides methods to get the navigation mode.</p>
 * The main method is #getNavigationMode that is used by
 * NavTargetResolution#resolveHashFragment and
 * indirectly by ClientSideTargetResolution#resolveTileIntent
 * It provides the navigationMode in LPA for CDM in method getTileView
 * Method Compute is used by ClientSide TargetResolution and takes not only the
 * next application but also the current application into account.
 *
 * @version 1.50.6
 */
sap.ui.define([], function() {
    /**
     * Checks whether the provided service configuration is valid and
     * logs an error message if not
     *
     * @param {object} oServiceConfiguration
     *  the service configuration object
     */
    var oExport = {};
    var _validateServiceConfiguration = function(oEnableInPlaceForClassicUIs) {
        var bIsValid = true;

        if (oEnableInPlaceForClassicUIs) {
            if (typeof oEnableInPlaceForClassicUIs !== "object") {
                bIsValid = false;
            } else {
                Object.keys(oEnableInPlaceForClassicUIs).forEach( function(sKey) {
                    if (["GUI","WDA"].indexOf(sKey) === -1) {
                        bIsValid = false;
                    } else if (typeof oEnableInPlaceForClassicUIs[sKey] !== "boolean") {
                        bIsValid = false;
                    }
                });
            }
        }

        if (!bIsValid){
            jQuery.sap.log.error("Invalid parameter: 'enableInPlaceForClassicUIs' must be an object; allowed properties: GUI|WDA, type boolean",
                "Actual parameter: " + JSON.stringify(oEnableInPlaceForClassicUIs),
                "sap.ushell.services.navigationMode");
        }
    };

     /**
     * Determines whether the given application type represents a legacy
     * application.
     *
     * @param {string} sApplicationType
     *   The application type to be checked
     * @returns {boolean}
     *   Whether the given application type represents a legacy application
     *   type.
     *
     * @private
     */
    oExport._isLegacyApplicationType = function(sApplicationType) {
        switch (sApplicationType) {
            case "WDA":
            case "TR":
            case "NWBC":
                // consider NWBC a legacy application type because this
                // method can be called with the resolutionResult returned
                // by ClientSideTargetResolution, for example,
                // via appConfiguration.getCurrentApplication().applicationType
                return true;
            default:
                return false;
        }
    };
// enableInPlaceForClassicUIs
    var _getClassicUITechnologyForApplicationType = function(sApplicationType) {
            switch(sApplicationType) {
                case "TR":
                    return "GUI";
                case "WDA":
                    return "WDA";
                default:
                    return undefined;
            }
        };

    var _isInplaceEnabledForApplicationType = function(oEnableInPlaceForClassicUIsConfig, sApplicationType) {

            if (jQuery.isPlainObject(oEnableInPlaceForClassicUIsConfig)) {
                return oEnableInPlaceForClassicUIsConfig[_getClassicUITechnologyForApplicationType(sApplicationType)];
            }

            return false; // default
        }


    /**
     * Calculates information about the current and next navigation mode for a
     * given application type, based on the values of sap-ushell-next-navmode
     * and sap-ushell-navmode (intent or default) parameters.
     * <br />
     * This method may log debug information on the console.
     *
     * @param {string} sNextApplicationType
     *   The applicationType of the application to navigate to
     *
     * @param {string} sExternalNextNavigationMode
     *   The value of the sap-ushell-navmode parameter coming from the
     *   intent parameter or default value
     *
     * @param {string} sExternalNavigationMode
     *   The value of the sap-ushell-navmode to be propagated in the resolution
     *   result as the sap-ushell-next-navmode parameter. This parmeter will
     *   not be propagated for invalid values of
     *   <code>sExternalNavigationMode</code>.
     *
     * * @param {string} sApplicationType
     *   The current applicationType the application is navigating from
     *
     * @returns {object}
     *   An object containing information about the next navigation mode and
     *   whether this is to pass through NavTargetResolution.
     *   <br />
     *   This is an object that can contain one or more of the followings:
     *   <pre>
     *   {
     *        explicitNavMode: true,     // use the specified navigationMode
     *        navigationMode: "inplace", // the navigation mode for the resolved target
     *        "sap-ushell-next-navmode": "explace"
     *   }
     *   </pre>
     *
     *
     */
    oExport.compute = function(sNextApplicationType, sExternalNextNavigationMode, sExternalNavigationMode, sApplicationType, oEnableInPlaceForClassicUIs) {
        var sInternalNavigationMode,
            bLegacyToLegacyNavigation,
            aAllowedExternalNavModes = ["inplace", "explace"];
        _validateServiceConfiguration(oEnableInPlaceForClassicUIs);
        var oNavigationMode = {};

        if (aAllowedExternalNavModes.indexOf(sExternalNextNavigationMode) >= 0) {
            oNavigationMode["sap-ushell-next-navmode"] = sExternalNextNavigationMode;
        }

        if (aAllowedExternalNavModes.indexOf(sExternalNavigationMode) >= 0) {
            sInternalNavigationMode = oExport._getInternalNavigationMode(sExternalNavigationMode, sNextApplicationType);

            jQuery.sap.log.debug(
                "Navigation mode was forced to " + sInternalNavigationMode,
                "because sap-ushell-navmode parameter was set to " + sExternalNavigationMode
                    + " for target with applicationType: " + sApplicationType,
                "sap.ushell.services.ClientSideTargetResolution"
            );

            oNavigationMode.navigationMode = sInternalNavigationMode;
            oNavigationMode.explicitNavMode = true;

            return oNavigationMode;
        }

        bLegacyToLegacyNavigation =
            oExport._isLegacyApplicationType(sApplicationType) && oExport._isLegacyApplicationType(sNextApplicationType);

        if ( _isInplaceEnabledForApplicationType(oEnableInPlaceForClassicUIs, sNextApplicationType) === true
            /* important */ && !bLegacyToLegacyNavigation) {

            oNavigationMode.navigationMode = "embedded";

        }

        return oNavigationMode;
    };



    /**
     * Determine the internal navigation mode for a given navigation mode.
     *
     * @param {string} sExternalNavigationMode
     *    A string identifying the external navigation mode. This is normally
     *    the value of the sap-ushell-next-navmode parameter configured in a
     *    matched inbound or provided in the intent.
     *
     *    This string can be one of:
     *    <ul>
     *       <li>explace</li>
     *       <li>inplace</li>
     *    </ul>
     *
     * @param {string} sApplicationType
     *    The application type of the inbound that has
     *    <code>sExternalNavigationMode</code> configured.
     *
     * @return {string}
     *
     *    The corresponding internal navigation mode. Can be one of the followings:
     *
     *    <ul>
     *      <li>replace: "take the URL of this target and replace it with the FLP"</li>
     *      <li>newWindow: "open a new window and put the URL of this target in the address bar"</li>
     *      <li>embedded: "embed this target (not merely its URL) into the current FLP"</li>
     *      <li>newWindowThenEmbedded: "open an FLP in a new window and embed this target (not merely its URL) into it"</li>
     *    </ul>
     *
     *    Returns null and logs an error in case wrong input parameters were given.
     *
     * @private
     */
    oExport._getInternalNavigationMode = function (sExternalNavigationMode, sApplicationType) {
        var oInternalNavigationModeMap = {
            SAPUI5: {
                inplace: "embedded",
                explace: "newWindowThenEmbedded"
            },
            WDA: {
                inplace: "embedded",
                explace: "newWindowThenEmbedded"
            },
            TR: {
                inplace: "embedded",
                explace: "newWindowThenEmbedded"
            },
            URL: {
                inplace: "replace",
                explace: "newWindow"
            }
        };

        if (!oInternalNavigationModeMap.hasOwnProperty(sApplicationType)) {
            jQuery.sap.log.error(
                sApplicationType + " is not a valid application type",
                "expected one of " + Object.keys(oInternalNavigationModeMap).join(", "),
                "sap.ushell.services.ClientSideTargetResolution"
            );
            return null;
        }

        if (sExternalNavigationMode !== "inplace" && sExternalNavigationMode !== "explace") {
            jQuery.sap.log.error(
                sExternalNavigationMode + " is not a valid external navigation mode",
                "expected one of 'internal', 'external'",
                "sap.ushell.services.ClientSideTargetResolution"
            );
            return null;
        }

        return oInternalNavigationModeMap[sApplicationType][sExternalNavigationMode];
    };
    var aWDAGUIAppType = ["NWBC", "WDA", "TR"];
            /**
         * Returns the navigation mode of a given resolved hash fragment
         *
         * @param {object} oResolvedHashFragment
         *     the hash fragment resolved by one of the registered resolvers
         *
         * @param {object} [oCurrentlyOpenedApp]
         *     an object describing the currently opened app
         *
         * @returns {string}
         *     the navigation mode for the given hash fragment. Returns the
         *     following values, each corresponding to a specific way the
         *     application should be navigated to:
         *
         *     <ul>
         *         <li><code>"embedded"</code>: the application should be
         *         opened in the current window, and rendered within the
         *         launchpad shell.</li>
         *
         *         <li><code>"newWindow"</code>: the application should be
         *         rendered in a new window, but no launchpad header must be
         *         present.</li>
         *
         *         <li><code>"newWindowThenEmbedded"</code>: the application
         *         should be opened in a new window but rendered within the
         *         launchpad shell.</li>
         *
         *         <li><code>undefined</code>: it was not possible to determine
         *         a navigation mode for the app. An error should be displayed
         *         in this case.</li>
         *     </ul>
         *
         * @private
         */
    oExport.getNavigationMode = function (oResolvedHashFragment, oCurrentlyOpenedApp) {
            var sAdditionalInformation = oResolvedHashFragment.additionalInformation,
                sApplicationType = oResolvedHashFragment.applicationType,
                sUi5ComponentPart,
                sUi5ComponentRegex;

            if (aWDAGUIAppType.indexOf((oCurrentlyOpenedApp || {}).applicationType) > -1
                    && !(oCurrentlyOpenedApp || {}).explicitNavMode) {

                return 'newWindowThenEmbedded';
            }

            if ((sAdditionalInformation === null || typeof sAdditionalInformation === "string" || typeof sAdditionalInformation === "undefined") &&
                    ( sApplicationType === "URL" || sApplicationType === "SAPUI5") ) {

                /*
                 * NOTE: The "managed=" and "SAPUI5.Component=" cases are
                 * skipped if the additionalInformation field does not start
                 * exactly with the "managed=" and "SAPUI5.Component=" values;
                 */

                // managed= case(s)
                if (sAdditionalInformation && sAdditionalInformation.indexOf("managed=") === 0) {

                    if (sAdditionalInformation === "managed=FioriWave1") {
                        return "embedded";
                    }

                    if (sAdditionalInformation === "managed=") {
                        return "newWindow";
                    }

                    return undefined;
                }

                // UI5 component case
                if (sAdditionalInformation && sAdditionalInformation.indexOf("SAPUI5.Component=") === 0) {
                    sUi5ComponentPart = "[a-zA-Z0-9_]+";
                    sUi5ComponentRegex = [
                        "^SAPUI5.Component=",   // starts with SAPUI5.Component=
                        sUi5ComponentPart,      // at least one part
                        "([.]", sUi5ComponentPart, ")*$" // multiple dot-separated parts
                    ].join("");

                    if (!(new RegExp(sUi5ComponentRegex)).test(sAdditionalInformation)) {
                        jQuery.sap.log.warning(["The UI5 component name in",
                            sAdditionalInformation, "is not valid.",
                            "Please use names satisfying", sUi5ComponentRegex
                            ].join(" "));
                    }

                    return "embedded";
                }

                return "newWindow";
            }

            // NWBC
            if (sApplicationType === "NWBC" || sApplicationType === "TR") {
                return "newWindowThenEmbedded";
            }

            // default
            return undefined;
        };

    return oExport;
}, true );

