/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
// -----------------------------------------------------------------------------
// Analyses the OData service metadata doc ($metadata), having SAP-Annotations,
// to resolve all properties from entities, filterable properties, etc.
// -----------------------------------------------------------------------------
/* global Promise */
sap.ui.define([
	'jquery.sap.global', 'sap/ui/model/odata/ODataModel', 'sap/ui/model/odata/ODataAnnotations', './ODataType'
], function(jQuery, ODataModel, ODataAnnotations, ODataType) {
	"use strict";

	// map OData v4 FilterExpressionType enum member to corresponding filter-restriction value
	var mFilterRestrictions = {
		"com.sap.vocabularies.Common.v1.FilterExpressionType/SingleInterval": "interval",
		"com.sap.vocabularies.Common.v1.FilterExpressionType/MultiValue": "multi-value",
		"com.sap.vocabularies.Common.v1.FilterExpressionType/SingleValue": "single-value"
	};

	/**
	 * Constructs a utility class to analyse the OData metadata document ($metadata), to resolve SAP-Annotations. \n<b>Note:</b> Please ensure that
	 * the promise returned by {@link sap.ui.model.odata.ODataMetaModel#loaded loaded} is resolved before using this class!
	 * 
	 * @constructor
	 * @experimental This module is only for internal/experimental use!
	 * @public
	 * @param {String} oResourceRootUri - The URL of the resource or ODataModel
	 * @author SAP SE
	 */
	var MetadataAnalyser = function(oResourceRootUri) {
		if (typeof oResourceRootUri === "object") {
			this.oModel = oResourceRootUri;
		} else {
			this._sResourceRootUri = oResourceRootUri;
		}
		this._oMetadata = null;
		if (!this.oModel && this._sResourceRootUri) {
			this.oModel = new ODataModel(this._sResourceRootUri);
		}
		if (this.oModel) {
			this._oMetaModel = this.oModel.getMetaModel();
		}
		if (this._oMetaModel) {
			this._oMetadata = this._oMetaModel.getProperty("/");
		}

		// store the default schema
		if (this._oMetadata && this._oMetadata.dataServices) {
			this._oSchemaDefinition = this._oMetadata.dataServices.schema[0];
		}
	};

	// TODO: should we cache all these entity fields for future access?
	// this.mFilterFields[sEntityTypeName] = aFinalFilterableFields;

	/**
	 * Returns the namespace from the Schema
	 * 
	 * @returns {string} the namespace
	 * @public
	 * @deprecated Since 1.29.
	 */
	MetadataAnalyser.prototype.getNamespace = function() {
		if (this._oSchemaDefinition) {
			return this._oSchemaDefinition.namespace;
		}
	};

	/**
	 * @public Get the schema definition of the odata service
	 * @returns {Object} Get the schema definition of the odata service
	 * @deprecated Since 1.29.
	 */
	MetadataAnalyser.prototype.getSchemaDefinition = function() {
		return this._oSchemaDefinition;
	};

	/**
	 * Gets the specified attribute (sap:annotation) value from the default entity container
	 * 
	 * @param {String} sAttribute - The name of the attribute (sap:annotation) on the entity container
	 * @returns {String} The value of the specified attribute (if found)|null
	 * @public
	 */
	MetadataAnalyser.prototype.getEntityContainerAttribute = function(sAttribute) {
		var sAttributeValue = null, oEntityContainer;
		if (this._oMetaModel && sAttribute) {
			if (sAttribute.indexOf("sap:") < 0) {
				sAttribute = "sap:" + sAttribute;
			}
			oEntityContainer = this._oMetaModel.getODataEntityContainer();
			sAttributeValue = oEntityContainer[sAttribute] || null;
		}
		return sAttributeValue;
	};

	/**
	 * Gets the specified label for an Entity with non annotation
	 * 
	 * @param {string} sEntityType - name of the entity set
	 * @returns {string} - value of the label (if found)|empty
	 * @public
	 */
	MetadataAnalyser.prototype.getEntityLabelByEntityTypeName = function(sEntityType) {
		var oEntityDef = this._getEntityDefinition(sEntityType), oResult, sResult = "";
		if (oEntityDef) {
			oResult = oEntityDef["com.sap.vocabularies.Common.v1.Label"];
			if (oResult && oResult.String) {
				sResult = oResult.String;
			}
		}

		return sResult;
	};

	/**
	 * Gets the entity definition for the specified entity type
	 * 
	 * @param {String} sEntityTypeName - The entity type name as specified in the metadata document (with or without namespace)
	 * @returns {Object} entity definition
	 * @private
	 */
	MetadataAnalyser.prototype._getEntityDefinition = function(sEntityTypeName) {
		var oEntityDef = null;
		if (sEntityTypeName) {
			oEntityDef = this._oMetaModel.getODataEntityType(this._getFullyQualifiedNameForEntity(sEntityTypeName));
		}
		return oEntityDef;
	};

	/**
	 * Gets the complex type definition for the specified type
	 * 
	 * @param {String} sComplexTypeName - The complex type name as specified in the metadata document (with or without namespace)
	 * @returns {Object} entity definition
	 * @private
	 */
	MetadataAnalyser.prototype._getComplexTypeDefinition = function(sComplexTypeName) {
		var oComplexTypeDef = null;
		if (sComplexTypeName) {
			oComplexTypeDef = this._oMetaModel.getODataComplexType(this._getFullyQualifiedNameForEntity(sComplexTypeName));
		}
		return oComplexTypeDef;
	};

	/**
	 * Gets the property name of a complextype in a given entityType
	 * 
	 * @param {String} sEntityType - EntityType to search for the property
	 * @param {String} sComplexTypeEntityName - Type-Name of the complextype to resolve it.
	 * @returns {String} Returns the propertyname of the complextype as used in the given entityType
	 * @private
	 */
	MetadataAnalyser.prototype._getNameOfPropertyUsingComplexType = function(sEntityType, sComplexTypeEntityName) {
		var sCurrentNamespace = this.getNamespace();
		if (sEntityType && sComplexTypeEntityName && sCurrentNamespace) {
			var sTypeOnMainEntityType = sCurrentNamespace + "." + sComplexTypeEntityName;
			var oMainEntityTypeDef = this._getEntityDefinition(sEntityType);
			if (oMainEntityTypeDef) {
				var aProperties = oMainEntityTypeDef.property;
				if (aProperties && aProperties.length) {
					var i = 0;
					for (i = 0; i < aProperties.length; i++) {
						var oProperty = aProperties[i];
						if (oProperty && oProperty.type === sTypeOnMainEntityType) {
							return oProperty.name;
						}
					}
				}
			}
		}
		return null;
	};

	/**
	 * Removes the namespace from the specified string <br>
	 * returns string content that appears after the last "." separator <br>
	 * E.g.: if input is "com.sap.foo.EntityType", returns "EntityType" as the result
	 * 
	 * @param {string} sString String
	 * @returns {string} String without name space. If no name space was found, the original string will be returned.
	 * @public
	 */
	MetadataAnalyser.prototype.removeNamespace = function(sString) {
		var iIndex, sResult = sString;
		// Return the result
		if (sString) {
			iIndex = sString.lastIndexOf(".") + 1;
		}
		if (iIndex > 0) {
			sResult = sString.substring(iIndex);
		}
		return sResult;
	};

	/**
	 * Gets the entity type from the Entity name (EntitySet name)
	 * 
	 * @param {string} sEntitySetName - The entity name
	 * @returns {string} The entity type
	 * @private
	 */
	MetadataAnalyser.prototype.getEntityTypeNameFromEntitySetName = function(sEntitySetName) {
		var oEntitySet = null, sEntityTypeName = null;

		if (this._oMetaModel) {
			oEntitySet = this._oMetaModel.getODataEntitySet(sEntitySetName);
			if (oEntitySet) {
				sEntityTypeName = oEntitySet.entityType;
			}
		}
		return sEntityTypeName;
	};

	/**
	 * Gets the first matching entity set from the Entity Type name (EntityType name)
	 * 
	 * @param {string} sEntityTypeName - The entity name
	 * @returns {string} The entitySet name
	 * @private
	 * @deprecated Since 1.29.
	 */
	MetadataAnalyser.prototype.getEntitySetNameFromEntityTypeName = function(sEntityTypeName) {
		var sQualifiedEntity, oEntityContainer, aEntitySet, i, iLen, oEntitySet;
		// get entity type
		if (this._oMetaModel && sEntityTypeName) {
			sQualifiedEntity = this._getFullyQualifiedNameForEntity(sEntityTypeName);
			oEntityContainer = this._oMetaModel.getODataEntityContainer();
			if (oEntityContainer && sQualifiedEntity) {
				aEntitySet = oEntityContainer.entitySet;
				iLen = aEntitySet.length;
				for (i = 0; i < iLen; i++) {
					oEntitySet = aEntitySet[i];
					if (oEntitySet.entityType === sQualifiedEntity) {
						break;
					}
					oEntitySet = null;
				}
				// get entity set name
				if (oEntitySet) {
					return oEntitySet.name;
				}
			}
		}

		return null;
	};

	/**
	 * Gets a collection of keys (field names) for the specified entity name
	 * 
	 * @param {String} sEntitySetName - The entity name as specified in the metadata document
	 * @returns {Array} Array of key names
	 * @public
	 */
	MetadataAnalyser.prototype.getKeysByEntitySetName = function(sEntitySetName) {
		var aKeys = null, sEntityTypeName = null;
		if (!this._oMetaModel) {
			return undefined;
		}
		sEntityTypeName = this.getEntityTypeNameFromEntitySetName(sEntitySetName);
		if (sEntityTypeName) {
			aKeys = this.getKeysByEntityTypeName(sEntityTypeName);
		}
		return aKeys;
	};

	/**
	 * Gets a collection keys (field names) for the specified entity type
	 * 
	 * @param {String} sEntityTypeName - The entity type name as specified in the metadata document
	 * @returns {Array} Array of key names
	 * @public
	 */
	MetadataAnalyser.prototype.getKeysByEntityTypeName = function(sEntityTypeName) {
		var aKeys = null, aPropertyRefs = null, i, iLen = 0, oEntityDef = null;
		if (!this._oMetaModel) {
			return undefined;
		}
		oEntityDef = this._getEntityDefinition(sEntityTypeName);
		if (oEntityDef) {
			if (oEntityDef.key) {
				aPropertyRefs = oEntityDef.key.propertyRef;
				if (aPropertyRefs) {
					iLen = aPropertyRefs.length;
					aKeys = [];
					for (i = 0; i < iLen; i++) {
						aKeys.push(aPropertyRefs[i].name);
					}
				}
			}
		}
		return aKeys;
	};

	/**
	 * Gets a collection of fields for the specified entity name
	 * 
	 * @param {String} sEntitySetName - The entity name as specified in the metadata document
	 * @returns {Array} Array of fields
	 * @public
	 */
	MetadataAnalyser.prototype.getFieldsByEntitySetName = function(sEntitySetName) {
		var aFields = null, oEntitySet, sEntityTypeName = null;
		if (!this._oMetaModel) {
			return undefined;
		}
		oEntitySet = this._oMetaModel.getODataEntitySet(sEntitySetName);
		if (oEntitySet) {
			sEntityTypeName = oEntitySet.entityType;
		}

		if (sEntityTypeName) {
			aFields = this.getFieldsByEntityTypeName(sEntityTypeName);
			this._enrichEntitySetMetadata(aFields, oEntitySet);
		}

		return aFields;
	};

	/**
	 * Enriches the fields with entitySet relevant metadata
	 * 
	 * @param {Array} aFields - Array of field metadata derived from OData properties
	 * @param {Object} oEntitySet - The entity set instance from ODataMetaModel
	 * @private
	 */
	MetadataAnalyser.prototype._enrichEntitySetMetadata = function(aFields, oEntitySet) {
		var iLen, oField, aNonSortablePaths, aNonFilterablePaths, aRequiredFilterFields, mFilterExpressionRestriction;

		aNonSortablePaths = this._getNonSortableFields(oEntitySet);
		aNonFilterablePaths = this._getNonFilterableFields(oEntitySet);
		aRequiredFilterFields = this._getRequiredFilterFields(oEntitySet);
		mFilterExpressionRestriction = this._getFilterExpressionRestriction(oEntitySet);

		// Loop over the fields
		iLen = aFields.length;
		while (iLen--) {
			oField = aFields[iLen];
			// Update sortable on fields
			oField.sortable = !(aNonSortablePaths.indexOf(oField.name) > -1);
			// Update Filterable on fields
			oField.filterable = !(aNonFilterablePaths.indexOf(oField.name) > -1);
			// Update required filters
			oField.requiredFilterField = (aRequiredFilterFields.indexOf(oField.name) > -1);
			// Update FilterRestriction
			oField.filterRestriction = mFilterExpressionRestriction[oField.name];
		}
	};

	/**
	 * Extracts list of field names from the provided annotation and property (Org.OData.Capabilities.V1.SortRestrictions and NonSortableProperties)
	 * 
	 * @param {Object} oAnnotation - The annotation that from which PropertyPaths needs to be extracted
	 * @param {string} sAnnotationProperty - the property on the annotation that contains the array of PropertyPaths
	 * @returns {Array} Array of field names or []
	 * @private
	 */
	MetadataAnalyser.prototype._extractPropertyPathsFromAnnotation = function(oAnnotation, sAnnotationProperty) {
		var aPaths = [], aAnnotationProperties, iLen, sPath;
		if (oAnnotation && sAnnotationProperty) {
			aAnnotationProperties = oAnnotation[sAnnotationProperty];
		}
		if (aAnnotationProperties) {
			iLen = aAnnotationProperties.length;
			while (iLen--) {
				sPath = aAnnotationProperties[iLen].PropertyPath;
				if (sPath) {
					aPaths.push(sPath);
				}
			}
		}
		return aPaths;
	};

	/**
	 * Retrieves list of non sortable fields from the entitySet annotation (Org.OData.Capabilities.V1.SortRestrictions)
	 * 
	 * @param {Object} oEntitySet - The entity set instance from ODataMetaModel
	 * @returns {Array} Array of field names
	 * @private
	 */
	MetadataAnalyser.prototype._getNonSortableFields = function(oEntitySet) {
		var oSortRestrictions;
		if (oEntitySet) {
			oSortRestrictions = oEntitySet["Org.OData.Capabilities.V1.SortRestrictions"];
		}
		return this._extractPropertyPathsFromAnnotation(oSortRestrictions, "NonSortableProperties");
	};

	/**
	 * Retrieves list of non sortable fields from the entitySet annotation (Org.OData.Capabilities.V1.SortRestrictions)
	 * 
	 * @param {Object} oEntitySet - The entity set instance from ODataMetaModel
	 * @returns {Array} Array of field names
	 * @private
	 */
	MetadataAnalyser.prototype._getNonFilterableFields = function(oEntitySet) {
		var oFilterRestrictions;
		if (oEntitySet) {
			oFilterRestrictions = oEntitySet["Org.OData.Capabilities.V1.FilterRestrictions"];
		}
		return this._extractPropertyPathsFromAnnotation(oFilterRestrictions, "NonFilterableProperties");
	};

	/**
	 * Retrieves list of required fields based on the entitySet annotation (Org.OData.Capabilities.V1.FilterRestrictions/RequiredProperties)
	 * 
	 * @param {Object} oEntitySet - The entity set instance from ODataMetaModel
	 * @returns {Array} Array of field names
	 * @private
	 */
	MetadataAnalyser.prototype._getRequiredFilterFields = function(oEntitySet) {
		var oFilterRestrictions;
		if (oEntitySet) {
			oFilterRestrictions = oEntitySet["Org.OData.Capabilities.V1.FilterRestrictions"];
		}
		return this._extractPropertyPathsFromAnnotation(oFilterRestrictions, "RequiredProperties");
	};

	/**
	 * Retrieves map of fields with filter restriction the entitySet annotation (com.sap.vocabularies.Common.v1.FilterExpressionRestrictions)
	 * 
	 * @param {Object} oEntitySet - The entity set instance from ODataMetaModel
	 * @returns {Object} JSON map of field names with filter restriction
	 * @private
	 */
	MetadataAnalyser.prototype._getFilterExpressionRestriction = function(oEntitySet) {
		var mFilterExpressionRestriction = {}, aFilterExpressionRestrictions, iLen, oFilterExpressionRestriction, oProperty, oAllowedExpression;
		if (oEntitySet) {
			aFilterExpressionRestrictions = oEntitySet["com.sap.vocabularies.Common.v1.FilterExpressionRestrictions"];
			if (aFilterExpressionRestrictions) {
				iLen = aFilterExpressionRestrictions.length;
				while (iLen--) {
					oFilterExpressionRestriction = aFilterExpressionRestrictions[iLen];
					if (oFilterExpressionRestriction) {
						oProperty = oFilterExpressionRestriction.Property;
						oAllowedExpression = oFilterExpressionRestriction.AllowedExpressions;
						if (oProperty && oAllowedExpression && oProperty.PropertyPath && oAllowedExpression.EnumMember) {
							// convert to v2 format expected in several Smart controls
							mFilterExpressionRestriction[oProperty.PropertyPath] = mFilterRestrictions[oAllowedExpression.EnumMember];
						}
					}
				}
			}
		}
		return mFilterExpressionRestriction;
	};

	/**
	 * Checks if a property/navigation property is filterable (Org.OData.Capabilities.V1.FilterRestrictions/NonFilterableProperties)
	 * 
	 * @param {Object} oProperty - The property instance from ODataMetaModel
	 * @param {Object} oEntitySet - The entity set from the metadata document
	 * @returns {Boolean} whether the specified property is filterable
	 * @private
	 */
	MetadataAnalyser.prototype._isFilterable = function(oProperty, oEntitySet) {
		var aNonFilterablePaths, bFilterable = !(oProperty["sap:filterable"] === "false");
		// Only check for V4 annotation from entitySet when no filterable="false" V2 annotation exists.
		// (ODataMetaModel does not yet support V2-->V2 conversion of filterable for navigationProperty!)
		if (bFilterable && oEntitySet) {
			aNonFilterablePaths = this._getNonFilterableFields(oEntitySet);
			bFilterable = !(aNonFilterablePaths.indexOf(oProperty.name) > -1);
		}
		return bFilterable;
	};

	/**
	 * Checks if a property/navigation property is marked as hiddenFilter (com.sap.vocabularies.UI.v1.HiddenFilter)
	 * 
	 * @param {Object} oProperty - The property instance from ODataMetaModel
	 * @returns {Boolean} whether the specified property is marked as hiddenFilter
	 * @private
	 */
	MetadataAnalyser.prototype._isHiddenFilter = function(oProperty) {
		var bHiddenFilter = false,
		// hidden in filter
		oResult = oProperty["com.sap.vocabularies.UI.v1.HiddenFilter"];
		if (oResult) {
			bHiddenFilter = true;
		}
		return bHiddenFilter;
	};

	/**
	 * Checks if a property/navigation property is marked as <code>hidden</code> (com.sap.vocabularies.UI.v1.Hidden) The semantic of hidden is: the
	 * data is available on the UI, but no control is rendered for the data.
	 * 
	 * @param {Object} oProperty - The property instance from ODataMetaModel
	 * @returns {Boolean} whether the specified property is marked as hidden
	 * @private
	 */
	MetadataAnalyser.prototype._isHidden = function(oProperty) {
		// hidden at all on UI
		if (oProperty["com.sap.vocabularies.UI.v1.Hidden"]) {
			return true;
		}
		return false;
	};

	/**
	 * Gets a collection of fields for the specified entity type
	 * 
	 * @param {String} sEntityTypeName - The entity type name as specified in the metadata document
	 * @returns {Array} Array of fields
	 * @public
	 */
	MetadataAnalyser.prototype.getFieldsByEntityTypeName = function(sEntityTypeName) {
		var oEntityDef;
		if (!this._oMetaModel) {
			return undefined;
		}
		oEntityDef = this._getEntityDefinition(sEntityTypeName);
		return this._getFieldsByEntityDefinition(oEntityDef);
	};

	/**
	 * Gets a collection of fields for the specified complex type
	 * 
	 * @param {String} sComplexTypeName - The complex type name as specified in the metadata document
	 * @param {string} sParentPropertyName - The name of the parent property (complex type property)
	 * @returns {Array} Array of fields
	 * @public
	 */
	MetadataAnalyser.prototype.getFieldsByComplexTypeName = function(sComplexTypeName, sParentPropertyName) {
		var oComplexDef;
		if (!this._oMetaModel) {
			return undefined;
		}
		oComplexDef = this._getComplexTypeDefinition(sComplexTypeName);
		return this._getFieldsByEntityDefinition(oComplexDef, sParentPropertyName);
	};

	/**
	 * Get an array of all entity type names
	 * 
	 * @returns {Array} Returns an array of entity type names
	 * @public
	 */
	MetadataAnalyser.prototype.getAllEntityTypeNames = function() {
		if (!this._oMetaModel) {
			return undefined;
		}
		var oSchema = this._oSchemaDefinition;
		if (oSchema.entityType && oSchema.entityType.length > 0) {
			var i = 0;
			var aResult = [];
			for (i = 0; i < oSchema.entityType.length; i++) {
				aResult.push(oSchema.entityType[i].name);
			}
			return aResult;
		}
		return null;
	};

	/**
	 * Gets a map with fields and their related semantic objects
	 * 
	 * @param {String} sEntitySetName - The entity set for which the map should be returned
	 * @returns {object} map between fields and semantic objects
	 * @public
	 */
	MetadataAnalyser.prototype.getFieldSemanticObjectMap = function(sEntitySetName) {
		var aODataFieldMetadata = this.getFieldsByEntitySetName(sEntitySetName);
		if (!aODataFieldMetadata) {
			return null;
		}
		var oMap = {}, i, iLen = aODataFieldMetadata.length;
		for (i = 0; i < iLen; i++) {
			var oField = aODataFieldMetadata[i];
			var mAnnotation = this.getSemanticObjectAnnotation(oField.fullName);
			if (mAnnotation && mAnnotation.semanticObject) {
				oMap[oField.name] = mAnnotation.semanticObject;
			}
		}

		return oMap;
	};

	/**
	 * Gets a collection fields for the specified entity definition
	 * 
	 * @param {Object} oEntityDef - The entity definition as specified in the metadata document
	 * @param {string} sParentPropertyName - The name of the parent property (navigationProperty/complex type)
	 * @returns {Array} Array of fields
	 */
	MetadataAnalyser.prototype._getFieldsByEntityDefinition = function(oEntityDef, sParentPropertyName) {
		var aFields = null, aProperty = null, i = 0, iLen = 0, oProperty, oField;
		if (oEntityDef) {
			aProperty = oEntityDef.property;
		}

		// Enrich the fields with necessary information as an attribute (easy access)
		if (aProperty) {
			aFields = [];
			iLen = aProperty.length;
			for (i = 0; i < iLen; i++) {
				oProperty = aProperty[i];
				if (oProperty) {
					oField = this._parseProperty(oProperty, oEntityDef, sParentPropertyName);
					aFields.push(oField);
				}
			}
		}
		return aFields;
	};

	/**
	 * DO NOT USE: This method is mainly only needed to support sap:display-format="Date" which is not automatically converted to V4.<br>
	 * Gets the display format for a field.
	 * 
	 * @param {Object} oProperty The property whose details need to be extracted
	 * @returns {string|undefined} The display format if exists, otherwise <code>undefined</code>
	 */
	MetadataAnalyser.getDisplayFormat = function(oProperty) {
		var sDisplayFormat = oProperty["sap:display-format"];

		if (sDisplayFormat) {
			return sDisplayFormat;
		}

		if (MetadataAnalyser.isTermDefaultTrue(oProperty["com.sap.vocabularies.Common.v1.IsUpperCase"])) {
			return "UpperCase";
		}
	};

	/**
	 * Gets the display format for a link field.
	 * 
	 * @param {Object} oProperty The property whose details need to be extracted
	 * @returns {string} The display format if exists, otherwise an empty string
	 */
	MetadataAnalyser.getLinkDisplayFormat = function(oProperty) {

		if (MetadataAnalyser.isEmailAddress(oProperty)) {
			return "EmailAddress";
		}

		if (MetadataAnalyser.isPhoneNumber(oProperty)) {
			return "PhoneNumber";
		}

		if (MetadataAnalyser.isURL(oProperty)) {
			return "URL";
		}

		return "";
	};

	MetadataAnalyser.getValueListMode = function(oProperty) {
		var sValueList = oProperty["sap:value-list"];

		if (sValueList) {
			return sValueList;
		}

		if (MetadataAnalyser.isValueListWithFixedValues(oProperty)) {
			return "fixed-values";
		}

		return "";
	};

	/**
	 * Returns true if the annotation marked as true
	 * 
	 * @param {object} oTerm The Term annotation object
	 * @returns {boolean} <code>true</code>, if the annotation exists and is set to true
	 */
	MetadataAnalyser.isTermTrue = function(oTerm) {
		return !!oTerm && (oTerm.Bool === "true");
	};

	MetadataAnalyser.isPropertyStringType = function(oProperty) {
		return !!oProperty && (oProperty.type === "Edm.String");
	};

	/**
	 * Returns true if the annotation is not explicitly marked as false or if it is simply present
	 * 
	 * @param {object} oTerm The Term annotation object
	 * @returns {boolean} <code>true</code>, if the annotation exists -or- is not false
	 */
	MetadataAnalyser.isTermDefaultTrue = function(oTerm) {
		if (oTerm) {
			return oTerm.Bool ? oTerm.Bool !== "false" : true;
		}
		return false;
	};

	/**
	 * Checks whether a value is required for <code>oProperty</code>.
	 * 
	 * @param {object} oProperty The OData property from the meta model
	 * @returns {boolean} <code>false</code>, if <code>oProperty</code> is defined and the <code>nullable</code> attribute/constrain is set to
	 *          <code>false</code>, otherwise <code>true</code>
	 * @protected
	 * @since 1.50
	 */
	MetadataAnalyser.isNullable = function(oProperty) {
		return !(oProperty && (oProperty.nullable === "false"));
	};

	/**
	 * Checks whether <code>oProperty</code> is annotated as a digit sequence. Intended for <code>Edm.String</code> fields that are internally
	 * stored as <code>NUMC</code> (numeric text) data type.
	 * 
	 * @param {object} oProperty The OData property from the meta model
	 * @returns {boolean} <code>true</code>, if the OData property is annotated with the following
	 *          <code>"com.sap.vocabularies.Common.v1.IsDigitSequence": { "Bool" : "true" }</code> annotation.
	 * @protected
	 * @since 1.46
	 */
	MetadataAnalyser.isDigitSequence = function(oProperty) {
		return MetadataAnalyser.isPropertyStringType(oProperty) && MetadataAnalyser.isTermDefaultTrue(oProperty["com.sap.vocabularies.Common.v1.IsDigitSequence"]);
	};

	/**
	 * Checks whether <code>oProperty</code> is annotated as an e-mail address.
	 * 
	 * @param {object} oProperty The OData property from the meta model
	 * @returns {boolean} <code>true</code>, if the OData property is annotated with the following
	 *          <code>"com.sap.vocabularies.Common.v1.IsDigitSequence": { "Bool" : "true" }</code> annotation.
	 * @protected
	 * @since 1.46
	 */
	MetadataAnalyser.isEmailAddress = function(oProperty) {
		return MetadataAnalyser.isPropertyStringType(oProperty) && MetadataAnalyser.isTermDefaultTrue(oProperty["com.sap.vocabularies.Communication.v1.IsEmailAddress"]);
	};

	/**
	 * Checks whether <code>oProperty</code> is annotated as a phone number.
	 * 
	 * @param {object} oProperty The OData property from the meta model
	 * @returns {boolean} <code>true</code>, if the OData property is annotated with the following
	 *          <code>"com.sap.vocabularies.Common.v1.IsPhoneNumber": { "Bool" : "true" }</code> annotation.
	 * @protected
	 * @since 1.46
	 */
	MetadataAnalyser.isPhoneNumber = function(oProperty) {
		return MetadataAnalyser.isPropertyStringType(oProperty) && MetadataAnalyser.isTermDefaultTrue(oProperty["com.sap.vocabularies.Communication.v1.IsPhoneNumber"]);
	};

	/**
	 * Checks whether <code>oProperty</code> is annotated as a URL.
	 * 
	 * @param {object} oProperty The OData property from the meta model
	 * @returns {boolean} <code>true</code>, if the OData property is annotated with the following
	 *          <code>"Org.OData.Core.V1.IsURL": { "Bool" : "true" }</code> annotation.
	 * @protected
	 * @since 1.46
	 */
	MetadataAnalyser.isURL = function(oProperty) {
		return MetadataAnalyser.isPropertyStringType(oProperty) && (MetadataAnalyser.isTermDefaultTrue(oProperty["Org.OData.Core.V1.IsURL"]) || MetadataAnalyser.isTermDefaultTrue(oProperty["Org.OData.Core.V1.IsUrl"]));
	};

	/**
	 * Checks whether <code>oProperty</code> is annotated as value list.
	 * 
	 * @param {object} oProperty The OData property from the meta model
	 * @returns {boolean} <code>true</code>, if the OData property is annotated with the following
	 *          <code>com.sap.vocabularies.Common.v1.ValueList</code> annotation.
	 * @protected
	 * @since 1.46
	 */
	MetadataAnalyser.isValueList = function(oProperty) {
		var sTerm = "com.sap.vocabularies.Common.v1.ValueList";
		return !!(oProperty && (oProperty["sap:value-list"] || oProperty[sTerm]));
	};

	/**
	 * Checks whether <code>oProperty</code> is annotated as value list with fixed values.
	 * 
	 * @param {object} oProperty The OData property from the meta model
	 * @returns {boolean} <code>true</code>, if the OData property is annotated with the following
	 *          <code>"com.sap.vocabularies.Common.v1.ValueListWithFixedValues": { "Bool" : "true" }</code> annotation.
	 * @protected
	 * @since 1.46
	 */
	MetadataAnalyser.isValueListWithFixedValues = function(oProperty) {
		var sTerm = "com.sap.vocabularies.Common.v1.ValueListWithFixedValues";
		return MetadataAnalyser.isTermTrue(oProperty[sTerm]);
	};

	/**
	 * Parses a property and extracts the relevant information for easy consumption
	 * 
	 * @param {Object} oProperty - The property whose details need to be extracted
	 * @param {Object} oEntityDef - The entity definition as specified in the metadata document
	 * @param {string} sParentPropertyName - The name of the parent property (navigationProperty/complex type)
	 * @returns {Object} field
	 * @private
	 */
	MetadataAnalyser.prototype._parseProperty = function(oProperty, oEntityDef, sParentPropertyName) {
		var oField = jQuery.extend({}, oProperty), oResult;
		oResult = oProperty["com.sap.vocabularies.Common.v1.Label"];
		if (oResult) {
			oField.fieldLabel = oResult.String;
		}

		oResult = oProperty["com.sap.vocabularies.Common.v1.QuickInfo"];
		if (oResult) {
			oField.quickInfo = oResult.String;
		}
		// display terms
		oField.displayFormat = MetadataAnalyser.getDisplayFormat(oProperty);
		oField.isDigitSequence = MetadataAnalyser.isDigitSequence(oProperty);
		oField.isURL = MetadataAnalyser.isURL(oProperty);
		oField.isEmailAddress = MetadataAnalyser.isEmailAddress(oProperty);
		oField.isPhoneNumber = MetadataAnalyser.isPhoneNumber(oProperty);
		// oField.isUpperCase = MetadataAnalyser.isUpperCase(oProperty); coming soon..

		oField.aggregationRole = oProperty["sap:aggregation-role"];

		oResult = oProperty["Org.OData.Measures.V1.ISOCurrency"];
		if (oResult) {
			oField.isCurrencyField = true;
			oField.isMeasureField = true;
			oField.unit = oResult.Path;
		}
		oResult = oProperty["Org.OData.Measures.V1.Unit"];
		if (oResult) {
			oField.isMeasureField = true;
			oField.unit = oResult.Path;
		}
		oResult = oProperty["com.sap.vocabularies.Common.v1.Text"];
		if (oResult) {
			oField.description = oResult.Path;
			oField.displayBehaviour = this.getTextArrangementValue(oResult);
		}

		// Set filter attributes on the field
		oResult = oProperty["sap:filterable"];
		oField.filterable = oResult !== "false";
		oField.filterRestriction = oProperty["sap:filter-restriction"];
		oResult = oProperty["sap:required-in-filter"];
		oField.requiredFilterField = oResult === "true";

		// Set sort attributes on the field
		oResult = oProperty["sap:sortable"];
		oField.sortable = oResult !== "false";

		// Set whether field is an Image URL (twice - capital wording and CamelCase)
		// com.sap.vocabularies.UI.v1.IsImageURL is the expected one
		oResult = oProperty["com.sap.vocabularies.UI.v1.IsImageURL"] || oProperty["com.sap.vocabularies.UI.v1.IsImageUrl"];
		oField.isImageURL = MetadataAnalyser.isTermDefaultTrue(oResult);

		// Set the visible attribute on the field
		oResult = oProperty["com.sap.vocabularies.Common.v1.FieldControl"];
		oField.visible = !(oResult && oResult.EnumMember === "com.sap.vocabularies.Common.v1.FieldControlType/Hidden");
		oField.entityName = oEntityDef.name;
		oField.parentPropertyName = sParentPropertyName;
		oField.fullName = this._getFullyQualifiedNameForField(oProperty.name, oEntityDef);

		// hidden...
		// ...at all
		oField.hidden = this._isHidden(oProperty);
		// ...as filter
		oField.hiddenFilter = this._isHiddenFilter(oProperty) || oField.hidden;

		// defaultValue for parameters (and create scenarios -not yet relevant)
		if (oProperty["defaultValue"] !== "undefined") {
			oField.defaultPropertyValue = oProperty["defaultValue"];
		}

		// defaultValue for filters
		oResult = oProperty["com.sap.vocabularies.Common.v1.FilterDefaultValue"];
		if (oResult) {
			oField.defaultFilterValue = this._getDefaultValues(oProperty.type, oResult, oProperty); // oResult.String;
		}

		return oField;
	};

	MetadataAnalyser.prototype._getDefaultValues = function(sType, oResult, oProperty) {
		var vValue = null, sDefaultValueType = ODataType.getDefaultValueTypeName(sType);

		if (oResult[sDefaultValueType]) {
			vValue = oResult[sDefaultValueType];
		} else {
			jQuery.sap.log.error("default value for " + oProperty.name + " expected through the property " + sDefaultValueType);
		}

		return vValue;

	};

	/**
	 * Extract the property at the specified navigationProperty path and entitySet name
	 * 
	 * @param {String} sPropertyPath - The property path (via a navigation property) E.g. toProduct/ProductText
	 * @param {String} sEntitySetName - The entity name as specified in the metadata document
	 * @returns {Object} The extracted and parsed field (ODataProperty)
	 * @public
	 */
	MetadataAnalyser.prototype.extractNavigationPropertyField = function(sPropertyPath, sEntitySetName) {
		var sEntitySetPath, oMetaContext, oODataProperty, aPropertyPath, sPropertyName, sNavigationProperty, oEntityDef, oField = null;
		if (sEntitySetName && sPropertyPath) {
			sEntitySetPath = "/" + sEntitySetName + "/";
			aPropertyPath = sPropertyPath.split("/");
			sPropertyName = aPropertyPath.pop();
			sNavigationProperty = aPropertyPath.join("/");
			if (sNavigationProperty && sPropertyName) {
				oMetaContext = this._oMetaModel.getMetaContext(sEntitySetPath + sNavigationProperty);
				if (oMetaContext) {
					oEntityDef = this._oMetaModel.getProperty(oMetaContext.getPath());
				}
			}
			if (oEntityDef) {
				oODataProperty = this._oMetaModel.getODataProperty(oEntityDef, sPropertyName);
			}
			if (oODataProperty) {
				oField = this._parseProperty(oODataProperty, oEntityDef, sNavigationProperty);
			}
		}
		return oField;
	};

	/**
	 * Gets a an Array of the names of all possible filterable fields for the specified entity type
	 * 
	 * @param {String} sEntityTypeName - The entity type name as specified in the metadata document
	 * @returns {Array} Array of names of overall filterable fields
	 * @internal
	 * @deprecated Since 1.40.
	 */
	MetadataAnalyser.prototype.getAllFilterableFieldNamesByEntityTypeName = function(sEntityTypeName) {
		var aGroup, i, groupLength, j, fieldLength, aResult, oGroup;

		aResult = [];
		aGroup = this.getAllFilterableFieldsByEntityTypeName(sEntityTypeName);
		if (aGroup && aGroup.length) {
			groupLength = aGroup.length;
			for (i = 0; i < groupLength; i++) {
				oGroup = aGroup[i];
				if (oGroup.fields && oGroup.fields.length) {
					fieldLength = oGroup.fields.length;
					for (j = 0; j < fieldLength; j++) {
						aResult.push(oGroup.fields[j].name);
					}
				}
			}
		}
		return aResult;
	};

	/**
	 * Gets a collection of all possible filterable fields for the specified entity type or entity set
	 * 
	 * @param {String} sEntity - The entity type name or entity set name as specified in the metadata document
	 * @param {Boolean} bIsEntitySet - true when entity set name is passed
	 * @param {Boolean} bIgnoreAnalyticalParameters if true the entity types with <code>sap:semantic = 'parameter'</code> will be ignored
	 * @param {Array} aConsiderNavProperties List of allowed property names. If <code>null</code> all properties are taken into account
	 * @returns {Array} Array of overall filterable fields
	 * @private
	 */
	MetadataAnalyser.prototype._getAllFilterableFieldsByEntity = function(sEntity, bIsEntitySet, bIgnoreAnalyticalParameters, aConsiderNavProperties) {
		var aFilterGroups = [], oEntityDef, oEntitySet, mAssociations, sNavigationProperty, oResult, oSubEntityDef, oSubEntitySet, sSubEntityType;
		if (!this._oMetaModel || !sEntity) {
			return undefined;
		}

		if (bIsEntitySet) {
			oEntitySet = this._oMetaModel.getODataEntitySet(sEntity);
			if (oEntitySet) {
				oEntityDef = this._getEntityDefinition(oEntitySet.entityType);
			}
		} else {
			oEntityDef = this._getEntityDefinition(sEntity);
		}

		if (oEntityDef) {
			// filterable fields from the main entity
			aFilterGroups.push(this._getFilterableFieldsFromEntityDefinition(oEntityDef, undefined, oEntitySet));

			// filterable fields from associations which have 0..1 or 1 cardinality
			mAssociations = this._getFilterableAssociations(oEntityDef, oEntitySet);
			for (sNavigationProperty in mAssociations) {

				if (!aConsiderNavProperties || (aConsiderNavProperties.indexOf(sNavigationProperty) > -1)) {

					sSubEntityType = mAssociations[sNavigationProperty];
					if (bIsEntitySet) {
						oResult = this._oMetaModel.getODataAssociationSetEnd(oEntityDef, sNavigationProperty);
						if (oResult.entitySet) {
							oSubEntitySet = this._oMetaModel.getODataEntitySet(oResult.entitySet);
						}
					}
					oSubEntityDef = this._getEntityDefinition(sSubEntityType);
					// Entity definition can be null when entities are loaded lazily in the metadata (e.g. ValueList)
					if (oSubEntityDef) {

						if (bIgnoreAnalyticalParameters && (oSubEntityDef["sap:semantics"] === "parameters")) {
							continue;
						}

						aFilterGroups.push(this._getFilterableFieldsFromEntityDefinition(oSubEntityDef, sNavigationProperty, oSubEntitySet));
					}
				}
			}
		}
		return aFilterGroups;
	};

	/**
	 * Gets a collection of all possible filterable fields for the specified entity name
	 * 
	 * @param {String} sEntitySetName - The entity name as specified in the metadata document
	 * @param {Boolean} bIgnoreAnalyticalParameters if <code>true</code> the entity types, referenced by the navigation properties with
	 *        <code>sap:semantic = 'parameter'</code> will be ignored
	 * @param {Array} aConsiderNavProperties List of allowed property names. If <code>null</code> all properties are taken into account
	 * @returns {Array} Array of overall filterable fields
	 * @public
	 */
	MetadataAnalyser.prototype.getAllFilterableFieldsByEntitySetName = function(sEntitySetName, bIgnoreAnalyticalParameters, aConsiderNavProperties) {
		if (!this._oMetaModel) {
			return undefined;
		}

		return this._getAllFilterableFieldsByEntity(sEntitySetName, true, bIgnoreAnalyticalParameters, aConsiderNavProperties);
	};

	/**
	 * Gets a collection of all possible filterable fields for the specified entity type
	 * 
	 * @param {String} sEntityTypeName - The entity type name as specified in the metadata document
	 * @returns {Array} Array of overall filterable fields
	 * @public
	 */
	MetadataAnalyser.prototype.getAllFilterableFieldsByEntityTypeName = function(sEntityTypeName) {
		if (!this._oMetaModel) {
			return undefined;
		}

		return this._getAllFilterableFieldsByEntity(sEntityTypeName);
	};

	/**
	 * Gets an Object containing collection of filterable fields that are directly under the specified entity type
	 * 
	 * @param {Object} oEntityDef - The entity type definition from the metadata document
	 * @param {string} sParentPropertyName - The name of the parent property (navigationProperty/complex type)
	 * @param {Object} oEntitySet - The relevant entity set from which metadata should be enriched on the entity fields
	 * @returns {Object} Object containing array of filterable fields
	 * @private
	 */
	MetadataAnalyser.prototype._getFilterableFieldsFromEntityDefinition = function(oEntityDef, sParentPropertyName, oEntitySet) {
		var oFilterData = {}, aFields = [], aProperties = null, oProp, i, iLen, oProperty = null;
		if (!this._oMetaModel || !oEntityDef) {
			return undefined;
		}
		// Set the name and label from entity into the field's group
		oProp = oEntityDef["com.sap.vocabularies.Common.v1.Label"];
		if (oProp) {
			oFilterData.groupLabel = oProp.String;
		}
		oFilterData.groupEntityName = oEntityDef.name;
		oFilterData.groupName = sParentPropertyName;

		aProperties = this._getFieldsByEntityDefinition(oEntityDef, sParentPropertyName);
		// If a relevant entitySet is provided - enrich the field metadata
		if (oEntitySet) {
			this._enrichEntitySetMetadata(aProperties, oEntitySet);
		}
		iLen = aProperties.length;
		// Extract only visible and filterable fields from all fields!
		for (i = 0; i < iLen; i++) {
			oProperty = aProperties[i];
			if (oProperty.visible && oProperty.filterable) {
				aFields.push(oProperty);
			}
		}
		oFilterData.fields = aFields;
		return oFilterData;
	};

	/**
	 * Returns the fully qualified name of a field which is e.g. "com.sap.GL.ZAF.GL_ACCOUNT/CompanyCode". Schema namespace, entity type name and field
	 * name.
	 * 
	 * @param {string} sFieldName - the name of the field/property
	 * @param {Object} oEntityType - the entity Type under which the field/property is present
	 * @returns {string} - the fully qualified name
	 * @private
	 */
	MetadataAnalyser.prototype._getFullyQualifiedNameForField = function(sFieldName, oEntityType) {
		var sNamespace, sEntityTypeName, sResult = sFieldName;
		if (oEntityType) {
			sNamespace = oEntityType.namespace;
			sEntityTypeName = oEntityType.name;
		}
		if (sNamespace && sEntityTypeName) {
			sResult = sNamespace + "." + sEntityTypeName + "/" + sFieldName;
		}
		return sResult;
	};

	/**
	 * @param {string} sFullyQualifiedFieldName Fully qualified name
	 * @returns {string} The field name without name space and without entity
	 * @public
	 */
	MetadataAnalyser.prototype.getFieldNameByFullyQualifiedFieldName = function(sFullyQualifiedFieldName) {
		var sResult, nPos;

		sResult = this.removeNamespace(sFullyQualifiedFieldName);
		nPos = sResult.indexOf("/");
		sResult = sResult.substring(nPos + 1);
		return sResult;
	};

	/**
	 * Gets a collection of filterable associations under the specified entity type
	 * 
	 * @param {Object} oEntityDef - The entity type definition from the metadata document
	 * @param {Object} oEntitySet - The relevant entity set for which filterable associations have to be determined
	 * @returns {Object} Map of filterable associations
	 * @private
	 */
	MetadataAnalyser.prototype._getFilterableAssociations = function(oEntityDef, oEntitySet) {
		var mFilterableAssociations = {}, aNavigationProperties = null, oNavigationProperty = null, i, iLen = 0, oEndRole = null;
		if (!this._oMetaModel || !oEntityDef) {
			return undefined;
		}
		aNavigationProperties = oEntityDef.navigationProperty;
		if (aNavigationProperties && aNavigationProperties.length) {
			iLen = aNavigationProperties.length;
			for (i = 0; i < iLen; i++) {
				oNavigationProperty = aNavigationProperties[i];
				// if the navigation property is explicitly marked as not filterable; skip it
				// also skip it, if it is marked as HiddenFilter
				if (!this._isFilterable(oNavigationProperty, oEntitySet) || this._isHiddenFilter(oNavigationProperty)) {
					continue;
				}
				// Get the End role of the navigation property
				oEndRole = this._oMetaModel.getODataAssociationEnd(oEntityDef, oNavigationProperty.name);
				if (!oEndRole || oEndRole.type === (oEntityDef.namespace + "." + oEntityDef.name)) {
					continue;
				}
				// check if the end role has cardinality 0..1 or 1
				if (oEndRole.multiplicity === "1" || oEndRole.multiplicity === "0..1") {
					// Only add filterable entities, if they were not already added
					if (mFilterableAssociations[oNavigationProperty.name] === undefined) {
						mFilterableAssociations[oNavigationProperty.name] = oEndRole.type;
					}
				}
			}
		}
		return mFilterableAssociations;
	};

	/**
	 * Retrieves the ValueList Annotation lazily for the specified property/target
	 * 
	 * @param {String} sPath the full path of the property/target (including the namespace)
	 * @returns {Promise} a Promise that would be resolved once the ValueList annotation is loaded -or- rejected if specified property path is
	 *          incorrect or value list could not be resolved
	 * @public
	 */
	MetadataAnalyser.prototype.getValueListAnnotationLazy = function(sPath) {
		var oPromise, mAnnotation = {
			additionalAnnotations: []
		}, oResolvedAnnotation, sParentFieldName, aPath, oType, sProperty, oPropertyContext, sQualifier;
		oPromise = new Promise(function(fResolve, fReject) {
			if (sPath && this._oMetaModel) {
				// Split the property path and
				aPath = sPath.split("/");
				// The type could either be an entity type or a complex type
				oType = this._oMetaModel.getODataEntityType(aPath[0]) || this._oMetaModel.getODataComplexType(aPath[0]);
				sParentFieldName = aPath[1];
				// Get the property path from the type
				sProperty = this._oMetaModel.getODataProperty(oType, sParentFieldName, true);
				if (sProperty) {
					// create property context from its path
					oPropertyContext = this._oMetaModel.createBindingContext(sProperty);

					this._oMetaModel.getODataValueLists(oPropertyContext).then(function(mValueList) {
						for (sQualifier in mValueList) {
							oResolvedAnnotation = {
								annotation: mValueList[sQualifier]
							};
							// TODO: to be removed in the next release! - Ignore ValueList with PresentationVariantQualifier
							if (oResolvedAnnotation.annotation && !oResolvedAnnotation.annotation["PresentationVariantQualifier"]) {
								this._enrichValueHelpAnnotation(oResolvedAnnotation, sParentFieldName);
								// Check if there is no qualifier --> the default/primaryValueListAnnotation
								if (!sQualifier) {
									mAnnotation.primaryValueListAnnotation = oResolvedAnnotation;
								} else {
									// Set the qualifier on the resolved annotation
									oResolvedAnnotation.qualifier = sQualifier;
									mAnnotation.additionalAnnotations.push(oResolvedAnnotation);
								}
							}
						}
						fResolve(mAnnotation);
					}.bind(this), fReject);
					return;
				}
			}
			fReject();
		}.bind(this));
		return oPromise;
	};

	/**
	 * Formats a ValueList Annotation object in the format which is used by BaseValueListProvider
	 * 
	 * @param {Map} mValueListData A data object which contains the value help info in a format used by the ODataModel
	 * @param {String} sParentFieldName The name of the field for which the Value Help is made
	 * @returns {Map} the formatted annotation
	 * @public
	 * @experimental
	 * @since 1.38
	 */
	MetadataAnalyser.prototype.getValueListAnnotationForFunctionImport = function(mValueListData, sParentFieldName) {
		var mAnnotation = {
			additionalAnnotations: []
		}, oResolvedAnnotation, sQualifier;
		for (sQualifier in mValueListData) {
			oResolvedAnnotation = {
				annotation: mValueListData[sQualifier]
			};
			if (oResolvedAnnotation.annotation) {
				this._enrichValueHelpAnnotation(oResolvedAnnotation, sParentFieldName);
				// Check if there is no qualifier --> the default/primaryValueListAnnotation
				if (!sQualifier) {
					mAnnotation.primaryValueListAnnotation = oResolvedAnnotation;
				} else {
					// Set the qualifier on the resolved annotation
					oResolvedAnnotation.qualifier = sQualifier;
					mAnnotation.additionalAnnotations.push(oResolvedAnnotation);
				}
			}
		}
		return mAnnotation;
	};

	/**
	 * Retrieves the ValueList Annotation for the specified property/target
	 * 
	 * @param {String} sPath the full path of the property/target (including the namespace)
	 * @returns {Object} a Map of resolved ValueHelpList (if any) annotations
	 * @deprecated Since 1.29 - use #getValueListAnnotationLazy instead!
	 * @public
	 */
	MetadataAnalyser.prototype.getValueListAnnotation = function(sPath) {
		var mAnnotation = {
			additionalAnnotations: []
		}, oResolvedAnnotation, sParentFieldName, aPath, oType, oProperty, sQualifier;
		if (sPath && this._oMetaModel) {
			// Split the property path and
			aPath = sPath.split("/");
			// The type could either be an entity type or a complex type
			oType = this._oMetaModel.getODataEntityType(aPath[0]) || this._oMetaModel.getODataComplexType(aPath[0]);
			// Get the property from the type
			oProperty = this._oMetaModel.getODataProperty(oType, aPath[1]);
			if (oProperty) {
				sParentFieldName = oProperty.name;
				for ( var sProp in oProperty) {
					if (sProp === "com.sap.vocabularies.Common.v1.ValueList" || sProp.indexOf("com.sap.vocabularies.Common.v1.ValueList#") > -1) {
						sQualifier = null;
						oResolvedAnnotation = {
							annotation: oProperty[sProp]
						};
						aPath = sProp.split("#");
						if (aPath.length === 2) {
							sQualifier = aPath[1];
						}
						if (oResolvedAnnotation.annotation) {
							this._enrichValueHelpAnnotation(oResolvedAnnotation, sParentFieldName);
							// Check if there is no qualifier --> the default/primaryValueListAnnotation
							if (!sQualifier) {
								mAnnotation.primaryValueListAnnotation = oResolvedAnnotation;
							} else {
								// Set the qualifier on the resolved annotation
								oResolvedAnnotation.qualifier = sQualifier;
								mAnnotation.additionalAnnotations.push(oResolvedAnnotation);
							}
						}
					}
				}
			}
		}
		return mAnnotation;
	};

	/**
	 * Enriches the provided Value Help annotation with key and other relevant information
	 * 
	 * @param {object} oAnnotation Annotation object
	 * @param {string} sParentFieldName - the parent field name
	 * @private
	 */
	MetadataAnalyser.prototype._enrichValueHelpAnnotation = function(oAnnotation, sParentFieldName) {
		var mResult, oResult, oEntitySet, aKeys = [], sKey, mInParams = {}, mOutParams = {}, bIsInParam, bIsOutParam, aFields = [], aValueListFields = [], aRecords, oProperty, sValueListProperty, sLocalDataProperty, oParam, iLen = 0, i = 0, iFieldLen = 0;
		if (oAnnotation && oAnnotation.annotation) {
			mResult = oAnnotation.annotation;
			if (mResult) {
				oResult = mResult["SearchSupported"];
				oAnnotation.isSearchSupported = oResult ? oResult.Bool === "true" : false;
				oResult = mResult["CollectionPath"];
				// Set the CollectionPath on the annotation
				if (oResult) {
					oAnnotation.valueListEntitySetName = oResult.String;
					if (this._oMetaModel) {
						oEntitySet = this._oMetaModel.getODataEntitySet(oAnnotation.valueListEntitySetName);
					}
					if (oEntitySet) {
						oAnnotation.valueListEntityName = oEntitySet.entityType;
						oAnnotation.semantics = oEntitySet["sap:semantics"];
						aKeys = this.getKeysByEntitySetName(oEntitySet.name);
						aFields = this.getFieldsByEntitySetName(oEntitySet.name);
					}
				}

				oResult = mResult["Label"];
				// Set the valueListTitle on the annotation
				if (oResult) {
					oAnnotation.valueListTitle = oResult.String;
				}

				// Get all the params to create mappings, fields, key etc
				aRecords = mResult["Parameters"];
				if (aFields && aRecords) {
					iLen = aRecords.length;
				}
				// Loop through all the parameters/records
				for (i = 0; i < iLen; i++) {
					oParam = aRecords[i];
					sValueListProperty = undefined;
					sLocalDataProperty = undefined;
					// Each Parameter on the VL annotation has max 2 properties:
					// LocalDataProperty - Path to the property on the local entity that triggered the ValueList
					// ValueListProperty - Path to property in on the ValueList entity
					oProperty = oParam["ValueListProperty"];
					if (oProperty) {
						sValueListProperty = oProperty.String;
					}
					oProperty = oParam["LocalDataProperty"];
					if (oProperty) {
						sLocalDataProperty = oProperty.PropertyPath;
					}

					bIsInParam = false;
					if (oParam.RecordType === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" || oParam.RecordType === "com.sap.vocabularies.Common.v1.ValueListParameterIn") {
						bIsInParam = true;
					}
					bIsOutParam = false;
					if (oParam.RecordType === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" || oParam.RecordType === "com.sap.vocabularies.Common.v1.ValueListParameterOut") {
						bIsOutParam = true;
					}

					// Mapping for In/InOut params
					if (bIsInParam) {
						mInParams[sLocalDataProperty] = sValueListProperty;
					}

					// Mapping for Out/InOut params
					if (bIsOutParam) {
						mOutParams[sLocalDataProperty] = sValueListProperty;
					}

					// For sFin/gateway; this apparently should form the columns/fields in the list!
					if (bIsOutParam || oParam.RecordType === "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly") {
						iFieldLen = aFields.length;
						while (iFieldLen--) {
							if (aFields[iFieldLen].name === sValueListProperty) {
								aValueListFields.push(aFields[iFieldLen]);
								break;
							}
						}
					}
					// The 1st InOut/Out param having the parent field as LocalDataProperty; should be the Key!
					if (!sKey && bIsOutParam && sLocalDataProperty === sParentFieldName) {
						sKey = sValueListProperty;
					}
				}
			}
			// Set the mappings, fields, keys, return key and corresponding description on the annotation
			oAnnotation.inParams = mInParams;
			oAnnotation.outParams = mOutParams;
			oAnnotation.fields = aFields;
			oAnnotation.valueListFields = aValueListFields;
			oAnnotation.keys = aKeys;
			oAnnotation.keyField = sKey;
			oAnnotation.descriptionField = this.getDescriptionFieldName(oAnnotation.keyField, oAnnotation.valueListEntitySetName);
		}
	};

	/**
	 * Gets the human readable text/description field's name from the specified Key field's name and entity name
	 * 
	 * @param {string|object} sKeyField - the name of the key field / oField - the field as present in the OData metadata
	 * @param {string} sEntityName - the name of the entity (required if the name of the field is passed as the 1st param)
	 * @returns {string} the description field name, if any
	 * @public
	 */
	MetadataAnalyser.prototype.getDescriptionFieldName = function(sKeyField, sEntityName) {
		var aFields, i = 0, iLength, oField, sDescriptionField;
		if (typeof sKeyField === "object") {
			oField = sKeyField;
		} else {
			aFields = this.getFieldsByEntitySetName(sEntityName);
			if (aFields) {
				iLength = aFields.length;
				for (i = 0; i < iLength; i++) {
					oField = aFields[i];
					if (oField.name === sKeyField) {
						// Found the specified field, exit loop
						break;
					}
					oField = null;
				}
			}
		}
		if (oField && oField["com.sap.vocabularies.Common.v1.Text"]) {
			sDescriptionField = oField["com.sap.vocabularies.Common.v1.Text"].Path;
		}
		return sDescriptionField;
	};

	/**
	 * Returns whether Search query is supported for this value help annotation
	 * 
	 * @param {object} oAnnotation - ValueHelpAnnotation
	 * @returns {boolean} whether search query is supported
	 * @public
	 */
	MetadataAnalyser.prototype.getIsSearchSupported = function(oAnnotation) {
		var bIsSearchSupported = false, oProperty;

		if (oAnnotation) {
			oProperty = oAnnotation.SearchSupported;
			if (oProperty && oProperty.Bool === "true") {
				bIsSearchSupported = true;
			}
		}

		return bIsSearchSupported;
	};

	/**
	 * Gets the valuelist entity sets semantics from the specified ValueList annotation
	 * 
	 * @param {Object} oAnnotation - the value list annotation
	 * @returns {string} - the semantics of the value list entity set (if any)
	 * @protected
	 */
	MetadataAnalyser.prototype.getValueListSemantics = function(oAnnotation) {
		var sEntitySet, oEntitySet, sSemantics;
		if (oAnnotation) {
			sEntitySet = oAnnotation["CollectionPath"] ? oAnnotation["CollectionPath"].String : undefined;
		}
		if (sEntitySet) {
			oEntitySet = this._oMetaModel.getODataEntitySet(sEntitySet);
			if (oEntitySet) {
				sSemantics = oEntitySet["sap:semantics"];
			}
		}
		return sSemantics;
	};

	/**
	 * Retrieves the LineItem Annotation for the specified target entity type
	 * 
	 * @param {String} sPath the full path of the entity type (including the namespace)
	 * @param {String} sQualifier the qualifier for retrieving the UI.LineItem annotation (optional)
	 * @returns {Object} the resolved LineItem annotation object (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getLineItemAnnotation = function(sPath, sQualifier) {
		var oEntityType, sTerm, aAnnotationData, oResolvedAnnotation;
		if (sPath && this._oMetaModel) {
			oEntityType = this._oMetaModel.getODataEntityType(sPath);
			if (oEntityType) {
				sTerm = "com.sap.vocabularies.UI.v1.LineItem";
				if (sQualifier) {
					sTerm += "#" + sQualifier;
				}
				aAnnotationData = oEntityType[sTerm];
				// Resolve the annotation data into easily accessible properties
				if (aAnnotationData) {
					oResolvedAnnotation = {
						annotation: aAnnotationData
					};
					this._enrichAnnotationWithUIDataField(oResolvedAnnotation, aAnnotationData);
				}
			}
		}
		return oResolvedAnnotation;
	};

	/**
	 * Determines if the semantics annotation <code>sap:semantics</code> is set to 'aggregate'
	 * 
	 * @param {String} sPath the full path of the entity type (including the namespace)
	 * @returns {boolean} the semantics=aggregate state
	 * @public
	 */
	MetadataAnalyser.prototype.isSemanticAggregation = function(sPath) {
		var oEntityType;
		if (sPath && this._oMetaModel) {
			oEntityType = this._oMetaModel.getODataEntityType(sPath);
			if (oEntityType) {
				return oEntityType["sap:semantics"] === "aggregate";
			}
		}

		return false;
	};

	/**
	 * Retrieves the PresentationVariant Annotation for the specified target entity type
	 * 
	 * @param {String} sPath the full path of the entity type (including the namespace)
	 * @param {String} sQualifier the qualifier for retrieving the UI.PresentationVariant annotation (optional)
	 * @returns {Object} the resolved PresentationVariant annotation object (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getPresentationVariantAnnotation = function(sPath, sQualifier) {
		var oEntityType, sTerm, aAnnotationData, iLen, i, oResolvedAnnotation, oLineItemAnnotation, oChartAnnotation, sItemPath;
		if (sPath && this._oMetaModel) {
			oEntityType = this._oMetaModel.getODataEntityType(sPath);
			if (oEntityType) {
				sTerm = "com.sap.vocabularies.UI.v1.PresentationVariant";
				if (sQualifier) {
					sTerm += "#" + sQualifier;
				}
				aAnnotationData = oEntityType[sTerm];
				if (aAnnotationData) {
					oResolvedAnnotation = {
						annotation: aAnnotationData,
						requestAtLeastFields: [],
						sortOrderFields: [],
						groupByFields: [],
						maxItems: undefined
					};
					if (aAnnotationData.Visualizations) {
						iLen = aAnnotationData.Visualizations.length;
						for (i = 0; i < iLen; i++) {
							sItemPath = aAnnotationData.Visualizations[i].AnnotationPath;
							if (!oLineItemAnnotation && (sItemPath === "@com.sap.vocabularies.UI.v1.LineItem" || sItemPath.indexOf("@com.sap.vocabularies.UI.v1.LineItem#") > -1)) {
								// get the lineitem annotation from entityType, ignoring the @
								oLineItemAnnotation = oEntityType[sItemPath.substring(1)];
								// process and set the line item annotation on the resolved result
								oResolvedAnnotation.lineItemAnnotation = {
									annotation: oLineItemAnnotation
								};
								this._enrichAnnotationWithUIDataField(oResolvedAnnotation.lineItemAnnotation, oLineItemAnnotation);
							} else if (!oChartAnnotation && (sItemPath === "@com.sap.vocabularies.UI.v1.Chart" || sItemPath.indexOf("@com.sap.vocabularies.UI.v1.Chart#") > -1)) {
								// get the chart annotation from entityType, ignoring the @
								oChartAnnotation = oEntityType[sItemPath.substring(1)];
								// process and set the line item annotation on the resolved result
								oResolvedAnnotation.chartAnnotation = {
									annotation: oChartAnnotation,
									semantics: oEntityType["sap:semantics"]
								};
								this._enrichChartAnnotation(oResolvedAnnotation.chartAnnotation, oChartAnnotation);
							}

							// break only if both LineItem and Chart annotations have been found!
							if (oLineItemAnnotation && oChartAnnotation) {
								break;
							}
						}
					}
					if (aAnnotationData.RequestAtLeast) {
						iLen = aAnnotationData.RequestAtLeast.length;
						for (i = 0; i < iLen; i++) {
							oResolvedAnnotation.requestAtLeastFields.push(aAnnotationData.RequestAtLeast[i].PropertyPath);
						}
					}
					if (aAnnotationData.SortOrder) {
						iLen = aAnnotationData.SortOrder.length;
						for (i = 0; i < iLen; i++) {
							oResolvedAnnotation.sortOrderFields.push({
								name: aAnnotationData.SortOrder[i].Property.PropertyPath,
								descending: aAnnotationData.SortOrder[i].Descending ? aAnnotationData.SortOrder[i].Descending.Bool === "true" : false
							});
						}
					}

					if (aAnnotationData.GroupBy) {
						iLen = aAnnotationData.GroupBy.length;
						for (i = 0; i < iLen; i++) {
							oResolvedAnnotation.groupByFields.push(aAnnotationData.GroupBy[i].PropertyPath);
						}
					}

					if (aAnnotationData.MaxItems) {
						oResolvedAnnotation.maxItems = aAnnotationData.MaxItems.Int;
					}
				}
			}
		}
		return oResolvedAnnotation;
	};

	/**
	 * Enriches the provided FieldGroup/LineItem annotation with UI.DataField attributes
	 * 
	 * @param {object} oAnnotation - the annotation that would be enriched
	 * @param {object} oAnnotationData - array of params having UI.DataField
	 * @private
	 */
	MetadataAnalyser.prototype._enrichChartAnnotation = function(oAnnotation, oAnnotationData) {
		var i, iLen, oObj;

		if (oAnnotation && oAnnotationData) {
			oAnnotation.measureFields = [];
			oAnnotation.dimensionFields = [];
			oAnnotation.measureAttributes = {};
			oAnnotation.dimensionAttributes = {};

			if (oAnnotationData.ChartType && oAnnotationData.ChartType.EnumMember) {
				oAnnotation.chartType = oAnnotationData.ChartType.EnumMember;
			}

			if (oAnnotationData.Measures) {
				iLen = oAnnotationData.Measures.length;
				for (i = 0; i < iLen; i++) {
					oAnnotation.measureFields.push(oAnnotationData.Measures[i].PropertyPath);
				}
			}

			if (oAnnotationData.MeasureAttributes) {
				iLen = oAnnotationData.MeasureAttributes.length;
				for (i = 0; i < iLen; i++) {
					oObj = oAnnotationData.MeasureAttributes[i];
					if (oObj.Measure) {
						// enrich measure attributes
						oAnnotation.measureAttributes[oObj.Measure.PropertyPath] = {
							role: oObj.Role ? oObj.Role.EnumMember : null,
							dataPoint: oObj.DataPoint ? oObj.DataPoint.AnnotationPath : null
						};
					}
				}
			}

			if (oAnnotationData.Dimensions) {
				iLen = oAnnotationData.Dimensions.length;
				for (i = 0; i < iLen; i++) {
					oAnnotation.dimensionFields.push(oAnnotationData.Dimensions[i].PropertyPath);
				}
			}

			if (oAnnotationData.DimensionAttributes) {
				iLen = oAnnotationData.DimensionAttributes.length;
				for (i = 0; i < iLen; i++) {
					oObj = oAnnotationData.DimensionAttributes[i];
					if (oObj.Dimension) {
						// enrich dimension attributes
						oAnnotation.dimensionAttributes[oObj.Dimension.PropertyPath] = {
							role: oObj.Role ? oObj.Role.EnumMember : null
						};
					}
				}
			}
		}

	};

	/**
	 * Retrieves the Chart Annotation for the specified target entity type
	 * 
	 * @param {String} sPath the full path of the entity type (including the namespace)
	 * @param {String} sQualifier the qualifier for retrieving the Chart annotation (optional)
	 * @returns {Object} the resolved Chart annotation object (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getChartAnnotation = function(sPath, sQualifier) {
		var oEntityType, aAnnotationData, oResolvedAnnotation, sTerm;
		if (sPath && this._oMetaModel) {
			oEntityType = this._oMetaModel.getODataEntityType(sPath);
			if (oEntityType) {
				sTerm = "com.sap.vocabularies.UI.v1.Chart";
				if (sQualifier) {
					sTerm += "#" + sQualifier;
				}
				aAnnotationData = oEntityType[sTerm];
				// Resolve the annotation data into easily accessible properties
				if (aAnnotationData) {
					oResolvedAnnotation = {
						annotation: aAnnotationData,
						semantics: oEntityType["sap:semantics"]
					};
					this._enrichChartAnnotation(oResolvedAnnotation, aAnnotationData);
				}
			}
		}
		return oResolvedAnnotation;
	};

	/**
	 * Retrieves the DataPoint Annotation for the specified target entity type
	 * 
	 * @param {String} sPath the full path of the entity type (including the namespace)
	 * @returns {Object} oResolvedAnnotation - object of the resolved DataPoint annotations (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getDataPointAnnotation = function(sPath) {
		var oEntityType, sProp, sQualifier, aPath, oDataPointAnnotationData, oResolvedAnnotation = {};
		if (sPath && this._oMetaModel) {
			oEntityType = this._oMetaModel.getODataEntityType(sPath);
			if (oEntityType) {
				for (sProp in oEntityType) {
					if (sProp === "com.sap.vocabularies.UI.v1.DataPoint" || sProp.indexOf("com.sap.vocabularies.UI.v1.DataPoint#") > -1) {
						sQualifier = null;
						oDataPointAnnotationData = oEntityType[sProp];
						aPath = sProp.split("#");
						if (aPath.length === 2) {
							sQualifier = aPath[1];
						}
						if (oDataPointAnnotationData) {
							// Set the qualifier of the annotation
							if (sQualifier) {
								if (!oResolvedAnnotation.additionalAnnotations) {
									oResolvedAnnotation.additionalAnnotations = {};
								}
								oResolvedAnnotation.additionalAnnotations[sQualifier] = oDataPointAnnotationData;
							} else {
								oResolvedAnnotation.primaryAnnotation = oDataPointAnnotationData;
							}
						}
					}
				}
			}
		}
		return oResolvedAnnotation;
	};

	/**
	 * Retrieves an array of FieldGroup Annotation for the specified target entity type
	 * 
	 * @param {String} sPath the entity type name -or- the full path of the entity type (including the namespace)
	 * @returns {Object} the resolved array of FieldGroup annotations (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getFieldGroupAnnotation = function(sPath) {
		var oEntityType, sQualifier, aPath, oResult, oAnnotation, oResolvedAnnotation, aResolvedAnnotation = [];
		if (sPath && this._oMetaModel) {
			// Field groups annotations are used also by SmartFilter, which can be used without a fully qualified path --> add support for that
			oEntityType = this._oMetaModel.getODataEntityType(this._getFullyQualifiedNameForEntity(sPath));
			if (oEntityType) {
				for ( var sProp in oEntityType) {
					if (sProp === "com.sap.vocabularies.UI.v1.FieldGroup" || sProp.indexOf("com.sap.vocabularies.UI.v1.FieldGroup#") > -1) {
						sQualifier = null;
						oAnnotation = oEntityType[sProp];
						aPath = sProp.split("#");
						if (aPath.length === 2) {
							sQualifier = aPath[1];
						}
						if (oAnnotation) {
							oResolvedAnnotation = {
								annotation: oAnnotation
							};
							// Set the groupName of the annotation
							if (sQualifier) {
								oResolvedAnnotation.groupName = sQualifier;
							}
							// Get the label for the group
							oResult = oAnnotation["Label"];
							if (oResult) {
								// Assign the groupLabel to the annotation if it exists
								oResolvedAnnotation.groupLabel = oResult.String;
							}

							// Get the collection of UI fields
							oResult = oAnnotation["Data"];
							if (oResult) {
								this._enrichAnnotationWithUIDataField(oResolvedAnnotation, oResult);
							}
							aResolvedAnnotation.push(oResolvedAnnotation);
						}
					}
				}
			}
		}
		return aResolvedAnnotation;
	};

	/**
	 * Retrieves an array of FieldGroup annotation as specified by the FilterFacets annotation for a target entity type. If no FilterFacet annotation
	 * is provided, all the FieldGroups are returned (same behaviour as getFieldGroupAnnotation method).
	 * 
	 * @param {String} sPath the entity type name -or- the full path of the entity type (including the namespace)
	 * @returns {Object} the resolved array of FieldGroup annotations (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getFieldGroupsByFilterFacetsAnnotation = function(sPath) {
		var oEntityType, aPath, sQualifier, aRecords, aResolvedAnnotation, aFieldGroupsAnnotation = this.getFieldGroupAnnotation(sPath);

		aResolvedAnnotation = aFieldGroupsAnnotation;

		if (sPath && this._oMetaModel) {
			// Field groups annotations are used also by SmartFilter, which can be used without a fully qualified path --> add support for that
			oEntityType = this._oMetaModel.getODataEntityType(this._getFullyQualifiedNameForEntity(sPath));
			if (oEntityType) {
				for ( var sProp in oEntityType) {
					if (sProp === "com.sap.vocabularies.UI.v1.FilterFacets" || sProp.indexOf("com.sap.vocabularies.UI.v1.FilterFacets#") > -1) {

						aResolvedAnnotation = [];

						aRecords = oEntityType[sProp];
						if (aRecords) {
							for (var i = 0; i < aRecords.length; i++) {
								aPath = aRecords[i].Target.AnnotationPath.split("#");
								if (aPath.length === 2) {
									sQualifier = aPath[1];
								}

								if (sQualifier) {
									/* eslint-disable no-loop-func */
									aFieldGroupsAnnotation.some(function(oFieldGroupAnnotation) {
										if (oFieldGroupAnnotation.groupName === sQualifier) {
											if (aRecords[i].Label) {
												oFieldGroupAnnotation.groupLabel = aRecords[i].Label.String;
											}
											aResolvedAnnotation.push(oFieldGroupAnnotation);
											return true;
										}
										return false;

									});
									/* eslint-enable no-loop-func */
								}
							}
						}
					}
				}
			}
		}

		return aResolvedAnnotation;
	};

	/**
	 * Enriches the provided FieldGroup/LineItem annotation with UI.DataField attributes
	 * 
	 * @param {object} oAnnotation - the annotation that would be enriched
	 * @param {Array} aRecords - array of params having UI.DataField
	 * @private
	 */
	MetadataAnalyser.prototype._enrichAnnotationWithUIDataField = function(oAnnotation, aRecords) {
		var aFields = [], mURLInfo = {}, mLabels = {}, mImportance = {}, mCriticality = {}, oProperty, sField, oParam, iLen = 0, i = 0;
		if (oAnnotation && aRecords) {
			iLen = aRecords.length;
			aFields = [];
			mLabels = {};
			for (i = 0; i < iLen; i++) {
				oParam = aRecords[i];
				// Check if term is correct
				if (oParam && (oParam.RecordType === "com.sap.vocabularies.UI.v1.DataField" || oParam.RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl")) {
					sField = null;
					oProperty = oParam["Value"];
					if (oProperty) {
						sField = oProperty.Path;
					}
					if (sField) {
						// Add field to the fields array
						aFields.push(sField);
						// Extract Url param only if a value path exists
						oProperty = oParam["Url"];
						if (oProperty) {
							mURLInfo[sField] = this._extractURLInfo(oProperty);
						}
						// Check if a Label is defined with the annotation
						oProperty = oParam["Label"];
						if (oProperty && oProperty.String) {
							mLabels[sField] = oProperty.String;
						}
						// Calculate and set Importance metadata
						mImportance[sField] = this._getImportanceAnnotation(oParam);
						// Check if Criticality Path is defined for the DataField
						oProperty = oParam["Criticality"];
						if (oProperty) {
							mCriticality[sField] = this._extractCriticalityInfo(oProperty, oParam);
						}
					}
				}
			}

			// Assign the resolved fields and labels to the annotation
			oAnnotation.fields = aFields;
			oAnnotation.urlInfo = mURLInfo;
			oAnnotation.labels = mLabels;
			oAnnotation.importance = mImportance;
			oAnnotation.criticality = mCriticality;
		}
	};

	/**
	 * Extracts the Criticality meta object and fields
	 * 
	 * @param {Object} oCriticality - the Criticality parameter
	 * @param {Object} oRecord - the record containing the Criticality parameter
	 * @returns {Object} oCriticality - the parsed Criticality metadata
	 * @private
	 */
	MetadataAnalyser.prototype._extractCriticalityInfo = function(oCriticality, oRecord) {
		var oResult, oCriticalityRepresentation;
		// extract info only if a Path or EnumMember exist
		if (oCriticality.Path || oCriticality.EnumMember) {
			oResult = {};
			oResult["path"] = oCriticality.Path;
			oResult["criticalityType"] = oCriticality.EnumMember;
			oCriticalityRepresentation = oRecord["CriticalityRepresentation"];
			if (oCriticalityRepresentation && oCriticalityRepresentation.EnumMember) {
				oResult["criticalityRepresentationType"] = oCriticalityRepresentation.EnumMember;
			}
		}
		return oResult;
	};

	/**
	 * Extracts the Apply "odata.fillUriTemplate" meta object and fields
	 * 
	 * @param {Object} oParameter - the Apply "odata.fillUriTemplate" meta object
	 * @returns {Object} oUrlInfo - the parsed "odata.fillUriTemplate" metadata
	 * @private
	 */
	MetadataAnalyser.prototype._extractURLInfo = function(oParameter) {
		var oResult, aParameters, iLength, oParam;
		if (oParameter) {
			if (oParameter.Apply && oParameter.Apply.Name === "odata.fillUriTemplate") {
				oResult = {
					urlTarget: undefined,
					parameters: []
				};
				// Create a dummy annotation helper context at the instance level
				if (!this._oDummyAnnotationHelperContext) {
					this._oDummyAnnotationHelperContext = this._oMetaModel.createBindingContext("/");
					// require the AnnotationHelper instance once
					jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
				}
				if (this._oDummyAnnotationHelperContext) {
					// extract target URL from fillUriTemplate
					oResult.urlTarget = sap.ui.model.odata.AnnotationHelper.format(this._oDummyAnnotationHelperContext, oParameter);
				}
				// extract LabeledElement --> Path from Parameters (these should be added to $select)
				aParameters = oParameter.Apply.Parameters;
				iLength = aParameters && aParameters.length ? aParameters.length : 0;
				while (iLength--) {
					oParam = aParameters[iLength];
					if (oParam && oParam.Type === "LabeledElement" && oParam.Value && oParam.Value.Path) {
						oResult.parameters.push(oParam.Value.Path);
					}
				}
			} else if (oParameter.Path) {
				oResult = {
					urlPath: oParameter.Path
				};
			}
		}
		return oResult;
	};

	/**
	 * Retrieves the SelectionVariant annotation for a specified entity
	 * 
	 * @param {String} sPath the entity type name -or- the full path of the entity type (including the namespace)
	 * @returns {array} the resolved array of SelectionVariant annotations (if any).
	 * @public
	 */
	MetadataAnalyser.prototype.getSelectionVariantAnnotation = function(sPath) {
		var oEntityType, oAnnotation, sQualifier, aResolvedAnnotation = [], aPath;
		if (sPath && this._oMetaModel) {
			// SelectionFields annotations is used also by SmartFilter, which can be used without a fully qualified path --> add support for that
			oEntityType = this._oMetaModel.getODataEntityType(this._getFullyQualifiedNameForEntity(sPath));
			if (oEntityType) {
				for ( var sProp in oEntityType) {
					if (sProp === "com.sap.vocabularies.UI.v1.SelectionVariant" || sProp.indexOf("com.sap.vocabularies.UI.v1.SelectionVariant#") > -1) {
						sQualifier = "";
						oAnnotation = oEntityType[sProp];
						aPath = sProp.split("#");
						if (aPath.length === 2) {
							sQualifier = aPath[1];
						}
						if (oAnnotation) {
							aResolvedAnnotation.push({
								qualifier: sQualifier,
								annotation: oAnnotation
							});
						}
					}
				}
			}
		}
		return aResolvedAnnotation;
	};

	/**
	 * Retrieves the SelectionFields annotation for a specified entity
	 * 
	 * @param {String} sPath the entity type name -or- the full path of the entity type (including the namespace)
	 * @returns {Object} the resolved array of FieldGroup annotations (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getSelectionFieldsAnnotation = function(sPath) {
		var oEntityType, aAnnotationData, iLen, i, oResolvedAnnotation;
		if (sPath && this._oMetaModel) {
			// SelectionFields annotations is used also by SmartFilter, which can be used without a fully qualified path --> add support for that
			oEntityType = this._oMetaModel.getODataEntityType(this._getFullyQualifiedNameForEntity(sPath));
			if (oEntityType) {
				aAnnotationData = oEntityType["com.sap.vocabularies.UI.v1.SelectionFields"];
				if (aAnnotationData) {
					oResolvedAnnotation = {
						annotation: aAnnotationData,
						selectionFields: []
					};
					iLen = aAnnotationData.length;
					for (i = 0; i < iLen; i++) {
						oResolvedAnnotation.selectionFields.push(aAnnotationData[i].PropertyPath);
					}
				}
			}
		}
		return oResolvedAnnotation;
	};

	/**
	 * Retrieves the SemanticKey Annotation for the specified entity
	 * 
	 * @param {String} sPath the full path of the entity/target (including the namespace)
	 * @returns {Object} the resolved SemanticKey annotation object (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getSemanticKeyAnnotation = function(sPath) {
		var oEntityType, aAnnotationData, iLen, i, oResolvedAnnotation;
		if (sPath && this._oMetaModel) {
			oEntityType = this._oMetaModel.getODataEntityType(sPath);
			if (oEntityType) {
				aAnnotationData = oEntityType["com.sap.vocabularies.Common.v1.SemanticKey"];
				if (aAnnotationData) {
					oResolvedAnnotation = {
						annotation: aAnnotationData,
						semanticKeyFields: []
					};
					iLen = aAnnotationData.length;
					for (i = 0; i < iLen; i++) {
						oResolvedAnnotation.semanticKeyFields.push(aAnnotationData[i].PropertyPath);
					}
				}
			}
		}
		return oResolvedAnnotation;
	};

	/**
	 * Returns the importance annotation if available
	 * 
	 * @param {Object} oParam - the parameter containing the importance annotation
	 * @returns {string} the found importance value or null
	 * @private
	 */
	MetadataAnalyser.prototype._getImportanceAnnotation = function(oParam) {
		var sImportance = null, oResult;

		oResult = oParam["com.sap.vocabularies.UI.v1.Importance"];
		if (oResult) {
			sImportance = oResult.EnumMember;
		}

		switch (sImportance) {
			case "com.sap.vocabularies.UI.v1.ImportanceType/Medium":
				return "Medium";
			case "com.sap.vocabularies.UI.v1.ImportanceType/Low":
				return "Low";
			default:
				return "High";
		}

		// return "High"; // if nothing is specified / or a unknown type is used, default to High
	};

	/**
	 * Resolves and returns the displayBehaviour from TextArrangement Annotation for the specified property/target
	 * 
	 * @param {String} sPath the full path of the property/target (including the namespace) or the property itself
	 * @returns {string} the resolved displayBehaviour from TextArrangement enumeration (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getTextArrangementValue = function(sPath) {
		var aPath, oType, oObject, oAnnotation, sDisplayBehaviour;

		if (sPath && this._oMetaModel) {
			if (typeof (sPath) === "string") {
				sPath = this._getFullyQualifiedNameForEntity(sPath);
				// Split the property path and
				aPath = sPath.split("/");
				if (aPath.length > 1) {
					// The type could either be an entity type or a complex type
					oType = this._oMetaModel.getODataEntityType(aPath[0]) || this._oMetaModel.getODataComplexType(aPath[0]);
					// Get the property from the type
					oObject = this._oMetaModel.getODataProperty(oType, aPath[1]);
				} else {
					oObject = this._oMetaModel.getODataEntityType(sPath) || this._oMetaModel.getODataComplexType(sPath);
				}
			} else {
				oObject = sPath;
			}
			if (oObject) {
				oAnnotation = oObject["com.sap.vocabularies.UI.v1.TextArrangement"];
			}
			if (oAnnotation) {
				switch (oAnnotation.EnumMember) {
					case "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst":
						sDisplayBehaviour = "descriptionAndId";
						break;
					case "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast":
						sDisplayBehaviour = "idAndDescription";
						break;
					case "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate":
						sDisplayBehaviour = "idOnly";
						break;
					case "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly":
						sDisplayBehaviour = "descriptionOnly";
						break;
					default:
						sDisplayBehaviour = undefined;
						break;
				}
			}
		}
		return sDisplayBehaviour;
	};

	/**
	 * Retrieves the SemanticObject Annotation for the specified property/target
	 * 
	 * @param {String} sPath the full path of the property/target (including the namespace)
	 * @returns {Object} the resolved semanticObject annotation object (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getSemanticObjectAnnotation = function(sPath) {
		var aPath, oType, oProperty, oAnnotation;

		if (sPath && this._oMetaModel) {
			// Split the property path and
			aPath = sPath.split("/");
			// The type could either be an entity type or a complex type
			oType = this._oMetaModel.getODataEntityType(aPath[0]) || this._oMetaModel.getODataComplexType(aPath[0]);
			// Get the property from the type
			oProperty = this._oMetaModel.getODataProperty(oType, aPath[1]);
			if (oProperty) {
				oAnnotation = oProperty["com.sap.vocabularies.Common.v1.SemanticObject"];
			}
			return this._prepareSemanticObjectAnnotationFromProperty(oAnnotation);
		}
		return null;
	};

	/**
	 * Retrieves the default SemanticObject and additionals SemanticObjects from Annotation for the specified property/target.
	 * 
	 * @param {String} sPath the full path of the property/target (including the namespace)
	 * @returns {object | undefined} the resolved semanticObject annotation object (if any)
	 * @private
	 */
	MetadataAnalyser.prototype.getSemanticObjectsFromAnnotation = function(sPath) {
		if (!sPath || !this._oMetaModel) {
			return null;
		}
		// Note: slash inside of namespace is not allowed due to OData specification:
		// http://docs.oasis-open.org/odata/odata/v4.0/errata03/os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Namespace
		var aPath = sPath.split("/");
		// The type could either be an entity type or a complex type
		var oType = this._oMetaModel.getODataEntityType(aPath[0]) || this._oMetaModel.getODataComplexType(aPath[0]);
		return MetadataAnalyser.getSemanticObjectsFromProperty(this._oMetaModel.getODataProperty(oType, aPath[1]));
	};

	/**
	 * Retrieves the default SemanticObject and other SemanticObjects for the specified annotations.
	 * 
	 * @param {object} oProperty the given OData property
	 * @returns {object | undefined} the resolved semanticObject annotation object (if any)
	 * @private
	 */
	MetadataAnalyser.getSemanticObjectsFromProperty = function(oProperty) {
		var oSemanticObjects = {
			defaultSemanticObject: undefined,
			additionalSemanticObjects: []
		};
		for ( var sAttr in oProperty) {
			if (sAttr === "com.sap.vocabularies.Common.v1.SemanticObject") {
				oSemanticObjects.defaultSemanticObject = oProperty[sAttr]["String"];
			} else if (jQuery.sap.startsWith(sAttr, "com.sap.vocabularies.Common.v1.SemanticObject#")) {
				oSemanticObjects.additionalSemanticObjects.push(oProperty[sAttr]["String"]);
			}
		}
		return (oSemanticObjects.defaultSemanticObject || oSemanticObjects.additionalSemanticObjects.length > 0) ? oSemanticObjects : undefined;
	};

	/**
	 * Retrieves the SemanticObject Annotation for the specified property/target
	 * 
	 * @param {object} oProperty the given OData property
	 * @returns {Object} the resolved semanticObject annotation object (if any)
	 * @public
	 */
	MetadataAnalyser.prototype.getSemanticObjectAnnotationFromProperty = function(oProperty) {
		var oAnnotation;

		if (oProperty) {
			oAnnotation = oProperty["com.sap.vocabularies.Common.v1.SemanticObject"];
			return this._prepareSemanticObjectAnnotationFromProperty(oAnnotation);
		}

		return null;
	};

	/**
	 * Prepares the semantic object annotation.
	 * 
	 * @param {object} oAnnotation the original annotation
	 * @returns {object} the preparation result
	 * @private
	 */
	MetadataAnalyser.prototype._prepareSemanticObjectAnnotationFromProperty = function(oAnnotation) {
		var oResult, oResolvedAnnotation;

		if (oAnnotation) {
			oResult = oAnnotation["String"];
			if (oResult) {
				oResolvedAnnotation = {
					annotation: oAnnotation
				};
				oResolvedAnnotation.semanticObject = oResult;
			}
		}

		return oResolvedAnnotation;
	};

	/**
	 * Returns the fully qualified name of an entity which is e.g. "com.sap.GL.ZAF.GL_ACCOUNT" from the specified type name.
	 * 
	 * @param {string} sEntityTypeName - the entity Type name which needs to be converted
	 * @returns {string} - the fully qualified name for this entity
	 * @private
	 */
	MetadataAnalyser.prototype._getFullyQualifiedNameForEntity = function(sEntityTypeName) {
		var sNamespace, sResult;
		if (!sEntityTypeName) {
			return undefined;
		}
		// if entity type name already has a ".", just return it
		if (sEntityTypeName.indexOf(".") > -1) {
			return sEntityTypeName;
		}
		sNamespace = this.getNamespace();
		if (sNamespace && !(sEntityTypeName.indexOf(sNamespace) > -1)) {
			sResult = sNamespace + "." + sEntityTypeName;
		} else {
			sResult = sEntityTypeName;
		}
		return sResult;
	};

	/**
	 * Destroys the object
	 * 
	 * @public
	 */
	MetadataAnalyser.prototype.destroy = function() {
		this.oModel = null;
		this._oMetaModel = null;
		this._oMetadata = null;
		this._oSchemaDefinition = null;
		this._sResourceRootUri = null;
		this.bIsDestroyed = true;
		this._oDummyAnnotationHelperContext = null;
	};

	return MetadataAnalyser;

}, /* bExport= */true);
