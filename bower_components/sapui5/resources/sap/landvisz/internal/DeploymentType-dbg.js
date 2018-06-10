/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.internal.DeploymentType.
jQuery.sap.declare("sap.landvisz.internal.DeploymentType");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new internal/DeploymentType.
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
 * <li>{@link #getType type} : string</li></ul>
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
 * A control to render deployment type of a component
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.internal.DeploymentType
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.internal.DeploymentType", { metadata : {

	library : "sap.landvisz",
	properties : {
		"type" : {type : "string", group : "Data", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.internal.DeploymentType with name <code>sClassName</code> 
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
 * @name sap.landvisz.internal.DeploymentType.extend
 * @function
 */


/**
 * Getter for property <code>type</code>.
 * icon type of data
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>type</code>
 * @public
 * @name sap.landvisz.internal.DeploymentType#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sType  new value for property <code>type</code>
 * @return {sap.landvisz.internal.DeploymentType} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.DeploymentType#setType
 * @function
 */

// Start of sap/landvisz/internal/DeploymentType.js
///**
// * This file defines behavior for the control,
// */

sap.landvisz.internal.DeploymentType.prototype.init = function() {
	this.left = 0;
	this.top = 0;
	this.initializationDone = false;
	this.entityId = "";
	this.count = 0;
	this.type ="";
	this.standardWidth = 0;
	this.srcEntityId ="";
};

sap.landvisz.internal.DeploymentType.prototype.initControls = function() {

	var controlID = this.getId();
	this.iconType && this.iconType.destroy();
	this.iconType = new sap.ui.commons.Image(controlID + "-solutionCategoryImg");
	this.iconLeft && this.iconLeft.destroy();
	this.iconLeft = new sap.ui.commons.Image(controlID + "-solutionCategoryLeftImg");
	this.iconRight && this.iconRight.destroy();
	this.iconRight = new sap.ui.commons.Image(controlID + "-solutionCategoryRightImg");
};
