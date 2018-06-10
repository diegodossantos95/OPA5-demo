jQuery.sap.declare("sap.apf.core.layeredRepositoryProxy");
jQuery.sap.require('sap.apf.utils.utils');
jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.ui.fl.LrepConnector');
jQuery.sap.require('sap.apf.utils.parseTextPropertyFile');
(function() {
	'use strict';
	/**
	 * @param {String} serviceConfiguration -  this param is yet of no interest in case of layered repository proxy
	 * @param {object] inject injection of instances and constructor functions
	 * @param {sap.apf.core.MessageHandler} inject.instances.messageHandler
	 * @param {sap.ui.fl.LrepConnector} inject.constructors.LrepConnector connector interface to the layered repository
	 */
	sap.apf.core.LayeredRepositoryProxy = function(serviceConfiguration, inject) {
		var coreApi = inject.instances.coreApi;
		var connector;
		var messageHandler = inject.instances.messageHandler;
		var namespace = 'sap/apf/dt';
		var textfileName = 'text.properties';
		var applicationTextsTable = new sap.apf.utils.Hashtable(inject.instances.messageHandler);
		var applicationConfigurationsTable = new sap.apf.utils.Hashtable(inject.instances.messageHandler);
		var changeList;
		var changeListHasBeenFetched = false;
		/**
		 * @private
		 * @returns {sap.ui.fl.LrepConnector} connector
		 */
		this.getConnector = function() { 
			return connector; 
		};
		/**
		 * odata get operation for specific single entity (application or configuration) in asynchronous mode
		 * @param {string} entitySet value from sap.apf.core.constants.entitySets
		 * @param {function} callback function of form fn(entityData, metadata, messageObject)
		 * @param {object[]} [inputParameters]
		 * @param {string[]} [selectList] holds all properties, that shall be in the select list
		 * @param {string} application guid of the Application
		 * @param {string} options.layer has values VENDOR, PARTNER, CUSTOMER, and ALL, if the highest conf shall be read.
		 * @param {object} directives : 'noMetadata' : true/false indicates, that no metadata should be read
		 */
		this.readEntity = function(entitySetName, callback, inputParameters, selectList, application, options, directives) {
			var configuration = inputParameters[0].value;
			var applicationNamespace = getApplicationNamespace(application);
			var promises = [];
			var serializedConfigurationRequested = false;
			var metadataIndex = 1;
			var configurationDataIndex = 0;
			var metadata;
			var promiseForRead;
			var data;
			var i;
			var numSelections;
			var resultingData;
			var selection;
			var configFile;
			var layer = determineLayerFromOptions(options);
			var promiseForGetConfiguration;

			messageHandler.check(entitySetName === 'configuration', "layered repository proxy - only read entity of configuration supported");

			if (directives && directives.noMetadata) {
				connector.getStaticResource(applicationNamespace, configuration, 'apfconfiguration').then(function(results){

					data = {
							Application : application
					};

					configFile = results.response;
					if (typeof configFile === 'string') {
						data.SerializedAnalyticalConfiguration = configFile;
					} else {
						data.SerializedAnalyticalConfiguration = JSON.stringify(configFile);
					}

					data.AnalyticalConfiguration = configuration;
					callback(data, getMetadata());

				}, function(error) {
					callback(undefined, getMetadata(), createErrorMessageObject({ code : '5221', aParameters : [ application, configuration]}, error && error.messages));
				});
				return;
			}
			if (selectList === undefined || selectList.indexOf("SerializedAnalyticalConfiguration") >= 0) {
				serializedConfigurationRequested = true;
				if (layer === 'VENDOR') {
					var mOptions = {
							contentType : 'application/json'
					};
					var aParams = [];
					aParams.push({ name : "layer", value : layer });
					aParams.push({ name: "dt", value: "true" });
					var sRequestPath = "/sap/bc/lrep/content/" + applicationNamespace + "/" + configuration + '.apfconfiguration';
					sRequestPath += connector._buildParams(aParams);
					promiseForGetConfiguration = connector.send(sRequestPath, 'GET', undefined, mOptions);
				} else {
					promiseForGetConfiguration = connector.getStaticResource(applicationNamespace, configuration, 'apfconfiguration');	
				}
				promises.push(promiseForGetConfiguration);
			} else {
				metadataIndex = 0;
			}
			metadata = getConfigurationMetadataFromHashTable(application, configuration);
			if (metadata === undefined) {
				var promiseForGetConfigurationMetadata = connector.getFileAttributes(applicationNamespace, configuration, 'apfconfiguration', layer);
				promises.push(promiseForGetConfigurationMetadata);
			}
			promiseForRead = Promise.all(promises);
			promiseForRead.then(function(aResults) {
				metadata = getConfigurationMetadataFromHashTable(application, configuration);
				if (metadata === undefined) {
					metadata = aResults[metadataIndex].response;
				}
				addConfigurationToHashTable(application, configuration, metadata);
				data = renameProperties(application, metadata);
				if (serializedConfigurationRequested) {
					configFile = aResults[configurationDataIndex].response;
					if (typeof configFile === 'string') {
						data.SerializedAnalyticalConfiguration = configFile;
					} else {
						data.SerializedAnalyticalConfiguration = JSON.stringify(configFile);
					}
				}
				data.AnalyticalConfiguration = configuration;
				if (selectList && selectList.length !== 0) {

					numSelections = selectList.length;
					resultingData = {};
					for(i = 0; i < numSelections; i++) {
						selection = selectList[i];
						resultingData[selection] = data[selection];
					}
					data = resultingData;
				}
				callback(data, getMetadata());
			}, function(error) {
				callback(undefined, getMetadata(), createErrorMessageObject({ code : '5221', aParameters : [ application, configuration]}, error && error.messages));
			});

		};
		/**
		 * multiple change operations in batch
		 * @param {object[]} requestConfigurations with properties entitySetName, filter, selectList, inputParameters, method
		 * @param {function} callback with parameters undefined or messageObject in case of Error
		 * @param {string} application guid associated with the texts to be deleted
		 */
		this.doChangeOperationsInBatch = function(requestConfigurations, callback, application) {
			function callbackFromUpdateTexts(metadata, messageObject) {
				callback(messageObject);
			}
			var i, request;
			function doNothing() {
			}
			initTexts(application).then(function() {
				for(i = 0; i < requestConfigurations.length; i++) {
					request = requestConfigurations[i];
					request.application = application;
					if (request.method === 'DELETE' && request.entitySetName === 'texts') {
						deleteText(request, doNothing);
					} else if (request.method === 'POST' && sap.apf.utils.isValidPseudoGuid(request.data.TextElement)) {
						createText(request.data, doNothing);
					} else {
						createText(request.data, doNothing);
					}
				}
				updateTexts(application, callbackFromUpdateTexts, true);
			}).fail(function(messageObject) {
				callback(messageObject);
			});

		};
		/**
		 * multiple reads in a batch operation - asynchronous
		 * @param {object[]} requestConfigurations with properties entitySetName, filter, selectList, inputParameters, method
		 * @param {function} callback with parameters data - array with results and messageObject 
		 */
		this.readCollectionsInBatch = function(requestConfigurations, callback) {
			var numberOfRequests = requestConfigurations.length;
			var result = [];
			var requestsFulfilled = 0;
			function createCallbackForReadCollection(callNumber) {
				function callbackFromProcessRequest(data, metadata, messageObject) {
					if (messageObject) {
						callback(undefined, messageObject);
					} else {
						requestsFulfilled++;
						result[callNumber] = data;
						if (requestsFulfilled === numberOfRequests) {
							callback(result);
						}
					}
				}
				return callbackFromProcessRequest;
			}
			for(var i = 0; i < numberOfRequests; i++) {
				var request = requestConfigurations[i];
				this.readCollection(request.entitySetName, createCallbackForReadCollection(i), request.inputParameters, request.selectList, request.filter);
			}
		};
		/**
		 * odata get operation for specific type (application or configuration) asynchronously
		 * @param {string} entitySetName value from sap.apf.core.constants.entitySets
		 * @param {function} callback function of form fn(result, metadata, messageObject)
		 * @param {object[]|undefined} [inputParameters]
		 * @param {string[]|undefined} [selectList] holds all properties, that shall be in the select list
		 * @param {sap.apf.core.utils.Filter} [filter] additional filter expressions 
		 * @param {string} options.layer has values VENDOR, PARTNER, CUSTOMER, and ALL, if the highest conf shall be read.
		 */
		this.readCollection = function(entitySetName, callback, inputParameters, selectList, filter, options) {
			var aTerms, application;
			var promiseForGetTexts;
			var layer;
			if	(options && options.layer) {
				layer = options.layer;
			} else {
				layer = "CUSTOMER";
			}

			var handleReceivedTexts = function(result, status) {
				if (status && (status === "error" || status === "timeout" || status === "abort" || status === "parsererror")) {
					callback(undefined, getMetadata(), createErrorMessageObject({ code : '5222', aParameters : [ application ]}, [status]));
					return;
				}
				var textTable = new sap.apf.utils.Hashtable(messageHandler);
				var texts = [];
				var textFile = (result && result.response) || (result && result.responseText) || "";
				var parseResult = sap.apf.utils.parseTextPropertyFile(textFile, { instances : { messageHandler : messageHandler }});
				var explainingMessageObject, currentMessageObject;
				if (parseResult.Messages.length > 0) {
					explainingMessageObject = messageHandler.createMessageObject({ code : '5416' });
					currentMessageObject = explainingMessageObject;
					parseResult.Messages.forEach(function(messageObject){
						currentMessageObject.setPrevious(messageObject);
						currentMessageObject = messageObject;
					});
				}
				textTable = new sap.apf.utils.Hashtable(messageHandler);
				parseResult.TextElements.forEach(function(text) {
					if (text.TextElement) {
						textTable.setItem(text.TextElement, text);
						texts.push(text);
					}
				});
				applicationTextsTable.setItem(application, textTable);
				callback(texts, getMetadata(), explainingMessageObject);
			};

			if (entitySetName === 'application') {
				messageHandler.check(!inputParameters && !selectList && !filter, "unsupported parameters when calling readCollection for application");
				readCollectionOfApplications(callback, layer);
			} else if (entitySetName === 'texts') {
				aTerms = filter.getFilterTermsForProperty('Application');
				application = aTerms[0].getValue();


				promiseForGetTexts = textLoading(application, options);

				promiseForGetTexts.then(function(result) {
					handleReceivedTexts(result);
				}, function(error) {
					callback(undefined, getMetadata(),  createErrorMessageObject({ code : '5222', aParameters : [ application ]}, error && error.messages));
				});
			} else if (entitySetName === 'configuration') {
				aTerms = filter.getFilterTermsForProperty('Application');
				application = aTerms[0].getValue();
				listConfigurations(application, callback, selectList);
			}
		};
		/**
		 * odata delete operation for specific type (application or configuration)
		 * @param {string} entitySetName value from sap.apf.core.constants.entitySets
		 * @param {object[]} [inputParameters]
		 * @param {function} callback function of form fn(metadata, messageObject)
		 * @param {sap.apf.core.utils.Filter} [filter]
		 * @param {string} application guid of the Application
		 * @param {string} layer, if nothing is set: fallback to "CUSTOMER" layer 
		 */
		this.remove = function(entitySetName, inputParameters, callback, filter, application, layer) {
			if(!layer){
				layer = "CUSTOMER";
			}
			if (entitySetName === 'application') {
				deleteApplication(inputParameters, callback, layer);
			} else if (entitySetName === 'configuration') {
				deleteConfiguration(inputParameters, callback, application, layer);
			} else {
				messageHandler.check(false, 'the remove operation on entity set ' + entitySetName + ' is currently not supported by the lrep proxy');
			}
		};
		/**
		 * odata post operation for specific type (application or configuration) - asynchronously
		 * @param {string} entitySetName value from sap.apf.core.constants.entitySets
		 * @param {object} data object with properties of object, that shall be posted
		 * @param {function} callback function of form fn(result, metadata, messageObject)
		 * @param {object} options special options for the layered repository
		 */
		this.create = function(entitySetName, data, callback,  options) {
			if (entitySetName === 'application') {
				createApplication(data, callback, options);
			} else if (entitySetName === 'configuration') {
				createConfiguration(data, callback,  options);
			} else if (entitySetName === 'texts') {
				createText(data, callback);
			} else {
				messageHandler.check(false, 'the create operation on entity set ' + entitySetName + ' is currently not supported by the lrep proxy');
			}
		};
		/**
		 * odata put operation for specific type (application or configuration)
		 * @param {string} entitySetName value from sap.apf.core.constants.entitySets
		 * @param {object} data object with properties of object, that shall be posted
		 * @param {function} callback function of form fn( metadata, messageObject)
		 * @param {object[]} [inputParameters]
		 */
		this.update = function(entitySetName, data, callback, inputParameters) {
			if (entitySetName === 'configuration') {
				updateConfiguration(data, callback);
			} else if (entitySetName === 'application') {
				updateApplication(data, callback);

			} else {
				messageHandler.check(false, 'the update operation on entity set ' + entitySetName + ' is currently not supported by the lrep proxy');
			}
		};
		function sendLrepDeepReadRequest(layer, fileType) {
			// /sap/bc/lrep/content/sap/apf/dt/?deep-read=true&metadata=true&sap-client=120&type=(apfconfiguration|apfapplication)&layer=(CUSTOMER|VENDOR)
			var mOptions = {
					async : true,
					contentType : 'application/json'
			};
			var aParams = [];

			aParams.push({ name : "layer", value : layer});
			aParams.push({ name : "deep-read", value : true});
			aParams.push({ name : "metadata", value : true});
			aParams.push({ name : "type", value : fileType});

			var sRequestPath = "/sap/bc/lrep/content/" + namespace + "/";

			sRequestPath += connector._buildParams(aParams);
			return connector.send(sRequestPath, 'GET', undefined, mOptions);
		}
		function getApplicationId(data) {
			var namespace = data.ns.split('/');
			return namespace[namespace.length - 2];
		}
		function getElementValueFromMetadata(data, elementName) {
			var value;
			data.metadata.forEach(function(element) {
				if (element.name === elementName) {
					value = element.value;
				}
			});
			return value;
		}
		/**
		 * reads all configuration files from vendor layer
		 * @returns {promise} the promise will get an array of object with { applicationText: title, configurationText: title, value: appId.configId}
		 */
		this.readAllConfigurationsFromVendorLayer = function (){
			var deferred = jQuery.Deferred();
			var configurations = [];
			sendLrepDeepReadRequest('VENDOR', 'apf*').then(function(result) {
				var applicationNames = {};
				result.response.forEach(function(data){
					if (data.fileType && data.fileType === 'apfapplication'){
						applicationNames[getApplicationId(data)] = getElementValueFromMetadata(data, 'apfdt-applname');
					}
				});
				result.response.forEach(function(data){
					var applicationId;
					var configurationId;
					var configurationName;

					if (data.fileType && data.fileType === "apfconfiguration") {
						applicationId = getApplicationId(data);
						configurationId = data.name;
						if (!(sap.apf.utils.isValidPseudoGuid(applicationId) && sap.apf.utils.isValidPseudoGuid(configurationId))) {
							return;
						}
						configurationName = getElementValueFromMetadata(data, 'apfdt-configname');
						configurations.push({ configurationText : configurationName, applicationText : applicationNames[applicationId], value : applicationId + '.' + configurationId });
					}
				});
				deferred.resolve(configurations);
			}, function(error) {
				deferred.reject(createErrorMessageObject({code : '5231'}, error && error.messages ));
			});
			return deferred.promise();
		};
		init();
		function init() {
			if (inject.constructors && inject.constructors.LrepConnector) {
				connector = inject.constructors.LrepConnector.createConnector();
			} else {
				connector = sap.ui.fl.LrepConnector.createConnector();
			}
			if (!connector._sClient) {
				connector._sClient = coreApi.getStartParameterFacade().getSapClient();
			}
		}
		function getConfigurationMetadataFromHashTable(application, configuration){
			var applicationHashtable = applicationConfigurationsTable.getItem(application);
			if (applicationHashtable === undefined) {
				return;
			}
			configuration = applicationHashtable.getItem(configuration);
			return configuration;
		}
		function addConfigurationToHashTable(application, configuration, configMetadata){
			var applicationHashtable = applicationConfigurationsTable.getItem(application);
			if (applicationHashtable === undefined) {
				applicationHashtable = new sap.apf.utils.Hashtable(messageHandler);
			}
			applicationHashtable.setItem(configuration, configMetadata);
			applicationConfigurationsTable.setItem(application, applicationHashtable);
		}
		function determineLayerFromOptions(options) {
			var layer = (options && options.layer) || "CUSTOMER";
			if (layer === "ALL") {
				return undefined; //"undefined" is LRep layer value that reads from all layers
			}
			return layer;
		}
		function createErrorMessageObject(messageDefinition, errorMessagesFromServer) {
			var messageObject = messageHandler.createMessageObject(messageDefinition);
			var messages = "";
			if (errorMessagesFromServer) {
				errorMessagesFromServer.forEach(function(message){
					messages = messages + message + ' ';
				});
				messageObject.setPrevious( messageHandler.createMessageObject({ code : 5220, aParameters : [ messages]}));
			}
			return messageObject;
		}
		function getMetadata() {
			return {};
		}
		function getApplicationNamespace(applicationId) {
			return namespace + '/' + applicationId;
		}
		function deleteText(data, callback) {
			var application = data.application;
			var textElement = data.inputParameters[0].value;
			var textTable;

			initTexts(application).done(function() {
				textTable = applicationTextsTable.getItem(application);
				textTable.removeItem(textElement);
				callback(data, getMetadata());
			}).fail(function(messageObject) {
				callback(undefined, getMetadata(), messageObject);
			});
		}
		function textLoading(application, options) {
			var mOptions;
			var aParams = [];
			var sRequestPath = "/sap/bc/lrep/content/";
			var layer = determineLayerFromOptions(options);

			sRequestPath += namespace + "/" + application + '/' + textfileName;
			if(layer){
				aParams.push({
					name : "layer",
					value : layer
				});
			}
			mOptions = {
					contentType : 'text/plain'
			};

			sRequestPath += connector._buildParams(aParams);
			return connector.send(sRequestPath, 'GET', undefined, mOptions);
		}
		function initTexts(application) {
			var deferred = jQuery.Deferred();
			var promise;
			var textTable = applicationTextsTable.getItem(application);


			var processReceivedTexts = function(result) {
				var textFile = (result && result.response) || (result && result.responseText) || "";
				var parseResult = sap.apf.utils.parseTextPropertyFile(textFile, { instances : { messageHandler : messageHandler }});

				textTable = new sap.apf.utils.Hashtable(messageHandler);
				parseResult.TextElements.forEach(function(text) {
					if (text.TextElement) {
						textTable.setItem(text.TextElement, text);
					}
				});

				applicationTextsTable.setItem(application, textTable);
				deferred.resolve({});
			};

			if (textTable === undefined) {

				promise = textLoading(application);
				promise.then(function(result) {
					processReceivedTexts(result);
				}, function(error) {
					deferred.reject(createErrorMessageObject({ code : '5222', aParameters : [ application ]}, error && error.messages));
				});

			} else {
				deferred.resolve({});
			}

			return deferred.promise();
		}
		function createText(data, callback) {
			var application = data.Application;
			if (data.TextElement === undefined || !sap.apf.utils.isValidGuid(data.TextElement)) {
				data.TextElement = sap.apf.utils.createPseudoGuid();
			}

			initTexts(application).done(function() {
				var textTable = applicationTextsTable.getItem(application);
				textTable.setItem(data.TextElement, data);
				callback(data, getMetadata());
			}).fail(function(messageObject) {
				callback(undefined, getMetadata(), messageObject);
			});
		}
		function updateTexts(applicationId, callback, doNotReadTexts) {
			var applicationNamespace = getApplicationNamespace(applicationId);
			var textsTable;

			function upsertTexts() {
				var textPropertyFile = sap.apf.utils.renderHeaderOfTextPropertyFile(applicationId, messageHandler);
				textPropertyFile = textPropertyFile + sap.apf.utils.renderTextEntries(textsTable, messageHandler);
				var promiseForUpdateTexts = connector.upsert(applicationNamespace, 'text', 'properties', "CUSTOMER", textPropertyFile, 'text/plain');
				promiseForUpdateTexts.then(function(result) {
					callback(getMetadata());
				}, function(error) {
					callback(getMetadata(), createErrorMessageObject({code: '5230', aParameters: [applicationId]}, error && error.messages));
				});
			}

			textsTable = applicationTextsTable.getItem(applicationId);
			if (!textsTable) {
				callback(getMetadata());
				return;
			}
			if (doNotReadTexts) {
				upsertTexts();
			} else {
				var promise = textLoading(applicationId);
				promise.then(function(result) {
					var textFile = (result && result.response) || "";
					var parseResult = sap.apf.utils.parseTextPropertyFile(textFile, {
						instances : {
							messageHandler : messageHandler
						}
					});
					parseResult.TextElements.forEach(function(text) {
						if (text.TextElement) {
							textsTable.setItem(text.TextElement, text);
						}
					});
					upsertTexts();
				}, function(error) {
					callback(getMetadata(), createErrorMessageObject({ code : '5222', aParameters : [ applicationId ]}, error && error.messages));
				});
			}
		}
		function listConfigurations(application, callback, selectList) {
			var configurations = [];
			var applicationNamespace = getApplicationNamespace(application);
			var params = connector._buildParams([{
				name: "layer",
				value: "CUSTOMER"
			},{
				name: "metadata",
				value: "true"
			},{
				name: "type",
				value: "apfconfiguration"
			}]);
			var promise = connector.send("/sap/bc/lrep/content/" + applicationNamespace + params);
			promise.then(function(result) {
				var files = result.response;
				files.forEach(function(file){
					if(file.fileType === "apfconfiguration"){
						file.metadata.forEach(function(metadata){
							if(metadata.name === "apfdt-configname"){
								configurations.push({
									AnalyticalConfiguration : file.name,
									Application : application,
									AnalyticalConfigurationName : metadata.value
								});
							}
						});
					}
				});
				if (selectList && selectList.indexOf("SerializedAnalyticalConfiguration") >= 0 ){
					var configurationPromises = [];
					configurations.forEach(function(configuration){
						var configurationPromise = jQuery.Deferred();
						configurationPromises.push(configurationPromise);
						connector.getStaticResource(applicationNamespace, configuration.AnalyticalConfiguration, 'apfconfiguration').then(function(responseObject){
							if(responseObject.response){
								configuration.SerializedAnalyticalConfiguration = JSON.stringify(responseObject.response);
								configurationPromise.resolve();
							} else {
								configurationPromise.reject();
							}
						}, function(error){
							configurationPromise.reject(error);
						});
					});
					jQuery.when.apply(jQuery, configurationPromises).then(function(){
						callback(configurations, getMetadata());
					}, function(error){
						callback([], getMetadata(), createErrorMessageObject({ code : '5223', aParameters : [ application ]}, error && error.messages));
					});
				} else {
					callback(configurations, getMetadata());
				}
			}, function(error) {
				callback([], getMetadata(), createErrorMessageObject({ code : '5223', aParameters : [ application ]}, error && error.messages));
			});
		}
		/**
		 * when updating, deleting, creating a configuration, the constant 'ATO_NOTIFICATION' has to be supplied in the
		 * parameter for the change list for these operations. This is only the case, when ATO is active and enabled in the layered repository.
		 * ATO is the transport management system in the cloud. So this method has to read the settings of the layered repository regarding
		 * the ATO settings.
		 */
		function getChangeList() {
			var deferred = jQuery.Deferred();
			var aParams = [];

			if (changeListHasBeenFetched) {
				deferred.resolve(changeList);
			} else {
				aParams.push({ name : "dt", value : false});
				var sRequestPath = "/sap/bc/lrep/content/sap/ui/fl/settings/main.flsettings";

				sRequestPath += connector._buildParams(aParams);
				var promise = connector.send(sRequestPath, 'GET', undefined);
				promise.then(function(result){
					var settings = result && result.response || {};
					changeListHasBeenFetched = true;
					if (settings.isAtoEnabled === true) {
						changeList = "ATO_NOTIFICATION";
					}
					deferred.resolve(changeList);
				}, function(error){
					deferred.reject(error);
				});
			}
			return deferred.promise();
		}
		function updateConfigurationTable(application, configuration, callback, layer) {
			var sLayer = layer || 'CUSTOMER';
			var applicationNamespace = getApplicationNamespace(application);
			var promiseForMetadata = connector.getFileAttributes(applicationNamespace, configuration, 'apfconfiguration', sLayer);
			promiseForMetadata.then(function(result) {
				var configMetadata = result.response;
				if (sLayer === 'CUSTOMER') {
					addConfigurationToHashTable(application, configuration, configMetadata);
					updateTexts(application, callback);
				} else {
					callback(getMetadata());
				}
			}, function(error) {
				callback(getMetadata(), createErrorMessageObject({ code : '5232', aParameters : [application, configuration]},  error && error.messages));
			});
		}
		function updateConfiguration(configurationData, callback, layer) {
			if (!layer) {
				layer = "CUSTOMER";
			}
			var applicationId = configurationData.Application;
			var configurationGuid = configurationData.AnalyticalConfiguration;
			var analyticalConfiguration = JSON.parse(configurationData.SerializedAnalyticalConfiguration);
			var applicationNamespace = getApplicationNamespace(applicationId);

			var promiseForChangeList = getChangeList();
			promiseForChangeList.then(function(changeList){
				var promiseForApplicationData = connector.getStaticResource(applicationNamespace, "metadata", "apfapplication");
				promiseForApplicationData.then(function(result) {
					var configHeader = {
							Application : applicationId,
							ApplicationName : result.response.ApplicationName,
							SemanticObject : result.response.SemanticObject,
							AnalyticalConfiguration : configurationGuid,
							AnalyticalConfigurationName : configurationData.AnalyticalConfigurationName,
							//UI5Version : ,
							CreationUTCDateTime : configurationData.CreationUTCDateTime,
							LastChangeUTCDateTime : configurationData.LastChangeUTCDateTime
					};
					analyticalConfiguration = jQuery.extend(true, analyticalConfiguration, {
						configHeader : configHeader
					});
					analyticalConfiguration = JSON.stringify(analyticalConfiguration);

					var promiseForCreate = connector.upsert(applicationNamespace, configurationGuid, 'apfconfiguration', layer, analyticalConfiguration, 'application/json', changeList);
					return promiseForCreate;
				}, function(error) {
					callback(getMetadata(), createErrorMessageObject({ code : '5233', aParameters : [ applicationId, configurationGuid]}, error && error.messages));
				}).then(function(result) {
					updateConfigurationTable(applicationId, configurationGuid, callback, layer);
				}, function(error) {
					callback(getMetadata(), createErrorMessageObject({ code : '5233', aParameters : [ applicationId, configurationGuid]}, error && error.messages));
				});
			}, function(error) {
				callback(getMetadata(), createErrorMessageObject({ code : '5224'} , error && error.messages));
			});
		}
		function createConfiguration(configurationData, callback, options) {
			var layer = determineLayerFromOptions(options);
			var applicationId = configurationData.Application;
			var configurationGuid = configurationData.AnalyticalConfiguration;
			if (configurationGuid === undefined || !sap.apf.utils.isValidGuid(configurationGuid)) {
				configurationGuid = sap.apf.utils.createPseudoGuid(32);
			}
			var analyticalConfiguration = JSON.parse(configurationData.SerializedAnalyticalConfiguration);
			var applicationNamespace = getApplicationNamespace(applicationId);
			var promiseForApplicationData = connector.getStaticResource(applicationNamespace, "metadata", "apfapplication");
			promiseForApplicationData.then(function(result) {
				var configHeader = {
						Application : applicationId,
						ApplicationName : result.response.ApplicationName,
						SemanticObject : result.response.SemanticObject,
						AnalyticalConfiguration : configurationGuid,
						AnalyticalConfigurationName : analyticalConfiguration.analyticalConfigurationName,
						//UI5Version : ,
						CreationUTCDateTime : configurationData.CreationUTCDateTime,
						LastChangeUTCDateTime : configurationData.LastChangeUTCDateTime
				};
				analyticalConfiguration = jQuery.extend(true, analyticalConfiguration, {
					configHeader : configHeader
				});
				analyticalConfiguration = JSON.stringify(analyticalConfiguration);
				createAnalyticalConfigurationInLrep(applicationId, configurationGuid, configurationData.AnalyticalConfigurationName, analyticalConfiguration, callback);
			}, function(error) {
				callback(undefined, getMetadata(), createErrorMessageObject({ code : '5223', aParameters : [ applicationId ]}, error && error.messages));
			});
			function createAnalyticalConfigurationInLrep(applicationId, configurationGuid, AnalyticalConfigurationName, analyticalConfiguration, callback) {
				var applicationNamespace = getApplicationNamespace(applicationId);
				var promiseForChangeList = getChangeList();

				promiseForChangeList.then(function(changeList) {
					var promiseForCreate = connector.upsert(applicationNamespace, configurationGuid, 'apfconfiguration', layer, analyticalConfiguration, 'application/json', changeList);
					promiseForCreate.then(function(result) {
						updateConfigurationTable(applicationId, configurationGuid, function(response, messageObject) {

							if (!messageObject) {
								callback({
									AnalyticalConfiguration : configurationGuid,
									AnalyticalConfigurationName : configurationData.AnalyticalConfigurationName
								}, getMetadata());
							} else {
								callback(undefined, getMetadata(), messageObject);
							}

						}, layer);

					}, function(error) {
						callback(undefined, getMetadata(), createErrorMessageObject({code : '5226', aParameters : [applicationId, configurationGuid]}, error && error.messages));
					});
				}, function(error) {
					callback(undefined, getMetadata(), createErrorMessageObject({ code : '5224'}, error && error.messages));
				});
			}
		}
		function deleteConfiguration(configurationData, callback, applicationId, layer) {
			var configurationGuid = configurationData[0].value;
			messageHandler.check(configurationGuid !== undefined, "configuration may not be undefined");
			messageHandler.check(applicationId !== undefined, "application of configuration not found");
			var applicationNamespace = getApplicationNamespace(applicationId);
			getChangeList().then(function(changeList){
				var promiseForDelete = connector.deleteFile(applicationNamespace, configurationGuid, 'apfconfiguration', layer, changeList);
				promiseForDelete.then(function(result) {
					callback(getMetadata());
				}, function(error) {
					callback(getMetadata(), createErrorMessageObject({code : '5225', aParameters : [applicationId, configurationGuid]}, error && error.messages));
				});
			}, function(error) {
				callback(getMetadata(), createErrorMessageObject({ code : '5224'}, error && error.messages));
			});
		}
		function renameProperties(applicationId, applicationProperties) {
			var i = 0;
			var data = {
					Application : applicationId
			};
			var propertyName, propertyValue;
			for(i = 0; i < applicationProperties.length; i++) {
				propertyName = applicationProperties[i].name;
				propertyValue = applicationProperties[i].value;
				if (propertyName === "apfdt-applname") {
					propertyName = "ApplicationName";
				} else if (propertyName === 'createdAt') {
					propertyName = "CreationUTCDateTime";
				} else if (propertyName === 'createdBy') {
					propertyName = "CreatedByUser";
				} else if (propertyName === 'lastChangedAt') {
					propertyName = "LastChangeUTCDateTime";
				} else if (propertyName === 'lastChangedBy') {
					propertyName = "LastChangedByUser";
				} else if (propertyName === "apfdt-configname") {
					propertyName = 'AnalyticalConfigurationName';
				} else if (propertyName === 'size' || propertyName === 'layer') {
					continue;
				}
				data[propertyName] = propertyValue;
			}
			return data;
		}
		function createApplication(applicationData, callback, options) {
			messageHandler.check(applicationData.ApplicationName !== undefined && applicationData.ApplicationName !== "", "Valid application name is required");
			var applicationId = applicationData.Application;
			if (applicationId === undefined || !sap.apf.utils.isValidGuid(applicationId)) {
				applicationId = sap.apf.utils.createPseudoGuid(32);
			}
			var content = JSON.stringify({
				ApplicationName : applicationData.ApplicationName,
				SemanticObject : applicationData.SemanticObject,
				Application : applicationId
			});

			var textfile = sap.apf.utils.renderHeaderOfTextPropertyFile(applicationId, messageHandler);
			var layer = determineLayerFromOptions(options);

			function errorResponse(error) {
				callback(undefined, getMetadata(), createErrorMessageObject({code: '5227'} , error && error.messages));
			}
			var applicationNamespace = getApplicationNamespace(applicationId);
			var promiseForMetadataUpsert = connector.upsert(applicationNamespace, 'metadata', 'apfapplication', layer, content, 'application/json');
			promiseForMetadataUpsert.then(function(metadataUpsertResult) {

				var promiseForTextsUpsert = connector.upsert(applicationNamespace, 'text', 'properties', layer, textfile, 'text/plain');

				promiseForTextsUpsert.then(function(textUpsertResult) {
					applicationTextsTable.setItem(applicationId, new sap.apf.utils.Hashtable(messageHandler));
					callback({
						Application : applicationId,
						ApplicationName : applicationData.ApplicationName,
						SemanticObject : applicationData.SemanticObject
					}, getMetadata());
				}, errorResponse);
			}, errorResponse);
		}
		function updateApplication(applicationData, callback) {
			messageHandler.check(applicationData.ApplicationName !== undefined && applicationData.ApplicationName !== "", "Valid application name is required");
			var applicationId = applicationData.Application;
			var content = JSON.stringify({
				ApplicationName : applicationData.ApplicationName,
				SemanticObject : applicationData.SemanticObject,
				Application : applicationId
			});
			function errorResponse(error) {
				callback(undefined, createErrorMessageObject({code: '5228', aParameters: [applicationId]}, error && error.messages));
			}
			var applicationNamespace = getApplicationNamespace(applicationId);
			var promiseForUpdateApplication = connector.upsert(applicationNamespace, 'metadata', 'apfapplication', 'CUSTOMER', content, 'application/json');
			promiseForUpdateApplication.then(function(metadataUpdateResult) {
				callback({
					Application : applicationId,
					ApplicationName : applicationData.ApplicationName,
					SemanticObject : applicationData.SemanticObject
				});
			}, errorResponse);
		}
		function deleteApplication(applicationData, callback, layer) {
			var applicationId = applicationData[0].value;
			function fnError(oError) {
				var messageObject = createMessageObjectFromErrorResponse(oError);
				callback(getMetadata(), messageObject);
			}
			var sApplicationNamespace = getApplicationNamespace(applicationId);
			var promiseGetFilesUnderApplication = connector.listContent(sApplicationNamespace, layer);
			promiseGetFilesUnderApplication.then(function(result) {
				var aFiles = result.response;
				var aPromises = [];
				aFiles.forEach(function(file) {
					if(file.fileType === "apfconfiguration"){
						getChangeList().then(function(changeList){
							aPromises.push(connector.deleteFile(sApplicationNamespace, file.name, file.fileType, file.layer, changeList));
						}, function(error) {
							callback(getMetadata(), createErrorMessageObject({ code : '5224'},  error && error.messages));
						});
					} else {
						aPromises.push(connector.deleteFile(sApplicationNamespace, file.name, file.fileType, file.layer));
					}
				});
				var promiseForDeleteApplicationContent = Promise.all(aPromises);
				return promiseForDeleteApplicationContent;
			}, fnError).then(function(result) {
				callback(getMetadata());
			}, fnError);
		}
		function createMessageObjectFromErrorResponse(oError) {
			var messageObject;
			if (oError && oError.messageObject && oError.messageObject.getCode) {
				messageObject = oError.messageObject;
			} else if (oError && oError.response && oError.response.statusCode && oError.response.statusCode >= 400) { //Bad HTTP request returned status code {0} with status text {1}
				messageObject = messageHandler.createMessageObject({
					code : '11005',
					aParameters : [ oError.response.statusCode.toString(), oError.response.statusText ]
				});
			} else {
				messageObject = messageHandler.createMessageObject({ //Unknown server error.
					code : '5201',
					aParameters : (oError && oError.messages) || []
				});
			}
			return messageObject;
		}

		function readCollectionOfApplications(callback, layer) {
			var applicationData = [];
			sendLrepDeepReadRequest(layer, "apfapplication").then(function(result) {
				var data = result.response;
				data.forEach(function(data){
					var applicationId;
					var applicationName;

					if (data.fileType && data.fileType === "apfapplication") {
						applicationId = getApplicationId(data);
						if (!sap.apf.utils.isValidPseudoGuid(applicationId)) {
							return;
						}
						applicationName = "";
						var semanticObject = "";
						applicationName = getElementValueFromMetadata(data, 'apfdt-applname');
						applicationData.push({ Application : applicationId, ApplicationName : applicationName, SemanticObject : semanticObject });
					}
				});
				callback(applicationData, getMetadata());
			}, processError);
			function processError(error) {
				callback(undefined, getMetadata(), createErrorMessageObject({code : '5229'}, error && error.messages));
			}
		}

	};
}());
