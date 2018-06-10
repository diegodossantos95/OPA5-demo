/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.LandscapeEntity.
jQuery.sap.declare("sap.landvisz.LandscapeEntity");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new LandscapeEntity.
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
 * <li>{@link #getSystemName systemName} : string</li>
 * <li>{@link #getType type} : sap.landvisz.LandscapeObject</li>
 * <li>{@link #getQualifierText qualifierText} : string</li>
 * <li>{@link #getQualifierTooltip qualifierTooltip} : string</li>
 * <li>{@link #getQualifierType qualifierType} : string</li>
 * <li>{@link #getRenderingSize renderingSize} : sap.landvisz.EntityCSSSize (default: sap.landvisz.EntityCSSSize.Regular)</li>
 * <li>{@link #getDefaultState defaultState} : string</li>
 * <li>{@link #getDescription description} : string</li>
 * <li>{@link #getActions actions} : object</li>
 * <li>{@link #getSystemStatus systemStatus} : sap.landvisz.ModelingStatus (default: sap.landvisz.ModelingStatus.NORMAL)</li>
 * <li>{@link #getStatusTooltip statusTooltip} : string</li>
 * <li>{@link #getExplodeViewWidth explodeViewWidth} : sap.ui.core.CSSSize</li>
 * <li>{@link #getExplodeViewHeight explodeViewHeight} : sap.ui.core.CSSSize</li>
 * <li>{@link #getShowCustomActions showCustomActions} : boolean (default: true)</li>
 * <li>{@link #getShowEntityActions showEntityActions} : boolean (default: true)</li>
 * <li>{@link #getSystemId systemId} : string</li>
 * <li>{@link #getStateIconSrc stateIconSrc} : string</li>
 * <li>{@link #getStateIconTooltip stateIconTooltip} : string</li>
 * <li>{@link #getComponentType componentType} : sap.landvisz.ComponentType</li>
 * <li>{@link #getComponentTypeTooltip componentTypeTooltip} : string</li>
 * <li>{@link #getTrackSystemCount trackSystemCount} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getDataContainers dataContainers} : sap.landvisz.internal.DataContainer[]</li>
 * <li>{@link #getActionBar actionBar} : sap.landvisz.internal.ActionBar[]</li>
 * <li>{@link #getEntityStatus entityStatus} : sap.ui.commons.Image</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.landvisz.LandscapeEntity#event:mouseOverIdenIcon mouseOverIdenIcon} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.landvisz.LandscapeEntity#event:statusSelect statusSelect} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.landvisz.LandscapeEntity#event:trackInfoPress trackInfoPress} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A control to render the system
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.LandscapeEntity
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.LandscapeEntity", { metadata : {

	library : "sap.landvisz",
	properties : {
		"systemName" : {type : "string", group : "Data", defaultValue : null},
		"type" : {type : "sap.landvisz.LandscapeObject", group : "Data", defaultValue : null},
		"qualifierText" : {type : "string", group : "Data", defaultValue : null},
		"qualifierTooltip" : {type : "string", group : "Data", defaultValue : null},
		"qualifierType" : {type : "string", group : "Data", defaultValue : null},
		"renderingSize" : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : sap.landvisz.EntityCSSSize.Regular},
		"defaultState" : {type : "string", group : "Data", defaultValue : null},
		"description" : {type : "string", group : "Data", defaultValue : null},
		"actions" : {type : "object", group : "Data", defaultValue : null},
		"systemStatus" : {type : "sap.landvisz.ModelingStatus", group : "Data", defaultValue : sap.landvisz.ModelingStatus.NORMAL},
		"statusTooltip" : {type : "string", group : "Data", defaultValue : null},
		"explodeViewWidth" : {type : "sap.ui.core.CSSSize", group : "Data", defaultValue : null},
		"explodeViewHeight" : {type : "sap.ui.core.CSSSize", group : "Data", defaultValue : null},
		"showCustomActions" : {type : "boolean", group : "Identification", defaultValue : true},
		"showEntityActions" : {type : "boolean", group : "Data", defaultValue : true},
		"systemId" : {type : "string", group : "Identification", defaultValue : null},
		"stateIconSrc" : {type : "string", group : "Data", defaultValue : null},
		"stateIconTooltip" : {type : "string", group : "Data", defaultValue : null},
		"componentType" : {type : "sap.landvisz.ComponentType", group : "Identification", defaultValue : null},
		"componentTypeTooltip" : {type : "string", group : "Data", defaultValue : null},
		"trackSystemCount" : {type : "string", group : "Misc", defaultValue : null}
	},
	aggregations : {
		"dataContainers" : {type : "sap.landvisz.internal.DataContainer", multiple : true, singularName : "dataContainer"}, 
		"actionBar" : {type : "sap.landvisz.internal.ActionBar", multiple : true, singularName : "actionBar"}, 
		"entityStatus" : {type : "sap.ui.commons.Image", multiple : false}
	},
	events : {
		"mouseOverIdenIcon" : {}, 
		"statusSelect" : {}, 
		"trackInfoPress" : {}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.LandscapeEntity with name <code>sClassName</code> 
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
 * @name sap.landvisz.LandscapeEntity.extend
 * @function
 */

sap.landvisz.LandscapeEntity.M_EVENTS = {'mouseOverIdenIcon':'mouseOverIdenIcon','statusSelect':'statusSelect','trackInfoPress':'trackInfoPress'};


/**
 * Getter for property <code>systemName</code>.
 * name of the system
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>systemName</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getSystemName
 * @function
 */

/**
 * Setter for property <code>systemName</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sSystemName  new value for property <code>systemName</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setSystemName
 * @function
 */


/**
 * Getter for property <code>type</code>.
 * type of the system rendered
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.landvisz.LandscapeObject} the value of property <code>type</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.landvisz.LandscapeObject} oType  new value for property <code>type</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setType
 * @function
 */


/**
 * Getter for property <code>qualifierText</code>.
 * text of qualifier icon
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>qualifierText</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getQualifierText
 * @function
 */

/**
 * Setter for property <code>qualifierText</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sQualifierText  new value for property <code>qualifierText</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setQualifierText
 * @function
 */


/**
 * Getter for property <code>qualifierTooltip</code>.
 * tooltip for qualifier icon
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>qualifierTooltip</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getQualifierTooltip
 * @function
 */

/**
 * Setter for property <code>qualifierTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sQualifierTooltip  new value for property <code>qualifierTooltip</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setQualifierTooltip
 * @function
 */


/**
 * Getter for property <code>qualifierType</code>.
 * text of the qualifier that specifies the server
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>qualifierType</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getQualifierType
 * @function
 */

/**
 * Setter for property <code>qualifierType</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sQualifierType  new value for property <code>qualifierType</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setQualifierType
 * @function
 */


/**
 * Getter for property <code>renderingSize</code>.
 * rendering size of a system
 *
 * Default value is <code>sap.landvisz.EntityCSSSize.Regular</code>
 *
 * @return {sap.landvisz.EntityCSSSize} the value of property <code>renderingSize</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getRenderingSize
 * @function
 */

/**
 * Setter for property <code>renderingSize</code>.
 *
 * Default value is <code>sap.landvisz.EntityCSSSize.Regular</code> 
 *
 * @param {sap.landvisz.EntityCSSSize} oRenderingSize  new value for property <code>renderingSize</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setRenderingSize
 * @function
 */


/**
 * Getter for property <code>defaultState</code>.
 * default state of the system
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>defaultState</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getDefaultState
 * @function
 */

/**
 * Setter for property <code>defaultState</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDefaultState  new value for property <code>defaultState</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setDefaultState
 * @function
 */


/**
 * Getter for property <code>description</code>.
 * description of the identification region
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>description</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getDescription
 * @function
 */

/**
 * Setter for property <code>description</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDescription  new value for property <code>description</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setDescription
 * @function
 */


/**
 * Getter for property <code>actions</code>.
 * actions of entity
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {object} the value of property <code>actions</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getActions
 * @function
 */

/**
 * Setter for property <code>actions</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object} oActions  new value for property <code>actions</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setActions
 * @function
 */


/**
 * Getter for property <code>systemStatus</code>.
 * Modeling status of the entity
 *
 * Default value is <code>sap.landvisz.ModelingStatus.NORMAL</code>
 *
 * @return {sap.landvisz.ModelingStatus} the value of property <code>systemStatus</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getSystemStatus
 * @function
 */

/**
 * Setter for property <code>systemStatus</code>.
 *
 * Default value is <code>sap.landvisz.ModelingStatus.NORMAL</code> 
 *
 * @param {sap.landvisz.ModelingStatus} oSystemStatus  new value for property <code>systemStatus</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setSystemStatus
 * @function
 */


/**
 * Getter for property <code>statusTooltip</code>.
 * tooltip for modelling status
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>statusTooltip</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getStatusTooltip
 * @function
 */

/**
 * Setter for property <code>statusTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sStatusTooltip  new value for property <code>statusTooltip</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setStatusTooltip
 * @function
 */


/**
 * Getter for property <code>explodeViewWidth</code>.
 * Width of the show all view
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>explodeViewWidth</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getExplodeViewWidth
 * @function
 */

/**
 * Setter for property <code>explodeViewWidth</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sExplodeViewWidth  new value for property <code>explodeViewWidth</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setExplodeViewWidth
 * @function
 */


/**
 * Getter for property <code>explodeViewHeight</code>.
 * Height of the show all view
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>explodeViewHeight</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getExplodeViewHeight
 * @function
 */

/**
 * Setter for property <code>explodeViewHeight</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sExplodeViewHeight  new value for property <code>explodeViewHeight</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setExplodeViewHeight
 * @function
 */


/**
 * Getter for property <code>showCustomActions</code>.
 * determines the visiblity of custom actions
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showCustomActions</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getShowCustomActions
 * @function
 */

/**
 * Setter for property <code>showCustomActions</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowCustomActions  new value for property <code>showCustomActions</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setShowCustomActions
 * @function
 */


/**
 * Getter for property <code>showEntityActions</code>.
 * determines the visiblity of entityactions
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showEntityActions</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getShowEntityActions
 * @function
 */

/**
 * Setter for property <code>showEntityActions</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowEntityActions  new value for property <code>showEntityActions</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setShowEntityActions
 * @function
 */


/**
 * Getter for property <code>systemId</code>.
 * System entity ID
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>systemId</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getSystemId
 * @function
 */

/**
 * Setter for property <code>systemId</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sSystemId  new value for property <code>systemId</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setSystemId
 * @function
 */


/**
 * Getter for property <code>stateIconSrc</code>.
 * Icon source of the state of entity
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>stateIconSrc</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getStateIconSrc
 * @function
 */

/**
 * Setter for property <code>stateIconSrc</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sStateIconSrc  new value for property <code>stateIconSrc</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setStateIconSrc
 * @function
 */


/**
 * Getter for property <code>stateIconTooltip</code>.
 * tooltip of modelling status icon
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>stateIconTooltip</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getStateIconTooltip
 * @function
 */

/**
 * Setter for property <code>stateIconTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sStateIconTooltip  new value for property <code>stateIconTooltip</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setStateIconTooltip
 * @function
 */


/**
 * Getter for property <code>componentType</code>.
 * Type of a soution component/deployment type entity
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.landvisz.ComponentType} the value of property <code>componentType</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getComponentType
 * @function
 */

/**
 * Setter for property <code>componentType</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.landvisz.ComponentType} oComponentType  new value for property <code>componentType</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setComponentType
 * @function
 */


/**
 * Getter for property <code>componentTypeTooltip</code>.
 * Tooltip for component type
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>componentTypeTooltip</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getComponentTypeTooltip
 * @function
 */

/**
 * Setter for property <code>componentTypeTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sComponentTypeTooltip  new value for property <code>componentTypeTooltip</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setComponentTypeTooltip
 * @function
 */


/**
 * Getter for property <code>trackSystemCount</code>.
 * Systems count in the track
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>trackSystemCount</code>
 * @public
 * @name sap.landvisz.LandscapeEntity#getTrackSystemCount
 * @function
 */

/**
 * Setter for property <code>trackSystemCount</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTrackSystemCount  new value for property <code>trackSystemCount</code>
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setTrackSystemCount
 * @function
 */


/**
 * Getter for aggregation <code>dataContainers</code>.<br/>
 * aggregations for data container
 * 
 * @return {sap.landvisz.internal.DataContainer[]}
 * @public
 * @name sap.landvisz.LandscapeEntity#getDataContainers
 * @function
 */


/**
 * Inserts a dataContainer into the aggregation named <code>dataContainers</code>.
 *
 * @param {sap.landvisz.internal.DataContainer}
 *          oDataContainer the dataContainer to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the dataContainer should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the dataContainer is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the dataContainer is inserted at 
 *             the last position        
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#insertDataContainer
 * @function
 */

/**
 * Adds some dataContainer <code>oDataContainer</code> 
 * to the aggregation named <code>dataContainers</code>.
 *
 * @param {sap.landvisz.internal.DataContainer}
 *            oDataContainer the dataContainer to add; if empty, nothing is inserted
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#addDataContainer
 * @function
 */

/**
 * Removes an dataContainer from the aggregation named <code>dataContainers</code>.
 *
 * @param {int | string | sap.landvisz.internal.DataContainer} vDataContainer the dataContainer to remove or its index or id
 * @return {sap.landvisz.internal.DataContainer} the removed dataContainer or null
 * @public
 * @name sap.landvisz.LandscapeEntity#removeDataContainer
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>dataContainers</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.landvisz.internal.DataContainer[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.LandscapeEntity#removeAllDataContainers
 * @function
 */

/**
 * Checks for the provided <code>sap.landvisz.internal.DataContainer</code> in the aggregation named <code>dataContainers</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.landvisz.internal.DataContainer}
 *            oDataContainer the dataContainer whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.LandscapeEntity#indexOfDataContainer
 * @function
 */
	

/**
 * Destroys all the dataContainers in the aggregation 
 * named <code>dataContainers</code>.
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#destroyDataContainers
 * @function
 */


/**
 * Getter for aggregation <code>actionBar</code>.<br/>
 * aggregation on action bar control
 * 
 * @return {sap.landvisz.internal.ActionBar[]}
 * @public
 * @name sap.landvisz.LandscapeEntity#getActionBar
 * @function
 */


/**
 * Inserts a actionBar into the aggregation named <code>actionBar</code>.
 *
 * @param {sap.landvisz.internal.ActionBar}
 *          oActionBar the actionBar to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the actionBar should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the actionBar is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the actionBar is inserted at 
 *             the last position        
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#insertActionBar
 * @function
 */

/**
 * Adds some actionBar <code>oActionBar</code> 
 * to the aggregation named <code>actionBar</code>.
 *
 * @param {sap.landvisz.internal.ActionBar}
 *            oActionBar the actionBar to add; if empty, nothing is inserted
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#addActionBar
 * @function
 */

/**
 * Removes an actionBar from the aggregation named <code>actionBar</code>.
 *
 * @param {int | string | sap.landvisz.internal.ActionBar} vActionBar the actionBar to remove or its index or id
 * @return {sap.landvisz.internal.ActionBar} the removed actionBar or null
 * @public
 * @name sap.landvisz.LandscapeEntity#removeActionBar
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>actionBar</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.landvisz.internal.ActionBar[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.LandscapeEntity#removeAllActionBar
 * @function
 */

/**
 * Checks for the provided <code>sap.landvisz.internal.ActionBar</code> in the aggregation named <code>actionBar</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.landvisz.internal.ActionBar}
 *            oActionBar the actionBar whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.LandscapeEntity#indexOfActionBar
 * @function
 */
	

/**
 * Destroys all the actionBar in the aggregation 
 * named <code>actionBar</code>.
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#destroyActionBar
 * @function
 */


/**
 * Getter for aggregation <code>entityStatus</code>.<br/>
 * Modeling status icon
 * 
 * @return {sap.ui.commons.Image}
 * @public
 * @name sap.landvisz.LandscapeEntity#getEntityStatus
 * @function
 */


/**
 * Setter for the aggregated <code>entityStatus</code>.
 * @param {sap.ui.commons.Image} oEntityStatus
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#setEntityStatus
 * @function
 */
	

/**
 * Destroys the entityStatus in the aggregation 
 * named <code>entityStatus</code>.
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#destroyEntityStatus
 * @function
 */


/**
 * fires an event on hovering over identification system icon
 *
 * @name sap.landvisz.LandscapeEntity#mouseOverIdenIcon
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'mouseOverIdenIcon' event of this <code>sap.landvisz.LandscapeEntity</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.LandscapeEntity</code>.<br/> itself. 
 *  
 * fires an event on hovering over identification system icon
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.LandscapeEntity</code>.<br/> itself.
 *
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#attachMouseOverIdenIcon
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'mouseOverIdenIcon' event of this <code>sap.landvisz.LandscapeEntity</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#detachMouseOverIdenIcon
 * @function
 */

/**
 * Fire event mouseOverIdenIcon to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.LandscapeEntity#fireMouseOverIdenIcon
 * @function
 */


/**
 * fires an event on clicking the modelling status
 *
 * @name sap.landvisz.LandscapeEntity#statusSelect
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'statusSelect' event of this <code>sap.landvisz.LandscapeEntity</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.LandscapeEntity</code>.<br/> itself. 
 *  
 * fires an event on clicking the modelling status
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.LandscapeEntity</code>.<br/> itself.
 *
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#attachStatusSelect
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'statusSelect' event of this <code>sap.landvisz.LandscapeEntity</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#detachStatusSelect
 * @function
 */

/**
 * Fire event statusSelect to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.LandscapeEntity#fireStatusSelect
 * @function
 */


/**
 * Fired when info Icon of track entity clicked
 *
 * @name sap.landvisz.LandscapeEntity#trackInfoPress
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'trackInfoPress' event of this <code>sap.landvisz.LandscapeEntity</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.LandscapeEntity</code>.<br/> itself. 
 *  
 * Fired when info Icon of track entity clicked
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.LandscapeEntity</code>.<br/> itself.
 *
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#attachTrackInfoPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'trackInfoPress' event of this <code>sap.landvisz.LandscapeEntity</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeEntity#detachTrackInfoPress
 * @function
 */

/**
 * Fire event trackInfoPress to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.LandscapeEntity} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.LandscapeEntity#fireTrackInfoPress
 * @function
 */

// Start of sap/landvisz/LandscapeEntity.js
///**
// * This file defines behavior for the control,
// */

jQuery.sap.require("sap.landvisz.internal.IdentificationBarRenderer");
jQuery.sap.require("sap.landvisz.EntityConstants");

sap.landvisz.LandscapeEntity.prototype.init = function() {
	this.initializationDone = false;
	this.top = 0;
	this.explodeViewClosed = true;
	this.left = 0;
	this.oHLayout = null;
	this.firstTime = true;
	var sCurrentTheme = sap.ui.getCore().getConfiguration().getTheme();
	this.internalEvent = false;
	this.showMax = true;
	this._imgResourcePath = sap.ui.resource('sap.landvisz',
			'themes/base/img/framework/');
	this._imgFolderPath = "16x16/";
	this.maxIconSrc = this._imgResourcePath + this._imgFolderPath
			+ "maximize_enable_dark.png";
	this.restoreIconSrc = this._imgResourcePath + this._imgFolderPath
			+ "restore_enable_dark.png";
	this.smvIconSrc = this._imgResourcePath + +this._imgFolderPath
			+ "openshowall_enable_dark.png";
	this.smvCollapseIconSrc = this._imgResourcePath + +this._imgFolderPath
			+ "closeshowall_enable_dark.png";

	this.entityAction;
	this.entityActionArray = new Array();

	var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");
	this.SHOW_ALL_TEXT = oBundle.getText("SHOW_ALL");
	this.COLLAPSE_TEXT = oBundle.getText("COLLAPSE_ALL");
	this.MAXIMIZE_TEXT = oBundle.getText("MAXIMIZE");
	this.RESTORE_TEXT = oBundle.getText("RESTORE");
	this.NEXT = oBundle.getText("NEXT");
	this.PREVIOUS = oBundle.getText("PREVIOUS");

	this.createActionButtons(this.SHOW_ALL_TEXT, "showAll", this.smvIconSrc);
	this.createActionButtons(this.COLLAPSE_TEXT, "collapseAll",
			this.smvCollapseIconSrc);
	this.createActionButtons(this.MAXIMIZE_TEXT, "max", this.maxIconSrc);
	this.createActionButtons(this.RESTORE_TEXT, "restore", this.restoreIconSrc);

	this.dialogArray = new Array();
	this.propertyArray = new Array();
	this.expVisible = false;
	this.showMiniNavigation = true;
	this.hasNavigationEvent = false;
	this.hasEntityEvent = false;
	this.containerEvent = false;
	this.maxEnabled = true;
	this.sViewWidth = 0;
	this.sViewHeight = 0;
	this.viewType = "";
	this.showOverlay = false;
	this.overlayFilter = "";
	this.oDialog = new sap.ui.commons.Dialog({
		modal : false,
	});

	this.previousClicked = false;
	this.display = "block";
};

sap.landvisz.LandscapeEntity.prototype.exit = function() {
	this.oHLayout && this.oHLayout.destroy();
	this.oVLayout && this.oVLayout.destroy();
};

sap.landvisz.LandscapeEntity.prototype.createActionButtons = function(tooltip,
		id, iconURI) {
	var identificationHdrID = this.getId();
	this.entityAction = new sap.landvisz.internal.EntityAction(
			identificationHdrID + id + "EntityAction");
	this.entityAction.setActionTooltip(tooltip);
	this.entityActionArray.push(this.entityAction);

};

/**
 * Create the composite parts out of the current settings. Called by the
 * renderer just before rendering
 * 
 * @private
 */
sap.landvisz.LandscapeEntity.prototype.initControls = function() {

	var identificationHdrID = this.getId();

	var rb = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");
	if (!this.oVLayout)
		this.oVLayout = new sap.ui.commons.layout.VerticalLayout(
				identificationHdrID + "-CLVEntityVLayout");
	if (!this.oVLayoutContainer)
		this.oVLayoutContainer = new sap.ui.commons.layout.VerticalLayout(
				identificationHdrID + "-CLVEntityVLayoutContainer");
	if (!this.oVLayoutProperties)
		this.oVLayoutProperties = new sap.ui.commons.layout.VerticalLayout(
				identificationHdrID + "-CLVEntityVLayoutProperties");
	if (!this.oHLayout)
		this.oHLayout = new sap.ui.commons.layout.HorizontalLayout(
				identificationHdrID + "CLVEntityHLayout");
	if (!this.oIdnBar)
		this.oIdnBar = new sap.landvisz.internal.IdentificationBar(
				identificationHdrID + "-CLVEntityIdnRegion");
	if (!this.modelStatus)
		this.modelStatus = new sap.landvisz.internal.ModelingStatus(
				identificationHdrID + "-CLVEntityModelingStatus");
	if (!this.propertyHeaders)
		this.propertyHeaders = new Array();
	this.selectedIndex = 0;
	this.dataContainer;
	this.headerBtn;
	this.navItem;
	this.isAggregated;
	if (!this.oHLayoutMiniNavigation)
		this.oHLayoutMiniNavigation = new sap.ui.commons.layout.HorizontalLayout(
				identificationHdrID + "CLVEntityMiniNavigationHLayout");

	if (!this.oHLayoutAction)
		this.oHLayoutAction = new sap.ui.commons.layout.HorizontalLayout(
				identificationHdrID + "CLVEntityActions");

	if (!this.oHLayoutAllAction)
		this.oHLayoutAllAction = new sap.ui.commons.layout.HorizontalLayout(
				identificationHdrID + "CLVEntityAllActions");

	this.smvContainer;
	this.containerWidth;
	this.oToolBarBtn;
	this.visibleTabCount = 0;

	// changes for tab renderer
	if (!this.entityHeader)
		this.entityHeader = new sap.ui.commons.TabStrip(identificationHdrID
				+ "-CLVTabStrip");

	if (!this.oHeadersLayout)
		this.oHeadersLayout = new sap.ui.commons.layout.HorizontalLayout(
				identificationHdrID + "-CLVHeadersLayout");

	if (!this.previousIcon)
		this.nextIcon = new sap.ui.commons.Image(identificationHdrID
				+ "-NextImage");
	if (!this.previousIcon)
		this.previousIcon = new sap.ui.commons.Image(identificationHdrID
				+ "-PreviousImage");

	if (!this.oSingleHeaderLayout)
		this.oSingleHeaderLayout = new sap.ui.commons.layout.HorizontalLayout(
				identificationHdrID + "-oSingleHeaderLayout");
	if (!this.oSingleHeaderLabel)
		this.oSingleHeaderLabel = new sap.ui.commons.Label(identificationHdrID
				+ "-oSingleHeaderLabel");

	if (!this.oVLayoutOverlay)
		this.oVLayoutOverlay = new sap.ui.commons.layout.VerticalLayout(
				identificationHdrID + "-vlayoutOverlay");
	this.nextEnabled = false;
	this.previousEnable = false;

	this.entityMaximized;
	
	var that = this;
					this.infoIcon = new sap.ui.core.Icon({src:"sap-icon://hint",
													  press: function(){
														  that.fireTrackInfoPress();
													  }
													}).addStyleClass('trackInfoIcon');

};
// sap.landvisz.LandscapeEntity.prototype.select = function(oEvent) {
// this.fireSelect();
// };

sap.landvisz.LandscapeEntity.prototype.onclick = function(oEvent) {
	// if (sap.landvisz.EntityConstants.internalEvent == true) {
	// sap.landvisz.EntityConstants.internalEvent = false;
	// this.fireSelect();
	// }
	//
	if (oEvent.srcControl.getTooltip() == this.MAXIMIZE_TEXT)
		this.display = "none";
	else
		this.display = "block";
};

/**
 * Rerendering handling
 * 
 * @private
 */
sap.landvisz.LandscapeEntity.prototype.onAfterRendering = function() {

	setTimeout(function() {
		var smv = jQuery.sap.byId("SMV");
		var smvChild;
		if (smv && smv.length > 0) {
			for ( var i = 0; i < smv[0].children.length; i++) {
				// smv[0].children[i].show('slow');
				smvChild = jQuery.sap.byId(smv[0].children[i].id);
				smvChild.show(700);

			}
		}
	}, 800);
	if (this.entityMaximized == true) {
	
	var mininavigationmaxWidth = this.containerWidth - 2;
	jQuery.sap.byId(this.oHLayoutMiniNavigation.getId())
				.css({
					width :  mininavigationmaxWidth,
				});
	
		var identificationHdrID = this.getId();
		var propHeight = this.sViewHeight - 32 - 41;
		var propWidth = this.sViewWidth - 33 - 100;
		jQuery.sap.byId(identificationHdrID + "-CLVEntityVLayoutProperties")
				.css({
					height : propHeight,
					width : propWidth,
					"display" : this.display
				});
	}
	var layoutWidth = this.containerWidth;
	if (this.entityMaximized != true)
		layoutWidth = (layoutWidth * 12);
	var headerLayout = jQuery.sap.byId(this.oHeadersLayout.getId());

	headerLayout.css({
		width : layoutWidth,
	});

	var navigationTabs = this.oHeadersLayout.getContent();
	var navTab;
	var navTabHtml;
	if (navigationTabs && navigationTabs.length > 1) {

		for ( var i = 0; i < navigationTabs.length; i++) {
			navTab = navigationTabs[i];
			navTabHtml = jQuery.sap.byId(navTab.getId());
			if (navTab.inDisplay == true) {
				navTabHtml.show();
			} else
				navTabHtml.hide();
		}
	}

	var tabs = this.getDataContainers();
	var tab;
	var tabHtml;
	if (tabs && tabs.length > 1) {

		for ( var i = 0; i < tabs.length; i++) {
			tab = tabs[i];
			tabHtml = jQuery.sap.byId(tab.getId());
			if (tab.inDisplay == true) {
				tabHtml.show(700);
			} else
				tabHtml.hide(500);
		}
	}
	this.previousClicked = false;
};
