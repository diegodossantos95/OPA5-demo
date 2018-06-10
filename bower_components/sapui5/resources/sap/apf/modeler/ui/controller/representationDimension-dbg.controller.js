/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.apf.modeler.ui.utils.displayOptionsValueBuilder");
jQuery.sap.require("sap.apf.modeler.ui.controller.propertyType");
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");
(function() {
	"use strict";
	var oRepnMetadataConstants = sap.apf.core.constants.representationMetadata;
	var oTextManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
	sap.apf.modeler.ui.controller.propertyType.extend("sap.apf.modeler.ui.controller.representationDimension", {
		setLabelDisplayOptionTypeAsPromise : function(optionsValueModelBuilder) {
			var deferred = jQuery.Deferred();
			var displayOptionsValueBuilder, oLabelDisplayOptions, oModelForDisplayText, sPropertyName, sLabelDisplayOption, oController = this, aLabelDisplayOptionWithPrefix = [];
			displayOptionsValueBuilder = new sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder(oController.oTextReader, optionsValueModelBuilder);
			oLabelDisplayOptions = sap.apf.core.constants.representationMetadata.labelDisplayOptions;
			sPropertyName = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			sLabelDisplayOption = oController.oRepresentation.getLabelDisplayOption(sPropertyName);
			oModelForDisplayText = displayOptionsValueBuilder.getLabelDisplayOptions();
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {
				if ((sLabelDisplayOption === oLabelDisplayOptions.KEY_AND_TEXT || sLabelDisplayOption === oLabelDisplayOptions.TEXT) && !oController.oStepPropertyMetadataHandler.hasTextPropertyOfDimension(oEntityTypeMetadata, sPropertyName)) {
					oModelForDisplayText = displayOptionsValueBuilder.getValidatedLabelDisplayOptions();
					aLabelDisplayOptionWithPrefix = oTextManipulator.addPrefixText([ sLabelDisplayOption ], oController.oTextReader);
					sLabelDisplayOption = aLabelDisplayOptionWithPrefix[0];
				}
				oController.byId("idLabelDisplayOptionType").setModel(oModelForDisplayText);
				oController.byId("idLabelDisplayOptionType").setSelectedKey(sLabelDisplayOption);
				deferred.resolve();
			});
			return deferred.promise();
		},
		getAllPropertiesAsPromise : function() {
			var oController = this, aAllProperties, sSelectedKey, aPropertiesWithSelectedKey, sAggRole, aDimensions = [];
			var oStep = oController.oStepPropertyMetadataHandler.oStep;
			var oConstants = sap.apf.modeler.ui.utils.CONSTANTS;
			var deferred = jQuery.Deferred();
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				oStep.getConsumablePropertiesForRepresentation(oController.oRepresentation.getId()).done(function(oResponse) {
					aAllProperties = oResponse.consumable;
					aAllProperties.forEach(function(sProperty) {
						if (oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)) {
							sAggRole = oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)["aggregation-role"];
							if (sAggRole === oConstants.aggregationRoles.DIMENSION) {
								aDimensions.push(sProperty);
							}
						}
					});
					sSelectedKey = oController.getSelectedProperty();
					if (sSelectedKey !== undefined) {
						aPropertiesWithSelectedKey = aDimensions.indexOf(sSelectedKey) !== -1 ? aDimensions : aDimensions.concat(sSelectedKey);
						aDimensions = oResponse.available.indexOf(sSelectedKey) !== -1 ? aPropertiesWithSelectedKey : aDimensions.concat(oTextManipulator.addPrefixText([ sSelectedKey ], oController.oTextReader));
						sSelectedKey = oResponse.available.indexOf(sSelectedKey) !== -1 ? sSelectedKey : oTextManipulator.addPrefixText([ sSelectedKey ], oController.oTextReader)[0];
					}
					deferred.resolve({
						aAllProperties : aDimensions,
						sSelectedKey : sSelectedKey
					});
				});
			});
			return deferred.promise();
		},
		getPropertyTextLabelKey : function(sPropertyName) {
			var oController = this;
			return oController.oRepresentation.getDimensionTextLabelKey(sPropertyName);
		},
		removeProperties : function() {
			var oController = this;
			oController.getView().getViewData().oRepresentationHandler.getActualDimensions().forEach(function(sPropertyData) {
				oController.oRepresentation.removeDimension(sPropertyData.sProperty);
			});
		},
		updateProperties : function(aPropertiesInformation) {
			var oController = this;
			oController.removeProperties();
			aPropertiesInformation.forEach(function(oPropertiesInformation) {
				oController.oRepresentation.addDimension(oPropertiesInformation.sProperty);
				oController.oRepresentation.setDimensionKind(oPropertiesInformation.sProperty, oPropertiesInformation.sKind);
				oController.oRepresentation.setLabelDisplayOption(oPropertiesInformation.sProperty, oPropertiesInformation.sLabelDisplayOption);
				oController.oRepresentation.setDimensionTextLabelKey(oPropertiesInformation.sProperty, oPropertiesInformation.sTextLabelKey);
			});
		},
		createNewPropertyInfoAsPromise : function(sNewProperty) {
			var deferred = jQuery.Deferred();
			var oController = this, oNewPropertyInfo = {};
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				var bIsTextPropertyPresent = oController.oStepPropertyMetadataHandler.hasTextPropertyOfDimension(entityTypeMetadata, sNewProperty);
				oNewPropertyInfo.sProperty = sNewProperty;
				oNewPropertyInfo.sKind = oController.getView().getViewData().oPropertyTypeData.sContext;
				oNewPropertyInfo.sLabelDisplayOption = bIsTextPropertyPresent ? oRepnMetadataConstants.labelDisplayOptions.KEY_AND_TEXT : oRepnMetadataConstants.labelDisplayOptions.KEY;
				oNewPropertyInfo.sTextLabelKey = undefined;
				deferred.resolve(oNewPropertyInfo);
			});
			return deferred.promise();
		},
		createCurrentProperiesInfo : function(sDimension) {
			var oCurrentPropertiesInformation = {}, oController = this;
			oCurrentPropertiesInformation.sProperty = sDimension;
			oCurrentPropertiesInformation.sKind = oController.oRepresentation.getDimensionKind(sDimension);
			oCurrentPropertiesInformation.sLabelDisplayOption = oController.oRepresentation.getLabelDisplayOption(sDimension);
			oCurrentPropertiesInformation.sTextLabelKey = oController.oRepresentation.getDimensionTextLabelKey(sDimension);
			return oCurrentPropertiesInformation;
		},
		setPropertyTextLabelKey : function(sPropertyName, sLabelTextKey) {
			var oController = this;
			oController.oRepresentation.setDimensionTextLabelKey(sPropertyName, sLabelTextKey);
		},
		setNextPropertyInParentObject : function() {
			var oController = this;
			var sProperty = oController.getView().getViewData().oPropertyTypeData.sProperty;
			oController.updatePropertyTypeAsPromise(sProperty).done(function() {
				oController.setDetailData();
			});
		},
		enableDisableLabelDisplayOptionTypeAsPromise : function() {
			var itemIndex, oController = this;
			var deferred = jQuery.Deferred();
			var displayLabelOptionBox = oController.byId("idLabelDisplayOptionType");
			var sPropertyName = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				var bIsTextPropertyPresent = oController.oStepPropertyMetadataHandler.hasTextPropertyOfDimension(entityTypeMetadata, sPropertyName);
				for(itemIndex = 0; itemIndex < displayLabelOptionBox.getItems().length; itemIndex++) {
					displayLabelOptionBox.getItems()[itemIndex].setEnabled(true);
					if (itemIndex > 0 && !bIsTextPropertyPresent) {
						displayLabelOptionBox.getItems()[itemIndex].setEnabled(false);
					}
				}
				deferred.resolve();
			});
			return deferred.promise();
		},
		changeDisplayOptionsLabel : function(sLabelDisplayOption){
			var oController = this;
			var sProperty = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			oController.oRepresentation.setLabelDisplayOption(sProperty, sLabelDisplayOption);
		},
		removePropertyFromParentObject : function() {
			var oController = this;
			oController.oRepresentation.removeDimension(oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)));
		},
		addPropertyAsPromise : function() {
			var deferred = jQuery.Deferred();
			var oController = this, sAggRole, aDimensions = [];
			var oStep = oController.oStepPropertyMetadataHandler.oStep;
			var oConstants = sap.apf.modeler.ui.utils.CONSTANTS;
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				oStep.getConsumablePropertiesForRepresentation(oController.oRepresentation.getId()).done(function(oResponse) {
					oResponse.consumable.forEach(function(sProperty) {
						if (oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)) {
							sAggRole = oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)["aggregation-role"];
							if (sAggRole === oConstants.aggregationRoles.DIMENSION) {
								aDimensions.push(sProperty);
							}
						}
					});
					oController.getView().fireEvent(oConstants.events.ADDPROPERTY, {
						"sProperty" : aDimensions[0],
						"sContext" : oController.getView().getViewData().oPropertyTypeData.sContext
					});
					oController.oConfigurationEditor.setIsUnsaved();
					deferred.resolve();
				});
			});
			return deferred.promise();
		}
	});
}());
