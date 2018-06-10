/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.internal.SingleDataContainer.
jQuery.sap.declare("sap.landvisz.internal.SingleDataContainer");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new internal/SingleDataContainer.
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
 * <li>{@link #getHeader header} : string</li>
 * <li>{@link #getRenderingSize renderingSize} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getProperties properties} : sap.ui.core.Control[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.landvisz.internal.SingleDataContainer#event:closed closed} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A control that shows all the tabs separately for a better view
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.internal.SingleDataContainer
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.internal.SingleDataContainer", { metadata : {

	publicMethods : [
		// methods
		"isOpen"
	],
	library : "sap.landvisz",
	properties : {
		"header" : {type : "string", group : "Data", defaultValue : null},
		"renderingSize" : {type : "string", group : "Dimension", defaultValue : null}
	},
	aggregations : {
		"properties" : {type : "sap.ui.core.Control", multiple : true, singularName : "property"}
	},
	events : {
		"closed" : {}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.internal.SingleDataContainer with name <code>sClassName</code> 
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
 * @name sap.landvisz.internal.SingleDataContainer.extend
 * @function
 */

sap.landvisz.internal.SingleDataContainer.M_EVENTS = {'closed':'closed'};


/**
 * Getter for property <code>header</code>.
 * header of the tab
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>header</code>
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#getHeader
 * @function
 */

/**
 * Setter for property <code>header</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sHeader  new value for property <code>header</code>
 * @return {sap.landvisz.internal.SingleDataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#setHeader
 * @function
 */


/**
 * Getter for property <code>renderingSize</code>.
 * rendering size of the system
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>renderingSize</code>
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#getRenderingSize
 * @function
 */

/**
 * Setter for property <code>renderingSize</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sRenderingSize  new value for property <code>renderingSize</code>
 * @return {sap.landvisz.internal.SingleDataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#setRenderingSize
 * @function
 */


/**
 * Getter for aggregation <code>properties</code>.<br/>
 * properties that are aggregated to the data container region of tabs
 * 
 * @return {sap.ui.core.Control[]}
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#getProperties
 * @function
 */


/**
 * Inserts a property into the aggregation named <code>properties</code>.
 *
 * @param {sap.ui.core.Control}
 *          oProperty the property to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the property should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the property is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the property is inserted at 
 *             the last position        
 * @return {sap.landvisz.internal.SingleDataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#insertProperty
 * @function
 */

/**
 * Adds some property <code>oProperty</code> 
 * to the aggregation named <code>properties</code>.
 *
 * @param {sap.ui.core.Control}
 *            oProperty the property to add; if empty, nothing is inserted
 * @return {sap.landvisz.internal.SingleDataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#addProperty
 * @function
 */

/**
 * Removes an property from the aggregation named <code>properties</code>.
 *
 * @param {int | string | sap.ui.core.Control} vProperty the property to remove or its index or id
 * @return {sap.ui.core.Control} the removed property or null
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#removeProperty
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>properties</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.core.Control[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#removeAllProperties
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.core.Control</code> in the aggregation named <code>properties</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.core.Control}
 *            oProperty the property whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#indexOfProperty
 * @function
 */
	

/**
 * Destroys all the properties in the aggregation 
 * named <code>properties</code>.
 * @return {sap.landvisz.internal.SingleDataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#destroyProperties
 * @function
 */


/**
 * called when Single view model is closed
 *
 * @name sap.landvisz.internal.SingleDataContainer#closed
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'closed' event of this <code>sap.landvisz.internal.SingleDataContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.internal.SingleDataContainer</code>.<br/> itself. 
 *  
 * called when Single view model is closed
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.internal.SingleDataContainer</code>.<br/> itself.
 *
 * @return {sap.landvisz.internal.SingleDataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#attachClosed
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'closed' event of this <code>sap.landvisz.internal.SingleDataContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.internal.SingleDataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.SingleDataContainer#detachClosed
 * @function
 */

/**
 * Fire event closed to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.internal.SingleDataContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.internal.SingleDataContainer#fireClosed
 * @function
 */


/**
 * returns true if show all option is open
 *
 * @name sap.landvisz.internal.SingleDataContainer#isOpen
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/landvisz/internal/SingleDataContainer.js
///**
// * This file defines behavior for the control,
// */
sap.landvisz.internal.SingleDataContainer.prototype.init = function() {
	this.initializationDone = false;
	this.isModelOpen = false;
};

sap.landvisz.internal.SingleDataContainer.prototype.exit = function() {
};

sap.landvisz.internal.SingleDataContainer.prototype.initControls = function() {

	var oNavigationAreaID = this.getId();
	if (!this.headerLabel)
		this.headerLabel = new sap.ui.commons.Label(oNavigationAreaID
				+ "-CLVHeaderLabel");
	if (!this.closeIcon)
		this.closeIcon = new sap.ui.commons.Image(oNavigationAreaID
				+ "-CLVSMVClose");

};

// Implementation of API method isOpen
sap.landvisz.internal.SingleDataContainer.prototype.isOpen = function() {
	return this.isModelOpen;
};

sap.landvisz.internal.SingleDataContainer.prototype.onclick = function(oEvent) {

	if (oEvent.target.id == "closeVM") {
		jQuery.sap.byId(oEvent.currentTarget.id).hide("slow");
		this.isModelOpen = false;
		this.fireClosed();

	} else {
		oEvent.stopImmediatePropagation();
	}
};