/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
*/
jQuery.sap.declare('sap.apf.modeler.ui.utils.sortDataHandler');
jQuery.sap.require("sap.apf.core.constants");
(function() {
	'use strict';
	var oPropertyTypes = sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes;
	sap.apf.modeler.ui.utils.SortDataHandler = function(oParentView, oParentObject, oStepPropertyMetadataHandler, oTextReader) {
		this.oParentView = oParentView;
		this.oStepPropertyMetadataHandler = oStepPropertyMetadataHandler;
		this.oParentObject = oParentObject;
		this.oTextReader = oTextReader;
	};
	sap.apf.modeler.ui.utils.SortDataHandler.prototype.constructor = sap.apf.modeler.ui.utils.RepresentationBasicDataHandler;
	function _prepareCommonView(oSortDataHandler, sPropertyType, aPropertiesToBeCreated) {
		var oView, oViewData = {}, oViewDataForPropertyType = {};
		oViewDataForPropertyType.oConfigurationEditor = oSortDataHandler.oParentView.getViewData().oConfigurationEditor;
		oViewDataForPropertyType.oParentObject = oSortDataHandler.oParentObject;
		oViewDataForPropertyType.oCoreApi = oSortDataHandler.oParentView.getViewData().oCoreApi;
		oViewDataForPropertyType.oConfigurationHandler = oSortDataHandler.oParentView.getViewData().oConfigurationHandler;
		oViewDataForPropertyType.oStepPropertyMetadataHandler = oSortDataHandler.oStepPropertyMetadataHandler;
		oViewDataForPropertyType.sPropertyType = sPropertyType;
		oViewData.oViewDataForPropertyType = oViewDataForPropertyType;
		oViewData.aPropertiesToBeCreated = aPropertiesToBeCreated;
		oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.propertyTypeHandler",
			type : sap.ui.core.mvc.ViewType.XML,
			id : oSortDataHandler.oParentView.getController().createId("id" + sPropertyType),
			viewData : oViewData
		});
		oSortDataHandler.oParentView.getController().byId("idSortLayout").insertItem(oView);
		oSortDataHandler.oParentView.attachEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETTOPNPROPERTIES, oView.getController().handleSettingTopNProperties.bind(oView.getController()));
	}
	function _preparePropertiesToBeCreated(aSortProperties) {
		var oPropertyToBeCreated, aPropertiesToBeCreated = [];
		aSortProperties.forEach(function(oSortProperty) {
			oPropertyToBeCreated = {};
			oPropertyToBeCreated.sProperty = oSortProperty.property;
			oPropertyToBeCreated.sContext = oSortProperty.ascending ? "true" : "false";
			aPropertiesToBeCreated.push(oPropertyToBeCreated);
		});
		return aPropertiesToBeCreated;
	}
	sap.apf.modeler.ui.utils.SortDataHandler.prototype.instantiateRepresentationSortData = function() {
		var aPropertiesToBeCreated = _preparePropertiesToBeCreated(this.oParentObject.getOrderbySpecifications());
		if (aPropertiesToBeCreated.length === 0) {
			aPropertiesToBeCreated = [ {
				sProperty : this.oTextReader("none"),
				sContext : "true"
			} ];
		}
		_prepareCommonView(this, oPropertyTypes.REPRESENTATIONSORT, aPropertiesToBeCreated);
	};
	sap.apf.modeler.ui.utils.SortDataHandler.prototype.instantiateStepSortData = function() {
		var aPropertiesToBeCreated = [ {
			sProperty : this.oStepPropertyMetadataHandler.getProperties()[0],
			sContext : "true"
		} ];
		this.destroySortData();
		if (this.oParentObject.getTopN() && this.oParentObject.getTopN().orderby.length !== 0) {
			aPropertiesToBeCreated = _preparePropertiesToBeCreated(this.oParentObject.getTopN().orderby);
		}
		_prepareCommonView(this, oPropertyTypes.STEPSORT, aPropertiesToBeCreated);
	};
	sap.apf.modeler.ui.utils.SortDataHandler.prototype.destroySortData = function() {
		this.oParentView.getController().byId("idSortLayout").destroyItems();
	};
})();
