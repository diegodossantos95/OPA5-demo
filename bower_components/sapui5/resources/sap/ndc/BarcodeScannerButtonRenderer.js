/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var B={};B.render=function(r,c){if(!c.getVisible()){return;}r.write("<span");r.writeControlData(c);r.write(" style=\"display:inline-block;width:"+c.getWidth()+";\">");r.renderControl(c.getAggregation("_btn"));r.write("</span>");};return B;},true);
