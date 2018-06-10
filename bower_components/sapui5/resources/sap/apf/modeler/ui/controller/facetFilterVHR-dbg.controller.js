/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require("sap.apf.modeler.ui.controller.requestOptions");
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");
(function() {
	"use strict";
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	var optionsValueModelBuilder = new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();
	var textManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
	sap.apf.modeler.ui.controller.requestOptions.extend("sap.apf.modeler.ui.controller.facetFilterVHR", {
		// Called on initialization of the view. Sets the static texts for all controls in UI
		setDisplayText : function() {
			var oController = this;
			var oTextReader = oController.getView().getViewData().oTextReader;
			oController.byId("idSourceLabel").setText(oTextReader("vhSource"));
			oController.byId("idEntityLabel").setText(oTextReader("vhEntity"));
			oController.byId("idSelectPropertiesLabel").setText(oTextReader("vhSelectProperties"));
			oController.byId("idOptionalRequestFieldLabel").setText(oTextReader("ffAlias"));
		},
		// Triggered when visibility is changed in facet filter view to clear/set values in FRR view 
		clearVHRFields : function(oEvent) {
			var oController = this;
			oController.clearSource();
			oController.addOrRemoveMandatoryFieldsAndRequiredFlag(false, oEvent);
			oController.setDetailData();
		},
		// Sets visibility of select box to true for selectable property 
		onBeforeRendering : function() {
			var oController = this;
			oController.byId("idOptionalRequestFieldLabel").setVisible(true);
			oController.byId("idOptionalRequestField").setVisible(true);
			oController.byId("idOptionalRequestField").setForceSelection(false);
		},
		// Adds the service, entity, properties fields for VHR after rendering
		onAfterRendering : function() {
			var oController = this;
			oController.addOrRemoveMandatoryFieldsAndRequiredFlag(true);
		},
		// Triggered when use same as VHR is selected in facet filter view and when changes are made in VHR source, entity set or select properties to update FRR View with same values as VHR
		fireRelevantEvents : function(oEvent) {
			var oController = this, aAlias;
			var oTextReader = oController.getView().getViewData().oTextReader;
			if (oEvent.getSource() === oController.byId("idSource")) {
				oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.UPDATEPROPERTIES);
			}
			if (oEvent.getSource() !== oController.byId("idOptionalRequestField")) {
				aAlias = [ textManipulator.removePrefixText(oController.byId("idOptionalRequestField").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)) ];
				oController.updateOptionalRequestFieldProperty(aAlias);
			}
			if (oController.oParentObject.getUseSameRequestForValueHelpAndFilterResolution()) {
				oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.USESAMEASVHR);
			}
		},
		setOptionalRequestFieldProperty : function() {
			var oController = this;
			var aAllAlias = [], aValidatedValues, sFFAlias;
			aAllAlias = oController.byId("idSelectProperties").getSelectedKeys();
			sFFAlias = oController.oParentObject.getAlias();
			//Validate selected values
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sFFAlias)) {
				aValidatedValues = oController.validateSelectedValues(oController, [ sFFAlias ], aAllAlias);
				sFFAlias = aValidatedValues.aSelectedValues[0];
			}
			var oModelForFFProp = optionsValueModelBuilder.convert(aAllAlias);
			oController.byId("idOptionalRequestField").setModel(oModelForFFProp);
			oController.byId("idOptionalRequestField").setSelectedKey(sFFAlias);
		},
		updateOptionalRequestFieldProperty : function(aSelectedAlias) {
			var oController = this;
			oController.oParentObject.setAlias(undefined);
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aSelectedAlias[0])) {
				oController.oParentObject.setAlias(aSelectedAlias[0]);
			}
		},
		removeOptionalRequestFieldProperty : function(aProperties) {
			var oController = this;
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aProperties[0])) {
				oController.oParentObject.setAlias(undefined);
			}
		},
		// Adds/removes required tag to entity set and select properties fields and accepts a boolean to determine required
		addOrRemoveMandatoryFieldsAndRequiredFlag : function(bRequired, oEvent) {
			var oController = this;
			if (bRequired === false && oEvent === undefined) {
				return;
			}
			oController.byId("idSourceLabel").setRequired(bRequired);
			oController.byId("idEntityLabel").setRequired(bRequired);
			oController.byId("idSelectPropertiesLabel").setRequired(bRequired);
			if (bRequired) {
				oController.viewValidator.addFields([ "idSource", "idEntity", "idSelectProperties" ]);
			} else {
				oController.viewValidator.removeFields([ "idSource", "idEntity", "idSelectProperties" ]);
			}
		},
		// returns value help service
		getSource : function() {
			var oController = this;
			return oController.oParentObject.getServiceOfValueHelp();
		},
		// returns all entity sets in a service
		getAllEntitiesAsPromise : function(sSource) {
			var oController = this;
			return oController.oConfigurationEditor.getAllEntitySetsOfServiceAsPromise(sSource);
		},
		// returns value help entity set
		getEntity : function() {
			var oController = this;
			return oController.oParentObject.getEntitySetOfValueHelp();
		},
		// returns all properties in a particular entity set of a service
		getAllEntitySetPropertiesAsPromise : function(sSource, sEntitySet) {
			var oController = this;
			return oController.oConfigurationEditor.getAllPropertiesOfEntitySetAsPromise(sSource, sEntitySet);
		},
		// clearSource clears value help service. It calls clears entity to clear value help entity as well. Clear entity calls clear select properties on VHR
		clearSource : function() {
			var oController = this;
			oController.oParentObject.setServiceOfValueHelp(undefined);
			oController.clearEntity();
		},
		clearEntity : function() {
			var oController = this;
			oController.oParentObject.setEntitySetOfValueHelp(undefined);
			oController.clearSelectProperties();
		},
		clearSelectProperties : function() {
			var oController = this;
			var aOldSelProp = oController.oParentObject.getSelectPropertiesOfValueHelp();
			aOldSelProp.forEach(function(property) {
				oController.oParentObject.removeSelectPropertyOfValueHelp(property);
			});
			oController.clearOptionalRequestFieldProperty();
		},
		removeSelectProperties : function(aProperties) {
			var oController = this;
			aProperties.forEach(function(property) {
				oController.oParentObject.removeSelectPropertyOfValueHelp(property);
			});
		},
		clearOptionalRequestFieldProperty : function() {
			var oController = this;
			oController.oParentObject.setAlias(undefined);
		},
		// updates value help service
		updateSource : function(sSource) {
			var oController = this;
			oController.oParentObject.setServiceOfValueHelp(sSource);
		},
		// updates value help entity set
		updateEntity : function(sEntity) {
			var oController = this;
			oController.oParentObject.setEntitySetOfValueHelp(sEntity);
		},
		// updates value help select properties
		updateSelectProperties : function(aSelectProperties) {
			var oController = this;
			oController.removeSelectProperties(oController.oParentObject.getSelectPropertiesOfValueHelp());
			aSelectProperties.forEach(function(property) {
				oController.oParentObject.addSelectPropertyOfValueHelp(property);
			});
		},
		// returns value help select properties
		getSelectProperties : function() {
			var oController = this;
			return oController.oParentObject.getSelectPropertiesOfValueHelp();
		},
		getOptionalRequestFieldProperty : function() {
			var oController = this;
			return [ oController.oParentObject.getAlias() ];
		},
		// returns the current validation state of sub view
		getValidationState : function() {
			var oController = this;
			return oController.viewValidator.getValidationState();
		}
	});
}());
