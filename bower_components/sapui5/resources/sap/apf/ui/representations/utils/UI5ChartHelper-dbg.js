/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/**
 * @class utils
 * @name utils
 * @memberOf sap.apf.ui.representations
 * @description holds utility functions used by viz representations 
 */
jQuery.sap.declare("sap.apf.ui.representations.utils.UI5ChartHelper");
jQuery.sap.require("sap.viz.ui5.data.FlattenedDataset");
jQuery.sap.require("sap.viz.ui5.data.DimensionDefinition");
jQuery.sap.require("sap.viz.ui5.data.MeasureDefinition");
jQuery.sap.require("sap.apf.utils.utils");

/**
 * @class UI5ChartHelper
 * @name UI5ChartHelper
 * @memberOf sap.apf.ui.representations.utils
 * @description holds utility functions used by viz representations 
 */
(function() {
	"use strict";
	sap.apf.ui.representations.utils.UI5ChartHelper = function(oApi, oParameters) {
		var self = this;
		this.parameter = oParameters;
		this.classifiedData = [];
		this.extendedDataSet = [];
		this.fieldKeysLookup = {};
		this.displayNameLookup = {};
		this.fieldNameLookup = {};
		this.filterLookup = {};
		this.datasetObj = {};
		this.cachedSelection = [];
		this.filterValues = [];
		this.dataAlreadySorted = false;
		/**
		 * @memberOf sap.apf.ui.representations.utils.UI5ChartHelper
		 * @method init
		 * @description Initialize hash maps, extended data response and dataset.
		 */
		var initFieldsKeyLookup = function(metadata, aDataResponse) {
			var fieldObjects = this.parameter.dimensions.concat(this.parameter.measures);
			this.dimensionInfo = {};
			this.parameter.dimensions.forEach(function(dimension){
				self.dimensionInfo[dimension.fieldName] = dimension;
			});
			var aRequiredFilters = [];
			var checkRequiredFilterPresent = function(requiredFilter) { //Function to determine whether the required filter is one of the dimensions or measures
				var counter = 0;
				for(var i = 0; i < fieldObjects.length; i++) {
					if (fieldObjects[i].fieldName === requiredFilter) {
						counter++;
					}
				}
				return (counter === 0 ? false : true);
			};
			if (this.parameter.requiredFilters) {
				this.parameter.requiredFilters.forEach(function(requiredFilter) {
					if (!checkRequiredFilterPresent(requiredFilter)) { //If required filter not present in dimension or measure then it is pushed to field object
						var requiredFilterObject = {
							fieldName : requiredFilter
						};
						aRequiredFilters.push(requiredFilterObject);
					}
				});
			}
			if (aRequiredFilters.length !== 0) {
				fieldObjects = fieldObjects.concat(aRequiredFilters);
			}
			for(var i = 0; i < fieldObjects.length; i++) {
				var fieldObject = fieldObjects[i];
				var fieldName = fieldObject.fieldName;
				
				this.displayNameLookup[fieldName] = {};
				if (metadata !== undefined) {
					if (metadata.getPropertyMetadata(fieldName)["aggregation-role"] === "dimension") {
						this.displayNameLookup[fieldName].DISPLAY_NAME = metadata.getPropertyMetadata(fieldName).label || metadata.getPropertyMetadata(fieldName).name;
						this.displayNameLookup[fieldName].VALUE = fieldName;
						this.displayNameLookup[fieldName].DISPLAY_VALUE = "formatted_" + fieldName;
						
					} else {
						this.displayNameLookup[fieldName].DISPLAY_NAME = metadata.getPropertyMetadata(fieldName).label || metadata.getPropertyMetadata(fieldName).name;
						this.displayNameLookup[fieldName].VALUE = fieldName;
					}
					if (fieldObject.fieldDesc !== undefined && oApi.getTextNotHtmlEncoded(fieldObject.fieldDesc).length) {
						this.displayNameLookup[fieldName].DISPLAY_NAME = oApi.getTextNotHtmlEncoded(fieldObject.fieldDesc);
					}
					if (metadata.getPropertyMetadata(fieldName).unit !== undefined) {
						var sUnitReference = metadata.getPropertyMetadata(fieldName).unit;
						var sUnitValue, nDataCount;
						if (aDataResponse !== undefined && aDataResponse.length !== 0) {
							sUnitValue = aDataResponse[0][sUnitReference];
							for(nDataCount = 0; nDataCount < aDataResponse.length; nDataCount++) {
								if (sUnitValue !== aDataResponse[nDataCount][sUnitReference]) {
									sUnitValue = undefined;
									break;
								}
							}
							if (sUnitValue !== undefined && sUnitValue !== "") {
									this.displayNameLookup[fieldName].DISPLAY_NAME = oApi.getTextNotHtmlEncoded("displayUnit", [ this.displayNameLookup[fieldName].DISPLAY_NAME, sUnitValue ]);
								}
							}
						}
					}
				this.fieldNameLookup[this.displayNameLookup[fieldName].DISPLAY_NAME] = {};
				this.fieldNameLookup[this.displayNameLookup[fieldName].DISPLAY_NAME].FIELD_NAME = fieldName;
				this.fieldNameLookup[this.displayNameLookup[fieldName].DISPLAY_NAME].VALUE = this.displayNameLookup[fieldName].VALUE;
				this.fieldNameLookup[this.displayNameLookup[fieldName].DISPLAY_NAME].DISPLAY_VALUE = this.displayNameLookup[fieldName].DISPLAY_VALUE;
			}
		};
		function conversionToDateRequired(fieldName, metadata) {
			//cache
			if (!self.dimensionInfo || !self.dimensionInfo[fieldName]) {
				return false;
			}
			if (self.dimensionInfo[fieldName].conversionEvaluated) {
				return self.dimensionInfo[fieldName].conversionRequired;
			}
			self.dimensionInfo[fieldName].conversionEvaluated = true;
			if (self.dimensionInfo[fieldName].dataType === "date" && metadata.getPropertyMetadata(fieldName).semantics === "yearmonthday") {
				
				self.dimensionInfo[fieldName].conversionRequired = true;
				return true;	
			}
			self.dimensionInfo[fieldName].conversionRequired = false;
			return false;
		}
		var initExtendedDataResponse = function(aDataResponse) {
			
			function getLabelDisplayOptionOfDimension(dimension) {
				var aDimensions = this.parameter.dimensions, index;
				for(index = 0; index < aDimensions.length; index++) {
					if (aDimensions[index].fieldName === dimension) {
						return aDimensions[index].labelDisplayOption;
					}
				}
			}
			var i;
			function getDisplayName(fieldName) {
				var textField = this.metadata.getPropertyMetadata(fieldName).text;
				if (this.extendedDataResponse[i][textField]) {
					var oTextToBeFormatted = {
						text : this.extendedDataResponse[i][textField],
						key : this.extendedDataResponse[i][fieldName]
					};
					return this.formatter.getFormattedValueForTextProperty(fieldName, oTextToBeFormatted);
				}
				return this.formatter.getFormattedValue(fieldName, this.extendedDataResponse[i][fieldName]);
			}
			this.extendedDataResponse = jQuery.extend([], true, aDataResponse);
			var j, k, originalValue, convertedValue;
			//Extend the aDataResponse
			if (this.extendedDataResponse.length !== 0) {
				this.convertedDates = {};
				for(i = 0; i < this.extendedDataResponse.length; i++) {
					for(k = 0; k < this.parameter.measures.length; k++) {
						if (this.extendedDataResponse[i][this.parameter.measures[k].fieldName] !== null) {
							this.extendedDataResponse[i][this.parameter.measures[k].fieldName] = parseFloat(this.extendedDataResponse[i][this.parameter.measures[k].fieldName]);
						}
					}	
					for(j = 0; j < Object.keys(this.displayNameLookup).length; j++) {
						var fieldName = Object.keys(this.displayNameLookup)[j];
					
						var formattedFieldExists = this.displayNameLookup[fieldName].DISPLAY_VALUE != undefined && (this.displayNameLookup[fieldName].DISPLAY_VALUE.search('formatted_') !== -1); // To check whether property exists or not
						if (formattedFieldExists) {
							var sLabelDisplayOption = getLabelDisplayOptionOfDimension.call(this, fieldName);
							var textExists = this.metadata.getPropertyMetadata(fieldName).hasOwnProperty('text'); // To check whether property exists or not
							if (sLabelDisplayOption === sap.apf.core.constants.representationMetadata.labelDisplayOptions.TEXT) {
								var textField = this.metadata.getPropertyMetadata(fieldName).text;
								this.extendedDataResponse[i][this.displayNameLookup[fieldName].VALUE] = this.extendedDataResponse[i][fieldName];
								this.extendedDataResponse[i][this.displayNameLookup[fieldName].DISPLAY_VALUE] = this.extendedDataResponse[i][textField] || "";
							}
							if ((!textExists && sLabelDisplayOption === undefined) || sLabelDisplayOption === sap.apf.core.constants.representationMetadata.labelDisplayOptions.KEY) {
								this.extendedDataResponse[i][this.displayNameLookup[fieldName].VALUE] = this.extendedDataResponse[i][fieldName];
								this.extendedDataResponse[i][this.displayNameLookup[fieldName].DISPLAY_VALUE] = this.formatter.getFormattedValue(fieldName, this.extendedDataResponse[i][fieldName]);
							}
							if ((textExists && sLabelDisplayOption === undefined) || sLabelDisplayOption === sap.apf.core.constants.representationMetadata.labelDisplayOptions.KEY_AND_TEXT) {
								this.extendedDataResponse[i][this.displayNameLookup[fieldName].VALUE] = this.extendedDataResponse[i][fieldName];
								this.extendedDataResponse[i][this.displayNameLookup[fieldName].DISPLAY_VALUE] = getDisplayName.call(this, fieldName);
							}
						}
						if (conversionToDateRequired(fieldName, this.metadata)) {
							originalValue = this.extendedDataResponse[i][this.displayNameLookup[fieldName].VALUE];
							convertedValue = sap.apf.utils.convertFiscalYearMonthDayToDateString(this.extendedDataResponse[i][this.displayNameLookup[fieldName].VALUE]) + "";
							this.convertedDates[convertedValue] = originalValue;
							this.extendedDataResponse[i][this.displayNameLookup[fieldName].VALUE] = convertedValue;
						}
					}
					var filterKeyText = "";
					for(j = 0; j < this.parameter.dimensions.length; j++) {
						var dimensionValueField = this.displayNameLookup[this.parameter.dimensions[j].fieldName].VALUE;
						this.extendedDataResponse[i][dimensionValueField] = (this.extendedDataResponse[i][dimensionValueField] === null || this.extendedDataResponse[i][dimensionValueField] === undefined) ? this.extendedDataResponse[i][dimensionValueField]
								: this.extendedDataResponse[i][dimensionValueField].toString();
						filterKeyText = filterKeyText + this.extendedDataResponse[i][dimensionValueField];
						this.filterLookup[filterKeyText] = [];
						if (this.parameter.requiredFilters) {
							for(k = 0; k < this.parameter.requiredFilters.length; k++) {
								var filterValue = {};
								filterValue.id = this.extendedDataResponse[i][this.parameter.requiredFilters[k]];
								filterValue.text = this.extendedDataResponse[i][this.displayNameLookup[this.parameter.requiredFilters[k]].VALUE];
								this.filterLookup[filterKeyText].push(filterValue);
							}
						}
					}
				}
			} else {
				var obj = {};
				for(k = 0; k < this.parameter.measures.length; k++) {
					obj[self.displayNameLookup[this.parameter.measures[k].fieldName].VALUE] = undefined;
				}
				for(j = 0; j < this.parameter.dimensions.length; j++) {
					obj[self.displayNameLookup[this.parameter.dimensions[j].fieldName].VALUE] = undefined;
				}
				this.extendedDataResponse.push(obj);
			}
		};
		var initDataset = function(bIsGroupTypeChart, oDataSetHelper) {
			var i, oFlattenDataSet, i, propDim, propMeas;
			for(i = 0; i < this.parameter.dimensions.length; i++) {
				this.parameter.dimensions[i].name = this.displayNameLookup[this.parameter.dimensions[i].fieldName].DISPLAY_NAME;
				this.parameter.dimensions[i].value = '{' + this.displayNameLookup[this.parameter.dimensions[i].fieldName].VALUE + '}';
				this.parameter.dimensions[i].displayValue = '{' + this.displayNameLookup[this.parameter.dimensions[i].fieldName].DISPLAY_VALUE + '}';
				this.parameter.dimensions[i].kind = this.parameter.dimensions[i].kind ? this.parameter.dimensions[i].kind : undefined;
			}
			self.measureAxisType = bIsGroupTypeChart;
			for(i = 0; i < this.parameter.measures.length; i++) {
				this.parameter.measures[i].name = this.displayNameLookup[this.parameter.measures[i].fieldName].DISPLAY_NAME;
				this.parameter.measures[i].value = '{' + this.displayNameLookup[this.parameter.measures[i].fieldName].VALUE + '}';
				this.parameter.measures[i].kind = this.parameter.measures[i].kind ? this.parameter.measures[i].kind : undefined;
			}
			var oParameter = {
				dimensions : this.parameter.dimensions,
				measures : this.parameter.measures
			};
			oFlattenDataSet = jQuery.extend(true, {}, oParameter);
			for(i = 0; i < oFlattenDataSet.dimensions.length; i++) {
				for(propDim in oFlattenDataSet.dimensions[i]) {
					if (((propDim !== 'name') && (propDim !== 'value') && (propDim !== 'dataType') && (propDim !== 'displayValue'))) {
						delete oFlattenDataSet.dimensions[i][propDim];
					}
				}
			}
			for(i = 0; i < oFlattenDataSet.measures.length; i++) {
				for(propMeas in oFlattenDataSet.measures[i]) {
					if (((propMeas !== 'name') && (propMeas !== 'value'))) {
						delete oFlattenDataSet.measures[i][propMeas];
					}
				}
			}
			oFlattenDataSet.data = {
				path : "/data"
			};
			if (this.metadata !== undefined) {
				for(i = 0; i < this.parameter.dimensions.length; i++) {
					var oMetaData = this.metadata.getPropertyMetadata(this.parameter.dimensions[i].fieldName);
					if (oMetaData.isCalendarYearMonth === "true") {
						if (this.parameter.dimensions.length > 1) {
							oFlattenDataSet.data.sorter = new sap.ui.model.Sorter(this.parameter.dimensions[0].fieldName, false);
						}
					}
				}
			}
			this.datasetObj = oFlattenDataSet;
		};
		var getHighlightPoints = function() {
			var reqFilterValues = [];
			reqFilterValues[0] = [];
			var i, j, k, l;
			for(i = 0; i < self.filterValues.length; i++) {
				reqFilterValues[0].push(self.filterValues[i][0]);
			}
			var newSelections = [];
			for(i = 0; i < self.extendedDataResponse.length; i++) {
				var dataRow = self.extendedDataResponse[i];
				for(j = 0; j < reqFilterValues[0].length; j++) {
					var counter = 0;
					for(k = 0; k < reqFilterValues.length; k++) {
						if (dataRow[self.parameter.requiredFilters[k]] === reqFilterValues[k][j]) {
							counter = counter + 1;
						}
					}
					if (counter === reqFilterValues.length) {
						var newSelObject = {
							data : {}
						};
						var displayFieldName;
						var valueFieldName;
						for(k = 0; k < self.parameter.dimensions.length; k++) {
							var dimensionDisplayFieldName = self.parameter.dimensions[k].name;
							var dimensionValueFieldName = self.fieldNameLookup[dimensionDisplayFieldName].VALUE;
							newSelObject.data[dimensionDisplayFieldName] = dataRow[dimensionValueFieldName];
						}
						if (!self.measureAxisType) {
							var measureDisplayFieldName;
							var measureValueFieldName;
							for(l = 0; l < self.parameter.measures.length; l++) {
								var newSelObjClone = jQuery.extend(true, {}, newSelObject);
								measureDisplayFieldName = self.parameter.measures[l].name;
								measureValueFieldName = self.fieldNameLookup[measureDisplayFieldName].VALUE;
								newSelObjClone.data[measureDisplayFieldName] = dataRow[measureValueFieldName] === null ? dataRow[measureValueFieldName] : parseFloat(dataRow[measureValueFieldName]);
								newSelections.push(newSelObjClone);
							}
						} else {
							for(k = 0; k < self.parameter.measures.length; k++) {
								displayFieldName = self.parameter.measures[k].name;
								valueFieldName = self.fieldNameLookup[displayFieldName].VALUE;
								newSelObject.data[displayFieldName] = dataRow[valueFieldName] === null ? dataRow[valueFieldName] : parseFloat(dataRow[valueFieldName]);
							}
							newSelections.push(newSelObject);
						}
					}
				}
			}
			return newSelections;
		};
		var validateSelections = function() {
			self.filterValues = self.filterValues.filter(function(filterTerm) {
				for(var i = 0; i < self.extendedDataResponse.length; i++) {
					var counter = 0;
					for(var j = 0; j < self.parameter.requiredFilters.length; j++) {
						if (filterTerm[j] === self.extendedDataResponse[i][self.parameter.requiredFilters[j]]) {
							counter = counter + 1;
						}
					}
					if (counter === self.parameter.requiredFilters.length) {
						return true;
					} else if (i === self.extendedDataResponse.length - 1) {
						return false;
					}
				}
			});
			self.cachedSelection = getHighlightPoints();
		};
		this.init = function(aDataResponse, metadata, bIsGroupTypeChart, oFormatter) {
			this.metadata = metadata;
			this.formatter = oFormatter;
			initFieldsKeyLookup.bind(this)(metadata, aDataResponse);
			initExtendedDataResponse.bind(this)(aDataResponse);
			initDataset.bind(this)(bIsGroupTypeChart);
			if (this.parameter.requiredFilters !== undefined && this.parameter.requiredFilters.length !== 0) {
				validateSelections();
			}
		};
		/*var initFieldsKeyLookup = function(metadata, aDataResponse) {
		                var fieldObjects = this.parameter.dimensions.concat(this.parameter.measures);
		                var aRequiredFilters = [];
		                var checkRequiredFilterPresent = function(requiredFilter) {//Function to determine whether the required filter is one of the dimensions or measures
		                                var counter = 0;
		                                for( var i = 0; i < fieldObjects.length; i++) {
		                                                if (fieldObjects[i].fieldName === requiredFilter) {
		                                                                counter++;
		                                                }
		                                }
		                                return (counter === 0 ? false : true);
		                };
		                if (this.parameter.requiredFilters) {
		                                this.parameter.requiredFilters.forEach(function(requiredFilter) {
		                                                if (!checkRequiredFilterPresent(requiredFilter)) {//If required filter not present in dimension or measure then it is pushed to field object
		                                                                var requiredFilterObject = {
		                                                                                fieldName : requiredFilter
		                                                                };
		                                                                aRequiredFilters.push(requiredFilterObject);
		                                                }0
		                                });
		                }
		                if (aRequiredFilters.length !== 0) {
		                                fieldObjects = fieldObjects.concat(aRequiredFilters);
		                }
		                for( var i = 0; i < fieldObjects.length; i++) {
		                                var fieldObject = fieldObjects[i];
		                                var fieldName = fieldObject.fieldName;
		                                this.displayNameLookup[fieldName] = {};
		                                if (metadata !== undefined) {
		                                                if (metadata.getPropertyMetadata(fieldName)["aggregation-role"] === "dimension") {
		                                                                this.displayNameLookup[fieldName].DISPLAY_NAME = metadata.getPropertyMetadata(fieldName).label || metadata.getPropertyMetadata(fieldName).name;
		                                                                this.displayNameLookup[fieldName].VALUE = "formatted_" + fieldName;
		                                                } else {
		                                                                this.displayNameLookup[fieldName].DISPLAY_NAME = metadata.getPropertyMetadata(fieldName).label || metadata.getPropertyMetadata(fieldName).name;
		                                                                this.displayNameLookup[fieldName].VALUE = fieldName;
		                                                }
		                                                if (fieldObject.fieldDesc !== undefined && oApi.getTextNotHtmlEncoded(fieldObject.fieldDesc).length) {
		                                                                this.displayNameLookup[fieldName].DISPLAY_NAME = oApi.getTextNotHtmlEncoded(fieldObject.fieldDesc);
		                                                }
		                                                if (metadata.getPropertyMetadata(fieldName).unit !== undefined) {
		                                                                var sUnitReference = metadata.getPropertyMetadata(fieldName).unit;
		                                                                var sUnitValue;
		                                                                if (aDataResponse !== undefined && aDataResponse.length !== 0) {
		                                                                                sUnitValue = aDataResponse[0][sUnitReference];
		                                                                                this.displayNameLookup[fieldName].DISPLAY_NAME = this.displayNameLookup[fieldName].DISPLAY_NAME + ' (' + sUnitValue + ')';
		                                                                }
		                                                }
		                                }
		                                this.fieldNameLookup[this.displayNameLookup[fieldName].DISPLAY_NAME] = {};
		                                this.fieldNameLookup[this.displayNameLookup[fieldName].DISPLAY_NAME].FIELD_NAME = fieldName;
		                                this.fieldNameLookup[this.displayNameLookup[fieldName].DISPLAY_NAME].VALUE = this.displayNameLookup[fieldName].VALUE;
		                }
		};*/
		/**
		 * @memberOf sap.apf.ui.representations.utils.UI5ChartHelper
		 * @method getDataset
		 * @description returns new flattended data set.
		 */
		this.getDataset = function() {
			return new sap.viz.ui5.data.FlattenedDataset(this.datasetObj);
		};
		/**
		 * @memberOf sap.apf.ui.representations.utils.UI5ChartHelper
		 * @method getModel
		 * @description returns json model with data set.
		 */
		this.getModel = function() {
			var obj = this.extendedDataResponse;
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				data : obj
			});
			return oModel;
		};
		/**
		 * @deprecated since version 1.27.0 and using getFilters API instead
		 * @memberOf sap.apf.ui.representations.utils.UI5ChartHelper
		 * @method getFilterCount
		 * @description returns the number of filters.
		 */
		this.getFilterCount = function() {
			return this.filterValues.length;
		};
		/**
		 * @memberOf sap.apf.ui.representations.utils.UI5ChartHelper
		 * @method getFilters
		 * @description returns the filter object id and text
		 */
		this.getFilters = function() {
			var filterLookupKeys = Object.keys(this.filterLookup);
			var aFilterValueObjects = [];
			var self = this;
			var filterLookup = function(filterId) { //Function to match filterValue id and filter lookup to get the text for the id
				for(var i = 0; i < filterLookupKeys.length; i++) {
					var filterValueObject = {};
					var key = filterLookupKeys[i];
					for(var j = 0; j < self.filterLookup[key].length; j++) {
						if (filterId === self.filterLookup[key][j].id) {
							filterValueObject.id = filterId;
							filterValueObject.text = self.filterLookup[key][j].text;
							aFilterValueObjects.push(filterValueObject);
							return; // Exit loops when a match is found
						}
					}
				}
			};
			for(var i = 0; i < this.filterValues.length; i++) {
				filterLookup(this.filterValues[i][0]);
			}
			return aFilterValueObjects;
		};
		/**
		 * @memberOf sap.apf.ui.representations.utils.UI5ChartHelper
		 * @method getSelectionFromFilter
		 * @description returns highlight points from currently selected filters.
		 */
		this.getSelectionFromFilter = function() {
			if (this.parameter.requiredFilters === undefined || this.parameter.requiredFilters.length === 0) {
				return [];
			}
			var highlightPoints = getHighlightPoints();
			return highlightPoints;
		};
		/**
		 * @memberOf sap.apf.ui.representations.utils.UI5ChartHelper
		 * @method getHighlightPointsFromSelectionEvent
		 * @description manage filters and returns highlight points from currently selected filters.
		 */
		//KLS The method description above describes the wrong function
		var getExclusiveSelections = function(allSelections, newSelection) {
			var j;
			var exclusiveSelections = allSelections.filter(function(selObj) {
				for(var i = 0; i < newSelection.length; i++) {
					var counter = 0;
					for(j = 0; j < Object.keys(selObj.data).length; j++) {
						if (newSelection[i].data[Object.keys(selObj.data)[j]] === selObj.data[Object.keys(selObj.data)[j]]) {
							counter = counter + 1;
						} else {
							break;
						}
					}
					if (counter === Object.keys(selObj.data).length) {
						return false;
					} else if (j === Object.keys(selObj.data).length) {
						return true;
					}
				}
				return true;
			});
			return exclusiveSelections;
		};
		this.getHighlightPointsFromSelectionEvent = function(allSelections) {
			var selections = [];
			var newSelections = [];
			selections = getExclusiveSelections(allSelections, this.cachedSelection);
			for(var i = 0; i < selections.length; i++) {
				var selObj = selections[i];
				if (this.parameter.measures.length === 1) {
					var measureDisplayName = this.displayNameLookup[this.parameter.measures[0].fieldName].DISPLAY_NAME;
					if (selObj.data[measureDisplayName] === undefined || selObj.data[measureDisplayName] === null) {
						continue; // null selection scenario encountered when a series has missing data. (StackedColumn, % StackedColumn etc.)
					}
				}
				var filterKeyText = "";
				for(var j = 0; j < this.parameter.dimensions.length; j++) {
					var dimensionDisplayName = this.displayNameLookup[this.parameter.dimensions[j].fieldName].DISPLAY_NAME;
					filterKeyText = filterKeyText + selObj.data[dimensionDisplayName];
				}
				var filterTermArray = this.filterLookup[filterKeyText];
				var resultArray = this.filterValues.filter(function(existingTerm) {
					var counter = 0;
					for(var i = 0; i < self.parameter.requiredFilters.length; i++) {
						if (existingTerm[i] === filterTermArray[i].id) {
							counter = counter + 1;
						} else {
							break;
						}
					}
					if (counter === self.parameter.requiredFilters.length) {
						return true;
					} else if (i === self.parameter.requiredFilters.length) {
						return false;
					}
				});
				if (resultArray.length === 0) {
					var aModifiedFilterTermArray = filterTermArray.map(function(oTerm) {
						return oTerm.id;
					});
					this.filterValues.push(aModifiedFilterTermArray);
				}
			}
			newSelections = getHighlightPoints();
			this.cachedSelection = newSelections;
			return newSelections;
		};
		/**
		 * @memberOf sap.apf.ui.representations.utils.UI5ChartHelper
		 * @method getFilterFromSelection
		 * @param - aNewFilter - filters which are coming from alternate representation
		 * @description returns filter objects from current selections.
		 * Also updates the filter which are coming from alternate representation
		 */
		this.getFilterFromSelection = function(aNewFilter) {
			var conversionRequired = false;
			var reqFilterValues = [];
			var aFilterValues = self.filterValues.map(function(filterValue) {
				return filterValue[0];
			});
			if (aNewFilter && aNewFilter.length > 0) {
				aFilterValues = aNewFilter.concat(aFilterValues);
			}
			var aUniqueFilterValues = jQuery.unique(aFilterValues);
			self.filterValues = [];
			aUniqueFilterValues.forEach(function(filter) {
				self.filterValues.push([ filter ]);
				reqFilterValues.push(filter);
			});
			var oFilter = oApi.createFilter();
			var EQ = oFilter.getOperators().EQ;
			var oFilterExpression;
			var oAddedOrCondition = oFilter.getTopAnd().addOr('exprssionOr');
			var index, value;
			conversionRequired = conversionToDateRequired(self.parameter.requiredFilters[0], this.metadata);
			for(index = 0; index < reqFilterValues.length; index++) {
				if (this.metadata) {
					var dataType = this.metadata.getPropertyMetadata(self.parameter.requiredFilters[0]).dataType.type;
					if (dataType === "Edm.Int32") {
						reqFilterValues[index] = reqFilterValues[index] === null ? reqFilterValues[index] : parseFloat(reqFilterValues[index]);
					}
				}
				if (conversionRequired) {
					value = this.convertedDates[reqFilterValues[index]] || reqFilterValues[index];
				} else {
					value = reqFilterValues[index];
				}
				
				oFilterExpression = {
					id : reqFilterValues[index],
					name : self.parameter.requiredFilters[0],
					operator : EQ,
					value : value
				};
				oAddedOrCondition.addExpression(oFilterExpression);
			}
			return oFilter;
		};
		/**
		 * @memberOf sap.apf.ui.representations.utils.UI5ChartHelper
		 * @method getHighlightPointsFromDeselectionEvent
		 * @description manage filters and returns highlight points from current selection.
		 */
		this.getHighlightPointsFromDeselectionEvent = function(currentSelection) {
			var i, j;
			var deselectedObjs = getExclusiveSelections(this.cachedSelection, currentSelection);
			for(i = 0; i < deselectedObjs.length; i++) {
				var deselObj = deselectedObjs[i];
				var filterKeyText = "";
				for(j = 0; j < this.parameter.dimensions.length; j++) {
					var dimensionDisplayName = this.displayNameLookup[this.parameter.dimensions[j].fieldName].DISPLAY_NAME;
					filterKeyText = filterKeyText + deselObj.data[dimensionDisplayName];
				}
				var filterTermArray = this.filterLookup[filterKeyText];
				this.filterValues = this.filterValues.filter(function(currentFilter, index) {
					var counter = 0;
					for(var i = 0; i < filterTermArray.length; i++) {
						if (filterTermArray[i].id === currentFilter[i]) {
							counter = counter + 1;
						}
					}
					if (counter === filterTermArray.length) {
						return false;
					}
					//else {
					return true;
					//}
				});
			}
			var newSelections = getHighlightPoints();
			this.cachedSelection = newSelections;
			return newSelections;
		};
		/**
		 * @memberOf sap.apf.ui.representations.utils.UI5ChartHelper
		 * @method destroy
		 * @description Destroys instances
		 */
		this.destroy = function() {
			if (self.formatter) {
				self.formatter = null;
			}
			self.metadata = null;
			self.extendedDataResponse = null;
		};
	};
}());