/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','sap/m/ListItemBase','./library','sap/ui/core/HTML'],function(q,L,l,H){"use strict";var F=L.extend("sap.suite.ui.commons.FeedItemHeader",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{title:{type:"string",group:"Misc",defaultValue:null},image:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},link:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},source:{type:"string",group:"Misc",defaultValue:null},publicationDate:{type:"object",group:"Misc",defaultValue:null},description:{type:"string",group:"Misc",defaultValue:null}}}});F.prototype.exit=function(e){if(this._htmlControl){this._htmlControl.destroy();}L.prototype.exit.apply(this);};F.prototype.setImage=function(i){if(i){var v=q.sap.validateUrl(i);if(v){this.setProperty("image",i);}else{q.sap.log.error("Invalid Url:'"+i+"'. Property 'image' of FeedItemHeader not set");}}};F.prototype.setLink=function(s){if(s){var v=q.sap.validateUrl(s);if(v){this.setProperty("link",s);}else{q.sap.log.error("Invalid Url:'"+s+"'. Property 'link' of FeedItemHeader not set");}}};F.prototype.onclick=function(e){this.firePress({link:this.getLink()});e.preventDefault();};F.prototype._getHtmlControl=function(){if(!this._htmlControl){this._htmlControl=new H({id:this.getId()+"-feedItemHeaderDescription",sanitizeContent:true});}return this._htmlControl;};return F;});
