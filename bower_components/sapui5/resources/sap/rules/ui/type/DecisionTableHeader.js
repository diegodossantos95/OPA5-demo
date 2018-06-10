/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var D=sap.rules.ui.type.ExpressionAbs.extend("sap.rules.ui.type.DecisionTableHeader",{formatValue:function(h){if(!this.expressionLanguage){return h.join(" ");}var H="";if(h[0]){var r=this.expressionLanguage.convertDecisionTableExpressionToDisplayValue(h[0]);if(r.output.converted){var c=r.output.converted;H=c.header;}else if(h[0]){H=h[0];}}return H+' '+h[1];}});return D;},true);
