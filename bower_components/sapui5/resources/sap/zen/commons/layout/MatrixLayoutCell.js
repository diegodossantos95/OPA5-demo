/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/zen/commons/library','sap/ui/core/CustomStyleClassSupport','sap/ui/core/Element'],function(q,l,C,E){"use strict";var M=E.extend("sap.zen.commons.layout.MatrixLayoutCell",{metadata:{library:"sap.zen.commons",aggregatingType:"MatrixLayoutRow",properties:{backgroundDesign:{type:"sap.zen.commons.layout.BackgroundDesign",defaultValue:'Transparent'},colSpan:{type:"int",defaultValue:1},hAlign:{type:"sap.zen.commons.layout.HAlign",defaultValue:'Begin'},padding:{type:"sap.zen.commons.layout.Padding",defaultValue:'End'},rowSpan:{type:"int",defaultValue:1},separation:{type:"sap.zen.commons.layout.Separation",defaultValue:'None'},vAlign:{type:"sap.zen.commons.layout.VAlign",defaultValue:'Middle'}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}}}});C.apply(M.prototype);return M;},true);
