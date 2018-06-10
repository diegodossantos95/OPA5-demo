/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.internal.ModelingStatus.
jQuery.sap.declare("sap.landvisz.internal.ModelingStatus");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new internal/ModelingStatus.
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
 * <li>{@link #getStatus status} : string</li>
 * <li>{@link #getStatusTooltip statusTooltip} : string</li>
 * <li>{@link #getStateIconSrc stateIconSrc} : string</li>
 * <li>{@link #getStateIconTooltip stateIconTooltip} : any</li></ul>
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
 * Modeling Status of entity
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.internal.ModelingStatus
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.internal.ModelingStatus", { metadata : {

	library : "sap.landvisz",
	properties : {
		"status" : {type : "string", group : "Data", defaultValue : null},
		"statusTooltip" : {type : "string", group : "Data", defaultValue : null},
		"stateIconSrc" : {type : "string", group : "Data", defaultValue : null},
		"stateIconTooltip" : {type : "any", group : "Data", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.internal.ModelingStatus with name <code>sClassName</code> 
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
 * @name sap.landvisz.internal.ModelingStatus.extend
 * @function
 */


/**
 * Getter for property <code>status</code>.
 * status determines the state of the system namely correct, warning, error
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>status</code>
 * @public
 * @name sap.landvisz.internal.ModelingStatus#getStatus
 * @function
 */

/**
 * Setter for property <code>status</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sStatus  new value for property <code>status</code>
 * @return {sap.landvisz.internal.ModelingStatus} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ModelingStatus#setStatus
 * @function
 */


/**
 * Getter for property <code>statusTooltip</code>.
 * Tooltip for status that determines the state of the system namely correct, warning, error
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>statusTooltip</code>
 * @public
 * @name sap.landvisz.internal.ModelingStatus#getStatusTooltip
 * @function
 */

/**
 * Setter for property <code>statusTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sStatusTooltip  new value for property <code>statusTooltip</code>
 * @return {sap.landvisz.internal.ModelingStatus} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ModelingStatus#setStatusTooltip
 * @function
 */


/**
 * Getter for property <code>stateIconSrc</code>.
 * icon source for status
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>stateIconSrc</code>
 * @public
 * @name sap.landvisz.internal.ModelingStatus#getStateIconSrc
 * @function
 */

/**
 * Setter for property <code>stateIconSrc</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sStateIconSrc  new value for property <code>stateIconSrc</code>
 * @return {sap.landvisz.internal.ModelingStatus} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ModelingStatus#setStateIconSrc
 * @function
 */


/**
 * Getter for property <code>stateIconTooltip</code>.
 * tooltip for the icon
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {any} the value of property <code>stateIconTooltip</code>
 * @public
 * @name sap.landvisz.internal.ModelingStatus#getStateIconTooltip
 * @function
 */

/**
 * Setter for property <code>stateIconTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {any} oStateIconTooltip  new value for property <code>stateIconTooltip</code>
 * @return {sap.landvisz.internal.ModelingStatus} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ModelingStatus#setStateIconTooltip
 * @function
 */

// Start of sap/landvisz/internal/ModelingStatus.js
///**
// * This file defines behavior for the control,
// */
//sap.landvisz.LinearRowField.prototype.init = function(){
//   // do something for initialization...
//};

sap.landvisz.internal.ModelingStatus.prototype.init = function() {
	this.initializationDone = false;
	this._imgResourcePath = sap.ui.resource('sap.landvisz',
			'themes/base/img/status/')
	this._imgFolderPath;
	this.renderSize;
	if (!this.statusImage)
		this.statusImage = new sap.ui.commons.Image(this.getId()
				+ "-CLVEntityStatusImage");
};

sap.landvisz.internal.ModelingStatus.prototype.exit = function() {

	this.statusImage && this.statusImage.destroy();
};

sap.landvisz.internal.ModelingStatus.prototype.initControls = function() {
	var oNavigationAreaID = this.getId();
	if (!this.statusImage)
		this.statusImage = new sap.ui.commons.Image(oNavigationAreaID
				+ "-CLVEntityStatusImage");

	if (!this.stateImage)
		this.stateImage = new sap.ui.commons.Image(oNavigationAreaID
				+ "-EntityStateImage");

	this.entityMaximized;
};

//sap.landvisz.internal.ModelingStatus.prototype.onclick = function(oEvent) {
//	this.fireEvent("statusSelected"); //private event used when option clicked
//};
