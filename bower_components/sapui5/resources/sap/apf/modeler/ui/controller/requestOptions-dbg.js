/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");
jQuery.sap.require("sap.apf.modeler.ui.utils.viewValidator");
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require("sap.apf.utils.utils");
/**
* @class requestOptions
* @name requestOptions
* @description General controller for VHR, FRR,navigation target,step request,step filter mapping
* 			   The ViewData for this view needs the following parameters:
*  			   getCalatogServiceUri()- api to fetch uri
*  			   oConfigurationHandler - Handler for configuration
*  			   oConfigurationEditor -  manages the facet filter object
*  			   oTextReader - Method to getText
*  			   oParentObject - Object from which the controller gets instantiated
*/
(function() {
	"use strict";
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	var optionsValueModelBuilder = new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();
	var textManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
	// attaches events to the current view.
	function _attachEvents(oController) {
		oController.byId("idSource").attachEvent("selectService", oController.handleSelectionOfService.bind(oController));
	}
	sap.ui.core.mvc.Controller.extend("sap.apf.modeler.ui.controller.requestOptions", {
		viewValidator : {},
		oConfigurationEditor : {},
		oParentObject : {},
		// Called on initialization of the sub view and set the static texts and data for all controls in sub view
		onInit : function() {
			var oController = this;
			oController.viewValidator = new sap.apf.modeler.ui.utils.ViewValidator(oController.getView());
			oController.oConfigurationEditor = oController.getView().getViewData().oConfigurationEditor;
			oController.oParentObject = oController.getView().getViewData().oParentObject;
			oController.setDetailData();
			oController.setDisplayText();
			_attachEvents(oController);
		},
		// Called on initialization of the view to set data on fields of sub view
		setDetailData : function() {
			var oController = this;
			oController.setSource();
			oController.setEntityAsPromise();
			oController.setOptionalHierarchicalProperty();
			oController.setSelectProperties();
			oController.setOptionalRequestFieldProperty();
		},
		setSource : function() {
			var oController = this;
			var sSource = oController.getSource();
			// Default state
			oController.byId("idSource").setValue("");
			oController.setValidationStateForService();
			if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSource)) {
				oController.addOrRemoveMandatoryFieldsAndRequiredFlag(false);
				return;
			}
			// setValue
			oController.byId("idSource").setValue(sSource);
			oController.addOrRemoveMandatoryFieldsAndRequiredFlag(true);
		},
		// Sets entity set on init or change
		setEntityAsPromise : function() {
			var oController = this;
			var deferred = jQuery.Deferred();
			var oModelForEntity, sSource, sEntitySet, aValidatedValues;
			sSource = oController.byId("idSource").getValue();
			// Default State
			oController.byId("idEntity").setModel(null);
			oController.byId("idEntity").clearSelection();
			if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSource)) {
				deferred.resolve();
				return deferred.promise();
			}
			oController.getAllEntitiesAsPromise(sSource).done(function(aAllEntities) {
				sEntitySet = oController.getEntity();
				// Validate previously selected values
				if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sEntitySet)) {
					aValidatedValues = oController.validateSelectedValues(oController, [ sEntitySet ], aAllEntities);
					aAllEntities = aValidatedValues.aValues;
					sEntitySet = aValidatedValues.aSelectedValues[0];
				}
				// setModel
				oModelForEntity = optionsValueModelBuilder.convert(aAllEntities);
				oController.byId("idEntity").setModel(oModelForEntity);
				// setSelectedKey as 0th entity -> in case new parent object(no entity available for new parent object)/ in case of change of source(if old entity is not present in the entities of new source)
				if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sEntitySet) || aAllEntities.indexOf(sEntitySet) === -1) {
					oController.getAllEntitiesAsPromise(sSource).done(function(entities) {
						sEntitySet = entities[0];
						if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sEntitySet)) {
							oController.byId("idEntity").setSelectedKey(sEntitySet);
						}
						deferred.resolve();
					});
				} else if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sEntitySet)) {
					//If we give undefined or [] as selectedkey, previous selected key is retained.So clearSelection is required.
					oController.byId("idEntity").setSelectedKey(sEntitySet);
					deferred.resolve();
				}
			});
			return deferred.promise();
		},
		// Sets select properties on init or change
		setSelectProperties : function() {
			var oController = this;
			var sSource, sEntitySet, aSelectProperties, oModelForSelectProps, aValidatedValues = [];
			var oTextReader = oController.getView().getViewData().oTextReader;
			sSource = oController.byId("idSource").getValue();
			// Default state
			var sId = oController.getIdOfPropertiesControl();
			oController.byId(sId).setModel(null);
			oController.byId(sId).clearSelection();
			sEntitySet = textManipulator.removePrefixText(oController.byId("idEntity").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			oController.getAllEntitySetPropertiesAsPromise(sSource, sEntitySet).done(function(aProperties) {
				aSelectProperties = oController.getSelectProperties();
				// Validate previously selected values
				if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aSelectProperties)) {
					aValidatedValues = oController.validateSelectedValues(oController, aSelectProperties, aProperties);
					aProperties = aValidatedValues.aValues;
					aSelectProperties = aValidatedValues.aSelectedValues;
				}
				// setModel
				oModelForSelectProps = optionsValueModelBuilder.convert(aProperties);
				oController.byId(sId).setModel(oModelForSelectProps);
				oController.setSelectedKeysForProperties(aSelectProperties);
			});
		},
		// Called on reset of parent object in order to update parent object instance and configuration editor instance
		updateSubViewInstancesOnReset : function(oEvent) {
			var oController = this;
			oController.oConfigurationEditor = oEvent.getParameter("oConfigurationEditor");
			oController.oParentObject = oEvent.getParameter("oParentObject");
			oController.setDetailData();
		},
		//Stub to be implemented in sub views to set display text of controls
		setDisplayText : function() {
		},
		// Updates service of sub view and later entity and select properties if needed and fires relevant events if implemented by sub view
		handleChangeForSourceAsPromise : function(oEvt) {
			var deferred = jQuery.Deferred();
			var oController = this, sEntity, aSelectProperties;
			var sSource = oController.byId("idSource").getValue().trim();
			var oTextReader = oController.getView().getViewData().oTextReader;
			oController.setValidationStateForService();
			if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSource)) {
				oController.clearSource();
				oController.addOrRemoveMandatoryFieldsAndRequiredFlag(false);
				//set entity
				oController.setEntityAsPromise(oController).done(function() {
					sEntity = textManipulator.removePrefixText(oController.byId("idEntity").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
					oController.updateEntity(sEntity);
					//set properties on UI and update select properties
					oController.setSelectProperties();
					aSelectProperties = oController.getSelectedKeysForProperties();
					oController.updateSelectProperties(aSelectProperties);
					//set hierarchical property
					oController.setOptionalHierarchicalProperty().done(function() {
						var sHierarchicalProperty = textManipulator.removePrefixText(oController.byId("idOptionalProperty").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
						oController.updateHierarchicalProperty(sHierarchicalProperty);
						//set filter properties
						oController.setOptionalRequestFieldProperty();
						oController.oConfigurationEditor.setIsUnsaved();
						oController.fireRelevantEvents(oEvt);
						deferred.resolve();
					});
				});
			} else {
				oController.oConfigurationEditor.registerServiceAsPromise(sSource).done(function(registrationWasSuccessfull) {
					oController.getAllEntitiesAsPromise(sSource).done(function(allEntities) {
						if (registrationWasSuccessfull) {
							oController.addOrRemoveMandatoryFieldsAndRequiredFlag(true);
							oController.updateSource(sSource);
							if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(allEntities)) {
								var sValidationState = { //error state of the service input, for now implemented for hierarchical step. For step, it will not set any state
									sValueState : sap.ui.core.ValueState.Error,
									sValueStateText : oTextReader("hierarchicalServiceError")
								};
								oController.setValidationStateForService(sValidationState);
								oController.resetEntityAndProperties();
								return;
							}
						} else {
							oController.clearSource();
							oController.addOrRemoveMandatoryFieldsAndRequiredFlag(false);
						}
						//set entity
						oController.setEntityAsPromise(oController).done(function() {
							sEntity = textManipulator.removePrefixText(oController.byId("idEntity").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
							oController.updateEntity(sEntity);
							//set properties on UI and update select properties
							oController.setSelectProperties();
							aSelectProperties = oController.getSelectedKeysForProperties();
							oController.updateSelectProperties(aSelectProperties);
							//set hierarchical property
							oController.setOptionalHierarchicalProperty().done(function() {
								var sHierarchicalProperty = textManipulator.removePrefixText(oController.byId("idOptionalProperty").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
								oController.updateHierarchicalProperty(sHierarchicalProperty);
								//set filter properties
								oController.setOptionalRequestFieldProperty();
								oController.oConfigurationEditor.setIsUnsaved();
								oController.fireRelevantEvents(oEvt);
								deferred.resolve();
							});
						});
					});
				});
			}
			return deferred.promise();
		},
		// Updates entity set of sub view and later select properties if needed and fires relevant events if implemented by sub view
		handleChangeForEntity : function(oEvt) {
			var oController = this, sEntity, aSelectProperties;
			var oTextReader = oController.getView().getViewData().oTextReader;
			sEntity = textManipulator.removePrefixText(oController.byId("idEntity").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			oController.updateEntity(sEntity);
			//set properties on UI and update select properties
			oController.setSelectProperties();
			aSelectProperties = oController.getSelectedKeysForProperties();
			oController.updateSelectProperties(aSelectProperties);
			//set hierarchical properties
			oController.setOptionalHierarchicalProperty();
			var sHierarchicalProperty = textManipulator.removePrefixText(oController.byId("idOptionalProperty").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			oController.updateHierarchicalProperty(sHierarchicalProperty);
			//set filter properties
			oController.setOptionalRequestFieldProperty();
			oController.oConfigurationEditor.setIsUnsaved();
			oController.fireRelevantEvents(oEvt);
		},
		// Updates select properties of sub view and later fires relevant events if implemented by sub view
		handleChangeForSelectProperty : function(oEvt) {
			var oController = this;
			var aSelectProperties = oController.getSelectedKeysForProperties();
			oController.updateSelectProperties(aSelectProperties);
			//set filter properties
			oController.setOptionalRequestFieldProperty();
			oController.oConfigurationEditor.setIsUnsaved();
			oController.fireRelevantEvents(oEvt);
		},
		handleChangeForOptionalRequestField : function(oEvt) {
			var oController = this;
			var oTextReader = oController.getView().getViewData().oTextReader;
			var aFilterProperties = [ textManipulator.removePrefixText(oController.byId("idOptionalRequestField").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)) ];
			oController.updateOptionalRequestFieldProperty(aFilterProperties);
			oController.oConfigurationEditor.setIsUnsaved();
			oController.fireRelevantEvents(oEvt);
		},
		// Handles Suggestions for the input control
		handleSuggestions : function(oEvent) {
			var oController = this;
			var aExistingServices = oController.oConfigurationEditor.getAllServices();
			var oTextPool = oController.getView().getViewData().oConfigurationHandler.getTextPool();
			var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oTextPool);
			oSuggestionTextHandler.manageSuggestions(oEvent, aExistingServices);
		},
		//Stub to be implemented in sub views in case of any events to be handled on change of source, entity set or select properties
		fireRelevantEvents : function() {
		},
		// Adds/removes required tag to entity set and select properties fields and accepts a boolean to determine required
		addOrRemoveMandatoryFieldsAndRequiredFlag : function(bRequired) {
			var oController = this;
			oController.byId("idEntityLabel").setRequired(bRequired);
			oController.byId(oController.getIdOfPropertyLabel()).setRequired(bRequired);
			if (bRequired) {
				oController.viewValidator.addFields([ "idEntity", oController.getIdOfPropertiesControl() ]);
			} else {
				oController.viewValidator.removeFields([ "idEntity", oController.getIdOfPropertiesControl() ]);
			}
		},
		// Handles Service selection from the Select Dialog
		handleSelectionOfService : function(oEvent) {
			var selectedService = oEvent.getParameter("sSelectedService");
			oEvent.getSource().setValue(selectedService);
			// Event is getting trigered by service control
			oEvent.getSource().fireEvent("change");
		},
		// Handles Opening of Value Help Request Dialog.
		handleShowValueHelpRequest : function(oEvent) {
			var oController = this;
			var oViewData = {
				oTextReader : oController.getView().getViewData().oTextReader,
				// passing the source of control from which the event got triggered
				parentControl : oEvent.getSource(),
				getCalatogServiceUri : oController.getView().getViewData().getCalatogServiceUri
			};
			sap.ui.view({
				id : oController.createId("idCatalogServiceView"),
				viewName : "sap.apf.modeler.ui.view.catalogService",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : oViewData
			});
		},
		// Determines and returns non-common properties out of existing properties and total entity set
		getNonCommonValues : function(aExistingProps, aTotalSet) {
			var aNonCommonValues = [];
			if (!nullObjectChecker.checkIsNotNullOrUndefined(aExistingProps)) {
				return aNonCommonValues;
			}
			aNonCommonValues = aExistingProps.filter(function(sProperty) {
				return aTotalSet.indexOf(sProperty) === -1;
			});
			return aNonCommonValues;
		},
		//Returns array of properties to populate the model and also the property which has to be shown as selected
		validateSelectedValues : function(oController, sSelectedValue, aAllValues) {
			var oValidInvalidObj = {}, aInvalidValues = [], aValidValues = [], aInvalidValuesWithPrefix = [], aValues = [], sValue;
			var oTextReader = oController.getView().getViewData().oTextReader;
			oValidInvalidObj = sap.apf.utils.validateSelectedValues(sSelectedValue, aAllValues);
			aInvalidValues = oValidInvalidObj.invalid;
			aValidValues = oValidInvalidObj.valid;
			aInvalidValuesWithPrefix = textManipulator.addPrefixText(aInvalidValues, oTextReader);
			aValues = aInvalidValuesWithPrefix.concat(aAllValues).length !== 0 ? aInvalidValuesWithPrefix.concat(aAllValues) : aAllValues;
			sValue = aInvalidValuesWithPrefix.concat(aValidValues).length !== 0 ? aInvalidValuesWithPrefix.concat(aValidValues) : sSelectedValue;
			return {
				aValues : aValues,
				aSelectedValues : sValue
			};
		},
		//Interface API's - can be overidden by child subviews
		resetEntityAndProperties : function() {
		},
		setOptionalRequestFieldProperty : function() {
		},
		setOptionalHierarchicalProperty : function() {
			return jQuery.Deferred().resolve();
		},
		getIdOfPropertiesControl : function() {
			return "idSelectProperties";
		},
		getIdOfPropertyLabel : function() {
			return "idSelectPropertiesLabel";
		},
		setSelectedKeysForProperties : function(aProperties) {
			var oController = this;
			oController.byId("idSelectProperties").setSelectedKeys(aProperties);
		},
		getSelectedKeysForProperties : function() {
			var oController = this, sSelectedKeys = [], sSelectedKeysWithoutPrefix = [];
			var oTextReader = oController.getView().getViewData().oTextReader;
			sSelectedKeys = oController.byId("idSelectProperties").getSelectedKeys();
			sSelectedKeys.forEach(function(sKey) {
				sSelectedKeysWithoutPrefix.push(textManipulator.removePrefixText(sKey, oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)));
			});
			return sSelectedKeysWithoutPrefix;
		},
		setValidationStateForService : function(oValidationState) {
			var oController = this;
			var sDefaultValidationState = { //default state of the service input
				sValueState : sap.ui.core.ValueState.None,
				sValueStateText : ""
			};
			var oValidationStateToBeSet = oValidationState ? oValidationState : sDefaultValidationState;
			oController.byId("idSource").setValueState(oValidationStateToBeSet.sValueState);
			oController.byId("idSource").setValueStateText(oValidationStateToBeSet.sValueStateText);
		},
		// Stubs to be implemented in sub views depending on sub view logic
		getSource : function() {
		},
		updateSource : function(sSource) {
		},
		clearSource : function() {
		},
		getAllEntitiesAsPromise : function(sSource) {
			return sap.apf.utils.createPromise();
		},
		getEntity : function() {
		},
		updateEntity : function(sEntity) {
		},
		clearEntity : function() {
		},
		getAllEntitySetPropertiesAsPromise : function(sSource, sEntitySet) {
			return sap.apf.utils.createPromise();
		},
		getSelectProperties : function() {
		},
		updateSelectProperties : function(aSelectProperties) {
		},
		clearSelectProperties : function() {
		},
		removeSelectProperties : function(aProperties) {
		},
		getOptionalRequestFieldProperty : function() {
		},
		updateOptionalRequestFieldProperty : function(aFilterProperties) {
		},
		updateHierarchicalProperty : function(sHierarchicalProperty) {
		},
		clearOptionalRequestFieldProperty : function() {
		},
		removeOptionalRequestFieldProperty : function(aProperties) {
		}
	});
}());