/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Element","sap/ui/vk/ContentConnector","sap/ui/vk/threejs/Viewport","sap/ui/vk/threejs/ViewStateManager","sap/ui/vk/ContentResource","sap/ui/vk/TransformationMatrix","./library"],function(q,E,C,V,c,f,T,l){"use strict";var h=q.sap.log,B=THREE.Box3,j=THREE.Vector2,k=THREE.Vector3,F=THREE.Face3,M=THREE.Matrix4,Q=THREE.Quaternion,m=THREE.Math.degToRad;var o;var A=E.extend("sap.ui.vbm.Adapter3D",{metadata:{library:"sap.ui.vbm",publicMethods:["load"],associations:{viewport:{type:"sap.ui.vk.threejs.Viewport"}},events:{submit:{parameters:{data:{type:"string"}}}}}});var p=A.getMetadata().getParent().getClass().prototype;A.prototype.init=function(){if(p.init){p.init.call(this);}this._contentConnector=new C();this.addDependent(this._contentConnector);this._contentConnector.attachContentReplaced(function(e){var a=e.getParameter("newContent"),b=a&&a.getSceneRef();if(b){b.rotation.x=m(90);}},this);this._viewStateManager=new c({contentConnector:this._contentConnector});this.addDependent(this._viewStateManager);this._viewport=null;this._resourceFiles={};this._dataTypes={};this._contentResourceTemplates={};this._data=[];};A.prototype.exit=function(){this._contentConnector=null;this._viewStateManager=null;this._disconnectViewport();this._resourceFiles=null;this._dataTypes=null;this._contentResourceTemplates=null;this._data=null;if(p.exit){p.exit.call(this);}};A.prototype.setViewport=function(a){this.setAssociation("viewport",a,true);this._configureViewport();return this;};A.prototype._configureViewport=function(){var a=sap.ui.getCore().byId(this.getViewport())||null;if(a!==this._viewport){this._disconnectViewport();this._viewport=a;this._connectViewport();}return this;};A.prototype._connectViewport=function(){if(this._viewport){this._viewport.setContentConnector(this._contentConnector);this._viewport.setViewStateManager(this._viewStateManager);this._viewport.attachNodesPicked(this._handleNodesPicked,this);}return this;};A.prototype._disconnectViewport=function(){if(this._viewport){if(!this._viewport.bIsDestroyed){this._viewport.detachNodesPicked(this._handleNodesPicked,this);this._viewport.setViewStateManager(null);this._viewport.setContentConnector(null);}this._viewport=null;}return this;};A.prototype._handleNodesPicked=function(e){var b=[];this._viewStateManager.enumerateSelection(Array.prototype.push.bind(b));if(b.length>0){this._viewStateManager.setSelectionState(b,false);}var g=e.getParameters();if(g.picked.length>0){this._viewStateManager.setSelectionState(g.picked,true);var i=sap.ui.vbm.findInArray(this._data,function(d){return d.meshUUID===g.picked[0].uuid;});var n,r;for(var z in this._groupedActions){if(this._groupedActions.hasOwnProperty(z)){if(q.sap.startsWith(i.resourceType,z)){r=z;n=this._groupedActions[z];break;}}}if(n){var D=g.isDoubleClick?"DoubleClick":"Click",G=sap.ui.vbm.findInArray(n,function(a){return a.refEvent===D;});if(G){var H={"version":"2.0","xmlns:VB":"VB","Action":{"name":G.name,"object":r,"instance":i.K,"Params":{"Param":[{"name":"x","#":g.x},{"name":"y","#":g.y}]}}};this.fireSubmit({data:JSON.stringify(H)});}}}};A.prototype._processDataTypes=function(d){var b=function(g){var i={};g.forEach(function(a){i[a.name]=a.alias;});return i;};var e=function(D){if("A"in D){this._dataTypes[D.name]=b([].concat(D.A));}else if("N"in D){var a={};[].concat(D.N).forEach(function(n){if("A"in n){a[n.name]=b([].concat(n.A));}});this._dataTypes[D.name]=a;}};d.forEach(e,this);return this;};A.prototype._processData=function(D){var g=function(r){var a,b=r.C.slice(r.C.indexOf("(")+1,r.C.indexOf(")")).split(",").map(function(i){return parseInt(i,10);}),d=r.S.split(";").map(parseFloat),e=r.Y.split(";").map(parseFloat),n=r.A.split(";").map(parseFloat),z=sap.ui.vk.TransformationMatrix.convertTo4x3(new M().compose(new k(-n[0],n[1],n[2]),new Q().setFromEuler(new THREE.Euler(m(e[0]),m(-e[1]),m(-e[2]),'XYZ')),new k(d[0],d[1],d[2])).elements);if(this._contentResourceTemplates.hasOwnProperty(r.resourceType)&&this._contentResourceTemplates[r.resourceType].contentResource){var P=this._contentResourceTemplates[r.resourceType].contentResource;a=new f({source:{content:this._resourceFiles[P.source],color:new THREE.Color(b[1]/255,b[2]/255,b[3]/255),opacity:b[0]/255},localMatrix:z});}else{var G=new THREE.MeshPhongMaterial(),H=o();G.color=new THREE.Color(b[1]/255,b[2]/255,b[3]/255);G.opacity=b[0]/255;if(r.I){G.map=new THREE.TextureLoader().load(this._resourceFiles[r.I]);G.map.flipY=false;}var I=new THREE.Mesh(H,G);I.applyMatrix(new M().makeScale(1,-1,-1));a=new f({source:I,localMatrix:z});}return a;};if(!Array.isArray(D)&&!("name"in D)&&!("type"in D)){this._data=[];}else{this._data=this._data.concat([].concat(D).map(function(d){return[].concat(d.N.E).map(function(e){e["resourceType"]=d.N.name;return e;});}).reduce(function(a,b){return a.concat(b);}));}this._data.map(g,this).forEach(C.prototype.addContentResource,this._contentConnector);return this;};A.prototype._processResources=function(R){var a=function(d,n){return atob(d.split(",")[0]);};var b=function(r){if(q.sap.endsWith(r.name,".dae")){this._resourceFiles[r.name]=a(r.value,r.name);}else{this._resourceFiles[r.name]="data:"+r.name.split(".")[1]+";base64,"+r.value;}};R.forEach(b,this);return this;};A.prototype._processActions=function(b){this._groupedActions=b.reduce(function(g,a){var d=a.refVO;if(!a.refVO){d="General";}g[d]=g[d]||[];g[d].push(a);return g;},{});return this;};A.prototype._processVOs=function(a){var _=function(b){if(b.hasOwnProperty("model")){b["contentResource"]={source:b.model,sourceType:"dae",id:b.model};}this._contentResourceTemplates[b.datasource]=b;};a.forEach(_,this);return this;};A.prototype.load=function(d){this._configureViewport();var P=null;if(typeof d==="string"){try{P=JSON.parse(d);}catch(e){h.error("sap.ui.vbm.Adapter: attempt to load invalid JSON string.");return this;}}else if(typeof d==="object"){P=d;}if(!(P&&P.SAPVB)){h.error("sap.ui.vbm.Adapter3D: attempt to load null.");return this;}if(P.SAPVB.Resources&&P.SAPVB.Resources.Set&&P.SAPVB.Resources.Set.Resource){this._processResources([].concat(P.SAPVB.Resources.Set.Resource));}if(P.SAPVB.DataTypes&&P.SAPVB.DataTypes.Set&&P.SAPVB.DataTypes.Set.N){this._processDataTypes([].concat(P.SAPVB.DataTypes.Set.N));}if(P.SAPVB.Scenes&&P.SAPVB.Scenes.Set&&P.SAPVB.Scenes.Set.Scene&&P.SAPVB.Scenes.Set.Scene.VO){this._processVOs([].concat(P.SAPVB.Scenes.Set.Scene.VO));}if(P.SAPVB.Actions&&P.SAPVB.Actions.Set&&P.SAPVB.Actions.Set.Action){this._processActions([].concat(P.SAPVB.Actions.Set.Action));}if(P.SAPVB.Data&&P.SAPVB.Data.Set&&!q.isEmptyObject(P.SAPVB.Data.Set)){this._processData(P.SAPVB.Data.Set,true);}return this;};o=function(){var g=new THREE.Geometry(),a=0.1;g.vertices.push(new k(a,a,-a),new k(a,-a,-a),new k(-a,-a,-a),new k(-a,a,-a),new k(a,a,a),new k(-a,a,a),new k(-a,-a,a),new k(a,-a,a),new k(a,a,-a),new k(a,a,a),new k(a,-a,a),new k(a,-a,-a),new k(a,-a,-a),new k(a,-a,a),new k(-a,-a,a),new k(-a,-a,-a),new k(-a,-a,-a),new k(-a,-a,a),new k(-a,a,a),new k(-a,a,-a),new k(a,a,a),new k(a,a,-a),new k(-a,a,-a),new k(-a,a,a));var n=new k(0,0,-1),b=new k(0,0,1),d=new k(1,0,0),e=new k(0,-1,0),i=new k(-1,0,0),r=new k(0,1,0),z=new THREE.Color(0.5,0.5,0.5);g.faces.push(new F(0,2,3,n,z),new F(0,1,2,n,z),new F(4,5,6,b,z),new F(4,6,7,b,z),new F(8,10,11,d,z),new F(8,9,10,d,z),new F(12,14,15,e,z),new F(12,13,14,e,z),new F(16,18,19,i,z),new F(16,17,18,i,z),new F(20,22,23,r,z),new F(20,21,22,r,z));var D=[new j(0.5,0.5),new j(1.0,0.5),new j(1.0,1.0),new j(0.5,1.0),new j(0.5,0.5),new j(1.0,0.5),new j(1.0,1.0),new j(0.5,1.0),new j(0.5,0.5),new j(0.5,1.0),new j(0.0,1.0),new j(0.0,0.5),new j(0.5,0.5),new j(0.5,0.0),new j(1.0,0.0),new j(1.0,0.5),new j(0.5,0.5),new j(0.5,1.0),new j(0.0,1.0),new j(0.0,0.5),new j(0.0,0.5),new j(0.0,0.0),new j(0.5,0.0),new j(0.5,0.5)];g.faceVertexUvs[0].push([D[0],D[2],D[3]],[D[0],D[1],D[2]],[D[4],D[5],D[6]],[D[4],D[6],D[7]],[D[8],D[10],D[11]],[D[8],D[9],D[10]],[D[12],D[14],D[15]],[D[12],D[13],D[14]],[D[16],D[18],D[19]],[D[16],D[17],D[18]],[D[20],D[22],D[23]],[D[20],D[21],D[22]]);return g;};var s=function(n){var a=[];n.traverse(function(b){if(b.isLight||b.isCamera){a.push(b);}});a.forEach(function(b){while(b&&b!==n){var d=b.parent;if(b.children.length===0){d.remove(b);}b=d;}});return n;};var t=function(n){if(n.isMesh&&n.geometry&&n.geometry.isGeometry){n.geometry.vertices.forEach(function(a){a.x=-a.x;});n.geometry.faces.forEach(function(a){var b=a.b;a.b=a.c;a.c=b;if(a.normal){a.normal.x=-a.normal.x;}if(a.vertexNormals&&a.vertexNormals.length===3){b=a.vertexNormals[1];a.vertexNormals[1]=a.vertexNormals[2];a.vertexNormals[2]=b;a.vertexNormals[0].x=-a.vertexNormals[0].x;a.vertexNormals[1].x=-a.vertexNormals[1].x;a.vertexNormals[2].x=-a.vertexNormals[2].x;}if(a.vertexColors&&a.vertexColors.length===3){b=a.vertexColors[1];a.vertexColors[1]=a.vertexColors[2];a.vertexColors[2]=b;}});n.geometry.faceVertexUvs.forEach(function(a){a.forEach(function(b){var d=b[1];b[1]=b[2];b[2]=d;});});}return n;};var u=function(n){var a=new B().setFromObject(n).getCenter();n.applyMatrix(new M().makeTranslation(-a.x,-a.y,+a.z));var b=new B().setFromObject(n);var d=Math.max(Math.abs(b.min.x),Math.abs(b.min.y),Math.abs(b.min.z),Math.abs(b.max.x),Math.abs(b.max.y),Math.abs(b.max.z));if(d){d=1/d;}n.applyMatrix(new M().makeScale(d,d,d));b=new B().setFromObject(n);a=b.getCenter();n.translateZ(a.z-(b.max.z<0?b.max.z:b.min.z));return n;};var v=function(a,b){return new Promise(function(r,d){var e=new THREE.ColladaLoader();e.parse(b.getSource().content,function(g){s(g.scene);g.scene.traverse(t);g.scene.applyMatrix(new M().makeScale(1,-1,-1));var i=b.getSource();g.scene.traverse(function(n){if(n.isMesh){n.material.color=i.color;n.material.opacity=i.opacity;}});a.add(u(g.scene));r({node:a,contentResource:b});});});};var w=function(a,b){var n=b.getSource();a.add(u(t(n)).rotateX(m(180)));return Promise.resolve({node:a,contentResource:b});};var x={dimension:3,contentManagerClassName:"sap.ui.vk.threejs.ContentManager",settings:{loader:v}};var y={dimension:3,contentManagerClassName:"sap.ui.vk.threejs.ContentManager",settings:{loader:w}};C.addContentManagerResolver(function(a){return Promise.resolve(a.getSource()instanceof THREE.Object3D?y:x);});return A;});
