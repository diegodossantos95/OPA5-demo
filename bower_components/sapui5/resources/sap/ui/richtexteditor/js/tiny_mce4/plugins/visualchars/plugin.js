tinymce.PluginManager.add('visualchars',function(a){var s=this,b;function t(d){var e,f,i,g=a.getBody(),h,j=a.selection,k,l;var m,v;m={'\u00a0':'nbsp','\u00ad':'shy'};function w(n){return'<span data-mce-bogus="1" class="mce-'+m[n]+'">'+n+'</span>';}function o(){var n,r='';for(n in m){r+=n;}return new RegExp('['+r+']','g');}function p(){var n,q='';for(n in m){if(q){q+=',';}q+='span.mce-'+m[n];}return q;}b=!b;s.state=b;a.fire('VisualChars',{state:b});v=o();if(d){l=j.getBookmark();}if(b){f=[];tinymce.walk(g,function(n){if(n.nodeType==3&&n.nodeValue&&v.test(n.nodeValue)){f.push(n);}},'childNodes');for(i=0;i<f.length;i++){h=f[i].nodeValue;h=h.replace(v,w);k=a.dom.create('div',null,h);while((e=k.lastChild)){a.dom.insertAfter(e,f[i]);}a.dom.remove(f[i]);}}else{f=a.dom.select(p(),g);for(i=f.length-1;i>=0;i--){a.dom.remove(f[i],1);}}j.moveToBookmark(l);}function c(){var s=this;a.on('VisualChars',function(e){s.active(e.state);});}a.addCommand('mceVisualChars',t);a.addButton('visualchars',{title:'Show invisible characters',cmd:'mceVisualChars',onPostRender:c});a.addMenuItem('visualchars',{text:'Show invisible characters',cmd:'mceVisualChars',onPostRender:c,selectable:true,context:'view',prependToContext:true});});
