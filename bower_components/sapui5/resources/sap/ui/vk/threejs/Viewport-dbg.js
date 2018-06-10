/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
// Provides control sap.ui.vk.threejs.Viewport.
sap.ui.define([ "jquery.sap.global", "../library", "../ViewportBase", "sap/ui/core/ResizeHandler",
	"../Loco", "./thirdparty/three", "../ContentConnector", "../ViewStateManager", "./ViewportGestureHandler" ],
	function(jQuery, library, ViewportBase, ResizeHandler, Loco, threeJs, ContentConnector, ViewStateManager, ViewportGestureHandler) {
		"use strict";

		/**
		 *  Constructor for a new three js viewport.
		 *
		 * @class Provides a base class control for three js canvas.
		 *
		 * @public
		 * @author SAP SE
		 * @version 1.50.7
		 * @extends sap.ui.core.Control
		 * @alias sap.ui.vk.threejs.Viewport
		 * @experimental Since 1.50.0 This class is experimental and might be modified or removed in future versions.
		 */
		var Viewport = ViewportBase.extend("sap.ui.vk.threejs.Viewport", /** @lends sap.ui.vk.threejs.Viewport.prototype  */ {
			metadata: {
				library: "sap.ui.vk",
				publicMethods: [
					"setScene",
					"getScene",
					"setCamera", // need to find out if we want to expose threejs object directly or not BEGIN
					"getCamera",
					"getRenderer", // END
					"hitTest",
					"tap",
					"render"
				]
			}
		});

		var basePrototype = Viewport.getMetadata().getParent().getClass().prototype;

		Viewport.prototype.init = function() {

			if (basePrototype.init) {
				basePrototype.init.call(this);
			}

			this._resizeListenerId = null;
			this._renderLoopRequestId = 0;
			this._renderLoopFunction = this._renderLoop.bind(this);

			var dummyWidth = 1; // resize event will correct this later
			var dummyHeight = 1;

			this._renderer = new THREE.WebGLRenderer({ antialias: true });
			this._renderer.setClearColor(0xf0f0f0);
			this._renderer.setPixelRatio(window.devicePixelRatio);
			this._renderer.setSize(dummyWidth, dummyHeight);

			// default scene and camera since we want this viewport to function by its own.
			var near = 1;
			var far = 20000;
			this._camera = new THREE.OrthographicCamera(dummyWidth / -2, dummyWidth / 2, dummyHeight / 2, dummyHeight / -2, near, far);

			this._camera.position.set(0, 0, 10000);
			this._camera.zoom = 10;


			this._viewportGestureHandler = new ViewportGestureHandler(this);

			this._loco = new Loco();
			this._loco.addHandler(this._viewportGestureHandler);
		};

		Viewport.prototype.exit = function() {
			this._loco.removeHandler(this._viewportGestureHandler);
			this._viewportGestureHandler.destroy();

			if (this._resizeListenerId) {
				ResizeHandler.deregister(this._resizeListenerId);
				this._resizeListenerId = null;
			}

			this._stopRenderLoop();

			this.setScene(null);
			this.setCamera(null);
			this._renderer = null;
			this._loco = null;
			this._viewportGestureHandler = null;

			if (basePrototype.exit) {
				basePrototype.exit.call(this);
			}
		};

		/**
		 * Starts the render loop.
		 * @returns {sap.ui.vk.threejs.Viewport} <code>this</code> to allow method chaining.
		 * @private
		 */
		Viewport.prototype._startRenderLoop = function() {
			if (!this._renderLoopRequestId) {
				this._renderLoopRequestId = window.requestAnimationFrame(this._renderLoopFunction);
			}
			return this;
		};

		/**
		 * Stops the render loop.
		 * @returns {sap.ui.vk.threejs.Viewport} <code>this</code> to allow method chaining.
		 * @private
		 */
		Viewport.prototype._stopRenderLoop = function() {
			if (this._renderLoopRequestId) {
				window.cancelAnimationFrame(this._renderLoopRequestId);
				this._renderLoopRequestId = 0;
			}
			return this;
		};

		Viewport.prototype.onBeforeRendering = function() {
			if (this._resizeListenerId) {
				ResizeHandler.deregister(this._resizeListenerId);
				this._resizeListenerId = null;
			}

			this._stopRenderLoop();
		};

		Viewport.prototype.onAfterRendering = function() {

			var domRef = this.getDomRef();
			domRef.appendChild(this._renderer.domElement);

			this._resizeListenerId = ResizeHandler.register(this, this._handleResize.bind(this));

			var rect = domRef.getBoundingClientRect();
			this._handleResize({
				size: {
					width: rect.width,
					height: rect.height
				}
			});

			this._startRenderLoop();
		};

		Viewport.prototype._updateCamera = function(width, height) {
			if (!this._camera) {
				return false;
			}

			if (this._camera.isPerspectiveCamera) {
				this._camera.aspect = width / height;
			} else {
				this._camera.left = width / -2;
				this._camera.right = width / 2;
				this._camera.top = height / 2;
				this._camera.bottom = height / -2;
			}
			this._camera.updateProjectionMatrix();

			return true;
		};

		Viewport.prototype._handleResize = function(event) {

			if (!this._camera || !this._renderer) {
				// nothing to do
				return false;
			}

			var width = event.size.width;
			var height = event.size.height;
			this._updateCamera(width, height);
			this._renderer.setSize(width, height);

			this.fireResize({
				size: {
					width: width,
					height: height
				}
			});

			return true;

		};

		Viewport.prototype.setScene = function(scene) {
			this._scene = scene;

			var nativeScene = this._scene ? this._scene.getSceneRef() : undefined;
			if (nativeScene) {

				// we create the scene and assume we have lights. Grab 1st one so we do 'CAD optimize light'
				// Basically light at your eye position
				var group;
				for (var i = 0; i < nativeScene.children.length; i++) {
					group = nativeScene.children[ i ];
					if (group.name === "DefaultLights" && group.children.length) {
						if (group.children[0] instanceof THREE.DirectionalLight) {
							this._eyePointLight = group.children[0];
						}
					}
				}
			}
		};

		Viewport.prototype.getScene = function() {
			return this._scene;
		};

		Viewport.prototype.setCamera = function(camera) {
			this._camera = camera;

			var devicePixelRatio = window.devicePixelRatio || 1;

			if (this._camera && this._renderer) {
				this._updateCamera(this._renderer.domElement.width * devicePixelRatio, this._renderer.domElement.height * devicePixelRatio);
			}
		};

		Viewport.prototype.getCamera = function() {
			return this._camera;
		};

		Viewport.prototype.getRenderer = function() {
			return this._renderer;
		};

		/**
 		 * Performs a screen-space hit test and gets the hit node reference, it must be called between beginGesture() and endGesture()
 		 *
 		 * @param {int} x: x coordinate in viewport to perform hit test
 	     * @param {int} y: y coordinate in viewport to perform hit test
 	     * @returns {object} object under the viewport coordinates (x, y).
 		 * @experimental
 		*/
		Viewport.prototype.hitTest = function(x, y) {
			var nativeScene = this._scene ? this._scene.getSceneRef() : undefined;
			if (!this._camera || !nativeScene) {
				return null;
			}

			var element = this._renderer.domElement;
			var mouse = new THREE.Vector2((x - element.offsetLeft) / element.width * 2 - 1,
				(element.offsetTop - y) / element.height * 2 + 1);
			var raycaster = new THREE.Raycaster();

			raycaster.setFromCamera(mouse, this._camera);
			var intersects = raycaster.intersectObjects(nativeScene.children, true);

			if (intersects && intersects.length) {
				return intersects[ 0 ];
			}

			return null;
		};

		/**
		 * Executes a click or tap gesture.
		 *
		 * @param {int} x The tap gesture's x-coordinate.
		 * @param {int} y The tap gesture's y-coordinate.
		 * @param {boolean} isDoubleClick Indicates whether the tap gesture should be interpreted as a double-click. A value of <code>true</code> indicates a double-click gesture, and <code>false</code> indicates a single click gesture.
		 * @returns {sap.ui.vk.threejs.Viewport} this
		 */
		Viewport.prototype.tap = function(x, y, isDoubleClick) {

			if (!isDoubleClick) {
				if (this._viewStateManager) {
					var hit = this.hitTest(x, y); // NB: pass (x, y) in CSS pixels, hitTest will convert them to device pixels.

					var node = hit && hit.object;

					var parameters = {
						picked: node ? [ node ] : []
					};
					this.fireNodesPicked(parameters);

					if (this.getSelectionMode() === sap.ui.vk.SelectionMode.Exclusive) {
						this.exclusiveSelectionHandler(parameters.picked);
					} else if (this.getSelectionMode() === sap.ui.vk.SelectionMode.Sticky) {
						this.stickySelectionHandler(parameters.picked);
					}
				}

			} else {
				// do double click thingy
			}

			return this;
		};

		////////////////////////////////////////////////////////////////////////
		// Keyboard handling begins.

		var offscreenPosition = { x: -2, y: -2 };
		var rotateDelta = 2;
		var panDelta = 5;

		[
			{ key: "left", dx: -rotateDelta, dy: 0 },
			{ key: "right", dx: +rotateDelta, dy: 0 },
			{ key: "up", dx: 0, dy: -rotateDelta },
			{ key: "down", dx: 0, dy: +rotateDelta }
		].forEach(function(item) {
			Viewport.prototype[ "onsap" + item.key ] = function(event) {
				var cameraController = this._viewportGestureHandler._cameraController;
				cameraController.beginGesture(offscreenPosition.x, offscreenPosition.y);
				cameraController.rotate(item.dx, item.dy, true);
				cameraController.endGesture();
				event.preventDefault();
				event.stopPropagation();
			};
		});

		[
			{ key: "left", dx: -panDelta, dy: 0 },
			{ key: "right", dx: +panDelta, dy: 0 },
			{ key: "up", dx: 0, dy: -panDelta },
			{ key: "down", dx: 0, dy: +panDelta }
		].forEach(function(item) {
			Viewport.prototype[ "onsap" + item.key + "modifiers" ] = function(event) {
				if (event.shiftKey && !(event.ctrlKey || event.altKey || event.metaKey)) {
					var cameraController = this._viewportGestureHandler._cameraController;
					cameraController.beginGesture(offscreenPosition.x, offscreenPosition.y);
					cameraController.pan(item.dx, item.dy);
					cameraController.endGesture();
					event.preventDefault();
					event.stopPropagation();
				}
			};
		});

		[
			{ key: "minus", d: 0.98 },
			{ key: "plus", d: 1.02 }
		].forEach(function(item) {
			ViewportBase.prototype[ "onsap" + item.key ] = function(event) {
				var cameraController = this._viewportGestureHandler._cameraController;
				cameraController.beginGesture(this.$().width() / 2, this.$().height() / 2);
				cameraController.zoom(item.d);
				cameraController.endGesture();
				event.preventDefault();
				event.stopPropagation();
			};
		});

		// Keyboard handling ends.
		////////////////////////////////////////////////////////////////////////

		Viewport.prototype._handleVisibilityChanged =
		Viewport.prototype._handleSelectionChanged =
		Viewport.prototype._handleOpacityChanged =
		Viewport.prototype._handleTintColorChanged =
		Viewport.prototype._handleHighlightColorChanged =
			function(event) {
				this.render();
			};

		Viewport.prototype._renderLoop = function() {
			if (!this._renderer || !this.getDomRef()) {// break render loop
				this._renderLoopRequestId = 0;
				return;
			}

			if (this._viewportGestureHandler) {
				this._viewportGestureHandler.update();
			}

			// move light to eye position
			if (this._eyePointLight && this._camera) {
				this._eyePointLight.position.copy(this._camera.position);
				this._eyePointLight.position.normalize();
			}

			// TODO: onBefore Rendering callback?

			this.render();

			this._renderLoopRequestId = window.requestAnimationFrame(this._renderLoopFunction); // request next frame
		};

		Viewport.prototype.render = function() {
			var nativeScene = this._scene ? this._scene.getSceneRef() : undefined;
			if (!nativeScene || !this._camera || !this._renderer) {
				return;
			}
			this._renderer.render(nativeScene, this._camera);
		};

		Viewport.prototype._onAfterUpdateContentConnector = function() {
			this.setScene(this._contentConnector.getContent());
		};

		Viewport.prototype._onBeforeClearContentConnector = function() {
			this.setScene(null);
		};

		Viewport.prototype._handleContentReplaced = function(event) {
			var content = event.getParameter("newContent");
			if (!(content instanceof sap.ui.vk.threejs.Scene)) {
				content = null;
			}
			this.setScene(content);
		};

		Viewport.prototype._onAfterUpdateViewStateManager = function() {
		};

		Viewport.prototype._onBeforeClearViewStateManager = function() {
		};

		ContentConnector.injectMethodsIntoClass(Viewport);
		ViewStateManager.injectMethodsIntoClass(Viewport);

		return Viewport;
	});
