/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.composite.InboxTaskTitleControlRenderer");

/**
 * @class InboxTaskTitleControl renderer. 
 * @static
 */
sap.uiext.inbox.composite.InboxTaskTitleControlRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.uiext.inbox.composite.InboxTaskTitleControlRenderer.render = function(oRenderManager, oControl){ 
    // convenience variable
	var oRm = oRenderManager;
	
	// write the HTML into the render manager
	oRm.write("<div"); 
	oRm.writeControlData(oControl);  // writes the Control ID and enables event handling - important!
	oRm.writeStyles();
	oRm.addClass("sapUiExtInboxTaskTitle");        // add a CSS class for styles common to all control instances
	oRm.writeClasses();              // this call writes the above class plus enables support for Square.addStyleClass(...)
	oRm.write(">");
	
	//render TaskCategory Image
	if(oControl.getCategoryIconURI() && sap.ui.core.IconPool.isIconURI(oControl.getCategoryIconURI())){
		this.renderTaskCategoryIcon(oRm, oControl);
	}
	
	//render TaskTitle Link
	
	/*oRm.write("<div");
	oRm.addClass("sapUiExtInboxTaskTitleLink");
	oRm.writeClasses();
	oRm.writeStyles();
	oRm.write(">");*/
	var oLink = oControl.getAggregation("titleLink");
	oLink.addStyleClass("sapUiExtInboxTaskTitleLink");
	oRm.renderControl(oLink);
	/*oRm.write("</div>");*/
	
	//render Attachment icon
	if(oControl.getHasAttachments()){
		this.renderAttachmentIcon(oRm, oControl);
	}
	
	//render comments icon
	if(oControl.getHasComments()){
		this.renderCommentsIcon(oRm, oControl);
	}
		
	oRm.write("</div>");
};

sap.uiext.inbox.composite.InboxTaskTitleControlRenderer.renderTaskCategoryIcon = function(oRm, oControl){ 
	var oIconInfo = sap.ui.core.IconPool.getIconInfo(oControl.getCategoryIconURI());
	if(oIconInfo){
		this.renderIcon(oRm, oControl.getId() + "-categoryIcon", "sapUiExtInboxTaskTitleCategIcon", oControl.getCategoryIconURI());
	}
};

sap.uiext.inbox.composite.InboxTaskTitleControlRenderer.renderAttachmentIcon = function(oRm, oControl){ 
	this.renderIcon(oRm, oControl.getId() + "-attachmentIcon", "sapUiExtInboxTaskTitleAttachIcon", sap.ui.core.IconPool.getIconURI("attachment"));
};

sap.uiext.inbox.composite.InboxTaskTitleControlRenderer.renderCommentsIcon = function(oRm, oControl){ 
	this.renderIcon(oRm, oControl.getId() + "-commentIcon", "sapUiExtInboxTaskTitleCommIcon", sap.ui.core.IconPool.getIconURI("comment"));
};

sap.uiext.inbox.composite.InboxTaskTitleControlRenderer.renderIcon = function(oRm, id, styleClass, icon){ 
	var aClasses = [];
	var mAttributes = {};
	
	mAttributes["id"] = id;
	aClasses.push("sapUiExtInboxTaskTitleIcon");
	oRm.writeIcon(icon, aClasses, mAttributes);
};