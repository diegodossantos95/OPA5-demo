/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.odataRequest");jQuery.sap.require("sap.apf.core.utils.checkForTimeout");jQuery.sap.require("sap.ui.model.odata.ODataUtils");(function(){'use strict';sap.apf.core.odataRequestWrapper=function(i,r,s,e,b){var d=i.instances.datajs;function a(j,k){var M=sap.apf.core.utils.checkForTimeout(k);var E={};if(M){E.messageObject=M;e(E);}else{s(j,k);}}function c(E){var M=sap.apf.core.utils.checkForTimeout(E);if(M){E.messageObject=M;}e(E);}var m=r.serviceMetadata;var f=i.functions.getSapSystem();if(f&&!r.isSemanticObjectRequest){var g=/(\/[^\/]+)$/g;if(r.requestUri&&r.requestUri[r.requestUri.length-1]==='/'){r.requestUri=r.requestUri.substring(0,r.requestUri.length-1);}var l=r.requestUri.match(g)[0];var h=r.requestUri.split(l);var t=sap.ui.model.odata.ODataUtils.setOrigin(h[0],{force:true,alias:f});r.requestUri=t+l;}d.request(r,a,c,b,undefined,m);};}());
