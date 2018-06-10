/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap */
jQuery.sap.declare("sap.apf.core.textResourceHandler");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("jquery.sap.resources");
(function() {
	'use strict';
	/**
	 * @class The text resource handler retrieves the texts from text bundles or
	 *        property files. Text bundles which are not default loaded via apf, will
	 *        be loaded on demand by the resource path handler.
	 */
	sap.apf.core.TextResourceHandler = function(oInject) {
		var oMessageHandler = oInject.instances.messageHandler;
		var resourceBundle;
		var oHashedTextElements = new sap.apf.utils.Hashtable(oMessageHandler);
		var oHashedDatabaseTextElements = new sap.apf.utils.Hashtable(oMessageHandler);
		var oHashedInvalidKeys =  new sap.apf.utils.Hashtable(oMessageHandler);
		var registeredTexts = {};
		var ResourceModel = ( oInject.constructors &&  oInject.constructors.ResourceModel ) || sap.ui.model.resource.ResourceModel;
		/**
		 * @description retrieves the not encoded text by label object
		 * @param {object} oLabel - label object from configuration
		 * @param {string[]} [aParameters] - array with parameters to replace place holders in text bundle
		 * @returns {string}
		 */
		this.getTextNotHtmlEncoded = function(oLabel, aParameters) {
			var sText;
			var textKey;
			var keyInHashTable;
			if (typeof oLabel === "string") {
				textKey = oLabel;
			} else {
				oMessageHandler.check((oLabel !== undefined && oLabel.kind !== undefined && oLabel.kind === "text" && oLabel.key !== undefined), "Error - oLabel is not compatible");
				textKey = oLabel.key;
			}
			keyInHashTable = JSON.stringify({ textKey : textKey, parameters : aParameters});
			if(oHashedTextElements.hasItem(keyInHashTable)) {
					return oHashedTextElements.getItem(keyInHashTable);
			}
			sText = handleKeyOnlyKind(textKey, aParameters);
			oHashedTextElements.setItem(keyInHashTable, sText);
            return sText;
		};
		/**
		 * @description retrieves the encoded text by label object
		 * @param {object} oLabel - label object from configuration
		 * @param {string[]} [aParameters] - Parameter for placeholder replacement in the message bundle
		 * @returns {string}
		 */
		this.getTextHtmlEncoded = function(oLabel, aParameters) {
			return jQuery.sap.encodeHTML(this.getTextNotHtmlEncoded(oLabel, aParameters));
		};
		/**
		 * @description returns a message text for message handling
		 * @param {string} sRessourceKey - Key of the message in the Ressourcefile
		 * @param {string[]} [aParameters] - Parameter for placeholder replacement in the message bundle
		 * @returns {string}
		 */
		this.getMessageText = function(sRessourceKey, aParameters) {
			return resourceBundle.getText(sRessourceKey, aParameters, false);
		};
		/**
		 * @description called from ressource path handler to load the application texts, that come from the data base
		 * @param {textElements[]} array with text elements
		 */
		this.loadTextElements = function(textElements) {
			var i, len;
			len = textElements.length;
			for (i = 0; i < len; i++) {
				oHashedDatabaseTextElements.setItem(textElements[i].TextElement, textElements[i].TextElementDescription);
			}
		};
		/**
		 * @description add dynamically a text to the text bundle
		 * @param {string} key -  key of the text
		 * @param {string} text  text to be registered
		 */
		this.registerTextWithKey = function(key, text) {
			registeredTexts[key] = text;
		};
		
		this.loadResourceModelAsPromise = function(sApfBundleUrl, sApplicationUIBundleUrl, sApplicationMessageBundleURL) {
			var deferred = jQuery.Deferred();

			var oResourceModel = new ResourceModel({bundleUrl: sApfBundleUrl, async : true});

			if (sApplicationUIBundleUrl !== undefined && sApplicationUIBundleUrl !== "") {

				oResourceModel.enhance({bundleUrl: sApplicationUIBundleUrl, async : true}).then(function(){
					if (sApplicationMessageBundleURL !== undefined && sApplicationMessageBundleURL !== "") {
						oResourceModel.enhance({bundleUrl: sApplicationMessageBundleURL, async : true}).then(function(){
							oResourceModel.getResourceBundle().then(function(bundle){
								resourceBundle = bundle;
								deferred.resolve();	
							});
							
						});
					} else {
						oResourceModel.getResourceBundle().then(function(bundle){
							resourceBundle = bundle;
							deferred.resolve();	
						});
					}
				});
			} else if (sApplicationMessageBundleURL !== undefined && sApplicationMessageBundleURL !== "") {
				oResourceModel.enhance({bundleUrl: sApplicationMessageBundleURL, async : true}).then(function(){
					oResourceModel.getResourceBundle().then(function(bundle){
						resourceBundle = bundle;
						deferred.resolve();	
					});
				});
			} else {
				oResourceModel.getResourceBundle().then(function(bundle){
					resourceBundle = bundle;
					deferred.resolve();	
				});
			}

			return deferred.promise();	
		};
		// Private Functions 
		function handleKeyOnlyKind(key, aParameters) {
			var sText;
			if (key === sap.apf.core.constants.textKeyForInitialText) {
				return "";
			} else if (registeredTexts[key]) {
				return jQuery.sap.formatMessage(registeredTexts[key], aParameters);
			} else if (oHashedDatabaseTextElements.hasItem(key)) {
				sText = resourceBundle.getText(key, aParameters, true);
				if (typeof sText !== "string" || sText === key) {
					return oHashedDatabaseTextElements.getItem(key);	
				}
				return sText;
			} else if (oHashedInvalidKeys.hasItem(key)) {
				return oHashedInvalidKeys.getItem(key);
			}
			sText = resourceBundle.getText(key, aParameters, true);

			if (typeof sText === "string") {
				return sText;
			}

			oMessageHandler.putMessage(oMessageHandler.createMessageObject({
					code : "3001",
					aParameters : [ key ],
					oCallingObject : this
			}));
			var errorText = "# text not available: " + key;
			oHashedInvalidKeys.setItem(key, errorText );
			return errorText;
		}
	};
}());
