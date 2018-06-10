// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/* global Promise sap */

/**
 * @fileOverview A small HTTP client based on `XmlHttpRequest`
 *
 * Supports CSRF protection handling
 * 
 * @version 1.50.6
 * @private
 */
sap.ui.define([], function () {
    "use strict";

    // cache the CSRF token; TODO: rather cache it only per instance / server
    var sCsrfToken;

    function HttpClient() {
        return Object.create(null, {
            post: { value: request.bind(null, "POST") },
            get: { value: request.bind(null, "GET") },
            put: { value: request.bind(null, "PUT") },
            delete: { value: request.bind(null, "DELETE") },
            options: { value: request.bind(null, "OPTIONS") }
        });

        function fetchCsrfToken(sUrl) {
            return request("OPTIONS", sUrl, { headers: { "x-csrf-token": "fetch" } })
                .then(function (oResponse) {
                    var sNewToken = oResponse.getResponseHeader("x-csrf-token");
                    updateCachedCsrfToken(sNewToken);
                    return sNewToken;
                });
        }

        function getCsrfHeaderValueForRequest(sRequestMethod, sUrl, oHeaders) {
            // if the header is alrady set, we resolve with undefined
            if (oHeaders && oHeaders["x-csrf-token"] !== undefined) {
                return new Promise(function (resolve, reject) {
                    resolve(undefined);
                });
            }

            switch (sRequestMethod) {
                case "HEAD":
                case "GET":
                case "OPTIONS":
                    // always fetch a new token for safe methods
                    return new Promise(function (resolve, reject) {
                        resolve("fetch");
                    });
                case "POST":
                case "PUT":
                case "DELETE":
                    if (sCsrfToken) {
                        // return cached token
                        return new Promise(function (resolve, reject) {
                            resolve(sCsrfToken);
                        });
                    } else {
                        // fetch a new token from server
                        return fetchCsrfToken(sUrl);
                    }
                default:
                    throw new Error("Unsupported request method: " + sRequestMethod);
            }
        }

        function updateCachedCsrfToken(sNewToken) {
            sCsrfToken = sNewToken;
        }

        function createResponse(oXHR) {
            // TODO: JSON.stringify for created object is empty
            return Object.create(null, {
                status: { value: oXHR.status },
                statusText: { value: oXHR.statusText },
                responseText: { value: oXHR.responseText },
                responseHeaders: { value: oXHR.getAllResponseHeaders() },
                getResponseHeader: { value: oXHR.getResponseHeader.bind(oXHR) }
            });
        }

        function request(sRequestMethod, sUrl, oConfig) {
            var aHeaders,
                oRequestData,
                oXHR = new XMLHttpRequest();

            oConfig = oConfig || {};

            aHeaders = !oConfig.headers
                ? []
                : Object
                    .keys(oConfig.headers)
                    .map(function (sHeader) {
                        return {
                            name: sHeader,
                            value: this[sHeader]
                        };
                    }, oConfig.headers);

            oRequestData = oConfig.data;

            return new Promise(function (resolve, reject) {

                getCsrfHeaderValueForRequest(sRequestMethod, sUrl, oConfig.headers).then(function (sCsrfHeaderValue) {
                    oXHR.open(sRequestMethod, sUrl);

                    aHeaders.forEach(function (oHeader) {
                        oXHR.setRequestHeader(oHeader.name, oHeader.value);
                    });

                    if (sCsrfHeaderValue) {
                        oXHR.setRequestHeader("x-csrf-token", sCsrfHeaderValue);
                    }

                    oXHR.addEventListener("load", function handleLoadedRequest() {
                        var oResponse = createResponse(oXHR);
                        // TODO: store CSRF token if present in response
                        // TODO: handle 403 error for x-csrf-token: required response header
                        // TODO: don't return reference to XHR, but create a plain JS object
                        return oXHR.status < 200 || oXHR.status > 299
                            ? reject(oResponse)
                            : resolve(oResponse);
                    });

                    oXHR.send(oRequestData ? JSON.stringify(oRequestData) : undefined);

                }).catch(function (vError) {
                    // TODO: check error logging
                    jQuery.sap.log.error(vError, null, "sap.ushell.util.HttpClient");
                    reject(vError);
                })
            });
        }
    }

    return new HttpClient();
}, /* bExport = */ true);