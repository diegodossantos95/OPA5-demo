/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.internal.EntityAction.
jQuery.sap.declare("sap.landvisz.internal.EntityAction");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new internal/EntityAction.
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
 * <li>{@link #getActionTooltip actionTooltip} : string</li>
 * <li>{@link #getIconSrc iconSrc} : sap.ui.core.URI</li>
 * <li>{@link #getRenderingSize renderingSize} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.landvisz.internal.EntityAction#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A control to specify entity actions
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.internal.EntityAction
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.internal.EntityAction", { metadata : {

	library : "sap.landvisz",
	properties : {
		"actionTooltip" : {type : "string", group : "Data", defaultValue : null},
		"iconSrc" : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},
		"renderingSize" : {type : "string", group : "Dimension", defaultValue : null}
	},
	events : {
		"press" : {}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.internal.EntityAction with name <code>sClassName</code> 
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
 * @name sap.landvisz.internal.EntityAction.extend
 * @function
 */

sap.landvisz.internal.EntityAction.M_EVENTS = {'press':'press'};


/**
 * Getter for property <code>actionTooltip</code>.
 * Tooltip for the internal action
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>actionTooltip</code>
 * @public
 * @name sap.landvisz.internal.EntityAction#getActionTooltip
 * @function
 */

/**
 * Setter for property <code>actionTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sActionTooltip  new value for property <code>actionTooltip</code>
 * @return {sap.landvisz.internal.EntityAction} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.EntityAction#setActionTooltip
 * @function
 */


/**
 * Getter for property <code>iconSrc</code>.
 * Source of the icon
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.URI} the value of property <code>iconSrc</code>
 * @public
 * @name sap.landvisz.internal.EntityAction#getIconSrc
 * @function
 */

/**
 * Setter for property <code>iconSrc</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.URI} sIconSrc  new value for property <code>iconSrc</code>
 * @return {sap.landvisz.internal.EntityAction} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.EntityAction#setIconSrc
 * @function
 */


/**
 * Getter for property <code>renderingSize</code>.
 * rendering size of the control
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>renderingSize</code>
 * @public
 * @name sap.landvisz.internal.EntityAction#getRenderingSize
 * @function
 */

/**
 * Setter for property <code>renderingSize</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sRenderingSize  new value for property <code>renderingSize</code>
 * @return {sap.landvisz.internal.EntityAction} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.EntityAction#setRenderingSize
 * @function
 */


/**
 * on click fire press
 *
 * @name sap.landvisz.internal.EntityAction#press
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'press' event of this <code>sap.landvisz.internal.EntityAction</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.internal.EntityAction</code>.<br/> itself. 
 *  
 * on click fire press
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.internal.EntityAction</code>.<br/> itself.
 *
 * @return {sap.landvisz.internal.EntityAction} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.EntityAction#attachPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'press' event of this <code>sap.landvisz.internal.EntityAction</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.internal.EntityAction} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.EntityAction#detachPress
 * @function
 */

/**
 * Fire event press to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.internal.EntityAction} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.internal.EntityAction#firePress
 * @function
 */

// Start of sap/landvisz/internal/EntityAction.js
sap.landvisz.internal.EntityAction.prototype.init = function() {
	this.initializationDone = false;
};

sap.landvisz.internal.EntityAction.prototype.exit = function() {

	this.entityActionIcon && this.entityActionIcon.destroy();
	this.style = "";
	this.entityMaximized
};

sap.landvisz.internal.EntityAction.prototype.initControls = function() {

	var oNavigationAreaID = this.getId();
	this.entityActionIcon && this.entityActionIcon.destroy();
	this.entityActionIcon = new sap.ui.commons.Image(oNavigationAreaID
			+ "-CLVEntityActionImg");

};

sap.landvisz.internal.EntityAction.prototype.press = function(oEvent) {
	this.fireSelect();
};

sap.landvisz.internal.EntityAction.prototype.onclick = function(oEvent) {
	this.firePress();
};