/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare("sap.apf.modeler.core.step");
(function() {
	'use strict';
	/**
	 * @private
	 * @name sap.apf.modeler.core.Step
	 * @class A step proxy object providing editor methods on configuration objects.
	 * @param {String} stepId - unique Id within configuration.
	 * @param {Object} inject - Injection of required APF object references, constructors and functions.
	 * @param {sap.apf.core.utils.MessageHandler} inject.instances.messageHandler - MessageHandler instance
	 * @param {Object} inject.constructor - Injected constructors
	 * @param {sap.apf.core.utils.Hashtable} inject.constructors.Hashtable - Hashtable constructor
	 * @param {Object} dataFromCopy - Optional parameter to set the internal state of the new instance during a copy operation
	 * @constructor
	 */
	sap.apf.modeler.core.Step = function(stepId, inject, dataFromCopy) {
		var representationContainer, request, selectProperties, filterProperties, requestForFilterMapping, selectPropertiesForFilterMapping, 
		targetPropertiesForFilterMapping, navigationTargets, keepSourceForFilterMapping, titleId, longTitleId, leftUpperCornerTextKey, 
		rightUpperCornerTextKey, leftLowerCornerTextKey, rightLowerCornerTextKey, topNSettings, messageHandler, filterPropertyLabelKey, filterPropertyLabelDisplayOption;
		messageHandler = inject.instances.messageHandler;
		if (!dataFromCopy) {
			representationContainer = new inject.constructors.ElementContainer(stepId + "-Representation", inject.constructors.Representation, inject);
			request = {};
			selectProperties = new inject.constructors.ElementContainer("SelectProperty", undefined, inject);
			filterProperties = new inject.constructors.ElementContainer("FilterProperty", undefined, inject);
			requestForFilterMapping = {};
			selectPropertiesForFilterMapping = new inject.constructors.ElementContainer("SelectPropertyForFilterMapping", undefined, inject);
			targetPropertiesForFilterMapping = new inject.constructors.ElementContainer("TargetPropertyForFilterMapping", undefined, inject);
			keepSourceForFilterMapping = false;
			navigationTargets = new inject.constructors.ElementContainer("NavigationTarget", undefined, inject);
		} else {
			representationContainer = dataFromCopy.representationContainer;
			request = dataFromCopy.request;
			selectProperties = dataFromCopy.selectProperties;
			filterProperties = dataFromCopy.filterProperties;
			filterPropertyLabelKey = dataFromCopy.filterPropertyLabelKey;
			filterPropertyLabelDisplayOption = dataFromCopy.filterPropertyLabelDisplayOption;
			requestForFilterMapping = dataFromCopy.requestForFilterMapping;
			selectPropertiesForFilterMapping = dataFromCopy.selectPropertiesForFilterMapping;
			targetPropertiesForFilterMapping = dataFromCopy.targetPropertiesForFilterMapping;
			keepSourceForFilterMapping = dataFromCopy.keepSourceForFilterMapping;
			navigationTargets = dataFromCopy.navigationTargets;
			titleId = dataFromCopy.titleId;
			longTitleId = dataFromCopy.longTitleId;
			leftUpperCornerTextKey = dataFromCopy.leftUpperCornerTextKey;
			rightUpperCornerTextKey = dataFromCopy.rightUpperCornerTextKey;
			leftLowerCornerTextKey = dataFromCopy.leftLowerCornerTextKey;
			rightLowerCornerTextKey = dataFromCopy.rightLowerCornerTextKey;
			topNSettings = dataFromCopy.topNSettings;
		}
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getType
		 * @function
		 * @returns {String} "step"
		 */
		this.getType = function (){
			return "step";
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getId
		 * @function
		 * @description The immutable id of the step
		 * @returns {String}
		 */
		this.getId = function() {
			return stepId;
		};
		/**
		 * @description When setting topN to a numeric value, then only the number of topN data sets shall be retrieved and displayed by the representations of the particular step. 
		 * The sorting order of the properties has to be specified too. Otherwise the top n makes no sense. The top n information will be forwarded to the representation of the step, that need this information at runtime (method representation.getRequestOptions)
		 * @private
		 * @name sap.apf.modeler.core.Step#setTopN
		 * @function
		 * @param {number} count the top n value
		 * @param orderBySpec array of orderBy specifications like [ { property : "propertyName1", ascending : true}, { property : "propertyName2", ascending : false}]
		 */
		this.setTopN = function(count, orderBySpec) {
			if (orderBySpec && orderBySpec instanceof Array && orderBySpec.length > 0) {
				this.resetTopN();
				topNSettings = {};
				topNSettings.top = count;
				topNSettings.orderby = orderBySpec; 
			} else {
				messageHandler.putMessage(messageHandler.createMessageObject({
					code : 11016
				}));
				return;
			}
			representationContainer.getElements().forEach(function(representation) {
				representation.setTopN(count);
				topNSettings.orderby.forEach(function(orderBySpec) {
					representation.addOrderbySpec(orderBySpec.property, orderBySpec.ascending);
				});
			});
		};
		/**
		 * @description Sets the value for the topN Property
		 * When setting topN to a numeric value, then only the number of topN data sets shall be retrieved and displayed by the representations of the particular step. 
		 * @private
		 * @name sap.apf.modeler.core.Step#setTopNValue
		 * @function
		 * @param {number} count the top n value
		 */
		this.setTopNValue = function (count){
			if(!topNSettings){
				topNSettings = {};
			}
			topNSettings.top = count;
			if(topNSettings.orderby) {
				setTopNOnRepresentations();
			}
		};
		/**
		 * @description Sets the sorting order of the properties for topN. Without the top n makes no sense.
		 * @private
		 * @name sap.apf.modeler.core.Step#setTopNSortProperties
		 * @function
		 * @param orderBySpec array of orderBy specifications like [ { property : "propertyName1", ascending : true}, { property : "propertyName2", ascending : false}]
		 */
		this.setTopNSortProperties = function (orderBySpec){
			if(!topNSettings){
				topNSettings = {};
			}
			// orderBySpec.ascending should always be a boolean value in the core; as a default value ascending is string "true" in the ui, because the control only understands string values
			if(orderBySpec && orderBySpec.length > 0){
				orderBySpec.forEach(function(orderBy){
					if(orderBy.ascending === "true"){
						orderBy.ascending = true;
					}
				});
			}
			topNSettings.orderby = orderBySpec; 
			if(topNSettings.top) {
				setTopNOnRepresentations();
			}
		};

		function setTopNOnRepresentations () {
			representationContainer.getElements().forEach(function(representation) {
				representation.setTopN(topNSettings.top);
				representation.removeAllOrderbySpecs();
				topNSettings.orderby.forEach(function(orderBySpec) {
					representation.addOrderbySpec(orderBySpec.property, orderBySpec.ascending);
				});
			});
		}
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getTopN
		 * @description returns the topN settings in format { top : topN, orderby : [ { property: p1, ascending: true}, ...] }
		 * @function
		 * @returns {object} topNSettings or if nothing is set, then undefined is returned;
		 */
		this.getTopN = function() {
			if (topNSettings && topNSettings.top > 0) {
				if(jQuery.isArray(topNSettings.orderby)){
					var selectProperties = this.getSelectProperties();
					var i;
					for(i = topNSettings.orderby.length - 1; i >= 0; i--){
						if(jQuery.inArray(topNSettings.orderby[i].property, selectProperties) < 0){
							topNSettings.orderby.splice(i, 1);
							setTopNOnRepresentations();
						}
					}
				}
				return jQuery.extend({}, true, topNSettings);
			}
		};
		/**
		 * @private
		 * @description The top n is reset. The representation will no longer restrict data selection to top n records.
		 * @name sap.apf.modeler.core.Step#resetTopN
		 * @function

		 */
		this.resetTopN = function() {
			topNSettings = undefined;
			representationContainer.getElements().forEach(function(representation) {
				if(representation.getTopN()){
					representation.setTopN(undefined);
				}
			});
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getService
		 * @function
		 * @returns {string} - service root
		 */
		this.getService = function() {
			return request.service;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#setService
		 * @function
		 * @description Set the service root.
		 * @param {string} serviceRoot - serviceRoot URI
		 */
		this.setService = function(serviceRoot) {
			request.service = serviceRoot;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getEntitySet
		 * @function
		 * @returns {string} - entitySetName
		 */
		this.getEntitySet = function() {
			return request.entitySet;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#setEntitySet
		 * @function
		 * @description Set the entitySet.
		 * @param {string} entitySet - entitySet name
		 */
		this.setEntitySet = function(entitySet) {
			request.entitySet = entitySet;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#setTitleId
		 * @function
		 * @description Set the title id.
		 * @param {String} id Title id
		 */
		this.setTitleId = function(id) {
			titleId = id;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getTitleId
		 * @function
		 * @description Returns the title id.
		 * @returns {String}
		 */
		this.getTitleId = function() {
			return titleId;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#setLongTitleId
		 * @function
		 * @description Set the longTitle id.
		 * @param {String} id LongTitle id
		 */
		this.setLongTitleId = function(id) {
			longTitleId = id;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getLongTitleId
		 * @function
		 * @description Returns the longTitle id.
		 * @returns {String}
		 */
		this.getLongTitleId = function() {
			return longTitleId;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getSelectProperties
		 * @function
		 * @description Return an array of the mutable OData properties of the step and its request.
		 * @returns {String[]}
		 */
		this.getSelectProperties = function() {
			var list = [];
			var lll = selectProperties.getElements();
			lll.forEach(function(item) {
				list.push(item.getId());
			});
			return list;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#addSelectProperty
		 * @function
		 * @description Add an OData properties.
		 * @param {string} property - property name
		 */
		this.addSelectProperty = function(property) {
			selectProperties.createElementWithProposedId(undefined, property);
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#removeSelectProperty
		 * @function
		 * @description Remove an OData properties.
		 * @param {string} property - property name
		 */
		this.removeSelectProperty = function(property) {
			selectProperties.removeElement(property);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getFilterProperties
		 * @description The mutable filter properties.
		 * @returns {String[]}
		 */
		this.getFilterProperties = function() {
			var list = [];
			var aFilterProperties = filterProperties.getElements();
			aFilterProperties.forEach(function(oFilterProperty) {
				list.push(oFilterProperty.getId());
			});
			return list;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#addFilterProperty
		 * @description Add an OData properties.
		 * @param {string} property - property name
		 */
		this.addFilterProperty = function(property) {
			filterPropertyLabelKey = undefined;
			filterPropertyLabelDisplayOption = undefined;
			return filterProperties.createElementWithProposedId(undefined, property).getId();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#removeFilterProperty
		 * @description Remove an OData properties.
		 * @param {string} property - property name
		 */
		this.removeFilterProperty = function(property) {
			filterPropertyLabelKey = undefined;
			filterPropertyLabelDisplayOption = undefined;
			filterProperties.removeElement(property);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#setFilterPropertyLabelKey
		 * @description Set a text label key to the filter property
		 * @param {string} labelKey - text label key
		 */
		this.setFilterPropertyLabelKey = function(labelKey) {
			filterPropertyLabelKey = labelKey;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getFilterPropertyLabelKey
		 * @description Get the text label key to the filter property
		 * @returns {string} labelKey - text label key
		 */
		this.getFilterPropertyLabelKey = function() {
			return filterPropertyLabelKey;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#setFilterPropertyDisplayOption
		 * @description Set a text label display option to the filter property
		 * @param {string} labelDisplayOption - text label display option
		 */
		this.setFilterPropertyLabelDisplayOption = function(labelDisplayOption) {
			filterPropertyLabelDisplayOption = labelDisplayOption;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getFilterPropertyLabelDisplayOption
		 * @description Get the text label display option to the filter property
		 * @returns {string} labelDisplayOption - text label display option
		 */
		this.getFilterPropertyLabelDisplayOption = function() {
			return filterPropertyLabelDisplayOption;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#setFilterMappingService
		 * @function
		 * @description Sets the service root for filter mapping. 
		 * @param {string} serviceRoot - service root for filter mapping
		 */
		this.setFilterMappingService = function(serviceRoot) {
			requestForFilterMapping.service = serviceRoot;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getFilterMappingService
		 * @function
		 * @description Returns the service root for filter mapping. 
		 * @returns {string} - Service root for filter mapping
		 */
		this.getFilterMappingService = function() {
			return requestForFilterMapping.service;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#setFilterMappingEntitySet
		 * @function
		 * @description Sets the entity set for filter mapping. 
		 * @param {string} entitySet - Entity set for filter mapping
		 */
		this.setFilterMappingEntitySet = function(entitySet) {
			requestForFilterMapping.entitySet = entitySet;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getFilterMappingEntitySet
		 * @function
		 * @description Returns the entity set for filter mapping. 
		 * @returns {string} - Entity set for filter mapping
		 */
		this.getFilterMappingEntitySet = function() {
			return requestForFilterMapping.entitySet;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#addFilterMappingTargetProperty
		 * @function
		 * @description Adds a target property for filter mapping.
		 * @param {string} property - Property name
		 */
		this.addFilterMappingTargetProperty = function(property) {
			targetPropertiesForFilterMapping.createElementWithProposedId(undefined, property);
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getFilterMappingTargetProperties
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
		 * @name sap.apf.modeler.core.Step#removeFilterMappingTargetProperty
		 * @function
		 * @description Removes a filter mapping target property
		 * @param {string} property - Property name
		 */
		this.removeFilterMappingTargetProperty = function(property) {
			targetPropertiesForFilterMapping.removeElement(property);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#addNavigationTarget
		 * @description Add a navigation target to the step
		 * @param {string} navigationTargetId - navigation target id
		 */
		this.addNavigationTarget = function(navigationTargetId) {
			navigationTargets.createElementWithProposedId(undefined, navigationTargetId);
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getNavigationTargets
		 * @function
		 * @description Returns an array of navigation targets.
		 * @returns {String[]}
		 */
		this.getNavigationTargets = function() {
			var navigationTargetIds = [];
			var navigationTargetList = navigationTargets.getElements();
			navigationTargetList.forEach(function(item) {
				navigationTargetIds.push(item.getId());
			});
			return navigationTargetIds;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#removeNavigationTarget
		 * @function
		 * @description Removes a navigation target
		 * @param {string} navigationTargetId - navigation target id
		 */
		this.removeNavigationTarget = function(navigationTargetId) {
			navigationTargets.removeElement(navigationTargetId);
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#setFilterMappingKeepSource
		 * @function
		 * @description Sets the keepSource property for filter mapping. 
		 * @param {boolean} keepSource 
		 */
		this.setFilterMappingKeepSource = function(keepSource) {
			keepSourceForFilterMapping = keepSource;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.Step#getFilterMappingKeepSource
		 * @function
		 * @description Returns the keepSource property for filter mapping.
		 * @returns {boolean}
		 */
		this.getFilterMappingKeepSource = function() {
			return keepSourceForFilterMapping;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getRepresentations
		 * @description A list of representation objects, see {@link sap.apf.modeler.core.Representation}.
		 * @returns {sap.apf.modeler.core.Representation[]}
		 */
		this.getRepresentations = representationContainer.getElements;
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getRepresentation
		 * @description Return an element if existing, see {@link sap.apf.modeler.core.Representation}.
		 * @param {string} representationId
		 * @returns {sap.apf.modeler.core.Representation}
		 */
		this.getRepresentation = representationContainer.getElement;
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#createRepresentation
		 * @param {Object} [element] - Fields of optional object will be merged into created object.
		 * @returns {sap.apf.modeler.core.Representation}
		 */
		this.createRepresentation = function(element) {
			var representation = representationContainer.createElement(element);
			if (topNSettings && topNSettings.top) {
				representation.setTopN(topNSettings.top);
				topNSettings.orderby.forEach(function(orderbySpec) {
					representation.addOrderbySpec(orderbySpec.property, orderbySpec.ascending);
				});
			}
			return representation;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#removeRepresentation
		 * @param {string} representationId
		 */
		this.removeRepresentation = representationContainer.removeElement;
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#copyRepresentation
		 * @param {string} representationId
		 * @returns {string} Id for new representation
		 */
		this.copyRepresentation = representationContainer.copyElement;
		/**
		 * Change the ordering by moving one representation in the ordering before another representation.
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#moveRepresentationBefore
		 * @param {string} beforeRepresentationId
		 * @param {string} movedRepresentationId
		 * @returns {number|null} WHEN either Id is not contained or undefined THEN return null.
		 *      Otherwise return the index of the index position of movedRepresentationId, after the move.
		 */
		this.moveRepresentationBefore = function(beforeRepresentationId, movedRepresentationId) {
			return representationContainer.moveBefore(beforeRepresentationId, movedRepresentationId);
		};
		/**
		 * Move a representation up or down some places specified by distance
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#moveRepresentationUpOrDown
		 * @param {string} representationId id of the representation, that shall be moved
		 * @param {string} distance number of places
		 */
		this.moveRepresentationUpOrDown = function(representationId, distance) {
			return representationContainer.moveUpOrDown(representationId, distance);
		};
		/**
		 * Change the ordering of representations by moving one representation in the ordering to the end.
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#moveRepresentationToEnd
		 * @param {string} representationId
		 * @returns {number|null} WHEN the key representationId is not contained or undefined THEN return null.
		 *      Otherwise return the index of the index position of representation(Id), after the move.
		 */
		this.moveRepresentationToEnd = function(representationId) {
			return representationContainer.moveToEnd(representationId);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#setLeftUpperCornerTextKey
		 * @description Optional member.
		 *          When the value is null or undefined the corner text will be omitted from the serialized configuration object.
		 *          The initial value is set to undefined.
		 * @param {String|null} textKey
		 */
		this.setLeftUpperCornerTextKey = function(textKey) {
			leftUpperCornerTextKey = textKey;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getLeftUpperCornerTextKey
		 * @description Get optional member.
		 * @returns {String|undefined|null} Return a textKey (GUID). Returns undefined when initial, null or undefined when set to null or undefined.
		 */
		this.getLeftUpperCornerTextKey = function() {
			return leftUpperCornerTextKey;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#setRightUpperCornerTextKey
		 * @description Optional member
		 * @param {String|null} textKey
		 */
		this.setRightUpperCornerTextKey = function(textKey) {
			rightUpperCornerTextKey = textKey;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getRightUpperCornerTextKey
		 * @description Optional member
		 * @returns {String} typeId
		 */
		this.getRightUpperCornerTextKey = function() {
			return rightUpperCornerTextKey;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#setLeftLowerCornerTextKey
		 * @description Optional member
		 * @param {String|null} textKey
		 */
		this.setLeftLowerCornerTextKey = function(textKey) {
			leftLowerCornerTextKey = textKey;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getLeftLowerCornerTextKey
		 * @description Optional member
		 * @returns {String} typeId
		 */
		this.getLeftLowerCornerTextKey = function() {
			return leftLowerCornerTextKey;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#setRightLowerCornerTextKey
		 * @description Optional member
		 * @param {String|null} textKey
		 */
		this.setRightLowerCornerTextKey = function(textKey) {
			rightLowerCornerTextKey = textKey;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getRightLowerCornerTextKey
		 * @description Optional member
		 * @returns {String} typeId
		 */
		this.getRightLowerCornerTextKey = function() {
			return rightLowerCornerTextKey;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getConsumablePropertiesForTopN
		 * @returns {Object} jQuery.Deferred() the promise will be resolved with an Object with following format
		 * {
		 * 		available: [String],
		 * 		consumable: [String]
		 * }
		 * Available are all properties that are selected properties and are also returned by the metadata
		 * Consumable are all properties that are available minus the already used properties as top N sort properties
		 */
		this.getConsumablePropertiesForTopN = function (){
			var deferred = jQuery.Deferred();
			this.getAvailableProperties().done(function(availableProperties){
				var selectedProperties = [];
				if(topNSettings && topNSettings.orderby && topNSettings.orderby.length > 0){
					topNSettings.orderby.forEach(function(orderBy){
						selectedProperties.push(orderBy.property);
					});
				}
				deferred.resolve({
					available: availableProperties,
					consumable: this.getConsumableProperties(availableProperties, selectedProperties)
				});
			}.bind(this));
			return deferred.promise();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getConsumablePropertiesForRepresentation
		 * @param {String} representationId
		 * @returns {Object} jQuery.Deferred() the promise will be resolved with an Object with following format
		 * {
		 * 		available: [String],
		 * 		consumable: [String]
		 * }
		 * Available are all properties that are selected properties and are also returned by the metadata
		 * Consumable are all properties that are available minus the already used properties as dimension/measure/property on representation level
		 */
		this.getConsumablePropertiesForRepresentation = function (representationId){
			var deferred = jQuery.Deferred();
			this.getAvailableProperties().done(function(availableProperties){
				if(this.getHierarchyProperty && this.getHierarchyProperty()){
					availableProperties.push(this.getHierarchyProperty());
				}
				var selectedProperties = [];
				var representation = representationContainer.getElement(representationId);
				jQuery.merge(selectedProperties, representation.getDimensions());
				jQuery.merge(selectedProperties, representation.getMeasures());
				jQuery.merge(selectedProperties, representation.getProperties());
				if(representation.getHierarchyProperty()){
					selectedProperties.push(representation.getHierarchyProperty());
				}

				deferred.resolve({
					available: availableProperties,
					consumable: this.getConsumableProperties(availableProperties, selectedProperties)
				});
			}.bind(this));
			return deferred.promise();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getConsumableSortPropertiesForRepresentation
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
			var deferred = jQuery.Deferred();
			this.getAvailableProperties().done(function(availableProperties){
				deferred.resolve({
					available: availableProperties,
					consumable: this.getConsumableProperties(availableProperties, this.getSortPropertiesFromRepresentation(representationId))
				});
			}.bind(this));
			return deferred.promise();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getConsumableProperties
		 * @description Will return an array of properties that are selected as sort properties on representation level
		 * @returns {Object} jQuery.Deferred() the promise will be resolved with [String]
		 */
		this.getSortPropertiesFromRepresentation = function(representationId){
			var selectedProperties = [];
			var representation = representationContainer.getElement(representationId);
			var orderbySpecs = representation.getOrderbySpecifications();
			orderbySpecs.forEach(function(orderbySpec){
				selectedProperties.push(orderbySpec.property);
			});
			return selectedProperties;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getConsumableProperties
		 * @description Will return an array of consumable properties: Every available property that is not selected is consumable
		 * @param {[String]} availableProperties
		 * @param {[String]} selectedProperties
		 * @returns {Object} jQuery.Deferred() the promise will be resolved with [String]
		 */
		this.getConsumableProperties = function(availableProperties, selectedProperties) {
			var consumableValues = [];
			availableProperties.forEach(function(availableValue){
				if(jQuery.inArray(availableValue, selectedProperties) === -1 ){
					consumableValues.push(availableValue);
				}
			});
			return consumableValues;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.Step#getAvailableProperties
		 * @description Will return an array of available properties: Every property that is selected on step level and is in the metadata
		 * @returns {Object} jQuery.Deferred() the promise will be resolved with [String]
		 */
		this.getAvailableProperties = function() {
			var deferred = jQuery.Deferred();
			var availableProperties = [];
			if(request.service && request.entitySet){
				inject.instances.metadataFactory.getMetadata(request.service).then(function(metadata){
					if(metadata){
						var propertiesInMetadata = metadata.getAllPropertiesOfEntitySet(request.entitySet);
						var selectedValues = this.getSelectProperties();
						selectedValues.forEach(function(selectedValue){
							if(jQuery.inArray(selectedValue, propertiesInMetadata) !== -1 ){
								availableProperties.push(selectedValue);
							}
						});
					}
					deferred.resolve(availableProperties);
				}.bind(this), function(){
					deferred.resolve([]);
				});
			} else {
				deferred.resolve([]);
			}
			return deferred.promise();
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.step#copy
		 * @function
		 * @description Execute a deep copy of the step and its referenced objects
		 * @param {String} newStepIdForCopy - New step id for the copied instance
		 * @returns {Object} sap.apf.modeler.core.step# - New step object being a copy of this object
		 */
		this.copy = function(newStepIdForCopy) {
			var dataFromCopy = sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(this.getDataForCopy());
			dataFromCopy.representationContainer = representationContainer.copy((newStepIdForCopy || this.getId()) + "-Representation");
			return new sap.apf.modeler.core.Step((newStepIdForCopy || this.getId()), inject, dataFromCopy);
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.step#getDataForCopy
		 * @function
		 * @description Gets the relevant data for a copy
		 * @returns {Object} - All relevant data for a copy of the step
		 */
		this.getDataForCopy = function (){
			return {
					request : request,
					selectProperties : selectProperties,
					filterProperties : filterProperties,
					filterPropertyLabelKey : filterPropertyLabelKey, 
					filterPropertyLabelDisplayOption : filterPropertyLabelDisplayOption, 
					requestForFilterMapping : requestForFilterMapping,
					selectPropertiesForFilterMapping : selectPropertiesForFilterMapping,
					targetPropertiesForFilterMapping : targetPropertiesForFilterMapping,
					navigationTargets : navigationTargets,
					keepSourceForFilterMapping : keepSourceForFilterMapping,
					titleId : titleId,
					longTitleId : longTitleId,
					leftUpperCornerTextKey : leftUpperCornerTextKey,
					rightUpperCornerTextKey : rightUpperCornerTextKey,
					leftLowerCornerTextKey : leftLowerCornerTextKey,
					rightLowerCornerTextKey : rightLowerCornerTextKey,
					topNSettings : topNSettings
			};
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.step#getRepresentationContainer
		 * @function
		 * @returns {Object} sap.apf.modeler.core.ElementContainer - representationContainer
		 */
		this.getRepresentationContainer = function () {
			return representationContainer;
		};
	};
}());
