/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/library"],function(q,l){"use strict";sap.ui.getCore().initLibrary({name:"sap.fe",dependencies:["sap.ui.core"],types:[],interfaces:[],controls:[],elements:[],extensions:{flChangeHandlers:{"sap.fe.Table":"sap/fe/controls/_Table/Table"}},version:"1.50.2"});sap.ui.require(['sap/ui/core/XMLComposite','sap/ui/core/util/XMLPreprocessor'],function(X,a){a.plugIn(function(n,v){v.visitAttributes(n);X.initialTemplating(n,v,"sap.fe.Table");},"sap.fe","Table");a.plugIn(function(n,v){v.visitAttributes(n);X.initialTemplating(n,v,"sap.fe.FilterBar");},"sap.fe","FilterBar");});return sap.fe;},false);
