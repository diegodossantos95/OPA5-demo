/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

	jQuery.sap.declare("sap.uiext.inbox.splitapp.MasterPageController");
	sap.ui.base.Object.extend("sap.uiext.inbox.splitapp.MasterPageController",{
			
			    constructor : function() {
			        sap.ui.base.Object.apply(this);
			    }
		});

	/**
	 * Initially selects the first item (excluding for phones)
	 */
	sap.uiext.inbox.splitapp.MasterPageController.prototype._selectDetail = function () {
		var list = sap.ui.getCore().byId(this.Id + "-list");
		var items = list.getItems();
		if (!jQuery.device.is.phone && items.length > 0 && !list.getSelectedItem()) {
			list.setSelectedItem(items[0], true);
			this._showDetail(items[0]);
		}
	}
	
	sap.uiext.inbox.splitapp.MasterPageController.prototype.handleSearch = function (evt, masterPage) {
		masterPage._updateList();
	}
	
	sap.uiext.inbox.splitapp.MasterPageController.prototype._updateList = function () {
		
		var that = this;
		
		var filters = new Array();
		
		// add filter for search
		var searchString = sap.ui.getCore().byId(that.Id + "-searchFld").getValue();
		if (searchString && searchString.length > 0) {
			filters.push(new sap.ui.model.Filter("TaskTitle", sap.ui.model.FilterOperator.Contains, searchString));
		}
		
		filters = filters.concat(that.oSplitAppObj.filters);
		
		// update list binding
		var list = sap.ui.getCore().byId(that.Id + "-list");
		var oSelectedItem = list.getSelectedItem();
		var binding = list.getBinding("items");
		binding.filter(filters);
		if(filters.length == 0){ //filter length == 0 means its a normal refresh and not a search.
			list.setSelectedItem(oSelectedItem, true);
		}
	}
	
	sap.uiext.inbox.splitapp.MasterPageController.prototype.handleListSelect = function (evt, that) {
		//that.oSplitAppObj._oLaunchPad._showBusyLoader();
		//this._showDetail(evt.getParameter("listItem"));
		//TODO: TO BE REMOVED FROM HERE
		var oMasterPageList = sap.ui.getCore().byId(that.Id + "-list");
		var _iNoOfTasksInList = oMasterPageList.mBindingInfos.items.binding.iLength //TODO: Find a clean way and not use interbal variables
		that.masterPage.setTitle(that._oBundle.getText("INBOX_LP_TASKS_AND_COUNT",[_iNoOfTasksInList]));
		
		var items = oMasterPageList.getItems();
		if (items.length > 0 && !oMasterPageList.getSelectedItem()) {
			oMasterPageList.setSelectedItem(items[0], true);
		}
		var selectedItem = oMasterPageList.getSelectedItem();
		var context = selectedItem.getBindingContext();
		
		var oDetailPage = that.oSplitAppObj.oInboxDetailPage.detailViewPage;
		oDetailPage.setBindingContext(context);
		//oDetailPage.rerender();//AVIOD RERENDER

		//var oApp = that.oSplitAppObj.app;
		var oApp = that.oSplitAppObj.getAggregation('splitAppl');
		if(oDetailPage.getId() == oApp.getCurrentPage().getId()){
			that.oSplitAppObj.oInboxDetailPage.renderDetailsPage();
		}else{
			var oTaskExecutionUIPageObj = that.oSplitAppObj._oTaskExecutionUIPageObj;
			if(!oTaskExecutionUIPageObj){
				jQuery.sap.require("sap.uiext.inbox.splitapp.TaskExecutionUIPage");
				oTaskExecutionUIPageObj = new sap.uiext.inbox.splitapp.TaskExecutionUIPage(that.oSplitAppObj.getId() + "-exUi"); //TODO: Add Id and optimize
				that.oSplitAppObj.app.addPage(oTaskExecutionUIPageObj.oTaskExecutionUIPage);
				oTaskExecutionUIPageObj._oParentSplitAppObj = that.oSplitAppObj; 
				that.oSplitAppObj._oTaskExecutionUIPageObj = oTaskExecutionUIPageObj;
			}
			oTaskExecutionUIPageObj.oTaskExecutionUIPage.setBindingContext(context);
			oTaskExecutionUIPageObj.open();
		}
		//UNTIL UNTIL HERE
	}
	
	sap.uiext.inbox.splitapp.MasterPageController.prototype._openManageSubstitutionOverlay = function (oEvent, that) {
         var substitutionRulesManager  = sap.ui.getCore().byId(that.Id + '--' + 'substitutionRulesManager');
         if(substitutionRulesManager === undefined){
        	 	 jQuery.sap.require("sap.uiext.inbox.SubstitutionRulesManager");
                 substitutionRulesManager = new sap.uiext.inbox.SubstitutionRulesManager(that.Id + '--' + 'substitutionRulesManager');
                 substitutionRulesManager.setParent(that.oSplitAppObj._oLaunchPad);
         }
         if(substitutionRulesManager.getModel() === undefined){
        	var oModel = sap.ui.getCore().getModel();
        	var newModel = new sap.ui.model.odata.ODataModel(oModel.sServiceUrl,true);
         	newModel.oHeaders["x-csrf-token"] = oModel.oHeaders["x-csrf-token"];
         	substitutionRulesManager.setModel(newModel);
         }
         jQuery.sap.require("sap.uiext.inbox.tcm.TCMModel");
         substitutionRulesManager.oTCMModel = new sap.uiext.inbox.tcm.TCMModel();
        // substitutionRulesManager.oConfiguration = that.oConfiguration;
        // substitutionRulesManager.isSubstitutionRuleCreationSupported=that.isSubstitutionRuleCreationSupported;
         //substitutionRulesManager.bindSubstitutionRules(that._substitutionPath);
         substitutionRulesManager.open();
	}

	sap.uiext.inbox.splitapp.MasterPageController.prototype._refreshTasks = function(oEvt, that){
		//that.oSplitAppObj._oLaunchPad._showBusyLoader();
		if(!that.oTaskData){
			that.oCoreModel = sap.ui.getCore().getModel();
			that.oCoreModel.read("/TaskCollection?$filter=Status ne 'COMPLETED'&$orderby=CreatedOn desc",null, null , true, function(oData,oResponse){
				 that.oTaskData = oData.results; //TODO: Use Constants
				 that._updateModel(that);
			},function(oError){
				sap.m.MessageToast.show(that._oBundle.getText("INBOX_LP_MSG_FAILED_TO_READ_SERVICE_WHILE_REFRESH"));
		    });
		}
	};

	sap.uiext.inbox.splitapp.MasterPageController.prototype._updateModel = function(that){
		var oJSONModel = that.masterPage.getModel();
		var jsonData = {"TaskCollection":that.oTaskData};
		oJSONModel.setData(jsonData);//that.getModel()
		that.oSplitAppObj._setModel(oJSONModel,that.oSplitAppObj.filters);
		//that.oSplitAppObj._oLaunchPad._hideBusyLoader();
	};
	
	sap.uiext.inbox.splitapp.MasterPageController.prototype._rerenderTask = function(task){
		
		var taskCompleted = task.Status == "COMPLETED"?true:false; 
		
		var oMasterPageList = sap.ui.getCore().byId(this.Id + "-list");
		var selectedItem = oMasterPageList.getSelectedItem();
		//1 possible solution to update model and UI
		/*var node = this.masterPage.getModel().getProperty(selectedItem.getBindingContext().getPath(), selectedItem.getBindingContext());
		node.Status = task.Status;
		node.StatusText = task.StatusText;
		node.SupportsClaim = task.SupportsClaim;
		node.SupportsRelease = task.SupportsRelease;
		*/
		//2 possible solution to update model and UI
		var sPath = selectedItem.getBindingContext().getPath()
		var aParts = sPath.split("/");
		if(taskCompleted){
			//Delete from model
			this.masterPage.getModel().oData.TaskCollection.splice(aParts[2], 1);
		}else{
			//Update Model
			this.masterPage.getModel().oData.TaskCollection[aParts[2]] = task;
		}
		this.masterPage.getModel().checkUpdate(false);
	};
	
	
