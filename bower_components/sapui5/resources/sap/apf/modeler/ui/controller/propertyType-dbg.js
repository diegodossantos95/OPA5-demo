/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");
jQuery.sap.require('sap.apf.utils.utils');
(function() {
	"use strict";
	var oTextManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	var optionsValueModelBuilder = new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();
	var oConstants = sap.apf.modeler.ui.utils.CONSTANTS.events;
	var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.REPRESENTATION_LABEL;
	function _setDisplayTextForProperty(oController) {
		var sRepresentationType = oController.oRepresentation.getRepresentationType();
		var sKind = oController.getView().getViewData().oPropertyTypeData.sContext;
		var sPropertyText = oController.getView().getViewData().oRepresentationTypeHandler.getLabelsForChartType(oController.oTextReader, sRepresentationType, sKind);
		oController.byId("idPropertyTypeLabel").setText(sPropertyText);
		oController.byId("idPropertyTypeLabel").setTooltip(sPropertyText);
	}
	function _setInvisibleTexts(oController) {
		oController.byId("idAriaPropertyForAdd").setText(oController.oTextReader("ariaTextForAddIcon"));
		oController.byId("idAriaPropertyForDelete").setText(oController.oTextReader("ariaTextForDeleteIcon"));
	}
	function _setPropertyAsPromise(oController) {
		var oModelForProperties;
		var deferred = jQuery.Deferred();
		var element = oController.byId("idPropertyType");
		oController.getAllPropertiesAsPromise().done(function(oResponse) {
			oModelForProperties = optionsValueModelBuilder.convert(oResponse.aAllProperties);
			element.setModel(oModelForProperties);
			element.setSelectedKey(oResponse.sSelectedKey);
			deferred.resolve();
		});
		return deferred.promise();
	}
	function _setDisplayTextForPropertyLabel(oController) {
		var sPropertyName = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
		var sTextForLabel = oController.getPropertyTextLabelKey(sPropertyName) ? oController.oTextReader("label") : oController.oTextReader("label") + " (" + oController.oTextReader("default") + ")";
		oController.byId("idPropertyLabel").setText(sTextForLabel);
		oController.byId("idPropertyLabel").setTooltip(sTextForLabel);
	}
	function _setPropertyLabelText(oController) {
		var sPropertyLabelText;
		var sPropertyName = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
		var sPropertyLabelKey = oController.getPropertyTextLabelKey(sPropertyName);
		if (nullObjectChecker.checkIsNotUndefined(sPropertyLabelKey)) {
			sPropertyLabelText = oController.getView().getViewData().oConfigurationHandler.getTextPool().get(sPropertyLabelKey).TextElementDescription;
			oController.byId("idPropertyLabelText").setValue(sPropertyLabelText);
		} else {
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				var labelText = oController.oStepPropertyMetadataHandler.getDefaultLabel(entityTypeMetadata, sPropertyName);
				oController.byId("idPropertyLabelText").setValue(labelText);
			});
		}
	}
	function _setDisplayTooltipForAddAndRemoveIcons(oController) {
		oController.byId("idAddPropertyIcon").setTooltip(oController.oTextReader("addButton"));
		oController.byId("idRemovePropertyIcon").setTooltip(oController.oTextReader("deleteButton"));
	}
	function _setVisibilityForAddAndRemoveIcons(oController) {
		var sPropertyType = oController.getView().getViewData().sPropertyType;
		var sKind = oController.getView().getViewData().oPropertyTypeData.sContext;
		var bShowAddIcon = oController.oRepresentationTypeHandler.isAdditionToBeEnabled(oController.oRepresentation.getRepresentationType(), sPropertyType, sKind);
		var bShowRemoveIcon = bShowAddIcon;
		var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
		var nIndex = oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
		if (nIndex === 0) {
			bShowRemoveIcon = false;
		} else if (nIndex > 0) {
			var oPreviousPropertyView = oPropertyTypeState.getViewAt(nIndex - 1);
			var sPreviousRowKind = oPreviousPropertyView.getViewData().oPropertyTypeData.sContext;
			if (sKind !== sPreviousRowKind) {
				bShowRemoveIcon = false;
			}
		}
		oController.byId("idAddPropertyIcon").setVisible(bShowAddIcon);
		oController.byId("idRemovePropertyIcon").setVisible(bShowRemoveIcon);
	}
	function _attachEvent(oController) {
		oController.byId("idAddPropertyIcon").attachEvent(oConstants.SETFOCUSONADDICON, oController.setFocusOnAddIcons.bind(oController));
	}
	sap.ui.core.mvc.Controller.extend("sap.apf.modeler.ui.controller.propertyType", {
		oConfigurationEditor : {},
		oRepresentation : {},
		oStepPropertyMetadataHandler : {},
		oRepresentationTypeHandler : {},
		oTextReader : {},
		oTextPool : {},
		initPromise : null,
		onInit : function() {
			var oController = this;
			oController.initPromise = new jQuery.Deferred();
			oController.oConfigurationEditor = oController.getView().getViewData().oConfigurationEditor;
			oController.oRepresentation = oController.getView().getViewData().oParentObject;
			oController.oStepPropertyMetadataHandler = oController.getView().getViewData().oStepPropertyMetadataHandler;
			oController.oRepresentationTypeHandler = oController.getView().getViewData().oRepresentationTypeHandler;
			oController.oTextReader = oController.getView().getViewData().oCoreApi.getText;
			oController.oTextPool = oController.getView().getViewData().oTextPool;
			_setPropertyAsPromise(oController).done(function() {
				oController.setDetailData().done(function() {
					oController.initPromise.resolve();
				});
			});
		},
		onAfterRendering : function() {
			var oController = this;
			oController.initPromise.then(function() {
				oController.enableDisableLabelDisplayOptionTypeAsPromise().done(function() {
					oController.byId("idAddPropertyIcon").fireEvent(oConstants.SETFOCUSONADDICON);
				});
			});
		},
		setDetailData : function() {
			var deferred = jQuery.Deferred();
			var oController = this;
			oController.setLabelDisplayOptionTypeAsPromise(optionsValueModelBuilder).done(function() {
				if (!oController.byId("idPropertyType")) {
					deferred.resolve();
					return;
				}
				_setPropertyLabelText(oController);
				_setInvisibleTexts(oController);
				_setDisplayTextForPropertyLabel(oController);
				_setDisplayTextForProperty(oController);
				_setDisplayTooltipForAddAndRemoveIcons(oController);
				_setVisibilityForAddAndRemoveIcons(oController);
				deferred.resolve();
			});
			return deferred.promise();
		},
		handleChangeForPropertyTypeAsPromise : function() {
			var oController = this;
			var deferred = jQuery.Deferred();
			var nCurrentViewIndex = oController.getView().getViewData().oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
			var sOldSortProperty = oController.getView().getViewData().oPropertyTypeState.getPropertyValueState()[nCurrentViewIndex];
			var sNewProperty = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			oController.getView().fireEvent(oConstants.UPDATEPROPERTYVALUESTATE, {
				"sProperty" : sNewProperty
			});
			oController.updatePropertyTypeAsPromise(sNewProperty).done(function() {
				oController.setDetailData();
				oController.enableDisableLabelDisplayOptionTypeAsPromise().done(function() {
					oController.getView().fireEvent(oConstants.UPDATEPROPERTY, {
						"sOldProperty" : sOldSortProperty
					});
					oController.oConfigurationEditor.setIsUnsaved();
					deferred.resolve();
				});
			});
			return deferred.promise();
		},
		handleChangeForLabelDisplayOptionType : function() {
			var oController = this;
			var sLabelDisplayOption = oController.byId("idLabelDisplayOptionType").getSelectedKey();
			oController.changeDisplayOptionsLabel(sLabelDisplayOption);
			oController.oConfigurationEditor.setIsUnsaved();
		},
		handleChangeForLabelText : function() {
			var oController = this, sLabelTextKey;
			var sLabelText = oController.byId("idPropertyLabelText").getValue();
			var sPropertyName = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			if (sLabelText.trim().length === 0) {
				sLabelTextKey = undefined;
				oController.setPropertyTextLabelKey(sPropertyName, sLabelTextKey);
				_setDisplayTextForPropertyLabel(oController);
				_setPropertyLabelText(oController);
				oController.oConfigurationEditor.setIsUnsaved();
			} else {
				oController.getView().getViewData().oConfigurationHandler.getTextPool().setTextAsPromise(sLabelText, oTranslationFormat).done(function(sLabelTextKey) {
					oController.setPropertyTextLabelKey(sPropertyName, sLabelTextKey);
					_setDisplayTextForPropertyLabel(oController);
					_setPropertyLabelText(oController);
					oController.oConfigurationEditor.setIsUnsaved();
				});
			}
		},
		setFocusOnAddIcons : function() {
			var oController = this;
			oController.byId("idAddPropertyIcon").focus();
		},
		setFocusOnRemoveIcons : function() {
			var oController = this;
			oController.byId("idPropertyType").focus();
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
		updatePropertyTypeAsPromise : function(sNewProperty) {
			var oController = this;
			var deferred = jQuery.Deferred();
			var aPropertiesInformation = [];
			var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
			var aCurrentPropertiesState = oPropertyTypeState.getPropertyValueState();
			var nCurrentViewIndex = oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
			oController.createNewPropertyInfoAsPromise(sNewProperty).done(function(oNewPropertyInfo) {
				aCurrentPropertiesState.forEach(function(sProperty, nIndex) {
					if (sProperty !== oController.oTextReader("none")) {
						if (nCurrentViewIndex === nIndex) {
							aPropertiesInformation.push(oNewPropertyInfo);
						} else {
							aPropertiesInformation.push(oController.createCurrentProperiesInfo(sProperty));
						}
					}
				});
				oController.updateProperties(aPropertiesInformation);
				deferred.resolve();
			});
			return deferred.promise();
		},
		// handler for suggestions
		handleSuggestions : function(oEvent) {
			var oController = this;
			var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oController.oTextPool);
			oSuggestionTextHandler.manageSuggestionTexts(oEvent, oTranslationFormat);
		},
		getSelectedProperty : function() {
			var oController = this;
			var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
			var aCurrentSortPropertiesState = oPropertyTypeState.getPropertyValueState();
			var nCurrentViewIndex = oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
			return aCurrentSortPropertiesState[nCurrentViewIndex];
		},
		addRemovedProperty : function(oEvent) {
			var oController = this, sProperty;
			sProperty = oEvent.getParameter("sProperty");
			oController.oStepPropertyMetadataHandler.oStep.getConsumablePropertiesForRepresentation(oController.oRepresentation.getId()).done(function(oResponse) {
				if (oResponse.available.indexOf(sProperty) === -1 && (sProperty !== oController.oTextReader("none"))) {
					sProperty = oTextManipulator.addPrefixText([ sProperty ], oController.oTextReader);
				}
				if (sProperty !== oController.oTextReader("none")) {
					var oItem = new sap.ui.core.Item({
						key : sProperty,
						text : sProperty
					});
					oController.byId("idPropertyType").addItem(oItem);
				}
			});
		},
		removeAddedProperty : function(oEvent) {
			var oController = this;
			var sProperty = oEvent.getParameter("sProperty");
			var aItems = oController.byId("idPropertyType").getItems();
			aItems.forEach(function(oItem) {
				if ((oTextManipulator.removePrefixText(oItem.getKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)) === sProperty) && sProperty !== oController.oTextReader("none")) {
					oController.byId("idPropertyType").removeItem(oItem);
				}
			});
		},
		// Stubs to be implemented in sub views depending on sub view logic
		updateProperties : function(aPropertiesInformation) {
		},
		createNewPropertyInfoAsPromise : function(sNewProperty) {
			return sap.apf.utils.createPromise();
		},
		createCurrentProperiesInfo : function(sProperty, oNewPropertyInfo) {
		},
		setPropertyInParentObject : function() {
		},
		setLabelDisplayOptionTypeAsPromise : function(optionsValueModelBuilder) {
			return sap.apf.utils.createPromise();
		},
		getAllPropertiesAsPromise : function() {
			return sap.apf.utils.createPromise();
		},
		getPropertyTextLabelKey : function(sPropertyName) {
		},
		setPropertyTextLabelKey : function(sPropertyName, sLabelTextKey) {
		},
		enableDisableLabelDisplayOptionTypeAsPromise : function() {
			return sap.apf.utils.createPromise();
		},
		removePropertyFromParentObject : function() {
		},
		addPropertyAsPromise : function() {
			return sap.apf.utils.createPromise();
		},
		changeDisplayOptionsLabel : function(sLabelDisplayOption) {
		}
	});
}());
