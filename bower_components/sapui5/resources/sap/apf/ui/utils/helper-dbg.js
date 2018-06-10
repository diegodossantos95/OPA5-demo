/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.helper');
sap.apf.ui.utils.Helper = function(oCoreApi) {
	"use strict";
	this.oCoreApi = oCoreApi;
	/**
	*@memberOf sap.apf.ui.utils.helper
	*@method getRepresentationSortInfo
	*@param {object} Representation
	*@description reads the orderBy field (array of values) from the parameters of representation.
	*                           
	*                            i.e "orderby": [{
	*                               property	:	OverdueDebitAmtInDisplayCrcy_E
	*                            ascending	:	false
	*                             }]
	*                             
	* Reads the label from dimensions/measures if the orderby property matches the consolidated list of dimension and measures of the representation
	* 
	* Otherwise reads the value from metaDataFacade for the orderby properties.
	* @return {string} comma separated value of all the orderBy properties as sort description
	*/
	this.getRepresentationSortInfo = function(oRepresentation) {
		var self = this;
		var deferredRepSortInfo = jQuery.Deferred();
		var aConsolidatedProperty = oRepresentation.parameter.dimensions.concat(oRepresentation.parameter.measures); //Consolidated array of dimension and measures
		var aSortField = oRepresentation.parameter.orderby; // orderby fields
		var aSortDescription = aSortField.map(function(oSortField) { //sort field descrptions for all the sort fields
			var sSortDescription;
			var deferred = jQuery.Deferred();
			aConsolidatedProperty.forEach(function(oConsolidatedproperty) { //check if the property label exists in dimensions or measures
				if (oSortField.property === oConsolidatedproperty.fieldName && oConsolidatedproperty.fieldDesc && self.oCoreApi.getTextNotHtmlEncoded(oConsolidatedproperty.fieldDesc)) { //if label for property is available in dimension/measures
					sSortDescription = self.oCoreApi.getTextNotHtmlEncoded(oConsolidatedproperty.fieldDesc); //read sort description for properties from dimensions/measures
					deferred.resolve(sSortDescription);
				}
			});
			if (!sSortDescription) { //read sort description for properties from metadata
				self.oCoreApi.getMetadataFacade().getProperty(oSortField.property).done(function(metadata) {
					if (metadata.label || metadata.name) { // metadata can have label or name
						if (metadata.label) {
							deferred.resolve(metadata.label);
						} else if (metadata.name) {
							deferred.resolve(metadata.name);
						} else {
							deferred.resolve("");
						}
					}
				});
			}
			return deferred.promise();
		});
		deferredRepSortInfo.resolve(aSortDescription);
		return deferredRepSortInfo.promise();
	};
};