/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/mdc/experimental/FieldHelpBase','sap/ui/model/base/ManagedObjectModel','sap/m/List','sap/m/DisplayListItem'],function(F,M,L,D){"use strict";var a=F.extend("sap.ui.mdc.experimental.ListFieldHelp",{metadata:{library:"sap.ui.mdc",properties:{},aggregations:{items:{type:"sap.ui.core.ListItem",multiple:true,singularName:"item"}},defaultAggregation:"items",events:{}}});a.prototype.init=function(){F.prototype.init.apply(this,arguments);this._oManagedObjectModel=new M(this);};a.prototype.exit=function(){F.prototype.exit.apply(this,arguments);this._oManagedObjectModel.destroy();delete this._oManagedObjectModel;};a.prototype._createPopover=function(){var p=F.prototype._createPopover.apply(this,arguments);var P=this.getParent();if(P){p.setInitialFocus(P);}var i=new D({label:"{$field>text}",value:"{$field>additionalText}"});var f=new sap.ui.model.Filter("text",c.bind(this));this._oList=new L(this.getId()+"-List",{width:"100%",showNoData:false,mode:sap.m.ListMode.SingleSelectMaster,rememberSelections:false,items:{path:"$field>items",template:i,filters:f},selectionChange:_.bind(this)});this._oList.setModel(this._oManagedObjectModel,"$field");this._oList.bindElement({path:"/",model:"$field"});this._setContent(this._oList);return p;};a.prototype.setParent=function(p,A,s){F.prototype.setParent.apply(this,arguments);var P=this.getAggregation("_popover");if(P){P.setInitialFocus(p);}return this;};a.prototype.setSelectedKey=function(k){F.prototype.setSelectedKey.apply(this,arguments);if(this._oList){var I=this._oList.getItems();for(var i=0;i<I.length;i++){var o=I[i];var O=b.call(this,o);if(O.getKey()==k){o.setSelected(true);}else{o.setSelected(false);}}}return this;};a.prototype.setFilterValue=function(f){F.prototype.setFilterValue.apply(this,arguments);if(this._oList){var B=this._oList.getBinding("items");B.update();this._oList.updateItems();this.setSelectedKey(this.getSelectedKey());}return this;};a.prototype.addItem=function(i){this.addAggregation("items",i);if(!this._bUpdateItems){this.fireDataUpdate();}return this;};a.prototype.insertItem=function(i,I){this.insertAggregation("items",i,I);if(!this._bUpdateItems){this.fireDataUpdate();}return this;};a.prototype.removeItem=function(i){var r=this.removeAggregation("items",i);if(!this._bUpdateItems){this.fireDataUpdate();}return r;};a.prototype.removeAllItems=function(){var r=this.removeAllAggregation("items");if(!this._bUpdateItems){this.fireDataUpdate();}return r;};a.prototype.destroyItems=function(){this.destroyAggregation("items");if(!this._bUpdateItems){this.fireDataUpdate();}return this;};a.prototype.updateItem=function(){this._bUpdateItems=true;this.updateAggregation("items");this._bUpdateItems=false;this.fireDataUpdate();};a.prototype.openByTyping=function(){return true;};a.prototype.navigate=function(s){var p=this._getPopover();var S=this._oList.getSelectedItem();var i=this._oList.getItems();var I=i.length;var d=0;if(S){d=this._oList.indexOfItem(S);d=d+s;if(d<0){d=0;}else if(d>=I-1){d=I-1;}}else if(s>=0){d=s-1;}else{d=I+s;}var o=i[d];if(o){var O=b.call(this,o);o.setSelected(true);this.setProperty("selectedKey",O.getKey(),true);if(!p.isOpen()){this.open();}this.fireNavigate({value:o.getLabel(),additionalValue:o.getValue(),key:O.getKey()});}};F.prototype.getTextforKey=function(k){var I=this.getItems();for(var i=0;i<I.length;i++){var o=I[i];if(o.getKey()==k){return o.getText();}}return"";};function _(e){var i=e.getParameter("listItem");var s=e.getParameter("selected");if(s){var o=b.call(this,i);this.setProperty("selectedKey",o.getKey(),true);this.close();this.fireSelect({value:i.getLabel(),additionalValue:i.getValue(),key:o.getKey()});}}function b(i){var p=i.getBindingContextPath();return this._oManagedObjectModel.getProperty(p);}function c(t){var f=this.getFilterValue();if(!f||jQuery.sap.startsWithIgnoreCase(t,f)){return true;}else{return false;}}return a;},true);