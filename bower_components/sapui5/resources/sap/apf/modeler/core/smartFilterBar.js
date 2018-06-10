/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.smartFilterBar");(function(){'use strict';sap.apf.modeler.core.SmartFilterBar=function(s){var a,e;var E=false;this.getId=function(){return s;};this.setService=function(n){a=n;};this.getService=function(){return a;};this.setEntitySet=function(n,b){e=n;E=b;};this.getEntitySet=function(){return e;};this.isEntityTypeConverted=function(){return!E;};};}());
