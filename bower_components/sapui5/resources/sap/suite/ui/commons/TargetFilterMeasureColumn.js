/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Element','sap/ui/model/type/Integer','sap/ui/model/SimpleType'],function(q,l,E,I,S){"use strict";var T=E.extend("sap.suite.ui.commons.TargetFilterMeasureColumn",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{path:{type:"string",group:"Misc",defaultValue:null},type:{type:"any",group:"Misc",defaultValue:null}}}});T.prototype.init=function(){this.setType(new I({groupingEnabled:true}));};T.prototype.setType=function(t,s){if(!(t instanceof S)){q.sap.log.error(t+" is not instance of sap.ui.model.SimpleType",this);}this.setProperty("type",t,s);};return T;});
