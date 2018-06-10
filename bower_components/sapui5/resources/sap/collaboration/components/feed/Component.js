/* @copyright */
(function(){var c="sap.collaboration.components.feed.Component";jQuery.sap.require("sap.ui.core.UIComponent");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.declare(c);sap.ui.core.UIComponent.extend(c,{metadata:{stereotype:"component",version:"1.0",includes:["../resources/css/MorePopover.css"],dependencies:{libs:[],components:[],ui5version:""},library:"sap.collaboration",properties:{"axisOrientation":{type:"sap.suite.ui.commons.TimelineAxisOrientation",group:"Misc",defaultValue:sap.suite.ui.commons.TimelineAxisOrientation.Vertical},"feedSources":{type:"object|string[]"},"enableScroll":{type:"boolean",defaultValue:true}},rootView:null,publicMethods:["setSettings","getSelectedGroup"],aggregations:{},routing:{},config:{},customizing:{}},init:function(){this._logger=new jQuery.sap.log.getLogger(c);sap.ui.core.UIComponent.prototype.init.apply(this);},exit:function(){},onBeforeRendering:function(){},onAfterRendering:function(){},createContent:function(){this._view=sap.ui.view({id:this.createId("group_feed_view"),height:"100%",type:sap.ui.core.mvc.ViewType.XML,viewName:"sap.collaboration.components.feed.views.GroupFeed"});this.setAxisOrientation(this.getAxisOrientation());return this._view;},setSettings:function(s){for(var k in s){if(s.hasOwnProperty(k)){this._setProperty(k,s[k]);}}},getSelectedGroup:function(){return this._view.getModel().getProperty("/groupSelected");},_setProperty:function(p,a){this._logger.info(p+": "+a);this._view.getModel().setProperty("/"+p,a);this.setProperty(p,a);},setAxisOrientation:function(a){this._setProperty("axisOrientation",a);return this;},setFeedSources:function(f){this._setProperty("feedSources",f);},setEnableScroll:function(e){this._setProperty("enableScroll",e);return this;}});})();
