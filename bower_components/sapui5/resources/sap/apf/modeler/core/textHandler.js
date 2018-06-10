/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.textHandler");(function(){'use strict';sap.apf.modeler.core.TextHandler=function(){var r;this.getMessageText=function(R,p){return this.getText(R,p);};this.getText=function(R,p){return r.getResourceBundle().getText(R,p);};function i(){var u;var U;var m=jQuery.sap.getModulePath("sap.apf");u=m+'/modeler/resources/i18n/texts.properties';r=new sap.ui.model.resource.ResourceModel({bundleUrl:u});U=m+'/resources/i18n/apfUi.properties';r.enhance({bundleUrl:U});}i();};}());
