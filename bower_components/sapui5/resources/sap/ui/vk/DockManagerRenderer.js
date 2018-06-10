/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var D={};D.render=function(r,c){var a=r;a.write("<div");a.writeControlData(c);a.writeClasses();if(c.getWidth()&&c.getWidth()!=""){a.addStyle("width",c.getWidth());}if(c.getHeight()&&c.getHeight()!=""){a.addStyle("height",c.getHeight());}a.writeStyles();a.write(">");a.write("</div>");};return D;},true);
