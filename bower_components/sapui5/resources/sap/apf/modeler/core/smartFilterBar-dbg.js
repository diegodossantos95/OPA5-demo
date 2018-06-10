/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.smartFilterBar");
(function() {
	'use strict';
	/**
	 * @private
	 * @name sap.apf.modeler.core.SmartFilterBar
	 * @class A SmartFilterBar object providing editor methods on configuration objects
	 * @param {String} smartFilterBarId - unique Id
	 * @constructor
	 */
	sap.apf.modeler.core.SmartFilterBar = function(smartFilterBarId){
		var service, entitySet;
		var bEntityTypeIsNotConverted = false;
		
		this.getId = function(){
			return smartFilterBarId;
		};
		this.setService = function(name){
			service = name;
		};
		this.getService = function(){
			return service;
		};
		/**
		 * sets the name of the entity set for the smart filter bar. Valid  entity sets are all entity sets under the service root,
		 *  that are no parameter entity sets.
		 *  @param {string} name the name of the entity set
		 *  @param {boolean} entityTypeIsNotConverted in case, that an old configuration was read in and the name of the entity type could not 
		 *  be converted, then the entity type name is set and if it is not replaced, the configuration editor will serialize the entity type out again.
		 *  So we have no self healing effect.
		 */
		this.setEntitySet = function(name, entityTypeIsNotConverted){
			entitySet = name;
			bEntityTypeIsNotConverted = entityTypeIsNotConverted;
		};
		this.getEntitySet = function(){
			return entitySet;
		};
		this.isEntityTypeConverted = function() {
			return !bEntityTypeIsNotConverted;
		};
	};
}());