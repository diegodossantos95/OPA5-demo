sap.ui.define(["sap/suite/ui/microchart/InteractiveLineChart",
	"sap/suite/ui/microchart/InteractiveLineChartPoint",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/FilterItemMicroChart",
	"sap/suite/ui/generic/template/AnalyticalListPage/util/CriticalityUtil",
	"sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil"],
	function(InteractiveLineChart, InteractiveLineChartPoint, JSONModel, FilterItemMicroChart, CriticalityUtil, FilterUtil) {
	"use strict";

	/* all visual filters should extend this class */
	var FilterItemMicroLine = FilterItemMicroChart.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroLine", {
		metadata: {
			properties: {
				labelWidthPercent: { type: "float", group: "Misc", defaultValue: 1 / 3 },
				fixedCount: {type: "int", defaultValue: 6}
			},
			aggregations: {
				control: {type: "sap.suite.ui.microchart.InteractiveLineChart", multiple : false}
			}
		},
		renderer:{}
	});

	FilterItemMicroLine.prototype.init = function() {
		this._chart = new sap.suite.ui.microchart.InteractiveLineChart({
			maxDisplayedPoints : 6,
			selectionEnabled : true,
			points : []
		});
		this.setControl(this._chart);
		this.setModel(new JSONModel(), '__alp_chartJSONModel');
		this._sorters = [];
		FilterItemMicroChart.prototype.init.apply(this, arguments);
	};

	FilterItemMicroLine.prototype._updateBinding = function() {
		this.applyOverlay();
		//To show the Busy Indicator immediately,
		//so that blank screen/chart is not shown
		this._chart.setBusyIndicatorDelay(0);
		// Set Chart to busy before rebinding
		this._chart.setBusy(true);
		this._chart.unbindPoints();
		// Make sure all binding are available
		var entityName = this.getEntitySet(),
		dimField = this.getDimensionField(),
		dimFieldDisplay = this.getDimensionFieldDisplay(),
		measureField = this.getMeasureField(),
		unitField = this.getUnitField(),
		filter = this.getDimensionFilterExternal(),
		aSortFields = [],
		aSortOrder = this.getSortOrder(),
		oSortObject = FilterItemMicroChart._getSorter(aSortOrder);
		this._sorters = oSortObject.sorter;
		aSortFields = oSortObject.sortFields;

		if (!entityName || !measureField || !dimField || !dimFieldDisplay) {// All fields must be present
			return;
		}

		// Collect the select fields, so that duplicates can be removed
		var selectFields = [measureField, dimField, aSortFields];

		if (dimField != dimFieldDisplay) {
			selectFields.push(dimFieldDisplay);
		}

		if (unitField) {
			selectFields.push(unitField);
		}

		var filterList = [];
		if (filter && filter.aFilters && filter.aFilters.length > 0) {
			filterList = [filter];
		}

		var me = this;
		var count = this.getFixedCount();

		var oModel = this.getModel();
		var sBindingPath = "/" + entityName;

		// odata call to get top 4 data
		if (oModel) {
			var oDatapoint = CriticalityUtil.getDataPoint(oModel, this);
			if (oDatapoint) {
				(oDatapoint.ValueFormat && oDatapoint.ValueFormat.ScaleFactor) ? this.setScaleFactor(FilterUtil.getPrimitiveValue(oDatapoint.ValueFormat.ScaleFactor)) : this.setScaleFactor(null);
				(oDatapoint.ValueFormat && oDatapoint.ValueFormat.NumberOfFractionalDigits) ? this.setNumberOfFractionalDigits(FilterUtil.getPrimitiveValue(oDatapoint.ValueFormat.NumberOfFractionalDigits)) : this.setNumberOfFractionalDigits(null);
				var aRelativeToProperties = CriticalityUtil.getCriticalityRefProperties(oDatapoint);
			}
			if (this.getSmartFilterId()) {//If it has reference to SmartFilterBar
				var oSmartFilterBar = sap.ui.getCore().byId(this.getSmartFilterId());
				if (oSmartFilterBar && oSmartFilterBar.getEntitySet() === entityName) {
					var oTemplatePrivate = this.getModel("_templPriv"),
					bIsSearchable = oTemplatePrivate.getProperty('/alp/searchable');
					if (bIsSearchable) {
						if (oSmartFilterBar && oSmartFilterBar.getAnalyticBindingPath && oSmartFilterBar.getConsiderAnalyticalParameters()) {
							try {
								var sAnalyticalPath = oSmartFilterBar.getAnalyticBindingPath();
								if (sAnalyticalPath) {
									sBindingPath = sAnalyticalPath;
								}
							} catch (e) {
								jQuery.sap.log.warning("Mandatory parameters have no values", "", "AnalyticalListPage");
							}
						}
					} else {
						this.applyOverlay(this.requiredFilterMessage);
						return;
					}
				}
			}
			oModel.read(sBindingPath, {
				async: true,
				filters: filterList,
				sorters: this._sorters,
				urlParameters: {
					"$select": aRelativeToProperties ? [aRelativeToProperties].concat(selectFields).join(",") : selectFields.join(","),
					"$top": count
				},
				success: function(data, response) {
					data = oDatapoint ? CriticalityUtil.CalculateCriticality(oDatapoint, data, me.getMeasureField()) : data;
					me._onDataReceived(data);
				},
				error: function(error) {
					jQuery.sap.log.error("Error reading URL:" + error);
					me.applyOverlay(me.technicalIssueMessage);
				}
			});
		}
	};

	FilterItemMicroLine.prototype._onDataReceived = function(data) {
		if (!data || !data.results || !data.results.length) {
			this.applyOverlay(this.noDataIssueMessage);
			return;
		}

		var aData = this.getDimensionFieldIsDateTime() ? data.results.slice().reverse() : data.results;
		FilterItemMicroChart.prototype._onDataReceived.call(this, data.results);
		this.getModel('__alp_chartJSONModel').setData(aData);
		this._chart.setModel(this.getModel('__alp_chartJSONModel'));

		var count = this.getFixedCount(),
			dataBinding = {
			path: '/',
			template: new InteractiveLineChartPoint(this._getChartAggregationSettings()),
			startIndex: 0,
			length: count
		};

		this._chart.bindPoints(dataBinding);
		this._chart.setBusy(false);
	};
	return FilterItemMicroLine;

}, /* bExport= */ true);
