var D3,document={createElement:function(){return{style:{setProperty:function(){}}};},documentElement:{matches:function(){},style:{}}},window={navigator:{}};
function define(d){D3=d;}
define.amd=true;
function getD3(d){if(!D3){if(d.substr(0,1)!="/"){d="/"+d;}importScripts(d);}return D3;}
onmessage=function(e){var g=e.data.graph;var f=getD3(e.data.sD3Source).layout.force().nodes(g.nodes).links(g.links).alpha(e.data.alpha).friction(e.data.friction).charge(e.data.charge).start();setTimeout(f.stop,e.data.maximumDuration);f.on("end",function(){postMessage({graph:g});});};
