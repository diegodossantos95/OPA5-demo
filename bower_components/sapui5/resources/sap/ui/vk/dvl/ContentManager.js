/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","../DvlException","../Messages","../ContentManager"],function(q,D,M,C){"use strict";var a=C.extend("sap.ui.vk.dvl.ContentManager",{metadata:{library:"sap.ui.vk",publicMethods:["collectGarbage","destroyContent","loadContent"]}});var b=a.getMetadata().getParent().getClass().prototype;a.prototype.init=function(){if(b.init){b.init.call(this);}this._handleDownloadingProgressProxy=this._handleDownloadingProgress.bind(this);this._graphicsCore=null;this._failedSources=[];};a.prototype.exit=function(){if(this._graphicsCore){this._graphicsCore.destroy();this._graphicsCore=null;}if(b.exit){b.exit.call(this);}};var r={},w={antialias:true,alpha:true,premultipliedAlpha:true},d=null;a.getRuntimeSettings=function(){return r;};a.setRuntimeSettings=function(s){r=s;};a.getWebGLContextAttributes=function(){return w;};a.setWebGLContextAttributes=function(c){w=q.extend(w,c);};a.getDecryptionHandler=function(){return d;};a.setDecryptionHandler=function(h){d=h;};a.prototype._getGraphicsCore=function(){var t=this;return new Promise(function(c,e){if(t._graphicsCore){c(t._graphicsCore);}else{sap.ui.require(["sap/ui/vk/dvl/GraphicsCore"],function(G){t._graphicsCore=new G(r,w);t._graphicsCore.attachSceneLoadingStarted(t._handleDvlSceneLoadingStarted,t);t._graphicsCore.attachSceneLoadingFinished(t._handleDvlSceneLoadingFinished,t);t._graphicsCore.attachSceneLoadingProgress(t._handleDvlSceneLoadingProgress,t);c(t._graphicsCore);});}});};a.prototype._handleDownloadingProgress=function(e){var s=e.getParameter("source"),l=e.getParameter("loaded"),t=e.getParameter("total"),v=t?l/t*50:0;this.fireContentChangesProgress({phase:"downloading",source:s,percentage:v});};a.prototype._handleDvlSceneLoadingProgress=function(e){this.fireContentChangesProgress({phase:"building",source:e.getParameter("source"),percentage:50+e.getParameter("percentage")*50});};a.prototype._handleDvlSceneLoadingStarted=function(e){};a.prototype._handleDvlSceneLoadingFinished=function(e){};a.prototype.loadContent=function(c,e){this.fireContentChangesStarted();var t=this;this._getGraphicsCore().then(function(g){g.setDecryptionHandler(d);g.loadContentResourcesAsync(e,function(s){var f=[];if(s){s.forEach(function(i){f.push({error:i,errorMessage:"Failed to download source '"+i.source+"'."});});}var l=c?c.scene:undefined;g.updateSceneTreeAsync(l,e).then(function(h){var i={content:h.scene};if(h.failureReason){f=f.concat(h.failureReason);}if(f.length>0){i.failureReason=f;}t.fireContentChangesFinished(i);}).catch(function(h){f.push(h);t.fireContentChangesFinished({content:null,failureReason:f});});},t._handleDownloadingProgressProxy);},function(f){t.fireContentChangesFinished({content:null,failureReason:{error:f,errorMessage:"Failed to create DVL graphics core object."}});});return this;};a.prototype.destroyContent=function(c){this._graphicsCore.destroyScene(c);return this;};a.prototype.collectGarbage=function(){this._graphicsCore.collectGarbage();return this;};return a;});