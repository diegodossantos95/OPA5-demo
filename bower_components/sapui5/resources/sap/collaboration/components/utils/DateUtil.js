/**
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/Object',"sap/collaboration/components/utils/LanguageBundle"],function(q,O,L){"use strict";var D=O.extend("sap.collaboration.components.util.DateUtil",{constructor:function(){this._oLanguageBundle=new L();},formatDateToString:function(d){var o=sap.ui.core.format.DateFormat.getDateInstance({style:"short",relative:true},sap.ui.getCore().getConfiguration().getLocale());var t=sap.ui.core.format.DateFormat.getTimeInstance({style:"short"},sap.ui.getCore().getConfiguration().getLocale());var s=o.format(d)+" "+this._oLanguageBundle.getText("ST_GROUP_SELECT_AT")+" "+t.format(d);var p=/[A-Za-z]/;if(s.charAt(0).match(p)){s=s.charAt(0).toUpperCase()+s.slice(1);}return s;},});return D;},true);
