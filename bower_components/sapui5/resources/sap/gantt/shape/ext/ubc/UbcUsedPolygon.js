/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/misc/Utility","sap/gantt/misc/Format","sap/gantt/shape/ext/ubc/UbcPolygon"],function(U,F,a){"use strict";var b=a.extend("sap.gantt.shape.ext.ubc.UbcUsedPolygon",{});b.prototype.getFill=function(d,r){if(this.mShapeConfig.hasShapeProperty("fill")){return this._configFirst("fill",d);}return"#CAC7BA";};b.prototype.getPoints=function(d,r){if(this.mShapeConfig.hasShapeProperty("points")){return this._configFirst("points",d);}var u="";var m=this._getMaxY(d,r);var c=this._getMaxTotalRevised(d);var e=r.rowHeight-1;var f=d.drawData?d.drawData:d.period;var A=this.getAxisTime();for(var i=0;i<f.length;i++){var p=f[i];var x,g;var h;x=A.timeToView(F.abapTimestampToDate(p.start_date)).toFixed(1);if(i<f.length-1){g=A.timeToView(F.abapTimestampToDate(f[i+1].start_date)).toFixed(1);}else{g=A.timeToView(F.abapTimestampToDate(f[i].start_date)).toFixed(1);}if(!jQuery.isNumeric(x)){x=A.timeToView(0).toFixed(1);}if(!jQuery.isNumeric(g)){g=A.timeToView(0).toFixed(1);}if(i===0){u+=x+","+m+" ";}if(p.demand>=p.supply){h=m-p.supply/c*e;}else{h=m-p.demand/c*e;}h=h.toFixed(1);u+=x+","+h+" ";u+=g+","+h+" ";if(i===f.length-1){u+=x+","+h+" ";u+=x+","+m+" ";}}return u;};return b;},true);
