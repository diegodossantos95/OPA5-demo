/* (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/* global window */
jQuery.sap.declare("sap.apf.ui.utils.printModel");
jQuery.sap.require("sap.apf.ui.utils.formatter");
jQuery.sap.require("sap.viz.ui5.types.legend.Common");
sap.apf.ui.utils.PrintModel = function(oInject) {
	this.oUiApi = oInject.uiApi;
	this.oCoreApi = oInject.oCoreApi;
	this.oFilterIdHandler = oInject.oFilterIdHandler;
};
sap.apf.ui.utils.PrintModel.prototype.constructor = sap.apf.ui.utils.PrintModel;
function _getAllTheConfiguredSmartFilters(oPrintModelInstance) {
	var oSmartFilter = oPrintModelInstance.oUiApi.getSmartFilterForPrint();
	var aFormatterFilter = [], formatterMetaData, sValue, sHighValue;
	var oTextReader = oPrintModelInstance.oCoreApi.getTextNotHtmlEncoded;
	if (oSmartFilter !== undefined && oSmartFilter !== null) {
		var oSmartFilterData = oSmartFilter.getFilterData();
		var filterName;
		var oFilter = sap.apf.core.utils.Filter.transformUI5FilterToInternal(oPrintModelInstance.oCoreApi.getMessageHandler(), oSmartFilter.getFilters()[0]);
		for(filterName in oSmartFilterData) {
			var tokenText = "";
			var aSpecificFilter = oFilter.getFilterTermsForProperty(filterName);
			oPrintModelInstance.oCoreApi.getMetadataFacade().getProperty(filterName).done(function(metadata) {
				for( var valueCount = 0; valueCount < aSpecificFilter.length; valueCount++) {
					formatterMetaData = metadata;
					var oFormatter = new sap.apf.ui.utils.formatter({
						getEventCallback : oPrintModelInstance.oUiApi.getEventCallback.bind(oPrintModelInstance.oUiApi),
						getTextNotHtmlEncoded : oPrintModelInstance.oCoreApi.getTextNotHtmlEncoded,
						getExits : oPrintModelInstance.oUiApi.getCustomFormatExit()
					}, formatterMetaData);
					sValue = oFormatter.getFormattedValue(filterName, aSpecificFilter[valueCount]['value']);
					sHighValue = oFormatter.getFormattedValue(filterName, aSpecificFilter[valueCount]['highValue']);
					tokenText += oTextReader(aSpecificFilter[valueCount]['operator'], [ sValue, sHighValue ]);
					if (valueCount !== aSpecificFilter.length - 1) {
						tokenText += ", ";
					}
				}
				aFormatterFilter.push({
					sFilterName : filterName,
					sFilterValue : tokenText
				});
			});
		}
	}
	return aFormatterFilter;
}
/**** Get all the configured facet filters from APF  ****/
function _getAllTheConfiguredFacetFilters(oPrintModelInstance) {
	var nIndex, sFilterName = "", sFilterValue;
	var oFacetFilter, oFacetFilterLists, aFacetFilters = [], aSelectedFilters = [], aSelectedItems = [];
	oFacetFilter = oPrintModelInstance.oUiApi.getFacetFilterForPrint();
	if (oFacetFilter) {// If there is a facet filter
		oFacetFilterLists = oFacetFilter.getLists();
		for(nIndex = 0; nIndex < oFacetFilterLists.length; nIndex++) {
			sFilterName = oFacetFilterLists[nIndex].getTitle();
			if (!oFacetFilterLists[nIndex].getSelectedItems().length) {
				aSelectedItems = oFacetFilterLists[nIndex].getItems();
			} else {
				aSelectedItems = oFacetFilterLists[nIndex].getSelectedItems();
			}
			aSelectedFilters = _getTextsFromSelectedItems(aSelectedItems);
			if (sFilterName !== undefined && sFilterName !== null) {
				sFilterValue = "";
				for( var j = 0; j < aSelectedFilters.length; j++) {
					if (j !== aSelectedFilters.length - 1) {
						sFilterValue += aSelectedFilters[j] + ", ";
					} else {
						sFilterValue += aSelectedFilters[j];
					}
				}
				aFacetFilters.push({
					sFilterName : sFilterName,
					sFilterValue : sFilterValue
				});
			}
		}
	}
	return aFacetFilters;
}
function _getTextsFromSelectedItems(aSelectedItems) {
	var aSelectedFilters = [];
	aSelectedItems.forEach(function(oItem) {
		aSelectedFilters.push(oItem.getText());
	});
	return aSelectedFilters;
}
/**** Get application specific Filters Expression from APF****/
function _getApplicationSpecificFiltersExpression(oPrintModelInstance) {
	/**** First : Get application specific Get Application Specific Filters Ids****/
	var aAllAppSpecificFilterIds = oPrintModelInstance.oFilterIdHandler.getAllInternalIds();
	var oAppSpecificFilter, aAppSpecificFilterExp = [], i;
	if (aAllAppSpecificFilterIds.length > 0) {
		for(i = 0; i < aAllAppSpecificFilterIds.length; i++) {
			oAppSpecificFilter = oPrintModelInstance.oFilterIdHandler.get(aAllAppSpecificFilterIds[i]).getExpressions();
			aAppSpecificFilterExp.push(oAppSpecificFilter[0]);
		}
	}
	return aAppSpecificFilterExp;
}
/**** Get application specific Formatted Filter Values****/
function _getPrepareFormattedFilterValues(oPrintModelInstance, aAppSpecificFilterExp) {
	var aAppSpecificFilters = [], i, j, sFilterName = "", sFilterValue, oFormatter, oPropertyMetadata;
	var filterValues = [];
	function prepareFormattedFilterValues(oPropertyMetadata) {
		sFilterName = "";
		filterValues = [];
		sFilterName = oPropertyMetadata.label;
		var oFormatter = new sap.apf.ui.utils.formatter({
			getEventCallback : oPrintModelInstance.oUiApi.getEventCallback.bind(oPrintModelInstance.oUiApi),
			getTextNotHtmlEncoded : oPrintModelInstance.oCoreApi.getTextNotHtmlEncoded,
			getExits : oPrintModelInstance.oUiApi.getCustomFormatExit()
		}, oPropertyMetadata);
		filterValues.push(oFormatter.getFormattedValue(oPropertyMetadata.name, aAppSpecificFilterExp[i][j].value));
	}
	for(i = 0; i < aAppSpecificFilterExp.length; i++) {
		for(j = 0; j < aAppSpecificFilterExp[i].length; j++) {
			oPrintModelInstance.oCoreApi.getMetadataFacade().getProperty(aAppSpecificFilterExp[i][j].name).done(function(metadata) {
				oPropertyMetadata = metadata;
				sFilterName = "";
				filterValues = [];
				sFilterName = metadata.label;
				oFormatter = new sap.apf.ui.utils.formatter({
					getEventCallback : oPrintModelInstance.oUiApi.getEventCallback.bind(oPrintModelInstance.oUiApi),
					getTextNotHtmlEncoded : oPrintModelInstance.oCoreApi.getTextNotHtmlEncoded,
					getExits : oPrintModelInstance.oUiApi.getCustomFormatExit()
				}, metadata);
			});
			filterValues.push(oFormatter.getFormattedValue(oPropertyMetadata.name, aAppSpecificFilterExp[i][j].value));
			if (sFilterName !== undefined && sFilterName !== null) {
				sFilterValue = "";
				for( var j = 0; j < filterValues.length; j++) {
					if (j !== filterValues.length - 1) {
						sFilterValue += filterValues[j] + ", ";
					} else {
						sFilterValue += filterValues[j];
					}
				}
				aAppSpecificFilters.push({
					sFilterName : sFilterName,
					sFilterValue : sFilterValue
				});
			}
		}
	}
	return aAppSpecificFilters;
}
/**** If application has a print functionality on its own use it 
otherwise get formatted filter values for application specific filters from APF****/
function _getAllTheConfiguredAppSpecificFormattedFilters(oPrintModelInstance) {
	// If application has a print functionality on its own use it otherwise get formatted filter values for application specific filters from APF
	var callback = oPrintModelInstance.oUiApi.getEventCallback(sap.apf.core.constants.eventTypes.printTriggered);
	var aAppSpecificFormattedFilters = _getPrepareFormattedFilterValues(oPrintModelInstance, _getApplicationSpecificFiltersExpression(oPrintModelInstance));
	if (callback !== undefined) {
		var callbackContext = {
			getTextNotHtmlEncoded : oPrintModelInstance.oCoreApi.getTextNotHtmlEncoded
		};
		aAppSpecificFormattedFilters = callback.apply(callbackContext, _getApplicationSpecificFiltersExpression(oPrintModelInstance));
	}
	return aAppSpecificFormattedFilters;
}
function _getFormattedFilters(oPrintModel) {
	var aFilters, appSmartFilters, aFiltersForPrining;
	var appFacetFilters = _getAllTheConfiguredFacetFilters(oPrintModel);
	appSmartFilters = _getAllTheConfiguredSmartFilters(oPrintModel);
	aFilters = _getAllTheConfiguredAppSpecificFormattedFilters(oPrintModel);
	aFiltersForPrining = aFilters.concat(appSmartFilters, appFacetFilters);
	return aFiltersForPrining;
}
sap.apf.ui.utils.PrintModel.prototype.getFiltersToPrint = function() {
	var oPrintModel = this;
	var aFormattedFilters = _getFormattedFilters(oPrintModel);
	return aFormattedFilters;
};
/**
 * @method getHeaderForFirstPage creates a header for the first page of print
 * @returns header for first page of print
 */
sap.apf.ui.utils.PrintModel.prototype.getHeaderForFirstPage = function() {
	return this.oUiApi.getAnalysisPath().oSavedPathName.getTitle();
};
sap.apf.ui.utils.PrintModel.prototype.getApplicationName = function() {
	var oMessageObject;
	var sAppName = this.applicationConfig.appName;
	if (!sAppName) {
		oMessageObject = this.oCoreApi.createMessageObject({
			code : "6003",
			aParameters : [ "sAppName" ]
		});
		this.oCoreApi.putMessage(oMessageObject);
	}
	return sAppName;
};
sap.apf.ui.utils.PrintModel.prototype.setApplicationConfig = function(conf) {
	this.applicationConfig = conf;
};
/**
 * @method _getRepresentationForPrint
 * @param oStep - is used to get the step information
 * @returns the representation for printing
 */
sap.apf.ui.utils.PrintModel.prototype.getRepresentationForPrint = function(oStep) {
	var oPrintContent;
	var oStepTitle = this.oCoreApi.getTextNotHtmlEncoded(oStep.title);
	var oSelectedRepresentation = oStep.getSelectedRepresentation();
	var oStepRepresentation = oSelectedRepresentation.bIsAlternateView ? oSelectedRepresentation.toggleInstance : oSelectedRepresentation;
	oPrintContent = oStepRepresentation.getPrintContent(oStepTitle);
	return oPrintContent.oRepresentation;
};
