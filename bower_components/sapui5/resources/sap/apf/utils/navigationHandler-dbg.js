/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap, jQuery, window*/
(function() {
	'use strict';
	jQuery.sap.declare("sap.apf.utils.navigationHandler");
	jQuery.sap.require("sap.apf.core.utils.filterSimplify");
	jQuery.sap.require("sap.apf.utils.utils");
	jQuery.sap.require("sap.ui.core.routing.HashChanger");
	/**
	 * @class This class manages the navigation to a target and the navigation from another target into this class;
	 * @param {Object} oInject Injection of required APF objects
	 * @param {Object} oInject.instance Injected instances
	 * @param {sap.apf.core.MessageHandler} oInject.instances.messageHandler
	 * @param {sap.apf.Component} oInject.instances.component
	 * @param {Object} oInject.functions Injected functions
	 * @param {Function} oInject.functions.getCumulativeFilterUpToActiveStep 
	 * @param {Function} oInject.functions.getNavigationTargets
	 * @param {Function} oInject.functions.getActiveStep 
	 * @param {Function} oInject.functions.createRequest 
	 * @param {Function} oInject.functions.getXappStateId 
	 * @param {Function} oInject.functions.isFilterReductionActive
	 */
	sap.apf.utils.NavigationHandler = function(oInject) {
		var configuredNavigationTargets;
		var enrichedNavigationTargets;
		var messageHandler = oInject.instances.messageHandler;
		var navigationHandler = this;
		var FilterReduction = oInject.constructors && oInject.constructors.FilterReduction || sap.apf.core.utils.FilterReduction;
		var filterSimplify;
		/**
		 * Returns all possible navigation targets with text (from intent)
		 * @returns Promise with [object] Object containing properties global and stepSpecific. Each containing an array of navigation targets with properties id, semanticObject, action and text. The id is
		 * used in the navigateToApp function.
		 * Derivation of step specific navigation targets implicitly considers only navigation targets that are assigned to the currently active step.
		 * If there is no active step set or the active step has no navigation targets assigned in its configuration an empty array will be assigned to property stepSpecific of the result object. 
		 */
		this.getNavigationTargets = function() {
			var deferred;
			var navigationService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
			if (enrichedNavigationTargets) {
				deferred = jQuery.Deferred();
				deferred.resolve(convertToResultObject(enrichedNavigationTargets));
				return deferred.promise();
			}
			if (!navigationService) {
				var messageObject = messageHandler.createMessageObject({ code : 5074});
				messageHandler.putMessage(messageObject);
				enrichedNavigationTargets = { global : [], stepSpecific : []};
				return sap.apf.utils.createPromise(enrichedNavigationTargets);
			}
			if (!configuredNavigationTargets) {
				initNavigationTargets();
			}
			enrichedNavigationTargets = jQuery.extend(true, [], configuredNavigationTargets);
			enrichedNavigationTargets.forEach(function(navTarget) {
				navTarget.text = "";
			});
			deferred = jQuery.Deferred();
			collectIntentTexts().done(function(finalNavTargets) {
				enrichedNavigationTargets = finalNavTargets;
				deferred.resolve(convertToResultObject(enrichedNavigationTargets));
			});
			return deferred.promise();
			function collectIntentTexts() {
				var deferred = jQuery.Deferred();
				var finalNavTargets = [];
				var aDeferreds = [];
				enrichedNavigationTargets.forEach(function(navTarget) {
					var deferredForEach;
					var parameters = [];
					if(navTarget.parameters) {
						parameters = navTarget.parameters;
					}
					deferredForEach = jQuery.Deferred();
					aDeferreds.push(deferredForEach);
					navigationService.getLinks({
						semanticObject : navTarget.semanticObject,
						action : navTarget.action,
						params: getNavigationParams(parameters),
						ignoreFormFactor : false,
						ui5Component : oInject.instances.component
					}).then(function(aIntents) {
						aIntents.forEach(function(intentDefinition) {
							var actionWithParameters = intentDefinition.intent.split("-");
							var action = actionWithParameters[1].split("?");
							action = action[0].split("~");
							if (intentDefinition.text !== "" && action[0] === navTarget.action) {
								navTarget.text = intentDefinition.text;
								finalNavTargets.push(navTarget);
							}
						});
						deferredForEach.resolve();
					}, function() {
						deferredForEach.resolve();
					});
				});
				jQuery.when.apply(jQuery, aDeferreds).done(function() {
					deferred.resolve(finalNavTargets);
				});
				return deferred.promise();
			}
		};
		/**
		 * receives an id of a navigation target and starts the navigation
		 * @param {string} navigationId navigation target id
		 * @returns undefined
		 */
		this.navigateToApp = function(navigationId) {
			if (!configuredNavigationTargets) {
				initNavigationTargets();
			}
			var oNavigationTarget = getNavigationTarget(navigationId);
			if (!oNavigationTarget) {
				return;
			}
			var hashChanger = sap.ui.core.routing.HashChanger && sap.ui.core.routing.HashChanger.getInstance();
			oInject.functions.getCumulativeFilterUpToActiveStep().done(function(oCumulativeFilter) {
				if (oInject.functions.isFilterReductionActive && oInject.functions.isFilterReductionActive()) {
					filterSimplify = new FilterReduction();
					var oFilter = filterSimplify.filterReduction(messageHandler, oCumulativeFilter);
					if (oFilter === null) {
						messageHandler.putMessage(messageHandler.createMessageObject({ code : 5235 }));
					} else {
						oCumulativeFilter = oFilter;
					}
				}
				if (!oNavigationTarget.filterMapping || !oNavigationTarget.filterMapping.requestForMappedFilter) {
					callbackForFilterMapping(null, null);
				} else {
					var oMappingRequest = oInject.functions.createRequest(oNavigationTarget.filterMapping.requestForMappedFilter);
					sap.apf.utils.executeFilterMapping(oCumulativeFilter, oMappingRequest, oNavigationTarget.filterMapping.target, callbackForFilterMapping, messageHandler);
				}
				function callbackForFilterMapping(oFilterFromFilterMapping, oMessageObject) {
					var appState;
					if (oMessageObject) {
						return;
					}
					if (oFilterFromFilterMapping) {
						oCumulativeFilter = oCumulativeFilter.addAnd(oFilterFromFilterMapping);
					}
					var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
					if (oCrossAppNavigator) {
						oInject.instances.serializationMediator.serialize(true).done(function(serializableApfState) {
							navigationHandler.generateSelectionVariant(oCumulativeFilter).done(function(selectionVariant){
								var containerData = {};
								containerData.sapApfState = serializableApfState;
								containerData.sapApfCumulativeFilter = oCumulativeFilter.mapToSapUI5FilterExpression();
								containerData.selectionVariant = selectionVariant;
								appState = oCrossAppNavigator.createEmptyAppState(oInject.instances.component);
								appState.setData(containerData);
								appState.save();
								if (hashChanger) {
									hashChanger.replaceHash("sap-iapp-state=" + appState.getKey());
								}
								oCrossAppNavigator.toExternal({
									target : {
										semanticObject : oNavigationTarget.semanticObject,
										action : oNavigationTarget.action
									},
									appStateKey : appState.getKey(),
									params : getNavigationParams(oNavigationTarget.parameters)
								}, oInject.instances.component);
							});
						});
					}
				}
			});
		};
		this.checkMode = function() {
			var deferred = jQuery.Deferred();
			var hashChanger = sap.ui.core.routing.HashChanger && sap.ui.core.routing.HashChanger.getInstance && sap.ui.core.routing.HashChanger.getInstance();
			var iappStateKeyMatcher = /(?:sap-iapp-state=)([^&=]+)/;
			var innerAppStateKey, crossAppStateKey, iappMatch, containerData;
			if (hashChanger) {
				iappMatch = iappStateKeyMatcher.exec(hashChanger.getHash());
				if (iappMatch) {
					innerAppStateKey = iappMatch[1];
				}
			}
			crossAppStateKey = oInject.functions.getXappStateId();
			if (innerAppStateKey) {
				sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(oInject.instances.component, innerAppStateKey).done(function(appContainer) {
					containerData = appContainer.getData();
					if (containerData.sapApfState) {
						oInject.instances.serializationMediator.deserialize(containerData.sapApfState).done(function() {
							deferred.resolve({
								navigationMode : "backward"
							});
						});
					}
				});
			} else if (crossAppStateKey) {
				sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(oInject.instances.component, crossAppStateKey).done(function(appContainer) {
					containerData = appContainer.getData();
					if (containerData && containerData.sapApfCumulativeFilter) {
						deferred.resolve({
							navigationMode : "forward",
							sapApfCumulativeFilter : containerData.sapApfCumulativeFilter
						});
					} else {
						deferred.resolve({
							navigationMode : "forward"
						});
					}
				});
			} else {
				deferred.resolve({
					navigationMode : "forward"
				});
			}
			//removes sap-iapp-state from URL hash
			if (hashChanger) {
				hashChanger.replaceHash("");
			}
			return deferred.promise();
		};
		this.generateSelectionVariant = function (filter) {
			var deferred = jQuery.Deferred();
			if (!oInject.functions.isFilterReductionActive || !oInject.functions.isFilterReductionActive()) {
				filterSimplify = new FilterReduction();
				filter = filterSimplify.filterReduction(messageHandler, filter);
			}
			if(!filterSimplify || !filterSimplify.isContradicted()){
				var selectOptionsPromise = filter.mapToSelectOptions(oInject.functions.getAllParameterEntitySetKeyProperties);
				selectOptionsPromise.done(function(selectionVariant){
					selectionVariant.SelectionVariantID = jQuery.sap.uid();
					deferred.resolve(selectionVariant);
				});
			} else {
				var selectionVariant = {};
				selectionVariant = {
					SelectionVariantID: jQuery.sap.uid(),
					Text: 'Filter could not be converted to a selectionVariant'
				};
				deferred.resolve(selectionVariant);
			}
			return deferred.promise();
		};
		function initNavigationTargets() {
			configuredNavigationTargets = oInject.functions.getNavigationTargets();
		}
		function getNavigationTarget(navigationId) {
			for(var i = 0, len = configuredNavigationTargets.length; i < len; i++) {
				if (configuredNavigationTargets[i].id === navigationId) {
					return configuredNavigationTargets[i];
				}
			}
		}
		function getNavigationParams(parameters){
			var parameterObject = {};
			if(parameters && parameters.length > 0){
				parameters.forEach(function(parameter){
					parameterObject[parameter.key] = parameter.value;
				});
				return parameterObject;
			}
		}
		function convertToResultObject(targets) {
			var copyOfTargets = jQuery.extend(true, [], targets);
			var resultObject = {
				global : [],
				stepSpecific : []
			};
			copyOfTargets.forEach(function(target) {
				if (target.isStepSpecific && isAssignedToActiveStep(target.id)) {
					delete target.isStepSpecific;
					resultObject.stepSpecific.push(target);
				} else if (!target.isStepSpecific) {
					delete target.isStepSpecific;
					resultObject.global.push(target);
				}
			});
			return resultObject;
			function isAssignedToActiveStep(id) {
				var result = false;
				var assignedNavigationTargets;
				var activeStep = oInject.functions.getActiveStep();
				if (activeStep && activeStep.getAssignedNavigationTargets) {
					assignedNavigationTargets = activeStep.getAssignedNavigationTargets();
					if (assignedNavigationTargets && jQuery.isArray(assignedNavigationTargets)) {
						assignedNavigationTargets.forEach(function(assignedNavigationTarget) {
							if (id === assignedNavigationTarget.id) {
								result = true;
							}
						});
					}
				}
				return result;
			}
		}
	};
}());
