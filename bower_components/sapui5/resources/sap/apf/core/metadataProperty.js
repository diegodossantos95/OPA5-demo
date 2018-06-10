/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.metadataProperty");(function(){'use strict';sap.apf.core.MetadataProperty=function(a){var t=this;var k=false;var p=false;this.isKey=function(){return k;};this.isParameterEntitySetKeyProperty=function(){return p;};this.getAttribute=function(n){if(typeof this[n]!=="function"){return this[n];}};function b(n,v){switch(n){case"isKey":if(v===true){k=true;}break;case"isParameterEntitySetKeyProperty":if(v===true){p=true;}break;default:if(typeof t[n]!=="function"){t[n]=v;}}return t;}function i(){for(var n in a){switch(n){case"dataType":for(var d in a.dataType){b(d,a.dataType[d]);}break;default:b(n,a[n]);}}}i();};}());
