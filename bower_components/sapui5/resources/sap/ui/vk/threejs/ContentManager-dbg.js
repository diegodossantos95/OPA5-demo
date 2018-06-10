/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides object sap.ui.vk.threejs.ContentManager.
sap.ui.define([
	"jquery.sap.global", "../ContentManager", "./Scene", "../TransformationMatrix"
], function(
	jQuery, ContentManagerBase, Scene, TransformationMatrix
) {
	"use strict";

	/**
	 * Constructor for a new ContentManager.
	 *
	 * @class
	 * Provides a content manager object that uses the three.js library to load 3D files.
	 *
	 * When registering a content manager resolver with {@link sap.ui.vk.ContentConnector.addContentManagerResolver sap.ui.vk.ContentConnector.addContentManagerResolver}
	 * you can pass a function that will load a model and merge it into the three.js scene.
	 *
	 * The loader function takes two parameters:
	 * <ul>
	 *   <li>parentNode - {@link https://threejs.org/docs/index.html#api/objects/Group THREE.Group} - a grouping node to merge the content into</li>
	 *   <li>contentResource - {@link sap.ui.vk.ContentResource sap.ui.vk.ContentResource} - a content resource to load</li>
	 * </ul>
	 * The loader function returns a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise Promise}
	 * object. If the loading the model succeeds the promise object resolves with a value with the following structure:
	 * <ul>
	 *   <li>node - {@link https://threejs.org/docs/index.html#api/objects/Group THREE.Group} - the grouping node to which the content
	 *       is merged into. It should be the <code>parentNode</code> parameter that was passed to the loader function.</li>
	 *   <li>contentResource - {@link sap.ui.vk.ContentResource sap.ui.vk.ContentResource} - the content resource that was loaded.</li>
	 * </ul>
	 *
	 * @see {@link ContentConnector.addContentManagerResolver ContentConnector.addContentManagerResolver} or an example.
	 *
	 * @param {string} [sId] ID for the new ContentManager object. Generated automatically if no ID is given.
	 * @param {object} [mSettings] Initial settings for the new ContentConnector object.
	 * @protected
	 * @author SAP SE
	 * @version 1.50.7
	 * @extends sap.ui.vk.ContentManager
	 * @alias sap.ui.vk.threejs.ContentManager
	 * @since 1.50.0
	 * @experimental Since 1.50.0. This class is experimental and might be modified or removed in future versions.
	 */
	var ContentManager = ContentManagerBase.extend("sap.ui.vk.threejs.ContentManager", /** @lends sap.ui.vk.threejs.ContentManager.prototype */ {
		metadata: {
			library: "sap.ui.vk"
		}
	});

	var basePrototype = ContentManager.getMetadata().getParent().getClass().prototype;

	var testLoader = function(parentNode, contentResource) {
		return new Promise(function(resolve, reject) {
			var loader = new THREE.ObjectLoader();
			loader.load(
				// resource URL
				contentResource.getSource(),

				// pass the loaded data to the onLoad function.
				// Here it is assumed to be an object
				function(obj) {
					// add the loaded object to the scene
					parentNode.add(obj);

					resolve({
						node: parentNode,
						contentResource: contentResource
					});
				},

				// Function called when download progresses
				function(xhr) {
					// console.log((xhr.loaded / xhr.total * 100) + '% loaded');
				},

				// Function called when download errors
				function(xhr) {
					// console.error('An error happened');
					reject(new Error("Not object json"));
				}
			);
		});
	};

	ContentManager.prototype.init = function() {
		if (basePrototype.init) {
			basePrototype.init.call(this);
		}
	};

	ContentManager.prototype.exit = function() {
		if (basePrototype.exit) {
			basePrototype.exit.call(this);
		}
	};

	function initLights(nativeScene) {
		// temp measure to add light automatically. remove this later
		if (nativeScene) {
			var lightColors = [
				new THREE.Color(0.8, 0.8, 0.9).multiplyScalar(0.9),
				new THREE.Color(0.5, 0.5, 0.5).multiplyScalar(0.4),
				new THREE.Color(0.8, 0.8, 0.9).multiplyScalar(0.4),
				new THREE.Color(0.9, 0.9, 0.9).multiplyScalar(0.4) ];

			var lightDirs = [
				new THREE.Vector3(0, 0, 1).normalize(),
				new THREE.Vector3(-2.0, -1.5, -0.5).normalize(),
				new THREE.Vector3(2.0, 1.1, -2.5).normalize(),
				new THREE.Vector3(0.04, 0.01, 2.0).normalize() ];

			var lightGroup = new THREE.Group();
			nativeScene.add(lightGroup);
			lightGroup.name = "DefaultLights";

			for (var l = 0, lMax = lightColors.length; l < lMax; l++) {
				var directionalLight = new THREE.DirectionalLight();

				directionalLight.color.copy(lightColors[ l ]);
				directionalLight.position.copy(lightDirs[ l ]);
				lightGroup.add(directionalLight);
			}
		}
	}

	/**
	 * Starts downloading and building or updating the content from the content resources.
	 *
	 * This method is asynchronous.
	 *
	 * @param {any}                         content          The current content to update. It can be <code>null</code> if this is an initial loading call.
	 * @param {sap.ui.vk.ContentResource[]} contentResources The content resources to load or update.
	 * @returns {sap.ui.vk.ContentManager} <code>this</code> to allow method chaining.
	 * @public
	 * @since 1.50.0
	 */
	ContentManager.prototype.loadContent = function(content, contentResources) {
		var that = this;
		var load = function() {
			that.fireContentChangesStarted();

			var nativeScene = new THREE.Scene(),
				scene = new Scene(nativeScene);
			initLights(nativeScene);

			that._loadContentResources(scene, contentResources).then(
				function(values) { // onFulfilled
					scene._setState(values[0].state);

					that.fireContentChangesFinished({
						content: scene
					});
				},
				function(reason) { // onRejected
					jQuery.sap.log.error("Failed to load content resources.");
					that.fireContentChangesFinished({
						content: null,
						failureReason: [
							{
								error: reason,
								errorMessage: "Failed to load content resources."
							}
						]
					});
				}
			);
		};

		// This test allows to use application provided three.js.
		if (window.THREE) {
			load();
		} else {
			sap.ui.require([ "sap/ui/vk/threejs/thirdparty/three" ], function(dummy) {
				load();
			});
		}

		return this;
	};

	var findLoader = function(contentResource) {
		if (contentResource._contentManagerResolver
			&& contentResource._contentManagerResolver.settings
			&& contentResource._contentManagerResolver.settings.loader
		) {
			return contentResource._contentManagerResolver.settings.loader;
		}

		if (contentResource.getSource()) {
			// Try one of default loaders.
			var sourceType = contentResource.getSourceType();

			if (sourceType === "threejs.test.json") {
				return testLoader;
			}
			// TODO: report an error.
			return null;
		}
		return null;
	};

	ContentManager.prototype._loadContentResources = function(scene, contentResources) {
		var promises = [];

		contentResources.forEach(function loadContentResource(parentNode, contentResource) {
			var node = new THREE.Group();
			node.name = contentResource.getName();
			node.sourceId = contentResource.getSourceId();
			contentResource._shadowContentResource = {
				nodeProxy: scene.getDefaultNodeHierarchy().createNodeProxy(node)
			};
			var localMatrix = contentResource.getLocalMatrix();
			if (localMatrix) {
				node.applyMatrix(new THREE.Matrix4().fromArray(TransformationMatrix.convertTo4x4(localMatrix)));
			}
			parentNode.add(node);

			var loader = findLoader(contentResource);
			if (loader) {
				promises.push(loader(node, contentResource));
			} else {
				// TODO: report error if the content resource has a non-empty source property.
				promises.push(Promise.resolve({
					node: node,
					contentResource: contentResource
				}));
			}

			contentResource.getContentResources().forEach(loadContentResource.bind(this, node));
		}.bind(this, scene.getSceneRef()));

		return Promise.all(promises);
	};

	/**
	 * Destroys the content.
	 *
	 * @function
	 * @name sap.ui.vk.threejs.ContentManager#destroyContent
	 * @param {any} content The content to destroy.
	 * @returns {sap.ui.vk.ContentManager} <code>this</code> to allow method chaining.
	 * @public
	 * @since 1.50.0
	 */

	/**
	 * Collects and destroys unused objects and resources.
	 *
	 * @function
	 * @name sap.ui.vk.threejs.ContentManager#collectGarbage
	 * @returns {sap.ui.vk.ContentManager} <code>this</code> to allow method chaining.
	 * @public
	 * @since 1.50.0
	 */

	return ContentManager;
});
