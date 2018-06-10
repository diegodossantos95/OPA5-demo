/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.modeler.ui.utils.viewValidator");
jQuery.sap.require('sap.apf.modeler.ui.utils.textPoolHelper');
/**
* @class configuration
* @memberOf sap.apf.modeler.ui.controller
* @name configuration
* @description controller for view.configuration
*/
(function() {
	"use strict";
	var viewValidatorForConfig, oTextReader, oApplicationHandler, oConfigurationHandler, oConfigurationEditor, oParams, oConfiguration;
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	//Sets static texts in UI
	function _setDisplayText(oController) {
		oController.byId("idConfigurationBasicData").setText(oTextReader("configurationData"));
		oController.byId("idConfigTitleLabel").setText(oTextReader("configTitle"));
		oController.byId("idConfigTitle").setPlaceholder(oTextReader("newConfiguration"));
		oController.byId("idConfigurationIdLabel").setText(oTextReader("configurationId"));
		oController.byId("idSemanticObjectLabel").setText(oTextReader("semanticObject"));
		oController.byId("idNoOfCategoriesLabel").setText(oTextReader("noOfCategories"));
		oController.byId("idNoOfStepsLabel").setText(oTextReader("noOfSteps"));
		oController.byId("idFilterTypeData").setText(oTextReader("filterType"));
		oController.byId("idFilterTypeLabel").setText(oTextReader("type"));
		oController.byId("smartFilterBar").setText(oTextReader("smartFilterBar"));
		oController.byId("facetFilter").setText(oTextReader("configuredFilters"));
		oController.byId("none").setText(oTextReader("noFilters"));
		oController.byId("idAriaPropertyForFilterRadioGp").setText(oTextReader("type"));
	}
	// sets the total categories
	function _setTotalCategories(oController) {
		if (!oConfiguration) {
			return;
		}
		oController.byId("idNoOfCategories").setValue(oConfigurationEditor.getCategories().length);
	}
	// sets the total steps
	function _setTotalSteps(oController) {
		if (!oConfiguration) {
			return;
		}
		oController.byId("idNoOfSteps").setValue(oConfigurationEditor.getSteps().length);
	}
	// sets the title of configuration object
	function _setConfigurationTitle(oController) {
		if (!oConfiguration) {
			return;
		}
		oController.byId("idConfigTitle").setValue(oConfiguration.AnalyticalConfigurationName);
	}
	// sets the configuration id of the configuration object
	function _setConfigurationId(oController) {
		// set the id of the configuration only when it is saved configuration
		if (!oConfiguration) {
			return;
		}
		if (oConfiguration.AnalyticalConfiguration.indexOf(sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.ISNEWCONFIG) === -1) {
			oController.byId("idConfigurationId").setValue(oConfiguration.AnalyticalConfiguration);
		}
	}
	// sets the semantic object
	function _setSemanticObject(oController) {
		var applicationObject = oApplicationHandler.getApplication(oParams.arguments.appId);
		if (applicationObject) {
			oController.byId("idSemanticObject").setValue(applicationObject.SemanticObject);
		}
	}
	// sets the filter option type
	function _setFilterOptionType(oController) {
		var sFilterOptionType;
		if (oConfiguration) {
			sFilterOptionType = Object.keys(oConfigurationEditor.getFilterOption())[0];
			oController.byId("idFilterTypeRadioGroup").setEnabled(true);
			oController.byId("idFilterTypeRadioGroup").setSelectedButton(oController.byId(sFilterOptionType));
		}
	}
	// Called on initialization to create a new configuration object
	function _retrieveConfigurationObject(oController) {
		if (oParams && oParams.arguments && oParams.arguments.configId) {
			oConfiguration = oConfigurationHandler.getConfiguration(oParams.arguments.configId);
		}
		if (oConfiguration) {
			oConfigurationEditor = oController.getView().getViewData().oConfigurationEditor;
		}
	}
	// updates the bread crumb with current config title
	function _updateBreadCrumbOnConfigurationChange(oController, sConfigTitle) {
		var sTitle = oTextReader("configuration") + ": " + sConfigTitle;
		oController.getView().getViewData().updateTitleAndBreadCrumb(sTitle);
	}
	// updates the bread crumb with current config title
	function _updateApplicationTitle(oController, sConfigTitle) {
		var oTextPool = oConfigurationHandler.getTextPool();
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.APPLICATION_TITLE;
		oTextPool.setTextAsPromise(sConfigTitle, oTranslationFormat).done(function(sApplicationTitleId){
			oConfigurationEditor.setApplicationTitle(sApplicationTitleId);
		});		
	}
	// Updates the tree node (configuration) with given configuration title
	function _updateTreeNodeOnConfigurationChange(oController, sConfigTitle, sConfigId) {
		var context = {
			appId : oParams.arguments.appId
		};
		var configInfo = {
			name : sConfigTitle
		};
		if (sConfigId) { // new configuration scenario
			configInfo.id = sConfigId;
			context.configId = sConfigId;
			oController.getView().getViewData().updateSelectedNode(configInfo, context);
		} else { // update configuration scenario
			oController.getView().getViewData().updateSelectedNode(configInfo);
		}
	}
	// updates the filter option type in the config editor
	function _updateFilterOptionType(oController) {
		var oFilterOptionType = {};
		var sFilterOption = oController.byId("idFilterTypeRadioGroup").getSelectedButton().getCustomData()[0].getValue();
		oFilterOptionType[sFilterOption] = true;
		oConfigurationEditor.setFilterOption(oFilterOptionType);
		oConfigurationEditor.setIsUnsaved();
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.configuration", {
		// Called on initialization of the view.
		// Sets the static texts for all controls in UI.
		// Prepares dependecies.
		onInit : function() {
			var oController = this;
			var oViewData = oController.getView().getViewData();
			oApplicationHandler = oViewData.oApplicationHandler;
			oConfigurationHandler = oViewData.oConfigurationHandler;
			oTextReader = oViewData.getText;
			oParams = oViewData.oParams;
			viewValidatorForConfig = new sap.apf.modeler.ui.utils.ViewValidator(oController.getView());
			_setDisplayText(oController);
			_retrieveConfigurationObject(oController);
			oController.setDetailData();
			viewValidatorForConfig.addField("idConfigTitle");
		},
		//sets the focus on first element in the object
		onAfterRendering : function() {
			var oController = this;
			if (oController.getView().byId("idConfigTitle").getValue().length === 0) {
				oController.getView().byId("idConfigTitle").focus();
			}
		},
		// Sets dynamic texts for controls
		setDetailData : function() {
			var oController = this;
			_setSemanticObject(oController);
			_setConfigurationId(oController);
			_setConfigurationTitle(oController);
			_setTotalCategories(oController);
			_setTotalSteps(oController);
			_setFilterOptionType(oController);
		},
		// Updates configuration object and config editor on reset
		updateSubViewInstancesOnReset : function(oConfigEditor) {
			oConfigurationEditor = oConfigEditor;
		},
		// Handler for change event on configuration Title input control
		handleChangeDetailValue : function() {
			var oController = this;
			var sConfigTitle = oController.byId("idConfigTitle").getValue().trim();
			var configObj;
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sConfigTitle)) {
				configObj = {
					AnalyticalConfigurationName : sConfigTitle
				};
				if (oParams && oParams.arguments && oParams.arguments.configId && (oParams.arguments.configId.indexOf("newConfig") === -1)) {
					oConfigurationHandler.setConfiguration(configObj, oParams.arguments.configId);
					_updateTreeNodeOnConfigurationChange(oController, sConfigTitle);
				} else {
					var sTempConfigId = oConfigurationHandler.setConfiguration(configObj);
					oConfiguration = oConfigurationHandler.getConfiguration(sTempConfigId);
					if (!oConfigurationEditor) {
						oConfigurationHandler.loadConfiguration(sTempConfigId, function(configurationEditor) {
							oConfigurationEditor = configurationEditor;
						});
					}
					_updateTreeNodeOnConfigurationChange(oController, sConfigTitle, sTempConfigId);
				}
				_updateApplicationTitle(oController, sConfigTitle);
				_updateBreadCrumbOnConfigurationChange(oController, sConfigTitle);
				oConfiguration = configObj;
			}
			oConfigurationEditor.setIsUnsaved();
		},
		handleChangeForFilterType : function() {
			var oController = this, oFilterOptionChangeDialog;
			if (!oConfigurationEditor.isDataLostByFilterOptionChange()) {
				_updateFilterOptionType(oController);
				oController.getView().getViewData().updateTree(); // Updates the tree structure according to chosen filter option type
			} else {
				oFilterOptionChangeDialog = new sap.ui.xmlfragment("idFilterOptionChangeFragment", "sap.apf.modeler.ui.fragment.dialogWithTwoButtons", oController);
				oFilterOptionChangeDialog.setState(sap.ui.core.ValueState.Warning);
				oFilterOptionChangeDialog.setTitle(oTextReader("warning"));
				sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idLabelForDialog").setText(oTextReader("filterOptionChangeMessage"));
				sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idBeginButtonForDialog").setText(oTextReader("continue"));
				sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idEndButtonForDialog").setText(oTextReader("cancel"));
				oFilterOptionChangeDialog.open();
			}
		},
		handleBeginButtonDialogWithTwoButtons : function() {
			var oController = this;
			_updateFilterOptionType(oController);
			oController.getView().getViewData().updateTree(); // Updates the tree structure according to chosen filter option type
			sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").destroy();
		},
		handleEndButtonDialogWithTwoButtons : function() {
			var oController = this;
			_setFilterOptionType(oController);
			sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").destroy();
		},
		// Getter for getting the current validation state of sub view
		getValidationState : function() {
			return viewValidatorForConfig.getValidationState();
		}
	});
})();
