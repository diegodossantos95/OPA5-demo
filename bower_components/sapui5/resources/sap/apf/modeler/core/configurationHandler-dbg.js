/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare("sap.apf.modeler.core.configurationHandler");
jQuery.sap.require('sap.apf.modeler.core.configurationEditor');
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.modeler.core.configurationObjects");
(function() {
	'use strict';
	/**
	 * @private
	 * @class Configuration Handler manages the different configurations for an application
	 * @param {Object} inject Injection of required APF objects
	 * @param {Object} inject.instance Injected instances
	 * @param {Object} inject.instances.messageHandler messageHandler instance
	 * @param {Object} inject.instances.persistenceProxy persistenceProxy instance
	 * @param {Object} inject.constructors Injected constructors
	 * @param {Object} inject.constructors.ConfigurationEditor ConfigurationEditor constructor
	 * @param {Object} inject.constructors.Hashtable Hashtable constructor
	 * @param {Object} inject.constructors.LazyLoader LazyLoader constructor
	 * @param {Function} inject.functions.getApplication Function for getting application data for a given id
	 */
	sap.apf.modeler.core.ConfigurationHandler = function(inject) {
		var that = this;
		var messageHandler = inject.instances.messageHandler;
		var persistenceProxy = inject.instances.persistenceProxy;
		var ConfigurationEditor = inject.constructors.ConfigurationEditor;
		var Hashtable = inject.constructors.Hashtable;
		var LazyLoader = inject.constructors.LazyLoader;
		var configList = new Hashtable(messageHandler);
		var initialConfigList = new Hashtable(messageHandler);
		var lazyLoadersForConfigEditor = new Hashtable(messageHandler);
		var memorizedConfigurationEditorInstances = new Hashtable(messageHandler);
		var applicationId, textPool;
		var injectLazyLoader = {
			constructors : {
				Hashtable : Hashtable
			},
			instances : {
				messageHandler : messageHandler
			}
		};
		/**
		 * @private
		 * @see sap.apf.modeler.core.TextPool#exportTexts
		 */
		this.exportTexts = function(configurationId) {
			var analyticalConfigurationName = this.getConfiguration(configurationId).AnalyticalConfigurationName;
			return textPool.exportTexts(analyticalConfigurationName);
		};
		this.getTextPool = function() {
			return textPool;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#setApplicationId
		 * @description Sets the application id
		 * @param {String} id Application identifier
		 * @param {Array} existingAnalyticalConfigurations (fetched from DB)
		 * @param {sap.apf.core.modeler.TextPool} oTextPool existing text pool
		 */
		this.setApplicationIdAndContext = function(id, existingAnalyticalConfigurations, oTextPool) {
			textPool = oTextPool || textPool;
			configList = new Hashtable(messageHandler);
			var i, len = existingAnalyticalConfigurations.length;
			for(i = 0; i < len; i++) {
				configList.setItem(existingAnalyticalConfigurations[i].AnalyticalConfiguration, existingAnalyticalConfigurations[i]);
				initialConfigList.setItem(existingAnalyticalConfigurations[i].AnalyticalConfiguration, existingAnalyticalConfigurations[i].AnalyticalConfigurationName);
			}
			applicationId = id;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#getApplicationId
		 * @description Returns the application ID
		 * @returns {string} Application ID
		 */
		this.getApplicationId = function() {
			return applicationId;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#setConfiguration
		 * @description Creates or updates the configuration header information.
		 * @param {Object} configObject Configuration object
		 * @param {String} configObject.AnalyticalConfigurationName Configuration name
		 * @param {String} [id] Configuration identifier
		 */
		this.setConfiguration = function(configObject, id) {
			configObject.AnalyticalConfiguration = id || getTempId();
			configObject.Application = applicationId;
			configList.setItem(configObject.AnalyticalConfiguration, configObject);
			return configObject.AnalyticalConfiguration;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#getList
		 * @description Returns a list of configurations as array
		 * @returns {Array.<Object>} Array of configurations
		 */
		this.getList = function() {
			var configurationArray = [];
			var addConfigToArray = function(key, item) {
				configurationArray.push(item);
			};
			configList.each(addConfigToArray);
			return configurationArray;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#getConfiguration
		 * @description Returns a configuration object for a given id
		 * @param {String} id Configuration identifier
		 * @returns {Object} Configuration object
		 */
		this.getConfiguration = function(id) {
			return configList.getItem(id);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#loadConfiguration
		 * @description Returns a configuration editor for a given configuration that is specified by its id
		 * @param {String|object} configuration If string, value is configuration id. If object, configuration id is contained in property "id" 
		 * @param {function(configurationEditor)} callback Callback returns after configuration editor has been instantiated
		 * @param {sap.apf.modeler.core.ConfigurationEditor} callback.configurationEditor Configuration editor instance
		 */
		this.loadConfiguration = function(configuration, callback) {
			var lazyLoaderForConfigEditor, configId = configuration.id || configuration;
			if (!configuration.updateExisting) {
				lazyLoaderForConfigEditor = lazyLoadersForConfigEditor.getItem(configId);
			}
			if (!lazyLoaderForConfigEditor) {
				lazyLoaderForConfigEditor = new LazyLoader(injectLazyLoader, loadConfigurationEditor);
				lazyLoadersForConfigEditor.setItem(configId, lazyLoaderForConfigEditor);
			}
			lazyLoaderForConfigEditor.asyncGetInstance(configId, callbackAfterAsyncGet);
			function callbackAfterAsyncGet(instance, messageObject, configurationId) {
				callback(instance, messageObject);
			}
			function loadConfigurationEditor(configId, callbackAfterLoad, oldInstance) {
				var newInject = {
					instances : {
						coreApi : inject.instances.coreApi,
						messageHandler : messageHandler,
						configurationHandler : that,
						persistenceProxy : persistenceProxy,
						textPool : textPool,
						metadataFactory : inject.instances.metadataFactory
					},
					constructors : {
						Hashtable : Hashtable,
						Step : inject.constructors.Step,
						HierarchicalStep : inject.constructors.HierarchicalStep,
						SmartFilterBar: inject.constructors.SmartFilterBar,
						FacetFilter : inject.constructors.FacetFilter,
						NavigationTarget : inject.constructors.NavigationTarget,
						Representation : inject.constructors.Representation,
						ConfigurationObjects : inject.constructors.ConfigurationObjects,
						ElementContainer : inject.constructors.ElementContainer,
						ConfigurationFactory : inject.constructors.ConfigurationFactory,
						RegistryProbe : inject.constructors.RegistryProbe
					}
				};
				new ConfigurationEditor(configuration, newInject, function(instance, messageObject) {
					callbackAfterLoad(configId, instance, messageObject);
				}); // this object will bind itself to the callback --> what does this mean? TODO clarify
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#resetConfiguration
		 * @description Resets the buffered configuration state for a certain Id to the previously saved state
		 * @param {String} configurationId - Configuration id 
		 * @return {String} Returns the removed configuration id on success, else undefined
		 */
		this.resetConfiguration = function(configurationId) {
			var currentConfig;
			if (lazyLoadersForConfigEditor.hasItem(configurationId)) {
				currentConfig = configList.getItem(configurationId);
				currentConfig.AnalyticalConfigurationName = initialConfigList.getItem(configurationId);
				lazyLoadersForConfigEditor.removeItem(configurationId);
				return configurationId;
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#updateConfigurationName
		 * @description Adjust of the configuration name
		 */
		this.updateConfigurationName = function(configurationId, configurationName) {
			initialConfigList.setItem(configurationId, configurationName);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#copyConfiguration
		 * @description Returns a new configuration editor for a copied configuration
		 * @param {String} id - Configuration identifier for the configuration that shall be copied
		 * @param {function(newConfigurationId)} callback - Callback returns after the editor with the copied configuration has been instantiated
		 * @param {string} callback.newConfigurationId - New (temporary) configuration Id of the copy result (use loadConfiguration to access it)
		 */
		this.copyConfiguration = function(id, callback) {
			var configObject = this.getConfiguration(id);
			if (!configObject) {
				callback(null); //Error exit: Source configuration does not exist
				return;
			}
			that.loadConfiguration(id, callbackAfterLoad);
			function callbackAfterLoad(configEditor) {
				var newId, newConfigEditor, newLazyLoader, newConfigObject;
				newConfigObject = sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(configObject);
				newId = getTempId();
				newConfigObject.AnalyticalConfiguration = newId;
				that.setConfiguration(newConfigObject, newId);
				newConfigEditor = configEditor.copy(newId);
				newLazyLoader = new LazyLoader(injectLazyLoader, undefined, {
					id : newId,
					instance : newConfigEditor
				});
				lazyLoadersForConfigEditor.setItem(newId, newLazyLoader);
				callback(newId); //Return Id of deeply copied configuration
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#replaceConfigurationId
		 * @description Replaces temporary configuration id with server generated id
		 * @param {String} tempId Temporary id
		 * @param {String} serverGeneratedId Server generated id
		 */
		this.replaceConfigurationId = function(tempId, serverGeneratedId) {
			if (tempId.indexOf("apf1972-") === 0) {
				var tempConfigListItem = configList.getItem(tempId);
				var tempConfigEditor = lazyLoadersForConfigEditor.getItem(tempId).getInstance();
				var newLazyLoader = new LazyLoader(injectLazyLoader, undefined, {
					id : serverGeneratedId,
					instance : tempConfigEditor
				});
				tempConfigListItem.AnalyticalConfiguration = serverGeneratedId;
				configList.setItem(serverGeneratedId, tempConfigListItem);
				initialConfigList.setItem(serverGeneratedId, tempConfigListItem.AnalyticalConfigurationName);
				configList.removeItem(tempId);
				lazyLoadersForConfigEditor.setItem(serverGeneratedId, newLazyLoader);
				lazyLoadersForConfigEditor.removeItem(tempId);
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#exportConfiguration
		 * @description Exports a configuration for a given id
		 * @param {String} configId Configuration id
		 * @param {function(String|Null)} callback Callback returns the configuration string after configuration export is complete or Null in case of error
		 */
		this.exportConfiguration = function(configId, callback) {
			var objectForExport;
			this.loadConfiguration(configId, callbackAfterLoadConfiguration);
			function callbackAfterLoadConfiguration(configEditor) {
				if (!configEditor.isSaved()) {
					messageHandler.putMessage(messageHandler.createMessageObject({
						code : "11007",
						aParameters : [ configId ]
					}));
					callback(null);
				} else {
					var appInformation = inject.functions.getApplication(applicationId);
					var configName = that.getConfiguration(configId).AnalyticalConfigurationName;
					objectForExport = configEditor.serialize();
					objectForExport.configHeader = {
						Application : applicationId,
						ApplicationName : appInformation.ApplicationName,
						SemanticObject : appInformation.SemanticObject,
						AnalyticalConfiguration : configId,
						AnalyticalConfigurationName : configName,
						UI5Version : sap.ui.version
					};
					persistenceProxy.readEntity("configuration", function(result, metadata, messageObject) {
						if (messageObject) {
							messageHandler.putMessage(messageHandler.createMessageObject({
								code : "5022",
								aParameters : [ configId ]
							}));
							callback(null);
						} else {
							objectForExport.configHeader.CreationUTCDateTime = result.CreationUTCDateTime;
							objectForExport.configHeader.LastChangeUTCDateTime = result.LastChangeUTCDateTime;
							objectForExport = JSON.stringify(objectForExport, null, '\t');
							callback(objectForExport, configName);
						}
					}, [ {
						name : "AnalyticalConfiguration",
						value : configId
					} ], [ "CreationUTCDateTime", "LastChangeUTCDateTime" ], applicationId);
				}
			}
		};
		/**
		* @private
		* @function
		* @name sap.apf.modeler.core.ConfigurationHandler#memorizeConfiguration
		* @description Memorizes a configuration for a given id
		* @param {String} configId Configuration id
		* @returns {String|Null} Returns the memorized configuration id or null if the id does not exist
		*/
		this.memorizeConfiguration = function(configId) {
			var configEditor, lazyLoaderForConfigEditor;
			lazyLoaderForConfigEditor = lazyLoadersForConfigEditor.getItem(configId);
			if (!lazyLoaderForConfigEditor) {
				return null;
			}
			configEditor = lazyLoaderForConfigEditor.getInstance();
			if (configEditor) {
				memorizedConfigurationEditorInstances.setItem(configId, configEditor.copy(configId));
				return configId;
			}
			return null;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#restoreMemorizedConfiguration
		 * @description Restore a memorized configuration for a given id
		 * @param {String} configId Configuration id
		 * @returns {sap.apf.modeler.core.ConfigurationEditor|Null} Returns the instance of the restored configuration editor or null if nothing was memorized for this id
		 */
		this.restoreMemorizedConfiguration = function(configId) {
			var newLazyLoader, configEditor;
			configEditor = memorizedConfigurationEditorInstances.removeItem(configId);
			if (configEditor) {
				newLazyLoader = new LazyLoader(injectLazyLoader, undefined, {
					id : configId,
					instance : configEditor
				});
				lazyLoadersForConfigEditor.setItem(configId, newLazyLoader);
				return configEditor;
			}
			return null;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#removeConfiguration
		 * @description Removes configuration from hashtable and server
		 * @param {String} configurationId Configuration ID
		 * @param {function(configurationId, metadata, messageObject)} removeCallback Callback returns after remove operation has been executed 
		 * @param {String} removeCallback.configurationId ID of removed configuration
		 * @param {sap.apf.core.EntityTypeMetadata} removeCallback.metadata Metadata
		 * @param {sap.apf.core.MessageObject} removeCallback.messageObject MessageObject
		 */
		this.removeConfiguration = function(configurationId, removeCallback) {
			function callbackRemove(metadata, messageObject) {
				if (!messageObject) {
					configList.removeItem(configurationId);
					lazyLoadersForConfigEditor.removeItem(configurationId);
				}
				removeCallback(configurationId, metadata, messageObject);
			}
			if (configurationId.indexOf("apf1972-") !== 0) {
				persistenceProxy.remove("configuration", [ {
					name : "AnalyticalConfiguration",
					value : configurationId
				} ], callbackRemove, undefined, applicationId);
			} else {
				configList.removeItem(configurationId);
				lazyLoadersForConfigEditor.removeItem(configurationId);
				removeCallback(configurationId, undefined, undefined);
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ConfigurationHandler#removeAllConfigurations
		 * @description Remove all configurations (after delete of corresponding application)
		 */
		this.removeAllConfigurations = function() {
			configList = new Hashtable(messageHandler);
		};
		function getTempId() {
			return "apf1972-" + (sap.apf.utils.createPseudoGuid(32));
		}
	};
}());
