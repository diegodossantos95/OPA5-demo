/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

(function () {
	"use strict";
	/*
	 This class contains annotation helpers that are needed for the sap.fe.controls._Table.
	 */
	jQuery.sap.declare("sap.fe.controls._ValueList.ValueListAnnotationHelper");

	sap.fe.controls._ValueList.ValueListAnnotationHelper = {

		getCollectionEntitySet: function (oValueListContext) {
			var mValueList = oValueListContext.getObject();
			return mValueList.$model.getMetaModel().createBindingContext("/" + mValueList.CollectionPath);
		},

		getValueListProperty: function (oPropertyContext) {
			var oValueListModel = oPropertyContext.getModel();
			var mValueList = oValueListModel.getObject("/");
			return mValueList.$model.getMetaModel().createBindingContext('/' + mValueList.CollectionPath + '/' + oPropertyContext.getObject());
		},
		formatIconTabFilterText : function(sIconTabFilterText, oCM) {

			var oResourceBundle = this.getModel("sap.fe.i18n").getResourceBundle();
			return oResourceBundle.getText(sIconTabFilterText);
			// if (oCM && oCM.conditions && oCM.conditions.length !== 0){
			// 	return oResourceBundle.getText(sSelectFromList, [oCM.conditions.length]);
			// } else {
			// 	return oResourceBundle.getText(sSelectFromList, [0]);
			// }
		},
		formatSelectedItemTitle : function(sSelectedItem, oCM) {
			var oResourceBundle = this.getModel("sap.fe.i18n").getResourceBundle();
			if (oCM && oCM.conditions && oCM.conditions.length !== 0){
				return oResourceBundle.getText(sSelectedItem, [oCM.conditions.length]);
			} else {
				return oResourceBundle.getText(sSelectedItem, [0]);
			}
		},
		formatedTokenText : function(oFilterFieldType,oCondition) {
			var sResult = "";
			if (oCondition) {
				var oCM = this.getModel("cm");
				var oOperator = oCM.getFilterOperatorConfig().getOperator(oCondition.operator);
				sResult = oOperator.format(oCondition.values, oCondition, oFilterFieldType);
			}
			return sResult;
		}
	};
})();
