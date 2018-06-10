/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.internal.IdentificationBar.
jQuery.sap.declare("sap.landvisz.internal.IdentificationBar");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new internal/IdentificationBar.
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
 * <li>{@link #getType type} : string</li>
 * <li>{@link #getQualifierText qualifierText} : string</li>
 * <li>{@link #getQualifierTooltip qualifierTooltip} : string</li>
 * <li>{@link #getQualifierType qualifierType} : string</li>
 * <li>{@link #getRenderingSize renderingSize} : sap.landvisz.EntityCSSSize (default: sap.landvisz.EntityCSSSize.Regular)</li>
 * <li>{@link #getDefaultState defaultState} : string</li>
 * <li>{@link #getDescription description} : string</li>
 * <li>{@link #getComponentType componentType} : sap.landvisz.ComponentType</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.landvisz.internal.IdentificationBar#event:select select} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Acontrol to render identification bar of a system
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.internal.IdentificationBar
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.internal.IdentificationBar", { metadata : {

	publicMethods : [
		// methods
		"getIdentificationProperties"
	],
	library : "sap.landvisz",
	properties : {
		"text" : {type : "string", group : "Data", defaultValue : null},
		"type" : {type : "string", group : "Data", defaultValue : null},
		"qualifierText" : {type : "string", group : "Data", defaultValue : null},
		"qualifierTooltip" : {type : "string", group : "Data", defaultValue : null},
		"qualifierType" : {type : "string", group : "Data", defaultValue : null},
		"renderingSize" : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : sap.landvisz.EntityCSSSize.Regular},
		"defaultState" : {type : "string", group : "Misc", defaultValue : null},
		"description" : {type : "string", group : "Data", defaultValue : null},
		"componentType" : {type : "sap.landvisz.ComponentType", group : "Identification", defaultValue : null}
	},
	events : {
		"select" : {}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.internal.IdentificationBar with name <code>sClassName</code> 
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
 * @name sap.landvisz.internal.IdentificationBar.extend
 * @function
 */

sap.landvisz.internal.IdentificationBar.M_EVENTS = {'select':'select'};


/**
 * Getter for property <code>text</code>.
 * text that identifies a system
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>text</code>
 * @public
 * @name sap.landvisz.internal.IdentificationBar#getText
 * @function
 */

/**
 * Setter for property <code>text</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sText  new value for property <code>text</code>
 * @return {sap.landvisz.internal.IdentificationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.IdentificationBar#setText
 * @function
 */


/**
 * Getter for property <code>type</code>.
 * type of system rendered
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>type</code>
 * @public
 * @name sap.landvisz.internal.IdentificationBar#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sType  new value for property <code>type</code>
 * @return {sap.landvisz.internal.IdentificationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.IdentificationBar#setType
 * @function
 */


/**
 * Getter for property <code>qualifierText</code>.
 * text that identifies the server
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>qualifierText</code>
 * @public
 * @name sap.landvisz.internal.IdentificationBar#getQualifierText
 * @function
 */

/**
 * Setter for property <code>qualifierText</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sQualifierText  new value for property <code>qualifierText</code>
 * @return {sap.landvisz.internal.IdentificationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.IdentificationBar#setQualifierText
 * @function
 */


/**
 * Getter for property <code>qualifierTooltip</code>.
 * tooltip to identify the server
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>qualifierTooltip</code>
 * @public
 * @name sap.landvisz.internal.IdentificationBar#getQualifierTooltip
 * @function
 */

/**
 * Setter for property <code>qualifierTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sQualifierTooltip  new value for property <code>qualifierTooltip</code>
 * @return {sap.landvisz.internal.IdentificationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.IdentificationBar#setQualifierTooltip
 * @function
 */


/**
 * Getter for property <code>qualifierType</code>.
 * icon to identify the server
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>qualifierType</code>
 * @public
 * @name sap.landvisz.internal.IdentificationBar#getQualifierType
 * @function
 */

/**
 * Setter for property <code>qualifierType</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sQualifierType  new value for property <code>qualifierType</code>
 * @return {sap.landvisz.internal.IdentificationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.IdentificationBar#setQualifierType
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
 * @name sap.landvisz.internal.IdentificationBar#getRenderingSize
 * @function
 */

/**
 * Setter for property <code>renderingSize</code>.
 *
 * Default value is <code>sap.landvisz.EntityCSSSize.Regular</code> 
 *
 * @param {sap.landvisz.EntityCSSSize} oRenderingSize  new value for property <code>renderingSize</code>
 * @return {sap.landvisz.internal.IdentificationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.IdentificationBar#setRenderingSize
 * @function
 */


/**
 * Getter for property <code>defaultState</code>.
 * determines the default state of the control
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>defaultState</code>
 * @public
 * @name sap.landvisz.internal.IdentificationBar#getDefaultState
 * @function
 */

/**
 * Setter for property <code>defaultState</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDefaultState  new value for property <code>defaultState</code>
 * @return {sap.landvisz.internal.IdentificationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.IdentificationBar#setDefaultState
 * @function
 */


/**
 * Getter for property <code>description</code>.
 * despriction of the identification region of a control
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>description</code>
 * @public
 * @name sap.landvisz.internal.IdentificationBar#getDescription
 * @function
 */

/**
 * Setter for property <code>description</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDescription  new value for property <code>description</code>
 * @return {sap.landvisz.internal.IdentificationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.IdentificationBar#setDescription
 * @function
 */


/**
 * Getter for property <code>componentType</code>.
 * Component type of the entity
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.landvisz.ComponentType} the value of property <code>componentType</code>
 * @public
 * @name sap.landvisz.internal.IdentificationBar#getComponentType
 * @function
 */

/**
 * Setter for property <code>componentType</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.landvisz.ComponentType} oComponentType  new value for property <code>componentType</code>
 * @return {sap.landvisz.internal.IdentificationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.IdentificationBar#setComponentType
 * @function
 */


/**
 * fires click event on selection
 *
 * @name sap.landvisz.internal.IdentificationBar#select
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'select' event of this <code>sap.landvisz.internal.IdentificationBar</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.internal.IdentificationBar</code>.<br/> itself. 
 *  
 * fires click event on selection
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.internal.IdentificationBar</code>.<br/> itself.
 *
 * @return {sap.landvisz.internal.IdentificationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.IdentificationBar#attachSelect
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'select' event of this <code>sap.landvisz.internal.IdentificationBar</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.internal.IdentificationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.IdentificationBar#detachSelect
 * @function
 */

/**
 * Fire event select to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.internal.IdentificationBar} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.internal.IdentificationBar#fireSelect
 * @function
 */


/**
 * returns identification properties
 *
 * @name sap.landvisz.internal.IdentificationBar#getIdentificationProperties
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/landvisz/internal/IdentificationBar.js
///**
// * This file defines behavior for the control,
// */
sap.landvisz.internal.IdentificationBar.prototype.init = function() {
	this.initializationDone = false;
};

sap.landvisz.internal.IdentificationBar.prototype.exit = function() {
	this.oIdentifierIcon && this.oIdentifierIcon.destroy();
	this.oQualifierIcon && this.oQualifierIcon.destroy();
	this.oDescriptionText && this.oDescriptionText.destroy();
	this.oIdentifierText && this.oIdentifierText.destroy();
	this.oQualifierText && this.oQualifierText.destroy();
};

/**
 * Create the composite parts out of the current settings. Called by the renderer just before rendering
 * 
 * @private
 */
sap.landvisz.internal.IdentificationBar.prototype.initControls = function() {

	var identificationHdrID = this.getId();

	this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");
	this.OnDemandText = this._oBundle.getText("On_Demand");
	this.OnPremiseText = this._oBundle.getText("On_Premise");

	

	// Identification Region Icon
	this.oIdentifierIcon && this.oIdentifierIcon.destroy();
	this.oIdentifierIcon = new sap.ui.commons.Image(identificationHdrID
			+ "-CLVIdnImg");
	this.oIdentifierIcon.setParent(this);

	// Identification Text display
	this.oIdentifierText && this.oIdentifierText.destroy();
	this.oIdentifierText = new sap.ui.commons.TextView(identificationHdrID
			+ "-CLVIdnTxt");
	this.oIdentifierText.setAccessibleRole(sap.ui.core.AccessibleRole.Heading);
	this.oIdentifierText.setParent(this);

	// Identification Region Qualifier Icon
	this.oQualifierIcon && this.oQualifierIcon.destroy();
	this.oQualifierIcon = new sap.ui.commons.Image(identificationHdrID
			+ "-CLVQuaImg").addStyleClass("sapLandviszCursor");
	this.oQualifierIcon.setParent(this);

	// Identification Description display - Make it as Call out
	this.oDescriptionText && this.oDescriptionText.destroy();
	this.oDescriptionText = new sap.ui.commons.TextView(identificationHdrID
			+ "-CLVDesTxt");
	this.oDescriptionText.setParent(this);

	// Identification Text display
	this.oQualifierText && this.oQualifierText.destroy();
	this.oQualifierText = new sap.ui.commons.TextView(identificationHdrID
			+ "-CLVQuaTxt");

	this.oIdentifierTextIcon && this.oIdentifierTextIcon.destroy();

	this.oIdentifierTextIcon = new sap.ui.commons.Image(identificationHdrID
	+ "-CLVIdnSIDImg");

	this.oQualifierText.setAccessibleRole(sap.ui.core.AccessibleRole.Heading);
	this.oQualifierText.setParent(this);

	this.oButton;
	this.oCallout;
	this.maxHeight;
	this.entityMaximized;

};
sap.landvisz.internal.IdentificationBar.prototype.select = function(oEvent) {
	this.fireSelect();
};

sap.landvisz.LandscapeEntity.prototype.select = function(oEvent) {
	this.fireSelect();
};

sap.landvisz.internal.IdentificationBar.prototype.onclick = function(oEvent) {
	sap.landvisz.EntityConstants.internalEvent = true;
	this.fireSelect();
};
