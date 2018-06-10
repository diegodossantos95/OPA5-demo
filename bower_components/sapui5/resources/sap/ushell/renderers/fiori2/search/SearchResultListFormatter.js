sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchConfiguration','sap/ushell/renderers/fiori2/search/SearchHelper'],function(S,c){"use strict";var m=sap.ushell.renderers.fiori2.search.SearchResultListFormatter=function(){this.init.apply(this,arguments);};m.prototype={init:function(){this.sina=S.getInstance().getSina();},format:function(s,t){return this._doFormat(s.getElements(),t);},_getImageUrl:function(r){var i={imageUrl:'',name:''};for(var p in r){var a=r[p];var b=false;try{if(a.value&&(a.$$MetaData$$.presentationUsage.indexOf('Image')>=0||a.$$MetaData$$.presentationUsage.indexOf('Thumbnail')>=0)){b=true;}}catch(e){}if(!b){continue;}i.imageUrl=a.value;i.name=p;return i;}return i;},_moveWhyFound2ResponseAttr:function(w,p){var l=w.length;while(l--){if(w[l].labelRaw===p.labelRaw&&p!==undefined){p.valueWithoutWhyfound=p.value;p.value=w[l].value;p.whyfound=true;w.splice(l,1);}}},_appendRemainingWhyfounds2FormattedResultItem:function(w,i){var l=w.length;while(l--){if(w[l].labelRaw!==undefined){var I={};I.name=w[l].label;I.value=w[l].value;I.whyfound=true;i.push(I);w.splice(l,1);}}},_doFormat:function(r,t){var s=function(a,b){return a.displayOrder-b.displayOrder;};var d,e,f,g;var h=[];for(var i=0;i<r.length;i++){var j=r[i];var u='';var k=j.$$RelatedActions$$;for(var l in k){if(k[l].type==="Navigation"||k[l].type==="Link"){u=encodeURI(k[l].uri);}}var w=j.$$WhyFound$$||[];var n=[];var o=[];var p=[];var q=[];var v='';var x={};var A='';for(var B in j){if(!j[B].label||!j[B].$$MetaData$$){continue;}var C=j[B].$$MetaData$$.presentationUsage||[];if(C&&C.length>0){if(C.indexOf("Title")>-1&&j[B].value){this._moveWhyFound2ResponseAttr(w,j[B]);v=v+" "+j[B].value;}if(C.indexOf("Text")>-1){j[B].longtext=true;}if(C.indexOf("Summary")>-1){n.push({property:B,displayOrder:j[B].$$MetaData$$.displayOrder});}else if(C.indexOf("Detail")>-1){o.push({property:B,displayOrder:j[B].$$MetaData$$.displayOrder});}else if(C.indexOf("Title")>-1){p.push({property:B,displayOrder:j[B].$$MetaData$$.displayOrder});}else if(C.indexOf("Hidden")>-1){j[B].hidden=true;q.push({property:B,displayOrder:j[B].$$MetaData$$.displayOrder});}}if(j[B].$$MetaData$$.isKey===true){A=A+B+'='+j[B].valueRaw;}var D=j[B].$$MetaData$$.semanticObjectType;if(D&&D.length>0){x[D]=j[B].valueRaw;}}if(j.$$DataSourceMetaData$$.semanticObjectType==='fileprocessorurl'){var E=c.getUrlParameter('suvViewer');var F=';o=sid('+j.$$DataSourceMetaData$$.systemId+'.'+j.$$DataSourceMetaData$$.client+')';d='UIA000~EPM_FILE_PROC_U_DEMO~';if(j.$$DataSourceMetaData$$.objectName&&j.$$DataSourceMetaData$$.objectName.value){d=j.$$DataSourceMetaData$$.objectName.value;}e="/sap/opu/odata/SAP/ESH_SEARCH_SRV"+F+"/FileLoaderFiles(ConnectorId='"+d+"',FileType='ThumbNail',SelectionParameters='"+A+"')/$value";j.thumbnail={$$MetaData$$:{accessUsage:[],correspondingSearchAttributeName:"thumbnail",dataType:"String",description:"Thumbnail",displayOrder:0,isKey:false,isSortable:false,isTitle:false,presentationUsage:["Thumbnail"]},label:"Thumbnail",labelRaw:"Thumbnail",value:e,valueRaw:e};f="/sap/opu/odata/SAP/ESH_SEARCH_SRV"+F+"/FileLoaderFiles(ConnectorId='"+d+"',FileType='BinaryContent',SelectionParameters='"+A+"')/$value";j.titlelink={$$MetaData$$:{accessUsage:[],correspondingSearchAttributeName:"titlelink",dataType:"String",description:"Display Original Document",displayOrder:0,isKey:false,isSortable:false,isTitle:false,presentationUsage:["Titlelink"]},label:"Display original document",labelRaw:"Display original document",value:f,valueRaw:f};u=f;g="/sap/opu/odata/SAP/ESH_SEARCH_SRV"+F+"/FileLoaderFiles(ConnectorId='"+d+"',FileType='SUVFile',SelectionParameters='"+A+"')/$value";g='/sap-pdfjs/web/viewer.html?file='+encodeURIComponent(g);j.suvlink={$$MetaData$$:{accessUsage:[],correspondingSearchAttributeName:"suvlink",dataType:"String",description:"Show Document",displayOrder:0,isKey:false,isSortable:false,isTitle:false,presentationUsage:["Link"]},label:"Show Document",labelRaw:"suvlink",value:g,valueRaw:g};if(j['PHIO_ID_THUMBNAIL']&&j['PHIO_ID_THUMBNAIL'].value){j.containsThumbnail=true;}if(E==='true'&&j['PHIO_ID_SUV']&&j['PHIO_ID_SUV'].value){j.containsSuvFile=true;}}n.sort(s);o.sort(s);p.sort(s);q.sort(s);var G=n.concat(o);var H={};H.key=j.key;H.keystatus=j.keystatus;H.semanticObjectTypeAttrs=x;var I=this._getImageUrl(j);H.imageUrl=I.imageUrl;var J=this.sina.getDataSourceSyncByBusinessObjectName(j.$$DataSourceMetaData$$.key);if(J){H.dataSourceName=J.label;}else{H.dataSourceName=j.$$DataSourceMetaData$$.label;console.log("This datasource "+j.$$DataSourceMetaData$$.label+j.$$DataSourceMetaData$$.name+" is not found in meta data map.");}H.dataSource=j.$$DataSourceMetaData$$;H.uri=u;H.containsThumbnail=j.containsThumbnail;H.containsSuvFile=j.containsSuvFile;H.semanticObjectType=j.$$DataSourceMetaData$$.semanticObjectType||"";H.$$Name$$='';H.systemId=j.$$DataSourceMetaData$$.systemId||"";H.client=j.$$DataSourceMetaData$$.client||"";if(j.suvlink&&j.suvlink.value){H.suvlink=j.suvlink.value;}var K;var L={};var M=[];for(var z=0;z<G.length;z++){K=G[z].property;L={};if(K!==I.name){this._moveWhyFound2ResponseAttr(w,j[K]);L.name=j[K].label;L.value=j[K].value;L.valueWithoutWhyfound=j[K].valueWithoutWhyfound;L.key=K;L.isTitle=false;L.isSortable=j[K].$$MetaData$$.isSortable;L.attributeIndex=z;L.hidden=j[K].hidden;if(j[K].whyfound){L.whyfound=j[K].whyfound;}if(j[K].longtext){L.longtext=j[K].longtext;}M.push(L);}}var T=[];for(var y=0;y<p.length;y++){K=p[y].property;L={};if(K!==I.name){L.name=j[K].label;L.value=j[K].value;L.key=K;L.isTitle=false;L.isSortable=j[K].$$MetaData$$.isSortable;T.push(L);}}H.$$Name$$=v.trim();H.numberofattributes=G.length;H.title=j.title;H.itemattributes=M;H.titleattributes=T;H.selected=H.selected||false;H.expanded=H.expanded||false;this._appendRemainingWhyfounds2FormattedResultItem(w,H.itemattributes);h.push(H);}return h;}};return m;});