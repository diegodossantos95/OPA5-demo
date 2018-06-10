/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/ManagedObject','./library'],function(M){"use strict";var S=M.extend("sap.ui.dt.Selection",{metadata:{library:"sap.ui.dt",properties:{"mode":{type:"sap.ui.dt.SelectionMode",defaultValue:sap.ui.dt.SelectionMode.Single}},associations:{},aggregations:{},events:{"change":{parameters:{selection:{type:"sap.ui.dt.Overlay[]"}}}}}});S.prototype.init=function(){this._aSelection=[];};S.prototype.exit=function(){delete this._aSelection;};S.prototype.getSelection=function(){return this._aSelection;};S.prototype.set=function(o,s){if(s){this.add(o);}else{this.remove(o);}};S.prototype.add=function(o){this._syncSelectionWithMode();this._aSelection=this._aSelection.concat(o);this.fireChange({selection:this.getSelection()});};S.prototype.remove=function(o){this._syncSelectionWithMode();if(this._aSelection.indexOf(o)!==-1){this._aSelection=this._aSelection.filter(function(i){return o!==i;});}this.fireChange({selection:this.getSelection()});};S.prototype._isSingleMode=function(){return this.getMode()===sap.ui.dt.SelectionMode.Single;};S.prototype._syncSelectionWithMode=function(){if(this._isSingleMode()){this._aSelection.forEach(function(o){o.setSelected(false,true);});this._aSelection=[];}};return S;},true);
