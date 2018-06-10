/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.uiext.inbox.composite.InboxTaskTitleControl.
jQuery.sap.declare("sap.uiext.inbox.composite.InboxTaskTitleControl");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new composite/InboxTaskTitleControl.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul>
 * <li>{@link #getTaskTitle taskTitle} : string</li>
 * <li>{@link #getCategoryIconURI categoryIconURI} : sap.ui.core.URI (default: 'hasCategory')</li>
 * <li>{@link #getHasAttachments hasAttachments} : boolean</li>
 * <li>{@link #getHasComments hasComments} : boolean</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getTitleLink titleLink} : sap.ui.core.Control</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxTaskTitleControl
 * @extends sap.ui.core.Control
 * @version 1.50.6
 *
 * @constructor
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxTaskTitleControl", { metadata : {

	library : "sap.uiext.inbox",
	properties : {

		/**
		 * The Task Title of the Task
		 */
		"taskTitle" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Category icon
		 */
		"categoryIconURI" : {type : "sap.ui.core.URI", group : "Misc", defaultValue : 'hasCategory'},

		/**
		 * has Attachments
		 */
		"hasAttachments" : {type : "boolean", group : "Misc", defaultValue : null},

		/**
		 * has Comments
		 */
		"hasComments" : {type : "boolean", group : "Misc", defaultValue : null}
	},
	aggregations : {

		/**
		 * Internal aggregation to hold the inner Task Title Link
		 */
		"titleLink" : {type : "sap.ui.core.Control", multiple : false}
	}
}});


/**
 * Creates a new subclass of class sap.uiext.inbox.composite.InboxTaskTitleControl with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl.extend
 * @function
 */


/**
 * Getter for property <code>taskTitle</code>.
 * The Task Title of the Task
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>taskTitle</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl#getTaskTitle
 * @function
 */

/**
 * Setter for property <code>taskTitle</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTaskTitle  new value for property <code>taskTitle</code>
 * @return {sap.uiext.inbox.composite.InboxTaskTitleControl} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl#setTaskTitle
 * @function
 */


/**
 * Getter for property <code>categoryIconURI</code>.
 * Category icon
 *
 * Default value is <code>hasCategory</code>
 *
 * @return {sap.ui.core.URI} the value of property <code>categoryIconURI</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl#getCategoryIconURI
 * @function
 */

/**
 * Setter for property <code>categoryIconURI</code>.
 *
 * Default value is <code>hasCategory</code> 
 *
 * @param {sap.ui.core.URI} sCategoryIconURI  new value for property <code>categoryIconURI</code>
 * @return {sap.uiext.inbox.composite.InboxTaskTitleControl} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl#setCategoryIconURI
 * @function
 */


/**
 * Getter for property <code>hasAttachments</code>.
 * has Attachments
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {boolean} the value of property <code>hasAttachments</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl#getHasAttachments
 * @function
 */

/**
 * Setter for property <code>hasAttachments</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {boolean} bHasAttachments  new value for property <code>hasAttachments</code>
 * @return {sap.uiext.inbox.composite.InboxTaskTitleControl} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl#setHasAttachments
 * @function
 */


/**
 * Getter for property <code>hasComments</code>.
 * has Comments
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {boolean} the value of property <code>hasComments</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl#getHasComments
 * @function
 */

/**
 * Setter for property <code>hasComments</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {boolean} bHasComments  new value for property <code>hasComments</code>
 * @return {sap.uiext.inbox.composite.InboxTaskTitleControl} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl#setHasComments
 * @function
 */


/**
 * Getter for aggregation <code>titleLink</code>.<br/>
 * Internal aggregation to hold the inner Task Title Link
 * 
 * @return {sap.ui.core.Control}
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl#getTitleLink
 * @function
 */


/**
 * Setter for the aggregated <code>titleLink</code>.
 * @param {sap.ui.core.Control} oTitleLink
 * @return {sap.uiext.inbox.composite.InboxTaskTitleControl} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl#setTitleLink
 * @function
 */
	

/**
 * Destroys the titleLink in the aggregation 
 * named <code>titleLink</code>.
 * @return {sap.uiext.inbox.composite.InboxTaskTitleControl} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl#destroyTitleLink
 * @function
 */

// Start of sap/uiext/inbox/composite/InboxTaskTitleControl.js
/*!
 * @copyright@
 */

///**
// * This file defines behavior for the control,
// */
jQuery.sap.require("sap.ui.core.IconPool");

sap.uiext.inbox.composite.InboxTaskTitleControl.prototype.init = function(){
	//var that = this;
	//this.setAggregation("titleLink", new sap.ui.commons.Link());
};


sap.uiext.inbox.composite.InboxTaskTitleControl.prototype.setTaskTitle = function(sValue){
    this.setProperty("taskTitle", sValue, true /*no re-rendering of whole search field needed*/);
    this.getAggregation("titleLink").setText(sValue); // Note: this triggers re-rendering of text field!
};

sap.uiext.inbox.composite.InboxTaskTitleControl.prototype.setTooltip = function(sValue){
    this.setProperty("taskTitle", sValue, true /*no re-rendering of whole search field needed*/);
    this.getAggregation("titleLink").setTooltip(sValue); // Note: this triggers re-rendering of text field!
};