/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

	jQuery.sap.declare("sap.uiext.inbox.splitapp.MasterPage");
	jQuery.sap.require("sap.uiext.inbox.InboxUtils");
	//jQuery.sap.require("sap.uiext.splitapp.MasterPageController");
	
	sap.ui.base.Object.extend("sap.uiext.inbox.splitapp.MasterPage",{
			
			    constructor : function(Id) {
			        sap.ui.base.Object.apply(this);
			        this.oCore = sap.ui.getCore();
			        this.Id = Id;
			        this.utils = sap.uiext.inbox.InboxUtils;
			        this._oBundle = this.oCore.getLibraryResourceBundle("sap.uiext.inbox");
			        this.bPhoneDevice = jQuery.device.is.phone;
					this.masterPage = this._create();	
					//this.controller = new sap.uiext.splitapp.MasterPageController;
			    }
		});
	
	sap.uiext.inbox.splitapp.MasterPage.prototype.getPage = function(){
		return this.masterPage;
	};
	
	sap.uiext.inbox.splitapp.MasterPage.prototype.setShowNavButton = function(bValue){
		this.masterPage.setShowNavButton(bValue);
		return this;
	};
	
	sap.uiext.inbox.splitapp.MasterPage.prototype._setTcmServiceURL = function(sValue) {
		this.tcmServiceURL = sValue;
	};

	sap.uiext.inbox.splitapp.MasterPage.prototype._create = function() {
		var masterPage = this.oCore.byId(this.Id + "-masterPage");
		if(!masterPage){
			var that = this;
			var oSearchField = new sap.m.SearchField(that.Id + "-searchFld",{
				showRefreshButton : false,
				placeholder: that._oBundle.getText("INBOX_LP_SEARCH_LABEL"),
				tooltip: that._oBundle.getText("INBOX_LP_SEARCH_LABEL_TOOLTIP"),
				width:"100%"						
			})
			oSearchField.attachSearch(that, that.handleSearch);
			oSearchField.attachLiveChange(that, function(oEvent, that) {
		        if (oEvent.getParameter("newValue") === "") {
		            that._resetSearch();
		        }
		    });
			masterPage = new sap.m.Page(that.Id + "-masterPage",{
				title: that._oBundle.getText("INBOX_LP_TASKS_AND_COUNT",[""]),// TODO: Update Count
				showNavButton: true,
				showFooter: false, // TODO to be enabled after substitution rule screen is made responsive !this.bPhoneDevice,
				footer: new sap.m.Bar(that.Id + 'fooBar',{
							contentLeft : [ new sap.m.Button(this.Id + "-mangSubstBtn",{
												tooltip: that._oBundle.getText("INBOX_MANAGE_SUBSTITUTION_RULES_TOOLTIP"),
												icon:"sap-icon://visits"
												//enabled: that.LaunchPad._isSubstitutionEnabled  //TODO
												}).attachPress(that, that._openManageSubstitutionOverlay)
										  ]
						}),
				subHeader: new sap.m.Bar(that.Id + "-searchBar",{
					contentMiddle: [oSearchField],
					contentRight: [new sap.m.Button(that.Id + "-refreshBtn", {
						tooltip:that._oBundle.getText("INBOX_LP_REFRESH_BUTTON_TOOLTIP"), //TODO: Replace it with default Refresh.
						icon:"sap-icon://synchronize"
						}).attachPress(that, that._refreshTasks)]
					
				})
			}).attachNavButtonTap(function(oEvent){
				sap.ui.getCore().getEventBus().publish('sap.uiext.inbox', "masterPageNavButtonTapped");
					/*if(that.oSplitAppObj._oLaunchPad){
						
						that.oSplitAppObj._oLaunchPad.oApp.back()
						//TODO is this required?
						var _oIconTabBar = this.oCore.byId(that.oSplitAppObj.oInboxDetailPage.Id + "-iconTabBar"); 
						_oIconTabBar.setVisible(true);
						_oIconTabBar.setExpanded(false);
					}*/
				});
			
			
			//	var oPullToRefresh = new sap.m.PullToRefresh(parentId + "-pullToRefresh",{
			//							visible:false,
			//refresh:this.handleListSelect
			//						});
			
			//	masterPage.addContent(oPullToRefresh);
			
			var oList = new sap.m.List(that.Id + "-list",{
				growing:true,
				growingThreshold:7,//TODO: Responsive
				visible:true,
				mode: sap.m.ListMode.SingleSelectMaster,//TODO: IPhone compatibility
				threshhold:50,
				noDataText: that._oBundle.getText("INBOX_LP_NO_MATCHING_TASKS"),
			}).attachSelect(this, this.handleListSelect);
			
			
			 oList.addEventDelegate({
				        ontap : function(e) {
				        	var oSelected = oList.getSelectedItem();
				        	if (oSelected && oSelected.getDomRef().contains(e.target)) {
				        		if (jQuery.device.is.phone)
				        			oList.setSelectedItem(oSelected, false );
				             }
				          }
				 	});
			
			this.oList = oList;
			
			var aObjectAttributes = new Array();
			aObjectAttributes.push(new sap.m.ObjectAttribute({text:"{CreatedByName}"}));
			aObjectAttributes.push(new sap.m.ObjectAttribute().bindProperty("text", "CreatedOn", function(value){
				return that.utils._dateFormat(value);
			}));
			
			var oObjectListItem = new sap.m.ObjectListItem(that.Id + "-objLstItm",{
				type:"Active",
				title: "{TaskTitle}",
				icon: "sap-icon://person-placeholder",
				attributes: aObjectAttributes,
				firstStatus: new sap.m.ObjectStatus({
									icon:
										{
											path: "CompletionDeadLine",
											formatter: function (value) {
												if(that.utils._isOverDue(value)) {
													return "sap-icon://pending";
												}
											 }
										},
									state : sap.ui.core.ValueState.Error
							 }),
				secondStatus: new sap.m.ObjectStatus(that.Id + "-objStatus").bindProperty("text", {
					        	        parts: [
					        	            {path: "Status", type: new sap.ui.model.type.String()},
					        	            {path: "StatusText", type: new sap.ui.model.type.String()}
					        	            ],
					        	        formatter: function(_sStatus, _sStatusText){ 
					        	        	if(_sStatus !=null && _sStatusText){
					        	        		return _sStatusText;
					        	        	}else if(_sStatus !=null && _sStatus != ""){
					        	        		var _sTranslatedStatusText = that._oBundle.getText(sap.uiext.inbox.InboxConstants.statusMap[_sStatus]);
					        	        		return (_sTranslatedStatusText == "") ? _sStatus : _sTranslatedStatusText;
					        	        	}
					        	        	else{
					        	        		return "";//Empty String or any default text ?
					        	        	}
					        	        },
					        	        useRawValues : true
	        						})
								}).addStyleClass("inbox_split_app_wordBreak");
			
			oObjectListItem.bindProperty("icon", "CreatedBy", function(value){
				if(this.getBindingContext()){
					return that.utils.getUserMediaResourceURL(that.tcmServiceURL, this.getBindingContext().getProperty("SAP__Origin"), value);
				}else{
					return "sap-icon://person-placeholder";
				}
			});
			
			this.oListTemplate = oObjectListItem;
			//oList.setModel(this.oCore.getModel());
			// bind Aggregation
			//oList.bindAggregation("items", "/TaskCollection", oObjectListItem, undefined, aFilters);
			oList.attachUpdateFinished(function(oEvent){
					if (that.bPhoneDevice) {
						var oMasterPageList = that.oCore.byId(that.Id + "-list");
						var _iNoOfTasksInList = oMasterPageList.mBindingInfos.items.binding.iLength //TODO: Find a clean way and not use interbal variables
						that.masterPage.setTitle(that._oBundle.getText("INBOX_LP_TASKS_AND_COUNT",[_iNoOfTasksInList]));
					} else {
						var items = this.getItems();
						if(items.length > 0){
							//this.setSelectedItem(items[0], true);
							this.fireSelect({'listItem': items[0], 'selected' : true});
						}
					}
				});
			
			//this.masterPageList = oList;
			masterPage.addContent(oList);
			
		}
		
		return masterPage;
	}

	/*sap.uiext.inbox.splitapp.MasterPage.prototype._dateFormat = function(dateValue) {
		if (dateValue != undefined && typeof (dateValue) == 'string' && dateValue != "") {
			var date;
			if (dateValue.indexOf('Date') != -1) {
				date = new Date();
				date.setTime(dateValue.substring((dateValue.indexOf("(") + 1), dateValue.indexOf(")")));
			} else {
				date = new Date(dateValue.substring((dateValue.indexOf("'") + 1), dateValue.length - 1));
			}
			dateValue = date;
		}

		if (dateValue != undefined && dateValue != "") {
			var ins = sap.ui.core.format.DateFormat.getDateInstance({
				style : "medium"
			});
			return ins.format(dateValue);
		}
		return "";
	};*/
	/**
	 * Initially selects the first item (excluding for phones)
	 */
	sap.uiext.inbox.splitapp.MasterPage.prototype._selectDetail = function () {
		var list = this.oCore.byId(this.Id + "-list");
		var items = list.getItems();
		if (!jQuery.device.is.phone && items.length > 0 && !list.getSelectedItem()) {
			list.setSelectedItem(items[0], true);
			this._showDetail(items[0]);
		}
	}
	
/*	sap.uiext.inbox.splitapp.MasterPage.prototype.handleRefresh = function (evt) {
		var that = this;
			// trigger search again and hide pullToRefresh when data ready
			var list = this.oCore.byId(that.Id  + "-list");
			var binding = list.getBinding("items");
			var handler = function() {
				that.getView().byId("pullToRefresh").hide();
				binding.detachDataReceived(handler);
			};
			binding.attachDataReceived(handler);
			that._updateList();
	}
	*/
	sap.uiext.inbox.splitapp.MasterPage.prototype.handleSearch = function (evt, masterPage) {
		masterPage._updateList();
	}
	
	sap.uiext.inbox.splitapp.MasterPage.prototype._updateList = function () {
		
		var that = this;
		var filters = new Array();
		
		// add filter for search
		var searchString = that.oCore.byId(that.Id + "-searchFld").getValue();
		if (searchString && searchString.length > 0) {
			var sInProgress = "in progress";
			var bInProgress = (searchString.indexOf(' ') >= 0 && sInProgress.indexOf(searchString.toLowerCase()) != -1) ? true : false; 
			var aTokens = searchString.split(" ");
			var oFilter = [];
			
			jQuery.each(aTokens, function(i, sToken) {
				var searchStatus = bInProgress ? "IN_PROGRESS" : sToken;
				var oFilter1 = new sap.ui.model.Filter("TaskTitle", sap.ui.model.FilterOperator.Contains, sToken);
				var oFilter2 = new sap.ui.model.Filter("CreatedByName", sap.ui.model.FilterOperator.Contains, sToken);
				var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, searchStatus);
				oFilter[i] = new sap.ui.model.Filter({aFilters: [ oFilter1 ,  oFilter2, oFilter3 ], bAnd: false});
			});
			
			filters.push(new sap.ui.model.Filter({aFilters: oFilter, bAnd: true}));
			if(this.aFilters){
				filters = filters.concat(that.aFilters);
			}
			
			
			// update list binding
			var list = that.oCore.byId(that.Id + "-list");
			var oSelectedItem = list.getSelectedItem();
			var binding = list.getBinding("items");
			binding.filter(filters);
			if(filters.length == 0){ //filter length == 0 means its a normal refresh and not a search.
				list.setSelectedItem(oSelectedItem, true);
			}
		}
		
	}
	
	sap.uiext.inbox.splitapp.MasterPage.prototype.handleListSelect = function (evt, that) {
		var onUpdate = evt.getParameter('onUpdate');
		//that.oSplitAppObj._oLaunchPad._showBusyLoader();
		//this._showDetail(evt.getParameter("listItem"));
		//TODO: TO BE REMOVED FROM HERE
		var oMasterPageList = that.oCore.byId(that.Id + "-list");
		var _iNoOfTasksInList = oMasterPageList.mBindingInfos.items.binding.iLength //TODO: Find a clean way and not use interbal variables
		that.masterPage.setTitle(that._oBundle.getText("INBOX_LP_TASKS_AND_COUNT",[_iNoOfTasksInList]));
		
		var items = oMasterPageList.getItems();
		if (items.length > 0 && !oMasterPageList.getSelectedItem()) {
			oMasterPageList.setSelectedItem(items[0], true);
		}
		var selectedItem = oMasterPageList.getSelectedItem();
		var context = selectedItem.getBindingContext();
		
		/*var oDetailPage = that.oSplitAppObj.oInboxDetailPage.detailViewPage;
		oDetailPage.setBindingContext(context);*/
		//oDetailPage.rerender();//AVIOD RERENDER

		//var oApp = that.oSplitAppObj.app;
		/*if(oDetailPage.getId() == oApp.getCurrentPage().getId()){
			that.oSplitAppObj.oInboxDetailPage.renderDetailsPage();
			if (that.oSplitAppObj.oInboxDetailPage.isCommentsSupported === true){
				that.oSplitAppObj.oInboxDetailPage._displayCommentsIfCommentsSelectedinIconBar();
			}
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
		}*/
		that.oCore.getEventBus().publish('sap.uiext.inbox', "masterPageListSelected", {context:context , onUpdate:onUpdate});
		//UNTIL UNTIL HERE
	}
	
	sap.uiext.inbox.splitapp.MasterPage.prototype.bindService = function (aFilters) {
		this.aFilters = aFilters;
		this.oList.bindItems({path: "/TaskCollection",template: this.oListTemplate,filters:aFilters});//parameters: {expand: "Description"}
	}
	sap.uiext.inbox.splitapp.MasterPage.prototype._openManageSubstitutionOverlay = function (oEvent, that) {
         var substitutionRulesManager  = that.oCore.byId(that.Id + '--' + 'substitutionRulesManager');
         if(substitutionRulesManager === undefined){
        	 	 jQuery.sap.require("sap.uiext.inbox.SubstitutionRulesManager");
                 substitutionRulesManager = new sap.uiext.inbox.SubstitutionRulesManager(that.Id + '--' + 'substitutionRulesManager');
				 //TODO: test while substitution                 
				 //substitutionRulesManager.setParent(that.oSplitAppObj._oLaunchPad);
         }
         if(substitutionRulesManager.getModel() === undefined){
        	var oModel = that.oCore.getModel();
        	var newModel = new sap.ui.model.odata.ODataModel(that.tcmServiceURL,true);
         	//newModel.oHeaders["x-csrf-token"] = oModel.oHeaders["x-csrf-token"];
         	substitutionRulesManager.setModel(newModel);
         }
         jQuery.sap.require("sap.uiext.inbox.tcm.TCMModel");
         substitutionRulesManager.oTCMModel = new sap.uiext.inbox.tcm.TCMModel();
        // substitutionRulesManager.oConfiguration = that.oConfiguration;
        // substitutionRulesManager.isSubstitutionRuleCreationSupported=that.isSubstitutionRuleCreationSupported;
         //substitutionRulesManager.bindSubstitutionRules(that._substitutionPath);
         substitutionRulesManager.open();
	}

	sap.uiext.inbox.splitapp.MasterPage.prototype._refreshTasks = function(oEvt, that){
		that.addBusyIndicatorOnRefresh();
		that.oCoreModel = that.masterPage.getModel('inboxTCMModel');
		that.oCoreModel.read("/TaskCollection?$filter=Status ne 'COMPLETED'&$orderby=CreatedOn desc",null, null , true, function(oData,oResponse){
		that.oTaskData = oData.results; //TODO: Use Constants
		that._updateModel(that);
		},function(oError){
			sap.m.MessageToast.show(that._oBundle.getText("INBOX_LP_MSG_FAILED_TO_READ_SERVICE_WHILE_REFRESH"));
		});
	};

	sap.uiext.inbox.splitapp.MasterPage.prototype._updateModel = function(that){
		
		var oJSONModel = that.masterPage.getModel();
		var jsonData = {"TaskCollection":that.oTaskData};
		oJSONModel.setData(jsonData);//that.getModel()
		//that.oSplitAppObj._setModel(oJSONModel,that.oSplitAppObj.filters);
		that.bindService(that.aFilters);
		var oBusyIndicator = this.oCore.byId('refreshBI');
		if (oBusyIndicator && (this.masterPage.indexOfContent(oBusyIndicator) >= 0) ) {
			this.masterPage.removeContent(oBusyIndicator);
		}
		
	};
	
	/*sap.uiext.inbox.splitapp.MasterPage.prototype._isOverDue = function(value) { //TODO: Remove Duplication already exists in Inbox
		//need to be overrriddedn in app for different timezones
		if(value === undefined || value === null || value === "")
			return false;
		
		var now = new Date().getTime();
		var bOverdue;
		
		if ( typeof (value) === 'string' ) {
			 var sCreationdate = value.substring(value.indexOf("(")+1, value.indexOf(")")-1);
			
			 bOverdue = (parseInt(sCreationdate) - now) < 0 ? true : false;
		}
		else {
			 bOverdue = (value.getTime() - now) < 0 ? true : false;
		}
		return bOverdue;
	};*/
	
	sap.uiext.inbox.splitapp.MasterPage.prototype.rerenderTask = function(task){
		
		var taskCompleted = task.Status == "COMPLETED"?true:false; 
		
		var oMasterPageList = this.oCore.byId(this.Id + "-list");
		var selectedItem = oMasterPageList.getSelectedItem();
		//1 possible solution to update model and UI
		/*var node = this.masterPage.getModel().getProperty(selectedItem.getBindingContext().getPath(), selectedItem.getBindingContext());
		node.Status = task.Status;
		node.StatusText = task.StatusText;
		node.SupportsClaim = task.SupportsClaim;
		node.SupportsRelease = task.SupportsRelease;
		*/
		//2 possible solution to update model and UI
		var sPath = selectedItem.getBindingContext().getPath();
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
	
	sap.uiext.inbox.splitapp.MasterPage.prototype.resetSearchCriteria = function() {
		var oSearchField = this.oCore.byId(this.Id + "-searchFld");
		if (oSearchField) {
			oSearchField.setValue("");
			this._resetSearch();
		}
	}
	
	sap.uiext.inbox.splitapp.MasterPage.prototype.addBusyIndicatorOnRefresh = function() {
		var oBusyIndicatorOnRefresh = this.oCore.byId('refreshBI');
		if(!oBusyIndicatorOnRefresh){
			oBusyIndicatorOnRefresh = new sap.m.BusyIndicator('refreshBI',{
											text: this._oBundle.getText("INBOX_LP_LOADING")
										});
		}
		this.masterPage.insertContent(oBusyIndicatorOnRefresh, 0);
	}
	
	
	sap.uiext.inbox.splitapp.MasterPage.prototype._resetSearch = function() {
		
		var list = this.oCore.byId(this.Id + "-list");
		if (list) {
			var oSelectedItem = list.getSelectedItem();
			var binding = list.getBinding("items");
		}
		if (binding) {
			binding.filter(this.aFilters);
		}
		if(oSelectedItem && this.aFilters.length == 0){ //filter length == 0 means its a normal refresh and not a search.
			list.setSelectedItem(oSelectedItem, true);
		}
			
	};
	
