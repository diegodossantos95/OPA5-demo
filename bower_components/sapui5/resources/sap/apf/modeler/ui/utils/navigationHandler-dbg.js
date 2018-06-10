/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/**
  * Navigation Handler Class
**/
jQuery.sap.declare('sap.apf.modeler.ui.utils.navigationHandler');
sap.apf.modeler.ui.utils.navigationHandler = (function() {
	"use strict";
	//Global Variables
	var instance, dialogInstance = {};
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.utils.navigationHandler#onConfigurationSwitch
	 * @param {Boolean} isSaved - Whether configuration is saved or not before navigation 
	 * @param {Boolean} isDifferentConfig - Whether configuration is different or same 
	 * @param {Object} configListInstance - Pass the configuration list instance 
	 * @description On switch of one configuration to another handle scenarios below
	 * Yes : The unsaved changes are saved and the user navigates to the new configuration 
	 * No : The user navigates without saving the changes (this reverts back to the last saved state or the last in memory state depending on whether this object was saved before or not).
	 * Cancel : The pop up closes and user remains in the current configuration.
	 * */
	var _closeDialog = function(dialogInstance) {
		dialogInstance.close();
	};
	var handleNavigationWithSave = function() {
		var configListInstance = this.configListInstance;
		var callback = this.callback;
		var saveEditor = function(callback) {
			//Save Editor Instance
			configListInstance.configEditor.save(function(id, metadata, messageObject) {
				configListInstance.configId = id;
				configListInstance.configurationHandler.memorizeConfiguration(id);
				if (messageObject === undefined) {
					if (typeof callback === "function") {
						callback();
					}
					var oMessageObject = configListInstance.oCoreApi.createMessageObject({
						code : "11513"
					});
					configListInstance.oCoreApi.putMessage(oMessageObject);
				} else {
					var oMessageObject = configListInstance.oCoreApi.createMessageObject({
						code : "11514"
					});
					configListInstance.oCoreApi.putMessage(oMessageObject);
				}
			});
		};
		_closeDialog(dialogInstance.oConfirmNavigationDialog);
		if (typeof callback.yes === "function") {
			callback.yes(saveEditor);
		}
	};
	var handleNavigationWithoutSave = function() {
		var configListInstance = this.configListInstance;
		var callback = this.callback;
		_closeDialog(dialogInstance.oConfirmNavigationDialog);
		configListInstance.configurationHandler.resetConfiguration(configListInstance.configId);
		if (typeof callback.no === "function") {
			callback.no();
		}
	};
	var handlePreventNavigation = function() {
		var isValidationCheck = this.isValidationCheck;
		var callback = this.callback;
		if (!isValidationCheck) {
			_closeDialog(dialogInstance.oConfirmNavigationDialog);
		} else {
			_closeDialog(dialogInstance.oConfirmValidationDialog);
		}
		if (typeof callback.cancel === "function") {
			callback.cancel();
		} else if (typeof callback.no === "function" && isValidationCheck) {
			callback.no();
		}
	};
	var _setMessageDialogText = function(oCoreApi, dialogType) {
		if (dialogType === "naviagtionDialog") {
			sap.ui.core.Fragment.byId("idMessageDialogFragment", "idMessageDialog").setTitle(oCoreApi.getText("warning"));
			sap.ui.core.Fragment.byId("idMessageDialogFragment", "idYesButton").setText(oCoreApi.getText("yes"));
			sap.ui.core.Fragment.byId("idMessageDialogFragment", "idNoButton").setText(oCoreApi.getText("no"));
			sap.ui.core.Fragment.byId("idMessageDialogFragment", "idCancelButton").setText(oCoreApi.getText("cancel"));
		} else if (dialogType === "validationDialog") {
			sap.ui.core.Fragment.byId("idMandatoryValidationDialogFragement", "idMandatoryValidationDialog").setTitle(oCoreApi.getText("warning"));
			sap.ui.core.Fragment.byId("idMandatoryValidationDialogFragement", "idYesButton").setText(oCoreApi.getText("yes"));
			sap.ui.core.Fragment.byId("idMandatoryValidationDialogFragement", "idNoButton").setText(oCoreApi.getText("no"));
		}
	};
	var _openMessageDialogForSwitchState = function(configListInstance, switchState, callback) {
		var oCoreApi = configListInstance.oCoreApi;
		var dialogMessage = oCoreApi.getText("unsavedConfiguration");
		var currSwitchStateKey = Object.keys(switchState)[0];
		var handlerContext = {
			handleNavigationWithSave : handleNavigationWithSave,
			handleNavigationWithoutSave : handleNavigationWithoutSave,
			handlePreventNavigation : handlePreventNavigation,
			configListInstance : configListInstance,
			callback : callback
		};
		handlerContext[currSwitchStateKey] = switchState[currSwitchStateKey];
		//Create New Instance of dialog
		dialogInstance.oConfirmNavigationDialog = sap.ui.xmlfragment("idMessageDialogFragment", "sap.apf.modeler.ui.fragment.unsavedDataConfirmationDialog", handlerContext);
		configListInstance.getView().addDependent(dialogInstance.oConfirmNavigationDialog);
		_setMessageDialogText(oCoreApi, "naviagtionDialog");
		var oConfirmationMessageLabel = new sap.m.Label();
		oConfirmationMessageLabel.addStyleClass("dialogText");
		oConfirmationMessageLabel.setText(dialogMessage);
		dialogInstance.oConfirmNavigationDialog.removeAllContent();
		dialogInstance.oConfirmNavigationDialog.addContent(oConfirmationMessageLabel); // add the confirmation message to the dialog
		dialogInstance.oConfirmNavigationDialog.attachAfterClose(function() {
			dialogInstance.oConfirmNavigationDialog.destroy();
		});
		dialogInstance.oConfirmNavigationDialog.open();
	};
	var throwLossOfDataPopup = function(configListInstance, callback) {
		_openMessageDialogForSwitchState(configListInstance, {
			isSwitchConfiguration : true
		}, callback);
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.utils.navigationHandler#onCheckValidationState
	 * @param {Boolean} isSaved - Whether configuration is saved or not before navigation 
	 * @param {Object} configListInstance - Pass the configuration list instance 
	 * @description On switch of one configuration to another handle scenarios below
	 * Yes : -> if this is saved object, restore the value to the previously saved value,
			-> if not saved, then change the value to the previously saved in memory value                 
			-> if the user has just created this object and is trying to navigate to the another node or action, the object is lost.
	 * No : -> He remains on the current form with the mandatory fields.
	 * */
	var handleValidationNavigation = function() {
		var callback = this.callback;
		_closeDialog(dialogInstance.oConfirmValidationDialog);
		if (typeof callback.yes === "function") {
			callback.yes();
		}
	};
	var _openMessageDialogForValidationState = function(configListInstance, switchState, callback) {
		var oCoreApi = configListInstance.oCoreApi;
		var dialogMessage = oCoreApi.getText("mandatoryField");
		var currSwitchStateKey = Object.keys(switchState)[0];
		var handlerContext = {
			handleValidationNavigation : handleValidationNavigation,
			handlePreventNavigation : handlePreventNavigation,
			configListInstance : configListInstance,
			callback : callback
		};
		handlerContext[currSwitchStateKey] = switchState[currSwitchStateKey];
		//Create New Instance of dialog
		dialogInstance.oConfirmValidationDialog = sap.ui.xmlfragment("idMandatoryValidationDialogFragement", "sap.apf.modeler.ui.fragment.mandatoryDialog", handlerContext);
		configListInstance.getView().addDependent(dialogInstance.oConfirmValidationDialog);
		_setMessageDialogText(oCoreApi, "validationDialog");
		var oValidationMessageLabel = new sap.m.Label();
		oValidationMessageLabel.addStyleClass("dialogText");
		oValidationMessageLabel.setText(dialogMessage);
		dialogInstance.oConfirmValidationDialog.removeAllContent();
		dialogInstance.oConfirmValidationDialog.addContent(oValidationMessageLabel); // add the confirmation message to the dialog
		dialogInstance.oConfirmValidationDialog.attachAfterClose(function() {
			dialogInstance.oConfirmValidationDialog.destroy();
		});
		dialogInstance.oConfirmValidationDialog.open();
	};
	var throwMandatoryPopup = function(configListInstance, callback) {
		_openMessageDialogForValidationState(configListInstance, {
			isValidationCheck : true
		}, callback);
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.utils.navigationHandler#_openMessageDialogForSwitchState
	 * @param {Object} configListInstance  - configurationList Instance 
	 * @param {Object} switchState - Current Switch state property isTraverseBack, isSwitchConfiguration etc
	 * @description On switch of sub view to another open pop up dialog
	 * */
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.utils.navigationHandler#_openMessageDialogForSwitchState
	 * @param {Object} configListInstance  - configurationList Instance 
	 * @param {Object} switchState - Current Switch state property isTraverseBack, isSwitchConfiguration etc
	 * @description On switch of one configuration to another open pop up dialog
	 * */
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.utils.navigationHandler#_closeDialog
	 * @param {dialogInstance}  - DialogInstance to be destroyed
	 * @description Destroys the passed dialog instance
	 * */
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.utils.navigationHandler#_setMessageDialogText
	 * @param {Object} oCoreApi - Core API instance
	 * @description Sets the text for dialog pop up
	 * */
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.utils.navigationHandler#handleValidationNavigation
	 * @description Handles Navigation Back to sub views
	 * */
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.utils.navigationHandler#handleNavigationWithSave
	 * @description Handles Navigation Scenario With Save 
	 * */
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.utils.navigationHandler#handleNavigationWithoutSave
	 * @description Handles Navigation Scenario Without Save 
	 * */
	/**
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.utils.navigationHandler#handlePreventNavigation
	 * @description Prevents the navigation retains in the same state 
	 * */
	//Create Navigation Handler Instance
	var createInstance = function() {
		return {
			throwLossOfDataPopup : throwLossOfDataPopup,
			throwMandatoryPopup : throwMandatoryPopup
		};
	};
	return {
		getInstance : function() {
			return instance || (instance = createInstance());
		}
	};
}());