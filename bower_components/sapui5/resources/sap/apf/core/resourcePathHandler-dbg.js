/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap */
(function() {
	'use strict';
	jQuery.sap.declare("sap.apf.core.resourcePathHandler");
	jQuery.sap.require("sap.apf.core.utils.filter");
	jQuery.sap.require("sap.apf.utils.hashtable"); // ctor called
	jQuery.sap.require("sap.apf.core.messageHandler"); // constants used
	jQuery.sap.require("sap.apf.core.messageDefinition");
	jQuery.sap.require("sap.apf.core.odataProxy");
	jQuery.sap.require("sap.apf.core.layeredRepositoryProxy");
	jQuery.sap.require("sap.apf.core.constants");
	jQuery.sap.require("sap.apf.utils.startParameter");
	jQuery.sap.require("sap.apf.utils.utils");
	/**
	 * @class Holds all paths for the message configuration, the message text bundles, other ui texts for apf, and for extensions. 
	 * Furthermore it  holds the information about persistence configuration.
	 */
	sap.apf.core.ResourcePathHandler = function(oInject) {
		var thisModule = this;
		var coreApi = oInject.instances.coreApi;
		var messageHandler = oInject.instances.messageHandler;
		var oHT = new sap.apf.utils.Hashtable(messageHandler);
		var oConfigurationProperties;
		var oPersistenceConfiguration;
		var oSmartBusinessConfiguration = null;
		var deferredConfigurationLoaded = jQuery.Deferred();

		var loadConfigurationTriggered = false;
		var Proxy = sap.apf.core.OdataProxy;
		//noinspection JSLint
		setDefaultLocations();

		/**
		 * @description Loads a new  application configuration in JSON format.
		 * Loads only once. When called twice or more then skips processing and returns immediately.
		 * @param {string} sFilePath The absolute path of application configuration file. Host and port will be added in front of this path.
		 */
		this.loadConfigFromFilePath = function(sFilePath) {
			
			if (loadConfigurationTriggered) {
				return;
			}
			loadConfigurationTriggered = true;
			var analyticalConfigurationId = coreApi.getStartParameterFacade().getAnalyticalConfigurationId();
			var sUrl = sFilePath;
			//noinspection ReuseOfLocalVariableJS
			coreApi.ajax({
				url : sUrl,
				dataType : "json",
				success : parseConfigurationFile,
				error : function(oJqXHR, sStatus, sError) {
					var oMessageObject = messageHandler.createMessageObject({
						code : "5068",
						aParameters : [sUrl, sStatus, sError]
					});
					putMessage(oMessageObject);
				},
				async : true
			});

			
			
			function parseConfigurationFile(oData, sStatus, oJqXHR) {
				var oTimeoutMessage = oInject.functions.checkForTimeout(oJqXHR);
				var oMessageExplainingContext;
				if (oTimeoutMessage) {
					oMessageExplainingContext = messageHandler.createMessageObject({
						code : "5054",
						aParameters : [ sFilePath ]
					});
					oMessageExplainingContext.setPrevious(oTimeoutMessage);
					putMessage(oMessageExplainingContext);
				}
				if (!oData || !oData.applicationConfiguration) {
					putMessage(messageHandler.createMessageObject({
						code : "5055",
						aParameters : [ sFilePath ]
					}));
				}
				if (oData.applicationConfiguration.textResourceLocations === undefined) {
					putMessage(messageHandler.createMessageObject({
						code : "5056",
						aParameters : [ sFilePath ]
					}));
					return;
				}
				processApplicationConfiguration(oData, analyticalConfigurationId);
				configureMessageHandlingAsPromise().done(function(){
					if (analyticalConfigurationId) {
						loadAnalyticalConfigFromService(analyticalConfigurationId);
					} else {
						loadAnalyticalConfigFromFile();
					}
				});
			}
		};
		function useLrepProxy() {
			return coreApi.getStartParameterFacade().isLrepActive();
		}
		function loadAnalyticalConfigFromService(analyticalConfigurationId) {
			var application =  analyticalConfigurationId.applicationId;
			var configuration = analyticalConfigurationId.configurationId;
			if (useLrepProxy() && !application) {
				putMessage(messageHandler.createMessageObject({
					code : "5024"
				}));
			}
			var odataProxy = new Proxy({
				serviceRoot : oPersistenceConfiguration.path.service,
				entityTypes : {
					configuration : sap.apf.core.constants.entitySets.configuration,
					texts : sap.apf.core.constants.entitySets.texts
				}
			}, {
				instances : {
					coreApi : coreApi,
					messageHandler : messageHandler
				}
			});
			//Parallel reading configuration and texts if LREP is used
			if (useLrepProxy()) {
				var deferreds = [];
				var deferredCallback = jQuery.Deferred();
				deferreds.push(deferredCallback);
				deferreds.push(loadTextFromService(application, odataProxy));
			}
			odataProxy.readEntity("configuration", function(result, metadata, messageObject) {
				if (messageObject) {
					putMessage(messageHandler.createMessageObject({
						code : "5022",
						aParameters : [ configuration ]
					}));
					deferredConfigurationLoaded.resolve();
				} else {
					var analyticalConfiguration = JSON.parse(result.SerializedAnalyticalConfiguration);
					coreApi.loadAnalyticalConfiguration(JSON.parse(result.SerializedAnalyticalConfiguration));
					if (analyticalConfiguration.applicationTitle) {
						oConfigurationProperties.appName = analyticalConfiguration.applicationTitle.key;
						oConfigurationProperties.appTitle = analyticalConfiguration.applicationTitle.key;
					}
					if(useLrepProxy()) {
						deferredCallback.resolve();
					}else {
						application = application || result.Application;
						loadTextFromService(application, odataProxy).then(function (){
							deferredConfigurationLoaded.resolve();
						});
					}
				}
			}, [ {
				name : "AnalyticalConfiguration",
				value : configuration
			} ], undefined,
			application, 
			{ layer:'ALL' }, {'noMetadata' : true});
			if (useLrepProxy()) {
				jQuery.when.apply(jQuery, deferreds).then(function() {
					deferredConfigurationLoaded.resolve();
				});
			}
		}
		function loadTextFromService(applicationId, odataProxy) {
			var deferred = jQuery.Deferred();
			var filterApplication = new sap.apf.core.utils.Filter(messageHandler, 'Application', 'eq', applicationId);
			var filter = new sap.apf.core.utils.Filter(messageHandler, 'Language', 'eq', sap.apf.core.constants.developmentLanguage);
			filter.addAnd(filterApplication);
			var selectList = [ "TextElement", "TextElementDescription" ];
			odataProxy.readCollection('texts', function(result, metadata, messageObject) {
				if (messageObject) {
					putMessage(messageHandler.createMessageObject({
						code : "5023",
						aParameters : [ sap.apf.utils.uriParameter.getConfigurationId() ]
					}));
				} else {
					coreApi.loadTextElements(result);
				}
				deferred.resolve();
			}, undefined, selectList, filter, { layer : 'ALL' } );
			return deferred.promise();
		}
		function loadAnalyticalConfigFromFile() {
			var sUrl = thisModule.getResourceLocation(sap.apf.core.constants.resourceLocation.analyticalConfigurationLocation);
			var oMessageObject;
			if (sUrl !== "") {
				coreApi.ajax({
					url : sUrl,
					dataType : "json",
					success : function(oData, sStatus, oJqXHR) {
						if (oData) {
							coreApi.loadAnalyticalConfiguration(oData);
							if (oData.applicationTitle) {
								oConfigurationProperties.appName = oData.applicationTitle.key;
								oConfigurationProperties.appTitle = oData.applicationTitle.key;
							}
							deferredConfigurationLoaded.resolve();
						} else {
							oMessageObject = messageHandler.createMessageObject({
								code : "5057",
								aParameters : [ sUrl ]
							});
							putMessage(oMessageObject);
						}
					},
					error : function(oJqXHR, sStatus, sError, originalMessageObject) {
						oMessageObject = messageHandler.createMessageObject({
							code : "5057",
							aParameters : [ sUrl ]
						});
						if (originalMessageObject) {
							oMessageObject.setPrevious(originalMessageObject);
						}
						putMessage(oMessageObject);
					},
					async : true
				});
			} else { // the case of the default value which is set by this module when the file path was undefined in the config file
				oMessageObject = messageHandler.createMessageObject({
					code : "5060"
				});
				putMessage(oMessageObject);
			}
		}
		function configureMessageHandlingAsPromise() {
			coreApi.loadMessageConfiguration(sap.apf.core.messageDefinition, true);
			return loadMessagesFromConfigurationFileAsPromise(sap.apf.core.constants.resourceLocation.applicationMessageDefinitionLocation, false);
		}
		function loadMessagesFromConfigurationFileAsPromise(sResourceLocation, bResetRegistry) {
			var deferred = jQuery.Deferred();
			var sUrl = thisModule.getResourceLocation(sResourceLocation);
			if (sUrl !== "") {
				coreApi.ajax({
					url : sUrl,
					dataType : "json",
					success : parseMessageConfigurationFile,
					error : function(oJqXHR, sStatus, sError, originalMessageObject) {
						
						var oMessageObject = messageHandler.createMessageObject({
							code : "5058",
							aParameters : [sStatus, sError, sUrl ]
						});
						if (originalMessageObject) {
							oMessageObject.setPrevious(originalMessageObject);
						}
						putMessage(oMessageObject);
					},
					async : true
				});
			} else {
				deferred.resolve();				
			}
			return deferred.promise();
			
			function parseMessageConfigurationFile(oData, sStatus, oJqXHR) {
				var oMessageExplainingContext;
				var oTimeoutMessage = oInject.functions.checkForTimeout(oJqXHR);
				
				if (!oTimeoutMessage) {
					if (oData.messageConfiguration) {
						coreApi.loadMessageConfiguration(oData.messageConfiguration.definitions, bResetRegistry);
					}
				} else {
					oMessageExplainingContext = messageHandler.createMessageObject({
						code : "5067"
					});
					oMessageExplainingContext.setPrevious(oTimeoutMessage);
					putMessage(oMessageExplainingContext);
				}
				deferred.resolve();
			}
		}

		function checkPersistenceConfiguration(oConfig) {
			var oMessageObject;
			if (!oConfig || !oConfig.path) {
				oMessageObject = messageHandler.createMessageObject({
					code : "5066"
				});
				putMessage(oMessageObject);
			}
			if (!oConfig.path.service) {
				oMessageObject = messageHandler.createMessageObject({
					code : "5067"
				});
				putMessage(oMessageObject);
			}
			if (oConfig.analyticalConfiguration) {
				if (!oConfig.analyticalConfiguration.service) {
					oMessageObject = messageHandler.createMessageObject({
						code : sap.apf.core.constants.message.code.errorInAnalyticalConfig,
						rawText : "service or entity set are missing in analytical configuration in the application configuration"
					});
					putMessage(oMessageObject);
				}
			}
		}
		function checkSmartBusinessConfiguration(oConfig) {
			var oMessageObject;
			if (oConfig.evaluations && !oConfig.evaluations.service) {
				oMessageObject = messageHandler.createMessageObject({
					code : "5063"
				});
				putMessage(oMessageObject);
			}
			if (oConfig.evaluations && (!oConfig.evaluations.type || oConfig.evaluations.type !== "smartBusinessRequest")) {
				oMessageObject = messageHandler.createMessageObject({
					code : "5062",
					rawText : "type in Smart Business configuration is not smartBusinessRequest"
				});
				putMessage(oMessageObject);
			}
			if (oConfig.evaluations && !oConfig.evaluations.entityType) {
				oMessageObject = messageHandler.createMessageObject({
					code : "5061"
				});
				putMessage(oMessageObject);
			}
		}
		/**
		 * @description This function returns the path of a specified resource.
		 * @param {string} sResourceIdentifier type sap.apf.core.constants.resourceLocation.*
		 * @returns {string} Resource path
		 */
		this.getResourceLocation = function(sResourceIdentifier) {
			return oHT.getItem(sResourceIdentifier);
		};
		/**
		 * @description This function returns the configuration for the persistence (of the path).
		 * @returns {object} persistence configuration object
		 */
		this.getPersistenceConfiguration = function() {
			var deferredPersistenceConfiguration = jQuery.Deferred();
			deferredConfigurationLoaded.done(function(){
				deferredPersistenceConfiguration.resolve(oPersistenceConfiguration);
			});
			return deferredPersistenceConfiguration;
		};
		/**
		 * @description This function returns the properties of the configuration file, which are not used internally.
		 * @returns {object} Copy of properties in configuration
		 */
		this.getConfigurationProperties = function() {
			var deferredConfigProperties = jQuery.Deferred();
			oInject.corePromise.done(function(){
				deferredConfigProperties.resolve(oConfigurationProperties);
			});
			return deferredConfigProperties;
		};
		/**
		 * @description sets  application configuration in JSON object format and loads the ressources and analytical configuration.
		 * Loads only once. When called twice or more then skips processing and returns immediately.
		 */
		function loadAnalyticalConfigurationAndRessources() {
			var uriGenerator = sap.apf.core.utils.uriGenerator;
			var property, sbService, persistenceServiceRoot;
			var manifest = oInject.manifests.manifest;
			var baseManifest = oInject.manifests.baseManifest;
			var oMessageObject;
			if (deferredConfigurationLoaded.state() === 'resolved') {
				return;
			}
			var baseComponentUri = uriGenerator.getBaseURLOfComponent(sap.apf.utils.getComponentNameFromManifest(oInject.manifests.baseManifest));
			var componentUri = uriGenerator.getBaseURLOfComponent(sap.apf.utils.getComponentNameFromManifest(oInject.manifests.manifest));

			if (manifest["sap.app"].dataSources && manifest["sap.app"].dataSources.PathPersistenceServiceRoot) {
				persistenceServiceRoot = manifest["sap.app"].dataSources.PathPersistenceServiceRoot.uri;
			} else {
				oMessageObject = messageHandler.createMessageObject({
					code : "5064"
				});
				putMessage(oMessageObject);
			}
			var apfUiTextBundle = baseManifest["sap.app"].i18n;
			apfUiTextBundle = uriGenerator.addRelativeToAbsoluteURL(baseComponentUri, apfUiTextBundle);
			var applicationUiTextBundle = manifest["sap.app"].i18n;
			applicationUiTextBundle = uriGenerator.addRelativeToAbsoluteURL(componentUri, applicationUiTextBundle);
			var title = manifest["sap.app"].title;
			var titleKey = sap.apf.utils.createPseudoGuid();
			coreApi.registerTextWithKey(titleKey, title);
			var analyticalConfigurationId = coreApi.getStartParameterFacade().getAnalyticalConfigurationId();
			var analyticalConf = "";
			if (manifest["sap.app"].dataSources && manifest["sap.app"].dataSources.AnalyticalConfigurationLocation && manifest["sap.app"].dataSources.AnalyticalConfigurationLocation.uri) {
				analyticalConf = manifest["sap.app"].dataSources.AnalyticalConfigurationLocation.uri;
				analyticalConf = uriGenerator.addRelativeToAbsoluteURL(componentUri, analyticalConf);
			}
			if (!analyticalConfigurationId && !analyticalConf) {
				oMessageObject = messageHandler.createMessageObject({
					code : "5065"
				});
				putMessage(oMessageObject);
			}
			var oApplicationConfiguration = {
				"appName" : titleKey,
				"appTitle" : titleKey,
				"analyticalConfigurationLocation" : analyticalConf,
				"textResourceLocations" : {
					"apfUiTextBundle" : apfUiTextBundle,
					"applicationUiTextBundle" : applicationUiTextBundle
				},
				"persistence" : {
					"path" : {
						"service" : persistenceServiceRoot
					}
				}
			};
			if (manifest["sap.apf"] && manifest["sap.apf"].appSpecificParameters) {
				for(property in manifest["sap.apf"].appSpecificParameters) {
					oApplicationConfiguration[property] = manifest["sap.apf"].appSpecificParameters[property];
				}
			}
			if (useLrepProxy()) {
				Proxy = sap.apf.core.LayeredRepositoryProxy;
			}
			if (manifest["sap.app"].dataSources && manifest["sap.app"].dataSources.SmartBusiness) {
				sbService = manifest["sap.app"].dataSources.SmartBusiness.uri;
				oApplicationConfiguration.smartBusiness = {
					runtime : {
						service : sbService
					}
				};
			}
			if (manifest["sap.app"].dataSources && manifest["sap.app"].dataSources.LogicalSystem) {
				oApplicationConfiguration.persistence.logicalSystem = {
					service : manifest["sap.app"].dataSources.LogicalSystem.uri
				};
			}
			processApplicationConfiguration({
				applicationConfiguration : oApplicationConfiguration
			}, analyticalConfigurationId);
			
			configureMessageHandlingAsPromise().done(function(){
				if (analyticalConfigurationId) {
					loadAnalyticalConfigFromService(analyticalConfigurationId);
				} else {
					loadAnalyticalConfigFromFile();
				}
			});
		}
		function setDefaultLocations() {
			var sApfLocation = coreApi.getUriGenerator().getApfLocation();
			oHT.setItem(sap.apf.core.constants.resourceLocation.apfUiTextBundle, sApfLocation + "resources/i18n/apfUi.properties");
			oHT.setItem(sap.apf.core.constants.resourceLocation.applicationMessageDefinitionLocation, "");
			oHT.setItem(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle, "");
			oHT.setItem(sap.apf.core.constants.resourceLocation.applicationUiTextBundle, "");
			oHT.setItem(sap.apf.core.constants.resourceLocation.analyticalConfigurationLocation, "");
		}
		function processApplicationConfiguration(conf, analyticalConfigurationId) {
			function saveRestrictedCopyOfApplicationConfiguration(oApplicationConfiguration) {
				oConfigurationProperties = jQuery.extend(true, {}, oApplicationConfiguration);
				delete oConfigurationProperties.type;
				delete oConfigurationProperties.analyticalConfigurationLocation;
				delete oConfigurationProperties.applicationMessageDefinitionLocation;
				delete oConfigurationProperties.textResourceLocations;
				delete oConfigurationProperties.persistence;
			}
			var oApplicationConfiguration = conf.applicationConfiguration;
			saveRestrictedCopyOfApplicationConfiguration(oApplicationConfiguration);
			var oTextResourceLocations = conf.applicationConfiguration.textResourceLocations;
			oPersistenceConfiguration = conf.applicationConfiguration.persistence;
			checkPersistenceConfiguration(oPersistenceConfiguration);
			if (!oPersistenceConfiguration.path.entitySet) {
				oPersistenceConfiguration.path.entitySet = sap.apf.core.constants.entitySets.analysisPath;
			}
			if (conf.applicationConfiguration.smartBusiness) {
				oSmartBusinessConfiguration = conf.applicationConfiguration.smartBusiness;
				checkSmartBusinessConfiguration(oSmartBusinessConfiguration);
			}
			var oMessageObject;
			var sUrl;
			var oProperty;
			for (oProperty in sap.apf.core.constants.resourceLocation) {
				if (!sap.apf.core.constants.resourceLocation.hasOwnProperty(oProperty)) {
					continue;
				}
				if (oProperty === sap.apf.core.constants.resourceLocation.analyticalConfigurationLocation && analyticalConfigurationId ) {
					continue;
				}
				if (oApplicationConfiguration[oProperty] !== undefined) {
					sUrl = oApplicationConfiguration[oProperty];
				} else if (oTextResourceLocations[oProperty] !== undefined) {
					sUrl = oTextResourceLocations[oProperty];
				} else {
					continue;
				}
				if (oInject.manifests) { //do not check file existence in case of valid manifest
					oHT.setItem(oProperty, sUrl);
				} else if (oProperty === sap.apf.core.constants.resourceLocation.apfUiTextBundle || oInject.instances.fileExists.check(sUrl)) {
					oHT.setItem(oProperty, sUrl);
				} else if (!analyticalConfigurationId) {
					oMessageObject = messageHandler.createMessageObject({
						code : "5059",
						aParameters : [ sUrl, oProperty ]
					});
					putMessage(oMessageObject);
				}

			}
		}
		function putMessage(messageObject){
			messageHandler.putMessage(messageObject);		
		}
		function resolveCorePromiseAfterResourceLoading() {
			var sApfBundleUrl;
			var sApplicationUIBundleUrl;
			var sApplicationMessageBundleURL;

			jQuery.when(deferredConfigurationLoaded).done(function(){
				sApfBundleUrl = thisModule.getResourceLocation(sap.apf.core.constants.resourceLocation.apfUiTextBundle);
				sApplicationUIBundleUrl = thisModule.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
				sApplicationMessageBundleURL =  thisModule.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle);

				oInject.functions.initTextResourceHandlerAsPromise(sApfBundleUrl, sApplicationUIBundleUrl, sApplicationMessageBundleURL).done(function(){
					oInject.corePromise.resolve();	
				});
			});	
		}
		if (oInject.manifests && oInject.manifests.manifest) {
			loadAnalyticalConfigurationAndRessources();
		} 
		if (oInject.corePromise) {
			resolveCorePromiseAfterResourceLoading();
		}
	};
}());
