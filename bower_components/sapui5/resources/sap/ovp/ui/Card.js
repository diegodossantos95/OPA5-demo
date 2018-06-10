/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ui/core/Control"],function(C){"use strict";return C.extend("sap.ovp.ui.Card",{metadata:{library:"sap.ovp",designTime:false,aggregations:{innerCard:{type:"sap.ui.core.Control",multiple:false}},defaultAggregation:"innerCard"},init:function(){},renderer:function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapOvpBaseCardWrapper");r.writeClasses();r.write(">");r.renderControl(c.getAggregation("innerCard"));r.write("</div>");}});},true);
