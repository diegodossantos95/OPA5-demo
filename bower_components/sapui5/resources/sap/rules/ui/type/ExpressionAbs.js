/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var E=sap.ui.model.CompositeType.extend("sap.rules.ui.type.ExpressionAbs",{constructor:function(e,a){this.bParseWithValues=true;this.expressionLanguage=(e instanceof Object)?e:sap.ui.getCore().byId(e);this.sExpressionLanguageVersion=a;},validateValue:function(){return true;},setExpressionLanguage:function(e){this.expressionLanguage=(e instanceof Object)?e:sap.ui.getCore().byId(e);},setExpressionLanguageVersion:function(e){this.sExpressionLanguageVersion=e;}});return E;},true);
