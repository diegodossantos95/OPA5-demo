/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
// Data Manager to support different oData model versions in Inbox

jQuery.sap.declare("sap.uiext.inbox.InboxDataManager");

sap.uiext.inbox.InboxDataManager = function() {
};

sap.uiext.inbox.InboxDataManager.setModel = function(oModel) {
	this._oModel = oModel;
	if (this._oModel instanceof sap.ui.model.odata.ODataModel) {
		this._sModelType = "v1"
	} else if (this._oModel instanceof sap.ui.model.odata.v2.ODataModel) {
		this._sModelType = "v2"
	}
};

sap.uiext.inbox.InboxDataManager.fireBatchRequest = function(mParameters) {
	
	if (this._sModelType == "v1") {
		
		this._oModel.clearBatch();
		this._addOperationsToBatchV1(mParameters);
	    this._oModel.submitBatch(function(oData,response) {
    		if (mParameters.fnSuccess) {
    			mParameters.fnSuccess(oData,response);
    		}
		}, function(oError) {
			if (mParameters.fnError) {
    			mParameters.fnError(oError);
    		}
	    });
		
	} else if (this._sModelType == "v2") {
		
    	this._oModel.setUseBatch(true);
    	this._oModel.setDeferredBatchGroups([mParameters.sBatchGroupId]);
    	this._addOperationsToBatchV2(mParameters);
    	
    	
    	var fnSuccess = jQuery.proxy(function(oData,response) {
    		this._oModel.setUseBatch(false);
    		if (mParameters.fnSuccess) {
    			mParameters.fnSuccess(oData,response);
    		}
		}, this);
		
		var fnError = jQuery.proxy(function(oError) {
			this._oModel.setUseBatch(false);
			if (mParameters.fnError) {
    			mParameters.fnError(oError);
    		}
	    }, this);
	    
	    this._oModel.submitChanges({batchGroupId : mParameters.sBatchGroupId, success : fnSuccess , error : fnError });
    	
	}
};

sap.uiext.inbox.InboxDataManager._addOperationsToBatchV1 = function(mParameters) {
	
	var sPath, oBatchOperation;
	
	for (var i = 0; i < mParameters.numberOfRequests; i++) {
		
		if (mParameters.sPath) {
			sPath = mParameters.sPath
		} else if (mParameters.aPaths) {
			sPath = mParameters.aPaths[i]
		}
		
		if (mParameters.aUrlParameters) {
			sPath = this._createRequestUrl(sPath, mParameters.aUrlParameters[i]);
		}
		
		if (mParameters.aProperties) {
			oBatchOperation = this._oModel.createBatchOperation(sPath, mParameters.sMethod, mParameters.aProperties[i]);
		} else {
			oBatchOperation = this._oModel.createBatchOperation(sPath, mParameters.sMethod);
		}
		
		if (mParameters.sMethod === "GET") {
			this._oModel.addBatchReadOperations([oBatchOperation]);
		} else if (mParameters.sMethod === "POST") {
			this._oModel.addBatchChangeOperations([oBatchOperation]);
		}
	}
	
};

sap.uiext.inbox.InboxDataManager._addOperationsToBatchV2 = function(mParameters) {
	
	var sPath;
	var oEntry = {
    	batchGroupId : mParameters.sBatchGroupId
    };
	
	for (var i = 0; i < mParameters.numberOfRequests; i++) {
		if (mParameters.aUrlParameters) {
			oEntry.urlParameters = mParameters.aUrlParameters[i];
		}
		if (mParameters.aProperties) {
			oEntry.properties = mParameters.aProperties[i];
		}
		if (mParameters.sPath) {
			sPath = mParameters.sPath
		} else if (mParameters.aPaths) {
			sPath = mParameters.aPaths[i]
		}
		if (!jQuery.sap.startsWith(sPath, "/")) {
			sPath = "/" + sPath;
		}
		if (mParameters.sMethod == "GET") {
			this._oModel.read(sPath, oEntry);
		} else if (mParameters.sMethod == "POST") {
			oEntry.changeSetId = "changeSetId" + i;
			this._oModel.createEntry(sPath, oEntry);
		}
	}
	
};

sap.uiext.inbox.InboxDataManager.callFunctionImport = function(sPath, mParameters, bAsync) {
	
	if (this._oModel instanceof sap.ui.model.odata.ODataModel) {
		if (bAsync != undefined) {
			mParameters.async = bAsync
		}
	}
	
	if (!jQuery.sap.startsWith(sPath, "/")) {
		sPath = "/" + sPath;
	}
	
	this._oModel.callFunction(sPath, mParameters);
};

sap.uiext.inbox.InboxDataManager.readData = function(sPath, mParameters, bAsync) {
	
	if (this._oModel instanceof sap.ui.model.odata.ODataModel) {
		if (bAsync != undefined) {
			mParameters.async = bAsync
		}
	}
	
	if (!jQuery.sap.startsWith(sPath, "/")) {
		sPath = "/" + sPath;
	}
	
	if(!(this._oModel instanceof sap.ui.model.json.JSONModel)){
		this._oModel.read(sPath, mParameters);
	}
	
};

sap.uiext.inbox.InboxDataManager._createRequestUrl = function(sPath, mUrlParameters) {
	
	var aUrlParams = [];
	var sUrl = sPath;
	
	jQuery.each(mUrlParameters, function (sName, oValue) {
		aUrlParams.push(sName + "=" + oValue);
	});
	
	if (aUrlParams && aUrlParams.length > 0) {
		sUrl += "?" + aUrlParams.join("&");
	}
	return sUrl;
};

sap.uiext.inbox.InboxDataManager.removeData = function(sPath, mParameters, bAsync) {
	
	if (this._oModel instanceof sap.ui.model.odata.ODataModel) {
		if (bAsync != undefined) {
			mParameters.async = bAsync
		}
	}
	
	if (!jQuery.sap.startsWith(sPath, "/")) {
		sPath = "/" + sPath;
	}
	
	this._oModel.remove(sPath, mParameters);
};
