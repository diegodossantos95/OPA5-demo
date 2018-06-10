//Copyright (c) 2013 SAP AG, All Rights Reserved
sap.ui.define(['sap/ushell/components/tiles/indicatorTileUtils/oData4Analytics','sap/ushell/components/tiles/indicatorTileUtils/smartBusinessUtil','sap/ushell/components/tiles/sbtilecontent'],function(d,s,a){"use strict";sap.ui.getCore().loadLibrary("sap.suite.ui.commons");sap.ui.jsview("sap.ushell.components.tiles.indicatorDual.DualTile",{getControllerName:function(){return"sap.ushell.components.tiles.indicatorDual.DualTile";},createContent:function(c){this.setHeight('100%');this.setWidth('100%');var t=this;t.tileData;t.oGenericTileData={};sap.ushell.components.tiles.indicatorTileUtils.util.getParsedChip(t.getViewData().chip.configuration.getParameterValueAsString("tileConfiguration"),t.getViewData().chip.preview.isEnabled(),function(g){t.oConfig=g;});t.tileType=t.oConfig.TILE_PROPERTIES.tileType;t.oNumericContent=new sap.m.NumericContent({value:"{/value}",scale:"{/scale}",unit:"{/unit}",indicator:"{/indicator}",size:"{/size}",formatterValue:"{/isFormatterValue}",truncateValueTo:5,valueColor:"{/valueColor}",nullifyValue:false});t.oLeftTileContent=new a({unit:"{/unit}",size:"{/size}",footer:"{/footerNum}",content:t.oNumericContent});switch(t.tileType){case"DT-CM":var C=new sap.suite.ui.microchart.ComparisonMicroChartData({title:"{title}",value:"{value}",color:"{color}",displayValue:"{displayValue}"});t.oComparisionContent=new sap.suite.ui.microchart.ComparisonMicroChart({size:"{/size}",scale:"{/scale}",data:{template:C,path:"/data"}});t.oRightContent=new a({unit:"{/unit}",size:"{/size}",footer:"{/footerNum}",content:t.oComparisionContent});break;case"DT-CT":var C=new sap.suite.ui.microchart.ComparisonMicroChartData({title:"{title}",value:"{value}",color:"{color}",displayValue:"{displayValue}"});t.oContributionContent=new sap.suite.ui.microchart.ComparisonMicroChart({size:"{/size}",scale:"{/scale}",data:{template:C,path:"/data"}});t.oRightContent=new a({unit:"{/unit}",size:"{/size}",footer:"{/footerNum}",content:t.oContributionContent});break;case"DT-TT":var b=function(n){return new sap.suite.ui.microchart.AreaMicroChartItem({color:"Good",points:{path:"/"+n+"/data",template:new sap.suite.ui.microchart.AreaMicroChartPoint({x:"{day}",y:"{balance}"})}});};var e=function(n){return new sap.suite.ui.microchart.AreaMicroChartLabel({label:"{/"+n+"/label}",color:"{/"+n+"/color}"});};var f=new sap.suite.ui.microchart.AreaMicroChart({width:"{/width}",height:"{/height}",size:"{/size}",target:b("target"),innerMinThreshold:b("innerMinThreshold"),innerMaxThreshold:b("innerMaxThreshold"),minThreshold:b("minThreshold"),maxThreshold:b("maxThreshold"),chart:b("chart"),minXValue:"{/minXValue}",maxXValue:"{/maxXValue}",minYValue:"{/minYValue}",maxYValue:"{/maxYValue}",firstXLabel:e("firstXLabel"),lastXLabel:e("lastXLabel"),firstYLabel:e("firstYLabel"),lastYLabel:e("lastYLabel"),minLabel:e("minLabel"),maxLabel:e("maxLabel")});t.oRightContent=new a({unit:"{/unit}",size:"{/size}",content:f});break;case"DT-AT":var B=new sap.suite.ui.microchart.BulletMicroChartData({value:"{value}",color:"{color}"});var o=new sap.suite.ui.microchart.BulletMicroChart({size:sap.m.Size.Auto,scale:"{/scale}",actual:{value:"{/actual/value}",color:"{/actual/color}"},targetValue:"{/targetValue}",actualValueLabel:"{/actualValueLabel}",targetValueLabel:"{/targetValueLabel}",thresholds:{template:B,path:"/thresholds"},state:"{/state}",showActualValue:"{/showActualValue}",showTargetValue:"{/showTargetValue}"});t.oRightContent=new a({unit:"{/unit}",size:"{/size}",footer:"{/footerNum}",content:o});break;}t.oGenericTile=new sap.m.GenericTile({subheader:"{/subheader}",frameType:"TwoByOne",size:"{/size}",header:"{/header}",tileContent:[t.oLeftTileContent,t.oRightContent]});t.oGenericTileModel=new sap.ui.model.json.JSONModel();t.oGenericTileModel.setData(t.oGenericTileData);t.oGenericTile.setModel(t.oGenericTileModel);return t.oGenericTile;}});},true);
