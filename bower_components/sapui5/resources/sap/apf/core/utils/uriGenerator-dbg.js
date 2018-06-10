/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.messageObject");

(function(){
	'use strict';
/**
 * @descriptions Module for uri generation and location helper functions for the resource location
 */
sap.apf.core.utils.uriGenerator = {};

/**
 * @memberOf sap.apf.core.utils.uriGenerator
 * @description Returns the absolute URL path of the service root. The slash as last character is fixed, if not existing.
 * @param {String} sPathToRoot Absolute Path to the service root like /sap/hba/apps/wca/s/odata/wca.xsodata/ .
 * @returns {String}
 */
sap.apf.core.utils.uriGenerator.getAbsolutePath = function(sPathToRoot) {
	if (sPathToRoot.slice(-1) === '/') {
		return sPathToRoot;
	}
	return sPathToRoot + "/";
};

/**
 * @memberOf sap.apf.core.utils.uriGenerator
 * @param {string} sPathToServiceDocument 
 * @description Returns the relative url path of the oadata service.
 * @returns {String}
 */
sap.apf.core.utils.uriGenerator.getODataPath = function(sPathToServiceDocument) {
	var aSplitt = sPathToServiceDocument.split('/');
	var i;
	var aSplittContent = [];
	for(i = 0; i < aSplitt.length; i++) {
		if (aSplitt[i] !== "") {
			aSplittContent.push(aSplitt[i]);
		}
	}
	var sReturn = '';
	var len = aSplittContent.length - 1;
	for(i = 0; i < len; i++) {
		sReturn = sReturn + '/' + aSplittContent[i];
	}
	return sReturn + '/';
};
/**
 * @memberOf sap.apf.core.utils.uriGenerator
 * @description adds a relative url to an absolute url 
 * @param {string} absoluteURL
 * @param {string} relativeURL
 * @returns {string} composedURL
 */
sap.apf.core.utils.uriGenerator.addRelativeToAbsoluteURL = function(absoluteURL, relativeURL) {
	
	var absoluteUrlParts = absoluteURL.split('/');
	var relativeUrlParts = relativeURL.split('/');
	
	relativeUrlParts.forEach(function(part){
		if (part === '..') {
			absoluteUrlParts.pop();
		} else if (part != '.') {
			absoluteUrlParts.push(part);
		}
	});
	
	return absoluteUrlParts.join('/');
};

/**
 * @description returns the url for a given component up to this component (not including).
 * @param (string} componentName
 * @returns {string} absoluteUrlUpToComponent
 */
sap.apf.core.utils.uriGenerator.getBaseURLOfComponent = function(componentName) {
	var baseComponentNameParts = componentName.split('.');
	baseComponentNameParts.pop();
	var base = baseComponentNameParts.join('.');
	return jQuery.sap.getModulePath(base);
};



/**
 * @memberOf sap.apf.core.utils.uriGenerator
 * @description gets the location of the apf libary. sap.apf.core.utils.uriGenerator is required for loading texts, images and so on.
 * @returns {String}
 */
sap.apf.core.utils.uriGenerator.getApfLocation = function() {
	return jQuery.sap.getModulePath("sap.apf") + '/';
};
/**
 * @memberOf sap.apf.core.utils.uriGenerator
 * @description Generates the oData path for a given entitySet with parameters and a navigationProperty
 * @param {sap.apf.core.MessageHandler} messageHandler
 * @param {sap.apf.core.metadata} metadata of the service that contains the entitySet
 * @param {String} entitySet Name of the entitySet
 * @param {sap.apf.core.utils.Filter} filter Filter that should contain all required parameters
 * @param {String} navigationProperty Navigation property of the given entitySet
 * @returns {String} oData path: entitySet(param1=2,param2=3)/navigationProperty
 */
sap.apf.core.utils.uriGenerator.generateOdataPath = function(messageHandler, metadata, entitySet, filter, navigationProperty){
	var parameter = retrieveParameters(metadata, filter);
	var result = entitySet;
	var parametersExist = false;
	var param;
	for(param in parameter) {
		if (!parametersExist) {
			result += '(';
			parametersExist = true;
		} else {
			result += ',';
		}
		result += param.toString() + '=' + parameter[param];
	}
	if (parametersExist) {
		result += ')/';
	}
	result += navigationProperty || '';
	return result;

	function retrieveParameters() {
		var result = {};
		var parameters;
		var numberOfParameters;
		var termsContainingParameter;
		var i;
		var parameterTerm;
		parameters = metadata.getParameterEntitySetKeyProperties(entitySet);
		if (parameters !== undefined) {
			numberOfParameters = parameters.length;
		} else {
			numberOfParameters = 0;
		}
		if (numberOfParameters > 0) {
			for(i = 0; i < numberOfParameters; i++) {
				if (filter && filter instanceof sap.apf.core.utils.Filter) {
					termsContainingParameter = filter.getFilterTermsForProperty(parameters[i].name);
					parameterTerm = termsContainingParameter[termsContainingParameter.length - 1];
				}
				if (parameterTerm instanceof sap.apf.core.utils.FilterTerm) {
					addParameter(i, parameterTerm.getValue());
				} else if (parameters[i].defaultValue) {
					addParameter(i, parameters[i].defaultValue);
				} else if (parameters[i].parameter !== 'optional' ){
					messageHandler.putMessage(messageHandler.createMessageObject({
						code : '5016',
						aParameters : [ parameters[i].name ]
					}));
				}
			}
		}
		return result;
		function addParameter(index, value) {
			var formatedValue;
			if (parameters[index].dataType.type === 'Edm.String') {
				result[parameters[index].name] = (jQuery.sap.encodeURL("'" + sap.apf.utils.escapeOdata(value) + "'"));
			} else if (parameters[index].dataType.type) {
				formatedValue = sap.apf.utils.formatValue(value, parameters[index].dataType.type);
				if (typeof formatedValue === 'string') {
					result[parameters[index].name] = jQuery.sap.encodeURL(formatedValue);
				} else {
					result[parameters[index].name] = formatedValue;
				}
			} else if (typeof value === 'string') {
				result[parameters[index].name] = jQuery.sap.encodeURL(sap.apf.utils.escapeOdata(value));
			} else {
				result[parameters[index].name] = value;
			}
		}
	}
};
/**
 * @memberOf sap.apf.core.utils.uriGenerator
 * @description Generates a string to be used in $Select statement
 * @param {String []} aSelectProperties Array of properties
 * @returns {String} String for $Select statement
 */
sap.apf.core.utils.uriGenerator.getSelectString = function(aSelectProperties){
	var result = "";
	aSelectProperties.forEach(function(selectProperty, index){
		result += jQuery.sap.encodeURL(sap.apf.utils.escapeOdata(selectProperty));
		if (index < aSelectProperties.length - 1) {
			result += ",";
		}
	});
	return result;
};
/**
 * @memberOf sap.apf.core.utils.uriGenerator
 * @description builds a URI based on parameters
 * @param {sap.apf.core.MessageHandler} oMsgHandler
 * @param {string} sEntityType
 * @param [aSelectProperties]
 * @param {object} oFilterForRequest Reduced filter that just contains properties for the $filter statement
 * @param {object} oFilter Complete filter that should also contain all parameters
 * @param {object} [sortingFields]
 * @param {object} oPaging - values of properties 'top','skip' and 'inlineCount' are evaluated and added to '$top','$skip' and '$inlinecount' URI string parameters if available 
 * @param {string} sFormat of HTTP response,e.g. 'json' or 'xml'. If omitted 'json' is taken as default.
 * @param {function} [fnFormatValue] callback method to format the values 
 * @param {sNavigationProperty} Suffix after the parameter - old default is "Results"
 * @returns {string} complete URI
 */
sap.apf.core.utils.uriGenerator.buildUri = function(oMsgHandler, sEntityType, aSelectProperties, oFilterForRequest, oFilter, sortingFields, oPaging, sFormat, fnFormatValue, sNavigationProperty, oMetadata) {
	var sReturn = "";
	sReturn += sap.apf.core.utils.uriGenerator.generateOdataPath(oMsgHandler, oMetadata, sEntityType, oFilter, sNavigationProperty);
	sReturn = sReturn + "?";
	sReturn += addSelectPropertiesToUri(aSelectProperties);
	sReturn += addFilterToUri(oFilterForRequest, fnFormatValue);
	sReturn += addSorting(sortingFields, aSelectProperties);
	sReturn += addPaging(oPaging);
	sReturn += addFormatToUri(sFormat);
	return sReturn;
	function addSelectPropertiesToUri(aSelectProperties) {
		if (!aSelectProperties[0]) {
			return '';
		}
		var sResult = "$select=";
		sResult += sap.apf.core.utils.uriGenerator.getSelectString(aSelectProperties);
		return sResult;
	}
	function addFilterToUri(oFilter, fnFormatValue) {
		if (!(oFilter && oFilter instanceof sap.apf.core.utils.Filter) || oFilter.isEmpty()) {
			return '';
		}
		var sFilterValues = oFilter.toUrlParam( { formatValue : fnFormatValue });
		if (sFilterValues === "" || sFilterValues === '()') {
			return '';
		}	
		return '&$filter=' + sFilterValues;	
	}
	function addSorting(sortingFields, aSelectProperties) {
		var sOrderByValues = '';
		var sSingleValue = '';
		var i;
		if (!sortingFields) {
			return '';
		}
		switch (true) {
			case jQuery.isArray(sortingFields):
				for( i = 0; i < sortingFields.length; i++) {
					sSingleValue = makeOrderByValue(sortingFields[i], aSelectProperties);
					if (sOrderByValues.length > 0 && sSingleValue.length > 0) {
						sOrderByValues += ',';
					}
					sOrderByValues += sSingleValue;
				}
				break;
			case jQuery.isPlainObject(sortingFields):
				sOrderByValues += makeOrderByValue(sortingFields, aSelectProperties);
				break;
			case typeof sortingFields === 'string':
				sOrderByValues += makeOrderByValue({
					property : sortingFields
				}, aSelectProperties);
				break;
		}
		if (sOrderByValues.length > 0) {
			return "&$orderby=" + sOrderByValues;
		}
		return '';
		function makeOrderByValue(oOrderBy, aSelectProperties) {
			var sValue = '';
			if (jQuery.inArray(oOrderBy.property, aSelectProperties) > -1) {
				sValue += oOrderBy.property;
				if (oOrderBy.descending === true || oOrderBy.ascending === false) {
					sValue += ' desc';
				}else {
					sValue += ' asc';
				}
			} else {
				oMsgHandler.putMessage(oMsgHandler.createMessageObject({
					code : '5019',
					aParameters : [ sEntityType, oOrderBy.property ]
				}));
			}
			return jQuery.sap.encodeURL(sValue);
		}
	}
	function addPaging(oPaging) {
		
		function checkPropertyOptionsConsistency(oPaging) {
			var aPropertyNames, i;
			aPropertyNames = Object.getOwnPropertyNames(oPaging);
			for (i = 0; i < aPropertyNames.length;i++) {
				if (aPropertyNames[i] !== 'top' && aPropertyNames[i] !== 'skip' && aPropertyNames[i] !== 'inlineCount') {
					oMsgHandler.putMessage(oMsgHandler.createMessageObject({
						code : '5032',
						aParameters : [ sEntityType, aPropertyNames[i] ]
					}));
				}
			}
		}
		
		var sReturn = '';
		
		if (!oPaging) {
			return sReturn;
		}
		checkPropertyOptionsConsistency(oPaging);

		if (oPaging.top) {
			sReturn += '&$top=' + oPaging.top;
		}
		if (oPaging.skip) {
			sReturn += '&$skip=' + oPaging.skip;
		}
		if (oPaging.inlineCount === true) {
			sReturn += '&$inlinecount=allpages';
		}
		return sReturn;
	}
	function addFormatToUri(sFormat) {
		if (!sFormat) {
			sFormat = 'json'; // eslint-disable-line
		}
		return '&$format=' + sFormat;
	}
};
}());
