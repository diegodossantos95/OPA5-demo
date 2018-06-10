/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.landvisz.internal.TreeField.
jQuery.sap.declare("sap.landvisz.internal.TreeField");
jQuery.sap.require("sap.landvisz.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new internal/TreeField.
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
 * <li>{@link #getTreeModel treeModel} : object</li>
 * <li>{@link #getBindingName bindingName} : string</li>
 * <li>{@link #getRenderingSize renderingSize} : sap.landvisz.EntityCSSSize</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getTreeNode treeNode} : sap.ui.commons.TreeNode[]</li></ul>
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
 * A control to render tree field in the control
 * @extends sap.ui.core.Control
 * @version 1.50.0
 *
 * @constructor
 * @public
 * @name sap.landvisz.internal.TreeField
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.landvisz.internal.TreeField", { metadata : {

	library : "sap.landvisz",
	properties : {
		"treeModel" : {type : "object", group : "Data", defaultValue : null},
		"bindingName" : {type : "string", group : "Data", defaultValue : null},
		"renderingSize" : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : null}
	},
	aggregations : {
		"treeNode" : {type : "sap.ui.commons.TreeNode", multiple : true, singularName : "treeNode"}
	}
}});


/**
 * Creates a new subclass of class sap.landvisz.internal.TreeField with name <code>sClassName</code> 
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
 * @name sap.landvisz.internal.TreeField.extend
 * @function
 */


/**
 * Getter for property <code>treeModel</code>.
 * treeModel to be rendered in the control
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {object} the value of property <code>treeModel</code>
 * @public
 * @name sap.landvisz.internal.TreeField#getTreeModel
 * @function
 */

/**
 * Setter for property <code>treeModel</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object} oTreeModel  new value for property <code>treeModel</code>
 * @return {sap.landvisz.internal.TreeField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.TreeField#setTreeModel
 * @function
 */


/**
 * Getter for property <code>bindingName</code>.
 * binding name
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>bindingName</code>
 * @public
 * @name sap.landvisz.internal.TreeField#getBindingName
 * @function
 */

/**
 * Setter for property <code>bindingName</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sBindingName  new value for property <code>bindingName</code>
 * @return {sap.landvisz.internal.TreeField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.TreeField#setBindingName
 * @function
 */


/**
 * Getter for property <code>renderingSize</code>.
 * rendering size of the control
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.landvisz.EntityCSSSize} the value of property <code>renderingSize</code>
 * @public
 * @name sap.landvisz.internal.TreeField#getRenderingSize
 * @function
 */

/**
 * Setter for property <code>renderingSize</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.landvisz.EntityCSSSize} oRenderingSize  new value for property <code>renderingSize</code>
 * @return {sap.landvisz.internal.TreeField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.TreeField#setRenderingSize
 * @function
 */


/**
 * Getter for aggregation <code>treeNode</code>.<br/>
 * aggregation on the tree field to render tree nodes
 * 
 * @return {sap.ui.commons.TreeNode[]}
 * @public
 * @name sap.landvisz.internal.TreeField#getTreeNode
 * @function
 */


/**
 * Inserts a treeNode into the aggregation named <code>treeNode</code>.
 *
 * @param {sap.ui.commons.TreeNode}
 *          oTreeNode the treeNode to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the treeNode should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the treeNode is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the treeNode is inserted at 
 *             the last position        
 * @return {sap.landvisz.internal.TreeField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.TreeField#insertTreeNode
 * @function
 */

/**
 * Adds some treeNode <code>oTreeNode</code> 
 * to the aggregation named <code>treeNode</code>.
 *
 * @param {sap.ui.commons.TreeNode}
 *            oTreeNode the treeNode to add; if empty, nothing is inserted
 * @return {sap.landvisz.internal.TreeField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.TreeField#addTreeNode
 * @function
 */

/**
 * Removes an treeNode from the aggregation named <code>treeNode</code>.
 *
 * @param {int | string | sap.ui.commons.TreeNode} vTreeNode the treeNode to remove or its index or id
 * @return {sap.ui.commons.TreeNode} the removed treeNode or null
 * @public
 * @name sap.landvisz.internal.TreeField#removeTreeNode
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>treeNode</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.commons.TreeNode[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.landvisz.internal.TreeField#removeAllTreeNode
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.commons.TreeNode</code> in the aggregation named <code>treeNode</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.commons.TreeNode}
 *            oTreeNode the treeNode whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.landvisz.internal.TreeField#indexOfTreeNode
 * @function
 */
	

/**
 * Destroys all the treeNode in the aggregation 
 * named <code>treeNode</code>.
 * @return {sap.landvisz.internal.TreeField} <code>this</code> to allow method chaining
 * @public
 * @name sap.landvisz.internal.TreeField#destroyTreeNode
 * @function
 */

// Start of sap/landvisz/internal/TreeField.js
///**
// * This file defines behavior for the control,
// */
sap.landvisz.internal.TreeField.prototype.init = function(){
   this.initializationDone = false;
};

sap.landvisz.internal.TreeField.prototype.exit = function() {
       
       this.tree && this.tree.destroy();
       this.oTreeNodeTemplate && this.oTreeNodeTemplate.destroy();
       this.jsonModel && this.jsonModel.destroy();
};

sap.landvisz.internal.TreeField.prototype.initControls = function() {

       var oNavigationAreaID = this.getId();
       if(!this.tree)
       this.tree = new sap.ui.commons.Tree(oNavigationAreaID+"CLVTree");
        if(!this.jsonModel)
       this.jsonModel = new sap.ui.model.json.JSONModel();
        if(!this.oTreeNodeTemplate)
       this.oTreeNodeTemplate = new sap.ui.commons.TreeNode(oNavigationAreaID+"CLVTreeNode");

};
