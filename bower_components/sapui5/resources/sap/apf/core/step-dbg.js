/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap, jQuery */
jQuery.sap.declare("sap.apf.core.step");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.utils.areRequestOptionsEqual");
jQuery.sap.require("sap.apf.utils.utils");

(function() {
	'use strict';
	/**
	 * @private
	 * @class A step is a runtime container for binding and request. 
	 * @name sap.apf.core.Step
	 * @param {object} oMessageHandler Message handler instance
	 * @param {object} oStepConfig Step configuration object from analytical content configuration
	 * @param {sap.apf.core.ConfigurationFactory} oFactory
	 * @param {string} [sRepresentationId] the representation, that shall be selected
	 * @returns {sap.apf.core.Step} 
	 */
	sap.apf.core.Step = function(oMessageHandler, oStepConfig, oFactory, sRepresentationId) {
		oMessageHandler.check(oStepConfig !== undefined, "Step: step configuration is missing");
		oMessageHandler.check(oStepConfig.binding !== undefined, "No binding assigned to step " + oStepConfig.id + " in analytical configuration", sap.apf.core.constants.message.code.errorCheckConfiguration);
		var that = this;
		var oBinding, oRequest, oCachedFilter, oCachedRequestOptions;
		var oAdditionalConfigurationProperties = jQuery.extend(true, {}, oStepConfig);
		/**
		 * @private
		 * @description Type
		 * @returns {string}
		 */
		this.type = 'step';
		/**
		 * @private
		 * @description Contains 'title'
		 * @returns {string}
		 */
		this.title = jQuery.extend(true, {}, oStepConfig.title);
		/**
		 * @private
		 * @description Contains 'longTitle'
		 * @returns {string}
		 */
		this.longTitle = undefined;
		if (oStepConfig.longTitle) {
			this.longTitle = jQuery.extend(true, {}, oStepConfig.longTitle);
		}
		/**
		 * @private
		 * @description Contains 'thumbnail'
		 * @returns {string}
		 */
		this.thumbnail = jQuery.extend(true, {}, oStepConfig.thumbnail);
		/**
		 * @private
		 * @description Contains 'categories'
		 * @returns {object[]}
		 */
		this.categories = oStepConfig.categories;
		/**
		 * @private
		 * @description Releases all resources of the step as precondition for garbage collection
		 * 
		 */
		this.destroy = function() {
			if (oBinding) {
				oBinding.destroy();
			}
			oRequest = undefined;
			oCachedFilter = undefined;
			oCachedRequestOptions = undefined;
			oBinding = undefined;
			that = undefined;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getAdditionalConfigurationProperties
		 * @description Returns additional properties from step template
		 * @returns {object}
		 */
		this.getAdditionalConfigurationProperties = function() {
			return oAdditionalConfigurationProperties;
		};
		/** 
		 * @private
		 * @function
		 * @name sap.apf.core.Step#update
		 * @description Do not use. Not part of the APF API. 
		 * Method should only be called internally by APF. 
		 * APF consumers must call sap.apf.updatePath() instead.
		 * @returns undefined
		 */
		this.update = function(oFilterForRequest, callbackAfterRequest) {
			var selectionValidationRequest;
			var selectionValidationRequestFilter = this.getFilter();
			var bFilterChanged = !oFilterForRequest.isEqual(oCachedFilter);
			var oCurrentRequestOptions = oBinding.getRequestOptions(bFilterChanged);
			var bRequestOptionsChanged = !sap.apf.core.utils.areRequestOptionsEqual(oCachedRequestOptions, oCurrentRequestOptions);
			if(!selectionValidationRequestFilter.isEmpty() && !oStepConfig.topNSettings && (oBinding.getSelectedRepresentation().type === 'TableRepresentation')){
				selectionValidationRequest = {
						selectionFilter : selectionValidationRequestFilter, 
						requiredFilterProperties : selectionValidationRequestFilter.getProperties()
				};
			}
			if (oRequest && (bFilterChanged || bRequestOptionsChanged)) {
				oRequest.sendGetInBatch(oFilterForRequest, callbackAfterRequest, oCurrentRequestOptions, selectionValidationRequest);
			} else {
				callbackAfterRequest({}, true);
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#determineFilters
		 * @description Do not use. Not part of the APF API.
		 * Called APF internally from path update to invoke filter calculation on step.
		 * @param {sap.apf.utils.Filter} oFilter
		 * @returns undefined
		 */
		this.determineFilter = function(oCumulatedFilter, callbackFromStepFilterProcessing) {
			if(this.adjustCumulativeFilter){
				var newCumulativeFilter = this.adjustCumulativeFilter(oCumulatedFilter);
			}
			if (mappingRequired() && this.getFilter().toUrlParam()) {
				var oRequestConfig = oFactory.getConfigurationById(oStepConfig.filterMapping.requestForMappedFilter);
				oRequestConfig.selectProperties = oStepConfig.filterMapping.target;
				var oMappingRequest = oFactory.createRequest(oRequestConfig);
				var oMergedFilter = oCumulatedFilter.addAnd(this.getFilter());
				if(newCumulativeFilter){
					oMergedFilter = newCumulativeFilter.copy().addAnd(this.getFilter());
				}
				sap.apf.utils.executeFilterMapping(oMergedFilter, oMappingRequest, oStepConfig.filterMapping.target, localCallback, oMessageHandler);
			} else {
				callbackFromStepFilterProcessing(this.getFilter(), newCumulativeFilter);
			}
			function localCallback(oMappedFilter, oMessageObject) {
				if (!oMessageObject) {
					if (oStepConfig.filterMapping.keepSource === 'true') {
						oMappedFilter = that.getFilter().addAnd(oMappedFilter);
					}
					callbackFromStepFilterProcessing(oMappedFilter, newCumulativeFilter);
				}
			}
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getBinding
		 * @description Do not use. Not part of the APF API.
		 * @returns {sap.apf.core.Binding}
		 */
		this.getBinding = function() {
			return oBinding;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getFilter
		 * @description Fetches the selection from the representation. 
		 * @returns {sap.apf.core.utils.Filter} 
		 */
		this.getFilter = function() {
			return oBinding.getFilter(this.getContextInfo());
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getContextInfo
		 * @description Returns an object containing the entityType and service this step refers to.
		 * @returns {object}
		 */
		this.getContextInfo = function() {
			var oRequestConfiguration = oFactory.getConfigurationById(oStepConfig.request);
			var oContextInfo = {
				entityType : oRequestConfiguration.entityType,
				service : oRequestConfiguration.service
			};
			return oContextInfo;
		};
		/** 
		 * @private
		 * @function
		 * @name sap.apf.core.Step#setData
		 * @description Do not use. Not part of the APF API. 
		 * Method should only be called internally by APF.
		 * @returns undefined
		 */
		this.setData = function(oDataResponse, oFilterThatHasBeenUsedToRetrieveData) {
			var bFilterChanged = !oFilterThatHasBeenUsedToRetrieveData.isEqual(oCachedFilter);
			oCachedFilter = oFilterThatHasBeenUsedToRetrieveData.copy();
			oCachedRequestOptions = jQuery.extend({}, oBinding.getRequestOptions(bFilterChanged));
			oBinding.setData(oDataResponse);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getRepresentationInfo
		 * @description Returns an array of representation information objects.
		 * @returns {object[]}
		 */
		this.getRepresentationInfo = function() {
			return oBinding.getRepresentationInfo();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getSelectedRepresentationInfo
		 * @description Returns the representation information object of the selected representation. 
		 * @returns {object}
		 */
		this.getSelectedRepresentationInfo = function() {
			return oBinding.getSelectedRepresentationInfo();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getSelectedRepresentation
		 * @description Returns the selected representation object. 
		 * @returns {sap.apf.ui.representations.representationInterface}
		 */
		this.getSelectedRepresentation = function() {
			return oBinding.getSelectedRepresentation();
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.core.Step#setSelectedRepresentation
		 * @description Sets the selected representation via representation id. 
		 * The selected representation receives the response data through setData().  
		 * @param {string} sRepresentationId The representation id used to identify the representation. 
		 * @returns {undefined}
		 */
		this.setSelectedRepresentation = function(sRepresentationId) {
			oBinding.setSelectedRepresentation(sRepresentationId);
		};
		/** 
		 * @private
		 * @function
		 * @name sap.apf.core.Step#serialize
		 * @description Do not use. Not part of the APF API. 
		 * Method should only be called internally by APF.
		 * @returns {object}
		 */
		this.serialize = function() {
			return {
				stepId : oStepConfig.id,
				binding : oBinding.serialize()
			};
		};
		/** 
		 * @private
		 * @function
		 * @name sap.apf.core.Step#deserialize
		 * @description Do not use. Not part of the APF API. 
		 * Method should only be called internally by APF.
		 * @returns {object}
		 */
		this.deserialize = function(oSerializableStep) {
			oBinding.deserialize(oSerializableStep.binding);
			oMessageHandler.check(oStepConfig.id, oSerializableStep.stepId, "sap.apf.core.step.deserialize inconsistent serialization data - id " + oSerializableStep.stepId);
			return this;
		};
		/** 
		 * @private
		 * @function
		 * @name sap.apf.core.Step#getAssignedNavigationTargets
		 * @description Do not use. Not part of the APF API. 
		 * Method should only be called internally by APF.
		 * @returns {object}
		 */
		this.getAssignedNavigationTargets = function() {
			return oStepConfig.navigationTargets;
		};
		initialize();
		// private functions
		function initialize() {
			oBinding = oFactory.createBinding(oStepConfig.binding, undefined, undefined, sRepresentationId);
			delete oAdditionalConfigurationProperties.binding;
			if (oStepConfig.request !== undefined && oStepConfig.request !== "") {
				oRequest = oFactory.createRequest(oStepConfig.request);
				delete oAdditionalConfigurationProperties.request;
			}
		}
		function mappingRequired() {
			if (oStepConfig.filterMapping) {
				if (oStepConfig.filterMapping.requestForMappedFilter && oStepConfig.filterMapping.target instanceof Array && oStepConfig.filterMapping.keepSource) {
					return true;
				}
				oMessageHandler.putMessage(oMessageHandler.createMessageObject({
					code : "5104"
				}));
			}
			return false;
		}
	};
}());
