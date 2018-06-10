/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer'],function(q,R){"use strict";var T={};T.render=function(r,t){t.getAggregation("_toolbar").addStyleClass("sapUiRTECustomToolbar");r.renderControl(t.getAggregation("_toolbar"));};return T;},true);
