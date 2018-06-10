/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
(function() {
	'use strict';
	/* globals window */
	jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
	jQuery.sap.require('sap.apf.modeler.ui.utils.navigationHandler');
	jQuery.sap.require('sap.apf.modeler.ui.utils.helper');
	jQuery.sap.require('sap.apf.modeler.ui.utils.APFTree');
	jQuery.sap.require('sap.ui.core.util.File');
	sap.ui.controller("sap.apf.modeler.ui.controller.configurationList", {
		onInit : function() {
			var oComponent = this.getOwnerComponent();
			if (oComponent !== undefined) {
				this.oCoreApi = oComponent.oCoreApi;
				this._setDisplayText();
			}
			this._instantiateToolbarView();
			this._instantiateAPFTree();
			this._instantiateTitleAndBreadCrumbView();
			this._addConfigStyleClass();
			this.oModel = new sap.ui.model.json.JSONModel({
				aConfigDetails : []
			});
			this.getView().setModel(this.oModel);
			this.bProgramaticSelection = false;
			this.modelUpdateDeferred = {};//To contain a Deferred object for each configuration
			//Attach router pattern match injects respective sub views based on url route mapping
			sap.apf.modeler.ui.utils.APFRouter.patternMatch(this);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_instantiateToolbarView
		 * @description Instantiates and injects toolbar view in configurationList view
		 * */
		_instantiateToolbarView : function() {
			var toolbarView = new sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.toolbar",
				type : "XML",
				viewData : {
					oConfigListInstance : this
				}
			});
			this.toolbarController = toolbarView.getController();
			this.byId("idConfigMasterData").insertItem(toolbarView, 0);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_instantiateAPFTree
		 * @description Creates instance of custom APFTree control and calls property setters of custom APFTree control
		 * */
		_instantiateAPFTree : function() {
			this.oTreeInstance = this.byId("idConfigTree");
			this.oTreeInstance.setTranslationFunction(this.oCoreApi.getText);
			var sDefaultRepresentationType;
			if (this.oCoreApi.getRepresentationTypes()[0].metadata) {
				sDefaultRepresentationType = this.oCoreApi.getRepresentationTypes()[0].id;
			}
			this.oTreeInstance.setDefaultRepresentationType(sDefaultRepresentationType);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_instantiateTitleAndBreadCrumbView
		 * @description Instantiates and injects titleand BreadCrumb in configurationList view
		 * */
		_instantiateTitleAndBreadCrumbView : function() {
			this.oTitleBreadCrumbView = new sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.titleBreadCrumb",
				type : "XML",
				viewData : {
					getText : this.oCoreApi.getText
				}
			});
			this.oTitleBreadCrumbController = this.oTitleBreadCrumbView.getController();
			this.byId("idConfigDetail").insertItem(this.oTitleBreadCrumbView, 0);
			this.oBreadCrumb = this.oTitleBreadCrumbView.byId("IdBreadCrumb");
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#setConfigListMasterTitle
		 * @param {String} String that has to be set as the title on master content of configuration list view
		 * @description Setter to set title to the configuration list view master content
		 * */
		setConfigListMasterTitle : function(sTitle) {
			this.byId("idConfigTitleMaster").setText(this.oCoreApi.getText("configurationObjectTitle") + " : " + sTitle);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#onAfterRendering
		 * @description After rendering of the view sets height to the tree
		 * */
		onAfterRendering : function() {
			var self = this;
			this.oTreeInstance.onAfterRendering = function() {
				self._setHeightForTree();
			};
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_setHeightForTree
		 * @params {Object} Tree Instance
		 * @description Sets height to the tree
		 * */
		_setHeightForTree : function() {
			var oViewInstance = this;
			var oTreeInstance = this.oTreeInstance;
			var width = jQuery(oViewInstance.byId("idConfigMasterData").getDomRef()).width();
			var height = jQuery(window).height();
			var textContainer = 100; //Static Height for text container because the text gets rendered after AJAX request
			var toolBar = jQuery(oViewInstance.byId("idConfigMasterData").getItems()[0].getDomRef()).height();
			var header = jQuery(oViewInstance.byId("configPage").getDomRef()).find("header").height();
			var footer = jQuery(oViewInstance.byId("configPage").getDomRef()).find("footer").height();
			var offsetHeight;
			if (toolBar > 0) {//Fall back if rendered DOM element has height defined as 0 or undefined
				offsetHeight = textContainer + toolBar + header + footer;
			} else {
				offsetHeight = 205; //Setting constant calculated value(165 for header and 40 for footer)
			}
			//set initial height and width for config tree control
			oTreeInstance.setHeight(height - offsetHeight + "px");
			oTreeInstance.setWidth(width + "px");
			sap.apf.modeler.ui.utils.helper.onResize(function() {//on resize handle height and width accordingly by passing its parent dom reference
				width = jQuery(oViewInstance.byId("idConfigMasterData").getDomRef()).width();
				height = jQuery(oViewInstance.byId("configPage").getDomRef()).height();
				oTreeInstance.setHeight(height - offsetHeight + "px");
				oTreeInstance.setWidth(width + "px");
			});
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_setDisplayText
		 * @description Sets texts for page title and save,cancel,export button 
		 * */
		_setDisplayText : function() {
			this.byId("configPage").setTitle(this.oCoreApi.getText("configModelerTitle"));
			this.byId("idSavebutton").setText(this.oCoreApi.getText("save"));
			this.byId("idCancelbutton").setText(this.oCoreApi.getText("cancel"));
			this.byId("idExportbutton").setText(this.oCoreApi.getText("export"));
			this.byId("idExecuteButton").setText(this.oCoreApi.getText("execute"));
			this.byId("idAriaPropertyForBreadCrumb").setText(this.oCoreApi.getText("breadCrumbText"));
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_addConfigStyleClass
		 * @description Adds style class to the page title, master and detail area
		 * */
		_addConfigStyleClass : function() {
			this.getView().addStyleClass("sapUiSizeCompact");//For non touch devices- compact style class increases the information density on the screen by reducing control dimensions
			this.byId("idConfigTree").addStyleClass("configTree");
			this.byId("idConfigTitleMaster").addStyleClass("configTitle");
			this.byId("idConfigMasterData").addStyleClass("configMasterData");
			this.byId("idConfigDetailData").addStyleClass("configDetailData");
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_setSubViewContainerHeight
		 * @description Sets the height for the subview container
		 * @params Subview instance
		 * @returns Height of the subview container 
		 * */
		_setSubViewContainerHeight : function(oSubView) {
			var oSelf = this;
			var scrollContainer = oSubView.getContent()[0].getItems()[0];
			//height for the scroll container
			var height = jQuery(window).height();
			var textContainer = jQuery(this.byId("idConfigTitleMaster").getDomRef()).outerHeight() + jQuery(this.byId("idConfigTitleMaster").getDomRef()).offset().top + 25;//height and the offset of the layout which contains breadcrumb and title of detail view
			var toolBar = jQuery(this.byId("idConfigMasterData").getItems()[0].getDomRef()).height();
			var header = jQuery(this.byId("configPage").getDomRef()).find("header").height();
			var footer = jQuery(this.byId("configPage").getDomRef()).find("footer").height();
			var offsetHeight, offsetWidth;
			if (toolBar > 0) {//Fall back if rendered DOM element has height defined as 0 or undefined
				offsetHeight = textContainer + toolBar + header + footer;
			} else {
				offsetHeight = 265;//Setting constant calculated value(225 for header and 40 for footer)
			}
			var scrollContainerHeight = height - offsetHeight - 40 + "px";
			scrollContainer.setHeight(scrollContainerHeight);
			//width for the scroll container
			var detailPageWidth = jQuery(this.byId("idConfigDetailData").getDomRef()).width(); // width of config detail data page
			if (detailPageWidth > 0) {
				offsetWidth = jQuery(this.byId("idConfigMasterData").getDomRef()).offset().left; //offset for the page
			} else {
				detailPageWidth = 1015; // Calculated width for detail page
				offsetWidth = 15; //offset for the page
			}
			var setWidth = detailPageWidth - offsetWidth;
			var scrollContainerWidth = setWidth + "px";
			scrollContainer.setWidth(scrollContainerWidth);
			sap.apf.modeler.ui.utils.helper.onResize(function() {//on resize handle height and width accordingly by passing its parent dom reference
				//height for the scroll container
				height = jQuery(oSelf.byId("configPage").getDomRef()).height();
				scrollContainerHeight = height - offsetHeight + "px";
				scrollContainer.setHeight(scrollContainerHeight);
				//width for the scroll container
				detailPageWidth = jQuery(oSelf.byId("idConfigDetailData").getDomRef()).width();
				setWidth = detailPageWidth - offsetWidth;
				scrollContainerWidth = setWidth + "px";
				scrollContainer.setWidth(scrollContainerWidth);
			});
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_setSubView
		 * @param {Object} Subview instance 
		 * @description Sets the subview on navigation change 
		 * */
		_setSubView : function(oSubView) {
			this.oSubView = oSubView;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_getSubView
		 * @description Getter for current subview instance
		 * */
		_getSubView : function() {
			return this.oSubView;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#updateSubView
		 * @param {Object} URL context and a boolean isHierarchicalStep to check if the step is a hierarchy step
		 * @description Injects the appropriate subview instance based on URL context change  
		 * */
		updateSubView : function(oParams) {
			var self = this;
			var oPrevSubView = this._getSubView();
			var oDetailView = this.byId("idConfigDetailData");
			var oValidURLContext = this.getSPathFromURL(oParams);
			this.configurationHandler.memorizeConfiguration(oParams.arguments.configId);
			// Destroying the previous sub-view if it exists.
			if (oPrevSubView) {
				oPrevSubView.destroy();
			}
			if (oParams.arguments.configId.indexOf("newConfig") === 0) {
				this.modelUpdateDeferred[this.byId("idConfigTree").getModel().getData().aConfigDetails.length - 1] = new jQuery.Deferred();
			}
			//Load the respective views for corresponding pattern names
			var oSubView = new sap.ui.view({
				viewName : "sap.apf.modeler.ui.view." + oValidURLContext.objectType,
				type : "XML",
				viewData : {
					oParams : oParams, //URL Params
					oCoreApi : self.oCoreApi,
					updateConfigTree : self.updateConfigTree.bind(self),
					updateSelectedNode : self.updateSelectedNode.bind(self),
					updateTitleAndBreadCrumb : self.updateTitleAndBreadCrumb.bind(self),
					updateTree : self.updateTree.bind(self),
					oConfigurationHandler : self.configurationHandler,
					oApplicationHandler : self.applicationHandler,
					oConfigurationEditor : self.configEditor,
					getText : self.oCoreApi.getText,
					getEntityTypeMetadataAsPromise : self.oCoreApi.getEntityTypeMetadataAsPromise,//required by representation subview 
					getRepresentationTypes : self.oCoreApi.getRepresentationTypes,//required by representation subview 
					oFooter : self.byId("idFooterBarMain"),//representation subview requires footer to insert and remove button 
					createMessageObject : self.oCoreApi.createMessageObject,//navigation target subview - message object creation required for failed call to INTEROP
					putMessage : self.oCoreApi.putMessage,//navigation target subview - message object creation required for failed call to INTEROP,
					getAllAvailableSemanticObjects : self.oCoreApi.getAllAvailableSemanticObjects,//navigation target subview : For getting list of semantic objects available
					getSemanticActions : self.oCoreApi.getSemanticActions,//navigation target subview : For getting list of actions for a given semantic object
					getNavigationTargetName : self._getNavigationTargetName.bind(self),//Required by step sub view for getting the text of a navigation target
					setNavigationTargetName : self._setNavigationTargetName.bind(self),
					getCalatogServiceUri : self.oCoreApi.getCatalogServiceUri,
					oTitleBreadCrumbController : self.oTitleBreadCrumbController
				//Required by navigation target sub view for getting the text of a navigation target
				}
			});
			if (oParams.name !== "applicationList") {
				oDetailView.removeAllContent(); //Remove All Previous Stacked View Content
				oSubView.placeAt(oDetailView); //Inject the view
				this._setSubViewContainerHeight(oSubView);
				this._setSubView(oSubView); //Set the sub view instance
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#clearTitleAndBreadCrumb
		 * @description Clears title and breadCrumb from the detail page
		 * */
		clearTitleAndBreadCrumb : function() {
			this.oTitleBreadCrumbView.byId("IdFormTitle").setText("");
			this.oTitleBreadCrumbView.byId("IdBreadCrumb").destroyContent();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#createLinkForBreadCrumb
		 * @params {String} -sName -setting text for link
		 * @params {String} -sPath -helps to navigate to selected node using link
		 * @returns {sap.m.Link} -Link Control
		 * @description Creates link control for forming Bread Crumb
		 * */
		_createLinkForBreadCrumb : function(sName, id, sPath) {
			var oController = this;
			var oLink = new sap.m.Link({
				text : sName,
				id : oController.createId("linkId" + id),
				press : function() {
					oController._navigateToNode(sPath);
				}
			});
			oLink.addAriaDescribedBy(oController.byId("idAriaPropertyForBreadCrumb"));
			return oLink;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#createTextForBreadCrumb
		 * @params {String} -sValue -setting text for Text Control
		 * @returns {sap.m.Label} - Label Control
		 * @description Creates Label control for forming Bread Crumb
		 * */
		_createTextForBreadCrumb : function(sValue, id) {
			var oController = this;
			var oLabel = new sap.m.Label({
				id : oController.createId("textId" + id)
			});
			oLabel.addStyleClass("dialogText");
			oLabel.setText(sValue);
			return oLabel;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#createIconForBreadCrumb
		 * @returns {sap.m.Icon} - Icon Control
		 * @description Creates Icon control for forming Bread Crumb
		 * */
		_createIconForBreadCrumb : function() {
			var breadCrumbIcon = new sap.ui.core.Icon({
				src : "sap-icon://open-command-field"
			});
			breadCrumbIcon.addStyleClass("breadCrumbIcon");
			return breadCrumbIcon;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#navigateToNode
		 * @params {String} -sPath -node path
		 * @description Helps to navigate to selected node using link
		 * */
		_navigateToNode : function(sPath) {
			var oContextFromModel = this.oTreeInstance.getModel().getContext(sPath);
			var oNode = this.oTreeInstance.getNodeByContext(oContextFromModel);
			this.oTreeInstance.setSelection(oNode);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#getAllPossibleNodes
		 * @params {Object} -oParentNode -contains information about current node & parent node
		 * @returns [{Object}] - oNodeDetails -if in facet filter node
		 * [{
		 * configId : configurationId
		 * },
		 * {
		 *  configId : configurationId,
		 *	facetFilterId : facetFilterId
		 * }]
		 * @description Helps to get all possible node details in hierarchical format Ex:if selected node is representation can get details representation,step,
		 * category,configuration 
		 * */
		_getAllPossibleNodes : function(oParentNode) {
			var aNodeDetails = [];
			if (oParentNode.configId) {
				aNodeDetails.push({
					id : oParentNode.configId,
					name : oParentNode.configurationName,
					oParams : {
						arguments : {
							configId : oParentNode.configId
						}
					}
				});
			}
			if (oParentNode.facetFilterId) {
				aNodeDetails.push({
					id : oParentNode.facetFilterId,
					name : oParentNode.facetFilterName,
					oParams : {
						arguments : {
							configId : oParentNode.configId,
							facetFilterId : oParentNode.facetFilterId
						}
					}
				});
			}
			if (oParentNode.smartFilterId) {
				aNodeDetails.push({
					id : oParentNode.smartFilterId,
					name : oParentNode.smartFilterName,
					oParams : {
						arguments : {
							configId : oParentNode.configId,
							smartFilterId : oParentNode.smartFilterId
						}
					}
				});
			}
			if (oParentNode.categoryId) {
				aNodeDetails.push({
					id : oParentNode.categoryId,
					name : oParentNode.categoryName,
					oParams : {
						arguments : {
							configId : oParentNode.configId,
							categoryId : oParentNode.categoryId
						}
					}
				});
			}
			if (oParentNode.stepId) {
				aNodeDetails.push({
					id : oParentNode.stepId,
					name : oParentNode.stepName,
					oParams : {
						arguments : {
							configId : oParentNode.configId,
							categoryId : oParentNode.categoryId,
							stepId : oParentNode.stepId
						}
					}
				});
			}
			if (oParentNode.representationId) {
				aNodeDetails.push({
					id : oParentNode.representationId,
					name : oParentNode.representationName,
					oParams : {
						arguments : {
							configId : oParentNode.configId,
							categoryId : oParentNode.categoryId,
							stepId : oParentNode.stepId,
							representationId : oParentNode.representationId
						}
					}
				});
			}
			if (oParentNode.navTargetId) {
				aNodeDetails.push({
					id : oParentNode.navTargetId,
					name : oParentNode.navTargetName,
					oParams : {
						arguments : {
							configId : oParentNode.configId,
							navTargetId : oParentNode.navTargetId
						}
					}
				});
			}
			return aNodeDetails;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#breadCrumbCreation
		 * @params {Object} oSelectedNodes -gets all possible nodes 
		 * @params {String} -sType -Type of Node (configuration || facetFilter || step etc,.)
		 * @description Helps to create BreadCrumb using link & Text
		 * */
		_breadCrumbCreation : function(oSelectedNodes, sType) {
			for(var i = 0; i < oSelectedNodes.length; i++) {
				var sPath = this.getSPathFromURL(oSelectedNodes[i].oParams).sPath;
				var oLabel;
				if (i === 1) {
					oLabel = this._createTextForBreadCrumb(sType, i);
					this.oBreadCrumb.addContent(oLabel);
					var oIcon = this._createIconForBreadCrumb();
					this.oBreadCrumb.addContent(oIcon);
				}
				if (i !== oSelectedNodes.length - 1) {
					var oLink = this._createLinkForBreadCrumb(oSelectedNodes[i].name, i, sPath);
					this.oBreadCrumb.addContent(oLink);
					var oICon = this._createIconForBreadCrumb();
					this.oBreadCrumb.addContent(oICon);
				}
				if (i === oSelectedNodes.length - 1) {
					oLabel = this._createTextForBreadCrumb(oSelectedNodes[i].name, ++i);
					this.oBreadCrumb.addContent(oLabel);
				}
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#updateTitleAndBreadCrumb
		 * @param {String} Updated Title of the detail form
		 * @description Updates the title and breadcrumb of the detailpage
		 */
		updateTitleAndBreadCrumb : function(sTitle) {
			var sFormTitle;
			var oSelectedNode = this.oTreeInstance.getSelection();
			var oSelectedNodeContext = oSelectedNode ? this.oTreeInstance.getAPFTreeNodeContext(oSelectedNode) : undefined;
			var nodeObjectType = oSelectedNodeContext ? oSelectedNodeContext.nodeObjectType : undefined;
			var oParentNodeContext = oSelectedNodeContext ? this.oTreeInstance.getParentNodeContext(oSelectedNodeContext) : undefined;
			// Update title
			if (sTitle) { // Updated title of node on handlechange from the subview
				sFormTitle = sTitle;
			} else { // text of the node
				if (nodeObjectType) {
					var text = oSelectedNode.getText();
					sFormTitle = this.oCoreApi.getText(nodeObjectType) + ": " + text;
					if (nodeObjectType === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.SMARTFILTERBAR) {
						sFormTitle = text;
					}
				}
			}
			// Update BreadCrumb
			if (oParentNodeContext) {
				if (this.oBreadCrumb) {
					this.oBreadCrumb.destroyContent();
				}
				var oSelectedNodes = this._getAllPossibleNodes(oParentNodeContext);
				var sType;
				switch (nodeObjectType) { // based on the object type build the breadcrumb value
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION:
						this._breadCrumbCreation(oSelectedNodes);
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.SMARTFILTERBAR:
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER:
						sType = this.oCoreApi.getText("facetFilter");
						this._breadCrumbCreation(oSelectedNodes, sType);
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY:
						sType = this.oCoreApi.getText("category");
						this._breadCrumbCreation(oSelectedNodes, sType);
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP:
						sType = this.oCoreApi.getText("category");
						this._breadCrumbCreation(oSelectedNodes, sType);
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION:
						sType = this.oCoreApi.getText("category");
						this._breadCrumbCreation(oSelectedNodes, sType);
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET:
						sType = this.oCoreApi.getText("navigationTarget");
						this._breadCrumbCreation(oSelectedNodes, sType);
						break;
					default:
						break;
				}
			}
			if (nodeObjectType !== sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP) {
				this.oTitleBreadCrumbController.setTitleForDetailPage(sFormTitle);
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#setSelectionOnTree
		 * @param {String} Binding context of the node which has to be shown selected in the tree
		 * @description Sets selection on the tree
		 * */
		setSelectionOnTree : function(oValidURLContext) {
			if (oValidURLContext.objectType === "smartFilterBar") {
				this.toolbarController.disableCopyDeleteButton();
			} else {
				this.toolbarController.enableCopyDeleteButton();
			}
			this._enableDisableExportAndExecuteButton(true);
			this.oTreeInstance.setSelectionOnTree(oValidURLContext.sPath);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#removeSelectionOnTree
		 * @description Removes all selection from the tree
		 * */
		removeSelectionOnTree : function() {
			this.oTreeInstance.removeSelectionOnTree(this.selectedNode);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#updateConfigTree
		 * @param {Object} Contains old and new context of the node which has to be updated in the tree
		 * @description Updates the tree when a category assigned to a step is changed
		 * */
		updateConfigTree : function(objectContexts) {//Set of step contexts and categories of steps
			var oldSPath, newSPath, aOldContextForSelectedNode, indexOfConfig, indexOfCategory, indexOfNewCategory, indexOfStep, existingStep, existingStepId;
			var self = this;
			objectContexts.forEach(function(oStepContext) {//For each step context, the step shall be added or removed in the category based on the removeStep boolean
				var bStepExists;
				oldSPath = self.getSPathFromURL(oStepContext.oldContext).sPath;
				aOldContextForSelectedNode = oldSPath.split("/");
				indexOfConfig = aOldContextForSelectedNode[2];
				indexOfCategory = aOldContextForSelectedNode[6];
				indexOfStep = aOldContextForSelectedNode[8];
				existingStep = jQuery.extend(true, {}, self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfCategory].steps[indexOfStep]);
				existingStepId = existingStep.id;
				existingStep.isSelected = false;
				newSPath = self.getSPathFromURL(oStepContext.newContext).sPath;
				indexOfNewCategory = newSPath.split("/")[6];
				if (oStepContext.removeStep === undefined) {
					if (self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfNewCategory].steps) {
						self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfNewCategory].steps.forEach(function(step) {
							if (step.id === existingStepId) {
								bStepExists = true;
							}
						});
						if (bStepExists === undefined) {// If the step does not exist in the category it is added, else not added
							self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfNewCategory].steps.push(existingStep);
						}
					} else {//If there are no steps in the category, the step is added after creating the array steps
						self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfNewCategory].steps = [];
						self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfNewCategory].steps.push(existingStep);
					}
				} else if (oStepContext.removeStep === true) {// If the step exists in the category it is removed
					if (self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfNewCategory].steps) {
						self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfNewCategory].steps.forEach(function(step, index) {
							if (step.id === existingStepId) {
								var aStepsForCategory = self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfNewCategory].steps;
								aStepsForCategory.splice(index, 1);
								self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfNewCategory].steps = aStepsForCategory;
							}
						});
						if (oStepContext.changeCategory === true) {// If the step is being removed from the present category, prepare context of the next category in which the step is present
							var categoryChangeSPath = self.getSPathFromURL(oStepContext.categoryChangeContext).sPath;
							var categoryChangeSelectedNodeContext = categoryChangeSPath.split("/");
							indexOfConfig = categoryChangeSelectedNodeContext[2];
							var indexOfChangedCategory = categoryChangeSelectedNodeContext[6];
							var indexOfNewStep = categoryChangeSelectedNodeContext[8];
							self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfChangedCategory].steps[indexOfNewStep].isSelected = true;
							self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfChangedCategory].expanded = true;
						}
					}
				}
			});
			this.oModel.updateBindings(); // Update the tree to reflect deletion or addition
			var noOfObjects = objectContexts.length;
			if (objectContexts[noOfObjects - 1].changeCategory) {
				sap.ui.core.UIComponent.getRouterFor(this).navTo(objectContexts[noOfObjects - 1].oldContext.name, objectContexts[noOfObjects - 1].categoryChangeContext.arguments, true);//If the step is being removed from the present category,, navigate to the next category in which the step is present
			}
			this.configEditor.setIsUnsaved();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#updateSelectedNode
		 * @param {Object} Label name and id of the node to be updated
		 * @param {Object} applicationId and temporary configuration id
		 * @description Updates node in the tree whenever title of node is changed from any of the detail subviews
		 * */
		updateSelectedNode : function(params, context) {
			if (params) {
				if (this.oTreeInstance.getSelection()) {
					this.selectedNode = this.oTreeInstance.getSelection();
				}
				if (this.selectedNode) {
					if (params.name && this.selectedNode.getBindingContext() && this.selectedNode.getBindingContext().getObject()) { //update scenario
						this.selectedNode.getBindingContext().getObject().name = params.name;
						this.selectedNode.getBindingContext().getObject().isSelected = true;
						if (this.selectedNode.getBindingContext().getObject().type === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION
								|| this.selectedNode.getBindingContext().getObject().type === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET) {
							this.selectedNode.getBindingContext().getObject().icon = params.icon;
						}
						this.oModel.updateBindings();
					}
					if (params.id && this.selectedNode.getBindingContext().getObject().id) {//if new object then update APF id for this in binding
						this.selectedNode.getBindingContext().getObject().id = params.id;
						if (params.icon) { //read the icon for the configuration object if it is specified
							this.selectedNode.getBindingContext().getObject().icon = params.icon;
						}
						this.oModel.updateBindings();
					} else if (params.id && this.selectedNode.getBindingContext().getObject().AnalyticalConfiguration) {
						this.selectedNode.getBindingContext().getObject().AnalyticalConfiguration = params.id;
						this.selectedNode.getBindingContext().getObject().expanded = true;
					}
				}
				if ((this.selectedNode.getBindingContext().getObject().type === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION) && context) {
					sap.ui.core.UIComponent.getRouterFor(this).navTo(this.selectedNode.getBindingContext().getObject().type, context, true);
					// In new configuration scenario after a title is entered and config editor is available we update tree to show the smart filter bar node
					this.updateTree();
				}
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#createConfigList
		 * @description Loads only list of all configurations in the tree
		 * */
		createConfigList : function() {//Loads only a list of configurations in the tree
			var self = this;
			this.configList = this.configurationHandler.getList();
			this.configList.forEach(function(config, index) {
				var oConfigDetails = {};
				oConfigDetails.AnalyticalConfiguration = config.AnalyticalConfiguration;
				oConfigDetails.name = config.AnalyticalConfigurationName;
				oConfigDetails.Application = config.Application;
				oConfigDetails.type = sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION;
				oConfigDetails.bIsLoaded = false; //boolean to check the creation of tree structure set to false
				oConfigDetails.bToggleState = false; // Toggle state boolean attached with each new node
				oConfigDetails.isSelected = false;
				oConfigDetails.expanded = false;
				oConfigDetails.selectable = true;
				oConfigDetails.hasExpander = true;
				self.oModel.getData().aConfigDetails.push(oConfigDetails);
				self.modelUpdateDeferred[index] = new jQuery.Deferred();//Deferred object to wait until model is updated with navigation target texts
			});
			this.oModel.updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#showNoConfigSelectedText
		 * @description Displays 'No COnfiguration Selected' text in detail area in case of multiple configurations
		 * */
		showNoConfigSelectedText : function() {
			this.byId("idConfigDetailData").removeAllContent(); //Remove All Previous Stacked Content from DOM
			this.clearTitleAndBreadCrumb();
			var noConfigSelected = new sap.m.Label().addStyleClass("noConfigSelected");
			noConfigSelected.setText(this.oCoreApi.getText("noConfigSelected"));
			noConfigSelected.placeAt(this.byId("idConfigDetailData"));
			this.toolbarController.disableCopyDeleteButton();
			this._enableDisableExportAndExecuteButton(false);
			this.byId("idConfigDetail").setBusy(false);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#updateConfigListView
		 * @description In case of only one configuration loads it and sets as selected and in case of multiple configurations none is selected
		 * */
		updateConfigListView : function() {//In case of only one configuration; To load the configuration and set it as selected and In case of multiple configurations none selected
			this.selectedNode = this.oTreeInstance.getSelection();
			if (this.selectedNode === null) {//only case when first time coming from application list view otherwise there will always a node selected.
				if (this.configList.length > 1) { // if more than one configuration,show a message in detail area,no config selected
					this.showNoConfigSelectedText();
				} else { // If only one configuration, load the configuration and set selection and then expand the tree node by setting bExpand to true
					this.oModel.getData().aConfigDetails[0].isSelected = true;
					this.oModel.getData().aConfigDetails[0].expanded = true;
					this.configId = this.oModel.getData().aConfigDetails[0].AnalyticalConfiguration;
					this.oModel.updateBindings();
					var context = {
						appId : this.appId,
						configId : this.oModel.getData().aConfigDetails[0].AnalyticalConfiguration
					};
					this.selectedNode = this.oTreeInstance.getNodes()[0];
					this.toolbarController.enableCopyDeleteButton();
					this._enableDisableExportAndExecuteButton(true);
					sap.ui.core.UIComponent.getRouterFor(this).navTo(this.oModel.getData().aConfigDetails[0].type, context, true);
				}
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_getNodeData
		 * @params {Object} params - id's of ancestor node to traverse through
		 * @params {String} type - define the node type like category, step etc
		 * @returns {Object} 
		 * 	nodeData {
		 * 			  index : index position of the node, 
		 * 			  id : unique id of the node passed, 
		 * 			  data : spliced model data of the node 
		 * 			 }  
		 * @description Returns the data which are relevant to the passed node
		 * */
		_getNodeData : function(params, type) {
			var configs = this.oModel.getData().aConfigDetails;
			var nodeData = {};
			var getConfigurationData = function(id) { //Get the configuration index
				var node = {};
				var configId = id || this.configId;
				for(var i = 0; i < configs.length; i++) {
					if (configs[i].AnalyticalConfiguration === configId) {
						node.index = i;
						node.data = configs[i];
						node.id = configs[i].AnalyticalConfiguration;
						break;
					}
				}
				return node;
			};
			var getFilterData = function(id) { //Get the facetFilter index
				var indexOfConfig = getConfigurationData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION]).index;
				var node = {};
				for(var i = 0; i < configs[indexOfConfig].configData.length; i++) {
					if (configs[indexOfConfig].configData[i].filters instanceof Array) {
						node.indexConfigData = i;
						for(var j = 0; j < configs[indexOfConfig].configData[i].filters.length; j++) {
							if (configs[indexOfConfig].configData[i].filters[j].id === id) {
								node.index = j;
								node.data = configs[indexOfConfig].configData[i].filters[j];
								node.id = configs[indexOfConfig].configData[i].filters[j].id;
								node.filterNodeExpansion = configs[indexOfConfig].configData[i].expanded;
							}
						}
					}
				}
				return node;
			};
			var getCategoryData = function(id) { //Get the cateogry index
				var indexOfConfig = getConfigurationData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION]).index;
				var node = {};
				for(var i = 0; i < configs[indexOfConfig].configData.length; i++) {
					if (configs[indexOfConfig].configData[i].categories instanceof Array) {
						node.indexConfigData = i;
						for(var j = 0; j < configs[indexOfConfig].configData[i].categories.length; j++) {
							if (configs[indexOfConfig].configData[i].categories[j].id === id) {
								node.index = j;
								node.data = configs[indexOfConfig].configData[i].categories[j];
								node.id = configs[indexOfConfig].configData[i].categories[j].id;
								node.categoryExpansion = configs[indexOfConfig].configData[i].expanded;
							}
						}
					}
				}
				return node;
			};
			var getStepData = function(id) {//Get the step index
				var indexOfConfig = getConfigurationData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION]).index;
				var indexOfConfigData = getCategoryData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY]).indexConfigData;
				var indexOfCategory = getCategoryData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY]).index;
				var node = {};
				for(var i = 0; i < configs[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].steps.length; i++) {
					if (configs[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].steps[i].id === id) {
						node.index = i;
						node.data = configs[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].steps[i];
						node.id = configs[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].steps[i].id;
					}
				}
				return node;
			};
			var getRepresentationData = function(id) {//Get the representation index
				var indexOfConfig = getConfigurationData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION]).index;
				var indexOfConfigData = getCategoryData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY]).indexConfigData;
				var indexOfCategory = getCategoryData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY]).index;
				var indexOfStep = getStepData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP]).index;
				var node = {};
				if (configs[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].steps[indexOfStep]) {
					for(var i = 0; i < configs[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].steps[indexOfStep].representations.length; i++) {
						if (configs[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].steps[indexOfStep].representations[i].id === id) {
							node.index = i;
							node.data = configs[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].steps[indexOfStep].representations[i];
							node.id = configs[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].steps[indexOfStep].representations[i].id;
						}
					}
				}
				return node;
			};
			var getNavigationTargetData = function(id) { //Get the facetFilter index
				var indexOfConfig = getConfigurationData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION]).index;
				var node = {};
				for(var i = 0; i < configs[indexOfConfig].configData.length; i++) {
					if (configs[indexOfConfig].configData[i].navTargets instanceof Array) {
						node.indexConfigData = i;
						for(var j = 0; j < configs[indexOfConfig].configData[i].navTargets.length; j++) {
							if (configs[indexOfConfig].configData[i].navTargets[j].id === id) {
								node.index = j;
								node.data = configs[indexOfConfig].configData[i].navTargets[j];
								node.id = configs[indexOfConfig].configData[i].navTargets[j].id;
								node.nTExpansion = configs[indexOfConfig].configData[i].expanded;
							}
						}
					}
				}
				return node;
			};
			switch (type) {
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION:
					nodeData = getConfigurationData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION]);
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER:
					nodeData = getFilterData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER]);
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.SMARTFILTERBAR:
					nodeData = getFilterData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.SMARTFILTERBAR]);
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY:
					nodeData = getCategoryData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY]);
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP:
					nodeData = getStepData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP]);
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION:
					nodeData = getRepresentationData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION]);
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET:
					nodeData = getNavigationTargetData.call(this, params[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET]);
					break;
				default:
					break;
			}
			return nodeData;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_retainNodeState
		 * @params {String} params - comprise all the node id from its parent
		 * @params {String} type - define the node type like category, step etc
		 * @description Retains the expansion state from its previous model if it exists
		 * */
		_retainNodeState : function(params, type) {
			var configIndexInTree = this._getNodeData(params, sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION).index;
			//Check if the config editor is loaded else return empty object
			if (!this.oModel.getData().aConfigDetails[configIndexInTree].bIsLoaded) {
				return {};
			}
			var nodeData = this._getNodeData(params, type);
			//nodeData is empty then return empty object
			if (!nodeData.data) {
				return {};
			}
			return {
				expanded : nodeData.data.expanded,
				isSelected : nodeData.data.isSelected
			};
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#updateTree
		 * @description Prepare the model for tree with editor instance passed 
		 * it also retains the expansion and selection state if there is any
		 * existing model
		 * */
		updateTree : function() {
			var self = this;
			var categories = [], aFacetFilters = [], aFilters = [], oSmartFilter = {}, aNavigationTargets = [], aCategoryWithStepDetails = [], allCategoryInConfig = [], stepWithRepresentation = [], filterState, filterRootNode;
			this.oTextPool = this.configurationHandler.getTextPool();
			var oParams = {};
			oParams[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION] = this.configId;
			var configIndexInTree = self._getNodeData(oParams, sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION).index;
			var configId = this.configId;
			var bFilterNodeExpansionState = false;
			var bnTExpansionState = false;
			var bCategoryExpansionState = false;
			var sFilterOption = Object.keys(this.configEditor.getFilterOption())[0];
			categories = this.configEditor.getCategories();
			function findFilterStateAndRootNodeState() {
				if (self.oModel.getData().aConfigDetails[configIndexInTree].bIsLoaded) {
					filterRootNode = self._getNodeData(oParams, sFilterOption);
				}
				filterState = self._retainNodeState(oParams, sFilterOption);
			}
			function pushFilter(oIcon, oFilterObject) {
				var sNameOfObject = self.oCoreApi.getText("smartFilterBar");
				if (sFilterOption === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER) {
					sNameOfObject = self.oTextPool.get(oFilterObject.getLabelKey()) ? self.oTextPool.get(oFilterObject.getLabelKey()).TextElementDescription : oFilterObject.getLabelKey();
				}
				oParams[sFilterOption] = oFilterObject.getId();
				findFilterStateAndRootNodeState();
				aFilters.push({
					id : oFilterObject.getId(),
					name : sNameOfObject,
					type : sFilterOption,
					isSelected : filterState.isSelected || false,
					expanded : filterState.expanded || false,
					selectable : true,
					icon : oIcon
				});
			}
			if (sFilterOption === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.SMARTFILTERBAR) {
				oSmartFilter = this.configEditor.getSmartFilterBar();
				pushFilter("sap-icon://filter", oSmartFilter);
			} else if (sFilterOption === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER) {
				aFacetFilters = this.configEditor.getFacetFilters();
				aFacetFilters.forEach(function(oFacetFilter) {
					var oIconForFilter = oFacetFilter.isVisible() ? "sap-icon://filter" : "sap-icon://hide";
					pushFilter(oIconForFilter, oFacetFilter);
				});
			}
			if (filterRootNode && filterRootNode.filterNodeExpansion) {
				bFilterNodeExpansionState = true; //Overall Filter Node Expansion State
			}
			aNavigationTargets = this.configEditor.getNavigationTargets();
			var oRepnMetaData = this.oCoreApi.getRepresentationTypes();
			var oRepnIconMap = {};
			//Create Representation ID/Icon Map
			oRepnMetaData.forEach(function(o) {
				var sId = o.id;
				oRepnIconMap[sId] = o.picture;
			});
			categories.forEach(function(category) {
				oParams[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY] = category.getId();
				var oCategory = category;
				var sCategoryId = oCategory.getId();
				stepWithRepresentation = [];
				self.configEditor.getCategoryStepAssignments(sCategoryId).forEach(function(sStepId) {
					var oStep = self.configEditor.getStep(sStepId);
					oParams[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY] = sCategoryId;
					oParams[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP] = oStep.getId();
					var stepState = self._retainNodeState(oParams, sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP);
					var aRepresentations = oStep.getRepresentations();
					var aRepData = aRepresentations.map(function(oRepresentation) {
						oParams[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION] = oRepresentation.getId();
						var representationState = self._retainNodeState(oParams, sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION);
						return {
							id : oRepresentation.getId(),
							name : self.oCoreApi.getText(oRepresentation.getRepresentationType()),
							type : "representation",
							isSelected : representationState.isSelected || false,
							expanded : representationState.expanded || false,
							selectable : true,
							icon : oRepnIconMap[oRepresentation.getRepresentationType()]
						};
					});
					stepWithRepresentation.push({
						id : oStep.getId(),
						name : self.oTextPool.get(oStep.getTitleId()) ? self.oTextPool.get(oStep.getTitleId()).TextElementDescription : oStep.getTitleId(),
						type : "step",
						representations : aRepData,
						isSelected : stepState.isSelected || false,
						expanded : stepState.expanded || false,
						selectable : true,
						icon : oStep.getType() === "hierarchicalStep" ? "sap-icon://drill-down" : "sap-icon://step"
					});
				});
				var categoryState = self._retainNodeState(oParams, sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY);
				//Check if the config editor is loaded then check expansion state of root node 
				if (self.oModel.getData().aConfigDetails[configIndexInTree].bIsLoaded) {
					var categoryRootNode = self._getNodeData(oParams, sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY);
					if (categoryRootNode.categoryExpansion) {
						bCategoryExpansionState = true; //Overall Category Node Expansion State
					}
				}
				aCategoryWithStepDetails.push({
					id : category.getId(),
					name : self.oTextPool.get(category.labelKey) ? self.oTextPool.get(category.labelKey).TextElementDescription : category.labelKey,
					type : "category",
					steps : stepWithRepresentation,
					isSelected : categoryState.isSelected || false,
					expanded : categoryState.expanded || false,
					selectable : true,
					icon : "sap-icon://open-folder"
				});
			});
			allCategoryInConfig.push({
				filters : aFilters,
				name : self.oCoreApi.getText("facetFilters"),
				expanded : bFilterNodeExpansionState,
				selectable : false
			});
			allCategoryInConfig.push({
				categories : aCategoryWithStepDetails,
				name : self.oCoreApi.getText("categories"),
				expanded : bCategoryExpansionState,
				selectable : false
			});
			var aNavigationTarget = [];
			//Takes a list of semantic actions and the navigation target; Compares the action of navigation target with the list to find the description or text 
			var populateNavTargets = function(aSemanticActions, oNavigationTarget) {
				oParams[sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET] = oNavigationTarget.getId();
				var navigationTargetState = self._retainNodeState(oParams, sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET);
				//Check if the config editor is loaded then check expansion state of root node 
				if (self.oModel.getData().aConfigDetails[configIndexInTree].bIsLoaded) {
					var nTRootNode = self._getNodeData(oParams, sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET);
					if (nTRootNode.nTExpansion) {
						bnTExpansionState = true; //Overall Facet Filter Node Expansion State
					}
				}
				var i, navTargetName;
				for(i = 0; i < aSemanticActions.length; i++) {
					if (aSemanticActions[i].id === oNavigationTarget.getAction()) {
						navTargetName = aSemanticActions[i].text;
						break;
					}
				}
				if (oNavigationTarget.getTitleKey()) {
					navTargetName = self.configurationHandler.getTextPool().get(oNavigationTarget.getTitleKey()).TextElementDescription;
				}
				aNavigationTarget.push({
					id : oNavigationTarget.getId(),
					name : navTargetName || oNavigationTarget.getSemanticObject(),//Push the action description here, if action description not available use the semantic object
					type : "navigationTarget",
					isSelected : navigationTargetState.isSelected || false,
					expanded : navigationTargetState.expanded || false,
					selectable : true,
					icon : oNavigationTarget.isStepSpecific() ? "sap-icon://pushpin-off" : "sap-icon://overview-chart"
				});
			};
			var orderNavTargets = function() {
				var aNavTargetIds = aNavigationTargets.map(function(oNavTarget) {
					return oNavTarget.getId();
				});
				var oTemp = [];
				for(var i = 0; i < aNavTargetIds.length; i++) {
					for(var j = 0; j < aNavigationTarget.length; j++) {
						if (aNavTargetIds[i] === aNavigationTarget[j].id) {
							oTemp[i] = aNavigationTarget[j];
							break;
						}
					}
				}
				aNavigationTarget = oTemp;
			};
			var updateModel = function() {
				var oConfigDetails = {};
				oConfigDetails.configData = allCategoryInConfig;
				self.oModel.getData().aConfigDetails[configIndexInTree].bIsLoaded = true;// Configuration Loaded boolean for configuration is set to true
				var oTemp = self.oModel.getData().aConfigDetails[configIndexInTree];
				jQuery.extend(oTemp, oConfigDetails);
				self.oModel.getData().aConfigDetails[configIndexInTree] = oTemp;
				self.oModel.getData().aConfigDetails[configIndexInTree].name = self.configurationHandler.getConfiguration(configId).AnalyticalConfigurationName; // Update the title of configuration while updating the model
				for(var index = 0; index < self.oModel.getData().aConfigDetails.length; index++) {
					if (self.modelUpdateDeferred[index] && self.modelUpdateDeferred[index].state() === "pending" && aNavigationTargets.length === 0) {//Check the state of deferred associated with all configurations which do not have navigation targets
						self.modelUpdateDeferred[index].resolve(self.oModel.getData());//Resolve the deferred once model is updated
					}
				}
				if (oTemp.configData[2].navTargets.length > 0) {
					//Push the action descriptions of all the navigation targets in the configuration into the navigation target texts table
					self._setNavigationTargetName({
						configIndexInTree : configIndexInTree
					});
					self.modelUpdateDeferred[configIndexInTree].resolve(self.oModel.getData());//Resolve the deferred once model is updated
				}
				self.oModel.updateBindings();
			};
			aNavigationTargets.forEach(function(oNavigationTarget) {
				var oPromise = self.oCoreApi.getSemanticActions(oNavigationTarget.getSemanticObject());
				oPromise.then(function(aSemanticActions) {
					populateNavTargets(aSemanticActions.semanticActions, oNavigationTarget);
					if (aNavigationTarget.length === aNavigationTargets.length) {//Once all the navigation targets are populated push them into allCategoryInConfig
						orderNavTargets();
						if (allCategoryInConfig[2]) {
							allCategoryInConfig.splice(2, 2);//Remove the empty nav targets array
							allCategoryInConfig.push({
								navTargets : aNavigationTarget,
								name : self.oCoreApi.getText("navigationTargets"),
								expanded : bnTExpansionState,
								selectable : false
							});
							updateModel();//Update the model after nav targets are populated
							var currentUrlParams = sap.apf.modeler.ui.utils.APFRouter.params;
							if (currentUrlParams.name === "navigationTarget") {
								sap.apf.modeler.ui.utils.APFRouter.setCurrentSelectionState(currentUrlParams, self);
							}
						}
					}
				});
			});
			allCategoryInConfig.push({
				navTargets : aNavigationTarget,
				name : self.oCoreApi.getText("navigationTargets"),
				expanded : bnTExpansionState,
				selectable : false
			});
			updateModel();//Update the model before nav targets are populated
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_checkIfKeyExists
		 * @params {String} Key as navigation target ID 
		 * 		   {Integer} Index of the configuration in the tree
		 * @description Checks if the navigation target key exists in the given configuration index and return the index of the key in the table
		 * */
		_checkIfKeyExists : function(key, configIndexInTree) {
			var indexOfKey;
			if (this.navTargetTextsTable[configIndexInTree]) {
				this.navTargetTextsTable[configIndexInTree].texts.forEach(function(navTarget, index) {
					if (navTarget.key === key) {
						indexOfKey = index;
					}
				});
			}
			return indexOfKey;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_checkIfKeyExists
		 * @params {String} Key as navigation target ID 
		 * @description Checks if the navigation target key exists in the given configuration index and return the value of the key
		 * */
		_getNavigationTargetName : function(key) {
			var self = this;
			var value;
			var navTextDeferred = new jQuery.Deferred();//Deferred object to read texts from step controller
			var configIndexInTree = self.getSPathForConfig(self.configId).split('/')[2];
			if (this.modelUpdateDeferred[configIndexInTree] === undefined) {
				this.modelUpdateDeferred[configIndexInTree] = new jQuery.Deferred();
				this.modelUpdateDeferred[configIndexInTree].resolve(this.oModel.getData());
			}
			jQuery.when(this.modelUpdateDeferred[configIndexInTree]).done(function(model) {//Check if the model is updated with the help of the deferred and then search/return the text
				var indexOfKey = self._checkIfKeyExists(key, configIndexInTree);
				if (indexOfKey !== undefined) {
					value = self.navTargetTextsTable[configIndexInTree].texts[indexOfKey].value;
					navTextDeferred.resolve(value);//Resolve with value for the given key
				}
			});
			return navTextDeferred.promise();//Return a promise on the deferred
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_checkIfKeyExists
		 * @params {String} Key as navigation target ID 
		 * 		   {String} Text of the navigation target action
		 * @description Inserts the key value pair into the navigation target texts table
		 * Structure of navigation targets text table
		 * {
		 * 	"0" : {
		 * 			texts : []
		 * 		},
		 * 	"1" : { 
		 * 			texts : []
		 * 		},
		 * 	.
		 * 	.
		 * }
		 * */
		_setNavigationTargetName : function(params) {
			var configIndexInTree = params.configIndexInTree !== undefined ? params.configIndexInTree : this.getSPathForConfig(this.configId).split('/')[2];
			if (jQuery.isEmptyObject(this.navTargetTextsTable)) {//If the table is an empty object insert the object configDetails
				this.navTargetTextsTable = {};
			}
			if (!this.navTargetTextsTable[configIndexInTree]) {//If the configDetails for a particular config is empty insert the texts object
				this.navTargetTextsTable[configIndexInTree] = {
					texts : []
				};
			}
			if (params.key && params.value) {//Only key and value is passed, insert or update a single nav target key value pair
				var indexOfKey = this._checkIfKeyExists(params.key, configIndexInTree);
				if (indexOfKey === undefined) {
					var navTargetObj = {};
					navTargetObj.key = params.key;
					navTargetObj.value = params.value;
					this.navTargetTextsTable[configIndexInTree].texts.push(navTargetObj);
				} else {//If key is already available in the table, then overwrite the new value
					this.navTargetTextsTable[configIndexInTree].texts[indexOfKey].value = params.value;
				}
			} else {// From updateTree to update the texts of all navigation targets present in a configuration
				var navTargets = this.oModel.getData().aConfigDetails[configIndexInTree].configData[2].navTargets;
				for(var index = 0; index < navTargets.length; index++) {
					var navTargetTextsTableObj = {};
					navTargetTextsTableObj.key = navTargets[index].id;
					navTargetTextsTableObj.value = navTargets[index].name;
					this.navTargetTextsTable[params.configIndexInTree].texts.push(navTargetTextsTableObj);
				}
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_handleToggleTreeNode
		 * @description On expand stores the binding context of the nodes which could be used later to set the state of the tree
		 * */
		_handleToggleTreeNode : function(oEvent) { // on expand stores the binding context of the nodes which could be used later to set the state of the tree
			var self = this;
			var oCurrentNode = oEvent.getSource();
			var sPathOfCurrentNode = oCurrentNode.getBindingContext().sPath;
			var selectedObjectType = oCurrentNode.getBindingContext().getObject().type;
			if (selectedObjectType === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION) { //if configuration is expanded, the child nodes has to be expanded
				var configIndexInTree = sPathOfCurrentNode.split('/')[2];
				if (self.oModel.getData().aConfigDetails[configIndexInTree].bIsLoaded === true) { //If the tree structure has been created
					this.oModel.updateBindings(); //Update the tree 
				} else { // If the tree structure has not been created
					this.configurationHandler.loadConfiguration(this.oModel.getData().aConfigDetails[configIndexInTree].AnalyticalConfiguration, function(configurationEditor, messageObject) { // Sets the configEditor only once in case of existing configuration
						if (messageObject === undefined) {
							self.configEditor = configurationEditor;
							self.configId = self.oModel.getData().aConfigDetails[configIndexInTree].AnalyticalConfiguration;
							self.updateTree();
						}
					});
				}
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#getSPathForConfig
		 * @arams Configuration Id for which sPath has to be derieved
		 * @description Returns sPath of the selected configuration
		 * @returns {String} Returns sPath of the configuration node
		 * */
		getSPathForConfig : function(configId) {
			var sPath;
			this.oModel.getData().aConfigDetails.forEach(function(config, index) {
				if (config.AnalyticalConfiguration === configId) {
					sPath = "/aConfigDetails/" + index;
				}
			});
			return sPath;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#getSPathFromURL
		 * @arams URL context
		 * @description Returns a valid sPath from the URL context
		 * */
		getSPathFromURL : function(params) {
			var oValidURL = {
				sPath : undefined,
				objectType : undefined
			};
			var self = this;
			this.oModel.getData().aConfigDetails.forEach(function(config, index) {
				if (config.AnalyticalConfiguration === params.arguments.configId) {
					oValidURL.sPath = "/aConfigDetails/" + index;
					oValidURL.objectType = sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION;
					self.oModel.getData().aConfigDetails[index].expanded = true;
					if (params.arguments.categoryId !== undefined) {
						self.oModel.getData().aConfigDetails[index].configData[1].categories.forEach(function(category, categoryIndex) {
							if (category.id === params.arguments.categoryId) {
								oValidURL.sPath = oValidURL.sPath.concat("/configData/1/categories/" + categoryIndex);
								oValidURL.objectType = sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY;
								self.oModel.getData().aConfigDetails[index].configData[1].expanded = true;
								if (params.arguments.stepId !== undefined) {
									self.oModel.getData().aConfigDetails[index].configData[1].categories[categoryIndex].steps.forEach(function(step, stepIndex) {
										if (step.id === params.arguments.stepId) {
											oValidURL.sPath = oValidURL.sPath.concat("/steps/" + stepIndex);
											oValidURL.objectType = sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP;
											self.oModel.getData().aConfigDetails[index].configData[1].categories[categoryIndex].expanded = true;
											if (params.arguments.representationId !== undefined) {
												self.oModel.getData().aConfigDetails[index].configData[1].categories[categoryIndex].steps[stepIndex].representations.forEach(function(representation, representationIndex) {
													if (representation.id === params.arguments.representationId) {
														self.oModel.getData().aConfigDetails[index].configData[1].categories[categoryIndex].steps[stepIndex].expanded = true;
														oValidURL.sPath = oValidURL.sPath.concat("/representations/" + representationIndex);
														oValidURL.objectType = sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION;
													}
												});
											}
										}
									});
								}
							}
						});
					}
					if (params.arguments.facetFilterId !== undefined) {
						self.oModel.getData().aConfigDetails[index].configData[0].filters.forEach(function(facetFilter, facetFilterIndex) {
							if (facetFilter.id === params.arguments.facetFilterId) {
								oValidURL.sPath = oValidURL.sPath.concat("/configData/0/filters/" + facetFilterIndex);
								oValidURL.objectType = sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER;
								self.oModel.getData().aConfigDetails[index].configData[0].expanded = true;
							}
						});
					}
					if (params.arguments.smartFilterId !== undefined) {
						oValidURL.sPath = oValidURL.sPath.concat("/configData/0/filters/0");
						oValidURL.objectType = sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.SMARTFILTERBAR;
						self.oModel.getData().aConfigDetails[index].configData[0].expanded = true;
					}
					if (params.arguments.navTargetId !== undefined) {
						self.oModel.getData().aConfigDetails[index].configData[2].navTargets.forEach(function(navTarget, navTargetIndex) {
							if (navTarget.id === params.arguments.navTargetId) {
								oValidURL.sPath = oValidURL.sPath.concat("/configData/2/navTargets/" + navTargetIndex);
								oValidURL.objectType = sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET;
								self.oModel.getData().aConfigDetails[index].configData[2].expanded = true;
							}
						});
					}
				}
			});
			return oValidURL;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_navHandleExpandDelete
		 * @params {Object} node context
		 * @params {Object} Route params context
		 * @params {Boolean} Whether configuration is switched or not
		 * @description Set the expansion state of selected node + delete the new node or config
		 * */
		_navHandleExpandDelete : function(node, params, isSwitchConfig) {
			var self = this;
			this.selectedNode = this.oTreeInstance.getSelection();
			var configs = this.oModel.getData().aConfigDetails;
			var bIsDifferntConfig = isSwitchConfig || this.oTreeInstance.isConfigurationSwitched(this.oPreviousSelectedNode, this.selectedNode);
			var getConfigurationIndex = function(id) { //Get the configuration index
				var index;
				for(var i = 0; i < configs.length; i++) {
					if (configs[i].AnalyticalConfiguration === id) {
						index = i;
						break;
					}
				}
				return index;
			};
			var getFacetFilterIndex = function(id) { //Get the facetFilter index
				var indexOfConfig = getConfigurationIndex.call(this, params.configId);
				var indexConfig, indexFilter;
				for(var i = 0; i < configs[indexOfConfig].configData.length; i++) {
					if (configs[indexOfConfig].configData[i].filters instanceof Array) {
						indexConfig = i;
						for(var j = 0; j < configs[indexOfConfig].configData[i].filters.length; j++) {
							if (configs[indexOfConfig].configData[i].filters[j].id === id) {
								indexFilter = j;
								break;
							} else {
								indexFilter = j;
							}
						}
					}
				}
				return {
					indexConfig : indexConfig,
					indexFilter : indexFilter
				};
			};
			var getNavTargetIndex = function(id) { //Get the navigation Target index
				var indexOfConfig = getConfigurationIndex.call(this, params.configId);
				var indexConfig, indexNavTarget;
				for(var i = 0; i < configs[indexOfConfig].configData.length; i++) {
					if (configs[indexOfConfig].configData[i].navTargets instanceof Array) {
						indexConfig = i;
						for(var j = 0; j < configs[indexOfConfig].configData[i].navTargets.length; j++) {
							if (configs[indexOfConfig].configData[i].navTargets[j].id === id) {
								indexNavTarget = j;
								break;
							} else {
								indexNavTarget = j;
							}
						}
					}
				}
				return {
					indexConfig : indexConfig,
					indexNavTarget : indexNavTarget
				};
			};
			var getCategoryIndex = function(id) { //Get the category index
				var indexOfConfig = getConfigurationIndex.call(this, params.configId);
				var indexConfig, indexCategory;
				for(var i = 0; i < configs[indexOfConfig].configData.length; i++) {
					if (configs[indexOfConfig].configData[i].categories instanceof Array) {
						indexConfig = i;
						for(var j = 0; j < configs[indexOfConfig].configData[i].categories.length; j++) {
							if (configs[indexOfConfig].configData[i].categories[j].id === id) {
								indexCategory = j;
								break;
							} else {
								indexCategory = j;
							}
						}
					}
				}
				return {
					indexConfig : indexConfig,
					indexCategory : indexCategory
				};
			};
			var getStepIndex = function(id) {//Get the step index
				var indexOfConfig = getConfigurationIndex.call(this, params.configId);
				var indexOfConfigData = getCategoryIndex.call(this, params.categoryId).indexConfig;
				var indexOfCategory = getCategoryIndex.call(this, params.categoryId).indexCategory;
				var indexStep;
				for(var i = 0; i < configs[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].steps.length; i++) {
					if (configs[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].steps[i].id === id) {
						indexStep = i;
						break;
					} else {
						indexStep = i;
					}
				}
				return indexStep;
			};
			if (params.configId.indexOf(sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.ISNEWCONFIG) === 0 && bIsDifferntConfig) {
				this.configurationHandler.removeConfiguration(params.configId, function(id) {
					var aConfigForTree = self.oModel.getData().aConfigDetails;
					var indexOfConfig = getConfigurationIndex.call(self, params.configId);
					self._deleteConfigNavTargetTexts(indexOfConfig, aConfigForTree.length);//Remove the navigation target texts of the deleted configuration
					aConfigForTree.splice(indexOfConfig, 1);
					self.oModel.getData().aConfigDetails = aConfigForTree;
				});
			} else {
				var indexOfConfig, indexOfConfigData, indexOfFacetFilter, indexOfCategory, indexOfStep, indexOfNavTarget;
				switch (node.nodeObjectType) {
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION:
						indexOfConfig = getConfigurationIndex.call(this, params.configId);
						this.oModel.getData().aConfigDetails[indexOfConfig].isSelected = true;
						this.oModel.getData().aConfigDetails[indexOfConfig].expanded = true;
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER:
						indexOfConfig = getConfigurationIndex.call(this, params.configId);
						indexOfConfigData = getFacetFilterIndex.call(this, params.facetFilterId).indexConfig;
						indexOfFacetFilter = getFacetFilterIndex.call(this, params.facetFilterId).indexFilter;
						this.oModel.getData().aConfigDetails[indexOfConfig].expanded = true;
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[indexOfConfigData].expanded = true;
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[indexOfConfigData].filters[indexOfFacetFilter].expanded = true;
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY:
						indexOfConfig = getConfigurationIndex.call(this, params.configId);
						indexOfConfigData = getCategoryIndex.call(this, params.categoryId).indexConfig;
						indexOfCategory = getCategoryIndex.call(this, params.categoryId).indexCategory;
						this.oModel.getData().aConfigDetails[indexOfConfig].expanded = true;
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[indexOfConfigData].expanded = true;
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP:
						indexOfConfig = getConfigurationIndex.call(this, params.configId);
						indexOfConfigData = getCategoryIndex.call(this, params.categoryId).indexConfig;
						indexOfCategory = getCategoryIndex.call(this, params.categoryId).indexCategory;
						indexOfStep = getStepIndex.call(this, params.stepId);
						this.oModel.getData().aConfigDetails[indexOfConfig].expanded = true;
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[indexOfConfigData].expanded = true;
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].expanded = true;
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION:
						indexOfConfig = getConfigurationIndex.call(this, params.configId);
						indexOfConfigData = getCategoryIndex.call(this, params.categoryId).indexConfig;
						indexOfCategory = getCategoryIndex.call(this, params.categoryId).indexCategory;
						indexOfStep = getStepIndex.call(this, params.stepId);
						this.oModel.getData().aConfigDetails[indexOfConfig].expanded = true;
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[indexOfConfigData].expanded = true;
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].expanded = true;
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[indexOfConfigData].categories[indexOfCategory].steps[indexOfStep].expanded = true;
						break;
					case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET:
						indexOfConfig = getConfigurationIndex.call(this, params.configId);
						indexOfConfigData = getNavTargetIndex.call(this, params.navTargetId).indexConfig;
						indexOfNavTarget = getNavTargetIndex.call(this, params.navTargetId).indexNavTarget;
						this.oModel.getData().aConfigDetails[indexOfConfig].expanded = true;
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[indexOfConfigData].expanded = true;
						this.oModel.getData().aConfigDetails[indexOfConfig].configData[indexOfConfigData].navTargets[indexOfNavTarget].expanded = true;
						break;
					default:
						break;
				}
			}
			this.oModel.updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_isNewSubView
		 * @params {Object} Route context 
		 * @description Check whether the sub view is new or existing
		 * */
		_isNewSubView : function(params) {
			var isNew = false;
			if (params.arguments.configId.indexOf(sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.ISNEWCONFIG) === 0) { //Check the prefix apf1972- for new 
				isNew = true;
			} else {
				if (params.name === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION) {
					isNew = (this.configurationHandler.getConfiguration(params.arguments.configId) !== undefined) ? false : true;
				} else if (params.name === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY) {
					isNew = (this.configEditor.getCategory(params.arguments.categoryId) !== undefined) ? false : true;
				} else if (params.name === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER) {
					isNew = (this.configEditor.getFacetFilter(params.arguments.facetFilterId) !== undefined) ? false : true;
				} else if (params.name === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP) {
					isNew = (this.configEditor.getStep(params.arguments.stepId) !== undefined) ? false : true;
				} else if (params.name === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION) {
					isNew = (this.configEditor.getStep(params.arguments.stepId).getRepresentation(params.arguments.representationId) !== undefined) ? false : true;
				} else if (params.name === sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET) {
					isNew = (this.configEditor.getNavigationTarget(params.arguments.navTargetId) !== undefined) ? false : true;
				}
			}
			return isNew;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_getCurrentConfigurationNode
		 * @description Return the configuration tree node 
		 * */
		_getCurrentConfigurationNode : function() {
			var parentNodes = this.oTreeInstance.getNodes();
			var configId = this.configId;
			for(var i = 0; i < parentNodes.length; i++) {
				if (configId === parentNodes[i].getBindingContext().getObject().AnalyticalConfiguration) {
					return parentNodes[i];
				}
			}
			return undefined;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_navMandatoryResetState
		 * @params {Object} Configuration List instance
		 * @params {Function} Callback function to be executed once the configuration is reset
		 * @returns {Object} {
		 * 		isNewView : new view or not
		 * 		bIsSaved : Configuration is saved or not
		 * } 
		 * @description On mandatory state reset the configuration and prepare new tree structure
		 * */
		_navMandatoryResetState : function(context, callback) {
			var self = context;
			context.selectedNode = context.oTreeInstance.getSelection();
			self.bIsSaved = self.configEditor ? self.configEditor.isSaved() : undefined;
			var subViewInstance = (typeof self.byId("idConfigDetailData").getContent()[0].getController === "function") ? self.byId("idConfigDetailData").getContent()[0].getController() : undefined;
			context.configurationHandler.memorizeConfiguration(subViewInstance.getView().getViewData().oParams.arguments.configId);
			var isNewView = this._isNewSubView(subViewInstance.getView().getViewData().oParams);
			if (!isNewView) {
				self.updateTree();
				var selectedNode = self.selectedNode.getBindingContext().getObject();
				if (selectedNode) { // If node exists then set it to be selected else make the parent config node as selected cause the selected node has been deleted
					selectedNode.isSelected = true;
					var subViewName = subViewInstance.getView().getViewData().oParams.name;
					var configObjTypes = sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes;
					if (subViewName !== configObjTypes.REPRESENTATION) {
						subViewInstance.updateSubViewInstancesOnReset(self.configEditor);
					} else {
						subViewInstance.oConfigurationEditor = self.configEditor;
					}
					subViewInstance.setDetailData.call(subViewInstance);
					self.updateTitleAndBreadCrumb();
				} else {
					self.oTreeInstance.setSelection(self._getCurrentConfigurationNode());
				}
				if (typeof callback === "function") {
					callback();
				}
			} else {
				self.handleConfirmDeletion();
			}
			return {
				bIsSaved : self.bIsSaved,
				isNewView : isNewView
			};
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_navSaveState
		 * @param {Function} Callback to save the editor instance
		 * @description Save the editor instance
		 * */
		_navSaveState : function(saveEditor) {
			saveEditor();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_navConfigResetState
		 * @params {Object} configuration list instance
		 * @params {Function} Callback function once the configuration is reset
		 * @description Reset the configuration and delete the respective node if its new view
		 * */
		_navConfigResetState : function(context, callback) {
			var self = context;
			var subViewInstance = (typeof self.byId("idConfigDetailData").getContent()[0].getController === "function") ? self.byId("idConfigDetailData").getContent()[0].getController() : undefined;
			var isNewView = this._isNewSubView(subViewInstance.getView().getViewData().oParams);
			if (!isNewView) {
				self.configurationHandler.loadConfiguration(self.configId, function(configurationEditor, messageObject) {
					if (messageObject === undefined) {
						var subViewInstance = (typeof self.byId("idConfigDetailData").getContent()[0].getController === "function") ? self.byId("idConfigDetailData").getContent()[0].getController() : undefined;
						self.configEditor = configurationEditor;
						self.updateTree();
						var selectedNode = self.selectedNode.getBindingContext().getObject();
						if (selectedNode) { // If node exists then set it to be selected else make the parent config node as selected cause the selected node has been deleted
							selectedNode.isSelected = true;
							var subViewName = subViewInstance.getView().getViewData().oParams.name;
							var configObjTypes = sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes;
							if (subViewName !== configObjTypes.REPRESENTATION) {
								subViewInstance.updateSubViewInstancesOnReset(self.configEditor);
							} else {
								subViewInstance.oConfigurationEditor = self.configEditor;
							}
							subViewInstance.setDetailData.call(subViewInstance);
							self.updateTitleAndBreadCrumb();
						} else {
							self.oTreeInstance.setSelection(self._getCurrentConfigurationNode());
						}
						if (typeof callback === "function") {
							callback();
						}
					}
				});
			} else {
				self.handleConfirmDeletion();
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_onTreeNodeSelection
		 * @description On tree node selection performs action like navigate to view and performs checks for navigation scenarios
		 * */
		_onTreeNodeSelection : function(oEvent) {
			this.selectedNode = oEvent.getParameter("node");
			var self = this;
			var oPreviousNode, oPreviousNodeDetails, restoredConfigEditor;
			if (!this.bProgramaticSelection) {
				this.oPreviousSelectedNode = this.oTreeInstance.getSelection();
				this.bIsDifferntConfig = this.oTreeInstance.isConfigurationSwitched(this.oPreviousSelectedNode, this.selectedNode);
				this.oSelectedNodeDetails = this.oTreeInstance.getAPFTreeNodeContext(this.selectedNode);
				this.oParentNodeDetails = this.oTreeInstance.getParentNodeContext(this.oSelectedNodeDetails);
				this._enableDisableExportAndExecuteButton(true);
				var subViewInstance;
				if (this.byId("idConfigDetailData").getContent().length >= 1) {
					subViewInstance = (typeof this.byId("idConfigDetailData").getContent()[0].getController === "function") ? this.byId("idConfigDetailData").getContent()[0].getController() : undefined;
				}
				var currNodeId = this.selectedNode ? this.selectedNode.getId() : null;
				var prevNodeId = this.oPreviousSelectedNode ? this.oPreviousSelectedNode.getId() : null;
				//Set the selection back to the previous node 
				//Used on scenario of navigation switch back to 
				//previous node on cancel state
				var resetSelectionToPreviousNode = function() {
					var prevSelectedNode = self.oPreviousSelectedNode.getBindingContext().getObject();
					var selectedNode = self.selectedNode.getBindingContext().getObject();
					prevSelectedNode.isSelected = true;
					selectedNode.isSelected = false;
					self.oModel.updateBindings();
				};
				//If not the same node selected 
				if (currNodeId !== prevNodeId || this.bNavDeletionMode) {
					//check if there is any unsaved change
					var navigationHandlerInstance = sap.apf.modeler.ui.utils.navigationHandler.getInstance();
					var isMandatoryFilled;
					if (subViewInstance !== undefined) {
						isMandatoryFilled = typeof subViewInstance.getValidationState === "function" ? subViewInstance.getValidationState.call(subViewInstance) : true;
					} else {
						isMandatoryFilled = true;
					}
					var copyConfigEditor = this.configEditor ? jQuery.extend(true, {}, this.configEditor) : undefined;
					this.bIsSaved = copyConfigEditor ? copyConfigEditor.isSaved() : undefined;
					var onConfigSwitchState;
					var isDirtyState = false;
					var configList = this.configurationHandler.getList();
					if (!isMandatoryFilled && (configList.length > 0)) { //check mandatory state || if configuration list exists
						navigationHandlerInstance.throwMandatoryPopup(this, {
							yes : function() {
								var subViewInstance = (typeof self.byId("idConfigDetailData").getContent()[0].getController === "function") ? self.byId("idConfigDetailData").getContent()[0].getController() : undefined;
								var isNewView = self._isNewSubView(subViewInstance.getView().getViewData().oParams);
								if (!isNewView) {
									var yesAction = function(callback) {
										self.configEditor = self.configurationHandler.restoreMemorizedConfiguration(self.oParentNodeDetails.configId);
										if (self.bIsSaved === false && self.configEditor) {
											self.configEditor.setIsUnsaved();
										}
										if (typeof callback === "function") {
											callback();
										}
										self.updateTree();
										var selectedNode = self.selectedNode.getBindingContext().getObject();
										self.navigateToDifferntView(self.oParentNodeDetails, self.oSelectedNodeDetails);
										selectedNode.isSelected = true;
										self.oModel.updateBindings();
									};
									if (self.bIsSaved === false && self.bIsDifferntConfig) { //If it still dirty then call switch state dialog & different config
										onConfigSwitchState(false, function() {
											yesAction.call(self);
										});
									} else {
										yesAction.call(self);
									}
								} else {
									if (self.bIsSaved === false && self.bIsDifferntConfig) { //If it still dirty then call switch state dialog & different config
										onConfigSwitchState(false, function() {
											var selectContext = self.selectedNode.getBindingContext().sPath;
											var prevContext = self.oPreviousSelectedNode;
											self.handleConfirmDeletion(prevContext, selectContext);
										});
									} else {
										var selectContext = self.selectedNode.getBindingContext().sPath;
										var prevContext = self.oPreviousSelectedNode;
										self.handleConfirmDeletion(prevContext, selectContext);
									}
								}
								self._navHandleExpandDelete.call(self, self.oSelectedNodeDetails, self.oParentNodeDetails);
							},
							no : function() {
								resetSelectionToPreviousNode();
							}
						});
						isDirtyState = true;
					}
					//on configuration switch throw loss of data pop up 
					onConfigSwitchState = function(callback) {
						self.configurationHandler.memorizeConfiguration(subViewInstance.getView().getViewData().oParams.arguments.configId);
						navigationHandlerInstance.throwLossOfDataPopup(self, {
							yes : function(saveEditor) {
								if (typeof callback === "function") {
									callback(function() {
										saveEditor(function() {
											var indexOfConfig;
											if (self.oPreviousSelectedNode) {
												var sBindingContext = self.oPreviousSelectedNode.getBindingContext().sPath;
												var aContextForSelectedNode = sBindingContext.split("/");
												indexOfConfig = aContextForSelectedNode[2];
											}
											self.oModel.getData().aConfigDetails[indexOfConfig].AnalyticalConfiguration = self.configId;
										});
									});
								} else {
									if (self.oPreviousSelectedNode) {
										oPreviousNode = self.oTreeInstance.getAPFTreeNodeContext(self.oPreviousSelectedNode);
										oPreviousNodeDetails = self.oTreeInstance.getParentNodeContext(oPreviousNode);
										restoredConfigEditor = self.configurationHandler.restoreMemorizedConfiguration(oPreviousNodeDetails.configId);
										if (restoredConfigEditor) {
											self.configEditor = restoredConfigEditor;
										}
									}
									saveEditor(function() {
										var indexOfConfig;
										if (self.oPreviousSelectedNode) {
											var sBindingContext = self.oPreviousSelectedNode.getBindingContext().sPath;
											var aContextForSelectedNode = sBindingContext.split("/");
											indexOfConfig = aContextForSelectedNode[2];
										}
										self.oModel.getData().aConfigDetails[indexOfConfig].AnalyticalConfiguration = self.configId;
										var selectedNode = self.selectedNode.getBindingContext().getObject();
										self.navigateToDifferntView(self.oParentNodeDetails, self.oSelectedNodeDetails);
										selectedNode.isSelected = true;
										self.oModel.updateBindings();
									});
								}
							},
							no : function() {
								self.configurationHandler.loadConfiguration(self.configId, function(configurationEditor, messageObject) {
									if (messageObject === undefined) {
										self.configEditor = configurationEditor;
										if (self.configId.indexOf(sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.ISNEWCONFIG) === 0) { //If new confiuration splice from model before navigating 
											self._navHandleExpandDelete.call(self, {}, {
												configId : self.configId
											}, self.oParentNodeDetails);
										} else {
											self.updateTree();
										}
										self.navigateToDifferntView(self.oParentNodeDetails, self.oSelectedNodeDetails);
										self._navHandleExpandDelete.call(self, self.oSelectedNodeDetails, self.oParentNodeDetails);
									}
								});
							},
							cancel : function() {
								resetSelectionToPreviousNode();
							}
						});
					};
					//if unsaved state while switching throw loss of data pop up
					if (self.bIsSaved === false && self.bIsDifferntConfig && isMandatoryFilled) {
						onConfigSwitchState();
						isDirtyState = true;
					}
					if (!isDirtyState) {//In clean state navigate to respective node selected  
						if (this.oPreviousSelectedNode && this.oPreviousSelectedNode.getId() !== this.selectedNode.getId()) {
							var bPrevSelectedNode = this.oPreviousSelectedNode.getBindingContext().getObject();
							if (bPrevSelectedNode) {
								this.oPreviousSelectedNode.getBindingContext().getObject().isSelected = false;
								this.oPreviousSelectedNode.setIsSelected(false);
							}
						} else {
							this.selectedNode.getBindingContext().getObject().isSelected = true;
						}
						this.navigateToDifferntView(this.oParentNodeDetails, this.oSelectedNodeDetails, this.bIsSaved, this.bIsDifferntConfig);
					}
				}
			}
			this.bProgramaticSelection = false;//reset flag for programatic selection
			this.bNavDeletionMode = false; //to check navigation in delete mode
		},
		navigateToDifferntView : function(oParentNodeDetails, oSelectedNodeDetails, bIsSaved, bIsDifferntConfig) {
			if ((!jQuery.isEmptyObject(oParentNodeDetails) && (bIsSaved === undefined || bIsSaved)) || (!bIsDifferntConfig)) { //If context is not equal to empty traverse to view
				sap.ui.core.UIComponent.getRouterFor(this).navTo(oSelectedNodeDetails.nodeObjectType, oParentNodeDetails, true);
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_deleteConfigNavTargetTexts
		 * @description Remove the navigation target texts of the deleted configuration and deferred object associated
		 * @params {Integer} Index of configuration {Integer} Number of configurations in application
		 * */
		_deleteConfigNavTargetTexts : function(indexOfConfig, numberOfConfigs) {
			var self = this;
			var indexToDelete;
			for(var i = indexOfConfig; i < numberOfConfigs - 1; i++) {
				this.modelUpdateDeferred[i] = this.modelUpdateDeferred[i + 1];//Copy the deferred object to the preceding key
			}
			delete this.modelUpdateDeferred[numberOfConfigs - 1];//Delete the last deferred object
			if (this.navTargetTextsTable) {
				if (this.navTargetTextsTable[indexOfConfig]) {
					delete this.navTargetTextsTable[indexOfConfig];//Delete the nav targets text for the deleted configuration
				}
				if (indexOfConfig !== (numberOfConfigs - 1)) {//If the deleted configuration is not the last one then 
					//Find the keys which need to be updated and copied to preceding index
					Object.keys(this.navTargetTextsTable).forEach(function(key) {
						key = parseInt(key, 10);
						if (key > indexOfConfig) {
							self.navTargetTextsTable[key - 1] = self.navTargetTextsTable[key];
							indexToDelete = key;
						}
					});
					if (indexToDelete !== undefined) {
						delete this.navTargetTextsTable[indexToDelete];//Delete the excess key data
					}
				}
			}
		},
		handleConfirmDeletion : function(selectedNode, selectContext) { //event handler for confirmation dialog from delete button in the toolbar
			var selectedTreeNodeDetails = ((selectedNode === undefined) || (typeof selectedNode.preventDefault === "function")) ? this.oTreeInstance.getAPFTreeNodeContext(this.oTreeInstance.getSelection()) : this.oTreeInstance
					.getAPFTreeNodeContext(selectedNode);
			var self = this;
			this.selectedNode = this.oTreeInstance.getSelection();
			var oContextFromModel, newContextForCopiedNode, aNewContextForSelectedNode, aOldContextForSelectedNode, oldContextForSelectedNode, indexOfConfig, indexOffacetFilter, indexOfCategory, indexOfNavTarget, indexOfStep;
			oldContextForSelectedNode = selectedTreeNodeDetails.nodeContext;
			aOldContextForSelectedNode = oldContextForSelectedNode.split("/");
			indexOfConfig = aOldContextForSelectedNode[2];
			switch (selectedTreeNodeDetails.nodeObjectType) {
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.FACETFILTER:
					this.configEditor.removeFacetFilter(selectedTreeNodeDetails.nodeAPFId);
					indexOffacetFilter = aOldContextForSelectedNode[6];
					var aFacetFilterForTree = this.oModel.getData().aConfigDetails[indexOfConfig].configData[0].filters;
					aFacetFilterForTree.splice(indexOffacetFilter, 1);
					this.oModel.getData().aConfigDetails[indexOfConfig].configData[0].filters = aFacetFilterForTree;
					aNewContextForSelectedNode = aOldContextForSelectedNode.slice(0, 3);
					newContextForCopiedNode = aNewContextForSelectedNode.join("/");
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CATEGORY:
					this.configEditor.removeCategory(selectedTreeNodeDetails.nodeAPFId);
					indexOfCategory = aOldContextForSelectedNode[6];
					var aCategoryForTree = this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories;
					aCategoryForTree.splice(indexOfCategory, 1);
					this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories = aCategoryForTree;
					aNewContextForSelectedNode = aOldContextForSelectedNode.slice(0, 3);
					newContextForCopiedNode = aNewContextForSelectedNode.join("/");
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.NAVIGATIONTARGET:
					this.configEditor.removeNavigationTarget(selectedTreeNodeDetails.nodeAPFId);
					indexOfNavTarget = aOldContextForSelectedNode[6];
					var aNavTargetForTree = this.oModel.getData().aConfigDetails[indexOfConfig].configData[2].navTargets;
					aNavTargetForTree.splice(indexOfNavTarget, 1);
					this.oModel.getData().aConfigDetails[indexOfConfig].configData[2].navTargets = aNavTargetForTree;
					aNewContextForSelectedNode = aOldContextForSelectedNode.slice(0, 3);
					newContextForCopiedNode = aNewContextForSelectedNode.join("/");
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.STEP://Finds the step in all the categories it is present in and deletes it
					var aStepCategories = this.configEditor.getCategoriesForStep(selectedTreeNodeDetails.nodeAPFId);
					var aStepContext = selectedTreeNodeDetails.nodeContext.split("/");
					indexOfConfig = aStepContext[2];
					aStepCategories.forEach(function(stepCategoryId) {
						self.configEditor.removeCategoryStepAssignment(stepCategoryId, selectedTreeNodeDetails.nodeAPFId);
						self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories.forEach(function(category, categoryIndex) {
							if (category.id === stepCategoryId) {
								self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[categoryIndex].steps.forEach(function(step, stepIndex) {
									if (step.id === selectedTreeNodeDetails.nodeAPFId) {
										var aStepForTree = self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[categoryIndex].steps;
										aStepForTree.splice(stepIndex, 1);
										self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[categoryIndex].steps = aStepForTree;
									}
								});
							}
						});
					});
					aNewContextForSelectedNode = aOldContextForSelectedNode.slice(0, 7);
					newContextForCopiedNode = aNewContextForSelectedNode.join("/");
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.REPRESENTATION://Finds the representation in all the categories it is present in and deletes it
					indexOfCategory = aOldContextForSelectedNode[6];
					indexOfStep = aOldContextForSelectedNode[8];
					var oParentStepIdForRep = this.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[indexOfCategory].steps[indexOfStep].id;
					var oParentStep = this.configEditor.getStep(oParentStepIdForRep);
					var aParentStepCategories = this.configEditor.getCategoriesForStep(oParentStepIdForRep);
					oParentStep.removeRepresentation(selectedTreeNodeDetails.nodeAPFId);
					aParentStepCategories.forEach(function(stepCategoryId) {
						self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories.forEach(function(category, categoryIndex) {
							if (category.id === stepCategoryId) {
								self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[categoryIndex].steps.forEach(function(step, stepIndex) {
									if (step.id === oParentStepIdForRep) {
										self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[categoryIndex].steps[stepIndex].representations.forEach(function(representation, representationIndex) {
											if (representation.id === selectedTreeNodeDetails.nodeAPFId) {
												var aRepForTree = self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[categoryIndex].steps[stepIndex].representations;
												aRepForTree.splice(representationIndex, 1);
												self.oModel.getData().aConfigDetails[indexOfConfig].configData[1].categories[categoryIndex].steps[stepIndex].representations = aRepForTree;
											}
										});
									}
								});
							}
						});
					});
					aNewContextForSelectedNode = aOldContextForSelectedNode.slice(0, 9);
					newContextForCopiedNode = aNewContextForSelectedNode.join("/");
					break;
				case sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION:
					var isNew = false;
					if (selectedTreeNodeDetails.nodeAPFId.indexOf("newConfig") === 0) {
						isNew = true;
					}
					if (!isNew) {
						this.configurationHandler.removeConfiguration(selectedTreeNodeDetails.nodeAPFId, function(id) {
							var noConfigSelected;
							var aConfigForTree = self.oModel.getData().aConfigDetails;
							self._deleteConfigNavTargetTexts(parseInt(indexOfConfig, 10), aConfigForTree.length);//Remove the navigation target texts of the deleted configuration
							var configListExists = (self.configurationHandler.getList().length > 0) ? true : false;
							aConfigForTree.splice(indexOfConfig, 1);
							self.oModel.getData().aConfigDetails = aConfigForTree;
							self.oModel.updateBindings();
							if (selectContext) {
								var selectedNodeContext = self.oTreeInstance.getParentNodeContext(self.oTreeInstance.getAPFTreeNodeContext(self.selectedNode));
								sap.ui.core.UIComponent.getRouterFor(self).navTo(self.selectedNode.getBindingContext().getObject().type, selectedNodeContext, true);
							} else {
								self.clearTitleAndBreadCrumb();
								self.byId("idConfigDetailData").removeAllContent(); //Remove All Previous Stacked Content from DOM
								if (configListExists) {
									noConfigSelected = new sap.m.Label().addStyleClass("noConfigSelected");
									noConfigSelected.setText(self.oCoreApi.getText("noConfigSelected"));
									noConfigSelected.placeAt(self.byId("idConfigDetailData"));
									self.toolbarController.disableCopyDeleteButton();
									self._enableDisableExportAndExecuteButton(false);
								} else {
									noConfigSelected = new sap.m.Label().addStyleClass("addNewConfig");
									noConfigSelected.setText(self.oCoreApi.getText("addNewConfig"));
									noConfigSelected.placeAt(self.byId("idConfigDetailData"));
									self.toolbarController.disableCopyDeleteButton();
									self._enableDisableExportAndExecuteButton(false);
								}
							}
						});
					} else {
						var noConfigSelected;
						var aConfigForTree = self.oModel.getData().aConfigDetails;
						aConfigForTree.splice(indexOfConfig, 1);
						self.oModel.getData().aConfigDetails = aConfigForTree;
						self.oModel.updateBindings();
						if (selectContext) {
							var selectedNodeContext = self.oTreeInstance.getParentNodeContext(self.oTreeInstance.getAPFTreeNodeContext(self.selectedNode));
							sap.ui.core.UIComponent.getRouterFor(self).navTo(self.selectedNode.getBindingContext().getObject().type, selectedNodeContext, true);
						} else {
							self.clearTitleAndBreadCrumb();
							self.byId("idConfigDetailData").removeAllContent(); //Remove All Previous Stacked Content from DOM
							var configListExists = (this.configurationHandler.getList().length > 0) ? true : false;
							if (configListExists) {
								noConfigSelected = new sap.m.Label().addStyleClass("noConfigSelected");
								noConfigSelected.setText(self.oCoreApi.getText("noConfigSelected"));
								noConfigSelected.placeAt(self.byId("idConfigDetailData"));
								self.toolbarController.disableCopyDeleteButton();
								self._enableDisableExportAndExecuteButton(false);
							} else {
								noConfigSelected = new sap.m.Label().addStyleClass("addNewConfig");
								noConfigSelected.setText(self.oCoreApi.getText("addNewConfig"));
								noConfigSelected.placeAt(self.byId("idConfigDetailData"));
								self.toolbarController.disableCopyDeleteButton();
								self._enableDisableExportAndExecuteButton(false);
							}
						}
					}
					break;
				default:
					break;
			}
			if (selectContext) {
				this.bNavDeletionMode = true; //On deletion selected and previous node are same in order to bypass set this boolean
			}
			if (selectedTreeNodeDetails.nodeObjectType !== sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION) {
				this.configEditor.setIsUnsaved();
				this.clearTitleAndBreadCrumb();
				this.byId("idConfigDetailData").removeAllContent();
				newContextForCopiedNode = selectContext || newContextForCopiedNode;
				oContextFromModel = this.oTreeInstance.getModel().getContext(newContextForCopiedNode);
				this.oModel.updateBindings(); // Update the tree to reflect deletion
				this.selectedNode = this.oTreeInstance.getNodeByContext(oContextFromModel);
				this.bProgramaticSelection = false;
				this.oTreeInstance.setSelection(this.selectedNode);
				if (selectContext) {
					this.selectedNode.getBindingContext().getObject().isSelected = true; //On Nav make the selected node to be selected
					this.oModel.updateBindings(); // Update the tree to reflect deletion
				}
			}
			var confirmationDialog = (this.toolbarController.confirmationDialog === undefined) ? false : this.toolbarController.confirmationDialog.isOpen;
			if (confirmationDialog && !selectContext) {
				this.toolbarController.confirmationDialog.close();
			}
		},
		handleNavBack : function() {
			var subViewInstance;
			var self = this;
			if (this.byId("idConfigDetailData").getContent().length >= 1) {
				subViewInstance = (typeof this.byId("idConfigDetailData").getContent()[0].getController === "function") ? this.byId("idConfigDetailData").getContent()[0].getController() : undefined;
			}
			this.selectedNode = this.oTreeInstance.getSelection();
			this.oSelectedNodeDetails = this.oTreeInstance.getAPFTreeNodeContext(this.selectedNode);
			this.oParentNodeDetails = this.oTreeInstance.getParentNodeContext(this.oSelectedNodeDetails);
			//check if there is any unsaved change
			var navigationHandlerInstance = sap.apf.modeler.ui.utils.navigationHandler.getInstance();
			var isMandatoryFilled;
			if (subViewInstance !== undefined) {
				isMandatoryFilled = typeof subViewInstance.getValidationState === "function" ? subViewInstance.getValidationState.call(subViewInstance) : true;
			} else {
				isMandatoryFilled = true;
			}
			var copyConfigEditor = this.configEditor ? jQuery.extend(true, {}, this.configEditor) : undefined;
			this.bIsSaved = copyConfigEditor ? copyConfigEditor.isSaved() : undefined;
			var configListExists = (self.configurationHandler.getList().length > 0) ? true : false;
			var isDirtyState = false;
			var navAppList = function(context) {
				if (this.selectedNode) {//Clear the selectedNode
					this.selectedNode = null;
				}
				this.oModel = new sap.ui.model.json.JSONModel({
					aConfigDetails : []
				});
				this.getView().setModel(this.oModel);
				this.navTargetTextsTable = {};//Clear the cached navigation target texts
				window.history.go(-1);//Navigate back to the previous history set
			};
			if (configListExists) { //if config list exists then perform other checks
				if (!isMandatoryFilled) { //check mandatory state
					navigationHandlerInstance.throwMandatoryPopup(self, {
						yes : function() {
							self.configEditor = self.configurationHandler.restoreMemorizedConfiguration(subViewInstance.getView().getViewData().oParams.arguments.configId);
							if (self.bIsSaved === false && self.configEditor) {
								self.configEditor.setIsUnsaved();
							}
							var navState = self._navMandatoryResetState(self);
							var configList = self.configurationHandler.getList();
							if (navState.bIsSaved === false && configList.length > 0) {
								navigationHandlerInstance.throwLossOfDataPopup(self, {
									yes : function(saveEditor) {
										saveEditor();
										navAppList.call(self);
									},
									no : function() {
										self.configurationHandler.resetConfiguration(self.configId);
										if (self.configId.indexOf(sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.ISNEWCONFIG) === 0) { //If new confiuration splice from model before navigating 
											self._navHandleExpandDelete.call(self, {}, {
												configId : self.configId
											}, self.oParentNodeDetails);
										}
										navAppList.call(self);
									}
								});
							} else {
								navAppList.call(self);
							}
						}
					});
					isDirtyState = true;
				}
				var bSavedState = (self.bIsSaved === undefined) ? true : self.bIsSaved;
				//On check of saved state and mandatory field filled
				if (!bSavedState && isMandatoryFilled) {
					navigationHandlerInstance.throwLossOfDataPopup(self, {
						yes : function(saveEditor) {
							saveEditor();
							navAppList.call(self);
						},
						no : function() {
							self.configurationHandler.resetConfiguration(self.configId);
							if (self.configId.indexOf(sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.ISNEWCONFIG) === 0) { //If new confiuration splice from model before navigating 
								self._navHandleExpandDelete.call(self, {}, {
									configId : self.configId
								}, self.oParentNodeDetails);
							}
							navAppList.call(self);
						}
					});
					isDirtyState = true;
				}
			}
			if (!isDirtyState) { //In clean state proceed to app list view
				navAppList.call(self);
			}
		},
		handleSavePress : function() { //Need to be refactored currently comprises of logic to close delete dialog and navigate to different which defeats purpose of its use
			var subViewInstance, indexOfConfig;
			var self = this;
			this.selectedNode = this.oTreeInstance.getSelection();
			if (this.selectedNode) {
				var sBindingContext = this.selectedNode.getBindingContext().sPath;
				var aContextForSelectedNode = sBindingContext.split("/");
				indexOfConfig = aContextForSelectedNode[2];
			}
			if (this.byId("idConfigDetailData").getContent().length >= 1) {
				subViewInstance = (typeof this.byId("idConfigDetailData").getContent()[0].getController === "function") ? this.byId("idConfigDetailData").getContent()[0].getController() : undefined;
			}
			var saveAction = function() {
				var self = this;
				var oMessageObject;
				self.configEditor.save(function(id, metadata, messageObject) {
					if (messageObject === undefined) {
						self.configurationHandler.memorizeConfiguration(subViewInstance.getView().getViewData().oParams.arguments.configId);
						self.oModel.getData().aConfigDetails[indexOfConfig].AnalyticalConfiguration = id;
						self.oModel.updateBindings();
						self.oSelectedNodeDetails = self.oTreeInstance.getAPFTreeNodeContext(self.selectedNode);
						self.oParentNodeDetails = self.oTreeInstance.getParentNodeContext(self.oSelectedNodeDetails);
						self.navigateToDifferntView(self.oParentNodeDetails, self.oSelectedNodeDetails, true, false);
						oMessageObject = self.oCoreApi.createMessageObject({
							code : "11513"
						});
						self.oCoreApi.putMessage(oMessageObject);
					} else {
						oMessageObject = self.oCoreApi.createMessageObject({
							code : "11514"
						});
						self.oCoreApi.putMessage(oMessageObject);
					}
				});
			};
			//check if there is any unsaved change
			var navigationHandlerInstance = sap.apf.modeler.ui.utils.navigationHandler.getInstance();
			var isMandatoryFilled;
			if (subViewInstance !== undefined) {
				isMandatoryFilled = typeof subViewInstance.getValidationState === "function" ? subViewInstance.getValidationState.call(subViewInstance) : true;
			} else {
				isMandatoryFilled = true;
			}
			var copyConfigEditor = this.configEditor ? jQuery.extend(true, {}, this.configEditor) : undefined;
			this.bIsSaved = copyConfigEditor ? copyConfigEditor.isSaved() : undefined;
			var isDirtyState = false;
			if (!isMandatoryFilled) { //check mandatory state
				navigationHandlerInstance.throwMandatoryPopup(self, {
					yes : function() {
						self.configEditor = self.configurationHandler.restoreMemorizedConfiguration(subViewInstance.getView().getViewData().oParams.arguments.configId);
						if (self.bIsSaved === false && self.configEditor) {
							self.configEditor.setIsUnsaved();
						}
						self._navMandatoryResetState(self);
						saveAction.call(self);
					}
				});
				isDirtyState = true;
			}
			if (!isDirtyState) {
				saveAction.call(this);
				this.toolbarController.closeDialog();
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_handleExportButtonPress
		 * @description Handler for press of export button
		 * */
		_handleExportButtonPress : function() {
			var subViewInstance;
			if (this.byId("idConfigDetailData").getContent().length >= 1) {
				subViewInstance = (typeof this.byId("idConfigDetailData").getContent()[0].getController === "function") ? this.byId("idConfigDetailData").getContent()[0].getController() : undefined;
			}
			var exportAction = function() {
				if (!this.exportConfigurationDialog) {
					this.exportConfigurationDialog = sap.ui.xmlfragment("idExportConfigurationFragment", "sap.apf.modeler.ui.fragment.exportConfiguration", this);
					this.getView().addDependent(this.exportConfigurationDialog);
					this._setExportConfigDialogText();
					this._addStyleClassForExportDialog();
					this.configurationHandler.memorizeConfiguration(subViewInstance.getView().getViewData().oParams.arguments.configId);
				}
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.exportConfigurationDialog);
				this.exportConfigurationDialog.open();
			};
			this._performExportOrExecute(exportAction.bind(this));
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_enableDisableExportAndExecuteButton
		 * @description Enables export button
		 * */
		_enableDisableExportAndExecuteButton : function(bEnable) {
			this.byId("idExportbutton").setEnabled(bEnable);
			this.byId("idExecuteButton").setEnabled(bEnable);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_setExportConfigDialogText
		 * @description Sets text for export dialog
		 * */
		_setExportConfigDialogText : function() {
			sap.ui.core.Fragment.byId("idExportConfigurationFragment", "idExportConfigDialog").setTitle(this.oCoreApi.getText("exportConfig"));
			sap.ui.core.Fragment.byId("idExportConfigurationFragment", "idDownloadConfig").setText(this.oCoreApi.getText("downloadConfig"));
			sap.ui.core.Fragment.byId("idExportConfigurationFragment", "idDownloadTextProperty").setText(this.oCoreApi.getText("downloadTextProperty"));
			sap.ui.core.Fragment.byId("idExportConfigurationFragment", "idCloseButton").setText(this.oCoreApi.getText("close"));
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_addStyleClassForExportDialog
		 * @description Adds style class to the export configuration dialog
		 * */
		_addStyleClassForExportDialog : function() {
			sap.ui.core.Fragment.byId("idExportConfigurationFragment", "idDownloadConfig").addStyleClass("configLink");
			sap.ui.core.Fragment.byId("idExportConfigurationFragment", "idDownloadTextProperty").addStyleClass("textPropertyLink");
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_handleCloseOfExportDialog
		 * @description Handler for close of export configuration dialog
		 * */
		_handleCloseOfExportDialog : function() {
			if (this.exportConfigurationDialog.isOpen()) {
				this.exportConfigurationDialog.close();
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_handleOpenConfigLinkPress
		 * @description Handler for press of configuration link  in export dialog
		 * */
		_handleOpenConfigLinkPress : function() {
			this.configurationHandler.exportConfiguration(this.configId, function(configurationString, configurationName) {
				sap.ui.core.util.File.save(configurationString, configurationName, 'json', 'application/json', 'utf-8');
			});
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_handleCloseOfExportDialog
		 * @description Handler for press of text properties link  in export dialog
		 * */
		_handleOpenTextsLinkPress : function() {
			var configurationName = this.configurationHandler.getConfiguration(this.configId).AnalyticalConfigurationName;
			var exportedTexts = this.configurationHandler.exportTexts(this.configId);
			sap.ui.core.util.File.save(exportedTexts, configurationName, 'properties', 'text/plain', 'utf-8');
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.controller.configurationList#_openFile
		 * @description Opens contents of the file in a new read only popup window
		 * */
		_openFile : function(file) {
			var encodedData = encodeURIComponent(file);
			var newTab;
			newTab = window.open("about:blank", "", "_blank");
			newTab.document.write("<textarea rows='50' cols='160'readonly>" + decodeURIComponent(encodedData) + "</textarea>");
		},
		_performExportOrExecute : function(requiredAction) {
			var subViewInstance, onUnsavedState, navState, configListExists, sBindingContext, indexOfConfig, showText, aContextForSelectedNode;
			var isDirtyState = false;
			var isMandatoryFilled = true;
			var oController = this;
			oController.selectedNode = oController.oTreeInstance.getSelection();
			oController.oSelectedNodeDetails = oController.oTreeInstance.getAPFTreeNodeContext(oController.selectedNode);
			oController.oParentNodeDetails = oController.oTreeInstance.getParentNodeContext(oController.oSelectedNodeDetails);
			var navigationHandlerInstance = sap.apf.modeler.ui.utils.navigationHandler.getInstance();
			if (this.byId("idConfigDetailData").getContent().length >= 1) {
				subViewInstance = (typeof this.byId("idConfigDetailData").getContent()[0].getController === "function") ? this.byId("idConfigDetailData").getContent()[0].getController() : undefined;
			}
			//check if there is any unsaved change
			if (subViewInstance !== undefined) {
				isMandatoryFilled = typeof subViewInstance.getValidationState === "function" ? subViewInstance.getValidationState.call(subViewInstance) : true;
			}
			var copyConfigEditor = this.configEditor ? jQuery.extend(true, {}, this.configEditor) : undefined;
			this.bIsSaved = copyConfigEditor ? copyConfigEditor.isSaved() : undefined;
			var disableBtnOnNoConfigSelected = function(configListExists) {
				oController.byId("idConfigDetailData").removeAllContent();
				if (configListExists) {
					showText = new sap.m.Label().addStyleClass("noConfigSelected");
					showText.setText(oController.oCoreApi.getText("noConfigSelected"));
				} else {
					showText = new sap.m.Label().addStyleClass("addNewConfig");
					showText.setText(oController.oCoreApi.getText("addNewConfig"));
				}
				showText.placeAt(oController.byId("idConfigDetailData"));
				oController.toolbarController.disableCopyDeleteButton();
				oController._enableDisableExportAndExecuteButton(false);
			};
			if (!isMandatoryFilled) { //check mandatory state
				navigationHandlerInstance.throwMandatoryPopup(oController, {
					yes : function() {
						oController.configEditor = oController.configurationHandler.restoreMemorizedConfiguration(subViewInstance.getView().getViewData().oParams.arguments.configId);
						if (oController.bIsSaved === false && oController.configEditor) {
							oController.configEditor.setIsUnsaved();
						}
						navState = oController._navMandatoryResetState(oController);
						configListExists = (oController.configurationHandler.getList().length > 0) ? true : false;
						if (configListExists) {
							if (navState.bIsSaved === false) {
								onUnsavedState(); //Throw loss of data pop up
							} else {
								if (oController.oParentNodeDetails.configId.indexOf("newConfig") !== 0) {
									requiredAction();
								}
							}
						} else {
							disableBtnOnNoConfigSelected(configListExists);
						}
					}
				});
				isDirtyState = true;
			}
			onUnsavedState = function() {
				navigationHandlerInstance.throwLossOfDataPopup(oController, {
					yes : function(saveEditor) {
						oController._navSaveState(function() {
							saveEditor(function(id) {
								if (oController.selectedNode) {
									sBindingContext = oController.selectedNode.getBindingContext().sPath;
									aContextForSelectedNode = sBindingContext.split("/");
									indexOfConfig = aContextForSelectedNode[2];
								}
								oController.oModel.getData().aConfigDetails[indexOfConfig].AnalyticalConfiguration = oController.configId;
								oController.oModel.updateBindings();
								requiredAction();
							});
						});
					},
					no : function() {
						if (oController.configId.indexOf(sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.ISNEWCONFIG) === 0) { //If new confiuration splice from model before navigating 
							oController._navHandleExpandDelete.call(oController, {}, {
								configId : oController.configId
							}, oController.oParentNodeDetails);
							oController.clearTitleAndBreadCrumb();
							oController.byId("idConfigDetailData").removeAllContent(); //Remove All Previous Stacked Content from DOM
							configListExists = (oController.configurationHandler.getList().length > 0) ? true : false;
							disableBtnOnNoConfigSelected(configListExists);
						} else {
							oController._navConfigResetState(oController, function() {
								oController._navHandleExpandDelete.call(oController, oController.oSelectedNodeDetails, oController.oParentNodeDetails);
								requiredAction();
							});
						}
					}
				});
			};
			//On check of saved state and mandatory field filled
			if (oController.bIsSaved === false && isMandatoryFilled) {
				onUnsavedState();
				isDirtyState = true;
			}
			if (!isDirtyState) {//In clean state proceed to app list view
				requiredAction();
			}
		},
		handleExecuteButtonPress : function() {
			var oSelectedNode = this.oTreeInstance.getSelection();
			var executeConfiguration = function() {
				var oSelectedNodeDetails = this.oTreeInstance.getAPFTreeNodeContext(oSelectedNode);
				var oParentNodeDetails = this.oTreeInstance.getParentNodeContext(oSelectedNodeDetails);
				this.oCoreApi.navigateToGenericRuntime(oParentNodeDetails.appId, oParentNodeDetails.configId, window.open);
				this.configurationHandler.memorizeConfiguration(oParentNodeDetails.configId);
			};
			this._performExportOrExecute(executeConfiguration.bind(this));
		},
		/**
		 * @name sap.apf.modeler.ui.controller.configurationList#getStepConfigDataBysPath
		 * @param sPath - takes sPath of the step
		 * @description returns the details of the step to check if it is hierarchical (from APFRouter)
		 * */
		getStepConfigDataBysPath : function(sPath) {
			var aContextForSelectedNode = sPath.split("/");
			var indexOfConfig = aContextForSelectedNode[2], indexOfConfigObject = aContextForSelectedNode[4], indexOfCategory = aContextForSelectedNode[6], indexOfStep = aContextForSelectedNode[8];
			var oStepDataDetail = this.oModel.getData().aConfigDetails[indexOfConfig].configData[indexOfConfigObject].categories[indexOfCategory].steps[indexOfStep];
			return oStepDataDetail;
		}
	});
}());