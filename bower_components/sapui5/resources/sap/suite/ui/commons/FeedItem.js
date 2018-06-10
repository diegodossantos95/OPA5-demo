/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Element'],function(q,l,E){"use strict";var F=E.extend("sap.suite.ui.commons.FeedItem",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{title:{type:"string",group:"Misc",defaultValue:null},image:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},link:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},source:{type:"string",group:"Misc",defaultValue:null},publicationDate:{type:"object",group:"Misc",defaultValue:null}}}});F.prototype.setImage=function(i){if(i){var v=q.sap.validateUrl(i);if(v){this.setProperty("image",i);}else{q.sap.log.error("Invalid Url:'"+i+"'. Property 'image' of FeedItem not set");}}};F.prototype.setLink=function(L){if(L){var v=q.sap.validateUrl(L);if(v){this.setProperty("link",L);}else{q.sap.log.error("Invalid Url:'"+L+"'. Property 'link' of FeedItem not set");}}};return F;});
