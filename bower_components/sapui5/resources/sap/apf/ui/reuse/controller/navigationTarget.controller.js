/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
(function(){"use strict";sap.ui.controller("sap.apf.ui.reuse.controller.navigationTarget",{onInit:function(){this.oNavigationHandler=this.getView().getViewData().oNavigationHandler;if(sap.ui.Device.system.desktop){this.getView().addStyleClass("sapUiSizeCompact");}},handleNavigation:function(s){this.oNavigationHandler.navigateToApp(s);}});}());
