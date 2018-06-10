/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.uiext.inbox.composite.InboxAttachmentTile.
jQuery.sap.declare("sap.uiext.inbox.composite.InboxAttachmentTile");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new composite/InboxAttachmentTile.
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
 * <li>{@link #getFileName fileName} : string</li>
 * <li>{@link #getFileSize fileSize} : string</li>
 * <li>{@link #getFileDescription fileDescription} : string</li>
 * <li>{@link #getFileTypeIcon fileTypeIcon} : sap.ui.core.URI</li>
 * <li>{@link #getCreationDate creationDate} : string</li>
 * <li>{@link #getDownloadUrl downloadUrl} : string</li>
 * <li>{@link #getCreatedBy createdBy} : string</li>
 * <li>{@link #getShowDeleteButton showDeleteButton} : boolean (default: true)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.uiext.inbox.composite.InboxAttachmentTile#event:deleteAttachment deleteAttachment} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxAttachmentTile
 * @extends sap.ui.core.Control
 * @version 1.50.6
 *
 * @constructor
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxAttachmentTile", { metadata : {

	library : "sap.uiext.inbox",
	properties : {

		/**
		 * Name of the attachment
		 */
		"fileName" : {type : "string", group : "", defaultValue : null},

		/**
		 * size of the attachment
		 */
		"fileSize" : {type : "string", group : "", defaultValue : null},

		/**
		 * description of the attachment
		 */
		"fileDescription" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Icon URI of the file type
		 */
		"fileTypeIcon" : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},

		/**
		 * creation date of the attachment
		 */
		"creationDate" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * URL for attachment title link to download the attachment.
		 */
		"downloadUrl" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * name of the user who has uploaded attachment
		 */
		"createdBy" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * boolean value to indicate whether to show delete button
		 */
		"showDeleteButton" : {type : "boolean", group : "Misc", defaultValue : true}
	},
	events : {

		/**
		 * fire this event to delete the attachment
		 */
		"deleteAttachment" : {}
	}
}});


/**
 * Creates a new subclass of class sap.uiext.inbox.composite.InboxAttachmentTile with name <code>sClassName</code> 
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
 * @name sap.uiext.inbox.composite.InboxAttachmentTile.extend
 * @function
 */

sap.uiext.inbox.composite.InboxAttachmentTile.M_EVENTS = {'deleteAttachment':'deleteAttachment'};


/**
 * Getter for property <code>fileName</code>.
 * Name of the attachment
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>fileName</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#getFileName
 * @function
 */

/**
 * Setter for property <code>fileName</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sFileName  new value for property <code>fileName</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#setFileName
 * @function
 */


/**
 * Getter for property <code>fileSize</code>.
 * size of the attachment
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>fileSize</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#getFileSize
 * @function
 */

/**
 * Setter for property <code>fileSize</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sFileSize  new value for property <code>fileSize</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#setFileSize
 * @function
 */


/**
 * Getter for property <code>fileDescription</code>.
 * description of the attachment
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>fileDescription</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#getFileDescription
 * @function
 */

/**
 * Setter for property <code>fileDescription</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sFileDescription  new value for property <code>fileDescription</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#setFileDescription
 * @function
 */


/**
 * Getter for property <code>fileTypeIcon</code>.
 * Icon URI of the file type
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.URI} the value of property <code>fileTypeIcon</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#getFileTypeIcon
 * @function
 */

/**
 * Setter for property <code>fileTypeIcon</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.URI} sFileTypeIcon  new value for property <code>fileTypeIcon</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#setFileTypeIcon
 * @function
 */


/**
 * Getter for property <code>creationDate</code>.
 * creation date of the attachment
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>creationDate</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#getCreationDate
 * @function
 */

/**
 * Setter for property <code>creationDate</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sCreationDate  new value for property <code>creationDate</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#setCreationDate
 * @function
 */


/**
 * Getter for property <code>downloadUrl</code>.
 * URL for attachment title link to download the attachment.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>downloadUrl</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#getDownloadUrl
 * @function
 */

/**
 * Setter for property <code>downloadUrl</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDownloadUrl  new value for property <code>downloadUrl</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#setDownloadUrl
 * @function
 */


/**
 * Getter for property <code>createdBy</code>.
 * name of the user who has uploaded attachment
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>createdBy</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#getCreatedBy
 * @function
 */

/**
 * Setter for property <code>createdBy</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sCreatedBy  new value for property <code>createdBy</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#setCreatedBy
 * @function
 */


/**
 * Getter for property <code>showDeleteButton</code>.
 * boolean value to indicate whether to show delete button
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showDeleteButton</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#getShowDeleteButton
 * @function
 */

/**
 * Setter for property <code>showDeleteButton</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowDeleteButton  new value for property <code>showDeleteButton</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#setShowDeleteButton
 * @function
 */


/**
 * fire this event to delete the attachment
 *
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#deleteAttachment
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'deleteAttachment' event of this <code>sap.uiext.inbox.composite.InboxAttachmentTile</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.uiext.inbox.composite.InboxAttachmentTile</code>.<br/> itself. 
 *  
 * fire this event to delete the attachment
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.uiext.inbox.composite.InboxAttachmentTile</code>.<br/> itself.
 *
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#attachDeleteAttachment
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'deleteAttachment' event of this <code>sap.uiext.inbox.composite.InboxAttachmentTile</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#detachDeleteAttachment
 * @function
 */

/**
 * Fire event deleteAttachment to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile} <code>this</code> to allow method chaining
 * @protected
 * @name sap.uiext.inbox.composite.InboxAttachmentTile#fireDeleteAttachment
 * @function
 */

// Start of sap/uiext/inbox/composite/InboxAttachmentTile.js
/*!
 * @copyright@
 */
 
sap.uiext.inbox.composite.InboxAttachmentTile.prototype.init = function(){
	this.oCore = sap.ui.getCore();
	this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
};

sap.uiext.inbox.composite.InboxAttachmentTile.prototype.onclick = function(oEvent){
	var sTargetId = oEvent.target.getAttribute( 'ID' );

};
