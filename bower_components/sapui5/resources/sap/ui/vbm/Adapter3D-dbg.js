/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* global THREE */

// Provides class sap.ui.vbm.Adapter3D
sap.ui.define([
	"jquery.sap.global", "sap/ui/core/Element", "sap/ui/vk/ContentConnector", "sap/ui/vk/threejs/Viewport", "sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/ContentResource", "sap/ui/vk/TransformationMatrix", "./library"
], function(jQuery, Element, ContentConnector, Viewport, ViewStateManager,
	 ContentResource, TransformationMatrix, library
) {
	"use strict";

	var log        = jQuery.sap.log,
		Box3       = THREE.Box3,
		Vector2    = THREE.Vector2,
		Vector3    = THREE.Vector3,
		Face3      = THREE.Face3,
		Matrix4    = THREE.Matrix4,
		Quaternion = THREE.Quaternion,
		degToRad   = THREE.Math.degToRad;

	var createBox; // Forward declaration.

	/**
	 * Constructor for a new Visual Business Adapter 3D.
	 *
	 * @class
	 * Provides the ability to load VBI JSON into {@link sap.ui.vk.threejs.Viewport sap.ui.vk.threejs.Viewport} control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new object
	 * @author SAP SE
	 * @version 1.50.5
	 * @extends sap.ui.core.Element
	 * @constructor
	 * @public
	 * @alias sap.ui.vbm.Adapter3D
	 * @experimental Since 1.50.0 This class is experimental and might be modified or removed in future versions.
	 */
	var Adapter3D = Element.extend("sap.ui.vbm.Adapter3D", /** @lends sap.ui.vbm.Adapter3D.prototype */ {
		metadata: {
			library: "sap.ui.vbm",

			publicMethods: [
				"load"
			],

			associations: {
				/**
				 * The {@link sap.ui.vk.threejs.Viewport Viewport} control associated with the Adapter3D. The Adapter3D would invoke methods and subscribe to events
				 * on this {@link sap.ui.vk.threejs.Viewport Viewport} instance.
				 */
				viewport: {
					type: "sap.ui.vk.threejs.Viewport"
				}
			},

			events: {
				/**
				 * This event is fired when interactions in the viewport happen.
				 */
				submit: {
					parameters: {
						/**
						 * A string in the VBI JSON format.
						 */
						data: {
							type: "string"
						}
					}
				}
			}
		}
	});

	var basePrototype = Adapter3D.getMetadata().getParent().getClass().prototype;

	Adapter3D.prototype.init = function() {
		if (basePrototype.init) {
			basePrototype.init.call(this);
		}

		this._contentConnector = new ContentConnector();
		// Bind the lifespan of the content connector to this adapter instance.
		this.addDependent(this._contentConnector);
		this._contentConnector.attachContentReplaced(function(event) {
			var content = event.getParameter("newContent"),
				scene = content && content.getSceneRef();
			if (scene) {
				scene.rotation.x = degToRad(90);
			}
		}, this);

		this._viewStateManager = new ViewStateManager({
			contentConnector: this._contentConnector
		});
		// Bind the lifespan of the view state manager to this adapter instance.
		this.addDependent(this._viewStateManager);

		this._viewport = null;

		this._resourceFiles = {};
		this._dataTypes = {};
		this._contentResourceTemplates = {};
		this._data = [];
	};

	Adapter3D.prototype.exit = function() {
		// The content connector and view state manager will be destroyed automatically by the base class of this adapter.
		this._contentConnector = null;
		this._viewStateManager = null;
		this._disconnectViewport();

		this._resourceFiles = null;
		this._dataTypes = null;
		this._contentResourceTemplates = null;
		this._data = null;

		if (basePrototype.exit) {
			basePrototype.exit.call(this);
		}
	};

	// Override the auto-generated setter to suppress invalidation and to connect to the associated viewport.
	Adapter3D.prototype.setViewport = function(viewport) {
		this.setAssociation("viewport", viewport, true);
		this._configureViewport();
		return this;
	};

	/**
	 * Updates the connection to the associated viewport.
	 *
	 * @returns {sap.ui.vbm.Adapter3D} <code>this</code> to allow method chaining.
	 * @private
	 */
	Adapter3D.prototype._configureViewport = function() {
		// sap.ui.getCore().byId() does not define what it returns when it cannot find an element by ID,
		// the current implementation returns undefined, so coalesce the return value with null for predictable results.
		var associatedViewport = sap.ui.getCore().byId(this.getViewport()) || null;
		if (associatedViewport !== this._viewport) {
			this._disconnectViewport();
			this._viewport = associatedViewport;
			this._connectViewport();
		}
		return this;
	};

	/**
	 * Connects the associated viewport to the adapter's content connector and view state manager.
	 * Subscribes to events from the associated viewport.
	 *
	 * @returns {sap.ui.vbm.Adapter3D} <code>this</code> to allow method chaining.
	 * @private
	 */
	Adapter3D.prototype._connectViewport = function() {
		if (this._viewport) {
			this._viewport.setContentConnector(this._contentConnector);
			this._viewport.setViewStateManager(this._viewStateManager);
			this._viewport.attachNodesPicked(this._handleNodesPicked, this);
		}
		return this;
	};

	/**
	 * Unsubscribes from events from the associated viewport.
	 * Disconnects the associated viewport from the adapter's content connector and view state manager.
	 *
	 * @returns {sap.ui.vbm.Adapter3D} <code>this</code> to allow method chaining.
	 * @private
	 */
	Adapter3D.prototype._disconnectViewport = function() {
		if (this._viewport) {
			if (!this._viewport.bIsDestroyed) {
				this._viewport.detachNodesPicked(this._handleNodesPicked, this);
				this._viewport.setViewStateManager(null);
				this._viewport.setContentConnector(null);
			}
			this._viewport = null;
		}
		return this;
	};

	/**
	 * Handles the nodesPicked event from the associated viewport and converts it into the adapter's submit event.
	 *
	 * @param {sap.ui.base.Event} event The nodesPicked event.
	 * @private
	 */
	Adapter3D.prototype._handleNodesPicked = function(event) {
		var currentlySelected = [];
		this._viewStateManager.enumerateSelection(Array.prototype.push.bind(currentlySelected));

		if (currentlySelected.length > 0) {
			this._viewStateManager.setSelectionState(currentlySelected, false);
		}

		var parameters = event.getParameters();
		if (parameters.picked.length > 0) {
			this._viewStateManager.setSelectionState(parameters.picked, true);

			var dataElement = sap.ui.vbm.findInArray(this._data, function(d) { return d.meshUUID === parameters.picked[0].uuid; });

			var aActions, sVoName;
			for (var sVoType in this._groupedActions) {
				if (this._groupedActions.hasOwnProperty(sVoType)) {
					if (jQuery.sap.startsWith(dataElement.resourceType, sVoType)) {
						sVoName = sVoType;
						aActions = this._groupedActions[sVoType];
						break;
					}
				}
			}

			if (aActions) {
				var eventName = parameters.isDoubleClick ? "DoubleClick" : "Click",
				    action = sap.ui.vbm.findInArray(aActions, function(a) { return a.refEvent === eventName; });

				if (action) {
					var payload = {
						"version": "2.0",
						"xmlns:VB": "VB",
						"Action": {
							"name": action.name,
							"object": sVoName,
							"instance": dataElement.K,
							"Params": {
								"Param": [
									{
										"name": "x",
										"#": parameters.x
									},
									{
										"name": "y",
										"#": parameters.y
									}
								]
							}
						}
					};

					this.fireSubmit({
						data: JSON.stringify(payload)
					});
				}
			}
		}
	};

	/**
	 * Processes the DataTypes section from the VBI JSON.
	 *
	 * @param {object[]} aDataTypes The array of DataType objects to be processed from VBI JSON.
	 * @returns {sap.ui.vbm.Adapter3D} <code>this</code> to allow method chaining.
	 * @private
	 */
	Adapter3D.prototype._processDataTypes = function(aDataTypes) {
		var processAttributes = function(aA) {
			var oAttributes = {};

			aA.forEach(function(a) {
				oAttributes[a.name] = a.alias;
			});

			return oAttributes;
		};

		var processItem = function(oDt) {
			if ("A" in oDt) {
				this._dataTypes[oDt.name] = processAttributes([].concat(oDt.A));
			} else if ("N" in oDt) {
				var oEntity = {};
				[].concat(oDt.N).forEach(function(n) {
					if ("A" in n) {
						oEntity[n.name] = processAttributes([].concat(n.A));
					}
				});
				this._dataTypes[oDt.name] = oEntity;
			}
		};

		aDataTypes.forEach(processItem, this);
		return this;
	};

	/**
	 * Processes the Data section from the VBI JSON.
	 *
	 * This usually contains the scale, position and rotation details for each item that would be
	 * loaded into viewer.
	 *
	 * @param {object|object[]} oDataSet The array of Data objects to be processed from VBI JSON.
	 * @returns {sap.ui.vbm.Adapter3D} <code>this</code> to allow method chaining.
	 * @private
	 */
	Adapter3D.prototype._processData = function(oDataSet) {
		var processItem = function(r) {
			var contentResource,
				color = r.C.slice(r.C.indexOf("(") + 1, r.C.indexOf(")")).split(",").map(function(i) { return parseInt(i, 10); }),
				scale = r.S.split(";").map(parseFloat),
				rotation = r.Y.split(";").map(parseFloat),
				position = r.A.split(";").map(parseFloat),
				localMatrix = sap.ui.vk.TransformationMatrix.convertTo4x3(
					new Matrix4().compose(
						new Vector3(-position[0], position[1], position[2]),
						new Quaternion().setFromEuler(new THREE.Euler(degToRad(rotation[0]), degToRad(-rotation[1]), degToRad(-rotation[2]), 'XYZ')),
						new Vector3(scale[0], scale[1], scale[2])
					).elements
				);


			if (this._contentResourceTemplates.hasOwnProperty(r.resourceType)
				&& this._contentResourceTemplates[r.resourceType].contentResource
			) {
				var oProperties = this._contentResourceTemplates[r.resourceType].contentResource;
				contentResource = new ContentResource({
					source: {
						content: this._resourceFiles[oProperties.source],
						color: new THREE.Color(color[1] / 255, color[2] / 255, color[3] / 255),
						opacity: color[0] / 255
					},
					localMatrix: localMatrix
				});
			} else {
				var material = new THREE.MeshPhongMaterial(),
					boxGeometry = createBox();

				material.color = new THREE.Color(color[1] / 255, color[2] / 255, color[3] / 255);
				material.opacity = color[0] / 255;

				if (r.I) {
					material.map = new THREE.TextureLoader().load(this._resourceFiles[r.I]);
					material.map.flipY = false; // Use the Direct3D texture coordinate space where the origin is in the top left corner.
				}

				var box = new THREE.Mesh(
					boxGeometry,
					material
				);
				box.applyMatrix(new Matrix4().makeScale(1, -1, -1));

				contentResource = new ContentResource({
					source: box,
					localMatrix: localMatrix
				});
			}

			return contentResource;
		};

		// Flatten into an array as sequence is crucial to apply pos, rot, scale.

		if (!Array.isArray(oDataSet) &&
			!("name" in oDataSet) &&
			!("type" in oDataSet)
		) {
			this._data = [];
		} else {
			this._data = this._data.concat([].concat(oDataSet).map(function(d) {
				return [].concat(d.N.E).map(function(e) {
					e["resourceType"] = d.N.name;
					return e;
				});
			}).reduce(function(a, b) { return a.concat(b); }));
		}

		this._data.map(processItem, this).forEach(ContentConnector.prototype.addContentResource, this._contentConnector);

		return this;
	};

	/**
	 * Processes the Resources section from the VBI JSON.
	 *
	 * The resources section of the VBI JSON contains the pre-caliberated primitives that
	 * are to be loaded into the viewer and manipulated according the details from the Data section
	 *
	 * @param {object[]} aResources The array of DataType objects to be processed from VBI JSON.
	 * @returns {sap.ui.vbm.Adapter3D} <code>this</code> to allow method chaining.
	 * @private
	 */
	Adapter3D.prototype._processResources = function(aResources) {
		var resourceToFile = function(data, name) {
			return atob(data.split(",")[0]);
		};

		var processResource = function(r) {
			if (jQuery.sap.endsWith(r.name, ".dae")) {
				this._resourceFiles[r.name] = resourceToFile(r.value, r.name);
			} else {
				this._resourceFiles[r.name] = "data:" + r.name.split(".")[1] + ";base64," + r.value;
			}
		};

		aResources.forEach(processResource, this);

		return this;
	};

	/**
	 * Processes the Actions array from VBI JSON.
	 *
	 * @param {object} actions Actions section of VBI JSON. <br/>
	 * @returns {sap.ui.vbm.Adapter3D} <code>this</code> to allow method chaining.
	 * @private
	 */
	Adapter3D.prototype._processActions = function(actions) {
		this._groupedActions = actions.reduce(function(g, a) {
			var group = a.refVO;
			if (!a.refVO) {
				group = "General";
			}
			g[group] = g[group] || [];
			g[group].push(a);
			return g;
		}, {});

		return this;
	};

	/**
	 * Processes the VOs from the Scenes section from the VBI JSON.
	 *
	 * The VO definition forms the template for each instance of the primitive and acts as a bridge in
	 * collating the Data and DataTypes section for each primitive
	 *
	 * @param {object[]} aVOs The array of VOs to be processed from VBI JSON.
	 * @returns {sap.ui.vbm.Adapter3D} <code>this</code> to allow method chaining.
	 * @private
	 */
	Adapter3D.prototype._processVOs = function(aVOs) {
		var _processVO = function(oVO) {
			if (oVO.hasOwnProperty("model")) {
				oVO["contentResource"] = { source: oVO.model, sourceType: "dae", id: oVO.model };
			}
			this._contentResourceTemplates[oVO.datasource] = oVO;
		};

		aVOs.forEach(_processVO, this);
		return this;
	};

	/**
	 * Processes the various sections from the VBI JSON.
	 *
	 * The Resources, DataTypes, Scenes and Data sections from the VBI JSON are sequentially processed.
	 * Processing of the Data section would eventually lead to change in the content resources.
	 *
	 * @param {object|string} data The VBI JSON.
	 * @returns {sap.ui.vbm.Adapter3D} <code>this</code> to allow method chaining.
	 * @public
	 */
	Adapter3D.prototype.load = function(data) {
		// If the adapter was created before the associated viewport then the adapter might not be connected to the viewport.
		// In case if the associated viewport is destroyed this call will disconnect from the viewport.
		this._configureViewport();

		var oPayload = null;

		if (typeof data === "string") {
			try {
				oPayload = JSON.parse(data);
			} catch (ex) {
				log.error("sap.ui.vbm.Adapter: attempt to load invalid JSON string.");
				return this;
			}
		} else if (typeof data === "object") {
			oPayload = data;
		}

		if (!(oPayload && oPayload.SAPVB)) {
			log.error("sap.ui.vbm.Adapter3D: attempt to load null.");
			return this;
		}

		// Resources
		if (oPayload.SAPVB.Resources &&
			oPayload.SAPVB.Resources.Set &&
			oPayload.SAPVB.Resources.Set.Resource
		) {
			this._processResources([].concat(oPayload.SAPVB.Resources.Set.Resource));
		}

		// DataTypes
		if (oPayload.SAPVB.DataTypes &&
			oPayload.SAPVB.DataTypes.Set &&
			oPayload.SAPVB.DataTypes.Set.N
		) {
			this._processDataTypes([].concat(oPayload.SAPVB.DataTypes.Set.N));
		}

		// VOs
		if (oPayload.SAPVB.Scenes &&
			oPayload.SAPVB.Scenes.Set &&
			oPayload.SAPVB.Scenes.Set.Scene &&
			oPayload.SAPVB.Scenes.Set.Scene.VO
		) {
			this._processVOs([].concat(oPayload.SAPVB.Scenes.Set.Scene.VO));
		}

		// Actions
		if (oPayload.SAPVB.Actions &&
			oPayload.SAPVB.Actions.Set &&
			oPayload.SAPVB.Actions.Set.Action
		) {
			this._processActions([].concat(oPayload.SAPVB.Actions.Set.Action));
		}

		// Data
		if (oPayload.SAPVB.Data &&
			oPayload.SAPVB.Data.Set &&
			!jQuery.isEmptyObject(oPayload.SAPVB.Data.Set)
		) {
			this._processData(oPayload.SAPVB.Data.Set, true);
		}

		return this;
	};

	/**
	 * Creates a box.
	 *
	 * We cannot use the three.js BoxGeometry class as its faces, UVs etc are quite different from what is expected in legacy VB.
	 *
	 * The geometry is generated according to the algorithm in the legacy VB ActiveX control.
	 *
	 * @returns {THREE.Geometry} The box geometry.
	 * @private
	 */
	createBox = function() {
		var geometry = new THREE.Geometry(),
			halfSideLength = 0.1;

		geometry.vertices.push(
			// Top
			new Vector3( halfSideLength,  halfSideLength, -halfSideLength),
			new Vector3( halfSideLength, -halfSideLength, -halfSideLength),
			new Vector3(-halfSideLength, -halfSideLength, -halfSideLength),
			new Vector3(-halfSideLength,  halfSideLength, -halfSideLength),

			// Bottom
			new Vector3( halfSideLength,  halfSideLength,  halfSideLength),
			new Vector3(-halfSideLength,  halfSideLength,  halfSideLength),
			new Vector3(-halfSideLength, -halfSideLength,  halfSideLength),
			new Vector3( halfSideLength, -halfSideLength,  halfSideLength),

			// Right
			new Vector3( halfSideLength,  halfSideLength, -halfSideLength),
			new Vector3( halfSideLength,  halfSideLength,  halfSideLength),
			new Vector3( halfSideLength, -halfSideLength,  halfSideLength),
			new Vector3( halfSideLength, -halfSideLength, -halfSideLength),

			// Front
			new Vector3( halfSideLength, -halfSideLength, -halfSideLength),
			new Vector3( halfSideLength, -halfSideLength,  halfSideLength),
			new Vector3(-halfSideLength, -halfSideLength,  halfSideLength),
			new Vector3(-halfSideLength, -halfSideLength, -halfSideLength),

			// Left
			new Vector3(-halfSideLength, -halfSideLength, -halfSideLength),
			new Vector3(-halfSideLength, -halfSideLength,  halfSideLength),
			new Vector3(-halfSideLength,  halfSideLength,  halfSideLength),
			new Vector3(-halfSideLength,  halfSideLength, -halfSideLength),

			// Back
			new Vector3( halfSideLength,  halfSideLength,  halfSideLength),
			new Vector3( halfSideLength,  halfSideLength, -halfSideLength),
			new Vector3(-halfSideLength,  halfSideLength, -halfSideLength),
			new Vector3(-halfSideLength,  halfSideLength,  halfSideLength)
		);

		var normalTop    = new Vector3( 0,  0, -1),
			normalBottom = new Vector3( 0,  0,  1),
			normalRight  = new Vector3( 1,  0,  0),
			normalFront  = new Vector3( 0, -1,  0),
			normalLeft   = new Vector3(-1,  0,  0),
			normalBack   = new Vector3( 0,  1,  0),
			defaultColor = new THREE.Color(0.5, 0.5, 0.5);

		geometry.faces.push(
			// Top
			new Face3(0, 2, 3, normalTop, defaultColor),
			new Face3(0, 1, 2, normalTop, defaultColor),

			// Bottom
			new Face3(4, 5, 6, normalBottom, defaultColor),
			new Face3(4, 6, 7, normalBottom, defaultColor),

			// Right
			new Face3(8, 10, 11, normalRight, defaultColor),
			new Face3(8,  9, 10, normalRight, defaultColor),

			// Front
			new Face3(12, 14, 15, normalFront, defaultColor),
			new Face3(12, 13, 14, normalFront, defaultColor),

			// Left
			new Face3(16, 18, 19, normalLeft, defaultColor),
			new Face3(16, 17, 18, normalLeft, defaultColor),

			// Back
			new Face3(20, 22, 23, normalBack, defaultColor),
			new Face3(20, 21, 22, normalBack, defaultColor)
		);

		// Use the Direct3D texture coordinate space where the origin is in the top left corner.
		// If there is a texture with the following quadrants
		// (0,0)                       (1,0)
		//      +----------+----------+
		//      |   BACK   |  FRONT   |
		//      +----------+----------+
		//      |RIGHT/LEFT|TOP/BOTTOM|
		//      +----------+----------+
		// (0,1)                       (1,1)
		// then those quadrants should map to faces as in the comments below.
		var uvs = [
			// Top
			new Vector2(0.5, 0.5),
			new Vector2(1.0, 0.5),
			new Vector2(1.0, 1.0),
			new Vector2(0.5, 1.0),

			// Bottom
			// VB ActiveX incorrectly defines bottom the same as right/left, though the comments say it is the same as top.
			new Vector2(0.5, 0.5),
			new Vector2(1.0, 0.5),
			new Vector2(1.0, 1.0),
			new Vector2(0.5, 1.0),

			// Right
			new Vector2(0.5, 0.5),
			new Vector2(0.5, 1.0),
			new Vector2(0.0, 1.0),
			new Vector2(0.0, 0.5),

			// Front
			new Vector2(0.5, 0.5),
			new Vector2(0.5, 0.0),
			new Vector2(1.0, 0.0),
			new Vector2(1.0, 0.5),

			// Left
			new Vector2(0.5, 0.5),
			new Vector2(0.5, 1.0),
			new Vector2(0.0, 1.0),
			new Vector2(0.0, 0.5),

			// Back
			new Vector2(0.0, 0.5),
			new Vector2(0.0, 0.0),
			new Vector2(0.5, 0.0),
			new Vector2(0.5, 0.5)
		];

		geometry.faceVertexUvs[0].push(
			// Top
			[ uvs[0], uvs[2], uvs[3] ],
			[ uvs[0], uvs[1], uvs[2] ],

			// Bottom
			[ uvs[4], uvs[5], uvs[6] ],
			[ uvs[4], uvs[6], uvs[7] ],

			// Right
			[ uvs[8], uvs[10], uvs[11] ],
			[ uvs[8],  uvs[9], uvs[10] ],

			// Front
			[ uvs[12], uvs[14], uvs[15] ],
			[ uvs[12], uvs[13], uvs[14] ],

			// Left
			[ uvs[16], uvs[18], uvs[19] ],
			[ uvs[16], uvs[17], uvs[18] ],

			// Back
			[ uvs[20], uvs[22], uvs[23] ],
			[ uvs[20], uvs[21], uvs[22] ]
		);

		return geometry;
	};

	/**
	 * Removes descendant nodes that are lights or cameras.
	 *
	 * @param {THREE.Object3D} node The node to process.
	 * @returns {THREE.Object3D} The input <code>node</code> parameter to allow method chaining.
	 * @private
	 */
	var removeLightsAndCameras = function(node) {
		var objectsToRemove = [];
		node.traverse(function(object) {
			if (object.isLight || object.isCamera) {
				objectsToRemove.push(object);
			}
		});
		objectsToRemove.forEach(function(object) {
			while (object && object !== node) { // Do not remove the top level node.
				var parent = object.parent;
				if (object.children.length === 0) {
					parent.remove(object);
				}
				object = parent;
			}
		});
		return node;
	};

	/**
	 * Converts from the left-handed coordinate system to the right-handed one.
	 *
	 * @param {THREE.Object3D} node The node to process.
	 * @returns {THREE.Object3D} The input <code>node</code> parameter to allow method chaining.
	 * @private
	 */
	var convertCoordinateSystem = function(node) {
		if (node.isMesh && node.geometry && node.geometry.isGeometry) {
			node.geometry.vertices.forEach(function(vertex) {
				vertex.x = -vertex.x;
			});
			node.geometry.faces.forEach(function(face) {
				var tmp = face.b;
				face.b = face.c;
				face.c = tmp;
				if (face.normal) {
					face.normal.x = -face.normal.x;
				}
				if (face.vertexNormals && face.vertexNormals.length === 3) {
					tmp = face.vertexNormals[1];
					face.vertexNormals[1] = face.vertexNormals[2];
					face.vertexNormals[2] = tmp;
					face.vertexNormals[0].x = -face.vertexNormals[0].x;
					face.vertexNormals[1].x = -face.vertexNormals[1].x;
					face.vertexNormals[2].x = -face.vertexNormals[2].x;
				}
				if (face.vertexColors && face.vertexColors.length === 3) {
					tmp = face.vertexColors[1];
					face.vertexColors[1] = face.vertexColors[2];
					face.vertexColors[2] = tmp;
				}
			});
			node.geometry.faceVertexUvs.forEach(function(uvs) {
				uvs.forEach(function(face) {
					var tmp = face[1];
					face[1] = face[2];
					face[2] = tmp;
				});
			});
		}
		return node;
	};

	/**
	 * Normalize the object.
	 *
	 * The node is centered and then scaled uniformly so that vertex coordinates fit into the 3D box defined as range [(-1, -1, -1), (+1, +1, +1)].
	 *
	 * @param {THREE.Object3D} node The node to normalize.
	 * @returns {THREE.Object3D} The input <code>node</code> parameter to allow method chaining.
	 * @private
	 */
	var normalizeObject3D = function(node) {
		// Re-centre according to the VB ActiveX implementation.

		var center = new Box3().setFromObject(node).getCenter();
		node.applyMatrix(new Matrix4().makeTranslation(-center.x, -center.y, +center.z)); // NB: sic! the Z move is positive.

		// Normalize coordinates (not the size!) according to the VB ActiveX implementation.

		var box = new Box3().setFromObject(node);
		var scaleFactor = Math.max(
			Math.abs(box.min.x),
			Math.abs(box.min.y),
			Math.abs(box.min.z),
			Math.abs(box.max.x),
			Math.abs(box.max.y),
			Math.abs(box.max.z)
		);
		if (scaleFactor) {
			scaleFactor = 1 / scaleFactor;
		}
		node.applyMatrix(new Matrix4().makeScale(scaleFactor, scaleFactor, scaleFactor));

		box = new Box3().setFromObject(node);
		center = box.getCenter();
		node.translateZ(center.z - (box.max.z < 0 ? box.max.z : box.min.z));

		return node;
	};

	/**
	 * Loads a Collada model from an XML string.
	 *
	 * @param {THREE.Object3D}            parentNode      The parent node where to add the loaded content.
	 * @param {sap.ui.vk.ContentResource} contentResource The content resource to load.
	 * @returns {Promise} The Promise object that resolves when the Collada model has been loaded.
	 * @private
	 */
	var loadCollada = function(parentNode, contentResource) {
		return new Promise(function(resolve, reject) {
			var loader = new THREE.ColladaLoader();
			loader.parse(contentResource.getSource().content,
				function(collada) {
					removeLightsAndCameras(collada.scene);
					collada.scene.traverse(convertCoordinateSystem);
					collada.scene.applyMatrix(new Matrix4().makeScale(1, -1, -1));
					var source = contentResource.getSource();
					collada.scene.traverse(function(node) {
						if (node.isMesh) {
							node.material.color = source.color;
							node.material.opacity = source.opacity;
						}
					});
					parentNode.add(normalizeObject3D(collada.scene));
					resolve({
						node: parentNode,
						contentResource: contentResource
					});
				}
			);
		});
	};

	/**
	 * Loads a THREE.Object3D object.
	 *
	 * @param {THREE.Object3D}            parentNode      The parent node where to add the loaded content.
	 * @param {sap.ui.vk.ContentResource} contentResource The content resource to load.
	 * @returns {Promise} The Promise object that resolves when the object has been loaded.
	 * @private
	 */
	var loadThreeJSObject = function(parentNode, contentResource) {
		var node  = contentResource.getSource();

		parentNode.add(normalizeObject3D(convertCoordinateSystem(node)).rotateX(degToRad(180)));
		return Promise.resolve({
			node: parentNode,
			contentResource: contentResource
		});
	};

	var colladaResolver = {
		dimension: 3,
		contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
		settings: { loader: loadCollada }
	};

	var threeJSObjectResolver = {
		dimension: 3,
		contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
		settings: { loader: loadThreeJSObject }
	};

	ContentConnector.addContentManagerResolver(function(contentResource) {
		return Promise.resolve(contentResource.getSource() instanceof THREE.Object3D ? threeJSObjectResolver : colladaResolver);
	});

	return Adapter3D;
});