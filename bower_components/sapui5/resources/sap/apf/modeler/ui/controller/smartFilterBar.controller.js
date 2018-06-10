/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function(){"use strict";var p,t,c,C,s;function _(o){if(p&&p.arguments&&p.arguments.smartFilterId){s=C.getSmartFilterBar();}}function a(o){var r,S;var v={oTextReader:t,oConfigurationHandler:c,oConfigurationEditor:C,oParentObject:s,getCalatogServiceUri:o.getView().getViewData().getCalatogServiceUri};r=new sap.ui.controller("sap.apf.modeler.ui.controller.smartFilterBarRequest");S=new sap.ui.view({viewName:"sap.apf.modeler.ui.view.requestOptions",type:sap.ui.core.mvc.ViewType.XML,id:o.createId("idSFBRequestView"),viewData:v,controller:r});o.byId("idSFBRequestVBox").insertItem(S);}sap.ui.controller("sap.apf.modeler.ui.controller.smartFilterBar",{onInit:function(){var o=this;var v=o.getView().getViewData();t=v.getText;p=v.oParams;c=v.oConfigurationHandler;C=v.oConfigurationEditor;_(o);a(o);},setDetailData:function(){},getValidationState:function(){var o=this;return o.byId("idSFBRequestView").getController().getValidationState();},onExit:function(){var o=this;o.byId("idSFBRequestView").destroy();}});}());
