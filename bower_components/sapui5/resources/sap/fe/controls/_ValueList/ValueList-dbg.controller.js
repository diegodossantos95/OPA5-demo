/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/mdc/ConditionModel",
	"sap/ui/mdc/ODataSuggestProvider",
	"sap/ui/mdc/OperatorSuggestProvider",
	"sap/m/SearchField",
	"sap/ui/model/json/JSONModel"
], function (Controller, ConditionModel, ODataSuggestProvider, OperatorSuggestProvider, SearchField, JSONModel) {
	"use strict";
	return Controller.extend("sap.fe.controls._ValueList.ValueList", {

		handleSearch: function (oEvent) {
			var oValueListTable = this.getView().byId("valueListTable");
			var sSearchQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");

			oValueListTable.getBinding("items").changeParameters({
				$search: sSearchQuery || undefined
			});
		},

		onInit: function () {
			var oFilterLayoutFlag = new JSONModel({
				visible: false,
				listView: false,
				tableView: true,
				sSelectedRowCount: 0
			});
			this.oValueListTable = this.getView().byId("valueListTable");
			var oListBinding = this.oValueListTable.getBinding("items");
			this.oValueListTableConditionModel = ConditionModel.getFor(oListBinding);

			var oConditionChangeBinding = this.oValueListTableConditionModel.bindProperty("/", this.oValueListTableConditionModel.getContext("/"));
			oConditionChangeBinding.attachChange(this.handleChange.bind(this));

			// change handler on list binding to remember the table tab selections and mark the selected items
			var oListBinding = this.getView().byId("valueListTable").getBinding("items");
			oListBinding.attachChange(this.updateTableSelections.bind(this));

			this.getView().setModel(this.oValueListTableConditionModel, "vltcm");
			this.getView().setModel(oFilterLayoutFlag, "FilterLayoutFlag");
		},

		onAfterRendering : function(){
			//var oGridContent =	this.getView().byId("template::DefineConditions").getBinding("content");
			//oGridContent.attachChange(this.handleConditionButtonVisibility.bind(this));

			// update the table selections everytime the dialog is opened
			this.updateTableSelections();
		},

		handleFilter: function () {
			if (this.getView().getModel("FilterLayoutFlag").getProperty("/visible")) {
				this.getView().getModel("FilterLayoutFlag").setProperty("/visible", false);
			} else {
				this.getView().getModel("FilterLayoutFlag").setProperty("/visible", true);
			}
		},

		handleChange: function () {
			this.oValueListTableConditionModel.applyFilters();
		},

		handleConditionButtonVisibility : function() {
			var oGrid = this.getView().byId("template::DefineConditions");
			var oConditionModel = this.getView().getModel("cm");
			var sLen = oConditionModel.getConditions().length;

			var aOperatorTabItems = [];
			for (var i = 0 ; i < sLen; i++) {
				//filter values of select with operator tab and stores it in a array
				if ( oConditionModel.getConditions()[i].operator !== "EEQ") {
					aOperatorTabItems.push(oConditionModel.getConditions()[i]);
				}
			}
			if (aOperatorTabItems.length === 0) {
				//Adds one new empty condition into the condition model when there is no value in define condition tab
				//This will work in case of Reset
				oConditionModel.addCondition(oConditionModel.createCondition(this.getView().getController().fieldPath, "EQ", []));
			} else {
				//setting the visibility of add/remove button on change of length of condition model
				var content = oGrid.getContent();
				content[content.length - 1].getContent()[4].getContent()[1].setVisible(true);
			}
		},
		onResetValueHelp: function (oControlEvent, oModel){
			var oView = this.getView();
			oView.setModel(oModel, "cm");
		},
		handleToggleButton: function (oEvent) {
			var sId = oEvent.getSource().getId();
			if (sId.indexOf("template::ListView") !== -1) {
				this.getView().getModel("FilterLayoutFlag").setProperty("/listView", true);
				this.getView().getModel("FilterLayoutFlag").setProperty("/tableView", false);
			} else if (sId.indexOf("template::TableView") !== -1) {
				this.getView().getModel("FilterLayoutFlag").setProperty("/tableView", true);
				this.getView().getModel("FilterLayoutFlag").setProperty("/listView", false);
			}
		},

		removeCondition: function(oEvent){
			var sSouceId = oEvent.oSource.getId();
			var oConditionModel = this.oView.getModel("cm");
			var aConditions = oConditionModel.getConditions();
			var sLen = aConditions.length;
			var aOperatorTabItems = [];
			for (var i = 0 ; i < sLen; i++) {
				//filter values of "select with operator" tab from condition model and stores it in a array
				if ( aConditions[i].operator !== "EEQ") {
					aOperatorTabItems.push({
						items : aConditions[i],
						index : i});
				}
			}
			var index = sSouceId.substr(sSouceId.lastIndexOf("-") + 1 ,sSouceId.length); //index of removed item
			var aRemovedItem = [];
			aRemovedItem.push(aOperatorTabItems[index]);  //getting object of removed item
			oConditionModel.removeCondition(this.getView().getController().fieldPath, parseInt(aRemovedItem[0].index, 10));

			//if removal item is last line item of condition tab then will add empty condition
			if (sLen === 0) {
				oConditionModel.addCondition(oConditionModel.createCondition(this.getView().getController().fieldPath, "EQ", []));
			}
		},
		addCondition: function(oEvent){
			var oConditionModel = this.oView.getModel("cm");
			var index = oConditionModel.getConditions().length;
			// create a new dummy condition for a new contion on the UI - must be removed later if not used or filled correct
			oConditionModel.insertCondition(index, oConditionModel.createCondition(this.getView().getController().fieldPath, "EQ", []));
			//No changes to the Add button if there is no condition added
			if (index < oConditionModel.getConditions().length) {
				oEvent.getSource().setVisible(false);
			}
		},

		handleSelectionChange : function(oEvent){

			var oView = this.getView();
			var oConditionModel = oView.getModel("cm");
			var sFieldPath = oView.getController().fieldPath;
			var mValueList = oView.getModel("valueList").getObject("/");
			var oItem, sKey, sDescription, oBindingContext;


			var bSelectedRow = oEvent.getParameter("listItem").getSelected();
			//var sSelectedRowCount = oView.getModel("FilterLayoutFlag").getProperty("/sSelectedRowCount");

			if (bSelectedRow === true) {
				//Add to condition model
				//Looping through the list items that are undergoing selection
				for (var i = 0;i < oEvent.getParameter("listItems").length; i++) {
					//Getting list item associated object(data)
					oBindingContext = oEvent.getParameter("listItems")[i].getBindingContext();
					oItem = oBindingContext.getObject();
					//Getting key-field from the list item, TODO: Implementation for multiple key-field scenario
					sKey = oItem[mValueList.__sapfe.keyPath];
					sDescription = oItem[mValueList.__sapfe.descriptionPath];
					//Insert condition to condition model(index, path, operator, aValues)
					//Store the canonical path to the condition for updating the table rows selection on update of binding or token
					oConditionModel.addCondition(oConditionModel.createCondition(sFieldPath, "EEQ", [sKey,sDescription,oBindingContext.getCanonicalPath()]));
				}
				//sSelectedRowCount = sSelectedRowCount + 1;
			} else {
				//Remove from condition model
				//Looping through the list items that are undergoing deselection
				for (var j = 0; j < oEvent.getParameter("listItems").length; j++) {
					// refresh the conditions from the condition model on each iteration to use the right index for removeCondition
					var aConditionModelConditions = oConditionModel.getConditions().filter(function (oCondition) {
						return oCondition.operator === "EEQ";
					});
					//Getting list item associated object(data)
					oBindingContext = oEvent.getParameter("listItems")[j].getBindingContext();
					//Looping through the Conditions to find the condition to be removed by matching key-field
					for (var i = 0;i < aConditionModelConditions.length; i++) {
						if (aConditionModelConditions[i].values && aConditionModelConditions[i].values[2] === oBindingContext.getCanonicalPath()) {
							//Remove condition(path, index)
							oConditionModel.removeCondition(sFieldPath, i);
							break;
						}
					}
				}
				//sSelectedRowCount = sSelectedRowCount - 1;
			}
			//oView.getModel("FilterLayoutFlag").setProperty("/sSelectedRowCount",sSelectedRowCount);
			//var oResourceBundle = oView.getModel("sap.fe.i18n").getResourceBundle();
			//var sText = oResourceBundle.getText("selectFromList", [sSelectedRowCount]);
			//oView.byId("template::SelectValueList").getItems()[0].setText(sText);
		},

		handleTokenUpdate : function(oEvent){

			var oView = this.getView();
			var oConditionModel = oView.getModel("cm");
			var sFieldPath = oView.getController().fieldPath;
			var aRemovedTokens = oEvent.getParameter("removedTokens");
			var aTokens = oView.byId("template::Tokenizer").getTokens();
			for (var i = 0; i < aTokens.length; i++) {
				if (aTokens[i].getKey() === aRemovedTokens[0].getKey()) {

					var oTable = oView.byId("valueListTable");
					var oTableSelectedContext = oTable.getSelectedContexts();
					for (var j = 0; j < oTableSelectedContext.length; j++) {
						if (oTableSelectedContext[j].getCanonicalPath() === oConditionModel.getConditions()[i].values[2]) {
							oTable.getItems()[oTableSelectedContext[j].iIndex].setSelected(false);
							break;
						}
					}
					oConditionModel.removeCondition(sFieldPath,i);
					break;
				}
			}
		},

		updateTableSelections : function (oEvent) {
			// remove all selections from the table
			var oTable, aItems;
			oTable = this.getView().byId("valueListTable");
			// remove selections with "true" to remove all the invisible selections as well
			oTable.removeSelections(true);
			aItems = oTable.getItems();
			// We get the conditions and key path, loop over conditions and compare key to table's current items to mark selections
			var oConditionModel, aConditions, aConditionsForTableTab;
			oConditionModel = this.getView().getModel("cm");
			aConditions = oConditionModel.getConditions();
			aConditionsForTableTab = aConditions.filter(function (oCondition) {
				return oCondition.operator === "EEQ";
			});
			var i, j, oCondition, oItem;
			for (i = 0; i < aConditionsForTableTab.length; i++) {
				oCondition = aConditionsForTableTab[i];
				for (j = 0; j < aItems.length; j++) {
					oItem = aItems[j];
					if (oItem.getBindingContext().getCanonicalPath() === oCondition.values[2]) {
						oTable.setSelectedItem(oItem, true);
						break;
					}
				}
			}
		}
	});
});
