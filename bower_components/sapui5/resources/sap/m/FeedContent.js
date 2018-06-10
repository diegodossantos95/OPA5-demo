/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/m/Text'],function(q,l,C,T){"use strict";var F=C.extend("sap.m.FeedContent",{metadata:{library:"sap.m",properties:{"size":{type:"sap.m.Size",group:"Misc",defaultValue:sap.m.Size.Auto},"contentText":{type:"string",group:"Misc",defaultValue:null},"subheader":{type:"string",group:"Misc",defaultValue:null},"value":{type:"string",group:"Misc",defaultValue:null},"valueColor":{type:"sap.m.ValueColor",group:"Misc",defaultValue:null},"truncateValueTo":{type:"int",group:"Misc",defaultValue:4}},defaultAggregation:"_contentTextAgr",aggregations:{"_contentTextAgr":{type:"sap.m.Text",multiple:false,visibility:"hidden"}},events:{"press":{}}}});F.prototype.init=function(){this._oContentText=new T(this.getId()+"-content-text",{maxLines:2});this._oContentText.cacheLineHeight=false;this.setAggregation("_contentTextAgr",this._oContentText,true);this.setTooltip("{AltText}");};F.prototype.onBeforeRendering=function(){this.$().unbind("mouseenter",this._addTooltip);this.$().unbind("mouseleave",this._removeTooltip);};F.prototype.onAfterRendering=function(){this.$().bind("mouseenter",this._addTooltip.bind(this));this.$().bind("mouseleave",this._removeTooltip.bind(this));};F.prototype.exit=function(){this._oContentText=null;};F.prototype._addTooltip=function(){this.$().attr("title",this.getTooltip_AsString());};F.prototype._removeTooltip=function(){this.$().attr("title",null);};F.prototype.getAltText=function(){var a="";var i=true;if(this.getAggregation("_contentTextAgr").getText()){a+=this.getAggregation("_contentTextAgr").getText();i=false;}if(this.getSubheader()){if(i){a+=""+this.getSubheader();}else{a+="\n"+this.getSubheader();}i=false;}if(this.getValue()){if(i){a+=""+this.getValue();}else{a+="\n"+this.getValue();}}return a;};F.prototype.getTooltip_AsString=function(){var t=this.getTooltip();var s=this.getAltText();if(typeof t==="string"||t instanceof String){s=t.split("{AltText}").join(s).split("((AltText))").join(s);return s;}if(t){return t;}else{return"";}};F.prototype.setContentText=function(t){this._oContentText.setText(t);return this;};F.prototype.ontap=function(e){if(sap.ui.Device.browser.msie){this.$().focus();}this.firePress();};F.prototype.onkeydown=function(e){if(e.which===q.sap.KeyCodes.ENTER||e.which===q.sap.KeyCodes.SPACE){this.firePress();e.preventDefault();}};F.prototype.attachEvent=function(e,d,f,a){sap.ui.core.Control.prototype.attachEvent.call(this,e,d,f,a);if(this.hasListeners("press")){this.$().attr("tabindex",0).addClass("sapMPointer");}return this;};F.prototype.detachEvent=function(e,f,a){sap.ui.core.Control.prototype.detachEvent.call(this,e,f,a);if(!this.hasListeners("press")){this.$().removeAttr("tabindex").removeClass("sapMPointer");}return this;};return F;});
