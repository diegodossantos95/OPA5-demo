/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/EventProvider","sap/ui/core/ResizeHandler","./thirdparty/three"],function(q,E,R,t){"use strict";var V=E.extend("sap.ui.vk.threejs.ViewportGestureHandler",{metadata:{publicMethods:["beginGesture","move","endGesture","click","doubleClick","contextMenu","getViewport","update"]},constructor:function(a){this._viewport=a;this._rect=null;this._evt={x:0,y:0,z:0,d:0,initd:0};this._gesture=false;this._viewport.attachEvent("resize",this,this._onresize);this._nomenu=false;var T=function(b){var c=b;var g=new THREE.Vector3();var d=new THREE.Vector2();var o=false;var A=0.001;var M=-Math.PI/2+A;var e=Math.PI/2-A;var s=new THREE.Spherical();var f=new THREE.Vector3();this.isTurnTableMode=true;function h(r){var k=new THREE.Vector3(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE);var n=new THREE.Vector3(Number.MIN_VALUE,Number.MIN_VALUE,Number.MIN_VALUE);r.traverse(function(u){if(u instanceof THREE.Mesh){var p=new THREE.Vector3();p.applyMatrix4(u.matrixWorld);k.x=Math.min(k.x,p.x);k.y=Math.min(k.y,p.y);k.z=Math.min(k.z,p.z);n.x=Math.max(n.x,p.x);n.y=Math.max(n.y,p.y);n.z=Math.max(n.z,p.z);}});return k.add(n).multiplyScalar(0.5);}this.beginGesture=function(x,y){var k=c.getRenderer().domElement;var n=c.getScene().getSceneRef();var p=c.getCamera();var r=(x-k.offsetLeft)/k.width*2-1;var u=(k.offsetTop-y)/k.height*2+1;d.x=r;d.y=u;var v=c.hitTest(x,y,n,p);if(v){g.copy(v.point);o=true;}else{g=h(n);o=false;}};this.endGesture=function(){o=false;};function i(k,n){var v=new THREE.Vector3();v.setFromMatrixColumn(n,0);v.multiplyScalar(-k);return v;}function j(k,n){var v=new THREE.Vector3();v.setFromMatrixColumn(n,1);v.multiplyScalar(k);return v;}this.pan=function(n,p){if(n===0&&p===0){return;}var r=c.getCamera();var u=new THREE.Vector3().copy(g);var v=c.getRenderer().domElement;var w=v.height/2;if(r.isPerspectiveCamera){var x=new THREE.Vector3().subVectors(r.position,u).length();var y=r.fov/180*Math.PI/2;var k=w/Math.tan(y);n=n*x/k;p=p*x/k;}else if(r.isOrthographicCamera){n=n/r.zoom;p=p/r.zoom;}else{q.sap.log.error("threejs.ViewportGestureHandler: unsupported camera type");}f.add(i(n,r.matrix));f.add(j(p,r.matrix));};this.rotate=function(k,n){if(k===0&&n===0){return;}s.theta-=(k*0.01);s.phi+=(n*0.01);};this.zoom=function(z){if(z===0||z===1){return;}var k=c.getCamera();var n=new THREE.Vector3();var p,r;if(k.isPerspectiveCamera){if(o){p=new THREE.Vector3(d.x,d.y,-1).unproject(k);r=new THREE.Vector3(d.x,d.y,1).unproject(k);r.sub(p);n.copy(r);}else{n.copy(k.getWorldDirection());}var u=new THREE.Vector3().copy(g).sub(k.position);var v=u.length();n.normalize();n.multiplyScalar(v);n.multiplyScalar(1-1/z);}else if(k.isOrthographicCamera){if(o){p=new THREE.Vector3(0,0,1).unproject(k);r=new THREE.Vector3(d.x,d.y,1).unproject(k);r.sub(p);n.copy(r);}n.multiplyScalar(1-1/z);k.zoom*=z;k.updateProjectionMatrix();}else{q.sap.log.error("threejs.ViewportGestureHandler: unsupported camera type");}f.add(n);};function l(k,p){var n=Math.sin(k);var r=Math.cos(k);var u=Math.sin(p);var v=Math.cos(p);var z=r*v;var x=n*v;var y=u;return new THREE.Vector3(x,y,z);}function m(n,k,p){return Math.max(k,Math.min(n,p));}this.update=function(){var k=c.getCamera();if(k){var r=new THREE.Vector3().copy(g);var n=new THREE.Vector3().copy(k.position);n.sub(r);var p=k.getWorldDirection();p.normalize();var u=new THREE.Vector3().copy(k.up);if(this.isTurnTableMode){var y=new THREE.Vector3(0,1,0);var v=Math.atan2(p.x,p.z)+Math.PI/2;var w=l(v,0);w.normalize();var x=Math.atan2(p.y,Math.sqrt(p.x*p.x+p.z*p.z));var z=new THREE.Quaternion();z.setFromAxisAngle(y,s.theta);var B=new THREE.Quaternion();B.setFromAxisAngle(w,m(s.phi,M+x,e+x));u.copy(p).cross(w);u.normalize();z.multiply(B);n.applyQuaternion(z);p.applyQuaternion(z);u.applyQuaternion(z);}else{var C=new THREE.Vector3().crossVectors(u,p);C.normalize();var D=new THREE.Quaternion();D.setFromAxisAngle(u,s.theta);var F=new THREE.Quaternion();F.setFromAxisAngle(C,s.phi);D.multiply(F);n.applyQuaternion(D);p.applyQuaternion(D);u.applyQuaternion(D);p.normalize();u.normalize();}n.add(r);var G=n.clone();G.add(p);k.position.copy(n);k.up.copy(u);k.lookAt(G);k.position.add(f);s.set(0,0,0);f.set(0,0,0);k.updateMatrix();k.updateProjectionMatrix();}};};this._cameraController=new T(a);}});V.prototype.destroy=function(){this._viewport=null;this._rect=null;this._evt=null;this._gesture=false;};V.prototype._getOffset=function(o){var r=o.getBoundingClientRect();var p={x:r.left+window.pageXOffset,y:r.top+window.pageYOffset};return p;};V.prototype._inside=function(e){if(this._rect==null||true){var i=this._viewport.getIdForLabel();var d=document.getElementById(i);if(d==null){return false;}var o=this._getOffset(d);this._rect={x:o.x,y:o.y,w:d.offsetWidth,h:d.offsetHeight};}return(e.x>=this._rect.x&&e.x<=this._rect.x+this._rect.w&&e.y>=this._rect.y&&e.y<=this._rect.y+this._rect.h);};V.prototype._onresize=function(e){this._gesture=false;this._rect=null;};V.prototype.beginGesture=function(a){if(this._inside(a)&&!this._gesture){this._gesture=true;var x=a.x-this._rect.x,y=a.y-this._rect.y;this._evt.x=x;this._evt.y=y;this._evt.d=a.d;this._evt.initd=a.d;this._evt.avgd=a.d;this._evt.avgx=0;this._evt.avgy=0;q.sap.log.debug("Loco: beginGesture: "+x+", "+y);this._cameraController.beginGesture(x,y);a.handled=true;if(document.activeElement){try{document.activeElement.blur();}catch(e){}}var d=document.getElementById(this._viewport.getIdForLabel());d.focus();}this._nomenu=false;};V.prototype.move=function(e){if(this._gesture){var x=e.x-this._rect.x,y=e.y-this._rect.y;var d=x-this._evt.x;var a=y-this._evt.y;var b=e.d-this._evt.d;this._evt.x=x;this._evt.y=y;this._evt.d=e.d;this._evt.avgx=this._evt.avgx*0.99+d*0.01;this._evt.avgy=this._evt.avgy*0.99+a*0.01;var z=1.0;if(this._evt.initd>0){z=1.0+b*(1.0/this._evt.initd);}else if(e.n==2){if(e.points[0].y>e.points[1].y){z=1.0-b*0.005;if(z<0.333){z=0.333;}}else{z=1.0+b*0.005;if(z>3){z=3;}}}if(this._evt.initd>0){var c=Math.sqrt(this._evt.avgx*this._evt.avgx+this._evt.avgy*this._evt.avgy);q.sap.log.debug("AvgDist: "+c);if((Math.abs(e.d-this._evt.avgd)/this._evt.avgd)<(c/10)){z=1.0;}}this._evt.avgd=this._evt.avgd*0.97+e.d*0.03;switch(e.n){case 1:q.sap.log.debug("Loco: Rotate: "+(d)+", "+(a));this._cameraController.rotate(d,a);break;case 2:q.sap.log.debug("Loco: Pan: "+(d)+", "+(a));if(z!=0&&z!=1.0){q.sap.log.debug("Loco: Zoom: "+(z));}this._cameraController.pan(d,a);if(d<10&&a<10&&z!=0&&z!=1.0){this._cameraController.zoom(z);}break;default:break;}this._nomenu=true;e.handled=true;}};V.prototype.endGesture=function(e){if(this._gesture){var x=e.x-this._rect.x,y=e.y-this._rect.y;q.sap.log.debug("Loco: endGesture: "+x+", "+y);this._cameraController.endGesture();this._gesture=false;e.handled=true;}};V.prototype.click=function(e){if(this._inside(e)&&e.buttons<=1){var x=e.x-this._rect.x,y=e.y-this._rect.y;q.sap.log.debug("Loco: click: "+(x)+", "+(y));if(this._viewport){this._viewport.tap(x,y,false);}e.handled=true;}};V.prototype.doubleClick=function(e){if(this._inside(e)&&e.buttons<=1){var x=e.x-this._rect.x,y=e.y-this._rect.y;q.sap.log.debug("Loco: doubleClick: "+(x)+", "+(y));e.handled=true;}};V.prototype.contextMenu=function(e){if(this._inside(e)||this._nomenu||e.buttons==5){this._nomenu=false;e.handled=true;}};V.prototype.keyEventHandler=function(e){};V.prototype.getViewport=function(){return this._viewport;};V.prototype.update=function(){this._cameraController.update();};return V;},true);