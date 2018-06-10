/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Element'],function(q,E){"use strict";var C=E.extend("sap.ui.comp.personalization.ColumnWrapper",{constructor:function(i,s){E.apply(this,arguments);},metadata:{library:"sap.ui.comp",properties:{label:{type:"string"},tooltip:{type:"string"},selected:{type:"boolean",defaultValue:false},aggregationRole:{type:"sap.ui.comp.personalization.AggregationRole"},role:{type:"string"},href:{type:"string",defaultValue:null},target:{type:"string",defaultValue:null},press:{type:"object",defaultValue:null},sorted:{type:"boolean",defaultValue:false},sortOrder:{type:"string",defaultValue:"Ascending"}}}});return C;},true);
