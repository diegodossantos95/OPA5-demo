/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var R={};R.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapRULRuleBuilder");r.writeClasses();r.write(">");r.renderControl(c.getAggregation("_ruleTypeSelector"));r.renderControl(c.getAggregation("_rule"));r.write("</div>");};return R;},true);
