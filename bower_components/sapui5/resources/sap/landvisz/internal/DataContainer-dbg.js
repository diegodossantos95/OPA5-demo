/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.internal.DataContainer.
jQuery.sap.declare("sap.landvisz.internal.DataContainer");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new internal/DataContainer.
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
 * <li>{@link #getSelected selected} : boolean (default: true)</li>
 * <li>{@link #getRenderingSize renderingSize} : sap.landvisz.EntityCSSSize (default: sap.landvisz.EntityCSSSize.Regular)</li>
 * <li>{@link #getType type} : sap.landvisz.LandscapeObject</li></ul>
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
 * <li>{@link sap.landvisz.internal.DataContainer#event:select select} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A control that renders the data container section in a system
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.internal.DataContainer
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.internal.DataContainer", { metadata : {

	library : "sap.landvisz",
	properties : {
		"header" : {type : "string", group : "Data", defaultValue : null},
		"selected" : {type : "boolean", group : "Identification", defaultValue : true},
		"renderingSize" : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : sap.landvisz.EntityCSSSize.Regular},
		"type" : {type : "sap.landvisz.LandscapeObject", group : "Identification", defaultValue : null}
	},
	aggregations : {
		"properties" : {type : "sap.ui.core.Control", multiple : true, singularName : "property"}
	},
	events : {
		"select" : {}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.internal.DataContainer with name <code>sClassName</code> 
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
 * @name sap.landvisz.internal.DataContainer.extend
 * @function
 */

sap.landvisz.internal.DataContainer.M_EVENTS = {'select':'select'};


/**
 * Getter for property <code>header</code>.
 * Text of Navigation Header
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>header</code>
 * @public
 * @name sap.landvisz.internal.DataContainer#getHeader
 * @function
 */

/**
 * Setter for property <code>header</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sHeader  new value for property <code>header</code>
 * @return {sap.landvisz.internal.DataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.DataContainer#setHeader
 * @function
 */


/**
 * Getter for property <code>selected</code>.
 * selected property of data header
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>selected</code>
 * @public
 * @name sap.landvisz.internal.DataContainer#getSelected
 * @function
 */

/**
 * Setter for property <code>selected</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bSelected  new value for property <code>selected</code>
 * @return {sap.landvisz.internal.DataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.DataContainer#setSelected
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
 * @name sap.landvisz.internal.DataContainer#getRenderingSize
 * @function
 */

/**
 * Setter for property <code>renderingSize</code>.
 *
 * Default value is <code>sap.landvisz.EntityCSSSize.Regular</code> 
 *
 * @param {sap.landvisz.EntityCSSSize} oRenderingSize  new value for property <code>renderingSize</code>
 * @return {sap.landvisz.internal.DataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.DataContainer#setRenderingSize
 * @function
 */


/**
 * Getter for property <code>type</code>.
 * type of landscape object
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.landvisz.LandscapeObject} the value of property <code>type</code>
 * @public
 * @name sap.landvisz.internal.DataContainer#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.landvisz.LandscapeObject} oType  new value for property <code>type</code>
 * @return {sap.landvisz.internal.DataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.DataContainer#setType
 * @function
 */


/**
 * Getter for aggregation <code>properties</code>.<br/>
 * test
 * 
 * @return {sap.ui.core.Control[]}
 * @public
 * @name sap.landvisz.internal.DataContainer#getProperties
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
 * @return {sap.landvisz.internal.DataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.DataContainer#insertProperty
 * @function
 */

/**
 * Adds some property <code>oProperty</code> 
 * to the aggregation named <code>properties</code>.
 *
 * @param {sap.ui.core.Control}
 *            oProperty the property to add; if empty, nothing is inserted
 * @return {sap.landvisz.internal.DataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.DataContainer#addProperty
 * @function
 */

/**
 * Removes an property from the aggregation named <code>properties</code>.
 *
 * @param {int | string | sap.ui.core.Control} vProperty the property to remove or its index or id
 * @return {sap.ui.core.Control} the removed property or null
 * @public
 * @name sap.landvisz.internal.DataContainer#removeProperty
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>properties</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.core.Control[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.internal.DataContainer#removeAllProperties
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
 * @name sap.landvisz.internal.DataContainer#indexOfProperty
 * @function
 */
	

/**
 * Destroys all the properties in the aggregation 
 * named <code>properties</code>.
 * @return {sap.landvisz.internal.DataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.DataContainer#destroyProperties
 * @function
 */


/**
 * the action to be carried out on selection of a tab
 *
 * @name sap.landvisz.internal.DataContainer#select
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'select' event of this <code>sap.landvisz.internal.DataContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.internal.DataContainer</code>.<br/> itself. 
 *  
 * the action to be carried out on selection of a tab
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.internal.DataContainer</code>.<br/> itself.
 *
 * @return {sap.landvisz.internal.DataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.DataContainer#attachSelect
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'select' event of this <code>sap.landvisz.internal.DataContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.internal.DataContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.DataContainer#detachSelect
 * @function
 */

/**
 * Fire event select to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.internal.DataContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.internal.DataContainer#fireSelect
 * @function
 */

// Start of sap/landvisz/internal/DataContainer.js
///**
// * This file defines behavior for the control,
// */
sap.landvisz.internal.DataContainer.prototype.init = function(){
   this.initializationDone = false;
   this.firstItem = false;
   this.lastItem = true;
   this.width;
   this.hasChangeEvent = false;
   this.visible = true;
   this.inDisplay = true;
};

sap.landvisz.internal.DataContainer.prototype.exit = function() {
	this.navItem && this.navItem.destroy();
	this.oNavBar && this.navItem.destroy();
};

sap.landvisz.internal.DataContainer.prototype.initControls = function() {

var navigationItemHdrID = this.getId();
	if(!this.oVLayoutContainer)
	this.oVLayoutContainer = new sap.ui.commons.layout.VerticalLayout(navigationItemHdrID + "-CLVEntityVLayoutContainer");

this.navItem && this.navItem.destroy();
this.navItem = new sap.ui.ux3.NavigationItem(navigationItemHdrID + "-CLVItemHeader");

};

sap.landvisz.internal.DataContainer.prototype.select = function(oEvent) {
	alert('selected');
};

sap.landvisz.internal.DataContainer.prototype.onclick = function(oEvent) {
 this.fireEvent("itemsChanged"); //private event used in DropdownBox
};


sap.landvisz.internal.DataContainer.prototype.onsapenter = function(oEvent) {
	this.fireEvent("itemsChanged"); 
};