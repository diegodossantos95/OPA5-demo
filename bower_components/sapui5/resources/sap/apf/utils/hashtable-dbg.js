/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare('sap.apf.utils.hashtable');
(function() {
	'use strict';
	/**
	 * @name sap.apf.utils.Hashtable
	 * @class hash table
	 * @description Stores and returns objects under unique key. Keys are provided by the caller, not generated.
	 * @param {sap.apf.core.MessageHandler} oMessageHandler - A handler for error messages.
	 */
	sap.apf.utils.Hashtable = function(oMessageHandler) {
		var nNumberOfItems = 0;
		var oItemHolder = {};
		var orderList = []; // ordered by arrival (create)
		/**
		 * @description type information
		 */
		this.type = "hashTable";
		/**
		 * @description Add or update an object to the hash table with key and value.
		 * @param {string} key - Unique key.
		 *      WHEN the key is new to the hashtable THEN a new entry is created and undefined returned.
		 *      Otherwise WHEN the key already exists THEN the associated value is updated and the previous value returned.
		 *      WHEN the key equals to undefined or null THEN an error message is put and undefined returned.
		 * @param {*} value - Item, can be anything like javascript object, string, function or number
		 * @returns {*|undefined} Previous object or undefined.
		 */
		this.setItem = function(key, value) {
			var oPreviousValue;
			oMessageHandler.check((key !== undefined && key !== null), "sap.apf.utils.HashTable.setItem: key undefined");
			oMessageHandler.check((value !== undefined && value !== null), "sap.apf.utils.HashTable.setItem: value undefined");
			if (this.hasItem(key)) {
				oPreviousValue = oItemHolder[key];
			} else {
				nNumberOfItems++;
				orderList.push(key);
			}
			oItemHolder[key] = value;
			return oPreviousValue;
		};
		/**
		 * @descriptions Returns the number of items in the hash table
		 * @returns {number} Number of items in hash table
		 */
		this.getNumberOfItems = function() {
			return nNumberOfItems;
		};
		/**
		 * @description Get the value by the key.
		 * @param {string} key
		 * @returns {*|undefined} Hashed item or undefined
		 */
		this.getItem = function(key) {
			oMessageHandler.check((key !== undefined && key !== null), "sap.apf.utils.HashTable.getItem key undefined");
			return this.hasItem(key) ? oItemHolder[key] : undefined;
		};
		/**
		 * @description Tests whether an item with key exists in the hash table.
		 * @param {*} key - WHEN undefined or null THEN put error message.
		 * @returns {boolean} True if key exists, false otherwise.
		 */
		this.hasItem = function(key) {
			oMessageHandler.check((key !== undefined && key !== null), "sap.apf.utils.HashTable.hasItem key undefined");
			return oItemHolder.hasOwnProperty(key);
		};
		/**
		 * @description Removes a key and its associated item from the hash table.
		 * @param {*} key - WHEN undefined or null THEN put error message.
		 * @returns {*|undefined} Removed item or undefined when ke was not existing.
		 */
		this.removeItem = function(key) {
			oMessageHandler.check((key !== undefined && key !== null), "sap.apf.utils.HashTable.removeItem key undefined");
			var oItemRemoved;
			if (this.hasItem(key)) {
				oItemRemoved = oItemHolder[key];
				nNumberOfItems--;
				orderList.splice(orderList.indexOf(key), 1);
				delete oItemHolder[key];
				return oItemRemoved;
			}
			return undefined;
		};
		/**
		 * @description Returns all keys of the hash table.
		 * @returns {object[]} Array with keys.
		 */
		this.getKeys = function() {
			var aKeys = [];
			var k;
			//noinspection JSLint
			for(k in oItemHolder) {
				//noinspection JSUnfilteredForInLoop
				if (this.hasItem(k)) {
					//noinspection JSUnfilteredForInLoop
					aKeys.push(k);
				}
			}
			return aKeys;
		};
		/**
		 * @description Applies a function on each item in the hash table.
		 * @param {function} fn - A function to be applied with k and item as parameters.
		 * @param {string} fn.key - The key.
		 * @param {*} fn.item - The item associated to that key.
		 */
		this.each = function(fn) {
			var k;
			//noinspection JSLint
			for(k in oItemHolder) {
				//noinspection JSUnfilteredForInLoop
				if (this.hasItem(k)) {
					//noinspection JSUnfilteredForInLoop
					fn(k, oItemHolder[k]);
				}
			}
		};
		/**
		 * @description Applies a function on each item in the hash table.
		 *      It applies the function corresponding to the associated ordering of all items in the hash table.
		 *      The ordering is determined by the order of creation by setItem() and by methods that change the ordering.
		 * @param {Function} fn
		 * @param {string} fn.key - The key.
		 * @param {*} fn.item - The item associated to that key.
		 */
		this.forEachOrdered = function(fn) {
			var that = this;
			orderList.forEach(function(key) {
				if (!that.hasItem(key)) {
					oMessageHandler.check(false, "sap.apf.utils.HashTable.forEachOrdered: key not contained");
				} else {
					fn(key, oItemHolder[key]);
				}
			});
		};
		/**
		 * @description Return an ordered array of keys. The order is determined by the order of creation and order changing methods.
		 * @returns {String[]} - An array of keys.
		 */
		this.getKeysOrdered = function() {
			var list = [];
			this.forEachOrdered(function(key) {
				list.push(key);
			});
			return list;
		};
		/**
		 * Move the item with key movedKey up or down in the order by distance. If distance is negative, then move it up distance places
		 * in the order. If distance is positive, then move it down by distance in the order. The maximum move is to the array boundaries!
		 * @param {object} movedKey key to move
		 * @param {number} distance
		 * @returns {number|null} when movedKey is not contained then return null. Otherwise the position, where it has been moved to.
		 * 
		 */
		this.moveUpOrDown = function(movedKey, distance) {
			oMessageHandler.check((movedKey !== undefined && movedKey !== null), "sap.apf.utils.HashTable.moveItemUpOrDown movedKey undefined");
			var index = orderList.indexOf(movedKey);
			var newPosition = index + distance;
			if (index < 0) {
				return null;
			}
			if (distance < 0) {
				orderList.splice(index, 1); //remove
				if (newPosition < 0) {
					orderList.splice(0, 0, movedKey);
					return 0;
				}
				orderList.splice(index + distance, 0, movedKey);
				return index + distance;
			} else if (distance === 0) {
				return index;
			} else if (distance > 0) {
				orderList.splice(index, 1); //remove
				if (newPosition >= orderList.length) {
					orderList.splice(orderList.length, 0, movedKey);
					return orderList.length;
				}
				orderList.splice(newPosition, 0, movedKey);
				return newPosition;
			}
		};
		/**
		 * Change the ordering by moving one key in the ordering before another key.
		 * @param beforeKey
		 * @param movedKey
		 * @returns {number|null} WHEN either key is not contained or undefined THEN return null.
		 *      Otherwise return the index of the index position of moveKey, after the move.
		 */
		this.moveBefore = function(beforeKey, movedKey) {
			if (orderList.indexOf(beforeKey) < 0 || orderList.indexOf(movedKey) < 0) {
				return null;
			}
			if (beforeKey === movedKey) {
				return orderList.indexOf(movedKey);
			}
			orderList.splice(orderList.indexOf(movedKey), 1); // remove
			orderList.splice(orderList.indexOf(beforeKey), 0, movedKey); // insert
			return orderList.indexOf(movedKey);
		};
		/**
		 * Change the ordering by moving one key in the ordering to the end.
		 * @param beforeKey
		 * @returns {number|null} WHEN the key is not contained or undefined THEN return null.
		 *      Otherwise return the index of the index position of moveKey, after the move.
		 */
		this.moveToEnd = function(movedKey) {
			if (orderList.indexOf(movedKey) < 0) {
				return null;
			}
			orderList.splice(orderList.indexOf(movedKey), 1); // remove
			orderList.push(movedKey); // insert
			return orderList.indexOf(movedKey);
		};
		/**
		 * @description Deletes all key/value pairs of the hash table.
		 */
		this.reset = function() {
			oItemHolder = {};
			orderList = [];
			nNumberOfItems = 0;
		};
	};
}());
