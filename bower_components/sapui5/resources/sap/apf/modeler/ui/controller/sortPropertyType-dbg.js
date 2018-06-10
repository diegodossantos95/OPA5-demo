/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");
jQuery.sap.require("sap.apf.modeler.ui.utils.staticValuesBuilder");
jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	"use strict";
	var optionsValueModelBuilder = new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();
	var oTextManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
	var oConstants = sap.apf.modeler.ui.utils.CONSTANTS.events;
	function _setDisplayText(oController) {
		oController.byId("idSortLabel").setText(oController.oTextReader("sortingField"));
		oController.byId("idSortLabel").setTooltip(oController.oTextReader("sortingField"));
		oController.byId("idSortDirectionLabel").setText(oController.oTextReader("direction"));
		oController.byId("idSortDirectionLabel").setTooltip(oController.oTextReader("direction"));
		oController.byId("idAddPropertyIcon").setTooltip(oController.oTextReader("addButton"));
		oController.byId("idRemovePropertyIcon").setTooltip(oController.oTextReader("deleteButton"));
	}
	function _setInvisibleTexts(oController) {
		oController.byId("idAriaPropertyForAdd").setText(oController.oTextReader("ariaTextForAddIcon"));
		oController.byId("idAriaPropertyForDelete").setText(oController.oTextReader("ariaTextForDeleteIcon"));
	}
	function _setSortProperty(oController) {
		var oModelForProperties;
		var element = oController.byId("idSortProperty");
		oController.getAllPropertiesAsPromise().done(function(oResponse) {
			oModelForProperties = optionsValueModelBuilder.convert(oResponse.aAllProperties);
			element.setModel(oModelForProperties);
			element.setSelectedKey(oResponse.sSelectedKey);
		});
	}
	function _setSortDirection(oController) {
		var staticValuesBuilder = new sap.apf.modeler.ui.utils.StaticValuesBuilder(oController.oTextReader, optionsValueModelBuilder);
		var oModelForSortDirections = staticValuesBuilder.getSortDirections();
		oController.byId("idSortDirection").setModel(oModelForSortDirections);
		oController.byId("idSortDirection").setSelectedKey(oController.getView().getViewData().oPropertyTypeData.sContext);
	}
	function _setVisibilityForAddAndRemoveIcons(oController) {
		var bShowAddIcon = true, bShowRemoveIcon = true;
		var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
		if (oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId()) === 0) {
			bShowRemoveIcon = false;
		}
		oController.byId("idAddPropertyIcon").setVisible(bShowAddIcon);
		oController.byId("idRemovePropertyIcon").setVisible(bShowRemoveIcon);
	}
	function _attachEvent(oController) {
		oController.byId("idAddPropertyIcon").attachEvent(oConstants.SETFOCUSONADDICON, oController.setFocusOnAddIcons.bind(oController));
	}
	sap.ui.core.mvc.Controller.extend("sap.apf.modeler.ui.controller.sortPropertyType", {
		oConfigurationEditor : {},
		oParentObject : {},
		oStepPropertyMetadataHandler : {},
		oTextReader : {},
		// Called on initialization of the sub view and set the static texts and data for all controls in sub view
		onInit : function() {
			var oController = this;
			oController.oConfigurationEditor = oController.getView().getViewData().oConfigurationEditor;
			oController.oParentObject = oController.getView().getViewData().oParentObject;
			oController.oStepPropertyMetadataHandler = oController.getView().getViewData().oStepPropertyMetadataHandler;
			oController.oTextReader = oController.getView().getViewData().oCoreApi.getText;
			oController.setDetailData();
		},
		onAfterRendering : function() {
			var oController = this;
			oController.byId("idAddPropertyIcon").fireEvent(oConstants.SETFOCUSONADDICON);
		},
		// Called on initialization of the view to set data on fields of sub view
		setDetailData : function() {
			var oController = this;
			_setDisplayText(oController);
			_setInvisibleTexts(oController);
			_setSortProperty(oController);
			_setSortDirection(oController);
			_setVisibilityForAddAndRemoveIcons(oController);
			oController.disableView();
		},
		handleChangeForSortProperty : function() {
			var oController = this;
			var nCurrentViewIndex = oController.getView().getViewData().oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
			var sOldSortProperty = oController.getView().getViewData().oPropertyTypeState.getPropertyValueState()[nCurrentViewIndex];
			var sNewSortProperty = oTextManipulator.removePrefixText(oController.byId("idSortProperty").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			var sDirection = oController.byId("idSortDirection").getSelectedKey() === "true" ? true : false;
			oController.getView().fireEvent(oConstants.UPDATEPROPERTYVALUESTATE, {
				"sProperty" : sNewSortProperty
			});
			oController.updateSortProperty(sNewSortProperty, sDirection);
			oController.getView().fireEvent(oConstants.UPDATEPROPERTY, {
				"sOldProperty" : sOldSortProperty
			});
			oController.oConfigurationEditor.setIsUnsaved();
		},
		handleChangeForSortDirection : function() {
			var oController = this;
			var sSortProperty = oTextManipulator.removePrefixText(oController.byId("idSortProperty").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			var sNewDirection = oController.byId("idSortDirection").getSelectedKey() === "true" ? true : false;
			oController.updateSortProperty(sSortProperty, sNewDirection);
			oController.oConfigurationEditor.setIsUnsaved();
		},
		setFocusOnAddIcons : function() {
			var oController = this;
			oController.byId("idAddPropertyIcon").focus();
		},
		setFocusOnRemoveIcons : function() {
			var oController = this;
			oController.byId("idSortProperty").focus();
		},
		handlePressOfAddPropertyIcon : function() {
			var oController = this;
			_attachEvent(oController);
			oController.addPropertyAsPromise();
		},
		handlePressOfRemovePropertyIcon : function() {
			var oController = this;
			oController.getView().fireEvent(oConstants.FOCUSONREMOVE);
			oController.getView().fireEvent(oConstants.REMOVEPROPERTY);
			oController.oConfigurationEditor.setIsUnsaved();
			oController.getView().destroy();
		},
		updateSortProperty : function(sSortProperty, sSortDirection) {
			var oController = this, nIndex, oNewSortPropertyInfo = {}, aSortPropertiesInformation = [];
			var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
			var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
			var aCurrentSortPropertiesState = oPropertyTypeState.getPropertyValueState();
			var nCurrentViewIndex = oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
			oNewSortPropertyInfo.property = sSortProperty;
			oNewSortPropertyInfo.ascending = sSortDirection;
			for(nIndex = 0; nIndex < aCurrentSortPropertiesState.length; nIndex++) {
				if (aCurrentSortPropertiesState[nIndex] === oController.oTextReader("none")) {
					continue;
				}
				if (nCurrentViewIndex === nIndex) {
					if (nullObjectChecker.checkIsNotUndefined(oNewSortPropertyInfo.property) && nullObjectChecker.checkIsNotUndefined(oNewSortPropertyInfo.ascending)) {
						aSortPropertiesInformation.push(oNewSortPropertyInfo);
					}
				} else {
					aSortPropertiesInformation.push(oController.createCurrentSortPropertiesInfo(aCurrentSortPropertiesState[nIndex]));
				}
			}
			oController.updateSortProperties(aSortPropertiesInformation);
		},
		createCurrentSortPropertiesInfo : function(sSortProperty, sSortDirection) {
			var oController = this, oCurrentSortPropertiesInformation = {}, sSortDirection = true;
			var aOrderBySpecs = oController.getOrderBy();
			aOrderBySpecs.forEach(function(oOrderBySpec) {
				if (oOrderBySpec.property === sSortProperty) {
					sSortDirection = oOrderBySpec.ascending;
				}
			});
			oCurrentSortPropertiesInformation.property = sSortProperty;
			oCurrentSortPropertiesInformation.ascending = sSortDirection;
			return oCurrentSortPropertiesInformation;
		},
		getSelectedSortProperty : function() {
			var oController = this;
			var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
			var aCurrentSortPropertiesState = oPropertyTypeState.getPropertyValueState();
			var nCurrentViewIndex = oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
			return aCurrentSortPropertiesState[nCurrentViewIndex];
		},
		// Stubs to be implemented in sub views depending on sub view logic
		updateSortProperties : function(aSortPropertiesInformation) {
		},
		getOrderBy : function() {
		},
		setNextPropertyInParentObject : function() {
		},
		removePropertyFromParentObject : function() {
		},
		disableView : function() {
		},
		addPropertyAsPromise : function() {
			return sap.apf.utils.createPromise();
		}
	});
}());
