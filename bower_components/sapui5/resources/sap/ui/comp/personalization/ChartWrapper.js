/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Element'],function(q,E){"use strict";var C=E.extend("sap.ui.comp.personalization.ChartWrapper",{constructor:function(i,s){E.apply(this,arguments);},metadata:{library:"sap.ui.comp",properties:{externalFilters:{type:"sap.m.P13nFilterItem[]",defaultValue:[]}},aggregations:{columns:{type:"sap.ui.comp.personalization.ColumnWrapper",multiple:true,singularName:"column"}},associations:{chart:{type:"sap.chart.Chart",multiple:false}},events:{externalFiltersSet:{parameters:{filters:{type:"sap.m.P13nFilterItem[]"}}}}}});C.prototype.getChartObject=function(){var c=this.getAssociation("chart");if(typeof c==="string"){c=sap.ui.getCore().byId(c);}return c;};C.prototype.getDomRef=function(){var c=this.getChartObject();return c.getDomRef();};C.prototype.setExternalFilters=function(f){f=this.validateProperty("externalFilters",f);this.setProperty("externalFilters",f,true);this.fireExternalFiltersSet({filters:f});return this;};return C;},true);
