/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.entityTypeMetadata");(function(){'use strict';sap.apf.core.EntityTypeMetadata=function(m,e,M){this.type='entityTypeMetadata';this.getPropertyMetadata=function(p){var r;r=M.getPropertyMetadata(e,p);if(!r){r={dataType:{}};}return r;};this.getEntityTypeMetadata=function(){return M.getEntityTypeAnnotations(e);};function c(){m.check(e&&typeof e==='string','sap.apf.core.entityTypeMetadata: incorrect value for parameter sEntityType');m.check(M&&M.type&&M.type==="metadata",'sap.apf.core.entityTypeMetadata: incorrect value for parameter oMetadata');}c();};}());
