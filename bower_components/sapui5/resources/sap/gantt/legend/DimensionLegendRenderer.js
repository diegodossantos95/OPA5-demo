/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(P){"use strict";var D={};D.render=function(r,l){jQuery.sap.measure.start("DimensionLegendRenderer render","GanttPerf:DimensionLegendRenderer render function");r.write("<div");r.writeControlData(l);r.addStyle("width","100%");r.addStyle("height","100%");r.addStyle("position","relative");r.writeStyles();r.write(">");this.renderSvgDefs(r,l);r.write("<div");r.addStyle("float",sap.ui.getCore().getConfiguration().getRTL()?"right":"left");r.writeStyles();r.write(">");r.write("<svg");r.writeAttribute("id",l.getId()+"-svg");r.writeClasses();r.writeAttributeEscaped("tabindex",(sap.ui.Device.browser.chrome?null:-1));r.writeAttributeEscaped("focusable",false);r.write("></svg>");r.write("<svg");r.writeAttribute("id",l.getId()+"-dimension-path");r.addClass("sapGanttDimensionLegendPath");r.writeClasses();r.addStyle("position","absolute");r.addStyle(sap.ui.getCore().getConfiguration().getRTL()?"right":"left","0px");r.writeStyles();r.writeAttributeEscaped("tabindex",(sap.ui.Device.browser.chrome?null:-1));r.writeAttributeEscaped("focusable",false);r.write(">");r.write("</svg>");r.write("</div>");r.write("<div><svg");r.writeAttribute("id",l.getId()+"-dimension-text");r.addClass("sapGanttDimensionLegendText");r.writeClasses();r.addStyle("position","absolute");r.addStyle("width","100px");r.writeStyles();r.writeAttributeEscaped("tabindex",(sap.ui.Device.browser.chrome?null:-1));r.writeAttributeEscaped("focusable",false);r.write("></svg></div>");r.write("</div>");jQuery.sap.measure.end("DimensionLegendRenderer render");};D.renderSvgDefs=function(r,l){var s=l.getSvgDefs();if(s){r.write("<svg id='"+l.getId()+"-svg-psdef'");r.addStyle("float","left");r.addStyle("width","0px");r.addStyle("height","0px");r.writeStyles();r.writeAttributeEscaped("tabindex",(sap.ui.Device.browser.chrome?null:-1));r.writeAttributeEscaped("focusable",false);r.write(">");r.write(s.getDefString());r.write("</svg>");}};return D;},true);
