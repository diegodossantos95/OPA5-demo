/*!
*  @copyright 2012-2014 SAP SE. All rights reserved@
*/
jQuery.sap.require("sap.ui.commons.layout.ResponsiveFlowLayout");
jQuery.sap.require("sap.ui.commons.layout.ResponsiveFlowLayoutData");
jQuery.sap.declare("sap.landvisz.LandscapeViewerRenderer");
jQuery.sap.require("sap.landvisz.internal.Connection");
jQuery.sap.require("sap.landvisz.libs.lvsvg");
/**
* @class LandscapeViewer renderer.
* @static
*/

sap.landvisz.LandscapeViewerRenderer = {};

sap.landvisz.LandscapeViewerRenderer.render = function(oRm, oControl) {

       if (!this.initializationDone) {
             oControl.initControls();
             oControl.initializationDone = true;
             oRm.write("<div");
             oRm.writeControlData(oControl);
             oRm.addClass("sapLandviszViewMainContainer");
             oRm.writeClasses();

             oRm.addStyle("width", "100%");
             oRm.addStyle("height", "100%");
             oRm.writeStyles();
             oRm.write(">");

           if (oControl.getVisibleDependency() == sap.landvisz.DependencyVisibility.BOTH) {
                  oControl.networkViewVisible = true;
                  oControl.boxViewVisible = true;
           }else if (oControl.getVisibleDependency() == sap.landvisz.DependencyVisibility.NETWORK) {
                  oControl.networkViewVisible = true;
                  oControl.boxViewVisible = false;
           }

           else if (oControl.getVisibleDependency() == sap.landvisz.DependencyVisibility.BOX) {
                  oControl.networkViewVisible = false;
                  oControl.boxViewVisible = true;
           }


             this._renderTitle(oRm, oControl);
             if (oControl.getViewType() == sap.landvisz.ViewType.SOLUTION_VIEW) {
                    this._renderSolutionView(oRm, oControl);
             }else {
                    oRm.write("<div");
                    oRm.writeAttributeEscaped("id", oControl.getId() + "-viewLables");
                    oRm.addClass("sapLandviszViews");
                    oRm.writeClasses();
                    oRm.write(">");

                    if (oControl.networkViewVisible == true)
                           this._renderNetworkViewHeader(oRm, oControl);
                    if (oControl.boxViewVisible == true)
                           this._renderBoxViewHeader(oRm, oControl);
                    oRm.write("</div>");

                    if (oControl.getShowDependencyNavigator() == true)
                           this._renderNavigationPath(oRm, oControl);

                    if (oControl.getShowClose() == true)
                           this._renderCloseButton(oRm, oControl);

                    if (oControl.getViewType() == sap.landvisz.ViewType.SELECTION_VIEW)
                           this._renderSelectionView(oRm, oControl);
                    else if (oControl.getViewType() == sap.landvisz.ViewType.DEPENDENCY_VIEW) {
                           this._renderDependencyView(oRm, oControl);
                    }

                    if (oControl.getViewType() == sap.landvisz.ViewType.DEPENDENCY_VIEW)
                           this._renderNavigationPanel(oRm, oControl);
             }
             oRm.write("</div>");
       }

       if (oControl.currentView == sap.landvisz.DependencyType.BOX_VIEW) {
             var backup = oControl.oHLayoutConnectionEntity.getContent();
             for ( var i = 0; i < backup.length; i++) {
                    oControl.addAggregation("connectionEntities", backup[i], false);
             }
       }

       var optionsEntities = oControl.oHLayoutOptions.getContent();
       if (optionsEntities.length > 0) {
             for ( var i = 0; i < optionsEntities.length; i++)
                    if (optionsEntities[i] instanceof sap.landvisz.OptionEntity)
                           oControl.getSolutionOptions()[0]
                                        .addOptionEntity(optionsEntities[i]);
       }
       oControl.firstTime = false;
};

//renders fiori solution viewer
sap.landvisz.LandscapeViewerRenderer._renderSolutionView = function(oRm,oControl) {

       if (oControl.getShowDependencyNavigator() == true)
             this._renderNavigationPath(oRm, oControl);

       if (oControl.getShowClose() == true)
             this._renderCloseButton(oRm, oControl);

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-solutionViewLables");
       oRm.addClass("sapLandviszViews");
       oRm.writeClasses();
       oRm.write(">");
       
       this._renderComponentViewHeader(oRm, oControl);
       this._renderDeploymentViewHeader(oRm, oControl);
       oRm.write("</div>");
       
       // Bug fix to remove the top empty area in Component View
       if(oControl.getSolutionType() == sap.landvisz.SolutionType.DEPLOYMENT_VIEW)
             this._renderOptions(oRm, oControl);
       
       var systems = oControl.getSystems();
       for ( var i = 0; i < systems.length; i++)
             systems[i].setShowEntityActions(false);

       this._renderSolutionViewer(oRm, oControl);
}

// renders component view label and button
sap.landvisz.LandscapeViewerRenderer._renderComponentViewHeader = function(oRm,
             oControl) {

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-compViewLabel");
       oRm.addClass("sapLandviszView");
       oRm.writeClasses();
       oRm.write(">");
       oControl.compViewBtn.setText(oControl.getComponentViewLabel());
       oControl.compViewBtn.setLite(true);
       oControl.compViewBtn.addStyleClass("sapLandviszSolution_view_text");
       oControl.compViewBtn.setTooltip(oControl.getComponentViewTooltip());
       oControl.compViewBtn.setIcon("sap-icon://tree");
       var _that = this;
       if (oControl.firstTime == true) {
             oControl.compViewBtn.attachPress(function(oEvent) {

                                 oControl.currentSolutionView = sap.landvisz.SolutionType.COMPONENT_VIEW;

                                 oControl.compViewBtn.addStyleClass("selectedView");

                                 oControl.depViewBtn.removeStyleClass("selectedView");
                                 
                                 // fire a event from here.
                                 oControl.fireLoadSolutionView();
                           });
       }
       oRm.renderControl(oControl.compViewBtn);

       oRm.write("</div>");

};

//renders deployment view label and button
sap.landvisz.LandscapeViewerRenderer._renderDeploymentViewHeader = function(
             oRm, oControl) {

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-deploymentViewLable");
       oRm.addClass("sapLandviszView");
       oRm.writeClasses();
       oRm.write(">");
       oControl.depViewBtn.setText(oControl.getDeploymentViewLabel());
       oControl.depViewBtn.setLite(true);
       oControl.depViewBtn.addStyleClass("sapLandviszSolution_view_text");
       oControl.depViewBtn.setTooltip(oControl.getDeploymentViewTooltip());
       oControl.depViewBtn.setIcon("sap-icon://dimension");

       var _that = this;
       if (oControl.firstTime == true) {
             oControl.depViewBtn.attachPress(function(oEvent) {
                                 oControl.currentSolutionView = sap.landvisz.SolutionType.DEPLOYMENT_VIEW;

                                 oControl.depViewBtn.addStyleClass("selectedView");
                                  
                                 oControl.compViewBtn.removeStyleClass("selectedView");

                                 // fire a event from here.
                                 oControl.fireLoadSolutionView();

                           });
       }
       oRm.renderControl(oControl.depViewBtn);

       oRm.write("</div>");

};

// renders the solution viewer container
sap.landvisz.LandscapeViewerRenderer._renderSolutionViewer = function(oRm,oControl) {

      if(null!= oControl.getPlugContent())
    	 this. _renderPlugContent(oRm,oControl);

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-solutionViewContainer");
       oRm.addClass("sapLandviszSolutionViewContainer");
       oRm.writeClasses();
       var width = oControl.windowWidth - 2;
       oRm.addStyle("width", width + "px");
        var calHeight; 
       if(oControl.getSolutionType() == sap.landvisz.SolutionType.DEPLOYMENT_VIEW){
    	  calHeight = oControl.getPlugContentHeight() + 90;
//	       oRm.addStyle("height", "calc(100% - 90px)");
//	       oRm.addStyle("height", "-webkit-calc(100% - 90px)");
//	       oRm.addStyle("height", "-moz-calc(100% - 90px)");
//	       oRm.addStyle("height", "-o-calc(100% - 90px)");
    	  	oRm.addStyle("position", "absolute");
       }else{
    	   calHeight = oControl.getPlugContentHeight() + 35;
//    	   oRm.addStyle("height", "calc(100% - 35px)");
//	       oRm.addStyle("height", "-webkit-calc(100% - 35px)");
//	       oRm.addStyle("height", "-moz-calc(100% - 35px)");
//	       oRm.addStyle("height", "-o-calc(100% - 35px)");
       }
       
       
       		oRm.addStyle("height", "calc(100% - "+calHeight+"px)");
	       oRm.addStyle("height", "-webkit-calc(100% - "+calHeight+"px)");
	       oRm.addStyle("height", "-moz-calc(100% - "+calHeight+"px)");
	       oRm.addStyle("height", "-o-calc(100% - "+calHeight+"px)");
	       oRm.addStyle("top",calHeight+"px");
       oRm.writeStyles();
       oRm.write(">");
      
       this._renderSolutionContainer(oRm, oControl);
       this._renderSolution(oRm, oControl);
       if (oControl.getShowDeploymentTypeSection() == true)
             this._renderSolutionDeploymentType(oRm, oControl);
       // Bug fix to remove the top empty area in Component View
       if(oControl.getSolutionType() == sap.landvisz.SolutionType.COMPONENT_VIEW)
             this._renderOptions(oRm, oControl);
       oRm.write("</div>");
};


sap.landvisz.LandscapeViewerRenderer._renderPlugContent = function(oRm,oControl) {


	   oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-solutionPlugContent");
        oRm.addStyle("top", "32px");
        oRm.addStyle("width", "100%");
         oRm.addStyle("position", "absolute");
        oRm.writeStyles();
       oRm.write(">");
       oRm.renderControl(oControl.getPlugContent());
       oRm.write("</div>");
}

// renders solution inner container
sap.landvisz.LandscapeViewerRenderer._renderSolutionContainer = function(oRm,
             oControl) {

       var connectors = oControl.getConnectors();
       oControl.connection.init();
       var options = oControl.getSolutionOptions();
       var connectedLayout;
       if (options.length >0 && options[0].getType() == sap.landvisz.OptionType.VIEW) 
       connectedLayout = oControl.getViewConnectedLayout()
       else
       connectedLayout = oControl.connection.getBoxViewConnectedNodesLayout(connectors);
       var margin = 5;

       var boxContainerWidth = Number((oControl.entityWidth * connectedLayout.maxColumnCount)
                    + ((connectedLayout.maxColumnCount + 1) * margin));
       var boxContainerHeight = Number(oControl.boxModeHeight + oControl.entityHeight + (margin * 3));
       
       if (oControl.getSolutionOptions().length >0 && oControl.getSolutionType() == sap.landvisz.SolutionType.COMPONENT_VIEW )
             boxContainerHeight = boxContainerHeight + 50;

       if (oControl.getShowDeploymentTypeSection() == true)
             boxContainerHeight = boxContainerHeight + 40;
       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId()
                    + "-solutionInnerContainer");
       oRm.addClass("sapLandviszBoxViewBorderContainer");
       oRm.writeClasses();
       oRm.addStyle("width", boxContainerWidth + "px");
       oRm.addStyle("height", boxContainerHeight + "px");
       oRm.writeStyles();
       oRm.write(">");
       oRm.write("</div>");
};

//algorithm to render components in solution viewer inner container
sap.landvisz.LandscapeViewerRenderer._renderSolution = function(oRm, oControl) {

	oControl.connection.init();
	var options = oControl.getSolutionOptions();
	var connectedLayout;
	if (options.length >0 && options[0].getType() == sap.landvisz.OptionType.VIEW) 
       connectedLayout = oControl.getViewConnectedLayout()
    else { 
    
           connectedLayout = oControl.getEntityConnectedLayout()
//    	var connectors = oControl.getConnectors();
//       connectedLayout = oControl.connection.getBoxViewConnectedNodesLayout(connectors);
         }
       var entityID;
       var connectionId;
       var margin = 5;

       if (connectedLayout) {
             var boxContainerId = oControl.getId() + "-solutionInnerContainer";
             var boxContainer = jQuery.sap.byId(boxContainerId);

             setTimeout(function() {
                    boxContainer.css("display", "block");
             }, 1200);

             oControl.visibleEntities = [];
             var systems = oControl.getSystems();
             for ( var i = 0; i < systems.length; i++) {
                    entityID = systems[i].getSystemId();
                    var labelWidth = 0;
                    labelWidth = 30 + margin;
                    var actualMargin = 30;
                    if (connectedLayout[entityID]) {

                           var leftPos = 0;
                           if (connectedLayout.thirdLevelEntitiesCount > 0)
                                 leftPos = 30;
                           var topPos = 0;
                           leftPos += Number((connectedLayout[entityID].col * (oControl.entityWidth))
                                        + ((connectedLayout[entityID].col + 1) * margin));

                           topPos += Number(((connectedLayout[entityID].row - 1) * (oControl.entityHeight))
                                        + ((connectedLayout[entityID].row + 1) * margin)
                                        + oControl.boxModeHeight);

                           systems[i].left = leftPos;
                           systems[i].top = topPos;
                           systems[i].viewType = sap.landvisz.ViewType.SOLUTION_VIEW;
                           oControl.visibleEntities.push(systems[i]);
                           oRm.renderControl(systems[i]);
                    }

                    else {
                           systems[i].viewType = sap.landvisz.ViewType.SOLUTION_VIEW;
                           systems[i].addStyleClass("sapLandviszDisplayNone");
                           oRm.renderControl(systems[i]);
                    }
             }
             // render Connection Entity
             var connectionEntities = oControl.getConnectionEntities();
             var connectionEntityWidth = 0;
             for ( var i = 0; i < connectionEntities.length; i++) {
                    connectionEntityWidth = 0;
                    connectionId = connectionEntities[i].getConnectionId();
                    if (connectedLayout[connectionId]) {
                           leftPos = Number(connectedLayout[connectionId].col
                                        * (oControl.entityWidth + 10))
                                        + margin;
                           topPos = Number(connectedLayout[connectionId].row
                                        * (oControl.entityHeight + 10))
                                        + margin;

                           connectionEntityWidth = Number(((connectedLayout[connectionId].colspan) * oControl.entityWidth)
                                        + ((connectedLayout[connectionId].colspan - 1) * margin));
                    }
                    connectionEntities[i].viewType = sap.landvisz.ViewType.SOLUTION_VIEW;
                    connectionEntities[i].left = leftPos;
                    connectionEntities[i].top = topPos;
                    connectionEntities[i].width = connectionEntityWidth;
                    connectionEntities[i].height = 90;

                    connectionEntities[i].innerLeft = 0;
                    connectionEntities[i].innerTop = 0;
                    connectionEntities[i].innerWidth = connectionEntityWidth;
                    connectionEntities[i].innerHeight = 90;

                    oRm.renderControl(connectionEntities[i]);
                    connectionEntities[i].addStyleClass("connectionBox");
             }
       }

       var navigationContainer = jQuery.sap.byId(oControl.getId() + "-navigation");
       var navigator = jQuery.sap.byId(oControl.getId() + "-navigation_navigator");
       navigationContainer.animate({
             height : '0px'
       }, 900, "swing", function(e) {
             navigationContainer.hide();
       });

};

// renders deployment view for solution viewer
sap.landvisz.LandscapeViewerRenderer._renderSolutionDeploymentType = function(
             oRm, oControl) {

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId()
                    + "-deploymentTypeContainer");
       oRm.addClass("sapLandviszDeploymentTypeContainer");
       oRm.writeClasses();
       oRm.write(">");

       var options = oControl.getSolutionOptions();
       var option;
       var optionsEntities;
       var optionSources;
       var entityid;
       var entity;
       var nextEntity;
       var count = 0;
       var selected;
       var depType;
       var srcEntity;
       var depTypeControls;
       optionsEntities = oControl.oHLayoutOptions.getContent();
       for ( var j = 1; j < optionsEntities.length; j++) {

             depTypeControls = new Array();
             optionSources = optionsEntities[j].getOptionSources();
             selected = optionsEntities[j].getSelected();

             for ( var k = 0; k < optionSources.length; k++) {
                    entityid = optionSources[k].getSource();

                    entity = this._getDesiredSystem(oControl, optionSources[k]
                                 .getSource());

                    if (null != entity
                                 && entity.getComponentType() == sap.landvisz.ComponentType.notDefined)
                           continue;
                    else if (k + 1 < optionSources.length) {

                           nextEntity = this._getDesiredSystem(oControl,
                                        optionSources[k + 1].getSource());

                           if (entity.getComponentType() == nextEntity.getComponentType()) {
                                 count++;
                           } else {
                                 srcEntity = this._getDesiredSystem(oControl,
                                               optionSources[k - count].getSource());
                                 depType = this._renderDeploymentType(oRm, oControl, count,
                                               srcEntity.left, entity.getComponentType(), entity
                                                            .getComponentTypeTooltip(), selected,
                                               srcEntity.getSystemId());
                                 depTypeControls.push(depType);
                                 count = 0
                           }
                    } else {
                           srcEntity = this._getDesiredSystem(oControl, optionSources[k
                                        - count].getSource());
                           depType = this._renderDeploymentType(oRm, oControl, count,
                                        srcEntity.left, entity.getComponentType(), entity
                                                     .getComponentTypeTooltip(), selected, srcEntity
                                                     .getSystemId());
                           depTypeControls.push(depType);
                           count = 0
                    }

             }

             oControl.depTypeOptions[optionsEntities[j].getId()] = depTypeControls;
       }
       oRm.write("</div>");
}


//returns desired system
sap.landvisz.LandscapeViewerRenderer._getDesiredSystem = function(oControl, id) {

       var systems = oControl.getSystems();
       for ( var i = 0; i < systems.length; i++) {
             if (systems[i].getSystemId() == id)
                    return systems[i];
       }

       return null;
}

// renders the deployment type
sap.landvisz.LandscapeViewerRenderer._renderDeploymentType = function(oRm,
             oControl, count, left, type, tooltip, selected, srcEntityId) {

       var oDepType = new sap.landvisz.internal.DeploymentType();
       oDepType.left = left;
       oDepType.count = count;
       oDepType.type = type;
       oDepType.srcEntityId = srcEntityId;
       oDepType.setTooltip(tooltip);
       oDepType.standardWidth = oControl.entityWidth;
       if (selected == true)
             oDepType.addStyleClass("sapLandviszDisplayBlock");
       else
             oDepType.addStyleClass("sapLandviszDisplayNone");
       oRm.renderControl(oDepType);
       return oDepType;
}

//renders option container
sap.landvisz.LandscapeViewerRenderer._renderOptions = function(oRm, oControl) {
       var options = oControl.getSolutionOptions();
       if(options.length <=0)
             return;

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-optionContainer");
       if (oControl.getSolutionOptionType() == sap.landvisz.OptionType.VIEW) 
             oRm.addClass("sapLandviszOptionContainer");
       else if (oControl.getSolutionOptionType() == sap.landvisz.OptionType.ENTITY)
             oRm.addClass("sapLandviszEntityOptionContainer");
       oRm.writeClasses();

       if (oControl.getSolutionOptionType() == sap.landvisz.OptionType.VIEW){
             var width = oControl.windowWidth - 2;
             oRm.addStyle("width", width +"px");
             oRm.writeStyles();
       }
       oRm.write(">");
       this._createOptions(oRm, oControl);
       oRm.write("</div>");
}

// creates deployment options
sap.landvisz.LandscapeViewerRenderer._createOptions = function(oRm, oControl) {
       if (oControl.getSolutionOptionType() == sap.landvisz.OptionType.VIEW) {
             this._renderViewOptions(oRm, oControl, oControl.getSolutionOptionType());
       } else if (oControl.getSolutionOptionType() == sap.landvisz.OptionType.ENTITY) {
             this._createEntityOptions(oRm, oControl);
       }

}

// renders deployment options when option type is entity
sap.landvisz.LandscapeViewerRenderer._createEntityOptions = function(oRm, oControl) {
       var options = oControl.getSolutionOptions();
       var optionsEntities;
       var systems = oControl.getSystems();
       var srcLeft;
       var srcTop;
       var that = this;
       for ( var i = 0; i < options.length; i++) {
             optionsEntities = options[i].getOptionEntities();
             if("" == oControl.srcEntity)
             oControl.srcEntity = options[i].getCurrentEntity();
             for ( var j = 0; j < optionsEntities.length; j++) {
                    for ( var l = 0; l < systems.length; l++) {
                           if (oControl.srcEntity == systems[l].getSystemId()) {
                                 srcLeft = systems[l].left;
                                 srcTop = systems[l].top;
                                 break;
                           }
                    }

                    // This logic is not correct we need to align this in the middle may be use a Hlayout
                    srcLeft = srcLeft + oControl.entityWidth / 2 - 50 + 50 * j;
                    optionsEntities[j].left = srcLeft;
                    optionsEntities[j].optionOn = options[i].getType();
                    optionsEntities[j].optionSrcEntityId = oControl.srcEntity;
                    optionsEntities[j].attachEvent(
                                               "optionSelected",
                                               function(event) {
                                                     var optionBtn = event.getSource();
                                                     var sources = optionBtn.getOptionSources();
                                                     var entityTobePlaced;
                                                     for ( var i = 0; i < sources.length; i++) {
                                                            entityTobePlaced = sources[i].getSource();
                                                     }

                                                     if (oControl.srcEntity == entityTobePlaced)
                                                            return;
                                                     oControl.selectedOptionEntity = optionBtn;
                                                     for ( var i = 0; i < options.length; i++) {
                                                            optionsEntities = options[i]
                                                                          .getOptionEntities();
                                                            for ( var j = 0; j < optionsEntities.length; j++) {
                                                                   if (oControl.srcEntity == optionsEntities[j].optionSrcEntityId
                                                                                && optionBtn.getId() == optionsEntities[j]
                                                                                             .getId()) {
                                                                          jQuery.sap
                                                                                       .byId(
                                                                                                    optionsEntities[j]
                                                                                                                 .getId())
                                                                                       .css(
                                                                                                    {
                                                                                                           "background-color" : "#008fd3",
                                                                                                           "color" : "#ffffff"
                                                                                                    });
                                                                   } else {
                                                                          jQuery.sap
                                                                                       .byId(
                                                                                                    optionsEntities[j]
                                                                                                                 .getId())
                                                                                       .css(
                                                                                                    {
                                                                                                           "background-color" : "transparent",
                                                                                                           "color" : "#00669c"
                                                                                                    });

                                                                          optionsEntities[j]
                                                                                       .setSelected(false);
                                                                  }

                                                            }
                                                     }
                                                     that._makeOptionVisible(oRm, oControl, event);
                                               });
                    oRm.renderControl(optionsEntities[j]);
             }
       }
}

// renders options when option entity is of type view
sap.landvisz.LandscapeViewerRenderer._renderViewOptions = function(oRm, oControl, optionType) {
       var options = oControl.getSolutionOptions();
       var optionsEntities = options[0].getOptionEntities();
       if (optionsEntities.length > 0) {
             var title = oControl.getDeploymentOptionsLabel();
             oControl.deploymentOptionLabel.setText(title);
             oControl.deploymentOptionLabel.setTooltip(oControl.getDeploymentOptionsTooltip());
              oControl.deploymentOptionLabel.addStyleClass("sapLandviszOptionLabel");
             oControl.oHLayoutOptions.addContent(oControl.deploymentOptionLabel);
       }
       var that = this;
       for ( var i = 0; i < optionsEntities.length; i++) {
             optionsEntities[i].optionOn = optionType;
             if (optionsEntities[i].getSelected() == true) {
                    oControl.currentViewOptionId = optionsEntities[i].getId();
                    oControl.selectedOptionEntity = optionsEntities[i];
             }
             optionsEntities[i].attachEvent("optionSelected", function(event) {

                    var optionBtn = event.getSource();

                    if (oControl.currentViewOptionId == optionBtn.getId())
                           return;
                    oControl.selectedOptionEntity = optionBtn;
                    var optionEntity;
                    optionsEntities = oControl.oHLayoutOptions.getContent();
                    optionsEntities = oControl.getSolutionOptions()[0].getOptionEntities();

                    for ( var j = 0; j < optionsEntities.length; j++) {
                           optionEntity = jQuery.sap.byId(optionsEntities[j].getId());
                           optionEntity.css({
                               "background-color" : "transparent",
                               "color" : "#00669c"
                           });
                           if (optionBtn.getId() == optionsEntities[j].getId()) {
                                 optionsEntities[j].setSelected(true);
                           } else {
                                 optionsEntities[j].removeStyleClass("optionSelected")
                                 optionsEntities[j].setSelected(false);
                           }
                    }
                    that._makeOptionVisible(oRm, oControl, event);
             });

             oControl.oHLayoutOptions.addContent(optionsEntities[i]);
       }
       oRm.renderControl(oControl.oHLayoutOptions);
};

// turns visibility of options on/off 
sap.landvisz.LandscapeViewerRenderer._makeOptionVisible = function(oRm,
             oControl, event) {
       var optionBtn = event.getSource();

       if (optionBtn.optionOn == sap.landvisz.OptionType.VIEW) {
             this._makeViewOptionVisible(oRm, oControl, optionBtn);
       } else if (optionBtn.optionOn == sap.landvisz.OptionType.ENTITY) {
             this._makeEntityOptionVisible(oRm, oControl, optionBtn);
       }

}

// turns visibility of options on/off for type View
sap.landvisz.LandscapeViewerRenderer._makeViewOptionVisible = function(oRm,
             oControl, optionBtn) {

       if (oControl.currentViewOptionId == optionBtn.getId())
             return;
       oControl.currentViewOptionId = optionBtn.getId();

       var systems = oControl.getSystems();
       var system;
       for ( var i = 0; i < systems.length; i++) {
             systems[i].removeStyleClass("sapLandviszDisplayNone");
             system = jQuery.sap.byId(systems[i].getId());
             system.hide("600");
       }

       var depContainerid = oControl.getId() + "-deploymentTypeContainer";
       var depContainer = jQuery.sap.byId(depContainerid);
       var selectedDepTypes = oControl.depTypeOptions[oControl.selectedOptionEntity.getId()];
       var deploymentTypes = depContainer.children();
       var deploymentType;
       for ( var x = 0; x < deploymentTypes.length; x++) {
             deploymentType = jQuery.sap.byId(deploymentTypes[x].id);
             deploymentType.css({
                    "display" : "none"
             });
       }
       var sources = optionBtn.getOptionSources();
       var entityTobePlaced;
       var connectors = oControl.getConnectors();
       // we are taking a tradeoff that there is only one connection entity for the
       // Solution view & the same is declared as source for the connector
       var connectionEntityId = connectors[0].getSource();
       var connectorArray = [];
       var connector;
       for ( var i = 0; i < sources.length; i++) {
             connector = new sap.landvisz.Connector();
             entityTobePlaced = sources[i].getSource();
             connector.setSource(connectionEntityId);
             connector.setTarget(entityTobePlaced);
             connectorArray.push(connector);
       }

       var entityID;
       var connectionId;
       var margin = 5;
       var system;
       var connectionEntityWidth;
       oControl.connection.init();
       var connectedLayout = oControl.connection.getBoxViewConnectedNodesLayout(connectorArray);
       if (connectedLayout) {
             var boxContainerWidth = Number((oControl.entityWidth * connectedLayout.maxColumnCount)
                           + ((connectedLayout.maxColumnCount + 1) * margin));
             var boxContainerHeight = Number(oControl.boxModeHeight + oControl.entityHeight + (margin * 3));

             var depContainerid = oControl.getId() + "-deploymentTypeContainer";
             if (selectedDepTypes && selectedDepTypes.length > 0){
                    boxContainerHeight = boxContainerHeight + 40;
                    jQuery.sap.byId(depContainerid).css({
   					 "display" : "block",
   				 });
             }else{
            	 jQuery.sap.byId(depContainerid).css({
					 "display" : "none",
				 });
             }

             var boxContainerId = oControl.getId() + "-solutionInnerContainer";
             var boxContainer = jQuery.sap.byId(boxContainerId);
             boxContainer.animate({
                    width : boxContainerWidth,
                    height : boxContainerHeight
             }, 400);

             setTimeout(
            		 function() {


            			 var boxContainerId = oControl.getId() + "-solutionInnerContainer";
            			 var boxContainer = jQuery.sap.byId(boxContainerId);
            			 var boxLeftMargine = boxContainer[0].offsetLeft;
            			 var boxTopMargine = boxContainer[0].offsetTop;

            			 var deploymentOptionsTop = 0;
            			 var connectionEntities = oControl.getConnectionEntities();
            			 for ( var i = 0; i < connectionEntities.length; i++) {
            				 connectionId = connectionEntities[i].getConnectionId();
            				 if (connectedLayout[connectionId]) {
            					 leftPos = Number(connectedLayout[connectionId].col
            							 * (oControl.entityWidth + 10));
            					 topPos = Number(connectedLayout[connectionId].row
            							 * (oControl.entityHeight + 10));
            					 leftPos = Number(connectedLayout[connectionId].col
            							 * (oControl.entityWidth + 10))
            							 + margin;
            					 topPos = Number(connectedLayout[connectionId].row
            							 * (oControl.entityHeight + 10))
            							 + margin;
            					 connectionEntities[i].left = leftPos
            					 + boxLeftMargine;
            					 deploymentOptionsTop = connectionEntities[i].top ;
            					 connectionEntities[i].top = leftPos + boxTopMargine;
            					 connectionEntityWidth = Number(((connectedLayout[connectionId].colspan) * oControl.entityWidth)
            							 + ((connectedLayout[connectionId].colspan - 1) * margin));
            					 var entity = jQuery.sap.byId(connectionEntities[i]
            					 .getId());

            					 entity.animate({
            						 left : connectionEntities[i].left,
            						 top : connectionEntities[i].top,
            						 width : connectionEntityWidth,
            						 height : 90,
            					 }, 600, 'swing');

            					 var connectionRow = jQuery.sap
            					 .byId(connectionEntities[i].getId()
            							 + "connectionRow");

            					 connectionRow.animate({
            						 width : connectionEntityWidth,
            						 height : 90,
            					 }, 600, 'swing');
            					 
            					 var conLbl =  jQuery.sap.byId(connectionEntities[i].getId() +"-connectionLabel");
            					 var conLblWidth = connectionEntityWidth - 68;
            					  conLbl.css({
            						  	"max-width" : conLblWidth,
            					  	});
            				 }
            			 }
            			 oControl.visibleEntities = [];
            			 for ( var i = 0; i < systems.length; i++) {
            				 entityID = systems[i].getSystemId();
            				 var labelWidth = 0;
            				 labelWidth = 30 + margin;
            				 var actualMargin = 30;
            				 if (connectedLayout[entityID]) {
            					 var leftPos = 0;
            					 var topPos = 0;
            					 leftPos += Number((connectedLayout[entityID].col * (oControl.entityWidth))
            							 + ((connectedLayout[entityID].col + 1) * margin));

            					 topPos += Number(((connectedLayout[entityID].row - 1) * (oControl.entityHeight))
            							 + ((connectedLayout[entityID].row + 1) * margin)
            							 + oControl.boxModeHeight);
            					 systems[i].left = leftPos + boxLeftMargine;
            					 systems[i].top = topPos + boxTopMargine;
            					 system = jQuery.sap.byId(systems[i].getId());
            					 system.css({
            						 left : leftPos + boxLeftMargine,
            						 top : topPos + boxTopMargine
            					 });
            					 system.show("700");
            					 oControl.visibleEntities.push(systems[i]);
            				 }

            			 }

            			 var depContainerid = oControl.getId() + "-deploymentTypeContainer";
            			 var depContainer = jQuery.sap.byId(depContainerid);

            			 depContainer.css({
            				 left : boxLeftMargine,
            				 width : boxContainerWidth,
            			 });

            			 var depLeft;
            			 var srcEntity;
            			 if (selectedDepTypes && selectedDepTypes.length > 0) {
            				 for ( var x = 0; x < selectedDepTypes.length; x++) {
            					 deploymentType = selectedDepTypes[x];
            					 for ( var i = 0; i < systems.length; i++) {
            						 if (systems[i].getSystemId() == deploymentType.srcEntityId) {
            							 srcEntity = systems[i];
            							 break;
            						 }
            					 }
            					 depLeft = srcEntity.left - boxLeftMargine;
            					 jQuery.sap.byId(deploymentType.getId()).css({
            						 "display" : "block",
            						 "left" : depLeft
            					 });

            				 }
            			 }

            		 }, 405);
       }
};

// turns visibility of options on/off for type entity
sap.landvisz.LandscapeViewerRenderer._makeEntityOptionVisible = function(oRm,
             oControl, optionBtn) {

       var systems = oControl.getSystems();
       var sources = optionBtn.getOptionSources();
       optionBtn.setSelected(true);
       var entityTobePlaced;
       for ( var i = 0; i < sources.length; i++) {
             entityTobePlaced = sources[i].getSource();
       }

       if (oControl.srcEntity == entityTobePlaced)
             return;
       var system;
       var srcLeft;
       var srcTop;
       var canReplace = false;
       for ( var k = 0; k < systems.length; k++) {
             if (oControl.srcEntity == systems[k].getSystemId()) {
                    system = jQuery.sap.byId(systems[k].getId());
                    srcLeft = systems[k].left;
                    srcTop = systems[k].top;
                    system.hide("800");
                    break;
             }
       }
       setTimeout(function() {
             for ( var l = 0; l < systems.length; l++) {
                    if (entityTobePlaced == systems[l].getSystemId()) {
                           system = jQuery.sap.byId(systems[l].getId());
                           system.css({
                                 left : srcLeft,
                                 top : srcTop
                           });
                           systems[l].left = srcLeft;
                           systems[l].top = srcTop;
                           systems[l].removeStyleClass("sapLandviszDisplayNone");
                           oControl.srcEntity = systems[l].getSystemId();
                           system.show("800");
                           break;

                    }
             }
       }, 810);

};

// renders navigation path in dependency view
sap.landvisz.LandscapeViewerRenderer._renderNavigationPath = function(oRm,
             oControl) {

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-navigationPath");
       oRm.addClass("sapLandviszDependencyPath");
       oRm.writeClasses();
       oRm.write(">");
       oControl.navigationPathLabel.setText(oControl.getNavigationPath());
       oControl.navigationPathLabel.setTooltip(oControl.getNavigationPath());
       oControl.navigationPathLabel
                    .addStyleClass("sapLandviszDependencyPathLabel");
       oRm.renderControl(oControl.navigationPathLabel);
       oRm.write("</div>");

};

// renders selection view/single system view
sap.landvisz.LandscapeViewerRenderer._renderSelectionView = function(oRm,
             oControl) {

       var systems = oControl.getSystems();
       var actions = systems[0].getActionBar();

       for ( var j = 0; j < actions.length; j++) {
             actions[j].attachEvent("changeView", function(event) {
                    oControl.resetView(systems[0], event.oSource);
             }, this);
       }
       var left = 0;
       var top = 0;
       var expWidth = 0;
       var expHeight = 0;
       var outerHeight = oControl.windowHeight - 28 - 2;

       oRm.write("<div");
       
       oRm.addStyle("width", "100%");
       oRm.addStyle("height", outerHeight + "px");
       oRm.addStyle("overflow", "auto");
       oRm.addStyle("box-sizing", "border-box");
       oRm.addStyle("top", "28px");
       oRm.addStyle("position", "absolute");
       oRm.writeStyles();
       oRm.writeAttributeEscaped("id", oControl.getId() + "-outerContainer");
       oRm.writeClasses();
       oRm.write(">");
       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-container");
       oRm.writeClasses();

       oRm.addStyle("position", "absolute");
       oRm.addStyle("box-sizing", "border-box");

       if (systems[0].entityMaximized == true) {
             expWidth = oControl.windowWidth - 40;
             expHeight = oControl.windowHeight - 66;
             left = 20;
             top = 20;
             systems[0].sViewWidth = expWidth;
             systems[0].sViewHeight = expHeight;
       } else if (systems[0].expVisible == true) {
             expWidth = oControl.windowWidth - 12;
             expHeight = oControl.windowHeight;
             left = 10;
             oRm.addStyle("position", "relative");
             systems[0].sViewWidth = expWidth - oControl.entityWidth;
             systems[0].sViewHeight = expHeight;
       } else {
             systems[0].sViewWidth = 0;
             systems[0].sViewHeight = 0;
       }
       oRm.addStyle("left", left + "px");
       oRm.addStyle("top", top + "px");
       if (expWidth != 0)
             oRm.addStyle("width", expWidth + "px");
       else
             oRm.addStyle("width", oControl.entityWidth + "px");
       if (expHeight != 0)
             oRm.addStyle("height", expHeight + "px");
       else
             oRm.addStyle("height", oControl.entityHeight + "px");

       oRm.writeStyles();
       oRm.write(">");
       systems[0].viewType = sap.landvisz.ViewType.SELECTION_VIEW;
       systems[0].display = "block";
       oRm.renderControl(systems[0]);
       oRm.write("</div>");
       oRm.write("</div>");

};

// renders dependency view
sap.landvisz.LandscapeViewerRenderer._renderDependencyView = function(oRm,
             oControl) {

       var systems = oControl.getSystems();

       for ( var i = 0; i < systems.length; i++)
             systems[i].setShowEntityActions(false);

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-viewContainer");
       oRm.writeClasses();
       var width = oControl.windowWidth - 2;
       var height = oControl.windowHeight - 26;
       //oRm.write(" style='");
//     oRm.write("width:" + width + "px;");
//     oRm.write("height:" + height + "px;");
//     oRm.write("position:absolute;");
//     oRm.write("overflow:hidden;");
//     oRm.write("top:" + 26 + "px;");
       //oRm.write("'");
       oRm.addStyle("width", width + "px");
       oRm.addStyle("height", height + "px");
       oRm.addStyle("position", "absolute");
       oRm.addStyle("overflow", "hidden");
       oRm.addStyle("top", 26 + "px");
       oRm.writeStyles();
       oRm.write(">");

       this._renderBoxContainer(oRm, oControl);

       if (oControl.currentView != ""
                    && oControl.currentView == sap.landvisz.DependencyType.NETWORK_VIEW)
             this._renderNetworkView(oRm, oControl)
       else if (oControl.currentView != ""
                    && oControl.currentView == sap.landvisz.DependencyType.BOX_VIEW)
             this._renderBoxView(oRm, oControl);
       else if (oControl.getVisibleDependency() == sap.landvisz.DependencyVisibility.BOTH) {
             if (oControl.getDefaultDependencyView() == sap.landvisz.DependencyType.NETWORK_VIEW)
                    this._renderNetworkView(oRm, oControl);
             if (oControl.getDefaultDependencyView() == sap.landvisz.DependencyType.BOX_VIEW)
                    this._renderBoxView(oRm, oControl);
       } else if (oControl.getVisibleDependency() == sap.landvisz.DependencyVisibility.NETWORK)
             this._renderNetworkView(oRm, oControl);
       else if (oControl.getVisibleDependency() == sap.landvisz.DependencyVisibility.BOX)
             this._renderBoxView(oRm, oControl);
       this._renderBoxViewLabels(oRm, oControl);

       oRm.write("</div>");
};

// renders close button for dependency view
sap.landvisz.LandscapeViewerRenderer._renderCloseButton = function(oRm,
             oControl) {

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-closeBtn");
       oRm.addClass("sapLandviszCloseButton");
       oRm.writeClasses();
       oRm.write(">");

       oControl.closeImg.setSrc(sap.ui.resource("sap.landvisz",
                    "themes/base/img/framework/" + "16x16" + "/close_enable_dark.png"));
       oControl.closeImg.setTooltip(oControl.getCloseButtonTooltip());
       if (oControl.firstTime == true)
             oControl.closeImg.attachPress(function(oEvent) {

                    oControl.fireClose();
             });

       oRm.renderControl(oControl.closeImg);

       oRm.write("</div>");
};

// renders network view label and button
sap.landvisz.LandscapeViewerRenderer._renderNetworkViewHeader = function(oRm,
             oControl) {

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-netwrokViewLable");
       oRm.addClass("sapLandviszView");
       oRm.writeClasses();
       oRm.write(">");
       oControl.networkViewBtn.setText(oControl.getNetworkDependencyLabel());
       oControl.networkViewBtn.setLite(true);
       oControl.networkViewBtn.addStyleClass("sapLandviszView_text");
       oControl.networkViewBtn.setTooltip(oControl.getNetworkDependencyLabel());

       var type = oControl.getViewType();
       oControl.networkViewBtn.setIcon("sap-icon://overview-chart");
       if (type == sap.landvisz.ViewType.SELECTION_VIEW) {
             oControl.networkViewBtn.setEnabled(false);
       } else if (type == sap.landvisz.ViewType.DEPENDENCY_VIEW) {
             oControl.networkViewBtn.setEnabled(true);
       }

       var _that = this;
       if (oControl.firstTime == true) {
             oControl.networkViewBtn.attachPress(function(oEvent) {

                    oControl.networkViewBtn.addStyleClass("selectedView");
                    
                    oControl.boxViewBtn.removeStyleClass("selectedView");
                    
                    _that.renderAllEntities(oRm, oControl, false);
             });
       }
       oRm.renderControl(oControl.networkViewBtn);

       oRm.write("</div>");

};

// renders box view label and button
sap.landvisz.LandscapeViewerRenderer._renderBoxViewHeader = function(oRm,
             oControl) {

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-boxViewLable");
       oRm.addClass("sapLandviszView");
       oRm.writeClasses();
       oRm.write(">");
       oControl.boxViewBtn.setText(oControl.getBoxDependencyLabel());
       oControl.boxViewBtn.setLite(true);
       oControl.boxViewBtn.addStyleClass("sapLandviszView_text");
       oControl.boxViewBtn.setTooltip(oControl.getBoxDependencyLabel());

       var type = oControl.getViewType();
       oControl.boxViewBtn.setIcon("sap-icon://table-view");
       if (type == sap.landvisz.ViewType.SELECTION_VIEW) {             
             oControl.boxViewBtn.setEnabled(false);
       } else if (type == sap.landvisz.ViewType.DEPENDENCY_VIEW) {            
             oControl.boxViewBtn.setEnabled(true);
       }

       var _that = this;
       if (oControl.firstTime == true) {
             oControl.boxViewBtn.attachPress(function(oEvent) {
                    
                    oControl.boxViewBtn.addStyleClass("selectedView");
                    
                     oControl.networkViewBtn.removeStyleClass("selectedView");
                     
                    _that.renderAllBoxViewEntities(oRm, oControl, false);
             });
       }
       oRm.renderControl(oControl.boxViewBtn);

       oRm.write("</div>");

};

// renders title for landscape viewer container
sap.landvisz.LandscapeViewerRenderer._renderTitle = function(oRm, oControl) {

       var containerheaderText;

       containerheaderText = oControl.getTitle();
       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-viewHeaderContainer");
       oRm.addClass("sapLandviszViewer_container_header");
       oRm.writeClasses();
       oRm.writeAttributeEscaped("title", containerheaderText);
       oRm.write(">");
       oRm.write(containerheaderText);
       oRm.write("</div>");
};

sap.landvisz.LandscapeViewerRenderer._renderNetworkView = function(oRm,
             oControl) {
       this.renderAllEntities(oRm, oControl, true);
};

// renders entities for network view
sap.landvisz.LandscapeViewerRenderer.renderAllEntities = function(oRm,
             oControl, isRendering) {

       var connectors = oControl.getConnectors();
       oControl.currentView = sap.landvisz.DependencyType.NETWORK_VIEW;

       var boxContainerId = oControl.getId() + "-boxViewContainer";
       var boxContainer = jQuery.sap.byId(boxContainerId);
       if (boxContainer)
             boxContainer.css("display", "none");

       var boxLevels = oControl.getBoxDependencyLevels();
       if (boxLevels) {
             for ( var i = 0; i < boxLevels.length; i++) {
                    var boxLabelId = oControl.getId() + "-boxViewLabel" + i;
                    var boxLabel = jQuery.sap.byId(boxLabelId);
                    if (boxLabel)
                           boxLabel.css("display", "none");
             }
       }
       oControl.connection.init();
        
        var connectedNodesLayout;
       if(oControl.getConnectionLine() == sap.landvisz.ConnectionLine.Line)
    	   connectedNodesLayout  = oControl.connection.getConnectedNodesLayout(connectors);
       else
         connectedNodesLayout  = oControl.connection.getConnectedNodesLayoutTrack(connectors);
         
       var systems = oControl.getSystems();
       var connectionEntities = oControl.getConnectionEntities();
       var systemsMargin = 50;
       if(connectionEntities.length>0)
    	   systemsMargin = 0;
       var entityID;
       var connectionId;
       for ( var i = 0; i < systems.length; i++) {

             entityID = systems[i].getSystemId();

             if (connectedNodesLayout[entityID]) {

                    var leftPos = 0;
                    var topPos = 0;

                    leftPos = Number(connectedNodesLayout[entityID].col
                                 * (oControl.entityWidth + 10 + systemsMargin)) ;
                    topPos = Number(connectedNodesLayout[entityID].row
                                 * (oControl.entityHeight + 10 + systemsMargin));
             }

             systems[i].left = leftPos;
             systems[i].top = topPos;
             systems[i].viewType = sap.landvisz.ViewType.DEPENDENCY_VIEW;
             if (isRendering == true)
                    oRm.renderControl(systems[i]);
             else
                    this._moveEntityToPosition(leftPos, topPos, systems[i].getId());

       }

       // render Connection Entity

       for ( var i = 0; i < connectionEntities.length; i++) {
             connectionId = connectionEntities[i].getConnectionId();

             if (oControl.firstTime == true) {
                    connectionEntities[i].attachEvent("connectionMouseover", function(
                                 event) {
                           oControl.onmouseenter(event);
                    }, this);
                    connectionEntities[i].attachEvent("connectionMouseout", function(
                                 event) {
                           oControl.onmouseleave(event);
                    }, this);

             }

             if (connectedNodesLayout[connectionId]) {
                    leftPos = Number(connectedNodesLayout[connectionId].col
                                 * (oControl.entityWidth + 10));
                    topPos = Number(connectedNodesLayout[connectionId].row
                                 * (oControl.entityHeight + 10));

             }

             connectionEntities[i].left = leftPos;
             connectionEntities[i].top = topPos;
             connectionEntities[i].width = oControl.entityWidth;
             connectionEntities[i].height = oControl.entityHeight;

             connectionEntities[i].innerLeft = (oControl.entityWidth - 50)/2;
             connectionEntities[i].innerTop = (oControl.entityHeight - 50)/2;
             connectionEntities[i].innerWidth = 50;
             connectionEntities[i].innerHeight = 50;

             connectionEntities[i].viewType = oControl.currentView;
             if (isRendering == true) {
                    connectionEntities[i]
                                  .addStyleClass("sapLandviszConnection_entity_container");
                    oRm.renderControl(connectionEntities[i]);
             } else {
                    connectionEntities[i]
                                  .addStyleClass("sapLandviszConnection_entity_container");
                    connectionEntities[i].removeStyleClass("sapLandviszConnectionBox");
                    this._animateConnectionEntityContainer(oControl.entityWidth,
                                 oControl.entityHeight, connectionEntities[i]);
             }
       }

       if (oControl.connection.svgForConnections)
             oControl.connection.svgForConnections.style("display", "block");
       else if (isRendering == false) {

             var navigationContainer = jQuery.sap.byId(oControl.getId()
                           + "-navigation");
             var navigator = jQuery.sap.byId(oControl.getId()
                           + "-navigation_navigator");
             navigationContainer.animate({
                    height : '0px'
             }, 1000, "swing", function(e) {
                    navigationContainer.hide();
             });

             setTimeout(
                           function() {

                                 if (oControl.svgForConnections) {
                                        oControl.connection.svgForConnections = oControl.svgForConnections;
                                        oControl.connection.svgForConnections.style("display",
                                                     "block");
                                 } else {
                                        var viewer = jQuery.sap.byId(oControl.getId()
                                                     + "-viewContainer");
                                        var svgWidth = viewer[0].scrollWidth - 10;
                                        var svgHeight = viewer[0].scrollHeight - 10;
                                        oControl.svgForConnections = sap.landvisz.libs.lvsvg
                                                     .getSVG(svgWidth, svgHeight, oControl.getId()
                                                                   + "-viewContainer");
                                        oControl.connection = sap.landvisz.internal.Connection;
                                        oControl.connection.svgForConnections = oControl.svgForConnections;
                                        oControl.connection
                                                      .renderConnections(oControl.getSystems(),
                                                                   oControl.getConnectionEntities(),this.getConnectionLine());
                                 }
                                 var enitityContainer = jQuery.sap.byId(oControl.getId()
                                               + "-viewContainer");
                                 var frameScrollHeight = Number(enitityContainer[0].scrollHeight);
                                 var frameScrollWidth = Number(enitityContainer[0].scrollWidth);
                                 var frameHeight = Number(enitityContainer.height());
                                 var frameWidth = Number(enitityContainer.width());

                                 if ((frameScrollWidth > frameWidth)
                                               || (frameScrollHeight > frameHeight))
                                        oControl.getVisibleRegion();

                           }, 1500);
       }

};

// renders box view container
sap.landvisz.LandscapeViewerRenderer._renderBoxContainer = function(oRm,
             oControl) {

       var connectors = oControl.getConnectors();
       oControl.connection.init();
       var connectedLayout = oControl.connection
                    .getBoxViewConnectedNodesLayout(connectors);
       var margin = 5;

       var boxContainerWidth = Number((oControl.entityWidth * connectedLayout.maxColumnCount)
                    + ((connectedLayout.maxColumnCount + 1) * margin));

       // add the width for level labels in case third level is
       // visible
       if (connectedLayout.thirdLevelEntitiesCount > 0) {
             boxContainerWidth += 30 + margin;
       }
       var boxContainerHeight = Number(oControl.boxModeHeight
                    + oControl.entityHeight + (margin * 3));
       if (connectedLayout.thirdLevelEntitiesCount > 0) {
             boxContainerHeight += Number(oControl.entityHeight + margin);
       }

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-boxViewContainer");
       oRm.addClass("sapLandviszBoxViewBorderContainer");
       oRm.writeClasses();

//     oRm.write(" style='");
//     oRm.write("width:" + boxContainerWidth + "px;");
//     oRm.write("height:" + boxContainerHeight + "px;");
//     oRm.write("top:" + 10 + "px;");
//     oRm.write("'");
       oRm.addStyle("width", boxContainerWidth + "px");
       oRm.addStyle("height", boxContainerHeight + "px");
       oRm.addStyle("top", 10 + "px");
       oRm.writeStyles();
       oRm.write(">");
       oRm.write("</div>");
};

// renders level labels for box view 
sap.landvisz.LandscapeViewerRenderer._renderBoxViewLabels = function(oRm,
             oControl) {

       var levelHeaderWidth = 30;
       var levelHeaderHeight = oControl.entityHeight;
       var margin = 5;
       var levelHeaderLeft = oControl.boxLeftMargine + margin;
       var levelHeaderTop = oControl.boxModeHeight + (margin * 2)
                    + oControl.boxTopMargine;
       var boxLevels = oControl.getBoxDependencyLevels();
       var parentBoxhLevelId;
       if (boxLevels) {
             for ( var i = 0; i < boxLevels.length; i++) {
                    levelHeaderTop += ((oControl.entityHeight + margin) * i);
                    parentBoxhLevelId = oControl.getId() + "-boxViewLabel" + i;
                    oRm.write("<div");
                    oRm.writeAttributeEscaped("id", parentBoxhLevelId);
                    oRm.writeAttributeEscaped("title", boxLevels[i]);
                    oRm.addClass("sapLandviszBoxContainerLevelHeader");
                    oRm.writeClasses();
                    oRm.addStyle("left", levelHeaderLeft + "px");
                    oRm.addStyle("top", levelHeaderTop + "px");
                    oRm.addStyle("height", levelHeaderHeight + "px");
                    oRm.addStyle("width", levelHeaderWidth + "px");
                    oRm.addStyle("display", "none");
                    oRm.writeStyles();
                    oRm.write(">");
                    oRm.write("<div");
                    oRm.addClass("sapLandviszLevelLabel");
                    oRm.writeClasses();
                    oRm.writeAttributeEscaped("id", parentBoxhLevelId + "Level");
                    oRm.writeAttributeEscaped("title", boxLevels[i]);
                    oRm.addStyle("height", "100%");
                    oRm.addStyle("width", "100%");
                    oRm.addStyle("left", "3px");
                    oRm.writeStyles();
                    oRm.write(">");
                    oRm.write(boxLevels[i]);
                    oRm.write("</div>");
                    oRm.write("</div>");

             }
       }
};

// renders navigation panel for dependency view
sap.landvisz.LandscapeViewerRenderer._renderNavigationPanel = function(oRm,
             oControl) {

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-navigation");
       oRm.addClass("sapLandviszClv_container_frame_navigation");
       oRm.writeAttributeEscaped("draggable", "true");
       oRm.addClass("no-draggable");
       oRm.addClass("no-resizable");
       oRm.addClass("ui-draggable");
       oRm.writeClasses();
//     oRm.write(" style='");
//     oRm.write("bottom:" + "0px;");
//     oRm.write("right:" + "0px;");
//     oRm.write("height:" + "28%;");
//     oRm.write("background-size:" + "100%;");
//     oRm.write("display:" + "block;");
//     oRm.write("'");
       oRm.addStyle("bottom", "0px");
       oRm.addStyle("right", "0px");
       oRm.addStyle("height", "28%");
       oRm.addStyle("background-size", "100%");
       oRm.addStyle("display", "block");
       oRm.writeStyles();
       oRm.write(">");

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-navigation_header");
       oRm.addClass("navigationHeader");
       oRm.writeClasses();
       oRm.write(">");

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId()
                    + "-navigation_header_arrowup");
       oRm.addClass("navigationBarButton");
       oRm.addClass("arrowUp");
       oRm.writeClasses();
       oRm.writeAttributeEscaped("title", oControl.SHOW_NAV_TEXT);
       oRm.write(">");
       oRm.write("</div>");
       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId()
                    + "-navigation_header_arrowdown");
       oRm.addClass("navigationBarButton");
       oRm.addClass("arrowDown");
       oRm.writeClasses();
       oRm.writeAttributeEscaped("title", oControl.HIDE_NAV_TEXT);
       oRm.write(">");
       oRm.write("</div>");
       oRm.write("</div>");

       oRm.write("<div");
       oRm.writeAttributeEscaped("id", oControl.getId() + "-navigation_navigator");
       oRm.writeAttributeEscaped("draggable", "true");
       oRm.addClass("navigationNavigator");
       oRm.addClass("ui-draggable");
//     oRm.write(" style='");
//     oRm.write("'");
       oRm.writeClasses();
       oRm.write(">");
       oRm.write("</div>");
       oRm.write("</div>");

};

sap.landvisz.LandscapeViewerRenderer._renderBoxView = function(oRm, oControl) {

       this.renderAllBoxViewEntities(oRm, oControl, true);
};

// renders all entities for box view
sap.landvisz.LandscapeViewerRenderer.renderAllBoxViewEntities = function(oRm,
             oControl, isRendering) {

       oControl.currentView = sap.landvisz.DependencyType.BOX_VIEW;
       if (oControl.connection.svgForConnections != null)
             oControl.connection.svgForConnections.style("display", "none");
       var systems = oControl.getSystems();
       var connectionEntities = oControl.getConnectionEntities();

       var connectors = oControl.getConnectors();
       oControl.connection.init();
       var connectedLayout = oControl.connection
                    .getBoxViewConnectedNodesLayout(connectors);
       var entityID;
       var connectionId;
       var margin = 5;

       if (connectedLayout) {

             var boxContainerId = oControl.getId() + "-boxViewContainer";
             var boxContainer = jQuery.sap.byId(boxContainerId);

             setTimeout(function() {
                    boxContainer.css("display", "block");
             }, 1200);

             for ( var i = 0; i < systems.length; i++) {

                    entityID = systems[i].getSystemId();

                    var labelWidth = 0;
                    labelWidth = 30 + margin;
                    var actualMargin = 30;
                    if (connectedLayout[entityID]) {

                           var leftPos = 0;
                           if (connectedLayout.thirdLevelEntitiesCount > 0)
                                 leftPos = 30;
                           var topPos = 0;
                           leftPos += Number((connectedLayout[entityID].col * (oControl.entityWidth))
                                        + ((connectedLayout[entityID].col + 1) * margin))
                                       
                           topPos += Number(((connectedLayout[entityID].row - 1) * (oControl.entityHeight))
                                        + ((connectedLayout[entityID].row + 1) * margin)
                                        + oControl.boxModeHeight)
                                       

                           systems[i].left = leftPos;
                           systems[i].top = topPos;
                           systems[i].viewType = sap.landvisz.ViewType.DEPENDENCY_VIEW;
                           if (isRendering == true) {
                                 systems[i].left = leftPos;
                                 systems[i].top = topPos;
                                 oRm.renderControl(systems[i]);
                           }

                           else {
                                 systems[i].left = leftPos + oControl.boxLeftMargine;
                                 systems[i].top = topPos + oControl.boxTopMargine;
                                 this._moveEntityToPosition(systems[i].left, systems[i].top,
                                               systems[i].getId());
                           }
                    }
             }

             // render Connection Entity

             var connectionEntityWidth = 0;
             for ( var i = 0; i < connectionEntities.length; i++) {

                    if (oControl.firstTime == true) {
                           connectionEntities[i].attachEvent("connectionMouseover",
                                        function(event) {
                                               oControl.onmouseenter(event);
                                        }, this);
                           connectionEntities[i].attachEvent("connectionMouseout",
                                        function(event) {
                                               oControl.onmouseleave(event);
                                        }, this);

                    }
                    connectionEntityWidth = 0;
                    connectionId = connectionEntities[i].getConnectionId();
                    if (connectedLayout[connectionId]) {
                           if (oControl.currentView == sap.landvisz.DependencyType.BOX_VIEW) {

                                 leftPos = Number(connectedLayout[connectionId].col
                                               * (oControl.entityWidth + 10))
                                               + margin;
                                 topPos = Number(connectedLayout[connectionId].row
                                               * (oControl.entityHeight + 10))
                                               + margin;

                                 connectionEntityWidth = Number(((connectedLayout[connectionId].colspan) * oControl.entityWidth)
                                               + ((connectedLayout[connectionId].colspan - 1) * margin));

                           }

                    }
                    connectionEntities[i].viewType = oControl.currentView;
                    connectionEntities[i].left = leftPos;
                    if (connectedLayout.thirdLevelEntitiesCount > 0)
                           connectionEntities[i].left = leftPos + 30;
                    connectionEntities[i].top = topPos;
                    connectionEntities[i].width = connectionEntityWidth;
                    connectionEntities[i].height = 90;

                    connectionEntities[i].innerLeft = 0;
                    connectionEntities[i].innerTop = 0;
                    connectionEntities[i].innerWidth = connectionEntityWidth;
                    connectionEntities[i].innerHeight = 90;

                    if (oControl.getVisibleDependency() == sap.landvisz.DependencyVisibility.BOTH
                                 && oControl.getDefaultDependencyView() == sap.landvisz.DependencyType.NETWORK_VIEW) {
                           if (connectionEntities[i].toolPopup.isOpen())
                                 connectionEntities[i].toolPopup.close();
                    }

                    if (isRendering == true) {
                           oRm.renderControl(connectionEntities[i]);
                           connectionEntities[i].left = leftPos;
                           if (connectedLayout.thirdLevelEntitiesCount > 0)
                                 connectionEntities[i].left = leftPos + 30;
                           connectionEntities[i].top = topPos;
                           connectionEntities[i].viewType = oControl.currentView;
                           connectionEntities[i].width = connectionEntityWidth;
                           connectionEntities[i].height = 0;
                           connectionEntities[i].addStyleClass("sapLandviszConnectionBox");
                    } else {
                           connectionEntities[i].left = leftPos + oControl.boxLeftMargine;
                           if (connectedLayout.thirdLevelEntitiesCount > 0)
                                 connectionEntities[i].left = leftPos
                                               + oControl.boxLeftMargine + 30;
                           connectionEntities[i].top = topPos + oControl.boxTopMargine;
                           connectionEntities[i].addStyleClass("sapLandviszConnectionBox");
                           connectionEntities[i]
                                        .removeStyleClass("sapLandviszConnection_entity_container");
                           this._animateConnectionEntityContainer(connectionEntityWidth,
                                        90, connectionEntities[i]);
                    }
             }
       }

       if (connectedLayout.thirdLevelEntitiesCount > 0) {
             oControl.hasBoxThirdLevel = true;

             var levelHeaderWidth = 30;
             var levelHeaderHeight = oControl.entityHeight;

             var levelHeaderLeft = oControl.boxLeftMargine + margin;
             var levelHeaderTop = oControl.boxModeHeight + (margin * 2)
                           + oControl.boxTopMargine;
             var boxLevels = oControl.getBoxDependencyLevels();
             var boxViewFirstLabel = "Systems";
             var boxViewFirstLabelTooltip = "Systems";

             if (isRendering == false) {

                    setTimeout(
                                 function() {
                                        if (boxLevels) {
                                               for ( var i = 0; i < boxLevels.length; i++) {

                                                     var boxLabelId = oControl.getId()
                                                                   + "-boxViewLabel" + i;
                                                     var boxLabel = jQuery.sap.byId(boxLabelId);
                                                     levelHeaderTop += ((oControl.entityHeight + margin) * i);

                                                     boxLabel.css("display", "block");

                                                     boxLabel.css({
                                                            left : levelHeaderLeft,
                                                            top : levelHeaderTop,
                                                            width : levelHeaderWidth,
                                                            height : levelHeaderHeight,
                                                     });

                                                     var boxLavelLabel = jQuery.sap.byId(boxLabelId
                                                                   + "Level");

                                                     boxLavelLabel.css({
                                                            width : levelHeaderHeight,
                                                            height : levelHeaderHeight,
                                                     });
                                               }
                                        }

                                 }, 1000);

             }

       }

       if (isRendering == false) {

             var navigationContainer = jQuery.sap.byId(oControl.getId()
                           + "-navigation");
             var navigator = jQuery.sap.byId(oControl.getId()
                           + "-navigation_navigator");
             navigationContainer.animate({
                    height : '0px'
             }, 900, "swing", function(e) {
                    navigationContainer.hide();
             });

             setTimeout(function() {

                    var enitityContainer = jQuery.sap.byId(oControl.getId()
                                 + "-viewContainer");
                    var frameScrollHeight = Number(enitityContainer[0].scrollHeight);
                    var frameScrollWidth = Number(enitityContainer[0].scrollWidth);
                    var frameHeight = Number(enitityContainer.height());
                    var frameWidth = Number(enitityContainer.width());

                    if ((frameScrollWidth > frameWidth)
                                 || (frameScrollHeight > frameHeight))
                           oControl.getVisibleRegion();
             }, 1000);

       }
};

sap.landvisz.LandscapeViewerRenderer._moveEntityToPosition = function(leftpos,
             toppos, entityId) {

       var entity = jQuery.sap.byId(entityId);

       entity.animate({
             left : leftpos,
             top : toppos,
       }, 1000);

};

// animates connection entity on switching from different views
sap.landvisz.LandscapeViewerRenderer._animateConnectionEntityContainer = function(
             entityWidth, enityHeight, connectionEntity) {
       var entity = jQuery.sap.byId(connectionEntity.getId());

       entity.animate({
             left : connectionEntity.left,
             top : connectionEntity.top,
             width : entityWidth,
             height : enityHeight,
       }, 1000, 'swing');

       var connectionDivID = connectionEntity.getId() + "connectionRow";
       var connectionDiv = jQuery.sap.byId(connectionDivID);
       connectionDiv.animate({
             left : connectionEntity.innerLeft,
             top : connectionEntity.innerTop,
             width : connectionEntity.innerWidth,
             height : connectionEntity.innerHeight,
       }, 1000, 'swing');

};


