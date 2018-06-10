/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
jQuery.sap.declare('sap.apf.modeler.ui.utils.propertyTypeFactory');
jQuery.sap.require('sap.apf.utils.utils');
(function() {
	'use strict';
	var oPropertyTypes = sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes;
	sap.apf.modeler.ui.utils.PropertyTypeFactory = function() {
	};
	sap.apf.modeler.ui.utils.PropertyTypeFactory.prototype.constructor = sap.apf.modeler.ui.utils.PropertyTypeFactory;
	sap.apf.modeler.ui.utils.PropertyTypeFactory.prototype.createPropertyTypeView = function(oViewData, sViewId) {
		var oView, oPropertyTypeController, sViewName = "sap.apf.modeler.ui.view.propertyType";
		switch (oViewData.sPropertyType) {
			case oPropertyTypes.DIMENSION:
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationDimension");
				break;
			case oPropertyTypes.MEASURE:
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationMeasure");
				break;
			case oPropertyTypes.LEGEND:
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationLegend");
				break;
			case oPropertyTypes.PROPERTY:
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationProperty");
				break;
			case oPropertyTypes.HIERARCHIALCOLUMN:
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationHierarchyProperty");
				break;
			case oPropertyTypes.REPRESENTATIONSORT:
				sViewName = "sap.apf.modeler.ui.view.sortPropertyType";
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationSortPropertyType");
				break;
			case oPropertyTypes.STEPSORT:
				sViewName = "sap.apf.modeler.ui.view.sortPropertyType";
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.stepSortPropertyType");
				break;
			default:
				return undefined;
		}
		oView = new sap.ui.view({
			viewName : sViewName,
			type : sap.ui.core.mvc.ViewType.XML,
			id : sViewId,
			viewData : oViewData,
			controller : oPropertyTypeController
		});
		return oView;
	};
})();