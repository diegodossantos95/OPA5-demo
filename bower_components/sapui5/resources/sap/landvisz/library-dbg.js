/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* -----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ----------------------------------------------------------------------------------- */

/**
 * Initialization Code and shared classes of library sap.landvisz (1.50.0)
 */
jQuery.sap.declare("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Core");
/**
 * sap.landvisz library for UI developments
 *
 * @namespace
 * @name sap.landvisz
 * @public
 */


// library dependencies
jQuery.sap.require("sap.ui.core.library");

// delegate further initialization of this library to the Core
sap.ui.getCore().initLibrary({
	name : "sap.landvisz",
	dependencies : ["sap.ui.core"],
	types: [
		"sap.landvisz.ActionType",
		"sap.landvisz.ComponentType",
		"sap.landvisz.ConnectionLine",
		"sap.landvisz.ConnectionType",
		"sap.landvisz.DependencyType",
		"sap.landvisz.DependencyVisibility",
		"sap.landvisz.EntityCSSSize",
		"sap.landvisz.LandscapeObject",
		"sap.landvisz.ModelingStatus",
		"sap.landvisz.OptionType",
		"sap.landvisz.SelectionViewPosition",
		"sap.landvisz.SolutionType",
		"sap.landvisz.TechnicalSystemType",
		"sap.landvisz.ViewType",
		"sap.landvisz.internal.ContainerType"
	],
	interfaces: [],
	controls: [
		"sap.landvisz.ConnectionEntity",
		"sap.landvisz.Connector",
		"sap.landvisz.LandscapeEntity",
		"sap.landvisz.LandscapeViewer",
		"sap.landvisz.LongTextField",
		"sap.landvisz.Option",
		"sap.landvisz.OptionEntity",
		"sap.landvisz.OptionSource",
		"sap.landvisz.internal.ActionBar",
		"sap.landvisz.internal.DataContainer",
		"sap.landvisz.internal.DeploymentType",
		"sap.landvisz.internal.EntityAction",
		"sap.landvisz.internal.EntityCustomAction",
		"sap.landvisz.internal.HeaderList",
		"sap.landvisz.internal.IdentificationBar",
		"sap.landvisz.internal.LinearRowField",
		"sap.landvisz.internal.ModelingStatus",
		"sap.landvisz.internal.NestedRowField",
		"sap.landvisz.internal.SingleDataContainer",
		"sap.landvisz.internal.TreeField"
	],
	elements: [],
	version: "1.50.0"
});

/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.ActionType.
jQuery.sap.declare("sap.landvisz.ActionType");
/**
 * @class Action Type of a action
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.ActionType = {

	/**
	 * Normal action type
	 * @public
	 */
	NORMAL : "NORMAL",

	/**
	 * Menu action type
	 * @public
	 */
	MENU : "MENU"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.ComponentType.
jQuery.sap.declare("sap.landvisz.ComponentType");
/**
 * @class [Enter description for ComponentType]
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.ComponentType = {

	/**
	 * on demand component type
	 * @public
	 */
	onDemand : "onDemand",

	/**
	 * on premise component type
	 * @public
	 */
	onPremise : "onPremise",

	/**
	 * component type in not defined
	 * @public
	 */
	notDefined : "notDefined"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.ConnectionLine.
jQuery.sap.declare("sap.landvisz.ConnectionLine");
/**
 * @class type file for ps, ts and mob soln
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.ConnectionLine = {

	/**
	 * Plain line
	 * @public
	 */
	Line : "Line",

	/**
	 * Line with arrow at end
	 * @public
	 */
	Arrow : "Arrow"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.ConnectionType.
jQuery.sap.declare("sap.landvisz.ConnectionType");
/**
 * @class type file for ps, ts and mob soln
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.ConnectionType = {

	/**
	 * ps type
	 * @public
	 */
	ProductSystem : "ProductSystem",

	/**
	 * ts type
	 * @public
	 */
	TechnicalSystem : "TechnicalSystem",

	/**
	 * mob type
	 * @public
	 */
	MobileSolution : "MobileSolution"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.DependencyType.
jQuery.sap.declare("sap.landvisz.DependencyType");
/**
 * @class View type of landscape viewer
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.DependencyType = {

	/**
	 * dependency view
	 * @public
	 */
	NETWORK_VIEW : "NETWORK_VIEW",

	/**
	 * Landscape view for selected view
	 * @public
	 */
	BOX_VIEW : "BOX_VIEW"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.DependencyVisibility.
jQuery.sap.declare("sap.landvisz.DependencyVisibility");
/**
 * @class View Visibility of landscape viewer
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.DependencyVisibility = {

	/**
	 * Network dependency view
	 * @public
	 */
	NETWORK : "NETWORK",

	/**
	 * Box Dependency View
	 * @public
	 */
	BOX : "BOX",

	/**
	 * make both view visible
	 * @public
	 */
	BOTH : "BOTH"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.EntityCSSSize.
jQuery.sap.declare("sap.landvisz.EntityCSSSize");
/**
 * @class System Size supported
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.EntityCSSSize = {

	/**
	 * Regular size of system
	 * @public
	 */
	Regular : "Regular",

	/**
	 * Medium size of system
	 * @public
	 */
	Medium : "Medium",

	/**
	 * Large size of system
	 * @public
	 */
	Large : "Large",

	/**
	 * Small size of system
	 * @public
	 */
	Small : "Small",

	/**
	 * Smallest size of system
	 * @public
	 */
	Smallest : "Smallest",

	/**
	 * Smaller size of system
	 * @public
	 */
	Smaller : "Smaller",

	/**
	 * Largest size of system
	 * @public
	 */
	Largest : "Largest",

	/**
	 * new size regular size
	 * @public
	 */
	RegularSmall : "RegularSmall"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.LandscapeObject.
jQuery.sap.declare("sap.landvisz.LandscapeObject");
/**
 * @class Type of object in the landscape
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.LandscapeObject = {

	/**
	 * Technical system type
	 * @public
	 */
	TechnicalSystem : "TechnicalSystem",

	/**
	 * Product systems type
	 * @public
	 */
	ProductSystem : "ProductSystem",

	/**
	 * Database type
	 * @public
	 */
	Database : "Database",

	/**
	 * Product type
	 * @public
	 */
	Product : "Product",

	/**
	 * Product version type
	 * @public
	 */
	ProductVersion : "ProductVersion",

	/**
	 * SAP Component Type
	 * @public
	 */
	SapComponent : "SapComponent",

	/**
	 * SAP Track Type
	 * @public
	 */
	Track : "Track"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.ModelingStatus.
jQuery.sap.declare("sap.landvisz.ModelingStatus");
/**
 * @class sampl doc
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.ModelingStatus = {

	/**
	 * sample doc for types - ABAP
	 * @public
	 */
	ERROR : "ERROR",

	/**
	 * sample doc
	 * @public
	 */
	WARNING : "WARNING",

	/**
	 * sample doc
	 * @public
	 */
	NORMAL : "NORMAL"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.OptionType.
jQuery.sap.declare("sap.landvisz.OptionType");
/**
 * @class Action Type of a action
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.OptionType = {

	/**
	 * Option applicable on entity
	 * @public
	 */
	ENTITY : "ENTITY",

	/**
	 * Option applicable on view
	 * @public
	 */
	VIEW : "VIEW"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.SelectionViewPosition.
jQuery.sap.declare("sap.landvisz.SelectionViewPosition");
/**
 * @class position of selection view
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.SelectionViewPosition = {

	/**
	 * selection entity at left position
	 * @public
	 */
	LEFT : "LEFT",

	/**
	 * selection entity at right position
	 * @public
	 */
	RIGHT : "RIGHT",

	/**
	 * Selection entity at center position
	 * @public
	 */
	CENTER : "CENTER"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.SolutionType.
jQuery.sap.declare("sap.landvisz.SolutionType");
/**
 * @class View type of landscape viewer
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.SolutionType = {

	/**
	 * Component view of a solution
	 * @public
	 */
	COMPONENT_VIEW : "COMPONENT_VIEW",

	/**
	 * Deploy view of a solution
	 * @public
	 */
	DEPLOYMENT_VIEW : "DEPLOYMENT_VIEW"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.TechnicalSystemType.
jQuery.sap.declare("sap.landvisz.TechnicalSystemType");
/**
 * @class sampl doc
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.TechnicalSystemType = {

	/**
	 * types: ABAP
	 * @public
	 */
	ABAP : "ABAP",

	/**
	 * types: JAVA
	 * @public
	 */
	JAVA : "JAVA",

	/**
	 * Types: HANA DB
	 * @public
	 */
	HANADB : "HANADB",

	/**
	 * types - DUAL
	 * @public
	 */
	DUAL : "DUAL",

	/**
	 * types - DUAL
	 * @public
	 */
	SBOP : "SBOP",

	/**
	 * types: SUP
	 * @public
	 */
	SUP : "SUP",

	/**
	 * Types: GENERIC
	 * @public
	 */
	GENERIC : "GENERIC",

	/**
	 * types - INTROSCOPEMGR
	 * @public
	 */
	INTROSCOPEMGR : "INTROSCOPEMGR",

	/**
	 * Types: INTROSCOPESTD
	 * @public
	 */
	INTROSCOPESTD : "INTROSCOPESTD",

	/**
	 * types - LIVECACHESAP
	 * @public
	 */
	LIVECACHESAP : "LIVECACHESAP",

	/**
	 * types - MDM
	 * @public
	 */
	MDM : "MDM",

	/**
	 * types: TREX
	 * @public
	 */
	TREX : "TREX",

	/**
	 * types: UNSP3TIER
	 * @public
	 */
	UNSP3TIER : "UNSP3TIER",

	/**
	 * Types: UNSPCLUSTER
	 * @public
	 */
	UNSPCLUSTER : "UNSPCLUSTER",

	/**
	 * types - UNSPAPP
	 * @public
	 */
	UNSPAPP : "UNSPAPP",

	/**
	 * types - .NET
	 * @public
	 */
	MSNET : "MSNET",

	/**
	 * types: APACHESERVER
	 * @public
	 */
	APACHESERVER : "APACHESERVER",

	/**
	 * types: WEBSPHERE
	 * @public
	 */
	WEBSPHERE : "WEBSPHERE",

	/**
	 * Types: MSIISINST
	 * @public
	 */
	MSIISINST : "MSIISINST",

	/**
	 * types - WEBDISP
	 * @public
	 */
	WEBDISP : "WEBDISP"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.ViewType.
jQuery.sap.declare("sap.landvisz.ViewType");
/**
 * @class View type of landscape viewer
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.ViewType = {

	/**
	 * dependency view
	 * @public
	 */
	DEPENDENCY_VIEW : "DEPENDENCY_VIEW",

	/**
	 * Landscape view for selected view
	 * @public
	 */
	SELECTION_VIEW : "SELECTION_VIEW",

	/**
	 * Solution View for a Landscape Objects
	 * @public
	 */
	SOLUTION_VIEW : "SOLUTION_VIEW"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.landvisz.internal.ContainerType.
jQuery.sap.declare("sap.landvisz.internal.ContainerType");
/**
 * @class ContainerType
 *
 * @version 1.50.0
 * @static
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.landvisz.internal.ContainerType = {

	/**
	 * Type Product
	 * @public
	 */
	Product : "Product",

	/**
	 * Type Product version
	 * @public
	 */
	ProductVersion : "ProductVersion",

	/**
	 * Product Instances in the system
	 * @public
	 */
	ProductInstances : "ProductInstances",

	/**
	 * Software Components in the system
	 * @public
	 */
	SoftwareComponents : "SoftwareComponents"

};
