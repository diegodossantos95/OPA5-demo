/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.jsview("sap.collaboration.components.fiori.feed.splitApp.GroupMaster",{getControllerName:function(){return"sap.collaboration.components.fiori.feed.splitApp.GroupMaster";},createContent:function(c){this.sPrefixId=this.getViewData().controlId;this.groupMasterPage=new sap.m.Page(this.sPrefixId+"groupPage",{title:this.getViewData().groupMasterpageTitle,showNavButton:true,navButtonPress:c.onNavButtonTap,content:[new sap.m.List(this.sPrefixId+"groupsList",{inset:true})]});return this.groupMasterPage;}});
