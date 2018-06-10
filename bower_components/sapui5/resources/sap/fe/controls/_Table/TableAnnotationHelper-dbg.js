/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

(function () {
	"use strict";

	/*
	 This class contains annotation helpers that are needed for the sap.fe.controls._Table.
	 */
	jQuery.sap.declare("sap.fe.controls._Table.TableAnnotationHelper");

	sap.fe.controls._Table.TableAnnotationHelper = {

		getEntitySetFromContext: function (oInterface) {
			var aParts = oInterface.getPath().split('/');
			var oEntitySetContext;
			if (aParts[1]) {
				oEntitySetContext = oInterface.getModel().getMetaContext('/' + aParts[1]);
			}
			if (oEntitySetContext && oEntitySetContext.getObject().$kind === "EntitySet") {
				return oEntitySetContext;
			} else {
				throw ("entity set could not be determined from line item context");
			}
		},

		createAggregationBinding: function (oInterface, oEntitySet, sTableBindingPath, sFilterBarId, aLineItems) {
			if (sTableBindingPath) {
				return sTableBindingPath;
			}

			var sExpand = '',
				oMetaContext = oInterface.getInterface(0),
				oMetaModel = oMetaContext.getModel(),
				sEntitySet = oMetaModel.getObject(oMetaContext.getPath() + "@sapui.name");

			if (oMetaContext.getModel().getObject(oMetaContext.getPath() + "@com.sap.vocabularies.Common.v1.DraftRoot")) {
				sExpand = "$expand : 'DraftAdministrativeData'";
			}

			return "{ path : '/" + sEntitySet + "', parameters : {  $count : true " + (sExpand  ? ',' : '') + sExpand + "}, events : {dataRequested : '.handleDataRequested', dataReceived : '.handleDataReceived'} }";
		},

		getSelectionMode: function (oContext, oEntitySet, oWorkingContext) {
			oContext = oContext.getInterface(0);

			//var aLineItems = oContext.getModel().getObject(oWorkingContext['@com.sap.vocabularies.UI.v1.LineItem']) || [];
			var aLineItems = oWorkingContext['@com.sap.vocabularies.UI.v1.LineItem'];
			for (var i = 0; i < aLineItems.length; i++) {
				if (aLineItems[i].$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && !aLineItems[i].Inline) {
					return sap.m.ListMode.MultiSelect;
				}
			}

			return sap.m.ListMode.None;
		},
		formatDraftLockText: function (IsActiveEntity, HasDraftEntity, LockedBy) {
			if (!IsActiveEntity) {
				return this.getModel("sap.fe.i18n").getResourceBundle().getText("SAPFE_DRAFT_OBJECT");
			} else if (HasDraftEntity) {
				if (LockedBy) {
					return this.getModel("sap.fe.i18n").getResourceBundle().getText("SAPFE_LOCKED_OBJECT");
				} else {
					return this.getModel("sap.fe.i18n").getResourceBundle().getText("SAPFE_UNSAVED_CHANGES");
				}
			} else {
				return ""; // not visible
			}
		}

	};
	sap.fe.controls._Table.TableAnnotationHelper.getEntitySetFromContext.requiresIContext = true;
	sap.fe.controls._Table.TableAnnotationHelper.createAggregationBinding.requiresIContext = true;
	sap.fe.controls._Table.TableAnnotationHelper.getSelectionMode.requiresIContext = true;
})();
