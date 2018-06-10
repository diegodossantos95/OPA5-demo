/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/mdc/experimental/FieldHelpBase'],function(F){"use strict";var C=F.extend("sap.ui.mdc.experimental.CustomFieldHelp",{metadata:{library:"sap.ui.mdc",properties:{},aggregations:{content:{type:"sap.ui.core.Control",multiple:false}},defaultAggregation:"content",events:{beforeOpen:{parameters:{value:{type:"any"}}}}}});C.prototype._createPopover=function(){var p=F.prototype._createPopover.apply(this,arguments);p._getAllContent=function(){var f=this.getParent();if(f){var c=[];c.push(f.getContent());return c;}else{return this.getContent();}};return p;};C.prototype.fireSelectEvent=function(v,a){this.close();this.fireSelect({value:v,additionalValue:a});};C.prototype.open=function(){var f=this.getParent();var v;if(f){v=f.getValue();}this.fireBeforeOpen({value:v});F.prototype.open.apply(this,arguments);};return C;},true);
