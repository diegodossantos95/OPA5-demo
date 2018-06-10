/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare("sap.apf.modeler.core.hierarchicalStep");
jQuery.sap.require("sap.apf.modeler.core.step");
(function() {
	'use strict';
	/**
	 * @private
	 * @name sap.apf.modeler.core.HierarchicalStep
	 * @class A hierarchical step proxy object providing editor methods on configuration objects.
	 * @param {String} stepId - unique Id within configuration.
	 * @param {Object} inject - Injection of required APF object references, constructors and functions.
	 * @param {sap.apf.core.utils.MessageHandler} inject.instances.messageHandler - MessageHandler instance
	 * @param {Object} inject.constructor - Injected constructors
	 * @param {sap.apf.core.utils.Hashtable} inject.constructors.Hashtable - Hashtable constructor
	 * @param {Object} dataFromCopy - Optional parameter to set the internal state of the new instance during a copy operation
	 * @constructor
	 */
	sap.apf.modeler.core.HierarchicalStep = function(stepId, inject, dataFromCopy) {
		sap.apf.modeler.core.Step.call(this, stepId, inject, dataFromCopy);
		var hierarchyProperty;
		var createRepresentationFromStep = this.createRepresentation;
		if (dataFromCopy) {
			hierarchyProperty = dataFromCopy.hierarchyProperty;
		}
		/**
		 * @private
		 * @name sap.apf.modeler.core.HierarchicalStep#getType
		 * @function
		 * @returns {String} "hierarchicalStep"
		 */
		this.getType = function() {
			return "hierarchicalStep";
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.HierarchicalStep#getHierarchyProperty
		 * @function
		 * @returns {string} - hierarchyProperty
		 */
		this.getHierarchyProperty = function() {
			return hierarchyProperty;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.HierarchicalStep#setHierarchyProperty
		 * @function
		 * @param {string} - hierarchyProperty
		 */
		this.setHierarchyProperty = function(property) {
			hierarchyProperty = property;
			this.getRepresentationContainer().getElements().forEach(function(representation) {
				representation.setHierarchyProperty(hierarchyProperty);
			});
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.HierarchicalStep#createRepresentation
		 * @description Additionally to the normal representation creation, the hierarchical property is set to the representation
		 * @param {Object} [element] - Fields of optional object will be merged into created object.
		 * @returns {sap.apf.modeler.core.Representation}
		 */
		this.createRepresentation = function(element) {
			var representation = createRepresentationFromStep(element);
			if (hierarchyProperty) {
				representation.setHierarchyProperty(hierarchyProperty);
			}
			return representation;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.HierarchicalStep#getConsumableSortPropertiesForRepresentation
		 * @param {String} representationId
		 * @returns {Object} jQuery.Deferred() the promise will be resolved with an Object with following format
		 * {
		 * 		available: [String],
		 * 		consumable: [String]
		 * }
		 * Available are all properties that are selected properties and are also returned by the metadata
		 * Consumable are all properties that are available minus the already used properties as sort property on representation level
		 */
		this.getConsumableSortPropertiesForRepresentation = function (representationId){
			var that = this;
			var deferred = jQuery.Deferred();
			this.getAvailableProperties().done(function(availableProperties){
				inject.instances.metadataFactory.getMetadata(that.getService()).then(function(metadata){
					var availableMeasures = [];
					availableProperties.forEach(function(property){
						var propertyMetadata = metadata.getPropertyMetadata(that.getEntitySet(), property);
						if(propertyMetadata["aggregation-role"] === "measure"){
							availableMeasures.push(property);
						}
					});
					deferred.resolve({
						available: availableMeasures,
						consumable: that.getConsumableProperties(availableMeasures, that.getSortPropertiesFromRepresentation(representationId))
					});
				}, function(){
					deferred.resolve({
						available: [],
						consumable: []
					});
				});
			});
			return deferred.promise();
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.HierarchicalStep#copy
		 * @function
		 * @description Execute a deep copy of the step and its referenced objects
		 * @param {String} newStepIdForCopy - New step id for the copied instance
		 * @returns {Object} sap.apf.modeler.core.HierarchicalStep - New step object being a copy of this object
		 */
		this.copy = function(newStepIdForCopy) {
			var dataFromCopy = sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(this.getDataForCopy());
			dataFromCopy.hierarchyProperty = hierarchyProperty;
			dataFromCopy.representationContainer = this.getRepresentationContainer().copy((newStepIdForCopy || this.getId()) + "-Representation");
			return new sap.apf.modeler.core.HierarchicalStep((newStepIdForCopy || this.getId()), inject, dataFromCopy);
		};
	};
}());
