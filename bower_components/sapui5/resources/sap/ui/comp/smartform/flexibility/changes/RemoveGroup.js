/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/fl/changeHandler/Base'],function(q,B){"use strict";var R={};R.applyChange=function(c,g,p){var m=p.modifier;var v=p.view;var f=m.getParent(g);if(m.getControlType(f)==="sap.ui.layout.form.Form"){m.removeAggregation(f,"formContainers",g,v);}else{m.removeAggregation(f,"groups",g,v);}return true;};R.completeChangeContent=function(c,s){var C=c.getDefinition();if(!C.content){C.content={};}};return R;},true);
