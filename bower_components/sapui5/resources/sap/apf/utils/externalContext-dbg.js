/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2015 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.utils.externalContext');
jQuery.sap.require('sap.apf.core.utils.filter');

/**
 * @private
 * @class External Context
 * @description Determines the context for APF. The context can be either retrieved from a SmartBusiness Evaluation or from a X-APP-STATE property named  
 * 				sapApfCumulativeFilter. 
 * @param {object} inject Object containing functions and instances to be used by External Context
 * @param {function} inject.functions.getConfigurationProperties {@link sap.apf.core.ResourcePathHandler#getConfigurationProperties}
 * @param {sap.apf.utils.StartParameter} inject.instance.startParameter StartParameter instance
 * @param {sap.apf.Component|sap.apf.base.Component} inject.instances.component This reference provides access to parameters and context of the calling Component.js
 * @param {sap.apf.core.MessageHandler} inject.instances.messageHandler Message handler instance
 * @name sap.apf.utils.ExternalContext
 * @returns {sap.apf.utils.ExternalContext}
 */
sap.apf.utils.ExternalContext = function(inject) {
	'use strict';
	var deferredContext = jQuery.Deferred();
	var smartBusinessEvaluationId = inject.instances.startParameter.getEvaluationId();
	var xAppStateId = inject.instances.startParameter.getXappStateId();
	var msgH = inject.instances.messageHandler;
	var externalContext = this;
	var ajax = inject.functions.ajax;
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.ExternalContext#getCombinedContext
	 * @description Returns a promise which is resolved with a filter instance {@link sap.apf.core.utils.Filter} representing the
	 * 			retrieved context from a SmartBusiness Evaluation or X-APP-State. If there is no context available, the promise is resolved with an 
	 * 			empty filter instance {@link sap.apf.core.utils.Filter}.
	 * @returns {jQuery.Deferred.promise}
	 */
	this.getCombinedContext = function() {
		if (xAppStateId) { //For the moment, only handling of either SmartBusiness or X-APP-STATE is required and therefore supported
			resolveContextFromXAppState();
		} else if (smartBusinessEvaluationId) {
			resolveContextFromBusinessEvaluationId();
		} else {
			deferredContext.resolve(new sap.apf.core.utils.Filter(msgH));
		}
		return deferredContext.promise();

		function normalizeFilter(filter) {
			if (filter.levelOperator === sap.apf.core.constants.BooleFilterOperators.OR) {
				return new sap.apf.core.utils.Filter(msgH, filter);
			}
			return filter;
		}
		function resolveContextFromXAppState() {
			sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(inject.instances.component, xAppStateId).done(function(appContainer) {
				var containerData = appContainer.getData();
				if (containerData && containerData.sapApfCumulativeFilter) {
					deferredContext.resolve(normalizeFilter(sap.apf.core.utils.Filter.transformUI5FilterToInternal(msgH, containerData.sapApfCumulativeFilter)));
				} else if (containerData && containerData.selectionVariant){
					deferredContext.resolve(normalizeFilter(externalContext.convertSelectionVariantToFilter(containerData.selectionVariant)));
				} else {
					deferredContext.resolve(new sap.apf.core.utils.Filter(msgH));
				}
			}).fail(function(){
				var msgObject = msgH.createMessageObject({ code : 5045, aParameters : [xAppStateId]});
				msgH.putMessage(msgObject);
			});
		}

		function resolveContextFromBusinessEvaluationId() {
			inject.functions.getConfigurationProperties().done(function(configurationProperties){

				var smartBusinessConfig = configurationProperties && configurationProperties.smartBusiness && configurationProperties.smartBusiness.runtime;
				if (smartBusinessConfig && smartBusinessConfig.service) {
					var requestUrl = smartBusinessConfig.service + "/EVALUATIONS('" + smartBusinessEvaluationId + "')/FILTERS?$format=json";
					ajax({
						url : requestUrl,
						success : function(data) {
							var property;
							var orFilter;
							var andFilter = new sap.apf.core.utils.Filter(msgH);
							var filtersForConjuction = [];
							var termsPerProperty = {};
							data.d.results.forEach(collectTermsPerProperty);
							for(property in termsPerProperty) {
								if (termsPerProperty.hasOwnProperty(property)) {
									orFilter = new sap.apf.core.utils.Filter(msgH);
									termsPerProperty[property].forEach(combineTermsPerProperty);
									filtersForConjuction.push(orFilter);
								}
							}
							filtersForConjuction.forEach(combineDifferentProperties);
							deferredContext.resolve(normalizeFilter(andFilter));

							function collectTermsPerProperty(sbFilter) {
								if (!termsPerProperty[sbFilter.NAME]) {
									termsPerProperty[sbFilter.NAME] = [];
								}
								termsPerProperty[sbFilter.NAME].push(new sap.apf.core.utils.Filter(msgH, sbFilter.NAME, sbFilter.OPERATOR, sbFilter.VALUE_1, sbFilter.VALUE_2));
							}
							function combineTermsPerProperty(filter) {
								orFilter.addOr(filter);
							}
							function combineDifferentProperties(filter) {
								andFilter.addAnd(filter);
							}
						},
						error : function(jqXHR, textStatus, errorThrown, messageObject) {
							var msgObject = msgH.createMessageObject({ code : 5043, aParameters : [smartBusinessEvaluationId, textStatus]});
							if (messageObject) {
								msgObject.setPrevious(messageObject);
							}
							msgH.putMessage(msgObject);
						}
					});

				}  else {
					var msgObject = msgH.createMessageObject({ code : 5044, aParameters : [smartBusinessEvaluationId]});
					msgH.putMessage(msgObject);
				}
			});
		}
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.ExternalContext#convertParameterObject
	 * @param {object} parameterObject - contains two properties PropertyName and PropertyValue
	 * @description Returns a filterTerm instance {@link sap.apf.core.utils.FilterTerm} representing an equality of the property with the value, returns null for invalid input
	 * @returns {sap.apf.core.utils.FilterTerm}
	 */
	this.convertParameterObject = function(parameterObject){
		var msgObject;
		if (!parameterObject.PropertyName || parameterObject.PropertyValue === undefined || parameterObject.PropertyValue === null){

			if (!parameterObject.PropertyName) {
				msgObject = msgH.createMessageObject({ code : 5046, aParameters : [xAppStateId]});
			} else  {
				msgObject = msgH.createMessageObject({ code : 5047, aParameters : [xAppStateId, parameterObject.PropertyName]});
			} 
			msgH.putMessage(msgObject);
		}
		return new sap.apf.core.utils.FilterTerm(msgH, parameterObject.PropertyName, sap.apf.core.constants.FilterOperators.EQ, parameterObject.PropertyValue);
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.ExternalContext#convertSelecOption
	 * @param {object} selectOption - this is an object with a PropertyName and an array of Ranges
	 * @description Returns a filter instance {@link sap.apf.core.utils.Filter} representing the selectOption, returns null for invalid input
	 * @returns {sap.apf.core.utils.Filter | null}
	 */
	this.convertSelectOption = function(selectOption){
		var externalContext = this;
		var filter = null;
		var i;
		var msgObject;
		if (!selectOption.PropertyName || !selectOption.Ranges || !(jQuery.isArray(selectOption.Ranges))){

			if (!selectOption.PropertyName) {
				msgObject = msgH.createMessageObject({ code : 5048, aParameters : [xAppStateId]});
			} else {
				msgObject = msgH.createMessageObject({ code : 5049, aParameters : [xAppStateId, selectOption.PropertyName]});
			}
			msgH.putMessage(msgObject);
		}
		filter = new sap.apf.core.utils.Filter(msgH);
		for (i = 0; i < selectOption.Ranges.length; i++) {
			var converted = externalContext.convertRange(selectOption.Ranges[i], selectOption.PropertyName);
			filter.addOr(converted);
		}
		return filter;
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.ExternalContext#convertRange
	 * @param {object} rangeObject - contains a range with Sign, Option, Low and High
	 * @param {string} propertyName - the name of the property connected to the range
	 * @description Returns a filterTerm instance {@link sap.apf.core.utils.FilterTerm} representing the Range, returns null for invalid input
	 * @description Any other sign than 'I' is handled as invalid
	 * @returns {sap.apf.core.utils.FilterTerm | null}
	 */
	this.convertRange = function(rangeObject, propertyName){
		var msgObject, low, option, split;
		if ( rangeObject.Sign != 'I'){
			msgObject = msgH.createMessageObject({ code : 5050, aParameters : [xAppStateId, propertyName]});
			msgH.putMessage(msgObject);
		}
		if ( rangeObject.Option === 'BT' && (rangeObject.High === undefined || rangeObject.High === null)){
			msgObject = msgH.createMessageObject({ code : 5051, aParameters : [xAppStateId, propertyName]});
			msgH.putMessage(msgObject);
		}
		if ( rangeObject.Option === 'CP'){
			split = rangeObject.Low.split("\*");
			if (split.length > 3 || (split.length === 3 && (split[0].length !== 0 || split[2].length !== 0)) || split.length === 1) {
				msgObject = msgH.createMessageObject({ code : 5069, aParameters : [xAppStateId, propertyName]});
				msgH.putMessage(msgObject);
			}
			if( rangeObject.Low.indexOf("*") === 0 && rangeObject.Low.lastIndexOf("*") === rangeObject.Low.length-1){
				low = rangeObject.Low.substr(1, rangeObject.Low.lastIndexOf("*") - 1);
				option = 'Contains';
			} else if( rangeObject.Low.indexOf("*") === 0) {
				low = rangeObject.Low.substr(1, rangeObject.Low.length - 1);
				option = 'EndsWith';
			} else if (rangeObject.Low.lastIndexOf("*") === rangeObject.Low.length-1){
				low = rangeObject.Low.substring(0, rangeObject.Low.indexOf("*"));
				option = 'StartsWith';
			}
			return new sap.apf.core.utils.FilterTerm(msgH, propertyName, option, low, rangeObject.High);
		}
		return new sap.apf.core.utils.FilterTerm(msgH, propertyName, rangeObject.Option, rangeObject.Low, rangeObject.High);
	};

	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.ExternalContext#convertSelectionVariantToFilter
	 * @param {object} selectionVariant - this is an object with two arrays "Parameters" and "SelectOptions"
	 * @description Returns a filter instance {@link sap.apf.core.utils.Filter} representing the selectionVariant, returns an empty filter if any invalid input is given
	 * @returns {sap.apf.core.utils.Filter}
	 */
	this.convertSelectionVariantToFilter = function (selectionVariant){
		var externalContext = this;
		var filter = new sap.apf.core.utils.Filter(msgH);
		var i;
		if (!selectionVariant){
			return filter;
		}
		if (selectionVariant.Parameters && !(jQuery.isArray(selectionVariant.Parameters))){
			return filter;
		}
		if (selectionVariant.SelectOptions && !(jQuery.isArray(selectionVariant.SelectOptions))){
			return filter;
		}
		if (selectionVariant.Parameters){
			for (i = 0; i < selectionVariant.Parameters.length; i++) {
				var convertedParameter = externalContext.convertParameterObject(selectionVariant.Parameters[i]);
				filter.addAnd(convertedParameter);
			}
		}
		if(selectionVariant.SelectOptions){
			for (i = 0; i < selectionVariant.SelectOptions.length; i++) {
				var convertedSelectOptions = externalContext.convertSelectOption(selectionVariant.SelectOptions[i]);
				filter.addAnd(convertedSelectOptions);
			}
		}
		return filter;
	};
};