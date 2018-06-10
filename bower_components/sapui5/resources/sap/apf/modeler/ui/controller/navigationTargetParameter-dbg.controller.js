/**
* @class navigationTargetParameter
* @name navigationTargetParameter
* @description navigation target parameter controller of modeler
* 			   The ViewData for this view needs the following parameters:
* 			   	oTextReader - getText()-function
*				oParentController - controller of navigation target
*				oNavigationTarget - model of navigation target
*				parameter - (optional) parameter object with key and value
*/
(function() {
	"use strict";
	var oTextReader;
	function setParameterValuePair(oController){
		var index;
		var key = getKey(oController);
		var value = getValue(oController);
		if(oController.oldKey && oController.navigationTarget.getNavigationParameter(oController.oldKey)){
			oController.navigationTarget.removeNavigationParameter(oController.oldKey);
			oController.configurationEditor.setIsUnsaved();
		}
		//Set value to the core
		if(!oController.navigationTarget.getNavigationParameter(key)){
			if(key && value){
				index = oController.oParentController.getNavigationParameters().indexOf(oController.getView());
				oController.configurationEditor.setIsUnsaved();
				oController.navigationTarget.addNavigationParameter(key, value, index);
			}
			oController.byId("idNavigationParametersKey").setValueState(sap.ui.core.ValueState.None);
			//save old key
			oController.oldKey = key;
		} else {
			oController.byId("idNavigationParametersKey").setValueState(sap.ui.core.ValueState.Error);
			oController.oldKey = null;
		}
	}
	function removeParameterValuePair(oController){
		var key = getKey(oController);
		//remove parameter from core
		if(key && oController.navigationTarget.getNavigationParameter(key)){
			oController.configurationEditor.setIsUnsaved();
			oController.navigationTarget.removeNavigationParameter(key);
		}
	}
	function _setDisplayText(oController) {
		oController.byId("idNavigationParametersKey").setValueStateText(oTextReader("navigationParametersKeyErrorState"));
		oController.byId("idNavigationParametersValue").setValueStateText(oTextReader("navigationParametersValueErrorState"));
		oController.byId("idNavigationParametersLabel").setText(oTextReader("navigationParametersLabel"));
		oController.byId("idNavigationParametersKey").setPlaceholder(oTextReader("navigationParametersKey"));
		oController.byId("idNavigationParametersValue").setPlaceholder(oTextReader("navigationParametersValue"));
	}
	function getKey(oController){
		return oController.byId("idNavigationParametersKey").getValue();
	}
	function getValue(oController){
		return oController.byId("idNavigationParametersValue").getValue();
	}
	function setInitialValues(oController, parameter){
		if(parameter){
			oController.byId("idNavigationParametersKey").setValue(parameter.key);
			oController.oldKey = parameter.key;
			oController.byId("idNavigationParametersValue").setValue(parameter.value);
		}
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.navigationTargetParameter", {
		onInit : function() {
			var viewData = this.getView().getViewData();
			oTextReader = viewData.oTextReader;
			this.oParentController = viewData.oParentController;
			this.navigationTarget = viewData.oNavigationTarget;
			this.configurationEditor = viewData.oConfigurationEditor;
			_setDisplayText(this);
			setInitialValues(this, viewData.parameter);
		},
		onExit : function() {
			var oController = this;
			oController.destroy();
		},
		onPlus: function() {
			this.oParentController.addNavigationParameter();
		},
		onMinus: function() {
			removeParameterValuePair(this);
			this.oParentController.removeNavigationParameter(this.getView());
			this.getView().destroy();
		},
		checkVisibilityOfPlusMinus: function(){
			var navigationParameters = this.oParentController.getNavigationParameters();
			// Minus Button is shown when there is more than one navigation parameter
			if(navigationParameters.length === 1){
				this.byId("idRemoveNavigationParameter").setVisible(false);
			} else {
				this.byId("idRemoveNavigationParameter").setVisible(true);
			}
			//Plus Button is shown for the last entry
			if(navigationParameters[navigationParameters.length - 1] === this.getView()){
				this.byId("idAddNavigationParameter").setVisible(true);
				if(!this.byId("idRemoveNavigationParameter").hasStyleClass("lessIcon")){
					this.byId("idRemoveNavigationParameter").addStyleClass("lessIcon");
				}
			} else {
				this.byId("idAddNavigationParameter").setVisible(false);
				this.byId("idRemoveNavigationParameter").removeStyleClass("lessIcon");
			}
		},
		onKeyEntered : function () {
			this.byId("idNavigationParametersKey").setValueState(sap.ui.core.ValueState.None);
			setParameterValuePair(this);
		},
		onValueEntered : function () {
			this.byId("idNavigationParametersValue").setValueState(sap.ui.core.ValueState.None);
			setParameterValuePair(this);
		},
		validate : function(){
			if(getValue(this) && !getKey(this)){
				this.byId("idNavigationParametersKey").setValueStateText("Gib Key ein");
				this.byId("idNavigationParametersKey").setValueState(sap.ui.core.ValueState.Error);
				return false;
			}
			if(!getValue(this) && getKey(this)){
				this.byId("idNavigationParametersValue").setValueState(sap.ui.core.ValueState.Error);
				return false;
			}
			if(this.byId("idNavigationParametersKey").getValueState() === sap.ui.core.ValueState.Error){
				return false;
			}
			return true;
		}
	});
}());