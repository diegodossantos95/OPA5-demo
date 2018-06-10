/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.helper');
sap.apf.ui.utils.Helper=function(c){"use strict";this.oCoreApi=c;this.getRepresentationSortInfo=function(r){var s=this;var d=jQuery.Deferred();var C=r.parameter.dimensions.concat(r.parameter.measures);var S=r.parameter.orderby;var a=S.map(function(o){var b;var e=jQuery.Deferred();C.forEach(function(f){if(o.property===f.fieldName&&f.fieldDesc&&s.oCoreApi.getTextNotHtmlEncoded(f.fieldDesc)){b=s.oCoreApi.getTextNotHtmlEncoded(f.fieldDesc);e.resolve(b);}});if(!b){s.oCoreApi.getMetadataFacade().getProperty(o.property).done(function(m){if(m.label||m.name){if(m.label){e.resolve(m.label);}else if(m.name){e.resolve(m.name);}else{e.resolve("");}}});}return e.promise();});d.resolve(a);return d.promise();};};
