/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control"],function(q,l,C){"use strict";var r=C.extend("sap.rules.ui.RuleBase",{metadata:{properties:{bindingContextPath:{type:"string",group:"Misc",defaultValue:""},modelName:{type:"string",group:"Misc",defaultValue:""},editable:{type:"boolean",defaultValue:true}},library:"sap.rules.ui",associations:{"expressionLanguage":{type:"sap.rules.ui.services.ExpressionLanguage",multiple:false,singularName:"expressionLanguage"}}}});return r;},true);
