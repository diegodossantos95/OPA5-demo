/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/fl/Utils'],function(q,U){"use strict";var R={};R.applyChange=function(c,n,p){var C=c.getContent();if(q.isEmptyObject(C)){U.log.error("Change does not contain sufficient information to be applied");return false;}n.getAvailableActions().some(function(a){if(a.getKey()===C.key){p.modifier.setProperty(a,"visible",C.visible);n._updateAvailableAction(a,c.getLayer());return true;}});return true;};R.completeChangeContent=function(c,s,p){if(q.isEmptyObject(s.content)){throw new Error("oSpecificChangeInfo.content should be filled");}if(!s.content.key){throw new Error("In oSpecificChangeInfo.content.key attribute is required");}if(s.content.visible!==false){throw new Error("In oSpecificChangeInfo.content.select attribute should be 'false'");}c.setContent(s.content);};R.discardChangesOfLayer=function(l,n){n._discardAvailableActions(l);};return R;},true);
