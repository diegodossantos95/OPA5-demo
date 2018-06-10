/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.utils.representationBasicDataHandler');
jQuery.sap.require("sap.apf.core.constants");
(function() {
	'use strict';
	var oPropertyTypes = sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes;
	sap.apf.modeler.ui.utils.RepresentationBasicDataHandler = function(oRepresentationView, oStepPropertyMetadataHandler, oRepresentationHandler) {
		this.oRepresentationView = oRepresentationView;
		this.oRepresentation = oRepresentationHandler.oRepresentation;
		this.oStepPropertyMetadataHandler = oStepPropertyMetadataHandler;
		this.oRepresentationTypeHandler = oRepresentationHandler.oRepresentationTypeHandler;
		this.oRepresentationHandler = oRepresentationHandler;
		this.nCounter = 0;
	};
	sap.apf.modeler.ui.utils.RepresentationBasicDataHandler.prototype.constructor = sap.apf.modeler.ui.utils.RepresentationBasicDataHandler;
	function _prepareCommonView(oRepresentationBasicDataHandler, sPropertyType, aPropertiesToBeCreated) {
		var oView, oViewData = {}, oViewDataForPropertyType = {};
		if (aPropertiesToBeCreated.length === 0) {
			return;
		}
		oViewDataForPropertyType.oConfigurationEditor = oRepresentationBasicDataHandler.oRepresentationView.getViewData().oConfigurationEditor;
		oViewDataForPropertyType.oParentObject = oRepresentationBasicDataHandler.oRepresentation;
		oViewDataForPropertyType.oCoreApi = oRepresentationBasicDataHandler.oRepresentationView.getViewData().oCoreApi;
		oViewDataForPropertyType.oConfigurationHandler = oRepresentationBasicDataHandler.oRepresentationView.getViewData().oConfigurationHandler;
		oViewDataForPropertyType.oRepresentationTypeHandler = oRepresentationBasicDataHandler.oRepresentationTypeHandler;
		oViewDataForPropertyType.oRepresentationHandler = oRepresentationBasicDataHandler.oRepresentationHandler;
		oViewDataForPropertyType.oStepPropertyMetadataHandler = oRepresentationBasicDataHandler.oStepPropertyMetadataHandler;
		oViewDataForPropertyType.sPropertyType = sPropertyType;
		oViewDataForPropertyType.oBasicDataLayout = oRepresentationBasicDataHandler.oRepresentationView.getController().byId("idBasicDataLayout");
		oViewDataForPropertyType.oTextPool = oRepresentationBasicDataHandler.oRepresentationView.getViewData().oConfigurationHandler.getTextPool();
		oViewData.oViewDataForPropertyType = oViewDataForPropertyType;
		oViewData.aPropertiesToBeCreated = aPropertiesToBeCreated;
		oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.propertyTypeHandler",
			type : sap.ui.core.mvc.ViewType.XML,
			id : oRepresentationBasicDataHandler.oRepresentationView.getController().createId("id" + sPropertyType),
			viewData : oViewData
		});
		oRepresentationBasicDataHandler.oRepresentationView.getController().byId("idBasicDataLayout").insertItem(oView, oRepresentationBasicDataHandler.nCounter);
		oRepresentationBasicDataHandler.nCounter++;
		oRepresentationBasicDataHandler.oRepresentationView.attachEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.REMOVEALLPROPERTIESFROMPARENTOBJECT, oView.getController().handleRemoveOfProperty.bind(oView.getController()));
	}
	function _instantiateDimensionView(oRepresentationBasicDataHandler) {
		_prepareCommonView(oRepresentationBasicDataHandler, oPropertyTypes.DIMENSION, oRepresentationBasicDataHandler.oRepresentationHandler.getActualDimensions());
	}
	function _instantiateLegendView(oRepresentationBasicDataHandler) {
		_prepareCommonView(oRepresentationBasicDataHandler, oPropertyTypes.LEGEND, oRepresentationBasicDataHandler.oRepresentationHandler.getActualLegends());
	}
	function _instantiateMeasureView(oRepresentationBasicDataHandler) {
		_prepareCommonView(oRepresentationBasicDataHandler, oPropertyTypes.MEASURE, oRepresentationBasicDataHandler.oRepresentationHandler.getActualMeasures());
	}
	function _instantiatePropertyView(oRepresentationBasicDataHandler) {
		_prepareCommonView(oRepresentationBasicDataHandler, oPropertyTypes.PROPERTY, oRepresentationBasicDataHandler.oRepresentationHandler.getActualProperties());
	}
	function _instantiateHierarchicalPropertyView(oRepresentationBasicDataHandler) {
		_prepareCommonView(oRepresentationBasicDataHandler, oPropertyTypes.HIERARCHIALCOLUMN, oRepresentationBasicDataHandler.oRepresentationHandler.getHierarchicalProperty());
	}
	sap.apf.modeler.ui.utils.RepresentationBasicDataHandler.prototype.instantiateBasicData = function() {
		this.destroyBasicData();
		if (this.oRepresentation.getRepresentationType() === "TableRepresentation" || this.oRepresentation.getRepresentationType() === "TreeTableRepresentation") {
			if (this.oRepresentation.getRepresentationType() === "TreeTableRepresentation") {
				_instantiateHierarchicalPropertyView(this);
			}
			_instantiatePropertyView(this);
			return;
		}
		_instantiateDimensionView(this);
		_instantiateLegendView(this);
		_instantiateMeasureView(this);
	};
	sap.apf.modeler.ui.utils.RepresentationBasicDataHandler.prototype.destroyBasicData = function() {
		this.nCounter = 0;
		this.oRepresentationView.getController().byId("idBasicDataLayout").destroyItems();
	};
})();