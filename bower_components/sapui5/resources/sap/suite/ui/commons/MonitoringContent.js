/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/Icon'],function(q,l,C,I){"use strict";var M=C.extend("sap.suite.ui.commons.MonitoringContent",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{value:{type:"string",group:"Misc",defaultValue:null},iconSrc:{type:"string",group:"Misc",defaultValue:null},size:{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:"Auto"},state:{type:"sap.suite.ui.commons.LoadState",group:"Misc",defaultValue:"Loaded"},animateTextChange:{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{icon:{type:"sap.ui.core.Icon",multiple:false}},events:{press:{}}}});M.prototype.init=function(){this._oIcon=new I(this.getId()+"-icon");this.setAggregation("icon",this._oIcon);};M.prototype.onAfterRendering=function(){if(l.LoadState.Loaded===this.getState()||this.getAnimateTextChange()){q.sap.byId(this.getId()).animate({opacity:"1"},1000);}};M.prototype.setIconSrc=function(i){this._oIcon.setSrc(i);return this;};M.prototype.getIconSrc=function(){return this._oIcon.getImageSrc();};M.prototype.ontap=function(e){this.firePress();};M.prototype.onkeydown=function(e){if(e.which===q.sap.KeyCodes.ENTER||e.which===q.sap.KeyCodes.SPACE){this.firePress();e.preventDefault();}};return M;});
