/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.utils.propertyTypeState');
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
(function() {
	'use strict';
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	sap.apf.modeler.ui.utils.PropertyTypeState = function() {
		this.aProperties = [];
		this.aPropertyTypeViewIds = [];
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.constructor = sap.apf.modeler.ui.utils.PropertyTypeState;
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.addProperty = function(sProperty) {
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sProperty)) {
			return;
		}
		this.aProperties.push(sProperty);
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.addPropertyAt = function(sProperty, nIndex) {
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sProperty)) {
			return;
		}
		if (nIndex > this.aProperties.length && nIndex >= 0) {
			return;
		}
		this.aProperties.splice(nIndex, 0, sProperty);
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.updatePropertyAt = function(sNewProperty, nIndex) {
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sNewProperty)) {
			return;
		}
		if (nIndex > this.aProperties.length && nIndex >= 0) {
			return;
		}
		this.aProperties[nIndex] = sNewProperty;
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.removePropertyAt = function(nIndex) {
		if (nIndex > this.aProperties.length && nIndex >= 0) {
			return;
		}
		this.aProperties.splice(nIndex, 1);
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.removeAllProperties = function() {
		this.aProperties.splice(0, this.aProperties.length);
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.isPropertyPresentExactlyOnce = function(sProperty) {
		var nIndex, nCounter = 0;
		for(nIndex = 0; nIndex < this.aProperties.length; nIndex++) {
			if (this.aProperties[nIndex] === sProperty) {
				nCounter++;
			}
		}
		if (nCounter === 1) {
			return true;
		}
		return false;
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.getPropertyValueState = function() {
		return this.aProperties;
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.addPropertyTypeViewId = function(sViewId) {
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sViewId)) {
			return;
		}
		this.aPropertyTypeViewIds.push(sViewId);
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.addPropertyTypeViewIdAt = function(sViewId, nIndex) {
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sViewId)) {
			return;
		}
		if (nIndex > this.aProperties.length && nIndex >= 0) {
			return;
		}
		this.aPropertyTypeViewIds.splice(nIndex, 0, sViewId);
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.removePropertyTypeViewIdAt = function(nIndex) {
		if (nIndex > this.aProperties.length && nIndex >= 0) {
			return;
		}
		this.aPropertyTypeViewIds.splice(nIndex, 1);
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.removeAllPropertyTypeViewIds = function() {
		this.aPropertyTypeViewIds.splice(0, this.aPropertyTypeViewIds.length);
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.indexOfPropertyTypeViewId = function(sViewId) {
		return this.aPropertyTypeViewIds.indexOf(sViewId);
	};
	sap.apf.modeler.ui.utils.PropertyTypeState.prototype.getViewAt = function(nIndex) {
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(nIndex)) {
			return;
		}
		return sap.ui.getCore().byId(this.aPropertyTypeViewIds[nIndex]);
	};
})();