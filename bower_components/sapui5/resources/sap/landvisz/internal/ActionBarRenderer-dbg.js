/*!
 *  @copyright 2012-2014 SAP SE. All rights reserved@
 */
jQuery.sap.declare("sap.landvisz.internal.ActionBarRenderer");

/**
 * @class ActionBar renderer.
 * @static
 */
sap.landvisz.internal.ActionBarRenderer = {};

/**
 * Renders the HTML for the given control, using the provided
 * {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager}
 *            oRm the RenderManager that can be used for writing to the render
 *            output buffer
 * @param {sap.ui.core.Control}
 *            oControl an object representation of the control that should be
 *            rendered
 */
sap.landvisz.internal.ActionBarRenderer.render = function(oRm, oControl) {
	if (!this.initializationDone) {
		oControl.initControls();
		oControl.initializationDone = true;
		var renderSize = oControl.getRenderingSize();
		var topParentCSS;
		var sizeCSS = "sapLandviszActionText";
		var iconCSS = "sapLandviszActionIcon";
		var alignCSS = "sapLandviszActionAlign";
//				oRm.addClass(alignCSS);
//				oRm.writeClasses();
				
		if (renderSize == sap.landvisz.EntityCSSSize.Small) {
			topParentCSS = "sapLandviszActionAlignSmall";
		}
		else if (renderSize == sap.landvisz.EntityCSSSize.RegularSmall) {
			topParentCSS = "sapLandviszActionAlignRegularSmall";
		}
		else if (renderSize == sap.landvisz.EntityCSSSize.Regular) {
			topParentCSS = "sapLandviszActionAlignRegular";
		}
		
		oRm.write("<div");
		oRm.writeControlData(oControl);
		
		oRm.addClass(alignCSS);
		oRm.addClass(topParentCSS);
		if(oControl.getEnable()){
			oRm.addClass("enable");
			oRm.writeAttributeEscaped("tabIndex","0");
		}else{
			oRm.addClass("disable");
			oRm.writeAttributeEscaped("tabIndex","-1");
		}
		
		if (oControl.getActionType() == sap.landvisz.ActionType.MENU) {
			oRm.write(" style='");
			oRm.write("border:0px;");
			oRm.write("padding : 0px;");
			oRm.write("'");
			oRm.addClass("sapLandviszActionIndex");
		}
		oRm.writeClasses();
		oRm.write(">");

		if (oControl.getActionType() == sap.landvisz.ActionType.NORMAL) {
			oRm.write("<div style='padding:0 2px'");
			oRm.writeAttributeEscaped("id",oControl.getId() + "Action");
			oRm.writeAttributeEscaped("title",oControl.getActionTooltip());
			oRm.write(">");
			
			var src = oControl.getIconSrc();
			if (src && src != ""){
				oControl.customActionIcon.setSrc(oControl.getIconSrc());
				oControl.customActionIcon.addStyleClass(iconCSS);
				oRm.renderControl(oControl.customActionIcon);
			}
			oRm.write("<div");
			oRm.writeAttributeEscaped("id",oControl.getId() + "Action_text");
			oRm.addClass(sizeCSS);
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(oControl.getActionLabel());
			oRm.write("</div>");
			
			oRm.write("</div>");
			
			//put disable overlay
			if(!oControl.getEnable()){
				oRm.write("<div");
				oRm.writeAttributeEscaped("id",oControl.getId() + "Action_Disable");
				oRm.addClass("sapLandviszActionDisable");
				oRm.writeClasses();
				oRm.write("/>");
			}
		}else if (oControl.getActionType() == sap.landvisz.ActionType.MENU) {
			this._renderSubMenu(oRm, oControl);

			if (renderSize == sap.landvisz.EntityCSSSize.Small) {
				oControl.menuButton.addStyleClass("sapLandviszSmallSizeMenuItem");
				oControl.menuButton.removeStyleClass("sapLandviszMenuItem");
				oControl.menuButton.setHeight("20px")
			} else if (renderSize == sap.landvisz.EntityCSSSize.Regular
					|| renderSize == sap.landvisz.EntityCSSSize.Medium
					|| renderSize == sap.landvisz.EntityCSSSize.Large 
					|| renderSize == sap.landvisz.EntityCSSSize.RegularSmall) {
				oControl.menuButton.addStyleClass("sapLandviszMenuItem");
				oControl.menuButton.removeStyleClass("sapLandviszSmallSizeMenuItem");
				oControl.menuButton.setHeight("28px");
			}
			oControl.menuButton.setEnabled(oControl.getEnable());
			oControl.menuButton.setText(oControl.getActionLabel());
			oControl.menuButton.setTooltip(oControl.getActionTooltip());
			oRm.renderControl(oControl.menuButton);
		}
		oRm.write("</div>");
	}
};

sap.landvisz.internal.ActionBarRenderer._renderSubMenu = function(oRm, oControl) {

	var menus = oControl.getMenuData();

	var oMainMenu = new sap.ui.commons.Menu();
	oMainMenu.attachItemSelect(function(oEvent) {
		oControl.selectedItem = oEvent.mParameters.item;
		if(oControl.getChangeView() == false)
			jQuery.sap.byId(oControl.getId()).click();
		else
			oControl.fireEvent("changeView");
	});

	oMainMenu.addStyleClass("sapLandviszMenuItem");
	oMainMenu.addStyleClass("sapLandviszMenuItemBorber");
	var subMenu;
	var menuItemObj = null;
	var menuItem = null;
	if (menus && menus.length > 0) {
		for ( var i = 0; i < menus.length; i++) {
			menuItemObj = menus[i];
			menuItem = new sap.ui.commons.MenuItem({
				text : menuItemObj.text,
				tooltip : menuItemObj.tooltip
			});
			if (menuItemObj.customdata) {
				var customData = new sap.ui.core.CustomData({
					key : menuItemObj.customdata,
				});
				menuItem.addCustomData(customData);
			}
			oMainMenu.addItem(menuItem);
			if (menuItemObj.subActions && menuItemObj.subActions.length > 0) {
				var subMenu = oControl._createMenu(menuItemObj.subActions)
				menuItem.setSubmenu(subMenu);
			}
		}
	}
	oControl.menuButton.setMenu(oMainMenu);
};
