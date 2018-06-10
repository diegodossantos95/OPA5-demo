/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.apf.modeler.ui.utils.treeTableDisplayOptionsValueBuilder");
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");
sap.ui.define([ "sap/apf/modeler/ui/controller/propertyType" ], function(BaseController) {
	"use strict";
	var oTextManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
	function _getNodeIdForHierarchicalProperty(oEntityTypeMetadata, oController) {
		var bIsTextPropertyPresent;
		var sService = oController.oStepPropertyMetadataHandler.oStep.getService();
		var sEntitySet = oController.oStepPropertyMetadataHandler.oStep.getEntitySet();
		var sHierarchyProperty = oController.oStepPropertyMetadataHandler.oStep.getHierarchyProperty();
		oController.oConfigurationEditor.getHierarchyNodeIdAsPromise(sService, sEntitySet, sHierarchyProperty).done(function(sNodeId) {
			bIsTextPropertyPresent = oController.oStepPropertyMetadataHandler.hasTextPropertyOfDimension(oEntityTypeMetadata, sNodeId);
		});
		return bIsTextPropertyPresent;
	}
	return BaseController.extend("sap.apf.modeler.ui.controller.representationHierarchyProperty", {
		onBeforeRendering : function() {
			var oController = this;
			oController.byId("idPropertyType").setEnabled(false);
		},
		setLabelDisplayOptionTypeAsPromise : function(optionsValueModelBuilder) {
			var deferred = jQuery.Deferred();
			var displayOptionsValueBuilder, oLabelDisplayOptions, oModelForDisplayText, sLabelDisplayOption, oController = this, aLabelDisplayOptionWithPrefix = [];
			displayOptionsValueBuilder = new sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder(oController.oTextReader, optionsValueModelBuilder);
			oLabelDisplayOptions = sap.apf.core.constants.representationMetadata.labelDisplayOptions;
			sLabelDisplayOption = oController.oRepresentation.getHierarchyPropertyLabelDisplayOption();
			oModelForDisplayText = displayOptionsValueBuilder.getLabelDisplayOptions();
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {
				if ((sLabelDisplayOption === oLabelDisplayOptions.TEXT) && !_getNodeIdForHierarchicalProperty(oEntityTypeMetadata, oController)) {
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
		changeDisplayOptionsLabel : function(sLabelDisplayOption) {
			var oController = this;
			oController.oRepresentation.setHierarchyPropertyLabelDisplayOption(sLabelDisplayOption);
		},
		getAllPropertiesAsPromise : function() {
			var oController = this, sSelectedKey, aPropertiesWithSelectedKey, aHierarchicalProperties = [];
			var oStep = oController.oStepPropertyMetadataHandler.oStep;
			var deferred = jQuery.Deferred();
			oStep.getConsumablePropertiesForRepresentation(oController.oRepresentation.getId()).done(function(oResponse) {
				oResponse.available.forEach(function(sProperty) {
					if (sProperty === oController.oStepPropertyMetadataHandler.getHierarchicalProperty()) {
						aHierarchicalProperties.push(sProperty);
					}
				});
				sSelectedKey = oController.getSelectedProperty();
				if (sSelectedKey !== undefined) {
					aPropertiesWithSelectedKey = aHierarchicalProperties.indexOf(sSelectedKey) !== -1 ? aHierarchicalProperties : aHierarchicalProperties.concat(sSelectedKey);
					if (oResponse.available.indexOf(sSelectedKey) !== -1) {
						aHierarchicalProperties = aPropertiesWithSelectedKey;
						sSelectedKey = sSelectedKey;
					} else {
						aHierarchicalProperties = aHierarchicalProperties.concat(oTextManipulator.addPrefixText([ sSelectedKey ], oController.oTextReader));
						sSelectedKey = oTextManipulator.addPrefixText([ sSelectedKey ], oController.oTextReader)[0];
					}
				}
				deferred.resolve({
					aAllProperties : aHierarchicalProperties,
					sSelectedKey : sSelectedKey
				});
			});
			return deferred.promise();
		},
		enableDisableLabelDisplayOptionTypeAsPromise : function() {
			var itemIndex, oController = this;
			var deferred = jQuery.Deferred();
			var displayLabelOptionBox = oController.byId("idLabelDisplayOptionType");
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				var bIsTextPropertyPresent = _getNodeIdForHierarchicalProperty(entityTypeMetadata, oController);
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
		getPropertyTextLabelKey : function() {
			var oController = this;
			return oController.oRepresentation.getHierarchyPropertyTextLabelKey();
		},
		setPropertyTextLabelKey : function(sPropertyName, sLabelTextKey) {
			var oController = this;
			oController.oRepresentation.setHierarchyPropertyTextLabelKey(sLabelTextKey);
		},
		setNextPropertyInParentObject : function() {
			return;
		},
		removeAddedProperty : function() {
			return;
		},
		addRemovedProperty : function() {
			return;
		},
		removePropertyFromParentObject : function() {
			return;
		},
		setFocusOnRemoveIcons : function() {
			return;
		}
	});
});