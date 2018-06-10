/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */

// -----------------------------------------------------------------------------
// Generates the data-model required for SmartFilter using SAP-Annotations metadata
// -----------------------------------------------------------------------------
sap.ui.define([
	'jquery.sap.global', 'sap/m/Select', 'sap/ui/core/Item', 'sap/m/ComboBox', 'sap/m/DatePicker', 'sap/m/DateRangeSelection', 'sap/m/TimePicker', 'sap/m/Input', 'sap/m/MultiComboBox', 'sap/m/MultiInput', 'sap/m/SearchField', 'sap/m/Token', 'sap/ui/comp/odata/MetadataAnalyser', 'sap/ui/comp/providers/ValueHelpProvider', 'sap/ui/comp/providers/ValueListProvider', 'sap/ui/model/Filter', 'sap/ui/model/json/JSONModel', 'sap/ui/comp/odata/ODataType', 'sap/ui/comp/util/FormatUtil', 'sap/ui/base/EventProvider', 'sap/ui/comp/util/IdentifierUtil', 'sap/ui/comp/providers/TokenParser', 'sap/ui/core/format/DateFormat'
], function(jQuery, Select, Item, ComboBox, DatePicker, DateRangeSelection, TimePicker, Input, MultiComboBox, MultiInput, SearchField, Token, MetadataAnalyser, ValueHelpProvider, ValueListProvider, Filter, JSONModel, ODataType, FormatUtil, EventProvider, IdentifierUtil, TokenParser, DateFormat) {
	"use strict";

	/**
	 * Constructs a class to generate the view/datamodel metadata for the SmartFilterBar from the SAP-Annotations metadata
	 * @constructor
	 * @experimental This module is only for internal/experimental use!
	 * @public
	 * @param {object} mPropertyBag - PropertyBag having members model, serviceUrl, entityType, additionalConfiguration
	 * @author SAP
	 */
	var FilterProvider = function(mPropertyBag) {
		this._bInitialized = false;
		this._bPending = true;
		this._bConsiderAnalyticalParameters = false;
		if (mPropertyBag) {
			this._oParentODataModel = mPropertyBag.model;
			this._sServiceURL = mPropertyBag.serviceUrl;
			this._sBasicSearchFieldName = mPropertyBag.basicSearchFieldName;
			this._isBasicSearchEnabled = mPropertyBag.enableBasicSearch;
			this._bUseContainsAsDefault = mPropertyBag.useContainsAsDefaultFilter === "true";
			this.sEntityType = mPropertyBag.entityType;
			this.sEntitySet = mPropertyBag.entitySet;
			this._isRunningInValueHelpDialog = mPropertyBag.isRunningInValueHelpDialog;
			this._oAdditionalConfiguration = mPropertyBag.additionalConfiguration;
			this.sDefaultDropDownDisplayBehaviour = mPropertyBag.defaultDropDownDisplayBehaviour;
			this.sDefaultTokenDisplayBehaviour = mPropertyBag.defaultTokenDisplayBehaviour;
			if (typeof mPropertyBag.dateFormatSettings === "string") {
				try {
					this._oDateFormatSettings = mPropertyBag.dateFormatSettings ? JSON.parse(mPropertyBag.dateFormatSettings) : undefined;
				} catch (ex) {
					// Invalid dateformat provided!
				}
			} else {
				this._oDateFormatSettings = mPropertyBag.dateFormatSettings;
			}
			if (!this._oDateFormatSettings) {
				this._oDateFormatSettings = {};
			}
			// Default to UTC true if nothing is provided --> as sap:display-format="Date" should be used without a timezone
			if (!this._oDateFormatSettings.hasOwnProperty("UTC")) {
				this._oDateFormatSettings["UTC"] = true;
			}

			// Used for IN param handling (visible field)
			// TODO: CleanUp - a better handling
			this._oSmartFilter = mPropertyBag.smartFilter;

			this._bConsiderAnalyticalParameters = mPropertyBag.considerAnalyticalParameters;
			this._bUseDateRangeType = mPropertyBag.useDateRangeType;
			this._bConsiderSelectionVariants = mPropertyBag.considerSelectionVariants;

			this._aConsiderNavigations = mPropertyBag.considerNavigations;
		}
		this.sFilterModelName = FilterProvider.FILTER_MODEL_NAME;
		this._sBasicFilterAreaID = FilterProvider.BASIC_FILTER_AREA_ID;
		this._aAnalyticalParameters = [];
		this._aFilterBarViewMetadata = [];
		this._aFilterBarFieldNames = [];
		this._aFilterBarMultiValueFieldMetadata = [];
		this._aFilterBarDateFieldNames = [];
		this._aFilterBarTimeFieldNames = [];
		this._aFilterBarTimeIntervalFieldNames = [];
		this._aFilterBarDateTimeMultiValueFieldNames = [];
		this._aFilterBarStringFieldNames = [];
		// Array of FieldGroups from FieldGroup annotations
		this._aFieldGroupAnnotation = [];
		this._oMetadataAnalyser = new MetadataAnalyser(this._oParentODataModel || this._sServiceURL);
		// Initialise the model early so this can already be passed to the necessary helper classes --> Ex: BaseValueListProvider
		this.oModel = new JSONModel();

		this._aValueListProvider = [];
		this._aValueHelpDialogProvider = [];
		this._mTokenHandler = {};
		this._mConditionTypeFields = {};
		this._aSelectionVariants = [];

		this._intialiseMetadata();
		this._bInitialized = true;
	};

	FilterProvider.FILTER_MODEL_NAME = "fi1t3rM0d31";
	FilterProvider.BASIC_FILTER_AREA_ID = "_BASIC";
	FilterProvider.BASIC_SEARCH_FIELD_ID = "_BASIC_SEARCH_FIELD";
	FilterProvider.CUSTOM_FIELDS_MODEL_PROPERTY = "_CUSTOM";
	FilterProvider.FIELD_NAME_REGEX = /\./g;

	/**
	 * Initialises the necessary filter metadata and model
	 * @private
	 */
	FilterProvider.prototype._intialiseMetadata = function() {
		var iGroupLen, iFieldLen, oSelectionFields, oODataFilterGroup, aODataFilterGroups, i, j, oODataFilterField, oFieldMetadata, oGroupMetadata, aCustomFilterField, aCustomGroup;
		// first, create a Basic Area Group (groupId/groupName shall be "_BASIC")
		this._aFilterBarViewMetadata.push({
			groupName: this._sBasicFilterAreaID,
			index: 0, // should be the 1st group on the UI
			fields: []
		});
		// try to calculate entitySet using entityType, when no entitySet is provided
		if (!this.sEntitySet && this.sEntityType) {
			this.sEntitySet = this._oMetadataAnalyser.getEntitySetNameFromEntityTypeName(this.sEntityType);
		}
		// Calculate the entityType from entitySet, if not entityType is provided

		this.sEntityType = this._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.sEntitySet);

		aODataFilterGroups = this._oMetadataAnalyser.getAllFilterableFieldsByEntitySetName(this.sEntitySet, this._bConsiderAnalyticalParameters, this._aConsiderNavigations);
		if (aODataFilterGroups) {
			// update TextArrangement
			this._updateDisplayBehaviour();

			// Get the array of FieldGroup annotations
			this._aFieldGroupAnnotation = this._oMetadataAnalyser.getFieldGroupsByFilterFacetsAnnotation(this.sEntityType);

			// Get the SemanticFields annotation
			oSelectionFields = this._oMetadataAnalyser.getSelectionFieldsAnnotation(this.sEntityType);
			if (oSelectionFields && oSelectionFields.selectionFields) {
				this._aSelectionFields = oSelectionFields.selectionFields;
			}

			// Create groups based on FieldGroup annotation
			if (this._aFieldGroupAnnotation) {
				iGroupLen = this._aFieldGroupAnnotation.length;
				for (i = 0; i < iGroupLen; i++) {
					// Create metadata for group
					oODataFilterGroup = this._aFieldGroupAnnotation[i];
					oGroupMetadata = this._createGroupMetadata(oODataFilterGroup);
					oGroupMetadata.index = this._aFilterBarViewMetadata.length; // Set the index to maintain the order
					this._aFilterBarViewMetadata.push(oGroupMetadata);
				}
			}

			// Create groups and fields based on entity metadata
			iGroupLen = aODataFilterGroups.length;
			for (i = 0; i < iGroupLen; i++) {
				// Create metadata for group
				oODataFilterGroup = aODataFilterGroups[i];
				iFieldLen = oODataFilterGroup.fields.length;
				oGroupMetadata = this._createGroupMetadata(oODataFilterGroup);
				this._aFilterBarViewMetadata.push(oGroupMetadata);

				// Create metadata for fields
				for (j = 0; j < iFieldLen; j++) {
					oODataFilterField = oODataFilterGroup.fields[j];
					// Check if field is not a Primitive type --> only generate metadata for primitive/simple type fields
					if (oODataFilterField.type.indexOf("Edm.") === 0) {
						oFieldMetadata = this._createFieldMetadata(oODataFilterField);
						oGroupMetadata.fields.push(oFieldMetadata);
						this._aFilterBarFieldNames.push(oFieldMetadata.fieldName);
					}
				}
			}
		}

		// custom groups
		aCustomGroup = this._getAdditionalConfigurationForCustomGroups(aODataFilterGroups);
		iGroupLen = aCustomGroup.length;
		for (j = 0; j < iGroupLen; j++) {
			oGroupMetadata = this._createGroupMetadataForCustomGroup(aCustomGroup[j]);
			if (oGroupMetadata) {
				this._aFilterBarViewMetadata.push(oGroupMetadata);
			}
		}

		// custom filter fields
		aCustomFilterField = this._getAdditionalConfigurationForCustomFilterFields();
		iFieldLen = aCustomFilterField.length;
		for (j = 0; j < iFieldLen; j++) {
			oFieldMetadata = this._createFieldMetadataForCustomFilterFields(aCustomFilterField[j]);
			if (oFieldMetadata) {
				this._aFilterBarViewMetadata[0].fields.push(oFieldMetadata);
			}
		}

		// Basic search
		if (this._hasBasicSearch()) {
			oFieldMetadata = this._createBasicSearchFieldMetadata();
			this._aFilterBarViewMetadata[0].fields.push(oFieldMetadata);
		}

		// parameters
		if (this._bConsiderAnalyticalParameters) {
			this._createAnalyticalParameters();
		}

		// Selection Variants
		if (this._bConsiderSelectionVariants) {
			this._createSelectionVariants();
		}

		this._applyGroupId();
		this._applyIndexes();
		this._createInitialModel(true);
		this._initializeConditionTypeFields();
		this.setPending(this.isPending());
	};

	FilterProvider.prototype._createSelectionVariants = function() {
		// Get the SelectionVariant annotation
		this._aSelectionVariants = this._oMetadataAnalyser.getSelectionVariantAnnotation(this.sEntityType);
	};

	FilterProvider.prototype._createAnalyticalParameters = function() {
		var o4AnaModel;

		if (this._oMetadataAnalyser.isSemanticAggregation(this.sEntityType)) {

			jQuery.sap.require("sap.ui.model.analytics.odata4analytics");
			try {
				o4AnaModel = new sap.ui.model.analytics.odata4analytics.Model(new sap.ui.model.analytics.odata4analytics.Model.ReferenceByModel(this._oParentODataModel));
			} catch (e) {
				throw "Failed to instantiate analytical extensions for given OData model: " + e.message;
			}

			// Will find the necessary entry point to work with the parameter set
			var oQueryResult = o4AnaModel && o4AnaModel.findQueryResultByName(this.sEntitySet);
			this._oParameterization = oQueryResult && oQueryResult.getParameterization();

			this._createAnalyticParameters(this._oParameterization);
		}

	};

	FilterProvider.prototype.attachPendingChange = function(fn) {
		if (!this._oEventProvider) {
			this._oEventProvider = new EventProvider();
		}
		this._oEventProvider.attachEvent("PendingChange", fn);
	};

	FilterProvider.prototype.detachPendingChange = function(fn) {
		if (this._oEventProvider) {
			this._oEventProvider.detachEvent("PendingChange", fn);
		}
	};

	FilterProvider.prototype.setPending = function(bValue) {
		var bChanged = this._bPending !== bValue;
		this._bPending = bValue;
		if (bChanged && this._oEventProvider) {
			var mParameters = {};
			mParameters.pending = bValue;
			this._oEventProvider.fireEvent("PendingChange", mParameters);
		}
	};

	FilterProvider.prototype.isPending = function() {
		if (!this._bInitialized) {
			return true;
		}
		for ( var n in this._mConditionTypeFields) {
			if (this._mConditionTypeFields[n].conditionType.isPending()) {
				return true;
			}
		}
		return false;
	};

	/**
	 * Updates the displayBehaviour from TextArrangment annotation, if necessary
	 * @private
	 */
	FilterProvider.prototype._updateDisplayBehaviour = function() {
		this._sTextArrangementDisplayBehaviour = this._oMetadataAnalyser.getTextArrangementValue(this.sEntityType);
		if (!this.sDefaultDropDownDisplayBehaviour) {
			if (this._sTextArrangementDisplayBehaviour) {
				this.sDefaultDropDownDisplayBehaviour = this._sTextArrangementDisplayBehaviour;
			} else {
				this.sDefaultDropDownDisplayBehaviour = sap.ui.comp.smartfilterbar.DisplayBehaviour.descriptionOnly;
			}
		}
		if (!this.sDefaultTokenDisplayBehaviour) {
			if (this._sTextArrangementDisplayBehaviour) {
				this.sDefaultTokenDisplayBehaviour = this._sTextArrangementDisplayBehaviour;
			} else {
				this.sDefaultTokenDisplayBehaviour = sap.ui.comp.smartfilterbar.DisplayBehaviour.descriptionAndId;
			}
		}
	};

	/**
	 * Returns a flag indicating whether a field for the basic search shall be rendered or not
	 * @returns {boolean} Flag
	 * @private
	 */
	FilterProvider.prototype._hasBasicSearch = function() {
		return this._isBasicSearchEnabled;
	};

	/**
	 * Looks for custom filter fields from the additional configuration which have a name which is not known in the ODATA metadata
	 * @returns {Array} Array containing the the control configuration of the additional filter fields
	 * @private
	 */
	FilterProvider.prototype._getAdditionalConfigurationForCustomFilterFields = function() {
		var aControlConfiguration, length, i, aResult;

		// get additional control configuration
		if (!this._oAdditionalConfiguration) {
			return [];
		}
		aControlConfiguration = this._oAdditionalConfiguration.getControlConfiguration();

		// check if fields from OData metadata exist
		if (!this._aFilterBarFieldNames || !this._aFilterBarFieldNames.length) {
			return aControlConfiguration;
		}

		aResult = [];
		length = aControlConfiguration.length;
		for (i = 0; i < length; i++) {
			// filter field for control configuration could not be found in OData metadata...this is a custom filter field!
			if (this._aFilterBarFieldNames.indexOf(aControlConfiguration[i].key) < 0) {
				aResult.push(aControlConfiguration[i]);
			}
		}
		return aResult;
	};

	/**
	 * Looks for custom groups from the additional configuration which have a name which is not known in the ODATA metadata
	 * @param {object} aODataFilterGroups - groups from the ODATA metadata
	 * @returns {Array} Array containing the the group configuration of the custom groups
	 * @private
	 */
	FilterProvider.prototype._getAdditionalConfigurationForCustomGroups = function(aODataFilterGroups) {
		var aGroupConfiguration, length, nODataGroupsLength, i, aResult, j, bFound, sGroupName;

		// get additional group configuration
		if (!this._oAdditionalConfiguration) {
			return [];
		}
		aGroupConfiguration = this._oAdditionalConfiguration.getGroupConfiguration();

		// get groups from OData metadata
		if (!aODataFilterGroups || !aODataFilterGroups.length) {
			return aGroupConfiguration;
		}

		aResult = [];
		nODataGroupsLength = aODataFilterGroups.length;
		length = aGroupConfiguration.length;
		for (i = 0; i < length; i++) {
			bFound = false;
			for (j = 0; j < nODataGroupsLength; j++) {
				sGroupName = aODataFilterGroups[j].groupName || aODataFilterGroups[j].groupEntityName;
				if (sGroupName === aGroupConfiguration[i].key) {
					bFound = true;
					break;
				}
			}
			if (!bFound) { // group from group configuration could not be found in OData metadata...this is a custom group!
				aResult.push(aGroupConfiguration[i]);
			}
		}

		return aResult;
	};

	/**
	 * Initialises the necessary filter metadata and model
	 * @param {object} oJSONData - The JSON data from the model
	 * @param {object} oFilterFieldMetadata - The metadata for the filter field
	 * @param {boolean} bUseDefaultValues - whether default values from configuration shall be used
	 * @private
	 */
	FilterProvider.prototype._createInitialModelForField = function(oJSONData, oFilterFieldMetadata, bUseDefaultValues) {
		var bIsDateTimeType = false, aDefaultFilterValues, oDefaultFilterValue, bHasDefaultFilterValue = false, bIsRangeField = false, sLowValue = null, sHighValue = null, iLength, oItem = null, aItems = [], aRanges = [];
		// Model will no be created for custom filter fields..
		if (!oFilterFieldMetadata || oFilterFieldMetadata.isCustomFilterField) {
			return;
		}
		if (oFilterFieldMetadata.filterRestriction !== sap.ui.comp.smartfilterbar.FilterType.multiple) {
			bIsRangeField = true;
		}

		if ((oFilterFieldMetadata.filterType === "date") || (oFilterFieldMetadata.filterType === "time")) {
			bIsDateTimeType = true;
		}

		if (bUseDefaultValues) {
			// Get the array of default filter values
			aDefaultFilterValues = oFilterFieldMetadata.defaultFilterValues;
			bHasDefaultFilterValue = aDefaultFilterValues && aDefaultFilterValues.length;

			if (!bHasDefaultFilterValue && oFilterFieldMetadata.defaultFilterValue || oFilterFieldMetadata.defaultPropertyValue) {

				if (oFilterFieldMetadata.isParameter) {
					aDefaultFilterValues = [
						{
							low: oFilterFieldMetadata.defaultPropertyValue
						}
					];
				} else {
					aDefaultFilterValues = [
						{
							low: oFilterFieldMetadata.defaultFilterValue,
							high: oFilterFieldMetadata.defaultFilterValue,
							operator: "EQ",
							sign: "I"
						}
					];
				}
				bHasDefaultFilterValue = true;
			}

		}
		if (oFilterFieldMetadata.filterRestriction === sap.ui.comp.smartfilterbar.FilterType.single) {
			// If there is a default filter value use only the low value of 1st one --> single filter scenario!
			if (bHasDefaultFilterValue) {
				oDefaultFilterValue = aDefaultFilterValues[0];
				sLowValue = bIsDateTimeType ? this._createDateTimeValue(oFilterFieldMetadata, oDefaultFilterValue.low) : oDefaultFilterValue.low;
			}

			oJSONData[oFilterFieldMetadata.fieldName] = sLowValue;

		} else if (oFilterFieldMetadata.filterRestriction === sap.ui.comp.smartfilterbar.FilterType.interval && oFilterFieldMetadata.type !== "Edm.Time") {
			// If there is a default filter value use both low and high, but only of the 1st one --> interval filter scenario!
			if (bHasDefaultFilterValue) {
				oDefaultFilterValue = aDefaultFilterValues[0];
				sLowValue = bIsDateTimeType ? this._createDateTimeValue(oFilterFieldMetadata, oDefaultFilterValue.low) : oDefaultFilterValue.low;
				sHighValue = bIsDateTimeType ? this._createDateTimeValue(oFilterFieldMetadata, oDefaultFilterValue.high) : oDefaultFilterValue.high;
			}

			oJSONData[oFilterFieldMetadata.fieldName] = {
				low: sLowValue,
				high: sHighValue
			};
		} else {
			// If there is a default filter value use all the low values as keys --> multiple/range
			if (bHasDefaultFilterValue) {
				iLength = aDefaultFilterValues.length;
				while (iLength--) {
					oDefaultFilterValue = aDefaultFilterValues[iLength];
					if (bIsRangeField) {
						oItem = {
							"exclude": oDefaultFilterValue.sign === "E",
							// Convert "CP" from Configuration to "Contains"
							"operation": oDefaultFilterValue.operator === "CP" ? "Contains" : oDefaultFilterValue.operator,
							"keyField": oFilterFieldMetadata.fieldName,
							"value1": bIsDateTimeType ? this._createDateTimeValue(oFilterFieldMetadata, oDefaultFilterValue.low) : oDefaultFilterValue.low,
							"value2": bIsDateTimeType ? "" : oDefaultFilterValue.high
						};

						if ((oFilterFieldMetadata.filterType === "time") && oDefaultFilterValue.high) {
							oItem.value2 = new Date(oDefaultFilterValue.high);
						}

					} else {
						oItem = {
							key: bIsDateTimeType ? this._createDateTimeValue(oFilterFieldMetadata, oDefaultFilterValue.low) : oDefaultFilterValue.low,
							text: bIsDateTimeType ? "" : oDefaultFilterValue.low
						};
					}

					aItems.push(oItem);
				}
			}
			// Add this to the local multi-value field array
			this._aFilterBarMultiValueFieldMetadata.push(oFilterFieldMetadata);
			// Update the model
			oJSONData[oFilterFieldMetadata.fieldName] = {
				value: null
			};
			if (bIsRangeField) {
				aRanges = aItems.slice(0);
				aItems = [];
				oJSONData[oFilterFieldMetadata.fieldName].ranges = aRanges;
			}
			oJSONData[oFilterFieldMetadata.fieldName].items = aItems;

			// Update the corresponding control with array value
			this._updateMultiValueControl(oFilterFieldMetadata.control, aItems, aRanges);
		}
	};

	FilterProvider.prototype._createDateTimeValue = function(oFilterFieldMetadata, sValue) {

		if ((oFilterFieldMetadata.type === "Edm.Time") && (sValue.indexOf("PT") === 0)) {
			return this._getTime(sValue);
		} else {
			return new Date(sValue);
		}

	};

	/**
	 * Initialises the JSON model for filter fields
	 * @param {boolean} bUseDefaultValues - whether default values from configuration shall be used
	 * @private
	 */
	FilterProvider.prototype._createInitialModel = function(bUseDefaultValues) {
		var oJSONData, iGroupLength, iFieldLength, oGroup, j, i;
		oJSONData = {};
		this._bCreatingInitialModel = true;
		// This will now be recreated if required
		this._aFilterBarMultiValueFieldMetadata = [];
		if (this._aFilterBarViewMetadata) {
			iGroupLength = this._aFilterBarViewMetadata.length;
			for (i = 0; i < iGroupLength; i++) {
				oGroup = this._aFilterBarViewMetadata[i];
				iFieldLength = oGroup.fields.length;
				for (j = 0; j < iFieldLength; j++) {
					this._createInitialModelForField(oJSONData, oGroup.fields[j], bUseDefaultValues);
				}
			}
		}

		// set the initial model for analytical parameters
		if (this._aAnalyticalParameters) {
			iFieldLength = this._aAnalyticalParameters.length;
			for (j = 0; j < iFieldLength; j++) {
				this._createInitialModelForField(oJSONData, this._aAnalyticalParameters[j], bUseDefaultValues);
			}
		}

		this.oModel.setData(oJSONData);
		if (!bUseDefaultValues) {
			this._clearConditionTypeFields();
		}
		this._updateConditionTypeFields();
		this._bCreatingInitialModel = false;
	};

	/**
	 * Updates the multi-value control with initial/filter data
	 * @param {Object} oControl - the control to be updated
	 * @param {Array} aItems = the array of key, text values to be set in the control
	 * @param {Array} aRanges = the array of range values to be set in the control
	 * @param {Object} oFilterFieldMetadata = filter field metadata
	 * @private
	 */
	FilterProvider.prototype._updateMultiValueControl = function(oControl, aItems, aRanges, oFilterFieldMetadata) {
		var i = 0, aTokens = null, oToken = null, oRange = null, sText = null, aKeys = null, value1, value2, oType;
		// MultiComboBox and MultiInput fields cannot be bound, since the tokens are created internally and do not support 2 way binding
		// In case the model is reset/set initially, set the tokens manually through this
		if (oControl && aItems) {
			i = aItems.length;
			if (oControl instanceof MultiInput) {
				aTokens = [];
				while (i--) {
					sText = aItems[i].text || aItems[i].key;
					aTokens.push(new Token({
						key: aItems[i].key,
						text: sText,
						tooltip: sText
					}));
				}
				if (aRanges) {
					i = aRanges.length;
					while (i--) {
						oRange = aRanges[i];
						if (oRange.tokenText) {
							sText = oRange.tokenText;
						} else {
							value1 = oRange.value1;
							value2 = oRange.value2;
							if (oFilterFieldMetadata) {

								if ((oFilterFieldMetadata.filterType === "date") || (oFilterFieldMetadata.filterType === "datetime") || (oFilterFieldMetadata.filterType === "time")) {
									if (value1 && typeof value1 === "string") {
										value1 = new Date(value1);
									}
									if (value2 && typeof value2 === "string") {
										value2 = new Date(value2);
									}
								}

								if ((value1 instanceof Date) || (value2 instanceof Date)) {
									oType = this._getType(oFilterFieldMetadata);
									if (value1) {
										value1 = oType.formatValue(value1, "string");
									}
									if (value2) {
										value2 = oType.formatValue(value2, "string");
									}
								}
							}

							sText = FormatUtil.getFormattedRangeText(oRange.operation, value1, value2, oRange.exclude);
						}
						oToken = new Token({
							text: sText,
							tooltip: sText
						});
						oToken.data("range", oRange);
						aTokens.push(oToken);
					}
				}
				oControl.setTokens(aTokens);
// oControl.fireTokenChange({
// type: "tokensChanged"
// });
			}
			if (oControl instanceof MultiComboBox) {
				aKeys = [];
				while (i--) {
					aKeys.push(aItems[i].key);
				}
				oControl.setSelectedKeys(aKeys);
			}
		}
	};

	/**
	 * Updates the view metadata by applying index of groups and fields from the additional configuration.
	 * @private
	 */
	FilterProvider.prototype._applyIndexes = function() {
		var groupLength, i;

		if (!this._aFilterBarViewMetadata) {
			return;
		}

		// sort groups by index
		this._aFilterBarViewMetadata = this._sortByIndex(this._aFilterBarViewMetadata);

		groupLength = this._aFilterBarViewMetadata.length;
		for (i = 0; i < groupLength; i++) {
			// sort fields of a group by index
			if (this._aFilterBarViewMetadata[i].fields) {
				this._aFilterBarViewMetadata[i].fields = this._sortByIndex(this._aFilterBarViewMetadata[i].fields);
			}
		}
	};

	/**
	 * Returns a new Array containing all Elements from the incoming Array and the order was changed considering the indexes
	 * @param {Array} aArray - Array of objects having an index property
	 * @returns {Array} sorted array
	 * @private
	 */
	FilterProvider.prototype._sortByIndex = function(aArray) {
		var aFieldsHavingAnIndex, i, length, aResult, iIndex, oField;
		if (!aArray || !aArray.length) {
			return aArray;
		}
		aResult = [];
		aFieldsHavingAnIndex = [];
		length = aArray.length;
		for (i = 0; i < length; i++) {
			oField = aArray[i];
			iIndex = oField.index;
			if (iIndex >= 0) {
				aFieldsHavingAnIndex.push(oField);
			} else {
				aResult.push(oField); // add fields having no index to result...
			}
		}
		length = aFieldsHavingAnIndex.length;
		if (length) {
			// Sort fields having an index
			aFieldsHavingAnIndex = aFieldsHavingAnIndex.sort(function(field1, field2) {
				return field1.index - field2.index;
			});
			// Check if fields without index exist, if not, use the sorted indexed fields array as result
			if (!aResult.length) {
				aResult = aFieldsHavingAnIndex;
			} else {
				// add fields having an index at the right location (if possible) in result array
				for (i = 0; i < length; i++) {
					oField = aFieldsHavingAnIndex[i];
					if (oField.index >= aResult.length) {
						aResult.push(oField);
					} else {
						aResult.splice(oField.index, 0, oField);
					}
				}
			}
		}
		return aResult;
	};

	/**
	 * Updates the view metadata by applying the groupId from the additional configuration.
	 * @private
	 */
	FilterProvider.prototype._applyGroupId = function() {
		var groupLength, i, fieldLength, j, oField, oNewParentGroup, k;
		groupLength = this._aFilterBarViewMetadata.length;

		for (i = 0; i < groupLength; i++) {
			if (!this._aFilterBarViewMetadata[i].fields) { // if there are no fields...
				continue;
			}
			fieldLength = this._aFilterBarViewMetadata[i].fields.length;
			for (j = 0; j < fieldLength; j++) {
				oField = this._aFilterBarViewMetadata[i].fields[j];
				if (oField && oField.groupId && oField.groupId !== this._aFilterBarViewMetadata[i].groupName) {
					// Find new parent group
					oNewParentGroup = undefined;
					for (k = 0; k < groupLength; k++) {
						if (this._aFilterBarViewMetadata[k].groupName === oField.groupId) {
							oNewParentGroup = this._aFilterBarViewMetadata[k];
							break;
						}
					}

					// Move field to new parent group
					if (oNewParentGroup) {
						this._aFilterBarViewMetadata[i].fields.splice(j, 1);
						j--;
						fieldLength--;
						oNewParentGroup.fields = oNewParentGroup.fields || [];
						oNewParentGroup.fields.push(oField);
					}
				}
			}
		}
	};

	/**
	 * Creates an id for a filter control based on its field view metadata.
	 * @param {Object} oFieldViewMetadata - resolved filter view data with OData metadata and control configuration
	 * @returns {String} Id of a control used inside the SmartFilterBar
	 * @private
	 */
	FilterProvider.prototype._createFilterControlId = function(oFieldViewMetadata) {
		var sFilterBarName = this._oSmartFilter.getId();
		var sGroupId = IdentifierUtil.replace(oFieldViewMetadata.groupId || "");
		var sName = IdentifierUtil.replace(oFieldViewMetadata.fieldName);

		return sFilterBarName + "-filterItemControl" + sGroupId + "-" + sName;
	};

	/**
	 * Creates a group based on the OData metadata
	 * @private
	 * @param {object} oODataFilterBarGroup - OData metadata for group
	 * @returns {object} view metadata for group
	 */
	FilterProvider.prototype._createGroupMetadata = function(oODataFilterBarGroup) {
		var oGroupMetadata, oGroupConfiguration, sGroupName;

		sGroupName = oODataFilterBarGroup.groupName || oODataFilterBarGroup.groupEntityName;
		// Get additional configuration for groups
		oGroupConfiguration = this._oAdditionalConfiguration.getGroupConfigurationByKey(sGroupName);

		oGroupMetadata = {};
		oGroupMetadata.groupName = sGroupName;
		oGroupMetadata.groupLabel = this._getGroupLabel(oODataFilterBarGroup, oGroupConfiguration); // if label is specified in additional
		// configuration,
		// pick this
		// one
		oGroupMetadata.fields = [];
		oGroupMetadata.index = this._getGroupIndex(oGroupConfiguration);

		return oGroupMetadata;
	};

	/**
	 * Creates a group based on the additional configuration (GroupConfiguration)
	 * @private
	 * @param {object} oGroupConfiguration - OData metadata for group
	 * @returns {object} view metadata for group
	 */
	FilterProvider.prototype._createGroupMetadataForCustomGroup = function(oGroupConfiguration) {
		var oGroupMetadata;

		oGroupMetadata = {};
		oGroupMetadata.groupName = oGroupConfiguration.key;
		oGroupMetadata.groupLabel = oGroupConfiguration.label;
		// one
		oGroupMetadata.fields = [];
		oGroupMetadata.index = this._getGroupIndex(oGroupConfiguration);

		return oGroupMetadata;
	};

	FilterProvider.prototype._getTime = function(sValue) {
		var oFormat = DateFormat.getTimeInstance({
			pattern: "'PT'hh'H'mm'M'ss'S'"
		});

		return oFormat.parse(sValue);
	};

	FilterProvider.prototype._checkMetadataDefaultValue = function(oFieldViewMetadata) {
		var oType, sDefaultValue = oFieldViewMetadata.defaultFilterValue || oFieldViewMetadata.defaultPropertyValue;

		if (sDefaultValue) {

			try {
				if ((oFieldViewMetadata.type === "Edm.Time") && (sDefaultValue.indexOf("PT") === 0)) {
					this._getTime(sDefaultValue);
				} else {
					oType = this._getType(oFieldViewMetadata);
					oType.parseValue(sDefaultValue, "string");
				}

			} catch (ex) {
				oFieldViewMetadata.defaultPropertyValue = null;
				oFieldViewMetadata.defaultFilterValue = null;
				jQuery.sap.log.error("default value for " + oFieldViewMetadata.fieldName + " could not be parsed.");
			}
		}
	};

	FilterProvider.prototype._getType = function(oFieldViewMetadata) {
		var oType, oFormatOptions = {}, oConstraints = {};

		// Set constraints from metadata
		if (oFieldViewMetadata.precision || oFieldViewMetadata.scale) {
			oConstraints.precision = oFieldViewMetadata.precision;
			oConstraints.scale = oFieldViewMetadata.scale;
		}
		if (oFieldViewMetadata.maxLength) {
			oConstraints.maxLength = oFieldViewMetadata.maxLength;
		}
		if (oFieldViewMetadata.displayFormat) {
			oConstraints.displayFormat = oFieldViewMetadata.displayFormat;
		}

		// Set Format options from metadata (only for date type for now)
		if (oFieldViewMetadata.fControlConstructor === DateRangeSelection || oFieldViewMetadata.fControlConstructor === DatePicker || oFieldViewMetadata.type === "Edm.DateTimeOffset") {
			oFormatOptions = jQuery.extend({}, this._oDateFormatSettings, {
				UTC: false
			});
		}

		oType = ODataType.getType(oFieldViewMetadata.type, oFormatOptions, oConstraints);

		return oType;
	};

	/**
	 * Creates the control instance based on the OData Metadata and additional configuration
	 * @param {Object} oFieldViewMetadata - resolved filter view data with OData metadata and control configuration
	 * @returns {Object} an instance of the control to be used in the SmartFilterBar
	 * @private
	 */
	FilterProvider.prototype._createControl = function(oFieldViewMetadata) {
		var oControl, oType, bIsInterval = false, iMaxLength, fClearModel;

		// if a custom control is specified, use it
		if (oFieldViewMetadata.customControl) {
			return oFieldViewMetadata.customControl;
		}

		oType = this._getType(oFieldViewMetadata);

		oControl = new oFieldViewMetadata.fControlConstructor(this._createFilterControlId(oFieldViewMetadata));
		if (oFieldViewMetadata.fControlConstructor === DateRangeSelection) {
			oControl.bindProperty('dateValue', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/low");
			oControl.bindProperty('secondDateValue', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/high");
		} else if ((oFieldViewMetadata.fControlConstructor === ComboBox) || (oFieldViewMetadata.fControlConstructor === Select)) {
			if (oControl.setForceSelection) {
				oControl.setForceSelection(true);
			}
			if (oFieldViewMetadata.fControlConstructor === Select) {
				oControl.addItem(new Item({
					key: "",
					text: ""
				}));
				oControl.addItem(new Item({
					key: false,
					text: oType.formatValue(false, "string")
				}));
				oControl.addItem(new Item({
					key: true,
					text: oType.formatValue(true, "string")
				}));

			} else {
				this._associateValueList(oControl, "items", oFieldViewMetadata);

				// Listen to the selection change and update the model accordingly
				oControl.attachSelectionChange(function() {
					// Do nothing while the data is being created/updated!
					if (this._bUpdatingFilterData || this._bCreatingInitialModel) {
						return;
					}
					// Manually trigger the change event on sapUI5 control since it doesn't do this internally on selectionChange!
					oControl.fireChange({
						filterChangeReason: oFieldViewMetadata.fieldName,
						value: ""
					});
				}.bind(this));
			}

			oControl.bindProperty('selectedKey', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName);
		} else if (oFieldViewMetadata.fControlConstructor === MultiComboBox) {
			this._associateValueList(oControl, "items", oFieldViewMetadata);
			// Listen to the selection change and update the model accordingly
			oControl.attachSelectionChange(function(oEvt) {
				// Do nothing while the data is being created/updated!
				if (this._bUpdatingFilterData || this._bCreatingInitialModel) {
					return;
				}
				var oCtrl = oEvt.getSource(), aSelectedItems = null, aKeys = [], iLength;
				aSelectedItems = oCtrl.getSelectedItems();
				if (aSelectedItems) {
					iLength = aSelectedItems.length;
					while (iLength--) {
						aKeys.push({
							key: aSelectedItems[iLength].getKey(),
							text: aSelectedItems[iLength].getText()
						});
					}
				}
				if (this.oModel) {
					this.oModel.setProperty("/" + oFieldViewMetadata.fieldName + "/items", aKeys);
				}
				// Manually trigger the change event on sapUI5 control since it doesn't do this internally on selectionChange!
				oCtrl.fireChange({
					filterChangeReason: oFieldViewMetadata.fieldName,
					value: ""
				});
			}.bind(this));
			oControl.bindProperty('value', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/value");
		} else if (oFieldViewMetadata.fControlConstructor === MultiInput) {
			if (oFieldViewMetadata.controlType === sap.ui.comp.smartfilterbar.ControlType.date || oFieldViewMetadata.type === "Edm.Time") {
				oControl.setValueHelpOnly(true);
				if (oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.FilterType.interval) {
					this._associateValueHelpDialog(oControl, oFieldViewMetadata, false, false);
				} else {
					this._associateValueHelpDialog(oControl, oFieldViewMetadata, true, true);
				}
			} else {
				if (oFieldViewMetadata.hasValueHelpDialog) {
					this._associateValueHelpDialog(oControl, oFieldViewMetadata, oFieldViewMetadata.filterRestriction !== sap.ui.comp.smartfilterbar.FilterType.multiple, true);
				} else {
					oControl.setShowValueHelp(false);
				}
				oControl.bindProperty('value', {
					path: this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/value",
					type: oType
				});
			}
			this._handleMultiInput(oControl, oFieldViewMetadata, oType);
		} else if (oFieldViewMetadata.fControlConstructor === Input) {
			if (oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.FilterType.interval) {
				bIsInterval = true;
				// we assume the interval values shall be split by "-"; so bind only to low and resolve this later while creating the filters
				oControl.bindProperty('value', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/low");
				if (!this.oResourceBundle) {
					this.oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
				}
				if (!this.sIntervalPlaceholder) {
					this.sIntervalPlaceholder = this.oResourceBundle.getText("INTERVAL_PLACEHOLDER_TEXT");
				}
				oControl.setPlaceholder(this.sIntervalPlaceholder);
			} else {
				oControl.bindProperty('value', {
					path: this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName,
					type: oType
				});
			}
			if (oFieldViewMetadata.hasValueHelpDialog) {
				oControl.setShowValueHelp(true);
				this._associateValueHelpDialog(oControl, oFieldViewMetadata, false, false);
			}
		} else if (oFieldViewMetadata.fControlConstructor === DatePicker || oFieldViewMetadata.fControlConstructor === TimePicker) {
			oControl.bindProperty('dateValue', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName);
		}

		if (oControl instanceof DatePicker) {
			if (this._oDateFormatSettings && this._oDateFormatSettings.style) {
				oControl.setDisplayFormat(this._oDateFormatSettings.style);
			}
			// Error handling for DatePicker controls!
			oControl.attachChange(function(oEvent) {
				var bValid = oEvent.getParameter("valid");
				// Clear mandatory empty error state flag
				oControl.data("__mandatoryEmpty", null);
				if (bValid) {
					// If value is valid clear value state
					oControl.setValueState(sap.ui.core.ValueState.None);
					oControl.setValueStateText();
				} else {
					// If value is invalid set value state as error
					oControl.setValueState(sap.ui.core.ValueState.Error);
					// Show the exception message from OData DateTime type by parsing a dummy value
					if (oType) {
						try {
							oType.parseValue("foo", "string");
						} catch (oEx) {
							// If value is invalid --> set value state text from exception message
							oControl.setValueStateText(oEx.message);
						}
					}
				}
			});
		}

		if (oFieldViewMetadata.hasTypeAhead) {
			oControl.setShowSuggestion(true);
			oControl.setFilterSuggests(false);
			this._associateValueList(oControl, "suggestionRows", oFieldViewMetadata, true);
		}

		// Convert typed in values to UpperCase for displayFormat = UpperCase
		if (oFieldViewMetadata.displayFormat === "UpperCase" && oControl.attachChange && oControl.getValue && oControl.setValue) {
			oControl.attachChange(function() {
				var sValue = oControl.getValue();
				if (sValue) {
					oControl.setValue(sValue.toUpperCase());
				}
			});

			if (this._mTokenHandler[oControl.getId()] && this._mTokenHandler[oControl.getId()].parser) {
				var oTokenParser = this._mTokenHandler[oControl.getId()].parser;
				oTokenParser.setDisplayFormat(oFieldViewMetadata.displayFormat); // "UpperCase"
			}
		}

		// Additional handling for Input and MultiInput
		if (oControl instanceof Input) {
			// Set MaxLength for fields without any ValueListAnnotation or non intervals!
			if (!oFieldViewMetadata.hasValueListAnnotation && !bIsInterval && oFieldViewMetadata.maxLength) {
				iMaxLength = parseInt(oFieldViewMetadata.maxLength, 10);
				if (!isNaN(iMaxLength)) {
					if (this._mTokenHandler[oControl.getId()] && this._mTokenHandler[oControl.getId()].parser) {
						var oTokenParser = this._mTokenHandler[oControl.getId()].parser;
						oTokenParser.setMaxLength(iMaxLength);
					} else {
						oControl.setMaxLength(iMaxLength);
					}
				}
			}
		}

		// Special handling when users clears the value or enters an invalid one
		fClearModel = function(oEvent) {
			var oException = oEvent.getParameter("exception");
			if (oControl) {
				if (oException) {
					if (oControl.setValueStateText) {
						oControl.setValueStateText(oException.message);
					}
				}
				if (oControl.setValueState) {
					oControl.setValueState(sap.ui.core.ValueState.Error);
				}
				// Clear mandatory empty error state flag
				oControl.data("__mandatoryEmpty", null);
			}
		};
		oControl.attachParseError(fClearModel);
		oControl.attachFormatError(fClearModel);
		oControl.attachValidationError(fClearModel);
		oControl.attachValidationSuccess(function(oEvent) {
			if (oControl) {
				if (oControl.setValueState) {
					oControl.setValueState(sap.ui.core.ValueState.None);
				}
				if (oControl.setValueStateText) {
					oControl.setValueStateText();
				}
				// Clear mandatory empty error state flag
				oControl.data("__mandatoryEmpty", null);
				// Clear the ValidationText set during validation request
				delete oControl.__sValidationText;
			}
		});

		return oControl;
	};

	/**
	 * Creates the control instance based on the OData Metadata and additional configuration
	 * @param {Object} oFieldViewMetadata - view metadata for the filter field
	 * @returns {function} the constructor function of the control
	 * @private
	 */
	FilterProvider.prototype._getControlConstructor = function(oFieldViewMetadata, sParamPrefix) {
		// default to input
		var fControlConstructor = Input, bFilterRestrictionSingle, bFilterRestrictionInterval, sPrefixedFieldName;

		sPrefixedFieldName = sParamPrefix ? sParamPrefix + oFieldViewMetadata.fieldName : oFieldViewMetadata.fieldName;

		// if a custom control is specified, use it
		if (oFieldViewMetadata.isCustomFilterField) {
			fControlConstructor = undefined;
		} else {
			bFilterRestrictionSingle = (oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.FilterType.single);
			bFilterRestrictionInterval = (oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.FilterType.interval);

			if (oFieldViewMetadata.controlType === sap.ui.comp.smartfilterbar.ControlType.date) {
				// If Date controls are being used --> force the displayFormat to be Date
				oFieldViewMetadata.displayFormat = "Date";
				if (bFilterRestrictionSingle) {
					fControlConstructor = DatePicker;
				} else {
					fControlConstructor = bFilterRestrictionInterval ? DateRangeSelection : MultiInput;
				}
				this._aFilterBarDateFieldNames.push(sPrefixedFieldName); // Date fields need special handling to always store Date objects
				if (oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.FilterType.multiple) {
					this._aFilterBarDateTimeMultiValueFieldNames.push(sPrefixedFieldName);
				}
			} else if (oFieldViewMetadata.controlType === sap.ui.comp.smartfilterbar.ControlType.dropDownList) {
				if (bFilterRestrictionSingle) {
					fControlConstructor = this._isBooleanWithFixedValuedButWithoutValueListAnnotation(oFieldViewMetadata) ? Select : ComboBox;
				} else {
					fControlConstructor = MultiComboBox;
				}

				// Filter Restriction is defaulted to auto, reset it to multiple if it is a MultiComboBox
				if (!bFilterRestrictionSingle) {
					oFieldViewMetadata.filterRestriction = sap.ui.comp.smartfilterbar.FilterType.multiple;
				}
			} else if (oFieldViewMetadata.type === "Edm.Time") {
				if (bFilterRestrictionSingle) {
					fControlConstructor = TimePicker;
				} else {
					fControlConstructor = MultiInput;
				}
				this._aFilterBarTimeFieldNames.push(sPrefixedFieldName); // Time fields need special handling to send back time values
				if (bFilterRestrictionInterval) {
					this._aFilterBarTimeIntervalFieldNames.push(sPrefixedFieldName);
				} else if (oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.FilterType.multiple) {
					this._aFilterBarDateTimeMultiValueFieldNames.push(sPrefixedFieldName);
				}
			} else if (!bFilterRestrictionSingle && !bFilterRestrictionInterval) {
				fControlConstructor = MultiInput;
			}
		}
		return fControlConstructor;
	};

	/**
	 * handles MultiInput specific changes
	 * @param {object} oControl - The control
	 * @param {object} oFieldViewMetadata - The metadata merged from OData metadata and additional control configuration
	 * @param {object} oType - odata type of the current field
	 * @private
	 */
	FilterProvider.prototype._handleMultiInput = function(oControl, oFieldViewMetadata, oType) {
		oControl.setEnableMultiLineMode(true);
		oControl.attachTokenChange(function(oEvt) {
			// Do nothing while the data is being created/updated -or- if tokensChanged is not the event!
			if (this._bUpdatingFilterData || this._bCreatingInitialModel || (oEvt.getParameter("type") !== "tokensChanged") && (oEvt.getParameter("type") !== "removed")) {
				return;
			}

			var aTokens = oEvt.getSource().getTokens(), aItems = [], iLength, oToken = null, oRangeData = null, aRanges = [];
			if (aTokens) {
				iLength = aTokens.length;
				while (iLength--) {
					oToken = aTokens[iLength];
					oRangeData = oToken.data("range");
					// Check if token is a range token
					if (oRangeData) {
						oRangeData.tokenText = oToken.getText();
						aRanges.push(oRangeData);
					} else {
						// Items array
						aItems.push({
							key: oToken.getKey(),
							text: oToken.getText()
						});
					}
				}
			}
			if (this.oModel) {
				this.oModel.setProperty("/" + oFieldViewMetadata.fieldName + "/items", aItems);
				this.oModel.setProperty("/" + oFieldViewMetadata.fieldName + "/ranges", aRanges);
			}

			// Manually trigger the change event on sapUI5 control since it doesn't do this internally on setValue!
			oControl.fireChange({
				filterChangeReason: oFieldViewMetadata.fieldName,
				value: ""
			});
		}.bind(this));

		var oDateValue, bDateFormat = ((oFieldViewMetadata.type === "Edm.DateTime" && oFieldViewMetadata.displayFormat === "Date"));

		// Copy/Paste for multi values can work property only for String fields
		if (oFieldViewMetadata.hasValueListAnnotation || (oFieldViewMetadata.type === "Edm.String") || bDateFormat) {
			// Handle internal _validateOnPaste event from MultiInput
			oControl.attachEvent("_validateOnPaste", function(oEvent) {
				var aTexts = oEvent.getParameter("texts"), oProperty, iLength, sText, sTokenText, aRanges;
				iLength = aTexts ? aTexts.length : 0;
				// When more than 1 text exists .. directly add it on the Input without any validation!
				if (iLength > 1) {
					// prevent the default behaviour --> (validation will not be done in the MultiInput)
					oEvent.preventDefault();
					// Get relevant property
					oProperty = this.oModel.getProperty("/" + oFieldViewMetadata.fieldName);
					// get existing ranges, if any
					aRanges = oProperty.ranges || [];
					// first clear the value on the MultiInput
					oControl.setValue("");
					// _updateMultiValue uses a reverse while to add tokens; use a reverse while here as well to make the tokens appear in same order
					// as pasted
					while (iLength--) {
						sText = aTexts[iLength];
						if (sText) {
							sTokenText = null;

							if (bDateFormat) {
								oDateValue = this._getDateValue(sText, oType);
								if (isNaN(oDateValue.getDate())) {
									continue;
								} else {
									sTokenText = sText;
									sText = oDateValue;
								}
							}

							// Add text to ranges
							aRanges.push({
								"exclude": false,
								"operation": "EQ",
								"keyField": oFieldViewMetadata.fieldName,
								"value1": sText,
								"value2": null,
								"tokenText": sTokenText

							});
						}
					}
					// Set the updated ranges back to the model
					this.oModel.setProperty("/" + oFieldViewMetadata.fieldName + "/ranges", aRanges);

					// trigger update on the control
					this._updateMultiValueControl(oControl, oProperty.items, aRanges);
				}
			}.bind(this));
		}
	};

	FilterProvider.prototype._getDateValue = function(sValue, oType) {

		var oDate;
		/* eslint-disable no-empty */

		try {
			oDate = oType.parseValue(sValue, "string");
			if (oDate) {
				return oDate;
			}
		} catch (ex) {

		}
		/* eslint-enable no-empty */

		return new Date(sValue);

	};

	/**
	 * Associates the control with a ValueHelp Dialog using the details retrieved from the metadata (annotation)
	 * @param {object} oControl - The control
	 * @param {object} oFieldViewMetadata - The metadata merged from OData metadata and additional control configuration
	 * @param {boolean} bSupportRanges - Specify if the ValueHelpDialog supports ranges
	 * @param {boolean} bSupportMultiselect - Specify if the ValueHelpDialog supports multi select
	 * @private
	 */
	FilterProvider.prototype._associateValueHelpDialog = function(oControl, oFieldViewMetadata, bSupportRanges, bSupportMultiselect) {
		var oValueHelpProvider = new ValueHelpProvider({
			loadAnnotation: oFieldViewMetadata.hasValueListAnnotation,
			fullyQualifiedFieldName: oFieldViewMetadata.fullName,
			metadataAnalyser: this._oMetadataAnalyser,
			control: oControl,
			filterModel: this.oModel,
			filterProvider: this,
			model: this._oParentODataModel,
			preventInitialDataFetchInValueHelpDialog: oFieldViewMetadata.preventInitialDataFetchInValueHelpDialog,
			dateFormatSettings: this._oDateFormatSettings,
			supportMultiSelect: bSupportMultiselect,
			supportRanges: bSupportRanges,
			isUnrestrictedFilter: oFieldViewMetadata.filterRestriction !== sap.ui.comp.smartfilterbar.FilterType.multiple,
			isSingleIntervalRange: oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.FilterType.interval,
			fieldName: oFieldViewMetadata.fieldName,
			type: oFieldViewMetadata.filterType,
			scale: oFieldViewMetadata.scale,
			precision: oFieldViewMetadata.precision,
			maxLength: oFieldViewMetadata.maxLength,
			displayFormat: oFieldViewMetadata.displayFormat,
			displayBehaviour: oFieldViewMetadata.displayBehaviour,
			// title: this._determineFieldLabel(oFieldViewMetadata), //oFieldViewMetadata.label,
			fieldViewMetadata: oFieldViewMetadata
		});

		oValueHelpProvider.attachValueListChanged(function(oEvent) {
			if (this._oSmartFilter) {
				this._oSmartFilter.fireFilterChange(oEvent);
			}
		}.bind(this));

		if (oFieldViewMetadata.visibleInAdvancedArea || (oFieldViewMetadata.groupId === FilterProvider.BASIC_FILTER_AREA_ID)) {
			oValueHelpProvider.loadAnnotation();
		}

		this._aValueHelpDialogProvider.push(oValueHelpProvider);

		if (bSupportRanges && oControl.addValidator) {
			var oTokenParser = new TokenParser();
			oTokenParser.addKeyField({
				key: oFieldViewMetadata.fieldName,
				label: oFieldViewMetadata.label,
				type: oFieldViewMetadata.filterType
			});
			oTokenParser.associateInput(oControl);
			this._mTokenHandler[oControl.getId()] = {
				parser: oTokenParser
			};
		}
	};

	FilterProvider.prototype._determineFieldLabel = function(oFieldViewMetadata) {
		var oFilterItem, sLabel = oFieldViewMetadata.label;
		if (this._oSmartFilter && this._oSmartFilter.determineFilterItemByName) {
			oFilterItem = this._oSmartFilter.determineFilterItemByName(oFieldViewMetadata.name);
			if (oFilterItem) {
				sLabel = oFilterItem.getLabel();
			}
		}

		return sLabel;
	};

	/**
	 * Associates the control with a ValueList using the details retrieved from the metadata (annotation)
	 * @param {object} oControl - The control
	 * @param {string} sAggregation - The aggregation in the control to bind to
	 * @param {object} oFieldViewMetadata - The metadata merged from OData metadata and additional control configuration
	 * @param {boolean} bHasTypeAhead - Indicates whether the control also supports TypeAhead aka Suggest
	 * @private
	 */
	FilterProvider.prototype._associateValueList = function(oControl, sAggregation, oFieldViewMetadata, bHasTypeAhead) {
		var oValueListProvider;
		if (oFieldViewMetadata.hasValueListAnnotation) {
			oValueListProvider = new ValueListProvider({
				control: oControl,
				fieldName: oFieldViewMetadata.fieldName,
				typeAheadEnabled: bHasTypeAhead,
				aggregation: sAggregation,
				displayFormat: oFieldViewMetadata.displayFormat,
				displayBehaviour: oFieldViewMetadata.displayBehaviour,
				dateFormatSettings: this._oDateFormatSettings,
				loadAnnotation: true,
				fullyQualifiedFieldName: oFieldViewMetadata.fullName,
				metadataAnalyser: this._oMetadataAnalyser,
				filterModel: this.oModel,
				filterProvider: this,
				model: this._oParentODataModel,
				fieldViewMetadata: oFieldViewMetadata
			});

			oValueListProvider.attachValueListChanged(function(oEvent) {
				if (this._oSmartFilter) {
					this._oSmartFilter.fireFilterChange(oEvent);
				}
			}.bind(this));

			if (oFieldViewMetadata.visibleInAdvancedArea || (oFieldViewMetadata.groupId === FilterProvider.BASIC_FILTER_AREA_ID)) {
				oValueListProvider.loadAnnotation();
			}

			this._aValueListProvider.push(oValueListProvider);
		} else if (this._mTokenHandler[oControl.getId()] && this._mTokenHandler[oControl.getId()].parser) {
			this._mTokenHandler[oControl.getId()].parser.setDefaultOperation("EQ");
		}
	};

	FilterProvider.prototype._createAnalyticParameters = function(oParameterization) {
		// Determine all parameters
		var sEntitySetName, oEntitySet, aParameterNames, oParameterMetadata, aParameterMetadataOData;

		if (oParameterization) {
			aParameterNames = oParameterization.getAllParameterNames();
			oEntitySet = oParameterization.getEntitySet();

			if (oEntitySet) {
				sEntitySetName = oParameterization.getEntitySet().getQName();
				aParameterMetadataOData = this._oMetadataAnalyser.getFieldsByEntitySetName(sEntitySetName);

				for (var i = 0; i < aParameterMetadataOData.length; i++) {

					if (aParameterNames.indexOf(aParameterMetadataOData[i].name) >= 0) {
						oParameterMetadata = this._createAnalyticParameterMetadata(aParameterMetadataOData[i]);

						if (oParameterMetadata.visible) {
							this._aAnalyticalParameters.push(oParameterMetadata);
						}
					}
				}
			}
		}
	};

	FilterProvider.prototype._createAnalyticParameterMetadata = function(oParameterMetadataOData) {

		var sParamPrefix = sap.ui.comp.ANALYTICAL_PARAMETER_PREFIX;

		oParameterMetadataOData.filterRestriction = "single-value";

		var oFieldMetadata = this._createFieldMetadata(oParameterMetadataOData, sParamPrefix);

		oFieldMetadata.fieldName = sParamPrefix + oParameterMetadataOData.name;
		oFieldMetadata.isMandatory = true;
		oFieldMetadata.isParameter = true;
		oFieldMetadata.visibleInAdvancedArea = true;

		return oFieldMetadata;
	};

	/**
	 * Returns a list of analytical paramaters
	 * @returns {array} List of names of analytical paramaters. Array can be empty, if none exists.
	 * @protected
	 */
	FilterProvider.prototype.getAnalyticParameters = function() {
		return this._aAnalyticalParameters;
	};

	/**
	 * Returns selection variants
	 * @returns {array} of SelectionVariant annotations.
	 * @protected
	 */
	FilterProvider.prototype.getSelectionVariants = function() {
		return this._aSelectionVariants;
	};

	/**
	 * Returns the binding paths for the analytic paramaters
	 * @returns {string} Binding path of the analytical paramaters
	 * @protected
	 */
	FilterProvider.prototype.getAnalyticBindingPath = function() {
		var oValues, aParamNames = [], aParameters = this.getAnalyticParameters();

		aParameters.forEach(function(oParam) {
			aParamNames.push(oParam.fieldName);
		});

		oValues = this.getFilledFilterData(aParamNames);

		return this._createAnalyticBindingPath(aParameters, oValues);
	};

	/**
	 * Constructs binding information for analytical parameters.
	 * @param {array} aParameters with analytical parameters and the corresponding values
	 * @param {object} oValues of the analytic parameters
	 * @returns {string} Paths information
	 * @private
	 */
	FilterProvider.prototype._createAnalyticBindingPath = function(aParameters, oValues) {
		var sValue, sPath = "", oParamRequest;
		oParamRequest = this._getParameterizationRequest(this._oParameterization);
		if (oParamRequest) {
			aParameters.forEach(function(oParam) {
				sValue = oValues[oParam.fieldName];
				if (!sValue) {
					sValue = "";
				} else if (oParam.type === "Edm.Time" && sValue instanceof Date) {
					sValue = {
						__edmType: "Edm.Time",
						ms: (((sValue.getHours() * 60) + sValue.getMinutes()) * 60 + sValue.getSeconds()) * 1000 + sValue.getMilliseconds()
					};
				} else if (this._oDateFormatSettings && this._oDateFormatSettings.UTC && sValue instanceof Date) {
					sValue = FilterProvider.getDateInUTCOffset(sValue);
				}

				oParamRequest.setParameterValue(oParam.name, sValue);
			}.bind(this));

			sPath = oParamRequest.getURIToParameterizationEntry() + '/' + this._oParameterization.getNavigationPropertyToQueryResult();
		}

		return sPath;
	};

	FilterProvider.prototype._getParameterizationRequest = function() {
		return this._oParameterization ? new sap.ui.model.analytics.odata4analytics.ParameterizationRequest(this._oParameterization) : null;
	};

	/**
	 * Calculates additional flags and attributes for a field e.g. whether TypeAhead is switched on
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @returns {Object} the field metadata
	 * @private
	 */
	FilterProvider.prototype._createFieldMetadata = function(oFilterFieldODataMetadata, sParamPrefix) {
		var oFieldViewMetadata, oControlConfiguration;

		oFilterFieldODataMetadata.fieldName = this._getFieldName(oFilterFieldODataMetadata);
		oFilterFieldODataMetadata.fieldNameOData = oFilterFieldODataMetadata.fieldName.replace(FilterProvider.FIELD_NAME_REGEX, "/");

		// Get Additional configuration
		oControlConfiguration = this._oAdditionalConfiguration ? this._oAdditionalConfiguration.getControlConfigurationByKey(oFilterFieldODataMetadata.fieldName) : null;

		oFieldViewMetadata = jQuery.extend({}, oFilterFieldODataMetadata);

		oFieldViewMetadata.filterRestriction = this._getFilterRestriction(oFilterFieldODataMetadata, oControlConfiguration);
		this._updateValueListMetadata(oFieldViewMetadata, oFilterFieldODataMetadata);
		oFieldViewMetadata.hasValueHelpDialog = this._hasValueHelpDialog(oFieldViewMetadata, oControlConfiguration);
		oFieldViewMetadata.preventInitialDataFetchInValueHelpDialog = oControlConfiguration ? oControlConfiguration.preventInitialDataFetchInValueHelpDialog : true;
		oFieldViewMetadata.controlType = this._getControlType(oFieldViewMetadata, oControlConfiguration);
		// Use configured displayBehaviour, only if it is defined!
		if (oControlConfiguration && oControlConfiguration.displayBehaviour && oControlConfiguration.displayBehaviour !== "auto") {
			oFieldViewMetadata.displayBehaviour = oControlConfiguration.displayBehaviour;
		}
		oFieldViewMetadata.isCustomFilterField = !!(oControlConfiguration && oControlConfiguration.customControl);
		oFieldViewMetadata.visibleInAdvancedArea = !!(oControlConfiguration && oControlConfiguration.visibleInAdvancedArea);
		oFieldViewMetadata.label = this._getLabel(oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.isMandatory = this._isMandatory(oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.width = this._getWidth(oControlConfiguration);
		oFieldViewMetadata.isVisible = this._isVisible(oControlConfiguration);
		oFieldViewMetadata.groupId = this._getGroupID(oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.index = this._getIndex(oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.fControlConstructor = this._getControlConstructor(oFieldViewMetadata, sParamPrefix);
		oFieldViewMetadata.filterType = this._getFilterType(oFieldViewMetadata);
		oFieldViewMetadata.hasTypeAhead = this._hasTypeAhead(oFieldViewMetadata, oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.customControl = oControlConfiguration ? oControlConfiguration.customControl : undefined;
		oFieldViewMetadata.fCreateControl = function(oFieldMetadata) {
			var oData, oFilterData;
			oFieldMetadata.control = this._createControl(oFieldMetadata);
			oData = this.oModel.getData();
			oFilterData = oData[oFieldMetadata.fieldName];
			if (oFilterData) {
				this._updateMultiValueControl(oFieldMetadata.control, oFilterData.items, oFilterData.ranges);
			}
		}.bind(this);

		this._applyWidth(oFieldViewMetadata);

		oFieldViewMetadata.defaultFilterValues = oControlConfiguration ? oControlConfiguration.defaultFilterValues : undefined;

		if (oFieldViewMetadata.type === "Edm.String") {
			this._aFilterBarStringFieldNames.push(oFieldViewMetadata.fieldName);
		}
		oFieldViewMetadata.conditionType = null;
		var oConditionType = oControlConfiguration ? oControlConfiguration.conditionType : null;
		if (!oConditionType && this._bUseDateRangeType && (oFieldViewMetadata.fControlConstructor === DateRangeSelection)) {
			oConditionType = "sap.ui.comp.config.condition.DateRangeType";
		}

		if (oConditionType) {
			var sConditionType = "";
			if (typeof oConditionType === "object") {
				sConditionType = oConditionType.module;
				delete oConditionType.module;
			} else {
				sConditionType = oConditionType;
				oConditionType = null;
			}
			try {
				jQuery.sap.require(sConditionType);
				var oConditionTypeClass = jQuery.sap.getObject(sConditionType);
				if (oConditionTypeClass) {
					oFieldViewMetadata.conditionType = new oConditionTypeClass(oFieldViewMetadata.fieldName, this, oFieldViewMetadata);
					this._mConditionTypeFields[oFieldViewMetadata.fieldName] = oFieldViewMetadata;
				}
				if (oConditionType && !this._bUseDateRangeType) {
					oFieldViewMetadata.conditionType.applySettings(oConditionType);
				}
			} catch (ex) {
				jQuery.sap.log.error("Module " + sConditionType + " could not be loaded");
			}
		}

		this._checkMetadataDefaultValue(oFieldViewMetadata);

		return oFieldViewMetadata;
	};

	/**
	 * Returns the filterType of the field based on metadata, else undefined
	 * @param {object} oField - ViewMetadata for the filter field
	 * @returns {string} the filter type for the field
	 * @private
	 */
	FilterProvider.prototype._getFilterType = function(oField) {
		if (ODataType.isNumeric(oField.type)) {
			return "numeric";
		} else if (oField.type === "Edm.DateTime" && oField.displayFormat === "Date") {
			return "date";
		} else if (oField.type === "Edm.String") {
			return "string";
		} else if (oField.type === "Edm.Boolean") {
			return "boolean";
		} else if (oField.type === "Edm.Time") {
			return "time";
		}
		return undefined;
	};

	/**
	 * Update the metadata for ValueList annotation
	 * @param {Object} oFieldViewMetadata - view metadata for the filter field
	 * @param {object} oFieldODataMetadata - OData metadata for the filter field
	 * @private
	 */
	FilterProvider.prototype._updateValueListMetadata = function(oFieldViewMetadata, oFieldODataMetadata) {

		// First check for "sap:value-list" annotation
		oFieldViewMetadata.hasValueListAnnotation = oFieldODataMetadata["sap:value-list"] !== undefined;
		if (oFieldViewMetadata.hasValueListAnnotation) {
			oFieldViewMetadata.hasFixedValues = oFieldODataMetadata["sap:value-list"] === "fixed-values";
		} else if (oFieldODataMetadata["com.sap.vocabularies.Common.v1.ValueList"]) {
			// Then check for "com.sap.vocabularies.Common.v1.ValueList" and retrieve the semantics
			oFieldViewMetadata.hasValueListAnnotation = true;
			oFieldViewMetadata.hasFixedValues = this._oMetadataAnalyser.getValueListSemantics(oFieldODataMetadata["com.sap.vocabularies.Common.v1.ValueList"]) === "fixed-values";
			if (!oFieldViewMetadata.hasFixedValues) {
				oFieldViewMetadata.hasFixedValues = MetadataAnalyser.isValueListWithFixedValues(oFieldODataMetadata);
			}
		}
	};

	/**
	 * Creates the metadata for the basic search field. The basic search is supposed to be used in the ValuehelpDialog
	 * @returns {object} the field metadata
	 * @private
	 */
	FilterProvider.prototype._createBasicSearchFieldMetadata = function() {
		var oFieldViewMetadata;
		var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");

		oFieldViewMetadata = {};
		oFieldViewMetadata.filterRestriction = sap.ui.comp.smartfilterbar.FilterType.single;
		oFieldViewMetadata.name = FilterProvider.BASIC_SEARCH_FIELD_ID;
		oFieldViewMetadata.fieldName = FilterProvider.BASIC_SEARCH_FIELD_ID;
		oFieldViewMetadata.label = undefined;
		oFieldViewMetadata.isMandatory = false;
		oFieldViewMetadata.isVisible = true;
		oFieldViewMetadata.groupId = FilterProvider.BASIC_FILTER_AREA_ID;
		oFieldViewMetadata.index = -1; // index of Basic Search field is irrelevant!
		oFieldViewMetadata.control = new SearchField(this._oSmartFilter.getId() + "-btnBasicSearch", {
			showSearchButton: true
		});

		if (!this._isRunningInValueHelpDialog) {
			oFieldViewMetadata.control.setPlaceholder(oRb.getText("FILTER_BAR_BSEARCH_PLACE_HOLDER"));
		}

		oFieldViewMetadata.control.bindProperty('value', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName);

		return oFieldViewMetadata;
	};

	/**
	 * If a width is specified in the additional configuration, it will be applied to the control
	 * @param {Object} oFieldViewMetadata - view metadata for the filter field
	 * @private
	 */
	FilterProvider.prototype._applyWidth = function(oFieldViewMetadata) {

		if (oFieldViewMetadata && oFieldViewMetadata.width && oFieldViewMetadata.control && oFieldViewMetadata.control.setWidth && (typeof oFieldViewMetadata.control.setWidth === 'function')) {
			oFieldViewMetadata.control.setWidth(oFieldViewMetadata.width);
		}
	};

	/**
	 * Calculates additional flags and attributes for a field e.g. whether TypeAhead is switched on
	 * @param {Object} oControlConfiguration - the control configuration for the field
	 * @returns {Object} the field metadata
	 * @private
	 */
	FilterProvider.prototype._createFieldMetadataForCustomFilterFields = function(oControlConfiguration) {
		var oFieldViewMetadata;

		// Custom filter fields are required to have a custom control
		if (!oControlConfiguration || !oControlConfiguration.customControl) {
			return undefined;
		}

		oFieldViewMetadata = {};
		oFieldViewMetadata.name = oControlConfiguration.key;
		oFieldViewMetadata.fieldName = oControlConfiguration.key;
		oFieldViewMetadata.label = oControlConfiguration.label;
		oFieldViewMetadata.visibleInAdvancedArea = !!(oControlConfiguration && oControlConfiguration.visibleInAdvancedArea);
		oFieldViewMetadata.isVisible = this._isVisible(oControlConfiguration);
		oFieldViewMetadata.groupId = oControlConfiguration.groupId;
		oFieldViewMetadata.isMandatory = this._isMandatory(undefined, oControlConfiguration);
		oFieldViewMetadata.index = oControlConfiguration.index;
		oFieldViewMetadata.width = this._getWidth(oControlConfiguration);
		oFieldViewMetadata.control = oControlConfiguration.customControl;
		oFieldViewMetadata.isCustomFilterField = true;
		this._applyWidth(oFieldViewMetadata);

		return oFieldViewMetadata;
	};

	/**
	 * Extends the filter metadata with fieldName attribute which has the entity name for associations
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @returns {string} the field name
	 * @private
	 */
	FilterProvider.prototype._getFieldName = function(oFilterFieldODataMetadata) {
		if (!oFilterFieldODataMetadata.parentPropertyName) {
			return oFilterFieldODataMetadata.name;
		} else {
			return oFilterFieldODataMetadata.parentPropertyName + "." + oFilterFieldODataMetadata.name;
		}
	};

	/**
	 * Returns a flag indicating whether the field supports the value help dialog, or not
	 * @param {Object} oFieldViewMetadata - view metadata for the filter field
	 * @param {Object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {boolean} whether valuehelp is supported by the field
	 * @private
	 */
	FilterProvider.prototype._hasValueHelpDialog = function(oFieldViewMetadata, oControlConfiguration) {
		var bValueHelpDialog = true;

		if (oControlConfiguration) {
			if (oControlConfiguration.controlType === sap.ui.comp.smartfilterbar.ControlType.dropDownList) {
				bValueHelpDialog = false;
			} else if (oControlConfiguration.hasValueHelpDialog !== true) {
				bValueHelpDialog = false;
			}
		}
		if (oFieldViewMetadata && !oFieldViewMetadata.hasValueListAnnotation) {
			if (oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.FilterType.single || oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.FilterType.multiple) {
				bValueHelpDialog = false;
			}
		}

		return bValueHelpDialog;
	};

	/**
	 * Returns a flag indicating whether the field is visible, or not
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {boolean} whether the field is visible
	 * @private
	 */
	FilterProvider.prototype._isVisible = function(oControlConfiguration) {
		if (oControlConfiguration && oControlConfiguration.isVisible === false) {
			return false;
		}

		return true;
	};

	/**
	 * Returns the width from the control configuration. Undefined if there is no width specified
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {string} - width of the filter field
	 * @private
	 */
	FilterProvider.prototype._getWidth = function(oControlConfiguration) {
		if (oControlConfiguration && oControlConfiguration.width) {
			return oControlConfiguration.width;
		}

		return undefined;
	};

	/**
	 * Returns a flag indicating whether the field is required/mandatory, or not
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {boolean} whether the field is mandatory
	 * @private
	 */
	FilterProvider.prototype._isMandatory = function(oFilterFieldODataMetadata, oControlConfiguration) {
		if (oControlConfiguration && oControlConfiguration.mandatory !== sap.ui.comp.smartfilterbar.MandatoryType.auto) {
			return oControlConfiguration.mandatory === sap.ui.comp.smartfilterbar.MandatoryType.mandatory;
		}
		if (oFilterFieldODataMetadata) {
			return oFilterFieldODataMetadata.requiredFilterField;
		}
		return false;
	};

	/**
	 * Returns the effective filter restriction. Possible values can be found in this enum: sap.ui.comp.smartfilterbar.FilterType
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns {string} sFilterRestriction; the effective filter restriction
	 */
	FilterProvider.prototype._getFilterRestriction = function(oFilterFieldODataMetadata, oControlConfiguration) {
		var sFilterRestriction;

		if (oControlConfiguration && oControlConfiguration.filterType && oControlConfiguration.filterType !== sap.ui.comp.smartfilterbar.FilterType.auto) {
			sFilterRestriction = oControlConfiguration.filterType;
		} else if (oFilterFieldODataMetadata.filterRestriction === "single-value") {
			sFilterRestriction = sap.ui.comp.smartfilterbar.FilterType.single;
		} else if (oFilterFieldODataMetadata.filterRestriction === "multi-value") {
			sFilterRestriction = sap.ui.comp.smartfilterbar.FilterType.multiple;
		} else if (oFilterFieldODataMetadata.filterRestriction === "interval") {
			sFilterRestriction = sap.ui.comp.smartfilterbar.FilterType.interval;
		} else {
			sFilterRestriction = sap.ui.comp.smartfilterbar.FilterType.auto;
		}

		return sFilterRestriction;
	};

	/**
	 * Returns the effective control type. Control types can be found in enum: sap.ui.comp.smartfilterbar.ControlType
	 * @param {object} oFieldViewMetadata - view metadata for the filter field
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns {string} sControlType; the effective control type
	 */
	FilterProvider.prototype._getControlType = function(oFieldViewMetadata, oControlConfiguration) {
		var sControlType;

		if (oControlConfiguration && oControlConfiguration.controlType && oControlConfiguration.controlType !== sap.ui.comp.smartfilterbar.ControlType.auto) {
			sControlType = oControlConfiguration.controlType;
		} else if (oFieldViewMetadata.type === "Edm.DateTime" && oFieldViewMetadata.displayFormat === "Date") {
			sControlType = sap.ui.comp.smartfilterbar.ControlType.date;
		} else if (oFieldViewMetadata.hasValueListAnnotation && oFieldViewMetadata.hasFixedValues) {
			sControlType = sap.ui.comp.smartfilterbar.ControlType.dropDownList;
		} else if (this._isBooleanWithFixedValuedButWithoutValueListAnnotation(oFieldViewMetadata)) {
			sControlType = sap.ui.comp.smartfilterbar.ControlType.dropDownList;
		} else {
			sControlType = sap.ui.comp.smartfilterbar.ControlType.input;
		}
		return sControlType;
	};

	FilterProvider.prototype._isBooleanWithFixedValuedButWithoutValueListAnnotation = function(oFieldViewMetadata) {
		if (oFieldViewMetadata.type === "Edm.Boolean" && !oFieldViewMetadata.hasFixedValues && !oFieldViewMetadata.hasValueListAnnotation && (oFieldViewMetadata.filterRestriction === "single")) {
			return true;
		}

		return false;
	};

	/**
	 * Returns the id of the parent group for a filter field from the additional configuration
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {Object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns {string} groupId; the groupId for the configuration
	 */
	FilterProvider.prototype._getGroupID = function(oFilterFieldODataMetadata, oControlConfiguration) {
		if (oControlConfiguration && oControlConfiguration.groupId) {
			return oControlConfiguration.groupId;
		} else if (oFilterFieldODataMetadata && (oFilterFieldODataMetadata.requiredFilterField || (this._aSelectionFields && this._aSelectionFields.indexOf(oFilterFieldODataMetadata.fieldNameOData) > -1))) {
			return this._sBasicFilterAreaID;
		}
		return this._getGroupIDFromFieldGroup(oFilterFieldODataMetadata);
	};

	/**
	 * Returns the id (if found) of the parent group for a filter field from the FieldGroup annotation
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @private
	 * @returns {string} groupId; the groupId for the field (if found)
	 */
	FilterProvider.prototype._getGroupIDFromFieldGroup = function(oFilterFieldODataMetadata) {
		var iLen = 0, oFieldGroupAnnotation = null, sGroupName;
		if (oFilterFieldODataMetadata && this._aFieldGroupAnnotation && this._aFieldGroupAnnotation.length) {
			iLen = this._aFieldGroupAnnotation.length;
			// Loop through the FieldGroup annotation list and check if the field is found somewhere
			while (iLen--) {
				oFieldGroupAnnotation = this._aFieldGroupAnnotation[iLen];
				if (oFieldGroupAnnotation && oFieldGroupAnnotation.fields && oFieldGroupAnnotation.fields.indexOf(oFilterFieldODataMetadata.fieldNameOData) > -1) {
					sGroupName = oFieldGroupAnnotation.groupName;
					break;
				}
			}
		}
		return sGroupName;
	};

	/**
	 * Returns the label of the filter field. OData metadata and additional configuration are used for this
	 * @param {Object} oFilterFieldODataMetadata - OData metadata
	 * @param {Object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns {string} label for the filter field
	 */
	FilterProvider.prototype._getLabel = function(oFilterFieldODataMetadata, oControlConfiguration) {

		if (oControlConfiguration && oControlConfiguration.label) {
			return oControlConfiguration.label;
		}
		return this._getLabelFromFieldGroup(oFilterFieldODataMetadata) || oFilterFieldODataMetadata.fieldLabel || oFilterFieldODataMetadata.fieldName;
	};

	/**
	 * Returns the label (if found) of the filter field from the FieldGroup annotation
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @private
	 * @returns {string} label; undefined if field is no part of field group annotation
	 */
	FilterProvider.prototype._getLabelFromFieldGroup = function(oFilterFieldODataMetadata) {
		var iLen = 0, oFieldGroupAnnotation = null, sLabel;
		if (oFilterFieldODataMetadata && this._aFieldGroupAnnotation && this._aFieldGroupAnnotation.length) {
			iLen = this._aFieldGroupAnnotation.length;
			// Loop through the FieldGroup annotation list and check if the field is found somewhere
			while (iLen--) {
				oFieldGroupAnnotation = this._aFieldGroupAnnotation[iLen];
				if (oFieldGroupAnnotation && oFieldGroupAnnotation.fields && oFieldGroupAnnotation.fields.indexOf(oFilterFieldODataMetadata.fieldNameOData) > -1) {
					sLabel = oFieldGroupAnnotation.labels[oFilterFieldODataMetadata.fieldNameOData];
					break;
				}
			}
		}
		return sLabel;
	};

	/**
	 * Returns the index for a filter field from the additional configuration -or- based on FieldGroup annotation
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {Object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns {int} index; undefined if index is not specified in additional configuration
	 */
	FilterProvider.prototype._getIndex = function(oFilterFieldODataMetadata, oControlConfiguration) {
		if (oControlConfiguration && (oControlConfiguration.index >= 0)) {
			return oControlConfiguration.index;
		} else if (this._aSelectionFields && this._aSelectionFields.indexOf(oFilterFieldODataMetadata.fieldNameOData) > -1) {
			return this._aSelectionFields.indexOf(oFilterFieldODataMetadata.fieldNameOData);
		}
		return this._getIndexFromFieldGroup(oFilterFieldODataMetadata);
	};

	/**
	 * Returns the index (if found) of the filter field from the FieldGroup annotation
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @private
	 * @returns {int} index; undefined if field is no part of field group annotation
	 */
	FilterProvider.prototype._getIndexFromFieldGroup = function(oFilterFieldODataMetadata) {
		var iLen = 0, oFieldGroupAnnotation = null, iIndex;
		if (oFilterFieldODataMetadata && this._aFieldGroupAnnotation && this._aFieldGroupAnnotation.length) {
			iLen = this._aFieldGroupAnnotation.length;
			// Loop through the FieldGroup annotation list and check if the field is found somewhere
			while (iLen--) {
				oFieldGroupAnnotation = this._aFieldGroupAnnotation[iLen];
				if (oFieldGroupAnnotation && oFieldGroupAnnotation.fields) {
					iIndex = oFieldGroupAnnotation.fields.indexOf(oFilterFieldODataMetadata.fieldNameOData);
					if (iIndex > -1) {
						break;
					}
					iIndex = undefined;
				}
			}
		}
		return iIndex;
	};

	/**
	 * Returns the index for a filter group from the additional configuration
	 * @param {Object} oGroupConfiguration - Additional configuration for this filter group
	 * @private
	 * @returns {int} index; undefined if index is not specified in additional configuration
	 */
	FilterProvider.prototype._getGroupIndex = function(oGroupConfiguration) {
		if (oGroupConfiguration && (oGroupConfiguration.index || oGroupConfiguration.index === 0)) {
			return oGroupConfiguration.index;
		}
	};

	/**
	 * Returns the label for a filter group from the additional configuration
	 * @param {Object} oFilterGroupODataMetadata - OData metadata for the filter group
	 * @param {Object} oGroupConfiguration - Additional configuration for this filter group
	 * @private
	 * @returns {int} index; undefined if label is not specified in additional configuration
	 */
	FilterProvider.prototype._getGroupLabel = function(oFilterGroupODataMetadata, oGroupConfiguration) {
		if (oGroupConfiguration && oGroupConfiguration.label) {
			return oGroupConfiguration.label;
		}
		return oFilterGroupODataMetadata.groupLabel || oFilterGroupODataMetadata.groupName || oFilterGroupODataMetadata.groupEntityName;
	};

	/**
	 * Returns a flag indicating whether the field supports TypeAhead (aka. Suggest), or not
	 * @param {Object} oFieldViewMetadata - view metadata for the filter field
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {Object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {boolean} whether type ahead can be enabled for the field
	 * @private
	 */
	FilterProvider.prototype._hasTypeAhead = function(oFieldViewMetadata, oFilterFieldODataMetadata, oControlConfiguration) {
		var bHasTypeAhead;

		bHasTypeAhead = true;
		if (oControlConfiguration) {
			bHasTypeAhead = oControlConfiguration.hasTypeAhead;
		} else if (oFilterFieldODataMetadata.type !== "Edm.String") {
			return false;
		}
		// Disable type ahead for anything other than Input/MultiInput
		if (!(oFieldViewMetadata.fControlConstructor === Input || oFieldViewMetadata.fControlConstructor === MultiInput)) {
			return false;
		}

		return bHasTypeAhead;
	};

	/**
	 * Get the model
	 * @returns {Object} the model
	 * @public
	 */
	FilterProvider.prototype.getModel = function() {
		return this.oModel;
	};

	/**
	 * Get the view metadata for filter fields
	 * @returns {Array} array of filter field view metadata
	 * @public
	 */
	FilterProvider.prototype.getFilterBarViewMetadata = function() {
		return this._aFilterBarViewMetadata;
	};

	/**
	 * Get the list of value help provideres
	 * @returns {Array} array of value help provideres
	 * @private
	 */
	FilterProvider.prototype.getAssociatedValueHelpProviders = function() {
		return this._aValueHelpDialogProvider;
	};

	/**
	 * Get the list of value list provideres
	 * @returns {Array} array of value list provideres
	 * @private
	 */
	FilterProvider.prototype.getAssociatedValueListProviders = function() {
		return this._aValueListProvider;
	};

	/**
	 * Returns an parameter object which can be used to restrict the query result from OData. This function is required only for the basic search.
	 * @returns {object} object containing OData query parameters
	 * @public
	 */
	FilterProvider.prototype.getParameters = function() {
		var oParameter, sBasicSearchText = null;

		if (this.oModel) {
			sBasicSearchText = this.oModel.getProperty("/" + FilterProvider.BASIC_SEARCH_FIELD_ID);
		}

		if (this._sBasicSearchFieldName || sBasicSearchText) {
			oParameter = {
				custom: {}
			};

			if (this._sBasicSearchFieldName) {
				oParameter.custom["search-focus"] = this._sBasicSearchFieldName;
			}

			oParameter.custom["search"] = sBasicSearchText || "";
		}
		return oParameter;
	};

	/**
	 * Returns an array of filters that can be used to restrict the query result from OData
	 * @param {Array} aFieldNames - the names of the fields whose values should be returned (Ex: visible fields)
	 * @returns {Array} array of filters if any
	 * @public
	 */
	FilterProvider.prototype.getFilters = function(aFieldNames) {
		var oData = null;
		if (this.oModel) {
			oData = this.oModel.getData();
		}

		return FilterProvider.generateFilters(aFieldNames, oData, {
			dateSettings: this._oDateFormatSettings,
			useContainsAsDefault: this._bUseContainsAsDefault,
			stringFields: this._aFilterBarStringFieldNames,
			timeFields: this._aFilterBarTimeFieldNames
		});
	};

	/**
	 * Returns the data currently set in the filter data model
	 * @returns {object} the json data in the FilterBar
	 * @public
	 */
	FilterProvider.prototype.getFilterData = function() {
		return this.oModel ? this.oModel.getData() : null;
	};

	/**
	 * Returns the data currently set in the filter data model as string
	 * @returns {string} the string json data in the FilterBar
	 * @public
	 */
	FilterProvider.prototype.getFilterDataAsString = function() {
		return this.oModel ? this.oModel.getJSON() : null;
	};

	/**
	 * Returns the filled data currently set in the filter data model
	 * @param {Array} aFieldNames - the names of the fields whose values should be returned (Ex: visible fields)
	 * @returns {object} the json data in the FilterBar
	 * @public
	 */
	FilterProvider.prototype.getFilledFilterData = function(aFieldNames) {
		var oData, oFilledData = {}, iFieldLength, sField, oValue;
		oData = this.oModel ? this.oModel.getData() : null;
		if (oData && aFieldNames) {
			iFieldLength = aFieldNames.length;
			while (iFieldLength--) {
				sField = aFieldNames[iFieldLength];
				if (sField && sField !== FilterProvider.BASIC_SEARCH_FIELD_ID) {
					oValue = oData[sField];
					if (oValue && oValue.hasOwnProperty("low")) {// interval
						if (oValue.low) {
							oFilledData[sField] = oValue;
						}
					} else if (oValue && oValue.hasOwnProperty("items")) {// unrestricted/multi-value
						if (oValue.value && typeof oValue.value === "string") {
							oValue.value = oValue.value.trim();
						}
						if (oValue.items.length || (oValue.ranges && oValue.ranges.length) || oValue.value) {
							oFilledData[sField] = oValue;
						}
					} else if (oValue) { // Single Value
						if (typeof oValue === "string") {
							oValue = oValue.trim();
						}
						if (oValue) {
							oFilledData[sField] = oValue;
						}
					}
				}
				// Finally fill the Custom data if it exists
				if (iFieldLength === 0) {
					sField = FilterProvider.CUSTOM_FIELDS_MODEL_PROPERTY;
					oValue = oData[sField];
					if (oValue) {
						oFilledData[sField] = oValue;
					}
				}
			}
		}
		// Always return a copy of the original data, since some objects may be referenced elsewhere and could get destroyed (or removed) during
		// usage!
		return jQuery.extend(true, {}, oFilledData);
	};

	/**
	 * Returns the filled data currently set in the filter data model as string
	 * @param {Array} aFieldNames - the names of the fields whose values should be returned (Ex: visible fields)
	 * @returns {string} the string json data in the FilterBar
	 * @public
	 */
	FilterProvider.prototype.getFilledFilterDataAsString = function(aFieldNames) {
		return JSON.stringify(this.getFilledFilterData(aFieldNames));
	};

	/**
	 * Sets the data in the filter data model
	 * @param {object} oJson - the json data in the FilterBar
	 * @param {boolean} bReplace - Replace existing filter data
	 * @public
	 */
	FilterProvider.prototype.setFilterData = function(oJson, bReplace) {
		var oData = null, aFieldNames = null, sKey = null;
		if (this.oModel && oJson) {
			// Set flag to indicate data is being updated
			this._bUpdatingFilterData = true;

			try {
				if (bReplace) {
					this._createInitialModel(false);
				}
				oData = this._parseFilterData(oJson, bReplace);
				if (oData) {
					this.oModel.setData(oData, true);
					aFieldNames = [];
					var sFieldName = arguments[2];
					if (sFieldName) {
						aFieldNames.push(sFieldName);
					}
					for (sKey in oData) {
						aFieldNames.push(sKey);
					}
					this._handleFilterDataUpdate(aFieldNames);
				}
			} finally {

				// Reset data update flag
				this._bUpdatingFilterData = false;
			}
		}
	};

	/**
	 * Sets the data in the filter data model as string
	 * @param {string} sJson - the json data in the FilterBar
	 * @param {boolean} bReplace - Replace existing filter data
	 * @public
	 */
	FilterProvider.prototype.setFilterDataAsString = function(sJson, bReplace) {
		if (sJson) {
			this.setFilterData(JSON.parse(sJson), bReplace);
		}
	};

	/**
	 * Parse the filter data to handle some formats and not consider all formats
	 * @param {Object} oJson = the filter data input
	 * @param {boolean} bReplace - whether the data shall be replaced instead of merged
	 * @returns {Object} the parsed filter data
	 * @private
	 */
	FilterProvider.prototype._parseFilterData = function(oJson, bReplace) {
		return FilterProvider.parseFilterData(this.oModel.getData(), oJson, {
			dateFields: this._aFilterBarDateFieldNames,
			timeFields: this._aFilterBarTimeFieldNames,
			timeIntervalFields: this._aFilterBarTimeIntervalFieldNames,
			dateTimeMultiValueFields: this._aFilterBarDateTimeMultiValueFieldNames,
			conditionTypeFields: this._mConditionTypeFields
		}, bReplace);
	};

	/**
	 * Called once the FilterData is set via SetFilterData. Handles control update for non binding controls (multi-value)
	 * @param {Array} aFieldNames - Array containing name of updated fields
	 * @private
	 */
	FilterProvider.prototype._handleFilterDataUpdate = function(aFieldNames) {
		var i = 0, oFilterFieldMetadata, oData, oFilterData;
		if (this._aFilterBarMultiValueFieldMetadata) {
			i = this._aFilterBarMultiValueFieldMetadata.length;
			while (i--) {
				if (!oData) {
					oData = this.oModel.getData();
				}
				if (oData) {
					oFilterFieldMetadata = this._aFilterBarMultiValueFieldMetadata[i];
					// Only update the value if the field was changed in the handleDataUpate
					if (aFieldNames.indexOf(oFilterFieldMetadata.fieldName) > -1) {
						oFilterData = oData[oFilterFieldMetadata.fieldName];
						if (oFilterData) {
							this._updateMultiValueControl(oFilterFieldMetadata.control, oFilterData.items, oFilterData.ranges, oFilterFieldMetadata);
						}
					}
				}
			}
			this._updateConditionTypeFields();
		}
	};

	/**
	 * Clears the model
	 * @public
	 */
	FilterProvider.prototype.clear = function() {
		this._createInitialModel(false);
	};

	/**
	 * Resets the model
	 * @public
	 */
	FilterProvider.prototype.reset = function() {
		this._createInitialModel(true);
	};

	/**
	 * Updates the conditionType fields after changes to other fields and initially
	 * @private
	 */
	FilterProvider.prototype._initializeConditionTypeFields = function() {
		var handlePendingChange = function(oEvent) {
			this.setPending(this.isPending());
		}.bind(this);
		for ( var n in this._mConditionTypeFields) {
			this._mConditionTypeFields[n].conditionType.initialize(this.oModel.getData()[n]);
			if (this._mConditionTypeFields[n].conditionType.getAsync()) {
				this._mConditionTypeFields[n].conditionType.attachPendingChange(handlePendingChange);
			}
		}
	};

	/**
	 * Updates the conditionType fields after changes to other fields and initially
	 * @private
	 */
	FilterProvider.prototype._updateConditionTypeFields = function() {
		var oldData = this._oldData;
		var newData = this.oModel.getData();
		this._oldData = jQuery.extend(true, {}, newData);

		if (oldData !== undefined) {
			// check which fields have a changed filter model
			var aUpdateFields = [], n;
			for (n in newData) {
				var sNewData = JSON.stringify(newData[n]);
				var sOldData = JSON.stringify(oldData[n]);
				if (sNewData !== sOldData) {
					aUpdateFields.push(n);
				}
			}

			if (aUpdateFields.length > 0) {
				// only if we found changed fields we call providerDataUpdated with the changed fields
				for (n in this._mConditionTypeFields) {
					this._mConditionTypeFields[n].conditionType.providerDataUpdated(aUpdateFields, newData);
				}
			}
		}
	};

	/**
	 * Clears the conditionType fields
	 * @private
	 */
	FilterProvider.prototype._clearConditionTypeFields = function() {
		var newData = this.oModel.getData();
		for ( var n in this._mConditionTypeFields) {
			this._mConditionTypeFields[n].conditionType.initialize(newData[n]);
		}
	};

	FilterProvider.prototype._validateConditionTypeFields = function() {
		var bInvalid = false;
		for ( var n in this._mConditionTypeFields) {
			var bValid = this._mConditionTypeFields[n].conditionType.validate();
			if (!bValid && !bInvalid) {
				bInvalid = true;
			}
		}
		return bInvalid;
	};

	// TODO: Move this to a Util
	/**
	 * Static function to generate filter array from the given field name array and Json data object
	 * @param {Array} aFieldNames - array of field names
	 * @param {Object} oData - the json object data
	 * @param {Object} mSettings - optional settings used while creating filters
	 * @returns {Array} array of sap.ui.model.Filter
	 * @private
	 */
	FilterProvider.generateFilters = function(aFieldNames, oData, mSettings) {
		var aFilters = [], aArrayFilters = null, oExcludeFilters = null, aExcludeFilters = null, sField = null, sMatch = FilterProvider.FIELD_NAME_REGEX, oValue = null, oValue1, oValue2, aValue = null, iLen = 0, iFieldLength = 0;
		var oDateFormatSettings, bEnableUseContainsAsDefault, aStringFields, aTimeFields, bUseContains, bIsTimeField;
		if (mSettings) {
			oDateFormatSettings = mSettings.dateSettings;
			bEnableUseContainsAsDefault = mSettings.useContainsAsDefault;
			aStringFields = mSettings.stringFields;
			aTimeFields = mSettings.timeFields;
		}
		if (aFieldNames && oData) {
			iFieldLength = aFieldNames.length;
			while (iFieldLength--) {
				bIsTimeField = false;
				sField = aFieldNames[iFieldLength];
				if (sField && sField !== FilterProvider.BASIC_SEARCH_FIELD_ID) {
					bUseContains = false;
					if (bEnableUseContainsAsDefault && aStringFields) {
						if (aStringFields.indexOf(sField) > -1) {
							bUseContains = true;
						}
					} else if (aTimeFields && aTimeFields.indexOf(sField) > -1) {
						bIsTimeField = true;
					}
					oValue = oData[sField];
					// Replace all "." with "/" to convert to proper paths
					sField = sField.replace(sMatch, "/");
					if (oValue && oValue.hasOwnProperty("low")) {// The data in the model corresponds to low and high Objects
						if (oValue.low && oValue.high) {
							oValue1 = oValue.low;
							oValue2 = oValue.high;
							if (oDateFormatSettings && oDateFormatSettings.UTC && oValue1 instanceof Date && oValue2 instanceof Date) {
								oValue1 = FilterProvider.getDateInUTCOffset(oValue1);
								oValue2 = FilterProvider.getDateInUTCOffset(oValue2);
							}
							aFilters.push(new Filter(sField, sap.ui.model.FilterOperator.BT, oValue1, oValue2));
						} else if (oValue.low) {
							if (oValue.low instanceof Date) {
								// We do not have an interval value --> Use typed in value as a single value date filter
								oValue1 = oValue.low;
								if (oDateFormatSettings && oDateFormatSettings.UTC) {
									oValue1 = FilterProvider.getDateInUTCOffset(oValue1);
								}
								aFilters.push(new Filter(sField, sap.ui.model.FilterOperator.EQ, oValue1));
							} else if (typeof oValue.low === "string") {
								// since we bind non date interval values only to low; resolve this by splitting "-" into an interval
								aValue = FormatUtil.parseFilterNumericIntervalData(oValue.low);
								if (aValue && aValue.length === 2) {
									aFilters.push(new Filter(sField, sap.ui.model.FilterOperator.BT, aValue[0], aValue[1]));
								} else {
									// We do not have an interval value --> Use typed in value as a single value filter
									aFilters.push(new Filter(sField, bUseContains ? sap.ui.model.FilterOperator.Contains : sap.ui.model.FilterOperator.EQ, oValue.low));
								}
							}
						}
					} else if (oValue && oValue.hasOwnProperty("items")) {// The data in the model corresponds to multi-value/range with a typed in
						// value
						aArrayFilters = [];
						aExcludeFilters = [];
						oExcludeFilters = null;
						if (oValue && oValue.hasOwnProperty("ranges")) { // Check if the data is for an unrestricted filter
							aValue = oValue.ranges;
							iLen = aValue.length;
							// Range Filters
							while (iLen--) {
								oValue1 = aValue[iLen].value1;
								oValue2 = aValue[iLen].value2;
								if (bIsTimeField) {
									if (oValue1 instanceof Date) {
										oValue1 = FormatUtil.getEdmTimeFromDate(oValue1);
									}
									if (oValue2 instanceof Date) {
										oValue2 = FormatUtil.getEdmTimeFromDate(oValue2);
									}
								} else if (oDateFormatSettings && oDateFormatSettings.UTC) {// Check if Date values have to be converted to UTC
									if (oValue1 instanceof Date) {
										oValue1 = FilterProvider.getDateInUTCOffset(oValue1);
									}
									if (oValue2 instanceof Date) {
										oValue2 = FilterProvider.getDateInUTCOffset(oValue2);
									}
								}
								if (aValue[iLen].exclude) { // Exclude Select Option is not supported entirely except EQ, which can be changed to NE
									if (aValue[iLen].operation === sap.ui.model.FilterOperator.EQ) {
										aExcludeFilters.push(new Filter(sField, sap.ui.model.FilterOperator.NE, oValue1));
									}
								} else {
									aArrayFilters.push(new Filter(sField, aValue[iLen].operation, oValue1, oValue2));
								}
							}
							if (aExcludeFilters.length) {
								oExcludeFilters = new Filter(aExcludeFilters, true);
							}
						}
						aValue = oValue.items;
						iLen = aValue.length;
						// Item filters
						while (iLen--) {
							aArrayFilters.push(new Filter(sField, sap.ui.model.FilterOperator.EQ, aValue[iLen].key));
						}
						// Only ignore "", null and undefined values
						if (oValue.value || oValue.value === 0 || oValue.value === false) {
							if (typeof oValue.value === "string") {
								oValue.value = oValue.value.trim();
							}
							if (oValue.value || oValue.value === 0 || oValue.value === false) {
								aArrayFilters.push(new Filter(sField, bUseContains ? sap.ui.model.FilterOperator.Contains : sap.ui.model.FilterOperator.EQ, oValue.value));
							}
						}

						// OR the array values while creating the filter
						if (aArrayFilters.length) {
							// If Exclude and array (inlcude) filters exists --> use AND between them before pushing to the filter array
							if (oExcludeFilters) {
								aFilters.push(new Filter([
									new Filter(aArrayFilters, false), oExcludeFilters
								], true));
							} else {
								aFilters.push(new Filter(aArrayFilters, false));
							}
						} else if (oExcludeFilters) {
							// Only exclude filters exists --> add to the filter array
							aFilters.push(oExcludeFilters);
						}
					} else if (oValue || oValue === 0 || oValue === false) {// Single Value
						// Only ignore "", null and undefined values
						if (typeof oValue === "string") {
							oValue = oValue.trim();
						}
						if (oValue && oValue instanceof Date) {
							if (bIsTimeField) {
								oValue = FormatUtil.getEdmTimeFromDate(oValue);
							} else if (oDateFormatSettings && oDateFormatSettings.UTC) {
								oValue = FilterProvider.getDateInUTCOffset(oValue);
							}
						}
						if (oValue || oValue === 0 || oValue === false) {
							aFilters.push(new Filter(sField, bUseContains ? sap.ui.model.FilterOperator.Contains : sap.ui.model.FilterOperator.EQ, oValue));
						}
					}
				}
			}
		}
		// AND the top level filter attributes if there is more than 1
		return (aFilters.length > 1) ? [
			new Filter(aFilters, true)
		] : aFilters;
	};

	// TODO: Move this to a Util
	/**
	 * Static function to parse and convert json data to be set into the data of the filter model (JsonModel.oData) into proper format
	 * @private
	 * @param {Object} oData - The data from the datamodel
	 * @param {Object} oInputJson - the json object data that needs to be convered/parsed
	 * @param {Object} mSettings - settings used while for parsing filter data
	 * @param {boolean} bReplace - whether the data shall be replaced instead of merged
	 * @returns {Object} The resolved/parsed/converted data that can be set into the model
	 */
	FilterProvider.parseFilterData = function(oData, oInputJson, mSettings, bReplace) {
		var oResolvedData = {}, mConditionTypeFields = null, sField = null, oValue = null, oNewValue, oJson, i, iLen, oRange, aFilterBarDateFieldNames, aFilterBarTimeFieldNames, aFilterBarTimeIntervalFieldNames, aFilterBarDateTimeMultiValueFieldNames, aEQRanges;
		if (mSettings) {
			aFilterBarDateFieldNames = mSettings.dateFields;
			aFilterBarTimeFieldNames = mSettings.timeFields;
			aFilterBarTimeIntervalFieldNames = mSettings.timeIntervalFields;
			aFilterBarDateTimeMultiValueFieldNames = mSettings.dateTimeMultiValueFields;
			mConditionTypeFields = mSettings.conditionTypeFields || {};
		}
		if (!aFilterBarDateFieldNames) {
			aFilterBarDateFieldNames = [];
		}
		if (!aFilterBarTimeFieldNames) {
			aFilterBarTimeFieldNames = [];
		}
		if (!aFilterBarTimeIntervalFieldNames) {
			aFilterBarTimeIntervalFieldNames = [];
		}
		if (!aFilterBarDateTimeMultiValueFieldNames) {
			aFilterBarDateTimeMultiValueFieldNames = [];
		}
		if (oData && oInputJson) {
			oJson = jQuery.extend({}, oInputJson, true);
			for (sField in oJson) {
				if (oData.hasOwnProperty(sField) && sField !== FilterProvider.CUSTOM_FIELDS_MODEL_PROPERTY) {
					oValue = oData[sField];
					oNewValue = oJson[sField];
					if (sField in mConditionTypeFields) {
						if ("conditionTypeInfo" in oNewValue || (!("conditionTypeInfo" in oNewValue) && oNewValue.ranges)) {
							// only if there is a saved conditionTypeInfo
							mConditionTypeFields[sField].conditionType.initialize(oNewValue);
						}
					} else if (oValue && oValue.hasOwnProperty("low")) {// interval
						oResolvedData[sField] = oNewValue;
						if (oNewValue) {
							if (oNewValue.low && oNewValue.high) { // Date Range

								if ((aFilterBarDateFieldNames.indexOf(sField) > -1) || (aFilterBarTimeFieldNames.indexOf(sField) > -1)) {
									// oResolvedData[sField] = oNewValue;
									if (!(oNewValue.low instanceof Date)) { // Date needs to be set as a Date Object always!
										oResolvedData[sField].low = new Date(oNewValue.low);
									}
									if (!(oNewValue.high instanceof Date)) {// Date needs to be set as a Date Object always!
										oResolvedData[sField].high = new Date(oNewValue.high);
									}
								} else {
									oResolvedData[sField].low = oNewValue.low + '-' + oNewValue.high;
									oResolvedData[sField].high = null;
								}
							} else if ((oNewValue.low || oNewValue.value) && !oNewValue.high) {
								if (!oNewValue.low && oNewValue.value) {
									oNewValue.low = oNewValue.value;
								}
								if ((aFilterBarDateFieldNames.indexOf(sField) > -1 || aFilterBarTimeFieldNames.indexOf(sField) > -1) && !(oNewValue.low instanceof Date)) {
									oResolvedData[sField].low = new Date(oNewValue.low);
								} else {
									oResolvedData[sField].low = oNewValue.low;
								}
								oResolvedData[sField].high = null;
							}
						}
					} else if (oValue && oValue.hasOwnProperty("items")) {// unrestricted/multi-value
						if (oNewValue && (oNewValue.items || oNewValue.ranges)) {
							if (oNewValue.ranges && oNewValue.ranges.length) {
								// Interval Edm.Time fields
								if (aFilterBarTimeIntervalFieldNames.indexOf(sField) > -1) {
									iLen = oNewValue.ranges.length;
									for (i = 0; i < iLen; i++) {
										oRange = oNewValue.ranges[i];
										if (!oRange.exclude && (oRange.operation === "EQ" || oRange.operation === "BT")) {
											break;
										}
										oRange = null;
									}
									if (oRange) {
										// String input but date expected
										if (oRange.value1 && typeof oRange.value1 === "string") {
											oRange.value1 = new Date(oRange.value1);
										}
										if (oRange.value2 && typeof oRange.value2 === "string") {
											oRange.value2 = new Date(oRange.value2);
										}
										// Create range data
										oResolvedData[sField] = {
											ranges: [
												oRange
											],
											items: [],
											value: ""
										};
									}
									// continue with next field as no further actions is necessary
									continue;
								} else if (aFilterBarDateTimeMultiValueFieldNames.indexOf(sField) > -1) {
									// multi-value Date/Time field
									iLen = oNewValue.ranges.length;
									aEQRanges = [];
									for (i = 0; i < iLen; i++) {
										oRange = oNewValue.ranges[i];
										if (!oRange.exclude && oRange.operation === "EQ") {
											// String input but date expected
											if (oRange.value1 && typeof oRange.value1 === "string") {
												oRange.value1 = new Date(oRange.value1);
											}
											aEQRanges.push(oRange);
										}
									}
									// Create range data
									oResolvedData[sField] = {
										ranges: aEQRanges,
										items: [],
										value: ""
									};
									// continue with next field as no further actions is necessary
									continue;
								} else if (aFilterBarDateFieldNames.indexOf(sField) > -1 || aFilterBarTimeFieldNames.indexOf(sField) > -1) {
									// Unrestricted Date/Time field
									iLen = oNewValue.ranges.length;
									for (i = 0; i < iLen; i++) {
										oRange = oNewValue.ranges[i];
										// String input but date expected
										if (oRange.value1 && typeof oRange.value1 === "string") {
											oRange.value1 = new Date(oRange.value1);
										}
										if (oRange.value2 && typeof oRange.value2 === "string") {
											oRange.value2 = new Date(oRange.value2);
										}
									}
								} else if ((oNewValue.ranges.length === 1) && (oNewValue.ranges[0].operation === "EQ") && !oNewValue.ranges[0].value1) {
									// BCP: 1770464128
									continue;
								}
							}
							oResolvedData[sField] = oNewValue;

							if (!bReplace && oResolvedData[sField].ranges) {
								for (i = 0; i < oResolvedData[sField].ranges.length; i++) {
									oResolvedData[sField].ranges[i].tokenText = null;
								}
							}

						} else if (typeof oNewValue === "string" || typeof oNewValue === "number" || oNewValue instanceof Date) { // Single Value
							// Unrestricted/multi-value Date field
							if (oNewValue && (aFilterBarDateFieldNames.indexOf(sField) > -1 || aFilterBarTimeFieldNames.indexOf(sField) > -1)) {
								if (typeof oNewValue === "string") {// String input but date expected
									oNewValue = new Date(oNewValue);
								}
								// Create Date range data
								oResolvedData[sField] = {
									ranges: [
										{
											"exclude": false,
											"operation": "EQ",
											"keyField": sField,
											"value1": oNewValue,
											"value2": null
										}
									],
									items: [],
									value: ""
								};
							} else {
								oResolvedData[sField] = {
									value: oNewValue,
									items: []
								};
							}
						}
					} else {// single value
						oResolvedData[sField] = null; // Default to null!
						// Single Date, string, boolean, number value
						if (typeof oNewValue === "string" || typeof oNewValue === "boolean" || typeof oNewValue === "number" || oNewValue instanceof Date) {
							// String input but date expected!
							if (typeof oNewValue === "string" && (aFilterBarDateFieldNames.indexOf(sField) > -1 || aFilterBarTimeFieldNames.indexOf(sField) > -1)) {
								oResolvedData[sField] = new Date(oNewValue);
							} else {
								oResolvedData[sField] = oNewValue;
							}
						} else if (oNewValue && (oNewValue.value || oNewValue.value === 0 || oNewValue.value === false)) { // Use the types in value
							// from multiValue if any
							oResolvedData[sField] = oNewValue.value;
						} else if (oNewValue && oNewValue.items && oNewValue.items.length) { // use the 1st value in items array if any
							oResolvedData[sField] = oNewValue.items[0].key;
						} else if (oNewValue && oNewValue.ranges && oNewValue.ranges.length) { // use the 1st value in ranges array if any
							iLen = oNewValue.ranges.length;
							for (i = 0; i < iLen; i++) {
								oRange = oNewValue.ranges[i];
								if (!oRange.exclude && oRange.operation === "EQ") {
									break;
								}
								oRange = null;
							}
							if (oRange && oRange.value1) {
								// String input but date expected!
								if (typeof oRange.value1 === "string" && (aFilterBarDateFieldNames.indexOf(sField) > -1 || aFilterBarTimeFieldNames.indexOf(sField) > -1)) {
									oResolvedData[sField] = new Date(oRange.value1);
								} else {
									oResolvedData[sField] = oRange.value1;
								}
							}
						}
					}
				} else if (bReplace || sField === FilterProvider.CUSTOM_FIELDS_MODEL_PROPERTY) {
					// Value is for _CUSTOM -> add it as it is
					oResolvedData[sField] = oJson[sField];
				}
			}
		}
		return oResolvedData;
	};

	/**
	 * Static function that returns a UTC offset date
	 * @private
	 * @param {Object} oDate - The input date object
	 * @returns {Object} The UTC offset date object
	 */
	FilterProvider.getDateInUTCOffset = function(oDate) {
		return new Date(oDate.valueOf() - oDate.getTimezoneOffset() * 60 * 1000);
	};

	/**
	 * Destroys the object
	 * @public
	 */
	FilterProvider.prototype.destroy = function() {
		var fDestroy = function(aArray) {
			var i;
			if (aArray) {
				i = aArray.length;
				while (i--) {
					aArray[i].destroy();
				}
			}
		};
		this._oParentODataModel = null;
		this._aAnalyticalParameters = null;
		this._aFilterBarViewMetadata = null;
		this._oParameterization = null;
		this._aFilterBarFieldNames = null;
		this._aFilterBarDateFieldNames = null;
		this._aFilterBarTimeFieldNames = null;
		this._aFilterBarTimeIntervalFieldNames = null;
		this._aFilterBarDateTimeMultiValueFieldNames = null;
		this._aFilterBarStringFieldNames = null;
		this._aFilterBarMultiValueFieldMetadata = null;
		this._aFieldGroupAnnotation = null;
		this._aSelectionFields = null;
		this._aSelectionVariants = null;

		if (this._oMetadataAnalyser && this._oMetadataAnalyser.destroy) {
			this._oMetadataAnalyser.destroy();
		}
		this._oMetadataAnalyser = null;

		fDestroy(this._aValueHelpDialogProvider);
		this._aValueHelpDialogProvider = null;

		fDestroy(this._aValueListProvider);
		this._aValueListProvider = null;

		if (this._mTokenHandler) {
			for ( var sHandlerId in this._mTokenHandler) {
				var oHandler = this._mTokenHandler[sHandlerId];
				if (oHandler.parser) {
					oHandler.parser.destroy();
					oHandler.parser = null;
				}
			}
			delete this._mTokenHandler;
		}

		this.oResourceBundle = null;
		this.sIntervalPlaceholder = null;
		this.sDefaultDropDownDisplayBehaviour = null;
		this.sDefaultTokenDisplayBehaviour = null;
		this._oSmartFilter = null;

		if (this._oEventProvider) {
			if (this._oEventProvider.destroy) {
				this._oEventProvider.destroy();
			}
			this._oEventProvider = null;
		}

		for ( var n in this._mConditionTypeFields) {
			this._mConditionTypeFields[n].conditionType.destroy();
		}
		this._mConditionTypeFields = null;

		if (this.oModel) {
			this.oModel.destroy();
			this.oModel = null;
		}

		this.bIsDestroyed = true;
	};

	return FilterProvider;

}, /* bExport= */true);
