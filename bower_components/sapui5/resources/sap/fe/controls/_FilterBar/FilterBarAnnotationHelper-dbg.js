/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

(function () {
	"use strict";

	/*
	 This class contains annotation helpers that are needed for the sap.fe.controls._Table.
	 */
	jQuery.sap.declare("sap.fe.controls._FilterBar.FilterBarAnnotationHelper");

	sap.fe.controls._FilterBar.FilterBarAnnotationHelper = {
		getFieldPath : function(oInterface, sEntitySet, sFieldPath){
			var oMetaModel, aSections, oProperty, bToAnyFound;

			if (sFieldPath.indexOf('/') > -1){
				oMetaModel = oInterface.getInterface(0).getModel();
				aSections = sFieldPath.split('/');
				for (var i = 0; i < ( aSections.length - 1); i++){
					oProperty = oMetaModel.getObject("/" + sEntitySet + "/" + aSections.slice(0,(i + 1)).join('/'));

					if (oProperty && oProperty["$kind"] === "NavigationProperty" && oProperty["$isCollection"]){
						aSections[i] = aSections[i] + '*';
						bToAnyFound = true;
					}
				}
				if (bToAnyFound){
					sFieldPath = aSections.join('/');
				}
			}

			return sFieldPath;
		},

		getValueStatePath : function(oInterface, sEntitySet, sFieldPath){
			var _sFieldPath = sap.fe.controls._FilterBar.FilterBarAnnotationHelper.getFieldPath(oInterface, sEntitySet, sFieldPath);
			return "{sap.fe.cm>/fieldPath/" + _sFieldPath + "/valueState}";
		},

		getValueStateTextPath : function(oInterface, sEntitySet, sFieldPath){
			var _sFieldPath = sap.fe.controls._FilterBar.FilterBarAnnotationHelper.getFieldPath(oInterface, sEntitySet, sFieldPath);
			return "{sap.fe.cm>/fieldPath/" + _sFieldPath + "/valueStateText}";
		},

		getStableIdPartFromFilterItem : function(sFieldPath) {
			return sap.fe.core.AnnotationHelper.replaceSpecialCharsInId(sFieldPath);
		}
	};

	sap.fe.controls._FilterBar.FilterBarAnnotationHelper.getFieldPath.requiresIContext = true;
	sap.fe.controls._FilterBar.FilterBarAnnotationHelper.getValueStatePath.requiresIContext = true;
	sap.fe.controls._FilterBar.FilterBarAnnotationHelper.getValueStateTextPath.requiresIContext = true;
})();
