/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','./BaseController','sap/m/library','./Util'],function(q,B,l,U){"use strict";var S=B.extend("sap.ui.comp.personalization.SortController",{constructor:function(i,s){B.apply(this,arguments);this.setType(sap.m.P13nPanelType.sort);},metadata:{events:{afterSortModelDataChange:{}}}});S.prototype.setTable=function(t){B.prototype.setTable.apply(this,arguments);if(U.getTableBaseType(t)===sap.ui.comp.personalization.TableType.Table){t.detachSort(this._onSort,this);t.attachSort(this._onSort,this);}};S.prototype._getTable2Json=function(){var j=this.createPersistentStructure();U.createSort2Json(this.getTable(),j.sort.sortItems,this.getIgnoreColumnKeys());return j;};S.prototype._getDataSuiteFormat2Json=function(d){var j=this.createPersistentStructure();U.addSortPersistentData(this._mapDataSuiteFormat2Json(d),j,this.getIgnoreColumnKeys());return j;};S.prototype._mapDataSuiteFormat2Json=function(d){var j=this.createPersistentStructure();if(!d.SortOrder||!d.SortOrder.length){return j;}j.sort.sortItems=d.SortOrder.map(function(s){return{columnKey:s.Property,isSorted:true,operation:s.Descending?"Descending":"Ascending"};});return j;};S.prototype.syncTable2TransientModel=function(){var t=this.getTable();var i=[];var c;var C;var o=this.getColumnMap(true);if(t){if(U.getTableBaseType(t)===sap.ui.comp.personalization.TableType.Table){for(C in o){c=o[C];if(U.isSortable(c)){i.push({columnKey:C,text:c.getLabel().getText(),tooltip:(c.getTooltip()instanceof sap.ui.core.TooltipBase)?c.getTooltip().getTooltip_Text():c.getTooltip_Text()});}}}else if(U.getTableType(t)===sap.ui.comp.personalization.TableType.ResponsiveTable){for(C in o){c=o[C];if(U.isSortable(c)){i.push({columnKey:C,text:c.getHeader().getText(),tooltip:(c.getHeader().getTooltip()instanceof sap.ui.core.TooltipBase)?c.getHeader().getTooltip().getTooltip_Text():c.getHeader().getTooltip_Text()});}}}else if(U.getTableType(t)===sap.ui.comp.personalization.TableType.ChartWrapper){for(C in o){c=o[C];i.push({columnKey:C,text:c.getLabel(),tooltip:(c.getTooltip()instanceof sap.ui.core.TooltipBase)?c.getTooltip().getTooltip_Text():c.getTooltip_Text()});}}}U.sortItemsByText(i,"text");var I=this.getModel("$sapuicomppersonalizationBaseController").getData().transientData.sort.items;if(q(i).not(I).length!==0||q(I).not(i).length!==0){this.getModel("$sapuicomppersonalizationBaseController").getData().transientData.sort.items=i;}};S.prototype._onSort=function(e){e.preventDefault();var a=e.mParameters.columnAdded;var t=this.getTable();if(typeof t==="string"){t=sap.ui.getCore().byId(t);}this.fireBeforePotentialTableChange();if(!a){var c=this.getColumnMap();for(var C in c){var o=c[C];if(o.setSorted){o.setSorted(false);}}}var o=e.mParameters.column;if(o&&o.setSorted){o.setSorted(true);o.setSortOrder(e.mParameters.sortOrder);}var s=this.getModel("$sapuicomppersonalizationBaseController").getData().persistentData.sort;if(!a){s.sortItems=[];}var i=U.getIndexByKey("columnKey",U.getColumnKey(o),s.sortItems);if(i>-1){s.sortItems.splice(i,1);}s.sortItems.push({columnKey:U.getColumnKey(o),operation:e.mParameters.sortOrder});this.fireAfterPotentialTableChange();this.fireAfterSortModelDataChange();};S.prototype.getPanel=function(){sap.ui.getCore().loadLibrary("sap.m");q.sap.require("sap/m/P13nSortPanel");q.sap.require("sap/m/P13nItem");q.sap.require("sap/m/P13nSortItem");if(!this.getColumnHelper().hasSortableColumns()){return null;}var t=this;var p=new sap.m.P13nSortPanel({containerQuery:true,items:{path:"$sapmP13nPanel>/transientData/sort/items",template:new sap.m.P13nItem({columnKey:"{$sapmP13nPanel>columnKey}",text:"{$sapmP13nPanel>text}",tooltip:"{$sapmP13nPanel>tooltip}",maxLength:"{$sapmP13nPanel>maxlength}",type:"{$sapmP13nPanel>type}"})},sortItems:{path:"$sapmP13nPanel>/persistentData/sort/sortItems",template:new sap.m.P13nSortItem({columnKey:"{$sapmP13nPanel>columnKey}",operation:"{$sapmP13nPanel>operation}"})},beforeNavigationTo:t.setModelFunction()});p.attachAddSortItem(function(e){var d=this.getModel("$sapuicomppersonalizationBaseController").getData();var a=e.getParameters();var s={columnKey:a.sortItemData.getColumnKey(),operation:a.sortItemData.getOperation()};if(a.index>-1){d.persistentData.sort.sortItems.splice(a.index,0,s);}else{d.persistentData.sort.sortItems.push(s);}this.getModel("$sapuicomppersonalizationBaseController").setData(d,true);},this);p.attachRemoveSortItem(function(e){var a=e.getParameters();var d=this.getModel("$sapuicomppersonalizationBaseController").getData();if(a.index>-1){d.persistentData.sort.sortItems.splice(a.index,1);this.getModel("$sapuicomppersonalizationBaseController").setData(d,true);}},this);return p;};S.prototype.syncJsonModel2Table=function(j){var c=this.getColumnMap();var C=q.extend(true,{},c);this.fireBeforePotentialTableChange();if(U.getTableBaseType(this.getTable())===sap.ui.comp.personalization.TableType.Table){j.sort.sortItems.forEach(function(a){var o=c[a.columnKey];if(!o){return;}if(!o.getSorted()){o.setSorted(true);}if(o.getSortOrder()!==a.operation){o.setSortOrder(a.operation);}delete C[a.columnKey];});for(var s in C){var o=C[s];if(o&&o.getSorted()){o.setSorted(false);}}}this.fireAfterPotentialTableChange();};S.prototype.getChangeType=function(p,P){if(!P||!P.sort||!P.sort.sortItems){return sap.ui.comp.personalization.ChangeType.Unchanged;}var i=JSON.stringify(p.sort.sortItems)!==JSON.stringify(P.sort.sortItems);return i?sap.ui.comp.personalization.ChangeType.ModelChanged:sap.ui.comp.personalization.ChangeType.Unchanged;};S.prototype.getChangeData=function(p,P){if(!p||!p.sort||!p.sort.sortItems){return{sort:{sortItems:[]}};}if(!P||!P.sort||!P.sort.sortItems){return{sort:U.copy(p.sort)};}if(JSON.stringify(p.sort.sortItems)!==JSON.stringify(P.sort.sortItems)){return{sort:U.copy(p.sort)};}return null;};S.prototype.getUnionData=function(p,P){if(!P||!P.sort||!P.sort.sortItems){return{sort:U.copy(p.sort)};}return{sort:U.copy(P.sort)};};S.prototype.getDataSuiteFormatSnapshot=function(d){var p=this.getUnionData(this.getPersistentDataRestore(),this.getPersistentData());if(!p.sort||!p.sort.sortItems||!p.sort.sortItems.length){return;}d.SortOrder=p.sort.sortItems.map(function(s){return{Property:s.columnKey,Descending:s.operation==="Descending"};});};S.prototype.exit=function(){B.prototype.exit.apply(this,arguments);var t=this.getTable();if(U.getTableBaseType(this.getTable())===sap.ui.comp.personalization.TableType.Table){t.detachSort(this._onSort,this);}};return S;},true);