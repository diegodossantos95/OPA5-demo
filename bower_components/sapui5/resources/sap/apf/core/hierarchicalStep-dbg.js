/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.hierarchicalStep");
jQuery.sap.require("sap.apf.core.step");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.ui.model.odata.v2.ODataModel");
jQuery.sap.require("sap.ui.model.Sorter");
(function() {
	'use strict';
	/**
	 * @private
	 * @class A step is a runtime container for binding and request. 
	 * @name sap.apf.core.HierarchicalStep
	 * @param {object} messageHandler Message handler instance
	 * @param {object} stepConfig Step configuration object from analytical content configuration
	 * @param {sap.apf.core.ConfigurationFactory} factory
	 * @param {string} [representationId] the representation, that shall be selected
	 * @param {sap.apf.core.Instance} coreApi
	 * @returns {sap.apf.core.HierarchicalStep} 
	 */
	sap.apf.core.HierarchicalStep = function(messageHandler, stepConfig, factory, representationId, coreApi) {
		sap.apf.core.Step.call(this, messageHandler, stepConfig, factory, representationId);
		var selectString;
		var cachedFilter;
		this.type = "hierarchicalStep";
		var service = factory.getConfigurationById(stepConfig.request).service;
		var entitySet = factory.getConfigurationById(stepConfig.request).entityType;
		var annotations = coreApi.getAnnotationsForService(service);
		var hierarchyProperty = stepConfig.hierarchyProperty;
		var metadataInitialized = jQuery.Deferred();
		
		
		var sapSystem = coreApi.getStartParameterFacade().getSapSystem();
		
		if (sapSystem) {
			service = sap.ui.model.odata.ODataUtils.setOrigin(service, { force : true, alias : sapSystem});
		}
		jQuery.when(coreApi.getMetadata(service), coreApi.getEntityTypeMetadata(service, entitySet)).then(function(metadata, entityTypeMetadata) {
			var hierarchyAnnotations = metadata.getHierarchyAnnotationsForProperty(entitySet, hierarchyProperty);
			if (hierarchyAnnotations.type === "messageObject") {
				messageHandler.putMessage(hierarchyAnnotations);
			} else {
				selectString = getSelectString(hierarchyProperty, hierarchyAnnotations);
			}
			metadataInitialized.resolve(metadata, hierarchyAnnotations, entityTypeMetadata);
		});
		var oModel = new sap.ui.model.odata.v2.ODataModel(service, {
			annotationURI : annotations
		});
		var selectableProperties = factory.getConfigurationById(stepConfig.binding).requiredFilters;
		var selectionValidationRequest = factory.createRequest({
			service: service,
			entityType: entitySet,
			selectProperties: selectableProperties,
			type: "request",
			id: "SelectionValidationRequest"
		});
		function getSelectString(hierarchyProperty, hierarchyAnnotations) {
			var selectStrings = [ hierarchyProperty ];
			for( var key in hierarchyAnnotations) {
				selectStrings.push(hierarchyAnnotations[key]);
			}
			selectStrings = selectStrings.concat(factory.getConfigurationById(stepConfig.request).selectProperties);
			return sap.apf.core.utils.uriGenerator.getSelectString(selectStrings);
		}
		this.update = function(filter, callbackAfterRequest) {
			metadataInitialized.done(function(metadata, hierarchyAnnotations, entityTypeMetadata) {
				var effectiveFilter = filter.restrictToProperties(metadata.getFilterablePropertiesAndParameters(entitySet)); 
				var bFilterChanged = !effectiveFilter.isEqual(cachedFilter);
				cachedFilter = effectiveFilter.copy();
				var path = "/" + sap.apf.core.utils.uriGenerator.generateOdataPath(messageHandler, metadata, entitySet, filter, metadata.getUriComponents(entitySet).navigationProperty);
				var controlObject = {};
				controlObject.path = path;
				var filterForRequest = filter.restrictToProperties(metadata.getFilterableProperties(entitySet)); 
				if (!filterForRequest.isEmpty()) {
					controlObject.filters = [ filterForRequest.mapToSapUI5FilterExpression() ];
				}
				controlObject.parameters = {
					select : selectString,
					operationMode : sap.ui.model.odata.OperationMode.Server,
					useServerSideApplicationFilters : true,
					treeAnnotationProperties : hierarchyAnnotations
				};
				controlObject.sorter = this.getSorter();
				this.getBinding().updateTreetable(controlObject, oModel, entityTypeMetadata, bFilterChanged);
				if(!this.getFilter().isEmpty() && bFilterChanged){
					var filterForSelectionValidationRequest = filterForRequest.removeTermsByProperty(selectableProperties[0]);
					selectionValidationRequest.sendGetInBatch(filterForSelectionValidationRequest.addAnd(this.getFilter()), function(response){
						var responseValues = response.data;
						var currentSelectedFilters = this.getFilter().getFilterTerms();
						var validatedValues = [];
						currentSelectedFilters.forEach(function(filterTerm){
							responseValues.forEach(function(responseValue){
								if(responseValue[selectableProperties[0]] === filterTerm.getValue()){
									validatedValues.push(filterTerm.getValue());
								}
							});
						});
						this.getBinding().setFilterValues(validatedValues);
						callbackAfterRequest({}, false);
					}.bind(this));
				} else {
					callbackAfterRequest({}, false);
				}
			}.bind(this));
		};
		this.getSorter = function(){
			var sorter = [];
			var requestOptions = this.getBinding().getRequestOptions();
			if(requestOptions && requestOptions.orderby && requestOptions.orderby.length > 0){
				requestOptions.orderby.forEach(function(orderby){
					sorter.push(new sap.ui.model.Sorter(orderby.property, orderby.descending));
				});
			}
			if(sorter.length === 0){
				return;
			}
			return sorter;
		};
		this.setData = function() {
			// do nothing, overwrite sap.apf.core.step.setData logic
		};
		/**
		 * @description removes the selectable nodeId from the cumulative Filter
		 * @param {sap.apf.core.utils.Filter} cumulativeFilter
		 * @returns {sap.apf.core.utils.Filter} adjusted cumulative filter
		 */
		this.adjustCumulativeFilter = function(cumulativeFilter){
			if(selectableProperties[0] && !this.getFilter().isEmpty()){
				return cumulativeFilter.removeTermsByProperty(selectableProperties[0]);
			}
			return cumulativeFilter;
		};
	};
})();