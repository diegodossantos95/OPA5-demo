/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare("sap.apf.modeler.core.configurationObjects");
(function() {
	'use strict';
	/**
	 * @private
	 * @name sap.apf.modeler.core.ConfigurationObjects
	 * @class Defines the schema of configuration objects, their validation, their serialization in the modeler.
	 * De-serialization is in a different class which share the deserialize method with the run-time.
	 * @param {Object} inject - Injection of required APF object references, constructors and functions.
	 * @param {sap.apf.core.utils.MessageHandler} inject.instances.messageHandler MessageHandler instance
	 * @param {sap.apf.modeler.core.TextPool} inject.instances.textPool- TextPool instance
	 * @param {Object} inject.constructor Injected constructors
	 * @param {sap.apf.core.utils.Hashtable} inject.constructors.Hashtable Hashtable constructor
	 * @param {sap.apf.core.utils.TextPool} inject.instances.textPool textPool instance
	 * @param {sap.apf.core.utils.OdataProxy} inject.instances.persistenceProxy persistenceProxy instance 
	 * @param {sap.apf.core.messageHandler} inject.instances.messageHandler messageHandler instance  
	 * @constructor
	 */
	sap.apf.modeler.core.ConfigurationObjects = function(inject) {
		/* @type {sap.apf.modeler.core.ConfigurationObjects} */
		var that = this;
		var Hashtable, textPool, persistenceProxy, messageHandler;
		var metadataFactory = inject.instances.metadataFactory;
		if (inject.constructors && inject.constructors.Hashtable) {
			Hashtable = inject.constructors.Hashtable;
		} 
		if (inject.instances.textPool) {
			textPool = inject.instances.textPool;
		}
		if (inject.instances.persistenceProxy) {
			persistenceProxy = inject.instances.persistenceProxy;
		}
		if (inject.instances.messageHandler) {
			messageHandler = inject.instances.messageHandler;
		}
		function complain(messageNumber, parameter) {
			var aParams = [];
			if (parameter) {
				aParams.push(parameter);
			}
			messageHandler.putMessage(messageHandler.createMessageObject({
				code : messageNumber,
				aParameters : aParams
			}));
		}
		function isValidLabel(label) {
			var result = label && label.type && label.type === "label" && label.kind && label.kind === "text" && label.key && typeof label.key === "string";
			if (!result) {
				complain(11030, label.key);
			}
			return result;
		}
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#serializeLabel
		 * @param {string} textKey
		 * @returns {object}
		 */
		this.serializeLabelKey = function(textKey) {
			return {
				type : "label",
				kind : "text",
				key : textPool.getPersistentKey(textKey)
			};
		};
		/**
		 * @private
		 * @function
		 * @description Parameter configObject will be enhanced by a thumbnail attribute with the following structure
		 *              {type: string, leftUpper: Object, leftLower: Object, rightUpper: Object, rightLower: Object}}
		 * @name sap.apf.modeler.core.ConfigurationObjects#serializeAndAddThumbnail
		 * @param {sap.apf.modeler.core.Step|sap.apf.modeler.core.Representation} modelerObject
		 * @param {Object} configObject Will be enhanced by a new attribute "thumbnail"
		 */
		this.serializeAndAddThumbnail = function(modelerObject, configObject) {
			var leftLower = modelerObject.getLeftLowerCornerTextKey();
			var leftUpper = modelerObject.getLeftUpperCornerTextKey();
			var rightUpper = modelerObject.getRightUpperCornerTextKey();
			var rightLower = modelerObject.getRightLowerCornerTextKey();
			var thumbnail = {
				type : "thumbnail"
			};
			if (leftUpper) {
				thumbnail.leftUpper = this.serializeLabelKey(leftUpper);
			}
			if (leftLower) {
				thumbnail.leftLower = this.serializeLabelKey(leftLower);
			}
			if (rightUpper) {
				thumbnail.rightUpper = this.serializeLabelKey(rightUpper);
			}
			if (rightLower) {
				thumbnail.rightLower = this.serializeLabelKey(rightLower);
			}
			if (thumbnail.leftLower || thumbnail.leftUpper || thumbnail.rightLower || thumbnail.rightUpper) {
				configObject.thumbnail = thumbnail;
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#serializeCategory
		 * @param {object} category
		 * @param {array} steps
		 * @returns {object}
		 */
		this.serializeCategory = function(category, steps) {
			var TextElement = textPool.get(category.labelKey);
			var stepObjects = [];
			if (steps) {
				steps.forEach(function(stepId) {
					stepObjects.push({
						type : "step",
						id : stepId
					});
				});
			}
			var description = (TextElement && TextElement.TextElementDescription) || "";
			return {
				type : "category",
				description : description,
				id : category.getId(),
				label : that.serializeLabelKey(category.labelKey),
				steps : stepObjects
			};
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#validateCategory
		 * @description Return true if the category configuration object is valid.
		 * @param {object} category
		 * @returns {boolean}
		 */
		this.validateCategory = function(category) {
			var result = category && category.type && category.type === "category" && category.id && category.steps && isValidLabel(category.label);
			if (result) {
				category.steps.forEach(function(object) {
					if (!object.type || object.type !== "step" || !object.id) {
						result = false;
					}
				});
			}
			if (!result) {
				complain(11031, category.id);
			}
			return result;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#validateRequest
		 * @description Return true if the request configuration object is valid.
		 * @param {object} request
		 * @returns {boolean}
		 */
		this.validateRequest = function(request) {
			var result = request && request.id && // id
			request.type === "request" && request.service && typeof request.service === "string" && ((request.entityType && typeof request.entityType === "string") || (request.entitySet && typeof request.entitySet === "string"))
					&& request.selectProperties && // id
					request.selectProperties && request.selectProperties instanceof Array && request.selectProperties.length >= 0;
			if (!result) {
				complain(11032, request.id);
			}
			return result;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#validateBinding
		 * @description Return true if the binding configuration object is valid.
		 * @param {object} binding
		 * @returns {boolean}
		 */
		this.validateBinding = function(binding) {
			var result = binding && binding.id && binding.type === "binding" && binding.requiredFilters && binding.requiredFilters instanceof Array && binding.requiredFilters.length >= 0 && binding.representations
					&& binding.representations instanceof Array;
			if (!result) {
				complain(11033, binding.id);
			}
			return result;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#validateFacetFilter
		 * @description Return true if the facetFilter configuration object is valid.
		 *      Note, the validated object structurally corresponds to the result of serializing an object of type sap.apf.modeler.core.FacetFilter.
		 * @param {object} facetFilter
		 * @returns {boolean}
		 */
		this.validateFacetFilter = function(facetFilter) {
			var result = facetFilter && facetFilter.id && // id
			facetFilter.property && facetFilter.type === "facetFilter";
			if (!result) {
				complain(11034, facetFilter.id);
			}
			return result;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#validateNavigationTarget
		 * @description Return true if the navigationTarget configuration object is valid.
		 *      Note, the validated object structurally corresponds to the result of serializing an object of type sap.apf.modeler.core.NavigationTarget.
		 * @param {object} navigationTarget
		 * @returns {boolean}
		 */
		this.validateNavigationTarget = function(navigationTarget) {
			var result = navigationTarget && navigationTarget.id && // id
			navigationTarget.semanticObject && navigationTarget.action && navigationTarget.type === "navigationTarget" && navigationTarget.hasOwnProperty("isStepSpecific");
			if (!result) {
				complain(11040, navigationTarget.id);
			}
			return result;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#validateStep
		 * @description Return true if the step configuration object is valid.
		 *      Note, the validated object structurally corresponds to the result of serializing an object of type sap.apf.modeler.core.Step.
		 * @param {object} step
		 * @returns {boolean}
		 */
		this.validateStep = function(step) {
			var result = step && step.id && // id
			step.type === "step" && isValidLabel(step.title) && isValidLabel(step.longTitle) && step.hasOwnProperty("navigationTargets");
			if (!result) {
				complain(11035, step.id);
			}
			return result;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#validateConfiguration
		 * @description Return true if the configuration object is valid.
		 * @param {object} configuration
		 * @returns {boolean}
		 */
		this.validateConfiguration = function(configuration) {
			var result = configuration && configuration.applicationTitle && configuration.applicationTitle.key && typeof configuration.applicationTitle.key === 'string' && configuration.steps && configuration.steps instanceof Array
					&& configuration.steps.length >= 0 && configuration.requests && configuration.requests instanceof Array && configuration.requests.length >= 0 && configuration.bindings && configuration.bindings instanceof Array
					&& configuration.bindings.length >= 0 && configuration.representationTypes && configuration.representationTypes instanceof Array && configuration.representationTypes.length >= 0
					&& configuration.categories && configuration.categories instanceof Array && configuration.categories.length >= 0;
			if (!result) {
				complain(11036);
			}
			return result;
		};
		function serializeRepresentations(step) {
			var representationValues = [];
			var dimensionValues, dimensions;
			var measureValues, measures;
			var propertyValues;
			var orderbyValues;
			var configurationObject;
			var topN;
			var representations = step.getRepresentations();
			representations.forEach(function(representation) {
				dimensionValues = [];
				dimensions = representation.getDimensions();
				dimensions.forEach(function(dimension) {
					var dimensionValue = {
						fieldName : dimension
					};
					if (representation.getDimensionKind(dimension)) {
						dimensionValue.kind = representation.getDimensionKind(dimension);
					}
					if (representation.getDimensionTextLabelKey(dimension)) {
						dimensionValue.fieldDesc = {
							type : 'label',
							kind : 'text',
							key : representation.getDimensionTextLabelKey(dimension)
						};
					}
					if (representation.getLabelDisplayOption(dimension)){
						dimensionValue.labelDisplayOption = representation.getLabelDisplayOption(dimension);
					}
					dimensionValues.push(dimensionValue);
				});
				measureValues = [];
				measures = representation.getMeasures();
				measures.forEach(function(measure) {
					var measureValue = {
						fieldName : measure
					};
					if (representation.getMeasureKind(measure)) {
						measureValue.kind = representation.getMeasureKind(measure);
					}
					if (representation.getMeasureTextLabelKey(measure)) {
						measureValue.fieldDesc = {
							type : 'label',
							kind : 'text',
							key : representation.getMeasureTextLabelKey(measure)
						};
					}
					measureValues.push(measureValue);
				});
				propertyValues = [];
				representation.getProperties().forEach(function(propertyName) {
					var propertyValue = {
							fieldName: propertyName
					};
					if (representation.getPropertyKind(propertyName)) {
						propertyValue.kind = representation.getPropertyKind(propertyName);
					}
					if (representation.getPropertyTextLabelKey(propertyName)) {
						propertyValue.fieldDesc = {
							type : 'label',
							kind : 'text',
							key : representation.getPropertyTextLabelKey(propertyName)
						};
					}
					propertyValues.push(propertyValue);
				});
				var hierarchicalProperty = [{}];
				if(representation.getHierarchyProperty()){
					hierarchicalProperty[0].fieldName = representation.getHierarchyProperty();
					hierarchicalProperty[0].kind = "hierarchicalColumn";
					if (representation.getHierarchyPropertyTextLabelKey()) {
						hierarchicalProperty[0].fieldDesc = {
							type : 'label',
							kind : 'text',
							key : representation.getHierarchyPropertyTextLabelKey()
						};
					}
					hierarchicalProperty[0].labelDisplayOption = representation.getHierarchyPropertyLabelDisplayOption();
				}
				orderbyValues = [];
				representation.getOrderbySpecifications().forEach(function(spec) {
					orderbyValues.push({
						property : spec.property,
						ascending : spec.ascending
					});
				});
				configurationObject = {
					id : representation.getId(),
					representationTypeId : representation.getRepresentationType(),
					parameter : {
						dimensions : dimensionValues,
						measures : measureValues,
						properties : propertyValues,
						hierarchicalProperty : hierarchicalProperty,
						alternateRepresentationTypeId : representation.getAlternateRepresentationType()
					}
				};
				if (representation.getWidthProperties()) { // optional
					configurationObject.parameter.width = representation.getWidthProperties();
				}
				if (orderbyValues.length > 0) {
					configurationObject.parameter.orderby = orderbyValues;
				}
				topN = representation.getTopN();
				if (topN && topN > 0) {
					configurationObject.parameter.top = topN;
				}
				that.serializeAndAddThumbnail(representation, configurationObject);
				representationValues.push(configurationObject);
			});
			return representationValues;
		}
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#serializeBinding
		 * @param {sap.apf.modeler.core.Step} step
		 * @param {object} containers - Hashes for generated objects like request, binding, etc.
		 * @param {sap.apf.modeler.core.ElementContainer} containers.bindingIdHash - Generator for Id's of type binding.
		 * @param {object[]} containers.bindings - binding list of configuration
		 * @returns {String} - The Id.
		 */
		this.serializeBinding = function(step, containers) {
			var bindingId = "binding-for-" + step.getId();
			var TextElement = textPool.get(step.getTitleId());
			var stepDescription = (TextElement && TextElement.TextElementDescription) || "";
			if(step.getFilterPropertyLabelKey() || step.getFilterPropertyLabelDisplayOption()){
				var requiredFilterOptions = {
						labelDisplayOption : step.getFilterPropertyLabelDisplayOption()
				};
				if(step.getFilterPropertyLabelKey()){
					requiredFilterOptions.fieldDesc = this.serializeLabelKey(step.getFilterPropertyLabelKey());
				}
			}
			containers.bindings.push({
				type : "binding",
				id : bindingId,
				stepDescription : stepDescription,
				requiredFilters : step.getFilterProperties(),
				requiredFilterOptions : requiredFilterOptions,
				representations : serializeRepresentations(step)
			});
			return bindingId;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#serializeRequest
		 * @param {sap.apf.modeler.core.Step} step
		 * @param {object} containers - Hashes for generated objects like request, binding, etc.
		 * @param {sap.apf.modeler.core.ElementContainer} containers.requestIdHash - Generator for Id's of type request.
		 * @param {object[]} containers.requests - request list of configuration
		 * @returns {String} - Id
		 */
		this.serializeRequest = function(step, containers) {
			var request;
			var requestId = "request-for-" + step.getId();
			request = {
				type : "request",
				id : requestId,
				service : step.getService(),
				entitySet : step.getEntitySet(),
				selectProperties : step.getSelectProperties()
			};
			containers.requests.push(request);
			return requestId;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#serializeFilterMappingRequest
		 * @param {sap.apf.modeler.core.Step|sap.apf.modeler.core.NavigationTarget} objectWithFilterMapping
		 * @param {object} containers - Hashes for generated objects like request, binding, etc.
		 * @param {sap.apf.modeler.core.ElementContainer} containers.requestIdHash - Generator for Id's of type request.
		 * @param {object[]} containers.requests - request list of configuration
		 * @returns {String} - Id
		 */
		this.serializeFilterMappingRequest = function(objectWithFilterMapping, containers) {
			var requestId = "request-for-FilterMapping" + objectWithFilterMapping.getId();
			var request = {
				type : "request",
				id : requestId,
				service : objectWithFilterMapping.getFilterMappingService(),
				entitySet : objectWithFilterMapping.getFilterMappingEntitySet(),
				selectProperties : objectWithFilterMapping.getFilterMappingTargetProperties()
			};
			containers.requests.push(request);
			return requestId;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#serializeStep
		 * @param {sap.apf.modeler.core.Step} step
		 * @param {object} containers - Hashes for generated objects like request, binding, etc.
		 * @param {sap.apf.modeler.core.ElementContainer} containers.requestIdHash - Generator for Id's of type request.
		 * @param {sap.apf.modeler.core.ElementContainer} containers.bindingIdHash - Generator for Id's of type binding.
		 * @returns {object}
		 */
		this.serializeStep = function(step, containers) {
			var requestId = that.serializeRequest(step, containers);
			var bindingId = that.serializeBinding(step, containers);
			var TextElement = textPool.get(step.getTitleId());
			var description = (TextElement && TextElement.TextElementDescription) || "";
			var longTitleId = step.getLongTitleId();
			var topNsettings;

			var result = {
				type : step.getType(),
				description : description,
				request : requestId,
				binding : bindingId,
				id : step.getId(),
				title : that.serializeLabelKey(step.getTitleId()),
				navigationTargets : []
			};
			if (step.getHierarchyProperty && step.getHierarchyProperty() ){
				result.hierarchyProperty = step.getHierarchyProperty();
			}
			if (step.getFilterMappingService()) {
				result.filterMapping = {
					requestForMappedFilter : that.serializeFilterMappingRequest(step, containers),
					target : step.getFilterMappingTargetProperties(),
					keepSource : step.getFilterMappingKeepSource() ? "true" : "false"
				};
			}
			topNsettings = step.getTopN();
			if (topNsettings) {
				result.topNSettings = topNsettings;
			}
			if (longTitleId !== "" && longTitleId !== undefined) {
				result.longTitle = that.serializeLabelKey(step.getLongTitleId());
			}
			this.serializeAndAddThumbnail(step, result);
			step.getNavigationTargets().forEach(function(navTargetId) {
				result.navigationTargets.push({
					type : "navigationTarget",
					id : navTargetId
				});
			});
			return result;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#serializeFacetFilter
		 * @param {sap.apf.modeler.core.FacetFilter} facetFilter
		 * @param {object} containers - Hashes for generated objects like request, binding, etc.
		 * @param {sap.apf.modeler.core.ElementContainer} containers.requestIdHash - Generator for Id's of type request.
		 * @returns {object}
		 */
		this.serializeFacetFilter = function(facetFilter, containers) {
			var requestForFilterResolutionId, requestForValueHelpId, valueList;
			if (facetFilter.getServiceOfFilterResolution()) {
				requestForFilterResolutionId = serializeFacetFilterRequest("FilterResolution", facetFilter, containers);
			}
			if (facetFilter.getUseSameRequestForValueHelpAndFilterResolution()) {
				requestForValueHelpId = requestForFilterResolutionId;
			} else if (facetFilter.getServiceOfValueHelp()) {
				requestForValueHelpId = serializeFacetFilterRequest("ValueHelp", facetFilter, containers);
			}
			var TextElement = textPool.get(facetFilter.getLabelKey());
			var description = (TextElement && TextElement.TextElementDescription) || "";
			if(facetFilter.getValueList().length > 0){
				valueList = facetFilter.getValueList();
			}
			return {
				type : "facetFilter",
				description : description,
				id : facetFilter.getId(),
				alias : facetFilter.getAlias(),
				property : facetFilter.getProperty(),
				multiSelection : facetFilter.isMultiSelection() + "",
				preselectionFunction : facetFilter.getPreselectionFunction(),
				preselectionDefaults : serializePreselectionDefault(),
				valueList: valueList,
				label : that.serializeLabelKey(facetFilter.getLabelKey()),
				invisible : !facetFilter.isVisible(),
				filterResolutionRequest : requestForFilterResolutionId,
				valueHelpRequest : requestForValueHelpId,
				hasAutomaticSelection : facetFilter.getAutomaticSelection() + "",
				useSameRequestForValueHelpAndFilterResolution : facetFilter.getUseSameRequestForValueHelpAndFilterResolution() + ""
			};
			function serializeFacetFilterRequest(requestType, facetFilter, containers) {
				var request;
				var service;
				var entitySet;
				var selectProperties;
				switch (requestType) {
					case "ValueHelp":
						service = facetFilter.getServiceOfValueHelp();
						entitySet = facetFilter.getEntitySetOfValueHelp();
						selectProperties = facetFilter.getSelectPropertiesOfValueHelp();
						break;
					case "FilterResolution":
						service = facetFilter.getServiceOfFilterResolution();
						entitySet = facetFilter.getEntitySetOfFilterResolution();
						selectProperties = facetFilter.getSelectPropertiesOfFilterResolution();
						break;
				}
				var requestId = requestType + "-request-for-" + facetFilter.getId();
				request = {
					type : "request",
					id : requestId,
					service : service,
					entitySet : entitySet,
					selectProperties : selectProperties
				};
				containers.requests.push(request);
				return requestId;
			}
			function serializePreselectionDefault(){
				if(facetFilter.getNoneSelection() === true){
					return null;
				}
				return facetFilter.getPreselectionDefaults();
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#serializeNavigationTarget
		 * @param {sap.apf.modeler.core.NavigationTarget} navigationTarget
		 * @param {object} containers - Hashes for generated objects like request, binding, etc.
		 * @returns {object}
		 */
		this.serializeNavigationTarget = function(navigationTarget, containers) {
			var result = {
				type : "navigationTarget",
				id : navigationTarget.getId(),
				semanticObject : navigationTarget.getSemanticObject(),
				action : navigationTarget.getAction(),
				isStepSpecific : navigationTarget.isStepSpecific(),
				parameters : navigationTarget.getAllNavigationParameters()
			};
			if (navigationTarget.getFilterMappingService()) {
				result.filterMapping = {
					requestForMappedFilter : that.serializeFilterMappingRequest(navigationTarget, containers),
					target : navigationTarget.getFilterMappingTargetProperties()
				};
			}
			if (navigationTarget.getTitleKey()){
				result.title = {
					key : navigationTarget.getTitleKey(),
					type : "label",
					kind : "text"
				};
			}
			return result;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#serializeSmartFilterBar
		 * @param {sap.apf.modeler.core.SmartFilterBar} smartFilterBar
		 * @returns {object}
		 */
		this.serializeSmartFilterBar = function(smartFilterBar){
			if(smartFilterBar){
				if (!smartFilterBar.isEntityTypeConverted()) {
					return {
						id: smartFilterBar.getId(),
						type: 'smartFilterBar',
						service: smartFilterBar.getService(),
						entityType: smartFilterBar.getEntitySet()
					};
				} 
				return {
					id: smartFilterBar.getId(),
					type: 'smartFilterBar',
					service: smartFilterBar.getService(),
					entitySet: smartFilterBar.getEntitySet()
				};
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#serializeConfiguration
		 * @description Return a serializable configuration.
		 *      It recursively serializes all referenced objects, e.g. steps, representations, categories.
		 * @param {sap.apf.modeler.core.ConfigurationEditor} editor
		 * @returns{Object}
		 */
		this.serializeConfiguration = function(editor) {
			var serializableConfiguration = {
				analyticalConfigurationName : editor.getConfigurationName(),
				applicationTitle : that.serializeLabelKey(editor.getApplicationTitle()),
				steps : [],
				requests : [],
				bindings : [],
				representationTypes : [],
				categories : [],
				navigationTargets : []
			};
			// add navigation configuration hard coded. Configuration editor must learn this format
			var containers = {
				requests : serializableConfiguration.requests,
				bindings : serializableConfiguration.bindings
			};
			editor.getCategories().forEach(function(category) {
				var steps = editor.getCategoryStepAssignments(category.getId());
				serializableConfiguration.categories.push(that.serializeCategory(category, steps));
			});
			editor.getSteps().forEach(function(step) {
				var configStep = that.serializeStep(step, containers);
				serializableConfiguration.steps.push(configStep);
			});
			editor.getFacetFilters().forEach(function(facetFilter) {
				var configFacetFilter = that.serializeFacetFilter(facetFilter, containers);
				if(serializableConfiguration.facetFilters === undefined) {
					serializableConfiguration.facetFilters = [];
				}
				serializableConfiguration.facetFilters.push(configFacetFilter);
			});
			if(editor.getFilterOption().facetFilter === true && serializableConfiguration.facetFilters === undefined ){
				serializableConfiguration.facetFilters = [];
			}
			editor.getNavigationTargets().forEach(function(navigationTarget) {
				var configNavigationTarget = that.serializeNavigationTarget(navigationTarget, containers);
				serializableConfiguration.navigationTargets.push(configNavigationTarget);
			});
			var sSFB = this.serializeSmartFilterBar(editor.getSmartFilterBar());
			if(sSFB !== undefined) {
				serializableConfiguration.smartFilterBar = sSFB;
			}
			return serializableConfiguration;
		};
		function mapOptionalThumbnail(configObject, modelObject) {
			var thumbnail = configObject.thumbnail;
			if (!thumbnail) {
				return;
			}
			if (thumbnail.leftLower) {
				modelObject.setLeftLowerCornerTextKey(thumbnail.leftLower.key);
			}
			if (thumbnail.leftUpper) {
				modelObject.setLeftUpperCornerTextKey(thumbnail.leftUpper.key);
			}
			if (thumbnail.rightLower) {
				modelObject.setRightLowerCornerTextKey(thumbnail.rightLower.key);
			}
			if (thumbnail.rightUpper) {
				modelObject.setRightUpperCornerTextKey(thumbnail.rightUpper.key);
			}
		}
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#mapStepToDesignTime
		 * @param {object} configStep - configuration object
		 * @param {sap.apf.modeler.core.ConfigurationEditor} configurationEditor
		 * @param {sap.apf.modeler.core.RegistryWrapper} registry
		 */
		function mapStepToDesignTime(configStep, registry, configurationEditor) {
			var stepId;
			var modelStep;
			if(configStep.type === "hierarchicalStep"){
				stepId = configurationEditor.createHierarchicalStepWithId(configStep.id);
				modelStep = configurationEditor.getStep(stepId);
				modelStep.setHierarchyProperty(configStep.hierarchyProperty);
			} else {
				stepId = configurationEditor.createStepWithId(configStep.id);
				modelStep = configurationEditor.getStep(stepId);
			}
			var request = registry.getItem(configStep.request);
			if (request.entityType) { // TODO: remove workaround earliest 5th November
				request.entitySet = request.entityType;
				delete request.entityType;
			}
			if (request.service) {
				configurationEditor.registerServiceAsPromise(request.service);
			}
			modelStep.setService(request.service);
			modelStep.setEntitySet(request.entitySet);
			modelStep.setTitleId(configStep.title.key);
			if (configStep.longTitle && configStep.longTitle.key) {
				modelStep.setLongTitleId(configStep.longTitle.key);
			}
			if (configStep.navigationTargets) {
				configStep.navigationTargets.forEach(function(navTarget) {
					modelStep.addNavigationTarget(navTarget.id);
				});
			}
			mapOptionalThumbnail(configStep, modelStep);
			request.selectProperties.forEach(function(property) {
				modelStep.addSelectProperty(property);
			});
			var binding = registry.getItem(configStep.binding);
			binding.requiredFilters.forEach(function(property) {
				modelStep.addFilterProperty(property);
			});
			if(binding.requiredFilterOptions){
				modelStep.setFilterPropertyLabelDisplayOption(binding.requiredFilterOptions.labelDisplayOption);
				if(binding.requiredFilterOptions.fieldDesc){
					modelStep.setFilterPropertyLabelKey(binding.requiredFilterOptions.fieldDesc.key);
				}
			}
			binding.representations.forEach(function(configRepresentation) {
				var member;
				var modelRepresentation = modelStep.getRepresentation(modelStep.createRepresentation().getId());
				modelRepresentation.setRepresentationType(configRepresentation.representationTypeId);
				modelRepresentation.setAlternateRepresentationType(configRepresentation.parameter.alternateRepresentationTypeId);
				if(configRepresentation.parameter.hierarchicalProperty && configRepresentation.parameter.hierarchicalProperty[0] && configRepresentation.parameter.hierarchicalProperty[0].fieldDesc){
					modelRepresentation.setHierarchyPropertyTextLabelKey(configRepresentation.parameter.hierarchicalProperty[0].fieldDesc.key);
				}
				if(configRepresentation.parameter.hierarchicalProperty && configRepresentation.parameter.hierarchicalProperty[0]){
					modelRepresentation.setHierarchyPropertyLabelDisplayOption(configRepresentation.parameter.hierarchicalProperty[0].labelDisplayOption);
				}
				configRepresentation.parameter.dimensions.forEach(function(dimensionConfig) {
					modelRepresentation.addDimension(dimensionConfig.fieldName);
					if (dimensionConfig.fieldDesc) {
						modelRepresentation.setDimensionTextLabelKey(dimensionConfig.fieldName, dimensionConfig.fieldDesc.key);
					}
					if (dimensionConfig.kind) {
						modelRepresentation.setDimensionKind(dimensionConfig.fieldName, dimensionConfig.kind);
					}
					if (dimensionConfig.labelDisplayOption) {
						modelRepresentation.setLabelDisplayOption(dimensionConfig.fieldName, dimensionConfig.labelDisplayOption);
					}
				});
				configRepresentation.parameter.measures.forEach(function(measureConfig) {
					modelRepresentation.addMeasure(measureConfig.fieldName);
					if (measureConfig.fieldDesc) {
						modelRepresentation.setMeasureTextLabelKey(measureConfig.fieldName, measureConfig.fieldDesc.key);
					}
					if (measureConfig.kind) {
						modelRepresentation.setMeasureKind(measureConfig.fieldName, measureConfig.kind);
					}
				});
				if(configRepresentation.parameter.properties){
					configRepresentation.parameter.properties.forEach(function(propertyConfig) {
						modelRepresentation.addProperty(propertyConfig.fieldName);
						if (propertyConfig.fieldDesc) {
							modelRepresentation.setPropertyTextLabelKey(propertyConfig.fieldName, propertyConfig.fieldDesc.key);
						}
						if (propertyConfig.kind) {
							modelRepresentation.setPropertyKind(propertyConfig.fieldName, propertyConfig.kind);
						}
					});
				}
				if (configRepresentation.parameter.width) {
					for(member in configRepresentation.parameter.width) {
						if (configRepresentation.parameter.width.hasOwnProperty(member)) {
							modelRepresentation.setWidthProperty(member, configRepresentation.parameter.width[member]);
						}
					}
				}
				if (configRepresentation.parameter.orderby && !configRepresentation.parameter.topN) { // optional
					configRepresentation.parameter.orderby.forEach(function(obj) {
						modelRepresentation.addOrderbySpec(obj.property, obj.ascending);
					});
				}
				mapOptionalThumbnail(configRepresentation, modelRepresentation);
			});
			if (configStep.filterMapping) {
				mapFilterMappingToDesignTime(configStep.filterMapping, modelStep, registry);
			}
			if (configStep.topNSettings) {
				modelStep.setTopN(configStep.topNSettings.top, configStep.topNSettings.orderby);
			}
		}
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#mapFacetFilterToDesignTime
		 * @param {object} configFacetFilter - configuration object
		 * @param {sap.apf.modeler.core.RegistryWrapper} registry
		 * @param {sap.apf.modeler.core.ConfigurationEditor} configurationEditor
		 */
		function mapFacetFilterToDesignTime(configFacetFilter, registry, configurationEditor) {
			var id = configurationEditor.createFacetFilterWithId(configFacetFilter.id);
			var modelFacetFilter = configurationEditor.getFacetFilter(id);
			modelFacetFilter.setLabelKey(configFacetFilter.label.key);
			modelFacetFilter.setAlias(configFacetFilter.alias);
			modelFacetFilter.setProperty(configFacetFilter.property);
			if (configFacetFilter.preselectionFunction && configFacetFilter.preselectionFunction !== "") {
				modelFacetFilter.setPreselectionFunction(configFacetFilter.preselectionFunction);
			} else if (configFacetFilter.preselectionDefaults === null) {
				modelFacetFilter.setNoneSelection(true);
			} else {
				modelFacetFilter.setPreselectionDefaults(configFacetFilter.preselectionDefaults);
			}
			if(configFacetFilter.valueList) {
				modelFacetFilter.setValueList(configFacetFilter.valueList);
			}
			if (configFacetFilter.useSameRequestForValueHelpAndFilterResolution && configFacetFilter.useSameRequestForValueHelpAndFilterResolution === "true") {
				modelFacetFilter.setUseSameRequestForValueHelpAndFilterResolution(true);
			} else {
				modelFacetFilter.setUseSameRequestForValueHelpAndFilterResolution(false);
			}
			if (configFacetFilter.multiSelection === "true") {
				modelFacetFilter.setMultiSelection(true);
			}
			if (configFacetFilter.invisible === true) {
			    modelFacetFilter.setInvisible();
			}
			if (configFacetFilter.hasAutomaticSelection === "true") {
				modelFacetFilter.setAutomaticSelection(true);
			} else {
				modelFacetFilter.setAutomaticSelection(false);
			}
			if (configFacetFilter.valueHelpRequest) {
				var configRequestForValueHelp = registry.getItem(configFacetFilter.valueHelpRequest);
				if (configRequestForValueHelp.entityType) {
					configRequestForValueHelp.entitySet = configRequestForValueHelp.entityType;
					delete configRequestForValueHelp.entityType;
				}
				if (configRequestForValueHelp.service) {
					configurationEditor.registerServiceAsPromise(configRequestForValueHelp.service);
					modelFacetFilter.setServiceOfValueHelp(configRequestForValueHelp.service);
				}
				if (configRequestForValueHelp.entitySet) {
					modelFacetFilter.setEntitySetOfValueHelp(configRequestForValueHelp.entitySet);
				}
				configRequestForValueHelp.selectProperties.forEach(function(property) {
					modelFacetFilter.addSelectPropertyOfValueHelp(property);
				});
			}
			if (configFacetFilter.filterResolutionRequest) {
				var configRequestForFilterResolution = registry.getItem(configFacetFilter.filterResolutionRequest);
				if (configRequestForFilterResolution.entityType) {
					configRequestForFilterResolution.entitySet = configRequestForFilterResolution.entityType;
					delete configRequestForFilterResolution.entityType;
				}
				if (configRequestForFilterResolution.service) {
					configurationEditor.registerServiceAsPromise(configRequestForFilterResolution.service);
					modelFacetFilter.setServiceOfFilterResolution(configRequestForFilterResolution.service);
				}
				if (configRequestForFilterResolution.entitySet) {
					modelFacetFilter.setEntitySetOfFilterResolution(configRequestForFilterResolution.entitySet);
				}
				configRequestForFilterResolution.selectProperties.forEach(function(property) {
					modelFacetFilter.addSelectPropertyOfFilterResolution(property);
				});
			}
		}
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#mapNavigationTargetToDesignTime
		 * @param {object} configNavigationTarget - configuration object
		 * @param {sap.apf.modeler.core.RegistryWrapper} registry
		 * @param {sap.apf.modeler.core.ConfigurationEditor} configurationEditor
		 */
		function mapNavigationTargetToDesignTime(configNavigationTarget, registry, configurationEditor) {
			var id = configurationEditor.createNavigationTargetWithId(configNavigationTarget.id);
			var modelNavigationTarget = configurationEditor.getNavigationTarget(id);
			modelNavigationTarget.setSemanticObject(configNavigationTarget.semanticObject);
			modelNavigationTarget.setAction(configNavigationTarget.action);
			if (configNavigationTarget.parameters) {
				configNavigationTarget.parameters.forEach(function (parameter) {
					modelNavigationTarget.addNavigationParameter(parameter.key, parameter.value);
				});
			}
			if (configNavigationTarget.isStepSpecific === true) {
				//                modelNavigationTarget.setStepSpecific(configNavigationTarget.isStepSpecific);
				modelNavigationTarget.setStepSpecific();
			} else {
				modelNavigationTarget.setGlobal();
			}
			if (configNavigationTarget.filterMapping) {
				mapFilterMappingToDesignTime(configNavigationTarget.filterMapping, modelNavigationTarget, registry);
			}
			if (configNavigationTarget.title && configNavigationTarget.title.key){
				modelNavigationTarget.setTitleKey(configNavigationTarget.title.key);
			}
		}
		function mapFilterMappingToDesignTime(configFilterMapping, modelWithFilterMapping, registry) {
			var requestForFilterMapping = registry.getItem(configFilterMapping.requestForMappedFilter);
			if (requestForFilterMapping.entityType) {
				requestForFilterMapping.entitySet = requestForFilterMapping.entityType;
				delete requestForFilterMapping.entityType;
			}
			modelWithFilterMapping.setFilterMappingService(requestForFilterMapping.service);
			modelWithFilterMapping.setFilterMappingEntitySet(requestForFilterMapping.entitySet);
			configFilterMapping.target.forEach(function(property) {
				modelWithFilterMapping.addFilterMappingTargetProperty(property);
			});
			if (configFilterMapping.hasOwnProperty("keepSource")) {
				if (configFilterMapping.keepSource === "true") {
					modelWithFilterMapping.setFilterMappingKeepSource(true);
				} else {
					modelWithFilterMapping.setFilterMappingKeepSource(false);
				}
			}
		}
		function mapSmartFilterBarToDesignTimeAsPromise(registry, configurationEditor){
			var deferred = jQuery.Deferred();
			
			var smartFilterBarConfig = registry.getItem("SmartFilterBar-1");
			if(smartFilterBarConfig){
				configurationEditor.setFilterOption({smartFilterBar : true});
				var smartFilterBar = configurationEditor.getSmartFilterBar();
				smartFilterBar.setService(smartFilterBarConfig.service);
				
				if (smartFilterBarConfig.service) {
					configurationEditor.registerServiceAsPromise(smartFilterBarConfig.service);
				}
				if (smartFilterBarConfig.entitySet) {
					smartFilterBar.setEntitySet(smartFilterBarConfig.entitySet);
					deferred.resolve(true);
				} else if (smartFilterBarConfig.entityType) {
					metadataFactory.getMetadata(smartFilterBarConfig.service).done(function(metadata) {
						if (metadata) {
							var entitySet = metadata.getEntitySetByEntityType(smartFilterBarConfig.entityType);
							if (entitySet) {
								smartFilterBar.setEntitySet(entitySet);	
							} else {
								smartFilterBar.setEntitySet(smartFilterBarConfig.entityType, true);
								complain("11524", [smartFilterBarConfig.entityType]);
							}
						}
						deferred.resolve(true);
					}).fail(function() {
						smartFilterBar.setEntitySet(smartFilterBarConfig.entityType, true);
						complain("11524", [smartFilterBarConfig.entityType]);
						deferred.resolve(true);
					});	
				} else {
					deferred.resolve(true);
				}
			} else {
				deferred.resolve(false);
			}
			return deferred.promise();
		}
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#mapToDesignTimeAsPromise
		 * @description Retrieve all first class citizens (e.g. steps and categories) from the hashtable and transfer them to the containers in the configurationEditor.
		 *      Assumption: all input entities have identifier.
		 * @param {sap.apf.modeler.core.RegistryWrapper} registry
		 * @param {sap.apf.modeler.core.ConfigurationEditor} configurationEditor
		 * @returns {jQuery.Deferred} promise
		 */
		this.mapToDesignTimeAsPromise = function(registry, configurationEditor) {
			var deferred = jQuery.Deferred();
			var facetFilterConfig;
			var facetFilterExists = false;
			
			configurationEditor.setApplicationTitle(registry.getItem('applicationTitle').key);
			registry.getSteps().forEach(function(step) {
				mapStepToDesignTime(step, registry, configurationEditor);
			});
			registry.getCategories().forEach(function(category) {
				configurationEditor.createCategoryWithId({
					labelKey : category.label.key
				}, category.id);
				category.steps.forEach(function(step) {
					configurationEditor.addCategoryStepAssignment(category.id, step.id);
				});
			});
			facetFilterConfig = registry.getFacetFilters();
			if(facetFilterConfig.emptyArray === true) {
				facetFilterExists = true;
				configurationEditor.setFilterOption({facetFilter : true});
			} else {
				facetFilterConfig.forEach(function(facetFilter) {
					facetFilterExists = true;
					configurationEditor.setFilterOption({facetFilter : true});
					mapFacetFilterToDesignTime(facetFilter, registry, configurationEditor);
				});
			}
			registry.getNavigationTargets().forEach(function(navigationTarget) {
				mapNavigationTargetToDesignTime(navigationTarget, registry, configurationEditor);
			});
			mapSmartFilterBarToDesignTimeAsPromise(registry, configurationEditor).done(function(smartFilterBarExists){
				if(!facetFilterExists && !smartFilterBarExists){
					configurationEditor.setFilterOption({none : true});
				}
				deferred.resolve();
			});
			
			
			return deferred.promise();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#loadAllConfigurations
		 * @description Load all configuration objects for a given application from server
		 * @param {String} applicationId - Id of the application
		 * @param {Function} callbackAfterLoad - callback with signature callbackAfterLoad(result, metadata, messageObject)
		 */
		this.loadAllConfigurations = function(applicationId, callbackAfterLoad) {
			var filterApplication = new sap.apf.core.utils.Filter(messageHandler, 'Application', 'eq', applicationId);
			persistenceProxy.readCollection("configuration", function(result, metadata, messageObject) {
				callbackAfterLoad(result, metadata, messageObject); //needed: for debugging purposes
			}, undefined, ["AnalyticalConfiguration", "SerializedAnalyticalConfiguration"], filterApplication);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationObjects#getTextKeysFromAllConfigurations
		 * @description Load thext keys for all configuration objects of a given application
		 * @param {String} applicationId - Id of the application
		 * @param {Function} callbackAfterGet - callback with signature callbackAfterGet(textKeys, messageObject)
		 * @param {sap.apf.core.utils.Hashtable} callbackAfterGet.textKeys - Hashtable with textKeys from all configurations
		 */
		this.getTextKeysFromAllConfigurations = function(applicationId, callbackAfterGet) {
			this.loadAllConfigurations(applicationId, function(configurations, metadata, messageObject) {
				var textKeys = new Hashtable(messageHandler);
				if (messageObject) {
					callbackAfterGet(undefined, messageObject);
					return;
				}
				configurations.forEach(function(configuration) {
					var config = JSON.parse(configuration.SerializedAnalyticalConfiguration);
					var textKeysForConfig = sap.apf.modeler.core.ConfigurationObjects.getTextKeysFromConfiguration(config);
					textKeysForConfig.forEach(function(textKey) {
						textKeys.setItem(textKey, textKey);
					});
				});
				callbackAfterGet(textKeys, undefined);
			});
		};
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.core.ConfigurationObjects.deepDataCopy
	 * @description Build a deep copy of the input Data considering explicit copy methods.
	 * @param {Object} inputData input  object 
	 * @returns {Object} Deep copy of the context object
	 */
	sap.apf.modeler.core.ConfigurationObjects.deepDataCopy = function deepDataCopy(inputData) {
		var resultData;
		if (!inputData) {
			resultData = inputData; //shallow copy for falsy values
		} else if (inputData.copy && typeof inputData.copy === "function") {
			resultData = inputData.copy(); //Priority for explicit copy methods
		} else if (inputData && typeof inputData === "object") {
			if (inputData instanceof Array) {
				resultData = [];
				inputData.forEach(function(item) {
					resultData.push(deepDataCopy(item)); //Deep copy for all array elements
				});
			} else {
				resultData = {};
				for( var item in inputData) {
					if (!inputData.hasOwnProperty(item)) {
						continue;
					}
					resultData[item] = deepDataCopy(inputData[item]); //Deep copy for all object attributes
				}
			}
		} else {
			resultData = inputData; //Shallow copy for everything else	
		}
		return resultData;
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.core.ConfigurationObjects.getTextKeysFromConfiguration
	 * @description deeply get all text keys for a stringifiable configuration object and its references
	 * @param {Object} configuration - Stringifiable configuration object
	 * @returns {Array} Text keys
	 */
	sap.apf.modeler.core.ConfigurationObjects.getTextKeysFromConfiguration = function getTextKeysFromConfiguration(configuration) {
		var resultValue = [];
		if (!configuration) {
			return undefined;
		}
		if (configuration.type === "label" && configuration.kind === "text" && configuration.key) {
			return [ configuration.key ];
		}
		for( var item in configuration) {
			if (typeof configuration[item] !== "object" || !configuration.hasOwnProperty(item)) {
				continue;
			}
			Array.prototype.push.apply(resultValue, getTextKeysFromConfiguration(configuration[item]));
		}
		return resultValue;
	};
}());
