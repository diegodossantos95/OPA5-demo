(function(){"use strict";jQuery.sap.declare("sap.suite.ui.generic.template.js.AnnotationHelperReuseComponents");jQuery.sap.require("sap.suite.ui.generic.template.extensionAPI.UIMode");var U=sap.ui.require("sap/suite/ui/generic/template/extensionAPI/UIMode");function f(r,s){return r.componentName+"::"+r.id+"::"+s;}var a={formatIdComponentSection:function(r){return f(r,"ComponentSection");},formatIdComponentSubSection:function(r){return f(r,"ComponentSubSection");},formatIdComponentSubSectionContent:function(r){return f(r,"ComponentSubSectionContent");},formatIdComponentContainer:function(r){return f(r,"ComponentContainer");},formatVisibleComponentSection:function(r){return"{= !${_templPriv>/generic/embeddedComponents/"+r.id+"/hidden} }";},formatComponentSettings:function(i,e,r,R){var t=i.getInterface(0),m=t.getModel(),E=e.entityType?m.getODataEntityType(e.entityType):R.oEntityType;var n=r.binding;if(n){var A=m.getODataAssociationSetEnd(E,n);if(A&&A.entitySet){e=m.getODataEntitySet(A.entitySet);E=m.getODataEntityType(e.entityType);}}var s=e?sap.ui.model.odata.AnnotationHelper.format(t,e["com.sap.vocabularies.Common.v1.SemanticObject"]):R.semanticObject;var o="";if(E&&E.key){E.key.propertyRef.forEach(function(k){o+="{"+k.name+"}::";});o=o.replace(/::$/,"");}var b={"uiMode":"{= ${ui>/createMode} ? '"+U.Create+"' : ( ${ui>/editable} ? '"+U.Edit+"' : '"+U.Display+"') }","semanticObject":s||""};if(r){jQuery.extend(b,r.settings);var v=JSON.stringify(b);v=v.replace(/\}/g,"\\}").replace(/\{/g,"\\{");return v;}}};sap.suite.ui.generic.template.js.AnnotationHelperReuseComponents=a;sap.suite.ui.generic.template.js.AnnotationHelperReuseComponents.formatComponentSettings.requiresIContext=true;})();