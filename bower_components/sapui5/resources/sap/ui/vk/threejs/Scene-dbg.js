/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */


// Provides the Scene class.
sap.ui.define([
	"jquery.sap.global", "../Scene", "./NodeHierarchy"
], function(jQuery, SceneBase, NodeHierarchy) {
	"use strict";

	/**
	 * Constructor for a new Scene.
	 *
	 * @class Provides the interface for the 3D model.
	 *
	 * The objects of this class should not be created directly.
	 *
	 * @param {THREE.Scene} scene The three.js scene object.
	 * @public
	 * @author SAP SE
	 * @version 1.50.7
	 * @extends sap.ui.vk.Scene
	 * @alias sap.ui.vk.threejs.Scene
	 * @experimental Since 1.50.0 This class is experimental and might be modified or removed in future versions.
	 */
	var Scene = SceneBase.extend("sap.ui.vk.threejs.Scene", /** @lends sap.ui.vk.threejs.Scene.prototype */ {
		metadata: {
			publicMethods: [
				"getDefaultNodeHierarchy",
				"getId",
				"getSceneRef"
			]
		},

		constructor: function(scene) {
			SceneBase.call(this);

			this._id = jQuery.sap.uid();
			this._scene = scene;
			this._state = null;
			this._defaultNodeHierarchy = null;
		}
	});

	Scene.prototype.destroy = function() {
		if (this._defaultNodeHierarchy) {
			this._defaultNodeHierarchy.destroy();
			this._defaultNodeHierarchy = null;
		}
		this._state = null;
		this._scene = null;

		SceneBase.prototype.destroy.call(this);
	};

	/**
	 * Gets the unique ID of the Scene object.
	 * @returns {string} The unique ID of the Scene object.
	 * @public
	 */
	Scene.prototype.getId = function() {
		return this._id;
	};

	/**
	 * Gets the default node hierarchy in the Scene object.
	 * @returns {sap.ui.vk.NodeHierarchy} The default node hierarchy in the Scene object.
	 * @public
	 */
	Scene.prototype.getDefaultNodeHierarchy = function() {
		if (!this._defaultNodeHierarchy) {
			this._defaultNodeHierarchy = new NodeHierarchy(this);
		}
		return this._defaultNodeHierarchy;
	};

	/**
	 * Gets the scene reference for the Scene object.
	 * @returns {THREE.Scene} The three.js scene.
	 * @public
	 */
	Scene.prototype.getSceneRef = function() {
		return this._scene;
	};

	Scene.prototype._setState = function(state) {
		this._state = state;
	};

	return Scene;
});
