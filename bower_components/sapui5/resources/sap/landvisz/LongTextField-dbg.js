/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.LongTextField.
jQuery.sap.declare("sap.landvisz.LongTextField");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new LongTextField.
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
 * <li>{@link #getText text} : string</li>
 * <li>{@link #getRenderingSize renderingSize} : sap.landvisz.EntityCSSSize</li></ul>
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
 * Long text for a header
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.LongTextField
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.LongTextField", { metadata : {

	library : "sap.landvisz",
	properties : {
		"text" : {type : "string", group : "Data", defaultValue : null},
		"renderingSize" : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.LongTextField with name <code>sClassName</code> 
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
 * @name sap.landvisz.LongTextField.extend
 * @function
 */


/**
 * Getter for property <code>text</code>.
 * Long text for a header
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>text</code>
 * @public
 * @name sap.landvisz.LongTextField#getText
 * @function
 */

/**
 * Setter for property <code>text</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sText  new value for property <code>text</code>
 * @return {sap.landvisz.LongTextField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LongTextField#setText
 * @function
 */


/**
 * Getter for property <code>renderingSize</code>.
 * rendering size of the data
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.landvisz.EntityCSSSize} the value of property <code>renderingSize</code>
 * @public
 * @name sap.landvisz.LongTextField#getRenderingSize
 * @function
 */

/**
 * Setter for property <code>renderingSize</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.landvisz.EntityCSSSize} oRenderingSize  new value for property <code>renderingSize</code>
 * @return {sap.landvisz.LongTextField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LongTextField#setRenderingSize
 * @function
 */

// Start of sap/landvisz/LongTextField.js
///**
// * This file defines behavior for the control,
// */

sap.landvisz.LongTextField.prototype.init = function(){
};


sap.landvisz.LongTextField.prototype.exit = function() {
       
       this.oLinearRowFieldLabel && this.oLinearRowFieldLabel.destroy();
};

sap.landvisz.LongTextField.prototype.initControls = function() {
      
       var oNavigationAreaID = this.getId();
       
       if(!this.oLongText)
       this.oLongText = new sap.ui.commons.TextView(oNavigationAreaID + "-CLVConValue");

};