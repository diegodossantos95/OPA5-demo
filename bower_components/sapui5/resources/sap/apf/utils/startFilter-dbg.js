/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.utils.startFilter');
/**
 * @private
 * @class Start Filter
 * @description Provides all information and methods to display a property filter based on a given configuration. 
 * @param {object} inject Object containing functions and instances to be used by Start Filter
 * @param {sap.apf.core.MessageHandler} inject.instances.messageHandler Message handler instance
 * @param {function} inject.functions.createRequest {@link sap.apf.core.ConfigurationFactory#createRequest}
 * @param {sap.apf.utils.StartFilter} inject.constructors.StartFilter Start Filter constructor
 * @param {object} config Object containing configuration properties
 * @param {[string]|sap.apf.core.utils.Filter} [context] The context determines the selected values, which can be provided as Array of Strings or as {sap.apf.core.utils.Filter} instance. 
 * @name sap.apf.utils.StartFilter
 * @returns {sap.apf.utils.StartFilter}
 */
sap.apf.utils.StartFilter = function(inject, config, context) {
	'use strict';
	var initiallySelectedValues;
	var externallySetSelectedValues;
	var restriction = new sap.apf.core.utils.Filter(inject.instances.messageHandler);

	var deferredValues;
	var deferredSelected;
	var concurrentDetermineValuesCount = 0;
	var concurrentDetermineSelectedCount = 0;
	var contextNotInValueHelp = jQuery.extend(true, [], context);
	var preselectionNotInValueHelp;
	if (config.preselectionDefaults && config.preselectionDefaults.length > 0) {
		preselectionNotInValueHelp = jQuery.extend(true, [], config.preselectionDefaults);
	} else if (jQuery.isFunction(config.preselectionFunction)){
		preselectionNotInValueHelp = jQuery.extend(true, [], config.preselectionFunction());
	}
	var valueHelpConfigured = false;
	if(config.valueHelpRequest || (jQuery.isArray(config.valueList) && config.valueList.length > 0)){
		valueHelpConfigured = true;
	}
	var contextInitiallyPrependedToValueHelp = false;
	var filterResolutionBuffer = {};
	var valueHelpBuffer = {};
	var prependedValueHelpList;

	prependListValuesIfNotContainedInResponse = prependListValuesIfNotContainedInResponse.bind(this);
	convertRequestResponseToArrayList = convertRequestResponseToArrayList.bind(this);
	createAvailableValuesHashMap = createAvailableValuesHashMap.bind(this);
	sendFilterResolutionRequest = sendFilterResolutionRequest.bind(this);
	determineSelected = determineSelected.bind(this);
	determineValues = determineValues.bind(this);

	/**
	 * @private
	 * @function 
	 * @name sap.apf.utils.StartFilter#hasValueHelpRequest
	 * @returns {boolean} if the facet filter has a value help request defined
	 */
	this.hasValueHelpRequest = function () {
		return !!config.valueHelpRequest;
	};
	/**
	 * @private
	 * @function 
	 * @name sap.apf.utils.StartFilter#setContext
	 * @param {sap.apf.core.utils.Filter} internalFilter
	 * @description Updates the Startfilter instance with a new context. This method was written to solve the update for an unconfigured Startfilter set by sap.apf.api.updatePathFilter.
	 */
	this.setContext = function(internalFilter) {
		if(config.notConfigured === true){
			context = internalFilter;
		} else {
			inject.instances.messageHandler.putMessage(
				inject.instances.messageHandler.createMessageObject({
					code: '5100',
					aParameters: ['Context of configured Startfilter cannot be changed']
				})
			);
		}
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#getPropertyName
	 * @description Returns the name of the filter property from configuration
	 * @returns {string} Property name 
	 */
	this.getPropertyName = function() {
		return config.property;
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#getLabel
	 * @description Returns the text label object from configuration
	 * @returns {object} Text label object
	 */
	this.getLabel = function() {
		return config.label;
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#getAliasNameIfExistsElsePropertyName
	 * @description Returns the configured alias name from configuration. If alias does not exist, property name is returned. 
	 * @returns {string} Alias name or property name
	 */
	this.getAliasNameIfExistsElsePropertyName = function() {
		return config.alias || config.property;
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#isMultiSelection
	 * @description Returns boolean if Start Filter is configured for multi selection. 
	 * @returns {boolean} True if multi selection is configured, else false. 
	 */
	this.isMultiSelection = function() {
		if (config.multiSelection === 'true' || config.multiSelection === true) {
			return true;
		}
		return false;
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#isVisible
	 * @description Returns boolean if Start Filter is visible. 
	 * @returns {boolean} True if Start Filter is visible, else false. 
	 */
	this.isVisible = function() {
		if (context && context.type === 'internalFilter' && !config.filterResolutionRequest) {
			return false;
		}
		return !config.invisible;
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#setRestriction
	 * @description Restricts the value help request and filter resolution request with the given filter.  
	 * @param {sap.apf.core.utils.Filter} filter Filter instance
	 */
	this.setRestriction = function(filter) {
		restriction = filter.copy();
		if(!deferredSelected) {
			deferredSelected = jQuery.Deferred();
		}
		determineSelectedAndResolve(++concurrentDetermineSelectedCount);
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#setSelectedValues
	 * @description Changes the selection to the provided selected values as array of strings or internal filter object. 
	 * @param {[string]|sap.apf.core.utils.Filter} Array of selected values as strings or instance of {@link sap.apf.core.utils.Filter}
	 * @param {boolean} Should be true if values are set initially by the component via api
	 */
	this.setSelectedValues = function(values, isSetInitially) {
		if(!deferredSelected) {
			deferredSelected = jQuery.Deferred();
		}
		if (!initiallySelectedValues) {
			initiallySelectedValues = jQuery.Deferred();
			if(!isSetInitially){
				determineSelected().done(function(selectedValues) {
					//Next condition ensures that deserialize() was NOT called during a pending promise
					//This prevents that initiallySelectedValues promise is resolved by out dated done functions/callback 
					if(initiallySelectedValues){
						initiallySelectedValues.resolve(selectedValues);
					}
				});
			} else {
				initiallySelectedValues.resolve(values);
			}
		}
		if (values.type === 'internalFilter') {
			externallySetSelectedValues = values;
		} else {
			externallySetSelectedValues = jQuery.extend(true, [], values);
		}
		if(!isSetInitially){
			determineSelectedAndResolve(++concurrentDetermineSelectedCount);
		}
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#getSelectedValues
	 * @description Returns selected values depending on the context, filter resolution request, multi selection configuration and externally set 
	 * selected values via {@link sap.apf.utils.StartFilter#setSelectedValues}. 
	 * @returns {jQuery.Deferred.promise} Returns promise which will be resolved with list of selected values as array
	 */
	this.getSelectedValues = function() {
		var promiseToBeReturned;
		if(!deferredSelected) {
			deferredSelected = jQuery.Deferred();
			promiseToBeReturned = deferredSelected;
			determineSelectedAndResolve(++concurrentDetermineSelectedCount);
		} else if(deferredSelected.state() === 'pending') {
			promiseToBeReturned = deferredSelected;
			if(initiallySelectedValues){
				initiallySelectedValues.done(function(){
					determineSelectedAndResolve(++concurrentDetermineSelectedCount);
				});
			} else {
				determineSelectedAndResolve(++concurrentDetermineSelectedCount);
			}
		}
		return promiseToBeReturned.promise();
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#getValues
	 * @description Returns list values as array of objects depending on configuration (value help request, filter resolution request, preselection defaults), 
	 * context and restriction. If the list values are originated from an OData request, all properties contained in the request response are part of the list values. 
	 * @returns {jQuery.Deferred.promise} Returns promise which will be resolved with list values in the following format: [{FilterProperty:'12345', FilterPropertyNameName:'Name of 12345'}, {FilterProperty:'67890', FilterPropertyNameName:'Name of 12345'}]
	 */
	this.getValues = function() {
		var promiseToBeReturned;
		if(!deferredValues || deferredValues.state() !== 'pending') {
			deferredValues = jQuery.Deferred();
		}
		promiseToBeReturned = deferredValues;
		determineValuesAndResolve(++concurrentDetermineValuesCount);
		return promiseToBeReturned.promise();
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#getMetadata
	 * @description Returns metadata for the configured alias or property. 
	 * @returns {object} Metadata object {@link sap.apf.core.EntityTypeMetadata#getPropertyMetadata()} 
	 */
	this.getMetadata = function() {
		if (config.valueHelpRequest) {
			return sendValueHelpRequest().then(function(response) {
				return response.metadata.getPropertyMetadata(this.getAliasNameIfExistsElsePropertyName());
			}.bind(this));
		} else if (config.filterResolutionRequest) {
			return sendFilterResolutionRequest().then(function(response) {
				return response.metadata.getPropertyMetadata(this.getAliasNameIfExistsElsePropertyName());
			}.bind(this));
		}
		return jQuery.Deferred().resolve({});
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#serialize
	 * @description Serializes the content of the Start Filter.
	 * @param {boolean} isNavigation Indicator for serializing a start filter for navigation purpose
	 * @returns {object} Serialized data as deep JS object
	 */
	this.serialize = function(isNavigation, keepInitialStartFilterValues) {
		var deferredSerialization = jQuery.Deferred();
		var serializedStartFilter = {
			propertyName : this.getPropertyName()
		};
		determineSelected().done(function(values) {
			if (values && values.type === 'internalFilter') {
				values = values.mapToSapUI5FilterExpression();
			}
			serializedStartFilter.selectedValues = values;
			if(initiallySelectedValues) {
				initiallySelectedValues.done(function(values) {
					if(isNavigation === true) {
						serializedStartFilter.initiallySelectedValues = values;
					}
					//Case for keeping the initial values if a serialization is triggered for saving the 'last good APF state' 
					if(keepInitialStartFilterValues !== true) {
						initiallySelectedValues = null;
					}
					deferredSerialization.resolve(serializedStartFilter);
				});
			} else {
				deferredSerialization.resolve(serializedStartFilter);
			}
		});
		return deferredSerialization;
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#deserialize
	 * @description Re-initializes Start Filter based on given serialized data object. 
	 * @param {object} serializedStartFilter Serialized data used to re-initialize Start Filter
	 */
	this.deserialize = function(serializedStartFilter) {
		if (serializedStartFilter.selectedValues && (serializedStartFilter.selectedValues.aFilters || serializedStartFilter.selectedValues.sPath)) {
			serializedStartFilter.selectedValues = sap.apf.core.utils.Filter.transformUI5FilterToInternal(inject.instances.messageHandler, serializedStartFilter.selectedValues);
		}
		externallySetSelectedValues = null;
		if(serializedStartFilter.initiallySelectedValues) {
			initiallySelectedValues = jQuery.Deferred().resolve(serializedStartFilter.initiallySelectedValues);
		} else {
			initiallySelectedValues = null;
		}
		
		if(jQuery.isArray(serializedStartFilter.selectedValues)){
			contextNotInValueHelp = jQuery.extend(true, [], serializedStartFilter.selectedValues);
			context = jQuery.extend(true, [], serializedStartFilter.selectedValues);
		} else {
			contextNotInValueHelp = serializedStartFilter.selectedValues;
			context = serializedStartFilter.selectedValues;
		}
		contextInitiallyPrependedToValueHelp = false;
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilter#reset
	 * @description Resets the externally set selected values back to the initially derived selected values 
	 */
	this.reset = function() {
		if (initiallySelectedValues) {
			initiallySelectedValues.done(function(values){
				externallySetSelectedValues = values;
			});
		}
	};
	function determineValuesAndResolve(currentDeterminationNumber) {
		determineValues(currentDeterminationNumber, concurrentDetermineValuesCount).done(function(values) {
			if(currentDeterminationNumber === concurrentDetermineValuesCount){
				deferredValues.resolve(values);
			}
		});
	}
	function determineSelectedAndResolve(currentDeterminationNumber) {
		determineSelected(currentDeterminationNumber).done(function(values) {
			if(currentDeterminationNumber === concurrentDetermineSelectedCount){
				var promiseToBeResolved = deferredSelected; 
				deferredSelected = jQuery.Deferred();
				promiseToBeResolved.resolve(values, deferredSelected.promise());
			}
		});
	}
	function determineValues(currentCount, concurrenCount) {
		var deferredDetermination = jQuery.Deferred();
		var valueHelpList = [];
		prependFilterResolutionResponseIfNotContained = prependFilterResolutionResponseIfNotContained.bind(this);
		if (valueHelpConfigured && jQuery.isArray(context)) {
			getValueHelp(currentCount, concurrenCount).then(function(response) {
				var valueHelpList = response.data;
				var prependedValueHelpList = prependListValuesIfNotContainedInResponse(contextNotInValueHelp, valueHelpList);
				deferredDetermination.resolve(prependedValueHelpList);
			});
		} else if (context && context.type === 'internalFilter' && valueHelpConfigured && config.filterResolutionRequest) {
			jQuery.when(getValueHelp(currentCount, concurrenCount), sendFilterResolutionRequest(currentCount, concurrenCount)).then(function(responseValueHelp, responseFilterResolution) {
				var valueHelpList = responseValueHelp.data;
				prependFilterResolutionResponseIfNotContained(responseFilterResolution.data, valueHelpList);
				deferredDetermination.resolve(valueHelpList);
			});
		} else if (valueHelpConfigured  && ((config.preselectionDefaults && config.preselectionDefaults.length > 0) || jQuery.isFunction(config.preselectionFunction))) {
			getValueHelp(currentCount, concurrenCount).then(function(response) {
				var valueHelpList = response.data;
				prependedValueHelpList = prependListValuesIfNotContainedInResponse(preselectionNotInValueHelp, valueHelpList);
				deferredDetermination.resolve(prependedValueHelpList);
			});
		} else if (valueHelpConfigured) {
			getValueHelp(currentCount, concurrenCount).then(function(response) {
				deferredDetermination.resolve(response.data);
			});
		} else if (context && context.type === 'internalFilter' && config.filterResolutionRequest) {
			sendFilterResolutionRequest(currentCount, concurrenCount).then(function(response) {
				deferredDetermination.resolve(response.data);
			});
		} else if (jQuery.isArray(context) && config.filterResolutionRequest && !valueHelpConfigured) {
			sendFilterResolutionRequest(currentCount, concurrenCount).then(function(response) {
				deferredDetermination.resolve(response.data);
			});
		} else if (jQuery.isArray(context)) {
			valueHelpList = prependListValuesIfNotContainedInResponse(contextNotInValueHelp, valueHelpList);
			deferredDetermination.resolve(valueHelpList);
		} else if (((config.preselectionDefaults && config.preselectionDefaults.length > 0) || jQuery.isFunction(config.preselectionFunction)) && !valueHelpConfigured && !config.filterResolutionRequest && !context) {
			if (this.isMultiSelection()) {
				prependedValueHelpList = prependListValuesIfNotContainedInResponse(preselectionNotInValueHelp, valueHelpList);
			} else if(preselectionNotInValueHelp.length > 0 ){
				prependedValueHelpList = prependListValuesIfNotContainedInResponse([ preselectionNotInValueHelp[0] ], valueHelpList);
			}
			deferredDetermination.resolve(prependedValueHelpList);
		} else if (((config.preselectionDefaults && config.preselectionDefaults.length > 0) || jQuery.isFunction(config.preselectionFunction)) && config.filterResolutionRequest && !context) {
			if (this.isMultiSelection()) {
				prependedValueHelpList = prependListValuesIfNotContainedInResponse(preselectionNotInValueHelp, valueHelpList);
			} else if(preselectionNotInValueHelp.length > 0 ){
				prependedValueHelpList = prependListValuesIfNotContainedInResponse([ preselectionNotInValueHelp[0] ], valueHelpList);
			}
			deferredDetermination.resolve(prependedValueHelpList);
		} else if (context && context.type === 'internalFilter' || !context) {
			deferredDetermination.resolve(null);
		}
		return deferredDetermination.promise();
		function prependFilterResolutionResponseIfNotContained(responseFilterResolution, responseValueHelp) {
			var valuesInValueHelp = createAvailableValuesHashMap(responseValueHelp);
			for(var i = responseFilterResolution.length - 1; i >= 0; i--) {
				if (!valuesInValueHelp[responseFilterResolution[i][this.getAliasNameIfExistsElsePropertyName()]]) {
					responseValueHelp.unshift(responseFilterResolution[i]);
				}
			}
		}
	}
	function prependListValuesIfNotContainedInResponse(list, response) {
		var valueList = jQuery.extend(true, [], response);
		var valuesInresponse = createAvailableValuesHashMap(response);
		var element;
		for(var i = list.length - 1; i >= 0; i--) {
			if (!valuesInresponse[list[i]]) {
				element = {};
				element[this.getAliasNameIfExistsElsePropertyName()] = list[i];
				valueList.unshift(element);
			} else if(!contextInitiallyPrependedToValueHelp){
				list.splice(i, 1);
			}
		}
		contextInitiallyPrependedToValueHelp = true;
		return valueList;
	}
	function determineSelected(currentCount) {
		var deferredDetermination = jQuery.Deferred();
		var selectedValues;
		var preselectionValues;
		var availableValues;
		var startFilter = this;
		if (externallySetSelectedValues) {
			if (!config.invisible) {
				checkAgainstValueHelpAndResolve(jQuery.extend(true, [], externallySetSelectedValues), currentCount);
			} else {
				selectedValues = externallySetSelectedValues;
				resolvePromise();
			}
		} else if (jQuery.isFunction(config.preselectionFunction) && !valueHelpConfigured) {
			selectedValues = config.preselectionFunction();
			resolvePromise();
		} else if (context && context.type === 'internalFilter' && !config.filterResolutionRequest) {
			deferredDetermination.resolve(context);
		} else if (config.preselectionDefaults === null && !context) {
			deferredDetermination.resolve([]);
		} else if (config.filterResolutionRequest && !context && !valueHelpConfigured && !(config.preselectionDefaults && config.preselectionDefaults.length > 0)) {
			deferredDetermination.resolve(null);
		} else if (context && context.type === 'internalFilter' && config.filterResolutionRequest) {
			sendFilterResolutionRequest(currentCount, concurrentDetermineSelectedCount).then(function(response) {
				var filterResolutionList = convertRequestResponseToArrayList(response);
				checkAgainstValueHelpAndResolve(jQuery.extend(true, [], filterResolutionList), currentCount);
			});
		} else if (valueHelpConfigured && !jQuery.isArray(context) && !(config.preselectionDefaults && config.preselectionDefaults.length > 0) && !config.preselectionFunction) {
			getValueHelp(currentCount, concurrentDetermineSelectedCount).then(function(response) {
				var responseList = convertRequestResponseToArrayList(response);
				if (this.isMultiSelection()) {
					selectedValues = responseList;
				} else {
					selectedValues = [ responseList[0] ];
				}
				resolvePromise();
			}.bind(this));
		} else if (valueHelpConfigured  && !jQuery.isArray(context) && ((config.preselectionDefaults && config.preselectionDefaults.length > 0) || config.preselectionFunction)) {
			if (jQuery.isFunction(config.preselectionFunction)) {
				preselectionValues = config.preselectionFunction();
			} else {
				preselectionValues = config.preselectionDefaults;
			}
			checkAgainstValueHelpAndResolve(jQuery.extend(true, [], preselectionValues), currentCount);
		} else if (jQuery.isArray(context)) {
			checkAgainstValueHelpAndResolve(context, currentCount);
		} else if (config.preselectionDefaults && config.preselectionDefaults.length > 0) {
			selectedValues = config.preselectionDefaults;
			checkAgainstValueHelpAndResolve(selectedValues, currentCount);
		} else {
			deferredDetermination.resolve(null);
		}
		return deferredDetermination.promise();

		function resolvePromise() {
			if (selectedValues && selectedValues.type === 'internalFilter') {
				deferredDetermination.resolve(selectedValues);
			} else {
				deferredDetermination.resolve(jQuery.extend(true, [], selectedValues));
			}
		}
		function checkAgainstValueHelpAndResolve(selectedValuesCandidates, currentCount){
			determineValues(currentCount, concurrentDetermineSelectedCount).done(function(values) {
				if (values !== null) {
					selectedValues = [];
					availableValues = createAvailableValuesHashMap(values);
					selectedValuesCandidates.forEach(function(value) {
						if (availableValues[value]) {
							selectedValues.push(value);
						}
					});
					if(selectedValuesCandidates.length !== 0 && selectedValues.length === 0 && config.preselectionDefaults !== null){
						selectedValues = convertRequestResponseToArrayList({data: values});
					}
					if (!startFilter.isMultiSelection()) {
						selectedValues = [ selectedValues[0] ];
					}
					//Indicator that deserialize() was called - prevents that externallySetSelectedValues are updated by outdated done functions/callbacks. 
					if(externallySetSelectedValues !== null){
						externallySetSelectedValues = selectedValues;
					}
				} else {
					selectedValues = null;
				}
				resolvePromise();
			});
		}
	}


	function sendFilterResolutionRequest(currentCount, concurrentCount) {
		var mergedFilter;
		var deferredFilterResolution = jQuery.Deferred();
		if (currentCount && currentCount !== concurrentCount){
			return deferredFilterResolution.promise();
		}
		var contextFilter;
		if (jQuery.isArray(context)) {
			contextFilter = new sap.apf.core.utils.Filter(inject.instances.messageHandler);
			context.forEach(function(value) {
				contextFilter.addOr(this.getAliasNameIfExistsElsePropertyName(), 'eq', value);
			}.bind(this));
		} else if (context instanceof sap.apf.core.utils.Filter){
			contextFilter = context;
		} else {
			contextFilter = new sap.apf.core.utils.Filter(inject.instances.messageHandler);
		}
		if (!restriction.isEmpty()) {
			mergedFilter = new sap.apf.core.utils.Filter(inject.instances.messageHandler);
			mergedFilter.addAnd(restriction).addAnd(contextFilter);
		} else {
			mergedFilter = contextFilter;
		}
		if (filterResolutionBuffer.lastMergedFilter && filterResolutionBuffer.lastMergedFilter.isEqual(mergedFilter)){
			filterResolutionBuffer.lastFilterResolutionPromise.done(function (response){
				deferredFilterResolution.resolve(response);
			});
		} else {
			filterResolutionBuffer.lastMergedFilter = mergedFilter.copy();
			filterResolutionBuffer.lastFilterResolutionPromise = deferredFilterResolution;
			inject.functions.createRequest(config.filterResolutionRequest).sendGetInBatch(mergedFilter, callback, undefined);
		}
		return deferredFilterResolution.promise();
		function callback(response) {
			deferredFilterResolution.resolve(response);
		}
	}
	function getValueHelp(currentCount, concurrentCount){
		var response;
		if(config.valueHelpRequest){
			return sendValueHelpRequest(currentCount, concurrentCount);
		} else if (config.valueList){
			response = { data : prependListValuesIfNotContainedInResponse(config.valueList, [])};
			return jQuery.Deferred().resolve(response);
		}
	}
	function sendValueHelpRequest(currentCount, concurrentCount) {
		var deferredValueHelp = jQuery.Deferred();
		if(currentCount && concurrentCount !== currentCount){
			return deferredValueHelp.promise();
		}

		if(valueHelpBuffer.lastRestriction && valueHelpBuffer.lastRestriction.isEqual(restriction)){
			valueHelpBuffer.lastValueHelpPromise.done(function (response){
				deferredValueHelp.resolve(response);
			});
		} else {
			valueHelpBuffer.lastRestriction = restriction.copy();
			valueHelpBuffer.lastValueHelpPromise = deferredValueHelp;
			inject.functions.createRequest(config.valueHelpRequest).sendGetInBatch(restriction, callback, undefined);
		}
		return deferredValueHelp.promise();
		function callback(response) {
			deferredValueHelp.resolve(response);
		}
	}
	function convertRequestResponseToArrayList(response) {
		var values = [];
		response.data.forEach(function(val) {
			values.push(val[this.getAliasNameIfExistsElsePropertyName()]);
		}.bind(this));
		return values;
	}
	function createAvailableValuesHashMap(arrayOfResponseObjects) {
		var valuesHashMap = {};
		arrayOfResponseObjects.forEach(function(responseObject) {
			valuesHashMap[responseObject[this.getAliasNameIfExistsElsePropertyName()]] = true;
		}.bind(this));
		return valuesHashMap;
	}
};
