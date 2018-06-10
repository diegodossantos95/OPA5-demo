/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function() {
	'use strict';
	jQuery.sap.declare('sap.apf.utils.startParameter');
	/**
	 * @private 
	 * @class Provides convenience functions to receive parameter set through component`s startup parameter or basic URL parameter.
	 * 		  When both parameter are set then the component`s startup parameter wins.
	 * @param {object} component 
	 * @param {object} manifests with manifest of component and base component
	 */
	sap.apf.utils.StartParameter = function(component, manifests) {
		var analyticalConfigurationId = null;
		var stepId = null;
		var representationId = null;
		var appConfigPath;
		var evaluationId;
		var startParameters; 
		var sapClient;
		var sapSystem;
		
		if (component && component.getComponentData && component.getComponentData() && component.getComponentData().startupParameters) {
			startParameters = component.getComponentData().startupParameters;
			if (startParameters['sap-apf-configuration-id']) {
				analyticalConfigurationId = startParameters['sap-apf-configuration-id'][0];
			}
			if (startParameters['sap-apf-step-id']) {
				stepId = startParameters['sap-apf-step-id'][0];
			}
			if (startParameters['sap-apf-representation-id']) {
				representationId = startParameters['sap-apf-representation-id'][0];
			}
			if (startParameters['sap-apf-app-config-path']) {
				appConfigPath = startParameters['sap-apf-app-config-path'][0];
			}
			if (startParameters['evaluationId']) {
				evaluationId = startParameters['evaluationId'][0];
			}
			if (startParameters['sap-client']) {
				sapClient = startParameters['sap-client'][0];
			}
			if (startParameters['sap-system']) {
				sapSystem = startParameters['sap-system'][0];
			}
			
		}
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.StartParameter#getSapSystem
		 * @description Returns the sap-system parameter, if set in url, otherwise undefined
		 * @returns {string|undefined}
		 */
		this.getSapSystem = function() {
			return sapSystem;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.StartParameter#getSteps
		 * @description Returns analytical configuration ID. In case of lrep, it also returns applicationId
		 * @returns {undefined|object} with format { configurationId : "xxx", applicationId : "yyy" }
		 */
		this.getAnalyticalConfigurationId = function() {
			var parameters, config;
			
			if (!analyticalConfigurationId) {
				analyticalConfigurationId = jQuery.sap.getUriParameters().get('sap-apf-configuration-id');
			}
			if (analyticalConfigurationId) {
				config = {};
				parameters = analyticalConfigurationId.split(".");
				
				if (parameters.length === 2) {
					config.applicationId = parameters[0];
					config.configurationId = parameters[1];
				} else {
					config.configurationId = analyticalConfigurationId;
				} 
			}
			
			return config;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.StartParameter#getAnalyticalConfigurationId
		 * @description Returns step IDs and representation IDs.
		 * @returns {Array} steps Step contains step ID and optional representation ID
		 */
		this.getSteps = function() {
			if (!stepId) {
				stepId = jQuery.sap.getUriParameters().get('sap-apf-step-id');
			}
			if (!representationId) {
				representationId = jQuery.sap.getUriParameters().get('sap-apf-representation-id');
			}
			if (!stepId) {
				return null;
			}
				return [ {
					stepId : stepId,
					representationId : representationId
				} ];
			
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.StartParameter#getXappStateId
		 * @description Returns sap-xapp-state ID from URL hash
		 * @returns {string} sap-xapp-state ID
		 */
		this.getXappStateId = function() {
			var xappStateKeyMatcher = /(?:sap-xapp-state=)([^&=]+)/;
			var xappMatch = xappStateKeyMatcher.exec(window.location.hash);
			if (xappMatch) {
				return xappMatch[1];
			}
			return null;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.StartParameter#getApplicationConfigurationPath
		 * @description Returns application configuration path from URL hash. Makes no sense when using a manifest
		 * @returns {string} appConfigPath
		 */
		this.getApplicationConfigurationPath = function() {
			return appConfigPath;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.StartParameter#getEvaluationId
		 * @description Returns smart business evaluation id
		 * @returns {string} evaluationId
		 */
		this.getEvaluationId = function() {
			return evaluationId;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.StartParameter#isLrepActive
		 * @description Evaluates URL and manifest, whether the lrep is active. URL settings have precedence over
		 * manifest
		 * @returns {boolean} 
		 */
		this.isLrepActive = function() {

			if (manifests && manifests.manifest && manifests.manifest["sap.apf"] && manifests.manifest["sap.apf"].activateLrep) { 
				return manifests.manifest["sap.apf"].activateLrep;
			}
		    return false;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.StartParameter#getSapClient
		 * @description Evaluates URL whether sap client is set
		 * @returns {string} sapClient
		 */
		this.getSapClient = function() {
			return sapClient;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.StartParameter#isFilterReductionActive
		 * @description Evaluates URL and manifest, whether the filter reduction is active. URL settings have precedence over
		 * manifest. Filter reduction is inactive per default.
		 * @returns {boolean} 
		 */
		this.isFilterReductionActive = function() {
			if (startParameters && startParameters['sap-apf-filter-reduction']) {
				return startParameters['sap-apf-filter-reduction'][0];
			}
			if (manifests && manifests.manifest && manifests.manifest["sap.apf"] && manifests.manifest["sap.apf"].activateFilterReduction) {
				 
				return manifests.manifest["sap.apf"].activateFilterReduction;
			}	
			return false;
		};
		/**
		 * @function
		 * @name sap.apf.utils.StartParameter#getParameter
		 * @description returns the value of a parameter by name, example SAPClient. Parameter may occur in front of or after the hash tag.
		 * @param {string} parameterName 
		 * @returns {object} parameterValue
		 */
		this.getParameter = function(parameterName) {
			if (startParameters && startParameters[parameterName]) {
				return startParameters[parameterName][0];
			}
			return jQuery.sap.getUriParameters().get(parameterName);
		};
	};
}());