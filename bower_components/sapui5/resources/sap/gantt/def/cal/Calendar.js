/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["../DefBase","sap/gantt/misc/Format"],function(D,F){"use strict";var C=D.extend("sap.gantt.def.cal.Calendar",{metadata:{properties:{key:{type:"string",defaultValue:"calendar"},backgroundColor:{type:"sap.gantt.ValueSVGPaintServer",defaultValue:"#e5e5e5"}},aggregations:{timeIntervals:{type:"sap.gantt.def.cal.TimeInterval",multiple:true,singularName:"timeInterval",bindable:"bindable"}}}});C.prototype.getDefNode=function(){var t=this.getTimeIntervals();var s=(this.getParent()&&this.getParent().getParent())?this.getParent().getParent()._oStatusSet:null;var v=s?s.aViewBoundary:null;var T=s?s.aTimeBoundary:null;var f=t;if(T&&s){f=t.filter(function(o){var a=F.abapTimestampToDate(o.getStartTime());var e=F.abapTimestampToDate(o.getEndTime());if(s.bRTL===true){return(e<T[0]&&e>T[1])||(a>T[1]&&a<T[0]);}else{return(e<T[1]&&e>T[0])||(a>T[0]&&a<T[1]);}});}var w=(v&&v.length>1)?(v[1]-v[0]):1;var p={id:this.generateRefId(),x:0,y:0,width:w,timeIntervals:[]};for(var i=0;i<f.length;i++){var I=f[i].getDefNode();I.fill=this.getBackgroundColor();p.timeIntervals.push(I);}return p;};C.prototype.generateRefId=function(){var i=(this.getParent()&&this.getParent().getParent())?this.getParent().getParent().getId():"";return i+"_"+this.getKey();};return C;},true);
