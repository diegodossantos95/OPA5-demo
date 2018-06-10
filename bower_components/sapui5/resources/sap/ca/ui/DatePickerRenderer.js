/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.DatePickerRenderer");jQuery.sap.require("sap.m.InputBaseRenderer");jQuery.sap.require("sap.ui.core.Renderer");sap.ca.ui.DatePickerRenderer=sap.ui.core.Renderer.extend(sap.m.InputBaseRenderer);
sap.ca.ui.DatePickerRenderer.addOuterClasses=function(r,c){r.addClass("sapCaUiDatePicker");r.addClass("sapMInput");r.addClass("sapMInputVH");};
sap.ca.ui.DatePickerRenderer.writeInnerContent=function(r,c){r.write('<div class="sapMInputValHelp">');r.renderControl(c._getCalendarIcon());r.write('</div>');};
