(function(){"use strict";jQuery.sap.declare("sap.ovp.ui.SmartphoneHeaderToggle");sap.ovp.ui.SmartphoneHeaderToggle={threshold:10,headerVisible:true,startY:undefined,app:undefined,jqView:undefined,startHandler:function(e){if(this.app.getGlobalFilter()&&this.app.getGlobalFilter().hasOwnProperty("getVisible")&&this.app.getGlobalFilter().getVisible()){return;}this.startY=e.touches[0].pageY;},resizeHandler:function(){if(!this.headerVisible){this.animateHeader.call(this,this.headerVisible);}},animateHeader:function(s){var j=this.jqView.find('.ovpApplication > .sapUiFixFlexFixed > .sapMVBox');var a=this.jqView.find('.ovpApplication > .sapUiFixFlexFlexible');var b=a.children();var t;if(s){t="translateY(0px)";j.add(a).css({"transform":t,"-webkit-transform":t});a.one('transitionend',function(e){if(this.headerVisible){b.css({bottom:"0px"});}}.bind(this));}else{var h=this.view.byId('ovpDynamicPageHeader');if(h){var c=h.$().height();b.css({bottom:"-"+c+"px"});t="translateY(-"+c+"px)";a.add(j).css({"transform":t,"-webkit-transform":t});}}},moveHandler:function(e){var m=e.touches[0].pageY;if(typeof this.startY==="undefined"){if(this.app.getGlobalFilter()&&this.app.getGlobalFilter().hasOwnProperty("getVisible")&&this.app.getGlobalFilter().getVisible()){return;}this.startY=m;}if(Math.abs(this.startY-m)<this.threshold){return;}if(this.startY>m&&this.headerVisible){this.headerVisible=false;this.startY=m;this.animateHeader.call(this,this.headerVisible);}if(this.startY<m&&!this.headerVisible){this.headerVisible=true;this.startY=m;this.animateHeader.call(this,this.headerVisible);}},endHandler:function(){this.startY=undefined;return;},enable:function(a){this.app=a;this.view=this.app.getView();this.jqView=this.view.$();this.jqView.on('touchstart.headerHiding',this.startHandler.bind(this));this.jqView.on('touchmove.headerHiding',this.moveHandler.bind(this));this.jqView.on('touchend.headerHiding touchcancel.headerHiding touchleave.headerHiding',this.endHandler.bind(this));jQuery(window).on("resize.headerHiding",this.resizeHandler.bind(this));},disable:function(){this.jqView.off('touchstart.headerHiding touchmove.headerHiding touchend.headerHiding touchcancel.headerHiding touchleave.headerHiding');jQuery(window).off("resize.headerHiding");}};}());
