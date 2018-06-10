jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");
jQuery.sap.require("sap.apf.modeler.ui.utils.viewValidator");
jQuery.sap.require('sap.apf.modeler.ui.utils.sortDataHandler');
jQuery.sap.require('sap.apf.modeler.ui.utils.stepPropertyMetadataHandler');
(function() {
	"use strict";
	var oParams, oTextReader, oConfigurationHandler, oConfigurationEditor, oTextPool, oGetNavigationTargetName, oStep, oViewValidatorForStep, oSortDataHandler, oCoreApi, bIsHierarchicalStep;
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	var optionsValueModelBuilder = new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();
	var oTranslationFormatForStepTitle = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_TITLE;
	var oTranslationFormatForStepLongTitle = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_LONG_TITLE;
	function _setDisplayText(oController) {
		oController.byId("idStepBasicData").setText(oTextReader("stepBasicData"));
		oController.byId("idStepTitleLabel").setText(oTextReader("stepTitle"));
		oController.byId("idStepTitle").setPlaceholder(oTextReader("newStep"));
		oController.byId("idStepLongTitleLabel").setText(oTextReader("stepLongTitle"));
		oController.byId("idStepLongTitle").setPlaceholder(oTextReader("stepLongTitle"));
		oController.byId("idCategoryTitleLabel").setText(oTextReader("categoryAssignments"));
		oController.byId("idGlobalLabel").setText(oTextReader("globalNavigationTarget"));
		oController.byId("idStepSpecificLabel").setText(oTextReader("stepSpecificNavTargets"));
		oController.byId("idDataRequest").setText(oTextReader("dataRequest"));
		oController.byId("idFilterMapping").setText(oTextReader("filterMap"));
		oController.byId("idFilterMapKeepSourceLabel").setText(oTextReader("filterMapKeepSource"));
		oController.byId("idNavigationTarget").setText(oTextReader("navigationTargetAssignments"));
		//Data Reduction labels
		oController.byId("idDataReduction").setText(oTextReader("dataReduction"));
		oController.byId("idDataReductionLabel").setText(oTextReader("dataReductionType"));
		oController.byId("idNoDataReduction").setText(oTextReader("noDataReduction"));
		oController.byId("idTopN").setText(oTextReader("topN"));
		oController.byId("idNumberOfRecordsLabel").setText(oTextReader("recordNumber"));
		oController.byId("idAriaPropertyForDataReduction").setText(oTextReader("dataReductionType"));
	}
	// Updates the title and bread crumb with new title
	function _updateBreadCrumbOnStepTitleChange(oController, sStepTitle) {
		var sFormTitle = oTextReader(bIsHierarchicalStep ? "hierarchicalStepTitle" : "step") + ": " + sStepTitle;
		oController.getView().getViewData().updateTitleAndBreadCrumb(sFormTitle);
		_setBreadCrumbTitle(oController, sStepTitle);
	}
	// Updates title based on step type
	function _setBreadCrumbTitle(oController, sStepTitle) {
		var sFormTitle = oTextReader(bIsHierarchicalStep ? "hierarchicalStepTitle" : "step") + ": " + sStepTitle;
		oController.getView().getViewData().oTitleBreadCrumbController.byId("IdFormTitle").setText(sFormTitle);
	}
	// Updates the tree node with ID of the new step created; If a label change is to be updated we pass new label and ID of step
	function _updateTreeNode(oController, sStepLabel) {
		var oStepInfo = {
			id : oStep.getId(),
			icon : oStep.getType() === "hierarchicalStep" ? "sap-icon://drill-down" : "sap-icon://step"
		};
		if (sStepLabel) {
			oStepInfo.name = sStepLabel;
		}
		oController.getView().getViewData().updateSelectedNode(oStepInfo);
	}
	// Called on initialization to create a new step or retrieve an existing step
	function _retrieveOrCreateStepObject(oController) {
		var sStepId, sCategoryId;
		if (oParams && oParams.arguments && oParams.arguments.stepId) { //saved step
			oStep = oConfigurationEditor.getStep(oParams.arguments.stepId);
			bIsHierarchicalStep = (oStep && oStep.getType() === "hierarchicalStep") ? true : false;
		}
		if (!nullObjectChecker.checkIsNotUndefined(oStep)) { //new step
			sCategoryId = oParams.arguments.categoryId;
			bIsHierarchicalStep = oParams.bIsHierarchicalStep;
			if (bIsHierarchicalStep) {
				sStepId = oConfigurationEditor.createHierarchicalStep(sCategoryId);
			} else {
				sStepId = oConfigurationEditor.createStep(sCategoryId);
			}
			oStep = oConfigurationEditor.getStep(sStepId);
			_updateTreeNode(oController);
		}
	}
	function _setVisibilityOfFilterMappingFields(oEvent) {
		var oController = this;
		var bIsVisible = oEvent.getParameter("bShowFilterMappingLayout");
		oController.byId("idStepFilterMappingVBox").setVisible(bIsVisible);
		oController.byId("idFilterMapKeepSourceLabel").setVisible(bIsVisible);
		oController.byId("idFilterKeepSourceCheckBox").setVisible(bIsVisible);
		if (!bIsVisible) {
			oController.byId("idFilterMapping").setText("");
			oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.RESETFILTERMAPPINGFIELDS);
		} else {
			oController.byId("idFilterMapping").setText(oTextReader("filterMap"));
		}
	}
	function _setVisibilityOfDataReductionSection(oController) {
		oController.byId("idDataReductionForm").setVisible(!bIsHierarchicalStep); // data reduction should not be visible for hierarchical step
	}
	function _createView(oController, oControllerName, oViewData, oViewName, sUniqueId) {
		sap.ui.view({
			viewName : oViewName,
			type : sap.ui.core.mvc.ViewType.XML,
			id : oController.createId(sUniqueId),
			viewData : oViewData,
			controller : oControllerName
		});
	}
	//Instantiates subviews like cornerText,stepRequest,stepFilterMapping views
	function _instantiateSubViews(oController) {
		var oViewData, stepCornerTextController, stepRequestController, stepFilterMappingController, stepCornerTextView, stepRequestView, stepFilterMappingView;
		oViewData = {
			oTextReader : oTextReader,
			oConfigurationEditor : oConfigurationEditor,
			oTextPool : oTextPool,
			oParentObject : oStep
		};
		//Instantiate corner text view
		stepCornerTextController = new sap.ui.controller("sap.apf.modeler.ui.controller.stepCornerTexts");
		_createView(oController, stepCornerTextController, oViewData, "sap.apf.modeler.ui.view.cornerTexts", "idStepCornerTextView");
		stepCornerTextView = oController.byId("idStepCornerTextView");
		oController.byId("idStepCornerTextVBox").insertItem(stepCornerTextView);
		//Add additional information to viewdata to instantiate request view and filter mapping view
		oViewData.oConfigurationHandler = oConfigurationHandler;
		oViewData.getCalatogServiceUri = oController.getView().getViewData().getCalatogServiceUri;
		//Instantiate Request View
		if (bIsHierarchicalStep) {
			stepRequestController = new sap.ui.controller("sap.apf.modeler.ui.controller.hierarchicalStepRequest");
		} else {
			stepRequestController = new sap.ui.controller("sap.apf.modeler.ui.controller.stepRequest");
		}
		_createView(oController, stepRequestController, oViewData, "sap.apf.modeler.ui.view.requestOptions", "idStepRequestView");
		stepRequestView = oController.byId("idStepRequestView");
		oController.byId("idStepRequestVBox").insertItem(stepRequestView);
		//Instantiate filter mapping view 
		stepFilterMappingController = new sap.ui.controller("sap.apf.modeler.ui.controller.stepFilterMapping");
		_createView(oController, stepFilterMappingController, oViewData, "sap.apf.modeler.ui.view.requestOptions", "idStepFilterMappingView");
		stepFilterMappingView = oController.byId("idStepFilterMappingView");
		oController.byId("idStepFilterMappingVBox").insertItem(stepFilterMappingView);
		//attach events
		stepRequestView.attachEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETDATAREDUCTIONSECTION, oController.setDataReductionSection.bind(oController));
		stepRequestView.attachEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS, _setVisibilityOfFilterMappingFields.bind(oController));
		oController.getView().attachEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS, _setVisibilityOfFilterMappingFields.bind(oController));
		stepRequestView.attachEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS, stepFilterMappingView.getController().updateFilterMappingFields.bind(stepFilterMappingView.getController()));
		oController.getView().attachEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.RESETFILTERMAPPINGFIELDS, stepFilterMappingView.getController().resetFilterMappingFields.bind(stepFilterMappingView.getController()));
		//To be fired to update subView facet filter and config editor instances after reset
		oController.getView().attachEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.UPDATESUBVIEWINSTANCESONRESET, stepCornerTextView.getController().updateSubViewInstancesOnReset.bind(stepCornerTextView.getController()));
		oController.getView().attachEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.UPDATESUBVIEWINSTANCESONRESET, stepRequestView.getController().updateSubViewInstancesOnReset.bind(stepRequestView.getController()));
		oController.getView().attachEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.UPDATESUBVIEWINSTANCESONRESET, stepFilterMappingView.getController().updateSubViewInstancesOnReset.bind(stepFilterMappingView.getController()));
		stepRequestView.addStyleClass("formTopPadding");
		stepRequestView.addStyleClass("formBottomPadding");
		stepFilterMappingView.addStyleClass("formTopPadding");
		stepFilterMappingView.addStyleClass("formBottomPadding");
	}
	// Called on init to set title of step
	function _setStepTitle(oController) {
		// In case of a new step do not set the title
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oConfigurationEditor.getStep(oParams.arguments.stepId))) {
			return;
		}
		oController.byId("idStepTitle").setValue(oStep.getId());
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oStep.getTitleId()) && oTextPool.get(oStep.getTitleId())) {
			oController.byId("idStepTitle").setValue(oTextPool.get(oStep.getTitleId()).TextElementDescription);
		}
	}
	// Called on init to set long title of step
	function _setStepLongTitle(oController) {
		// In case of a new step do not set the long step title
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oConfigurationEditor.getStep(oParams.arguments.stepId))) {
			return;
		}
		oController.byId("idStepLongTitle").setValue("");
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oStep.getLongTitleId()) && oTextPool.get(oStep.getLongTitleId())) {
			oController.byId("idStepLongTitle").setValue(oTextPool.get(oStep.getLongTitleId()).TextElementDescription);
		}
	}
	// Called on init to populate model for available categories, and assign steps to those categories
	function _setCategoryAssignments(oController) {
		var aCategories = [];
		var aAllCategories = oConfigurationEditor.getCategories();
		aAllCategories.forEach(function(oCategory) {
			var oCatOb = {};
			oCatOb.CategoryId = oCategory.getId();
			oCatOb.CategoryTitle = oTextPool.get(oCategory.labelKey) ? oTextPool.get(oCategory.labelKey).TextElementDescription : oCategory.labelKey;
			aCategories.push(oCatOb);
		});
		var oModelForCategories = optionsValueModelBuilder.prepareModel(aCategories, aCategories.length);
		oController.byId("idCategorySelect").setModel(oModelForCategories);
		var aSelectedCategories = oConfigurationEditor.getCategoriesForStep(oStep.getId());
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aSelectedCategories)) {
			oController.byId("idCategorySelect").setSelectedKeys(aSelectedCategories);
		}
	}
	function _setNumberOfRecords(oController) {
		oController.byId("idNumberOfRecordsValue").setValue("");
		oController.byId("idNumberOfRecordsValue").setValueState("None");
		if (oStep.getTopN()) {
			oController.byId("idNumberOfRecordsValue").setValue(oStep.getTopN().top);
		}
		_setVisiblityOfNoOfRecords(oController);
	}
	function _setDataReductionType(oController) {
		oController.byId("idDataReductionRadioGroup").setSelectedButton(oController.byId("idNoDataReduction"));
		_setEditableOfDataReductionRadioGroup(oController);
		if (oStep.getTopN()) {
			oController.byId("idDataReductionRadioGroup").setSelectedButton(oController.byId("idTopN"));
		}
	}
	function _setVisiblityOfNoOfRecords(oController) {
		var bIsTopNVisible = oController.byId("idDataReductionRadioGroup").getSelectedButton() === oController.byId("idTopN") ? true : false;
		oController.byId("idNumberOfRecordsLabel").setVisible(bIsTopNVisible);
		oController.byId("idNumberOfRecordsValue").setVisible(bIsTopNVisible);
		if (bIsTopNVisible) {
			oViewValidatorForStep.addField("idNumberOfRecordsValue");
		} else {
			oViewValidatorForStep.removeField("idNumberOfRecordsValue");
		}
	}
	function _updateTopNProperties(oController) {
		if (oStep.getTopN()) {
			oSortDataHandler.instantiateStepSortData();
			//Self healing
			if (oStep.getTopN().orderby.length === 0) {
				oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETTOPNPROPERTIES);
				var oMessageObject = oCoreApi.createMessageObject({
					code : "11523"
				});
				oCoreApi.putMessage(oMessageObject);
			}
		} else {
			oSortDataHandler.destroySortData();
		}
	}
	function _setEditableOfDataReductionRadioGroup(oController) {
		var bEditableOfDataReductionRadioGroup = (oStep.getSelectProperties().length !== 0) ? true : false;
		oController.byId("idDataReductionRadioGroup").setEnabled(bEditableOfDataReductionRadioGroup);
	}
	function _setFilterMappingFields(oController) {
		var bShowFilterMappingLayout = (oStep.getFilterProperties().length !== 0) ? true : false;
		oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS, {
			"bShowFilterMappingLayout" : bShowFilterMappingLayout
		});
	}
	// Called on init to set the value for keep source check box for filter mapping of a step
	function _setFilterMappingKeepSourceValue(oController) {
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oStep.getFilterMappingKeepSource())) {
			oController.byId("idFilterKeepSourceCheckBox").setSelected(oStep.getFilterMappingKeepSource());
		}
	}
	function _setNavigationTargets(oController, aNavTargets, oControl, aSelectedNavTargets) {
		var aModifiedNavTargets = [];
		if (aNavTargets.length !== 0) {//If configuration has navigation targets set a busy indicator on the control until texts are read
			oControl.setBusy(true);
		}
		aNavTargets.forEach(function(oNavigationTarget) {
			var oNavTarget = {};
			oNavTarget.navTargetKey = oNavigationTarget.getId();
			oGetNavigationTargetName(oNavigationTarget.getId()).then(function(value) {
				oNavTarget.navTargetName = value;
				aModifiedNavTargets.push(oNavTarget);//Push modified navigation target into array
				if (aModifiedNavTargets.length === aNavTargets.length) {
					var oModelForNavTarget = optionsValueModelBuilder.prepareModel(aModifiedNavTargets, aModifiedNavTargets.length);
					oControl.setModel(oModelForNavTarget);
					oControl.setSelectedKeys(aSelectedNavTargets);//Set the selection
					oControl.setBusy(false);//Remove busy indicator once the model is set on the control
				}
			});
		});
	}
	// Called on init to set step specific navigation targets
	function _setStepSpecificNavigationTargets(oController) {
		var aAllNavTarget = oConfigurationEditor.getNavigationTargets();//Get all the navigation targets in a configuration
		var aSelectedNavTargets = oStep.getNavigationTargets();//Get all the navigation targets assigned to the current step
		var aNavTargets = aAllNavTarget.filter(function(oNavTarget) {//Filter aAllNavTarget to get only step specific navigation targets
			return oNavTarget.isStepSpecific();
		});
		_setNavigationTargets(oController, aNavTargets, oController.byId("idStepSpecificCombo"), aSelectedNavTargets);
	}
	// Called on init to set global navigation targets
	function _setGlobalNavigationTargets(oController) {
		var aAllNavTarget = oConfigurationEditor.getNavigationTargets();//Get all the navigation targets in a configuration
		var aNavTargets = aAllNavTarget.filter(function(oNavTarget) {//Filter aAllNavTarget to get only global navigation targets
			return oNavTarget.isGlobal();
		});
		var aSelectedNavTargets = aNavTargets.map(function(oNavTarget) {
			return oNavTarget.getId();
		});
		_setNavigationTargets(oController, aNavTargets, oController.byId("idGlobalCombo"), aSelectedNavTargets);
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.step", {
		onInit : function() {
			var oController = this, oStepPropertyMetadataHandler, sStepTitle;
			var oViewData = oController.getView().getViewData();
			oCoreApi = oViewData.oCoreApi;
			oTextReader = oCoreApi.getText;
			oParams = oViewData.oParams;
			oConfigurationHandler = oViewData.oConfigurationHandler;
			oTextPool = oConfigurationHandler.getTextPool();
			oConfigurationEditor = oViewData.oConfigurationEditor;
			oGetNavigationTargetName = oViewData.getNavigationTargetName;
			oViewValidatorForStep = new sap.apf.modeler.ui.utils.ViewValidator(oController.getView());
			_setDisplayText(oController);
			_retrieveOrCreateStepObject(oController);
			oStepPropertyMetadataHandler = new sap.apf.modeler.ui.utils.StepPropertyMetadataHandler(oCoreApi, oStep);
			oSortDataHandler = new sap.apf.modeler.ui.utils.SortDataHandler(oController.getView(), oStep, oStepPropertyMetadataHandler, oTextReader);
			_instantiateSubViews(oController);
			oController.setDetailData();
			sStepTitle = oController.byId("idStepTitle").getValue().trim();
			if (sStepTitle === "") {
				sStepTitle = "< " + oTextReader("newStep") + " >";
			}
			_setBreadCrumbTitle(oController, sStepTitle);
			//Set Mandatory Fields
			oViewValidatorForStep.addFields([ "idStepTitle", "idCategorySelect" ]);
		},
		setDetailData : function() {
			var oController = this;
			_setStepTitle(oController);
			_setStepLongTitle(oController);
			_setCategoryAssignments(oController);
			oController.setDataReductionSection();
			_setVisibilityOfDataReductionSection(oController);
			_setFilterMappingFields(oController);
			_setFilterMappingKeepSourceValue(oController);
			_setStepSpecificNavigationTargets(oController);
			_setGlobalNavigationTargets(oController);
		},
		//sets the focus on first element in the object
		onAfterRendering : function() {
			var oController = this;
			if (oController.byId("idStepTitle").getValue().length === 0) {
				oController.byId("idStepTitle").focus();
			}
		},
		// Updates step object and config editor on reset
		updateSubViewInstancesOnReset : function(oConfigEditor) {
			var oController = this;
			oConfigurationEditor = oConfigEditor;
			oStep = oConfigurationEditor.getStep(oStep.getId());
			oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.UPDATESUBVIEWINSTANCESONRESET, {
				"oConfigurationEditor" : oConfigurationEditor,
				"oParentObject" : oStep
			});
		},
		setDataReductionSection : function() {
			var oController = this;
			_setDataReductionType(oController);
			_setNumberOfRecords(oController);
			_updateTopNProperties(oController);
		},
		handleChangeForStepTitle : function() {
			var oController = this;
			var aStepCategories = oConfigurationEditor.getCategoriesForStep(oStep.getId());
			var sStepTitle = oController.byId("idStepTitle").getValue().trim();
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sStepTitle)) {
				oTextPool.setTextAsPromise(sStepTitle, oTranslationFormatForStepTitle).done(function(sStepTitleId) {
					oStep.setTitleId(sStepTitleId);
					if (aStepCategories.length > 1) {
						oController.getView().getViewData().updateTree();
					} else {
						_updateTreeNode(oController, sStepTitle);
					}
					_updateBreadCrumbOnStepTitleChange(oController, sStepTitle);
					oConfigurationEditor.setIsUnsaved();
				});
			} else {
				oConfigurationEditor.setIsUnsaved();
			}
		},
		// handler for suggestions
		handleSuggestionsForStepTitle : function(oEvent) {
			var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oTextPool);
			oSuggestionTextHandler.manageSuggestionTexts(oEvent, oTranslationFormatForStepTitle);
		},
		handleChangeForStepLongTitle : function() {
			var oController = this;
			var sStepLongTitle = oController.byId("idStepLongTitle").getValue().trim();
			if (nullObjectChecker.checkIsNotNullOrUndefined(sStepLongTitle)) {
				oTextPool.setTextAsPromise(sStepLongTitle, oTranslationFormatForStepLongTitle).done(function(sStepLongTitleId) {
					oStep.setLongTitleId(sStepLongTitleId);
					oConfigurationEditor.setIsUnsaved();
				});
			} else {
				oConfigurationEditor.setIsUnsaved();
			}
		},
		// handler for suggestions
		handleSuggestionsForStepLongTitle : function(oEvent) {
			var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oTextPool);
			oSuggestionTextHandler.manageSuggestionTexts(oEvent, oTranslationFormatForStepLongTitle);
		},
		handleChangeForCategory : function() {
			var oController = this;
			var stepId = oStep.getId();
			var currentCategoryId = oParams.arguments.categoryId;
			var aPreCat = oConfigurationEditor.getCategoriesForStep(oStep.getId());
			var sSelCategory = oController.byId("idCategorySelect").getSelectedKeys();
			var currentCategoryChange = sSelCategory.indexOf(currentCategoryId);
			var aStepContexts = [];
			var unselectedCategories = [];
			var i, j;
			for(i = 0; i < aPreCat.length; i++) {
				var match = false;
				for(j = 0; j < sSelCategory.length; j++) {
					if (aPreCat[i] === sSelCategory[j]) {
						match = true;
						break;
					}
				}
				if (!match) {
					unselectedCategories.push(aPreCat[i]);
				}
			}
			if (sSelCategory.length !== 0) {
				sSelCategory.forEach(function(category) {
					oConfigurationEditor.addCategoryStepAssignment(category, stepId); //Add the step to the categories selected
					var oStepContext = {
						oldContext : {
							name : oParams.name,
							arguments : {
								configId : oParams.arguments.configId,
								categoryId : currentCategoryId,
								stepId : stepId
							}
						},
						newContext : {
							arguments : {
								configId : oParams.arguments.configId,
								categoryId : category
							}
						}
					};
					if (category !== currentCategoryId) {
						aStepContexts.push(oStepContext);
					}
				});
				aPreCat.forEach(function(sCatId) { //Remove the step from all the old categories it was present in
					if (sSelCategory.indexOf(sCatId) === -1) { // ... and that are not selected any more
						oConfigurationEditor.removeCategoryStepAssignment(sCatId, oStep.getId());
					}
				});
				if (unselectedCategories.length !== 0) {//Prepare context for unselected categories, to be removed from the model
					unselectedCategories.forEach(function(unselectedCategory) {
						var oStepContext = {
							oldContext : {
								name : oParams.name,
								arguments : {
									configId : oParams.arguments.configId,
									categoryId : currentCategoryId,
									stepId : stepId
								}
							},
							newContext : {
								arguments : {
									configId : oParams.arguments.configId,
									categoryId : unselectedCategory
								}
							},
							removeStep : true
						};
						if (currentCategoryChange === -1 && unselectedCategory === currentCategoryId) {//Prepare context for category change, if the current category is removed from the step
							var categoryChangeContext = {
								arguments : {
									appId : oParams.arguments.appId,
									configId : oParams.arguments.configId,
									categoryId : sSelCategory[0],
									stepId : stepId
								}
							};
							oStepContext.categoryChangeContext = categoryChangeContext;
							oStepContext.changeCategory = true;
						}
						aStepContexts.push(oStepContext);
					});
				}
			}
			if (aStepContexts.length !== 0) {
				oController.getView().getViewData().updateTree(aStepContexts);//When the categories in the step is changed
			}
			oConfigurationEditor.setIsUnsaved();
		},
		handleChangeForDataReductionType : function() {
			var oController = this;
			if (oController.byId("idDataReductionRadioGroup").getSelectedButton() === oController.byId("idNoDataReduction")) {
				oStep.resetTopN();
				oController.setDataReductionSection();
			} else {
				oSortDataHandler.instantiateStepSortData();
			}
			_setVisiblityOfNoOfRecords(oController);
			oConfigurationEditor.setIsUnsaved();
		},
		handleValidationForNumberOfRecords : function(oEvent) {
			var oInputControl = oEvent.getSource();
			var sValue = oInputControl.getValue().trim();
			//value for data record should not be negative, float or greater than 10000 - Otherwise the value state for input is invalid
			var sValueState = (sValue.indexOf("E") !== -1 || sValue.indexOf("e") !== -1 || sValue.indexOf(".") !== -1 || sValue <= 0 || sValue > 10000) ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.None;
			oInputControl.setValueState(sValueState);
			oConfigurationEditor.setIsUnsaved();
		},
		handleChangeForNoOfRecords : function(oEvent) {
			var oController = this;
			var sValue = oEvent.getSource().getValue().trim();
			if (oEvent.getSource().getValueState() === sap.ui.core.ValueState.Error) {
				return;
			}
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sValue)) {
				if (oStep.getTopN() === undefined) {
					oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETTOPNPROPERTIES);
				}
				oStep.setTopNValue(sValue);
			}
			oConfigurationEditor.setIsUnsaved();
		},
		handleFilterMapKeepSource : function() {
			var oController = this;
			var bIsKeepSourceSelected = oController.byId("idFilterKeepSourceCheckBox").getSelected();
			oStep.setFilterMappingKeepSource(bIsKeepSourceSelected);
			oConfigurationEditor.setIsUnsaved();
		},
		handleChangeForStepSpecificNavTargets : function() {
			var oController = this;
			var selectedNavTargets = oController.byId("idStepSpecificCombo").getSelectedKeys();
			var prevNavTargets = oStep.getNavigationTargets();
			prevNavTargets.forEach(function(navTargetId) { //Remove the old assigned navigation targets from the step it was assigned to and are unselected now
				if (selectedNavTargets.indexOf(navTargetId) === -1) {
					oStep.removeNavigationTarget(navTargetId);
				}
			});
			selectedNavTargets.forEach(function(navTargetId) {
				if (prevNavTargets.indexOf(navTargetId) === -1) { //Add the selected navigation targets to the step
					oStep.addNavigationTarget(navTargetId);
				}
			});
			oConfigurationEditor.setIsUnsaved();
		},
		getValidationState : function() {
			var oController = this;
			return oViewValidatorForStep.getValidationState() && oController.byId("idStepRequestView").getController().getValidationState() && oController.byId("idStepFilterMappingView").getController().getValidationState();
		},
		onExit : function() {
			var oController = this;
			oController.byId("idStepCornerTextView").destroy();
			oController.byId("idStepRequestView").destroy();
			oController.byId("idStepFilterMappingView").destroy();
		}
	});
}());