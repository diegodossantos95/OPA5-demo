/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap, jQuery, OData */
jQuery.sap.declare('sap.apf.core.request');
jQuery.sap.require('sap.apf.utils.utils');
jQuery.sap.require('sap.apf.core.utils.filter');
jQuery.sap.require('sap.apf.core.utils.filterTerm');
jQuery.sap.require("sap.apf.core.utils.filterSimplify");
(function() {
	'use strict';
	/**
	 * @class The Request object represents an OData GET request. It receives a
	 *        filter which is then mapped to a URI query and appended to the request
	 *        URI. Its role is to send an asynchronous OData request to the server,
	 *        receive the response, parse it and provision it as an array of
	 *        objects. The request will use a callback mechanism handling the
	 *        asynchronous request behavior. The callback routes control back to the
	 *        Path object.
	 * @param {Object} oInject - references to other handlers
	 * @param oConfig - Configuration Object for a Request.
	 */
	sap.apf.core.Request = function(oInject, oConfig) {
		var oMessageHandler = oInject.instances.messageHandler;
		var oCoreApi = oInject.instances.coreApi;
		var sServiceRootPath = oConfig.service;
		var selectProperties = oConfig.selectProperties;
		var oUriGenerator = oCoreApi.getUriGenerator();
		var oMessageObject;
		if (sServiceRootPath === undefined) {
			oMessageObject = oMessageHandler.createMessageObject({
				code : '5015',
				aParameters : [ oConfig.id ]
			});
			oMessageHandler.putMessage(oMessageObject);
		}
		var metadataPromise = oCoreApi.getMetadata(sServiceRootPath);
		this.type = oConfig.type;
		/**
		 * @description A request object that can send (many) asynchronous OData GET requests to the server. It uses a POST $batch operation wrapping the GET.
		 * @param {Object} oFilter - An sap.apf.core.utils filter object.
		 * @param {Function} fnCallback - A function called after the response was successfully received and parsed.
		 * @param {Object} oRequestOptions - An optional object containing additional query string options
		 * @param {Object} oSelectionValidationRequest Object that triggers a second query in the request
		 * @param {String []} oSelectionValidationRequest.requiredFilterProperties Properties that are selectable in the current step
		 * @param {sap.apf.core.utils.Filter} oSelectionValidationRequest.selectionFilter Filter that represents the current selection in the step
		 * Format: { orderby : [{ property : <property_name>, order : <asc|desc>}], top : <integer>, skip : <integer> }
		 */
		this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions, oSelectionValidationRequest) {
			metadataPromise.done(function(oMetadata){
				oCoreApi.getXsrfToken(sServiceRootPath).done(function(xsrfToken){
					var oUriComponents = oMetadata.getUriComponents(oConfig.entityType);
					var sEntitySet, snavigationProperty;
					if (oUriComponents) {
						sEntitySet = oUriComponents.entitySet;
						snavigationProperty = oUriComponents.navigationProperty;
					}
					oMessageHandler.check(sEntitySet !== undefined, 'Invalid request configuration: An entityset does not exist under the service ' + oConfig.entityType);
					oMessageHandler.check(snavigationProperty !== undefined, 'Invalid request configuration: A usable navigation does not exist for the service ' + oConfig.entityType);

					var oFilterApplicableForRequest;
					var filterSimplify;
					checkFilterForRequiredProperties(oFilter);
					if (oFilter && oFilter.getProperties) {
						oFilterApplicableForRequest = oFilter.restrictToProperties(oMetadata.getFilterableProperties(sEntitySet));

						if (oCoreApi.getStartParameterFacade().isFilterReductionActive()) {
							filterSimplify = new sap.apf.core.utils.FilterReduction();
							oFilterApplicableForRequest = filterSimplify.filterReduction(oMessageHandler, oFilterApplicableForRequest);
						}
					}
					checkRequestOptionsConsistency(oRequestOptions);
					var oPaging = oRequestOptions && oRequestOptions.paging;
					var oSortingFields = oRequestOptions && oRequestOptions.orderby;
					var dataRequestUri = oUriGenerator.buildUri(oMessageHandler, sEntitySet, selectProperties, oFilterApplicableForRequest, oFilter, oSortingFields, oPaging, undefined, formatValue, snavigationProperty, oMetadata);

					var batchRequests = [ {
						requestUri : dataRequestUri,
						method : 'GET',
						headers : {
							'Accept-Language' : sap.ui.getCore().getConfiguration().getLanguage(),
							'x-csrf-token' : xsrfToken
						}
					} ];
					addSelectionValidationRequest();
					var requestUri = oUriGenerator.getAbsolutePath(sServiceRootPath);
					
					requestUri = requestUri + '$batch';
	
					var oRequest = {
							method : 'POST',
							headers : {
								'x-csrf-token' : xsrfToken
							},
							requestUri : requestUri,
							serviceMetadata: oMetadata.getODataModel().getServiceMetadata(),
							data : {
								__batchRequests : batchRequests
							}
					};
					var fnSuccess = function(data, response) {

						var oResponse = {};
						oCoreApi.getEntityTypeMetadata(oConfig.service, oConfig.entityType).done(function(entityTypeMetadata){
							var messageText;
							try {


								var sUrl = '';
								if (data && data.__batchResponses && data.__batchResponses[0].data) {
									oResponse.data = data.__batchResponses[0].data.results;
									oResponse.metadata = entityTypeMetadata;
									if (data.__batchResponses[0].data.__count) {
										oResponse.count = parseInt(data.__batchResponses[0].data.__count, 10);
									}

									if(data.__batchResponses[1] && data.__batchResponses[1].data){
										oResponse.selectionValidation = data.__batchResponses[1].data.results;
									}
									fnCallback(oResponse, false);
								} else if (data && data.__batchResponses[0] && data.__batchResponses[0].response && data.__batchResponses[0].message) {
									sUrl = response.requestUri;
									var sMessage = data.__batchResponses[0].message;
									var sErrorDetails = data.__batchResponses[0].response.body;
									messageText = sap.apf.utils.extractOdataErrorResponse(sErrorDetails);
									var sHttpStatusCode = data.__batchResponses[0].response.statusCode;
									oResponse = oMessageHandler.createMessageObject({
										code : '5001',
										aParameters : [ sHttpStatusCode, sMessage, messageText, sUrl ]
									});
									oMessageHandler.putMessage(oResponse);
								} else {
									sUrl = response.requestUri || dataRequestUri;
									oResponse = oMessageHandler.createMessageObject({
										code : '5001',
										aParameters : [ 'unknown', 'unknown error', 'unknown error', sUrl ]
									});
									oMessageHandler.putMessage(oResponse);
								}
							} catch(error) {

								if (!oMessageHandler.isOwnException(error)) {
									messageText = error && error.message || "";

									oMessageHandler.putMessage(oMessageHandler.createMessageObject({
										code : "5042",
										aParameters : [ messageText ]
									}));
								}			
							}
						});
					};
					var fnError = function(error) {
						var sMessage = 'unknown error';
						var messageObject;
						var sErrorDetails = 'unknown error';
						var sUrl = dataRequestUri;
						if (error.message !== undefined) {
							sMessage = error.message;
						}
						var sHttpStatusCode = 'unknown';
						if (error.response && error.response.statusCode) {
							sHttpStatusCode = error.response.statusCode;
							sErrorDetails = error.response.statusText || '';
							sUrl = error.response.requestUri || dataRequestUri;
						}
						if (error.messageObject && error.messageObject.type === 'messageObject') {
							oMessageHandler.putMessage(error.messageObject);
							fnCallback(error.messageObject);
						} else {
							messageObject = oMessageHandler.createMessageObject({
								code : '5001',
								aParameters : [ sHttpStatusCode, sMessage, sErrorDetails, sUrl ]
							}); 
							oMessageHandler.putMessage(messageObject);
							fnCallback(messageObject);
						}
					};
					oCoreApi.odataRequest(oRequest, fnSuccess, fnError, OData.batchHandler);

					function addSelectionValidationRequest(){
						if(oSelectionValidationRequest && oSelectionValidationRequest.requiredFilterProperties && oSelectionValidationRequest.selectionFilter){
							var filterForRequest = oFilterApplicableForRequest.copy();
							filterForRequest.addAnd(oSelectionValidationRequest.selectionFilter);

							if (oCoreApi.getStartParameterFacade().isFilterReductionActive()) {
								filterForRequest = filterSimplify.filterReduction(oMessageHandler, filterForRequest);
							}

							var selectionValidationRequestUri = oUriGenerator.buildUri(oMessageHandler, sEntitySet, oSelectionValidationRequest.requiredFilterProperties, filterForRequest, oFilter, undefined, undefined, undefined, formatValue, snavigationProperty, oMetadata);
							batchRequests.push({
								requestUri : selectionValidationRequestUri,
								method : 'GET',
								headers : {
									'Accept-Language' : sap.ui.getCore().getConfiguration().getLanguage(),
									'x-csrf-token' : xsrfToken
								}
							});
						}
					}
					function formatValue(sProperty, value) {
						var strDelimiter = "'";
						var oEntityMetadata = oMetadata.getPropertyMetadata(sEntitySet, sProperty);
						if (oEntityMetadata && oEntityMetadata.dataType) {
							return sap.apf.utils.formatValue(value, oEntityMetadata.dataType.type);
						}
						if (typeof value === 'number') {
							return value;
						}
						return strDelimiter + sap.apf.utils.escapeOdata(value) + strDelimiter;
					}
					function checkRequestOptionsConsistency(oRequestOptions) {
						var aPropertyNames, i;
						if (!oRequestOptions) {
							return;
						}
						aPropertyNames = Object.getOwnPropertyNames(oRequestOptions);
						for(i = 0; i < aPropertyNames.length; i++) {
							if (aPropertyNames[i] !== 'orderby' && aPropertyNames[i] !== 'paging') {
								oMessageHandler.putMessage(oMessageHandler.createMessageObject({
									code : '5032',
									aParameters : [ sEntitySet, aPropertyNames[i] ]
								}));
							}
						}
					}
					function checkFilterForRequiredProperties(oFilter) {
						var aFilterableProperties = oMetadata.getFilterableProperties(sEntitySet);
						var sRequiredFilterProperty = '';
						var oEntityTypeMetadata = oMetadata.getEntityTypeAnnotations(sEntitySet);
						var oMessageObject2;
						if (oEntityTypeMetadata.requiresFilter !== undefined && oEntityTypeMetadata.requiresFilter === 'true') {
							if (oEntityTypeMetadata.requiredProperties !== undefined) {
								sRequiredFilterProperty = oEntityTypeMetadata.requiredProperties;
							}
						}
						if (sRequiredFilterProperty === '') {
							return;
						}
						if (jQuery.inArray(sRequiredFilterProperty, aFilterableProperties) === -1) {
							oMessageObject2 = oMessageHandler.createMessageObject({
								code : '5006',
								aParameters : [ sEntitySet, sRequiredFilterProperty ]
							});
							oMessageHandler.putMessage(oMessageObject2);
						}
						var aPropertiesInFilter = oFilter.getProperties();
						// test, whether all required properties are in filter
						if (jQuery.inArray(sRequiredFilterProperty, aPropertiesInFilter) === -1) {
							oMessageObject2 = oMessageHandler.createMessageObject({
								code : '5005',
								aParameters : [ sEntitySet, sRequiredFilterProperty ]
							});
							oMessageHandler.putMessage(oMessageObject2);
						}
					}
				});
			});
		};
	};
}());
