/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function(){"use strict";sap.ui.jsview("sap.apf.ui.reuse.view.deleteAnalysisPath",{getControllerName:function(){return"sap.apf.ui.reuse.controller.deleteAnalysisPath";},createContent:function(c){var a=jQuery(window).height()*0.6+"px";var b=jQuery(window).height()*0.6+"px";this.oCoreApi=this.getViewData().oInject.oCoreApi;this.oUiApi=this.getViewData().oInject.uiApi;var s=this;var l=new sap.m.List({mode:sap.m.ListMode.Delete,items:{path:"/GalleryElements",template:new sap.m.StandardListItem({title:"{AnalysisPathName}",description:"{description}",tooltip:"{AnalysisPathName}"})},"delete":c.handleDeleteOfDialog.bind(c)});var d=new sap.m.Dialog({title:s.oCoreApi.getTextNotHtmlEncoded("select-analysis-path"),contentWidth:a,contentHeight:b,content:l,leftButton:new sap.m.Button({text:s.oCoreApi.getTextNotHtmlEncoded("close"),press:function(){d.close();s.oUiApi.getLayoutView().setBusy(false);}}),afterClose:function(){d.getParent().destroy();}});if(sap.ui.Device.system.desktop){this.addStyleClass("sapUiSizeCompact");d.addStyleClass("sapUiSizeCompact");}return d;}});}());
