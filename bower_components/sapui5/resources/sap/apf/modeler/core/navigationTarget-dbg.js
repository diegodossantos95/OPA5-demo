/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2015 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare("sap.apf.modeler.core.navigationTarget");
(function() {
	'use strict';
	/**
	 * @private
	 * @name sap.apf.modeler.core.navigationTarget
	 * @class A navigation target proxy object providing editor methods on configuration objects.
	 * @param {string} [navigationTargetId] - Optional parameter - Id of the instance
	 * @param {Object} inject.constructor - Injected constructors
	 * @param {Object} [dataFromCopy] - Optional parameter to set the internal state of the new instance during a copy operation 
	 * @constructor
	 */
	sap.apf.modeler.core.NavigationTarget = function(navigationTargetId, inject, dataFromCopy) {
		var semObject, actn, isStepSpecific = false, requestForFilterMapping, targetPropertiesForFilterMapping, titleKey;
		var parameters = [];
		if (dataFromCopy) {
			semObject = dataFromCopy.semObject;
			actn = dataFromCopy.actn;
			isStepSpecific = dataFromCopy.isStepSpecific;
			requestForFilterMapping = dataFromCopy.requestForFilterMapping;
			targetPropertiesForFilterMapping = dataFromCopy.targetPropertiesForFilterMapping;
			parameters = dataFromCopy.parameters;
			titleKey = dataFromCopy.titleKey;
		} else {
			requestForFilterMapping = {};
			targetPropertiesForFilterMapping = new inject.constructors.ElementContainer("TargetPropertyForFilterMapping", undefined, inject);
		}
		/**
		* @private
		* @name sap.apf.modeler.core.NavigationTarget#getId
		* @function
		* @description The immutable id of the navigation target
		* @returns {String} id
		*/
		this.getId = function() {
			return navigationTargetId;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.NavigationTarget#setSemanticObject
		 * @function
		 * @description Set the semantic object of the navigation target
		 * @param {string} semanticObject
		 */
		this.setSemanticObject = function(semanticObject) {
			semObject = semanticObject;
		};
		/**
		* @private
		* @name sap.apf.modeler.core.NavigationTarget#getSemanticObject
		* @function
		* @description Get the semantic object of the navigation target
		* @returns {String} semantic object 
		*/
		this.getSemanticObject = function() {
			return semObject;
		};
		/**
		* @private
		* @name sap.apf.modeler.core.NavigationTarget#setAction
		* @function
		* @description Set the action of the navigation target
		* @param {string} action
		*/
		this.setAction = function(action) {
			actn = action;
		};
		/**
		* @private
		* @name sap.apf.modeler.core.NavigationTarget#getAction
		* @function
		* @description Get the action of the navigation target
		* @returns {String} action 
		*/
		this.getAction = function() {
			return actn;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.NavigationTarget#isGlobal
		 * @function
		 * @description Returns true if the navigation target is a global one, otherwise false
		 * @returns {boolean} 
		 */
		this.isGlobal = function() {
			return !isStepSpecific;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.NavigationTarget#isStepSpecific
		 * @function
		 * @description Returns true if the navigation target is a step specific one, otherwise false
		 * @returns {boolean} 
		 */
		this.isStepSpecific = function() {
			return isStepSpecific;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.NavigationTarget#setGlobal
		 * @function
		 * @description Make the navigation target global
		 */
		this.setGlobal = function() {
			isStepSpecific = false;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.NavigationTarget#setStepSpecific
		 * @function
		 * @description Make the navigation target global
		 */
		this.setStepSpecific = function() {
			isStepSpecific = true;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#setFilterMappingService
		 * @function
		 * @description Sets the service root for filter mapping. 
		 * @param {string} serviceRoot - service root for filter mapping
		 */
		this.setFilterMappingService = function(serviceRoot) {
			requestForFilterMapping.service = serviceRoot;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#getFilterMappingService
		 * @function
		 * @description Returns the service root for filter mapping. 
		 * @returns {string} - Service root for filter mapping
		 */
		this.getFilterMappingService = function() {
			return requestForFilterMapping.service;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#setFilterMappingEntitySet
		 * @function
		 * @description Sets the entity set for filter mapping. 
		 * @param {string} entitySet - Entity set for filter mapping
		 */
		this.setFilterMappingEntitySet = function(entitySet) {
			requestForFilterMapping.entitySet = entitySet;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#getFilterMappingEntitySet
		 * @function
		 * @description Returns the entity set for filter mapping. 
		 * @returns {string} - Entity set for filter mapping
		 */
		this.getFilterMappingEntitySet = function() {
			return requestForFilterMapping.entitySet;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#addFilterMappingTargetProperty
		 * @function
		 * @description Adds a target property for filter mapping.
		 * @param {string} property - Property name
		 */
		this.addFilterMappingTargetProperty = function(property) {
			targetPropertiesForFilterMapping.createElementWithProposedId(undefined, property);
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#getFilterMappingTargetProperties
		 * @function
		 * @description Returns an array of target properties for filter mapping.
		 * @returns {String[]}
		 */
		this.getFilterMappingTargetProperties = function() {
			var propertylist = [];
			var propertyElementList = targetPropertiesForFilterMapping.getElements();
			propertyElementList.forEach(function(item) {
				propertylist.push(item.getId());
			});
			return propertylist;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#removeFilterMappingTargetProperty
		 * @function
		 * @description Removes a filter mapping target property
		 * @param {string} property - Property name
		 */
		this.removeFilterMappingTargetProperty = function(property) {
			targetPropertiesForFilterMapping.removeElement(property);
		};
		
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#getNavigationParameter
		 * @function
		 * @description Get a navigation parameter
		 * @param {string} key - key for navigation parameter
		 * @returns {undefined | Object} - returns undefined for not existing key otherwise Object with key and value 
		 */
		this.getNavigationParameter = function(key) {
			var result;
			parameters.forEach(function(parameter){
				if(parameter.key === key) {
					result = parameter;
				}
			});
			return result;
		};
		
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#getAllNavigationParameters
		 * @function
		 * @description Get all navigation parameters
		 * @returns {Object[]} - returns an array of Objects with key and value 
		 */
		this.getAllNavigationParameters = function() {
			return parameters;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#addNavigationParameter
		 * @function
		 * @description Add a navigation parameter
		 * @param {string} key - key for navigation parameter
		 * @param {string} value - value for navigation parameter
		 * @param {number} index - (optional) index where the parameter shall be entered
		 */
		this.addNavigationParameter = function(key, value, index) {
			if(index === undefined || index > parameters.length){
				index = parameters.length;
			}
			parameters.splice(index, 0, {
				key: key,
				value: value
			});
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#removeNavigationParameter
		 * @function
		 * @description Remove a navigation parameter
		 * @param {string} key - key for navigation parameter
		 */
		this.removeNavigationParameter = function(key) {
			var indexToBeRemoved;
			parameters.forEach(function(parameter, index){
				if(parameter.key === key) {
					indexToBeRemoved = index;
				}
			});
			if(indexToBeRemoved >= 0){
				parameters.splice(indexToBeRemoved, 1);
			}
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#setTitleKey
		 * @function
		 * @description Set the titleKey
		 * @param {string} text key for the title
		 */
		this.setTitleKey = function(labelKey){
			titleKey = labelKey;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.sap.apf.modeler.core.NavigationTarget#getTitleKey
		 * @function
		 * @description Get the titleKey
		 * @returns {string} text key for the title
		 */
		this.getTitleKey = function(){
			return titleKey;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.NavigationTargetr#copy
		 * @function
		 * @description Execute a deep copy of the navigation target
		 * @param {String} [newIdForCopy] - Optional new Id for the copied instance
		 * @returns {Object} sap.apf.modeler.core.NavigationTarget# - New navigation target object being a copy of this object
		 */
		this.copy = function(newIdForCopy) {
			var dataForCopy = {
				semObject : semObject,
				actn : actn,
				isStepSpecific : isStepSpecific,
				requestForFilterMapping : requestForFilterMapping,
				targetPropertiesForFilterMapping : targetPropertiesForFilterMapping,
				parameters : parameters,
				titleKey: titleKey
			};
			var dataFromCopy = sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(dataForCopy);
			return new sap.apf.modeler.core.NavigationTarget((newIdForCopy || this.getId()), inject, dataFromCopy);
		};
	};
}());