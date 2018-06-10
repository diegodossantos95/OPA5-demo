// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ca/ui/model/format/NumberFormat','sap/ui/model/analytics/odata4analytics','sap/ushell/components/tiles/indicatorTileUtils/smartBusinessUtil'],function(N,o,s){"use strict";jQuery.sap.require("sap.ushell.components.tiles.indicatorTileUtils.smartBusinessUtil");jQuery.sap.require("sap.ui.model.analytics.odata4analytics");sap.ui.getCore().loadLibrary("sap.suite.ui.commons");sap.ui.jsview("tiles.indicatorDualTrend.DualTrend",{getControllerName:function(){return"tiles.indicatorDualTrend.DualTrend";},createContent:function(c){this.setHeight('100%');this.setWidth('100%');var b=function(h){return new sap.suite.ui.microchart.AreaMicroChartItem({color:"Good",points:{path:"/"+h+"/data",template:new sap.suite.ui.microchart.AreaMicroChartPoint({x:"{day}",y:"{balance}"})}});};var a=function(h){return new sap.suite.ui.microchart.AreaMicroChartLabel({label:"{/"+h+"/label}",color:"{/"+h+"/color}"});};var g={footer:"",header:"",subheader:""};var n=new sap.suite.ui.microchart.AreaMicroChart({width:"{/width}",height:"{/height}",size:"{/size}",target:b("target"),innerMinThreshold:b("innerMinThreshold"),innerMaxThreshold:b("innerMaxThreshold"),minThreshold:b("minThreshold"),maxThreshold:b("maxThreshold"),chart:b("chart"),minXValue:"{/minXValue}",maxXValue:"{/maxXValue}",minYValue:"{/minYValue}",maxYValue:"{/maxYValue}",firstXLabel:a("firstXLabel"),lastXLabel:a("lastXLabel"),firstYLabel:a("firstYLabel"),lastYLabel:a("lastYLabel"),minLabel:a("minLabel"),maxLabel:a("maxLabel")});var d=new sap.m.TileContent({unit:"{/unit}",size:"{/size}",content:n});var e=new sap.m.NumericContent({value:"{/value}",scale:"{/scale}",unit:"{/unit}",indicator:"{/indicator}",size:"{/size}",formatterValue:true,truncateValueTo:6,valueColor:"{/valueColor}"});var f=new sap.m.TileContent({unit:"{/unit}",size:"{/size}",content:e});this.oGenericTile=new sap.m.GenericTile({subheader:"{/subheader}",frameType:"TwoByOne",size:"{/size}",header:"{/header}",tileContent:[f,d]});var G=new sap.ui.model.json.JSONModel();G.setData(g);this.oGenericTile.setModel(G);return this.oGenericTile;}});},true);
