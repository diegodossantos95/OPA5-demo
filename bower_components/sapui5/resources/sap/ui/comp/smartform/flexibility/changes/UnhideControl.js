/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define([],function(){"use strict";var U={};U.applyChange=function(c,g,p){var m=p.modifier;var f=m.getAggregation(g,"elements");var P=f.some(function(F){return m.getVisible(F);});if(!P){f.forEach(function(F){m.setVisible(F,true);});}var l=m.getAggregation(g,"label");if(l&&(typeof l!=="string")){m.setVisible(l,true);}m.setVisible(g,true);return true;};U.completeChangeContent=function(c,s){var C=c.getDefinition();if(!C.content){C.content={};}};return U;},true);
