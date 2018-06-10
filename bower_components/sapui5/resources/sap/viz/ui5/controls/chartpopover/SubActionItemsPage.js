/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control'],function(q,C){var S=C.extend('sap.viz.ui5.controls.chartpopover.SubActionItemsPage',{metadata:{properties:{items:{type:'sap.m.ListBase[]'}}},renderer:{render:function(r,c){r.write('<div');r.addClass("viz-controls-chartPopover-subActionItemsPage");r.writeClasses();r.write('>');r.renderControl(c._oList);r.write('</div>');}}});S.prototype.init=function(){this._oList=new sap.m.List({});};S.prototype.onAfterRendering=function(){q.sap.delayedCall(10,this,function(){this._oList.focus();});};S.prototype.exit=function(){if(this._oList){this._oList.destroy();this._oList=null;}};S.prototype.setItems=function(a){this._oList.removeAllItems();var b;for(var i=0;i<a.length;i++){b=new sap.m.ActionListItem({text:a[i].text,press:a[i].press?a[i].press:function(){}});this._oList.addItem(b);}};S.prototype._createId=function(i){return this.getId()+"-"+i;};return S;});
