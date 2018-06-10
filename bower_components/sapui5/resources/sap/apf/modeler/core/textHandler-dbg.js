/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare("sap.apf.modeler.core.textHandler");
(function() {
	'use strict';
	/**
	 * @private
	 * @class Provides access to message texts and ui texts for the modeler
	 */
	sap.apf.modeler.core.TextHandler = function() {
		var oResourceModel;
		/**
		 * @description returns a message text for message handling
		 * @param {string} sRessourceKey - Key of the message in the Ressourcefile
		 * @param {string[]} [aParameters] - Parameter for placeholder replacement in the message bundle
		 * @returns {string}
		 */
		this.getMessageText = function(sRessourceKey, aParameters) {
			return this.getText(sRessourceKey, aParameters);
		};
		/**
		 * @description returns text
		 * @param {string} sRessourceKey - Key of the message in the Ressourcefile
		 * @param {string[]} [aParameters] - Parameter for placeholder replacement in the message bundle
		 * @returns {string}
		 */
		this.getText = function(sRessourceKey, aParameters) {
			return oResourceModel.getResourceBundle().getText(sRessourceKey, aParameters);
		};
		function initBundles() {
			var sUrlModelerSpecificTexts;
			var sUrlApfTexts;
			var sModulePath = jQuery.sap.getModulePath("sap.apf");
			sUrlModelerSpecificTexts = sModulePath + '/modeler/resources/i18n/texts.properties';
			oResourceModel = new sap.ui.model.resource.ResourceModel({bundleUrl: sUrlModelerSpecificTexts});
			sUrlApfTexts = sModulePath + '/resources/i18n/apfUi.properties';
			oResourceModel.enhance({bundleUrl: sUrlApfTexts});
		}
		initBundles();
	};
}());