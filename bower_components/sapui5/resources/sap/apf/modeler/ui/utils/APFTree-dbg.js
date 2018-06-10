/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
/**
  * APF Custom Tree Control
  */
jQuery.sap.declare('sap.apf.modeler.ui.utils.APFTree');
jQuery.sap.require("sap.apf.ui.utils.constants");
(function() {
	"use strict";
	sap.ui.getCore().loadLibrary("sap.ui.commons");
	/**
	 * @private
	 * @class APF Custom Tree
	 * @description APF Custom Tree which exposes certain API's to perform different operations on the tree
	 * @name sap.apf.modeler.ui.utils.APFTree
	 */
	sap.ui.commons.Tree.extend("sap.apf.modeler.ui.utils.APFTree", {
		metadata : {
			events : {},
			properties : {
				translationFunction : {},
				defaultRepresentationType : {},
				applicationId : {}
			}
		},
		renderer : function(oControl, oRM) {
			sap.ui.commons.TreeRenderer.render(oControl, oRM);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#setTranslationFunction
		 * @param {sap.apf.modeler.core.Instance.getText} Function to get translated texts
		 * @description Setter for TranslationFunction property which is used to get the translated texts
		 * */
		setTranslationFunction : function(fnTranslationFunction) {
			this.fnTranslationFunction = fnTranslationFunction;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#setDefaultRepresentationType
		 * @param {String} Default representation type
		 * @description Setter for DefaultRepresentationType property which is used to set the default representation
		 * */
		setDefaultRepresentationType : function(sDefaultRepresentationType) {
			this.defaultRepresentationType = sDefaultRepresentationType;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#setApplicationId
		 * @param {String} Application ID
		 * @description Setter for Application ID which is used in model of each configuration
		 * */
		setApplicationId : function(applicationId) {
			this.applicationId = applicationId;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#getAPFTreeNodeContext
		 * @param {sap.ui.commons.TreeNode} Tree Node - Tree node whose context has to be derived
		 * @description Gets the context of the node
		 * */
		getAPFTreeNodeContext : function(oNode) {
			if (oNode) {
				var oNodeContext = oNode ? oNode.getBindingContext() : undefined;
				var sObjectType = oNodeContext.getObject() ? oNodeContext.getObject().type : undefined;
				var sObjectId;
				if (oNodeContext.getObject() && oNodeContext.getObject().id) {
					sObjectId = oNodeContext.getObject().id;
				} else if (oNodeContext.getObject() && oNodeContext.getObject().AnalyticalConfiguration) {
					sObjectId = oNodeContext.getObject().AnalyticalConfiguration;
				}
				return {
					oNode : oNode,
					nodeContext : oNodeContext.sPath,
					nodeObjectType : sObjectType,
					nodeTitle : oNode.getText(),
					nodeAPFId : sObjectId
				};
			}
			return null;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#getParentNodeContext
		 * @param {sap.ui.commons.TreeNode} Tree Node - Tree node whose context has to be derived
		 * @description Gets the context of the parent node
		 * */
		getParentNodeContext : function(oSelectedNodeDetails) {
			var oModel = this.getModel();
			if (oSelectedNodeDetails !== null) {
				var configIndexInTree = oSelectedNodeDetails.nodeContext.split('/')[2];
				var configurationId = oModel.getData().aConfigDetails[configIndexInTree] ? oModel.getData().aConfigDetails[configIndexInTree].AnalyticalConfiguration : undefined;
				var oRepresentationNode;
				var categoryIndexInConfig = oSelectedNodeDetails.nodeContext.split('/')[6];
				var filterIndexInConfig = oSelectedNodeDetails.nodeContext.split('/')[6];
				var navTargetIndexInConfig = oSelectedNodeDetails.nodeContext.split('/')[6];
				var stepIndexInCategory = oSelectedNodeDetails.nodeContext.split('/')[8];
				var oSelectedNodeParentDetails = {};
				if (oSelectedNodeDetails !== null) {
					switch (oSelectedNodeDetails.nodeObjectType) { // based on the object type get the parent nodes	
						case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER:
							oSelectedNodeParentDetails.facetFilterId = oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters[filterIndexInConfig].id;
							oSelectedNodeParentDetails.configId = configurationId;
							oSelectedNodeParentDetails.configurationName = oModel.getData().aConfigDetails[configIndexInTree].name;
							oSelectedNodeParentDetails.facetFilterName = oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters[filterIndexInConfig].name;
							break;
						case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.SMARTFILTERBAR:
							oSelectedNodeParentDetails.smartFilterId = oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters[filterIndexInConfig].id;
							oSelectedNodeParentDetails.configId = configurationId;
							oSelectedNodeParentDetails.configurationName = oModel.getData().aConfigDetails[configIndexInTree].name;
							oSelectedNodeParentDetails.smartFilterName = oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters[filterIndexInConfig].name;
							break;
						case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY:
							oSelectedNodeParentDetails.categoryId = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].id;
							oSelectedNodeParentDetails.configId = configurationId;
							oSelectedNodeParentDetails.configurationName = oModel.getData().aConfigDetails[configIndexInTree].name;
							oSelectedNodeParentDetails.categoryName = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].name;
							break;
						case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP:
							oSelectedNodeParentDetails.configId = configurationId;
							oSelectedNodeParentDetails.categoryId = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].id;
							oSelectedNodeParentDetails.stepId = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].id;
							oSelectedNodeParentDetails.configurationName = oModel.getData().aConfigDetails[configIndexInTree].name;
							oSelectedNodeParentDetails.categoryName = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].name;
							oSelectedNodeParentDetails.stepName = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].name;
							break;
						case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION:
							oRepresentationNode = oSelectedNodeDetails.oNode;
							oSelectedNodeParentDetails.configId = configurationId;
							oSelectedNodeParentDetails.categoryId = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].id;
							oSelectedNodeParentDetails.stepId = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].id;
							oSelectedNodeParentDetails.representationId = oRepresentationNode.getBindingContext().getObject().id;
							oSelectedNodeParentDetails.configurationName = oModel.getData().aConfigDetails[configIndexInTree].name;
							oSelectedNodeParentDetails.categoryName = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].name;
							oSelectedNodeParentDetails.stepName = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].name;
							oSelectedNodeParentDetails.representationName = oRepresentationNode.getBindingContext().getObject().name;
							break;
						case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION:
							oSelectedNodeParentDetails.configId = oSelectedNodeDetails.oNode.getBindingContext().getObject().AnalyticalConfiguration;
							oSelectedNodeParentDetails.configurationName = oSelectedNodeDetails.oNode.getBindingContext().getObject().name;
							break;
						case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET:
							oSelectedNodeParentDetails.navTargetId = oModel.getData().aConfigDetails[configIndexInTree].configData[2].navTargets[navTargetIndexInConfig].id;
							oSelectedNodeParentDetails.configId = configurationId;
							oSelectedNodeParentDetails.configurationName = oModel.getData().aConfigDetails[configIndexInTree].name;
							oSelectedNodeParentDetails.navTargetName = oModel.getData().aConfigDetails[configIndexInTree].configData[2].navTargets[navTargetIndexInConfig].name;
							break;
						default:
							break;
					}
					if (oModel.getData().aConfigDetails && oModel.getData().aConfigDetails[configIndexInTree]) {
						oSelectedNodeParentDetails.appId = oModel.getData().aConfigDetails[configIndexInTree].Application;
					}
				}
				return oSelectedNodeParentDetails;
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#isConfigurationSwitched
		 * @param {sap.ui.commons.TreeNode} Tree Node - Previous selected node on the tree
		 * @param {sap.ui.commons.TreeNode} Tree Node - Current selected node on the tree
		 * @description Checks whether a configuration switch has happened
		 * @returns {Boolean} Returns boolean specifying whether configuration switch has happened
		 * */
		isConfigurationSwitched : function(oPreviousSelectedNode, oCurrentSelectedNode) {
			var bIsDifferntConfig = false, oPrevSelectedNodeConfigID, indexOfConfig;
			var oPreviousSelectedNodeParentDetails = this.getParentNodeContext(this.getAPFTreeNodeContext(oPreviousSelectedNode));
			var oCurrentSelectedNodeParentDetails = this.getParentNodeContext(this.getAPFTreeNodeContext(oCurrentSelectedNode));
			oPrevSelectedNodeConfigID = oPreviousSelectedNodeParentDetails ? oPreviousSelectedNodeParentDetails.configId : undefined;
			// Additional checks to get configId of previous selected node in case it was deleted: Deleted tree nodes lose relevant context information and therefore APFTree model used to get configId in that case
			if (oPreviousSelectedNodeParentDetails && !jQuery.isEmptyObject(oPreviousSelectedNodeParentDetails) && oPreviousSelectedNodeParentDetails.configId === undefined) {
				indexOfConfig = this.getAPFTreeNodeContext(oPreviousSelectedNode).nodeContext.split("/")[2];
				oPrevSelectedNodeConfigID = this.getModel().getData().aConfigDetails[indexOfConfig].AnalyticalConfiguration;
			}
			if (oPrevSelectedNodeConfigID !== undefined && oPrevSelectedNodeConfigID !== oCurrentSelectedNodeParentDetails.configId) {
				bIsDifferntConfig = true;
			}
			return bIsDifferntConfig;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#removeSelection
		 * @param {sap.ui.commons.TreeNode} Tree Node - Current selection on the tree
		 * @description Removes all the selection from the tree
		 * */
		removeSelectionOnTree : function(oSelectedNode) {
			var oSelectionOnTree = this.getSelection();
			if (oSelectedNode) {
				oSelectedNode.getBindingContext().getObject().isSelected = false;
				oSelectedNode.setIsSelected(false);
			} else if (oSelectionOnTree) {
				oSelectionOnTree.getBindingContext().getObject().isSelected = false;
				oSelectionOnTree.setIsSelected(false);
			}
			this.getModel().updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#setSelection
		 * @param {String} Binding context of the node which has to be shown selected on the tree
		 * @description Sets selection on the tree
		 * */
		setSelectionOnTree : function(sBindingContextOfSelectedNode) {
			var oContextFromModel = this.getModel().getContext(sBindingContextOfSelectedNode);
			this.selectedNode = this.getNodeByContext(oContextFromModel);
			var oSelectionOnTree = this.getSelection();
			if (oSelectionOnTree !== this.selectedNode) {
				if (oSelectionOnTree && oSelectionOnTree.getBindingContext().getObject()) {
					oSelectionOnTree.getBindingContext().getObject().isSelected = false;
					oSelectionOnTree.setIsSelected(false);
				}
				this.selectedNode.setIsSelected(true);
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_scrollTreeToNewNode
		 * @param {sap.ui.commons.TreeNode} New added node in the tree
		 * @description Sets the scroll position to the newly added node
		 * */
		_scrollTreeToNewNode : function(oNewAddedTreeNode) {
			if (oNewAddedTreeNode && oNewAddedTreeNode.$().length !== 0) {
				jQuery(oNewAddedTreeNode.$())[0].scrollIntoView();
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#setSelectedNode
		 * @param {sap.ui.commons.TreeNode} Tree node which has to be selected
		 * @description Sets node as selected in the tree
		 * */
		setSelectedNode : function(oNode) {
			var oContextFromModel = this.getModel().getContext(oNode.getBindingContext().sPath);
			this.setSelection(this.getNodeByContext(oContextFromModel));
			this.getModel().updateBindings();
			this._scrollTreeToNewNode(oNode);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_getObjectNodesArray
		 * @param {String} Selected Object node type
		 * @param {Integer} Selected configuration index in tree
		 * @param {Integer} Selected category index in tree
		 * @param {Integer} Selected step index in tree
		 * @description Get array of nodes of selected object type
		 * @returns {Array} Returns an array of nodes of selected object type
		 * */
		_getObjectNodesArray : function(sObjectType, configIndexInTree, categoryIndexInConfig, stepIndexInCategory) {
			var aObjectArray;
			switch (sObjectType) {
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION:
					aObjectArray = this.getNodes();
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER:
					aObjectArray = this.getNodes()[configIndexInTree].getNodes()[0].getNodes();
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY:
					aObjectArray = this.getNodes()[configIndexInTree].getNodes()[1].getNodes();
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP:
					aObjectArray = this.getNodes()[configIndexInTree].getNodes()[1].getNodes()[categoryIndexInConfig].getNodes();
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION:
					aObjectArray = this.getNodes()[configIndexInTree].getNodes()[1].getNodes()[categoryIndexInConfig].getNodes()[stepIndexInCategory].getNodes();
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET:
					aObjectArray = this.getNodes()[configIndexInTree].getNodes()[2].getNodes();
					break;
				default:
					break;
			}
			return aObjectArray;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#addNodeInTree
		 * @param {String} Selected Object node type
		 * @param {Object} Existing Steps Or Representations in existing steps to be added
		 * @param {String} boolean bIsHierarchicalStep to check if the step is a hierarchy step
		 * @description Adds selected object type node into the tree
		 * */
		addNodeInTree : function(sObjectType, params, bIsHierarchicalStep) {
			var sMethodName;
			var selectedTreeNodeDetails = this.getAPFTreeNodeContext(this.getSelection());
			var configIndexInTree = selectedTreeNodeDetails ? selectedTreeNodeDetails.nodeContext.split('/')[2] : undefined;
			var categoryIndexInConfig = selectedTreeNodeDetails ? selectedTreeNodeDetails.nodeContext.split('/')[6] : undefined;
			var stepIndexInCategory = selectedTreeNodeDetails ? selectedTreeNodeDetails.nodeContext.split('/')[8] : undefined;
			sMethodName = [ "_add", sObjectType ].join("");
			this[sMethodName](configIndexInTree, categoryIndexInConfig, stepIndexInCategory, params, bIsHierarchicalStep);
			var aObjectArray = this._getObjectNodesArray(sObjectType, configIndexInTree, categoryIndexInConfig, stepIndexInCategory);
			var newAddedTreeNode = aObjectArray[aObjectArray.length - 1];
			if (sObjectType !== sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION) {
				if (newAddedTreeNode.getParent()) {
					newAddedTreeNode.getParent().setExpanded(true);
				}
			}
			this.setSelectedNode(newAddedTreeNode);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_addconfiguration
		 * @description Adds a configuration node into the tree
		 * */
		_addconfiguration : function() { // adds a new configuration in the tree
			var self = this;
			this.configNewIndex = this.configNewIndex || 1;
			var oModel = this.getModel();
			var idOfConfig;
			//Increment the configuration index each time to traverse to route
			idOfConfig = "I" + this.configNewIndex;
			this.configNewIndex++;
			var allCategoryInConfig = [], aFacetFilter = [], aCategoryWithStepDetails = [], aNavigationTargets = [];
			allCategoryInConfig.push({
				filters : aFacetFilter,
				name : self.fnTranslationFunction("facetFilters"),
				isSelected : false,
				expanded : false,
				selectable : false
			});
			allCategoryInConfig.push({
				categories : aCategoryWithStepDetails,
				name : self.fnTranslationFunction("categories"),
				isSelected : false,
				expanded : false,
				selectable : false
			});
			allCategoryInConfig.push({
				navTargets : aNavigationTargets,
				name : self.fnTranslationFunction("navigationTargets"),
				isSelected : false,
				expanded : false,
				selectable : false
			});
			var oConfigDetails = {};
			oConfigDetails.configData = allCategoryInConfig;
			var newConfigName = this.fnTranslationFunction("newConfiguration");
			var newConfigObject = {
				name : "< " + newConfigName + " >",
				type : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION,
				AnalyticalConfiguration : "newConfig" + idOfConfig,
				Application : this.applicationId,
				configData : allCategoryInConfig,
				bIsLoaded : true,
				isSelected : false,
				expanded : false,
				selectable : true
			};
			oModel.getData().aConfigDetails.push(newConfigObject); //push the new configuration at the last index
			oModel.updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_addfacetFilter
		 * @description Adds a facet filter node into the tree
		 * */
		_addfacetFilter : function(configIndexInTree) { // adds a new facet filter in the selected configuration
			var oModel = this.getModel();
			var newFacetFilterName = this.fnTranslationFunction("newFacetFilter");
			var idOfFacetFilter = oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters.length;
			var newFacetFilterObject = {
				name : "< " + newFacetFilterName + " >",
				type : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER,
				id : "newFilter" + idOfFacetFilter,
				isSelected : false,
				selectable : true
			};
			oModel.getData().aConfigDetails[configIndexInTree].expanded = true;
			oModel.getData().aConfigDetails[configIndexInTree].configData[0].expanded = true;
			oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters.push(newFacetFilterObject);//push the new facet filter at the last index
			oModel.updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_addnavigationTarget
		 * @description Adds a navigation Target node into the tree
		 * */
		_addnavigationTarget : function(configIndexInTree) { // adds a new navigation Target in the selected configuration
			var oModel = this.getModel();
			var newNavigationTargetName = this.fnTranslationFunction("newNavigationTarget");
			var idOfNavigationTarget = oModel.getData().aConfigDetails[configIndexInTree].configData[2].navTargets.length;
			var newNavigationTargetObject = {
				name : "< " + newNavigationTargetName + " >",
				type : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET,
				id : "newNavTarget" + idOfNavigationTarget,
				isSelected : false,
				selectable : true
			};
			oModel.getData().aConfigDetails[configIndexInTree].expanded = true;
			oModel.getData().aConfigDetails[configIndexInTree].configData[2].expanded = true;
			oModel.getData().aConfigDetails[configIndexInTree].configData[2].navTargets.push(newNavigationTargetObject);//push the new navigation Target at the last index
			oModel.updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_addcategory
		 * @description Adds a category node into the tree
		 * */
		_addcategory : function(configIndexInTree) {// adds a new category in the selected configuration
			var oModel = this.getModel();
			var newCategoryName = this.fnTranslationFunction("newCategory");
			var idOfCategory = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories.length;
			var newCategoryObject = {
				name : "< " + newCategoryName + " >",
				type : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY,
				id : "newCategory" + idOfCategory,
				isSelected : false,
				expanded : false,
				selectable : true
			};
			oModel.getData().aConfigDetails[configIndexInTree].expanded = true;
			oModel.getData().aConfigDetails[configIndexInTree].configData[1].expanded = true;
			oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories.push(newCategoryObject);//push the new category at the last index
			oModel.updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_addstep
		 * @description Adds a new step or existing step node into the tree
		 * @param Contains the list of existing steps to be added
		 * */
		_addstep : function(configIndexInTree, categoryIndexInConfig, stepIndexInCategory, params, bIsHierarchicalStep) { // adds a new step or existing step with representations in the selected category under a configuration
			var oModel = this.getModel();
			var newStepObject;
			var bIsHierarchicalStep = (bIsHierarchicalStep && bIsHierarchicalStep === true) ? true : false;
			if (oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps === undefined) {
				oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps = [];
			}
			if (!params) {// Incase of a new step
				var idOfStep = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps.length;
				var newStepName = this.fnTranslationFunction("newStep");
				newStepObject = {
					name : "< " + newStepName + " >",
					type : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP,
					id : "newStep" + idOfStep,
					isSelected : false,
					expanded : false,
					selectable : true,
					bIsHierarchicalStep : bIsHierarchicalStep
				};
				oModel.getData().aConfigDetails[configIndexInTree].expanded = true;
				oModel.getData().aConfigDetails[configIndexInTree].configData[1].expanded = true;
				oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].expanded = true;
				oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps.push(newStepObject);
			} else {//In case of existing steps(single or multiple)
				var existingStepObject, i, j;
				for(i = 0; i < params.noOfSteps; i++) {
					existingStepObject = {
						name : params.aExistingStepsToBeAdded[i].step.name,
						type : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP,
						id : params.aExistingStepsToBeAdded[i].step.id,
						isSelected : false,
						expanded : false,
						selectable : true,
						icon: bIsHierarchicalStep === true ? "sap-icon://drill-down" : "sap-icon://step"
					};
					oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps.push(existingStepObject);
					if (params.aExistingStepsToBeAdded[i].noOfReps !== 0) {
						stepIndexInCategory = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps.length - 1;
						for(j = 0; j < params.aExistingStepsToBeAdded[i].noOfReps; j++) {
							var representationParams = {
								id : params.aExistingStepsToBeAdded[i].representations[j].id,
								name : params.aExistingStepsToBeAdded[i].representations[j].name,
								icon : params.aExistingStepsToBeAdded[i].representations[j].icon
							};
							this._addrepresentation(configIndexInTree, categoryIndexInConfig, stepIndexInCategory, representationParams);//In case the existing step has representations
						}
					}
				}
			}
			oModel.updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_addrepresentation
		 * @description Adds a new representation node or existing representations into the tree
		 * @param Contains the representation node to be added under an existing step
		 * */
		_addrepresentation : function(configIndexInTree, categoryIndexInConfig, stepIndexInCategory, params) {// adds a new representation in the selected step in a category under a configuration
			var oModel = this.getModel();
			var self = this;
			var stepId;
			if (params === undefined) {//In case of new representation under a step or existing step
				var selectedTreeNodeDetails = this.getAPFTreeNodeContext(this.getSelection());
				if (selectedTreeNodeDetails.nodeObjectType === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION) {
					stepId = this.getParentNodeContext(selectedTreeNodeDetails, oModel).stepId;
				} else if (selectedTreeNodeDetails.nodeObjectType === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP) {
					stepId = selectedTreeNodeDetails.nodeAPFId;
				}
				var aStepContexts = [];
				oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories.forEach(function(category, categoryIndex) {
					if (oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndex].steps) {
						oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndex].steps.forEach(function(step, stepIndex) {
							var stepContext = {};
							if (step.id === stepId) {
								stepContext.stepIndex = stepIndex;
								stepContext.categoryIndex = categoryIndex;
								aStepContexts.push(stepContext);
							}
						});
					}
				});
				aStepContexts.forEach(function(stepContext) {
					if (oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[stepContext.categoryIndex].steps[stepContext.stepIndex].representations === undefined) {
						oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[stepContext.categoryIndex].steps[stepContext.stepIndex].representations = [];
					}
					var idOfRep = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[stepContext.categoryIndex].steps[stepContext.stepIndex].representations.length;
					var newRepresentationObject = {
						name : self.fnTranslationFunction(self.defaultRepresentationType),
						type : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION,
						id : "newRepresentation" + idOfRep,
						isSelected : false,
						selectable : true
					};
					oModel.getData().aConfigDetails[configIndexInTree].expanded = true;
					oModel.getData().aConfigDetails[configIndexInTree].configData[1].expanded = true;
					oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[stepContext.categoryIndex].expanded = true;
					oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[stepContext.categoryIndex].steps[stepContext.stepIndex].expanded = true;
					oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[stepContext.categoryIndex].steps[stepContext.stepIndex].representations.push(newRepresentationObject);//push the new representation at the last index
				});
			} else {//In case of adding existing step with representations
				if (oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].representations === undefined) {
					oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].representations = [];
				}
				var representationObject = {
					name : params.name,
					type : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION,
					id : params.id,
					isSelected : false,
					selectable : true,
					icon : params.icon
				};
				oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].representations.push(representationObject);//push the existing representation at the last index
			}
			oModel.updateBindings();
		}
	});
}());