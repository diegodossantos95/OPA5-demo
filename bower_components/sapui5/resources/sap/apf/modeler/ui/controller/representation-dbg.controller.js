/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require("sap.apf.ui.utils.constants");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require('sap.apf.modeler.ui.utils.representationTypesHandler');
jQuery.sap.require('sap.apf.modeler.ui.utils.stepPropertyMetadataHandler');
jQuery.sap.require('sap.apf.modeler.ui.utils.representationHandler');
jQuery.sap.require('sap.apf.modeler.ui.utils.representationBasicDataHandler');
jQuery.sap.require('sap.apf.modeler.ui.utils.sortDataHandler');
jQuery.sap.require('sap.apf.modeler.ui.utils.nullObjectChecker');
jQuery.sap.require('sap.apf.modeler.ui.utils.optionsValueModelBuilder');
(function() {
	'use strict';
	var oParams, oCoreApi, oConfigurationEditor, oRepresentation, oParentStep, oRepresentationTypeHandler, oStepPropertyMetadataHandler, oRepresentationHandler, oRepresentationBasicDataHandler, oSortDataHandler;
	var nullObjectChecker = new sap.apf.modeler.ui.utils.NullObjectChecker();
	var optionsValueModelBuilder = new sap.apf.modeler.ui.utils.OptionsValueModelBuilder();
	var oLabelDisplayOptions = sap.apf.core.constants.representationMetadata.labelDisplayOptions;
	function _setDisplayText(oController) {
		oController.byId("idVisualization").setText(oCoreApi.getText("visualization"));
		oController.byId("idChartTypeLabel").setText(oCoreApi.getText("chartType"));
		oController.byId("idChartTypeLabel").setTooltip(oCoreApi.getText("chartType"));
		oController.byId("idBasicData").setText(oCoreApi.getText("basicData"));
		oController.byId("idSorting").setText(oCoreApi.getText("sorting"));
	}
	function _updateTreeNode(oController, sRepresentationTypeText) {
		var oRepnInfo;
		var oIconForRepn = oRepresentationTypeHandler.getPictureOfRepresentationType(oRepresentation.getRepresentationType());
		var aStepCategories = oConfigurationEditor.getCategoriesForStep(oParentStep.getId());
		if (aStepCategories.length === 1) {//In case the step of representation is only assigned to one category
			oRepnInfo = {
				id : oRepresentation.getId(),
				icon : oIconForRepn
			};
			if (sRepresentationTypeText) {
				oRepnInfo.name = sRepresentationTypeText;
			}
			oController.getView().getViewData().updateSelectedNode(oRepnInfo);
		} else {
			oController.getView().getViewData().updateTree();
		}
	}
	// Updates the title and bread crumb with new chart type
	function _updateBreadCrumb(oController, sRepresentationTypeText) {
		var sTitle = oCoreApi.getText("representation") + ": " + sRepresentationTypeText;
		oController.getView().getViewData().updateTitleAndBreadCrumb(sTitle);
	}
	function _updateRepresentationType(sRepresentationType) {
		oRepresentation.setRepresentationType(sRepresentationType);
		var sAlternateRepresentationType = "TableRepresentation";
		if (sRepresentationType === sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION || sRepresentationType === sap.apf.ui.utils.CONSTANTS.representationTypes.TREE_TABLE_REPRESENTATION) {
			sAlternateRepresentationType = undefined;
		}
		oRepresentation.setAlternateRepresentationType(sAlternateRepresentationType); // set alternate representation for charts
	}
	function _setDefaultStateOfDimensionAsPromise(sRepresentationType) {
		var bIsKindUsed;
		var deferred = jQuery.Deferred();
		oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {//new
			var dimensionProperties = oStepPropertyMetadataHandler.getDimensionsProperties(oEntityTypeMetadata);
			var aDefaultDimensionKinds = oRepresentationTypeHandler.getKindsForDimensionPropertyType(sRepresentationType);
			aDefaultDimensionKinds.forEach(function(sKind, nIndex) {
				bIsKindUsed = false;
				var bIsTextPropertyPresent;
				var sDefaultLabelDisplayOption;
				var sDefaultDimension = dimensionProperties[nIndex];
				if (oRepresentation.getDimensions().length !== 0) {
					if (oRepresentation.getDimensions()[nIndex]) {
						if (oRepresentation.getDimensionKind(oRepresentation.getDimensions()[nIndex])) {
							bIsKindUsed = true;
						}
					}
				}
				if (!bIsKindUsed && sDefaultDimension) {
					bIsTextPropertyPresent = oStepPropertyMetadataHandler.hasTextPropertyOfDimension(oEntityTypeMetadata, sDefaultDimension);
					sDefaultLabelDisplayOption = bIsTextPropertyPresent ? oLabelDisplayOptions.KEY_AND_TEXT : oLabelDisplayOptions.KEY;
					oRepresentation.addDimension(sDefaultDimension);
					oRepresentation.setLabelDisplayOption(sDefaultDimension, sDefaultLabelDisplayOption);
					oRepresentation.setDimensionKind(sDefaultDimension, aDefaultDimensionKinds[0]);
				}
			});
			deferred.resolve();
		});
		return deferred.promise();
	}
	function _getNodeIdForHierarchicalProperty(oEntityTypeMetadata) {
		var bIsTextPropertyPresent;
		var sService = oStepPropertyMetadataHandler.oStep.getService();
		var sEntitySet = oStepPropertyMetadataHandler.oStep.getEntitySet();
		var sHierarchyProperty = oStepPropertyMetadataHandler.oStep.getHierarchyProperty();
		oConfigurationEditor.getHierarchyNodeIdAsPromise(sService, sEntitySet, sHierarchyProperty).done(function(sNodeId) {
			bIsTextPropertyPresent = oStepPropertyMetadataHandler.hasTextPropertyOfDimension(oEntityTypeMetadata, sNodeId);
		});
		return bIsTextPropertyPresent;
	}
	function _setDefaultStateOfHierarchyDisplayOptionAsPromise(sRepresentationType) {
		var bIsTextPropertyPresent, sDefaultLabelDisplayOption;
		var deferred = jQuery.Deferred();
		oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {//new
			var sSelectedProperty = oStepPropertyMetadataHandler.getHierarchicalProperty();
			if (sSelectedProperty && (oRepresentation.getHierarchyPropertyLabelDisplayOption() === undefined)) {
				bIsTextPropertyPresent = _getNodeIdForHierarchicalProperty(oEntityTypeMetadata);
				sDefaultLabelDisplayOption = bIsTextPropertyPresent ? oLabelDisplayOptions.TEXT : oLabelDisplayOptions.KEY;
				oRepresentation.setHierarchyPropertyLabelDisplayOption(sDefaultLabelDisplayOption);
			}
			deferred.resolve();
		});
		return deferred.promise();
	}
	function _setDefaultStateOfMeasureAsPromise(sRepresentationType) {
		var deferred = jQuery.Deferred(), measures, bIsKindUsed;
		var aDefaultMeasureKinds;
		oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {
			aDefaultMeasureKinds = oRepresentationTypeHandler.getKindsForMeasurePropertyType(sRepresentationType);
			measures = oStepPropertyMetadataHandler.getMeasures(oEntityTypeMetadata);
			aDefaultMeasureKinds.forEach(function(sKind, nIndex) {
				bIsKindUsed = false;
				var sDefaultMeasure = measures[nIndex];
				if (oRepresentation.getMeasures().length !== 0) {
					if (oRepresentation.getMeasures()[nIndex]) {
						if (oRepresentation.getMeasureKind(oRepresentation.getMeasures()[nIndex])) {
							bIsKindUsed = true;
						}
					}
				}
				if (!bIsKindUsed && sDefaultMeasure) {
					oRepresentation.addMeasure(sDefaultMeasure);
					oRepresentation.setMeasureKind(sDefaultMeasure, sKind);
				}
			});
			deferred.resolve();
		});
		return deferred.promise();
	}
	function _setDefaultStateForRepnAsPromise(sRepresentationType) {//new
		var deferred = jQuery.Deferred();
		var sDefaultProperty, aDefaultPropertyKind;
		if (sRepresentationType === "TableRepresentation") {
			//Property
			if (oRepresentation.getProperties().length === 0) {
				aDefaultPropertyKind = oRepresentationTypeHandler.getKindsForPropertyType(sRepresentationType);
				sDefaultProperty = oStepPropertyMetadataHandler.getProperties()[0];
				oRepresentation.addProperty(sDefaultProperty);
				oRepresentation.setPropertyKind(sDefaultProperty, aDefaultPropertyKind[0]);
				deferred.resolve();
			} else {
				deferred.resolve();
			}
		} else if (sRepresentationType === "TreeTableRepresentation") {
			_setDefaultStateOfHierarchyDisplayOptionAsPromise(sRepresentationType).done(function() {
				deferred.resolve();
			});
		} else {
			_setDefaultStateOfDimensionAsPromise(sRepresentationType).done(function() {
				_setDefaultStateOfMeasureAsPromise(sRepresentationType).done(function() {
					deferred.resolve();
				});
			});
		}
		return deferred.promise();
	}
	function _setChartType(oController) {
		var aValidRepresentationTypes = [], oModelForChartType;
		aValidRepresentationTypes = oStepPropertyMetadataHandler.getRepresentationTypesArray();
		oModelForChartType = optionsValueModelBuilder.prepareModel(aValidRepresentationTypes);
		oController.byId("idChartType").setModel(oModelForChartType);
		oController.byId("idChartType").setSelectedKey(oRepresentation.getRepresentationType());
	}
	function _retrieveStepObject() {
		if (oParams && oParams.arguments && oParams.arguments.stepId) {
			oParentStep = oConfigurationEditor.getStep(oParams.arguments.stepId);
		}
	}
	function _retrieveDefaultRepresentationtype() {
		var sDefaultRepresentationType = oCoreApi.getRepresentationTypes()[0].id;
		if (oParentStep.getType() === "hierarchicalStep") {
			sDefaultRepresentationType = "TreeTableRepresentation";
		}
		return sDefaultRepresentationType;
	}
	// Called on initialization to create a new representation or retrieve existing representation
	function _retrieveOrCreateRepnObjectAsPromise(oController) {
		var sRepresentationType;
		var deferred = jQuery.Deferred();
		if (oParams && oParams.arguments && oParams.arguments.representationId) {
			oRepresentation = oParentStep.getRepresentation(oParams.arguments.representationId);
		}
		if (!nullObjectChecker.checkIsNotUndefined(oRepresentation)) {
			oRepresentation = oParentStep.createRepresentation();
			sRepresentationType = _retrieveDefaultRepresentationtype();
			_updateRepresentationType(sRepresentationType);
			_updateTreeNode(oController, oCoreApi.getText(sRepresentationType));
			oConfigurationEditor.setIsUnsaved();
			_setDefaultStateForRepnAsPromise(sRepresentationType).done(function() {
				return deferred.resolve();
			});
		} else {
			sRepresentationType = oRepresentation.getRepresentationType();
			_performCompatabilityAsPromise().done(function() {
				_setDefaultStateForRepnAsPromise(sRepresentationType).done(function() {
					return deferred.resolve();
				});
			});
		}
		return deferred.promise();
	}
	function _insertPreviewButton(oController) {
		var oPreviewButton = new sap.m.Button({
			id : oController.createId("idPreviewButton"),
			text : oCoreApi.getText("preview"),
			press : oController.handlePreviewButtonPress.bind(oController)
		});
		var oFooter = oController.getView().getViewData().oFooter;
		oFooter.addContentRight(oPreviewButton);
	}
	function _instantiateCornerTexts(oController) {
		var oTextPool = oController.getView().getViewData().oConfigurationHandler.getTextPool();
		var oViewData = {
			oTextReader : oCoreApi.getText,
			oConfigurationEditor : oConfigurationEditor,
			oTextPool : oTextPool,
			oParentObject : oRepresentation,
			oParentStep : oParentStep,
			oRepresentationTypeHandler : oRepresentationTypeHandler
		};
		var representationCornerTextController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationCornerTexts");
		var oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.cornerTexts",
			type : sap.ui.core.mvc.ViewType.XML,
			id : oController.createId("representationCornerTexts"),
			viewData : oViewData,
			controller : representationCornerTextController
		});
		oController.byId("idCornerTextsVBox").insertItem(oView);
		oController.getView().attachEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.representation.SETCHARTICON, oView.getController().setChartIcon.bind(oView.getController()));
	}
	function _clearRepresentationBasicData() {
		oRepresentation.getDimensions().forEach(function(sDimension) {
			oRepresentation.removeDimension(sDimension);
		});
		oRepresentation.getMeasures().forEach(function(sMeasure) {
			oRepresentation.removeMeasure(sMeasure);
		});
	}
	function _performCompatabilityForTable() {
		var aDimensions, aMeasures;
		if (oRepresentation.getRepresentationType() === "TableRepresentation") {
			aDimensions = oRepresentation.getDimensions();
			aMeasures = oRepresentation.getMeasures();
			aDimensions.forEach(function(sProperty) {
				oRepresentation.addProperty(sProperty);
				oRepresentation.setPropertyTextLabelKey(sProperty, oRepresentation.getDimensionTextLabelKey(sProperty));
				oRepresentation.setPropertyKind(sProperty, sap.apf.core.constants.representationMetadata.kind.COLUMN);
				oConfigurationEditor.setIsUnsaved();
			});
			aMeasures.forEach(function(sProperty) {
				oRepresentation.addProperty(sProperty);
				oRepresentation.setPropertyTextLabelKey(sProperty, oRepresentation.getMeasureTextLabelKey(sProperty));
				oRepresentation.setPropertyKind(sProperty, sap.apf.core.constants.representationMetadata.kind.COLUMN);
				oConfigurationEditor.setIsUnsaved();
			});
			_clearRepresentationBasicData();
		}
	}
	function _setDefaultLabelDisplayOptionAsPromise(sDimension) {
		var isTextPropertyPresent;
		oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {
			isTextPropertyPresent = oStepPropertyMetadataHandler.hasTextPropertyOfDimension(oEntityTypeMetadata, sDimension);
			if (isTextPropertyPresent) {
				oRepresentation.setLabelDisplayOption(sDimension, oLabelDisplayOptions.KEY_AND_TEXT);
			} else {
				oRepresentation.setLabelDisplayOption(sDimension, oLabelDisplayOptions.KEY);
			}
			oConfigurationEditor.setIsUnsaved();
		});
	}
	function _performCompatabilityForLabelDisplayOptionAsPromise() {
		var deferred = jQuery.Deferred();
		oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {
			oRepresentation.getDimensions().forEach(function(sDimension) {
				if (oRepresentation.getLabelDisplayOption(sDimension) === undefined) {
					_setDefaultLabelDisplayOptionAsPromise(sDimension);
				}
			});
			deferred.resolve();
		});
		return deferred.promise();
	}
	function _performCompatabilityAsPromise() {
		_performCompatabilityForTable();
		return _performCompatabilityForLabelDisplayOptionAsPromise();
	}
	function _instantiateSubViews(oController) {
		oRepresentationBasicDataHandler.instantiateBasicData();
		oSortDataHandler.instantiateRepresentationSortData();
		_instantiateCornerTexts(oController);
	}
	sap.ui.controller("sap.apf.modeler.ui.controller.representation", {
		onInit : function() {
			var oController = this;
			var oViewData = oController.getView().getViewData();
			oCoreApi = oViewData.oCoreApi;
			oParams = oViewData.oParams;
			oConfigurationEditor = oViewData.oConfigurationEditor;
			oRepresentationTypeHandler = new sap.apf.modeler.ui.utils.RepresentationTypesHandler(oCoreApi.getRepresentationTypes());
			_setDisplayText(oController);
			_retrieveStepObject();
			oStepPropertyMetadataHandler = new sap.apf.modeler.ui.utils.StepPropertyMetadataHandler(oCoreApi, oParentStep);
			_retrieveOrCreateRepnObjectAsPromise(oController).done(function() {
				oRepresentationHandler = new sap.apf.modeler.ui.utils.RepresentationHandler(oRepresentation, oRepresentationTypeHandler, oCoreApi.getText);
				oRepresentationBasicDataHandler = new sap.apf.modeler.ui.utils.RepresentationBasicDataHandler(oController.getView(), oStepPropertyMetadataHandler, oRepresentationHandler);
				oSortDataHandler = new sap.apf.modeler.ui.utils.SortDataHandler(oController.getView(), oRepresentation, oStepPropertyMetadataHandler, oCoreApi.getText);
				_instantiateSubViews(oController);
				oController.setDetailData();
				if (oParentStep.getType() !== "hierarchicalStep") {
					_insertPreviewButton(oController);
				}
			});
		},
		setDetailData : function() {
			var oController = this;
			_setChartType(oController);
		},
		handleChangeForChartType : function(oEvent) {
			var oController = this;
			var sNewRepresentationType = oEvent.getParameter("selectedItem").getKey();
			var sRepnTypeText = oCoreApi.getText(sNewRepresentationType);
			var sOldRepresentationType = oRepresentation.getRepresentationType();
			_updateRepresentationType(sNewRepresentationType);
			_updateTreeNode(oController, sRepnTypeText);
			_updateBreadCrumb(oController, sRepnTypeText);
			if (!oRepresentationTypeHandler.isChartTypeSimilar(sOldRepresentationType, sNewRepresentationType)) {
				oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.REMOVEALLPROPERTIESFROMPARENTOBJECT);
				_clearRepresentationBasicData();
				_setDefaultStateForRepnAsPromise(sNewRepresentationType).done(function() {
					oRepresentationBasicDataHandler.instantiateBasicData();
					oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.representation.SETCHARTICON);
					oConfigurationEditor.setIsUnsaved();
				});
			} else {
				oRepresentationBasicDataHandler.instantiateBasicData();
				oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.representation.SETCHARTICON);
				oConfigurationEditor.setIsUnsaved();
			}
		},
		handlePreviewButtonPress : function() {
			var oController = this;
			var oPreviewContentDetails = {
				oParentStep : oParentStep,
				oRepresentation : oRepresentation,
				oConfigurationHandler : oController.getView().getViewData().oConfigurationHandler,
				oCoreApi : oCoreApi,
				oRepresentationHandler : oRepresentationHandler,
				oStepPropertyMetadataHandler : oStepPropertyMetadataHandler,
				oRepresentationTypeHandler : oRepresentationTypeHandler
			};
			sap.ui.view({
				id : oController.createId("idPreviewContentView"),
				viewName : "sap.apf.modeler.ui.view.previewContent",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : oPreviewContentDetails
			});
		},
		onExit : function() {
			var oController = this;
			oController.getView().getViewData().oFooter.removeContentRight(oController.byId("idPreviewButton"));
			oRepresentationBasicDataHandler.destroyBasicData();
			oSortDataHandler.destroySortData();
			oController.byId("idCornerTextsVBox").destroyItems();
		}
	});
}());