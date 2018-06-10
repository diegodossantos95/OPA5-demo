/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Element"],function(q,l,E){"use strict";var D=E.extend("sap.rules.ui.DecisionTableConfiguration",{metadata:{library:"sap.rules.ui",properties:{cellFormat:{type:"sap.rules.ui.DecisionTableCellFormat",defaultValue:sap.rules.ui.DecisionTableCellFormat.Both},hitPolicies:{type:"sap.rules.ui.RuleHitPolicy[]",defaultValue:[sap.rules.ui.RuleHitPolicy.FirstMatch,sap.rules.ui.RuleHitPolicy.AllMatch]},enableSettings:{type:"boolean",defaultValue:false}},events:{change:{parameters:{name:{},value:{}}}}},_handlePropertySetter:function(p,v){var r=this.setProperty(p,v,true);this.fireChange({name:p,value:v});return r;},setCellFormat:function(v){return this._handlePropertySetter("cellFormat",v);},setHitPolicies:function(v){return this._handlePropertySetter("hitPolicies",v);},setEnableSettings:function(v){return this._handlePropertySetter("enableSettings",v);}});return D;},true);
