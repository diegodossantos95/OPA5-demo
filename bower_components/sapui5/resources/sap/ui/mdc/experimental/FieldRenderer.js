/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','sap/ui/core/IconPool','sap/ui/core/ValueState'],function(q,R,I,V){"use strict";I.insertFontFaceStyle();var F=R.extend("sap.ui.mdc.experimental.FieldRenderer");F.render=function(r,f){var c={content:f._getContent(),editMode:f.getEditMode(),width:f.getWidth(),valueState:f.getValueState()};r.write("<div");r.writeControlData(f);r.addClass("sapUiMdcField");if(c.width){if(c.width==="content"){r.addStyle("width","auto");}else{r.addStyle("width",c.width);}}r.writeStyles();r.writeClasses();r.write(">");if(c.content){r.renderControl(c.content);}r.write("</div>");};return F;},true);
