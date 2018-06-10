/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

(function () {
	"use strict";

	/*
	 This class contains annotation helpers that might be used from several templates or controls
	 */

	jQuery.sap.declare("sap.fe.core.AnnotationHelper");

	sap.fe.core.AnnotationHelper = {
		/* this helper can be activated to debug template processing
		debug: function (oContext) {
			//debugger;
		},
		*/

		// returns the meta context path of a context
		getMetaContextPath: function (oContext) {
			return oContext.getPath();
		},

		// creates meta context from a meta context path
		getMetaContext: function (oTemplateContext) {
			return oTemplateContext.getModel().getVisitor().getSettings().models["sap.fe.metaModel"].createBindingContext(oTemplateContext.getObject());
		},

		/*
		 getUI5Type : function(oInterface, sEntitySet, sFilterItemPath){
		 var oMetaModel = oInterface.getInterface(0).getModel();
		 if (typeof sFilterItemPath === 'object'){
		 // we need to get the filterItem name via @sapui.name
		 sFilterItemPath = oMetaModel.getObject(oInterface.getInterface(1).getPath() + '@sapui.name');
		 }

		 return oMetaModel.getUI5Type("/" + sEntitySet + "/" + sFilterItemPath).getName();
		 },
		 */

		getLineItemPresentation: function (oParamModel) {
			var mParameter = oParamModel.getObject();
			var oMetaModel = mParameter.metaModel;
			var oModel = oParamModel.getModel();
			var oWorkingContext;
			if (oModel.getProperty("/workingContext")) {
				oWorkingContext = oModel.getProperty("/workingContext");
			} else {
				oWorkingContext = sap.fe.core.AnnotationHelper._getWorkingContext(oMetaModel, mParameter.entitySet, undefined);
				oModel.setProperty("/workingContext", oWorkingContext);
			}
			return oMetaModel.getMetaContext(oWorkingContext.lineItemPath);
		},

		getChartPresentation: function (oParamModel) {
			var mParameter = oParamModel.getObject();
			var oMetaModel = mParameter.metaModel;
			var oModel = oParamModel.getModel();
			var oWorkingContext;
			if (oModel.getProperty("/workingContext")) {
				oWorkingContext = oModel.getProperty("/workingContext");
			} else {
				oWorkingContext = sap.fe.core.AnnotationHelper._getWorkingContext(oMetaModel, mParameter.entitySet, undefined);
				oModel.setProperty("/workingContext", oWorkingContext);
			}
			return oMetaModel.getMetaContext(oWorkingContext.chartPath);
		},

		_getWorkingContext: function(oMetaModel, sEntitySet, sQualifier) {
			var sAnnotationPath,
				oWorkingContext = {},
				selectionPresentationVariant,
				presentationVariant,
				sEntitySetPath = '/' + sEntitySet;

			/* Find SelectionPresentationVariant */
			sAnnotationPath =  sEntitySetPath + "/@com.sap.vocabularies.UI.v1.SelectionPresentationVariant" + (sQualifier ? "#" + sQualifier : "");
			oWorkingContext.selectionPresentationVariant = oMetaModel.getObject(sAnnotationPath);
			oWorkingContext.selectionPresentationVariantQualifier = sAnnotationPath.split("#")[1] || "";
			oWorkingContext.selectionPresentationVariantPath = sAnnotationPath;
			selectionPresentationVariant = oWorkingContext.selectionPresentationVariant;
			/* Find PresentationVariant */
			if (selectionPresentationVariant && selectionPresentationVariant.PresentationVariant) {
				if (selectionPresentationVariant.PresentationVariant.$Path) {
					//Path for PV is specified
					sAnnotationPath = sEntitySetPath + "/" + selectionPresentationVariant.PresentationVariant.$Path;
				} else {
					//PV is defined inline and NOT via path
					sAnnotationPath = sAnnotationPath + "/PresentationVariant";
				}
			} else {
				sAnnotationPath = sEntitySetPath + "/@com.sap.vocabularies.UI.v1.PresentationVariant" + (sQualifier ? "#" + sQualifier : "");
			}
			if (typeof sAnnotationPath === "string") {
				oWorkingContext.presentationVariant = oMetaModel.getObject(sAnnotationPath);
				oWorkingContext.presentationVariantPath = sAnnotationPath;
				oWorkingContext.presentationVariantQualifier = sAnnotationPath.split("#")[1] || "";
				presentationVariant = oWorkingContext.presentationVariant;
			}
			/* Determine LineItem and Chart via PV */
			if (presentationVariant && presentationVariant.Visualizations) {
				presentationVariant.Visualizations.forEach(function(visualization) {
					sAnnotationPath = sEntitySetPath + '/' + visualization.$AnnotationPath;
					if (visualization.$AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.LineItem") > -1) {
						oWorkingContext.lineItem = oMetaModel.getObject(sAnnotationPath);
						oWorkingContext.lineItemPath = sAnnotationPath;
						oWorkingContext.lineItemQualifier = sAnnotationPath.split("#")[1] || "";
					}
					if (visualization.$AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.Chart") > -1) {
						oWorkingContext.chart = oMetaModel.getObject(sAnnotationPath);
						oWorkingContext.chartPath = sAnnotationPath;
						oWorkingContext.chartQualifier = sAnnotationPath.split("#")[1] || "";
					}
				});
			}

			/* Fall back to defaults without qualifier */
			if (!oWorkingContext.lineItem) {
				sAnnotationPath = sEntitySetPath + "/@com.sap.vocabularies.UI.v1.LineItem";
				oWorkingContext.lineItem = oMetaModel.getObject(sAnnotationPath);
				oWorkingContext.lineItemPath = sAnnotationPath;
				oWorkingContext.lineItemQualifier = "";
			}
			if (!oWorkingContext.chart) {
				sAnnotationPath = sEntitySetPath + "/@com.sap.vocabularies.UI.v1.Chart";
				oWorkingContext.chart = oMetaModel.getObject(sAnnotationPath);
				oWorkingContext.chartPath = sAnnotationPath;
				oWorkingContext.chartQualifier = "";
			}
			return oWorkingContext;
		},

		isSemanticKey: function (oContext, oValue) {
			var sEntity = oContext.getPath().split('/')[1];
			var aSemanticKeys = oContext.getModel().getObject("/" + sEntity + "/@com.sap.vocabularies.Common.v1.SemanticKey");
			if (aSemanticKeys) {
				for (var i = 0; i < aSemanticKeys.length; i++) {
					if (aSemanticKeys[i].$PropertyPath === oValue.$Path) {
						return true;
					}
				}
			}
			return false;
		},

		_getEntitySetPath: function (oModel, sPropertyPath) {
			var iLength;
			var sEntitySetPath = sPropertyPath.slice(0, sPropertyPath.indexOf("/", 1));
			if (oModel.getObject(sEntitySetPath + "/$kind") === "EntityContainer") {
				iLength = sEntitySetPath.length + 1;
				sEntitySetPath = sPropertyPath.slice(iLength, sPropertyPath.indexOf("/", iLength));
			}
			return sEntitySetPath;
		},

		_isInNonFilterableProperties: function (oModel, sEntitySetPath, sContextPath) {
			var bIsNotFilterable = false;
			var oAnnotation = oModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.FilterRestrictions");
			if (oAnnotation && oAnnotation.NonFilterableProperties) {
				bIsNotFilterable = oAnnotation.NonFilterableProperties.some(function(property) {
					return property.$NavigationPropertyPath === sContextPath || property.$PropertyPath === sContextPath;
				});
			}
			return bIsNotFilterable;
		},

		_isContextPathFilterable: function (oModel, sEntitySetPath, sContexPath) {
			var aContext = sContexPath.split("/"),
				bIsNotFilterable = false,
				sContext = "";

			aContext.some(function(item, index, array) {
				if (sContext.length > 0) {
					sContext += "/" + item;
				} else {
					sContext = item;
				}
				if (index === array.length - 1) {
					//last path segment
					bIsNotFilterable = sap.fe.core.AnnotationHelper._isInNonFilterableProperties(oModel, sEntitySetPath, sContext);
				} else if (oModel.getObject(sEntitySetPath + "/$NavigationPropertyBinding/" + item)) {
					//check existing context path and initialize it
					bIsNotFilterable = sap.fe.core.AnnotationHelper._isInNonFilterableProperties(oModel, sEntitySetPath, sContext);
					sContext = "";
					//set the new EntitySet
					sEntitySetPath = "/" + oModel.getObject(sEntitySetPath + "/$NavigationPropertyBinding/" + item);
				}
				return bIsNotFilterable === true;
			});
			return bIsNotFilterable;
		},

		isNavPropertyFilterable: function (oContext, navProperty) {
			var sEntitySetPath,
				sContext,
				bIsNotFilterable = false,
				sPropertyPath = oContext.getPath(),
				oModel = oContext.getModel();

			sEntitySetPath = sap.fe.core.AnnotationHelper._getEntitySetPath(oModel, sPropertyPath);
			sContext = sPropertyPath.slice(sEntitySetPath.length + 1);
			if (sContext.indexOf("/") < 0) {
				bIsNotFilterable = sap.fe.core.AnnotationHelper._isInNonFilterableProperties(oModel, sEntitySetPath, sContext);
			} else {
				bIsNotFilterable = sap.fe.core.AnnotationHelper._isContextPathFilterable(oModel, sEntitySetPath, sContext);
			}
			return !bIsNotFilterable;
		},

		isPropertyFilterable: function (oContext, property) {
			var sEntitySetPath,
				sProperty,
				bIsNotFilterable = false,
				oModel = oContext.getModel(),
				sPropertyPath = oContext.getPath();

			if (oModel.getObject(sPropertyPath + "@com.sap.vocabularies.UI.v1.Hidden")) {
				return false;
			}
			if (oModel.getObject(sPropertyPath + "@com.sap.vocabularies.UI.v1.HiddenFilter")) {
				return false;
			}

			sEntitySetPath = sap.fe.core.AnnotationHelper._getEntitySetPath(oModel, sPropertyPath);
			if (typeof (property) === "string") {
				sProperty = property;
			} else {
				sProperty = oModel.getObject(sPropertyPath + "@sapui.name");
			}
			if (sProperty.indexOf("/") < 0) {
				bIsNotFilterable = sap.fe.core.AnnotationHelper._isInNonFilterableProperties(oModel, sEntitySetPath, sProperty);
			} else {
				bIsNotFilterable = sap.fe.core.AnnotationHelper._isContextPathFilterable(oModel, sEntitySetPath, sProperty);
			}

			return !bIsNotFilterable;
		},

		isRequiredInFilter: function (path, oDetails) {
			var sEntitySetPath,
				sProperty,
				bIsRequired = false,
				oFilterRestrictions,
				oModel = oDetails.context.getModel(),
				sPropertyPath = oDetails.context.getPath();

			sEntitySetPath = sap.fe.core.AnnotationHelper._getEntitySetPath(oModel, sPropertyPath);
			if (typeof (path) === "string") {
				sProperty = path;
			} else {
				sProperty = oModel.getObject(sPropertyPath + "@sapui.name");
			}
			oFilterRestrictions = oModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.FilterRestrictions");
			if (oFilterRestrictions && oFilterRestrictions.RequiredProperties) {
				bIsRequired = oFilterRestrictions.RequiredProperties.some(function(property) {
					return property.$PropertyPath === sProperty;
				});
			}
			return bIsRequired;
		},

		typeFormatOptions: function (path, oDetails) {
			var oFormatOptions = "{",
				iScale,
				oModel = oDetails.context.getModel(),
				sPropertyPath = oDetails.context.getPath(),
				sType = oModel.getObject(sPropertyPath + "/$Type"),
				oTextAnnotation, oTextArrangement;

			if (sType === "Edm.Date" || sType === "Edm.DateTimeOffset" || sType === "Edm.TimeOfDay") {
				// for date and time types use the short style
				oFormatOptions += "style: 'medium'";
			} else if (sType === "Edm.Decimal") {
				// for decimal type use the scale attribute of the property (metadata)
				iScale = oModel.getObject(sPropertyPath + "/$Scale") || 0;
				switch (iScale) {
					case "floating":
						oFormatOptions += "decimals: " + (oModel.getObject(sPropertyPath + "/$Precision") || 0);
						break;
					case "variable":
						break;
					default:
						oFormatOptions += "decimals: " + iScale;
				}
			}
			oTextAnnotation = oModel.getObject(sPropertyPath + "@com.sap.vocabularies.Common.v1.Text");
			if (oTextAnnotation) {
				oTextArrangement = oModel.getObject(sPropertyPath + "@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement");
				if (oFormatOptions.length > 1) {
					oFormatOptions += ", ";
				}
				if (oTextArrangement && oTextArrangement.$EnumMember) {
					switch (oTextArrangement.$EnumMember) {
						case "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast":
							oFormatOptions += "displayFormat: 'ValueDescription'";
							break;
						case "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly":
							oFormatOptions += "displayFormat: 'Description'";
							break;
						case "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate":
							oFormatOptions += "displayFormat: 'Value'";
							break;
						default:
							oFormatOptions += "displayFormat: 'DescriptionValue'";
					}
				} else {
					oFormatOptions += "displayFormat: 'DescriptionValue'";
				}
			}
			return oFormatOptions + "}";
		},

		typeConstraints: function (path, oDetails) {
			var oConstraints = "{",
				iScale, iMaxLength,
				oModel = oDetails.context.getModel(),
				sPropertyPath = oDetails.context.getPath(),
				sType = oModel.getObject(sPropertyPath + "/$Type");

			if (sType === "Edm.Decimal") {
				// for decimal type use the scale attribute of the property (metadata)
				iScale = oModel.getObject(sPropertyPath + "/$Scale") || 0;
				switch (iScale) {
					case "floating":
						oConstraints += "decimals: " + (oModel.getObject(sPropertyPath + "/$Precision") || 0);
						break;
					case "variable":
						break;
					default:
						oConstraints += "decimals: " + iScale;
				}
			} else if (sType === "Edm.String") {
				iMaxLength = oModel.getObject(sPropertyPath + "/$MaxLength");
				if (iMaxLength) {
					oConstraints += "maxLength: " + iMaxLength;
				}
				if (oModel.getObject(sPropertyPath + "@com.sap.vocabularies.Common.v1.IsUpperCase")) {
					if (oConstraints.length > 1) {
						oConstraints += ", ";
					}
					oConstraints += "toUpperCase: true";
				}

			}
			return oConstraints + "}";
		},

		hasNavigation: function (oParamModel) {
			/*
			this is a very basic implementation, it just checks if for the entity set a entry default configuration
			with an outbound is defined - this is currently the only situation in which we support navigation.
			this coding needs to be enhanced in the future
			 */
			var oEntitySet = oParamModel.manifest["sap.fe"].entitySets[oParamModel.entitySet];

			return oEntitySet && oEntitySet.entry && oEntitySet.entry.default && oEntitySet.entry.default.outbound || false;

		},

		replaceSpecialCharsInId: function (sId) {
			if (sId.indexOf(" ") >= 0) {
				jQuery.sap.log.error("Annotation Helper: Spaces are not allowed in ID parts. Please check the annotations, probably something is wrong there.");
			}
			return sId.replace(/@/g, "").replace(/\//g, "::").replace(/#/g, "::");
		}
	};

	sap.fe.core.AnnotationHelper.getMetaContextPath.requiresIContext = true;
	sap.fe.core.AnnotationHelper.getMetaContext.requiresIContext = true;
	sap.fe.core.AnnotationHelper.getLineItemPresentation.requiresIContext = true;
	sap.fe.core.AnnotationHelper.getChartPresentation.requiresIContext = true;
	sap.fe.core.AnnotationHelper.isSemanticKey.requiresIContext = true;
	sap.fe.core.AnnotationHelper.isNavPropertyFilterable.requiresIContext = true;
	sap.fe.core.AnnotationHelper.isPropertyFilterable.requiresIContext = true;
	// sap.fe.core.AnnotationHelper.isRequiredInFilter.requiresIContext = true;

})();
