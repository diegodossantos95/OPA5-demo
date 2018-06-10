/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require("sap.apf.modeler.ui.controller.requestOptions");
sap.ui.define([ "sap/apf/modeler/ui/controller/requestOptions" ], function(BaseController) {
	"use strict";
	var optionsValueModelBuilder = new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();
	var textManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	return BaseController.extend("sap.apf.modeler.ui.controller.stepRequest", {
		// Sets visibility of select box to true for selectable property 
		onBeforeRendering : function() {
			var oController = this;
			oController.byId("idOptionalRequestFieldLabel").setVisible(true);
			oController.byId("idOptionalRequestField").setVisible(true);
		},
		onAfterRendering : function() {
			var oController = this;
			oController.addOrRemoveMandatoryFieldsAndRequiredFlag(true);
		},
		setDisplayText : function() {
			var oController = this;
			var oTextReader = oController.getView().getViewData().oTextReader;
			oController.byId("idSourceLabel").setText(oTextReader("source"));
			oController.byId("idEntityLabel").setText(oTextReader("entity"));
			oController.byId("idSelectPropertiesLabel").setText(oTextReader("selectProperties"));
			oController.byId("idOptionalRequestFieldLabel").setText(oTextReader("requiredFilters"));
		},
		setOptionalRequestFieldProperty : function() {
			var oController = this;
			var aProperties, oModelForFilterProperties, aFilterProperties, aNoneProperty, aValidatedValues = [];
			aNoneProperty = [ oController.getView().getViewData().oTextReader("none") ];
			aProperties = oController.byId("idSelectProperties").getSelectedKeys();
			aFilterProperties = oController.oParentObject.getFilterProperties();
			//setModel on the select box
			oModelForFilterProperties = optionsValueModelBuilder.convert(aNoneProperty.concat(aProperties));
			oController.byId("idOptionalRequestField").setModel(oModelForFilterProperties);
			oController.byId("idOptionalRequestField").setSelectedKey(aNoneProperty[0]);// Default state - None should be selected - For New/when select properties are not present select None
			//Validate selected values
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aFilterProperties)) {
				aValidatedValues = oController.validateSelectedValues(oController, aFilterProperties, aProperties);
				aFilterProperties = aValidatedValues.aSelectedValues;
				oController.byId("idOptionalRequestField").setSelectedKey(aFilterProperties[0]);
			}
		},
		addOrRemoveMandatoryFieldsAndRequiredFlag : function(bRequired) {
			var oController = this;
			if (bRequired === false) {
				return;
			}
			oController.byId("idSourceLabel").setRequired(bRequired);
			oController.byId("idEntityLabel").setRequired(bRequired);
			oController.byId("idSelectPropertiesLabel").setRequired(bRequired);
			oController.viewValidator.addFields([ "idSource", "idEntity", "idSelectProperties" ]);
		},
		fireRelevantEvents : function(oEvt) {
			var oController = this, sFilterProperty, bShowFilterMappingLayout;
			if (oEvt.getSource() !== oController.byId("idOptionalRequestField")) {
				sFilterProperty = [ textManipulator.removePrefixText(oController.byId("idOptionalRequestField").getSelectedKey(), oController.getView().getViewData().oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)) ];
				if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sFilterProperty)) {
					oController.updateOptionalRequestFieldProperty(sFilterProperty);
				}
				if (oController.getSelectProperties().length === 0) {
					oController.oParentObject.resetTopN();
				}
				oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETDATAREDUCTIONSECTION);
			}
			if (oEvt.getSource() === oController.byId("idOptionalProperty")) {
				oController.setOptionalRequestFieldProperty();
			}
			bShowFilterMappingLayout = (oController.byId("idOptionalRequestField").getSelectedKey() !== oController.getView().getViewData().oTextReader("none")) ? true : false;
			oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS, {
				"bShowFilterMappingLayout" : bShowFilterMappingLayout
			});
			oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS);
		},
		getSource : function() {
			return this.oParentObject.getService();
		},
		getAllEntitiesAsPromise : function(sSource) {
			return this.oConfigurationEditor.getAllEntitySetsOfServiceAsPromise(sSource);
		},
		getEntity : function() {
			return this.oParentObject.getEntitySet();
		},
		getAllEntitySetPropertiesAsPromise : function(sSource, sEntitySet) {
			return this.oConfigurationEditor.getAllPropertiesOfEntitySetAsPromise(sSource, sEntitySet);
		},
		resetEntityAndProperties : function() {
			var oController = this;
			oController.clearEntity();
			oController.byId("idEntity").setModel(null);
			oController.byId("idEntity").setSelectedKey(undefined);
			oController.clearSelectProperties();
			oController.byId("idSelectProperties").setModel(null);
			oController.byId("idSelectProperties").setSelectedKeys([]);
			oController.byId("idOptionalRequestField").setModel(null);
			oController.byId("idOptionalRequestField").setSelectedKey(undefined);
		},
		clearSource : function() {
			var oController = this;
			oController.oParentObject.setService(undefined);
			oController.clearEntity();
		},
		clearEntity : function() {
			var oController = this;
			oController.oParentObject.setEntitySet(undefined);
			oController.clearSelectProperties();
		},
		clearSelectProperties : function() {
			var oController = this;
			var aOldSelProp = oController.oParentObject.getSelectProperties();
			aOldSelProp.forEach(function(property) {
				oController.oParentObject.removeSelectProperty(property);
			});
			oController.clearOptionalRequestFieldProperty();
		},
		clearOptionalRequestFieldProperty : function() {
			var oController = this;
			var aOldSelProp = oController.oParentObject.getFilterProperties();
			aOldSelProp.forEach(function(property) {
				oController.oParentObject.removeFilterProperty(property);
			});
		},
		removeSelectProperties : function(aProperties) {
			var oController = this;
			aProperties.forEach(function(property) {
				oController.oParentObject.removeSelectProperty(property);
			});
		},
		removeOptionalRequestFieldProperty : function(aProperties) {
			var oController = this;
			aProperties.forEach(function(property) {
				oController.oParentObject.removeFilterProperty(property);
			});
		},
		updateSource : function(sSource) {
			var oController = this;
			oController.oParentObject.setService(sSource);
		},
		updateEntity : function(sEntity) {
			var oController = this;
			oController.oParentObject.setEntitySet(sEntity);
		},
		updateSelectProperties : function(aSelectProperties) {
			var oController = this;
			oController.removeSelectProperties(oController.oParentObject.getSelectProperties());
			aSelectProperties.forEach(function(property) {
				oController.oParentObject.addSelectProperty(property);
			});
		},
		updateOptionalRequestFieldProperty : function(aFilterProperties) {
			var oController = this;
			oController.removeOptionalRequestFieldProperty(oController.oParentObject.getFilterProperties());
			aFilterProperties.forEach(function(property) {
				if (property !== oController.getView().getViewData().oTextReader("none")) {
					oController.oParentObject.addFilterProperty(property);
				}
			});
		},
		getSelectProperties : function() {
			var oController = this;
			return oController.oParentObject.getSelectProperties();
		},
		getOptionalRequestFieldProperty : function() {
			var oController = this;
			return oController.oParentObject.getFilterProperties();
		},
		getValidationState : function() {
			var oController = this;
			return oController.viewValidator.getValidationState();
		}
	});
});
