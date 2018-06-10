/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.OverflowContainer");jQuery.sap.require("sap.ca.ui.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ca.ui.OverflowContainer",{metadata:{deprecated:true,library:"sap.ca.ui",properties:{"overflowHeight":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'200px'},"expanded":{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{"content":{type:"sap.ui.core.Control",multiple:true,singularName:"content"}}}});
/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

sap.ca.ui.OverflowContainer.prototype.init=function(){this._oExpandCollapseBtn=new sap.m.Button({id:this.getId()+"-button",icon:"sap-icon://slim-arrow-down",type:sap.m.ButtonType.Transparent,tap:jQuery.proxy(this._toggleExpandCollapse,this)}).setParent(this).addStyleClass("sapCaUiOCBtn");};
sap.ca.ui.OverflowContainer.prototype._toggleExpandCollapse=function(){var $=this.$();this.setProperty("expanded",!this.getExpanded(),true);var a=jQuery.sap.byId(this.getId()+"-overlay");var i=this.getExpanded();if(i){a.hide();this._oExpandCollapseBtn.setProperty("icon","sap-icon://slim-arrow-up",false);$.css("max-height","none");}else{this._oExpandCollapseBtn.setProperty("icon","sap-icon://slim-arrow-down",false);$.css("max-height",this.getOverflowHeight());a.show();}};
sap.ca.ui.OverflowContainer.prototype.onBeforeRendering=function(){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}};
sap.ca.ui.OverflowContainer.prototype.onAfterRendering=function(){this._sResizeListenerId=sap.ui.core.ResizeHandler.register(jQuery.sap.domById(this.getId()+"-content"),jQuery.proxy(this._resize,this));var b=this.getExpanded()?"sap-icon://slim-arrow-up":"sap-icon://slim-arrow-down";this._oExpandCollapseBtn.setProperty("icon",b,false);this._updateState(this.getExpanded());};
sap.ca.ui.OverflowContainer.prototype._updateState=function(e){var $=jQuery.sap.byId(this.getId()+"-content");var a=jQuery.sap.byId(this.getId()+"-overlay");a.hide();if(parseInt(this.getOverflowHeight(),10)>$.outerHeight(true)){this._oExpandCollapseBtn.setVisible(false);}else{this._oExpandCollapseBtn.setVisible(true);var b=this.$();if(e){b.css("max-height","none");}else{b.css("max-height",this.getOverflowHeight());a.show();}}};
sap.ca.ui.OverflowContainer.prototype._getButton=function(){return this._oExpandCollapseBtn;};
sap.ca.ui.OverflowContainer.prototype.exit=function(){this._oExpandCollapseBtn.destroy();if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}};
sap.ca.ui.OverflowContainer.prototype._resize=function(){if(!this.getDomRef()){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}return;}this._updateState(this.getExpanded());};
