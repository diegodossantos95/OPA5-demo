/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
/**
* @class smartFilterBar
* @memberOf sap.apf.ui.reuse.controller
* @name smartFilterBar
* @description controller for smartFilterBar view
*/
(function() {
	'use strict';
	sap.ui.controller("sap.apf.ui.reuse.controller.smartFilterBar", {
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#onInit
		 * @description Called on initialization of the view
		 * */
		onInit : function() {
			var oController = this;
			var sServiceForSFB = oController.getView().getViewData().oSmartFilterBarConfiguration.service;
			var annotationUris = oController.getView().getViewData().oCoreApi.getAnnotationsForService(sServiceForSFB);
			var parameterSet = {
				loadMetadataAsync : true,
				annotationURI : annotationUris,
				json : true
			};
			var sapSystem = oController.getView().getViewData().oCoreApi.getStartParameterFacade().getSapSystem();
			if (sapSystem) {
				sServiceForSFB = sap.ui.model.odata.ODataUtils.setOrigin(sServiceForSFB, { force : true, alias : sapSystem});
			}
			var oModel = new sap.ui.model.odata.ODataModel(sServiceForSFB, parameterSet);
			oModel.getMetaModel().loaded().then(function(){
				oController.getView().getViewData().oCoreApi.getMetadata(sServiceForSFB).done(function(metadata){
					if(metadata.getAllEntitySetsExceptParameterEntitySets().indexOf(oController.getView().getViewData().oSmartFilterBarConfiguration.entitySet) < 0 ){
						oController.getView().getViewData().oCoreApi.putMessage(oController.getView().getViewData().oCoreApi.createMessageObject({
							code: "5053",
							aParameters: [oController.getView().getViewData().oSmartFilterBarConfiguration.entitySet, sServiceForSFB]}));
					}
					oModel.setCountSupported(false);
					oController.byId("idAPFSmartFilterBar").setModel(oModel);
				});
			});
			oModel.attachMetadataFailed(function(){
				oController.getView().getViewData().oCoreApi.putMessage(oController.getView().getViewData().oCoreApi.createMessageObject({
					code: "5052",
					aParameters: [sServiceForSFB]}));
			});
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#afterInitialization
		 * @description Called on initialize event of the Smart Filter Bar
		 */
		afterInitialization: function(){
			this.validateFilters();
			this.registerSFBInstanceWithCore();
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#registerSFBInstanceWithCore
		 * @description Registers the sfb instance in the core, so the startup can continue
		 * */
		registerSFBInstanceWithCore : function() {
			var oController = this;
			oController.getView().getViewData().oCoreApi.registerSmartFilterBarInstance(oController.byId("idAPFSmartFilterBar"));
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#handlePressOfGoButton
		 * @description Called on search event(press of Go Button) of the Smart Filter Bar
		 * */
		handlePressOfGoButton : function() {
			var oController = this;
			if(oController.getView().getViewData().oCoreApi.getActiveStep()){
				oController.getView().getViewData().oUiApi.selectionChanged(true);
			}
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#handleFilterChange
		 * @description Checks if the filter bar is in a valid state (all mandatory filters are filled)
		 * */
		validateFilters: function(){
			var oSmartFilterBar = this.byId("idAPFSmartFilterBar");
			var valid = oSmartFilterBar.validateMandatoryFields();
			this.getView().getViewData().oUiApi.getAddAnalysisStepButton().setEnabled(valid);
			this.getView().getViewData().oUiApi.getAddAnalysisStepButton().rerender();
		}
	});
}());