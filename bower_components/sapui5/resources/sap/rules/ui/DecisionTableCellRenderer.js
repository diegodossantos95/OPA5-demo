/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var D={};D.render=function(r,c){if(!c.getVisible()){return;}r.write("<div");r.writeControlData(c);r.addClass("sapRULDecisionTableSCell");r.writeClasses();r.write(">");r.renderControl(c.getAggregation("_displayedControl"));r.write("</div>");};return D;},true);
