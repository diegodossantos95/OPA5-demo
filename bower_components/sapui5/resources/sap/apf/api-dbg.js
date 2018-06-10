/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap */
(function() {
	'use strict';
	jQuery.sap.declare('sap.apf.api');
	jQuery.sap.require('sap.apf.core.messageHandler');
	jQuery.sap.require('sap.apf.core.instance');
	jQuery.sap.require('sap.apf.utils.filter');
	jQuery.sap.require('sap.apf.utils.externalContext');
	jQuery.sap.require('sap.apf.utils.startFilterHandler');
	jQuery.sap.require('sap.apf.utils.startFilter');
	jQuery.sap.require('sap.apf.utils.filterIdHandler');
	jQuery.sap.require('sap.apf.utils.serializationMediator');
	jQuery.sap.require('sap.apf.utils.startParameter');
	jQuery.sap.require('sap.apf.utils.navigationHandler');
	jQuery.sap.require('sap.apf.ui.instance');
	jQuery.sap.require('sap.apf.ui.representations.representationInterface');
	jQuery.sap.require("sap.apf.ui.representations.lineChart");
	jQuery.sap.require("sap.apf.ui.representations.columnChart");
	jQuery.sap.require("sap.apf.ui.representations.scatterPlotChart");
	jQuery.sap.require("sap.apf.ui.representations.table");
	jQuery.sap.require("sap.apf.ui.representations.stackedColumnChart");
	jQuery.sap.require("sap.apf.ui.representations.pieChart");
	jQuery.sap.require("sap.apf.ui.representations.percentageStackedColumnChart");
	jQuery.sap.require('sap.apf.ui.representations.bubbleChart');
	jQuery.sap.require("sap.apf.ui.representations.treeTable");
	jQuery.sap.require('sap.apf.messageCallbackForStartup');
	jQuery.sap.require("sap.ui.thirdparty.datajs");
	/**
	 * @public
	 * @class Official API for Analysis Path Framework (APF)<br>
	 * <p>
	 * The APF API provides a consuming application access to the functionality of the APF. It is assumed that the consuming application extends type {@link sap.apf.base.Component}.
	 * The API reference is returned by method {@link sap.apf.base.Component#getApi}.
	 * <br>
	 * Objects and types returned by methods of APF API or passed in parameters of APF API method also belong to the API.
	 * These objects and types are documented in their respective sections of this documentation.
	 * All methods, objects or types that are not explicitly documented as public are strictly internal and may be changed without prior notice.
	 * This also includes all methods, objects or types being classified as experimental.<br>
	 * Furthermore there is no need to instantiate required entities directly by applying the JavaScript 'new'-operator on their respective constructors.
	 * Instead they should be created by consumers using a create method available on API-level, such as e.g. {@link sap.apf.Api#createMessageObject} for {@link sap.apf.core.MessageObject} or {@link sap.apf.Api#createFilter} for {@link sap.apf.utils.Filter}.
	 * </p>
	 * @name sap.apf.Api
	 * @param {sap.apf.Component|sap.apf.base.Component} oComponent - A reference to the calling Component.js. The reference provides access to parameters and context.
	 * @param {Object} [inject] - injected constructors and functions for testing only.
	 * @param {Object} [manifests] - manifests of the component and the base component itself
	 */
	sap.apf.Api = function(oComponent, inject, manifests) {
		var oMessageHandler;
		var oCoreApi;
		var oStartParameter;
		var oNavigationHandler;
		var oStartFilterHandler;
		var oExternalContext;
		var oFilterIdHandler;
		var injectStartFilterHandler;
		var injectExternalContext;
		var injectFilterIdHandler;
		var oSerializationMediator;
		var oUiApi;
		var messageCallbackForStartup;
		var bStartupSucceeded = true;
		var onBeforeApfStartupDeferred = jQuery.Deferred();
		var corePromise = new jQuery.Deferred();
		var application;
		/**
		 * @public
		 * @description Contains 'api'
		 * @returns {string}
		 */
		this.type = 'api';
		/**
		 * @public
		 * @deprecated since Version 1.23.1. Use sap.apf.core.constants instead.
		 * @name sap.apf.constants
		 * @description Constants to be used by APF consumers.
		 * @type {Object}
		 */
		this.constants = {};
		/**
		 * @public
		 * @deprecated since Version 1.23.1. Use sap.apf.core.constants instead.
		 * @name sap.apf.constants.eventTypes
		 * @description Constants for events used by APF consumers.
		 */
		this.constants.eventTypes = sap.apf.core.constants.eventTypes;

		/**
		 * @private
		 * @description This method will be automatically called, when the component is destroyed. 
		 * Never call this function directly
		 * @function
		 */
		this.destroy = function() {
			oMessageHandler.activateOnErrorHandling(false);
			oMessageHandler.setMessageCallback(undefined);
			oMessageHandler.setLifeTimePhaseShutdown();
			if (oUiApi && oUiApi.destroy) { //BLR Team
				oUiApi.destroy();
			}
			if (oCoreApi) {
				oCoreApi.destroy();
			}
			oUiApi = undefined;
			oCoreApi = undefined;
			oMessageHandler = undefined;
			oStartParameter = undefined;
			oNavigationHandler = undefined;
		};
		/**
		 * @public
		 * @experimental NOT FOR PRODUCTION USE
		 * @function
		 * @name sap.apf.Api#activateOnErrorHandling
		 * @description The handling of the window.onerror by the message handler is
		 *              either switched on or off. Per default the handling is deactivated.
		 * @param {boolean} bHandling Boolean true switches the winow.onerror handling on
		 * @returns undefined
		 */
		this.activateOnErrorHandling = function(bHandling) {
			return oCoreApi.activateOnErrorHandling(bHandling);
		};
		// --------------- Begin of DEPRECATED -------------------------------- */
		/**
		 * @private
		 * @function
		 * @name sap.apf.Api#getStartParameterFacade
		 * @description Returns start parameter which are passed by component or url parameter
		 * @returns {sap.apf.utils.startParameter}
		 */
		this.getStartParameterFacade = function() {
			return oCoreApi.getStartParameterFacade();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#getLogMessages
		 * @description Returns a copy of APF log messages with severity 'fatal'.
		 * @returns {string[]} Array containing the message log. The message put last is at first array position.
		 */
		this.getLogMessages = function() {
			return oCoreApi.getLogMessages();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#createStep
		 * @description Creates a step object from the configuration object and adds it to the path.
		 * @param {string} sStepId Step ID as defined in the analytical content configuration.
		 * @param {function} fnStepProcessedCallback Callback for update of steps. Same semantics as in {@link sap.apf.Api#updatePath}
		 * @param {string} [sRepresentationId] Parameter that allows definition of the representation id that shall
		 * initially be selected. If omitted, the first configured representation will be selected.
		 * @return {sap.apf.core.Step}
		 */
		this.createStep = function(sStepId, fnStepProcessedCallback, sRepresentationId) {
			return oCoreApi.createStep(sStepId, fnStepProcessedCallback, sRepresentationId);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#getActiveStep
		 * @description Returns active step, currently selected step, of analysis path.
		 * @returns {sap.apf.core.Step}
		 */
		this.getActiveStep = function() {
			return oCoreApi.getActiveStep();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#getCategories
		 * @description Returns category objects of all loaded category configuration objects.
		 * @returns {object[]} Object with configuration information about a category.
		 */
		this.getCategories = function() {
			return oCoreApi.getCategories();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#getSteps
		 * @description Gets the ordered sequence of all steps contained in the analysis path.
		 * Each step is a reference to the object in the path.
		 * Each step shall always be identified by the reference to its step object,
		 * e.g. in methods like removeStep, moveStepToPosition, setActiveStep, etc.
		 * @returns {sap.apf.core.Step[]}
		 */
		this.getSteps = function() {
			return oCoreApi.getSteps();
		};
		//noinspection JSValidateJSDoc
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#getStepTemplates
		 * @description Returns step templates based on all steps configured in the analytical content configuration.
		 * A step template contains static information and convenience functions.
		 * @returns {sap.apf.core.configurationFactory.StepTemplate[]}
		 */
		this.getStepTemplates = function() {
			return oCoreApi.getStepTemplates();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#getFacetFilterConfigurations
		 * @description Returns all facet filters configured in the analytical content configuration.
		 * @returns {Array} Contains facet filter configuration objects
		 */
		this.getFacetFilterConfigurations = function() {
			return oCoreApi.getFacetFilterConfigurations();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#getApplicationConfigProperties
		 * @description This function returns those properties of the application configuration file that are not internally used.
		 * @returns {object}
		 */
		this.getApplicationConfigProperties = function() {
			return oCoreApi.getApplicationConfigProperties();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#moveStepToPosition
		 * @description Moves a step in the analysis path to the specified target position.
		 * @param {sap.apf.core.Step} oStep The step object to be moved
		 * @param {number} nPosition The target position. Must be a valid position in the path, between zero and length-1.
		 * @param {function} fnStepProcessedCallback Callback for update of steps. Same semantics as in {@link sap.apf.Api#updatePath}
		 * @returns undefined
		 */
		this.moveStepToPosition = function(oStep, nPosition, fnStepProcessedCallback) {
			return oCoreApi.moveStepToPosition(oStep, nPosition, fnStepProcessedCallback);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#removeStep
		 * @description Removes a step from the analysis path.
		 * @param {sap.apf.core.Step} oStep The step object to be removed. The reference must be an object contained in the path. Otherwise, a message will be put.
		 * @param {function} fnStepProcessedCallback Callback for update of steps. Same semantics as in {@link sap.apf.Api#updatePath}
		 * @returns undefined
		 */
		this.removeStep = function(oStep, fnStepProcessedCallback) {
			return oCoreApi.removeStep(oStep, fnStepProcessedCallback);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#resetPath
		 * @description Removes all steps from the path and removes active step.
		 * @returns undefined
		 */
		this.resetPath = function() {
			return oCoreApi.resetPath();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#setActiveStep
		 * @description Sets handed over step as the active one.
		 * @param {sap.apf.core.Step} oStep The step to be set as active
		 * @returns undefined
		 */
		this.setActiveStep = function(oStep) {
			return oCoreApi.setActiveStep(oStep);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#stepIsActive
		 * @description Checks whether a step is active or not.
		 * @param {sap.apf.core.Step} oStep Step reference
		 * @returns {boolean}
		 */
		this.stepIsActive = function(oStep) {
			return oCoreApi.stepIsActive(oStep);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#updatePath
		 * @description The steps in the path will be updated sequentially - starting with the analysis step at position 0.
		 * Update of a step means sending an OData request and providing the step representation with the request response data.
		 * Actual filter values that need to be sent with the request for a specific step in the update sequence are determined by transforming selections on step
		 * representations of all precedent steps into a cumulative filter expression.
		 * Furthermore the representation of the current step is queried for request options.
		 * <br>
		 * Following aspects of analysis path update are noteworthy:
		 * <ul>
		 * <li>An OData request for update of a specific step will only be sent if at least one of both determined values, cumulative Filter or request options,
		 * has changed between the last update for this step where a request was sent and the current update cycle.</li>
		 * <li>Because transformation of selections on a UI representation into a filter expression is based on current
		 * data, OData requests need to be sent sequentially following the order of steps in the analysis path.
		 * In other words: request for step n can earliest be sent once data for step n-1 has been received and evaluated</li>
		 * </ul>
		 * @param {function} fnStepProcessedCallback Callback function that is called for each step during the update of an analysis path.
		 * First argument of the callback function is the step instance.
		 * The second argument is a boolean indicator, telling whether data for the step has been updated with current request response data or not.
		 * Data of a step will not be updated if there is no difference in OData request attributes between previous and current (potential) update.
		 * @returns undefined
		 */
		this.updatePath = function(fnStepProcessedCallback) {
			return oCoreApi.updatePath(fnStepProcessedCallback);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#getApfLocation
		 * @description Returns the location of the APF library on the server.
		 * @returns {string}
		 */
		this.getApfLocation = function() {
			return oCoreApi.getUriGenerator().getApfLocation();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#readPaths
		 * @description Reads all stored paths of the currently logged on user from server.
		 * Result is returned as a list sorted by last changed date and time of a saved path in descending order.
		 * @param {function} fnCallback The first argument of the callback function is an object with property paths and status.
		 * The second argument is {sap.apf.core.EntityTypeMetadata}.
		 * The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
		 * @returns undefined
		 */
		this.readPaths = function(fnCallback) {
			return oCoreApi.readPaths(fnCallback);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#savePath
		 * @description Saves or modifies the current path on server side under the provided name.
		 * @param {string} [sPathId] If provided the path identified by the ID is modified with the current path.
		 * If omitted the current path will be created as new saved path with a new ID.
		 * @param {string} sName Name of the path to be saved
		 * @param {function} fnCallback The first argument of the callback function is an object with property AnalysisPath and status.
		 * The second argument is {sap.apf.core.EntityTypeMetadata}.
		 * The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
		 * @returns undefined
		 */
		this.savePath = function(sPathId, sName, fnCallback) {
			oCoreApi.savePath(sPathId, sName, fnCallback);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#openPath
		 * @description Opens a path, that has been stored on server side and replaces the current path.
		 * @param {string} sPathId Identifies the analysis path to be opened
		 * @param {function} fnCallback The first argument of the callback function is a JS object with property path, that holds the stored path and status. The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
		 * @param {number} [nActiveStep] Sets the active step.
		 * @returns undefined
		 */
		this.openPath = function(sPathId, fnCallback, nActiveStep) {
			return oCoreApi.openPath(sPathId, fnCallback, nActiveStep);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#deletePath
		 * @description Deletes the path with the given ID on server
		 * @param {string} sPathId Identifies the analysis path to be deleted
		 * @param {function} fnCallback The first argument of the callback function is a JS object, that holds the property status. The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
		 * @returns undefined
		 * @deprecated since Version 1.23.1.
		 */
		this.deletePath = function(sPathId, fnCallback) {
			return oCoreApi.deletePath(sPathId, fnCallback);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1. Remains in api in order to maintain downward compatibility to 3 Wave 5 apps.
		 * @function
		 * @name sap.apf.Api#addFacetFilter
		 * @description Injects the application facet filter component into APF layout placeholder
		 * @returns undefined
		 */
		this.addFacetFilter = function(facetFilter) {
			oUiApi.getLayoutView().getController().addFacetFilter(facetFilter);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#getEventCallback
		 * @param {sap.apf.core.constants.eventTypes} sEventType is the type of event for registering the fnCallback for that particular event type
		 * @returns the callback registered for the particular event type.
		 */
		this.getEventCallback = function(sEventType) {
			return oUiApi.getEventCallback(sEventType);
		};
		// --------------- end of DEPRECATED ------------------------------------------ */
		/**
		 * @public
		 * @function
		 * @name sap.apf.Api#putMessage
		 * @description A message is passed to the APF message handler for further processing.
		 *              All message specific settings (e.g. message code or severity) need to be passed within an APF message object instance.
		 * @param {sap.apf.core.MessageObject} oMessage The message object shall be created by method {@link sap.apf.Api#createMessageObject}.
		 * @returns undefined
		 */
		this.putMessage = function(oMessage) {
			return oCoreApi.putMessage(oMessage);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.Api#createMessageObject
		 * @description Creates a message object, which is the mandatory parameter for API method putMessage.
		 *              So first create the message object and afterwards call putMessage with the message object as argument.
		 * @param {object} oConfig Configuration object for the message object.
		 * @param {string} oConfig.code The message is classified by its code. The code identifies an entry in the message configuration.
		 * @param {array} [oConfig.aParameters] Additional parameters for the message. The parameters are filled into the message text,
		 *                                      when the message will be processed by the text resource handler.
		 * @param {object} [oConfig.oCallingObject] Reference of the calling object. This can be used later to visualize on the user interface, where the message occurred.
		 * @param {string} [oConfig.rawText] Raw text for non translated messages.
		 * @returns {sap.apf.core.MessageObject}
		 */
		this.createMessageObject = function(oConfig) {
			return oCoreApi.createMessageObject(oConfig);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.Api#getTextHtmlEncoded
		 * @description Retrieves a text and applies HTML encoding
		 * @param {object} oLabel || {string} Label object or text key
		 * @param {string[]} aParameters Array with parameters to replace place holders in text.
		 * @returns {string}
		 */
		this.getTextHtmlEncoded = function(oLabel, aParameters) {
			return oCoreApi.getTextHtmlEncoded(oLabel, aParameters);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.Api#getTextNotHtmlEncoded
		 * @description Retrieves a text without application of HTML encoding
		 * @param {object} oLabel || {string} Label object or text key
		 * @param {string[]} aParameters Array with parameters to replace place holders in text.
		 * @returns {string}
		 */
		this.getTextNotHtmlEncoded = function(oLabel, aParameters) {
			return oCoreApi.getTextNotHtmlEncoded(oLabel, aParameters);
		};
		/**
		 * @public
		 * @experimental NOT FOR PRODUCTION USE
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.Api#loadApplicationConfig
		 * @description Loads a new  application configuration in JSON format. When called many times, the file is loaded only the first time.
		 * @param {string} sFilePath The absolute path of an application configuration file. Host and port will be added in front of this path.
		 */
		if (!manifests) {
			this.loadApplicationConfig = function(sFilePath) {
				oCoreApi.loadApplicationConfig(sFilePath);
			};
		} else {
			this.loadApplicationConfig = function(sFilePath) {
			};
		}
		/**
		 * @public
		 * @function
		 * @name sap.apf.Api#createFilter
		 * @description Creates an empty filter object.
		 * Its methods can be used to create a logical filter expression.
		 * @returns {sap.apf.utils.Filter}
		 */
		this.createFilter = function() {
			return oCoreApi.createFilter();
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.Api#addPathFilter
		 * @param {sap.apf.utils.Filter} filter
		 * @description  Adds a filter to the path.
		 * Subsequent changes need to be done by the update method providing the identifier.
		 * Limitation: Only a single filter term or a disjunction/conjunction of single terms over a single property is supported. 
		 * Limitation: Only the operators EQ, LE (less equal than) and GE (greater equal than) are supported.
		 * @returns  {number} ID to be provided for later updates of the same filter via method updatePathFilter.
		 */
		this.addPathFilter = function(filter) {
			return oFilterIdHandler.add(filter);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.Api#updatePathFilter
		 * @param {number|string} id Identifier of the path filter as it was returned by addPathFilter method.
		 * When using an ID of type string the caller must ensure that it is unique.
		 * @param {sap.apf.utils.Filter} filter
		 * @description Updates a filter of the path.
		 * Limitation: Only a single filter term or a disjunction/conjunction of single terms over a single property is supported. 
		 * Limitation: Only the operators EQ, LE (less equal than) and GE (greater equal than) are supported.
		 */
		this.updatePathFilter = function(id, filter) {
			oFilterIdHandler.update(id, filter);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.Api#getPathFilter
		 * @param {number|string} id - Identifier of the path filter fragment as it was returned by addPathFilter method.
		 * @description Gets a path filter fragment for the given identifier by fully replacing the existing one.
		 * @returns {sap.apf.utils.Filter} filter for id
		 */
		this.getPathFilter = function(id) {
			return oFilterIdHandler.get(id);
		};
		/**
		 * @public
		 * @see sap.apf#createReadRequest
		 * @description Creates an object for performing an Odata Request get operation.
		 * @param {String|Object} requestConfiguration - identifies a request configuration, which is contained in the analytical configuration.
		 *                        or the request configuration is directly passed as an object oRequestConfiguration.
		 * @returns {sap.apf.core.ReadRequest}
		 */
		this.createReadRequest = function(requestConfiguration) {
			return oCoreApi.createReadRequest(requestConfiguration);
		};
		/**
		 * @private
		 * @deprecated
		 * @see sap.apf#createReadRequestByRequiredFilter
		 * @description Creates an object for performing an Odata Request get operation with required filter for parameter entity set key properties & required filters.
		 * @param {String|Object} requestConfiguration - identifies a request configuration, which is contained in the analytical configuration.
		 *                        or the request configuration is directly passed as an object oRequestConfiguration.
		 * @returns {sap.apf.core.ReadRequestByRequiredFilter}
		 */
		this.createReadRequestByRequiredFilter = function(requestConfiguration) {
			return oCoreApi.createReadRequestByRequiredFilter(requestConfiguration);
		};
		/**
		 * @public
		 * @experimental NOT FOR PRODUCTION USE
		 * @function
		 * @name sap.apf.Api#selectionChanged
		 * @description Calls the sap.apf.core.instance#updatePath (also see {@link sap.apf.core.Path#update}) with proper callback for UI.
		 *                It also refreshes the steps either from the active step or
		 *                all the steps depending on the boolean value passed.
		 * @param {boolean} bRefreshAllSteps
		 */
		this.selectionChanged = function(bRefreshAllSteps) {
			oUiApi.selectionChanged(bRefreshAllSteps);
		};
		/**
		 * @private
		 * @experimental NOT FOR PRODUCTION USE
		 * @function
		 * @name sap.apf.Api#createApplicationLayout
		 * @description Creates the APF application layout.
		 * @returns {sap.m.App} - the root element of a UI5 mobile application
		 */
		this.createApplicationLayout = function() {
			// Create and return APF UI Content
			if (!application){
				application = new sap.m.App().addStyleClass("sapApf");
			}
			
			return application;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.Api#startApf
		 * @description Triggers the start-up of APF content creation and calls back APFContentCreated
		 * @returns {sap.m.App} - the APF content
		 */
		this.startApf = function() {
	
			var deferredMode;
			var that = this;
			var app = this.createApplicationLayout();
			corePromise.done(function(){
				try {
					// Notify applications before APF start-up
					
					if (this.fnBeforeApfStartupCallback && typeof this.fnBeforeApfStartupCallback === "function") {
						this.fnBeforeApfStartupCallback.apply(oComponent, [ this ]);
					}
					onBeforeApfStartupDeferred.resolve();
					// Create APF UI Content
					oUiApi.createApplicationLayout(app);
					deferredMode = oNavigationHandler.checkMode();
					// Handle APF Start-up based on mode
					var promiseStartup = oUiApi.handleStartup(deferredMode);
					// Notify applications after APF start-up
					promiseStartup.done(function() {
						
						if (that.fnAfterApfStartupCallback && typeof that.fnAfterApfStartupCallback === "function") {
							that.fnAfterApfStartupCallback.apply(oComponent, [ that ]);
						}
						oMessageHandler.setLifeTimePhaseRunning();	
					});
					} catch(e) {
						bStartupSucceeded = false;
						
					}
			}.bind(this));
			// Return APF UI Content
			return app;
		};
		/**
		 * @public
		 * @experimental NOT FOR PRODUCTION USE
		 * @deprecated since Version 1.23.1. Remains in api in order to maintain downward compatibility to 3 Wave 5 apps.
		 * @function
		 * @name sap.apf.Api#addMasterFooterContent
		 * @description Adds an element to the footer area.
		 * @param {object} oControl any valid UI5 control.
		 */
		this.addMasterFooterContent = function(oControl) {
			return oUiApi.addMasterFooterContentRight(oControl);
		};
		/**
		 * @public
		 * @experimental NOT FOR PRODUCTION USE
		 * @function
		 * @name sap.apf.Api#setEventCallback
		 * @description Register the function callback to be executed on the given event type.
		 *                fnCallback will be executed under a context and will be passed with arguments depending on the event type.
		 * @param {sap.apf.core.constants.eventTypes} sEventType is the type of event for registering the fnCallback for that particular event type
		 *                    printTriggered - Registers a callback for initial page print, this callback returns
		 *                                     2d array
		 *                    contextChanged : Registers a callback for context change, which will set the context of the application
		 * @param {function} fnCallback that will be executed depending on the event type.
		 * @returns {boolean} true or false based on success or failure of registering the listener.
		 */

		this.setEventCallback = function(sEventType, fnCallback) {
			switch (sEventType) {
				case sap.apf.core.constants.eventTypes.contextChanged:
					oUiApi.setEventCallback(sEventType, fnCallback);
					return true;
				case sap.apf.core.constants.eventTypes.printTriggered:
					oUiApi.setEventCallback(sEventType, fnCallback);
					return true;
				case sap.apf.core.constants.eventTypes.format:
					this.customFormat(fnCallback);
					return true;
				default:
					return false;
			}
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.Api#customFormat
		 * @description helps to call customer defined custom formatter function(fnCallback).
		 * @param {function} fnCallback custom format function need to be called.
		 */
		this.customFormat = function(fnCallback) {
			oUiApi.setCustomFormatExit(fnCallback);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.Api#setCallbackBeforeApfStartup
		 * @description Register the function callback to be executed before APF start-up.
		 * 				Callback is called with APF API instance as parameter and 'this' set to the Component instance.
		 * @param {function} fnCallback that will be executed before APF start-up.
		 */
		this.setCallbackBeforeApfStartup = function(fnCallback) {
			this.fnBeforeApfStartupCallback = fnCallback;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.Api#setCallbackAfterApfStartup
		 * @description Register the function callback to be executed after APF start-up and content has been created.
		 * 				Callback is called with APF API instance as parameter and 'this' set to the Component instance.
		 * @param {function} fnCallback that will be executed after APF start-up and content has been created.
		 */
		this.setCallbackAfterApfStartup = function(fnCallback) {
			this.fnAfterApfStartupCallback = fnCallback;
		};
		/**
		 * returns the filter terms of an property, that exist in the external context.
		 * @function
		 * @name sap.apf.Api#getPropertyValuesOfExternalContext
		 * @see sap.apf.utils.ExternalContext#getCombinedContext
		 * @param {String} property name of the property or parameter
		 * @returns {jQuery.deferred} promise which resolves with array of low/high value and operator like [ { Low: '2', Option :"EQ" }, { Low : 21', Option : "BT", High : "99" }]
		 */
		this.getPropertyValuesOfExternalContext = function(property) {
			var def = jQuery.Deferred();

			oExternalContext.getCombinedContext().then(function(filter){
				var terms = filter.getFilterTermsForProperty(property);
				var convertedTerms = [];
 
				terms.forEach(function(filterTerm){
					var condition = {
							Low : filterTerm.getValue(),
							Option : filterTerm.getOp(),
							High : filterTerm.getHighValue()
					};
					convertedTerms.push(condition);
				});
				def.resolve(convertedTerms);
			});
			return def.promise();
		};
		/**
		 * @description true, when no fatal error occurred during startup phase. Startup phase includes the initialization + startupApf 
		 * @function
		 * @public
		 * @name sap.apf.Api#startupSucceeded
		 * @returns {boolean} success of startup
		 */
		this.startupSucceeded = function() {
			return bStartupSucceeded;
		};

		if(oComponent && oComponent.getInjections instanceof Function) {
			if(!inject) {
				inject = {};
			}
			jQuery.extend(inject, inject, oComponent.getInjections());
		}

		oStartParameter = new (inject && inject.constructors && inject.constructors.StartParameter || sap.apf.utils.StartParameter)(oComponent, manifests);
		oMessageHandler = new (inject && inject.constructors && inject.constructors.MessageHandler || sap.apf.core.MessageHandler)();
		oMessageHandler.activateOnErrorHandling(true);
		oMessageHandler.setLifeTimePhaseStartup();
		oMessageHandler.loadConfig(sap.apf.core.messageDefinition, true);
		messageCallbackForStartup = inject && inject.functions && inject.functions.messageCallbackForStartup || sap.apf.messageCallbackForStartup;
		oMessageHandler.setMessageCallback(messageCallbackForStartup);

		try {

			oCoreApi = new (inject && inject.constructors && inject.constructors.CoreInstance || sap.apf.core.Instance)({
				functions: {
					getCumulativeFilter : function() {
						return oStartFilterHandler.getCumulativeFilter();
					},
					getCombinedContext : function(){
						return oExternalContext.getCombinedContext();
					},
					ajax : (inject && inject.functions && inject.functions.ajax), 
					serializeApfState : function(isTransient, keepInitialStartFilterValues){
						return oSerializationMediator.serialize(isTransient, keepInitialStartFilterValues);
					}, 
					deserializeApfState : function(serializedApfState){
						return oSerializationMediator.deserialize(serializedApfState);
					},
					odataRequest : (inject && inject.functions && inject.functions.odataRequest),
					getComponentName : function() {
						if (manifests && manifests.manifest && manifests.manifest["sap.app"]) {
							return  manifests.manifest["sap.app"].id;
						}
						return oComponent.getMetadata().getComponentName();
					}
				},
				instances: {
					messageHandler: oMessageHandler,
					startParameter : oStartParameter,
					datajs : (inject && inject.instances && inject.instances.datajs) || OData
				},
				constructors : {
					Request : (inject && inject.constructors && inject.constructors.Request),
					Metadata : (inject && inject.constructors && inject.constructors.Metadata),
					MetadataFactory : (inject && inject.constructors && inject.constructors.MetadataFactory),
					ResourcePathHandler: (inject && inject.constructors && inject.constructors.ResourcePathHandler),
					TextResourceHandler: (inject && inject.constructors && inject.constructors.TextResourceHandler),
					SessionHandler : (inject && inject.constructors && inject.constructors.SessionHandler),
					Persistence : (inject && inject.constructors && inject.constructors.Persistence)
				},
				manifests: manifests,
				exits: (inject && inject.exits),
				coreProbe : (inject && inject.coreProbe),
				corePromise : corePromise
			});

			injectExternalContext = {
					instances : {
						startParameter : oStartParameter,
						component : oComponent,
						messageHandler : oMessageHandler
					},
					functions : {
						getConfigurationProperties : oCoreApi.getApplicationConfigProperties,
						ajax : oCoreApi.ajax
					}
			};
			oExternalContext = new ((inject && inject.constructors && inject.constructors.ExternalContext) || sap.apf.utils.ExternalContext)(injectExternalContext);
			injectStartFilterHandler = {
					functions : {
						getFacetFilterConfigurations : this.getFacetFilterConfigurations,
						getReducedCombinedContext : oCoreApi.getReducedCombinedContext,
						createRequest : oCoreApi.getFunctionCreateRequest()
					},
					instances : {
						messageHandler : oMessageHandler, 
						onBeforeApfStartupPromise : onBeforeApfStartupDeferred.promise()
					},
					constructors : {
						StartFilter : sap.apf.utils.StartFilter
					}
			};
			oStartFilterHandler = new ((inject && inject.constructors && inject.constructors.StartFilterHandler) || sap.apf.utils.StartFilterHandler)(injectStartFilterHandler);
			injectFilterIdHandler = {
				functions : {
					setRestrictionByProperty : oStartFilterHandler.setRestrictionByProperty,
					getRestrictionByProperty : oStartFilterHandler.getRestrictionByProperty
				},
				instances : {
					messageHandler : oMessageHandler
				}
			};
			oFilterIdHandler = new ((inject && inject.constructors && inject.constructors.FilterIdHandler) || sap.apf.utils.FilterIdHandler)(injectFilterIdHandler);
			oSerializationMediator = new ((inject && inject.constructors && inject.constructors.SerializationMediator) || sap.apf.utils.SerializationMediator)({
				instances : {
					coreApi : oCoreApi,
					filterIdHandler : oFilterIdHandler,
					startFilterHandler : oStartFilterHandler, 
					messageHandler : oMessageHandler
				}
			});
			var injectNavigationHandler = {
				functions : {
					getCumulativeFilterUpToActiveStep : oCoreApi.getCumulativeFilterUpToActiveStep,
					getNavigationTargets : oCoreApi.getNavigationTargets,
					getActiveStep : oCoreApi.getActiveStep,
					createRequest : oCoreApi.getFunctionCreateRequest(),
					getXappStateId : oCoreApi.getStartParameterFacade().getXappStateId,
					isFilterReductionActive : oCoreApi.getStartParameterFacade().isFilterReductionActive,
					getAllParameterEntitySetKeyProperties : oCoreApi.getMetadataFacade().getAllParameterEntitySetKeyProperties
				},
				instances : {
					messageHandler : oMessageHandler,
					component : oComponent,
					serializationMediator : oSerializationMediator
				}
			};
			oNavigationHandler = new ((inject && inject.constructors && inject.constructors.NavigationHandler) || sap.apf.utils.NavigationHandler)(injectNavigationHandler);
			oUiApi = new (inject && inject.constructors && inject.constructors.UiInstance || sap.apf.ui.Instance)({
				oCoreApi : oCoreApi,
				oFilterIdHandler : oFilterIdHandler,
				oSerializationMediator : oSerializationMediator,
				oNavigationHandler : oNavigationHandler,
				oComponent : oComponent,
				oStartParameter : oStartParameter,
				oStartFilterHandler : oStartFilterHandler,
				exits : inject && inject.exits || {}
			});
		} catch(error) {
			bStartupSucceeded = false;
			this.startApf = function() {
				return new sap.m.Text({ text : "" });
			};
			this.loadApplicationConfig = function() {
				return "";
			};
			jQuery.sap.log.error("Caught exception during creation of APF API");
		}
		/**
		 * @private
		 * @experimental NOT FOR PRODUCTION USE
		 * @function
		 * @name sap.apf.core.Instance#createRepresentation
		 * @description Method to be used APF internally by the binding class to create instances from representation constructors.
		 * Reason for declaring the method here, in the scope of APF API, and assigning it to the sap.apf.core-instance, is that the method requires
		 * the core and the UI instance to be passed to the representation constructors.
		 * @param {string} sRepresentationConstructorPath - A string maintained in the analytical configuration that contains the module path of the respective representation.
		 * @param {object} oConfig - The representation specific configuration object as maintained in the analytical configuration.
		 * @returns {sap.apf.ui.representations.representationInterface}
		 */
		if (oCoreApi) {
			oCoreApi.createRepresentation = function(sRepresentationConstructorPath, oConfig) {
				var interfaceProxy = new sap.apf.ui.representations.RepresentationInterfaceProxy(oCoreApi, oUiApi);
				var Representation = sap.apf.utils.extractFunctionFromModulePathString(sRepresentationConstructorPath);
				return new Representation(interfaceProxy, oConfig);
			};
		}
		/**
		 * Sends all internal references to a probe object injected.
		 */
		if (inject && inject.probe && typeof inject.probe === 'function') {
			inject.probe({
				apfApi: this,
				coreApi : oCoreApi,
				component : oComponent,
				uiApi : oUiApi,
				messageHandler : oMessageHandler,
				serializationMediator : oSerializationMediator,
				navigationHandler : oNavigationHandler,
				startParameter : oStartParameter,
				injectedFunctionsNavigationHandler : injectNavigationHandler && injectNavigationHandler.functions,
				startFilterHandler : oStartFilterHandler,
				externalContext : oExternalContext,
				filterIdHandler : oFilterIdHandler, 
				corePromise : corePromise
			});
		}
	};
}());
