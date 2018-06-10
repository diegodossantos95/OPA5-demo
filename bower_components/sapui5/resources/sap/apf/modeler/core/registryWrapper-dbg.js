/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/

jQuery.sap.declare("sap.apf.modeler.core.registryWrapper");

(function () {
    'use strict';

    /**
     * @private
     * @memberOf sap.apf.modeler.core
     * @name sap.apf.modeler.core.RegistryWrapper
     * @class Defines a wrapper around the registry received by injection from the ConfigurationFactory.
     *  This class defines access methods to first class citizen configuration objects after loading them from file or service.
     * @param {sap.apf.core.utils.Hashtable} hashtable - Registry that will be wrapped.
     * @constructor
     */
    sap.apf.modeler.core.RegistryWrapper = function (hashtable) {

        /**
         * @private
         * @function
         * @name getItemsByType
         * @description Retrieve all configuration objects (after loading) from a registry.
         * @param {String} type - value domain: "step", "request", "binding", "category", "facetFilter", "representationType"
         * @returns {Object[]}
         */
        function getItemsByType(type) {
            var aResults = [];
            hashtable.each(function (index, element) {
                if (element.type === type) {
                    aResults.push(element);
                }
            });
            return aResults;
        }
        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.RegistryWrapper#getItem
         * @description Retrieve any item by its key (after loading) from a registry.
         * @returns {Object}
         */
        this.getItem = function(key) {
            return hashtable.getItem(key);
        };

        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.RegistryWrapper#getSteps
         * @description Retrieve all steps (after loading) from a registry.
         * @returns {Object[]}
         */
		this.getSteps = function() {
			var aItems = getItemsByType("step");
			aItems = jQuery.merge(aItems, getItemsByType("hierarchicalStep"));
			return aItems;
		};

        /**
         * Retrieve all categories (after loading) from a registry.
         * @private
         * @function
         * @name sap.apf.modeler.core.RegistryWrapper#getCategories
         * @returns {Object[]}
         */
        this.getCategories = function() {
            return getItemsByType("category");
        };
        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.RegistryWrapper#getFacetFilters
         * @description Retrieve all facet filters from a registry.
         * @returns {Object[]}
         */
        this.getFacetFilters = function() {
            if(hashtable.getItem(sap.apf.core.constants.existsEmptyFacetFilterArray) === true) {
                return {emptyArray : true};
            }
            return getItemsByType("facetFilter");
        };
        /**
         * @private
         * @function
         * @name sap.apf.modeler.core.RegistryWrapper#getNavigationTargets
         * @description Retrieve all facet filters from a registry.
         * @returns {Object[]}
         */
        this.getNavigationTargets = function() {
            return getItemsByType("navigationTarget");
        };

    };
}());
