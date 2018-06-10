/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/**
 * Provides utility functions for the personalization dialog
 *
 * @author SAP SE
 * @version 1.50.6
 * @private
 * @since 1.25.0
 * @alias sap.ui.comp.personalization.Util
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.define([
	'sap/ui/comp/library', './Factory', './LinkData', 'sap/m/Link', 'sap/m/Text', 'sap/ui/layout/form/SimpleFormLayout', 'sap/m/Label', 'sap/ui/core/TitleLevel', 'sap/ui/core/Title', 'sap/ui/layout/form/SimpleForm', 'sap/m/Image'
], function(CompLibrary, Factory, LinkData, Link, Text, SimpleFormLayout, Label, CoreTitleLevel, CoreTitle, SimpleForm, Image) {
	"use strict";
	var Util = {

		/**
		 * Returns available actions with key.
		 *
		 * @param {Object[]} aMAvailableActions
		 */
		getStorableAvailableActions: function(aMAvailableActions) {
			return aMAvailableActions.filter(function(oMAvailableAction) {
				return oMAvailableAction.key !== undefined;
			});
		},

		/**
		 * Sort the string array in alphabetical order.
		 *
		 * @param {String[]} aNames
		 */
		sortArrayAlphabetical: function(aNames) {
			var sLanguage;
			try {
				sLanguage = sap.ui.getCore().getConfiguration().getLocale().toString();
				if (typeof window.Intl !== 'undefined') {
					var oCollator = window.Intl.Collator(sLanguage, {
						numeric: true
					});
					aNames.sort(function(a, b) {
						return oCollator.compare(a, b);
					});
				} else {
					aNames.sort(function(a, b) {
						return a.localeCompare(b, sLanguage, {
							numeric: true
						});
					});
				}
			} catch (oException) {
				// this exception can happen if the configured language is not convertible to BCP47 -> getLocale will deliver an exception
			}
		},

		/**
		 * New implementation.
		 */
		retrieveNavigationTargets: function(sSemanticObjectDefault, aAdditionalSemanticObjects, sAppStateKey, oComponent, oSemanticAttributes, sMainNavigationId) {
			var oNavigationTargets = {
				mainNavigation: undefined,
				ownNavigation: undefined,
				availableActions: []
			};
			return new Promise(function(resolve) {
				var oXApplNavigation = Factory.getService("CrossApplicationNavigation");
				var oURLParsing = Factory.getService("URLParsing");
				if (!oXApplNavigation || !oURLParsing) {
					jQuery.sap.log.error("Service 'CrossApplicationNavigation' or 'URLParsing' could not be obtained");
					return resolve(oNavigationTargets);
				}
				var aSemanticObjects = [
					sSemanticObjectDefault
				].concat(aAdditionalSemanticObjects);
				var aParams = aSemanticObjects.map(function(sSemanticObject) {
					return [
						{
							semanticObject: sSemanticObject,
							params: oSemanticAttributes ? oSemanticAttributes[sSemanticObject] : undefined,
							appStateKey: sAppStateKey,
							ui5Component: oComponent,
							sortResultsBy: "text" // since 1.50
						}
					];
				});

				oXApplNavigation.getLinks(aParams).then(function(aLinks) {
					if (!aLinks || !aLinks.length) {
						return resolve(oNavigationTargets);
					}
					var sCurrentHash = oXApplNavigation.hrefForExternal();
					if (sCurrentHash && sCurrentHash.indexOf("?") !== -1) {
						// sCurrentHash can contain query string, cut it off!
						sCurrentHash = sCurrentHash.split("?")[0];
					}
					if (sCurrentHash) {
						// BCP 1770315035: we have to set the end-point '?' of action in order to avoid matching of "#SalesOrder-manage" in "#SalesOrder-manageFulfillment"
						sCurrentHash += "?";
					}

					aLinks[0][0].forEach(function(oLink) {
						var oShellHash = oURLParsing.parseShellHash(oLink.intent);
						var sKey = (oShellHash.semanticObject && oShellHash.action) ? oShellHash.semanticObject + "-" + oShellHash.action : undefined;
						var isSuperiorAction = (oLink.tags && oLink.tags.indexOf("superiorAction") > -1);

						if (oLink.intent.indexOf(sCurrentHash) === 0) {
							// Prevent current app from being listed
							// NOTE: If the navigation target exists in
							// multiple contexts (~XXXX in hash) they will all be skipped
							oNavigationTargets.ownNavigation = new LinkData({
								key: sKey,
								href: oLink.intent,
								text: oLink.text,
								visible: true,
								isSuperiorAction: isSuperiorAction
							});
							return;
						}
						// Check if a FactSheet exists for this SemanticObject (to skip the first one found)

						if (oShellHash.action && (oShellHash.action === 'displayFactSheet')) {
							// Prevent FactSheet from being listed in 'Related Apps' section. Requirement: Link with action 'displayFactSheet' should
							// be shown in the 'Main Link' Section
							oNavigationTargets.mainNavigation = new LinkData({
								key: sKey,
								href: oLink.intent,
								text: sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"),
								visible: true,
								isSuperiorAction: isSuperiorAction
							});
							return;
						}
						oNavigationTargets.availableActions.push(new LinkData({
							key: sKey,
							href: oLink.intent,
							text: oLink.text,
							visible: true,
							isSuperiorAction: isSuperiorAction
						}));
					});

					// Main navigation could not be resolved, so only set link text as MainNavigation
					if (!oNavigationTargets.mainNavigation && typeof sMainNavigationId === "string") {
						oNavigationTargets.mainNavigation = new LinkData({
							text: sMainNavigationId,
							visible: true
						});
					}

					var aAvailableIntents = [];
					for (var i = 1; i < aSemanticObjects.length; i++) {
						aAvailableIntents = aAvailableIntents.concat(aLinks[i][0]);
					}
					aAvailableIntents.forEach(function(oLink) {
						var oShellHash = oURLParsing.parseShellHash(oLink.intent);
						oNavigationTargets.availableActions.push(new LinkData({
							key: (oShellHash.semanticObject && oShellHash.action) ? oShellHash.semanticObject + "-" + oShellHash.action : undefined,
							href: oLink.intent,
							text: oLink.text,
							visible: true,
							isSuperiorAction: (oLink.tags && oLink.tags.indexOf("superiorAction") > -1)
						}));
					});

					return resolve(oNavigationTargets);
				}, function() {
					jQuery.sap.log.error("'retrieveNavigationTargets' failed");
					return resolve(oNavigationTargets);
				});
			});
		},

		/**
		 * @param {string} sPropertyName
		 * @param {sap.ui.model.odata.ODataModel} oODataModel
		 * @param {string} sBindingPath Qualified name with namespace of current EntityType
		 * @returns {object || null}
		 * @private
		 */
		retrieveSemanticObjectMapping: function(sPropertyName, oODataModel, sBindingPath) {
			if (!sPropertyName) {
				return Promise.resolve(null);
			}
			// ODataModel returns MetaModel, JSONModel returns undefined
			if (!oODataModel || !oODataModel.getMetaModel()) {
				return Promise.resolve(null);
			}
			var that = this;
			var oMetaModel = oODataModel.getMetaModel();
			return new Promise(function(resolve) {
				oMetaModel.loaded().then(function() {
					var sOwnEntityType = that._getEntityTypeNameOfBindingContext(sBindingPath, oMetaModel);
					var oEntityType = oMetaModel.getODataEntityType(sOwnEntityType);
					if (!oEntityType) {
						return resolve(null);
					}
					var aProperties = oEntityType.property.filter(function(oProperty) {
						return oProperty.name === sPropertyName;
					});
					if (aProperties.length !== 1) {
						return resolve(null);
					}
					if (!aProperties[0]["com.sap.vocabularies.Common.v1.SemanticObjectMapping"]) {
						return resolve(null);
					}
					var oSemanticObjectQualifiers = that._getSemanticObjectMappingsOfProperty(aProperties[0], that._getSemanticObjectsOfProperty(aProperties[0]));
					var oSemanticObjects = {};
					for ( var sQualifier in oSemanticObjectQualifiers) {
						oSemanticObjects[oSemanticObjectQualifiers[sQualifier].name] = oSemanticObjectQualifiers[sQualifier].mapping;
					}

					return resolve(oSemanticObjects);
				});
			});
		},

		_getSemanticObjectsOfProperty: function(oProperty) {
			var oSemanticObjects = {};
			for ( var sAttr in oProperty) {
				var sAnnotationName = sAttr.split("#")[0];
				var sQualifierName = sAttr.split("#")[1] || ""; // as of specification the qualifier MUST have at least one character
				if (jQuery.sap.startsWith(sAnnotationName, "com.sap.vocabularies.Common.v1.SemanticObject") && jQuery.sap.endsWith(sAnnotationName, "com.sap.vocabularies.Common.v1.SemanticObject")) {
					oSemanticObjects[sQualifierName] = {
						name: oProperty[sAttr]["String"],
						mapping: undefined
					};
				}
			}
			return oSemanticObjects;
		},

		_getSemanticObjectMappingsOfProperty: function(oProperty, oSemanticObjects) {
			var fGetMapping = function(oSemanticObjectMappingAnnotation) {
				var oMapping = {};
				if (jQuery.isArray(oSemanticObjectMappingAnnotation)) {
					oSemanticObjectMappingAnnotation.forEach(function(oPair) {
						oMapping[oPair.LocalProperty.PropertyPath] = oPair.SemanticObjectProperty.String;
					});
				}
				return oMapping;
			};
			for ( var sAttr in oProperty) {
				var sAnnotationName = sAttr.split("#")[0];
				var sQualifierName = sAttr.split("#")[1] || ""; // as of specification the qualifier MUST have at least one character
				if (jQuery.sap.startsWith(sAnnotationName, "com.sap.vocabularies.Common.v1.SemanticObjectMapping") && jQuery.sap.endsWith(sAnnotationName, "com.sap.vocabularies.Common.v1.SemanticObjectMapping")) {
					if (oSemanticObjects[sQualifierName]) {
						oSemanticObjects[sQualifierName].mapping = fGetMapping(oProperty[sAttr]);
					}
				}
			}
			return oSemanticObjects;
		},

		/**
		 * @param {string} sBindingPath
		 * @param {sap.ui.model.odata.ODataMetaModel} oMetaModel
		 * @returns {string || null}
		 * @private
		 */
		_getEntityTypeNameOfBindingContext: function(sBindingPath, oMetaModel) {
			if (!sBindingPath || !oMetaModel) {
				return null;
			}
			var oMetaContext = oMetaModel.getMetaContext(sBindingPath);
			if (!oMetaContext) {
				return null;
			}
			var oObj = oMetaModel.getObject(oMetaContext.getPath());
			return oObj.namespace ? oObj.namespace + "." + oObj.name : oObj.name;
		},

		/**
		 * @param {sap.ui.model.odata.ODataModel} oODataModel
		 * @param {string} sBindingPath
		 * @param {string || ""} sCommunicationContactAnnotationPath NavigationProperty or foreign simple EntitySet with communication contact
		 *        annotation
		 * @returns {object}
		 * @private
		 */
		retrieveContactAnnotationData: function(oODataModel, sBindingPath, sCommunicationContactAnnotationPath) {
			var that = this;
			return new Promise(function(resolve) {
				// ODataModel returns MetaModel, JSONModel returns undefined
				if (!oODataModel || !oODataModel.getMetaModel() || sCommunicationContactAnnotationPath === undefined) {
					return resolve({
						entitySet: undefined,
						path: undefined,
						contactAnnotation: undefined
					});
				}
				var oMetaModel = oODataModel.getMetaModel();
				oMetaModel.loaded().then(function() {
					var sOwnEntityType = that._getEntityTypeNameOfBindingContext(sBindingPath, oMetaModel);
					var oEntityType = oMetaModel.getODataEntityType(sOwnEntityType);
					if (!oEntityType) {
						return resolve({
							entitySet: undefined,
							path: undefined,
							contactAnnotation: undefined
						});
					}

					// Check if 'sCommunicationContactAnnotationPath' is a navigationProperty or an entitySet
					var oEntitySet = oMetaModel.getODataEntitySet(sCommunicationContactAnnotationPath);
					if (oEntitySet) {
						// 'sCommunicationContactAnnotationPath' is an entitySet
						oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
						return resolve({
							entitySet: sCommunicationContactAnnotationPath,
							path: "",
							contactAnnotation: oEntityType["com.sap.vocabularies.Communication.v1.Contact"]
						});
					}

					// 'sCommunicationContactAnnotationPath' is a navigationProperty
					var aAssociationPaths = [];
					sCommunicationContactAnnotationPath.split("/").some(function(sNavigationProperty) {
						var oAssociation = oMetaModel.getODataAssociationEnd(oEntityType, sNavigationProperty);
						if (!oAssociation) {
							return false;
						}
						aAssociationPaths.push(sNavigationProperty);
						oEntityType = oMetaModel.getODataEntityType(oAssociation.type);
					});

					return resolve({
						entitySet: undefined,
						path: oEntityType["com.sap.vocabularies.Communication.v1.Contact"] ? aAssociationPaths.join("/") : undefined,
						contactAnnotation: oEntityType["com.sap.vocabularies.Communication.v1.Contact"]
					});
				});
			});
		},

		/**
		 * <code>
		 * 	group: {heading: "", elements: []}
		 *  element: {valuePath: "", label: "", value: "", url: "", target: "", emailSubject: "", type: sap.m.QuickViewGroupElementType}
		 * </code>
		 */
		parseContactAnnotation: function(oContactAnnotationData) {
			var oContactAnnotation = oContactAnnotationData.contactAnnotation;
			if (!oContactAnnotation || jQuery.isEmptyObject(oContactAnnotation)) {
				return {
					header: {},
					groups: [],
					expand: "",
					select: ""
				};
			}

			var sPath = oContactAnnotationData.path ? oContactAnnotationData.path + "/" : "";
			var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
			var aExpand = [
				oContactAnnotationData.path
			];
			var aSelects = [];
			var aGroups = [];

			// Contact Details -------------------------------------------------------
			var oGroup = {
				heading: oResourceBundle.getText("POPOVER_CONTACT_SECTION_TITLE"),
				elements: []
			};
			if (oContactAnnotation.photo) {
				aSelects.push(sPath + oContactAnnotation.photo.Path);
				oGroup.elements.push({
					valuePath: sPath + oContactAnnotation.photo.Path,
					label: "",
					type: "image"
				});
			}
			if (oContactAnnotation.fn) {
				aSelects.push(sPath + oContactAnnotation.fn.Path);
				oGroup.elements.push({
					valuePath: sPath + oContactAnnotation.fn.Path,
					label: oResourceBundle.getText("POPOVER_CONTACT_SECTION_NAME"),
					type: sap.m.QuickViewGroupElementType.text
				});
			}
			if (oContactAnnotation.role) {
				aSelects.push(sPath + oContactAnnotation.role.Path);
				oGroup.elements.push({
					valuePath: sPath + oContactAnnotation.role.Path,
					label: oResourceBundle.getText("POPOVER_CONTACT_SECTION_ROLE"),
					type: sap.m.QuickViewGroupElementType.text
				});
			}
			if (oContactAnnotation.title) {
				aSelects.push(sPath + oContactAnnotation.title.Path);
				oGroup.elements.push({
					valuePath: sPath + oContactAnnotation.title.Path,
					label: oResourceBundle.getText("POPOVER_CONTACT_SECTION_JOBTITLE"),
					type: sap.m.QuickViewGroupElementType.text
				});
			}
			if (oContactAnnotation.org) {
				aSelects.push(sPath + oContactAnnotation.org.Path);
				oGroup.elements.push({
					valuePath: sPath + oContactAnnotation.org.Path,
					label: oResourceBundle.getText("POPOVER_CONTACT_SECTION_DEPARTMENT"),
					type: sap.m.QuickViewGroupElementType.text
				});
			}
			if (oContactAnnotation.email) {
				oContactAnnotation.email.forEach(function(oEmail) {
					if (oEmail.type && oEmail.type.EnumMember.indexOf("com.sap.vocabularies.Communication.v1.ContactInformationType/work") > -1) {
						aSelects.push(sPath + oEmail.address.Path);
						oGroup.elements.push({
							valuePath: sPath + oEmail.address.Path,
							label: oResourceBundle.getText("POPOVER_CONTACT_SECTION_EMAIL"),
							type: sap.m.QuickViewGroupElementType.email
						});
					}
				});
			}
			// type: e.g. "com.sap.vocabularies.Communication.v1.PhoneType/fax Communication.v1.PhoneType/work" or
			// "com.sap.vocabularies.Communication.v1.PhoneType/work"
			if (oContactAnnotation.tel) {
				var oFax, oMobile, oPhone;
				oContactAnnotation.tel.forEach(function(oTel) {
					if (oTel.type && oTel.type.EnumMember.indexOf("com.sap.vocabularies.Communication.v1.PhoneType/fax") > -1) {
						aSelects.push(sPath + oTel.uri.Path);
						oFax = {
							valuePath: sPath + oTel.uri.Path,
							label: oResourceBundle.getText("POPOVER_CONTACT_SECTION_FAX"),
							type: sap.m.QuickViewGroupElementType.phone
						};
					} else if (oTel.type && oTel.type.EnumMember.indexOf("com.sap.vocabularies.Communication.v1.PhoneType/cell") > -1) {
						aSelects.push(sPath + oTel.uri.Path);
						oMobile = {
							valuePath: sPath + oTel.uri.Path,
							label: oResourceBundle.getText("POPOVER_CONTACT_SECTION_MOBILE"),
							type: sap.m.QuickViewGroupElementType.phone
						};
					} else if (oTel.type && oTel.type.EnumMember.indexOf("com.sap.vocabularies.Communication.v1.PhoneType/work") > -1) {
						aSelects.push(sPath + oTel.uri.Path);
						oPhone = {
							valuePath: sPath + oTel.uri.Path,
							label: oResourceBundle.getText("POPOVER_CONTACT_SECTION_PHONE"),
							type: sap.m.QuickViewGroupElementType.phone
						};
					}
				});
				if (oPhone) {
					oGroup.elements.push(oPhone);
				}
				if (oMobile) {
					oGroup.elements.push(oMobile);
				}
				if (oFax) {
					oGroup.elements.push(oFax);
				}
			}

			if (oGroup.elements.length) {
				aGroups.push(oGroup);
			}

			return {
				groups: aGroups,
				expand: aExpand.join(","),
				select: aSelects.join(",")
			};
		},

		/**
		 *
		 */
		createContactDetailForms: function(aGroups) {
			if (!aGroups.length) {
				return [];
			}

			var aForms = [];
			aGroups.forEach(function(oGroup) {
				if (!oGroup.elements.length) {
					return;
				}
				var oGroupForm = new SimpleForm({
					maxContainerCols: 1,
					editable: false,
					layout: SimpleFormLayout.ResponsiveGridLayout
				});

				oGroup.elements.forEach(function(oElement) {
					var oControl = Util._createControl(oElement);
					if (!oControl) {
						return;
					}

					if (oElement.label) {
						var oLabel = new Label({
							text: oElement.label,
							labelFor: oControl.getId()
						});
						oGroupForm.addContent(oLabel);
					}
					oGroupForm.addContent(oControl);
				});

				if (oGroupForm.getContent().length && oGroup.heading) {
					oGroupForm.insertContent(new CoreTitle({
						text: oGroup.heading,
						level: CoreTitleLevel.H2
					}), 0);
				}
				aForms.push(oGroupForm);
			});
			return aForms;
		},

		/**
		 *
		 */
		_createControl: function(oGroupElement) {
			switch (oGroupElement.type) {
				case "email":
					return new Link({
						href: {
							path: oGroupElement.valuePath,
							formatter: function(oValue) {
								if (!oValue) {
									return oValue;
								}
								return "mailto:" + oValue + (oGroupElement.emailSubject ? '?subject=' + oGroupElement.emailSubject : '');
							}
						},
						text: {
							path: oGroupElement.valuePath
						},
						visible: {
							path: oGroupElement.valuePath,
							formatter: function(oValue) {
								return !!oValue;
							}
						}
					});
				case "phone":
				case "mobile":
					return new Link({
						href: {
							path: oGroupElement.valuePath,
							formatter: function(oValue) {
								if (!oValue) {
									return oValue;
								}
								return "tel:" + oValue;
							}
						},
						text: {
							path: oGroupElement.valuePath
						},
						visible: {
							path: oGroupElement.valuePath,
							formatter: function(oValue) {
								return !!oValue;
							}
						}
					});
				case "image":
					var oImage = new Image({
						// width: "3rem",
						src: {
							path: oGroupElement.valuePath
						},
						visible: {
							path: oGroupElement.valuePath,
							formatter: function(oValue) {
								return !!oValue;
							}
						},
						decorative: false
					});
					oImage.addStyleClass("sapUiIcon");
					oImage.addStyleClass("navigationPopoverThumbnail");
					return oImage;
				default:
					return new Text({
						text: {
							path: oGroupElement.valuePath
						},
						visible: {
							path: oGroupElement.valuePath,
							formatter: function(oValue) {
								return !!oValue;
							}
						}
					});
			}
		}

	};
	return Util;
}, /* bExport= */true);
