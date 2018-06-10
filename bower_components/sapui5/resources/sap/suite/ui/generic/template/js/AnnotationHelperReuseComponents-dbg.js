(function () {
	"use strict";

	jQuery.sap.declare("sap.suite.ui.generic.template.js.AnnotationHelperReuseComponents");
	
	jQuery.sap.require("sap.suite.ui.generic.template.extensionAPI.UIMode");
	var UIMode = sap.ui.require("sap/suite/ui/generic/template/extensionAPI/UIMode");

	function fnFormatId(oReuseComponent, sSuffix){
		return oReuseComponent.componentName + "::" + oReuseComponent.id + "::" + sSuffix;                         
	}
	
	var oAnnotationHelperReuseComponents = {
		
		formatIdComponentSection: function(oReuseComponent){
			return fnFormatId(oReuseComponent, "ComponentSection");	
		},

		formatIdComponentSubSection: function(oReuseComponent){
			return fnFormatId(oReuseComponent, "ComponentSubSection");	
		},
		
		formatIdComponentSubSectionContent: function(oReuseComponent){
			return fnFormatId(oReuseComponent, "ComponentSubSectionContent");	
		},
		
		formatIdComponentContainer: function(oReuseComponent){
			return fnFormatId(oReuseComponent, "ComponentContainer");	
		},
		
		formatVisibleComponentSection: function(oReuseComponent){
			return "{= !${_templPriv>/generic/embeddedComponents/" + oReuseComponent.id + "/hidden} }";
		},

		formatComponentSettings: function(oInterface, oEntitySet, oReuseComponent, oRoutingSpec)	{
			var oThisInterface = oInterface.getInterface(0),
				oMetaModel = oThisInterface.getModel(),
				oEntityType = oEntitySet.entityType ? oMetaModel.getODataEntityType(oEntitySet.entityType) : oRoutingSpec.oEntityType;
			var sNavigationProperty = oReuseComponent.binding;
			if (sNavigationProperty) {
				// from now on we need to set the entity set to the target
				var oAssociationEnd = oMetaModel.getODataAssociationSetEnd(oEntityType, sNavigationProperty);
				if (oAssociationEnd && oAssociationEnd.entitySet) {
					oEntitySet = oMetaModel.getODataEntitySet(oAssociationEnd.entitySet);
					// fix the type to the target type
					oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
				}
			}
			var sSemanticObject = oEntitySet ? sap.ui.model.odata.AnnotationHelper.format(oThisInterface, oEntitySet["com.sap.vocabularies.Common.v1.SemanticObject"]) : oRoutingSpec.semanticObject;
			var sObjectKeys = "";
			if (oEntityType && oEntityType.key){
				oEntityType.key.propertyRef.forEach(function (key) {
					sObjectKeys += "{" + key.name + "}::";
				});
				sObjectKeys = sObjectKeys.replace(/::$/, "");
			}
			var	settings = {
			        //Bind the UI mode to the component. Three states are allowed (display,edit,create)
					"uiMode": "{= ${ui>/createMode} ? '" +
					    UIMode.Create +
					    "' : ( ${ui>/editable} ? '" +
					    UIMode.Edit +
					    "' : '" +
					    UIMode.Display +
					    "') }",
                    // The semanti cobject is constant for this context
					"semanticObject": sSemanticObject || ""
				};


			if (oReuseComponent) {
				jQuery.extend(settings, oReuseComponent.settings);
				var sValue = JSON.stringify(settings);
				sValue = sValue.replace(/\}/g, "\\}").replace(/\{/g, "\\{"); // check bindingparser.js escape function
				return sValue;
			}
		}
	};
	
	sap.suite.ui.generic.template.js.AnnotationHelperReuseComponents = oAnnotationHelperReuseComponents;
	
	sap.suite.ui.generic.template.js.AnnotationHelperReuseComponents.formatComponentSettings.requiresIContext = true;

})();