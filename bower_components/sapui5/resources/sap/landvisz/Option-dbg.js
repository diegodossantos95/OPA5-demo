/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.Option.
jQuery.sap.declare("sap.landvisz.Option");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new Option.
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
 * <li>{@link #getType type} : string</li>
 * <li>{@link #getCurrentEntity currentEntity} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getOptionEntities optionEntities} : sap.landvisz.OptionEntity[]</li></ul>
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
 * Options for solution entities
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.Option
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.Option", { metadata : {

	library : "sap.landvisz",
	properties : {
		"type" : {type : "string", group : "Identification", defaultValue : null},
		"currentEntity" : {type : "string", group : "Data", defaultValue : null}
	},
	aggregations : {
		"optionEntities" : {type : "sap.landvisz.OptionEntity", multiple : true, singularName : "optionEntity"}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.Option with name <code>sClassName</code> 
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
 * @name sap.landvisz.Option.extend
 * @function
 */


/**
 * Getter for property <code>type</code>.
 * type of main entity which has a replacement
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>type</code>
 * @public
 * @name sap.landvisz.Option#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sType  new value for property <code>type</code>
 * @return {sap.landvisz.Option} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.Option#setType
 * @function
 */


/**
 * Getter for property <code>currentEntity</code>.
 * Entity on which options are applicable
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>currentEntity</code>
 * @public
 * @name sap.landvisz.Option#getCurrentEntity
 * @function
 */

/**
 * Setter for property <code>currentEntity</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sCurrentEntity  new value for property <code>currentEntity</code>
 * @return {sap.landvisz.Option} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.Option#setCurrentEntity
 * @function
 */


/**
 * Getter for aggregation <code>optionEntities</code>.<br/>
 * Entity to be rendered as options
 * 
 * @return {sap.landvisz.OptionEntity[]}
 * @public
 * @name sap.landvisz.Option#getOptionEntities
 * @function
 */


/**
 * Inserts a optionEntity into the aggregation named <code>optionEntities</code>.
 *
 * @param {sap.landvisz.OptionEntity}
 *          oOptionEntity the optionEntity to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the optionEntity should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the optionEntity is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the optionEntity is inserted at 
 *             the last position        
 * @return {sap.landvisz.Option} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.Option#insertOptionEntity
 * @function
 */

/**
 * Adds some optionEntity <code>oOptionEntity</code> 
 * to the aggregation named <code>optionEntities</code>.
 *
 * @param {sap.landvisz.OptionEntity}
 *            oOptionEntity the optionEntity to add; if empty, nothing is inserted
 * @return {sap.landvisz.Option} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.Option#addOptionEntity
 * @function
 */

/**
 * Removes an optionEntity from the aggregation named <code>optionEntities</code>.
 *
 * @param {int | string | sap.landvisz.OptionEntity} vOptionEntity the optionEntity to remove or its index or id
 * @return {sap.landvisz.OptionEntity} the removed optionEntity or null
 * @public
 * @name sap.landvisz.Option#removeOptionEntity
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>optionEntities</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.landvisz.OptionEntity[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.Option#removeAllOptionEntities
 * @function
 */

/**
 * Checks for the provided <code>sap.landvisz.OptionEntity</code> in the aggregation named <code>optionEntities</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.landvisz.OptionEntity}
 *            oOptionEntity the optionEntity whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.Option#indexOfOptionEntity
 * @function
 */
	

/**
 * Destroys all the optionEntities in the aggregation 
 * named <code>optionEntities</code>.
 * @return {sap.landvisz.Option} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.Option#destroyOptionEntities
 * @function
 */

// Start of sap/landvisz/Option.js
///**
// * This file defines behavior for the control,
// */

//jQuery.sap.require("sap.landvisz.internal.IdentificationBarRenderer");
//jQuery.sap.require("sap.landvisz.EntityConstants");

sap.landvisz.Option.prototype.init = function() {
this.viewType;
};