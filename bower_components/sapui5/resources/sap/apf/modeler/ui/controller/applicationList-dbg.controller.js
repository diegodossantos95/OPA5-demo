/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.require('sap.apf.modeler.ui.utils.helper');
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");
(function() {
	"use strict";
	var oCoreApi, oApplicationHandler;
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	var optionsValueModelBuilder = new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();
	function _setDisplayText(oController) {
		var oTextReader = oCoreApi.getText;
		oController.byId("idAppPage").setTitle(oTextReader("configModelerTitle"));
		oController.byId("idAppTitle").setText(oTextReader("applicationOverview"));
		oController.byId("idAppNumberTitle").setText(oTextReader("applications"));
		oController.byId("idDescriptionLabel").setText(oTextReader("description"));
		oController.byId("idSemanticObjectLabel").setText(oTextReader("semanticObject"));
		oController.byId("idEditButton").setText(oTextReader("edit"));
		oController.byId("idSaveButton").setText(oTextReader("save"));
		oController.byId("idCancelButton").setText(oTextReader("cancel"));
		oController.byId("idTextCleanupButton").setText(oTextReader("textCleanUp"));
		oController.byId("idImportButton").setText(oTextReader("import"));
		oController.byId("idNewButton").setTooltip(oTextReader("newApplication"));
		oController.byId("idDeleteIcon").setTooltip(oTextReader("deleteButton"));
		oController.byId("idAriaPropertyForDelete").setText(oTextReader("ariaTextForDeleteIcon"));
	}
	function _setDeleteConfirmationDialogText() {
		var oTextReader = oCoreApi.getText;
		sap.ui.core.Fragment.byId("idDeleteConfirmationFragment", "idDeleteConfirmation").setTitle(oTextReader("confirmation"));
		sap.ui.core.Fragment.byId("idDeleteConfirmationFragment", "idDeleteButton").setText(oTextReader("deleteButton"));
		sap.ui.core.Fragment.byId("idDeleteConfirmationFragment", "idCancelButtonDialog").setText(oTextReader("cancel"));
	}
	function _setUnsavedDataConfirmationDialogText() {
		var oTextReader = oCoreApi.getText;
		sap.ui.core.Fragment.byId("idUnsavedDataConfirmationFragment", "idMessageDialog").setTitle(oTextReader("confirmation"));
		sap.ui.core.Fragment.byId("idUnsavedDataConfirmationFragment", "idYesButton").setText(oTextReader("yes"));
		sap.ui.core.Fragment.byId("idUnsavedDataConfirmationFragment", "idNoButton").setText(oTextReader("no"));
		sap.ui.core.Fragment.byId("idUnsavedDataConfirmationFragment", "idCancelButton").setText(oTextReader("cancel"));
	}
	function _updateAppList(oController) {
		var applications = oApplicationHandler.getList();
		oController.byId("idAppCount").setText("(" + applications.length + ")");
		var aAppDetails = [];
		applications.forEach(function(application) {
			var oAppDetails = {};
			oAppDetails.id = application.Application;
			oAppDetails.description = application.ApplicationName;
			oAppDetails.semanticObject = application.SemanticObject;
			aAppDetails.push(oAppDetails);
		});
		var oModel = optionsValueModelBuilder.prepareModel(aAppDetails, aAppDetails.length);
		oController.byId("idApplicationTable").setModel(oModel);
	}
	function _showSuccessMessageToast(sMsgCode) {
		var oMessageObject = oCoreApi.createMessageObject({
			code : sMsgCode
		});
		oCoreApi.putMessage(oMessageObject);
	}
	function _attachEvents(oController) {
		oController.byId("idAppDescription").attachBrowserEvent("click", oController.handleNavigationToConfigurationList.bind(oController));
		oController.byId("idSemanticObject").attachBrowserEvent("click", oController.handleNavigationToConfigurationList.bind(oController));
		oController.byId("idApplicationTable").attachEvent("addNewAppEvent", oController.handleAdditionOfNewApp.bind(oController));
		oController.byId("idApplicationTable").attachEvent("updateAppListEvent", oController.handleAppListUpdateAfterImport.bind(oController));
	}
	//Dependent dialogs are instantiated through this method. Eg- Add newApp,importFiles,importDeliveredContent Dialog
	function _instantiateDialogView(oController, sViewName) {
		var oViewData, oView;
		oViewData = {
			oParentControl : oController.byId("idApplicationTable"),
			oCoreApi : oCoreApi
		};
		oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view." + sViewName,
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
		oController.getView().addDependent(oView);
	}
	//Opens confirmation dialogs. Eg - delete confirmation dialog, unsavedData confirmation dialog
	function _openDialog(oController, oDialog, key, oCustomData) {
		oController.getView().addDependent(oDialog);
		var sMsg = new sap.m.Label({
			text : oCoreApi.getText(key)
		}).addStyleClass("dialogText");
		oDialog.removeAllContent();
		oDialog.addContent(sMsg);
		if (oCustomData) {
			oDialog.removeAllCustomData();
			oDialog.addCustomData(oCustomData);
		}
		oDialog.open();
	}
	function _setHeightAndWidth(oController) {
		var scrollContainer = oController.byId("idAppListScrollContainer");
		var oApplicationTable = oController.byId("idApplicationTable");
		var viewInstance = oController.getView();
		oApplicationTable.addEventDelegate({
			onAfterRendering : function() { //Set the height and width of scroll container
				var height = jQuery(window).height();
				var appTitleBar = jQuery(viewInstance.byId("idAppTitle").getDomRef()).height();
				var appToolbar = jQuery(viewInstance.byId("idApplicationToolbar").getDomRef()).height();
				var header = jQuery(viewInstance.byId("idAppPage").getDomRef()).find("header").height();
				var footer = jQuery(viewInstance.byId("idAppPage").getDomRef()).find("footer").height();
				var offsetHeight;
				if (appTitleBar > 0) { //If onAfterRendering happens before the UI is rendered on the DOM
					appTitleBar = appTitleBar + 80;
					offsetHeight = appTitleBar + appToolbar + header + footer + 25;
				} else {//Fall back if rendered DOM element has height defined as 0 or undefined
					offsetHeight = 232; //Setting constant calculated value
				}
				//Set Initial Height and Width				
				scrollContainer.setHeight(height - offsetHeight + "px");
				scrollContainer.setWidth("100%");
				sap.apf.modeler.ui.utils.helper.onResize(function() {
					if (jQuery(viewInstance.getDomRef()).css("display") === "block") {
						height = jQuery(viewInstance.byId("idAppPage").getDomRef()).height();
						scrollContainer.setHeight(height - offsetHeight + "px");
						scrollContainer.setWidth("100%");
					}
				});
				sap.ui.core.UIComponent.getRouterFor(oController).attachRoutePatternMatched(function(oEvent) {
					if (oEvent.getParameter("name") === "applicationList") {
						height = jQuery(viewInstance.getDomRef()).height();
						scrollContainer.setHeight(height - offsetHeight + "px");
						scrollContainer.setWidth("100%");
					}
				});
			}
		});
	}
	function _openImportMenu(oController, oEvent) {
		var importDeliveredContent = new sap.m.StandardListItem({
			title : oCoreApi.getText("importDeliveredContent"),
			type : sap.m.ListType.Active,
			press : function() {
				_instantiateDialogView(oController, "importDeliveredContent");
			}
		});
		var importFiles = new sap.m.StandardListItem({
			title : oCoreApi.getText("importFiles"),
			type : sap.m.ListType.Active,
			press : function() {
				_instantiateDialogView(oController, "importFiles");
			}
		});
		var oPopover = new sap.m.Popover({
			placement : sap.m.PlacementType.Top,
			showHeader : false
		});
		var oActionListItem = new sap.m.List({
			items : [ importDeliveredContent, importFiles ]
		});
		oPopover.addContent(oActionListItem);
		oPopover.openBy(oEvent.getSource());
	}
	function _showError(sMsgCode, oMsgObj) {
		var oMessageObject = oCoreApi.createMessageObject({
			code : sMsgCode
		});
		if (oMsgObj) {
			oMessageObject.setPrevious(oMsgObj);
		}
		oCoreApi.putMessage(oMessageObject);
	}
	function _enableDisplayMode(oController) {
		oController.byId("idNewButton").setEnabled(true);
		oController.byId("idEditButton").setVisible(true);
		oController.byId("idSaveButton").setVisible(false);
		oController.byId("idSaveButton").setEnabled(false);
		oController.byId("idTextCleanupButton").setEnabled(false);
		oController.byId("idCancelButton").setVisible(false);
		oController.byId("idTextCleanupButton").setVisible(false);
		oController.byId("idApplicationTable").setMode("None");
		oController.byId("idImportButton").setVisible(true);
		var items = oController.byId("idApplicationTable").getItems();
		items.forEach(function(item) {
			item.setType("Navigation");
			item.getCells()[0].setEditable(false);
			item.getCells()[1].setEditable(false);
			item.getCells()[2].setVisible(false);
		});
		_updateAppList(oController);
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.applicationList", {
		onInit : function() {
			var oController = this;
			var oComponent = oController.getOwnerComponent();
			if (nullObjectChecker.checkIsNotUndefined(oComponent)) {
				oCoreApi = oComponent.oCoreApi;
				_setDisplayText(oController);
				oCoreApi.getApplicationHandler(function(applicationHandler, messageObject) {
					oApplicationHandler = applicationHandler;
					if (oApplicationHandler && !nullObjectChecker.checkIsNotUndefined(messageObject)) {
						_updateAppList(oController);
					} else {
						_showError("11508", messageObject);
					}
				});
			}
			_attachEvents(oController);
			_setHeightAndWidth(oController);
		},
		handleAddNewAppPress : function() {
			var oController = this;
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oApplicationHandler)) {
				_instantiateDialogView(oController, "newApplication");
			} else {
				_showError("11509");
			}
		},
		handleListItemSelect : function() { //handler for selection in application list
			var oController = this;
			oController.byId("idTextCleanupButton").setEnabled(true);
		},
		handleListItemPress : function(evt) { //handler for navigation in application list
			var oController = this, bindingContext;
			bindingContext = evt.getParameter("listItem").getBindingContext().getPath().split("/")[2];
			sap.ui.core.UIComponent.getRouterFor(oController).navTo("configurationList", {
				appId : oController.byId("idApplicationTable").getModel().getData().Objects[bindingContext].id
			});
		},
		handleOnLiveChange : function() {
			var oController = this;
			oController.byId("idSaveButton").setEnabled(true);
		},
		handleEditPress : function() {
			var oController = this;
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oApplicationHandler)) {
				oController.byId("idNewButton").setEnabled(false);
				oController.byId("idEditButton").setVisible(false);
				oController.byId("idSaveButton").setVisible(true);
				oController.byId("idCancelButton").setVisible(true);
				oController.byId("idTextCleanupButton").setVisible(true);
				oController.byId("idImportButton").setVisible(false);
				oController.byId("idApplicationTable").setMode("SingleSelectMaster");
				var items = oController.byId("idApplicationTable").getItems();
				if (items.length) {
					items.forEach(function(item) {
						item.getCells()[0].setEditable(true);
						item.getCells()[1].setEditable(true);
						item.getCells()[2].setVisible(true);
						item.setType("Inactive");
					});
				}
			} else {
				_showError("11509");
			}
		},
		handleDeletePress : function(evt) {
			var oController = this, oDeleteConfirmationDialog;
			var sPath = evt.getSource().getBindingContext().getPath().split("/")[2];
			var customData = new sap.ui.core.CustomData({
				value : {
					removeId : oController.byId("idApplicationTable").getModel().getData().Objects[sPath].id,
					sPath : sPath
				}
			});
			oDeleteConfirmationDialog = sap.ui.xmlfragment("idDeleteConfirmationFragment", "sap.apf.modeler.ui.fragment.deleteConfirmationDialog", oController);
			_setDeleteConfirmationDialogText();
			_openDialog(oController, oDeleteConfirmationDialog, "deleteApp", customData);
		},
		handleConfirmDeletion : function() {
			var oController = this;
			var removeId = sap.ui.core.Fragment.byId("idDeleteConfirmationFragment", "idDeleteConfirmation").getCustomData()[0].getValue().removeId;
			if (nullObjectChecker.checkIsNotUndefined(removeId)) {
				oApplicationHandler.removeApplication(removeId, function(oResponse, oMetadata, msgObj) {
					if (!nullObjectChecker.checkIsNotUndefined(msgObj) && (typeof oResponse === "string")) {
						_updateAppList(oController);
						_showSuccessMessageToast("11510");
						oController.byId("idEditButton").firePress();
					} else {
						_showError("11501", msgObj);
					}
					oController.closeDialog();
				});
			}
		},
		closeDialog : function() {
			sap.ui.core.Fragment.byId("idDeleteConfirmationFragment", "idDeleteConfirmation").destroy();
		},
		handleCancelPress : function() {
			var oController = this, updateAppArr = [], appList, tableData, j, oUnsavedDataConfirmationDialog;
			appList = oApplicationHandler.getList();
			tableData = oController.byId("idApplicationTable").getModel().getData().Objects;
			for(j = 0; j < appList.length; j++) {
				if (tableData[j].description !== appList[j].ApplicationName || tableData[j].semanticObject !== appList[j].SemanticObject) {
					updateAppArr.push(tableData[j]);
				}
			}
			if (updateAppArr.length) {
				oUnsavedDataConfirmationDialog = sap.ui.xmlfragment("idUnsavedDataConfirmationFragment", "sap.apf.modeler.ui.fragment.unsavedDataConfirmationDialog", oController);
				_setUnsavedDataConfirmationDialogText();
				_openDialog(oController, oUnsavedDataConfirmationDialog, "unsavedConfiguration");
			} else {
				_enableDisplayMode(oController);
			}
		},
		handleNavigationWithSave : function() {
			var oController = this;
			oController.handleSavePress();
			sap.ui.core.Fragment.byId("idUnsavedDataConfirmationFragment", "idMessageDialog").destroy();
		},
		handleNavigationWithoutSave : function() {
			var oController = this;
			sap.ui.core.Fragment.byId("idUnsavedDataConfirmationFragment", "idMessageDialog").destroy();
			_enableDisplayMode(oController);
		},
		handlePreventNavigation : function() {
			sap.ui.core.Fragment.byId("idUnsavedDataConfirmationFragment", "idMessageDialog").destroy();
		},
		handleImportPress : function(oEvent) {
			var oController = this;
			var isLrepActive = oCoreApi.getStartParameterFacade().isLrepActive();
			if (isLrepActive) {
				_openImportMenu(oController, oEvent);
			} else {
				_instantiateDialogView(oController, "importFiles");
			}
		},
		handleSavePress : function() {
			var oController = this, updateAppArr = [], appList, tableData, j;
			appList = oApplicationHandler.getList();
			tableData = oController.byId("idApplicationTable").getModel().getData().Objects;
			for(j = 0; j < appList.length; j++) {
				if (tableData[j].description !== appList[j].ApplicationName || tableData[j].semanticObject !== appList[j].SemanticObject) {
					updateAppArr.push(tableData[j]);
				}
			}
			updateAppArr.forEach(function(app) {
				var updatedAppObject = {
					ApplicationName : app.description,
					SemanticObject : app.semanticObject
				};
				oApplicationHandler.setAndSave(updatedAppObject, function(oResponse, oMetadata, msgObj) {
					if (!nullObjectChecker.checkIsNotUndefined(msgObj) && (typeof oResponse === "string")) {
						_enableDisplayMode(oController);
					} else {
						_showError("11500", msgObj);
					}
				}, app.id);
			});
		},
		handleTextpoolCleanUpPress : function() {
			var oController = this, oTextPool, bindingContext, appId;
			bindingContext = oController.byId("idApplicationTable").getSelectedContextPaths()[0].split("/")[2];
			appId = oController.byId("idApplicationTable").getModel().getData().Objects[bindingContext].id;
			oCoreApi.getConfigurationHandler(appId, function(configurationHandler) {
				oTextPool = configurationHandler.getTextPool();
				oCoreApi.getUnusedTextKeys(appId, function(aUnusedTexts, msgObj) {
					if (!nullObjectChecker.checkIsNotUndefined(msgObj)) {
						oTextPool.removeTexts(aUnusedTexts, appId, function(msgObj) {
							if (!nullObjectChecker.checkIsNotUndefined(msgObj)) {
								_showSuccessMessageToast("11511");
							} else {
								_showError("11507", msgObj);
							}
						});
					} else {
						_showError("11506", msgObj);
					}
				});
			});
		},
		handleNavigationToConfigurationList : function(oEvt) {
			var oController = this;
			if (oController.byId("idEditButton").getVisible()) {
				var mParameters = {
					listItem : sap.ui.getCore().byId(oEvt.currentTarget.id).getParent(),
					srcControl : oController.byId("idApplicationTable")
				};
				oController.byId("idApplicationTable").fireItemPress(mParameters);
			}
		},
		handleAdditionOfNewApp : function(oEvent) {
			var oController = this, applicationId, aAppData, i, index = 0, oItems;
			applicationId = oEvent.getParameter("appId");
			_updateAppList(oController);
			aAppData = oController.byId('idApplicationTable').getModel().getData().Objects;
			_showSuccessMessageToast("11512");
			oController.byId('idApplicationTable').rerender();
			for(i = 0; i < aAppData.length; i++) {
				if (aAppData[i].id === applicationId) {
					index = i;
					break;
				}
			}
			oItems = oController.byId('idApplicationTable').getItems();
			if (oItems.length) {
				var appTableItemDOM = oItems[index].getDomRef();
				if (appTableItemDOM) {
					appTableItemDOM.scrollIntoView();
				}
			}
		},
		handleAppListUpdateAfterImport : function() {
			var oController = this;
			_updateAppList(oController);
		},
		handleNavBack : function() {
			window.history.go(-1);
		}
	});
}());