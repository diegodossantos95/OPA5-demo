/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","../Scene","./NodeHierarchy"],function(q,S,N){"use strict";var a=S.extend("sap.ui.vk.threejs.Scene",{metadata:{publicMethods:["getDefaultNodeHierarchy","getId","getSceneRef"]},constructor:function(s){S.call(this);this._id=q.sap.uid();this._scene=s;this._state=null;this._defaultNodeHierarchy=null;}});a.prototype.destroy=function(){if(this._defaultNodeHierarchy){this._defaultNodeHierarchy.destroy();this._defaultNodeHierarchy=null;}this._state=null;this._scene=null;S.prototype.destroy.call(this);};a.prototype.getId=function(){return this._id;};a.prototype.getDefaultNodeHierarchy=function(){if(!this._defaultNodeHierarchy){this._defaultNodeHierarchy=new N(this);}return this._defaultNodeHierarchy;};a.prototype.getSceneRef=function(){return this._scene;};a.prototype._setState=function(s){this._state=s;};return a;});
