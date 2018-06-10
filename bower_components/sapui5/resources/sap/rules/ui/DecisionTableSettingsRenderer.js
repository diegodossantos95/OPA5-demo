/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var D={};D.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapRULTDecisionTableSettings");r.writeClasses();r.write(">");var s=c.getAggregation("mainLayout");r.renderControl(s);r.write("</div>");};return D;},true);
