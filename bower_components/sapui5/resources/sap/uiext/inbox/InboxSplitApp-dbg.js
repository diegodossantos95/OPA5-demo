/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.uiext.inbox.InboxSplitApp.
jQuery.sap.declare("sap.uiext.inbox.InboxSplitApp");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new InboxSplitApp.
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
 * <ul>
 * <li>{@link #getShowMasterPageNavBtn showMasterPageNavBtn} : boolean</li>
 * <li>{@link #getTcmServiceURL tcmServiceURL} : string</li>
 * <li>{@link #getFilters filters} : object[]</li>
 * <li>{@link #getTcmConfiguration tcmConfiguration} : object</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getSplitAppl splitAppl} : sap.m.SplitApp</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.uiext.inbox.InboxSplitApp#event:navButtonPressed navButtonPressed} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Inbox Split App
 * @extends sap.ui.core.Control
 * @version 1.50.6
 *
 * @constructor
 * @public
 * @experimental Since version 1.7.0. 
 * API is not yet finished and might change completely
 * @name sap.uiext.inbox.InboxSplitApp
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.InboxSplitApp", { metadata : {

	deprecated : true,
	publicMethods : [
		// methods
		"bindTasks", "resetSearchCriteria"
	],
	library : "sap.uiext.inbox",
	properties : {

		/**
		 * Show/Hide the Navigation Button for the Master Page
		 */
		"showMasterPageNavBtn" : {type : "boolean", group : "Appearance", defaultValue : null},

		/**
		 * TCM service URL
		 */
		"tcmServiceURL" : {type : "string", group : "", defaultValue : null},

		/**
		 * Filters to be applied on the data shown in the MasterPage
		 */
		"filters" : {type : "object[]", group : "Misc", defaultValue : null},

		/**
		 * TCM Configuration object for control initialization.
		 */
		"tcmConfiguration" : {type : "object", group : "Misc", defaultValue : null}
	},
	aggregations : {

		/**
		 * This is the splitApp that is created inside the control
		 */
		"splitAppl" : {type : "sap.m.SplitApp", multiple : false}
	},
	events : {

		/**
		 * Navigation Button of the Master Page is pressed, if visible.
		 */
		"navButtonPressed" : {}
	}
}});


/**
 * Creates a new subclass of class sap.uiext.inbox.InboxSplitApp with name <code>sClassName</code> 
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
 * @name sap.uiext.inbox.InboxSplitApp.extend
 * @function
 */

sap.uiext.inbox.InboxSplitApp.M_EVENTS = {'navButtonPressed':'navButtonPressed'};


/**
 * Getter for property <code>showMasterPageNavBtn</code>.
 * Show/Hide the Navigation Button for the Master Page
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {boolean} the value of property <code>showMasterPageNavBtn</code>
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#getShowMasterPageNavBtn
 * @function
 */

/**
 * Setter for property <code>showMasterPageNavBtn</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {boolean} bShowMasterPageNavBtn  new value for property <code>showMasterPageNavBtn</code>
 * @return {sap.uiext.inbox.InboxSplitApp} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#setShowMasterPageNavBtn
 * @function
 */


/**
 * Getter for property <code>tcmServiceURL</code>.
 * TCM service URL
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>tcmServiceURL</code>
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#getTcmServiceURL
 * @function
 */

/**
 * Setter for property <code>tcmServiceURL</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTcmServiceURL  new value for property <code>tcmServiceURL</code>
 * @return {sap.uiext.inbox.InboxSplitApp} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#setTcmServiceURL
 * @function
 */


/**
 * Getter for property <code>filters</code>.
 * Filters to be applied on the data shown in the MasterPage
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {object[]} the value of property <code>filters</code>
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#getFilters
 * @function
 */

/**
 * Setter for property <code>filters</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object[]} aFilters  new value for property <code>filters</code>
 * @return {sap.uiext.inbox.InboxSplitApp} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#setFilters
 * @function
 */


/**
 * Getter for property <code>tcmConfiguration</code>.
 * TCM Configuration object for control initialization.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {object} the value of property <code>tcmConfiguration</code>
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#getTcmConfiguration
 * @function
 */

/**
 * Setter for property <code>tcmConfiguration</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object} oTcmConfiguration  new value for property <code>tcmConfiguration</code>
 * @return {sap.uiext.inbox.InboxSplitApp} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#setTcmConfiguration
 * @function
 */


/**
 * Getter for aggregation <code>splitAppl</code>.<br/>
 * This is the splitApp that is created inside the control
 * 
 * @return {sap.m.SplitApp}
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#getSplitAppl
 * @function
 */


/**
 * Setter for the aggregated <code>splitAppl</code>.
 * @param {sap.m.SplitApp} oSplitAppl
 * @return {sap.uiext.inbox.InboxSplitApp} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#setSplitAppl
 * @function
 */
	

/**
 * Destroys the splitAppl in the aggregation 
 * named <code>splitAppl</code>.
 * @return {sap.uiext.inbox.InboxSplitApp} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#destroySplitAppl
 * @function
 */


/**
 * Navigation Button of the Master Page is pressed, if visible.
 *
 * @name sap.uiext.inbox.InboxSplitApp#navButtonPressed
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'navButtonPressed' event of this <code>sap.uiext.inbox.InboxSplitApp</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.uiext.inbox.InboxSplitApp</code>.<br/> itself. 
 *  
 * Navigation Button of the Master Page is pressed, if visible.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.uiext.inbox.InboxSplitApp</code>.<br/> itself.
 *
 * @return {sap.uiext.inbox.InboxSplitApp} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#attachNavButtonPressed
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'navButtonPressed' event of this <code>sap.uiext.inbox.InboxSplitApp</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.uiext.inbox.InboxSplitApp} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.InboxSplitApp#detachNavButtonPressed
 * @function
 */

/**
 * Fire event navButtonPressed to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.uiext.inbox.InboxSplitApp} <code>this</code> to allow method chaining
 * @protected
 * @name sap.uiext.inbox.InboxSplitApp#fireNavButtonPressed
 * @function
 */


/**
 * Call this method to display data in the InboxSplitApp
 *
 * @name sap.uiext.inbox.InboxSplitApp#bindTasks
 * @function
 * @param {object[]} aAFilters
 * @type sap.uiext.inbox.InboxSplitApp
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Call this method to reset the search criteria.
 *
 * @name sap.uiext.inbox.InboxSplitApp#resetSearchCriteria
 * @function
 * @type sap.uiext.inbox.InboxSplitApp
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/uiext/inbox/InboxSplitApp.js
/*!
 * @copyright@
 * @deprecated Since version 1.38.0
 */
 jQuery.sap.require("sap.uiext.inbox.splitapp.MasterPage");
 jQuery.sap.require("sap.uiext.inbox.splitapp.DetailViewPage");
 /*global OData */// declare unusual global vars for JSLint/SAPUI5 validation
///**
//* This file defines behavior for the control,
//*/
sap.uiext.inbox.InboxSplitApp.prototype.init = function() {
	this.oCore = sap.ui.getCore();
	
	this.bPhoneDevice = jQuery.device.is.phone;

	this.setAggregation("splitAppl", new sap.m.SplitApp({mode: this.bPhoneDevice ? sap.m.SplitAppMode.HideMode : sap.m.SplitAppMode.StretchCompressMode}));
	this.oSplitApp = this.getAggregation("splitAppl");
	
    this.oInboxMasterPage = new sap.uiext.inbox.splitapp.MasterPage(this.getId() + "-mp");
	this.oSplitApp.addMasterPage(this.oInboxMasterPage.getPage());
	
	this.oInboxDetailPage = new sap.uiext.inbox.splitapp.DetailViewPage(this.getId() + "-dp");
	this.oSplitApp.addDetailPage(this.oInboxDetailPage.getPage());
	
	var fnHandleListSelect = jQuery.proxy(this._handleListSelect, this);
	this.oCore.getEventBus().subscribe('sap.uiext.inbox', "masterPageListSelected", fnHandleListSelect);
	
	var fnNavButtonTapHandler = jQuery.proxy(this._handleNavButtonTapped, this);
	this.oCore.getEventBus().subscribe('sap.uiext.inbox', "masterPageNavButtonTapped", fnNavButtonTapHandler);
	
	var fnNavButtonPressDetailPageHandler = jQuery.proxy(this._handleNavButtonPressDetailPage, this);
	this.oCore.getEventBus().subscribe('sap.uiext.inbox', "detailPageNavButtonTapped", fnNavButtonPressDetailPageHandler);
	
	var fnTaskTitleHandler = jQuery.proxy(this._handleOpenTaskExecutionUI, this);
	this.oCore.getEventBus().subscribe('sap.uiext.inbox', "detailPageTaskTitleSelected", fnTaskTitleHandler);
	
	var fnHandleTaskActionCompleted = jQuery.proxy(this._handleTaskActionCompleted, this);
	this.oCore.getEventBus().subscribe('sap.uiext.inbox', "taskActionCompleted",fnHandleTaskActionCompleted);
};

sap.uiext.inbox.InboxSplitApp.prototype.setTcmServiceURL = function(sValue){
    this.setProperty("tcmServiceURL", sValue, true);
    
    var oTCMModel = new sap.ui.model.odata.ODataModel(sValue,true);
	oTCMModel.setCountSupported(false);
	this.setModel(oTCMModel,"inboxTCMModel");
	
    this.oInboxDetailPage._setTcmServiceURL(sValue);
    this.oInboxMasterPage._setTcmServiceURL(sValue);
    return this;
};


sap.uiext.inbox.InboxSplitApp.prototype.setTcmConfiguration = function(oTCMConfiguration){
	this.setProperty("tcmConfiguration", oTCMConfiguration, true);
	var oTcmConfiguration = this.getProperty("tcmConfiguration");
	
	this.oInboxDetailPage._setTcmConfiguration(oTcmConfiguration);
	return this;
};

sap.uiext.inbox.InboxSplitApp.prototype.setShowMasterPageNavBtn = function(bValue){
    this.setProperty("showMasterPageNavBtn", bValue, true);
    this.oInboxMasterPage.setShowNavButton(bValue);
    return this;
};

sap.uiext.inbox.InboxSplitApp.prototype._handleNavButtonTapped = function(sChannel, sEvent, oParams){
    this.fireNavButtonPressed();
};

sap.uiext.inbox.InboxSplitApp.prototype._handleNavButtonPressDetailPage = function (sChannel, sEvent) {
	this.oSplitApp.toMaster(this.oInboxMasterPage.getPage().getId());
}

sap.uiext.inbox.InboxSplitApp.prototype.bindTasks = function(aFilters) {
	this.oInboxMasterPage.bindService(aFilters);
	return this;
};

sap.uiext.inbox.InboxSplitApp.prototype.resetSearchCriteria = function() {
	if (this.oInboxMasterPage) {
		this.oInboxMasterPage.resetSearchCriteria();
	}
	return this;
};

sap.uiext.inbox.InboxSplitApp.prototype._handleOpenTaskExecutionUI = function( sChannel, sEvent, oTaskSelection) {
    if(!this.oTaskExecutionUIPageObj){
    	this._createTaskExecutionUIPage();
    }
    this.oTaskExecutionUIPageObj.getPage().setBindingContext(oTaskSelection.context);
    this.oTaskExecutionUIPageObj.open();
    if (jQuery.device.is.phone){
    	this.oSplitApp.to(this.oTaskExecutionUIPageObj.getPage().getId());
    }
};

sap.uiext.inbox.InboxSplitApp.prototype._createTaskExecutionUIPage = function() {
	jQuery.sap.require("sap.uiext.inbox.splitapp.TaskExecutionUIPage");
	
	this.oTaskExecutionUIPageObj = new sap.uiext.inbox.splitapp.TaskExecutionUIPage(this.getId() + "-exUi");  
	
	this.oSplitApp.addPage(this.oTaskExecutionUIPageObj.getPage());
	
	var fnCloseTaskExecUI = jQuery.proxy(this._handleTaskExecUIPageNavButtonPressed, this);
	this.oCore.getEventBus().subscribe('sap.uiext.inbox', "taskExecUIPageNavButtonPressed", fnCloseTaskExecUI);

};

sap.uiext.inbox.InboxSplitApp.prototype._handleTaskExecUIPageNavButtonPressed = function( sChannel, sEvent, oParams) {
	this.oSplitApp.backToTopDetail(); 
	this.oInboxMasterPage._refreshTasks(null, this.oInboxMasterPage);
	this.oInboxDetailPage.renderDetailsPage();
};

sap.uiext.inbox.InboxSplitApp.prototype._handleListSelect = function( sChannel, sEvent, oListSelected) {
	this.oInboxDetailPage.getPage().setBindingContext(oListSelected.context);
	if (this.bPhoneDevice) {
		this.oSplitApp.toDetail(this.oInboxDetailPage.getPage().getId());
	}
	if(this.oInboxDetailPage.getPage().getId() == this.oSplitApp.getCurrentPage().getId()){
		this.oInboxDetailPage.renderDetailsPage(oListSelected.onUpdate);
		/*if (this.oInboxDetailPage.isCommentsSupported === true){

			this.oInboxDetailPage._displayCommentsIfCommentsSelectedinIconBar();

		}*/
	}else{
		this._handleOpenTaskExecutionUI(null, null, oListSelected);
	}
};

sap.uiext.inbox.InboxSplitApp.prototype._handleTaskActionCompleted = function( sChannel, sEvent, oTaskData) {
	if (!this.bPhoneDevice) {
		this.oInboxMasterPage.rerenderTask(oTaskData.taskData);
	}else{
		this.oInboxDetailPage.updateTaskDataInModel(oTaskData.taskData);
		if(oTaskData.taskData.Status != "COMPLETED") {
			this.oInboxDetailPage.renderDetailsPage();
		}else {
			this.oSplitApp.toMaster(this.oInboxMasterPage.getPage().getId());
		}
	}	
};

