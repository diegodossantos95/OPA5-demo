/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.collaboration.components.fiori.notification.NotificationContainer");sap.ui.core.Control.extend("sap.collaboration.components.fiori.notification.NotificationContainer",{metadata:{aggregations:{"content":{singularName:"content"}}},renderer:function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapClbNotifContainerBox");r.writeClasses();r.writeStyles();r.write(">");var C=c.getContent();for(var i=0,l=C.length;i<l;i++){r.renderControl(C[i]);}r.write("</div>");}});
