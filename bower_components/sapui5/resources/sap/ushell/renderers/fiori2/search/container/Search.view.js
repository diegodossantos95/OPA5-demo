// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/renderers/fiori2/search/controls/SearchLayout','sap/ushell/renderers/fiori2/search/controls/SearchResultListContainer','sap/ushell/renderers/fiori2/search/controls/SearchResultList','sap/ushell/renderers/fiori2/search/controls/SearchResultTable','sap/ushell/renderers/fiori2/search/controls/SearchNoResultScreen','sap/ushell/renderers/fiori2/search/SearchHelper','sap/ushell/renderers/fiori2/search/controls/SearchLabel','sap/ushell/renderers/fiori2/search/controls/SearchLink','sap/ushell/renderers/fiori2/search/controls/SearchResultMap','sap/ushell/renderers/fiori2/search/controls/SearchResultListItem','sap/ushell/renderers/fiori2/search/controls/CustomSearchResultListItem','sap/ushell/renderers/fiori2/search/controls/SearchFacetFilter','sap/ushell/renderers/fiori2/search/controls/DivContainer','sap/ushell/renderers/fiori2/search/controls/SearchTilesContainer','sap/ushell/renderers/fiori2/search/controls/SearchFilterBar','sap/ushell/services/Personalization','sap/m/TablePersoController','sap/ui/vbm/AnalyticMap','sap/ui/vbm/Spot','sap/m/BusyDialog'],function(S,a,b,c,d,f,g,h,j,k,C){"use strict";return sap.ui.jsview("sap.ushell.renderers.fiori2.search.container.Search",{createContent:function(o){var t=this;t.centerArea=t.assembleCenterArea();var e=new sap.m.MessageStrip({text:sap.ushell.resources.i18n.getText('did_you_mean','{/queryFilter/searchTerms}'),showIcon:true,class:'sapUiMediumMarginBottom',visible:{parts:[{path:'/fuzzy'},{path:'/boCount'}],formatter:function(i,l){if(i===true&&l>0){return true;}else{return false;}}}});var r=new a({centerAreaHeader:null,centerArea:t.centerArea,didYouMeanBar:e,totalCountBar:t.assembleCountLabel(),noResultScreen:new d({searchBoxTerm:{parts:[{path:'/queryFilter/searchTerms'}],formatter:function(s){return s;}},visible:{parts:[{path:'/count'},{path:'/isBusy'}],formatter:function(i,l){return i===0&&!l;}}})});t.searchLayout=new S({resultListContainer:r,busyIndicator:new sap.m.BusyDialog(),isBusy:'{/isBusy}',showFacets:{parts:[{path:'/count'},{path:'/facetVisibility'},{path:'/uiFilter/defaultConditionGroup'}],formatter:function(i,l,m){if(!l){return false;}var n=m&&m.conditions&&m.conditions.length>0;if(i===0&&!n){return false;}return true;}},vertical:false,facets:new sap.ushell.renderers.fiori2.search.controls.SearchFacetFilter()});t.searchLayout.addStyleClass('sapUshellSearchLayout');t.searchContainer=new sap.ushell.renderers.fiori2.search.controls.DivContainer({content:[t.searchLayout],cssClass:'sapUshellSearchContainer'});t.oFocusHandler=new f.SearchFocusHandler(t);return t.searchContainer;},assembleFilterButton:function(){var t=this;var e=new sap.m.ToggleButton({icon:sap.ui.core.IconPool.getIconURI("filter"),tooltip:{parts:[{path:'/facetVisibility'}],formatter:function(i){return i?sap.ushell.resources.i18n.getText("hideFacetBtn_tooltip"):sap.ushell.resources.i18n.getText("showFacetBtn_tooltip");}},pressed:'{/facetVisibility}',press:function(){if(this.getPressed()){t.getModel().setFacetVisibility(true);}else{t.getModel().setFacetVisibility(false);}},visible:{parts:[{path:'/businessObjSearchEnabled'},{path:'/count'}],formatter:function(i,l){if(l===0){return false;}return!sap.ui.Device.system.phone&&i;}}});e.addStyleClass('searchBarFilterButton');return e;},searchToolbarEntryVisibility:{parts:[{path:'/count'}],formatter:function(e){return e!==0&&!sap.ui.Device.system.phone;}},assembleCountLabel:function(){var l=new sap.m.Label({visible:{parts:[{path:'/count'}],formatter:function(e){return e!==0;}},text:{parts:[{path:'/count'}],formatter:function(e){if(typeof e!=='number'){return"";}var i=f.formatInteger(e);return sap.ushell.resources.i18n.getText("results")+' ('+i+')';}}});l.addStyleClass('sapUshellSearchTotalCountSelenium');return l;},assembleSearchToolbar:function(w){var t=this;var e=t.assembleDisplaySwitchTapStrips();var i=new sap.m.Button({icon:"sap-icon://sort",tooltip:"{i18n>sortTable}",type:sap.m.ButtonType.Transparent,visible:{parts:[{path:'/displaySwitchVisibility'},{path:'/count'},{path:'/tableSortableColumns'}],formatter:function(m,n,o){return m&&n!==0&&o.length>1;}},press:function(m){t.tableSortDialog.open();}});e.addEventDelegate({onAfterRendering:function(E){var D=E.srcControl;if(D.getItems().length===2&&t.determineIfMaps(t)){D.addItem(new sap.m.SegmentedButtonItem({icon:"sap-icon://map",tooltip:sap.ushell.resources.i18n.getText("displayMap"),key:"map"}));}}});e.addStyleClass("sapUshellSearchResultDisplaySwitch");i.addStyleClass("sapUshellSearchTableSortButton");var l=new sap.m.Button("tablePersonalizeButton",{icon:"sap-icon://action-settings",tooltip:"{i18n>personalizeTable}",type:sap.m.ButtonType.Transparent,visible:{parts:[{path:'/resultToDisplay'}],formatter:function(r){return r==="searchResultTable";}},press:function(m){t.oTablePersoController.openDialog();}});l.addStyleClass("sapUshellSearchTablePersonalizeButton");if(!w){var s=this.assembleShareButton();return[l,i,s,e];}else{return[l,i,e];}},assembleShareButton:function(){var t=this;var B=new sap.ushell.ui.footerbar.AddBookmarkButton({beforePressHandler:function(){var o={url:document.URL,title:t.getModel().getDocumentTitle(),icon:sap.ui.core.IconPool.getIconURI("search")};B.setAppData(o);}});B.setWidth('auto');var e=new sap.m.Button();e.setIcon("sap-icon://email");e.setText(sap.ushell.resources.i18n.getText("eMailFld"));e.attachPress(function(){sap.m.URLHelper.triggerEmail(null,t.getModel().getDocumentTitle(),document.URL);});e.setWidth('auto');var A=new sap.m.ActionSheet({placement:'Bottom',buttons:[B,e]});var s=new sap.m.Button({icon:'sap-icon://action',tooltip:sap.ushell.resources.i18n.getText('shareBtn'),press:function(){A.openBy(s);}});return s;},assembleDataSourceTapStrips:function(){var t=this;var e=new sap.m.OverflowToolbar({design:sap.m.ToolbarDesign.Transparent,visible:{parts:[{path:'/facetVisibility'},{path:'/count'},{path:'/businessObjSearchEnabled'}],formatter:function(i,m,n){return!i&&m>0&&n;}}});e.data("sap-ui-fastnavgroup","false",true);e.addStyleClass('searchTabStrips');t.tabBar=e;var l=new sap.ui.core.InvisibleText({text:"Data Sources"}).toStatic();e.addDependent(l);e.addAriaLabelledBy(l);e.bindAggregation('content','/tabStrips/strips',function(I,o){var m=new sap.m.ToggleButton({text:'{labelPlural}',type:{parts:[{path:'/tabStrips/selected'}],formatter:function(s){var i=this.getBindingContext().getObject();if(i.equals(s)===true){return sap.m.ButtonType.Transparent;}else{return sap.m.ButtonType.Transparent;}}},pressed:{parts:[{path:'/tabStrips/selected'}],formatter:function(s){var i=this.getBindingContext().getObject();return i.equals(s);}},press:function(p){this.setType(sap.m.ButtonType.Transparent);if(this.getBindingContext().getObject().equals(t.getModel().getProperty('/tabStrips/selected'))){this.setPressed(true);return;}var B=t.tabBar.getContent();for(var i=0;i<B.length;i++){if(B[i].getId()!==this.getId()){B[i].setType(sap.m.ButtonType.Transparent);if(B[i].getPressed()===true){B[i].setPressed(false);}}}t.getModel().setDataSource(this.getBindingContext().getObject());}});var n=new sap.ui.core.InvisibleText({text:o.getProperty("labelPlural")+", "+sap.ushell.resources.i18n.getText("dataSource")}).toStatic();m.addAriaLabelledBy(n);m.addDependent(n);return m;});e._setupItemNavigation=function(){if(!this.theItemNavigation){this.theItemNavigation=new sap.ui.core.delegate.ItemNavigation();this.addDelegate(this.theItemNavigation);}this.theItemNavigation.setCycling(false);this.theItemNavigation.setRootDomRef(this.getDomRef());var m=[];var n=this.getContent();for(var i=0;i<n.length;i++){if(!$(n[i].getDomRef()).attr("tabindex")){var o="-1";if(n[i].getPressed&&n[i].getPressed()){o="0";}$(n[i].getDomRef()).attr("tabindex",o);}m.push(n[i].getDomRef());}var p=this.getAggregation("_overflowButton");if(p&&p.getDomRef){var _=p.getDomRef();m.push(_);$(_).attr("tabindex","-1");}this.theItemNavigation.setItemDomRefs(m);};e.addEventDelegate({onAfterRendering:function(E){var t=this;t.getAggregation("_overflowButton").addEventDelegate({onAfterRendering:function(E){t._setupItemNavigation();}},t.getAggregation("_overflowButton"));t._setupItemNavigation();}},e);return e;},reorgTabBarSequence:function(){if(!this.tabBar){return;}var e=new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.High});var n=new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.NeverOverflow});var B=this.tabBar.getContent();for(var i=0;i<B.length;i++){if(this.getModel().getProperty('/tabStrips/selected').equals(B[i].getBindingContext().getObject())){B[i].setLayoutData(n);}else{B[i].setLayoutData(e);}}},determineIfMaps:function(o){var i=false;if(o.getModel()&&o.getModel().config.maps){i=true;}var m,s,r,M,D,A,e,l;m=o.getModel();if(m&&m.sina){s=m.sina;D=m.getDataSource();r=s.getRootDataSource();if(!D.equals(r)&&D.type!=='Category'){M=s.getBusinessObjectMetaDataSync(D);if(M&&M.attributeMap){A=M.attributeMap;for(e in A){if(!A.hasOwnProperty(e))continue;l=A[e];if(l.label==="LOC_4326"){i=true;break;}}}}}return i;},assembleDisplaySwitchTapStrips:function(){var t=this;var i=[new sap.m.SegmentedButtonItem({icon:"sap-icon://list",tooltip:sap.ushell.resources.i18n.getText("displayList"),key:"list"}),new sap.m.SegmentedButtonItem({icon:"sap-icon://table-view",tooltip:sap.ushell.resources.i18n.getText("displayTable"),key:"table"})];if(t.determineIfMaps(t)){i.push(new sap.m.SegmentedButtonItem({icon:"sap-icon://map",tooltip:sap.ushell.resources.i18n.getText("displayMap"),key:"map"}));}var s=new sap.m.SegmentedButton('ResultViewType',{selectedKey:{parts:[{path:'/resultToDisplay'}],formatter:function(r){var e="list";if(r==="searchResultTable"){e="table";}else if(r==="searchResultList"){e="list";}else if(r==="searchResultMap"){e="map";}return e;}},items:i,visible:{parts:[{path:'/displaySwitchVisibility'},{path:'/count'}],formatter:function(e,l){return e&&l!==0;}},select:function(e){var l=e.mParameters.key;var m=t.getModel();switch(l){case"list":m.setProperty('/resultToDisplay',"searchResultList");t.showMoreFooter.setVisible(t.isShowMoreFooterVisible());t.searchResultMap.setVisible(false);break;case"table":m.setProperty('/resultToDisplay',"searchResultTable");t.showMoreFooter.setVisible(t.isShowMoreFooterVisible());t.searchResultMap.setVisible(false);break;case"map":m.setProperty('/resultToDisplay',"searchResultMap");t.showMoreFooter.setVisible(false);break;default:m.setProperty('/resultToDisplay',"searchResultList");t.showMoreFooter.setVisible(t.isShowMoreFooterVisible());}m.enableOrDisableMultiSelection();}.bind(this)});s.addStyleClass("sapUshellSearchDisplaySwitchTapStrips");return s;},isShowMoreFooterVisible:function(){var m=this.getModel();return m.getProperty("/boCount")>m.getProperty("/boResults").length;},assembleCenterArea:function(){var t=this;t.tableSortDialog=t.assembleSearchResultSortDialog();var s=t.assembleSearchResultList();t.searchResultTable=t.assembleSearchResultTable();t.searchResultTable.addDelegate({onBeforeRendering:function(){t.updateTableLayout();}});t.searchResultMap=t.assembleSearchResultMap();t.searchResultMap.setVisible(false);t.appSearchResult=t.assembleAppSearch();t.showMoreFooter=t.assembleShowMoreFooter();return[t.tableSortDialog,s,t.searchResultTable,t.searchResultMap,t.appSearchResult,t.showMoreFooter];},assembleSearchResultSortDialog:function(){var t=this;var e=new sap.m.ViewSettingsDialog({sortDescending:{parts:[{path:"/orderBy"}],formatter:function(o){return jQuery.isEmptyObject(o)||o.sortOrder==="DESC";}},confirm:function(i){var p=[];p=i.getParameters();if(p.sortItem){var o=t.getModel();if(p.sortItem.getKey()==="ushellSearchDefaultSortItem"){o.resetOrderBy();e.setSortDescending(true);}else{o.setOrderBy({orderBy:p.sortItem.getBindingContext().getObject().originalKey,sortOrder:p.sortDescending===true?"DESC":"ASC"});}}},cancel:function(i){var l=t.getModel().getOrderBy().orderBy===undefined?"ushellSearchDefaultSortItem":t.getModel().getOrderBy().orderBy;this.setSelectedSortItem(l);}});e.bindAggregation("sortItems","/tableSortableColumns",function(p,D){return new sap.m.ViewSettingsItem({key:"{key}",originalKey:"{originalKey}",text:"{name}",selected:"{selected}"});});return e;},assembleSearchResultTable:function(){var t=this;var r=new c("ushell-search-result-table",{mode:{parts:[{path:'/multiSelectionEnabled'}],formatter:function(m){return m===true?sap.m.ListMode.MultiSelect:sap.m.ListMode.None;}},noDataText:'{i18n>noCloumnsSelected}',visible:{parts:[{path:'/resultToDisplay'},{path:'/count'}],formatter:function(e,i){return e==="searchResultTable"&&i!==0;}},rememberSelections:false});r.bindAggregation("columns","/tableColumns",function(p,D){var e=D.getObject();var i=new sap.m.Column(e.key,{header:new sap.m.Label({text:"{name}",tooltip:"{name}"}),visible:{parts:[{path:'index'}],formatter:function(l){return l<5;}}});return i;});r.bindAggregation("items","/tableResults",function(p,D){return t.assembleTableItems(D);});r.addEventDelegate({onAfterRendering:function(){t.updatePersoServiceAndController();}});return r;},assembleTableItems:function(D){var t=this;var o=D.getObject();if(o.type==='footer'){return new sap.m.CustomListItem({visible:false});}else{return t.assembleTableMainItems(o,D.getPath());}},assembleTableMainItems:function(D,p){var s=p+"/itemattributes";var e=new sap.m.ColumnListItem({selected:"{selected}"});e.bindAggregation("cells",s,function(s,l){if(l.getObject().isTitle){var t="";var m;var n=l.getObject().titleNavigation;if(n){t=n.getHref();m=n.getTarget();}var o=(t&&t.length>0)?true:false;var q=new h({text:"{value}",enabled:o,href:t,press:function(){var n=l.getObject().titleNavigation;if(n){n.trackNavigation();}}});q.addStyleClass("sapUshellSearchResultListItem-MightOverflow");if(m){q.setTarget(m);}return q;}else if((l.getObject().isNavigationObjects)){var r=l.getObject().navigationObjects;var u=[];var v={};var w=function(y,x){x.performNavigation();};for(var i=0;i<r.length;i++){var x=r[i];v=new sap.m.Button({text:x.getText(),tooltip:x.getText()});v.attachPress(x,w);u.push(v);}return new sap.m.Button({icon:"sap-icon://action",press:function(){var y=new sap.m.ActionSheet({buttons:u});y.openBy(this);}});}else{return new g({text:"{value}"}).addStyleClass("sapUshellSearchResultListItem-MightOverflow");}});return e;},onRegionClick:function(e){},onRegionContextMenu:function(e){},assembleSearchResultMap:function(){var s=new j({visible:{parts:[{path:'/resultToDisplay'},{path:'/count'}],formatter:function(r,e){return r==="searchResultMap"&&e!==0;}}});return s;},assembleShowMoreFooter:function(){var t=this;var e=new sap.m.Button({text:"{i18n>showMore}",type:sap.m.ButtonType.Transparent,press:function(){var o=t.getModel();o.setProperty('/focusIndex',o.getTop());var n=o.getTop()+o.pageSize;o.setTop(n);}});e.addStyleClass('sapUshellResultListMoreFooter');var i=new sap.m.FlexBox({visible:{parts:[{path:'/boCount'},{path:'/boResults'}],formatter:function(l,m){return m.length<l;}},justifyContent:sap.m.FlexJustifyContent.Center});i.addStyleClass('sapUshellResultListMoreFooterContainer');i.addItem(e);return i;},assembleSearchResultList:function(){var t=this;t.resultList=new b({mode:sap.m.ListMode.None,width:"auto",showNoData:false,visible:{parts:[{path:'/resultToDisplay'},{path:'/count'}],formatter:function(r,e){return r==="searchResultList"&&e!==0;}}});t.resultList.bindAggregation("items","/results",function(p,o){return t.assembleListItem(o);});return t.resultList;},assembleAppSearch:function(){var t=this;var e=new sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer({addAccInformation:true,maxRows:99999,totalLength:'{/appCount}',visible:{parts:[{path:'/resultToDisplay'},{path:'/count'}],formatter:function(r,i){return r==="appSearchResult"&&i!==0;}},highlightTerms:'{/uiFilter/searchTerms}',showMore:function(){var m=t.getModel();m.setProperty('/focusIndex',e.getNumberDisplayedTiles()-1);var n=m.getTop()+m.pageSize*e.getTilesPerRow();m.setTop(n);}});e.bindAggregation('tiles','/appResults',function(i,o){return t.getTileView(o.getObject().tile);});e.addStyleClass('sapUshellSearchTileResultList');sap.ui.getCore().getEventBus().subscribe('searchLayoutChanged',function(){e.delayedRerender();},this);return e;},assembleTitleItem:function(D){var i=new sap.m.CustomListItem();var t=new sap.m.Label({text:"{title}"});t.addStyleClass('bucketTitle');i.addStyleClass('bucketTitleContainer');i.addContent(new sap.m.HBox({items:[t]}));return i;},assembleAppContainerResultListItem:function(D,p){var t=this;var e=new sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer({maxRows:sap.ui.Device.system.phone?2:1,totalLength:'{/appCount}',highlightTerms:'{/uiFilter/searchTerms}',enableKeyHandler:false,resultList:t.resultList,showMore:function(){var m=t.getModel();m.setDataSource(m.appDataSource);}});e.bindAggregation('tiles','tiles',function(i,o){return t.getTileView(o.getObject().tile);});var l=new sap.m.CustomListItem({content:e});l.addStyleClass('sapUshellSearchResultListItem');l.addStyleClass('sapUshellSearchResultListItemApps');l.addEventDelegate({onAfterRendering:function(E){var i=$(l.getDomRef());i.removeAttr("tabindex");i.removeAttr("role");i.attr("aria-hidden","true");}},l);sap.ui.getCore().getEventBus().subscribe('searchLayoutChanged',function(){e.delayedRerender();},this);return l;},assembleResultListItem:function(D,p){var e=this.getModel().config.getDataSourceConfig(D.dataSource);var s={title:"{$$Name$$}",titleUrl:"{uri}",titleNavigation:"{titleNavigation}",type:"{dataSourceName}",imageUrl:"{imageUrl}",suvlink:"{suvlink}",containsThumbnail:"{containsThumbnail}",containsSuvFile:"{containsSuvFile}",attributes:"{itemattributes}",navigationObjects:"{navigationObjects}",selected:"{selected}",expanded:"{expanded}"};var i;if(e.searchResultListItemControl){i=new e.searchResultListItemControl(s);}else if(e.searchResultListItemContentControl){s.content=new e.searchResultListItemContentControl();i=new C(s);}else{i=new k(s);}var l=new sap.m.CustomListItem({content:i});l.addStyleClass('sapUshellSearchResultListItem');if(i.setParentListItem){i.setParentListItem(l);}return l;},assembleListItem:function(o){var t=this;var D=o.getObject();if(D.type==='title'){return t.assembleTitleItem(D);}else if(D.type==='footer'){return new sap.m.CustomListItem();}else if(D.type==='appcontainer'){return t.assembleAppContainerResultListItem(D,o.getPath());}else{return t.assembleResultListItem(D,o.getPath());}},getTileView:function(t){try{var i=t.getContract('types');i.setType('tile');}catch(e){}var v=sap.ushell.Container.getService('LaunchPage').getCatalogTileView(t);var l=sap.ushell.Container.getService('LaunchPage').getCatalogTileTargetURL(t);var m='app';if(t.getTitle){m=t.getTitle();}v.eventLoggingData={targetUrl:l,title:m};return v;},onAllSearchStarted:function(){},onAllSearchFinished:function(){var t=this;t.reorgTabBarSequence();t.oFocusHandler.setFocus();var v=sap.ui.getCore().byId('viewPortContainer');if(v&&v.switchState){v.switchState('Center');}},updatePersoServiceAndController:function(){var t=this;var m=t.getModel();var e=m.getDataSource().key;if(!t.oTablePersoController){var p=m.getPersonalizationStorageInstance();t.oTablePersoController=new sap.m.TablePersoController({table:sap.ui.getCore().byId("ushell-search-result-table"),persoService:p.getPersonalizer('search-result-table-state-'+e)}).activate();t.oTablePersoController.refresh();}if(t.oTablePersoController&&t.oTablePersoController.getPersoService().getKey()!=='search-result-table-state-'+e){t.oTablePersoController.setPersoService(m.getPersonalizationStorageInstance().getPersonalizer('search-result-table-state-'+e));t.oTablePersoController.refresh();}},updateTableLayout:function(){var t=this;if(t.searchResultTable){var e=t.searchResultTable.getColumns();var v=0;for(var i=0;i<e.length;i++){if(e[i].getVisible()){v++;}}if(v<=3){t.searchResultTable.setFixedLayout(false);}else{t.searchResultTable.setFixedLayout(true);}}},setAppView:function(A){var t=this;t.oAppView=A;if(t.oTilesContainer){t.oTilesContainer.setAppView(A);}},getControllerName:function(){return"sap.ushell.renderers.fiori2.search.container.Search";}});});
