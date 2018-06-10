/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

(function () {
	"use strict";

	/*
	 This class contains annotation helpers that are needed for the sap.fe.controls._Field.
	 */
	jQuery.sap.declare("sap.fe.controls._Field.FieldAnnotationHelper");

	sap.fe.controls._Field.FieldAnnotationHelper = {
		formatDraftOwner: function (vDraftUUID, vDraftInProcessByUser, vDraftInProcessByUserDesc, vDraftLastChangedByUser, vDraftLastChangedByUserDesc, bHasDraftEntity) {
			var sDraftOwnerDescription = "";
			if (vDraftUUID && bHasDraftEntity) {
				var sUserDescription = vDraftInProcessByUserDesc || vDraftInProcessByUser || vDraftLastChangedByUserDesc || vDraftLastChangedByUser;
				var oResourceBundle = this.getModel("sap.fe.i18n").getResourceBundle();
				if (sUserDescription) {
					sDraftOwnerDescription = oResourceBundle.getText("SAPFE_DRAFT_OWNER", [sUserDescription]);
				} else {
					sDraftOwnerDescription = oResourceBundle.getText("SAPFE_DRAFT_ANOTHER_USER");
				}
			}
			return sDraftOwnerDescription;
		},
		buildExpressionForCriticalityIcon: function (sCriticalityProperty) {
			if (sCriticalityProperty) {
				var sExpression = "{= (${" + sCriticalityProperty + "} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${" + sCriticalityProperty + "} === '1') || (${" + sCriticalityProperty + "} === 1) ? 'sap-icon://status-negative' : " +
					"(${" + sCriticalityProperty + "} === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || (${" + sCriticalityProperty + "} === '2') || (${" + sCriticalityProperty + "} === 2) ? 'sap-icon://status-critical' : " +
					"(${" + sCriticalityProperty + "} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${" + sCriticalityProperty + "} === '3') || (${" + sCriticalityProperty + "} === 3) ? 'sap-icon://status-positive' : " +
					"'sap-icon://status-inactive' }";

				return sExpression;
			}
		},

		buildExpressionForCriticalityColor: function (sCriticalityProperty) {
			if (sCriticalityProperty) {
				var sExpression = "{= (${" + sCriticalityProperty + "} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${" + sCriticalityProperty + "} === '1') || (${" + sCriticalityProperty + "} === 1) ? 'Error' : " +
					"(${" + sCriticalityProperty + "} === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || (${" + sCriticalityProperty + "} === '2') || (${" + sCriticalityProperty + "} === 2) ? 'Warning' : " +
					"(${" + sCriticalityProperty + "} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${" + sCriticalityProperty + "} === '3') || (${" + sCriticalityProperty + "} === 3) ? 'Success' : " +
					"'None' }";

				return sExpression;
			}
		},

		getFieldContext: function (oContext, oField) {
			// in the first wave we only support responsiveTable, therefore we directly return this value, in the
			// future we need to introduce more logic here
			return 'responsiveTable';

			/*
			if (oContext.getPath().indexOf('@com.sap.vocabularies.UI.v1.LineItem') >= 0) {
				return 'responsiveTable';
			} else {
				return 'form';
			}*/
		},

		getStableIdPartFromDataField: function (oDataField, mParameter) {
			var sPathConcat = "", sIdPart = "";
			if (oDataField.$Type && oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
				return sap.fe.core.AnnotationHelper.replaceSpecialCharsInId(oDataField.Action);
			} else if (oDataField.$Type && (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" || oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation")) {
				if (typeof oDataField.SemanticObject == "string") {
					sIdPart = sap.fe.core.AnnotationHelper.replaceSpecialCharsInId(oDataField.SemanticObject);
				} else if (oDataField.SemanticObject.$Path) {
					sIdPart = sap.fe.core.AnnotationHelper.replaceSpecialCharsInId(oDataField.SemanticObject.$Path);
				}
				if (typeof oDataField.Action == "string") {
					sIdPart = sIdPart + "::" + sap.fe.core.AnnotationHelper.replaceSpecialCharsInId(oDataField.Action);
				} else if (oDataField.Action && oDataField.Action.$Path) {
					sIdPart = sIdPart + "::" + sap.fe.core.AnnotationHelper.replaceSpecialCharsInId(oDataField.Action.$Path);
				}
				return sIdPart;
			} else if (oDataField.$Type && oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
				return sap.fe.core.AnnotationHelper.replaceSpecialCharsInId(oDataField.Target.$AnnotationPath);
			} else if (oDataField.Value && oDataField.Value.$Path) {
				return sap.fe.core.AnnotationHelper.replaceSpecialCharsInId(oDataField.Value.$Path);
			} else if (oDataField.Value && oDataField.Value.$Apply && oDataField.Value.$Function === "odata.concat") {
				for (var i = 0; i < oDataField.Value.$Apply.length; i++) {
					if (oDataField.Value.$Apply[i].$Path) {
						if (sPathConcat) {
							sPathConcat = sPathConcat + "::";
						}
						sPathConcat = sPathConcat + sap.fe.core.AnnotationHelper.replaceSpecialCharsInId(oDataField.Value.$Apply[i].$Path);
					}
				}
				return sPathConcat;
			} else if (mParameter && mParameter.context && mParameter.context.getObject("@sapui.name")){
				// the context is not refering to da data field but directly to a property, return the property name
				return sap.fe.core.AnnotationHelper.replaceSpecialCharsInId(mParameter.context.getObject("@sapui.name"));
			} else {
				// In case of a string or unknown property
				jQuery.sap.log.error("Annotation Helper: Unable to create a stable ID. Please check the annotations.");
			}
		}
	};

	sap.fe.controls._Field.FieldAnnotationHelper.getFieldContext.requiresIContext = true;

})();
