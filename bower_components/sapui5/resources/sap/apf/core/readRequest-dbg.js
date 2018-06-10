/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.core.readRequest");

jQuery.sap.require("sap.apf.core.request");

(function() {
	'use strict';
	/**
	 * @public
	 * @class Facade for sap.apf.core.Request for getting data via the OData protocol. This corresponds to a normal HTTP GET method. Creation is done via APF API.
	 * @name sap.apf.core.ReadRequest
	 * @param {object} oInject Injection object.
	 * @param {object} oInject.instances.coreApi Instance of core API.
	 * @param {object} oInject.instances.messageHandler The APF Message handler.
	 * @param {object} oRequest The object represents an OData GET request.
	 * @param {string} sService Service defined by the analytical content configuration.
	 * @param {string} sEntityType Entity type defined by the analytical content configuration.
	 * @returns {sap.apf.core.ReadRequest}
	 */
	sap.apf.core.ReadRequest = function(oInject, oRequest, sService, sEntityType) {
		var oCoreApi = oInject.instances.coreApi;
		var oMessageHandler = oInject.instances.messageHandler;
		/**
		 * @description Contains 'readRequest'
		 * @returns {string}
		 */
		this.type = "readRequest";
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.ReadRequest#send
		 * @description Executes an OData request.
		 * @param [{sap.apf.utils.Filter}] oFilter
		 * @param {function} fnCallback  The first argument of the callback function is the received data (as Array). The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is {sap.apf.core.MessageObject}. 
		 * @param {Object} oRequestOptions - An optional object containing additional query string options
		 * Format: { orderby : [{ property : <property_name>, order : <asc|desc>}], top : <integer>, skip : <integer> }  
		 * @returns undefined
		 */
		this.send = function(oFilter, fnCallback, oRequestOptions) {
			var filter;
			var callbackForRequest = function(oResponse, bNotUpdated) {
				var oMessageObject;
				var oEntityTypeMetadata;
				var aData = [];
				if (oResponse && oResponse.type && oResponse.type === "messageObject") {
					oMessageHandler.putMessage(oResponse); // technically logging
					oMessageObject = oResponse;
				} else {
					aData = oResponse.data;
					oEntityTypeMetadata = oResponse.metadata;
				}
				fnCallback(aData, oEntityTypeMetadata, oMessageObject);
			};
			if (oFilter) {
				filter = oFilter.getInternalFilter();
			} else {
				filter = new sap.apf.core.utils.Filter(oMessageHandler);
			}
			oRequest.sendGetInBatch(filter, callbackForRequest, oRequestOptions);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.core.ReadRequest#getMetadata
		 * @description Returns the corresponding meta data object for the read request.
		 * @returns {sap.apf.core.EntityTypeMetadata}
		 */
		this.getMetadata = function() {
			return oCoreApi.getEntityTypeMetadata(sService, sEntityType);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.ReadRequest#getMetadataFacade
		 * @description Returns {sap.apf.core.MetadataFacade} which provides convenience methods for accessing metadata
		 * (only for the service document, which is assigned to this read request instance).
		 * @param {string} sService Service defined by the request configuration.
		 * @returns {sap.apf.core.MetadataFacade}
		 */
		this.getMetadataFacade = function() {
			return oCoreApi.getMetadataFacade(sService);
		};
	};
}());