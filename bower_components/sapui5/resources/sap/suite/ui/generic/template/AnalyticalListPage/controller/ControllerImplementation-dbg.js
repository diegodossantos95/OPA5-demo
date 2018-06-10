/* global hasher sap */
sap.ui.define(["jquery.sap.global", "sap/ui/base/Object", "sap/ui/model/json/JSONModel", "sap/m/ObjectIdentifier", "sap/m/Table",
		"sap/m/Text", "sap/ui/comp/smartfield/SmartField", "sap/ui/generic/app/navigation/service/SelectionVariant",
		"sap/ui/base/EventProvider",
		"sap/suite/ui/generic/template/AnalyticalListPage/extensionAPI/ExtensionAPI", "sap/ui/core/ResizeHandler",
		"sap/suite/ui/generic/template/AnalyticalListPage/controller/FilterBarController",
		"sap/suite/ui/generic/template/AnalyticalListPage/controller/ToolbarController",
		"sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterBarController",
		"sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterDialogController",
		"sap/suite/ui/generic/template/lib/MessageUtils",
		"sap/m/MessageBox", "sap/ui/table/Table", "sap/ui/table/AnalyticalTable",
		"sap/ui/model/odata/AnnotationHelper",
		"sap/ui/model/analytics/odata4analytics",
		"sap/suite/ui/generic/template/AnalyticalListPage/util/ModelUtil",
		"sap/suite/ui/generic/template/AnalyticalListPage/controller/ContentAreaController",
		"sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil"
	],
    function(jQuery, BaseObject, JSONModel, ObjectIdentifier, Table, Text, SmartField, SelectionVariant, EventProvider, ExtensionAPI, ResizeHandler,
			FilterBarController, ToolbarController, VisualFilterBarController, VisualFilterDialogController,MessageUtils, MessageBox, UiTable, AnalyticalTable,
			ODataAnnotationHelper, Analytics, ModelUtil, ContentAreaController, FilterUtil) {
		"use strict";

		// Constants which are used as property names for storing custom filter data and generic filter data
		var customDataPropertyName  = "sap.suite.ui.generic.template.customData",
			genericDataPropertyName = "sap.suite.ui.generic.template.genericData",
			CONTAINER_VIEW_CHART	= "chart",
			FILTER_MODE_VISUAL      = "visual",
			FILTER_MODE_COMPACT     = "compact",
			FILTER                  = "Filter";

		function fnNullify(oObject) {
			if (oObject) {
				for (var sProp in oObject) {
					oObject[sProp] = null;
				}
			}
		}

		return {
			getMethods: function(oViewProxy, oTemplateUtils, oController) {
				var oState = {};// contains attributes oSmartFilterbar and oSmartTable. Initialized in onInit.
				var bIsTransferringUrlStateToPageState = false;
				var oStoringInformation = null;
				var sAppStateKeyInUrl = null;
				var oRealizedAppState = { // this object contains information which can be derived from url
					appStateKey: "",      // it represents the last url-state which has been adopted by the UI
					urlParams: {}
					//LR is storing some additional information like table variant id in this object, in ALP it is not required
				};
				// To prevent multiple calls to app state handler on initial load.
				var bTableInitialized = false;
				var bChartInitialized = false;
				var bSVMLoaded        = false;

				// Helper Functions

				function getFilterState() {
					var oCustomAndGenericData = {};
					oCustomAndGenericData[customDataPropertyName] = {};
					var oTemplatePrivate = oState.oController.getOwnerComponent().getModel("_templPriv");
					//Adding chartVariantId , filterMode and containerView to the generic data
					//because of the limitation of NavigationHandler
					oCustomAndGenericData[genericDataPropertyName] = {
						chartVariantId: oState.oSmartChart && oState.oSmartChart.getCurrentVariantId(),
						filterMode: oTemplatePrivate.getProperty('/alp/filterMode'),
						contentView: oTemplatePrivate.getProperty('/alp/contentView'),
						autoHide: oTemplatePrivate.getProperty('/alp/autoHide')
					};
					var oEditStateFilter = oController.byId("editStateFilter");
					if (oEditStateFilter) {
						oCustomAndGenericData[genericDataPropertyName].editStateFilter = oEditStateFilter.getSelectedKey();
					}
					// extension is responsible for retrieving custom filter state. The method has a more generic name
					// for historical reasons (change would be incompatible).
					oController.getCustomAppStateDataExtension(oCustomAndGenericData[customDataPropertyName]);
					return oCustomAndGenericData;
				}

				function getCurrentAppState() {
					/*
					 * Special handling for selection fields, for which defaults are defined: If a field is visible in the
					 * SmartFilterBar and the user has cleared the input value, the field is not included in the selection
					 * variant, which is returned by getDataSuiteFormat() of the SmartFilterBar. But since it was cleared by
					 * purpose, we have to store the selection with the value "", in order to set it again to an empty value,
					 * when restoring the selection after a back navigation. Otherwise, the default value would be set.
					 */
					var oSelectionVariant = new SelectionVariant(oState.oSmartFilterbar.getDataSuiteFormat());
					var aVisibleFields = oController.getVisibleSelectionsWithDefaults();
					for (var i = 0; i < aVisibleFields.length; i++) {
						if (!oSelectionVariant.getValue(aVisibleFields[i])) {
							oSelectionVariant.addSelectOption(aVisibleFields[i], "I", "EQ", "");
						}
					}
					//BCP: 1780225744 If variant is dirty and if the selection variant has id, making the same empty. For the filters to be applied correctly
					if (oState.oController.byId('template::PageVariant').currentVariantGetModified() && oSelectionVariant.getID()){
						oSelectionVariant.setID("");
					}
					return {
						selectionVariant: oSelectionVariant.toJSONString(),
						tableVariantId: oState.oSmartTable && oState.oSmartTable.getCurrentVariantId(),
						customData: getFilterState()
					};
				}

				/**
				 * This function store the app state url
				 * @return {void}
				 */
				function fnStoreCurrentAppStateAndAdjustURL() {
					// oCurrentAppState is optional
					// - nothing, if NavigationHandler not available
					// - adjusts URL immediately
					// - stores appState for this URL (asynchronously)
					var oCurrentAppState  = getCurrentAppState();
					// currently NavigationHandler raises an exception when ushellContainer is not available, should be changed
					// by
					// Denver
					try {
						//storage information object
						oStoringInformation =  oTemplateUtils.oCommonUtils.getNavigationHandler().storeInnerAppStateWithImmediateReturn(oCurrentAppState);
					} catch (err) {
						jQuery.sap.log.error("AnalyticalListPage.fnStoreCurrentAppStateAndAdjustURL: " + err);
					}
					if (oStoringInformation instanceof sap.ui.generic.app.navigation.service.NavError) {
						oStoringInformation = null;
						return;
					}
					//LR is using replaceHash function of NavigationHandler to update the key.
					//LR’s logic is creating the navigation promise and triggering the resolve function on every app state change
					//For ALP that logic will create performance issue. So using a different logic 
					if (sAppStateKeyInUrl !== oStoringInformation.appStateKey) {
						//No need to wait for oStoringInformation.promise, app state is directly accessible from oStoringInformation object
						oRealizedAppState.appStateKey = oStoringInformation.appStateKey;
					}
				}

				// -- Begin of methods that are used in onInit only
				function fnSetIsLeaf() {
					var oComponent = oController.getOwnerComponent();
					var oTemplatePrivateModel = oComponent.getModel("_templPriv");
					oTemplatePrivateModel.setProperty("/listReport/isLeaf", oComponent.getIsLeaf());
				}

				function fnSetShareModel() {
					var fnGetUser = jQuery.sap.getObject("sap.ushell.Container.getUser");
					var oManifest = oController.getOwnerComponent().getAppComponent().getMetadata().getManifestEntry("sap.ui");
					var sBookmarkIcon = (oManifest && oManifest.icons && oManifest.icons.icon) || "";
					// share Model: holds all the sharing relevant texts and info used in the XML view
					var oShareInfo = {
						// BOOKMARK
						bookmarkIcon: sBookmarkIcon,
						bookmarkCustomUrl: function() {
							fnStoreCurrentAppStateAndAdjustURL();
							return hasher.getHash() ? ("#" + hasher.getHash()) : window.location.href;
						},
						bookmarkServiceUrl: function() {
							var oTable = oState.oSmartTable.getTable();
							var oBinding;
							if (oTable) {
								oBinding = oTable.getBinding("rows") || oTable.getBinding("items");
							} else {
								oBinding = "";  // ToDo : Add Chart Count/context based on clarification.
							}
							return oBinding ? oBinding.getDownloadUrl() + "&$top=0&$inlinecount=allpages" : "";
						},
						// JAM
						isShareInJamActive: !!fnGetUser && fnGetUser().isJamActive()
					};
					var oTemplatePrivateModel = oController.getOwnerComponent().getModel("_templPriv");
					oTemplatePrivateModel.setProperty("/listReport/share", oShareInfo);
				}
				// -- End of used in onInit only

				function fnRestoreGenericFilterState(oGenericData) {
					if (oGenericData && oGenericData.editStateFilter !== undefined) {
						var oEditStateFilter = oController.byId("editStateFilter");
						if (oEditStateFilter) {
							oEditStateFilter.setSelectedKey((oGenericData.editStateFilter === null) ? 0 : oGenericData.editStateFilter);
						}
					}
					var oTemplatePrivate = oState.oController.getOwnerComponent().getModel("_templPriv");
					if (oGenericData.chartVariantId && oState.oSmartChart) {
						oState.oSmartChart.setCurrentVariantId(oGenericData.chartVariantId);
					}
					if (oGenericData.filterMode) {
						oTemplatePrivate.setProperty('/alp/filterMode', oGenericData.filterMode);
						oState.filterBarController.handleFilterSwitch(oGenericData.filterMode);
					} else {
						fnSetDefaultFilter();
					}
					if (oGenericData.contentView) {
						oTemplatePrivate.setProperty('/alp/contentView', oGenericData.contentView);
					}
					if (oGenericData.autoHide) {
						oTemplatePrivate.setProperty('/alp/autoHide', oGenericData.autoHide);
						//TODO RC Do we need to refresh table binding to change the highlight / filter behaviour
					}
				}

				// method is responsible for retrieving custom filter state. The correspomding extension-method has a more generic name
				// for historical reasons (change would be incompatible).
				function fnRestoreCustomFilterState(oCustomData) {
					oController.restoreCustomAppStateDataExtension(oCustomData || {});
				}

				// This method is responsible for restoring the data which have been stored via getFilterState.
				// However, it must be taken care of data which have been stored with another (historical) format.
				// Therefore, it is checked whether oCustomAndGenericData possesses two properties with the right names.
				// If this is this case it is assumed that the data have been stored according to curreent logic. Otherwise, it is
				// assumed that the data have been stored with the current logic. Otherwise, it is assumed that the properties have been
				// stored with a logic containing only custom properties (with possible addition of _editStateFilter).
				function fnRestoreFilterState(oCustomAndGenericData) {
					oCustomAndGenericData = oCustomAndGenericData || {};
					if (oCustomAndGenericData.hasOwnProperty(customDataPropertyName) && oCustomAndGenericData.hasOwnProperty(genericDataPropertyName)) {
						fnRestoreGenericFilterState(oCustomAndGenericData[genericDataPropertyName]);
						fnRestoreCustomFilterState(oCustomAndGenericData[customDataPropertyName]);
					} else { // historic format. May still have property _editStateFilter which was used generically.
						if (oCustomAndGenericData._editStateFilter !== undefined) {
							fnRestoreGenericFilterState({
								editStateFilter: oCustomAndGenericData._editStateFilter
							});
							delete oCustomAndGenericData._editStateFilter;
						}
						fnSetDefaultFilter();
						fnRestoreCustomFilterState(oCustomAndGenericData);
					}
				}

				var oParseNavigationPromise;


				function determineDefaultValues(oEntityType, sTerm) {
					var aProperties = oEntityType && oEntityType.property;
					return aProperties.filter(function(property) {
						return typeof property[sTerm] !== "undefined";
					});
				}

				function createDefaultFilter(oSmartFilterbar) {
					var oModel = oSmartFilterbar.getModel(),
						oMetaModel = oModel && oModel.getMetaModel(),
						oResultEntityType = oMetaModel && oMetaModel.getODataEntityType(oSmartFilterbar.getEntityType()),
						sResultEntityType = oMetaModel && oMetaModel.getODataEntityType(oSmartFilterbar.getEntityType(), true),
						aResultDefaultProperties = oResultEntityType && determineDefaultValues(oResultEntityType, "com.sap.vocabularies.Common.v1.FilterDefaultValue"),
						oDataSuiteFormat, o4AnaModel, oParameterization, oParameterEntitySet, oParameterEntityType,
						oQueryResult, aParameterDefaultProperties = [];

					try {
						//Find the parameter set and check the properties
						o4AnaModel = new Analytics.Model(new Analytics.Model.ReferenceByModel(oModel));
						oQueryResult = o4AnaModel && o4AnaModel.findQueryResultByName(oSmartFilterbar.getEntitySet());
						oParameterization = oQueryResult && oQueryResult.getParameterization();
						oParameterEntitySet = oParameterization && oMetaModel.getODataEntitySet(oParameterization.getEntitySet().getQName());
						oParameterEntityType = oParameterEntitySet && oMetaModel.getODataEntityType(oParameterEntitySet.entityType);
						aParameterDefaultProperties = oParameterEntityType ? determineDefaultValues(oParameterEntityType, "defaultValue") : [];
					} catch (e) {
						jQuery.sap.log.Error(e);
					}

					if (aResultDefaultProperties.length > 0 || aParameterDefaultProperties.length > 0) {
						oDataSuiteFormat = {
							"SelectOptions": [],
							"Parameters": []
						};

						aResultDefaultProperties.forEach(function (property) {
							var oContext = oMetaModel.createBindingContext(sResultEntityType + "/property/[${path:'name'}===\'" + property.name + "']/com.sap.vocabularies.Common.v1.FilterDefaultValue"),
								oSelectOption = {
									"PropertyName": property.name,
									"Ranges": [{
										"Sign": "I",
										"Option": "EQ",
										"Low": ODataAnnotationHelper.format(oContext),
										"High": null
									}]
								};
							oDataSuiteFormat.SelectOptions.push(oSelectOption);
						});

						aParameterDefaultProperties.forEach(function (property) {
							var //oContext = oMetaModel.createBindingContext(sParameterEntityType + "/property/[sap.suite.ui.generic.template===\'" + property.name + "']/DefaultValue"),
								oParameter = {
									"PropertyName": "$Parameter." + property.name,
									"PropertyValue": property.defaultValue//Seems I can't use the formatter here ODataAnnotationHelper.format(oContext)
								};
							oDataSuiteFormat.Parameters.push(oParameter);
						});
					}
					return oDataSuiteFormat;

				}

				function fnSetDefaultFilter() {
					var oTemplatePrivate = oState.oController.getOwnerComponent().getModel("_templPriv"),
						defaultFilterMode = oState.oSmartFilterbar.isCurrentVariantStandard() ? oState.oController.getOwnerComponent().getDefaultFilterMode() : oTemplatePrivate.getProperty('/alp/filterMode');
					//If the App Developer wants to hide Visual Filter, switch to Compact Filter
					if (defaultFilterMode === FILTER_MODE_VISUAL && oState.hideVisualFilter) {
						jQuery.sap.log.error("Visual filter is hidden defaulting to compact");
						defaultFilterMode = FILTER_MODE_COMPACT;
					}
					oState.filterBarController.setDefaultFilter(defaultFilterMode);
				}

				function fnCheckToLaunchDialog() {
					var oTemplatePrivate = oState.oController.getOwnerComponent().getModel("_templPriv");
					if (oTemplatePrivate.getProperty('/alp/filterMode') === FILTER_MODE_VISUAL) {
						if (!oTemplatePrivate.getProperty("/alp/searchable")) { //If missing mandatory or parameters
							oState.oSmartFilterbar.showFilterDialog();
						}
					}
				}

				function onSmartFilterBarInitialise(oEvent){
					var oSmartFilterbar = oEvent.getSource(),
						oDefaultFilterSuiteFormat = createDefaultFilter(oSmartFilterbar);
					//Set default values if available
					if (oDefaultFilterSuiteFormat) {
						oSmartFilterbar.setDataSuiteFormat(JSON.stringify(oDefaultFilterSuiteFormat), true);
					}
					oParseNavigationPromise  = oTemplateUtils.oCommonUtils.getNavigationHandler().parseNavigation();
					oController.onInitSmartFilterBarExtension(oEvent);
				}
				function fnCheckMandatory(){
					//check if smartfilterbar is searchable only after it has been initialized.
					if (oState.oSmartFilterbar.isInitialised()) {
						oState.oSmartFilterbar.checkSearchAllowed(oState);
					}
				}

				function fnUpdateSVFB() {
					// If filter mode is visual and if mandatory fields/params are not filled launch CompactFilter Dialog
					fnCheckMandatory();
					fnCheckToLaunchDialog();
					// set filter model so that default values (user settings etc.) can also be accounted for
					var filterModel = oState.oController.getOwnerComponent().getModel("_filter");
					filterModel.setData(jQuery.extend(true, {}, oState.oSmartFilterbar.getFilterData(true)));
					oState.filterBarController._updateFilterLink();
					//Update Binding in chart Items in Smart Visual Filter Bar
					if (oState.alr_visualFilterBar && oState.alr_visualFilterBar.updateVisualFilterBindings) {
						oState.alr_visualFilterBar.updateVisualFilterBindings(true);
					}
				}

				/**
				 * This function add the display currency field
				 * @param {object} oSelectionVariant
				 * @param {object} oAppData
				 * @return {void}
				 */
				function addDisplayCurrency(oSelectionVariant, oAppData) {
					var mandatoryFilterItems = oState.oSmartFilterbar.determineMandatoryFilterItems();
					var displayCurrency;
					for (var item = 0;item < mandatoryFilterItems.length; item++) {
						if (mandatoryFilterItems[item].getName().indexOf("$Parameter.P_DisplayCurrency") !== -1) {
							var sCurrency = oAppData.oSelectionVariant.getSelectOption("DisplayCurrency");
							if (sCurrency && sCurrency[0] && sCurrency[0].Low) {
								displayCurrency = sCurrency[0].Low;
							} else if (FilterUtil.readProperty(oAppData,"oDefaultedSelectionVariant._mSelectOptions.DisplayCurrency.0.Low")) {
								displayCurrency = oAppData.oDefaultedSelectionVariant._mSelectOptions.DisplayCurrency[0].Low;
							}
							if (displayCurrency) {
								oSelectionVariant.addParameter("$Parameter.P_DisplayCurrency", displayCurrency);
							}
							if (oState.alr_visualFilterBar && displayCurrency) {
								oState.alr_visualFilterBar.setDisplayCurrency(displayCurrency);
							}
							break;
						}
					}
				}

				/**
				 * This function apply selection properties to the smart filter bar
				 * @param  {object} oSelectionVariant
				 * @return {void}
				 */
				function applySelectionProperties(oSelectionVariant) {
					var aSelectionVariantProperties = oSelectionVariant.getParameterNames().concat(oSelectionVariant.getSelectOptionsPropertyNames());
					for (var i = 0; i < aSelectionVariantProperties.length; i++) {
						oState.oSmartFilterbar.addFieldToAdvancedArea(aSelectionVariantProperties[i]);
					}
					// add filters to visual filter basic area if not already added
					if (oState.alr_visualFilterBar) {
						oState.alr_visualFilterBar.addVisualFiltersToBasicArea(aSelectionVariantProperties);
					}
				}

				/**
				 * This function update the smart filter bar
				 * @param  {object} oSelectionVariant
				 * @return {void}
				 */
				function updateSmartFilterBar(oSelectionVariant) {
					// A default variant could be loaded.
					// Do not clear oSmartFilterbar.clearVariantSelection and oSmartFilterbar.clear due to BCP 1680012595 is not valid anymore
					// with BCP 1670406892 it was made clear that both clear are needed when this GIT change 1941921 in navigation handler is available
					oState.oSmartFilterbar.clearVariantSelection();
					oState.oSmartFilterbar.clear();
					// oSelectionVariant object is used in place of oAppData.selectionVariant
					// because we add a Parameter to the SelectionVariant if user settings
					// specify a DisplayCurrency.
					oState.oSmartFilterbar.setDataSuiteFormat(oSelectionVariant.toJSONString(), true);
				}

				/**
				 * This function trigger the merge
				 * @return {void}
				 */
				function triggerMerge() {
					var oCompactFilterData = jQuery.extend(true, {}, oState.oSmartFilterbar.getFilterData(true)),
					filterModel = oState.oController.getOwnerComponent().getModel("_filter");
					filterModel.setData(oCompactFilterData);
					oState.filterBarController._updateFilterLink();
				}

				/**
				 * This function resolve the app state promise
				 * @param  {object} oAppData       app data
				 * @param  {object} oURLParameters url parameters
				 * @param  {string} sNavType       navigation type
				 * @return {void}
				 */
				function resolveAppStatePromise (oAppData, oURLParameters, sNavType) {
					oState.oSmartFilterbar.setSuppressSelection(false);
					var sAppStateKey = oAppData.appStateKey || "";
					//Make sure that no two resolve functions are executing at the same time.
					if (bIsTransferringUrlStateToPageState){
						return;
					}
					sAppStateKeyInUrl = sAppStateKey;
					bIsTransferringUrlStateToPageState = true;
					var oNewUrlParameters = (!sAppStateKey && oURLParameters) || {};
					if (sNavType !== sap.ui.generic.app.navigation.service.NavType.initial) {
						var bHasOnlyDefaults = oAppData && oAppData.bNavSelVarHasDefaultsOnly;
						var oSelectionVariant = new SelectionVariant(oAppData.selectionVariant);
						addDisplayCurrency(oSelectionVariant, oAppData);
						applySelectionProperties(oSelectionVariant);
						//according to BCP 1770187504, 1670373497 and 1670406892 '|| oState.oSmartFilterbar.isCurrentVariantStandard() is needed
						if (!bHasOnlyDefaults || oState.oSmartFilterbar.isCurrentVariantStandard()) {
							updateSmartFilterBar(oSelectionVariant);
						}
						if (oAppData.tableVariantId && oState.oSmartTable) {
							oState.oSmartTable.setCurrentVariantId(oAppData.tableVariantId);
						}
						//in case of visual filter mode triggering the merge
						var oTemplatePrivate = oState.oController.getOwnerComponent().getModel("_templPriv");
						if ( sNavType === sap.ui.generic.app.navigation.service.NavType.xAppState && oTemplatePrivate.getProperty('/alp/filterMode') === FILTER_MODE_VISUAL) {
							triggerMerge();
						}
						if (oAppData.customData) {
							fnRestoreFilterState(oAppData.customData);
						} else {
							fnSetDefaultFilter();
						}
						if (!bHasOnlyDefaults) {
							oState.oSmartFilterbar.search();
						}
						oRealizedAppState = {
							appStateKey: sAppStateKey,
							urlParams: oNewUrlParameters
						};
					} else {
						fnSetDefaultFilter();
					}
					fnUpdateSVFB();
					oStoringInformation = null;
					bIsTransferringUrlStateToPageState = false;
				}

				function onSmartFilterBarInitialized(){
					try {
						oParseNavigationPromise.done(resolveAppStatePromise);
						oParseNavigationPromise.fail(function(oError) {
							if (oError instanceof Error) {
								oError.showMessageBox();
							}
							// Set Default filter when app state fails (if filter mode is visual) and if mandatory fields/params are not filled launch CompactFilter Dialog
							fnSetDefaultFilter();
							fnUpdateSVFB();
						});

					} catch (oException) {
						// In case the app is launched outside of launch pad the navigation promise will throw exception
						// Set Default filter when app state fails (if filter mode is visual) and if mandatory fields/params are not filled launch CompactFilter Dialog
						fnSetDefaultFilter();
						fnUpdateSVFB();
					}
				}

				// Generation of Event Handlers
				return {
					onInit: function() {
						var oComponent = oController.getOwnerComponent();

						var oTemplatePrivateModel = oComponent.getModel("_templPriv");
						oTemplatePrivateModel.setProperty("/alp", {
							filterMode: oComponent.getHideVisualFilter() ? FILTER_MODE_COMPACT : oComponent.getDefaultFilterMode(),
							contentView: oComponent.getDefaultContentView(),
							autoHide: oComponent.getAutoHide()
						});
						oState.hideVisualFilter = oComponent.getHideVisualFilter();
						oState.hideVisualFilter = (oState.hideVisualFilter === undefined || oState.hideVisualFilter !== true) ? false : true;

						oState.oSmartFilterbar = oController.byId("template::SmartFilterBar");
						oState.oSmartTable = oController.byId("table");
						oState.oPage = oController.byId("template::Page");
						oState.oSmartChart = oController.byId("chart");
						oState.alr_compactFilterContainer = oController.byId("template::CompactFilterContainer");
						oState.alr_visualFilterContainer = oController.byId("template::VisualFilterContainer");
						oState.alr_filterContainer = oController.byId("template::FilterContainer");
						oState.alr_visualFilterBar = oController.byId("template::VisualFilterBar");
						if (oState.alr_visualFilterBar) {
							oState.alr_visualFilterBar.setSmartFilterId(oState.oSmartFilterbar.getId());
						}
						oState.oKpiTagContainer = oController.byId("template::KpiTagContainer");
						if (oState.oKpiTagContainer) {
							jQuery.sap.require("sap.suite.ui.generic.template.AnalyticalListPage.controller.KpiTagController");
							sap.suite.ui.generic.template.AnalyticalListPage.controller.KpiTagController.init(oState);
						}
						oState.oContentArea = new ContentAreaController();
						oState.oTemplateUtils = oTemplateUtils;
						oState.toolbarController = new ToolbarController();
						oState.oController = oController;
						oState.filterBarController = new FilterBarController();
						oState.filterBarController.init(oState);
						oState.oContentArea.createAndSetCustomModel(oState);
						oState.oContentArea.setState(oState);
						if (!oState.hideVisualFilter) {
							oState.visualFilterBarContainer = new VisualFilterBarController();
							oState.visualFilterBarContainer.init(oState);
						}

						fnSetIsLeaf();
						fnSetShareModel();

						oController.byId("template::FilterText").attachBrowserEvent("click", function () {
							oController.byId("template::Page").setHeaderExpanded(true);
						});

						oTemplatePrivateModel.setProperty("/listReport/isHeaderExpanded", true);

						//Making Condense is the default mode in ALP,but in List Report Compact is the default
						//compare the following logic with Application.js->getContentDensityClass:
						if (oState.oSmartTable) {
							var oTable = oState.oSmartTable.getTable();
						}
						var sCompactClass = "sapUiSizeCompact", sCondensedClass = "sapUiSizeCondensed";
						if ( oTable instanceof UiTable || oTable instanceof AnalyticalTable) {
							var oView = oController.getView();
							var oBody = jQuery(document.body);
							if (oBody.hasClass(sCompactClass) || oView.hasStyleClass(sCompactClass)) {
								var bCondensedTableLayout = oComponent.getComponentContainer().getSettings().condensedTableLayout;
								if (bCondensedTableLayout === false) {
									oState.oSmartTable.addStyleClass(sCompactClass);
								} else {
									oState.oSmartTable.addStyleClass(sCondensedClass);
								}
							}
						}

						/**
						 * This function return the URL parameter info
						 * @return {promise}
						 */
						oViewProxy.getUrlParameterInfo = function(){
							return oParseNavigationPromise.then(function(){
								if (oRealizedAppState.appStateKey){
									return {
										"sap-iapp-state": [oRealizedAppState.appStateKey]
									};
								}
								return oRealizedAppState.urlParams;
							});
						};

						// Give component access to below methods via oViewProxy
						oViewProxy.onComponentActivate = function(){
							//TODO Need to implements this as ListReport has implemented.
							//require to implements IappStateHandler to be implemented in ALP.
							/*if (!bIsStartingUp){
								oIappStateHandler.parseUrlAndApplyAppState();
							}*/
						};
						oViewProxy.refreshBinding = function(){
							//Update Binding in chart Items in Smart Filter Bar
							if (oState.alr_visualFilterBar && oState.alr_visualFilterBar.updateVisualFilterBindings) {
								oState.alr_visualFilterBar.updateVisualFilterBindings();
							}
							// Rebind chart
							if (oState.oSmartChart && oState.oSmartChart.rebindChart) {
								oState.oSmartChart.rebindChart();
							}
							// Rebind table
							if (oState.oSmartTable) {
								oTemplateUtils.oCommonUtils.refreshSmartTable(oState.oSmartTable);
							}
							//Refresh Kpi
							if (oState.oKpiTagContainer) {
								var aContent = oState.oKpiTagContainer.mAggregations.content;
								for (var i in aContent){
									if (aContent[i].getModelName && aContent[i].getModelName() === "kpi"){
										aContent[i]._firstTime = true;
										aContent[i].onBeforeRendering();
									}
								}
							}
						};

						//Update filter model so that UI can adapt on each filter change
						oState.oSmartFilterbar.attachFilterChange(function(oEvent) {
							//check the chart is initialized or not to get the drillStackFilters
							var drillFiltersFromChart = oState.oSmartChart && oState.oSmartChart.getChart() && oState.oSmartChart.getDrillStackFilters();
							//Ignore SmartChart selections based on drilldown
							if (drillFiltersFromChart && drillFiltersFromChart.length) {
								oState.oController.getOwnerComponent().getModel("_templPriv").setProperty('/alp/_ignoreChartSelections', false);
							} else {
								oState.oController.getOwnerComponent().getModel("_templPriv").setProperty('/alp/_ignoreChartSelections', true);
							}
							// check if search can be performed or not after filter change
							fnCheckMandatory();	//Check and update searchable property
							var sfb  = oEvent.getSource(),
							// get filter data for all fields so that model change via two-way binding does not
							// re-trigger set dimension filter in visual filter
							oAllFilterData = jQuery.extend(true, {}, sfb.getFilterData(true)),
							filterModel = oState.oController.getOwnerComponent().getModel("_filter");
							filterModel.setData(oAllFilterData);
							if (oEvent.getParameters().filterItem) { // call changeVisibility() only if a filterItem is added or deleted
								oState.filterBarController.changeVisibility(oEvent);
								// BCP: 1770556353 - When visibility of filter item is changed in dialog, search is triggered.
								//chart rebind is prevented; however table is rebound. In this case chart selection must be applied to table.
								oState.oController.getOwnerComponent().getModel("_templPriv").setProperty('/alp/_ignoreChartSelections', false);
							}
							oState.filterBarController._updateFilterLink();
						});
					},

					handlers: {
						onBack: function() {
							oTemplateUtils.oServices.oNavigationController.navigateBack();
						},
						addEntry: function(oEvent) {
							var oEventSource = oEvent.getSource();
							oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){
								oTemplateUtils.oCommonEventHandlers.addEntry(oEventSource, false, oState.oSmartFilterbar);
							}, jQuery.noop, oState);
						},
						deleteEntries: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.deleteEntries(oEvent);
						},
						onSelectionChange: function(oEvent) {
							var oTable = oEvent.getSource(),
								oModel = oTable.getModel(),
								oPrivModel = oTable.getModel("_templPriv");

							var oMetaModel = oModel.getMetaModel(),
								oEntitySet = oMetaModel.getODataEntitySet(this.getOwnerComponent().getEntitySet()),
								oDeleteRestrictions = oEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"];

							var sDeletablePath = (oDeleteRestrictions && oDeleteRestrictions.Deletable && oDeleteRestrictions.Deletable.Path) ? oDeleteRestrictions.Deletable.Path : "";
							var bDeleteEnabled = false;

							var bAllLocked = true;
							var bAllNotDeletable = (sDeletablePath && sDeletablePath !== ""); // if Deletable-Path is undefined, then the items are deletable.

							var aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oTable);
							if (aContexts.length > 0) {
								for (var i = 0; i < aContexts.length; i++) {
									var oObject = oModel.getObject(aContexts[i].getPath());

									// check if item is locked
									if (!(oObject.IsActiveEntity && oObject.HasDraftEntity && oObject.DraftAdministrativeData && oObject.DraftAdministrativeData.InProcessByUser)) {
										bAllLocked = false;
									}
									// check if item is deletable
									if (bAllNotDeletable) {
										if (oModel.getProperty(sDeletablePath, aContexts[i])) {
											bAllNotDeletable = false;
										}
									}
									if (!bAllLocked && !bAllNotDeletable) {
										bDeleteEnabled = true;
										break;
									}
								}
							}
							oPrivModel.setProperty("/listReport/deleteEnabled", bDeleteEnabled);

						},
						onChange: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onChange(oEvent);
						},
						onSmartFieldUrlPressed: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onSmartFieldUrlPressed(oEvent, oState);
						},
						onContactDetails: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onContactDetails(oEvent);
						},
						onSmartFilterBarInitialise: onSmartFilterBarInitialise,
						onSmartFilterBarInitialized: onSmartFilterBarInitialized,

						onEditStateFilterChanged: function(oEvent) {
							oEvent.getSource().fireChange();
						},
						onFilterPress: function(oEvent){
							oState.filterBarController.showDialog.call(oState.filterBarController);
						},
						onClearPress: function(oEvent){
							oState.filterBarController.clearFilters();
							oController.onClearFilterExtension(oEvent);
						},
						//Event handler for go button press
						onGoPress: function(oEvent){
							oState.filterBarController.onGoFilter();
						},

						onBeforeSFBVariantSave: function() {
							/*
							 * When the app is started, the VariantManagement of the SmartFilterBar saves the initial state in the
							 * STANDARD (=default) variant and therefore this event handler is called. So, even though the name of
							 * the event handler is confusing, we need to provide the initial state to allow the SmartFilterBar to
							 * restore it when needed (i.e. when the user clicks on restore). Thus, no check against STANDARD
							 * context is needed!
							 */
							var oCurrentAppState = getCurrentAppState();
							if (!this.getOwnerComponent().getProperty('smartVariantManagement')) {
								delete oCurrentAppState.customData["sap.suite.ui.generic.template.genericData"].contentView;
							}
							oState.oSmartFilterbar.setFilterData({
								_CUSTOM: oCurrentAppState.customData
							});
						},
						onAfterSFBVariantLoad: function() {
							var oData = oState.oSmartFilterbar.getFilterData();
							if (oData._CUSTOM !== undefined) {
								fnRestoreFilterState(oData._CUSTOM);
							} else {
								// make sure that the custom data are nulled for the STANDARD variant
								var oCustomAndGenericData = getFilterState();
								fnNullify(oCustomAndGenericData[customDataPropertyName]);
								fnNullify(oCustomAndGenericData[genericDataPropertyName]);
								fnRestoreFilterState(oCustomAndGenericData);
							}
							//No need to generate or save app state during initial load of application
							if (!bSVMLoaded && FilterUtil.isDefaultVariantSelected(oState)) {
								bSVMLoaded = true;
								return;
							} else if (!bSVMLoaded && !FilterUtil.isDefaultVariantSelected(oState)) {
								bSVMLoaded = true;
							}
							// store navigation context
							fnStoreCurrentAppStateAndAdjustURL();
						},
						onBeforeRebindTable: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onBeforeRebindTable(oEvent);
							oController.onBeforeRebindTableExtension(oEvent);
						},
						onBeforeRebindChart: function(oEvent) {
							//oState.oSmartChart.oModels = oState.oSmartChart.getChart().oPropagatedProperties.oModels;
						},
						onShowDetails: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onShowDetails(oEvent.getSource(), oState);
						},
						onListNavigate: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onListNavigate(oEvent.getSource(), oState);
						},
						onCallActionFromToolBar: function(oEvent) {
							// Since our content toolbar is detached from the SmartTable, the standard util function getParentTable
							// would not work in our case.  We need to override this function when this action is triggered from our table

							var getParentTable_orig = oTemplateUtils.oCommonUtils.getParentTable;
							oTemplateUtils.oCommonUtils.getParentTable = function(){return oState.oSmartTable;};
							oTemplateUtils.oCommonEventHandlers.onCallActionFromToolBar(oEvent, oState);
							oTemplateUtils.oCommonUtils.getParentTable = getParentTable_orig;
							getParentTable_orig = null;
						},
						onShowDetailsIntent: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onShowDetailsIntent(oEvent, oState.oSmartFilterbar);
						},
						onCallActionFromList: function(oEvent) {

						},
						onDataFieldForIntentBasedNavigation: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onDataFieldForIntentBasedNavigation(oEvent, oState);
						},
						onBeforeSemanticObjectLinkPopoverOpens: function(oEvent) {

							var oEventParameters = oEvent.getParameters();

							oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){
								//Success function
								var sSelectionVariant = oState.oSmartFilterbar.getDataSuiteFormat();
								oTemplateUtils.oCommonUtils.semanticObjectLinkNavigation(oEventParameters, sSelectionVariant, oController);
							}, jQuery.noop, oState, jQuery.noop);
						},
						onAssignedFiltersChanged: function(oEvent) {
							if (oEvent && oEvent.getSource()) {
								if (oState && oState.oSmartFilterbar && oState.filterBarController) {
									oController.byId("template::FilterText").setText(oState.oSmartFilterbar.retrieveFiltersWithValuesAsText());
								}
							}
						},
						onToggleFiltersPressed: function() {
							var oComponent = oController.getOwnerComponent();
							var oTemplatePrivateModel = oComponent.getModel("_templPriv");
							oTemplatePrivateModel.setProperty("/listReport/isHeaderExpanded", (oTemplatePrivateModel.getProperty("/listReport/isHeaderExpanded") === true) ? false : true);
						},

						// ---------------------------------------------
						// store navigation context
						// note: function itself is handled by the corresponding control
						// ---------------------------------------------
						onSearchButtonPressed: function() {
							var oModel = oController.getOwnerComponent().getModel();
							oModel.attachEventOnce("requestSent", function() {
								fnStoreCurrentAppStateAndAdjustURL();
							});
							var fnRequestFailed = function(oEvent) {
								MessageUtils.handleError("getCollection", this, oTemplateUtils.oServices, oEvent.getParameters());
								var oSmartTable = this.getView().byId("table");
								oSmartTable.getTable().setBusy(false);
								MessageUtils.handleTransientMessages(oTemplateUtils.oServices.oApplication.getDialogFragmentForView.bind(null, null));
							}.bind(this);
							oModel.attachEventOnce("requestFailed", fnRequestFailed);
							oModel.attachEventOnce("requestCompleted", function(oEvent) {
								if (oEvent.getParameter("success")) {
									oModel.detachEvent("requestFailed", fnRequestFailed);
								}
							});

						},
						onSemanticObjectLinkPopoverLinkPressed: function(oEvent) {
							fnStoreCurrentAppStateAndAdjustURL();
							oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkPopoverLinkPressed(oEvent, oState);
						},
						onAfterTableVariantSave: function() {
							fnStoreCurrentAppStateAndAdjustURL();
						},
						onAfterApplyTableVariant: function() {
							//No need to generate or save app state during initial load of application
							if (!bTableInitialized && FilterUtil.isDefaultVariantSelected(oState)) {
								bTableInitialized = true;
								return;
							} else if (!bTableInitialized && !FilterUtil.isDefaultVariantSelected(oState)) {
								bTableInitialized = true;
							}
							fnStoreCurrentAppStateAndAdjustURL();
						},
						onAfterChartVariantSave: function() {
							fnStoreCurrentAppStateAndAdjustURL();
						},
						onAfterApplyChartVariant: function() {
							//No need to generate or save app state during initial load of application
							if (!bChartInitialized && FilterUtil.isDefaultVariantSelected(oState)) {
								bChartInitialized = true;
								return;
							} else if (!bChartInitialized && !FilterUtil.isDefaultVariantSelected(oState)) {
								bChartInitialized = true;
							}
						    fnStoreCurrentAppStateAndAdjustURL();
						},
						onFilterModeSegmentedButtonChange: function(oEvent) {
							oState.filterBarController.handleFilterSwitch(oEvent.getParameter("key"), oEvent.oSource._bApplyingVariant);
							oState.oController._templateEventHandlers.onSegmentButtonPressed();
						},
						/**
						* Called from Segmented Button to update the selected key to the variant and adjust the app state
						* @param {boolean} bIgnoreVariant - if true then do not store the selected key in variant
						**/
						onSegmentButtonPressed: function(bIgnoreVariant){
							if (!bIgnoreVariant) {
									oState.oController.byId('template::PageVariant').currentVariantSetModified(true);
									oState.oSmartFilterbar.setFilterData({
										_CUSTOM : getFilterState()
									});
							}
							fnStoreCurrentAppStateAndAdjustURL();
						},
						// ---------------------------------------------
						// END store navigation context
						// ---------------------------------------------

						onShareListReportActionButtonPress: function (oEvent) {
							if (!oState.oShareActionSheet) {
								oState.oShareActionSheet = oTemplateUtils.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.fragments.lists.ShareSheet", {
									shareEmailPressed: function() {
										fnStoreCurrentAppStateAndAdjustURL();
										sap.m.URLHelper.triggerEmail(null, oTemplateUtils.oCommonUtils.getText("EMAIL_HEADER", [oTemplateUtils.oServices.oApplication.getAppTitle()]), document.URL);
									},
									shareJamPressed: function() {
										fnStoreCurrentAppStateAndAdjustURL();
										var oShareDialog = sap.ui.getCore().createComponent({
											name: "sap.collaboration.components.fiori.sharing.dialog",
											settings: {
												object: {
													id: document.URL,
													share: oTemplateUtils.oServices.oApplication.getAppTitle()
												}
											}
										});
										oShareDialog.open();
									}
								}, "share", function(oFragment, oShareModel) {
									var oResource = sap.ui.getCore().getLibraryResourceBundle("sap.m");
									oShareModel.setProperty("/emailButtonText", oResource.getText("SEMANTIC_CONTROL_SEND_EMAIL"));
									oShareModel.setProperty("/jamButtonText", oResource.getText("SEMANTIC_CONTROL_SHARE_IN_JAM"));
									oShareModel.setProperty("/bookmarkButtonText", oResource.getText("SEMANTIC_CONTROL_SAVE_AS_TILE"));
									var fnGetUser = jQuery.sap.getObject("sap.ushell.Container.getUser");
									oShareModel.setProperty("/jamVisible", !!fnGetUser && fnGetUser().isJamActive());

									oFragment.openBy(oEvent.getSource());
								});
							} else {
								oState.oShareActionSheet.openBy(oEvent.getSource());
							}
						},
						/**
						 * Called from Determining Button belonging to Chart's Annotaation of type DataFieldForAction
						 * @param  {Object} oEvent object
						 */
						onChartDeterminingDataFieldForAction: function(oEvent) {
							var aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oState.oSmartChart);
							var oButton = oEvent.getSource();
							var oCustomData = oTemplateUtils.oCommonUtils.getElementCustomData(oButton);
							var sBindingPath = this.getView().getBindingPath();
							oTemplateUtils.oCommonUtils.triggerAction(aContexts, sBindingPath, oCustomData);
						},
						/**
						 * Called from Determining Button belonging to Table's Annotation of type DataFieldForAction
						 * @param  {object} oEvent
						 */
						onDeterminingDataFieldForAction: function(oEvent) {
							var oTable = oState.oSmartTable.getTable();
							var aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oTable);
							if (aContexts.length === 0) {
								MessageBox.error(oTemplateUtils.oCommonUtils.getText("ST_GENERIC_NO_ITEM_SELECTED"), {
									styleClass: oTemplateUtils.oCommonUtils.getContentDensityClass()
								});
							} else {
								var oButton = oEvent.getSource();
								var oCustomData = oTemplateUtils.oCommonUtils.getElementCustomData(oButton);
								var sTableBindingPath = oState.oSmartTable.getTableBindingPath();
								oTemplateUtils.oCommonUtils.triggerAction(aContexts, sTableBindingPath, oCustomData, oTable);
							}
						},
						/**
						 * Called from Determining Button belonging to Table and Chart Annotation of type DataFieldForIntentBasedNavigation
						 * @param  {object} oEvent
						 */
						onDeterminingDataFieldForIntentBasedNavigation: function(oEvent) {
							var oButton = oEvent.getSource();
							var oCustomData = oTemplateUtils.oCommonUtils.getElementCustomData(oButton);
							var oContainerCustomData = oButton.getParent().data(FILTER);
							var oTable = oState.oSmartTable.getTable();
							var aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oTable);
							if (oContainerCustomData === CONTAINER_VIEW_CHART){
								aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oState.oSmartChart);
							}
							var bRequiresContext = !(oCustomData.RequiresContext && oCustomData.RequiresContext === "false");
							if (bRequiresContext && aContexts.length === 0) {
								MessageBox.error(oTemplateUtils.oCommonUtils.getText("ST_GENERIC_NO_ITEM_SELECTED"), {
									styleClass: oTemplateUtils.oCommonUtils.getContentDensityClass()
								});
							} else if (bRequiresContext && aContexts.length > 1) {
								MessageBox.error(oTemplateUtils.oCommonUtils.getText("ST_GENERIC_MULTIPLE_ITEMS_SELECTED"), {
									styleClass: oTemplateUtils.oCommonUtils.getContentDensityClass()
								});
							} else {
								var oContext = bRequiresContext ? aContexts[0] : null;
								oTemplateUtils.oCommonEventHandlers.onDataFieldForIntentBasedNavigationSelectedContext(oContext, oCustomData, oState);
							}
						},
						/**
						* onInlineDataFieldForAction Trigger the action as specified in the inline buttons
						* @param  {Object} oEvent Event object
						*/
						onInlineDataFieldForAction: function(oEvent) {
							var oEventSource = oEvent.getSource();
							var oCustomData = oTemplateUtils.oCommonUtils.getElementCustomData(oEventSource);
							var oTable = oTemplateUtils.oCommonUtils.getOwnerControl(oEventSource);
							var sTableBindingPath = oTable.getParent().getTableBindingPath();
							var aContexts = [oEventSource.getBindingContext()];
							oTemplateUtils.oCommonUtils.triggerAction(aContexts, sTableBindingPath, oCustomData, oTable, oState);
						},
						/**
						* onInlineDataFieldForIntentBasedNavigation Trigger the navigation as specified in the inline buttons
						* @param  {Object} oEvent Event object
						*/
						onInlineDataFieldForIntentBasedNavigation: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onInlineDataFieldForIntentBasedNavigation(oEvent.getSource(), oState);
						},
						/**
						 * Select handler for Auto Hide Segment Button
						 * @param  {Object} oEvent object
						 */
						onAutoHideToggle: function() {
							oState.chartController.updateTable();
							fnStoreCurrentAppStateAndAdjustURL();
						},
						/**
						 * Event handler when SmartControl full screen mode is changed
						 * @param  {sap.ui.base.Event} oEvent object
						 */
						onFullScreenToggled: function(oEvent) {
							var fullScreen = oEvent.getParameter("fullScreen");
							var oTemplatePrivate = oEvent.getSource().getModel("_templPriv");
							oTemplatePrivate.setProperty("/alp/fullScreen", fullScreen);
						},
						/**
						 * Event handler when Filter Dialog is launched
						 * @param  {Object} oEvent object
						 */
						onDialogOpened: function(oEvent) {
							//If VF are not used, none of this is needed
							//getFilterDialogContent() returns dialog contents as an array
							var aContent = oState.oSmartFilterbar.getFilterDialogContent();

							if (!oState.visualFilterDialogContainer) {
								oState.visualFilterDialogContainer = new VisualFilterDialogController();
								oState.visualFilterDialogContainer.init(oState);
							}
							//Make sure only CF contents is present and then add segmented button and VF contents.
							if (aContent.length < 2) {

								var filterSwitchItems = [
									new sap.m.SegmentedButtonItem({icon:"sap-icon://filter-fields", width:"inherit", key:FILTER_MODE_COMPACT, tooltip:"{i18n>FILTER_COMPACT}"}),
									new sap.m.SegmentedButtonItem({icon:"sap-icon://filter-analytics", width:"inherit", key:FILTER_MODE_VISUAL, tooltip:"{i18n>FILTER_VISUAL}", enabled: "{_templPriv>/alp/searchable}"})
								];

								var filterSwitch = new sap.m.SegmentedButton({
									width:"inherit",
									selectedKey:FILTER_MODE_COMPACT,
									items: filterSwitchItems,
									select: function(oEvent) {
										var oSwitch = oEvent.getSource();
										//Keep the selected key as compact on this content
										oSwitch.setSelectedKey(FILTER_MODE_COMPACT);
										oState.visualFilterDialogContainer._toggle.call(oState.visualFilterDialogContainer);
									}
								});

								var oForm = oState.visualFilterDialogContainer._createForm();

								oState.oSmartFilterbar.addFilterDialogContent(oForm);

								var oToolbar = new sap.m.OverflowToolbar({
									design: sap.m.ToolbarDesign.Transparent,
									content: [
										new sap.m.ToolbarSpacer(),
										filterSwitch
									]
								}).addStyleClass("sapSmartTemplatesAnalyticalListPageFilterDialogToolbar");

								//Add segmented buttons to Compact filter form.
								aContent[0].setToolbar(oToolbar);

								filterSwitch.setModel(oState.oController.getView().getModel("_templPriv"), "_templPriv");
							}
							//filter dialog content should be decided based on current filterMode and bSearchable
							//If bSearchable then which mode is on that content should be active
							//if bSearchable is false then compact should come up first
							var oTemplatePrivate = oState.oController.getView().getModel("_templPriv");
							if (oTemplatePrivate.getProperty("/alp/searchable")) { //if searchable
								if (oTemplatePrivate.getProperty("/alp/filterMode") === FILTER_MODE_VISUAL) {
									oState.oSmartFilterbar.addFilterDialogContent(aContent[1]);
									//Set content width and content height while adding custom content.
									oState.oSmartFilterbar.setContentWidth(790);
									oState.oSmartFilterbar.setContentHeight(685);
								} else {
									oState.oSmartFilterbar.addFilterDialogContent(aContent[0]);
								}
							} else { //else always launch compact dialog
								oState.oSmartFilterbar.addFilterDialogContent(aContent[0]);
							}
						},
						//Event handling for dialog buttons
						onSearchForFilters: function(oEvent) {
							oState.visualFilterDialogContainer._triggerSearchInFilterDialog.call(oState.visualFilterDialogContainer, oEvent);
						},
						onDialogSearch: function(oEvent) {
							oState.visualFilterDialogContainer._searchDialog.call(oState.visualFilterDialogContainer);
						},
						onDialogCancel: function(oEvent) {
							oState.visualFilterDialogContainer._cancelDialog.call(oState.visualFilterDialogContainer);
						},
						onRestore: function(oEvent) {
							oState.visualFilterDialogContainer._restoreDialog.call(oState.visualFilterDialogContainer);
						},
						//Enable/Disable toolbar butttons on data receive - currently only SmartTable
						onDataReceived: function(oEvent) {
							//enable toolbar before enabling the buttons.
							oState.oContentArea.enableToolbar();
							oTemplateUtils.oCommonEventHandlers.onDataReceived(oEvent);
						},
						//Enable/Disable toolbar buttons on row selection in table
						onRowSelectionChange: function(oEvent) {
							var oTable = oEvent.getSource();
							oTemplateUtils.oCommonUtils.setEnabledToolbarButtons(oTable);
						}
					},
					extensionAPI: new ExtensionAPI(oTemplateUtils, oController, oState)
				};
			}
		};
	});
