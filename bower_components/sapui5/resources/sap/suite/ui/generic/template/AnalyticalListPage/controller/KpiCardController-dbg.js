sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/d3",
	"sap/suite/ui/generic/template/AnalyticalListPage/util/KpiUtil",
	"sap/suite/ui/generic/template/AnalyticalListPage/util/V4Terms"
], function(jQuery, Fragment, Controller, JSONModel, D3, KpiUtil, V4Terms) {
	"use strict";
	jQuery.sap.require("sap.suite.ui.generic.template.AnalyticalListPage.util.KpiAnnotationFormatter");

	var oNavigationHandler,
		oSTCommonUtils;

	var cController = Controller.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.KpiCardController", {

		onInit: function(evt) {
			// CommonUtils will be taken from OVP lib
			jQuery.sap.require("sap.ovp.cards.CommonUtils");
		},
		onExit: function() {
		},
		onBeforeRendering: function() {
			// Define CommonUtils
			var oCommonUtils = sap.ovp.cards.CommonUtils;
			var sDataPointPath, sSPVPath;
			//get the view and other settings
			var oView = this.getView();
			//var oLocalCardContainer = oView.byId("template::ALPcardContainer");
			var oSettings = oView.data("qualifierSettings");
			var oQualifier = oSettings.qualifier;
			var oModel = oView.getModel();
			var oMetaModel = oModel.getMetaModel();
			var oEntitySet = oMetaModel.getODataEntitySet(oSettings.entitySet);
			var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);

			// create a card name for OVP
			var oCardName = "kpiCard" + oQualifier;
			// create a card settings to pass to OVP
			var oCardSettings = {
				"cards":{}
			};
			//if qualifier present in the settings
			sSPVPath = V4Terms.SelectionPresentationVariant + (oQualifier ? "#" + oQualifier : "");
			// CDS Annotation gives Path instead of AnnotationPath
			var sPresentationVariant = oEntityType[sSPVPath].PresentationVariant &&  oEntityType[sSPVPath].PresentationVariant.Path;
			if (!sPresentationVariant) {
				jQuery.sap.log.error("PresentationVariant does not have Path.");
				return;
			}
			var oVisualizations = oEntityType[sPresentationVariant.split("@")[1]].Visualizations;

			oVisualizations.forEach(function(oAnno){
				if (oAnno.AnnotationPath.indexOf("DataPoint") > 0){
					sDataPointPath = oAnno.AnnotationPath.split("@")[1];
				}
			});

			oCardSettings["cards"][oCardName] = {
				"model": oSettings.model,
				"template": "sap.ovp.cards.charts.analytical",
				"settings": {
					"entitySet": oSettings.entitySet,
					"selectionPresentationAnnotationPath": sSPVPath,
					"dataPointAnnotationPath": sDataPointPath,
					"navigation": "chartNav"
				}
			};
			// create a card with OVP API
			oCommonUtils.createCardComponent(oView, oCardSettings, "template::ALPcardContainer");
			//Event handler on header clicked for navigation
			oCommonUtils.onHeaderClicked = function(oEvent){
				var oNavModel = oView.getModel("detailNavigation");
				this.handleNavigationPress(oNavModel);
			}.bind(this);
		},

		handleNavigationPress: function(oNavModel) {
			if (oNavModel) {
				var sTarget = oNavModel.getProperty("/target");
				var sAction = oNavModel.getProperty("/action");
				var sParameters = oNavModel.getProperty("/parameters");
				if (sTarget && sAction) {
					if (!oNavigationHandler) {
						oNavigationHandler = oSTCommonUtils.getNavigationHandler();
					}

					oNavigationHandler.navigate(sTarget, sAction, JSON.parse(sParameters), null, function (oError) {
						if (oError instanceof sap.ui.generic.app.navigation.service.NavError) {
							if (oError.getErrorCode() === "NavigationHandler.isIntentSupported.notSupported") {
								sap.m.MessageBox.show(oSTCommonUtils.getText("ST_NAV_ERROR_NOT_AUTHORIZED_DESC"), {
									title: oSTCommonUtils.getText("ST_GENERIC_ERROR_TITLE")
								});
							} else {
								sap.m.MessageBox.show(oError.getErrorCode(), {
									title: oSTCommonUtils.getText("ST_GENERIC_ERROR_TITLE")
								});
							}
						}
					});
				}
			}
		},
		_assignCommonUtils: function(oCommonUtils) {
			oSTCommonUtils = oCommonUtils;
			oNavigationHandler = oSTCommonUtils.getNavigationHandler();
		}
	});


	return cController;

});
