/**
 * Word Import JavaScript Library
 * Copyright (c) 2013-2015 Ephox Corp. All rights reserved.
 * This software is provided "AS IS," without a warranty of any kind.
 */
function com_ephox_keurig_Keurig(){var Lb='',Mb='" for "gwt:onLoadErrorFn"',Nb='" for "gwt:onPropertyErrorFn"',Ob='"><\/script>',Pb='#',Qb='&',Rb='/',Sb='22C0A5F649E4D90DCF4B423A1D38F4A2',Tb=':',Ub=':1',Vb=':2',Wb=':3',Xb=':4',Yb=':5',Zb='<script id="',$b='=',_b='?',ac='Bad handler "',bc='DOMContentLoaded',cc='SCRIPT',dc='Single-script hosted mode not yet implemented. See issue ',ec='Unexpected exception in locale detection, using default: ',fc='_',gc='__gwt_Locale',hc='__gwt_marker_com.ephox.keurig.Keurig',ic='base',jc='clear.cache.gif',kc='com.ephox.keurig.Keurig',lc='content',mc='default',nc='en',oc='gecko',pc='gecko1_8',qc='gwt.codesvr=',rc='gwt.hosted=',sc='gwt.hybrid',tc='gwt:onLoadErrorFn',uc='gwt:onPropertyErrorFn',vc='gwt:property',wc='http://code.google.com/p/google-web-toolkit/issues/detail?id=2079',xc='ie10',yc='ie8',zc='ie9',Ac='img',Bc='locale',Cc='locale=',Dc='meta',Ec='msie',Fc='name',Gc='safari',Hc='unknown',Ic='user.agent',Jc='webkit';var k=Lb,l=Mb,m=Nb,n=Ob,o=Pb,p=Qb,q=Rb,r=Sb,s=Tb,t=Ub,u=Vb,v=Wb,w=Xb,A=Yb,B=Zb,C=$b,D=_b,F=ac,G=bc,H=cc,I=dc,J=ec,K=fc,L=gc,M=hc,N=ic,O=jc,P=kc,Q=lc,R=mc,S=nc,T=oc,U=pc,V=qc,W=rc,X=sc,Y=tc,Z=uc,$=vc,_=wc,ab=xc,bb=yc,cb=zc,db=Ac,eb=Bc,fb=Cc,gb=Dc,hb=Ec,ib=Fc,jb=Gc,kb=Hc,lb=Ic,mb=Jc;var nb=window,ob=document,pb,qb,rb=k,sb={},tb=[],ub=[],vb=[],wb=0,xb,yb;if(!nb.__gwt_stylesLoaded){nb.__gwt_stylesLoaded={}}if(!nb.__gwt_scriptsLoaded){nb.__gwt_scriptsLoaded={}}function zb(){var b=false;try{var c=nb.location.search;return (c.indexOf(V)!=-1||(c.indexOf(W)!=-1||nb.external&&nb.external.gwtOnLoad))&&c.indexOf(X)==-1}catch(a){}zb=function(){return b};return b}
function Ab(){if(pb&&qb){pb(xb,P,rb,wb)}}
function Bb(){var e,f=M,g;ob.write(B+f+n);g=ob.getElementById(f);e=g&&g.previousSibling;while(e&&e.tagName!=H){e=e.previousSibling}function h(a){var b=a.lastIndexOf(o);if(b==-1){b=a.length}var c=a.indexOf(D);if(c==-1){c=a.length}var d=a.lastIndexOf(q,Math.min(c,b));return d>=0?a.substring(0,d+1):k}
;if(e&&e.src){rb=h(e.src)}if(rb==k){var i=ob.getElementsByTagName(N);if(i.length>0){rb=i[i.length-1].href}else{rb=h(ob.location.href)}}else if(rb.match(/^\w+:\/\//)){}else{var j=ob.createElement(db);j.src=rb+O;rb=h(j.src)}if(g){g.parentNode.removeChild(g)}}
function Cb(){var b=document.getElementsByTagName(gb);for(var c=0,d=b.length;c<d;++c){var e=b[c],f=e.getAttribute(ib),g;if(f){if(f==$){g=e.getAttribute(Q);if(g){var h,i=g.indexOf(C);if(i>=0){f=g.substring(0,i);h=g.substring(i+1)}else{f=g;h=k}sb[f]=h}}else if(f==Z){g=e.getAttribute(Q);if(g){try{yb=eval(g)}catch(a){alert(F+g+m)}}}else if(f==Y){g=e.getAttribute(Q);if(g){try{xb=eval(g)}catch(a){alert(F+g+l)}}}}}}
function Db(a,b){return b in tb[a]}
function Eb(a){var b=sb[a];return b==null?null:b}
function Fb(a,b){var c=vb;for(var d=0,e=a.length-1;d<e;++d){c=c[a[d]]||(c[a[d]]=[])}c[a[e]]=b}
function Gb(a){var b=ub[a](),c=tb[a];if(b in c){return b}var d=[];for(var e in c){d[c[e]]=e}if(yb){yb(a,d,b)}throw null}
ub[eb]=function(){var b=null;var c=R;try{if(!b){var d=location.search;var e=d.indexOf(fb);if(e>=0){var f=d.substring(e+7);var g=d.indexOf(p,e);if(g<0){g=d.length}b=d.substring(e+7,g)}}if(!b){b=Eb(eb)}if(!b){b=nb[L]}if(b){c=b}while(b&&!Db(eb,b)){var h=b.lastIndexOf(K);if(h<0){b=null;break}b=b.substring(0,h)}}catch(a){alert(J+a)}nb[L]=c;return b||R};tb[eb]={'default':0,en:1};ub[lb]=function(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(mb)!=-1}())return jb;if(function(){return b.indexOf(hb)!=-1&&ob.documentMode>=10}())return ab;if(function(){return b.indexOf(hb)!=-1&&ob.documentMode>=9}())return cb;if(function(){return b.indexOf(hb)!=-1&&ob.documentMode>=8}())return bb;if(function(){return b.indexOf(T)!=-1}())return U;return kb};tb[lb]={gecko1_8:0,ie10:1,ie8:2,ie9:3,safari:4};com_ephox_keurig_Keurig.onScriptLoad=function(a){com_ephox_keurig_Keurig=null;pb=a;Ab()};if(zb()){alert(I+_);return}Bb();Cb();try{var Hb;Fb([R,U],r);Fb([R,ab],r+t);Fb([R,jb],r+u);Fb([S,U],r+v);Fb([S,ab],r+w);Fb([S,jb],r+A);Hb=vb[Gb(eb)][Gb(lb)];var Ib=Hb.indexOf(s);if(Ib!=-1){wb=Number(Hb.substring(Ib+1))}}catch(a){return}var Jb;function Kb(){if(!qb){qb=true;Ab();if(ob.removeEventListener){ob.removeEventListener(G,Kb,false)}if(Jb){clearInterval(Jb)}}}
if(ob.addEventListener){ob.addEventListener(G,function(){Kb()},false)}var Jb=setInterval(function(){if(/loaded|complete/.test(ob.readyState)){Kb()}},50)}
com_ephox_keurig_Keurig();(function () {var $gwt_version = "2.6.1";var $wnd = window;var $doc = $wnd.document;var $moduleName, $moduleBase;var $stats = $wnd.__gwtStatsEvent ? function(a) {$wnd.__gwtStatsEvent(a)} : null;var $strongName = '22C0A5F649E4D90DCF4B423A1D38F4A2';function C(){}
function Hp(){}
function db(){}
function ub(){}
function Qb(){}
function th(){}
function Dh(){}
function Mh(){}
function Mo(){}
function fi(){}
function hi(){}
function Uk(){}
function Yk(){}
function al(){}
function ul(){}
function dh(a){}
function _h(){Qh()}
function Td(){Rd()}
function Wd(){Rd()}
function be(){$d()}
function Qf(){Pf()}
function Wf(){Vf()}
function ag(){_f()}
function jg(){ig()}
function tg(){sg()}
function zb(){xb(this)}
function Dm(){Bm(this)}
function Mm(){Hm(this)}
function Nm(){Hm(this)}
function rb(a){this.b=a}
function Xb(a){this.b=a}
function md(a){this.b=a}
function rd(a){this.b=a}
function ol(a){this.b=a}
function yn(a){this.b=a}
function Ln(a){this.b=a}
function Do(a){this.b=a}
function fo(a){this.c=a}
function ob(a){$();this.b=a}
function Jg(){Ck().C(this)}
function il(){Jg.call(this)}
function Fl(){Jg.call(this)}
function Hl(){Jg.call(this)}
function Kl(){Jg.call(this)}
function Pl(){Jg.call(this)}
function Ro(){Jg.call(this)}
function _o(){Jg.call(this)}
function jh(){return fh}
function Bm(a){a.b=new fi}
function Hm(a){a.b=new fi}
function Tc(){this.b=new op}
function pd(){this.b=new ro}
function op(){this.b=new ro}
function qh(){qh=Hp;ph=new th}
function Mg(){Mg=Hp;Lg=new C}
function Ko(){Ko=Hp;Jo=new Mo}
function Gp(){Gp=Hp;Fp=new Dp}
function $(){$=Hp;Y=new db;Z=Y}
function kd(){hd();return Zc}
function Gc(a){lc();this.b=a}
function Be(a,b){a.i=b}
function di(a,b){a.b+=b}
function Ce(a,b){a.h=a.i=b}
function xg(a,b){a.b[a.c++]=b}
function od(a,b){ko(a.b,b)}
function ue(a,b){return a.f[b]}
function tp(a,b){return a.f[b]}
function ze(a,b){return a.i+=b}
function Mk(){return !!$stats}
function Lk(a){return new Jk[a]}
function Ll(a){Kg.call(this,a)}
function jl(a){Kg.call(this,a)}
function Il(a){Kg.call(this,a)}
function Um(a){Kg.call(this,a)}
function Tl(a){Il.call(this,a)}
function xp(a){yp.call(this,a,0)}
function Bp(a,b,c){pn(a.b,b,c)}
function xo(a,b,c){a.splice(b,c)}
function Wb(a,b){return Sb(a.b,b)}
function po(a){return ji(a.b,a.c)}
function co(a){return a.b<a.c.M()}
function Ok(b,a){return b.exec(a)}
function mn(b,a){return b.f[Gq+a]}
function ve(a,b){return a.f[b]<=32}
function le(a,b){return me(a,b,a.k)}
function pe(a,b){return qe(a,b,a.k)}
function xh(a){return Bh((Ck(),a))}
function Qk(a){return new RegExp(a)}
function Jm(a,b){return Yl(a.b.b,b)}
function on(b,a){return Gq+a in b.f}
function Qn(a,b){this.c=a;this.b=b}
function Wo(a,b){this.b=a;this.c=b}
function He(a){this.b=im(a+rq)}
function Pc(){this.c=(hd(),bd)}
function Kg(a){this.f=a;Ck().C(this)}
function mh(a){$wnd.clearTimeout(a)}
function ii(a){return ji(a,a.length)}
function lh(a,b){return gi(a,b,null)}
function Bi(a){return a==null?null:a}
function _l(b,a){return b.indexOf(a)}
function up(a){return Pk(a.c,a.b,mq)}
function Em(a){Bm(this);di(this.b,a)}
function Om(a){Hm(this);di(this.b,a)}
function W(a,b){N();this.c=a;this.b=b}
function td(a,b){return b<256&&a.b[b]}
function vi(a,b){return a.cM&&a.cM[b]}
function yh(a){return parseInt(a)||-1}
function lm(a){return mi(xk,Lp,1,a,0)}
function ro(){this.b=mi(vk,Lp,0,0,0)}
function yo(a,b,c,d){a.splice(b,c,d)}
function Cm(a,b){di(a.b,b);return a}
function Im(a,b){di(a.b,b);return a}
function np(a,b){ko(a.b,b);return b}
function Yn(a,b){(a<0||a>=b)&&_n(a,b)}
function Rk(a,b){return new RegExp(a,b)}
function Hd(a,b){return a.b[b>=128?0:b]}
function ui(a,b){return a.cM&&!!a.cM[b]}
function yi(a,b){return a!=null&&ui(a,b)}
function Ai(a){return a.tM==Hp||ui(a,1)}
function ih(a){return a.$H||(a.$H=++$g)}
function Yl(b,a){return b.charCodeAt(a)}
function bm(b,a){return b.lastIndexOf(a)}
function am(c,a,b){return c.indexOf(a,b)}
function Pk(c,a,b){return a.replace(c,b)}
function hm(c,a,b){return c.substr(a,b-a)}
function yd(a,b){return xe(a,b)&&je(a,62)}
function Ep(a,b){return a!=null?a[b]:null}
function Qg(a){return a==null?null:a.name}
function el(b){var a=b.b;return a.source}
function mo(a,b){Yn(b,a.c);return a.b[b]}
function Lm(a,b,c,d){ei(a.b,b,c,d);return a}
function Km(a,b,c){return ei(a.b,b,c,cq),a}
function Ae(a,b,c){a.f=b;a.k=c;a.h=a.i=0}
function Ne(){Ne=Hp;Me=im('class=')}
function Rd(){Rd=Hp;Md();Qd=im('style=')}
function wd(){wd=Hp;vd=im('<v:imagedata ')}
function xf(){xf=Hp;wf=im('/*');vf=im('*/')}
function Bf(){Bf=Hp;Af=im(pq);zf=im(qq)}
function wm(){wm=Hp;tm={};vm={}}
function Dp(){this.b=new Uo;new Uo;new Uo}
function jf(a){gf();this.b=cf;this.b=a?df:cf}
function jd(a,b,c){this.d=a;this.c=c;this.b=b}
function yg(a,b,c,d){Sm(b,c,a.b,a.c,d);a.c+=d}
function bh(a,b,c){return a.apply(b,c);var d}
function cm(c,a,b){return c.lastIndexOf(a,b)}
function pm(a){return String.fromCharCode(a)}
function Pg(a){return a==null?null:a.message}
function Bl(a){return typeof a=='number'&&a>0}
function gm(b,a){return b.substr(a,b.length-a)}
function Vg(a){var b;return b=a,Ai(b)?b.cZ:oj}
function Al(a){var b=Jk[a.d];a=null;return b}
function sp(a){a.f=Ok(a.c,a.b);return !!a.f}
function ko(a,b){oi(a.b,a.c++,b);return true}
function sm(a,b){km(a.length,b);return nm(a,0,b)}
function ei(a,b,c,d){a.b=hm(a.b,0,b)+d+gm(a.b,c)}
function Tb(a,b,c,d){return O(Lb(b,c,d),new Xb(a))}
function Wg(a){var b;return b=a,Ai(b)?b.hC():ih(b)}
function ri(){ri=Hp;pi=[];qi=[];si(new hi,pi,qi)}
function _e(){_e=Hp;$e=im(dq);Ze=im('<\/span')}
function tf(){tf=Hp;sf=im('xmlns');rf=im('<html')}
function nl(){nl=Hp;ll=new ol(false);ml=new ol(true)}
function N(){N=Hp;L=(Ko(),Ko(),Jo);M=new rb(L)}
function Pf(){Pf=Hp;Ve();_e();Kf();Of=new ud('<\n\r')}
function $d(){$d=Hp;Md();Yd=im('\n\r{');Zd=im(' \t,')}
function Qh(){Qh=Hp;Error.stackTraceLimit=128}
function Ch(){try{null.a()}catch(a){return a}}
function uh(a,b){!a&&(a=[]);a[a.length]=b;return a}
function zh(a,b){a.length>=b&&a.splice(0,b);return a}
function Ag(a){this.b=mi(sk,Qp,-1,a,1);this.c=0}
function Fd(a,b){var c;c=a.f;Ae(a,b.b,b.c);b.b=c;b.c=0}
function Ug(a,b){var c;return c=a,Ai(c)?c.eQ(b):c===b}
function R(a,b){N();return new W(new rb(a),new rb(b))}
function pn(a,b,c){return !b?rn(a,c):qn(a,b,c,~~ih(b))}
function zi(a){return a!=null&&a.tM!=Hp&&!ui(a,1)}
function To(a,b){return Bi(a)===Bi(b)||a!=null&&Ug(a,b)}
function pp(a,b){return Bi(a)===Bi(b)||a!=null&&Ug(a,b)}
function vp(a,b){this.e=a;this.b=b;this.c=Rk(el(a),Vq)}
function Vl(a,b,c){this.b=Iq;this.e=a;this.c=b;this.d=c}
function _n(a,b){throw new Ll('Index: '+a+', Size: '+b)}
function Ke(){Ke=Hp;Ie=new ud(sq);Je=new ud(' \t\r\n')}
function Kf(){Kf=Hp;If=new ud(' >\r\n\t');Jf=new ud(sq)}
function _f(){_f=Hp;Ve();_e();Kf();Ne();$f=new ud('<c\n\r')}
function fe(){fe=Hp;de=im(pq);ce=im(qq);xf();ee=new be}
function zm(){if(um==256){tm=vm;vm={};um=0}++um}
function xb(a){if(!wb){wb=true;Gp();Bp(Fp,Ni,a);yb(a)}}
function kh(a){$wnd.setTimeout(function(){throw a},0)}
function nh(){return lh(function(){Zg!=0&&(Zg=0);ah=-1},10)}
function em(c,a,b){b=mm(b);return c.replace(RegExp(a,Vq),b)}
function Zl(a,b){if(!yi(b,1)){return false}return String(a)==b}
function wi(a,b){if(a!=null&&!vi(a,b)){throw new Fl}return a}
function eo(a){if(a.b>=a.c.M()){throw new _o}return a.c.W(a.b++)}
function Rm(a){Ll.call(this,'String index out of range: '+a)}
function km(a,b){if(b<0){throw new Rm(b)}if(b>a){throw new Rm(b)}}
function mi(a,b,c,d,e){var f;f=li(e,d);ni(a,b,c,f);return f}
function wl(a,b,c){var d;d=new ul;d.e=a+b;Bl(c)&&Cl(c,d);return d}
function ni(a,b,c,d){ri();ti(d,pi,qi);d.cZ=a;d.cM=b;d.qI=c;return d}
function rn(a,b){var c;c=a.c;a.c=b;if(!a.d){a.d=true;++a.e}return c}
function zg(a){for(;a.c>0;a.c--){if(a.b[a.c-1]>32){break}}}
function Xg(a){return a.toString?a.toString():'[JavaScriptObject]'}
function Ci(a){return ~~Math.max(Math.min(a,2147483647),-2147483648)}
function jo(a,b,c){(b<0||b>a.c)&&_n(b,a.c);yo(a.b,b,0,c);++a.c}
function gh(a,b,c){var d;d=eh();try{return bh(a,b,c)}finally{hh(d)}}
function $l(a,b,c,d){var e;for(e=0;e<b;++e){c[d++]=a.charCodeAt(e)}}
function zo(a,b,c,d){Array.prototype.splice.apply(a,[b,c].concat(d))}
function ti(a,b,c){ri();for(var d=0,e=b.length;d<e;++d){a[b[d]]=c[d]}}
function ki(a,b){var c,d;c=a;d=li(0,b);ni(c.cZ,c.cM,c.qI,d);return d}
function yl(a,b){var c;c=new ul;c.e=a+b;Bl(0)&&Cl(0,c);c.c=2;return c}
function zl(a,b){var c;c=new ul;c.e=cq+a;Bl(b)&&Cl(b,c);c.c=1;return c}
function oo(a,b){var c;c=(Yn(b,a.c),a.b[b]);xo(a.b,b,1);--a.c;return c}
function ji(a,b){var c,d;c=a;d=c.slice(0,b);ni(c.cZ,c.cM,c.qI,d);return d}
function im(a){var b,c;c=a.length;b=mi(sk,Qp,-1,c,1);$l(a,c,b,0);return b}
function xi(a){if(a!=null&&(a.tM==Hp||ui(a,1))){throw new Fl}return a}
function Cb(a,b,c){var d;d=Db(a,b,c);if(d>3*c){throw new Hl}else{return d}}
function no(a,b,c){for(;c<a.c;++c){if(pp(b,a.b[c])){return c}}return -1}
function Vf(){Vf=Hp;Se();Gf();pf();tf();wd();Uf=new ud('<x\n\r')}
function Gf(){Gf=Hp;Ff=im('<![if');Ef=im(tq);Df=im('<![endif]>')}
function Se(){Se=Hp;Re=im('<!--[if');Qe=im(tq);Pe=im('<![endif]-->')}
function hh(a){a&&sh((qh(),ph));--Zg;if(a){if(ah!=-1){mh(ah);ah=-1}}}
function Uo(){this.b=[];this.f={};this.d=false;this.c=null;this.e=0}
function Ub(a,b){this.c=Nb(new Qb,a);this.d=b;this.e=true;this.b=new Gc(b)}
function Og(a){Mg();Jg.call(this);this.b=cq;this.c=a;this.b=cq;Ck().A(this)}
function Hk(a){if(yi(a,26)){return a}return a==null?new Og(null):Fk(a)}
function lp(a){var b;b=a.b.c;if(b>0){return mo(a.b,b-1)}else{throw new Ro}}
function mp(a){var b;b=a.b.c;if(b>0){return oo(a.b,b-1)}else{throw new Ro}}
function kn(a,b){return b==null?a.c:yi(b,1)?mn(a,wi(b,1)):ln(a,b,~~Wg(b))}
function jn(a,b){return b==null?a.d:yi(b,1)?on(a,wi(b,1)):nn(a,b,~~Wg(b))}
function U(a,b){return pb(a.c.b,b.c.b)&&(N(),pb(wi(a.b.b,27),wi(b.b.b,27)))}
function T(a,b){return nl(),(a.n()?b.n()&&pb(a.p(aq),b.p(aq)):!b.n())?ml:ll}
function Ec(a,b){var c,d;c=xc(a,fc,b,nq);d=xc(a,kc,c,oq);return d==null?b:d}
function sn(e,a,b){var c,d=e.f;a=Gq+a;a in d?(c=d[a]):++e.e;d[a]=b;return c}
function si(a,b,c){var d=0,e;for(var f in a){if(e=a[f]){b[d]=f;c[d]=e;++d}}}
function gi(a,b,c){var d=$wnd.setTimeout(function(){a();c!=null&&dh(c)},b);return d}
function xl(a,b,c,d){var e;e=new ul;e.e=a+b;Bl(c)&&Cl(c,e);e.c=d?8:0;return e}
function I(a,b){var c,d;d=new Nm(a.length*b);for(c=0;c<b;c++){di(d.b,a)}return d.b.b}
function Dn(a){var b;b=new ro;a.d&&ko(b,new Ln(a));hn(a,b);gn(a,b);this.b=new fo(b)}
function rh(a){var b,c;if(a.b){c=null;do{b=a.b;a.b=null;c=vh(b,c)}while(a.b);a.b=c}}
function sh(a){var b,c;if(a.c){c=null;do{b=a.c;a.c=null;c=vh(b,c)}while(a.c);a.c=c}}
function Wm(a,b){var c;while(a.Q()){c=a.R();if(b==null?c==null:Ug(b,c)){return a}}return null}
function je(a,b){var c;for(c=a.i;c<a.k;c++){if(a.f[c]==b){a.i=c;return true}}return false}
function oe(a,b){var c;for(c=a.i;c<a.k;c++){if(td(b,a.f[c])){a.i=c;return true}}return false}
function ke(a,b,c){var d;for(d=a.i;d<c;d++){if(a.f[d]==b){a.i=d;return true}}return false}
function rp(a,b,c){Cm(b,hm(a.b,a.d,a.f.index));di(b.b,c);a.d=a.c.lastIndex;return a}
function Ye(a){if(!De(a)){return false}if(a.i==a.h){return false}a.h=a.i;return true}
function Ck(){switch(Bk){case 1:case 4:return new Dh;case 2:case 5:return new _h;}return new Mh}
function Dk(){switch(Bk){case 1:case 4:return new Yk;case 2:case 5:return new al;}return new Uk}
function pb(a,b){if(a==null||b==null){throw new Il('No nulls permitted')}return Ug(a,b)}
function Ib(a,b){var c,d,e;e=am(a,qm(32),b);d=am(a,qm(62),b);c=e<d&&e!=-1?e:d;return hm(a,b,c)}
function Nb(a,b){var c,d;d=em(b,'&#39;',"'");a.b=new Om(d);c=true;while(c){c=Pb(a)}return a.b.b.b}
function sb(a){var b,c,d;d=new ro;for(c=new fo(a);c.b<c.c.M();){b=wi(eo(c),27);lo(d,b)}return d}
function vl(a,b,c,d){var e;e=new ul;e.e=a+b;Bl(c!=0?-c:0)&&Cl(c!=0?-c:0,e);e.c=4;e.b=d;return e}
function lo(a,b){var c,d;c=b.N();d=c.length;if(d==0){return false}zo(a.b,a.c,0,c);a.c+=d;return true}
function Cf(a){if(!xe(a,Af)){return false}if(!le(a,zf)){return false}Ce(a,a.i+zf.length);return true}
function yf(a){if(!xe(a,wf)){return false}a.i+=2;if(!le(a,vf)){return false}Ce(a,a.i+2);return true}
function Gk(a){var b;if(yi(a,14)){b=wi(a,14);if(b.c!==(Mg(),Lg)){return b.c===Lg?null:b.c}}return a}
function Fk(b){var c=b.__gwt$exception;if(!c){c=new Og(b);try{b.__gwt$exception=c}catch(a){}}return c}
function fh(c){return function(){try{return gh(c,this,arguments);var b}catch(a){throw a}}}
function Eb(a,b,c){if(a.b.b.length>0&&a.b.b.charCodeAt(0)==b){ei(a.b,0,1,cq);return c}else{return 0}}
function Db(a,b,c){var d;d=0;while(a.b.b.length>0&&a.b.b.charCodeAt(0)==b){ei(a.b,0,1,cq);d+=c}return d}
function ye(a,b,c){var d,e,f;for(e=0,f=c.length;e<f;++e){d=c[e];if(we(a,b,d)){return true}}return false}
function Ac(a){var b,c;b=new fo(a.b);while(b.b<b.c.M()){c=wi(eo(b),12);if(Bc(c)){return false}}return true}
function pc(a,b){var c;c=new vp(ac,b);c.f=Ok(c.c,c.b);if(!!c.f&&a.b){return $(),new ob(iq+c.f[1])}return $(),Z}
function sc(a,b){var c,d;c=a.b>1?' start="'+a.b+jq:cq;d=a.c;return hq+d.b+c+d.c+'><li'+b.o(cq)+kq}
function O(a,b){var c;c=Wb(b,wi(a.c.b,1));return R(c.c.b,sb(new Do(ni(vk,Lp,0,[wi(a.b.b,27),wi(c.b.b,27)]))))}
function Cd(){Cd=Hp;Ad=ni(uk,Lp,13,[new Wf,new jg,new ag,new Qf]);Bd=ni(uk,Lp,13,[new Wf,new tg,new Qf])}
function ig(){ig=Hp;Kf();fe();hg=new jf(false);Ke();fg=new Td;gg=new He(Aq);eg=new ud('<lsovwxp')}
function pf(){pf=Hp;lf=im('<meta');mf=im('name=');of=im('ProgId');kf=im('Generator');nf=im('Originator')}
function fl(a,b,c){c&&(a=a.replace(new RegExp('\\.\\*',Vq),'[\\s\\S]*'));return new RegExp(a,b)}
function De(a){var b,c;for(c=a.i;c<a.k;c++){b=a.f[c];if(b!=32&&b!=9&&b!=13&&b!=10){a.i=c;return true}}return false}
function te(a,b){var c;c=b;for(;c>=0;c--){if(a.f[c]==62){return false}if(a.f[c]==60){a.i=c;return true}}return false}
function sl(a){if(a>=48&&a<58){return a-48}if(a>=97&&a<97){return a-97+10}if(a>=65&&a<65){return a-65+10}return -1}
function ym(a){wm();var b=Gq+a;var c=vm[b];if(c!=null){return c}c=tm[b];c==null&&(c=xm(a));zm();return vm[b]=c}
function hn(e,a){var b=e.f;for(var c in b){if(c.charCodeAt(0)==58){var d=new Qn(e,c.substring(1));a.J(d)}}}
function mc(a,b){var c;if(Ac(b)){oi(a.b,a.c++,b)}else{c=new fo(b.b);while(c.b<c.c.M()){ko(a,new md(wi(eo(c),12).b))}}}
function Xe(a,b){var c;c=0;while(a.length>b+c&&null!=String.fromCharCode(a[b+c]).match(/[A-Z\d]/i)){++c}return c}
function Gg(a){var b,c,d;c=mi(wk,Lp,25,a.length,0);for(d=0,b=a.length;d<b;++d){if(!a[d]){throw new Pl}c[d]=a[d]}}
function ud(a){var b;this.b=mi(yk,Op,-1,256,2);for(b=0;b<a.length;b++){a.charCodeAt(b)<256&&(this.b[a.charCodeAt(b)]=true)}}
function Ee(a){this.j=ni(zk,Pp,2,[]);this.f=mi(sk,Qp,-1,a.length,1);$l(a,a.length,this.f,0);this.k=a.length;this.h=this.i=0}
function gwtOnLoad(b,c,d,e){$moduleName=c;$moduleBase=d;Bk=e;if(b)try{$p(Ek)()}catch(a){b(c)}else{$p(Ek)()}}
function yp(a,b){var c,d;this.b=(c=false,d=cq,(b&1)!=0&&(d+='m'),(b&2)!=0&&(d+=uq),(b&32)!=0&&(c=true),fl(a,d,c))}
function qo(a,b){var c;b.length<a.c&&(b=ki(b,a.c));for(c=0;c<a.c;++c){oi(b,c,a.b[c])}b.length>a.c&&oi(b,a.c,null);return b}
function xe(a,b){var c,d;c=b.length-1;if((d=a.i+c)>=a.k){return false}do{if(b[c--]!=a.f[d--]){return false}}while(c>=0);return true}
function Rh(a,b){var c;c=Lh(a,b);if(c.length==0){return (new Dh).D(b)}else{c[0].indexOf('anonymous@@')==0&&(c=zh(c,1));return c}}
function yc(a,b,c){var d,e,f;if(c==null||!a.b)return b;d=new vp(ic,b);e=(f=Qk(el(d.e)),Pk(f,d.b,'<$1 $2 style="'+c+'">'));return e}
function Cc(a){var b,c;b=new Dm;c=new vp(Zb,a);while(c.f=Ok(c.c,c.b),!!c.f){rp(c,b,mq)}Cm(b,gm(c.b,c.d));return b.b.b}
function rc(a,b){var c,d,e;e=new vp(bc,b);e.f=Ok(e.c,e.b);if(e.f){d=tp(e,e.f[1]==null?2:1);c=Ml(d);return c==0?1:c}else{return a}}
function Fb(a,b,c,d){if(a.b.b.length>1&&a.b.b.charCodeAt(0)==b&&a.b.b.charCodeAt(1)==c){ei(a.b,0,2,cq);return d}else{return 0}}
function qe(a,b,c){var d,e,f,g;for(g=a.i;g<c;g++){for(e=0,f=b.length;e<f;++e){d=b[e];if(d==a.f[g]){a.i=g;return true}}}return false}
function nn(h,a,b){var c=h.b[b];if(c){for(var d=0,e=c.length;d<e;++d){var f=c[d];var g=f.S();if(h.P(a,g)){return true}}}return false}
function ln(h,a,b){var c=h.b[b];if(c){for(var d=0,e=c.length;d<e;++d){var f=c[d];var g=f.S();if(h.P(a,g)){return f.T()}}}return null}
function gn(h,a){var b=h.b;for(var c in b){var d=parseInt(c,10);if(c==d){var e=b[d];for(var f=0,g=e.length;f<g;++f){a.J(e[f])}}}}
function Lh(a,b){var c,d,e,f;e=zi(b)?xi(b):null;f=e&&e.stack?e.stack.split('\n'):[];for(c=0,d=f.length;c<d;c++){f[c]=a.B(f[c])}return f}
function sg(){sg=Hp;Kf();Bf();rg=new jf(true);Ke();og=new Wd;pg=new He('class');qg=new He(Aq);ng=new ud('<lscovwxp')}
function eh(){var a;if(Zg!=0){a=(new Date).getTime();if(a-_g>2000){_g=a;ah=nh()}}if(Zg++==0){rh((qh(),ph));return true}return false}
function Rc(a,b){var c;if(b.c==(hd(),_c)||b.c==fd){if(sp(new vp(Nc,a))||sp(new vp(Jc,a))){c=Bb(a);if(c==b.b+1){return true}}}return false}
function ne(a,b,c,d){var e,f,g;g=a.k-d+1;for(f=a.i;f<g;f++){for(e=0;e<d;e++){if(b[c+e]!=a.f[f+e]){break}}if(e==d){a.i=f;return true}}return false}
function me(a,b,c){var d,e,f,g;d=b.length;g=c-b.length+1;for(f=a.i;f<g;f++){for(e=0;e<d;e++){if(b[e]!=a.f[f+e]){break}}if(e==d){a.i=f;return true}}return false}
function we(a,b,c){var d,e;e=b;d=c.length-1;if((e+=d)>=a.k){return false}do{if(c[d--]!=a.f[e--]){return false}}while(d>=0);return true}
function Te(a){if(!xe(a,Re)){return false}ze(a,Re.length);if(!le(a,Qe)){return false}ze(a,Qe.length);if(!le(a,Pe)){return false}Ce(a,a.i+Pe.length);return true}
function uf(a,b){if(!xe(a,sf)){return false}if(!se(a)){return false}if(!we(a,a.m,rf)){return false}if(!re(a)){return false}Ce(a,a.b);zg(b);return true}
function Sd(a,b,c){var d;if(!xe(b,Qd)){return false}d=b.h;if(!te(b,d)){return false}b.i=d;return re(b)&&Nd(a,b,c,d,b.e,b.d,b.b)}
function Pb(a){var b,c,d,e;c=a.b.b.b.indexOf('mso-number-format:');if(c<0){return false}d=c+18;b=Ob(a,d);e=d-18;e>-1&&Km(a.b,e,b);return true}
function mm(a){var b;b=0;while(0<=(b=a.indexOf('\\',b))){a.charCodeAt(b+1)==36?(a=hm(a,0,b)+'$'+gm(a,++b)):(a=hm(a,0,b)+gm(a,++b))}return a}
function nm(a,b,c){var d=cq;for(var e=b;e<c;){var f=Math.min(e+10000,c);d+=String.fromCharCode.apply(null,a.slice(e,f));e=f}return d}
function Vn(a,b){var c,d;for(c=0,d=a.b.length;c<d;++c){if(b==null?(Yn(c,a.b.length),a.b[c])==null:Ug(b,(Yn(c,a.b.length),a.b[c]))){return c}}return -1}
function jm(c){if(c.length==0||c[0]>iq&&c[c.length-1]>iq){return c}var a=c.replace(/^([\u0000-\u0020]*)/,cq);var b=a.replace(/[\u0000-\u0020]*$/,cq);return b}
function li(a,b){var c=new Array(b);if(a==3){for(var d=0;d<b;++d){c[d]={l:0,m:0,h:0}}}else if(a>0&&a<3){var e=a==1?0:false;for(var d=0;d<b;++d){c[d]=e}}return c}
function dm(d,a,b){var c;if(a<256){c=Nl(a);c='\\x'+'00'.substring(c.length)+c}else{c=String.fromCharCode(a)}return d.replace(RegExp(c,Vq),String.fromCharCode(b))}
function Cl(a,b){var c;b.d=a;if(a==2){c=String.prototype}else{if(a>0){var d=Al(b);if(d){c=d.prototype}else{d=Jk[a]=function(){};d.cZ=b;return}}else{return}}c.cZ=b}
function qm(a){var b,c;if(a>=65536){b=55296+(~~(a-65536)>>10&1023)&65535;c=56320+(a-65536&1023)&65535;return pm(b)+pm(c)}else{return String.fromCharCode(a&65535)}}
function Cp(a){var b,c,d,e,f;f=fm(a,'\\.',0);e=$wnd;b=0;for(c=f.length-1;b<c;b++){if(!Zl(f[b],'client')){e[f[b]]||(e[f[b]]={});e=Ep(e,f[b])}}d=Ep(e,f[b]);return d}
function Ob(a,b){var c,d,e,f,g,h;e=b;f=b-18>-1;d=false;g=0;while(f){c=Jm(a.b,e);c==34&&g!=92&&(d=!d);(h=c==59&&!d,e==a.b.b.b.length-1||h)&&(f=false);++e;g=c}return e}
function Ve(){Ve=Hp;Ue=new Id(ni(xk,Lp,1,['font','span','b',uq,'u','sub','sup','em','strong','samp','acronym','cite','code','dfn','kbd','tt','s','ins','del','var']))}
function Rl(){Rl=Hp;Ql=ni(sk,Qp,-1,[48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122])}
function gf(){gf=Hp;ef=im('<link');ff=im('rel=');cf=ni(zk,Pp,2,[im(vq),im(wq),im(xq),im(yq),im(zq)]);df=ni(zk,Pp,2,[im(vq),im(wq),im(xq),im(yq),im(zq),im('stylesheet')])}
function Nl(a){var b,c,d;b=mi(sk,Qp,-1,8,1);c=(Rl(),Ql);d=7;if(a>=0){while(a>15){b[d--]=c[a&15];a>>=4}}else{while(d>0){b[d--]=c[a&15];a>>=4}}b[d]=c[a&15];return nm(b,d,8)}
function Xm(a){var b,c,d,e;d=new Dm;b=null;di(d.b,Jq);c=a.L();while(c.Q()){b!=null?(di(d.b,b),d):(b=Xq);e=c.R();di(d.b,e===a?'(this Collection)':cq+e)}di(d.b,Kq);return d.b.b}
function Sb(a,b){var c,d,e;d='Content before importing MS-Word lists:\r\n'+b;e=tc(a.b,b);c='Content after importing MS-Word lists:\r\n'+e;return R(e,new Do(ni(xk,Lp,1,[d,c])))}
function xc(a,b,c,d){var e,f,g,h;f=new vp(b,c);f.f=Ok(f.c,f.b);if(f.f){e=f.f[1];h=f.f[2];g=Pk(f.c,f.b,hq+d+e+"><li style='list-style: none;'><"+d+h+kq);return Ec(a,g)}return c}
function Hf(a,b){var c,d;if(!xe(a,Ff)){return false}if(!le(a,Ef)){return false}c=a.i+Ef.length;if(!le(a,Df)){return false}d=a.i;yg(b,a.f,c,d-c);Ce(a,a.i+Df.length);return true}
function Ge(a,b,c){if(!xe(b,a.b)){return false}if(!te(b,b.h)){return false}if(!ve(b,b.h-1)){return false}b.i=b.h+a.b.length-1;if(!re(b)){return false}zg(c);b.h=b.i=b.b;return true}
function hf(a,b){if(!xe(b,ef)){return false}Be(b,b.h+ef.length);if(!se(b)){return false}if(!me(b,ff,b.l)){return false}if(!re(b)){return false}if(!ye(b,b.e,a.b)){return false}Ce(b,b.l+1);return true}
function Dd(a,b){Cd();var c,d,e,f,g;c=new Ee(a);e=new Ag(a.length);g=b==1?Bd:Ad;d=g.length-1;for(f=0;f<d;f++){Ed(c,e,g[f]);Fd(c,e)}while(Ed(c,e,g[d])){Fd(c,e)}return sm(e.b,e.c)}
function Ng(a){var b;if(a.d==null){b=a.c===Lg?null:a.c;a.e=b==null?Cq:zi(b)?Qg(xi(b)):yi(b,1)?Dq:Vg(b).e;a.b=a.b+Bq+(zi(b)?Pg(xi(b)):b+cq);a.d=Eq+a.e+') '+(zi(b)?xh(xi(b)):cq)+a.b}}
function vc(a,b){var c,d,e;e=new Mm;for(c=0;c<a;c++){d=wi(mp(b.b),7).c;di(e.b,'<\/');Im(e,d.b);e.b.b+=kq;(b.b.b.c==0?(Oc(),Mc):wi(lp(b.b),7))!=(Oc(),Mc)&&(di(e.b,lq),e)}return e.b.b}
function Bh(b){var c=cq;try{for(var d in b){if(d!='name'&&d!='message'&&d!='toString'){try{var e=d!='__gwt$exception'?b[d]:'<skipped>';c+='\n '+d+Bq+e}catch(a){}}}}catch(a){}return c}
function Nk(a){return $stats({moduleName:$moduleName,sessionId:$sessionId,subSystem:'startup',evtGroup:'moduleStartup',millis:(new Date).getTime(),type:'onModuleLoadStart',className:a})}
function wh(a){var b,c,d;d=cq;a=jm(a);b=a.indexOf(Eq);c=a.indexOf('function')==0?8:0;if(b==-1){b=_l(a,qm(64));c=a.indexOf('function ')==0?9:0}b!=-1&&(d=jm(hm(a,c,b)));return d.length>0?d:Fq}
function tc(a,b){var c,d,e;c=(d=new vp(new yp('<\/?u[0-9]:p>',33),b),Pk(d.c,d.b,cq));c=uc(a,c);c=up(new vp(hc,c));c=(e=new vp(new yp('style *?=[\'"](;?)[\'"]',32),c),Pk(e.c,e.b,cq));return c}
function vh(b,c){var d,e,f,g;for(e=0,f=b.length;e<f;e++){g=b[e];try{g[1]?g[0].X()&&(c=uh(c,g)):g[0].X()}catch(a){a=Hk(a);if(yi(a,26)){d=a;kh(yi(d,14)?wi(d,14).v():d)}else throw Gk(a)}}return c}
function Dc(a){var b,c,d,e,f,g;e=a;if(a.indexOf(dq)==0){c=a.indexOf(fq);if(c>0){d=_l(a,qm(62))+1;b=hm(a,d,c);g=new xp('^(?:&nbsp;|\\s)*$');f=new vp(g,b);f.f=Ok(f.c,f.b);!!f.f&&(e=gm(a,c+7))}}return e}
function Fc(a,b,c,d,e,f){var g,h,i;i=b;h=new Mm;if(b>=c){di(h.b,lq);Im(h,vc(b-c,a))}g=a.b.b.c==0?(Oc(),Mc):wi(lp(a.b),7);if(b==c&&g.c!=e.c){Im(h,vc(b,a));i=0}Im(h,wc(e,c-i,a,f));di(h.b,d);return h.b.b}
function xm(a){var b,c,d,e;b=0;d=a.length;e=d-4;c=0;while(c<e){b=a.charCodeAt(c+3)+31*(a.charCodeAt(c+2)+31*(a.charCodeAt(c+1)+31*(a.charCodeAt(c)+31*b)))|0;c+=4}while(c<d){b=b*31+Yl(a,c++)}return b|0}
function qn(j,a,b,c){var d=j.b[c];if(d){for(var e=0,f=d.length;e<f;++e){var g=d[e];var h=g.S();if(j.P(a,h)){var i=g.T();g.U(b);return i}}}else{d=j.b[c]=[]}var g=new Wo(a,b);d.push(g);++j.e;return null}
function Jb(a){var b,c,d,e;c=new xp('(class=)([^>[ \\t\\n\\x0B\\f\\r]]*)');b=new vp(c,a);e=new Dm;while(b.f=Ok(b.c,b.b),!!b.f){d=b.f[2];d=d.toLowerCase();rp(b,e,b.f[1]+d)}Cm(e,gm(b.b,b.d));return e.b.b}
function oi(a,b,c){if(c!=null){if(a.qI>0&&!vi(c,a.qI)){throw new il}else if(a.qI==-1&&(c.tM==Hp||ui(c,1))){throw new il}else if(a.qI<-1&&!(c.tM!=Hp&&!ui(c,1))&&!vi(c,-a.qI)){throw new il}}return a[b]=c}
function Le(a,b){var c,d;c=a.f;d=a.h;if(c[d+1]!=58){return false}if(!td(Ie,c[d])){return false}if(!td(Je,c[d-1])){return false}if(!se(a)){return false}if(!re(a)){return false}Ce(a,a.b);zg(b);return true}
function Oc(){Oc=Hp;Ic=new xp('([\xB7\xA7\u2022\u2043\u25A1o-]|\xD8|&middot;|<img[^>]*>)');Nc=new xp('[A-Z]+');Jc=new xp('[a-z]+');Lc=new xp('X?(?:IX|IV|V?I{0,3})');Kc=new xp('x?(?:ix|iv|v?i{0,3})');Mc=new Pc}
function wc(a,b,c,d){var e,f;if(b>0){for(e=0;e<b;e++){np(c.b,a)}return I(sc(a,d),b)}else{if(Zl(a.c.b,(c.b.b.c==0?(Oc(),Mc):wi(lp(c.b),7)).c.b)){return '<li'+d.o(cq)+kq}else{f=vc(1,c)+sc(a,d);np(c.b,a);return f}}}
function Kk(a,b,c){var d=Jk[a];if(d&&!d.cZ){_=d.prototype}else{!d&&(d=Jk[a]=function(){});_=d.prototype=b<0?{}:Lk(b);_.cM=c}for(var e=3;e<arguments.length;++e){arguments[e].prototype=_}if(d.cZ){_.cZ=d.cZ;d.cZ=null}}
function se(a){for(a.m=a.i;a.m>=0;a.m--){if(a.f[a.m]==62){return false}if(a.f[a.m]==60){break}}if(a.m<0){return false}for(a.l=a.i;a.l<a.k;a.l++){if(a.f[a.l]==60){return false}if(a.f[a.l]==62){return true}}return false}
function Bb(a){var b,c,d,e,f;f=a.toLowerCase();if(f.length==0){return 1}else if(f.length==1){c=f.charCodeAt(0);e=c+1-97}else{e=0;for(d=0;d<f.length;d++){c=Yl(f,f.length-1-d);b=Bb(String.fromCharCode(c))*Ci(Math.pow(26,d));e+=b}}return e}
function qf(a){var b,c;if(!xe(a,lf)){return false}if(!je(a,62)){return false}b=a.i;Be(a,a.h+lf.length);if(!me(a,mf,b)){return false}c=a.i+mf.length;a.f[c]==34&&++c;if(we(a,c,of)||we(a,c,kf)||we(a,c,nf)){a.h=a.i=b+1;return true}return false}
function Mf(a){var b,c;if((a.i>=a.k?0:a.f[a.i])!=64){return false}b=a.h;a.i+=1;c=a.f[b+1];if(!(null!=String.fromCharCode(c).match(/[A-Z]/i))&&c!=95){return false}if(!je(a,123)){return false}if(!je(a,125)){return false}Ce(a,a.i+1);return true}
function ae(a,b,c){var d,e,f,g;e=c;a.i=b;if(!ke(a,46,c)){return}do{a.i+=1}while(ke(a,46,c));d=a.i;qe(a,Zd,c)&&(e=a.i);if(e==d){return}f=a.j;g=f.length;a.j=mi(zk,Pp,2,g+1,0);g!=0&&Sm(f,0,a.j,0,g);a.j[g]=mi(sk,Qp,-1,e-d,1);Sm(a.f,d,a.j[g],0,e-d)}
function Bc(a){var b,c,d,e,f,g,h;c=a.b;g=new vp(gc,c);g.f=Ok(g.c,g.b);if(g.f){f=g.f[2];h=new vp(dc,f);h.f=Ok(h.c,h.b);if(h.f){e=h.f[1];b=h.f[2];d=new vp(new xp('^\\d\\.'),e);d.f=Ok(d.c,d.b);if(!!d.f&&f.indexOf(e+b)!=-1){return true}}}return false}
function nc(a,b){var c,d,e,f,g;d=new vp(cc,a);e=b;d.f=Ok(d.c,d.b);if(d.f){f=d.f[1];if(Zl('First',f)){g=new vp(jc,a);g.f=Ok(g.c,g.b);!!g.f&&(e=(b==null?cq:b)+g.f[1]+gq)}else{c=new vp($b,a);c.f=Ok(c.c,c.b);!!c.f&&(e=(b==null?cq:b)+c.f[1]+gq)}}return e}
function Lb(b,c,d){var e,f,g;try{g=b?(Cd(),zd):1;e=Dd(d,g);e=Kb(e);b&&!c&&(e=Jb(e));return N(),N(),new W(new rb(e),M)}catch(a){a=Hk(a);if(yi(a,22)){f=a;return N(),R(cq,new Do(ni(xk,Lp,1,['Failed to clean MS Office HTML.\n'+f.u()])))}else throw Gk(a)}}
function he(a,b){var c,d,e,f,g;if(!xe(a,de)){return false}g=a.i;if(!le(a,ce)){return false}c=a.i+ce.length;d=b.c;yg(b,de,0,de.length);e=a.k;Ae(a,a.f,a.i);Ce(a,g+de.length);f=ge(a,b);Ae(a,a.f,e);if(f){yg(b,ce,0,ce.length);a.h=a.i=c}else{b.c=d;a.h=a.i=g}return f}
function Id(a){var b,c,d,e,f,g,h;this.b=mi(Ak,Lp,3,128,0);for(c=0,d=a.length;c<d;++c){b=a[c];g=im(b);e=g[0];e>=128&&(e=0);if(this.b[e]==null){this.b[e]=ni(zk,Pp,2,[g])}else{h=this.b[e];f=h.length;this.b[e]=mi(zk,Pp,2,f+1,0);Sm(h,0,this.b[e],0,f);this.b[e][f]=g}}}
function xd(a,b){var c,d,e,f;if(!yd(a,vd)){return false}d=a.i;c=a.h+vd.length;a.i=c;a.h=a.i=c;e=im('<img ');yg(b,e,0,e.length);f=im('o:title="');if(!me(a,f,d)){return true}yg(b,a.f,c,a.i-c);Be(a,a.i+f.length);if(!ke(a,34,d)){return true}Be(a,a.i+1);Ce(a,a.i);return true}
function zc(a){var b,c,d,e;e=new ro;d=null;for(c=0;c<a.c;c++){b=(Yn(c,a.c),wi(a.b[c],11));if(yi(b,9)){if(!sp(new vp(ec,wi(b,9).b))||c+1>=a.c||!yi((Yn(c+1,a.c),a.b[c+1]),12)||!d){if(d){mc(e,d);d=null}oi(e.b,e.c++,b)}}else{!d&&(d=new pd);od(d,wi(b,12))}}!!d&&mc(e,d);return e}
function Oe(a,b){var c,d;if(a.j.length==0){return false}if(!xe(a,Me)){return false}if(!se(a)){return false}if(!re(a)){return false}c=a.d-a.e;for(d=0;d<a.j.length;d++){if(a.j[d].length==c){if(we(a,a.e,a.j[d])){break}}}if(d==a.j.length){return false}Ce(a,a.b);zg(b);return true}
function ge(a,b){var c,d,e,f;d=false;f=32;c=a.i>=a.k?0:a.f[a.i];while(c!=0){e=false;switch(c){case 64:e=Mf(a);break;case 47:e=yf(a);}!e&&(f==10||f==13)&&(e=_d(ee,a,b));if(e){d=true;f=b.c==0?0:b.b[b.c-1];a.i=a.h;c=a.i>=a.k?0:a.f[a.i]}else{xg(b,f=c);c=(a.i=++a.h)>=a.k?0:a.f[a.i]}}return d}
function oc(a,b,c,d,e,f){var g,h,i,j,k;j=dm(jm(e),10,32);j.lastIndexOf(fq)!=-1&&j.lastIndexOf(fq)==j.length-fq.length&&(j=hm(j,0,j.length-7));while(j.indexOf(hq)==0){i=_l(j,qm(62));j=gm(j,i+1)}h=_l(j,qm(60));j=gm(j,h);j=Dc(j);g=new vp(_b,j);j=Pk(g.c,g.b,cq);k=new Qc('-',(Oc(),Mc));Im(c,Fc(a,b,d,j,k,f))}
function Sh(a,b){var c,d,e,f,g,h,i,j,k,l;l=mi(wk,Lp,25,b.length,0);for(f=0,g=l.length;f<g;f++){k=fm(b[f],Hq,0);i=-1;c=-1;e=Iq;if(k.length==2&&k[1]!=null){j=k[1];h=bm(j,qm(58));d=cm(j,qm(58),h-1);e=hm(j,0,d);if(h!=-1&&d!=-1){i=yh(hm(j,d+1,h));c=yh(gm(j,h+1))}}l[f]=new Vl(k[0],e+_p+c,a.G(i<0?-1:i))}Gg(l)}
function Ml(a){var b,c,d,e,f;if(a==null){throw new Tl(Cq)}d=a.length;e=d>0&&(a.charCodeAt(0)==45||a.charCodeAt(0)==43)?1:0;for(b=e;b<d;b++){if(sl(a.charCodeAt(b))==-1){throw new Tl(Wq+a+jq)}}f=parseInt(a,10);c=f<-2147483648;if(isNaN(f)){throw new Tl(Wq+a+jq)}else if(c||f>2147483647){throw new Tl(Wq+a+jq)}return f}
function af(a,b){var c,d,e,f;if(!xe(a,$e)){return false}f=a.h+$e.length;for(;f<a.k;f++){c=a.f[f];if(c==62){break}if(c!=32&&c!=10&&c!=9&&c!=13){return false}}e=a.i=f+1;if(!le(a,Ze)){return false}d=a.i;a.i=e;if(me(a,$e,d)){return false}Be(a,d+Ze.length);if(!je(a,62)){return false}yg(b,a.f,e,d-e);Ce(a,a.i+1);return true}
function Md(){Md=Hp;Ld=new Id(ni(xk,Lp,1,['font-color','horiz-align','language','list-image-','mso-','page:','separator-image','tab-stops','tab-interval','text-underline','text-effect','text-line-through','table-border-color-dark','table-border-color-light','vert-align','vnd.ms-excel.']));Kd=new Id(ni(xk,Lp,1,['mso-list']))}
function Ed(a,b,c){var d,e,f,g,h,i,j;j=a.k;e=a.f;a.h=a.i=0;f=32;d=c.s();h=0;i=0;g=false;while(i<j){for(;h<j;h++){f=e[h];if(f<256&&d[f]){break}}if(h>=j){Sm(e,i,b.b,b.c,j-i);b.c+=j-i;break}(f==10||f==13)&&++h;h!=i&&(Sm(e,i,b.b,b.c,h-i),b.c+=h-i);if(h==j){break}a.i=a.h=h;if(c.t(a,b,f)){g=true;i=h=a.i=a.h}else{i=h;f!=10&&f!=13&&++h}}return g}
function Nd(a,b,c,d,e,f,g){var h,i,j,k,l,m;l=d;m=e;k=c.c;b.i=e;i=false;j=false;while(m<f){if(!De(b)||b.i>=f){break}h=a.r(b);if(h){i=true;m!=l&&yg(c,b.f,l,m-l);if(ke(b,59,f)){l=m=b.i+=1}else{l=f;break}}else{j=true;if(ke(b,59,f)){m=b.i+=1}else{break}}}if(j&&!i){return false}if(j&&i){g!=l&&yg(c,b.f,l,g-l)}else{c.c=k;zg(c)}b.h=b.i=g;return true}
function hd(){hd=Hp;bd=new jd('NO_TYPE',cq,cq);ed=new jd('UNORDERED',oq,cq);dd=new jd('SQUARE',oq,' type="square"');$c=new jd('CIRCLE',oq,' type="circle"');cd=new jd('NUMERIC',nq,cq);gd=new jd('UPPER_ROMAN',nq,' type="I"');ad=new jd('LOWER_ROMAN',nq,' type="i"');fd=new jd('UPPER_ALPHA',nq,' type="A"');_c=new jd('LOWER_ALPHA',nq,' type="a"');Zc=ni(tk,Lp,8,[bd,ed,dd,$c,cd,gd,ad,fd,_c])}
function _d(a,b,c){var d,e,f,g,h,i,j,k,l;i=b.i;if(b.f[b.i+-1]!=10&&b.f[b.i+-1]!=13){return false}d=b.i>=b.k?0:b.f[b.i];if(d==123||d==125){return false}f=b.i;if(!pe(b,Yd)){return false}e=b.i;if((b.i>=b.k?0:b.f[b.i])!=123){if(!De(b)){return false}if((b.i>=b.k?0:b.f[b.i])!=123){return false}}l=b.i+1;if(!je(b,125)){return false}j=b.i;k=j+1;g=c.c;h=Nd(a,b,c,i,l,j,k);h&&c.c<=g&&ae(b,f,e);return h}
function We(a){var b,c,d,e,f,g;d=a.h+1;b=a.f[d];if(b>127){return false}g=Ue.b[b];if(g==null){return false}f=Xe(a.f,d);for(c=0;c<g.length;c++){if(we(a,d,g[c])&&f==g[c].length){break}}if(c==g.length){return false}e=g[c];a.i=d+e.length;if(!je(a,62)){return false}d=a.i+1;if(a.f[d++]!=60||a.f[d++]!=47){return false}if(!we(a,d,e)){return false}a.i=d+e.length;if(!je(a,62)){return false}Ce(a,a.i+1);return true}
function Lf(a,b){var c,d,e,f,g,h;f=a.h;if(a.f[f+2]!=58||a.f[f]!=60){return false}if(!td(Jf,a.f[f+1])){return false}h=f+1;a.i=f+3;if(!oe(a,If)){return false}g=a.i-h;if(!je(a,62)){return false}if(ue(a,a.i-1)==47){Ce(a,a.i+1);return true}e=a.i+1;while(ne(a,a.f,h,g)){d=a.i-1;c=a.f[d];if(c==60){return false}if(c==47&&ue(a,--d)==60){if(!je(a,62)){return false}yg(b,a.f,e,d-e);Ce(a,a.i+1);return true}++a.i}return false}
function fm(l,a,b){var c=new RegExp(a,Vq);var d=[];var e=0;var f=l;var g=null;while(true){var h=c.exec(f);if(h==null||f==cq||e==b-1&&b>0){d[e]=f;break}else{d[e]=f.substring(0,h.index);f=f.substring(h.index+h[0].length,f.length);c.lastIndex=0;if(g==f){d[e]=f.substring(0,1);f=f.substring(1)}g=f;e++}}if(b==0&&l.length>0){var i=d.length;while(i>0&&d[i-1]==cq){--i}i<d.length&&d.splice(i,d.length-i)}var j=lm(d.length);for(var k=0;k<d.length;++k){j[k]=d[k]}return j}
function re(a){var b,c;for(b=a.i;b<a.k;b++){if(a.f[b]==62){return false}if(a.f[b]==61){break}}if(b==a.k){return false}a.c=++b;c=a.f[b];if(c==34||c==39){a.e=++b;for(;b<a.k;b++){if(a.f[b]==62){return false}if(a.f[b]==c){break}}if(b==a.k){return false}a.d=b;a.b=b+1;a.i=a.e;return true}else{a.e=a.c;for(;b<a.k;b++){if(a.f[b]==62){break}if(a.f[b]==32){break}if(a.f[b]==9){break}if(a.f[b]==13){break}if(a.f[b]==10){break}}if(b==a.k){return false}a.d=a.b=b;return true}}
function Gb(b){var c,d,e,f,g,h,i;d=0;c=new Em(b.toLowerCase());e=false;try{d=(f=(g=0,g+=Cb(c,109,1000),g+=Fb(c,99,109,900),g+=Eb(c,100,500),g+=Fb(c,99,100,400),g),f=(h=f,h+=Cb(c,99,100),h+=Fb(c,120,99,90),h+=Eb(c,108,50),h+=Fb(c,120,108,40),h),f=(i=f,i+=Cb(c,120,10),i+=Fb(c,105,120,9),i+=Eb(c,118,5),i+=Fb(c,105,118,4),i),f+=Cb(c,105,1),f)}catch(a){a=Hk(a);if(yi(a,23)){e=true}else throw Gk(a)}if(e||c.b.b.length>0){throw new Il(b+' is not a parsable roman numeral')}return d}
function Kb(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o;b=new Om(a);j=b.b.b.length;while(j>-1){j=cm(b.b.b,'<p',j);c=am(b.b.b,'<\/p>',j);if(j>-1&&c>-1){k=hm(b.b.b,j,c);o=k.indexOf(dq);if(o>-1){i=_l(k,qm(62));if(i+1==o){n=am(k,qm(62),o);f=hm(k,o,n+1);m=f.indexOf(eq);if(m>-1){d=k.lastIndexOf(fq);if(7+d==k.length){e=hm(k,0,_l(k,qm(62))+1);h=e.indexOf(eq);if(h>-1){g=Ib(e,h);l=Ib(f,m);if(!Zl(g,l)){Km(b,d+j,k.length+j);Km(b,o+j,o+f.length+j);Lm(b,h+j,h+g.length+j,l)}}}}}}}--j}return b.b.b}
function Ek(){var a,b,c;Mk()&&Nk('com.google.gwt.useragent.client.UserAgentAsserter');a=wi(Dk(),16);b=a.H();c=a.I();Zl(b,c)||($wnd.alert('ERROR: Possible problem with your *.gwt.xml module file.\nThe compile time user.agent value ('+b+') does not match the runtime user.agent value ('+c+'). Expect more errors.\n'),undefined);Mk()&&Nk('com.google.gwt.user.client.DocumentModeAsserter');Sk();Mk()&&Nk('com.ephox.keurig.client.Keurig');Gp();new zb;$wnd.gwtInited&&$wnd.gwtInited()}
function Sm(a,b,c,d,e){var f,g,h,i,j,k,l,m,n;if(a==null||c==null){throw new Pl}m=Vg(a);i=Vg(c);if((m.c&4)==0||(i.c&4)==0){throw new jl('Must be array types')}l=m.b;g=i.b;if(!((l.c&1)!=0?l==g:(g.c&1)==0)){throw new jl('Array types must match')}n=a.length;j=c.length;if(b<0||d<0||e<0||b+e>n||d+e>j){throw new Kl}if(((l.c&1)==0||(l.c&4)!=0)&&m!=i){k=wi(a,24);f=wi(c,24);if(Bi(a)===Bi(c)&&b<d){b+=e;for(h=d+e;h-->d;){oi(f,h,k[--b])}}else{for(h=d+e;d<h;){oi(f,d++,k[b++])}}}else{Array.prototype.splice.apply(c,[d,e].concat(a.slice(b,b+e)))}}
function uc(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,q,r,s,t,u,v,w,A;g=qc(b);A=zc(g);u=new Tc;w=new Mm;r=null;for(f=new fo(A);f.b<f.c.M();){e=wi(eo(f),11);if(yi(e,9)){Im(w,wi(e,9).b)}else{i=new fo(wi(e,10).b);k=0;l=new Mm;j=(Oc(),Mc);while(i.b<i.c.M()){t=wi(eo(i),12);s=new vp(gc,t.b);s.f=Ok(s.c,s.b);if(s.f){c=s.f[1];r=nc(c,r);n=rc(k,c);h=pc(a,c);v=s.f[2];o=new vp(dc,v);o.f=Ok(o.c,o.b);if(o.f){d=o.f[1];m=Cc(o.f[2]);q=new Qc(d,j);j=q;Im(l,Fc(u,k,n,m,q,h))}else{oc(u,k,l,n,v,h)}k=n}}di(l.b,lq);Im(l,vc(k,u));Im(w,yc(a,Ec(a,l.b.b),r))}}return w.b.b}
function qc(a){var b,c,d,e,f,g,h,i,j;e=new ro;h=new vp(gc,a);f=0;while(h.f=Ok(h.c,h.b),!!h.f){j=h.f[1];b=new vp(bc,j);b.f=Ok(b.c,b.b);if(b.f){i=!h.f||h.f.length<1?-1:h.f.index;if(i>f){d=new md(hm(a,f,i));oi(e.b,e.c++,d)}g=new rd(hm(a,!h.f||h.f.length<1?-1:h.f.index,!h.f||h.f.length<1?-1:h.f.index+h.f[0].length));oi(e.b,e.c++,g)}else{c=(!h.f||h.f.length<1?-1:h.f.index)>f?f:!h.f||h.f.length<1?-1:h.f.index;d=new md(hm(a,c,!h.f||h.f.length<1?-1:h.f.index+h.f[0].length));oi(e.b,e.c++,d)}f=!h.f||h.f.length<1?-1:h.f.index+h.f[0].length}if(f<a.length){d=new md(gm(a,f));oi(e.b,e.c++,d)}return e}
function yb(h){var e=(Gp(),Cp('com.ephox.keurig.WordCleaner'));var f,g=h;$wnd.com.ephox.keurig.WordCleaner=$p(function(){var a,b=this,c=arguments;c.length==1&&g.q(c[0])?(a=c[0]):c.length==0&&(a=new ub);b.g=a;a['__gwtex_wrap']=b;return b});f=$wnd.com.ephox.keurig.WordCleaner.prototype=new Object;$wnd.com.ephox.keurig.WordCleaner.cleanDocument=$p(function(a,b){var c,d;return c=new Ub(a,b),d=Tb(c,c.d,c.e,c.c),wi(d.c.b,1)});$wnd.com.ephox.keurig.WordCleaner.yury=$p(function(a,b){var c;return c=b?(Cd(),zd):1,Dd(a,c)});if(e)for(p in e)$wnd.com.ephox.keurig.WordCleaner[p]===undefined&&($wnd.com.ephox.keurig.WordCleaner[p]=e[p])}
function Qc(a,b){Oc();var c,d,e,f,g,h;f=new vp(Ic,a);f.f=Ok(f.c,f.b);if(f.f){g=f.f[1];this.c=Zl(g,'\xA7')?(hd(),dd):Zl(g,'o')?(hd(),$c):(hd(),ed)}else{e=new vp(new xp('\\(?(\\d+|[a-zA-Z]+)(?:\\)|\\.)?'),a);e.f=Ok(e.c,e.b);if(e.f){c=e.f[1];if(Rc(c,b)){this.c=sp(new vp(Nc,c))?(hd(),fd):(hd(),_c);this.b=Bb(c)}else{d=new vp(Kc,c);d.f=Ok(d.c,d.b);if(!!d.f&&d.f[0].length!=0){this.c=(hd(),ad);this.b=Gb(c)}else{h=new vp(Lc,c);h.f=Ok(h.c,h.b);if(!!h.f&&h.f[0].length!=0){this.c=(hd(),gd);this.b=Gb(c)}else{if(sp(new vp(Jc,c))){this.c=(hd(),_c);this.b=Bb(c)}else if(sp(new vp(Nc,c))){this.c=(hd(),fd);this.b=Bb(c)}else{this.c=(hd(),cd);this.b=Ml(c)}}}}}else{this.c=(hd(),ed)}}}
function Sk(){var a,b,c;b=$doc.compatMode;a=ni(xk,Lp,1,[Lq]);for(c=0;c<a.length;c++){if(Zl(a[c],b)){return}}a.length==1&&Zl(Lq,a[0])&&Zl('BackCompat',b)?"GWT no longer supports Quirks Mode (document.compatMode=' BackCompat').<br>Make sure your application's host HTML page has a Standards Mode (document.compatMode=' CSS1Compat') doctype,<br>e.g. by using &lt;!doctype html&gt; at the start of your application's HTML page.<br><br>To continue using this unsupported rendering mode and risk layout problems, suppress this message by adding<br>the following line to your*.gwt.xml module file:<br>&nbsp;&nbsp;&lt;extend-configuration-property name=\"document.compatMode\" value=\""+b+'"/&gt;':"Your *.gwt.xml module configuration prohibits the use of the current doucment rendering mode (document.compatMode=' "+b+"').<br>Modify your application's host HTML page doctype, or update your custom 'document.compatMode' configuration property settings."}
function lc(){lc=Hp;hc=new yp('mso\\-list:.*?([;"\'])',32);bc=new yp('style=["\'].*?mso\\-list:(?:([0-9]+)|.*?level([0-9]+)).*?["\']',32);ac=new yp('(class=[^ ]*)',32);fc=new xp('<ol([^>]*)><li><ol([^>]*)>');kc=new xp('<ul([^>]*)><li><ul([^>]*)>');ic=new xp('<(ol|ul)([^>]*)>');dc=new yp('^[ \\t\\n\\x0B\\f\\r]*(?:<[^>]*>)*?(?:<span[^>]*>[ \\t\\n\\x0B\\f\\r]*){0,3}(?:&nbsp;|\\s)*(?:<\/span[^>]*>[ \\t\\n\\x0B\\f\\r]*)?([\xB7\xA7\u2022\u2043\u25A1o-]|\xD8|&middot;|<img[^>]*>|\\(?(?:\\d+|[a-zA-z]+)(?:\\)|\\.)?)(?:&nbsp;|\\s)*(?:<span[^>]*>[ \\t\\n\\x0B\\f\\r]*)?(?:&nbsp;|\\s)*(?:<\/span[^>]*>[ \\t\\n\\x0B\\f\\r]*){0,3}(.*?)$',32);gc=new yp('<p([^>]*)>(.*?)<\/p>[ \\t\\n\\x0B\\f\\r]*',32);ec=new xp('<p[^>]*>(?:<[^>]*>|[ \\t\\n\\x0B\\f\\r])*&nbsp;(?:<[^>]*>|[ \\t\\n\\x0B\\f\\r])*<\/p>');_b=new xp('^(?:<\/[^>]+>)*');Zb=new yp('<a\\sname="OLE_LINK\\d">(.*?)<\/a>',32);cc=new yp('class=MsoListParagraphCxSp(First|Last)',32);jc=new yp('style=.*?(margin-top:[^";]*)',32);$b=new yp('style=.*?(margin-bottom:[^";]*)',32)}
var cq='',iq=' ',jq='"',mq='$1',Eq='(',bq=')',Xq=', ',Gq=':',Bq=': ',gq=';',hq='<',lq='<\/li>',fq='<\/span>',qq='<\/style>',dq='<span',pq='<style',rq='=',kq='>',_p='@',Hq='@@',Lq='CSS1Compat',wq='Edit-Time-Data',vq='File-List',Wq='For input string: "',xq='Ole-Object-Data',yq='Original-File',zq='Preview',Dq='String',Iq='Unknown',Jq='[',$q='[Ljava.lang.',Kq=']',tq=']>',Fq='anonymous',fr='com.ephox.functional.data.immutable.',dr='com.ephox.keurig.client.',er='com.ephox.tord.guts.',hr='com.ephox.tord.lists.',jr='com.ephox.tord.lists.data.',gr='com.ephox.tord.wordhtmlfilter.',Zq='com.google.gwt.core.client.',ar='com.google.gwt.core.client.impl.',_q='com.google.gwt.useragent.client.',eq='dir=',Vq='g',Tq='gecko',Mq='gecko1_8',uq='i',Qq='ie10',Sq='ie8',Rq='ie9',Yq='java.lang.',cr='java.util.',ir='java.util.regex.',Aq='lang',Pq='msie',Cq='null',nq='ol',br='org.timepedia.exporter.client.',sq='ovwxp',Oq='safari',aq='someOrDie called on none',oq='ul',Uq='unknown',Nq='webkit';var _,Jk={},Qp={2:1,17:1},Yp={29:1},Pp={3:1,17:1,24:1},Np={5:1},Mp={4:1},Kp={},Lp={17:1,24:1},Tp={16:1},Zp={17:1,27:1},Rp={13:1},Op={17:1},Sp={17:1,22:1,26:1},Vp={19:1},Xp={30:1},Wp={28:1},Up={17:1,22:1,23:1,26:1};Kk(1,-1,Kp,C);_.eQ=function D(a){return this===a};_.gC=function F(){return this.cZ};_.hC=function G(){return ih(this)};_.tS=function H(){return this.cZ.e+_p+Nl(this.hC())};_.toString=function(){return this.tS()};_.tM=Hp;Kk(4,1,{});Kk(5,1,Mp);_.eQ=function P(a){return yi(a,4)&&U(this,wi(a,4))};_.hC=function Q(){return 42};_.tS=function S(){return 'value: '+this.c.b+', log: '+wi(this.b.b,27)};var L,M;Kk(8,5,Mp,W);Kk(9,1,Np);_.eQ=function ab(a){return yi(a,5)&&T(this,wi(a,5)).b};_.hC=function bb(){return 42};var Y,Z;Kk(10,9,Np,db);_.n=function eb(){return false};_.o=function fb(a){return a};_.p=function gb(a){throw new Kg(a)};_.tS=function hb(){return 'Optional.none()'};Kk(11,9,Np);_.n=function jb(){return true};_.o=function kb(a){return this.b};_.p=function lb(a){return this.b};_.tS=function mb(){return 'Optional.some('+this.b+bq};Kk(12,11,Np,ob);Kk(14,4,{},rb);Kk(17,1,{6:1},ub);Kk(18,1,{},zb);_.q=function Ab(a){return a!=null&&yi(a,6)};var wb=false;Kk(20,1,{});_.d=false;_.e=false;Kk(21,1,{},Qb);Kk(22,20,{},Ub);Kk(23,1,{},Xb);Kk(24,1,{},Gc);_.b=false;var Zb,$b,_b,ac,bc,cc,dc,ec,fc,gc,hc,ic,jc,kc;Kk(25,1,{7:1},Pc,Qc);_.b=0;var Ic,Jc,Kc,Lc,Mc,Nc;Kk(26,1,{},Tc);Kk(28,1,{17:1,20:1,21:1});_.eQ=function Wc(a){return this===a};_.hC=function Xc(){return ih(this)};_.tS=function Yc(){return this.d};Kk(27,28,{8:1,17:1,20:1,21:1},jd);var Zc,$c,_c,ad,bd,cd,dd,ed,fd,gd;Kk(29,1,{9:1,11:1},md);Kk(30,1,{10:1,11:1},pd);Kk(31,1,{11:1,12:1},rd);Kk(32,1,{},ud);var vd;var zd=0,Ad,Bd;Kk(35,1,{},Id);Kk(36,1,{});_.r=function Od(a){var b,c,d;c=a.i>=a.k?0:a.f[a.i];d=Hd(Kd,c);if(d!=null&&ye(a,a.i,d)){return false}b=Hd(Ld,c);return b!=null&&ye(a,a.i,b)};var Kd,Ld;Kk(37,36,{},Td);var Qd;Kk(38,37,{},Wd);_.r=function Vd(a){var b,c;b=a.i>=a.k?0:a.f[a.i];c=Hd((Md(),Kd),b);return c==null||!ye(a,a.i,c)};Kk(39,36,{},be);var Yd,Zd;var ce,de,ee;Kk(41,1,{},Ee);_.b=0;_.c=0;_.d=0;_.e=0;_.h=0;_.i=0;_.k=0;_.l=0;_.m=0;Kk(42,1,{},He);var Ie,Je;var Me;var Pe,Qe,Re;var Ue;var Ze,$e;Kk(49,1,{},jf);var cf,df,ef,ff;var kf,lf,mf,nf,of;var rf,sf;var vf,wf;var zf,Af;var Df,Ef,Ff;var If,Jf;Kk(57,1,Rp,Qf);_.s=function Rf(){return Of.b};_.t=function Sf(a,b,c){switch(c){case 60:if(We(a)){return true}a.i=a.h;if(af(a,b)){return true}a.i=a.h;return Lf(a,b);case 13:case 10:return Ye(a);}return false};var Of;Kk(58,1,Rp,Wf);_.s=function Xf(){return Uf.b};_.t=function Yf(a,b,c){switch(c){case 60:if(xd(a,b)){return true}a.i=a.h;if(Te(a)){return true}a.i=a.h;if(Hf(a,b)){return true}a.i=a.h;return qf(a);case 120:return uf(a,b);case 13:case 10:return Ye(a);}return false};var Uf;Kk(59,1,Rp,ag);_.s=function bg(){return $f.b};_.t=function cg(a,b,c){switch(c){case 60:if(We(a)){return true}a.i=a.h;if(af(a,b)){return true}a.i=a.h;return Lf(a,b);case 13:case 10:return Ye(a);case 99:return Oe(a,b);}return false};var $f;Kk(60,1,Rp,jg);_.s=function kg(){return eg.b};_.t=function lg(a,b,c){switch(c){case 60:if(Lf(a,b)){return true}a.i=a.h;if(he(a,b)){return true}a.i=a.h;if(hf(hg,a)){return true}a.i=a.h;return false;case 111:case 118:case 119:case 120:case 112:return Le(a,b);case 115:return Sd(fg,a,b);case 108:return Ge(gg,a,b);}return false};var eg,fg,gg,hg;Kk(61,1,Rp,tg);_.s=function ug(){return ng.b};_.t=function vg(a,b,c){switch(c){case 60:if(Lf(a,b)){return true}a.i=a.h;if(Cf(a)){return true}a.i=a.h;if(hf(rg,a)){return true}a.i=a.h;return false;case 115:return Sd(og,a,b);case 99:return Ge(pg,a,b);case 108:return Ge(qg,a,b);case 111:case 118:case 119:case 120:case 112:return Le(a,b);}return false};var ng,og,pg,qg,rg;Kk(62,1,{},Ag);_.tS=function Bg(){return sm(this.b,this.c)};_.c=0;Kk(68,1,{17:1,26:1});_.u=function Hg(){return this.f};_.tS=function Ig(){var a,b;a=this.cZ.e;b=this.u();return b!=null?a+Bq+b:a};Kk(67,68,Sp);Kk(66,67,Sp,Kg);Kk(65,66,{14:1,17:1,22:1,26:1},Og);_.u=function Rg(){Ng(this);return this.d};_.v=function Sg(){return this.c===Lg?null:this.c};var Lg;Kk(72,1,{});var Zg=0,$g=0,_g=0,ah=-1;Kk(74,72,{},th);var ph;Kk(77,1,{},Dh);_.w=function Eh(){var a={};var b=[];var c=arguments.callee.caller.caller;while(c){var d=this.B(c.toString());b.push(d);var e=Gq+d;var f=a[e];if(f){var g,h;for(g=0,h=f.length;g<h;g++){if(f[g]===c){return b}}}(f||(a[e]=[])).push(c);c=c.caller}return b};_.A=function Fh(a){var b,c,d,e;d=this.D(a.c===(Mg(),Lg)?null:a.c);e=mi(wk,Lp,25,d.length,0);for(b=0,c=e.length;b<c;b++){e[b]=new Vl(d[b],null,-1)}Gg(e)};_.B=function Gh(a){return wh(a)};_.C=function Hh(a){var b,c,d,e;d=Ck().w();e=mi(wk,Lp,25,d.length,0);for(b=0,c=e.length;b<c;b++){e[b]=new Vl(d[b],null,-1)}Gg(e)};_.D=function Ih(a){return []};Kk(79,77,{},Mh);_.w=function Nh(){return zh(this.D(Ch()),this.F())};_.D=function Oh(a){return Lh(this,a)};_.F=function Ph(){return 2};Kk(78,79,{});_.w=function Th(){var a;a=zh(Rh(this,Ch()),3);a.length==0&&(a=zh((new Dh).w(),1));return a};_.A=function Uh(a){var b;b=Rh(this,a.c===(Mg(),Lg)?null:a.c);Sh(this,b)};_.B=function Vh(a){var b,c,d,e;if(a.length==0){return Fq}e=jm(a);e.indexOf('at ')==0&&(e=gm(e,3));c=e.indexOf(Jq);c!=-1&&(e=jm(hm(e,0,c))+jm(gm(e,e.indexOf(Kq,c)+1)));c=e.indexOf(Eq);if(c==-1){c=e.indexOf(_p);if(c==-1){d=e;e=cq}else{d=jm(gm(e,c+1));e=jm(hm(e,0,c))}}else{b=e.indexOf(bq,c);d=hm(e,c+1,b);e=jm(hm(e,0,c))}c=_l(e,qm(46));c!=-1&&(e=gm(e,c+1));return (e.length>0?e:Fq)+Hq+d};_.C=function Wh(a){var b;b=Ck().w();Sh(this,b)};_.D=function Xh(a){return Rh(this,a)};_.G=function Yh(a){return a};_.F=function Zh(){return 3};Kk(80,78,{},_h);_.G=function ai(a){return -1};Kk(81,1,{});Kk(82,81,{},fi);_.b=cq;Kk(86,1,{},hi);_.qI=0;var pi,qi;var Bk=-1;Kk(100,1,Tp,Uk);_.H=function Vk(){return Mq};_.I=function Wk(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(Nq)!=-1}())return Oq;if(function(){return b.indexOf(Pq)!=-1&&$doc.documentMode>=10}())return Qq;if(function(){return b.indexOf(Pq)!=-1&&$doc.documentMode>=9}())return Rq;if(function(){return b.indexOf(Pq)!=-1&&$doc.documentMode>=8}())return Sq;if(function(){return b.indexOf(Tq)!=-1}())return Mq;return Uq};Kk(101,1,Tp,Yk);_.H=function Zk(){return Qq};_.I=function $k(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(Nq)!=-1}())return Oq;if(function(){return b.indexOf(Pq)!=-1&&$doc.documentMode>=10}())return Qq;if(function(){return b.indexOf(Pq)!=-1&&$doc.documentMode>=9}())return Rq;if(function(){return b.indexOf(Pq)!=-1&&$doc.documentMode>=8}())return Sq;if(function(){return b.indexOf(Tq)!=-1}())return Mq;return Uq};Kk(102,1,Tp,al);_.H=function bl(){return Oq};_.I=function cl(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(Nq)!=-1}())return Oq;if(function(){return b.indexOf(Pq)!=-1&&$doc.documentMode>=10}())return Qq;if(function(){return b.indexOf(Pq)!=-1&&$doc.documentMode>=9}())return Rq;if(function(){return b.indexOf(Pq)!=-1&&$doc.documentMode>=8}())return Sq;if(function(){return b.indexOf(Tq)!=-1}())return Mq;return Uq};Kk(103,1,{});_.tS=function gl(){return Xg(this.b)};Kk(104,66,Sp,il,jl);Kk(105,1,{17:1,18:1,20:1},ol);_.eQ=function pl(a){return yi(a,18)&&wi(a,18).b==this.b};_.hC=function ql(){return this.b?1231:1237};_.tS=function rl(){return this.b?'true':'false'};_.b=false;var ll,ml;Kk(107,1,{},ul);_.tS=function Dl(){return ((this.c&2)!=0?'interface ':(this.c&1)!=0?cq:'class ')+this.e};_.c=0;_.d=0;Kk(108,66,Sp,Fl);Kk(109,66,Up,Hl,Il);Kk(110,66,Sp,Kl,Ll);Kk(114,66,Sp,Pl);var Ql;Kk(116,109,Up,Tl);Kk(117,1,{17:1,25:1},Vl);_.tS=function Wl(){return this.b+'.'+this.e+Eq+(this.c!=null?this.c:'Unknown Source')+(this.d>=0?Gq+this.d:cq)+bq};_.d=0;_=String.prototype;_.cM={1:1,17:1,19:1,20:1};_.eQ=function om(a){return Zl(this,a)};_.hC=function rm(){return ym(this)};_.tS=_.toString;var tm,um=0,vm;Kk(119,1,Vp,Dm,Em);_.tS=function Fm(){return this.b.b};Kk(120,1,Vp,Mm,Nm,Om);_.tS=function Pm(){return this.b.b};Kk(121,110,Sp,Rm);Kk(123,66,Sp,Um);Kk(124,1,{});_.J=function Ym(a){throw new Um('Add not supported on this collection')};_.K=function Zm(a){var b;b=Wm(this.L(),a);return !!b};_.N=function $m(){return this.O(mi(vk,Lp,0,this.M(),0))};_.O=function _m(a){var b,c,d;d=this.M();a.length<d&&(a=ki(a,d));c=this.L();for(b=0;b<d;++b){oi(a,b,c.R())}a.length>d&&oi(a,d,null);return a};_.tS=function an(){return Xm(this)};Kk(126,1,Wp);_.eQ=function dn(a){var b,c,d,e,f;if(a===this){return true}if(!yi(a,28)){return false}e=wi(a,28);if(this.e!=e.e){return false}for(c=new Dn((new yn(e)).b);co(c.b);){b=wi(eo(c.b),29);d=b.S();f=b.T();if(!(d==null?this.d:yi(d,1)?on(this,wi(d,1)):nn(this,d,~~Wg(d)))){return false}if(!pp(f,d==null?this.c:yi(d,1)?mn(this,wi(d,1)):ln(this,d,~~Wg(d)))){return false}}return true};_.hC=function en(){var a,b,c;c=0;for(b=new Dn((new yn(this)).b);co(b.b);){a=wi(eo(b.b),29);c+=a.hC();c=~~c}return c};_.tS=function fn(){var a,b,c,d;d='{';a=false;for(c=new Dn((new yn(this)).b);co(c.b);){b=wi(eo(c.b),29);a?(d+=Xq):(a=true);d+=cq+b.S();d+=rq;d+=cq+b.T()}return d+'}'};Kk(125,126,Wp);_.P=function tn(a,b){return Bi(a)===Bi(b)||a!=null&&Ug(a,b)};_.d=false;_.e=0;Kk(128,124,Xp);_.eQ=function wn(a){var b,c,d;if(a===this){return true}if(!yi(a,30)){return false}c=wi(a,30);if(c.b.e!=this.M()){return false}for(b=new Dn(c.b);co(b.b);){d=wi(eo(b.b),29);if(!this.K(d)){return false}}return true};_.hC=function xn(){var a,b,c;a=0;for(b=this.L();b.Q();){c=b.R();if(c!=null){a+=Wg(c);a=~~a}}return a};Kk(127,128,Xp,yn);_.K=function zn(a){var b,c,d;if(yi(a,29)){b=wi(a,29);c=b.S();if(jn(this.b,c)){d=kn(this.b,c);return To(b.T(),d)}}return false};_.L=function An(){return new Dn(this.b)};_.M=function Bn(){return this.b.e};Kk(129,1,{},Dn);_.Q=function En(){return co(this.b)};_.R=function Fn(){return wi(eo(this.b),29)};Kk(131,1,Yp);_.eQ=function In(a){var b;if(yi(a,29)){b=wi(a,29);if(pp(this.S(),b.S())&&pp(this.T(),b.T())){return true}}return false};_.hC=function Jn(){var a,b;a=0;b=0;this.S()!=null&&(a=Wg(this.S()));this.T()!=null&&(b=Wg(this.T()));return a^b};_.tS=function Kn(){return this.S()+rq+this.T()};Kk(130,131,Yp,Ln);_.S=function Mn(){return null};_.T=function Nn(){return this.b.c};_.U=function On(a){return rn(this.b,a)};Kk(132,131,Yp,Qn);_.S=function Rn(){return this.b};_.T=function Sn(){return mn(this.c,this.b)};_.U=function Tn(a){return sn(this.c,this.b,a)};Kk(133,124,{27:1});_.V=function Wn(a,b){throw new Um('Add not supported on this list')};_.J=function Xn(a){this.V(this.M(),a);return true};_.eQ=function Zn(a){var b,c,d,e,f;if(a===this){return true}if(!yi(a,27)){return false}f=wi(a,27);if(this.M()!=f.M()){return false}d=this.L();e=f.L();while(d.b<d.c.M()){b=eo(d);c=eo(e);if(!(b==null?c==null:Ug(b,c))){return false}}return true};_.hC=function $n(){var a,b,c;b=1;a=this.L();while(a.b<a.c.M()){c=eo(a);b=31*b+(c==null?0:Wg(c));b=~~b}return b};_.L=function ao(){return new fo(this)};Kk(134,1,{},fo);_.Q=function go(){return co(this)};_.R=function ho(){return eo(this)};_.b=0;Kk(135,133,Zp,ro);_.V=function so(a,b){jo(this,a,b)};_.J=function to(a){return ko(this,a)};_.K=function uo(a){return no(this,a,0)!=-1};_.W=function vo(a){return mo(this,a)};_.M=function wo(){return this.c};_.N=function Ao(){return po(this)};_.O=function Bo(a){return qo(this,a)};_.c=0;Kk(136,133,Zp,Do);_.K=function Eo(a){return Vn(this,a)!=-1};_.W=function Fo(a){return Yn(a,this.b.length),this.b[a]};_.M=function Go(){return this.b.length};_.N=function Ho(){return ii(this.b)};_.O=function Io(a){var b,c;c=this.b.length;a.length<c&&(a=ki(a,c));for(b=0;b<c;++b){oi(a,b,this.b[b])}a.length>c&&oi(a,c,null);return a};var Jo;Kk(138,133,Zp,Mo);_.K=function No(a){return false};_.W=function Oo(a){throw new Kl};_.M=function Po(){return 0};Kk(139,66,Sp,Ro);Kk(140,125,{17:1,28:1},Uo);Kk(141,131,Yp,Wo);_.S=function Xo(){return this.b};_.T=function Yo(){return this.c};_.U=function Zo(a){var b;b=this.c;this.c=a;return b};Kk(142,66,Sp,_o);Kk(144,133,Zp);_.V=function cp(a,b){jo(this.b,a,b)};_.J=function dp(a){return ko(this.b,a)};_.K=function ep(a){return no(this.b,a,0)!=-1};_.W=function fp(a){return mo(this.b,a)};_.L=function gp(){return new fo(this.b)};_.M=function hp(){return this.b.c};_.N=function ip(){return po(this.b)};_.O=function jp(a){return qo(this.b,a)};_.tS=function kp(){return Xm(this.b)};Kk(143,144,Zp,op);Kk(146,1,{},vp);_.b=null;_.d=0;_.e=null;Kk(147,103,{},xp,yp);Kk(149,1,{});Kk(148,149,{},Dp);var Fp;var $p=jh();var Mj=wl(Yq,'Object',1),pj=wl(Zq,'Scheduler',72),oj=wl(Zq,'JavaScriptObject$',69),vk=vl($q,'Object;',154,Mj),rk=zl('boolean',' Z'),yk=vl(cq,'[Z',156,rk),Tj=wl(Yq,'Throwable',68),Hj=wl(Yq,'Exception',67),Nj=wl(Yq,'RuntimeException',66),Oj=wl(Yq,'StackTraceElement',117),wk=vl($q,'StackTraceElement;',157,Oj),xj=wl('com.google.gwt.lang.','SeedUtil',93),Gj=wl(Yq,'Enum',28),Dj=wl(Yq,'Boolean',105),Di=zl('char',' C'),sk=vl(cq,'[C',158,Di),Fj=wl(Yq,'Class',107),Sj=wl(Yq,Dq,2),xk=vl($q,'String;',155,Sj),Ej=wl(Yq,'ClassCastException',108),nj=wl(Zq,'JavaScriptException',65),Qj=wl(Yq,'StringBuilder',120),Cj=wl(Yq,'ArrayStoreException',104),zj=wl(_q,'UserAgentImplIe10',101),yj=wl(_q,'UserAgentImplGecko1_8',100),Aj=wl(_q,'UserAgentImplSafari',102),Kj=wl(Yq,'NullPointerException',114),Ij=wl(Yq,'IllegalArgumentException',109),wj=wl(ar,'StringBufferImpl',81),qk=wl(br,'ExporterBaseImpl',149),pk=wl(br,'ExporterBaseActual',148),uj=wl(ar,'StackTraceCreator$Collector',77),tj=wl(ar,'StackTraceCreator$CollectorMoz',79),sj=wl(ar,'StackTraceCreator$CollectorChrome',78),rj=wl(ar,'StackTraceCreator$CollectorChromeNoSourceMap',80),vj=wl(ar,'StringBufferImplAppend',82),qj=wl(ar,'SchedulerImpl',74),ck=wl(cr,'AbstractMap',126),$j=wl(cr,'AbstractHashMap',125),Vj=wl(cr,'AbstractCollection',124),dk=wl(cr,'AbstractSet',128),Xj=wl(cr,'AbstractHashMap$EntrySet',127),Wj=wl(cr,'AbstractHashMap$EntrySetIterator',129),bk=wl(cr,'AbstractMapEntry',131),Yj=wl(cr,'AbstractHashMap$MapEntryNull',130),Zj=wl(cr,'AbstractHashMap$MapEntryString',132),ik=wl(cr,'HashMap',140),Mi=wl(dr,'WordCleaner_ExporterImpl',18),Ni=wl(dr,'WordCleaner',17),jk=wl(cr,'MapEntryImpl',141),Pj=wl(Yq,'StringBuffer',119),ak=wl(cr,'AbstractList',133),ek=wl(cr,'ArrayList',135),_j=wl(cr,'AbstractList$IteratorImpl',134),Oi=wl(er,'OfficeImportFunction',20),Ri=wl(er,'WordImportFunction',22),Qi=wl(er,'WordImportFunction$1',23),Gi=wl(fr,'Logged',5),Fi=wl(fr,'Logged$6',8),Ei=wl('com.ephox.functional.closures.','Thunk',4),gj=yl(gr,'ReplacementRuleSet'),uk=vl('[Lcom.ephox.tord.wordhtmlfilter.','ReplacementRuleSet;',159,gj),Uj=wl(Yq,'UnsupportedOperationException',123),Si=wl(hr,'ListImporter',24),ij=wl(gr,'StepOne',58),kj=wl(gr,'StepTwoFilterStyles',60),jj=wl(gr,'StepThree',59),hj=wl(gr,'StepLast',57),lj=wl(gr,'StepTwoRemoveStyles',61),zk=vl(cq,'[[C',160,sk),dj=wl(gr,'ReadBuffer',41),mj=wl(gr,'WriteBuffer',62),Pi=wl(er,'Scrub',21),Bj=wl('com.googlecode.gwtx.java.util.impl.client.','PatternImpl',103),ok=wl(ir,'Pattern',147),nk=wl(ir,'Matcher',146),gk=wl(cr,'Collections$EmptyList',138),Li=wl('com.ephox.functional.factory.','Thunks$1',14),fk=wl(cr,'Arrays$ArrayList',136),Zi=wl(gr,'CharMap',32),fj=wl(gr,'RemoveLink',49),_i=wl(gr,'ModifySingleStyle',36),bj=wl(gr,'ModifyStyleAttribute',37),ej=wl(gr,'RemoveAttributeByName',42),aj=wl(gr,'ModifyStyleAttributeOnlyUsingMustKeepList',38),Jj=wl(Yq,'IndexOutOfBoundsException',110),kk=wl(cr,'NoSuchElementException',142),Rj=wl(Yq,'StringIndexOutOfBoundsException',121),Ak=vl(cq,'[[[C',161,zk),$i=wl(gr,'IndexedStrings',35),cj=wl(gr,'ModifyStyleDefinition',39),Ti=wl(hr,'ListInfoStack',26),Ui=wl(hr,'ListInfo',25),Yi=wl(jr,'ListItemData',31),Ki=wl(fr,'Optional',9),Hi=wl(fr,'Optional$None',10),Ii=wl(fr,'Optional$Some',11),Ji=wl(fr,'Optional$StrictSome',12),Wi=wl(jr,'ContentData',29),Xi=wl(jr,'ListAggregationData',30),Lj=wl(Yq,'NumberFormatException',116),Vi=xl(hr,'ListTagAndType',27,kd),tk=vl('[Lcom.ephox.tord.lists.','ListTagAndType;',162,Vi),mk=wl(cr,'Vector',144),lk=wl(cr,'Stack',143),hk=wl(cr,'EmptyStackException',139);if (com_ephox_keurig_Keurig) com_ephox_keurig_Keurig.onScriptLoad(gwtOnLoad);})();