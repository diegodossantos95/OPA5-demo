/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

sap.ui.define([
	'jquery.sap.global',
	"sap/m/Dialog",
    "sap/m/Button",
    'sap/ovp/cards/CommonUtils'
], function(jQuery, Dialog, Button, CommonUtils) {
	"use strict";
	
	function addCardToView(oComponentContainer, oView){
		var oComponent = oComponentContainer.getComponentInstance(),
			oComponentData = oComponent.getComponentData(),
			oAppComponent = oComponentData.appComponent,
			sCardId = oComponentData.cardId,
			sManifestCardId = sCardId + 'Dialog',
			sModelName = oComponentData.modelName,
			oModel = oAppComponent.getModel(sModelName),
			oCardProperties = oView.getModel().getData(),
			oManifest = {
				cards: {}
			};
		oManifest.cards[sManifestCardId] = {
			model: sModelName,
	        template: oCardProperties.template,
	        settings: oCardProperties
		};
		oView.setModel(oModel, sModelName);
		oView.getController()._oManifest = oManifest;
		CommonUtils.createCardComponent(oView, oManifest, 'dialogCard');
	}
	
	function hasViewSwitch(oComponent) {
		var oCardProperties = oComponent.getRootControl().getModel("ovpCardProperties").getData(),
			aTabs = oCardProperties.tabs;
		return (!!aTabs && aTabs.length != 0) || (oCardProperties.template === "sap.ovp.cards.linklist" && !!oCardProperties.staticContent);
	}
	
	function addIconTabBarToDialog(oComponent, oView, oDialogBox) {
		var oCardProperties = oComponent.getRootControl().getModel("ovpCardProperties").getData(),
			aTabs = oCardProperties.tabs,
			oIconTabBar;
		if (!!aTabs && aTabs.length != 0) {
            oIconTabBar = new sap.m.IconTabBar({
                selectedKey: oCardProperties.selectedKey,
                select: function (oEvent) {
                    //Code for tab change goes here
                    var dialogCard = oView.byId("dialogCard");
                    var oRootControl = dialogCard.getComponentInstance().getRootControl();
                    var oController = oRootControl.getController();
                    oController.changeSelection(oEvent, true);
                }.bind(this)
            }).addStyleClass("sapOvpITH");
            for (var i = 0; i < aTabs.length; i++) {
                    var iconTabFilter = new sap.m.IconTabFilter({
                    text: aTabs[i].value,
                    key: i + 1
                });
                oIconTabBar.addItem(iconTabFilter);
            }
        } else {
        	// (oCardProperties.template === "sap.ovp.cards.linklist" && !!oCardProperties.staticContent)
        	oIconTabBar = new sap.m.IconTabBar({
                selectedKey: 1,
                select: function (oEvent) {
                    //Code for tab change goes here
                    var iSelectedKey = oEvent.getParameters().selectedKey;
                    var iSelectedLineItem = iSelectedKey - 1;
                    var oDialogCard = oView.byId("dialogCard");
                    var oRootControl = oDialogCard.getComponentInstance().getRootControl();
                    var oCarousel = oRootControl.byId("pictureCarousel");
                    if (oCarousel) {
                        oCarousel.setActivePage(oCarousel.getAggregation("pages")[iSelectedLineItem]);
                    }
                    var oModel = oView.getModel();
                    oModel.setProperty("/lineItemId", "linkListItem--" + iSelectedKey);
                    var oStaticContentData = oView.byId("sapOvpSettingsForm").getModel().getData().staticContent[iSelectedLineItem];
                    var oLinks, oLinksItem,
                        oTitle = oView.byId("sapOvpSettingsLineItemTitle"),
                        oSubTitle = oView.byId("sapOvpSettingsLineItemSubTitle");
                    oTitle.bindValue("/staticContent/" + iSelectedLineItem + "/title");
                    oSubTitle.bindValue("/staticContent/" + iSelectedLineItem + "/subTitle");
                    var oVisibilityModel = oView.getModel("visibility");
                    if (oStaticContentData.semanticObject && oStaticContentData.action) {
                        oVisibilityModel.setProperty("/links", true);
                        oVisibilityModel.setProperty("/staticLink", false);
                        oLinks = oView.byId("sapOvpSettingsLinks");
                        oLinksItem = oLinks.getItemByKey("#" + oStaticContentData.semanticObject + "-" + oStaticContentData.action);
                        oLinks.setSelectedItem(oLinksItem);
                    } else {
                        oVisibilityModel.setProperty("/staticLink", true);
                        oVisibilityModel.setProperty("/links", false);
                        oLinks = oView.byId("sapOvpSettingsStaticLink");
                        oLinks.bindValue("/staticContent/" + iSelectedLineItem + "/targetUri");
                    }
                    oVisibilityModel.refresh();
                }.bind(this)
            }).addStyleClass("sapOvpITH");
            for (var i = 0; i < oCardProperties.staticContent.length; i++) {
                var iconTabFilter = new sap.m.IconTabFilter({
                    text: "Record--" + (i + 1),
                    key: i + 1
                });
                oIconTabBar.addItem(iconTabFilter);
            }
        }
		oIconTabBar.addContent(oView);
		oDialogBox.addContent(oIconTabBar);
	}
	
	function getQualifier(sAnnotationPath) {
		if (sAnnotationPath.indexOf('#') !== -1) {
            return sAnnotationPath.split('#')[1];
        } else {
            return "Default";
        }
	}
	
	function getAnnotationLabel(oEntityType, sKey) {
		if (sKey.indexOf(",") !== -1) {
    		sKey = sKey.split(",")[0];
        }
        if (sKey.indexOf(".Identification") !== -1) {
        	if (oEntityType[sKey]) {
                var aRecords = sap.ovp.cards.AnnotationHelper.sortCollectionByImportance(oEntityType[sKey]);
                for (var index = 0; index < aRecords.length; index++) {
                    var oItem = aRecords[index];
                    if (oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
                        if (oItem && oItem["Label"]) {
                            return oItem["Label"].String;
                        } else {
                            return oItem["SemanticObject"].String + "-" + oItem["Action"].String;
                        }
                    }
                    if (oItem.RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
                        if (oItem && oItem["Label"]) {
                            return oItem["Label"].String;
                        } else {
                            return oItem["Url"].String;
                        }
                    }
                }
            }
            return "No Navigation";
        } else {
            var sLabelQualifier = "",
                sAnnotationQualifier = getQualifier(sKey);
            if (sAnnotationQualifier !== "Default") {
                sLabelQualifier = "#" + sAnnotationQualifier;
            }
            var sLabelName = "com.sap.vocabularies.Common.v1.Label" + sLabelQualifier;
            if (oEntityType[sKey] && oEntityType[sKey][sLabelName]) {
                return oEntityType[sKey][sLabelName].String;
            } else {
                return sAnnotationQualifier;
            }
        }
	}

    function checkIfCardTemplateHasProperty(sTemplate, sType) {
        switch (sType) {
            case "listType":
                var aCardTypeForListType = ["sap.ovp.cards.list"];
                return (aCardTypeForListType.indexOf(sTemplate) !== -1);
            case "listFlavor":
                var aCardTypeForListFlavor = ["sap.ovp.cards.list", "sap.ovp.cards.linklist"];
                return (aCardTypeForListFlavor.indexOf(sTemplate) !== -1);
            case "kpiHeader":
                var aCardTypeForKPI = ["sap.ovp.cards.list",
                    "sap.ovp.cards.table",
                    "sap.ovp.cards.charts.analytical",
                    "sap.ovp.cards.charts.bubble",
                    "sap.ovp.cards.charts.donut",
                    "sap.ovp.cards.charts.line"];
                return (aCardTypeForKPI.indexOf(sTemplate) !== -1);
            case "chart":
                var aCardTypeForChart = ["sap.ovp.cards.charts.analytical",
                    "sap.ovp.cards.charts.bubble",
                    "sap.ovp.cards.charts.donut",
                    "sap.ovp.cards.charts.line"];
                return (aCardTypeForChart.indexOf(sTemplate) !== -1);
            case "lineItem":
                var aCardTypeForLineItem = ["sap.ovp.cards.list", "sap.ovp.cards.table"];
                return (aCardTypeForLineItem.indexOf(sTemplate) !== -1);
            default :
                break;
        }
    }

    function getVisibilityOfElement(oCardProperties, sElement) {
        switch (sElement) {
            case "subTitle":
            case "title":
                return (!!oCardProperties[sElement]);
            case "valueSelectionInfo":
                if(!oCardProperties.valueSelectionInfo) {
                    oCardProperties.valueSelectionInfo = ' ';
                }
                return (!!oCardProperties.dataPointAnnotationPath &&
                checkIfCardTemplateHasProperty(oCardProperties.template, "kpiHeader"));
            case "listType":
            case "listFlavor":
                return checkIfCardTemplateHasProperty(oCardProperties.template, sElement);
            case "sortOrder":
            case "sortBy":
                return (!!oCardProperties[sElement] && !oCardProperties.staticContent);
            case "dataPoint":
                return (checkIfCardTemplateHasProperty(oCardProperties.template, "kpiHeader") && !!oCardProperties.dataPointAnnotationPath);
            case "identification":
            case "presentationVariant":
            case "selectionVariant":
                return (!oCardProperties.staticContent);
            case "kpiHeader":
            case "lineItem":
            case "chart":
                return checkIfCardTemplateHasProperty(oCardProperties.template, sElement);
            case "lineItemSubTitle":
            case "lineItemTitle":
            case "staticLink":
            case "links":
                var bFlag = (oCardProperties.template === "sap.ovp.cards.linklist" && !!oCardProperties.staticContent);
                if (sElement === "staticLink") {
                    return (bFlag && !!oCardProperties.staticContent[0].targetUri);
                } else if (sElement === "links") {
                    return (bFlag && !!oCardProperties.staticContent[0].semanticObject);
                } else {
                    return bFlag;
                }
            default :
                break;
        }
    }

    function setVisibilityForFormElements(oCardProperties) {
        // setting Visibility for Form Elements in settingDialog
        this.oVisibility["title"] = getVisibilityOfElement(oCardProperties, "title");
        this.oVisibility["subTitle"] = getVisibilityOfElement(oCardProperties, "subTitle");
        this.oVisibility["kpiHeader"] = getVisibilityOfElement(oCardProperties, "kpiHeader");
        this.oVisibility["valueSelectionInfo"] = getVisibilityOfElement(oCardProperties, "valueSelectionInfo");
        this.oVisibility["listType"] = getVisibilityOfElement(oCardProperties, "listType");
        this.oVisibility["listFlavor"] = getVisibilityOfElement(oCardProperties, "listFlavor");
        this.oVisibility["sortOrder"] = getVisibilityOfElement(oCardProperties, "sortOrder");
        this.oVisibility["sortBy"] = getVisibilityOfElement(oCardProperties, "sortBy");
        this.oVisibility["staticLink"] = getVisibilityOfElement(oCardProperties, "staticLink");
        this.oVisibility["links"] = getVisibilityOfElement(oCardProperties, "links");
        this.oVisibility["lineItemTitle"] = getVisibilityOfElement(oCardProperties, "lineItemTitle");
        this.oVisibility["lineItemSubTitle"] = getVisibilityOfElement(oCardProperties, "lineItemSubTitle");
    }

    function _getOvpLibResourceBundle() {
        var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ovp");
        var ovplibResourceBundle = oResourceBundle ? new sap.ui.model.resource.ResourceModel({
            bundleUrl: oResourceBundle.oUrlInfo.url
        }) : null;
        return ovplibResourceBundle;
    }

	function addManifestSettings(oData) {
		var oEntityType = oData.entityType,
         	aVariantNames = [ {
							sVariant : ".SelectionVariant",
							sPath : "selectionVariant"
						}, {
							sVariant : ".PresentationVariant",
							sPath : "presentationVariant"
						}, {
							sVariant : ".Identification",
							sPath : "identification"
						}, {
							sVariant : ".DataPoint",
							sPath : "dataPoint"
						}, {
							sVariant : ".Chart",
							sPath : "chart"
						}, {
                            sVariant: ".LineItem",
                            sPath: "lineItem"
                        } ];
		for (var i = 0 ; i < aVariantNames.length ; i++ ) {
			var aVariants = [];
			for (var key in oEntityType) {
		        if (oEntityType.hasOwnProperty(key) && key.indexOf(aVariantNames[i].sVariant) !== -1) {
                    if (aVariantNames[i].sVariant === ".LineItem") {
                        var variant = {
                            name: getAnnotationLabel(oEntityType, key),
                            value: key,
                            fields: sap.ovp.cards.AnnotationHelper.sortCollectionByImportance(oEntityType[key])
                        };
                        aVariants.push(variant);
                        if (key === oData.annotationPath) {
                            oData.lineItemQualifier = variant.name;
                        }
                    } else {
                        aVariants.push({name: getAnnotationLabel(oEntityType, key), value: key});
                    }
		        }
		    }
			if (aVariants.length !== 0 &&
                (aVariantNames[i].sPath !== "dataPoint" || checkIfCardTemplateHasProperty(oData.template, "kpiHeader"))) {
				oData[aVariantNames[i].sPath] = aVariants;
		    }
            this.oVisibility[aVariantNames[i].sPath] = (getVisibilityOfElement(oData, aVariantNames[i].sPath) && aVariants.length !== 0);
		}
		return oData;
	}

	function getCrossAppNavigationLinks(oModel) {
		var oData = oModel.getData();
	    sap.ushell.Container.getService('CrossApplicationNavigation').getLinks()
	        .done(function (aLinks) {
	            var aAllIntents = [],
	                oLinkToTextMapping = {};
	            for (var i = 0; i < aLinks.length; i++) {
	                aAllIntents.push(aLinks[i].intent);
	                oLinkToTextMapping[aLinks[i].intent] = aLinks[i].text;
	            }
//	            this.oLinkToTextMapping = oLinkToTextMapping;
	            // Checks for the supported Intents for the user
	            sap.ushell.Container.getService('CrossApplicationNavigation').isIntentSupported(aAllIntents)
	                .done(function (oResponse) {
	                    // Setting the model of Dialog Form with Semantic Objects and Actions
	                    var aLinks = [];
	                    for (var key in oResponse) {
	                        if (oResponse.hasOwnProperty(key) && oResponse[key].supported === true && oLinkToTextMapping && oLinkToTextMapping[key]) {
	                            aLinks.push({name: oLinkToTextMapping[key], value: key});
	                        }
	                    }
	                    var cardManifestSettings = oData;
	                    if (aLinks.length !== 0 || aLinks.length !== 0) {
	                        cardManifestSettings['links'] = aLinks;
	                    }
	                    oModel.refresh();
	                })
	               .fail(function (oError) {
	                    jQuery.sap.log.error(oError);
	                });
	        })
	        .fail(function (oError) {
	            jQuery.sap.log.error(oError);
	        });
	}
	
	var oSettingsUtils = {
		
			dialogBox: undefined,
            FORM_ITEM_NAME_FOR_LIST_FLAVOR_IN_LINKLIST: sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("OVP_KEYUSER_CAROUSEL"),
            FORM_ITEM_NAME_FOR_LIST_FLAVOR_IN_LIST: sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("OVP_KEYUSER_BARLIST"),
            addManifestSettings: addManifestSettings,
            setVisibilityForFormElements: setVisibilityForFormElements,
            oVisibility: {
                "title": true,
                "subTitle": true,
                "kpiHeader": true,
                "valueSelectionInfo": true,
                "listType": true,
                "listFlavor": true,
                "sortOrder": true,
                "sortBy": true,
                "selectionVariant": true,
                "presentationVariant": true,
                "lineItem": true,
                "identification": true,
                "dataPoint": true,
                "chart": true,
                "links": false,
                "lineItemTitle": false,
                "lineItemSubTitle": false,
                "staticLink": false
            },

			getDialogBox: function(oComponentContainer) {
				return new Promise(function(resolve, reject) {
					if (!this.dialogBox) {
	            		// settings dialog save button
                        // Attached this button to 'this' scope to get it in setting controller and attach save
                        // function to it.
	            		this.oSaveButton = new Button("settingsSaveBtn", {
	            			text: sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("save")
	            		});
	            		// settings dialog close button
	            		var oCancelButton = new Button("settingsCancelBtn", {
	            			text: sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("cancelBtn")
	            		});
	            		// settings dialog
	            		this.dialogBox = new Dialog("settingsDialog", {
	            			title: sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("settingsDialogTitle"),
	            			buttons: [this.oSaveButton, oCancelButton],
	            			resizable: true,
	            			// TODO: confirm width
                            contentWidth: "70%",
                            // destroy the view on close of dialog (?)
                            // TODO: confirm if we can just destroy the card component, rest of the things can be updated via model data binding
                            afterClose: function(oEvent) {
                            	this.dialogBox.destroyContent();
                            }.bind(this)
	            		});
	            		this.dialogBox.setBusyIndicatorDelay(0);
	            		oCancelButton.attachPress(function(oEvent) {
	            			this.dialogBox.close();
	            		}.bind(this));
					}

					// card properties and model
					var oCardProperties = oComponentContainer.getComponentInstance().getRootControl().getModel("ovpCardProperties").getData(),
						oCardProperties = this.addManifestSettings(oCardProperties),
						oCardPropertiesModel = new sap.ui.model.json.JSONModel(oCardProperties),
                        ovplibResourceBundle = _getOvpLibResourceBundle();

                    if (oCardProperties.template === "sap.ovp.cards.linklist") {
                        oCardPropertiesModel.setProperty("/listFlavorName", this.FORM_ITEM_NAME_FOR_LIST_FLAVOR_IN_LINKLIST);
                    } else {
                        oCardPropertiesModel.setProperty("/listFlavorName", this.FORM_ITEM_NAME_FOR_LIST_FLAVOR_IN_LIST);
                    }

                    if (oCardProperties.template === "sap.ovp.cards.linklist" && oCardProperties.staticContent) {
                        getCrossAppNavigationLinks(oCardPropertiesModel);
                        oCardPropertiesModel.setProperty("/lineItemId", "linkListItem--1");
                    }

                    this.setVisibilityForFormElements(oCardProperties);
                    var oVisibilityModel = new sap.ui.model.json.JSONModel(this.oVisibility);

					// settings view
            		var oSettingsView = new sap.ui.view("settingsView", {
            			viewName: "sap.ovp.cards.rta.SettingsDialog",
            			type: sap.ui.core.mvc.ViewType.XML,
            			preprocessors: {
            				xml: {
    							bindingContexts: {
    								ovpCardProperties: oCardPropertiesModel.createBindingContext("/")
    							},
    							models: {
    								ovpCardProperties: oCardPropertiesModel
    							}
    						}
            			}
            		});
            		oSettingsView.setModel(oCardPropertiesModel);
                    oSettingsView.setModel(ovplibResourceBundle, "ovplibResourceBundle");
                    oSettingsView.setModel(oVisibilityModel, "visibility");
            		// check for tabs and set the iconTabBar accordingly
					// TODO: Why are we adding icon tab bar to the dialog instead of the view?
					if (hasViewSwitch(oComponentContainer.getComponentInstance())) {
						addIconTabBarToDialog(oComponentContainer.getComponentInstance(), oSettingsView, this.dialogBox);
					} else {
						this.dialogBox.addContent(oSettingsView);
					}
					var componentContainerHeight = oComponentContainer.getDomRef().offsetHeight;
            		oSettingsView.loaded().then(function(oView) {
            			// set the width of the component container for settings card
            			var oLayout = oComponentContainer.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout();
            			oView.byId('dialogCard').setWidth(oLayout.getColumnWidth(oLayout.columnStyle) + "rem");
            			addCardToView(oComponentContainer, oView);
            			oView.byId("dialogCard").setHeight(componentContainerHeight + "px");
            			resolve(this.dialogBox);
            		}.bind(this));
				}.bind(this));	
			}
		
	};
	
	return oSettingsUtils;
},
/* bExport= */true);
