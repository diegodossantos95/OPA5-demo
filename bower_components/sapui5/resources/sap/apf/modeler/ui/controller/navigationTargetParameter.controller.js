(function(){"use strict";var t;function s(c){var i;var k=g(c);var v=a(c);if(c.oldKey&&c.navigationTarget.getNavigationParameter(c.oldKey)){c.navigationTarget.removeNavigationParameter(c.oldKey);c.configurationEditor.setIsUnsaved();}if(!c.navigationTarget.getNavigationParameter(k)){if(k&&v){i=c.oParentController.getNavigationParameters().indexOf(c.getView());c.configurationEditor.setIsUnsaved();c.navigationTarget.addNavigationParameter(k,v,i);}c.byId("idNavigationParametersKey").setValueState(sap.ui.core.ValueState.None);c.oldKey=k;}else{c.byId("idNavigationParametersKey").setValueState(sap.ui.core.ValueState.Error);c.oldKey=null;}}function r(c){var k=g(c);if(k&&c.navigationTarget.getNavigationParameter(k)){c.configurationEditor.setIsUnsaved();c.navigationTarget.removeNavigationParameter(k);}}function _(c){c.byId("idNavigationParametersKey").setValueStateText(t("navigationParametersKeyErrorState"));c.byId("idNavigationParametersValue").setValueStateText(t("navigationParametersValueErrorState"));c.byId("idNavigationParametersLabel").setText(t("navigationParametersLabel"));c.byId("idNavigationParametersKey").setPlaceholder(t("navigationParametersKey"));c.byId("idNavigationParametersValue").setPlaceholder(t("navigationParametersValue"));}function g(c){return c.byId("idNavigationParametersKey").getValue();}function a(c){return c.byId("idNavigationParametersValue").getValue();}function b(c,p){if(p){c.byId("idNavigationParametersKey").setValue(p.key);c.oldKey=p.key;c.byId("idNavigationParametersValue").setValue(p.value);}}sap.ui.controller("sap.apf.modeler.ui.controller.navigationTargetParameter",{onInit:function(){var v=this.getView().getViewData();t=v.oTextReader;this.oParentController=v.oParentController;this.navigationTarget=v.oNavigationTarget;this.configurationEditor=v.oConfigurationEditor;_(this);b(this,v.parameter);},onExit:function(){var c=this;c.destroy();},onPlus:function(){this.oParentController.addNavigationParameter();},onMinus:function(){r(this);this.oParentController.removeNavigationParameter(this.getView());this.getView().destroy();},checkVisibilityOfPlusMinus:function(){var n=this.oParentController.getNavigationParameters();if(n.length===1){this.byId("idRemoveNavigationParameter").setVisible(false);}else{this.byId("idRemoveNavigationParameter").setVisible(true);}if(n[n.length-1]===this.getView()){this.byId("idAddNavigationParameter").setVisible(true);if(!this.byId("idRemoveNavigationParameter").hasStyleClass("lessIcon")){this.byId("idRemoveNavigationParameter").addStyleClass("lessIcon");}}else{this.byId("idAddNavigationParameter").setVisible(false);this.byId("idRemoveNavigationParameter").removeStyleClass("lessIcon");}},onKeyEntered:function(){this.byId("idNavigationParametersKey").setValueState(sap.ui.core.ValueState.None);s(this);},onValueEntered:function(){this.byId("idNavigationParametersValue").setValueState(sap.ui.core.ValueState.None);s(this);},validate:function(){if(a(this)&&!g(this)){this.byId("idNavigationParametersKey").setValueStateText("Gib Key ein");this.byId("idNavigationParametersKey").setValueState(sap.ui.core.ValueState.Error);return false;}if(!a(this)&&g(this)){this.byId("idNavigationParametersValue").setValueState(sap.ui.core.ValueState.Error);return false;}if(this.byId("idNavigationParametersKey").getValueState()===sap.ui.core.ValueState.Error){return false;}return true;}});}());