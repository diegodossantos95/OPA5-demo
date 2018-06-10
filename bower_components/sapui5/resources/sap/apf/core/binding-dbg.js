/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap, jQuery */
jQuery.sap.declare("sap.apf.core.binding");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filterTerm");

(function() {
	'use strict';

	/**
	 * @class The binding manages the different representations, that are assigned to a step.
	 * @param {Object} oInject injection object
	 * @param {sap.apf.core.Instance} oInject.instances.coreApi provides the core api.
	 * @param {sap.apf.core.MessageHandler} oInject.instances.messageHandler provides the message handler.
	 * @param {object} oBindingConfig The configuration object of the binding from the analytical configuration.
	 * @param oBindingConfig.oTitle Title of binding
	 * @param oBindingConfig.oLongTitle long title of binding
	 * @param oBindingConfig.representations Configuration of the representations
	 * @param oBindingConfig.requiredFilters {string[]} required filters - Array with properties, that define the filter properties, that shall be returned.
	 * @param {sap.apf.core.ConfigurationFactory} oFactory reference
	 * @param {string} [sRepresentationId] the selected representation
	 */
	sap.apf.core.Binding = function(oInject, oBindingConfig, oFactory, sRepresentationId) {
		var that = this;
		this.type = "binding";
		var nSelectedRepresentation = 0;
		var aRepresentationInstances = [];
		var aRepresentationInfo = [];
		var aCachedData = [];
		var oCachedMetadata;
		this.oTitle = oBindingConfig.oTitle;
		this.oLongTitle = oBindingConfig.oLongTitle;
		var aRequiredFilters = oBindingConfig.requiredFilters;
		this.destroy = function() {
			aRepresentationInstances.forEach(function(oRepresentation) {
				if (oRepresentation && oRepresentation.destroy) {
					oRepresentation.destroy();
				}
			});
			aRepresentationInstances = [];
			aRepresentationInfo = [];
			aCachedData = [];
			oCachedMetadata = undefined;
		};
		/*
		 * Wrapper of the exit. If exit function is not injected it is the identity function.
		 * Otherwise the exit is applied and its result returned.
		 */
		function afterGetFilter(oFilter, oContextInfo) {
			if ( oInject.exits && oInject.exits.binding && oInject.exits.binding.afterGetFilter){
				return oInject.exits.binding.afterGetFilter(oFilter, that.getSelectedRepresentation(), oInject.instances.coreApi, oBindingConfig, oContextInfo);
			}
			return oFilter;
		}
		/**
		 * @see sap.apf.core.Step#getFilter
		 * The method afterGetFilter wraps an exit which, when set, is applied to the resulting filter.
		 * The result of the exit is then returned instead.
		 * If an exit is not set then the filter is returned unaltered (the wrapper is the identity function).
		 * The exit afterGetFilter can be set by injection, by oInject.exits.binding.afterGetFilter.
		 */
		this.getFilter = function(oContextInfo) {
			var oSelectedRepresentation = this.getSelectedRepresentation();
			var methodTypes = sap.apf.core.constants.filterMethodTypes;
			var aIndices = [];
			var result;
			if (oSelectedRepresentation.getFilterMethodType() === methodTypes.filter) {
				var oFilterFromRepresentation = oSelectedRepresentation.getFilter().getInternalFilter();
				return afterGetFilter(oFilterFromRepresentation, oContextInfo);
			}
			if (oSelectedRepresentation.getSelectionAsArray) {
				aIndices = oSelectedRepresentation.getSelectionAsArray();
			} else {
				return afterGetFilter(new sap.apf.core.utils.Filter(oInject.instances.messageHandler), oContextInfo);
			}
			/* The following code handles rectangle selections in a scatter plot.
			*  Selections a re expressed by an array of indexes.
			*  WHEN undefined: empty selection corresponds to empty rectangle in a scatter
			*  THEN create a contradiction filter
			*  WHEN nothing selected THEN create a neutral filter with no expression.
			*  OTHERWISE: create a filter from all selections
			*/
			if (aIndices === undefined) {
				result = sap.apf.core.utils.Filter.createEmptyFilter(oInject.instances.messageHandler, aRequiredFilters);
				return afterGetFilter(result, oContextInfo);
			}
			if (aIndices.length === aCachedData.length || aIndices.length === 0) {
				return afterGetFilter(new sap.apf.core.utils.Filter(oInject.instances.messageHandler), oContextInfo);
			}
			result = sap.apf.core.utils.Filter.createFromArray(oInject.instances.messageHandler, aRequiredFilters, aCachedData, aIndices);
			return afterGetFilter(result, oContextInfo);
		};
		/**
		 * @description Returns the requiredFilters
		 * @returns {Array} Array of strings, each representing a required filter/selectable property
		 */
		this.getRequiredFilters = function(){
			return aRequiredFilters;
		};
		/**
		 * @description Request option like $top, $skip and $orderby are returned by the actual representation. This
		 * is required to create the OData request.
		 * @param {boolean} filterChanged Indicates whether filter has changed after last update
		 */
		this.getRequestOptions = function(filterChanged) {
			if (jQuery.isFunction(this.getSelectedRepresentation().getRequestOptions)) {
				return this.getSelectedRepresentation().getRequestOptions(filterChanged);
			}
			return {};
		};
		/**
		 * @description Sets filter values to the current Representation
		 * @param {String []} Array of filterValues
		 */
		this.setFilterValues = function(aValues) {
			var oRepresentation = this.getSelectedRepresentation();
			oRepresentation.setFilterValues(aValues);
		};
		/**
		 * @see sap.apf.core.Step#setData
		 */
		this.setData = function(oDataResponse) {
			oInject.instances.messageHandler.check(oDataResponse !== undefined, "aDataResponse is undefined (binding function setData)");
			aCachedData = oDataResponse.data;
			oCachedMetadata = oDataResponse.metadata;
			this.getSelectedRepresentation().setData(oDataResponse.data, oDataResponse.metadata, oDataResponse.count, oDataResponse.selectionValidation);
		};
		/**
		 * @see sap.apf.ui.representations.representationInterface#updateTreetable
		 */
		this.updateTreetable = function(controlObject, oModel, entityTypeMetadata, bFilterChanged) {
			this.getSelectedRepresentation().updateTreetable(controlObject, oModel, entityTypeMetadata, bFilterChanged);
		};
		/**
		 * @see sap.apf.core.Step#getRepresentationInfo
		 */
		this.getRepresentationInfo = function() {
			var aReprInfo = jQuery.extend(true, [], aRepresentationInfo); // clone deep
			for(var i = 0; i < aReprInfo.length; i++) {
				delete aReprInfo[i].id;
				delete aReprInfo[i].type;
				delete aReprInfo[i].constructor;
			}
			return aReprInfo;
		};
		/**
		 * @see sap.apf.core.Step#getSelectedRepresentationInfo
		 */
		this.getSelectedRepresentationInfo = function() {
			oInject.instances.messageHandler.check(nSelectedRepresentation >= 0 && nSelectedRepresentation < aRepresentationInfo.length, "index in array boundaries");
			var oRepType = jQuery.extend(true, {}, aRepresentationInfo[nSelectedRepresentation]);
			delete oRepType.id;
			delete oRepType.type;
			delete oRepType.constructor;
			return oRepType;
		};
		/**
		 * @see sap.apf.core.Step#getSelectedRepresentation
		 */
		this.getSelectedRepresentation = function() {
			oInject.instances.messageHandler.check(nSelectedRepresentation >= 0 && nSelectedRepresentation < aRepresentationInstances.length, "selectedRepresentation in array boundaries");
			return aRepresentationInstances[nSelectedRepresentation];
		};
		/**
		 * @see sap.apf.core.Step#setSelectedRepresentation
		 */
		this.setSelectedRepresentation = function(sRepresentationId) {
			oInject.instances.messageHandler.check(typeof sRepresentationId === "string", "setSelectedRepresentation() - sRepresentationId missing");
			var that = this;
			var oCurrentInstance = this.getSelectedRepresentation();
			var oSwitchParameters = determineSwitchParameters(sRepresentationId, oBindingConfig.representations);
			var oNewInstance = setNewInstance(oSwitchParameters);
			nSelectedRepresentation = oSwitchParameters.index;
			if (aCachedData !== undefined && oCachedMetadata !== undefined) {
				oNewInstance.setData(aCachedData, oCachedMetadata);
			}
			if (oNewInstance.adoptSelection) {
				oNewInstance.adoptSelection(oCurrentInstance);
			}
			function determineSwitchParameters(sRepresentationId, aRepresentationConfig) {
				for(var i = 0; i < aRepresentationConfig.length; i++) {
					if (sRepresentationId === aRepresentationConfig[i].id) {
						return {
							config : aRepresentationConfig[i],
							constructor : oFactory.getConfigurationById(aRepresentationConfig[i].representationTypeId).constructor,
							index : i
						};
					}
				}
				oInject.instances.messageHandler.check(false, "Representation config not found");
			}
			function setNewInstance(oSwitchParam) {
				var oConvertedParameter;
				if (aRepresentationInstances[oSwitchParam.index] === undefined) {
					if (oSwitchParam.config.parameter && oSwitchParam.config.parameter.alternateRepresentationTypeId) {
						oSwitchParam.config.parameter.alternateRepresentationType = oFactory.getConfigurationById(oSwitchParam.config.parameter.alternateRepresentationTypeId);
					}
					oSwitchParam.config.parameter.requiredFilters = oBindingConfig.requiredFilters;
					oConvertedParameter = that.convertSortToOrderBy(oSwitchParam.config.parameter);
					aRepresentationInstances[oSwitchParam.index] = oInject.instances.coreApi.createRepresentation(oSwitchParam.constructor, oConvertedParameter);
					return aRepresentationInstances[oSwitchParam.index];
				}
				return aRepresentationInstances[oSwitchParam.index];
			}
		};
		/**
		 * @description Serializes a binding object.
		 * @returns {object} serialized binding object with a serializable selectedRepresentation and the selectedRepresentationId
		 */
		this.serialize = function() {
			return {
				selectedRepresentation : that.getSelectedRepresentation().serialize(),
				selectedRepresentationId : that.getSelectedRepresentationInfo().representationId
			};
		};
		/**
		 * @description Deserialize a serializable binding object.
		 * @param {object} oSerializableBinding serializable binding object to be deserialized
		 * @returns {object} deserialized binding runtime object
		 */
		this.deserialize = function(oSerializableBinding) {
			that.setSelectedRepresentation(oSerializableBinding.selectedRepresentationId);
			that.getSelectedRepresentation().deserialize(oSerializableBinding.selectedRepresentation);
			return that;
		};
		/**
		 * @private 
		 * @description For old file based configurations we need to convert the sort to an orderby attribute.
		 * @param {object} oParameter - parameter part of the representation object
		 * @returns{object} - New object (except for alternateRepresentationType) where the sort attribute is migrated to orderby
		 */
		this.convertSortToOrderBy = function(oParameter) {
			var result;
			if (oParameter.sort && !oParameter.orderby) {
				result = jQuery.extend(true, {}, oParameter);
				if (oParameter.alternateRepresentationType) {
					result.alternateRepresentationType = oParameter.alternateRepresentationType;
				}
				result.orderby = [ {
					property : oParameter.sort.sortField,
					ascending : !oParameter.sort.descending
				} ];
				delete result.sort;
				return result;
			}
			result = oParameter;
			return result;
		};

		aRepresentationInstances[0] = undefined;
		var representationIdFound = false;
		oBindingConfig.representations.forEach(function(representation, index) {
			var sRepTypeId = representation.representationTypeId;
			aRepresentationInfo[index] = jQuery.extend(true, {}, oFactory.getConfigurationById(sRepTypeId)); // return clone
			aRepresentationInfo[index].representationId = representation.id;
			if (sRepresentationId === aRepresentationInfo[index].representationId) {
				representationIdFound = true;
			}
			aRepresentationInfo[index].representationLabel = representation.label;
			aRepresentationInfo[index].thumbnail = representation.thumbnail;
			aRepresentationInfo[index].parameter = jQuery.extend(true, {}, representation.parameter);
		});
		if (representationIdFound) {
			this.setSelectedRepresentation(sRepresentationId);
		} else if (aRepresentationInfo.length > 0) {
			this.setSelectedRepresentation(aRepresentationInfo[0].representationId);
		}
		if (!representationIdFound && sRepresentationId) {
			oInject.instances.messageHandler.putMessage(oInject.instances.messageHandler.createMessageObject({
				code : '5037',
				aParameters : [ sRepresentationId ]
			}));
		}
	};
}());
