/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/Object","sap/fe/core/internal/testableHelper"],function(q,B,t){"use strict";function g(T){var b={};var i=false;var a=false;var c=0;var d=T.oNavContainer.getBusyIndicatorDelay();var u=Promise.resolve();var U=q.noop;function e(){return c!==0||!q.isEmptyObject(b);}var A;function f(I){var k=e();if(k||I){a=false;T.oNavContainer.setBusy(k);if(k!==i){i=k;if(!i){T.oNavContainer.setBusyIndicatorDelay(d);U();}}}else{A();}}A=f.bind(null,true);function E(I){if(I){T.oNavContainer.setBusyIndicatorDelay(0);f();}else if(!a){a=true;setTimeout(f,0);}}function h(){c--;if(!c){E(false);}}function m(){if(i){return;}i=true;u=new Promise(function(r){U=r;});}function s(r,I,k){if(I){m();b[r]=true;}else{delete b[r];}E(k);}function j(o,I){c++;m();o.then(h,h);E(I);}return{setBusyReason:s,setBusy:j,isBusy:e,getUnbusy:function(){return u;}};}return B.extend("sap.fe.core.BusyHelper",{constructor:function(T){q.extend(this,(t.testableStatic(g,"BusyHelper"))(T));}});});
