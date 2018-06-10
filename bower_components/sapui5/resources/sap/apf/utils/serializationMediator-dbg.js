/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.utils.serializationMediator");
jQuery.sap.require("sap.apf.core.constants");

(function() {
	'use strict';
	/**
	 * @private
	 * @class Serialization Mediator gets, collects and distributes non-core objects for persistence operations (save, open and delete).
	 * @param {object} inject Object containing an instance of {@link sap.apf.utils.FilterIdHandler} and {@link sap.apf.core.Instance}
	 * @param {object} inject.instances.filterIdHandler Instance of {@link sap.apf.utils.FilterIdHandler} 
	 * @param {object} inject.instances.coreApi Instance of {@link sap.apf.core.Instance}
	 * @returns {sap.apf.utils.SerializationMediator}
	 */
	sap.apf.utils.SerializationMediator = function(inject) {
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.SerializationMediator#savePath
		 * @description Saves or modifies the current path on server side under the provided name.
		 * @param {string} [sPathId] If provided the path identified by the ID is modified with the current path.
		 * If omitted the current path will be created as new saved path with a new ID.
		 * @param {string} sName Name of the path to be saved
		 * @param {function} fnCallback The first argument of the callback function is an object with property AnalysisPath and status.
		 * The second argument is {sap.apf.core.EntityTypeMetadata}.
		 * The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
		 * @returns undefined
		 */
		this.savePath = function(arg1, arg2, arg3) {
			this.serialize(false).done(function(serializableApfState){
				if (typeof arg1 === 'string' && typeof arg2 === 'function') { //case for create path
					inject.instances.coreApi.savePath(arg1, arg2, serializableApfState);
				} else if (typeof arg1 === 'string' && typeof arg2 === 'string' && typeof arg3 === 'function') { //case for update path
					inject.instances.coreApi.savePath(arg1, arg2, arg3, serializableApfState);
				}
			});
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.SerializationMediator#openPath
		 * @description Opens a path, that has been stored on server side and replaces the current path.
		 * @param {string} sPathId Identifies the analysis path to be opened
		 * @param {function} fnCallback The first argument of the callback function is a JS object with property path, that holds the stored path and status. The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
		 * @param {number} [nActiveStep] Sets the active step.
		 * @returns undefined
		 */
		this.openPath = function(pathId, callback, indexOfActiveStep) {
			inject.instances.coreApi.openPath(pathId, callbackFromCoreApi.bind(this));
			function callbackFromCoreApi(response, metadata, messageObject) {
				inject.instances.coreApi.resetPath();
				
				inject.instances.messageHandler.setCallbackForTriggeringFatal(callbackForMessageHandling);
				this.deserialize(response.path.SerializedAnalysisPath, indexOfActiveStep).done(function(){
					inject.instances.messageHandler.setCallbackForTriggeringFatal(undefined);
					callback({}, metadata);
				});
				
				function callbackForMessageHandling(messageObject){
					if(messageObject.getSeverity() !== sap.apf.core.constants.message.severity.warning){
						var messageObjectDeserialization = inject.instances.messageHandler.createMessageObject({
							code : '5210'
						});
						messageObjectDeserialization.setPrevious(messageObject);
						inject.instances.messageHandler.putMessage(messageObjectDeserialization);
					}
				}
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.SerializationMediator#deletePath
		 * @description Deletes the path with the given ID on server
		 * @param {string} sPathId Identifies the analysis path to be deleted
		 * @param {function} fnCallback The first argument of the callback function is a JS object, that holds the property status. The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
		 * @returns undefined
		 */
		this.deletePath = function(sPathId, fnCallback) {
			inject.instances.coreApi.deletePath(sPathId, fnCallback);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.SerializationMediator#readPaths
		 * @description Reads all stored paths from server
		 * @param {function} fnCallback This callback function is called after function readPaths has been executed.
		 * @param {function} fnCallback(oResponse, oEntitiyMetadata, oMessageObject)
		 * @returns undefined
		 */
		this.readPaths = function(fnCallback) {
			inject.instances.coreApi.readPaths(fnCallback);
		};
		
		this.serialize = function(isTransient, keepInitialStartFilterValues){
			var result = jQuery.Deferred();
			var serializableObject = {};
			inject.instances.startFilterHandler.serialize(undefined, keepInitialStartFilterValues).done(function(serializableSFH){
				var serializableCore = inject.instances.coreApi.serialize();
				serializableObject.startFilterHandler = serializableSFH;
				serializableObject.filterIdHandler = inject.instances.filterIdHandler.serialize();
				serializableObject.path = serializableCore.path;
				serializableObject.smartFilterBar = serializableCore.smartFilterBar;
				if(isTransient){
					serializableObject.pathName = inject.instances.coreApi.getPathName();
					serializableObject.dirtyState = inject.instances.coreApi.isDirty();
				}
				
				result.resolve(serializableObject);
			});
			return result;
		};
		this.deserialize = function(serializedApfState, indexOfActiveStep){
			var deferred = jQuery.Deferred();
			var serializedCore;
			if(serializedApfState.dirtyState !== undefined){
				inject.instances.coreApi.setDirtyState(serializedApfState.dirtyState);
			}
			if(serializedApfState.pathName !== undefined){
				inject.instances.coreApi.setPathName(serializedApfState.pathName);
			}
			serializedCore = {
					path : serializedApfState.path, 
					smartFilterBar : serializedApfState.smartFilterBar
			};
			if(indexOfActiveStep !== undefined) {
				serializedCore.path.indicesOfActiveSteps[0] = indexOfActiveStep;
			}
			//Deserialize after configuration is loaded
			inject.instances.coreApi.getApplicationConfigProperties().done(function(){
				inject.instances.coreApi.deserialize(serializedCore);
				inject.instances.filterIdHandler.deserialize(serializedApfState.filterIdHandler);
				inject.instances.startFilterHandler.getStartFilters().done(function(){
					if(serializedApfState.startFilterHandler){
						inject.instances.startFilterHandler.deserialize(serializedApfState.startFilterHandler).done(function(){
							deferred.resolve();
						});
					}else{
						deferred.resolve();
					}
				});
			});
			return deferred.promise();
		};
	};
}());