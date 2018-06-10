/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare("sap.apf.modeler.core.textPool");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require('sap.apf.utils.utils');
(function() {
	'use strict';
	/**
	 * @private 
	 * @description holds all texts of an application, that are used in the analytical configurations
	 * @class TextPool
	 * @param {object} inject Injection of required APF objects
	 * @param {object} inject.instance  Injection of required instances
	 * @param {object} inject.instances.messageHandler Injection of messageHandler instance
	 * @param {object} inject.instances.persistenceProxy Injection of persistenceProxy instance
	 * @param {object} inject.constructors  Injection of required constructors
	 * @param {object} inject.constructors.Hashtable  Injection of hashtable constructor 
	 * @param {string} applicationId is the guid of the application
	 * @param {object[]} existingTexts that have been fetched from DB
	 */
	sap.apf.modeler.core.TextPool = function(inject, applicationId, existingTexts) {
		var messageHandler = inject.instances.messageHandler;
		var persistenceProxy = inject.instances.persistenceProxy;
		var Hashtable = inject.constructors.Hashtable;
		var hashTableForTexts = new Hashtable(messageHandler);
		var keyMappingTable = new Hashtable(messageHandler);
		var guidMappingTable = new Hashtable(messageHandler);
		var keyCounter = 0;
		var defaultInitialTextElement = {
			TextElement : sap.apf.core.constants.textKeyForInitialText,
			Language : sap.apf.core.constants.developmentLanguage,
			TextElementType : "XFLD",
			TextElementDescription : "",
			MaximumLength : 10,
			Application : applicationId,
			TranslationHint : ""
		};
		function findExistingTextElement(textElementDescription, format) {
			var keys = hashTableForTexts.getKeys();
			var i, len = keys.length;
			var maximumLength = format.MaximumLength || 10;
			var translationHint = format.TranslationHint || "";
			var textElement;
			for(i = 0; i < len; i++) {
				textElement = hashTableForTexts.getItem(keys[i]);
				if ((textElement.TextElementDescription === textElementDescription) && (textElement.MaximumLength === maximumLength) && (textElement.TranslationHint === translationHint)) {
					return keys[i];
				}
			}
			return undefined;
		}
		/*
		 * #Kind,length:hint
		 * TextElement=TextElementDescription
		 */
		/**
		 * @description delete texts from text pool
		 * @param {string[]} textElementKeys array with TextElements (keys) to be added
		 * @param {string} application associated with the texts to be removed
		 * @param {function} callback is called, when save is finished. Signature is fn( sap.apf.core.MessageObject )
		 */
		this.removeTexts = function(textElementKeys, application, callback) {
			var batchRequests = [];
			var i, len;
			function callbackRemove(messageObject) {
				var j;
				if (!messageObject) {
					for(j = 0; j < len; j++) {
						hashTableForTexts.removeItem(textElementKeys[j]);
					}
				}
				callback(messageObject);
			}
			len = textElementKeys.length;
			if (len === 0) {
				callback(undefined);
				return;
			}
			for(i = 0; i < len; i++) {
				if (textElementKeys[i] === sap.apf.core.constants.textKeyForInitialText) {
					continue;
				}
				batchRequests.push({
					method : "DELETE",
					entitySetName : "texts",
					inputParameters : [ {
						name : 'TextElement',
						value : textElementKeys[i]
					}, {
						name : 'Language',
						value : sap.apf.core.constants.developmentLanguage
					} ]
				});
			}
			persistenceProxy.doChangeOperationsInBatch(batchRequests, callbackRemove, application);
		};
		this.isInitialTextKey = function(textKey) {
			return (textKey === sap.apf.core.constants.textKeyForInitialText);
		};
		/**
		 * @description add texts to the text pool and save them
		 * @param {object[]} TextElements array with TextElements to be added
		 * @param {function} callback is called, when save is finished. Signature is fn( sap.apf.core.MessageObject )
		 */
		this.addTextsAndSave = function(textElements, callback, application) {
			function areEqualTextElements(text1, text2) {
				return (text1.TextElement === text2.TextElement && text1.TextElementDescription === text2.TextElementDescription && text1.MaximumLength === text2.MaximumLength && text1.Language === text2.Language && text1.TranslationHint === text2.TranslationHint);
			}
			var i;
			var len = textElements.length;
			var existingTextElement;
			var textElementsForUpdate = [];
			var textElementsForCreate = [];
			var changeRequests = [];
			var inputParameters;
			for(i = 0; i < len; i++) {
				if (textElements[i] === sap.apf.core.constants.textKeyForInitialText) {
					continue;
				}
				existingTextElement = hashTableForTexts.getItem(textElements[i].TextElement);
				if (existingTextElement) {
					if (!areEqualTextElements(existingTextElement, textElements[i])) {
						textElementsForUpdate.push(textElements[i]);
						hashTableForTexts.setItem(textElements[i].TextElement, textElements[i]);
					}
				} else {
					textElementsForCreate.push(textElements[i]);
					hashTableForTexts.setItem(textElements[i].TextElement, textElements[i]);
				}
			}
			len = textElementsForUpdate.length;
			for(i = 0; i < len; i++) {
				inputParameters = [ {
					name : 'TextElement',
					value : textElementsForUpdate[i].TextElement
				}, {
					name : 'Language',
					value : textElementsForUpdate[i].Language
				} ];
				textElementsForUpdate[i].MaximumLength = parseInt(textElementsForUpdate[i].MaximumLength, 10);
				changeRequests.push({
					method : "PUT",
					entitySetName : "texts",
					data : textElementsForUpdate[i],
					inputParameters : inputParameters
				});
			}
			len = textElementsForCreate.length;
			for(i = 0; i < len; i++) {
				textElementsForCreate[i].MaximumLength = parseInt(textElementsForCreate[i].MaximumLength, 10);
				changeRequests.push({
					method : "POST",
					entitySetName : "texts",
					data : textElementsForCreate[i]
				});
			}
			if (changeRequests.length > 0) {
				persistenceProxy.doChangeOperationsInBatch(changeRequests, callback, application);
			} else {
				callback(undefined);
			}
		};
		/**
		 * @description creates a .property file, that suffices the SAP translation format
		 * @param {string} analyticalConfigurationName
		 * @returns {string} textPropertyFile
		 */
		this.exportTexts = function(analyticalConfigurationName) {
			var textPropertyFile = sap.apf.utils.renderHeaderOfTextPropertyFile(applicationId, messageHandler);
			var textEntryForAnalyticalConfigurationName = {
					TextElement : "AnalyticalConfigurationName",
					Language : sap.apf.core.constants.developmentLanguage,
					TextElementType : "XTIT",
					TextElementDescription : analyticalConfigurationName,
					MaximumLength : 250,
					Application : applicationId,
					TranslationHint : ""
			};
			return textPropertyFile + sap.apf.utils.renderTextEntries(hashTableForTexts, messageHandler) 
				+ sap.apf.utils.renderEntryOfTextPropertyFile(textEntryForAnalyticalConfigurationName, messageHandler);
		};
		/**
		 * gets the text for a given id
		 * @param {string} id either temporary or persistent id of the key.
		 * @returns {object} text
		 */
		this.get = function(id) {
			var databaseKey, notExistingTextElement;
			if (id === sap.apf.core.constants.textKeyForInitialText) {
				return defaultInitialTextElement;
			}
			if (hashTableForTexts.hasItem(id)) {
				return hashTableForTexts.getItem(id);
			}
			if (keyMappingTable.hasItem(id)) {
				databaseKey = keyMappingTable.getItem(id);
				if (databaseKey.TextElementDescription) {
					return databaseKey;
				}
				return hashTableForTexts.getItem(databaseKey);
			}
			notExistingTextElement = jQuery.extend({}, true, defaultInitialTextElement);
			notExistingTextElement.TextElement = id;
			notExistingTextElement.TextElementDescription = id;
			return notExistingTextElement; //finally no text was found
		};
		/**
		 * gets the database key (guid) of a text for a given id
		 * @param {string} id either temporary or persistent id (guid) of the key.
		 * @returns {string} textElement
		 */
		this.getPersistentKey = function(id) {
			return id;
		};
		/**
		 * @param {string} textElementDescription : "TITLE",
		 * @param {Object} format
		 * @param {string} format.TextElementType  example title TITLE",
		 * @param {number} format.MaximumLength
		 * @param {string} format.TranslationHint
		 * @returns {jQuery.Deferred} with argument string key
		 */
		this.setTextAsPromise = function(textElementDescription, format) {
			var textKey;
			var deferred = jQuery.Deferred();
			var updateTextAndMappingTable = function(textData, metadata, messageObject) {
				if (messageObject) {
					messageHandler.putMessage(messageObject);
				}
				if (textData) {
					hashTableForTexts.setItem(textData.TextElement, textData);
					textKey = textData.TextElement;
				}
				deferred.resolve(textData && textData.TextElement);
			};
			var data = {
				TextElement : "", //key should be filled automatically
				Language : sap.apf.core.constants.developmentLanguage,
				TextElementType : format.TextElementType,
				TextElementDescription : textElementDescription,
				MaximumLength : format.MaximumLength || 10,
				Application : applicationId,
				TranslationHint : format.TranslationHint || ""
			};
			if (!textElementDescription) {
				deferred.resolve(sap.apf.core.constants.textKeyForInitialText);
			}
			textKey = findExistingTextElement(textElementDescription, format);
			if (textKey) {
				deferred.resolve(textKey);
			} else {
				keyCounter++;
				persistenceProxy.create('texts', data, updateTextAndMappingTable, true);	
			}
			
			return deferred.promise();
		};
		/**
		 * returns an array with keys of all texts of given
		 * @param {string} textElementType - optional
		 * @returns {string[]} array with text keys
		 */
		this.getTextKeys = function(textElementType) {
			var keys = hashTableForTexts.getKeys();
			var i, text, len = keys.length;
			var textKeys = [];
			for(i = 0; i < len; i++) {
				text = hashTableForTexts.getItem(keys[i]);
				if (textElementType && text.TextElementType !== textElementType) {
					continue;
				}
				if (guidMappingTable.hasItem(keys[i])) {
					textKeys.push(guidMappingTable.getItem(keys[i]));
				} else {
					textKeys.push(keys[i]);
				}
			}
			return textKeys;
		};
		/**
		 * return all texts with properties TextElement and TextElementDescription for given TextElementType and MaximumLength
		 * @param {string} textElementType
		 * @param {number} maximumLength
		 * @returns {object[]} textElements
		 */
		this.getTextsByTypeAndLength = function(textElementType, maximumLength) {
			var keys = hashTableForTexts.getKeys();
			var i, text, len = keys.length;
			var textElements = [];
			for(i = 0; i < len; i++) {
				text = hashTableForTexts.getItem(keys[i]);
				if (text.TextElementType === textElementType && text.MaximumLength === maximumLength) {
					if (guidMappingTable.hasItem(keys[i])) {
						textElements.push({
							TextElement : guidMappingTable.getItem(keys[i]),
							TextElementDescription : text.TextElementDescription
						});
					} else {
						textElements.push({
							TextElement : keys[i],
							TextElementDescription : text.TextElementDescription
						});
					}
				}
			}
			return textElements;
		};
		function initialize() {
			var i, len;
			len = existingTexts.length;
			for(i = 0; i < len; i++) {
				if (existingTexts[i].TextElement) {
					hashTableForTexts.setItem(existingTexts[i].TextElement, existingTexts[i]);
				}
			}
		}
		initialize();
	};
}());
