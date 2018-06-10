/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
jQuery.sap.require("sap.apf.modeler.ui.controller.sortPropertyType");
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");
(function() {
	"use strict";
	var oTextManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
	sap.apf.modeler.ui.controller.sortPropertyType.extend("sap.apf.modeler.ui.controller.representationSortPropertyType", {
		onBeforeRendering : function() {
			var oController = this;
			oController.byId("idGridSortLabel").setSpan("L2 M2 S2");
			oController.byId("idGridSortProperty").setSpan("L4 M4 S4");
			oController.byId("idGridSortDirectionLabel").setSpan("L2 M2 S2");
			oController.byId("idGridSortDirection").setSpan("L3 M3 S2");
			oController.byId("idGridIconLayout").setSpan("L1 M1 S1");
		},
		disableView : function() {
			var oController = this;
			if (oController.oStepPropertyMetadataHandler.oStep.getTopN()) {
				oController.byId("idSortProperty").setEnabled(false);
				oController.byId("idSortDirection").setEnabled(false);
				oController.byId("idAddPropertyIcon").setVisible(false);
				oController.byId("idRemovePropertyIcon").setVisible(false);
			}
		},
		getAllPropertiesAsPromise : function() {
			var oController = this, aAllProperties, sSelectedKey, aPropertiesWithSelectedKey;
			var deferred = jQuery.Deferred();
			oController.oStepPropertyMetadataHandler.oStep.getConsumableSortPropertiesForRepresentation(oController.oParentObject.getId()).done(function(oResponse) {
				aAllProperties = oResponse.consumable;
				sSelectedKey = oController.getSelectedSortProperty();
				if (sSelectedKey !== oController.oTextReader("none") && sSelectedKey !== undefined) {
					aPropertiesWithSelectedKey = aAllProperties.indexOf(sSelectedKey) !== -1 ? aAllProperties : aAllProperties.concat(sSelectedKey);
					aAllProperties = oResponse.available.indexOf(sSelectedKey) !== -1 ? aPropertiesWithSelectedKey : aAllProperties.concat(oTextManipulator.addPrefixText([ sSelectedKey ], oController.oTextReader));
					sSelectedKey = oResponse.available.indexOf(sSelectedKey) !== -1 ? sSelectedKey : oTextManipulator.addPrefixText([ sSelectedKey ], oController.oTextReader)[0];
				}
				aAllProperties.splice(0, 0, oController.oTextReader("none"));
				deferred.resolve({
					aAllProperties : aAllProperties,
					sSelectedKey : sSelectedKey
				});
			});
			return deferred.promise();
		},
		updateSortProperties : function(aSortPropertiesInformation) {
			var oController = this;
			oController.oParentObject.removeAllOrderbySpecs();
			aSortPropertiesInformation.forEach(function(oOrderBySpec) {
				oController.oParentObject.addOrderbySpec(oOrderBySpec.property, oOrderBySpec.ascending);
			});
		},
		getOrderBy : function() {
			var oController = this;
			return oController.oParentObject.getOrderbySpecifications();
		},
		setNextPropertyInParentObject : function() {
			var oController = this;
			oController.updateSortProperty(oController.getView().getViewData().oPropertyTypeData.sProperty, oController.getView().getViewData().oPropertyTypeData.sContext);
			oController.byId("idSortDirection").setSelectedKey("true");
		},
		removePropertyFromParentObject : function() {
			var oController = this;
			oController.oParentObject.removeOrderbySpec(oTextManipulator.removePrefixText(oController.byId("idSortProperty").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)));
		},
		addPropertyAsPromise : function() {
			var oController = this;
			var deferred = jQuery.Deferred();
			var oConstants = sap.apf.modeler.ui.utils.CONSTANTS.events;
			oController.oStepPropertyMetadataHandler.oStep.getConsumableSortPropertiesForRepresentation(oController.oParentObject.getId()).done(function(oResponse) {
				oController.getView().fireEvent(oConstants.ADDPROPERTY, {
					"sProperty" : oResponse.consumable[0],
					"sContext" : oController.getView().getViewData().oPropertyTypeData.sContext
				});
				oController.oConfigurationEditor.setIsUnsaved();
				deferred.resolve();
			});
			return deferred.promise();
		},
		addRemovedProperty : function(oEvent) {
			var oController = this;
			var sProperty = oEvent.getParameter("sProperty");
			var oItem = new sap.ui.core.Item({
				key : sProperty,
				text : sProperty
			});
			oController.byId("idSortProperty").addItem(oItem);
		},
		removeAddedProperty : function(oEvent) {
			var oController = this;
			var sProperty = oEvent.getParameter("sProperty");
			var aItems = oController.byId("idSortProperty").getItems();
			aItems.forEach(function(oItem) {
				if (oItem.getKey() === sProperty) {
					oController.byId("idSortProperty").removeItem(oItem);
				}
			});
		}
	});
}());
