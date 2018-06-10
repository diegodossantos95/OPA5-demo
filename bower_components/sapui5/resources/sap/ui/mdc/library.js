/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/mdc/model/GenericType','sap/ui/mdc/experimental/provider/ProviderHook'],function(G,P){"use strict";sap.ui.getCore().initLibrary({version:"1.50.6",name:"sap.ui.mdc",dependencies:["sap.ui.core","sap.m"],types:["sap.ui.mdc.FieldDisplay","sap.ui.mdc.EditMode"],interfaces:[],controls:["sap.ui.mdc.experimental.Field","sap.ui.mdc.FilterField","sap.ui.mdc.FilterToken"],elements:["sap.ui.mdc.experimental.FieldHelpBase","sap.ui.mdc.experimental.CustomFieldHelp"],noLibraryCSS:false});sap.ui.mdc.FieldDisplay={Value:"Value",Description:"Description",ValueDescription:"ValueDescription",DescriptionValue:"DescriptionValue"};sap.ui.mdc.EditMode={Display:"Display",Editable:"Editable",ReadOnly:"ReadOnly",Disabled:"Disabled"};P.apply();return sap.ui.mdc;});
