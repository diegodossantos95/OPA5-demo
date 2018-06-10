/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap */

jQuery.sap.declare('sap.apf.core.utils.fileExists');
jQuery.sap.require('sap.apf.core.utils.checkForTimeout');
jQuery.sap.require('sap.ui.model.odata.ODataUtils');

(function() {
	'use strict';
	/**
	 * @description Checks, whether a file exists on server
	 * @param {object} inject inject
	 * @param {object} inject.functions.ajax Ajax, that can be injected
	 * @param {object} inject.functions.getSapSystem 
	 */
	sap.apf.core.utils.FileExists = function(inject) {
		var fileExistsBuffer = {};

		var injectedAjax = inject && inject.functions && inject.functions.ajax;
		var sapSystem = inject && inject.functions && inject.functions.getSapSystem && inject.functions.getSapSystem();
		/**
		 * @description Checks, whether a file with given fully specified path exists on server. Address must be valid URL.
		 * @param {string} sUrl Path to file on server
		 * @returns {boolean}
		 */
		this.check = function (sUrl) {
			if (sapSystem) {
				sUrl = sap.ui.model.odata.ODataUtils.setOrigin(sUrl, { force : true, alias : sapSystem});
			}
			if(fileExistsBuffer[sUrl] !== undefined){
				return fileExistsBuffer[sUrl];
			}
			var bFileExists = false;
			var conf = {
					url : sUrl,
					type : "HEAD",
					success : function(oData, sStatus, oJqXHR) {
						var oMessage = sap.apf.core.utils.checkForTimeout(oJqXHR);
						if(oMessage === undefined){
							bFileExists = true;
						} else {
							bFileExists = false;
						}
					},
					error : function() {
						bFileExists = false;
					},
					async : false
			};
			if (injectedAjax) {
				injectedAjax(conf);
			} else {
				jQuery.ajax(conf);
			}
			fileExistsBuffer[sUrl] = bFileExists;
			return bFileExists;
		};
	};
}());