/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.OptionEntity.
jQuery.sap.declare("sap.landvisz.OptionEntity");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.landvisz.OptionSource");


/**
 * Constructor for a new OptionEntity.
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
 * <li>{@link #getSelected selected} : boolean (default: false)</li>
 * <li>{@link #getEnable enable} : boolean (default: true)</li>
 * <li>{@link #getOptionTextTooltip optionTextTooltip} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getOptionSources optionSources} : sap.landvisz.OptionSource[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.landvisz.OptionEntity#event:selectOption selectOption} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.landvisz.OptionSource#constructor sap.landvisz.OptionSource}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Options for solution entities
 * @extends sap.landvisz.OptionSource
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.OptionEntity
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.OptionSource.extend("sap.landvisz.OptionEntity", { metadata : {

	library : "sap.landvisz",
	properties : {
		"label" : {type : "string", group : "Data", defaultValue : null},
		"selected" : {type : "boolean", group : "Accessibility", defaultValue : false},
		"enable" : {type : "boolean", group : "Identification", defaultValue : true},
		"optionTextTooltip" : {type : "string", group : "Data", defaultValue : null}
	},
	aggregations : {
		"optionSources" : {type : "sap.landvisz.OptionSource", multiple : true, singularName : "optionSource"}
	},
	events : {
		"selectOption" : {}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.OptionEntity with name <code>sClassName</code> 
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
 * @name sap.landvisz.OptionEntity.extend
 * @function
 */

sap.landvisz.OptionEntity.M_EVENTS = {'selectOption':'selectOption'};


/**
 * Getter for property <code>label</code>.
 * label for option entity
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>label</code>
 * @public
 * @name sap.landvisz.OptionEntity#getLabel
 * @function
 */

/**
 * Setter for property <code>label</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sLabel  new value for property <code>label</code>
 * @return {sap.landvisz.OptionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.OptionEntity#setLabel
 * @function
 */


/**
 * Getter for property <code>selected</code>.
 * determines current selected option
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>selected</code>
 * @public
 * @name sap.landvisz.OptionEntity#getSelected
 * @function
 */

/**
 * Setter for property <code>selected</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bSelected  new value for property <code>selected</code>
 * @return {sap.landvisz.OptionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.OptionEntity#setSelected
 * @function
 */


/**
 * Getter for property <code>enable</code>.
 * enabling/disabling options
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>enable</code>
 * @public
 * @name sap.landvisz.OptionEntity#getEnable
 * @function
 */

/**
 * Setter for property <code>enable</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bEnable  new value for property <code>enable</code>
 * @return {sap.landvisz.OptionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.OptionEntity#setEnable
 * @function
 */


/**
 * Getter for property <code>optionTextTooltip</code>.
 * tooltip for options
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>optionTextTooltip</code>
 * @public
 * @name sap.landvisz.OptionEntity#getOptionTextTooltip
 * @function
 */

/**
 * Setter for property <code>optionTextTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sOptionTextTooltip  new value for property <code>optionTextTooltip</code>
 * @return {sap.landvisz.OptionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.OptionEntity#setOptionTextTooltip
 * @function
 */


/**
 * Getter for aggregation <code>optionSources</code>.<br/>
 * Option Renderer Control
 * 
 * @return {sap.landvisz.OptionSource[]}
 * @public
 * @name sap.landvisz.OptionEntity#getOptionSources
 * @function
 */


/**
 * Inserts a optionSource into the aggregation named <code>optionSources</code>.
 *
 * @param {sap.landvisz.OptionSource}
 *          oOptionSource the optionSource to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the optionSource should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the optionSource is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the optionSource is inserted at 
 *             the last position        
 * @return {sap.landvisz.OptionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.OptionEntity#insertOptionSource
 * @function
 */

/**
 * Adds some optionSource <code>oOptionSource</code> 
 * to the aggregation named <code>optionSources</code>.
 *
 * @param {sap.landvisz.OptionSource}
 *            oOptionSource the optionSource to add; if empty, nothing is inserted
 * @return {sap.landvisz.OptionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.OptionEntity#addOptionSource
 * @function
 */

/**
 * Removes an optionSource from the aggregation named <code>optionSources</code>.
 *
 * @param {int | string | sap.landvisz.OptionSource} vOptionSource the optionSource to remove or its index or id
 * @return {sap.landvisz.OptionSource} the removed optionSource or null
 * @public
 * @name sap.landvisz.OptionEntity#removeOptionSource
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>optionSources</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.landvisz.OptionSource[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.OptionEntity#removeAllOptionSources
 * @function
 */

/**
 * Checks for the provided <code>sap.landvisz.OptionSource</code> in the aggregation named <code>optionSources</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.landvisz.OptionSource}
 *            oOptionSource the optionSource whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.OptionEntity#indexOfOptionSource
 * @function
 */
	

/**
 * Destroys all the optionSources in the aggregation 
 * named <code>optionSources</code>.
 * @return {sap.landvisz.OptionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.OptionEntity#destroyOptionSources
 * @function
 */


/**
 * Select event for option entity
 *
 * @name sap.landvisz.OptionEntity#selectOption
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'selectOption' event of this <code>sap.landvisz.OptionEntity</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.OptionEntity</code>.<br/> itself. 
 *  
 * Select event for option entity
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.OptionEntity</code>.<br/> itself.
 *
 * @return {sap.landvisz.OptionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.OptionEntity#attachSelectOption
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'selectOption' event of this <code>sap.landvisz.OptionEntity</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.OptionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.OptionEntity#detachSelectOption
 * @function
 */

/**
 * Fire event selectOption to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.OptionEntity} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.OptionEntity#fireSelectOption
 * @function
 */

// Start of sap/landvisz/OptionEntity.js
///**
//* This file defines behavior for the control,
//*/

//jQuery.sap.require("sap.landvisz.internal.IdentificationBarRenderer");
//jQuery.sap.require("sap.landvisz.EntityConstants");

sap.landvisz.OptionEntity.prototype.init = function() {
	this.optionText = "1";
	this.optionSrcEntityId;
	this.optionRepEntityId;
	this.optionOn;
	this.isSelected;
	this.initializationDone = false;
	this.left = 0;
	this.top = 0;
};

sap.landvisz.OptionEntity.prototype.initControls = function() {
	var optionID = this.getId();
	if (!this.optionTextView)
		this.optionTextView = new sap.ui.commons.TextView(optionID + "-optionText");
	var that = this;
	if (!this.optionBtn){
		this.optionBtn = new sap.ui.commons.RadioButton(optionID+ "-optionBtn",{
			groupName: optionID+ "-optionBtn"
		});
		this.optionBtn.attachSelect(function(oEvent) {
			//private event used when option is clicked
			that.fireEvent("optionSelected");
			//public event used when option is clicked
			that.fireSelectOption(); 
		});
	}
};

sap.landvisz.OptionEntity.prototype.onclick = function(oEvent) {
	if(oEvent.srcControl instanceof sap.ui.commons.RadioButton)
		return;
	if(this.getEnable() == true){
		//private event used when option is clicked
		this.fireEvent("optionSelected");
		//public event used when option is clicked
		this.fireSelectOption(); 
	}
};

sap.landvisz.OptionEntity.prototype.onAfterRendering = function() {
	if(this.getSelected()==true){
		this.optionBtn.setSelected(true);
	}
};