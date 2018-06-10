/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.readRequestByRequiredFilter");jQuery.sap.require("sap.apf.core.request");(function(){'use strict';sap.apf.core.ReadRequestByRequiredFilter=function(i,r,s,e){var c=i.instances.coreApi;var m=i.instances.messageHandler;this.type="readRequestByRequiredFilter";this.send=function(f,C,R){var o;var p;var a=function(b,n){var M;var E;var d=[];if(b&&b.type&&b.type==="messageObject"){m.putMessage(b);M=b;}else{d=b.data;E=b.metadata;}C(d,E,M);};c.getMetadata(s).done(function(M){var P=M.getParameterEntitySetKeyProperties(e);var b="";var E=M.getEntityTypeAnnotations(e);if(E.requiresFilter!==undefined&&E.requiresFilter==="true"){if(E.requiredProperties!==undefined){b=E.requiredProperties;}}var d=b.split(',');P.forEach(function(g){d.push(g.name);});c.getCumulativeFilter().done(function(g){p=g.restrictToProperties(d);if(f){o=f.getInternalFilter();o.addAnd(p);}else{o=p;}r.sendGetInBatch(o,a,R);});});};this.getMetadataFacade=function(){return c.getMetadataFacade(s);};};}());
