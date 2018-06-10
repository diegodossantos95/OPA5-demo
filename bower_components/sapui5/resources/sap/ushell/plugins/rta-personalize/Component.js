sap.ui.define(["sap/ushell/plugins/BaseRTAPlugin","sap/m/MessageBox","sap/ui/fl/Utils","sap/ui/fl/EventHistory"],function(B,M,F,E){"use strict";var a=function(i,v){if(sap.ui.getCore().byId(i)){sap.ui.getCore().byId(i).setVisible(v);}};var R=B.extend("sap.ushell.plugins.rta-personalize.Component",{metadata:{manifest:"json"},init:function(){var c={sComponentName:"sap.ushell.plugins.rta-personalize",layer:"USER",developerMode:false,id:"PERSONALIZE_Plugin_ActionButton",text:"PERSONALIZE_BUTTON_TEXT",icon:"sap-icon://edit",visible:false};B.prototype.init.call(this,c);this._aPersonalizableControls=[];this._aOriginalFooterVisibility=[];var A=function(C){if(this._aPersonalizableControls.indexOf(C)===-1){this._aPersonalizableControls.push(C);a("PERSONALIZE_Plugin_ActionButton",true);}}.bind(this);var r=function(C){var i=this._aPersonalizableControls.indexOf(C);this._aPersonalizableControls.splice(i,1);this._aOriginalFooterVisibility.splice(i,1);if(this._aPersonalizableControls.length===0){this._oObserver.disconnect();delete this._oObserver;a("PERSONALIZE_Plugin_ActionButton",false);}}.bind(this);var o=function(C,s,b){if(F.checkControlId(b)){A(b);if(!this._oObserver){this._oObserver=new MutationObserver(function(m){this._aPersonalizableControls.forEach(function(b){if(!b.getDomRef()){r(b);}});}.bind(this));var c={attributes:true,childList:true,characterData:false,subtree:true,attributeFilter:["style","class"]};this._oObserver.observe(window.document,c);}}}.bind(this);sap.ui.getCore().getEventBus().subscribe("sap.ui","ControlForPersonalizationRendered",o,this);var e=E.getHistoryAndStop("ControlForPersonalizationRendered");e.forEach(function(b){o(b.channelId,b.eventId,b.parameters);});},_onStartHandler:function(e){var i=e.getParameter("editablePluginsCount");if(i!==undefined&&i<=0){M.information(this.i18n.getText("MSG_STARTUP_NO_OVERLAYS"),{onClose:function(){this._oRTA.stop(true);}.bind(this)});}var v=sap.ui.getCore().byId("viewPortContainer");v.attachAfterSwitchState(function(d){if(this._oRTA){if(d.getParameter("to")==="LeftCenter"){this._oRTA.getToolbar().addStyleClass("sapUiRtaHideToolbar");this._oRTA.setMode("navigation");}}}.bind(this));v.attachAfterSwitchStateAnimationFinished(function(d){if(this._oRTA){if(d.getParameter("to")==="Center"){this._oRTA.getToolbar().removeStyleClass("sapUiRtaHideToolbar");this._oRTA.setMode("adaptation");}}}.bind(this));},_loadPlugins:function(r){var p=new Promise(function(b,c){sap.ui.require(["sap/ui/rta/plugin/EasyAdd","sap/ui/rta/plugin/EasyRemove"],function(d,e){var P=r.getDefaultPlugins();var o=P["remove"];P["remove"]=new e({commandFactory:o.getCommandFactory()});var A=P["additionalElements"];P["additionalElements"]=new d({commandFactory:A.getCommandFactory(),analyzer:A.getAnalyzer(),dialog:A.getDialog()});r.setPlugins(P);b();});});return p;},_onAdapt:function(e){if(e.getSource().getText()===this.i18n.getText("PERSONALIZE_BUTTON_TEXT")){e.getSource().setText(this.i18n.getText("END_PERSONALIZE_BUTTON_TEXT"));a("RTA_Plugin_ActionButton",false);this._aPersonalizableControls.forEach(function(c){if(c.setShowFooter){this._aOriginalFooterVisibility.push(c.getShowFooter());}else{this._aOriginalFooterVisibility.push(undefined);}}.bind(this));this._adaptFooterVisibility(false);B.prototype._onAdapt.call(this,e);}else{this._oRTA.stop();}},_switchToDefaultMode:function(){sap.ui.getCore().byId("PERSONALIZE_Plugin_ActionButton").setText(this.i18n.getText("PERSONALIZE_BUTTON_TEXT"));a("RTA_Plugin_ActionButton",true);this._adaptFooterVisibility(true);sap.m.MessageToast.show(this.i18n.getText("SAVE_SUCCESSFUL"),{duration:4000,offset:"0 -50"});B.prototype._switchToDefaultMode.call(this);},_checkRestartRTA:function(){},_adaptFooterVisibility:function(v){this._aPersonalizableControls.forEach(function(c,i){if(this._aOriginalFooterVisibility[i]){c.setShowFooter(v);}}.bind(this));}});return R;},true);