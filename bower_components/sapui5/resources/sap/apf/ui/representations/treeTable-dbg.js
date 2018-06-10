/* SAP APF Analysis Path Framework
* 
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare("sap.apf.ui.representations.treeTable");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.apf.ui.utils.formatter");
jQuery.sap.require("sap.apf.modeler.ui.utils.constants");
jQuery.sap.require("sap.apf.ui.representations.BaseUI5ChartRepresentation");
jQuery.sap.require("sap.ui.table.TreeTable");
(function() {
	'use strict';
	function getSelectionMode(aRequiredFilter, metadata) {
		if (aRequiredFilter && aRequiredFilter.length > 0) {
			if (metadata.getPropertyMetadata(aRequiredFilter[0])["filter-restriction"] === "single-value") {
				return sap.ui.table.SelectionMode.Single;
			}
			return sap.ui.table.SelectionMode.MultiToggle;
		}
		return sap.ui.table.SelectionMode.None;
	}
	function _createTreeTableAndBindColumns(aTreeTableColumns, oStepTitle, oTreeTableInstance) {
		var oTreeTable;
		var oFormatter = new sap.apf.ui.utils.formatter({ // formatter for the value formatting
			getEventCallback : oTreeTableInstance.oApi.getEventCallback.bind(oTreeTableInstance.oApi),
			getTextNotHtmlEncoded : oTreeTableInstance.oApi.getTextNotHtmlEncoded,
			getExits : oTreeTableInstance.oApi.getExits()
		}, oTreeTableInstance.metadata, oTreeTableInstance.aDataResponse);
		var formatCellValue = function(columnValueToBeFormatted) {
			return function(columnValue) {
				if (oTreeTableInstance.metadata !== undefined) {
					var formatedColumnValue;
					if (columnValue) {
						formatedColumnValue = oFormatter.getFormattedValue(columnValueToBeFormatted, columnValue);
						if (formatedColumnValue !== undefined) {
							return formatedColumnValue;
						}
					}
				}
				return columnValue;
			};
		};
		oTreeTable = new sap.ui.table.TreeTable({ // Creating tree table
			showNoData : false,
			title : oStepTitle,
			enableSelectAll : false
		});
		var aRequiredFilter = oTreeTableInstance.oParameters.requiredFilters;
		oTreeTable.setSelectionMode(getSelectionMode(aRequiredFilter, oTreeTableInstance.metadata));
		var aColumnForTreeTable = [], oColumnText, oTreeColumn;
		aTreeTableColumns.name.forEach(function(columnName, nColumnIndex) {
			oColumnText = new sap.m.Text().bindText(aTreeTableColumns.value[nColumnIndex], formatCellValue(aTreeTableColumns.value[nColumnIndex]), sap.ui.model.BindingMode.OneWay);
			oTreeColumn = new sap.ui.table.Column({
				label : new sap.m.Label({
					text : columnName
				}),
				template : oColumnText,
				tooltip : columnName
			});
			aColumnForTreeTable.push(oTreeColumn);
		});
		aColumnForTreeTable.forEach(function(column) { //Adding all columns to tree table.
			oTreeTable.addColumn(column);
		});
		oTreeTableInstance.oTreeTableModel.attachBatchRequestCompleted(function() { //Once the batch request is completed, busy indicator is set to false
			if (oTreeTableInstance.oApi.getUiApi().getLayoutView().getController() && oTreeTableInstance.oApi.getUiApi().getLayoutView().getController().byId("stepContainer")) {
				oTreeTableInstance.oApi.getUiApi().getLayoutView().getController().byId("stepContainer").getContent()[0].byId("idStepLayout").setBusy(false);
			}
			_setVisibleRowCountInTreeTable(oTreeTable);
			_alignMeasureColumn(oTreeTableInstance, oTreeTable, aTreeTableColumns);
			if (oTreeTableInstance.UI5ChartHelper.filterValues.length > 0) {
				_markSelectionInTree(oTreeTableInstance);
			} else {
				oTreeTableInstance.oTreeTable.clearSelection();
			}
		});
		oTreeTableInstance.oTreeTableModel.attachBatchRequestSent(function(oEvent) {
			oTreeTableInstance.oApi.getUiApi().getLayoutView().getController().byId("stepContainer").getContent()[0].byId("idStepLayout").setBusy(true);
		});
		oTreeTable.setModel(oTreeTableInstance.oTreeTableModel); // set model to tree table
		oTreeTable.bindRows(oTreeTableInstance.oTreeTableControlObject);
		return oTreeTable;
	}
	function _markSelectionInTree(oTreeTableInstance) {
		var aTreetableRows = oTreeTableInstance.oTreeTable.getRows();
		oTreeTableInstance.oTreeTable.clearSelection();
		setTimeout(function() {
			aTreetableRows.forEach(function(row, index) {
				var bindingContext = row.getBindingContext();
				if (bindingContext) {
					var sRequiredFilterAvailable = bindingContext.getProperty(oTreeTableInstance.oParameters.requiredFilters[0]);
					oTreeTableInstance.UI5ChartHelper.filterValues.forEach(function(filter) {
						if (sRequiredFilterAvailable === filter[0]) {
							oTreeTableInstance.oTreeTable.addSelectionInterval(index, index);
						}
					});
				}
			});
		}, 1);
	}
	function _alignMeasureColumn(oTreeTableInstance, oTreeTable, aTreeTableColumns) {
		if (oTreeTableInstance.metadata !== undefined) {
			for(var fieldIndex = 0; fieldIndex < aTreeTableColumns.name.length; fieldIndex++) {
				var oMetadata = oTreeTableInstance.metadata.getPropertyMetadata(aTreeTableColumns.value[fieldIndex]);
				if (oMetadata["aggregation-role"] === "measure") {
					var measureCol = oTreeTable.getColumns()[fieldIndex];
					measureCol.setHAlign(sap.ui.core.HorizontalAlign.End);
				}
			}
		}
	}
	function _selectRowInTreeTable(oEvent) { //mark the selection in tree table and update the filter values
		var isUserInteraction = oEvent.getParameter("userInteraction");
		var currentSelectedItemIndex = oEvent.getParameter("rowIndex"); // store the current selected item for which selection event is triggered
		if (!isUserInteraction || currentSelectedItemIndex === undefined || currentSelectedItemIndex === null) {
			return;
		}
		var aRequiredFilterProperty = this.oParameters.requiredFilters && (this.oParameters.requiredFilters.length > 0) ? this.oParameters.requiredFilters[0] : undefined;
		_updateFiltersInTreetable(this, aRequiredFilterProperty, currentSelectedItemIndex);
	}
	function _updateFiltersInTreetable(oTreetableInstance, sRequiredFilter, currentSelectedItemIndex) {
		var sCurrentModifiedFilter = oTreetableInstance.oTreeTable.getContextByIndex(currentSelectedItemIndex).getProperty(sRequiredFilter);
		var sSelectionMode = oTreetableInstance.oTreeTable.getSelectionMode();
		var bIsSelected = oTreetableInstance.oTreeTable.isIndexSelected(currentSelectedItemIndex);
		var aUI5ChartHeleprFilterValues = oTreetableInstance.UI5ChartHelper.filterValues.map(function(filterValue) {
			return filterValue[0];
		});
		if (bIsSelected) {
			aUI5ChartHeleprFilterValues = _updateFilterOnSelection(oTreetableInstance, sSelectionMode, sCurrentModifiedFilter, aUI5ChartHeleprFilterValues);
		} else {
			aUI5ChartHeleprFilterValues = _updateFilterOnDeselection(oTreetableInstance, sSelectionMode, sCurrentModifiedFilter, aUI5ChartHeleprFilterValues);
		}
		_updateUI5Filters(oTreetableInstance, aUI5ChartHeleprFilterValues);
		oTreetableInstance.oApi.selectionChanged();
	}
	function _clearFilters(oTreetableInstance) {
		oTreetableInstance.UI5ChartHelper.filterValues = [];
	}
	function _updateFilterOnSelection(oTreetableInstance, sSelectionMode, sCurrentModifiedFilter, aUI5ChartHeleprFilterValues) {
		if (sSelectionMode === sap.ui.table.SelectionMode.Single) {
			aUI5ChartHeleprFilterValues = [ sCurrentModifiedFilter ];
		} else {
			aUI5ChartHeleprFilterValues.push(sCurrentModifiedFilter);
		}
		return jQuery.unique(aUI5ChartHeleprFilterValues);
	}
	function _updateFilterOnDeselection(oTreetableInstance, sSelectionMode, sCurrentModifiedFilter, aUI5ChartHeleprFilterValues) {
		if (sSelectionMode === sap.ui.table.SelectionMode.Single) {
			aUI5ChartHeleprFilterValues = [];
		} else {
			var indexOfDeselectedItem = aUI5ChartHeleprFilterValues.indexOf(sCurrentModifiedFilter);// if item is deselected, find the index of item and remove it from array
			if (indexOfDeselectedItem !== -1) {
				aUI5ChartHeleprFilterValues.splice(indexOfDeselectedItem, 1);
			}
		}
		return aUI5ChartHeleprFilterValues;
	}
	function _updateUI5Filters(oTreetableInstance, aUI5ChartHeleprFilterValues) {
		_clearFilters(oTreetableInstance);
		aUI5ChartHeleprFilterValues.forEach(function(value) {
			oTreetableInstance.UI5ChartHelper.filterValues.push([ value ]);
		});
	}
	function _setVisibleRowCountInTreeTable(oTreeTable) { //set visible rows count in tree table according to the height available
		var totalHeightForTreeTable;
		if (jQuery('.chartContainer').height()) {
			totalHeightForTreeTable = jQuery('.chartContainer').height() - (jQuery(".chartContainer > div :first-child").height() + 120);
		}
		var oVisibleRowCount = (totalHeightForTreeTable > 0) ? totalHeightForTreeTable / 32 : 15;
		var nVisibleRow = Math.floor(oVisibleRowCount);
		oTreeTable.setVisibleRowCount(nVisibleRow + 1);
	}
	function _adjustTreeTableHeightAndVisibleRow(oContainer, oTreeTableInstance) {
		var scrollContainerHeight;
		var treetableOffeset = jQuery('.treeTableRepresentation').offset().top;
		var oStepContainerContent = oTreeTableInstance.oApi.getUiApi().getStepContainer();
		if (oStepContainerContent && oStepContainerContent.getContent()[0] && oStepContainerContent.getContent()[0].getContent()[0].getFullScreen()) {
			scrollContainerHeight = ((window.innerHeight - (treetableOffeset + 80))) + "px";
		} else {
			scrollContainerHeight = ((window.innerHeight - treetableOffeset) - (jQuery(".applicationFooter").height() + jQuery(".subHeader").height() + 80)) + "px";
		}
		document.querySelector('.treeTableRepresentation').style.cssText += "height : " + scrollContainerHeight;
	}
	/**
	* @description creates the column structure for the table which has the name and value. Also appends the unit of the column in the header of the table.
	* returns oColumnData - oColumnData has name and value of each column which has to be formed in the table.
	*                 e.g. oColumnData = {
	*                                      name : ["column1","column2"],
	*                                      value :["value1","value2"] 
	*                                     }
	*/
	function _getColumnFromProperties(oTreeTableInstance) {
		var oColumnData = {
			name : [],
			value : []
		};
		var aPropertiesForTreeTableColumns = oTreeTableInstance.oParameters.hierarchicalProperty.concat(oTreeTableInstance.oParameters.properties);
		aPropertiesForTreeTableColumns.forEach(function(property, index) {
			var fieldName = property.fieldName;
			var defaultLabel = oTreeTableInstance.metadata.getPropertyMetadata(fieldName).label || oTreeTableInstance.metadata.getPropertyMetadata(fieldName).name;// read the label of the property 
			if (property.kind === sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes.HIERARCHIALCOLUMN) {
				if (property.labelDisplayOption === "text") {
					fieldName = oTreeTableInstance.metadata.getPropertyMetadata(oTreeTableInstance.oTreeTableControlObject.parameters.treeAnnotationProperties.hierarchyNodeFor).text;
				} else {
					fieldName = oTreeTableInstance.oTreeTableControlObject.parameters.treeAnnotationProperties.hierarchyNodeExternalKeyFor;
				}
			}
			oColumnData.name[index] = property.fieldDesc === undefined || !oTreeTableInstance.oApi.getTextNotHtmlEncoded(property.fieldDesc).length ? defaultLabel : oTreeTableInstance.oApi.getTextNotHtmlEncoded(property.fieldDesc);
			oColumnData.value[index] = fieldName;
		});
		return oColumnData;
	}
	/**
	* @class treetTable constructor.
	* @param oApi,oParameters
	* defines parameters required for chart such as Dimension/Measures.
	* @returns treeTable object
	*/
	sap.apf.ui.representations.treeTable = function(oApi, oParameters) {
		this.oParameters = oParameters;
		this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.TREE_TABLE_REPRESENTATION;
		sap.apf.ui.representations.BaseUI5ChartRepresentation.apply(this, [ oApi, oParameters ]);
	};
	sap.apf.ui.representations.treeTable.prototype = Object.create(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype);
	sap.apf.ui.representations.treeTable.prototype.constructor = sap.apf.ui.representations.treeTable; // Set the constructor property to refer to tree table
	/**
	* @method getMainContent
	* @param oStepTitle - title of the main chart 
	* @param isTreeTableWindowResized - boolean value for window resize
	* @description draws Main chart into the Chart area
	*/
	sap.apf.ui.representations.treeTable.prototype.getMainContent = function(oStepTitle, isTreeTableWindowResized) {
		var oTreeTableInstance = this, containerForTreeTable;
		if (!isTreeTableWindowResized) {
			var aTreeTableColumns = _getColumnFromProperties(this);
			if (!this.oTreeTable) {
				this.oTreeTable = _createTreeTableAndBindColumns(aTreeTableColumns, oStepTitle, this);
				this.oTreeTable.addEventDelegate({
					onAfterRendering : function() {
						if (oTreeTableInstance.oParameters) {
							_adjustTreeTableHeightAndVisibleRow(containerForTreeTable, oTreeTableInstance);
							_setVisibleRowCountInTreeTable(oTreeTableInstance.oTreeTable);
							if (oTreeTableInstance.UI5ChartHelper.filterValues.length > 0) {
								_markSelectionInTree(oTreeTableInstance);
							} else {
								oTreeTableInstance.oTreeTable.clearSelection();
							}
						}
					}
				});
				this.oTreeTable.attachRowSelectionChange(_selectRowInTreeTable.bind(this));
			}
		}
		containerForTreeTable = new sap.m.ScrollContainer({ // Scroll container to hold tree table
			content : [ oTreeTableInstance.oTreeTable ],
			horizontal : false
		}).addStyleClass("treeTableRepresentation");
		containerForTreeTable.addStyleClass("sapUiSizeCompact");
		return containerForTreeTable;
	};
	sap.apf.ui.representations.treeTable.prototype.getSelections = function() {
		var oSelectionItem = [];
		this.UI5ChartHelper.filterValues.forEach(function(selection) {
			oSelectionItem.push({
				id : selection[0],
				text : selection[0]
			});
		});
		return oSelectionItem;
	};
	/**
	* @method removeAllSelection
	* @description removes all Selection from tree table
	*/
	sap.apf.ui.representations.treeTable.prototype.removeAllSelection = function() {
		this.UI5ChartHelper.filterValues = [];
		this.oTreeTable.clearSelection();
		this.oApi.selectionChanged();
	};
	/**
	* @method getFilter
	* @description Returns the filter from the selection
	* @returns {sap.apf.utils.Filter} Filter
	*/
	sap.apf.ui.representations.treeTable.prototype.getFilter = function() {
		var filter = this.oApi.createFilter();
		var oAddedOrCondition = filter.getTopAnd().addOr('exprssionOr');
		this.UI5ChartHelper.filterValues.forEach(function(filterValue) {
			var oFilterExpression = {
				id : filterValue,
				name : this.oParameters.requiredFilters[0],
				operator : "EQ",
				value : filterValue[0]
			};
			oAddedOrCondition.addExpression(oFilterExpression);
		}.bind(this));
		return filter;
	};
	/**
	* @method setFilterValues
	* @description Sets Filter values from the selection validation request
	* @param {String []} aValues - FilterValues
	*/
	sap.apf.ui.representations.treeTable.prototype.setFilterValues = function(aValues) {
		var oTreetableInstance = this;
		oTreetableInstance.UI5ChartHelper.filterValues = [];
		aValues.forEach(function(value) {
			oTreetableInstance.UI5ChartHelper.filterValues.push([ value ]);
		});
	};
	/**
	* @method updateTreetable
	* @param controlObject - object for the tree table 
	* @param oModel - model for tree table
	* @param _bindTreeFunction - call back function to bind the properties of tree table
	* @param oMetaData -  metadata for tree table
	* @description updates the current tree table with updated control properties and model
	*/
	sap.apf.ui.representations.treeTable.prototype.updateTreetable = function(controlObject, oModel, oMetaData, bFilterChanged) {
		this.oTreeTableModel = oModel;
		this.oTreeTableControlObject = controlObject;
		this.metadata = oMetaData;
		if (this.oTreeTable && bFilterChanged) {
			this.oTreeTable.bindRows(this.oTreeTableControlObject);
		}
	};
	/**
	* @method getThumbnailContent
	* @description draws Thumbnail for the current chart
	* @returns thumbnail object for column
	*/
	sap.apf.ui.representations.treeTable.prototype.getThumbnailContent = function() {
		var oThumbnailContent;
		var oTableIcon = new sap.ui.core.Icon({
			src : "sap-icon://tree",
			size : "70px"
		}).addStyleClass('thumbnailTableImage');
		oThumbnailContent = oTableIcon;
		return oThumbnailContent;
	};
	/**
	* @method getPrintContent
	* @param oStepTitle - title of the step
	* @description gets the printable content of the representation
	*/
	sap.apf.ui.representations.treeTable.prototype.getPrintContent = function(oStepTitle) {
		var oTreeTableForPrint = this.oTreeTable.clone();
		var oPrintObject = {
			oRepresentation : oTreeTableForPrint
		};
		return oPrintObject;
	};
	/**
	* @method destroy
	* @description Destroying instance level variables
	*/
	sap.apf.ui.representations.treeTable.prototype.destroy = function() {
		if (this.oParameters) {
			this.oParameters = null;
		}
		if (this.oTreeTableModel) {
			this.oTreeTableModel = null;
		}
		if (this.oTreeTableControlObject) {
			this.oTreeTableControlObject = null;
		}
		if (this.metadata) {
			this.metadata = null;
		}
		if (this.UI5ChartHelper) {
			this.UI5ChartHelper.filterValues = [];
			this.UI5ChartHelper.destroy();
			this.UI5ChartHelper = null;
		}
	};
}());