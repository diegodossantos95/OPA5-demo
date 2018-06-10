/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.getCore().loadLibrary('sap.ui.fl');sap.ui.define(['sap/ui/comp/library','sap/ui/comp/navpopover/flexibility/changes/AddLink','sap/ui/comp/navpopover/flexibility/changes/RemoveLink','sap/ui/fl/Utils','sap/ui/fl/FlexControllerFactory','sap/ui/fl/ChangePersistenceFactory'],function(C,A,R,F,a,b){"use strict";var c={getAppComponentForControl:function(o){return F.getAppComponentForControl(o);},isVendorLayer:function(){return F.isVendorLayer();},createAndSaveChangesForControl:function(m,M,o){if(!m.length&&!M.length){return Promise.resolve();}this.createChangesForControl(M,o,sap.ui.comp.navpopover.ChangeHandlerType.removeLink);this.createChangesForControl(m,o,sap.ui.comp.navpopover.ChangeHandlerType.addLink);return this.saveChangesForControl(o);},createChangesForControl:function(m,o,s){if(!m.length){return;}if(!s){throw new Error("sChangeType should be filled");}var f=a.createForControl(o);m.forEach(function(M){f.createAndApplyChange({changeType:s,content:M,isUserDependent:true},o);});},saveChangesForControl:function(o){return a.createForControl(o).saveAll();},readChangesForControl:function(s,o){var d=this.getAppComponentForControl(o);var e=F.getFlexReference(d.getManifestObject());var m=b.getChangePersistenceForComponent(e).getChangesMapForComponent();return m.mChanges[s]?m.mChanges[s]:[];},discardChangesForControl:function(o,d){return a.createForControl(o).discardChangesForId(o.getId(),d).then(function(){if(d){A.discardChangesOfLayer("USER",o);R.discardChangesOfLayer("USER",o);}});},activateApplyChangeStatistics:function(){var t=this;this.aStatistics=[];var w=function(o,n){if(t.aStatistics.findIndex(function(s){return s.stableId===n.getId()&&s.changeId===o.getId();})<0){var h=n.getAvailableActions().find(function(i){return i.getKey()===o.getContent().key;});t.aStatistics.push({stableId:n.getId(),changeId:o.getId(),layer:o.getLayer(),key:o.getContent().key,text:h?h.getText():'',changeType:o.getChangeType()});}};var d=function(l){t.aStatistics=t.aStatistics.filter(function(s){return s.layer!==l;});};var f=A.applyChange.bind(A);A.applyChange=function(o,n,p){w(o,n);f(o,n,p);};var r=R.applyChange.bind(R);R.applyChange=function(o,n,p){w(o,n);r(o,n,p);};var e=A.discardChangesOfLayer.bind(A);A.discardChangesOfLayer=function(l,n){d(l);e(l,n);};var g=R.discardChangesOfLayer.bind(R);R.discardChangesOfLayer=function(l,n){d(l);g(l,n);};},_formatStatistic:function(s){var l=s.layer;switch(s.layer){case"VENDOR":l=""+l;break;case"CUSTOMER":l="        "+l;break;case"USER":l="                "+l;break;default:l=""+l;}var v;switch(s.changeType){case sap.ui.comp.navpopover.ChangeHandlerType.addLink:v="On";break;case sap.ui.comp.navpopover.ChangeHandlerType.removeLink:v="Off";break;default:v="";}return{formattedLayer:l,formattedValue:v};},printStatisticAll:function(){if(!this.aStatistics){jQuery.sap.log.info("Please activate with sap.ui.comp.navpopover.FlexConnector.activateApplyChangeStatistics()");return;}var t=this;jQuery.sap.log.info("idx - VENDOR ------------ CUSTOMER ----------- USER --------------------------------------");this.aStatistics.forEach(function(s,i){var f=t._formatStatistic(s);jQuery.sap.log.info(i+" "+s.stableId+" "+f.formattedLayer+" '"+s.text+"' "+f.formattedValue);});}};return c;},true);