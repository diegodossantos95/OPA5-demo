/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var G={};G.render=function(r,g){jQuery.sap.measure.start("GanttChartRenderer render","GanttPerf:GanttChartRenderer render function");r.write("<div");r.writeControlData(g);r.addStyle("width",g.getWidth());r.addStyle("height",g.getHeight());r.writeStyles();r.addClass("sapGanttChart");r.writeClasses();r.write(">");jQuery.sap.measure.start("GanttChartRenderer renderPaintServer","GanttPerf:GanttChartRenderer renderPaintServer part");this.renderSvgDefs(r,g);jQuery.sap.measure.end("GanttChartRenderer renderPaintServer");jQuery.sap.measure.start("GanttChartRenderer renderChartHeader","GanttPerf:GanttChartRenderer renderChartHeader part");this.renderChartHeader(r,g);jQuery.sap.measure.end("GanttChartRenderer renderChartHeader");jQuery.sap.measure.start("GanttChartRenderer renderChartBody","GanttPerf:GanttChartRenderer renderChartBody part");this.renderChartBody(r,g);jQuery.sap.measure.end("GanttChartRenderer renderChartBody");r.write("</div>");jQuery.sap.measure.end("GanttChartRenderer render");};G.renderSvgDefs=function(r,g){var s=g.getSvgDefs();if(s){r.write("<svg id='"+g.getId()+"-svg-psdef'");r.addStyle("float","left");r.addStyle("width","0px");r.addStyle("height","0px");r.writeStyles();r.write(">");r.write(s.getDefString());r.write("</svg>");}};G.renderChartHeader=function(r,g){r.write("<div id='"+g.getId()+"-header'");r.addClass("sapGanttChartHeader");r.writeClasses();var b=g.getBaseRowHeight();var u=sap.gantt.misc.Utility.findSapUiSizeClass(g);var e=u==="sapUiSizeCozy"?52:36;var t=b+e;if(b>0){r.addStyle("height",t+"px");}r.writeStyles();r.write(">");r.write("<svg id='"+g.getId()+"-header-svg'");r.addClass("sapGanttChartHeaderSvg");r.writeClasses();if(b>0){r.addStyle("height",t+"px");}r.writeStyles();r.write("></svg>");r.write("</div>");};G.renderChartBody=function(r,g){r.write("<div id='"+g.getId()+"-tt'");r.addClass("sapUiTableHScr");r.addClass("sapGanttChartTT");r.writeClasses();r.addStyle("width",g.getWidth());r.addStyle("flex","1 1 auto");r.writeStyles();r.write(">");jQuery.sap.measure.start("GanttChartRenderer renderSvgDiv","GanttPerf:GanttChartRenderer renderPaintServer part");this.renderBodySvg(r,g);jQuery.sap.measure.end("GanttChartRenderer renderSvgDiv");r.renderControl(g.getAggregation("_treeTable"));r.write("</div>");};G.renderBodySvg=function(r,g){r.write("<div id='"+g.getId()+"-svg-ctn'");r.addClass("sapGanttChartSvgCtn");r.writeClasses();r.write(">");r.write("<svg id='"+g.getId()+"-svg'");r.addClass("sapGanttChartSvg");r.writeClasses();r.addStyle("height","100%");r.writeStyles();r.write(">");r.write("</svg>");r.write("</div>");};return G;},true);