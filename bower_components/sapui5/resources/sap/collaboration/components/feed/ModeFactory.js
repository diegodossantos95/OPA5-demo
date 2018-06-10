/*
* ! SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
*/
sap.ui.define(["./GroupIDsMode","./BOMode","./UserMode"],function(G,B,U){var M=function(){this._oFeedTypeToModeClass={};this._oFeedTypeToModeClass[sap.collaboration.FeedType.GroupIds]=G;this._oFeedTypeToModeClass[sap.collaboration.FeedType.BusinessObjectGroups]=B;this._oFeedTypeToModeClass[sap.collaboration.FeedType.UserGroups]=U;};M._instance=null;M.getInstance=function(){if(M._instance===null){M._instance=new M();}return M._instance;};M.prototype.createMode=function(f,F){var a=this._oFeedTypeToModeClass[f];if(a===undefined){var e=f+" is not a valid value for the feedSources mode property.\n";e+="It must be equal to the value of either one of the following:\n";e+="sap.collaboration.FeedType.GroupIds\n";e+="sap.collaboration.FeedType.BusinessObjectGroups\n";e+="sap.collaboration.FeedType.UserGroups";F.logError(e);F.byId("timeline").destroy();throw new Error(e);}return new a(F);};return M;},true);
