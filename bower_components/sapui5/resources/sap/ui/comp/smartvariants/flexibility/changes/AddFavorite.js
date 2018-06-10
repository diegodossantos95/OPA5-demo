/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/fl/Utils'],function(q,U){"use strict";var A={};A.applyChange=function(c,v,p){var C=c.getContent();if(q.isEmptyObject(C)){U.log.error("Change does not contain sufficient information to be applied");return false;}v.getItems().some(function(i){if(i.getKey()===C.key){i.setFavorite(C.visible);return true;}else if(i.getKey()===sap.ui.comp.STANDARD_VARIANT_NAME){v.setStandardFavorite(C.visible);return true;}});return true;};A.completeChangeContent=function(c,s,p){if(q.isEmptyObject(s.content)){throw new Error("oSpecificChangeInfo.content should be filled");}if(!s.content.key){throw new Error("In oSpecificChangeInfo.content.key attribute is required");}if(s.content.visible!==true){throw new Error("In oSpecificChangeInfo.content.select attribute should be 'true'");}c.setContent(s.content);};return A;},true);
