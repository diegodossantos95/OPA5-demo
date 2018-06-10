/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.uiext.inbox.composite.InboxUploadAttachmentTile.
jQuery.sap.declare("sap.uiext.inbox.composite.InboxUploadAttachmentTile");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new composite/InboxUploadAttachmentTile.
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
 * <li>{@link #getFileTypeIcon fileTypeIcon} : sap.ui.core.URI</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.uiext.inbox.composite.InboxUploadAttachmentTile#event:uploadSelectedFile uploadSelectedFile} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxUploadAttachmentTile
 * @extends sap.ui.core.Control
 * @version 1.50.6
 *
 * @constructor
 * @public
 * @name sap.uiext.inbox.composite.InboxUploadAttachmentTile
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxUploadAttachmentTile", { metadata : {

	library : "sap.uiext.inbox",
	properties : {

		/**
		 * name of the selected file
		 */
		"fileName" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * icon URI of the selected file type
		 */
		"fileTypeIcon" : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null}
	},
	events : {

		/**
		 * event is fired when upload for selected file is requested
		 */
		"uploadSelectedFile" : {}
	}
}});


/**
 * Creates a new subclass of class sap.uiext.inbox.composite.InboxUploadAttachmentTile with name <code>sClassName</code> 
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
 * @name sap.uiext.inbox.composite.InboxUploadAttachmentTile.extend
 * @function
 */

sap.uiext.inbox.composite.InboxUploadAttachmentTile.M_EVENTS = {'uploadSelectedFile':'uploadSelectedFile'};


/**
 * Getter for property <code>fileName</code>.
 * name of the selected file
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>fileName</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxUploadAttachmentTile#getFileName
 * @function
 */

/**
 * Setter for property <code>fileName</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sFileName  new value for property <code>fileName</code>
 * @return {sap.uiext.inbox.composite.InboxUploadAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxUploadAttachmentTile#setFileName
 * @function
 */


/**
 * Getter for property <code>fileTypeIcon</code>.
 * icon URI of the selected file type
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.URI} the value of property <code>fileTypeIcon</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxUploadAttachmentTile#getFileTypeIcon
 * @function
 */

/**
 * Setter for property <code>fileTypeIcon</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.URI} sFileTypeIcon  new value for property <code>fileTypeIcon</code>
 * @return {sap.uiext.inbox.composite.InboxUploadAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxUploadAttachmentTile#setFileTypeIcon
 * @function
 */


/**
 * event is fired when upload for selected file is requested
 *
 * @name sap.uiext.inbox.composite.InboxUploadAttachmentTile#uploadSelectedFile
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'uploadSelectedFile' event of this <code>sap.uiext.inbox.composite.InboxUploadAttachmentTile</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.uiext.inbox.composite.InboxUploadAttachmentTile</code>.<br/> itself. 
 *  
 * event is fired when upload for selected file is requested
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.uiext.inbox.composite.InboxUploadAttachmentTile</code>.<br/> itself.
 *
 * @return {sap.uiext.inbox.composite.InboxUploadAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxUploadAttachmentTile#attachUploadSelectedFile
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'uploadSelectedFile' event of this <code>sap.uiext.inbox.composite.InboxUploadAttachmentTile</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.uiext.inbox.composite.InboxUploadAttachmentTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxUploadAttachmentTile#detachUploadSelectedFile
 * @function
 */

/**
 * Fire event uploadSelectedFile to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.uiext.inbox.composite.InboxUploadAttachmentTile} <code>this</code> to allow method chaining
 * @protected
 * @name sap.uiext.inbox.composite.InboxUploadAttachmentTile#fireUploadSelectedFile
 * @function
 */

// Start of sap/uiext/inbox/composite/InboxUploadAttachmentTile.js
/*!
 * @copyright@
 */

sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.init = function(){
	var that = this;
	this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
	
	this.oUploadButton = new sap.ui.commons.Button({
		tooltip : that._oBundle.getText("INBOX_UPLOAD_ATTACHMENT"),
		text : that._oBundle.getText("INBOX_UPLOAD_ATTACHMENT_TOOLTIP")
	});
	
	/*this.oTextField = new sap.ui.commons.TextField({
		tooltip : that._oBundle.getText("INBOX_ATTACHMENT_DESCRIPTION"),
		placeholder : that._oBundle.getText("INBOX_ATTACHMENT_DESCRIPTION_TOOLTIP"),
		width : "160px"
	});*/
	
	this.oCancelButton = new sap.ui.commons.Button({
		text : that._oBundle.getText("INBOX_CANCEL_TEXT"),
		tooltip : that._oBundle.getText("INBOX_CANCEL_TEXT"),
	});
};

sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.onAfterRendering = function(){
	var oFocusRef = this.oUploadButton.getFocusDomRef();
	if (oFocusRef) {
		jQuery.sap.focus(oFocusRef);
	}
};

sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.getUploadButton = function(){
	return this.oUploadButton;
};

sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.getCancelButton = function(){
	return this.oCancelButton;
};

/*sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.getTextField = function(){
	return this.oTextField;
};*/