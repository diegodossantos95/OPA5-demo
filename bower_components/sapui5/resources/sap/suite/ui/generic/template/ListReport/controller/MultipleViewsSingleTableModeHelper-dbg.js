sap.ui.define(["jquery.sap.global", "sap/ui/base/Object"],
	function(jQuery, BaseObject) {
		"use strict";

		/*
		 * This class is a helper class for the controller of the ListReport. More, precisely an instance of
		 * this class is created in onInit of the ListReport controller. That controller forwards all tasks
		 * connected to the single table mode of the multiple views feature to this instance.
		 * Note that, if the mode is switched on, it is realized either by a sap.m.SegmentedButton or by a sap.m.Select.
		 * The decision which control is used is taken while the view is templated. Thus, it is already available when the
		 * corresponding instance is created.
		 */

		function getMethods(oState, oController, oTemplateUtils) {
			// Begin: Instance variables
			
			// Variables set in the constructor and not changed afterwards
			var oImplementingControl; // the control (SegmentedButton or Select) realizing the feature (resp. undefined if mode is not switched on)
			var aPossibleItems; // list of items belonging either to oImplementingControl (resp. undefined if the mode is not switched on).
			var bIsControlSegmentedButton; // true if the logic is realized via a SegmentedButton
			var fnOnDataReceived = jQuery.noop; // default. Will be overwritten in constructor, if necessary
			var mItemData;
			
			// Variables representing the current state
			var oCurrentBindingParams = {}; // to send the correct $count requests, we need to access the current binding parameters

			// End: Instance variables

			// Begin private instance methods
			
			// Update the texts on all buttons/variants
			function fnUpdateCounts() {
				var oModel = oState.oSmartTable.getModel();
				var sTableEntitySet = oState.oSmartTable.getEntitySet();
				var sSearchValue = oState.oSmartFilterbar.getBasicSearchValue();
				var oSearch = {};
				if (sSearchValue !== "") {
					oSearch = {
						"search": sSearchValue
					};
				}
				for (var sKey in mItemData) {
					var oItemData = mItemData[sKey];
					oItemData.numberOfUpdates++;
					oItemData.updateStartFunction(oItemData.numberOfUpdates); // set counter busy
					var aFilters = oCurrentBindingParams.filters.concat(oItemData.selectionVariantFilters); // note, that this does not modify the arrays which are concatenated
					oModel.read("/" + sTableEntitySet + "/$count", {
						urlParameters: oSearch,
						filters: aFilters,
						groupId: "updateMultipleViewSingleTableModeItemCounts",
						success: oItemData.updateSuccessFunction.bind(null, oItemData.numberOfUpdates),
						error: oItemData.errorFunction.bind(null, oItemData.numberOfUpdates)
					});
				}
			}
			
			function onBeforeRebindTable(oEvent) {
				if (!oImplementingControl){ // do not do anything, if mode is switched off
					return;
				}
				var oBindingParams = oEvent.getParameter("bindingParams"); 
				oCurrentBindingParams.filters = oBindingParams.filters.slice(0); // copy filters
				var sKey = oImplementingControl.getSelectedKey();
				var oItemData = mItemData[sKey];
				var aSelectionVariantFilters = oItemData.selectionVariantFilters;
				for (var i in aSelectionVariantFilters) {
					oBindingParams.filters.push(aSelectionVariantFilters[i]);
				}
			}
			
			// event which is raised, when selection is changed
			function onAfterVariantChanged(oEvent) {
				if (bIsControlSegmentedButton){ // in SegmentedButton case the state of the button needs to be updated
					var oSButton = oEvent.getSource();
					var oSegmentedButton = oSButton.getParent();
					oSegmentedButton.setSelectedKey(oSButton.getKey());					
				}
				var bSearchButtonPressed = oState.oIappStateHandler.areDataShownInTable(); 
				if (bSearchButtonPressed) {
					//				as a new variant is selected, we need both - rebind and refresh
					oState.oSmartTable.rebindTable();
					oTemplateUtils.oCommonUtils.refreshSmartTable(oState.oSmartTable);
				}
				oState.oIappStateHandler.changeIappState(true, bSearchButtonPressed);
			}
			
			function fnDetermineSortOrder(){
				if (!oImplementingControl){ // do not do anything, if mode is switched off
					return null;
				}
				var sKey = oImplementingControl.getSelectedKey();
				var oItemData = mItemData[sKey];
				return oItemData.templateSortOrder;
			}
			
			// Functions for storing and restoring the state of the controls
			
			function getState(){
				return oImplementingControl && {
					selectedKey: oImplementingControl.getSelectedKey()
				};
			}
			
			function fnRestoreState(oDataToRestore){
				if (!oDataToRestore || !oImplementingControl || !oDataToRestore.selectedKey){
					return;
				}
				oImplementingControl.setSelectedKey(oDataToRestore.selectedKey);
			}
			
			// End of functions for storing and restoring the state of the controls
			
			function getVariantSelectionKey(){
				return oImplementingControl && oImplementingControl.getSelectedKey();	
			}
			
			// formatter for the text on the items
			function formatItemTextForMultipleView(oItemDataModel){
				if (!oItemDataModel){
					return "";
				}
				if (oItemDataModel.state === "error"){
					return oTemplateUtils.oCommonUtils.getText("SEG_BUTTON_ERROR", oItemDataModel.text);
				}
				return oTemplateUtils.oCommonUtils.getText("SEG_BUTTON_TEXT", [oItemDataModel.text, oItemDataModel.state === "busy" ? "..." : oItemDataModel.count]);
			}
			
			// End private instance methods

			(function() { // constructor coding encapsulated in order to reduce scope of helper variables 
				var oConfig = oController.getOwnerComponent().getAppComponent().getConfig();
				var oSettings = oConfig && oConfig.pages[0] && oConfig.pages[0].component && oConfig.pages[0].component.settings;
				var oQuickVariantSelection = oSettings && oSettings.quickVariantSelection;
				if (!oQuickVariantSelection) { // no segmented buttons configured
					return;
				}
				if (!oQuickVariantSelection.variants) {
					throw new Error("Defining QuickVariantSelection without variants in the manifest is not allowed.");
				}
				if (oSettings.quickVariantSelectionX) {
					throw new Error("Defining both QuickVariantSelection and QuickVariantSelectionX in the manifest is not allowed.");
				}
				
				oImplementingControl = oController.byId("template::VariantSelect");
				bIsControlSegmentedButton = !oImplementingControl;
				oImplementingControl = oImplementingControl || oController.byId("template::SegmentedButton");

				aPossibleItems = oImplementingControl.getItems();
				jQuery.sap.log.info("This list supports multiple views with single table");
				var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
				var mItemDataModel = Object.create(null);
				mItemData = Object.create(null);
				var getUpdateFunction = function(sPath, oItemData){
					return function(sState, iNumberOfUpdates, iNewCount){
						if (oItemData.numberOfUpdates !== iNumberOfUpdates){ // this is the response for an outdated request
							return;
						}
						var oItemDataModel = jQuery.extend({}, oTemplatePrivateModel.getProperty(sPath)); // must create a new instance. Otherwise UI5 will not recognize the change
						oItemDataModel.state = sState;
						if (!sState){
							oItemDataModel.count = iNewCount;	
						}
						oTemplatePrivateModel.setProperty(sPath, oItemDataModel);
					};
				};
				for (var i = 0; i < aPossibleItems.length; i++) {
					var oItem = aPossibleItems[i];
					var sKey = oItem.getKey();
					var oItemData = {
						selectionVariantFilters: oTemplateUtils.oCommonUtils.getSelectionVariantFilters(oState.oSmartTable, oItem),
						templateSortOrder: oTemplateUtils.oCommonUtils.getElementCustomData(oItem).TemplateSortOrder
					};
					mItemData[sKey] = oItemData;
					if (oQuickVariantSelection.showCounts){
						var fnUpdateFunction = getUpdateFunction("/listReport/multipleViewsSingleTableMode/" + sKey, oItemData);
						oItemData.numberOfUpdates = 0;
						oItemData.updateStartFunction = fnUpdateFunction.bind(null, "busy");
						oItemData.updateSuccessFunction = fnUpdateFunction.bind(null, "");
						oItemData.errorFunction = fnUpdateFunction.bind(null, "error");
						mItemDataModel[sKey] = {
							text: oTemplateUtils.oCommonUtils.getElementCustomData(oItem).text,
							count: 0,
							state: ""
						};
					}
				}
				if (oQuickVariantSelection.showCounts){
					// Move initial setup of model entry to a point in time, when the creation of the instance is finished, since this will trigger synchronous formatter calls, which are forwarded to this instance
					setTimeout(oTemplatePrivateModel.setProperty.bind(oTemplatePrivateModel, "/listReport/multipleViewsSingleTableMode", mItemDataModel), 0);					
					fnOnDataReceived = fnUpdateCounts;	
				}
			})();

			// public instance methods
			return {
				onDataReceived: fnOnDataReceived,
				onBeforeRebindTable: onBeforeRebindTable,
				onAfterVariantChanged: onAfterVariantChanged,
				determineSortOrder: fnDetermineSortOrder,
				formatItemTextForMultipleView: formatItemTextForMultipleView,
				getState: getState,
				restoreState: fnRestoreState,
				getVariantSelectionKey: getVariantSelectionKey
			};
		}

		return BaseObject.extend("sap.suite.ui.generic.template.ListReport.controller.MultipleViewsSingleTableModeHelper", {
			constructor: function(oState, oController, oTemplateUtils) {
				jQuery.extend(this, getMethods(oState, oController, oTemplateUtils));
			}
		});
	});