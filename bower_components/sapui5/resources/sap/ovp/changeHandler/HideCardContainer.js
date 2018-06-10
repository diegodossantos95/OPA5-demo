/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/fl/changeHandler/JsControlTreeModifier'],function(q,J){"use strict";var H={"changeHandler":{},"layers":{"CUSTOMER_BASE":false,"CUSTOMER":false,"USER":false}};H.changeHandler.applyChange=function(c,C,p){p.modifier.byId(c.getContent().id).setVisible(false);return true;};H.changeHandler.completeChangeContent=function(c,s,p){c.setContent(s.removedElement);};return H;},true);
