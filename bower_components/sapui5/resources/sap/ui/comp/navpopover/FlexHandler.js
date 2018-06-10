/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/comp/library','sap/ui/base/ManagedObject','sap/ui/comp/personalization/Util','./Util','./Factory','sap/ui/comp/personalization/Controller'],function(q,C,M,P,U,F,a){"use strict";var b=M.extend("sap.ui.comp.navpopover.FlexHandler",{constructor:function(i,s){M.apply(this,arguments);},metadata:{properties:{initialSnapshot:{type:"object",defaultValue:null},snapshotOfUserLayer:{type:"object",defaultValue:null},snapshotOfLayersWithoutUser:{type:"object",defaultValue:null}}}});b.prototype.applySettings=function(s){this.setInitialSnapshot({});this.setSnapshotOfUserLayer({});this.setSnapshotOfLayersWithoutUser({});M.prototype.applySettings.apply(this,arguments);};b.prototype.init=function(){if(JSON.parse(q.sap.getUriParameters().get("sap-ui-smartlink"))){F.getService("FlexConnector").activateApplyChangeStatistics();}};b.prototype.updateAvailableActionOfSnapshot=function(l,L){if(!l||!L){return;}var s;switch(L){case"USER":s=this.getSnapshotOfUserLayer();s[l.getKey()]={key:l.getKey(),visible:l.getVisible()};this.setSnapshotOfUserLayer(s);break;default:s=this.getSnapshotOfLayersWithoutUser();s[l.getKey()]={key:l.getKey(),visible:l.getVisible()};this.setSnapshotOfLayersWithoutUser(s);}};b.prototype.discardAvailableActionsOfSnapshot=function(l){if(l!=="USER"){return;}this.setSnapshotOfUserLayer({});};b.prototype.determineSnapshotOfAvailableActions=function(){var s=b._getUnion(this.getInitialSnapshot(),this.getSnapshotOfLayersWithoutUser());return b._getUnion(s,this.getSnapshotOfUserLayer());};b.prototype.determineSnapshotOfChangedAvailableActions=function(){var s=this.determineSnapshotOfAvailableActions();return b._getUnionCondensed(this.getInitialSnapshot(),s);};b.prototype.openSelectionDialog=function(s,f,S,c,i){var t=this;var o=q.extend(true,{},this.getSnapshotOfLayersWithoutUser());var d=q.extend(true,{},this.getSnapshotOfUserLayer());var e;var g;var h;if(i){e=b._getUnion(this.getInitialSnapshot(),o);g=b._getUnion(e,d);h=b._convertSnapshotToSelectionItems(d);}else{e=this.getInitialSnapshot();g=b._getUnion(e,o);h=b._convertSnapshotToSelectionItems(o);}return new Promise(function(r){var D=false;var j=new a({table:P.createSelectionWrapper(U.getStorableAvailableActions(b._convertSnapshotToObjectArray(e)),f),dialogConfirmedReset:function(){D=true;},setting:{selection:{visible:true,payload:{callbackSaveChanges:function(k){var l=D?e:g;var m=b._getUnion(g,k?b.convertArrayToSnapshot("columnKey",k):{});var n=b._convertSnapshotToChangeFormat(b._getUnionCondensed(l,m));if(c){c(n);return Promise.resolve(true);}if(D){return t._discardChanges(s,i).then(function(p){if(!p){t._revertChanges(s,o,d);return false;}return t._saveChanges(s,n);}).then(function(p){if(!p){t._revertChanges(s,o,d);return false;}return true;});}return t._saveChanges(s,n).then(function(p){if(!p){t._revertChanges(s,o,d);return false;}return true;});}}}},resetToInitialTableState:true,dialogAfterClose:function(){return r();}});j.setPersonalizationData({selection:{selectionItems:h}});j.openDialog({contentWidth:"25rem",contentHeight:"35rem",showReset:S,selection:{visible:true}});});};b.prototype._discardChanges=function(s,i){return F.getService("FlexConnector").discardChangesForControl(s,i).then(function(){return true;})['catch'](function(e){q.sap.log.error("Changes could not be discarded in LRep: "+e.status);return false;});};b.prototype._saveChanges=function(s,c){var m=c.filter(function(o){return o.visible===true;});var d=c.filter(function(o){return o.visible===false;});return F.getService("FlexConnector").createAndSaveChangesForControl(m,d,s).then(function(){return true;})['catch'](function(e){q.sap.log.error("Changes could not be saved in LRep: "+e.status);return false;});};b.prototype._revertChanges=function(s,S,o){this.setSnapshotOfLayersWithoutUser(S);this.setSnapshotOfUserLayer(o);s._syncAvailableActions();};b._getUnion=function(s,S){var o=q.extend(true,{},s);if(S){for(var k in o){if(S[k]&&S[k].visible!==undefined){o[k].visible=S[k].visible;}}}return o;};b._getUnionCondensed=function(s,S){var o=b._condense(s,S);var c=b._condense(S,s);return b._getUnion(o,c);};b._condense=function(s,S){var o={};for(var k in s){if(!P.semanticEqual(s[k],S[k])){o[k]=s[k];}}return o;};b._convertSnapshotToChangeFormat=function(s){var m=b._convertSnapshotToObjectArray(s);return m.map(function(o){return{key:o.key,visible:o.visible};});};b._convertSnapshotToSelectionItems=function(s){return b._convertSnapshotToObjectArray(s).map(function(m){return{columnKey:m.key,visible:m.visible};});};b._convertSnapshotToObjectArray=function(s){return Object.keys(s).map(function(k){return s[k];});};b.convertArrayToSnapshot=function(k,i){var s={};i.forEach(function(I){if(I[k]===undefined){return;}s[I[k]]=I;});return s;};return b;},true);
