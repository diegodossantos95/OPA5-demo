/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/core/Element','sap/m/Popover'],function(E,P){"use strict";var F=E.extend("sap.ui.mdc.experimental.FieldHelpBase",{metadata:{library:"sap.ui.mdc",properties:{selectedKey:{type:"string",defaultValue:""},filterValue:{type:"string",defaultValue:""}},aggregations:{_popover:{type:"sap.m.Popover",multiple:false,visibility:"hidden"}},events:{select:{parameters:{value:{type:"any"},additionalValue:{type:"any"},key:{type:"string"}}},navigate:{parameters:{value:{type:"any"},additionalValue:{type:"any"},key:{type:"string"}}},dataUpdate:{}}}});F.prototype.init=function(){};F.prototype.exit=function(){};F.prototype.setSelectedKey=function(k){this.setProperty("selectedKey",k,true);};F.prototype.setFilterValue=function(f){this.setProperty("filterValue",f,true);};F.prototype.open=function(){var p=this._getPopover();var f=this.getParent();if(f&&!p.isOpen()){var w=f.$().outerWidth();p.setContentMinWidth(w+"px");p.openBy(f);}};F.prototype.close=function(){var p=this.getAggregation("_popover");if(p){p.close();}};F.prototype.toggleOpen=function(){var p=this._getPopover();if(p.isOpen()){this.close();}else{this.open();}};F.prototype._createPopover=function(){var p=new sap.m.Popover(this.getId()+"-pop",{placement:sap.m.PlacementType.Bottom,showHeader:false,showArrow:false,afterOpen:this._handleAfterOpen.bind(this)});this.setAggregation("_popover",p,true);return p;};F.prototype._getPopover=function(){var p=this.getAggregation("_popover");if(!p){p=this._createPopover();}return p;};F.prototype._handleAfterOpen=function(){};F.prototype.openByTyping=function(){return false;};F.prototype.navigate=function(s){};F.prototype.getTextforKey=function(k){return"";};F.prototype._setContent=function(c){var p=this._getPopover();p.removeAllContent();p.addContent(c);return this;};return F;},true);
