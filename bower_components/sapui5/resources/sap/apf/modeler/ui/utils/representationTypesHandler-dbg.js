/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.utils.representationTypesHandler');
jQuery.sap.require('sap.apf.modeler.ui.utils.labelForRepresentationTypes');
jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
jQuery.sap.require("sap.apf.core.constants");
(function() {
	'use strict';
	sap.apf.modeler.ui.utils.RepresentationTypesHandler = function(aRepresentationTypes) {
		this.aRepresentationTypes = aRepresentationTypes;
	};
	sap.apf.modeler.ui.utils.RepresentationTypesHandler.prototype.constructor = sap.apf.modeler.ui.utils.RepresentationTypesHandler;
	function _getSupportedDimensionOrLegendKinds(oRepresentationTypesHandler, sRepresentationType, sMinValue) {
		var aSupportedDimensionKinds = [], nIndexOfRepnType, aSupportedKinds;
		nIndexOfRepnType = oRepresentationTypesHandler.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return aSupportedDimensionKinds;
		}
		aSupportedKinds = oRepresentationTypesHandler.aRepresentationTypes[nIndexOfRepnType].metadata.dimensions.supportedKinds;
		aSupportedKinds.forEach(function(oSupportedKind) {
			if (oSupportedKind.min === sMinValue) {
				aSupportedDimensionKinds.push(oSupportedKind.kind);
			}
		});
		return aSupportedDimensionKinds;
	}
	function _isTableRepresentationType(sRepresentationType) {
		if (sRepresentationType === "TableRepresentation") {
			return true;
		}
		return false;
	}
	function _isTreeTableRepresentationType(sRepresentationType) {
		if (sRepresentationType === "TreeTableRepresentation") {
			return true;
		}
		return false;
	}
	sap.apf.modeler.ui.utils.RepresentationTypesHandler.prototype.getLabelsForChartType = function(oTextReader, sRepresentationType, sKind) {
		var oLabelForRepresentationTypes = new sap.apf.modeler.ui.utils.LabelForRepresentationTypes(oTextReader);
		return oLabelForRepresentationTypes.getLabelsForChartType(sRepresentationType, sKind);
	};
	sap.apf.modeler.ui.utils.RepresentationTypesHandler.prototype.indexOfRepresentationType = function(sRepresentationType) {
		var nIndex;
		for(nIndex = 0; nIndex < this.aRepresentationTypes.length; nIndex++) {
			if (this.aRepresentationTypes[nIndex].id === sRepresentationType) {
				return nIndex;
			}
		}
		return -1;
	};
	sap.apf.modeler.ui.utils.RepresentationTypesHandler.prototype.getConstructorOfRepresentationType = function(sRepresentationType) {
		var nIndexOfRepnType = this.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return null;
		}
		return this.aRepresentationTypes[nIndexOfRepnType].constructor;
	};
	sap.apf.modeler.ui.utils.RepresentationTypesHandler.prototype.getPictureOfRepresentationType = function(sRepresentationType) {
		var nIndexOfRepnType = this.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return null;
		}
		return this.aRepresentationTypes[nIndexOfRepnType].picture;
	};
	sap.apf.modeler.ui.utils.RepresentationTypesHandler.prototype.getKindsForDimensionPropertyType = function(sRepresentationType) {
		return _getSupportedDimensionOrLegendKinds(this, sRepresentationType, "1");
	};
	sap.apf.modeler.ui.utils.RepresentationTypesHandler.prototype.getKindsForLegendPropertyType = function(sRepresentationType) {
		return _getSupportedDimensionOrLegendKinds(this, sRepresentationType, "0");
	};
	sap.apf.modeler.ui.utils.RepresentationTypesHandler.prototype.getKindsForMeasurePropertyType = function(sRepresentationType) {
		var nIndexOfRepnType, aSupportedKinds = [];
		nIndexOfRepnType = this.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return aSupportedKinds;
		}
		aSupportedKinds = this.aRepresentationTypes[nIndexOfRepnType].metadata.measures.supportedKinds.map(function(oSupportedKind) {
			return oSupportedKind.kind;
		});
		return aSupportedKinds;
	};
	sap.apf.modeler.ui.utils.RepresentationTypesHandler.prototype.getKindsForPropertyType = function(sRepresentationType) {
		var nIndexOfRepnType, aSupportedKinds = [];
		nIndexOfRepnType = this.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return aSupportedKinds;
		}
		if (this.aRepresentationTypes[nIndexOfRepnType].metadata.properties) {
			aSupportedKinds = this.aRepresentationTypes[nIndexOfRepnType].metadata.properties.supportedKinds.map(function(oSupportedKind) {
				return oSupportedKind.kind;
			});
		}
		return aSupportedKinds;
	};
	sap.apf.modeler.ui.utils.RepresentationTypesHandler.prototype.getKindsForHierarchicalPropertyType = function(sRepresentationType) {
		var nIndexOfRepnType, aSupportedKinds = [];
		nIndexOfRepnType = this.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return aSupportedKinds;
		}
		if (this.aRepresentationTypes[nIndexOfRepnType].metadata.hierarchicalColumn) {
			aSupportedKinds = this.aRepresentationTypes[nIndexOfRepnType].metadata.hierarchicalColumn.supportedKinds.map(function(oSupportedKind) {
				return oSupportedKind.kind;
			});
		}
		return aSupportedKinds;
	};
	sap.apf.modeler.ui.utils.RepresentationTypesHandler.prototype.isChartTypeSimilar = function(sFirstRepresentationType, sSecondRepresentationType) {
		var aSimilarChartTypes = sap.apf.modeler.ui.utils.CONSTANTS.similarChartTypes;
		return (aSimilarChartTypes.indexOf(sFirstRepresentationType) !== -1) && (aSimilarChartTypes.indexOf(sSecondRepresentationType) !== -1);
	};
	sap.apf.modeler.ui.utils.RepresentationTypesHandler.prototype.isAdditionToBeEnabled = function(sRepresentationType, sPropertyType, sKind) {
		var bEnableAddition = false;
		var oPropertyTypes = sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes;
		var nIndexOfRepnType = this.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return bEnableAddition;
		}
		if (sPropertyType === oPropertyTypes.PROPERTY) {
			if (_isTableRepresentationType(sRepresentationType) || _isTreeTableRepresentationType(sRepresentationType)) {
				bEnableAddition = true;
			}
			return bEnableAddition;
		}
		if (sPropertyType === oPropertyTypes.LEGEND) {
			sPropertyType = oPropertyTypes.DIMENSION;
		}
		this.aRepresentationTypes[nIndexOfRepnType].metadata[sPropertyType].supportedKinds.forEach(function(oSupportedKind) {
			if (sKind === oSupportedKind.kind && oSupportedKind.max === "*") {
				bEnableAddition = true;
			}
		});
		return bEnableAddition;
	};
})();