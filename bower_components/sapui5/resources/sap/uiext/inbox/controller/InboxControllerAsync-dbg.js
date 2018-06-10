/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.uiext.inbox.controller.InboxControllerAsync");
jQuery.sap.require("sap.uiext.inbox.controller.InboxController");
jQuery.sap.require("sap.ui.model.json.JSONModel");

sap.uiext.inbox.controller.InboxController.extend("sap.uiext.inbox.controller.InboxControllerAsync",{
	
	constructor : function() {
		
		if (sap.uiext.inbox.controller.InboxController.prototype.constructor) { 
			sap.uiext.inbox.controller.InboxController.prototype.constructor.apply(this, arguments); 
		}
		
		this.oTaskDefinitionModel = new sap.ui.model.json.JSONModel();
		this.oTaskDefinitionModel.setData({"TaskDefinitionCollection":[]});
		this.oTaskDescriptionModel = new sap.ui.model.json.JSONModel();
		this.oTaskDescriptionModel.setData({"TaskDescriptionCollection":[]});
		this.oCustomAttributeDataModel = new sap.ui.model.json.JSONModel();
		this.oCustomAttributeDataModel.setData({"CustomAttributeDataCollection":[]});
		this.oUtilityModelTaskDescription;
		this.oUtilityModelTaskDefinition;
		this.oUtilityModelCustomAttributeData;
		
		this.aFetchedTaskDefinitions = [];
		this.aBatchedTaskDefinitions = [];
		this.aFetchedTaskDescriptions = [];
		this.aBatchedTaskDescriptions = [];
		this.aFetchedCustomAttributes = [];
		this.aBatchedCustomAttributes = [];
		this.oBatchTimer;
		this.sLoadingText;
		//TODO : Following threshold values needs to be optimized.
		this.iBatchThreshold = 50;
		this.iTimerThreshold = 1000;
    },
    
    setModel : function(oModel){
    	if (sap.uiext.inbox.controller.InboxController.prototype.setModel) { 
			sap.uiext.inbox.controller.InboxController.prototype.setModel.apply(this, arguments); 
		}
    	if(oModel instanceof sap.ui.model.odata.ODataModel || oModel instanceof sap.ui.model.odata.v2.ODataModel)
    	{
    		this.oUtilityModelTaskDescription = new sap.ui.model.odata.ODataModel(oModel.sServiceUrl);
        	this.oUtilityModelCustomAttributeData = new sap.ui.model.odata.ODataModel(oModel.sServiceUrl);
        	this.oUtilityModelTaskDefinition = new sap.ui.model.odata.ODataModel(oModel.sServiceUrl);
        	this.getView()._getComponent('tasksRowRepeater').setModel(this.oTaskDefinitionModel,"TaskDefinitionModel").setModel(this.oTaskDescriptionModel,"TaskDescriptionModel");
        	this.getView()._getComponent('listViewTable').setModel(this.oTaskDefinitionModel,"TaskDefinitionModel").setModel(this.oCustomAttributeDataModel,"CustomAttributeDataModel");
        	//this.getView()._getComponent('listViewTable').setModel(this.oCustomAttributeDataModel,"CustomAttributeDataModel");    	
        	//this.getView()._getComponent('tasksRowRepeater').setModel(this.oTaskDescriptionModel,"TaskDescriptionModel");

    	}
    },
    
    setView : function(oView){
    	if (sap.uiext.inbox.controller.InboxController.prototype.setView) { 
			sap.uiext.inbox.controller.InboxController.prototype.setView.apply(this, arguments); 
		}
    	this.sLoadingText = oView._oBundle.getText("INBOX_LP_LOADING");
    },
    
    
    getExpandParameters : function(){
    	return "";
    },
    
    addReadTaskDefinitionToBatch : function(sTaskInstanceId, sTaskDefinitionID, sSapOriginID){
    	if(this.aFetchedTaskDefinitions.indexOf(sTaskDefinitionID+sSapOriginID) === -1 && this.aBatchedTaskDefinitions.indexOf(sTaskDefinitionID+sSapOriginID) === -1)
    	{
    			if(this.oBatchTimer === undefined){
    				this._startBatchTimer();
    			}
    			var sRequestURI = this._getRequestURLTaskDefinitionData(sTaskInstanceId, sSapOriginID);    	
    			var batchOperation = this.oUtilityModelTaskDefinition.createBatchOperation(sRequestURI,"GET");
    			this.oUtilityModelTaskDefinition.addBatchReadOperations([batchOperation]);
    			this.aBatchedTaskDefinitions.push(sTaskDefinitionID+sSapOriginID);
    			if(this.aBatchedTaskDefinitions.length === this.iBatchThreshold){
    				this._submitBatchTaskDefinitions(this.oUtilityModelTaskDefinition);
    				this.aBatchedTaskDefinitions = [];
    			}
    	}
    	return "";
    },
    
    _getRequestURLTaskDefinitionData : function(sTaskInstanceId, sSapOriginID){
    	var constants = this.getView().constants;
    	var oTaskCollectionTCMMetadata = constants.TaskCollection;
    	var sURIPart = constants.forwardSlash 
    	+ oTaskCollectionTCMMetadata.entityName 
    			+ "(" 
    				+ oTaskCollectionTCMMetadata.properties.instanceID
    						+ "='"
    								+ sTaskInstanceId + 
    									"',"
    										+ constants.sapOrigin 
    											+ "='" 
    												+ sSapOriginID 
    														+ "')" 
    															+ constants.forwardSlash
    																+ oTaskCollectionTCMMetadata.navParam.taskDefinition;
    	return sURIPart;
    	
    	
    },    

    _submitBatchTaskDefinitions : function(oModel){
		var that = this;
		oModel.submitBatch(function(data,response){
			//Process custom attribute definition response
			that._processTaskDefinitionsResponse(data.__batchResponses);
			//that.oSplitAppObj._oLaunchPad._hideBusyLoader();
		},function(error){
			var errorBody = jQuery.parseJSON(error.response.body);
		},true);
	},

	_processTaskDefinitionsResponse : function(taskDefinitionsResponses){
		var taskDefinitionResponse , sSapOrigin, sTaskDefinitionID, sCategory, results, taskDefinitionData = [], oValue ={};
		function oKey(sTaskDefinitionID,sSapOrigin){
			this.sSapOrigin = sSapOrigin;
			this.sTaskDefinitionID=sTaskDefinitionID;
		};
		oKey.prototype.toString = function(){
			return this.sTaskDefinitionID+this.sSapOrigin;
		}
		
		for(var index=0; index < taskDefinitionsResponses.length; index++){	
			taskDefinitionResponse = taskDefinitionsResponses[index];
			if(taskDefinitionResponse && taskDefinitionResponse.statusCode && taskDefinitionResponse.statusCode == 200){
				results = taskDefinitionResponse.data				
				sSapOrigin = results.SAP__Origin;
				sTaskDefinitionID = results.TaskDefinitionID;
				sCategory = results.Category;
				taskDefinitionData[new oKey(sTaskDefinitionID, sSapOrigin)] = {Category : sCategory};
				this.aFetchedTaskDefinitions.push(sTaskDefinitionID+sSapOrigin);
			}else {
				this.aBatchedTaskDefinitions = [];
			}			
		}
		this.oTaskDefinitionModel.setData({"TaskDefinitionCollection":taskDefinitionData},true);
		taskDefinitionData = [];
	},
	
	addReadTaskDescriptionToBatch : function(sTaskInstanceId, sSapOriginID){
		if(this.aFetchedTaskDescriptions.indexOf(sTaskInstanceId+sSapOriginID) === -1 && this.aBatchedTaskDescriptions.indexOf(sTaskInstanceId+sSapOriginID) === -1)
    	{
    			if(this.oBatchTimer === undefined){
    				this._startBatchTimer();
    			}
    			var sRequestURI = this._getRequestURLTaskDescriptionData(sTaskInstanceId, sSapOriginID);    	
    			var batchOperation = this.oUtilityModelTaskDescription.createBatchOperation(sRequestURI,"GET");
    			this.oUtilityModelTaskDescription.addBatchReadOperations([batchOperation]);
    			this.aBatchedTaskDescriptions.push(sTaskInstanceId+sSapOriginID);
    			if(this.aBatchedTaskDescriptions.length === this.iBatchThreshold){
    				this.aBatchedTaskDescriptions = [];
    				this._submitBatchTaskDescriptions(this.oUtilityModelTaskDescription);    				
    			}
    	}
    			return this.sLoadingText;
		
	},
	
	_submitBatchTaskDescriptions : function(oModel){
			var that = this;
			oModel.submitBatch(function(data,response){
				that._processTaskDescriptionResponse(data.__batchResponses);
			},function(error){
				var errorBody = jQuery.parseJSON(error.response.body);
			},true);		
	},
	
	_processTaskDescriptionResponse : function(taskDescriptionResponses){
		var taskDescriptionResponse , sSapOrigin, sTaskInstanceID, sDescription,sDescriptionAsHtml, results, taskDescriptionData = {}, oValue ={};
		function oKey(sTaskInstanceID,sSapOrigin){
			this.sSapOrigin = sSapOrigin;
			this.sTaskInstanceID=sTaskInstanceID;
		};
		oKey.prototype.toString = function(){
			return this.sTaskInstanceID+this.sSapOrigin;
		}
		
		for(var index=0; index < taskDescriptionResponses.length; index++){	
			taskDescriptionResponse = taskDescriptionResponses[index];
			if(taskDescriptionResponse && taskDescriptionResponse.statusCode && taskDescriptionResponse.statusCode == 200){
				results = taskDescriptionResponse.data				
				sSapOrigin = results.SAP__Origin;
				sTaskInstanceID = results.InstanceID;
				sDescription = results.Description;
				sDescriptionAsHtml = results.DescriptionAsHtml
				taskDescriptionData[new oKey(sTaskInstanceID, sSapOrigin)] = {Description : sDescription, DescriptionAsHtml : sDescriptionAsHtml};
				this.aFetchedTaskDescriptions.push(sTaskInstanceID+sSapOrigin);
			}else {
				this.aBatchedTaskDescriptions = [];
			}			
		}
		this.oTaskDescriptionModel.setData({"TaskDescriptionCollection":taskDescriptionData},true);
	},
	
	_getRequestURLTaskDescriptionData : function(sTaskInstanceId, sSapOriginID){
		var constants = this.getView().constants;
    	var oTaskCollectionTCMMetadata = constants.TaskCollection;
    	var sURIPart = constants.forwardSlash 
    	+ oTaskCollectionTCMMetadata.entityName 
    			+ "(" 
    				+ oTaskCollectionTCMMetadata.properties.instanceID
    						+ "='"
    								+ sTaskInstanceId + 
    									"',"
    										+ constants.sapOrigin 
    											+ "='" 
    												+ sSapOriginID 
    														+ "')" 
    															+ constants.forwardSlash
    																+ oTaskCollectionTCMMetadata.navParam.taskDescription;
    	return sURIPart;
	},
	
	addReadCustomAttributeDataToBatch : function(sTaskInstanceId,sSapOriginID){
		
		if(this.aFetchedCustomAttributes.indexOf(sTaskInstanceId + sSapOriginID) === -1 && this.aBatchedCustomAttributes.indexOf(sTaskInstanceId + sSapOriginID) === -1)
    	{
    			if(this.oBatchTimer === undefined){
    				this._startBatchTimer();
    			}
    			var sRequestURI = this.getRequestURLCustomAttributeData(sTaskInstanceId, sSapOriginID);    	
    			var batchOperation = this.oUtilityModelCustomAttributeData.createBatchOperation(sRequestURI,"GET");
    			this.oUtilityModelCustomAttributeData.addBatchReadOperations([batchOperation]);
    			this.aBatchedCustomAttributes.push(sTaskInstanceId + sSapOriginID);
    			if(this.aBatchedCustomAttributes.length === this.iBatchThreshold){
    				this.aBatchedCustomAttributes = [];
    				this._submitBatchCustomAttributeData(this.oUtilityModelCustomAttributeData);    				
    			}
    	}
    			return this.sLoadingText;
		
	},
	
	getRequestURLCustomAttributeData : function(sTaskInstanceID, sSapOriginID){
			var constants = this.getView().constants;
			var oTaskCollectionTCMMetadata = constants.TaskCollection;
			var sURIPart = constants.forwardSlash 
			+ oTaskCollectionTCMMetadata.entityName 
					+ "(" 
						+ oTaskCollectionTCMMetadata.properties.instanceID
								+ "='"
										+ sTaskInstanceID + 
											"',"
												+ constants.sapOrigin 
													+ "='" 
														+ sSapOriginID 
																+ "')" 
																	+ constants.forwardSlash
																		+ oTaskCollectionTCMMetadata.navParam.customAttrValues;
			return sURIPart;
	},
	
	_submitBatchCustomAttributeData : function(oModel){
		var that = this;
		oModel.submitBatch(function(data,response){
			for(var index=0; index < data.__batchResponses.length; index++){
				that._processCustomAttributeDataResponse(data.__batchResponses[index]);
			}
		},function(error){
			var errorBody = jQuery.parseJSON(error.response.body);
		},true);		
	},
	
	_processCustomAttributeDataResponse : function(customAttributeDataResponse){
		var customAttributeData , sSapOrigin, sTaskInstanceID, results, CustomAttributeData = {}, oValue ={};
		function Key(sTaskInstanceID,sSapOrigin){
			this.sSapOrigin = sSapOrigin;
			this.sTaskInstanceID=sTaskInstanceID;
		};
		Key.prototype.toString = function(){
			return this.sTaskInstanceID+this.sSapOrigin;
		}
		if(customAttributeDataResponse && customAttributeDataResponse.statusCode && customAttributeDataResponse.statusCode == 200){
			var oKey;			
			for(var index=0; index < customAttributeDataResponse.data.results.length; index++){	
				customAttributeData = customAttributeDataResponse.data.results[index];
				if(index === 0){
					oKey = new Key(customAttributeData.InstanceID, customAttributeData.SAP__Origin);
					this.aFetchedCustomAttributes.push(customAttributeData.InstanceID + customAttributeData.SAP__Origin);
				}
				oValue[customAttributeData.Name] = customAttributeData.Value;							
			}
			CustomAttributeData[oKey] = oValue;
			
		}else {
			//TODO - remove only the current entry.
			this.aBatchedCustomAttributes = [];
		}
		//if(taskDescriptionData.length>0)
		this.oCustomAttributeDataModel.setData({"CustomAttributeDataCollection":CustomAttributeData},true);
		//taskDescriptionData = [];
	},
	
	_fireSubmitBatch : function(){
		if(this.aBatchedTaskDefinitions !== undefined && this.aBatchedTaskDefinitions.length > 0){
			this.aBatchedTaskDefinitions = [];
			this._submitBatchTaskDefinitions(this.oUtilityModelTaskDefinition);
			
		}
		if(this.aBatchedTaskDescriptions !== undefined && this.aBatchedTaskDescriptions.length > 0){
			this.aBatchedTaskDescriptions = [];
			this._submitBatchTaskDescriptions(this.oUtilityModelTaskDescription);			
		}
		if(this.aBatchedCustomAttributes !== undefined && this.aBatchedCustomAttributes.length > 0){
			this.aBatchedCustomAttributes = [];
			this._submitBatchCustomAttributeData(this.oUtilityModelCustomAttributeData);			
		}
		
		this._stopBatchTimer();
	},
	
	_startBatchTimer : function(){
		var that = this;
		this.oBatchTimer = window.setInterval(function(){that._fireSubmitBatch();},this.iTimerThreshold);
	},
	
	_stopBatchTimer : function(){
		window.clearInterval(this.oBatchTimer);
		this.oBatchTimer = undefined;
	},
	
	getTaskInitiatorIconParts : function(){
    	return [{path: "InstanceID"},
    			{path: "TaskDefinitionID"},
    			{path: "SAP__Origin"},
    			{path: "CreatedBy"},
    			{path: ("TaskDefinitionModel>Category")}
    		   ];
    },
    
    getTaskInitiatorIconFormatter : function(that){
    	return function(sInstanceID, sTaskDefinitionID, sSAPOrigin, sCreatedBy, sCategory ){
				if(!sCreatedBy){
					if(sInstanceID && sTaskDefinitionID && sSAPOrigin){
						var iconURL;
						if(sCategory === null){
							this.bindElement("TaskDefinitionModel>/TaskDefinitionCollection/"+ sTaskDefinitionID + sSAPOrigin + "/");
							return "";
						}
						if(sCategory != null){			
							this.setVisible(true);
							var categoryValue = sCategory.toUpperCase();							
							if(categoryValue === that._oBundle.getText("ALERT"))
								iconURL = that.constants.iconPool.getIconURI("alert");
							else if(categoryValue === that._oBundle.getText("NOTIFICATION"))
							   iconURL = that.constants.iconPool.getIconURI("notification-2");
							else if(categoryValue === that._oBundle.getText("TODO"))
							   iconURL = that.constants.iconPool.getIconURI("activity-2");
							else if(categoryValue === that._oBundle.getText("TASK"))
							   iconURL = that.constants.iconPool.getIconURI("task");
							return iconURL;
						}else if(this.getBindingContext()){
							that.oController.addReadTaskDefinitionToBatch(sInstanceID, sTaskDefinitionID, sSAPOrigin);
						}
					}
				}else /*if(sCreatedBy)*/{
					this.setVisible(false);
				}
									
		};
    },
    
    getExpandTaskDescriptionLinkParts : function(){
    	return [
				{path: "InstanceID"},
				{path: "SAP__Origin"},
				{path: ("TaskDescriptionModel>Description")},
				{path: ("TaskDescriptionModel>DescriptionAsHtml")}
		       ];
    },
    
    getExpandTaskDescriptionLinkFormatter : function(that){
    	return function(sInstanceID, sSAPOrigin, sDescription, sDescriptionAsHtml ){
				if(sInstanceID && sSAPOrigin){
					this.bindElement("TaskDescriptionModel>/TaskDescriptionCollection/"+ sInstanceID + sSAPOrigin + "/");							
					if (sDescription) {
						   var bIsDescriptionAsHtmlPresent = that.oTcmMetadata._isPropertyAvailable("TaskDescription","DescriptionAsHtml");
						   
							if (!bIsDescriptionAsHtmlPresent) {
								if ( sDescription && sDescription !== '') {
							
									if ( ((sDescription).search((/(<([^>]+)>)/ig)) !== -1)) {
										return 'true';
									}
								}
							} else {
								if ( sDescriptionAsHtml && sDescriptionAsHtml !== '') {
									 if ( (sDescriptionAsHtml).search((/(<([^>]+)>)/ig)) !== -1) {
										 return 'true';
									 }
								}
							}
						}
						return 'auto';
				   }														
		};
    },
    
    isFilterOnCustomAttributesSupported : function(){
    	return false;
    },
    
    isSortOnCustomAttributesSupported : function(){
    	return false;
    },
    
    getCustomAttributeColumnParts : function(sName){
    	return [{path: "InstanceID"},
				{path: "SAP__Origin"},
				{path: ("CustomAttributeDataModel>"+sName)}
			   ];
    },
    
    getCustomAttributeColumnFormatter : function(that){
	    return 	function(sInstanceID, sSAPOrigin, sCustomAttributeValue ){
				if(sInstanceID && sSAPOrigin){
					this.bindElement("CustomAttributeDataModel>/CustomAttributeDataCollection/"+ sInstanceID + sSAPOrigin + "/");							
					var oContext = this.getBindingContext();
					if(sCustomAttributeValue != null){			
							return sCustomAttributeValue;
					}else if(oContext){
						return that.oController.addReadCustomAttributeDataToBatch(sInstanceID, sSAPOrigin);
					}
				}
									
		};
    },
    
    getTaskDetailsParts : function(){
    	return [
			{path: "InstanceID"},
			{path: "SAP__Origin"},
			{path: ("TaskDescriptionModel>Description")},
			{path: ("TaskDescriptionModel>DescriptionAsHtml")}
	   ];
    },
    
    getTaskDetailsFormatter : function(that){
	    	return function(sInstanceID, sSAPOrigin, sDescription, sDescriptionAsHtml ){
				if(sInstanceID && sSAPOrigin){
					this.bindElement("TaskDescriptionModel>/TaskDescriptionCollection/"+ sInstanceID + sSAPOrigin + "/");							
					var oContext = this.getBindingContext();
					if(sDescription != null){			
						var isDescriptnAsHtmlPropPresent = that.oTcmMetadata._isPropertyAvailable("TaskDescription","DescriptionAsHtml");
		 	    		var sRegularExpToStripHtmlTags = /(<([^>]+)>)/ig;
		 	    		var description;
		 	    		if(sDescription){
		 	    			
		 	    			if (isDescriptnAsHtmlPropPresent &&  sDescriptionAsHtml !== "") {
		 	    				description = sDescriptionAsHtml;
		 	    			}
		 	    			else {
		 	    				description = sDescription;
		 	    			}
		 	    			
		 	    		}
		 	    		if(description !== null && description !== undefined && description !== "") {
		 	    			this.data('showMore',description);
	 	    				this.data('showLess', description.replace(sRegularExpToStripHtmlTags,""));
		 	    			return description.replace(sRegularExpToStripHtmlTags,"");
		 	    		} else {
		 	    			return "";
		 	    		}
					}else if(oContext){
						return that.oController.addReadTaskDescriptionToBatch(sInstanceID, sSAPOrigin);
					}
				}														
		};
    }/*,
    
    getCategoryIconURIParts : function(){
 	   return [
 				{path: "InstanceID"},
 				{path: "TaskDefinitionID"},
 				{path: "SAP__Origin"},
 				{path: ("TaskDefinitionModel>Category")}
 		   ];
    },
    
    getCategoryIconURIFormatter : function(that){
    	return function(sInstanceID, sTaskDefinitionID, sSAPOrigin, sCategory ){
			if(sInstanceID !== null && sTaskDefinitionID !== null && sSAPOrigin !== null){
				this.bindElement("TaskDefinitionModel>/TaskDefinitionCollection/"+ sTaskDefinitionID + sSAPOrigin + "/");							
				var oContext = this.getBindingContext();
				if(sCategory != null){			
					var categoryValue = sCategory.toUpperCase();
					if (categoryValue == "TASK" || categoryValue == "NOTIFICATION" || categoryValue == "TODO" || categoryValue == "ALERT") {
					   	this.setTooltip(that._oBundle.getText(that.constants.taskCategoryToolTip[categoryValue]));
						return that.constants.taskCategoryImages[categoryValue];
					}else{
						that.constants.taskCategoryImages["TASK"];
					}
				}else if(oContext){
					that.oController.addReadTaskDefinitionToBatch(sInstanceID, sTaskDefinitionID, sSAPOrigin);
				}
			}
								
		};
    }*/
    
    
    
    
	
});

