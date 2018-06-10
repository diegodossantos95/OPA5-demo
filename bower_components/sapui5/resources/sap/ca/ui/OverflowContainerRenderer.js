/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.OverflowContainerRenderer");sap.ca.ui.OverflowContainerRenderer={};
sap.ca.ui.OverflowContainerRenderer.render=function(r,c){var C=c.getContent();r.write("<div");r.writeControlData(c);r.addStyle("max-height",c.getExpanded()?"none":c.getOverflowHeight());r.writeStyles();r.addClass("sapCaUiOC");r.writeClasses();r.write(">");r.write("<div id='"+c.getId()+"-content'");r.writeClasses();r.write(">");jQuery.each(C,function(i){r.renderControl(C[i]);});r.write("</div>");r.write("<div");r.writeAttributeEscaped("id",c.getId()+"-overlay");r.addClass("sapCaUiOCOverlay");r.writeClasses();r.write(">");r.write("</div>");r.renderControl(c._getButton());r.write("</div>");};
