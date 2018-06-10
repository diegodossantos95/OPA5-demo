/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/**
 * Utility to access annotations for SmartField control. OData V2 annotations are supported and vocabulary-based OData V4 annotations, which are used
 * as fall-back. For <code>sap:updatable-path</code> currently no OData V4 annotation is considered, because it is replaced by the instance
 * annotation <code>com.sap.vocabularies.Common.v1.Updatable</code>, which is meaningless in a context of OData V2 with additional OData V4
 * annotations. An additional exception is <code>sap:visible</code>, as there is no replacement available. Additionally please note that
 * <code>sap:display-format</code> with value <code>Date</code> is not considered here, as it is replaced by the new primitive type
 * <code>Edm.Date</code> from V4 onwards. And <code>sap:semantics</code> with value <code>fixed-values</code> on entity set is not considered
 * here. It addresses value help use cases, especially the entity set used for value help.
 *
 * @name sap.ui.comp.smartfield.AnnotationHelper
 * @author SAP SE
 * @version 1.50.6
 * @private
 * @since 1.29.0
 * @return {sap.ui.comp.smartfield.AnnotationHelper} the annotation access class.
 */
sap.ui.define([], function() {
	"use strict";

	/**
	 * @private
	 * @constructor
	 */
	var AnnotationHelper = function() {
		// nothing to do here.
	};

	/**
	 * Calculates the value of the text annotation.
	 *
	 * @param {object} oProperty the OData property from the meta model for which to calculate the value of the text annotation
	 * @return {string} the value of the text annotation, which can be <code>null</code>.
	 * @public
	 */
	AnnotationHelper.prototype.getText = function(oProperty) {
		return oProperty["sap:text"] || this._getObject("com.sap.vocabularies.Common.v1.Text/Path", oProperty);
	};

	/**
	 * Gets the value of the text arrangement annotation.
	 *
	 * @param {object} oProperty the given property from the meta model
	 * @param {object} oEntityType the given entity set from the meta model
	 * @returns {string} <code>"idOnly"</code>, <code>"descriptionOnly"</code>, <code>"idAndDescription"</code>, <code>"descriptionAndId"</code>
	 * @public
	 */
	AnnotationHelper.prototype.getTextArrangement = function(oProperty, oEntityType) {
		var oEnumTextArrangement = null,
			oPropertyTextAnnotation = null;

		oPropertyTextAnnotation = this._getObject("com.sap.vocabularies.Common.v1.Text", oProperty);

		if (oPropertyTextAnnotation) {
			oEnumTextArrangement = oPropertyTextAnnotation["com.sap.vocabularies.UI.v1.TextArrangement"];
		}

		if (!oEnumTextArrangement) {
			oEnumTextArrangement = this._getObject("com.sap.vocabularies.UI.v1.TextArrangement", oEntityType);
		}

		if (oEnumTextArrangement && oEnumTextArrangement.EnumMember) {

			if (oEnumTextArrangement.EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst") {
				return "descriptionAndId";
			}

			if (oEnumTextArrangement.EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast") {
				return "idAndDescription";
			}

			if (oEnumTextArrangement.EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate") {
				return "idOnly";
			}

			if (oEnumTextArrangement.EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly") {
				return "descriptionOnly";
			}
		}

		return null;
	};

	/**
	 * Calculates the value of the unit annotation.
	 *
	 * @param {object} oProperty the OData property from the meta model for which to calculate the value of the unit annotation
	 * @return {string} the value of the unit annotation, which can be <code>null</code>.
	 * @public
	 */
	AnnotationHelper.prototype.getUnit = function(oProperty) {
		return oProperty["sap:unit"] || this._getObject("Org.OData.Measures.V1.ISOCurrency/Path", oProperty) || this._getObject("Org.OData.Measures.V1.Unit/Path", oProperty);
	};

	/**
	 * Calculates the value of the label annotation.
	 *
	 * @param {object} oProperty the OData property for which to calculate the value of the label annotation
	 * @return {string} the value of the label annotation, which can be <code>null</code>.
	 * @public
	 */
	AnnotationHelper.prototype.getLabel = function(oProperty) {
		var sLabel = this._getObject("com.sap.vocabularies.UI.v1.DataFieldWithUrl/Label/String", oProperty);
		return sLabel || oProperty["sap:label"] || this._getObject("com.sap.vocabularies.Common.v1.Label/String", oProperty);
	};

	/**
	 * Checks whether the given property semantically addresses a currency.
	 *
	 * @param {object} oProperty the OData property
	 * @return {boolean} <code>true</code>, if a currency is addressed, <code>false</code> otherwise.
	 * @public
	 */
	AnnotationHelper.prototype.isCurrency = function(oProperty) {
		return (oProperty["sap:semantics"] === "currency-code") || !!this._getObject("Org.OData.Measures.V1.ISOCurrency/Path", oProperty);
	};

	/**
	 * Calculates the value of the quickinfo annotation. e.q. usage as tooltip
	 *
	 * @param {object} oProperty the OData property from the meta model
	 * @return {string} the value of the quickinfo annotation, which can be <code>null</code>.
	 * @public
	 */
	AnnotationHelper.prototype.getQuickInfo = function(oProperty) {
		return oProperty["sap:quickinfo"] || this._getObject("com.sap.vocabularies.Common.v1.QuickInfo/String", oProperty);
	};

	/**
	 * Checks whether the given property needs to be masked. e.q. usage as password
	 *
	 * @param {object} oProperty the OData property from the meta model
	 * @return {boolean} <code>true</code>, if masking is required, <code>false</code> otherwise.
	 * @public
	 */
	AnnotationHelper.prototype.isMasked = function(oProperty) {
		return (!!this._getObject("com.sap.vocabularies.Common.v1.Masked", oProperty));
	};

	/**
	 * Checks whether the given property supports the multi-line-text annotation
	 *
	 * @param {object} oProperty the OData property from the meta model
	 * @return {boolean} <code>true</code>, if this annotation exists, <code>false</code> otherwise.
	 * @public
	 */
	AnnotationHelper.prototype.isMultiLineText = function(oProperty) {
		return (!!this._getObject("com.sap.vocabularies.UI.v1.MultiLineText", oProperty));
	};

	/**
	 * Checks whether the given property is static-mandatory.
	 *
	 * @param {object} oProperty The OData property from the meta model
	 * @return {boolean} <code>true</code>, if a property is static-mandatory, <code>false</code> otherwise.
	 * @public
	 */
	AnnotationHelper.prototype.isStaticMandatory = function(oProperty) {
		var oFieldControl = this._getObject("com.sap.vocabularies.Common.v1.FieldControl", oProperty);
		if (oFieldControl && oFieldControl.EnumMember) {
			return (oFieldControl.EnumMember === "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory");
		}
		return false;
	};

	/**
	 * Checks whether the given property is nullable.
	 *
	 * @param {object} oProperty The OData property from the meta model
	 * @return {boolean} <code>true</code>, if a property is nullable, <code>false</code> otherwise.
	 * @public
	 */
	AnnotationHelper.prototype.isNullable = function(oProperty) {
		var oNullable = this._getObject("nullable", oProperty);
		if (oNullable) {
			return (oNullable === "true");
		}
		return true;
	};

	/**
	 * Checks whether the given property requires a conversion of its value to upper case.
	 *
	 * @param {object} oProperty the OData property from the meta model
	 * @return {boolean} <code>true</code>, if a conversion to upper case is required, <code>false</code> otherwise.
	 * @public
	 */
	AnnotationHelper.prototype.isUpperCase = function(oProperty) {
		return (oProperty["sap:display-format"] === "UpperCase") || (this._getObject("com.sap.vocabularies.Common.v1.IsUpperCase/Bool", oProperty) === "true");
	};

	/**
	 * Checks whether creating an entity set is statically enabled.
	 *
	 * @param {object} oEntitySet the given entity set from the meta model
	 * @return {boolean} <code>true</code>, if creating an entity set is statically enabled, <code>false</code> otherwise.
	 * @public
	 */
	AnnotationHelper.prototype.canCreateEntitySet = function(oEntitySet) {
		var bNo = (oEntitySet["sap:creatable"] === "false") || (this._getObject("Org.OData.Capabilities.V1.InsertRestrictions/Insertable/Bool", oEntitySet) === "false");
		return !bNo;
	};

	/**
	 * Checks whether creating a property is statically enabled.
	 *
	 * @param {object} oProperty the given property from the meta model
	 * @return {boolean} <code>true</code>, if creating a property is statically enabled, <code>false</code> otherwise.
	 * @public
	 */
	AnnotationHelper.prototype.canCreateProperty = function(oProperty) {

		if (this._getObject("Org.OData.Core.V1.Computed/Bool", oProperty) === "true") {
			return false;
		}

		if (oProperty["sap:creatable"] === "false") {
			return false;
		}

		return true;
	};

	/**
	 * Checks whether updating an entity set is statically enabled.
	 *
	 * @param {object} oEntitySet the given entity set from the meta model
	 * @return {boolean} <code>true</code>, if updating an entity set is statically enabled, <code>false</code> otherwise.
	 * @public
	 */
	AnnotationHelper.prototype.canUpdateEntitySet = function(oEntitySet) {
		var bNo = (oEntitySet["sap:updatable"] === "false") || (this._getObject("Org.OData.Capabilities.V1.UpdateRestrictions/Updatable/Bool", oEntitySet) === "false");
		return !bNo;
	};

	/**
	 * Checks whether updating an entity set is statically enabled.
	 *
	 * @param {object} oEntitySet the given entity set from the meta model
	 * @return {string} the path of the field control property.
	 * @public
	 */
	AnnotationHelper.prototype.getUpdateEntitySetPath = function(oEntitySet) {
		return oEntitySet["sap:updatable"] || this._getObject("Org.OData.Capabilities.V1.UpdateRestrictions/Updatable/Path", oEntitySet);
	};

	/**
	 * Checks whether updating a property is statically enabled.
	 *
	 * @param {object} oProperty the given property from the meta model
	 * @return {boolean} <code>true</code>, if updating a property is statically enabled, <code>false</code> otherwise.
	 * @public
	 */
	AnnotationHelper.prototype.canUpdateProperty = function(oProperty) {
		var bNo = (oProperty["sap:updatable"] === "false") || (this._getObject("Org.OData.Core.V1.Immutable/Bool", oProperty) === "true") || (this._getObject("com.sap.vocabularies.Common.v1.FieldControl/EnumMember", oProperty) === "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly");
		return !bNo;
	};

	/**
	 * Calculates the path of the field control property for a given property.
	 *
	 * @param {object} oProperty the given property from the meta model
	 * @return {string} the path of the field control property.
	 * @public
	 */
	AnnotationHelper.prototype.getFieldControlPath = function(oProperty) {
		return oProperty["sap:field-control"] || this._getObject("com.sap.vocabularies.Common.v1.FieldControl/Path", oProperty);
	};

	/**
	 * Checks whether the visibility of a property is statically modeled.
	 *
	 * @param {object} oProperty the given property from the meta model
	 * @return {string} <code>true</code>, if a property is modeled as statically visible, <code>false</code> otherwise.
	 * @public
	 */
	AnnotationHelper.prototype.getVisible = function(oProperty) {

		if (oProperty["sap:visible"]) {
			return oProperty["sap:visible"];
		}

		// no "sap:visible": so check for a static field control.
		var sValue = this._getObject("com.sap.vocabularies.Common.v1.FieldControl/EnumMember", oProperty);

		if (sValue === "com.sap.vocabularies.Common.v1.FieldControlType/Hidden") {
			return "false";
		}

		// return default.
		return "true";
	};

	/**
	 * Returns an object that is addressed by a given path. If no object can be found <code>null</code> is returned.
	 *
	 * @param {string} sPath the path to address the object
	 * @param {object} oObject the object to start with
	 * @return {object} the target object, can be <code>null</code>.
	 * @private
	 */
	AnnotationHelper.prototype._getObject = function(sPath, oObject) {
		var oNode = oObject, aParts = sPath.split("/"), iIndex = 0;

		while (oNode && aParts[iIndex]) {
			oNode = oNode[aParts[iIndex]];
			iIndex++;
		}

		return oNode;
	};

	AnnotationHelper.prototype.destroy = function() {
		// nothing to do here.
	};

	return AnnotationHelper;
}, true);
