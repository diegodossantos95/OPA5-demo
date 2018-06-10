/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.internal.EntityCustomAction.
jQuery.sap.declare("sap.landvisz.internal.EntityCustomAction");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new internal/EntityCustomAction.
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
 * <li>{@link #getCustomAction customAction} : string</li>
 * <li>{@link #getRenderingSize renderingSize} : sap.landvisz.EntityCSSSize (default: sap.landvisz.EntityCSSSize.Regular)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.landvisz.internal.EntityCustomAction#event:select select} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A control to render custom actions of visualization control
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.internal.EntityCustomAction
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.internal.EntityCustomAction", { metadata : {

	library : "sap.landvisz",
	properties : {
		"customAction" : {type : "string", group : "Data", defaultValue : null},
		"renderingSize" : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : sap.landvisz.EntityCSSSize.Regular}
	},
	events : {
		"select" : {}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.internal.EntityCustomAction with name <code>sClassName</code> 
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
 * @name sap.landvisz.internal.EntityCustomAction.extend
 * @function
 */

sap.landvisz.internal.EntityCustomAction.M_EVENTS = {'select':'select'};


/**
 * Getter for property <code>customAction</code>.
 * name of the custom action
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>customAction</code>
 * @public
 * @name sap.landvisz.internal.EntityCustomAction#getCustomAction
 * @function
 */

/**
 * Setter for property <code>customAction</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sCustomAction  new value for property <code>customAction</code>
 * @return {sap.landvisz.internal.EntityCustomAction} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.EntityCustomAction#setCustomAction
 * @function
 */


/**
 * Getter for property <code>renderingSize</code>.
 * rendering size of the control
 *
 * Default value is <code>sap.landvisz.EntityCSSSize.Regular</code>
 *
 * @return {sap.landvisz.EntityCSSSize} the value of property <code>renderingSize</code>
 * @public
 * @name sap.landvisz.internal.EntityCustomAction#getRenderingSize
 * @function
 */

/**
 * Setter for property <code>renderingSize</code>.
 *
 * Default value is <code>sap.landvisz.EntityCSSSize.Regular</code> 
 *
 * @param {sap.landvisz.EntityCSSSize} oRenderingSize  new value for property <code>renderingSize</code>
 * @return {sap.landvisz.internal.EntityCustomAction} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.EntityCustomAction#setRenderingSize
 * @function
 */


/**
 * click on the action bar
 *
 * @name sap.landvisz.internal.EntityCustomAction#select
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'select' event of this <code>sap.landvisz.internal.EntityCustomAction</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.internal.EntityCustomAction</code>.<br/> itself. 
 *  
 * click on the action bar
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.internal.EntityCustomAction</code>.<br/> itself.
 *
 * @return {sap.landvisz.internal.EntityCustomAction} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.EntityCustomAction#attachSelect
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'select' event of this <code>sap.landvisz.internal.EntityCustomAction</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.internal.EntityCustomAction} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.EntityCustomAction#detachSelect
 * @function
 */

/**
 * Fire event select to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.internal.EntityCustomAction} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.internal.EntityCustomAction#fireSelect
 * @function
 */

// Start of sap/landvisz/internal/EntityCustomAction.js
///**
// * This file defines behavior for the control,
// */
sap.landvisz.internal.EntityCustomAction.prototype.init = function(){

   this.initializationDone = false;

   this.lastButton = false;

};

sap.landvisz.internal.EntityCustomAction.prototype.exit = function() {

        this.customAction && this.customAction.destroy();

};

sap.landvisz.internal.EntityCustomAction.prototype.initControls = function() {

var customActionHdrID = this.getId();


};


sap.landvisz.internal.EntityCustomAction.prototype.select = function(oEvent) {
	this.fireSelect();
};

sap.landvisz.internal.EntityCustomAction.prototype.onclick = function(oEvent) {
	this.fireSelect();
};

