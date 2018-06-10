/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Control"],function(C){"use strict";var E=C.extend("sap.rules.ui.ExpressionBase",{metadata:{"abstract":true,properties:{value:{type:"string",defaultValue:"",bindable:"bindable"},editable:{type:"boolean",defaultValue:true},validateOnLoad:{type:"boolean",defaultValue:false},valueStateText:{type:"string",defaultValue:null,bindable:"bindable"}},associations:{expressionLanguage:{type:"sap.rules.ui.services.ExpressionLanguage",multiple:false,singularName:"expressionLanguage"}},publicMethods:["validate"]},renderer:null});E.prototype.init=function(){};return E;},true);
