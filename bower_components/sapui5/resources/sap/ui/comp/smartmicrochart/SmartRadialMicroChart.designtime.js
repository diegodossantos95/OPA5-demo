/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define([],function(){"use strict";return{annotations:{chart:{namespace:"com.sap.vocabularies.UI.v1",annotation:"Chart",target:["EntityType"],defaultValue:null,since:"1.42.0"},chartDefinitionType:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ChartDefinitionType",target:["EntityType"],whiteList:{properties:["Title","Description","ChartType","Measures","MeasureAttributes"]},defaultValue:null,since:"1.42.0"},chartType:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ChartType",target:["Property"],whiteList:{values:["Donut"]},defaultValue:null,since:"1.42.0"},dataPoint:{namespace:"com.sap.vocabularies.UI.v1",annotation:"DataPoint",target:["EntityType"],defaultValue:null,since:"1.42.0"},dataPointType:{namespace:"com.sap.vocabularies.UI.v1",annotation:"DataPointType",target:["EntityType"],whiteList:{properties:["Value","TargetValue","Criticality","CriticalityCalculation"]},defaultValue:null,since:"1.42.0"},criticalityCalculationType:{namespace:"com.sap.vocabularies.UI.v1",annotation:"CriticalityCalculationType",target:["Property"],whiteList:{properties:["ImprovementDirection","ToleranceRangeLowValue","ToleranceRangeHighValue","DeviationRangeLowValue","DeviationRangeHighValue"]},defaultValue:null,since:"1.42.0"},currency:{namespace:"Org.OData.Measures.V1",annotation:"ISOCurrency",target:["Property"],defaultValue:null,since:"1.42.0"},unit:{namespace:"Org.OData.Measures.V1",annotation:"Unit",target:["Property"],defaultValue:null,since:"1.42.0"},label:{namespace:"com.sap.vocabularies.Common.v1",annotation:"Label",target:["Property"],defaultValue:null,since:"1.42.0"}},customData:{chartQualifier:{type:"string",defaultValue:null,group:["Appearance"],since:"1.42.0"}}};},false);