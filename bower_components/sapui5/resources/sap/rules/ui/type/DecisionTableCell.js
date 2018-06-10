/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var D=sap.rules.ui.type.ExpressionAbs.extend("sap.rules.ui.type.DecisionTableCell",{formatValue:function(c){var C,s;if(c.length===3){C=c[0];s=c[2];}else{C=c[2];s=c[3];}if(!this.expressionLanguage){return C;}return s;},parseValue:function(c,t,C){var s;var a;var b=C.length===3;if(!this.expressionLanguage||!c){s=c;}else if(b){a=this.expressionLanguage.convertDecisionTableExpressionToModelValue(c,"","",C[1],this.sExpressionLanguageVersion);s=a.output.status==="Success"?a.output.converted.header:c;}else{a=this.expressionLanguage.convertDecisionTableExpressionToModelValue(C[0],C[1],c,"",this.sExpressionLanguageVersion);s=a.output.status==="Success"?a.output.converted.cell:c;}if(b){C[0]=s;C[2]=c;}else{C[2]=s;C[3]=c;}return C;}});return D;},true);
