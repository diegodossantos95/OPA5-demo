/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.Viewport.
sap.ui.define([
	"jquery.sap.global", "./library", "./ViewportBase", "sap/ui/core/ResizeHandler", "./Loco", "./ViewportHandler",
	"./Smart2DHandler", "./Messages", "./ContentConnector", "./ViewStateManager"
], function(
	jQuery, library, ViewportBase, ResizeHandler, Loco, ViewportHandler,
	Smart2DHandler, Messages, ContentConnector, ViewStateManager
) {
	"use strict";

	/**
	 * Constructor for a new Viewport.
	 *
	 * @class
	 * Provides a rendering canvas for the 3D elements of a loaded scene.
	 *
	 * @param {string} [sId] ID for the new Viewport control. Generated automatically if no ID is given.
	 * @param {object} [mSettings] Initial settings for the new Viewport control.
	 * @public
	 * @author SAP SE
	 * @version 1.50.7
	 * @extends sap.ui.vk.ViewportBase
	 * @alias sap.ui.vk.Viewport
	 * @experimental Since 1.50.0 This class is experimental and might be modified or removed in future versions.
	 */
	var Viewport = ViewportBase.extend("sap.ui.vk.Viewport", /** @lends sap.ui.vk.Viewport.prototype */ {
		metadata: {
			library: "sap.ui.vk",

			publicMethods: [

			]
		}
	});

	var basePrototype = Viewport.getMetadata().getParent().getClass().prototype;

	Viewport.prototype.init = function() {
		if (basePrototype.init) {
			basePrototype.init.call(this);
		}

		this._implementation = null;
		this._deferred = {};              // properties/objects that are to be forwarded to _implementation when it is created.
	};

	Viewport.prototype.exit = function() {
		this._deferred = null;
		this._destroyImplementation();

		if (basePrototype.exit) {
			basePrototype.exit.call(this);
		}
	};

	Viewport.prototype.getImplementation = function() {
		return this._implementation;
	};

	Viewport.prototype._destroyImplementation = function() {
		if (this._implementation) {
			this._implementation.destroy();
			this._implementation = null;
		}
		return this;
	};

	////////////////////////////////////////////////////////////////////////
	// Propagate public properties to implementation

	Viewport.prototype.getShowDebugInfo = function() {
		if (this._implementation) {
			return this._implementation.getShowDebugInfo();
		}
		return basePrototype.getShowDebugInfo.call(this);
	};

	Viewport.prototype.setShowDebugInfo = function(value) {
		basePrototype.setShowDebugInfo.call(this, value);
		if (this._implementation) {
			this._implementation.setShowDebugInfo(value);
		}
		return this;
	};

	Viewport.prototype.getBackgroundColorTop = function() {
		if (this._implementation) {
			return this._implementation.getBackgroundColorTop();
		}
		return basePrototype.getBackgroundColorTop.call(this);
	};

	Viewport.prototype.setBackgroundColorTop = function(value) {
		basePrototype.setBackgroundColorTop.call(this, value);
		if (this._implementation) {
			this._implementation.setBackgroundColorTop(value);
		}
		return this;
	};

	Viewport.prototype.getBackgroundColorBottom = function() {
		if (this._implementation) {
			return this._implementation.getBackgroundColorBottom();
		}
		return basePrototype.getBackgroundColorBottom.call(this);
	};

	Viewport.prototype.setBackgroundColorBottom = function(value) {
		basePrototype.setBackgroundColorBottom.call(this, value);
		if (this._implementation) {
			this._implementation.setBackgroundColorBottom(value);
		}
		return this;
	};

	Viewport.prototype.setWidth = function(value) {
		basePrototype.setWidth.call(this, value);
		if (this._implementation) {
			this._implementation.setWidth(value);
		}
		return this;
	};

	Viewport.prototype.setHeight = function(value) {
		basePrototype.setHeight.call(this, value);
		if (this._implementation) {
			this._implementation.setHeight(value);
		}
		return this;
	};

	Viewport.prototype.setSelectionMode = function(value) {
		basePrototype.setSelectionMode.call(this, value);
		if (this._implementation) {
			this._implementation.setSelectionMode(value);
		}
		return this;
	};

	Viewport.prototype.getSelectionMode = function() {
		if (this._implementation) {
			return this._implementation.getSelectionMode();
		}
		return basePrototype.getSelectionMode.call(this);
	};

	////////////////////////////////////////////////////////////////////////
	// Content connector handling begins.

	Viewport.prototype._onAfterUpdateContentConnector = function() {
		this._setScene(this._contentConnector.getContent());
	};

	Viewport.prototype._onBeforeClearContentConnector = function() {
		this._setScene(null);
	};

	Viewport.prototype._handleContentReplaced = function(event) {
		var content = event.getParameter("newContent");
		if (!(content instanceof sap.ui.vk.Scene)) {
			content = null;
		}
		this._setScene(content);
	};

	Viewport.prototype._setScene = function(scene) {
		if (scene instanceof sap.ui.vk.Scene) {
			var sceneType = scene.getMetadata().getName(),
			    implementationType = this._implementation && this._implementation.getMetadata().getName(),
			    reuseImplemenation = sceneType === "sap.ui.vk.dvl.Scene" && implementationType === "sap.ui.vk.dvl.Viewport" ||
			                         sceneType === "sap.ui.vk.threejs.Scene" && implementationType === "sap.ui.vk.threejs.Viewport";

			if (!reuseImplemenation) {
				this._destroyImplementation();
				var newImplementationType;
				var that = this;

				if (sceneType === "sap.ui.vk.dvl.Scene") {
					newImplementationType = "sap.ui.vk.dvl.Viewport";

					jQuery.sap.require(newImplementationType);
					this._implementation = new (jQuery.sap.getObject(newImplementationType))({
						viewStateManager: this.getViewStateManager(),
						// Check.. as we don't have these in the base....
						// urlClicked: function(event) {
						// 	that.fireUrlClicked({
						// 		nodeRef: event.getParameter("nodeRef"),
						// 		url: event.getParameter("url")
						// 	});
						// },
						// nodeClicked: function(event) {
						// 	that.fireNodeClicked({
						// 		nodeRef: event.getParameter("nodeRef"),
						// 		x: event.getParameter("x"),
						// 		y: event.getParameter("y")
						// 	});
						// },
						// pan: function(event) {
						// 	that.firePan({
						// 		dx: event.getParameter("dx"),
						// 		dy: event.getParameter("dy")
						// 	});
						// },
						// zoom: function(event) {
						// 	that.fireZoom({
						// 		zoomFactor: event.getParameter("zoomFactor")
						// 	});
						// },
						// rotate: function(event) {
						// 	that.fireRotate({
						// 		dx: event.getParameter("dx"),
						// 		dy: event.getParameter("dy")
						// 	});
						// },
						resize: function(event) {
							that.fireResize({
								size: event.getParameter("size")
							});
						},
						// viewActivated: function(event) {
						// 	that.fireViewActivated({
						// 		type: event.getParameter("type")
						// 	});
						// },
						// frameRenderingFinished: function(event) {
						// 	that.fireFrameRenderingFinished();
						// },
						showDebugInfo: this.getShowDebugInfo(),
						width: this.getWidth(),
						height: this.getHeight(),
						backgroundColorTop: this.getBackgroundColorTop(),
						backgroundColorBottom: this.getBackgroundColorBottom(),
						selectionMode: this.getSelectionMode(),
						contentConnector: this.getContentConnector() // content connector must be the last parameter in the list!
					});

				} else if (sceneType === "sap.ui.vk.threejs.Scene") {
					newImplementationType = "sap.ui.vk.threejs.Viewport";

					jQuery.sap.require(newImplementationType);
					this._implementation = new (jQuery.sap.getObject(newImplementationType))({
						viewStateManager: this.getViewStateManager(),
						showDebugInfo: this.getShowDebugInfo(),
						width: this.getWidth(),
						height: this.getHeight(),
						backgroundColorTop: this.getBackgroundColorTop(),
						backgroundColorBottom: this.getBackgroundColorBottom(),
						selectionMode: this.getSelectionMode(),
						contentConnector: this.getContentConnector() // content connector must be the last parameter in the list!
					});
				}

				if (newImplementationType) {
					if ("graphicsCore" in this._deferred && this._implementation.setGraphicsCore) {
						this._implementation.setGraphicsCore(this._deferred.graphicsCore);
					}
					delete this._deferred.graphicsCore;

					if ("scene" in this._deferred && this._implementation.setScene) {
						this._implementation.setScene(this._deferred.scene);
					}
					delete this._deferred.scene;

					this._implementation.attachNodesPicked(function(event) {
						this.fireNodesPicked({
							picked: event.getParameter("picked")
						});
					}, this);
				}

				this.invalidate();
			}
		} else {
			this._destroyImplementation();
			this.invalidate();
		}
		return this;
	};

	// Content connector handling ends.
	////////////////////////////////////////////////////////////////////////

	Viewport.prototype._onAfterUpdateViewStateManager = function() {
		if (this._implementation) {
			this._implementation.setViewStateManager(this._viewStateManager);
		}
	};

	Viewport.prototype._onBeforeClearViewStateManager = function() {
		if (this._implementation) {
			this._implementation.setViewStateManager(null);
		}
	};

	ContentConnector.injectMethodsIntoClass(Viewport);
	ViewStateManager.injectMethodsIntoClass(Viewport);

	return Viewport;
});
