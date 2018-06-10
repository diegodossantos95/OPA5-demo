/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require("sap.apf.modeler.ui.controller.requestOptions");
(function() {
	"use strict";
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	var textManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
	sap.apf.modeler.ui.controller.requestOptions.extend("sap.apf.modeler.ui.controller.stepFilterMapping", {
		// Hide multicombox for target filter properties and insert select box instead
		onBeforeRendering : function() {
			var oController = this;
			oController.byId("idSelectPropertiesLabel").setVisible(false);
			oController.byId("idSelectProperties").setVisible(false);
			oController.byId("idOptionalRequestFieldLabel").setVisible(true);
			oController.byId("idOptionalRequestField").setVisible(true);
			oController.byId("idOptionalRequestField").setForceSelection(false);
		},
		getIdOfPropertiesControl : function() {
			return "idOptionalRequestField";
		},
		getIdOfPropertyLabel : function() {
			return "idOptionalRequestFieldLabel";
		},
		setSelectedKeysForProperties : function(aProperties) {
			var oController = this;
			//If we give undefined or [] as selectedkey, previous selected key is retained.So clearSelection is required. 
			if (aProperties.length !== 0) {
				oController.byId("idOptionalRequestField").setSelectedKey(aProperties[0]);
			} else {
				oController.byId("idOptionalRequestField").clearSelection();
			}
		},
		getSelectedKeysForProperties : function() {
			var oController = this, sSelectedKey, aSelectedKey;
			var oTextReader = oController.getView().getViewData().oTextReader;
			sSelectedKey = textManipulator.removePrefixText(oController.byId("idOptionalRequestField").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			aSelectedKey = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSelectedKey) ? [ sSelectedKey ] : [];
			return aSelectedKey;
		},
		setDisplayText : function() {
			var oController = this;
			var oTextReader = oController.getView().getViewData().oTextReader;
			oController.byId("idSourceLabel").setText(oTextReader("source"));
			oController.byId("idEntityLabel").setText(oTextReader("entity"));
			oController.byId("idOptionalRequestFieldLabel").setText(oTextReader("targetProperty"));
		},
		resetEntityAndProperties : function() {
			var oController = this;
			oController.clearEntity();
			oController.byId("idEntity").setModel(null);
			oController.byId("idEntity").setSelectedKey(undefined);
			oController.clearSelectProperties();
			oController.byId("idOptionalRequestField").setModel(null);
			oController.byId("idOptionalRequestField").setSelectedKey(undefined);
		},
		resetFilterMappingFields : function() {
			var oController = this;
			oController.clearSource();
			oController.byId("idSource").setValue("");
			oController.resetEntityAndProperties();
			oController.addOrRemoveMandatoryFieldsAndRequiredFlag(false);
		},
		updateFilterMappingFields : function() {
			var oController = this, sSource, sEntity, sEntitySet, sSelectProperty, aSelectProperties;
			var oTextReader = oController.getView().getViewData().oTextReader;
			sSource = oController.byId("idSource").getValue().trim();
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSource)) {
				if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oController.getAllEntities(sSource))) {
					oController.resetEntityAndProperties();
					return;
				}
				oController.setDetailData();
				//set entity
				sEntity = textManipulator.removePrefixText(oController.byId("idEntity").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
				sEntitySet = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sEntity) ? sEntity : undefined;
				oController.updateEntity(sEntitySet);
				//set properties
				sSelectProperty = textManipulator.removePrefixText(oController.byId("idOptionalRequestField").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
				aSelectProperties = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSelectProperty) ? [ sSelectProperty ] : [];
				oController.updateSelectProperties(aSelectProperties);
			}
			oController.oConfigurationEditor.setIsUnsaved();
		},
		getSource : function() {
			var oController = this;
			return oController.oParentObject.getFilterMappingService();
		},
		getAllEntitiesAsPromise : function(sSource) {
			var oController = this;
			return oController.oConfigurationEditor.getAllEntitySetsOfServiceWithGivenPropertiesAsPromise(sSource, oController.oParentObject.getFilterProperties());
		},
		getEntity : function() {
			var oController = this;
			return oController.oParentObject.getFilterMappingEntitySet();
		},
		getAllEntitySetPropertiesAsPromise : function(sSource, sEntitySet) {
			var oController = this;
			return oController.oConfigurationEditor.getAllPropertiesOfEntitySetAsPromise(sSource, sEntitySet);
		},
		clearSource : function() {
			var oController = this;
			oController.oParentObject.setFilterMappingService(undefined);
			oController.clearEntity();
		},
		clearEntity : function() {
			var oController = this;
			oController.oParentObject.setFilterMappingEntitySet(undefined);
			oController.clearSelectProperties();
		},
		clearSelectProperties : function() {
			var oController = this;
			var aOldSelProp = oController.oParentObject.getFilterMappingTargetProperties();
			aOldSelProp.forEach(function(property) {
				oController.oParentObject.removeFilterMappingTargetProperty(property);
			});
		},
		removeSelectProperties : function(aProperties) {
			var oController = this;
			aProperties.forEach(function(property) {
				oController.oParentObject.removeFilterMappingTargetProperty(property);
			});
		},
		updateSource : function(sSource) {
			var oController = this;
			oController.oParentObject.setFilterMappingService(sSource);
		},
		updateEntity : function(sEntity) {
			var oController = this;
			oController.oParentObject.setFilterMappingEntitySet(sEntity);
		},
		updateSelectProperties : function(aSelectProperties) {
			var oController = this;
			oController.clearSelectProperties();
			aSelectProperties.forEach(function(property) {
				oController.oParentObject.addFilterMappingTargetProperty(property);
			});
		},
		updateOptionalRequestFieldProperty : function(aFilterProperties) {
			var oController = this;
			oController.updateSelectProperties(aFilterProperties);
		},
		getSelectProperties : function() {
			var oController = this;
			return oController.oParentObject.getFilterMappingTargetProperties();
		},
		getValidationState : function() {
			var oController = this;
			return oController.viewValidator.getValidationState();
		}
	});
}());