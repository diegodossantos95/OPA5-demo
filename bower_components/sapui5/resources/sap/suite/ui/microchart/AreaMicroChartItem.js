/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['./library','sap/ui/core/Element'],function(l,E){"use strict";var A=E.extend("sap.suite.ui.microchart.AreaMicroChartItem",{metadata:{library:"sap.suite.ui.microchart",properties:{color:{group:"Misc",type:"sap.m.ValueColor",defaultValue:"Neutral"},title:{type:"string",group:"Misc",defaultValue:null}},defaultAggregation:"points",aggregations:{"points":{multiple:true,type:"sap.suite.ui.microchart.AreaMicroChartPoint",bindable:"bindable"}}}});return A;});
