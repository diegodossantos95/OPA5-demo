/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var R={};R.render=function(r,c){r.write("<svg");r.writeControlData(c);r.addClass("sapUiVizkitRedlineSurface");r.writeClasses();r.write(">");c.getRedlineElements().forEach(function(a){a.render(r);});this.renderAfterRedlineElements(r,c);r.write("</svg>");};R.renderAfterRedlineElements=function(r,c){};return R;},true);
