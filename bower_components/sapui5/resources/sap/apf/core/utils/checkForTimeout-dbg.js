/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare('sap.apf.core.utils.checkForTimeout');
jQuery.sap.require('sap.apf.core.messageObject');

(function() {
	'use strict';
	/**
	 * @description tests, whether the server response is time out. Returns a message object in case of time out.
	 * @param {object} oServerResponse
	 * @returns {sap.apf.core.MessageObject|undefined}
	 */
	sap.apf.core.utils.checkForTimeout = function(oServerResponse) {
		var status;
		var oMessage;
		var redirect = false;
		//OData timeout redirect xse
		if (oServerResponse && oServerResponse.headers && oServerResponse.headers['x-sap-login-page']) {
			redirect = true;
		}
		//ajax timeout redirect xse
		if (oServerResponse && oServerResponse.getResponseHeader && oServerResponse.getResponseHeader('x-sap-login-page') !== null) {
			redirect = true;
		}
		//set status code from OData Response
		if (oServerResponse && oServerResponse.status) {
			status = oServerResponse.status;
		}
		//set status code from Ajax Response
		if (oServerResponse && oServerResponse.response && oServerResponse.response.statusCode) {
			status = oServerResponse.response.statusCode;
		}
		if (status === 303 || status === 401 || status === 403 || redirect) {
			oMessage = new sap.apf.core.MessageObject({
				code : "5021"
			});
		}
		return oMessage;
	};
}());
