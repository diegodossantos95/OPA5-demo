/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global'],function(){"use strict";var E={};E.render=function(r,e){r.write("<div");r.writeControlData(e);r.addClass("sapRULExpressionAdvanced");r.writeClasses();r.write(">");r.renderControl(e.getAggregation("_expressionArea"));r.write("</div>");};return E;},true);
