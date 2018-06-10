/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.uiext.inbox.InboxLaunchPad.
jQuery.sap.declare("sap.uiext.inbox.InboxLaunchPad");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new InboxLaunchPad.
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
 * <li>{@link #getTitle title} : string (default: 'Inbox Launch Pad Title')</li>
 * <li>{@link #getLogoSrc logoSrc} : string</li>
 * <li>{@link #getShowLogoutButton showLogoutButton} : boolean (default: true)</li>
 * <li>{@link #getShowUserName showUserName} : boolean (default: true)</li>
 * <li>{@link #getUserName userName} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.uiext.inbox.InboxLaunchPad#event:tileSelected tileSelected} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.uiext.inbox.InboxLaunchPad#event:logout logout} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxLaunchPad Documentation to be updated later
 * @extends sap.ui.core.Control
 * @version 1.50.6
 *
 * @constructor
 * @public
 * @experimental Since version 1.7.0. 
 * API is not yet finished and might change completely
 * @name sap.uiext.inbox.InboxLaunchPad
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.InboxLaunchPad", { metadata : {

	deprecated : true,
	library : "sap.uiext.inbox",
	properties : {

		/**
		 * The title text appearing in Inbox LaunchPad header bar.
		 */
		"title" : {type : "string", group : "", defaultValue : 'Inbox Launch Pad Title'},

		/**
		 * Path (src) to the logo icon to be displayed in the Inbox LaunchPad header.
		 */
		"logoSrc" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Property to indicate whether the Logoff button in the header should be displayed or not. Default value is true.
		 */
		"showLogoutButton" : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * Property to indicate whether loggod on User's Name in the header should be displayed or not. Default value is true.
		 */
		"showUserName" : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * User name to be shown in the header.
		 */
		"userName" : {type : "string", group : "Misc", defaultValue : null}
	},
	aggregations : {

		/**
		 * Hidden aggregation to contain the Inbox LaunchPad header.
		 */
		"launchPadHeader" : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}, 

		/**
		 * Hidden aggregation to contain the Inbox LaunchPad tile container.
		 */
		"launchPadTileContainer" : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}
	},
	events : {

		/**
		 * Fires an event when a tile is selected in Inbox LaunchPad.
		 */
		"tileSelected" : {}, 

		/**
		 * Fired when the user clicks the "Log-off" button.
		 */
		"logout" : {}
	}
}});


/**
 * Creates a new subclass of class sap.uiext.inbox.InboxLaunchPad with name <code>sClassName</code> 
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
 * @name sap.uiext.inbox.InboxLaunchPad.extend
 * @function
 */

sap.uiext.inbox.InboxLaunchPad.M_EVENTS = {'tileSelected':'tileSelected','logout':'logout'};


/**
 * Getter for property <code>title</code>.
 * The title text appearing in Inbox LaunchPad header bar.
 *
 * Default value is <code>Inbox Launch Pad Title</code>
 *
 * @return {string} the value of property <code>title</code>
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#getTitle
 * @function
 */

/**
 * Setter for property <code>title</code>.
 *
 * Default value is <code>Inbox Launch Pad Title</code> 
 *
 * @param {string} sTitle  new value for property <code>title</code>
 * @return {sap.uiext.inbox.InboxLaunchPad} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#setTitle
 * @function
 */


/**
 * Getter for property <code>logoSrc</code>.
 * Path (src) to the logo icon to be displayed in the Inbox LaunchPad header.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>logoSrc</code>
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#getLogoSrc
 * @function
 */

/**
 * Setter for property <code>logoSrc</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sLogoSrc  new value for property <code>logoSrc</code>
 * @return {sap.uiext.inbox.InboxLaunchPad} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#setLogoSrc
 * @function
 */


/**
 * Getter for property <code>showLogoutButton</code>.
 * Property to indicate whether the Logoff button in the header should be displayed or not. Default value is true.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showLogoutButton</code>
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#getShowLogoutButton
 * @function
 */

/**
 * Setter for property <code>showLogoutButton</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowLogoutButton  new value for property <code>showLogoutButton</code>
 * @return {sap.uiext.inbox.InboxLaunchPad} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#setShowLogoutButton
 * @function
 */


/**
 * Getter for property <code>showUserName</code>.
 * Property to indicate whether loggod on User's Name in the header should be displayed or not. Default value is true.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showUserName</code>
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#getShowUserName
 * @function
 */

/**
 * Setter for property <code>showUserName</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowUserName  new value for property <code>showUserName</code>
 * @return {sap.uiext.inbox.InboxLaunchPad} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#setShowUserName
 * @function
 */


/**
 * Getter for property <code>userName</code>.
 * User name to be shown in the header.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>userName</code>
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#getUserName
 * @function
 */

/**
 * Setter for property <code>userName</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sUserName  new value for property <code>userName</code>
 * @return {sap.uiext.inbox.InboxLaunchPad} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#setUserName
 * @function
 */


/**
 * Fires an event when a tile is selected in Inbox LaunchPad.
 *
 * @name sap.uiext.inbox.InboxLaunchPad#tileSelected
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'tileSelected' event of this <code>sap.uiext.inbox.InboxLaunchPad</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.uiext.inbox.InboxLaunchPad</code>.<br/> itself. 
 *  
 * Fires an event when a tile is selected in Inbox LaunchPad.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.uiext.inbox.InboxLaunchPad</code>.<br/> itself.
 *
 * @return {sap.uiext.inbox.InboxLaunchPad} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#attachTileSelected
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'tileSelected' event of this <code>sap.uiext.inbox.InboxLaunchPad</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.uiext.inbox.InboxLaunchPad} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#detachTileSelected
 * @function
 */

/**
 * Fire event tileSelected to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.uiext.inbox.InboxLaunchPad} <code>this</code> to allow method chaining
 * @protected
 * @name sap.uiext.inbox.InboxLaunchPad#fireTileSelected
 * @function
 */


/**
 * Fired when the user clicks the "Log-off" button.
 *
 * @name sap.uiext.inbox.InboxLaunchPad#logout
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'logout' event of this <code>sap.uiext.inbox.InboxLaunchPad</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.uiext.inbox.InboxLaunchPad</code>.<br/> itself. 
 *  
 * Fired when the user clicks the "Log-off" button.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.uiext.inbox.InboxLaunchPad</code>.<br/> itself.
 *
 * @return {sap.uiext.inbox.InboxLaunchPad} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#attachLogout
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'logout' event of this <code>sap.uiext.inbox.InboxLaunchPad</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.uiext.inbox.InboxLaunchPad} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxLaunchPad#detachLogout
 * @function
 */

/**
 * Fire event logout to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.uiext.inbox.InboxLaunchPad} <code>this</code> to allow method chaining
 * @protected
 * @name sap.uiext.inbox.InboxLaunchPad#fireLogout
 * @function
 */

// Start of sap/uiext/inbox/InboxLaunchPad.js
/*!
 * @copyright@
 * @deprecated Since version 1.38.0
 */

/*global OData */// declare unusual global vars for JSLint/SAPUI5 validation
///**
//* This file defines behavior for the control,
//*/
jQuery.sap.require("sap.ui.core.IconPool");
jQuery.sap.require("sap.uiext.inbox.InboxTile");

sap.uiext.inbox.InboxLaunchPad.prototype.init = function() {
	var that = this;
	this.oCore = sap.ui.getCore();
	this._oBundle = this.oCore.getLibraryResourceBundle("sap.uiext.inbox");
	this.setAggregation("launchPadHeader", new sap.m.Bar("mbar", {
		contentMiddle : [ new sap.m.Label({
			text : this.getTitle()
		}) ],
		contentRight : [ new sap.m.Button({
			icon : sap.ui.core.IconPool.getIconURI("person-placeholder"),
			tooltip : this.getUserName(),
			type : sap.m.ButtonType.Transparent 
		}),new sap.m.Button({
			tooltip : that._oBundle.getText("INBOX_LP_LOGOFF_TOOLTIP"),
			icon : sap.ui.core.IconPool.getIconURI("log"),
			type : sap.m.ButtonType.Default
		}).attachPress(function() {
			that.fireLogout();
		})],
		contentLeft : [ new sap.m.Image({
			src : this.getLogoSrc()
		}).addStyleClass("logo") ]})
	);
	var tileTemplate = new sap.uiext.inbox.InboxTile({
		icon : "sap-icon://task",
		title : "{name}",
		number : "{numberOfTasks}"
	}).data("defID", "{defID}").attachPress(function(oEvent) {
		that.fireTileSelected({
			"defID" : this.data("defID")
		});
	});

	this.setAggregation("launchPadTileContainer", new sap.m.TileContainer({
		editable : false,
		allowAdd : false,
		tiles : {
			path : "/Tasks",
			template : tileTemplate
		}
	}));
};

sap.uiext.inbox.InboxLaunchPad.prototype.setTitle = function(sTitle) {
	this.setProperty("title", sTitle, true);
	this.getAggregation("launchPadHeader").destroyContentMiddle()
			.addContentMiddle(new sap.m.Label({
				text : this.getTitle()
			}));
	return this;
};

sap.uiext.inbox.InboxLaunchPad.prototype.setUserName = function(sUserName) {
	if (sUserName !== undefined) {
		this.getAggregation("launchPadHeader").getContentRight()[0].setTooltip(sUserName);
	}
	return this;
};

sap.uiext.inbox.InboxLaunchPad.prototype.setShowUserName = function(bShow) {
	if (bShow === true) {
		this.getAggregation("launchPadHeader").getContentRight()[0]
				.setVisible(true);
	} else {
		this.getAggregation("launchPadHeader").getContentRight()[0]
				.setVisible(false);
	}
	return this;
};

sap.uiext.inbox.InboxLaunchPad.prototype.setShowLogoutButton = function(bShow) {
	if (bShow === true) {
		this.getAggregation("launchPadHeader").getContentRight()[1]
				.setVisible(true);
	} else {
		this.getAggregation("launchPadHeader").getContentRight()[1]
				.setVisible(false);
	}
	return this;
};

sap.uiext.inbox.InboxLaunchPad.prototype.setLogoSrc = function(sLogoSrc) {
	this.setProperty("logoSrc", sLogoSrc, true);
	this.getAggregation("launchPadHeader").destroyContentLeft().addContentLeft(
			new sap.m.Image({
				src : this.getLogoSrc()
			}).addStyleClass("logo"));
	return this;
};
