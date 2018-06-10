/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.internal.LinearRowField.
jQuery.sap.declare("sap.landvisz.internal.LinearRowField");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new internal/LinearRowField.
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
 * <li>{@link #getValue value} : string</li>
 * <li>{@link #getRenderingSize renderingSize} : sap.landvisz.EntityCSSSize (default: sap.landvisz.EntityCSSSize.Regular)</li>
 * <li>{@link #getIconType iconType} : string</li>
 * <li>{@link #getIconTitle iconTitle} : string</li>
 * <li>{@link #getRightIconSrc rightIconSrc} : string</li>
 * <li>{@link #getLinkSource linkSource} : string</li>
 * <li>{@link #getRightIconTooltip rightIconTooltip} : string</li>
 * <li>{@link #getInvalidName invalidName} : boolean</li></ul>
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
 * A control to render linear row fields in data container region of a system
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.internal.LinearRowField
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.internal.LinearRowField", { metadata : {

	library : "sap.landvisz",
	properties : {
		"label" : {type : "string", group : "Data", defaultValue : null},
		"value" : {type : "string", group : "Data", defaultValue : null},
		"renderingSize" : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : sap.landvisz.EntityCSSSize.Regular},
		"iconType" : {type : "string", group : "Data", defaultValue : null},
		"iconTitle" : {type : "string", group : "Data", defaultValue : null},
		"rightIconSrc" : {type : "string", group : "Data", defaultValue : null},
		"linkSource" : {type : "string", group : "Data", defaultValue : null},
		"rightIconTooltip" : {type : "string", group : "Data", defaultValue : null},
		"invalidName" : {type : "boolean", group : "Identification", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.internal.LinearRowField with name <code>sClassName</code> 
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
 * @name sap.landvisz.internal.LinearRowField.extend
 * @function
 */


/**
 * Getter for property <code>label</code>.
 * text to be displayed in the row field
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>label</code>
 * @public
 * @name sap.landvisz.internal.LinearRowField#getLabel
 * @function
 */

/**
 * Setter for property <code>label</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sLabel  new value for property <code>label</code>
 * @return {sap.landvisz.internal.LinearRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.LinearRowField#setLabel
 * @function
 */


/**
 * Getter for property <code>value</code>.
 * value to be displayed in the row field
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>value</code>
 * @public
 * @name sap.landvisz.internal.LinearRowField#getValue
 * @function
 */

/**
 * Setter for property <code>value</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sValue  new value for property <code>value</code>
 * @return {sap.landvisz.internal.LinearRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.LinearRowField#setValue
 * @function
 */


/**
 * Getter for property <code>renderingSize</code>.
 * rendering size of system
 *
 * Default value is <code>sap.landvisz.EntityCSSSize.Regular</code>
 *
 * @return {sap.landvisz.EntityCSSSize} the value of property <code>renderingSize</code>
 * @public
 * @name sap.landvisz.internal.LinearRowField#getRenderingSize
 * @function
 */

/**
 * Setter for property <code>renderingSize</code>.
 *
 * Default value is <code>sap.landvisz.EntityCSSSize.Regular</code> 
 *
 * @param {sap.landvisz.EntityCSSSize} oRenderingSize  new value for property <code>renderingSize</code>
 * @return {sap.landvisz.internal.LinearRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.LinearRowField#setRenderingSize
 * @function
 */


/**
 * Getter for property <code>iconType</code>.
 * text of the icon dislayed in the row field
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>iconType</code>
 * @public
 * @name sap.landvisz.internal.LinearRowField#getIconType
 * @function
 */

/**
 * Setter for property <code>iconType</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sIconType  new value for property <code>iconType</code>
 * @return {sap.landvisz.internal.LinearRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.LinearRowField#setIconType
 * @function
 */


/**
 * Getter for property <code>iconTitle</code>.
 * title of the icon displayed in the row field
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>iconTitle</code>
 * @public
 * @name sap.landvisz.internal.LinearRowField#getIconTitle
 * @function
 */

/**
 * Setter for property <code>iconTitle</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sIconTitle  new value for property <code>iconTitle</code>
 * @return {sap.landvisz.internal.LinearRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.LinearRowField#setIconTitle
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
 * @name sap.landvisz.internal.LinearRowField#getRightIconSrc
 * @function
 */

/**
 * Setter for property <code>rightIconSrc</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sRightIconSrc  new value for property <code>rightIconSrc</code>
 * @return {sap.landvisz.internal.LinearRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.LinearRowField#setRightIconSrc
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
 * @name sap.landvisz.internal.LinearRowField#getLinkSource
 * @function
 */

/**
 * Setter for property <code>linkSource</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sLinkSource  new value for property <code>linkSource</code>
 * @return {sap.landvisz.internal.LinearRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.LinearRowField#setLinkSource
 * @function
 */


/**
 * Getter for property <code>rightIconTooltip</code>.
 * tool tip for the right icon
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>rightIconTooltip</code>
 * @public
 * @name sap.landvisz.internal.LinearRowField#getRightIconTooltip
 * @function
 */

/**
 * Setter for property <code>rightIconTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sRightIconTooltip  new value for property <code>rightIconTooltip</code>
 * @return {sap.landvisz.internal.LinearRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.LinearRowField#setRightIconTooltip
 * @function
 */


/**
 * Getter for property <code>invalidName</code>.
 * determines if the product version are valid/invalid
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {boolean} the value of property <code>invalidName</code>
 * @public
 * @name sap.landvisz.internal.LinearRowField#getInvalidName
 * @function
 */

/**
 * Setter for property <code>invalidName</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {boolean} bInvalidName  new value for property <code>invalidName</code>
 * @return {sap.landvisz.internal.LinearRowField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.LinearRowField#setInvalidName
 * @function
 */

// Start of sap/landvisz/internal/LinearRowField.js
///**
// * This file defines behavior for the control,
// */
//sap.landvisz.LinearRowField.prototype.init = function(){
//   // do something for initialization...
//};

sap.landvisz.internal.LinearRowField.prototype.init = function() {
	this.initializationDone = false;
	this.iconType && this.iconType.destroy();
	this.totalWidth =0;
};

sap.landvisz.internal.LinearRowField.prototype.exit = function() {

	this.oLinearRowFieldLabel && this.oLinearRowFieldLabel.destroy();
	this.oLinearRowFieldValue && this.oLinearRowFieldValue.destroy();
	this.seperatorLbl && this.seperatorLbl.destroy();
};

sap.landvisz.internal.LinearRowField.prototype.initControls = function() {
	var oNavigationAreaID = this.getId();
	if (!this.oLinearRowFieldLabel)
		this.oLinearRowFieldLabel = new sap.ui.commons.Label(oNavigationAreaID
				+ "-CLVConLabel");
	if (!this.oLinearRowFieldValue)
		this.oLinearRowFieldValue = new sap.ui.commons.TextView(
				oNavigationAreaID + "-CLVConValue");
	if (!this.seperatorLbl)
		this.seperatorLbl = new sap.ui.commons.TextView(oNavigationAreaID
				+ "-CLVConSeperator");
	// Identification Region Qualifier Icon
	this.iconType && this.iconType.destroy();
	this.iconType = new sap.ui.commons.Image(oNavigationAreaID
			+ "-CLVDataTypeImg");

	if (!this.rightIcon)
		this.rightIcon = new sap.ui.commons.Image(oNavigationAreaID
				+ "-rightImg");
	this.entityMaximized;

};

sap.landvisz.internal.LinearRowField.prototype.onmouseenter = function(oEvent) {
	oEvent.stopImmediatePropagation();

};
sap.landvisz.internal.LinearRowField.prototype.onmouseleave = function(oEvent) {
	oEvent.stopImmediatePropagation();

};