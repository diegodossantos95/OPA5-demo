/*!
 *  @copyright 2012-2014 SAP SE. All rights reserved@
 */
jQuery.sap.declare("sap.landvisz.LandscapeEntityRenderer");

jQuery.sap.require("sap.ui.commons.Button");
jQuery.sap.require("sap.ui.commons.Label");
/**
 * @class LandscapeEntity renderer.
 * @static
 */
sap.landvisz.LandscapeEntityRenderer = {};

sap.landvisz.LandscapeEntityRenderer.render = function(oRm, oControl) {
	// write the HTML into the render manager
	var renderSize = oControl.getRenderingSize();

	if (!this.initializationDone) {
		oControl.initControls();
		oControl.initializationDone = true;
		oRm.write("<div");
		oRm.addClass("sapLandviszLandscapeEntity");
		oRm.writeClasses();
		oRm.writeControlData(oControl);
		if (oControl.expVisible == true) {
			oRm.addStyle("width","100%");
			oRm.addStyle("height","100%");
		}
		if (this.left != 0)
			oRm.addStyle("left",oControl.left + "px");
		if (this.top != 0)
			oRm.addStyle("top",oControl.top + "px");
		if (oControl.entityMaximized == true) {
			if (oControl.sViewWidth != 0)
				oRm.addStyle("width",oControl.sViewWidth + "px");
			if (oControl.sViewHeight != 0)
				oRm.addStyle("height",oControl.sViewHeight + "px");
		}

		if (oControl.viewType == sap.landvisz.ViewType.DEPENDENCY_VIEW
				|| oControl.viewType == sap.landvisz.ViewType.SOLUTION_VIEW)
			oRm.addStyle("position","absolute");
		else
			oRm.addStyle("position","relative");

		oRm.writeStyles();
		oRm.write(">");
		this._renderModelingStatus(oRm, oControl);

		this._renderActionBar(oRm, oControl);

		this._renderSystemEntity(oRm, oControl);

		oRm.write("</div>");
		oRm.write("</div>");
		oRm.write("</div>");

		// has to be removed
		// this._renderUnselectedHeaderPopup(oRm, oControl);

		// TO DO tweak to get the aggregated data back as container removes its
		// children from the actual parent.
		// Check this later how to overcome the problem.

		var content = oControl.oHeadersLayout.getContent();

		if (content.length > 0) {
			for ( var i = 0; i < content.length - 2; i++)
				oControl.addAggregation("dataContainers", content[i], false);
		}

		if (oControl.getDataContainers()
				&& oControl.getDataContainers().length > 0) {
			var backup = oControl.oVLayoutProperties.getContent();
			var container = oControl.propertyHeaders[oControl.selectedIndex];
			for ( var i = 0; i < backup.length; i++) {
				container.addAggregation("properties", backup[i], false);
			}

		}

		if (oControl.expVisible == true) {
			this._renderUnselectedHeaderPopup(oRm, oControl);
		}
		
		// creating all the dialogs
		if (oControl.getDataContainers() && oControl.getDataContainers().length > 0) {
			var containers = oControl.getDataContainers()
			var container;
			var hasHeader;
			for ( var i = 0; i < containers.length; i++) {
				container = containers[i];
				hasHeader = false;
				for ( var j = 0; j < oControl.dialogArray.length; j++) {
					if (oControl.dialogArray[j].getHeader() == container
							.getHeader()) {
						hasHeader = true;
						break;
					}
				}
				if (hasHeader == false) {
					oControl.smvContainer = new sap.landvisz.internal.SingleDataContainer(
							oControl.getId() + i + "CLVSMVSection");
					oControl.smvContainer.setHeader(container.getHeader());
					oControl.dialogArray.push(oControl.smvContainer);
				}
			}
		}

		oControl.firstTime = false;
		this._renderOverlayContainer(oRm, oControl);
		oRm.write("</div>");

		// backup actions
		var actions = oControl.oHLayoutAction.getContent();
		for ( var j = actions.length - 1; j >= 0; j--) {
			oControl.addAggregation("actionBar", actions[j], false);
		}

		oControl.containerEvent = false;
	}
};

sap.landvisz.LandscapeEntityRenderer._renderModelingStatus = function(oRm,
		oControl) {
	var renderSize = oControl.getRenderingSize();
	oRm.write("<div");

	oControl.modelStatus.entityMaximized = oControl.entityMaximized;

	if (oControl.entityMaximized != true) {
		if (renderSize == sap.landvisz.EntityCSSSize.Small)
			oRm.addClass("sapLandviszStatusSmallSize");
		else if (renderSize == sap.landvisz.EntityCSSSize.RegularSmall)
			oRm.addClass("sapLandviszStatusRegularSmallSize");
		else if (renderSize == sap.landvisz.EntityCSSSize.Regular)
			oRm.addClass("sapLandviszStatusRegularSize");
		else if (renderSize == sap.landvisz.EntityCSSSize.Medium)
			oRm.addClass("sapLandviszStatusMediumSize");
		else if (renderSize == sap.landvisz.EntityCSSSize.Large)
			oRm.addClass("sapLandviszStatusLargeSize");
	}else {
		oRm.addClass("sapLandviszStatusMaximizeSize");
	}

	oRm.writeClasses();
	oRm.write(">");
	oControl.modelStatus.setStatus(oControl.getSystemStatus());
	oControl.modelStatus.setStatusTooltip(oControl.getStatusTooltip());
	oControl.modelStatus.setStateIconSrc(oControl.getStateIconSrc());
	oControl.modelStatus.setStateIconTooltip(oControl.getStateIconTooltip());
	if(oControl.getEntityStatus())
	oControl.modelStatus.statusImage = oControl.getEntityStatus();
	oControl.modelStatus.renderSize = renderSize;
	if (oControl.firstTime == true) {
		oControl.modelStatus.attachEvent("statusSelected", function(event) {
			oControl.fireStatusSelect();
		});
	}
	oRm.renderControl(oControl.modelStatus);
};

sap.landvisz.LandscapeEntityRenderer._renderActionBar = function(oRm, oControl) {
	var renderSize = oControl.getRenderingSize();
	var showCustomActions = oControl.getShowCustomActions();
	var showEntityActions = oControl.getShowEntityActions();

	oRm.write("<div");
	if (oControl.entityMaximized != true) {
		oRm.addClass("sapLandviszActionBarSizeCommon");
		if (renderSize == sap.landvisz.EntityCSSSize.Small) {
			oRm.addClass("sapLandviszActionBarSmallSize");
			oControl.oVLayoutProperties
			.addStyleClass("sapLandviszSmallSizesPropertySection");
			oControl.oVLayoutProperties
			.removeStyleClass("sapLandviszMaximizePropertySection");
			oControl._imgFolderPath = "16x16/";
			oControl.restore = false;
		}else if (renderSize == sap.landvisz.EntityCSSSize.RegularSmall) {
			oRm.addClass("sapLandviszActionBarRegularSmallSize");
			oControl.oVLayoutProperties
			.addStyleClass("sapLandviszRegularSmallSizesPropertySection");
			oControl.oVLayoutProperties
			.removeStyleClass("sapLandviszMaximizePropertySection");
			oControl._imgFolderPath = "16x16/";
			oControl.restore = false;
		}else if (renderSize == sap.landvisz.EntityCSSSize.Regular) {
			oRm.addClass("sapLandviszActionBarRegularSize");
			oControl.oVLayoutProperties
			.addStyleClass("sapLandviszRegularSizesPropertySection");
			oControl.oVLayoutProperties
			.removeStyleClass("sapLandviszMaximizePropertySection");
			oControl._imgFolderPath = "16x16/";
			oControl.restore = false;
		}else if (renderSize == sap.landvisz.EntityCSSSize.Medium) {
			oRm.addClass("sapLandviszActionBarMediumSize");
			oControl.oVLayoutProperties
			.addStyleClass("sapLandviszMediumSizesPropertySection");
			oControl.oVLayoutProperties
			.removeStyleClass("sapLandviszMaximizePropertySection");
			oControl.restore = false;
			oControl._imgFolderPath = "16x16/";
		}else if (renderSize == sap.landvisz.EntityCSSSize.Large) {
			oRm.addClass("sapLandviszActionBarLargeSize");
			oControl.oVLayoutProperties
			.addStyleClass("sapLandviszLargeSizesPropertySection");
			oControl.oVLayoutProperties
			.removeStyleClass("sapLandviszMaximizePropertySection");
			oControl.restore = true;
			oControl._imgFolderPath = "24x24/";
		}

		if (oControl.expVisible == true){
			if(renderSize == sap.landvisz.EntityCSSSize.Regular){
				oControl.oVLayoutProperties.addStyleClass("sapLandviszRegularSizesPropertySectionSmv");
				oControl.oVLayoutProperties.removeStyleClass("sapLandviszRegularSmallSizesPropertySectionSmv");
			}else if(renderSize == sap.landvisz.EntityCSSSize.RegularSmall){
				oControl.oVLayoutProperties.addStyleClass("sapLandviszRegularSmallSizesPropertySectionSmv");
				oControl.oVLayoutProperties.removeStyleClass("sapLandviszRegularSizesPropertySectionSmv");
				oControl.oVLayoutProperties.removeStyleClass("sapLandviszMaximizePropertySection");
				if(oControl.explodeViewClosed == true)
					oControl.oVLayoutProperties.addStyleClass("sapLandviszRegularSmallSizesPropertySection");
				else
					oControl.oVLayoutProperties.removeStyleClass("sapLandviszRegularSmallSizesPropertySection");
			}
		}else{
			oControl.oVLayoutProperties.removeStyleClass("sapLandviszRegularSizesPropertySectionSmv");
		}
	}

	if (oControl.entityMaximized == true) {
		var maxWidth = oControl.sViewWidth - 30;
		oRm.addStyle("width", maxWidth + "px");
		oRm.addClass("sapLandviszActionBarMaximizeSize");

		oControl.oVLayoutProperties
		.addStyleClass("sapLandviszMaximizePropertySection");
		oControl.oVLayoutProperties.addStyleClass("sapLandviszMaximizePropertySection");
		   if(renderSize == sap.landvisz.EntityCSSSize.Large)
		oControl.oVLayoutProperties.removeStyleClass("sapLandviszLargeSizesPropertySection");
		   else if(renderSize == sap.landvisz.EntityCSSSize.Small)
		oControl.oVLayoutProperties.removeStyleClass("sapLandviszSmallSizesPropertySection");
		   else if(renderSize == sap.landvisz.EntityCSSSize.RegularSmall)
		oControl.oVLayoutProperties.removeStyleClass("sapLandviszRegularSmallSizesPropertySection");
		   else if(renderSize == sap.landvisz.EntityCSSSize.Regular)
		oControl.oVLayoutProperties.removeStyleClass("sapLandviszRegularSizesPropertySection");
		   else if(renderSize == sap.landvisz.EntityCSSSize.Medium)
		oControl.oVLayoutProperties.removeStyleClass("sapLandviszMediumSizesPropertySection");
		oControl.oVLayoutProperties
		.removeStyleClass("sapLandviszRegularSmallSizesPropertySectionSmv");
		oControl.restore = true;
		oControl._imgFolderPath = "24x24/";
	}
	oRm.writeStyles();
	oRm.writeClasses();
	oRm.write(">");
	if (showCustomActions == true)
		this._renderCustomActionRegion(oRm, oControl);
	oControl.oHLayoutAllAction.addContent(oControl.oHLayoutAction);
	if (showEntityActions == true)
		this._renderEntityAction(oRm, oControl);
	if (oControl.entityMaximized == true) {
		oControl.oHLayoutAllAction
		.addStyleClass("sapLandviszAllActionLayoutMaximize");
		oControl.oHLayoutAllAction
		.removeStyleClass("sapLandviszAllActionLayout");
	} else {
		oControl.oHLayoutAllAction.addStyleClass("sapLandviszAllActionLayout");
		oControl.oHLayoutAllAction
		.removeStyleClass("sapLandviszAllActionLayoutMaximize");
	}

	oRm.renderControl(oControl.oHLayoutAllAction);

};

sap.landvisz.LandscapeEntityRenderer._renderSystemEntity = function(oRm,
		oControl) {

	var renderSize = oControl.getRenderingSize();
	oRm.write("<div");
	if (oControl.entityMaximized != true) {
		if (renderSize == sap.landvisz.EntityCSSSize.Small) {
			oRm.addClass("sapLandviszLandscapeEntitySmallSize");
			oControl.containerWidth = 21;
		}else if (renderSize == sap.landvisz.EntityCSSSize.RegularSmall) {
			oRm.addClass("sapLandviszLandscapeEntityRegularSmallSize");
			oControl.containerWidth = 31.5;
		}else if (renderSize == sap.landvisz.EntityCSSSize.Regular) {
			oRm.addClass("sapLandviszLandscapeEntityRegularSize");
			oControl.containerWidth = 36.5;
		}else if (renderSize == sap.landvisz.EntityCSSSize.Medium) {
			oRm.addClass("sapLandviszLandscapeEntityMediumSize");
			oControl.containerWidth = 41;
		}else if (renderSize == sap.landvisz.EntityCSSSize.Large) {
			oRm.addClass("sapLandviszLandscapeEntityLargeSize");
			oControl.containerWidth = 62;
		}
	} else if (oControl.entityMaximized == true) {
		oRm.addClass("sapLandviszLandscapeEntityMaximizedSize");
		oRm.write(" style='");
		var entityWidth;
		var entityHeight;
		if (oControl.sViewWidth != 0) {
			entityWidth = oControl.sViewWidth - 30;
			oRm.write("width:" + entityWidth + "px;");
		}
		if (oControl.sViewHeight != 0) {
			entityHeight = oControl.sViewHeight - 32;
			oRm.write("height:" + entityHeight + "px;");
		}
		oRm.write("position:absolute;");
		oRm.write("'");
	}

	oRm.writeClasses();
	oRm.write(">");
	if(oControl.getType()==sap.landvisz.LandscapeObject.Track){
	this._renderTrack(oRm, oControl);
	}else{
	this._renderIdentificationBar(oRm, oControl);
	this._renderDataEntityRegion(oRm, oControl);
	}
	oRm.renderControl(oControl.oHLayout);

};

sap.landvisz.LandscapeEntityRenderer._renderTrack = function(oRm,oControl) {


				oRm.write("<div");
				oRm.addClass("trackEntity");
				oRm.writeClasses();
				oRm.write(">");
				
				oRm.write("<div");
				oRm.addClass("trackLogo");
				oRm.writeClasses();
				oRm.write(">");
				oRm.write("</div>");
				
				oRm.write("<div");
				oRm.addClass("trackName");
				oRm.writeClasses();
				oRm.write(">"+oControl.getSystemName());
				oRm.write("</div>");
				
				oRm.write("<div");
				oRm.addClass("trackFooter");
				oRm.writeClasses();
				oRm.write("> "+oControl.getTrackSystemCount());
				oRm.write("</div>");
				
				oRm.renderControl(oControl.infoIcon);
				
				oRm.write("</div>");

};

sap.landvisz.LandscapeEntityRenderer._renderIdentificationBar = function(oRm,
		oControl) {

	var identificationHdrID = oControl.getId();

	if (oControl.entityMaximized == true) {
		oControl.oIdnBar.entityMaximized = oControl.entityMaximized;
		oControl.oIdnBar.maxHeight = oControl.sViewHeight - 32;
	} else
		oControl.oIdnBar.entityMaximized = false;
	oControl.oIdnBar.setText(oControl.getSystemName());
	oControl.oIdnBar.setTooltip(oControl.getTooltip());
	oControl.oIdnBar.setType(oControl.getType());
	oControl.oIdnBar.setQualifierText(oControl.getQualifierText());
	oControl.oIdnBar.setQualifierTooltip(oControl.getQualifierTooltip());
	oControl.oIdnBar.setQualifierType(oControl.getQualifierType());
	oControl.oIdnBar.setRenderingSize(oControl.getRenderingSize());
	oControl.oIdnBar.setDefaultState(oControl.getDefaultState());
	oControl.oIdnBar.setDescription(oControl.getDescription());
	oControl.oIdnBar.setComponentType(oControl.getComponentType());
	oControl.oVLayout.addContent(oControl.oIdnBar);
	oControl.oHLayout.addContent(oControl.oVLayout);
};

//Identification region rendering
sap.landvisz.LandscapeEntityRenderer._renderDataEntityRegion = function(oRm,oControl) {

	oControl.propertyHeaders = oControl.getDataContainers();

	if (oControl.propertyHeaders.length > 0)
		// change for tab
		this._renderTabContainers(oRm, oControl)
		else if (!oControl.propertyHeaders || oControl.propertyHeaders.length < 1) {
			oControl.propertyHeaders = oControl.getContainers();
			if (oControl.propertyHeaders && oControl.propertyHeaders.length > 0)
				this._renderContainerData(oRm, oControl);
			else if (oControl.propertyHeaders)
				this._renderSingleContainerData(oRm, oControl);
		}

	oControl.oVLayoutContainer.addContent(oControl.oVLayoutProperties);
	if(oControl.display == "block"){
		oControl.oVLayoutContainer.addStyleClass("sapLandviszDisplayBlock");
		oControl.oVLayoutContainer.removeStyleClass("sapLandviszDisplayNone");
	}
	else{
		oControl.oVLayoutContainer.addStyleClass("sapLandviszDisplayNone");
		oControl.oVLayoutContainer.removeStyleClass("sapLandviszDisplayBlock");
	}
	oControl.oHLayout.addContent(oControl.oVLayoutContainer);
};

//finding properties.
sap.landvisz.LandscapeEntityRenderer._findContainerProperties = function(key,
		oControl, oRm) {

	for ( var i = 0; i < oControl.propertyHeaders.length; i++) {

		if (key == oControl.propertyHeaders[i].header) {
			oControl.propertyHeaders[i].selected = true;
			oControl.selectedIndex = i;
			this._renderDataContainerProperties(oRm, oControl,
					oControl.propertyHeaders[i].properties,"");
		} else
			oControl.propertyHeaders[i].selected = false;

	}
};

//finding Aggregated properties.
sap.landvisz.LandscapeEntityRenderer._findContainerAggregationProperties = function(
		key, oControl, oRm) {

	for ( var i = 0; i < oControl.propertyHeaders.length; i++) {

		if (key == oControl.propertyHeaders[i].getHeader()) {
			oControl.propertyHeaders[i].setSelected(true);
			oControl.selectedIndex = i;
		} else
			oControl.propertyHeaders[i].setSelected(false);

	}
};

sap.landvisz.LandscapeEntityRenderer._renderSingleContainerData = function(oRm,
		oControl) {
	var container = oControl.getContainers();
	var continerId = oControl.getId();
	oControl.dataContainer = new sap.landvisz.internal.DataContainer(continerId
			+ "-CLVEntityDataContainer");
	oControl.dataContainer.setHeader(container.header);
	oControl.dataContainer.setSelected(container.selected);
	var properties = container.properties;
	this._setPropertiesAggregation(oRm, oControl, properties, container.header);

	oControl.addAggregation("dataContainers", oControl.dataContainer, false);

	oControl.propertyHeaders = oControl.getDataContainers();
	this._renderContainerAggregation(oRm, oControl);
};

sap.landvisz.LandscapeEntityRenderer._setPropertiesAggregation = function(oRm,
		oControl, properties, header) {

	var id;
	var continerId = oControl.getId();
	if (properties && properties.length && properties.length > 0) {

		for ( var j = 0; j < properties.length; j++) {
			id = continerId + j + header + "-CLVRowField";
			oControl.dataContainer.addAggregation("properties", properties[j],
					false);
		}

	} else if (properties instanceof sap.ui.core.Control) {

		id = continerId + header + "-CLVRowField";
		oControl.dataContainer.addAggregation("properties", properties, false);
	}
};



//render the aggregation for data containers.

sap.landvisz.LandscapeEntityRenderer._renderContainerData = function(oRm,
		oControl) {

	var continerId = oControl.getId();
	oControl.isAggregated = false;
	this._setContainerRenderingSize(oControl);

	var selected;
	var container;
	var properties;
	var id;
	for ( var i = 0; i < oControl.propertyHeaders.length; i++) {

		oControl.dataContainer = new sap.landvisz.internal.DataContainer(
				continerId + i + "-CLVEntityDataContainer");
		container = oControl.propertyHeaders[i];
		oControl.dataContainer.setHeader(container.header);
		oControl.dataContainer.setSelected(container.selected);
		properties = container.properties;

		this._setPropertiesAggregation(oRm, oControl, properties,
				container.header);

		oControl
		.addAggregation("dataContainers", oControl.dataContainer, false);

	}
	oControl.propertyHeaders = oControl.getDataContainers();
	this._renderTabContainers(oRm, oControl);

};

//render the aggregation for data containers.

sap.landvisz.LandscapeEntityRenderer._makeOtherContainerUnselected = function(
		oControl, index) {

	for ( var i = 0; i < index; i++)
		oControl.propertyHeaders[i].setSelected(false);
};

sap.landvisz.LandscapeEntityRenderer._renderTabContainers = function(oRm,
		oControl) {

	var continerId = oControl.getId();
	var selected;
	oControl.isAggregated = true;
	var selectedHeader;
	this._setContainerRenderingSize(oControl);

	for ( var i = 0; i < oControl.propertyHeaders.length; i++) {

		oControl.dataContainer = oControl.propertyHeaders[i];
		oControl.dataContainer.setRenderingSize(oControl.getRenderingSize());
		oControl.dataContainer.setType(oControl.getType());
		if (i == 0)
			oControl.dataContainer.setSelected(true);
		selected = oControl.dataContainer.getSelected();
		if (selected == true) {
			selectedHeader = oControl.dataContainer;
			oControl.selectedIndex = i;
			this._makeOtherContainerUnselected(oControl, i);

		}
		if (oControl.showMiniNavigation == true
				&& oControl.propertyHeaders.length > 1) {
			this._createMiniNavigation(oRm, oControl, oControl.dataContainer
					.getHeader(), oControl.dataContainer.getSelected());
			if (i + 1 == oControl.propertyHeaders.length) {
				oControl.oHLayoutMiniNavigation
				.addStyleClass("sapLandviszMiniNavigationVisible");
				oControl.oHLayoutMiniNavigation
				.removeStyleClass("sapLandviszMiniNavigationHidden");
			}
		} else {
			oControl.oHLayoutMiniNavigation
			.addStyleClass("sapLandviszMiniNavigationHidden");
			oControl.oHLayoutMiniNavigation
			.removeStyleClass("sapLandviszMiniNavigationVisible");
		}
		oControl.oVLayoutContainer.addContent(oControl.oHLayoutMiniNavigation);

		oControl.oHeadersLayout.addContent(oControl.dataContainer);
		var that = this;
		if (oControl.dataContainer.hasChangeEvent == false) {
			oControl.dataContainer.attachEvent("itemsChanged", function(event) {
				oControl.oVLayoutProperties.removeAllContent();
				var key = event.oSource.getHeader();
				that._findContainerAggregationProperties(key, oControl, oRm);
				that._selectMiniNavigationButton(oControl, oRm, key);
				oControl.containerEvent = true;
				oControl.invalidate();
			}, this);

		}
	}
	oControl.dataContainer.hasChangeEvent = true;

	oControl.oHeadersLayout.addContent(oControl.previousIcon);
	oControl.oHeadersLayout.addContent(oControl.nextIcon);
	if (oControl.containerEvent == false)
		this._setVisibleTabs(oRm, oControl);

	this._enableNextAndPrevious(oRm, oControl, oControl.selectedIndex);

	oControl.oVLayoutContainer.addContent(oControl.oHeadersLayout);
	oControl.oSingleHeaderLabel.setText(selectedHeader.getHeader());
	oControl.oSingleHeaderLabel.setTooltip(selectedHeader.getHeader());
	oControl.oSingleHeaderLabel
	.addStyleClass("sapLandviszSingleLabelHeaderWidth");
	oControl.oSingleHeaderLayout.addContent(oControl.oSingleHeaderLabel);

	oControl.oVLayoutContainer.addContent(oControl.oSingleHeaderLayout);

	if (oControl.expVisible == false
			&& oControl.oHeadersLayout.getContent().length > 3) {
		oControl.oHeadersLayout.removeStyleClass("sapLandviszDisplayNone");
		oControl.oSingleHeaderLayout.addStyleClass("sapLandviszDisplayNone");
		oControl.oSingleHeaderLayout
		.removeStyleClass("sapLandviszDisplayBlock");
		oControl.oVLayoutProperties
		.removeStyleClass("sapLandviszRegularSizesPropertySectionSmv");
	} else {
		if(oControl.expVisible == true)
			oControl.oSingleHeaderLayout.addStyleClass("singleHeaderExplodeView");
		oControl.oSingleHeaderLayout.addStyleClass("singleHeader");
		oControl.oHeadersLayout.addStyleClass("sapLandviszDisplayNone");
		oControl.oHeadersLayout.removeStyleClass("sapLandviszDisplayBlock");
		oControl.oSingleHeaderLayout.addStyleClass("sapLandviszDisplayBlock");
		oControl.oSingleHeaderLayout.removeStyleClass("sapLandviszDisplayNone");
		if(oControl.getRenderingSize() ==  sap.landvisz.EntityCSSSize.Small)
			oControl.oVLayoutProperties
			.addStyleClass("sapLandviszSmallSizesPropertySectionSmv");
		else if(oControl.getRenderingSize() ==  sap.landvisz.EntityCSSSize.Regular)
			oControl.oVLayoutProperties
			.addStyleClass("sapLandviszRegularSizesPropertySectionSmv");
		else if(oControl.getRenderingSize() ==  sap.landvisz.EntityCSSSize.RegularSmall)
			oControl.oVLayoutProperties
			.addStyleClass("sapLandviszRegularSmallSizesPropertySectionSmv"); 
		if(oControl.getType() == sap.landvisz.LandscapeObject.TechnicalSystem)
			oControl.oSingleHeaderLayout.addStyleClass("sapLandviszTechnicalSystem");
		else if(oControl.getType() == sap.landvisz.LandscapeObject.ProductSystem)
			oControl.oSingleHeaderLayout.addStyleClass("sapLandviszProductSystem");
		else if(oControl.getType() == sap.landvisz.LandscapeObject.SapComponent)
			oControl.oSingleHeaderLayout.addStyleClass("sapLandviszSapComponent");	                 
	}
	if(oControl.expVisible == false && oControl.getRenderingSize() ==  sap.landvisz.EntityCSSSize.RegularSmall){
		oControl.oVLayoutProperties
		.removeStyleClass("sapLandviszRegularSizesPropertySectionSmv");
	}

	if(oControl.explodeViewClosed == true && oControl.getRenderingSize() ==  sap.landvisz.EntityCSSSize.RegularSmall && oControl.oHeadersLayout.getContent().length > 3){
		oControl.oVLayoutProperties
		.removeStyleClass("sapLandviszRegularSmallSizesPropertySectionSmv");
		oControl.oVLayoutProperties
		.addStyleClass("sapLandviszRegularSmallSizesPropertySection");
	}
	if(oControl.explodeViewClosed == true && oControl.getRenderingSize() ==  sap.landvisz.EntityCSSSize.Small && oControl.oHeadersLayout.getContent().length > 3){
		oControl.oVLayoutProperties
		.removeStyleClass("sapLandviszSmallSizesPropertySectionSmv");
		oControl.oVLayoutProperties
		.addStyleClass("sapLandviszSmallSizesPropertySection");
	}
	if(oControl.expVisible == true && oControl.getRenderingSize() ==  sap.landvisz.EntityCSSSize.RegularSmall){
		oControl.oVLayoutProperties
		.addStyleClass("sapLandviszRegularSmallSizesPropertySectionSmv");
	}

	var that = this;

	var miniNavigations = oControl.oHLayoutMiniNavigation.getContent();
	if (miniNavigations.length > 0) {

		var tabContent = oControl.oHeadersLayout.getContent();

		for ( var i = 0; i < tabContent.length - 2; i++) {
			if (tabContent[i].inDisplay == true
					&& tabContent[i].getSelected() == true)
				miniNavigations[i].setSelected(true);
			else if (tabContent[i].inDisplay == true)
				miniNavigations[i].inDisplay = true;
			else
				miniNavigations[i].inDisplay = false;
		}
		miniNavigations[oControl.selectedIndex].setSelected(true);
	}

	this._renderDataContainerProperties(oRm, oControl, selectedHeader
			.getProperties(), selectedHeader.getHeader());

};

sap.landvisz.LandscapeEntityRenderer._setVisibleTabs = function(oRm, oControl) {

	var renderSize = oControl.getRenderingSize();
	var showAllTab = false;
	if (oControl.entityMaximized != true) {
		if (renderSize == sap.landvisz.EntityCSSSize.Small) {
			if (oControl.propertyHeaders.length > 1)
				oControl.visibleTabCount = 1;
			else
				showAllTab = true;
		} 

		else if (renderSize == sap.landvisz.EntityCSSSize.RegularSmall) {
			if (oControl.propertyHeaders.length > 2)
				oControl.visibleTabCount = 2;
			else
				showAllTab = true;
		}	

		else if (renderSize == sap.landvisz.EntityCSSSize.Regular) {
			if (oControl.propertyHeaders.length > 2)
				oControl.visibleTabCount = 2;
			else
				showAllTab = true;
		}

		else if (renderSize == sap.landvisz.EntityCSSSize.Medium) {
			if (oControl.propertyHeaders.length > 2)
				oControl.visibleTabCount = 2;
			else
				showAllTab = true;
		} else if (renderSize == sap.landvisz.EntityCSSSize.Large) {
			if (oControl.propertyHeaders.length > 4)
				oControl.visibleTabCount = 4;
			else
				showAllTab = true;
		}
	} else if (oControl.entityMaximized == true) {
		var countCalc = Math.floor(oControl.containerWidth / 148);
		if (oControl.propertyHeaders.length > countCalc)
			oControl.visibleTabCount = countCalc;
		else
			showAllTab = true;
	}

	var tabs = oControl.oHeadersLayout.getContent();
	if (showAllTab) {

		var tabWidth = oControl.containerWidth / (tabs.length - 2);
		if (oControl.entityMaximized != true)
			tabWidth = (tabWidth * 12);
		tabWidth = Math.round(tabWidth) - 2;
		for ( var i = 0; i < tabs.length; i++) {

			if (i > tabs.length - 3) {
				// tabs[i].addStyleClass("sapLandviszDisplayNone");
				// tabs[i].removeStyleClass("sapLandviszDisplayBlock");
				tabs[i].inDisplay = false;
			} else {
				tabs[i].width = tabWidth + "px";
				// tabs[i].addStyleClass("sapLandviszDisplayBlock");
				// tabs[i].removeStyleClass("sapLandviszDisplayNone");
				tabs[i].inDisplay = true;
			}
		}

	} else {

		var selectedIndex;
		var visibleCount;
		var tabWidth;
		var availableCounts = 0;
		var selected;

		if (oControl.visibleTabCount < oControl.propertyHeaders.length) {
			visibleCount = oControl.visibleTabCount;
			if (oControl.entityMaximized != true)
				tabWidth = oControl.containerWidth * 12;
			else 
				tabWidth = oControl.containerWidth;
			tabWidth = tabWidth - 46;
			tabWidth = Math.round((tabWidth / oControl.visibleTabCount) - 2);

		} else
			visibleCount = oControl.propertyHeaders.length;

		if (oControl.previousClicked == true) {

			for ( var i = 0; i < tabs.length; i++) {
				if (i > tabs.length - 3) {
					// tabs[i].addStyleClass("sapLandviszDisplayBlock");
					// tabs[i].removeStyleClass("sapLandviszDisplayNone");
					tabs[i].inDisplay = true;
				} else {
					selected = tabs[i].getSelected();
					if (selected == true) {
						availableCounts = i - 1;
						selectedIndex = i;
					} else {
						// tabs[i].addStyleClass("sapLandviszDisplayNone");
						// tabs[i].removeStyleClass("sapLandviszDisplayBlock");
						tabs[i].inDisplay = false;
					}
					tabs[i].width = tabWidth + "px";
				}
			}

			visibleCount = oControl.visibleTabCount;

			if (availableCounts >= 0) {
				for ( var k = availableCounts; k >= 0; k--) {
					tabs[k].inDisplay = true;
					visibleCount--
				}
			}

			for ( var l = 0; l < visibleCount; l++) {
				tabs[l + selectedIndex].inDisplay = true;
			}

		}

		else {

			for ( var i = 0; i < tabs.length; i++) {
				if (i > tabs.length - 3) {
					// tabs[i].addStyleClass("sapLandviszDisplayBlock");
					// tabs[i].removeStyleClass("sapLandviszDisplayNone");
					tabs[i].inDisplay = true;
				} else {
					selected = tabs[i].getSelected();
					if (selected == true) {
						availableCounts = tabs.length - 3 - i;
						selectedIndex = i;
					} else {
						// tabs[i].addStyleClass("sapLandviszDisplayNone");
						// tabs[i].removeStyleClass("sapLandviszDisplayBlock");
						tabs[i].inDisplay = false;
					}
					tabs[i].width = tabWidth + "px";
				}
			}

			if (availableCounts >= visibleCount) {

				for ( var k = 0; k < visibleCount; k++) {
					// tabs[selectedIndex + k]
					// .addStyleClass("sapLandviszDisplayBlock");
					// tabs[selectedIndex + k]
					// .removeStyleClass("sapLandviszDisplayNone");
					tabs[selectedIndex + k].inDisplay = true;
				}

			} else {
				for ( var j = 0; j <= availableCounts; j++) {
					// tabs[selectedIndex + j]
					// .addStyleClass("sapLandviszDisplayBlock");
					// tabs[selectedIndex + j]
					// .removeStyleClass("sapLandviszDisplayNone");
					visibleCount--;
					tabs[selectedIndex + j].inDisplay = true;
				}
				for ( var k = 0; k <= visibleCount; k++) {
					// tabs[selectedIndex - k]
					// .addStyleClass("sapLandviszDisplayBlock");
					// tabs[selectedIndex - k]
					// .removeStyleClass("sapLandviszDisplayNone");
					tabs[selectedIndex - k].inDisplay = true;
				}
			}
		}
	}
};

sap.landvisz.LandscapeEntityRenderer._enableNextAndPrevious = function(oRm,
		oControl, selectedIndex) {

	var folderPath = "16x16/";
	var previousSrc;
	var nextSrc;

	var renderSize = oControl.getRenderingSize();
	var showAllTab = false;
	if (renderSize == sap.landvisz.EntityCSSSize.Small) {
		if (oControl.propertyHeaders.length > 1)
			oControl.visibleTabCount = 1;
		else
			showAllTab = true;
	}

	else if (renderSize == sap.landvisz.EntityCSSSize.RegularSmall) {
		if (oControl.propertyHeaders.length > 2)
			oControl.visibleTabCount = 2;
		else
			showAllTab = true;
	}

	else if (renderSize == sap.landvisz.EntityCSSSize.Regular) {
		if (oControl.propertyHeaders.length > 2)
			oControl.visibleTabCount = 2;
		else
			showAllTab = true;
	}

	else if (renderSize == sap.landvisz.EntityCSSSize.Medium) {
		if (oControl.propertyHeaders.length > 2)
			oControl.visibleTabCount = 2;
		else
			showAllTab = true;
	} else if (renderSize == sap.landvisz.EntityCSSSize.Large) {
		if (oControl.propertyHeaders.length > 4)
			oControl.visibleTabCount = 4;
		else
			showAllTab = true;
	}

	var enablePrevoius = false;
	var tabs = oControl.oHeadersLayout.getContent();

	if (selectedIndex > 0) {
		for ( var i = 0; i < selectedIndex; i++) {

			if (tabs[i].inDisplay == false) {
				enablePrevoius = true;
				break;
			}
		}

	}

	if (enablePrevoius == true)
		previousSrc = oControl._imgResourcePath + folderPath
		+ "leftnav_enable_dark.png";
	else
		previousSrc = oControl._imgResourcePath + folderPath
		+ "leftnav_disable.png";

	var enableNext = false;

	if (selectedIndex < oControl.propertyHeaders.length) {
		for ( var i = oControl.propertyHeaders.length - 1; i > selectedIndex; i--) {

			if (tabs[i].inDisplay == false) {
				enableNext = true;
				break;
			}
		}

	}

	if (enableNext == true)
		nextSrc = oControl._imgResourcePath + folderPath
		+ "rightnav_enable_dark.png";
	else
		nextSrc = oControl._imgResourcePath + folderPath
		+ "rightnav_disable.png";

	oControl.nextIcon.addStyleClass("sapLandviszLandscapeEntityNavIcon");
	oControl.previousIcon.addStyleClass("sapLandviszLandscapeEntityNavIcon");
	oControl.nextIcon.setTooltip(oControl.NEXT);
	oControl.previousIcon.setTooltip(oControl.PREVIOUS);
	if (renderSize == sap.landvisz.EntityCSSSize.Small) {
		oControl.previousIcon.setHeight("14px");
		oControl.nextIcon.setHeight("14px");
	} else if (renderSize == sap.landvisz.EntityCSSSize.RegularSmall) {
		oControl.previousIcon.setHeight("16px");
		oControl.nextIcon.setHeight("16px");
	} else if (renderSize == sap.landvisz.EntityCSSSize.Regular) {
		oControl.previousIcon.setHeight("16px");
		oControl.nextIcon.setHeight("16px");
	} else if (renderSize == sap.landvisz.EntityCSSSize.Medium) {
		oControl.previousIcon.setHeight("16px");
		oControl.nextIcon.setHeight("16px");
	} else if (renderSize == sap.landvisz.EntityCSSSize.Large) {
		oControl.previousIcon.setHeight("26px");
		oControl.nextIcon.setHeight("26px");
	}

	oControl.nextIcon.setSrc(nextSrc);
	oControl.previousIcon.setSrc(previousSrc);
	oControl.nextEnabled = enableNext;
	oControl.previousEnable = enablePrevoius;
	var that = this;

	if (oControl.hasNavigationEvent == false) {

		oControl.nextIcon.attachPress(function(oEvent) {

			if (oControl.nextEnabled == true) {
				oControl.nextClicked = true;
				var selectIndex;
				for ( var m = 0; m < tabs.length - 2; m++) {

					if (tabs[m].inDisplay == true) {
						selectIndex = m + oControl.visibleTabCount;
						break;
					}
				}

				that._findContainerAggregationProperties(tabs[selectIndex]
				.getHeader(), oControl, oRm);
				that._selectMiniNavigationButton(oControl, oRm,
						tabs[selectIndex].getHeader());
				oControl.containerEvent = false;
				oControl.invalidate();
			}

		});

		oControl.previousIcon.attachPress(function(oEvent) {

			if (oControl.previousEnable == true) {

				var selectIndex;
				oControl.previousClicked = true;
				for ( var l = 0; l < tabs.length - 2; l++) {

					if (tabs[l].inDisplay == true) {
						selectIndex = l - 1;
						break;
					}
				}

				if (selectIndex < 0)
					selectIndex = 0;

				that._findContainerAggregationProperties(tabs[selectIndex]
				.getHeader(), oControl, oRm);
				that._selectMiniNavigationButton(oControl, oRm,
						tabs[selectIndex].getHeader());
				oControl.containerEvent = false;
				oControl.invalidate();
			}
		});

		oControl.hasNavigationEvent = true;

	}

};

sap.landvisz.LandscapeEntityRenderer._renderContainerAggregation = function(
		oRm, oControl) {

	var continerId = oControl.getId();
	var selected;
	oControl.isAggregated = true;
	var selectedHeader;
	this._setContainerRenderingSize(oControl);
	for ( var i = 0; i < oControl.propertyHeaders.length; i++) {

		oControl.dataContainer = oControl.propertyHeaders[i];
		if (i == 0)
			oControl.dataContainer.setSelected(true);
		selected = oControl.dataContainer.getSelected();

		if (selected == true) {
			selectedHeader = oControl.dataContainer;
			oControl.selectedIndex = i;
		}
		if (oControl.showMiniNavigation == true) {
			this._createMiniNavigation(oRm, oControl, oControl.dataContainer
					.getHeader(), oControl.dataContainer.getSelected());
			if (i + 1 == oControl.propertyHeaders.length) {
				oControl.oHLayoutMiniNavigation
				.addStyleClass("sapLandviszMiniNavigationVisible");
				oControl.oHLayoutMiniNavigation
				.removeStyleClass("sapLandviszMiniNavigationHidden");
			}
		} else {
			oControl.oHLayoutMiniNavigation
			.addStyleClass("sapLandviszMiniNavigationHidden");
			oControl.oHLayoutMiniNavigation
			.removeStyleClass("sapLandviszMiniNavigationVisible");
		}
		oControl.oVLayoutContainer.addContent(oControl.oHLayoutMiniNavigation);

		this._initilizeDataContainer(oRm, oControl, i);

	}

	var that = this;
	this._renderDataContainerProperties(oRm, oControl, selectedHeader
			.getProperties(), selectedHeader.getHeader());

};

sap.landvisz.LandscapeEntityRenderer._setContainerRenderingSize = function(
		oControl) {

	var renderSize = oControl.getRenderingSize();
	if (oControl.entityMaximized == true)
		oControl.containerWidth = oControl.sViewWidth - 30 - (8.4 * 12);
	else {
		if (renderSize == sap.landvisz.EntityCSSSize.Small)
			oControl.containerWidth = 21 - 6.1;
		else if (renderSize == sap.landvisz.EntityCSSSize.RegularSmall)
			oControl.containerWidth = 31.5 - 7;
		else if (renderSize == sap.landvisz.EntityCSSSize.Regular)
			oControl.containerWidth = 36.5 - 8.33;

		else if (renderSize == sap.landvisz.EntityCSSSize.Medium) {
			oControl.containerWidth = 41 - 8.4;
		}
		else if (renderSize == sap.landvisz.EntityCSSSize.Large) {
			oControl.containerWidth = 62 - 8.4;
		}
	}
};

sap.landvisz.LandscapeEntityRenderer._initilizeDataContainer = function(oRm,
		oControl, index) {

	// select the first header
	oControl.dataContainer.lastItem = false;
	if (index + 1 == oControl.propertyHeaders.length)
		oControl.dataContainer.lastItem = true;

	oControl.dataContainer.oVLayoutContainer = oControl.oVLayoutContainer;
	oRm.renderControl(oControl.dataContainer);

};

sap.landvisz.LandscapeEntityRenderer._createMiniNavigation = function(oRm,
		oControl, header, selected) {

	var miniNavigation = oControl.oHLayoutMiniNavigation.getContent();
	var hasNavigation = false;
	var minusLength = 0;
	if (oControl.getActionBar() && oControl.getActionBar().length > 0)
		minusLength = 1;
	if (miniNavigation.length > 0) {
		for ( var i = 0; i < miniNavigation.length - minusLength; i++) {
			if (header == miniNavigation[i].getHeaderTooltip()) {
				oControl.headerBtn = miniNavigation[i];
				hasNavigation = true;
			}
		}
	}

	var continerId = oControl.getId();
	if (hasNavigation == false)
		oControl.headerBtn = new sap.landvisz.internal.HeaderList();
	oControl.headerBtn.setHeaderTooltip(header);
	oControl.headerBtn.setSelected(false);
	oControl.headerBtn.setType(oControl.getType());
	var headerWidth = oControl.containerWidth / oControl.propertyHeaders.length;
	if (oControl.entityMaximized != true)
		headerWidth = headerWidth * 12;
	oControl.headerBtn.headerWidth = Math.round(headerWidth) - 2.5;

	var value;
	var that = this;
	if (hasNavigation == false)
		oControl.headerBtn.attachPress(function(oEvent) {
			value = oEvent.oSource.getHeaderTooltip();
			that._selectMiniNavigationButton(oControl, oRm, value);
			that._findContainerAggregationProperties(value, oControl, oRm);
			oControl.containerEvent = false;
			oControl.invalidate();

		});
	oControl.headerBtn.removeStyleClass("sapLandviszMiniNavigationSelected");
	oControl.headerBtn.removeStyleClass("sapLandviszMiniNavigationInDisplay");
	oControl.headerBtn.removeStyleClass("sapLandviszMiniNavigationNormal");
	oControl.oHLayoutMiniNavigation.addContent(oControl.headerBtn);
};

sap.landvisz.LandscapeEntityRenderer._selectMiniNavigationButton = function(
		oControl, oRm, value) {

	this._setContainerRenderingSize(oControl);
	var btnWidth = oControl.containerWidth / oControl.propertyHeaders.length;
	var headerItems = oControl.oHLayoutMiniNavigation.getContent();

	for ( var i = 0; i < headerItems.length; i++) {

		var headerItem = headerItems[i];
		if (headerItem.getHeaderTooltip() == value) {

			headerItem.setSelected(true);
			headerItem.setType(oControl.getType());
//			headerItem.addStyleClass("sapLandviszMiniNavigationSelected");
//			headerItem.removeStyleClass("sapLandviszMiniNavigationNormal");
		} else {

			headerItem.setSelected(false);
//			headerItem.addStyleClass("sapLandviszMiniNavigationNormal");
//			headerItem.removeStyleClass("sapLandviszMiniNavigationSelected");

		}
	}

};

sap.landvisz.LandscapeEntityRenderer._selectNavigationHeader = function(
		oControl, oRm, value) {

	var items = oControl.oNavBar.getItems();
	for ( var i = 0; i < items.length; i++) {
		if (items[i].getKey() == value) {
			oControl.oNavBar.setSelectedItem(items[i]);
			oControl.oVLayoutProperties.removeAllContent();
			if (oControl.isAggregated)
				this._findContainerAggregationProperties(items[i].getKey(),
						oControl, oRm);
			else
				this._findContainerProperties(items[i].getKey(), oControl, oRm);
		}
	}
};

//Render the property set available in a header

sap.landvisz.LandscapeEntityRenderer._renderDataContainerProperties = function(
		oRm, oControl, oProperties, header) {

	var continerId = oControl.getId();
	var id;
	if (oProperties && oProperties.length && oProperties.length > 0) {

		for ( var i = 0; i < oProperties.length; i++) {
			this._renderContainerProperty(oControl, oProperties[i], id)
		}

	} else if (oProperties instanceof sap.ui.core.Control) {

		this._renderContainerProperty(oControl, oProperties, id)
	}

};

//Render the control for property
sap.landvisz.LandscapeEntityRenderer._renderContainerProperty = function(
		oControl, oProperty, id) {

	if (oProperty instanceof sap.landvisz.internal.LinearRowField
			|| oProperty instanceof sap.landvisz.internal.NestedRowField
			|| oProperty instanceof sap.landvisz.internal.TreeField
			|| oProperty instanceof sap.landvisz.LongTextField)
		oProperty.setRenderingSize(oControl.getRenderingSize());
	oProperty.totalWidth = oControl.containerWidth;
	oProperty.entityMaximized = oControl.entityMaximized;
//	oProperty.sId = id;
	oControl.oVLayoutProperties.addContent(oProperty);
};

sap.landvisz.LandscapeEntityRenderer._renderEntityAction = function(oRm,
		oControl) {

	for ( var i = 0; i < oControl.entityActionArray.length; i++) {
		oControl.entityAction = oControl.entityActionArray[i];
		oControl.entityAction.entityMaximized = oControl.entityMaximized;

		if (oControl.restore == true
				&& oControl.entityAction.getActionTooltip() == oControl.MAXIMIZE_TEXT) {
			oControl.oHLayoutAllAction.removeContent(oControl.entityAction);
			continue;
		}
		if (oControl.restore == false
				&& oControl.entityAction.getActionTooltip() == oControl.RESTORE_TEXT) {
			oControl.oHLayoutAllAction.removeContent(oControl.entityAction);
			continue;
		}

		if (oControl.expVisible == true
				&& oControl.entityAction.getActionTooltip() == oControl.SHOW_ALL_TEXT) {
			oControl.oHLayoutAllAction.removeContent(oControl.entityAction);
			continue;
		}
		if (oControl.expVisible == false
				&& oControl.entityAction.getActionTooltip() == oControl.COLLAPSE_TEXT) {
			oControl.oHLayoutAllAction.removeContent(oControl.entityAction);
			continue;
		}
		if (oControl.expVisible == true
				&& oControl.entityAction.getActionTooltip() == oControl.MAXIMIZE_TEXT) {
			oControl.oHLayoutAllAction.removeContent(oControl.entityAction);
			continue;
		}

		if (oControl.entityMaximized == true
				&& oControl.entityAction.getActionTooltip() == oControl.SHOW_ALL_TEXT) {
			oControl.oHLayoutAllAction.removeContent(oControl.entityAction);
			continue;
		}

		if (oControl.entityAction.getActionTooltip() == oControl.MAXIMIZE_TEXT)
			oControl.entityAction.setIconSrc(oControl._imgResourcePath
					+ oControl._imgFolderPath + "maximize_enable_dark.png");
		if (oControl.entityAction.getActionTooltip() == oControl.RESTORE_TEXT)
			oControl.entityAction.setIconSrc(oControl._imgResourcePath
					+ oControl._imgFolderPath + "restore_enable_dark.png");
		if (oControl.entityAction.getActionTooltip() == oControl.SHOW_ALL_TEXT)
			oControl.entityAction.setIconSrc(oControl._imgResourcePath
					+ oControl._imgFolderPath + "openshowall_enable_dark.png");
		if (oControl.entityAction.getActionTooltip() == oControl.COLLAPSE_TEXT)
			oControl.entityAction.setIconSrc(oControl._imgResourcePath
					+ oControl._imgFolderPath + "closeshowall_enable_dark.png");
		var renderSize = oControl.getRenderingSize();
		oControl.entityAction.setRenderingSize(renderSize);
		oControl.oHLayoutAllAction.addContent(oControl.entityAction);

		var that = this;
		if (oControl.hasEntityEvent == false) {
			oControl.entityAction.attachPress(function(oEvent) {
				var value = oEvent.oSource;
				if (value.getActionTooltip() == oControl.MAXIMIZE_TEXT) {
					oControl.entityMaximized = true;
					oControl.invalidate();
					oControl.oHLayoutAllAction.removeContent(value);
					oControl.containerEvent = false;
				}
				if (value.getActionTooltip() == oControl.RESTORE_TEXT
						&& oControl.entityMaximized == true) {

					setTimeout(function() {
						oControl.entityMaximized = false;
						oControl.invalidate();
					}, 1000);
				}
				if (value.getActionTooltip() == oControl.RESTORE_TEXT) {
					oControl.entityMaximized = false;
					oControl.oHLayoutAllAction.removeContent(value);
					oControl.containerEvent = false;
				}

				if (value.getActionTooltip() == oControl.SHOW_ALL_TEXT
						&& oControl.entityMaximized == true) {

					oControl.entityMaximized = false;
					oControl.expVisible = true;
					that._renderExplodeView(oRm, oControl);
//					jQuery.sap.byId(oControl.oHLayoutMiniNavigation.getId())
//					.css("display", "none");
					oControl.showMiniNavigation = false;
					setTimeout(function() {
						oControl.entityMaximized = false;
						oControl.invalidate();
					}, 1000);
				}

				if (value.getActionTooltip() == oControl.SHOW_ALL_TEXT) {
					oControl.entityMaximized = false;
					oControl.expVisible = true;
					that._renderExplodeView(oRm, oControl);
//					jQuery.sap.byId(oControl.oHLayoutMiniNavigation.getId())
//					.css("display", "none");
					oControl.showMiniNavigation = false;
					oControl.invalidate();

				}

				if (value.getActionTooltip() == oControl.COLLAPSE_TEXT) {
					oControl.entityMaximized = false;
					oControl.expVisible = false;
//					jQuery.sap.byId(oControl.oHLayoutMiniNavigation.getId())
//					.css("display", "block");
					oControl.showMiniNavigation = true;
					that._resetHeaderData(oRm, oControl);
					that._resetHeaderNavigation(oRm, oControl);
					oControl.nextIcon.setVisible(true);
					oControl.previousIcon.setVisible(true);
					jQuery.sap.byId("SMV").hide(700);
					oControl.invalidate();

				}

			});
			oControl.hasEntityEvent == true;
		}
	}

};

sap.landvisz.LandscapeEntityRenderer._renderExplodeView = function(oRm,
		oControl) {
	this.hideUnselectedHeaders(oRm, oControl);
};

sap.landvisz.LandscapeEntityRenderer.hideUnselectedHeaders = function(oRm,
		oControl) {

	var containers = oControl.getDataContainers();
	for ( var i = 0; i < containers.length; i++) {
		if (i != oControl.selectedIndex) {
			containers[i].visible = false;
		}
	}

	oControl.nextIcon.setVisible(false);
	oControl.previousIcon.setVisible(false);

};

sap.landvisz.LandscapeEntityRenderer._renderUnselectedHeaderPopup = function(
		oRm, oControl) {

	var containers = new Array();
	oRm.write("<div");
	oRm.writeAttributeEscaped("id", "SMV");
	var renderSize = oControl.getRenderingSize();
	if (renderSize == sap.landvisz.EntityCSSSize.RegularSmall)
		oRm.addClass("sapLandviszSMVContainerRegularSmall");
	else if (renderSize == sap.landvisz.EntityCSSSize.Regular)
		oRm.addClass("sapLandviszSMVContainerRegular");
	else if (renderSize == sap.landvisz.EntityCSSSize.Medium)
		oRm.addClass("sapLandviszSMVContainerMedium");
	oRm.writeClasses();

	if (oControl.sViewWidth != 0) 
		oRm.addStyle("width", oControl.sViewWidth - 2 + "px");	
	else if (oControl.getExplodeViewWidth() && oControl.getExplodeViewWidth() != '')
		oRm.addStyle("width", oControl.getExplodeViewWidth());
	if (oControl.sViewHeight != 0) 
		oRm.addStyle("height", "100%");
	else if (oControl.getExplodeViewHeight() && oControl.getExplodeViewHeight() != '')
		oRm.addStyle("height", oControl.getExplodeViewHeight());

	oRm.writeStyles();
	oRm.write(">");

	containers = oControl.getDataContainers();

	var properties;
	var container;
	var property;
	var dialog;
	var that = this;
	var renderSize = oControl.getRenderingSize();
	if (containers.length > 0) {

		for ( var i = 0; i < containers.length; i++) {
			container = containers[i];
			if (i != oControl.selectedIndex) {
				properties = container.getProperties();
				oControl.smvContainer = oControl.dialogArray[i];
				oControl.smvContainer.setRenderingSize(oControl
						.getRenderingSize());
				oControl.smvContainer.setHeader(container.getHeader());
				for ( var j = 0; j < properties.length; j++) {
					property = properties[j];
					oControl.smvContainer.addAggregation("properties",
							property, false);
				}

				oControl.smvContainer.addStyleClass("sapLandviszDisplayNone");
				oRm.renderControl(oControl.smvContainer);

				oControl.smvContainer.attachClosed(function(oEvent) {
					oControl.expVisible = false
					var value = oEvent.oSource;

					var containers = oControl.getDataContainers();
					var backup;
					for ( var i = 0; i < containers.length; i++) {
						backup = value.getProperties();
						var container = containers[i];
						if (container.getHeader() == value.getHeader()) {
							if (backup.length > 0) {
								for ( var j = 0; j < backup.length; j++) {
									container.addAggregation("properties",
											backup[j], false);
								}
							}
						}
					}

					if (that._checkAllPopupClosed(oControl, value)) {
						that._resetHeaderNavigation(oRm, oControl);
						oControl.showMiniNavigation = true;
						oControl.nextIcon.setVisible(true);
						oControl.previousIcon.setVisible(true);
						oControl.invalidate();
					}

				});
			}
		}
	}

	oRm.write("</div>");

};

sap.landvisz.LandscapeEntityRenderer._resetHeaderData = function(oRm, oControl) {

	var container;
	var containers = oControl.getDataContainers();
	var backup;
	for ( var i = 0; i < oControl.dialogArray.length; i++) {
		container = oControl.dialogArray[i];
		backup = container.getProperties();
		if (backup && backup.length && backup.length > 0) {
			for ( var j = 0; j < backup.length; j++) {
				containers[i].addAggregation("properties", backup[j], false);
			}
		}
	}
};

sap.landvisz.LandscapeEntityRenderer._resetHeaderNavigation = function(oRm,
		oControl) {
	var containers = oControl.getDataContainers();
	for ( var i = 0; i < containers.length; i++) {
		if (i != oControl.selectedIndex) {
			containers[i].visible = true;
		}
	}

}

sap.landvisz.LandscapeEntityRenderer._checkAllPopupClosed = function(oControl,
		currentDailog) {

	var dialog;
	for ( var i = 0; i < oControl.dialogArray.length; i++) {
		dialog = oControl.dialogArray[i];
		if (dialog.isOpen() == true && i != oControl.selectedIndex
				&& currentDailog.getHeader() != dialog.getHeader()) {
			oControl.explodeViewClosed = false;
			return false;
		}
	}
	oControl.explodeViewClosed = true;
	return true;

};

sap.landvisz.LandscapeEntityRenderer._renderCustomActionRegion = function(oRm,
		oControl) {

	var continerId = oControl.getId();

	oControl.actions = oControl.getActionBar();
	for ( var i = oControl.actions.length - 1; i >= 0; i--) {
		oControl.action = oControl.actions[i];
		oControl.action.setRenderingSize(oControl.getRenderingSize());
		oControl.action.oActToolBar = oControl.oBtnToolBar;
		oControl.action.systemId = oControl.getSystemId();
		oControl.oHLayoutAction.addContent(oControl.action);
	}
	oControl.oHLayoutAction.addStyleClass("sapLandviszActionLayout");
	var actions = oControl.oHLayoutAction.getContent();

	for ( var j = 0; j < actions.length; j++) {

		actions[j].setRenderingSize(oControl.getRenderingSize());
	}
};

sap.landvisz.LandscapeEntityRenderer._renderOverlayContainer = function(oRm,
		oControl) {

	oControl.oVLayoutOverlay.removeAllContent();
	var renderSize = oControl.getRenderingSize();
	oRm.write("<div");
	oRm.writeClasses();
	oRm.writeAttributeEscaped("id", oControl.getId() + "-innerOverlay");
	oRm.write(" style='");	
	oRm.write("top:74px;");
	if (renderSize == sap.landvisz.EntityCSSSize.RegularSmall) {
		oRm.write("width:24.5em;");
		oRm.write("height:15.88em;");
		oRm.write("left:108px;");
	} 
	if (renderSize == sap.landvisz.EntityCSSSize.Regular) {
		oRm.write("width:28.1em;");
		oRm.write("height:18em;");
		oRm.write("left:124px;");
	} else if (renderSize == sap.landvisz.EntityCSSSize.Medium) {
		oRm.write("width:32.6em;");
		oRm.write("height:21.3em;");
		oRm.write("left:124px;");
	}

	oRm.write("position:absolute;");
	oRm.write("font-size: 12px;");
	oRm.write("border: 1px solid grey;");
	oRm.write("z-index:10;");
	oRm.write("float:left;");
	if (oControl.showOverlay == true)
		oRm.write("display:block;");
	else
		oRm.write("display:none;");
	oRm.write("'");
	oRm.write(">");

	var containers = oControl.getDataContainers();
	var headerContent;
	for ( var i = 0; i < containers.length; i++) {

		if (containers[i].getSelected() == true) {
			headerContent = containers[i].getProperties();
			break;
		}
	}
	
	var row;
	var nestedRow;
	
	if(headerContent){
		for ( var i = 0; i < headerContent.length; i++) {
			if (headerContent[i] instanceof sap.landvisz.internal.LinearRowField) {
				row = new sap.landvisz.internal.LinearRowField();
				row.addStyleClass("overlayRow");
				row.setLabel(headerContent[i].getLabel());
				row.setValue(headerContent[i].getValue());
				row.setRenderingSize(headerContent[i].getRenderingSize());
				row.setIconType(headerContent[i].getIconType());
				row.setIconTitle(headerContent[i].getIconTitle());
				if (oControl.showOverlay == true && oControl.overlayFilter == "")
					row.addStyleClass("sapLandviszDisplayBlock");
				else if (oControl.showOverlay == true
						&& oControl.overlayFilter == headerContent[i]
				.getLinkSource())
					row.addStyleClass("sapLandviszDisplayBlock");
				else
					row.addStyleClass("sapLandviszDisplayNone");
				row.setLinkSource(headerContent[i].getLinkSource());
				row.setRightIconSrc(headerContent[i].getRightIconSrc());
				oControl.oVLayoutOverlay.addContent(row);
			} else if (headerContent[i] instanceof sap.landvisz.internal.NestedRowField) {
				nestedRow = new sap.landvisz.internal.NestedRowField();
				nestedRow.setLabel(headerContent[i].getLabel());
				nestedRow.setRenderingSize(headerContent[i].getRenderingSize());
				nestedRow.setType(headerContent[i].getType());
				nestedRow.setIconTitle(headerContent[i].getIconTitle());
				nestedRow.setLinkSource(headerContent[i].getLinkSource());
				nestedRow.addStyleClass("overlayRow");
				var rows = headerContent[i].getLinearRows();
				var anyRowVisible = false;
				for ( var j = 0; j < rows.length; j++) {
					row = new sap.landvisz.internal.LinearRowField();
					row.setLabel(rows[j].getLabel());
					row.setValue(rows[j].getValue());
					row.setRenderingSize(rows[j].getRenderingSize());
					row.setIconType(rows[j].getIconType());
					row.setIconTitle(rows[j].getIconTitle());
					row.setLinkSource(rows[j].getLinkSource());
					if (oControl.showOverlay == true
							&& oControl.overlayFilter == "") {
						row.addStyleClass("sapLandviszDisplayBlock");
						anyRowVisible = true;
					} else if (oControl.showOverlay == true
							&& oControl.overlayFilter == rows[j].getLinkSource()) {
						row.addStyleClass("sapLandviszDisplayBlock");
						anyRowVisible = true;
					} else
						row.addStyleClass("sapLandviszDisplayNone");
					row.setRightIconSrc(rows[j].getRightIconSrc());
					nestedRow.addAggregation("linearRows", row, false);
				}
				if (anyRowVisible == true)
					nestedRow.addStyleClass("sapLandviszDisplayBlock");
				else
					nestedRow.addStyleClass("sapLandviszDisplayNone");
				oControl.oVLayoutOverlay.addContent(nestedRow);
			}
		}
	}
	
	oControl.oVLayoutOverlay.addStyleClass("sapLandviszVlayoutOverLay");
	oRm.renderControl(oControl.oVLayoutOverlay);
	oRm.write("</div>");
	oRm.write("<div");
	oRm.writeClasses();
	oRm.writeAttributeEscaped("id", oControl.getId() + "-overlay");
	oRm.write(" style='");
	oRm.write("left:0px;");
	oRm.write("top:0px;");
	oRm.write("width:100%;");
	oRm.write("height:100%;");
	oRm.write("position:absolute;");
	oRm.write("background-color:rgb(229, 229, 229);");
	oRm.write("font-size: 12px;");
	oRm.write("z-index:8;");
	oRm.write("cursor:not-allowed;");
	oRm.write("opacity:0.5;");
	oRm.write("float:left;");
	if (oControl.showOverlay == true)
		oRm.write("display:block;");
	else
		oRm.write("display:none;");
	oRm.write("'");
	oRm.write(">");
	oRm.write("</div>");

};
