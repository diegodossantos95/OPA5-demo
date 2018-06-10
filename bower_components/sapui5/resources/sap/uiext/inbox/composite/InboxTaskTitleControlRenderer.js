/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.composite.InboxTaskTitleControlRenderer");sap.uiext.inbox.composite.InboxTaskTitleControlRenderer={};
sap.uiext.inbox.composite.InboxTaskTitleControlRenderer.render=function(r,c){var R=r;R.write("<div");R.writeControlData(c);R.writeStyles();R.addClass("sapUiExtInboxTaskTitle");R.writeClasses();R.write(">");if(c.getCategoryIconURI()&&sap.ui.core.IconPool.isIconURI(c.getCategoryIconURI())){this.renderTaskCategoryIcon(R,c);}var l=c.getAggregation("titleLink");l.addStyleClass("sapUiExtInboxTaskTitleLink");R.renderControl(l);if(c.getHasAttachments()){this.renderAttachmentIcon(R,c);}if(c.getHasComments()){this.renderCommentsIcon(R,c);}R.write("</div>");};
sap.uiext.inbox.composite.InboxTaskTitleControlRenderer.renderTaskCategoryIcon=function(r,c){var i=sap.ui.core.IconPool.getIconInfo(c.getCategoryIconURI());if(i){this.renderIcon(r,c.getId()+"-categoryIcon","sapUiExtInboxTaskTitleCategIcon",c.getCategoryIconURI());}};
sap.uiext.inbox.composite.InboxTaskTitleControlRenderer.renderAttachmentIcon=function(r,c){this.renderIcon(r,c.getId()+"-attachmentIcon","sapUiExtInboxTaskTitleAttachIcon",sap.ui.core.IconPool.getIconURI("attachment"));};
sap.uiext.inbox.composite.InboxTaskTitleControlRenderer.renderCommentsIcon=function(r,c){this.renderIcon(r,c.getId()+"-commentIcon","sapUiExtInboxTaskTitleCommIcon",sap.ui.core.IconPool.getIconURI("comment"));};
sap.uiext.inbox.composite.InboxTaskTitleControlRenderer.renderIcon=function(r,i,s,a){var c=[];var A={};A["id"]=i;c.push("sapUiExtInboxTaskTitleIcon");r.writeIcon(a,c,A);};
