sap.ui.define(["jquery.sap.global", "sap/ui/base/Object"],
	function(jQuery, BaseObject) {
		"use strict";

		/*
		 * This class is a helper class for the controller of the ListReport. More, precisely an instance of
		 * this class is created in onInit of the ListReport controller. That controller forwards all tasks
		 * connected to the smart chart to this instance.
		 */

		function getMethods(oState, oController, oTemplateUtils) {

			function onSmartChartInit() {

				var idx, i, sTabKey, sTableOrChartId, oCurrentControl;
				var oAppComponent = oController.getOwnerComponent().getAppComponent();
				var oConfig = oAppComponent.getConfig();

				if (oConfig && oConfig.pages[0] && oConfig.pages[0].component && oConfig.pages[0].component.settings && oConfig.pages[0].component.settings._quickVariantSelectionX && 
						oConfig.pages[0].component.settings._quickVariantSelectionX.variants) {
					oState.oTableTabData = {
							aTableIsDirty: {},
							oCurrentBindingParams: {} // to send the correct $count requests, we need to access the current binding parameters
						};

					oState.oIconTabBar = oController.byId("template::IconTabBar");
					if (oConfig.pages[0].component.settings._quickVariantSelectionX.showCounts) {
						var aItems = oState.oIconTabBar.getItems();
						for (idx in aItems) {
							fnSetCount(aItems, idx, 0); // initially, set all counts to 0
						}
					}
					oState.aSmartTablesCharts = {};
					for (i in oConfig.pages[0].component.settings._quickVariantSelectionX.variants) {
						sTabKey = sap.suite.ui.generic.template.js.AnnotationHelper.getIconTabFilterKey(oConfig.pages[0].component.settings._quickVariantSelectionX.variants[i]);
						sTableOrChartId = sap.suite.ui.generic.template.js.AnnotationHelper.getSmartTableId(oConfig.pages[0].component.settings._quickVariantSelectionX.variants[i]);
						oState.aSmartTablesCharts[sTabKey] = oController.byId(sTableOrChartId);
						if (!oState.oSmartTable) { // later rename oSmartTable as it can be both chart and table
							oState.oSmartTable = oState.aSmartTablesCharts[sTabKey]; // the first table is the default table that is initially visible
						} else {
							oState.aSmartTablesCharts[sTabKey].setVisible(false);
						}
						oState.oTableTabData.aTableIsDirty[oState.aSmartTablesCharts[sTabKey].getId()] = false;
					}

					// Attach to “Search” event on SmartFilterBar (in init of the view controller)
					oState.oSmartFilterbar.attachSearch(function(oEvent) {
						oCurrentControl = oState.oSmartTable;
						if (oCurrentControl instanceof sap.ui.comp.smartchart.SmartChart) {
							oCurrentControl.rebindChart(oEvent);
						} else if (oCurrentControl instanceof sap.ui.comp.smarttable.SmartTable) {
							oCurrentControl._reBindTable(oEvent);
						}
						if (oConfig.pages[0].component.settings._quickVariantSelectionX.showCounts) {
							fnUpdateTableTabCounts();
						}
						for (i in oState.oTableTabData.aTableIsDirty) {
							oState.oTableTabData.aTableIsDirty[i] = true;
						}
						oState.oTableTabData.aTableIsDirty[oState.oSmartTable.getId()] = false;
						oState.oTableTabData.searchButtonPressed = true;


					});
					if (oConfig.pages[0].component.settings._quickVariantSelectionX.enableAutobinding) {
						oState.oSmartFilterbar.search(); //trigger enableAutobinding without getting a cancelled batch request 
					}
				}
			}

			function onChartSelectData(oEvent) {
				var oChart = oEvent.getSource();
				var oSmartChart = oChart.getParent();
				oState.fnUpdateTableOnSelectionChange(oSmartChart);
			}

			//replace it later with the existing function in Controller 
			function fnSetCount(aFilterTabs, index, oData) {
				aFilterTabs[index].setCount(oData);
			}

			//replace it later with the existing function in Controller
			function fnUpdateTableTabCounts() {
				var iTabIdx, i, sTableEntitySet;
				var oModel = oState.oSmartTable.getModel();
				var oIconTabBar = oController.byId("template::IconTabBar");
				var aFilterTabs = oIconTabBar.getItems();

				for (iTabIdx in aFilterTabs) {
					var aFilters = [];
					var oTmpTable = oController.byId("listReport-" + aFilterTabs[iTabIdx].getKey());
					var aSelectionVariantFilters = oTemplateUtils.oCommonUtils.getSelectionVariantFilters(oTmpTable);
					for (i in oState.oTableTabData.oCurrentBindingParams.filters) {
						aFilters.push(oState.oTableTabData.oCurrentBindingParams.filters[i]); // copy array content to prevent call by reference
					}
					for (i in aSelectionVariantFilters) {
						aFilters.push(aSelectionVariantFilters[i]);
					}
					sTableEntitySet = oTmpTable.getEntitySet();
					oModel.read("/" + sTableEntitySet + "/$count", {
						urlParameters: oState.oTableTabData.oCurrentBindingParams.parameters.select, // not needed, but for improving performance?
						filters: aFilters,
						groupId: "updateTabCounts",
						success: fnSetCount.bind(null, aFilterTabs, iTabIdx),
						error: function(oData, oResponse) {
							// clarify: how to indicate/handle errors?
						}
					});
				}
			}

			function onDetailsActionPress(oEvent) {
				var oEventSource = oEvent.getSource();
				var oBindingContext = oEvent.getParameter("itemContexts") && oEvent.getParameter("itemContexts")[0];
				oState.oTemplateUtils.oCommonEventHandlers.onListNavigate(oEventSource, oState, oBindingContext);
			}

			// public instance methods
			return {
				onSmartChartInit: onSmartChartInit,
				onChartSelectData: onChartSelectData,
				onDetailsActionPress: onDetailsActionPress
			};
		}

		return BaseObject.extend("sap.suite.ui.generic.template.ListReport.controller.SmartChartHelper_PoC", {
			constructor: function(oState, oController, oTemplateUtils) {
				jQuery.extend(this, getMethods(oState, oController, oTemplateUtils));
			}
		});
	});