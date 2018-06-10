sap.ui.define([
    "sap/ushell/utils"
], function (oUshellUtils) {
    "use strict";

    function getMember (oObject, sAccessPath) {
        return oUshellUtils.getMember(oObject, sAccessPath);
    }

    function mapOne(sKey, oSrc, oApp) {

        var oInbound = {};
        oInbound.semanticObject = oSrc.semanticObject;
        oInbound.action = oSrc.action;
        oInbound.title = oSrc.title || getMember(oApp, "sap|app.title");
        oInbound.info = oSrc.info || getMember(oApp, "sap|app.info");
        oInbound.icon = oSrc.icon || getMember(oApp, "sap|ui.icons.icon");
        oInbound.subTitle = oSrc.subTitle || getMember(oApp, "sap|app.subTitle");
        oInbound.shortTitle = oSrc.shortTitle || getMember(oApp, "sap|app.shortTitle");

        var sTileSize,
            oTargetOutbound,
            bIsCustomTile = false;

        oInbound.resolutionResult = jQuery.extend(true, {}, getMember(oApp, "sap|platform|runtime"));

        /*
         * ClientSideTargetResolution relies on different application
         * types than the ones returned by the OData service.
         */
        oInbound.resolutionResult = oInbound.resolutionResult || {};
        if (getMember(oApp, "sap|platform|runtime")) {
            oInbound.resolutionResult["sap.platform.runtime"] = jQuery.extend(true, {}, getMember(oApp, "sap|platform|runtime"));
        }

        // copy a GUI/WDA namespace if provided
        if (getMember(oApp, "sap|ui.technology") === "GUI") {
            oInbound.resolutionResult["sap.gui"] = getMember(oApp, "sap|gui");
        }

        if (getMember(oApp, "sap|ui.technology") === "WDA") {
            oInbound.resolutionResult["sap.wda"] = getMember(oApp, "sap|wda");
        }

        if (getMember(oApp, "sap|ui.technology") === "URL" && oInbound.resolutionResult["sap.platform.runtime"]) {
            // ["sap.platform.runtime"].uri  is the wave of the future, url works for now
            if (oInbound.resolutionResult["sap.platform.runtime"].uri) {
                oInbound.resolutionResult["sap.platform.runtime"].url = oInbound.resolutionResult["sap.platform.runtime"].uri;
                oInbound.resolutionResult.url = oInbound.resolutionResult["sap.platform.runtime"].uri;
            }
        }

        oInbound.resolutionResult.applicationType = this._formatApplicationType(oInbound.resolutionResult, oApp);

        // Forward the name of the systemAlias used to interpolate the URL
        // ClientSideTargetResolution will de-interpolate the URL before applying sap-system
        oInbound.resolutionResult.systemAlias = oInbound.resolutionResult.systemAlias || oSrc.systemAlias; // NOTE: "" is the local system alias
        oInbound.resolutionResult.text = oInbound.title;
        oInbound.deviceTypes = getMember(oApp, "sap|ui.deviceTypes") || {};

        // if not supplied, default is true (!)
        ["desktop", "tablet", "phone"].forEach(function(sMember) {
            // we overwrite member by member if deviceType specified in oSrc!
            if (Object.prototype.hasOwnProperty.call(oSrc.deviceTypes || {}, sMember)) {
                oInbound.deviceTypes[sMember] = oSrc.deviceTypes[sMember];
            }
            if (!Object.prototype.hasOwnProperty.call(oInbound.deviceTypes, sMember)) {
                oInbound.deviceTypes[sMember] = true;
            }
            oInbound.deviceTypes[sMember] = !!oInbound.deviceTypes[sMember];
        });

        // signature
        oInbound.signature = oSrc.signature || {};
        oInbound.signature.parameters = oInbound.signature.parameters || {};
        oInbound.signature.additionalParameters = (oSrc.signature || {}).additionalParameters || "allowed";

        var indicatorDataSource = oSrc.indicatorDataSource || getMember(oApp, "sap|app.indicatorDataSource"); //???check

        var oTempTileComponent = indicatorDataSource ? "#Shell-dynamicTile" : "#Shell-staticTile";

        if (getMember(oApp, "sap|app.type") === "tile" || getMember(oApp, "sap|flp.type") === "tile") {
            // this is a custom tile

            oTempTileComponent = oInbound.resolutionResult;
            oTempTileComponent.url = getMember(oApp, "sap|platform|runtime.componentProperties.url");
            oTempTileComponent.componentName = getMember(oApp, "sap|ui5.componentName");

            if (getMember(oApp,"sap|platform|runtime.includeManifest")) {
                // with includeManifest the server specifies that the application from CDM site
                // includes the entire manifest (App Descriptor) properties and can directly
                // be used for instantiation of the tile
                oTempTileComponent.componentProperties = oTempTileComponent.componentProperties || {};
                oTempTileComponent.componentProperties.manifest = jQuery.extend(true, {}, oApp);

                // sap.platform.runtime needs to be removed because it is added by the server
                // and is not part of the actual App Descriptor schema!
                delete oTempTileComponent.componentProperties.manifest["sap.platform.runtime"];
            }

            oTargetOutbound = getMember(oApp, "sap|app.crossNavigation.outbounds.target");
            bIsCustomTile = true;
        }

        if (getMember(oApp, "sap|app.type") === "plugin" || getMember(oApp, "sap|flp.type") === "plugin") {
            return undefined;
        }

        if (getMember(oApp, "sap|flp.tileSize")) {
            sTileSize = getMember(oApp, "sap|flp.tileSize");
        }

        oInbound.tileResolutionResult = {
            title: oInbound.title,
            subTitle: oInbound.subTitle,
            icon: oInbound.icon,
            size: sTileSize,
            info: oInbound.info,
            tileComponentLoadInfo: oTempTileComponent,
            indicatorDataSource: indicatorDataSource
        };

        oInbound.tileResolutionResult.isCustomTile = bIsCustomTile;
        if (oTargetOutbound) {
            oInbound.tileResolutionResult.targetOutbound = oTargetOutbound;
        }

        return oInbound;
    }

    /**
     * Extracts a valid <code>applicationType</code> field for
     * ClientSideTargetResolution from the site application resolution result.
     *
     * @param {object} oResolutionResult
     *   The application resolution result. An object like:
     * <pre>
     *   {
     *      "sap.platform.runtime": { ... },
     *      "sap.gui": { ... } // or "sap.wda" for wda applications
     *   }
     * </pre>
     * @param {object} oApp
     *   A site application object
     *
     * @returns {string}
     *   One of the following application types compatible with
     *   ClientSideTargetResolution service: "TR", "SAPUI5", "WDA", "URL".
     */
    function formatApplicationType (oResolutionResult, oApp) {
        var sApplicationType = oResolutionResult.applicationType;

        if (sApplicationType) {
            return sApplicationType;
        }

        var sComponentName = getMember(oApp, "sap|platform|runtime.componentProperties.self.name") || getMember(oApp, "sap|ui5.componentName");

        if (getMember(oApp, "sap|flp.appType") === "UI5" ||
            getMember(oApp, "sap|ui.technology") === "UI5") {

            oResolutionResult.applicationType = "SAPUI5";
            oResolutionResult.additionalInformation = "SAPUI5.Component=" + sComponentName;
            oResolutionResult.url = getMember(oApp, "sap|platform|runtime.componentProperties.url");
            oResolutionResult.applicationDependencies = getMember(oApp, "sap|platform|runtime.componentProperties");
            return "SAPUI5";
        }

        if (getMember(oApp, "sap|ui.technology") === "GUI") {
            oResolutionResult.applicationType = "TR";
            //oResult.url = getMember(oApp,"sap|platform|runtime.uri");
            oResolutionResult["sap.gui"] = getMember(oApp, "sap|gui");
            oResolutionResult.systemAlias = getMember(oApp, "sap|app.destination.name");
            return "TR";
        }

        if (getMember(oApp, "sap|ui.technology") === "WDA") {
            oResolutionResult.applicationType = "WDA";
            //oResult.url = getMember(oApp,"sap|platform|runtime.uri");
            oResolutionResult["sap.wda"] = getMember(oApp, "sap|wda");
            oResolutionResult.systemAlias = getMember(oApp, "sap|app.destination.name");
            return "WDA";
        }

        return "URL";
    }

    /**
     * Formats the target mappings contained in the CDM site projection into inbounds
     *
     * @param {object} oSite
     *   the CDM site projection
     *
     * @return {object[]}
     *   <p>
     *   an array of inbounds suitable for ClientSideTargetResolution service
     *   consumption.
     *   </p>
     */
    function formatSite (oSite) {
        var that = this;

        if (!oSite) {
            return [];
        }


        var aInbounds = [];
        try {
            var aSiteApplications = Object.keys(oSite.applications || {}).sort();
            aSiteApplications.forEach(function(sApplicationKey) {
                try {
                    var oApp = oSite.applications[sApplicationKey];
                    var oApplicationInbounds = getMember(oApp, "sap|app.crossNavigation.inbounds");
                    if (oApplicationInbounds) {
                        var lst2 = Object.keys(oApplicationInbounds).sort();
                        lst2.forEach(function(sInboundKey) {
                            var oInbound = oApplicationInbounds[sInboundKey];
                            var r = that._mapOne(sInboundKey, oInbound, oApp);
                            if (r) {
                                aInbounds.push(r);
                            }
                        });
                    }
                } catch (oError1) {
                    // this is here until validation on the CDM site is done
                    jQuery.sap.log.error(
                        "Error in application " + sApplicationKey + ": " + oError1,
                        oError1.stack
                    );
                }
            });
        } catch (oError2) {
            jQuery.sap.log.error(oError2);
            jQuery.sap.log.error(oError2.stack);
            return [];
        }

        return aInbounds;
    };


    return {
        formatSite: formatSite,
        //
        // Expose private methods for testing:
        //
        // - test can stub these
        // - code in this module consumes the stubs because consumes
        //   this._method() [ instead of method() ]
        //
        _mapOne: mapOne,
        _formatApplicationType: formatApplicationType
    };

}, /* bExport= */ true);
