/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.internal.HeaderList.
jQuery.sap.declare("sap.landvisz.internal.HeaderList");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new internal/HeaderList.
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
 * <li>{@link #getHeaderTooltip headerTooltip} : string</li>
 * <li>{@link #getEntitySize entitySize} : string</li>
 * <li>{@link #getSelected selected} : boolean (default: false)</li>
 * <li>{@link #getType type} : sap.landvisz.LandscapeObject</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.landvisz.internal.HeaderList#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A control to render headers of a control
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.internal.HeaderList
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.internal.HeaderList", { metadata : {

	library : "sap.landvisz",
	properties : {
		"headerTooltip" : {type : "string", group : "Data", defaultValue : null},
		"entitySize" : {type : "string", group : "Dimension", defaultValue : null},
		"selected" : {type : "boolean", group : "Identification", defaultValue : false},
		"type" : {type : "sap.landvisz.LandscapeObject", group : "Identification", defaultValue : null}
	},
	events : {
		"press" : {}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.internal.HeaderList with name <code>sClassName</code> 
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
 * @name sap.landvisz.internal.HeaderList.extend
 * @function
 */

sap.landvisz.internal.HeaderList.M_EVENTS = {'press':'press'};


/**
 * Getter for property <code>headerTooltip</code>.
 * ToolTip for headers
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>headerTooltip</code>
 * @public
 * @name sap.landvisz.internal.HeaderList#getHeaderTooltip
 * @function
 */

/**
 * Setter for property <code>headerTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sHeaderTooltip  new value for property <code>headerTooltip</code>
 * @return {sap.landvisz.internal.HeaderList} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.HeaderList#setHeaderTooltip
 * @function
 */


/**
 * Getter for property <code>entitySize</code>.
 * Size of the headers
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>entitySize</code>
 * @public
 * @name sap.landvisz.internal.HeaderList#getEntitySize
 * @function
 */

/**
 * Setter for property <code>entitySize</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sEntitySize  new value for property <code>entitySize</code>
 * @return {sap.landvisz.internal.HeaderList} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.HeaderList#setEntitySize
 * @function
 */


/**
 * Getter for property <code>selected</code>.
 * to select/deselect a header
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>selected</code>
 * @public
 * @name sap.landvisz.internal.HeaderList#getSelected
 * @function
 */

/**
 * Setter for property <code>selected</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bSelected  new value for property <code>selected</code>
 * @return {sap.landvisz.internal.HeaderList} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.HeaderList#setSelected
 * @function
 */


/**
 * Getter for property <code>type</code>.
 * type of system
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.landvisz.LandscapeObject} the value of property <code>type</code>
 * @public
 * @name sap.landvisz.internal.HeaderList#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.landvisz.LandscapeObject} oType  new value for property <code>type</code>
 * @return {sap.landvisz.internal.HeaderList} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.HeaderList#setType
 * @function
 */


/**
 * Event triggered when header is clicked
 *
 * @name sap.landvisz.internal.HeaderList#press
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'press' event of this <code>sap.landvisz.internal.HeaderList</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.internal.HeaderList</code>.<br/> itself. 
 *  
 * Event triggered when header is clicked
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.internal.HeaderList</code>.<br/> itself.
 *
 * @return {sap.landvisz.internal.HeaderList} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.HeaderList#attachPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'press' event of this <code>sap.landvisz.internal.HeaderList</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.internal.HeaderList} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.HeaderList#detachPress
 * @function
 */

/**
 * Fire event press to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.internal.HeaderList} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.internal.HeaderList#firePress
 * @function
 */

// Start of sap/landvisz/internal/HeaderList.js
///**
// * This file defines behavior for the control,
// */

sap.landvisz.internal.HeaderList.prototype.init = function() {

	this.initializationDone = false;
	this.lastBtn = true;
	this.onFocus = true;
	this.inDisplay = false;

};

sap.landvisz.internal.HeaderList.prototype.exit = function() {

	this.customAction && this.customAction.destroy();
	this.oToolBarBtn && this.oToolBarBtn.destroy();
	this.oActToolBar && this.oActToolBar.destroy();

};

sap.landvisz.internal.HeaderList.prototype.initControls = function() {
	this.oToolBarBtn;
	this.oActToolBar;
	this.oHLayoutBtn;
	this.parentContainer;
	this.headerWidth;
	this.btnEventController;

};

/**
 * Rerendering handling
 * 
 * @private
 */

sap.landvisz.internal.HeaderList.prototype.press = function(oEvent) {
	this.firePress();
};

sap.landvisz.internal.HeaderList.prototype.onclick = function(oEvent) {
	this.firePress();
};

/**
 * Handles the sapenter event does not bubble
 *
 * @param {jQuery.Event} oEvent
 * @private
 */
sap.landvisz.internal.HeaderList.prototype.onsapenter = function(oEvent) {
	this.firePress();
};