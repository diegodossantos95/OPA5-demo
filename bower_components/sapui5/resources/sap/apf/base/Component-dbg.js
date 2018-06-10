/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2015 SAP SE. All rights reserved
 */
/*global jQuery, sap */
(function() {
	'use strict';
	jQuery.sap.declare("sap.apf.base.Component");
	jQuery.sap.require("sap.ui.core.UIComponent");
	jQuery.sap.require("sap.apf.api");
	/**
	 * @public
	 * @class Base Component for all APF based applications.
	 * @name sap.apf.base.Component
	 * @extends sap.ui.core.UIComponent
	 * @since SAP UI5 1.30.0.
	 */
	sap.ui.core.UIComponent.extend("sap.apf.base.Component", {
		metadata : {
			"manifest" : "json",
			"library" : "sap.apf",
			"publicMethods" : [ "getApi" ]
		},
		oApi : null,
		init : function() {
			var baseManifest;
			var manifest;
			if (!this.oApi) {
				baseManifest = sap.apf.base.Component.prototype.getMetadata().getManifest();
				manifest = jQuery.extend({}, true, this.getMetadata().getManifest());
				this.oApi = new sap.apf.Api(this, undefined, {
					manifest : manifest,
					baseManifest : baseManifest
				});
				if (this.oApi.startupSucceeded()) {
					sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
				}
			} else {
				return;
			}

		},
		/**
		 * @public
		 * @description Creates the content of the component. A component that extends this component shall call this method.
		 * @function
		 * @name sap.apf.base.Component.prototype.createContent
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent : function() {
			sap.ui.core.UIComponent.prototype.createContent.apply(this, arguments);
			return this.oApi.startApf();
		},
		/**
		 * @public
		 * @description Cleanup the Component instance. The component that extends this component should call this method.
		 * @function
		 * @name sap.apf.base.Component.prototype.exit
		 */
		exit : function() {
			this.oApi.destroy();
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.base.Component#getApi
		 * @description Returns the instance of the APF API.
		 * @returns {sap.apf.Api}
		 */
		getApi : function() {
			return this.oApi;
		},
		/**
		* @public
		* @experimental NOT FOR PRODUCTION USE
		* @since 1.38.4
		* @function
		* @name sap.apf.base.Component#getInjections
		* @description This function is optional and can be implemented in any extending Component.js.
		* Its return value is an object containing injected constructors, functions, references and exits.
		* The injected sub entities are all optional and will be used by the APF logic when defined.
		* Exits are used to change predefined enhancement points.
		* Instances, functions and constructors are used for test isolation.
		* Probe is used in tests to access internal APF references.
		* @returns {object} Object containing optional injects and exits
		* @returns {object.exits} Exit functions
		* @returns {object.exits.binding.afterGetFilter} Exit function to be used for altering the filter returned by binding.getFilter()
		* @returns {object.exits.path.beforeAddingToCumulatedFilter} Exit function to be used for altering the filter of a step during path update before adding to cumulative filter
		* @returns {object.instances} Instances to be injected for testing purposes
		* @returns {object.functions} Functions to be injected for testing purposes
		* @returns {object.constructors} Constructors to be injected for testing purposes
		* @returns {object.probe} Probe constructor to get internal APF references for testing purposes
		*/
		getInjections : function() {
			return {
				exits: {},
				instances: {},
				functions: {},
				constructors: {},
				probe: function(){}
			};
		}
	});
}());