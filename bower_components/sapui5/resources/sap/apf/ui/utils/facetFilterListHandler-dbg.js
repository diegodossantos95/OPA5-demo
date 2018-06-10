/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.facetFilterListHandler');
jQuery.sap.require('sap.m.FacetFilterList');
jQuery.sap.require('sap.m.FacetFilterItem');
jQuery.sap.require('sap.apf.ui.utils.facetFilterListConverter');
jQuery.sap.require('sap.apf.ui.utils.facetFilterValueFormatter');
/**
 * @class Facet filter list handler
 * @name sap.apf.ui.utils.FacetFilterHandler
 * @param {sap.apf.core.instance} oCore Api
 * @param {sap.apf.ui.instance} oUi Api
 * @param {sap.apf.utils.StartFilter} A configured visible filter
 * @description Handler for facet filter list controls
 */
sap.apf.ui.utils.FacetFilterListHandler = function(oCoreApi, oUiApi, oConfiguredFilter) {
	"use strict";
	var aCachedSelections = [];
	var oFacetFilterList;
	//Facet filter list converter is used to modify the values in the form understandable by the control
	var oFacetFilterListConverter = new sap.apf.ui.utils.FacetFilterListConverter();
	/**
	* @private
	* @function
	* @name sap.apf.ui.utils.FacetFilterHandler#_removeFFListOnError
	* @description Removes the facet filter control if get values failed
	* It sets the facetFilterList as inactive in the UI (list is not displayed on UI)
	* */
	function _removeFFListOnError(aFilterValues) {
		if(aFilterValues === null || aFilterValues.length === 0){
			var oMessageObject = oCoreApi.createMessageObject({
				code : "6010",
				aParameters : [ oCoreApi.getTextNotHtmlEncoded(oConfiguredFilter.getLabel()) ]
			});
			oCoreApi.putMessage(oMessageObject);
			oFacetFilterList.setActive(false); //list is set to inactive if it has "no data"
		}
	}
	/**
	* @private
	* @function
	* @name sap.apf.ui.utils.FacetFilterHandler#_populateValues
	* @param {array} aFilterValues : Filter values for the facet filter list control; Each element is an object with property: value
	* @param {String} sSelectProperty: PropertyName
	* @param {Object} Property Metadata
	* @description Formats the filter values and converts the values in the form understandable by facet filter list control and sets the data in the model for the filter control
	* */
	function _populateValues(aFilterValues, sSelectProperty, oPropertyMetadata) {
		var aFFValueFormatter = new sap.apf.ui.utils.FacetFilterValueFormatter(oUiApi, oCoreApi);
		var aFormattedFilterValues = aFFValueFormatter.getFormattedFFData(aFilterValues, sSelectProperty, oPropertyMetadata);
		//Facet filter list converter is used to modify the values in the form understandable by the control
		var aModifiedFilterValues = oFacetFilterListConverter.getFFListDataFromFilterValues(aFormattedFilterValues, sSelectProperty, aCachedSelections);
		var oFacetFilterListModel = oFacetFilterList.getModel();
		var aFacetFilterListDataSet = oFacetFilterListModel.getData();
		//TODO: this is a workaround to deselect every item. Normally this should automatically happen when the data is set to the JSONModel BCP: 1770254364
		aFacetFilterListDataSet.forEach(function(dataPoint){
			dataPoint.selected = false;
			oFacetFilterList.removeSelectedKey(dataPoint.key);
		});
		//Modify the  size limit of the model based on the length of the data so that all values are shown in the facet filter list.
		oFacetFilterListModel.setSizeLimit(aModifiedFilterValues.length);
		//Updates the facet filter list with the values
		oFacetFilterListModel.setData(aModifiedFilterValues);
		oFacetFilterListModel.updateBindings();
	}
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.utils.FacetFilterHandler#createFacetFilterList
	 * @returns {sap.m.FacetFilterList} FacetFilterList
	 * @description Creates the facetFilterList, removes list if it is empty and registers the promise chain
	 * */
	this.createFacetFilterList = function () {
		var that = this;
		oFacetFilterList = new sap.m.FacetFilterList({
			title : oCoreApi.getTextNotHtmlEncoded(oConfiguredFilter.getLabel()),
			multiSelect : oConfiguredFilter.isMultiSelection(),
			key : oConfiguredFilter.getPropertyName(),
			growing : false,
			listClose : this.onListClose.bind(this),
			listOpen : this.onListOpen.bind(this)
		});
		oFacetFilterList.bindItems("/", new sap.m.FacetFilterItem({
			key : '{key}',
			text : '{text}',
			selected : '{selected}'
		}));
		var oModel = new sap.ui.model.json.JSONModel([]);
		oFacetFilterList.setModel(oModel);
		// Remove facet filters which have no data and will never get data (ff with value help request can get data later on)
		if (!oConfiguredFilter.hasValueHelpRequest()){
			this.getFacetFilterListData().done(_removeFFListOnError);
		}
		// Register promise chain for the selected values
		this.getSelectedFFValues().then(function(oGetSelectedValuesPromiseArgs) {
			_updateSelection(oGetSelectedValuesPromiseArgs);
		});
		return oFacetFilterList;

		/**
		* @private
		* @function
		* @name sap.apf.ui.utils.FacetFilterHandler#_updateSelection
		* @param {sap.m.FacetFilterList} oFacetFilterListControl: facet filter list control
		* @param {Object} oGetSelectedValuesPromiseArgs : Selected filter values/keys for the facet filter list control [Resolved from promise] Example : [ "20000201" ]
		* @description Sets the data in the model for the filter control
		* */
		function _updateSelection(oGetSelectedValuesPromiseArgs) {
			//Register on the new promise to get updates on reset, new or open path and also when filters propagate restrictions to dependent filters
			oGetSelectedValuesPromiseArgs.oFilterRestrictionPropagationPromiseForSelectedValues.done(function(oNewSelectedValues, oNewFilterRestrictionPropagationPromise) {
				//Facet filter list stores selections even if items are no longer available in the list and so we clear them before updating selections
				_updateSelection({
					aSelectedFilterValues : oNewSelectedValues,
					oFilterRestrictionPropagationPromiseForSelectedValues : oNewFilterRestrictionPropagationPromise
				});
			});
			if (oGetSelectedValuesPromiseArgs.aSelectedFilterValues.length > 0 || (aCachedSelections.length > 0 )){
				//Caching the selected values for later updates( to compare and check whether changes were made)
				aCachedSelections = oGetSelectedValuesPromiseArgs.aSelectedFilterValues;
				that.getFacetFilterListData().done(_populateValues);
			}
		}
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.utils.FacetFilterHandler#getFacetFilterListData
	 * @description Gets filter values and metadata information for the filter property
	 * @returns {Deferred} oFFValuePromise
	 * oFFValuePromise resolved with converted filter values and arguments for formatter
	 * Example resolve when data was returned: 
	 * [ {
			"StartDate" : "20000101"
		}, {
			"StartDate" : "20000201"
		} ]
	 * */
	this.getFacetFilterListData = function() {
		var sSelectProperty;
		var oFFValuePromise = jQuery.Deferred();
		var aFacetFilterListData = oConfiguredFilter.getValues();
		aFacetFilterListData.then(function(aFilterValues) {
			sSelectProperty = oConfiguredFilter.getAliasNameIfExistsElsePropertyName() || oConfiguredFilter.getPropertyName();
			oConfiguredFilter.getMetadata().then(function(oPropertyMetadata) {
				oFFValuePromise.resolve(aFilterValues, sSelectProperty, oPropertyMetadata);
			});
		});
		return oFFValuePromise.promise();
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.utils.FacetFilterHandler#getSelectedFFValues
	 * @description Gets selected filter values
	 * @returns {Deferred} oFFSelectedValuePromise
	 * If get selected values was successful, resolved with selected filter values and the new filter restriction promise for selected values
	 * Example : [ "20000201" ] 
	 * */
	this.getSelectedFFValues = function() {
		var oFFSelectedValuePromise = jQuery.Deferred();
		var aFacetFilterSelectedData = oConfiguredFilter.getSelectedValues();
		aFacetFilterSelectedData.then(function(aSelectedFilterValues, oNewFilterRestrictionPropagationPromise) {
			oFFSelectedValuePromise.resolve({
				aSelectedFilterValues : aSelectedFilterValues,
				oFilterRestrictionPropagationPromiseForSelectedValues : oNewFilterRestrictionPropagationPromise
			});
		});
		return oFFSelectedValuePromise.promise();
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.utils.FacetFilterHandler#setSelectedFFValues
	 * @param {Array} Facet filter list selected item keys Example : [ "20000201" , "20000301" ]
	 * @description Sets the selected filter value keys
	 * */
	this.setSelectedFFValues = function(aFacetFilterListSelectedItemKeys) {
		oConfiguredFilter.setSelectedValues(aFacetFilterListSelectedItemKeys);
	};
	/**
	* @public
	* @function
	* @name sap.apf.ui.utils.FacetFilterHandler#onListClose
	* @description Sets the selected values on the filter and calls the selection changed event
	* */
	this.onListClose = function() {
		var aSelectedKeys = [], aSelectedItems, sSortedSelectedKeys, sSortedCachedSelections, bFilterChanged;
		aSelectedItems = oFacetFilterList.getSelectedItems();
		aSelectedKeys = aSelectedItems.map(function(oItem) {
			return oItem.getKey();
		});
		sSortedSelectedKeys = JSON.stringify(aSelectedKeys.sort());
		sSortedCachedSelections = JSON.stringify(aCachedSelections.sort());
		bFilterChanged = (sSortedSelectedKeys !== sSortedCachedSelections);
		//After comparison of cached and current selections, if filters changed update the cached keys and set the selected keys on the filter
		if (bFilterChanged) {
			aCachedSelections = aSelectedKeys;
			this.setSelectedFFValues(aSelectedKeys);
			oUiApi.selectionChanged(true);
		}
	};
	/**
	* @public
	* @function
	* @name sap.apf.ui.utils.FacetFilterHandler#onListOpen
	* @description Populates the facet filter list with the current values and selections
	* */
	this.onListOpen = function() {
		oFacetFilterList.setBusy(true);
		this.getFacetFilterListData().done(function(aFilterValues, sSelectProperty, oPropertyMetadata){
			_populateValues(aFilterValues, sSelectProperty, oPropertyMetadata);
			oFacetFilterList.setBusy(false);
		});
	};
};