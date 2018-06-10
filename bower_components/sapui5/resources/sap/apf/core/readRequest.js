/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.readRequest");jQuery.sap.require("sap.apf.core.request");(function(){'use strict';sap.apf.core.ReadRequest=function(i,r,s,e){var c=i.instances.coreApi;var m=i.instances.messageHandler;this.type="readRequest";this.send=function(f,C,R){var a;var b=function(o,n){var M;var E;var d=[];if(o&&o.type&&o.type==="messageObject"){m.putMessage(o);M=o;}else{d=o.data;E=o.metadata;}C(d,E,M);};if(f){a=f.getInternalFilter();}else{a=new sap.apf.core.utils.Filter(m);}r.sendGetInBatch(a,b,R);};this.getMetadata=function(){return c.getEntityTypeMetadata(s,e);};this.getMetadataFacade=function(){return c.getMetadataFacade(s);};};}());
