/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.require("sap.apf.ui.utils.constants");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	'use strict';
	var oRepresentationInstance, oRepresentation, oParentStep, oConfigurationHandler, oTextReader, oRepresentationHandler, oStepPropertyMetadataHandler, oRepresentationTypeHandler;
	var oTableRepresentation = sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION;
	function _drawMainChart(oController) {
		var sStepLongTitleId = oParentStep.getLongTitleId();
		var sStepTitleId = sStepLongTitleId && !oConfigurationHandler.getTextPool().isInitialTextKey(sStepLongTitleId) ? sStepLongTitleId : oParentStep.getTitleId();
		var oMainChart = oRepresentationInstance.getMainContent(_checkForTexts(sStepTitleId), 480, 330);
		oController.byId("idMainChart").addItem(oMainChart);
	}
	function _checkForTexts(oSampleTextId) {
		var oSampleText = oSampleTextId && oConfigurationHandler.getTextPool().get(oSampleTextId), sSampleText;
		if (oSampleText !== undefined) {
			sSampleText = oSampleText.TextElementDescription;
		}
		return sSampleText;
	}
	function _getCornerText(sMethodName) {
		var mPreviewCornerText = _checkForTexts(oRepresentation[sMethodName]());
		if (mPreviewCornerText === undefined) {
			mPreviewCornerText = _checkForTexts(oParentStep[sMethodName]());
		}
		return mPreviewCornerText;
	}
	function _drawThumbnailContent(oController) {
		var sStepLongTitleId = oParentStep.getLongTitleId();
		var sStepTitleId = sStepLongTitleId && !oConfigurationHandler.getTextPool().isInitialTextKey(sStepLongTitleId) ? sStepLongTitleId : oParentStep.getTitleId();
		var sStepTitle = _checkForTexts(sStepTitleId);
		oController.byId("idStepTitleText").setText(sStepTitle);
		oController.byId("idThumbnailChartLayout").addItem(oRepresentationInstance.getThumbnailContent());
		oController.byId("idLeftUpperCornerText").setText(_getCornerText("getLeftUpperCornerTextKey"));
		oController.byId("idRightUpperCornerText").setText(_getCornerText("getRightUpperCornerTextKey"));
		oController.byId("idLeftLowerCornerText").setText(_getCornerText("getLeftLowerCornerTextKey"));
		oController.byId("idRightLowerCornerText").setText(_getCornerText("getRightLowerCornerTextKey"));
	}
	// Draws main chart and thumb nail content and Adds necessary style classes to view.
	function _drawContent(oController) {
		_drawMainChart(oController);
		_drawThumbnailContent(oController);
	}
	// Uses the Array#sort method to sort data.
	function _sortData(aData, aSortProperties) {
		return aData.sort(function(oRow1, oRow2) {
			var nResult, i;
			for(i = 0; i < aSortProperties.length; i++) {
				if (oRow1[aSortProperties[i].property] < oRow2[aSortProperties[i].property]) {
					nResult = -1;
				} else if (oRow1[aSortProperties[i].property] > oRow2[aSortProperties[i].property]) {
					nResult = 1;
				}
				nResult = nResult * [ 1, -1 ][+!aSortProperties[i].ascending];
				if (nResult !== 0) {
					return nResult;
				}
			}
		});
	}
	function _getSelectedPropertyRowsOfBasicDataAsPromise(sLabelTextKeyMethod, oActualProperties, aProperty) {
		var deferred = jQuery.Deferred();
		oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
			var sPropertyLabelText, sLabelTextKey, aProperties = [];
			oActualProperties.forEach(function(oData) {
				if (oData.sProperty === "") {
					oData.sProperty = aProperty[0];
				}
				if (oData.sProperty !== oTextReader("none")) {
					sLabelTextKey = sLabelTextKeyMethod(oData.sProperty);
					if (sLabelTextKey !== undefined) {
						sPropertyLabelText = oConfigurationHandler.getTextPool().get(sLabelTextKey).TextElementDescription;
					} else {
						sPropertyLabelText = oStepPropertyMetadataHandler.getDefaultLabel(entityTypeMetadata, oData.sProperty);
					}
					aProperties.push({
						fieldName : oData.sProperty,
						sAggregationRole : oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, oData.sProperty)["aggregation-role"],
						fieldDesc : sPropertyLabelText,
						kind : oData.sContext
					});
				}
			});
			deferred.resolve(aProperties);
		});
		return deferred.promise();
	}
	function _getPropertyDatasetAsPromise(aPropertyType) {
		var deferred = jQuery.Deferred();
		var aPropertyRows = [];
		if (aPropertyType === "properties" && oRepresentation.getRepresentationType() === oTableRepresentation) {
			var aProperties = oStepPropertyMetadataHandler.getProperties();
			_getSelectedPropertyRowsOfBasicDataAsPromise(oRepresentation.getPropertyTextLabelKey, oRepresentationHandler.getActualProperties(), aProperties).done(function(aAllPropertyRows) {
				aPropertyRows = aAllPropertyRows;
			});
		} else if (aPropertyType === "dimensions" && oRepresentation.getRepresentationType() !== oTableRepresentation) {
			oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityType) {
				var aAllProperties = oStepPropertyMetadataHandler.getDimensionsProperties(oEntityType);
				_getSelectedPropertyRowsOfBasicDataAsPromise(oRepresentation.getDimensionTextLabelKey, oRepresentationHandler.getActualDimensions().concat(oRepresentationHandler.getActualLegends()), aAllProperties).done(function(aAllPropertyRows) {
					aPropertyRows = aAllPropertyRows;
				});
			});
		} else if (aPropertyType === "measures" && oRepresentation.getRepresentationType() !== oTableRepresentation) {
			oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityType) {
				var aAllProperties = oStepPropertyMetadataHandler.getMeasures(oEntityType);
				_getSelectedPropertyRowsOfBasicDataAsPromise(oRepresentation.getMeasureTextLabelKey, oRepresentationHandler.getActualMeasures(), aAllProperties).done(function(aAllPropertyRows) {
					aPropertyRows = aAllPropertyRows;
				});
			});
		}
		deferred.resolve(aPropertyRows);
		return deferred.promise();
	}
	/*          Generates dynamic data based on the dimensions and measures.
	            Data grows exponentially based on the number of dimensions available.
	            Each dimension will have (nSamplesPerDimension) data with random values for measures.*/
	function _generateSampleDataAsPromise() {
		var deferred = jQuery.Deferred();
		var aSampleData = [], aSort = [], i = 0, nSamplesPerDimension = 3; //Change the value of nSamplePerDimension to control the amount of data
		var aProperties = oStepPropertyMetadataHandler.getProperties();
		oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityType) {
			var aDimensions = oStepPropertyMetadataHandler.getDimensionsProperties(oEntityType);
			var aMeasures = oStepPropertyMetadataHandler.getMeasures(oEntityType);
			var sChartType = oRepresentation.getRepresentationType();
			var len = sChartType !== oTableRepresentation ? Math.pow(nSamplesPerDimension, aDimensions.length) : 7;
			for(i = 0; i < len; i++) {
				var oRow = {};
				if (sChartType === oTableRepresentation) {
					aProperties.forEach(function(sProperty) {
						var sPropertyValue = sProperty + " - " + sap.apf.utils.createRandomNumberString(4);
						oRow[sProperty] = sPropertyValue;
					});
				} else {
					aDimensions.forEach(function(sDimension, nIndex) {
						var sDimensionValue = sDimension + " - " + (Math.floor(i / Math.pow(nSamplesPerDimension, nIndex)) % nSamplesPerDimension + 1);
						oRow[sDimension] = sDimensionValue;
					});
					aMeasures.forEach(function(sMeasure) {
						var sMeasureValue = sap.apf.utils.createRandomNumberString(4);
						oRow[sMeasure] = sMeasureValue;
					});
				}
				aSampleData.push(oRow);
			}
			aSort = oRepresentation.getOrderbySpecifications();
			if (aSort && aSort.length) {
				aSampleData = _sortData(aSampleData, aSort);
			}
			deferred.resolve(aSampleData);
		});
		return deferred.promise();
	}
	//Prepares the representationInstance from the constructor and host it on 'oRepresentationInstance'. Invokes 'setData' on the instance by passing sample data and dummy meta data.
	function _prepareRepresentationInstance() {
		var sRepresentationConstructor = oRepresentationTypeHandler.getConstructorOfRepresentationType(oRepresentation.getRepresentationType());
		jQuery.sap.require(sRepresentationConstructor);
		var oRepresentationConstructor = sap.apf.utils.extractFunctionFromModulePathString(sRepresentationConstructor);
		var oPropertyRows = {};
		function _getText(sText) {
			return sText;
		}
		function oEmptyStub() {
		}
		var oApiStub = {
			getTextNotHtmlEncoded : _getText,
			getTextHtmlEncoded : _getText,
			getEventCallback : oEmptyStub,
			getExits : function() {
				var exits = {};
				return exits;
			},
			getUiApi : function() {
				var oUiApi = {};
				oUiApi.getStepContainer = function() {
					return undefined;
				};
				return oUiApi;
			},
			createFilter : function() {
				return {
					getOperators : function() {
						return {
							EQ : true
						};
					},
					getTopAnd : function() {
						return {
							addOr : oEmptyStub
						};
					},
					getInternalFilter : function() {
						return {
							getProperties : function() {
								return [];
							}
						};
					}
				};
			},
			createMessageObject : oEmptyStub,
			putMessage : oEmptyStub,
			updatePath : oEmptyStub,
			selectionChanged : oEmptyStub,
			getActiveStep : function() {
				return {
					getSelectedRepresentation : function() {
						return {
							bIsAlternateView : true
						};
					}
				};
			}
		};
		_getPropertyDatasetAsPromise("dimensions").done(function(oDimensions) {
			oPropertyRows.dimensions = oDimensions;
		});
		_getPropertyDatasetAsPromise("measures").done(function(oMeasures) {
			oPropertyRows.measures = oMeasures;
		});
		_getPropertyDatasetAsPromise("properties").done(function(oProperties) {
			oPropertyRows.properties = oProperties;
		});
		oRepresentationInstance = new oRepresentationConstructor(oApiStub, oPropertyRows);
		if (oRepresentationInstance.chartType === oTableRepresentation) {
			oRepresentationInstance.oTableRepresentation.removeEventDelegate();
			oRepresentationInstance.oTableRepresentation.onAfterRendering(function() {
				return;
			});
		}
		var oMetadataStub = {
			getPropertyMetadata : function() {
				var deferred = jQuery.Deferred();
				deferred.resolve({
					label : undefined
				});
				return {
					label : undefined
				};
			}
		};
		_generateSampleDataAsPromise().done(function(sampleData) {
			oRepresentationInstance.setData(sampleData, oMetadataStub);
		});
	}
	function _setDisplayText(oController) {
		var oPreviewContentDialog = oController.byId("idPreviewContentDialog");
		oPreviewContentDialog.setTitle(oTextReader("preview"));
		oPreviewContentDialog.getEndButton().setText(oTextReader("close"));
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.previewContent", {
		onInit : function() {
			var oController = this;
			var oPreviewContentDialog = oController.byId("idPreviewContentDialog");
			oRepresentation = oController.getView().getViewData().oRepresentation;
			oParentStep = oController.getView().getViewData().oParentStep;
			oConfigurationHandler = oController.getView().getViewData().oConfigurationHandler;
			oTextReader = oController.getView().getViewData().oCoreApi.getText;
			oRepresentationHandler = oController.getView().getViewData().oRepresentationHandler;
			oStepPropertyMetadataHandler = oController.getView().getViewData().oStepPropertyMetadataHandler;
			oRepresentationTypeHandler = oController.getView().getViewData().oRepresentationTypeHandler;
			_setDisplayText(oController);
			_prepareRepresentationInstance();
			_drawContent(oController);
			oPreviewContentDialog.open();
		},
		handleCloseButtonOfDialog : function() {
			var oController = this;
			oController.byId("idPreviewContentDialog").destroy();
			oController.getView().destroy();
		}
	});
}());
