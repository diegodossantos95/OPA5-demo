/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.utils.UI5ChartHelper");jQuery.sap.require("sap.viz.ui5.data.FlattenedDataset");jQuery.sap.require("sap.viz.ui5.data.DimensionDefinition");jQuery.sap.require("sap.viz.ui5.data.MeasureDefinition");jQuery.sap.require("sap.apf.utils.utils");(function(){"use strict";sap.apf.ui.representations.utils.UI5ChartHelper=function(a,p){var s=this;this.parameter=p;this.classifiedData=[];this.extendedDataSet=[];this.fieldKeysLookup={};this.displayNameLookup={};this.fieldNameLookup={};this.filterLookup={};this.datasetObj={};this.cachedSelection=[];this.filterValues=[];this.dataAlreadySorted=false;var b=function(m,D){var h=this.parameter.dimensions.concat(this.parameter.measures);this.dimensionInfo={};this.parameter.dimensions.forEach(function(o){s.dimensionInfo[o.fieldName]=o;});var r=[];var j=function(o){var q=0;for(var i=0;i<h.length;i++){if(h[i].fieldName===o){q++;}}return(q===0?false:true);};if(this.parameter.requiredFilters){this.parameter.requiredFilters.forEach(function(o){if(!j(o)){var q={fieldName:o};r.push(q);}});}if(r.length!==0){h=h.concat(r);}for(var i=0;i<h.length;i++){var k=h[i];var l=k.fieldName;this.displayNameLookup[l]={};if(m!==undefined){if(m.getPropertyMetadata(l)["aggregation-role"]==="dimension"){this.displayNameLookup[l].DISPLAY_NAME=m.getPropertyMetadata(l).label||m.getPropertyMetadata(l).name;this.displayNameLookup[l].VALUE=l;this.displayNameLookup[l].DISPLAY_VALUE="formatted_"+l;}else{this.displayNameLookup[l].DISPLAY_NAME=m.getPropertyMetadata(l).label||m.getPropertyMetadata(l).name;this.displayNameLookup[l].VALUE=l;}if(k.fieldDesc!==undefined&&a.getTextNotHtmlEncoded(k.fieldDesc).length){this.displayNameLookup[l].DISPLAY_NAME=a.getTextNotHtmlEncoded(k.fieldDesc);}if(m.getPropertyMetadata(l).unit!==undefined){var u=m.getPropertyMetadata(l).unit;var U,n;if(D!==undefined&&D.length!==0){U=D[0][u];for(n=0;n<D.length;n++){if(U!==D[n][u]){U=undefined;break;}}if(U!==undefined&&U!==""){this.displayNameLookup[l].DISPLAY_NAME=a.getTextNotHtmlEncoded("displayUnit",[this.displayNameLookup[l].DISPLAY_NAME,U]);}}}}this.fieldNameLookup[this.displayNameLookup[l].DISPLAY_NAME]={};this.fieldNameLookup[this.displayNameLookup[l].DISPLAY_NAME].FIELD_NAME=l;this.fieldNameLookup[this.displayNameLookup[l].DISPLAY_NAME].VALUE=this.displayNameLookup[l].VALUE;this.fieldNameLookup[this.displayNameLookup[l].DISPLAY_NAME].DISPLAY_VALUE=this.displayNameLookup[l].DISPLAY_VALUE;}};function c(h,m){if(!s.dimensionInfo||!s.dimensionInfo[h]){return false;}if(s.dimensionInfo[h].conversionEvaluated){return s.dimensionInfo[h].conversionRequired;}s.dimensionInfo[h].conversionEvaluated=true;if(s.dimensionInfo[h].dataType==="date"&&m.getPropertyMetadata(h).semantics==="yearmonthday"){s.dimensionInfo[h].conversionRequired=true;return true;}s.dimensionInfo[h].conversionRequired=false;return false;}var d=function(D){function h(z){var A=this.parameter.dimensions,B;for(B=0;B<A.length;B++){if(A[B].fieldName===z){return A[B].labelDisplayOption;}}}var i;function l(n){var r=this.metadata.getPropertyMetadata(n).text;if(this.extendedDataResponse[i][r]){var T={text:this.extendedDataResponse[i][r],key:this.extendedDataResponse[i][n]};return this.formatter.getFormattedValueForTextProperty(n,T);}return this.formatter.getFormattedValue(n,this.extendedDataResponse[i][n]);}this.extendedDataResponse=jQuery.extend([],true,D);var j,k,o,m;if(this.extendedDataResponse.length!==0){this.convertedDates={};for(i=0;i<this.extendedDataResponse.length;i++){for(k=0;k<this.parameter.measures.length;k++){if(this.extendedDataResponse[i][this.parameter.measures[k].fieldName]!==null){this.extendedDataResponse[i][this.parameter.measures[k].fieldName]=parseFloat(this.extendedDataResponse[i][this.parameter.measures[k].fieldName]);}}for(j=0;j<Object.keys(this.displayNameLookup).length;j++){var n=Object.keys(this.displayNameLookup)[j];var q=this.displayNameLookup[n].DISPLAY_VALUE!=undefined&&(this.displayNameLookup[n].DISPLAY_VALUE.search('formatted_')!==-1);if(q){var L=h.call(this,n);var t=this.metadata.getPropertyMetadata(n).hasOwnProperty('text');if(L===sap.apf.core.constants.representationMetadata.labelDisplayOptions.TEXT){var r=this.metadata.getPropertyMetadata(n).text;this.extendedDataResponse[i][this.displayNameLookup[n].VALUE]=this.extendedDataResponse[i][n];this.extendedDataResponse[i][this.displayNameLookup[n].DISPLAY_VALUE]=this.extendedDataResponse[i][r]||"";}if((!t&&L===undefined)||L===sap.apf.core.constants.representationMetadata.labelDisplayOptions.KEY){this.extendedDataResponse[i][this.displayNameLookup[n].VALUE]=this.extendedDataResponse[i][n];this.extendedDataResponse[i][this.displayNameLookup[n].DISPLAY_VALUE]=this.formatter.getFormattedValue(n,this.extendedDataResponse[i][n]);}if((t&&L===undefined)||L===sap.apf.core.constants.representationMetadata.labelDisplayOptions.KEY_AND_TEXT){this.extendedDataResponse[i][this.displayNameLookup[n].VALUE]=this.extendedDataResponse[i][n];this.extendedDataResponse[i][this.displayNameLookup[n].DISPLAY_VALUE]=l.call(this,n);}}if(c(n,this.metadata)){o=this.extendedDataResponse[i][this.displayNameLookup[n].VALUE];m=sap.apf.utils.convertFiscalYearMonthDayToDateString(this.extendedDataResponse[i][this.displayNameLookup[n].VALUE])+"";this.convertedDates[m]=o;this.extendedDataResponse[i][this.displayNameLookup[n].VALUE]=m;}}var u="";for(j=0;j<this.parameter.dimensions.length;j++){var w=this.displayNameLookup[this.parameter.dimensions[j].fieldName].VALUE;this.extendedDataResponse[i][w]=(this.extendedDataResponse[i][w]===null||this.extendedDataResponse[i][w]===undefined)?this.extendedDataResponse[i][w]:this.extendedDataResponse[i][w].toString();u=u+this.extendedDataResponse[i][w];this.filterLookup[u]=[];if(this.parameter.requiredFilters){for(k=0;k<this.parameter.requiredFilters.length;k++){var x={};x.id=this.extendedDataResponse[i][this.parameter.requiredFilters[k]];x.text=this.extendedDataResponse[i][this.displayNameLookup[this.parameter.requiredFilters[k]].VALUE];this.filterLookup[u].push(x);}}}}}else{var y={};for(k=0;k<this.parameter.measures.length;k++){y[s.displayNameLookup[this.parameter.measures[k].fieldName].VALUE]=undefined;}for(j=0;j<this.parameter.dimensions.length;j++){y[s.displayNameLookup[this.parameter.dimensions[j].fieldName].VALUE]=undefined;}this.extendedDataResponse.push(y);}};var e=function(I,D){var i,F,i,h,j;for(i=0;i<this.parameter.dimensions.length;i++){this.parameter.dimensions[i].name=this.displayNameLookup[this.parameter.dimensions[i].fieldName].DISPLAY_NAME;this.parameter.dimensions[i].value='{'+this.displayNameLookup[this.parameter.dimensions[i].fieldName].VALUE+'}';this.parameter.dimensions[i].displayValue='{'+this.displayNameLookup[this.parameter.dimensions[i].fieldName].DISPLAY_VALUE+'}';this.parameter.dimensions[i].kind=this.parameter.dimensions[i].kind?this.parameter.dimensions[i].kind:undefined;}s.measureAxisType=I;for(i=0;i<this.parameter.measures.length;i++){this.parameter.measures[i].name=this.displayNameLookup[this.parameter.measures[i].fieldName].DISPLAY_NAME;this.parameter.measures[i].value='{'+this.displayNameLookup[this.parameter.measures[i].fieldName].VALUE+'}';this.parameter.measures[i].kind=this.parameter.measures[i].kind?this.parameter.measures[i].kind:undefined;}var P={dimensions:this.parameter.dimensions,measures:this.parameter.measures};F=jQuery.extend(true,{},P);for(i=0;i<F.dimensions.length;i++){for(h in F.dimensions[i]){if(((h!=='name')&&(h!=='value')&&(h!=='dataType')&&(h!=='displayValue'))){delete F.dimensions[i][h];}}}for(i=0;i<F.measures.length;i++){for(j in F.measures[i]){if(((j!=='name')&&(j!=='value'))){delete F.measures[i][j];}}}F.data={path:"/data"};if(this.metadata!==undefined){for(i=0;i<this.parameter.dimensions.length;i++){var m=this.metadata.getPropertyMetadata(this.parameter.dimensions[i].fieldName);if(m.isCalendarYearMonth==="true"){if(this.parameter.dimensions.length>1){F.data.sorter=new sap.ui.model.Sorter(this.parameter.dimensions[0].fieldName,false);}}}}this.datasetObj=F;};var g=function(){var r=[];r[0]=[];var i,j,k,l;for(i=0;i<s.filterValues.length;i++){r[0].push(s.filterValues[i][0]);}var n=[];for(i=0;i<s.extendedDataResponse.length;i++){var h=s.extendedDataResponse[i];for(j=0;j<r[0].length;j++){var m=0;for(k=0;k<r.length;k++){if(h[s.parameter.requiredFilters[k]]===r[k][j]){m=m+1;}}if(m===r.length){var o={data:{}};var q;var t;for(k=0;k<s.parameter.dimensions.length;k++){var u=s.parameter.dimensions[k].name;var w=s.fieldNameLookup[u].VALUE;o.data[u]=h[w];}if(!s.measureAxisType){var x;var y;for(l=0;l<s.parameter.measures.length;l++){var z=jQuery.extend(true,{},o);x=s.parameter.measures[l].name;y=s.fieldNameLookup[x].VALUE;z.data[x]=h[y]===null?h[y]:parseFloat(h[y]);n.push(z);}}else{for(k=0;k<s.parameter.measures.length;k++){q=s.parameter.measures[k].name;t=s.fieldNameLookup[q].VALUE;o.data[q]=h[t]===null?h[t]:parseFloat(h[t]);}n.push(o);}}}}return n;};var v=function(){s.filterValues=s.filterValues.filter(function(h){for(var i=0;i<s.extendedDataResponse.length;i++){var k=0;for(var j=0;j<s.parameter.requiredFilters.length;j++){if(h[j]===s.extendedDataResponse[i][s.parameter.requiredFilters[j]]){k=k+1;}}if(k===s.parameter.requiredFilters.length){return true;}else if(i===s.extendedDataResponse.length-1){return false;}}});s.cachedSelection=g();};this.init=function(D,m,i,F){this.metadata=m;this.formatter=F;b.bind(this)(m,D);d.bind(this)(D);e.bind(this)(i);if(this.parameter.requiredFilters!==undefined&&this.parameter.requiredFilters.length!==0){v();}};this.getDataset=function(){return new sap.viz.ui5.data.FlattenedDataset(this.datasetObj);};this.getModel=function(){var o=this.extendedDataResponse;var m=new sap.ui.model.json.JSONModel();m.setData({data:o});return m;};this.getFilterCount=function(){return this.filterValues.length;};this.getFilters=function(){var h=Object.keys(this.filterLookup);var F=[];var s=this;var k=function(l){for(var i=0;i<h.length;i++){var m={};var n=h[i];for(var j=0;j<s.filterLookup[n].length;j++){if(l===s.filterLookup[n][j].id){m.id=l;m.text=s.filterLookup[n][j].text;F.push(m);return;}}}};for(var i=0;i<this.filterValues.length;i++){k(this.filterValues[i][0]);}return F;};this.getSelectionFromFilter=function(){if(this.parameter.requiredFilters===undefined||this.parameter.requiredFilters.length===0){return[];}var h=g();return h;};var f=function(h,n){var j;var k=h.filter(function(l){for(var i=0;i<n.length;i++){var m=0;for(j=0;j<Object.keys(l.data).length;j++){if(n[i].data[Object.keys(l.data)[j]]===l.data[Object.keys(l.data)[j]]){m=m+1;}else{break;}}if(m===Object.keys(l.data).length){return false;}else if(j===Object.keys(l.data).length){return true;}}return true;});return k;};this.getHighlightPointsFromSelectionEvent=function(h){var k=[];var n=[];k=f(h,this.cachedSelection);for(var i=0;i<k.length;i++){var l=k[i];if(this.parameter.measures.length===1){var m=this.displayNameLookup[this.parameter.measures[0].fieldName].DISPLAY_NAME;if(l.data[m]===undefined||l.data[m]===null){continue;}}var o="";for(var j=0;j<this.parameter.dimensions.length;j++){var q=this.displayNameLookup[this.parameter.dimensions[j].fieldName].DISPLAY_NAME;o=o+l.data[q];}var r=this.filterLookup[o];var t=this.filterValues.filter(function(u){var w=0;for(var i=0;i<s.parameter.requiredFilters.length;i++){if(u[i]===r[i].id){w=w+1;}else{break;}}if(w===s.parameter.requiredFilters.length){return true;}else if(i===s.parameter.requiredFilters.length){return false;}});if(t.length===0){var M=r.map(function(T){return T.id;});this.filterValues.push(M);}}n=g();this.cachedSelection=n;return n;};this.getFilterFromSelection=function(n){var h=false;var r=[];var F=s.filterValues.map(function(m){return m[0];});if(n&&n.length>0){F=n.concat(F);}var u=jQuery.unique(F);s.filterValues=[];u.forEach(function(m){s.filterValues.push([m]);r.push(m);});var o=a.createFilter();var E=o.getOperators().EQ;var i;var A=o.getTopAnd().addOr('exprssionOr');var j,k;h=c(s.parameter.requiredFilters[0],this.metadata);for(j=0;j<r.length;j++){if(this.metadata){var l=this.metadata.getPropertyMetadata(s.parameter.requiredFilters[0]).dataType.type;if(l==="Edm.Int32"){r[j]=r[j]===null?r[j]:parseFloat(r[j]);}}if(h){k=this.convertedDates[r[j]]||r[j];}else{k=r[j];}i={id:r[j],name:s.parameter.requiredFilters[0],operator:E,value:k};A.addExpression(i);}return o;};this.getHighlightPointsFromDeselectionEvent=function(h){var i,j;var k=f(this.cachedSelection,h);for(i=0;i<k.length;i++){var l=k[i];var m="";for(j=0;j<this.parameter.dimensions.length;j++){var n=this.displayNameLookup[this.parameter.dimensions[j].fieldName].DISPLAY_NAME;m=m+l.data[n];}var o=this.filterLookup[m];this.filterValues=this.filterValues.filter(function(r,t){var u=0;for(var i=0;i<o.length;i++){if(o[i].id===r[i]){u=u+1;}}if(u===o.length){return false;}return true;});}var q=g();this.cachedSelection=q;return q;};this.destroy=function(){if(s.formatter){s.formatter=null;}s.metadata=null;s.extendedDataResponse=null;};};}());