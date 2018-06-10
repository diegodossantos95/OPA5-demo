/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.utils.startFilterHandler');
jQuery.sap.require('sap.apf.utils.filter');
jQuery.sap.require('sap.apf.core.utils.filter');
/**
 * @private
 * @class Start Filter Handler
 * @description Creates and manages the Start Filter instances. 
 * @param {object} inject Object containing functions and instances to be used by Start Filter Handler 
 * @param {sap.apf.core.MessageHandler} inject.instances.messageHandler Message handler instance
 * @param {function} inject.functions.getFacetFilterConfigurations {@link sap.apf.Api#getFacetFilterConfigurations}
 * @param {function} inject.functions.getReducedCombinedContext {@link sap.apf.core.Instance#getReducedCombinedContext} 
 * @param {function} inject.functions.createRequest {@link sap.apf.core.ConfigurationFactory#createRequest}
 * @param {sap.apf.utils.StartFilter} inject.constructors.StartFilter Start Filter constructor
 * @name sap.apf.utils.StartFilterHandler
 * @returns {sap.apf.utils.startFilterHandler}
 */
sap.apf.utils.StartFilterHandler = function(inject) {
	'use strict';
	var startFilters = [ {
		isLevel : true
	} ];
	var StartFilter = (inject && inject.constructors && inject.constructors.StartFilter) || sap.apf.utils.StartFilter;
	var restrictionsSetByApplicationBeforeInit = {};
	var restrictionsSetByApplication = {};
	var restrictionsInitiallySetByApplication = {};
	var restrictionsBuffer = {};
	var msgH = inject.instances.messageHandler;
	var deferredStartFilters = jQuery.Deferred();
	var initializationPromise = jQuery.Deferred();
	var isInitialized = false;
	var propagationPromise = jQuery.Deferred();
	var numberOfRestrictions = 0;
	var numberOfInitializedRestrictions = 0;
	var initializeForRestrictionsDeferred;
	var restrictionsSetDeferred = jQuery.Deferred();
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilterHandler#getStartFilters
	 * @description Returns promise which is resolved with an array of visible Start Filter instances {@link sap.apf.utils.StartFilter}. 
	 * @returns {jQuery.Deferred.promise}
	 */
	this.getStartFilters = function() {
		initialize().done(function() {
			deferredStartFilters.resolve(getVisibleStartFilters());
		});
		return deferredStartFilters.promise();
	};

	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilterHandler#setRestrictionByProperty
	 * @description Expects an internal filter instance containing disjoint equality filter terms for a single property only.
	 * If no start filter for the property exists the method creates a new instance else it updates an existing instance and merges existing values.
	 * In both cases the instance provides the filter values in the value list and selected value list. 
	 * @param {sap.apf.utils.Filter} filter Instance of external filter
	 */
	this.setRestrictionByProperty = function(filter) {
		if(!initializeForRestrictionsDeferred){
			initializeForRestrictionsDeferred = jQuery.Deferred();
		}
		numberOfRestrictions++;
		var internalFilter = filter.getInternalFilter();
		var propertyName = internalFilter.getProperties()[0];
		restrictionsSetByApplicationBeforeInit[propertyName] = filter;
		initialize();
		initializeForRestrictionsDeferred.done(function() {
			var isNewStartFilterRequired = true;
			getStartFilters().forEach(function(startFilter) {
				if (startFilter.getPropertyName() === propertyName) {
					if(internalFilter.isDisjunctionOverEqualities()){
						var isSetInititally = restrictionsSetDeferred.state() === "pending"; // if initialitzation is not finished yet these are initial values
						startFilter.setSelectedValues(getListFromFilter(internalFilter), isSetInititally);
					} else {
						startFilter.setContext(internalFilter);
					}
					isNewStartFilterRequired = false;
				}
			});
			if (isNewStartFilterRequired) {
				startFilters.unshift(new StartFilter(inject, {
					multiSelection : true,
					property : propertyName,
					invisible : true,
					notConfigured : true
				}, internalFilter));
			}
			if(propagationPromise.state() === 'resolved'){
				propagationPromise = jQuery.Deferred();
			}
			if(inject.functions.getFacetFilterConfigurations().length === 0) {
				propagationPromise.resolve(buildRestrictiveFilters(getMinusOneLevelFilters()));
			}
			restrictionsSetByApplication[propertyName] = filter;
			delete restrictionsSetByApplicationBeforeInit[propertyName];
			if (!restrictionsInitiallySetByApplication[propertyName]) {
				restrictionsInitiallySetByApplication[propertyName] = filter.serialize();
			}
			numberOfInitializedRestrictions++;
			if(numberOfInitializedRestrictions === numberOfRestrictions){
				triggerPropagation();
				restrictionsSetDeferred.resolve(); //finish initialization
			}
		});
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilterHandler#getRestrictionByProperty
	 * @description Returns the filter for a given property name previously set by method {@link sap.apf.utils.StartFilterHandler#setRestrictionByProperty}. 
	 * If no filter is known for the given property, then an empty filter is returned. 
	 * @param {string} propertyName Property name for the requested restriction filter
	 * @returns {sap.apf.utils.Filter} 
	 */
	this.getRestrictionByProperty = function(propertyName) {
		if (restrictionsSetByApplication[propertyName]) {
			return restrictionsSetByApplication[propertyName];
		} else if (restrictionsSetByApplicationBeforeInit[propertyName]) {
			return restrictionsSetByApplicationBeforeInit[propertyName];
		}
		return new sap.apf.utils.Filter(msgH);
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilterHandler#getCumulativeFilter
	 * @description Returns a promise which is resolved with the cumulative filter once it is determined. The cumulative filter is a conjunction of the 
	 * selected values from all (visible and invisible) Start Filters represented as filter instance of {@link sap.apf.core.utils.Filter}. 
	 * @returns {jQuery.Deferred.promise}
	 */
	this.getCumulativeFilter = function() {
		var deferred = jQuery.Deferred();
		var result = new sap.apf.core.utils.Filter(msgH);
		var numberOfStartFilters;
		initialize().done(function() {
			numberOfStartFilters = getStartFilters().length;
			if (numberOfStartFilters === 0) {
				deferred.resolve(new sap.apf.core.utils.Filter(msgH));
			}

			propagationPromise.done(function(selectedValues, restrictions, propertyName){
				var disjointTerms; 
				disjointTerms = new sap.apf.core.utils.Filter(msgH);
				if (selectedValues && selectedValues.type === 'internalFilter') {
					disjointTerms = selectedValues;
				}
				if (jQuery.isArray(selectedValues)) {
					selectedValues.forEach(function(value) {
						disjointTerms.addOr(new sap.apf.core.utils.Filter(msgH, propertyName, 'eq', value));
					});
				}

				if(restrictions){
					result.addAnd(restrictions).addAnd(disjointTerms);
				} else {
					result = disjointTerms;
				}
				deferred.resolve(result);
			});
		});
		return deferred.promise();
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilterHandler#serialize
	 * @description Serializes the content of the Start FilterHandler, which includes the restrictions set by an application and the Start Filters. 
	 * @param {boolean} isNavigation Indicator for serializing a start filter for navigation purpose
	 * @returns {object} Serialized data as deep JS object
	 */
	this.serialize = function(isNavigation, keepInitialStartFilterValues) {
		var deferred = jQuery.Deferred();
		var numberOfStartFilters;
		var restrictedProperty;
		var serializedStartFilterHandler = {};
		serializedStartFilterHandler.startFilters = [];
		serializedStartFilterHandler.restrictionsSetByApplication = {};
		for(restrictedProperty in restrictionsSetByApplication) {
			serializedStartFilterHandler.restrictionsSetByApplication[restrictedProperty] = restrictionsSetByApplication[restrictedProperty].serialize();
		}
		numberOfStartFilters = getStartFilters().length;
		if (getStartFilters().length > 0) {
			getStartFilters().forEach(function(startFilter) {
				startFilter.serialize(isNavigation, keepInitialStartFilterValues).done(function(serializedStartFilter) {
					serializedStartFilterHandler.startFilters.push(serializedStartFilter);
					numberOfStartFilters--;
					if (numberOfStartFilters === 0) {
						deferred.resolve(serializedStartFilterHandler);
					}
				});
			});
		} else {
			deferred.resolve(serializedStartFilterHandler);
		}
		return deferred.promise();
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilterHandler#deserialize
	 * @description Re-initializes Start Filter Handler based on given serialized data object. 
	 * @param {object} serializedStartFilterHandler Serialized data used to re-initialize Start Filter Handler
	 */
	this.deserialize = function(serializedStartFilterHandler) {
		var deferred = jQuery.Deferred();
		propagationPromise.done(function(){
			var startFilters = getStartFilters();
			var restrictedProperty;
			var externalFilter;
			restrictionsSetByApplication = {};
			serializedStartFilterHandler.startFilters.forEach(function(serializedStartFilter) {
				for(var i = 0, len = startFilters.length; i < len; i++) {
					if (serializedStartFilter.propertyName === startFilters[i].getPropertyName()) {
						startFilters[i].deserialize(serializedStartFilter);
					}
				}
			});
			for(restrictedProperty in serializedStartFilterHandler.restrictionsSetByApplication) {
				externalFilter = new sap.apf.utils.Filter(msgH);
				externalFilter.deserialize(serializedStartFilterHandler.restrictionsSetByApplication[restrictedProperty]);
				restrictionsSetByApplication[restrictedProperty] = externalFilter;
			}
			propagationPromise = jQuery.Deferred();
			triggerPropagation();
			propagationPromise.done(function(){
				deferred.resolve();
			});
		});
		return deferred;
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilterHandler#resetAll
	 * @description Resets all Start Filter instances back to the initially derived selected values 
	 */
	this.resetAll = function() {
		var initiallyRestrictedProperty;
		getStartFilters().forEach(function(startFilter) {
			startFilter.reset();
		});
		restrictionsSetByApplication = {};
		for(initiallyRestrictedProperty in restrictionsInitiallySetByApplication) {
			restrictionsSetByApplication[initiallyRestrictedProperty] = new sap.apf.utils.Filter(msgH).deserialize(restrictionsInitiallySetByApplication[initiallyRestrictedProperty]);
		}
		triggerPropagation();
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.StartFilterHandler#resetVisibleStartFilters
	 * @description Resets visible Start Filter instances back to the initially derived selected values 
	 */
	this.resetVisibleStartFilters = function() {
		getVisibleStartFilters().forEach(function(startFilter) {
			startFilter.reset();
		});
		var indexFirstConfiguredStartFilter = 0;
		var len = startFilters.length;
		for(var i = 0; i < len; i++) {
			if (startFilters[i].isLevel) {
				indexFirstConfiguredStartFilter = i + 1;
				break;
			}
		}
		if(startFilters[indexFirstConfiguredStartFilter]) {
			startFilters[indexFirstConfiguredStartFilter].setRestriction(restrictionsBuffer[startFilters[indexFirstConfiguredStartFilter].getPropertyName()]);
		}
	};
	function initialize() {
		if (!isInitialized) {
			isInitialized = true;
			inject.instances.onBeforeApfStartupPromise.done(function(){
				inject.functions.getReducedCombinedContext().done(function(externalContextFilter) {
					var facetFilterConfigurations = inject.functions.getFacetFilterConfigurations();
					var externalContextProperties = externalContextFilter.getProperties();
					var numberOfExternalContextProperties = externalContextProperties.length; 
					var filterPropertyToBeMerged = null;
	
					facetFilterConfigurations.forEach(function(config) {
						for(var i = 0; i < numberOfExternalContextProperties; i++) {
							if (config.property === externalContextProperties[i]) {
								filterPropertyToBeMerged = externalContextProperties[i];
								break;
							}
						}
						if (filterPropertyToBeMerged) {
							startFilters.push(new StartFilter(inject, config, createContextForStartFilter(externalContextFilter, filterPropertyToBeMerged)));
							//Remove external context property if it has matched a configured property
							externalContextProperties.splice(externalContextProperties.indexOf(filterPropertyToBeMerged), 1);
							filterPropertyToBeMerged = null;
						} else {
							startFilters.push(new StartFilter(inject, config));
						}
					});
					//Create start filters for external context properties that have not matched a configured property 
					externalContextProperties.forEach(function(property) {
						startFilters.unshift(new StartFilter(inject, {
							property : property,
							invisible : true,
							multiSelection : true
						}, createContextForStartFilter(externalContextFilter, property)));
					});
					if(!initializeForRestrictionsDeferred){
						initializeForRestrictionsDeferred = jQuery.Deferred();
						restrictionsSetDeferred.resolve(); //no restrictions that the initialization has to wait for
					}
					initializeForRestrictionsDeferred.resolve(); // enable restrictions to be set before initialization is finished
					restrictionsSetDeferred.done(function(){
						setRestrictionsOnConfiguredFilters().done(function() {
							registerGetSelectedValuesPromises();
							initializationPromise.resolve();
						});
					});
				});
			});
		}
		return initializationPromise;
	}
	function registerGetSelectedValuesPromises() {
		var startFilters = getConfiguredStartFilters();
		startFilters.forEach(function(startFilter) {
			startFilter.getSelectedValues().done(onGetSelectedValues);

			function onGetSelectedValues(values, promise) {
				var startFilterIndex;
				var filterSelectedValues = new sap.apf.core.utils.Filter(msgH);
				var filter;
				promise.done(onGetSelectedValues);

				for (var i = 0; i < startFilters.length; i++) {
					if (startFilters[i] === startFilter) {
						startFilterIndex = i;
						break;
					}
				}
				if (startFilterIndex === startFilters.length - 1) {
					if(propagationPromise.state() === 'resolved'){
						propagationPromise = jQuery.Deferred();
					}
					propagationPromise.resolve(values, restrictionsBuffer[startFilter.getPropertyName()], startFilter.getPropertyName());
					return;
				} else if(propagationPromise.state() === 'resolved'){
					propagationPromise = jQuery.Deferred();
				}
				if (values && values.type === 'internalFilter') {
					filterSelectedValues = values;
				} else if (jQuery.isArray(values)) {
					values.forEach(function(value) {
						filterSelectedValues.addOr(startFilter.getPropertyName(), 'eq', value);
					});
				}
				if (restrictionsBuffer[startFilter.getPropertyName()]) {
					if(filterSelectedValues.isEmpty()){
						filter = restrictionsBuffer[startFilter.getPropertyName()].copy();
					} else {
						if(restrictionsBuffer[startFilter.getPropertyName()].isOr()){
							filter = new sap.apf.core.utils.Filter(msgH);
							filter.addAnd(restrictionsBuffer[startFilter.getPropertyName()]).addAnd(filterSelectedValues);
						} else {
							filter = restrictionsBuffer[startFilter.getPropertyName()].copy().addAnd(filterSelectedValues);
						}
					}
				} else {
					filter = filterSelectedValues;
				}

				restrictionsBuffer[startFilters[startFilterIndex + 1].getPropertyName()] = filter;
				startFilters[startFilterIndex + 1].setRestriction(filter);
			}
		});
	}
	function getListFromFilter(filter) {
		var result = [];
		filter.getFilterTerms().forEach(function(term) {
			result.push(term.getValue());
		});
		return result;
	}
	function createContextForStartFilter(filter, property) {
		var result = [];
		var termsForProperty = filter.getFilterTermsForProperty(property);
		var reducedFilter = filter.restrictToProperties([property]);
		if (reducedFilter.toUrlParam().indexOf('%20and%20') > -1) {
			return reducedFilter;
		}
		for(var i = 0, len = termsForProperty.length; i < len; i++) {
			if (termsForProperty[i].getOp() !== 'EQ') {
				return reducedFilter;
			}
			result.push(termsForProperty[i].getValue());
		}
		return result;
	}
	function getVisibleStartFilters() {
		var visibleStartFilters = [];
		getStartFilters().forEach(function(startFilter) {
			if (startFilter.isVisible()) {
				visibleStartFilters.push(startFilter);
			}
		});
		return visibleStartFilters;
	}
	function getConfiguredStartFilters(){
		var levelFound = false;
		var configuredStartFilters = [];
		startFilters.forEach(function(filter){
			if(filter.isLevel){
				levelFound = true;
			} else if (levelFound === true){
				configuredStartFilters.push(filter);
			}
		});
		return configuredStartFilters;
	}
	function getStartFilters() {
		var realStartFilters = [];
		startFilters.forEach(function(filter) {
			if (!filter.isLevel) {
				realStartFilters.push(filter);
			}
		});
		return realStartFilters;
	}
	function getMinusOneLevelFilters() {
		var minusOneLevelFilters = [];
		for(var i = 0, len = startFilters.length; i < len; i++) {
			if (!startFilters[i].isLevel) {
				minusOneLevelFilters.push(startFilters[i]);
			} else {
				break;
			}
		}
		return minusOneLevelFilters;
	}
	function setRestrictionsOnConfiguredFilters() {
		var deferred = jQuery.Deferred();
		setRestrictions(buildRestrictiveFilters(getMinusOneLevelFilters()));
		return deferred;

		function setRestrictions(restrictiveFilter) {
			var i;
			var len = startFilters.length;
			var cumulativeFilter = restrictiveFilter;
			var indexFirstConfiguredStartFilter = 0;

			for(i = 0; i < len; i++) {
				if (startFilters[i].isLevel) {
					indexFirstConfiguredStartFilter = i + 1;
					break;
				}
			}
			if(startFilters[indexFirstConfiguredStartFilter]) {
				startFilters[indexFirstConfiguredStartFilter].setRestriction(cumulativeFilter);
				restrictionsBuffer[startFilters[indexFirstConfiguredStartFilter].getPropertyName()] = cumulativeFilter.copy();
				propagateResolvedSelectionAsRestriction(indexFirstConfiguredStartFilter);
			} else {
				propagationPromise.resolve(buildRestrictiveFilters(getMinusOneLevelFilters()));
				deferred.resolve();
			}
			function propagateResolvedSelectionAsRestriction(index){
				if(startFilters[index + 1]){
					startFilters[index].getSelectedValues().done(function(values) {
						var filter = new sap.apf.core.utils.Filter(msgH);
						if (values && values.type === 'internalFilter') {
							filter.addOr(values);
						} else if (jQuery.isArray(values)) {
							values.forEach(function(value) {
								filter.addOr(startFilters[index].getPropertyName(), 'eq', value);
							});
						}
						if(!filter.isEmpty()){
							cumulativeFilter.addAnd(filter);
						}
						startFilters[index + 1].setRestriction(cumulativeFilter);
						restrictionsBuffer[startFilters[index + 1].getPropertyName()] = cumulativeFilter.copy();
						propagateResolvedSelectionAsRestriction(index + 1);
					});
				} else {
					deferred.resolve();
				}
			}
		}
	}
	function buildRestrictiveFilters(filters) {
		var restrictiveFilter = new sap.apf.core.utils.Filter(msgH);
		filters.forEach(function(startFilter) {
			var filter = new sap.apf.core.utils.Filter(msgH);
			startFilter.getSelectedValues().done(function(values) { //Used promises from minus-one-level are synchronously resolved 
				if (values.type === 'internalFilter') {
					filter.addOr(values);
				} else {
					values.forEach(function(value) {
						filter.addOr(startFilter.getPropertyName(), 'eq', value);
					});
				}
			});
			restrictiveFilter.addAnd(filter);
		});
		return restrictiveFilter;
	}
	function triggerPropagation() {
		var indexFirstConfiguredStartFilter = 0;
		var len = startFilters.length;
		for(var i = 0; i < len; i++) {
			if (startFilters[i].isLevel) {
				indexFirstConfiguredStartFilter = i + 1;
				break;
			}
		}
		if(startFilters[indexFirstConfiguredStartFilter]) {
			var restriction = buildRestrictiveFilters(getMinusOneLevelFilters());
			restrictionsBuffer[startFilters[indexFirstConfiguredStartFilter].getPropertyName()] = restriction;
			startFilters[indexFirstConfiguredStartFilter].setRestriction(restriction);
		}else{
			propagationPromise.resolve(buildRestrictiveFilters(getMinusOneLevelFilters()));
		}
	}
};