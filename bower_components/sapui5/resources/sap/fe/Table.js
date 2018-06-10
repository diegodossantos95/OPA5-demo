/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/XMLComposite','sap/fe/controls/_Table/GridTable/GridTableController','sap/fe/controls/_Table/ResponsiveTable/ResponsiveTableController','sap/fe/controls/_Field/FieldController','sap/ui/table/Table','sap/fe/core/AnnotationHelper','sap/fe/controls/_Table/TableAnnotationHelper','sap/fe/controls/_Field/FieldAnnotationHelper','sap/ui/model/odata/v4/AnnotationHelper'],function(q,X,G,R,F,a){"use strict";var T=X.extend("sap.fe.Table",{metadata:{designTime:true,properties:{context:{type:"any",invalidate:"template"},tableBindingPath:{type:"string",invalidate:"template"},type:{type:"string",defaultValue:"ResponsiveTable",invalidate:"template"},interactionType:{type:"string",defaultValue:"Inactive",invalidate:"template"},"settingsDialogType":{type:"string",defaultValue:"ViewSettings"},filterBarId:{type:"string",invalidate:false},enabled:{type:"boolean",defaultValue:true,invalidate:false}},events:{"itemPress":{},"callAction":{},"showError":{}},publicMethods:[]},alias:"this",fragment:"sap.fe.controls._Table.Table"});var i=function(){if(!this.bInitialized){this.oTableController.attachToFilterBar();this.oTableController.setSelectionMode();this.oTableController.enableDisableActions();this.oTableController.bindTableCount();this.bInitialized=true;this.detachModelContextChange(i);}};T.prototype.init=function(){var I=this.getInnerTable();if(I instanceof a){this.oTableController=new G(this);}else{this.oTableController=new R(this);}this.oFieldController=new F(null,this);this.attachModelContextChange(i);};T.prototype.getInnerTable=function(){return this.get_content();};T.prototype.handleDataRequested=function(e){this.oTableController.handleDataRequested(e);};T.prototype.handleDataReceived=function(e){this.oTableController.handleDataReceived(e);};T.prototype.handleSelectionChange=function(e){this.oTableController.enableDisableActions();};T.prototype.handleItemPress=function(e){this.fireItemPress({listItem:e.getParameter("listItem")});};T.prototype.handleCallAction=function(e){this.oTableController.handleCallAction(e);};T.prototype.getSelectedContexts=function(){var I=this.getInnerTable();var s=[];if(I instanceof a){var S=I.getSelectedIndices();for(var b in S){s.push(I.getContextByIndex(b));}}else{s=I.getSelectedContexts();}return s;};T.prototype.getEntitySet=function(){var l=this.getListBinding().getPath();return l.substr(1);};T.prototype.getListBinding=function(){return this.oTableController.getListBinding();};T.prototype.getListBindingInfo=function(){return this.oTableController.getListBindingInfo();};T.prototype.onContactDetails=function(e){this.oFieldController.onContactDetails(e);};T.prototype.onDraftLinkPressed=function(e){this.oFieldController.onDraftLinkPressed(e);};T.prototype.onDataFieldWithIntentBasedNavigationPressed=function(e){this.oFieldController.onDataFieldWithIntentBasedNavigationPressed(e);};T.prototype.onStandardActionClick=function(e){this.oTableController.onStandardActionClick(e);};return T;},true);
