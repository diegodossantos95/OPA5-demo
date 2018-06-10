/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/m/library','./P13nPanel','./P13nInternalModel'],function(q,M,P,a){"use strict";var b=P.extend("sap.ui.mdc.experimental.P13nFilterPanel",{metadata:{library:"sap.ui.mdc",properties:{columnKeyOfMarkedItem:{type:"string",defaultValue:undefined,visibility:"hidden"},showOnlySelectedItems:{type:"boolean",defaultValue:false,visibility:"hidden"},internalModel:{type:"sap.ui.mdc.experimental.P13nInternalModel",visibility:"hidden"}}}});b.prototype.init=function(){P.prototype.init.apply(this,arguments);this._proxyOnModelContextChange=q.proxy(this._onModelContextChange,this);this.attachModelContextChange(this._proxyOnModelContextChange);};b.prototype.refreshInitialState=function(){this.setInternalModelToBeUpdated(true);this.invalidate();};b.prototype._onModelContextChange=function(){if(!this.getModel()){return;}this._updateInternalModel();};b.prototype.onBeforeRendering=function(){this._updateInternalModel();};b.prototype.exit=function(){this.detachModelContextChange(this._proxyOnModelContextChange);};b.prototype._selectTableItem=function(t){this.getInternalModel().selectModelItem(this.getInternalModel().getModelItemByColumnKey(this._getColumnKeyByTableItem(t)),t.getSelected());this._syncPosition();this._toggleMarkedTableItem(t);this._updateControlLogic();this._updateCounts();};b.prototype._moveTableItem=function(t,T){var m=this.getInternalModel().getModelItemByColumnKey(this._getColumnKeyByTableItem(t));var o=this.getInternalModel().getModelItemByColumnKey(this._getColumnKeyByTableItem(T));this.getInternalModel().moveModelItemPosition(m,o);this._syncPosition();this.getInternalModel().moveModelItem(m,o);this._removeStyleFromTableItem(this._getMarkedTableItem());this._sortTableItemsAccordingToInternalModel();this._toggleMarkedTableItem(this._getMarkedTableItem());this._updateControlLogic();};b.prototype.onPressButtonMoveToTop=function(){this._moveTableItem(this._getMarkedTableItem(),this._getVisibleTableItems()[0]);};b.prototype.onPressButtonMoveUp=function(){var v=this._getVisibleTableItems();this._moveTableItem(this._getMarkedTableItem(),v[v.indexOf(this._getMarkedTableItem())-1]);};b.prototype.onPressButtonMoveDown=function(){var v=this._getVisibleTableItems();this._moveTableItem(this._getMarkedTableItem(),v[v.indexOf(this._getMarkedTableItem())+1]);};b.prototype.onPressButtonMoveToBottom=function(){var v=this._getVisibleTableItems();this._moveTableItem(this._getMarkedTableItem(),v[v.length-1]);};b.prototype.onItemPressed=function(e){this._toggleMarkedTableItem(e.getParameter('listItem'));this._updateControlLogic();};b.prototype.onSelectionChange=function(e){e.getParameter("listItems").forEach(function(t){this._selectTableItem(t);},this);};b.prototype.onSwitchButtonShowSelected=function(){this.setShowOnlySelectedItems(!this.getShowOnlySelectedItems());this._removeStyleFromTableItem(this._getMarkedTableItem());this._filterTableItems();this._toggleMarkedTableItem(this._getMarkedTableItem());this._updateControlLogic();};b.prototype.onSearchFieldLiveChange=function(){this._removeStyleFromTableItem(this._getMarkedTableItem());this._filterTableItems();this._toggleMarkedTableItem(this._getMarkedTableItem());this._updateControlLogic();};b.prototype._filterTableItems=function(){var f=[];if(this._isFilteredByShowSelected()===true){f.push(new sap.ui.model.Filter("selected","EQ",true));}var s=this._getSearchText();if(s){f.push(new sap.ui.model.Filter([new sap.ui.model.Filter("text",sap.ui.model.FilterOperator.Contains,s),new sap.ui.model.Filter("tooltip",sap.ui.model.FilterOperator.Contains,s),new sap.ui.model.Filter("role",sap.ui.model.FilterOperator.Contains,s),new sap.ui.model.Filter("aggregationRole",sap.ui.model.FilterOperator.Contains,s)],false));}this._getTable().getBinding("items").filter(f);};b.prototype._sortTableItemsAccordingToInternalModel=function(){var c=function(i,I){var m=this.getInternalModel().getModelItemByColumnKey(i.getColumnKey());var o=this.getInternalModel().getModelItemByColumnKey(I.getColumnKey());var d=this.getInternalModel().getIndexOfModelItem(m);var e=this.getInternalModel().getIndexOfModelItem(o);if(d<e){return-1;}else if(d>e){return 1;}return 0;};this._getTable().getBinding("items").sort(new sap.ui.model.Sorter({path:'',descending:false,group:false,comparator:c.bind(this)}));};b.prototype._getVisibleTableItems=function(){return this._getTable().getItems().filter(function(t){return!!t.getVisible();});};b.prototype._getMarkedTableItem=function(){return this._getTableItemByColumnKey(this.getColumnKeyOfMarkedItem());};b.prototype._toggleMarkedTableItem=function(t){this._removeStyleFromTableItem(this._getMarkedTableItem());var c=this._getColumnKeyByTableItem(t);if(c){this.setColumnKeyOfMarkedItem(c);this._addStyleToTableItem(t);}};b.prototype._getStyledAsMarkedTableItem=function(){var d=this._getTable().$().find(".sapMP13nColumnsPanelItemSelected");return d.length?q(d[0]).control()[0]:undefined;};b.prototype._getTableItemByColumnKey=function(c){var C=this._getTable().getBinding("items").getContexts();return this._getTable().getItems().find(function(t,i){return C[i].getObject().getColumnKey()===c;});};b.prototype._getColumnKeyByTableItem=function(t){var i=this._getTable().indexOfItem(t);if(i<0){return null;}return this._getTable().getBinding("items").getContexts()[i].getObject().getColumnKey();};b.prototype._syncPosition=function(){this.getItems().forEach(function(i){var m=this.getInternalModel().getModelItemByColumnKey(i.getColumnKey());i.setPosition(m.position);},this);};b.prototype._addStyleToTableItem=function(t){if(t){t.addStyleClass("sapMP13nColumnsPanelItemSelected");}};b.prototype._removeStyleFromTableItem=function(t){if(t){t.removeStyleClass("sapMP13nColumnsPanelItemSelected");}};b.prototype._isFilteredByShowSelected=function(){return!!this.getShowOnlySelectedItems();};b.prototype._updateControlLogic=function(){var v=this._getVisibleTableItems();this._getManagedObjectModel().setProperty("/@custom/isMoveUpButtonEnabled",v.indexOf(this._getMarkedTableItem())>0);this._getManagedObjectModel().setProperty("/@custom/isMoveDownButtonEnabled",v.indexOf(this._getMarkedTableItem())>-1&&v.indexOf(this._getMarkedTableItem())<v.length-1);};b.prototype._updateCounts=function(){var c=0;this.getItems().forEach(function(i){if(i.getSelected()){c++;}});this._getManagedObjectModel().setProperty("/@custom/countOfSelectedItems",c);this._getManagedObjectModel().setProperty("/@custom/countOfItems",this.getItems().length);};b.prototype._updateInternalModel=function(){if(!this.getInternalModelToBeUpdated()){return;}this.setInternalModelToBeUpdated(false);this._removeStyleFromTableItem(this._getMarkedTableItem());this.setInternalModel(new a({tableItems:this.getItems()}));this._sortTableItemsAccordingToInternalModel();this._filterTableItems();if(!this.getColumnKeyOfMarkedItem()){this.setColumnKeyOfMarkedItem(this._getColumnKeyByTableItem(this._getVisibleTableItems()[0]));}this._toggleMarkedTableItem(this._getMarkedTableItem());this._updateControlLogic();this._updateCounts();};return b;},true);