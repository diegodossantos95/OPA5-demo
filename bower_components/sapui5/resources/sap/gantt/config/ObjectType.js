/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Element'],function(q,E){"use strict";var O=E.extend("sap.gantt.config.ObjectType",{metadata:{properties:{key:{type:"string",defaultValue:null},description:{type:"string",defaultValue:null},mainChartSchemeKey:{type:"string",defaultValue:sap.gantt.config.DEFAULT_MAIN_CHART_SCHEME_KEY},expandedChartSchemeKeys:{type:"string[]",defaultValue:[]}}}});return O;},true);
