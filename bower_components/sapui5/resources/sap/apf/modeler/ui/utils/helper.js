/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.utils.helper');(function(){"use strict";sap.apf.modeler.ui.utils.helper={onResize:function(c){jQuery(window).resize(function(){c();});},applySize:function(w,h,c,o){var a,b;if(h!==undefined){if(h.getDomRef!==undefined){b=jQuery(h.getDomRef()).height();}else if(jQuery.isNumeric(h)){b=h;}else{b=jQuery(h).height();}}if(w!==undefined){if(w.getDomRef!==undefined){a=jQuery(h.getDomRef()).width();}else if(jQuery.isNumeric(w)){a=w;}else{b=jQuery(w).width();}}var d=(c.getDomRef!==undefined)?jQuery(c.getDomRef()):jQuery(c);var e=(o===undefined)?0:(o.offsetHeight||0);var f=(o===undefined)?0:(o.offsetWidth||0);d.css({height:(h===undefined)?"100%":b+e+"px",width:(w===undefined)?"100%":a+f+"px"});}};}());
