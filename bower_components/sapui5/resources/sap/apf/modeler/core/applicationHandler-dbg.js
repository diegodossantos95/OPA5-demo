/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare("sap.apf.modeler.core.applicationHandler");
jQuery.sap.require("sap.apf.utils.hashtable");
(function() {
	'use strict';
	/**
	 * @private
	 * @class Application Handler manages the applications of the APF Configuration Modeler  
	 * @param {object} inject Injection of required APF objects
	 * @param {object} inject.instance Injection of required instances
	 * @param {object} inject.instances.persistenceProxy Instance of the persistenceProxy - provides necessary CRUD functionality
	 * @param {object} inject.instances.messageHandler Instance of the MessageHandler
	 * @param {object} inject.constructor Injection of required constructors
	 * @param {object} inject.constructors.Hashtable  Injection of hashtable constructor      * 
	 * @param {function} initCallback Function is called after initialization 
	 */
	sap.apf.modeler.core.ApplicationHandler = function(inject, initCallback) {
		var that = this;
		var persistenceProxy = inject.instances.persistenceProxy;
		var messageHandler = inject.instances.messageHandler;
		var Hashtable = inject.constructors.Hashtable;
		var applicationList;
		this.type = "application";
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.applicationHandler#setAndSave
		 * @description Saves or modifies an application on database
		 * 
		 * @param {object} appObject Application to be saved/modified
		 * @param {string} appObject.ApplicationName Name of application
		 * @param {string} appObject.SemanticObject Semantic object of application
		 * 
		 * @param {function(response, metadata, messageObject)} callback Callback returns after create/update operation has been executed
		 * @param {string} callback.response ID of the saved/modified application
		 * @param {string} callback.metadata Metadata
		 * @param {sap.apf.core.MessageObject} callback.messageObject Identifier of corrupt process flow
		 * 
		 * @param {string} [id] Modifies the application identified by the ID with the committed application
		 * @param {boolean} [isImport] If true, id is used for creating a new application with an external id
		 */
		this.setAndSave = function(appObject, callback, id, isImport) {
			if (typeof appObject === "object" && typeof callback === "function" && typeof id === "string" && !isImport) { //update
				var callbackUpdate = function(metadata, messageObject) {
					if (messageObject) {
						callback(undefined, metadata, messageObject);
					} else {
						applicationList.setItem(appObject.Application, appObject);
						callback(appObject.Application, metadata, messageObject);
					}
				};
				if (!appObject.SemanticObject) {
					appObject.SemanticObject = "";
				}
				appObject.Application = id;
				persistenceProxy.update(this.type, appObject, callbackUpdate, [ {
					name : "Application",
					value : id
				} ]);
			} else if (typeof appObject === "object" && typeof callback === "function") { //create
				var callbackCreate = function(response, metadata, messageObject) {
					if (messageObject) {
						callback(response, metadata, messageObject);
					} else {
						applicationList.setItem(response.Application, {
							Application : response.Application,
							ApplicationName : response.ApplicationName,
							SemanticObject : response.SemanticObject
						});
						callback(response.Application, metadata, messageObject);
					}
				};
				if (!appObject.SemanticObject) {
					appObject.SemanticObject = "";
				}
				if (isImport && id) {
					appObject.Application = id;
				} else {
					appObject.Application = "";
				}
				persistenceProxy.create(this.type, appObject, callbackCreate);
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.applicationHandler#removeApplication
		 * @description Removes an application from the database
		 * 
		 * @param {function(response, metadata, messageObject)} callback Callback returns after remove operation has been executed
		 * @param {string} id applicationId
		 * @param {string} callback.response ID of application to be removed
		 * @param {string} callback.metadata Metadata
		 * @param {sap.apf.core.MessageObject} callback.messageObject Identifier of corrupt process flow
		 */
		this.removeApplication = function(id, callback) {
			var callbackRemove = function(metadata, messageObject) {
				if (!messageObject) {
					applicationList.removeItem(id);
				}
				inject.functions.resetConfigurationHandler(id);
				callback(id, metadata, messageObject);
			};
			persistenceProxy.remove(this.type, [ {
				name : "Application",
				value : id
			} ], callbackRemove);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.applicationHandler#getList
		 * @description Returns list of all applications
		 * @returns {Array.<Object>} Array of all applications
		 */
		this.getList = function() {
			var applicationArray = [];
			var addAppsToArray = function(key, item) {
				applicationArray.push(item);
			};
			applicationList.forEachOrdered(addAppsToArray);
			applicationArray = applicationArray.sort(function(appA, appB){
				return appA.ApplicationName.localeCompare(appB.ApplicationName);
			});
			return applicationArray;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.applicationHandler#getApplication
		 * @description Returns the requested application based on the ID
		 * @param {string} [id] ID of application
		 * @returns {object} Application
		 */
		this.getApplication = function(id) {
			return applicationList.getItem(id);
		};
		function initialize() {
			applicationList = new Hashtable(messageHandler);
			var callbackRead = function(response, metadata, messageObject) {
				if (response instanceof Array && messageObject === undefined) {
					response.forEach(function(object) {
						applicationList.setItem(object.Application, {
							Application : object.Application,
							ApplicationName : object.ApplicationName,
							SemanticObject : object.SemanticObject
						});
					});
				}
				initCallback(that, messageObject);
			};
			persistenceProxy.readCollection(that.type, callbackRead);
		}
		initialize();
	};
}());