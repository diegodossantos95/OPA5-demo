/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.composite.InboxAttachmentFileUploader");sap.ui.commons.FileUploader.extend("sap.uiext.inbox.composite.InboxAttachmentFileUploader",{metadata:{},renderer:{}});
sap.uiext.inbox.composite.InboxAttachmentFileUploader.prototype.upload=function(){var u=this.getDomRef("fu_form");try{if(u){this._bUploading=true;if(this.getSendXHR()&&window.File){var f=jQuery.sap.domById(this.getId()+"-fu").files;if(f.length>0){var x=new window.XMLHttpRequest();x.open("POST",this.getUploadUrl(),true);if(this.getHeaderParameters()){var h=this.getHeaderParameters();for(var i=0;i<h.length;i++){var H=h[i].getName();var v=h[i].getValue();x.setRequestHeader(H,v);}}x.send(f[0]);var t=this;x.onreadystatechange=function(){if(x.readyState==4){t.fireUploadComplete({"response":x.response,"status":x.status,"x-csrf-token":x.getResponseHeader("x-csrf-token"),"headerParameters":t.getHeaderParameters()});t._bUploading=false;}};this._bUploading=false;}}else{u.submit();}jQuery.sap.log.info("File uploading to "+this.getUploadUrl());}}catch(e){jQuery.sap.log.error("File upload failed:\n"+e.message);}};
