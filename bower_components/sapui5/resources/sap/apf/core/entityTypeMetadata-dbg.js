/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.core.entityTypeMetadata");

(function() {
	'use strict';
/** 
 * @class Provides convenience functions for metadata handling.
 * @param {sap.apf.core.MessageHandler} oMessageHandler
 * @param {string} sEntityType 
 * @param {sap.apf.core.Metadata} oMetadata
 * @returns {sap.apf.core.EntityTypeMetadata}
 */
sap.apf.core.EntityTypeMetadata = function (oMessageHandler, sEntityType, oMetadata) {
	/**
	 * @description Contains 'entityTypeMetadata'.
	 * @returns {String}
	 */
	this.type = 'entityTypeMetadata';
	/**
	 * @description Returns all metadata for a property as object. 
	 * Property names of the returned object match the metadata attribute names (e.g. 'Name' or 'Nullable') except for the type information, i.e there is no property 'Type'. 
	 * All type information is enclosed in property 'dataType', which is another object.
	 * This object contains property 'EdmType' and optional additional properties belonging to the respective type.
	 * If no metadata could be determined for the property, the method will return an almost empty object that only contains the 'dataType' property for convenience: 
	 * { dataType : { } }. 
	 * @param {string} sProperty
	 * @returns {object}
	 */
	this.getPropertyMetadata = function (sProperty) {
		var result;
		result = oMetadata.getPropertyMetadata(sEntityType, sProperty);
		if (!result) {
			result = {
				dataType : {}
			};
		}
		return result;
	};
	
	/**
	 * @description Returns metadata annotations which includes extensions for OData 4.0 like "RequiresFilter"
	 * @returns {array}
	 */
	this.getEntityTypeMetadata = function() {
		return oMetadata.getEntityTypeAnnotations(sEntityType);
	};
	
	function checkArguments() {
		oMessageHandler.check(sEntityType && typeof sEntityType === 'string', 'sap.apf.core.entityTypeMetadata: incorrect value for parameter sEntityType');
		oMessageHandler.check(oMetadata && oMetadata.type && oMetadata.type === "metadata", 'sap.apf.core.entityTypeMetadata: incorrect value for parameter oMetadata');
	}
	
	checkArguments();
};
}());