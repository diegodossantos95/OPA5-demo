/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.uiext.inbox.SubstitutionRulesManager.
jQuery.sap.declare("sap.uiext.inbox.SubstitutionRulesManager");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new SubstitutionRulesManager.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * The SubstitutionRulesManager
 * @extends sap.ui.core.Control
 * @version 1.50.6
 *
 * @constructor
 * @public
 * @experimental Since version 1.7.0. 
 * API is not yet finished and might change completely
 * @name sap.uiext.inbox.SubstitutionRulesManager
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.SubstitutionRulesManager", { metadata : {

	deprecated : true,
	publicMethods : [
		// methods
		"bindSubstitutionRules"
	],
	library : "sap.uiext.inbox"
}});


/**
 * Creates a new subclass of class sap.uiext.inbox.SubstitutionRulesManager with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.uiext.inbox.SubstitutionRulesManager.extend
 * @function
 */


/**
 * Binds the Substitution Rules to the given path.
 *
 * @name sap.uiext.inbox.SubstitutionRulesManager#bindSubstitutionRules
 * @function
 * @param {string} sPath
 *         The path
 * @type sap.uiext.inbox.SubstitutionRulesManager
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/uiext/inbox/SubstitutionRulesManager.js
/*!
 * @copyright@
 * @deprecated Since version 1.38.0
 */

jQuery.sap.require("sap.uiext.inbox.InboxUtils");
jQuery.sap.require("sap.uiext.inbox.InboxConstants");
jQuery.sap.require("sap.uiext.inbox.SubstitutionRulesManagerConstants");
jQuery.sap.require("sap.uiext.inbox.SubstitutionRulesManagerUtils");
jQuery.sap.require("sap.uiext.inbox.TCMMetadata");
jQuery.sap.require("sap.ui.core.IconPool");
/*global OData */// declare unusual global vars for JSLint/SAPUI5 validation
/**
 * This file defines behavior for the control,
 */
sap.uiext.inbox.SubstitutionRulesManager.prototype.init = function(){
//	this.setParent(oInbox);
	var sCurrentTheme = sap.ui.getCore().getConfiguration().getTheme();
	this._imgResourcePath = sap.ui.resource('sap.uiext.inbox', 'themes/' + sCurrentTheme + '/img/');
	this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
	this.sUrl = "";
	this.sPath = "/SubstitutionRuleCollection"	//TODO: sPath should not be hard coded.
	this.inboxUtils = sap.uiext.inbox.InboxUtils;
	this.substitutionRulesManagerUtils = sap.uiext.inbox.SubstitutionRulesManagerUtils;
	this.inboxConstants = sap.uiext.inbox.InboxConstants;
	this.substitutionConstants = sap.uiext.inbox.SubstitutionRulesManagerConstants;
	this.substitutionRuleCollection = this.substitutionConstants.SubstitutionRuleCollection;
	this.substitutesRuleCollection = this.substitutionConstants.SubstitutesRuleCollection;
	this.oTcmMetadata= new sap.uiext.inbox.TCMMetadata();
	this.constants = sap.uiext.inbox.InboxConstants;
	this.bUseBatch = false;
	this.oPendingSearchRequestInSubstitution = undefined;
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.exit = function() {
	this.vLayout.destroy();
	this.vLayout = null;

	function remove(id) {
		  var oItem = sap.ui.getCore().byId(id);
		  oItem && oItem.destroy();
	}
	this._oBundle = undefined;
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.getSubstitutionRulesData = function(oModel) {
	if (this.bUseBatch) {
		// fetching SubstitutionRulesCollection if batch is supported
		this._fetchSubstitutionRuleCollectionData();
	} else {
		/*
		 * fetching enabled and disabled SubstitutionRulesCollection separately
		 * if querying navigation property is only supported with filters applied.
		 */
		this.data.substitutionRulesCollection = [];
		this._fetchEnabledSubstitutionRuleCollection(oModel);
		this._fetchDisabledSubstitutionRuleCollection(oModel);
	}
};

sap.uiext.inbox.SubstitutionRulesManager.prototype._getSubstitutesRulesData = function(oModel) {
	if (this.bUseBatch) {
		// fetching SubstitutesRulesCollection if batch is supported
		this._fetchSubstitutesRuleCollectionData();
	} else {
		/*
		 * fetching enabled and disabled SubstitutesRulesCollection separately
		 * if querying navigation property is only supported with filters applied.
		 */
		this.data.substitutesRulesCollection = [];
		this._fetchEnabledSubstitutesRuleCollection(oModel);
		this._fetchDisabledSubstitutesRuleCollection(oModel);
	}
};

sap.uiext.inbox.SubstitutionRulesManager.prototype._handleAuthenticationResponse = function(oData,oResponse) {
	if(oResponse.statusCode === 200 && oData === undefined){
		window.location.reload(true);
	}
};

sap.uiext.inbox.SubstitutionRulesManager.prototype._fetchSubstitutionRuleCollectionData = function() {

	var aPaths = new Array();
	aPaths[0] = "/SubstitutionRuleCollection";
	if(this.oTcmMetadata._isEntitySet(this.constants.SystemInfoCollection.name, this.constants.SystemInfoCollection.entityType)){
		aPaths[1] = "/" + this.constants.SystemInfoCollection.name;
	}

    this.oDataManager.fireBatchRequest({
    	aPaths : aPaths,
    	sMethod : "GET",
    	sBatchGroupId : "fetchInitialSubstitutionData",
    	numberOfRequests : aPaths.length,
    	fnSuccess : jQuery.proxy(this.processSubstitutionData, this),
    	fnError : jQuery.proxy(this.showSubstitutionErrorMessage, this)
    });

};

sap.uiext.inbox.SubstitutionRulesManager.prototype._fetchSubstitutesRuleCollectionData = function() {

	var that = this;
	that.oDataManager.readData("/SubstitutesRuleCollection", {
		success : function(oData,oResponse) {
			that.oSubstitutesRuleCollectionModel.setData({SubstitutesRuleCollection:oData.results});
		},
		error : function(error) {
			that.showSubstitutionErrorMessage();
	    }
	});

};

sap.uiext.inbox.SubstitutionRulesManager.prototype.processSubstitutionData = function(data, response) {
	var batchResponses = data.__batchResponses;
	var bSuccess = true;

	if(this.oTcmMetadata._isEntitySet(this.constants.SystemInfoCollection.name, this.constants.SystemInfoCollection.entityType)){
		var oSystemInfoResponse = batchResponses[1];
		if (oSystemInfoResponse && oSystemInfoResponse.statusCode && oSystemInfoResponse.statusCode == 200) {
			this.oSystemInfoData = oSystemInfoResponse.data.results;
		} else {
			bSuccess = false;
		}
	}

	var oSubstitutionDataResponse = batchResponses[0];
	if (oSubstitutionDataResponse && oSubstitutionDataResponse.statusCode && oSubstitutionDataResponse.statusCode == 200) {
		this._getSubstitutionRuleCollectionModel().setData({SubstitutionRuleCollection:oSubstitutionDataResponse.data.results});
	} else {
		bSuccess = false;
	}

	if (!bSuccess) {
		this.showSubstitutionErrorMessage();
	}
}

sap.uiext.inbox.SubstitutionRulesManager.prototype._fetchEnabledSubstitutionRuleCollection = function(oModel) {
	var that = this;

	oModel.read("/SubstitutionRuleCollection?$filter=IsEnabled%20eq%20true", null, null, true, function(oData,oResponse) {
		that._handleAuthenticationResponse(oData,oResponse);
    	that.data.substitutionRulesCollection = that.data.substitutionRulesCollection.concat(oData.results);
    	that._getSubstitutionRuleCollectionModel().setData({SubstitutionRuleCollection:that.data.substitutionRulesCollection});
    }, function(error) {
	   	that.showSubstitutionErrorMessage();
	});
};

sap.uiext.inbox.SubstitutionRulesManager.prototype._fetchDisabledSubstitutionRuleCollection = function(oModel) {
	var that = this;

	oModel.read("/SubstitutionRuleCollection?$filter=IsEnabled%20eq%20false", null, null, true, function(oData,oResponse) {
		that._handleAuthenticationResponse(oData,oResponse);
		that.data.substitutionRulesCollection = that.data.substitutionRulesCollection.concat(oData.results);
		that._getSubstitutionRuleCollectionModel().setData({SubstitutionRuleCollection:that.data.substitutionRulesCollection});
	}, function(error) {
		that.showSubstitutionErrorMessage();
    });
};

sap.uiext.inbox.SubstitutionRulesManager.prototype._fetchEnabledSubstitutesRuleCollection = function(oModel) {
	var that = this;

	oModel.read("/SubstitutesRuleCollection?$filter=IsEnabled%20eq%20true", null, null, true, function(oData,oResponse) {
		that._handleAuthenticationResponse(oData,oResponse);
		that.data.substitutesRulesCollection = that.data.substitutesRulesCollection.concat(oData.results);
		that.oSubstitutesRuleCollectionModel.setData({SubstitutesRuleCollection:that.data.substitutesRulesCollection});
	}, function(error) {
		that.showSubstitutionErrorMessage();
    });
};

sap.uiext.inbox.SubstitutionRulesManager.prototype._fetchDisabledSubstitutesRuleCollection = function(oModel) {
	var that = this;

	oModel.read("/SubstitutesRuleCollection?$filter=IsEnabled%20eq%20false", null, null, true, function(oData,oResponse) {
		that._handleAuthenticationResponse(oData,oResponse);
		that.data.substitutesRulesCollection = that.data.substitutesRulesCollection.concat(oData.results);
		that.oSubstitutesRuleCollectionModel.setData({SubstitutesRuleCollection:that.data.substitutesRulesCollection});
	}, function(error) {
		that.showSubstitutionErrorMessage();
    });
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.showSubstitutionErrorMessage = function() {
	this.showMessage("error", this._oBundle.getText("INBOX_MSG_FETCH_SUBSTITUTION_FAILED"));
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.open = function() {

	// setting TCM service metadata
	var oModel = this.getModel();
	if(oModel instanceof sap.ui.model.odata.ODataModel){
    	var oServiceMetadata = oModel.getServiceMetadata();
    	if(oModel.sServiceUrl && oServiceMetadata){
    		this.oTcmMetadata.setServiceMetadata(oServiceMetadata);
    	}
    }

	this.overlayContainer = this.populateOverlayContainer();
	this.overlayContainer.open();
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.populateOverlayContainer = function() {
	var that = this;
	var dynamicId = this.getId() + '--';
	// Creating the Overlay Container once a user selects Manage Substitution.
	var oSRMOverlayContainer = sap.ui.getCore().byId(dynamicId + 'substitutionOverlayContainer');
	if (oSRMOverlayContainer === undefined) {
		oSRMOverlayContainer = new sap.ui.ux3.OverlayContainer(dynamicId + "substitutionOverlayContainer");
		//oSRMOverlayContainer.setParent(this);
		//oSRMOverlayContainer.setModel(that.getModel());
		oSRMOverlayContainer.setOpenButtonVisible(false);

		oSRMOverlayContainer.attachClose(function(oEvent) {
			that.closeNotificationBar1();

			// bSubstituteDataRefreshed is a boolean variable which indicates whether SubstituteRules Data is refreshed or not
			if (that.bSubstituteDataRefreshed) {
				that.bSubstituteDataRefreshed = false;
			}

        });
		// The complete Overlay Container will have a main Vertical Layout as content
		var overlayVLayout = sap.ui.getCore().byId(dynamicId + 'substitutionVLayout');
		if (overlayVLayout === undefined) {
			overlayVLayout = new sap.ui.commons.layout.VerticalLayout(dynamicId + "substitutionVLayout");
		}
		overlayVLayout.setWidth("95%");
		overlayVLayout.addStyleClass("verticalLayoutStyle");

		// First Row is an empty Label for spacing, //TODO: Need to check if padding can be use, so that we avoid creation
		// of controls which are heavy weights.
		var emptyLabel0 = sap.ui.getCore().byId(dynamicId + 'substDummyLabel0')
		if (emptyLabel0 === undefined) {
			emptyLabel0 = new sap.ui.commons.Label(this.getId() + '--' + "substDummyLabel0", {
				text : ""
			});
		}

		// Third Row is for the Creation of 'New' link for Create Substitution Rule.
		var newSubstitutionLink = sap.ui.getCore().byId(dynamicId + 'newSubstitutionLink');
		if (newSubstitutionLink === undefined) {
			newSubstitutionLink = new sap.ui.commons.Link(dynamicId + 'newSubstitutionLink', {
				text : this._oBundle.getText("SUBSTITUTION_RULE_CREATE_NEW_BUTTON"),
				tooltip : this._oBundle.getText("SUBSTITUTION_RULE_CREATE_TOOLTIP")
			});
		}
		newSubstitutionLink.attachPress(that, that.openCreateSubstRulePopup);
		newSubstitutionLink.addStyleClass("newSubstitutionLink");
		// Second Row for Creating Navigation Bar with item "My Substitutes" and "I am Substituting".
		var oNavigationBar = sap.ui.getCore().byId(dynamicId + 'subsNavBar');
		if (oNavigationBar === undefined) {
			oNavigationBar = new sap.ui.ux3.NavigationBar(dynamicId + "subsNavBar", {
				items : [new sap.ui.ux3.NavigationItem(dynamicId + "mySubstitutes", {
					key : dynamicId + "mySubstitutes",
					text : this._oBundle.getText("SUBSTITUTION_MY_SUBSTITUTES_TAB_TITLE"),
					tooltip : this._oBundle.getText("SUBSTITUTION_MY_SUBSTITUTES_TAB_TITLE")
				}), new sap.ui.ux3.NavigationItem(dynamicId + "iamSubstituting", {
					key : dynamicId + "iamSubstituting",
					text : this._oBundle.getText("SUBSTITUTION_I_AM_SUBSTITUTING_TAB_TITLE"),
					tooltip : this._oBundle.getText("SUBSTITUTION_I_AM_SUBSTITUTING_TAB_TITLE")
				})]
			});
		}
		oNavigationBar.setSelectedItem(dynamicId + "mySubstitutes");
		oNavigationBar.addStyleClass("navigationBarMargin");
		oNavigationBar.addStyleClass("sapUiExtInboxSubstitutionNavigationBar");

		// Fourth is an empty Label for spacing, //TODO: Need to check if padding can be use, so that we avoid creation of
		// controls which are heavy weights.
		var emptyLabel = sap.ui.getCore().byId(dynamicId + 'substDummyLabel')
		if (emptyLabel === undefined) {
			emptyLabel = new sap.ui.commons.Label(this.getId() + '--' + "substDummyLabel", {
				text : ""
			});
		}

		// Inserting Empty Row in the zeroth index. FIXME: Use Padding instead. TODO: Research on this.
		// FIXME: VERY IMPORTANT, get Rid of counters instead add indexes in a constants file.
		var verticalLayoutContentIndex = 0;
		overlayVLayout.insertContent(emptyLabel0, verticalLayoutContentIndex);
		if (sap.ui.getCore().byId(dynamicId + 'notificationBar1') === undefined) {
		overlayVLayout.insertContent(this.populateNotificationBar(), ++verticalLayoutContentIndex);
		}
		// Inserting Navigation Bar in the second index.
		overlayVLayout.insertContent(oNavigationBar, ++verticalLayoutContentIndex);
		// Inserting 'New' link in the third index.
		overlayVLayout.insertContent(newSubstitutionLink, ++verticalLayoutContentIndex);
		// Inserting Empty Label in the fourth index.
		overlayVLayout.insertContent(emptyLabel, ++verticalLayoutContentIndex);

		var activeAndinactiveRulesVLayout = sap.ui.getCore().byId(dynamicId + 'activeAndinactiveRulesVLayout');
		if (activeAndinactiveRulesVLayout === undefined) {
			activeAndinactiveRulesVLayout = new sap.ui.commons.layout.VerticalLayout(dynamicId
					+ "activeAndinactiveRulesVLayout");
			activeAndinactiveRulesVLayout.setWidth("100%");
			// TODO: Add dynamic ID's VERY IMPORTANT.
			activeAndinactiveRulesVLayout.insertContent(new sap.ui.commons.Label({
				text : that._oBundle.getText("SUBSTITUTION_ACTIVE_SUBSTITUTION_RULE"),
				design : sap.ui.commons.LabelDesign.Bold
			}).addStyleClass("activeLabelFontSize"), 0);// TODO:Externalize
			activeAndinactiveRulesVLayout.insertContent(new sap.ui.commons.Label({
				text : ""
			}), 1);
			activeAndinactiveRulesVLayout.insertContent(new sap.ui.commons.Label({
				text : ""
			}), 2);// Dummy will be replaced by the active rules content.
			activeAndinactiveRulesVLayout.insertContent(new sap.ui.commons.Label({
				text : ""
			}), 3);
			/*activeAndinactiveRulesVLayout.insertContent(new sap.ui.commons.Label({
				text : ""
			}), 4);
			activeAndinactiveRulesVLayout.insertContent(new sap.ui.commons.Label({
				text : ""
			}), 5);*/
			activeAndinactiveRulesVLayout.insertContent(new sap.ui.commons.Label({
				text : that._oBundle.getText("SUBSTITUTION_INACTIVE_SUBSTITUTION_RULE"),
				design : sap.ui.commons.LabelDesign.Bold
			}).addStyleClass("activeLabelFontSize"), 4);// TODO:Externalize
			activeAndinactiveRulesVLayout.insertContent(new sap.ui.commons.Label({
				text : ""
			}), 5);
			activeAndinactiveRulesVLayout.insertContent(new sap.ui.commons.Label({
				text : ""
			}), 6);// Dummy will be replaced by the inactive rules content.

		}
		var mySubstitutesVerticalLayoutContentIndex = ++verticalLayoutContentIndex;
		overlayVLayout.insertContent(that.getOverlayContent(dynamicId + "mySubstitutes", activeAndinactiveRulesVLayout),
				mySubstitutesVerticalLayoutContentIndex);
		oSRMOverlayContainer.addContent(overlayVLayout);

		oNavigationBar.attachSelect(function(oEvent) {
			var itemKey = oEvent.getParameter("item").getKey();
			// remove all content
			overlayVLayout.removeContent(mySubstitutesVerticalLayoutContentIndex);
			overlayVLayout.insertContent(that.getOverlayContent(itemKey, activeAndinactiveRulesVLayout),
					mySubstitutesVerticalLayoutContentIndex);
			//oSRMOverlayContainer.rerender();
		});
	} else {
		var oNavigationBar = sap.ui.getCore().byId(dynamicId + 'subsNavBar');
		oNavigationBar.setSelectedItem(dynamicId + "mySubstitutes");
		var activeAndinactiveRulesVLayout = sap.ui.getCore().byId(dynamicId + 'activeAndinactiveRulesVLayout');
		var overlayVLayout = sap.ui.getCore().byId(dynamicId + 'substitutionVLayout');
		overlayVLayout.insertContent(that.getOverlayContent(dynamicId + "mySubstitutes", activeAndinactiveRulesVLayout),
				mySubstitutesVerticalLayoutContentIndex);
		oSRMOverlayContainer.addContent(overlayVLayout);
	}
	return oSRMOverlayContainer;
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.getOverlayContent = function(itemKey, activeAndinactiveRulesVLayout) {
	var dynamicId = this.getId() + '--';
	var that = this;
	var subsContent = {};
	var oSRMOverlayContainer = sap.ui.getCore().byId(dynamicId + 'substitutionOverlayContainer');
	var newSubstitutionLink = sap.ui.getCore().byId(dynamicId + 'newSubstitutionLink');
	var overlayVLayout = sap.ui.getCore().byId(dynamicId + 'substitutionVLayout');

	if (subsContent[itemKey])
		return subsContent[itemKey];
	if (itemKey === dynamicId + "mySubstitutes") {
		// Enabling 'New' link for creation of new substitution rule.
		newSubstitutionLink.setVisible(that.isSubstitutionRuleCreationSupported);
		//newSubstitutionLink.setVisible(true);
		activeAndinactiveRulesVLayout.removeContent(2);
		// your code for content creation goes here
		activeAndinactiveRulesVLayout.insertContent(that.createSubtRuleRowReapterContent(itemKey, true), 2);
		activeAndinactiveRulesVLayout.removeContent(6);
		activeAndinactiveRulesVLayout.insertContent(that.createSubtRuleRowReapterContent(itemKey, false), 8);

		subsContent[itemKey] = activeAndinactiveRulesVLayout
	} else if (itemKey === dynamicId + "iamSubstituting") {
		// Disabling 'New' link for creation of new substitution rule.
		newSubstitutionLink.setVisible(false);
		// your code for content creation goes here
		activeAndinactiveRulesVLayout.removeContent(2);
		activeAndinactiveRulesVLayout.insertContent(that.createSubtRuleRowReapterContent(itemKey, true), 2);
		activeAndinactiveRulesVLayout.removeContent(6);
		activeAndinactiveRulesVLayout.insertContent(that.createSubtRuleRowReapterContent(itemKey, false), 8);

		subsContent[itemKey] = activeAndinactiveRulesVLayout;
	}
	return subsContent[itemKey];
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.openCreateSubstRulePopup = function(oEvent, oSubtRuleManager) {

	var that = this;
	var dynamicId = oSubtRuleManager.getId() + '--';
	var newSubstitutionLink = sap.ui.getCore().byId(dynamicId + 'newSubstitutionLink');
	var createSubsRulePopup = sap.ui.getCore().byId(dynamicId + 'createSubsRulePopup');
	if (createSubsRulePopup === undefined) {
		createSubsRulePopup = new sap.ui.ux3.ToolPopup(dynamicId + 'createSubsRulePopup', {
			modal : true
		});
		var popupMainMatrix = new sap.ui.commons.layout.MatrixLayout(dynamicId + 'popupMainMatrix', {
			layoutFixed : false,
			width : '300px',
			columns : 2,
			widths : ["25%", "75%"]
		});
		// popupMainMatrix.setWidths('100px', '200px');

		var popupMainMatrixCell1 = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'popupMainMatrixCell1', {
			colSpan : 2
		});

		var popupMainMatrixCellMsgBar = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'popupMainMatrixCellMsgBar',
				{
					colSpan : 2
				});

		popupMainMatrixCell1.addContent(new sap.ui.commons.TextView(dynamicId + 'popupCreateSubstRuleTxt', {
			text : oSubtRuleManager._oBundle.getText("CREATE_SUBSTITUTION_RULE"), /* 'Create Substitution Rule', */
			design : sap.ui.commons.TextViewDesign.H3
		}));
		popupMainMatrix.createRow(popupMainMatrixCell1);
		popupMainMatrix.createRow(popupMainMatrixCellMsgBar);

		oSubtRuleManager.populateNotificationBar(oSubtRuleManager);

		// End Msg Bar

		var popupMainMatrixCell2 = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'popupMainMatrixCell2', {
			colSpan : 2
		});
		popupMainMatrixCell2.addContent(new sap.ui.commons.HorizontalDivider(dynamicId + 'popHorzDivdr1'));
		popupMainMatrix.createRow(popupMainMatrixCell2);

		var popupSubstLbl = new sap.ui.commons.Label(dynamicId + 'popupSubstLbl', {
			text : oSubtRuleManager._oBundle.getText("SUBSTITUTION_RULE_SUBSTITUTE_LABEL")
		});

		var popupValueHelp = new sap.ui.commons.ValueHelpField(dynamicId + 'popupValueHelp', {
			width : '100%',
		});

		popupValueHelp.addDelegate({
	        onAfterRendering:function() {
	        	popupValueHelp.$("input").prop("maxLength", 0);
	        	popupValueHelp.$("input").prop("readonly", "readonly");
	        }
	    });
		popupValueHelp.attachValueHelpRequest(oSubtRuleManager, oSubtRuleManager.openUsersDialog);
		popupValueHelp.setRequired(true);
		popupValueHelp.setTooltip(oSubtRuleManager._oBundle.getText("SUBSTITUTION_RULE_SUBSTITUTE_TOOLTIP"));

		popupSubstLbl.setLabelFor(popupValueHelp);
		popupMainMatrix.createRow(popupSubstLbl, popupValueHelp);

		var popupAutoFwdtLbl = new sap.ui.commons.Label(dynamicId + 'popupAutoFwdtLbl', {
			text : oSubtRuleManager._oBundle.getText("SUBSTITUTION_AUTOMATIC_FORWARDING_LABEL")
		/* 'Automatic Forwarding:' */
		});
		var popupSegBtn = new sap.ui.commons.SegmentedButton(dynamicId + 'popupSegBtn', {
			buttons : [new sap.ui.commons.Button(dynamicId + 'popupSegBtnON', {
				text : oSubtRuleManager._oBundle.getText("SUBSTITUTION_AUTOMATIC_FORWARDING_ON_STATE_TEXT"),// "ON"
				tooltip : oSubtRuleManager._oBundle.getText("SUBSTITUTION_AUTOMATIC_FORWARDING_ON_STATE")
			}), new sap.ui.commons.Button(dynamicId + 'popupSegBtnOFF', {
				text : oSubtRuleManager._oBundle.getText("SUBSTITUTION_AUTOMATIC_FORWARDING_OFF_STATE_TEXT"), // "OFF"
				tooltip : oSubtRuleManager._oBundle.getText("SUBSTITUTION_AUTOMATIC_FORWARDING_OFF_STATE")
			})]
		});

		popupSegBtn.attachSelect(function(oEvent) {
			if (sap.ui.getCore().byId

			(oEvent.getParameters().selectedButtonId).getText() == oSubtRuleManager._oBundle
					.getText("SUBSTITUTION_AUTOMATIC_FORWARDING_ON_STATE_TEXT")) {

				// make the label and DatePicket visible. QuickFix. TODO: Create Rows and add or remove Rows.
				sap.ui.getCore().byId(dynamicId +'popupFromDatePicker').setProperty("visible", true);
				sap.ui.getCore().byId(dynamicId +'popupToDatePicker').setProperty("visible", true);
				sap.ui.getCore().byId(dynamicId +'popupFromLbl').setProperty("visible", true);
				sap.ui.getCore().byId(dynamicId +'popupToLbl').setProperty("visible", true);

				// reset the required property to true
				sap.ui.getCore().byId(dynamicId +'popupFromDatePicker').setProperty("required", true);
				sap.ui.getCore().byId(dynamicId +'popupToDatePicker').setProperty("required", true);

			} else {

				// make the label and DatePicker Field invisible. QuickFix. TODO: Create Rows and add or remove Rows.
				sap.ui.getCore().byId(dynamicId +'popupFromDatePicker').setProperty("visible", false);
				sap.ui.getCore().byId(dynamicId +'popupToDatePicker').setProperty("visible", false);
				sap.ui.getCore().byId(dynamicId +'popupFromLbl').setProperty("visible", false);
				sap.ui.getCore().byId(dynamicId +'popupToLbl').setProperty("visible", false);

				// set the required property to false
				sap.ui.getCore().byId(dynamicId +'popupFromDatePicker').setProperty("required", false);
				sap.ui.getCore().byId(dynamicId +'popupToDatePicker').setProperty("required", false);

			}

			popupMainMatrix.rerender();
		});
		popupSegBtn.setSelectedButton(dynamicId + "popupSegBtnON");
		popupAutoFwdtLbl.setLabelFor(popupSegBtn);
		popupAutoFwdtLbl.setWrapping(true);
		popupMainMatrix.createRow(popupAutoFwdtLbl, popupSegBtn);

		// creating label and valueHelpField for selecting a substitution profile
		if (oSubtRuleManager.bSubstitutionProfileAvailable) {
			var oSubstProfileLbl = new sap.ui.commons.Label(dynamicId + 'substProfileLbl', {
				text : oSubtRuleManager._oBundle.getText("SUBSTITUTION_RULE_SUBSTITUTION_PROFILE"),
				wrapping : true
			});

			var oSubstProfileValueHelp = new sap.ui.commons.ValueHelpField(dynamicId + 'substProfileValueHelp', {
				width : '100%',
			}).addDelegate({
				onAfterRendering:function() {
					oSubstProfileValueHelp.$("input").prop("maxLength", 0);
					oSubstProfileValueHelp.$("input").prop("readonly", "readonly");
				}
			}).attachValueHelpRequest(oSubtRuleManager, oSubtRuleManager.openSubstProfileDialog).setRequired(false).setTooltip(oSubtRuleManager._oBundle.getText("SUBSTITUTION_RULE_SUBSTITUTION_PROFILE_TOOLTIP"));

			oSubstProfileLbl.setLabelFor(oSubstProfileValueHelp);
			popupMainMatrix.createRow(oSubstProfileLbl, oSubstProfileValueHelp);
		}

		var popupFromLbl = new sap.ui.commons.Label(dynamicId + 'popupFromLbl', {
			text : oSubtRuleManager._oBundle.getText("SUBSTITUTION_SUBSTITUTION_FROM_DATE_LABEL")
		/* 'From:' */
		});
		var popupFromDatePicker = new sap.ui.commons.DatePicker(dynamicId + 'popupFromDatePicker', {
			text : oSubtRuleManager._oBundle.getText("SUBSTITUTION_SUBSTITUTION_FROM_DATE_LABEL"),/* 'fromDate', */
			width : '100%',
			tooltip : oSubtRuleManager._oBundle.getText("SUBSTITUTION_CREATE_FROM_DATE_TOOLTIP")
		});
		popupFromDatePicker.setRequired(true);
		popupFromDatePicker.setYyyymmdd(oSubtRuleManager.substitutionRulesManagerUtils._getTodaysDateinYYYYMMDD());
		// popupFromDatePicker.setLocale("en-US");//TODO: Donot hard code
		// Locale, should automatically pick from sap.ui.getCore().getLocale().
		popupFromLbl.setLabelFor(popupFromDatePicker);

		popupMainMatrix.createRow(popupFromLbl, popupFromDatePicker);

		var popupToLbl = new sap.ui.commons.Label(dynamicId + 'popupToLbl', {
			text : oSubtRuleManager._oBundle.getText("SUBSTITUTION_SUBSTITUTION_TO_DATE_LABEL")
		/* 'To:' */
		});
		var popupToDatePicker = new sap.ui.commons.DatePicker(dynamicId + 'popupToDatePicker', {
			text : oSubtRuleManager._oBundle.getText("SUBSTITUTION_SUBSTITUTION_TO_DATE_LABEL"),
			width : '100%',
			tooltip : oSubtRuleManager._oBundle.getText("SUBSTITUTION_CREATE_TO_DATE_TOOLTIP")
		});
		popupToDatePicker.setRequired(true);
		// popupToDatePicker.setLocale("en-US");//TODO: Donot Hard Code Locale,
		// should automatically pick from sap.ui.getCore().getLocale().
		popupToLbl.setLabelFor(popupToDatePicker);
		popupMainMatrix.createRow(popupToLbl, popupToDatePicker);

		// CheckBox for Activation of Substitution Rule

		var oActivateCheckBoxLbl = new sap.ui.commons.Label(dynamicId + 'activateCheckBoxLbl', {
			text : oSubtRuleManager._oBundle.getText("SUBSTITUTION_RULE_ACTIVATE")
		});

		var oActivateCheckBox = new sap.ui.commons.CheckBox(dynamicId + 'activateCheckBox', {
			tooltip : oSubtRuleManager._oBundle.getText("SUBSTITUTION_RULE_ACTIVATE_TOOLTIP"),
			checked : true
		});

		oActivateCheckBoxLbl.setLabelFor(oActivateCheckBox);
		popupMainMatrix.createRow(oActivateCheckBoxLbl, oActivateCheckBox);

		var popupMainMatrixCell3 = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'popupMainMatrixCell3', {
			colSpan : 2
		});
		popupMainMatrixCell3.addContent(new sap.ui.commons.HorizontalDivider(dynamicId + 'popHorzDivdr2'));
		popupMainMatrix.createRow(popupMainMatrixCell3);

		// var popupMainMatrixCell4 = new
		// sap.ui.commons.layout.MatrixLayoutCell(dynamicId +
		// 'popupMainMatrixCell4',{colSpan : 2});
		var popupCreateBtn = new sap.ui.commons.Button(dynamicId + 'popupCreateBtn', {
			text : oSubtRuleManager._oBundle.getText("SUBSTITUTION_SUBSTITUTIN_RULE_CREATE_BUTTON"),/* 'Create' */
			tooltip : oSubtRuleManager._oBundle.getText("SUBSTITUTION_CREATE_BUTTON_TOOLTIP")
		});
		popupCreateBtn.attachPress(oSubtRuleManager, oSubtRuleManager.createSubstitutionRule);
		// popupCreateBtn.addStyleClass("customMargin");
		// popupMainMatrixCell4.addContent(popupCreateBtn);
		var popupCancelBtn = new sap.ui.commons.Button(dynamicId + 'popupCancelBtn', {
			text : oSubtRuleManager._oBundle.getText("SUBSTITUTION_SUBSTITUTIN_RULE_CANCEL_BUTTON"),/* 'Cancel' */
			tooltip : oSubtRuleManager._oBundle.getText("SUBSTITUTION_CANCEL_BUTTON_TOOLTIP"),
			press : function() {

				// oSubtRuleManager.resetSubstRulePopup(oSubtRuleManager);
				createSubsRulePopup.close();
				createSubsRulePopup.destroy();
			}
		});
		// popupMainMatrixCell4.addContent(popupCancelBtn);
		popupMainMatrix.createRow(popupCreateBtn, popupCancelBtn);

		createSubsRulePopup.addContent(popupMainMatrix);
	}
	oSubtRuleManager.deleteMessage();
	createSubsRulePopup.setPosition(sap.ui.core.Popup.Dock.EndTop, sap.ui.core.Popup.Dock.BeginTop, newSubstitutionLink
			.getDomRef(), "-10 -10", "fit");
	createSubsRulePopup.setInitialFocus(oSubtRuleManager.getId() + '--popupValueHelp-input');
	createSubsRulePopup.open();
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.createSubtRuleRowReapterContent = function(itemKey,
		isActiveSubstRule) {
	var isSubstitutedUserRules = (itemKey === this.getId() + '--' + 'mySubstitutes') ? true : false;
	var dynamicId = itemKey;

	if (isActiveSubstRule) {
		dynamicId = dynamicId + 'active' + '--';
	} else {
		dynamicId = dynamicId + 'inactive' + '--';
	}

	var that = this;
	var oSubstRuleRowRepater = sap.ui.getCore().byId(dynamicId + 'subsRowRepeater');
	if (oSubstRuleRowRepater === undefined) {
		oSubstRuleRowRepater = new sap.ui.commons.RowRepeater(dynamicId + 'subsRowRepeater', {
		});
		oSubstRuleRowRepater.attachPage(that, that.deleteMessage);
		oSubstRuleRowRepater.setDesign(sap.ui.commons.RowRepeaterDesign.Transparent);
		that.setNoOfRules(dynamicId);
        jQuery(window).resize(function(oEvent) {
        	that.setNoOfRules(dynamicId);
            oSubstRuleRowRepater.rerender();
        });
		oSubstRuleRowRepater.setNoData(new sap.ui.commons.TextView({
			text : that._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_NO_SUBSTITUTION_RULES_FOUND")
		}));

		// main matrix
		var rowRepMainMatrix = new sap.ui.commons.layout.MatrixLayout(dynamicId + 'rowRepMainMatrix', {
			layoutFixed : true,
		});

		if (that.bSubstitutionProfileAvailable) {
			rowRepMainMatrix.setWidths(['2%', '30%', '18%', '18%', '17%', '12%', '3%']);
			rowRepMainMatrix.setColumns(7);
		} else {
			rowRepMainMatrix.setWidths(['2%', '37%', '24%', '21%', '12%', '3%']);
			rowRepMainMatrix.setColumns(6);
		}

		if (isActiveSubstRule) {
			rowRepMainMatrix.addStyleClass('borderFillColorGray');
			rowRepMainMatrix.addStyleClass('shadowEffectGray');
			rowRepMainMatrix.addStyleClass('mySapUiMltPadRight');

		} else {
			rowRepMainMatrix.addStyleClass('borderFillColorGray');
			rowRepMainMatrix.addStyleClass('shadowEffectGray');
		}

		// var rowRepGreyCell = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'rowRepGreyCell');
		// //rowRepGreyCell.addStyleClass("greyFillColor");
		// if(isActiveSubstRule){
		// rowRepGreyCell.addStyleClass("shadowEffectGreen");
		// }

		var rowRepEmptyCell = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'rowRepEmptyCell');
		var rowRepEmpltyTxt = new sap.ui.commons.TextView(dynamicId + 'substitutionID');
		rowRepEmpltyTxt.setVisible(false);
		rowRepEmpltyTxt.bindProperty("text", "SubstitutionRuleID");
		rowRepEmptyCell.addContent(rowRepEmpltyTxt);

		var rowRepSubsDetailMatLyt = new sap.ui.commons.layout.MatrixLayout(dynamicId + 'rowRepSubsDetailMatLyt', {
			columns : 1,
			layoutFixed : true
		});

		// Creating Empty Row above Substitute Name.
		var rowRepEmptyRow1 = new sap.ui.commons.layout.MatrixLayoutRow(dynamicId + 'rowRepEmptyRow1');
		var rowRepEmpltyTxt1 = new sap.ui.commons.TextView(dynamicId + 'rowRepEmpltyTxt1', {
			text : ""
		});
		var rowRepEmpltyCell1 = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'rowRepEmpltyCell1', {
			backgroundDesign : sap.ui.commons.layout.BackgroundDesign.Transparent
		});
		rowRepEmpltyCell1.addContent(rowRepEmpltyTxt1);
		rowRepEmptyRow1.addCell(rowRepEmpltyCell1);
		// rowRepSubsDetailMatLyt.addRow(rowRepEmptyRow1);

		// Creating Row for Substitute(d) User Name
		var rowRepSubstNameRow = new sap.ui.commons.layout.MatrixLayoutRow(dynamicId + 'rowRepSubstNameRow');
		var rowRepSubstNameTxtView;
		rowRepSubstNameTxtView = new sap.ui.commons.TextView(dynamicId + 'rowRepSubstNameTxtView');
		rowRepSubstNameTxtView.bindProperty("text", "FullName", function(value) {
			if (value !== null && value !== "") {
				// var indexOfComma = value.indexOf(",");
				// var lastName = value.substring(indexOfComma + 1);
				// if(lastName === " ")value = value.substring(0, indexOfComma);//Removing comma in case there is no last name
				// for a user.
				// TODO: Uncommented Code to remove commas, as decided will fetch last name and first name from the service,
				// decision on this still pending.
				return value;
			}
		});
		rowRepSubstNameTxtView.addStyleClass('blueFontColor');
		rowRepSubstNameTxtView.addStyleClass('boldFontWeight');
		rowRepSubstNameTxtView.addStyleClass('sapUiExtSubstitutionPadding');

		var rowRepSubstNameCell = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'rowRepSubstNameCell', {
			backgroundDesign : sap.ui.commons.layout.BackgroundDesign.Transparent
		});
		rowRepSubstNameCell.addContent(rowRepSubstNameTxtView);
		rowRepSubstNameRow.addCell(rowRepSubstNameCell);
		rowRepSubsDetailMatLyt.addRow(rowRepSubstNameRow);

		// Creating Row for User Friendly Text below the Substitute(d) User Name
		var rowRepUsrFriendlyRow = new sap.ui.commons.layout.MatrixLayoutRow(dynamicId + 'rowRepUsrFriendlyRow');
		var rowRepUsrFriendlyTxt = new sap.ui.commons.TextView(dynamicId + 'rowRepUsrFriendlyTxt');
		rowRepUsrFriendlyTxt.addStyleClass('blackFontColor');

		rowRepUsrFriendlyTxt.bindProperty("text", "FullName", function(value) {
			if (value !== null && value !== "" && value) {
				var oModel = this.getModel();
				return that.substitutionRulesManagerUtils._getText(value, isSubstitutedUserRules, oModel
						.getProperty('IsEnabled', this.getBindingContext(), false), oModel.getProperty(
						'SupportsEnableSubstitutionRule', this.getBindingContext(), false), oModel.getProperty('BeginDate', this
						.getBindingContext(), false), oModel.getProperty('EndDate', this.getBindingContext(), false));
			}
		});

		var rowRepUsrFriendlyCell = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'rowRepUsrFriendly');
		rowRepUsrFriendlyCell.addContent(rowRepUsrFriendlyTxt);
		rowRepUsrFriendlyRow.addCell(rowRepUsrFriendlyCell);
		rowRepSubsDetailMatLyt.addRow(rowRepUsrFriendlyRow);


		// column for system alis and substitution profile information
		if (that.bSubstitutionProfileAvailable) {

			var rowRepSubstProfileMatLyt = new sap.ui.commons.layout.MatrixLayout(dynamicId + 'rowRepSubstProfileMatLyt', {
				columns : 1,
				layoutFixed : true
			});

			// Text View control to display system alias name for a substitution rule
			var rowRepSystemInfoTxt = new sap.ui.commons.TextView(dynamicId + 'rowRepSystemInfoTxt').bindText({
				path: "SAP__Origin",
			    formatter: function(sSapOrigin){
			    	var sSystemAlias = "";
			    	if (sSapOrigin && that.oSystemInfoData) {
			    		jQuery.each(that.oSystemInfoData, function(i, oSystemInfo) {
			    			if (oSystemInfo.SAP__Origin === sSapOrigin) {
			    				sSystemAlias = that._oBundle.getText("SUBSTITUTION_RULE_SYSTEM_ALIAS") + " : " + oSystemInfo.SystemAlias;
			    				return false;
			    			}
			    		});
			        }
			    	return sSystemAlias;
			    }
			}).addStyleClass('grayFontColor').addStyleClass('sapUiExtSubstitutionPadding');

			var rowRepSystemInfoCell = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'rowRepSystemInfoCell');
			var rowRepSystemInfoRow = new sap.ui.commons.layout.MatrixLayoutRow(dynamicId + 'rowRepSystemInfoRow');
			rowRepSystemInfoCell.addContent(rowRepSystemInfoTxt);
			rowRepSystemInfoRow.addCell(rowRepSystemInfoCell);
			rowRepSubstProfileMatLyt.addRow(rowRepSystemInfoRow);

			// Text View control to display SubstitutionProfile for a substitution rule
			var rowRepSubstProfileTxt = new sap.ui.commons.TextView(dynamicId + 'rowRepSubstProfileTxt').bindText({
				parts: [
			            {path: "ProfileText", type: new sap.ui.model.type.String()},
			            {path: "Profile", type: new sap.ui.model.type.String()}
			            ],
			    formatter: function(sProfileText, sProfile){
			    	if (sProfileText && sProfile) {
			    		return that._oBundle.getText("SUBSTITUTION_RULE_SUBSTITUTION_PROFILE") + " : " + sProfileText + " (" + sProfile + ")";
			        } else {
			        	return "";
			        }
			    }
			}).addStyleClass('grayFontColor');

			var rowRepSubstProfileCell = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'rowRepSubstProfileCell');
			var rowRepSubstProfileRow = new sap.ui.commons.layout.MatrixLayoutRow(dynamicId + 'rowRepSubstProfileRow');
			rowRepSubstProfileCell.addContent(rowRepSubstProfileTxt);
			rowRepSubstProfileRow.addCell(rowRepSubstProfileCell);
			rowRepSubstProfileMatLyt.addRow(rowRepSubstProfileRow);

		}

		// Second column for since and until dates.
		var rowRepSinceUntilMatLyt = new sap.ui.commons.layout.MatrixLayout(dynamicId + 'rowRepSinceUntilMatLyt', {
			columns : 1,
			layoutFixed : true
		});

		// Second Column Since Date Row
		var rowRepSinceDateRow = new sap.ui.commons.layout.MatrixLayoutRow(dynamicId + 'rowRepSinceDateRow');
		var rowRepSinceDateTxt = new sap.ui.commons.TextView(dynamicId + 'rowRepSinceDateTxt');
		rowRepSinceDateTxt.addStyleClass('grayFontColor');
		rowRepSinceDateTxt.addStyleClass('sapUiExtSubstitutionPadding');
		var sinceNFromTxt = that._oBundle.getText("SUBSTITUTION_RULE_SINCE_LABEL");// "Since : ";
		if (!isActiveSubstRule) {
			sinceNFromTxt = that._oBundle.getText("SUBSTITUTION_SUBSTITUTION_FROM_DATE_LABEL");// "From : ";
		}

		rowRepSinceDateTxt.bindText({
			parts: [
		            {path: "BeginDate"},
		            {path: "Mode"}
		            ],
		    formatter: function(beginDate, mode){
		    	if (mode && mode === that.substitutionConstants.MODE_RECEIVE_TASKS){
		    		return sinceNFromTxt + " : " + that.substitutionRulesManagerUtils._getFormattedDate(beginDate);
		    	}
		    }
		});

		var rowRepSinceDateCell = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'rowRepSinceDate');
		rowRepSinceDateCell.addContent(rowRepSinceDateTxt);
		rowRepSinceDateRow.addCell(rowRepSinceDateCell);
		rowRepSinceUntilMatLyt.addRow(rowRepSinceDateRow);

		// Second Column Until Date Row
		var rowRepUntilDateRow = new sap.ui.commons.layout.MatrixLayoutRow(dynamicId + 'rowRepUntilDateRow');
		var rowRepUntilDateTxt = new sap.ui.commons.TextView(dynamicId + 'rowRepUntilDateTxt');// , {text : "Until : " +
																																														// "05/02/2012"});//TODO
																																														// From Service
		rowRepUntilDateTxt.addStyleClass('grayFontColor');

		rowRepUntilDateTxt.bindText({
			parts: [
		            {path: "EndDate"},
		            {path: "Mode"}
		            ],
		    formatter: function(endDate, mode){
		    	// do not display UntilDate when Mode of the Substitution Rule is TAKE_OVER
		    	if (mode && mode === that.substitutionConstants.MODE_RECEIVE_TASKS)	{
		    		return that._oBundle.getText("SUBSTITUTION_RULE_UNTIL_LABEL") + " : " + that.substitutionRulesManagerUtils._getFormattedDate(endDate);// "Until : "
		    	}
		    }
		});

		var rowRepUntilDateCell = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'rowRepUntilDateCell');
		rowRepUntilDateCell.addContent(rowRepUntilDateTxt);
		rowRepUntilDateRow.addCell(rowRepUntilDateCell);
		rowRepSinceUntilMatLyt.addRow(rowRepUntilDateRow);

		/*
		 * matrixSubRow = new sap.ui.commons.layout.MatrixLayoutRow(); control = new sap.ui.commons.TextView({ text : "" });
		 * matrixCell = new sap.ui.commons.layout.MatrixLayoutCell({ backgroundDesign :
		 * sap.ui.commons.layout.BackgroundDesign.Transparent }); matrixCell.addContent(control);
		 * matrixSubRow.addCell(matrixCell);
		 */
		// rowRepSinceUntilMatLyt.addRow(rowRepEmptyRow1);

		// Third column for Active For/In Time.
		var rowRepActiveTimeMatLyt = new sap.ui.commons.layout.MatrixLayout(dynamicId + 'rowRepActiveTimeMatLyt', {
			columns : 1,
			layoutFixed : true
		});

		// sub matrix row
		/*
		 * matrixSubRow = new sap.ui.commons.layout.MatrixLayoutRow(); control = new sap.ui.commons.TextView({ text : "" });
		 * matrixCell = new sap.ui.commons.layout.MatrixLayoutCell({ backgroundDesign :
		 * sap.ui.commons.layout.BackgroundDesign.Transparent }); matrixCell.addContent(control);
		 * matrixSubRow.addCell(matrixCell);
		 */

		// TODO: Different controls have to be created and added for the empty space. Same control cannot be added at
		// multiple places. Else try with padding through CSS.
		// rowRepActiveTimeMatLyt.addRow(rowRepEmptyRow1);
		// Third column row for Text Active For/In
		var rowRepActiveRow = new sap.ui.commons.layout.MatrixLayoutRow(dynamicId + 'rowRepActiveRow');
		var rowRepActiveTxt = new sap.ui.commons.TextView(dynamicId + 'rowRepActiveTxt');
		rowRepActiveTxt.addStyleClass('grayFontColor');
		rowRepActiveTxt.addStyleClass('boldFontWeight');
        rowRepActiveTxt.addStyleClass('sapUiExtSubstitutionPadding');
		// TODO: externalize and modify for/In according to active or inactive.
		// From utils

		rowRepActiveTxt.bindText({
			parts: [
		            {path: "Mode"},
		            {path: "IsEnabled"},
		            {path: "BeginDate"},
		            {path: "EndDate"}
		            ],
		    formatter: function(mode, isEnabled, beginDate, endDate){
		    	if (mode && mode === that.substitutionConstants.MODE_RECEIVE_TASKS) {
					return that.substitutionRulesManagerUtils._getStatus(isSubstitutedUserRules, isEnabled, beginDate, endDate);
				}
		    }
		});

		var rowRepActiveCell = new sap.ui.commons.layout.MatrixLayoutCell(dynamicId + 'rowRepActiveCell', {
			backgroundDesign : sap.ui.commons.layout.BackgroundDesign.Transparent
		});
		rowRepActiveCell.addContent(rowRepActiveTxt);
		rowRepActiveRow.addCell(rowRepActiveCell);
		rowRepActiveTimeMatLyt.addRow(rowRepActiveRow);


		/*
		 * matrixSubRow = new sap.ui.commons.layout.MatrixLayoutRow(); control = new sap.ui.commons.TextView({ text : "" });
		 * matrixCell = new sap.ui.commons.layout.MatrixLayoutCell({ backgroundDesign :
		 * sap.ui.commons.layout.BackgroundDesign.Transparent }); matrixCell.addContent(control);
		 * matrixSubRow.addCell(matrixCell);
		 */

		// Fouth Column On Off Segemented Button
		var rowRepOnOffSegBtn = new sap.ui.commons.SegmentedButton(dynamicId + 'rowRepOnOffSegBtn', {
			visible : false,
			buttons : [new sap.ui.commons.Button(dynamicId + 'rowRepOnSegBtn', {
				text : that._oBundle.getText("SUBSTITUTION_AUTOMATIC_FORWARDING_ON_STATE_TEXT"),
				tooltip : that._oBundle.getText("SUBSTITUTION_AUTOMATIC_FORWARDING_ON_STATE_TEXT")
			}),// "ON"
			new sap.ui.commons.Button(dynamicId + 'rowRepOffSegBtn', {
				text : that._oBundle.getText("SUBSTITUTION_AUTOMATIC_FORWARDING_OFF_STATE_TEXT"),
				tooltip : that._oBundle.getText("SUBSTITUTION_AUTOMATIC_FORWARDING_OFF_STATE_TEXT")
			})// "OFF"
			]
		});

		// We use this variable to enable/disable the Segmented Button.
		// We disable it when the Mode is "RECIEVE_TASKS" and view is I Am Substituting and if Mode is null, true in all
		// other cases.
		/* var enableSegBtn = true; */

		//rowRepOnOffSegBtn.bindProperty("visible", "SupportsEnableSubstitutionRule");

		rowRepOnOffSegBtn.bindProperty("visible",{
			parts: [
		            {path: "Mode"},
		            {path: "SupportsEnableSubstitutionRule"}
		           ],
		    formatter: function(mode, supportsEnableSubstitutionRule){
		    	if (!isSubstitutedUserRules)
		    		return supportsEnableSubstitutionRule;
		    	else
		    		return (mode && mode === that.substitutionConstants.MODE_RECEIVE_TASKS && supportsEnableSubstitutionRule);
		     }
		});

		rowRepOnOffSegBtn.bindProperty("enabled", "IsEnabled", function(value) {
			if (value != null && value !== "") {
				if (value) {
					this.setSelectedButton(this.getButtons()[0].getId());
				} else {
					this.setSelectedButton(this.getButtons()[1].getId());
				}
			}
			return true;
		});
		rowRepOnOffSegBtn.attachSelect(this, function(oEvent, that) {
				var bEnable = true;
				if((oEvent.mParameters.selectedButtonId.indexOf("rowRepOnSegBtn")) == -1){
					bEnable = false;
				}
				that.updateSubstitutionRule(oEvent, that, bEnable);
		});

		// Fifth Row Delete Image.
		if (isSubstitutedUserRules) {
			var rowRepDeleteButton = new sap.ui.commons.Button(dynamicId + 'rowRepDeleteImg', {
			    tooltip : this._oBundle.getText("SUBSTITUTION_RULE_DELETE"),
			    icon :  this.constants.iconPool.getIconURI("delete"),
			    lite : true
			  });

			rowRepDeleteButton.bindProperty("visible", "SupportsDeleteSubstitutionRule", function(value) {
				return value;
			});
			rowRepDeleteButton.attachPress(this, this.deleteSubstitutionRule);
			// UX FEEDBACK CODE
			if (that.bSubstitutionProfileAvailable) {
				rowRepMainMatrix.createRow(rowRepEmptyCell, rowRepSubsDetailMatLyt, rowRepSubstProfileMatLyt, rowRepSinceUntilMatLyt,
						rowRepActiveTimeMatLyt, rowRepOnOffSegBtn, rowRepDeleteButton);
			} else {
				rowRepMainMatrix.createRow(rowRepEmptyCell, rowRepSubsDetailMatLyt, rowRepSinceUntilMatLyt,
						rowRepActiveTimeMatLyt, rowRepOnOffSegBtn, rowRepDeleteButton);
			}

		} else {
			// UX FEEDBACK CODE
			if (that.bSubstitutionProfileAvailable) {
				rowRepMainMatrix.createRow(rowRepEmptyCell, rowRepSubsDetailMatLyt, rowRepSubstProfileMatLyt, rowRepSinceUntilMatLyt,
						rowRepActiveTimeMatLyt, rowRepOnOffSegBtn);
			} else {
				rowRepMainMatrix.createRow(rowRepEmptyCell, rowRepSubsDetailMatLyt, rowRepSinceUntilMatLyt,
						rowRepActiveTimeMatLyt, rowRepOnOffSegBtn);
			}
		}

		var rowRepMainMatrixWapperMatrix = new sap.ui.commons.layout.MatrixLayout(dynamicId
				+ 'rowRepMainMatrixWapperMatrix', {
			layoutFixed : true
		});
		rowRepMainMatrixWapperMatrix.createRow(rowRepMainMatrix);
		rowRepMainMatrixWapperMatrix.createRow(new sap.ui.commons.TextView(dynamicId + 'rowRepWapperMatEmptyTxt', {
			text : ""
		}));

		var collectionPath;
		if(itemKey === (this.getId() + '--iamSubstituting')){
			collectionPath = this.substitutesRuleCollection;
			oSubstRuleRowRepater.setModel(this._getSubstitutesRuleCollectionModel());
		}else{
			collectionPath = this.substitutionRuleCollection;
			oSubstRuleRowRepater.setModel(this._getSubstitutionRuleCollectionModel());
		}

		oSubstRuleRowRepater.bindRows("/" + collectionPath, rowRepMainMatrixWapperMatrix, null, this._getFilters(isActiveSubstRule));
	} else {
		this._refreshBindings(itemKey, isActiveSubstRule);
	}

	return oSubstRuleRowRepater;

};

// TODO: Need to reuse this function instead of duplicating the code in methods above, had some issue so not not this
// try this.
// The same needs to be done for user friendly text.
// Can remove this peice of code, it not being used anywhere.
sap.uiext.inbox.SubstitutionRulesManager.prototype.formatUserName = function(value) {
	if (value !== null && value !== "") {
		var indexOfComma = value.indexOf(",");
		var lastName = value.substring(indexOfComma + 1);
		if (lastName === " ")
			value = value.substring(0, indexOfComma);
		return value;// Removing comma in case there is no last name for a user.
	}
}

sap.uiext.inbox.SubstitutionRulesManager.prototype.setNoOfRules = function(dynamicId) {
	var oSubstRuleRowRepater = sap.ui.getCore().byId(dynamicId + 'subsRowRepeater');
	var windowHeight = jQuery(window).height();
	//var windowHeight = window.innerHeight;
	/*if (windowHeight < 410){
		window.resizeTo(500, 410);
		windowHeight = 410;
	}*/
    var possibleNumberOfRows = Math.floor((windowHeight-230)/180);
    if (possibleNumberOfRows > 0){
    	oSubstRuleRowRepater.setNumberOfRows(possibleNumberOfRows);
    }
}

sap.uiext.inbox.SubstitutionRulesManager.prototype.bindSubstitutionRules = function(path) {
	/*
	 * var oFilter = []; var filter = new sap.ui.model.Filter("IsSubstituted", sap.ui.model.FilterOperator.EQ,
	 * isSubstituted); oFilter.push(filter); filter = new sap.ui.model.Filter("Active", sap.ui.model.FilterOperator.EQ,
	 * isActiveSubstRule?"true":"false"); oFilter.push(filter); var oSubstRuleRowRepater =
	 * this._getComponent("subsRowRepeater"); var rowRepMainMatrixWapperMatrix =
	 * this._getComponent("rowRepMainMatrixWapperMatrix"); oSubstRuleRowRepater.bindRows(this.sPath,
	 * rowRepMainMatrixWapperMatrix, null, oFilter);
	 */};

sap.uiext.inbox.SubstitutionRulesManager.prototype.deleteMessage = function(oEvent, subRulesMgr) {
	if (subRulesMgr === undefined)
		subRulesMgr = this;
     var oNotificationBar = sap.ui.getCore().byId(subRulesMgr.getId() + '--' + 'notificationBar1');
     var sDefault = sap.ui.ux3.NotificationBarStatus.Default;
	if (oNotificationBar != undefined && oNotificationBar.hasItems()) {
		oNotificationBar.setVisibleStatus(sDefault);

	}
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.closeNotificationBar1 = function() {
    var oNotificationBar = sap.ui.getCore().byId(this.getId() + '--' + 'notificationBar1');
    var sNone = sap.ui.ux3.NotificationBarStatus.None;
	if (oNotificationBar != undefined)
		oNotificationBar.setVisibleStatus(sNone);
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.showMessage = function(messageType, messageText) {

	var oNotificationBar = sap.ui.getCore().byId(this.getId() + '--' + 'notificationBar1');
	var oMessageNotifier = sap.ui.getCore().byId(this.getId() + '--' + 'messageNotifier1');
	var sNone = sap.ui.ux3.NotificationBarStatus.None;
	if(oNotificationBar === undefined) {
		this.populateNotificationBar();
	}

	if (oNotificationBar != undefined) {

       oNotificationBar.setVisibleStatus(sNone);
       var now = new Date();
       var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({style : "medium"});
	   var formattedDateTime = oDateFormat.format(now);

    	var oMessage = new sap.ui.core.Message({
    			text : messageText,
    			timestamp : formattedDateTime
    		});
		 if (messageType === "success")
	        	{
			 oMessage.setLevel(sap.ui.core.MessageType.Success);
	        	}
	       	else if (messageType === "info")
	        	{
	       		oMessage.setLevel(sap.ui.core.MessageType.Information);
	        	}
	        		 else if (messageType === "error")
	        			{
	        			 oMessage.setLevel(sap.ui.core.MessageType.Error); }
	        		 else if (messageType === "warning") {
	        			 oMessage.setLevel(sap.ui.core.MessageType.Warning);
	        		 }

		    oMessageNotifier.addMessage(oMessage);
	    	oNotificationBar.setMessageNotifier(oMessageNotifier);

	}
};

sap.uiext.inbox.SubstitutionRulesManager.prototype._getComponent = function(sComponentName) {
	return sap.ui.getCore().byId(this.getId() + '--' + sComponentName);
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.deleteSubstitutionRule = function(oEvent, that) {
	var oModel = oEvent.getSource().getModel();
	var oContext = oEvent.getSource().getBindingContext();
	var ruleID = oModel.getProperty("SubstitutionRuleID", oContext);
	var sapOrigin = oModel.getProperty("SAP__Origin", oContext);

	var oDeleteEntry = {};
	oDeleteEntry.SubstitutionRuleID = decodeURIComponent(ruleID);
	oDeleteEntry.SAP__Origin = sapOrigin;

	that.oDataManager.callFunctionImport(that.substitutionConstants.deleteRuleExecutionFunctionImport, {
		method : "POST",
		success : function(data, request) {
			var sPath = oContext.getPath();
			var aParts = sPath.split("/");
			oModel.oData[aParts[1]].splice(aParts[2], 1);
			oModel.checkUpdate(false);

			that.showMessage("success", that._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_DELETED_SUCCESSFULLY"));
			},
		error : function(error) {
			if (error.response === undefined || error.response.statusCode != 205) {
				that.showMessage("error", that._oBundle
						.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_DELETION_FAILURE_CONTACT_ADMIN"));
			} else if (error.response.statusCode == 205) {
					var eventParams = {
					statusCode : error.response.statusCode,
					statusText : error.response.statusText
					};
				oModel.fireRequestFailed(eventParams);
			}
		},
		urlParameters : oDeleteEntry
    }, true);

};

sap.uiext.inbox.SubstitutionRulesManager.prototype.updateSubstitutionRule = function(oEvent, that, bEnable) {
	var oModel = oEvent.getSource().getModel();
	var oContext = oEvent.getSource().getBindingContext();
	var ruleID = oModel.getProperty("SubstitutionRuleID", oContext);
	var sapOrigin = oModel.getProperty("SAP__Origin", oContext);

	var oUpdateEntry = {};
	oUpdateEntry.SubstitutionRuleID = decodeURIComponent(ruleID);
	oUpdateEntry.SAP__Origin = sapOrigin;
	oUpdateEntry.Enabled = bEnable;

	that.oDataManager.callFunctionImport(that.substitutionConstants.updateRuleExecutionFunctionImport, {
		method : "POST",
		success : function(data, request) {
			var oNavigationBar = sap.ui.getCore().byId(that.getId() + '--subsNavBar');
			var selectedNavItemID = oNavigationBar.getSelectedItem();
			var sPath = oContext.getPath();
			var aParts = sPath.split("/");
			oModel.oData[aParts[1]][aParts[2]].IsEnabled = data.IsEnabled;
			oModel.checkUpdate(true);
			that.showMessage("success", that._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_UPDATED_SUCCESSFULLY"));
		},
		error : function(error) {
			if (error.response === undefined || error.response.statusCode != 205) {
				that.showMessage("error", that._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_UPDATION_FAILURE_CONTACT_ADMIN"));
			} else if (error.response.statusCode == 205) {
				var eventParams = {
					statusCode : error.response.statusCode,
					statusText : error.response.statusText
				};
				oModel.fireRequestFailed(eventParams);
			}
		},
		urlParameters : oUpdateEntry
	}, true);

};

sap.uiext.inbox.SubstitutionRulesManager.prototype.isSubstitutionDatesDateTimeType = function() {

	var sBeginDateType, sEndDateType;
	var bTypeOfDateIsDateTime = false ;


	sBeginDateType = this.oTcmMetadata.getParameterTypeForFunctionImport(this.substitutionConstants.CREATE_SUBSTITUTION_RULE, "BeginDate");
	if (sBeginDateType === "Edm.DateTime") {
			bTypeOfDateIsDateTime = true;
		}
	return bTypeOfDateIsDateTime;
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.createSubstitutionRule = function(oEvent, oSubRuleMgr) {
	var error = oSubRuleMgr.validate(oSubRuleMgr);
	if (error === false) {

		var oModel = oSubRuleMgr.getModel();
		/*SAPUI5 by default makes it DataServiceVersion 2.0 as oData 1.0 does not support skip/top etc:
		oModel.oHeaders["DataServiceVersion"] = "1.0"*/

		var oEntry = {};
		var bEdmTypeDateTime = oSubRuleMgr.isSubstitutionDatesDateTimeType();

		var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
			pattern : "yyyyMMdd"
		});
		var startDate;
		var endDate;
		var endDateInputValue = oSubRuleMgr._getComponent('popupToDatePicker').getYyyymmdd();

		if (endDateInputValue != undefined && endDateInputValue !== "") {
			var endDateYear = endDateInputValue.substr(0, 4);
			var endDateMonth = endDateInputValue.substr(4, 2);
			var endDateDate = endDateInputValue.substr(6, 8);
			// endDate = oFormat.parse(endDateInputValue);
			var offset = oSubRuleMgr.substitutionRulesManagerUtils._getTimeZoneOffset();
			if (offset !== undefined) {
				offset = offset / (60 * 1000);
				endDate = new Date(Date.UTC(endDateYear, endDateMonth - 1, endDateDate, 23, 59 - offset, 59, 59))
			} else {
				endDate = oFormat.parse(endDateInputValue);
				endDate.setHours(23, 59, 59, 59);
			}
		} else {
			endDate = null;
		}

		var startDateInputValue = oSubRuleMgr._getComponent('popupFromDatePicker').getYyyymmdd();

		if (startDateInputValue != undefined && startDateInputValue !== "") {
			var startDateYear = startDateInputValue.substr(0, 4);
			var startDateMonth = startDateInputValue.substr(4, 2);
			var startDateDate = startDateInputValue.substr(6, 8);
			var offset = oSubRuleMgr.substitutionRulesManagerUtils._getTimeZoneOffset();
			if (offset !== undefined) {
				offset = offset / (60 * 1000);
				startDate = new Date(Date.UTC(startDateYear, startDateMonth - 1, startDateDate, 0, -offset, 0, 0))
			} else {
				startDate = oFormat.parse(startDateInputValue);
			}
		} else {
			startDate = new Date();
			startDate.setHours(0, 0, 0, 0);
		}

		bEdmTypeDateTime ? oEntry.BeginDate = startDate.getTime() : oEntry.BeginDate = "\/Date(" + startDate.getTime() + ")\/";

		var popupValueHelp = oSubRuleMgr._getComponent('popupValueHelp');
		oEntry.FullName = popupValueHelp.getValue();
		oEntry.User = popupValueHelp.data("uniqueName");

		var forwardSegmentButton = oSubRuleMgr._getComponent('popupSegBtn');
		var forwardSegmentSelectedButton = forwardSegmentButton.getSelectedButton();

		// setting mode
		if (forwardSegmentSelectedButton.indexOf("popupSegBtnON") >= 0) {
			oEntry.Mode = oSubRuleMgr.substitutionConstants.MODE_RECEIVE_TASKS;
			bEdmTypeDateTime ? oEntry.EndDate = endDate.getTime() : oEntry.EndDate = "\/Date(" + endDate.getTime() + ")\/";
		} else {
			oEntry.Mode = oSubRuleMgr.substitutionConstants.MODE_TAKE_OVER;
			// TODO check if endDate is nullable. If not, send a dummy date else send empty, null or nothing at all
			var dEndDate = new Date (9999, 11, 31);
			bEdmTypeDateTime ? oEntry.EndDate = dEndDate.getTime() : oEntry.EndDate = "\/Date(" + dEndDate.getTime() + ")\/";
		}

		// setting IsEnabled
		var oCheckBox = oSubRuleMgr._getComponent('activateCheckBox');
		oEntry.IsEnabled = oCheckBox.getChecked();


		// setting substitutionProfile
		if (oSubRuleMgr.bSubstitutionProfileAvailable) {
			var oProfileValueHelp = oSubRuleMgr._getComponent('substProfileValueHelp');
			if (oProfileValueHelp != undefined) {
				oEntry.Profile = oProfileValueHelp.data("Profile");
				oEntry.ProfileText = oProfileValueHelp.data("ProfileText");
			}
			oSubRuleMgr._sendCreateRuleRequestWithProfile(oSubRuleMgr,oEntry);
		} else {
			oSubRuleMgr._sendCreateRuleRequest(oSubRuleMgr,oEntry);
		}

		var createSubsRulePopup = sap.ui.getCore().byId(oSubRuleMgr.getId() + '--createSubsRulePopup');
		createSubsRulePopup.close();
		createSubsRulePopup.destroy();
	}
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.openUsersDialog = function(oEvent, oSubRuleMgr){
	var dynamicId = oSubRuleMgr.getId() + '--';
	var usersDialog = sap.ui.getCore().byId(dynamicId + "usersDialog");
	var oTable = sap.ui.getCore().byId(dynamicId + "userTable");
	if(usersDialog===undefined){
		var dLayout = new sap.ui.commons.layout.MatrixLayout({
			id : dynamicId + 'dLayout',
			layoutFixed : true,
			width : '100%'
			});


		var oSearch = new sap.ui.commons.SearchField({
			id : dynamicId + 'oSearch',
	        enableListSuggest: false,
	        startSuggestion : 0,
	        tooltip : oSubRuleMgr._oBundle.getText("SUBSTIUTION_RULE_SEARCH_FOR_USERS"),//"Search For Users",
	        //value: oSubRuleMgr._oBundle.getText("SUBSTITUTION_USERS_PICKLIST_SEARCH_LABEL"),//"Search",
			editable : true,
	        width: '100%'});

		oSearch.addDelegate({
			onAfterRendering : function() {
				var oTextField = sap.ui.getCore().byId(dynamicId + 'oSearch-tf');
				oTextField.prop('placeholder', oSubRuleMgr._oBundle.getText("SUBSTITUTION_USERS_PICKLIST_SEARCH_LABEL"));
			}
		});


		//TODO: When SearchUsers is changed to composite this can be removed and not necessary to have code in two places
		oSearch.attachSearch(oSubRuleMgr,function(oEvent,oSubRuleMgr){
			oTable.setBusy(true);
	        oSubRuleMgr._handleSearchUsersClickforCreateSubstitution(oEvent);
		});

		 oSearch.attachSuggest(oSubRuleMgr,function(oEvent,oSubRuleMgr){
			 if (oEvent.getParameter("value") === "") {
				 oTable.clearSelection();
				 oTable.bindRows("");
		        }
		    });

		dLayout.createRow(oSearch);
		var users = {
				collection: "UserInfoCollection", //fetch from configration, not to be hardcoded.
				propertiesLabel: [oSubRuleMgr._oBundle.getText("SUBSTITUTION_USERS_PICKLIST_LOGONID"),
				                  oSubRuleMgr._oBundle.getText("SUBSTITUTION_USERS_PICKLIST_NAME")],
				properties: ["UniqueName", "DisplayName"]
		};
		if (oTable === undefined) {
			oTable = new sap.ui.table.Table(dynamicId + "userTable", {
				selectionMode : sap.ui.table.SelectionMode.Single
			});
		}
		oTable.setModel(oSubRuleMgr.getModel());
		// oTable.setTitle( "User Table");
		oTable.setVisibleRowCount(5);

		oTable.attachRowSelectionChange(function(){
			if(oTable.getSelectedIndices().length !== 0){
				sap.ui.getCore().byId(dynamicId + "usersDialogOKBtn").setEnabled(true);
			}else{
				sap.ui.getCore().byId(dynamicId + "usersDialogOKBtn").setEnabled(false);
			}
		});

		oTable.bDynamic = true;
		for ( var i = 0; i <= users.properties.length - 1; i++) {
			oTable.addColumn(new sap.ui.table.Column().setLabel(new sap.ui.commons.Label({
				text : users.propertiesLabel[i],
				design : sap.ui.commons.LabelDesign.Bold
			})).setTemplate(new sap.ui.commons.TextField({
				editable : false,
				value : {
					path : users.properties[i]
				}
			})));
		}

		var dLayoutCont = new sap.ui.commons.layout.VerticalLayout(dynamicId + "userDialogVLayout", {
			width : "100%"
		});
		dLayoutCont.insertContent(dLayout, 0);
		dLayoutCont.insertContent(oTable, 1);
		usersDialog = new sap.ui.commons.Dialog(dynamicId + "usersDialog", {
			modal : true,
			title : oSubRuleMgr._oBundle.getText("SUBSTIUTION_RULE_SEARCH_FOR_USERS"),// "Search For Users",
			content : [dLayoutCont],
			buttons : [new sap.ui.commons.Button(dynamicId + "usersDialogOKBtn", {
				enabled: false,
				text : oSubRuleMgr._oBundle.getText("INBOX_BUTTON_OK_TEXT"),
				tooltip : oSubRuleMgr._oBundle.getText("SUBSTITUTE_SEARCH_USERS_OK_BUTTON_TOOLTIP"),
				press : function() {
					var table = sap.ui.getCore().byId(dynamicId + "userTable");
					var selIndex = table.getSelectedIndex();
					var rowContext = table.getContextByIndex(selIndex);
					var tabModel = sap.ui.getCore().byId(dynamicId + 'userTable').getModel();
					var selUsesDisplayName = tabModel.getProperty("DisplayName", rowContext);
					if (selUsesDisplayName === null)
						selUsesDisplayName = "";
					var selUserUniqueName = tabModel.getProperty("UniqueName", rowContext);
					var popupValueHelp = oSubRuleMgr._getComponent('popupValueHelp');
					popupValueHelp.setValue(selUsesDisplayName);
					popupValueHelp.data("uniqueName", selUserUniqueName);
					usersDialog.close();
				}
			})]
		});
	}
	usersDialog.setWidth("400px");
	usersDialog.open();
	usersDialog.attachClosed( oSubRuleMgr, function(oEvent,oSubRuleMgr){
		usersDialog.destroy();
	});
	usersDialog.setInitialFocus(oSearch);

};
sap.uiext.inbox.SubstitutionRulesManager.prototype.validate = function(oSubRuleMgr) {

	var that = this;
	var validationError = false;
	var reason = "";
	var toDate, frmDate;
	var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
		pattern : "yyyyMMdd"
	});

	var endDateInputValue = oSubRuleMgr._getComponent('popupToDatePicker').getYyyymmdd();
	var startDateInputValue = oSubRuleMgr._getComponent('popupFromDatePicker').getYyyymmdd();

	if (endDateInputValue != undefined && endDateInputValue !== "") {
		var endDateYear = endDateInputValue.substr(0, 4);
		var endDateMonth = endDateInputValue.substr(4, 2);
		var endDateDate = endDateInputValue.substr(6, 8);
		// endDate = oFormat.parse(endDateInputValue);
		var offset = oSubRuleMgr.substitutionRulesManagerUtils._getTimeZoneOffset();
		if (offset !== undefined) {
			offset = offset / (60 * 1000);
			toDate = new Date(Date.UTC(endDateYear, endDateMonth - 1, endDateDate, 23, 59 - offset, 59, 59))
		} else {
			toDate = oFormat.parse(endDateInputValue);
			toDate.setHours(23, 59, 59, 59);
		}
	}

	if (startDateInputValue != undefined && startDateInputValue !== "") {
		var startDateYear = startDateInputValue.substr(0, 4);
		var startDateMonth = startDateInputValue.substr(4, 2);
		var startDateDate = startDateInputValue.substr(6, 8);
		var offset = oSubRuleMgr.substitutionRulesManagerUtils._getTimeZoneOffset();
		if (offset !== undefined) {
			offset = offset / (60 * 1000);
			frmDate = new Date(Date.UTC(startDateYear, startDateMonth - 1, startDateDate, 0, -offset, 0, 0))
		} else {
			frmDate = oFormat.parse(startDateInputValue);
		}
	}

	var substituteUser = oSubRuleMgr._getComponent('popupValueHelp').getValue();

	var prop = oSubRuleMgr._getComponent('popupFromDatePicker').getProperty("required");

	if (substituteUser === null || substituteUser === "") {
		validationError = true;
		reason = oSubRuleMgr._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SELECT_SUBSTITUTE");

	}
	if (validationError != true && prop === true) {
		if (toDate === null || frmDate === null || toDate === "" || frmDate === "" || isNaN(toDate) || isNaN(frmDate)) {
			validationError = true;
			reason = oSubRuleMgr._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_ENTER_VALID_DATE_RANGE");
		}
		if (validationError != true) {
			if (toDate < frmDate) {
				validationError = true;
				reason = oSubRuleMgr._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_FROM_DATE_AFTER_TODATE");
			}
		}
	}
	if (validationError != true && prop != true) {
		if (toDate != null && frmDate != null) {

			if (validationError != true && toDate < frmDate) {
				validationError = true;
				reason = oSubRuleMgr._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_FROM_DATE_AFTER_TODATE");
			}

		}
	}

	if (validationError === true) {

		oSubRuleMgr.showMessage("error", reason);

	}
	return validationError;

};

sap.uiext.inbox.SubstitutionRulesManager.prototype.populateNotificationBar = function() {

	  var notificationBar = sap.ui.getCore().byId(this.getId() +'--' + "notificationBar1");
	if (notificationBar === undefined) {

		var oNotificationBar = new sap.ui.ux3.NotificationBar({
			id: this.getId() + '--' + "notificationBar1",
			visibleStatus: "None"
		});

		oNotificationBar.attachDisplay(function(oEvent) {
			var sStatus = oNotificationBar.getVisibleStatus();
			var sNone = sap.ui.ux3.NotificationBarStatus.None;
			var sDefault = sap.ui.ux3.NotificationBarStatus.Default;
			if(sStatus === sNone) {
				oNotificationBar.setVisibleStatus(sDefault);
			} else {
				oNotificationBar.setVisibleStatus(sNone);
			}
	    });

	    var oMessageNotifier = new sap.ui.ux3.Notifier ({
			id: this.getId() + '--' + "messageNotifier1",
			title: this._oBundle.getText("INBOX_NOTIFICATIONS"),

		});

		oNotificationBar.setMessageNotifier(oMessageNotifier);
		oNotificationBar.addStyleClass("sapUiExtInboxNotificationBar");
		return oNotificationBar;

		var cell = this._getComponent('popupMainMatrixCellMsgBar');
		cell.addContent(oNotificationBar);
	}

};


sap.uiext.inbox.SubstitutionRulesManager.prototype._refreshBindings = function(itemKey, isActiveRule) {
	var dynamicId = itemKey;
	var collectionPath = (itemKey === (this.getId() + '--iamSubstituting'))
			? this.substitutesRuleCollection
			: this.substitutionRuleCollection; // TODO: Constants

	if (collectionPath === this.substitutesRuleCollection && !this.bSubstituteDataRefreshed) {
		this._getSubstitutesRulesData(this.getModel());
		this.bSubstituteDataRefreshed = true;
	}

	/*Here in JavaScript isActiveRule can be undefined, true or false.
	It will be undefined in all the case where it is being called with just one parameter(itemKey)*/

	// For example in case of deleteSubtitutionRule and createSubtitution we do not pass 'isActiveRule' param.
	if (isActiveRule === undefined) {
		this._refreshBindings(itemKey, true);
		this._refreshBindings(itemKey, false);
	}

	else if (isActiveRule) {		// Bind Rows for Active RowRepeater
		var wrapperTemp1 = sap.ui.getCore().byId(dynamicId + 'active' + '--' + 'rowRepMainMatrixWapperMatrix');
		var oSubstRuleRowRepaterActive = sap.ui.getCore().byId(dynamicId + 'active' + '--' + 'subsRowRepeater');
		oSubstRuleRowRepaterActive.bindRows("/" + collectionPath, wrapperTemp1, null, this._getFilters(isActiveRule));

	} else {		// Bind Rows for InActive RowRepater
		var wrapperTemp2 = sap.ui.getCore().byId(dynamicId + 'inactive' + '--' + 'rowRepMainMatrixWapperMatrix');
		var oSubstRuleRowRepaterInActive = sap.ui.getCore().byId(dynamicId + 'inactive' + '--' + 'subsRowRepeater');
		oSubstRuleRowRepaterInActive.bindRows("/" + collectionPath, wrapperTemp2, null, this._getFilters(isActiveRule));
	}

};

sap.uiext.inbox.SubstitutionRulesManager.prototype.getSubstitutionRulesManagerUtils = function() {
	return this.substitutionRulesManagerUtils;
};

sap.uiext.inbox.SubstitutionRulesManager.prototype._searchUsers = function(oSearchInput) {
	var that = this;
	var oFunctionImport = this.oTCMModel.getFunctionImportHandler();
	var dynamicId = that.getId() + '--';
	var oTable = sap.ui.getCore().byId(dynamicId + "userTable");
	oFunctionImport.setServiceURL(this.sUrl);
	oFunctionImport.setHeaders({
		Accept : this.inboxConstants.acceptHeaderforJSON,
		"x-csrf-token" : this.getModel().oHeaders["x-csrf-token"]
	});

	var sSearchTerm = oSearchInput.sSearchTerm;
	var iMaxResults = oSearchInput.iMaxResults;
	var sSAPOrigin = oSearchInput.sSAPOrigin;
	var oResultData;

	this.oPendingSearchRequestInSubstitution = oFunctionImport.callSearchUsers({
		SearchPattern : jQuery.sap.encodeURL(sSearchTerm),
		MaxResults : iMaxResults,
		SAP__Origin : sSAPOrigin
	}, function(oData, response) {
		oTable.setBusy(false);
		oResultData = oData;
		that.displaySubstitesSearchResults(oResultData, oTable, iMaxResults);
		that.oPendingSearchRequestInSubstitution = undefined;
	}, function(error) {
			oTable.setBusy(true);
				if(error.response !== undefined){
					that.showMessage("error", that._oBundle.getText("INBOX_MSG_NO_USER_FOUND",[sSearchTerm]));
					oTable.setBusy(false);
				}
			that.oPendingSearchRequestInSubstitution = undefined;
	});

};

sap.uiext.inbox.SubstitutionRulesManager.prototype.displaySubstitesSearchResults = function(oResultData, oTable, iMaxResults) {
	if (oResultData) {
		var oModel = new sap.ui.model.json.JSONModel();
	    oModel.setData(oResultData);
	    oTable.clearSelection();
	    oTable.setModel(oModel);
		oTable.bindRows("/results");

	    if(oResultData.results.length > 0) {
	    	oTable.setSelectedIndex(0);
	    }
	}
	if(oResultData.results.length === iMaxResults) {
		this.showMessage("warning", this._oBundle.getText("INBOX_TOP_MAX_USER", [iMaxResults]));
	}
	if(oResultData.results.length === 0) {
		this.showMessage("error", this._oBundle.getText("INBOX_MSG_FOR_NO_DATA"));
	}
};

sap.uiext.inbox.SubstitutionRulesManager.prototype._handleSearchUsersClickforCreateSubstitution = function(oEvent){

	var iMaxResults = this.oConfiguration ? this.oConfiguration.getSearchUersMaxLimit() : 100;
	var sSAPOrigin = "";
	var sSearchText = oEvent.getParameter("query").trim();

	if (this.bSystemInfoAvailable === undefined) {
		var oSystemInfoCollectionConstant = this.constants.SystemInfoCollection;
		this.bSystemInfoAvailable = this.oTcmMetadata._isEntitySet(oSystemInfoCollectionConstant.name, oSystemInfoCollectionConstant.entityType);
	}

	// sending one SAP__Origin in case of multi providers
	if (this.bSystemInfoAvailable) {
		sSAPOrigin = this.oSystemInfoData[0].SAP__Origin;
	}

	if(this.oPendingSearchRequestInSubstitution !== undefined) {
		this.oPendingSearchRequestInSubstitution.abort();
	}

	this._searchUsers({
		sSearchTerm: sSearchText,
		iMaxResults:iMaxResults,
		sSAPOrigin: sSAPOrigin
	});

};

sap.uiext.inbox.SubstitutionRulesManager.prototype._sendCreateRuleRequestWithProfile= function(oSubRuleMgr,oEntry){

	var fnCreateSubRuleRequest = jQuery.proxy(function(aSelectedProviders) {
		if (aSelectedProviders.length == 0) {
			this._sendCreateRuleRequest(oSubRuleMgr,oEntry);
		}
		else{
			//Request will be send with JSON payload, reformat dates
			oEntry.BeginDate = "/Date(" + oEntry.BeginDate + ")/";
			oEntry.EndDate = "/Date(" + oEntry.EndDate + ")/";
			if (aSelectedProviders.length === 1) { // if substitution rule needs to be created for only one provider
				this._createSubRuleWithProfile(oEntry, aSelectedProviders[0]);
			} else if (aSelectedProviders.length > 1) { // if substitution rule needs to be created for more than one providers
				this._createSubRuleWithProfileBatch(oEntry, aSelectedProviders);
			}
		}
	}, this);

	// getting providers for which substitution rule needs to be created
	this._getProvidersForCreateSubstitution(oEntry, fnCreateSubRuleRequest);

};

sap.uiext.inbox.SubstitutionRulesManager.prototype._sendCreateRuleRequest= function(oSubRuleMgr,oEntry){
	//Check for empty profile key Profile=null in URL causes HTTP 500
	var profKey = "Profile";
	if(!oEntry[profKey]){
		delete oEntry[profKey];
	}

	var oModel = this.getModel();
	var oSubstitutionModel = this._getSubstitutionRuleCollectionModel();

	if(this.oTcmMetadata._isFunctionImport(this.substitutionConstants.CREATE_SUBSTITUTION_RULE)){

		oModel.callFunction("CreateSubstitutionRule", "POST", oEntry, null, function(data, request) {
			oSubRuleMgr.showMessage("success", oSubRuleMgr._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_CREATED_SUCCESSFULLY"));
			oSubstitutionModel.oData.SubstitutionRuleCollection.push(data);
			oSubstitutionModel.checkUpdate(false);
		},  function(error){
				oSubRuleMgr.showMessage("error", oSubRuleMgr._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_CREATION_FAILURE_CONTACT_ADMIN"));
		});
	}
	else{
		oModel.create(oSubRuleMgr.sPath,oEntry,null,
				function(oData, response){
			oSubRuleMgr.showMessage("success", oSubRuleMgr._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_CREATED_SUCCESSFULLY"));
			oSubstitutionModel.oData.SubstitutionRuleCollection.push(oData);
			oSubstitutionModel.checkUpdate(false);
			oModel.oHeaders["DataServiceVersion"] = "2.0";
		},
		function(error){
				oSubRuleMgr.showMessage("error", oSubRuleMgr._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_CREATION_FAILURE_CONTACT_ADMIN"));
		});
	}

};

sap.uiext.inbox.SubstitutionRulesManager.prototype._getSubstitutionRuleCollectionModel = function(){
	if(!this.oSubstitutionRuleCollectionModel)
		this.oSubstitutionRuleCollectionModel = new sap.ui.model.json.JSONModel();
	return this.oSubstitutionRuleCollectionModel;
};

sap.uiext.inbox.SubstitutionRulesManager.prototype._getSubstitutesRuleCollectionModel = function(){
	// var bSubstituteDataRefreshed indicates whether the SubstituteRulesCollection data is refreshed or not
	if(!this.bSubstituteDataRefreshed){
		if (!this.oSubstitutesRuleCollectionModel)
			this.oSubstitutesRuleCollectionModel = new sap.ui.model.json.JSONModel();
		this._getSubstitutesRulesData(this.getModel());
		// setting bSubstituteDataRefreshed to true as SubstituteRulesCollection is refreshed
		this.bSubstituteDataRefreshed = true;
	}
	return this.oSubstitutesRuleCollectionModel;
};

sap.uiext.inbox.SubstitutionRulesManager.prototype.openSubstProfileDialog = function(oEvent, oSubRuleMgr){

	var dynamicId = oSubRuleMgr.getId() + '--';

	var fnOpenProfileSelectionDialogue = function(oSubProfileData) {

		// merging items in SubstitutionProfile data those have equal value for Profile and ProfileText
		var aDataUnique = {};
		jQuery.each(oSubProfileData.results, function(i, item) {
			var oItem = {};
			oItem.Profile = item.Profile;
			oItem.ProfileText = item.ProfileText;
			aDataUnique[ item.Profile + " - " + item.ProfileText ] = oItem;
		});

		var aProfileDataUnique = [];
		var k=0;
		jQuery.each(aDataUnique, function(j, item) {
			aProfileDataUnique[k++] = item;
		});

		var oDataUnique = {};
		oDataUnique.results = aProfileDataUnique;

		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(oDataUnique);

		var oTable = sap.ui.getCore().byId(dynamicId + "substProfileTable");
		if (oTable === undefined) {
			oTable = new sap.ui.table.Table(dynamicId + "substProfileTable", {
				selectionMode : sap.ui.table.SelectionMode.Single
			});
		}

		oTable.clearSelection();
		oTable.setModel(oModel);
		oTable.bindRows("/results");
		oTable.setVisibleRowCount(5);
		oTable.bDynamic = true;

		oTable.addColumn(new sap.ui.table.Column().setLabel(new sap.ui.commons.Label({
			text : oSubRuleMgr._oBundle.getText("SUBSTITUTION_RULE_SUBSTITUTION_PROFILE"), //"Substitution Profile"
			design : sap.ui.commons.LabelDesign.Bold
		})).setTemplate(new sap.ui.commons.TextField({
			editable : false,
		}).bindValue({
			parts: [
			        {path: "ProfileText", type: new sap.ui.model.type.String()},
			        {path: "Profile", type: new sap.ui.model.type.String()}
			        ],
			        formatter: function(sProfileText, sProfile){
			        	if (sProfileText && sProfile) {
			        		return sProfileText + " (" + sProfile + ")";
			        	} else {
			        		return null;
			        	}
			        }
		})));

		var oSubstProfileDialog = sap.ui.getCore().byId(dynamicId + "substProfileDialog");
		if(oSubstProfileDialog===undefined){
			var dLayout = new sap.ui.commons.layout.MatrixLayout({
				id : dynamicId + 'searchSubstProfileLayout',
				layoutFixed : true,
				width : '100%'
			});


			var oSearch = new sap.ui.commons.SearchField({
				id : dynamicId + 'substProfileSearch',
				enableListSuggest: false,
				startSuggestion : 0,
				tooltip : oSubRuleMgr._oBundle.getText("SUBSTIUTION_RULE_SEARCH_FOR_SUBSTITUTION_PROFILE"),//"Search For Substitution Profile"
				editable : true,
				width: '100%'
			});

			// adding a placeholder for searchField
			oSearch.addDelegate({
				onAfterRendering : function() {
					var oTextField = sap.ui.getCore().byId(dynamicId + 'substProfileSearch-tf');
					oTextField.prop('placeholder', oSubRuleMgr._oBundle.getText("SUBSTITUTION_USERS_PICKLIST_SEARCH_LABEL")); // "Search"
				}
			});

			// Live search
			oSearch.attachSuggest(function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var aFilters = [];
				aFilters.push(new sap.ui.model.Filter("ProfileText", sap.ui.model.FilterOperator.Contains, sValue));
				aFilters.push(new sap.ui.model.Filter("Profile", sap.ui.model.FilterOperator.Contains, sValue));
				var oFilter = new sap.ui.model.Filter(aFilters, false);
				oTable.getBinding("rows").filter(oFilter, sap.ui.model.FilterType.Application);
			});

			dLayout.createRow(oSearch);

			var dLayoutCont = new sap.ui.commons.layout.VerticalLayout(dynamicId + "substProfileDialogVLayout", {
				width : "100%"
			});
			dLayoutCont.insertContent(dLayout, 0);
			dLayoutCont.insertContent(oTable, 1);
			oSubstProfileDialog = new sap.ui.commons.Dialog(dynamicId + "substProfileDialog", {
				width : '400px',
				modal : true,
				title : oSubRuleMgr._oBundle.getText("SUBSTIUTION_RULE_SEARCH_FOR_SUBSTITUTION_PROFILE"),// "Search For Substitution Profile",
				content : [dLayoutCont],
				buttons : [new sap.ui.commons.Button(dynamicId + "substProfileDialogOKBtn", {
					text : oSubRuleMgr._oBundle.getText("INBOX_BUTTON_OK_TEXT"),
					tooltip : oSubRuleMgr._oBundle.getText("SUBSTIUTION_RULE_SEARCH_SUBSTITUTION_PROFILE_OK_BUTTON_TOOLTIP"), // "Assign a Substitution Profile"
					press : function() {
						var table = sap.ui.getCore().byId(dynamicId + "substProfileTable");
						var selIndex = table.getSelectedIndex();
						var rowContext = table.getContextByIndex(selIndex);
						var tabModel = table.getModel();
						var selectedProfileText = tabModel.getProperty("ProfileText", rowContext);
						var selectedProfileNumber = tabModel.getProperty("Profile", rowContext);
						var oSubstProfileValueHelp = oSubRuleMgr._getComponent('substProfileValueHelp');
						oSubstProfileValueHelp.setValue(selectedProfileText);
						oSubstProfileValueHelp.data("Profile", selectedProfileNumber);
						oSubstProfileValueHelp.data("ProfileText", selectedProfileText);

						oSubstProfileDialog.close();
					}
				})]
			});
		}
		oSubstProfileDialog.open();
		oSubstProfileDialog.attachClosed( oSubRuleMgr, function(oEvent,oSubRuleMgr){
			oSubstProfileDialog.destroy();
		});
		oSubstProfileDialog.setInitialFocus(oSearch);
	}

	oSubRuleMgr._getSubstProfileData(fnOpenProfileSelectionDialogue);

};

sap.uiext.inbox.SubstitutionRulesManager.prototype._getSubstProfileData = function(fnOpenProfileSelectionDialogue){
	if (!oModel) {
		var oModel = this.getModel();
	}
	var that = this;
	if (!this.oSubstitutionProfileData) {

		this.oDataManager.readData("/SubstitutionProfileCollection", {
			success : function(oData,oResponse) {
				that.oSubstitutionProfileData = oData;
				fnOpenProfileSelectionDialogue(that.oSubstitutionProfileData);
			},
			error : function(error) {
				that.showMessage("error", that._oBundle.getText("INBOX_MSG_FETCH_SUBSTITUTION_PROFILE_FAILED"));
			}
		});
	} else {
		fnOpenProfileSelectionDialogue(this.oSubstitutionProfileData);
	}

};

// this function returns an array of providers for which substitution rule needs to be created
sap.uiext.inbox.SubstitutionRulesManager.prototype._getProvidersForCreateSubstitution = function(oEntry, fnCreateSubRuleRequest){

	var aSelectedProviders = [];
	var sProfileValueHelp = this._getComponent('substProfileValueHelp').getValue();
	if (sProfileValueHelp != null && sProfileValueHelp !== "") {

		/* If user selects a SubstitutionProfile, loop though SubstitutionProfileCollection and check which provider has the same Profile and ProfileText
		 * pushing the matching provider in to the array  */

		jQuery.each(this.oSubstitutionProfileData.results, function(i, item) {
			if (item.Profile === oEntry.Profile && item.ProfileText === oEntry.ProfileText) {
				aSelectedProviders.push(item.SAP__Origin);
			}
		});
	}
	else {

		/* If user does not select any SubstitutionProfile, loop through systemInfoCollection and select every provider in the system */

		var oSystemInfoCollectionData = this.oSystemInfoData;
		for (var elem in oSystemInfoCollectionData) {
			aSelectedProviders.push(oSystemInfoCollectionData[elem].SAP__Origin);
		};
	}

	fnCreateSubRuleRequest(aSelectedProviders);
};

sap.uiext.inbox.SubstitutionRulesManager.prototype._createSubRuleWithProfile = function(oEntry, sProvider){

	var oModel = this.getModel();
	var oSubstitutionModel = this._getSubstitutionRuleCollectionModel();
	var bFetchAgain = oSubstitutionModel.oData.SubstitutionRuleCollection.length > 0;
	var that = this;
	var oTempEntry = {};
	oTempEntry = jQuery.extend(true, {}, oEntry);
	oTempEntry.SAP__Origin = sProvider;

	oModel.create(this.sPath, oTempEntry, {
		success : function(oData, response){
			that.showMessage("success", that._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_CREATED_SUCCESSFULLY"));
			if (bFetchAgain)
				that._fetchSubstitutionRuleCollectionData();
			else
				oSubstitutionModel.oData.SubstitutionRuleCollection.push(oData);
			oSubstitutionModel.checkUpdate(false);
		},
		error : function(error){
			if(error.response === undefined || error.response.statusCode != 205){
				that.showMessage("error", that._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_CREATION_FAILURE_CONTACT_ADMIN"));
			}else if(error.response.statusCode == 205){
				var eventParams = {statusCode : error.response.statusCode, statusText : error.response.statusText};
				oModel.fireRequestFailed(eventParams);
			}
		}
	});
};

sap.uiext.inbox.SubstitutionRulesManager.prototype._createSubRuleWithProfileBatch = function(oEntry, aSelectedProviders) {

	var oSubstitutionModel = this._getSubstitutionRuleCollectionModel();
	var bFetchAgain = oSubstitutionModel.oData.SubstitutionRuleCollection.length > 0;
	var that = this;
	var aEntries = [];

	jQuery.each(aSelectedProviders, function(i, item) {
		var oTempEntry = {};
		oTempEntry = jQuery.extend(true, {}, oEntry);
		oTempEntry.SAP__Origin = item;
		aEntries.push(oTempEntry);
	});

	this.oDataManager.fireBatchRequest({
		sPath : that.sPath,
		sMethod : "POST",
		aProperties : aEntries,
		numberOfRequests : aSelectedProviders.length,
		sBatchGroupId : "createSubRule",
		fnSuccess : function(data, response) {
			var aBatchResponses = data.__batchResponses;
			var aErrors = [], aSuccess = [];
			jQuery.each(aBatchResponses, function(i, oSubstitutionRule) {
				var aChangeResponses = oSubstitutionRule.__changeResponses;
				if (aChangeResponses) {
					if (aChangeResponses[0].statusCode === "201" && aChangeResponses[0].statusText === "Created") {
						if (!bFetchAgain)
							oSubstitutionModel.oData.SubstitutionRuleCollection.push(aChangeResponses[0].data);
						aSuccess.push(i);
					} else {
						aErrors.push(i);
					}
				} else {
					aErrors.push(i);
				}
			});
			if (bFetchAgain)
				that._fetchSubstitutionRuleCollectionData();
			if(aErrors.length > 0){
				if (aSuccess.length < 1) {
					that.showMessage("error", that._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_CREATION_FAILURE_CONTACT_ADMIN"));
				} else {
					that.showMessage("warning", that._oBundle.getText("INBOX_MSG_CREATE_SUBSTITUTION_SUCCESS_AND_ERROR", [aSuccess.length, aSelectedProviders.length]));
				}
			}else{
				that.showMessage("success", that._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_CREATED_SUCCESSFULLY"));
			}

			oSubstitutionModel.checkUpdate(false);

		},
		fnError : function(oError) {
			that.showMessage("error", that._oBundle.getText("SUBSTITUTION_VALIDATION_MESSAGE_SUBSTITUTION_RULE_CREATION_FAILURE_CONTACT_ADMIN"));
		}
	});

};


sap.uiext.inbox.SubstitutionRulesManager.prototype._getFilters = function(isActiveSubstRule) {

	var oToday = this.substitutionRulesManagerUtils._getTodaysDate();
	var oTodayBegin = Date.UTC(oToday.getFullYear(), oToday.getMonth(), oToday.getDate(), 0, 0, 0, 0);
	var oTodayEnd = Date.UTC(oToday.getFullYear(), oToday.getMonth(), oToday.getDate(), 23, 59, 59, 59);
	var oFilter1, oFilter2, oFilter3;
	var bEnd = isActiveSubstRule;

	if (isActiveSubstRule) {

		oFilter1 = new sap.ui.model.Filter("IsEnabled", sap.ui.model.FilterOperator.EQ, true);
		oFilter2 = new sap.ui.model.Filter("BeginDate", sap.ui.model.FilterOperator.LE, oTodayEnd);
		oFilter3 = new sap.ui.model.Filter("EndDate", sap.ui.model.FilterOperator.GE, oTodayBegin);

	} else {

		oFilter1 = new sap.ui.model.Filter("IsEnabled", sap.ui.model.FilterOperator.EQ, false);
		oFilter2 = new sap.ui.model.Filter("BeginDate", sap.ui.model.FilterOperator.GT, oTodayEnd);
		oFilter3 = new sap.ui.model.Filter("EndDate", sap.ui.model.FilterOperator.LT, oTodayBegin);

	}

	var aFilters = [oFilter1, oFilter2, oFilter3];
	var oFilterFinal = new sap.ui.model.Filter(aFilters, bEnd);
	var aFilterFinal = [oFilterFinal];
	return aFilterFinal;

};