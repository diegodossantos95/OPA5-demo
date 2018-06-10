/*!
 * (c) Copyright 2010-2017 SAP SE or an SAP affiliate company.
 */
jQuery.sap.declare("sap.zen.crosstab.DataCell");jQuery.sap.require("sap.zen.crosstab.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.zen.crosstab.DataCell",{metadata:{publicMethods:["addStyle"],library:"sap.zen.crosstab",properties:{"text":{type:"string",group:"Misc",defaultValue:null},"area":{type:"object",group:"Misc",defaultValue:null},"row":{type:"int",group:"Misc",defaultValue:null},"col":{type:"int",group:"Misc",defaultValue:null},"tableRow":{type:"int",group:"Misc",defaultValue:null},"tableCol":{type:"int",group:"Misc",defaultValue:null}}}});jQuery.sap.require("sap.zen.crosstab.CellStyleHandler");jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");jQuery.sap.require("sap.zen.crosstab.utils.Utils");
sap.zen.crosstab.DataCell.prototype.init=function(){"use strict";this.aStyles=[];this.bLoading=false;this.bIsEntryEnabled=false;this.sUnit="";this.sPassiveCellType=sap.zen.crosstab.rendering.RenderingConstants.PASSIVE_CELL_TYPE_NORMAL;this.iNumberOfLineBreaks=0;};
sap.zen.crosstab.DataCell.prototype.getCellType=function(){return sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_CELL;};
sap.zen.crosstab.DataCell.prototype.isHeaderCell=function(){return false;};
sap.zen.crosstab.DataCell.prototype.getCssClassNames=function(i,I,b){return sap.zen.crosstab.CellStyleHandler.getCssClasses(this.aStyles,i,I,b);};
sap.zen.crosstab.DataCell.prototype.getStyleIdList=function(){return this.aStyles;};
sap.zen.crosstab.DataCell.prototype.setStyleIdList=function(n){this.aStyles=n;};
sap.zen.crosstab.DataCell.prototype.addStyle=function(s){var S=sap.zen.crosstab.CellStyleHandler.getStyleId(s,sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_CELL);if(this.aStyles.indexOf(S)===-1){this.aStyles.push(S);}};
sap.zen.crosstab.DataCell.prototype.removeStyle=function(s){var S=sap.zen.crosstab.CellStyleHandler.getStyleId(s,sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_CELL);var i=this.aStyles.indexOf(S);if(i!==-1){this.aStyles.splice(i,1);}};
sap.zen.crosstab.DataCell.prototype.hasStyle=function(s){var S=sap.zen.crosstab.CellStyleHandler.getStyleId(s,sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_CELL);var i=this.aStyles.indexOf(S);if(i===-1){return false;}else{return true;}};
sap.zen.crosstab.DataCell.prototype.getColSpan=function(){return 1;};
sap.zen.crosstab.DataCell.prototype.getRowSpan=function(){return 1;};
sap.zen.crosstab.DataCell.prototype.getEffectiveColSpan=function(){return 1;};
sap.zen.crosstab.DataCell.prototype.getEffectiveRowSpan=function(){return 1;};
sap.zen.crosstab.DataCell.prototype.isLoading=function(){return this.bLoading;};
sap.zen.crosstab.DataCell.prototype.setLoading=function(l){this.bLoading=l;};
sap.zen.crosstab.DataCell.prototype.isSelectable=function(){return false;};
sap.zen.crosstab.DataCell.prototype.getUnescapedText=function(){return sap.zen.crosstab.utils.Utils.unEscapeDisplayString(this.getText());};
sap.zen.crosstab.DataCell.prototype.setEntryEnabled=function(i){this.bIsEntryEnabled=i;};
sap.zen.crosstab.DataCell.prototype.isEntryEnabled=function(){return this.bIsEntryEnabled;};
sap.zen.crosstab.DataCell.prototype.setUnit=function(u){this.sUnit=u;};
sap.zen.crosstab.DataCell.prototype.getUnit=function(){return this.sUnit;};
sap.zen.crosstab.DataCell.prototype.getPassiveCellType=function(){return this.sPassiveCellType;};
sap.zen.crosstab.DataCell.prototype.setPassiveCellType=function(p){this.sPassiveCellType=p;};
sap.zen.crosstab.DataCell.prototype.setNumberOfLineBreaks=function(n){this.iNumberOfLineBreaks=n;};
sap.zen.crosstab.DataCell.prototype.getNumberOfLineBreaks=function(){return this.iNumberOfLineBreaks;};
