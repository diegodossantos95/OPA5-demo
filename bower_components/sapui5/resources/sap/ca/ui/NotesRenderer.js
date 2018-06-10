/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.NotesRenderer");jQuery.sap.require("sap.m.ListRenderer");sap.ca.ui.NotesRenderer={};
sap.ca.ui.NotesRenderer.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapCaUiNotes");r.writeClasses();r.write(">");if(c.getShowNoteInput()){r.write("<div ");r.writeAttributeEscaped("id",c.getId()+"-noteInput");r.addClass("sapCaUiNoteInput");r.writeClasses();r.write(">");if(!jQuery.device.is.phone){r.renderControl(c._getFlexBox());}else{r.renderControl(c._oTextArea);r.renderControl(c._oButton);}r.write("</div>");}sap.m.ListRenderer.render(r,c);r.write("</div>");};
