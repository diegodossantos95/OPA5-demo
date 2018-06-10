/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2017 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global'],function(q){'use strict';var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.export");var p;function c(){var d;var a=new sap.m.Button({text:r.getText("CANCEL_BUTTON"),press:function(){if(d&&d.oncancel){d.oncancel();d.finish();}}});var b=new sap.m.ProgressIndicator({showValue:false,height:"0.75rem"});b.addStyleClass("sapUiMediumMarginTop");d=new sap.m.Dialog({title:r.getText("PROGRESS_TITLE"),type:sap.m.DialogType.Message,contentWidth:"500px",content:[new sap.m.Text({text:r.getText("PROGRESS_FETCHING_MSG")}),b],endButton:a});d.updateStatus=function(n){b.setPercentValue(n);};d.finish=function(){p.close();b.setPercentValue(0);};return d;}function g(){p=p||c();return p;}return{getProgressDialog:g};},true);
