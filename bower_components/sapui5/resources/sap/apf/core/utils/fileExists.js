/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.core.utils.fileExists');jQuery.sap.require('sap.apf.core.utils.checkForTimeout');jQuery.sap.require('sap.ui.model.odata.ODataUtils');(function(){'use strict';sap.apf.core.utils.FileExists=function(i){var f={};var a=i&&i.functions&&i.functions.ajax;var s=i&&i.functions&&i.functions.getSapSystem&&i.functions.getSapSystem();this.check=function(u){if(s){u=sap.ui.model.odata.ODataUtils.setOrigin(u,{force:true,alias:s});}if(f[u]!==undefined){return f[u];}var F=false;var c={url:u,type:"HEAD",success:function(d,S,j){var m=sap.apf.core.utils.checkForTimeout(j);if(m===undefined){F=true;}else{F=false;}},error:function(){F=false;},async:false};if(a){a(c);}else{jQuery.ajax(c);}f[u]=F;return F;};};}());
