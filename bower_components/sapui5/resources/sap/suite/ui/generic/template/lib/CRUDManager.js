sap.ui.define(["jquery.sap.global","sap/ui/base/Object","sap/m/MessageToast","sap/ui/generic/app/util/ModelUtil","sap/ui/generic/app/util/ActionUtil","sap/suite/ui/generic/template/lib/MessageUtils","sap/m/MessageBox","sap/suite/ui/generic/template/lib/CRUDHelper","sap/suite/ui/generic/template/lib/testableHelper"],function(q,B,M,a,A,b,c,C,t){"use strict";var r=Promise.reject();r.catch(q.noop);function g(o,d,s,e,f){function h(O,i,j,P){b.handleError(O,o,s,j,P);return(i||q.noop)(j);}function k(){b.handleTransientMessages(s.oApplication.getDialogFragmentForView.bind(null,null));}var E;function l(i){return new Promise(function(j,H){var I=o.getOwnerComponent();var J=I.getBindingContext();var K=I.getModel();K.read(J.getPath(),{urlParameters:{"$expand":"DraftAdministrativeData"},success:function(R){if(!R.DraftAdministrativeData){if(i){return h(b.operations.editEntity,H,i);}return j({});}if(R.DraftAdministrativeData.InProcessByUser){var U=R.DraftAdministrativeData.InProcessByUserDescription||R.DraftAdministrativeData.InProcessByUser;i=i||new Error(e.getText("ST_GENERIC_DRAFT_LOCKED_BY_USER",[" ",U]));return h(b.operations.editEntity,H,i,i);}return j({draftAdministrativeData:R.DraftAdministrativeData});},error:h.bind(null,b.operations.editEntity,H)});});}function m(i,U,P){if(P.draftAdministrativeData){return Promise.resolve(P);}return new Promise(function(j,H){s.oTransactionController.editEntity(o.getView().getBindingContext(),!U).then(function(R){k(R);return j({context:R.context});},function(R){if(R&&R.response&&R.response.statusCode==="409"&&i&&!U){b.removeTransientMessages();return l(R).then(j,H);}else{h(b.operations.editEntity,H,R,R);}});});}E=function(U){var i=d.isDraftEnabled();var R;var j=o.getOwnerComponent();var H=j.getBindingContext();if(i&&!U){var I=s.oDraftController.getDraftContext();var P=I.hasPreserveChanges(H);if(!P){R=l().then(m.bind(null,true,true));}}R=R||m(i,U,{});if(i){s.oApplication.editingStarted(H,R);}return R;};function n(U){if(f.isBusy()){return r;}var R=E(U);f.setBusy(R);return R;}function p(i,H,j,I){var R=new Promise(function(J,K){var L=function(N){o.getOwnerComponent().getComponentContainer().bindElement(j.getPath());return h(b.operations.deleteEntity,K,N);};if(i&&I){s.oDraftController.getDraftForActiveEntity(j).then(function(N){s.oTransactionController.deleteEntity(N.context).then(function(){s.oApplication.showMessageToast(e.getText("ST_GENERIC_DRAFT_WITH_ACTIVE_DOCUMENT_DELETED"));return J();});},L);}else{s.oTransactionController.deleteEntity(j).then(function(){var N=a.getEntitySetFromContext(j);var O=s.oDraftController.getDraftContext();var P=O.isDraftRoot(N);var Q=e.getText("ST_GENERIC_OBJECT_DELETED");if(!i&&P){Q=e.getText(H?"ST_GENERIC_DRAFT_WITH_ACTIVE_DOCUMENT_DELETED":"ST_GENERIC_DRAFT_WITHOUT_ACTIVE_DOCUMENT_DELETED");}s.oApplication.showMessageToast(Q);return J();},L);}});return R;}function u(i){var R=new Promise(function(j,H){var I=o.getView().getBindingContext();var J=s.oDraftController.isActiveEntity(I);var K=s.oDraftController.hasActiveEntity(I);var S;if(i){S=Promise.resolve(I);}else if(K&&!J){S=s.oApplication.getDraftSiblingPromise(I);}else{S=Promise.resolve();}S.then(function(L){var N=p(J,K,I,i);N.then(j,H);if(!J){var T=function(){return{context:L};};var O=N.then(T);s.oApplication.cancellationStarted(I,O);}},H);});return R;}function v(P){var R=new Promise(function(H,I){s.oTransactionController.deleteEntities(P).then(function(J){var K=[];var O=sap.ui.getCore().getMessageManager().getMessageModel().getData();for(var i=0;i<O.length;i++){var L=O[i].getTarget();for(var j=0;j<P.length;j++){var N=O[i].getType()||"";if(L.indexOf(P[j])>-1&&(N!=="Information"&&N!=="Success")){K.push(L);break;}}}return H(K);},function(i){return I(i);});});R.then(function(j){var H=[];for(var i=0;i<P.length;i++){if(j.indexOf(P[i])===-1){H.push(P[i]);}}s.oApplication.adaptAfterDeletion(H,d.getViewLevel());});return R;}function w(i,j){if(f.isBusy()){j();return;}s.oTransactionController.triggerSubmitChanges().then(function(R){k();i(R.context);},h.bind(null,b.operations.saveEntity,j));}function x(){var R=new Promise(function(i,j){s.oApplication.performAfterSideEffectExecution(w.bind(null,i,j));});f.setBusy(R);return R;}function y(){if(f.isBusy()){return r;}var R=new Promise(function(i,j){var H=o.getView().getBindingContext();var I=s.oDraftController.activateDraftEntity(H);s.oApplication.activationStarted(H,I);I.then(function(J){var P=J.context.getPath();function K(){k();i(J);}var L=d.getPreprocessorsData().rootContextExpand;if(L){var N=L.join(",");o.getView().getModel().read(P,{urlParameters:{"$select":N,"$expand":N},success:K,error:K});}else{K();}},h.bind(null,b.operations.activateDraftEntity,j));});f.setBusy(R);return R;}function z(P){return new A(P);}function D(P,S,R,j){if(f.isBusy()){j();return;}var H=P.functionImportPath;var I=P.contexts;var J=P.sourceControl;var K=P.label;var N=P.navigationProperty;var O=P.operationGrouping;var L=z({controller:o,contexts:I,applicationController:s.oApplicationController,operationGrouping:O});var Q=function(W,X){if(W.pages){for(var i in W.pages){var Y=W.pages[i];if(Y.component.list!=true&&Y.entitySet===X){return true;}else{var Z=Q(Y,X);if(Z){return true;}}}}return false;};var T=function(i,W){var X=i.getAppComponent().getConfig();if(W&&W.sPath){var Y=W.sPath.split("(")[0].replace("/","");return Q(X.pages[0],Y);}return false;};var U=function(i){var W,X,Y,Z;if(q.isArray(i)&&i.length===1){W=i[0];}else{W={response:{context:i.context}};}X=W.response&&W.response.context;Y=o.getOwnerComponent();Z=T(Y,X);if(Z&&X&&X!==W.actionContext&&X.getPath()!=="/undefined"){if(J){e.navigateFromListItem(X,J);}else{s.oNavigationController.navigateToContext(X,N,false);}}if(i.length>0){var $=e.getTableBindingInfo(J);var _=$&&$.binding;if(_&&_.oEntityType){e.setEnabledToolbarButtons(J);if(d.isListReportTemplate()){e.setEnabledFooterButtons(J);}}}R(i);};var V=function(i){if(q.isArray(i)){if(i.length===1){i=i[0].error;}else{i=null;}}var W={context:I};if(I&&I[0]){var X=I[0].oModel;if(X&&X.hasPendingChanges()){X.resetChanges();}}h(b.operations.callAction,null,i,W);j(i);};L.call(H,K).then(function(i){var W={};if(i&&i.executionPromise){W.actionLabel=K;f.setBusy(i.executionPromise,null,W);i.executionPromise.then(U,V);}else{if(!i){j();}else{U(i);}}},function(i){if(!i){j();}else{V(i);}});}function F(P,S){var R=new Promise(function(i,j){s.oApplication.performAfterSideEffectExecution(D.bind(null,P,S,i,j));});return R;}function G(T){if(!T){throw new Error("Unknown Table");}var i="";var j="";var H=o.getOwnerComponent();var I=(H.getCreationEntitySet&&H.getCreationEntitySet())||H.getEntitySet();var J,K,N,L;var V=o.getView();var O=V.getModel();var P=V.getBindingContext();if(P){j=e.getTableBindingInfo(T).path;L=O.getMetaModel();K=L.getODataEntitySet(I);J=L.getODataEntityType(K.entityType);N=L.getODataAssociationSetEnd(J,j);if(N){I=N.entitySet;}j="/"+j;i=P.getPath()+j;}else{i="/"+I;}var Q=C.create(s.oDraftController,I,i,O,s.oApplication.setEditableNDC);s.oApplication.getBusyHelper().setBusy(Q);return Q.then(function(R){return{newContext:R,tableBindingPath:j};},h.bind(null,b.operations.addEntry,function(R){throw R;}));}var h=t.testable(h,"handleError");var z=t.testable(z,"getActionUtil");return{editEntity:n,deleteEntity:u,deleteEntities:v,saveEntity:x,activateDraftEntity:y,callAction:F,addEntry:G};}return B.extend("sap.suite.ui.generic.template.lib.CRUDManager",{constructor:function(o,d,s,e,f){q.extend(this,g(o,d,s,e,f));}});});