sap.ui.define(["jquery.sap.global","sap/ui/model/json/JSONModel","sap/m/ObjectIdentifier","sap/m/Table","sap/m/Text","sap/ui/comp/smartfield/SmartField","sap/ui/generic/app/navigation/service/SelectionVariant","sap/suite/ui/generic/template/ListReport/extensionAPI/ExtensionAPI","sap/m/MessageBox","sap/suite/ui/generic/template/js/AnnotationHelper","sap/suite/ui/generic/template/lib/MessageUtils","sap/suite/ui/generic/template/ListReport/controller/IappStateHandler","sap/suite/ui/generic/template/ListReport/controller/MultipleViewsSingleTableModeHelper","sap/ui/table/Table","sap/ui/table/AnalyticalTable","sap/ui/model/Filter","sap/ui/comp/navpopover/LinkData","sap/suite/ui/generic/template/ListReport/controller/SmartChartController"],function(q,J,O,T,a,S,b,E,M,A,c,I,d,U,f,F,L,g){"use strict";return{getMethods:function(v,t,C){var s={};s.fnUpdateTableOnSelectionChange=u;var h=true;var o;function j(){var e=C.getOwnerComponent();var i=e.getModel("_templPriv");i.setProperty("/listReport/isLeaf",e.getIsLeaf());}function k(){var G=q.sap.getObject("sap.ushell.Container.getUser");var e=C.getOwnerComponent().getAppComponent().getMetadata().getManifestEntry("sap.ui");var i=(e&&e.icons&&e.icons.icon)||"";var H={bookmarkIcon:i,bookmarkCustomUrl:function(){var N=hasher.getHash();return N?("#"+N):window.location.href;},bookmarkServiceUrl:function(){var N=s.oSmartTable.getTable();var P=N.getBinding("rows")||N.getBinding("items");return P?P.getDownloadUrl()+"&$top=0&$inlinecount=allpages":"";},isShareInJamActive:!!G&&G().isJamActive()};var K=C.getOwnerComponent().getModel("_templPriv");K.setProperty("/listReport/share",H);}function p(){var e=C.getOwnerComponent().getAppComponent();var G=e.getConfig();if(G&&G.pages[0]&&G.pages[0].component&&G.pages[0].component.settings&&G.pages[0].component.settings.quickVariantSelectionX&&G.pages[0].component.settings.quickVariantSelectionX.variants){s.oTableTabData={aTableIsDirty:{},oCurrentBindingParams:{}};s.oIconTabBar=C.byId("template::IconTabBar");if(G.pages[0].component.settings.quickVariantSelectionX.showCounts){var H=s.oIconTabBar.getItems();for(var K in H){x(H,K,0);}}s.aSmartTables={};for(var i in G.pages[0].component.settings.quickVariantSelectionX.variants){var N=sap.suite.ui.generic.template.js.AnnotationHelper.getIconTabFilterKey(G.pages[0].component.settings.quickVariantSelectionX.variants[i]);var P=sap.suite.ui.generic.template.js.AnnotationHelper.getSmartTableId(G.pages[0].component.settings.quickVariantSelectionX.variants[i]);s.aSmartTables[N]=C.byId(P);if(!s.oSmartTable){s.oSmartTable=s.aSmartTables[N];}else{s.aSmartTables[N].setVisible(false);}s.oTableTabData.aTableIsDirty[s.aSmartTables[N].getId()]=false;}s.oSmartFilterbar.attachSearch(function(Q){s.oSmartTable._reBindTable(Q);if(G.pages[0].component.settings.quickVariantSelectionX.showCounts){w();}for(var i in s.oTableTabData.aTableIsDirty){s.oTableTabData.aTableIsDirty[i]=true;}s.oTableTabData.aTableIsDirty[s.oSmartTable.getId()]=false;s.oTableTabData.searchButtonPressed=true;});if(G.pages[0].component.settings.quickVariantSelectionX.enableAutoBinding){s.oSmartFilterbar.search();}}}function l(e){C.onInitSmartFilterBarExtension(e);s.oIappStateHandler.onSmartFilterBarInitialise();}function m(){var e=s.oIappStateHandler.parseUrlAndApplyAppState();e.then(function(){h=false;},function(i){if(i instanceof Error){i.showMessageBox();h=false;}});}function n(){if(!h){s.oIappStateHandler.changeIappState(true,false);}}function u(e){var G=e.getModel(),P=e.getModel("_templPriv");var H=G.getMetaModel(),K=H.getODataEntitySet(C.getOwnerComponent().getEntitySet()),N=K["Org.OData.Capabilities.V1.DeleteRestrictions"];var Q=false;if(sap.suite.ui.generic.template.js.AnnotationHelper.areDeleteRestrictionsValid(H,K.entityType,N)){var R=(N&&N.Deletable&&N.Deletable.Path)?N.Deletable.Path:"";var V=true;var W=(R&&R!=="");var X=t.oCommonUtils.getSelectedContexts(e);if(X.length>0){for(var i=0;i<X.length;i++){var Y=G.getObject(X[i].getPath());if(!(Y.IsActiveEntity&&Y.HasDraftEntity&&Y.DraftAdministrativeData&&Y.DraftAdministrativeData.InProcessByUser)){V=false;}if(W){if(G.getProperty(R,X[i])){W=false;}}if(!V&&!W){Q=true;break;}}}}P.setProperty("/listReport/deleteEnabled",Q);t.oCommonUtils.setEnabledToolbarButtons(e);if(e instanceof sap.ui.comp.smartchart.SmartChart){return;}t.oCommonUtils.setEnabledFooterButtons(e);}function r(e){s.oMultipleViewsSingleTableModeHelper.onAfterVariantChanged(e);}function w(){var e=s.oSmartTable.getModel();var G=C.byId("template::IconTabBar");var H=G.getItems();for(var K in H){var N=[];var P=C.byId("listReport-"+H[K].getKey());var Q=t.oCommonUtils.getSelectionVariantFilters(P);for(var i in s.oTableTabData.oCurrentBindingParams.filters){N.push(s.oTableTabData.oCurrentBindingParams.filters[i]);}for(var i in Q){N.push(Q[i]);}var R=P.getEntitySet();e.read("/"+R+"/$count",{urlParameters:s.oTableTabData.oCurrentBindingParams.parameters.custom,filters:N,groupId:"updateTabCounts",success:x.bind(null,H,K),error:function(V,W){}});}}function x(e,i,G){e[i].setCount(G);}function y(e,G){s.oTableTabData.oCurrentBindingParams.filters=[];for(var i in e.filters){s.oTableTabData.oCurrentBindingParams.filters.push(e.filters[i]);}s.oTableTabData.oCurrentBindingParams.parameters=e.parameters;var H=t.oCommonUtils.getSelectionVariantFilters(G);for(var i in H){e.filters.push(H[i]);}}function z(e){var i=e.getParameters();var G=e.getSource();t.oCommonEventHandlers.onSemanticObjectLinkNavigationPressed(G,i);}function B(e){var i,G;i=e.getParameters();G=e.getSource();t.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(G,i,s,undefined,undefined);}function D(e){var i,G,H,K,N,P;i=e.getParameters().mainNavigation;N=e.getParameters();P=e.getSource();if(i){G=P.getText&&P.getText();H=t.oCommonUtils.getCustomData(e);if(H&&H["LinkDescr"]){K=H["LinkDescr"];i.setDescription(K);}}P=P.getParent().getParent().getParent().getParent();t.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(P,N,s,G,i);}return{onInit:function(){s.oSmartFilterbar=C.byId("listReportFilter");s.oSmartTable=C.byId("listReport");o=t.oServices.oApplication.getFclProxyForView(0);s.bLoadListAndFirstEntryOnStartup=o&&o.isListAndFirstEntryLoadedOnStartup&&o.isListAndFirstEntryLoadedOnStartup();p();var e=C.getOwnerComponent().getAppComponent();var i=e.getConfig();s.bWorkListEnabled=i.pages[0].component.settings&&i.pages[0].component.settings.isWorklist||false;if(i&&i.pages[0]&&i.pages[0].component&&i.pages[0].component.settings&&i.pages[0].component.settings._quickVariantSelectionX&&i.pages[0].component.settings._quickVariantSelectionX.variants){s.oSmartChartController=new g(s,C,t);s.oSmartChartController.onSmartChartInit();}s.oTemplateUtils=t;s.oIappStateHandler=new I(s,C,t.oCommonUtils.getNavigationHandler());t.oServices.oApplication.registerStateChanger({isStateChange:s.oIappStateHandler.isStateChange});v.getUrlParameterInfo=s.oIappStateHandler.getUrlParameterInfo;v.onComponentActivate=function(){if(!h){s.oIappStateHandler.parseUrlAndApplyAppState();}};v.refreshBinding=function(){if(s.oIappStateHandler.areDataShownInTable()){t.oCommonUtils.refreshSmartTable(s.oSmartTable);}};j();k();var G=C.getOwnerComponent();C.byId("template::FilterText").attachBrowserEvent("click",function(){C.byId("page").setHeaderExpanded(true);});var H=G.getModel("_templPriv");H.setProperty("/listReport/deleteEnabled",false);var V,K,N="sapUiSizeCozy",P="sapUiSizeCompact",Q="sapUiSizeCondensed";if(s.oSmartTable instanceof sap.ui.comp.smartchart.SmartChart){V=C.getView();K=q(document.body);if(K.hasClass(N)||V.hasStyleClass(N)){s.oSmartTable.addStyleClass(N);}else if(K.hasClass(P)||V.hasStyleClass(P)){var R=G.getComponentContainer().getSettings().condensedTableLayout;if(R===true){s.oSmartTable.addStyleClass(Q);}else{s.oSmartTable.addStyleClass(P);}}}if(s.oSmartTable instanceof sap.ui.comp.smarttable.SmartTable){var W=s.oSmartTable.getTable();if(W instanceof U||W instanceof f){V=C.getView();K=q(document.body);if(K.hasClass(N)||V.hasStyleClass(N)){s.oSmartTable.addStyleClass(N);}else if(K.hasClass(P)||V.hasStyleClass(P)){var R=G.getComponentContainer().getSettings().condensedTableLayout;if(R===true){s.oSmartTable.addStyleClass(Q);}else{s.oSmartTable.addStyleClass(P);}}}}if(s.bWorkListEnabled){s.oSmartFilterbar.setSuppressSelection(false);s.oSmartFilterbar.search();}},handlers:{addEntry:function(e){var i=e.getSource();t.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){t.oCommonEventHandlers.addEntry(i,false,s.oSmartFilterbar);},q.noop,s);},deleteEntries:function(e){t.oCommonEventHandlers.deleteEntries(e);},updateTableTabCounts:w,onSelectionChange:function(e){var i=e.getSource();u(i);},onChange:function(e){t.oCommonEventHandlers.onChange(e);},onSmartFieldUrlPressed:function(e){t.oCommonEventHandlers.onSmartFieldUrlPressed(e,s);},onBreadCrumbUrlPressed:function(e){t.oCommonEventHandlers.onBreadCrumbUrlPressed(e,s);},onContactDetails:function(e){t.oCommonEventHandlers.onContactDetails(e);},onSmartFilterBarInitialise:l,onSmartFilterBarInitialized:m,onBeforeSFBVariantFetch:function(){s.oIappStateHandler.onBeforeSFBVariantFetch();},onAfterSFBVariantSave:function(){s.oIappStateHandler.onAfterSFBVariantSave();},onAfterSFBVariantLoad:function(e){s.oIappStateHandler.onAfterSFBVariantLoad(e);},onDataReceived:function(e){t.oCommonEventHandlers.onDataReceived(e);s.oMultipleViewsSingleTableModeHelper.onDataReceived(e);var i=e.getSource().getTable();o.handleDataReceived(i,s,t);},onBeforeRebindTable:function(e){t.oCommonEventHandlers.onBeforeRebindTable(e,{determineSortOrder:s.oMultipleViewsSingleTableModeHelper.determineSortOrder});C.onBeforeRebindTableExtension(e);if(s.oTableTabData){y(e.getParameter("bindingParams"),e.getSource());}s.oMultipleViewsSingleTableModeHelper.onBeforeRebindTable(e);},onShowDetails:function(e){t.oCommonEventHandlers.onShowDetails(e.getSource(),s);},onListNavigate:function(e){if(!C.onListNavigationExtension(e)){t.oCommonEventHandlers.onListNavigate(e.getSource(),s);}},onCallActionFromToolBar:function(e){t.oCommonEventHandlers.onCallActionFromToolBar(e,s);},onDataFieldForIntentBasedNavigation:function(e){t.oCommonEventHandlers.onDataFieldForIntentBasedNavigation(e,s);},onDataFieldWithIntentBasedNavigation:function(e){t.oCommonEventHandlers.onDataFieldWithIntentBasedNavigation(e,s);},onBeforeSemanticObjectLinkPopoverOpens:function(e){var i=e.getParameters();t.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){var G=s.oSmartFilterbar.getDataSuiteFormat();t.oCommonUtils.semanticObjectLinkNavigation(i,G,C);},q.noop,s,q.noop);},onSemanticObjectLinkNavigationPressed:z,onSemanticObjectLinkNavigationTargetObtained:B,onSemanticObjectLinkNavigationTargetObtainedSmartLink:D,onDraftLinkPressed:function(e){var i=e.getSource();var G=i.getBindingContext();t.oCommonUtils.showDraftPopover(G,i);},onAssignedFiltersChanged:function(e){if(e.getSource()){C.byId("template::FilterText").setText(e.getSource().retrieveFiltersWithValuesAsText());}},onFilterChange:n,onToggleFiltersPressed:function(){var e=C.getOwnerComponent();var i=e.getModel("_templPriv");i.setProperty("/listReport/isHeaderExpanded",!i.getProperty("/listReport/isHeaderExpanded"));},onSearchButtonPressed:function(){var e=C.getOwnerComponent().getModel();var R=function(i){c.handleError("getCollection",C,t.oServices,i.getParameters());s.oSmartTable.getTable().setBusy(false);c.handleTransientMessages(t.oServices.oApplication.getDialogFragmentForView.bind(null,C.getView()));};s.oIappStateHandler.changeIappState(false,true);e.attachEvent('requestFailed',R);e.attachEventOnce('requestCompleted',function(){if(s.oSmartTable instanceof sap.ui.comp.smarttable.SmartTable){s.oSmartTable.getTable().setBusy(false);}c.handleTransientMessages(t.oServices.oApplication.getDialogFragmentForView.bind(null,C.getView()));e.detachEvent('requestFailed',R);});},onSemanticObjectLinkPopoverLinkPressed:function(e){t.oCommonEventHandlers.onSemanticObjectLinkPopoverLinkPressed(e,s);},onAfterTableVariantSave:function(){s.oIappStateHandler.onAfterTableVariantSave();},onAfterApplyTableVariant:function(){if(!h){s.oIappStateHandler.onAfterApplyTableVariant();}},onAfterChartVariantInitialised:function(e){},onAfterChartVariantSave:function(e){s.oIappStateHandler.onAfterTableVariantSave();},onAfterApplyChartVariant:function(e){if(!h){s.oIappStateHandler.onAfterApplyTableVariant();}},onBeforeRebindChart:function(i){if(s.oSmartFilterbar&&s.oSmartFilterbar.getAnalyticBindingPath&&s.oSmartFilterbar.getConsiderAnalyticalParameters()){try{var G=s.oSmartFilterbar.getAnalyticBindingPath();if(G){s.oSmartTable.setChartBindingPath(G);}}catch(e){q.sap.log.warning("Mandatory parameters have no values","","List Report");}}t.oCommonEventHandlers.onBeforeRebindChart(i);if(s.oTableTabData){y(i.getParameter("bindingParams"),i.getSource());}C.onBeforeRebindChartExtension(i);},onChartInitialise:function(e){var i=e.getSource();var G=i.getChart();G.attachSelectData(s.oSmartChartController.onChartSelectData);G.attachDeselectData(s.oSmartChartController.onChartSelectData);i.attachSelectionDetailsActionPress(s.oSmartChartController.onDetailsActionPress);},onShareListReportActionButtonPress:function(e){var i=t.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.fragments.lists.ShareSheet",{shareEmailPressed:function(){sap.m.URLHelper.triggerEmail(null,t.oCommonUtils.getText("EMAIL_HEADER",[t.oServices.oApplication.getAppTitle()]),document.URL);},shareJamPressed:function(){var K=sap.ui.getCore().createComponent({name:"sap.collaboration.components.fiori.sharing.dialog",settings:{object:{id:document.URL,share:t.oServices.oApplication.getAppTitle()}}});K.open();}},"share",function(K,N){var R=sap.ui.getCore().getLibraryResourceBundle("sap.m");N.setProperty("/emailButtonText",R.getText("SEMANTIC_CONTROL_SEND_EMAIL"));N.setProperty("/jamButtonText",R.getText("SEMANTIC_CONTROL_SHARE_IN_JAM"));N.setProperty("/bookmarkButtonText",R.getText("SEMANTIC_CONTROL_SAVE_AS_TILE"));var P=q.sap.getObject("sap.ushell.Container.getUser");N.setProperty("/jamVisible",!!P&&P().isJamActive());});i.openBy(e.getSource());var G=this.getView().byId("template::Share");var H=this.getView().byId("bookmarkButton");H.setBeforePressHandler(function(){G.focus();});},onInlineDataFieldForAction:function(e){var i=e.getSource();var G=t.oCommonUtils.getElementCustomData(i);var H=t.oCommonUtils.getOwnerControl(i);var K=H.getParent().getTableBindingPath();var N=[i.getBindingContext()];t.oCommonUtils.triggerAction(N,K,G,H,s);},onInlineDataFieldForIntentBasedNavigation:function(e){t.oCommonEventHandlers.onInlineDataFieldForIntentBasedNavigation(e.getSource(),s);},onDeterminingDataFieldForAction:function(e){var i=s.oSmartTable.getTable();var G=t.oCommonUtils.getSelectedContexts(i);if(G.length===0){M.error(t.oCommonUtils.getText("ST_GENERIC_NO_ITEM_SELECTED"),{styleClass:t.oCommonUtils.getContentDensityClass()});}else{var H=e.getSource();var K=t.oCommonUtils.getElementCustomData(H);var N=s.oSmartTable.getTableBindingPath();t.oCommonUtils.triggerAction(G,N,K,i);}},onDeterminingDataFieldForIntentBasedNavigation:function(e){var i=e.getSource();var G=t.oCommonUtils.getElementCustomData(i);var H=s.oSmartTable.getTable();var K=t.oCommonUtils.getSelectedContexts(H);var R=!(G.RequiresContext&&G.RequiresContext==="false");if(R&&K.length===0){M.error(t.oCommonUtils.getText("ST_GENERIC_NO_ITEM_SELECTED"),{styleClass:t.oCommonUtils.getContentDensityClass()});}else if(R&&K.length>1){M.error(t.oCommonUtils.getText("ST_GENERIC_MULTIPLE_ITEMS_SELECTED"),{styleClass:t.oCommonUtils.getContentDensityClass()});}else{var N=R?K[0]:null;t.oCommonEventHandlers.onDataFieldForIntentBasedNavigationSelectedContext(N,G,s);}},onIconTabBarSelect:function(e){var K=e.getSource().getSelectedKey();var i,G;i=s.oSmartTable;G=s.aSmartTables[K];if(G){s.oSmartTable=G;i.setVisible(false);s.oSmartTable.setVisible(true);if(s.oTableTabData.aTableIsDirty[s.oSmartTable.getId()]){s.oSmartTable.rebindTable();t.oCommonUtils.refreshSmartTable(s.oSmartTable);s.oTableTabData.aTableIsDirty[s.oSmartTable.getId()]=false;}u(s.oSmartTable);s.oIappStateHandler.changeIappState(true,s.oTableTabData.searchButtonPressed);}},multipleViewSingleTableModeVariantChanged:r,onSmartChartSelect:function(e){var K=e.getSource().getSelectedKey();var i,G;i=s.oSmartTable;G=s.aSmartTablesCharts[K];if(G){s.oSmartTable=G;i.setVisible(false);s.oSmartTable.setVisible(true);if(s.oTableTabData.aTableIsDirty[s.oSmartTable.getId()]){if(s.oSmartTable instanceof sap.ui.comp.smartchart.SmartChart){s.oSmartTable.rebindChart(e);}else if(s.oSmartTable instanceof sap.ui.comp.smarttable.SmartTable){s.oSmartTable.rebindTable();t.oCommonUtils.refreshSmartTable(s.oSmartTable);s.oTableTabData.aTableIsDirty[s.oSmartTable.getId()]=false;}}if(s.oSmartTable instanceof sap.ui.comp.smarttable.SmartTable){u(s.oSmartTable);}s.oIappStateHandler.changeIappState(true,s.oTableTabData.searchButtonPressed);}},onTableInit:function(e){var i=e.getSource();var G=C.getOwnerComponent().getModel("_templPriv");t.oCommonUtils.checkToolbarIntentsSupported(i,G);s.oMultipleViewsSingleTableModeHelper=new d(s,C,t);},onSearchWorkListLight:function(e){var i=s.oSmartTable;i.data("searchString",e.getSource().getValue());i.data("allowSearchWorkListLight",true);i.rebindTable();var G=C.getOwnerComponent().getModel();var R=function(e){c.handleError("getCollection",C,t.oServices,e.getParameters());s.oSmartTable.getTable().setBusy(false);c.handleTransientMessages(t.oServices.oApplication.getDialogFragmentForView.bind(null,C.getView()));};G.attachEvent('requestFailed',R);G.attachEventOnce('requestCompleted',function(){G.detachEvent('requestFailed',R);});},onWorkListLightTableSort:function(e){var i=s.oSmartTable;if(i){i.openPersonalisationDialog("Sort");}},onWorkListLightTableFilter:function(){var e=s.oSmartTable;if(e){e.openPersonalisationDialog("Filter");}},onWorkListLightTableGroup:function(){var e=s.oSmartTable;if(e){e.openPersonalisationDialog("Group");}},onWorkListLightTableColumns:function(){var e=s.oSmartTable;if(e){e.openPersonalisationDialog("Columns");}}},formatters:{formatDraftType:function(e,i,H){if(e&&e.DraftUUID){if(!i){return sap.m.ObjectMarkerType.Draft;}else if(H){return e.InProcessByUser?sap.m.ObjectMarkerType.Locked:sap.m.ObjectMarkerType.Unsaved;}}return sap.m.ObjectMarkerType.Flagged;},formatDraftVisibility:function(e,i){if(e&&e.DraftUUID){if(!i){return sap.m.ObjectMarkerVisibility.TextOnly;}}return sap.m.ObjectMarkerVisibility.IconAndText;},formatDraftLineItemVisible:function(e){if(e&&e.DraftUUID){return true;}return false;},formatDraftOwner:function(e,H){var i="";if(e&&e.DraftUUID&&H){var G=e.InProcessByUserDescription||e.InProcessByUser||e.LastChangedByUserDescription||e.LastChangedByUser;if(G){i=t.oCommonUtils.getText("ST_DRAFT_OWNER",[G]);}else{i=t.oCommonUtils.getText("ST_DRAFT_ANOTHER_USER");}}return i;},formatItemTextForMultipleView:function(i){return s.oMultipleViewsSingleTableModeHelper?s.oMultipleViewsSingleTableModeHelper.formatItemTextForMultipleView(i):"";}},extensionAPI:new E(t,C,s)};}};});