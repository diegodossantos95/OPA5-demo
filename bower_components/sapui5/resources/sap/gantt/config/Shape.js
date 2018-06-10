/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Element'],function(q,E){"use strict";var S=E.extend("sap.gantt.config.Shape",{metadata:{properties:{key:{type:"string",defaultValue:null},shapeClassName:{type:"string",defaultValue:null},shapeDataName:{type:"string",defaultValue:null},modeKeys:{type:"string[]",defaultValue:[]},level:{type:"string",defaultValue:null},shapeProperties:{type:"object",defaultValue:sap.gantt.config.DEFAULT_EMPTY_OBJECT},groupAggregation:{type:"object[]"},clippathAggregation:{type:"object[]"},selectedClassName:{type:"string",defaultValue:null},switchOfCheckBox:{type:"string",defaultValue:"noShow"},resizeShadowClassName:{type:"string",defaultValue:null}}}});S.prototype.hasShapeProperty=function(p){return this.getShapeProperties().hasOwnProperty(p);};S.prototype.getShapeProperty=function(p){return this.getShapeProperties()[p];};return S;},true);
