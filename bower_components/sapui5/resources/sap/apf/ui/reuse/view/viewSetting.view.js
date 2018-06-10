/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function(){'use strict';sap.ui.jsview("sap.apf.ui.reuse.view.viewSetting",{getControllerName:function(){return"sap.apf.ui.reuse.controller.viewSetting";},createContent:function(c){var s=this.getViewData().oTableInstance;var t=s.oTableRepresentation;var S=[];t.getColumns().forEach(function(a){var o=new sap.m.ViewSettingsItem({text:a.getCustomData()[0].getValue().text,key:a.getCustomData()[0].getValue().key});S.push(o);});var v=new sap.m.ViewSettingsDialog({sortItems:S,confirm:c.handleConfirmForSort.bind(c),cancel:c.handleCancel});return v;}});}());
