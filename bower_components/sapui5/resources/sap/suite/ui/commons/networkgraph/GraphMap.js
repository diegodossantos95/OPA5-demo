sap.ui.define(["jquery.sap.global","./SvgBase","sap/ui/core/ResizeHandler"],function(q,S,R){var N=4;var r=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");var G=S.extend("sap.suite.ui.commons.networkgraph.GraphMap",{metadata:{library:"sap.suite.ui.commons",properties:{directRenderNodeLimit:{type:"int",group:"Behavior",defaultValue:250},title:{type:"string",group:"Misc",defaultValue:""}},associations:{graph:{type:"sap.suite.ui.commons.networkgraph.Graph",multiple:false,singularName:"graph"}},events:{mapReady:{}}}});G.prototype.init=function(){this._oResizeListener=null;this.setBusyIndicatorDelay(0);};G.prototype.onAfterRendering=function(){this.setBusy(true);};G.prototype._renderMap=function(){var v,g,i,s,$,a,b,o=this.getGraph(),z=o._fZoomRatio,n=o.getNodes().length,h="",f=function(I){I.forEach(function(c){h+=c._render({mapRender:true});});return h;};if(!o._iWidth||!o._iHeight){return;}if(n===0){return;}v=o.$("networkGraphSvg").attr("viewBox");if(!v){v="0 0 "+o._iWidth+" "+o._iHeight;}s="<svg class=\"sapSuiteUiCommonsNetworkGraphSvg\" width=\"100%\" height=\"100%\" viewBox=\""+v+"\" "+"id=\""+this._getDomId("svg")+"\"";if(o._bIsRtl){s+=" direction =\"rtl\"";}s+=" >";if(n<this.getDirectRenderNodeLimit()){h=this._renderControl("use",{"xlink:href":"#"+o._getDomId("svgbody")});}else{f(o.getGroups());f(o.getLines());f(o.getNodes());}h+=this._renderControl("rect",{x:0,y:0,width:o._iWidth,height:o._iHeight,"class":"sapSuiteUiCommonsNetworkGraphMapBoundary","pointer-events":"fill"});h+=this._renderControl("rect",{x:N/2,y:N/2,width:Math.min((o.$scroller.width()-N/2)/z,(o.$svg.width()-N/2)/z),height:Math.min((o.$scroller.height()-N/2)/z,(o.$svg.height()-N/2)/z),"class":"sapSuiteUiCommonsNetworkGraphMapNavigator",id:this._getDomId("mapNavigator")});s+=h+"</svg>";this.$().find(".sapSuiteUiCommonsNetworkGraphMapContent").html(s);$=this.$("svg");g=o._iWidth;i=o._iHeight;a=Math.max(g/$.width(),i/$.height());b=Math.ceil(a/5);$.css("stroke-width",b);this.$("mapNavigator").css("stroke-width",Math.max(3,2*b));this._setupEvents();this.setBusy(false);this.fireMapReady();};G.prototype._correctMapNavigator=function(){var $=this.$("mapNavigator"),w=parseFloat($.attr("width")),h=parseFloat($.attr("height")),x=parseFloat($.attr("x")),y=parseFloat($.attr("y")),g=this.getGraph(),i=g._iWidth,a=g._iHeight;if(w+x>i){$.attr("width",i-x);}if(h+y>a){$.attr("height",a-y);}};G.prototype._resize=function(){var g=this.getGraph(),$=g.$scroller,a=this.$("mapNavigator");a.attr("x",Math.max(N/2,$[0].scrollLeft/g._fZoomRatio));a.attr("y",Math.max(N/2,$[0].scrollTop/g._fZoomRatio));a.attr("width",$.width()/g._fZoomRatio);a.attr("height",$.height()/g._fZoomRatio);this._correctMapNavigator();};G.prototype._setupEvents=function(){var d=false,g=this.getGraph(),$=this.$("svg"),a=g.$scroller;var s=function(o){var b=g.$svg,i=Math.max(b.width()/$.width(),b.height()/$.height()),c=$.find(".sapSuiteUiCommonsNetworkGraphMapBoundary"),f=a[0],h=c.offset().left,j=c.offset().top;f.scrollLeft=(o.pageX-h)*i-(a.width()/2);f.scrollTop=(o.pageY-j)*i-(a.height()/2);};var e=function(){$.removeClass("sapSuiteUiCommonsNetworkGraphPanning");d=false;};a.scroll(function(){var b=this.$("mapNavigator");b.attr("x",Math.max(N/2,a[0].scrollLeft/g._fZoomRatio));b.attr("y",Math.max(N/2,a[0].scrollTop/g._fZoomRatio));this._correctMapNavigator();}.bind(this));$.off();$.mousedown(function(E){d=true;s(E);E.preventDefault();});$.mousemove(function(E){if(d){if(!$.hasClass("sapSuiteUiCommonsNetworkGraphPanning")){$.addClass("sapSuiteUiCommonsNetworkGraphPanning");}s(E);}});$.mouseleave(function(E){e();});$.mouseup(function(E){e();});};G.prototype._onBeforeDataProcess=function(){if(this.getDomRef("svg")){this.$("svg").html("");this.setBusy(true);}};G.prototype._onGraphReady=function(){setTimeout(this._renderMap.bind(this),0);if(this._oResizeListener){R.deregister(this._oResizeListener);}this._oResizeListener=R.register(this.getGraph().$("wrapper")[0],q.proxy(this._resize,this));};G.prototype._removeListeners=function(){var g=this.getGraph();if(g){g.detachBeforeLayouting(this._onBeforeDataProcess,this);g.detachGraphReady(this._onGraphReady,this);g.detachZoomChanged(this._resize,this);}};G.prototype.destroy=function(){this._removeListeners();S.prototype.destroy.apply(this,arguments);};G.prototype.exit=function(){if(this._oResizeListener){R.deregister(this._oResizeListener);this._oResizeListener=null;}};G.prototype.getTitle=function(){var t=this.getProperty("title");return t?t:r.getText("NETWORK_GRAPH_MAP_TITLE");};G.prototype.getGraph=function(){var i=this.getAssociation("graph");return i?sap.ui.getCore().byId(i):null||null;};G.prototype.setGraph=function(g){this._removeListeners();this.setAssociation("graph",g);var o=this.getGraph();if(o){o.attachBeforeLayouting(this._onBeforeDataProcess,this);o.attachGraphReady(this._onGraphReady,this);o.attachZoomChanged(this._resize,this);if(o._isLayedOut()){this._onGraphReady();}}return this;};return G;});
