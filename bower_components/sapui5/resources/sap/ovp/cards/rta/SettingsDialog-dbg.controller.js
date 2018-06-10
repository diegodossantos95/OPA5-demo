sap.ui.define([ 'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    '/sap/ui/fl/descriptorRelated/api/DescriptorChangeFactory',
    '/sap/ui/fl/descriptorRelated/api/DescriptorInlineChangeFactory',
    'sap/ovp/cards/CommonUtils',
    'sap/ovp/cards/SettingsUtils',
    'sap/m/Button',
    'sap/m/Dialog',
    'sap/m/Text',
    'sap/ui/comp/valuehelpdialog/ValueHelpDialog'
], function(Controller, JSONModel, DescriptorChangeFactory, DescriptorInlineChangeFactory,
            commonUtils, settingsUtils, Button, Dialog, Text, ValueHelpDialog) {
    'use strict';

    return Controller.extend('sap.ovp.cards.rta.SettingsDialog', {

        /* To store manifest setting of selected Card*/
        _oCardManifestSettings : {},
        /* To store all Manifest settings*/
        _oManifest : {},
        /*To Store Form Container*/
        _oFormContainer : {},
        /*To store the elements that do not require refresh when updated*/
        _aRefreshNotRequired : [{
                     "formElementId" : "sapOvpSettingsTitle",
                     "cardElementId" : "ovpHeaderTitle"
                 },
                 {
                     "formElementId" : "sapOvpSettingsSubTitle",
                     "cardElementId" : "SubTitle-Text"
                 },
                 {
                     "formElementId" : "sapOvpSettingsLineItemTitle",
                     "cardElementId" : "linkListTitleLabel"
                 },
                 {
                     "formElementId" : "sapOvpSettingsLineItemSubTitle",
                     "cardElementId" : "linkListSubTitleLabel"
                 },
                 {
                     "formElementId" : "sapOvpSettingsValueSelectionInfo",
                     "cardElementId" : "ovpValueSelectionInfo"
                 },
                 {
                     "formElementId" : "sapOvpSettingsIdentification",
                     "cardElementId" : "",
                     "updateProperty" : "identificationAnnotationPath"
                 },
                 {
                     "formElementId" : "sapOvpSettingsKPIHeaderSwitch",
                     "cardElementId" : "kpiHeader",
                     "isKpiSwitch" : true //If it's a switch, update without refresh only if state = true
                 }],
        _aRefreshRequired : [
                 {
                     "formElementId" : "sapOvpSettingsKPIHeaderSwitch",
                     "updateProperty" : "kpiHeader"
                 },
                 {
                    "formElementId" : "sapOvpSettingsListType",
                    "updateProperty" : "listType"
                 },
                 {
                    "formElementId" : "sapOvpSettingsListFlavor",
                    "updateProperty" : "listFlavor"
                 },
                 {
                     "formElementId" : "sapOvpSettingsSortOrder",
                     "updateProperty" : "sortOrder"
                 },
                 {
                     "formElementId" : "sapOvpSettingsSortBy",
                     "updateProperty" : "sortBy"
                 },
                 {
                     "formElementId" : "sapOvpSettingsFilterBy",
                     "updateProperty" : "selectionAnnotationPath"
                 },
                 {
                     "formElementId" : "sapOvpSettingsPresentedBy",
                     "updateProperty" : "presentationAnnotationPath"
                 },
                 {
                     "formElementId" : "sapOvpSettingsDataPoint",
                     "updateProperty" : "dataPointAnnotationPath"
                 },
                 {
                     "formElementId" : "sapOvpSettingsChart",
                     "updateProperty" : "chartAnnotationPath"
                 },
                 {
                     "formElementId" : "sapOvpSettingsLineItem",
                     "updateProperty" : "annotationPath"
                 }
        ],

        validateInputField: function (oEvent) {
            if (!oEvent.getSource().getValue()) {
                var dialog = new Dialog({
                    title: 'Error',
                    type: 'Message',
                    state: 'Error',
                    content: new Text({
                        text: sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText('OVP_KEYUSER_INPUT_ERROR')
                    }),
                    beginButton: new Button({
                        text: sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText('close'),
                        press: function () {
                            dialog.close();
                        }
                    }),
                    afterClose: function() {
                        dialog.destroy();
                    }
                });
                dialog.open();
            } else {
                this.updateCard(oEvent);
            }
        },
        onInit : function() {
            /*Attaching CreateAndSubmitChange button to oSaveButton*/
            settingsUtils.oSaveButton.attachPress(this.createAndSubmitChange,this);
        },

        onAfterRendering : function() {
            this._oCardManifestSettings = this.getView().getModel().getData();
            setTimeout( function(){
                this.getView().byId("dialogCard").setBusy(false);
            }.bind(this), 2000);

        },

        setBusy : function (bBusy) {
            if (bBusy) {
//                this.getView().byId("dialogCard").addStyleClass("componentContainerBusy");
                this.getView().addStyleClass("dialogContainerOverlay");
                this.getView().byId("dialogCard").getComponentInstance().getRootControl().setBusy(bBusy);
            } else {
//                this.getView().byId("dialogCard").removeStyleClass("componentContainerBusy");
                this.getView().removeStyleClass("dialogContainerOverlay");
//                this.getView().byId("dialogCard").setBusy(bBusy);
                setTimeout( function(){
                    this.getView().byId("dialogCard").getComponentInstance().getRootControl().setBusy(bBusy);
                }.bind(this), 2000);
            }
            
//            this.getView().byId("dialogCard").setBusy(bBusy);

        },

        _fCardWithoutRefresh : function (oEvent, updatedElementProps) {
            var oView = this.getView();
            var oComponentInstance = oView.byId("dialogCard").getComponentInstance(),
            oRootControl = oComponentInstance.getRootControl(),
            oElement;
            if (updatedElementProps.formElementId === "sapOvpSettingsLineItemTitle" ||
                updatedElementProps.formElementId === "sapOvpSettingsLineItemSubTitle") {
                oElement = oRootControl.byId(updatedElementProps.cardElementId + "--" + oView.getModel().getProperty("/lineItemId"));
            } else {
                oElement = oRootControl.byId(updatedElementProps.cardElementId);
            }
            switch (updatedElementProps.formElementId) {
                case "sapOvpSettingsLineItemTitle":
                case "sapOvpSettingsLineItemSubTitle":
                case "sapOvpSettingsTitle" :
                case "sapOvpSettingsSubTitle" :
                case "sapOvpSettingsValueSelectionInfo" :
                    oElement.setText(oEvent.getSource().getValue());
                    break;
                case "sapOvpSettingsIdentification" :
                    var oBindingContext = oEvent.getParameters().selectedItem.getBindingContext(),
                        oModel = oBindingContext.getModel(),
                        sPath = oBindingContext.getPath(),
                        sAnnotationPath = oModel.getProperty(sPath).value;
                    this._oCardManifestSettings[updatedElementProps.updateProperty] = sAnnotationPath;
                    break;
                case "sapOvpSettingsKPIHeaderSwitch" :
                    var oVisibilityModel = oView.getModel("visibility"),
                        oData = oVisibilityModel.getData();
                    oData.dataPoint = false;
                    oData.valueSelectionInfo = false;
                    var oCardPropertiesModel = oView.getModel(),
                        sDataPointAnnotationPath = oCardPropertiesModel.getProperty("/dataPointAnnotationPath");
                    if (sDataPointAnnotationPath) {
                        oCardPropertiesModel.setProperty("/prevDataPointAnnotationPath", sDataPointAnnotationPath);
                    }
                    oCardPropertiesModel.setProperty("/dataPointAnnotationPath", undefined);
                    oVisibilityModel.refresh(true);
                    oElement.destroy();
                    break;
                default :
                    break;
            }
        },

        _fCardWithRefresh : function (oEvent, updateProperty) {
            var oSettingDialog = this.getView(),
                oComponentContainer = oSettingDialog.byId('dialogCard'),
                card = oComponentContainer.getComponentInstance().getComponentData(),
                sCardId = card.cardId,
                modelName = card.manifest.cards[sCardId].model,
                oManifest = {
                    cards: {}
                };

            switch (updateProperty) {
                case "kpiHeader" :
                    var oView = this.getView(),
                        oVisibilityModel = oView.getModel("visibility"),
                        oData = oVisibilityModel.getData();
                    oData.dataPoint = true;
                    oData.valueSelectionInfo = true;
                    var oCardPropertiesModel = oView.getModel(),
                        sPrevDataPointAnnotationPath = oCardPropertiesModel.getProperty("/prevDataPointAnnotationPath");
                    this._oCardManifestSettings.valueSelectionInfo = " ";
                    if (sPrevDataPointAnnotationPath) {
                        oCardPropertiesModel.setProperty("/dataPointAnnotationPath", sPrevDataPointAnnotationPath);
                    } else {
                        oCardPropertiesModel.setProperty("/dataPointAnnotationPath", oCardPropertiesModel.getData().dataPoint[0].value);
                    }
                    oVisibilityModel.refresh(true);
                    break;
                case "listType" :
                    oEvent.getSource().getState() === true ? (this._oCardManifestSettings[updateProperty] = "extended") : (this._oCardManifestSettings[updateProperty] = "condensed");
                    break;
                case "listFlavor" :
                    if (this._oCardManifestSettings["listFlavorName"] === settingsUtils.FORM_ITEM_NAME_FOR_LIST_FLAVOR_IN_LINKLIST) {
                        oEvent.getSource().getState() === true ? (this._oCardManifestSettings[updateProperty] = "carousel") : (this._oCardManifestSettings[updateProperty] = "standard");
                    } else {
                        oEvent.getSource().getState() === true ? (this._oCardManifestSettings[updateProperty] = "bar") : (this._oCardManifestSettings[updateProperty] = "");
                    }
                    break;
                case "sortOrder" :
                    oEvent.getSource().getSelectedKey() === "ascending" ? (this._oCardManifestSettings[updateProperty] = "ascending") : (this._oCardManifestSettings[updateProperty] = "descending");
                    break;
                case "sortBy" :
                    this._oCardManifestSettings[updateProperty] = oEvent.getSource().getSelectedKey();
                    break;
                case "annotationPath":
                    break;
                case "chartAnnotationPath":
                case "dataPointAnnotationPath":
                case "presentationAnnotationPath":
                case "selectionAnnotationPath":
                    var oBindingContext = oEvent.getParameters().selectedItem.getBindingContext(),
                        oModel = oBindingContext.getModel(),
                        sPath = oBindingContext.getPath(),
                        sAnnotationPath = oModel.getProperty(sPath).value;
                    this._oCardManifestSettings[updateProperty] = sAnnotationPath;
                    break;
                default :
                    break;
            }
            oManifest.cards[sCardId] = {
                model: modelName,
                template: card.template,
                settings: this._oCardManifestSettings
            };

//            this.setBusy(true);
            
            var oPromise = commonUtils.createCardComponent(oSettingDialog, oManifest, 'dialogCard');
            oPromise.then(function(){
                this.setBusy(false);
            }.bind(this));
            oPromise.catch(function(){
                this.setBusy(false);
            }.bind(this));
        },

        updateCard : function(oEvent) {
            var sourceElementId = oEvent.getSource().getId(),
                bCardWithoutRefresh = false;
            for (var i = 0 ; i < this._aRefreshNotRequired.length; i++) {
                if (sourceElementId.indexOf(this._aRefreshNotRequired[i].formElementId) > -1) {
                    if (this._aRefreshNotRequired[i].isKpiSwitch && oEvent.getSource().getState()) {
                        break;
                    }
                    this._fCardWithoutRefresh(oEvent, this._aRefreshNotRequired[i]);
                    bCardWithoutRefresh = true;
                    break;
                }
            }
            if (!bCardWithoutRefresh) {
                for (var j = 0; j < this._aRefreshRequired.length; j++) {
                    if (sourceElementId.indexOf(this._aRefreshRequired[j].formElementId) > -1) {
                        this.setBusy(true);
                        this._fCardWithRefresh(oEvent, this._aRefreshRequired[j].updateProperty);
                        break;
                    }
                }
            }
        },
        onExit: function () {
            settingsUtils.oSaveButton.detachPress(this.createAndSubmitChange,this);
        },
        updateTheLineItemSelected: function (event) {
            /*Getting the Value from the value seleciton info dialog*/
            var selectedItem = event.getSource().getSelectedItem().getBindingContext().getObject().Qualifier;

            /*Updating the selected values to the Model*/
            this._oCardManifestSettings.lineItemQualifier = selectedItem;
            this._oCardManifestSettings.annotationPath = 'com.sap.vocabularies.UI.v1.LineItem#' + selectedItem;
            if (selectedItem === 'Default') {
                this._oCardManifestSettings.annotationPath = 'com.sap.vocabularies.UI.v1.LineItem';
            }

            /*Updating the Value to lineItem Input*/
            this.getView().byId("sapOvpSettingsLineItem").setValue(selectedItem);

            /*Updating the card view*/
            this._fCardWithRefresh(event,'annotationPath');
            this.valueHelpDialog.close();
        },
        getListItems : function() {
            /*Getting the  iContext for sap.ovp.annotationHelper Function*/
            var aItemList = [],
                oSettingDialog = this.getView(),
                oComponentContainer = oSettingDialog.byId('dialogCard'),
                card = oComponentContainer.getComponentInstance().getComponentData(),
                lineItemBindingPath = this._oCardManifestSettings.entityType.$path + '/' + this._oCardManifestSettings.annotationPath,
                oModel = card.model.getMetaModel(),
                iContext = oModel.getContext(oModel.resolve(lineItemBindingPath, this.oView.getBindingContext()));

            /*Forming Visible Fields String*/
            ////For Condensed List
            var maxDataFields = 2,
                maxDataPoints = 1,
                noOfDataFieldsReplaceableByDataPoints = 0;
            if (this._oCardManifestSettings.listFlavor === 'bar') {
                //For Condensed List  Bar Card :- Max Data Fields = 2 and Max DataPoints = 1 and Replaceable fields are 0
                maxDataFields = 1;
                maxDataPoints = 2;
            }

            if (this._oCardManifestSettings.listType && this._oCardManifestSettings.listType.toLowerCase() === 'extended') {
                //For Extended List Card :- Max Data Fields = 6 and Max DataPoints =  and Replaceable fields are 0
                maxDataFields = 6;
                maxDataPoints = 3;
                noOfDataFieldsReplaceableByDataPoints = 3;
                if (this._oCardManifestSettings.listFlavor === 'bar') {
                    //For Extended Bar List Card
                    maxDataFields = 5;
                }
            } else if (this._oCardManifestSettings.contentFragment === "sap.ovp.cards.table.Table") {
                //For Table Card Max Data :- Fields = 3 and Max DataPoints = 1 and Replaceable fields are 1
                maxDataFields = 3;
                maxDataPoints = 1;
                noOfDataFieldsReplaceableByDataPoints = 1;
            }
            this._oCardManifestSettings.lineItem.forEach(function (lineItem) {
                var aDataPointsObjects = sap.ovp.cards.AnnotationHelper.getSortedDataPoints(iContext,lineItem.fields),
                    aDataFieldsObjects = sap.ovp.cards.AnnotationHelper.getSortedDataFields(iContext,lineItem.fields),
                    dataFields = [],
                    dataPoints = [];
                aDataPointsObjects.forEach(function (fields) {
                    if (fields.Title) {
                        dataPoints.push(fields.Title.String);
                    }
                });
                aDataFieldsObjects.forEach(function (fields) {
                    if (fields.Label) {
                        dataFields.push(fields.Label.String);
                    }
                });
                var noOfDataPointsUsed = Math.min(dataPoints.length, maxDataPoints),
                    noOfDataPointsOccupyingDataFieldsSpace = Math.min(noOfDataFieldsReplaceableByDataPoints,noOfDataPointsUsed),
                    visibleField = dataFields.slice(0, maxDataFields - noOfDataPointsOccupyingDataFieldsSpace)
                        .concat(dataPoints.slice(0, noOfDataPointsUsed));
                visibleField.map(function(field){
                    return field.charAt(0).toUpperCase() + field.substr(1);
                });
                aItemList.push({
                    Qualifier: lineItem.name,
                    VisibleFields: visibleField.toString()
                });
            });
            return aItemList;
        },
        openLineItemValueHelpDialog: function(oEvent) {
            /*Creating the Table*/
            var oTable = new sap.m.Table({
                mode : sap.m.ListMode.SingleSelectLeft,
                inset : false,
                fixedLayout : false,
                columns : [
                    new sap.m.Column({
                        header :[
                            new sap.m.Label({
                                text : sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText('OVP_KEYUSER_LINEITEM_QUAL')
                            }) ]
                    }),
                    new sap.m.Column({
                        header :[
                            new sap.m.Label({
                                text : sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("OVP_KEYUSER_VISIBLE_FIELDS")
                            }) ]
                    })
                ]
            });
            oTable.bindItems("/", new sap.m.ColumnListItem({
                cells : [ new sap.m.Text({text : "{Qualifier}"}),
                    new sap.m.Text({text : "{VisibleFields}"})
                ]
            }));
            oTable.attachSelectionChange(this.updateTheLineItemSelected.bind(this));


            /*Creating the value Help Dialog*/
            this.valueHelpDialog = new ValueHelpDialog({
                title: sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("OVP_KEYUSER_LINEITEM_ANNO"),
                contentWidth: "60%",
                supportMultiselect: false
            });
            this.valueHelpDialog.attachCancel(function() {
                this.valueHelpDialog.close();
            }.bind(this));
            this.valueHelpDialog.setTable(oTable);



            /*Data to Show in Table*/
            this.aItemList = this.getListItems();

            /*Setting model to the table row*/
            var oRowsModel = new sap.ui.model.json.JSONModel();
            oRowsModel.setData(this.aItemList);
            this.valueHelpDialog.getTable().setModel(oRowsModel);

            /*Preselecting the table item*/
            oTable.getItems().forEach(function(item) {
                if (item.getBindingContext().getObject().Qualifier === this._oCardManifestSettings.lineItemQualifier) {
                    item.setSelected(true);
                }
            }.bind(this));

            this.valueHelpDialog.open();

        },
        createAndSubmitChange : function() {
            var settingsDialog = settingsUtils.dialogBox,
                sReference = 'sap.ovp.app',
                sLayer = 'VENDOR',
                sChangeType = 'ovp_removeCard',
                mParameters = {
                    'cardId' : 'sap.card01'
                },
                mTexts = null,
                sCreatorMethod = 'create_' + sChangeType;

            if (!DescriptorInlineChangeFactory[sCreatorMethod]) {
                return;
            }
            DescriptorInlineChangeFactory[sCreatorMethod](mParameters,mTexts).then(
                function(oDescriptorInlineChange) {
                    new DescriptorChangeFactory().createNew(sReference, oDescriptorInlineChange, sLayer).then(
                        function(oDescriptorchange) {
                            oDescriptorchange.submit().then(
                                function(oSuccess) {
                                   return;
                                },
                                function (oError) {
                                   return;
                                }
                            );
                        }
                    );
                }
            );
            settingsDialog.close();
        }

    });
});
