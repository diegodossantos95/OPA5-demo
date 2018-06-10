/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.core.utils.checkForTimeout');jQuery.sap.require('sap.apf.core.messageObject');(function(){'use strict';sap.apf.core.utils.checkForTimeout=function(s){var a;var m;var r=false;if(s&&s.headers&&s.headers['x-sap-login-page']){r=true;}if(s&&s.getResponseHeader&&s.getResponseHeader('x-sap-login-page')!==null){r=true;}if(s&&s.status){a=s.status;}if(s&&s.response&&s.response.statusCode){a=s.response.statusCode;}if(a===303||a===401||a===403||r){m=new sap.apf.core.MessageObject({code:"5021"});}return m;};}());
