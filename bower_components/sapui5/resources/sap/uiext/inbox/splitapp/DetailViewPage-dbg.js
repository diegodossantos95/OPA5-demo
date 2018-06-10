/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.uiext.inbox.splitapp.DetailViewPage");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.SelectDialog");
jQuery.sap.require("sap.uiext.inbox.InboxConstants");
jQuery.sap.require("sap.uiext.inbox.InboxUtils");

/*global OData */// declare unusual global vars for JSLint/SAPUI5 validation
sap.ui.base.Object.extend("sap.uiext.inbox.splitapp.DetailViewPage",{
	
    constructor : function(Id) {
        sap.ui.base.Object.apply(this);
        this.oCore = sap.ui.getCore();
        this.Id =Id;
        this.constants = sap.uiext.inbox.InboxConstants;
        this._oBundle = this.oCore.getLibraryResourceBundle("sap.uiext.inbox");
		this.utils = sap.uiext.inbox.InboxUtils;
        this.useBatch = false;
        this.isCommentsSupported = false;
        this.bPhoneDevice = jQuery.device.is.phone;
		this.detailViewPage = this._create();
    }

});

sap.uiext.inbox.splitapp.DetailViewPage.prototype._create = function() {
	var oDetailPage = this.oCore.byId(this.Id + "-detailPage");
	if(!oDetailPage){
		
		var that = this;
		var aStandardButtons = new Array();
		
		var oClaimBtn = new sap.m.Button(this.Id + "-claimBtn",{text:this._oBundle.getText("INBOX_ACTION_BUTTON_CLAIM"), icon:"sap-icon://locked", enabled:"{SupportsClaim}"});
		oClaimBtn.attachPress(this, this._handleClaim);
		aStandardButtons.push(oClaimBtn);
		
		var oReleaseBtn = new sap.m.Button(this.Id + "-releaseBtn",{text:this._oBundle.getText("INBOX_ACTION_BUTTON_RELEASE"), icon:"sap-icon://unlocked", enabled:"{SupportsRelease}"});
		oReleaseBtn.attachPress(this, this._handleRelease);
		aStandardButtons.push(oReleaseBtn);
		
		/*var oForwardBtn = new sap.m.Button(this.parentId + "frwdBtn",{text:"Forward", icon:"sap-icon://forward", enabled:true});
	oForwardBtn.attachPress(this, this._handleRelease);
	aStandardButtons.push(oForwardBtn);*/
		
		var oBar = new sap.m.Bar(this.Id + "-actionsBar", {
			contentMiddle: aStandardButtons,
		});
		
		
		
		oDetailPage = new sap.m.Page(this.Id + "-detailPage",{
			title : "{"+this.constants.PROPERTY_NAME_TASK_DEFINITION_NAME+"}",
			footer: oBar,
			showNavButton : jQuery.device.is.phone
			/*navButtonPress: function(){
			that.oSplitAppObj.app.backToTopDetail();
			}*/

		}).attachNavButtonPress(function(oEvent){
			sap.ui.getCore().getEventBus().publish('sap.uiext.inbox', "detailPageNavButtonTapped");
			
			
		});
		
		var oObjectHeader = new sap.m.ObjectHeader(this.Id + "-objHeader",{ 
			title : "{"+this.constants.PROPERTY_NAME_TASK_TITLE+"}",
			attributes: [
			              new sap.m.ObjectAttribute(this.Id + "-objDesc",{text:"{Description/Description}"}), 
			              new sap.m.ObjectAttribute().bindProperty("text", this.constants.PROPERTY_NAME_PRIORITY, function(_sPriorityValue) {
			            	  if (_sPriorityValue) {
		      						var _sPriorityTranslated = that._oBundle.getText(that.constants.prioTooltip[_sPriorityValue]);
		      						_sPriorityTranslated = (_sPriorityTranslated == "") ?  _sPriorityValue : _sPriorityTranslated;
		      						_sPriorityTranslated = that._oBundle.getText("INBOX_PRIORITY") + " : " + _sPriorityTranslated;
		      						this.setTooltip(_sPriorityTranslated);
		      						return _sPriorityTranslated ;//TODO Is this the right approach to add ":" or ASCII ?
		      					}
		      					return "";
		      			  }),
			              new sap.m.ObjectAttribute().bindProperty("text", "CompletionDeadLine", function(value){
			            	  	if(value!=null && value!= ""){
			            	  		var _sDueDate = that._oBundle.getText("INBOX_DUE_DATE") + " : " + that.utils._dateFormat(value);
			            	  		this.setTooltip(_sDueDate);
			            	  		return _sDueDate;
			            	  	}
			    		  })
						]
			/*statuses : [new sap.m.ObjectStatus({
								icon : sap.ui.core.IconPool.getIconURI("pending"),
								state : sap.ui.core.ValueState.Error
						    })
						] */
		}).setTitleActive(true);
		
		oObjectHeader.attachTitlePress(this, this._handleTaskTitlePress);
		oDetailPage.addContent(oObjectHeader);
		
		var oIconTabBar = new sap.m.IconTabBar(this.Id + "-iconTabBar", {
			items: [
			        new sap.m.IconTabFilter(this.Id + "-custAttrTab",{
			        	icon: "sap-icon://hint",
			        	iconColor: sap.ui.core.IconColor.Default,
			        	key: "customAttr"
			        })
			        	/*,
										
										new sap.m.IconTabFilter({
											icon: "sap-icon://attachment",
											iconColor: sap.ui.core.IconColor.Default,
											key: "attachments",
											content: [
												new sap.m.Label({
													text: "Attachments Section Is UnderCounstruction"
												}),
											]
										})*/
			        
			        ]
		});
		/*if(this.isCommentsSupported){
			oIconTabBar.addItem(new sap.m.IconTabFilter({
										icon: "sap-icon://collaborate",
											iconColor: sap.ui.core.IconColor.Default,
												key: "comments"
										}));
		}*/
		
		oIconTabBar.attachSelect(this,this._handleSelectIconTabFilter);
		oDetailPage.addContent(oIconTabBar);
		oDetailPage.addDelegate({
			onAfterRendering:function() {
				/*that._renderCustomActions();
				var oIconTabBar = this.oCore.byId(that.Id + '-iconTabBar');
				if(oIconTabBar.getSelectedKey() === 'customAttr'){
					oIconTabBar.getItems()[0].addContent(that._createCustomAttributes());
				}*/
			}
		});
	}
	return oDetailPage;
}

sap.uiext.inbox.splitapp.DetailViewPage.prototype._setTcmServiceURL = function(sValue) {
	this.tcmServiceURL = sValue;
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._setTcmConfiguration = function(oTCMConfiguration) {
	//TODO if string value is provided handle it.
	this.useBatch  = oTCMConfiguration.useBatch ? oTCMConfiguration.useBatch : false;  
	this.isCommentsSupported  = oTCMConfiguration.isCommentsSupported ? oTCMConfiguration.isCommentsSupported : false;
	this._createCommentsView();
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._createCommentsView = function() {
	var oIconTabBar = this.oCore.byId(this.Id + '-iconTabBar');
	if(this.isCommentsSupported){
		oIconTabBar.addItem(new sap.m.IconTabFilter(this.Id + "-commentsTab",{
									icon: "sap-icon://collaborate",
										iconColor: sap.ui.core.IconColor.Default,
											key: "comments"
									}));
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._getOModel = function() {
	if(!this.oTCMModel){
		this.oTCMModel = this.detailViewPage.getModel('inboxTCMModel');
	}
	return this.oTCMModel;
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._getPageModel = function() {
	if(!this.model){
		this.model = this.detailViewPage.getModel();
	}
	return this.model;
}

sap.uiext.inbox.splitapp.DetailViewPage.prototype.getPage = function() {
	return this.detailViewPage;
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleClaim = function(oEvent, that) {
	that.executeActionOnTask('Claim');
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleRelease = function(oEvent, that) {
	that.executeActionOnTask('Release');
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleForward = function(oEvent, that) {
	that.executeActionOnTask('Forward');
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleTaskTitlePress = function(oEvent, that) {
	that.oCore.getEventBus().publish('sap.uiext.inbox', "detailPageTaskTitleSelected", {context:that.detailViewPage.getBindingContext()})
};

/*sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleOpenTaskExecutionUI = function(oEvent, that) {
	var oTaskExecutionUIPageObj = that.oSplitAppObj._oTaskExecutionUIPageObj;
	if(!oTaskExecutionUIPageObj){
		jQuery.sap.require("sap.uiext.inbox.splitapp.TaskExecutionUIPage");
		oTaskExecutionUIPageObj = new sap.uiext.inbox.splitapp.TaskExecutionUIPage(that.oSplitAppObj.getId() + "-exUi"); 
		that.oSplitAppObj.app.addPage(oTaskExecutionUIPageObj.oTaskExecutionUIPage);
		oTaskExecutionUIPageObj._oParentSplitAppObj = that.oSplitAppObj; 
		that.oSplitAppObj._oTaskExecutionUIPageObj = oTaskExecutionUIPageObj;
	}
	oTaskExecutionUIPageObj.oTaskExecutionUIPage.setBindingContext(that.detailViewPage.getBindingContext());
	oTaskExecutionUIPageObj.open();
};*/

sap.uiext.inbox.splitapp.DetailViewPage.prototype.executeActionOnTask = function(action, forwardTo) {
	//this.oSplitAppObj._oLaunchPad._showBusyLoader();
	var isForwardAction = (action === 'Forward') ? true : false;
	var forwardTo = isForwardAction ? forwardTo : '';
	
    var selectedIDs = [], selectedContexts = [],selectedSAPOrigins = [], selectedForwardToUsers = [];
    var selectedStatus = [];
    var concatSelectedIDs = "'", concatSelectedSAPOrigins = "'", concatForwardToUsers = "'";
    var selectedID, selectedSAPOrigin;
    
    var oContext = this.detailViewPage.getBindingContext();
    selectedID = this._getPageModel().getProperty("InstanceID", oContext);
    selectedSAPOrigin = this._getPageModel().getProperty("SAP__Origin", oContext);
    
    selectedContexts.push(oContext);
    selectedIDs.push(selectedID);
    selectedSAPOrigins.push(selectedSAPOrigin);
    
    concatSelectedIDs = concatSelectedIDs + selectedID +"'";
	   concatSelectedSAPOrigins = concatSelectedSAPOrigins + selectedSAPOrigin +"'";
	   if(isForwardAction){
	  	 concatForwardToUsers = "'" + forwardTo + "'";
	   }
    
    if (selectedIDs != null || selectedIDs.length > 0) {
        var IDURIPart, requestURI, requestOptions, status;
        if (action === "Complete") {
            action = "Complete";
        }
        if (action === "Claim") {
            action = "Claim";
        }
        if (action === "Release") {
            action = "Release";
        }if(isForwardAction){
        	action = "Forward";
        }
        
        this.defaultActionHandler(action, concatSelectedIDs, concatSelectedSAPOrigins, selectedIDs, selectedSAPOrigins, selectedContexts, concatForwardToUsers);
  }
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype.defaultActionHandler = function(action, concatSelectedIDs, concatSelectedSAPOrigins, selectedIDs, selectedSAPOrigins, selectedContexts, concatForwardToUsers) {
   // var concatSelectedIDs = selectedIDs;
    var IDURIPart, requestURI, requestOptions, status;
    //var concatSAPOrigins = selectedSAPOrigins;
    var isForwardAction = (action === 'Forward') ? true : false;
    var aSelectedContextsList = selectedContexts;
    var that = this;
    var selectedIDListLength = selectedIDs.length;
    var sTaskTitle = that._getPageModel().getProperty("TaskTitle", selectedContexts[0]);
    	
    IDURIPart = '/' + action + "?InstanceID=" + concatSelectedIDs + "&SAP__Origin=" + concatSelectedSAPOrigins + "&$format=json";
    
    if (action === "Release") {
		action = that._oBundle.getText("INBOX_ACTION_BUTTON_RELEASE");
	} else if (action === "Claim") {
		action = that._oBundle.getText("INBOX_ACTION_BUTTON_CLAIM");
	} else if ( action === "Forward") {
		action = that._oBundle.getText("INBOX_ACTION_BUTTON_FORWARD");
		
	}
    
    var errorHandler = function(error){
    	//that.oSplitAppObj._oLaunchPad._hideBusyLoader();
    	sap.m.MessageToast.show(that._oBundle.getText("INBOX_MSG_ACTION_FAILED", [action,sTaskTitle]));//TODO  send Task Title
    };
    
    if(isForwardAction){
    	IDURIPart = IDURIPart + "&ForwardTo=" + concatForwardToUsers;
    }
    requestURI = this.tcmServiceURL + IDURIPart;
 
  var sSecurityToken = this._getOModel().oHeaders["x-csrf-token"];
  if(!sSecurityToken){
	  this._getOModel().refreshSecurityToken(null, null, false);
	  sSecurityToken = this._getOModel().oHeaders["x-csrf-token"];
  }
  requestOptions = {
		         async:true,
		         requestUri : requestURI,
		         method : 'POST',
		         headers : {
		                Accept : "application/json",
		                "x-csrf-token" : sSecurityToken
		         }
		  };

        OData.request(requestOptions, function(data, request) {
        	that._handleActionCompleted(data);
        	//that.oSplitAppObj._oLaunchPad._hideBusyLoader();
        	sap.m.MessageToast.show(that._oBundle.getText("INBOX_MSG_ACTION_SUCCESS", [action, data.TaskTitle]));
        }, errorHandler);
};


sap.uiext.inbox.splitapp.DetailViewPage.prototype._renderCustomActions = function() {
	var aCustomActionArray = [];
	if(this.detailViewPage.getBindingContext()){
		var oContext = this.detailViewPage.getBindingContext();
		var sInstanceID = this._getPageModel().getProperty("InstanceID", oContext);
		var sapOrigin = this._getPageModel().getProperty("SAP__Origin", oContext);
		var that = this;
		this._getOModel().read(this.constants.decisionOptionsFunctionImport,null,["InstanceID='"+sInstanceID+"'&SAP__Origin='"+sapOrigin+"'",this.constants.formatJSONURLParam],true,function(oData, response){
			aCustomActionArray = oData.results;
			that._createCustomActions(aCustomActionArray);
		},function(error){
			var errorBody = jQuery.parseJSON(error.response.body);
			sap.m.MessageToast.show(that._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_CUSTOM_ACTIONS"),{
										width: "55em",
										autoClose: false
										}
									);
		});
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._createCustomActions = function(customActionsDefinition) {
	var that = this;
	var actionButtonsToolBar = this.oCore.byId(this.Id + "-actionsBar");
	this._deleteCustomActions(customActionsDefinition, actionButtonsToolBar);
	var noOfCustomActions = customActionsDefinition.length;
	var index = 3, aRenderedCustomActions, aCustomActionsTobeRendered, bShowMore;
	if(this.bPhoneDevice){
		var showMaxCustomActions = 0;
	}else{
		var showMaxCustomActions = 7;
	}
	if(noOfCustomActions > showMaxCustomActions){
		aRenderedCustomActions = customActionsDefinition.slice(0,showMaxCustomActions+1);
		aCustomActionsTobeRendered = customActionsDefinition.slice(showMaxCustomActions,noOfCustomActions);;
		noOfCustomActions = showMaxCustomActions;
		bShowMore = true;
	}
	for(var i=0; i < noOfCustomActions; i++){
		var action = customActionsDefinition[i];
		var oCustomActionButton = that._createCustomActionButton(action);
		/*var sDecisionButtonText = !action.DecisionText? action.DecisionKey: action.DecisionText;
		var customActionButton = new sap.m.Button(this.Id + '--' + action.DecisionKey+'button', {
					icon:"sap-icon://complete",
		            text : sDecisionButtonText,
		            tooltip :  action.Description
		        }).data("type",that.constants.customAction).data("key",action.DecisionKey);
		customActionButton.attachPress(that, that._handleCustomAction);*/
		actionButtonsToolBar.insertContentMiddle(oCustomActionButton,index);
		index++;
	}
	if(bShowMore){
		var oCustomActionMoreButton = this.oCore.byId(this.Id + '--' + 'customActionMoreButton');
		if(!oCustomActionMoreButton){
			oCustomActionMoreButton = new sap.m.Button(this.Id + '--' + 'customActionMoreButton', {
				icon:"sap-icon://open-command-field"
	        }).data("type",this.constants.customAction
	        		).attachPress({"that" : that, "aCustomActionsTobeRendered" : aCustomActionsTobeRendered}, that._openCustomActionSheet);
		}
		actionButtonsToolBar.insertContentMiddle(oCustomActionMoreButton,index);
	}
	//actionButtonsToolBar.rerender();
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._openCustomActionSheet = function(oEvent, oInfo){
	var that = oInfo.that;
	var aCustomActionsTobeRendered = oInfo.aCustomActionsTobeRendered;
	var oCustomActionSheet = that.oCore.byId(that.Id + '--' + 'customActionSheet');
	if(!oCustomActionSheet){
		oCustomActionSheet = new sap.m.ActionSheet(that.Id + '--' + 'customActionSheet',{
								title: "Custom Action",
								showCancelButton: true,
								placement: sap.m.PlacementType.Top
							});
	}
	jQuery.each(aCustomActionsTobeRendered, function(i, action) {
		var oCustomActionButton = that._createCustomActionButton(action);
		oCustomActionButton.data('source','actionSheet');
		oCustomActionSheet.addButton(that._createCustomActionButton(action));
    });
	oCustomActionSheet.openBy(oEvent.getSource());
	
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._createCustomActionButton = function(action){
	var oCustomActionButton = this.oCore.byId(this.Id + '--' + action.DecisionKey+'button');
	if(!oCustomActionButton){
		var sDecisionButtonText = (action.DecisionText !== undefined && action.DecisionText !== "")? action.DecisionText: action.DecisionKey;
		var oCustomActionButton = new sap.m.Button(this.Id + '--' + action.DecisionKey+'button', {
					icon:"sap-icon://complete",
		            text : sDecisionButtonText,
		            tooltip :  action.Description
		        }).data("type",this.constants.customAction).data("key",action.DecisionKey).data("text", sDecisionButtonText);
		oCustomActionButton.attachPress(this, this._handleCustomAction);
	}
	return oCustomActionButton;
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._deleteCustomActions = function(customActionsDefinition, oActionButtonsToolBar) {
	var that = this;
	//Get All ToolBar Iems
	var oToolBarItems = oActionButtonsToolBar.getContentMiddle();
	for(var i=0; i< oToolBarItems.length; i++){
		var oToolBarItem = oToolBarItems[i];
		if(oToolBarItem instanceof sap.m.Button &&  oToolBarItem.data("type") === that.constants.customAction){
			oActionButtonsToolBar.removeContentMiddle(oToolBarItem);
			oToolBarItem.destroy();
		}
	}
	var oCustomActionSheet = that.oCore.byId(that.Id + '--' + 'customActionSheet');
	if(oCustomActionSheet){
		oCustomActionSheet.destroy();
	}
};


sap.uiext.inbox.splitapp.DetailViewPage.prototype._getPropertyValue = function(sPropertyName){
	var oContext = this.detailViewPage.getBindingContext();
	if(oContext){
		return this._getPageModel().getProperty(sPropertyName, oContext);
	}
	return null;
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleCustomAction = function(oEvent, that) {
	var oCustomActionSourceButton = oEvent.getSource();
	var sCustomActionKey = oCustomActionSourceButton.data('key');
	
	var oCustomActionCompleteButtoninPopup = that.oCore.byId(that.Id + '--' + sCustomActionKey +'cAinPopUp');
	if(!oCustomActionCompleteButtoninPopup){
		oCustomActionCompleteButtoninPopup = new sap.m.Button(that.Id + '--' + sCustomActionKey+'cAinPopUp',{
												text: oCustomActionSourceButton.data('text'),
												press: function (oEvent) {
													var sComment = that.oCore.byId(that.Id + '--' + 'addCommentsInputBtn').getValue();
													that._executeCustomAction(sComment,sCustomActionKey);
													that.oCore.byId(that.Id + '--' + 'customActionWithComments').close();
												}
											}).data('key',sCustomActionKey);
	}
	
	var oCustomActionWithCommentsPopOver = that.oCore.byId(that.Id + '--' + 'customActionWithComments');
	if(!oCustomActionWithCommentsPopOver){
		oCustomActionWithCommentsPopOver = new sap.m.ResponsivePopover(that.Id + '--' + 'customActionWithComments',{
			placement: sap.m.PlacementType.Top,
			content: new sap.m.TextArea(that.Id + '--' + 'addCommentsInputBtn',{
	        	placeholder: that._oBundle.getText("INBOX_LP_ADD_COMMENT"),
	        	maxLength: 500,
	        	width: '100%'
	        })
		});
	if (that.bPhoneDevice) {
		oCustomActionWithCommentsPopOver.setTitle( that._getPageModel().getProperty ("TaskTitle", that.detailViewPage.getBindingContext() ) );
		oCustomActionWithCommentsPopOver.setShowHeader(that.bPhoneDevice);
	}
	}
	oCustomActionWithCommentsPopOver.setBeginButton(oCustomActionCompleteButtoninPopup);
	var oCommentsInputforCAinPopOver = that.oCore.byId(that.Id + '--' + 'addCommentsInputBtn');
	if(oCommentsInputforCAinPopOver){
		oCommentsInputforCAinPopOver.setValue('');
	}
	
	if(oCustomActionSourceButton.data('source') === 'actionSheet'){
		oCustomActionWithCommentsPopOver.openBy(that.oCore.byId(that.Id + '--' + 'customActionMoreButton'));
	}else{
		oCustomActionWithCommentsPopOver.openBy(oCustomActionSourceButton);
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._executeCustomAction = function(sComment, decisionKey) {
	//this.oSplitAppObj._oLaunchPad._showBusyLoader();
	var selectedIDs = [], selectedContexts = [], selectedSAPOrigins = [];
    var selectedStatus = [];
    var concatSelectedIDs = "'", concatSelectedSAPOrigins = "'";
    var comments = [];
    var selectedID, selectedSAPOrigin;
    var that = this;
    var oContext = this.detailViewPage.getBindingContext();
    var sTaskTitle = this._getPageModel().getProperty("TaskTitle", oContext);
    selectedID = this._getPageModel().getProperty("InstanceID", oContext);
    selectedSAPOrigin = this._getPageModel().getProperty("SAP__Origin", oContext);
    
    selectedContexts.push(oContext);
    selectedIDs.push(selectedID);
    selectedSAPOrigins.push(selectedSAPOrigin);

    concatSelectedIDs = concatSelectedIDs + selectedID +"'";
	concatSelectedSAPOrigins = concatSelectedSAPOrigins + selectedSAPOrigin +"'";
    
    var IDURIPart, requestURI, requestOptions, status, selectedIDLength;
    
    selectedIDLength = selectedIDs.length;
    
	    IDURIPart = this.constants.forwardSlash + this.constants.decisionExecutionFunctionImport + this.constants.query + "InstanceID=" + concatSelectedIDs + this.constants.amperSand + "SAP__Origin=" + concatSelectedSAPOrigins + this.constants.amperSand + "DecisionKey='"+ decisionKey + "'" 
	    				+ this.constants.amperSand + this.constants.formatJSONURLParam;
	    if(sComment)
	    	IDURIPart = IDURIPart + "&Comments='"+sComment+"'";
	    requestURI = this.tcmServiceURL + IDURIPart;
	    
	    var sSecurityToken = this._getOModel().oHeaders["x-csrf-token"];
	    if(!sSecurityToken){
	  	  this._getOModel().refreshSecurityToken(null, null, false);
	  	  sSecurityToken = this._getOModel().oHeaders["x-csrf-token"];
	    }
	    requestOptions = {
	         async:true,
	         requestUri : requestURI,
	         method : 'POST',
	         headers : {
	                Accept : this.constants.acceptHeaderforJSON,
	                "x-csrf-token" : sSecurityToken
	         }
	    };
	
	    OData.request(requestOptions, function(data, request) {
	    	that._handleActionCompleted(data);
	    	//that.oSplitAppObj._oLaunchPad._hideBusyLoader();
	    	sap.m.MessageToast.show(that._oBundle.getText("INBOX_MSG_ACTION_SUCCESS", [decisionKey, data.TaskTitle]));
	    }, function(error) {
	    	//that.oSplitAppObj._oLaunchPad._hideBusyLoader();
	    	sap.m.MessageToast.show(that._oBundle.getText("INBOX_MSG_ACTION_FAILED", [decisionKey, sTaskTitle]));//TODO: Task Title to be sent
	    });
    };
    
sap.uiext.inbox.splitapp.DetailViewPage.prototype._createCustomAttributes = function() {
	if(this.detailViewPage.getBindingContext()){
		var sSelectedTaskDefinition = this._getPropertyValue('TaskDefinitionID');
		var sSapOrigin = this._getPropertyValue('SAP__Origin');
		
		var sSelectedTaskInstance = this._getPropertyValue('InstanceID'); 
		this._getCustomAttributeMetaData(sSelectedTaskDefinition,sSapOrigin, sSelectedTaskInstance);
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._getCustomAttributeMetaData = function(sTaskDefinitionID, sSapOriginID, sTaskInstanceID){
	var that = this;
	var constants = this.constants;
	var oTaskDefinitionTCMMetadata = constants.TaskDefinitionCollection;
	var aCustomAttributeMetaDataArray = constants.oTaskDefinitionCustomAttributesMap[sTaskDefinitionID];
    
    
	if(!aCustomAttributeMetaDataArray){
		var sURIPart = this._getRequestURLCustomAttributeMetaData(oTaskDefinitionTCMMetadata, sTaskDefinitionID, sSapOriginID);
		var sRequestURI = this.tcmServiceURL + sURIPart;
	    var oRequestOptions = {
	        async:true,
	        requestUri : sRequestURI,
	        method : "GET",
	        headers : {
	            Accept : constants.acceptHeaderforJSON
	        }
	    };
    
	    OData.request(oRequestOptions, function(data, request) {
            constants.oTaskDefinitionCustomAttributesMap[sTaskDefinitionID] = data.results;
            that.showHideIconTabFilters(sTaskInstanceID, sSapOriginID, data.results);
	    }, function(error) {
	    	var errorBody = jQuery.parseJSON(error.response.body);
			sap.m.MessageToast.show(that._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_CUSTOM_ATTR"),{
				width: "55em",
				autoClose: false
				}
			);
	    });
	} else {
		that.showHideIconTabFilters(sTaskInstanceID, sSapOriginID, aCustomAttributeMetaDataArray);
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype.showHideIconTabFilters = function(sTaskInstanceID, sSapOriginID, aCustomAttributesMetadataArray){
	var oIconTabBar = sap.ui.getCore().byId(this.Id + '-iconTabBar');
	var aIconTabBarItems = oIconTabBar.getItems(); 
	var sSelectedTabKey = oIconTabBar.getSelectedKey();
	if (aCustomAttributesMetadataArray.length > 0) {
		aIconTabBarItems[0].setVisible(true);
    	if (sSelectedTabKey === "customAttr" && oIconTabBar.getExpanded() === true) {
    		this._addBusyIndicatorForTaskDetails(aIconTabBarItems[0]);
    		this._getCustomAttributeData(sTaskInstanceID, sSapOriginID, aCustomAttributesMetadataArray);
    	} else if (sSelectedTabKey === "comments" && oIconTabBar.getExpanded() === true) {
    		this._handleSelectComments(aIconTabBarItems[1]);
    	}
	} else {
		aIconTabBarItems[0].setVisible(false);
		if (!(sSelectedTabKey === "comments")){
			oIconTabBar.setSelectedKey("comments");
		}
    	if (oIconTabBar.getExpanded() === true) {
    		this._handleSelectComments(aIconTabBarItems[1]);
    	}
	}
}

sap.uiext.inbox.splitapp.DetailViewPage.prototype._getCustomAttributeData = function(sTaskInstanceID, sSapOriginID, customAttributeDefArray){
	var that = this;
	var constants = this.constants;
	var oTaskCollectionTCMMetadata = constants.TaskCollection;
    var oCustomAttributeValuesMap = constants.oTaskInstanceCustomAttributeValuesMap;
	var oCustomAttributesValues = oCustomAttributeValuesMap[sTaskInstanceID];
	var oIconTabBar = sap.ui.getCore().byId(that.Id + '-iconTabBar');
	
	if(!oCustomAttributesValues){
		var sURIPart = this._getRequestURLCustomAttributeData(oTaskCollectionTCMMetadata, sTaskInstanceID, sSapOriginID);
		var sRequestURI = this._getOModel().sServiceUrl + sURIPart;
	    var oRequestOptions = {
	        async:true,
	        requestUri : sRequestURI,
	        method : "GET",
	        headers : {
	            Accept : constants.acceptHeaderforJSON
	        }
	    };
    
	    OData.request(oRequestOptions, function(data, request) {
			var customAttributeArray = that._transformCustomAttributeJsonToArray(data.results);
		    constants.oTaskInstanceCustomAttributeValuesMap[sTaskInstanceID] = customAttributeArray;
	    	oIconTabBar.getItems()[0].addContent(that._renderCustomAttributes(customAttributeDefArray, customAttributeArray));
    	}, function(error) {
	    	sap.m.MessageToast.show(that._oBundle.getText("INBOX_MSG_FETCH_CUSTOM_ATTRIBUTES_FAILS")); //TODO: Use Text created by Neelaja
	    });
	} else {
		oIconTabBar.getItems()[0].addContent(that._renderCustomAttributes(customAttributeDefArray, oCustomAttributesValues));
		}

};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleSelectIconTabFilter = function(oEvent, that) {
	var oIconTabBar = that.oCore.byId(that.Id + '-iconTabBar');
	var oIconTabBarItems = oIconTabBar.getItems();
	if(oIconTabBar.getSelectedKey() === 'customAttr'){
    	that._createCustomAttributes();
    } else if(oIconTabBar.getSelectedKey() === 'comments' && oIconTabBar.getExpanded() === true){
    	//Comments Icon is explicitly selected, so call Comments handler
    	that._handleSelectComments(oIconTabBarItems[1]);
    }
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._createCustomAttributesLayout = function(aCustomAttributeDefinitionArray,aCustomAttributeValueArray) {
	var _oIconTabBar = this.oCore.byId(this.Id + '-iconTabBar');
	
	var _oCustomAttrTab = this.oCore.byId(this.Id + '-custAttrTab');
	_oCustomAttrTab.removeAllContent();
	
	var numberOfCustomAttrValues = aCustomAttributeDefinitionArray.length;
	
	if(numberOfCustomAttrValues > 0){
		
		var scrollCont = this.oCore.byId(this.Id + "-custAttrScrollCont");
		if(!scrollCont){
			scrollCont = new sap.m.ScrollContainer(this.Id + "-custAttrScrollCont",{
				vertical: true,
				width: "auto",
			}).addStyleClass('inbox_split_app_scrollContainer');
		}
		scrollCont.removeAllContent();
	
		var formLayout = this.oCore.byId(this.Id + "-custAttForm");
		if(!formLayout){
			formLayout = new sap.ui.layout.form.SimpleForm(this.Id + "-custAttForm", {
				//minWidth:1024,
			});
		}
		formLayout.removeAllContent();
	
	
			
			for(var counter = 0; counter< numberOfCustomAttrValues; counter++){
				formLayout.addContent(new sap.m.Label({text: aCustomAttributeDefinitionArray[counter].Label}));
				formLayout.addContent(new sap.m.Text({text: aCustomAttributeValueArray[aCustomAttributeDefinitionArray[counter].Name]}));
			}
			
			scrollCont.addContent(formLayout);
			return scrollCont;
	}
};


sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleActionCompleted = function(task){
	this.oCore.getEventBus().publish('sap.uiext.inbox', "taskActionCompleted", {taskData:task})
	//this.oInboxMasterPage._rerenderTask(task);
	//var node = this._getPageModel().getProperty(this.detailViewPage.getBindingContext().getPath(), this.detailViewPage.getBindingContext());
	//node = task;
	//this._getPageModel().checkUpdate(false);
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._rerenderTaskDescription = function(description){
    var node = this._getPageModel().getProperty(this.detailViewPage.getBindingContext().getPath(), this.detailViewPage.getBindingContext());
    if(node.Description){
           node.Description.Description = description;
    }else{
           node.Description = {"Description":description};
    }
    this._getPageModel().checkUpdate(false);
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype.renderDetailsPage = function(onUpdate){
	if(this.useBatch){
		this._renderDetailsPageBatchProcessing();
	}else{
		this._renderDetailsPageNonBatchProcessing(onUpdate);
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._renderDetailsPageBatchProcessing = function(){
	var that = this;
	var customAttributeDefinitionFlag = this._addReadCustomAttributeMetaDatatoBatch();
	var customAttributeFlag = this._addReadCustomAttributeDataToBatch();
	var taskDescriptionFlag = this._addReadTaskDescriptiontoBatch();
	var customActionFlag = this._addReadCustomActionstoBatch();
	if(customActionFlag || customAttributeDefinitionFlag || customAttributeFlag){
		this._getOModel().submitBatch(function(data,response){
			  
			  var oContext = that.detailViewPage.getBindingContext();
			  var sTaskDefinitionID = that._getPageModel().getProperty("TaskDefinitionID", oContext);
	  		  var sTaskInstanceID = that._getPageModel().getProperty("InstanceID", oContext);
	  		  var index = 0;
	  		  var errMsgTskDesc, errMsgCusAcn, errMsgCusAttDef, errMsgCustAtt, errorMessage;
	  		  if(customAttributeDefinitionFlag){
	  			  //Process custom attribute definition response
	  			  errMsgCusAttDef = that._processCustomAttributeDefinitionResponse(that, data.__batchResponses[index++], sTaskDefinitionID);
	  		  }
	  		  if(customAttributeFlag){
	  			  //Process custom attribute response
	  			  errMsgCustAtt = that._processCustomAttributeResponse(that, data.__batchResponses[index++], sTaskDefinitionID, sTaskInstanceID);
	  		  }
	  		  if(taskDescriptionFlag){
		  		  //Process task description response
	  			errMsgTskDesc = that._processTaskDescriptionResponse(that, data.__batchResponses[index++], sTaskInstanceID);
	  		  }
	  		  if(customActionFlag){
		  		  //Process custom action response
	  			errMsgCusAcn = that._processCustomActionResponse(that, data.__batchResponses[index++], sTaskDefinitionID);
	  		  }
	  		  if(errMsgTskDesc){
	  			errorMessage = errMsgTskDesc; 
	  		  }
	  		  if(errMsgCusAcn){
		  			errorMessage = errorMessage?errorMessage+errMsgCusAcn:errMsgCusAcn; 
		  		  }
	  		  if(errMsgCusAttDef){
		  			errorMessage = errorMessage?errorMessage+errMsgCusAttDef:errMsgCusAttDef; 
		  		  }
	  		  if(errMsgCustAtt){
		  			errorMessage = errorMessage?errorMessage+errMsgCustAtt:errMsgCustAtt; 
		  		  }
			  if(errorMessage){
				  sap.m.MessageToast.show(errorMessage, { width: "55em", autoClose: false});
			  }
			  //that.oSplitAppObj._oLaunchPad._hideBusyLoader();
		},function(error){
			var errorBody = jQuery.parseJSON(error.response.body);
			sap.m.MessageToast.show(that._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_LOADING_DETAIL_PAGE"),{
										width: "55em",
										autoClose: false
										}
									);
			//that.oSplitAppObj._oLaunchPad._hideBusyLoader();
		},true);
	}else{
		  //that.oSplitAppObj._oLaunchPad._hideBusyLoader();
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._processTaskDescriptionResponse = function(that, taskDescriptionResponse, sTaskInstanceID){
	if(taskDescriptionResponse && taskDescriptionResponse.statusCode && taskDescriptionResponse.statusCode == 200){
		 that.constants.taskDescriptionsMap[sTaskInstanceID] = taskDescriptionResponse.data.Description;
	     that._rerenderTaskDescription(taskDescriptionResponse.data.Description);
	}else{
		  if(taskDescriptionResponse){
			  var errorBodyMessageValue;
			  if(taskDescriptionResponse.response){
				  errorBodyMessageValue = jQuery.parseJSON(taskDescriptionResponse.response.body).error.message.value;
			  }
			
			  var errorMessage = that._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_TASK_DESC");
			  return errorMessage;
			  //TODO Log in the browser console. (Log more details about error)
		  }
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._processCustomActionResponse = function(that, customActionResponse, sTaskDefinitionID){
	if(customActionResponse && customActionResponse.statusCode && customActionResponse.statusCode == 200){
		   that.constants.taskDefinitionDecisionOptionsMap[sTaskDefinitionID] = customActionResponse.data.results;
	     that._createCustomActions(customActionResponse.data.results);
	}else{
		  if(customActionResponse){
			  var errorBodyMessageValue;
			  if(customActionResponse.response){
				  errorBodyMessageValue = jQuery.parseJSON(customActionResponse.response.body).error.message.value;
			  }
			  var errorMessage = that._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_CUSTOM_ACTIONS");
			  return errorMessage;
			  //TODO Log in the browser console. (Log more details about error)
		  }
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._processCustomAttributeDefinitionResponse = function(that, customAAttributeDefinitionResponse, sTaskDefinitionID){
	  if(customAAttributeDefinitionResponse && customAAttributeDefinitionResponse.statusCode && customAAttributeDefinitionResponse.statusCode == 200){
			that.constants.oTaskDefinitionCustomAttributesMap[sTaskDefinitionID] = customAAttributeDefinitionResponse.data.results;
	  }else{
		  if(customAAttributeDefinitionResponse && !customAAttributeDefinitionResponse.statusCode){
			  var errorBodyMessageValue;
			  if(customAAttributeDefinitionResponse.response){
				  errorBodyMessageValue = jQuery.parseJSON(customAAttributeDefinitionResponse.response.body).errorBody.error.message.value;
			  }
			  var errorMessage = that._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_CUSTOM_ATTR");
			  return errorMessage;
		  }
	  }
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._processCustomAttributeResponse = function(that, customAttributeResponse, sTaskDefinitionID, sTaskInstanceID){
	  if(customAttributeResponse && customAttributeResponse.statusCode && customAttributeResponse.statusCode == 200){
			var oIconTabBar = that.oCore.byId(that.Id + '-iconTabBar');
			if(oIconTabBar.getSelectedKey() === 'customAttr'){
				var customAttributeArray = that._transformCustomAttributeJsonToArray(customAttributeResponse.data.results);
			    that.constants.oTaskInstanceCustomAttributeValuesMap[sTaskInstanceID] = customAttributeArray;
				oIconTabBar.getItems()[0].addContent(that._renderCustomAttributes(that.constants.oTaskDefinitionCustomAttributesMap[sTaskDefinitionID], customAttributeArray));
			}
	  }else{
		  if(customAttributeResponse && !customAttributeResponse.statusCode){
			  var errorBodyMessageValue;
			  if(customAttributeResponse.response){
				  errorBodyMessageValue = jQuery.parseJSON(customAttributeResponse.response.body).errorBody.error.message.value;
			  }
			  var errorMessage = that._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_CUSTOM_ATTR");
			  return errorMessage;
		  }
		  //TODO Log in the browser console. (Log more details about error)
	  }
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._addReadTaskDescriptiontoBatch = function(){
	if(this.detailViewPage.getBindingContext()){
		var oContext = this.detailViewPage.getBindingContext();
		var sInstanceID = this._getPageModel().getProperty("InstanceID", oContext);
		var sSapOriginID = this._getPageModel().getProperty("SAP__Origin", oContext);
		var constants = this.constants;
		var oTaskCollectionTCMMetadata = constants.TaskCollection;
		var taskDescription = constants.taskDescriptionsMap[sInstanceID];
		if(taskDescription){
			this._rerenderTaskDescription(taskDescription);
			return false;
		}else{
			var sRequestURI = this._getRequestURLTaskDescription(oTaskCollectionTCMMetadata, sInstanceID, sSapOriginID);
			var batchOperation = this._getOModel().createBatchOperation(sRequestURI,"GET",null);
			this._getOModel().addBatchReadOperations([batchOperation]);
			return true;
		}
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._getRequestURLTaskDescription = function(oTaskCollectionTCMMetadata, sInstanceID, sSapOriginID){
	var constants = this.constants;
	var sRequestURI = constants.forwardSlash 
	+ oTaskCollectionTCMMetadata.entityName 
		+ "(" 
			+ oTaskCollectionTCMMetadata.properties.instanceID 
					+"='" 
						+ sInstanceID + "'," 
							+ constants.sapOrigin + 
									"='" + sSapOriginID + 
											"')" +
													constants.forwardSlash 
													+  oTaskCollectionTCMMetadata.navParam.taskDescription;
	return sRequestURI;
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._addReadCustomActionstoBatch = function() {
	if(this.detailViewPage.getBindingContext()){
		var oContext = this.detailViewPage.getBindingContext();
		var sInstanceID = this._getPageModel().getProperty("InstanceID", oContext);
		var sapOrigin = this._getPageModel().getProperty("SAP__Origin", oContext);
		var sTaskDefinitionID = this._getPageModel().getProperty("TaskDefinitionID", oContext);
		var constants = this.constants;
		var oCustomActionMap = constants.taskDefinitionDecisionOptionsMap;
		var oCustomActions = oCustomActionMap[sTaskDefinitionID];
		if(oCustomActions){
			 this._createCustomActions(oCustomActions);
			 return false;
		}else{
			var sPath = this.constants.decisionOptionsFunctionImport + this.constants.query + "InstanceID='"+sInstanceID+"'&SAP__Origin='"+sapOrigin+"'"; 
			var batchOperation = this._getOModel().createBatchOperation(sPath,"GET");
			this._getOModel().addBatchReadOperations([batchOperation]);
			return true;
		}
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._addReadCustomAttributeMetaDatatoBatch = function(){
	if(this.detailViewPage.getBindingContext()){
		var oContext = this.detailViewPage.getBindingContext();
		var sTaskDefinitionID = this._getPageModel().getProperty("TaskDefinitionID", oContext);
		var sSapOriginID = this._getPageModel().getProperty("SAP__Origin", oContext);
		var constants = this.constants;
		var oTaskDefinitionTCMMetadata = constants.TaskDefinitionCollection;
		var oCustomAttributeMetaDataArrayMap = constants.oTaskDefinitionCustomAttributesMap;
		var aCustomAttributeMetaDataArray = oCustomAttributeMetaDataArrayMap[sTaskDefinitionID];
		if(!aCustomAttributeMetaDataArray){
			var sRequestURI = this._getRequestURLCustomAttributeMetaData(oTaskDefinitionTCMMetadata, sTaskDefinitionID, sSapOriginID);
			var batchOperation = this._getOModel().createBatchOperation(sRequestURI,"GET");
			this._getOModel().addBatchReadOperations([batchOperation]);
			return true;
		}else{
			return false;
		}
	}
};



sap.uiext.inbox.splitapp.DetailViewPage.prototype._getRequestURLCustomAttributeMetaData = function(oTaskDefinitionTCMMetadata, sTaskDefinitionID, sSapOriginID){
	var constants = this.constants;
	var sRequestURI = constants.forwardSlash 
	+ oTaskDefinitionTCMMetadata.entityName 
		+ "(" 
			+ oTaskDefinitionTCMMetadata.properties.taskDefnID 
					+"='" 
						+ sTaskDefinitionID + "'," 
							+ constants.sapOrigin + 
									"='" + sSapOriginID + 
											"')" +
													constants.forwardSlash 
													+  oTaskDefinitionTCMMetadata.navParam.customAttrDefn;
	return sRequestURI;
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._addReadCustomAttributeDataToBatch = function(){
	if(this.detailViewPage.getBindingContext()){
		var oContext = this.detailViewPage.getBindingContext();
		var sTaskDefinitionID = this._getPageModel().getProperty("TaskDefinitionID", oContext);
		var sTaskInstanceID = this._getPageModel().getProperty("InstanceID", oContext);
		var sSapOriginID = this._getPageModel().getProperty("SAP__Origin", oContext);
		var constants = this.constants;
		var oTaskCollectionTCMMetadata = constants.TaskCollection;
	    var oCustomAttributeValuesMap = constants.oTaskInstanceCustomAttributeValuesMap;
		var oCustomAttributesValues = oCustomAttributeValuesMap[sTaskInstanceID];
		if(oCustomAttributesValues){
			var oIconTabBar = this.oCore.byId(this.Id + '-iconTabBar');
			if(oIconTabBar.getSelectedKey() === 'customAttr'){
				var oCustomAttributeMetaDataArrayMap = constants.oTaskDefinitionCustomAttributesMap;
				var aCustomAttributeMetaDataArray = oCustomAttributeMetaDataArrayMap[sTaskDefinitionID];
				oIconTabBar.getItems()[0].addContent(this._renderCustomAttributes(aCustomAttributeMetaDataArray, oCustomAttributesValues));
			}
			return false;
		}else{
			var sRequestURI = this._getRequestURLCustomAttributeData(oTaskCollectionTCMMetadata, sTaskInstanceID, sSapOriginID);
			var batchOperation = this._getOModel().createBatchOperation(sRequestURI,"GET");
			this._getOModel().addBatchReadOperations([batchOperation]);
			return true;
		}
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._getRequestURLCustomAttributeData = function(oTaskCollectionTCMMetadata, sTaskInstanceID, sSapOriginID){
	var constants = this.constants;
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
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._renderCustomAttributes = function(aCustomAttributeDefinitionArray, aCustomAttributeValueArray) {
	var _oCustomAttrTab = this.oCore.byId(this.Id + '-iconTabBar');
	return this._createCustomAttributesLayout(aCustomAttributeDefinitionArray,aCustomAttributeValueArray);
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._transformCustomAttributeJsonToArray = function(aCustomAttributeData){
	// TO-DO : make this generic
	var oContext = this.detailViewPage.getBindingContext();
	var oCustomAttributeValuesMap = this.constants.oTaskInstanceCustomAttributeValuesMap;
	var sTaskInstanceID = this._getPageModel().getProperty("InstanceID", oContext);

	var oCustomAttributesValues = {};
	var oCustomAttributesValues;
	for(var i=0;i<aCustomAttributeData.length;i++){
		oCustomAttributesValues[aCustomAttributeData[i].Name] = aCustomAttributeData[i].Value;
		oCustomAttributeValuesMap[sTaskInstanceID] = oCustomAttributesValues;
	}
    return oCustomAttributesValues;
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._renderDetailsPageNonBatchProcessing = function(onUpdate){
	this._renderTaskDescription();
	this._renderCustomActions();
	this._createCustomAttributes();
	/*if(onUpdate){
		this.detailViewPage.getContent()[1].setSelectedKey("customAttr");
		this._createCustomAttributes();

	}else {	
		if (this.detailViewPage.getContent()[1].getSelectedKey() === "customAttr"){
			this._createCustomAttributes();
		}else{
			//TODO
			//this.oSplitAppObj._oLaunchPad._hideBusyLoader();
		}
	}*/
	};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._renderTaskDescription = function(){
	var that = this;
	var constants = this.constants;
	var oTaskCollectionTCMMetadata = constants.TaskCollection;
	var oContext = this.detailViewPage.getBindingContext();
	var sTaskInstanceID = this._getPageModel().getProperty("InstanceID", oContext);
	var sSapOriginID = this._getPageModel().getProperty("SAP__Origin", oContext);
	var taskDescription = constants.taskDescriptionsMap[sTaskInstanceID];
	if(taskDescription){
		this._rerenderTaskDescription(taskDescription);
	}else{
		var sURIPart = this._getRequestURLTaskDescription(oTaskCollectionTCMMetadata, sTaskInstanceID, sSapOriginID);
		var sRequestURI = this.tcmServiceURL + sURIPart;
	    var oRequestOptions = {
	        async:true,
	        requestUri : sRequestURI,
	        method : "GET",
	        headers : {
	            Accept : constants.acceptHeaderforJSON
	        }
	    };
    
	    OData.request(oRequestOptions, function(data, request) {
			 constants.taskDescriptionsMap[sTaskInstanceID] = data.Description;
		     that._rerenderTaskDescription(data.Description);
	    }, function(error) {
	    	var errorBody = jQuery.parseJSON(error.response.body);
	    	sap.m.MessageToast.show(that._oBundle.getText("INBOX_LP_MSG_ERROR_WHILE_FETCHING_TASK_DESC"),{
					width: "55em",
					autoClose: false
					}
				);
	    });
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleSelectComments = function(oIconTabBarCommentItem){
	//remove All content from the IconTab Bar for comments
	oIconTabBarCommentItem.removeAllContent(); 
	
	//create scroll container if not created
	var oCommentsScrollCont = this.oCore.byId(this.Id + "-commentsScrollCont");
	if(!oCommentsScrollCont){
		oCommentsScrollCont = new sap.m.ScrollContainer(this.Id + "-commentsScrollCont",{
			vertical: true,
			width: "100%",
		});
	}
	oCommentsScrollCont.removeAllContent(); //remove All content from the Scroll Container for comments
	
	
	//create Busy Indicator for Notes if not Created Yet
	var oCommentsBusyIndicator = this.oCore.byId('commentsBI');
	if(!oCommentsBusyIndicator){
		oCommentsBusyIndicator = new sap.m.BusyIndicator('commentsBI',{
										text: this._oBundle.getText("INBOX_LP_LOADING")
									});
	}
	
	oCommentsScrollCont.addContent(oCommentsBusyIndicator);
	
	//create Add Comment Container if not Created Yet
	var oAddCommentContainer = this.oCore.byId('addCommentContainer');
	if(!oAddCommentContainer){
		oAddCommentContainer = new sap.m.FlexBox("addCommentContainer",{
			width: "100%",
			items: [
				        new sap.m.TextArea('addCommentsInput',{
				        	type : sap.m.InputType.Text,
				        	placeholder : this._oBundle.getText("INBOX_LP_ADD_COMMENT"),
				        	maxLength: 500,
				        	rows : 3,
				        }).addStyleClass('inbox_split_app_addCommentInput'),
				        new sap.m.Button('addCommentsButton',{
				        	text: this._oBundle.getText("INBOX_LP_ADD_BUTTON_TEXT")
	//						        	layoutData: new sap.m.FlexItemData({growFactor: 1})
				        }).attachPress(this, this._handleCommentAdded).addStyleClass('inbox_split_app_addCommentBtn')
			        ],
			        fitContainer : true
		}).addStyleClass('inbox_split_app_addCommentContainer');
	} else {
		var oTextArea = oAddCommentContainer.getItems()[0];
		if (oTextArea) {
			oTextArea.setValue("");
		}
	}
	oCommentsScrollCont.addContent(oAddCommentContainer);
	
	//Add ScrollContainer to Comments Icon Bar 
	oIconTabBarCommentItem.addContent(oCommentsScrollCont);
	
	//Load Comments from Server
    this._getComments();
}

sap.uiext.inbox.splitapp.DetailViewPage.prototype._getComments = function(){
	if(this.detailViewPage.getBindingContext()){
		var oContext = this.detailViewPage.getBindingContext();
		var sTaskInstanceID = this._getPageModel().getProperty("InstanceID", oContext);
		var sSapOriginID = this._getPageModel().getProperty("SAP__Origin", oContext);
		var aComments = this._loadCommentsFromServer(sTaskInstanceID, sSapOriginID);
		return true;
	}
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._handleCommentAdded = function(oEvent, that){
	var sCommentText = jQuery.sap._sanitizeHTML(that.oCore.byId('addCommentsInput').getValue());
	if(that.detailViewPage.getBindingContext() && sCommentText){
		var oContext = that.detailViewPage.getBindingContext();
		var sTaskInstanceID = that._getPageModel().getProperty("InstanceID", oContext);
		var sSapOriginID = that._getPageModel().getProperty("SAP__Origin", oContext);
		var oModel = that._getOModel();
		var sRequestURI =  that.tcmServiceURL + "/AddComment?InstanceID='"+sTaskInstanceID+"'&SAP__Origin='"+sSapOriginID+"'&Text='"+encodeURIComponent(sCommentText)+"'&$format=json";
		var sSecurityToken = oModel.oHeaders["x-csrf-token"];
		if(!sSecurityToken){
		  that._getOModel().refreshSecurityToken(null, null, false);
		  sSecurityToken = oModel.oHeaders["x-csrf-token"];
		}
		var requestOptions = {
	     async:false,
	     requestUri : sRequestURI,
	     method : "POST",
	     headers : {
	         "Accept" : that.constants.acceptHeaderforJSON,
	         "x-csrf-token" : sSecurityToken
	     }
		};

		OData.request(requestOptions, function(data, request) {
			
			
			var oCommentsList = that.oCore.byId(that.Id + "--commentsList");
			that._loadCommentsFromServer(sTaskInstanceID, sSapOriginID);
			sap.m.MessageToast.show(that._oBundle.getText("INBOX_MSG_COMMENT_ADD_SUCCESS"));//TODO
			that.oCore.byId('addCommentsInput').setValue();
		}, function(error) {
		//TODO: use enums for messageType.
			sap.m.MessageToast.show(that._oBundle.getText("INBOX_MSG_COMMENT_ADD_ERROR"));//TODO
			
		});
	}
	
}

sap.uiext.inbox.splitapp.DetailViewPage.prototype._loadCommentsFromServer = function(sTaskInstanceID,sSapOriginID){
    var that = this;
    var constants = this.constants;
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
																							+ oTaskCollectionTCMMetadata.navParam.comments;
    
	var sRequestURI = this.tcmServiceURL + sURIPart;
	var aComments = [];
	
    var oRequestOptions = {
        async:true,
        requestUri : sRequestURI,
        method : "GET",
        headers : {
            Accept : constants.acceptHeaderforJSON
        }
    };

    OData.request(oRequestOptions, function(data, request) {
    	that._displayComments(data.results);
    }, function(error) {
    	sap.m.MessageToast.show(that._oBundle.getText("INBOX_MSG_FETCH_COMMENTS_FAILS"));//TODO
    });
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._displayComments = function(aCommentsData) {
	var that = this;
	var bAdd = aCommentsData && aCommentsData.length > 0 ; 
	var oCommentsScrollContainer = this.oCore.byId(this.Id + '-commentsScrollCont');
	var oCommentsBusyIndicator = this.oCore.byId('commentsBI');
	
	if(bAdd){
		var oCommentsList = this.oCore.byId(this.Id + "--commentsList");
		var oCommentsModel;
		if(!oCommentsList){
			var oCommentsList = new sap.m.List(this.Id+"--"+"commentsList").addStyleClass('inbox_split_app_CommentsList');
			oCommentsList.setShowSeparators(sap.m.ListSeparators.All);
			oCommentsModel = new sap.ui.model.json.JSONModel();
			oCommentsList.setModel(oCommentsModel);
		}else{
			oCommentsModel = oCommentsList.getModel();
		}
		oCommentsModel.setData(aCommentsData);
		var oCommentTemplate = new sap.m.FeedListItem({
			sender: "{CreatedByName}",
			text: "{Text}",
		});
		oCommentTemplate.bindProperty("timestamp","CreatedAt",this.utils.dateTimeFormat)
		oCommentTemplate.bindProperty("icon", "CreatedBy", function(value){
			if(this.getBindingContext()){
				return that.utils.getUserMediaResourceURL(that.tcmServiceURL, this.getBindingContext().getProperty("SAP__Origin"), value);
			}else{
				return "sap-icon://person-placeholder";
			}
		});
		oCommentsList.bindAggregation("items",{path:"/",template: oCommentTemplate});

		oCommentsScrollContainer.removeContent(oCommentsBusyIndicator);
		oCommentsScrollContainer.insertContent(oCommentsList,0);
	}else{
		oCommentsScrollContainer.removeContent(oCommentsBusyIndicator);
	}
	//oIconTabBar.getItems()[1].removeAllContent();
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype._displayCommentsIfCommentsSelectedinIconBar = function(){
	var oIconTabBar = this.oCore.byId(this.Id + '-iconTabBar');
    if(oIconTabBar.getSelectedKey() === 'comments' && oIconTabBar.getExpanded() === true){
    	this._handleSelectComments(oIconTabBar.getItems()[1]);
    }
};


sap.uiext.inbox.splitapp.DetailViewPage.prototype._addBusyIndicatorForTaskDetails = function(oCustomAttributesTab){
	var oCustomAttributesScrollCont = this.oCore.byId(this.Id + "-custAttrScrollCont");
	if(!oCustomAttributesScrollCont){
		oCustomAttributesScrollCont = new sap.m.ScrollContainer(this.Id + "-custAttrScrollCont",{
			vertical: true,
			width: "auto",
		}).addStyleClass('inbox_split_app_scrollContainer');
	}
	oCustomAttributesScrollCont.removeAllContent();
	
	var oCustomAttributesBusyIndicator = this.oCore.byId('customAttrBI');
	if(!oCustomAttributesBusyIndicator){
		oCustomAttributesBusyIndicator = new sap.m.BusyIndicator('customAttrBI',{
										text: this._oBundle.getText("INBOX_LP_LOADING")
									});
	}	
	oCustomAttributesScrollCont.addContent(oCustomAttributesBusyIndicator);
	oCustomAttributesTab.addContent(oCustomAttributesScrollCont);
};

sap.uiext.inbox.splitapp.DetailViewPage.prototype.updateTaskDataInModel = function(task){
	
	var bTaskCompleted = task.Status == "COMPLETED"?true:false;	
	var sPath = this.detailViewPage.getBindingContext().getPath();
	var aParts = sPath.split("/");
	if(bTaskCompleted){
		//Delete from model
		this.detailViewPage.getModel().oData.TaskCollection.splice(aParts[2], 1);
	}else{
		//Update Model
		this.detailViewPage.getModel().oData.TaskCollection[aParts[2]] = task;
	}
	this.detailViewPage.getModel().checkUpdate(false);
};