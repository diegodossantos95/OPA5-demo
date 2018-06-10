/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.ConnectionEntity.
jQuery.sap.declare("sap.landvisz.ConnectionEntity");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new ConnectionEntity.
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
 * <li>{@link #getConnectionId connectionId} : string</li>
 * <li>{@link #getSize size} : string</li>
 * <li>{@link #getType type} : sap.landvisz.ConnectionType</li>
 * <li>{@link #getLinkId linkId} : string</li>
 * <li>{@link #getLinkedHeader linkedHeader} : string</li>
 * <li>{@link #getDependencyTooltip dependencyTooltip} : string</li>
 * <li>{@link #getShowOverlay showOverlay} : boolean (default: true)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getConnectionData connectionData} : sap.landvisz.internal.LinearRowField[]</li></ul>
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
 * Connection Entity of Dependency view
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.ConnectionEntity
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.ConnectionEntity", { metadata : {

	library : "sap.landvisz",
	properties : {
		"connectionId" : {type : "string", group : "Data", defaultValue : null},
		"size" : {type : "string", group : "Data", defaultValue : null},
		"type" : {type : "sap.landvisz.ConnectionType", group : "Identification", defaultValue : null},
		"linkId" : {type : "string", group : "Data", defaultValue : null},
		"linkedHeader" : {type : "string", group : "Data", defaultValue : null},
		"dependencyTooltip" : {type : "string", group : "Data", defaultValue : null},
		"showOverlay" : {type : "boolean", group : "Data", defaultValue : true}
	},
	aggregations : {
		"connectionData" : {type : "sap.landvisz.internal.LinearRowField", multiple : true, singularName : "connectionData"}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.ConnectionEntity with name <code>sClassName</code> 
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
 * @name sap.landvisz.ConnectionEntity.extend
 * @function
 */


/**
 * Getter for property <code>connectionId</code>.
 * id of connection Entity
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>connectionId</code>
 * @public
 * @name sap.landvisz.ConnectionEntity#getConnectionId
 * @function
 */

/**
 * Setter for property <code>connectionId</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sConnectionId  new value for property <code>connectionId</code>
 * @return {sap.landvisz.ConnectionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.ConnectionEntity#setConnectionId
 * @function
 */


/**
 * Getter for property <code>size</code>.
 * size of connection Entity
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>size</code>
 * @public
 * @name sap.landvisz.ConnectionEntity#getSize
 * @function
 */

/**
 * Setter for property <code>size</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sSize  new value for property <code>size</code>
 * @return {sap.landvisz.ConnectionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.ConnectionEntity#setSize
 * @function
 */


/**
 * Getter for property <code>type</code>.
 * type of a connection Entity
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.landvisz.ConnectionType} the value of property <code>type</code>
 * @public
 * @name sap.landvisz.ConnectionEntity#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.landvisz.ConnectionType} oType  new value for property <code>type</code>
 * @return {sap.landvisz.ConnectionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.ConnectionEntity#setType
 * @function
 */


/**
 * Getter for property <code>linkId</code>.
 * ID which links the entities
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>linkId</code>
 * @public
 * @name sap.landvisz.ConnectionEntity#getLinkId
 * @function
 */

/**
 * Setter for property <code>linkId</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sLinkId  new value for property <code>linkId</code>
 * @return {sap.landvisz.ConnectionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.ConnectionEntity#setLinkId
 * @function
 */


/**
 * Getter for property <code>linkedHeader</code>.
 * link header data that is shared with in the entities
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>linkedHeader</code>
 * @public
 * @name sap.landvisz.ConnectionEntity#getLinkedHeader
 * @function
 */

/**
 * Setter for property <code>linkedHeader</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sLinkedHeader  new value for property <code>linkedHeader</code>
 * @return {sap.landvisz.ConnectionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.ConnectionEntity#setLinkedHeader
 * @function
 */


/**
 * Getter for property <code>dependencyTooltip</code>.
 * tooltip for dependency type icon
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>dependencyTooltip</code>
 * @public
 * @name sap.landvisz.ConnectionEntity#getDependencyTooltip
 * @function
 */

/**
 * Setter for property <code>dependencyTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDependencyTooltip  new value for property <code>dependencyTooltip</code>
 * @return {sap.landvisz.ConnectionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.ConnectionEntity#setDependencyTooltip
 * @function
 */


/**
 * Getter for property <code>showOverlay</code>.
 * to show the overlay for highlightig
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showOverlay</code>
 * @public
 * @name sap.landvisz.ConnectionEntity#getShowOverlay
 * @function
 */

/**
 * Setter for property <code>showOverlay</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowOverlay  new value for property <code>showOverlay</code>
 * @return {sap.landvisz.ConnectionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.ConnectionEntity#setShowOverlay
 * @function
 */


/**
 * Getter for aggregation <code>connectionData</code>.<br/>
 * Linear row field renderer for connection Entity
 * 
 * @return {sap.landvisz.internal.LinearRowField[]}
 * @public
 * @name sap.landvisz.ConnectionEntity#getConnectionData
 * @function
 */


/**
 * Inserts a connectionData into the aggregation named <code>connectionData</code>.
 *
 * @param {sap.landvisz.internal.LinearRowField}
 *          oConnectionData the connectionData to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the connectionData should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the connectionData is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the connectionData is inserted at 
 *             the last position        
 * @return {sap.landvisz.ConnectionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.ConnectionEntity#insertConnectionData
 * @function
 */

/**
 * Adds some connectionData <code>oConnectionData</code> 
 * to the aggregation named <code>connectionData</code>.
 *
 * @param {sap.landvisz.internal.LinearRowField}
 *            oConnectionData the connectionData to add; if empty, nothing is inserted
 * @return {sap.landvisz.ConnectionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.ConnectionEntity#addConnectionData
 * @function
 */

/**
 * Removes an connectionData from the aggregation named <code>connectionData</code>.
 *
 * @param {int | string | sap.landvisz.internal.LinearRowField} vConnectionData the connectionData to remove or its index or id
 * @return {sap.landvisz.internal.LinearRowField} the removed connectionData or null
 * @public
 * @name sap.landvisz.ConnectionEntity#removeConnectionData
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>connectionData</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.landvisz.internal.LinearRowField[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.ConnectionEntity#removeAllConnectionData
 * @function
 */

/**
 * Checks for the provided <code>sap.landvisz.internal.LinearRowField</code> in the aggregation named <code>connectionData</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.landvisz.internal.LinearRowField}
 *            oConnectionData the connectionData whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.ConnectionEntity#indexOfConnectionData
 * @function
 */
	

/**
 * Destroys all the connectionData in the aggregation 
 * named <code>connectionData</code>.
 * @return {sap.landvisz.ConnectionEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.ConnectionEntity#destroyConnectionData
 * @function
 */

// Start of sap/landvisz/ConnectionEntity.js
///**
// * This file defines behavior for the control,
// */

jQuery.sap.require("sap.landvisz.internal.LinearRowField");
jQuery.sap.require("sap.ui.core.HTML");
jQuery.sap.require("sap.ui.ux3.ToolPopup");

sap.landvisz.ConnectionEntity.prototype.init = function() {

	this.viewType;
	this.top = 0;
	this.left = 0;
	this.width = 0;
	this.height = 90;

	this.innerTop = 0;
	this.innerLeft = 0;
	this.innerWidth = 0;
	this.innerHeight = 0;
	this.holdDisplay = false;
	this.initializationDone = false;
	//this.holdByClick = false;

	//	this.attachBrowserEvent("mouseenter", function(event) {
	//		alert("test");
	//	});

};

sap.landvisz.ConnectionEntity.prototype.initControls = function() {

	if (!this.oVLayoutRows)
		this.oVLayoutRows = new sap.ui.commons.layout.VerticalLayout(this
				.getId()
				+ "-ConnectionRowVLayout");
	if (!this.connectionLabel)
		this.connectionLabel = new sap.ui.commons.Label(this.getId()
				+ "-connectionLabel");
	if (!this.connectionImage)
		this.connectionImage = new sap.ui.commons.Image(this.getId()
				+ "-connectionImage");

	if (!this.oVLayoutCallout)
		this.oVLayoutCallout = new sap.ui.commons.layout.VerticalLayout(this
				.getId()
				+ "-calloutVLayout");

	if (!this.oVLayoutToolPopup)
		this.oVLayoutToolPopup = new sap.ui.commons.layout.VerticalLayout(this
				.getId()
				+ "-toolPopupVLayout");

	if (!this.calloutLabel)
		this.calloutLabel = new sap.ui.commons.Label(this.getId()
				+ "-calloutLabel");
	if (!this.toolPopup) {
		this.toolPopup = new sap.ui.ux3.ToolPopup(this.getId() + "toolpopup");
		this.toolPopup.addContent(this.oVLayoutToolPopup);
	}
	

	if (this.getType() == sap.landvisz.ConnectionType.ProductSystem)
		this.oVLayoutToolPopup
				.addStyleClass("sapLandviszCalloutPS productSystemPopup");
	if (this.getType() == sap.landvisz.ConnectionType.TechnicalSystem)
		this.oVLayoutToolPopup
				.addStyleClass("sapLandviszCalloutPS technicalSystemPopup");
	if (this.getType() == sap.landvisz.ConnectionType.MobileSolution)
		this.oVLayoutToolPopup
				.addStyleClass("sapLandviszCalloutPS mobileSolutionPopup");
	this.toolPopup.addStyleClass("sapLandviszCalloutPS");

	
	if(this.getSize() == sap.landvisz.EntityCSSSize.Small)
		this.oVLayoutToolPopup.addStyleClass("sapLandviszCalloutRowFieldSmall");
	else
		this.oVLayoutToolPopup.addStyleClass("sapLandviszCalloutRowField");
		
};

sap.landvisz.ConnectionEntity.prototype.onclick = function(oEvent) {

	if (oEvent.target.id == this.getId() + "connectionRow")
		oEvent.srcControl.holdDisplay = !oEvent.srcControl.holdDisplay;
	else
		this.holdDisplay = !this.holdDisplay;
	if(this.holdDisplay){
		if (this.viewType == sap.landvisz.DependencyType.NETWORK_VIEW) {
			var id = jQuery.sap.byId(this.getId() + "connectionRow");
			this.toolPopup.setOpener(id);
			if (!this.toolPopup.isOpen()) {
				this.toolPopup.setPosition(sap.ui.core.Popup.Dock.CenterBottom,
						sap.ui.core.Popup.Dock.CenterTop, id, "-10 0", "fit");
				var popup = jQuery.sap.byId(this.getId() + "toolpopup");
				this.toolPopup.open();
			}
		}		
		this.fireEvent("connectionMouseover");
	}
}

sap.landvisz.ConnectionEntity.prototype.onmouseenter = function(oEvent) {

	if (this.viewType == sap.landvisz.ViewType.SOLUTION_VIEW) 
		oEvent.stopImmediatePropagation();
	else if (oEvent.target.id == this.getId() + "connectionRow") {
		var holdDisplayTrue = false;
		var thisElementHold = false;
		for(var i = 0 ; i < this.getParent().getConnectionEntities().length ; i++){
			if(this.getParent().getConnectionEntities()[i].holdDisplay == true){
				if(this.getParent().getConnectionEntities()[i].getId() == this.getId()){
					holdDisplayTrue = true;
					thisElementHold = true;
				}else{
					holdDisplayTrue = true;
				}
			}		
		}	
		if((!holdDisplayTrue) || (thisElementHold && holdDisplayTrue)){
			if (this.viewType == sap.landvisz.DependencyType.NETWORK_VIEW) {
			var id = jQuery.sap.byId(this.getId() + "connectionRow");
			this.toolPopup.setOpener(id);
			if (!this.toolPopup.isOpen()) {
				this.toolPopup.setPosition(sap.ui.core.Popup.Dock.CenterBottom,
						sap.ui.core.Popup.Dock.CenterTop, id, "-10 0", "fit");
				var popup = jQuery.sap.byId(this.getId() + "toolpopup");
				this.toolPopup.open();
			}
		}
	}	
	if (this.getShowOverlay() == true && this.getLinkId() && ""!=this.getLinkId())
		this.fireEvent("connectionMouseover");
	}

}
sap.landvisz.ConnectionEntity.prototype.onmouseleave = function(oEvent) {

	if (this.viewType == sap.landvisz.ViewType.SOLUTION_VIEW)
		oEvent.stopImmediatePropagation();
	else {
		if (this.holdDisplay == false && this.toolPopup.isOpen()) {
			this.toolPopup.close();
			//			this.oControl.fireEvent("connectionHover");
		}
		if (this.getLinkId() && ""!=this.getLinkId())
		this.fireEvent("connectionMouseout");
		//		if (oEvent.srcElement.id != this.getId() + "connectionRow") {
		//			oEvent.srcControl = this;
		//			this.fireEvent("on" + oEvent.eventType, oEvent);
		//
		//		}
	}
};

sap.landvisz.ConnectionEntity.prototype.onAfterRendering = function() {

	var that = this;
	jQuery.sap.byId(this.getId() + "connectionRow").mouseleave(
			function(oEvent) {
				that.onmouseleave(oEvent);
			});

	jQuery.sap.byId(this.getId() + "connectionRow").mouseenter(
			function(oEvent) {
				that.onmouseenter(oEvent);
			});

};