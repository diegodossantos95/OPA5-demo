/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare("sap.apf.modeler.core.elementContainer");
(function() {
	'use strict';
	/**
	 * @private
	 * @name sap.apf.modeler.core.ElementContainer
	 * @description Managed object on top of some hashtable, simplifies code.
	 * @param {String} name
	 * @param {Function|undefined|{}} ElementConstructor - When a constructor function is provided then a new instance is created in method createElement.
	 *  When undefined or an empty object are given then an empty object instance is created.
	 * @param {Object} inject
	 * @param {Object} inject.instances.messageHandler
	 * @param {Object} dataFromCopy                optional parameter to set the internal state of the new instance during a copy operation
	 * @param {Object} dataFromCopy.elements
	 * @param {Object} dataFromCopy.elementCounter
	 * @constructor
	 */
	sap.apf.modeler.core.ElementContainer = function(name, ElementConstructor, inject, dataFromCopy) {
		var elements, elementCounter, regexp = new RegExp("^" + name + "-([123456789]\\d*)$"), regexp2 = new RegExp("^" + name);
		/** @type sap.apf.modeler.core.ElementContainer
		 * @description NOTE: due to the way of binding functions used in classes ConfigurationEditor and Step
		 * "this" in many functions is bound to the calling object, not to this of type sap.apf.modeler.core.ElementContainer.
		 * Thus, always use that inside functions!
		 */
		var that = this;
		inject.instances.messageHandler.check(name !== undefined, "ElementContainer: Element has been created without name");
		if (!dataFromCopy) {
			elements = new inject.constructors.Hashtable(inject.instances.messageHandler);
			elementCounter = 0;
		} else {
			elements = dataFromCopy.elements;
			elementCounter = dataFromCopy.elementCounter;
		}
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#generateId
		 * @description Create a unique Id, unique in this container.
		 * @returns {string} - Id
		 */
		this.generateId = function() {
			return name + "-" + (++elementCounter);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#createElement
		 * @description Create an empty element.
		 * @param {Object} [element] - Optional object whose members are merged into the created element.
		 * @returns {{getId:string}}
		 */
		this.createElement = function(element, SpecifiedConstructor) {
			var elementId;
			elementId = that.generateId();
			return createElementWithId(element, elementId, SpecifiedConstructor);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#createElementWithProposedId
		 * @description Create an empty element with an proposed id. Use the proposed id, if not yet used.
		 * @param {Object} [element] - Optional object whose members are merged into the created element.
		 * @param {String} proposedId Id, that should be used, if not already another object has this id
		 */
		this.createElementWithProposedId = function(element, proposedId, SpecifiedConstructor) {
			function adaptElementCounter(newId) {
				/*
				 * If the newId obeys to the naming conventions for internal IDs, we might need
				 * to update the elementCounter with the number extracted from newId,
				 * so that still new element Ids are created by the internal numbering algorithm
				 * in method createElement.
				 */
				var match = regexp.exec(newId);
				if (match) {
					var number = parseInt(match[1], 10);
					if (number > elementCounter) {
						elementCounter = number;
					}
				}
			}
			var created;
			var existingElementWithSameId = elements.getItem(proposedId);
			if (existingElementWithSameId) {
				return that.createElement(element, SpecifiedConstructor);
			}
			created = createElementWithId(element, proposedId, SpecifiedConstructor);
			adaptElementCounter(proposedId);
			return created;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#removeElement
		 * @description Remove an existing element.
		 * @param {String} id
		 */
		this.removeElement = function(id) {
			return elements.removeItem(id);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#getElement
		 * @description Get an identified existing element.
		 * @param {Object} elementId
		 * @returns {{getId:string}}
		 */
		this.getElement = function(elementId) {
			return elements.getItem(elementId);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#updateElement
		 * @description Update an existing element.
		 * @param {String} elementId
		 * @param {Object} element
		 * @returns {String} The elementId
		 */
		this.updateElement = function(elementId, element) {
			inject.instances.messageHandler.check(elementId !== undefined, "ElementContainer: Element has been updated with undefined elementId");
			if ((!element.getId) || element.getId() !== elementId) {
				element.getId = function() {
					return elementId;
				};
			}
			elements.setItem(elementId, element);
			return elementId;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#setElement
		 * @description Create a new element or update an existing element. An element gets assigned a member "getId()" that returns the generated elementId.
		 * See {@link sap.apf.modeler.core.ElementContainer#createElement} and {@link sap.apf.modeler.core.ElementContainer#updateElement}.
		 * Trying to set an element with a given elementId when the element is not yet existing will result in an error. Thus, elementIds cannot be determined externally.
		 * @param {object} element
		 * @param {String} [elementId] element identifier. If parameter is omitted, then the function has the meaning of create, otherwise update.
		 * @returns{String|undefined} Returns the id of a newly created or updated element
		 */
		this.setElement = function(element, elementId) {
			var createdItem;
			if (elementId) {
				if (!(elements.getItem(elementId))) {
					inject.instances.messageHandler.putMessage(inject.instances.messageHandler.createMessageObject({
						code : '11006',
						aParameters : [ elementId ]
					}));
					return undefined;
				}
				that.updateElement(elementId, element);
				return elementId;
			}
			createdItem = that.createElement(element);
			return createdItem.getId();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#getElements
		 * @description Get all existing elements.
		 * @returns {Object[]}
		 */
		this.getElements = function() {
			var list = [];
			elements.forEachOrdered(function(id, element) {
				list.push(element);
			});
			return list;
		};
		/**
		 * Change the ordering by moving one key some positions.
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#moveUpOrDown
		 * @param {string} elementId
		 * @param {number} distance
		 * @returns {number|null} WHEN either elementId is not contained or undefined THEN return null.
		 *      Otherwise return the index of the index position of moved elementId, after the move.
		 */
		this.moveUpOrDown = function(elementId, distance) {
			return elements.moveUpOrDown(elementId, distance);
		};
		/**
		 * Change the ordering by moving one key in the ordering before another key.
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#moveBefore
		 * @param {string} beforeElementId
		 * @param {string} movedElementId
		 * @returns {number|null} WHEN either elementId is not contained or undefined THEN return null.
		 *      Otherwise return the index of the index position of movedElementId, after the move.
		 */
		this.moveBefore = function(beforeElementId, movedElementId) {
			return elements.moveBefore(beforeElementId, movedElementId);
		};
		/**
		 * Change the ordering by moving one element in the ordering to the end.
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#moveToEnd
		 * @param {string} elementId
		 * @returns {number|null} WHEN the key elementId is not contained or undefined THEN return null.
		 *      Otherwise return the index of the index position of moveKey, after the move.
		 */
		this.moveToEnd = function(elementId) {
			return elements.moveToEnd(elementId);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#copyElement
		 * @description Copy an element (deep).
		 * @param {String} id - Id to be copied
		 * @returns {string} - Id of the result of the copy
		 */
		this.copyElement = function(id) {
			var element, copiedElement, newId;
			element = elements.getItem(id);
			if (!element) {
				return;
			}
			newId = that.generateId();
			if (element.copy && typeof element.copy === "function") {
				copiedElement = element.copy(newId);
			} else {
				copiedElement = sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(element);
			}
			copiedElement.getId = function() {
				return newId;
			};
			elements.setItem(newId, copiedElement);
			return newId;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.core.ElementContainer#copy
		 * @description Execute a deep copy of the element container and the contained objects
		 * @param {String} newName - optional new name for the copied element container
		 * @returns {Object} sap.apf.modeler.core.ElementContainer# New element container object being a copy of this
		 */
		this.copy = function(newName) {
			var copiedData = {
				elements : new inject.constructors.Hashtable(inject.instances.messageHandler),
				elementCounter : elementCounter
			};
			var element;
			var copiedElement;
			elements.getKeysOrdered().forEach(function(id) {
				element = elements.getItem(id);
				copiedElement = sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(element);
				if (newName && id.indexOf(name) === 0) {
					id = id.replace(regexp2, newName);
				}
				inject.instances.messageHandler.check(id !== undefined, "ElementContainer: Element has been created without name in copy - 1");
				if (typeof copiedElement === "object" && copiedElement.getId && typeof copiedElement.getId === "function") {
					copiedElement.getId = function() {
						return id;
					};
				}
				copiedData.elements.setItem(id, copiedElement);
			});
			inject.instances.messageHandler.check(name !== undefined || newName !== undefined, "ElementContainer: Element has been created without name in copy 2");
			return new sap.apf.modeler.core.ElementContainer((newName || name), ElementConstructor, inject, copiedData);
		};
		/**
		 * private functions
		 */
		function createElementWithId(element, elementId, SpecifiedConstructor) {
			var created;
			inject.instances.messageHandler.check(elementId !== undefined, "ElementContainer: Element has been created with undefined id");
			if(typeof SpecifiedConstructor === 'function'){
				created = new SpecifiedConstructor(elementId, inject);
			} else if (typeof ElementConstructor === 'function') {
				if (ElementConstructor !== sap.apf.modeler.core.ElementContainer) {
					created = new ElementConstructor(elementId, inject);
				} else {
					created = new ElementConstructor(elementId, undefined, inject);
				}
			} else {
				created = {};
			}
			created.getId = function() {
				return elementId;
			};
			if (element) {
				created = jQuery.extend(created, element);
			}
			elements.setItem(elementId, created);
			return created;
		}
	};
}());
