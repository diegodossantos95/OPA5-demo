/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
/**
* @class toolbar
* @memberOf sap.apf.modeler.ui.controller
* @name toolbar
* @description controller for view.toolbar
*/
(function() {
	'use strict';
	sap.ui.controller("sap.apf.modeler.ui.controller.toolbar", {
		/**
		 * @public
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#onInit
		 * @description Called on initialization of the view.
		 * Gets the coreApi and configurationList instance from viewdata
		 * */
		onInit : function() {
			this.oCoreApi = this.getView().getViewData().oConfigListInstance.oCoreApi;
			this.oConfigListInstance = this.getView().getViewData().oConfigListInstance;
			this._setDisplayText();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_setDisplayText
		 * @description Sets the text for each of the toolbar buttons
		 * */
		_setDisplayText : function() {
			this.byId("idAddButton").setText(this.oCoreApi.getText("addButton"));
			this.byId("idCopyButton").setText(this.oCoreApi.getText("copyButton"));
			this.byId("idDeleteButton").setText(this.oCoreApi.getText("deleteButton"));
			this.byId("idMoveUp").setTooltip(this.oCoreApi.getText("moveUp"));
			this.byId("idMoveDown").setTooltip(this.oCoreApi.getText("moveDown"));
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#enableCopyDeleteButton
		 * @description Enables copy and delete button in the toolbar
		 * */
		enableCopyDeleteButton : function() {
			if (!this.byId("idCopyButton").getEnabled()) {
				this.byId("idCopyButton").setEnabled(true);
			}
			if (!this.byId("idDeleteButton").getEnabled()) {
				this.byId("idDeleteButton").setEnabled(true);
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#disableCopyDeleteButton
		 * @description Disables copy and delete button in the toolbar
		 * */
		disableCopyDeleteButton : function() {
			if (this.byId("idCopyButton").getEnabled()) {
				this.byId("idCopyButton").setEnabled(false);
			}
			if (this.byId("idDeleteButton").getEnabled()) {
				this.byId("idDeleteButton").setEnabled(false);
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_setAddMenuText
		 * @description Sets text for all the menu items present in add menu fragment
		 * */
		_setAddMenuText : function() {
			sap.ui.core.Fragment.byId("idAddMenuFragment", "idNewConfig").setText(this.oCoreApi.getText("newConfiguration"));
			sap.ui.core.Fragment.byId("idAddMenuFragment", "idNewFacetFilter").setText(this.oCoreApi.getText("newFacetFilter"));
			sap.ui.core.Fragment.byId("idAddMenuFragment", "idNewCategory").setText(this.oCoreApi.getText("newCategory"));
			sap.ui.core.Fragment.byId("idAddMenuFragment", "idNewNavigationTarget").setText(this.oCoreApi.getText("newNavigationTarget"));
			sap.ui.core.Fragment.byId("idAddMenuFragment", "idStep").setText(this.oCoreApi.getText("step"));
			sap.ui.core.Fragment.byId("idAddMenuFragment", "idNewStep").setText(this.oCoreApi.getText("newStep"));
			sap.ui.core.Fragment.byId("idAddMenuFragment", "idExistingStep").setText(this.oCoreApi.getText("existingStep"));
			sap.ui.core.Fragment.byId("idAddMenuFragment", "idHierarchicalStep").setText(this.oCoreApi.getText("hierarchicalStep"));
			sap.ui.core.Fragment.byId("idAddMenuFragment", "idNewRepresentation").setText(this.oCoreApi.getText("newRepresentation"));
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_setExistingStepDialogText
		 * @description Sets text for all items present in existing step dialog fragment
		 * */
		_setExistingStepDialogText : function() {
			sap.ui.core.Fragment.byId("idExistingStepDialogFragment", "idExistingStepDialog").setTitle(this.oCoreApi.getText("existingStepDialogTitle"));
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_enableDisableAddMenuItems
		 * @param {Object} Context of the selected node
		 * @param {sap.ui.xmlfragment} Add menu fragment which contains all the menu items
		 * @description Enables and disables menu items in add menu fragment based on selected node object type
		 * */
		_enableDisableAddMenuItems : function(oSelectedTreeNodeDetails, addMenu) { // enable/disable the menu items in the add menu based on object type
			var sFilterOptionType;
			var aAddMenuItems = addMenu.getItems();
			var nodeObjectType, oMapNodeObjectType = {};
			if (this.oConfigListInstance.configEditor) {
				sFilterOptionType = Object.keys(this.oConfigListInstance.configEditor.getFilterOption())[0];
			}
			if (this.oConfigListInstance.configurationHandler.getList().length === 0 || oSelectedTreeNodeDetails === null) { //if there is no configuration initially
				nodeObjectType = "default"; //only the add configuration should be enabled
			} else {
				nodeObjectType = oSelectedTreeNodeDetails.nodeObjectType;
			}
			oMapNodeObjectType["default"] = 1;
			oMapNodeObjectType[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION] = 4;
			oMapNodeObjectType[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER] = 4;
			oMapNodeObjectType[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.SMARTFILTERBAR] = 4;
			oMapNodeObjectType[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY] = 5;
			oMapNodeObjectType[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP] = 6;
			oMapNodeObjectType[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION] = 6;
			oMapNodeObjectType[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET] = 4;
			aAddMenuItems.forEach(function(oMenuItem, index) {
				if (index < oMapNodeObjectType[nodeObjectType]) {
					oMenuItem.setEnabled(true);
					if (sFilterOptionType !== sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER && index === 1) {
						oMenuItem.setEnabled(false);
					}
				} else {
					oMenuItem.setEnabled(false);
				}
			});
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_handlePressAddButton
		 * @description Handler for add button in the toolbar
		 * */
		_handlePressAddButton : function(oEvent) { //handler for add button in the toolbar above tree control
			var oSubViewInstance;
			var oSelf = this, isMandatoryFilled = true;
			if (this.oConfigListInstance.getView().byId("idConfigDetailData").getContent().length >= 1) {
				oSubViewInstance = (typeof this.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController === "function") ? this.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController()
						: undefined;
			}
			//Remove Focus from the button
			oEvent.getSource().$().blur();
			//check if there is any unsaved change
			var oNavigationHandlerInstance = sap.apf.modeler.ui.utils.navigationHandler.getInstance();
			if (oSubViewInstance !== undefined) {
				isMandatoryFilled = typeof oSubViewInstance.getValidationState === "function" ? oSubViewInstance.getValidationState.call(oSubViewInstance) : true;
			}
			var copyConfigEditor = this.oConfigListInstance.configEditor ? jQuery.extend(true, {}, this.oConfigListInstance.configEditor) : undefined;
			this.oConfigListInstance.bIsSaved = copyConfigEditor ? copyConfigEditor.isSaved() : undefined;
			var isDirtyState = false;
			var oSelectedTreeNodeDetails = this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(this.oConfigListInstance.oTreeInstance.getSelection());
			var oAddButton = oEvent.getSource();
			var addAction = function() {
				if (!this.addMenu) { // create add menu only once    
					this.addMenu = new sap.ui.xmlfragment("idAddMenuFragment", "sap.apf.modeler.ui.fragment.addMenu", this); // enable/disable menu items has to be set to default (creating a new instance each time)
					this.getView().addDependent(this.addMenu);
					this._setAddMenuText();
				}
				var addButtonDock = sap.ui.core.Popup.Dock;
				this._enableDisableAddMenuItems(oSelectedTreeNodeDetails, this.addMenu); // enable/disable the menu items in the add button based on the object type
				this.addMenu.open(false, oAddButton, addButtonDock.BeginTop, addButtonDock.BeginBottom, oAddButton); // opens the menu right below the add button
			};
			if (!isMandatoryFilled) { //check mandatory state
				oNavigationHandlerInstance.throwMandatoryPopup(oSelf.oConfigListInstance, {
					yes : function() {
						var oParentNodeDetails = oSelf.oConfigListInstance.oTreeInstance.getParentNodeContext(oSelectedTreeNodeDetails);
						oSelf.oConfigListInstance.configEditor = oSelf.oConfigListInstance.configurationHandler.restoreMemorizedConfiguration(oParentNodeDetails.configId);
						if (oSelf.oConfigListInstance.bIsSaved === false && oSelf.oConfigListInstance.configEditor) {
							oSelf.oConfigListInstance.configEditor.setIsUnsaved();
						}
						var bNavState = oSelf.oConfigListInstance._navMandatoryResetState(oSelf.oConfigListInstance);
						if (!bNavState.isNewView) {
							addAction.call(oSelf);
						}
					}
				});
				isDirtyState = true;
			}
			if (!isDirtyState) { //if clean state proceed with add
				addAction.call(oSelf);
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_handlePressAddButton
		 * @description Handler for menu items of add button in the toolbar
		 * */
		_handleAddMenuItemPress : function(oEvent) {
			var aItems = this.addMenu.getItems();
			var oAddMenuSelectedItem = oEvent.getParameters("item");
			var sNodeObjectType;
			var oNodeObjectType = {
				"idAddMenuFragment--idNewFacetFilter" : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER,
				"idAddMenuFragment--idNewCategory" : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY,
				"idAddMenuFragment--idNewStep" : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP,
				"idAddMenuFragment--idHierarchicalStep" : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP,
				"idAddMenuFragment--idNewRepresentation" : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION,
				"idAddMenuFragment--idNewConfig" : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION,
				"idAddMenuFragment--idNewNavigationTarget" : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET,
				"default" : sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION
			};
			aItems.forEach(function(oItem) {
				if (oItem.getId() === oAddMenuSelectedItem.id) {
					sNodeObjectType = oNodeObjectType[oItem.getId()];
				} else if (oItem.getSubmenu()) {//In case of step submenu
					oItem.getSubmenu().getItems().forEach(function(oItem) {
						if (oItem.getId() === oAddMenuSelectedItem.id) {
							sNodeObjectType = oNodeObjectType[oItem.getId()];
						}
					});
				}
			});
			var bIsHierarchicalStep = false;
			if (oAddMenuSelectedItem.id === "idAddMenuFragment--idExistingStep") {
				this._handleAddExistingStepPress();
			} else if (oAddMenuSelectedItem.id !== "idAddMenuFragment--idStep" && sNodeObjectType !== undefined) {//In case of existing step, the existing step dialog is opened
				if (oAddMenuSelectedItem.id === "idAddMenuFragment--idHierarchicalStep") {
					bIsHierarchicalStep = true;
				}
				this.oConfigListInstance.oTreeInstance.addNodeInTree(sNodeObjectType, undefined, bIsHierarchicalStep);
			}
		},
		/**
		 * @private
		 * @function 
		 * @param {String} Copied configuration id #sCopiedConfigurationId
		 * @param {Object} New context of the copied node #newContextForCopiedNode
		 * @name sap.apf.modeler.ui.controller.toolbar#_copyConfiguration
		 * @description Copies the Configuration object
		 * */
		_copyConfiguration : function(sCopiedConfigurationId, newContextForCopiedNode) {
			var oCopiedConfig = this.oConfigListInstance.configurationHandler.getConfiguration(sCopiedConfigurationId);
			var oConfigDetails = {}, oContextFromModel;
			oConfigDetails.AnalyticalConfiguration = oCopiedConfig.AnalyticalConfiguration;
			oConfigDetails.name = "< " + oCopiedConfig.AnalyticalConfigurationName + " >";
			oConfigDetails.Application = oCopiedConfig.Application;
			oConfigDetails.type = sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION;
			oConfigDetails.bIsLoaded = false; //boolean to check the creation of tree structure set to false
			oConfigDetails.bToggleState = false; // Toggle state boolean attached with each new node
			oConfigDetails.isSelected = true;
			oConfigDetails.expanded = true;
			oConfigDetails.selectable = true;
			oConfigDetails.hasExpander = true;
			this.oConfigListInstance.oModel.getData().aConfigDetails.push(oConfigDetails);
			this.oConfigListInstance.oModel.updateBindings();
			oContextFromModel = this.oConfigListInstance.oTreeInstance.getModel().getContext(newContextForCopiedNode);
			this.oConfigListInstance.selectedNode = this.oConfigListInstance.oTreeInstance.getNodeByContext(oContextFromModel);
			this.oConfigListInstance.modelUpdateDeferred[this.oConfigListInstance.oModel.getData().aConfigDetails.length - 1] = new jQuery.Deferred();//Deferred object to wait until model is updated with navigation target texts
			var context = {
				appId : this.oConfigListInstance.appId,
				configId : sCopiedConfigurationId
			};
			sap.ui.core.UIComponent.getRouterFor(this.oConfigListInstance).navTo(oConfigDetails.type, context, true);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_handlePressCopyButton
		 * @description Handler for copy button in the toolbar
		 * */
		_handlePressCopyButton : function(oEvent) {// event handler for copy button press
			var deferred = jQuery.Deferred();
			var oSubViewInstance, indexOfConfig;
			var oSelf = this, isMandatoryFilled = true;
			if (this.oConfigListInstance.getView().byId("idConfigDetailData").getContent().length >= 1) {
				oSubViewInstance = (typeof this.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController === "function") ? this.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController()
						: undefined;
			}
			//Remove Focus from the button
			oEvent.getSource().$().blur();
			//check if there is any unsaved change
			var oNavigationHandlerInstance = sap.apf.modeler.ui.utils.navigationHandler.getInstance();
			if (oSubViewInstance !== undefined) {
				isMandatoryFilled = typeof oSubViewInstance.getValidationState === "function" ? oSubViewInstance.getValidationState.call(oSubViewInstance) : true;
			}
			var copyConfigEditor = this.oConfigListInstance.configEditor ? jQuery.extend(true, {}, this.oConfigListInstance.configEditor) : undefined;
			this.oConfigListInstance.bIsSaved = copyConfigEditor ? copyConfigEditor.isSaved() : undefined;
			var isDirtyState = false;
			var copyAction = function() {
				var oCopySelf = this;
				var aNewReps;
				var oSelectedTreeNodeDetails = this.oTreeInstance.getAPFTreeNodeContext(this.oTreeInstance.getSelection() || this.selectedNode);
				this.selectedNode = this.oTreeInstance.getSelection() || this.selectedNode;
				var oContextFromModel, newContextForCopiedNode, oldContextForSelectedNode, newIndexForNewNode, aOldContextForSelectedNode, indexOffacetFilter, indexOfCategory, indexOfNavTarget, indexOfStep, indexOfRep;
				oldContextForSelectedNode = oSelectedTreeNodeDetails.nodeContext;
				switch (oSelectedTreeNodeDetails.nodeObjectType) {
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER:
						var sFacetFilterLabel = this.oCoreApi.getText("copyOf") + "  " + oSelectedTreeNodeDetails.nodeTitle;
						var sCopiedFacetFilterId = this.configEditor.copyFacetFilter(oSelectedTreeNodeDetails.nodeAPFId);
						var oCopiedFacetFilter = this.configEditor.getFacetFilter(sCopiedFacetFilterId);
						var oTranslationFormatForFacetFilterLabel = sap.apf.modeler.ui.utils.TranslationFormatMap.FACETFILTER_LABEL;
						this.oTextPool.setTextAsPromise(sFacetFilterLabel, oTranslationFormatForFacetFilterLabel).done(function(sFacetFilterLabelId) {
							oCopiedFacetFilter.setLabelKey(sFacetFilterLabelId);
							aOldContextForSelectedNode = oldContextForSelectedNode.split("/");
							indexOfConfig = aOldContextForSelectedNode[2];
							indexOffacetFilter = aOldContextForSelectedNode[6];
							var oFacetFilterForTree = this.oModel.getData().aConfigDetails[indexOfConfig].configData[0].filters[indexOffacetFilter];
							oFacetFilterForTree.isSelected = false;
							var oCopiedFacetFilterForTree = jQuery.extend(true, {}, oFacetFilterForTree);
							oCopiedFacetFilterForTree.id = sCopiedFacetFilterId;
							oCopiedFacetFilterForTree.name = "< " + sFacetFilterLabel + " >";
							oCopiedFacetFilterForTree.isSelected = true;
							newIndexForNewNode = this.oModel.getData().aConfigDetails[indexOfConfig].configData[0].filters.length;
							this.oModel.getData().aConfigDetails[indexOfConfig].configData[0].filters.push(oCopiedFacetFilterForTree);
							aOldContextForSelectedNode[6] = newIndexForNewNode;
							newContextForCopiedNode = aOldContextForSelectedNode.join("/");
							updateTree();
						}.bind(this));
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY:
						var sCategoryLabel = this.oCoreApi.getText("copyOf") + "  " + oSelectedTreeNodeDetails.nodeTitle;
						var sCopiedCategoryId = this.configEditor.copyCategory(oSelectedTreeNodeDetails.nodeAPFId);
						var oTranslationFormatForCategoryLabel = sap.apf.modeler.ui.utils.TranslationFormatMap.CATEGORY_TITLE;
						this.oTextPool.setTextAsPromise(sCategoryLabel, oTranslationFormatForCategoryLabel).done(function(sCategoryLabelId) {
							var categoryObj = {
								labelKey : sCategoryLabelId
							};
							this.configEditor.setCategory(categoryObj, sCopiedCategoryId);
							aOldContextForSelectedNode = oldContextForSelectedNode.split("/");
							indexOfConfig = aOldContextForSelectedNode[2];
							indexOfCategory = aOldContextForSelectedNode[6];
							var aNewStepIds = [];
							var aSteps = this.configEditor.getSteps();
							aSteps.forEach(function(oStep) {
								if (oCopySelf.configEditor.getCategoriesForStep(oStep.getId())[0] === sCopiedCategoryId) {
									aNewStepIds.push(oStep.getId());
								}
							});
							var oCategoryForTree = this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfCategory];
							oCategoryForTree.isSelected = false;
							var oCopiedCategoryForTree = jQuery.extend(true, {}, oCategoryForTree);
							if (oCopiedCategoryForTree.steps) {
								for(var i = 0; i < oCopiedCategoryForTree.steps.length; i++) {
									oCopiedCategoryForTree.steps[i].id = aNewStepIds[i];
									var oNewStep = oCopySelf.configEditor.getStep(aNewStepIds[i]);
									aNewReps = oNewStep.getRepresentations();
									if (oCopiedCategoryForTree.steps[i].representations) {
										for(var j = 0; j < oCopiedCategoryForTree.steps[i].representations.length; j++) {
											oCopiedCategoryForTree.steps[i].representations[j].id = aNewReps[j].getId();
										}
									}
								}
							}
							oCopiedCategoryForTree.id = sCopiedCategoryId;
							oCopiedCategoryForTree.name = "< " + sCategoryLabel + " >";
							oCopiedCategoryForTree.isSelected = true;
							newIndexForNewNode = this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories.length;
							this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories.push(oCopiedCategoryForTree);
							aOldContextForSelectedNode[6] = newIndexForNewNode;
							newContextForCopiedNode = aOldContextForSelectedNode.join("/");
							updateTree();
						}.bind(this));
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET:
						var sNavTargetName = this.oCoreApi.getText("copyOf") + "  " + oSelectedTreeNodeDetails.nodeTitle;
						var sCopiedNavTargetId = this.configEditor.copyNavigationTarget(oSelectedTreeNodeDetails.nodeAPFId);
						aOldContextForSelectedNode = oldContextForSelectedNode.split("/");
						indexOfConfig = aOldContextForSelectedNode[2];
						indexOfNavTarget = aOldContextForSelectedNode[6];
						var oNavTargetForTree = this.oModel.getData().aConfigDetails[indexOfConfig].configData[2].navTargets[indexOfNavTarget];
						oNavTargetForTree.isSelected = false;
						var oCopiedNavTargetForTree = jQuery.extend(true, {}, oNavTargetForTree);
						oCopiedNavTargetForTree.id = sCopiedNavTargetId;
						oCopiedNavTargetForTree.name = "< " + sNavTargetName + " >";
						oCopiedNavTargetForTree.isSelected = true;
						newIndexForNewNode = this.oModel.getData().aConfigDetails[indexOfConfig].configData[2].navTargets.length;
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[2].navTargets.push(oCopiedNavTargetForTree);
						aOldContextForSelectedNode[6] = newIndexForNewNode;
						newContextForCopiedNode = aOldContextForSelectedNode.join("/");
						updateTree();
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP:
						var sStepTitle = this.oCoreApi.getText("copyOf") + "  " + oSelectedTreeNodeDetails.nodeTitle;
						var sCopiedStepId = this.configEditor.copyStep(oSelectedTreeNodeDetails.nodeAPFId);
						var aCategoriesForCopiedStep = this.configEditor.getCategoriesForStep(sCopiedStepId);
						var oCopiedStep = this.configEditor.getStep(sCopiedStepId);
						var oTranslationFormatForStepTitle = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_TITLE;
						this.oTextPool.setTextAsPromise(sStepTitle, oTranslationFormatForStepTitle).done(function(sStepTitleId) {
							var j;
							oCopiedStep.setTitleId(sStepTitleId);
							aOldContextForSelectedNode = oldContextForSelectedNode.split("/");
							indexOfConfig = aOldContextForSelectedNode[2];
							indexOfCategory = aOldContextForSelectedNode[6];
							indexOfStep = aOldContextForSelectedNode[8];
							var oStepForTree = this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfCategory].steps[indexOfStep];
							oStepForTree.isSelected = false;
							var oCopiedStepForTree = jQuery.extend(true, {}, oStepForTree);
							aNewReps = oCopiedStep.getRepresentations();
							oCopiedStepForTree.id = sCopiedStepId;
							oCopiedStepForTree.name = "< " + sStepTitle + " >";
							if (oCopiedStepForTree.representations) {
								for(j = 0; j < oCopiedStepForTree.representations.length; j++) {
									oCopiedStepForTree.representations[j].id = aNewReps[j].getId();
								}
							}
							newIndexForNewNode = this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfCategory].steps.length;
							aOldContextForSelectedNode[8] = newIndexForNewNode;
							newContextForCopiedNode = aOldContextForSelectedNode.join("/");
							for(var index = 0; index < aCategoriesForCopiedStep.length; index++) {
								var oStepInTree = jQuery.extend(true, {}, oCopiedStepForTree);
								var paramsForCategory = {
									arguments : {
										configId : oSelf.oConfigListInstance.configId,
										categoryId : aCategoriesForCopiedStep[index]
									}
								};
								var sPathForCopiedStep = oSelf.oConfigListInstance.getSPathFromURL(paramsForCategory).sPath.split("/");
								var categoryIndexForCopiedStep = sPathForCopiedStep[6];
								this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[categoryIndexForCopiedStep].steps.push(oStepInTree);
							}
							this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfCategory].steps[newIndexForNewNode].isSelected = true;
							updateTree();
						}.bind(this));
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION://pending for representations-TODO
						aOldContextForSelectedNode = oldContextForSelectedNode.split("/");
						indexOfConfig = aOldContextForSelectedNode[2];
						indexOfCategory = aOldContextForSelectedNode[6];
						indexOfStep = aOldContextForSelectedNode[8];
						indexOfRep = aOldContextForSelectedNode[10];
						var oParentStepIdForRep = this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfCategory].steps[indexOfStep].id;
						var oParentStep = this.configEditor.getStep(oParentStepIdForRep);
						var aCategoriesForParentStep = this.configEditor.getCategoriesForStep(oParentStepIdForRep);
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfCategory].steps[indexOfStep].representations[indexOfRep].isSelected = false;
						var oRepForTree = this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfCategory].steps[indexOfStep].representations[indexOfRep];
						var oCopiedRepForTree = jQuery.extend(true, {}, oRepForTree);
						var oCopiedRepId = oParentStep.copyRepresentation(oCopiedRepForTree.id);
						oCopiedRepForTree.id = oCopiedRepId;
						newIndexForNewNode = this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfCategory].steps[indexOfStep].representations.length;
						aOldContextForSelectedNode[10] = newIndexForNewNode;
						newContextForCopiedNode = aOldContextForSelectedNode.join("/");
						for(var categoryIndex = 0; categoryIndex < aCategoriesForParentStep.length; categoryIndex++) {
							var repInTree = jQuery.extend(true, {}, oCopiedRepForTree);
							var paramsForStep = {
								arguments : {
									configId : oSelf.oConfigListInstance.configId,
									categoryId : aCategoriesForParentStep[categoryIndex],
									stepId : oParentStepIdForRep
								}
							};
							var sPathForCopiedRep = oSelf.oConfigListInstance.getSPathFromURL(paramsForStep).sPath.split("/");
							var categoryIndexForCopiedRep = sPathForCopiedRep[6];
							var stepIndexForCopiedRep = sPathForCopiedRep[8];
							this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[categoryIndexForCopiedRep].steps[stepIndexForCopiedRep].representations.push(repInTree);
						}
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfCategory].steps[indexOfStep].representations[newIndexForNewNode].isSelected = true;
						updateTree();
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION:
						var sConfigTitle = this.oCoreApi.getText("copyOf") + "  " + oSelectedTreeNodeDetails.nodeTitle;
						aOldContextForSelectedNode = oldContextForSelectedNode.split("/");
						indexOfConfig = aOldContextForSelectedNode[2];
						var oConfig = this.oModel.getData().aConfigDetails[indexOfConfig];
						oConfig.isSelected = false;
						aOldContextForSelectedNode[2] = this.oModel.getData().aConfigDetails.length;
						newContextForCopiedNode = aOldContextForSelectedNode.join("/");
						this.configurationHandler.copyConfiguration(oSelectedTreeNodeDetails.nodeAPFId, function(sCopiedConfigurationId) {
							var configObj = {
								AnalyticalConfigurationName : sConfigTitle
							};
							var tempConfigId = oCopySelf.configurationHandler.setConfiguration(configObj, sCopiedConfigurationId);
							//sets the application title
							oCopySelf.configTitle = sConfigTitle;
							oCopySelf.configurationHandler.loadConfiguration(tempConfigId, function(configurationEditor) {
								var sConfigTitle = oCopySelf.configTitle;
								var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.APPLICATION_TITLE;
								oCopySelf.configurationHandler.getTextPool().setTextAsPromise(sConfigTitle, oTranslationFormat).done(function(sApplicationTitleId) {
									configurationEditor.setApplicationTitle(sApplicationTitleId);
								});
							});
							oSelf._copyConfiguration(sCopiedConfigurationId, newContextForCopiedNode);
						});
						break;
					default:
						break;
				}
				function updateTree(){
					oCopySelf.oModel.updateBindings();
					oContextFromModel = oCopySelf.oTreeInstance.getModel().getContext(newContextForCopiedNode);
					oCopySelf.selectedNode = oCopySelf.oTreeInstance.getNodeByContext(oContextFromModel);
					var selectedNodeDetails = oCopySelf.oTreeInstance.getAPFTreeNodeContext(oCopySelf.selectedNode);
					var oParentNodeDetails = oCopySelf.oTreeInstance.getParentNodeContext(selectedNodeDetails);
					oCopySelf.navigateToDifferntView(oParentNodeDetails, selectedNodeDetails);
					oCopySelf.configEditor.setIsUnsaved();
					deferred.resolve();
				}
			};
			//Disable the copy, export when no config is selected
			var disableBtnOnNoConfigSelected = function() {
				var noConfigSelected = new sap.m.Label().addStyleClass("noConfigSelected");
				noConfigSelected.setText(oSelf.oConfigListInstance.oCoreApi.getText("noConfigSelected"));
				noConfigSelected.placeAt(oSelf.oConfigListInstance.byId("idConfigDetailData"));
				oSelf.oConfigListInstance.toolbarController.disableCopyDeleteButton();
				oSelf.oConfigListInstance._enableDisableExportAndExecuteButton();
			};
			var onConfigSwitch;
			if (!isMandatoryFilled) { //check mandatory state
				oNavigationHandlerInstance.throwMandatoryPopup(oSelf.oConfigListInstance, {
					yes : function() {
						var oSelectedTreeNodeDetails = oSelf.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(oSelf.oConfigListInstance.oTreeInstance.getSelection());
						var oParentNodeDetails = oSelf.oConfigListInstance.oTreeInstance.getParentNodeContext(oSelectedTreeNodeDetails);
						oSelf.oConfigListInstance.bIsDifferntConfig = oSelf.oConfigListInstance.oTreeInstance.isConfigurationSwitched(oSelf.oConfigListInstance.oPreviousSelectedNode, oSelf.oConfigListInstance.selectedNode);
						oSelf.oConfigListInstance.configEditor = oSelf.oConfigListInstance.configurationHandler.restoreMemorizedConfiguration(oParentNodeDetails.configId);
						if (oSelf.oConfigListInstance.bIsSaved === false && oSelf.oConfigListInstance.configEditor) {
							oSelf.oConfigListInstance.configEditor.setIsUnsaved();
						}
						if (oSelf.oConfigListInstance.bIsDifferntConfig === false) {
							var oSubViewInstance = (typeof oSelf.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController === "function") ? oSelf.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0]
									.getController() : undefined;
							var isNewView = oSelf.oConfigListInstance._isNewSubView(oSubViewInstance.getView().getViewData().oParams);
							if (!isNewView) {
								copyAction.call(oSelf.oConfigListInstance);
								oSelf.oConfigListInstance._navHandleExpandDelete.call(oSelf.oConfigListInstance, oSelf.oConfigListInstance.oSelectedNodeDetails, oParentNodeDetails);
							} else {
								oSelf.oConfigListInstance.handleConfirmDeletion();
							}
						} else {
							var bNavState = oSelf.oConfigListInstance._navMandatoryResetState(oSelf.oConfigListInstance);
							if (!bNavState.isNewView) {
								if (bNavState.bIsSaved === false) {
									onConfigSwitch(oSelf.oConfigListInstance); //Throw loss of data pop up
								} else {
									copyAction.call(oSelf.oConfigListInstance);
								}
							}
						}
					}
				});
				isDirtyState = true;
			}
			var isSwitchConfig;
			if (oSubViewInstance.getView().getViewData().oParams.name === "configuration") {
				isSwitchConfig = true;
			}
			onConfigSwitch = function(context) {
				oNavigationHandlerInstance.throwLossOfDataPopup(context, {
					yes : function(saveEditor) {
						oSelf.oConfigListInstance._navSaveState(function() {
							saveEditor(function(id) {
								if (oSelf.oConfigListInstance.selectedNode) {
									var sBindingContext = oSelf.oConfigListInstance.selectedNode.getBindingContext().sPath;
									var aContextForSelectedNode = sBindingContext.split("/");
									var indexOfConfig = aContextForSelectedNode[2];
								}
								oSelf.oConfigListInstance.oModel.getData().aConfigDetails[indexOfConfig].AnalyticalConfiguration = oSelf.oConfigListInstance.configId;
								oSelf.oConfigListInstance.oModel.updateBindings();
								copyAction.call(oSelf.oConfigListInstance);
							});
						});
					},
					no : function() {
						var context = {
							appId : oSelf.oConfigListInstance.appId,
							configId : oSelf.oConfigListInstance.configId
						};
						var oSubViewInstance = (typeof oSelf.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController === "function") ? oSelf.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0]
								.getController() : undefined;
						var isSwitchConfig = (oSubViewInstance.getView().getViewData().oParams.name === "configuration") ? true : false;
						if (oSelf.oConfigListInstance.configId.indexOf(sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.ISNEWCONFIG) === 0) { //If new confiuration splice from model before navigating 
							oSelf.oConfigListInstance._navHandleExpandDelete.call(oSelf.oConfigListInstance, {}, context, isSwitchConfig);
							oSelf.oConfigListInstance.clearTitleAndBreadCrumb();
							oSelf.oConfigListInstance.byId("idConfigDetailData").removeAllContent(); //Remove All Previous Stacked Content from DOM
							disableBtnOnNoConfigSelected();
						} else {
							oSelf.oConfigListInstance._navConfigResetState(oSelf.oConfigListInstance, function() {
								copyAction.call(oSelf.oConfigListInstance);
							});
						}
					}
				});
			};
			//On check of saved state and mandatory field filled
			if (oSelf.oConfigListInstance.bIsSaved === false && isMandatoryFilled && isSwitchConfig) {
				onConfigSwitch(oSelf.oConfigListInstance); //Throw loss of data pop up
				isDirtyState = true;
			}
			if (!isDirtyState) { //if clean state then copy the node
				copyAction.call(oSelf.oConfigListInstance);
			}
			return deferred.promise();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_handlePressDeleteButton
		 * @description Handler for delete button in the toolbar
		 * */
		_handlePressDeleteButton : function(oEvent) { // handler for delete button in the toolbar above tree control
			var sDialogMessage;
			var oSelectedTreeNodeDetails = this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(this.oConfigListInstance.oTreeInstance.getSelection());
			var nodeTypeName = this.oCoreApi.getText(oSelectedTreeNodeDetails.nodeObjectType);
			//Remove Focus from the button
			oEvent.getSource().$().blur();
			if (oSelectedTreeNodeDetails.nodeObjectType === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP) {
				sDialogMessage = this.oCoreApi.getText("confirmStepDeletion", [ oSelectedTreeNodeDetails.nodeTitle ]);
			} else {
				sDialogMessage = this.oCoreApi.getText("confirmDeletion", [ nodeTypeName, oSelectedTreeNodeDetails.nodeTitle ]);
			}
			this._openDeleteConfirmationDialog(sDialogMessage);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_openDeleteConfirmationDialog
		 * @description Opens a confirmation dialog before deleting a node from the tree
		 * */
		_openDeleteConfirmationDialog : function(sDialogMessage) {
			var oSelf = this;
			var oContext = jQuery.extend(oSelf.oConfigListInstance, {
				closeDialog : oSelf.closeDialog.bind(oSelf)
			});
			if (!this.confirmationDialog) {
				this.confirmationDialog = sap.ui.xmlfragment("idConfigConfirmationDialogFragment", "sap.apf.modeler.ui.fragment.deleteConfirmationDialog", oContext);
				this.getView().addDependent(this.confirmationDialog);
				this._setConfirmationDialogText();
			}
			var confirmationMessageLabel = new sap.m.Label();
			confirmationMessageLabel.addStyleClass("dialogText");
			confirmationMessageLabel.setText(sDialogMessage);
			this.confirmationDialog.removeAllContent();
			this.confirmationDialog.addContent(confirmationMessageLabel); // add the confirmation message to the dialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.confirmationDialog);
			this.confirmationDialog.open();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#closeDialog
		 * @description Closes the delete confirmation dialog
		 * */
		closeDialog : function() {
			if (this.confirmationDialog && this.confirmationDialog.isOpen()) {
				this.confirmationDialog.close();
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_setConfirmationDialogText
		 * @description Sets text for the delete confirmation dialog
		 * */
		_setConfirmationDialogText : function() {
			sap.ui.core.Fragment.byId("idConfigConfirmationDialogFragment", "idDeleteConfirmation").setTitle(this.oCoreApi.getText("confirmation"));
			sap.ui.core.Fragment.byId("idConfigConfirmationDialogFragment", "idDeleteButton").setText(this.oCoreApi.getText("deleteButton"));
			sap.ui.core.Fragment.byId("idConfigConfirmationDialogFragment", "idCancelButtonDialog").setText(this.oCoreApi.getText("cancel"));
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_handlePressMoveUpButton
		 * @description Handler for move up button in the toolbar
		 * */
		_handlePressMoveUpButton : function() {//handler for moving an object of the tree one level up
			this.bIsDown = false;
			var selectedNode = this.oConfigListInstance.oTreeInstance.getSelection();
			if (selectedNode !== null) {
				var selectedNodeContext = this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(selectedNode);
				if (selectedNodeContext !== undefined) {
					this._moveUpOrDown(selectedNodeContext, this.bIsDown);
				}
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_handlePressMoveUpButton
		 * @description Handler for move down button in the toolbar
		 * */
		_handlePressMoveDownButton : function() {//handler for moving an object of the tree one level down
			this.bIsDown = true;
			var selectedNode = this.oConfigListInstance.oTreeInstance.getSelection();
			if (selectedNode !== null) {
				var selectedNodeContext = this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(selectedNode);
				if (selectedNodeContext !== undefined) {
					this._moveUpOrDown(selectedNodeContext, this.bIsDown);
				}
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_moveUpOrDown
		 * @param {Object} Selected node context
		 * @param {boolean} Boolean stating whether down button is pressed
		 * @description Moves the node up or down depending upon which button is pressed in the toolbar
		 * */
		_moveUpOrDown : function(selectedNodeContext, bIsDown) {
			var selectedNodeObjectType = selectedNodeContext.nodeObjectType;
			var selectedNodeId = selectedNodeContext.nodeAPFId;
			var nodeContext = selectedNodeContext.nodeContext;
			var configIndexInTree = nodeContext.split('/')[2];
			var aObjectArray, swapToIndex, oTemp1, oTemp2, len;
			var bSwap = false;
			var swapFromIndex = nodeContext.split('/')[nodeContext.split('/').length - 1];
			switch (selectedNodeObjectType) {
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER:
					aObjectArray = this.oConfigListInstance.oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters;
					len = aObjectArray.length;
					if (bIsDown) {
						if (parseInt(swapFromIndex, 10) !== (len - 1)) {
							this.oConfigListInstance.configEditor.moveFacetFilterUpOrDown(selectedNodeId, 1);
							swapToIndex = parseInt(swapFromIndex, 10) + 1;
							bSwap = true;
						}
					} else {
						if (parseInt(swapFromIndex, 10) !== 0) {
							this.oConfigListInstance.configEditor.moveFacetFilterUpOrDown(selectedNodeId, -1);
							swapToIndex = parseInt(swapFromIndex, 10) - 1;
							bSwap = true;
						}
					}
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY:
					aObjectArray = this.oConfigListInstance.oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories;
					len = aObjectArray.length;
					if (bIsDown) {
						if (parseInt(swapFromIndex, 10) !== (len - 1)) {
							this.oConfigListInstance.configEditor.moveCategoryUpOrDown(selectedNodeId, 1);
							swapToIndex = parseInt(swapFromIndex, 10) + 1;
							bSwap = true;
						}
					} else {
						if (parseInt(swapFromIndex, 10) !== 0) {
							this.oConfigListInstance.configEditor.moveCategoryUpOrDown(selectedNodeId, -1);
							swapToIndex = parseInt(swapFromIndex, 10) - 1;
							bSwap = true;
						}
					}
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET:
					aObjectArray = this.oConfigListInstance.oModel.getData().aConfigDetails[configIndexInTree].configData[2].navTargets;
					len = aObjectArray.length;
					if (bIsDown) {
						if (parseInt(swapFromIndex, 10) !== (len - 1)) {
							this.oConfigListInstance.configEditor.moveNavigationTargetUpOrDown(selectedNodeId, 1);
							swapToIndex = parseInt(swapFromIndex, 10) + 1;
							bSwap = true;
						}
					} else {
						if (parseInt(swapFromIndex, 10) !== 0) {
							this.oConfigListInstance.configEditor.moveNavigationTargetUpOrDown(selectedNodeId, -1);
							swapToIndex = parseInt(swapFromIndex, 10) - 1;
							bSwap = true;
						}
					}
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP:
					var categoryIndexInConfig = nodeContext.split('/')[6];
					var categoryInConfig = this.oConfigListInstance.oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig];
					aObjectArray = categoryInConfig.steps;
					len = aObjectArray.length;
					if (bIsDown) {
						if (parseInt(swapFromIndex, 10) !== (len - 1)) {
							this.oConfigListInstance.configEditor.moveCategoryStepAssignmentUpOrDown(categoryInConfig.id, selectedNodeId, 1);
							swapToIndex = parseInt(swapFromIndex, 10) + 1;
							bSwap = true;
						}
					} else {
						if (parseInt(swapFromIndex, 10) !== 0) {
							this.oConfigListInstance.configEditor.moveCategoryStepAssignmentUpOrDown(categoryInConfig.id, selectedNodeId, -1);
							swapToIndex = parseInt(swapFromIndex, 10) - 1;
							bSwap = true;
						}
					}
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION:
					var selectedStep = this.oConfigListInstance.oTreeInstance.getSelection();
					var selectedStepObj = sap.ui.getCore().byId(selectedStep.getId());
					var stepNode = selectedStepObj.getParent();
					var stepNodeId = this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(stepNode).nodeAPFId;
					var step = this.oConfigListInstance.configEditor.getStep(stepNodeId);
					categoryIndexInConfig = nodeContext.split('/')[6]; //get the category and step index
					var stepIndexInCategory = nodeContext.split('/')[8];
					aObjectArray = this.oConfigListInstance.oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].representations;
					len = aObjectArray.length;
					if (bIsDown) {
						if (parseInt(swapFromIndex, 10) !== (len - 1)) {
							step.moveRepresentationUpOrDown(selectedNodeId, 1);
							swapToIndex = parseInt(swapFromIndex, 10) + 1;
							bSwap = true;
						}
					} else {
						if (parseInt(swapFromIndex, 10) !== 0) {
							step.moveRepresentationUpOrDown(selectedNodeId, -1);
							swapToIndex = parseInt(swapFromIndex, 10) - 1;
							bSwap = true;
						}
					}
					break;
				default:
					break;
			}
			if (bSwap) {
				oTemp1 = aObjectArray[swapFromIndex];
				oTemp2 = aObjectArray[swapToIndex];
				aObjectArray[swapToIndex] = oTemp1;
				aObjectArray[swapFromIndex] = oTemp2;
				this.oConfigListInstance.oModel.updateBindings();
				this.oConfigListInstance.configEditor.setIsUnsaved();
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_handleAddExistingStepPress
		 * @description Handler for existing step menu item in the toolbar
		 * */
		_handleAddExistingStepPress : function() {
			var self = this;
			var selectedNodeDetails = this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(this.oConfigListInstance.oTreeInstance.getSelection());
			var categoryId = this.oConfigListInstance.oTreeInstance.getParentNodeContext(selectedNodeDetails).categoryId;
			var aStepsNotAssignedToCategoryIds = this.oConfigListInstance.configEditor.getStepsNotAssignedToCategory(categoryId);
			var sStepTitle;
			var aStepsNotAssignedToCategory = [];
			aStepsNotAssignedToCategoryIds.forEach(function(stepId) {
				var oStepNotAssignedToCategory = {};
				var oStep = self.oConfigListInstance.configEditor.getStep(stepId);
				sStepTitle = self.oConfigListInstance.oTextPool.get(oStep.getTitleId()).TextElementDescription;
				oStepNotAssignedToCategory.id = stepId;
				oStepNotAssignedToCategory.name = sStepTitle;
				aStepsNotAssignedToCategory.push(oStepNotAssignedToCategory);
			});
			var oModelDialog = new sap.ui.model.json.JSONModel({
				existingStepData : aStepsNotAssignedToCategory
			});
			if (!this.addExistingStepDialog) {
				this.addExistingStepDialog = sap.ui.xmlfragment("idExistingStepDialogFragment", "sap.apf.modeler.ui.fragment.existingStepDialog", this);
				this._setExistingStepDialogText();
			}
			this.getView().addDependent(this.addExistingStepDialog);
			this.addExistingStepDialog.setModel(oModelDialog);
			this.addExistingStepDialog.open();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_handleExistingStepDialogOK
		 * @description Handler for press of ok in the existing step dialog
		 * */
		_handleExistingStepDialogOK : function(oEvent) {
			var nodeObjectType = sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP;
			var selectedSteps = oEvent.getParameters("listItem").selectedItems;
			var noOfSteps = selectedSteps.length;
			var selectedNodeDetails = this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(this.oConfigListInstance.oTreeInstance.getSelection());
			var categoryId = this.oConfigListInstance.oTreeInstance.getParentNodeContext(selectedNodeDetails).categoryId;
			var aExistingStepsToBeAdded = [];
			for(var i = 0; i < noOfSteps; i++) {
				var sPathOfExistingStep = oEvent.getParameters("selectedItems").selectedContexts[i].sPath.split('/')[2];
				var oExistingStep = oEvent.getSource().getModel().getData().existingStepData[sPathOfExistingStep];
				var step = this.oConfigListInstance.configEditor.getStep(oExistingStep.id);
				this.oConfigListInstance.configEditor.addCategoryStepAssignment(categoryId, oExistingStep.id);
				var aRepresentations = step.getRepresentations();
				var noOfReps = aRepresentations.length;
				var aRepresentationsToBeAdded = [];
				for(var j = 0; j < noOfReps; j++) {
					var oRepresentation = {};
					oRepresentation.id = aRepresentations[j].getId();
					oRepresentation.name = aRepresentations[j].getRepresentationType();
					oRepresentation.icon = this._getRepresentationIcon(oRepresentation.name);
					aRepresentationsToBeAdded.push(oRepresentation);
				}
				var oStep = {};
				oStep.step = oExistingStep;
				oStep.representations = aRepresentationsToBeAdded;
				oStep.noOfReps = noOfReps;
				aExistingStepsToBeAdded.push(oStep);
			}
			if (noOfSteps !== 0) {
				var params = {
					noOfSteps : noOfSteps,
					aExistingStepsToBeAdded : aExistingStepsToBeAdded
				};
				this.oConfigListInstance.oTreeInstance.addNodeInTree(nodeObjectType, params);
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_getRepresentationIcon
		 * @description Returns teh representation icon for a representation type
		 * @param {String} Representation type
		 * @return {String} Picture or icon of the representation type
		 * */
		_getRepresentationIcon : function(sRepresentationName) {
			var icon;
			var oRepresentationTypes = this.oCoreApi.getRepresentationTypes();
			for(var index = 0; index < oRepresentationTypes.length; index++) {
				if (sRepresentationName === oRepresentationTypes[index].id) {
					icon = oRepresentationTypes[index].picture;
					break;
				}
			}
			return icon;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_handleExistingStepDialogSearch
		 * @description Handler for search in the existing step dialog
		 * */
		_handleExistingStepDialogSearch : function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([ oFilter ]);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.toolbar#_handleExistingStepDialogOK
		 * @description Handler for press of ok in the existing step dialog
		 * */
		_handleExistingStepDialogClose : function(oEvent) {
			if (this.addExistingStepDialog) {
				oEvent.getSource().getBinding("items").filter([]);
			}
		}
	});
}());