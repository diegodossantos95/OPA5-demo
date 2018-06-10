// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview
 *
 * <p>Offers an extension point for FLP content providers.</p>
 *
 * @version 1.50.6
 */
sap.ui.define([
], function () {

    /*global jQuery, sap */
    "use strict";

    var S_COMPONENT_NAME = "sap.ushell.services.ContentExtension";

    /**
     * @param {object} oAdapter
     *   Not in use
     * @param {object} oContainerInterface
     *   Not in use
     * @param {string} sParameters
     *   Not in use
     * @param {object} oServiceConfiguration
     *   Not in use
     *
     * @constructor
     * @class
     * @see {@link sap.ushell.services.Container#getService}
     * @since 1.50.0
     */
    function ContentExtension(oAdapter, oContainerInterface, sParameters, oServiceConfiguration) {
        // For the future: Call init method in case of
        // initializations. Allows better testing of
        // initial conditions.
        //
        // this._init.apply(this, arguments);
    }

    ContentExtension.Type = {
        SITE: "site"
    };

    /**
     * Registers a new FLP content provider.
     * <p>
     * It logs an error if incorrect parameters are passed.
     * </p>
     *
     * @param {object} oParams
     *   An object like:
     * <pre>
     * {
     *   id: "some id",
     *   type: ContentExtension.Type.SITE,
     *   provider: {
     *      // ... based on type ...
     *   }
     * }
     * </pre>
     *
     * @private
     */
    ContentExtension.prototype.registerContentProvider = function (oParams) {
        var oCdmService;

        function logError(sError) {
            jQuery.sap.log.error(
                "An error occurred when calling #registerContentProvider",
                sError,
                S_COMPONENT_NAME
            )
        }
        if (oParams === null || typeof oParams !== "object" || Object.keys(oParams).length === 0) {
            logError("parameters must be provided and must be a non-empty object");
            return;
        }
        if (typeof oParams.id !== "string" || oParams.id.length === 0) {
            logError("id parameter should be a non-empty string");
            return;
        }
        if (typeof oParams.provider !== "object" || oParams.provider === null) {
            logError("provider member must be of type 'object' and not null");
            return;
        }

        if (oParams.type === ContentExtension.Type.SITE) {

            if (typeof oParams.provider.getSite !== "function") {
                logError("Provider must expose a getSite member of type 'function', got '" + (typeof oParams.provider.getSite) + "' instead");
                return;
            }

            // The getService tries to instantiate the adapter, which may not
            // be available on all platforms.
            try {
                oCdmService = sap.ushell.Container.getService("CommonDataModel");
            } catch (oError) {
                logError(oError + "");
            }

            if (oCdmService) {
                oCdmService.registerContentProvider(oParams.id, oParams.provider);
            }
            return;
        }

        logError("Unknown type parameter. It should be one should be one of ["
            + Object.keys(ContentExtension.Type).map(function (sType) {
                return "ContentExtension." + sType;
            }).join(", ")
            + "] but '"
            + oParams.type + "' was provided"
        );
    };

    ContentExtension.hasNoAdapter = true;

    return ContentExtension;

}, true /* bExport */ );
