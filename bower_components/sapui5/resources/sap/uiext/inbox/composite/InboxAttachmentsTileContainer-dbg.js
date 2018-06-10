/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.uiext.inbox.composite.InboxAttachmentsTileContainer.
jQuery.sap.declare("sap.uiext.inbox.composite.InboxAttachmentsTileContainer");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new composite/InboxAttachmentsTileContainer.
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
 * <li>{@link #getUploadUrl uploadUrl} : string</li>
 * <li>{@link #getFileName fileName} : string</li>
 * <li>{@link #getFileType fileType} : string</li>
 * <li>{@link #getIsFileSelected isFileSelected} : boolean</li>
 * <li>{@link #getEnteredDescription enteredDescription} : string</li>
 * <li>{@link #getShowAddTile showAddTile} : boolean (default: true)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getAttachments attachments} : sap.uiext.inbox.composite.InboxAttachmentTile[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.uiext.inbox.composite.InboxAttachmentsTileContainer#event:uploadButtonPress uploadButtonPress} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.uiext.inbox.composite.InboxAttachmentsTileContainer#event:uploadSuccess uploadSuccess} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.uiext.inbox.composite.InboxAttachmentsTileContainer#event:uploadFailed uploadFailed} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxAttachmentsTileContainer
 * @extends sap.ui.core.Control
 * @version 1.50.6
 *
 * @constructor
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxAttachmentsTileContainer", { metadata : {

	publicMethods : [
		// methods
		"addUploadHeader", "removeUploadHeader"
	],
	library : "sap.uiext.inbox",
	properties : {

		/**
		 * URL to upload the selected file
		 */
		"uploadUrl" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * name of the selected file for uploading
		 */
		"fileName" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * type of the selected file for uploading
		 */
		"fileType" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * boolean property to indicate if user has selected a file to upload
		 */
		"isFileSelected" : {type : "boolean", group : "Misc", defaultValue : null},

		/**
		 * description string entered by user while uploading a file
		 */
		"enteredDescription" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * boolean value to indicate whether to show Add Attachment tile
		 */
		"showAddTile" : {type : "boolean", group : "Misc", defaultValue : true}
	},
	aggregations : {

		/**
		 * aggregation for attachments tile
		 */
		"attachments" : {type : "sap.uiext.inbox.composite.InboxAttachmentTile", multiple : true, singularName : "attachment"}, 

		/**
		 * aggregation for the first tile in tile container
		 */
		"firstTile" : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}
	},
	events : {

		/**
		 * event is fired to add all the header parameters just before uploading a file
		 */
		"uploadButtonPress" : {}, 

		/**
		 * event is fired when uploading a file is completed successfully
		 */
		"uploadSuccess" : {}, 

		/**
		 * event is fired when uploading a file has failed
		 */
		"uploadFailed" : {}
	}
}});


/**
 * Creates a new subclass of class sap.uiext.inbox.composite.InboxAttachmentsTileContainer with name <code>sClassName</code> 
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
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer.extend
 * @function
 */

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.M_EVENTS = {'uploadButtonPress':'uploadButtonPress','uploadSuccess':'uploadSuccess','uploadFailed':'uploadFailed'};


/**
 * Getter for property <code>uploadUrl</code>.
 * URL to upload the selected file
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>uploadUrl</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#getUploadUrl
 * @function
 */

/**
 * Setter for property <code>uploadUrl</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sUploadUrl  new value for property <code>uploadUrl</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#setUploadUrl
 * @function
 */


/**
 * Getter for property <code>fileName</code>.
 * name of the selected file for uploading
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>fileName</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#getFileName
 * @function
 */

/**
 * Setter for property <code>fileName</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sFileName  new value for property <code>fileName</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#setFileName
 * @function
 */


/**
 * Getter for property <code>fileType</code>.
 * type of the selected file for uploading
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>fileType</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#getFileType
 * @function
 */

/**
 * Setter for property <code>fileType</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sFileType  new value for property <code>fileType</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#setFileType
 * @function
 */


/**
 * Getter for property <code>isFileSelected</code>.
 * boolean property to indicate if user has selected a file to upload
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {boolean} the value of property <code>isFileSelected</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#getIsFileSelected
 * @function
 */

/**
 * Setter for property <code>isFileSelected</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {boolean} bIsFileSelected  new value for property <code>isFileSelected</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#setIsFileSelected
 * @function
 */


/**
 * Getter for property <code>enteredDescription</code>.
 * description string entered by user while uploading a file
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>enteredDescription</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#getEnteredDescription
 * @function
 */

/**
 * Setter for property <code>enteredDescription</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sEnteredDescription  new value for property <code>enteredDescription</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#setEnteredDescription
 * @function
 */


/**
 * Getter for property <code>showAddTile</code>.
 * boolean value to indicate whether to show Add Attachment tile
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showAddTile</code>
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#getShowAddTile
 * @function
 */

/**
 * Setter for property <code>showAddTile</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowAddTile  new value for property <code>showAddTile</code>
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#setShowAddTile
 * @function
 */


/**
 * Getter for aggregation <code>attachments</code>.<br/>
 * aggregation for attachments tile
 * 
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile[]}
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#getAttachments
 * @function
 */


/**
 * Inserts a attachment into the aggregation named <code>attachments</code>.
 *
 * @param {sap.uiext.inbox.composite.InboxAttachmentTile}
 *          oAttachment the attachment to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the attachment should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the attachment is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the attachment is inserted at 
 *             the last position        
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#insertAttachment
 * @function
 */

/**
 * Adds some attachment <code>oAttachment</code> 
 * to the aggregation named <code>attachments</code>.
 *
 * @param {sap.uiext.inbox.composite.InboxAttachmentTile}
 *            oAttachment the attachment to add; if empty, nothing is inserted
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#addAttachment
 * @function
 */

/**
 * Removes an attachment from the aggregation named <code>attachments</code>.
 *
 * @param {int | string | sap.uiext.inbox.composite.InboxAttachmentTile} vAttachment the attachment to remove or its index or id
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile} the removed attachment or null
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#removeAttachment
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>attachments</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.uiext.inbox.composite.InboxAttachmentTile[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#removeAllAttachments
 * @function
 */

/**
 * Checks for the provided <code>sap.uiext.inbox.composite.InboxAttachmentTile</code> in the aggregation named <code>attachments</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.uiext.inbox.composite.InboxAttachmentTile}
 *            oAttachment the attachment whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#indexOfAttachment
 * @function
 */
	

/**
 * Destroys all the attachments in the aggregation 
 * named <code>attachments</code>.
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#destroyAttachments
 * @function
 */


/**
 * event is fired to add all the header parameters just before uploading a file
 *
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#uploadButtonPress
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'uploadButtonPress' event of this <code>sap.uiext.inbox.composite.InboxAttachmentsTileContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.uiext.inbox.composite.InboxAttachmentsTileContainer</code>.<br/> itself. 
 *  
 * event is fired to add all the header parameters just before uploading a file
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.uiext.inbox.composite.InboxAttachmentsTileContainer</code>.<br/> itself.
 *
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#attachUploadButtonPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'uploadButtonPress' event of this <code>sap.uiext.inbox.composite.InboxAttachmentsTileContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#detachUploadButtonPress
 * @function
 */

/**
 * Fire event uploadButtonPress to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#fireUploadButtonPress
 * @function
 */


/**
 * event is fired when uploading a file is completed successfully
 *
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#uploadSuccess
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'uploadSuccess' event of this <code>sap.uiext.inbox.composite.InboxAttachmentsTileContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.uiext.inbox.composite.InboxAttachmentsTileContainer</code>.<br/> itself. 
 *  
 * event is fired when uploading a file is completed successfully
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.uiext.inbox.composite.InboxAttachmentsTileContainer</code>.<br/> itself.
 *
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#attachUploadSuccess
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'uploadSuccess' event of this <code>sap.uiext.inbox.composite.InboxAttachmentsTileContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#detachUploadSuccess
 * @function
 */

/**
 * Fire event uploadSuccess to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#fireUploadSuccess
 * @function
 */


/**
 * event is fired when uploading a file has failed
 *
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#uploadFailed
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'uploadFailed' event of this <code>sap.uiext.inbox.composite.InboxAttachmentsTileContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.uiext.inbox.composite.InboxAttachmentsTileContainer</code>.<br/> itself. 
 *  
 * event is fired when uploading a file has failed
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.uiext.inbox.composite.InboxAttachmentsTileContainer</code>.<br/> itself.
 *
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#attachUploadFailed
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'uploadFailed' event of this <code>sap.uiext.inbox.composite.InboxAttachmentsTileContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#detachUploadFailed
 * @function
 */

/**
 * Fire event uploadFailed to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.uiext.inbox.composite.InboxAttachmentsTileContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#fireUploadFailed
 * @function
 */


/**
 * method to add a header parameter while uploading a file. This method takes header name and header value as input.
 *
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#addUploadHeader
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * method to remove a headerParameter of fileUploader
 *
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer#removeUploadHeader
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/uiext/inbox/composite/InboxAttachmentsTileContainer.js
/*!
 * @copyright@
 */

jQuery.sap.require("sap.uiext.inbox.composite.InboxAttachmentFileUploader");
jQuery.sap.require("sap.uiext.inbox.InboxUtils");
jQuery.sap.require("sap.ui.commons.MessageBox");

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.init = function(){

	var that = this;
	this.oUtils = sap.uiext.inbox.InboxUtils;
	this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
	
	this.oAddAttachmentTile = new sap.uiext.inbox.composite.InboxAddAttachmentTile();
	this.setAggregation("firstTile", this.oAddAttachmentTile);

	this.oUploadAttachmentTile = new sap.uiext.inbox.composite.InboxUploadAttachmentTile();
	
	this.oUploadAttachmentTile.getUploadButton().attachPress(function(oEvent) {
		that.getAggregation("firstTile").setBusy(true);
		that.fireUploadButtonPress();
	});
	
	this.oUploadAttachmentTile.getCancelButton().attachPress(function(oEvent) {
		that.resetFileUploader();
		that.resetFirstTile();
	});
	
	this.oFileUploader = new sap.uiext.inbox.composite.InboxAttachmentFileUploader({
		sendXHR : true,
		
		change : jQuery.proxy(function(oEvent) {
			this.oFileUploader.setUploadUrl(this.getUploadUrl());
			var oFile = this.oFileUploader.oFileUpload.files[0];
			if(oFile && oFile.size === 0){
				this.oFileUploader.setValue("");
				sap.ui.commons.MessageBox.alert(that._oBundle.getText("SIZE_ZERO_ATTACHMENT_ALERT"));
			}
			else{
				this.oUploadAttachmentTile.setFileName(oFile.name).setFileTypeIcon(this.oUtils._getFileTypeIcon(oFile.type));
				this.setAggregation("firstTile", this.oUploadAttachmentTile);
			}
			
		}, this),
		
		uploadComplete : function(oEvent) {
			var statusCode = oEvent.getParameter("status");
			if (statusCode && statusCode == 201) {
				that.fireUploadSuccess({
					"attachmentResponse": oEvent.getParameter("response"), 
					"statusCode": statusCode, 
					"headerParameters": oEvent.getParameter("headerParameters")
				});
			} else {
				that.fireUploadFailed({
					"attachmentResponse": oEvent.getParameter("response"),
					"statusCode": statusCode,
					"securityToken": oEvent.getParameter("x-csrf-token"),
					"headerParameters": oEvent.getParameter("headerParameters")
				});
			}
			that.resetFileUploader();
			that.resetFirstTile();
		}
		
	});
	
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.onclick = function(oEvent){
	if (oEvent.target.id === this.getAggregation("firstTile").getId() + "_textAddAttachment") {
			jQuery.sap.byId(this.oFileUploader.getId() + "-fu").trigger("click");
		}
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.getFileName = function() {
	if (this.getIsFileSelected()) {
		return this.oFileUploader.oFileUpload.files[0].name;
	}
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.getFileType = function() {
	if (this.getIsFileSelected()) {
		return this.oFileUploader.oFileUpload.files[0].type;
	}
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.addUploadHeader = function(sHeaderName, sHeaderValue) {
	this.oFileUploader.addHeaderParameter(new sap.ui.commons.FileUploaderParameter({name: sHeaderName, value: sHeaderValue}));
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.getIsFileSelected = function() {
	return this.oFileUploader.oFileUpload.files.length>0;
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.resetFileUploader = function() {
	this.oFileUploader.setValue("").destroyHeaderParameters();
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.resetFirstTile = function() {
	this.getAggregation("firstTile").setBusy(false);
	this.setAggregation("firstTile", this.oAddAttachmentTile);
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.triggerUpload = function(oEvent){
	this.oFileUploader.upload();
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.removeUploadHeader = function(sHeaderParameter) {
	var that = this;
	jQuery.each(this.oFileUploader.getHeaderParameters(), function(i, oHeader) {
		if (oHeader.getName() === sHeaderParameter)
			that.oFileUploader.removeHeaderParameter(oHeader);
	});
};

/*sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.getEnteredDescription = function() {
	return this.oUploadAttachmentTile.getTextField().getLiveValue();
};
*/