/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/**
 *@class navigationTarget
 *@memberOf sap.apf.ui.reuse.controller
 *@name navigationTarget
 *@description controller for view.navigationTarget
 */
(function() {
	"use strict";
	sap.ui.controller("sap.apf.ui.reuse.controller.navigationTarget", {
		onInit : function() {
			this.oNavigationHandler = this.getView().getViewData().oNavigationHandler;
			if (sap.ui.Device.system.desktop) {
				this.getView().addStyleClass("sapUiSizeCompact");
			}
		},
		/**
		 *@memberOf sap.apf.ui.reuse.controller.navigationTarget
		 *@method handleNavigation  
		 *@param selected Navigation Target 
		 *@description Launches the APF Core API for navigating externally to another application 
		 */
		handleNavigation : function(selectedNavTarget) {
			this.oNavigationHandler.navigateToApp(selectedNavTarget);
		}
	});
}());