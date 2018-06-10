/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/comp/library','sap/ui/comp/valuehelpdialog/ValueHelpDialog','sap/m/MultiComboBox','sap/m/MultiInput','sap/m/DatePicker','sap/m/DateRangeSelection'],function(q,l,V,M,a,D,b){"use strict";var c=function(){};c.prototype.convert=function(s,f,S){var C=null,r=null,o;if(s){this._bStrictMode=S;o=JSON.parse(s);if(f&&f.getFilterBarViewMetadata&&o){this._sBasicSearchName=null;this._sBasicSearchValue=null;if(f.getBasicSearchName){this._sBasicSearchName=f.getBasicSearchName();}C={};if(o.Parameters){this._addParameters(o.Parameters,f,C);}if(o.SelectOptions){this._addSelectOptions(o.SelectOptions,f,C);}r={payload:null,variantId:null};r.payload=JSON.stringify(C);if(o.SelectionVariantID){r.variantId=o.SelectionVariantID;}if(this._sBasicSearchValue){r.basicSearch=this._sBasicSearchValue;}}}return r;};c.prototype.retrieveVariantId=function(s){var v=null;var S;if(s){S=JSON.parse(s);if(S&&S.SelectionVariantID){v=S.SelectionVariantID;}}return v;};c.prototype._getParameterMetaData=function(n,f,i){if(this._bStrictMode){return this._getParameterMetaDataStrictMode(n,f);}return this._getParameterMetaDataNonStrictMode(n,f,i);};c.prototype._getFilter=function(n,f){var i,j,g,F;F=f.getFilterBarViewMetadata();if(F){for(i=0;i<F.length;i++){g=F[i];for(j=0;j<g.fields.length;j++){if(n===g.fields[j].fieldName){return g.fields[j];}}}}return null;};c.prototype._getParameter=function(n,f){var j,A;if(f.getAnalyticalParameters){A=f.getAnalyticalParameters();if(A){for(j=0;j<A.length;j++){if(n===A[j].fieldName){return A[j];}}}}return null;};c.prototype._getParameterWithInnerPrefix=function(n,f){var p=n;if(n.indexOf(sap.ui.comp.ANALYTICAL_PARAMETER_PREFIX)!==0){p=sap.ui.comp.ANALYTICAL_PARAMETER_PREFIX+n;}return this._getParameter(p,f);};c.prototype._getParameterMetaDataStrictMode=function(n,f){var m=this._getExactFilterMatch(n,f);if(m){return m;}return null;};c.prototype._getParameterMetaDataNonStrictMode=function(o,f,i){var m,n,N,t,s=o;if(o.indexOf(sap.ui.comp.ANALYTICAL_PARAMETER_PREFIX)===0){s=o.substr(sap.ui.comp.ANALYTICAL_PARAMETER_PREFIX.length);}if(s.indexOf("P_")===0){n=s;N=s.substr(2);}else{n="P_"+s;N=s;}if(s!==n){t=n;}else if(s!==N){t=N;}if(i){m=this._getExactParameterMatch(s,f);if(m){return m;}m=this._getFuzzyParameterMatch(t,f);if(m){return m;}}else{m=this._getExactFilterMatch(s,f);if(m){return m;}m=this._getFuzzyFilterMatch(t,f);if(m){return m;}}return null;};c.prototype._getExactParameterMatch=function(n,f){var F,p;p=this._getParameterWithInnerPrefix(n,f);if(p){return p;}F=this._getFilter(n,f);if(F){return F;}return null;};c.prototype._getFuzzyParameterMatch=function(n,f){var F,p;p=this._getParameterWithInnerPrefix(n,f);if(p){return p;}F=this._getFilter(n,f);if(F){return F;}return null;};c.prototype._getExactFilterMatch=function(n,f){var F,p;F=this._getFilter(n,f);if(F){return F;}p=this._getParameterWithInnerPrefix(n,f);if(p){return p;}return null;};c.prototype._getFuzzyFilterMatch=function(n,f){var F,p;F=this._getFilter(n,f);if(F){return F;}p=this._getParameterWithInnerPrefix(n,f);if(p){return p;}return null;};c.prototype._addParameters=function(s,f,C){var i;var n,v;var F;for(i=0;i<s.length;i++){v=s[i].PropertyValue;n=s[i].PropertyName;if(this._sBasicSearchName&&(n===this._sBasicSearchName)){this._sBasicSearchValue=v;continue;}F=this._getParameterMetaData(n,f,true);if(F){f.determineControlByName(n);this._addAccordingMetaData(C,F,v);}else{q.sap.log.error("neither metadata nor custom information for filter '"+n+"'");}}};c.prototype._addSelectOptions=function(s,f,C){var i;var n,r;var F,o;for(i=0;i<s.length;i++){n=s[i].PropertyName;r=s[i].Ranges;if(this._sBasicSearchName&&(n===this._sBasicSearchName)){if(r&&r.length>0){this._sBasicSearchValue=r[0].Low;}continue;}f.determineControlByName(n);F=this._getParameterMetaData(n,f,false);if(F){o=F.control;this._addRangesAccordingMetaData(C,F,r,o);}else{q.sap.log.error("neither metadata nor custom information for filter '"+name+"'");}}};c.convertOption=function(s,v){var i;switch(s){case"CP":i=sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.Contains;if(v){var n=v.indexOf('*');var d=v.lastIndexOf('*');if(n>-1){if((n===0)&&(d!==(v.length-1))){i=sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EndsWith;v=v.substring(1,v.length);}else if((n!==0)&&(d===(v.length-1))){i=sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.StartsWith;v=v.substring(0,v.length-1);}else{v=v.substring(1,v.length-1);}}}break;case"EQ":case"BT":case"LE":case"GE":case"GT":case"LT":i=s;break;default:q.sap.log.error("Suite Option is not supported '"+s+"'");i=undefined;v=undefined;}return{op:i,v:v};};c.prototype._addRangesAccordingMetaData=function(C,f,r,o,n){var i,O;var d=function(F,r){var i,I,O;for(i=0;i<r.length;i++){O=c.convertOption(r[i].Option,r[i].Low);if(O&&O.op){I={"exclude":(r[i].Sign==="E"),"operation":O.op,"keyField":F,"value1":O.v,"value2":r[i].High};if(!C[F]){C[F]={ranges:[],items:[],value:null};}C[F].ranges.push(I);}}};if(r&&r.length>0){if(f.isCustomFilterField){if(!C._CUSTOM){C._CUSTOM={};}C._CUSTOM[f.fieldName]=r[0].Low;return;}if(f.conditionType){for(i=0;i<r.length;i++){if(!r[i].High){r[i].High=r[i].Low;}}d(f.fieldName,r);return;}if(f.filterRestriction===sap.ui.comp.smartfilterbar.FilterType.single){if(!r[0].Low&&o&&(o instanceof D)){C[f.fieldName]=null;}else{C[f.fieldName]=r[0].Low;}}else if(f.filterRestriction===sap.ui.comp.smartfilterbar.FilterType.interval){if(o&&(o instanceof b)){if(r[0].Low&&r[0].High){C[f.fieldName]={low:r[0].Low,high:r[0].High};}else if(r[0].Low&&!r[0].High){C[f.fieldName]={low:r[0].Low,high:r[0].Low};}else if(!r[0].Low&&r[0].High){C[f.fieldName]={low:r[0].High,high:r[0].High};}else{C[f.fieldName]={low:null,high:null};}}else{if(f.type==="Edm.Time"){d(f.fieldName,r);}else{C[f.fieldName]={low:r[0].Low===undefined?null:r[0].Low,high:r[0].High===undefined?null:r[0].High};}}}else if(f.filterRestriction===sap.ui.comp.smartfilterbar.FilterType.multiple){C[f.fieldName]={ranges:[],items:[],value:null};if(o&&((o instanceof M)||(o instanceof a))){for(i=0;i<r.length;i++){O=c.convertOption(r[i].Option,r[i].Low);if(O.op===sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EQ){if(f.type==="Edm.DateTime"){C[f.fieldName].ranges.push({value1:O.v});}else{C[f.fieldName].items.push({key:O.v});}}}}else{d(f.fieldName,r);}}else{d(f.fieldName,r);}q.sap.log.warning("potential reduced information for filter '"+f.fieldName+"'");}else{q.sap.log.warning("no Ranges-section found for filter '"+f.fieldName+"'");}};c.prototype._addAccordingMetaData=function(C,f,v){var h=f.type==="Edm.DateTime"?"":v;var r=[{Sign:"I",Low:v,High:h,Option:"EQ"}];this._addRangesAccordingMetaData(C,f,r);};return c;},true);