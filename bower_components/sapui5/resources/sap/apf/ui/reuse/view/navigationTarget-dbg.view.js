/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/**
 *@class navigationTarget 
 *@name navigationTarget
 *@memberOf sap.apf.ui.reuse.view 
 *@description Contains the list of navigation targets possible for the APF Application
 *@returns  {Open in - Navigation Target buttons}  
 */
(function() {
	"use strict";
	sap.ui.jsview("sap.apf.ui.reuse.view.navigationTarget", {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.navigationTarget";
		},
		createContent : function(oController) {
			var oViewData = this.getViewData();
			this.oNavListPopover = oViewData.oNavListPopover;
			this.oOpenInButtonEventSource = oViewData.oOpenInButtonEventSource;
			this.oNavigationHandler = oViewData.oNavigationHandler;
			this.oUiApi = oViewData.oUiApi;
			this.oController = oController;
			//Call to getNavigationTargets returns a promise
			this.oUiApi.getLayoutView().byId("applicationPage").setBusy(true);//Set busy indicator to true once open in is pressed
			var oNavTargetsPromise = this.oNavigationHandler.getNavigationTargets();
			// Call to _prepareActionListModel after promise is done
			oNavTargetsPromise.then(this._prepareActionListModel.bind(this), function() {
				this.oUiApi.getLayoutView().byId("applicationPage").setBusy(false); //Set busy indicator to false once open in is pressed
			});
		},
		/**
		 *@description Prepares Action list model and adds it the openIn button pop over
		 *@param {Array} Array of objects contains the navigation targets with semantic object, action, action's text, id from when the promise is done
		 */
		_prepareActionListModel : function(navTargets) {
			var oController = this;
			var navTargetsGlobal = [];
			var navTargetsStepSpecific = [];
			navTargets.global.forEach(function(target) {
				if(target.title){
					target.text = oController.getViewData().oCoreApi.getTextNotHtmlEncoded(target.title);
				}
				navTargetsGlobal.push(target);
			});
			navTargets.stepSpecific.forEach(function(target) {
				if(target.title){
					target.text = oController.getViewData().oCoreApi.getTextNotHtmlEncoded(target.title);
				}
				navTargetsStepSpecific.push(target);
			});
			this.oNavListPopover.removeAllContent();
			var oGlobalActionListItem, oStepActionListItem;
			var self = this;
			if (navTargetsStepSpecific.length !== 0) {
				var oModelStepSpecific = new sap.ui.model.json.JSONModel();
				var oDataStepSpecific = {
					navTargets : navTargetsStepSpecific
				};
				//Preparing the list of step specific navigation target actions in the list
				oStepActionListItem = new sap.m.List({
					items : {
						path : "/navTargets",
						template : new sap.m.StandardListItem({
							title : "{text}",
							type : sap.m.ListType.Navigation,
							press : function(oEvent) {
								var selectedNavTarget = oEvent.getSource().getBindingContext().getObject().id;
								self.oController.handleNavigation(selectedNavTarget);//Navigate to app once an step specific action is clicked
							}
						})
					}
				});
				oModelStepSpecific.setData(oDataStepSpecific);
				oStepActionListItem.setModel(oModelStepSpecific);
				//Create a horizontal line separator
				var separator = new sap.ui.core.HTML({
					content : '<hr class="lineSeparator">',
					sanitizeContent : true
				});
				this.oNavListPopover.addContent(oStepActionListItem);
				this.oNavListPopover.addContent(separator);
			}
			if (navTargetsGlobal.length !== 0) {
				var oModelGlobal = new sap.ui.model.json.JSONModel();
				var oDataGlobal = {
					navTargets : navTargetsGlobal
				};
				//Preparing the list of global navigation target actions in the list
				oGlobalActionListItem = new sap.m.List({
					items : {
						path : "/navTargets",
						template : new sap.m.StandardListItem({
							title : "{text}",
							type : sap.m.ListType.Navigation,
							press : function(oEvent) {
								var selectedNavTarget = oEvent.getSource().getBindingContext().getObject().id;
								self.oController.handleNavigation(selectedNavTarget);//Navigate to app once an global action is clicked
							}
						})
					}
				});
				oModelGlobal.setData(oDataGlobal);
				oGlobalActionListItem.setModel(oModelGlobal);
				this.oNavListPopover.addContent(oGlobalActionListItem);
			}
			this.oUiApi.getLayoutView().byId("applicationPage").setBusy(false);//Set busy indicator to true once open in list is populated
			this.oNavListPopover.openBy(this.oOpenInButtonEventSource);
		}
	});
}());