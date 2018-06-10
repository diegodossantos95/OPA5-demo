sap.ui.define([
		'jquery.sap.global',
		'sap/m/MessageToast',
		'sap/m/UploadCollectionParameter',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	], function(jQuery, MessageToast, UploadCollectionParameter, Controller, JSONModel) {
	"use strict";

	var PageController = Controller.extend("sap.m.sample.UploadCollection.Page", {

		onInit: function () {
			var sPath,
				oModel,
				oModelCB,
				aDataCB,
				oSelect,
				oFileTypesModel,
				mFileTypesData,
				oFileTypesBox,
				oUploadCollection;

			// set mock data
			sPath = jQuery.sap.getModulePath("sap.m.sample.UploadCollection", "/uploadCollection.json");
			oModel = new JSONModel(sPath);
			this.getView().setModel(oModel);

			aDataCB = {
				"items" : [{
					"key" : "All",
					"text" : "sap.m.ListSeparators.All"
				}, {
					"key" : "None",
					"text" : "sap.m.ListSeparators.None"
				}],
				"selectedKey" : "All"
			};

			oModelCB = new JSONModel();
			oModelCB.setData(aDataCB);

			oSelect = this.getView().byId("tbSelect");
			oSelect.setModel(oModelCB);

			oFileTypesModel = new sap.ui.model.json.JSONModel();

			mFileTypesData = {
				"items": [
					{
						"key": "jpg",
						"text": "jpg"
					},
					{
						"key": "txt",
						"text": "txt"
					},
					{
						"key": "ppt",
						"text": "ppt"
					},
					{
						"key": "doc",
						"text": "doc"
					},
					{
						"key": "xls",
						"text": "xls"
					},
					{
						"key": "pdf",
						"text": "pdf"
					},
					{
						"key": "png",
						"text": "png"
					}
				],
				"selected" : ["jpg", "txt", "ppt", "doc", "xls", "pdf", "png"]
			};

			oFileTypesModel.setData(mFileTypesData);
			this.getView().setModel(oFileTypesModel, "fileTypes");

			oFileTypesBox = this.getView().byId("fileTypesBox");
			oFileTypesBox.setSelectedItems(oFileTypesBox.getItems());

			oUploadCollection = this.getView().byId("UploadCollection");
			oUploadCollection.setFileType(oFileTypesBox.getSelectedKeys());
			// Sets the text to the label
			oUploadCollection.addEventDelegate({
				onBeforeRendering : function () {
					this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
				}.bind(this)
			});
		},

		formatAttribute : function (sValue) {
			jQuery.sap.require("sap.ui.core.format.FileSizeFormat");
			if (jQuery.isNumeric(sValue)) {
				return sap.ui.core.format.FileSizeFormat.getInstance({
					binaryFilesize : false,
					maxFractionDigits : 1,
					maxIntegerDigits : 3
				}).format(sValue);
			} else {
				return sValue;
			}
		},

		onChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			// Header Token
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name : "x-csrf-token",
				value : "securityTokenFromModel"
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onFileDeleted: function(oEvent) {
			this.deleteItemById(oEvent.getParameter("documentId"));
			MessageToast.show("FileDeleted event triggered.");
		},

		deleteItemById: function(sItemToDeleteId){
			var oData = this.getView().byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			jQuery.each(aItems, function(index) {
				if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
					aItems.splice(index, 1);
				}
			});
			this.getView().byId("UploadCollection").getModel().setData({
				"items" : aItems
			});
			this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},

		deleteMultipleItems: function(aItemsToDelete){
			var oData = this.getView().byId("UploadCollection").getModel().getData();
			var nItemsToDelete = aItemsToDelete.length;
			var aItems = jQuery.extend(true, {}, oData).items;
			var i = 0;
			jQuery.each(aItems, function(index) {
				if (aItems[index]) {
					for (i = 0; i < nItemsToDelete; i++){
						if (aItems[index].documentId === aItemsToDelete[i].getDocumentId()){
							aItems.splice(index, 1);
						}
					}
				}
			});
			this.getView().byId("UploadCollection").getModel().setData({
				"items" : aItems
			});
			this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},

		onFilenameLengthExceed : function() {
			MessageToast.show("FilenameLengthExceed event triggered.");
		},

		onFileRenamed: function(oEvent) {
			var oData = this.getView().byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			var sDocumentId = oEvent.getParameter("documentId");
			jQuery.each(aItems, function(index) {
				if (aItems[index] && aItems[index].documentId === sDocumentId) {
					aItems[index].fileName = oEvent.getParameter("item").getFileName();
				}
			});
			this.getView().byId("UploadCollection").getModel().setData({
				"items" : aItems
			});
			MessageToast.show("FileRenamed event triggered.");
		},

		onFileSizeExceed : function() {
			MessageToast.show("FileSizeExceed event triggered.");
		},

		onTypeMissmatch : function() {
			MessageToast.show("TypeMissmatch event triggered.");
		},

		onUploadComplete: function(oEvent) {
			var oData = this.getView().byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			var oItem;
			var sUploadedFile = oEvent.getParameter("files")[0].fileName;
			// at the moment parameter fileName is not set in IE9
			if (!sUploadedFile) {
				var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
				sUploadedFile = aUploadedFile[0];
			}
			oItem = {
					"documentId" : jQuery.now().toString(), // generate Id,
					"fileName" : sUploadedFile,
					"mimeType" : "",
					"thumbnailUrl" : "",
					"url" : "",
					"attributes":[
						{
							"title" : "Uploaded By",
							"text" : "You"
						},
						{
							"title" : "Uploaded On",
							"text" : new Date(jQuery.now()).toLocaleDateString()
						},
						{
							"title" : "File Size",
							"text" : "505000"
						}
					]
			};

			if (this.getView().byId("modeSwitch").getState()){
				oItem.visibleEdit = false;
				oItem.visibleDelete = false;
			}else {
				oItem.visibleEdit = true;
				oItem.visibleDelete = true;
			}
			aItems.unshift(oItem);
			this.getView().byId("UploadCollection").getModel().setData({
				"items" : aItems
			});
			// Sets the text to the label
			this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
			// delay the success message for to notice onChange message
			setTimeout(function() {
				MessageToast.show("UploadComplete event triggered.");
			}, 4000);
		},

		onSeparatorsChange: function(oEvent) {
			var oUploadCollection = this.getView().byId("UploadCollection");
			oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
		},

		onBeforeUploadStarts: function(oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name : "slug",
				value : oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			MessageToast.show("BeforeUploadStarts event triggered.");
		},

		onUploadTerminated: function() {
			/*
			// get parameter file name
			var sFileName = oEvent.getParameter("fileName");
			// get a header parameter (in case no parameter specified, the callback function getHeaderParameter returns all request headers)
			var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
			*/
		},

		onFileTypeChange: function() {
			var oUploadCollection = this.getView().byId("UploadCollection");
			var oFileTypesMultiComboBox = this.getView().byId("fileTypesBox");
			oUploadCollection.setFileType(oFileTypesMultiComboBox.getSelectedKeys());
		},

		onSelectAllPress: function(oEvent) {
			var oUploadCollection = this.getView().byId("UploadCollection");
			if (!oEvent.getSource().getPressed()){
				this.deselectAllItems(oUploadCollection);
				oEvent.getSource().setPressed(false);
				oEvent.getSource().setText("Select all");
			} else {
				this.deselectAllItems(oUploadCollection);
				oUploadCollection.selectAll();
				oEvent.getSource().setPressed(true);
				oEvent.getSource().setText("Deselect all");
			}
			this.onSelectionChange(oEvent);
		},

		deselectAllItems: function(oUploadCollection){
			var aItems = oUploadCollection.getItems();
			for (var i = 0; i < aItems.length; i++){
				oUploadCollection.setSelectedItem(aItems[i], false);
			}
		},

		getAttachmentTitleText: function(){
			var aItems = this.getView().byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		},

		onSwitchUploaderChange: function(oEvent){
			var oUploadCollection = this.getView().byId("UploadCollection");
			var bState = oEvent.getParameter("state");
			if (bState){
				oUploadCollection.setUploadEnabled(true);
			} else {
				oUploadCollection.setUploadEnabled(false);
			}
		},

		onSwitchUploadInvisibleChange: function() {
			var oUploadCollection = this.getView().byId("UploadCollection");
			var bUploadButtonInvisible = oUploadCollection.getUploadButtonInvisible();
			oUploadCollection.setUploadButtonInvisible(!bUploadButtonInvisible);
		},

		onSwitchModeChange: function(){
			// Sets to MultiSelect
			if (this.getView().byId("modeSwitch").getState()){
				this.setVisibleEditAndDelete(false);
				this.enableToolbarItems(true);
				this.getView().byId("UploadCollection").setMode("MultiSelect");
			}else {
				// Sets to SingleSelectMaster
				this.setVisibleEditAndDelete(true);
				this.enableToolbarItems(false);
				this.getView().byId("UploadCollection").setMode("SingleSelectMaster");
			}
		},

		setVisibleEditAndDelete: function(status){
			var aItems = this.getView().byId("UploadCollection").getItems();
			for (var i = 0; i < aItems.length; i++){
				aItems[i].setVisibleEdit(status);
				aItems[i].setVisibleDelete(status);
			}
		},

		enableToolbarItems: function(status){
			this.getView().byId("selectAllButton").setVisible(status);
			this.getView().byId("deleteSelectedButton").setVisible(status);
			this.getView().byId("selectAllButton").setEnabled(status);
			// This is only enabled if there is a selected item in multi-selection mode
			if (this.getView().byId("UploadCollection").getSelectedItems().length > 0) {
				this.getView().byId("deleteSelectedButton").setEnabled(true);
			}
		},

		onDeleteSelectedItems: function(){
			var aSelectedItems = this.getView().byId("UploadCollection").getSelectedItems();
			this.deleteMultipleItems(aSelectedItems);
			if (this.getView().byId("UploadCollection").getSelectedItems().length < 1){
				this.getView().byId("selectAllButton").setPressed(false);
				this.getView().byId("selectAllButton").setText("Select all");
			}
			MessageToast.show("Delete selected items button press.");
		},

		onSearch: function(){
			MessageToast.show("Search feature isn't available in this sample");
		},

		onSelectionChange: function(){
			var oUploadCollection = this.getView().byId("UploadCollection");
			// Only it is enabled if there is a selected item in multi-selection mode
			if (oUploadCollection.getMode() === "MultiSelect"){
				if (oUploadCollection.getSelectedItems().length > 0) {
					this.getView().byId("deleteSelectedButton").setEnabled(true);
				} else {
					this.getView().byId("deleteSelectedButton").setEnabled(false);
				}
			}
		},

		onAttributePress: function(oEvent) {
			MessageToast.show("Attribute press event - " + oEvent.getSource().getTitle() + ": " + oEvent.getSource().getText());
		},

		onMarkerPress: function(oEvent) {
			MessageToast.show("Marker press event - " + oEvent.getSource().getType());
		}
	});

	return PageController;

});