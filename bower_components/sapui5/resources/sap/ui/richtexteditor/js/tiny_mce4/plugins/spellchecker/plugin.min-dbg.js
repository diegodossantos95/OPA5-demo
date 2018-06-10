!function(e,t){"use strict";function n(e,t){for(var n,r=[],o=0;o<e.length;++o){if(n=a[e[o]]||i(e[o]),!n)throw"module definition dependecy not found: "+e[o];r.push(n)}t.apply(null,r)}function r(e,r,i){if("string"!=typeof e)throw"invalid module definition, module id must be defined and be a string";if(r===t)throw"invalid module definition, dependencies must be specified";if(i===t)throw"invalid module definition, definition function must be specified";n(r,function(){a[e]=i.apply(null,arguments)})}function i(t){for(var n=e,r=t.split(/[.\/]/),i=0;i<r.length;++i){if(!n[r[i]])return;n=n[r[i]]}return n}function o(n){var r,i,o,s,l;for(r=0;r<n.length;r++){i=e,o=n[r],s=o.split(/[.\/]/);for(var c=0;c<s.length-1;++c)i[s[c]]===t&&(i[s[c]]={}),i=i[s[c]];i[s[s.length-1]]=a[o]}if(e.AMDLC_TESTS){l=e.privateModules||{};for(o in a)l[o]=a[o];for(r=0;r<n.length;r++)delete l[n[r]];e.privateModules=l}}var a={};r("tinymce/spellcheckerplugin/DomTextMatcher",[],function(){function e(e){return e&&1==e.nodeType&&"false"===e.contentEditable}return function(t,n){function r(e,t){if(!e[0])throw"findAndReplaceDOMText cannot handle zero-length matches";return{start:e.index,end:e.index+e[0].length,text:e[0],data:t}}function i(t){var n;if(3===t.nodeType)return t.data;if(k[t.nodeName]&&!N[t.nodeName])return"";if(e(t))return"\n";if(n="",(N[t.nodeName]||S[t.nodeName])&&(n+="\n"),t=t.firstChild)do n+=i(t);while(t=t.nextSibling);return n}function o(t,n,r){var i,o,a,s,l,c=[],u=0,d=t,f=0;n=n.slice(0),n.sort(function(e,t){return e.start-t.start}),l=n.shift();e:for(;;){if((N[d.nodeName]||S[d.nodeName]||e(d))&&u++,3===d.nodeType&&(!o&&d.length+u>=l.end?(o=d,s=l.end-u):i&&c.push(d),!i&&d.length+u>l.start&&(i=d,a=l.start-u),u+=d.length),i&&o){if(d=r({startNode:i,startNodeIndex:a,endNode:o,endNodeIndex:s,innerNodes:c,match:l.text,matchIndex:f}),u-=o.length-s,i=null,o=null,c=[],l=n.shift(),f++,!l)break}else if(k[d.nodeName]&&!N[d.nodeName]||!d.firstChild){if(d.nextSibling){d=d.nextSibling;continue}}else if(!e(d)){d=d.firstChild;continue}for(;;){if(d.nextSibling){d=d.nextSibling;break}if(d.parentNode===t)break e;d=d.parentNode}}}function a(e){function t(t,n){var r=_[n];r.stencil||(r.stencil=e(r));var i=r.stencil.cloneNode(!1);return i.setAttribute("data-mce-index",n),t&&i.appendChild(E.doc.createTextNode(t)),i}return function(e){var n,r,i,o=e.startNode,a=e.endNode,s=e.matchIndex,l=E.doc;if(o===a){var c=o;i=c.parentNode,e.startNodeIndex>0&&(n=l.createTextNode(c.data.substring(0,e.startNodeIndex)),i.insertBefore(n,c));var u=t(e.match,s);return i.insertBefore(u,c),e.endNodeIndex<c.length&&(r=l.createTextNode(c.data.substring(e.endNodeIndex)),i.insertBefore(r,c)),c.parentNode.removeChild(c),u}n=l.createTextNode(o.data.substring(0,e.startNodeIndex)),r=l.createTextNode(a.data.substring(e.endNodeIndex));for(var d=t(o.data.substring(e.startNodeIndex),s),f=[],p=0,m=e.innerNodes.length;p<m;++p){var g=e.innerNodes[p],h=t(g.data,s);g.parentNode.replaceChild(h,g),f.push(h)}var v=t(a.data.substring(0,e.endNodeIndex),s);return i=o.parentNode,i.insertBefore(n,o),i.insertBefore(d,o),i.removeChild(o),i=a.parentNode,i.insertBefore(v,a),i.insertBefore(r,a),i.removeChild(a),v}}function s(e){var t=e.parentNode;t.insertBefore(e.firstChild,e),e.parentNode.removeChild(e)}function l(e){var n=t.getElementsByTagName("*"),r=[];e="number"==typeof e?""+e:null;for(var i=0;i<n.length;i++){var o=n[i],a=o.getAttribute("data-mce-index");null!==a&&a.length&&(a!==e&&null!==e||r.push(o))}return r}function c(e){for(var t=_.length;t--;)if(_[t]===e)return t;return-1}function u(e){var t=[];return d(function(n,r){e(n,r)&&t.push(n)}),_=t,this}function d(e){for(var t=0,n=_.length;t<n&&e(_[t],t)!==!1;t++);return this}function f(e){return _.length&&o(t,_,a(e)),this}function p(e,t){if(w&&e.global)for(;C=e.exec(w);)_.push(r(C,t));return this}function m(e){var t,n=l(e?c(e):null);for(t=n.length;t--;)s(n[t]);return this}function g(e){return _[e.getAttribute("data-mce-index")]}function h(e){return l(c(e))[0]}function v(e,t,n){return _.push({start:e,end:e+t,text:w.substr(e,t),data:n}),this}function b(e){var t=l(c(e)),r=n.dom.createRng();return r.setStartBefore(t[0]),r.setEndAfter(t[t.length-1]),r}function y(e,t){var r=b(e);return r.deleteContents(),t.length>0&&r.insertNode(n.dom.doc.createTextNode(t)),r}function x(){return _.splice(0,_.length),m(),this}var C,w,N,k,S,_=[],E=n.dom;return N=n.schema.getBlockElements(),k=n.schema.getWhiteSpaceElements(),S=n.schema.getShortEndedElements(),w=i(t),{text:w,matches:_,each:d,filter:u,reset:x,matchFromElement:g,elementFromMatch:h,find:p,add:v,wrap:f,unwrap:m,replace:y,rangeFromMatch:b,indexOf:c}}}),r("tinymce/spellcheckerplugin/Plugin",["tinymce/spellcheckerplugin/DomTextMatcher","tinymce/PluginManager","tinymce/util/Tools","tinymce/ui/Menu","tinymce/dom/DOMUtils","tinymce/util/XHR","tinymce/util/URI","tinymce/util/JSON"],function(e,t,n,r,i,o,a,s){t.add("spellchecker",function(l,c){function u(){return B.textMatcher||(B.textMatcher=new e(l.getBody(),l)),B.textMatcher}function d(e,t){var r=[];return n.each(t,function(e){r.push({selectable:!0,text:e.name,data:e.value})}),r}function f(e){for(var t in e)return!1;return!0}function p(e,t){var o=[],a=E[e];n.each(a,function(e){o.push({text:e,onclick:function(){l.insertContent(l.dom.encode(e)),l.dom.remove(t),b()}})}),o.push({text:"-"}),A&&o.push({text:"Add to Dictionary",onclick:function(){y(e,t)}}),o.push.apply(o,[{text:"Ignore",onclick:function(){x(e,t)}},{text:"Ignore all",onclick:function(){x(e,t,!0)}}]),R=new r({items:o,context:"contextmenu",onautohide:function(e){e.target.className.indexOf("spellchecker")!=-1&&e.preventDefault()},onhide:function(){R.remove(),R=null}}),R.renderTo(document.body);var s=i.DOM.getPos(l.getContentAreaContainer()),c=l.dom.getPos(t[0]),u=l.dom.getRoot();"BODY"==u.nodeName?(c.x-=u.ownerDocument.documentElement.scrollLeft||u.scrollLeft,c.y-=u.ownerDocument.documentElement.scrollTop||u.scrollTop):(c.x-=u.scrollLeft,c.y-=u.scrollTop),s.x+=c.x,s.y+=c.y,R.moveTo(s.x,s.y+t[0].offsetHeight)}function m(){return l.getParam("spellchecker_wordchar_pattern")||new RegExp('[^\\s!"#$%&()*+,-./:;<=>?@[\\]^_{|}`\xa7\xa9\xab\xae\xb1\xb6\xb7\xb8\xbb\xbc\xbd\xbe\xbf\xd7\xf7\xa4\u201d\u201c\u201e\xa0\u2002\u2003\u2009]+',"g")}function g(e,t,r,i){var u={method:e,lang:P.spellchecker_language},d="";u["addToDictionary"==e?"word":"text"]=t,n.each(u,function(e,t){d&&(d+="&"),d+=t+"="+encodeURIComponent(e)}),o.send({url:new a(c).toAbsolute(P.spellchecker_rpc_url),type:"post",content_type:"application/x-www-form-urlencoded",data:d,success:function(e){if(e=s.parse(e))e.error?i(e.error):r(e);else{var t=l.translate("Server response wasn't proper JSON.");i(t)}},error:function(){var e=l.translate("The spelling service was not found: (")+P.spellchecker_rpc_url+l.translate(")");i(e)}})}function h(e,t,n,r){var i=P.spellchecker_callback||g;i.call(B,e,t,n,r)}function v(){function e(e){l.notificationManager.open({text:e,type:"error"}),l.setProgressState(!1),C()}C()||(l.setProgressState(!0),h("spellcheck",u().text,S,e),l.focus())}function b(){l.dom.select("span.mce-spellchecker-word").length||C()}function y(e,t){l.setProgressState(!0),h("addToDictionary",e,function(){l.setProgressState(!1),l.dom.remove(t,!0),b()},function(e){l.notificationManager.open({text:e,type:"error"}),l.setProgressState(!1)})}function x(e,t,r){l.selection.collapse(),r?n.each(l.dom.select("span.mce-spellchecker-word"),function(t){t.getAttribute("data-mce-word")==e&&l.dom.remove(t,!0)}):l.dom.remove(t,!0),b()}function C(){if(u().reset(),B.textMatcher=null,T)return T=!1,l.fire("SpellcheckEnd"),!0}function w(e){var t=e.getAttribute("data-mce-index");return"number"==typeof t?""+t:t}function N(e){var t,r=[];if(t=n.toArray(l.getBody().getElementsByTagName("span")),t.length)for(var i=0;i<t.length;i++){var o=w(t[i]);null!==o&&o.length&&o===e.toString()&&r.push(t[i])}return r}function k(e){var t=P.spellchecker_language;e.control.items().each(function(e){e.active(e.settings.data===t)})}function S(e){var t;if(e.words?(A=!!e.dictionary,t=e.words):t=e,l.setProgressState(!1),f(t)){var n=l.translate("No misspellings found.");return l.notificationManager.open({text:n,type:"info"}),void(T=!1)}E=t,u().find(m()).filter(function(e){return!!t[e.text]}).wrap(function(e){return l.dom.create("span",{"class":"mce-spellchecker-word","data-mce-bogus":1,"data-mce-word":e.text})}),T=!0,l.fire("SpellcheckStart")}var _,E,T,R,A,B=this,P=l.settings;if(/(^|[ ,])tinymcespellchecker([, ]|$)/.test(P.plugins)&&t.get("tinymcespellchecker"))return void("undefined"!=typeof console&&console.log&&console.log("Spell Checker Pro is incompatible with Spell Checker plugin! Remove 'spellchecker' from the 'plugins' option."));var D=P.spellchecker_languages||"English=en,Danish=da,Dutch=nl,Finnish=fi,French=fr_FR,German=de,Italian=it,Polish=pl,Portuguese=pt_BR,Spanish=es,Swedish=sv";_=d("Language",n.map(D.split(","),function(e){return e=e.split("="),{name:e[0],value:e[1]}})),l.on("click",function(e){var t=e.target;if("mce-spellchecker-word"==t.className){e.preventDefault();var n=N(w(t));if(n.length>0){var r=l.dom.createRng();r.setStartBefore(n[0]),r.setEndAfter(n[n.length-1]),l.selection.setRng(r),p(t.getAttribute("data-mce-word"),n)}}}),l.addMenuItem("spellchecker",{text:"Spellcheck",context:"tools",onclick:v,selectable:!0,onPostRender:function(){var e=this;e.active(T),l.on("SpellcheckStart SpellcheckEnd",function(){e.active(T)})}});var M={tooltip:"Spellcheck",onclick:v,onPostRender:function(){var e=this;l.on("SpellcheckStart SpellcheckEnd",function(){e.active(T)})}};_.length>1&&(M.type="splitbutton",M.menu=_,M.onshow=k,M.onselect=function(e){P.spellchecker_language=e.control.settings.data}),l.addButton("spellchecker",M),l.addCommand("mceSpellCheck",v),l.on("remove",function(){R&&(R.remove(),R=null)}),l.on("change",b),this.getTextMatcher=u,this.getWordCharPattern=m,this.markErrors=S,this.getLanguage=function(){return P.spellchecker_language},P.spellchecker_language=P.spellchecker_language||P.language||"en"})}),o(["tinymce/spellcheckerplugin/DomTextMatcher"])}(window);