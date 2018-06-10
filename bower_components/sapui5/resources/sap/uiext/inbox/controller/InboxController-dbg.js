/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.uiext.inbox.controller.InboxController");

sap.ui.base.Object.extend("sap.uiext.inbox.controller.InboxController",{
	
    constructor : function() {
    	sap.ui.base.Object.apply(this);
    	this.oView = null;
    	this.oModel = null;
    },
    
    setModel : function(oModel){
    	this.oModel = oModel;
    },
    
    getModel : function(oModel){
    	return this.oModel;
    },
    
    getExpandParameters : function(){
    	
    	var sExpandParams = "";
    	var oView = this.getView();
    	var isCurrentViewRowRepeater = (oView.currentView === oView.constants.rowRepeaterView) ? true :false;
    	var oTaskTypeFilterList = oView._getComponent("INBOX_FILTER_TASK_TYPE");
    	var bInitialFilterAppliedforTaskType = oTaskTypeFilterList ? oView._isInitialFilterAppliedforTaskType(oTaskTypeFilterList) : false;

    	if(oView.showTaskCategory/* && !this.clientUpdate*/){
    		sExpandParams = "TaskDefinitionData";
    	}
    	if((oView.showTaskDescription) && isCurrentViewRowRepeater){
    		if(sExpandParams.length > 0){
    			sExpandParams = sExpandParams + ",";
    	    }
    		sExpandParams = sExpandParams + "Description";
    	}
    	if(bInitialFilterAppliedforTaskType && oView.isCustomAttributesEnabled){
    		if(sExpandParams.length > 0){
    			sExpandParams = sExpandParams + ",";
    	    }
    		sExpandParams = sExpandParams + "CustomAttributeData";
    	}
    		/*if(this.isCustomAttributesEnabled && isCurrentViewRowRepeater){
    		if(expand.length > 0){
    			expand = expand + ",";
    	    }
    		expand = expand + "CustomAttributeData";
    	}*/
    	return sExpandParams;
    },
    
    setView : function(oView){
    	this.oView = oView;
    },
    
    getView : function(){
    	return this.oView;
    },
    
    getTaskInitiatorIconParts : function(){
    	return [{path: "CreatedBy"}];
    },
    
    getTaskInitiatorIconFormatter : function(that){
    return function(createdBy){
			var oContext = this.getBindingContext();
			var categoryValue;
			if (oContext) {
				categoryValue = oContext.getProperty("TaskDefinitionData/Category");
			}
			var iconURL;
			if (categoryValue !== null && categoryValue !== "" && categoryValue !== undefined) {
				categoryValue=categoryValue.toUpperCase();
				if(categoryValue === that._oBundle.getText("ALERT"))
					iconURL = that.constants.iconPool.getIconURI("alert");
				else if(categoryValue === that._oBundle.getText("NOTIFICATION"))
				   iconURL = that.constants.iconPool.getIconURI("notification-2");
				else if(categoryValue === that._oBundle.getText("TODO"))
				   iconURL = that.constants.iconPool.getIconURI("activity-2");
				else if(categoryValue === that._oBundle.getText("TASK"))
				   iconURL = that.constants.iconPool.getIconURI("task");//person-placeholder,employee-rejections
			}
			if(!createdBy){
	    		return iconURL;
	    	}else{
	    		this.setVisible(false);
	    	}
		};
    },
    
    getExpandTaskDescriptionLinkParts : function(){
    	return [{path: "Description"}];
    },
    
    getExpandTaskDescriptionLinkFormatter : function(that){
    	return function(sDescriptionValue){
			if (sDescriptionValue) {
				   // var that = this;
					var oModel = that.getCoreModel();
					var oContext = this.getBindingContext();
					var sTaskDescription = that.getModel().getProperty(that.constants.NAVIGATION_DESCRIPTION, oContext);
					var bIsDescriptionAsHtmlPresent = that.oTcmMetadata._isPropertyAvailable("TaskDescription", "DescriptionAsHtml");
				   
					if (!bIsDescriptionAsHtmlPresent) {
						if ( sTaskDescription.Description && sTaskDescription.Description !== '') {
					
							if ( ((sTaskDescription.Description).search((/(<([^>]+)>)/ig)) !== -1)) {
								return 'true';
							}
						}
					} else {
						if ( sTaskDescription.DescriptionAsHtml && sTaskDescription.DescriptionAsHtml !== '') {
							 if ( (sTaskDescription.DescriptionAsHtml).search((/(<([^>]+)>)/ig)) !== -1) {
								 return 'true';
							 }
						}
					}
				}
				return 'auto';
			};
    },
    
    isFilterOnCustomAttributesSupported : function(){
    	return true;
    },
    
    isSortOnCustomAttributesSupported : function(){
    	return true;
    },
    
    getCustomAttributeColumnParts : function(sName){
    	return [{path: "CustomAttributeData"}];
    },
    
    getCustomAttributeColumnFormatter : function(that){
	    return 	function(value){
	    	var oModel = that.getCoreModel();
	    	var NAME = "name";
        	var path = that.sCollectionPath.replace(/^\//,"")+"('"+this.data(NAME)+"')";
        	var returnValue = "";
            if(value !== undefined && value !== "" && value !== null){
            	var sTaskInstanceId = this.getModel().getProperty('InstanceID',this.getBindingContext());
            	var oCustomAttributeValuesMap = that.constants.oTaskInstanceCustomAttributeValuesMap;
            	for(var i=0;i<value.length;i++){
            		//refine this
            		var oCustomAttribute = oModel.oData[value[i]] === undefined ? oModel._original_data[value[i]] : oModel.oData[value[i]];
            		//TODO due to search oModel.oData values are getting replaced. So adding a workaround here. Needs to be properly investigated.
            		if(oCustomAttribute.Name === this.data(NAME)){
            			
            			var sAttributeName = oCustomAttribute.Name;
            			var oCustomAttributesValues = oCustomAttributeValuesMap[sTaskInstanceId];
            			
            			// caching custom attribute data for each task
            			if(!oCustomAttributesValues) {
            				var oCustomAttributesValues = {};
            				oCustomAttributesValues[oCustomAttribute.Name] = oCustomAttribute.Value;
            				oCustomAttributeValuesMap[sTaskInstanceId] = oCustomAttributesValues;
            			} else {
            				var oCustomAttributesValuesName = oCustomAttributesValues.sAttributeName;
            				if (!oCustomAttributesValuesName) {
            					oCustomAttributeValuesMap[sTaskInstanceId][sAttributeName] = oCustomAttribute.Value;
            					
            				}
            			}
            			
            			returnValue = oCustomAttribute.Value;
            			break;
                    }
            	}
            }
            return returnValue;
	    };
    },
    
    getTaskDetailsParts : function(){
    	return [{path: "Description"}];
    },
    
    getTaskDetailsFormatter : function(that){
    	return function(desc){
 	    	if(desc !== null && desc !== undefined){
 	    		var oModel = that.getCoreModel();
 	    		var isDescriptnAsHtmlPropPresent = that.oTcmMetadata._isPropertyAvailable("TaskDescription","DescriptionAsHtml");
 	    		var oContext = this.getBindingContext();
 	    		var descEntry = desc[0];
 	    		var descVal = oModel.oData[descEntry];
 	    		var sRegularExpToStripHtmlTags = /(<([^>]+)>)/ig;
 	    		var description;
 	    		if(descVal){
 	    			
 	    			if (isDescriptnAsHtmlPropPresent &&  descVal.DescriptionAsHtml !== "") {
 	    				description = descVal.DescriptionAsHtml;
 	    			}
 	    			else {
 	    				description = descVal.Description;
 	    			}
 	    			
 	    		} else {
	    			        	if (isDescriptnAsHtmlPropPresent &&  desc.DescriptionAsHtml !== "") {
	    			        		description = desc.DescriptionAsHtml ; 
	    			        	}
	    			        	else {
	    			        		description = desc.Description;
	    			        	}
 	    		}
 	    		if(description !== null && description !== undefined && description !== "") {
 	    			
 	    				this.data('showMore',description);
 	    				this.data('showLess', description.replace(sRegularExpToStripHtmlTags,""));
 	    				
 	    				return description.replace(sRegularExpToStripHtmlTags,"");
 	    		
 	    			
 	    		}
 	    	}
 	    	return "";
 	    };
   },
   
   /*getCategoryIconURIParts : function(){
	   return [{path: "TaskDefinitionData"}];
   },
   
   getCategoryIconURIFormatter : function(that){
	   return function(taskDefinitionData){
			if(taskDefinitionData != null && taskDefinitionData !== ""){
				var oModel = that.getCoreModel();
				var oContext = this.getBindingContext();
				var categoryEntry = taskDefinitionData[0];
				var taskDefEntry = oModel.oData[categoryEntry];
				var categoryValue;
				if(taskDefEntry){
					categoryValue = taskDefEntry.Category;
					//this.setVisible(true);
				}else{
					categoryValue = taskDefinitionData.Category;
					//this.setVisible(true);
				}
				
				categoryValue=categoryValue.toUpperCase();
				
				if (categoryValue == "TASK" || categoryValue == "NOTIFICATION" || categoryValue == "TODO" || categoryValue == "ALERT") {
				   	this.setTooltip(that._oBundle.getText(that.constants.taskCategoryToolTip[categoryValue]));
					return that.constants.taskCategoryImages[categoryValue];
				}
			}
			return  that.constants.taskCategoryImages["TASK"];
		};
   },*/
   
   getHtmlTextParts : function(){
	   return [{path: "Description"}];
   },
   
   getHtmlTextFormatter : function(that){
	   return function(oTaskDescriptn){
		   var isDescriptnAsHtmlPropPresent = that.oTcmMetadata._isPropertyAvailable("TaskDescription", "DescriptionAsHtml");
			  if (isDescriptnAsHtmlPropPresent) {				
					if(oTaskDescriptn.DescriptionAsHtml){
						return oTaskDescriptn.DescriptionAsHtml;
					}
			  }
			  return oTaskDescriptn.Description;
	   };
   }
    
});
