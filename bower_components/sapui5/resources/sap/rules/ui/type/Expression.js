/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","sap/rules/ui/type/ExpressionAbs"],function(q,E){"use strict";var a=E.extend("sap.rules.ui.type.Expression",{formatValue:function(v){var e=v;var s=sap.rules.ui.ExpressionType.All;if(!this.expressionLanguage){return e;}if(e){var r=this.expressionLanguage.convertDecisionTableExpressionToDisplayValue(e,"","",s);if(r.output.status==="Success"){return r.output.converted.header;}}return e;},parseValue:function(e){var s=sap.rules.ui.ExpressionType.All;if(!this.expressionLanguage){return e;}if(e){var r=this.expressionLanguage.convertDecisionTableExpressionToModelValue(e,"","",s);if(r.output.status==="Success"){return r.output.converted.header;}}return e;}});return a;},true);
