/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/fe/controls/_Table/TableController"],function(q,T){"use strict";var G=T.extend("sap.fe.controls._Table.GridTable.GridTableController",{constructor:function(t){T.apply(this,arguments);this.oTable=t;}});G.prototype.setSelectionMode=function(){var t=this.getToolbarActions(this.oInnerTable.getExtension()[0].getContent());var m;var s='None';for(var i=0;i<t.length;i++){m=t[i].getMultiplicityTo();if(m>1||!m){s='MultiToggle';break;}else if(m===1){s='Single';}}this.oInnerTable.setSelectionMode(s);};G.prototype.enableDisableActions=function(){var t=this.getToolbarActions(this.oInnerTable.getExtension()[0].getContent());var s=this.oInnerTable.getSelectedIndices().length;this.enableDisableActionsUtil(s,t);};G.prototype.bindTableCount=function(){var t=this.oInnerTable.getExtension()[0].getContent()[0];this.bindTableCountUtil(t);};G.prototype.handleDataReceived=function(e){var E=e.getParameter("error");var r=this.oInnerTable.getModel("sap.fe.i18n").getResourceBundle();if(E){this.oInnerTable.setNoData(r.getText("SAPFE_NODATA_TEXT_FOR_TABLE_TECHINCAL_ERROR"));this.oTable.fireShowError(e);}else{this.oInnerTable.setNoData(r.getText("SAPFE_NODATA_TEXT_FOR_TABLE"));}if(this.oInnerTable.getVisibleRowCountMode()!="Auto"){this.oInnerTable.setVisibleRowCountMode("Auto");}this.oInnerTable.setBusy(false);};G.prototype.getListBinding=function(){return this.oInnerTable.getBinding("rows");};G.prototype.getListBindingInfo=function(){return this.oInnerTable.getBindingInfo("rows");};return G;});
