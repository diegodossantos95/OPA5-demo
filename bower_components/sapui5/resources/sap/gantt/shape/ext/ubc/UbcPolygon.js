/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/misc/Utility","sap/gantt/shape/Polygon"],function(U,P){"use strict";var a=P.extend("sap.gantt.shape.ext.ubc.UbcPolygon",{metadata:{"abstract":true}});a.prototype.getEnableSelection=function(d,r){if(this.mShapeConfig.hasShapeProperty("enableSelection")){return this._configFirst("enableSelection",d);}return false;};a.prototype._getMaxY=function(d,r){var t=r.y;var b=r.rowHeight-1;var m=t+b;return m;};a.prototype._getMaxTotal=function(d){var m=Math.max.apply(Math,d.period.map(function(o){return o.supply;}));if(m<=0){m=1;}return m;};a.prototype._getmaxExceedCap=function(d,t){var m;if(t){m=t;}else{m=this._getMaxTotal(d);}var b=25;if(this.mShapeConfig.hasShapeProperty("maxExceedCapacity")){b=this._configFirst("maxExceedCapacity",d);}return m*b/100;};a.prototype._getMaxTotalRevised=function(d){var m=this._getMaxTotal(d);var b=this._getmaxExceedCap(d,m)+m;return b;};return a;},true);
