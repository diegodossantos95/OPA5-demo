/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.base.Object.extend("sap.uiext.inbox.TCMMetadata",{ 
			
			    constructor : function() {
			
			       sap.ui.base.Object.apply(this);
			       this.oServiceMetadata= null;
			       this.serviceSupportsFilterOption=false;
			       this.oSubstitutionConstants = sap.uiext.inbox.SubstitutionRulesManagerConstants;
			       this.oInboxConstants = sap.uiext.inbox.InboxConstants;
			    }
			
});
	
sap.uiext.inbox.TCMMetadata.prototype.setServiceMetadata= function(oServiceMetadata){
	if(oServiceMetadata)
	this.oServiceMetadata= oServiceMetadata;
	this.serviceSupportsFilterOption = this._isPropertyAvailable(this.oInboxConstants.ENTITY_NAME_TASK_COLLECTION, this.oInboxConstants.PROPERTY_NAME_CUSTOM_STATUS);
};

sap.uiext.inbox.TCMMetadata.prototype.getServiceMetadata= function(){
	return this.oServiceMetadata;
};

sap.uiext.inbox.TCMMetadata.prototype._isPropertyAvailable = function(sEntityType, sProperty){
	var isPropertyAvailable = this._getProperty(sEntityType, sProperty) ?  true :  false;
	return isPropertyAvailable;
};

sap.uiext.inbox.TCMMetadata.prototype._getPropertyType = function (sEntityType, sProperty) {

	var oProperty = this._getProperty(sEntityType, sProperty);
	if (oProperty)
		return oProperty.type;
	else 
		return null;
};

sap.uiext.inbox.TCMMetadata.prototype._getProperty = function (sEntityType, sProperty) {
	var oProperty = null;
	
	if (this.getServiceMetadata() != null){
		var aEntityTypes= this.getServiceMetadata().dataServices.schema[0].entityType;
		var aTaskProperties=null;
		jQuery.each(aEntityTypes,function(index,entity){
			if(entity.name === sEntityType){
				aTaskProperties=entity.property;
				jQuery.each(aTaskProperties,function(index,prop){
					if(prop.name===sProperty){
						oProperty = prop;
						return false;
					} 
				});
				return false;
			}
		});
	}
	return oProperty;
};

sap.uiext.inbox.TCMMetadata.prototype._isEntitySet = function(sEntityName, sEntityType){
	var bEntitySet = false;
	
	if (this.getServiceMetadata() != null){
		var aEntitySets= this.getServiceMetadata().dataServices.schema[0].entityContainer[0].entitySet;
		jQuery.each(aEntitySets,function(index,entity){
			if(entity.name === sEntityName && entity.entityType === sEntityType){
				bEntitySet = true;
				return false;
			}
		});
	}
	return bEntitySet;
};

sap.uiext.inbox.TCMMetadata.prototype._isFunctionImport = function(sFunctnImportName){
	var isFunctnImport = this._getFunctionImport(sFunctnImportName) ?  true :  false;
	return isFunctnImport;
};

sap.uiext.inbox.TCMMetadata.prototype.getParameterTypeForFunctionImport = function (sFunctnImportName, sParameter) {

	var sParameterType = null;
	var oFunctionImport = this._getFunctionImport(sFunctnImportName);
	if (oFunctionImport) {
		var aParameters = oFunctionImport.parameter;
		jQuery.each(aParameters, function (index, parameter) {
			if (parameter.name === sParameter) {
				sParameterType = parameter.type;
				return false;
			} 
		});
	}
	return sParameterType;
};

sap.uiext.inbox.TCMMetadata.prototype._getFunctionImport = function(sFunctnImportName){
	var oFunctionImport = null;
	var aFimports= this.getServiceMetadata().dataServices.schema[0].entityContainer[0].functionImport;
	jQuery.each(aFimports,function(index,fimport){
		if(fimport.name===sFunctnImportName){
			oFunctionImport = fimport;
			return false;
		}
	});
	return oFunctionImport;
};
