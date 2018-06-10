/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.persistence");
jQuery.sap.require("sap.apf.core.constants");

(function() {
	'use strict';
	/**
	 * @class Storage and retrieval of path and other APF states
	 * @returns {sap.apf.core.Persistence}
	 */
	sap.apf.core.Persistence = function(oInject) {
		var logicalSystem;

		/**
		 * @description Builds request object and payload.
		 * @param {string} sName Name of the path.
		 * @param {function} fnCallback(oResponse, oEntityMetadata, oMessageObject)
		 * @param {object} [serializableApfState] Object containing serializable APF state
		 */
		this.createPath = function(sName, fnCallback, serializableApfState) {
			var oRequest;
			var oStructuredPath = getStructuredAnalysisPath(serializableApfState);
			getLogicalSystemAsPromise().then(function(logicalSystem) {
				oRequest = {
						data : {
							AnalysisPath : "",
							AnalysisPathName : sName,
							LogicalSystem : logicalSystem,
							ApplicationConfigurationURL : oInject.functions.getComponentName(),
							SerializedAnalysisPath : JSON.stringify(serializableApfState),
							StructuredAnalysisPath : JSON.stringify(oStructuredPath)
						},
						method : "POST"
				};
				if (oInject.instances.coreApi.getStartParameterFacade().getAnalyticalConfigurationId()) {
					oRequest.data.AnalyticalConfiguration = oInject.instances.coreApi.getStartParameterFacade().getAnalyticalConfigurationId().configurationId;	
				}
				sendRequest(oRequest, fnRequestCallback);
			}, function(messageObject) {
				fnCallback({
					oResponse : undefined,
					status : "failed"
				}, {}, messageObject);
			});
			function fnRequestCallback(oResponse, oEntityTypeMetadata, messageObject) {
				if (messageObject) {
					fnCallback({
						oResponse : oResponse,
						status : "failed"
					}, oEntityTypeMetadata, messageObject);
				} else {
					oInject.instances.messageHandler.check(oResponse && oResponse.data && oResponse.statusCode === 201, "Persistence create Path - proper response");
					fnCallback({
						AnalysisPath : oResponse.data.AnalysisPath,
						status : "successful"
					}, oEntityTypeMetadata, messageObject);
				}
			}
		};
		/**
		 * @description Reads all stored paths from server.
		 * @param {function} fnCallback This callback function is called after function readPaths has been executed.
		 * @param {function} fnCallback(oResponse, oEntitiyMetadata, oMessageObject) 
		 */
		this.readPaths = function(fnCallback) {
			var oRequest = {
					method : "GET"
			};
			sendRequest(oRequest, fnRequestCallback.bind(this));
			function fnRequestCallback(oResponse, oEntityTypeMetadata, oMessageObject) {
				if (!oMessageObject && oResponse && oResponse.data && oResponse.data.results) {
					for( var i in oResponse.data.results) {
						oResponse.data.results[i].StructuredAnalysisPath = JSON.parse(oResponse.data.results[i].StructuredAnalysisPath);
					}
				} else if (!oMessageObject || oResponse.statusCode !== 200) {
					oMessageObject = oInject.instances.messageHandler.createMessageObject({
						code : '5211'
					});
				}
				if (oMessageObject) {
					fnCallback({
						oResponse : oResponse,
						status : "failed"
					}, oEntityTypeMetadata, oMessageObject);
				} else {
					fnCallback({
						paths : oResponse.data.results,
						status : "successful"
					}, oEntityTypeMetadata, oMessageObject);
				}
			}
		};
		/**
		 * @description Deletes a path. 
		 * @param {String} sAnalysisPathId GUID to identify the path
		 * @param {function} fnCallback(oResponse, oEntitiyMetadata, oMessageObject) 
		 */
		this.deletePath = function(sAnalysisPathId, fnCallback) {
			var oRequest = {
					method : "DELETE"
			};
			sendRequest(oRequest, fnRequestCallback.bind(this), sAnalysisPathId);
			function fnRequestCallback(oResponse, oEntityTypeMetadata, oMessageObject) {
				if ((oResponse.statusCode !== 204) && (!oMessageObject)) {
					oMessageObject = oInject.instances.messageHandler.createMessageObject({
						code : 5201
					});
					oMessageObject.setPrevious(oInject.instances.messageHandler.createMessageObject({
						code : 5200,
						aParameters : [ oResponse.statusCode, oResponse.statusText ]
					}));
				}
				if (oMessageObject) {
					fnCallback({
						oResponse : oResponse,
						status : "failed"
					}, oEntityTypeMetadata, oMessageObject);
				} else {
					fnCallback({
						status : "successful"
					}, oEntityTypeMetadata, oMessageObject);
				}
			}
		};
		/**
		 * @description Modifies a data object based on the state of the current path and overwrites the old path on the server. 
		 * @param {String} sAnalysisPathId GUID to identify the path
		 * @param {String} sName name of the path
		 * @param {function} fnCallback(oResponse, oEntitiyMetadata, oMessageObject)
		 * @param {object} [serializableApfState] Object containing non-core objects to be serialized
		 * @param {object} [serializableApfState.filterIdHandler] Serializable FilterIdHandler
		 */
		this.modifyPath = function(sAnalysisPathId, sName, fnCallback, serializableApfState) {
			var oStructuredPath = getStructuredAnalysisPath(serializableApfState);

			getLogicalSystemAsPromise().then(function(logicalSystem) {
				var oRequest = {
						data : {
							AnalysisPath : sAnalysisPathId,
							AnalysisPathName : sName,
							LogicalSystem : logicalSystem,
							ApplicationConfigurationURL : oInject.functions.getComponentName(),
							SerializedAnalysisPath : JSON.stringify(serializableApfState),
							StructuredAnalysisPath : JSON.stringify(oStructuredPath)
						},
						method : "PUT"
				};
				if (oInject.instances.coreApi.getStartParameterFacade().getAnalyticalConfigurationId()) {
					oRequest.data.AnalyticalConfiguration = oInject.instances.coreApi.getStartParameterFacade().getAnalyticalConfigurationId().configurationId;	
				}
				sendRequest(oRequest, fnRequestCallback.bind(this), sAnalysisPathId);
			}, function(messageObject) {
				fnCallback({
					oResponse : undefined,
					status : "failed"
				}, {}, messageObject);
			});
			function fnRequestCallback(oResponse, oEntityTypeMetadata, oMessageObject) {
				if ((oResponse.statusCode !== 204) && (!oMessageObject)) {
					oMessageObject = oInject.instances.messageHandler.createMessageObject({
						code : 5201
					});
					oMessageObject.setPrevious(oInject.instances.messageHandler.createMessageObject({
						code : 5200,
						aParameters : [ oResponse.statusCode, oResponse.statusText ]
					}));
				}
				if (oMessageObject) {
					fnCallback({
						oResponse : oResponse,
						status : "failed"
					}, oEntityTypeMetadata, oMessageObject);
				} else {
					fnCallback({
						AnalysisPath : sAnalysisPathId,
						status : "successful"
					}, oEntityTypeMetadata, oMessageObject);
				}
			}
		};
		/**
		 * @description Gets the stored path and deserializes it in the runtime environment. As a result, the current path is replaced
		 * by the path, that has been loaded from the server.
		 * @param {String} sAnalysisPathId GUID to identify the path
		 * @param {function} fnCallback(oResponse, oEntitiyMetadata, oMessageObject) 
		 */
		this.openPath = function(sAnalysisPathId, fnCallback) {
			var oRequest = {
					method : "GET"
			};
			sendRequest(oRequest, fnRequestCallback, sAnalysisPathId);
			function fnRequestCallback(oResponse, oEntityTypeMetadata, messageObject) {
				var messageObjectFatal;
				if (!messageObject && oResponse && oResponse.statusCode === 200 && oResponse.data && oResponse.data.SerializedAnalysisPath) {
					oResponse.data.SerializedAnalysisPath = JSON.parse(oResponse.data.SerializedAnalysisPath);
				}
				if (messageObject) {
					messageObjectFatal = oInject.instances.messageHandler.createMessageObject({
						code : '5210'
					});
					messageObjectFatal.setPrevious(messageObject);
					oInject.instances.messageHandler.putMessage(messageObjectFatal);
				}
				fnCallback({
					path : oResponse.data,
					status : "successful"
				}, oEntityTypeMetadata);
			}
		};
		function sendRequest(oRequest, fnLocalCallback, sAnalysisPathId) {
			var fnSuccess = function(oData, oResponse) {
				getMetadata().done(function(metadata){
					fnLocalCallback(oResponse, metadata, undefined);
				});
			};
			var fnError = function(oError) {
				var oMessageObject;
				if (oError.messageObject && oError.messageObject.getCode && oError.messageObject.getCode() === 5021) { // timeout
					getMetadata().done(function(metadata){
						fnLocalCallback(oError, metadata, oError.messageObject);
					});
					return;
				}
				var sServerSideCode = checkForErrorCode(oError.response.body); // server side error code check				
				if (sServerSideCode !== undefined) {
					oMessageObject = oInject.instances.messageHandler.createMessageObject({
						code : sServerSideCode
					});
				}
				if (oError.response.body.match("274")) { // Inserted value too large; probably maximum length of analysis path name exceeded
					oMessageObject = oInject.instances.messageHandler.createMessageObject({
						code : '5207'
					});
				}
				if (oError.response.statusCode === 400) { // Bad request; data is structured incorrectly
					oMessageObject = oInject.instances.messageHandler.createMessageObject({
						code : '5203'
					});
				}
				if (oError.response.statusCode === 403) { // Access forbidden; insufficient privileges
					oMessageObject = oInject.instances.messageHandler.createMessageObject({
						code : '5206'
					});
				}
				if (oError.response.statusCode === 405) { // Method not allowed; probably incorrect URL parameter.
					oMessageObject = oInject.instances.messageHandler.createMessageObject({
						code : '5202'
					});
				}
				if (oError.response.statusCode === 404) { // Error during path persistence; request to server can not be proceed due to invalid ID
					oMessageObject = oInject.instances.messageHandler.createMessageObject({
						code : '5208'
					});
				}
				if (!oMessageObject && oError.response.statusCode === 500) { // Server error during processing a path: {0} {1}
					oMessageObject = oInject.instances.messageHandler.createMessageObject({
						code : '5200',
						aParameters : [ oError.response.statusCode, oError.response.statusText ]
					});
				}
				if (!oMessageObject) { // Unknown server error
					oMessageObject = oInject.instances.messageHandler.createMessageObject({
						code : '5201'
					});
				}
				oInject.instances.messageHandler.putMessage(oMessageObject);
				// signature: oResponse, oEntityTypeMetadata, oMessageObject
				getMetadata().done(function(metadata){
					fnLocalCallback(oError, metadata, oMessageObject);
				});
			};
			oInject.instances.coreApi.getPersistenceConfiguration().done(function(persistenceConfiguration){
				var sUrl = persistenceConfiguration.path.service + "/" + persistenceConfiguration.path.entitySet;
				oInject.instances.coreApi.getXsrfToken(persistenceConfiguration.path.service).done(function(xsrfToken){
					oRequest.headers = {
							"x-csrf-token" : xsrfToken
					};
					switch (oRequest.method) {
					case "GET":
						if (!oRequest.data && sAnalysisPathId) {
							oRequest.requestUri = sUrl + "('" + sAnalysisPathId + "')";
							oInject.instances.coreApi.odataRequest(oRequest, fnSuccess, fnError);
						} else if (!oRequest.data && !sAnalysisPathId) {
							getUrlForReadPathsAsPromise().then(function(restUrl) {
								oRequest.requestUri = sUrl + restUrl;
								oInject.instances.coreApi.odataRequest(oRequest, fnSuccess, fnError);
							}, function(messageObject) {
								getMetadata().done(function(metadata){
									fnLocalCallback({}, metadata, messageObject);
								});
							});
						}
						break;
					case "POST":
						if (oRequest.data && !sAnalysisPathId) {
							oRequest.requestUri = sUrl;
						}
						oInject.instances.coreApi.odataRequest(oRequest, fnSuccess, fnError);
						break;
					case "DELETE":
						if (!oRequest.data && sAnalysisPathId) {
							oRequest.requestUri = sUrl + "('" + sAnalysisPathId + "')";
						}
						oInject.instances.coreApi.odataRequest(oRequest, fnSuccess, fnError);
						break;
					case "PUT":
						if (oRequest.data && sAnalysisPathId) {
							oRequest.requestUri = sUrl + "('" + sAnalysisPathId + "')";
						}
						oInject.instances.coreApi.odataRequest(oRequest, fnSuccess, fnError);
						break;
					default:
						oInject.instances.coreApi.odataRequest(oRequest, fnSuccess, fnError);
					break;
					}
				});
			});
		}
		function getUrlForReadPathsAsPromise() {
			var deferred = jQuery.Deferred();
			getLogicalSystemAsPromise().then(
					function(logicalSystem) {
						var analyticalConfigurationInURL = "";
						if (oInject.instances.coreApi.getStartParameterFacade().getAnalyticalConfigurationId()) {
							analyticalConfigurationInURL = "AnalyticalConfiguration%20eq%20'" + oInject.instances.coreApi.getStartParameterFacade().getAnalyticalConfigurationId().configurationId + "'%20and%20";
						}
						var urlForReadPaths = "?$select=AnalysisPath,AnalysisPathName,StructuredAnalysisPath,CreationUTCDateTime,LastChangeUTCDateTime&$filter=(" + analyticalConfigurationInURL + "LogicalSystem%20eq%20'" + logicalSystem + "'%20and%20"
						+ "ApplicationConfigurationURL%20eq%20'" + oInject.functions.getComponentName() + "')" + "&$orderby=LastChangeUTCDateTime%20desc";
						deferred.resolve(urlForReadPaths);
					}, function(messageObject) {
						deferred.fail(messageObject);
					});
			return deferred.promise();
		}
		function checkForErrorCode(oError) {
			var errorCode = oError.match("52[0-9]{2}");
			if (errorCode) {
				return errorCode[0];
			}
			return undefined;
		}
		function getStructuredAnalysisPath(oSerializablePath) {
			var aStructuredSteps = [];
			var aSteps = oSerializablePath.path.steps;
			var StructuredAnalysisPath;
			for( var i in aSteps) {
				aStructuredSteps.push({
					stepId : aSteps[i].stepId,
					selectedRepresentationId : aSteps[i].binding.selectedRepresentationId
				});
			}
			StructuredAnalysisPath = {
					steps : aStructuredSteps,
					indexOfActiveStep : oSerializablePath.path.indicesOfActiveSteps[0]
			};
			return StructuredAnalysisPath;
		}
		function getMetadata() {
			var deferred = jQuery.Deferred();
			oInject.instances.coreApi.getPersistenceConfiguration().done(function(configuration){
				oInject.instances.coreApi.getEntityTypeMetadata(configuration.path.service, configuration.path.entitySet).done(function(metadata){
					deferred.resolve(metadata);
				});
			});
			return deferred;
		}
		function getSAPClientFromContextFilter(oContextFilter) {
			var aTerms = oContextFilter && oContextFilter.getFilterTermsForProperty('SAPClient');
			if (aTerms === undefined || aTerms.length !== 1) {
				return undefined;
			}
			return aTerms[0].getValue();
		}
		function resolveLogicalSystemWithSapClient(deferred, sapClient) {
			oInject.instances.coreApi.getPersistenceConfiguration().done(function(persistenceConfiguration){
				var messageHandler = oInject.instances.messageHandler;
				var logicalSystemConfiguration = persistenceConfiguration.logicalSystem;
				if (!logicalSystemConfiguration) {
					logicalSystem = sapClient;
					deferred.resolve(sapClient);
					return deferred.promise();
				}
				var sServiceRoot = logicalSystemConfiguration.service;
				var sEntityType = logicalSystemConfiguration.entitySet || logicalSystemConfiguration.entityType;
				if (sServiceRoot === null) {
					logicalSystem = sapClient;
					deferred.resolve(sapClient);
					return deferred.promise();
				}
				if (sEntityType === undefined) {
					sEntityType = sap.apf.core.constants.entitySets.logicalSystem;
				}
				oInject.instances.coreApi.getMetadata(sServiceRoot).done(function(metadata){
					oInject.instances.coreApi.getXsrfToken(sServiceRoot).done(function(xsrfToken){
						var oFilter = new sap.apf.core.utils.Filter(messageHandler, "SAPClient", 'eq', sapClient);
						var sUrl = oInject.instances.coreApi.getUriGenerator().getAbsolutePath(sServiceRoot);
						sUrl = sUrl + oInject.instances.coreApi.getUriGenerator().buildUri(messageHandler, sEntityType, [ 'LogicalSystem' ], oFilter, undefined, undefined, undefined, undefined, undefined, 'Results', metadata);
						var oRequest = {
								requestUri : sUrl,
								method : "GET",
								headers : {
									"x-csrf-token" : xsrfToken
								}
						};
						var fnOnSuccess = function(oData) {
							var messageObject;
							if (oData && oData.results && oData.results instanceof Array && oData.results.length === 1 && oData.results[0].LogicalSystem) {
								logicalSystem = oData.results[0].LogicalSystem;
								deferred.resolve(logicalSystem);
							} else {
								messageObject = messageHandler.createMessageObject({
									code : "5026",
									aParameters : [ sapClient ]
								});
								deferred.fail(messageObject);
							}
						};
						var fnError = function(oError) {
							var messageObject = messageHandler.createMessageObject({
								code : "5026",
								aParameters : [ sapClient ]
							});
							if (oError.messageObject !== undefined && oError.messageObject.type === "messageObject") {
								messageObject.setPrevious(oError.messageObject);
							}
							deferred.fail(messageObject);
						};
						oInject.instances.coreApi.odataRequest(oRequest, fnOnSuccess, fnError);
					});
				});
			});
		}
		/**
		 * returns the logical system as promise, that is used on xs engine or otherwise the sap client from start parameters, if persistence config
		 * has no logical system odata service specified.
		 */
		function getLogicalSystemAsPromise() {
			var deferred = jQuery.Deferred();
			if (logicalSystem) {
				deferred.resolve(logicalSystem);
				return deferred.promise();
			}
			var sapClient = oInject.instances.coreApi.getStartParameterFacade().getSapClient();
			if (sapClient) {
				resolveLogicalSystemWithSapClient(deferred, sapClient);
				return deferred.promise();
			}
			oInject.instances.coreApi.getCumulativeFilter().done(function(oContextFilter) {
				sapClient = getSAPClientFromContextFilter(oContextFilter);
				if (!sapClient) {
					deferred.resolve('');
				} else {
					resolveLogicalSystemWithSapClient(deferred, sapClient);
				}
			});
			return deferred.promise();
		}
	};
}());