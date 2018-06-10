/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.facetFilterListConverter');
sap.apf.ui.utils.FacetFilterListConverter=function(){"use strict";this.getFFListDataFromFilterValues=function(f,p,s){var m=[];f.forEach(function(F){var o={};o.key=F[p];o.text=F.formattedValue;o.selected=false;if(s){s.forEach(function(a){if(a==F[p]){o.selected=true;}});}m.push(o);});return m;};};
