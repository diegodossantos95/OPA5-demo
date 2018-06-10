/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.uiext.inbox.splitapp.TaskExecutionUIPage");
jQuery.sap.require("sap.m.MessageToast");

/*global OData */// declare unusual global vars for JSLint/SAPUI5 validation
sap.ui.base.Object.extend("sap.uiext.inbox.splitapp.TaskExecutionUIPage",{
	
    constructor : function(Id) {
        sap.ui.base.Object.apply(this);
        this.Id = Id;
        this._oCore = sap.ui.getCore();
        this._oBundle = this._oCore.getLibraryResourceBundle("sap.uiext.inbox");
		this.oTaskExecutionUIPage = this._createTaskExecutionUIPage();
		//this.oModel = sap.ui.getCore().getModel();
    }

});

sap.uiext.inbox.splitapp.TaskExecutionUIPage.prototype._createTaskExecutionUIPage = function() {
	var that = this;
	var oTaskExecutionUIPage = that._oCore.byId(this.Id + "-taskExecUIPage");
	if(!oTaskExecutionUIPage){
		oTaskExecutionUIPage = new sap.m.Page(this.Id + "-taskExecUIPage",	{
									showNavButton: true,
									navButtonPress: function(){ 
										//_oParentSplitAppObj is set while its creation in Detail View Page
									    // when pressed, the back button should navigate back up to page 1
										//that._oParentSplitAppObj.app.backToTopDetail(); 
										that.handleNavButtonPress();
									},
		});
	}
	return oTaskExecutionUIPage;
};

sap.uiext.inbox.splitapp.TaskExecutionUIPage.prototype.getPage = function() {
	return this.oTaskExecutionUIPage;
};

sap.uiext.inbox.splitapp.TaskExecutionUIPage.prototype.handleNavButtonPress = function() {
	sap.ui.getCore().getEventBus().publish('sap.uiext.inbox','taskExecUIPageNavButtonPressed');
};

sap.uiext.inbox.splitapp.TaskExecutionUIPage.prototype.open = function() {
	var that = this;
	var oContext = that.oTaskExecutionUIPage.getBindingContext();

	if(!that.oModel){
		that.oModel = that.oTaskExecutionUIPage.getModel("inboxTCMModel");
	}
	var detailPageJSONModel = that.oTaskExecutionUIPage.getModel();
	var sTaskTitle = detailPageJSONModel.getProperty("TaskTitle", oContext);
	var sInstanceID = detailPageJSONModel.getProperty("InstanceID", oContext);
	var sSAPOrigin = detailPageJSONModel.getProperty("SAP__Origin", oContext);
	var sExecURL = that._getTaskExecutionURLCallBack(sInstanceID,sSAPOrigin);
	
	if(jQuery.device.is.android_tablet || jQuery.device.is.ipad || jQuery.device.is.desktop) {
		
		var oTaskExecWindow = window.open(sExecURL); //TODO: Can be used for open in new tab
		oTaskExecWindow.document.title = sTaskTitle;
		oTaskExecWindow.focus();
		
	} else if (jQuery.device.is.phone){
    	
    	var oHTMLContent = sap.ui.getCore().byId('tsk' + '--' + "execURLFrame");
        if(!oHTMLContent){
        	oHTMLContent = new sap.ui.core.HTML('tsk' + '--' + "execURLFrame");
        }
        var sContent = "<iframe name='myframe' src='" + sExecURL + "' scrolling='auto' id = '"+ 'tsk' + '--' + "execURLFrame"
        + "' style='position: absolute;height: 100%;width: 100%; border: none;'></iframe>" ;
           
        oHTMLContent.setContent(sContent);
        that.oTaskExecutionUIPage.setTitle(sTaskTitle);
        that.oTaskExecutionUIPage.addContent(oHTMLContent);
    }
};

sap.uiext.inbox.splitapp.TaskExecutionUIPage.prototype._getTaskExecutionURLCallBack= function(id,sapOriginId) {
    // var IDURIPart = "getTaskExecutionUrl"+"?ID='"+ id +"'&$format=json";
    var IDURIPart = '/TaskCollection' + "(InstanceID='" + id + "',SAP__Origin='" + sapOriginId + "')/UIExecutionLink?$format=json";
    var requestURI = this.oTaskExecutionUIPage.getModel("inboxTCMModel").sServiceUrl + IDURIPart;
    var url = "";
    var that = this;
    var requestOptions = {
        async:false,
        requestUri : requestURI,
        method : "GET",
        headers : {
            Accept : "application/json"
        } 
    };
    OData.request(requestOptions, function(data, request) {
        url = data.GUI_Link;
        //that._oParentSplitAppObj._oLaunchPad._hideBusyLoader();
        // that._oParentSplitAppObj.oInboxMasterPage._rerenderTask(data); //TODO: Refresh Tasks in Master Page after completing task 
    }, function(error) {
        if(error.response.statusCode == 205){
            //var eventParams = {statusCode : error.response.statusCode, statusText : error.response.statusText};
            //oModel.fireRequestFailed(eventParams);
        }else{
        //TODO: use enums for messageType.
        	//sap.m.MessageToast.show("Failed while performing action on Task");
        }
        //that._oParentSplitAppObj._oLaunchPad._hideBusyLoader();
        sap.m.MessageToast.show(that._oBundle.getText("INBOX_MSG_ACTION_FAILED", [url,""]));//TODO  send Task Title
    });
    return url;
};