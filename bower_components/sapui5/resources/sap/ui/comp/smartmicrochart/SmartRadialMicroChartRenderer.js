/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var S={};S.render=function(r,c){if(c._bIsInitialized){r.write("<div");r.writeControlData(c);r.writeClasses();r.write(">");r.renderControl(c.getAggregation("_chart"));r.write("</div>");}};return S;},true);
