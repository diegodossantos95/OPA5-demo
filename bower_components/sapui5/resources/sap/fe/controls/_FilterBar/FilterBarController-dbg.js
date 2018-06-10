/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/SearchField",
	"sap/m/Bar",
	"sap/m/Label",
	"sap/ui/mdc/FilterField",
	"sap/ui/mdc/ODataSuggestProvider",
	"sap/ui/mdc/OperatorSuggestProvider",
	"sap/ui/mdc/FixedValueListProvider"
], function (jQuery, BaseObject, JSONModel, Dialog, Button, SearchField, Bar, Label, FilterField, ODataSuggestProvider, OperatorSuggestProvider, FixedValueListProvider) {
	"use strict";

	/**
	 * @private
	 * @constructor
	 * @param
	 */

	var FilterBarController = BaseObject.extend("sap.fe.controls._FilterBar.FilterBarController", {
		constructor: function (oFilterBar) {
			BaseObject.apply(this, arguments);
			this.oFilterBar = oFilterBar;
			this.mValueListRequests = {};
			this.mValueLists = {};
			this.mSuggestionLists = {};
		}
	});

	FilterBarController.prototype.getQueryParameters = function () {
		var oQueryParameters = {}, sSearch,
			oSearch;

		// TODO: the table should now it's condition model, will change this later
		oQueryParameters.conditionModel = this.getConditionModel();

		// set $search
		oSearch = this.getSearchControl();
		if (oSearch) {
			sSearch = oSearch.getValue();
			oQueryParameters["$search"] = sSearch || undefined;
		}

		return oQueryParameters;
	};


	FilterBarController.prototype.handleValueHelpRequest = function (oEvent) {
		var oFilterField = oEvent.getSource();
		var sId = oFilterField.getId();

		var oConditionModel = this.getConditionModel();
		/*TEST CODE*/

		var sFieldPath = oFilterField.getFieldPath();
		var oCM = oConditionModel.clone(sFieldPath);
		var that = this;

		if (this.mValueLists[sId]) {
			this.mValueLists[sId].then(function (oValueList) {
				oValueList.getContent()[0].setModel(oCM,"cm");
				oValueList.getContent()[0].setBindingContext(oCM.createBindingContext("/"),"cm");
				oValueList.open();
			});
		} else {

			var oResetButton = new Button({
				text: '{sap.fe.i18n>SAPFE_RESET}'
			});

			var oTitle = new Label();

			var oValueList = new Dialog({
				// the title is parked in the custom data - this will be changed in the next release
				customHeader: new Bar({
					contentMiddle: [oTitle],
					contentRight: [oResetButton]
				}),
				contentWidth: "75%",
				contentHeight: "75%",
				verticalScrolling: false,
				resizable : false,
				draggable : true,
				endButton: new Button({
					text: '{sap.fe.i18n>SAPFE_CANCEL}',
					press: function () {

						oValueList.getContent()[0].getModel("cm").destroy();
						oValueList.close();
					}
				}),
				beginButton: new Button({
					text: '{sap.fe.i18n>SAPFE_OK}',
					press: function () {
						var oConditionModel = that.getConditionModel();
						var localFieldPath = oValueList.getContent()[0].getController().fieldPath;
						var oValueModel = oValueList.getContent()[0].getModel("cm");
						oConditionModel.merge(localFieldPath,oValueModel);
						oValueList.close();
					}
				})
			}).addStyleClass("sapUiNoContentPadding");
			oFilterField.addDependent(oValueList);

			var oOperatorConfig = oFilterField.getFilterOperatorConfig();
			var aOperators = oOperatorConfig.getOperatorsForType(oFilterField.getDataType());

			var aOperatorsData = [];
			aOperators.forEach(function(element) {
				var oOperator = oOperatorConfig.getOperator(element);
				if (oOperator.showInSuggest !== undefined && oOperator.showInSuggest === false) {
					return;
				}
				var sTxtKey = oOperator.textKey || "operators." + oOperator.name + ".longText";
				var sText = oOperator.getTypeText(sTxtKey, oFilterField._getDataType().getName().toLowerCase());
				if (sText === sTxtKey) {
					sText = oOperator.longText;
				}
				aOperatorsData.push({
					key: element,
					additionalText: sText
				});
			}, this);

			var oOperatorModel = new sap.ui.model.json.JSONModel();
			oOperatorModel.setData(aOperatorsData);

			oValueList.open();

			this.mValueLists[sId] = (this.mValueListRequests[sId] || this.requestValueListMetadata(oFilterField)).then(function (mValueListInfo) {
				var oValueListModel = new JSONModel(mValueListInfo);
				oValueListModel.setProperty("/title", oFilterField.getCustomData()[0].getValue());

				var oValueListContent = sap.ui.view({
					viewName: "sap.fe.controls._ValueList.ValueList",
					type: "XML",
					height: "100%",
					async: true,
					preprocessors: {
						xml: {
							bindingContexts: {
								valueList: oValueListModel.createBindingContext("/")
							},
							models: {
								valueList: oValueListModel
							}
						}
					}
				});

				oValueListContent.setModel(oCM, "cm");
				oValueListContent.setModel(oOperatorModel,"om");
				oValueListContent.setBindingContext(oOperatorModel.createBindingContext("/"),"om");
				oValueListContent.setBindingContext(oCM.createBindingContext("/"),"cm");
				oValueListContent.setModel(oValueListModel, "valueList");
				oValueListContent.setModel(mValueListInfo.$model);

				//To get the DataType of the filterfield for setting token text
				var oTempPrivateModel = new JSONModel();
				oValueListContent.setModel(oTempPrivateModel, "oTempPrivate");
				oValueListContent.getModel("oTempPrivate").setProperty("/FilterFieldType", oFilterField._getDataType());

				return oValueListContent.loaded().then(function (oValueListContent) {
					oResetButton.attachPress(function (oEvent) {
						oCM = oConditionModel.clone(sFieldPath);
						oValueListContent.getModel("cm").setData(oCM.getData());
						oValueListContent.getController().updateTableSelections();
					});
					oTitle.setText(oValueListContent.getModel("valueList").getProperty("/title"));
					oValueListContent.getController().fieldPath = sFieldPath;
					oValueList.removeAllContent();

					oValueList.addContent(oValueListContent);

					//Adds one new empty condition into the condition model when there is no value in define condition tab when we create the valueHelp view
					// if (oCM.getConditions().length === 0) {
					// 	oCM.insertCondition(0, sFieldPath, "EQ", []);
					// }
					return Promise.resolve(oValueList);

				});
			});
		}
	};

	FilterBarController.prototype.handleSuggest = function (oProvider, oEvent) {
		/* currently the inner field fires the event - this might change in the future once we agree on a final
		 API in the MDC Filter Field - then we night to change this coding */
		var oInnerFilterField = oEvent.getSource();
		var oFilterField = oEvent.getSource().getParent();
		var sEntitySet = this.getEntitySet();
		var oMetaModel = oFilterField.getModel().getMetaModel();
		var oSearchRestrictions, mBindingParameters = {},
			sId = oFilterField.getId();
		// temp solution - we will get rid of custom data in the next release
		var bFixedValues = oFilterField.getCustomData()[2].getValue() === 'true';


		if (!bFixedValues) {
			oSearchRestrictions = oMetaModel.getObject("/" + sEntitySet + "@Org.OData.Capabilities.V1.SearchRestrictions");
			if (!oSearchRestrictions || oSearchRestrictions.Searchable || oSearchRestrictions.Searchable === undefined) {
				// the entity set is searchable - we can use $search
				mBindingParameters = {
					$search: oEvent.getParameters().suggestValue
				};
			} else {
				// Suggest Lists entity sets without $search support is not yet supported
				return;
			}
		}

		if (this.mSuggestionLists[sId]) {
			if (!bFixedValues){
				this.mSuggestionLists[sId].then(function () {
					var oSuggestListBinding = oInnerFilterField.getBinding("suggestionRows");
					oSuggestListBinding.changeParameters(mBindingParameters);
				});
			}
		} else {
			this.mSuggestionLists[sId] = ( this.mValueListRequests[sId] || this.requestValueListMetadata(oFilterField)).then(function (mValueListInfo) {
				mValueListInfo.SuggestBindingParameters = JSON.stringify(mBindingParameters);

				var oValueListModel = new JSONModel(mValueListInfo);

				var oSuggestionList = sap.ui.view({
					viewName: "sap.fe.controls._ValueList.SuggestionList",
					type: "XML",
					async: true,
					preprocessors: {
						xml: {
							bindingContexts: {
								valueList: oValueListModel.createBindingContext("/")
							},
							models: {
								valueList: oValueListModel
							}
						}
					}
				});

				oSuggestionList.setModel(mValueListInfo.$model);

				return oSuggestionList.loaded().then(function () {
					oProvider.setTable(oSuggestionList.getContent()[0]);
					if (mValueListInfo.__sapfe){
						if (mValueListInfo.__sapfe.keyPath){
							oProvider.setKeyPath(mValueListInfo.__sapfe.keyPath);
						}
						if (mValueListInfo.__sapfe.descriptionPath){
							oProvider.setDescriptionPath(mValueListInfo.__sapfe.descriptionPath);
						}
					}
				});
			});
		}
	};

	FilterBarController.prototype.requestValueListMetadata = function (oFilterField) {
		var that = this;
		this.mValueListRequests[oFilterField.getId()] = oFilterField.getModel().getMetaModel().requestValueListInfo('/' + this.getEntitySet() + '/' + oFilterField.getFieldPath().replace(/\*/g, '')).then(function (mValueListInfo) {
			var mParameters;

			if (mValueListInfo[""]) {
				// determine key and description path and store it in the value list info
				mParameters = mValueListInfo[""].Parameters;

				var sLocalDataProperty = oFilterField.getModel().getMetaModel().getObject('/' + that.getEntitySet() + '/' + oFilterField.getFieldPath().replace(/\*/g, '') + "@sapui.name");

				// determine the key and the description path
				for (var i = 0; i < mParameters.length; i++) {
					if (mParameters[i].LocalDataProperty && mParameters[i].LocalDataProperty.$PropertyPath === sLocalDataProperty) {
						// we store this information into the value list info - we will set this information to the filter field in the future
						mValueListInfo[""].__sapfe = {
							keyPath: mParameters[i].ValueListProperty,
							descriptionPath: mValueListInfo[""].$model.getMetaModel().getObject("/" + mValueListInfo[""].CollectionPath + "/" + mParameters[i].ValueListProperty + "@com.sap.vocabularies.Common.v1.Text/$Path")
						};

						// there should be always only one parameter with the property field path as output
						break;
					}
				}

				return mValueListInfo[""];
			} else {
				throw ("no unqualified value list found - currently qualified value lists are not considered");
			}

		}, function (oError) {
			throw (oError.message);
		});

		return this.mValueListRequests[oFilterField.getId()];

	};

	FilterBarController.prototype.setFilterSummary = function () {
		var oSearch = this.getSearchControl(),
			oDraftEditState = this.getDraftEditStateControl(),
			sSearch, sFilterSummary = "", aFilter = [], i;

		var oResourceBundle = this.oFilterBar.getModel("sap.fe.i18n").getResourceBundle();

		if (oSearch) {
			sSearch = oSearch.getValue();
		}

		if (sSearch) {
			sFilterSummary = oResourceBundle.getText("SAPFE_FILTERBAR_SEARCHBY") + ": " + sSearch + ((aFilter.length > 0) ? " | " : "");
		}

		if (oDraftEditState && oDraftEditState.getSelectedKey() !== '0') {
			aFilter.push(oResourceBundle.getText("SAPFE_FILTERBAR_EDITING_STATUS"));
		}

		var aFilterFields = this.getFilterFieldControls();

		for (i = 0; i < aFilterFields.length; i++) {
			if (aFilterFields[i].getConditions().length > 0) {
				// we park the title of the filter in the custom data - this will be changed with the next release
				aFilter.push(aFilterFields[i].getCustomData()[0].getValue());
			}
		}

		if (aFilter.length > 0) {
			sFilterSummary += oResourceBundle.getText("SAPFE_FILTERBAR_FILTERBY") + " (" + aFilter.length + "): ";
			for (i = 0; i < aFilter.length; i++) {
				sFilterSummary += ((i > 0) ? ', ' : '') + aFilter[i];
			}
		}

		if (!sFilterSummary) {
			sFilterSummary = oResourceBundle.getText("SAPFE_FILTERBAR_FILTERBYNONE");
		}

		this.oFilterBar.setFilterSummary(sFilterSummary);

	};

	FilterBarController.prototype.getEntitySet = function () {
		// we currently expect that we can just remove the / of the entitySet context path
		return this.oFilterBar.getEntitySetContext().substr(1);
	};

	FilterBarController.prototype.getConditionModel = function () {
		return this.oFilterBar.getModel(this.oFilterBar.getConditionModelName());
	};

	FilterBarController.prototype.getDraftEditStateControl = function () {
		var aContent = this.oFilterBar.getInnerFilterBar().getContent();
		var oFilterItem;

		for (var i = 0; i < aContent.length; i++) {
			oFilterItem = aContent[i].getItems()[1];
			if (oFilterItem.getBinding("items") && oFilterItem.getBinding("items").getPath() === "/editStates" && oFilterItem.getBinding("items").getModel() === oFilterItem.getModel("$draft")) {
				return oFilterItem;
			}
		}
	};

	FilterBarController.prototype.getSearchControl = function () {
		var aContent = this.oFilterBar.getInnerFilterBar().getContent();
		var oFilterItem;

		for (var i = 0; i < aContent.length; i++) {
			oFilterItem = aContent[i].getItems()[1];
			if (oFilterItem instanceof SearchField) {
				return oFilterItem;
			}
		}
	};

	FilterBarController.prototype.getFilterFieldControls = function () {
		var aContent = this.oFilterBar.getInnerFilterBar().getContent();
		var oFilterItem,
			aFilterFields = [];

		for (var i = 0; i < aContent.length; i++) {
			oFilterItem = aContent[i].getItems()[1];
			if (oFilterItem instanceof FilterField) {
				aFilterFields.push(oFilterItem);
			}
		}

		return aFilterFields;
	};

	FilterBarController.prototype.getAppState = function () {
		var oConditionModel = this.getConditionModel(),
			oDraftEditState = this.getDraftEditStateControl(),
			oSearch = this.getSearchControl(),
			oAppState = {};

		if (oConditionModel) {
			oAppState.conditionModel = oConditionModel.serialize();
		}

		if (oDraftEditState) {
			oAppState.draftEditState = oDraftEditState.getSelectedKey();
		}

		if (oSearch) {
			oAppState.search = oSearch.getValue();
		}

		return oAppState;
	};

	FilterBarController.prototype.setAppState = function (oAppState) {
		var oConditionModel = this.getConditionModel(),
			oDraftEditState = this.getDraftEditStateControl(),
			oSearch = this.getSearchControl();

		if (oAppState.conditionModel) {
			if (oConditionModel) {
				oConditionModel.parse(oAppState.conditionModel);
			} else {
				throw ("app state contains condition model state but condition model not yet set");
			}
		}

		if (oAppState.draftEditState && oDraftEditState) {
			oDraftEditState.setSelectedKey(oAppState.draftEditState);
		}

		if (oAppState.search && oSearch) {
			oSearch.setValue(oAppState.search);
		}
	};

	FilterBarController.prototype.createSuggestProviders = function () {
		var aFilterFields = this.getFilterFieldControls(),
			bSuggest, bFixedValues,
			oFilterField;

		for (var i = 0; i < aFilterFields.length; i++) {
			oFilterField = aFilterFields[i];
			/* we park the information if the filter field provides a suggestion or not in the custom data of the
			 filter field - this will be changed in the next release	 */
			bSuggest = oFilterField.getCustomData()[1].getValue() === 'true';
			bFixedValues = oFilterField.getCustomData()[2].getValue() === 'true';

			if (bSuggest) {
				new ODataSuggestProvider({
					control: oFilterField,
					enableFilterSuggest: false,
					suggest: this.handleSuggest.bind(this)
				});

			} else if (bFixedValues){
				new FixedValueListProvider({
					control: oFilterField,
					enableFilterSuggest: true,
					suggest: this.handleSuggest.bind(this)
				});


				/* according to UX we disable the Operator Suggest Provider for the first delivery */
				//} else {
				//	new OperatorSuggestProvider({control: oFilterField});
			}
		}

	};

	return FilterBarController;

});
