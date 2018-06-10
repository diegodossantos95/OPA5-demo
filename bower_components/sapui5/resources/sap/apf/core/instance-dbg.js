/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap, OData */
jQuery.sap.declare("sap.apf.core.instance");
jQuery.sap.require('sap.apf.utils.utils');
jQuery.sap.require("sap.apf.core.utils.checkForTimeout");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.core.metadataFacade");
jQuery.sap.require("sap.apf.core.metadataProperty");
jQuery.sap.require("sap.apf.core.ajax");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.core.messageHandler");
jQuery.sap.require("sap.apf.core.entityTypeMetadata");
jQuery.sap.require("sap.apf.core.metadataFactory");
jQuery.sap.require("sap.apf.core.textResourceHandler");
jQuery.sap.require("sap.apf.core.configurationFactory");
jQuery.sap.require("sap.apf.core.path");
jQuery.sap.require("sap.apf.core.sessionHandler");
jQuery.sap.require("sap.apf.core.resourcePathHandler");
jQuery.sap.require("sap.apf.core.persistence");
jQuery.sap.require("sap.apf.core.readRequest");
jQuery.sap.require("sap.apf.core.readRequestByRequiredFilter");
jQuery.sap.require("sap.apf.core.utils.fileExists");
jQuery.sap.require("sap.apf.core.utils.annotationHandler");
jQuery.sap.require("sap.ui.comp.smartfilterbar.ControlConfiguration");
jQuery.sap.require("sap.ui.thirdparty.datajs");

(function() {
	'use strict';
	/**
	 * @class Core Component Instance
	 * @name sap.apf.core.Instance
	 * @description Creation of new Core Component Instance
	 * @param {Object} oApiInject injected module references and constructor functions.
	 */
	sap.apf.core.Instance = function(oApiInject) {
		var that = this;
		var oMessageHandler = oApiInject.instances.messageHandler;
		var oStartParameter = oApiInject.instances.startParameter;
		oApiInject.constructors = oApiInject.constructors || {};
		var checkForTimeout = (oApiInject.functions && oApiInject.functions.checkForTimeout) || sap.apf.core.utils.checkForTimeout;

		var oInject = { //TODO Clarify why this object literal was introduced. Couldn't we just pass on oApiInject?
			instances : {
				messageHandler : oMessageHandler,
				coreApi : this
			},
			constructors : {
				Request : oApiInject.constructors.Request
			},
			exits : {
				binding : {
					afterGetFilter :  oApiInject.exits && oApiInject.exits.binding && oApiInject.exits.binding.afterGetFilter
				},
				path : {
					beforeAddingToCumulatedFilter : oApiInject.exits && oApiInject.exits.path && oApiInject.exits.path.beforeAddingToCumulatedFilter
				}
			},
			functions : oApiInject.functions
		};
		var oResourcePathHandler;
		var oMetadataFactory;
		var oTextResourceHandler;
		var oConfigurationFactory;
		var oPath;
		var oSessionHandler;
		var oPersistence;
		var oAnnotationHandler;
		var oFileExists;
		var smartFilterBarDeferred;
		var datajs = oApiInject && oApiInject.instances && oApiInject.instances.datajs || OData;
		this.destroy = function() {
			oPath.destroy();
		};
		/**
		 * @see sap.apf.core.ajax
		 */
		this.ajax = function(oSettings) {
			var inject = jQuery.extend(true, {}, oSettings);
			inject.functions = inject.functions || {};
			inject.functions.getSapSystem = oStartParameter.getSapSystem;
			if (oApiInject.functions && oApiInject.functions.ajax) {
				
				inject.functions.ajax = oApiInject.functions.ajax;
			}
			inject.instances = inject.instances || {};
			inject.instances.messageHandler = oMessageHandler;
			return sap.apf.core.ajax(inject);
		};
		/**
		 * @see sap.apf.core.odataRequestWrapper
		 */
		this.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
			var oInject = {
				instances: {
					datajs : datajs
				},
				functions: {
					getSapSystem : oStartParameter.getSapSystem
				}
			};
			var request = (oApiInject && oApiInject.functions && oApiInject.functions.odataRequest) || sap.apf.core.odataRequestWrapper;
			request(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
		};
		/**
		 * @see sap.apf.utils.startParameter
		 */
		this.getStartParameterFacade = function() {
			return oStartParameter;
		};
		this.getMessageHandler = function() {
			return oMessageHandler;
		};
		/**
		 * @see sap.apf#putMessage for api definition.
		 * @see sap.apf.core.MessageHandler#putMessage for implementation.
		 */
		this.putMessage = function(oMessage) {
			return oMessageHandler.putMessage(oMessage);
		};
		/**
		 * @see sap.apf.core.MessageHandler#check
		 */
		this.check = function(bExpression, sMessage, sCode) {
			return oMessageHandler.check(bExpression, sMessage, sCode);
		};
		/**
		 * @see sap.apf#createMessageObject for api definition.
		 * @see sap.apf.core.MessageHandler#createMessageObject
		 */
		this.createMessageObject = function(oConfig) {
			return oMessageHandler.createMessageObject(oConfig);
		};
		/**
		 * @see sap.apf.core.MessageHandler#activateOnErrorHandling
		 */
		this.activateOnErrorHandling = function(bOnOff) {
			oMessageHandler.activateOnErrorHandling(bOnOff);
		};
		/**
		 * @see sap.apf.core.MessageHandler#setMessageCallback
		 */
		this.setCallbackForMessageHandling = function(fnCallback) {
			oMessageHandler.setMessageCallback(fnCallback);
		};
		/**
		 * @see sap.apf.core.MessageHandler#getLogMessages
		 */
		this.getLogMessages = function() {
			return oMessageHandler.getLogMessages();
		};
		/**
		 * @see sap.apf.core.checkForTimeout
		 */
		this.checkForTimeout = function(oServerResponse) {
			var oMessageObject = checkForTimeout(oServerResponse);
			// up to now, the error handling was hard coded in checkForTimeout
			if (oMessageObject) {
				oMessageHandler.putMessage(oMessageObject);
			}
			return oMessageObject;
		};
		/**
		 * @description Returns the instance of the UriGenerator. For internal core using only.
		 */
		this.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		/**
		 * @see sap.apf.core.MetadataFactory#getMetadata
		 */
		this.getMetadata = function(sAbsolutePathToServiceDocument) {
			return oMetadataFactory.getMetadata(sAbsolutePathToServiceDocument);
		};
		/**
		 * @see sap.apf.core.MetadataFactory#getMetadataFacade
		 */
		this.getMetadataFacade = function() {
			return oMetadataFactory.getMetadataFacade();
		};
		/**
		 * @see sap.apf.core.MetadataFactory#getEntityTypeMetadata
		 */
		this.getEntityTypeMetadata = function(sAbsolutePathToServiceDocument, sEntityType) {
			return oMetadataFactory.getEntityTypeMetadata(sAbsolutePathToServiceDocument, sEntityType);
		};
		/**
		 * @see sap.apf.core.ResourcePathHandler#loadConfigFromFilePath
		 */
		this.loadApplicationConfig = function(sFilePath) {
			oResourcePathHandler.loadConfigFromFilePath(sFilePath);
		};
		/**
		 * @see sap.apf.core.TextResourceHandler#loadTextElements
		 */
		this.loadTextElements = function(textElements) {
			oTextResourceHandler.loadTextElements(textElements);
		};
		/**
		 * @see sap.apf.core.TextResourceHandler#registerTextWithKey
		 */
		this.registerTextWithKey = function(key, text) {
			oTextResourceHandler.registerTextWithKey(key, text);
		};
		/**
		 * @see sap.apf.core.ResourcePathHandler#getConfigurationProperties
		 */
		this.getApplicationConfigProperties = function() {
			return oResourcePathHandler.getConfigurationProperties();
		};
		/**
		 * @see sap.apf.core.ResourcePathHandler#getResourceLocation
		 */
		this.getResourceLocation = function(sResourceIdentifier) {
			return oResourcePathHandler.getResourceLocation(sResourceIdentifier);
		};
		/**
		 * @see sap.apf.core.ResourcePathHandler#getPersistenceConfiguration
		 */
		this.getPersistenceConfiguration = function() {
			return oResourcePathHandler.getPersistenceConfiguration();
		};
		// ConfigurationFactory API
		/**
		 * @see sap.apf.core.ConfigurationFactory#getCategories
		 */
		this.getCategories = function() {
			return oConfigurationFactory.getCategories();
		};
		/**
		 * @see sap.apf.core.ConfigurationFactory#existsConfiguration
		 */
		this.existsConfiguration = function(sId) {
			return oConfigurationFactory.existsConfiguration(sId);
		};
		/**
		 * @see sap.apf.core.ConfigurationFactory#getStepTemplates
		 */
		this.getStepTemplates = function() {
			return oConfigurationFactory.getStepTemplates();
		};
		/**
		 * @see sap.apf.core.ConfigurationFactory#getConfigurationById
		 */
		this.getConfigurationObjectById = function(sId) {
			return oConfigurationFactory.getConfigurationById(sId);
		};
		/**
		 * @description Register smartFilterBarInstance.
		 * @param {sap.ui.comp.smartfilterbar.SmartFilterBar} instance
		 */
		this.registerSmartFilterBarInstance = function(instance) {
			if(!smartFilterBarDeferred){
				smartFilterBarDeferred = jQuery.Deferred();
			}
			smartFilterBarDeferred.resolve(instance);
		};
		/**
		 * @description Get smartFilterBarInstance.
		 * @returns {jQuery.Deferred} promise that is resolved with {sap.ui.comp.smartfilterbar.SmartFilterBar | null} 
		 */
		this.getSmartFilterBarAsPromise = function() {
			if(!smartFilterBarDeferred){
				smartFilterBarDeferred = jQuery.Deferred();
			}
			this.getSmartFilterBarConfigurationAsPromise().done(function(smartFilterBarConfiguration){
				if(!smartFilterBarConfiguration){
					smartFilterBarDeferred.resolve(null);
				}
				
			});
			return smartFilterBarDeferred;
		};
		/**
		 * @see sap.apf.core.ConfigurationFactory#getSmartFilterBarConfigurationAsPromise
		 */
		this.getSmartFilterBarConfigurationAsPromise = function() {
			return oConfigurationFactory.getSmartFilterBarConfiguration();
		};
		/**
		 * @description Returns persistence key for smart filter bar variant management
		 * @param {String} id SmartFilterBar configuration object id
		 * @returns {String} persistence key
		 */
		this.getSmartFilterBarPersistenceKey = function(id) {
			
			return "APF" + oConfigurationFactory.getConfigHeader().AnalyticalConfiguration + id;
		};
		/**
		 * @description Returns the controlConfiguration containing default values for the SmartFilterBar.
		 * The resolved value can directly be put into the instantiation of the SmartFilterBar as property controlConfiguration.
		 * @returns {jQuery.Deferred} Promise that is resolved with {[sap.ui.comp.smartfilterbar.ControlConfiguration]}
		 */
		this.getSmartFilterbarDefaultFilterValues = function() {
			var defaultFilterValues = jQuery.Deferred();
			var controlConfig = [];
			oApiInject.functions.getCombinedContext().done(function(filter){
				filter.getProperties().forEach(function(property){
					var config = {
							key : property,
							visibleInAdvancedArea : true,
							defaultFilterValues : mapToSelectOption(filter, property)
					};
					controlConfig.push(new sap.ui.comp.smartfilterbar.ControlConfiguration(config));
				});
				defaultFilterValues.resolve(controlConfig);
			});
			return defaultFilterValues;
			
			function mapToSelectOption(filter, property){
				var terms = filter.getFilterTermsForProperty(property);
				var defaultFilterValues = [];
 
				terms.forEach(function(filterTerm){
					var selectOption = new sap.ui.comp.smartfilterbar.SelectOption({
							low : filterTerm.getValue(),
							operator : filterTerm.getOp(),
							high : filterTerm.getHighValue(), 
							sign : 'I'
					});
					defaultFilterValues.push(selectOption);
				});
				return defaultFilterValues;
			}
		};
		/**
		 * @description Returns the external context reduced by the properties already applied to the SmartFilterBar
		 * @returns {jQuery.Deferred} Promise that is resolved with {sap.apf.core.utils.Filter}
		 */
		this.getReducedCombinedContext = function(){
			var deferred = jQuery.Deferred();
			oApiInject.functions.getCombinedContext().done(function(filter){
				var smartFilterBarPromise = that.getSmartFilterBarAsPromise();
				
				smartFilterBarPromise.done(function(smartFilterBar){
					if (!smartFilterBar) {
						deferred.resolve(filter);
						return;
					}
					var combinedFilterFromSFB = new sap.apf.core.utils.Filter(oApiInject.instances.messageHandler);
					var filterArrayFromSFB = smartFilterBar.getFilters();
					filterArrayFromSFB.forEach(function(filterFromSFB){
							combinedFilterFromSFB.addAnd(sap.apf.core.utils.Filter.transformUI5FilterToInternal(oApiInject.instances.messageHandler, filterFromSFB));
					});
					deferred.resolve(filter.removeTermsByProperty(combinedFilterFromSFB.getProperties()));
				});

			});
			return deferred;
		};
		/**
		 * @see sap.apf.core.ConfigurationFactory#getFacetFilterConfigurations
		 */
		this.getFacetFilterConfigurations = function() {
			return oConfigurationFactory.getFacetFilterConfigurations();
		};
		/**
		 * @see sap.apf.core.ConfigurationFactory#getNavigationTargets
		 */
		this.getNavigationTargets = function() {
			return oConfigurationFactory.getNavigationTargets();
		};
		/**
		 * @description Creates a step object from the configuration object and adds it to the path.
		 * @param {string} sStepId Step id as defined in the analytical configuration.
		 * @param {function} fnStepProcessedCallback Callback function for path update.
		 * @param {string} [sRepresentationId] Parameter, that allows definition of the representation id that shall initially be selected. If omitted the first configured representation will be selected.
		 * @returns {sap.apf.core.Step} oStep Created step.
		 */
		this.createStep = function(sStepId, fnStepProcessedCallback, sRepresentationId) {
			var oStepInstance;
			oMessageHandler.check(sStepId !== undefined && typeof sStepId === "string" && sStepId.length !== 0, "sStepID is  unknown or undefined");
			oStepInstance = oConfigurationFactory.createStep(sStepId, sRepresentationId);
			oPath.addStep(oStepInstance, fnStepProcessedCallback);
			return oStepInstance;
		};
		// Path API
		/**
		 * @see sap.apf.core.Path#getSteps
		 */
		this.getSteps = function() {
			return oPath.getSteps();
		};
		/**
		 * @see sap.apf.core.Path#moveStepToPosition
		 */
		this.moveStepToPosition = function(oStep, nPosition, fnStepProcessedCallback) {
			oPath.moveStepToPosition(oStep, nPosition, fnStepProcessedCallback);
		};
		/**
		 * @function
		 * @name sap.apf.core.Instance#updatePath
		 * @see sap.apf.core.Path#update
		 */
		this.updatePath = function(fnStepProcessedCallback, bContextChanged) {
			oPath.update(fnStepProcessedCallback, bContextChanged);
		};
		/**
		 * @see sap.apf.core.Path#removeStep
		 */
		this.removeStep = function(oStep, fnStepProcessedCallback) {
			oPath.removeStep(oStep, fnStepProcessedCallback);
		};
		/**
		 * @description Creates a new Path instance
		 * @param {boolean} [bRememberActualPath] if true, then the path can be restored
		 *
		 */
		this.resetPath = function() {
			if (oPath) {
				oPath.destroy();
			}
			oPath = new sap.apf.core.Path(oInject);
		};
		/**
		 * @see sap.apf.core.Path#stepIsActive
		 */
		this.stepIsActive = function(oStep) {
			return oPath.stepIsActive(oStep);
		};
		/**
		 * @see sap.apf.core.SessionHandler#isApfStateAvailable
		 */
		this.isApfStateAvailable = function() {
			return oSessionHandler.isApfStateAvailable();
		};
		/**
		 * @see sap.apf.core.SessionHandler#storeApfState
		 */
		this.storeApfState = function() {
			oSessionHandler.storeApfState();
		};
		/**
		 * @see sap.apf.core.SessionHandler#restoreApfState
		 */
		this.restoreApfState = function() {
			return oSessionHandler.restoreApfState();
		};
		/**
		 * @description Serializes the path and the smartFilterBar
		 * @returns {Object} serializable object
		 */
		this.serialize = function() {
			var serializableObject = oPath.serialize();
			
			that.getSmartFilterBarAsPromise().done(function(smartFilterBarInstance){
					if(smartFilterBarInstance){
						serializableObject.smartFilterBar = smartFilterBarInstance.fetchVariant();
					}
			});
			return serializableObject;
		};
		/**
		 * @description Deserializes the path and the smartFilterBar
		 * @param {Object} serializedObject containing path and smartFilterBar
		 */
		this.deserialize = function(serializedObject) {
			if(serializedObject.smartFilterBar){
				if(!smartFilterBarDeferred){
					smartFilterBarDeferred = jQuery.Deferred();
				}
				smartFilterBarDeferred.done(function(oSFB){
					oSFB.applyVariant(serializedObject.smartFilterBar);
					oSFB.clearVariantSelection();
					oSFB.fireFilterChange();
				});
			}
			oPath.deserialize(serializedObject);
		};
		// Text Resource Handler API
		/**
		 * @see sap.apf#getTextNotHtmlEncoded
		 * @see sap.apf.core.TextResourceHandler#getTextNotHtmlEncoded
		 */
		this.getTextNotHtmlEncoded = function(oLabel, aParameters) {
			return oTextResourceHandler.getTextNotHtmlEncoded(oLabel, aParameters);
		};
		/**
		 * @see sap.apf#getTextHtmlEncoded
		 * @see sap.apf.core.TextResourceHandler#getTextHtmlEncoded
		 */
		this.getTextHtmlEncoded = function(oLabel, aParameters) {
			return oTextResourceHandler.getTextHtmlEncoded(oLabel, aParameters);
		};
		/**
		 * returns true, if this is the text key for the initial text. Initial text means empty string.
		 */
		this.isInitialTextKey = function(textKey) {
			return (textKey === sap.apf.core.constants.textKeyForInitialText);
		};
		/**
		 * @see sap.apf.core.TextResourceHandler#getMessageText
		 */
		this.getMessageText = function(sCode, aParameters) {
			return oTextResourceHandler.getMessageText(sCode, aParameters);
		};
		/**
		 * @see sap.apf.core.SessionHandler#getXsrfToken
		 */
		this.getXsrfToken = function(sServiceRootPath) {
			return oSessionHandler.getXsrfToken(sServiceRootPath);
		};
		/**
		 * @see sap.apf.core.SessionHandler#setDirtyState
		 */
		this.setDirtyState = function(state) {
		    oSessionHandler.setDirtyState(state);
		};
		/**
		 * @see sap.apf.core.SessionHandler#isDirty
		 */
        this.isDirty = function() {
            return oSessionHandler.isDirty();
        };
        /**
         * @see sap.apf.core.SessionHandler#setPathName
         */
        this.setPathName = function(name) {
            oSessionHandler.setPathName(name);
        };
        /**
         * @see sap.apf.core.SessionHandler#getPathName
         */
        this.getPathName = function() {
            return oSessionHandler.getPathName();
        };
		/**
		 * @see sap.apf.core.utils.StartFilterHandler#getCumulativeFilter
		 */
		this.getCumulativeFilter = function() {
			return oApiInject.functions.getCumulativeFilter();
		};
		/**
		 * @see sap.apf#createReadRequest
		 * @description Creates an object for performing an Odata Request get operation.
		 * @param {String|Object} sRequestConfigurationId - identifies a request configuration, which is contained in the analytical configuration.
		 *                        or the request configuration is directly passed as an object oRequestConfiguration.
		 * @returns {sap.apf.core.ReadRequest}
		 */
		this.createReadRequest = function(/* sRequestConfigurationId | oRequestConfiguration */requestConfiguration) {
			var oRequest = oConfigurationFactory.createRequest(requestConfiguration);
			var oRequestConfiguration;
			if (typeof requestConfiguration === 'string') {
				oRequestConfiguration = oConfigurationFactory.getConfigurationById(requestConfiguration);
			} else {
				oRequestConfiguration = requestConfiguration;
			}
			return new sap.apf.core.ReadRequest(oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		};
		/**
		 * @see sap.apf#createReadRequestByRequiredFilter
		 * @description Creates an object for performing an Odata Request get operation with required filter for parameter entity set key properties & required filters.
		 * @param {String|Object} sRequestConfigurationId - identifies a request configuration, which is contained in the analytical configuration.
		 *                        or the request configuration is directly passed as an object oRequestConfiguration.
		 * @returns {sap.apf.core.ReadRequestByRequiredFilter}
		 */
		this.createReadRequestByRequiredFilter = function(/* sRequestConfigurationId | oRequestConfiguration */requestConfiguration) {
			var oRequest = oConfigurationFactory.createRequest(requestConfiguration);
			var oRequestConfiguration;
			if (typeof requestConfiguration === 'string') {
				oRequestConfiguration = oConfigurationFactory.getConfigurationById(requestConfiguration);
			} else {
				oRequestConfiguration = requestConfiguration;
			}
			return new sap.apf.core.ReadRequestByRequiredFilter(oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		};
		/**
		 * @description Message configurations are loaded.
		 * @see sap.apf.core.MessageHandler#loadConfig
		 */
		this.loadMessageConfiguration = function(aMessages, bResetRegistry) {
			oMessageHandler.loadConfig(aMessages, bResetRegistry);
		};
		/**
		 * @see sap.apf.core.ConfigurationFactory#loadConfig
		 */
		this.loadAnalyticalConfiguration = function(oConfig) {
			oConfigurationFactory.loadConfig(oConfig);
		};
		/**
		 * @see sap.apf.core#savePath for api definition.
		 * @see sap.apf.core.Persistence#createPath
		 */
		this.savePath = function(arg1, arg2, arg3, arg4) {
			var sPathId;
			var sName;
			var fnCallback;
			var serializableApfState;
			if (typeof arg1 === 'string' && typeof arg2 === 'string' && typeof arg3 === 'function') {
				sPathId = arg1;
				sName = arg2;
				fnCallback = arg3;
				serializableApfState = arg4;
				this.setPathName(sName);
				oPersistence.modifyPath(sPathId, sName, fnCallback, serializableApfState);
			} else if (typeof arg1 === 'string' && typeof arg2 === 'function') {
				sName = arg1;
				fnCallback = arg2;
				serializableApfState = arg3;
				this.setPathName(sName);
				oPersistence.createPath(sName, fnCallback, serializableApfState);
			} else {
				oMessageHandler.putMessage(sap.apf.core.createMessageObject({
					code : "5027",
					aParameters : [ arg1, arg2, arg3 ]
				}));
			}
		};
		/**
		 * @see sap.apf.core.Persistence#readPaths
		 */
		this.readPaths = function(fnCallback) {
			oPersistence.readPaths(fnCallback);
		};
		/**
		 * @see sap.apf.core.Persistence#openPath
		 */
		this.openPath = function(sPathId, callback) {
			function callbackFromPersistence(oResponse, oEntitiyMetadata, oMessageObject) {
				if (!oMessageObject) {
					that.setPathName(oResponse.path.AnalysisPathName);
				}
				callback(oResponse, oEntitiyMetadata, oMessageObject);
			}
			return oPersistence.openPath(sPathId, callbackFromPersistence);
		};
		/**
		 * @see sap.apf.core.Persistence#deletePath
		 */
		this.deletePath = function(sPathId, fnCallback) {
			oPersistence.deletePath(sPathId, fnCallback);
		};
		/**
		 * @see sap.apf#createFilter for api definition
		 * @see sap.apf.utils.Filter
		 */
		this.createFilter = function(oSelectionVariant) {
			return new sap.apf.utils.Filter(oMessageHandler, oSelectionVariant);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core#getActiveStep
		 * @description Returns active step, currently selected step, of analysis path.
		 * @returns {sap.apf.core.Step}
		 */
		this.getActiveStep = function() {
			return oPath.getActiveSteps()[0];
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core#getCumulativeFilterUpToActiveStep
		 * @description Returns the cumulative filter up to the active step (included) and the context
		 * @returns {jQuery.Deferred.promise} Promise will be resolved with {sap.apf.core.utils.Filter}
		 */
		this.getCumulativeFilterUpToActiveStep = function() {
			return oPath.getCumulativeFilterUpToActiveStep();
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core#setActiveStep
		 * @description Sets handed over step as the active one.
		 * @param {sap.apf.core.Step} oStep The step to be set as active
		 * @returns undefined
		 */
		this.setActiveStep = function(oStep) {
			oPath.makeStepActive(oStep);
			var aActiveSteps = oPath.getActiveSteps();
			var i;
			for(i = 0; i < aActiveSteps.length; ++i) {
				oPath.makeStepInactive(aActiveSteps[i]);
			}
			return oPath.makeStepActive(oStep);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.Instance#createFirstStep
		 * @description Method to be used APF internally by the binding class to create instances from representation constructors.
		 */
		this.createFirstStep = function(sStepId, sRepId, callback) {
			var isValidStepId = false;
			var stepTemplates;
			stepTemplates = that.getStepTemplates();
			stepTemplates.forEach(function(item) {
				isValidStepId = item.id === sStepId ? true : isValidStepId;
			});
			if (!isValidStepId) {
				oMessageHandler.putMessage(oMessageHandler.createMessageObject({
					code : '5036',
					aParameters : [ sStepId ]
				}));
			} else {
				that.createStep(sStepId, callback, sRepId);
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Instance#getFunctionCreateRequest
		 * @description Returns function createRequest from sap.apf.core.ConfigurationFactory
		 */
		this.getFunctionCreateRequest = function() {
			return oConfigurationFactory.createRequest;
		};
		/**
		 * @see sap.apf.core.utils.AnnotationHandler#getAnnotationsForService
		 */
		this.getAnnotationsForService = function(serviceRoot) {
			return oAnnotationHandler.getAnnotationsForService(serviceRoot);
		};
		/**
		 * @see sap.apf.core.Path#checkAddStep
		 */
		this.checkAddStep = function(sId){
			return oPath.checkAddStep(sId);
		};
		// create local singleton instances...
		oTextResourceHandler = new ((oApiInject.constructors.TextResourceHandler) || sap.apf.core.TextResourceHandler)(oInject);
		oMessageHandler.setTextResourceHandler(oTextResourceHandler);
		if (oApiInject.manifests) {
			oInject.manifests = oApiInject.manifests;
		}

		oFileExists = new ((oApiInject.constructors.FileExists) || sap.apf.core.utils.FileExists)({ functions : { 
			ajax : that.ajax, getSapSystem : oStartParameter.getSapSystem }});
		
		var injectAnnotationHandler = {
				manifests : oApiInject.manifests,
				functions: {
					getSapSystem : oStartParameter.getSapSystem,
					getComponentNameFromManifest : sap.apf.utils.getComponentNameFromManifest,
					getODataPath : sap.apf.core.utils.uriGenerator.getODataPath,
					getBaseURLOfComponent : sap.apf.core.utils.uriGenerator.getBaseURLOfComponent,
					addRelativeToAbsoluteURL : sap.apf.core.utils.uriGenerator.addRelativeToAbsoluteURL
				},
				instances : {
					fileExists : oFileExists
				}
		};
		oAnnotationHandler = new ((oApiInject.constructors.AnnotationHandler) || sap.apf.core.utils.AnnotationHandler)(injectAnnotationHandler);
		oConfigurationFactory = new ((oApiInject.constructors.ConfigurationFactory) || sap.apf.core.ConfigurationFactory)(oInject);
		var oInjectMetadataFactory = {
			constructors : {
				EntityTypeMetadata : sap.apf.core.EntityTypeMetadata,
				Hashtable : (oApiInject.constructors.Hashtable) || sap.apf.utils.Hashtable,
				Metadata : (oApiInject.constructors.Metadata) || sap.apf.core.Metadata,
				MetadataFacade : (oApiInject.constructors.MetadataFacade) || sap.apf.core.MetadataFacade,
				MetadataProperty : (oApiInject.constructors.MetadataProperty) || sap.apf.core.MetadataProperty,
				ODataModel : (oApiInject.constructors.ODataModel) || sap.ui.model.odata.v2.ODataModel
			},
			instances : {
				messageHandler : oInject.instances.messageHandler,
				coreApi : that,
				annotationHandler: oAnnotationHandler
			},
			functions : {
				getServiceDocuments : oConfigurationFactory.getServiceDocuments,
				getSapSystem : oStartParameter.getSapSystem
			}
		};
		oMetadataFactory = new (oApiInject.constructors.MetadataFactory || sap.apf.core.MetadataFactory)(oInjectMetadataFactory);
		oPath = new (oApiInject.constructors.Path || sap.apf.core.Path)(oInject);
		oSessionHandler = new (oApiInject.constructors.SessionHandler || sap.apf.core.SessionHandler)(oInject);

		var oInjectPersistence = {
				instances : {
					messageHandler : oMessageHandler,
					coreApi : this
				},
				functions : {
					getComponentName : oApiInject.functions && oApiInject.functions.getComponentName
				}
			};
		oPersistence = new (oApiInject.constructors.Persistence || sap.apf.core.Persistence)(oInjectPersistence);
		var oInjectRessourcePathHandler = {
			instances : {
				coreApi : that,
				messageHandler : oInject.instances.messageHandler,
				fileExists : oFileExists
			},
			functions: {
				checkForTimeout : checkForTimeout,
				initTextResourceHandlerAsPromise : oTextResourceHandler.loadResourceModelAsPromise
			},
			corePromise : oApiInject.corePromise,
			manifests : oApiInject.manifests
		};
		oResourcePathHandler = new (oApiInject.constructors.ResourcePathHandler || sap.apf.core.ResourcePathHandler)(oInjectRessourcePathHandler);

		/**
		 * Sends all internal references to a probe object injected.
		 */
		if (oApiInject && oApiInject.coreProbe) {
			oApiInject.coreProbe({
				coreApi: this,
				startParameter: oStartParameter,
				resourcePathHandler: oResourcePathHandler,
				textResourceHandler: oTextResourceHandler,
				configurationFactory: oConfigurationFactory,
				path: oPath,
				sessionHandler: oSessionHandler,
				persistence: oPersistence,
				fileExists: oFileExists,
				corePromise : oApiInject.corePromise
			});
		}
	};
}());
