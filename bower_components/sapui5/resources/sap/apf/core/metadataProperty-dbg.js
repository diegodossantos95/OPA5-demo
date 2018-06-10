/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.core.metadataProperty");

(function() {
	'use strict';
	/** 
	 * @class Provides convenience functions for accessing attributes of a metadata property
	 * @param {Object} oAttributes - Attributes (key value pairs) of a metadata property
	 * @returns {sap.apf.core.MetadataProperty}
	 */
	sap.apf.core.MetadataProperty = function(oAttributes) {
		// Private vars
		var that = this;
		var bKey = false;
		var bParameterEntitySetKeyProperty = false;
		// Public functions
		/**
		 * @description If this property is a key, then a boolean true is returned. Otherwise, boolean false is returned. 
		 * @returns {Boolean}
		 */
		this.isKey = function() {
			return bKey;
		};
		/**
		 * @description If this property is a parameter key property, then a boolean true is returned. Otherwise, boolean false is returned. 
		 * @returns {boolean}
		 */
		this.isParameterEntitySetKeyProperty = function() {
			return bParameterEntitySetKeyProperty;
		};
		/**
		 * @description Returns the value for a given attribute. 
		 * @param {String} sName - Attribute name
		 * @returns {boolean|string|number} 
		 */
		this.getAttribute = function(sName) {
			if (typeof this[sName] !== "function") {
				return this[sName];
			}
		};

		// Private functions
		/**
		 * @private
		 * @description Adds an attribute (key value pair) directly to itself. 
		 * If name already exists, the new value will be ignored. It is not possible to add an attribute with a method name of sap.apf.core.MetadataProperty. 
		 * @param {String} sName - Attribute name
		 * @param {String} value - Attribute value, which can be of type string, number or boolean
		 * @returns {sap.apf.core.MetadataProperty}
		 */
		function addAttribute(sName, value) {
			switch (sName) {
				case "isKey":
					if (value === true) {
						bKey = true;
					}
					break;
				case "isParameterEntitySetKeyProperty":
					if (value === true) {
						bParameterEntitySetKeyProperty = true;
					}
					break;
				default:
					if (typeof that[sName] !== "function") {
						that[sName] = value;
					}
			}
			return that;
		}

		function initialize() {
			for( var name in oAttributes) {
				switch (name) {
					case "dataType":
						for( var dataTypeName in oAttributes.dataType) {
							addAttribute(dataTypeName, oAttributes.dataType[dataTypeName]);
						}
						break;
					default:
						addAttribute(name, oAttributes[name]);
				}
			}
		}
		initialize();
	};
}());