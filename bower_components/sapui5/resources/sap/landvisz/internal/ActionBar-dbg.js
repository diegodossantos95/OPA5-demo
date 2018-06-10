/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.internal.ActionBar.
jQuery.sap.declare("sap.landvisz.internal.ActionBar");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new internal/ActionBar.
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
 * <li>{@link #getActionLabel actionLabel} : string</li>
 * <li>{@link #getRenderingSize renderingSize} : sap.landvisz.EntityCSSSize (default: sap.landvisz.EntityCSSSize.Regular)</li>
 * <li>{@link #getIconSrc iconSrc} : sap.ui.core.URI</li>
 * <li>{@link #getActionType actionType} : sap.landvisz.ActionType (default: sap.landvisz.ActionType.NORMAL)</li>
 * <li>{@link #getMenuData menuData} : object</li>
 * <li>{@link #getActionTooltip actionTooltip} : string</li>
 * <li>{@link #getEnable enable} : boolean (default: true)</li>
 * <li>{@link #getChangeView changeView} : boolean (default: false)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getMenu menu} : sap.ui.commons.Menu[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.landvisz.internal.ActionBar#event:select select} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A control that render actions of a system
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.internal.ActionBar
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.internal.ActionBar", { metadata : {

	publicMethods : [
		// methods
		"getSelectedItem", "setSelectedItemSubAction", "getSystemId"
	],
	library : "sap.landvisz",
	properties : {
		"actionLabel" : {type : "string", group : "Data", defaultValue : null},
		"renderingSize" : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : sap.landvisz.EntityCSSSize.Regular},
		"iconSrc" : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},
		"actionType" : {type : "sap.landvisz.ActionType", group : "Data", defaultValue : sap.landvisz.ActionType.NORMAL},
		"menuData" : {type : "object", group : "Data", defaultValue : null},
		"actionTooltip" : {type : "string", group : "Data", defaultValue : null},
		"enable" : {type : "boolean", group : "Identification", defaultValue : true},
		"changeView" : {type : "boolean", group : "Identification", defaultValue : false}
	},
	aggregations : {
		"menu" : {type : "sap.ui.commons.Menu", multiple : true, singularName : "menu"}
	},
	events : {
		"select" : {}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.internal.ActionBar with name <code>sClassName</code> 
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
 * @name sap.landvisz.internal.ActionBar.extend
 * @function
 */

sap.landvisz.internal.ActionBar.M_EVENTS = {'select':'select'};


/**
 * Getter for property <code>actionLabel</code>.
 * label for action
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>actionLabel</code>
 * @public
 * @name sap.landvisz.internal.ActionBar#getActionLabel
 * @function
 */

/**
 * Setter for property <code>actionLabel</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sActionLabel  new value for property <code>actionLabel</code>
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#setActionLabel
 * @function
 */


/**
 * Getter for property <code>renderingSize</code>.
 * Property that determines the size of the entity rendered
 *
 * Default value is <code>sap.landvisz.EntityCSSSize.Regular</code>
 *
 * @return {sap.landvisz.EntityCSSSize} the value of property <code>renderingSize</code>
 * @public
 * @name sap.landvisz.internal.ActionBar#getRenderingSize
 * @function
 */

/**
 * Setter for property <code>renderingSize</code>.
 *
 * Default value is <code>sap.landvisz.EntityCSSSize.Regular</code> 
 *
 * @param {sap.landvisz.EntityCSSSize} oRenderingSize  new value for property <code>renderingSize</code>
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#setRenderingSize
 * @function
 */


/**
 * Getter for property <code>iconSrc</code>.
 * source for the icon rendered
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.URI} the value of property <code>iconSrc</code>
 * @public
 * @name sap.landvisz.internal.ActionBar#getIconSrc
 * @function
 */

/**
 * Setter for property <code>iconSrc</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.URI} sIconSrc  new value for property <code>iconSrc</code>
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#setIconSrc
 * @function
 */


/**
 * Getter for property <code>actionType</code>.
 * type of the action
 *
 * Default value is <code>sap.landvisz.ActionType.NORMAL</code>
 *
 * @return {sap.landvisz.ActionType} the value of property <code>actionType</code>
 * @public
 * @name sap.landvisz.internal.ActionBar#getActionType
 * @function
 */

/**
 * Setter for property <code>actionType</code>.
 *
 * Default value is <code>sap.landvisz.ActionType.NORMAL</code> 
 *
 * @param {sap.landvisz.ActionType} oActionType  new value for property <code>actionType</code>
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#setActionType
 * @function
 */


/**
 * Getter for property <code>menuData</code>.
 * data of menu items and sub items
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {object} the value of property <code>menuData</code>
 * @public
 * @name sap.landvisz.internal.ActionBar#getMenuData
 * @function
 */

/**
 * Setter for property <code>menuData</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object} oMenuData  new value for property <code>menuData</code>
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#setMenuData
 * @function
 */


/**
 * Getter for property <code>actionTooltip</code>.
 * Tooltip for the action
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>actionTooltip</code>
 * @public
 * @name sap.landvisz.internal.ActionBar#getActionTooltip
 * @function
 */

/**
 * Setter for property <code>actionTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sActionTooltip  new value for property <code>actionTooltip</code>
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#setActionTooltip
 * @function
 */


/**
 * Getter for property <code>enable</code>.
 * property to enable/disable actions
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>enable</code>
 * @public
 * @name sap.landvisz.internal.ActionBar#getEnable
 * @function
 */

/**
 * Setter for property <code>enable</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bEnable  new value for property <code>enable</code>
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#setEnable
 * @function
 */


/**
 * Getter for property <code>changeView</code>.
 * new type of view is loaded while performing the action.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>changeView</code>
 * @public
 * @name sap.landvisz.internal.ActionBar#getChangeView
 * @function
 */

/**
 * Setter for property <code>changeView</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bChangeView  new value for property <code>changeView</code>
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#setChangeView
 * @function
 */


/**
 * Getter for aggregation <code>menu</code>.<br/>
 * aggregation for menu items
 * 
 * @return {sap.ui.commons.Menu[]}
 * @public
 * @name sap.landvisz.internal.ActionBar#getMenu
 * @function
 */


/**
 * Inserts a menu into the aggregation named <code>menu</code>.
 *
 * @param {sap.ui.commons.Menu}
 *          oMenu the menu to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the menu should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the menu is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the menu is inserted at 
 *             the last position        
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#insertMenu
 * @function
 */

/**
 * Adds some menu <code>oMenu</code> 
 * to the aggregation named <code>menu</code>.
 *
 * @param {sap.ui.commons.Menu}
 *            oMenu the menu to add; if empty, nothing is inserted
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#addMenu
 * @function
 */

/**
 * Removes an menu from the aggregation named <code>menu</code>.
 *
 * @param {int | string | sap.ui.commons.Menu} vMenu the menu to remove or its index or id
 * @return {sap.ui.commons.Menu} the removed menu or null
 * @public
 * @name sap.landvisz.internal.ActionBar#removeMenu
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>menu</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.commons.Menu[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.internal.ActionBar#removeAllMenu
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.commons.Menu</code> in the aggregation named <code>menu</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.commons.Menu}
 *            oMenu the menu whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.internal.ActionBar#indexOfMenu
 * @function
 */
	

/**
 * Destroys all the menu in the aggregation 
 * named <code>menu</code>.
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#destroyMenu
 * @function
 */


/**
 * click on the action bar
 *
 * @name sap.landvisz.internal.ActionBar#select
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'select' event of this <code>sap.landvisz.internal.ActionBar</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.internal.ActionBar</code>.<br/> itself. 
 *  
 * click on the action bar
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.internal.ActionBar</code>.<br/> itself.
 *
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#attachSelect
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'select' event of this <code>sap.landvisz.internal.ActionBar</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.ActionBar#detachSelect
 * @function
 */

/**
 * Fire event select to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.internal.ActionBar} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.internal.ActionBar#fireSelect
 * @function
 */


/**
 * returns selected menu item object
 *
 * @name sap.landvisz.internal.ActionBar#getSelectedItem
 * @function
 * @type object
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * sub actions to be added in the recently selected
 *
 * @name sap.landvisz.internal.ActionBar#setSelectedItemSubAction
 * @function
 * @param {object} oSubAction
 *         sub action of selcted menu item
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * returns the system ID.
 *
 * @name sap.landvisz.internal.ActionBar#getSystemId
 * @function
 * @type string
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/landvisz/internal/ActionBar.js
///**
// * This file defines behavior for the control,
// */

jQuery.sap.require("sap.ui.commons.MenuButton");
jQuery.sap.require("sap.ui.commons.Menu");
jQuery.sap.require("sap.ui.commons.MenuItem");

sap.landvisz.internal.ActionBar.prototype.init = function() {
	this.initializationDone = false;
	this.lastButton = false;
	this.selectedItem;
	this.systemId = "";
};

sap.landvisz.internal.ActionBar.prototype.exit = function() {
	this.customAction && this.customAction.destroy();
	this.oActToolBar && this.oActToolBar.destroy();
	this.oToolBarBtn && this.oToolBarBtn.destroy();
};

sap.landvisz.internal.ActionBar.prototype.initControls = function() {
	var customActionHdrID = this.getId();
	this.oToolBarBtn;
	this.oActToolBar;

	if (!this.customActionIcon && this.getIconSrc() && this.getIconSrc() != "")
		this.customActionIcon = new sap.ui.commons.Image(customActionHdrID
				+ "-CLVCustomActionImg");
	if (!this.menuButton)
		this.menuButton = new sap.ui.commons.MenuButton(customActionHdrID + '-'
				+ "MenuButton");
};

sap.landvisz.internal.ActionBar.prototype.onclick = function(oEvent) {
	if (this.getEnable() == false)
		oEvent.preventDefault();
	else
		this.fireSelect();
};



/**
 * Handles the sapenter event does not bubble
 *
 * @param {jQuery.Event} oEvent
 * @private
 */
sap.landvisz.internal.ActionBar.prototype.onsapenter = function(oEvent) {
		if (this.getEnable() == false)
		oEvent.preventDefault();
	else
		this.fireSelect();
};

/**
 * Handles the sapenter event does not bubble
 *
 * @param {jQuery.Event} oEvent
 * @private
 */
sap.landvisz.internal.ActionBar.prototype.nsapenter = function(oEvent) {
	if (this.getEnable() == false)
		oEvent.preventDefault();
	else
		this.fireSelect();
};

sap.landvisz.internal.ActionBar.prototype.getSelectedItem = function() {
	return this.selectedItem;
};

sap.landvisz.internal.ActionBar.prototype.getSystemId = function() {
	return this.systemId;
};

sap.landvisz.internal.ActionBar.prototype.setSelectedItemSubAction = function(subActions) {
	var menuData = this.getMenuData();
	var subMenu = this._addSubActions(menuData, subActions);
};

sap.landvisz.internal.ActionBar.prototype._addSubActions = function(menuData,subMenu) {
	for ( var i = 0; i < menuData.length; i++) {
		if (this.selectedItem.getText() == menuData[i].text) {
			menuData[i].subActions = subMenu;
			return;
		}
//		if (menuData[i].subActions && menuData[i].subActions.length > 0) {
//			this._addSubActions(menuData[i].subActions, subMenu)
//		}
	}
};

sap.landvisz.internal.ActionBar.prototype._createMenu = function(menuSubAction) {
	var menuItem = null;
	var menuItemObj = null;
	var menu = new sap.ui.commons.Menu();
	menu.addStyleClass("sapLandviszMenuItemBorber");
	for ( var i = 0; i < menuSubAction.length; i++) {
		menuItemObj = menuSubAction[i];
		menuItem = new sap.ui.commons.MenuItem({
			text : menuItemObj.text,
			tooltip : menuItemObj.tooltip
		});
		if (menuItemObj.customdata) {
			var customData = new sap.ui.core.CustomData({
				key : menuItemObj.customdata,
			});

			menuItem.addCustomData(customData);
		}
		menu.addItem(menuItem);
		if (menuItemObj.subActions && menuItemObj.subActions.length > 0) {
			var subMenu = this._createMenu(menuItemObj.subActions)
			menuItem.setSubmenu(subMenu);
		}
	}

	return menu;
};
