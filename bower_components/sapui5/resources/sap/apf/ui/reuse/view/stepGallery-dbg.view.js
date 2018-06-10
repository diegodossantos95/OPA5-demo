/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 * @class stepGallery
 * @name  stepGallery
 * @description Holds the available steps of configuration and displays them on overlay container
 * @memberOf sap.apf.ui.reuse.view
 * 
 */
(function() {
	"use strict";
	sap.ui.jsview("sap.apf.ui.reuse.view.stepGallery", {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.stepGallery";
		},
		createContent : function(oController) {
			this.oController = oController;
		}
	});
}());