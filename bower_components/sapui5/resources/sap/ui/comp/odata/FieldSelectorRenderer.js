/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var F={};F.render=function(r,c){r.write("<span");r.writeControlData(c);r.writeClasses();r.write(">");var C=c.getContent();r.renderControl(C);r.write("</span>");};return F;},true);
