/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/**
  * Router Helper Functions
**/
jQuery.sap.declare('sap.apf.modeler.ui.utils.APFRouter');
(function() {
	"use strict";
	sap.apf.modeler.ui.utils.APFRouter = {
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFRouter#patternMatch
		 * @param {sap.apf.modeler.ui.controller.configurationList} context - Configuration List Context.
		 * @description Handles the startup sequence operations as well as bookmarking.Populate the respective view with the route pattern match and retains selection on the tree.
		 * */
		patternMatch : function(context) {
			this.params = {};
			var oSelf = this;
			sap.ui.core.UIComponent.getRouterFor(context).attachRoutePatternMatched(function(oEvent) {
				oSelf.params = {
					name : oEvent.getParameter("name"),
					arguments : oEvent.getParameter("arguments")
				};
				context.getView().byId("idConfigMasterData").setBusy(true);
				context.getView().byId("idConfigDetail").setBusy(true);
				if (oSelf.params.name !== "applicationList") {
					var oCoreApi = context.oCoreApi;
					context.appId = oSelf.params.arguments.appId;
					context.configId = oSelf.params.arguments.configId;
					oCoreApi.getApplicationHandler(function(oApplicationHandler) {
						context.applicationHandler = oApplicationHandler;
						context.appName = oApplicationHandler.getApplication(context.appId).ApplicationName;
						var titleText = context.byId("idConfigTitleMaster").getText();
						if (titleText === "" || oSelf.params.name === "configurationList") {
							context.setConfigListMasterTitle(context.appName);
							context.oTreeInstance.setApplicationId(oSelf.params.arguments.appId);
						}
						oCoreApi.getConfigurationHandler(context.appId, function(configurationHandler) {
							context.configurationHandler = configurationHandler;
							context.oTextPool = context.configurationHandler.getTextPool();
							//Startup sequence
							if (context.configurationHandler.getList().length > context.getView().getModel().getData().aConfigDetails.length) {
								context.createConfigList(); //creates list of only configurations
								if (oSelf.params.name === "configurationList") {
									context.updateConfigListView(); //Handles what has to be shown in detail area in case of single or multiple configurations
								}
							}
							//If the configuration list length is empty then insert a new configuration
							if (context.configurationHandler.getList().length === 0 && (context.configId === undefined)) {
								context.oTreeInstance.addNodeInTree(sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION);
								var aConfigurationArray = context.oTreeInstance.getNodes(); //total number of configurations
								var newAddedTreeNode = aConfigurationArray[aConfigurationArray.length - 1];
								context.oTreeInstance.setSelectedNode(newAddedTreeNode);
							}
							//Loads the current editor of selected configuration and loads the detail view
							if (context.configId !== undefined) {
								var oExistingConfig = configurationHandler.getConfiguration(context.configId);
								if (oExistingConfig) {
									configurationHandler.loadConfiguration(context.configId, function(configurationEditor) {
										context.configEditor = configurationEditor;
										var sPathForConfig = context.getSPathForConfig(context.configId);
										if (context.oModel.getData().aConfigDetails[sPathForConfig.split('/')[2]].bIsLoaded === false) {//checks whether structure has been got already
											context.updateTree();
											if (oSelf.params.name !== "navigationTarget") {
												oSelf.setCurrentSelectionState(oSelf.params, context);
											}
										} else {
											oSelf.setCurrentSelectionState(oSelf.params, context);
										}
									});
								} else {
									oSelf.setCurrentSelectionState(oSelf.params, context);
								}
							}
							context.getView().byId("idConfigMasterData").setBusy(false);
						});
					});
				}
			});
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFRouter#setCurrentSelectionState
		 * @param URL Context.
		 * @param {sap.apf.modeler.ui.controller.configurationList} context - Configuration List Context.
		 * @description Sets selection on the tree,Populates the respective detail view based on URL context,updates the title and breadcrumb
		 * */
		setCurrentSelectionState : function(params, context) {
			var oValidURLContext = context.getSPathFromURL(params);
			if (params.name !== "configurationList") {
				if (oValidURLContext && oValidURLContext.objectType) {
					if (params.name === "step") {//if it is hierarchical step
						var oStepDataDetails = context.getStepConfigDataBysPath(oValidURLContext.sPath);
						params.bIsHierarchicalStep = oStepDataDetails && oStepDataDetails.bIsHierarchicalStep ? true : false;
					}
					//Update the valid subview,set selection on the tree and update breadcrumb
					context.updateSubView(params);
					if (oValidURLContext.sPath) {
						context.setSelectionOnTree(oValidURLContext);
					}
					context.updateTitleAndBreadCrumb();
				} else {
					context.showNoConfigSelectedText();
					context.removeSelectionOnTree();
				}
			}
			context.getView().byId("idConfigDetail").setBusy(false);
		}
	};
}());