/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/fl/changeHandler/JsControlTreeModifier'],function(q,J){"use strict";var U={"changeHandler":{},"layers":{"CUSTOMER_BASE":false,"CUSTOMER":false,"USER":false}};U.changeHandler.applyChange=function(c,p,P){P.modifier.byId(c.getContent().revealedElementId).setVisible(true);return true;};U.changeHandler.completeChangeContent=function(c,s,p){c.setContent({"revealedElementId":s.revealedElementId});};return U;},true);
