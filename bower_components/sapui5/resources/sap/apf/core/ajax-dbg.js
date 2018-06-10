/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.core.ajax");

jQuery.sap.require("sap.apf.core.utils.checkForTimeout");
jQuery.sap.require("sap.ui.model.odata.ODataUtils");

(function() {
	'use strict';
	/**
	 * @memberOf sap.apf.core
	 * @description Wraps a jQuery (jQuery.ajax) request in order to handle a server time-out.
	 * @param {object} inject Configuration of the jQuery.ajax request plus additional injects.  One inject is the
	 * ajax, that shall be used, and the message handler.
	 * @returns {object} jqXHR
	 */
	sap.apf.core.ajax = function(inject) {
		var messageHandler = inject.instances && inject.instances.messageHandler;
		var oAjaxSettings = jQuery.extend(true, {}, inject);
		if (oAjaxSettings.functions && oAjaxSettings.functions.ajax) {
			delete oAjaxSettings.functions.ajax;
		}
		if (oAjaxSettings.functions && oAjaxSettings.functions.getSapSystem) {
			delete oAjaxSettings.functions.getSapSystem;
		}
		if (oAjaxSettings.instances && oAjaxSettings.instances.messageHandler) {
			delete oAjaxSettings.instances.messageHandler;
		}
		var fnBeforeSend = oAjaxSettings.beforeSend;
		var fnSuccess = oAjaxSettings.success;
		var fnError = oAjaxSettings.error;
		var originalError;
		var result;

		oAjaxSettings.beforeSend = function(jqXHR, settings) {
			if (fnBeforeSend) {
				fnBeforeSend(jqXHR, settings);
			}
		};
		oAjaxSettings.success = function(data, textStatus, jqXHR) {
			var oMessage;
			try {
				oMessage = sap.apf.core.utils.checkForTimeout(jqXHR);

				if (oMessage) {
					fnError(data, "error", undefined, oMessage);
				} else {
					fnSuccess(data, textStatus, jqXHR);
				}
			} catch(error) {
				defaultErrorHandling(error);
			}
		};
		oAjaxSettings.error = function(jqXHR, textStatus, errorThrown) {
			var oMessage;
			try {
				oMessage = sap.apf.core.utils.checkForTimeout(jqXHR);
				if (oMessage) {
					fnError(jqXHR, textStatus, errorThrown, oMessage);
				} else {
					fnError(jqXHR, textStatus, errorThrown);
				}
			} catch(error) {
				defaultErrorHandling(error);
			}
		};
		if (inject.functions && inject.functions.getSapSystem && inject.functions.getSapSystem()) {
			oAjaxSettings.url = sap.ui.model.odata.ODataUtils.setOrigin(oAjaxSettings.url, 
									{ force : true, alias : inject.functions.getSapSystem()});
		}
		if (inject.functions && inject.functions.ajax) {
			result = inject.functions.ajax(oAjaxSettings);
		} else {
			result = jQuery.ajax(oAjaxSettings);
		}
		//propagate error from synchronous processing
		if (oAjaxSettings.async !== undefined && oAjaxSettings.async === false && messageHandler && messageHandler.isOwnException(originalError)) {
			throw new Error(originalError && originalError.message || "");
		}
		return result;

		function defaultErrorHandling(error) {
			var messageText;
			var oMessage;
			originalError = error;
			if (!messageHandler.isOwnException(error)) {
				messageText = error && error.message || "";
				oMessage = messageHandler.createMessageObject({
					code : "5042",
					aParameters : [ messageText ]
				});
				messageHandler.putMessage(oMessage);
			}
		}
	};

}());