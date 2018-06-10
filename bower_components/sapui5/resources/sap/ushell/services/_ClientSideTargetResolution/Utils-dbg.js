// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview
 *
 * Exposes utility methods for ClientSideTargetResolution
 *
 * <p>This is a dependency of ClientSideTargetResolution.  Interfaces exposed
 * by this module may change at any time without notice.</p>
 *
 * @version 1.50.6
 */
sap.ui.define([
], function (oVirtualInbounds, oFormatter) {
    "use strict";

    /**
     *
     * Runs through the defaulted Parameter names, if any one is dominated by a
     * non-defaulted, remove it and it's value.
     *
     * @param {object} oIntentParamsPlusAllDefaults
     *    intent params with defaults map
     * @param {array} aDefaultedParamNames
     *    string array defaulted Parameter names
     * @param {object} oParameterDominatorMap
     *    see _constructParameterDominatorMap
     * @return {object}
     *   A tuple of all modified members of the input:
     *   <code>{
     *        intentParamsPlusAllDefaults : ...
     *        defaultedParamNames : ...
     *   };
     *   </code>
     */
    function removeSpuriousDefaultedValues (oIntentParamsPlusAllDefaults, aDefaultedParamNames, oParameterDominatorMap) {
        //
        // If multiple parameters map onto the same parameter with renameTo,
        // a value which was explicitly passed dominates all other values
        // we remove the spurious defaulted values.
        // TODO: also in ?? the complex newParamterValue?
        //
        var aOriginalList = aDefaultedParamNames.slice(0);
        aOriginalList.forEach(function(sParamName, iIndex) {
            var sPresentNonDefault;
            var bNonDefaultPresent = oParameterDominatorMap[sParamName].dominatedBy.some(function(sKey) {
                if (oIntentParamsPlusAllDefaults[sKey] && (sKey !== sParamName) && aDefaultedParamNames.indexOf(sKey) === -1) {
                    sPresentNonDefault = sKey;
                    return true;
                }
                return false;
            });
            if (bNonDefaultPresent && (sPresentNonDefault !== sParamName)) {
                aDefaultedParamNames.splice(iIndex, 1);
                delete oIntentParamsPlusAllDefaults[sParamName];
                // TODO: delete in list of required UserDefault Parameters references, so that it is
                // not required there
            }
        });
        return {
            intentParamsPlusAllDefaults: oIntentParamsPlusAllDefaults,
            defaultedParamNames: aDefaultedParamNames
        };
    }

    /**
     * Construct a map that allows to detect which parameters of a given
     * parameter set would be affected if a parameter renaming took place.
     *
     * <p>When a parameter is renamed to an already existing parameter name,
     * the existing parameter name is said to be "dominated" by the
     * parameter that was renamed.</p>
     *
     * @param {object} oParameters
     *    An object containing the input parameters to analyze.
     *
     * <pre>
     *    {
     *      "A" : {"renameTo" : "ANew" },
     *      "B" : {"renameTo" : "ANew" },
     *      "C" : {}
     *      "D" : { "renameTo" : "C"},
     *      "E" : { }
     *    }
     * </pre>
     *
     *
     * @return {object}
     *    The parameter dominator map. An object like:
     * <pre>
     *    { "A" : {  renameTo : "ANew", "dominatedBy" : ["A", "B" ] },
     *    { "B" : {  renameTo : "ANew", "dominatedBy" : ["A", "B" ] },
     *    { "C" : {  renameTo : "C", "dominatedBy" : ["C", "D" ] },
     *    { "D" : {  renameTo : "C", "dominatedBy" : ["C", "D" ] },
     *    { "E" : {  renameTo : "E", "dominatedBy" : ["E" ] }
     * </pre>
     */
    function constructParameterDominatorMap (oParameters) {
        var oDominatorMap = {},
            oRenameMap = {};

        Object.keys(oParameters).forEach(function(sKey) {
            var sRenameTo = oParameters[sKey].renameTo || sKey;
            oRenameMap[sRenameTo] = oRenameMap[sRenameTo] || {
                "renameTo": sRenameTo,
                "dominatedBy": []
            };
            oRenameMap[sRenameTo].dominatedBy.push(sKey);
            oRenameMap[sRenameTo].dominatedBy = oRenameMap[sRenameTo].dominatedBy.sort();
            oDominatorMap[sKey] = oRenameMap[sRenameTo];
        });
        return oDominatorMap;
    }

    /**
     * Deletes keys from an object based on a given filter function.
     *
     * @param {object} oObject
     *    The object to be filtered (modified in place)
     * @param {object} fnFilterFunction
     *    The filter function to decide which keys to delete
     * @param {boolean} bInPlace
     *    Modifies the the given object in place
     *
     * @returns {object}
     *    The filtered object
     *
     * @private
     */
    function filterObjectKeys (oObject, fnFilterFunction, bInPlace) {
        var oObjectToFilter = bInPlace ? oObject : jQuery.extend(true, {}, oObject);

        Object.keys(oObjectToFilter).forEach(function(sKey) {
            if (fnFilterFunction(sKey) === false) {
                delete oObjectToFilter[sKey];
            }
        });

        return oObjectToFilter;
    }

    /*
     * A helper that calls the given function only when
     * jQuery.sap.log.level.DEBUG level or greater is set.
     */
    function whenDebugEnabled(fn) {
        if (isDebugEnabled()) {
            fn.call(null);
        }
    }

    /*
     * Returns whether a level greater or equal than jQuery.sap.log.Level.DEBUG
     * is set.
     */
    function isDebugEnabled() {
        var iCurrentLogLevel = jQuery.sap.log.getLevel();
        if (iCurrentLogLevel >= jQuery.sap.log.Level.DEBUG) {
            return true;
        }
        return false;
    }



    return {
        filterObjectKeys: filterObjectKeys,
        constructParameterDominatorMap: constructParameterDominatorMap,
        removeSpuriousDefaultedValues: removeSpuriousDefaultedValues,
        whenDebugEnabled: whenDebugEnabled,
        isDebugEnabled: isDebugEnabled
    };
});
