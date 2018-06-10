/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var D={};D.render=function(r,c){q.sap.syncStyleClass("sapUiSizeCozy",c.getParent(),this.oControl);r.write("<div");r.writeControlData(c);r.addClass("sapRULDecisionTable");r.writeClasses();r.write(">");r.renderControl(c.getAggregation("_toolbar"));r.renderControl(c.getAggregation("_errorsText"));r.renderControl(c.getAggregation("_table"));r.write("</div>");};return D;},true);
