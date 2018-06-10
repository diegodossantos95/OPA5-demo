/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/XMLComposite',
	'sap/ui/base/ManagedObject',
	'sap/ui/Device',
	'sap/fe/controls/_FilterBar/FilterBarController',
	'sap/ui/model/odata/v4/AnnotationHelper',
	'sap/fe/controls/_FilterBar/FilterBarAnnotationHelper'
], function (jQuery, XMLComposite, ManagedObject, Device, FilterBarController) {
	"use strict";
	var FilterBar = XMLComposite.extend("sap.fe.FilterBar", {
		metadata: {
			designTime: true,
			properties: {
				entitySetContext: {
					type: "any",
					invalidate: "template"
				},
				liveUpdate: {
					type: "boolean",
					defaultValue: !Device.system.phone, // filtering should be via Go button on phone by default
					invalidate: "template"
				},
				searchOnStart: {
					type: "boolean",
					defaultValue: true,
					invalidate: "template"
				},
				filterSummary: {
					type: "string",
					defaultValue: "",
					invalidate: false
				},
				enabled: {
					type: "boolean",
					defaultValue: true,
					invalidate: false
				},
				conditionModelName: {
					type: "string",
					invalidate: false
				}
			},
			events: {
				search: {},
				change: {}
			},
			aggregations: {},
			publicMethods: []
		},
		alias: "this",
		fragment: "sap.fe.controls._FilterBar.FilterBar"
	});

	var fnInitialize = function () {
		var oConditionModel = this.oFilterBarController.getConditionModel();

		// create OData suggest provider - we hope this is not needed anymore in the future
		this.oFilterBarController.createSuggestProviders();

		if (!this.bInitialized && oConditionModel) {
			this.bInitialized = true;
			if (this.getSearchOnStart() && this.getEnabled()) {
				this._bIsReady = true;
				this.fireSearch();
			}

			var oConditionChangeBinding = oConditionModel.bindProperty("/", oConditionModel.getContext("/"));
			oConditionChangeBinding.attachChange(this.handleChange.bind(this));

			if (!this.getEnabled()) {
				this.getInnerFilterBar().setBusy(true);
			}
			this.detachModelContextChange(fnInitialize);
		}

	};

	FilterBar.prototype.onAfterRendering = function () {
		var oSearchControl = this.oFilterBarController.getSearchControl();
		if (oSearchControl) {
			oSearchControl.attachBrowserEvent("blur", function (oEvent) {
				// this is not called - to be discussed with Andreas and UX if needed
			});
		}
	};

	FilterBar.prototype.init = function () {
		this._bIsReady = false;
		this.oFilterBarController = new FilterBarController(this);

		this.attachModelContextChange(fnInitialize);
	};

	FilterBar.prototype.getInnerFilterBar = function () {
		return this.get_content();
	};

	FilterBar.prototype.handleChange = function () {
		// this event is fired once the user changed any filter and the live update is set
		// also it's only fired if it's enabled - in case it's disabled changes can not be done by the user - for
		// example via setting the app state - and no event is expected
		if (this.getLiveUpdate() && this.getEnabled()) {
			this.fireSearch();
			this.oFilterBarController.setFilterSummary();
			this.fireChange();
		}
	};

	FilterBar.prototype.handleSearch = function (oEvent) {
		// this event is fired when the user clicks enter in the search field or on the search icon
		this.fireSearch();
		this.oFilterBarController.setFilterSummary();
		this.fireChange();
	};

	FilterBar.prototype.handleSearchChange = function (oEvent) {
		// the live search is triggered but only if the user didn't type for a given time frame (400ms)
		var that = this,
			iSearchCounter;

		if (that._iSearchCounter) {
			that._iSearchCounter++;
		} else {
			that._iSearchCounter = 1;
		}

		iSearchCounter = that._iSearchCounter;

		if (this.getLiveUpdate()) {
			setTimeout(function () {
				if (iSearchCounter === that._iSearchCounter) {
					that.fireSearch();
					that.oFilterBarController.setFilterSummary();
					that.fireChange();
					delete that._iSearchCounter;
				}
			}, 400);
		}
	};

	FilterBar.prototype.isReady = function () {
		/* tells the connected controls if the filter bar is ready
		 ready = table is set to immediately search / user clicked on GO
		 = the control and all filter items are instanced
		 = the app state is applied if existing
		 = the (default) variant is loaded if existing
		 better name for method is welcome :-)
		 */
		return this._bIsReady;
	};

	FilterBar.prototype.handleGo = function () {
		this._bIsReady = true;
		this.fireSearch();
		this.oFilterBarController.setFilterSummary();
		this.fireChange();
	};


	FilterBar.prototype.handleSuggest = function (oEvent) {
		this.oFilterBarController.handleSuggest(oEvent);
	};

	FilterBar.prototype.handleValueHelpRequest = function (oEvent) {
		this.oFilterBarController.handleValueHelpRequest(oEvent);
	};

	FilterBar.prototype.createFixedValueList = function (oEvent) {
		this.oFilterBarController.createFixedValueList(oEvent);
	};

	FilterBar.prototype.setEnabled = function (bEnabled) {
		this.getInnerFilterBar().setBusy(!bEnabled);
		this.setProperty("enabled", bEnabled);

		if (bEnabled) {
			if (this.bInitialized && this.getSearchOnStart()) {
				this._bIsReady = true;
				this.fireSearch();
			}
		}


	};

	FilterBar.prototype.onBeforeRendering = function () {
		this.oFilterBarController.setFilterSummary();
	};

	FilterBar.prototype.getQueryParameters = function (sEntitySet) {
		return this.oFilterBarController.getQueryParameters(sEntitySet);
	};

	FilterBar.prototype.getAppState = function () {
		return this.oFilterBarController.getAppState();
	};

	FilterBar.prototype.setAppState = function (oAppState) {
		this.oFilterBarController.setAppState(oAppState || {});
		if (!this.getLiveUpdate()) {
			this.handleGo();
		}
	};

	return FilterBar;

}, /* bExport= */true);
