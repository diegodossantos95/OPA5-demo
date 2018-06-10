/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.core.messageObject");

(function() {
	'use strict';
	/**
	 * @public
	 * @class The message object represents the APF specific message object for detailed evaluation. The message object shall be created by method {@link sap.apf.Api#createMessageObject}.
	 * @name sap.apf.core.MessageObject
	 * @param {object} oConfig 
	 */
	sap.apf.core.MessageObject = function(oConfig) {
		// private vars
		var sCode = oConfig.code;
		var aParameters = oConfig.aParameters || [];
		var oCallingObject = oConfig.oCallingObject;
		var sMessage = "";
		var sSeverity = "";
		var oPrevious;
		var dtTimestamp = new Date();
		var rawText = oConfig.rawText;
		/**
		 * @description Contains 'messageObject'
		 * @returns {string}
		 */
		this.type = "messageObject";
		// public function
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#getCode
		 * @description Returns the message code.
		 * @returns {string}
		 */
		this.getCode = function() {
			return sCode;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#setCode
		 * @description Sets the code, that classifies the message.
		 * @param {string} code 
		 * @returns undefined
		 */
		this.setCode = function(code) {
			sCode = code;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#hasRawText
		 * @description Returns true, if a raw text is set. 
		 * @returns {boolean}
		 */
		this.hasRawText = function() {
			return (rawText !== undefined);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#getRawText
		 * @description Returns raw text. 
		 * @returns {string}
		 */
		this.getRawText = function() {
			return rawText;
		};

		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#getMessage
		 * @description Returns the message text.
		 * @returns {string}
		 */
		this.getMessage = function() {
			return sMessage;
		};

		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#setMessage
		 * @description Sets the message text.
		 * @param {string} sTextMessage 
		 * @returns undefined
		 */
		this.setMessage = function(sTextMessage) {
			sMessage = sTextMessage;
		};

		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#setSeverity
		 * @description Sets the severity , which classifies the message.
		 * @param {string} severity Only for to build in error messages. Allowed values are defined in {@link sap.apf.constants.severity}.
		 * @returns undefined
		 */
		this.setSeverity = function(severity) {
			sSeverity = severity;
		};

		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#getSeverity
		 * @description Returns the severity.
		 * @returns {string}
		 */
		this.getSeverity = function() {
			return sSeverity;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#setPrevious
		 * @description Sets the previous message object. One can add a message object to this message object, that describes a previous message. 
		 * The message in the previous message object will also be displayed in the log (as previous entry). 
		 * @param {sap.apf.core.MessageObject} oPreviousMessageObject 
		 * @returns undefined
		 */
		this.setPrevious = function(oPreviousMessageObject) {
			oPrevious = oPreviousMessageObject;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#getPrevious
		 * @description Gets the previous message object. 
		 * @returns {sap.apf.core.MessageObject} || undefined
		 */
		this.getPrevious = function() {
			return oPrevious;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#getCallingObject
		 * @description Returns the calling object
		 * @returns {object}
		 */
		this.getCallingObject = function() {
			return oCallingObject;
		};

		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#getParameters
		 * @description Returns the parameter which were passed over
		 * @returns {array}
		 */
		this.getParameters = function() {
			return aParameters;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#getStack
		 * @description Returns the stack of the error object to get the line number and source file
		 * @returns {string}
		 */
		this.getStack = function() {
			if (this.stack) {
				return this.stack;
			}
			return "";
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#getTimestamp
		 * @description Returns the time stamp of the message object in seconds after 1970
		 * @returns {number}
		 */
		this.getTimestamp = function() {
			return dtTimestamp.getTime();
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#getTimestampAsdateObject
		 * @description Returns the time stamp of the message object as a date
		 * @returns {date}
		 */
		this.getTimestampAsdateObject = function() {
			return dtTimestamp;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#getJQueryVersion
		 * @description Returns the version of jQuery
		 * @returns {string}
		 */
		this.getJQueryVersion = function() {
			return jQuery().jquery;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.MessageObject#getSapUi5Version
		 * @description Returns the version of SAP UI5
		 * @returns {string}
		 */
		this.getSapUi5Version = function() {
			return sap.ui.version;
		};
		// private function
	};
	// set Prototype to get a JavaScript API Message Object
	sap.apf.core.MessageObject.prototype = new Error();
	sap.apf.core.MessageObject.prototype.constructor = sap.apf.core.MessageObject;

}());