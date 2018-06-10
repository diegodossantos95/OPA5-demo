/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.utils.representationHandler');
jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
(function() {
	'use strict';
	sap.apf.modeler.ui.utils.RepresentationHandler = function(oRepresentation, oRepresentationTypeHandler, oTextReader) {
		this.oRepresentation = oRepresentation;
		this.oRepresentationTypeHandler = oRepresentationTypeHandler;
		this.oTextReader = oTextReader;
	};
	sap.apf.modeler.ui.utils.RepresentationHandler.prototype.constructor = sap.apf.modeler.ui.utils.RepresentationHandler;
	function _formPropertiesToBeCreated(aSupportedPropertiesKinds, aAllProperties, sMethodNametoFetchKind, sDefaultPropertyValue) {
		var aPropertiesToBeCreated = [], bKindSet;
		aSupportedPropertiesKinds.forEach(function(sKind) {
			bKindSet = false;
			aAllProperties.forEach(function(sProperty) {
				if (sMethodNametoFetchKind === undefined || (sMethodNametoFetchKind && sMethodNametoFetchKind(sProperty) === sKind)) {
					bKindSet = true;
					aPropertiesToBeCreated.push({
						sProperty : sProperty,
						sContext : sKind
					});
				}
			});
			if (!bKindSet) {
				aPropertiesToBeCreated.push({
					sProperty : sDefaultPropertyValue,
					sContext : sKind
				});
			}
		});
		return aPropertiesToBeCreated;
	}
	sap.apf.modeler.ui.utils.RepresentationHandler.prototype.getActualDimensions = function() {
		var aAllDimensions = this.oRepresentation.getDimensions();
		var aSupportedDimensionKinds = this.oRepresentationTypeHandler.getKindsForDimensionPropertyType(this.oRepresentation.getRepresentationType());
		return _formPropertiesToBeCreated(aSupportedDimensionKinds, aAllDimensions, this.oRepresentation.getDimensionKind, "");
	};
	sap.apf.modeler.ui.utils.RepresentationHandler.prototype.getActualLegends = function() {
		var aAllDimensions = this.oRepresentation.getDimensions();
		var aSupportedLegendKinds = this.oRepresentationTypeHandler.getKindsForLegendPropertyType(this.oRepresentation.getRepresentationType());
		return _formPropertiesToBeCreated(aSupportedLegendKinds, aAllDimensions, this.oRepresentation.getDimensionKind, this.oTextReader("none"));
	};
	sap.apf.modeler.ui.utils.RepresentationHandler.prototype.getActualMeasures = function() {
		var aAllMeasures = this.oRepresentation.getMeasures();
		var aSupportedMeasureKinds = this.oRepresentationTypeHandler.getKindsForMeasurePropertyType(this.oRepresentation.getRepresentationType());
		return _formPropertiesToBeCreated(aSupportedMeasureKinds, aAllMeasures, this.oRepresentation.getMeasureKind, "");
	};
	sap.apf.modeler.ui.utils.RepresentationHandler.prototype.getActualProperties = function() {
		var aAllProperties = this.oRepresentation.getProperties();
		var sPropertyToBeAppended = this.oRepresentation.getRepresentationType() === "TreeTableRepresentation" ? this.oTextReader("none") : "";
		var aSupportedPropertyKind = this.oRepresentationTypeHandler.getKindsForPropertyType(this.oRepresentation.getRepresentationType());
		return _formPropertiesToBeCreated(aSupportedPropertyKind, aAllProperties, this.oRepresentation.getPropertyKind, sPropertyToBeAppended);
	};
	sap.apf.modeler.ui.utils.RepresentationHandler.prototype.getHierarchicalProperty = function() {
		var aAllProperties = [];
		aAllProperties.push(this.oRepresentation.getHierarchyProperty());
		var aSupportedPropertyKind = this.oRepresentationTypeHandler.getKindsForHierarchicalPropertyType(this.oRepresentation.getRepresentationType());
		return _formPropertiesToBeCreated(aSupportedPropertyKind, aAllProperties, undefined, "");
	};
})();