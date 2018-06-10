jQuery.sap.declare("sap.zen.crosstab.datahandler.JsonDataHandler");jQuery.sap.require("sap.zen.crosstab.TextConstants");jQuery.sap.require("sap.zen.crosstab.utils.Utils");jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");jQuery.sap.require("sap.zen.crosstab.CrosstabCellApi");
sap.zen.crosstab.datahandler.JsonDataHandler=function(c){var d=c.getDimensionHeaderArea();var C=c.getColumnHeaderArea();var r=c.getRowHeaderArea();var D=c.getDataArea();var f=0;var F=0;var t=0;var T=0;var b=false;var a=false;var e=false;var J=null;var o=null;var g=0;var R=0;var h={};var k={};function l(){if(!sap.zen.CrosstabTextCache){sap.zen.CrosstabTextCache={};sap.zen.CrosstabTextCache.filled=false;sap.zen.CrosstabTextCache.oTexts={};sap.zen.CrosstabTextCache.oSortingTextLookupTable={};sap.zen.CrosstabTextCache.defaultProvided=false;}var P=c.getPropertyBag();P.addText(sap.zen.crosstab.TextConstants.ROW_TEXT_KEY,"Row");P.addText(sap.zen.crosstab.TextConstants.COL_TEXT_KEY,"Column");P.addText(sap.zen.crosstab.TextConstants.COLWIDTH_ADJUST_TEXT_KEY,"Double Click to adjust Column Width");P.addText(sap.zen.crosstab.TextConstants.MOBILE_MENUITEM_COLWIDTH_ADJUST_TEXT_KEY,"Adjust Column Width");P.addText(sap.zen.crosstab.TextConstants.MEASURE_STRUCTURE_TEXT_KEY,"Measure Structure");p(P);sap.zen.CrosstabTextCache.defaultProvided=true;}function m(i){if(sap.zen.CrosstabTextCache.filled===false){var P=c.getPropertyBag();if(i){P.addText(sap.zen.crosstab.TextConstants.ROW_TEXT_KEY,i.rowtext||"Row");P.addText(sap.zen.crosstab.TextConstants.COL_TEXT_KEY,i.coltext||"Column");P.addText(sap.zen.crosstab.TextConstants.COLWIDTH_ADJUST_TEXT_KEY,i.colwidthtext||"Double Click to adjust Column Width");P.addText(sap.zen.crosstab.TextConstants.MOBILE_MENUITEM_COLWIDTH_ADJUST_TEXT_KEY,i.mobilemenuitemcolwidthtext||"Adjust Column Width");P.addText(sap.zen.crosstab.TextConstants.MEASURE_STRUCTURE_TEXT_KEY,i.measurestructtext||"Measure Structure");n(i,P);}sap.zen.CrosstabTextCache.filled=true;}}function p(P){var S={};S.alttext="Unsorted. Select to sort ascending";S.tooltipidx=0;P.addSortingTextLookup("0",S);S={};S.alttext="Sorted ascending. Select to sort descending";S.tooltipidx=1;P.addSortingTextLookup("1",S);S={};S.alttext="Sorted descending. Select to sort ascending";S.tooltipidx=2;P.addSortingTextLookup("2",S);}function n(j,P){var S=j.sorting;if(!S){p(P);}else{var i=0;var O=parseInt(S.length,10);for(i=0;i<O;i++){var Q={};Q.alttext=S[i].alttext;Q.tooltipidx=S[i].tooltipidx;P.addSortingTextLookup(i+"",Q);}}}this.determineBasicAreaData=function(i,j){if(!sap.zen.CrosstabTextCache||(sap.zen.CrosstabTextCache&&!sap.zen.CrosstabTextCache.defaultProvided)){l();}J=i;if(J.rootcause&&J.rootcause==="bookmark"){c.getPropertyBag().setBookmarkProcessing(true);}if(!J.rows){v(J);w();c.setHasData(false);}else{c.setHasData(true);if(j||J.changed){m(J.texts);h={};k={};f=J.fixedcolheaders;F=J.fixedrowheaders;if(!J.pixelscrolling){c.setHCutOff(false);c.setVCutOff(false);t=J.totaldatacols;T=J.totaldatarows;}else{c.setHCutOff(J.totaldatacols>J.sentdatacols);c.setVCutOff(J.totaldatarows>J.sentdatarows);t=J.sentdatacols;T=J.sentdatarows;}if(!f||!F){d.setRowCnt(0);d.setColCnt(0);if(!F){r.setRowCnt(0);r.setColCnt(0);if(f){C.setRowCnt(f);C.setColCnt(t);}}else if(!f){C.setRowCnt(0);C.setColCnt(0);if(F){r.setRowCnt(T);r.setColCnt(F);}}}else{d.setRowCnt(f);d.setColCnt(F);r.setRowCnt(T);r.setColCnt(F);C.setRowCnt(f);C.setColCnt(t);}D.setRowCnt(T);D.setColCnt(t);c.setTotalRows(f+T);c.setTotalCols(F+t);c.setOnSelectCommand(J.onselectcommand);c.getPropertyBag().setDisplayExceptions(J.displayexceptions);c.getPropertyBag().setEnableColResize(J.enablecolresize);c.setScrollNotifyCommand(J.scrollnotifier);c.setUpdateColWidthCommand(J.updatecolwidthcmd);s(i);var O=new sap.zen.crosstab.CrosstabCellApi(c,F,f,t,T);c.setCellApi(O);}q();if(!(c.getPropertyBag().isMobileMode()||c.getPropertyBag().isTestMobileMode())){if(J.transferdatacommand){c.setTransferDataCommand(J.transferdatacommand);}else{c.setTransferDataCommand(null);}if(J.callvaluehelpcommand){c.setCallValueHelpCommand(J.callvaluehelpcommand);}if(J.newlinescnt){c.setNewLinesCnt(J.newlinescnt);}if(J.newlinespos){c.setNewLinesPos(J.newlinespos);}}if(J.contextmenucmd){c.getPropertyBag().setContextMenuCommand(J.contextmenucmd);c.createContextMenu();}if(J.headerscrolling&&J.headerscrolling==true){c.setHeaderScrollingConfigured(true);if(J.userheaderresize){c.setUserHeaderResizeAllowed(J.userheaderresize);}if(J.userheaderwidthcommand){c.setUserHeaderWidthCommand(J.userheaderwidthcommand);}if(J.headerwidth){c.getPropertyBag().setMaxHeaderWidth(J.headerwidth);}else{c.getPropertyBag().setMaxHeaderWidth(0);}if(J.headerwidthcurrent){c.getPropertyBag().setUserHeaderWidth(J.headerwidthcurrent);}else{c.getPropertyBag().setUserHeaderWidth(0);}}else{c.setHeaderScrollingConfigured(false);c.setUserHeaderResizeAllowed(false);c.setUserHeaderWidthCommand(null);c.getPropertyBag().setMaxHeaderWidth(0);c.getPropertyBag().setUserHeaderWidth(0);}if(J.selectionmode){c.setSelectionProperties(J.selectionmode,J.selectionspace,J.disablehovering,J.singleonselectevent);}var S=c.getSelectionHandler();if(S){S.setSelection(J.selection);}if(J.headerinfo){c.initHeaderInfo(J.headerinfo);}if(J.repeattxt&&J.repeattxt===true){c.getPropertyBag().setRepeatTexts(true);}else{c.getPropertyBag().setRepeatTexts(false);}if(J.dragdropcommands){c.getPropertyBag().setDragDropEnabled(true);c.setDragDropCommands(J.dragdropcommands);}else{c.getPropertyBag().setDragDropEnabled(false);}if(J.zebra){c.getPropertyBag().setZebraMode(J.zebra);}else{c.getPropertyBag().setZebraMode(sap.zen.crosstab.rendering.RenderingConstants.ZEBRA_FULL);}}};function s(j){var O=j.usercolwidths;if(O){for(var i=0;i<O.length;i++){var P=O[i];var Q=P.colid;if(isNaN(P.colwidth)){continue;}var S=Math.max(0,parseInt(P.colwidth,10));var U=false;if(P.ignore!==undefined){U=P.ignore;}if(Q==='*'){if(f&&F){C.setColUserWidth(Q,S,U);D.setColUserWidth(Q,S,U);d.setColUserWidth(Q,S,U);r.setColUserWidth(Q,S,U);}else{if(!F){C.setColUserWidth(Q,S,U);}else if(!f){r.setColUserWidth(Q,S,U);}D.setColUserWidth(Q,S,U);}}else{if(f&&F){if(Q>=F){C.setColUserWidth(Q-F,S,U);D.setColUserWidth(Q-F,S,U);}else{d.setColUserWidth(Q,S,U);r.setColUserWidth(Q,S,U);}}else{if(!F){C.setColUserWidth(Q,S,U);D.setColUserWidth(Q,S,U);}else if(!f){if(Q>=F){D.setColUserWidth(Q-F,S,U);}else{r.setColUserWidth(Q,S,U);}}}}}}}function q(){var i=c.getRenderEngine().getCrossRequestManager();if(i){if(J.clienthpos!==undefined&&J.clientvpos!==undefined&&J.clienthscrolledtoend!==undefined&&J.clientvscrolledtoend!==undefined){if(J.clienthscrolledtoend===true){J.clienthpos=J.totaldatacols-1;}if(J.clientvscrolledtoend===true){J.clientvpos=J.totaldatarows-1;}if(!i.hasSavedVScrollInfo()&&!i.hasSavedHScrollInfo()){i.setScrollData(parseInt(J.clienthpos,10),J.clienthscrolledtoend,parseInt(J.clientvpos,10),J.clientvscrolledtoend);}}if(J.rootcause){i.setRootCause(J.rootcause);if(J.rootcause==="hierarchy"){i.setHierarchyAction(J.rootcause_hierarchy);i.setIsHierarchyDirectionDown(J.rootcause_hierarchy_directiondown);}i.handleRootCause();}else{if(J.changed===true){i.setScrollData(0,false,0,false);}}var S=false;if(J.rootcause&&c.getPropertyBag().isBookmarkProcessing()){S=true;}else{if(!J.dataproviderchanged){if(J.resultsetchanged){if(J.rootcause){S=J.rootcause==="sorting"||J.rootcause==="hierarchy"||J.rootcause==="plan"||J.rootcause==="dragdrop";}}else{S=true;}}}if(J.clientheaderhpos&&S){i.setHeaderScrollData({"iHPos":parseInt(J.clientheaderhpos,10)});}else{i.setHeaderScrollData({"iHPos":0});}}}this.jsonToDataModel=function(P){if(J.rows){o=P.oCrosstabAreasToBeFilled;g=P.iColOffset;R=P.iRowOffset;u();var O=J.rows;for(var i=0,Q=O.length;i<Q;i++){var S=O[i].row.rowidx;var U=O[i].row.cells;for(var j=0,V=U.length;j<V;j++){var W=U[j].control;var X=W.colidx;x(W,S,X);}}}c.setColHeaderHierarchyLevels(h);c.setRowHeaderHierarchyLevels(k);};function u(){b=o[d.getAreaType()];a=o[r.getAreaType()];e=o[C.getAreaType()];}function v(J){d.setRowCnt(2);d.setColCnt(1);var i=G(d,0,0);i.setText(J.messagetitle);d.insertCell(i,0,0);i=G(d,1,0);i.setText(J.messagetext);d.insertCell(i,1,0);}function w(){var S=c.getSelectionHandler();if(S){S.setSelection(null);}}var x=function(j,i,O){var P=i-1;var Q=O-1;if(O>F&&i>f){z(j,P+R,Q+g);}else if(b&&O<=F&&i<=f){A(j,P,Q);}else if(e&&i<=f&&O>F){E(j,P,Q+g);}else if(a&&O<=F&&i>f){B(j,P+R,Q);}};function y(i,j){var O=new sap.zen.crosstab.DataCell();O.setArea(D);O.setRow(i);O.setCol(j);O.addStyle(c.getPropertyBag().isCozyMode()?sap.zen.crosstab.rendering.RenderingConstants.STYLE_DATA_CELL_COZY:sap.zen.crosstab.rendering.RenderingConstants.STYLE_DATA_CELL);return O;}var z=function(j,i,O){var P=i-f;var Q=O-F;var S=y(P,Q);S.setTableRow(i);S.setTableCol(O);I(j,S);if(c.getPropertyBag().getZebraMode()!==sap.zen.crosstab.rendering.RenderingConstants.ZEBRA_OFF){if(P%2===1){S.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_ALTERNATING);}}D.insertCell(S,P,Q);};var A=function(j,i,O){H(j,d,i,O,i,O);};var B=function(j,i,O){var P=i;if(j.axisidx!==undefined){P=j.axisidx+f;}H(j,r,i-f,O,P,O);};var E=function(j,i,O){var P=O;if(j.axisidx!==undefined){P=j.axisidx+F;}H(j,C,i,O-F,i,P);};function G(i,j,O){var P=new sap.zen.crosstab.HeaderCell();P.setArea(i);P.setRow(j);P.setCol(O);P.addStyle(c.getPropertyBag().isCozyMode()?sap.zen.crosstab.rendering.RenderingConstants.STYLE_HEADER_CELL_COZY:sap.zen.crosstab.rendering.RenderingConstants.STYLE_HEADER_CELL);return P;}var H=function(j,i,O,P,Q,S){var U=G(i,O,P);U.setTableRow(Q);U.setTableCol(S);I(j,U);K(j,U,i);if(c.getPropertyBag().isRtl()&&U.getRow()===c.getDimensionHeaderArea().getRowCnt()-1&&U.getCol()===c.getDimensionHeaderArea().getColCnt()-1){U.setText(sap.zen.crosstab.utils.Utils.swapPivotKeyText(U.getText()));}i.insertCell(U,O,P);};var I=function(j,O){var P=M(j);if(P){O.setFormatter(P);}var Q=j._v;if(Q){var S=sap.zen.crosstab.utils.Utils.prepareStringForRendering(Q);O.setText(S.text);O.setNumberOfLineBreaks(S.iNumberOfLineBreaks);}var U=j.exceptionvisualizations;if(U){for(var V in U){if(U.hasOwnProperty(V)){var W=U[V];if(W){sap.zen.crosstab.CellStyleHandler.setExceptionStylesOnCell(O,W.formattype,W.alertlevel);}}}}if(j.isemphasized){O.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_EMPHASIZED);}if(!(c.getPropertyBag().isMobileMode()||c.getPropertyBag().isTestMobileMode())){if(j.isdataentryenabled){O.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_DATA_ENTRY_ENABLED);O.setEntryEnabled(true);if(j.unit){O.setUnit(j.unit);}}if(j.hasinvalidvalue){O.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_INVALID_VALUE);}if(j.hasnewvalue){O.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_NEW_VALUE);}if(j.islocked){O.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_LOCKED);}}if(j.isresult){if(O.setResult){O.setResult(j.isresult);}O.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_TOTAL);}if(j.passivetype){O.setPassiveCellType(j.passivetype);}if(j.additionalstyles){for(var i=0;i<j.additionalstyles.length;i++){O.addStyle(j.additionalstyles[i].style.stylename);}}};var K=function(j,i,O){if(j.rowspan){i.setRowSpan(j.rowspan);}else{i.setRowSpan(1);}if(j.colspan){i.setColSpan(j.colspan);}else{i.setColSpan(1);}if(j.key){i.setMergeKey(j.key);}if(j.sort){i.setSort(j.sort);}if(j.sorttxtidx){i.setSortTextIndex(parseInt(j.sorttxtidx,10));}if(j.sortaction){i.setSortAction(j.sortaction);}if(j.alignment){i.setAlignment(j.alignment);}if(j.memberid){i.setMemberId(j.memberid);}if(j.parentmemberid){i.setParentMemberId(j.parentmemberid);}if(typeof(j.level)!="undefined"){i.setLevel(j.level);L(O,i,j.level);}else{i.setLevel(-1);}if(j.drillstate){if(j.drillstate!=="A"){i.setDrillState(j.drillstate);}}if(j.hierarchyaction){i.setHierarchyAction(j.hierarchyaction);}if(j.hierarchytooltip){i.setHierarchyTooltip(j.hierarchytooltip);}if(c.getPropertyBag().getZebraMode()===sap.zen.crosstab.rendering.RenderingConstants.ZEBRA_FULL){if(O.isRowHeaderArea()&&i.getRow()%2===1&&i.getRowSpan()===1){var P=c.getHeaderInfo();if(P){if((i.getCol()+i.getColSpan()-1)>=P.getStartColForInnermostDimension()){i.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_ALTERNATING);}}}}};var L=function(i,j,O){if(i.getAreaType()===sap.zen.crosstab.rendering.RenderingConstants.TYPE_COLUMN_HEADER_AREA){var P=j.getRow();if(h[P]!=undefined){if(h[P]<O){h[P]=O;}}else{h[P]=O;}}else if(i.getAreaType()===sap.zen.crosstab.rendering.RenderingConstants.TYPE_ROW_HEADER_AREA){var Q=j.getCol();if(k[Q]!=undefined){if(k[Q]<O){k[Q]=O;}}else{k[Q]=O;}}};function M(j){var i;if(j.valueType){var P=N(j.formatString);var O;if(j.valueType==="Integer"||j.valueType==="Double"){O={groupingEnabled:true,maxFractionDigits:j.decimals,pattern:P,showMeasure:true};i=sap.ui.core.format.NumberFormat.getCurrencyInstance(O);}else if(j.valueType==="Amount"||j.valueType==="Price"||j.valueType==="Quantity"){O={groupingEnabled:true,maxFractionDigits:j.decimals,pattern:P,showMeasure:true};i=sap.ui.core.format.NumberFormat.getCurrencyInstance(O);}}return i;}function N(i){var P;if(i){P=i;regString="#(?![#|"+","+"]).(?=#)";regex=new RegExp(regString,"g");i=i.replace(regex,"#"+",");regString="0(?![0|"+"."+"]).(?=0)";regex=new RegExp(regString,"g");P=P.replace(regex,"0"+".");}return P;}};
