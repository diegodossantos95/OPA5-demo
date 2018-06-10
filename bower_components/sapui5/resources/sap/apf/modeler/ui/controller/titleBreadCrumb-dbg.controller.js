/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
/**
* @class titleBreadCrumb
* @memberOf sap.apf.modeler.ui.controller
* @name titleBreadCrumb
* @description controller for view.titleBreadCrumb
*/
(function() {
	'use strict';
	sap.ui.controller("sap.apf.modeler.ui.controller.titleBreadCrumb", {
		// Updates the title of the Detail Page
		setTitleForDetailPage : function(sFormTitle) {
			var oController = this;
			oController.byId("IdFormTitle").setText(sFormTitle);
		}
	});
}());