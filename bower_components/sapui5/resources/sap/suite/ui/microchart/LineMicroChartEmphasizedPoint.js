/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(["sap/m/library","sap/suite/ui/microchart/LineMicroChartPoint"],function(M,L){"use strict";var a=L.extend("sap.suite.ui.microchart.LineMicroChartEmphasizedPoint",{metadata:{properties:{color:{type:"sap.m.ValueColor",group:"Misc",defaultValue:"Neutral"},show:{type:"boolean",group:"Appearance",defaultValue:false}}}});a.prototype.setColor=function(v){return this.setProperty("color",M.ValueColor[v]||null);};return a;});
