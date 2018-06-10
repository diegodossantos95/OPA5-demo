/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.base.Object.extend("sap.uiext.inbox.TCMMetadata",{constructor:function(){sap.ui.base.Object.apply(this);this.oServiceMetadata=null;this.serviceSupportsFilterOption=false;this.oSubstitutionConstants=sap.uiext.inbox.SubstitutionRulesManagerConstants;this.oInboxConstants=sap.uiext.inbox.InboxConstants;}});
sap.uiext.inbox.TCMMetadata.prototype.setServiceMetadata=function(s){if(s)this.oServiceMetadata=s;this.serviceSupportsFilterOption=this._isPropertyAvailable(this.oInboxConstants.ENTITY_NAME_TASK_COLLECTION,this.oInboxConstants.PROPERTY_NAME_CUSTOM_STATUS);};
sap.uiext.inbox.TCMMetadata.prototype.getServiceMetadata=function(){return this.oServiceMetadata;};
sap.uiext.inbox.TCMMetadata.prototype._isPropertyAvailable=function(e,p){var i=this._getProperty(e,p)?true:false;return i;};
sap.uiext.inbox.TCMMetadata.prototype._getPropertyType=function(e,p){var P=this._getProperty(e,p);if(P)return P.type;else return null;};
sap.uiext.inbox.TCMMetadata.prototype._getProperty=function(e,p){var P=null;if(this.getServiceMetadata()!=null){var E=this.getServiceMetadata().dataServices.schema[0].entityType;var t=null;jQuery.each(E,function(i,a){if(a.name===e){t=a.property;jQuery.each(t,function(i,b){if(b.name===p){P=b;return false;}});return false;}});}return P;};
sap.uiext.inbox.TCMMetadata.prototype._isEntitySet=function(e,E){var b=false;if(this.getServiceMetadata()!=null){var a=this.getServiceMetadata().dataServices.schema[0].entityContainer[0].entitySet;jQuery.each(a,function(i,c){if(c.name===e&&c.entityType===E){b=true;return false;}});}return b;};
sap.uiext.inbox.TCMMetadata.prototype._isFunctionImport=function(f){var i=this._getFunctionImport(f)?true:false;return i;};
sap.uiext.inbox.TCMMetadata.prototype.getParameterTypeForFunctionImport=function(f,p){var P=null;var F=this._getFunctionImport(f);if(F){var a=F.parameter;jQuery.each(a,function(i,b){if(b.name===p){P=b.type;return false;}});}return P;};
sap.uiext.inbox.TCMMetadata.prototype._getFunctionImport=function(f){var F=null;var a=this.getServiceMetadata().dataServices.schema[0].entityContainer[0].functionImport;jQuery.each(a,function(i,b){if(b.name===f){F=b;return false;}});return F;};
