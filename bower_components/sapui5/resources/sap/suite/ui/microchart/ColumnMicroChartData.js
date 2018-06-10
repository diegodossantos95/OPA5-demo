/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Element','sap/ui/core/Control'],function(q,l,E,C){"use strict";var a=E.extend("sap.suite.ui.microchart.ColumnMicroChartData",{metadata:{library:"sap.suite.ui.microchart",properties:{color:{group:"Misc",type:"sap.m.ValueColor",defaultValue:"Neutral"},label:{type:"string",group:"Misc",defaultValue:""},value:{type:"float",group:"Misc"}},events:{press:{}}}});a.prototype.attachEvent=function(e,d,f,L){C.prototype.attachEvent.call(this,e,d,f,L);if(this.getParent()){this.getParent().setBarPressable(this.getParent().getColumns().indexOf(this),true);}return this;};a.prototype.detachEvent=function(e,f,L){C.prototype.detachEvent.call(this,e,f,L);if(this.getParent()){this.getParent().setBarPressable(this.getParent().getColumns().indexOf(this),false);}return this;};return a;});
