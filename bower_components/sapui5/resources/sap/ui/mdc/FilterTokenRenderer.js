/*!

* SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved

*/
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer'],function(q,R){"use strict";var F=R.extend("sap.ui.mdc.FilterTokenRenderer");F.render=function(r,c){r.write("<div tabindex=\"-1\"");r.writeControlData(c);r.addClass("sapMToken");r.addClass("sapMFilterToken");r.writeAttribute("role","listitem");r.writeAttribute("aria-readonly",!c.getEditable());r.writeAttribute("aria-selected",c.getSelected());if(c.getSelected()){r.addClass("sapMTokenSelected");}if(!c.getEditable()){r.addClass("sapMTokenReadOnly");}r.writeClasses();var t=c.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t);}var a={};a.describedby={value:c._sAriaTokenLabelId,append:true};if(c.getEditable()){a.describedby={value:c._sAriaTokenDeletableId,append:true};}r.writeAccessibilityState(c,a);r.write(">");this._renderInnerControl(r,c);if(c.getEditable()){r.renderControl(c._deleteIcon);}r.write("</div>");};F._renderInnerControl=function(r,c){var t=c.getTextDirection();r.write("<div");r.addClass("sapMTokenText");r.addClass("sapMFilterTokenText");r.writeStyles();r.writeClasses();if(t!==sap.ui.core.TextDirection.Inherit){r.writeAttribute("dir",t.toLowerCase());}r.writeAttribute("tabIndex","-1");r.write(">");r.writeEscaped(c.getText());r.write("</div>");};return F;},true);
