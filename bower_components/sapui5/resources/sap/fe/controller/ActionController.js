/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/Object","sap/m/MessageBox","sap/m/MessageToast"],function(q,B,M,a){"use strict";function g(t){var m=t.getMessageUtils();function c(E){var p=E.getParameters(),s=p.success,f=p.error,C=p.contexts,o=C[0].getModel(),A,b,d=[],h=p.actionName+"(...)",j=p.mode==='ChangeSet',G,i;if(p.checkBusy){if(t.getBusyHelper().isBusy()){return f?f("Application is busy"):q.noop();}}for(i=0;i<C.length;i++){A=o.bindContext(h,C[i]);if(C.length===1){d.push(A.execute('$auto'));b=d[0];}else{G=(j)?'$direct':'action'+i;d.push(A.execute(G));}}if(C.length>1){if(j){b=o.submitBatch("actions");}else{for(i=0;i<C.length;i++){b=o.submitBatch("action"+i);}}if(p.setBusy){t.getBusyHelper().setBusy(b);}}else if(p.setBusy){t.getBusyHelper().setBusy(b);}function D(k){return k.then(function(v){return{v:v,status:"resolved"};},function(e){return{e:e,status:"rejected"};});}Promise.all(d.map(D)).then(function(r){var e=[];var R;for(R=0;R<r.length;R++){if(r[R].status==="rejected"){e.push(r[R].e);}}if(e.length>0){m.handleRequestFailed(e);}for(R=0;R<r.length;R++){if(r[R].status==="resolved"){m.handleSuccess(t.getText("SAPFE_ACTION_SUCCESS",p.actionLabel));C[0].getBinding().refresh("$auto");s?s():q.noop();}}});}return{callAction:c};}return B.extend("sap.fe.controller.ActionController.js",{constructor:function(t){q.extend(this,g(t));}});});
