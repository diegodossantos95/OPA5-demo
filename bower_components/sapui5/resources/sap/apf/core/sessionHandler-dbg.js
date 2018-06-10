/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.sessionHandler");
jQuery.sap.require("sap.apf.core.ajax");
jQuery.sap.require("sap.apf.utils.filter");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.ui.model.odata.ODataUtils");

(function() {
	'use strict';
	/**
	 * @class Handles the session state of an APF based application, e.g. the XSRF token handling
	 */
	sap.apf.core.SessionHandler = function(inject) {
		var apfState = null;		
		var serializeApfState = false;
		var deserializeApfState = false;
		var dirtyState = false;
		var pathName = '';
		var sXsrfToken = "";
		var oHashTableXsrfToken = new sap.apf.utils.Hashtable(inject.instances.messageHandler);
		var nFetchTryCounter = 0;
		var oCoreApi = inject.instances.coreApi;
		var oMessageHandler = inject.instances.messageHandler;
		if(inject && inject.functions && inject.functions.serializeApfState && typeof inject.functions.serializeApfState == 'function') {
			serializeApfState = inject.functions.serializeApfState;
		}
		if(inject && inject.functions && inject.functions.deserializeApfState && typeof inject.functions.deserializeApfState == 'function') {
			deserializeApfState = inject.functions.deserializeApfState;
		}
		/**
		 * @description Type of the APF entity
		 */
		this.type = "sessionHandler";
		/**
		 * @see sap.apf.core.ajax
		 */
		this.ajax = function(oSettings) {
			sap.apf.core.ajax(oSettings);
		};
		/**
		 * @description Returns the XSRF token as string for a given OData service root path
		 * @param {String} serviceRootPath OData service root path
		 * @returns {jQuery.Deferred.Promise} resolves with an string of xsrf-token
		 */
		this.getXsrfToken = function(serviceRootPath) {
			var deferred = jQuery.Deferred();
			serviceRootPath = includeOriginInServiceRoot(serviceRootPath);
			var hashedValue = oHashTableXsrfToken.getItem(serviceRootPath);
			if (hashedValue !== undefined && hashedValue !== false) {
				return deferred.resolve(hashedValue);
			}
			this.fetchXcsrfToken(serviceRootPath).done(function(sXsrfToken){
				oHashTableXsrfToken.setItem(serviceRootPath, sXsrfToken);
				deferred.resolve(sXsrfToken);
			});
			return deferred.promise();
		};
		/**
		 * sap-system parameter from url has to be included in the service root path as origin
		 */
		function includeOriginInServiceRoot(serviceRootPath) {
			var sapSystem = oCoreApi.getStartParameterFacade().getSapSystem();
			
			if (sapSystem) {
				return  sap.ui.model.odata.ODataUtils.setOrigin(serviceRootPath, { force : true, alias : sapSystem});		
			}
			return serviceRootPath;
		}
		/**
		 * @description fetches XSRF token from XSE
		 */
		this.fetchXcsrfToken = function(serviceRootPath) {
			var deferred = jQuery.Deferred();
			var httpMethod = "HEAD";
			if(oHashTableXsrfToken.getItem(serviceRootPath) === false){
				httpMethod = "GET";
			}
			this.ajax({
				url : oCoreApi.getUriGenerator().getAbsolutePath(serviceRootPath),
				type : httpMethod,
				beforeSend : function(xhr) {
					xhr.setRequestHeader("x-csrf-token", "Fetch");
				},
				success : onFetchXsrfTokenResponse.bind(this),
				error : onError.bind(this),
				async : false
			});
			nFetchTryCounter = nFetchTryCounter + 1;

			function onFetchXsrfTokenResponse(oData, sStatus, oXMLHttpRequest) {
				sXsrfToken = oXMLHttpRequest.getResponseHeader("x-csrf-token");
				if(sXsrfToken !== undefined && sXsrfToken !== null){
					deferred.resolve(sXsrfToken);
				}
				/*
				 * In case XSRF prevention flag is not set in .xsaccess file for the service, then no "x-csrf-token" field is returned in response header. 
				 * For robustness, XSRF token is set to empty string. Every request triggered by APF contains then a "x-csrf-token" request header field containing an empty string. 
				 */
				if (sXsrfToken === null) {
					sXsrfToken = "";
					deferred.resolve(sXsrfToken);
				}
			}
			function onError(oResponse, sStatus, sErrorThrown) {
				if(oResponse.status === 405 && oHashTableXsrfToken.getItem(serviceRootPath) !== false){
					oHashTableXsrfToken.setItem(serviceRootPath, false);
					this.fetchXcsrfToken(serviceRootPath).done(function(sXsrfToken){
						deferred.resolve(sXsrfToken);
					});
				} else {
					sXsrfToken = "";
					var oMessageObject = oMessageHandler.createMessageObject({
						code : 5101,
						aParameters : []
					});
					oMessageHandler.putMessage(oMessageObject);
					deferred.resolve(sXsrfToken);
				}
			}
			return deferred.promise();
		};
        /**
         * @private
         * @name sap.apf.core.SessionHandler#setDirtyState
         * @function
         * @description Stores the current state for dirty information
         * @param {boolean} state
         */ 		
		this.setDirtyState = function(state) {
		    dirtyState = state;
		};
		/**
		 * @private
		 * @name sap.apf.core.SessionHandler#isDirty
		 * @function
		 * @description Returns the last set state for the dirty information
		 * @returns {boolean} true: State of current instance is dirty | false: State of current instance is clean
		 */		
		this.isDirty = function() {
		    return dirtyState;
		};
		/**
		 * @private
		 * @name sap.apf.core.SessionHandler#setPathNamee
		 * @function
		 * @description Set name is stored transiently. For persistent storage the methods of persistence object need to be used.
		 * @param {string} name 
		 */ 		
		this.setPathName = function(name) {
		    if(typeof name != 'string') {
		        pathName = '';
		        return;
		    }
		    pathName = name;
		};
        /**
         * @private
         * @name sap.apf.core.SessionHandler#getPathNamee
         * @function
         * @description Returns the last set path name
         * @returns {string} path name
         */ 		
		this.getPathName = function() {
		    return pathName;
		};
		/**
		 * @private
		 * @name sap.apf.core.SessionHandler#isApfStateAvailable
		 * @function
		 * @description Tells whether an APF state is stored transiently or not
		 * @returns {boolean} status
		 */ 		
		this.isApfStateAvailable = function() {
			if(apfState === null) {
				return false;
			}
			return true;
		};
		/**
		 * @private
		 * @name sap.apf.core.SessionHandler#storeApfState
		 * @function
		 * @description Serializes current APF state and stores it transiently
		 */ 		
		this.storeApfState = function() {
			var keepInitialStartFilterValues = true;
			if(serializeApfState) {
				serializeApfState(undefined, keepInitialStartFilterValues).done(function(serializableObject){
					apfState = serializableObject;
				});
			}
		};
		/**
		 * @private
		 * @name sap.apf.core.SessionHandler#restoreApfState
		 * @function
		 * @description Restores APF state from transient state
		 * @returns {jQuery.Deferred) Promise that will be resolved without parameters once state is restored
		 */ 		
		this.restoreApfState = function() {
			if(this.isApfStateAvailable() && deserializeApfState){
				oCoreApi.resetPath();
				return deserializeApfState(apfState);
			}
		};
	};
}());