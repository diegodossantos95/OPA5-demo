/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.LandscapeViewer.
jQuery.sap.declare("sap.landvisz.LandscapeViewer");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.landvisz.Option");


/**
 * Constructor for a new LandscapeViewer.
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
 * <li>{@link #getDefaultDependencyView defaultDependencyView} : sap.landvisz.DependencyType (default: sap.landvisz.DependencyType.NETWORK_VIEW)</li>
 * <li>{@link #getHeight height} : int</li>
 * <li>{@link #getWidth width} : int</li>
 * <li>{@link #getTitle title} : string</li>
 * <li>{@link #getNetworkDependencyLabel networkDependencyLabel} : string (default: 'Network View')</li>
 * <li>{@link #getBoxDependencyLabel boxDependencyLabel} : string (default: 'Box View')</li>
 * <li>{@link #getBoxDependencyLevels boxDependencyLevels} : string[]</li>
 * <li>{@link #getShowDependencyNavigator showDependencyNavigator} : boolean (default: true)</li>
 * <li>{@link #getVisibleDependency visibleDependency} : sap.landvisz.DependencyVisibility (default: sap.landvisz.DependencyVisibility.BOTH)</li>
 * <li>{@link #getViewType viewType} : sap.landvisz.ViewType</li>
 * <li>{@link #getNavigationPath navigationPath} : string</li>
 * <li>{@link #getHasParent hasParent} : boolean (default: true)</li>
 * <li>{@link #getSelectionViewPosition selectionViewPosition} : sap.landvisz.SelectionViewPosition (default: sap.landvisz.SelectionViewPosition.CENTER)</li>
 * <li>{@link #getShowClose showClose} : boolean (default: true)</li>
 * <li>{@link #getComponentViewLabel componentViewLabel} : string (default: 'Component View')</li>
 * <li>{@link #getDeploymentViewLabel deploymentViewLabel} : string (default: 'Deployment View')</li>
 * <li>{@link #getSolutionOptionType solutionOptionType} : sap.landvisz.OptionType</li>
 * <li>{@link #getSolutionType solutionType} : sap.landvisz.SolutionType</li>
 * <li>{@link #getShowDeploymentTypeSection showDeploymentTypeSection} : boolean (default: false)</li>
 * <li>{@link #getDeploymentOptionsLabel deploymentOptionsLabel} : string (default: 'Deployment Options :')</li>
 * <li>{@link #getDeploymentOptionsTooltip deploymentOptionsTooltip} : string</li>
 * <li>{@link #getComponentViewTooltip componentViewTooltip} : string</li>
 * <li>{@link #getDeploymentViewTooltip deploymentViewTooltip} : string</li>
 * <li>{@link #getCloseButtonTooltip closeButtonTooltip} : string</li>
 * <li>{@link #getPlugContentHeight plugContentHeight} : int (default: 0)</li>
 * <li>{@link #getConnectionLine connectionLine} : sap.landvisz.ConnectionLine (default: sap.landvisz.ConnectionLine.Line)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getSystems systems} : sap.landvisz.LandscapeEntity[]</li>
 * <li>{@link #getConnectionEntities connectionEntities} : sap.landvisz.ConnectionEntity[]</li>
 * <li>{@link #getConnectors connectors} : sap.landvisz.Connector[]</li>
 * <li>{@link #getSolutionOptions solutionOptions} : sap.landvisz.Option[]</li>
 * <li>{@link #getPlugContent plugContent} : sap.ui.core.Control</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.landvisz.LandscapeViewer#event:close close} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.landvisz.LandscapeViewer#event:loadSolutionView loadSolutionView} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.landvisz.Option#constructor sap.landvisz.Option}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Visualize the landscape objects in a new user experience
 * @extends sap.landvisz.Option
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.LandscapeViewer
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.Option.extend("sap.landvisz.LandscapeViewer", { metadata : {

	publicMethods : [
		// methods
		"appendNavigationPath", "getSelectedOption", "getCurrentSolutionView"
	],
	library : "sap.landvisz",
	properties : {
		"defaultDependencyView" : {type : "sap.landvisz.DependencyType", group : "Identification", defaultValue : sap.landvisz.DependencyType.NETWORK_VIEW},
		"height" : {type : "int", group : "Dimension", defaultValue : null},
		"width" : {type : "int", group : "Dimension", defaultValue : null},
		"title" : {type : "string", group : "Data", defaultValue : null},
		"networkDependencyLabel" : {type : "string", group : "Data", defaultValue : 'Network View'},
		"boxDependencyLabel" : {type : "string", group : "Data", defaultValue : 'Box View'},
		"boxDependencyLevels" : {type : "string[]", group : "Data", defaultValue : null},
		"showDependencyNavigator" : {type : "boolean", group : "Identification", defaultValue : true},
		"visibleDependency" : {type : "sap.landvisz.DependencyVisibility", group : "Identification", defaultValue : sap.landvisz.DependencyVisibility.BOTH},
		"viewType" : {type : "sap.landvisz.ViewType", group : "Identification", defaultValue : null},
		"navigationPath" : {type : "string", group : "Data", defaultValue : null},
		"hasParent" : {type : "boolean", group : "Misc", defaultValue : true},
		"selectionViewPosition" : {type : "sap.landvisz.SelectionViewPosition", group : "Identification", defaultValue : sap.landvisz.SelectionViewPosition.CENTER},
		"showClose" : {type : "boolean", group : "Identification", defaultValue : true},
		"componentViewLabel" : {type : "string", group : "Data", defaultValue : 'Component View'},
		"deploymentViewLabel" : {type : "string", group : "Data", defaultValue : 'Deployment View'},
		"solutionOptionType" : {type : "sap.landvisz.OptionType", group : "Identification", defaultValue : null},
		"solutionType" : {type : "sap.landvisz.SolutionType", group : "Identification", defaultValue : null},
		"showDeploymentTypeSection" : {type : "boolean", group : "Identification", defaultValue : false},
		"deploymentOptionsLabel" : {type : "string", group : "Data", defaultValue : 'Deployment Options :'},
		"deploymentOptionsTooltip" : {type : "string", group : "Data", defaultValue : null},
		"componentViewTooltip" : {type : "string", group : "Data", defaultValue : null},
		"deploymentViewTooltip" : {type : "string", group : "Data", defaultValue : null},
		"closeButtonTooltip" : {type : "string", group : "Data", defaultValue : null},
		"plugContentHeight" : {type : "int", group : "Misc", defaultValue : 0},
		"connectionLine" : {type : "sap.landvisz.ConnectionLine", group : "Misc", defaultValue : sap.landvisz.ConnectionLine.Line}
	},
	aggregations : {
		"systems" : {type : "sap.landvisz.LandscapeEntity", multiple : true, singularName : "system"}, 
		"connectionEntities" : {type : "sap.landvisz.ConnectionEntity", multiple : true, singularName : "connectionEntity"}, 
		"connectors" : {type : "sap.landvisz.Connector", multiple : true, singularName : "connector"}, 
		"solutionOptions" : {type : "sap.landvisz.Option", multiple : true, singularName : "solutionOption"}, 
		"plugContent" : {type : "sap.ui.core.Control", multiple : false}
	},
	events : {
		"close" : {}, 
		"loadSolutionView" : {}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.LandscapeViewer with name <code>sClassName</code> 
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
 * @name sap.landvisz.LandscapeViewer.extend
 * @function
 */

sap.landvisz.LandscapeViewer.M_EVENTS = {'close':'close','loadSolutionView':'loadSolutionView'};


/**
 * Getter for property <code>defaultDependencyView</code>.
 * View type of landscape view
 *
 * Default value is <code>sap.landvisz.DependencyType.NETWORK_VIEW</code>
 *
 * @return {sap.landvisz.DependencyType} the value of property <code>defaultDependencyView</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getDefaultDependencyView
 * @function
 */

/**
 * Setter for property <code>defaultDependencyView</code>.
 *
 * Default value is <code>sap.landvisz.DependencyType.NETWORK_VIEW</code> 
 *
 * @param {sap.landvisz.DependencyType} oDefaultDependencyView  new value for property <code>defaultDependencyView</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setDefaultDependencyView
 * @function
 */


/**
 * Getter for property <code>height</code>.
 * Height of Viewer container
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>height</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getHeight
 * @function
 */

/**
 * Setter for property <code>height</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iHeight  new value for property <code>height</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setHeight
 * @function
 */


/**
 * Getter for property <code>width</code>.
 * width of the Viewer container
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>width</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iWidth  new value for property <code>width</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setWidth
 * @function
 */


/**
 * Getter for property <code>title</code>.
 * Header of the rendered view
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>title</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getTitle
 * @function
 */

/**
 * Setter for property <code>title</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTitle  new value for property <code>title</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setTitle
 * @function
 */


/**
 * Getter for property <code>networkDependencyLabel</code>.
 * Label of the network view
 *
 * Default value is <code>Network View</code>
 *
 * @return {string} the value of property <code>networkDependencyLabel</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getNetworkDependencyLabel
 * @function
 */

/**
 * Setter for property <code>networkDependencyLabel</code>.
 *
 * Default value is <code>Network View</code> 
 *
 * @param {string} sNetworkDependencyLabel  new value for property <code>networkDependencyLabel</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setNetworkDependencyLabel
 * @function
 */


/**
 * Getter for property <code>boxDependencyLabel</code>.
 * Label of box view
 *
 * Default value is <code>Box View</code>
 *
 * @return {string} the value of property <code>boxDependencyLabel</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getBoxDependencyLabel
 * @function
 */

/**
 * Setter for property <code>boxDependencyLabel</code>.
 *
 * Default value is <code>Box View</code> 
 *
 * @param {string} sBoxDependencyLabel  new value for property <code>boxDependencyLabel</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setBoxDependencyLabel
 * @function
 */


/**
 * Getter for property <code>boxDependencyLevels</code>.
 * Levels information in Box dependency view
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string[]} the value of property <code>boxDependencyLevels</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getBoxDependencyLevels
 * @function
 */

/**
 * Setter for property <code>boxDependencyLevels</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string[]} aBoxDependencyLevels  new value for property <code>boxDependencyLevels</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setBoxDependencyLevels
 * @function
 */


/**
 * Getter for property <code>showDependencyNavigator</code>.
 * Navigator for dependency views
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showDependencyNavigator</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getShowDependencyNavigator
 * @function
 */

/**
 * Setter for property <code>showDependencyNavigator</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowDependencyNavigator  new value for property <code>showDependencyNavigator</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setShowDependencyNavigator
 * @function
 */


/**
 * Getter for property <code>visibleDependency</code>.
 * Dependency View Visibility
 *
 * Default value is <code>sap.landvisz.DependencyVisibility.BOTH</code>
 *
 * @return {sap.landvisz.DependencyVisibility} the value of property <code>visibleDependency</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getVisibleDependency
 * @function
 */

/**
 * Setter for property <code>visibleDependency</code>.
 *
 * Default value is <code>sap.landvisz.DependencyVisibility.BOTH</code> 
 *
 * @param {sap.landvisz.DependencyVisibility} oVisibleDependency  new value for property <code>visibleDependency</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setVisibleDependency
 * @function
 */


/**
 * Getter for property <code>viewType</code>.
 * View type of landscape view
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.landvisz.ViewType} the value of property <code>viewType</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getViewType
 * @function
 */

/**
 * Setter for property <code>viewType</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.landvisz.ViewType} oViewType  new value for property <code>viewType</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setViewType
 * @function
 */


/**
 * Getter for property <code>navigationPath</code>.
 * Text displayed in the dependency view
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>navigationPath</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getNavigationPath
 * @function
 */

/**
 * Setter for property <code>navigationPath</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sNavigationPath  new value for property <code>navigationPath</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setNavigationPath
 * @function
 */


/**
 * Getter for property <code>hasParent</code>.
 * control has to be added in the container or directly in the window.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>hasParent</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getHasParent
 * @function
 */

/**
 * Setter for property <code>hasParent</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bHasParent  new value for property <code>hasParent</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setHasParent
 * @function
 */


/**
 * Getter for property <code>selectionViewPosition</code>.
 * positions for selection view entity
 *
 * Default value is <code>sap.landvisz.SelectionViewPosition.CENTER</code>
 *
 * @return {sap.landvisz.SelectionViewPosition} the value of property <code>selectionViewPosition</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getSelectionViewPosition
 * @function
 */

/**
 * Setter for property <code>selectionViewPosition</code>.
 *
 * Default value is <code>sap.landvisz.SelectionViewPosition.CENTER</code> 
 *
 * @param {sap.landvisz.SelectionViewPosition} oSelectionViewPosition  new value for property <code>selectionViewPosition</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setSelectionViewPosition
 * @function
 */


/**
 * Getter for property <code>showClose</code>.
 * close button visibility
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showClose</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getShowClose
 * @function
 */

/**
 * Setter for property <code>showClose</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowClose  new value for property <code>showClose</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setShowClose
 * @function
 */


/**
 * Getter for property <code>componentViewLabel</code>.
 * Label for the component view
 *
 * Default value is <code>Component View</code>
 *
 * @return {string} the value of property <code>componentViewLabel</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getComponentViewLabel
 * @function
 */

/**
 * Setter for property <code>componentViewLabel</code>.
 *
 * Default value is <code>Component View</code> 
 *
 * @param {string} sComponentViewLabel  new value for property <code>componentViewLabel</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setComponentViewLabel
 * @function
 */


/**
 * Getter for property <code>deploymentViewLabel</code>.
 * Label for deployment view.
 *
 * Default value is <code>Deployment View</code>
 *
 * @return {string} the value of property <code>deploymentViewLabel</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getDeploymentViewLabel
 * @function
 */

/**
 * Setter for property <code>deploymentViewLabel</code>.
 *
 * Default value is <code>Deployment View</code> 
 *
 * @param {string} sDeploymentViewLabel  new value for property <code>deploymentViewLabel</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setDeploymentViewLabel
 * @function
 */


/**
 * Getter for property <code>solutionOptionType</code>.
 * determines whether the option is rendered on view or entity
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.landvisz.OptionType} the value of property <code>solutionOptionType</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getSolutionOptionType
 * @function
 */

/**
 * Setter for property <code>solutionOptionType</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.landvisz.OptionType} oSolutionOptionType  new value for property <code>solutionOptionType</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setSolutionOptionType
 * @function
 */


/**
 * Getter for property <code>solutionType</code>.
 * Type of solution rendered
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.landvisz.SolutionType} the value of property <code>solutionType</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getSolutionType
 * @function
 */

/**
 * Setter for property <code>solutionType</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.landvisz.SolutionType} oSolutionType  new value for property <code>solutionType</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setSolutionType
 * @function
 */


/**
 * Getter for property <code>showDeploymentTypeSection</code>.
 * Deployment type section
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>showDeploymentTypeSection</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getShowDeploymentTypeSection
 * @function
 */

/**
 * Setter for property <code>showDeploymentTypeSection</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bShowDeploymentTypeSection  new value for property <code>showDeploymentTypeSection</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setShowDeploymentTypeSection
 * @function
 */


/**
 * Getter for property <code>deploymentOptionsLabel</code>.
 * Label for the options
 *
 * Default value is <code>Deployment Options :</code>
 *
 * @return {string} the value of property <code>deploymentOptionsLabel</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getDeploymentOptionsLabel
 * @function
 */

/**
 * Setter for property <code>deploymentOptionsLabel</code>.
 *
 * Default value is <code>Deployment Options :</code> 
 *
 * @param {string} sDeploymentOptionsLabel  new value for property <code>deploymentOptionsLabel</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setDeploymentOptionsLabel
 * @function
 */


/**
 * Getter for property <code>deploymentOptionsTooltip</code>.
 * tooltip of label for the options
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>deploymentOptionsTooltip</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getDeploymentOptionsTooltip
 * @function
 */

/**
 * Setter for property <code>deploymentOptionsTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDeploymentOptionsTooltip  new value for property <code>deploymentOptionsTooltip</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setDeploymentOptionsTooltip
 * @function
 */


/**
 * Getter for property <code>componentViewTooltip</code>.
 * tooltip for component view button
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>componentViewTooltip</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getComponentViewTooltip
 * @function
 */

/**
 * Setter for property <code>componentViewTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sComponentViewTooltip  new value for property <code>componentViewTooltip</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setComponentViewTooltip
 * @function
 */


/**
 * Getter for property <code>deploymentViewTooltip</code>.
 * tooltip for deployment view button
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>deploymentViewTooltip</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getDeploymentViewTooltip
 * @function
 */

/**
 * Setter for property <code>deploymentViewTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDeploymentViewTooltip  new value for property <code>deploymentViewTooltip</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setDeploymentViewTooltip
 * @function
 */


/**
 * Getter for property <code>closeButtonTooltip</code>.
 * tooltip for close button
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>closeButtonTooltip</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getCloseButtonTooltip
 * @function
 */

/**
 * Setter for property <code>closeButtonTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sCloseButtonTooltip  new value for property <code>closeButtonTooltip</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setCloseButtonTooltip
 * @function
 */


/**
 * Getter for property <code>plugContentHeight</code>.
 * Specify the height of plugged content
 *
 * Default value is <code>0</code>
 *
 * @return {int} the value of property <code>plugContentHeight</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getPlugContentHeight
 * @function
 */

/**
 * Setter for property <code>plugContentHeight</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {int} iPlugContentHeight  new value for property <code>plugContentHeight</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setPlugContentHeight
 * @function
 */


/**
 * Getter for property <code>connectionLine</code>.
 * Type of line to be drawn
 *
 * Default value is <code>sap.landvisz.ConnectionLine.Line</code>
 *
 * @return {sap.landvisz.ConnectionLine} the value of property <code>connectionLine</code>
 * @public
 * @name sap.landvisz.LandscapeViewer#getConnectionLine
 * @function
 */

/**
 * Setter for property <code>connectionLine</code>.
 *
 * Default value is <code>sap.landvisz.ConnectionLine.Line</code> 
 *
 * @param {sap.landvisz.ConnectionLine} oConnectionLine  new value for property <code>connectionLine</code>
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setConnectionLine
 * @function
 */


/**
 * Getter for aggregation <code>systems</code>.<br/>
 * Systems to be rendered in the landscape viewer
 * 
 * @return {sap.landvisz.LandscapeEntity[]}
 * @public
 * @name sap.landvisz.LandscapeViewer#getSystems
 * @function
 */


/**
 * Inserts a system into the aggregation named <code>systems</code>.
 *
 * @param {sap.landvisz.LandscapeEntity}
 *          oSystem the system to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the system should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the system is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the system is inserted at 
 *             the last position        
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#insertSystem
 * @function
 */

/**
 * Adds some system <code>oSystem</code> 
 * to the aggregation named <code>systems</code>.
 *
 * @param {sap.landvisz.LandscapeEntity}
 *            oSystem the system to add; if empty, nothing is inserted
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#addSystem
 * @function
 */

/**
 * Removes an system from the aggregation named <code>systems</code>.
 *
 * @param {int | string | sap.landvisz.LandscapeEntity} vSystem the system to remove or its index or id
 * @return {sap.landvisz.LandscapeEntity} the removed system or null
 * @public
 * @name sap.landvisz.LandscapeViewer#removeSystem
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>systems</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.landvisz.LandscapeEntity[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.LandscapeViewer#removeAllSystems
 * @function
 */

/**
 * Checks for the provided <code>sap.landvisz.LandscapeEntity</code> in the aggregation named <code>systems</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.landvisz.LandscapeEntity}
 *            oSystem the system whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.LandscapeViewer#indexOfSystem
 * @function
 */
	

/**
 * Destroys all the systems in the aggregation 
 * named <code>systems</code>.
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#destroySystems
 * @function
 */


/**
 * Getter for aggregation <code>connectionEntities</code>.<br/>
 * Optional: connection Entity between two systems.
 * 
 * @return {sap.landvisz.ConnectionEntity[]}
 * @public
 * @name sap.landvisz.LandscapeViewer#getConnectionEntities
 * @function
 */


/**
 * Inserts a connectionEntity into the aggregation named <code>connectionEntities</code>.
 *
 * @param {sap.landvisz.ConnectionEntity}
 *          oConnectionEntity the connectionEntity to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the connectionEntity should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the connectionEntity is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the connectionEntity is inserted at 
 *             the last position        
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#insertConnectionEntity
 * @function
 */

/**
 * Adds some connectionEntity <code>oConnectionEntity</code> 
 * to the aggregation named <code>connectionEntities</code>.
 *
 * @param {sap.landvisz.ConnectionEntity}
 *            oConnectionEntity the connectionEntity to add; if empty, nothing is inserted
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#addConnectionEntity
 * @function
 */

/**
 * Removes an connectionEntity from the aggregation named <code>connectionEntities</code>.
 *
 * @param {int | string | sap.landvisz.ConnectionEntity} vConnectionEntity the connectionEntity to remove or its index or id
 * @return {sap.landvisz.ConnectionEntity} the removed connectionEntity or null
 * @public
 * @name sap.landvisz.LandscapeViewer#removeConnectionEntity
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>connectionEntities</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.landvisz.ConnectionEntity[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.LandscapeViewer#removeAllConnectionEntities
 * @function
 */

/**
 * Checks for the provided <code>sap.landvisz.ConnectionEntity</code> in the aggregation named <code>connectionEntities</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.landvisz.ConnectionEntity}
 *            oConnectionEntity the connectionEntity whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.LandscapeViewer#indexOfConnectionEntity
 * @function
 */
	

/**
 * Destroys all the connectionEntities in the aggregation 
 * named <code>connectionEntities</code>.
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#destroyConnectionEntities
 * @function
 */


/**
 * Getter for aggregation <code>connectors</code>.<br/>
 * connector contains from and to information
 * 
 * @return {sap.landvisz.Connector[]}
 * @public
 * @name sap.landvisz.LandscapeViewer#getConnectors
 * @function
 */


/**
 * Inserts a connector into the aggregation named <code>connectors</code>.
 *
 * @param {sap.landvisz.Connector}
 *          oConnector the connector to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the connector should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the connector is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the connector is inserted at 
 *             the last position        
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#insertConnector
 * @function
 */

/**
 * Adds some connector <code>oConnector</code> 
 * to the aggregation named <code>connectors</code>.
 *
 * @param {sap.landvisz.Connector}
 *            oConnector the connector to add; if empty, nothing is inserted
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#addConnector
 * @function
 */

/**
 * Removes an connector from the aggregation named <code>connectors</code>.
 *
 * @param {int | string | sap.landvisz.Connector} vConnector the connector to remove or its index or id
 * @return {sap.landvisz.Connector} the removed connector or null
 * @public
 * @name sap.landvisz.LandscapeViewer#removeConnector
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>connectors</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.landvisz.Connector[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.LandscapeViewer#removeAllConnectors
 * @function
 */

/**
 * Checks for the provided <code>sap.landvisz.Connector</code> in the aggregation named <code>connectors</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.landvisz.Connector}
 *            oConnector the connector whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.LandscapeViewer#indexOfConnector
 * @function
 */
	

/**
 * Destroys all the connectors in the aggregation 
 * named <code>connectors</code>.
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#destroyConnectors
 * @function
 */


/**
 * Getter for aggregation <code>solutionOptions</code>.<br/>
 * Options for the solution
 * 
 * @return {sap.landvisz.Option[]}
 * @public
 * @name sap.landvisz.LandscapeViewer#getSolutionOptions
 * @function
 */


/**
 * Inserts a solutionOption into the aggregation named <code>solutionOptions</code>.
 *
 * @param {sap.landvisz.Option}
 *          oSolutionOption the solutionOption to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the solutionOption should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the solutionOption is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the solutionOption is inserted at 
 *             the last position        
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#insertSolutionOption
 * @function
 */

/**
 * Adds some solutionOption <code>oSolutionOption</code> 
 * to the aggregation named <code>solutionOptions</code>.
 *
 * @param {sap.landvisz.Option}
 *            oSolutionOption the solutionOption to add; if empty, nothing is inserted
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#addSolutionOption
 * @function
 */

/**
 * Removes an solutionOption from the aggregation named <code>solutionOptions</code>.
 *
 * @param {int | string | sap.landvisz.Option} vSolutionOption the solutionOption to remove or its index or id
 * @return {sap.landvisz.Option} the removed solutionOption or null
 * @public
 * @name sap.landvisz.LandscapeViewer#removeSolutionOption
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>solutionOptions</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.landvisz.Option[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.LandscapeViewer#removeAllSolutionOptions
 * @function
 */

/**
 * Checks for the provided <code>sap.landvisz.Option</code> in the aggregation named <code>solutionOptions</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.landvisz.Option}
 *            oSolutionOption the solutionOption whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.LandscapeViewer#indexOfSolutionOption
 * @function
 */
	

/**
 * Destroys all the solutionOptions in the aggregation 
 * named <code>solutionOptions</code>.
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#destroySolutionOptions
 * @function
 */


/**
 * Getter for aggregation <code>plugContent</code>.<br/>
 * a control which can be plugged into this control and can be only plugged in top section.
 * 
 * @return {sap.ui.core.Control}
 * @public
 * @name sap.landvisz.LandscapeViewer#getPlugContent
 * @function
 */


/**
 * Setter for the aggregated <code>plugContent</code>.
 * @param {sap.ui.core.Control} oPlugContent
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#setPlugContent
 * @function
 */
	

/**
 * Destroys the plugContent in the aggregation 
 * named <code>plugContent</code>.
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#destroyPlugContent
 * @function
 */


/**
 * closes the view
 *
 * @name sap.landvisz.LandscapeViewer#close
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'close' event of this <code>sap.landvisz.LandscapeViewer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.LandscapeViewer</code>.<br/> itself. 
 *  
 * closes the view
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.LandscapeViewer</code>.<br/> itself.
 *
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#attachClose
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'close' event of this <code>sap.landvisz.LandscapeViewer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#detachClose
 * @function
 */

/**
 * Fire event close to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.LandscapeViewer#fireClose
 * @function
 */


/**
 * load the solution view either deployment or component
 *
 * @name sap.landvisz.LandscapeViewer#loadSolutionView
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'loadSolutionView' event of this <code>sap.landvisz.LandscapeViewer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.landvisz.LandscapeViewer</code>.<br/> itself. 
 *  
 * load the solution view either deployment or component
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.landvisz.LandscapeViewer</code>.<br/> itself.
 *
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#attachLoadSolutionView
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'loadSolutionView' event of this <code>sap.landvisz.LandscapeViewer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.LandscapeViewer#detachLoadSolutionView
 * @function
 */

/**
 * Fire event loadSolutionView to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.landvisz.LandscapeViewer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.landvisz.LandscapeViewer#fireLoadSolutionView
 * @function
 */


/**
 * Append the text in the navigation path
 *
 * @name sap.landvisz.LandscapeViewer#appendNavigationPath
 * @function
 * @param {string} sNavigationText
 *         text to be appended in the navigation path
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * returns an object of the internal connection entity
 *
 * @name sap.landvisz.LandscapeViewer#getSelectedOption
 * @function
 * @type object
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * return the current solution loaded.
 *
 * @name sap.landvisz.LandscapeViewer#getCurrentSolutionView
 * @function
 * @type string
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/landvisz/LandscapeViewer.js
jQuery.sap.require("sap.landvisz.internal.Connection");
jQuery.sap.require("sap.landvisz.Option");
jQuery.sap.require("sap.landvisz.libs.lvsvg");

sap.landvisz.LandscapeViewer.prototype.init = function() {

       this.initializationDone = false;
       this.windowHeight = 0;
       this.windowWidth = 0;
       this.connection = sap.landvisz.internal.Connection;
       this.boxModeHeight = 90;
       this.currentView = "";
       this.firstTime = true;

       this.boxLeftMargine = 0;
       this.boxTopMargine = 0;
       this.hasBoxThirdLevel = false;
       this.firstTime = true;
       this.lindkedEntities = [];
       var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");
       this.SHOW_ALL_TEXT = oBundle.getText("SHOW_ALL");
       this.COLLAPSE_TEXT = oBundle.getText("COLLAPSE_EXPLODE_VIEW");
       this.MAXIMIZE_TEXT = oBundle.getText("MAXIMIZE");
       this.RESTORE_TEXT = oBundle.getText("RESTORE");
//       this.SHOW_NAV_TEXT = oBundle.getText("SHOW_NAVIGATION_PANEL");
//       this.HIDE_NAV_TEXT = oBundle.getText("HIDE_NAVIGATION_PANEL");
       this.CLOSE = oBundle.getText("CLOSE");
       this.srcEntity = "";
       this.currentViewOptionId = "";
       this.currentSolutionView = "";
       this.selectedOptionEntity = null;
       
                    var win = jQuery(window);
                    if (this.getHeight() && "" != this.getHeight()) {
                           this.windowHeight = this.getHeight();
                    }else{
                           this.windowHeight = win.height();
                    }
                    if (this.getWidth()) {
                           this.windowWidth = this.getWidth();
                    } else {
                           this.windowWidth = win.width();
                    }

};

sap.landvisz.LandscapeViewer.prototype.onwindowresize = function(oEvent) {

	   var viewer = jQuery.sap.byId(this.getId());
       if (this.getHasParent() == false) {
             var win = jQuery(window);
             var resizeWidth = win.width();
             var resizeHeight = win.height();
             this.windowHeight = resizeHeight;
             this.windowWidth = resizeWidth;
             this.invalidate();
             
       } else if(viewer && viewer[0] && viewer[0].parentElement ) {
             this.windowWidth = viewer[0].parentElement.clientWidth;
             this.windowHeight = viewer[0].parentElement.clientHeight;
             this.invalidate();
       }
};

sap.landvisz.LandscapeViewer.prototype.onclick = function(oEvent) {

       var systems = this.getSystems();
       var selectedSystem = systems[0];
       var container = jQuery.sap.byId(this.getId() + "-container");
       var selectionView = jQuery.sap.byId(selectedSystem.getId());

       if (this.getViewType() == sap.landvisz.ViewType.SELECTION_VIEW && oEvent.srcControl.getTooltip() == this.MAXIMIZE_TEXT) {


             if (oEvent.srcControl.getTooltip() == this.SHOW_ALL_TEXT)
                    selectedSystem.expVisible = true;
             
              container.css({
                    height : this.entityHeight,
                    width : this.entityWidth
             });


             jQuery.sap.byId(selectedSystem.getId() + "-CLVEntityVLayoutContainer")
                           .css({
                                 "display" : "none"
                           });    
             this._animateMaximizeView(selectedSystem, container);
       
             setTimeout(function() {
                    jQuery.sap.byId(
                                 selectedSystem.getId() + "-CLVEntityVLayoutContainer").css(
                                 {
                                        "display" : "block"
                                 });
                    jQuery.sap.byId(
                                 selectedSystem.getId() + "-CLVEntityVLayoutProperties")
                                 .css({
                                        "display" : "block"
                                 });    
                    
             }, 1000);
       }

       if (this.getViewType() == sap.landvisz.ViewType.SELECTION_VIEW && oEvent.srcControl.getTooltip() == this.RESTORE_TEXT) {
    	   	 var expWidth = this.windowWidth - 40;
             var expHeight = this.windowHeight;
             selectedSystem.sViewWidth = expWidth;
             selectedSystem.sViewHeight = expHeight;
             
             jQuery.sap.byId(selectedSystem.getId() + "-CLVEntityVLayoutContainer")
                           .css({
                                 "display" : "none"
                           });
             this._animateRestoreView(selectedSystem, container);
             
             setTimeout(function() {
                    jQuery.sap.byId(
                                 selectedSystem.getId() + "-CLVEntityVLayoutContainer").css(
                                 {
                                        "display" : "block"
                                 });
             }, 1000);
       }

       if (oEvent.srcControl.getTooltip() == this.SHOW_ALL_TEXT && selectedSystem.entityMaximized != true) 
             this._animateShowAllView(selectedSystem, container,selectionView);

       if (oEvent.srcControl.getTooltip() == this.SHOW_ALL_TEXT && selectedSystem.entityMaximized == true) {
             selectedSystem.sViewWidth = expWidth;
             selectedSystem.sViewHeight = expHeight;
             this._animateSelectionView(container);
       }

       else if (oEvent.srcControl.getTooltip() == this.COLLAPSE_TEXT && this.entityMaximized != true) 
             this._animateCollapseView(container);
             
       else if (oEvent.srcControl instanceof sap.landvisz.internal.SingleDataContainer && selectedSystem.explodeViewClosed == true)
             this._animateCollapseView(container);
};

sap.landvisz.LandscapeViewer.prototype._animateCollapseView = function(container) {

             var position = this.getSelectionViewPosition();
             if (position == sap.landvisz.SelectionViewPosition.CENTER) {
                    var left = (this.windowWidth - this.entityWidth) / 2;
                    var top = (this.windowHeight - this.entityHeight) / 2;
             } else if (position == sap.landvisz.SelectionViewPosition.LEFT) {
                    var left = 20;
                    var top = 20;
             } else if (position == sap.landvisz.SelectionViewPosition.RIGHT) {
                    var left = this.windowHeight - this.entityHeight - 20;
                    var top = 20;
             }
             container.animate({
                 width : this.entityWidth,
                 height : this.entityHeight,
                    left : left,
                    top : top,
             }, 1000);

};


sap.landvisz.LandscapeViewer.prototype._animateSelectionView = function(container) {

                    var left;
                    var top;
                    var position = this.getSelectionViewPosition();
                    if (position == sap.landvisz.SelectionViewPosition.CENTER) {
                           left = (this.windowWidth - this.entityWidth) / 2;
                           top = (this.windowHeight - this.entityHeight) / 2;
                    } else if (position == sap.landvisz.SelectionViewPosition.LEFT) {
                           left = 20;
                           top = 20;
                    } else if (position == sap.landvisz.SelectionViewPosition.RIGHT) {
                           left = this.windowWidth - this.entityWidth -20;
                           top = 20;
                    }

                    container.animate({
                           left : left,
                           top : top,
                    }, 1000);

};


sap.landvisz.LandscapeViewer.prototype._animateShowAllView = function(selectedSystem, container,selectionView ) {

             var expWidth = this.windowWidth - 12;
             var expHeight = this.windowHeight;
             selectedSystem.sViewWidth = expWidth - this.entityWidth;
             selectedSystem.sViewHeight = expHeight;
             selectedSystem.left = 0;
             selectedSystem.top = 0;
             selectionView.css({
                    "position" : "relative"
             });
             container.animate({
                    left : 10,
                    top : 0,
                    width : expWidth,
                    height : "100%",
             }, 1000);
             var smv = jQuery.sap.byId("SMV");
             setTimeout(function() {
                    smv.animate({
                           "display" : "block"
                    }, 1000);
             }, 1000);

};


sap.landvisz.LandscapeViewer.prototype._animateMaximizeView = function(selectedSystem, container) {

       var expWidth = this.windowWidth - 40;
       var expHeight = this.windowHeight - 66;
       selectedSystem.sViewWidth = expWidth;
       selectedSystem.sViewHeight = expHeight;
       container.animate({
             left : 20,
             top : 20,
             width : expWidth,
             height : expHeight
       },1000);

};

sap.landvisz.LandscapeViewer.prototype._animateRestoreView = function(selectedSystem, container) {

			 var expWidth = this.windowWidth - 40;
             var expHeight = this.windowHeight;
             selectedSystem.sViewWidth = expWidth;
             selectedSystem.sViewHeight = expHeight;
             var position = this.getSelectionViewPosition();
             var left;
             var top;
             if (position == sap.landvisz.SelectionViewPosition.CENTER) {
                    left = (this.windowWidth - this.entityWidth) / 2;
                    top = (this.windowHeight - this.entityHeight) / 2;
             } else if (position == sap.landvisz.SelectionViewPosition.LEFT) {
                    left = 20;
                    top = 20;
             } else if (position == sap.landvisz.SelectionViewPosition.RIGHT) {
                    left = this.windowHeight - this.entityHeight -20;
                    top = 20;
             }

             container.animate({
                    left : left,
                    top : top,
                    width : this.entityWidth,
                    height : this.entityHeight
             }, 1000);


};

sap.landvisz.LandscapeViewer.prototype.resetView = function(system, action) {

       var container = jQuery.sap.byId(this.getId() + "-container");
       if (system.entityMaximized == true) {

             system.entityMaximized = false;
             setTimeout(function() {
                    system.invalidate();
             }, 1000);

             var expWidth = this.windowWidth - 40;
             var expHeight = this.windowHeight;
             system.sViewWidth = expWidth;
             system.sViewHeight = expHeight;
             var position = this.getSelectionViewPosition();
             var left;
             var top;
             if (position == sap.landvisz.SelectionViewPosition.CENTER) {
                    left = (this.windowWidth - this.entityWidth) / 2;
                    top = (this.windowHeight - this.entityHeight) / 2;
             } else if (position == sap.landvisz.SelectionViewPosition.LEFT) {
                    left = 20;
                    top = 20;
             } else if (position == sap.landvisz.SelectionViewPosition.RIGHT) {
                    left = this.windowHeight - this.entityHeight - 20;
                    top = 20;
             }

             jQuery.sap.byId(system.getId() + "-CLVEntityVLayoutProperties").css({
                    "display" : "none"
             });
             container.animate({
                    left : left,
                    top : top,
                    width : this.entityWidth,
                    height : this.entityHeight
             }, 1000);

             setTimeout(function() {
                    jQuery.sap.byId(system.getId() + "-CLVEntityVLayoutProperties")
                                 .css({
                                        "display" : "block"
                                 });
             }, 1000);

             setTimeout(function() {
                    jQuery.sap.byId(action.getId()).click();

             }, 1000);

       } else if (system.expVisible == true) {

             system.entityMaximized = false;
             system.expVisible = false;
             jQuery.sap.byId(system.oHLayoutMiniNavigation.getId()).css("display",
                           "block");
             system.showMiniNavigation = true;

             var header;
             var headers = system.getDataContainers();
             var backup;
             for ( var i = 0; i < system.dialogArray.length; i++) {
                    header = system.dialogArray[i];
                    backup = header.getProperties();
                    if (backup && backup.length && backup.length > 0) {
                           for ( var j = 0; j < backup.length; j++) {
                                 headers[i].addAggregation("properties", backup[j], false);
                           }
                    }
             }

             for ( var i = 0; i < headers.length; i++) {
                    if (i != system.selectedIndex) {
                           headers[i].visible = true;
                    }
             }
             system.nextIcon.setVisible(true);
             system.previousIcon.setVisible(true);
             jQuery.sap.byId("SMV").hide(700);
             system.invalidate();

             var left;
             var top;
             var position = this.getSelectionViewPosition();
             if (position == sap.landvisz.SelectionViewPosition.CENTER) {
                    left = (this.windowWidth - this.entityWidth) / 2;
                    top = (this.windowHeight - this.entityHeight) / 2;
             } else if (position == sap.landvisz.SelectionViewPosition.LEFT) {
                    left = 20;
                    top = 20;
             } else if (position == sap.landvisz.SelectionViewPosition.RIGHT) {
                    left = this.windowHeight - this.entityHeight - 20;
                    top = 20;
             }

             container.animate({
                    left : left,
                    top : top,
             }, 1000);

             setTimeout(function() {
                    jQuery.sap.byId(action.getId()).click();
             }, 1000);

       } else
             jQuery.sap.byId(action.getId()).click();

};

sap.landvisz.LandscapeViewer.prototype.initControls = function() {

       var id = this.getId();
       if (!this.oHLayoutConnectionEntity)
             this.oHLayoutConnectionEntity = new sap.ui.commons.layout.HorizontalLayout(
                           id + "viewerConnectionEntityHLayout");

       if (!this.oHLayoutOptions)
             this.oHLayoutOptions = new sap.ui.commons.layout.HorizontalLayout(id
                           + "viewerHLayoutOptions");
       this.entityWidth;
       this.entityHeight;

       this.networkViewVisible = false;
       this.boxViewVisible = false;
       if (!this.boxViewLabel)
             this.boxViewLabel = new sap.ui.commons.Label(id + "-viewBoxLabel");
       if (!this.boxViewImg)
             this.boxViewImg = new sap.ui.commons.Image(id + "-viewBoxImg");
       if (!this.networkViewLabel)
             this.networkViewLabel = new sap.ui.commons.Label(id
                           + "-viewNetworkLabel");
       if (!this.closeImg)
             this.closeImg = new sap.ui.commons.Image(id + "-closeImg");

       if (!this.networkViewBtn)
             this.networkViewBtn = new sap.ui.commons.Button(id + "-viewNetworkBtn")
                           .addStyleClass("sapLandviszImg");
       if (!this.boxViewBtn)
             this.boxViewBtn = new sap.ui.commons.Button(id + "-viewBoxBtn")
                           .addStyleClass("sapLandviszImg");

       if (!this.compViewBtn)
             this.compViewBtn = new sap.ui.commons.Button(id + "-viewComponentBtn")
                           .addStyleClass("sapLandviszImg");
       if (!this.depViewBtn)
             this.depViewBtn = new sap.ui.commons.Button(id + "-viewDeployBtn")
                           .addStyleClass("sapLandviszImg");

       if (!this.navigationPathLabel)
             this.navigationPathLabel = new sap.ui.commons.Label(id
                           + "navigationPathLabel");
       if (!this.deploymentOptionLabel)
             this.deploymentOptionLabel = new sap.ui.commons.Label(id
                           + "deploymentOptionLabel");

       var size = this.getSystems()[0].getRenderingSize();

     if (size == sap.landvisz.EntityCSSSize.Small) {
           this.entityWidth = Math.round(22.7 * 12);
           this.entityHeight = Math.round(15.8 * 12);
     }
     if (size == sap.landvisz.EntityCSSSize.RegularSmall) {
           this.entityWidth = Math.round(33.7 * 12);
           this.entityHeight = Math.round(22.3 * 12);
     }
     if (size == sap.landvisz.EntityCSSSize.Regular) {
           this.entityWidth = Math.round(38.7 * 12);
           this.entityHeight = Math.round(24.5 * 12);
     }
     if (size == sap.landvisz.EntityCSSSize.Medium) {
           this.entityWidth = Math.round(43.5 * 12);
           this.entityHeight = Math.round(28 * 12);
     }
     if (size == sap.landvisz.EntityCSSSize.Large) {

           this.entityWidth = Math.round(64.5 * 12);
           this.entityHeight = Math.round(41.5 * 12);

     }

       this.visibleEntities = [];
       this.depTypeOptions = new Object();
       
};

sap.landvisz.LandscapeViewer.prototype.appendNavigationPath = function(
             navigationText) {

       var fullText = this.navigationPathLabel.getText() + "-->" + navigationText;
       this.setNavigationPath(fullText);
       this.navigationPathLabel.setText(fullText);

};

sap.landvisz.LandscapeViewer.prototype.onAfterRendering = function() {

       jQuery(window).unbind("resize", jQuery.proxy(this.onwindowresize, this));
       // Register for window resize event during the viewer is rendered.
       jQuery(window).bind("resize", jQuery.proxy(this.onwindowresize, this));

if (this.getViewType() == sap.landvisz.ViewType.SOLUTION_VIEW) {

             var innerContainerId = this.getId() + "-solutionInnerContainer";
             var innerContainer = jQuery.sap.byId(innerContainerId);
             var entity;
             var entityID;
             var leftPos;
             var topPos;
             var margin = 5;

             this.innerLeftMargine = innerContainer[0].offsetLeft;
             this.innerTopMargine = innerContainer[0].offsetTop;
             
             var systems = this.getSystems();
             var entity;
             var entityLeft;
             var entityTop;
             var totalLeft;
             var totalTop;
             for (var i = 0; i < systems.length; i++) {
                    entity = jQuery.sap.byId(systems[i].getId());
                    entityLeft = systems[i].left;
                    entityTop = systems[i].top;
                    totalLeft = entityLeft + this.innerLeftMargine;
                    totalTop = entityTop + this.innerTopMargine;
                    systems[i].left = totalLeft;
                    systems[i].top = totalTop;
                    entity.css({
                           left : totalLeft,
                           top : totalTop
                    });
             }

             var connectionEntities = this.getConnectionEntities();
             var deploymentOptionsTop = 0;
             for ( var i = 0; i < connectionEntities.length; i++) {
                    entity = jQuery.sap.byId(connectionEntities[i].getId());
                    entityLeft = connectionEntities[i].left;
                    entityTop = connectionEntities[i].top;
                    totalLeft = entityLeft + this.innerLeftMargine;
                    totalTop = entityTop + this.innerTopMargine;
                    deploymentOptionsTop = connectionEntities[i].top ;
                    connectionEntities[i].left = totalLeft;
                    connectionEntities[i].top = totalTop;
                    
                    entity.css({
                           left : totalLeft,
                           top : totalTop
                    });
                    
                   var conLbl =  jQuery.sap.byId(connectionEntities[i].getId() +"-connectionLabel");
                   var conLblWidth = connectionEntities[i].width - 68;
                    conLbl.css({
                           "max-width" : conLblWidth,
                    });
             }
		    if (this.getSolutionType() == sap.landvisz.SolutionType.DEPLOYMENT_VIEW) {

			var depContainerid = this.getId() + "-deploymentTypeContainer";
			var depContainer = jQuery.sap.byId(depContainerid);
			var boxWidth = innerContainer[0].offsetWidth;
			var depContainerTop = this.entityHeight + 90 + 10;

			depContainer.css({
				left : this.innerLeftMargine,
				top : depContainerTop,
				width : boxWidth
			});

		  if (null != this.selectedOptionEntity) {
				var selectedDepTypes = this.depTypeOptions[this.selectedOptionEntity
						.getId()];
					if (this.getShowDeploymentTypeSection() == true
						&& selectedDepTypes.length <= 0) {

						var changedHeight = innerContainer[0].offsetHeight - 40;

						innerContainer.css({
						height : changedHeight
						});
					}
				}
		    }
             if (this.getSolutionOptionType() == sap.landvisz.OptionType.ENTITY) {

                    var optionContainerid = this.getId() + "-optionContainer";
                    var optionContainer = jQuery.sap.byId(optionContainerid);
                    var boxWidth = innerContainer[0].offsetWidth - 10;
                    var optionContainerTop = this.entityHeight + 90 + 10 + 5;
                    if (this.getSolutionType() == sap.landvisz.SolutionType.DEPLOYMENT_VIEW) {
                           optionContainerTop = deploymentOptionsTop;
                    }
                    if (this.getShowDeploymentTypeSection() == true)
                           optionContainerTop = optionContainerTop + 40;

                    optionContainer.css({
                           left : this.innerLeftMargine + 5,
                           top : optionContainerTop,
                           width : boxWidth
                    });
             }
             
             if (this.getSolutionType() == sap.landvisz.SolutionType.COMPONENT_VIEW) {

            	 this.compViewBtn.addStyleClass("selectedView");

            	 this.depViewBtn.removeStyleClass("selectedView");

             }else if (this.getSolutionType() == sap.landvisz.SolutionType.DEPLOYMENT_VIEW) {
            	 
            	 this.depViewBtn.addStyleClass("selectedView");

            	 this.compViewBtn.removeStyleClass("selectedView");
             }
       }

       else if (this.getViewType() == sap.landvisz.ViewType.SELECTION_VIEW) {
       
             var enitityContainer = jQuery.sap.byId(this.getId() + "-container");
             var systems = this.getSystems();
             var selectedSystem = systems[0];
             var selectionView = jQuery.sap.byId(systems[0].getId());

             if (systems[0].entityMaximized == true) 

                    this._animateMaximizeView(selectedSystem,enitityContainer);
             else if (systems[0].expVisible == true) {

                  var expWidth = this.windowWidth - 12;
                  var expHeight = this.windowHeight;
                  selectedSystem.sViewWidth = expWidth - this.entityWidth;
                  selectedSystem.sViewHeight = expHeight;
                  selectionView.css({
                         "position" : "relative"
                  });
                  enitityContainer.css({
                         left : 10,
                         top : 0,
                         width : expWidth,
                         height : "100%",
                  });
                  var smv = jQuery.sap.byId("SMV");
                  setTimeout(function() {
                         smv.css({
                               "display" : "block"
                         }, 1000);
                  }, 1000);
        //this._animateShowAllView(selectedSystem, enitityContainer,selectionView );
             }
                    
             else
                this._animateSelectionView(enitityContainer);

       }
       else if (this.getViewType() == sap.landvisz.ViewType.DEPENDENCY_VIEW && this.currentView == sap.landvisz.DependencyType.NETWORK_VIEW) {
             var boxContainerId = this.getId() + "-boxViewContainer";
             var boxContainer = jQuery.sap.byId(boxContainerId);

             this.boxLeftMargine = boxContainer[0].offsetLeft;
             this.boxTopMargine = boxContainer[0].offsetTop;
             boxContainer.css("display", "none");

             var boxLevels = this.getBoxDependencyLevels();
             if (boxLevels) {
                    for ( var i = 0; i < boxLevels.length; i++) {
                           var boxLabelId = this.getId() + "-boxViewLabel" + i;
                           var boxLabel = jQuery.sap.byId(boxLabelId);
                           boxLabel.css("display", "none");
                    }
             }
             var viewer = jQuery.sap.byId(this.getId() + "-viewContainer");
             var svgWidth = viewer[0].scrollWidth - 10;
             var svgHeight = viewer[0].scrollHeight - 10;
             
             this.svgForConnections = sap.landvisz.libs.lvsvg.getSVG(svgWidth,
                           svgHeight, this.getId() + "-viewContainer");
             this.connection = sap.landvisz.internal.Connection;
             this.connection.svgForConnections = this.svgForConnections;
             this.connection.renderConnections(this.getSystems(), this
                           .getConnectionEntities(), this.getConnectionLine());

       } else if (this.getViewType() == sap.landvisz.ViewType.DEPENDENCY_VIEW && this.currentView == sap.landvisz.DependencyType.BOX_VIEW) {

             var boxContainerId = this.getId() + "-boxViewContainer";
             var boxContainer = jQuery.sap.byId(boxContainerId);
             var entity;
             var entityID;
             var leftPos;
             var topPos;
             var margin = 5;

             this.boxLeftMargine = boxContainer[0].offsetLeft;
             this.boxTopMargine = boxContainer[0].offsetTop;

             var levelHeaderWidth = 30;
             var levelHeaderHeight = this.entityHeight;

             var systems = this.getSystems();
             var entity;
             var entityLeft;
             var entityTop;
             var totalLeft;
             var totalTop;
             for ( var i = 0; i < systems.length; i++) {
                    entity = jQuery.sap.byId(systems[i].getId());
                    entityLeft = systems[i].left;
                    entityTop = systems[i].top;
                    totalLeft = entityLeft + this.boxLeftMargine;
                    totalTop = entityTop + this.boxTopMargine;
                    systems[i].left = totalLeft;
                    systems[i].top = totalTop;
                    entity.css({
                           left : totalLeft,
                           top : totalTop
                    });
             }

             var connectionEntities = this.getConnectionEntities();

             for ( var i = 0; i < connectionEntities.length; i++) {
                    entity = jQuery.sap.byId(connectionEntities[i].getId());
                    entityLeft = connectionEntities[i].left;
                    entityTop = connectionEntities[i].top;
                    totalLeft = entityLeft + this.boxLeftMargine;
                    totalTop = entityTop + this.boxTopMargine;
                    connectionEntities[i].left = totalLeft;
                    connectionEntities[i].top = totalTop;
                    entity.css({
                           left : totalLeft,
                           top : totalTop
                    });
             }

             var levelHeaderLeft = this.boxLeftMargine + margin;
             var levelHeaderTop = this.boxModeHeight + (margin * 2)
                           + this.boxTopMargine;
             var boxLevels = this.getBoxDependencyLevels();
             var boxViewFirstLabel = "Systems";
             var boxViewFirstLabelTooltip = "Systems";
             var that = this;
             if (boxLevels) {
                    setTimeout(function() {
                           for ( var i = 0; i < boxLevels.length; i++) {

                                 if (that.hasBoxThirdLevel == true) {

                                        var boxLabelId = that.getId() + "-boxViewLabel" + i;
                                        var boxLabel = jQuery.sap.byId(boxLabelId);
                                        levelHeaderTop += ((that.entityHeight + margin) * i);

                                        boxLabel.css({
                                               left : levelHeaderLeft,
                                               top : levelHeaderTop,
                                               width : levelHeaderWidth,
                                               height : levelHeaderHeight,
                                               display : "block"
                                        });

                                        var boxLavelLabel = jQuery.sap.byId(boxLabelId
                                                     + "Level");
                                        boxLavelLabel.css({
                                               width : levelHeaderHeight,
                                               height : levelHeaderHeight,
                                        });
                                 }
                           }
                    }, 1000);
             }
       }

       if (this.getViewType() == sap.landvisz.ViewType.DEPENDENCY_VIEW
                    && this.currentView == sap.landvisz.DependencyType.NETWORK_VIEW) {
    	   
    	     this.networkViewBtn.addStyleClass("selectedView");

    	     this.boxViewBtn.removeStyleClass("selectedView");
       }

       if (this.getViewType() == sap.landvisz.ViewType.DEPENDENCY_VIEW
                    && this.currentView == sap.landvisz.DependencyType.BOX_VIEW) {
    	   
    	   this.boxViewBtn.addStyleClass("selectedView");
    	   
    	   this.networkViewBtn.removeStyleClass("selectedView");
       }

       if (this.getViewType() == sap.landvisz.ViewType.DEPENDENCY_VIEW) {

             var version = jQuery.ui ? jQuery.ui.version || "pre 1.6"
                           : 'jQuery-UI not detected';

             // if (version == "pre 1.6") {
             jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-core");
             jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-widget");
             jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-mouse");
             jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-draggable");
             jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-droppable");
             // }

             var enitityContainer = jQuery.sap.byId(this.getId() + "-viewContainer");
             var navigationContainer = jQuery.sap.byId(this.getId() + "-navigation");
             var that = this;

             var enitityContainer = jQuery.sap.byId(this.getId() + "-viewContainer");
             var frameScrollHeight = Number(enitityContainer[0].scrollHeight);
             var frameScrollWidth = Number(enitityContainer[0].scrollWidth);
             var frameHeight = Number(enitityContainer.height());
             var frameWidth = Number(enitityContainer.width());

             if ((frameScrollWidth > frameWidth)
                           || (frameScrollHeight > frameHeight)) {
                    if (navigationContainer.css('display') == 'none') {
                           navigationContainer.show(0);
                           that.getVisibleRegion(0);
                           navigationContainer.hide(0);
                    } else {
                           that.getVisibleRegion(0);
                    }
             } else
                    navigationContainer.hide(0);

             var navigator = jQuery.sap.byId(this.getId() + "-navigation_navigator");
             var that = this;
             navigator.bind('drag', function(event) {
                    that.calculateNavigationMovement(enitityContainer, navigator);
             });
             navigator.draggable({
                    containment : navigationContainer
             });

             var navigatorArrowdown = jQuery.sap.byId(this.getId()
                           + "-navigation_header_arrowdown");
             var navigatorArrowup = jQuery.sap.byId(this.getId()
                           + "-navigation_header_arrowup");
             navigatorArrowdown.show();

             navigatorArrowdown.click(function(e) {
                    navigationContainer.animate({
                           height : '0px'
                    }, 1000, "swing", function(e) {
                           navigator.hide();
                    });
                    navigatorArrowdown.hide();
                    navigatorArrowup.show();
                    e.stopPropagation();
             });

             navigatorArrowup.click(function(e) {
                    navigationContainer.animate({
                           height : '29%'
                    }, 1000, "swing");
                    navigatorArrowup.hide();
                    navigatorArrowdown.show();
                    navigator.show();
                    e.stopPropagation();
             });

             navigationContainer.bind('drag');
             navigationContainer.draggable({
                    cancel : "div.navigationHeader",
                    containment : enitityContainer
             });
       }

};

sap.landvisz.LandscapeViewer.prototype.calculateNavigationMovement = function(
             mainContainer, navigator) {
       var heightRatio = mainContainer.height() / navigator.height();
       var widthRatio = mainContainer.width() / navigator.width();

       mainContainer
                    .scrollTop((navigator.css('top').split('px')[0]) * heightRatio);
       mainContainer.scrollLeft((navigator.css('left').split('px')[0])
                    * widthRatio);
       var connectionEntities = this.getConnectionEntities();
       for ( var i = 0; i < connectionEntities.length; i++) {
             if (this.getVisibleDependency() == sap.landvisz.DependencyVisibility.BOTH
                           && this.currentView == sap.landvisz.DependencyType.NETWORK_VIEW) {
                    if (connectionEntities[i].toolPopup.isOpen())
                           connectionEntities[i].toolPopup.close();
             }
       }
}

sap.landvisz.LandscapeViewer.prototype.getVisibleRegion = function() {

       var enitityContainer = jQuery.sap.byId(this.getId() + "-viewContainer");
       var navigationContainer = jQuery.sap.byId(this.getId() + "-navigation");
       var navigator = jQuery.sap.byId(this.getId() + "-navigation_navigator");
       navigationContainer.css({
             height : '29%'
       });
       setTimeout(function() {
             sap.landvisz.libs.lvsvg.convertHtmltoCanvas(enitityContainer,
                           navigationContainer);
       }, 1000);
       navigationContainer.hide();

       setTimeout(function() {
             navigationContainer.show("slow");
             navigationContainer.animate({
                    height : '29%'
             }, 100, "swing", function(e) {
                    navigator.show("slow");
             });

             var frameScrollHeight = Number(enitityContainer[0].scrollHeight);
             var frameScrollWidth = Number(enitityContainer[0].scrollWidth);
             var frameHeight = Number(enitityContainer.height());
             var frameWidth = Number(enitityContainer.width());
             var heightRatio = frameHeight / frameScrollHeight;
             var widthRatio = frameWidth / frameScrollWidth;

             setTimeout(function() {

                    var navHeight = Number(navigationContainer[0].scrollHeight);
                    var navWidth = Number(navigationContainer[0].scrollWidth);
                    navigator.height(navHeight * heightRatio);
                    navigator.width(navWidth * widthRatio);

                    navigator.show();
                    navigator.css({
                           left : 0,
                           top : 0
                    });

             }, 1500);

       }, 1000);
};

sap.landvisz.LandscapeViewer.prototype.onmouseenter = function(oEvent) {
       var srcCntrl = oEvent.oSource;
       var srcElement = oEvent.target;
       var connectors;
       var systems;
       var hasMatchingHeader = false;
       var holdDisplayTrue = false; 
       var holdCount = 0;
       for(var i = 0 ; i < this.getConnectionEntities().length ; i++){
             if(this.getConnectionEntities()[i].holdDisplay == true){
                    holdDisplayTrue = true;
                    holdCount++;
             }                   
       }      
       if((!holdDisplayTrue) || (holdCount > 1)){
       if (srcCntrl instanceof sap.landvisz.ConnectionEntity) {

             this.lindkedEntities = [];
             var connectionEntities = this.getConnectionEntities();
             for ( var i = 0; i < connectionEntities.length; i++) {
             
                           if (srcCntrl.getId() != connectionEntities[i].getId()) {
                           jQuery.sap
                                        .byId(connectionEntities[i].getId() + "connectionRow")
                                        .css({
                                               "box-shadow" : "none"
                                        });
                           connectionEntities[i].holdDisplay = false;
                           connectionEntities[i].toolPopup.close();
                    } else {
                           jQuery.sap
                                        .byId(connectionEntities[i].getId() + "connectionRow")
                                        .css({
                                               "box-shadow" : "rgb(0, 0, 0) 0px 0px 20px"
                                        });
                    }
             }
             connectors = this.getConnectors();
             for ( var i = 0; i < connectors.length; i++) {
                    if (connectors[i].getSource() == srcCntrl.getConnectionId())
                           this.lindkedEntities.push(connectors[i].getTarget());
                    if (connectors[i].getTarget() == srcCntrl.getConnectionId())
                           this.lindkedEntities.push(connectors[i].getSource());
             }

             systems = this.getSystems();
             var isLinkedSystem;
             var header;
             for ( var i = 0; i < systems.length; i++) {
                    isLinkedSystem = false;

                    for ( var j = 0; j < this.lindkedEntities.length; j++) {

                           if (systems[i].getSystemId() == this.lindkedEntities[j]) {
                                 isLinkedSystem = true;
                                 if (srcCntrl.getLinkedHeader()
                                               && "" != srcCntrl.getLinkedHeader()) {
                                        hasMatchingHeader = false;
                                        for ( var k = 0; k < systems[i].propertyHeaders.length; k++) {
                                               header = systems[i].propertyHeaders[k];
                                               if (srcCntrl.getLinkedHeader() == header
                                                            .getHeader()) {
                                                     if (header.getSelected() != true) {
                                                            header.setSelected(true);
                                                            systems[i].selectedIndex = k;
                                                            hasMatchingHeader = true;
                                                     } else {
                                                            systems[i].selectedIndex = k;

                                                            this.filterOverlay(systems[i], srcCntrl
                                                                          .getLinkId())

                                                            jQuery.sap.byId(
                                                                          systems[i].getId()
                                                                                       + "-innerOverlay").css({
                                                                   "display" : "block"
                                                            });
                                                            jQuery.sap.byId(
                                                                          systems[i].getId() + "-overlay")
                                                                         .css({
                                                                                "display" : "block"
                                                                         });

                                                     }
                                               } else
                                                     systems[i].propertyHeaders[k]
                                                                   .setSelected(false);

                                               // innerOverlay
                                               // systems[i].invalidate();
                                               systems[i].showOverlay = false;
                                               systems[i].overlayFilter = "";

                                        }

                                        if (hasMatchingHeader == true
                                                     && systems[i].showOverlay == false) {
                                               systems[i].showOverlay = true;
                                               systems[i].overlayFilter = srcCntrl.getLinkId();
                                               systems[i].invalidate();

                                        }
                                 }
                           }

                    }

                    if (isLinkedSystem == false) {
                           if (systems[i].showOverlay == true)
                                 systems[i].invalidate();
                           else {
                                 jQuery.sap.byId(systems[i].getId() + "-innerOverlay").css({
                                        "display" : "none"
                                 });
                                 jQuery.sap.byId(systems[i].getId() + "-overlay").css({
                                        "display" : "none"
                                 });
                           }
                           systems[i].showOverlay = false;
                           systems[i].overlayFilter = "";

                    }

             }
       }
}
};

sap.landvisz.LandscapeViewer.prototype.filterOverlay = function(system, filter) {

       var headerContent = system.oVLayoutOverlay.getContent();
       var row;
       var linearRows;
       for ( var j = 0; j < headerContent.length; j++) {
             row = headerContent[j];
             if (row instanceof sap.landvisz.internal.NestedRowField) {

                    linearRows = row.getLinearRows();
                    for ( var k = 0; k < linearRows.length; k++) {

                           if (filter == linearRows[k].getLinkSource()) {
                                 jQuery.sap.byId(row.getId()).css({
                                        display : "block",
                                 });
                                 jQuery.sap.byId(linearRows[k].getId()).css({
                                        display : "block",
                                 });
                           } else {

                                 jQuery.sap.byId(row.getId()).css({
                                        display : "none",
                                 });
                                 jQuery.sap.byId(linearRows[k].getId()).css({
                                        display : "none",
                                 });
                           }

                    }
             } else {
                    if (filter == row.getLinkSource()) {
                           jQuery.sap.byId(row.getId()).css({
                                 display : "block",
                           });
                    } else {
                           jQuery.sap.byId(row.getId()).css({
                                 display : "none",
                           });
                    }
             }
       }
};

sap.landvisz.LandscapeViewer.prototype.showAllOverlay = function(system, filter) {

       var headerContent = system.oVLayoutOverlay.getContent();
       var row;
       for ( var j = 0; j < headerContent.length; j++) {
             row = headerContent[j];
             jQuery.sap.byId(row.getId()).css({
                    display : "block",
             });
       }
};

sap.landvisz.LandscapeViewer.prototype.showOverlay = function(id,
             overlayDisplay) {

       jQuery.sap.byId(id + "-overlay").css({
             display : overlayDisplay,
       });

       jQuery.sap.byId(id + "-innerOverlay").css({
             display : overlayDisplay,
       });

};

sap.landvisz.LandscapeViewer.prototype.onmouseleave = function(oEvent) {
       var srcCntrl = oEvent.oSource;
       var srcElement = oEvent.target;
       this.lindkedEntities = [];
       var connectors;
       var systems;
       var hasMatchingHeader = false;
       var holdDisplayTrue = false; 
       var holdCount = 0;
       for(var i = 0 ; i < this.getConnectionEntities().length ; i++){
             if(this.getConnectionEntities()[i].holdDisplay == true){
                    holdDisplayTrue = true;
                    holdCount++;
             }                   
       }
       if(!(holdDisplayTrue && holdCount < 2)){
             if (srcCntrl instanceof sap.landvisz.ConnectionEntity) {

                    if (srcCntrl.holdDisplay != true) {

                           jQuery.sap.byId(srcCntrl.getId() + "connectionRow").css({
                                 "box-shadow" : "none"
                           });

                           connectors = this.getConnectors();

                           for ( var i = 0; i < connectors.length; i++) {
                                 if (connectors[i].getSource() == srcCntrl.getConnectionId())
                                        this.lindkedEntities.push(connectors[i].getTarget());
                                 if (connectors[i].getTarget() == srcCntrl.getConnectionId())
                                        this.lindkedEntities.push(connectors[i].getSource());
                           }

                           systems = this.getSystems();
                           for ( var i = 0; i < systems.length; i++) {

                                 for ( var j = 0; j < this.lindkedEntities.length; j++) {

                                        if (systems[i].getSystemId() == this.lindkedEntities[j]) {
                                               jQuery.sap.byId(systems[i].getId() + "-innerOverlay")
                                                            .css({
                                                                   "display" : "none"
                                                            });
                                               jQuery.sap.byId(systems[i].getId() + "-overlay").css({
                                                     "display" : "none"
                                               });

                                               // innerOverlay
                                               // systems[i].invalidate();
                                               systems[i].showOverlay = false;
                                               systems[i].overlayFilter = "";
                                        }
                                 }

                           }
                    }
             }
}
};

sap.landvisz.LandscapeViewer.prototype.getCurrentSolutionView = function() {
       return this.currentSolutionView;
};

sap.landvisz.LandscapeViewer.prototype.getCurrentDependencyView = function() {
       return this.currentView;
};

sap.landvisz.LandscapeViewer.prototype.setEnableLoadSolution = function(enabled) {

       if (enabled == false) {
             this.compViewBtn.addStyleClass("sapLandviszBtnDisable");
             this.depViewBtn.addStyleClass("sapLandviszBtnDisable");

       } else if (enabled == true) {
             this.compViewBtn.removeStyleClass("sapLandviszBtnDisable");
             this.depViewBtn.removeStyleClass("sapLandviszBtnDisable");
       }
       this.compViewBtn.setEnabled(enabled);
       this.depViewBtn.setEnabled(enabled);
};

sap.landvisz.LandscapeViewer.prototype.getSelectedOption = function() {
       return this.selectedOptionEntity;
};

sap.landvisz.LandscapeViewer.prototype.onfocusout = function(oEvent) {
       this.compViewBtn
};

sap.landvisz.LandscapeViewer.prototype.fetchSelectedOption = function() {
       return this.selectedOptionEntity;
};
sap.landvisz.LandscapeViewer.prototype.exit = function() {
       jQuery(window).unbind("resize", jQuery.proxy(this.onwindowresize, this));
};

sap.landvisz.LandscapeViewer.prototype.getViewConnectedLayout = function() {
   
     	var connectedLayout;
		var sources;
		var optionsEntities;
		var sources;
		var connectors = this.getConnectors();
		optionsEntities = this.oHLayoutOptions.getContent();
		for ( var y = 1; y < optionsEntities.length; y++) {
			if (optionsEntities[y].getSelected() == true) {
				sources = optionsEntities[y].getOptionSources();
				break;

			}
		}
       // we are taking a tradeoff that there is only one connection entity for
		// the
       // Solution view & the same is declared as source for the connector
       
       var connectionEntityId = connectors[0].getSource();
       var connectorArray = [];
       var connector;
       var entityTobePlaced;
       for ( var i = 0; i < sources.length; i++) {
             connector = new sap.landvisz.Connector();
             entityTobePlaced = sources[i].getSource();
             connector.setSource(connectionEntityId);
             connector.setTarget(entityTobePlaced);
             connectorArray.push(connector);
       }
       
       connectedLayout = this.connection
                    .getBoxViewConnectedNodesLayout(connectorArray);
       
      return connectedLayout;
};


sap.landvisz.LandscapeViewer.prototype.getEntityConnectedLayout = function() {
   

	var connectedLayout;
	var optionsEntities;
	var connectors = this.getConnectors();
	var option;
	var connectorArray = [];
	for ( var i = 0; i < connectors.length; i++) {

		option = this.getOptionConnector(connectors[i]);
		if ("" !== option)
			connectorArray.push(option);
		else
			connectorArray.push(connectors[i]);
	}
		
		
		connectedLayout = this.connection
                    .getBoxViewConnectedNodesLayout(connectorArray);
       
      return connectedLayout;
      
};


sap.landvisz.LandscapeViewer.prototype.getOptionConnector = function(connector) {

	var options = this.getSolutionOptions();
	var optionsEntities;
	var sources;
	var entityConnector;
	var optionSrcEntity;
	for ( var x = 0; x < options.length; x++) {

		if (options[x].getCurrentEntity() == connector.getTarget()) {
		
			optionsEntities = options[x].getOptionEntities();
			
			for ( var y = 0; y < optionsEntities.length; y++) {
			
			  optionSrcEntity = optionsEntities[y].getOptionSources()[0].getSource();
			  
				if (optionsEntities[y].getSelected() == true && optionSrcEntity != connector.getTarget()) {
					entityConnector = new sap.landvisz.Connector();
					entityConnector.setSource(connector.getSource());
					optionsEntities[y].getOptionSources()[0].getSource()
					entityConnector.setTarget(optionsEntities[y].getOptionSources()[0].getSource());
					this.srcEntity = optionSrcEntity;
					return entityConnector;
					
				}
			}

		}
	}

	return "";
};
sap.landvisz.LandscapeViewer.prototype.setHeight = function(height) {

			var win = jQuery(window);
                    if (height && "" != height) 
                           this.windowHeight = height;
                    else
                           this.windowHeight = win.height();
};
sap.landvisz.LandscapeViewer.prototype.setWidth = function(width) {
				var win = jQuery(window);
				if (width && "" != width) {
                           this.windowWidth = width;
                    } else {
                           this.windowWidth = win.width();
                    }
};
