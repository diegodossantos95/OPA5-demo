sap.ui.define([
    "sap/ushell/services/_Personalization/constants",
    "sap/ushell/services/_Personalization/constants.private",   // TODO: clarify if private access is OK for adapter
    "jquery.sap.global"
], function (oStorageConstants, oInternalPersonalizationConstants, jQuery) {
    "use strict";

    return Object.create(null, {
        PersonalizationAdapter: { value: PersonalizationAdapter },

        getStorageResourceRoot: { value: getStorageResourceRoot },
        getContainerUrl: { value: getContainerUrl },

        delAdapterContainer: { value: delAdapterContainer },
        createContainerData: { value: createContainerData },
        getAdapterContainer: { value: AdapterContainer },

        getContainerCategory: { value: getContainerCategory },
        isCategoryPContainer: { value: isCategoryPContainer },
        trimContainerKey: { value: trimContainerKey },

        save: { value: save },
        load: { value: load },
        del: { value: del },
        clearContainerData: { value: clearContainerData },
        getItemKeys: { value: getItemKeys },
        containsItem: { value: containsItem },

        setItemValue: { value: setItemValue },
        getItemValue: { value: getItemValue },
        delItem: { value: delItem },

        addPrefixToItemKey: { value: addPrefixToItemKey },
        stripPrefixFromItemKey: { value: stripPrefixFromItemKey }
    });

    function PersonalizationAdapter(oHttpClient, oContainerCache, oSystem, sParameters, oConfig) {
        var sStorageResourceRoot;

        oConfig = oConfig && oConfig.config;

        if (!oConfig) {
            throw new Error("PersonalizationAdapter: missing configuration.");
        }

        if (!oContainerCache) {
            oContainerCache = Object.create(null);
        }

        sStorageResourceRoot = getStorageResourceRoot(oConfig);

        return Object.create(null, {
            getAdapterContainer: {
                value: AdapterContainer.bind(null, oContainerCache, oHttpClient, sStorageResourceRoot)
            },
            delAdapterContainer: {
                value: delAdapterContainer.bind(null, oContainerCache, oHttpClient, sStorageResourceRoot)
            }
        });
    }

    function getStorageResourceRoot(oConfig) {
        var bResourceRootIsMissing = !oConfig || !oConfig.storageResourceRoot;

        if (bResourceRootIsMissing) {
            throw new Error("Configuration error: storage resource root is not defined.");
        }

        return oConfig.storageResourceRoot;
    }

    function getContainerUrl(oScope, sContainerKey, sStorageResourceRoot) {
        var sContainerUrl = sStorageResourceRoot
            + "/"
            + getContainerCategory(oScope)
            + "/"
            + encodeURIComponent(trimContainerKey(sContainerKey))
            + ".json";

        // Remove repeated forward slashes if any and appropriately.
        // -- Appropriately, because it should not reduce http{s,}:// to http{s,}:/
        return sContainerUrl.replace(
            /(https?:)?\/{2,}/g,
            function ($0, $1) {
                return ($1 || "") + ($1 ? "\/\/" : "\/");
            }
        );
    }

    // TODO: factor this out into utils shared with ABAP adapter
    function trimContainerKey(sContainerKey) {
        var sPrefix = oInternalPersonalizationConstants.S_CONTAINER_PREFIX,
            sContainerKeyWithoutPrefix,
            sResult;

        if (jQuery.type(sContainerKey) !== "string" || sContainerKey.length === 0) {
            throw new Error("Personalization container key must be a non-empty string");
        }

        // check for prefix; service always sets the same prefix for containers from adapter,
        // so we strip it to shorten the key that is persisted (same is done on classic ABAP platform)
        if (sContainerKey.substring(0, sPrefix.length)  === sPrefix) {
            sContainerKeyWithoutPrefix = sContainerKey.substring(sPrefix.length);
        } else {
            jQuery.sap.log.error("Unexpected personalization container key: " + sContainerKey,
                "should always be prefixed with " + sPrefix,
                "sap.ushell.adapters.cdm.PersonalizationAdapter"
            );
            sContainerKeyWithoutPrefix = sContainerKey;
        }

        // check for maximum key length; if it is exceeded, it is shortened
        if (sContainerKeyWithoutPrefix.length <= 40) {
            sResult = sContainerKeyWithoutPrefix;
        } else {
            sResult = sContainerKeyWithoutPrefix.substring(0, 40);
            jQuery.sap.log.error(                "Invalid personalization container key: '" + sContainerKeyWithoutPrefix + "'"
                + " exceeds maximum key length (40 characters) and is shortened to '" + sResult + "'",
                undefined,
                "sap.ushell.adapters.cdm.PersonalizationAdapter"
            );
        }

        return sResult;
    }

    function getDefaultScope() {
        return {
            validity: Infinity,
            keyCategory: oStorageConstants.keyCategory.GENERATED_KEY,
            writeFrequency: oStorageConstants.writeFrequency.HIGH,
            clientStorageAllowed: false
        };
    }

    function delAdapterContainer(oContainerCache, oHttpClient, sUrl) {
        var oContainer = oContainerCache && oContainerCache[sUrl];

        if (oContainer) {
            delete oContainerCache[sUrl];
        }

        return del(oHttpClient, sUrl);
    }

    function createContainerData(oScope, sAppName) {
        var oContainerData;
        if ((!sAppName && sAppName !== "") || sAppName.constructor !== String) {
            jQuery.sap.log.warning(
                "Personalization container has an invalid app name; must be a non-empty string",
                null,
                "sap.ushell.adapters.cdm.PersonalizationAdapter");
        }

        if (!oScope) {
            oScope = getDefaultScope();
        }

        oContainerData = Object.create(null, {
            __metadata: { value: Object.create(null, {
                loaded: { value: false, enumerable: false, writable: true },
                appName: { value: sAppName, enumerable: true },
                created: {
                    value: (new Date()).toISOString(),
                    enumerable: true,
                    writable: true
                },
                validity: { value: oScope.validity, enumerable: true, writable: true },
                category: { value: getContainerCategory(oScope), enumerable: true }
            })
            , enumerable: true}
        });
        return oContainerData;
    }

    function AdapterContainer(oContainerCache, oHttpClient, sStorageResourceRoot, sContainerKey, oScope, sAppName) {
        var oContainerData,
            sUrl = getContainerUrl(oScope, sContainerKey, sStorageResourceRoot);

        // TODO: revise container cache - is never filled
        if (oContainerCache && oContainerCache[sUrl]) {
            return oContainerCache[sUrl];
        }

        oContainerData = createContainerData(oScope, sAppName);

        return Object.create(null, {
            // ---
            save: { value: save.bind(null, oHttpClient, oContainerData, sUrl) },
            load: { value: load.bind(null, oHttpClient, oContainerData, sUrl) },
            del: { value: del.bind(null, oHttpClient, oContainerData, sUrl) },
            getItemKeys: { value: getItemKeys.bind(null, oContainerData) },
            containsItem: { value: containsItem.bind(null, oContainerData) },
            // ---
            setItemValue: { value: setItemValue.bind(null, oContainerData) },
            getItemValue: { value: getItemValue.bind(null, oContainerData) },
            // ---
            delItem: { value: delItem.bind(null, oContainerData) },

            _containerData: { value: oContainerData },
            _containerKey: { value: sContainerKey }
        });
    }

    function getContainerCategory(oScope) {
        return isCategoryPContainer(oScope) ? "p" : "u";
    }

    function isCategoryPContainer(oScope) {
        return oScope
            && oScope.keyCategory === oStorageConstants.keyCategory.FIXED_KEY
            && oScope.writeFrequency === oStorageConstants.writeFrequency.LOW
            && oScope.clientStorageAllowed;
    }

    function save(oHttpClient, oContainerData, sUrl) {
        return new jQuery.Deferred(function (oDeferred) {
            oHttpClient.put(sUrl, { data: oContainerData })
                .then(function (oResponse) {
                    if (oResponse.status === 200) {
                        var oRemoteData = JSON.parse(oResponse.responseText);

                        oContainerData.validity = oRemoteData.validity;
                        oContainerData.items = oRemoteData.items;
                        oContainerData.created = oRemoteData.created;
                    } /* could also be 204 status */

                    oDeferred.resolve();
                })
                .catch(function (vReason) {
                    // TODO: should better be handled by caller
                    jQuery.sap.log.error(
                        "Failed to save personalization container; response: "
                            + ( typeof vReason === "object" ? JSON.stringify(vReason) : vReason ),
                        vReason.stack ? vReason.stack : null,
                        "sap.ushell.adapters.cdm.PersonalizationAdapter");
                    oDeferred.reject(vReason);
                });
        }).promise();
    }

    function load(oHttpClient, oContainerData, sUrl) {
        return new jQuery.Deferred(function (oDeferred) {
            oHttpClient.get(sUrl)
                .then(function (oResponse) {
                    var oRemoteData = JSON.parse(oResponse.responseText);

                    oContainerData.validity = oRemoteData.validity;
                    oContainerData.items = oRemoteData.items;
                    oContainerData.created = oRemoteData.created;

                    oDeferred.resolve();
                })
                .catch(function ( oResponse ) {
                    clearContainerData(oContainerData);
                    if (oResponse.status === 404) {
                        // not found is not an error, we just resolve with an
                        // empty container
                        oDeferred.resolve();
                    } else {
                        oDeferred.reject(oResponse);
                    }
                });
        }).promise();
    }

    function del(oHttpClient, sUrl) {
        return new jQuery.Deferred(function (oDeferred) {
            oHttpClient.delete(sUrl)
                .then(function () {
                    oDeferred.resolve();
                })
                .catch(function (vReason) {
                    oDeferred.reject(vReason);
                });
        }).promise();
    }

    function clearContainerData(oContainerData) {
        Object.keys(oContainerData).forEach(function(sKey) {
            if (sKey !== "__metadata") {
                // skip metadata
                delete oContainerData[sKey];
            }
        })
    }

    function addPrefixToItemKey(sKey) {
        if (sKey === "__metadata") {
            // skip metadata
            return undefined;
        } else if (sKey.indexOf(oInternalPersonalizationConstants.S_VARIANT_PREFIX) === 0
            || sKey.indexOf(oInternalPersonalizationConstants.S_ADMIN_PREFIX) === 0) {

            // preserve prefixes for variants and admin
            // TODO: consider moving these to separate sections as well
            return sKey;
        } else {
            // add prefix for normal items
            return oInternalPersonalizationConstants.S_ITEM_PREFIX + sKey;
        }
    }

    function stripPrefixFromItemKey(sKey) {
        if (sKey.indexOf(oInternalPersonalizationConstants.S_ITEM_PREFIX) === 0) {
            // strip prefix for normal items
            return sKey.substring(oInternalPersonalizationConstants.S_ITEM_PREFIX.length);
        } else if (sKey.indexOf(oInternalPersonalizationConstants.S_VARIANT_PREFIX) === 0
            || sKey.indexOf(oInternalPersonalizationConstants.S_ADMIN_PREFIX) === 0) {

            // preserve prefixes for variants and admin
            // TODO: consider moving these to separate sections as well
            return sKey;
        } else {
            throw new Error(
                ["Illegal item key for personalization container: '",
                sKey,
                "'; must be prefixed with one of the following: [",
                oInternalPersonalizationConstants.S_ITEM_PREFIX,
                ", ",
                oInternalPersonalizationConstants.S_VARIANT_PREFIX,
                ", ",
                oInternalPersonalizationConstants.S_ADMIN_PREFIX,
                "] "].join("")
            );
        }
    }

    function getItemKeys(oContainerData) {

        return Object.keys(oContainerData)
            .map( addPrefixToItemKey )
            .filter( function(sKey) { return !!sKey } );
    }

    function containsItem(oContainerData, sKey) {
        return oContainerData.hasOwnProperty(stripPrefixFromItemKey(sKey));
    }

    function setItemValue(oContainerData, sKey, vValue) {
        oContainerData[stripPrefixFromItemKey(sKey)] = vValue;
    }

    function getItemValue(oContainerData, sKey) {
        return oContainerData[stripPrefixFromItemKey(sKey)];
    }

    function delItem(oContainerData, sKey) {
        delete oContainerData[stripPrefixFromItemKey(sKey)];
    }
});