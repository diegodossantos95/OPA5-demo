/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Element"],function(q,E){"use strict";var R=E.extend("sap.ui.vk.RedlineElement",{metadata:{library:"sap.ui.vk",properties:{originX:{type:"float",defaultValue:0},originY:{type:"float",defaultValue:0},opacity:{type:"float",defaultValue:1},strokeWidth:{type:"float",defaultValue:2},strokeColor:{type:"sap.ui.core.CSSColor",defaultValue:"#e6600d"}}}});R.prototype.init=function(){};R.prototype.onAfterRendering=function(){};R.prototype.setOriginX=function(o){this.setProperty("originX",o,true);};R.prototype.setOriginY=function(o){this.setProperty("originY",o,true);};R.prototype.applyZoom=function(){};R.prototype.render=function(r){};R.prototype.exportJSON=function(){return{originX:this.getOriginX(),originY:this.getOriginY(),opacity:this.getOpacity(),strokeColor:this.getStrokeColor(),strokeWidth:this.getStrokeWidth()};};R.prototype.importJSON=function(j){if(j.hasOwnProperty("originX")){this.setOriginX(j.originX);}if(j.hasOwnProperty("originY")){this.setOriginY(j.originY);}if(j.hasOwnProperty("opacity")){this.setOpacity(j.opacity);}if(j.hasOwnProperty("strokeColor")){this.setStrokeColor(j.strokeColor);}if(j.hasOwnProperty("strokeWidth")){this.setStrokeWidth(j.strokeWidth);}return this;};return R;});
