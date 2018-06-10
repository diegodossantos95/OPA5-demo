/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/comp/util/FormatUtil'],function(q,F){"use strict";var I=function(){this.items={};};I.prototype.add=function(k,o){this.items[k]=o;};I.prototype.remove=function(k){delete this.items[k];};I.prototype.removeAll=function(){this.items={};};I.prototype.getItem=function(k){return this.items[k];};I.prototype.getItems=function(){var k=[];for(var i in this.items){k.push(i);}return k;};I.prototype.getSelectedItemsTokenArray=function(k,d,D){var t=[];for(var i in this.items){var o=this.items[i];var T,s;if(typeof o==="string"){s=i;T=o;}else{s=o[k];T=o[d];if(T===undefined){T=this.items[i];}else{if(!D){D="descriptionAndId";}T=F.getFormattedExpressionFromDisplayBehaviour(D,s,T);}}var a=new sap.m.Token({key:s,text:T,tooltip:T});if(typeof o!=="string"){a.data("row",o);a.data("longKey",i);}t.push(a);}return t;};I.prototype.getModelData=function(){var m=[];for(var i in this.items){var a=this.items[i];if(typeof a==="string"){a={missing:i};}m.push(a);}return m;};return I;},true);
