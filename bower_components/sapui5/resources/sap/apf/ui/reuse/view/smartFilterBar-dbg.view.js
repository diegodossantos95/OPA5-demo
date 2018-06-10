/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 * @class smartFilterBar
 * @name  smartFilterBar
 * @description Creates the smart filter bar
 * @memberOf sap.apf.ui.reuse.view
 * 
 */
(function() {
	'use strict';
	sap.ui.jsview("sap.apf.ui.reuse.view.smartFilterBar", {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.smartFilterBar";
		},
		createContent : function(oController) {
			var oView = this, sEntitySet, sSmartFilterBarId, sPersistencyKey, oSmartFilterBar;
			sEntitySet = oView.getViewData().oSmartFilterBarConfiguration.entitySet;
			sSmartFilterBarId = oView.getViewData().oSmartFilterBarConfiguration.id;
			sPersistencyKey = oView.getViewData().oCoreApi.getSmartFilterBarPersistenceKey(sSmartFilterBarId);
			oSmartFilterBar = new sap.ui.comp.smartfilterbar.SmartFilterBar(oController.createId("idAPFSmartFilterBar"), {
				entitySet : sEntitySet,
				controlConfiguration : oView.getViewData().controlConfiguration,
				initialized : oController.afterInitialization.bind(oController),
				search : oController.handlePressOfGoButton.bind(oController),
				persistencyKey : sPersistencyKey,
				considerAnalyticalParameters : true,
				customData: {
					key: "dateFormatSettings",
					value: {"UTC":true}
				},
				useDateRangeType: true,
				liveMode: true,
				filterChange: oController.validateFilters.bind(oController)
			});
			oView.setParent(oView.getViewData().parent);
			return oSmartFilterBar;
		}
	});
}());