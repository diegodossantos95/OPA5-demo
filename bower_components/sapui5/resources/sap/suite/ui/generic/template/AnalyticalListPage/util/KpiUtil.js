sap.ui.define(["sap/ui/base/Object","sap/ui/model/Context"],function(B,C){"use strict";var K=B.extend("sap.suite.ui.generic.template.AnalyticalListPage.util.KpiUtil");K.getNumberValue=function(v){if(v){var a=Object.keys(v)[0];return(v&&a&&["String","Int","Decimal","Double","Single"].indexOf(a)!==-1)?Number(v[a]):undefined;}};K.getBooleanValue=function(v,d){if(v&&v.Bool){if(v.Bool.toLowerCase()==="true"){return true;}else if(v.Bool.toLowerCase()==="false"){return false;}}return d;};K.getPrimitiveValue=function(v){var a;if(v){if(v.String){a=v.String;}else if(v.Bool){a=K.getBooleanValue(v);}else if(v.EnumMember){a=v.EnumMember.split("/")[1];}else{a=K.getNumberValue(v);}}return a;};K.getPathOrPrimitiveValue=function(i){if(i){return(i.Path)?"{path:'"+i.Path+"'}":K.getPrimitiveValue(i);}else{return"";}};K.isBindingValue=function(v){return(typeof v==="string")&&v.charAt(0)==="{";};K.getNumberFormatter=function(s,a,m){var f=sap.ui.core.format.NumberFormat.getIntegerInstance({style:"short",minFractionDigits:0,maxFractionDigits:m,showScale:s,shortRefNumber:a});return f;};K.determineThousandsRefNumber=function(s){var a=s;if(s>=1000){var t=0;while(a>=1000){a/=1000;t++;}return t==0?undefined:t*1000;}else{return undefined;}};K.formatNumberForPresentation=function(v,s,n,S){var a=Number(v);var c=sap.ui.getCore().getConfiguration().getLanguage();var o=new sap.ui.core.Locale(c);if(n>2){n=2;}var N=sap.ui.core.format.NumberFormat.getFloatInstance({style:"short",showScale:s,minFractionDigits:0,maxFractionDigits:2,decimals:n,shortRefNumber:S},o).format(a);return N;};K.formatNumberForPercentPresentation=function(v,n){var p=Number(v);if(n){var m=0;var a=n;if(n>2){a=2;}var b=sap.ui.core.format.NumberFormat.getPercentInstance({style:"short",minFractionDigits:m,maxFractionDigits:a});return b.format(p);}else{var b=sap.ui.core.format.NumberFormat.getPercentInstance({style:"short",minFractionDigits:0,maxFractionDigits:1});return b.format(p);}};K.getUnitofMeasure=function(m,e){return(e)?e["Org.OData.Measures.V1.ISOCurrency"]||e["Org.OData.Measures.V1.Unit"]:"";};K.isRelative=function(d){var t=d.TrendCalculation;var r=false;if(t){var a=t.IsRelativeDifference.DefaultValue;r=K.getBooleanValue(t.IsRelativeDifference,a?({"true":true,"false":false})[a.toLowerCase()]:false);}return r;};return K;},true);
