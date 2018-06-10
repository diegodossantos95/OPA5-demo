/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.core.readRequestByRequiredFilter");

jQuery.sap.require("sap.apf.core.request");
(function() {
	'use strict';
	/**
	 * @public
	 * @class Facade for sap.apf.core.Request for getting data via the OData protocol. This corresponds to a normal HTTP GET method. Creation is done via APF API.
	 * In addition to the handed over filter argument in method send(), the required filters and parameter entity set key properties of the configured entity type are applied, which are determined from path filter. 
	 * @name sap.apf.core.ReadRequestByRequiredFilter
	 * @param {object} oInject Injection object.
	 * @param {object} oInject.instances.coreApi Instance of core API.
	 * @param {object} oInject.instances.oMessageHandler The APF Message handler.
	 * @param {object} oRequest The object represents an OData GET request.
	 * @param {string} sService Service defined by the analytical content configuration.
	 * @param {string} sEntityType Entity type defined by the analytical content configuration.
	 * @returns {sap.apf.core.ReadRequestByRequiredFilter}
	 */
	sap.apf.core.ReadRequestByRequiredFilter = function(oInject, oRequest, sService, sEntityType) {
		var oCoreApi = oInject.instances.coreApi;
		var oMessageHandler = oInject.instances.messageHandler;

		/**
		 * @description Contains 'readRequestByRequiredFilter'
		 * @returns {string}
		 */
		this.type = "readRequestByRequiredFilter";
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.ReadRequestByRequiredFilter#send
		 * @description Executes an OData request.
		 * @param [{sap.apf.utils.Filter}] oFilter
		 * @param {function} fnCallback The first argument of the callback function is the received data (as Array). The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is {sap.apf.core.MessageObject}. 
		 * @param {Object} oRequestOptions An optional object containing additional query string options
		 * Format: { orderby : [{ property : <property_name>, order : <asc|desc>}], top : <integer>, skip : <integer> }  
		 * @returns undefined
		 */
		this.send = function(oFilter, fnCallback, oRequestOptions) {
			var oRequestFilter;
			var oProjectedContextFilter;

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


			oCoreApi.getMetadata(sService).done(function(oMetadata){




				//		Get parameter entity set key properties
				var aParameterEntitySetKeyProperties = oMetadata.getParameterEntitySetKeyProperties(sEntityType);

				//		Get required filters
				var sRequiredFilterProperty = "";
				var oEntityTypeMetadata = oMetadata.getEntityTypeAnnotations(sEntityType);
				if (oEntityTypeMetadata.requiresFilter !== undefined && oEntityTypeMetadata.requiresFilter === "true") {
					if (oEntityTypeMetadata.requiredProperties !== undefined) {
						sRequiredFilterProperty = oEntityTypeMetadata.requiredProperties;
					}
				}

				//		Join parameter entity set key properties & Required filters
				var aRequiredProperties = sRequiredFilterProperty.split(',');
				aParameterEntitySetKeyProperties.forEach(function(property) {
					aRequiredProperties.push(property.name);
				});

				//		Reduce the context filter to {parameter entity set key properties + Required filters}
				oCoreApi.getCumulativeFilter().done(function(oContextFilter) {

					oProjectedContextFilter = oContextFilter.restrictToProperties(aRequiredProperties);

					//		Intersect both filters.

					if (oFilter) {
						oRequestFilter = oFilter.getInternalFilter();
						oRequestFilter.addAnd(oProjectedContextFilter);
					} else {
						oRequestFilter = oProjectedContextFilter;
					}
					oRequest.sendGetInBatch(oRequestFilter, callbackForRequest, oRequestOptions);
				});
			});

		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.core.ReadRequestByRequiredFilter#getMetadataFacade
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