/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require('sap.apf.modeler.ui.utils.propertyTypeFactory');
jQuery.sap.require('sap.apf.modeler.ui.utils.propertyTypeState');
jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
(function() {
	'use strict';
	var oViewDependencies, aPropertiesToBeCreated;
	var oPropertyTypeFactory = new sap.apf.modeler.ui.utils.PropertyTypeFactory();
	var oConstants = sap.apf.modeler.ui.utils.CONSTANTS.events;
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	function _removeAddedProperty(oController, nIndex, sProperty) {
		var oVBox = oController.byId("idPropertyTypeVBox");
		if (nullObjectChecker.checkIsNotUndefined(oVBox)) {
			oVBox.getItems().forEach(function(oPropertyTypeView, index) {
				if (index !== nIndex) {
					oPropertyTypeView.fireEvent(oConstants.REMOVEADDEDPROPERTY, {
						"sProperty" : sProperty
					});
				}
			});
		}
	}
	function _addRemovedProperty(oController, sProperty, nIndex) {
		var oVBox = oController.byId("idPropertyTypeVBox");
		if (nullObjectChecker.checkIsNotUndefined(oVBox)) {
			oVBox.getItems().forEach(function(oPropertyTypeView, index) {
				if (!nullObjectChecker.checkIsNotUndefined(nIndex)) {
					oPropertyTypeView.fireEvent(oConstants.ADDREMOVEDPROPERTY, {
						"sProperty" : sProperty
					});
					return;
				}
				if (index !== nIndex) {
					oPropertyTypeView.fireEvent(oConstants.ADDREMOVEDPROPERTY, {
						"sProperty" : sProperty
					});
				}
			});
		}
	}
	function _handleAddRemoveOfProperty(oController, sProperty, oEvent) {
		var oBasicDataLayout = oController.getView().getViewData().oViewDataForPropertyType.oBasicDataLayout;
		var nIndexOfSourceView = oBasicDataLayout.indexOfItem(oController.getView());
		oBasicDataLayout.getItems().forEach(function(oItem, index) {
			var oPropertyTypes = sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes;
			var sPropertyType = oItem.getViewData().oViewDataForPropertyType.sPropertyType;
			if (sPropertyType === oPropertyTypes.DIMENSION || sPropertyType === oPropertyTypes.LEGEND) {
				if (nIndexOfSourceView !== index) {
					var oVBox = oItem.byId("idPropertyTypeVBox");
					if (nullObjectChecker.checkIsNotUndefined(oVBox)) {
						oVBox.getItems().forEach(function(oPropertyTypeView) {
							oPropertyTypeView.fireEvent(oEvent, {
								"sProperty" : sProperty
							});
						});
					}
				}
			}
		});
	}
	function _attachEvents(oPropertyTypeHandlerController, oPropertyTypeView) {
		oPropertyTypeView.attachEvent(oConstants.ADDPROPERTY, oPropertyTypeHandlerController.handlePressOfAdd.bind(oPropertyTypeHandlerController));
		oPropertyTypeView.attachEvent(oConstants.REMOVEPROPERTY, oPropertyTypeHandlerController.handlePressOfRemove.bind(oPropertyTypeHandlerController));
		oPropertyTypeView.attachEvent(oConstants.SETNEXTPROPERTYINPARENTOBJECT, oPropertyTypeView.getController().setNextPropertyInParentObject.bind(oPropertyTypeView.getController()));
		oPropertyTypeView.attachEvent(oConstants.REMOVEADDEDPROPERTY, oPropertyTypeView.getController().removeAddedProperty.bind(oPropertyTypeView.getController()));
		oPropertyTypeView.attachEvent(oConstants.ADDREMOVEDPROPERTY, oPropertyTypeView.getController().addRemovedProperty.bind(oPropertyTypeView.getController()));
		oPropertyTypeView.attachEvent(oConstants.UPDATEPROPERTY, oPropertyTypeHandlerController.handleChangeOfProperty.bind(oPropertyTypeHandlerController));
		oPropertyTypeHandlerController.getView().attachEvent(oConstants.SETNEXTPROPERTYINPARENTOBJECT, oPropertyTypeView.getController().setNextPropertyInParentObject.bind(oPropertyTypeView.getController()));
		oPropertyTypeView.attachEvent(oConstants.REMOVECURRENTPROPERTYFROMPARENTOBJECT, oPropertyTypeView.getController().removePropertyFromParentObject.bind(oPropertyTypeView.getController()));
		oPropertyTypeView.attachEvent(oConstants.REMOVEPROPERTYFROMPARENTOBJECT, oPropertyTypeView.getController().removePropertyFromParentObject.bind(oPropertyTypeView.getController()));
		oPropertyTypeView.attachEvent(oConstants.UPDATEPROPERTYVALUESTATE, oPropertyTypeHandlerController.updatePropertyValueState.bind(oPropertyTypeHandlerController));
		oPropertyTypeView.attachEvent(oConstants.FOCUSONREMOVE, oPropertyTypeHandlerController.handleFocusOnRemove.bind(oPropertyTypeHandlerController));
		oPropertyTypeView.attachEvent(oConstants.SETFOCUSONREMOVEICON, oPropertyTypeView.getController().setFocusOnRemoveIcons.bind(oPropertyTypeView.getController()));
		oPropertyTypeView.attachEvent(oConstants.REMOVEADDEDPROPERTYFROMOTHERPROPERTYTYPE, oPropertyTypeHandlerController.handleRemovalOfAddedProperty.bind(oPropertyTypeHandlerController));
		oPropertyTypeView.attachEvent(oConstants.ADDREMOVEDPROPERTYFROMOTHERPROPERTYTYPE, oPropertyTypeHandlerController.handleAdditionOfRemovedProperty.bind(oPropertyTypeHandlerController));
	}
	function _instantiateSubViews(oController) {
		aPropertiesToBeCreated = oController.getView().getViewData().aPropertiesToBeCreated;
		aPropertiesToBeCreated.forEach(function(oPropertyInformation) {
			_createView(oController, oPropertyInformation, oController.nCounter);
		});
	}
	function _createView(oController, oPropertyInformation, nIndexOfNewView) {
		var oView, sViewId;
		oViewDependencies = jQuery.extend(true, {}, oController.getView().getViewData().oViewDataForPropertyType);
		oViewDependencies.oPropertyTypeState = oController.oPropertyTypeState;
		oViewDependencies.oPropertyTypeData = oPropertyInformation;
		sViewId = oController.createId("id" + oViewDependencies.sPropertyType + "View" + oController.nCounter);
		oController.oPropertyTypeState.addPropertyAt(oPropertyInformation.sProperty, nIndexOfNewView);
		oController.oPropertyTypeState.addPropertyTypeViewIdAt(sViewId, nIndexOfNewView);
		oView = oPropertyTypeFactory.createPropertyTypeView(oViewDependencies, sViewId);
		_attachEvents(oController, oView);
		oController.byId("idPropertyTypeVBox").insertItem(oView, nIndexOfNewView);
		oController.nCounter++;
		return oView;
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.propertyTypeHandler", {
		nCounter : 0,
		oPropertyTypeState : {},
		onInit : function() {
			var oController = this;
			oController.oPropertyTypeState = new sap.apf.modeler.ui.utils.PropertyTypeState();
			_instantiateSubViews(oController);
		},
		handlePressOfAdd : function(oEvent) {
			var oController = this, oPropertyTypeData = {}, oView, sPropertyType, oSourceView, nIndexOfNewView;
			var oPropertyTypes = sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes;
			sPropertyType = oController.getView().getViewData().oViewDataForPropertyType.sPropertyType;
			oSourceView = oEvent.getSource();
			nIndexOfNewView = oController.byId("idPropertyTypeVBox").indexOfItem(oSourceView) + 1;
			oPropertyTypeData.sProperty = oEvent.getParameter("sProperty");
			oPropertyTypeData.sContext = oEvent.getParameter("sContext");
			if (nullObjectChecker.checkIsNotUndefined(oPropertyTypeData.sProperty)) {
				oView = _createView(oController, oPropertyTypeData, nIndexOfNewView);
				oView.fireEvent(oConstants.SETNEXTPROPERTYINPARENTOBJECT);
				_removeAddedProperty(oController, nIndexOfNewView, oEvent.getParameter("sProperty"));
				if (sPropertyType === oPropertyTypes.DIMENSION || sPropertyType === oPropertyTypes.LEGEND) {
					oSourceView.fireEvent(oConstants.REMOVEADDEDPROPERTYFROMOTHERPROPERTYTYPE, {
						"sProperty" : oEvent.getParameter("sProperty")
					});
				}
			}
		},
		handleFocusOnRemove : function(oEvent) {
			var oController = this;
			var oVbox = oController.byId("idPropertyTypeVBox");
			var oSourceView = oEvent.getSource();
			var nIndexOfSourceView = oVbox.indexOfItem(oSourceView);
			var oFocusedView = oController.byId(oController.oPropertyTypeState.aPropertyTypeViewIds[nIndexOfSourceView - 1]);
			oFocusedView.fireEvent(oConstants.SETFOCUSONREMOVEICON);
		},
		handlePressOfRemove : function(oEvent) {
			var oController = this;
			var oPropertyTypes = sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes;
			var sPropertyType = oController.getView().getViewData().oViewDataForPropertyType.sPropertyType;
			var oVbox = oController.byId("idPropertyTypeVBox");
			var oSourceView = oEvent.getSource();
			var nIndexOfSourceView = oVbox.indexOfItem(oSourceView);
			var sCurrentProperty = oController.oPropertyTypeState.getPropertyValueState()[nIndexOfSourceView];
			if (oController.oPropertyTypeState.isPropertyPresentExactlyOnce(sCurrentProperty)) {
				oSourceView.fireEvent(oConstants.REMOVECURRENTPROPERTYFROMPARENTOBJECT);
			}
			oVbox.removeItem(oSourceView);
			oController.oPropertyTypeState.removePropertyAt(nIndexOfSourceView);
			oController.oPropertyTypeState.removePropertyTypeViewIdAt(nIndexOfSourceView);
			_addRemovedProperty(oController, sCurrentProperty);
			if (sPropertyType === oPropertyTypes.DIMENSION || sPropertyType === oPropertyTypes.LEGEND) {
				oSourceView.fireEvent(oConstants.ADDREMOVEDPROPERTYFROMOTHERPROPERTYTYPE, {
					"sProperty" : sCurrentProperty
				});
			}
		},
		handleChangeOfProperty : function(oEvent) {
			var oController = this;
			var oPropertyTypes = sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes;
			var sPropertyType = oController.getView().getViewData().oViewDataForPropertyType.sPropertyType;
			var oVbox = oController.byId("idPropertyTypeVBox");
			var oSourceView = oEvent.getSource();
			var nIndexOfSourceView = oVbox.indexOfItem(oSourceView);
			var sCurrentProperty = oController.oPropertyTypeState.getPropertyValueState()[nIndexOfSourceView];
			_removeAddedProperty(oController, nIndexOfSourceView, sCurrentProperty);
			_addRemovedProperty(oController, oEvent.getParameter("sOldProperty"), nIndexOfSourceView);
			if (sPropertyType === oPropertyTypes.DIMENSION || sPropertyType === oPropertyTypes.LEGEND) {
				oSourceView.fireEvent(oConstants.REMOVEADDEDPROPERTYFROMOTHERPROPERTYTYPE, {
					"sProperty" : sCurrentProperty
				});
				oSourceView.fireEvent(oConstants.ADDREMOVEDPROPERTYFROMOTHERPROPERTYTYPE, {
					"sProperty" : oEvent.getParameter("sOldProperty")
				});
			}
		},
		updatePropertyValueState : function(oEvent) {
			var oController = this;
			var oSourceView = oEvent.getSource();
			var sCurrentProperty = oEvent.getParameter("sProperty");
			var nIndexOfSourceView = oController.byId("idPropertyTypeVBox").indexOfItem(oSourceView);
			oController.oPropertyTypeState.updatePropertyAt(sCurrentProperty, nIndexOfSourceView);
		},
		handleRemoveOfProperty : function() {
			var oController = this;
			var oVBox = oController.byId("idPropertyTypeVBox");
			if (nullObjectChecker.checkIsNotUndefined(oVBox)) {
				oVBox.getItems().forEach(function(oPropertyTypeView) {
					oPropertyTypeView.fireEvent(oConstants.REMOVEPROPERTYFROMPARENTOBJECT);
				});
			}
		},
		handleSettingTopNProperties : function() {
			var oController = this;
			oController.getView().fireEvent(oConstants.SETNEXTPROPERTYINPARENTOBJECT);
		},
		handleRemovalOfAddedProperty : function(oEvent) {
			var oController = this;
			var sProperty = oEvent.getParameter("sProperty");
			_handleAddRemoveOfProperty(oController, sProperty, oConstants.REMOVEADDEDPROPERTY);
		},
		handleAdditionOfRemovedProperty : function(oEvent) {
			var oController = this;
			var sProperty = oEvent.getParameter("sProperty");
			_handleAddRemoveOfProperty(oController, sProperty, oConstants.ADDREMOVEDPROPERTY);
		}
	});
})();