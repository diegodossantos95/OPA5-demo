/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
(function(){"use strict";sap.ui.jsfragment("sap.apf.ui.reuse.fragment.newMessageDialog",{createContent:function(c){var y=new sap.m.Button(c.createId("idYesButton"),{text:c.oCoreApi.getTextNotHtmlEncoded("yes")});var n=new sap.m.Button(c.createId("idNoButton"),{text:c.oCoreApi.getTextNotHtmlEncoded("no")});var a=new sap.m.Dialog(c.createId("idNewDialog"),{type:sap.m.DialogType.Standard,title:c.oCoreApi.getTextNotHtmlEncoded("newPath"),content:new sap.m.Text({text:c.oCoreApi.getTextNotHtmlEncoded("analysis-path-not-saved")}).addStyleClass("textStyle"),buttons:[y,n],afterClose:function(){a.destroy();}});return a;}});}());
