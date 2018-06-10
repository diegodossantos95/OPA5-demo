/* global hasher */
sap.ui.define(["jquery.sap.global", "sap/ui/model/json/JSONModel", "sap/m/ObjectIdentifier", "sap/m/Table",
		"sap/m/Text", "sap/ui/comp/smartfield/SmartField", "sap/ui/generic/app/navigation/service/SelectionVariant",
		"sap/suite/ui/generic/template/ListReport/extensionAPI/ExtensionAPI", "sap/m/MessageBox", "sap/suite/ui/generic/template/js/AnnotationHelper",
		"sap/suite/ui/generic/template/lib/MessageUtils", 
		"sap/suite/ui/generic/template/ListReport/controller/IappStateHandler", "sap/suite/ui/generic/template/ListReport/controller/MultipleViewsSingleTableModeHelper",
		"sap/ui/table/Table", "sap/ui/table/AnalyticalTable", "sap/ui/model/Filter", "sap/ui/comp/navpopover/LinkData", "sap/suite/ui/generic/template/ListReport/controller/SmartChartController"],
	function(jQuery, JSONModel, ObjectIdentifier, Table, Text, SmartField, SelectionVariant, ExtensionAPI, MessageBox, AnnotationHelper, MessageUtils, IappStateHandler, MultipleViewsSingleTableModeHelper, UiTable, AnalyticalTable, Filter, LinkData, SmartChartController) {
		"use strict";

		return {
			getMethods: function(oViewProxy, oTemplateUtils, oController) {
				var oState = {}; // contains instance attributes that are shared with helper classes:
				                 // oSmartFilterbar, oSmartTable, oIappStateHandler, oMultipleViewsSingleTableModeHelper, bWorkListEnabled
				                 // aSmartTables, oIconTabBar (if using table tabs)
				                 //and (from oIappStateHandler) function getCurrentAppState. 
				                 // Initialized in onInit.
				//PoC Chart begin
				// Make the fnUpdateTableOnSelectionChange function available for others via the oState object
				oState.fnUpdateTableOnSelectionChange = fnUpdateTableOnSelectionChange;
				//PoC Chart end
				var bIsStartingUp = true;
				var oFclProxy;

				// only needed for table tabs, initialized in fnPrepare
			//	var oTableTabData;

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
							var sHash = hasher.getHash();
							return sHash ? ("#" + sHash) : window.location.href;
						},
						bookmarkServiceUrl: function() {
							var oTable = oState.oSmartTable.getTable();
							var oBinding = oTable.getBinding("rows") || oTable.getBinding("items");
							return oBinding ? oBinding.getDownloadUrl() + "&$top=0&$inlinecount=allpages" : "";
						},
						// JAM
						isShareInJamActive: !!fnGetUser && fnGetUser().isJamActive()
					};
					var oTemplatePrivateModel = oController.getOwnerComponent().getModel("_templPriv");
					oTemplatePrivateModel.setProperty("/listReport/share", oShareInfo);
				}

				// TABLE TABS ONLY
				function fnPrepareForTableTabs() {
					var oAppComponent = oController.getOwnerComponent().getAppComponent();
					var oConfig = oAppComponent.getConfig();
					if (oConfig && oConfig.pages[0] && oConfig.pages[0].component && oConfig.pages[0].component.settings && oConfig.pages[0].component.settings.quickVariantSelectionX && oConfig.pages[0].component.settings.quickVariantSelectionX.variants) {
						oState.oTableTabData = {
							aTableIsDirty: {},
							oCurrentBindingParams: {} // to send the correct $count requests, we need to access the current binding parameters
						};
						oState.oIconTabBar = oController.byId("template::IconTabBar");
						if (oConfig.pages[0].component.settings.quickVariantSelectionX.showCounts) {
							var aItems = oState.oIconTabBar.getItems();
							for (var idx in aItems) {
								fnSetCount(aItems, idx, 0); // initially, set all counts to 0
							}
						}
						oState.aSmartTables = {};
						for (var i in oConfig.pages[0].component.settings.quickVariantSelectionX.variants) {
							var sTabKey = sap.suite.ui.generic.template.js.AnnotationHelper.getIconTabFilterKey(oConfig.pages[0].component.settings.quickVariantSelectionX.variants[i]);
							var sTableId = sap.suite.ui.generic.template.js.AnnotationHelper.getSmartTableId(oConfig.pages[0].component.settings.quickVariantSelectionX.variants[i]);
							oState.aSmartTables[sTabKey] = oController.byId(sTableId);
							if (!oState.oSmartTable) {
								oState.oSmartTable = oState.aSmartTables[sTabKey]; // the first table is the default table that is initially visible
							} else {
								oState.aSmartTables[sTabKey].setVisible(false);
							}
							oState.oTableTabData.aTableIsDirty[oState.aSmartTables[sTabKey].getId()] = false;
						}
						// Attach to “Search” event on SmartFilterBar (in init of the view controller)
						oState.oSmartFilterbar.attachSearch(function(oEvent){
							oState.oSmartTable._reBindTable(oEvent);
							if (oConfig.pages[0].component.settings.quickVariantSelectionX.showCounts) {
								fnUpdateTableTabCounts();
							}
							for (var i in oState.oTableTabData.aTableIsDirty) {
								oState.oTableTabData.aTableIsDirty[i] = true;
							}
							oState.oTableTabData.aTableIsDirty[oState.oSmartTable.getId()] = false;
							oState.oTableTabData.searchButtonPressed = true;
						});
						if (oConfig.pages[0].component.settings.quickVariantSelectionX.enableAutoBinding) {
							oState.oSmartFilterbar.search(); //trigger enableAutoBinding without getting a cancelled batch request 
						}
					}
				}
				// -- End of used in onInit only

				function onSmartFilterBarInitialise(oEvent){
					oController.onInitSmartFilterBarExtension(oEvent);
					oState.oIappStateHandler.onSmartFilterBarInitialise();
				}

				function onSmartFilterBarInitialized(){
					var oAppStatePromise = oState.oIappStateHandler.parseUrlAndApplyAppState();
					oAppStatePromise.then(function(){
						bIsStartingUp = false;
					}, function(oError){ // improve?
						if (oError instanceof Error) {
							oError.showMessageBox(); // improve?
							bIsStartingUp = false;
						}
					});
				}

				function onFilterChange(){
					if (!bIsStartingUp){
						oState.oIappStateHandler.changeIappState(true, false);
					}
				}

				function fnUpdateTableOnSelectionChange(oTable) {
					var oModel = oTable.getModel(),
					oPrivModel = oTable.getModel("_templPriv");
					var oMetaModel = oModel.getMetaModel(),
						oEntitySet = oMetaModel.getODataEntitySet(oController.getOwnerComponent().getEntitySet()),
						oDeleteRestrictions = oEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"];
					var bDeleteEnabled = false;
					if (sap.suite.ui.generic.template.js.AnnotationHelper.areDeleteRestrictionsValid(oMetaModel, oEntitySet.entityType, oDeleteRestrictions)) {
						var sDeletablePath = (oDeleteRestrictions && oDeleteRestrictions.Deletable && oDeleteRestrictions.Deletable.Path) ? oDeleteRestrictions.Deletable.Path : "";
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
					}
					oPrivModel.setProperty("/listReport/deleteEnabled", bDeleteEnabled);
					oTemplateUtils.oCommonUtils.setEnabledToolbarButtons(oTable);
					//PoC Chart begin
					if (oTable instanceof sap.ui.comp.smartchart.SmartChart) {
						return;
					}
					//PoC Chart end
					oTemplateUtils.oCommonUtils.setEnabledFooterButtons(oTable);
				}
				
				function onMultipleViewSingleTableModeVariantChanged(oEvent){
					oState.oMultipleViewsSingleTableModeHelper.onAfterVariantChanged(oEvent);                         	
				}

				// TABLE TABS ONLY
				function fnUpdateTableTabCounts() {
					var oModel = oState.oSmartTable.getModel();
					var oIconTabBar = oController.byId("template::IconTabBar");
					var aFilterTabs = oIconTabBar.getItems();

					for (var iTabIdx in aFilterTabs) {
						var aFilters = [];
						var oTmpTable = oController.byId("listReport-" + aFilterTabs[iTabIdx].getKey());
						var aSelectionVariantFilters = oTemplateUtils.oCommonUtils.getSelectionVariantFilters(oTmpTable);
						for (var i in oState.oTableTabData.oCurrentBindingParams.filters) {
							aFilters.push(oState.oTableTabData.oCurrentBindingParams.filters[i]); // copy array content to prevent call by reference
						}
						for (var i in aSelectionVariantFilters) {
							aFilters.push(aSelectionVariantFilters[i]);
						}
						var sTableEntitySet = oTmpTable.getEntitySet();
						oModel.read("/" + sTableEntitySet + "/$count", {
							urlParameters: oState.oTableTabData.oCurrentBindingParams.parameters.custom,
							filters: aFilters,
							groupId: "updateTabCounts",
							success: fnSetCount.bind(null, aFilterTabs, iTabIdx),
							error: function(oData, oResponse) {
								// clarify: how to indicate/handle errors?
							}
						});
					}
				}

				// TABLE TABS ONLY
				function fnSetCount(aFilterTabs, index, oData) {
					aFilterTabs[index].setCount(oData);
				}

				// TABLE TABS ONLY
				function fnStoreAndApplyFiltersForTableTabs(oBindingParams, oTable) {
					oState.oTableTabData.oCurrentBindingParams.filters = [];
					for (var i in oBindingParams.filters) {
						oState.oTableTabData.oCurrentBindingParams.filters.push(oBindingParams.filters[i]);
					}
					oState.oTableTabData.oCurrentBindingParams.parameters = oBindingParams.parameters;
					var aSelectionVariantFilters = oTemplateUtils.oCommonUtils.getSelectionVariantFilters(oTable);
					for (var i in aSelectionVariantFilters) {
						oBindingParams.filters.push(aSelectionVariantFilters[i]);
					}
				}
				
				function fnOnSemanticObjectLinkNavigationPressed(oEvent){
					var oEventParameters = oEvent.getParameters();
					var oEventSource = oEvent.getSource();
					oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkNavigationPressed(oEventSource, oEventParameters);
				}
				
				function fnOnSemanticObjectLinkNavigationTargetObtained(oEvent) {
					var oEventParameters, oEventSource;
					oEventParameters = oEvent.getParameters();
					oEventSource = oEvent.getSource();	//set on semanticObjectController	
					oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(oEventSource, oEventParameters, oState, undefined, undefined);
				}

				function fnOnSemanticObjectLinkNavigationTargetObtainedSmartLink(oEvent) {
					var oMainNavigation, sTitle, oCustomData, sDescription, oEventParameters, oEventSource;
					oMainNavigation = oEvent.getParameters().mainNavigation;
					oEventParameters = oEvent.getParameters();
					oEventSource = oEvent.getSource(); //set on smart link
					if (oMainNavigation) {
						sTitle = oEventSource.getText && oEventSource.getText();
						oCustomData = oTemplateUtils.oCommonUtils.getCustomData(oEvent);
						if (oCustomData && oCustomData["LinkDescr"]) {
							sDescription = oCustomData["LinkDescr"];
							oMainNavigation.setDescription(sDescription);
						}
					}
					oEventSource = oEventSource.getParent().getParent().getParent().getParent(); //set on smart table
					oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(oEventSource, oEventParameters, oState, sTitle, oMainNavigation);
					//oEventParameters.show(sTitle, oMainNavigation, undefined, undefined);
				}

				// Generation of Event Handlers
				return {
					onInit: function() {
						oState.oSmartFilterbar = oController.byId("listReportFilter");
						oState.oSmartTable = oController.byId("listReport");
						oFclProxy = oTemplateUtils.oServices.oApplication.getFclProxyForView(0);
						oState.bLoadListAndFirstEntryOnStartup = oFclProxy && oFclProxy.isListAndFirstEntryLoadedOnStartup && oFclProxy.isListAndFirstEntryLoadedOnStartup();

						// TABLE TABS ONLY
						fnPrepareForTableTabs();
						// (END) TABLE TABS ONLY

						// Chart PoC begin
						var oAppComponent = oController.getOwnerComponent().getAppComponent();
						var oConfig = oAppComponent.getConfig();
						// check if worklist is enabled
						oState.bWorkListEnabled = oConfig.pages[0].component.settings && oConfig.pages[0].component.settings.isWorklist || false;
						if (oConfig && oConfig.pages[0] && oConfig.pages[0].component && oConfig.pages[0].component.settings && oConfig.pages[0].component.settings._quickVariantSelectionX &&
								oConfig.pages[0].component.settings._quickVariantSelectionX.variants) {
							oState.oSmartChartController = new SmartChartController(oState, oController, oTemplateUtils);
							oState.oSmartChartController.onSmartChartInit();
						}
						oState.oTemplateUtils = oTemplateUtils;
						//Chart PoC end

						oState.oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils.oCommonUtils.getNavigationHandler());
						oTemplateUtils.oServices.oApplication.registerStateChanger({
							isStateChange: oState.oIappStateHandler.isStateChange
						});
						// Give component access to some methods
						oViewProxy.getUrlParameterInfo = oState.oIappStateHandler.getUrlParameterInfo;
						oViewProxy.onComponentActivate = function(){
							if (!bIsStartingUp){
								oState.oIappStateHandler.parseUrlAndApplyAppState();
							}
						};
						oViewProxy.refreshBinding = function(){
							// refresh list, but only if the list is currently showing data
							if (oState.oIappStateHandler.areDataShownInTable()){
								oTemplateUtils.oCommonUtils.refreshSmartTable(oState.oSmartTable);
							}
						};

						fnSetIsLeaf();
						fnSetShareModel();
						var oComponent = oController.getOwnerComponent();
						oController.byId("template::FilterText").attachBrowserEvent("click", function () {
							oController.byId("page").setHeaderExpanded(true);
						});
						var oTemplatePrivateModel = oComponent.getModel("_templPriv");
						// oTemplatePrivateModel.setProperty("/listReport/isHeaderExpanded", true);
						// setting isHeaderExpanded property in onSmartFilterBarInitialise

						// set property for enable/disable of the Delete button
						oTemplatePrivateModel.setProperty("/listReport/deleteEnabled", false);

						// Chart PoC begin
						var oView, oBody, sCozyClass = "sapUiSizeCozy", sCompactClass = "sapUiSizeCompact", sCondensedClass = "sapUiSizeCondensed";
						//At switching between tables and charts the UI "jumps" so this should prevent it
						if (oState.oSmartTable instanceof sap.ui.comp.smartchart.SmartChart) {
							oView = oController.getView();
							oBody = jQuery(document.body);
							if (oBody.hasClass(sCozyClass) || oView.hasStyleClass(sCozyClass)){
								oState.oSmartTable.addStyleClass(sCozyClass);
							} else if (oBody.hasClass(sCompactClass) || oView.hasStyleClass(sCompactClass)){
								var bCondensedTableLayout = oComponent.getComponentContainer().getSettings().condensedTableLayout;
								if (bCondensedTableLayout === true){
									//https://openui5.hana.ondemand.com/#docs/guide/13e6f3bfc54c4bd7952403e20ff447e7.html
									//setting sapUiSizeCompact AND sapUiSizeCondensed might mix up the required css
									//oState.oSmartTable.addStyleClass(sCompactClass);
									oState.oSmartTable.addStyleClass(sCondensedClass);
								} else {
									oState.oSmartTable.addStyleClass(sCompactClass);
								}
							}
						}
						
						//do not execute the coding below for Chart
//						if (!(oState.oSmartTable instanceof sap.ui.comp.smarttable.SmartTable)) {
//							return;
//						}

						//Chart PoC end
						//the following layout definition should only be executed for the List Report (Object Page will use here the new complex table concept)
						//condensed shouldn't be the default, only if the manifest specifies it
						//compare the following logic with Application.js->getContentDensityClass:
						//compact and condensed needs to be set together
						if (oState.oSmartTable instanceof sap.ui.comp.smarttable.SmartTable) {
							var oTable = oState.oSmartTable.getTable();
							if ( oTable instanceof UiTable || oTable instanceof AnalyticalTable) {
								oView = oController.getView();
								oBody = jQuery(document.body);
								if (oBody.hasClass(sCozyClass) || oView.hasStyleClass(sCozyClass)){
									oState.oSmartTable.addStyleClass(sCozyClass);
								} else if (oBody.hasClass(sCompactClass) || oView.hasStyleClass(sCompactClass)){
									var bCondensedTableLayout = oComponent.getComponentContainer().getSettings().condensedTableLayout;
									if (bCondensedTableLayout === true){
										//https://openui5.hana.ondemand.com/#docs/guide/13e6f3bfc54c4bd7952403e20ff447e7.html
										//setting sapUiSizeCompact AND sapUiSizeCondensed might mix up the required css
										//oState.oSmartTable.addStyleClass(sCompactClass);
										oState.oSmartTable.addStyleClass(sCondensedClass);
									} else {
										oState.oSmartTable.addStyleClass(sCompactClass);
									}
								}
							}
						}
						if (oState.bWorkListEnabled) {
							oState.oSmartFilterbar.setSuppressSelection(false);
							oState.oSmartFilterbar.search();
						}
					},

					handlers: {
						addEntry: function(oEvent) {
							var oEventSource = oEvent.getSource();
							oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){
								oTemplateUtils.oCommonEventHandlers.addEntry(oEventSource, false, oState.oSmartFilterbar);
							}, jQuery.noop, oState);
						},
						deleteEntries: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.deleteEntries(oEvent);
						},
						updateTableTabCounts: fnUpdateTableTabCounts,
						onSelectionChange: function(oEvent) {
							var oTable = oEvent.getSource();
							fnUpdateTableOnSelectionChange(oTable);
						},
						onChange: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onChange(oEvent);
						},
						onSmartFieldUrlPressed: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onSmartFieldUrlPressed(oEvent, oState);
						},
						onBreadCrumbUrlPressed: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onBreadCrumbUrlPressed(oEvent, oState);
						},
						onContactDetails: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onContactDetails(oEvent);
						},
						onSmartFilterBarInitialise: onSmartFilterBarInitialise,
						onSmartFilterBarInitialized: onSmartFilterBarInitialized,

						onBeforeSFBVariantFetch: function() {
							oState.oIappStateHandler.onBeforeSFBVariantFetch();
						},

						onAfterSFBVariantSave: function(){
							oState.oIappStateHandler.onAfterSFBVariantSave();
						},

						onAfterSFBVariantLoad: function(oEvent) {
							oState.oIappStateHandler.onAfterSFBVariantLoad(oEvent);
						},
						onDataReceived: function(oEvent){
							oTemplateUtils.oCommonEventHandlers.onDataReceived(oEvent);
							oState.oMultipleViewsSingleTableModeHelper.onDataReceived(oEvent);

							var oTable = oEvent.getSource().getTable();
							oFclProxy.handleDataReceived(oTable, oState, oTemplateUtils);
						},
						onBeforeRebindTable: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onBeforeRebindTable(oEvent, {
								determineSortOrder: oState.oMultipleViewsSingleTableModeHelper.determineSortOrder
							});
							oController.onBeforeRebindTableExtension(oEvent);
							// TABLE TABS ONLY
							if (oState.oTableTabData) {
								fnStoreAndApplyFiltersForTableTabs(oEvent.getParameter("bindingParams"), oEvent.getSource());
							}
							oState.oMultipleViewsSingleTableModeHelper.onBeforeRebindTable(oEvent);                      
						},
						onShowDetails: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onShowDetails(oEvent.getSource(), oState);
						},
						onListNavigate: function(oEvent) {
							if (!oController.onListNavigationExtension(oEvent)) {
								oTemplateUtils.oCommonEventHandlers.onListNavigate(oEvent.getSource(), oState);
							}
						},
						onCallActionFromToolBar: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onCallActionFromToolBar(oEvent, oState);
						},
						onDataFieldForIntentBasedNavigation: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onDataFieldForIntentBasedNavigation(oEvent, oState);
						},
						onDataFieldWithIntentBasedNavigation: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onDataFieldWithIntentBasedNavigation(oEvent, oState);
						},
						onBeforeSemanticObjectLinkPopoverOpens: function(oEvent) {

							var oEventParameters = oEvent.getParameters();

							oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){
							  //Success function
									var sSelectionVariant = oState.oSmartFilterbar.getDataSuiteFormat();
									oTemplateUtils.oCommonUtils.semanticObjectLinkNavigation(oEventParameters, sSelectionVariant, oController);
							}, jQuery.noop, oState, jQuery.noop);
						},
						onSemanticObjectLinkNavigationPressed: fnOnSemanticObjectLinkNavigationPressed,
						onSemanticObjectLinkNavigationTargetObtained: fnOnSemanticObjectLinkNavigationTargetObtained,
						onSemanticObjectLinkNavigationTargetObtainedSmartLink: fnOnSemanticObjectLinkNavigationTargetObtainedSmartLink,
						onDraftLinkPressed: function(oEvent) {
							var oButton = oEvent.getSource();
							var oBindingContext = oButton.getBindingContext();
							oTemplateUtils.oCommonUtils.showDraftPopover(oBindingContext, oButton);
						},
						onAssignedFiltersChanged: function(oEvent) {
							if (oEvent.getSource()) {
								oController.byId("template::FilterText").setText(oEvent.getSource().retrieveFiltersWithValuesAsText());
							}
						},
						onFilterChange: onFilterChange,
						onToggleFiltersPressed: function() {
							var oComponent = oController.getOwnerComponent();
							var oTemplatePrivateModel = oComponent.getModel("_templPriv");
							oTemplatePrivateModel.setProperty("/listReport/isHeaderExpanded", !oTemplatePrivateModel.getProperty("/listReport/isHeaderExpanded"));
						},
						// ---------------------------------------------
						// store navigation context
						// note: function itself is handled by the corresponding control
						// ---------------------------------------------
						onSearchButtonPressed: function() {
							var oModel = oController.getOwnerComponent().getModel();
							var fnRequestFailed = function(oEvent) {
								MessageUtils.handleError("getCollection", oController, oTemplateUtils.oServices, oEvent.getParameters());
								oState.oSmartTable.getTable().setBusy(false);
								MessageUtils.handleTransientMessages(oTemplateUtils.oServices.oApplication.getDialogFragmentForView.bind(null, oController.getView()));
							};
							oState.oIappStateHandler.changeIappState(false, true);
							oModel.attachEvent('requestFailed', fnRequestFailed);
							oModel.attachEventOnce('requestCompleted', function() {
								if (oState.oSmartTable instanceof sap.ui.comp.smarttable.SmartTable) {
									oState.oSmartTable.getTable().setBusy(false);
								}
								MessageUtils.handleTransientMessages(oTemplateUtils.oServices.oApplication.getDialogFragmentForView.bind(null, oController.getView()));
								oModel.detachEvent('requestFailed', fnRequestFailed);
							});
						},
						onSemanticObjectLinkPopoverLinkPressed: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkPopoverLinkPressed(oEvent, oState);
						},
						onAfterTableVariantSave: function() {
							oState.oIappStateHandler.onAfterTableVariantSave();
						},
						onAfterApplyTableVariant: function() {
							if (!bIsStartingUp) {
								oState.oIappStateHandler.onAfterApplyTableVariant();
							}
						},
						//PoC Chart begin
						onAfterChartVariantInitialised: function(oEvent) {
						},
						onAfterChartVariantSave: function(oEvent) {
							oState.oIappStateHandler.onAfterTableVariantSave();
						},
						onAfterApplyChartVariant: function(oEvent) {
							if (!bIsStartingUp) {
								oState.oIappStateHandler.onAfterApplyTableVariant();
							}
						},
						onBeforeRebindChart: function(oEvent) {
							//Make sure views with parameters are working
							if (oState.oSmartFilterbar && oState.oSmartFilterbar.getAnalyticBindingPath && oState.oSmartFilterbar.getConsiderAnalyticalParameters()) {
								try {
									var sAnalyticalPath = oState.oSmartFilterbar.getAnalyticBindingPath();
									if (sAnalyticalPath) {
										oState.oSmartTable.setChartBindingPath(sAnalyticalPath);
									}
								} catch (e) {
									jQuery.sap.log.warning("Mandatory parameters have no values", "", "List Report");
								}
							}

							oTemplateUtils.oCommonEventHandlers.onBeforeRebindChart(oEvent);
							if (oState.oTableTabData) {
								fnStoreAndApplyFiltersForTableTabs(oEvent.getParameter("bindingParams"), oEvent.getSource());
							}
							oController.onBeforeRebindChartExtension(oEvent);
						},

						onChartInitialise: function(oEvent) {
							var oSmartChart = oEvent.getSource();
							var oChart = oSmartChart.getChart();
							//attach to the selectData event of the sap.chart.Chart
							oChart.attachSelectData(oState.oSmartChartController.onChartSelectData);
							oChart.attachDeselectData(oState.oSmartChartController.onChartSelectData);
							oSmartChart.attachSelectionDetailsActionPress(oState.oSmartChartController.onDetailsActionPress);
						},
						//PoC Chart end

						// ---------------------------------------------
						// END store navigation context
						// ---------------------------------------------

						onShareListReportActionButtonPress: function (oEvent) {
							var oShareActionSheet = oTemplateUtils.oCommonUtils.getDialogFragment(
								"sap.suite.ui.generic.template.fragments.lists.ShareSheet", {
									shareEmailPressed: function() {
										sap.m.URLHelper.triggerEmail(null, oTemplateUtils.oCommonUtils.getText("EMAIL_HEADER", [oTemplateUtils.oServices.oApplication.getAppTitle()]), document.URL);
									},
									shareJamPressed: function() {
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
								});
							oShareActionSheet.openBy(oEvent.getSource());

							// workaround for focus loss issue for AddBookmarkButton ("save as tile" button)
							var oShareButton = this.getView().byId("template::Share");
							var oBookmarkButton = this.getView().byId("bookmarkButton");
							oBookmarkButton.setBeforePressHandler(function() {
								// set the focus to share button
								oShareButton.focus();
							});
						},
						onInlineDataFieldForAction: function(oEvent) {
							var oEventSource = oEvent.getSource();
							var oCustomData = oTemplateUtils.oCommonUtils.getElementCustomData(oEventSource);
							var oTable = oTemplateUtils.oCommonUtils.getOwnerControl(oEventSource);
							var sTableBindingPath = oTable.getParent().getTableBindingPath();
							var aContexts = [oEventSource.getBindingContext()];
							oTemplateUtils.oCommonUtils.triggerAction(aContexts, sTableBindingPath, oCustomData, oTable, oState);
						},
						onInlineDataFieldForIntentBasedNavigation: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onInlineDataFieldForIntentBasedNavigation(oEvent.getSource(), oState);
						},
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
						onDeterminingDataFieldForIntentBasedNavigation: function(oEvent) {
							var oButton = oEvent.getSource();
							var oCustomData = oTemplateUtils.oCommonUtils.getElementCustomData(oButton);
							var oTable = oState.oSmartTable.getTable();
							var aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oTable);
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

						// TABLE TABS ONLY
						onIconTabBarSelect: function(oEvent) {
							var sKey = oEvent.getSource().getSelectedKey();
							var oSmartTableOld, oSmartTableNew;
							oSmartTableOld = oState.oSmartTable;
							oSmartTableNew = oState.aSmartTables[sKey];
							if (oSmartTableNew) {
								oState.oSmartTable = oSmartTableNew;
								oSmartTableOld.setVisible(false);
								oState.oSmartTable.setVisible(true);
								if (oState.oTableTabData.aTableIsDirty[oState.oSmartTable.getId()]) {
//								as a new variant is selected, we need both - rebind and refresh
									oState.oSmartTable.rebindTable();
									oTemplateUtils.oCommonUtils.refreshSmartTable(oState.oSmartTable);
									oState.oTableTabData.aTableIsDirty[oState.oSmartTable.getId()] = false;
								}
								fnUpdateTableOnSelectionChange(oState.oSmartTable);
								oState.oIappStateHandler.changeIappState(true, oState.oTableTabData.searchButtonPressed);
							}
						},
						
						multipleViewSingleTableModeVariantChanged: onMultipleViewSingleTableModeVariantChanged,

						//Chart PoC begin
						onSmartChartSelect: function(oEvent) {
							var sKey = oEvent.getSource().getSelectedKey();
							var oSmartTableOld, oSmartTableNew;
							oSmartTableOld = oState.oSmartTable;
							oSmartTableNew = oState.aSmartTablesCharts[sKey];
							if (oSmartTableNew) {
								oState.oSmartTable = oSmartTableNew;
								oSmartTableOld.setVisible(false);
								oState.oSmartTable.setVisible(true);
								if (oState.oTableTabData.aTableIsDirty[oState.oSmartTable.getId()]) {
									if (oState.oSmartTable instanceof sap.ui.comp.smartchart.SmartChart) {
										oState.oSmartTable.rebindChart(oEvent);
									} else if (oState.oSmartTable instanceof sap.ui.comp.smarttable.SmartTable) {
//										as a new variant is selected, we need both - rebind and refresh
										oState.oSmartTable.rebindTable();
										oTemplateUtils.oCommonUtils.refreshSmartTable(oState.oSmartTable);
										oState.oTableTabData.aTableIsDirty[oState.oSmartTable.getId()] = false;
									}
								}
								if (oState.oSmartTable instanceof sap.ui.comp.smarttable.SmartTable) {
									fnUpdateTableOnSelectionChange(oState.oSmartTable);
								}
								oState.oIappStateHandler.changeIappState(true, oState.oTableTabData.searchButtonPressed);
							}
						},
						//Chart PoC end

						onTableInit: function(oEvent) {
							var oSmartTable = oEvent.getSource();
							var oTemplatePrivateModel = oController.getOwnerComponent().getModel("_templPriv");
							oTemplateUtils.oCommonUtils.checkToolbarIntentsSupported(oSmartTable, oTemplatePrivateModel);
							oState.oMultipleViewsSingleTableModeHelper = new MultipleViewsSingleTableModeHelper(oState, oController, oTemplateUtils);
						},
						//search function called in worklist light version of LR
						onSearchWorkListLight: function(oEvent) {
							var oSmartTable = oState.oSmartTable;
							oSmartTable.data("searchString", oEvent.getSource().getValue());
							oSmartTable.data("allowSearchWorkListLight", true);
							oSmartTable.rebindTable();

							var oModel = oController.getOwnerComponent().getModel();
							var fnRequestFailed = function(oEvent) {
								MessageUtils.handleError("getCollection", oController, oTemplateUtils.oServices, oEvent.getParameters());
								oState.oSmartTable.getTable().setBusy(false);
								MessageUtils.handleTransientMessages(oTemplateUtils.oServices.oApplication.getDialogFragmentForView.bind(null, oController.getView()));
							};
							oModel.attachEvent('requestFailed', fnRequestFailed);
							oModel.attachEventOnce('requestCompleted', function() {
								oModel.detachEvent('requestFailed', fnRequestFailed);
							});
						},
						// functions for sort, filter group in table header in worklist light
						onWorkListLightTableSort: function(oEvent) {
							var oSmartTable = oState.oSmartTable;
							if (oSmartTable) {
								oSmartTable.openPersonalisationDialog("Sort");
							}
						},
						onWorkListLightTableFilter: function() {
							var oSmartTable = oState.oSmartTable;
							if (oSmartTable) {
								oSmartTable.openPersonalisationDialog("Filter");
							}
						},
						onWorkListLightTableGroup: function() {
							var oSmartTable = oState.oSmartTable;
							if (oSmartTable) {
							oSmartTable.openPersonalisationDialog("Group");
							}
						},
						onWorkListLightTableColumns: function() {
							var oSmartTable = oState.oSmartTable;
							if (oSmartTable) {
								oSmartTable.openPersonalisationDialog("Columns");
							}
						}
					},
					formatters: {
						formatDraftType: function(oDraftAdministrativeData, bIsActiveEntity, bHasDraftEntity) {
							if (oDraftAdministrativeData && oDraftAdministrativeData.DraftUUID) {
								if (!bIsActiveEntity) {
									return sap.m.ObjectMarkerType.Draft;
								} else if (bHasDraftEntity) {
									return oDraftAdministrativeData.InProcessByUser ? sap.m.ObjectMarkerType.Locked : sap.m.ObjectMarkerType.Unsaved;
								}
							}
							return sap.m.ObjectMarkerType.Flagged;
						},

						formatDraftVisibility: function(oDraftAdministrativeData, bIsActiveEntity) {
							if (oDraftAdministrativeData && oDraftAdministrativeData.DraftUUID) {
								if (!bIsActiveEntity) {
									return sap.m.ObjectMarkerVisibility.TextOnly; //for Draft mode only the text will be shown
								}
							}
							return sap.m.ObjectMarkerVisibility.IconAndText; //Default text and icon
						},

						formatDraftLineItemVisible: function(oDraftAdministrativeData) {
							if (oDraftAdministrativeData && oDraftAdministrativeData.DraftUUID) {
								return true;
							}
							return false;
						},

						// Returns full user name or ID of owner of a draft with status "unsaved changes" or "locked" in the format "by full name" or "by UserId"
						// If the user names and IDs are not maintained we display for example "locked by another user"
						formatDraftOwner: function(oDraftAdministrativeData, bHasDraftEntity) {
							var sDraftOwnerDescription = "";
							if (oDraftAdministrativeData && oDraftAdministrativeData.DraftUUID && bHasDraftEntity) {
								var sUserDescription = oDraftAdministrativeData.InProcessByUserDescription || oDraftAdministrativeData.InProcessByUser || oDraftAdministrativeData.LastChangedByUserDescription || oDraftAdministrativeData.LastChangedByUser;
								if (sUserDescription){
									sDraftOwnerDescription = oTemplateUtils.oCommonUtils.getText("ST_DRAFT_OWNER", [sUserDescription]);
								} else {
									sDraftOwnerDescription = oTemplateUtils.oCommonUtils.getText("ST_DRAFT_ANOTHER_USER");
								}
							}
							return sDraftOwnerDescription;
						},
						
						formatItemTextForMultipleView: function(oItem){
							return oState.oMultipleViewsSingleTableModeHelper ? oState.oMultipleViewsSingleTableModeHelper.formatItemTextForMultipleView(oItem) : "";
						}
					},

					extensionAPI: new ExtensionAPI(oTemplateUtils, oController, oState)
				};
			}
		};

	});