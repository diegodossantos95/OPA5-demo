/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare("sap.apf.modeler.core.configurationEditor");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	'use strict';
	/**
	 * @private
	 * @name sap.apf.modeler.core.ConfigurationEditor
	 * @class Configuration Editor manages the different configuration objects like categories, steps etc.
	 * @param {String} configuration - ConfigurationEditor configuration guid
	 * @param {Object} inject - Injection of required APF objects
	 * @param {Object} inject.instance - Injected instances
	 * @param {sap.apf.core.utils.MessageHandler} inject.instances.messageHandler - MessageHandler instance
	 * @param {sap.apf.modeler.core.OdataProxy} inject.instances.persistenceProxy - PersistenceProxy instance
	 * @param {sap.apf.modeler.core.ConfigurationHandler} inject.instances.configurationHandler - ConfigurationHandler instance
	 * @param {sap.apf.modeler.core.TextPool} inject.instances.textPool - TextPool instance
	 * @param {sap.apf.modeler.core.Instance} inject.instances.coreApi - Modeler core instance
	 * @param {Object} inject.constructors - Injected constructors
	 * @param {sap.apf.core.utils.Hashtable} inject.constructors.Hashtable - Hashtable constructor
	 * @param {sap.apf.modeler.core.ConfigurationObjects} inject.constructors.ConfigurationObjects
	 * @param {sap.apf.modeler.core.Step} inject.constructors.Step
	 * @param {sap.apf.modeler.core.Representation} inject.constructors.Representation
	 * @param {sap.apf.modeler.core.ElementContainer} inject.constructors.ElementContainer
	 * @param {sap.apf.modeler.core.RegistryWrapper} inject.constructors.RegistryProbe
	 * @param {sap.apf.core.ConfigurationFactory} inject.constructors.ConfigurationFactory
	 * @param {sap.apf.core.Metadata} inject.constructors.Metadata
	 * @param {sap.apf.core.EntityTypeMetadata} inject.constructors.EntityTypeMetadata
	 * @param {sap.apf.core.MetadataFacade} inject.constructors.MetadataFacade
	 * @param {sap.apf.core.MetadataProperty} inject.constructors.MetadataProperty
	 * @param {sap.apf.core.MetadataFactory} inject.constructors.ConfigurationFactory
	 * @param {Function} callbackAfterLoad - Callback called after load from server with signature callbackAfterLoad(instance, messageObject)
	 * @param {Object} dataFromCopy - Optional parameter to set the internal state of the new instance during a copy operation
	 * @constructor
	 */
	sap.apf.modeler.core.ConfigurationEditor = function(configuration, inject, callbackAfterLoad, dataFromCopy) {
		var that = this;
		var filterOption;
		var applicationTitle;
		var configurationHandler = inject.instances.configurationHandler;
		var persistenceProxy = inject.instances.persistenceProxy;
		var messageHandler = inject.instances.messageHandler;
		var metadataFactory = inject.instances.metadataFactory;
		var isSaved = true;
		var stepContainer, categoryContainer, facetFilterContainer, navigationTargetContainer, categoryStepAssignmentContainer, serviceList;
		var smartFilterBar;
		var configurationObjects = new inject.constructors.ConfigurationObjects(inject);
		var configurationFactory = new inject.constructors.ConfigurationFactory({
			instances : {
				messageHandler : messageHandler
			},
			constructors : {
				RegistryProbe : inject.constructors.RegistryProbe
			}
		});
		if (!dataFromCopy) {
			stepContainer = new inject.constructors.ElementContainer("Step", inject.constructors.Step, inject);
			categoryContainer = new inject.constructors.ElementContainer("Category", undefined, inject);
			facetFilterContainer = new inject.constructors.ElementContainer("FacetFilter", inject.constructors.FacetFilter, inject);
			navigationTargetContainer = new inject.constructors.ElementContainer("NavigationTarget", inject.constructors.NavigationTarget, inject);
			categoryStepAssignmentContainer = new inject.constructors.ElementContainer("CategoryStepAssignment", inject.constructors.ElementContainer, inject);
			serviceList = [];
			filterOption = {
				smartFilterBar : true
			};
		} else {
			stepContainer = dataFromCopy.stepContainer;
			categoryContainer = dataFromCopy.categoryContainer;
			smartFilterBar = dataFromCopy.smartFilterBar;
			facetFilterContainer = dataFromCopy.facetFilterContainer;
			navigationTargetContainer = dataFromCopy.navigationTargetContainer;
			categoryStepAssignmentContainer = dataFromCopy.categoryStepAssignmentContainer;
			serviceList = dataFromCopy.serviceList;
			applicationTitle = dataFromCopy.applicationTitle;
			filterOption = dataFromCopy.filterOption;
		}
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#registerServiceAsPromise
		 * @description Registers service for value help collection. Message will be thrown in case of invalid service.
		 * @param {String} serviceRoot
		 * @returns {jQuery.Deferred.promise} Returns function with parameter true if service is registered successfully
		 */
		this.registerServiceAsPromise = function(serviceRoot) {
			var deferred = jQuery.Deferred();
			var metadataPromise;
			if (serviceList.indexOf(serviceRoot) === -1) {
				metadataPromise = metadataFactory.getMetadata(serviceRoot);
				metadataPromise.done(function() {
					if (serviceList.indexOf(serviceRoot) === -1) {
						serviceList.push(serviceRoot);
					}
					deferred.resolve(true);
				});
				metadataPromise.fail(function() {
					deferred.resolve(false);
				});
			} else {
				deferred.resolve(true);
			}
			return deferred.promise();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getAllServices
		 * @description Returns all successfully registered services.
		 * @returns {Object[]} serviceList
		 */
		this.getAllServices = function() {
			return serviceList;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getAllEntitySetsOfServiceAsPromise
		 * @description Returns all entity sets of service.
		 * @param {String} serviceRoot 
		 * @returns {jQuery.Deferred.promise} Returns promise which is resolved with array of entity sets
		 */
		this.getAllEntitySetsOfServiceAsPromise = function(serviceRoot) {
			var deferred = jQuery.Deferred();
			if (serviceList.indexOf(serviceRoot) > -1) {
				metadataFactory.getEntitySets(serviceRoot).done(function(entitySets) {
					deferred.resolve(entitySets);
				});
			} else {
				deferred.resolve([]);
			}
			return deferred.promise();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getAllHierarchicalEntitySetsOfServiceAsPromise
		 * @description Returns all hierarchical entity sets of service.
		 * @param {String} serviceRoot 
		 * @returns {Object} jQuery.Deferred - will be resolved with all entitySets that have a hierarchical property
		 */
		this.getAllHierarchicalEntitySetsOfServiceAsPromise = function(serviceRoot) {
			var deferred = jQuery.Deferred();
			metadataFactory.getMetadata(serviceRoot).done(function(metadata) {
				if (metadata) {
					deferred.resolve(metadata.getHierarchicalEntitySets());
				}
				deferred.resolve([]);
			}).fail(function() {
				deferred.resolve([]);
			});
			return deferred.promise();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#checkIfHierarchicalEntitySetIsAvailableAsPromise
		 * @description Returns if a service has hierarchical entity sets.
		 * @param {String} serviceRoot 
		 * @returns {Object} jQuery.Deferred - will be resolved with true/false
		 */
		this.checkIfHierarchicalEntitySetIsAvailableAsPromise = function(serviceRoot) {
			var deferred = jQuery.Deferred();
			this.getAllHierarchicalEntitySetsOfServiceAsPromise(serviceRoot).done(function(hierarchicalEntitySets) {
				if (hierarchicalEntitySets.length > 0) {
					deferred.resolve(true);
				} else {
					deferred.resolve(false);
				}
			});
			return deferred;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getHierarchicalPropertiesOfEntitySetAsPromise
		 * @description Returns all hierarchical properties of entitySet of service.
		 * @param {String} serviceRoot 
		 * @param {String} entitySet 
		 * @returns {Object} jQuery.Deferred - will be resolved with all hierarchical properties
		 */
		this.getHierarchicalPropertiesOfEntitySetAsPromise = function(serviceRoot, entitySet) {
			var deferred = jQuery.Deferred();
			metadataFactory.getMetadata(serviceRoot).done(function(metadata) {
				if (metadata) {
					deferred.resolve(metadata.getHierarchicalPropertiesOfEntitySet(entitySet));
				} else {
					deferred.resolve([]);
				}
			}).fail(function() {
				deferred.resolve([]);
			});
			return deferred;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getHierarchyNodeIdAsPromise
		 * @description Returns hierarchyNodeId which belongs to a hierarchy
		 * @param {String} serviceRoot
		 * @param {String} entitySet
		 * @param {String} hierarchyProperty
		 * @returns {Object} jQuery.Deferred - will be resolved with the hierarchyNodeId
		 */
		this.getHierarchyNodeIdAsPromise = function(serviceRoot, entitySet, hierarchyProperty) {
			var hierarchyAnnotations;
			var deferred = jQuery.Deferred();
			metadataFactory.getMetadata(serviceRoot).done(function(metadata) {
				if (metadata) {
					hierarchyAnnotations = metadata.getHierarchyAnnotationsForProperty(entitySet, hierarchyProperty);
					if (hierarchyAnnotations && hierarchyAnnotations.hierarchyNodeFor) {
						deferred.resolve(hierarchyAnnotations.hierarchyNodeFor);
					} else {
						deferred.resolve(null);
					}
				} else {
					deferred.resolve(null);
				}
			}).fail(function() {
				deferred.resolve(null);
			});
			return deferred;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getNonHierarchicalPropertiesOfEntitySetAsPromise
		 * @description Returns all non hierarchical properties of entitySet of service.
		 * @param {String} serviceRoot
		 * @param {String} entitySet
		 * @returns {Object} jQuery.Deferred - will be resolved with all non hierarchical properties
		 */
		this.getNonHierarchicalPropertiesOfEntitySet = function(serviceRoot, entitySet) {
			var nonHierarchicalProperties;
			var deferred = jQuery.Deferred();
			metadataFactory.getMetadata(serviceRoot).then(function(metadata) {
				nonHierarchicalProperties = metadata.getNonHierarchicalPropertiesOfEntitySet(entitySet);
				deferred.resolve(nonHierarchicalProperties);
			}, function(){
				deferred.resolve([]);
			});
			return deferred;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getAllEntitySetsExceptParameterEntitySets
		 * @description Returns all entity types of service.
		 * @param {String} serviceRoot 
		 * @returns {jQuery.Deferred.promise} 
		 */
		this.getAllEntitySetsExceptParameterEntitySets = function(serviceRoot) {
			var deferred = jQuery.Deferred();
			if (serviceList.indexOf(serviceRoot) > -1) {
				metadataFactory.getAllEntitySetsExceptParameterEntitySets(serviceRoot).done(function(entityTypes) {
					deferred.resolve(entityTypes);
				});
			} else {
				deferred.resolve([]);
			}
			return deferred.promise();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getAllEntitySetsOfServiceWithGivenPropertiesAsPromise
		 * @description Returns all entity sets of service that have the given set of properties as filterable properties.
		 * @param {String} serviceRoot 
		 * @param {Array} properties
		  * @returns {jQuery.Deferred.promise}
		 */
		this.getAllEntitySetsOfServiceWithGivenPropertiesAsPromise = function(serviceRoot, properties) {
			var result = [];
			var deferred = jQuery.Deferred();
			this.getAllEntitySetsOfServiceAsPromise(serviceRoot).done(function(entitySets) {
				if (!properties || properties.length === 0) {
					deferred.resolve(entitySets);
					return;
				}
				metadataFactory.getMetadata(serviceRoot).done(function(metadata) {
					entitySets.forEach(function(entitySet) {
						var filterableProperties = metadata.getFilterableProperties(entitySet);
						var hasAllProperties = true;
						for(var i = 0; i < properties.length; i++) {
							if (filterableProperties.indexOf(properties[i]) <= -1) {
								hasAllProperties = false;
								break;
							}
						}
						if (hasAllProperties) {
							result.push(entitySet);
						}
					});
					deferred.resolve(result);
				});
			});
			return deferred.promise();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getAllPropertiesOfEntitySetAsPromise
		 * @description Returns all properties of an entity set..
		 * @param {String} serviceRoot 
		 * @param {String} entitySet 
		 * @returns {jQuery.Deferred.promise}
		 */
		this.getAllPropertiesOfEntitySetAsPromise = function(serviceRoot, entitySet) {
			var deferred = jQuery.Deferred();
			if (serviceList.indexOf(serviceRoot) > -1) {
				metadataFactory.getMetadata(serviceRoot).done(function(metadata) {
					deferred.resolve(metadata.getAllPropertiesOfEntitySet(entitySet));
				});
			} else {
				deferred.resolve([]);
			}
			return deferred.promise();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getAllKnownPropertiesAsPromise
		 * @description Returns all known properties of registered services including parameter entity set key properties. 
		 * @returns {jQuery.Deferred.promise} Returns promise which is resolved with all known properties
		 */
		this.getAllKnownPropertiesAsPromise = function() {
			var deferred = jQuery.Deferred();
			var allKnownProperties = [];
			var numberOfServices = serviceList.length;
			serviceList.forEach(function(serviceRoots) {
				metadataFactory.getMetadata(serviceRoots).done(function(metadata) {
					allKnownProperties = allKnownProperties.concat(metadata.getAllProperties());
					numberOfServices--;
					if (numberOfServices === 0) {
						allKnownProperties = sap.apf.utils.eliminateDuplicatesInArray(messageHandler, allKnownProperties);
						deferred.resolve(allKnownProperties);
					}
				});
			});
			return deferred.promise();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getFilterablePropertiesAndParametersAsPromise
		 * @description Returns all known properties of registered services which are filterable or parameters. 
		 * @returns {jQuery.Deferred.promise} Returns promise which is resolved with an array of properties and parameters
		 */
		this.getFilterablePropertiesAndParametersAsPromise = function() {
			var deferred = jQuery.Deferred();
			var properties = [];
			var numberOfServiceLists = serviceList.length;
			serviceList.forEach(function(serviceRoot) {
				metadataFactory.getMetadata(serviceRoot).done(function(metadata) {
					properties = properties.concat(metadata.getFilterablePropertiesAndParameters());
					if (--numberOfServiceLists === 0) {
						deferred.resolve(sap.apf.utils.eliminateDuplicatesInArray(messageHandler, properties));
					}
				});
			});
			if (numberOfServiceLists === 0) {
				deferred.resolve([]);
			}
			return deferred.promise();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#setApplicationTitle
		 * @description Set application title of analytical configuration.
		 * @param {String} textKey Text key for application title
		 */
		this.setApplicationTitle = function(textKey) {
			isSaved = false;
			applicationTitle = textKey;
		};
		/**
		 * @private
		 * @function
		 * @description Get application title of analytical configuration.
		 * @name sap.apf.modeler.core.ConfigurationEditor#getApplicationTitle
		 * @returns {String} textKey Text key of application title
		 */
		this.getApplicationTitle = function() {
			return applicationTitle;
		};
		/**
		 * @private
		 * @function
		 * @description Get configuration name of analytical configuration.
		 * Only needed modeler core internally in order to synchronize the configuration list of configuration handler during reset.
		 * @name sap.apf.modeler.core.ConfigurationEditor#getConfigurationName
		 * @returns {String} name Configuration name
		 */
		this.getConfigurationName = function() {
			return configurationHandler.getConfiguration(configuration.id || configuration).AnalyticalConfigurationName;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getCategoryStepAssignments
		 * @description Get the assignments of steps for a given category
		 * @param {String} id Category identifier
		 * @returns {array|boolean} Returns the step assignments or false for a not existing category
		 */
		this.getCategoryStepAssignments = function(categoryId) {
			var result = [];
			if (!this.getCategory(categoryId)) {
				return false;
			}
			var categoryStepAssignment = categoryStepAssignmentContainer.getElement(categoryId);
			if (categoryStepAssignment) {
				categoryStepAssignment.getElements().forEach(function(step) {
					result.push(step.stepId);
				});
			}
			return result;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#addCategoryStepAssignment
		 * @description Create a new category step assignment
		 * @param {string} categoryId
		 * @param {string} stepId
		 * @returns {boolean} Returns true if a new category step assignment has been created
		 */
		this.addCategoryStepAssignment = function(categoryId, stepId) {
			if (!this.getCategory(categoryId) || !this.getStep(stepId)) {
				return false;
			}
			var categoryStepAssignment = categoryStepAssignmentContainer.getElement(categoryId);
			if (!categoryStepAssignment) {
				categoryStepAssignmentContainer.createElementWithProposedId({}, categoryId);
				categoryStepAssignment = categoryStepAssignmentContainer.getElement(categoryId);
			}
			if (!categoryStepAssignment.getElement(stepId)) {
				categoryStepAssignment.createElementWithProposedId({
					stepId : stepId
				}, stepId);
				return true;
			}
			return false;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#removeCategoryStepAssignment
		 * @description Remove an existing category step assignment. 
		 * @description If the last category assignment for a step is removed, the step is removed as well.
		 * @description  - If the assignment changes please use first(!) addCategoryStepAssignment for the new assignments
		 * @description  - Afterwards(!) remove the not needed assignments with removeCategoryStepAssignment 
		 * @description  - Otherwise(!) you might loose the step object in between 
		 * @param {string} categoryId - category
		 * @param {string} [stepId] - optional parameter for step
		 * @returns {boolean} Returns true if a category step assignment was removed
		 */
		this.removeCategoryStepAssignment = function(categoryId, stepId) {
			var removedItem;
			if (!stepId) {
				var steps = this.getCategoryStepAssignments(categoryId);
				removedItem = categoryStepAssignmentContainer.removeElement(categoryId);
				if (removedItem) {
					removeDanglingSteps(steps);
				}
				return !!removedItem;
			}
			var categoryStepAssignment = categoryStepAssignmentContainer.getElement(categoryId);
			if (!categoryStepAssignment) {
				return false;
			}
			removedItem = categoryStepAssignment.removeElement(stepId);
			if (categoryStepAssignment.getElements().length === 0) {
				categoryStepAssignmentContainer.removeElement(categoryId);
			}
			if (removedItem) {
				removeDanglingSteps([ stepId ]);
			}
			return !!removedItem;
		};
		function removeDanglingSteps(steps) {
			if (!steps) {
				return;
			}
			steps.forEach(function(stepId) {
				if (that.getCategoriesForStep(stepId).length === 0) {
					stepContainer.removeElement(stepId);
				}
			});
		}
		/**
		 * Change the ordering by moving one category step assignment in the ordering before another category step assignments.
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#moveCategoryStepAssignmentBefore
		 * @param {string} beforeStepId
		 * @param {string} movedStepId
		 * @returns {number|null} WHEN either Id is not contained or undefined THEN return null.
		 *	  Otherwise return the index of the index position of movedStepId, after the move.
		 */
		this.moveCategoryStepAssignmentBefore = function(categoryId, beforeStepId, movedStepId) {
			var categoryStepAssignment = categoryStepAssignmentContainer.getElement(categoryId);
			if (!categoryStepAssignment) {
				return null;
			}
			return categoryStepAssignment.moveBefore(beforeStepId, movedStepId);
		};
		/**
		 * Change the ordering of category step assignments by moving one category step assignment in the ordering to the end.
		 * The move only happens within the steps for a given category
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#moveCategoryStepAssignmentToEnd
		 * @param {string} categoryId
		 * @param {string} stepId
		 * @returns {number|null} WHEN the category step assignment is not contained or undefined THEN return null.
		 *	  Otherwise return the index of the index position of the stepId for the given categoryId, after the move.
		 */
		this.moveCategoryStepAssignmentToEnd = function(categoryId, stepId) {
			var categoryStepAssignment = categoryStepAssignmentContainer.getElement(categoryId);
			if (!categoryStepAssignment) {
				return null;
			}
			return categoryStepAssignment.moveToEnd(stepId);
		};
		/**
		 * Move a category step assignment up or down some places specified by distance
		 * The move only happens within the steps for a given category
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#moveCategoryStepAssignmentUpOrDown
		* @param {string} categoryId
		 * @param {string} stepId
		 * @param {number} distance number of places
		 */
		this.moveCategoryStepAssignmentUpOrDown = function(categoryId, stepId, distance) {
			var categoryStepAssignment = categoryStepAssignmentContainer.getElement(categoryId);
			if (!categoryStepAssignment) {
				return null;
			}
			return categoryStepAssignment.moveUpOrDown(stepId, distance);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getCategory
		 * @description Get an existing category
		 * @param {String} id Category identifier
		 * @returns {object|undefined} Returns the category object for the ID or undefined for a not existing category
		 */
		this.getCategory = categoryContainer.getElement;
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#setCategory
		 * @description Create a new or update an existing category. A new category object assigns a member "id" with its id.
		 * @param {object} category
		 * @param {string} [category.labelKey] Text key for the category
		 * @param {String} [categoryId] Category identifier. If parameter is omitted, then the function has the meaning of create, otherwise update.
		 * @returns{String} Returns the id of a newly created or updated category
		 */
		this.setCategory = function(category, categoryId) {
			isSaved = false;
			return categoryContainer.setElement(category, categoryId);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#createCategoryWithId
		 * @description Create a new category and set its given Id.
		 * @param {object} category
		 * @param {string} category.labelKey Text key for the category
		 * @param {String} categoryId Category identifier.
		 * @returns{String} Returns the given id.
		 */
		this.createCategoryWithId = function(category, categoryId) {
			isSaved = false;
			return categoryContainer.createElementWithProposedId(category, categoryId).getId();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#removeCategory
		 * @description Remove an existing category and its corresponding steps which are not assigned to other categories.
		 * @param {String} categoryId - Category identifier.
		 */
		this.removeCategory = function(categoryId) {
			var steps = that.getCategoryStepAssignments(categoryId);
			if (steps) {
				steps.forEach(function(stepId) {
					var categories = that.getCategoriesForStep(stepId);
					if (!categories || categories.length < 2) {
						stepContainer.removeElement(stepId);
					}
				});
			}
			categoryContainer.removeElement(categoryId);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getCategories
		 * @description Get all existing categories.
		 * @returns {Object[]}
		 */
		this.getCategories = categoryContainer.getElements;
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#copyCategory
		 * @function
		 * @param {String} categoryId - Category identifier
		 * @description Copy a category.
		 * @returns {String} - New category id or undefined for not existing category
		 */
		this.copyCategory = function(categoryId) {
			var newCategoryId = categoryContainer.copyElement(categoryId);
			if (!newCategoryId) {
				return;
			}
			that.getCategoryStepAssignments(categoryId).forEach(function(stepId) {
				_copyStep(stepId, newCategoryId);
			});
			return newCategoryId;
		};
		/**
		 * Change the ordering by moving one category in the ordering before another category.
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#moveCategoryBefore
		 * @param {string} beforeCategoryId
		 * @param {string} movedCategoryId
		 * @returns {number|null} WHEN either Id is not contained or undefined THEN return null.
		 *	  Otherwise return the index of the index position of movedCategoryId, after the move.
		 */
		this.moveCategoryBefore = function(beforeCategoryId, movedCategoryId) {
			return categoryContainer.moveBefore(beforeCategoryId, movedCategoryId);
		};
		/**
		 * Change the ordering of categories by moving one category in the ordering to the end.
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#moveCategoryToEnd
		 * @param {string} categoryId
		 * @returns {number|null} WHEN the key categoryId is not contained or undefined THEN return null.
		 *	  Otherwise return the index of the index position of category(Id), after the move.
		 */
		this.moveCategoryToEnd = function(categoryId) {
			return categoryContainer.moveToEnd(categoryId);
		};
		/**
		 * Move a category up or down some places specified by distance
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#moveCategoryUpOrDown
		 * @param {string} categoryId id of the category, that shall be moved
		 * @param {number} distance number of places
		 */
		this.moveCategoryUpOrDown = function(categoryId, distance) {
			return categoryContainer.moveUpOrDown(categoryId, distance);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#serialize
		 * @description Get a serializable object for the configuration
		 * @returns{Object}
		 */
		this.serialize = function() {
			return configurationObjects.serializeConfiguration(that);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#isSaved
		 * @description Returns "false" if the configuration has unsaved changes, else "true"
		 * @returns{Boolean}
		 */
		this.isSaved = function() {
			return isSaved;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#setIsUnsaved
		 * @description Sets the ConfigurationEditor to an unsaved state, such that isSaved()===false.
		 * This method shall be called by the UI whenever it edited some configuration sub-entity, e.g. the entitySet of a request.
		 */
		this.setIsUnsaved = function() {
			isSaved = false;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#save
		 * @description Saves or modifies a configuration on database and replaces the temporary configuration id with a server generated one
		 * @param {function(response, metadata, messageObject)} callback Callback returns after create/update operation has been executed
		 * @param {string} callback.response ID of the saved/modified configuration
		 * @param {string} callback.metadata Metadata
		 * @param {sap.apf.core.MessageObject} callback.messageObject Identifier of corrupt process flow
		 *
		 */
		this.save = function(callback) {
			var analyticalConfigurationName;
			function callbackCreate(response, metadata, messageObject) {
				if (!messageObject) {
					isSaved = true;
					configurationHandler.replaceConfigurationId(configuration.id || configuration, response.AnalyticalConfiguration);
					configurationHandler.updateConfigurationName(configuration.id || configuration, analyticalConfigurationName);
					configuration = response.AnalyticalConfiguration;
				}
				callback(configuration, metadata, messageObject);
			}
			function callbackUpdate(metadata, messageObject) {
				if (!messageObject) {
					isSaved = true;
				}
				configurationHandler.updateConfigurationName(configuration.id || configuration, analyticalConfigurationName);
				callback(configuration.id || configuration, metadata, messageObject);
			}
			analyticalConfigurationName = configurationHandler.getConfiguration(configuration.id || configuration).AnalyticalConfigurationName;
			var config = {
				AnalyticalConfiguration : "",
				AnalyticalConfigurationName : analyticalConfigurationName,
				Application : configurationHandler.getApplicationId(),
				SerializedAnalyticalConfiguration : JSON.stringify(this.serialize()),
				//TODO: Workaround for MockServer: the following properties need to be added at least as an empty string for every configuration. 
				//If not, these properties are not available in the result data set of the MockServer and OData requests containing one of the 
				//these select properties ($select) below will fail. 
				//Assumption: these properties are set on server side in "exits". Holds for PUT and POST. 
				CreatedByUser : "",
				CreationUTCDateTime : null,
				LastChangeUTCDateTime : null,
				LastChangedByUser : ""
			};
			if (typeof configuration === 'string') {
				if (configuration.indexOf("apf1972-") === 0) {
					//noinspection JSCheckFunctionSignatures
					persistenceProxy.create("configuration", config, callbackCreate);
				} else {
					config.AnalyticalConfiguration = configuration;
					persistenceProxy.update("configuration", config, callbackUpdate, [ {
						name : "AnalyticalConfiguration",
						value : configuration
					} ]);
				}
			} else {
				if (configuration.id.indexOf("apf1972-") === 0) {
					config.AnalyticalConfiguration = "";
					config.CreationUTCDateTime = null;
					config.LastChangeUTCDateTime = null;
				} else {
					config.AnalyticalConfiguration = configuration.id;
					config.CreationUTCDateTime = configuration.creationDate;
					config.LastChangeUTCDateTime = configuration.lastChangeDate;
				}
				if (configuration.updateExisting) {
					persistenceProxy.update("configuration", config, callbackUpdate, [ {
						name : "AnalyticalConfiguration",
						value : configuration.id
					} ]);
				} else {
					persistenceProxy.create("configuration", config, callbackCreate);
				}
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getFilterOption
		 * @description Returns the currently selected filter option
		 * @returns {object} Object with property name 'smartFilterBar', 'facetFilter' or 'none' assigned to boolean 'true'
		 */
		this.getFilterOption = function() {
			return jQuery.sap.extend({}, filterOption);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#setFilterOption
		 * @description Sets the filter option and removes any maintained filter configuration of the previous filter option if exists.
		 * @param {object} Expects object with either property 'smartFilterBar', 'facetFilter' or 'none' assigned to boolean 'true'
		 */
		this.setFilterOption = function(option) {
			if (option.none === true) {
				smartFilterBar = null;
				removeFacetFilters.call(this);
				setOptionToNone();
			}
			if (option.smartFilterBar === true) {
				removeFacetFilters.call(this);
				setOptionToSmartFilterBar();
			}
			if (option.facetFilter === true) {
				smartFilterBar = null;
				setOptionToFacetFilter();
			}
			function removeFacetFilters() {
				this.getFacetFilters().forEach(function(facetFilter) {
					this.removeFacetFilter(facetFilter.getId());
				}.bind(this));
			}
			function setOptionToNone() {
				delete filterOption.smartFilterBar;
				delete filterOption.facetFilter;
				filterOption.none = true;
			}
			function setOptionToSmartFilterBar() {
				filterOption.smartFilterBar = true;
				delete filterOption.facetFilter;
				delete filterOption.none;
			}
			function setOptionToFacetFilter() {
				delete filterOption.smartFilterBar;
				filterOption.facetFilter = true;
				delete filterOption.none;
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#isDataLostByFilterOptionChange
		 * @description Checks if any filter configuration is maintained for the current filter option that might be lost by switching to another filter option.
		 * @returns {boolean} 'false' if no potential data loss by changing the filter option is detected. 'true' if potential data loss is detected.
		 */
		this.isDataLostByFilterOptionChange = function() {
			if (filterOption.smartFilterBar === true) {
				if (smartFilterBar && (smartFilterBar.getService() || smartFilterBar.getEntitySet())) {
					return true;
				}
			}
			if (filterOption.facetFilter === true) {
				if (facetFilterContainer.getElements().length > 0) {
					return true;
				}
			}
			return false;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#getSmartFilterBar
		 * @description Returns the smart filter bar instance if the filter option is set to smart filter bar.
		 * @returns {sap.apf.modeler.core.SmartFilterBar|null} Instance of smart filter bar or null if another filter option is set.
		 */
		this.getSmartFilterBar = function() {
			if (filterOption.smartFilterBar === true) {
				if (!smartFilterBar) {
					smartFilterBar = new inject.constructors.SmartFilterBar("SmartFilterBar-1");
				}
				return smartFilterBar;
			}
			return null;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#createFacetFilterWithId
		 * @description Create an empty facet filter managed by this editor if the filter option is set to facet filter.
		 * @param {string} facetFilterId Given Id used to identify the facet filter.
		 * @returns {String|null} facetFilterId or null
		 */
		this.createFacetFilterWithId = function(facetFilterId) {
			if (filterOption.facetFilter === true) {
				return facetFilterContainer.createElementWithProposedId(undefined, facetFilterId).getId();
			}
			return null;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#createFacetFilter
		 * @description Create an empty facet filter managed by this editor if the filter option is set to facet filter.
		 * @returns {String|null} facetFilterId or null
		 */
		this.createFacetFilter = function() {
			if (filterOption.facetFilter === true) {
				return facetFilterContainer.createElement().getId();
			}
			return null;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#removeFacetFilter
		 * @function
		 * @description Remove an existing facet filter.
		 * @param {String} id
		 */
		this.removeFacetFilter = facetFilterContainer.removeElement;
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#getFacetFilter
		 * @function
		 * @param {String} facetFilterId
		 * @returns {sap.apf.modeler.core.FacetFilter}
		 */
		this.getFacetFilter = facetFilterContainer.getElement;
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#getFacetFilters
		 * @function
		 * @description Get all existing facet filter.
		 * @returns {sap.apf.modeler.core.FacetFilter[]} {@link sap.apf.modeler.core.FacetFilter}
		 */
		this.getFacetFilters = facetFilterContainer.getElements;
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#copyFacetFilter
		 * @function
		 * @param {String} facetFilterId
		 * @description Copy a facet filter.
		 * @returns {String} - New facet filter id or undefined for not existing facet filter
		 */
		this.copyFacetFilter = facetFilterContainer.copyElement;
		/**
		 * Change the ordering by moving one facet filter in the ordering before another facet filter.
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#moveFacetFilterBefore
		 * @param {string} beforeFacetFilterId
		 * @param {string} movedFacetFilterId
		 * @returns {number|null} WHEN either Id is not contained or undefined THEN return null.
		 *	  Otherwise return the index of the index position of movedFacetFilterId, after the move.
		 */
		this.moveFacetFilterBefore = function(beforeFacetFilterId, movedFacetFilterId) {
			return facetFilterContainer.moveBefore(beforeFacetFilterId, movedFacetFilterId);
		};
		/**
		 * Change the ordering of facet filters by moving one facet filter in the ordering to the end.
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#moveFacetFilterToEnd
		 * @param {string} facetFilterId
		 * @returns {number|null} WHEN the key facetFilterId is not contained or undefined THEN return null.
		 *	  Otherwise return the index of the index position of facetFilter(Id), after the move.
		 */
		this.moveFacetFilterToEnd = function(facetFilterId) {
			return facetFilterContainer.moveToEnd(facetFilterId);
		};
		/**
		 * Move a facet filter up or down some places specified by distance
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#moveFacetFilterUpOrDown
		 * @param {string} facetFilterId id of the facetFilter, that shall be moved
		 * @param {number} distance number of places
		 */
		this.moveFacetFilterUpOrDown = function(facetFilterId, distance) {
			return facetFilterContainer.moveUpOrDown(facetFilterId, distance);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#createNavigationTargetWithId
		 * @description Create an empty navigation target managed by this editor.
		 * @param {string} navigationTargetId - Given Id used to identify the navigation target.
		 * @returns {String} - navigationTargetId
		 */
		this.createNavigationTargetWithId = function(navigationTargetId) {
			return navigationTargetContainer.createElementWithProposedId(undefined, navigationTargetId).getId();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#createNavigationTarget
		 * @description Create an empty navigation target managed by this editor.
		 * @returns {String} - navigationTargetId
		 */
		this.createNavigationTarget = function() {
			return navigationTargetContainer.createElement().getId();
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#removeNavigationTarget
		 * @function
		 * @description Remove an existing navigation target.
		 * @param {String} id
		 */
		this.removeNavigationTarget = navigationTargetContainer.removeElement;
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#getNavigationTarget
		 * @function
		 * @param {String} navigationTargetId
		 * @returns {sap.apf.modeler.core.NavigationTarget}
		 */
		this.getNavigationTarget = navigationTargetContainer.getElement;
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#getNavigationTargets
		 * @function
		 * @description Get all existing navigation targets
		 * @returns {sap.apf.modeler.core.NavigationTarget[]} {@link sap.apf.modeler.core.NavigationTarget}
		 */
		this.getNavigationTargets = navigationTargetContainer.getElements;
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#copyNavigationTarget
		 * @function
		 * @param {String} navigationTargetId
		 * @description Copy a navigation target.
		 * @returns {String} - New navigation target id or undefined for not existing navigation target
		 */
		this.copyNavigationTarget = navigationTargetContainer.copyElement;
		/**
		 * Change the ordering by moving one navigation target in the ordering before another navigation target.
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#moveNavigationTargetBefore
		 * @param {string} beforeNavigationTargetId
		 * @param {string} movedNavigationTargetId
		 * @returns {number|null} WHEN either Id is not contained or undefined THEN return null.
		 *	  Otherwise return the index of the index position of movedNavigationTargetId, after the move.
		 */
		this.moveNavigationTargetBefore = function(beforeNavigationTargetId, movedNavigationTargetId) {
			return navigationTargetContainer.moveBefore(beforeNavigationTargetId, movedNavigationTargetId);
		};
		/**
		 * Change the ordering of navigation targets by moving one navigation target in the ordering to the end.
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#moveNavigationTargetToEnd
		 * @param {string} navigationTargetId
		 * @returns {number|null} WHEN the key navigationTargetId is not contained or undefined THEN return null.
		 *	  Otherwise return the index of the index position of navigationTarget(Id), after the move.
		 */
		this.moveNavigationTargetToEnd = function(navigationTargetId) {
			return navigationTargetContainer.moveToEnd(navigationTargetId);
		};
		/**
		 * Move a navigation target up or down some places specified by distance
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#moveNavigationTargetUpOrDown
		 * @param {string} navigationTargetId id of the navigationTarget, that shall be moved
		 * @param {number} distance number of places
		 */
		this.moveNavigationTargetUpOrDown = function(navigationTargetId, distance) {
			return navigationTargetContainer.moveUpOrDown(navigationTargetId, distance);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#createStepWithId
		 * @description Create an empty step managed by this editor.
		 * @param {string} stepId - Given Id used to identify the step.
		 * @returns {String} - stepId 
		 */
		this.createStepWithId = function(stepId) {
			return stepContainer.createElementWithProposedId(undefined, stepId).getId();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#createStep
		 * @description Create an empty step managed by this editor.
		 * @param {string} categoryId - Given categoryId the step shall be assigned to
		 * @returns {String|undefined} - stepId or undefined if the category does not exist
		 */
		this.createStep = function(categoryId) {
			if (!this.getCategory(categoryId)) {
				return;
			}
			var stepId = stepContainer.createElement().getId();
			this.addCategoryStepAssignment(categoryId, stepId);
			return stepId;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#createHierarchicalStepWithId
		 * @description Create an empty step managed by this editor.
		 * @param {string} stepId - Given Id used to identify the step.
		 * @returns {String} - stepId 
		 */
		this.createHierarchicalStepWithId = function(stepId) {
			return stepContainer.createElementWithProposedId(undefined, stepId, inject.constructors.HierarchicalStep).getId();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationEditor#createHierarchicalStep
		 * @description Create an empty hierarchical step managed by this editor.
		 * @param {string} categoryId - Given categoryId the step shall be assigned to
		 * @returns {String|undefined} - stepId or undefined if the category does not exist
		 */
		this.createHierarchicalStep = function(categoryId) {
			if (!this.getCategory(categoryId)) {
				return;
			}
			var stepId = stepContainer.createElement(undefined, inject.constructors.HierarchicalStep).getId();
			this.addCategoryStepAssignment(categoryId, stepId);
			return stepId;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#getStep
		 * @function
		 * @param {String} stepId
		 * @returns {sap.apf.modeler.core.Step}
		 */
		this.getStep = stepContainer.getElement;
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#getSteps
		 * @function
		 * @description Get all existing steps.
		 * @returns {sap.apf.modeler.core.Step[]} {@link sap.apf.modeler.core.Step}
		 */
		this.getSteps = stepContainer.getElements;
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#getStepsNotAssignedToCategory
		 * @function
		 * @description Returns all step ids which are not assigned to the given category ID.
		 * @param {String} categoryId
		 * @returns {String[]} - Step IDs
		 */
		this.getStepsNotAssignedToCategory = function(categoryId) {
			var assignedSteps = this.getCategoryStepAssignments(categoryId);
			var unassignedSteps = [];
			that.getSteps().forEach(function(step) {
				var stepId = step.getId();
				if (assignedSteps.indexOf(stepId) === -1) {
					unassignedSteps.push(stepId);
				}
			});
			return unassignedSteps;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#copyStep
		 * @function
		 * @param {String} stepId - Step identifier
		 * @description Copy a step.
		 * @returns {String} - New step id or false in case of error
		 */
		this.copyStep = function(stepId) {
			var newStepId = _copyStep(stepId);
			var categories = this.getCategoriesForStep(stepId);
			if (!newStepId) {
				return false;
			}
			if (categories) {
				categories.forEach(function(categoryId) {
					that.addCategoryStepAssignment(categoryId, newStepId);
				});
			}
			return newStepId;
		};
		function _copyStep(stepId, categoryIdForNewStep) {
			if (categoryIdForNewStep && !that.getCategory(categoryIdForNewStep)) {
				return false;
			}
			var newStepId = stepContainer.copyElement(stepId);
			if (!newStepId) {
				return false;
			}
			if (categoryIdForNewStep) {
				that.addCategoryStepAssignment(categoryIdForNewStep, newStepId);
			}
			return newStepId;
		}
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#getCategoriesForStep
		 * @function
		 * @param {String} stepId - Step identifier
		 * @description Get all categories the step is assigned to
		 * @returns {array} - Array of category Ids 
		 */
		this.getCategoriesForStep = function getCategoriesForStep(stepId) {
			var result = [];
			var categories = that.getCategories();
			if (categories) {
				categories.forEach(function(category) {
					var categoryId = category.getId();
					var steps = that.getCategoryStepAssignments(categoryId);
					if (steps && steps.indexOf(stepId) > -1) {
						result.push(categoryId);
					}
				});
			}
			return result;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#getAssignableStepsForNavigationTarget
		 * @function
		 * @param {String} navigationTargetId - Navigation target identifier
		 * @description Get all steps that can be assigned to the given navigation target
		 * @returns {array} - Array of step Ids 
		 */
		this.getAssignableStepsForNavigationTarget = function(navigationTargetId) {
			var result = [];
			that.getSteps().forEach(function(step) {
				var found = false;
				step.getNavigationTargets().forEach(function(navTarId) {
					if (navigationTargetId === navTarId) {
						found = true;
					}
				});
				if (!found) {
					result.push(step.getId());
				}
			});
			return result;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#getStepsAssignedToNavigationTarget
		 * @function
		 * @param {String} navigationTargetId - Navigation target identifier
		 * @description Get all steps that are assigned to the given navigation target
		 * @returns {array} - Array of step Ids 
		 */
		this.getStepsAssignedToNavigationTarget = function(navigationTargetId) {
			var result = [];
			that.getSteps().forEach(function(step) {
				var found = false;
				step.getNavigationTargets().forEach(function(navTarId) {
					if (navigationTargetId === navTarId) {
						found = true;
					}
				});
				if (found) {
					result.push(step.getId());
				}
			});
			return result;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.ConfigurationEditor#copy
		 * @function
		 * @description Execute a deep copy of the configuration editor and its referenced objects
		 * @param {String} newConfigurationId - New configuration id for the copied instance
		 * @returns {Object} sap.apf.modeler.core.ConfigurationEditor# - New configuration editor being a copy of this object
		 */
		this.copy = function(newConfigurationId) {
			var dataForCopy = {
				stepContainer : stepContainer,
				categoryContainer : categoryContainer,
				facetFilterContainer : facetFilterContainer,
				navigationTargetContainer : navigationTargetContainer,
				categoryStepAssignmentContainer : categoryStepAssignmentContainer,
				applicationTitle : applicationTitle,
				serviceList : serviceList,
				filterOption : filterOption
			};
			var dataFromCopy = sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(dataForCopy);
			if (filterOption.smartFilterBar === true && smartFilterBar) {
				dataFromCopy.smartFilterBar = cloneSmartFilterBar();
			}
			return new sap.apf.modeler.core.ConfigurationEditor(newConfigurationId, inject, undefined, dataFromCopy);
			function cloneSmartFilterBar() {
				var clone = new inject.constructors.SmartFilterBar(smartFilterBar.getId());
				clone.setService(smartFilterBar.getService());
				clone.setEntitySet(smartFilterBar.getEntitySet(), !smartFilterBar.isEntityTypeConverted());
				return clone;
			}
		};
		if (typeof configuration === 'string') {
			if (configuration.indexOf("apf1972-") === 0) { // temporary id means new unsaved config
				isSaved = false;
				if (callbackAfterLoad) {
					callbackAfterLoad(that, undefined);
				}
			} else if (!dataFromCopy) {
				loadConfigurationFromServer(configuration, persistenceProxy, function(result, messageObject) {
					if (!messageObject) {
						var serializedAnalyticalConfiguration = JSON.parse(result.SerializedAnalyticalConfiguration);
						that.setApplicationTitle(serializedAnalyticalConfiguration.applicationTitle);
						configurationFactory.loadConfig(serializedAnalyticalConfiguration);
						configurationObjects.mapToDesignTimeAsPromise(configurationFactory.getRegistry(), that).done(function(){
							isSaved = true;
							callbackAfterLoad(that, undefined);
						});
					} else {
						callbackAfterLoad(undefined, messageObject);
					}
				});
			}
		} else {
			configurationFactory.loadConfig(configuration.content);
			configurationObjects.mapToDesignTimeAsPromise(configurationFactory.getRegistry(), this).done(function(){
				if (callbackAfterLoad) {
					callbackAfterLoad(that, undefined);
				}
			});	
		}
		function loadConfigurationFromServer(configId, persistProxy, callbackAfterLoad) {
			persistProxy.readEntity("configuration", function(result, metadata, messageObject) {
				callbackAfterLoad(result, messageObject);
			}, [ {
				name : "AnalyticalConfiguration",
				value : configId
			} ], undefined, configurationHandler.getApplicationId());
		}
	};
}());
