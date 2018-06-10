/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
(function(){"use strict";sap.ui.jsfragment("sap.apf.ui.reuse.fragment.selectionDisplay",{createContent:function(c){var a=c.oCoreApi.getActiveStep();var s=a.getSelectedRepresentation();var b=typeof s.getSelections==="function"?s.getSelections():[];var r=s.getMetaData().getPropertyMetadata(s.getParameter().requiredFilters[0]);var d=r.label||r.name;var e=new sap.m.Dialog({id:this.createId("idSelectionDisplayDialog"),title:c.oCoreApi.getTextNotHtmlEncoded("selected-required-filter",[d])+" ("+b.length+")",contentWidth:jQuery(window).height()*0.6+"px",contentHeight:jQuery(window).height()*0.6+"px",buttons:[new sap.m.Button({text:c.oCoreApi.getTextNotHtmlEncoded("close"),press:function(){e.close();e.destroy();}})],afterClose:function(){e.destroy();}});var D={selectionData:b};var f=new sap.m.List({items:{path:"/selectionData",template:new sap.m.StandardListItem({title:"{text}"})}});var m=new sap.ui.model.json.JSONModel();m.setSizeLimit(b.length);m.setData(D);f.setModel(m);e.addContent(f);return e;}});}());
