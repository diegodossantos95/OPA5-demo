jQuery.sap.declare('sap.apf.utils.sbAdapter');
jQuery.sap.declare('sap.apf.utils.sbAdapter.getConfigurations');
jQuery.sap.require('sap.ui.fl.LrepConnector');
jQuery.sap.require("sap.ui.thirdparty.datajs");
(function() {
	'use strict';
	var suiteOnHanaIntentRT = {
			semanticObject: "FioriApplication",
			action: "executeAPFConfiguration"
	};
	var suiteOnHanaIntentDT = {
			semanticObject: "FioriApplication",
			action: "editAPFConfiguration"
	};
	var s4IntentRT = {
			semanticObject: "FioriApplication",
			action: "executeAPFConfigurationS4HANA"
	};
	
	var s4IntentDT = {
			semanticObject: "FioriApplication",
			action: "editAPFConfigurationS4HANA"
	};
	var hanaRequestUri = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata/AnalyticalConfigurationQueryResults";

	sap.apf.utils.sbAdapter._hanaConfigurations = undefined;
	sap.apf.utils.sbAdapter._lrepConfigurations = undefined;
	/**
	 * @public
	 * @name sap.apf.utils.sbAdapter.getConfigurations
	 * @description An APF adapter for SmartBusiness. Can be called to get all configurations that are stored in either LREP(S4HANA)
	 * or in HANA tables (Suite on HANA)
	 * @param {String} semanticObject Custom semantic object. Will be returned as runtimeIntent if both parameters are filled
	 * @param {String} action Custom action. Will be returned as runtimeIntent if both parameters are filled
	 * @returns {jQuery.Deferred} Returns a promise that will be resolved with an Array of configurations 
	 * Sample Configuration:
	 * {
	 * 		title: "Configuration Title"
	 * 		id: "2135213123241"
	 * 		runtimeIntent: {
	 * 			semanticObject: "FioriApplication",
	 * 			action: "executeAPFConfiguration"
	 * 		},
	 * 		modelerIntent: {
	 * 			semanticObject: "FioriApplication",
	 * 			action: "editAPFConfiguration"
	 * 		}
	 * }
	 */
	sap.apf.utils.sbAdapter.getConfigurations = function (semanticObject, action) {
		var deferred = jQuery.Deferred();
		var configurations = [];
		jQuery.when(readLrepConfigurations(), readHanaConfigurations()).then(function(lrepConfigurations, hanaConfigurations){
			configurations = hanaConfigurations.concat(lrepConfigurations);
			var customIntent = getCustomIntent(semanticObject, action);
			if (customIntent && !intentsAreEqual(customIntent, suiteOnHanaIntentRT) && !intentsAreEqual(customIntent, s4IntentRT)) {
				configurations.forEach(function(configuration){
					configuration.runtimeIntent = customIntent;
				});
			}
			deferred.resolve(configurations);
		});
		return deferred.promise(); 
	};
	/**
	 * @public
	 * @name sap.apf.utils.sbAdapter.getConfigurationNameById
	 * @description An APF adapter for SmartBusiness. Can be called to get a configurationName with a given configurationId
	 * If the configurationId contains a "." then the Lrep is read, otherwise the HANA tables will be queried.
	 * @param {String} configurationId
	 * @returns {jQuery.Deferred} Returns a promise that will be resolved with a String
	 */
	sap.apf.utils.sbAdapter.getConfigurationNameById = function (configurationId) {
		var deferred = jQuery.Deferred();
		if(!configurationId){
			return deferred.resolve("");
		}
		if(configurationId.indexOf(".") > -1){
			readLrepConfigurations().done(getConfigurationNameById);
		} else {
			readHanaConfigurations().done(getConfigurationNameById);
		}
		return deferred.promise();

		function getConfigurationNameById (configurations){
			configurations.forEach(function(configuration){
				if(configuration.id === configurationId){
					deferred.resolve(configuration.title);
				}
			});
			if (deferred.state !== "resolved"){
				deferred.resolve("");
			}
		}
	};
	function readHanaConfigurations(){
		var deferred = jQuery.Deferred();
		if(!sap.apf.utils.sbAdapter._hanaConfigurations){
			var request = {
					requestUri : hanaRequestUri + "?$select=AnalyticalConfiguration,AnalyticalConfigurationName,Application",
					async : true,
					method : "GET"
			};
			OData.request(request, success, fail);
		} else {
			deferred.resolve(jQuery.extend(true, [], sap.apf.utils.sbAdapter._hanaConfigurations));
		}
		return deferred.promise();

		function success (response){
			var hanaConfigurations = [];
			response.results.forEach(function(configuration){
				hanaConfigurations.push({
					title: configuration.AnalyticalConfigurationName,
					id: configuration.AnalyticalConfiguration,
					runtimeIntent: suiteOnHanaIntentRT,
					modelerIntent: suiteOnHanaIntentDT,
					configurationId: configuration.AnalyticalConfiguration,
					applicationId: configuration.Application
				});
			});
			sap.apf.utils.sbAdapter._hanaConfigurations = jQuery.extend(true, [], hanaConfigurations);
			deferred.resolve(hanaConfigurations);
		}
		function fail (){
			sap.apf.utils.sbAdapter._hanaConfigurations = [];
			deferred.resolve([]);
		}
	}
	function readLrepConfigurations(){
		var deferred = jQuery.Deferred();
		if(!sap.apf.utils.sbAdapter._lrepConfigurations){
			sendLrepRequest().then(function(lrepResponse){
				var lrepConfigurations = [];
				lrepResponse.response.forEach(function(data){
					var applicationId;
					var configurationId;
					if (data.fileType && data.fileType === "apfconfiguration") {
						applicationId = getApplicationId(data);
						configurationId = data.name;
						lrepConfigurations.push({
							title: getElementValueFromMetadata(data, 'apfdt-configname'),
							id: applicationId + "." + configurationId,
							runtimeIntent: s4IntentRT,
							modelerIntent: s4IntentDT,
							configurationId: configurationId,
							applicationId: applicationId
						});
					}
				});
				sap.apf.utils.sbAdapter._lrepConfigurations = jQuery.extend(true, [], lrepConfigurations);
				deferred.resolve(lrepConfigurations);
			}, function (){
				deferred.resolve([]);
				sap.apf.utils.sbAdapter._lrepConfigurations = [];
			});
		} else {
			deferred.resolve(jQuery.extend(true, [], sap.apf.utils.sbAdapter._lrepConfigurations));
		}
		return deferred.promise();
	}
	function sendLrepRequest() {
		var connector = sap.ui.fl.LrepConnector.createConnector();
		var mOptions = {
				async : true,
				contentType : 'application/json'
		};
		var aParams = [];
		aParams.push({ name : "deep-read", value : true});
		aParams.push({ name : "metadata", value : true});
		aParams.push({ name : "layer", value : "CUSTOMER"});
		var sRequestPath = "/sap/bc/lrep/content/sap/apf/dt/";
		sRequestPath += connector._buildParams(aParams);
		return connector.send(sRequestPath, 'GET', {}, mOptions);
	}
	function getApplicationId(data) {
		var namespace = data.ns.split('/');
		return namespace[namespace.length - 2];
	}
	function getElementValueFromMetadata(data, elementName) {
		var value;
		data.metadata.forEach(function(element) {
			if (element.name === elementName) {
				value = element.value;
			}
		});
		return value;
	}
	function intentsAreEqual(intent1, intent2){
		if(intent1.semanticObject === intent2.semanticObject && intent1.action === intent2.action){
			return true;
		}
		return false;
	}
	function getCustomIntent (semanticObject, action) {
		if (semanticObject && action) {
			return {
				semanticObject: semanticObject,
				action: action
			};
		}
	}
}());