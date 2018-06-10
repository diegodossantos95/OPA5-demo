/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define(['sap/ui/core/Control','sap/ushell/library'],function(C,l){"use strict";var A=C.extend("sap.ushell.ui.launchpad.AnchorItem",{metadata:{library:"sap.ushell",properties:{title:{type:"string",group:"Misc",defaultValue:null},selected:{type:"boolean",group:"Misc",defaultValue:false},groupId:{type:"string",group:"Misc",defaultValue:null},defaultGroup:{type:"boolean",group:"Misc",defaultValue:false},index:{type:"int",group:"Misc",defaultValue:null},visible:{type:"boolean",group:"Misc",defaultValue:null},isGroupVisible:{type:"boolean",group:"Misc",defaultValue:true},isGroupRendered:{type:"boolean",group:"Misc",defaultValue:false},isGroupDisabled:{type:"boolean",group:"Misc",defaultValue:false},locked:{type:"boolean",group:"Misc",defaultValue:false}},events:{press:{},afterRendering:{}}}});A.prototype.onAfterRendering=function(){this.fireAfterRendering();};A.prototype.setTitle=function(t){this.setProperty("title",t,true);this.$().find(".sapUshellAnchorItemInner").text(t);};A.prototype.setGroupId=function(v){this.setProperty("groupId",v,true);};A.prototype.setSelected=function(s){s=!!s;this.setProperty("selected",s,true);if(s){var j=jQuery(".sapUshellAnchorItemSelected");j.each(function(){jQuery(this).toggleClass("sapUshellAnchorItemSelected",false);jQuery(this).attr("aria-selected",false);});}this.$().attr("aria-selected",s);this.$().toggleClass("sapUshellAnchorItemSelected",s);};A.prototype.setIsGroupRendered=function(r){r=!!r;this.setProperty("isGroupRendered",r,true);if(r){this.removeStyleClass("sapUshellAnchorItemNotRendered");}else{this.addStyleClass("sapUshellAnchorItemNotRendered");}};A.prototype.setIsGroupVisible=function(v){v=!!v;this.setProperty("isGroupVisible",v,true);this.toggleStyleClass("sapUshellShellHidden",!v);};A.prototype.setIsGroupDisabled=function(v){v=!!v;this.setProperty('isGroupDisabled',v,true);this.$().find('.sapUshellAnchorItemInner').toggleClass('sapUshellAnchorItemDisabled',v);};A.prototype.onclick=function(){this.firePress();};return A;});
