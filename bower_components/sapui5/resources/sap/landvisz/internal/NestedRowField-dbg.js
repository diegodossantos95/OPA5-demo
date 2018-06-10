/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.internal.NestedRowField.
jQuery.sap.declare("sap.landvisz.internal.NestedRowField");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new internal/NestedRowField.
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
 * <li>{@link #getLabel label} : string</li>
 * <li>{@link #getValues values} : string[]</li>
 * <li>{@link #getRenderingSize renderingSize} : sap.landvisz.EntityCSSSize (default: sap.landvisz.EntityCSSSize.Regular)</li>
 * <li>{@link #getIconTitle iconTitle} : string</li>
 * <li>{@link #getType type} : string</li>
 * <li>{@link #getValueType valueType} : string</li>
 * <li>{@link #getRightIconSrc rightIconSrc} : string</li>
 * <li>{@link #getLinkSource linkSource} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getLinearRows linearRows} : sap.landvisz.internal.LinearRowField[]</li></ul>
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
 * A control to render nester row fields in a control
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.internal.NestedRowField
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.internal.NestedRowField", { metadata : {

	library : "sap.landvisz",
	properties : {
		"label" : {type : "string", group : "Data", defaultValue : null},
		"values" : {type : "string[]", group : "Data", defaultValue : null},
		"renderingSize" : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : sap.landvisz.EntityCSSSize.Regular},
		"iconTitle" : {type : "string", group : "Data", defaultValue : null},
		"type" : {type : "string", group : "Identification", defaultValue : null},
		"valueType" : {type : "string", group : "Identification", defaultValue : null},
		"rightIconSrc" : {type : "string", group : "Data", defaultValue : null},
		"linkSource" : {type : "string", group : "Data", defaultValue : null}
	},
	aggregations : {
		"linearRows" : {type : "sap.landvisz.internal.LinearRowField", multiple : true, singularName : "linearRow"}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.internal.NestedRowField with name <code>sClassName</code> 
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
 * @name sap.landvisz.internal.NestedRowField.extend
 * @function
 */


/**
 * Getter for property <code>label</code>.
 * label for data in a row field
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>label</code>
 * @public
 * @name sap.landvisz.internal.NestedRowField#getLabel
 * @function
 */

/**
 * Setter for property <code>label</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sLabel  new value for property <code>label</code>
 * @return {sap.landvisz.internal.NestedRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.NestedRowField#setLabel
 * @function
 */


/**
 * Getter for property <code>values</code>.
 * value of the data in a row field
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string[]} the value of property <code>values</code>
 * @public
 * @name sap.landvisz.internal.NestedRowField#getValues
 * @function
 */

/**
 * Setter for property <code>values</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string[]} aValues  new value for property <code>values</code>
 * @return {sap.landvisz.internal.NestedRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.NestedRowField#setValues
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
 * @name sap.landvisz.internal.NestedRowField#getRenderingSize
 * @function
 */

/**
 * Setter for property <code>renderingSize</code>.
 *
 * Default value is <code>sap.landvisz.EntityCSSSize.Regular</code> 
 *
 * @param {sap.landvisz.EntityCSSSize} oRenderingSize  new value for property <code>renderingSize</code>
 * @return {sap.landvisz.internal.NestedRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.NestedRowField#setRenderingSize
 * @function
 */


/**
 * Getter for property <code>iconTitle</code>.
 * titlte of the icon rendered in the nested row field
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>iconTitle</code>
 * @public
 * @name sap.landvisz.internal.NestedRowField#getIconTitle
 * @function
 */

/**
 * Setter for property <code>iconTitle</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sIconTitle  new value for property <code>iconTitle</code>
 * @return {sap.landvisz.internal.NestedRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.NestedRowField#setIconTitle
 * @function
 */


/**
 * Getter for property <code>type</code>.
 * determines the type of landscape object
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>type</code>
 * @public
 * @name sap.landvisz.internal.NestedRowField#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sType  new value for property <code>type</code>
 * @return {sap.landvisz.internal.NestedRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.NestedRowField#setType
 * @function
 */


/**
 * Getter for property <code>valueType</code>.
 * determines the type of value
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>valueType</code>
 * @public
 * @name sap.landvisz.internal.NestedRowField#getValueType
 * @function
 */

/**
 * Setter for property <code>valueType</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sValueType  new value for property <code>valueType</code>
 * @return {sap.landvisz.internal.NestedRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.NestedRowField#setValueType
 * @function
 */


/**
 * Getter for property <code>rightIconSrc</code>.
 * Image source of the icon on right
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>rightIconSrc</code>
 * @public
 * @name sap.landvisz.internal.NestedRowField#getRightIconSrc
 * @function
 */

/**
 * Setter for property <code>rightIconSrc</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sRightIconSrc  new value for property <code>rightIconSrc</code>
 * @return {sap.landvisz.internal.NestedRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.NestedRowField#setRightIconSrc
 * @function
 */


/**
 * Getter for property <code>linkSource</code>.
 * source from which two or more systems are dependent
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>linkSource</code>
 * @public
 * @name sap.landvisz.internal.NestedRowField#getLinkSource
 * @function
 */

/**
 * Setter for property <code>linkSource</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sLinkSource  new value for property <code>linkSource</code>
 * @return {sap.landvisz.internal.NestedRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.NestedRowField#setLinkSource
 * @function
 */


/**
 * Getter for aggregation <code>linearRows</code>.<br/>
 * Rows aggregation in a label
 * 
 * @return {sap.landvisz.internal.LinearRowField[]}
 * @public
 * @name sap.landvisz.internal.NestedRowField#getLinearRows
 * @function
 */


/**
 * Inserts a linearRow into the aggregation named <code>linearRows</code>.
 *
 * @param {sap.landvisz.internal.LinearRowField}
 *          oLinearRow the linearRow to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the linearRow should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the linearRow is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the linearRow is inserted at 
 *             the last position        
 * @return {sap.landvisz.internal.NestedRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.NestedRowField#insertLinearRow
 * @function
 */

/**
 * Adds some linearRow <code>oLinearRow</code> 
 * to the aggregation named <code>linearRows</code>.
 *
 * @param {sap.landvisz.internal.LinearRowField}
 *            oLinearRow the linearRow to add; if empty, nothing is inserted
 * @return {sap.landvisz.internal.NestedRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.NestedRowField#addLinearRow
 * @function
 */

/**
 * Removes an linearRow from the aggregation named <code>linearRows</code>.
 *
 * @param {int | string | sap.landvisz.internal.LinearRowField} vLinearRow the linearRow to remove or its index or id
 * @return {sap.landvisz.internal.LinearRowField} the removed linearRow or null
 * @public
 * @name sap.landvisz.internal.NestedRowField#removeLinearRow
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>linearRows</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.landvisz.internal.LinearRowField[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.internal.NestedRowField#removeAllLinearRows
 * @function
 */

/**
 * Checks for the provided <code>sap.landvisz.internal.LinearRowField</code> in the aggregation named <code>linearRows</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.landvisz.internal.LinearRowField}
 *            oLinearRow the linearRow whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.internal.NestedRowField#indexOfLinearRow
 * @function
 */
	

/**
 * Destroys all the linearRows in the aggregation 
 * named <code>linearRows</code>.
 * @return {sap.landvisz.internal.NestedRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.NestedRowField#destroyLinearRows
 * @function
 */

// Start of sap/landvisz/internal/NestedRowField.js
///**
// * This file defines behavior for the control,
// */

sap.landvisz.internal.NestedRowField.prototype.init = function() {
	this.initializationDone = false;
};

sap.landvisz.internal.NestedRowField.prototype.exit = function() {

	this.oNestedRowFieldLabel && this.oNestedRowFieldLabel.destroy();
	this.oNestedRowFieldValue && this.oNestedRowFieldValue.destroy();
	this.iconType && this.iconType.destroy();
	this.iconValue && this.iconValue.destroy();
};

sap.landvisz.internal.NestedRowField.prototype.initControls = function() {
	var oNavigationAreaID = this.getId();
	if (!this.oNestedRowFieldLabel)
		this.oNestedRowFieldLabel = new sap.ui.commons.Label(oNavigationAreaID
				+ "-CLVConNestedLabel");
	if (!this.oNestedRowFieldValue)
		this.oNestedRowFieldValue = new sap.ui.commons.TextView(
				oNavigationAreaID + "-CLVConNestedValue");
	if (!this.iconLabel)
		this.iconLabel = new sap.ui.commons.Image(oNavigationAreaID
				+ "-CLVDataLabelImg");
	if (!this.iconValue)
		this.iconValue = new sap.ui.commons.Image(oNavigationAreaID
				+ "-CLVDataValueImg");
};