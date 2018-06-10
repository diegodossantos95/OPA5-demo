/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.OptionSource.
jQuery.sap.declare("sap.landvisz.OptionSource");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new OptionSource.
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
 * <li>{@link #getSource source} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
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
 * Options source for solution entities
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.OptionSource
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.OptionSource", { metadata : {

	library : "sap.landvisz",
	properties : {
		"source" : {type : "string", group : "Data", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.OptionSource with name <code>sClassName</code> 
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
 * @name sap.landvisz.OptionSource.extend
 * @function
 */


/**
 * Getter for property <code>source</code>.
 * source for option entity
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>source</code>
 * @public
 * @name sap.landvisz.OptionSource#getSource
 * @function
 */

/**
 * Setter for property <code>source</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sSource  new value for property <code>source</code>
 * @return {sap.landvisz.OptionSource} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.OptionSource#setSource
 * @function
 */

// Start of sap/landvisz/OptionSource.js
///**
// * This file defines behavior for the control,
// */

sap.landvisz.OptionSource.prototype.init = function() {
this.viewType;
};