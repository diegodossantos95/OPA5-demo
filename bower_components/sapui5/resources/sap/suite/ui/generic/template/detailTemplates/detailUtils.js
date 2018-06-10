sap.ui.define(["jquery.sap.global","sap/ui/core/routing/HashChanger","sap/suite/ui/generic/template/extensionAPI/NavigationController","sap/suite/ui/generic/template/lib/MessageButtonHelper","sap/suite/ui/generic/template/lib/testableHelper","sap/suite/ui/generic/template/detailTemplates/PaginatorButtonsHelper","sap/suite/ui/generic/template/ObjectPage/extensionAPI/DraftTransactionController","sap/suite/ui/generic/template/ObjectPage/extensionAPI/NonDraftTransactionController","sap/m/DraftIndicator"],function(q,H,N,M,t,P,D,a){"use strict";var b=sap.m.DraftIndicatorState;function g(C,o,v){function i(){var T=o.getTemplatePrivateModel();T.setProperty("/objectPage",{displayMode:0});}function d(B){var U=C.getModel("ui");var T=o.getTemplatePrivateModel();if(o.getEditableNDC()){U.setProperty("/editable",true);var e=o.isNonDraftCreate();U.setProperty("/createMode",e);T.setProperty("/objectPage/displayMode",e?4:2);}else if(!o.isDraftEnabled()){U.setProperty("/editable",false);U.setProperty("/createMode",false);T.setProperty("/objectPage/displayMode",1);}(v.onComponentActivate||q.noop)(B);}function u(){var B=C.getBindingContext();var T=o.getTemplatePrivateModel();var e=o.registerContext(B);T.setProperty("/generic/draftIndicatorState",b.Clear);(v.refreshFacets||q.noop)(null,true);(v.getHeaderInfoTitleForNavigationMenue||q.noop)();var A=B.getObject();var U=C.getModel("ui");var I;if(e.bIsDraft){I=true;U.setProperty("/enabled",true);T.setProperty("/objectPage/displayMode",e.bIsCreate?4:2);}else{I=o.getEditableNDC();T.setProperty("/objectPage/displayMode",I?2:1);if(A.hasOwnProperty("HasDraftEntity")&&A.HasDraftEntity){U.setProperty("/enabled",false);var m=C.getModel();var r=new Promise(function(R,h){m.read(B.getPath(),{urlParameters:{"$expand":"SiblingEntity,DraftAdministrativeData"},success:R,error:h});});var f=o.getBusyHelper();f.setBusy(r);r.then(function(R){var s=m.getContext("/"+m.getKey(R.SiblingEntity));if(s){(v.draftResume||q.noop)(s,A,R.DraftAdministrativeData);}U.setProperty("/enabled",true);},function(E){});}else{U.setProperty("/enabled",true);}}U.setProperty("/createMode",e.bIsCreate);U.setProperty("/editable",I);}return{init:i,onActivate:d,getTitle:o.getTitleFromTreeNode,updateBindingContext:u};}function c(v,T,C){var o;var e;var l;var p;var h;function G(){return h||H.getInstance();}function f(j,i){return function(){T.oServices.oApplication.subTitleForViewLevelChanged(j,i.getText());};}function s(i){var I=!T.oComponentUtils.isDraftEnabled();if(I||!i){var U=C.getView().getModel("ui");U.setProperty("/editable",i);}if(I){T.oComponentUtils.setEditableNDC(i);}}function O(){T.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){var i=T.oComponentUtils.isDraftEnabled();if(!i){s(false);}T.oServices.oNavigationController.navigateBack();},q.noop,o.state);}function A(){var y=T.oComponentUtils.getTemplatePrivateModel();var U=y.getProperty("/generic/viewLevel")-1;var S=U?T.oServices.oApplication.getHierarchySectionsFromCurrentHash():[];var B=v.aBreadCrumbs;h=G();l="";var j="";for(var i=0;i<U;i++){var z=S[i];l=l+j+z;j="/";var E=e[i];var I=z.split("(");if(I&&I[1]){var L=B&&B[i];if(L){var J=h.hrefForAppSpecificHash?h.hrefForAppSpecificHash(l):"#/"+l;J=T.oServices.oApplication.adaptBreadCrumbUrl(J,i+1);var K="/"+E+"("+I[1];L.setHref(J);L.bindElement({path:K,events:{change:f(i+1,L)}});}}}}function d(i){var j=i.getBindingContext();var z=G().getHash();return T.oServices.oApplicationController.propertyChanged(z,j);}function n(){if(l){T.oServices.oNavigationController.navigateToContext(l,"",true);}else{T.oServices.oNavigationController.navigateToRoot(true);}}function k(E){var i=E.getSource();T.oServices.oApplication.performAfterSideEffectExecution(function(){var B=T.oServices.oApplication.getBusyHelper();if(B.isBusy()){return;}var U=C.getView().getModel("ui");var j=C.getOwnerComponent().getModel("_templPrivGlobal");var z=d(i).then(function(R){if(!o.fclInfo.isContainedInFCL||j.getProperty("/generic/FCL/isVisuallyFullScreen")){n();}},function(){B.getUnbusy().then(function(R){if(!o.fclInfo.isContainedInFCL||j.getProperty("/generic/FCL/isVisuallyFullScreen")){T.oCommonUtils.processDataLossTechnicalErrorConfirmation(function(){n();U.setProperty("/enabled",true);},q.noop,o.state);}else{T.oCommonUtils.processDataLossTechnicalErrorConfirmation(q.noop,q.noop,o.state,"StayOnPage");}});});B.setBusy(z);});}function m(){o.state.messageButtonHelper.toggleMessagePopover();}function r(){var i;return function(){i=i||new N(T,C,o.state);return i;};}function u(){var i;return function(){if(!i){var j=T.oComponentUtils.isDraftEnabled()?D:a;i=new j(T,C,o.state);}return i;};}function w(){p.handleShowNextObject();}function x(){p.handleShowPrevObject();}var G=t.testable(G,"getHashChangerInstance");var A=t.testable(A,"adaptLinksToUpperLevels");o={onInit:function(R){e=T.oServices.oApplication.getSections(C.getOwnerComponent().getEntitySet(),true);if(!R||R.footerBar){var i=T.oComponentUtils.isODataBased();o.state.messageButtonHelper=new M(T.oCommonUtils,C,i);T.oServices.oTemplateCapabilities.oMessageButtonHelper=o.state.messageButtonHelper;}if(!R||R.paginatorButtons){p=new P(o,C,T);}},handlers:{handleShowNextObject:w,handleShowPrevObject:x,onShowMessages:m,applyAndUp:k,onBack:O},extensionAPI:{getNavigationControllerFunction:r,getTransactionControllerFunction:u},fclInfo:{isContainedInFCL:false},state:{},onComponentActivate:function(B){if(o.state.messageButtonHelper){o.state.messageButtonHelper.adaptToContext(B);}T.oComponentUtils.setBackNavigation(O);A();if(p){p.computeAndSetVisibleParamsForNavigationBtns();}}};v.navigateUp=n;v.setEditable=s;var y=T.oComponentUtils.getTemplatePrivateModel();var V=y.getProperty("/generic/viewLevel");var F=T.oServices.oApplication.getFclProxyForView(V);if(F.oActionButtonHandlers){o.handlers.fclActionButtonHandlers=F.oActionButtonHandlers;o.fclInfo.isContainedInFCL=true;o.fclInfo.isNextObjectLoadedAfterDelete=F.isNextObjectLoadedAfterDelete;}o.fclInfo.navigteToDraft=F.navigateToDraft;return o;}return{getComponentBase:g,getControllerBase:c};});
