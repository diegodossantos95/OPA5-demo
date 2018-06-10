/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare("sap.apf.modeler.core.lazyLoader");
(function() {
	'use strict';
	/**
	 * @private
	 * @name sap.apf.modeler.core.lazyLoader
	 * @class A lazy load manager providing the logic for loading objects asynchronously
	 * @param {Object} inject - Injection of required APF object references, constructors and functions
	 * @param {sap.apf.core.utils.messageHandler} inject.instances.MessageHandler - messageHandler instance
	 * @param {sap.apf.core.utils.Hashtable} inject.constructors.Hashtable - Hashtable constructor
	 * @param {Function} fnLoadInstance - A function that executes the asynchronous load with the following signature: fnLoadInstance(id, callbackFromLoad(id, instance, messageObject), oldInstance)
	 * @param {Object} dataForInstantiation - Optional data that can be used for the instantiation
	 * @param {String} dataForInstantiation.id Id used for instantiation
	 * @param {Object} dataForInstantiation.instance Instance used for instantiation                                   
	 * @constructor
	 */
	sap.apf.modeler.core.LazyLoader = function(inject, fnLoadInstance, dataForInstantiation) {
		var Hashtable = inject.constructors.Hashtable;
		var object = {
			id : null,
			instance : null,
			messageObject : null,
			isInitializing : false,
			callbacksFromAsyncGet : new Hashtable(inject.instances.messageHandler)
		}, oldInstance = null;
		if (dataForInstantiation) {
			object.id = dataForInstantiation.id;
			object.instance = dataForInstantiation.instance;
		}
		this.type = "lazyLoader";
		/**
		* @private
		* @name sap.apf.modeler.core.lazyLoader#getId
		* @function
		* @description Return the id that is currently loaded
		* @returns {String|Null}
		*/
		this.getId = function() {
			return object.id;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.lazyLoader#getInstance
		 * @function
		 * @description Return the instance that is currently loaded
		 * @returns {Object|Null}
		 */
		this.getInstance = function() {
			return object.instance;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.lazyLoader#isInitializing
		 * @function
		 * @description Returns whether the loader is initializing
		 * @returns {Boolean}
		 */
		this.isInitializing = function() {
			return object.isInitializing;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.lazyLoader#reset
		 * @function
		 * @description Reset the internal state of the lazyLoad object                    
		 */
		this.reset = function() {
			oldInstance = object.instance; // !!!: to be able to reload the data for the new Id into the old instance
			object = {
				id : null,
				instance : null,
				messageObject : null,
				isInitializing : false,
				callbacksFromAsyncGet : new Hashtable(inject.instances.messageHandler)
			};
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.lazyLoader#asyncGetInstance
		 * @function
		 * @description Execute an asynchronous get for a certain object id
		 * @param {String} id - Id of the object
		 * @param {function(id, instance, messageObject)} callbackAfterAsyncGet - Callback returns the id and either the loaded object instance or a message object
		 * @param {object} callbackAfterAsyncGet.instance
		 * @param {sap.apf.core.MessageObject} callbackAfterAsyncGet.messageObject
		 * @param {string} callbackAfterAsyncGet.id
		 */
		this.asyncGetInstance = function(id, callbackFromAsyncGet) {

			function provideMessageObjectForCallback(memorizedMessageObject) {
				if (memorizedMessageObject === null) {
					return undefined;
				}
				return memorizedMessageObject;
			}

			var messageObject;
			if (!id) {
				return;
			}
			if (object.id && id !== object.id) {
				this.reset();
			}
			if (object.id && (object.instance || object.messageObject)) {
				messageObject = provideMessageObjectForCallback(object.messageObject);
				callbackFromAsyncGet(object.instance, messageObject, object.id);
				return;
			}
			memorizeCallback(callbackFromAsyncGet);
			if (!object.isInitializing) {
				object.isInitializing = true;
				object.id = id;
				fnLoadInstance(id, callbackFromFnLoadInstance, oldInstance);
			}
		};
		function callbackFromFnLoadInstance(id, instance, messageObject) {
			if (id !== object.id) {
				return;
			}
			object.isInitializing = false;
			if (!messageObject) {
				object.instance = instance;
			} else {
				object.messageObject = messageObject;
			}
			object.callbacksFromAsyncGet.each(function(key, callbackArray) {
				callbackArray.forEach(function(callbackFromAsyncGet) {
					callbackFromAsyncGet(object.instance, messageObject, object.id);
				});
			});
			object.callbacksFromAsyncGet = null;
		}
		function memorizeCallback(callbackFromAsyncGet) {
			var i;
			var found, callbackArray;
			callbackArray = object.callbacksFromAsyncGet.getItem(callbackFromAsyncGet);
			if (!callbackArray) {
				object.callbacksFromAsyncGet.setItem(callbackFromAsyncGet, [ callbackFromAsyncGet ]);
				return;
			}
			found = false;
			for(i = 0; i < callbackArray.length; i++) {
				if (callbackArray[i] === callbackFromAsyncGet) {
					found = true;
					break;
				}
			}
			if (!found) {
				callbackArray.push(callbackFromAsyncGet);
			}
		}
	};
}());
