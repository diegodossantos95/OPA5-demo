/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/comp/library','sap/ui/comp/navpopover/FlexConnector'],function(C,F){"use strict";var a={getService:function(s){switch(s){case"CrossApplicationNavigation":return sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("CrossApplicationNavigation");case"URLParsing":return sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("URLParsing");case"FlexConnector":return F;default:return null;}}};return a;},true);
