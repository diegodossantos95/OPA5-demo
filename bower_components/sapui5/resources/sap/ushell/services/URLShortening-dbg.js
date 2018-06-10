// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview URLShortening
 *
 * This service if for internal Shell usage only
 * It has services to compact and expand Long shell hashes
 *
 * @version 1.50.6
 */


/*global jQuery, sap, sessionStorage */
/*jslint nomen: true*/

sap.ui.define([
], function () {
    "use strict";
    /*global jQuery, sap, location*/

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("CrossApplicationNavigation")</code>.
     * Constructs a new instance of the CrossApplicationNavigation service.
     *
     * A service to compact URL with application parameters exceeding a certain limit
     *        when passing them via the browser hash
     *
     *  The browser hash is limited in length on certain platforms.
     *
     *  The technical means to resolve URLs in the unified shell do not involve browser
     *  has values, as actual parameters are:
     *  a) Passed and returned by the NavTargetResolution service as an OData request/response value
     *  b) subsequently passed to the Application as URL
     *
     * The length of these parameters shall not be restricted by "artificial" and platform dependent
     * browser URL length.
     *
     * The URL Shortener Service allows to shorten a given navigation target URL, replacing
     * extended parameters by a token.
     *
     * The full URL is persisted in the oStoreContext provided functionality
     *
     * This interface is only for usage by shell-internal services
     *
     * Technically this service only compacts Application Parameters of a shell hash,
     * these are split into a retained part (roughly URL_PARAMS_LENGTH_LIMIT long)
     * and an extended part
     *
     * On expansion, parameters from sap-intent-param are *appended* to parameters already
     * present.
     * Note that if the same parameter name appears multiple times in the URL, only some values
     * may be compressed, always trailing parameter values are compressed.
     * Thus the ordering of parameter values for the same parameter name in the original URL is always maintained.
     *
     * Example :  P1 : [1,2,3] => P1=1&P1=2&P1=3  =>  P1=1&sap-intent-param=AF    + AF -> P1=2&P1=3
     * Expand: P1=1&sap-intent-param=AF    + AF -> P1=2&P1=3   => P1 : [1,2,3]
     * or  P1=1111&P1=1&P1=3333&sap-intent-param=AF&P1=4444    + AF -> P1=2&P1=3  => P1 : [1111,1,3333,4444,2,3]
     *
     * Parameters are per default ordered in alphabetic order, then compressed
     *
     * Example:
     *
     * Usage:
     * <code>
     *   var oUrlShortening = sap.ushell.Container.getService("URLShortening");<br/>
     * </code>
     *
     *
     * @constructor
     * @class
     * @see sap.ushell.services.Container#getService
     * @since 1.20.0
     * @private
     */
    function URLShortening () {
        var that = this;
        this.ABBREV_PARAM_NAME = "sap-intent-param";
        this.URL_LENGTH_LIMIT = 1023;
        this.URL_PARAMS_LENGTH_LIMIT = 512;

        /**
         * Clients, notably WebDynpro may invoke navigation by passing the Application state *value*, not key
         * as sap-xapp-state *value*.
         * in these cases the unified shell will *store* this value and replace it by the key.
         * Note that there is no corresponding symmetric transparent *expansion* mechanism
         * @param {object} value
         * the value of an sap-xapp-state parameter,
         * in typical use cases already a key, in rare occasions a JSON.serialized string;
         * other cases should not occur
         * @param {object} oStoreContext
         *    An object with defined methods to getNextKey and store() to save a value
         *    Note that the JSON.parse'ed value of value is stored (!)
         * @returns {string}
         *  a generated key iff value is a JSON parseable object,
         *  otherwise the original (unchanged) value
         *
         * @private
         */
        this._replaceSapXAppStateRawWithKeyIfRequired = function(value, oStoreContext) {
                var oValue,
                    sKey;
            if (typeof value !== "string" || /^[A-Z0-9]{40}$/.test(value)) {
                // ok (string key) or something unintelligible
                return value;
            }
            try {
                oValue = JSON.parse(value);
            } catch(ex) {
                jQuery.sap.log.error("This cannot happen: sap-xapp-state parameter value is neither key nor JSON parseable");
                return value;
            }
            sKey = oStoreContext && oStoreContext.getNextKey();
            this._storeValue(sKey, oValue, oStoreContext);
            return sKey;
        };

        /**
        * given a URL which is a shell hash,
        * 1) if the URL contains a parameter sap-xapp-state which is
        *   a) not matching an application state key
        *   b) JSON-parseable
        *   it is assumed it represents raw data which has to be compacted
        *   (e.g. from the WDA interface).
        *   In this case *now* we generate a new Key, store the value via the StoreContext
        *
        * 2) attempt to reduce hash length by replacing
        * parts of the parameter list with sap-intent-param=KEY
        * KEY is a generated key (generated by the Personalization Service key)
        * where KEY is a generated key.
        *
        * Note. If the URL already contains a parameter sap-intent-param, no compaction (2) is performed!
        *
        * The Parameters are stored under KEY using a backend persistence.
        *
        * The inverse operation expandHash replaces a sap-intent-param=KEY
        * value.
        *
        * @param {string} sUrl
        *     A shell hash parameter string
        * @param {Array} aRetainParameterList
        *    an array listing parameter names (in order) which should be preferably
        *    not compacted (=retained in the parameter list),
        *    note that this is only a hint, some system parameters may be retained before this list is respected!
        * @param {object} oStoreContext
        *    an object <code>{ getNextKey : function(); store: function(sValue) }</code>
        * @returns {object}
        *  An object
        *     <code>{ hash : <string> }</code>
        *  An inner shell hash containing the compacted hash
        *  a present truthy member skippedParams indicates URL compaction occurred
        *  Note that no URL compaction occurs if a sap-intent-param is already present!
        *
        *
        * @since 1.20.0
        * @private
         */
        this.compactHash = function (sUrl, aRetainParameterList, oStoreContext) {
            var oSegments,
                sKey,
                oResult,
                prependHash,
                oUrlParsing,
                sResString,
                aRectifiedRetainParameterList = [this.ABBREV_PARAM_NAME, "sap-system", "sap-xapp-state"];
            if (aRetainParameterList) {
                aRetainParameterList.forEach(function (sArg) {
                    aRectifiedRetainParameterList.push(sArg);
                });
            }
            // decompose the URL
            oUrlParsing = sap.ushell.Container.getService("URLParsing");
            oSegments = oUrlParsing.parseShellHash(sUrl);
            if (!oSegments) {
                jQuery.sap.log.error(
                    "the URL " + sUrl + ' is not compliant. It may break the product and cause unwanted navigation behavior.'
                );
                return { hash : sUrl };
            }
            // extract a hash iff present
            prependHash = '';
            if (sUrl.charAt(0) === '#') {
               prependHash = '#';
            }
            var value = oSegments && oSegments.params && oSegments.params["sap-xapp-state"] && oSegments.params["sap-xapp-state"][0];
            if (value) {
                oSegments.params["sap-xapp-state"] = [ this._replaceSapXAppStateRawWithKeyIfRequired(value, oStoreContext) ];
                // reconstruct URL with modified sap-xapp-state
                sUrl = prependHash + oUrlParsing.constructShellHash({
                    target : {
                        semanticObject: oSegments.semanticObject,
                        action : oSegments.action,
                        contextRaw : oSegments.contextRaw
                    },
                    params : oSegments.params,
                    appSpecificRoute : oSegments.appSpecificRoute
                });
            }
            if (typeof sUrl !== "string" || sUrl.length < that.URL_LENGTH_LIMIT) {
                return { hash : sUrl }; // no shortening
            }
            // already has a parameter name
            // or is the prepared *calling* URL in a open NWBC scenario, where the
            // URL is effectively duplicated when put into the URL, as the resolved URL is added
            // It is up to the Shell to assure it can deal with truncated/shortened URLs here.
            if (oSegments && ((oSegments.params && oSegments.params[that.ABBREV_PARAM_NAME]))) {
                return { hash : sUrl };
            }
            // attempt to compact it if required
            sKey = oStoreContext && oStoreContext.getNextKey();
            oResult = this._splitParameters(oSegments.params, aRectifiedRetainParameterList, sKey);
            if (!oResult.key) {
                // no shortening required or parameter can not be shortened
                return { hash : sUrl };
            }
            sResString = oUrlParsing.paramsToString(oResult.tailParams);
            this._storeValue(oResult.key, sResString, oStoreContext);
            return {
                hash : prependHash + oUrlParsing.constructShellHash({
                    target : {
                        semanticObject: oSegments.semanticObject,
                        action : oSegments.action,
                        contextRaw : oSegments.contextRaw
                    },
                    params : oResult.headParams,
                    appSpecificRoute : oSegments.appSpecificRoute
                }),
                params : oResult.headParams,
                skippedParams : oResult.tailParams
            };
        };

        /**
         * do a simple test on length of the hash
         * issue a warning if it exceeds arbitrary limits.
         *
         * This function can be replaced by compactHash if a
         * transparent URL shortening is desired.
         *
         * currently it truncates the startup parameters if they exceed URL_PARAMS_LENGTH_LIMIT characters
         * @returns {object}
         * it returns an tuple { sHash : sUrl,
         *                       oParams : parameters encoded in URL shell hash
         *                       oSkippedParams : params not encoded in URL shell hash, undefined if no truncation occurred
         *                     }
         *
         * @param {object} sURL
         *   an object representing a parsed semanticobject
         * @since 1.20.0
         * @deprecated
         * @private
          */
        this.checkHashLength = function (sURL) {
            var oSegments,
                oResult,
                prependHash,
                oUrlParsing;
            if (typeof sURL !== "string" || sURL.length < that.URL_LENGTH_LIMIT) {
                return { hash : sURL }; // no shortening
            }
            // decompose the URL
            oUrlParsing = sap.ushell.Container.getService("URLParsing");
            oSegments = oUrlParsing.parseShellHash(sURL);
             //
            prependHash = '';
            if (sURL.charAt(0) === '#') {
                prependHash = '#';
            }
            //
            oResult = this._splitParameters(oSegments.params, [], "DummyKey");
            if (oResult.key) {
                // shell parameter length may not exceed 512
                jQuery.sap.log.error("Application startup parameter length exceeds " + that.URL_PARAMS_LENGTH_LIMIT + " characters, truncation occured!");
                delete oResult.headParams[this.ABBREV_PARAM_NAME];
                // parameter can not be shortened
                return {
                    hash : prependHash + oUrlParsing.constructShellHash({
                        target : {
                            semanticObject: oSegments.semanticObject,
                            action : oSegments.action,
                            contextRaw : oSegments.contextRaw
                        },
                        params : oResult.headParams,
                        appSpecificRoute : oSegments.appSpecificRoute
                    }),
                    params : oResult.headParams,
                    skippedParams : oResult.tailParams
                };
            }
            // decision -> do not support shortening,
            // also do not limit URL length. Thus we allow platform dependent behaviour, good luck
            jQuery.sap.log.error("URL exceeds dangerous limits, arbitrary shortening or worse may occur!");
            return { hash : sURL};
        };

        /**
         * Determine the index of <code>sTest</code> in the Array <code>aArray</code>
         * The searching uses a common prefix match if the last character
         * of a string in the Array is "*"
         * Note that an exact match has higher precedence than a prefix-match.
         *<pre>
         * example _findIndex(["A","B"],"A") returns 0
         * example _findIndex(["A","B"],"B") returns 1
         * example _findIndex(["A","B"],"C") returns -1
         * example _findIndex(["A","B-*", "B-A"],"B-C") returns 1
         * example _findIndex(["A","B-*", "B-A"],"B-A") returns 2
         * (an exact match is searched for first, has higher precedence than a prefix match)
         * example _findIndex(["A","B*C", "B-A"],"B-C") returns -1
         *</pre>
         * @param {Array} aArray
         * an array of string containing the strings to match
         * @param {string} sTest
         *   the string to test for
         * @returns {integer} the index of a matching entry, or -1 if not found
         * @since 1.32.0
         * @private
         */
        this._findIndex = function(aArray, sTest) {
            var r = aArray.indexOf(sTest);
            if (r >= 0) {
                return r; // exact match
            }
            // poor mans findIndex
            r = -1;
            aArray.every(function(sArr,iIndex) {
                if (sArr.length > 0 && sArr[sArr.length - 1] === "*" &&
                        sArr.substring(0,sArr.length - 1) === sTest.substring(0, sArr.length - 1)) {
                    r = iIndex;
                    return false;
                }
                return true;
            });
            return r;
        };

        this._cmpByList = function (aArray, oA, oB) {
            var i1,
                i2;
            aArray = aArray || [];
            if (oA === oB) {
                return 0;
            }
            i1 = this._findIndex(aArray,oA);
            i2 = this._findIndex(aArray,oB);
            if (i1 >= 0 && i2 >= 0) {
                if ((i1 - i2) !== 0) {
                    return i1 - i2;
                }
                if (oA < oB) {
                    return -1;
                }
                if (oA > oB) {
                    return +1;
                }
                return 0; // should not get here
            }
            if (i1 >= 0) {
                return -1;
            }
            if (i2 >= 0) {
                return +1;
            }
            if (oA < oB) {
                return -1;
            }
            return +1;
        };

        this._sortByPriority = function (aList, aRetainParameterList) {
            return aList.sort(this._cmpByList.bind(this, aRetainParameterList));
        };


        /**
         * split a parameters object,
         * return a triple key, headParams, tailParams if split,
         * otherwise key is undefined
         * @param {object} oParams
         *  Parameter collection
         * @param {array<string>} aRetainParameterList
         *   A list of parameters to retain in the parameter list
         *   (parameters listed here will be retained in order of priority if possible).
         * @param {function} sKey
         *  A function used to generate the key
         * @returns {object}
         *   a triple { key, headParams, tailParams } if split,
         *   otherwise key is undefined, tailParams is an empty object
         * @private
         */
        this._splitParameters = function (oParams, aRetainParameterList, sKey) {
            var a,
                i,
                k,
                headParams = {},
                tailParams = {},
                hasTail = false,
                obj,
                item,
                cLength = 0,
                delta,
                lst = [];
            if (!sKey || typeof sKey !== "string") {
                throw new Error("sap.ushell.services.URLShortening._splitParameters: key must be supplied!");
            }
            // sort parameter names first, then truncate in deterministic order
            for (a in oParams) {
                if (Object.prototype.hasOwnProperty.call(oParams, a)) {
                    lst.push(a);
                }
            }
            lst.sort();
            lst = this._sortByPriority(lst, aRetainParameterList);
            //
            for (k = 0; k < lst.length; k = k + 1) {
                a = lst[k];
                obj = oParams[a];
                if (obj.length > 1) {
                    jQuery.sap.log.error("Array startup parameters violate the designed intent of the Unified Shell Intent, use only single-valued parameters!");
                }
                for (i = 0; i < obj.length; i = i + 1) {
                    item = oParams[a][i];
                    delta = a.length + item.length;
                    if (delta + cLength > this.URL_PARAMS_LENGTH_LIMIT) {
                        if (tailParams[a]) {
                            tailParams[a].push(item);
                        } else {
                            tailParams[a] = [item];
                        }
                        hasTail = true;
                    } else if (headParams[a]) {
                        headParams[a].push(item);
                    } else {
                        headParams[a] = [item];
                    }
                    cLength = cLength + delta + 1;
                }
            }
            if (hasTail) {
                headParams[this.ABBREV_PARAM_NAME] = [ sKey ];
            }
            return { key : sKey,
                     tailParams: tailParams,
                     headParams: headParams
                   };
        };

        /**
        *
        * expand a given URL if the tag is present in the parameters list,
        * using data from a local storage only!
        *
        * @param {string} oUrl
        *   a URL as a string
        * @returns {string}
        *   returns an expanded Hash (sap-intent-param) removed and expanded content
        *   iff the retrieve function is able to resolve the value *synchronously*
        *   inserted instead if present in local storage.
        *   note that the parameters are reordered in alphabetic order
        * @public
        * @alias sap.ushell.services.URLShortening#expandHash
        */
        this.expandHash = function (oUrl) {
            var fRetrieveValue = function (sKey) {
                return that._retrieveValue(sKey);
            };
            return this.expandParamGivenRetrievalFunction(oUrl, this.ABBREV_PARAM_NAME, fRetrieveValue);
        };
        /**
        * expand a given shell hash URL
        * if the parameter sParamName is present in the parameters list
        * a string sKey will be extracted from the (first) parameter present,
        * the method fRetrievalValue(sKey) will be invoked to resolve sKey to a string value,
        * this string value is expected to be an Query string ( paramname=paramvalue&amp;... )
        * the parameters from this string are blended into the parameters from sUrl
        * parameters with sParamName are removed
        *
        * parameters extracted via the retrieval function are *appended* to parameters
        * already present
        *
        * @param {string} sUrl
        *    a URL
        * @param {string} sParamName
        *    the Parameter name to extract the key value from
        *    all parameter values will be stripped from the URL if expanded
        * @param {function(string)} fRetrieveValue
        *    the function to invoke to map a key to a value
        *    the value must be a parseable parameter query string, e.g. AA=1234&B=1234
        *    (parameters and value encodeURIComponent encoded)
        *    if it returns undefined, the unmodified sUrl (including sParamName=sKey ) is
        *    returned
        * @returns {string}
        *  the expanded sUrl, or the original one if expansion did not happen
        * @since 1.28.0
        * @public
        * @alias sap.ushell.services.URLShortening#expandParamGivenRetrievalFunction
        */
        this.expandParamGivenRetrievalFunction = function (sUrl, sParamName, fRetrieveValue) {
            var segments,
                val,
                sKey,
                prependHash,
                paramsExpanded;
            if (typeof sUrl !== "string") {
                return sUrl; // no shortening
            }
            // decompose the URL
            segments = sap.ushell.Container.getService("URLParsing").parseShellHash(sUrl);
            // non parseable or does it have a special parameter name?
            sKey = segments && segments.params && segments.params[sParamName] && segments.params[sParamName][0];
            if (!sKey) {
                return sUrl;
            }
            prependHash = '';
            if (sUrl.charAt(0) === '#') {
                prependHash = '#';
            }
            // can we retrieve a value for it?
            val = fRetrieveValue(sKey);
            if (!val) {
                return sUrl;
            }
            paramsExpanded = this._blendParameters(segments.params, sParamName, val);

            return prependHash + sap.ushell.Container.getService("URLParsing").constructShellHash(
                {
                    target : {
                        semanticObject : segments.semanticObject,
                        action : segments.action,
                        contextRaw : segments.contextRaw
                    },
                    params : paramsExpanded,
                    appSpecificRoute : segments.appSpecificRoute
                }
            );
        };

        this._retrieveValue = function (sKey) {
            return undefined; // jQuery.sap.storage(jQuery.sap.storage.Type.session).get(sKey);
        };

        this._storeValue = function (sKey, sValue, oStoreContext) {
            if (oStoreContext && typeof oStoreContext.store === "function") {
                oStoreContext.store(sValue);
            }
            //jQuery.sap.storage(jQuery.sap.storage.Type.session).put(sKey, sValue);
        };


        this._blendParameters = function (oParams, sParamName, sValue) {
            var newParams = sap.ushell.Container.getService("URLParsing").parseParameters("?" + sValue),
                a;
            delete oParams[sParamName];
            for (a in newParams) {
                if (Object.prototype.hasOwnProperty.call(newParams, a)) {
                    if (oParams[a]) {
                        oParams[a] = oParams[a].concat(newParams[a]);
                    } else {
                        oParams[a] = newParams[a];
                    }
                }
            }
            return oParams;
        };


    }; // URLShortening

    URLShortening.hasNoAdapter = true;
    return URLShortening;

}, true /* bExport */);
