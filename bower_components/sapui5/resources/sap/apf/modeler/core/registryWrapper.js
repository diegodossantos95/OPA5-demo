/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.registryWrapper");(function(){'use strict';sap.apf.modeler.core.RegistryWrapper=function(h){function g(t){var r=[];h.each(function(i,e){if(e.type===t){r.push(e);}});return r;}this.getItem=function(k){return h.getItem(k);};this.getSteps=function(){var i=g("step");i=jQuery.merge(i,g("hierarchicalStep"));return i;};this.getCategories=function(){return g("category");};this.getFacetFilters=function(){if(h.getItem(sap.apf.core.constants.existsEmptyFacetFilterArray)===true){return{emptyArray:true};}return g("facetFilter");};this.getNavigationTargets=function(){return g("navigationTarget");};};}());
