/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

/** 
 * @class MessageHandler of APF
 */
(function() {
	'use strict';

	jQuery.sap.declare("sap.apf.core.messageHandler");
	jQuery.sap.require("sap.apf.core.messageObject");
	jQuery.sap.require("sap.apf.core.messageDefinition");
	jQuery.sap.require("sap.apf.utils.hashtable");
	jQuery.sap.require("sap.apf.utils.utils");
	jQuery.sap.require("sap.apf.core.constants");
	
	sap.apf.core.MessageHandler = function(bLogOnCreate) {
		// phases of execution
		var lifeTimePhases = {
				initial : 0,
				startup : 1,
				running : 2,
				shutdown : 3
		};

		// Private Vars
		var that = this;
		var oTextResourceHandler;
		var aLogMessages = [];
		var nCurrentLogMessageNumber = 0;
		var idRegistry;
		var fnMessageCallback;
		var callbackForTriggeringFatal;
		var bOnErrorHandling = false;
		var isInMessageCallbackProcessing = false;
		var isInTriggerFatalProcessing = false;
		var bDuringLogWriting = false;
		var bHintForFirefoxErrorIsThrown = false;
		var sUniqueErrorId = "";
		var oDefaultMessageConfiguration = {
			code : sap.apf.core.constants.message.code.errorUnknown,
			severity : sap.apf.core.constants.message.severity.error,
			rawText : "Unknown Error occurred"
		};
		var lifeTimePhase = lifeTimePhases.initial;
		var aCollectedMessageObjects = [];


		// Public Func
		/**
		 * tells the message handler about current state, whether startup or running. Error messages
		 * are handled differently during startup and after the startup. Here in startup phase the apf api is instantiated.
		 */
		this.setLifeTimePhaseStartup = function(phase) {
			lifeTimePhase = lifeTimePhases.startup;
		};
		/**
		 * the apf api has been instantiated and now apf is running
		 */
		this.setLifeTimePhaseRunning = function() {
			lifeTimePhase = lifeTimePhases.running;
		};
		/**
		 * the component is being destroyed.
		 */
		this.setLifeTimePhaseShutdown = function() {
			lifeTimePhase = lifeTimePhases.shutdown;
		};
		/**
		 * @returns {boolean} flag, that indicates, whether a fatal error has been put at startup 
		 */
		this.fatalErrorOccurredAtStartup = function() {
			var i;
			if (lifeTimePhase !== lifeTimePhases.startup) {
				return false;
			}
			for (i = 0; i < aCollectedMessageObjects.length; i++) {
				if (aCollectedMessageObjects[i].getSeverity() === sap.apf.core.constants.message.severity.fatal) {
					return true;
				}
			}
			return false;
		};

		/**
		 * @description Creates a message object. The message processing is started with sap.api.putMessage, which expects as argument a message object 
		 * of type sap.apf.core.MessageObject. So first create the message object and afterwards call sap.apf.api.putMessage with the message object as argument.
		 * @param {object} oConfig Configuration of the message.
		 * @param {string} oConfig.code The message is classified by its code. The code identifies an entry in the message configuration.
		 * @param {string[]} oConfig.aParameters Additional parameters for the message. The parameters are filled into the message text, when the message
		 * will be processed by the message handler. 
		 * @param {object} oConfig.oCallingObject Reference of the calling object. This can be used later to visualize on the user interface, 
		 * where the error happened, e.g. path or step.
		 * @returns {sap.apf.core.MessageObject}
		 */
		this.createMessageObject = function(oConfig) {
			var oMessageObject = new sap.apf.core.MessageObject(oConfig);
			if (bLogOnCreate) {
				if (oMessageObject.getCode() === undefined) {
					oMessageObject.setCode(sap.apf.core.constants.message.code.errorUnknown);
				}
				enrichInfoInMessageObject.bind(this)(oMessageObject);
				logMessage(oMessageObject, 1);
			} else if (oConfig.enrichInfoInMessageObject === true){
				enrichInfoInMessageObject.bind(this)(oMessageObject);
			}
			return oMessageObject;
		};
		/**
		 * @description The handling of the window.onerror by the message handler is either switched on or off.
		 * @param {boolean} bOnOff
		 * @returns {undefined}
		 */
		this.activateOnErrorHandling = function(bOnOff) {
			/*global window: false */
			bOnErrorHandling = bOnOff;
			if (bOnErrorHandling === true) {
				jQuery(window).on("error", handleOwnErrors);
			} else {
				jQuery(window).off("error");
			}
		};
		/**
		 * @description Injection setter. Injection is optional. If not injected, putMessage doesn't retrieve the text but instead reacts with some generic message. 
		 * @param {object} textResourceHandler
		 */
		this.setTextResourceHandler = function(textResourceHandler) {
			oTextResourceHandler = textResourceHandler;
		};
		/**
		 * @description Loads all message from the  configuration. This method is called from the resource path handler.
		 * @param {object[]} aMessages Array with message configuration objects.
		 * @param {boolean} bResetRegistry  Flag to reset registry.
		 * @returns {undefined}
		 */
		this.loadConfig = function(aMessages, bResetRegistry) {
			if (idRegistry === undefined || bResetRegistry) {
				idRegistry = new sap.apf.utils.Hashtable(that);
			}
			for(var i = 0; i < aMessages.length; i++) {
				loadMessage(aMessages[i]);
			}
		};
		/**
		 * @description Sets a callback function, so that a message can be further processed. This includes the display of the message on the user interface 
		 * and throwing an error to stop processing in case of errors.
		 * @param {function} fnCallback Either a function or undefined. The callback function will be called  with the messageObject of type 
		 * sap.apf.core.MessageObject as only parameter.
		 * @returns {undefined}
		 */
		this.setMessageCallback = function(fnCallback) {
			if (fnCallback !== undefined && typeof fnCallback === "function") {
				fnMessageCallback = fnCallback;
			} else {
				fnMessageCallback = undefined;
				// log technical error - putMessage with technical error
			}
		};
		/**
		 * This hook informs, whether an error occurred (putMessage). Currently only used by the serialization mediator
		 * @param {function} callback. The callback function will be invoked  with the messageObject of type 
		 * sap.apf.core.MessageObject as only parameter.
		 */
		this.setCallbackForTriggeringFatal = function(callback){
			if (callback !== undefined && typeof callback === "function") {
				callbackForTriggeringFatal = callback;
			} else {
				callbackForTriggeringFatal = undefined;
			}
		};
		/**
		 * @description A message is passed to the message handler for further processing. This can be an information, warning or error. 
		 * @param {sap.apf.core.MessageObject} oMessageObject The message object shall be created by method sap.apf.api.createMessageObject.
		 * @returns {undefined}
		 */
		this.putMessage = function(oMessageObject) {
			var oPreviousMessageObject;
			var nMaxPreviousObjects = 0;
			var oMessageObjectFatal;

			if (oMessageObject.getCode() === undefined) {
				oMessageObject.setCode(sap.apf.core.constants.message.code.errorUnknown);
			}
			enrichInfoInMessageObject.bind(this)(oMessageObject);
			if (oMessageObject.getSeverity() === sap.apf.core.constants.message.severity.fatal) {
				oMessageObjectFatal = that.createMessageObject({
					code : sap.apf.core.constants.message.code.errorExitTriggered
				});
				enrichInfoInMessageObject.bind(this)(oMessageObjectFatal);
				oMessageObjectFatal.setSeverity(sap.apf.core.constants.message.severity.fatal);
				if (oMessageObjectFatal.getMessage() === "") {
					oMessageObjectFatal.setMessage("The app has stopped working due to a technical error.");
				}
			}
			oPreviousMessageObject = oMessageObject.getPrevious();
			while (oPreviousMessageObject !== undefined && oPreviousMessageObject.type && oPreviousMessageObject.type === "messageObject" && nMaxPreviousObjects < 10) {
				if (oPreviousMessageObject.getCode() === undefined) {
					oPreviousMessageObject.setCode(sap.apf.core.constants.message.code.errorUnknown);
				}
				enrichInfoInMessageObject.bind(this)(oPreviousMessageObject);
				oPreviousMessageObject = oPreviousMessageObject.getPrevious();
				nMaxPreviousObjects++;
			}
			if (oMessageObjectFatal !== undefined) {
				oMessageObjectFatal.setPrevious(oMessageObject);
				oMessageObject = oMessageObjectFatal;
			}
			if (!bLogOnCreate) {
				logMessage(oMessageObject, 10);
			}
			aCollectedMessageObjects.push(oMessageObject);
			if (isInMessageCallbackProcessing) { // no cycles from ui
				return;
			}
			if (oMessageObject.getSeverity() === sap.apf.core.constants.message.severity.technError) {
				return;
			}
			if (fnMessageCallback !== undefined) {
				if (lifeTimePhase === lifeTimePhases.shutdown || (lifeTimePhase === lifeTimePhases.startup && oMessageObject.getSeverity() !== sap.apf.core.constants.message.severity.fatal)) {
					//currently no concept for non fatal errors at startup or shutdown
					return;
				} 
				isInMessageCallbackProcessing = true; 
				fnMessageCallback(oMessageObject);
				isInMessageCallbackProcessing = false;
			}

			if(callbackForTriggeringFatal !== undefined && isInTriggerFatalProcessing === false){
				isInTriggerFatalProcessing = true;
				callbackForTriggeringFatal(oMessageObject);
				isInTriggerFatalProcessing = false;
			}

			//leave current execution control flow
			if (oMessageObject.getSeverity() === sap.apf.core.constants.message.severity.fatal && lifeTimePhase !== lifeTimePhases.shutdown) {
				if (sap.ui.Device.browser.firefox) {
					bHintForFirefoxErrorIsThrown = true;
				}
				throw new Error(sUniqueErrorId);
			}
		};
		/**
		 * @description Test whether condition is violated and puts a corresponding message.
		 * @param {boolean} booleExpression Boolean expression, that is evaluated.
		 * @param {string} sMessage A text, that is included in the message text
		 * @param {string} [sCode] Error code 5100 is default, 5101 for warning. Other codes can be used, if the default message text is not specific enough.
		 * @returns {undefined}
		 */
		this.check = function(booleExpression, sMessage, sCode) {
			var sErrorCode = sCode || sap.apf.core.constants.message.code.errorCheck;
			if (!booleExpression) {
				var oMessageObject = this.createMessageObject({
					code : sErrorCode,
					aParameters : [ sMessage ]
				});
				that.putMessage(oMessageObject);
			}
		};
		/**
		 * @description Returns a reference of a message configuration object. Not a copy.
		 * @param {string} sErrorCode
		 * @returns {object} oConfiguration
		 */
		this.getConfigurationByCode = function(sErrorCode) {
			if (idRegistry === undefined) { //before loading the configuration
				return undefined;
			}
			return idRegistry.getItem(sErrorCode);
		};
		/**
		 * @description Returns a copy of APF log messages. The last message put is on first position in array.
		 * @returns {string[]}
		 */
		this.getLogMessages = function() {
			return jQuery.extend(true, [], aLogMessages);
		};
		/**
		 * @description Resets the message handler: Unset the message callback function, loads default message configuration and cleans message log. 
		 * @returns {undefined}
		 */
		this.reset = function() {
			idRegistry = undefined;
			fnMessageCallback = undefined;
			aLogMessages = [];
			aCollectedMessageObjects = [];
		};
		/**
		 * detects, whether this is the exception, that was thrown due to a fatal error
		 * @returns {boolean} true, if thrown by the message handler instance
		 */
		this.isOwnException = function(error) {
			return (error && error.message && error.message.search(sUniqueErrorId) > -1);
		};
		// Private Functions
		function isOwnErrorEvent(oEvent) {
			if (sap.ui.Device.browser.firefox) {
				return bHintForFirefoxErrorIsThrown;
			}
			return (oEvent.originalEvent && oEvent.originalEvent.message && oEvent.originalEvent.message.search(sUniqueErrorId) > -1);
		}
		function isErrorEventFromOtherApfInstance(oEvent) {
			return (oEvent.originalEvent && oEvent.originalEvent.message && oEvent.originalEvent.message.search(sUniqueErrorId) === -1 && oEvent.originalEvent.message.search(sap.apf.core.constants.message.code.suppressFurtherException) > -1);
		}
		function getUniqueErrorId() {
			var uniqueInteger = sap.apf.utils.createPseudoGuid(32);
			return sap.apf.core.constants.message.code.suppressFurtherException + uniqueInteger;
		}
		function isKnownCodeWithoutConfiguration(sCode) {
			var number = parseInt(sCode, 10);
			return (number == sap.apf.core.constants.message.code.errorExitTriggered || number == sap.apf.core.constants.message.code.errorUnknown || number == sap.apf.core.constants.message.code.errorInMessageDefinition);
		}
		function isFatalMessageWithoutConfiguration(sCode) {
			var number = parseInt(sCode, 10);
			return (number == sap.apf.core.constants.message.code.errorExitTriggered || number == sap.apf.core.constants.message.code.errorInMessageDefinition );
		}
		// Determine and set message text according to configuration
		function enrichInfoInMessageObject(oMessageObject) {

			function includeParameters(text, parameters) {
				var nParamIndex = 0;
				while (text.indexOf("{" + nParamIndex + "}") > -1) {
					if (typeof parameters[nParamIndex] === "string") {
						text = text.replace("{" + nParamIndex + "}", parameters[nParamIndex]);
					} else {
						text = text.replace("{" + nParamIndex + "}", "undefined");
					}
					nParamIndex++;
				}
				return text;
			}
			var sCode = oMessageObject.getCode();
			var oMessageConfiguration = that.getConfigurationByCode(sCode);
			if (oMessageConfiguration === undefined) {
				oMessageConfiguration = jQuery.extend(true, {}, oDefaultMessageConfiguration);
				if (isKnownCodeWithoutConfiguration(sCode)) {
					if (oMessageObject.hasRawText()) {
						oMessageConfiguration.rawText = oMessageObject.getRawText();
					}
					oMessageConfiguration.rawText += ' ' + oMessageObject.getParameters();
					if (isFatalMessageWithoutConfiguration(sCode)) {
						oMessageConfiguration.severity = sap.apf.core.constants.message.severity.fatal;
					}
				} else {
					oMessageConfiguration.rawText = "Message " + sCode + "  " + oMessageObject.getParameters() + " (Message Code has no Configuration)";
				}
				if (!isKnownCodeWithoutConfiguration(sCode)) {
					oMessageObject.setCode(oMessageConfiguration.code);
				}
			}
			if (oMessageConfiguration.severity !== undefined) {
				oMessageObject.setSeverity(oMessageConfiguration.severity);
			} else {
				oMessageObject.setSeverity(sap.apf.core.constants.message.severity.technError);
			}

			if (oMessageConfiguration.rawText) {
				oMessageObject.setMessage(oMessageConfiguration.rawText);
			} else {
				var aParameters = oMessageObject.getParameters();
				if (oMessageObject.getSeverity() === sap.apf.core.constants.message.severity.technError) {
					var sTechnText = that.getConfigurationByCode(oMessageConfiguration.code).text;
					if (!sTechnText) {
						sTechnText = that.getConfigurationByCode(oMessageConfiguration.code).description;
					}
					oMessageObject.setMessage(includeParameters(sTechnText, aParameters));
				} else {
					try {
						if (oTextResourceHandler && oMessageConfiguration.key) {
							oMessageObject.setMessage(oTextResourceHandler.getMessageText(oMessageConfiguration.key, oMessageObject.getParameters()));
						} else if (oMessageConfiguration.description) {
							oMessageObject.setMessage(includeParameters(oMessageConfiguration.description, aParameters));
						} else {
							oMessageObject.setMessage("Message Code: " + sCode + " " + aParameters.toString());
						}
					} catch (oError) {
						if (oMessageConfiguration.description) {
							oMessageObject.setMessage(includeParameters(oMessageConfiguration.description, aParameters));
						} else {
							oMessageObject.setMessage("Message Code: " + sCode + " " + aParameters.toString());
						}
					}
				}
			}
		}
		function logMessage(oMessage, nMaxPreviousObjects) {
			var sLogPrefix = "APF message ";
			var sPreviousTxt = "";
			var nMaxPreviousObjectsInNextLog = nMaxPreviousObjects - 1;
			if (nMaxPreviousObjects === 0) {
				return;
			}
			// logging of previous message(s) first!
			var oPrevious = oMessage.getPrevious();
			if (oPrevious !== undefined) {
				logMessage(oPrevious, nMaxPreviousObjectsInNextLog);
				sPreviousTxt = " - (see previous message for more information)";
			}
			nCurrentLogMessageNumber++;
			var sLog = sLogPrefix + '(' + nCurrentLogMessageNumber + '): ' + oMessage.getCode() + " - " + oMessage.getMessage() + sPreviousTxt;
			if (bDuringLogWriting) {
				/*eslint-disable no-alert */
				alert("Fatal Error during Log Writing " + sLog);
				/*eslint-enable no-alert */
				return;
			}
			bDuringLogWriting = true;
			//adds fatal log message on first position in array
			if (oMessage.getSeverity() === sap.apf.core.constants.message.severity.fatal) {
				if (aLogMessages.length < 2) { // do not show to many fatal messages!
					aLogMessages.unshift(sLog);
				}
			}
			switch (oMessage.getSeverity()) {
				case sap.apf.core.constants.message.severity.warning:
					jQuery.sap.log.warning(sLog);
					break;
				case sap.apf.core.constants.message.severity.error:
					jQuery.sap.log.error(sLog);
					break;
				case sap.apf.core.constants.message.severity.fatal:
					jQuery.sap.log.error(sLog);
					break;
				case sap.apf.core.constants.message.severity.technError:
					jQuery.sap.log.error(sLog);
					break;
				default:
					jQuery.sap.log.info(sLog);
			}
			bDuringLogWriting = false;
		}
		function setItem(oItem) {
			that.check(oItem !== undefined && oItem.hasOwnProperty("code") !== false, "MessageHandler setItem: oItem is undefined or property 'code' is missing", sap.apf.core.constants.message.code.errorInMessageDefinition);
			var result = idRegistry.setItem(oItem.code, oItem);
			that.check((result === undefined), "MessageHandler setItem: Configuration includes duplicated codes", sap.apf.core.constants.message.code.errorInMessageDefinition);
		}
		function loadMessage(oMessage) {
			if (oMessage.type === undefined) {
				oMessage.type = "message";
			}
			setItem(oMessage);
		}
		// handle on error will be activated after initialization of the message
		// handler.
		function handleOwnErrors(oEvent) {
			var oMessage;
			var sMessage = "";
			var lineNumber = "";
			var sUrl = "";
			var sText = "";
			var bBrowserSupportErrorEvent = true;
			if (sap.ui.Device.browser.firefox) {
				bBrowserSupportErrorEvent = false;
			}
			if (bBrowserSupportErrorEvent && oEvent && oEvent.originalEvent) {
				sMessage = oEvent.originalEvent.message;
				sUrl = oEvent.originalEvent.filename;
				lineNumber = oEvent.originalEvent.lineno;
			}
			if (isOwnErrorEvent(oEvent)) {
				oEvent.stopImmediatePropagation();
				oEvent.preventDefault();
			} else if (isErrorEventFromOtherApfInstance(oEvent)) {
				return;
			} else if (isInMessageCallbackProcessing) {
				sText = "";
				if (bBrowserSupportErrorEvent) {
					sText = sMessage + " (source: " + sUrl + ":" + lineNumber + ")";
				}
				oMessage = new sap.apf.core.MessageObject({
					code : "5070",
					aParameters : [ sText ]
				});
				enrichInfoInMessageObject.bind(this)(oMessage);
				logMessage(oMessage, 1);
			} else {
				sText = "";
				if (bBrowserSupportErrorEvent) {
					sText = sMessage + " (source: " + sUrl + ":" + lineNumber + ")";
				}
				oMessage = new sap.apf.core.MessageObject({
					code : "5070",
					aParameters : [ sText ]
				});
				enrichInfoInMessageObject.bind(this)(oMessage);
				logMessage(oMessage, 1);
			}
		}
		function initialize() {
			sUniqueErrorId = getUniqueErrorId();
		}
		initialize();
	};

}());