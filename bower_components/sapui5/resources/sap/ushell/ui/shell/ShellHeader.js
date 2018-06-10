/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define(['jquery.sap.global','sap/ushell/library','./ShellHeadItem','./ShellHeadUserItem','./ShellTitle','./ShellAppTitle'],function(q,S,a,b){"use strict";var s=0,n=0;var l;var L;var c;var d;var e=sap.ui.core.Control.extend("sap.ushell.ui.shell.ShellHeader",{MIN_PADDING_REM_VALUE_LARGE:3,MIN_PADDING_REM_VALUE_SMALL:1,MIN_PADDING_REM_VALUE_SMALL_FOR_SEARCH:0.5,MIN_REM_VALUE_FOR_SEARCH_CONTAINER_SIZE:9,APP_TITLE_MIN_VALUE:3,TITLE_MIN_VALUE:3,TITLE_MAX_WIDTH_VALUE:12,metadata:{properties:{logo:{type:"sap.ui.core.URI",defaultValue:""},showLogo:{type:"boolean",defaultValue:true},searchState:{type:"string",defaultValue:"COL"},ariaLabel:{type:"string",defaultValue:undefined},showSeparators:{type:"boolean",group:"Appearance",defaultValue:true}},aggregations:{headItems:{type:"sap.ushell.ui.shell.ShellHeadItem",multiple:true},headEndItems:{type:"sap.ushell.ui.shell.ShellHeadItem",multiple:true},search:{type:"sap.ui.core.Control",multiple:false},user:{type:"sap.ushell.ui.shell.ShellHeadUserItem",multiple:false},title:{type:"sap.ushell.ui.shell.ShellTitle",multiple:false},appTitle:{type:"sap.ushell.ui.shell.ShellAppTitle",multiple:false}},events:{searchSizeChanged:{}}},renderer:{render:function(r,h){var i=h.getId();r.write("<div");r.writeControlData(h);if(h.getAriaLabel()){r.writeAccessibilityState({label:h.getAriaLabel(),role:"banner"});}r.addClass("sapUshellShellHeader");r.writeClasses();r.write(">");r.write("<div id='",i,"-hdr-begin' class='sapUshellShellHeadBegin'>");this.renderHeaderItems(r,h,true);r.write("</div>");r.write("<div id='",i,"-hdr-center' class='sapUshellShellHeadCenter' >");this.renderTitle(r,h);if(h.getAppTitle()){this.renderAppTitle(r,h);}this.renderSearch(r,h);r.write("</div>");r.write("<div id='",i,"-hdr-end' class='sapUshellShellHeadEnd'>");this.renderHeaderItems(r,h,false);r.write("</div>");r.write("<div tabindex='0' id='sapUshellHeaderAccessibilityHelper'  style='position: absolute'></div>");r.write("</div>");},renderSearch:function(r,h){var o=h.getSearch();r.write("<div id='",h.getId(),"-hdr-search-container'");r.writeAttribute("class","sapUshellShellSearch");r.addStyle("max-width",s+"rem");r.writeStyles();r.write(">");if(o){r.renderControl(o);}r.write("</div>");},renderTitle:function(r,h){var C="sapUshellShellHeadTitle";if(h.getAppTitle()){C="sapUshellShellHeadSubtitle";}r.write("<div id='",h.getId(),"-hdr-title' class='"+C+"'");r.write(">");r.renderControl(h.getTitle());r.write("</div>");},renderAppTitle:function(r,h){r.write("<div id='",h.getId(),"-hdr-appTitle' class='sapUshellShellHeadTitle'>");r.renderControl(h.getAppTitle());r.write("</div>");},renderHeaderItems:function(r,h,f){r.write("<div class='sapUshellShellHeadContainer'>");var t,u,U,I=f?h.getHeadItems():h.getHeadEndItems(),i;for(i=0;i<I.length;i++){I[i]._headerHideSeperators=!h.getShowSeparators();r.renderControl(I[i]);}u=h.getUser();if(!f&&u){r.write("<a tabindex='0'");r.writeElementData(u);r.addClass("sapUshellShellHeadAction sapUshellShellHeadSeparator");r.writeClasses();t=u.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t);}if(u.getAriaLabel()){r.writeAccessibilityState({label:u.getAriaLabel(),haspopup:"true",role:"button"});}r.write("><span id='",u.getId(),"-img' class='sapUshellShellHeadActionImg'></span>");r.write("<span id='"+u.getId()+"-name' class='sapUshellShellHeadActionName'");r.write(">");U=u.getUsername()||"";r.writeEscaped(U);r.write("</span><span class='sapUshellShellHeadActionExp'></span></a>");}r.write("</div>");if(f){this._renderLogo(r,h);}},_renderLogo:function(r,h){var f=sap.ushell.resources.i18n.getText("SHELL_LOGO_TOOLTIP"),i=h._getLogo(),C="";if(!h.getShowLogo()){C+="sapUshellShellHideIco";}else{C+="sapUshellShellIco";}r.write("<div class='"+C+"'");r.write(">");r.write("<img id='",h.getId(),"-icon'");r.writeAttributeEscaped("alt",f);r.write("src='");r.writeEscaped(i);r.write("' style='",i?"":"display:none;","'></img>");r.write("</div>");}}});e.prototype.SearchState={COL:"COL",EXP:"EXP",EXP_S:"EXP_S"};e.prototype.init=function(){var t=this;this._rtl=sap.ui.getCore().getConfiguration().getRTL();this._handleMediaChange=function(p){if(!t.getDomRef()){return;}if(t.getSearchState()!=this.SearchState.COL){this._setMaxWidthForAppTitleAndTitle();t._handleSearchSizeChanged();return;}t._refresh();};sap.ui.Device.media.attachHandler(this._handleMediaChange,this,sap.ui.Device.media.RANGESETS.SAP_STANDARD);this._handleResizeChange=function(){if(!t.getDomRef()){return;}var u=this.getUser();if(t.getUser()){u._checkAndAdaptWidth(!t.$("hdr-search").hasClass("sapUshellShellHidden")&&!!t.getSearch());}if(t.getSearchState()!=this.SearchState.COL){this._setMaxWidthForAppTitleAndTitle();t._handleSearchSizeChanged();return;}t._refresh();};sap.ui.Device.resize.attachHandler(this._handleResizeChange,this);this.data("sap-ui-fastnavgroup","true",true);this.oTitle=null;};e.prototype.exit=function(){sap.ui.Device.media.detachHandler(this._handleMediaChange,this,sap.ui.Device.media.RANGESETS.SAP_STANDARD);delete this._handleMediaChange;sap.ui.Device.resize.detachHandler(this._handleResizeChange,this);delete this._handleResizeChange;if(this.oTitle){this.oTitle.destroy();}};e.prototype.onAfterRendering=function(){var t=this;this._refresh();this.$("icon").one('load',function(){t._refresh();});this.$("hdr-center").toggleClass("sapUshellShellAnim",this.getParent().getShowAnimation());var o=this.$("hdr-search-container");if(s!=n){if(this.getSearchState()==this.SearchState.COL){o.one('transitionend',function(){q(this).addClass("sapUshellShellSearchHidden");});}this._setSearchContainerMaxSize(n,false);var f={remSize:this._convertPxToRem(this.getSearchContainerRect(n).width),isFullWidth:this.isPhoneState()};this.fireSearchSizeChanged(f);}else if(this.getSearchState()==this.SearchState.COL){q(o).addClass("sapUshellShellSearchHidden");}};e.prototype.onThemeChanged=function(){if(this.getDomRef()){this.invalidate();}};e.prototype._getLogo=function(){var i=this.getLogo();if(!i){q.sap.require("sap.ui.core.theming.Parameters");i=sap.ui.core.theming.Parameters._getThemeImage(null,true);}return i;};e.prototype._handleSearchSizeChanged=function(){var f;if(this.getSearchState()==this.SearchState.COL){return;}else if(this.getSearchState()==this.SearchState.EXP){f=s;this._handleExpSearchState(f);}else if(this.getSearchState()==this.SearchState.EXP_S){f=this._handleExpSSearchState();this._setSearchContainerMaxSize(f);}var g={remSize:this._convertPxToRem(this.getSearchContainerRect(f).width),isFullWidth:this.isPhoneState()};this.fireSearchSizeChanged(g);};e.prototype._refresh=function(){var u=this.getUser();if(u){u._refreshImage();u._checkAndAdaptWidth(!!this.getSearch());}if(!this.hasStyleClass("sapUshellShellHideLogo")){this._saveLogoWidth();}this._setMaxWidthForAppTitleAndTitle();if(this.getSearchState()!=this.SearchState.COL){this._adjustHeaderWithSearch();}this._saveSearchPhoneStateThreshold();};e.prototype._saveLogoWidth=function(){var o=this.$("hdr-begin").find(".sapUshellShellIco");if(o){L=parseInt(o.css("padding-left"),10);c=parseInt(o.css("padding-right"),10);l=this.$("icon")[0].getBoundingClientRect().width;}};e.prototype._convertPxToRem=function(p){var r=parseFloat(sap.ui.core.theming.Parameters.get("sapUiFontSize"));return p/r;};e.prototype._convertRemToPx=function(r){var f=parseFloat(sap.ui.core.theming.Parameters.get("sapUiFontSize"));return r*f;};e.prototype._setMaxWidthForAppTitleAndTitle=function(){this._setMaxWidthForAppTitle();if(this.isLSize()){this._setMaxWidthForTitle();}else{this._setAppTitleFontSize();}};e.prototype._setMaxWidthForAppTitle=function(){var j=this.$("hdr-appTitle");var f=this.$("hdr-appTitle").find(".sapUshellHeadTitle");if(!j.length){return;}f.removeClass('sapUshellHeadTitleWithSmallerFontSize');j.css({'max-width':'none'});var C=this._calcCenterWidth();var t=0;if(this.isLSize()){var g=this.$("hdr-title");if(g.length){t=g[0].getBoundingClientRect().width;}}var p=this.isSSize()?this.MIN_PADDING_REM_VALUE_SMALL:this.MIN_PADDING_REM_VALUE_LARGE;var w=this._convertPxToRem(C-t)-2*p;var h=j.find('.sapUshellShellHeadAction');var A=h.length?this.APP_TITLE_MIN_VALUE+1.5:this.APP_TITLE_MIN_VALUE;if(w<A){w=A;}j.css({'max-width':w+"rem"});};e.prototype._calcCenterWidth=function(){var f=this.$("hdr-appTitle")[0].getBoundingClientRect();var h=this.$("hdr-begin")[0].getBoundingClientRect();var g=this.$("hdr-end")[0].getBoundingClientRect();var C;if(this._isOverlapping(f,g)){var i=sap.ui.getCore().byId("mainShell");var p={};p.name=sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name;p.showOverFlowBtn=true;if(i){i.oController.handleEndItemsOverflow(p);}g=this.$("hdr-end")[0].getBoundingClientRect();if(this._isOverlapping(f,g)){var j=h.width;var k=g.width;var m=this.$()[0].getBoundingClientRect().width;C=m-2*Math.max(j,k);}}else{if(this._isOverlapping(h,f)){var j=h.width;var k=g.width;var m=this.$()[0].getBoundingClientRect().width;C=m-2*Math.max(j,k);}else{var o=this.$("hdr-center");C=o[0].getBoundingClientRect().width;}}return C;};e.prototype._setMaxWidthForTitle=function(){var j=this.$("hdr-title");if(!j.length){return;}j.css({'max-width':this.TITLE_MAX_WIDTH_VALUE+"rem",'opacity':1});var f=this.$("hdr-appTitle");if(!f||!f[0]){return;}var r=this._isOverlapping(j[0].getBoundingClientRect(),f[0].getBoundingClientRect(),this.MIN_PADDING_REM_VALUE_LARGE,false);if(r){var t=j[0].getBoundingClientRect().width;var T=this._convertPxToRem(t-r);if(T<this.TITLE_MIN_VALUE){j.css({'opacity':0});}else{j.css({'max-width':T+"rem"});}}};e.prototype._setAppTitleFontSize=function(){var A=this.$("hdr-appTitle").find(".sapUshellHeadTitle");if(A&&A[0]){var i=A[0].scrollWidth;var C=A[0].clientWidth;if(i>C){A.addClass('sapUshellHeadTitleWithSmallerFontSize');}}};e.prototype._adjustHeaderWithSearch=function(f){var j=this.$("hdr-appTitle");if(!j.length||j.css('opacity')=="0"||j.css('display')=="none"){return;}var g=j[0].getBoundingClientRect();var h;if(f){h=this.getSearchContainerRect(f);}else{var i=this.$("hdr-search-container");h=this.getSearchContainerRect(parseFloat(i.get(0).style.maxWidth));}var o=this._isOverlapping(g,h,this.MIN_PADDING_REM_VALUE_SMALL_FOR_SEARCH,true);if(!o){return;}else if(o){var A=g.width;j.css({'max-width':this._convertPxToRem(A-o)+"rem"});}};e.prototype.setAppTitle=function(A){A.attachTextChanged(this._handleAppTitleChange,this);this.setAggregation("appTitle",A,true);};e.prototype.removeAppTitle=function(A){A.detachedTextChanged(this._handleAppTitleChange);this.removeAggregation("appTitle");};e.prototype._handleAppTitleChange=function(){if(!this.getDomRef()){return;}if(this.getSearchState()!=this.SearchState.COL){this._setMaxWidthForAppTitleAndTitle();this._handleSearchSizeChanged();}};e.prototype.setTitleControl=function(t,i){this.oTitle=this.oTitle||sap.ui.getCore().byId("shellTitle");if(this.oTitle){this.oTitle.destroy();}this.oTitle=new sap.ushell.ui.shell.ShellTitle("shellTitle",{text:t,icon:sap.ui.core.IconPool.getIconURI("overflow")});this.oTitle.setInnerControl(i);this.setTitle(this.oTitle);};e.prototype.removeHeadItem=function(i){if(typeof i==='number'){i=this.getHeadItems()[i];}this.removeAggregation('headItems',i);};e.prototype.addHeadItem=function(i){this.addAggregation('headItems',i);};e.prototype.isPhoneState=function(){var f=sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name;var E=true;var h=this.$().width();if(h<=d){E=false;}return(sap.ui.Device.system.phone||f=="Phone"||!E);};e.prototype.isLSize=function(){var f=sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name;return(f=="Desktop");};e.prototype.isSSize=function(){var f=sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name;return(sap.ui.Device.system.phone||f=="Phone");};e.prototype.getSearchContainerRect=function(m){var j=q("<div> </div>").css("max-width",m+"rem");var f=q("<div></div>").append(j).insertAfter(this.$("hdr-search-container"));j.addClass('sapUshellShellSearch');var t=j[0].getBoundingClientRect();f.remove();return t;};e.prototype.setSearchState=function(f,m,w){if(typeof f!=="string"||!this.SearchState.hasOwnProperty(f)){return;}this.requiredRemSize=m;this.setProperty('searchState',f,false);var g;if(f==this.SearchState.COL){g=this._handleColSearchState(true);}else if(f==this.SearchState.EXP){if(w==undefined||w==null){this.bWithOverlay=true;}else{this.bWithOverlay=w;}g=this._handleExpSearchState(m,true);}else if(f==this.SearchState.EXP_S){g=this._handleExpSSearchState(m,true);}this._setSearchContainerMaxSize(g,true);};e.prototype.getSearchAvailableSize=function(){var f=this._convertPxToRem(this._getSizeToAppTitle());var g=f-this._getMinPaddingRemSize();return(g>=0?g:0);};e.prototype._getSizeToAppTitle=function(){var C=this.$("hdr-center");var o=C[0];var A=this.$("hdr-appTitle").find(".sapUshellAppTitle");var f=A[0];var m;if(this._rtl){m=f?f.getBoundingClientRect().left-o.getBoundingClientRect().left:this._getSizeToTitle();}else{m=f?o.getBoundingClientRect().right-f.getBoundingClientRect().right:this._getSizeToTitle();}return m;};e.prototype._getSizeToTitle=function(){var C=this.$("hdr-center");var o=C[0];var t=this.$("hdr-title").find(".sapUshellHeadTitle");var T=t[0];var m;if(this._rtl){m=T?T.getBoundingClientRect().left-o.getBoundingClientRect().left:this._getSizeToLogo();}else{m=T?o.getBoundingClientRect().right-T.getBoundingClientRect().right:this._getSizeToLogo();}return m;};e.prototype._getSizeToLogo=function(){var C=this.$("hdr-center");var o=C[0];var f=o.getBoundingClientRect().width+this._getSearchButtonWidth();var g=this.$("hdr-begin").find(".sapUshellShellIco");var h=g[0];var i=false;if(this.hasStyleClass("sapUshellShellHideLogo")){i=true;}if(h&&i){var j=this._rtl?c:L;return f-l-j;}else{var j=this._rtl?L:c;return f+j;}};e.prototype._getMaxSize=function(){var C=this.$("hdr-center");var o=C[0];var f=this.$("hdr-begin").find(".sapUshellShellIco");var g=f[0];var h=false;if(this.hasStyleClass("sapUshellShellHideLogo")){h=true;}var i;if(g&&!h){var j=this._rtl?L:c;i=l+j;}else{i=0;}var m=o.getBoundingClientRect().width+this._getSearchButtonWidth()+i;return m;};e.prototype._getSearchButtonWidth=function(){var o=this.getHeadEndItems()[0];if(o&&o.getVisible()){var f=o.getDomRef();var i=f.getBoundingClientRect().width;return i;}return 0;};e.prototype._handleColSearchState=function(f){var g=this.getParent();if(g){g.removeStyleClass("sapUshellShellShowSearchOverlay");}this.removeStyleClass("sapUshellShellHideLogo");this.removeStyleClass("sapUshellShellHideSubtitle");this.removeStyleClass("sapUshellShellHideAppTitle");if(this.isPhoneState()){return this._handleColSearchStatePhone();}return 0;};e.prototype._handleExpSearchState=function(r,f){if(this.isPhoneState()){this._handleExpAndExpSSearchStatePhone();return r;}else{return this._handleExpSearchStateLargeScreen(r,f);}};e.prototype._handleExpSearchStateLargeScreen=function(r,f){var g;this.removeStyleClass("sapUshellShellHideForPhone");var h=this.getParent();if(h&&this.bWithOverlay){h.addStyleClass("sapUshellShellShowSearchOverlay");}var m=this._convertPxToRem(this._getMaxSize());var M=this._convertPxToRem(this._getSizeToTitle());var i=this._convertPxToRem(this._getSizeToAppTitle());var j=this._convertPxToRem(this._getSizeToLogo());if(r>m){this.addStyleClass("sapUshellShellHideLogo");this.addStyleClass("sapUshellShellHideSubtitle");this.addStyleClass("sapUshellShellHideAppTitle");g=m;}else if(r>j-this._getMinPaddingRemSize()){this.addStyleClass("sapUshellShellHideLogo");this.addStyleClass("sapUshellShellHideSubtitle");this.addStyleClass("sapUshellShellHideAppTitle");g=r;}else if(r>M-this._getMinPaddingRemSize()){this.addStyleClass("sapUshellShellHideSubtitle");this.addStyleClass("sapUshellShellHideAppTitle");this.removeStyleClass("sapUshellShellHideLogo");g=r;}else if(r>i-this._getMinPaddingRemSize()){this.addStyleClass("sapUshellShellHideAppTitle");this.removeStyleClass("sapUshellShellHideSubtitle");this.removeStyleClass("sapUshellShellHideLogo");g=r;}else{this.removeStyleClass("sapUshellShellHideAppTitle");this.removeStyleClass("sapUshellShellHideSubtitle");this.removeStyleClass("sapUshellShellHideLogo");g=r;}return g;};e.prototype._handleExpSSearchState=function(r,f){var g=this.getParent();if(g){g.removeStyleClass("sapUshellShellShowSearchOverlay");}if(this.isPhoneState()){this._handleExpAndExpSSearchStatePhone();return r;}else{var h=this._handleExpSSearchStateLargeScreen(r,f);if(h>this.requiredRemSize){h=this.requiredRemSize;}return h;}};e.prototype._handleExpSSearchStateLargeScreen=function(r,f){var g;this.removeStyleClass("sapUshellShellHideForPhone");var m=this._convertPxToRem(this._getSizeToAppTitle());if(m-this._getMinPaddingRemSize()<this.MIN_REM_VALUE_FOR_SEARCH_CONTAINER_SIZE){m=this.MIN_REM_VALUE_FOR_SEARCH_CONTAINER_SIZE+this._getMinPaddingRemSize();}if(!r){r=m;}if(r>m-this._getMinPaddingRemSize()){g=m-this._getMinPaddingRemSize();}else{g=r;}this.removeStyleClass("sapUshellShellHideLogo");this.removeStyleClass("sapUshellShellHideSubtitle");this.removeStyleClass("sapUshellShellHideAppTitle");return g;};e.prototype._handleExpAndExpSSearchStatePhone=function(){this.addStyleClass("sapUshellShellHideForPhone");var f=this.getParent();if(f&&this.getSearchState()==this.SearchState.EXP&&this.bWithOverlay){f.addStyleClass("sapUshellShellShowSearchOverlay");}};e.prototype._handleColSearchStatePhone=function(){this.removeStyleClass("sapUshellShellHideForPhone");return 0;};e.prototype._setSearchContainerMaxSize=function(f,g){if(!g){var o=this.$("hdr-search-container");o.css("max-width",f+"rem");s=n=f;}else{n=f;}this._adjustHeaderWithSearch(f);};e.prototype._getMinPaddingRemSize=function(){if(this._convertPxToRem(this._getSizeToAppTitle())<this.MIN_REM_VALUE_FOR_SEARCH_CONTAINER_SIZE){return this.MIN_PADDING_REM_VALUE_SMALL_FOR_SEARCH;}else{return this.MIN_PADDING_REM_VALUE_LARGE;}};e.prototype._saveSearchPhoneStateThreshold=function(){if(this.hasStyleClass("sapUshellShellHideForPhone")){return;}var i=this.getSearchAvailableSize();if(i==0){i=-this.MIN_PADDING_REM_VALUE_SMALL_FOR_SEARCH;}var m=this._maxRemToRemoveFromAppTitle();if(i+m<this.MIN_REM_VALUE_FOR_SEARCH_CONTAINER_SIZE){var h=this.$().width();d=h+this._convertRemToPx(this.MIN_REM_VALUE_FOR_SEARCH_CONTAINER_SIZE-i-m);}return d;};e.prototype._maxRemToRemoveFromAppTitle=function(){var j=this.$("hdr-appTitle");var f=j.find(".sapUshellHeadTitle");if(!j.length||!f.length){return 0;}var A=this._convertPxToRem(f[0].getBoundingClientRect().width);var m=(A-this.APP_TITLE_MIN_VALUE)>0?(A-this.APP_TITLE_MIN_VALUE):0;return m;};e.prototype._isOverlapping=function(f,g,p,P){if(!p){p=0;}if(this._rtl){var j=f.left;var h=g.right;if(P){j=j-this._convertRemToPx(p);}else{h=h+this._convertRemToPx(p);}if(j<h){return h-j;}}else{var i=f.right;var k=g.left;if(P){i=i+this._convertRemToPx(p);}else{k=k-this._convertRemToPx(p);}if(k<i){return i-k;}}return 0;};return e;},true);
