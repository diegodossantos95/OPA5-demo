/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Control"],function(q,C){"use strict";var F=C.extend("sap.suite.ui.commons.statusindicator.FillingOption",{metadata:{library:"sap.suite.ui.commons",properties:{shapeId:{type:"string",defaultValue:null},weight:{type:"int",defaultValue:1},order:{type:"int"}}}});F.prototype.setWeight=function(w){if(w<=0){q.sap.log.fatal("An invalid weight is passed. Weight should be a positive integer. Given: "+w);}this.setProperty("weight",w);};return F;});
