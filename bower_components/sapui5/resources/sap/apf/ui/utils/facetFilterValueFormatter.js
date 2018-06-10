/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.facetFilterValueFormatter');jQuery.sap.require("sap.apf.ui.utils.formatter");
sap.apf.ui.utils.FacetFilterValueFormatter=function(u,c){"use strict";this.getFormattedFFData=function(f,s,p){var F,t;var o=new sap.apf.ui.utils.formatter({getEventCallback:u.getEventCallback.bind(u),getTextNotHtmlEncoded:c.getTextNotHtmlEncoded,getExits:u.getCustomFormatExit()},p,f);var T=p.text;f.forEach(function(a){F=o.getFormattedValue(s,a[s]);t=F;if(T!==undefined&&a[T]!==undefined){t=F+" - "+a[T];}a.formattedValue=t;});return f;};};
