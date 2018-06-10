/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/UIComponent","sap/m/NavContainer","sap/fe/core/BusyHelper","sap/fe/core/TemplateAssembler","sap/ui/core/ComponentContainer","sap/fe/core/internal/testableHelper","./model/DraftModel","sap/fe/controller/NavigationController"],function(q,U,N,B,T,C,t,D,a){"use strict";var r=T.getRegisterAppComponent();var c=true;t.testableStatic(function(){c=false;},"suppressPageCreation");function g(A,o){var b;var d;var o={oAppComponent:A,componentRegistry:{},oBusyHelper:null,oMessageUtils:null,oActionController:null,oCommonUtils:null,aAppStateChangedListener:[],getNavigationController:function(){return new a(o);}};function f(i){var R=sap.ui.getCore().getLibraryResourceBundle("sap.fe");return R.getText(i);}function h(e,b){var s='sap.fe.templates.'+b.template,S={entitySet:e,componentData:{preprocessorsData:{},registryEntry:{componentCreateResolve:q.noop,viewLevel:1}}};if(b.settings){q.extend(S,b.settings);}var p=null;A.runAsOwner(function(){p=new C({name:s,propagateModel:true,width:"100%",height:"100%",handleValidation:true,settings:S});});return p;}t.testable({createPageComponentContainer:h,appComponent:A},"templateTester");function j(){var b=k();var P,l,s,m,E,I;function w(){return o.getNavigationController().navigateToMessagePage({text:f("SAPFE_APPSTART_TECHNICAL_ISSUES"),description:f("SAPFE_APPSTART_WRONG_CONFIGURATION")});}if(!b||!b.entitySets||!b.navigation){return w();}for(var p in b.navigation){if(b.navigation[p].isStartPage){if(s){return w();}else{s=b.navigation[p];}}}if(!s||!s.target){return w();}m=s.target.split("/");if(m.length!==2){return w();}E=m[0];I=m[1];if(I!=="feed"){return w();}P=b.entitySets[E][I];if(!P||!P.default){return w();}l=P.default;if(!l.template){return w();}if(l.template!=='ListReport'){return w();}try{var n=h(E,l);o.oNavContainer.addPage(n);var R=A.getRouter();R.attachRoutePatternMatched(function(v){if(v.getParameters().name==="root"){o.oInnerAppStatePromise.resolve();if(o.oAppState){o.oAppState=null;o.oAppStateModel.setData({});for(var i=0;i<o.aAppStateChangedListener.length;i++){o.aAppStateChangedListener[i]();}}}else{var x=v.getParameters().arguments.iAppState;if(o.oAppState&&x===o.oAppState.getKey()){o.oInnerAppStatePromise.resolve();return;}sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(A,x).done(function(S){o.oAppState=S;u(o.oAppStateModel,S);o.oInnerAppStatePromise.resolve();for(var i=0;i<o.aAppStateChangedListener.length;i++){o.aAppStateChangedListener[i]();}});}});R.initialize();}catch(e){o.getNavigationController().navigateToMessagePage({text:f("SAPFE_APPSTART_TECHNICAL_ISSUES"),description:f("SAPFE_APPSTART_WRONG_CONFIGURATION")});}}function k(){if(!b){var m=A.getMetadata();b=m.getManifestEntry("sap.fe");}return b;}function u(e,i){var l=i.getData();if(l&&(JSON.stringify(l)!==JSON.stringify(e.getProperty("/")))&&e){e.setProperty("/",l);return true;}return false;}return{init:function(){var e={appComponent:A,oTemplateContract:o};var s=sap.ui.core.service.ServiceFactoryRegistry.get("sap.ushell.ui5service.ShellUIService");o.oShellServicePromise=(s&&s.createInstance())||Promise.reject();o.oShellServicePromise.catch(function(){q.sap.log.warning("No ShellService available");});o.oInnerAppStatePromise=new q.Deferred();o.oAppStateModel=new sap.ui.model.json.JSONModel();(U.prototype.init||q.noop).apply(A,arguments);o.oBusyHelper.setBusy(o.oShellServicePromise);d=r(e);var m=A.getModel();if(m){D.isDraftModel(m).then(function(i){if(i){D.upgrade(m).then(function(){A.setModel(m.getDraftAccessModel(),"$draft");});}});m.getMetaModel().requestObject("/$EntityContainer/").catch(function(E){o.getNavigationController().navigateToMessagePage({text:f("SAPFE_APPSTART_TECHNICAL_ISSUES"),description:E.message});for(var i in o.componentRegistry){o.componentRegistry[i].fnViewRegisteredResolve();}});}o.oBusyHelper.setBusyReason("initAppComponent",false);},exit:function(){if(o.oNavContainer){o.oNavContainer.destroy();}d();},createContent:function(){if(o.oNavContainer){return"";}o.oNavContainer=new N({id:A.getId()+"-appContent"});o.oBusyHelper=new B(o);o.oBusyHelper.setBusyReason("initAppComponent",true,true);if(c){j();}return o.oNavContainer;}};}return U.extend("sap.fe.AppComponent",{metadata:{config:{fullWidth:true},events:{pageDataLoaded:{}},routing:{config:{},routes:[{pattern:"",name:"root"},{pattern:"?sap-iapp-state={iAppState}",name:"rootWithAppState"}],targets:[]},library:"sap.fe"},constructor:function(){var A=t.startApp();q.extend(this,g(this,A));(U.prototype.constructor||q.noop).apply(this,arguments);}});});