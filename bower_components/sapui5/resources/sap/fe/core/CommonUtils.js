/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/View"],function(V){"use strict";function g(c){while(c&&!(c instanceof V)){c=c.getParent();}return c;}return{getParentViewOfControl:g};});
