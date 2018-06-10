/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.uiext.inbox.composite.InboxAttachmentFileUploader");

sap.ui.commons.FileUploader.extend("sap.uiext.inbox.composite.InboxAttachmentFileUploader", {
	metadata: {},
	renderer : {}
});

sap.uiext.inbox.composite.InboxAttachmentFileUploader.prototype.upload = function() {

	var uploadForm = this.getDomRef("fu_form");

	try {
		if (uploadForm) {
			this._bUploading = true;
			if (this.getSendXHR() && window.File) {
				var oFiles = jQuery.sap.domById(this.getId() + "-fu").files;
				if (oFiles.length > 0) {
					var xhr = new window.XMLHttpRequest();
					xhr.open("POST", this.getUploadUrl(), true);
					if (this.getHeaderParameters()) {
						var oHeaderParams = this.getHeaderParameters();
						for (var i = 0; i < oHeaderParams.length; i++) {
							var sHeader = oHeaderParams[i].getName();
							var sValue = oHeaderParams[i].getValue();
							xhr.setRequestHeader(sHeader, sValue);
						}
					}
					
					xhr.send(oFiles[0]);
					var that = this;
					xhr.onreadystatechange = function() {
						if (xhr.readyState == 4) {
							that.fireUploadComplete({
								"response": xhr.response, 
								"status": xhr.status, 
								"x-csrf-token": xhr.getResponseHeader("x-csrf-token"),
								"headerParameters": that.getHeaderParameters()
							});
							that._bUploading = false;
						}
					}
					this._bUploading = false;
				}
			} else {
				uploadForm.submit();
			}
			jQuery.sap.log.info("File uploading to " + this.getUploadUrl());
		}
	} catch(oException) {
		jQuery.sap.log.error("File upload failed:\n" + oException.message);
	}
};
