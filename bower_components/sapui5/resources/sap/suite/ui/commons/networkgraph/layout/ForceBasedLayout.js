sap.ui.define(["jquery.sap.global","./LayoutAlgorithm","./Geometry","./D3ForceWrapper","./LayoutTask"],function(q,L,G,D,a){var S=12;var F=L.extend("sap.suite.ui.commons.networkgraph.layout.ForceBasedLayout",{metadata:{properties:{alpha:{type:"float",group:"Behavior",defaultValue:0.3},charge:{type:"float",group:"Behavior",defaultValue:-30},friction:{type:"float",group:"Behavior",defaultValue:0.9},maximumDuration:{type:"int",group:"Behaviour",defaultValue:1000}}}});F.prototype.isLayered=function(){return false;};F.prototype.layout=function(){return new a(function(r,R,l){var g={nodes:[],links:[]},o=this.getParent();if(!o){R("The algorithm must be associated with a graph.");return;}q.sap.measure.start("NetworkGraph - ForcedBaseLayout","Layouting of a graph "+o.getId());o.getNodes().forEach(function(n,i){g.nodes.push({id:n.getKey()});n.iIndex=i;});o.getNodes().forEach(function(n){n.aChildren.forEach(function(c){g.links.push({source:n.iIndex,target:c.iIndex,value:1});});});D.layout({graph:g,alpha:this.getAlpha(),friction:this.getFriction(),charge:this.getCharge(),maximumDuration:this.getMaximumDuration()}).then(function(d){if(l.isTerminated()){r();return;}var g=d.graph||d;var b=G.getBoundingBox(g.nodes),x=(b.p1.x)*-S+100,y=(b.p1.y)*-S+100;g.nodes.forEach(function(c){var n=o.getNodeByKey(c.id);n.setX(c.x*S+x);n.setY(c.y*S+y);});g.links.forEach(function(c){var f=o.getNodeByKey(c.source.id),t=o.getNodeByKey(c.target.id),e=f.aLines.filter(function(j){return j.getTo()===c.target.id;}),h=e.length,A=(f._getCircleSize()/2-5)/h,j,k,v;for(var i=0;i<h;i++){j=e[i];k=i%2?1:-1;v=h===1?0:A*Math.ceil((i+1)/2)*k;j.setSource({x:f.getX()+f._iWidth/2+v,y:(f.getY()+f._getCircleSize()/2)+v});j.setTarget({x:(t.getX()+t._iWidth/2)+v,y:(t.getY()+t._getCircleSize()/2)+v});j.clearBends();}});r();},R);}.bind(this));};return F;});
