/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.uiext.inbox.Inbox.
jQuery.sap.declare("sap.uiext.inbox.Inbox");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new Inbox.
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
 * <li>{@link #getTaskExecutionURLThemeValue taskExecutionURLThemeValue} : string</li>
 * <li>{@link #getHandleBindings handleBindings} : boolean (default: true)</li>
 * <li>{@link #getOpenCompletedTasks openCompletedTasks} : boolean (default: false)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.uiext.inbox.Inbox#event:oDataRequestCompleted oDataRequestCompleted} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.uiext.inbox.Inbox#event:refresh refresh} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.uiext.inbox.Inbox#event:taskAction taskAction} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.uiext.inbox.Inbox#event:taskSelectionChange taskSelectionChange} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A comprehensive UI design approach with graphical and functional elements for search tasks, filter tasks, and take actions on the tasks
 * ("Inbox Pattern").
 * @extends sap.ui.core.Control
 * @version 1.50.6
 *
 * @constructor
 * @public
 * @experimental Since version 1.5.2. 
 * API is not yet finished and might change completely
 * @name sap.uiext.inbox.Inbox
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.Inbox", { metadata : {

	deprecated : true,
	publicMethods : [
		// methods
		"clearDrillDownFilter", "clearRowSettings", "bindTaskTable", "getTaskTableBinding", "bindTaskExecutionURL", "bindTaskTypeDynamicFilter", "bindSearch", "setSubstitutionEnabled", "getSubstitutionEnabled", "bindTasks", "setConfiguration", "setOpenTaskUIInNewTab", "addAction", "refresh"
	],
	library : "sap.uiext.inbox",
	properties : {

		/**
		 * set the theme URL parameter string to be appended to the task Execution URL. In case of a function callback set for Task Execution PopUp, this string will not be appended.
		 */
		"taskExecutionURLThemeValue" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * set this as true for oData Model. If set as false, the user will need to handle task Actions, search and Task Execution URL population. See function call back methods.
		 */
		"handleBindings" : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * set this to true to enable opening of completed tasks.
		 */
		"openCompletedTasks" : {type : "boolean", group : "Misc", defaultValue : false}
	},
	events : {

		/**
		 * If handleBindings property is set to true , the control assumes an oData model is set and handles the complete logic within. In this case once the oData request is complete, this event is fired with additional parameters.
		 */
		"oDataRequestCompleted" : {}, 

		/**
		 * this event is fires to handle refresh Action, when the handleBindings property is set to false.
		 */
		"refresh" : {}, 

		/**
		 * this event is fires to handle task Actions - Claim, Release, when the handleBindings property is set to false.
		 */
		"taskAction" : {}, 

		/**
		 * This event is fired when table row selection is changed in the list view of Inbox control
		 */
		"taskSelectionChange" : {}
	}
}});


/**
 * Creates a new subclass of class sap.uiext.inbox.Inbox with name <code>sClassName</code> 
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
 * @name sap.uiext.inbox.Inbox.extend
 * @function
 */

sap.uiext.inbox.Inbox.M_EVENTS = {'oDataRequestCompleted':'oDataRequestCompleted','refresh':'refresh','taskAction':'taskAction','taskSelectionChange':'taskSelectionChange'};


/**
 * Getter for property <code>taskExecutionURLThemeValue</code>.
 * set the theme URL parameter string to be appended to the task Execution URL. In case of a function callback set for Task Execution PopUp, this string will not be appended.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>taskExecutionURLThemeValue</code>
 * @public
 * @name sap.uiext.inbox.Inbox#getTaskExecutionURLThemeValue
 * @function
 */

/**
 * Setter for property <code>taskExecutionURLThemeValue</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTaskExecutionURLThemeValue  new value for property <code>taskExecutionURLThemeValue</code>
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.Inbox#setTaskExecutionURLThemeValue
 * @function
 */


/**
 * Getter for property <code>handleBindings</code>.
 * set this as true for oData Model. If set as false, the user will need to handle task Actions, search and Task Execution URL population. See function call back methods.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>handleBindings</code>
 * @public
 * @name sap.uiext.inbox.Inbox#getHandleBindings
 * @function
 */

/**
 * Setter for property <code>handleBindings</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bHandleBindings  new value for property <code>handleBindings</code>
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.Inbox#setHandleBindings
 * @function
 */


/**
 * Getter for property <code>openCompletedTasks</code>.
 * set this to true to enable opening of completed tasks.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>openCompletedTasks</code>
 * @public
 * @name sap.uiext.inbox.Inbox#getOpenCompletedTasks
 * @function
 */

/**
 * Setter for property <code>openCompletedTasks</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bOpenCompletedTasks  new value for property <code>openCompletedTasks</code>
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.Inbox#setOpenCompletedTasks
 * @function
 */


/**
 * If handleBindings property is set to true , the control assumes an oData model is set and handles the complete logic within. In this case once the oData request is complete, this event is fired with additional parameters.
 *
 * @name sap.uiext.inbox.Inbox#oDataRequestCompleted
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'oDataRequestCompleted' event of this <code>sap.uiext.inbox.Inbox</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.uiext.inbox.Inbox</code>.<br/> itself. 
 *  
 * If handleBindings property is set to true , the control assumes an oData model is set and handles the complete logic within. In this case once the oData request is complete, this event is fired with additional parameters.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.uiext.inbox.Inbox</code>.<br/> itself.
 *
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.Inbox#attachODataRequestCompleted
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'oDataRequestCompleted' event of this <code>sap.uiext.inbox.Inbox</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.Inbox#detachODataRequestCompleted
 * @function
 */

/**
 * Fire event oDataRequestCompleted to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @protected
 * @name sap.uiext.inbox.Inbox#fireODataRequestCompleted
 * @function
 */


/**
 * this event is fires to handle refresh Action, when the handleBindings property is set to false.
 *
 * @name sap.uiext.inbox.Inbox#refresh
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'refresh' event of this <code>sap.uiext.inbox.Inbox</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.uiext.inbox.Inbox</code>.<br/> itself. 
 *  
 * this event is fires to handle refresh Action, when the handleBindings property is set to false.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.uiext.inbox.Inbox</code>.<br/> itself.
 *
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.Inbox#attachRefresh
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'refresh' event of this <code>sap.uiext.inbox.Inbox</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.Inbox#detachRefresh
 * @function
 */

/**
 * Fire event refresh to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @protected
 * @name sap.uiext.inbox.Inbox#fireRefresh
 * @function
 */


/**
 * this event is fires to handle task Actions - Claim, Release, when the handleBindings property is set to false.
 *
 * @name sap.uiext.inbox.Inbox#taskAction
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'taskAction' event of this <code>sap.uiext.inbox.Inbox</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.uiext.inbox.Inbox</code>.<br/> itself. 
 *  
 * this event is fires to handle task Actions - Claim, Release, when the handleBindings property is set to false.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.uiext.inbox.Inbox</code>.<br/> itself.
 *
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.Inbox#attachTaskAction
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'taskAction' event of this <code>sap.uiext.inbox.Inbox</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.Inbox#detachTaskAction
 * @function
 */

/**
 * Fire event taskAction to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @protected
 * @name sap.uiext.inbox.Inbox#fireTaskAction
 * @function
 */


/**
 * This event is fired when table row selection is changed in the list view of Inbox control
 *
 * @name sap.uiext.inbox.Inbox#taskSelectionChange
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'taskSelectionChange' event of this <code>sap.uiext.inbox.Inbox</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.uiext.inbox.Inbox</code>.<br/> itself. 
 *  
 * This event is fired when table row selection is changed in the list view of Inbox control
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.uiext.inbox.Inbox</code>.<br/> itself.
 *
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.Inbox#attachTaskSelectionChange
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'taskSelectionChange' event of this <code>sap.uiext.inbox.Inbox</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @public
 * @name sap.uiext.inbox.Inbox#detachTaskSelectionChange
 * @function
 */

/**
 * Fire event taskSelectionChange to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.uiext.inbox.Inbox} <code>this</code> to allow method chaining
 * @protected
 * @name sap.uiext.inbox.Inbox#fireTaskSelectionChange
 * @function
 */


/**
 * Clears all the filters applied in Drill Down. (Status, Priority, Date/Time and TaskType).
 *
 * @name sap.uiext.inbox.Inbox#clearDrillDownFilter
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Row Settings applied using the Settings button shall be cleared. <TO be Implemented>
 *
 * @name sap.uiext.inbox.Inbox#clearRowSettings
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Binds the Task Table Rows to the given path.
 *
 * @name sap.uiext.inbox.Inbox#bindTaskTable
 * @function
 * @param {string} sPath
 *         Binding path for the rows of the Task Table
 * @param {object} oTaskFilters
 *         Predefined filter for the Task Table (sap.uiext.inbox.TaskInitialFilters)
 * @type sap.uiext.inbox.Inbox
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * returns the binding for the Task Table
 *
 * @name sap.uiext.inbox.Inbox#getTaskTableBinding
 * @function
 * @type object
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Registers a callback function to be invoked to populate the Task Execution PopUp.
 *
 * @name sap.uiext.inbox.Inbox#bindTaskExecutionURL
 * @function
 * @param {object} oId
 *         callback function for getting the execution URL, will be supplied with the task ID and should return the URL to be displayed with the Task Execution PopUp.
 * @param {object} oStatus
 *         callback function for getting the status of the task, will be supplied with the task ID and should return the Task Status.
 * @type sap.uiext.inbox.Inbox
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Registers a callback function to be invoked to populate the TaskType Drill Down.
 * This should return the array of Values to be populated in the Task Type Drill Down.
 *
 * @name sap.uiext.inbox.Inbox#bindTaskTypeDynamicFilter
 * @function
 * @type sap.uiext.inbox.Inbox
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Registers a callback function to be invoked to search on the Task Table.
 *
 * @name sap.uiext.inbox.Inbox#bindSearch
 * @function
 * @type sap.uiext.inbox.Inbox
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Setter for property isSubstitutionEnabled.
 * 
 * Boolean property to enable the sap.uiext.inbox.SubstitutionRulesManager control (default is false). If set to true, 'Manage Substitution Rules' is visible in settings button, else if set to false the option will not be visible under settings.
 * 
 * Default value is false
 *
 * @name sap.uiext.inbox.Inbox#setSubstitutionEnabled
 * @function
 * @param {boolean} bIsSubstitutionEnabled
 *         isSubstitutionEnabled
 * @param {string} sPath
 *         the path
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Getter for property isSubstitutionEnabled.
 * 
 * Boolean property to enable the sap.uiext.inbox.SubstitutionRulesManager control (default is false). If is true, 'Manage Substitution Rules' is visible in settings button, else if it is false the option will not be visible under settings.
 * 
 * Default value is false
 *
 * @name sap.uiext.inbox.Inbox#getSubstitutionEnabled
 * @function
 * @type boolean
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Bind the Inbox Task Collection
 *
 * @name sap.uiext.inbox.Inbox#bindTasks
 * @function
 * @param {string} sPath
 *         Binding path for the element displaying the tasks within the Inbox. This path is the Task Collection according to the TCM (Task Consumption Model)
 * @param {object} oOFilter
 *         Predefined filter that is applied to the Task Collection before displaying the tasks in the Inbox. (sap.uiext.inbox.InboxFilters)
 * @param {object} oOSorter
 *         {sap.ui.model.Sorter}Predefined sorter that is applied to the Task Collection before displaying the tasks in the Inbox. By default the tasks are sorted on 'CreatedOn' , descending, according to TCM.
 * 
 *         The sorter is not validated for the path being a valid TCM Entity Property. The sorter passed will be applied to the oData service as is. In case the entity Property in the path is a sortable property on the UI, the sorter indicator for that property will be visible.
 * @type sap.uiext.inbox.Inbox
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Set configuration on Inbox. See APIs in InboxConfiguration
 *
 * @name sap.uiext.inbox.Inbox#setConfiguration
 * @function
 * @param {object} oOConfiguration
 *         Configuration object to set the configuration on Inbox. See APIs in InboxConfiguration
 * @type sap.uiext.inbox.Inbox
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Setter for property bOpenTaskUIInNewTab.
 * If set to true, Task UI will opene in a new tab.
 * Default value is false.
 *
 * @name sap.uiext.inbox.Inbox#setOpenTaskUIInNewTab
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Adds an additional action to inbox
 *
 * @name sap.uiext.inbox.Inbox#addAction
 * @function
 * @param {string} sSActionID
 *         ID of the new action.
 * @param {string} sSActionLabel
 *         The Label Text for the new action.
 * @param {string} sSToolTip
 *         Tooltip for the added action.
 * @param {object} oFnActionHandler
 *         Function to be called when the action is executed
 * @param {boolean} bBMassEnabled
 *         Flag indicating if the action is mass enabled.Default value is true.
 * @type sap.uiext.inbox.Inbox
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Inbox is refreshed if task is completed
 *
 * @name sap.uiext.inbox.Inbox#refresh
 * @function
 * @param {object[]} aATaskUniqueIdentifiers
 *         Array of Json objects containing TaskInstanceID and SAP__Origin
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

// Start of sap/uiext/inbox/Inbox.js
/*!
 * @copyright@
 */

/**
 * Constructor for a new Inbox.
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
 * <li>{@link #getTaskExecutionURLThemeValue taskExecutionURLThemeValue} : string</li>
 * <li>{@link #getHandleBindings handleBindings} : boolean (default: true)</li>
 * <li>{@link #getOpenCompletedTasks openCompletedTasks} : boolean (default: false)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.uiext.inbox.Inbox#event:oDataRequestCompleted oDataRequestCompleted} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.uiext.inbox.Inbox#event:refresh refresh} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.uiext.inbox.Inbox#event:taskAction taskAction} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.uiext.inbox.Inbox#event:taskSelectionChange taskSelectionChange} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A comprehensive UI design approach with graphical and functional elements for search tasks, filter tasks, and take actions on the tasks
 * ("Inbox Pattern").
 * @extends sap.ui.core.Control
 * @version 1.41.0-SNAPSHOT
 *
 * @constructor
 * @public
 * @experimental Since version 1.5.2. 
 * API is not yet finished and might change completely
 * @deprecated Since version 1.38.0
 * @name sap.uiext.inbox.Inbox
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */

jQuery.sap.require("sap.uiext.inbox.InboxConstants");
jQuery.sap.require("sap.uiext.inbox.TCMMetadata");
jQuery.sap.require("sap.uiext.inbox.tcm.TCMModel");
jQuery.sap.require("sap.uiext.inbox.InboxLink");
jQuery.sap.require("sap.uiext.inbox.InboxTaskCategoryFilterList");
jQuery.sap.require("sap.uiext.inbox.TaskInitialFilters");
jQuery.sap.require("sap.uiext.inbox.InboxUtils");
jQuery.sap.require("sap.uiext.inbox.SubstitutionRulesManager");
jQuery.sap.require("sap.uiext.inbox.InboxFilters");
jQuery.sap.require("sap.uiext.inbox.controller.InboxControllerFactory");
jQuery.sap.require("sap.uiext.inbox.InboxDataManager");

jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ui.core.ListItem");
jQuery.sap.require("sap.ui.core.HTML");
jQuery.sap.require("sap.ui.core.Locale");
jQuery.sap.require("sap.ui.core.Icon");
jQuery.sap.require("sap.ui.core.IconPool");

jQuery.sap.require("sap.ui.commons.layout.MatrixLayout");
jQuery.sap.require("sap.ui.commons.Image");
jQuery.sap.require("sap.ui.commons.ToggleButton");
jQuery.sap.require("sap.ui.commons.DropdownBox");
jQuery.sap.require("sap.ui.commons.SearchField");
jQuery.sap.require("sap.ui.commons.Toolbar");
jQuery.sap.require("sap.ui.commons.TextView");
jQuery.sap.require("sap.ui.commons.Label");
jQuery.sap.require("sap.ui.commons.Button");
jQuery.sap.require("sap.ui.commons.ToolbarSeparator");
jQuery.sap.require("sap.ui.commons.Link");
jQuery.sap.require("sap.ui.commons.TextField");
jQuery.sap.require("sap.ui.commons.layout.BorderLayout");
jQuery.sap.require("sap.ui.commons.layout.HorizontalLayout");
jQuery.sap.require("sap.ui.commons.layout.VerticalLayout");
jQuery.sap.require("sap.ui.commons.RadioButtonGroup");
jQuery.sap.require("sap.ui.commons.Dialog");
jQuery.sap.require("sap.uiext.inbox.InboxFormattedTextView");
jQuery.sap.require("sap.uiext.inbox.InboxToggleTextView");

jQuery.sap.require("sap.ui.ux3.FacetFilter");
jQuery.sap.require("sap.ui.ux3.FacetFilterList");
jQuery.sap.require("sap.ui.ux3.OverlayContainer");

jQuery.sap.require("sap.ui.table.Table");

jQuery.sap.require("sap.ui.model.Sorter");
jQuery.sap.require("sap.ui.model.Filter");

/*global OData */// declare unusual global vars for JSLint/SAPUI5 validation
// /**
// * This file defines behavior for the control,
// */
sap.uiext.inbox.Inbox.prototype.init = function() {
	//initialize inboxUtils, inboxConstants, resource bundle and other bootstrapping
	this.oTcmMetadata= new sap.uiext.inbox.TCMMetadata();
	this.oTCMModel = new sap.uiext.inbox.tcm.TCMModel();
	this.inboxUtils = sap.uiext.inbox.InboxUtils;
	this.constants = sap.uiext.inbox.InboxConstants;
	this.oDataManager = sap.uiext.inbox.InboxDataManager;
	this.oCore = sap.ui.getCore();
	this._oBundle = this.oCore.getLibraryResourceBundle("sap.uiext.inbox");
	
	var sCurrentTheme = sap.ui.getCore().getConfiguration().getTheme();
	this._imgResourcePath = sap.ui.resource('sap.uiext.inbox', 'themes/' + sCurrentTheme + '/img/');
	
	//check for URL Parameter for the defaultView rendering.
	var oUriParams = jQuery.sap.getUriParameters();
	var defaultView_URLParam = this.constants.defaultView_URLParameter;
	var sURLViewValue = oUriParams.get(defaultView_URLParam);
    if(sURLViewValue === null){
    	var cookieValue = this.inboxUtils.getCookieValue(defaultView_URLParam);
        this.defaultView  =  cookieValue !== undefined ? cookieValue : this.constants.tableView;
    }else{
    	this.defaultView = jQuery.inArray(sURLViewValue, this.constants.inboxViews) === -1 ? this.constants.tableView : sURLViewValue;
    	this.inboxUtils.setCookieValue (defaultView_URLParam,this.defaultView,1);
    }
    var oConfig = {};
    oConfig.bAsyncValue = (oUriParams.get(this.constants.async_URLParameter) === "true") ? true : false;
    this.oController = new sap.uiext.inbox.controller.InboxControllerFactory(oConfig).getController();
    this.oController.setView(this);
    
    var sClientUpdateValue = oUriParams.get("sap-ui-inbox-clientUpdate");
    if (sClientUpdateValue) {
    	sClientUpdateValue = sClientUpdateValue.toLowerCase();
	}
    if(sClientUpdateValue && sClientUpdateValue === 'true'){
        this.clientUpdate = true;
    }

    //TODO: this does not seem to be required anymore, as the status and priority mappings on GW side are in place. Remove and Test.
    this.sProviderHost = "";
    
    this.bRefreshTaskTypes = true;
    this.selectedContexts = [];
    
    //Model binding related stuff
    this.sTypeOfModel = "";
    this.bpmSvcUrl = "";
    
   // Url Parameters
    var tableViewRowCount_URLParam = this.constants.tableViewRowCount_URLParameter;
    this.tableViewRowCountValue = oUriParams.get(tableViewRowCount_URLParam);
    var rrViewRowCount_URLParam = this.constants.rrViewRowCount_URLParameter;
    this.rrViewRowCountValue = oUriParams.get(rrViewRowCount_URLParam);
   
    //enable/Disable some features in Inbox
    this.applyTaskCategoryFilter = false; // flag to enable category facet filter
    this.isSubstitutionEnabled = false;
    this.isSubstitutionRuleCreationSupported=false;
    this.isCustomAttributesEnabled = false;
    this.isCustomActionsEnabled = false;
    this.showTaskDescription = false;
    this.showTaskCategory = true;//TODO: Make it false and later handle in Inbox
    this.isBatchOperationSupported = true;
    this.isForwardActionEnabled = false;
    this.isCommentsEnabled = false;
    this.bOpenTaskUIInNewTab = true;// If false open Task Execution UI in overlay container else if its true opens in new browser tab.
    this.bUseBatch  = false;
    this.bAllowCustomAttributeSort = true;
    
    /* Set the following flag to true if filtering for tasks with null values for due date is supported. 
     * Setting it to true will add one more option in the due date filter "No Due Date".
     * */
    this.bShowNoDueDateFilter = false;
    
    this.loggedInUserName;
    this.loggedInUserDisplayName;
    //this.initialLoad = true;
    this._substitutionPath = "";
    // default value
    this.sCollectionPath = "TaskCollection";
    this.filtersToApply = {};
    this.filterState = {};
    
    this.resetMessages = true;
    //this.attachTaskAction(this, this.defaultActionHandler);
    this.httpMethodForAction = 'POST';
    this.currentView = this.defaultView;
    this.bRefreshStartFlag = false;
    
    //flag to check Search User request is fired.
    
    this.oPendingSearchRequest = undefined; 
    
    //default callbacks 
    this.getDefaultTaskExecutionURLCallBack = function(id,sapOriginId) {
        // var IDURIPart = "getTaskExecutionUrl"+"?ID='"+ id +"'&$format=json";
        var IDURIPart = this.sCollectionPath + "(InstanceID='" + id + "',SAP__Origin='" + sapOriginId + "')/UIExecutionLink?$format=json";
        var requestURI = this.bpmSvcUrl + IDURIPart;
        var url = "";
        var oModel = this.getCoreModel();
        var that = this;
        var requestOptions = {
            async:false,
            requestUri : requestURI,
            method : "GET",
            headers : {
                Accept : "application/json",
                "x-csrf-token" : oModel.oHeaders["x-csrf-token"]
            }
        };
        OData.request(requestOptions, function(data, request) {
            // TO-DO : make this generic
            url = data.GUI_Link;
        }, function(error) {
            if(error.response.statusCode == 205){
                var eventParams = {statusCode : error.response.statusCode, statusText : error.response.statusText};
                oModel.fireRequestFailed(eventParams);
            }else{
            //TODO: use enums for messageType.
            	var sMessage = that.inboxUtils.getErrorMessageFromODataErrorObject(error);
            	that.showMessage("error", that._oBundle.getText("INBOX_MSG_ERR_EXUI") +" "+ id +"; "+sMessage);
            }
        });
        if (url.search("HRMSS_LR_APPR_G") != -1){
	        var lang = sap.ui.getCore().getConfiguration().getLanguage();
	        url = url + "&sap-language=" + lang;
        }
        return url;
    };

    this.getTaskExecURLStatusCallBack = function(id,sapOriginId) {
        var status = "";
        var requrl = this.bpmSvcUrl + this.sCollectionPath + "(InstanceID='" + id + "',SAP__Origin='" + sapOriginId + "')?$format=json";
        var oModel = this.getCoreModel();
        var that = this;
        var requestOptions = {
            async:false,
            requestUri : requrl,
            method : "GET",
            headers : {
                Accept : "application/json",
                "x-csrf-token" : oModel.oHeaders["x-csrf-token"]
            }
        };
        OData.request(requestOptions, function(data, request) {
            // TO-DO : make this generic
            status = data.Status;
        }, function(error) {
            if(error.response.statusCode == 205){
                var eventParams = {statusCode : error.response.statusCode, statusText : error.response.statusText};
                oModel.fireRequestFailed(eventParams);
            }else{
            //TODO: use enums for messageType.
            	
                that.showMessage("error", that._oBundle.getText("INBOX_MSG_ERR_EXUI") +" "+ id);
            }
        });
        return status;
    };
    this.searchCallBack = "";
    this.dynamicTaskTypeFilterCallBack = "";
    this.getTaskExecutionURLCallBack = this.getDefaultTaskExecutionURLCallBack;
    
    this.lastRefreshedOnDateTime = new Date();
    
    //Inbox creation starts
    this.vLayout = this.createInboxUI();
    this.vLayout.setParent(this);
    this.addAndRemoveSubstDropDowns();
    this.constants = sap.uiext.inbox.InboxConstants;
    this.lastRefreshedOnDateTime = new Date();
    this.bCustomAttributesVisible= false;
};

sap.uiext.inbox.Inbox.prototype.exit = function() {
	this.vLayout.destroy();
	this.vLayout = null;
	
	function remove(id) {
		  var oItem = sap.ui.getCore().byId(id);
		  oItem && oItem.destroy();
	}
	remove(this.getId() + '--' + "dropdownCell1");
	remove(this.getId() + '--' + "dropdownCell2");
	remove(this.getId() + '--' + "dropdownCell3");
	remove(this.getId() + '--' + "manageSubstitutionMI");
	remove(this.getId() + '--' + "rrMainMatrixLayout");
	remove(this.getId() + '--' + "separatorRRViewCell");
	if(this.oCustomActionToolPopup){
		remove(this.oCustomActionToolPopup.getId());
	}
	if(this.oCustomActionToolPopupCommentsMand){
		remove(this.oCustomActionToolPopupCommentsMand.getId());
	}
	
	this._oBundle = undefined;
	delete this.oCustomActionToolPopup;
	delete this.oCustomActionToolPopupCommentsMand;
};

sap.uiext.inbox.Inbox.prototype.createAttributes = function(oAttData, oParent) {
    var that = this;
    if (oAttData.name === "INBOX_FILTER_CATEGORY") {
    	var oAtt = new sap.uiext.inbox.InboxTaskCategoryFilterList(this.getId()+'--'+oAttData.name);
    	oAtt.setSelectedKeys(["INBOX_FILTER_CATEGORY_TASKS"]);
    } else {
    	var oAtt = new sap.ui.ux3.FacetFilterList(this.getId()+'--'+oAttData.name);
    }
    
    oAtt.setTitle(this._oBundle.getText(oAttData.name));
    // oAtt.setAdditionalData({data: (oAttData.name+" (ID: "+oAtt.getId()+")")});
    for(var idx = 0; idx < oAttData.attributes.length; idx++){
        if(typeof oAttData.attributes[idx] == "string" || oAttData.attributes[idx].key != undefined){
            var attributeID;
            var oAttribute;
            if(oAttData.attributes[idx].key != undefined){
            	var attributeMetaData = oAttData.attributes[idx];
                attributeID = that.inboxUtils.scrub(attributeMetaData.key);
                oAttribute = new sap.ui.core.ListItem(this.getId() +'--'+ attributeID, {text : oAttData.attributes[idx].value, key:oAttData.attributes[idx].key});
                if(attributeMetaData.sap__Origin){
                	oAttribute.data("SAP__Origin",attributeMetaData.sap__Origin);
                }
                if(attributeMetaData.instanceID){
                	oAttribute.data("InstanceID",attributeMetaData.instanceID);
                }

            }else{
                attributeID = that.inboxUtils.scrub(oAttData.attributes[idx]);
                oAttribute = new sap.ui.core.ListItem(this.getId() +'--'+ attributeID, {text : this._oBundle.getText(oAttData.attributes[idx]), key:attributeID});

            }
            oAtt.addItem(oAttribute);
        }else{
            that.createAttributes(oAttData.attributes[idx], oAtt);
        }
    }
    oParent.addList(oAtt);

};

sap.uiext.inbox.Inbox.prototype.toggleFilterView = function(oEvent, oInbox) {
    var that = oInbox;
    var oFacet = sap.ui.getCore().byId(that.getId()+'--'+"filterFacet");
    that.showBusyLoader();
    if(oFacet === undefined){
        oFacet = new sap.ui.ux3.FacetFilter(that.getId()+'--'+"filterFacet"); 
        
        var aFilterLists = that.applyTaskCategoryFilter ? that.constants.aDrillDownFilterMetadata : 
        	that.bShowNoDueDateFilter ? that.constants.aFilterMetaDataWithNoDueDate : that.constants.aFilterMetaData;

        for(var idx=0;idx < aFilterLists.length; idx++){
        		that.createAttributes(aFilterLists[idx], oFacet);
        }
        var verticalLayout = sap.ui.getCore().byId(that.getId()+'--'+"verticalLayoutContainer");
        verticalLayout.insertContent(oFacet, 1);
        var list = oFacet.getLists();
        for(var i=0; i<list.length; i++) {
            if(list[i].getId()===that.getId()+'--'+"INBOX_FILTER_PRIORITY"){
                list[i].attachSelect(that,that.applyDrillDownFilterForPriority);
            } else if(list[i].getId()===that.getId()+'--'+"INBOX_FILTER_STATUS") {
                list[i].attachSelect(that,that.applyDrillDownFilterForStatus);
            } else if(list[i].getId()===that.getId()+'--'+"INBOX_FILTER_CREATION_DATE"){
                list[i].setMultiSelect(false);
                list[i].attachSelect(that,that.applyDrillDownFilterForDateTime);
            } else if(list[i].getId()===that.getId()+'--'+"INBOX_FILTER_TASK_TYPE"){
                list[i].attachSelect(that,that.applyDrillDownFilterForTaskType);
            } else if(list[i].getId()===that.getId()+'--'+"INBOX_FILTER_DUE_DATETIME"){
                list[i].setMultiSelect(false);
                list[i].attachSelect(that,that.applyDrillDownFilterForDueDate);
            } else if(list[i].getId()===that.getId()+'--'+"INBOX_FILTER_CATEGORY"){
                list[i].setMultiSelect(false);
                list[i].attachSelect(that,that.applyDrillDownFilterForTaskCategory);
            }
    }
    }

    var statusAttr = sap.ui.getCore().byId(that.getId()+'--'+"INBOX_FILTER_STATUS");            
    if(sap.ui.getCore().byId(that.getId()+'--'+"filterComboBox2").getSelectedItemId() === that.getId()+'--'+"li_completedTasks"){
        if(statusAttr != undefined ){
            oFacet.removeList(statusAttr);
        }
    if (oFilterDateTime !== undefined) {
      oFacet.removeList(oFilterDateTime);
    }

    }
    var oFilterDateTime = sap.ui.getCore().byId(that.getId()+'--'+"INBOX_FILTER_CREATION_DATE");
    var oFilterDueDateTime = sap.ui.getCore().byId(that.getId()+'--'+"INBOX_FILTER_DUE_DATETIME");
    var sSelectedItemId = sap.ui.getCore().byId(that.getId()+'--'+"filterComboBox2").getSelectedItemId();
    if(sSelectedItemId === that.getId()+'--'+"li_overdueTasks" || sSelectedItemId === that.getId()+'--'+"li_escalatedTasks" ){
        if(oFilterDateTime !== undefined && oFacet.indexOfList(oFilterDateTime) !== -1 ){
            oFacet.removeList(oFilterDateTime);
        }
        if(oFilterDueDateTime !== undefined && oFacet.indexOfList(oFilterDueDateTime) !== -1){
            oFacet.removeList(oFilterDueDateTime);
     }

    }
    
    /*
     * if (sSelectedItemId === that.getId() + '--' + "li_overdueTasks" || sSelectedItemId === that.getId() + '--' +
     * "li_escalatedTasks") { if (oFilterDateTime != undefined && oFilterDateTime.getSelected() === true) {
     * oFilterDateTime.setSelected(false); } }
     */

    var oFilterToggleBtn = that._getComponent("filterViewButton");
    oFacet.setVisible(oFilterToggleBtn.getPressed());
    //}
    /*if(filterImg.getIcon() === that._imgResourcePath+sap.uiext.inbox.InboxConstants.filterViewImageUnSelected){
        // filterImg.setStyle(sap.ui.commons.ButtonStyle.Emph);
        filterImg.setIcon(that._imgResourcePath+sap.uiext.inbox.InboxConstants.filterViewImageSelected);
        oFacet.setVisible(true);
    }else{
        filterImg.setIcon(that._imgResourcePath+sap.uiext.inbox.InboxConstants.filterViewImageUnSelected);
        // filterImg.setStyle(sap.ui.commons.ButtonStyle.Default);
        oFacet.setVisible(false);
        // oController.resetFilterView();
    }*/
    //that.resetSearchCriteria();
    that.hideBusyLoader();
};

sap.uiext.inbox.Inbox.prototype.populateFilterButtonContainer = function(filterButtonContainer) {
    var filterViewCell = new sap.ui.commons.layout.MatrixLayoutCell({
        id : this.getId() + '--' + "filterButtonCell"
    });
    var selected = false;

    var filterViewButton = new sap.ui.commons.ToggleButton(this.getId() + '--' + "filterViewButton", {
        icon : sap.uiext.inbox.InboxConstants.filterViewImage,
        pressed : false,
        tooltip : this._oBundle.getText("INBOX_BUTTON_FILTER_VIEW_TOOLTIP")
    });
    filterViewButton.attachPress(this, this.toggleFilterView);
    filterViewButton.addStyleClass("sapUiExtInboxToolBarContainerHeight");
    filterViewCell.addContent(filterViewButton);
    filterViewCell.setPadding(sap.ui.commons.layout.Padding.None);
    filterButtonContainer.createRow(filterViewCell);
};
/*
sap.uiext.inbox.Inbox.prototype.populateDropDownContainer = function(dropDownContainer) {
    var dropdownCell = new sap.ui.commons.layout.MatrixLayoutCell(this.getId() + '--' + "dropdownCell2");
    dropdownCell.setPadding(sap.ui.commons.layout.Padding.None);
    var dropdownComboBox = new sap.ui.commons.DropdownBox(this.getId() + '--' + "filterComboBox2", {
        tooltip : this._oBundle.getText("INBOX_TASKS_FILTER_DROPDOWN_TOOLTIP"),
        items : [new sap.ui.core.ListItem(this.getId() + '--' + "li_openTasks", {
            text : this._oBundle.getText("INBOX_DROP_DOWN_VALUE_MY_OPEN_TASKS")
        }), new sap.ui.core.ListItem(this.getId() + '--' + "li_completedTasks", {
            text : this._oBundle.getText("INBOX_DROP_DOWN_VALUE_MY_COMPLETED_TASKS")
        }), new sap.ui.core.ListItem(this.getId() + '--' + "li_overdueTasks", {
            text : this._oBundle.getText("INBOX_DROP_DOWN_VALUE_MY_OVERDUE_TASKS")
        }), new sap.ui.core.ListItem(this.getId() + '--' + "li_escalatedTasks", {
            text : this._oBundle.getText("INBOX_DROP_DOWN_VALUE_MY_ESCALATED_TASKS")
        })]
    });
    dropdownComboBox.attachChange(this, this.applyDropDownFilter);
    dropdownComboBox.setValue(this._oBundle.getText("INBOX_DROP_DOWN_VALUE_MY_OPEN_TASKS"));
    dropdownComboBox.addStyleClass("sapUiExtInboxToolBarContainerHeight");
    dropdownComboBox.addStyleClass("sapUiExtInboxComboBox");
    dropdownCell.addContent(dropdownComboBox);
    dropDownContainer.createRow(dropdownCell);
};*/

sap.uiext.inbox.Inbox.prototype.addAndRemoveSubstDropDowns = function() {
	var dropDownRow = sap.ui.getCore().byId(this.getId() + '--' + "dropdownRow");
	var dropdowncell1 = sap.ui.getCore().byId(this.getId() + '--' + "dropdownCell1");
	var dropdowncell2 = sap.ui.getCore().byId(this.getId() + '--' + "dropdownCell2");
	var dropdowncell3 = sap.ui.getCore().byId(this.getId() + '--' + "dropdownCell3");
	var oManageSubstMenuItemInTable = sap.ui.getCore().byId(this.getId() + '--' + "manageSubstitutionMI");
	var oManageSubstMenuItemInStream = sap.ui.getCore().byId(this.getId() + '--' + "rrManageSubstitutionMI");

	if(this.getSubstitutionEnabled()) { //Do not add this combo box if substitution is disabled 
			dropDownRow.addCell(dropdowncell1);
			dropDownRow.addCell(dropdowncell2);
			dropDownRow.addCell(dropdowncell3);

		} else {
			if(dropDownRow != undefined) {
			dropDownRow.removeCell(dropdowncell1);
			dropDownRow.removeCell(dropdowncell3);
			}
		
		}
	var rrSettingsButton = sap.ui.getCore().byId(this.getId() + '--' + "rrSettingsButton");
	var tableSettingsButton = sap.ui.getCore().byId(this.getId() + '--' + "settingsButton");
	this._manageVisibilityOfSettingsButton(rrSettingsButton);
	this._manageVisibilityOfSettingsButton(tableSettingsButton);
};

sap.uiext.inbox.Inbox.prototype.populateDropDownContainer = function(dropDownContainer) {
    var dropdownRow = new sap.ui.commons.layout.MatrixLayoutRow(this.getId() + '--' + "dropdownRow");
    
    var dropdownCell1 = new sap.ui.commons.layout.MatrixLayoutCell(this.getId() + '--' + "dropdownCell1");
    dropdownCell1.setPadding(sap.ui.commons.layout.Padding.None);
    //if(this.getSubstitutionEnabled()) { //Do not add this combo box if substitution is disabled 
    var dropdownComboBox1 = new sap.ui.commons.DropdownBox(this.getId() + '--' + "filterComboBox1", {
        tooltip : this._oBundle.getText("INBOX_TASKS_FILTER_DROPDOWN_TOOLTIP"),
        items : [new sap.ui.core.ListItem(this.getId() + '--' + "li_allTasks", {
            text : this._oBundle.getText("INBOX_DROP_DOWN_VALUE_ALL_TASKS")
        }), new sap.ui.core.ListItem(this.getId() + '--' + "li_myTasks", {
            text : this._oBundle.getText("INBOX_MY_TASKS_TEXT")
        }), new sap.ui.core.ListItem(this.getId() + '--' + "li_substitutedTasks", {
            text : this._oBundle.getText("SUBSTITUTION_INBOX_DROP_DOWN_VALUE_TASKS_ASSIGNED_TO_ME")
        })]
    });
    dropdownComboBox1.attachChange(this, this.applyDropDownFilter1);
    dropdownComboBox1.setValue(this._oBundle.getText("INBOX_DROP_DOWN_VALUE_ALL_TASKS"));
    dropdownComboBox1.addStyleClass("sapUiExtInboxToolBarContainerHeight");
    dropdownComboBox1.addStyleClass("sapUiExtInboxComboBox");
    
    dropdownCell1.addContent(dropdownComboBox1);
    dropdownRow.addCell(dropdownCell1);
    //}
    /***/
    var dropdownCell2 = new sap.ui.commons.layout.MatrixLayoutCell(this.getId() + '--' + "dropdownCell2");
    dropdownCell2.setPadding(sap.ui.commons.layout.Padding.None);
    var dropdownComboBox2 = new sap.ui.commons.DropdownBox(this.getId() + '--' + "filterComboBox2", {
        tooltip : this._oBundle.getText("INBOX_TASKS_FILTER_DROPDOWN_TOOLTIP"),
        items : [new sap.ui.core.ListItem(this.getId() + '--' + "li_openTasks", {
            text : this._oBundle.getText("INBOX_DROP_DOWN_VALUE_OPEN_TASKS")
        }), new sap.ui.core.ListItem(this.getId() + '--' + "li_completedTasks", {
            text : this._oBundle.getText("INBOX_DROP_DOWN_VALUE_COMPLETED_TASKS")
        }), new sap.ui.core.ListItem(this.getId() + '--' + "li_overdueTasks", {
            text : this._oBundle.getText("INBOX_DROP_DOWN_VALUE_OVERDUE_TASKS")
        }), new sap.ui.core.ListItem(this.getId() + '--' + "li_escalatedTasks", {
            text : this._oBundle.getText("INBOX_DROP_DOWN_VALUE_ESCALATED_TASKS")
        })]
    });
    dropdownComboBox2.attachChange(this, this.applyDropDownFilter);
    dropdownComboBox2.setValue(this._oBundle.getText("INBOX_DROP_DOWN_VALUE_OPEN_TASKS"));
    dropdownComboBox2.addStyleClass("sapUiExtInboxToolBarContainerHeight");
    dropdownComboBox2.addStyleClass("sapUiExtInboxComboBox");
    dropdownCell2.addContent(dropdownComboBox2);
    dropdownRow.addCell(dropdownCell2);
    /***/
    //if(this.getSubstitutionEnabled()) {   //Do not add this combo box if substitution is disabled
    var dropdownCell3 = new sap.ui.commons.layout.MatrixLayoutCell(this.getId() + '--' + "dropdownCell3");
    dropdownCell3.setPadding(sap.ui.commons.layout.Padding.None);
    var dropdownComboBox3 = new sap.ui.commons.DropdownBox(this.getId() + '--' + "filterComboBox3",{maxPopupItems:10});/*, {
        tooltip : this._oBundle.getText("INBOX_TASKS_FILTER_DROPDOWN_TOOLTIP"),
        items : [new sap.ui.core.ListItem(this.getId() + '--' + "li_allUsers", {
            text : this._oBundle.getText("INBOX_DROP_DOWN_VALUE_ALL_USERS")
        })]

    });*/
    
    var onBehalfOf = '';
    if(sap.ui.getCore().byId(this.getId() + '--' + 'onBehalfOfListItem') === undefined) {
        var onBehalfOf = new sap.ui.core.ListItem(this.getId() + '--' + 'onBehalfOfListItem');
    }
    onBehalfOf.setText(this._oBundle.getText("SUBSTITUTION_INBOX_FILTER_ON_BEHALF_OF"));
    onBehalfOf.setKey("onBehalfOf");
    
    dropdownComboBox3.addItem(onBehalfOf);

    var allUsers = '';
    if(sap.ui.getCore().byId(this.getId() + '--' + 'li_allUsers') === undefined) {
        allUsers = new sap.ui.core.ListItem(this.getId() + '--' + 'li_allUsers');
    }   
    allUsers.setText(this._oBundle.getText("INBOX_DROP_DOWN_VALUE_ALL_USERS"));
    allUsers.setKey("allUsers");
    
    dropdownComboBox3.addItem(allUsers);

    dropdownComboBox3.attachChange(this, this.applyDropDownFilter3);
    dropdownComboBox3.setValue(this._oBundle.getText("SUBSTITUTION_INBOX_FILTER_ON_BEHALF_OF"));
    dropdownComboBox3.addStyleClass("sapUiExtInboxToolBarContainerHeight");
    dropdownComboBox3.addStyleClass("sapUiExtInboxComboBox");
    dropdownComboBox3.setEnabled(false);
    dropdownCell3.addContent(dropdownComboBox3);
    dropdownRow.addCell(dropdownCell3);
    //}

    dropDownContainer.addRow(dropdownRow);
    this.addAndRemoveSubstDropDowns();
};

// Populating the Search Bar.
sap.uiext.inbox.Inbox.prototype.populateSearchFieldContainer = function(searchFieldContainer) {

    var searchBoxCell = new sap.ui.commons.layout.MatrixLayoutCell(this.getId() + '--' + "searchBoxCell");
    searchBoxCell.setPadding(sap.ui.commons.layout.Padding.None);
    // create a simple SearchField
    var searchField = new sap.ui.commons.SearchField(this.getId() + '--' + "searchField", {
        enableListSuggest : false,
        enableClear : true,
        startSuggestion : 0,
        tooltip : this._oBundle.getText("INBOX_SEARCH_TEXT")
    });
    searchField.addStyleClass("sapUiExtInboxSearchField");
    searchField.attachSuggest(this, function(oEvent, that) {
        if (oEvent.getParameter("value") === "") {
            that.resetSearchCriteria();
            that.applyFilterOnResponse(null);
        }
    });
    searchField.attachSearch(this, this.localSearch);
    searchBoxCell.addContent(searchField);
    searchFieldContainer.createRow(searchBoxCell);
};

sap.uiext.inbox.Inbox.prototype.populateNotificationBar = function() {
	
	
	var oNotificationBar = new sap.ui.ux3.NotificationBar({
		id: this.getId() + '--' + "notificationBar",
		visibleStatus: "None"
	});
	
    var oMessageNotifier = new sap.ui.ux3.Notifier ({
		id: this.getId() + '--' + "messageNotifier",
		title: this._oBundle.getText("INBOX_NOTIFICATIONS"),

    	// This workaround is added, because NotificationBar does not support auto focus for accessability (1/2)
    	// For more details check Internal Incident 1580169447: ACC 264 : NW750_SP00_I/O_BPM : Text : Notification text not being read out
		messageSelected: function onMessageSelected(event) {

		}
		
	});
	
	oNotificationBar.setMessageNotifier(oMessageNotifier);
	oNotificationBar.addStyleClass("sapUiExtInboxNotificationBar");
	return oNotificationBar;
};

sap.uiext.inbox.Inbox.prototype.populateToolBar = function() {
    var toolBarContainer = new sap.ui.commons.layout.MatrixLayout(this.getId() + '--' + "toolbarContainer", {
        layoutFixed : false,
        width : "100%",
        columns : 6,
        // other widths except empty label does not matter, rest of the space will be now filled with empty Label snippix #293
        //older %'s are: ["2%","10%","1%","12%","50%", "11%"] (not good in big screen) 
        widths : ["1px","1px","1px","1px","100%", "1px"] 
    });
   
    var viewButtonsContainer = new sap.ui.commons.layout.MatrixLayout(this.getId() + '--' + "viewButtonsContainer", {
      layoutFixed : false
    });
    
    var filterButtonContainer = new sap.ui.commons.layout.MatrixLayout(this.getId() + '--' + "filterButtonContainer", {
        layoutFixed : false
    });
    
    var refreshButtonContainer = new sap.ui.commons.layout.MatrixLayout(this.getId() + '--' + "refreshButtonContainer", {
      layoutFixed : false
    });
    
    var dropDownContainer = new sap.ui.commons.layout.MatrixLayout(this.getId() + '--' + "dropDownContainer", {
        layoutFixed : false
    });
    var emptyLabel = new sap.ui.commons.Label(this.getId() + '--' + "emptyLabel", {
        text : ""
    });
    var searchFieldContainer = new sap.ui.commons.layout.MatrixLayout(this.getId() + '--' + "searchFieldContainer", {
        layoutFixed : false
    });

    toolBarContainer.createRow(viewButtonsContainer, dropDownContainer, filterButtonContainer, refreshButtonContainer, emptyLabel, searchFieldContainer);

    this.populateViewButtonsContainer(viewButtonsContainer);
    this.populateDropDownContainer(dropDownContainer);
    this.populateFilterButtonContainer(filterButtonContainer);
    this.populateRefreshButtonContainer(refreshButtonContainer);
    this.populateSearchFieldContainer(searchFieldContainer);

    return toolBarContainer;
};

sap.uiext.inbox.Inbox.prototype.populateViews = function() {
    var that = this;
    var verticalLayout = sap.ui.getCore().byId(this.getId() + '--' + 'verticalLayoutContainer');
    var actionButtonsToolBar = new sap.ui.commons.Toolbar(this.getId() + '--' + "actionButtonsToolbarContainer");
    actionButtonsToolBar.setDesign(sap.ui.commons.ToolbarDesign.Standard);
    actionButtonsToolBar.addStyleClass("sapUiExtInboxActionButtonsToolbarContainer");

    if (sap.ui.getCore().byId(this.getId() + '--' + 'openActionButton') === undefined) {
        var completeButton = new sap.ui.commons.Button(this.getId() + '--' + "openActionButton", {
            icon : this.constants.iconPool.getIconURI("open-folder"),
            text : this._oBundle.getText("INBOX_ACTION_BUTTON_OPEN"),
            enabled : false,
            tooltip : this._oBundle.getText("INBOX_ACTION_BUTTON_OPEN")
        });
        completeButton.attachPress(this, function(oEvent, view) {
            that.showBusyLoader();
            that.populateTaskExecutionContent();
            that.hideBusyLoader();
        });
        actionButtonsToolBar.addItem(completeButton);
    }
    if (sap.ui.getCore().byId(this.getId() + '--' + 'claimActionButton') === undefined) {
        var claimButton = new sap.ui.commons.Button(this.getId() + '--' + "claimActionButton", {
            icon : this.constants.iconPool.getIconURI("locked"),
            text : this._oBundle.getText("INBOX_ACTION_BUTTON_CLAIM"),
            enabled : false,
            tooltip : this._oBundle.getText("INBOX_ACTION_BUTTON_CLAIM"),
            visible : false
        });
        claimButton.attachPress({inbox:that,view:that.constants.tableView,action:"Claim"}, that.executeActionOnTask);
        claimButton.setVisible(false);
        actionButtonsToolBar.addItem(claimButton);
    }
    if (sap.ui.getCore().byId(this.getId() + '--' + 'releaseActionButton') === undefined) {
        var releaseButton = new sap.ui.commons.Button(this.getId() + '--' + "releaseActionButton", {
            icon : this.constants.iconPool.getIconURI("unlocked"),
            text : this._oBundle.getText("INBOX_ACTION_BUTTON_RELEASE"),
            enabled : false,
            tooltip : this._oBundle.getText("INBOX_ACTION_BUTTON_RELEASE"),
            visible : false
        });
        releaseButton.attachPress({inbox:that,view:that.constants.tableView,action:"Release"}, that.executeActionOnTask);
        releaseButton.setVisible(false);
        actionButtonsToolBar.addItem(releaseButton);
    }
    if (sap.ui.getCore().byId(this.getId() + '--' + 'forwardActionButton') === undefined) {
    	var forwardButton = new sap.ui.commons.Button(this.getId() + '--' + "forwardActionButton", {
            icon : this.constants.iconPool.getIconURI("open-command-field"),
    		text : this._oBundle.getText("INBOX_ACTION_BUTTON_FORWARD"),
    		enabled : false,
    		tooltip : this._oBundle.getText("INBOX_ACTION_BUTTON_FORWARD"),
    		visible : false //TODO: Do we show it or hide it ? 
    	});
    	forwardButton.attachPress({inbox:that,view:that.constants.tableView,action:"Forward"}, that._executeForwardAction);
    	actionButtonsToolBar.addItem(forwardButton);
    }
 /*   if (sap.ui.getCore().byId(this.getId() + '--' + 'refreshButton') === undefined) {
        var seprtr = new sap.ui.commons.ToolbarSeparator();
        actionButtonsToolBar.addItem(seprtr);

        var refreshButton = new sap.ui.commons.Image(this.getId() + '--' + "refreshButton", {
            tooltip : this._oBundle.getText("INBOX_REFRESH_BUTTON_TOOLTIP"),
            decorative : false
        });
        refreshButton.setSrc(this._imgResourcePath + sap.uiext.inbox.InboxConstants.refreshImage);
        refreshButton.attachPress(that, that.refreshTaskList);
        refreshButton.addStyleClass("sapUiExtInboxRefreshButtonHeight");
        actionButtonsToolBar.addItem(refreshButton);

        var refreshLink = new sap.ui.commons.Link(this.getId() + '--' + "refreshLink", {
            text : this._oBundle.getText("INBOX_REFRESH_TEXT"),
            tooltip : this._oBundle.getText("INBOX_REFRESH_BUTTON_TOOLTIP")
        });
        refreshLink.attachPress(that, that.refreshTaskList);
        actionButtonsToolBar.addItem(refreshLink);

    }*/
    if (sap.ui.getCore().byId(this.getId() + '--' + 'settingsButton') === undefined) {
        var settingsButton = new sap.ui.commons.Button(this.getId() + '--' + "settingsButton", {
            tooltip : this._oBundle.getText("INBOX_MANAGE_SUBSTITUTION_RULES_TOOLTIP"),
            icon : this.constants.iconPool.getIconURI("workflow-tasks"),
            iconHovered: this._imgResourcePath + sap.uiext.inbox.InboxConstants.settingsImageHover,
            iconSelected: this._imgResourcePath + sap.uiext.inbox.InboxConstants.settingsImageHover,	
            lite : true
        });
        settingsButton.addStyleClass("sapUiExtInboxToolbarRight");
        settingsButton.addStyleClass("sapUiExtInboxSettingsButton");
        settingsButton.attachPress(that, that.onSubstitutionButtonPress);
        actionButtonsToolBar.addItem(settingsButton);
    }
    verticalLayout.addContent(actionButtonsToolBar);

    // START TABLE
    if (that._getComponent('listViewTable') === undefined) {
        var oTable = new sap.ui.table.Table(that.getId() + '--' + "listViewTable",{
        	//navigationMode : sap.ui.table.NavigationMode.Paginator
        });
    oTable.attachFilter( function(oEvent) {
    	oEvent.preventDefault(); // preventing oData call for filtering
    	var oColumn = oEvent.getParameter("column");
    	var sValue = oEvent.getParameter("value");
    	that._applyFilterOnTableColumns(oColumn, sValue); 

    	//Preserve sorting (custom attributes)
       	that._preserveTableSort();
    });
    
    	oTable.setThreshold(10000);
        oTable.addStyleClass("sapUiExtInboxCustomTable");
       // oTable.setThreshold(10000);
        oTable.setEditable(false);
        oTable.bDynamic = true;
        oTable.setBusyIndicatorDelay(0);
        var inboxCategoryMetadata = that._getCategoryMetadata();
        var entitiesLength = inboxCategoryMetadata.properties.length;
        
        
        for ( var index = 0; index < entitiesLength; index++) {
        	that._createTableColumnContent(index, inboxCategoryMetadata);
        }
        
        // code to capture sort event and reset search
        /*
         * oTable.addDelegate({ onAfterRendering : function() { var oTable$ = oTable.$(); var cols =
         * oTable$.find(".sapUiTableCol").get(); for ( var i = 0; i < cols.length; i++) { if
         * (cols[i].attributes['aria-sort']) { var sortValue = cols[i].attributes['aria-sort'].value; if (sortValue ===
         * "ascending" || sortValue === "descending") that.resetSearchCriteria(); } } } });
         */
        that.bSorted = false;
        oTable.attachSort(function(oEvent) {
        	var oColumn = oEvent.getParameter("column");
        	if(that._isCustomAttribute(oColumn)){
        		//preventing oData call for sorting
        		oEvent.preventDefault();

        		//Get meta data
     			var attributeName = oColumn.data("customAttrName");
     			var attributeType = null;
     			var sortDirection = null;

        		//Custom attributes meta data
     			var constants = that.constants;
        		var oCustomAttributeMetaDataArrayMap = constants.oTaskDefinitionCustomAttributesMap;

        		//Selected attribute type
        		var oTaskTypefilterList = that._getComponent("INBOX_FILTER_TASK_TYPE");
        	   	var aSelectedKeys = oTaskTypefilterList.getSelectedKeys();
        		if(aSelectedKeys){
        			var key = aSelectedKeys[0];
        			var taskTypeMeta = oCustomAttributeMetaDataArrayMap[key];
        			if(taskTypeMeta){
        				for(var i=0; i<taskTypeMeta.length; i++){
            				var attributeMeta = taskTypeMeta[i];
            				if(attributeMeta.Name == attributeName){
            					var attributeType = attributeMeta.Type;
            					break;
            				}
        				}
        			}
        		}

        		//Sort direction
        		if(attributeType){
        			sortDirection = oEvent.getParameter("sortOrder"); //Descending, Ascending
        		}

        		that._applySortOnTableColumn(oColumn, attributeName, attributeType, sortDirection);
        	}
        	else{
	        	//need to reset the length of listBinding if sorting has to work with column filters
	        	var currentViewElement = that._currentViewElement();
	        	if (currentViewElement._originalKeys) {
	        		var oListBinding = currentViewElement.getBinding('rows');
	        		oListBinding.iLength = currentViewElement._originalKeys.length;
	        	}
	        	// this variable below will be used to change _originalKeys of table in oData's requestCompleted event handler
	        	that.bSorted = true;
	        	that.resetSearchCriteria();
        	}

        });
        oTable.attachRowSelectionChange(function(oEvent) {
        	that._handleTableRowSelect(oEvent);
        	});
        oTable.clearSelection();
    }
    verticalLayout.addContent(oTable);
    verticalLayout.addContent(that.createTableRowSettingsContent());
   //Creating but will be hidden.
  	that.createRowRepeaterView();
  	
};

sap.uiext.inbox.Inbox.prototype.addAction = function(sActionID, sDisplayText, sToolTip, fnActionHandler,  bMassEnabled){
    var iTotalArgumentsRequired = 4;
	if(bMassEnabled === undefined){
            bMassEnabled = true;
    }     

    if(sActionID && sDisplayText && fnActionHandler  && sToolTip){        

            var oActionButtonsToolBar = this._getActionButtonToolBarForTableView();
            
            var oActionButton = new sap.ui.commons.Button(this.getId() + '--' + sActionID , {

                        text : sDisplayText,

                        enabled : true,

                        tooltip :  sToolTip

                    }).attachPress(fnActionHandler);

            oActionButtonsToolBar.insertItem(oActionButton,100);
            
    } else {
    	 if (arguments.length < iTotalArgumentsRequired) {
    		 console.error("Add Action failed: missing parameters");
    	 }
    }

    return this;

};

sap.uiext.inbox.Inbox.prototype._handleTableRowSelect = function(oEvent) {
    var oDataModel = this.getCoreModel();
    var that = this;
    var selectedStatus = [], aSelectedSAPOrigin = [];
    var selectedTaskDefinitionID = [];
    var selectedInstanceID = [];
    var oListTable = this._getComponent('listViewTable');
    var selectedIndices = oListTable.getSelectedIndices();
    var mParameters = oEvent.getParameters();
				var oSupportsAction = {
    		aSupportsClaim:[],
    		aSupportsRelease:[],
    		aSupportsForward:[]
    };
    jQuery.each(selectedIndices, function(i, selIndex) {
        var rowContext = oListTable.getContextByIndex(selIndex);
        selectedStatus.push(oDataModel.getProperty("Status", rowContext));
        var taskDefnID = oDataModel.getProperty(that.constants.TaskDefinitionCollection.properties.taskDefnID, rowContext);
        var sSapOrigin = oDataModel.getProperty(that.constants.sapOrigin, rowContext);
        if(jQuery.inArray(taskDefnID,selectedTaskDefinitionID) === -1){
        	selectedTaskDefinitionID.push(oDataModel.getProperty(that.constants.TaskDefinitionCollection.properties.taskDefnID, rowContext));
        }
        if(jQuery.inArray(sSapOrigin,aSelectedSAPOrigin) === -1){
        	aSelectedSAPOrigin.push(sSapOrigin);
        }
        selectedInstanceID.push(oDataModel.getProperty(that.constants.InstanceID, rowContext));
        oSupportsAction.aSupportsClaim.push(oDataModel.getProperty("SupportsClaim", rowContext));
        oSupportsAction.aSupportsRelease.push(oDataModel.getProperty("SupportsRelease", rowContext));
        if(that.isForwardActionEnabled){
        	oSupportsAction.aSupportsForward.push(oDataModel.getProperty("SupportsForward", rowContext));
    	}
    });
    this.disableActionButtonsOnMultiStatus(selectedStatus, oSupportsAction, aSelectedSAPOrigin);
    if(this.isCustomActionsEnabled){
    	this._deleteCustomActionsForTableView();
    	var isCompletedTasksSelectedinDD =  this._isCompletedTasksSelected();
    	if(selectedTaskDefinitionID && selectedTaskDefinitionID.length === 1 && !isCompletedTasksSelectedinDD){
    		this._createCustomActionsOnTableRowSelect(selectedInstanceID, aSelectedSAPOrigin);
    	}
    }
    this._handleForwardButtonVisibilityOnRowSelection(aSelectedSAPOrigin, oSupportsAction);  
    
    //TODO : Can be moved to the jQuery.each above?
    var aTaskUniqueIdentifiers = [];
    jQuery.each(selectedIndices, function(i, selIndex) {
    	var rowContext = oListTable.getContextByIndex(selIndex);
    	var sTaskInstanceID = oDataModel.getProperty(that.constants.InstanceID, rowContext);
    	var sSap__Origin = oDataModel.getProperty(that.constants.sapOrigin, rowContext);
    	var oTaskUniqueIdentifier = {};
    	oTaskUniqueIdentifier["InstanceID"] = sTaskInstanceID;
    	oTaskUniqueIdentifier["SAP__Origin"] = sSap__Origin;
    	aTaskUniqueIdentifiers.push(oTaskUniqueIdentifier);
    });
	
	
	this.fireTaskSelectionChange({"taskUniqueIdentifiers" : aTaskUniqueIdentifiers});    
};

sap.uiext.inbox.Inbox.prototype._createCustomActionsOnTableRowSelect = function(selectedInstanceIDs, aSelectedSAPOrigin) {
	this._getCustomActionsDefinitionOnMultiSelect(selectedInstanceIDs, aSelectedSAPOrigin[0]);
};

sap.uiext.inbox.Inbox.prototype._getCustomActionsDefinitionOnMultiSelect = function(selectedInstanceIDs, sSelectedSAPOrigin) {
	var aCustomActionArrayMap = sap.uiext.inbox.InboxConstants.taskInstanceDecisionOptionsMap;
	var selectedInstanceLength = selectedInstanceIDs.length;
	var aAvailableCustomActionArrayList = [], aCustomActions, aFetchCustomActionsFor = [];
	for (var i=0; i<selectedInstanceLength ;i++){
		aCustomActions = aCustomActionArrayMap[selectedInstanceIDs[i]];
		if(aCustomActions){
			aAvailableCustomActionArrayList.push(aCustomActions);
		}else{
			aFetchCustomActionsFor.push(selectedInstanceIDs[i]);
		}
	}
	var iFetchCustomActionsFor = aFetchCustomActionsFor.length;
	if(iFetchCustomActionsFor <= 1){
		this._getCustomActionsDefinition(aFetchCustomActionsFor[0], sSelectedSAPOrigin, aAvailableCustomActionArrayList);
	}else{
		this._fetchCustomActionsOnMultiSelect(aAvailableCustomActionArrayList, aFetchCustomActionsFor, sSelectedSAPOrigin);
	}
};

sap.uiext.inbox.Inbox.prototype._fetchCustomActionsOnMultiSelect = function(aAvailableCustomActionArrayList, aFetchCustomActionsFor, sSelectedSAPOrigin) {
	if(this.bUseBatch){
		this._fetchCustomActionsUsingBatch(aAvailableCustomActionArrayList, aFetchCustomActionsFor, sSelectedSAPOrigin);
	}else{
		this._fetchCustomActionsUsingAsyncCall(aFetchCustomActionsFor, sSelectedSAPOrigin, aAvailableCustomActionArrayList);
	}
};

sap.uiext.inbox.Inbox.prototype._fetchCustomActionsUsingBatch = function(aAvailableCustomActionArrayList, aFetchCustomActionsFor, sSelectedSAPOrigin) {
	
	var aUrlParameters = [];
	jQuery.each(aFetchCustomActionsFor, function(i, sInstanceID) {
		var mUrlParams = {};
		mUrlParams.InstanceID = "'" + sInstanceID + "'";
		mUrlParams.SAP__Origin = "'" + sSelectedSAPOrigin  + "'";
		aUrlParameters.push(mUrlParams);
	});
	
    this.oDataManager.fireBatchRequest({
    	sPath : this.constants.decisionOptionsFunctionImport,
    	sMethod : "GET",
    	sBatchGroupId : "fetchDecisionOptions",
    	aUrlParameters : aUrlParameters,
    	numberOfRequests : aFetchCustomActionsFor.length,
    	fnSuccess : jQuery.proxy(this._processCustomActionsBatchResponse, {oInbox: this, 
    		aAvailableCustomActionArrayList: aAvailableCustomActionArrayList, 
    		aFetchCustomActionsFor: aFetchCustomActionsFor }),
    	fnError : jQuery.proxy(this._handleErrorOnBatchRequests, this)
    });
	
};

sap.uiext.inbox.Inbox.prototype._processCustomActionsBatchResponse = function(data, response) {
	
	var batchResponses = data.__batchResponses;
	
	var index = 0;
	jQuery.each(batchResponses, jQuery.proxy(function(i, customActionResponse) {
		if(customActionResponse && customActionResponse.statusCode && customActionResponse.statusCode == 200){
			this.oInbox.constants.taskInstanceDecisionOptionsMap[this.aFetchCustomActionsFor[index++]] = customActionResponse.data.results;
			this.aAvailableCustomActionArrayList.push(customActionResponse.data.results);
		}
	}, this));
	
	this.oInbox._displayCustomActions([], this.aAvailableCustomActionArrayList);
};

sap.uiext.inbox.Inbox.prototype._createTableColumnContent = function(index, inboxCategoryMetadata) {
	var that = this;
	var oTable = this._getComponent('listViewTable');
	if (inboxCategoryMetadata.properties[index] == "TaskTitle") {
  		var oFirstColHorLay = that._getFirstColumnContentTemplate();
  	
  		var oTaskTitleColumn = that._createTableColumn(index, inboxCategoryMetadata, "INBOX_TASK_TITLE_TOOLTIP", oFirstColHorLay)
			     //fixing the Task Title Column width, width cannot be in '%' as setFlexible will not work otherwise. TaskTitle","CreatedOn","CreatedByName","CompletionDeadLine","Status","Priority"
			     oTaskTitleColumn.setWidth("330px");		
			     oTaskTitleColumn.setFlexible(false);
			     oTable.insertColumn(oTaskTitleColumn, index);
  } else if (inboxCategoryMetadata.properties[index] == "CreatedOn") {
  			var oCreatedOnTextView = new sap.ui.commons.TextView({text : {formatter : that.inboxUtils.dateTimeFormat, path : inboxCategoryMetadata.properties[index]} });
  			oCreatedOnTextView.bindProperty("tooltip", inboxCategoryMetadata.properties[index], that.tooltipFormatForDateTime);
									
  			var oCreatedOnColumn = that._createTableColumn(index, inboxCategoryMetadata, "INBOX_START_DATE_TOOLTIP", oCreatedOnTextView);
  			oCreatedOnColumn.setFlexible(true); 
  			oTable.insertColumn(oCreatedOnColumn, index);
	} else if (inboxCategoryMetadata.properties[index] == "CreatedByName") {
				var oCreatedByTextView = new sap.ui.commons.TextView({text : {path : inboxCategoryMetadata.properties[index]}	})
				oCreatedByTextView.bindProperty("tooltip", inboxCategoryMetadata.properties[index]);
		
				var oCreatedByColumn = that._createTableColumn(index, inboxCategoryMetadata, "INBOX_CREATED_BY_NAME_TOOLTIP", oCreatedByTextView);
				oCreatedByColumn.setFlexible(true); 
				oTable.insertColumn(oCreatedByColumn, index);
				
		} else if (inboxCategoryMetadata.properties[index] == "CompletionDeadLine") {
					var oCompletionDealineTextView = new sap.ui.commons.TextView({text : {formatter : that.inboxUtils.dateTimeFormat, path : inboxCategoryMetadata.properties[index]} });
					oCompletionDealineTextView.bindProperty("tooltip", inboxCategoryMetadata.properties[index],	that.tooltipFormatForDateTime);

					var oCompletionDeadlineColumn = that._createTableColumn(index, inboxCategoryMetadata, "INBOX_DUE_DATE_TOOLTIP", oCompletionDealineTextView);
					oCompletionDeadlineColumn.setFlexible(true); 
					oTable.insertColumn(oCompletionDeadlineColumn, index);
		} else if (inboxCategoryMetadata.properties[index] == "Status") {
				var oStatusTextView = new sap.ui.commons.TextView();
    				oStatusTextView.bindText({
    	        parts: [
    	            {path: "Status", type: new sap.ui.model.type.String()},
    	            {path: "StatusText", type: new sap.ui.model.type.String()}
    	            ],
    	        formatter: function(Status, StatusText){ // string, string, float, float
    	        	return that._getTaskStatus(Status, StatusText);
    	        },
    	        useRawValues : true
    				});
				
				var oStatusColumn = that._createTableColumn(index, inboxCategoryMetadata, "INBOX_STATUS_TOOLTIP", oStatusTextView);
				oStatusColumn.setFlexible(true); 
					oTable.insertColumn(oStatusColumn, index);	
		} else if (inboxCategoryMetadata.properties[index] == "Priority") {
				var oPriorityTextView = new sap.ui.commons.TextView();
  				oPriorityTextView.bindProperty("text", "Priority", function(value) {
  					if (value != null && value != "" && value != undefined) {
  						return that._oBundle.getText(that.constants.prioTooltip[value]);
  					}
  					return "";
  				});

				var oPriorityColumn = that._createTableColumn(index, inboxCategoryMetadata, "INBOX_PRIORITY_TOOLTIP", oPriorityTextView);
				oPriorityColumn.setFlexible(true); 
				oTable.insertColumn(oPriorityColumn, index);	
		}
};

sap.uiext.inbox.Inbox.prototype._createTableColumn = function(columnIndex, inboxCategoryMetadata, columnLabelTooltip, columnContent){

	var mProperty = inboxCategoryMetadata.properties[columnIndex];
	var oTableColumn = new sap.ui.table.Column({id : this.getId() + '--' + mProperty}).setLabel(new sap.ui.commons.Label({
																											text : this._oBundle.getText(inboxCategoryMetadata.propertiesLabel[columnIndex]),
																											tooltip : this._oBundle.getText(columnLabelTooltip),
																											design : sap.ui.commons.LabelDesign.Bold})
																											).setTemplate(columnContent)
																												.setSortProperty(mProperty)
																													.data("ColumnType", "StandardAttribute");
	
	// adding filter property to column; status and priority columns are not filterable as we already have them in facet filter list
	var oColumnsProperties = this.constants.TABLE_VIEW_TECH_NAMES;
	if (mProperty !== oColumnsProperties.INBOX_TABLE_VIEW_STATUS && mProperty !== oColumnsProperties.INBOX_TABLE_VIEW_PRIORITY)
		oTableColumn.setFilterProperty(mProperty);
	return oTableColumn;
};

sap.uiext.inbox.Inbox.prototype.createTableRowSettingsContent = function() {
	var that = this;
	var tableRowSettingMatLayout = new sap.ui.commons.layout.MatrixLayout(that.getId() + '--'+ 'tableRowSettingLayoutContainer');

	//Table Row Settings.
	var oSegmentedButtonIconLite = new sap.ui.commons.SegmentedButton({id:that.getId() + '--' + 'tableRowSettingsSegBtn',
			buttons:[new sap.ui.commons.Button({id: that.getId() + '--' + 'table10RowsSegBtn',lite:true,text:'10',
													tooltip:this._oBundle.getText("INBOX_SET_NUMBER_OF_ROWS_TO") +" "+ this._oBundle.getText("INBOX_NUMBER_TEN")}).addStyleClass("sapUiExtInboxSegmentedButtonTransparent"),
			         new sap.ui.commons.Button({id: that.getId() + '--' + 'table25RowsSegBtn',lite:true,text:'25',
			        	 					tooltip:this._oBundle.getText("INBOX_SET_NUMBER_OF_ROWS_TO") +" "+ this._oBundle.getText("INBOX_NUMBER_TWENTYFIVE")}).addStyleClass("sapUiExtInboxSegmentedButtonTransparent"),
		           new sap.ui.commons.Button({id: that.getId() + '--' + 'table50RowsSegBtn',lite:true,text:'50',
		          	 					tooltip:this._oBundle.getText("INBOX_SET_NUMBER_OF_ROWS_TO") +" "+ this._oBundle.getText("INBOX_NUMBER_FIFTY")}).addStyleClass("sapUiExtInboxSegmentedButtonTransparent")
	    ]});		
		oSegmentedButtonIconLite.attachSelect(function(oEvent) {
				var rowSettingValue = parseInt(sap.ui.getCore().byId(oEvent.getParameters().selectedButtonId).getText());
				var aButtons = this.getButtons();
				var sSelectedButtonId = oEvent.getParameters().selectedButtonId;
				for (var i = 0; i < aButtons.length; i++) {
					var oButton =  aButtons[i];
					if(sSelectedButtonId !== oButton.getId()){
						oButton.addStyleClass("sapUiExtInboxSegmentedButtonTransparent");
						oButton.removeStyleClass("sapUiExtInboxSegmentedButtonTransparentSelected");
					}else{
						oButton.removeStyleClass("sapUiExtInboxSegmentedButtonTransparent");
						oButton.addStyleClass("sapUiExtInboxSegmentedButtonTransparentSelected");
					}
				}
				
				
	            that.setNoOfRowsOnTable(rowSettingValue);
		 
		});
		
		// check for URL Parameter for the number of rows in list view
		if (that.tableViewRowCountValue != null && that.tableViewRowCountValue != undefined){
        if (parseInt(that.tableViewRowCountValue) === 10 || parseInt(that.tableViewRowCountValue) === 25 || parseInt(that.tableViewRowCountValue) === 50){
        	oSegmentedButtonIconLite.fireSelect({selectedButtonId:that.getId() + '--' + 'table' + parseInt(that.tableViewRowCountValue) + 'RowsSegBtn'});
        	oSegmentedButtonIconLite.setSelectedButton(that.getId() + '--' + 'table' + parseInt(that.tableViewRowCountValue) + 'RowsSegBtn');
    		sap.ui.getCore().byId(oSegmentedButtonIconLite.getSelectedButton()).addStyleClass("sapUiExtInboxSegmentedButtonTransparentSelected");
        }
        	
        else {
        	that.setNoOfRowsOnTable(parseInt(that.tableViewRowCountValue));
        	}
        }
        
        else{
        	oSegmentedButtonIconLite.setSelectedButton(that.getId() + '--' + 'table10RowsSegBtn');
        	sap.ui.getCore().byId(oSegmentedButtonIconLite.getSelectedButton()).addStyleClass("sapUiExtInboxSegmentedButtonTransparentSelected");
        }
        var oBorderLayout2 = new sap.ui.commons.layout.BorderLayout(that.getId() + '--'+ 'tableBorderLayout', {width: "100%", height: "40px"});
		oBorderLayout2.createArea(sap.ui.commons.layout.BorderLayoutAreaTypes.end, oSegmentedButtonIconLite);
		oBorderLayout2.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.end, {
			size : "45%",
			contentAlign : "right",
			visible : true
		});
		tableRowSettingMatLayout.createRow(new sap.ui.commons.TextView({text : ' '}));//Fix For Footer scrollbar issue in IE8
		tableRowSettingMatLayout.createRow(oBorderLayout2);
		return tableRowSettingMatLayout;
	
};

sap.uiext.inbox.Inbox.prototype.createRowRepeaterView = function (){
	var that = this;
	var verticalLayout = sap.ui.getCore().byId(that.getId() + '--' + 'verticalLayoutContainer');
	var oTasksRowRepeater = sap.ui.getCore().byId(that.getId() + '--'+'tasksRowRepeater');
	
	//RowRepeater Creation --Start--
 	if(!oTasksRowRepeater){
 		
 		//This is the Main Matix Layout which is the template for Row Repeater.
			var rrMainMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
				id : that.getId() + '--' + "rrMainMatrixLayout",
				layoutFixed : true,
	 			columns : 3,
	 			width : '100%',
	 			widths : ['9%', '73%', '18%'] });
			
		// 1.First Row (Initiator Image, Task Title, Created On Date)
			var firstRow = new sap.ui.commons.layout.MatrixLayoutRow({
				id :  that.getId() + '--' + 'rrFirstRow'});

			rrMainMatrixLayout.addRow(firstRow);

			//Cell For Initiator Image
			var oTaskInitiatorImageCell = new sap.ui.commons.layout.MatrixLayoutCell({
				id :  that.getId() + '--' +  'taskInitiatorImageCell',
				rowSpan: 2 ,colSpan: 1,
				hAlign: sap.ui.commons.layout.HAlign.Center,
				vAlign: sap.ui.commons.layout.VAlign.Middle
			    });
			oTaskInitiatorImageCell.addStyleClass("sapUiExtInboxRRFirstRowStyle");
			var oTaskInitiatorImg = new sap.ui.commons.Image(that.getId() + '--' + "taskInitiatorImg");
			oTaskInitiatorImg.setWidth("52px");
			oTaskInitiatorImg.setHeight("52px");
			oTaskInitiatorImg.addStyleClass("sapUiExtInboxRowRepTaskInitiatorColor")
			oTaskInitiatorImg.bindProperty("tooltip","CreatedByName");
			oTaskInitiatorImg.bindProperty("src", "CreatedBy", function(createdBy){
    			var oContext = this.getBindingContext();
				if(createdBy){
					return that.inboxUtils.getUserMediaResourceURL(that.bpmSvcUrl, oContext.getProperty("SAP__Origin"), oContext.getProperty("CreatedBy"));
		    	}else{
					this.setVisible(false);
		    	}
			});
			oTaskInitiatorImageCell.addContent(oTaskInitiatorImg);
			
			var oTaskInitiatorIcn = that._getComponent("taskInitiatorIcn");
			if(!oTaskInitiatorIcn){
				oTaskInitiatorIcn = new sap.ui.core.Icon({
					id : (that.getId() + '--' + "taskInitiatorIcn"),
					decorative : false,
					src : {
						parts: this.oController.getTaskInitiatorIconParts(that),					  
						formatter: this.oController.getTaskInitiatorIconFormatter(that)
			 		}
				});				
			}
			oTaskInitiatorIcn.setSize("52px")
			.addStyleClass("sapUiExtInboxRowRepTaskInitiatorColor")
			.bindProperty("tooltip","CreatedByName");
			oTaskInitiatorImageCell.addContent(oTaskInitiatorIcn);
			firstRow.addCell(oTaskInitiatorImageCell);

			//Cell For Task Title
			var taskTitleCell = new sap.ui.commons.layout.MatrixLayoutCell({
				id : that.getId() + '--' + 'taskTitleCell',
				padding: sap.ui.commons.layout.Padding.Bottom
			});
			taskTitleCell.addStyleClass("sapUiExtInboxRRFirstRowStyle");
			
			
			//taskTitleCell.addContent(category_img);

		// 1.Row : Task Title and Date
			/*var otaskStatusImage = new sap.ui.commons.Image({
			         id : that.getId() + '--' + "rrViewTaskTitleImage",
			         text : "",
			         decorative : false,
			         visible: false
//			         tooltip : this._oBundle.getText("INBOX_MSGBAR_CLOSE_TOOLTIP")
			     });
			otaskStatusImage.bindProperty("src","",function(value){
				return "";
			});*/
			
			var taskName = new sap.uiext.inbox.InboxLink(that.getId() + '--' + "rrViewTaskTitle");
			taskName.addStyleClass('sapUiExtInboxfontBold');
			taskName.addDelegate({
	            onAfterRendering : function() {
	                if (this.data("overDue") === true) {
	                    this.addStyleClass('sapUiExtInboxRedColor');
	                }
	            }
	        });
			//taskName.addStyleClass("sapUiExtInboxNoUnderline");
	 	    taskName.bindProperty("text","TaskTitle",function(value){
	 			if(this.getBindingContext() ===  undefined)
	 			   return undefined;
	 			else
	 				return value;
	 		});
	 	    taskName.bindProperty("overdue","CompletionDeadLine", function(value){
				return that._isOverDue(value);
			});
	 	    taskName.bindProperty("tooltip","TaskTitle");
	 	    taskName.bindProperty("enabled", "Status", function(value) {
	 	    	if (value === "COMMITTED") {
	 	    		this.addStyleClass("sapUiExtInboxLnkDsbl");
	 	    		return false;
	 	    	} else if (that.getOpenCompletedTasks() === false && value == "COMPLETED") {
	 	    		this.addStyleClass("sapUiExtInboxLnkDsbl");
	 	    		return false;
	 	    	}
	 	    	this.removeStyleClass("sapUiExtInboxLnkDsbl");
	 	    	return true;

	        });
	        taskName.attachPress(this, function(oEvent, view) {
	        	//TODO: Refactor so that need not be done at two places for the different Views
	            that.showBusyLoader();
	            var oRow = oEvent.getSource().getParent();
	            var oContext = oEvent.getSource().getBindingContext();
	            var oModel = that.getCoreModel();
	            var oSelectedRow = oEvent.getSource().getParent().getParent().getParent();

	            // var oTaskExecMeta = {};
	            var aTaskExecutionURLs = [];
	            var aTaskExecIDs = [];
	            var aTaskExecTitles = [];
	            var aTaskExecSAPOrigins = [];

	            aTaskExecIDs.push(oModel.getProperty("InstanceID", oContext));
	            aTaskExecTitles.push(oModel.getProperty("TaskTitle", oContext));
	            aTaskExecSAPOrigins.push(oModel.getProperty("SAP__Origin", oContext));

	            if (that.getTaskExecutionURLCallBack != "" && that.getTaskExecutionURLCallBack != undefined && that.getTaskExecutionURLCallBack !== null){
	            	var taskUiURL = that.getTaskExecutionURLCallBack(aTaskExecIDs[0],aTaskExecSAPOrigins[0]);
	            		if(taskUiURL !== null && taskUiURL.replace(/\s/g, "").length > 0) {
	            			aTaskExecutionURLs.push(taskUiURL);
	            		}
	            }else{
	            			aTaskExecutionURLs.push("");
	            }

	            var evt = oEvent.getParameter("windowEvent");
	            if(!evt.ctrlKey && !(evt.button==1) && !evt.shiftKey && !that.bOpenTaskUIInNewTab){	            	
                    view.populateTaskExecutionContent({
                    	aSelectedContexts: [oContext],
                        arrayURLs : aTaskExecutionURLs,
                        arrayIDs : aTaskExecIDs,
                        arrayTitles : aTaskExecTitles,
                        aTaskSAPOrigins : aTaskExecSAPOrigins,
                        oRow : oSelectedRow
                    });
                    that.hideBusyLoader();
    			}else{
    				that.hideBusyLoader();
    				var taskUiURL = aTaskExecutionURLs[0]
    				if(taskUiURL !== null && taskUiURL.replace(/\s/g, "").length > 0) {
    					var taskExecWindow = window.open(taskUiURL);
        				taskExecWindow.focus();
        				oEvent.preventDefault();
    				}
    				
    			}
	            
	        });

			taskTitleCell.addContent(taskName);
			firstRow.addCell(taskTitleCell);
				
			//Cell For Created On Date
			var createdOnCell = new sap.ui.commons.layout.MatrixLayoutCell({
				id : that.getId() + '--' + 'createdOnCell',
				padding: sap.ui.commons.layout.Padding.Both,
				hAlign: sap.ui.commons.layout.HAlign.End
			});

			createdOnCell.addStyleClass("sapUiExtInboxRRFirstRowStyle");
			createdOnCell.addStyleClass("sapUiExtInboxRRPaddingRight");
			var createdOnDate = new sap.ui.commons.TextView(that.getId() + '--' + "rrViewCreatedOnDate");
			createdOnDate.addStyleClass("sapUIExtInboxRRTextColourStyle");
			createdOnDate.bindProperty("tooltip", "CreatedOn",that.tooltipFormatForDateTime);
			createdOnDate.bindProperty("text", "CreatedOn", function(value) {
				if (value !== null && value !== "") {
					return that.inboxUtils.dateTimeFormat(value);
				}
		  });

			createdOnCell.addContent(createdOnDate);
			firstRow.addCell(createdOnCell);	

			// 2. Second Row ((1st cell occupied by colSpan of Image), Task Description, Status)
			var secondRow = new sap.ui.commons.layout.MatrixLayoutRow({
				id : that.getId() + '--' + 'secondRow'});

			rrMainMatrixLayout.addRow(secondRow);
			
			var taskDescriptnMatxLyt = new sap.ui.commons.layout.MatrixLayout({
				id : that.getId() + '--' + "taskDescriptnMatxLyt",
				layoutFixed : false
				});
			
		
			var oTaskDetails = new sap.uiext.inbox.InboxFormattedTextView({
	   			htmlText : {
	   				parts: this.oController.getTaskDetailsParts(),
	   				formatter: this.oController.getTaskDetailsFormatter(that)
	   			},
	   			maxLines : 1
	   			
	   		});
				var oTaskdescriptionContent = new sap.uiext.inbox.InboxToggleTextView({showMore : {
					parts: this.oController.getExpandTaskDescriptionLinkParts(),					  
					formatter: this.oController.getExpandTaskDescriptionLinkFormatter(that)
		 		
		     }}).setFTV(oTaskDetails).attachShowMoreClick(function (oEvent) {
		    	 var oTaskDesc = this.getAggregation('fTV');
		   		if(oEvent.getParameter('text') === that._oBundle.getText("INBOX_SHOW_MORE_TEXT")){
		   		
		   			oTaskDesc.setHtmlText(oTaskDesc.data("showMore"));
		   			oTaskDesc.removeClamp();
		   			oTaskDesc.data('clamped','false');
				}else{
					oTaskDesc.setMaxLines(1);
					oTaskDesc.setHtmlText(oTaskDesc.data("showLess"));
					
				}
		   	});
		   
			var oTaskDescriptionCell = new sap.ui.commons.layout.MatrixLayoutCell({
	 	    	id : that.getId() + '--' + 'taskDesCell',
	 	    	hAlign: sap.ui.commons.layout.HAlign.Left,
	 	    	colSpan : 1 });
			
			oTaskDescriptionCell.addContent(oTaskdescriptionContent);
		
			taskDescriptnMatxLyt.createRow( oTaskDescriptionCell);
			 var oTaskDescriptionMatxCell = new sap.ui.commons.layout.MatrixLayoutCell({
					id :  that.getId() + '--' +  'taskDescriptionCell',
					padding: sap.ui.commons.layout.Padding.None,
					colSpan : 1 });
			
			 oTaskDescriptionMatxCell.addContent(taskDescriptnMatxLyt);
			 secondRow.addCell(oTaskDescriptionMatxCell);	

			//Cell For Status
			var statusCell = new sap.ui.commons.layout.MatrixLayoutCell({
				id : that.getId() + '--' +  'statusCell',
				padding: sap.ui.commons.layout.Padding.End,
				hAlign: sap.ui.commons.layout.HAlign.End,
				vAlign: sap.ui.commons.layout.VAlign.Top
			});
			statusCell.addStyleClass("sapUiExtInboxRRPaddingRight");
			
		  var statusText = new sap.ui.commons.TextView(that.getId() + '--' + "rrViewStatus");
 	    statusText.addStyleClass("sapUIExtInboxRRTextColourStyle");
 	    statusText.bindProperty("text","Status", function(value) {
 	    	var oModel= that.getModel();
 	    	var statusLabel= oModel.getProperty(sap.uiext.inbox.InboxConstants.PROPERTY_NAME_CUSTOM_STATUS,this.getBindingContext(),false);
 	    	return that._getTaskStatus(value,statusLabel);
				
 	    	
 	    });

			statusCell.addContent(statusText);
			secondRow.addCell(statusCell);

			// 3.Row (Task Initiaor Name, Claim, ".", Release, SegmentedButtons(Attachments, Comments, CustomAttributes)
			var thirdRow = new sap.ui.commons.layout.MatrixLayoutRow({
				id : that.getId() + '--' + 'thirdRow'});

			rrMainMatrixLayout.addRow(thirdRow);

			//Cell for Task Initiator Name.	
			var taskInitiatorNameCell = new sap.ui.commons.layout.MatrixLayoutCell({
				id : that.getId() + '--' + 'taskInitiatorNameCell',
				hAlign: sap.ui.commons.layout.HAlign.Center,
				vAlign: sap.ui.commons.layout.VAlign.Top,
				colSpan : 1,
				rowSpan : 2
				});

		   var taskInitiatorName = new sap.ui.commons.TextView(that.getId() + '--' + "taskInitiatorName",{design : sap.ui.commons.TextViewDesign.Small, wrapping : false,
				width : '90%'});
		   taskInitiatorName.setTextAlign(sap.ui.core.TextAlign.Center);
		   taskInitiatorName.setDesign(sap.ui.commons.TextViewDesign.Bold);
		   //taskInitiatorName.setWrapping(true);
	 	    taskInitiatorName.bindProperty("text","CreatedByName");
	 	   // taskInitiatorVLayout.insertContent(taskInitiatorName, 1);

			taskInitiatorNameCell.addContent(taskInitiatorName);
			thirdRow.addCell(taskInitiatorNameCell);
				
				
			//Cell for Task Action Links.	
			var taskActionLayoutCell = new sap.ui.commons.layout.MatrixLayoutCell({
				id :  that.getId() + '--' +  'actionLinksCell',
				padding: sap.ui.commons.layout.Padding.None,
				colSpan : 1 });

			//TODO: This would be a actions specific layout inside the main Layout.
			//We should try to improve it in future.
	 	   var taskActionInnerMatLayt = new sap.ui.commons.layout.MatrixLayout({
				id : that.getId() + '--' + "taskActionMatrixLayout",
				layoutFixed : false
				});
	 	    
	 	   var claimActionCell = new sap.ui.commons.layout.MatrixLayoutCell({
	 	  	 id : that.getId() + '--' + 'claimActionCell',
	 	  	 hAlign: sap.ui.commons.layout.HAlign.Left,
	 	  	 vAlign: sap.ui.commons.layout.VAlign.Bottom,
	 	  	 colSpan : 1 });
	 	   
	 	   var claimActionLink = new sap.ui.commons.Link(that.getId() + '--' + "rrViewClaimAction",{
	 	    	tooltip:that._oBundle.getText("INBOX_ACTION_BUTTON_CLAIM"),
	 	    	visible:false,
	 	    	enabled:false
	 	    	});
	 	   claimActionLink.addStyleClass("sapUiExtInboxLnkNoUnderline");
	 	    
	 	    //DOT Seperator b/w Claim and Release Action Links
	 	   var dotLabel = new sap.ui.commons.Label({
	 		   id:that.getId() + '--' + "dotSeparator", 
	 		   text:sap.uiext.inbox.InboxConstants.DOT,
	 		   visible:false
	 		   });
	 	   dotLabel.addStyleClass("sapUIExtInboxDotSeperatorStyle"); 
	 	   
	 	   	claimActionLink.setText(that._oBundle.getText("INBOX_ACTION_BUTTON_CLAIM"));
	 	    claimActionLink.attachPress({inbox:that,view:that.constants.rowRepeaterView,action:"Claim"}, that.executeActionOnTask);
	 	    claimActionCell.addContent(claimActionLink);

	 	    var releaseActionCell = new sap.ui.commons.layout.MatrixLayoutCell({
	 	    	id : that.getId() + '--' + 'releaseActionCell',
	 	    	hAlign: sap.ui.commons.layout.HAlign.Left,
	 	    	vAlign: sap.ui.commons.layout.VAlign.Bottom,
	 	    	colSpan : 1 });
	 	    
	 	    var releaseActionLink = new sap.ui.commons.Link(that.getId() + '--' + "rrViewReleaseAction",{
	 	    	tooltip:that._oBundle.getText("INBOX_ACTION_BUTTON_RELEASE"),
	 	    	visible:false,
	 	    	enabled:false
	 	    	});
	 	    releaseActionLink.addStyleClass("sapUiExtInboxLnkNoUnderline");
	 	    releaseActionLink.setText(that._oBundle.getText("INBOX_ACTION_BUTTON_RELEASE"));
	 	    releaseActionLink.attachPress({inbox:that,view:that.constants.rowRepeaterView,action:"Release"}, that.executeActionOnTask);
	 	    releaseActionCell.addContent(releaseActionLink);
	 	    
	 	    //DOT Seperator b/w Release and Forward Action Links
	 	    var dotLabel2 = new sap.ui.commons.Label({id:that.getId() + '--' + "dotSeparator2", visible:false, text:sap.uiext.inbox.InboxConstants.DOT});
	 	    dotLabel2.addStyleClass("sapUIExtInboxDotSeperatorStyle");
	 	    var forwardActionCell = that._createForwardActionLinkCell();
	 	   
	 	    var customActionCell = new sap.ui.commons.layout.MatrixLayoutCell({
	 	   	id : that.getId() + '--' + 'customActionCell',
	 	   	hAlign: sap.ui.commons.layout.HAlign.Left,
	 	   	vAlign: sap.ui.commons.layout.VAlign.Top,
	 	   	padding: sap.ui.commons.layout.Padding.None,
	 	   	colSpan : 1});
	 	
	 	 var oHorizontalLayout = new sap.ui.layout.HorizontalLayout(that.getId()+ '--' + "hrLayoutForCustomActions");
	 	 oHorizontalLayout.setVisible(false);
	 	 customActionCell.addContent(oHorizontalLayout);
	 	 oHorizontalLayout.bindProperty("visible", "InstanceID", function(sValue) {
	 		 if (!that._isCompletedTasksSelected()) {   // not creating custom actions in case completed tasks are selected in stream view
	 			if(sValue){
		 			if(this.getContent()[0]){
		 				this.getContent()[0].setVisible(true);
		 			}
		 			var oModel = that.getCoreModel();
		 	        var oContext = this.getBindingContext();
		 	        var _sSapOrigin = oModel.getProperty("SAP__Origin", oContext);
		 	        var aCustomActionArray;
		 	        var horLayout=this;
		 	       
		 	        function _createCustomActionsLinks(aCustomActionArray){
			 	        if(aCustomActionArray && aCustomActionArray.length > 0){
			 	        	//horLayout.destroyContent();
			 	        	if(horLayout.getContent()[0])
			 	        		horLayout.getContent()[0].setVisible(false);
			 	        	for(var action in aCustomActionArray){
			 	        		(function(act){
			 	        			var link= new sap.ui.commons.Link();
			 	        			var oCustomAction = aCustomActionArray[act];
			 	        			link.data('key',oCustomAction.DecisionKey);
									link.data('text',oCustomAction.DecisionText);
									link.data('commentsMandatory',oCustomAction.CommentMandatory)
			 	        			var sCustomActionLinkText = !oCustomAction.DecisionText? oCustomAction.DecisionKey: oCustomAction.DecisionText;
			 	        			link.setText(sCustomActionLinkText);
			 	        			link.attachPress({inbox:that,view:that.constants.rowRepeaterView}, jQuery.proxy(that._handleCustomActionClick,that));
			 	        			link.addStyleClass("sapUiExtInboxLnkNoUnderline");
			 	        			link.addStyleClass("sapUiExtInboxCustomActionLinkPadding");
			 	        			var dotLabel = new sap.ui.commons.Label({
			 	        				text:sap.uiext.inbox.InboxConstants.DOT,
			 	        				visible:true
			 	        			});
			 	        			dotLabel.addStyleClass("sapUiExtInboxCustomActionLinkPadding");
			 	        			dotLabel.addStyleClass("sapUIExtInboxDotSeperatorStyle");
			 	        			horLayout.addContent(dotLabel);
			 	        			horLayout.addContent(link);
			 	        			
			 	        		}(action));
			 	        	}	
			 	        }else{
			 	        	if(horLayout.getContent()[0])
			 	        		horLayout.getContent()[0].setVisible(false);
			 	        	horLayout.setVisible(false);
			 	        }
		 	        }
		 	       aCustomActionArray= that._getCustomActionsDefinition(sValue,_sSapOrigin, null, _createCustomActionsLinks);
		 	    }else{
			 		this.destroyContent();
			 		var localRefreshImg = new sap.ui.core.Icon();
		 			localRefreshImg.setSrc(that.constants.iconPool.getIconURI("refresh"));
			 		this.addContent(localRefreshImg);
			 		return true;
		 		}
	 		 }
	 	});
	 	    

	 	 taskActionInnerMatLayt.createRow(claimActionCell, dotLabel, releaseActionCell, dotLabel2, forwardActionCell,customActionCell);

	 	 taskActionLayoutCell.addContent(taskActionInnerMatLayt);
		 thirdRow.addCell(taskActionLayoutCell);	
				
			//Cell for Other Actions Segmented Buttons.	
			var segmentedButtonsCell = new sap.ui.commons.layout.MatrixLayoutCell({
				id : that.getId() + '--' + 'segmentedButtonsCell',
				padding: sap.ui.commons.layout.Padding.None,
				hAlign: sap.ui.commons.layout.HAlign.End,
				colSpan : 1 });

			 var icons = that.createOtherActions(that);
			 segmentedButtonsCell.addContent(icons);
			 thirdRow.addCell(segmentedButtonsCell);	
 	    
			 rrMainMatrixLayout.addStyleClass("sapUiExtInboxRowRepeaterLayoutBorder");
		
	 	                         
 	    var oTasksRowRepeater = new sap.ui.commons.RowRepeater(that.getId() + '--'+'tasksRowRepeater',{numberOfRows : 5});	
 	    oTasksRowRepeater.setBusyIndicatorDelay(0);
 	    oTasksRowRepeater.setThreshold(10000);
 	    oTasksRowRepeater.setDesign(sap.ui.commons.RowRepeaterDesign.BareShell);
 	    oTasksRowRepeater.addStyleClass("sapUiExtInboxBackgroundColour");
 	    oTasksRowRepeater.addStyleClass("sapUiExtInboxRowRepeaterBorder");
 	   
	 	}

 	
	//Adding Sorting Buttons Refresh Button and Settings
 	var rowRepeaterToolBar = that.createRowRepeaterToolBar(that);
 	rowRepeaterToolBar.setVisible(false);
 	verticalLayout.addContent(rowRepeaterToolBar);
 	
 	//This is based on the defaultView, after we introduce the concept of default view, we need to use that parameter and set visibility.
 	//If RR View is default then RR View visibilty will be true and List View Table will be false at the time of creation.
 	oTasksRowRepeater.setVisible(false);
 	verticalLayout.addContent(oTasksRowRepeater);
	 	
 	//Adding paginator and page settings(below rowrepeater).
 	var rowRepeaterToolsContent = that.createRowRepeaterToolsContent(that);
 	rowRepeaterToolsContent.setVisible(false);
 	verticalLayout.addContent(rowRepeaterToolsContent);
};

sap.uiext.inbox.Inbox.prototype.onSubstitutionButtonPress = function (oEvent, oInbox){
    var that = oInbox;
    var substitutionRulesManager    = sap.ui.getCore().byId(that.getId() + '--' + 'substitutionRulesManager');
    var oModel = that.getCoreModel();
    if(substitutionRulesManager === undefined){
    	substitutionRulesManager = new sap.uiext.inbox.SubstitutionRulesManager(that.getId() + '--' + 'substitutionRulesManager');
    	substitutionRulesManager.setParent(that);
        substitutionRulesManager.sUrl = oModel.sServiceUrl;
        substitutionRulesManager.bUseBatch = that.bUseBatch;
        substitutionRulesManager.oTCMModel = that.oTCMModel;
        substitutionRulesManager.oTcmMetadata = that.oTcmMetadata;
        substitutionRulesManager.oConfiguration = that.oConfiguration;
        substitutionRulesManager.isSubstitutionRuleCreationSupported=that.isSubstitutionRuleCreationSupported;
        substitutionRulesManager.oDataManager=that.oDataManager;
        
    	var oProfileCollectionConstant = that.constants.SubstitutionProfileCollection;
    	substitutionRulesManager.bSubstitutionProfileAvailable = that.oTcmMetadata._isEntitySet(oProfileCollectionConstant.name, oProfileCollectionConstant.entityType);
    	
    }
    substitutionRulesManager.getSubstitutionRulesData(oModel);
    
    substitutionRulesManager.open();
};

sap.uiext.inbox.Inbox.prototype.populateTaskExecutionContent = function(oTaskExecMeta) {
    var that = this;
    var bSingleTaskSelected = false, iTotalNumberOfTasks = 0;
    
    this.showBusyLoader();

    var sTaskExecutionThemeURL = "";

    if (this.getTaskExecutionURLThemeValue() !== undefined && this.getTaskExecutionURLThemeValue() !== null
            && this.getTaskExecutionURLCallBack === this.getDefaultTaskExecutionURLCallBack) {
        sTaskExecutionThemeURL = this.getTaskExecutionURLThemeValue();
    }

    var executionUI = sap.ui.getCore().byId(this.getId() + '--' + 'taskExecUI');
    if (executionUI != undefined) {
        executionUI.destroy();
    }
  
    var i = 0;
    var urls, ids, titles, taskExecMeta,sapOrigins, aSelectedContexts, deleteRecordContexts = [], aChangeContextValues = [], aWorkingContexts, oRRSelectedRow;
    if (oTaskExecMeta === undefined || oTaskExecMeta === null)
        oTaskExecMeta = this.getnavigateTaskExecMetadata();

    if (oTaskExecMeta != undefined) {
        urls = oTaskExecMeta.arrayURLs;
        ids = oTaskExecMeta.arrayIDs;
        iTotalNumberOfTasks = ids.length;
        titles = oTaskExecMeta.arrayTitles;
        sapOrigins = oTaskExecMeta.aTaskSAPOrigins;
        aSelectedContexts = oTaskExecMeta.aSelectedContexts;
        aWorkingContexts = aSelectedContexts;
        if(this.clientUpdate){
        	oRRSelectedRow = oTaskExecMeta.oRow
        }
    }

    executionUI = new sap.ui.ux3.OverlayContainer(this.getId() + '--' + "taskExecUI");
    executionUI.setOpenButtonVisible(false);
    
    //get the selected Contexts and set it to selectedContexts in the Inbox
    if(this.currentView === this.constants.tableView && aSelectedContexts){
        this.selectedContexts = aSelectedContexts;
    }
    executionUI.attachClose({inBox:this, completedTaskContexts: deleteRecordContexts, changeContextValues : aChangeContextValues, rrSelectedRow : oRRSelectedRow}, function(oEvent, oInboxandCompletedStatusContexts) {
        var inBox = oInboxandCompletedStatusContexts.inBox, completedTaskContexts =  oInboxandCompletedStatusContexts.completedTaskContexts, changeContextValues = oInboxandCompletedStatusContexts.changeContextValues;
        jQuery.sap.byId(that.getId() + '--' + "execURLFrame").attr('src', "");
        inBox.resetSearchCriteria();
        if(inBox.clientUpdate){
        	var rrSelectedRow = oInboxandCompletedStatusContexts.rrSelectedRow;
            if (inBox.getTaskExecURLStatusCallBack !== "" && inBox.getTaskExecURLStatusCallBack !== undefined && inBox.getTaskExecURLStatusCallBack !== null){ 
                var status = inBox.getTaskExecURLStatusCallBack(ids[i],sapOrigins[i]);
                if(status === 'COMPLETED'){
                	if(oRRSelectedRow){
                		completedTaskContexts.push({orow: oRRSelectedRow, context: aWorkingContexts[i]});
                	}else{
                		completedTaskContexts.push(aWorkingContexts[i]);
                	}
                }else{
                	if(oRRSelectedRow){
                		changeContextValues.push({row: oRRSelectedRow, context: aWorkingContexts[i], keys : [{key: 'Status', value: status}]});
                	}else{
                		changeContextValues.push({context: aWorkingContexts[i], keys : [{key: 'Status', value: status}]});
                	}
                }
            }
            inBox._refreshLocal(completedTaskContexts, changeContextValues);
        }else{
            //TODO: refactor required. Needs to be explicitly passed and the value is again reset back to the same property.one more
            inBox.applyFilterOnResponse(inBox.selectedContexts);
        }
    });
    
    if (iTotalNumberOfTasks == 1)
    	{ bSingleTaskSelected = true; }
    
   var nxtBtnContainer =  sap.ui.getCore().byId(this.getId() + '--' + 'nxtBtnContainer');
   if ( nxtBtnContainer === undefined && !bSingleTaskSelected) {
	 nxtBtnContainer = new sap.ui.commons.layout.MatrixLayout(this.getId() + '--' + "nxtBtnContainer", {
	        layoutFixed : false,
	        height : "95%",
	        width:"100%"
	    });
  }
    
    var prevIcon = sap.ui.getCore().byId(this.getId() + '--' + 'prevIcon');
    if (prevIcon === undefined && !bSingleTaskSelected) {
    	    prevIcon=  new sap.ui.core.Icon({id:this.getId() + '--' + "prevIcon",
    		src: sap.ui.core.IconPool.getIconURI("navigation-left-arrow"),
    		size: "32px",
    		color: "rgb(51,51,51)",
    		//activeColor: "white",
    		activeBackgroundColor: "white",
    		hoverColor: "rgb(238,238,238)",
    		hoverBackgroundColor: "rgb(102,102,102)",
    		width: "90%"
    	}).addStyleClass("sapUiExtInboxNextPrevBtnDisabled");
    	    
    	
     	    prevIcon.setSrc(sap.ui.core.IconPool.getIconURI("navigation-left-arrow"));
     	    
     	    prevIcon.setColor("#eeeeee").setHoverBackgroundColor("white");
    	    
    	    prevIcon.attachPress(function(oEvent) {
    	    	if(prevIcon.getColor()!=="#eeeeee"){
    	        // var status = that.getPropertyforTaskID("Status",ids[i]);

    	        //disable the next and prev buttons till the next one is loaded
    	    	prevIcon.setColor("#eeeeee").setHoverBackgroundColor("white");
    	    	nextIcon.setColor("#eeeeee").setHoverBackgroundColor("white");
    	        
    	        var status = "";
    	        if (that.getTaskExecURLStatusCallBack !== "" && that.getTaskExecURLStatusCallBack !== undefined && that.getTaskExecURLStatusCallBack !== null){
    	            status = that.getTaskExecURLStatusCallBack(ids[i],sapOrigins[i]);
    	        }
    	        if (status === "COMPLETED") {
    	            if(that.clientUpdate){
    	                deleteRecordContexts.push(aSelectedContexts[i]);
    	            }
    	            urls.splice(i, 1);
    	            ids.splice(i, 1);
    	            aWorkingContexts.splice(i, 1);
    	        }else{
    	            if(that.clientUpdate){
    	                aChangeContextValues.push({context: aSelectedContexts[i], keys : [{key: 'Status', value: status}]});
    	            }
    	        }

    	        i = i - 1;

    	        if (urls[i] === undefined){
    	            urls[i] = "";
    	            if (that.getTaskExecutionURLCallBack !== "" && that.getTaskExecutionURLCallBack !== undefined && that.getTaskExecutionURLCallBack !== null){
    	                // urls[i] = that.getTaskExecutionURL(ids[i]);
    	                urls[i] = that.getTaskExecutionURLCallBack(ids[i],sapOrigins[i]);
    	            }
    	        }
    	        if(urls[i] !== null && urls[i].replace(/\s/g, "").length > 0) {
    	        	jQuery.sap.byId(that.getId() + '--' + "execURLFrame").attr('src', that.inboxUtils.appendThemingParameters(urls[i], sTaskExecutionThemeURL)+"&sap-inbox-overlay=true");
    	        }
    	    }
    	    	else{
    	    		oEvent.preventDefault();
    	    	}

    	    }); 
    }
    
    var nextIcon = sap.ui.getCore().byId(this.getId() + '--' + 'nextIcon');
    if (nextIcon === undefined && !bSingleTaskSelected) {
    	var nextIcon=  new sap.ui.core.Icon({id:this.getId() + '--' + "nextIcon",
    		src: sap.ui.core.IconPool.getIconURI("navigation-right-arrow"),
    		size: "32px",
    		color: "rgb(51,51,51)",
    		//activeColor: "white",
    		activeBackgroundColor: "white",
    		hoverColor: "rgb(238,238,238)",
    		hoverBackgroundColor: "rgb(102,102,102)",
    		width: "90%"
    	}).addStyleClass("sapUiExtInboxNextPrevBtnDisabled");
    	
    	nextIcon.setSrc(sap.ui.core.IconPool.getIconURI("navigation-right-arrow"));
 	    
 	   if(ids.length > 1){
	    	nextIcon.setColor("#333333").setHoverBackgroundColor("rgb(102,102,102)");
	    }else{
	    	nextIcon.setColor("#eeeeee").setHoverBackgroundColor("white");
	    }
 	    
    	nextIcon.attachPress(function(oEvent) {
        	if(nextIcon.getColor()!=="#eeeeee"){
            // callBack
            
            //disable the next and prev buttons till the next one is loaded
        	prevIcon.setColor("#eeeeee").setHoverBackgroundColor("white");
        	nextIcon.setColor("#eeeeee").setHoverBackgroundColor("white");
            
            var status = "";
            if (that.getTaskExecURLStatusCallBack !== "" && that.getTaskExecURLStatusCallBack !== undefined && that.getTaskExecURLStatusCallBack !== null){ 
                status = that.getTaskExecURLStatusCallBack(ids[i],sapOrigins[i]);
            }
            if (status === "COMPLETED") {
                if(that.clientUpdate){
                    deleteRecordContexts.push(aSelectedContexts[i]);
                }
                urls.splice(i, 1);
                ids.splice(i, 1);
                aWorkingContexts.splice(i, 1);
            } else {
                if(that.clientUpdate){
                    aChangeContextValues.push({context: aSelectedContexts[i], keys : [{key: 'Status', value: status}]});
                }
                i = i + 1;
            }

            if (urls[i] === undefined){
                // urls[i] = that.getTaskExecutionURL(ids[i]);
                urls[i] = ""; 
                if (that.getTaskExecutionURLCallBack !== "" && that.getTaskExecutionURLCallBack !== undefined && that.getTaskExecutionURLCallBack !== null){
                    urls[i] = that.getTaskExecutionURLCallBack(ids[i],sapOrigins[i]);
                }
            }
            if(urls[i] !== null && urls[i].replace(/\s/g, "").length > 0) {
            	jQuery.sap.byId(that.getId() + '--' + "execURLFrame").attr('src', that.inboxUtils.appendThemingParameters(urls[i], sTaskExecutionThemeURL)+"&sap-inbox-overlay=true");
            }
        	}
        	else{
        		oEvent.preventDefault();
        	}
            
        });
    }

    
    var prevBtnContainer =  sap.ui.getCore().byId(this.getId() + '--' + 'prevBtnContainer');
   if ( prevBtnContainer === undefined && !bSingleTaskSelected) {
	        prevBtnContainer = new sap.ui.commons.layout.MatrixLayout(this.getId() + '--' + "prevBtnContainer", {
	        layoutFixed : false,
	        height : "95%",
	        width:"100%"
	    });
   }
    
     var content = new sap.ui.core.HTML(this.getId() + '--' + "execURLFrame", {
        content : "<iframe name='myframe' src='" + urls[i] + sTaskExecutionThemeURL +"&sap-inbox-overlay=true"+ "' scrolling='auto' id = '"
                + this.getId() + '--' + "execURLFrame"
                + "' style='position: absolute;height: 100%;width: 100%; border: none;'></iframe>"
    });

       var oBorderLayout = new sap.ui.commons.layout.BorderLayout(this.getId() + '--' + "taskExecBorderLayout", {
        width : "100%",
        height : "100%",
        top : new sap.ui.commons.layout.BorderLayoutArea({
            size : "20%",
            contentAlign : "center",
            visible : false,
            content : [new sap.ui.commons.TextView({
                text : 'Task:' + titles[i],
                design : sap.ui.commons.TextViewDesign.Bold
            })]
        }),
        center : new sap.ui.commons.layout.BorderLayoutArea({
            contentAlign : "left",
            visible : true,
            content : [content]
        })
    });
      
       if (!bSingleTaskSelected) {
    	   
    	   var label = sap.ui.getCore().byId(this.getId() + '--' + "traverseLabel");
    		if (!label) {
    				label = new sap.ui.commons.Label(this.getId() + '--' + "traverseLabel");
    		}
    	   var dummyLabel = sap.ui.getCore().byId(this.getId() + '--' + "dummyLabel");
    	   if (!dummyLabel) {
    		       dummyLabel = new sap.ui.commons.Label({
    		    	id: this.getId() + '--' + "dummyLabel",
    		    	visible:false
    		    	});
    	   }
    	    
    	   nxtBtnContainer.createRow(nextIcon); 
    	   prevBtnContainer.createRow(prevIcon); 
    	   var oBorderLayout = sap.ui.getCore().byId(this.getId() + '--' + "taskExecBorderLayout");
    	   
    	   oBorderLayout.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.begin, {
    			size : "2%",
    			contentAlign : "right",
    			visible : true,
    			content : [prevBtnContainer, label]
    		});

    	   oBorderLayout.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.end, {
    			size : "2%",
    			contentAlign : "right",
    			visible : true,
    			content : [nxtBtnContainer, dummyLabel]
    		});

       }  
    executionUI.addContent(oBorderLayout);
    
    content.attachAfterRendering(function(){
        jQuery.sap.byId(that.getId() + '--' + "execURLFrame").bind('load', function(event) {
            
            var idsArrayLength = ids.length;
            if (nextIcon) {
            	if(i !== idsArrayLength - 1)
                	nextIcon.setColor("#333333").setHoverBackgroundColor("rgb(102,102,102)");
                	
                else
                	nextIcon.setColor("#eeeeee").setHoverBackgroundColor("white");
            }
            
            if (prevIcon) {
                if(i===0  )
                	prevIcon.setColor("#eeeeee").setHoverBackgroundColor("white");
                else
                	prevIcon.setColor("#333333").setHoverBackgroundColor("rgb(102,102,102)");

            }
            
            if (label) {
            	 label.setDesign(sap.ui.commons.LabelDesign.Bold);
                 label.setWidth("85%");
                 label.setText((i+1)+"/"+ids.length);
            }
           
            if(dummyLabel) {
            	 dummyLabel.setDesign(sap.ui.commons.LabelDesign.Bold);
                 dummyLabel.setWidth("60%");
            }
           
        });
    });
  
    if(bSingleTaskSelected && urls !== null && !urls[0]) {
    	this.hideBusyLoader();
    } else {
    	executionUI.open();
    }
  
    function respondToSizingMessage  (oEvent) {
    	
  	  var oEventParameter ;
  	  var taskExecutionUI = jQuery.sap.byId(that.getId() + '--' + "taskExecUI");
  	  if (jQuery.browser.msie == true && parseInt(jQuery.browser.version) < 10 ){
  		  var oEdata = jQuery.parseJSON(oEvent.data);
  	  } else {
  		  oEdata = oEvent.data;
  	  }
  	  
  	  if (jQuery.isArray(oEdata)) {
  		   
  		   jQuery.each(oEdata, function (key, value) {
  				
  			   oEventParameter = oEdata[key];
  				if(oEventParameter.command === "resize")
  				 
  				{	taskExecutionUI.css({"margin" : "auto"});
  				
  					if (!oEventParameter.data.height){
  					
  						taskExecutionUI.animate({"width" : oEventParameter.data.width}, "slow");
  					
  				  }
  				else if (!oEventParameter.data.width ) {
  					taskExecutionUI.animate({"height" : oEventParameter.data.height}, "slow");
  				}
  				else
  					taskExecutionUI.animate({"height" : oEventParameter.data.height, "width" : oEventParameter.data.width}, "slow"); 
  				
  				}
  			})
  	   }
  	   
  	      	
      } 
      if(window.addEventListener){
      	window.addEventListener('message',respondToSizingMessage, false);
      } else if (window.attachEvent){
      	window.attachEvent('onmessage',respondToSizingMessage);
      }
};

sap.uiext.inbox.Inbox.prototype.createInboxUI = function() {
    
	//Basic View: This view would be common for any view ex: Table View, Row Repeater View or Feed View
	var verticalLayout = new sap.ui.commons.layout.VerticalLayout(this.getId() + '--' + "verticalLayoutContainer");
   
    if (sap.ui.getCore().byId(this.getId() + '--' + 'toolbarContainer') === undefined) {
        verticalLayout.insertContent(this.populateToolBar(), 0);
    }
    
    this.populateViews();
    if (sap.ui.getCore().byId(this.getId() + '--' + 'notificationBar') === undefined) {
        verticalLayout.addContent(this.populateNotificationBar());
    }
    return verticalLayout;
};

sap.uiext.inbox.Inbox.prototype.openToolPopUp = function(inBox) {
    var that = inBox;
    //var rowSettingValue = that.getRowSettingsCookieValue();
    var rowSettingValue;
    var noOfrowsRBG = sap.ui.getCore().byId(that.getId() + '--' + "rowSettingsRBG");;
    var settingsPopUp = sap.ui.getCore().byId(that.getId() + '--' + "sPopup");
    if (settingsPopUp === undefined) {
        noOfrowsRBG = new sap.ui.commons.RadioButtonGroup(that.getId() + '--' + "rowSettingsRBG", {
            tooltip : "Select number of rows to be displayed on the Table",
            columns : 3
        // select: function() {oController.setRowSettingsCookieValue(this.getSelectedItem().getText(),1);}
        });
        var oItem = new sap.ui.core.Item({
            text : "10",
            key : "rows10"
        });
        noOfrowsRBG.addItem(oItem);
        oItem = new sap.ui.core.Item({
            text : "25",
            key : "rows25"
        });
        noOfrowsRBG.addItem(oItem);
        oItem = new sap.ui.core.Item({
            text : "50",
            key : "rows50"
        });
        noOfrowsRBG.addItem(oItem);
        settingsPopUp = new sap.ui.commons.Dialog(that.getId() + '--' + "sPopup", {
            title : inBox._oBundle.getText("INBOX_TABLE_SETTINGS_POPUP_TITLE"),
            content : [noOfrowsRBG],
            buttons : [new sap.ui.commons.Button({
                text : inBox._oBundle.getText("INBOX_BUTTON_OK_TEXT"),
                press : function() {
//                  that.setRowSettingsCookieValue(sap.ui.getCore().byId(that.getId() + '--' + 'rowSettingsRBG')
//                          .getSelectedItem().getText(), 1);
                    that.setNoOfRowsOnTable(sap.ui.getCore().byId(that.getId() + '--' + 'rowSettingsRBG')
                            .getSelectedItem().getText());
                    settingsPopUp.close();
                }
            })]
        });
        settingsPopUp.setWidth("231px");
        settingsPopUp.setHeight("137px");

    }
    if (rowSettingValue === undefined) {
        rowSettingValue = sap.ui.getCore().byId(that.getId() + '--' + 'listViewTable').getVisibleRowCount() + "";
    }
    if (rowSettingValue != undefined && noOfrowsRBG != undefined) {
        switch (rowSettingValue) {
            case "10" :
                noOfrowsRBG.setSelectedIndex(0);
                break;
            case "25" :
                noOfrowsRBG.setSelectedIndex(1);
                break;
            case "50" :
                noOfrowsRBG.setSelectedIndex(2);
                break;
        }
    }
    settingsPopUp.open();
};

sap.uiext.inbox.Inbox.prototype.setSubstitutionEnabled = function(isSubstitutionEnabled, path) {
    if(this.isSubstitutionEnabled != isSubstitutionEnabled) {
        this.isSubstitutionEnabled = isSubstitutionEnabled; 
        this._substitutionPath = path;
        this.addAndRemoveSubstDropDowns();
    }
    //TODO: Might need this code later point of time.
    //var settingsButton = sap.ui.getCore().byId(this.getId() + '--' + "settingsButton");
    //if(settingsButton != undefined){
    //  settingsButton.rerender();
    //}
};

sap.uiext.inbox.Inbox.prototype._setColumnVisibility = function(colList) {
	if(colList !== undefined && colList !== null){
		var that=this;
		var isTaskTitleVisible=false;
		var consts= sap.uiext.inbox.InboxConstants;
		var oTable= sap.ui.getCore().byId(this.getId() + '--' + 'listViewTable');
		var invisibleCols= this.getInvisibleCols(colList);
		var cols= oTable.getColumns();
		jQuery.each(cols,function(index,column){
			jQuery.each(invisibleCols,function(index,field){
				if(that.absId(column.getId())===sap.uiext.inbox.InboxConstants.TABLE_VIEW_TECH_NAMES[field])
					column.setVisible(false);
				
			});
		});
		this.resizeColumns();
	}
};

sap.uiext.inbox.Inbox.prototype.absId= function(string){
	return string.split("--")[1].replace(/^\s+|\s+$/g,'');
	
};
sap.uiext.inbox.Inbox.prototype.getInvisibleCols= function(colList){
	var invisibleCols= [];
	jQuery.each(colList.columns,function(index,col){
		if(col.visibility===false)
			invisibleCols.push(col.field);
		
	});
	return invisibleCols;
	
};
sap.uiext.inbox.Inbox.prototype.getColumnVisibility = function() {
	return this.colList;
};

sap.uiext.inbox.Inbox.prototype.getSubstitutionEnabled = function() {
    return this.isSubstitutionEnabled
};

sap.uiext.inbox.Inbox.prototype.clearDrillDownFilter = function(){
    this.resetFilterView(true);
}

sap.uiext.inbox.Inbox.prototype.getTaskTableBinding = function() {
    var oListTable = sap.ui.getCore().byId(this.getId() + '--' + 'listViewTable');
    return oListTable.getBinding('rows');
};

sap.uiext.inbox.Inbox.prototype.bindTaskExecutionURL = function(taskExecURLfnCallBack, taskExecURLStatusCallBack) {
    this.getTaskExecutionURLCallBack = taskExecURLfnCallBack;
    this.getTaskExecURLStatusCallBack = taskExecURLStatusCallBack;
    return this;
};

sap.uiext.inbox.Inbox.prototype.bindTaskTypeDynamicFilter = function(taskTypeDynamicFilterCallBack) {
    this.dynamicTaskTypeFilterCallBack = taskTypeDynamicFilterCallBack;
    return this;
};

sap.uiext.inbox.Inbox.prototype.bindSearch = function(searchCallBack) {
    this.searchCallBack = searchCallBack;
    return this;
};

sap.uiext.inbox.Inbox.prototype.bindSubstitutedUsers = function(sPath){
    var dropdownComboBox3 = sap.ui.getCore().byId(this.getId() + '--' + 'filterComboBox3');
    var sSeletedKey = dropdownComboBox3.getSelectedKey();
    var sSelectedUser = dropdownComboBox3.getValue();    
    var onBehalfOf = sap.ui.getCore().byId(this.getId() + '--' + 'onBehalfOfListItem');
    if(onBehalfOf === undefined) {
        onBehalfOf = new sap.ui.core.ListItem(this.getId() + '--' + 'onBehalfOfListItem');
    }
    onBehalfOf.setText(this._oBundle.getText("SUBSTITUTION_INBOX_FILTER_ON_BEHALF_OF"));
    onBehalfOf.setKey("onBehalfOf");
    onBehalfOf.setEnabled(false);
    
    var allUsers = sap.ui.getCore().byId(this.getId() + '--' + 'li_allUsers');
    if(allUsers === undefined) {
        allUsers = new sap.ui.core.ListItem(this.getId() + '--' + 'li_allUsers');
    }   
    allUsers.setText(this._oBundle.getText("INBOX_DROP_DOWN_VALUE_ALL_USERS"));
    allUsers.setKey("allUsers");

//  var onBehalfOf = '';
//    if(sap.ui.getCore().byId(this.getId() + '--' + 'onBehalfOfListItem') === undefined) {
//      var onBehalfOf = new sap.ui.core.ListItem(this.getId() + '--' + 'onBehalfOfListItem');
//    }
//    onBehalfOf.setText(this._oBundle.getText("SUBSTITUTION_INBOX_FILTER_ON_BEHALF_OF"));
//    onBehalfOf.setKey("onBehalfOf");
//    onBehalfOf.setEnabled(false);
//    
//    dropdownComboBox3.addItem(onBehalfOf);
//
//    var allUsers = '';
//    if(sap.ui.getCore().byId(this.getId() + '--' + 'li_allUsers') === undefined) {
//      allUsers = new sap.ui.core.ListItem(this.getId() + '--' + 'li_allUsers');
//    } 
//    allUsers.setText(this._oBundle.getText("INBOX_DROP_DOWN_VALUE_ALL_USERS"));
//  allUsers.setKey("allUsers");
//  
//  dropdownComboBox3.addItem(allUsers);

   /* var IDURIPart = sPath+"?$format=json&$skip=0&$top=100&$filter=((SubstitutedUsers eq true))&$inlinecount=allpages";*/
    var IDURIPart = sPath+"?$format=json&$skip=0&$top=100&$inlinecount=allpages";
    var requestURI = this.bpmSvcUrl + IDURIPart;
    var substitutes = "";
    var oModel = this.getCoreModel();
    var that = this;
    /****************/
    var requestOptions = {
        async:false,
        requestUri : requestURI,
        method : "GET",
        headers : {
            Accept : "application/json",
            "x-csrf-token" : oModel.oHeaders["x-csrf-token"]
        }
    };
    OData.request(requestOptions, function(data, request) {
        // TO-DO : make this generic
        //substitutes = data.DisplayName;
        //dropdownComboBox3
        
        if(data.results.length > 0) {
            if(dropdownComboBox3.getEnabled() === false) {
                dropdownComboBox3.setEnabled(true);
            }

        dropdownComboBox3.removeAllItems();
        dropdownComboBox3.addItem(onBehalfOf);
        dropdownComboBox3.addItem(allUsers);
        
        for (var i = 0; i < data.results.length; i++) {
            substitutes +=data.results[i].DisplayName;
            //if(that.doesThisItemExistInComboBox(listOfItems, data.results[i].UniqueName) === false) {
                var listItem = new sap.ui.core.ListItem();
                listItem.setKey(data.results[i].UniqueName);
                listItem.setText(data.results[i].DisplayName);
                dropdownComboBox3.addItem(listItem);
            //}
          }
        
        // on refresh resetting dropdownfilter3 to the previously selected user
        if (that.bRefreshStartFlag && that.filtersToApply.dropDownFilter3){
        	var bUserExists = false;
        	for (var i = 0; i < data.results.length; i++) {
        		if (data.results[i].UniqueName == sSeletedKey) {
        			bUserExists = true;
        			dropdownComboBox3.setSelectedKey(sSeletedKey);
        		}
        	}
        	// if user is no longer receiving tasks from previously selected user 
        	if (!bUserExists) {
        		delete that.filtersToApply.dropDownFilter3;
        		that.showMessage("error", that._oBundle.getText("INBOX_MSG_ERR_SUBSTITUTION_DELETED", [sSelectedUser]));
        	}
        	bUserExists = false;
        }
        } else {
            dropdownComboBox3.setEnabled(false);
        }
    }, function(error) {
        if(error.response.statusCode == 205){
            var eventParams = {statusCode : error.response.statusCode, statusText : error.response.statusText};
            oModel.fireRequestFailed(eventParams);
        }else{
        //TODO: use enums for messageType.
            that.showMessage("error", that._oBundle.getText("INBOX_MSG_ERR_EXUI") + this.id);
        }
    });
    
//  var newOModel = new sap.ui.model.odata.ODataModel(this.oModel.sServiceUrl,true);
//  dropdownComboBox3.setModel(newOModel);
//  
//  var oItemTemplate1 = new sap.ui.core.ListItem();
//  oItemTemplate1.bindProperty("text", "DisplayName");
//  oItemTemplate1.bindProperty("key", "UniqueName");
//  var oFilter = [];
//  var filter = new sap.ui.model.Filter("SubstitutedUsers", sap.ui.model.FilterOperator.EQ, "true");
//  oFilter.push(filter);
//  dropdownComboBox3.bindItems(sPath, oItemTemplate1, null, oFilter); 
    
    //var oModel = this.getCoreModel();
    //oModel.oData["UserInfoCollection('USER.PRIVATE_DATASOURCE.un:allUsers')"] = {"DisplayName":"All Users", "UniqueID":"USER.PRIVATE_DATASOURCE.un:allUsers","__metadata":{"type":"Inbox.UserInfo","uri":""}};
    
    /*var allUsers = new sap.ui.core.ListItem(this.getId() + '--' + "li_allUsers");
    allUsers.bindProperty("text",this._oBundle.getText("INBOX_DROP_DOWN_VALUE_ALL_USERS"));
    allUsers.bindProperty("key","allUsers");
    dropdownComboBox3.addItem(allUsers);
    */
};

sap.uiext.inbox.Inbox.prototype.bindTaskTable = function(sPath, oTaskFilters) {
	var oInboxFilter = new sap.uiext.inbox.InboxFilters();
	var oInboxSecondaryFilter = new sap.uiext.inbox.InboxSecondaryFilters();
	oInboxFilter.setSecondaryFilter(oTaskFilters);
	this.bindTasks(sPath, oInboxFilter);
};

/**
* Bind the Inbox Task Collection
*
* @name sap.uiext.inbox.Inbox.prototype.bindTasks
* @function
* @param {string} 
 *         sPath
*         Binding path for the element displaying the tasks within the Inbox. This path is the Task Collection according to the TCM (Task Consumption Model)
* @param {object} 
 *         oOFilter
*         Predefined filter that is applied to the Task Collection before displaying the tasks in the Inbox. (sap.uiext.inbox.InboxFilters)
* @param {object} 
 *         oOSorter
*         {sap.ui.model.Sorter}Predefined sorter that is applied to the Task Collection before displaying the tasks in the Inbox. By default the tasks are sorted on 'CreatedOn' , descending, according to TCM.
* 
 * The sorter is not validated for the path being a valid TCM Entity Property. The sorter passed will be applied to the oData service as is. In case the entity Property in the path is a sortable property on the UI, the sorter indicator for that property will be visible.

* @type sap.uiext.inbox.Inbox
* @public
*/

sap.uiext.inbox.Inbox.prototype.bindTasks = function(sPath, oFilter, oSorter) {
	var oPrimaryFilter, oSecondaryFilter, oTaskFilters;
	
	// get the Primary (value in DropDown) and Secondary (Values in the Drill Down) filters
	if(oFilter){
		oPrimaryFilter = oFilter.getPrimaryFilter();
		oSecondaryFilter = oFilter.getSecondaryFilter();
    };
	
	//flag variable initialized and required for search.
	this.modelRefreshed = true;

	this.oModel = this.getModel();
	
	this.oController.setModel(this.oModel);
	
	//Task Categories in the Table will be visible only on a flag. Change the visibility based on this flag.
    this._handleTaskCategoryVisibility();
    
    this._setCommentsVisibility();
	
	this._initFlagsByModel();
	
	// setting model to oDataManager which takes care of supporting Inbox for different versions of oDataModel 
	this.oDataManager.setModel(this.oModel);
	
	if(this.typeOfModel === "OData"){
		this._initODataModel();
	} else {
		this._bindTaskActions();
	}
    
    //Model related settings
    this.sCollectionPath = sPath;
    // Check for '/' in the path  (if any)
    if(!(/^\//).test(this.sCollectionPath))
        this.sCollectionPath = "/"+ this.sCollectionPath;
    
    this.oModel.attachRequestSent(this, function(oEvent, inBox) {
    	var oCurrentViewElement = inBox._currentViewElement();
    	oCurrentViewElement.setBusy(true);
    	inBox._handleRequestSent(oEvent);
    });

    this.oModel.attachRequestCompleted(this, function(oEvent, inBox) {
    	
    	var oCurrentViewElement = inBox._currentViewElement();
    	oCurrentViewElement.setBusy(false);
    	
    	/* TODO We need to call _handleRequestCompleted only if the call is about task collection.
    	 * Need to discuss the approach.
    	 * currently writing some temporary fix
    	*/
    	
    	var sURL = oEvent.getParameter("url");
    	if (sURL && sURL.indexOf("TaskCollection") > 0) {
    		inBox._handleRequestCompleted(oEvent);
    	}
    	
    });
    
    this.oModel.attachRequestFailed(this, function(oEvent, inBox) {
    	var oCurrentViewElement = inBox._currentViewElement();
    	oCurrentViewElement.setBusy(false);
    	inBox._handleRequestFailed(oEvent);
    });
    
    //initialize Table View
    var table = this._initTableView();
    
    //Initialize rowrepeaterView
    var oTasksRowRepeater = this._initRowRepeaterView();
    var oRowRepeaterTemplate = this._getComponent('rrMainMatrixLayout');
    
    // Define default Initial Sort and Filter for Table Binding
    var initialSort = oSorter ? oSorter : new sap.ui.model.Sorter("CreatedOn", true);
    this._applySortOnView(initialSort);
    

    // Reset Drill Down Filters if already applied
    this.resetFilterView(false);
    
    // select drop down filter values and create filters to be aaplied for the selection
    this._selectInitialValueinDropDown(oPrimaryFilter);
    
    
    //Display Row Repeater View if the default is RowRepeater View
    if (this.defaultView === this.constants.rowRepeaterView) {
    	//change this to get the RR button for segmented button
    	var viewButtonsSegBtns = sap.ui.getCore().byId(this.getId() + '--' + 'viewSelectionSegBtn');
    	if(viewButtonsSegBtns !== undefined){
    		var rrSegmentedButtonID = this.getId() + '--' + 'rrViewSelectionButton';
    		viewButtonsSegBtns.setSelectedButton(rrSegmentedButtonID);
    		var rrViewSelectionButton = sap.ui.getCore().byId(this.getId() + '--' + 'rrViewSelectionButton');
    		viewButtonsSegBtns.fireSelect({selectedButtonId: rrSegmentedButtonID,triggeredFrom : 'initialView'});
    	}
    } 
    
    //initialize required variables for applying filters
    var toggleButton = sap.ui.getCore().byId(this.getId() + '--' + "filterViewButton");
    var $toggleButton = toggleButton.$();
    
    var aFiltersTobeApplied = [], mTempFilters;
    var oDefaultInitialDDFilter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.NE, "COMPLETED");
    
    //temporary storage for the dropDwon filter applied
    var oInitialDDFilter = this.filtersToApply.dropDownFilter;
    if(oInitialDDFilter === undefined){
    	oInitialDDFilter = oDefaultInitialDDFilter;
    }
    
    if (this.applyTaskCategoryFilter) {
    	if (this.filterOperatorCategoryTask === undefined ){
    		var filterOperatorCategoryTask = this.inboxUtils._getCategoryFilter("TASK");
    	}
    	
    this.filtersToApply.taskCategory = filterOperatorCategoryTask;
    aFiltersTobeApplied = this._addFilterToFilterMetadata(filterOperatorCategoryTask, aFiltersTobeApplied);
    }
    
    // storing filtersToApply.neCompleted filter in a local variable
    var oNeComepletedFilter = this.filtersToApply.neCompleted;
    
    if (oSecondaryFilter != null) {
    	
        // rendering change
        var oTaskFiltersTobeApplied = oSecondaryFilter.getFilterObjects();
        mTempFilters = oTaskFiltersTobeApplied.filterOperatorMap;
        
        var toggleOnFilter = mTempFilters ?  !toggleButton.getPressed() : toggleButton.getPressed();
        if(toggleOnFilter){
        	toggleButton.setPressed(!toggleButton.getPressed());
        	toggleButton.firePress();
        }
        
        
        if(mTempFilters){
        	
        	this.filtersToApply = oTaskFiltersTobeApplied.filtersAppliedMap;
        	aFiltersTobeApplied = this._selectFilterValuesinFacetFilterView(oSecondaryFilter, mTempFilters, oInitialDDFilter);

        }else{
        	//no Initial filters, so apply the computed DropDown Filter.
        	aFiltersTobeApplied = this._addFilterToFilterMetadata(oInitialDDFilter, aFiltersTobeApplied);
            this.filtersToApply.dropDownFilter = oInitialDDFilter;
        }
        
        // if tasks with status completed needs to be eliminated
        if (oNeComepletedFilter) {
        	var oSecondaryFilterKeys = oSecondaryFilter.getFilterUIKeys();
        	if (!(oSecondaryFilterKeys.Status && oSecondaryFilterKeys.Status.length > 0)) {
        		aFiltersTobeApplied = this._addFilterToFilterMetadata(oNeComepletedFilter, aFiltersTobeApplied);
        	}
        } 
        
    } else {
        if(toggleButton.getPressed()){
        	//call the event Handler method explicitly if the toggle Button is not visible, because the control does not fire the event in this case.
        	/*if(!$toggleButton.is(":visible")){
        		this.toggleFilterView(null , this);
        	}*/
            toggleButton.setPressed(!toggleButton.getPressed());
            toggleButton.firePress();
        }
        this.filtersToApply.dropDownFilter = oInitialDDFilter;
        aFiltersTobeApplied = this._addFilterToFilterMetadata(oInitialDDFilter, aFiltersTobeApplied);
        
        // if tasks with status completed needs to be eliminated
        if (oNeComepletedFilter) {
        	aFiltersTobeApplied = this._addFilterToFilterMetadata(oNeComepletedFilter, aFiltersTobeApplied);
        }
        
    }
    
    var oParams = this._getBindingParameters();
    
    //bind RowRepeater .. binding should not be here. introduce a concept of default Views, where the binding happens on the fly
    if (this.defaultView === this.constants.rowRepeaterView){
    		oTasksRowRepeater.bindRows({path: this.sCollectionPath,template: oRowRepeaterTemplate, parameters: oParams,sorter:initialSort,filters:aFiltersTobeApplied});
    }
    
	//bind Table
    //TODO: store the table class level and access using getTable maybe
    table.bindRows({path: this.sCollectionPath,parameters: oParams,sorter:initialSort,filters:aFiltersTobeApplied});
    
    //if CustomAttributes flag is true then show Toggle custom attribute Button in Stream View
    this.setToggleCustomAttributeBtnVisibilityStreamView(this.isCustomAttributesEnabled);
    //this.initialLoad = false;
    return this;
    /* Do we need this? */
    // return this.bindAggregation("inBox", sPath, undefined, undefined, aFilters);
};
sap.uiext.inbox.Inbox.prototype.setToggleCustomAttributeBtnVisibilityStreamView = function(bCustomAttributesEnabled) {
	var oToggleCustomAttributeBtn = this._getComponent("toggleCustomAttributes");
	if (bCustomAttributesEnabled) {
		oToggleCustomAttributeBtn.setVisible(true);
	} 
};

sap.uiext.inbox.Inbox.prototype.localSearch = function(oEvent, inBox) {
	
   if (inBox.searchCallBack !== "" && inBox.searchCallBack !== undefined) {
        inBox.searchCallBack();
        return;
    }
    var oModel = inBox.getCoreModel();
    var srchText = jQuery.trim(oEvent.getParameter("query").toLowerCase());
    var currentViewElement = inBox._currentViewElement();
    var aFilteredKeys = [];
    inBox._resetStateBeforeSearch(); // resetting state before search
    
    // getting search results keys for the current searched text
    aFilteredKeys.push(inBox._getBindingKeysOnLocalSearch(srchText, oModel._original_data, currentViewElement._originalKeys));
    
    // getting result keys in case any column is filtered in Table already
	if (inBox.currentView === inBox.constants.tableView && inBox._isTableFiltered()) {
		aFilteredKeys.push(inBox._getCurrentBindingKeysForTableColumnFilters(oModel._original_data, currentViewElement._originalKeys));
	}
	
	// intersecting both the above results
	var aResultKeys = inBox.inboxUtils._getUniqueArray(aFilteredKeys);
    var result = {};
    var vVal;
    
    for (var i in aResultKeys) {
		vVal = oModel._original_data[aResultKeys[i]];
		result[aResultKeys[i]] = vVal;
		
		if(vVal.Description){
			var descEntry, descDataEntry;
    		var oDescription = vVal.Description;
    		if(oDescription && oDescription.__list instanceof Array){ //It is array in case of BPM OData service.
    			descEntry = oDescription.__list[0];
    			descDataEntry = oModel.oData[descEntry];
    			if(descDataEntry)
    				result[descEntry] = descDataEntry;
    		}
    		else{ //To support description as Object 
    			var oDescriptionObject= oDescription.__ref;
    			if(oDescription && oDescriptionObject){
    				descDataEntry = oModel.oData[oDescriptionObject];
        			if(descDataEntry)
        				result[oDescriptionObject] = descDataEntry;
    			}
    		}
    	}
    	//add the task definition data
    	if(vVal.TaskDefinitionData){
    		var defEntry, defData;
    		var oTaskDefinitionData = vVal.TaskDefinitionData;
    		if(oTaskDefinitionData && oTaskDefinitionData.__list instanceof Array){ //It is array in case of BPM OData service.
    			defEntry = vVal.TaskDefinitionData.__list[0];
    			defData = oModel.oData[defEntry];
    			if(defData)
    				result[defEntry] = defData;
    		}
    		else{ //To support definition as Object 
    			var oDefinitionObject= oTaskDefinitionData.__ref;
    			if(oTaskDefinitionData && oDefinitionObject){
    				defData = oModel.oData[oDefinitionObject];
    				if(defData)
    				result[oDefinitionObject]= defData;
    			}
    		}
    	}
	}

    oModel.oData = result;
    // update the bookkeeping in each affected binding, here only for the Table.rows

    var oBindingInfo = currentViewElement.mBindingInfos["rows"];
    
    if (oBindingInfo && oBindingInfo.binding) {
        oBindingInfo.binding.iLength = aResultKeys.length; // update the length information
        oBindingInfo.binding.aKeys = aResultKeys; // update the key information for the filtered result
        // oBindingInfo.binding.checkUpdate();
        inBox.currentView === inBox.constants.tableView ? currentViewElement.rerender():currentViewElement.updateRows(false);
        currentViewElement._updateBindingContexts(undefined, undefined, "change");
    }
    var iResultLength = currentViewElement.getBinding('rows').iLength;
    inBox._updatePaginator(iResultLength);
    if (iResultLength <= 0)
    //TODO: use enums for messageType.
        inBox.showMessage("info", inBox._oBundle.getText("INBOX_MSG_FOR_NO_DATA"));
    else
        inBox.deleteMessage();
    inBox.fireODataRequestCompleted({bindingLength:iResultLength,appliedFilter:inBox._oBundle.getText("INBOX_SEARCH_RESULTS_TEXT")});
};

/* this function below will search a text on the data that has been provided and return the result keys */
sap.uiext.inbox.Inbox.prototype._getBindingKeysOnLocalSearch = function(srchText, oSearchData, oSearchKeys) {
	
	var aKeys = [];
	// check over the model's odata
    for ( var j in oSearchData) {
        var val = oSearchData[j];
        var valuePresent = false;
        var fieldValue;
        var taskMetadataProperty;
        // check over the table's row bindings
        for ( var l in oSearchKeys) {
            if (j == oSearchKeys[l]) {
                
            	// Check for each field value of the row
                for ( var k = 0; k < this._getCategoryMetadata().properties.length; k++) {
                	 taskMetadataProperty = this._getCategoryMetadata().properties[k];
                     fieldValue = val[taskMetadataProperty];
                     if (!fieldValue  && taskMetadataProperty  === "TaskTitle") {
                	   fieldValue =  this._oBundle.getText("INBOX_TASK_TITLE_NOTAVAILABLE_MSG") ;
                   }
                   if (fieldValue != null) {
                    	//search on formatted value of dates
                        if (jQuery.type(fieldValue) === "date") {
                            fieldValue = (this.inboxUtils.dateTimeFormat(fieldValue));// .toLowerCase();
                        }
                        
                        //search on translated values of Priority & Status
                        if (taskMetadataProperty === "Priority" || taskMetadataProperty === "Status") {
                            //special case handling for translated tooltips
                            if(fieldValue == "VERY_HIGH")
                                fieldValue = this._oBundle.getText("INBOX_FILTER_PRIORITY_VERY_HIGH");
                            if(fieldValue == "HIGH")
                                fieldValue = this._oBundle.getText("INBOX_FILTER_PRIORITY_HIGH");
                            if(fieldValue == "MEDIUM")
                                fieldValue = this._oBundle.getText("INBOX_FILTER_PRIORITY_MEDIUM");
                            if(fieldValue == "LOW")
                                fieldValue = this._oBundle.getText("INBOX_FILTER_PRIORITY_LOW");
                            if(fieldValue == "READY")
                                fieldValue = this._oBundle.getText("INBOX_FILTER_STATUS_READY");
                            if(fieldValue == "RESERVED")
                                fieldValue = this._oBundle.getText("INBOX_FILTER_STATUS_RESERVED");
                            if(fieldValue == "IN_PROGRESS")
                                fieldValue = this._oBundle.getText("INBOX_FILTER_STATUS_IN_PROGRESS");

                        }
                        fieldValue = fieldValue.toLowerCase();
                        if (fieldValue.indexOf(srchText) >= 0) {
                        	valuePresent = true;
                        	break;
                        }
                    }
                }
                
                //Check within navigation properties
                //Under Description
                if(!valuePresent){
                	if(val.Description){
                		//TODO: Time Being not supporting search on description for Gateway Services.
                		var oDescription = val.Description;
                		valuePresent= this._getValuePresent(oSearchData,oDescription,sap.uiext.inbox.InboxConstants.NAVIGATION_DESCRIPTION,srchText);
                	}
                } 
                //Under Task Definition Data
            	if(!valuePresent){
            		if(val.TaskDefinitionData){
            			//TODO: Time Being not supporting search on TaskDefinitionData for Gateway Services same reason as above.
            			var oTaskDefinitionData = val.TaskDefinitionData;
            			valuePresent= this._getValuePresent(oSearchData,oTaskDefinitionData,sap.uiext.inbox.InboxConstants.NAVIGATION_TASKDEFINITION,srchText);
            			}            		
            	}
            	
            	//For Custom Attributes
                if(!valuePresent){
                    if(val.CustomAttributeData){
                        var aCustomAttributeKeys = val.CustomAttributeData.__list;
                        if(aCustomAttributeKeys !== undefined){
                            for(var i = 0; i < aCustomAttributeKeys.length; i++ ){
                                var customAttributeKey = aCustomAttributeKeys[i];
                                var fieldValue = oSearchData[customAttributeKey].Value;
                                //TODO: in two places... refactor
                                if (fieldValue != null || fieldValue != undefined) {
                                    fieldValue = fieldValue.toLowerCase();
                                    if (fieldValue.indexOf(srchText) >= 0) {
                                    	valuePresent = true;
                                    	break;
                                    }
                                }
                            }
                        }
                    }
                }
                // If the value is present, maintain the row's id
                if (valuePresent) {
                	var key = j;
                	aKeys.push(key); 
                }
            }
        }
    }
    
    return aKeys;
};

sap.uiext.inbox.Inbox.prototype.refresh = function(aTaskUniqueIdentifiers) {
	this.applyFilterOnResponse(null);
};

sap.uiext.inbox.Inbox.prototype.applyFilterOnResponse = function(selectedContextsbeforeReq, rebind) {
 // TODO utility method - duplicate code..
    // var oModel = sap.ui.getCore().getModel();
    var oModel = this.getCoreModel();
    var that = this;
    this.showBusyLoader();
    var oListBinding;
    var currentViewElement;
    //BEGIN Delete notification messages from notification bar
    var oNotificationBar = sap.ui.getCore().byId(this.getId() + '--' + 'notificationBar');
    var oMessageNotifier = sap.ui.getCore().byId(this.getId() + '--' + 'messageNotifier');
    if(oNotificationBar != undefined){
    	oMessageNotifier.destroyMessages();
    	oNotificationBar.setVisibleStatus(sap.ui.ux3.NotificationBarStatus.Min);
    }
    //END Delete notification messages from notification bar
    if(that.currentView === that.constants.tableView){
    	currentViewElement = sap.ui.getCore().byId(this.getId() + '--' + 'listViewTable');
    	if (currentViewElement !== undefined) {
            if (selectedContextsbeforeReq != undefined && selectedContextsbeforeReq != null) {
                that.selectedContexts = selectedContextsbeforeReq;
            } else {
                that.selectedContexts = [];
            }
            oListBinding = currentViewElement.getBinding('rows');
    	}
    }else if(this.currentView === that.constants.rowRepeaterView){
    	currentViewElement = sap.ui.getCore().byId(this.getId() + '--'+'tasksRowRepeater');
    	if (currentViewElement !== undefined) {
    		currentViewElement.gotoPage(1);
    		var rowRepeaterPaginator = this._getComponent('rowRepeaterPaginator');
    		if(rowRepeaterPaginator){
    			rowRepeaterPaginator.destroy();
    		}
            oListBinding = currentViewElement.getBinding('rows');
    	}
    }
    
    var oFilter = [];
    if (oListBinding != null && oListBinding != undefined) {
    	// HACK:this is the hack applied by modifiying the internal variables of SAPUI5 - to remove the predefined filter
    	oListBinding.aApplicationFilters = [];
    	for ( var item in that.filtersToApply) {
    		var filter = that.filtersToApply[item];
    		if(jQuery.isArray(filter)){
    			oFilter = oFilter.concat(filter)
    		}else
    			oFilter.push(filter);
    	}
    	if(this.currentView === that.constants.rowRepeaterView && rebind){
    		var oSorter = oListBinding.oSorter;
    		var oRowRepeaterSortCombobox = that._getComponent('sortByFilterComboBox');
    		var sRRSelectedItemID = oRowRepeaterSortCombobox.getSelectedItemId();
    		if(sRRSelectedItemID){
    			var sSorterID = that.constants.mRRSortMap[that._removeParentID(sRRSelectedItemID)];
    			oSorter = sSorterID?that._getComponent(sSorterID).getSorter():oSorter;
    		}
    		
    		var oTemplate = that._getComponent("rrMainMatrixLayout");
    		var oParams = that._getBindingParameters();
    		
    		if(this.clientUpdate === undefined){
    			currentViewElement.unbindRows();
    			currentViewElement.bindRows({path: that.sCollectionPath, template: oTemplate, parameters: oParams, sorter: oSorter, filters: oFilter});
    			currentViewElement.bRowsRebinded = true;
    		}else{
    			oListBinding.filter(oFilter);
    			currentViewElement.updateRows(false);
    		}
    		
    	}else{
    		oListBinding.filter(oFilter);
    	}
    }
    
    // variables maintained for search
    that.modelRefreshed = true;
    if(oListBinding){
    	currentViewElement._originalKeys = oListBinding.aKeys;
    }
    this.hideBusyLoader();
};

sap.uiext.inbox.Inbox.prototype.refreshTaskList = function(oEvent, inBox) {
	inBox.bRefreshStartFlag = true;
	// FIXME:this causes a [problem to reset the gif in case of json/xml
    if (!inBox.getHandleBindings()) {
        inBox.fireRefresh(oEvent);
    } else {
        /*var refreshButton = sap.ui.getCore().byId(inBox.getId() + '--' + 'refreshButton');
        refreshButton.setSrc(inBox._imgResourcePath + sap.uiext.inbox.InboxConstants.refreshImageGif);*/
    }
    var oModel = inBox.getCoreModel();
    var oTable = sap.ui.getCore().byId(inBox.getId() + '--' + 'listViewTable');
    var oRowRepeater = sap.ui.getCore().byId(inBox.getId() + '--' + 'tasksRowRepeater');

    var oListBinding;
    var rowContext;
    var selectedIndices = inBox.getlistTableSelectedIndices();
    var selectedTasks = [];

    jQuery.each(selectedIndices, function(i, selIndex) {
        rowContext = oTable.getContextByIndex(selIndex);
        selectedTasks.push(rowContext);
    });
    
    var currentViewElement;
    if(inBox.currentView === sap.uiext.inbox.InboxConstants.tableView){
    	currentViewElement = oTable;
    }else if(inBox.currentView === sap.uiext.inbox.InboxConstants.rowRepeaterView){
    	currentViewElement = oRowRepeater;
    }

    if (currentViewElement != undefined) {
        if (selectedTasks != undefined && selectedTasks != null) {
            inBox.selectedContexts = selectedTasks;
        } else {
            inBox.selectedContexts = [];
        }

        if (inBox.clientUpdate){
        	currentViewElement.getModel().refresh();
        	inBox.modelRefreshed = true;
        } else {
        	
        	var dropdownComboBox3 = sap.ui.getCore().byId(inBox.getId() + '--' + 'filterComboBox3');
            if(dropdownComboBox3 != undefined && dropdownComboBox3.getEnabled() === true) {
            	inBox.bindSubstitutedUsers("/SubstitutedUsersCollection");
            }
        oListBinding = currentViewElement.getBinding('rows');

        var oFilter = [];

        if (oListBinding != null) {
        	oListBinding.aApplicationFilters = [];
            for ( var item in inBox.filtersToApply) {
                var filter = inBox.filtersToApply[item];
                if(jQuery.isArray(filter)){
                    oFilter = oFilter.concat(filter)
                }else
                    oFilter.push(filter);
            }
            oListBinding.filter(oFilter);
        }
       }   
    }
    // variables maintained for search
    inBox.modelRefreshed = true;
    currentViewElement._originalKeys = currentViewElement.getBinding('rows').aKeys;
    inBox.resetSearchCriteria();
    
    var refreshedOnText = sap.ui.getCore().byId(inBox.getId() + '--' + "refreshOnText");
    if(refreshedOnText){
    	 inBox.lastRefreshedOnDateTime = new Date();
    	 var refreshedTime = inBox._getFormattedRefreshOnDateTime();
    	 refreshedOnText.setText(inBox._oBundle.getText("INBOX_TEXT_ON") + sap.uiext.inbox.InboxConstants.SPACE + refreshedTime);
    	 refreshedOnText.setTooltip(inBox._getFormattedTooltipForLastRefreshedTime());
    }
};

sap.uiext.inbox.Inbox.prototype.applyDropDownFilter1 = function(oEvent, inBox) {
    var listItemID = oEvent.getSource().getSelectedItemId();
    
    if (listItemID === inBox.getId() + '--' + "li_substitutedTasks") {
        sap.ui.getCore().byId(inBox.getId() + '--' + 'filterComboBox3').setEnabled(false);
        inBox.filtersToApply.dropDownFilter1 = new sap.ui.model.Filter("IsSubstituted", sap.ui.model.FilterOperator.EQ, true);
        inBox.bindSubstitutedUsers("/SubstitutedUsersCollection");
        sap.ui.getCore().byId(inBox.getId() + '--' + 'onBehalfOfListItem').setEnabled(false);
        
    }else{
        //sap.ui.getCore().byId(inBox.getId() + '--' + 'filterComboBox3').setValue(inBox._oBundle.getText("INBOX_DROP_DOWN_VALUE_ALL_USERS"));
        sap.ui.getCore().byId(inBox.getId() + '--' + 'onBehalfOfListItem').setEnabled(true);
        sap.ui.getCore().byId(inBox.getId() + '--' + 'filterComboBox3').setSelectedItemId(inBox.getId() + '--' + 'onBehalfOfListItem');
        sap.ui.getCore().byId(inBox.getId() + '--' + 'filterComboBox3').setEnabled(false);
        delete inBox.filtersToApply.dropDownFilter3;
        
        if (listItemID === inBox.getId() + '--' + "li_allTasks") {
            delete inBox.filtersToApply.dropDownFilter1;
        }else if (listItemID === inBox.getId() + '--' + "li_myTasks") {
            inBox.filtersToApply.dropDownFilter1 = new sap.ui.model.Filter("IsSubstituted", sap.ui.model.FilterOperator.EQ, false);         
        }
    }
    inBox.applyFilterOnResponse(null);
};

sap.uiext.inbox.Inbox.prototype.applyDropDownFilter3 = function(oEvent, inBox) {
    var listItemID = oEvent.getSource().getSelectedItemId();
    
    if (listItemID === inBox.getId() + '--' + "li_allUsers") {
        delete inBox.filtersToApply.dropDownFilter3;
    }else{
        inBox.filtersToApply.dropDownFilter3 = new sap.ui.model.Filter("SubstitutedUser", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId(inBox.getId() + '--' + 'filterComboBox3').getSelectedKey());
    }
    inBox.applyFilterOnResponse(null);
};

sap.uiext.inbox.Inbox.prototype.applyDropDownFilter = function(oEvent, inBox) {
    var isCompTasksSelectedinDD = false;
    var listItemID = oEvent.getSource().getSelectedItemId();
    var statusAttr = sap.ui.getCore().byId(inBox.getId() + '--' + "INBOX_FILTER_STATUS");
    var oFilterDateTime = sap.ui.getCore().byId(inBox.getId() + '--' + "INBOX_FILTER_CREATION_DATE");
    var oFilterDueDateTime = sap.ui.getCore().byId(inBox.getId() + '--' + "INBOX_FILTER_DUE_DATETIME");
    var oFacet = sap.ui.getCore().byId(inBox.getId()+'--'+"filterFacet");

    // clear search text for every new filter select
    inBox.resetSearchCriteria();

    if (listItemID === inBox.getId() + '--' + "li_completedTasks") {
    	isCompTasksSelectedinDD = true;
        inBox._deleteCustomActions();
        if (statusAttr !== undefined) {
        	 inBox.storeFilterState( "INBOX_FILTER_STATUS");
        	// statusAttr.setSelected(false);
            oFacet.removeList(statusAttr);
            
        }
    
        if (oFilterDateTime !== undefined) {
        	 inBox.storeFilterState("INBOX_FILTER_CREATION_DATE");
            oFacet.removeList(oFilterDateTime);
        }
        if (oFilterDueDateTime !== undefined) {
        	inBox.storeFilterState("INBOX_FILTER_DUE_DATETIME");
            oFacet.removeList(oFilterDueDateTime);
        }

        
        delete inBox.filtersToApply.resStat;
        delete inBox.filtersToApply.readyStat;
        delete inBox.filtersToApply.InProStat;
        delete inBox.filtersToApply.neCompleted;
        
        delete inBox.filtersToApply.today;
        delete inBox.filtersToApply.last30;
        delete inBox.filtersToApply.last15;
        delete inBox.filtersToApply.last7;
        
        inBox.clearFiltersForDueDate();
        
        //if(inBox.sProviderHost !== "ODATA4J")// has to be oData4j
            inBox.filtersToApply.dropDownFilter = [new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "COMPLETED")];
        //else
        //  inBox.filtersToApply.dropDownFilter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "COMPLETED");
    }
    if (listItemID === inBox.getId() + '--' + "li_openTasks") {
        if (statusAttr != undefined) {
            // statusAttr.setSelected(true);
        	oFacet.addList(statusAttr);
            inBox.retrieveFilterState("INBOX_FILTER_STATUS");
        }
        if (oFilterDateTime != undefined && oFacet.indexOfList(oFilterDateTime) === -1) {
        	
        	oFacet.addList(oFilterDateTime);
        	inBox.retrieveFilterState("INBOX_FILTER_CREATION_DATE");
        }
        if (oFilterDueDateTime !== undefined && oFacet.indexOfList(oFilterDueDateTime) === -1) {
        	
        	oFacet.addList(oFilterDueDateTime);
        	inBox.retrieveFilterState("INBOX_FILTER_DUE_DATETIME");
    }

        // this.filtersToApply['dropDownFilter'] would be anyways update with 'ne' completed filter
        delete inBox.filtersToApply.neCompleted;
        if ((inBox.filtersToApply.resStat === undefined) && (inBox.filtersToApply.readyStat === undefined)
                && (inBox.filtersToApply.InProStat === undefined)) {
            inBox.filtersToApply.dropDownFilter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.NE,
                    "COMPLETED");
        } else {
            delete inBox.filtersToApply.dropDownFilter;
        }
        // this.filtersToApply['dropDownFilter'] = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.NE,
        // "COMPLETED");
    }
    if (listItemID === inBox.getId() + '--' + "li_overdueTasks") {
        if (statusAttr != undefined) {
            // statusAttr.setSelected(true);
        	oFacet.addList(statusAttr);
        	 inBox.retrieveFilterState( "INBOX_FILTER_STATUS");
        }
        
        if (oFilterDateTime != undefined && oFacet.indexOfList(oFilterDateTime) !== -1) {
        	inBox.storeFilterState("INBOX_FILTER_CREATION_DATE");
            oFacet.removeList(oFilterDateTime);
        }
        if (oFilterDueDateTime !== undefined && oFacet.indexOfList(oFilterDueDateTime) !== -1) {
        	inBox.storeFilterState("INBOX_FILTER_DUE_DATETIME");
        oFacet.removeList(oFilterDueDateTime);
    }
        
        inBox.clearFiltersForDueDate();
        
        delete inBox.filtersToApply.today;
        delete inBox.filtersToApply.last30;
        delete inBox.filtersToApply.last15;
        delete inBox.filtersToApply.last7;
        var formD = inBox.getFormattedDateTimeOff(0, true);
        inBox.filtersToApply.dropDownFilter = new sap.ui.model.Filter("CompletionDeadLine", sap.ui.model.FilterOperator.LT,
                formD);
        if ((inBox.filtersToApply.resStat === undefined) && (inBox.filtersToApply.readyStat === undefined)
                && (inBox.filtersToApply.InProStat === undefined) && (inBox.filtersToApply.neCompleted === undefined) ) {       
            inBox.filtersToApply.neCompleted = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.NE, "COMPLETED");
        }
    }
    if (listItemID === inBox.getId() + '--' + "li_escalatedTasks") {
        if (statusAttr != undefined) {
            // statusAttr.setSelected(true);
        	 oFacet.addList(statusAttr);
        	 inBox.retrieveFilterState( "INBOX_FILTER_STATUS"); 
        }
        if (oFilterDateTime != undefined && oFacet.indexOfList(oFilterDateTime) != -1) {
        	inBox.storeFilterState("INBOX_FILTER_CREATION_DATE");
            oFacet.removeList(oFilterDateTime);
        }
        if (oFilterDueDateTime !== undefined && oFacet.indexOfList(oFilterDueDateTime) !== -1) {
        	inBox.storeFilterState("INBOX_FILTER_DUE_DATETIME");
        oFacet.removeList(oFilterDueDateTime);
    }
        
        inBox.clearFiltersForDueDate();
        
        delete inBox.filtersToApply.today;
        delete inBox.filtersToApply.last30;
        delete inBox.filtersToApply.last15;
        delete inBox.filtersToApply.last7;
        inBox.filtersToApply.dropDownFilter = new sap.ui.model.Filter("IsEscalated", sap.ui.model.FilterOperator.EQ, true);
        if ((inBox.filtersToApply.resStat === undefined) && (inBox.filtersToApply.readyStat === undefined)
                && (inBox.filtersToApply.InProStat === undefined) && (inBox.filtersToApply.neCompleted === undefined) ) {       
            inBox.filtersToApply.neCompleted = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.NE, "COMPLETED");
        }
    }

    // hide standard action Buttons and Links if Completed Tasks are selected in DropdownBox  
    if (isCompTasksSelectedinDD == true){
    	inBox.hideAllActionButtonsandLinks();
    } else {
    	inBox.showAllActionButtonsandLinks();
    }
    
    var taskDefinitionFilter = inBox._isDrillDownFilterSelected('TaskDefinitionID');
    inBox._deleteCustomActions(null);
    if(!isCompTasksSelectedinDD && taskDefinitionFilter){
    	
    	/*var oTaskTypefilterList = inBox._getComponent("INBOX_FILTER_TASK_TYPE");
	    var aSelectedKeys = oTaskTypefilterList.getSelectedKeys();
		if(aSelectedKeys && aSelectedKeys.length === 1){
			//need to check if with the key we can store an object. This is too much of an overhead.
			var aItems = oTaskTypefilterList.getItems();
			var key = aSelectedKeys[0];
    		var sapOrigin;
			
	    	for (var j = 0; j < aItems.length; j++) {
		    	if (key === aItems[j].getKey()) {
			    	sapOrigin = aItems[j].data("SAP__Origin"); 
				}
			}
    		var aCustomActionsDefinitionArray = inBox._getCustomActionsDefinition(null,aSelectedKeys[0],sapOrigin);
	    	//create Columns
		    if(aCustomActionsDefinitionArray && aCustomActionsDefinitionArray.length>0)
		    	inBox._createCustomActionButtons(aCustomActionsDefinitionArray, false);
		
     }*/
    	inBox.applyFilterOnResponse(null,true);
	 }else{
		 inBox.applyFilterOnResponse(null);
	 }
};

sap.uiext.inbox.Inbox.prototype.clearFiltersForCategory = function() {
    delete this.filtersToApply.taskCategory;
    delete this.filtersToApply.todoCategory;
    delete this.filtersToApply.alertCategory;
    delete this.filtersToApply.notificationCategory;
};

sap.uiext.inbox.Inbox.prototype.clearFiltersForPriority = function() {
    delete this.filtersToApply.lowPrio;
    delete this.filtersToApply.medPrio;
    delete this.filtersToApply.hiPrio;
    delete this.filtersToApply.veryhiPrio;
};

sap.uiext.inbox.Inbox.prototype.clearFiltersForStatus = function() {
    delete this.filtersToApply.resStat;
    delete this.filtersToApply.readyStat;
    delete this.filtersToApply.InProStat;
    delete this.filtersToApply.neCompleted;
    // delete this.filtersToApply.openTasks;
    if (this.filtersToApply.dropDownFilter != undefined) {
    if ((this.filtersToApply["dropDownFilter"].sPath === "Status")
            && (this.filtersToApply["dropDownFilter"].sOperator === "NE")) {
        delete this.filtersToApply.dropDownFilter;
        }
    }
};

sap.uiext.inbox.Inbox.prototype.clearFiltersForDueDate = function() {
  delete this.filtersToApply.dueDateToday;
  delete this.filtersToApply.dueDatenext30;
  delete this.filtersToApply.dueDatenext15;
  delete this.filtersToApply.dueDatenext7;
  delete this.filtersToApply.noDueDate;
};

sap.uiext.inbox.Inbox.prototype.clearFiltersForDateTime = function() {
    delete this.filtersToApply.today;
    delete this.filtersToApply.last30;
    delete this.filtersToApply.last15;
    delete this.filtersToApply.last7;
};


sap.uiext.inbox.Inbox.prototype.clearFiltersForTaskType = function() {
    for ( var item in this.filtersToApply ){ 
        if(this.filtersToApply[item].sPath === 'TaskDefinitionID') {
            delete this.filtersToApply[item];
        }
    }
};

sap.uiext.inbox.Inbox.prototype.applyDrillDownFilterForTaskCategory = function(oEvent, inBox) {
    var filterOperatorCategoryTask, filterOperatorCategoryTodo, filterOperatorCategoryAlert, filterOperatorCategoryNotification;
    var oFacetFilter = sap.ui.getCore().byId(inBox.getId()+'--'+'filterFacet');
    var attributeChanged = oEvent.getParameter("selectedItems");
    inBox.resetSearchCriteria();
    inBox.clearFiltersForCategory();
    inBox._modifyTableColumnsOnFilterCategory();                    // removing or creating attributes in table
    inBox._modifyFacetFilterOnFilterCategory();                     // removing or adding facet filter lists
    inBox.changeToolbarOnFilterCategory();           				// enabling or disabling items in toolbar
    
    for(var i=0; i<attributeChanged.length; i++) {
    switch(attributeChanged[i].getId()){
    case inBox.getId()+'--'+"INBOX_FILTER_CATEGORY_TASKS":
    	filterOperatorCategoryTask = inBox.inboxUtils._getCategoryFilter("TASK",inBox.sProviderHost);
    	inBox.filtersToApply['taskCategory']=filterOperatorCategoryTask;
        break;
    case inBox.getId()+'--'+"INBOX_FILTER_CATEGORY_TODO":
    	filterOperatorCategoryTodo = inBox.inboxUtils._getCategoryFilter("Todo",inBox.sProviderHost);
    	inBox.filtersToApply['todoCategory']=filterOperatorCategoryTodo;
        break;
    case inBox.getId()+'--'+"INBOX_FILTER_CATEGORY_ALERT":
    	filterOperatorCategoryAlert = inBox.inboxUtils._getCategoryFilter("Alert",inBox.sProviderHost);
        inBox.filtersToApply['alertCategory']=filterOperatorCategoryAlert;
        break;
    case inBox.getId()+'--'+"INBOX_FILTER_CATEGORY_NOTIFICATION":
    	filterOperatorCategoryNotification = inBox.inboxUtils._getCategoryFilter("Notification",inBox.sProviderHost);
        inBox.filtersToApply['notificationCategory']=filterOperatorCategoryNotification;
        break;    
    };
    }
    inBox.applyFilterOnResponse(null);
};

sap.uiext.inbox.Inbox.prototype._modifyFacetFilterOnFilterCategory = function(bRRView){
	if (bRRView) {
		var aCategoryFilterMetadata = this.constants.aDependentDrillDownFiltersBasedOnCategory.aFilterMetadataDefault;
	} else {
		var aCategoryFilterMetadata = this._getCategoryFilterMetadata();
	}
	var oFacet = sap.ui.getCore().byId(this.getId()+'--'+"filterFacet");
	if(oFacet != undefined){
		var aFacetFilterLists = oFacet.getLists();
		var aFacetFilterListsId = [];
		
		// removing a filter list from the table if it's not in the category filter metadata but exists in the facet filter
		for (var i=0; i<aFacetFilterLists.length; i++){
			var oFilterList = aFacetFilterLists[i];
			var sFilterListId = this._removeParentID(oFilterList.getId());
			aFacetFilterListsId.push(sFilterListId);
			if(jQuery.inArray(sFilterListId,aCategoryFilterMetadata)===-1){
				this.storeFilterState(sFilterListId);
				oFacet.removeList(oFilterList);
				this._deleteRemovedFilter(sFilterListId);
			}
		}
		
		// adding a column into the table if it's there in the category metadata but not in the table
		for (var i=0; i<aCategoryFilterMetadata.length; i++){
			if(jQuery.inArray(aCategoryFilterMetadata[i],aFacetFilterListsId)===-1){
				var oFilterToBeAdded = sap.ui.getCore().byId(this.getId()+'--'+aCategoryFilterMetadata[i]);
				if (oFilterToBeAdded != undefined && oFacet.indexOfList(oFilterToBeAdded) === -1) {
					oFacet.insertList(oFilterToBeAdded, i);
					this.retrieveFilterState(aCategoryFilterMetadata[i]);
				}
			}
		}
	}
};

sap.uiext.inbox.Inbox.prototype._deleteRemovedFilter = function(sFilterListId){
	switch(sFilterListId) {
	case "INBOX_FILTER_CATEGORY" :
		this.clearFiltersForCategory();
		break;
	case "INBOX_FILTER_TASK_TYPE" :
		this.clearFiltersForTaskType();
		break;
	case "INBOX_FILTER_PRIORITY" :
		this.clearFiltersForPriority();
		break;
	case "INBOX_FILTER_STATUS" :
		this.clearFiltersForStatus();
		break;
	case "INBOX_FILTER_CREATION_DATE" :
		this.clearFiltersForDateTime();
		break;
	case "INBOX_FILTER_DUE_DATETIME" :
		this.clearFiltersForDueDate();
		break;
	};
	
};

sap.uiext.inbox.Inbox.prototype._modifyTableColumnsOnFilterCategory = function(){
	var oTable = this._getComponent('listViewTable');
	var aTableColumns = oTable.getColumns();
	var inboxCategoryMetadata = this._getCategoryMetadata();
	var aTableColumnsId = [];
	
	// removing a column from the table if it's not in the category metadata but exists in the table
	for (var i=0; i<aTableColumns.length; i++){
        var oColumn = aTableColumns[i];
        var sColumnId = this._removeParentID(oColumn.getId());
        aTableColumnsId.push(sColumnId);
        if(jQuery.inArray(sColumnId,inboxCategoryMetadata.properties)===-1){
            oColumn.destroy();
        }
    }
	
	// adding a column into the table if it's there in the category metadata but not in the table
	for (var i=0; i<inboxCategoryMetadata.properties.length; i++){
        if(jQuery.inArray(inboxCategoryMetadata.properties[i],aTableColumnsId)===-1){
        	this._createTableColumnContent(i,inboxCategoryMetadata);
        }
    }
	//this.resizeColumns();
};

sap.uiext.inbox.Inbox.prototype._getSelectedCategory = function(){
	var oFilterCategory = this._getComponent("INBOX_FILTER_CATEGORY");
	if (oFilterCategory != null && oFilterCategory.getSelectedKeys()!= null) {
		return oFilterCategory.getSelectedKeys()[0];
	}
};

sap.uiext.inbox.Inbox.prototype._getCategoryMetadata = function(){
	if (this.applyTaskCategoryFilter) {
		var sSelectedCategory = this._getSelectedCategory();
		switch (sSelectedCategory) {
		case "INBOX_FILTER_CATEGORY_TASKS" :
			return this.constants.mEntities.taskMetadata;
			break;
		case "INBOX_FILTER_CATEGORY_TODO" :
			return this.constants.mEntities.todoMetadata;
			break;
		case "INBOX_FILTER_CATEGORY_ALERT" :
			return this.constants.mEntities.alertMetadata;
			break;	
		case "INBOX_FILTER_CATEGORY_NOTIFICATION" :	
			return this.constants.mEntities.notificationMetadata;
			break;
		default :
			return this.constants.mEntities.taskMetadata;
		};
	} else {
		return this.constants.mEntities.taskMetadata;
	}
};

sap.uiext.inbox.Inbox.prototype._getCategoryFilterMetadata = function(){
	var sSelectedCategory = this._getSelectedCategory();
	var aDrillDownFilterMetadata = this.constants.aDependentDrillDownFiltersBasedOnCategory;
	switch (sSelectedCategory) {
	case "INBOX_FILTER_CATEGORY_TASKS" :
		return aDrillDownFilterMetadata.aFilterMetadataForCategoryTask;
		break;
	case "INBOX_FILTER_CATEGORY_TODO" :
		return aDrillDownFilterMetadata.aFilterMetadataForCategoryTodo;
		break;
	case "INBOX_FILTER_CATEGORY_ALERT" :
		return aDrillDownFilterMetadata.aFilterMetadataForCategoryAlert;
		break;	
	case "INBOX_FILTER_CATEGORY_NOTIFICATION" :	
		return aDrillDownFilterMetadata.aFilterMetadataForCategoryNotification;
		break;
	default :
		return aDrillDownFilterMetadata.aFilterMetadataForCategoryTask;
	};
	
};

sap.uiext.inbox.Inbox.prototype.applyDrillDownFilterForPriority = function(oEvent, inBox) {
    var filterOperatorPrioLow, filterOperatorPrioMedium, filterOperatorPrioHigh, filterOperatorPrioVeryHigh;
    var attributeChanged = oEvent.getParameter("selectedItems");
    inBox.resetSearchCriteria();
    inBox.clearFiltersForPriority();
    for(var i=0; i<attributeChanged.length; i++) {
    switch(attributeChanged[i].getId()){
    case inBox.getId()+'--'+"INBOX_FILTER_PRIORITY_LOW":
        if (this.filterOperatorPrioLow === undefined )
            filterOperatorPrioLow = inBox.inboxUtils._getPriorityFilters("LOW",inBox.sProviderHost);
        inBox.filtersToApply['lowPrio']=filterOperatorPrioLow;
        break;
    case inBox.getId()+'--'+"INBOX_FILTER_PRIORITY_MEDIUM":
        if (filterOperatorPrioMedium === undefined)
            filterOperatorPrioMedium = inBox.inboxUtils._getPriorityFilters("MEDIUM",inBox.sProviderHost);
        inBox.filtersToApply['medPrio']=filterOperatorPrioMedium;
        break;
    case inBox.getId()+'--'+"INBOX_FILTER_PRIORITY_HIGH":
        if (filterOperatorPrioHigh === undefined)
            filterOperatorPrioHigh = inBox.inboxUtils._getPriorityFilters("HIGH",inBox.sProviderHost);
        inBox.filtersToApply['hiPrio']=filterOperatorPrioHigh;
        break;
    case inBox.getId()+'--'+"INBOX_FILTER_PRIORITY_VERY_HIGH":
        if (filterOperatorPrioVeryHigh === undefined)
            filterOperatorPrioVeryHigh = inBox.inboxUtils._getPriorityFilters("VERY_HIGH",inBox.sProviderHost);
        inBox.filtersToApply['veryhiPrio']=filterOperatorPrioVeryHigh;
        break;    
    };
    }
    inBox.applyFilterOnResponse(null);
};

sap.uiext.inbox.Inbox.prototype.applyDrillDownFilterForStatus = function(oEvent, inBox) {
    var filterOperatorStatusRES, filterOperatorStatusREADY, filterOperatorStatusINPRO, filterOperatorStatusOPENTASKS;
    inBox.resetSearchCriteria();
    inBox.clearFiltersForStatus();
    
    if(oEvent.getParameter("all")){
        filterOperatorStatusOPENTASKS = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.NE, "COMPLETED");
        //inBox.filtersToApply['dropDownFilter'] = filterOperatorStatusOPENTASKS;
        inBox.filtersToApply['neCompleted'] = filterOperatorStatusOPENTASKS;
    }else{
            var attributeChanged = oEvent.getParameter("selectedItems");
            for(var i=0; i<attributeChanged.length; i++) {
            switch(attributeChanged[i].getId()){
        
            case inBox.getId()+'--'+"INBOX_FILTER_STATUS_RESERVED":
                if (filterOperatorStatusRES === undefined)
                    filterOperatorStatusRES = inBox.inboxUtils._getStatusFilters("RESERVED",inBox.sProviderHost);
                inBox.filtersToApply['resStat']=filterOperatorStatusRES;
                break;
            case inBox.getId()+'--'+"INBOX_FILTER_STATUS_READY":
                if (filterOperatorStatusREADY === undefined)
                    filterOperatorStatusREADY = inBox.inboxUtils._getStatusFilters("READY",inBox.sProviderHost);
                inBox.filtersToApply['readyStat']=filterOperatorStatusREADY;
                break;
            case inBox.getId()+'--'+"INBOX_FILTER_STATUS_IN_PROGRESS":
                if (filterOperatorStatusINPRO === undefined)
                    filterOperatorStatusINPRO = inBox.inboxUtils._getStatusFilters("IN_PROGRESS",inBox.sProviderHost);
                inBox.filtersToApply['InProStat']=filterOperatorStatusINPRO;
                break;
            };
            }
    }
    inBox.applyFilterOnResponse(null);
};

sap.uiext.inbox.Inbox.prototype.applyDrillDownFilterForDateTime = function(oEvent, inBox) {
    var filterOperatorDateToday, filterOperatorDate30, filterOperatorDate15, filterOperatorDate7;
    var todayAttr = sap.ui.getCore().byId(inBox.getId()+'--'+"INBOX_FILTER_DATETIME_TODAY");
    var last30Attr = sap.ui.getCore().byId(inBox.getId()+'--'+"INBOX_FILTER_DATETIME_MONTH"); 
    var last15Attr = sap.ui.getCore().byId(inBox.getId()+'--'+"INBOX_FILTER_DATETIME_15DAYS"); 
    var last7Attr = sap.ui.getCore().byId(inBox.getId()+'--'+"INBOX_FILTER_DATETIME_WEEK"); 
    var attributeChanged = oEvent.getParameter("selectedItems");
    inBox.resetSearchCriteria();
    inBox.clearFiltersForDateTime();
    var dropdownbox =  sap.ui.getCore().byId(inBox.getId()+'--'+'filterComboBox2');
    var isCompTasksSelected = false;
    if(dropdownbox.getSelectedItemId() === inBox.getId()+'--'+'li_completedTasks'){
        isCompTasksSelected = true;
    }
    for(var i=0; i<attributeChanged.length; i++) {
        switch(attributeChanged[i].getId()){
        case inBox.getId()+'--'+"INBOX_FILTER_DATETIME_TODAY":
            var formD = inBox.getFormattedDateTimeOff(0, false);
            // TODO: Can remove this check, one because we checking against null which is not valid in JavaScript,
            // two the variables are always undefined as they are created inside this function,
            // and the function is called for every selection.
            if (filterOperatorDateToday === undefined){
                    filterOperatorDateToday = new sap.ui.model.Filter("CreatedOn", sap.ui.model.FilterOperator.GE, formD);
            }
            inBox.filtersToApply['today']=filterOperatorDateToday;

            // Clear the filter from the stack.
            delete inBox.filtersToApply.last30;
            delete inBox.filtersToApply.last15;
            delete inBox.filtersToApply.last7;
            break;
        case inBox.getId()+'--'+"INBOX_FILTER_DATETIME_MONTH":
            var formD = inBox.getFormattedDateTimeOff(30, false);
            if (filterOperatorDate30 === undefined){
                    filterOperatorDate30 = new sap.ui.model.Filter("CreatedOn", sap.ui.model.FilterOperator.GE, formD);
            }
            inBox.filtersToApply['last30']=filterOperatorDate30;
            // Clear the filter from the stack.
            delete inBox.filtersToApply.today;
            delete inBox.filtersToApply.last15;
            delete inBox.filtersToApply.last7;
            break;
        case inBox.getId()+'--'+"INBOX_FILTER_DATETIME_15DAYS":
            var formD = inBox.getFormattedDateTimeOff(15, false);
            if (filterOperatorDate15 === undefined){
                    filterOperatorDate15 = new sap.ui.model.Filter("CreatedOn", sap.ui.model.FilterOperator.GE, formD);
            }
            inBox.filtersToApply['last15']=filterOperatorDate15;

            delete inBox.filtersToApply.today;
            delete inBox.filtersToApply.last30;
            delete inBox.filtersToApply.last7;
            break;
        case inBox.getId()+'--'+"INBOX_FILTER_DATETIME_WEEK":
            var formD = inBox.getFormattedDateTimeOff(7, false);
            if (filterOperatorDate7 === undefined){
                    filterOperatorDate7 = new sap.ui.model.Filter("CreatedOn", sap.ui.model.FilterOperator.GE, formD);
            }
            inBox.filtersToApply['last7']=filterOperatorDate7;
            delete inBox.filtersToApply.today;
            delete inBox.filtersToApply.last30;
            delete inBox.filtersToApply.last15;
            break;
        };

    }
    inBox.applyFilterOnResponse(null);
};


sap.uiext.inbox.Inbox.prototype.applyDrillDownFilterForTaskType = function(oEvent, inBox) {
	//this.data(null);
	var constants = inBox.constants;
// var filterOperatorStatusRES, filterOperatorStatusREADY, filterOperatorStatusINPRO;
    inBox.resetSearchCriteria();
    inBox.clearFiltersForTaskType();
    var isOdataModelBound = (inBox.typeOfModel === "OData");
    if(isOdataModelBound && inBox.currentView === inBox.constants.tableView){
    	inBox._clearCustomAttributeSort();
    }
    if(!oEvent.getParameter("all")) {
        var attributeChanged = oEvent.getParameter("selectedItems");
        inBox.bRefreshTaskTypes = false;
        if(isOdataModelBound){
        	inBox._createCustomAttributes(attributeChanged);
        	//Custom Actions not created on filter of Task Types. Commenting out.
        	//inBox._createCustomActions(attributeChanged);
        }

        for(var i=0; i<attributeChanged.length; i++) {
            inBox.filtersToApply[attributeChanged[i].getKey()]=new sap.ui.model.Filter("TaskDefinitionID", sap.ui.model.FilterOperator.EQ, decodeURIComponent(attributeChanged[i].getKey()));
        };
    }else{
        if(inBox.isCustomActionsEnabled === true && isOdataModelBound ){
            inBox._deleteCustomActions(null);
        }
        if(inBox.isCustomAttributesEnabled === true && isOdataModelBound){
            // change to delete all columns other than the fixed..... 
            inBox._deleteCustomAttributeColumns(null);
            inBox._modifyListBindingForExpand(false,constants.customAttributeNavigationParam);
         }
    }
    var rebind = (inBox.currentView === inBox.constants.rowRepeaterView)?true:false
    inBox.applyFilterOnResponse(null, rebind);
};

sap.uiext.inbox.Inbox.prototype._getCustomAttributeMetaData = function(sTaskDefinitionID,sSapOriginID,rowNumber, sSelectedTaskInstance){
	var that = this;
	var constants = this.constants;
	var oTaskDefinitionTCMMetadata = constants.TaskDefinitionCollection;
	var oCustomAttributeMetaDataArrayMap = constants.oTaskDefinitionCustomAttributesMap;
	var oCustomAttributeMetaDataArray = oCustomAttributeMetaDataArrayMap[sTaskDefinitionID];
	
	//if the Custom attribute definition for the task has not already been retrieved, then make a server call.
	if(!oCustomAttributeMetaDataArray){
		var sRequestURI =  this.bpmSvcUrl 
										+ constants.forwardSlash + oTaskDefinitionTCMMetadata.entityName 
										+ "(" 
											+ oTaskDefinitionTCMMetadata.properties.taskDefnID + "='" + sTaskDefinitionID 
											+ "'," 
											+ constants.sapOrigin + "='" + sSapOriginID 
										+ "')" 
										+ constants.forwardSlash +  oTaskDefinitionTCMMetadata.navParam.customAttrDefn;
		
		var oModel = this.getCoreModel();
		
	    var oRequestOptions = {
	        async:true,
	        requestUri : sRequestURI,
	        method : "GET",
	        headers : {
	            Accept : constants.acceptHeaderforJSON,
	            "Accept-Language" : sap.ui.getCore().getConfiguration().getLanguage(),
	            "x-csrf-token" : oModel.oHeaders["x-csrf-token"]
	        }
	    };
	    
	    OData.request(oRequestOptions, function(data, request) {
	        var aCustomAttributeDefinitionArray = data.results;
	        var aCustomAttributeMetaDataArray = [];
	        //convert the result array into an object format with key as the 'Name' of Custom Attribute
	        for(var i=0;i<aCustomAttributeDefinitionArray.length;i++){
	            var oCustomAttributeDefn = {};
	            oCustomAttributeDefn.Name =  aCustomAttributeDefinitionArray[i].Name;
	            oCustomAttributeDefn.Type =  aCustomAttributeDefinitionArray[i].Type;
	            oCustomAttributeDefn.Label = aCustomAttributeDefinitionArray[i].Label;
	            aCustomAttributeMetaDataArray.push(oCustomAttributeDefn);
	        }
	        //cache the custom attribute definitions for a Task Definition, so that we do not make a server call the next time.
	        oCustomAttributeMetaDataArrayMap[sTaskDefinitionID] = aCustomAttributeMetaDataArray;
	        that._displayCustomAttributes(sTaskDefinitionID, sSelectedTaskInstance, rowNumber);
	    }, function(error) {
	        that.showMessage("error", that._oBundle.getText("INBOX_MSG_FETCH_CUSTOM_ATTRIBUTES_FAILS"));
	    });
	} else {
		that._displayCustomAttributes(sTaskDefinitionID, sSelectedTaskInstance, rowNumber);
	}
};

sap.uiext.inbox.Inbox.prototype._displayCustomAttributes = function(sSelectedTaskDefinition, sSelectedTaskInstance, rowNumber){
	var constants = this.constants;
	var aCustomAttributeMetaDataArray = constants.oTaskDefinitionCustomAttributesMap[sSelectedTaskDefinition];
	
	//Table View
	if(this.currentView === this.constants.tableView){
		//delete and create custom attribute columns
		this._deleteCustomAttributeColumns(aCustomAttributeMetaDataArray);
		if(aCustomAttributeMetaDataArray){
			this._createCustomAttributeColumns(aCustomAttributeMetaDataArray);
		}
	}else{
		//RowRepeater View
		if(aCustomAttributeMetaDataArray && aCustomAttributeMetaDataArray.length == 0){
			this._addActionContentinRowRepeater(rowNumber, "customAttributes", this._createNoDataLabel(this._oBundle.getText("INBOX_MSG_NO_TASK_DETAILS")));
			return;
		}
		
		var oCustomAttributesValues = constants.oTaskInstanceCustomAttributeValuesMap[sSelectedTaskInstance];
		if (oCustomAttributesValues && !jQuery.isEmptyObject(oCustomAttributesValues)) {
			this._addActionContentinRowRepeater(rowNumber, "customAttributes", this._createCustomAttributesLayoutForRRView(aCustomAttributeMetaDataArray,oCustomAttributesValues,rowNumber));
		} 
	}
};

sap.uiext.inbox.Inbox.prototype._getCustomAttributeData = function(sTaskInstanceID,sSapOriginID,rowNumber,sSelectedTaskDefinition){
	var that = this;
	var constants = this.constants;
	var oTaskCollectionTCMMetadata = constants.TaskCollection;
	
    var oCustomAttributeValuesMap = constants.oTaskInstanceCustomAttributeValuesMap;
	var oCustomAttributesValues = oCustomAttributeValuesMap[sTaskInstanceID];
	if(!oCustomAttributesValues){
		var sURIPart = constants.forwardSlash 
								+ oTaskCollectionTCMMetadata.entityName 
										+ "(" 
											+ oTaskCollectionTCMMetadata.properties.instanceID
													+ "='"
															+ sTaskInstanceID + 
																"',"
																	+ constants.sapOrigin 
																		+ "='" 
																			+ sSapOriginID 
																					+ "')" 
																						+ constants.forwardSlash
																							+ oTaskCollectionTCMMetadata.navParam.customAttrValues;
    
		var sRequestURI = this.bpmSvcUrl + sURIPart;
		var oCustomAttributesValues = {};
		var oModel = this.getCoreModel();
		
	    var oRequestOptions = {
	        async:true,
	        requestUri : sRequestURI,
	        method : "GET",
	        headers : {
	            Accept : constants.acceptHeaderforJSON,
	            "x-csrf-token" : oModel.oHeaders["x-csrf-token"]
	        }
	    };
    
	    OData.request(oRequestOptions, function(data, request) {
        
        // TO-DO : make this generic
	    	var aCustomAttributeData = data.results;
	    	if (aCustomAttributeData.length > 0) {
	    		oCustomAttributesValues["numberOfAttributes"] = aCustomAttributeData.length;
	    		for(var i=0;i<aCustomAttributeData.length;i++){
	    			oCustomAttributesValues[aCustomAttributeData[i].Name] = aCustomAttributeData[i].Value;
	    			oCustomAttributeValuesMap[sTaskInstanceID] = oCustomAttributesValues;
	    		}
	    	} else {
	    		oCustomAttributeValuesMap[sTaskInstanceID] = oCustomAttributesValues;
	    	}
	    	that._displayCustomAttributes(sSelectedTaskDefinition, sTaskInstanceID, rowNumber);
	    }, function(error) {
	    	that.showMessage("error", that._oBundle.getText("INBOX_MSG_FETCH_CUSTOM_ATTRIBUTES_FAILS"));
	    });
	}
};

sap.uiext.inbox.Inbox.prototype._createCustomAttributeColumns = function(customAttributeDefinitionArray){
	var that = this;
	var oTable = this._getComponent('listViewTable');
	var oModel = this.getCoreModel();
	var NAME = "name", iColumnIndex = 0;
	
	//check if columns present and if not add
	jQuery.each(customAttributeDefinitionArray, function(index, caDefinition) {
		var oColumn = that._getComponent(that.inboxUtils.scrub(caDefinition.Name));
		var customAttrDefArrayType = caDefinition.Type;
		var columnTextAlignment = customAttrDefArrayType && (jQuery.inArray(customAttrDefArrayType.replace("class ", ""),that.constants.rightAlignedTypes) != -1) ? sap.ui.core.TextAlign.Right : sap.ui.core.TextAlign.Left;
		
		if(!oColumn){
			//create Column
			oColumn = new sap.ui.table.Column({id:that.getId() + '--' +that.inboxUtils.scrub(caDefinition.Name)})
            					.data("customAttrName", caDefinition.Name)
            					.data("ColumnType", "CustomAttribute")
            					.setFlexible(true)
            					.setLabel(
            							new sap.ui.commons.Label({
            								text: caDefinition.Label,
            								tooltip: caDefinition.Label, 
            								design : sap.ui.commons.LabelDesign.Bold
            								})
            					)
            					.setTemplate(
            							new sap.ui.commons.TextView({
            								id:that.getId() + '--' +that.inboxUtils.scrub(caDefinition.Name) + 'textView',
            								text: {
            											parts: that.oController.getCustomAttributeColumnParts(caDefinition.Name) ,
            											formatter: that.oController.getCustomAttributeColumnFormatter(that)
            								},
            							})
            							.data(NAME,caDefinition.Name)
            							.setTextAlign(columnTextAlignment)
            					);   
			//set Filter on column
            if(that.oController.isFilterOnCustomAttributesSupported()){
            	oColumn.setFilterProperty(caDefinition.Name);
            }
            //set sort on column
			if(that.bAllowCustomAttributeSort){
				oColumn.bindProperty("sortProperty","CustomAttributeData",function(value){
					return "CustomAttributeData/"+this.data("customAttrName");
	            });
			}
    	}else{
    		// in case the Custom Attribute Label is changed in the Process Definition, while the Custom Attribute Key remains as is.
    		if(oTable.indexOfColumn(oColumn) === -1){
    			var oLabel = oColumn.getLabel();
    			if(oLabel.getText() !== caDefinition.Label){
    				oLabel.setText(caDefinition.Label);
    			}
    		}
    	}
		//add column to Table
		oTable.insertColumn(oColumn,iColumnIndex+1);
		iColumnIndex++;
    //}
	});
	this.resizeColumns();
};

sap.uiext.inbox.Inbox.prototype._deleteCustomAttributeColumns = function(customAttributeDefinitionArray){
    //TODO refine this to delete only the ones not in customAttributeDefinitionArray
    var oTable = this._getComponent('listViewTable');
    
    var aTableColumns = oTable.getColumns();
    for (var i=0; i<aTableColumns.length; i++){
        var oColumn = aTableColumns[i];
        if(jQuery.inArray(this._removeParentID(oColumn.getId()),this._getCategoryMetadata().properties)===-1){
            oTable.removeColumn(oColumn);
        	oColumn.destroy();
        }
    }
};

sap.uiext.inbox.Inbox.prototype.applyDrillDownFilterForDueDate = function(oEvent, inBox) {
       var filterOperatorDueDateToday, filterOperatorDueDate30, filterOperatorDueDate15, filterOperatorDueDate7,filterOperatorDueDateLowerRange, filterOperatorNoDueDate;
       var todayAttr = sap.ui.getCore().byId(inBox.getId()+'--'+"INBOX_FILTER_DUE_DATETIME_TODAY");
       var next30Attr = sap.ui.getCore().byId(inBox.getId()+'--'+"INBOX_FILTER_DUE_DATETIME_MONTH"); 
       var next15Attr = sap.ui.getCore().byId(inBox.getId()+'--'+"INBOX_FILTER_DUE_DATETIME_15DAYS"); 
       var next7Attr = sap.ui.getCore().byId(inBox.getId()+'--'+"INBOX_FILTER_DUE_DATETIME_WEEK"); 
       var noDateAttr = sap.ui.getCore().byId(inBox.getId()+'--'+"INBOX_FILTER_NO_DUE_DATETIME"); 
       inBox.resetSearchCriteria();
       inBox.clearFiltersForDueDate();

       if(!oEvent.getParameter("all")) {
         var attributeChanged = oEvent.getParameter("selectedItems");
         var fromDate = new Date(0);
         //filterOperatorDueDateLowerRange = new sap.ui.model.Filter("CompletionDeadLine", sap.ui.model.FilterOperator.GE, fromDate.toUTCString());
         //inBox.filtersToApply['dueDateLowerRange']=filterOperatorDueDateLowerRange;
         
           for(var i=0; i<attributeChanged.length; i++) {
                  switch(attributeChanged[i].getId()){
                  case inBox.getId()+'--'+"INBOX_FILTER_DUE_DATETIME_TODAY":
                         var formD = inBox.getFormattedDueDateTimeOff(1);
                         if (filterOperatorDueDateToday === undefined){
                             filterOperatorDueDateToday = new sap.ui.model.odata.Filter("CompletionDeadLine", [{operator:sap.ui.model.FilterOperator.LE, value1: formD},{operator:sap.ui.model.FilterOperator.GE, value1:fromDate}], true);    
                         }
                         inBox.filtersToApply['dueDateToday']=filterOperatorDueDateToday;
    
                         // Clear the filter from the stack.
                         delete inBox.filtersToApply.next30;
                         delete inBox.filtersToApply.next15;
                         delete inBox.filtersToApply.next7;
                         delete inBox.filtersToApply.noDueDate;
                         break;
                  case inBox.getId()+'--'+"INBOX_FILTER_DUE_DATETIME_MONTH":
                         var formD = inBox.getFormattedDueDateTimeOff(30);
                         if (filterOperatorDueDate30 === undefined){
                               filterOperatorDueDate30 = new sap.ui.model.odata.Filter("CompletionDeadLine", [{operator:sap.ui.model.FilterOperator.LE, value1: formD},{operator:sap.ui.model.FilterOperator.GE, value1:fromDate}], true);
                         }
                         inBox.filtersToApply['dueDatenext30']=filterOperatorDueDate30;
                         // Clear the filter from the stack.
                         delete inBox.filtersToApply.dueDateToday;
                         delete inBox.filtersToApply.next15;
                         delete inBox.filtersToApply.next7;
                         delete inBox.filtersToApply.noDueDate;
                         break;
                  case inBox.getId()+'--'+"INBOX_FILTER_DUE_DATETIME_15DAYS":
                         var formD = inBox.getFormattedDueDateTimeOff(15);
                         if (filterOperatorDueDate15 === undefined){
                               filterOperatorDueDate15 = new sap.ui.model.odata.Filter("CompletionDeadLine", [{operator:sap.ui.model.FilterOperator.LE, value1: formD},{operator:sap.ui.model.FilterOperator.GE, value1:fromDate}], true);
                         }
                         inBox.filtersToApply['dueDatenext15']=filterOperatorDueDate15;
    
                         delete inBox.filtersToApply.dueDateToday;
                         delete inBox.filtersToApply.next30;
                         delete inBox.filtersToApply.next7;
                         delete inBox.filtersToApply.noDueDate;
                         break;
                  case inBox.getId()+'--'+"INBOX_FILTER_DUE_DATETIME_WEEK":
                         var formD = inBox.getFormattedDueDateTimeOff(7);
                         if (filterOperatorDueDate7 === undefined){
                               filterOperatorDueDate7 = new sap.ui.model.odata.Filter("CompletionDeadLine", [{operator:sap.ui.model.FilterOperator.LE, value1: formD},{operator:sap.ui.model.FilterOperator.GE, value1:fromDate}], true);
                         }
                         inBox.filtersToApply['dueDatenext7']=filterOperatorDueDate7;
                         delete inBox.filtersToApply.dueDateToday;
                         delete inBox.filtersToApply.next30;
                         delete inBox.filtersToApply.next15;
                         delete inBox.filtersToApply.noDueDate;
                         break;
                  case inBox.getId()+'--'+"INBOX_FILTER_NO_DUE_DATETIME":
                      if (filterOperatorNoDueDate === undefined){
                    	  filterOperatorNoDueDate = new sap.ui.model.Filter("CompletionDeadLine", sap.ui.model.FilterOperator.EQ, null);
                      }
                      inBox.filtersToApply['noDueDate']=filterOperatorNoDueDate;
                      delete inBox.filtersToApply.dueDateToday;
                      delete inBox.filtersToApply.next30;
                      delete inBox.filtersToApply.next15;
                      delete inBox.filtersToApply.next7;
                      break;
                  };
    
           }
       }
       inBox.applyFilterOnResponse(null);
};

sap.uiext.inbox.Inbox.prototype._getSelectedContextsBeforeRequest = function() {
    return this.selectedContexts;
};

sap.uiext.inbox.Inbox.prototype._setVisibility = function(sComponentName, bVisibility) {
    var oComponent = this._getComponent(sComponentName);
    if (oComponent) {
    	oComponent.setVisible(bVisibility);
    }
};

sap.uiext.inbox.Inbox.prototype.changeToolbarOnFilterCategory = function() { // function to set properties 'visible' and 'enabled' of action buttons 
	var oSettingsButton = this._getComponent('settingsButton');
	var sSelectedCategory = this._getSelectedCategory();
    switch(sSelectedCategory) {
    case "INBOX_FILTER_CATEGORY_TASKS":
    	oSettingsButton.setEnabled(true);
    	break;
    case "INBOX_FILTER_CATEGORY_TODO":
    	oSettingsButton.setEnabled(false);
    	break;
    case "INBOX_FILTER_CATEGORY_ALERT":
    	oSettingsButton.setEnabled(false);
    	break;
    case "INBOX_FILTER_CATEGORY_NOTIFICATION":
    	oSettingsButton.setEnabled(false);
    	break;
    default:
    	oSettingsButton.setEnabled(true);
    };
};


sap.uiext.inbox.Inbox.prototype.showAllActions = function() { // displaying standard action buttons and links if type of model is not OData
    this._setVisibility('claimActionButton', true);
	this._setVisibility('releaseActionButton', true);
    this._setVisibility('openActionButton', true);
    this._setVisibility('forwardActionButton', true);
	
    this._setVisibility('rrViewClaimAction', true);
    this._setVisibility('rrViewReleaseAction', true);
    this._setVisibility('rrViewForwardAction', true);
	
    this._setVisibility('dotSeparator', true);
    this._setVisibility('dotSeparator2', true);
};

sap.uiext.inbox.Inbox.prototype.hideAllActionButtonsandLinks = function() { // hiding standard action buttons and links if Completed Tasks are selected in dropdownBox
    if (this.getOpenCompletedTasks() == false){
    	this._setVisibility('openActionButton', false);
    }
    this._setVisibility('claimActionButton', false);
	this._setVisibility('releaseActionButton', false);
    this._setVisibility('forwardActionButton', false);
	
    this._setVisibility('rrViewClaimAction', false);
    this._setVisibility('rrViewReleaseAction', false);
    this._setVisibility('rrViewForwardAction', false);
	
    this._setVisibility('dotSeparator', false);
    this._setVisibility('dotSeparator2', false);
};

sap.uiext.inbox.Inbox.prototype.showAllActionButtonsandLinks = function() { // displaying standard action buttons and links if Completed Tasks are not selected in dropdownBox
    if(this.typeOfModel === "OData"){
    	var sTaskEntity = this.constants.ENTITY_NAME_TASK_COLLECTION;
    	this._setVisibility('openActionButton', false);
    	
    	if(this.oTcmMetadata._isPropertyAvailable(sTaskEntity, "SupportsClaim")){
        	this._setVisibility('claimActionButton', true);
            this._setVisibility('rrViewClaimAction', true);
        }
        
        if(this.oTcmMetadata._isPropertyAvailable(sTaskEntity, "SupportsRelease")){
        	this._setVisibility('releaseActionButton', true);
            this._setVisibility('rrViewReleaseAction', true);
            this._setVisibility('dotSeparator', true);
        }
        
        if(this.oTcmMetadata._isPropertyAvailable(sTaskEntity, "SupportsForward") && this.isForwardActionEnabled){
        	this._setVisibility('forwardActionButton', true);
        	this._setVisibility('dotSeparator2', true);
            this._setVisibility('rrViewForwardAction', true);
        } 
    } else { // for Models other than OData
    	this.showAllActions();
    }
};

sap.uiext.inbox.Inbox.prototype._handleActionButtonsEnable = function(bSupportsAction) {
	if( (bSupportsAction.length > 0) && !(jQuery.inArray(false, bSupportsAction) > -1) )  {
        return true;
    } else {
       	return false;
    }
};

sap.uiext.inbox.Inbox.prototype.disableActionButtonsOnMultiStatus = function(selectedStatus, selectedActions) {
    var claimButton = this._getComponent('claimActionButton');
    var releaseButton = this._getComponent('releaseActionButton');
    var forwardButton = this._getComponent('forwardActionButton');
    var completeButton = this._getComponent('openActionButton');
    var bCompletedTasksSelected =  this._isCompletedTasksSelected();
    var bGetOpenCompletedTasks = this.getOpenCompletedTasks();
    
    var bSupportsClaim = selectedActions.aSupportsClaim;
    var bSupportsForward = selectedActions.aSupportsForward;
    var bSupportsRelease = selectedActions.aSupportsRelease;
    
    if ( !bGetOpenCompletedTasks && bCompletedTasksSelected ){
    	completeButton.setVisible(false);
    } else {
    	completeButton.setVisible(true);
    }
    
    if (selectedStatus.length > 0 && !jQuery.inArray("COMPLETED", selectedStatus) > -1 ){
    	completeButton.setEnabled(true);
    } else {
    	if (this.getOpenCompletedTasks() == true){
    		completeButton.setEnabled(true);
    	}
    	else{
    		completeButton.setEnabled(false);
    	}
    } 
    
    claimButton.setEnabled(this._handleActionButtonsEnable(bSupportsClaim));
    releaseButton.setEnabled(this._handleActionButtonsEnable(bSupportsRelease));
    forwardButton.setEnabled(this._handleActionButtonsEnable(bSupportsForward));
};

sap.uiext.inbox.Inbox.prototype.dateFormat = function(dateValue, bDisplayYear) {
  if (dateValue != undefined && typeof (dateValue) == 'string' && dateValue != "") {
      var date;
      if (dateValue.indexOf('Date') != -1) {
          date = new Date();
          date.setTime(dateValue.substring((dateValue.indexOf("(") + 1), dateValue.indexOf(")")));
      } else {
          date = new Date(dateValue.substring((dateValue.indexOf("'") + 1), dateValue.length - 1));
      }
      dateValue = date;
  }

  if (dateValue != undefined && dateValue != "") {
      var ins = sap.ui.core.format.DateFormat.getDateInstance({
          style : "medium"
      });
      if(bDisplayYear !== undefined && bDisplayYear === false)
  	{
  		ins = sap.ui.core.format.DateFormat.getDateInstance({
  			pattern: "MMM dd",
              style : "medium"
          });
  	}
      return ins.format(dateValue);
  }
      //FOR Time Zone Support, do not forget to add timeoffset property in inbox control.
      /*var utc = Date.UTC(dateValue.getUTCFullYear(),dateValue.getUTCMonth(),dateValue.getUTCDate(),dateValue.getUTCHours(),dateValue.getUTCMinutes(),dateValue.getUTCSeconds(),dateValue.getUTCMilliseconds())
      var inboxInstance = this;
      while(inboxInstance != undefined && !(inboxInstance instanceof sap.uiext.inbox.Inbox))
      {
          inboxInstance = inboxInstance.getParent();
      }
      var localTime =  utc + inboxInstance.getTimezoneOffset() + (new Date().getTimezoneOffset()*60*1000);
      var ins = sap.ui.core.format.DateFormat.getDateTimeInstance({
          style : "medium"
      });
      return ins.format(new Date(localTime));*/
 return "";

};

sap.uiext.inbox.Inbox.prototype.tooltipFormatForDateTime = function(dateValue) {
    if (dateValue != undefined && typeof (dateValue) == 'string' && dateValue != "") {
        var date;
        if (dateValue.indexOf('Date') != -1) {
            date = new Date();
            date.setTime(dateValue.substring((dateValue.indexOf("(") + 1), dateValue.indexOf(")")));
        } else {
            date = new Date(dateValue.substring((dateValue.indexOf("'") + 1), dateValue.length - 1));
        }
        dateValue = date;
    }

    if (dateValue != undefined && dateValue != "") {
        var ins = sap.ui.core.format.DateFormat.getDateTimeInstance({
            style : "full"
        });
        return ins.format(dateValue);
    }       
    return "";

};

sap.uiext.inbox.Inbox.prototype.executeActionOnTask = function(oEvent, eventParameters) {
	
	var inBox = eventParameters.inbox;
	var view = eventParameters.view;
	var action = eventParameters.action;
	var isForwardAction = (action === inBox.constants.FORWARD) ? true : false;
	var forwardTo = isForwardAction ? eventParameters.forwardTo : "";
	
    inBox.showBusyLoader();
    var oListTable, rowContext, oModel;
    
    //var action = oEvent.getSource().getId();
    
    var selectedIDs = [], selectedContexts = [],selectedSAPOrigins = [], selectedForwardToUsers = [];
    var selectedStatus = [];
    var concatSelectedIDs, concatSelectedSAPOrigins;
    var selectedID, selectedSAPOrigin;
    // reset search
    inBox.resetSearchCriteria();
    oModel = inBox.getCoreModel();
    
    if(view === inBox.constants.tableView){
    	oListTable = sap.ui.getCore().byId(inBox.getId() + '--' + 'listViewTable');
        if (oEvent.getSource())
            var selectedIndices = inBox.getlistTableSelectedIndices();
        
        jQuery.each(selectedIndices, function(i, selIndex) {
            rowContext = oListTable.getContextByIndex(selIndex);
            selectedContexts.push(rowContext);
            
            selectedID = oModel.getProperty("InstanceID", rowContext);
            selectedSAPOrigin = oModel.getProperty("SAP__Origin", rowContext);
            
            selectedIDs.push(selectedID);
            selectedSAPOrigins.push(selectedSAPOrigin);
            
            if (i == 0){
                concatSelectedIDs = selectedID;
            	concatSelectedSAPOrigins = selectedSAPOrigin;
            }
            else{
                concatSelectedIDs = concatSelectedIDs + ";" + selectedID;
            	concatSelectedSAPOrigins = concatSelectedSAPOrigins + ";" + selectedSAPOrigin;
            }
        });
   }else if(view === inBox.constants.rowRepeaterView){
	   var oContext = oEvent.getSource().getBindingContext();
	   var oRow = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent();
	   selectedID = oModel.getProperty("InstanceID", oContext);
       selectedSAPOrigin = oModel.getProperty("SAP__Origin", oContext);
       
       selectedIDs.push(selectedID);
       selectedSAPOrigins.push(selectedSAPOrigin);
       
	   concatSelectedIDs = selectedID;
	   concatSelectedSAPOrigins = selectedSAPOrigin;
	   selectedContexts.push(oContext);
	  
   }
    
    if (selectedIDs != null || selectedIDs.length > 0) {
        var IDURIPart, requestURI, requestOptions, status;
        if (action === "Claim") {
            action = "Claim";
        }
        if (action === "Release") {
            action = "Release";
        }if(isForwardAction){
        	action = "Forward";
        }
        var eventParams = oEvent.getParameters();
        eventParams.action = action;
        eventParams.selectedIDs = concatSelectedIDs;
        eventParams.selectedSAPOrigins = concatSelectedSAPOrigins;
        eventParams.selectedIDList = selectedIDs;
        eventParams.selectedSAPOriginList = selectedSAPOrigins;
        eventParams.selectedContextList = selectedContexts;
        if(oRow){
          	eventParams.oRow = oRow;
        }

        if(isForwardAction){
        	eventParams.selectedForwardToUsers = forwardTo;
        }
        inBox.fireTaskAction(eventParams);
        if(inBox.clientUpdate === undefined && inBox.typeOfModel !== "OData"){
          	inBox.applyFilterOnResponse(selectedContexts);
        }
  }
    inBox.resetMessages = false;
    if(inBox.clientUpdate){
    	//for clientUpdate, because there is no odata response event in this case
    	inBox.resetMessages = true;
    }
};

sap.uiext.inbox.Inbox.prototype.defaultActionHandler = function(oEvent, inBox) {
    var constants = inBox.constants;
    var sAction = oEvent.getParameter('action');
    var concatSelectedIDs = oEvent.getParameter('selectedIDs');
    var concatSAPOrigins = oEvent.getParameter('selectedSAPOrigins');
    var selectedIDList = oEvent.getParameter('selectedIDList');
    var selectedSAPOriginList = oEvent.getParameter('selectedSAPOriginList');
    var commentsList = oEvent.getParameter('commentsList');
    var isForwardAction = (sAction === inBox.constants.FORWARD) ? true : false;
    var aSelectedContextsList = oEvent.getParameter('selectedContextList');
    var oSelectedRow = oEvent.getParameter('oRow');
    var sForwardToUser = oEvent.getParameter('selectedForwardToUsers');
    var selectedIDListLength = selectedIDList.length;
    var iTotalNumberOfRequests = selectedIDListLength;
    
    if((selectedIDListLength > 1) && inBox.isBatchOperationSupported){
    	
    	var aUrlParameters = [];
    	for(var i = 0;i < selectedIDListLength ; i ++){
    		var mUrlParams = {};
    		mUrlParams.InstanceID = "'" + selectedIDList[i] + "'";
    		mUrlParams.SAP__Origin = "'" + selectedSAPOriginList[i]  + "'";
    		if(commentsList && commentsList.length > 0){
    			mUrlParams.Comments= "'" + commentsList[i] + "'";
    		}
    		if(isForwardAction){
    			mUrlParams.ForwardTo= "'" + oEvent.getParameter('selectedForwardToUsers')  + "'";
   		  	}
    		aUrlParameters.push(mUrlParams);
    	}
    	
    	var fnSuccess = function(oData,response){
    		inBox.processTaskActionBatchResponse(aSelectedContextsList, oData, sAction, sForwardToUser);
		};
		
		var fnError = function(oError) {
			inBox._handleErrorOnBatchRequests(oError, sAction, iTotalNumberOfRequests);
	    };
	    
	    this.oDataManager.fireBatchRequest({
	    	sPath : sAction,
	    	sMethod : "POST",
	    	sBatchGroupId : "standardActionBatch",
	    	aUrlParameters : aUrlParameters,
	    	numberOfRequests : selectedIDListLength,
	    	fnSuccess : fnSuccess,
	    	fnError : fnError
	    });
	    
    } else {
    	var oActionEntry = {};
    	oActionEntry.InstanceID = decodeURIComponent(concatSelectedIDs);
    	oActionEntry.SAP__Origin = concatSAPOrigins;
    	if (isForwardAction)
    		oActionEntry.ForwardTo = oEvent.getParameter('selectedForwardToUsers');
    	
    	var fnSuccess = function(data, request) {
        	if (inBox.clientUpdate) {
          	   var aCompletedTaskContexts = [], aChangeContextValues = [];
          	   inBox.hideBusyLoader();
           	   inBox.selectedContexts = aSelectedContextsList;
           	   var aStatusFilterParamValues = inBox._getAppliedStatusFilterValues();
           	   if (sAction === 'Forward' || aStatusFilterParamValues.length > 0 && (jQuery.inArray(data.Status,aStatusFilterParamValues)) === -1) {
           		  if(oSelectedRow) 
           			  aCompletedTaskContexts.push({orow: oSelectedRow, context: aSelectedContextsList[0]});
  	       		  else 
  	       			  aCompletedTaskContexts.push(aSelectedContextsList[0]);
           	   }
           	   aChangeContextValues.push({context: aSelectedContextsList[0], keys : [{key: 'Status', value: data.Status}, {key: 'IsEscalated', value: data.IsEscalated}]});
           	   inBox._refreshLocal(aCompletedTaskContexts, aChangeContextValues, true);
              }
          	
          	if(inBox.clientUpdate === undefined) 
          		inBox.applyFilterOnResponse(aSelectedContextsList);
          	
          	if(sAction === "Forward")
          		inBox.showMessage("success", inBox._oBundle.getText("INBOX_MSG_FORWARD_ACTION_SUCCESS",[data.TaskTitle, sForwardToUser]));
          	else 
          		inBox.showMessage("success", inBox._oBundle.getText("INBOX_MSG_ACTION_SUCCESS",[sAction,data.TaskTitle]));
          };
          
          var fnError = function(oError) {
        	  inBox._handleErrorOnActionFailed(oError, sAction, inBox.getCoreModel().getProperty("TaskTitle", aSelectedContextsList[0]));
          };
          
          inBox.oDataManager.callFunctionImport(sAction, {
        	  method : "POST",
        	  urlParameters : oActionEntry,
        	  success : fnSuccess,
        	  error : fnError
          }, true);
    }
};

sap.uiext.inbox.Inbox.prototype.processTaskActionBatchResponse = function(aSelectedContextsList, oData, sAction, sForwardToUser) {
	var batchResponses = oData.__batchResponses;
	var i, j, iBatchResLength, len, sTaskTitle, bErrorinChangeResponse;
    var iNoOfErrors = 0, iNoOfSuccess = 0, aCompletedTaskContexts = [], aChangeContextValues = [];
    	for(i = 0, len = batchResponses.length; i < len; i++){
    		var aChangeResponses = batchResponses[i].__changeResponses;
	        	if(aChangeResponses){
	        		for(j = 0, iBatchResLength = aChangeResponses.length; j < iBatchResLength ; j++){
	        			var oChangeResponse = aChangeResponses[j];
                        if (iBatchResLength === 1) {
	        				sTaskTitle = oChangeResponse.data.TaskDefinitionName;
                        }
                        bErrorinChangeResponse = !(oChangeResponse.statusCode >= 200 && oChangeResponse.statusCode <= 202);
                 
                        if(bErrorinChangeResponse){
                        	iNoOfErrors = iNoOfErrors+1 ;
                        } 
                        else {
                        	iNoOfSuccess = iNoOfSuccess + 1;
                  	  	}
                    }
	           } 
	           else {
	        	   iNoOfErrors = iNoOfErrors+1;
	           }
	      }
    	if(this.clientUpdate === undefined) {
    		this.applyFilterOnResponse(aSelectedContextsList);
        }
    	this.displayMessageAfterExecutingAction( sAction, sTaskTitle, iNoOfErrors, iNoOfSuccess, sForwardToUser);
};

sap.uiext.inbox.Inbox.prototype.displayMessageAfterExecutingAction = function ( sAction, sTaskTitle, iNoOfErrors, iNoOfSuccess, sForwardToUser) {
	
	/*TODO code needs to be varified and refactored.
	combine handling of standard as well custom action in one single function.
	*/
	
	if(iNoOfErrors > 0){
		var sErrorMessage = (iNoOfErrors === 1) ? this._oBundle.getText("INBOX_MSG_ACTION_FAILED", [sAction, iNoOfErrors]) :  this._oBundle.getText("INBOX_MSG_ACTION_FAILED_MULTIPLE_TASKS", [sAction, iNoOfErrors]) ; 
		this.showMessage("error",  sErrorMessage);
    }
	
	if(iNoOfSuccess === 1){
		var sMessage = sAction === "Forward" ? this._oBundle.getText("INBOX_MSG_FORWARD_ACTION_SUCCESS",[sTaskTitle, sForwardToUser]) : this._oBundle.getText("INBOX_MSG_ACTION_SUCCESS",[sAction, sTaskTitle]);
		this.showMessage("success",  sMessage);
	}
	   
	if(iNoOfSuccess > 1) {
		this.showMessage("success", this._oBundle.getText("INBOX_MSG_ACTION_SUCCESS_MULTIPLE_TASKS",[sAction, iNoOfSuccess]));
	} 
		
};

sap.uiext.inbox.Inbox.prototype.fillAttributes = function() {
    var inBox = this;
    var oFacetFilter = sap.ui.getCore().byId(this.getId()+'--'+'filterFacet');
    if(oFacetFilter != undefined){
        var taskTypes = inBox.applyTaskCategoryFilter ? inBox.constants.aDrillDownFilterMetadata [1].attributes :
        	inBox.bShowNoDueDateFilter ? inBox.constants.aFilterMetaDataWithNoDueDate[0].attributes : inBox.constants.aFilterMetaData[0].attributes;
        var taskParentAttr = inBox.applyTaskCategoryFilter ? oFacetFilter.getLists()[1] : oFacetFilter.getLists()[0];
        if(taskParentAttr === undefined || taskParentAttr === null)
            return;
            
        var taskAttributes = taskParentAttr.getItems();

        jQuery.each(taskAttributes, function(i, attr) {
            // TODO : here comparison is dependent on the language of TaskTitle.
            var attrIDPos = inBox.inboxUtils.inArray(attr.getKey(),taskTypes);
            if(attr.getKey()!='sapUiFacetFilter_ALL') {
                if(attrIDPos === -1)
                {
                    taskParentAttr.removeItem(attr);
                }else{
                    taskTypes.splice(attrIDPos,1);
                }
            }
        });
        
        if (taskTypes.length > 0) {
            jQuery.each(taskTypes, function(i, taskType) {
                // If TaskTypes have specialCharacters this is failing - needs to be checked
                var taskTypeID = inBox.inboxUtils.scrub(taskType.key);
                var oAttribute = sap.ui.getCore().byId(inBox.getId() + '--' + taskTypeID);
                if (oAttribute === undefined)
                	oAttribute = new sap.ui.core.ListItem(inBox.getId() + '--' + taskTypeID,{text: taskType.value, key:taskType.key}).data("InstanceID",taskType.instanceID).data("SAP__Origin",taskType.sap__Origin);
                taskParentAttr.addItem(oAttribute);
            });
        }
    }
};

sap.uiext.inbox.Inbox.prototype.resetFilterView = function(bClearTableBinding) {
    var appliedDDFilter;
    if (this.filtersToApply.dropDownFilter) {
        appliedDDFilter = this.filtersToApply.dropDownFilter;
    } else if (this.filtersToApply.resStat != undefined || this.filtersToApply.readyStat != undefined
            || this.filtersToApply.InProStat != undefined) {
        appliedDDFilter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.NE, "COMPLETED");
    }
    this.filtersToApply = {};
    if (appliedDDFilter != undefined) {
        this.filtersToApply.dropDownFilter = appliedDDFilter;
    }
    
    var aFilterKeysData = this.bShowNoDueDateFilter ? sap.uiext.inbox.InboxConstants.aFilterMetaDataWithNoDueDate : sap.uiext.inbox.InboxConstants.aFilterMetaData;
    for (var idx = 0; idx < aFilterKeysData.length; idx++) {
        var attr = sap.ui.getCore().byId(this.getId() + '--' + aFilterKeysData[idx].name);
        if (attr != undefined)
            attr.setSelectedKeys(["sapUiFacetFilter_ALL"]);
    }
    if(bClearTableBinding)
        this.applyFilterOnResponse(null);
    
};

sap.uiext.inbox.Inbox.prototype.getlistTableSelectedIndices = function() {
    var listTable = sap.ui.getCore().byId(this.getId() + '--' + 'listViewTable');
    return listTable.getSelectedIndices();
};

sap.uiext.inbox.Inbox.prototype.getCoreModel = function() {
	if(!this._oModel){
		this._oModel = sap.ui.getCore().byId(this.getId() + '--' + 'listViewTable').getModel();
	}
	return this._oModel;
};

sap.uiext.inbox.Inbox.prototype.getnavigateTaskExecMetadata = function() {
    // var taskExecMeta = {};
    var oListTable = sap.ui.getCore().byId(this.getId() + '--' + 'listViewTable');
    var taskExecutionURLs = [];
    var taskExecIDs = [];
    var taskExecTitles = [];
    var aTaskExecSAPOrigins = [];
    var aSelectedContexts = [];
    var selectedIndices = this.getlistTableSelectedIndices();
    var oModel = this.getCoreModel();
    jQuery.each(selectedIndices, function(i, selIndex) {
        var rowContext = oListTable.getContextByIndex(selIndex);
        aSelectedContexts.push(rowContext);
        // taskExecIDs.push(oModel.getProperty("ID",rowContext));
        taskExecIDs.push(oModel.getProperty("InstanceID", rowContext));
        taskExecTitles.push(oModel.getProperty("TaskTitle", rowContext));
        aTaskExecSAPOrigins.push(oModel.getProperty("SAP__Origin", rowContext));
    });
    if (this.getTaskExecutionURLCallBack != "" && this.getTaskExecutionURLCallBack != undefined && this.getTaskExecutionURLCallBack !== null){
    	var taskUiURL = this.getTaskExecutionURLCallBack(taskExecIDs[0],aTaskExecSAPOrigins[0]);
    	if(taskUiURL !== null && taskUiURL.replace(/\s/g, "").length > 0){
    		taskExecutionURLs.push(taskUiURL);
    	}
    }
    else{
        taskExecutionURLs.push("");
    }
    /*
     * taskExecMeta["arrayURLs"] = taskExecutionURLs; taskExecMeta["arrayIDs"] = taskExecIDs; taskExecMeta["arrayTitles"] =
     * taskExecTitles;
     */
    return {
    	aSelectedContexts : aSelectedContexts,
        arrayURLs : taskExecutionURLs,
        arrayIDs : taskExecIDs,
        arrayTitles : taskExecTitles,
        aTaskSAPOrigins : aTaskExecSAPOrigins
    };
};

sap.uiext.inbox.Inbox.prototype.getlistTableSelectedContexts = function() {
    var selectedContexts = [];
    var selectedIndices = this.getlistTableSelectedIndices();
    var oListTable = sap.ui.getCore().byId(this.getId() + '--' + 'listViewTable');
    jQuery.each(selectedIndices, function(i, selIndex) {
        selectedContexts.push(oListTable.getContextByIndex(selIndex));
    });
    return selectedContexts;
};

sap.uiext.inbox.Inbox.prototype.showBusyLoader = function() {
    sap.ui.core.BusyIndicator.show(0);
    var busyLoader = jQuery.sap.byId("busy_loader");
    busyLoader.css('position', 'absolute');
    busyLoader.css('top', "50%");
    busyLoader.css('left', "50%");
    busyLoader.css('display', '');
    busyLoader.show();
    busyLoader.css('z-index', 99);

};

sap.uiext.inbox.Inbox.prototype.hideBusyLoader = function() {
    sap.ui.core.BusyIndicator.hide();
    var busyLoader = jQuery.sap.byId("busy_loader");
    busyLoader.css('display', 'none');
    busyLoader.css('z-index', -1);
};

sap.uiext.inbox.Inbox.prototype.resetSearchCriteria = function() {
    var srchFld = sap.ui.getCore().byId(this.getId() + '--' + 'searchField');
    srchFld.setValue("");
};

sap.uiext.inbox.Inbox.prototype.loadExecImages = function() {
    var requrl = this._imgResourcePath + sap.uiext.inbox.InboxConstants.prevBtnImage;
    var requrl1 = this._imgResourcePath + sap.uiext.inbox.InboxConstants.nxtBtnImage;
    jQuery.ajax({
        url : requrl,
        type : "GET",
        async : true,
        success : function(data, textStatus, XMLHttpRequest) {
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            // TODO Add proper Error handling and Messaging
        }
    });

    jQuery.ajax({
        url : requrl1,
        type : "GET",
        async : true,
        success : function(data, textStatus, XMLHttpRequest) {
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            // TODO Add proper Error handling and Messaging
        }
    });
};

/*sap.uiext.inbox.Inbox.prototype.getRowSettingsCookieValue = function() {
    var i, x, y, aCookies = document.cookie.split(";");
    for (i = 0; i < aCookies.length; i++) {
        x = aCookies[i].substr(0, aCookies[i].indexOf("="));
        y = aCookies[i].substr(aCookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == (this.getId() + "nOfRows")) {
            return unescape(y);
        }
    }
};*/

/*sap.uiext.inbox.Inbox.prototype.setRowSettingsCookieValue = function(value, exDays) {
    // var exdate = new Date();
    // exdate.setDate(exdate.getDate() + exDays);
    // var c_value = escape(value) + ((exDays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = this.getId() + "nOfRows" + "=" + escape(value);// c_value;
    this.setNoOfRowsOnTable(value);
};*/

sap.uiext.inbox.Inbox.prototype.setNoOfRowsOnTable = function(value) {
    var table = sap.ui.getCore().byId(this.getId() + '--' + 'listViewTable');
    if (table != undefined)
        table.setVisibleRowCount(parseInt(value, 10));
};


sap.uiext.inbox.Inbox.prototype.showMessage = function(messageType, messageText) {
  
	var that = this;
	var oNotificationBar = sap.ui.getCore().byId(this.getId() + '--' + 'notificationBar');
	var oMessageNotifier = sap.ui.getCore().byId(this.getId() + '--' + 'messageNotifier');
	
	if (oNotificationBar != undefined) {
	
		oNotificationBar.setVisibleStatus(sap.ui.ux3.NotificationBarStatus.Default);
		var now = new Date();
		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({style : "medium"}); 
		var formattedDateTime = oDateFormat.format(now);
    	var oMessage = new sap.ui.core.Message({
    			text : messageText,
    			timestamp : formattedDateTime
    		});
    	
    	if (messageType === "success"){	
        	oMessage.setLevel(sap.ui.core.MessageType.Success);
        } else if (messageType === "info") {
        	oMessage.setLevel(sap.ui.core.MessageType.Information);
        } else if ( messageType === "error") { 
       		oMessage.setLevel(sap.ui.core.MessageType.Error);
        } else if ( messageType === "warning") {
       		oMessage.setLevel(sap.ui.core.MessageType.Warning);
        }

        oMessageNotifier.addMessage(oMessage);
    	oNotificationBar.setMessageNotifier(oMessageNotifier);

    	// This workaround is added, because NotificationBar does not support auto focus for accessability (2/2)
    	// For more details check Internal Incident 1580169447: ACC 264 : NW750_SP00_I/O_BPM : Text : Notification text not being read out
		jQuery.sap.delayedCall(0, this, function () {
			oNotificationBar._oItemNavigation.focusItem(1);
		});
 }
};

sap.uiext.inbox.Inbox.prototype.deleteMessage = function(oEvent, inBox) {
    if (inBox === undefined)
        inBox = this;
    var oNotificationBar = sap.ui.getCore().byId(inBox.getId() + '--' + 'notificationBar');
    var sMin = sap.ui.ux3.NotificationBarStatus.Min;
    if (oNotificationBar != undefined && oNotificationBar.hasItems()) {
        oNotificationBar.setVisibleStatus(sMin);
    }
};

sap.uiext.inbox.Inbox.prototype.getFormattedDateTimeOff = function(subT, isNow) {
    var myDate = new Date();
    myDate.setDate(myDate.getDate() - subT);
    if(!isNow){
        myDate.setHours(0);
        myDate.setSeconds(0);
        myDate.setMinutes(myDate.getTimezoneOffset());
    }
    return myDate;
};

sap.uiext.inbox.Inbox.prototype.getFormattedDueDateTimeOff = function(subT) {
  var myDate = new Date();
  myDate.setDate(myDate.getDate() + subT);
  myDate.setHours(0);
  myDate.setSeconds(0);
  myDate.setMinutes(myDate.getTimezoneOffset());
  return myDate;
};

sap.uiext.inbox.Inbox.prototype.refreshTaskTypes = function(){
	if(this.dynamicTaskTypeFilterCallBack) {
		if (this.applyTaskCategoryFilter){
    		this.constants.aDrillDownFilterMetadata [1].attributes = this.dynamicTaskTypeFilterCallBack();
    	} else if (this.bShowNoDueDateFilter) {
    		this.constants.aFilterMetaDataWithNoDueDate[0].attributes = this.dynamicTaskTypeFilterCallBack();
    	} else {
    		this.constants.aFilterMetaData[0].attributes = this.dynamicTaskTypeFilterCallBack();
    	}
        this.fillAttributes();
        return;
    }
  var oTable = sap.ui.getCore().byId(this.getId() + '--' + 'listViewTable');
  var aTaskDefinitions = [];
  var oMap = {};
  var oTaskDefinition;
  if (this.getHandleBindings()) {
      var iLengthT=this._currentViewElement().getBinding("rows");
      var oContexts = this._currentViewElement().getBinding("rows").getContexts(null,iLengthT.iLength);
      var oModel = this.getCoreModel();
      jQuery.each(oContexts, function(i, oContext) {
    	  oTaskDefinition = {"key":oModel.getProperty("TaskDefinitionID", oContext), "value":oModel.getProperty("TaskDefinitionName", oContext),"sap__Origin":oModel.getProperty("SAP__Origin", oContext)};
            if (!oMap[oTaskDefinition.key]) {
                oMap[oTaskDefinition.key] = true;
                aTaskDefinitions.push(oTaskDefinition);
            }
      });
  }else{
      var oListBinding = this._currentViewElement().getBinding("rows");
      if(oListBinding && oListBinding.oList){
	      jQuery.each(oListBinding.oList, function(i, oEntry) {
	    	  oTaskDefinition = {"key":oEntry.TaskDefinitionID, "value":oEntry.TaskDefinitionName};
	          if (!oMap[oTaskDefinition.key]) {
	            oMap[oTaskDefinition.key] = true;
	            aTaskDefinitions.push(oTaskDefinition);
	          }
	      });
      }
  }
  
  if(aTaskDefinitions.length > 0){
	  if (this.applyTaskCategoryFilter) {
			this.constants.aDrillDownFilterMetadata [1].attributes = aTaskDefinitions;
		} else if (this.bShowNoDueDateFilter) {
			this.constants.aFilterMetaDataWithNoDueDate[0].attributes = aTaskDefinitions;
		} else {
			this.constants.aFilterMetaData[0].attributes = aTaskDefinitions;
		}
        this.fillAttributes();
  }
};

sap.uiext.inbox.Inbox.prototype.onAfterRendering = function() {
    // TODO: Apply CSS
    var oTable$ = sap.ui.getCore().byId(this.getId() + '--' + 'listViewTable').$();
    oTable$.find("a:disabled").addClass("sapUiExtInboxLnkDsbl");
    
    // TODO: focus CSS
  /*  var settingsButton$ = sap.ui.getCore().byId(this.getId() + '--' + 'settingsButton').$();
    settingsButton$.hover(function(){
        settingsButton$.css("background-color","transparent");
        });
    settingsButton$.focus(function(){
                                        settingsButton$.css("background-color","transparent");
                                        });
    settingsButton$.css("background-color","transparent");
    
   settingsButton$.addClass("sapUiExtInboxSettingsButton");*///TODO: Confirm the behaviour with PO.
};


sap.uiext.inbox.Inbox.prototype._getComponent = function(sComponentName) { 
    return sap.ui.getCore().byId(this.getId() + '--' + sComponentName); 
};

sap.uiext.inbox.Inbox.prototype._removeParentID = function(sComponentName) { 
    var parentID = this.getId();
    return sComponentName.replace(this.getId()+"--","");
    
};

sap.uiext.inbox.Inbox.prototype.populateViewButtonsContainer = function(viewButtonsContainer) {
	var listViewCell = new sap.ui.commons.layout.MatrixLayoutCell({id : this.getId() + '--' + "segmentedButtonCell"});
	/*var listViewImg = new sap.ui.commons.Image({
		id : this.getId() + '--' +  "tableViewImage",
		src : this._imgResourcePath + sap.uiext.inbox.InboxConstants.tableViewImageSelected,
		text : "",
		tooltip : this._oBundle.getText("INBOX_LIST_VIEW_TOOLTIP")
	});
	listViewImg.attachPress(this, this.switchViews);
	listViewImg.addStyleClass("sapUiExtInboxToolBarContainerHeight");
	listViewCell.addContent(listViewImg);
	listViewCell.setPadding(sap.ui.commons.layout.Padding.None);

	// Uncomment the code for Steam View button and also donot forget to
	// increase the width to 4% while creating the toolBarContainer.
	 var matrixViewCell = new sap.ui.commons.layout.MatrixLayoutCell();
	 var matrixViewImg = new sap.ui.commons.Image({
	 id: this.getId() + '--' + "rrViewImage",
	 src : this._imgResourcePath + sap.uiext.inbox.InboxConstants.rrViewImageUnselected,
	 text : "",
	 tooltip : this._oBundle.getText("INBOX_STREAM_VIEW_TOOLTIP")
	 });
	 matrixViewImg.attachPress(this, this.switchViews);
	 matrixViewImg.addStyleClass("sapUiExtInboxToolBarContainerHeight");
	 matrixViewCell.addContent(matrixViewImg);
	 matrixViewCell.setPadding(sap.ui.commons.layout.Padding.None);*/
	 
	 var oSegmentedButtonViewSelectionLite = new sap.ui.commons.SegmentedButton({id:this.getId() + '--' + 'viewSelectionSegBtn',
			buttons:[new sap.ui.commons.Button({id: this.getId() + '--' + 'tableViewSelectionButton',height: "20px", lite: true,icon: this.constants.tableViewImageSelected,
				iconHovered: this.constants.tableViewImageSelected, iconSelected: this.constants.tableViewImageSelected,
													tooltip:this._oBundle.getText("INBOX_LIST_VIEW_TOOLTIP")}).addStyleClass("sapUiExtInboxSegmentedButtonTransparentSelected"),//.addStyleClass("sapUiExtInboxToolBarContainerHeight"),
			         new sap.ui.commons.Button({id: this.getId() + '--' + 'rrViewSelectionButton',height: "20px", lite: true,icon: this.constants.rrViewImageSelected,
			        	 iconHovered: this.constants.rrViewImageSelected, iconSelected: this.constants.rrViewImageSelected, 
			        	 					tooltip:this._oBundle.getText("INBOX_STREAM_VIEW_TOOLTIP")}).addStyleClass("sapUiExtInboxSegmentedButtonViewSelection")]});//.addStyleClass("sapUiExtInboxToolBarContainerHeight")]});
	 oSegmentedButtonViewSelectionLite.setSelectedButton(this.getId() + '--' + 'tableViewSelectionButton');
	 oSegmentedButtonViewSelectionLite.attachSelect(this, this.switchViews);
	 oSegmentedButtonViewSelectionLite.addStyleClass("sapUiExtInboxToolBarContainerHeight");
	 listViewCell.addContent(oSegmentedButtonViewSelectionLite);
	 listViewCell.setPadding(sap.ui.commons.layout.Padding.None);
	viewButtonsContainer.createRow(listViewCell);
};

sap.uiext.inbox.Inbox.prototype.updateStylingOnSwitchingView = function(buttonSelected, oEvent) {
	var aButtons = oEvent.getSource().getButtons();
	var oButton;
	for( var i=0; i<aButtons.length; i++){
	oButton = aButtons[i];
	    if(buttonSelected.getId() != oButton.getId()) {
	        oButton.addStyleClass("sapUiExtInboxSegmentedButtonViewSelection");
	        oButton.removeStyleClass("sapUiExtInboxSegmentedButtonTransparentSelected");
	      }
     
	 else {
	        oButton.removeStyleClass("sapUiExtInboxSegmentedButtonViewSelection");
            oButton.addStyleClass("sapUiExtInboxSegmentedButtonTransparentSelected");
	      }
	 }
	};	


sap.uiext.inbox.Inbox.prototype.switchViews = function(oEvent, oInbox) {
	//TODO : need to refresh model at each switch so as to see latest data
    var that = oInbox;
    that.resetSearchCriteria();
    var previousView = that.currentView;
    var buttonClicked = sap.ui.getCore().byId(oEvent.getSource().getSelectedButton());
    var tableViewSelectionButtonId = that.getId() + '--' + "tableViewSelectionButton";
    var rrViewSelectionButtonId = that.getId() + '--' + "rrViewSelectionButton";
    var tableView = sap.ui.getCore().byId(that.getId() + '--' + 'listViewTable');
    var tableRowSettings = sap.ui.getCore().byId(that.getId() + '--' + 'tableRowSettingLayoutContainer');
    
    var oTasksRowRepeater = sap.ui.getCore().byId(that.getId() + '--'+'tasksRowRepeater');
    var verticalLayout = sap.ui.getCore().byId(that.getId() + '--' + 'verticalLayoutContainer');
    var actionButtonsToolBar = sap.ui.getCore().byId(that.getId() + '--' + 'actionButtonsToolbarContainer');
    var rowRepeaterToolBar = sap.ui.getCore().byId(that.getId() + '--'+ 'rrToolbar'); 
    var rowRepeaterToolsContent = sap.ui.getCore().byId(that.getId() + '--'+ 'rowRepeaterToolsMatLayout'); 
    var rowRepeaterPaginator = sap.ui.getCore().byId(that.getId()+ '--' +"rowRepeaterPaginator");
    
    var currentViewElement = that._currentViewElement();
    var currentViewElementBinding = currentViewElement.getBinding('rows');
    var taskDefinitionFilter = false, bUpdateBinding = true, aSelectedKeys;
    var jSONModel = that.oModel instanceof sap.ui.model.json.JSONModel ;
    
    that.updateStylingOnSwitchingView(buttonClicked, oEvent) ;
    
    if (that.applyTaskCategoryFilter) {
    	if (buttonClicked.getId() == tableViewSelectionButtonId) {
    		that._modifyFacetFilterOnFilterCategory();
    	} else if (buttonClicked.getId() == rrViewSelectionButtonId) {
    		that._modifyFacetFilterOnFilterCategory(true);
    	}
    }
 
    if(currentViewElementBinding &&  currentViewElementBinding.sFilterParams && currentViewElementBinding.sFilterParams.indexOf('TaskDefinitionID') !== -1){
    	taskDefinitionFilter = true;
    	var oTaskTypefilterList = that._getComponent("INBOX_FILTER_TASK_TYPE");
        aSelectedKeys = oTaskTypefilterList.getSelectedKeys();
    }
    
    //in case of clientUpdate, the sFilterParams are not created. So, we need to check if the TaskDefinition Filter is
    //applied by using the array of Filters.
    if(that.clientUpdate && that._isTaskDefinitionFilterApplied()){
    	taskDefinitionFilter = true;
    	var oTaskTypefilterList = that._getComponent("INBOX_FILTER_TASK_TYPE");
        aSelectedKeys = oTaskTypefilterList.getSelectedKeys();
    }
    
    if(buttonClicked.getId() === tableViewSelectionButtonId){
           that.currentView = that.constants.tableView;
           buttonClicked.setIcon(that.constants.tableViewImageSelected);
           var rrViewSelectionButton = sap.ui.getCore().byId(rrViewSelectionButtonId);
           rrViewSelectionButton.setIcon(that.constants.rrViewImageSelected);
           actionButtonsToolBar.setVisible(true);
           tableView.setVisible(true);
           rowRepeaterToolBar.setVisible(false);
           oTasksRowRepeater.setVisible(false);
           rowRepeaterToolsContent.setVisible(false);
           tableRowSettings.setVisible(true);
           if(taskDefinitionFilter && aSelectedKeys && aSelectedKeys.length === 1){
        	   var aItems = oTaskTypefilterList.getItems();
        	   var key = aSelectedKeys[0];
        	   var aSelectedItem = [];
        	   
        	   for (var j = 0; j < aItems.length; j++) {
        		   if (key === aItems[j].getKey()) {
        			   aSelectedItem.push(aItems[j]);
        			   break;
        		   }
               }
                  //that._modifyListBindingForExpand(true,that.constants.customAttributeNavigationParam);
        	   that._createCustomAttributes(aSelectedItem);
          }
    }
    
    if(buttonClicked.getId() === rrViewSelectionButtonId){
           that.currentView = that.constants.rowRepeaterView;
           
           // removing local table filters if applied
           if (that._isTableFiltered) {
        	   that._removeTableFilters(); 
           }
           buttonClicked.setIcon(that.constants.rrViewImageSelected);
           var tableViewSelectionButton = sap.ui.getCore().byId(tableViewSelectionButtonId);
           tableViewSelectionButton.setIcon(that.constants.tableViewImageSelected);
           if(that.isCustomAttributesEnabled){
                  var customAttrButton = that._getComponent('customAttributesSegBtn');
                  if(customAttrButton && !customAttrButton.getVisible()){
                        customAttrButton.setVisible(true);
                  }
           }
           actionButtonsToolBar.setVisible(false);
           tableView.setVisible(false);
           tableRowSettings.setVisible(false);
           if(oTasksRowRepeater.getModel() === undefined || oTasksRowRepeater.getModel() === null){
                  oTasksRowRepeater.setModel(that.getModel());
           }
           rowRepeaterToolBar.setVisible(true);
           oTasksRowRepeater.setVisible(true);
           rowRepeaterToolsContent.setVisible(true);
           if(oTasksRowRepeater.getBinding('rows')){
        	   //oTasksRowRepeater.setCurrentPage(1);
               var numberOfRows = oTasksRowRepeater.getBinding('rows').iLength;
               //rowRepeaterPaginator.setNumberOfPages(Math.ceil(numberOfRows/5));
               that._updatePaginator(numberOfRows);
           }else{
               if(oEvent.getParameters().triggeredFrom === undefined){
            	   		var oRowRepeaterTemplate = that._getComponent('rrMainMatrixLayout');
                        var initialSort = new sap.ui.model.Sorter("CreatedOn", true);
                        var filtersTobeApplied = that._getFilterArray();
                        if(that.isCustomActionsEnabled){
                               that._deleteCustomActions();
                               var isCompletedTasksSelectedinDD =  that._isCompletedTasksSelected();
                               if(!isCompletedTasksSelectedinDD && taskDefinitionFilter){
                                      if(aSelectedKeys && aSelectedKeys.length === 1){
                                             //need to check if with the key we can store an object. This is too much of an overhead.
                                             var aItems = oTaskTypefilterList.getItems();
                                             var key = aSelectedKeys[0];
                                             var sapOrigin;
                               
                                             for (var j = 0; j < aItems.length; j++) {
                                                    if (key === aItems[j].getKey()) {
                                                           sapOrigin = aItems[j].data("SAP__Origin");
                                                           break;
                                                    }
                                             }
                                            /* var aCustomActionsDefinitionArray = that._getCustomActionsDefinition(null,aSelectedKeys[0],sapOrigin);
                                             //create Columns
                                             if(aCustomActionsDefinitionArray && aCustomActionsDefinitionArray.length>0)
                                                    that._createCustomActionButtons(aCustomActionsDefinitionArray, false);*/
                                      }
                               }
                        }
                        
                        var oParams = that._getBindingParameters();
                        
                        oTasksRowRepeater.bindRows({path: that.sCollectionPath,template: oRowRepeaterTemplate,parameters: oParams,sorter:initialSort,filters:filtersTobeApplied});
                        bUpdateBinding = false;
                        if(jSONModel){
                            var iResultLength = oTasksRowRepeater.getBinding('rows').iLength;
                            that._updatePaginator(iResultLength);
                        }
               }
           }
           //rowRepeaterPaginator.setCurrentPage(1);
    }
    	//This will modify the Browser URL without reloading the page.
	    if (window.history.replaceState) {  // Feature not supported in IE8, IE9
											// IOS Safari 3.2, 4.0, 4.1
											// Opera Mini 5.0-7.0
											// Android 2.1, 3.0, 4.0, 4.1
    	var sURLParameters = window.location.search;
    	var sDefaultViewParam = that.constants.defaultView_URLParameter;
    	if(sURLParameters.indexOf(sDefaultViewParam) != -1){
    		sURLParameters = sURLParameters.replace(sDefaultViewParam + "=" + previousView, sDefaultViewParam + "=" + that.currentView);
    		var htmlFilePath = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
    		window.history.replaceState(null, null, htmlFilePath + sURLParameters);
    	}
    }
    
    that.inboxUtils.setCookieValue (that.constants.defaultView_URLParameter,that.currentView,1);//Setting/Updating Cookie, on view selection  
    
    if(bUpdateBinding){
           if(that.isCustomActionsEnabled){
                        that._deleteCustomActions();
                        var isCompletedTasksSelectedinDD =  that._isCompletedTasksSelected();
                        if(!isCompletedTasksSelectedinDD && taskDefinitionFilter){
                               if(aSelectedKeys && aSelectedKeys.length === 1){
                                      //need to check if with the key we can store an object. This is too much of an overhead.
                                      var aItems = oTaskTypefilterList.getItems();
                                      var key = aSelectedKeys[0];
                                      var sapOrigin;
                        
                                      for (var j = 0; j < aItems.length; j++) {
                                             if (key === aItems[j].getKey()) {
                                                    sapOrigin = aItems[j].data("SAP__Origin");
                                                    break;
                                             }
                                      }
                              }
                               that.applyFilterOnResponse(null,true);
                        }else{
                               that.applyFilterOnResponse(null);
                        }
           }else{
           //that.refreshTaskList(oEvent, oInbox); //TODO: Should we Refresh Tasks using this function call ? 
                  if(oEvent.getParameters().triggeredFrom === undefined){
                        if(jSONModel && (that.currentView === that.constants.rowRepeaterView)){
                               that.applyFilterOnResponse(null,true);
                        }else{ 
                               that.applyFilterOnResponse(null);
                        }
                  }
           }
    }
};

sap.uiext.inbox.Inbox.prototype.createOtherActions = function(oInbox) {
	var that = oInbox;
	var attachmentButton = new sap.ui.commons.ToggleButton({
		id : that.getId() + '--' + 'attachmentsSegBtn',
		visible : false,
		lite : true,
		icon : that._imgResourcePath + sap.uiext.inbox.InboxConstants.attachmentsImage,
		tooltip : this._oBundle.getText("INBOX_SHOW_ATTACHMENTS")
	}).bindProperty("visible", "SupportsAttachments", function (value) {
		if (value) 
			return value;
		else
			return false;
	}).attachPress(this, function(oEvent, that) {
		that._handleActionButtonToggleinRowRepeater(oEvent);
	});

		var commentsButton = new sap.ui.commons.ToggleButton({
			id : that.getId() + '--' + 'commentsSegBtn',
			visible : false,
			lite : true,
			icon : this.constants.commentsImage,
			tooltip : this._oBundle.getText("INBOX_SHOW_COMMENTS")
		}).addStyleClass("sapUiExtInboxRowRepCommentIconColor");
	
		var customAttributesButton = new sap.ui.commons.ToggleButton({
			id : that.getId() + '--' + 'customAttributesSegBtn',
			enabled : true,
			pressed:false, 
			lite : true,
			visible: false,
			tooltip : this._oBundle.getText("INBOX_SHOW_CUSTOM_ATTRIBUTES"),
			icon : this.constants.iconPool.getIconURI("expand")
		});
		customAttributesButton.bindProperty("visible",that.constants.TaskCollection.properties.instanceID,function(sValue){
			 if(that.isCustomAttributesEnabled) {
			 	return true;
		 	 }
			 if(sValue && that.bCustomAttributesVisible){
				var rowId= this.getId();
				var oRegExpToGetRowNumber = (/\d+$/);
				var aRowNumber = oRegExpToGetRowNumber.exec(rowId);
				var oModel = that.getCoreModel();
				var oContext = this.getBindingContext();
			    var sSelectedTaskDefinition = that.getModel().getProperty(that.constants.TaskDefinitionCollection.properties.taskDefnID, oContext);
				var sSelectedTaskInstance = that.getModel().getProperty(that.constants.TaskCollection.properties.instanceID, oContext); 
				var sSapOrigin = that.getModel().getProperty(that.constants.sapOrigin, oContext);
				that._getCustomAttributeContentforRowRepeater(null, aRowNumber[0], sSelectedTaskDefinition, sSelectedTaskInstance, sSapOrigin);
				this.setIcon(that.constants.iconPool.getIconURI("collapse"));
				this.setTooltip(that._oBundle.getText("INBOX_HIDE_CUSTOM_ATTRIBUTES"));
				this.setPressed(true);
				return true;
		 } 
			 return false;
		 });
		
		/*
		 * var attachmentsImage = new sap.ui.commons.Image({ id : that.getId() + '--' + "attachmentsImg", decorative : false,
		 * src: that._imgResourcePath + sap.uiext.inbox.InboxConstants.attachmentsImage // tooltip :
		 * this._oBundle.getText("HAS ATTACHMENTS")//TODO: What Tootip ? });
		 * attachmentsImage.bindProperty("visible","HasAttachments");
		 * 
		 * var commentsImage = new sap.ui.commons.Image({ id : that.getId() + '--' + "commentsImg", decorative : false, src:
		 * that._imgResourcePath + sap.uiext.inbox.InboxConstants.commentsImage // tooltip :
		 * this._oBundle.getText("HAS_COMMENTS")//TODO: What Tootip ? }); commentsImage.bindProperty("visible","HasComments");
		 */
		
		var oCustomAttrButtonCell = new sap.ui.commons.layout.MatrixLayoutCell(that.getId() + '--'+ 'rrCustomAttrButtonCell', {
			hAlign: sap.ui.commons.layout.HAlign.End,
			//padding: sap.ui.commons.layout.Padding.None
		});
		oCustomAttrButtonCell.addContent(customAttributesButton);
		var rrOtherActionMatLay = new sap.ui.commons.layout.MatrixLayout(that.getId() + '--'+ 'rrOtherActionsMatLay',{layoutFixed: false, columns:4, width:"5%"});
		
		rrOtherActionMatLay.createRow(attachmentButton, commentsButton, oCustomAttrButtonCell);
	
		customAttributesButton.attachPress(this, function(oEvent, that) {
			that._handleActionButtonToggleinRowRepeater(oEvent);
		});
		
	return  rrOtherActionMatLay;
};

sap.uiext.inbox.Inbox.prototype._isOverDue = function(value) {
	//need to be overrriddedn in app for different timezones
	if(value === undefined || value === null || value === "")
		return false;
	
	var now = new Date().getTime();
	var overdue = (value.getTime() - now) < 0 ? true : false;
	return overdue;
};

sap.uiext.inbox.Inbox.prototype._currentView = function() {
	return this.currentView;
};

sap.uiext.inbox.Inbox.prototype.createRowRepeaterToolBar = function(oInbox) {
		var that = oInbox;	
	 var actionButtonsToolBar = sap.ui.getCore().byId(this.getId() + '--' + 'rrToolbar');
	 var oRowRepeater = sap.ui.getCore().byId(this.getId() + '--'+'tasksRowRepeater');
	
	 if(!actionButtonsToolBar){
		 var actionButtonsToolBar = new sap.ui.commons.Toolbar(this.getId() + '--' + "rrToolbar");
		 actionButtonsToolBar.setDesign(sap.ui.commons.ToolbarDesign.Standard);
		 actionButtonsToolBar.addStyleClass("sapUiExtInboxActionButtonsToolbarContainer");
		 
		 
		 //TODO: Add Label SortBy:
		 var sortIndex = 0;
		 if (sap.ui.getCore().byId(this.getId() + '--' + 'sortByLabel') === undefined) {
			 var sortByLabel = new sap.ui.commons.Label(this.getId() + '--' + "sortByLabel", {text: this._oBundle.getText("INBOX_SORT_BY_LABEL") + sap.uiext.inbox.InboxConstants.COLON,
				 design: sap.ui.commons.LabelDesign.Bold});
			 actionButtonsToolBar.insertItem(sortByLabel, sortIndex);
		 }
		 //Sort by Drop down list
		var dropdownComboBox = new sap.ui.commons.DropdownBox(this.getId() + '--' + "sortByFilterComboBox", {
		    tooltip : this._oBundle.getText("INBOX_SORT_BY_LABEL"),
		    items : [new sap.ui.core.ListItem(this.getId() + '--' + "li_creationDate", {
		        text : this._oBundle.getText("INBOX_FILTER_CREATION_DATE"),
		        tooltip : this._oBundle.getText("INBOX_SORT_BY_LABEL") +" "+ this._oBundle.getText("INBOX_FILTER_CREATION_DATE")
		    }), new sap.ui.core.ListItem(this.getId() + '--' + "li_taskTitle", {
		        text : this._oBundle.getText("INBOX_TASK_TITLE"),
		        tooltip : this._oBundle.getText("INBOX_SORT_BY_LABEL") +" "+ this._oBundle.getText("INBOX_TASK_TITLE")
		    }), new sap.ui.core.ListItem(this.getId() + '--' + "li_status", {
		        text : this._oBundle.getText("INBOX_STATUS"),
		        tooltip : this._oBundle.getText("INBOX_SORT_BY_LABEL") +" "+ this._oBundle.getText("INBOX_STATUS")
		    })]
		});
		dropdownComboBox.setValue(this._oBundle.getText("INBOX_FILTER_CREATION_DATE"));
		dropdownComboBox.addStyleClass("sapUiExtInboxRowRepeaterSortBy");
		 var _sortByStartDate = new sap.ui.commons.RowRepeaterSorter(this.getId() + '--' + 'sortByStartDate',{sorter:new sap.ui.model.Sorter("CreatedOn",true)});//Ascending
		 var _sortByTaskTitle = new sap.ui.commons.RowRepeaterSorter(this.getId() + '--' + 'sortByTaskTitle',{sorter:new sap.ui.model.Sorter("TaskTitle",true)});//Initialise it as descneding, as toggle would change it to Ascending
		 var _sortByStatus = new sap.ui.commons.RowRepeaterSorter(this.getId() + '--' + 'sortByStatus',{sorter:new sap.ui.model.Sorter("Status",true)});//Initialise it as descneding, as toggle would change it to Ascending
		 oRowRepeater.addSorter(_sortByStartDate);
		 oRowRepeater.addSorter(_sortByTaskTitle);
		 oRowRepeater.addSorter(_sortByStatus);
		 
		dropdownComboBox.attachChange(this, function(oEvent, inBox){
			var oEmptyListItem = inBox._getComponent('li_empty');
			if(this.indexOfItem(oEmptyListItem) !== -1)
				this.removeItem(oEmptyListItem);
			
		    var listItemID = oEvent.getSource().getSelectedItemId();
		    that.resetSearchCriteria();
		    var sorter;
		    if (listItemID === inBox.getId() + '--' + "li_creationDate") {
		    	sorter = sap.ui.getCore().byId(that.getId() + '--' + 'sortByStartDate').getSorter();
		    	sorter.bDescending = !sorter.bDescending;
		    	oRowRepeater.triggerSort(that.getId() + '--' + 'sortByStartDate');
		    }else if(listItemID === inBox.getId() + '--' + "li_taskTitle"){
		    	sorter = sap.ui.getCore().byId(that.getId() + '--' + 'sortByTaskTitle').getSorter();
		    	sorter.bDescending = !sorter.bDescending;
		    	oRowRepeater.triggerSort(that.getId() + '--' + 'sortByTaskTitle');
		    }else if(listItemID === inBox.getId() + '--' + "li_status"){
		    	sorter = sap.ui.getCore().byId(that.getId() + '--' + 'sortByStatus').getSorter();
		    	sorter.bDescending = !sorter.bDescending;
		    	oRowRepeater.triggerSort(that.getId() + '--' + 'sortByStatus');
		    }
		    that._updateRowRepeaterSortImage(sorter.bDescending);
	
		});
		 actionButtonsToolBar.insertItem(dropdownComboBox,sortIndex+1);
		//Sorting indicator image
		 var sortIcon = new sap.ui.commons.Button(this.getId() + '--' + "sortImage", {
			 tooltip : this._oBundle.getText("INBOX_SORT_INDICATOR_DESC"),
			 icon : sap.uiext.inbox.InboxConstants.sortDescImage
		 });
		 sortIcon.addStyleClass("sapUiExtInboxRefreshButtonHeight");
		 sortIcon.attachPress(this, function(oEvent, inBox){
			 var oSortListBox = inBox._getComponent('sortByFilterComboBox');
			 var oListItemID = oSortListBox.getSelectedItemId();
			 var oRowRepeater = sap.ui.getCore().byId(inBox.getId() + '--'+'tasksRowRepeater');
			 
			 inBox.resetSearchCriteria();
			 var sSorterID = inBox.constants.mRRSortMap[inBox._removeParentID(oListItemID)];
			 var oSorter = sSorterID?inBox._getComponent(sSorterID).getSorter():undefined;
			 
			 if(oSorter){
				 oSorter.bDescending = !oSorter.bDescending;
				 oRowRepeater.triggerSort(inBox.getId() + '--' + sSorterID);
				 inBox._updateRowRepeaterSortImage(oSorter.bDescending);
				 if(oSorter.bDescending){
					 this.setIcon(sap.uiext.inbox.InboxConstants.sortDescImage);
					 this.setTooltip(inBox._oBundle.getText("INBOX_SORT_INDICATOR_DESC"));
				 }else{
					 this.setIcon(sap.uiext.inbox.InboxConstants.sortAscImage);
					 this.setTooltip(inBox._oBundle.getText("INBOX_SORT_INDICATOR_ASC"));
				 }
			 }
		 });
		 actionButtonsToolBar.insertItem(sortIcon, sortIndex+2);
		 var oToggleCustomAttributesButton= sap.ui.getCore().byId(this.getId() + '--' + 'toggleCustomAttributes');
		 if (!oToggleCustomAttributesButton) {
		        var oToggleCustomAttributesButton = new sap.ui.commons.ToggleButton(this.getId() + '--' + "toggleCustomAttributes", {
		            tooltip : this._oBundle.getText("INBOX_SHOW_ALL_CUSTOM_ATTRIBUTES"),
		            icon : this.constants.iconPool.getIconURI("expand"),
		            lite : true,
		            visible : false,
		            pressed : false
		        });
		        oToggleCustomAttributesButton.addStyleClass("sapUiExtInboxToggleButtonMarginRight");
		        oToggleCustomAttributesButton.attachPress(that, that._toggleCustomAttributesVisibilityActionEvent);
		        actionButtonsToolBar.insertRightItem(oToggleCustomAttributesButton);
		    }
	 }
		 
		 //Refresh Button and Refresh Link
/*		 if (sap.ui.getCore().byId(this.getId() + '--' + 'rrRefreshImage') === undefined) {
			 
			 var refreshButton = new sap.ui.commons.Image(this.getId() + '--' + "rrRefreshImage", {
				 tooltip : this._oBundle.getText("INBOX_REFRESH_BUTTON_TOOLTIP"),
				 decorative : false
			 });
			 refreshButton.setSrc(this._imgResourcePath + sap.uiext.inbox.InboxConstants.refreshImage);
			 refreshButton.attachPress(that, that.refreshTaskList);
			 refreshButton.addStyleClass("sapUiExtInboxRefreshButtonHeight");
			 actionButtonsToolBar.insertRightItem(refreshButton, 0);
			 
			 var refreshLink = new sap.ui.commons.Link(this.getId() + '--' + "rrRefreshLink", {
				 text : this._oBundle.getText("INBOX_REFRESH_TEXT"),
				 tooltip : this._oBundle.getText("INBOX_REFRESH_BUTTON_TOOLTIP")
			 });
			 refreshLink.attachPress(that, that.refreshTaskList);
			// actionButtonsToolBar.insertRightItem(refreshLink,1);
				/}*/
		 //Here
		 //var settingsButton = that._createRRSettingsButton();
		 //actionButtonsToolBar.insertRightItem(settingsButton, 3);
		 //Seperator
		// var seprtr = new sap.ui.commons.ToolbarSeparator();
		// actionButtonsToolBar.insertRightItem(seprtr,3);
		

		
	 return actionButtonsToolBar;
}

sap.uiext.inbox.Inbox.prototype.createRowRepeaterToolsContent = function(oInbox) {
	var that = oInbox;
	var oTasksRowRepeater = sap.ui.getCore().byId(that.getId() + '--'+'tasksRowRepeater');
	var rowRepeaterToolsMatLayout = new sap.ui.commons.layout.MatrixLayout(that.getId() + '--'+ 'rowRepeaterToolsMatLayout');
//	var rowRepeaterToolsMatLayout = new sap.ui.commons.layout.MatrixLayout(that.getId() + '--'+ 'rowRepeaterToolsMatLayout',{columns:3, width:"100%",widths:["40.5%","44%","5.3%"]});
//["2%","39%","46%","5%"]

	//Paginator
	var oPaginator = new sap.ui.commons.Paginator(that.getId()+ '--' +"rowRepeaterPaginator");
	oPaginator.attachPage(that, function(oEvent, inBox){
		inBox._handleRowRepeaterPaginatorClick(oEvent);
	});
		
	
	
	//Row Repeater Page Settings.
		var oSegmentedButtonIconLite = new sap.ui.commons.SegmentedButton({id:that.getId() + '--' + 'rowRepeaterRowSettingsSegBtn',
			buttons:[new sap.ui.commons.Button({id: that.getId() + '--' + '5RowsSegBtn',lite:true,text:'5',
													tooltip:this._oBundle.getText("INBOX_SET_NUMBER_OF_ROWS_TO") +" "+ this._oBundle.getText("INBOX_NUMBER_FIVE")}).addStyleClass("sapUiExtInboxSegmentedButtonTransparent"),
			         new sap.ui.commons.Button({id: that.getId() + '--' + '10RowsSegBtn',lite:true,text:'10',
			        	 					tooltip:this._oBundle.getText("INBOX_SET_NUMBER_OF_ROWS_TO") +" "+ this._oBundle.getText("INBOX_NUMBER_TEN")}).addStyleClass("sapUiExtInboxSegmentedButtonTransparent"),
		           new sap.ui.commons.Button({id: that.getId() + '--' + '20RowsSegBtn',lite:true,text:'20',
		          	 					tooltip:this._oBundle.getText("INBOX_SET_NUMBER_OF_ROWS_TO") +" "+ this._oBundle.getText("INBOX_NUMBER_TWENTY")}).addStyleClass("sapUiExtInboxSegmentedButtonTransparent")
	    ]});
		
		oSegmentedButtonIconLite.attachSelect(function(oEvent) {
				var rowSettingValue = parseInt(sap.ui.getCore().byId(oEvent.getParameters().selectedButtonId).getText());
				var aButtons = this.getButtons();
				for (var i = 0; i < aButtons.length; i++) {
					aButtons[i].removeStyleClass("sapUiExtInboxSegmentedButtonTransparentSelected");
				}
				 
				sap.ui.getCore().byId(oEvent.getParameters().selectedButtonId).addStyleClass("sapUiExtInboxSegmentedButtonTransparentSelected");
					oTasksRowRepeater.setNumberOfRows(rowSettingValue);
					
					//TODO: Need a null check here
					if (oTasksRowRepeater.getBinding('rows')){
					var numberOfRows = oTasksRowRepeater.getBinding('rows').iLength;
					that._updatePaginator(numberOfRows);
					}
		 });
		
		// check for URL Parameter for the number of rows in stream view
		if (that.rrViewRowCountValue != null && that.rrViewRowCountValue != undefined){
        if (parseInt(that.rrViewRowCountValue) === 5 || parseInt(that.rrViewRowCountValue) === 10 || parseInt(that.rrViewRowCountValue) === 20){
        	oSegmentedButtonIconLite.fireSelect({selectedButtonId:that.getId() + '--' + parseInt(that.rrViewRowCountValue) + 'RowsSegBtn'}); 
        	oSegmentedButtonIconLite.setSelectedButton(that.getId() + '--' + parseInt(that.rrViewRowCountValue) + 'RowsSegBtn');
    		sap.ui.getCore().byId(oSegmentedButtonIconLite.getSelectedButton()).addStyleClass("sapUiExtInboxSegmentedButtonTransparentSelected");
        }
        	
        else {
        	oTasksRowRepeater.setNumberOfRows(parseInt(that.rrViewRowCountValue));
        	if (oTasksRowRepeater.getBinding('rows')){
        		var noOfRows = oTasksRowRepeater.getBinding('rows').iLength;
        		that._updatePaginator(noOfRows);
        		} 
        	}
		}
        
        else{
        	oSegmentedButtonIconLite.setSelectedButton(that.getId() + '--' + '5RowsSegBtn');
    		sap.ui.getCore().byId(oSegmentedButtonIconLite.getSelectedButton()).addStyleClass("sapUiExtInboxSegmentedButtonTransparentSelected");
        }
		
	//rowRepeaterToolsMatLayout.createRow(new sap.ui.commons.TextView({text : ' '}));	
	var separatorCell = new sap.ui.commons.layout.MatrixLayoutCell(that.getId() + '--' + "separatorRRViewCell");
	var separatorView = new sap.ui.commons.TextView({id:that.getId() + '--' + 'separator',text:"|"});
	separatorCell.addContent(separatorView);
	separatorCell.setPadding(sap.ui.commons.layout.Padding.None);
	var oBorderLayout2 = new sap.ui.commons.layout.BorderLayout(that.getId() + '--'+ 'borderLayout', {width: "100%", height: "40px"});
	//oBorderLayout2.addStyleClass("sapUIExtInboxRRToolBarStyle");

//	var settingsButton = that._createRRSettingsButton();
	 //Commenting this out as it creates a scrollbar in IE8, instead creating row with empty textview.
//	oBorderLayout2.createArea(sap.ui.commons.layout.BorderLayoutAreaTypes.top, new sap.ui.commons.TextView({text : ' '}));
//	oBorderLayout2.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.top, {
//		size : "10px",
//		contentAlign : "center",
//		visible : true
//	});
  
	/*oBorderLayout2.createArea(sap.ui.commons.layout.BorderLayoutAreaTypes.begin, settingsButton);
	oBorderLayout2.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.begin, {
		size : "20%",
		contentAlign : "left",
		visible : true
	});*/

	oBorderLayout2.createArea(sap.ui.commons.layout.BorderLayoutAreaTypes.center, oPaginator);
	oBorderLayout2.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.center, {
		size :"55%",
		contentAlign : "right",
		visible : true
	});

	oBorderLayout2.createArea(sap.ui.commons.layout.BorderLayoutAreaTypes.end, oSegmentedButtonIconLite);
	oBorderLayout2.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.end, {
		size : "45%",
		contentAlign : "right",
		visible : true
	});
	rowRepeaterToolsMatLayout.createRow(new sap.ui.commons.TextView({text : ' '}));//Fix For Footer scrollbar issue in IE8
	rowRepeaterToolsMatLayout.createRow(oBorderLayout2);
	return rowRepeaterToolsMatLayout;
	
};

sap.uiext.inbox.Inbox.prototype._createCustomAttributesLayoutForRRView = function(oCustomAttributeMetaDataArray,oCustomAttributesValues, rowNumber) {
	var that = this;
	var oModel = this.getCoreModel();
	var counter = 1;
	var iNumberofAttributes = oCustomAttributeMetaDataArray.length;
	
	var oCustomAttributesOuterLayout = new sap.ui.commons.layout.MatrixLayout({
	    layoutFixed : true,
	    width : "100%"
		});
	var oCustomAttributesRRViewMatrixLayout = new sap.ui.commons.layout.MatrixLayout();
	var oLabel, oTView , oBorderLayout, oBorderAreaConfig = {
																									size : "33.33%",
																									overflowX : 'hidden',
																									overflowY : 'hidden',
																									contentAlign : "left",
																									visible : true
																								};
	
	jQuery.each(oCustomAttributeMetaDataArray, function(index, caDefinition) {
		if(oCustomAttributesValues[caDefinition.Name]){
			//use the counter to create the numerical index , with which id is generated
			var sLabelID =  that.getId() + '--' + 'customattr'+'-label-'+'-row-'+rowNumber+'-index-' + (counter - 1);
			var sTViewID = that.getId() + '--' +  'customattr'+'-value-'+'-row-'+rowNumber+'-index-' + (counter - 1);
			oLabel = that.oCore.byId(sLabelID) || new sap.ui.commons.Label({
																			  	id :sLabelID,
																			  	text : caDefinition.Label
																			  })
																			.data("customAttrName", caDefinition.Name);
			
			oTView = that.oCore.byId(sTViewID) || new sap.ui.commons.TextView({
																					id : sTViewID
																				})
																				.data("customAttrName",caDefinition.Name);
			oTView.setText(oCustomAttributesValues[caDefinition.Name]);
			oLabel.setLabelFor(oTView);
			
			//====Layout Logic STARTS===
			var custAttrLblValueMatLay = that._createLabelValueMatrixLayout(oLabel, oTView);
			
			//better variable Name?
			//based on the custom Attribute index, calculate the position in the Border Area
			var iPosition = counter % 3;
			var oAreaType = (iPosition === 1) ? sap.ui.commons.layout.BorderLayoutAreaTypes.begin : ((iPosition === 2) ?  sap.ui.commons.layout.BorderLayoutAreaTypes.center : sap.ui.commons.layout.BorderLayoutAreaTypes.end);
			
			//create a nw Border Area, for every 1,4,7.. custom attribute.
			oBorderLayout = (iPosition === 1) ? new sap.ui.commons.layout.BorderLayout({width: "100%", height: "18px"}) : oBorderLayout;
			oBorderLayout.createArea(oAreaType, custAttrLblValueMatLay);
			oBorderLayout.setAreaData(oAreaType, oBorderAreaConfig);
			
			//for every second custom Attribute in the border area, check if it is the last one, and create a dummy element for the border end (for proper alignment)
			if(iPosition === 2 && counter === iNumberofAttributes) {
				 oBorderLayout.createArea(sap.ui.commons.layout.BorderLayoutAreaTypes.end, new sap.ui.commons.TextView({text:' '}));
				 oBorderLayout.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.end, oBorderAreaConfig);
			}
			//====Layout Logic ENDS====
			//add the Border Layout to the cell after processing every 3,6 .. custom Attribute or the last one
			if(iPosition === 0 || counter === iNumberofAttributes){
				var oCell = new sap.ui.commons.layout.MatrixLayoutCell();
				oCell.addStyleClass("sapUiExtInboxPaddingBottom");//This is to reduce the spacing between two rows of custom attributes in Row repeater.
				oCell.addContent(oBorderLayout);
				oCustomAttributesRRViewMatrixLayout.createRow(oCell);
			}
			counter++;
		}
	});
	
	//add the whole Custom Attribute to the Outer Matrix Layout.
	var oCellOuter = new sap.ui.commons.layout.MatrixLayoutCell()
							     .addContent(oCustomAttributesRRViewMatrixLayout)
							     .addStyleClass('sapUIExtInboxCustomAttributesBorder');
	
	oCustomAttributesOuterLayout.createRow(oCellOuter);
	return oCustomAttributesOuterLayout;
};

sap.uiext.inbox.Inbox.prototype._currentViewElement = function() {
	var oTable = sap.ui.getCore().byId(this.getId() + '--' + 'listViewTable');
	var oRowRepeater = sap.ui.getCore().byId(this.getId() + '--' + 'tasksRowRepeater');
	
	var oBindingInfo, currentViewElement;
	if(this.currentView === sap.uiext.inbox.InboxConstants.tableView){
		currentViewElement = oTable;
	}else if(this.currentView === sap.uiext.inbox.InboxConstants.rowRepeaterView){
		currentViewElement = oRowRepeater;
	}
	return currentViewElement;
};

sap.uiext.inbox.Inbox.prototype._updatePaginator = function(length) {
	var oPaginator = this._getComponent('rowRepeaterPaginator'),
	oSegmentedButton = this._getComponent('rowRepeaterRowSettingsSegBtn'),
	oTasksRowRepeater = this._getComponent('tasksRowRepeater');
	
	if(!oPaginator){
		var oPaginator = new sap.ui.commons.Paginator(this.getId()+ '--' +"rowRepeaterPaginator");
		oPaginator.attachPage(this, function(oEvent, inBox){
			inBox._handleRowRepeaterPaginatorClick(oEvent);
		});
		var oBorderLayout2 =this._getComponent('borderLayout');
		if(oBorderLayout2){
			var oRRBorderlayoutCenter = oBorderLayout2.getCenter();
			if(oRRBorderlayoutCenter){
				oRRBorderlayoutCenter.addContent(oPaginator);
			}
			
		}
	}
	
	if (this.rrViewRowCountValue != null && this.rrViewRowCountValue != undefined){
		oPaginator.setNumberOfPages(Math.ceil(length/parseInt(this.rrViewRowCountValue)));
	}
	else{
		var rowSettingValue = sap.ui.getCore().byId(oSegmentedButton.getSelectedButton()).getText();
		oPaginator.setNumberOfPages(Math.ceil(length/rowSettingValue));
	}
	oPaginator.setCurrentPage(1);
	oTasksRowRepeater.gotoPage(1);
};

sap.uiext.inbox.Inbox.prototype._createLabelValueMatrixLayout = function(sLabel, sValue){//TODO: Provide dynamic id to the controls.
	sLabel.addStyleClass("sapUiExtInboxCustomAttLabel").setWrapping(false);

	sValue.addStyleClass("sapUiExtInboxCustomAttValue").setWrapping(false);

var oMLCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
	 hAlign : sap.ui.commons.layout.HAlign.Right,
	   vAlign : sap.ui.commons.layout.VAlign.Top,
	  padding: sap.ui.commons.layout.Padding.End,
	  content : [sLabel]
});
var oMLCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
		hAlign : sap.ui.commons.layout.HAlign.Left,
		vAlign : sap.ui.commons.layout.VAlign.Top,
   padding: sap.ui.commons.layout.Padding.Begin, 
	  content : [sValue]
});

return new sap.ui.commons.layout.MatrixLayout().createRow(oMLCell1, oMLCell2);
};

sap.uiext.inbox.Inbox.prototype._getCustomActionsDefinition = function(sInstanceID, sSapOrigin, aAvailableCustomActionArrayList, callFunctionOnResponse, aSelectedContexts) {
	var that = this;
	var aCustomActionArrayMap = sap.uiext.inbox.InboxConstants.taskInstanceDecisionOptionsMap;
	var aCustomActionArray = aCustomActionArrayMap[sInstanceID];
	if(aCustomActionArray === undefined && sInstanceID){
		var mUrlParams = {InstanceID : "'"+decodeURIComponent(sInstanceID)+"'",
							SAP__Origin : "'"+sSapOrigin+"'",
							$format : "json"};
		
		var fnSuccess = function(oData, response){
							that.selectedContexts = aSelectedContexts;
							aCustomActionArray = aCustomActionArrayMap[sInstanceID] = oData.results;
							if(callFunctionOnResponse){
								callFunctionOnResponse(aCustomActionArray);
							}else{
								that._displayCustomActions(aCustomActionArray, aAvailableCustomActionArrayList);
							}
						};
		
		var fnError = function(oError){
			that.showMessage("error", that._oBundle.getText("INBOX_MSG_FETCH_CUSTOM_ACTION_FAILS"));
		};
		
		this.oDataManager.readData(that.constants.decisionOptionsFunctionImport, {
			urlParameters : mUrlParams,
			success : fnSuccess,
			error: fnError
			}
		);
		
	} else {
		if(callFunctionOnResponse){
			callFunctionOnResponse(aCustomActionArray);
		}else{
			that._displayCustomActions(aCustomActionArray, aAvailableCustomActionArrayList);
		}
	}
};

//TODO : Merge the two methods
sap.uiext.inbox.Inbox.prototype._fetchCustomActionsUsingAsyncCall = function(aInstanceIDs, sSapOrigin, aAvailableCustomActionArrayList, aSelectedContexts) {
	var that = this;
	var iTotalLength = aInstanceIDs.length + aAvailableCustomActionArrayList.length;
	var aCustomActionArray = [];
	var aCustomActionArrayMap = sap.uiext.inbox.InboxConstants.taskInstanceDecisionOptionsMap;
	
	jQuery.each(aInstanceIDs, function(i, sInstanceID) {
		var mUrlParams = {InstanceID : "'"+decodeURIComponent(sInstanceID)+"'",
				SAP__Origin : "'"+sSapOrigin+"'",
				$format : "json"};
		
		var fnSuccess = function(oData, response){
			that.selectedContexts = aSelectedContexts;
			aCustomActionArray = aCustomActionArrayMap[sInstanceID] = oData.results;
			aAvailableCustomActionArrayList.push(aCustomActionArray);
			if(aAvailableCustomActionArrayList.length == iTotalLength){
				that._displayCustomActions(aCustomActionArray, aAvailableCustomActionArrayList);
			}
		};
		
		var fnError = function(oError){
			that.showMessage("error", that._oBundle.getText("INBOX_MSG_FETCH_CUSTOM_ACTION_FAILS"));
		};
		
		that.oDataManager.readData(that.constants.decisionOptionsFunctionImport, {
			urlParameters : mUrlParams,
			success : fnSuccess,
			error: fnError
			}
		);
		
	});
};

sap.uiext.inbox.Inbox.prototype._displayCustomActions = function(aCustomActionArray, aAvailableCustomActionArrayList) {
	this._deleteCustomActionsForTableView();
    //create Custom Actions
	if(aCustomActionArray && aCustomActionArray.length>0){
		aAvailableCustomActionArrayList.push(aCustomActionArray);
	}
	
	function intersectionCustomActions(aLists) {
	    if (aLists.length == 0) return [];
	    else if (aLists.length == 1) return aLists[0];
	    var aIntersection = aLists[0];
	    for (var i = 1; i < aLists.length; i++){
	        aIntersection = intersection(aIntersection, aLists[i]);
	    }
	    return aIntersection;
	}

	function intersection(aArray1, aArray2) {
		var results = [];
		var i, j;
		var arr1Length = aArray1.length;
		var arr2Length = aArray2.length;

		for (i = 0; i < arr1Length; i++) {
			for (j = 0; j < arr2Length; j++) {
				if (aArray1[i].DecisionKey === aArray2[j].DecisionKey) {
					results.push(aArray1[i]);
				}
			}
		}
		return results;
	}

	var aCommonCustomActions = intersectionCustomActions(aAvailableCustomActionArrayList);
	
	if(aCommonCustomActions && aCommonCustomActions.length > 0)
		this._createCustomActionsForTableView(aCommonCustomActions,true);
};

sap.uiext.inbox.Inbox.prototype._executeCustomAction = function(oSource, sComment) {
	var decisionKey = oSource.data("key");
	var sAction = oSource.getText();
	var inBox = this;
	var view = this.currentView;
    var oListTable, rowContext, oModel;
    var selectedIDs = [], selectedContexts = [], selectedSAPOrigins = []; 
    var selectedStatus = [];
    var concatSelectedIDs, concatSelectedSAPOrigins;
    var comments = [];
    var selectedID, selectedSAPOrigin, sTaskTitle;
    // reset search
    inBox.resetSearchCriteria();
    var oModel = inBox.getCoreModel();
    
    if(view === inBox.constants.tableView){
    	oListTable = inBox._getComponent('listViewTable');
    	var selectedIndices = inBox.getlistTableSelectedIndices();
        
        jQuery.each(selectedIndices, function(i, selIndex) {
            rowContext = oListTable.getContextByIndex(selIndex);
            selectedContexts.push(rowContext);
            
            sTaskTitle = oModel.getProperty("TaskTitle", rowContext);
            selectedID = oModel.getProperty("InstanceID", rowContext);
            selectedSAPOrigin = oModel.getProperty("SAP__Origin", rowContext);
            
            selectedIDs.push(selectedID);
            selectedSAPOrigins.push(selectedSAPOrigin);
            
            if (i == 0){
                concatSelectedIDs = selectedID;
                concatSelectedSAPOrigins = selectedSAPOrigin;
            }
            else{
                concatSelectedIDs = concatSelectedIDs + ";" + selectedID;
                concatSelectedSAPOrigins = concatSelectedSAPOrigins + ";" + selectedSAPOrigin;
            }
        });
   }else if(view === inBox.constants.rowRepeaterView){
	   var oContext = oSource.getBindingContext();
	   sTaskTitle = oModel.getProperty("TaskTitle", rowContext);
	   selectedID = oModel.getProperty("InstanceID", oContext);
       selectedSAPOrigin = oModel.getProperty("SAP__Origin", oContext);
       
       selectedIDs.push(selectedID);
       selectedSAPOrigins.push(selectedSAPOrigin);
       
	   concatSelectedIDs = selectedID;
	   concatSelectedSAPOrigins = selectedSAPOrigin;
	   selectedContexts.push(oContext);
	   var oSelectedRow = oSource.getParent().getParent().getParent().getParent().getParent().getParent();
   }
	
    var IDURIPart, requestURI, requestOptions, status, selectedIDLength, iTotalNumberOfRequests;
    
    selectedIDLength = selectedIDs.length;
    iTotalNumberOfRequests = selectedIDLength;
    
    if((selectedIDLength > 1) && inBox.isBatchOperationSupported){
    	
    	var aUrlParameters = [];
    	for(var i = 0;i < selectedIDLength; i ++){
    		var mUrlParams = {};
    		mUrlParams.InstanceID = "'" + selectedIDs[i] + "'";
    		mUrlParams.SAP__Origin = "'" + selectedSAPOrigins[i]  + "'";
    		mUrlParams.DecisionKey = "'" + decisionKey  + "'";
    		if(sComment){
    			mUrlParams.Comments= "'" + jQuery.sap.encodeURL(sComment) +"'";
    		}
    		aUrlParameters.push(mUrlParams);
        }
    	
    	var fnSuccess = function(data,response){
 		   var batchResponses = data.__batchResponses;
 		   var sTaskTitle = data.TaskTitle;
	       var i, j, iBatchResLength, len;
	       var iNoOfErrors = 0, iNoOfSuccess = 0, aCompletedTaskContexts = [], aChangeContextValues = [];
	       for(i = 0, len = batchResponses.length; i < len; i++){
    	           var aChangeResponses = batchResponses[i].__changeResponses;
    	           if(aChangeResponses){
                       for(j = 0, iBatchResLength = aChangeResponses.length; j < iBatchResLength ; j++){
                           var oChangeResponse = aChangeResponses[j];
                           var bErrorinChangeResponse = !(oChangeResponse.statusCode >= 200 && oChangeResponse.statusCode <= 202);
                           if(bErrorinChangeResponse){
                        	   iNoOfErrors = iNoOfErrors+1 ;
                           }else {
                        	   iNoOfSuccess = iNoOfSuccess + 1;
                        	   if(inBox.clientUpdate){
                        	   inBox.selectedContexts = selectedContexts;
                        	   var oSuccessfulResponseData = oChangeResponse.data;
                        	   if(oSuccessfulResponseData.Status === 'COMPLETED'){
                        		   if(oSelectedRow){
                        			   aCompletedTaskContexts.push({orow: oSelectedRow, context: selectedContexts[i]});
                        		   }else{
                        			   aCompletedTaskContexts.push(selectedContexts[i]);
                        		   }
                  	    	   }
                           } }
                       }
    	           }
    	       }
	       if(inBox.clientUpdate){
	       		inBox._refreshLocal(aCompletedTaskContexts);
	       }
	       if(inBox.clientUpdate === undefined){
	    	   inBox.applyFilterOnResponse(selectedContexts);
	       }
	       if(iNoOfErrors > 0){
	    	   if (iNoOfErrors === 1) {
	    	   inBox.showMessage("error", inBox._oBundle.getText("INBOX_MSG_ACTION_FAILED", [sAction, sTaskTitle])); }
	    	   else {
	    		   inBox.showMessage("error",  inBox._oBundle.getText("INBOX_MSG_ACTION_FAILED_MULTIPLE_TASKS", [sAction, iNoOfErrors]));
	    	   }
	       }else{
	    	   if (iNoOfSuccess > 1) {
	    		   inBox.showMessage("success", inBox._oBundle.getText("INBOX_MSG_ACTION_SUCCESS_MULTIPLE_TASKS",[sAction, iNoOfSuccess])); }
	    	   else {
	    	   inBox.showMessage("success", inBox._oBundle.getText("INBOX_MSG_ACTION_SUCCESS",[sAction, sTaskTitle])); }
	       }
		};
		
		var fnError = function(oError) {
		    inBox._handleErrorOnBatchRequests(oError, sAction, iTotalNumberOfRequests);
	    };
	    
	    this.oDataManager.fireBatchRequest({
	    	sPath : inBox.constants.decisionExecutionFunctionImport,
	    	sMethod : "POST",
	    	sBatchGroupId : "customActionBatch",
	    	aUrlParameters : aUrlParameters,
	    	numberOfRequests : selectedIDLength,
	    	fnSuccess : fnSuccess,
	    	fnError : fnError
	    });
 
    } else {
    	var oActionEntry = {};
    	oActionEntry.InstanceID = decodeURIComponent(concatSelectedIDs);
    	oActionEntry.SAP__Origin = concatSelectedSAPOrigins;
    	oActionEntry.DecisionKey = decisionKey;
    	if(sComment)
    		oActionEntry.Comments = sComment;
    	
    	var fnSuccess = function(data, request) {
	    	 if(inBox.clientUpdate && data.Status === 'COMPLETED'){
	    		 inBox.selectedContexts = selectedContexts;
	    		 if(oSelectedRow)
	    			 inBox._refreshLocal([{orow: oSelectedRow, context: selectedContexts[0]}]);
	    		 else
	    			 inBox._refreshLocal([selectedContexts]);
	    	 }
	    	 if(inBox.clientUpdate === undefined)
	    	 		inBox.applyFilterOnResponse(selectedContexts);
	    	 inBox.showMessage("success", inBox._oBundle.getText("INBOX_MSG_ACTION_SUCCESS",[sAction, data.TaskTitle]));
	    	 
	    };
	    
	    var fnError = function(oError) {
	    //TODO: use enums for messageType.
	    	inBox._handleErrorOnActionFailed(oError, sAction, oModel.getProperty("TaskTitle", selectedContexts[0]));
	    };
	    
	    inBox.oDataManager.callFunctionImport(inBox.constants.decisionExecutionFunctionImport, {
	    	method : "POST",
	    	success : fnSuccess,
	    	error : fnError,
	    	urlParameters : oActionEntry,
	    }, true);
	}
    
    inBox.resetMessages = false;
};

sap.uiext.inbox.Inbox.prototype._deleteCustomActions = function(customActionsDefinition) {
	if(this.currentView === this.constants.tableView){
		this._deleteCustomActionsForTableView();
	}else if(this.currentView === this.constants.rowRepeaterView){
		this._deleteCustomActionsForRowRepeaterView();
	}
};

sap.uiext.inbox.Inbox.prototype._createCustomActionButtons = function(customActionsDefinition,enableButtons) {
	if(this.currentView === this.constants.tableView){
		this._createCustomActionsForTableView(customActionsDefinition,enableButtons);
	}/*else if(this.currentView === this.constants.rowRepeaterView){
		this._createCustomActionsForRowRepeaterView(customActionsDefinition,enableButtons);
	}*/
};

sap.uiext.inbox.Inbox.prototype._deleteCustomActionsForTableView = function(customActionsDefinition) {
	var that = this;
	var oActionButtonsToolBar = this._getActionButtonToolBarForTableView();
	//Get All ToolBar Iems
	var oToolBarItems = oActionButtonsToolBar.getItems();
	for(var i=0; i< oToolBarItems.length; i++){
		var oToolBarItem = oToolBarItems[i];
		if(oToolBarItem instanceof sap.ui.commons.Button &&  oToolBarItem.data("type") === that.constants.customAction){
			oActionButtonsToolBar.removeItem(oToolBarItem);
			oToolBarItem.destroy();
		}
		if(oToolBarItem instanceof sap.ui.commons.ToolbarSeparator &&  oToolBarItem.data("separatorFor") === that.constants.customAction){
			oActionButtonsToolBar.removeItem(oToolBarItem);
			oToolBarItem.destroy();
		}
	}
};


sap.uiext.inbox.Inbox.prototype._createCustomActionsForTableView = function(customActionsDefinition,enableButtons) {
	var that = this;
	var actionButtonsToolBar = this._getActionButtonToolBarForTableView();
	var noOfCustomActions = customActionsDefinition.length;
	var index = 3;
	if(noOfCustomActions > 0){
		var seprtr = new sap.ui.commons.ToolbarSeparator();
		seprtr.data("separatorFor",that.constants.customAction);
		actionButtonsToolBar.insertItem(seprtr,index);
		index++;
	}
	for(var i=0; i < noOfCustomActions; i++){
		var action = customActionsDefinition[i];
		var sDecisionButtonText = !action.DecisionText? action.DecisionKey: action.DecisionText;
		var customActionButton = new sap.ui.commons.Button(this.getId() + '--' + action.DecisionKey+'button', {
		            text : sDecisionButtonText,
		            enabled : enableButtons,
		            tooltip :  action.Description
		        }).data("type",that.constants.customAction).data("key",action.DecisionKey).data("text",action.DecisionText).data("commentsMandatory",action.CommentMandatory);
		customActionButton.attachPress({inbox:that,view:that.constants.tableView}, jQuery.proxy(that._handleCustomActionClick, this));
		        actionButtonsToolBar.insertItem(customActionButton,index);
		        index++;
	}
};

/*sap.uiext.inbox.Inbox.prototype._createCustomActionsForRowRepeaterView = function(customActionsDefinition) {
	var that = this;
	var actionButtonsToolBar = this._getActionButtonToolBarForTableView();
	var noOfCustomActions = customActionsDefinition.length;
	
	var oRowRepeaterTemplate = this._getComponent('rrMainMatrixLayout');
	var oRowRepeaterTemplateActionLayout = this._getComponent('taskActionMatrixLayout');
	var actionRow = oRowRepeaterTemplateActionLayout.getRows()[0];
	for(var i=0; i < noOfCustomActions; i++){
		var action = customActionsDefinition[i];
		var dotLabelCell = new sap.ui.commons.layout.MatrixLayoutCell({
			id : that.getId() + '--' + 'dotLabelCell' + action.DecisionKey,
			hAlign: sap.ui.commons.layout.HAlign.Center,
			vAlign: sap.ui.commons.layout.VAlign.Top,
			colSpan : 1 });
		//DOT Seperator b/w Claim and Release Action Links
		var dotLabel = new sap.ui.commons.Label(that.getId() + '--' + 'dotLabel' + action.DecisionKey,{text:sap.uiext.inbox.InboxConstants.DOT});
		dotLabel.addStyleClass("sapUIExtInboxDotSeperatorStyle");
		dotLabel.data("separatorFor",that.constants.customAction);
		dotLabelCell.addContent(dotLabel);
		actionRow.addCell(dotLabelCell);
		
		var customActionCell = new sap.ui.commons.layout.MatrixLayoutCell({
			id : that.getId() + '--' + 'customActionCell' + action.DecisionKey,
			hAlign: sap.ui.commons.layout.HAlign.Left,
			vAlign: sap.ui.commons.layout.VAlign.Bottom,
			colSpan : 1 });
		
		var customActionLink = new sap.ui.commons.Link(that.getId() + '--' + "rrView" + action.DecisionKey + "link",{tootltip:action.Description});
		var sDecisionLinkText = !action.DecisionText? action.DecisionKey : action.DecisionText ;
		customActionLink.data("type",that.constants.customAction);
		customActionLink.data("key",action.DecisionKey);
		customActionLink.addStyleClass("sapUiExtInboxLnkNoUnderline");
		customActionLink.setText(sDecisionLinkText);
		customActionLink.attachPress({inbox:that,view:that.constants.rowRepeaterView,action:action.DecisionKey}, that._executeCustomAction);
		customActionCell.addContent(customActionLink);
		actionRow.addCell(customActionCell);
	}
};*/

sap.uiext.inbox.Inbox.prototype._deleteCustomActionsForRowRepeaterView = function(customActionsDefinition) {
	var that = this;
	var oRowRepeaterTemplate = this._getComponent('rrMainMatrixLayout');
	var oRowRepeaterTemplateActionLayout = this._getComponent('taskActionMatrixLayout');
	var actionRow = oRowRepeaterTemplateActionLayout.getRows()[0];
	var actionCells = actionRow.getCells();
	for(var i=0; i < actionCells.length; i++){
		var oActionCell = actionCells[i];
		var oActionContent = oActionCell.getContent()[0];
		if(oActionContent instanceof sap.ui.commons.Link &&  oActionContent.data("type") === that.constants.customAction || oActionContent instanceof sap.ui.commons.Label &&  oActionContent.data("separatorFor") === that.constants.customAction){
			actionRow.removeCell(oActionCell);
			oActionCell.destroy();
			oActionContent.destroy();
		}
	}
};


//With Refactor this code moves to the TableView getToolBar
sap.uiext.inbox.Inbox.prototype._getActionButtonToolBarForTableView = function() {
	return this._getComponent("actionButtonsToolbarContainer");
};

//removes or adds the parameter
sap.uiext.inbox.Inbox.prototype._modifyListBindingForExpand= function(add,paramName){
	var constants = this.constants;
	var currentViewElement, oListBinding;
	 if(this.currentView === this.constants.tableView){
	    	currentViewElement = sap.ui.getCore().byId(this.getId() + '--' + 'listViewTable');
	    	if (currentViewElement !== undefined) {
	    		oListBinding = currentViewElement.getBinding('rows');
	    	}
	    }else if(this.currentView === this.constants.rowRepeaterView){
	    	currentViewElement = sap.ui.getCore().byId(this.getId() + '--'+'tasksRowRepeater');
	    	if (currentViewElement !== undefined) {
	            oListBinding = currentViewElement.getBinding('rows');
	    	}
	    }
	var mParameters = oListBinding.mParameters;
	
	if(!mParameters){
		oListBinding.mParameters = {expand:""};
	}
	
	var expandParameters = oListBinding.mParameters.expand;
	if(!expandParameters){
		expandParameters = oListBinding.mParameters.expand = "";
	}	
	
	if(add){
		if(expandParameters){
			if(expandParameters.indexOf(constants.customAttributeNavigationParam) === -1){
				if(expandParameters.length > 0){
					expandParameters = expandParameters + "," ;
				}
				expandParameters = expandParameters + paramName;
			}
		}else{
			expandParameters = paramName;
		}
	}else{
		if(expandParameters && expandParameters.length>0){
			var index = expandParameters.indexOf(paramName);
			if(index >= 0){
				expandParameters = expandParameters.charAt(index - 1) === "," ? expandParameters.replace("," + paramName, '') :expandParameters.replace(paramName, '');
			}
		}
	}
	
	if(expandParameters.length > 0){
		oListBinding.mParameters.expand = expandParameters;
	}else{
		delete oListBinding.mParameters.expand;
	}
	
	
	function getCustomParams(mParameters){
		var aCustomParams = [],
		mSupportedParams = {
				expand: true,
				select: true
		};
		
		for (var sName in mParameters) {
			if (sName in mSupportedParams) {
				aCustomParams.push("$" + sName + "=" + jQuery.sap.encodeURL(mParameters[sName]));
			}
		}
		return aCustomParams.join("&");
	}
	
	oListBinding.sCustomParams = getCustomParams(oListBinding.mParameters);
};

sap.uiext.inbox.Inbox.prototype.populateRefreshButtonContainer = function(refreshButtonContainer) {
	var that = this;
  var refreshViewCell = new sap.ui.commons.layout.MatrixLayoutCell({
      id : this.getId() + '--' + "refreshButtonCell"
  });
  var refreshButton = new sap.ui.commons.Button(this.getId() + '--' + "refreshButton", {
    tooltip : this._oBundle.getText("INBOX_REFRESH_BUTTON_TOOLTIP")
  });
  
  refreshButton.setIcon(sap.uiext.inbox.InboxConstants.refreshImage);
 // refreshButton.addStyleClass("sapUiExtInboxRefreshButtonTransparent");
  refreshButton.attachPress(that, that.refreshTaskList);
  refreshButton.addStyleClass("sapUiExtInboxRefreshButtonHeight");
  refreshViewCell.addContent(refreshButton);
  refreshViewCell.setPadding(sap.ui.commons.layout.Padding.None);

  
  var refreshedOnTextCell = new sap.ui.commons.layout.MatrixLayoutCell({
    id : this.getId() + '--' + "refreshedOnTextCell",
    vAlign: sap.ui.commons.layout.VAlign.Bottom,
    padding: sap.ui.commons.layout.Padding.Top
  });  
  // var separatorCell = new sap.ui.commons.layout.MatrixLayoutCell().setSeparation(sap.ui.commons.layout.Separation.Small);
  var refreshedOnText = new sap.ui.commons.Label(this.getId() + '--' + "refreshOnText");
  that.lastRefreshedOnDateTime = new Date();
  var refreshedTime = that._getFormattedRefreshOnDateTime();
  refreshedOnText.setText(that._oBundle.getText("INBOX_TEXT_ON") + sap.uiext.inbox.InboxConstants.SPACE + refreshedTime);
  refreshedOnText.setTooltip(that._getFormattedTooltipForLastRefreshedTime());
  refreshedOnText.addStyleClass("sapUiExtInboxRefreshedOnStyle");
  refreshedOnTextCell.addContent(refreshedOnText);
	refreshButtonContainer.createRow(refreshViewCell, new sap.ui.commons.Label({text:sap.uiext.inbox.InboxConstants.SPACE}), refreshedOnTextCell);
};

sap.uiext.inbox.Inbox.prototype. _getFormattedRefreshOnDateTime = function(){
	 //var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: sap.uiext.inbox.InboxConstants.REFRESH_ON_DATE_PATTERN}); //Refreshed on Format "Sep 16, 17:22"
	 var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({style : "medium"}); 
	 return oDateFormat.format(this.lastRefreshedOnDateTime);
}; 

sap.uiext.inbox.Inbox.prototype._getFormattedTooltipForLastRefreshedTime = function(){
	var oTooltipDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({style : "medium"});
	return oTooltipDateFormat.format(this.lastRefreshedOnDateTime);
};	

sap.uiext.inbox.Inbox.prototype._createRRSettingsButton = function(){
	var that = this;
	 var settingsButton = sap.ui.getCore().byId(this.getId() + '--' + 'rrSettingsButton');
	 //Creating Settings Button
	 if (!settingsButton) {
		 settingsButton = new sap.ui.commons.Button(that.getId() + '--' + "rrSettingsButton", {
		 tooltip : that._oBundle.getText("INBOX_MANAGE_SUBSTITUTION_RULES_TOOLTIP"),
		 icon : this.constants.iconPool.getIconURI("workflow-tasks"),
		 iconHovered: this._imgResourcePath + sap.uiext.inbox.InboxConstants.settingsImageHover,
         iconSelected: this._imgResourcePath + sap.uiext.inbox.InboxConstants.settingsImageHover,
		 lite : true
		});
		//settingsButton.addStyleClass("sapUiExtInboxToolbarRight");
		settingsButton.addStyleClass("sapUiExtInboxSettingsButton");
		settingsButton.attachPress(that, that.onSubstitutionButtonPress); 
	}
	 return settingsButton;
};

sap.uiext.inbox.Inbox.prototype._executeForwardAction = function(oEvent, mParameters){
	var linkSource = oEvent.getSource();
	var inbox = mParameters.inbox;
	var dynamicId = inbox.getId() + '--';
	var forwardTasksPopUp = sap.ui.getCore().byId(dynamicId + "forwardTasksPopUp");
	var oTable = sap.ui.getCore().byId(dynamicId + "userTable"); 
	if(forwardTasksPopUp===undefined){
		var dLayout = new sap.ui.commons.layout.MatrixLayout({
			id : dynamicId + 'dLayout',
			layoutFixed : true,
			width : '100%'
		});
		
		
		var oSearch = new sap.ui.commons.SearchField({
			id : dynamicId + 'oSearch',	
	        enableListSuggest: false,
	        startSuggestion : 0,
	        tooltip : inbox._oBundle.getText("SUBSTIUTION_RULE_SEARCH_FOR_USERS"),//"Search For Users",
			editable : true,
	        width: '100%'});
		
		oSearch.addDelegate({
			onAfterRendering : function() {
				var oTextField = sap.ui.getCore().byId(dynamicId + 'oSearch-tf');
				oTextField.prop('placeholder', inbox._oBundle.getText("INBOX_SEARCH_FOR_A_COLLEAGUE"));
			}
		});
	
		oSearch.attachSearch(inbox,function(oEvent,inBox){
			oEvent.oParentSource = linkSource;
			oTable.setBusy(true);
			inBox._handleSearchUsersClickforForward(oEvent);
			
		});

		 oSearch.attachSuggest(inbox,function(oEvent,inBox){
			 if (oEvent.getParameter("value") === "") {
				 oTable.clearSelection();
				 oTable.bindRows("");
		        }
		    });
		
		dLayout.createRow(oSearch);
		var users = {
				collection: "UserInfoCollection", //fetch from configration, not to be hardcoded.
				propertiesLabel: [inbox._oBundle.getText("SUBSTITUTION_USERS_PICKLIST_LOGONID"),
				                  inbox._oBundle.getText("SUBSTITUTION_USERS_PICKLIST_NAME")],
				properties: ["UniqueName", "DisplayName"]
		};
		if(oTable === undefined){
			oTable = new sap.ui.table.Table(dynamicId + "userTable",{selectionMode: sap.ui.table.SelectionMode.Single});
		}
		//oTable.setModel(inbox.getModel());
		//oTable.setTitle( "User Table");
		oTable.setVisibleRowCount(5);
		oTable.attachRowSelectionChange(function(){
			if(oTable.getSelectedIndices().length !== 0){
				sap.ui.getCore().byId(dynamicId + "forwardTasksPopUpFrwBtn").setEnabled(true);
			}else{
				sap.ui.getCore().byId(dynamicId + "forwardTasksPopUpFrwBtn").setEnabled(false);
			}
		});
		oTable.bDynamic=true;
		for (var i = 0; i <= users.properties.length-1; i++) {
			oTable.addColumn(
					new sap.ui.table.Column().
					setLabel(new sap.ui.commons.Label({text: users.propertiesLabel[i],design : sap.ui.commons.LabelDesign.Bold })).
					setTemplate(new sap.ui.commons.TextField({
						editable: false,
						value: {path: users.properties[i]}}))
			);
		}

		var dLayoutCont = new sap.ui.commons.layout.VerticalLayout(dynamicId + "userDialogVLayout", {width:"100%"});
		dLayoutCont.insertContent(dLayout, 0);
		dLayoutCont.insertContent(oTable, 1);
		var selUserUniqueName;
		forwardTasksPopUp = new sap.ui.commons.Dialog(dynamicId + "forwardTasksPopUp", {modal: true,
			title : inbox._oBundle.getText("INBOX_FORWARD_SELECTED_TASKS"),//"Search For Users",
			content:[dLayoutCont],
		//	opener : sap.ui.getCore().byId(this.getId() + '--' + 'forwardActionButton'),
			buttons:[new sap.ui.commons.Button(dynamicId + "forwardTasksPopUpFrwBtn",{enabled:false, text: inbox._oBundle.getText("INBOX_ACTION_BUTTON_FORWARD"), tooltip: inbox._oBundle.getText("INBOX_ACTION_BUTTON_FORWARD_TOOLTIP"), press:function(pressEvent){
				var table = sap.ui.getCore().byId(dynamicId + "userTable");
				var selIndex = table.getSelectedIndex();
				var rowContext = table.getContextByIndex(selIndex);
				var tabModel = sap.ui.getCore().byId(dynamicId + 'userTable').getModel();
				var selUsesDisplayName = tabModel.getProperty("DisplayName", rowContext);
				if(selUsesDisplayName === null)
					selUsesDisplayName = "";
				selUserUniqueName = tabModel.getProperty("UniqueName", rowContext);
				var parentEvent = new sap.ui.base.Event();
				parentEvent.oSource = linkSource; 
				parentEvent.mParameters = {};
				inbox.executeActionOnTask(parentEvent,{inbox:inbox,view:mParameters.view,action:"Forward",forwardTo:jQuery.sap.encodeURL(selUserUniqueName),source:linkSource});
				forwardTasksPopUp.close();
			}
			})]
		});
	}
	forwardTasksPopUp.setWidth("500px"); 
	forwardTasksPopUp.open();
	
	forwardTasksPopUp.attachClosed( inbox, function(oEvent,inbox){
		forwardTasksPopUp.destroy();
	});
	forwardTasksPopUp.setInitialFocus(oSearch);
	
};

sap.uiext.inbox.Inbox.prototype._getExpandParameters = function(){
	return this.oController.getExpandParameters();
};

sap.uiext.inbox.Inbox.prototype._getFilterArray = function(){
	var oFilter = [];
	for ( var item in this.filtersToApply) {
		var filter = this.filtersToApply[item];
		if(jQuery.isArray(filter)){
			oFilter = oFilter.concat(filter)
		}else
			oFilter.push(filter);
	}
	return oFilter;
};

sap.uiext.inbox.Inbox.prototype._getSelectedItemfromKey = function(oTaskTypefilterList, selectedKey){
	//need to check if with the key we can store an object. This is too much of an overhead.
	var aItems = oTaskTypefilterList.getItems();
	var key = selectedKey;
	var sapOrigin;
	
	for (var j = 0; j < aItems.length; j++) {
		if (key === aItems[j].getKey()) {
			return aItems[j];
		}
	}
};

sap.uiext.inbox.Inbox.prototype._resetFlags = function(){
	this.isSubstitutionEnabled = false;
    this.isCustomAttributesEnabled = false;
    this.isCustomActionsEnabled = false;
    this.showTaskDescription = false;
    this.showTaskCategory = false;
};

sap.uiext.inbox.Inbox.prototype._createForwardActionLinkCell = function(){
	var that = this; 
	var forwardActionCell = new sap.ui.commons.layout.MatrixLayoutCell({
    	id : that.getId() + '--' + 'forwardActionCell',
    	hAlign: sap.ui.commons.layout.HAlign.Left,
    	vAlign: sap.ui.commons.layout.VAlign.Bottom,
    	colSpan : 1 });
    
    var forwardActionLink = new sap.ui.commons.Link(that.getId() + '--' + "rrViewForwardAction",{
    	visible:false,
    	enabled:false,
    	tooltip:that._oBundle.getText("INBOX_ACTION_BUTTON_FORWARD")
    	});
    forwardActionLink.addStyleClass("sapUiExtInboxLnkNoUnderline");
    forwardActionLink.setText(that._oBundle.getText("INBOX_ACTION_BUTTON_FORWARD"));
    forwardActionLink.attachPress({inbox:that, view:that.constants.rowRepeaterView}, that._executeForwardAction);
    forwardActionCell.addContent(forwardActionLink);
    
   return  forwardActionCell;
};

sap.uiext.inbox.Inbox.prototype._setInboxFiltersVisibility= function(visiblility){
	if(visiblility ===false || visiblility === true){
		sap.ui.getCore().byId(this.getId() + '--' + "filterViewButton").setVisible(visiblility);
		sap.ui.getCore().byId(this.getId() + '--' + "filterComboBox1").setVisible(visiblility);
		sap.ui.getCore().byId(this.getId() + '--' + "filterComboBox2").setVisible(visiblility);
		sap.ui.getCore().byId(this.getId() + '--' + "filterComboBox3").setVisible(visiblility);
	}
};
sap.uiext.inbox.Inbox.prototype._setInboxViewSelectionVisibility = function(visiblility){
	if(visiblility === false || visiblility === true){
		sap.ui.getCore().byId(this.getId() + '--' + "tableViewImage").setVisible(visiblility);
		sap.ui.getCore().byId(this.getId() + '--' + "rrViewImage").setVisible(visiblility);
	}
};

sap.uiext.inbox.Inbox.prototype.resizeColumns=function(){
	var that=this;
	var width=0;
	var oTable= sap.ui.getCore().byId(that.getId() + '--' + 'listViewTable');
	var cols= oTable.getColumns();
	var taskTitleColumn="";
	jQuery.each(cols,function(index,column){
		if(that.absId(column.getId())==="TaskTitle"){
			taskTitleColumn= column;
			return false;
		}	
	});
		if(taskTitleColumn && (taskTitleColumn.getVisible()===true)&&((cols.length)&&(100/cols.length<25))){
			taskTitleColumn.setWidth("20%");
			width=100/(cols.length-1);
			jQuery.each(cols,function(index,column){
				if(that.absId(column.getId())!=="TaskTitle"){
					column.setWidth(width+"%");
				}	
				
			});
			
		}
};

sap.uiext.inbox.Inbox.prototype._isCompletedTasksSelected = function(){
	var dropdownbox =  this._getComponent('filterComboBox2');
    var isCompTasksSelected = false;
    if(dropdownbox.getSelectedItemId() === this.getId()+'--'+'li_completedTasks'){
        isCompTasksSelected = true;
    }
    return isCompTasksSelected; 
};


sap.uiext.inbox.Inbox.prototype._isDrillDownFilterSelected = function(filter){
	var bFilterApplied = false;

	var currentViewElement = this._currentViewElement();
    var currentViewElementBinding = currentViewElement.getBinding('rows');
    
	if(currentViewElementBinding &&  currentViewElementBinding.sFilterParams && currentViewElementBinding.sFilterParams.indexOf(filter) !== -1)
		bFilterApplied = true;
	
	return bFilterApplied;
};

sap.uiext.inbox.Inbox.prototype._getDefaultSort = function(){
	if(!this._defaultSort){
		this._defaultSort = new sap.ui.model.Sorter("CreatedOn", true);
	}
	return this._defaultSort;
};

sap.uiext.inbox.Inbox.prototype._clearCustomAttributeSort = function(){
	var oTable = this._getComponent('listViewTable');
    var oBinding = oTable.getBinding("rows");
    if(oBinding.sSortParams.indexOf(this.constants.customAttributeNavigationParam) !== -1){
    	oBinding.createSortParams(oBinding.aSorters);
    }
};


sap.uiext.inbox.Inbox.prototype._updateViewElementsOnRequestCompleted = function(iLength){
	if(this.currentView === this.constants.tableView){
		this._updateTableOnRequestCompleted();
	}else if(this.currentView === this.constants.rowRepeaterView){
		this._updateRowRepeaterOnRequestCompleted(iLength);
	}
};


sap.uiext.inbox.Inbox.prototype._updateTableOnRequestCompleted = function(){
	if(this.clientUpdate && this.currentView === this.constants.tableView){
        this._currentViewElement().clearSelection();
    }
	var oRowContext, aSelectedStatus = [];
    var oSupportsAction = {
    		aSupportsClaim:[],
    		aSupportsRelease:[],
    		aSupportsForward:[]
    };
    var oCurrentViewElement = this._currentViewElement();
    var aSelectedContexts = this.selectedContexts;
    var aIndexes = this._getTableIndicesByContext(aSelectedContexts,oCurrentViewElement);
    var oModel = oCurrentViewElement.getModel();
    var that = this;
    
    jQuery.each(aIndexes, function(i, index) {
    	oRowContext = oCurrentViewElement.getContextByIndex(index);
    	aSelectedStatus.push(oModel.getProperty("Status", oRowContext));
    	oSupportsAction.aSupportsClaim.push(oModel.getProperty("SupportsClaim", oRowContext));
    	oSupportsAction.aSupportsRelease.push(oModel.getProperty("SupportsRelease", oRowContext));
    	if(that.isForwardActionEnabled){
    		oSupportsAction.aSupportsForward.push(oModel.getProperty("SupportsForward", oRowContext));
    	}
    });
    
  this.inboxUtils.reselectRowsinTable(aIndexes,oCurrentViewElement);
  //this.selectedContexts = [];
	
	/*if(this.isCustomActionsEnabled){
    	if(aIndexes.length === 0){
    		this._createCustomActionsonRequestCompleted();
    	}
	}*/
  this.disableActionButtonsOnMultiStatus(aSelectedStatus, oSupportsAction);
};

sap.uiext.inbox.Inbox.prototype._updateRowRepeaterOnRequestCompleted = function(iLength){
	this._updatePaginator(iLength);
};

sap.uiext.inbox.Inbox.prototype._getTableIndicesByContext = function(aContexts,oTableElement){
	var aIndexes = [];
	var oBinding = oTableElement.getBinding('rows');
	//getContexts() method for oDataListBinding takes parameters - start and iLength, which is not documented in the API reference
	//If no values are passed for these parameters, this method only returns array os contexts whose size is model.iSizeLimit.
	//To get all the contexts, we are using the internal iLength property of binding and passing it as the length parameter.
//	var iLength = oBinding? oBinding.aKeys : undefined;
  //  var aBoundContextList = oBinding.getContexts(0, iLength);
	var aBoundContextList = oBinding.getContexts(0, oBinding.iLength);
	var oModel = oTableElement.getModel();
	var index = -1;
	jQuery.each(aContexts, function(i, oContext) {
		jQuery.each(aBoundContextList, function(j, oBoundContext){
			if(oContext.sPath === oBoundContext.sPath){
				index = j;
				return false;
			}
		});
		if(index > -1){
			aIndexes.push(index);
		}
	});
	return aIndexes;
};

sap.uiext.inbox.Inbox.prototype._isTaskDefinitionFilterApplied = function(){
	var oCurrentViewElement = this._currentViewElement();
    var oCurrentViewElementBinding = oCurrentViewElement.getBinding('rows');
    if(this.clientUpdate){
    	var bFilterPathFound = false;
    	var aFilters = oCurrentViewElementBinding.aFilters.concat(oCurrentViewElementBinding.aApplicationFilters);
    	if(aFilters && aFilters.length > 0){
    		//group filters by path
    		jQuery.each(aFilters, function(j, oFilter) {
    			if (oFilter.sPath === 'TaskDefinitionID') {
    				bFilterPathFound = true;
    				return false;
    			} 
    		});
    	}
    	return bFilterPathFound;
    }
    return (oCurrentViewElementBinding.sFilterParams.indexOf('TaskDefinitionID') !== -1);
};

sap.uiext.inbox.Inbox.prototype._handleRequestSent = function(oEvent){
	if(this.bRefreshStartFlag){
		this.bRefreshStartFlag = false;
		var refreshButton = this._getComponent('refreshButton');
		refreshButton.setIcon(sap.uiext.inbox.InboxConstants.refreshImage);
	}
}

sap.uiext.inbox.Inbox.prototype._handleRequestCompleted = function(oEvent){
	var iLength = 0;
	var oParameters  = oEvent.getParameters();
	if(oParameters.url.indexOf(this.constants.UserInfoCollection) !== -1){
		return;
	}else if(!oParameters.success){
		//Updating the model binding to trigger a rerendering of the table view only as there is a rendering issue with the table view.
		if(this.currentView === this.constants.tableView){
			this._getComponent('listViewTable').getModel().updateBindings();
		}
		if(oParameters.errorobject === undefined || (oParameters.errorobject !== undefined && oParameters.errorobject.statusCode === 401)){
			//Reload the page in case of authentication request or authentication failed.
			window.location.reload(true);
		}		
	}else if(oParameters.success){
		var taskTypeFilterList = this._getComponent("INBOX_FILTER_TASK_TYPE");
		
		var bInitialFilterAppliedforTaskType = taskTypeFilterList ? this._isInitialFilterAppliedforTaskType() : false;
		
	    //refresh Tasks , in case Task Type filter is not applied.
	    if((bInitialFilterAppliedforTaskType || !this._isTaskDefinitionFilterApplied()) && this.bRefreshTaskTypes){
	            this.refreshTaskTypes();
	    }
	    
	    //display custom attributes if Task Type filter is applied for a task having custom attributes
	    if(bInitialFilterAppliedforTaskType){
	    	if(this._setInitialFilterKeysforTaskType(taskTypeFilterList)) {
	    		if (taskTypeFilterList  && taskTypeFilterList.getSelectedKeys() !== ["sapUiFacetFilter_ALL"]) {
	                if (taskTypeFilterList.getSelectedKeys().length === 1) {
	                	var oEvent = new sap.ui.base.Event();
	                    var aSelectedItems = taskTypeFilterList.getItems();
	                    oEvent.mParameters = {all: false, selectedItems: aSelectedItems};
	                    this.applyDrillDownFilterForTaskType(oEvent, this);
	                }
	            }
	        }
	     }
	    
	    // only in response of table column's sort event
	    if (this.bSorted) {
	    	var currentViewElement = this._currentViewElement();
	    	currentViewElement._originalKeys = currentViewElement.getBinding('rows').aKeys;
	    	this.bSorted = false;
	    }
	    
	    //reset refresh Task Types flag
	    this.bRefreshTaskTypes = true;
	    
	    iLength = this._getCurrentViewElementBindingLength();
	    
	    var currentViewElement = this._currentViewElement();
	    var bRowsRebinded = currentViewElement.bRowsRebinded;
	    /* In method applyFilterOnResponse, the row repeater is unbinded and binded again which cause iLength to be 0.
	     * This will treager second request to rebind the rows and in such case the message should not be displayed.
	     * The current function will be recalled after the second request is finished and in such case the message is 
	     * ok to be displayed.
	     * 
	     * This was implemented to fix a false notification "No data available" when data is actually available.
	     * The message was displayed due to iLength = 0 after unbind. It should wait to rebind and complete the second request.
	     */
	    if(bRowsRebinded === null || bRowsRebinded === undefined || !currentViewElement.bRowsRebinded){
	    	this._displayMessageOnRequestCompleted(iLength);
	    }
	    else{
	    	currentViewElement.bRowsRebinded = false;
	    }
	    
	}	

    this.hideBusyLoader();   
    
    //update the view Elements
    this._updateViewElementsOnRequestCompleted(iLength);
    
    //reset refresh gif
    var oRefreshButton = this._getComponent('refreshButton');
    oRefreshButton.setIcon(this.constants.refreshImage);
    
    //fire event
    var oDataEventParams = oEvent.getParameters();
    oDataEventParams.bindingLength = iLength;
    oDataEventParams.appliedFilter = this._getComponent('filterComboBox2').getValue();;
    this.fireODataRequestCompleted(oDataEventParams);    
    
    // preserver local search if appplied
    this._applySearch();
    
    // apply filters on columns if any column is filtered in table view
    if (this.currentView === this.constants.tableView && this._isTableFiltered()) 
    	this._preserveTableFilters();
    
    //Preserve sorting (custom attributes)
    if (this.currentView === this.constants.tableView){
    	this._preserveTableSort();
    }
};

sap.uiext.inbox.Inbox.prototype._applySearch = function(){
	var oSearchField = this._getComponent('searchField');
	var sSearchText = oSearchField.getValue();
	if(sSearchText !== "" && sSearchText !== null){
		oSearchField.fireSearch({query:sSearchText});
	}
};

sap.uiext.inbox.Inbox.prototype._displayMessageOnRequestCompleted = function(iLength){
    if (iLength <= 0) {
		this.showMessage("info", this._oBundle.getText("INBOX_MSG_FOR_NO_DATA"));
	} else {
		if (this.resetMessages === true){
			this.deleteMessage();
		}else{
			this.resetMessages = true;
		}
	}
};

/**
 * get binding length of the element which displays tasks on the current View
 */
sap.uiext.inbox.Inbox.prototype._getCurrentViewElementBindingLength = function(){
	var oCurrentViewElement = this._currentViewElement();
    var oCurrentViewElementBinding = oCurrentViewElement.getBinding('rows');
    return oCurrentViewElementBinding.iLength;
};


/**
 * select the row in the table to which the element belongs to
 * SId: element ID whose parent row has to be selected 
 */
sap.uiext.inbox.Inbox.prototype._selectParentRowforElement = function(sId){
	var iIndex = -1;
	var $target = jQuery.sap.byId(sId);
	var $row = $target.closest(".sapUiTableCtrl>tbody>tr");
	if ($row.length === 1) {
		iIndex = parseInt($row.attr("data-sap-ui-rowindex"), 10);
	}
	var oTable = this._getComponent('listViewTable');
	oTable.setSelectedIndex(iIndex);
};

sap.uiext.inbox.Inbox.prototype._handleTaskTitleLinkPress = function(oEvent){
	this.showBusyLoader();
	var that = this; 

	this._selectParentRowforElement(oEvent.getSource().getId());

	var oContext = oEvent.getSource().getBindingContext();
	var oModel = this.getCoreModel();
                 
	var aTaskExecutionURLs = [], aTaskExecIDs = [], aTaskExecTitles = [], aTaskExecSAPOrigins = [];

	aTaskExecIDs.push(oModel.getProperty("InstanceID", oContext));
	aTaskExecTitles.push(oModel.getProperty("TaskTitle", oContext));
	aTaskExecSAPOrigins.push(oModel.getProperty("SAP__Origin", oContext));

	if (this.getTaskExecutionURLCallBack != "" && this.getTaskExecutionURLCallBack != undefined && this.getTaskExecutionURLCallBack !== null){
		var taskUiURL = this.getTaskExecutionURLCallBack(aTaskExecIDs[0],aTaskExecSAPOrigins[0]);
		if(taskUiURL !== null && taskUiURL.replace(/\s/g, "").length > 0) {
			aTaskExecutionURLs.push(taskUiURL);
		}
	}else{
		aTaskExecutionURLs.push("");
	}

	var evt = oEvent.getParameter("windowEvent");
	if(!evt.ctrlKey && !(evt.button==1) && !evt.shiftKey && !this.bOpenTaskUIInNewTab){
	    this.populateTaskExecutionContent({
	    	aSelectedContexts: [oContext],
	        arrayURLs : aTaskExecutionURLs,
	        arrayIDs : aTaskExecIDs,
	        arrayTitles : aTaskExecTitles,
	        aTaskSAPOrigins : aTaskExecSAPOrigins
	    });
	    this.hideBusyLoader();
	}else{
		this.hideBusyLoader();
	    var windowURL = aTaskExecutionURLs[0];
	    if (windowURL!==null && windowURL.replace(/\s/g, "").length > 0) {
			var taskExecWindow = window.open(windowURL);
			if (taskExecWindow){
				taskExecWindow.focus();
			}
			oEvent.preventDefault();
	    }

	}
};

sap.uiext.inbox.Inbox.prototype._initFlagsByModel = function(){
	if (this.oModel instanceof sap.ui.model.json.JSONModel) {
		this.typeOfModel = "JSON";
		this.setHandleBindings(false);
	    this._resetFlags();
	} else if (this.oModel instanceof sap.ui.model.odata.ODataModel || this.oModel instanceof sap.ui.model.odata.v2.ODataModel) {
	    this.typeOfModel = "OData";
	    this.attachTaskAction(this, this.defaultActionHandler);
	    this.setHandleBindings(true);
	} else if (this.oModel instanceof sap.ui.model.xml.XMLModel) {
	    this.typeOfModel = "xml";
	    this.setHandleBindings(false);
	    this._resetFlags();
	} 
};

/**
 * Event Handler for Request Failed for the Model
 */
sap.uiext.inbox.Inbox.prototype._handleRequestFailed = function(oEvent){
	var oEventParams = oEvent.mParameters;
	if((oEventParams.message !== "Request aborted") && oEventParams.statusCode !== undefined){
		//var sErroMessageKey = (oEvent.mParameters.statusCode === 401) ? "INBOX_MSG_USER_NOT_AUTHORIZED" : "INBOX_MSG_NO_ODATA_SRVC";
		this.showMessage("error", this._oBundle.getText("INBOX_MSG_NO_ODATA_SRVC"));
	}

	this.hideBusyLoader();
};

sap.uiext.inbox.Inbox.prototype._applySortOnView = function(oSorter){
	var mEntitiesToElementsMeta = this.constants.mEntitiesToElements.taskMetadata;
	if(this.currentView === this.constants.tableView){
		this._applySortOnTableView(oSorter, mEntitiesToElementsMeta);
	}else if(this.currentView === this.constants.rowRepeaterView){
		this._applySortOnRowRepeaterView(oSorter, mEntitiesToElementsMeta);
	}
};

sap.uiext.inbox.Inbox.prototype._applySortOnTableView = function(oSorter, mEntitiesToElementsMeta){
	//TODO : check if this is a good way to create big objects?
	var mColumnsMap = mEntitiesToElementsMeta.sap_inbox_list.columnsMap;
	
	var oListView = this._getComponent('listViewTable');
	
	var aColumns = oListView.getColumns();
	for (var i = 0, l = aColumns.length; i < l; i++) {
		aColumns[i].setSorted(false);
	}

	if(oSorter){
		var oColumn, oColumnID;
		var sPath = oSorter.sPath;

		if(sPath.indexOf(this.constants.customAttributeNavigationParam)!==-1){
			oColumnID = sPath.replace(this.constants.customAttributeNavigationParam,"");
			oColumnID = oColumnID.replace(/^\//,"");
		}else{
			var oColumnID = mColumnsMap[sPath];
		}
		var oColumn = oColumnID ? this._getComponent(oColumnID) : undefined;
		if(oColumn){
			var sortOrder = oSorter.bDescending ? sap.ui.table.SortOrder.Descending : sap.ui.table.SortOrder.Ascending
			oColumn.setSortOrder(sortOrder);
			oColumn.setSorted(true);
		}
	}
};

sap.uiext.inbox.Inbox.prototype._applySortOnRowRepeaterView = function(oSorter, mEntitiesToElementsMeta){
	var mSorterMap = mEntitiesToElementsMeta.sap_inbox_stream.sorterMap;
	var oRowRepeaterSortCombobox = this._getComponent('sortByFilterComboBox');
	
	if(oSorter){
		var oColumn, oColumnID;
		var sPath = oSorter.sPath;

		var sSorterID = mSorterMap[sPath];
		if(sSorterID){
			oRowRepeaterSortCombobox.setSelectedItemId(this.getId()+'--'+sSorterID);
			this._updateRowRepeaterSortImage(oSorter.bDescending);
   			var sSorterID = this.constants.mRRSortMap[sSorterID];
   			var oRowRepeaterSorter = this._getComponent(sSorterID).getSorter();
   			if(oRowRepeaterSorter){
   				oRowRepeaterSorter.bDescending = oSorter.bDescending;
   			}
		}else{
			var oEmptyListItem = this._getComponent('li_empty');
			if(!oEmptyListItem)
				oEmptyListItem = new sap.ui.core.ListItem(this.getId() + '--' + "li_empty", {
					text : this._oBundle.getText("")
			});
			oRowRepeaterSortCombobox.insertItem(oEmptyListItem,0);
			oRowRepeaterSortCombobox.setSelectedItemId(this.getId() + '--' + "li_empty");
			var sortImage  = this._getComponent('sortImage');
			sortImage.setVisible(false);
		}
		
	}
};


sap.uiext.inbox.Inbox.prototype._updateRowRepeaterSortImage = function(bDescending){
	var sortImage  = this._getComponent('sortImage');
	sortImage.setVisible(true);
	if(bDescending){
		sortImage.setIcon(this.constants.sortDescImage);
		sortImage.setTooltip(this._oBundle.getText("INBOX_SORT_INDICATOR_DESC"));
	}else{
		sortImage.setIcon(this.constants.sortAscImage);
		sortImage.setTooltip(this._oBundle.getText("INBOX_SORT_INDICATOR_ASC"));
	}
};

sap.uiext.inbox.Inbox.prototype._getFirstColumnContentTemplate = function(){
	var that = this;
	var oFirstColHorLay = this._getComponent('firstColumnLayout');
	oFirstColHorLay = oFirstColHorLay || new sap.uiext.inbox.composite.InboxTaskTitleControl({
		
		 id : that.getId() + '--' + "firstColumnLayout",
		 categoryIconURI: {
				path: "InstanceID",					  
				formatter : function(sInstanceID) {
					if (sInstanceID !== null) {
						this.setTooltip(that._oBundle.getText(that.constants.taskCategoryToolTip["TASK"]));
						return that.constants.taskCategoryImages["TASK"];	
					}
				}
		 	}
		 });
	oFirstColHorLay.setTitleLink(this._createTaskLink());
	
	oFirstColHorLay.bindProperty("hasAttachments", "HasAttachments", function(value) {
		var bHasAttachment = (value != null) ? value : false;
		return bHasAttachment;
		
	});
	
	oFirstColHorLay.bindProperty("hasComments", "HasComments", function(value) {
		var bHasComment = (value != null) ? value : false;
		return bHasComment;
	});
	
	return oFirstColHorLay;
};

sap.uiext.inbox.Inbox.prototype._createTaskCategoryImage = function(){
	var that = this;
	var oCategoryImage = that._getComponent('taskCategoryImg');
	if(!oCategoryImage){
		oCategoryImage = new sap.ui.core.Icon({
				id : that.getId() + '--' + "taskCategoryImg",
				decorative : false,
				size : "15px", 
				enable : false
		}).addStyleClass("sapUiExtInboxMarginForTableColumnStyle");			//.addStyleClass("sapUiExtInboxMarginForTableColumnStyle");
	}
	
	if(this.clientUpdate){
		oCategoryImage.setSrc(that.constants.taskCategoryImages["TASK"]);
	}else{
		oCategoryImage.bindProperty("src", that.constants.taskDefinitionNavigationParam, function(taskDefinitionData){
			if(taskDefinitionData != null && taskDefinitionData !== ""){
				var oModel = that.getCoreModel();
				var oContext = this.getBindingContext();
				var categoryEntry = taskDefinitionData[0];
				var taskDefEntry = oModel.oData[categoryEntry];
				var categoryValue;
				if(taskDefEntry){
					categoryValue = taskDefEntry.Category;
					this.setVisible(true);
				}else{
					categoryValue = taskDefinitionData.Category;
					this.setVisible(true);
				}
				
				categoryValue=categoryValue.toUpperCase();
				
				if (categoryValue == "TASK" || categoryValue == "NOTIFICATION" || categoryValue == "TODO" || categoryValue == "ALERT") {
				   	this.setTooltip(that._oBundle.getText(that.constants.taskCategoryToolTip[categoryValue]));
					return that.constants.taskCategoryImages[categoryValue];
				}
			}
		return  that.constants.taskCategoryImage;
		}); 
	}
	
	return oCategoryImage;	
};

sap.uiext.inbox.Inbox.prototype._createTaskLink = function(){
	var that = this;
	var oTaskLink = new sap.uiext.inbox.InboxLink().addStyleClass("sapUiExtInboxTaskTitleLink");
	oTaskLink.addDelegate({
	      onAfterRendering : function() {
	          if (!this.getEnabled()) {
	              this.addStyleClass('sapUiExtInboxLnkDsbl');
	          }
	      }
	  });
	var taskTitleProperty = that._getCategoryMetadata().properties[0];
	oTaskLink.bindProperty("text", taskTitleProperty,function(value){
		if(this.getBindingContext() ===  undefined)
		   return undefined;
		else
			return value;
	});
	oTaskLink.bindProperty("overdue","CompletionDeadLine", function(value){
		return that._isOverDue(value);
	});		
	oTaskLink.bindProperty("tooltip", taskTitleProperty);
	oTaskLink.bindProperty("enabled", "Status", function(value) {
	    if (!that.getOpenCompletedTasks() && value === "COMPLETED") {
	      	this.addStyleClass("sapUiExtInboxLnkDsbl");
	      	return false;
	      }
	      this.removeStyleClass("sapUiExtInboxLnkDsbl");
	      return true;
	  });
	
	oTaskLink.attachPress(this, function(oEvent, that) { 
	  											that._handleTaskTitleLinkPress(oEvent);
	  										});
	
	return oTaskLink;
};


sap.uiext.inbox.Inbox.prototype._handleTaskCategoryVisibility = function(){
	//Handle visibility of category
	if(!this.showTaskCategory){
		var tableCategoryImage = this._getComponent('taskCategoryImg');
		if (tableCategoryImage) {
		tableCategoryImage.setVisible(false);}
		
	}
};

sap.uiext.inbox.Inbox.prototype._setCommentsVisibility = function(){
	 if(this.isCommentsEnabled){
		 	var oCommentsButton = this._getComponent("commentsSegBtn");
			//TODO: This needs to be changed to use 'SupportComments' from the service metadata.
		 	//oCommentsButton.setVisible(true);
		 	oCommentsButton.bindProperty("visible","SupportsComments", function(value) {
				if (value != null && value !== "") {
					return value;
				}
				return false;
			});
			
		 	oCommentsButton.attachPress(this, function(oEvent, that) {
				that._handleActionButtonToggleinRowRepeater(oEvent);
			});
	}
};

sap.uiext.inbox.Inbox.prototype._initTableView = function(){
	 var oTable = this._getComponent("listViewTable");
	 oTable.setModel(this.oModel);
	 return oTable;
};

sap.uiext.inbox.Inbox.prototype._initRowRepeaterView = function(){
	var oTasksRowRepeater = this._getComponent('tasksRowRepeater');
	oTasksRowRepeater.setModel(this.oModel);
	var oRowRepeaterTemplate = this._getComponent('rrMainMatrixLayout');
	return oTasksRowRepeater;
};

sap.uiext.inbox.Inbox.prototype._createCustomAttributes = function(aAttributes){
	if(this.isCustomAttributesEnabled){
	    if(aAttributes.length===1 && (this.currentView === this.constants.tableView)){
	        //getCustomAttribute Metadata
	    	//TODO : only if the view is Grid View
	    	if(!(this.oController instanceof sap.uiext.inbox.controller.InboxControllerAsync)){
	    		this._modifyListBindingForExpand(true,this.constants.customAttributeNavigationParam);
	    	}	    	
	        this._getCustomAttributeMetaData(aAttributes[0].getKey(),aAttributes[0].data("SAP__Origin"));
	    }else{
	    	if(!(this.oController instanceof sap.uiext.inbox.controller.InboxControllerAsync)){
	    		this._modifyListBindingForExpand(false,this.constants.customAttributeNavigationParam);
	    	}
	        //change to delete all columns other than the fixed..... 
	        this._deleteCustomAttributeColumns(null);
	    }
	}
};

sap.uiext.inbox.Inbox.prototype._isCustomAttribute = function(oColumn){
	if(oColumn){
		if(oColumn.data("ColumnType") == "CustomAttribute"){
			return true;
		}
	}
	return false;
}

sap.uiext.inbox.Inbox.prototype._selectInitialValueinDropDown = function(oPrimaryFilter){
	var oTasksDDBox = this._getComponent("filterComboBox2");
	var oPrimaryFilterValue = oPrimaryFilter? oPrimaryFilter.getFilter() : undefined ; 
	var sTaskItemIdtobeSelected = oPrimaryFilterValue? oPrimaryFilterValue.key : "li_openTasks";
	sTaskItemIdtobeSelected = this.getId()+ '--' + sTaskItemIdtobeSelected; 
	if(oTasksDDBox.getSelectedItemId() !== sTaskItemIdtobeSelected){
		oTasksDDBox.setSelectedItemId(sTaskItemIdtobeSelected);

    	var oSelectItem = sap.ui.getCore().byId(sTaskItemIdtobeSelected);
    	oTasksDDBox.fireChange({oSource: oTasksDDBox, newValue: oSelectItem.getText(), selectedItem: oSelectItem});
    }
};

sap.uiext.inbox.Inbox.prototype._addFilterToFilterMetadata = function(oFilter, aFiltersTobeApplied){
	if(jQuery.isArray(oFilter)){
		aFiltersTobeApplied = aFiltersTobeApplied.concat(oFilter);
	}else{
		aFiltersTobeApplied.push(oFilter);
	}
	return aFiltersTobeApplied;
};


sap.uiext.inbox.Inbox.prototype._selectFilterValuesinFacetFilterView = function(oSecondaryFilter, aFilters, appliedDropDownFilter){
	var attributesTobeSelected = oSecondaryFilter.getFilterUIKeys();
	
	var oFacet = sap.ui.getCore().byId(this.getId()+'--'+"filterFacet");
	
	var prioFilterList = sap.ui.getCore().byId(this.getId()+'--'+"INBOX_FILTER_PRIORITY");
	var statusFilterList = sap.ui.getCore().byId(this.getId()+'--'+"INBOX_FILTER_STATUS");
	var dateTimeFilterList = sap.ui.getCore().byId(this.getId()+'--'+"INBOX_FILTER_CREATION_DATE");
	var taskTypeFilterList = sap.ui.getCore().byId(this.getId()+'--'+"INBOX_FILTER_TASK_TYPE");
	var dueDateTimeFilterList = sap.ui.getCore().byId(this.getId()+'--'+"INBOX_FILTER_DUE_DATETIME");
	
	var aTaskInitialFilters = [];
	
	if(taskTypeFilterList && oFacet.indexOfList(taskTypeFilterList) !== -1 && attributesTobeSelected.TaskType && attributesTobeSelected.TaskType.length > 0){
    	taskTypeFilterList.data("initialFilterKeysToSelect",attributesTobeSelected.TaskType);
		//taskTypeFilterList.setSelectedKeys(attributesTobeSelected.TaskType);
	    if(aFilters.TaskType !== undefined && aFilters.TaskType.length > 0){
	    	aTaskInitialFilters.push(aFilters.TaskType);
        }
	}else{
		this.clearFiltersForTaskType();
	}
	if(prioFilterList && oFacet.indexOfList(prioFilterList) !== -1 && attributesTobeSelected.Priority && attributesTobeSelected.Priority.length > 0){
	    prioFilterList.setSelectedKeys(attributesTobeSelected.Priority);
	    if(aFilters.Priority !== undefined && aFilters.Priority.length > 0){
       	 aTaskInitialFilters.push(aFilters.Priority);
        }
	}else{
   	 this.clearFiltersForPriority();
    }
	
	if(statusFilterList && oFacet.indexOfList(statusFilterList) !== -1 && attributesTobeSelected.Status && attributesTobeSelected.Status.length > 0){
	    statusFilterList.setSelectedKeys(attributesTobeSelected.Status);
	    if(aFilters.Status !== undefined && aFilters.Status.length > 0 ){
       	 if ((appliedDropDownFilter.sPath === "Status")
       	            && (appliedDropDownFilter.sOperator === "NE")) {
       		 appliedDropDownFilter = undefined;
       		 delete this.filtersToApply.dropDownFilter;
       	 }
       	 aTaskInitialFilters.push(aFilters.Status);
        }
	}else{
    	this.clearFiltersForStatus();
    }
	
	if(dateTimeFilterList && oFacet.indexOfList(dateTimeFilterList) !== -1 && attributesTobeSelected.StartDate && attributesTobeSelected.StartDate.length > 0){
	    dateTimeFilterList.setSelectedKeys(attributesTobeSelected.StartDate);
	    if(aFilters.StartDate !== undefined){
       	 aTaskInitialFilters.push(aFilters.StartDate);
        }
	}else{
   	 this.clearFiltersForDateTime();
    }
	
	if(dueDateTimeFilterList && oFacet.indexOfList(dueDateTimeFilterList) !== -1 && attributesTobeSelected.DueDate && attributesTobeSelected.DueDate.length > 0){
	    dueDateTimeFilterList.setSelectedKeys(attributesTobeSelected.DueDate);
	    if(aFilters.DueDate !== undefined){
       	 aTaskInitialFilters.push(aFilters.DueDate);
        }
	}else{
   	 this.clearFiltersForDueDate();
    }
	
	var aFiltersTobeApplied = [];
	for ( var i=0; i < aTaskInitialFilters.length; i++) {
			var oFilter = aTaskInitialFilters[i];
			aFiltersTobeApplied = this._addFilterToFilterMetadata(oFilter, aFiltersTobeApplied);
	}
	
	if(appliedDropDownFilter){
		aFiltersTobeApplied = this._addFilterToFilterMetadata(appliedDropDownFilter, aFiltersTobeApplied);
		this.filtersToApply.dropDownFilter = appliedDropDownFilter;
	}
	return aFiltersTobeApplied;
};

sap.uiext.inbox.Inbox.prototype._setInitialFilterKeysforTaskType = function(taskTypeFilterList){
	if(taskTypeFilterList.getItems().length > 0 && taskTypeFilterList.data("initialFilterKeysToSelect") != null){
		taskTypeFilterList.setSelectedKeys(taskTypeFilterList.data("initialFilterKeysToSelect"));
		taskTypeFilterList.data(null);
		return true;
	} else {
		return false;
	}
};

sap.uiext.inbox.Inbox.prototype._isInitialFilterAppliedforTaskType = function(){
	//TODO: store facet class level
	var taskTypeFilterList = this._getComponent("INBOX_FILTER_TASK_TYPE");
	return taskTypeFilterList? ((taskTypeFilterList.data("initialFilterKeysToSelect") != null)? true : false) : false;
};

sap.uiext.inbox.Inbox.prototype._getTaskStatus= function(status,statusLabel){
	if(status || statusLabel){
		var bSupported= this.oTcmMetadata.serviceSupportsFilterOption;
		if(bSupported && statusLabel){
	   		return statusLabel;
	   	}
		
		if(status){
			var statusLabelKey = sap.uiext.inbox.InboxConstants.statusMap[status];
			if(statusLabelKey){
				return this._oBundle.getText(statusLabelKey);
			}
			
			return status;
		}
	}
	return "";	
};

sap.uiext.inbox.Inbox.prototype._manageVisibilityOfSettingsButton = function(settingsButton) {
	if(settingsButton != null) {
		var shouldBeVisible = false;
	
	if(this.getSubstitutionEnabled()) {
		shouldBeVisible = true;
		
	}
	 settingsButton.setVisible(shouldBeVisible);	
	} 
};

sap.uiext.inbox.Inbox.prototype._handleRowRepeaterPaginatorClick = function(oEvent) {
	var newPage = oEvent.getParameter("targetPage");
	var oldPage = oEvent.getParameter("srcPage");
	var oTasksRowRepeater = this._getComponent('tasksRowRepeater');
	if(oTasksRowRepeater){
		oTasksRowRepeater.gotoPage(newPage);
	}
};

sap.uiext.inbox.Inbox.prototype._getCustomAttributeContentforRowRepeater = function(oCustomAttrToggleButton, rowNumber, sSelectedTaskDefinition, sSelectedTaskInstance, sSapOrigin){
	var that = this;
	if (this.currentView === "sap_inbox_stream") {
		if (oCustomAttrToggleButton) {
			var sSelectedTaskDefinition = that.getModel().getProperty("TaskDefinitionID",oCustomAttrToggleButton.getParent().getBindingContext());
			var sSelectedTaskInstance = that.getModel().getProperty("InstanceID",oCustomAttrToggleButton.getParent().getBindingContext()); 
			var sSapOrigin = that.getModel().getProperty("SAP__Origin",oCustomAttrToggleButton.getParent().getBindingContext());
		}
		
		var constants = that.constants;
		var oCustomAttributeValuesMap = constants.oTaskInstanceCustomAttributeValuesMap;
		var oCustomAttributesValues = oCustomAttributeValuesMap[sSelectedTaskInstance];
		var oCustomAttributeMetaDataArrayMap = constants.oTaskDefinitionCustomAttributesMap;
		var oCustomAttributeMetaDataArray = oCustomAttributeMetaDataArrayMap[sSelectedTaskDefinition];
		
		//optimize the two if statements
		if ((oCustomAttributesValues && jQuery.isEmptyObject(oCustomAttributesValues)) || (oCustomAttributeMetaDataArray && oCustomAttributeMetaDataArray.length == 0)) {
			this._addActionContentinRowRepeater(rowNumber, "customAttributes", this._createNoDataLabel(this._oBundle.getText("INBOX_MSG_NO_TASK_DETAILS")));
			return;
		}
		
		if (!jQuery.isEmptyObject(oCustomAttributesValues) && oCustomAttributeMetaDataArray && oCustomAttributeMetaDataArray.length > 0) {
			that._displayCustomAttributes(sSelectedTaskDefinition, sSelectedTaskInstance, rowNumber);
		} else if (oCustomAttributesValues && !oCustomAttributeMetaDataArray) {
			that._getCustomAttributeMetaData(sSelectedTaskDefinition,sSapOrigin,rowNumber,sSelectedTaskInstance);
		} else if (!oCustomAttributesValues && oCustomAttributeMetaDataArray) {
			that._getCustomAttributeData(sSelectedTaskInstance,sSapOrigin,rowNumber,sSelectedTaskDefinition);
		} else {
			if (that.bUseBatch ){
				var sPathForCustomAttributeMetadata, sPathForCustomAttributeData;
				var oTaskDefinitionTCMMetadata = constants.TaskDefinitionCollection;
				var oTaskCollectionTCMMetadata = constants.TaskCollection;
				
				sPathForCustomAttributeMetadata = constants.forwardSlash
					+ oTaskDefinitionTCMMetadata.entityName 
						+ "(" + oTaskDefinitionTCMMetadata.properties.taskDefnID + "='" + sSelectedTaskDefinition + "'," 
							+ constants.sapOrigin + "='" + sSapOrigin + "')"
								+ constants.forwardSlash + oTaskDefinitionTCMMetadata.navParam.customAttrDefn;
				
				sPathForCustomAttributeData = constants.forwardSlash
					+ oTaskCollectionTCMMetadata.entityName 
						+ "(" + oTaskCollectionTCMMetadata.properties.instanceID + "='"	+ sSelectedTaskInstance + "',"
							+ constants.sapOrigin + "='" + sSapOrigin + "')" 
								+ constants.forwardSlash + oTaskCollectionTCMMetadata.navParam.customAttrValues;
				
				var fnSuccess = jQuery.proxy(function (data, response) {
					this._processCustomAtrributesBatchResponse(data, response, sSelectedTaskDefinition, sSelectedTaskInstance, rowNumber);
				}, that);
				
				that.oDataManager.fireBatchRequest({
					aPaths : [sPathForCustomAttributeMetadata, sPathForCustomAttributeData],
			    	sMethod : "GET",
			    	sBatchGroupId : "customAttributesBatch",
			    	numberOfRequests : 2,
			    	fnSuccess : fnSuccess,
			    	fnError : function(error) {
						that.showMessage("error", that._oBundle.getText("INBOX_MSG_FETCH_CUSTOM_ATTRIBUTES_FAILS"));
					}
			    });
				
			} else {
				that._getCustomAttributeMetaData(sSelectedTaskDefinition,sSapOrigin,rowNumber,sSelectedTaskInstance);
				that._getCustomAttributeData(sSelectedTaskInstance,sSapOrigin,rowNumber,sSelectedTaskDefinition);
			}
		}
	} 
};

sap.uiext.inbox.Inbox.prototype._processCustomAtrributesBatchResponse = function(data, response, sDefinitionID, sTaskID, rowNumber) {
	
	var batchResponses = data.__batchResponses;
	var oCustomAttributeMetaDataArray = [];
	var oCustomAttributesValues = {};
	
	//TODO: can be pulled out to the util (used in two places)
	var aCustomAttributeDefinitionArray = batchResponses[0].data.results;
	for(var i=0;i<aCustomAttributeDefinitionArray.length;i++){
		var oCustomAttributeDefn = {};
		oCustomAttributeDefn.Name =  aCustomAttributeDefinitionArray[i].Name;
        oCustomAttributeDefn.Type =  aCustomAttributeDefinitionArray[i].Type;
        oCustomAttributeDefn.Label = aCustomAttributeDefinitionArray[i].Label;
        oCustomAttributeMetaDataArray.push(oCustomAttributeDefn);
	}
	this.constants.oTaskDefinitionCustomAttributesMap[sDefinitionID] = oCustomAttributeMetaDataArray;
	
	var aCustomAttributeData = batchResponses[1].data.results;
	for(var i=0;i<aCustomAttributeData.length;i++) {
		oCustomAttributesValues[aCustomAttributeData[i].Name] = aCustomAttributeData[i].Value;
	}
	this.constants.oTaskInstanceCustomAttributeValuesMap[sTaskID] = oCustomAttributesValues;
	
	this._displayCustomAttributes(sDefinitionID, sTaskID, rowNumber);
};

sap.uiext.inbox.Inbox.prototype._getCommentsContentforRowRepeater = function(oCommentsToggleButton, rowNumber){
	//create Content to be displayed
	var oModel = this.getModel();
	var oContext = oCommentsToggleButton.getParent().getBindingContext();
	var sSelectedTaskInstance = oModel.getProperty("InstanceID",oContext); 
	var sSapOrigin = oModel.getProperty("SAP__Origin",oContext);
	var sStatus = oModel.getProperty("Status",oContext).toUpperCase();
	var bCompleted = false;
	if(sStatus === "COMPLETED")	{
		var bCompleted = true;	
	}	
	var oInbxTComm = this._getComponent("comments-"+rowNumber);
	if(!oInbxTComm){
		var oInbxTComm = new sap.uiext.inbox.composite.InboxTaskComments(this.getId()+"--"+"comments-"+rowNumber, {
			showFeeder : !bCompleted
		});
		oInbxTComm.attachCommentSubmit(this, this.handleCommentAdded);
		if(this.loggedInUserName){
			oInbxTComm.setFeederThumbnailSrc(this.inboxUtils.getUserMediaResourceURL(this.bpmSvcUrl, sSapOrigin, this.loggedInUserName));
		}
	}
	oInbxTComm.data("instanceID",sSelectedTaskInstance);
	oInbxTComm.data("SapOrigin",sSapOrigin);
	oInbxTComm.setShowHeader(false);
	oInbxTComm.showBusy(true);
	
	var oCommentsOuterLayout = new sap.ui.commons.layout.MatrixLayout({
	    layoutFixed : true,
	    width : "100%"
		});
	var oCellOuter = new sap.ui.commons.layout.MatrixLayoutCell();
	oCellOuter.addContent(oInbxTComm);
	oCellOuter.addStyleClass('sapUIExtInboxCommentsBorder');
	oCommentsOuterLayout.createRow(oCellOuter);
	this._addActionContentinRowRepeater(rowNumber, "comments", oCommentsOuterLayout);
	
	this._getComments(sSelectedTaskInstance, sSapOrigin, rowNumber);
};

sap.uiext.inbox.Inbox.prototype._handleActionButtonToggleinRowRepeater = function(oEvent){
	//USE oEvent.getParameters().selectedButtonId to perform action according, as it has info of which icon of which row.
	var buttonClicked = oEvent.getSource(), buttonClickedID = oEvent.getParameters().id;
	
	var tasksRowRepString = 'tasksRowRepeater-';
	var indexOfRowNumber = buttonClickedID.indexOf(tasksRowRepString) + tasksRowRepString.length;
	var rowNumber = buttonClickedID.substring(indexOfRowNumber, buttonClickedID.length);
	
	var sActionButtonName = this._removeParentID(buttonClickedID).replace("-" + this.getId()+"--"+tasksRowRepString + rowNumber, "");
	
	if(buttonClicked.getPressed()){
		
		// deselecting other pressed action button if any
		this.inboxUtils.deSelectOtherActionButtonsinStreamView(buttonClicked);
		
		// setting hide tooltip for clicked button
		buttonClicked.setTooltip(this._oBundle.getText(this.constants.mTooltipforActionButtonsinRR.hide[sActionButtonName]));
		
		var content, action; 
		if(sActionButtonName === "customAttributesSegBtn"){
			buttonClicked.setIcon('');
			buttonClicked.setIcon(this.constants.iconPool.getIconURI("collapse"));
			content = this._getCustomAttributeContentforRowRepeater(buttonClicked, rowNumber);
			action = "customAttributes";
		}else if(sActionButtonName === "commentsSegBtn"){
			content = this._getCommentsContentforRowRepeater(buttonClicked, rowNumber);
		}else if (sActionButtonName === "attachmentsSegBtn"){
			this._getAttachments(buttonClicked, rowNumber);
		} 
		
		this.data("previousSelection",buttonClickedID);
	}else{
		//Show/Hide tooltip
		if(sActionButtonName === "customAttributesSegBtn"){
			buttonClicked.setIcon('');
			buttonClicked.setIcon(this.constants.iconPool.getIconURI("expand"));
		}
		buttonClicked.setTooltip(this._oBundle.getText(this.constants.mTooltipforActionButtonsinRR.show[sActionButtonName]));
		this._removeActionContentinRowRepeater(rowNumber);
	}
};

sap.uiext.inbox.Inbox.prototype.handleCommentAdded = function(oEvent, inBox){
	var feeder = oEvent.getSource();
	var oModel=  inBox.getCoreModel();
	var instanceID = decodeURIComponent(this.data("instanceID"));
	var sCommentTxt = oEvent.getParameter('text');
	var sapOrigin = this.data("SapOrigin");
	
	var oAddCommentEntry = {};
	oAddCommentEntry.InstanceID = instanceID;
	oAddCommentEntry.SAP__Origin = sapOrigin;
	oAddCommentEntry.Text = sCommentTxt;
	
	inBox.oDataManager.callFunctionImport(inBox.constants.addCommentFunctionImport, {
		method : "POST",
		urlParameters : oAddCommentEntry,
		success : function(data, request) {
			var sCommentCreatedByName = data.CreatedByName;
			var sCommentCreatedBy = data.CreatedBy;
			var sCommentSAPOrigin = data.SAP__Origin;
			var sCommentCreatedByUserName = inBox.loggedInUserName;
			sCommentCreatedByName? feeder.setFeederSender(sCommentCreatedByName) : feeder.setFeederSender(""); 
		
			var oNewComment = new sap.uiext.inbox.composite.InboxComment(feeder.getId()+'-new-'+ feeder.getComments().length, {
				text: data.Text,
				timestamp: inBox.tooltipFormatForDateTime(data.CreatedAt),
				createdBy: sCommentCreatedByUserName,
				sapOrigin: sCommentSAPOrigin,
				sender: sCommentCreatedByName,
				thumbnailSrc: inBox.inboxUtils.getUserMediaResourceURL(inBox.bpmSvcUrl, sCommentSAPOrigin, sCommentCreatedBy)
			});
			feeder.addComment(oNewComment);
			inBox.showMessage("success", inBox._oBundle.getText("INBOX_MSG_COMMENT_ADD_SUCCESS"));
		},
		error : function(error) {
			//TODO: use enums for messageType.
			inBox.showMessage("error", inBox._oBundle.getText("INBOX_MSG_COMMENT_ADD_ERROR"));
		}
	});

};


sap.uiext.inbox.Inbox.prototype._getComments = function(sTaskInstanceID,sSapOriginID, rowNumber){
	var constants = this.constants;
	var that = this;
	var oTaskCollectionTCMMetadata = constants.TaskCollection;
	
	var sURIPart = constants.forwardSlash 
								+ oTaskCollectionTCMMetadata.entityName 
										+ "(" 
											+ oTaskCollectionTCMMetadata.properties.instanceID
													+ "='"
															+ sTaskInstanceID + 
																"',"
																	+ constants.sapOrigin 
																		+ "='" 
																			+ sSapOriginID 
																					+ "')" 
																						+ constants.forwardSlash
																							+ oTaskCollectionTCMMetadata.navParam.comments;
    
		var sRequestURI = this.bpmSvcUrl + sURIPart;
		var oModel = this.getCoreModel(), aComments = [];
		
	    var oRequestOptions = {
	        async:true,
	        requestUri : sRequestURI,
	        method : "GET",
	        headers : {
	            Accept : constants.acceptHeaderforJSON,
	            "x-csrf-token" : oModel.oHeaders["x-csrf-token"]
	        }
	    };
    
	    OData.request(oRequestOptions, function(data, request) {
	    	aComments = data.results;
	    	if(aComments){
	    		that._displayComments(aComments, rowNumber);
	    	}
	    }, function(error) {
	    	var oInbxTComm = that._getComponent("comments-"+rowNumber);
	    	oInbxTComm.showBusy(false);
	    	this.showMessage("error", this._oBundle.getText("INBOX_MSG_FETCH_COMMENTS_FAILS"));
	    });
};

sap.uiext.inbox.Inbox.prototype._displayComments = function(aComments, rowNumber){
	var oCommentsModel = new sap.ui.model.json.JSONModel();
	oCommentsModel.setData(aComments);
	
	var oInbxTComm = this._getComponent("comments-"+rowNumber);
	oInbxTComm.setModel(oCommentsModel);
	var oCommentTemplate = new sap.uiext.inbox.composite.InboxComment({
		sender: "{CreatedByName}",
		text: "{Text}",
		createdBy:"{CreatedBy}",
		sapOrigin:"{SAP__Origin}"
	});
	sap.uiext.inbox.composite.InboxComment.bpmSvcUrl = this.bpmSvcUrl;
	oCommentTemplate.bindProperty("timestamp","CreatedAt",this.tooltipFormatForDateTime);
	oInbxTComm.showBusy(false);
	oInbxTComm.setShowHeader(true);
	oInbxTComm.bindAggregation("comments",{path:"/",template: oCommentTemplate});
	
};

sap.uiext.inbox.Inbox.prototype._removeActionContentinRowRepeater = function(rowNumber){
	//Implementation seems a little strange : recheck.
	var sTaskDetailVLayoutId = this.getId() + '--' + 'rrMainMatrixLayout' + '-' + this.getId() + '--' + 'tasksRowRepeater-';
	var oRRTaskDetailContent = sap.ui.getCore().byId(sTaskDetailVLayoutId + rowNumber);

	if(oRRTaskDetailContent){
		var sLastRowMatLayoutID = this.getId() + '--' + 'lastRowOfRowRepeater-' + rowNumber;
		var oLastRowOfRowRepeater = sap.ui.getCore().byId(sLastRowMatLayoutID);
		if(oLastRowOfRowRepeater){
			var sLastRowCellID = this.getId() + '--' + 'lastRowCell-'+ rowNumber;
			var oLastRowCell = sap.ui.getCore().byId(sLastRowCellID);
			if(oLastRowCell){
				oLastRowCell.removeAllContent();
			}
			oRRTaskDetailContent.removeRow(sLastRowMatLayoutID);
		}
	}
	return oRRTaskDetailContent;
};

sap.uiext.inbox.Inbox.prototype._addActionContentinRowRepeater = function(rowNumber, action, content){
	//TODO: adding and removing method implementation doesnt look so good , creating the same objects again, needs a relook. 
	var oRRTaskDetailContent = this._removeActionContentinRowRepeater(rowNumber);
	if(oRRTaskDetailContent){
		var sLastRowRepMatLayoutID = this.getId() + '--' + 'lastRowOfRowRepeater-' + rowNumber;
		var oLastRowOfRowRepeater = sap.ui.getCore().byId(sLastRowRepMatLayoutID);
		if(!oLastRowOfRowRepeater){
			oLastRowOfRowRepeater = new sap.ui.commons.layout.MatrixLayoutRow({
				id : sLastRowRepMatLayoutID
			});
		}
		var sLastRowCellID = this.getId() + '--' + 'lastRowCell-'+ rowNumber;
		var oLastRowCell = sap.ui.getCore().byId(sLastRowCellID);
		if(!oLastRowCell){
			oLastRowCell = new sap.ui.commons.layout.MatrixLayoutCell({
				id : sLastRowCellID,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				colSpan : 2
			});
		}
		oLastRowCell.addStyleClass('sapUIExtInboxLastRowPadding'); // setting the right padding to cell
		oLastRowCell.addContent(content); 
		oLastRowOfRowRepeater.addCell(oLastRowCell);
		oRRTaskDetailContent.addRow(oLastRowOfRowRepeater);
	}
};

sap.uiext.inbox.Inbox.prototype._searchText= function(sText,sSearchText){
	return sText.toLowerCase().indexOf(sSearchText.toLowerCase()) >= 0 ? true : false;
};

sap.uiext.inbox.Inbox.prototype._getValuePresent= function(oData,oNavigation,sNavigationPath,sSearchText){
	var sNavigation,oNavigationEntry,oNavigationEntryInModel;
	if(!oNavigation){
		return false;
	}
	if(oNavigation.__list instanceof Array){
		oNavigationEntry= oNavigation.__list[0];
	}
	else{
		oNavigationEntry= oNavigation.__ref;
	}
	oNavigationEntryInModel= oData[oNavigationEntry];
	if(oNavigationEntry){
		var sNavigationText= oNavigationEntryInModel ? oNavigationEntryInModel[sNavigationPath] : ""; 
		if(sNavigationText){
		
			return this._searchText(sNavigationText, sSearchText);
		}
	}
	return false;
};

sap.uiext.inbox.Inbox.prototype._searchUsers= function(oSearchInput){
	var that = this;
	var oFunctionImport = this.oTCMModel.getFunctionImportHandler();
	var dynamicId = that.getId() + '--';
	var oTable = sap.ui.getCore().byId(dynamicId + "userTable"); 
	oFunctionImport.setServiceURL(this.bpmSvcUrl);
	oFunctionImport.setHeaders({
        Accept : this.constants.acceptHeaderforJSON,
        "x-csrf-token" : this.oModel.oHeaders["x-csrf-token"]
	});
	
	var sSearchTerm = oSearchInput.sSearchTerm;
	var iMaxResults =  oSearchInput.iMaxResults;
	var sSAPOrigin = oSearchInput.sSAPOrigin;
	var oResultData;
	
	this.oPendingSearchRequest = oFunctionImport.callSearchUsers({
		SearchPattern: jQuery.sap.encodeURL(sSearchTerm), MaxResults : iMaxResults, SAP__Origin : sSAPOrigin}, 
			function(oData, response){
					oResultData =  oData;
					that.displaySearchResults(oResultData, iMaxResults, oTable);
		 			oTable.setBusy(false);
		 			that.oPendingSearchRequest = undefined;
				}, function(error) {
					oTable.setBusy(true);
				 	if(error.response !== undefined) {
				 		that.showMessage("error", that._oBundle.getText("INBOX_MSG_NO_USER_FOUND", [sSearchTerm]));
				 		oTable.setBusy(false);
				 	}
					that.oPendingSearchRequest = undefined;
			    });
	
};
sap.uiext.inbox.Inbox.prototype.displaySearchResults = function(oResultData, iMaxResults, oTable) {
	
	if(oResultData){
			var oModel = new sap.ui.model.json.JSONModel();
		    oModel.setData(oResultData);
		    oTable.clearSelection();
		    oTable.setModel(oModel);
			oTable.bindRows("/results");
		
	if(oResultData.results.length > 0){ 
		oTable.setSelectedIndex(0);
		if(oResultData.results.length === iMaxResults){
			this.showMessage("warning", this._oBundle.getText("INBOX_TOP_MAX_USER", [iMaxResults]));
		}
	}else if(oResultData.results.length === 0)
	{
		this.showMessage("error", this._oBundle.getText("INBOX_MSG_FOR_NO_DATA"));
	}
 }
	
}

sap.uiext.inbox.Inbox.prototype._handleForwardButtonVisibilityOnRowSelection = function(aSelectedSAPOrigin, oSupportsAction){
	var forwardButton = this._getComponent('forwardActionButton');
	var bCompletedTasksSelected = this._isCompletedTasksSelected();
	//if (this.isForwardActionEnabled && !bCompletedTasksSelected && !jQuery.isEmptyObject(oSupportsAction.aSupportsForward) && oSupportsAction.aSupportsForward.indexOf(false) === -1 ) { 
	if (this.isForwardActionEnabled && !bCompletedTasksSelected && !jQuery.isEmptyObject(oSupportsAction.aSupportsForward) && jQuery.inArray(false, oSupportsAction.aSupportsForward) === -1 ) {
		forwardButton.setEnabled(true).data("SAP__Origin",aSelectedSAPOrigin);
	}else {
		forwardButton.setEnabled(false);
	} 
};

sap.uiext.inbox.Inbox.prototype.setConfiguration = function(oConfiguration){
	this.oConfiguration = oConfiguration;
};

sap.uiext.inbox.Inbox.prototype._handleSearchUsersClickforForward = function(oEvent){
	var oForwardActionSource = oEvent.oParentSource;
	var sSAPOrigin = oForwardActionSource.data("SAP__Origin");
	if(!sSAPOrigin){
		var oContext = oForwardActionSource.getBindingContext();
		sSAPOrigin = this.getCoreModel().getProperty("SAP__Origin", oContext);
	}
	if ( typeof(sSAPOrigin) === "object" && sSAPOrigin.length > 1) {
		sSAPOrigin = sSAPOrigin[0];
	}
	
	var iMaxResults = this.oConfiguration ? this.oConfiguration.getSearchUersMaxLimit() : 100;
	
	if(this.oPendingSearchRequest !== undefined) {
		this.oPendingSearchRequest.abort();
	}
	
	return this._searchUsers({sSearchTerm: jQuery.trim(this._getComponent('oSearch').getValue()),
							iMaxResults:iMaxResults,
								sSAPOrigin: sSAPOrigin});
};

sap.uiext.inbox.Inbox.prototype._bindTaskActionsProperties = function(oTaskActionObject, sProperty){
    oTaskActionObject.setVisible(true);
    oTaskActionObject.bindProperty("enabled",sProperty);
};

sap.uiext.inbox.Inbox.prototype._bindTaskActions = function(oEvent){
	var claimButton = this._getComponent('claimActionButton');
    var releaseButton = this._getComponent('releaseActionButton');
    var completeButton = this._getComponent('openActionButton');
    var forwardButton = this._getComponent('forwardActionButton');
    var claimLink = this._getComponent('rrViewClaimAction');
    var releaseLink = this._getComponent('rrViewReleaseAction');
    var forwardLink = this._getComponent('rrViewForwardAction');
    
    if(this.typeOfModel === "OData"){
    	var sTaskEntity = this.constants.ENTITY_NAME_TASK_COLLECTION;
    	
    	if(this.oTcmMetadata._isPropertyAvailable(sTaskEntity, "SupportsClaim")){
    		this._bindTaskActionsProperties(claimButton, "SupportsClaim");
    		this._bindTaskActionsProperties(claimLink, "SupportsClaim");
		}
    	if(this.oTcmMetadata._isPropertyAvailable(sTaskEntity, "SupportsRelease")){
    		this._bindTaskActionsProperties(releaseButton, "SupportsRelease");
    		this._bindTaskActionsProperties(releaseLink, "SupportsRelease");
    		this._setVisibility('dotSeparator', true);
    	}
    	if(this.oTcmMetadata._isPropertyAvailable(sTaskEntity, "SupportsForward") && this.isForwardActionEnabled){
    		this._bindTaskActionsProperties(forwardButton, "SupportsForward");
    		this._bindTaskActionsProperties(forwardLink, "SupportsForward");
    		this._setVisibility('dotSeparator2', true);
    	} else if (!this.isForwardActionEnabled) {
    		var oActionLinksLayout = this._getComponent("taskActionMatrixLayout");
    		var oActionLinksRow = oActionLinksLayout.getRows()[0];
    		var oDotSeparatorCell = oActionLinksRow.getCells()[3];
    		var oForwardActionCell = oActionLinksRow.getCells()[4];
    		oActionLinksRow.removeCell(oDotSeparatorCell);
    		oActionLinksRow.removeCell(oForwardActionCell);    		
    		
    	}
    } else { // for Models other than OData
    	this.showAllActions();
    	claimLink.bindProperty("enabled","SupportsClaim");
        releaseLink.bindProperty("enabled","SupportsRelease");
        if(this.isForwardActionEnabled){
        	forwardLink.bindProperty("enabled","SupportsForward");
        }
    }
    
};

sap.uiext.inbox.Inbox.prototype._refreshLocal = function(aCompletedTaskContexts, changeContextValues, bFilter){
    if(this.currentView === this.constants.tableView){
    	this._refreshLocalTableView(aCompletedTaskContexts, changeContextValues, bFilter);
    }else{
    	this._refreshLocalRowRepeaterView(aCompletedTaskContexts, changeContextValues, bFilter);
    }
    var parentEvent = new sap.ui.base.Event();
    parentEvent.mParameters = {url:'/TaskCollection'};
    this._handleRequestCompleted(parentEvent);
};

sap.uiext.inbox.Inbox.prototype._refreshLocalTableView = function(aCompletedTaskContexts, changeContextValues, bFilter){
	var oCurrentViewElement = this._currentViewElement();
    var oModel = oCurrentViewElement.getModel();
    var aIndexes = this._getTableIndicesByContext(aCompletedTaskContexts,oCurrentViewElement), that = this;
    if(aCompletedTaskContexts && aCompletedTaskContexts.length > 0){
	    jQuery.each(aCompletedTaskContexts, function(i, oContext) {
	    	that._deleteTaskEntry(oContext, oModel, aIndexes[i], oCurrentViewElement, bFilter);
	    });
	    oCurrentViewElement.rerender();
    }
    if(changeContextValues){
    	this._changeTaskData(changeContextValues,oModel,oCurrentViewElement);
    	/*this._changeTaskData(changeContextValues,oModel,oCurrentViewElement);
          var oModelData = oModel.oData;
          jQuery.each(changeContextValues, function(i, oContextMetaData) {
            var oContext = oContextMetaData.context;
            var oKeys = oContextMetaData.keys;
            var sContextPath = oContext.getPath().substr(1);
            var oEntry = oModelData[sContextPath];
            oCurrentViewElement.rerender();
            jQuery.each(oKeys, function(i, oKeyValue) {
                  oEntry[oKeyValue.key] = oKeyValue.value;
             });
        });*/
    }
};

sap.uiext.inbox.Inbox.prototype._refreshLocalRowRepeaterView = function(aCompletedTaskContexts, changeContextValues, bFilter){
	var oCurrentViewElement = this._currentViewElement();
    var oModel = oCurrentViewElement.getModel();
	if(aCompletedTaskContexts && aCompletedTaskContexts.length > 0){
        var iIndex = oCurrentViewElement.indexOfRow(aCompletedTaskContexts[0].orow);
        if(iIndex > -1){
        	this._deleteTaskEntry(aCompletedTaskContexts[0].context, oModel, iIndex, oCurrentViewElement, bFilter);
        	oCurrentViewElement.updateRows(false);
        }
	}
    if(changeContextValues){
    	  this._changeTaskData(changeContextValues,oModel,oCurrentViewElement);
          /*var oModelData = oModel.oData;
          jQuery.each(changeContextValues, function(i, oContextMetaData) {
            var oContext = oContextMetaData.context;
            var oKeys = oContextMetaData.keys;
            var sContextPath = oContext.getPath().substr(1);
            var oEntry = oModelData[sContextPath];
            jQuery.each(oKeys, function(i, oKeyValue) {
                  oEntry[oKeyValue.key] = oKeyValue.value;
                  if(oEntry.Status === 'RESERVED'){
        			  oEntry.SupportsClaim = false;
        			  oEntry.SupportsRelease = true;
        		  }else if (oEntry.Status === 'READY'){
        			  oEntry.SupportsClaim = true;
        			  oEntry.SupportsRelease = false;
        		  }
             });
            oCurrentViewElement.updateRows(false);
        });*/
    }
};

sap.uiext.inbox.Inbox.prototype._deleteTaskEntry = function(oContext, oFromModel, iIndexinElementBinding, oFromElement, bFilter){
	if(!bFilter){
		oFromModel.deleteCreatedEntry(oContext);
	}
	var oFromElementBinding = oFromElement.mBindingInfos['rows'].binding;
	if(oFromElementBinding){
		//oFromElementBinding.aKeys.splice(oFromElementBinding.aKeys.indexOf(oContext.getPath().substr(1)),1)
		oFromElementBinding.aKeys.splice(jQuery.inArray(oContext.getPath().substr(1), oFromElementBinding.aKeys), 1);
		oFromElementBinding.iLength = oFromElementBinding.iLength - 1;
	}
};

sap.uiext.inbox.Inbox.prototype._changeTaskData = function(changeContextValues, oModel, oCurrentViewElement){
    var oModelData = oModel.oData, that = this;
    jQuery.each(changeContextValues, function(i, oContextMetaData) {
      var oContext = oContextMetaData.context;
      var oKeys = oContextMetaData.keys;
      var sContextPath = oContext.getPath().substr(1);
      var oEntry = oModelData[sContextPath];
      if(that._currentView() === that.constants.tableView){
    	  oCurrentViewElement.rerender();
      }
      jQuery.each(oKeys, function(i, oKeyValue) {
            oEntry[oKeyValue.key] = oKeyValue.value;
            if(oEntry.Status === 'RESERVED'){
  			  oEntry.SupportsClaim = false;
  			  oEntry.SupportsRelease = true;
  		  }else if (oEntry.Status === 'READY'){
  			  oEntry.SupportsClaim = true;
  			  oEntry.SupportsRelease = false;
  		  }
       });
      if(that._currentView() === that.constants.rowRepeaterView){
    	  oCurrentViewElement.updateRows(false);
      }
  });
};

sap.uiext.inbox.Inbox.prototype._getAppliedStatusFilterValues = function(changeContextValues, oModel, oCurrentViewElement){
	var oCurrentViewElement = this._currentViewElement(), currentViewElementBinding = this._currentViewElement().getBinding('rows');
	var aCurrentViewElemBindingFilters = currentViewElementBinding.aFilters.concat(currentViewElementBinding.aApplicationFilters);
	if(currentViewElementBinding && aCurrentViewElemBindingFilters && aCurrentViewElemBindingFilters.length > 0){
        var sStatusFilterParam = [];
          if(this.inboxUtils._hasFilter(aCurrentViewElemBindingFilters, 'Status', 'EQ', 'READY')){
          	sStatusFilterParam.push("READY");
          }
          if(this.inboxUtils._hasFilter(aCurrentViewElemBindingFilters, 'Status', 'EQ', 'RESERVED')){
          	sStatusFilterParam.push("RESERVED");
          }
          if(this.inboxUtils._hasFilter(aCurrentViewElemBindingFilters, 'Status', 'EQ', 'IN_PROGRESS')){
          	sStatusFilterParam.push("IN_PROGRESS");
          }
          return sStatusFilterParam;
    }
};

sap.uiext.inbox.Inbox.prototype._handleErrorOnBatchRequests = function(oError, sAction, iTotalNumberOfRequests){
	this.hideBusyLoader();
    this.showMessage("error", this._oBundle.getText("INBOX_MSG_ACTION_FAILED_MULTIPLE_TASKS", [sAction, iTotalNumberOfRequests]));
};

sap.uiext.inbox.Inbox.prototype._handleErrorOnActionFailed = function(oError, sAction, sTaskTitle){
	this.hideBusyLoader();
    this.showMessage("error", this._oBundle.getText("INBOX_MSG_ACTION_FAILED", [sAction, sTaskTitle]));
};

sap.uiext.inbox.Inbox.prototype.storeFilterState = function(sKey) {
	var that = this;
	var aFilterKeysMap = this.bShowNoDueDateFilter ? this.constants.filterKeysMetaMapWithNoDueDate : this.constants.filterKeysMetaMap;
	var aKeys = aFilterKeysMap[sKey];
	
	jQuery.each(aKeys, function(i, sKeyValue) {
		if ( that.filtersToApply[sKeyValue] != undefined){
			var oFilterObject = that.filtersToApply[sKeyValue];
			if (that.filterState[sKey] === undefined){
				that.filterState[sKey] = {};
				that.filterState[sKey].filters = {};				
			}
			that.filterState[sKey].filters[sKeyValue] = oFilterObject;
		}
	});
	 
};

sap.uiext.inbox.Inbox.prototype.retrieveFilterState = function( sKey) {
	var that = this;
	if (that.filterState[sKey]){
		var filterStateFilters = that.filterState[sKey].filters;
		jQuery.each(filterStateFilters, function(sKey, oValue) {
			that.filtersToApply[sKey] = oValue;
			delete filterStateFilters[sKey];
		});
		delete that.filterState[sKey];
	}
};

sap.uiext.inbox.Inbox.prototype._toggleCustomAttributesVisibilityActionEvent= function(oEvent,oInbox){
	var oButtonClicked = oEvent.getSource();
	var bPressed = oButtonClicked.getPressed();
	oInbox._toggleCustomAttributesIcon(oButtonClicked, bPressed);
	oButtonClicked.setTooltip(oInbox._oBundle.getText(bPressed ? "INBOX_HIDE_ALL_CUSTOM_ATTRIBUTES" : "INBOX_SHOW_ALL_CUSTOM_ATTRIBUTES"));
	oInbox.bCustomAttributesVisible = bPressed;
	bPressed ? oInbox._addCustomAttributes(oInbox) : oInbox._removeCustomAttributes();
	
};

sap.uiext.inbox.Inbox.prototype._addCustomAttributes= function(oInbox){
	
	var oTasksRowRepeater = oInbox._getComponent('tasksRowRepeater');
	var aRowRepeaterRows= oTasksRowRepeater.getRows();
	var inboxId = oInbox.getId();
	jQuery.each(aRowRepeaterRows,function(rowNumber,oRow){
		oInbox._updateActionButtonsContent(true, rowNumber);
		var sSelectedTaskInstance = oInbox.getModel().getProperty(oInbox.constants.TaskCollection.properties.instanceID, oRow.getBindingContext()); 
		var sSapOrigin = oInbox.getModel().getProperty(oInbox.constants.sapOrigin, oRow.getBindingContext());
		if(!(sSelectedTaskInstance && sSapOrigin))
			return false;
		var sSelectedTaskDefinition = oInbox.getModel().getProperty(oInbox.constants.TaskDefinitionCollection.properties.taskDefnID, oRow.getBindingContext());
		oInbox._getCustomAttributeContentforRowRepeater(null, rowNumber, sSelectedTaskDefinition, sSelectedTaskInstance, sSapOrigin);
	});
	
};

sap.uiext.inbox.Inbox.prototype._removeCustomAttributes= function(){
	var aRowRepeaterRows= this._getComponent('tasksRowRepeater').getRows();
	var that = this;
	jQuery.each(aRowRepeaterRows,function(iRowNumber,oRow){
		that._removeActionContentinRowRepeater(iRowNumber);
		that._updateActionButtonsContent(false, iRowNumber);
	});
};

sap.uiext.inbox.Inbox.prototype._updateActionButtonsContent = function(bPressed, rowNumber) {
	
	var oSegBtn= sap.ui.getCore().byId(this.getId()+"--customAttributesSegBtn-"+this.getId()+"--tasksRowRepeater-"+rowNumber);
	this.inboxUtils.deSelectOtherActionButtonsinStreamView(oSegBtn);
	oSegBtn.setPressed(bPressed);
	oSegBtn.setIcon('');
	oSegBtn.setIcon(this.constants.iconPool.getIconURI(bPressed ? "collapse" : "expand"));
	oSegBtn.setTooltip(this._oBundle.getText(bPressed ? "INBOX_HIDE_CUSTOM_ATTRIBUTES" : "INBOX_SHOW_CUSTOM_ATTRIBUTES"));
	
};

sap.uiext.inbox.Inbox.prototype._toggleCustomAttributesIcon = function(oButtonClicked, bPressed){
	oButtonClicked.setIcon(sap.ui.core.IconPool.getIconURI(""));
	oButtonClicked.setIcon(this.constants.iconPool.getIconURI(bPressed ? "collapse" : "expand"));
};

sap.uiext.inbox.Inbox.prototype._createNoDataLabel = function(sText){
	var oLabel = new sap.ui.commons.Label({
		text : sText,
		tooltip : sText,
		width : '100%',
		textAlign : sap.ui.core.TextAlign.Center
		});
		oLabel.addStyleClass("sapUIExtInboxCustomAttributesBorder");
		
		return oLabel;
};

sap.uiext.inbox.Inbox.prototype.setOpenTaskUIInNewTab = function(bValue){
	this.bOpenTaskUIInNewTab = bValue;
};

/*
 * Custom attribute sorter
 */
sap.uiext.inbox.Inbox.prototype._applySortOnTableColumn = function (oColumn, attrName, attrType, sortDirection) {
	this._resetStateBeforeSearch(); // resetting state before sort
	var oModel = this.getCoreModel();
	var currentViewElement = this._currentViewElement();

	//Preserve filtering
	var filteredKeys = currentViewElement._originalKeys;
	if (this._isTableFiltered(null)) {
		filteredKeys = this._getCurrentBindingKeysForTableColumnFilters(oModel._original_data, currentViewElement._originalKeys, null);
	}

	//Construct object array to be sorted
	var objArr = new Array();
	for(var i=0; i<filteredKeys.length; i++){
		var val = oModel._original_data[filteredKeys[i]];
		var aCustomAttributeKeys = val.CustomAttributeData.__list;
		var customAttributeValue = null;
		for(var k=0; k<aCustomAttributeKeys.length; k++){
			var customAttributeKey = aCustomAttributeKeys[k];
			if(customAttributeKey.indexOf(attrName) > 0){
				customAttributeValue = oModel._original_data[customAttributeKey].Value;
				break;
			}
		}
		var entry = {
				key: filteredKeys[i],
				type: attrType,
				dir: sortDirection,
				val: customAttributeValue
		};
		objArr.push(entry);
	}

	//Sorting comparator function
	/*
	 * (a<b) => -1
	 * (a>b) => 1
	 * (a=b) => 0
	 */
	var comparator = function(a,b)
	{
		var timeParser = { //precision - seconds, time zone ignored
			parse: function(val){// returns NaN if cannot be resolved
				if(!val || val.length == 0) return NaN;
				var parts = val.split(':');
				if(parts.length != 3) return NaN;
				var h = parseInt(parts[0]);
				if(isNaN(h)) return NaN;
				var m = parseInt(parts[1]);
				if(isNaN(m)) return NaN;
				var secs = parseInt(parts[2]);
				var ptIndex = secs.indexOf('.');
				if(ptIndex >=0) secs = secs.substring(0,ptIndex);
				var s = parseInt(secs);
				if(isNaN(s)) return NaN;
				return h*60*60 + m*60 + s;
			}
		};

		var durationParser = {
			parse: function(val){ //returns 0, if cannot be resolved
				//Duration format: PnYnMnDTnHnMnS
				var hours = 0;
				var minutes = 0;
				var seconds = 0;

				var str = new String(val);
				var Tindex = str.indexOf('T');
				if(Tindex >=0){
					str = str.substring(Tindex+1, str.length); //Cut the time part
					var Hindex = str.indexOf('H');
					var Mindex = str.indexOf('M');
					var Sindex = str.indexOf('S');
					if(Hindex >= 0){
						hours = str.substring(0, Hindex);
						if(isNaN(hours)) hours = 0;
					}
					if(Mindex >= 0){
						minutes = str.substring(Hindex+1, Mindex);
						if(isNaN(minutes)) minutes = 0;
					}
					if(Sindex >= 0){
						seconds = str.substring(Mindex+1, Sindex);
						if(isNaN(seconds)) seconds = 0;
					}
				}

				return hours*60*60 + minutes*60 + seconds;
			}
		};

		var typeStr = a.type.toLowerCase();
		var dirModifier = (a.dir.toLowerCase().indexOf("ascending")>=0)?1:-1;
		if(typeStr.indexOf("boolean") >= 0){ //Boolean
			var aBool = ((a.val+"").toLowerCase() == 'true')?true:false;
			var bBool = ((b.val+"").toLowerCase() == 'true')?true:false;
			if(aBool == bBool) return 0;
			return dirModifier*(aBool?-1:1);
		}
		else if(typeStr.indexOf("date") >= 0 || typeStr.indexOf("time") >= 0){ //Date, DateTime, Time, Duration
			//Try to parse as dates
			var aTimestamp = Date.parse(a.val);
			var bTimestamp = Date.parse(b.val);

			//Check for time or duration
			if(isNaN(aTimestamp)){ //Try parse it as time
				aTimestamp = timeParser.parse(a.val);
			}
			if(isNaN(aTimestamp)){ //Try parse it as duration
				aTimestamp = durationParser.parse(a.val);
			}
			if(isNaN(bTimestamp)){ //Try parse it as time
				bTimestamp = timeParser.parse(b.val);
			}
			if(isNaN(bTimestamp)){ //Try parse it as duration
				bTimestamp = durationParser.parse(b.val);
			}

			if(aTimestamp == bTimestamp) return 0;
			return dirModifier*((aTimestamp < bTimestamp)?-1:1);
		}
		//number: BigDecimal, Float, Long, Integer
		else if(typeStr.indexOf("decimal") >= 0 || typeStr.indexOf("float") >= 0 || typeStr.indexOf("integer") >= 0 || typeStr.indexOf("long") >= 0){
			var aNum = 0;
			var bNum = 0;
			if(isFinite(a.val)){
				aNum = Number(a.val);
				if(isNaN(aNum)) aNum = 0;
			}
			if(isFinite(b.val)){
				bNum = Number(b.val);
				if(isNaN(bNum)) bNum = 0;
			}
			if(aNum.valueOf() == bNum.valueOf()) return 0;
			return dirModifier*((aNum.valueOf() < bNum.valueOf())?-1:1);
		}
		//Default: String
		return dirModifier*((a.val+"").localeCompare((b.val+"")));
	};
	objArr.sort(comparator);

	//Extract sorted keys list
	var sortedKeys = new Array();
	for(var i=0; i<objArr.length; i++){
		sortedKeys[sortedKeys.length] = objArr[i].key;
	}

	// binding the search results to table
	this._renderTableAfterSort(oColumn, sortDirection, sortedKeys, oModel._original_data, oModel);
};

/* this function below is called in response of event 'Filter' of a table's column which takes following as input : the column that needs to be searched upon and search text.
 * this function will bind the table to data which satisfies the search criteria.
 * it will combine three search results : filtering on current column, filtering on other columns if applied already and local search if applied.
 * as result, the table will be bound to data that satisfies all the three search conditions.
 */
sap.uiext.inbox.Inbox.prototype._applyFilterOnTableColumns = function (oColumn, sValue) {
	var srchText = sValue.toLowerCase();
	var oModel = this.getCoreModel();
	var currentViewElement = this._currentViewElement();
	var aFilteredKeys = [];
	var aResultKeys = [];
	this._resetStateBeforeSearch(); // resetting state before search
	
	// getting result keys of the current search
	var aCurrentKeys = this._getBindingKeysForTableColumnFilter(oColumn, oModel._original_data, currentViewElement._originalKeys, srchText);
	aFilteredKeys.push(aCurrentKeys);
	
	// getting result keys in case any other column is filtered already
	if (this._isTableFiltered(oColumn)) {
		aFilteredKeys.push(this._getCurrentBindingKeysForTableColumnFilters(oModel._original_data, currentViewElement._originalKeys, oColumn));
	}
	
	// getting result keys of local search if applied already
	var sLocalSearchText = this._getLocalSearchText();
	if (sLocalSearchText) {
		aFilteredKeys.push(this._getBindingKeysOnLocalSearch(sLocalSearchText, oModel._original_data, currentViewElement._originalKeys));
	}
	
	// intersecting all the above result keys
	aResultKeys = this.inboxUtils._getUniqueArray(aFilteredKeys);
	
	// setting property Filtered to true to show the filtered image in column header
	oColumn.setFiltered(!!srchText); 
	oColumn.setFilterValue(srchText);
	
	// binding the search results to table
	this._renderTableAfterSearch(aResultKeys, oModel._original_data, oModel);
};

/* this function below searches the text in a column and return an array of valid keys that satisfies the search condition.
 * it searches locally on the values being displayed in the Table. It doesn't make any oData calls.
 */
sap.uiext.inbox.Inbox.prototype._getBindingKeysForTableColumnFilter = function(oColumn, oSearchData, aSearchKeys, sText) {
	var keys = [];
	var sFilterProperty = oColumn.getProperty("filterProperty");
	for (var l in aSearchKeys) {   //var l in aSearchKeys
        //var val = oSearchData[j];
        var valuePresent = false;
        var fieldValue, taskMetadataProperty;
        
        // check over the table's row bindings
        for ( var j in oSearchData) {  // var j in oSearchData
            if (aSearchKeys[l] == j) {
            	var val = oSearchData[j];
            	
            	// searching only in standard attribute columns if column is of type standard attribute
            	if(oColumn.data("ColumnType") == "StandardAttribute") { 
            		for ( var k = 0; k < this._getCategoryMetadata().properties.length; k++) {
            			taskMetadataProperty = this._getCategoryMetadata().properties[k];
            			if (taskMetadataProperty === sFilterProperty)  {
            				var fieldValue = val[taskMetadataProperty];
            				if (!fieldValue  && taskMetadataProperty  === "TaskTitle") {
            					fieldValue =  this._oBundle.getText("INBOX_TASK_TITLE_NOTAVAILABLE_MSG") ;
            				}
            				if (fieldValue != null) {
            					//search on formatted value of dates
            					if (jQuery.type(fieldValue) === "date") {
            						fieldValue = (this.inboxUtils.dateTimeFormat(fieldValue));
            					}
            					fieldValue = fieldValue.toLowerCase();
            					if (fieldValue.indexOf(sText) >= 0) {
            						valuePresent = true;
            						break;
            					}
            				}
            			}
            		}
            	}
            	
            	// searching only in custom attribute columns if column is of type custom attribute
            	else if (oColumn.data("ColumnType") == "CustomAttribute") { 
            		var aCustomAttributeKeys = val.CustomAttributeData.__list;
                        if(aCustomAttributeKeys !== undefined){
                            for(var i = 0; i < aCustomAttributeKeys.length; i++ ){
                                var customAttributeKey = aCustomAttributeKeys[i];
                                if (sFilterProperty && customAttributeKey.indexOf(sFilterProperty) > 0) {
                                	var fieldValue = oSearchData[customAttributeKey].Value;
                                	if (fieldValue != null || fieldValue != undefined) {
                                		fieldValue = fieldValue.toLowerCase();
                                		if (fieldValue.indexOf(sText) >= 0) {
                                			valuePresent = true;
                                			break;
                                		}
                                	}
                                }
                            }
                        }
            	}
            	
            	if (valuePresent) {
                	var key = j;
                	keys.push(key);
               }
            }
        }
    }
	return keys;
};

/* this function below preserves column filter state if columns are filtered already.
 * this function is called on requestCompleted event of oData model.
 */
sap.uiext.inbox.Inbox.prototype._preserveTableFilters = function(){
	var oModel = this.getCoreModel();
	var oBindingInfo, currentViewElement;
	var currentViewElement = this._currentViewElement();
	this._resetStateBeforeSearch(); // resetting state before search
	
	// getting keys that satisfies the current filtered column state
	var aFilteredKeys = this._getCurrentBindingKeysForTableColumnFilters(oModel._original_data, currentViewElement._originalKeys);
	if (aFilteredKeys)
		this._renderTableAfterSearch(aFilteredKeys, oModel._original_data, oModel);
};

sap.uiext.inbox.Inbox.prototype._preserveTableSort = function(){
	var oTable = this._getComponent('listViewTable');
	var aColumns = oTable.getColumns();

	for (var i=0; i<aColumns.length; i++ ) {
		var oColumn = aColumns[i];
		if (oColumn.getSorted()) {
			if(this._isCustomAttribute(oColumn)){
				oColumn.sort((oColumn.getSortOrder() === sap.ui.table.SortOrder.Descending), false);
			}
		}
	}
};

/* this function below takes a set of keys as input and binds the table based on the input keys.
 * it maps the keys to the data being sent, and creates a model. this model will be bound to Table.
 */
sap.uiext.inbox.Inbox.prototype._renderTableAfterSort  = function(oColumn, sortDirection, aResultKeys, oData, oModel)
{
	var currentViewElement = this._currentViewElement();
	var oBindingInfo = currentViewElement.mBindingInfos["rows"];
	var result = {};

	for (var i in aResultKeys) {
		result[aResultKeys[i]] = oData[aResultKeys[i]];
	}
	oModel.oData = result;

    if (oBindingInfo && oBindingInfo.binding) {
        oBindingInfo.binding.iLength = aResultKeys.length; // update the length information
        oBindingInfo.binding.aKeys = aResultKeys; // update the key information for the filtered result
        this.currentView === this.constants.tableView ? currentViewElement.rerender():currentViewElement.updateRows(false);
    }

    var iResultLength = currentViewElement.getBinding('rows').iLength;
    if (iResultLength <= 0)
    	this.showMessage("info", this._oBundle.getText("INBOX_MSG_FOR_NO_DATA"));
    else
        this.deleteMessage();

    // reset the sorting status of all columns
	var oTable = oColumn.getParent();
	var aCols = oTable.getColumns();
	for (var i = 0, l = aCols.length; i < l; i++) {
		if (aCols[i] !== oColumn) {
			aCols[i].setProperty("sorted", false, true);
			aCols[i].setProperty("sortOrder", sap.ui.table.SortOrder.Ascending, true);
			aCols[i]._renderSortIcon();
			delete aCols[i]._oSorter;
		}
	}

	// set the sort property of the current column
	oColumn.setProperty("sorted", true, true);
	oColumn.setProperty("sortOrder", sortDirection, true);
	oColumn._oSorter = new sap.ui.model.Sorter(oColumn.getSortProperty(), oColumn.getSortOrder() === sap.ui.table.SortOrder.Descending);

	// set the sorted flag and sort the model
	if (oColumn._afterSort) {
		oColumn._afterSort();
	}

	// update the sort icon
	oColumn._renderSortIcon();
}

/* this function below takes a set of keys as input and binds the table based on the input keys.
 * it maps the keys to the data being sent, and creates a model. this model will be bound to Table.
 */
sap.uiext.inbox.Inbox.prototype._renderTableAfterSearch = function(aResultKeys, oData, oModel) {
	var currentViewElement = this._currentViewElement();
	var oBindingInfo = currentViewElement.mBindingInfos["rows"];
	var result = {};
	
	for (var i in aResultKeys) {
		result[aResultKeys[i]] = oData[aResultKeys[i]];
	}
	oModel.oData = result;
    
    if (oBindingInfo && oBindingInfo.binding) {
        oBindingInfo.binding.iLength = aResultKeys.length; // update the length information
        oBindingInfo.binding.aKeys = aResultKeys; // update the key information for the filtered result
        this.currentView === this.constants.tableView ? currentViewElement.rerender():currentViewElement.updateRows(false);
        currentViewElement._updateBindingContexts(undefined, undefined, "change");
    }
    var iResultLength = currentViewElement.getBinding('rows').iLength;
    if (iResultLength <= 0)
    	this.showMessage("info", this._oBundle.getText("INBOX_MSG_FOR_NO_DATA"));
    else
        this.deleteMessage();
    this.fireODataRequestCompleted({bindingLength:iResultLength,appliedFilter:this._oBundle.getText("INBOX_SEARCH_RESULTS_TEXT")});
}

/* this function below returns the keys that satisfies current filter state in a table. 
 * it loops through every column in the table and if the column is filtered, gets the keys satisfying column's filter.
 * it returns intersection of keys of every column filter.  
 */
sap.uiext.inbox.Inbox.prototype._getCurrentBindingKeysForTableColumnFilters = function(oSearchData, oSearchKeys, oCurrentColumn) {
	var oTable = this._getComponent('listViewTable');
	var aColumns = oTable.getColumns();
	var aFilteredKeys = [];
	var oColumn, sText, i;
	
	// if function is getting called from table's filter event handler, we don't need to search on current column as it is being done separately
	if (oCurrentColumn) {
		var sCurrentColumnId = oCurrentColumn.getId();
		for (i=0; i<aColumns.length; i++ ) {
			var oColumn = aColumns[i];
			if (oColumn.getFiltered() && oColumn.getId() !== sCurrentColumnId) {
				var sText = oColumn.getFilterValue();
				aFilteredKeys.push(this._getBindingKeysForTableColumnFilter(oColumn, oSearchData, oSearchKeys, sText));
			}
		}
		
	} else {
		for (i=0; i<aColumns.length; i++ ) {
			oColumn = aColumns[i];
			if (oColumn.getFiltered()) {
				sText = oColumn.getFilterValue();
				aFilteredKeys.push(this._getBindingKeysForTableColumnFilter(oColumn, oSearchData, oSearchKeys, sText));
			}
		}
	}
	
	return this.inboxUtils._getUniqueArray(aFilteredKeys);
};

/* this function below returns a boolean indicating if columns of table are filtered already.
 * oCurrentColumn will be passed in case we are filtering on a table's column. In that case, we need to check if there is any other column which is already filtered.
 */
sap.uiext.inbox.Inbox.prototype._isTableFiltered = function(oCurrentColumn) {
	
	var oTable = this._getComponent('listViewTable');
	var aColumns = oTable.getColumns();
	
	if (oCurrentColumn) {
		var sCurrentColumnId = oCurrentColumn.getId();
		jQuery.each(aColumns, function(i, oColumn) {
			if (oColumn.getId() === sCurrentColumnId) {
				aColumns.splice(i,1);
				return false;
			}
		});
	}
	
	for (var i=0; i<aColumns.length; i++ ) {
		var oColumn = aColumns[i];
		if (oColumn.getFiltered()) {
			return true;
		} 
	}
	return false;
};

// this function below returns the search text if local search is applied
sap.uiext.inbox.Inbox.prototype._getLocalSearchText = function(){
	var oSearchField = this._getComponent('searchField');
	var sSearchText = oSearchField.getValue();
	if(sSearchText !== "" && sSearchText !== null){
		sSearchText = sSearchText.toLowerCase();
		return sSearchText;
	}
	return;
};

/* this function below removes the column filters.
 * this is called from switch view, on switch to stream view, all column filters will be removed.
 */
sap.uiext.inbox.Inbox.prototype._removeTableFilters = function() {
	
	var oTable = this._getComponent('listViewTable');
	var aColumns = oTable.getColumns();
	jQuery.each(aColumns, function(i, oColumn) {
		if (oColumn.getFiltered()) {
			oColumn.setFiltered(false);
			oColumn.setFilterValue("");
		} 
	});
};

sap.uiext.inbox.Inbox.prototype._resetStateBeforeSearch = function() {
	
	var oModel = this.getCoreModel();
	var currentViewElement = this._currentViewElement();
	
	// this variable maintains latest oData state in the model
	if (this.modelRefreshed) {
		oModel._original_data = oModel.oData;
		this.modelRefreshed = false;
	}

	// this varaible maintains the latest state of the table bindings wrt selected filters
	if(!currentViewElement._originalKeys) {
	currentViewElement._originalKeys = currentViewElement.getBinding('rows').aKeys;
	}
};

sap.uiext.inbox.Inbox.prototype._handleCustomActionClick = function(oEvent, params) {
	var bCommentsMandatory = oEvent.getSource().data('commentsMandatory');
	var oCustomActionPopup = ( bCommentsMandatory==true )? this.oCustomActionToolPopupCommentsMand : this.oCustomActionToolPopup;
	
	//handles opening/closing of both the popups(comments mandatory/not mandatory)
	// if the popup exists and is opened and same button is pressed, close it, otherwise open it
	if(oCustomActionPopup && oCustomActionPopup.getOpener() === oEvent.getSource().getId()){
		var oCommentInputField = oCustomActionPopup.getContent()[0]
		if(oCommentInputField){
			oCommentInputField.setValue("");
			if(bCommentsMandatory==true){
				sap.ui.getCore().byId(this.getId() + '--' + "toolPopupButton-CommentsMand").setEnabled(false);
			}
		}
		oCustomActionPopup.isOpen() ?  oCustomActionPopup.close() : oCustomActionPopup.open(sap.ui.core.Popup.Dock.BeginTop, sap.ui.core.Popup.Dock.BeginBottom);
	}
	else
		this._openCustomActionToolPopup( oEvent.getSource(), params);
	
};


sap.uiext.inbox.Inbox.prototype._openCustomActionToolPopup = function(oCustomActionButton, params) {
	var sCustomActionKey = oCustomActionButton.data('key'),
	bCommentsMandatory = oCustomActionButton.data('commentsMandatory'),
	sCustomActionCompleteButtoninPopupId = this.getId() + '--' + 'toolPopupButton',
	sCustomActionInputFieldinPopupId = this.getId() + '--' + 'addCommentsinCustomActionPopup';
	
	// If comments are mandatory, map the input field variable to the corresponding text-area
	if(bCommentsMandatory==true){
		var oCustomActionInputFieldinPopup = this.oCore.byId(sCustomActionInputFieldinPopupId + "-CommentsMand");
		var oCustomActionCompleteButtoninPopupForCommentsMand = this.oCore.byId(sCustomActionCompleteButtoninPopupId + "-CommentsMand") ; //button for comments mandatory popup
	}
	else{
		var oCustomActionInputFieldinPopup = this.oCore.byId(sCustomActionInputFieldinPopupId);
		var oCustomActionCompleteButtoninPopup = this.oCore.byId(sCustomActionCompleteButtoninPopupId);
	}

	
	// if comments are not mandatory, create/open the popup which does not have comments mandatory
	if(bCommentsMandatory==false){
		//TODO: enter needs to fire the complete Button, enter is not working along with initialFocus. Check and handle it in TextArea	
		if(!oCustomActionCompleteButtoninPopup){  //create a button for the popup if not there already
			oCustomActionCompleteButtoninPopup = new sap.ui.commons.Button(sCustomActionCompleteButtoninPopupId,{
																			  	press: jQuery.proxy(function (oEvent) {
																			  					var sComment = oCustomActionInputFieldinPopup.getValue();
																			  					var oCustomActionSource = sap.ui.getCore().byId(this.oCustomActionToolPopup.getOpener());
																			  					this._executeCustomAction(oCustomActionSource, jQuery.sap._sanitizeHTML(sComment));
																			  					this.oCustomActionToolPopup.close();
																			  		},this)
																				});
		}
		if(!this.oCustomActionToolPopup){//create the pop up and text-area if popup not there already
			oCustomActionInputFieldinPopup = new sap.ui.commons.TextArea(sCustomActionInputFieldinPopupId)
																		.setWidth('300px');
			this.oCustomActionToolPopup = new sap.ui.ux3.ToolPopup(this.getId() + '--' + 'customActionToolPopup',{
																	inverted:false,
																	content : [ oCustomActionInputFieldinPopup],
																	buttons: [oCustomActionCompleteButtoninPopup],
																	title: this._oBundle.getText('INBOX_ADD_COMMENT'),
																	autoClose: true
																});
		}
		this._resetCustomActionToolPopupContent(oCustomActionInputFieldinPopup, oCustomActionCompleteButtoninPopup, oCustomActionButton.data('text'), sCustomActionKey);
		this.oCustomActionToolPopup.setOpener(oCustomActionButton);
		if(!this.oCustomActionToolPopup.isOpen()){
			this.oCustomActionToolPopup.open(sap.ui.core.Popup.Dock.BeginTop, sap.ui.core.Popup.Dock.BeginBottom);
		}
	}
	
	
	//if comments are not mandatory, create/open the popup which does has comments mandatory
	else if(bCommentsMandatory==true){
		if(!oCustomActionCompleteButtoninPopupForCommentsMand){ //create a button for the popup if not there already
			oCustomActionCompleteButtoninPopupForCommentsMand = new sap.ui.commons.Button(sCustomActionCompleteButtoninPopupId+"-CommentsMand",{
																			  	press: jQuery.proxy(function (oEvent) {
																			  					var sComment = oCustomActionInputFieldinPopup.getValue();
																			  					var oCustomActionSource = sap.ui.getCore().byId(this.oCustomActionToolPopupCommentsMand.getOpener());
																			  					this._executeCustomAction(oCustomActionSource, jQuery.sap._sanitizeHTML(sComment));
																			  					this.oCustomActionToolPopupCommentsMand.close();
																			  		},this)
																				});
		}
		if(!this.oCustomActionToolPopupCommentsMand){ //create the pop up and text-area if popup not there already
			oCustomActionInputFieldinPopup = new sap.ui.commons.TextArea(sCustomActionInputFieldinPopupId+"-CommentsMand",{
				//validates if something has been entered and enables/disables the action button
				liveChange: function(E){
					var sValue = E.getSource().getLiveValue();
					(sValue.trim().length>0) ? oCustomActionCompleteButtoninPopupForCommentsMand.setEnabled(true) : oCustomActionCompleteButtoninPopupForCommentsMand.setEnabled(false);
				}
			}).setWidth('300px');
			this.oCustomActionToolPopupCommentsMand = new sap.ui.ux3.ToolPopup(this.getId() + '--' + 'customActionToolPopup-CommentsMand',{
																	inverted:false,
																	content : [ oCustomActionInputFieldinPopup],
																	buttons: [oCustomActionCompleteButtoninPopupForCommentsMand],
																	title: this._oBundle.getText('INBOX_ADD_COMMENT'),
																	autoClose: true
																});
		
		}
		//disable the Action button, everytime comments mandatory popup is opened
		oCustomActionCompleteButtoninPopupForCommentsMand.setEnabled(false);
		this._resetCustomActionToolPopupContent(oCustomActionInputFieldinPopup, oCustomActionCompleteButtoninPopupForCommentsMand, oCustomActionButton.data('text'), sCustomActionKey);
		this.oCustomActionToolPopupCommentsMand.setOpener(oCustomActionButton);
		if(!this.oCustomActionToolPopupCommentsMand.isOpen()){
			this.oCustomActionToolPopupCommentsMand.open(sap.ui.core.Popup.Dock.BeginTop, sap.ui.core.Popup.Dock.BeginBottom);
		}
	}
	
};

sap.uiext.inbox.Inbox.prototype._resetCustomActionToolPopupContent = function(oCustomActionInputFieldinPopup, oCustomActionCompleteButtoninPopup, sCustomActionText, sCustomActionKey) {
	//Remove the old text in the TextArea
	if(oCustomActionInputFieldinPopup){
		oCustomActionInputFieldinPopup.setValue('');
	}
	
	//Reset the button meta information
	var sCustomActionDisplayText = sCustomActionText || sCustomActionKey;
	oCustomActionCompleteButtoninPopup.setText(sCustomActionDisplayText);
	oCustomActionCompleteButtoninPopup.setTooltip(sCustomActionDisplayText);
	oCustomActionCompleteButtoninPopup.data('key',sCustomActionKey);
};

sap.uiext.inbox.Inbox.prototype._getAttachments = function(oAttachmentsToggleButton, iRowNumber){
	
	var that = this;
	var oContext = oAttachmentsToggleButton.getParent().getBindingContext();
	var sRequestURI = this._getAttachmentsUrl(oContext);
	var oModel = this.getCoreModel();

	var oRequestOptions = {
			async:true,
			requestUri : sRequestURI,
			method : "GET",
			headers : {
				Accept : that.constants.acceptHeaderforJSON,
				"x-csrf-token" : oModel.oHeaders["x-csrf-token"]
			}
	};

	OData.request(oRequestOptions, function(data, request) {
		var aAttachmentsData = data.results;
		that._displayAttachments(aAttachmentsData, iRowNumber, oContext);
	}, function(error) {
	that.showMessage("error", that._oBundle.getText("INBOX_MSG_FETCH_ATTACHMENTS_FAILS"));
	});
};

sap.uiext.inbox.Inbox.prototype._displayAttachments = function(aAttachmentsData, iRowNumber, oContext){
	var that = this;
	
	var sStatus = this.getModel().getProperty("Status", oContext);
	var bCompleted = (sStatus === "COMPLETED");
	var bUploadNotSupported = sap.ui.Device.browser.msie && sap.ui.Device.browser.version < 10;
	var bShowAddAttachmentTile = !(bCompleted || bUploadNotSupported);
	
	// display no attachments label in case for a completed task that does not have any attachment
	if (!bShowAddAttachmentTile && aAttachmentsData && aAttachmentsData.length < 1) {
		this._addActionContentinRowRepeater(iRowNumber, "attachments", this._createNoDataLabel(this._oBundle.getText("INBOX_MSG_FOR_NO_DATA")));
		
	} else {
		
		var oAttachmentsModel = new sap.ui.model.json.JSONModel(aAttachmentsData);
		var oAttachmentContainer = this._createAttachmentContainer(iRowNumber, oContext, bShowAddAttachmentTile);
		oAttachmentContainer.setModel(oAttachmentsModel);
		var oAttachmentTemplate = this._createAttachmentTileTemplate(bCompleted);
		oAttachmentContainer.bindAggregation("attachments",{path:"/",template: oAttachmentTemplate});
		
		var oAttachmentsOuterLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			width : "100%"
		});
		var oAttachmentsCellOuter = new sap.ui.commons.layout.MatrixLayoutCell();
		oAttachmentsCellOuter.addContent(oAttachmentContainer);
		oAttachmentsCellOuter.addStyleClass('sapUIExtInboxCommentsBorder');
		oAttachmentsOuterLayout.createRow(oAttachmentsCellOuter);
		this._addActionContentinRowRepeater(iRowNumber, "attachments", oAttachmentsOuterLayout);
	}
};

sap.uiext.inbox.Inbox.prototype._createAttachmentContainer = function(iRowNumber, oContext, bShowAddAttachmentTile){
	var that = this;
	var oModel = this.getCoreModel();
	var oAttachmentContainer = this._getComponent("attachmentContainer-"+iRowNumber);
	if(!oAttachmentContainer) {
		oAttachmentContainer = new sap.uiext.inbox.composite.InboxAttachmentsTileContainer(this.getId()+"--"+"attachmentContainer-"+iRowNumber, {
			showAddTile : bShowAddAttachmentTile,
			uploadUrl : that._getAttachmentsUrl(oContext),
			uploadButtonPress : function(oEvent) {
				that._addParametersBeforeUpload(oEvent);
				this.triggerUpload();
			},
			uploadSuccess : function(oEvent) {
					var oAttachmentModel = this.getModel();
					oAttachmentModel.oData.push(JSON.parse(oEvent.getParameter("attachmentResponse")).d);
					oAttachmentModel.checkUpdate(false);
					
					/*
					 * bTokenRefreshed is a boolean variable which is set to true if oDataModel's security token is refreshed.
					 * resetting the variable bTokenRefreshed if success handler is called after refreshing the security token.
					 */
					if (this.bTokenRefreshed)
						this.bTokenRefreshed = false;
					that.showMessage("success", that._oBundle.getText("INBOX_MSG_UPLOAD_ATTACHMENT_SUCCESS"));
			},
			uploadFailed : function(oEvent) {
				var statusCode = oEvent.getParameter("statusCode");
				/*
				 * if the failure occurs beacuse of csrf token invalidation, we need to refresh the oDataModel's security token and retrigger the request.
				 * If it has done, we need to maintain a variable which indicates that the oDataModel's security token had been refreshed.
				 */
				if (statusCode && statusCode == 403) {
					var sToken = oEvent.getParameter("securityToken");
					if (!this.bTokenRefreshed && sToken && sToken.toLowerCase() == "required") {
						that.getCoreModel().refreshSecurityToken();
						this.bTokenRefreshed = true;
						var oHeaderParameters = oEvent.getParameter("headerParameters");
						this.removeUploadHeader("x-csrf-token");
						this.addUploadHeader("x-csrf-token", oModel.oHeaders["x-csrf-token"]);
						this.triggerUpload();
					} else {
						this.bTokenRefreshed = false;
						that.showMessage("error", that._oBundle.getText("INBOX_MSG_UPLOAD_ATTACHMENT_FAILURE"));
					}
				} else {
					this.bTokenRefreshed = false;
					that.showMessage("error", that._oBundle.getText("INBOX_MSG_UPLOAD_ATTACHMENT_FAILURE"));
				}
			}
		});
	}
	return oAttachmentContainer;
};

sap.uiext.inbox.Inbox.prototype._createAttachmentTileTemplate = function(bCompleted){
	var that = this;
	var oTemplate = new sap.uiext.inbox.composite.InboxAttachmentTile({
		fileName: "{FileName}",
		createdBy: {
			parts : [
			         	{path:"CreatedByName"},
			         	{path:"CreatedBy"}
			         ],
			formatter : function(sFullName, sUniqueName) {
				if (sFullName &&  sFullName !== "")
					return sFullName;
				else if (sUniqueName && sUniqueName !== "")
					return sUniqueName;
			}
		},
		fileDescription: "{FileDisplayName}",
		creationDate : {
			path : "CreatedAt",
			formatter : function (sDate) {
				return that.inboxUtils.dateTimeFormat(sDate, true);
			}
		},
		fileTypeIcon : {
			path : "mime_type",
			formatter : that.inboxUtils._getFileTypeIcon
		},
		fileSize : {
			path : "FileSize",
			formatter : that.inboxUtils._getFileSize
		},
		downloadUrl : {
			parts : [
						{path:"InstanceID"},
						{path:"SAP__Origin"},
						{path:"ID"}
					],
			formatter : function(sTaskInstanceID,sSapOriginID, sAttachmentID) {
				return (that.bpmSvcUrl + that._getAttachmentValueUrl(sTaskInstanceID,sSapOriginID, sAttachmentID));
			}
		},
		showDeleteButton : !bCompleted
		
	}).attachDeleteAttachment(this, this._deleteAttachment);
	
	return oTemplate;
};

sap.uiext.inbox.Inbox.prototype._addParametersBeforeUpload = function(oEvent){
	var oAttachmentContainer = oEvent.getSource();
	var that = this;
	
	if (oAttachmentContainer.getIsFileSelected()) {
		var oModel = this.getCoreModel();
		
		/*var sDescription = oAttachmentContainer.getEnteredDescription();
		var sSlug = "FileName='" + oAttachmentContainer.getFileName() + "', FileDisplayName='" + sDescription + "'";*/
		oAttachmentContainer.addUploadHeader("slug", oAttachmentContainer.getFileName());
		oAttachmentContainer.addUploadHeader("Content-Type", oAttachmentContainer.getFileType());
		oAttachmentContainer.addUploadHeader("Accept",  this.constants.acceptHeaderforJSON);
		oAttachmentContainer.addUploadHeader("x-csrf-token", oModel.oHeaders["x-csrf-token"]);
	}
};

sap.uiext.inbox.Inbox.prototype._deleteAttachment = function(oEvent, oInbox){
	var that = this;
	var oAttachmentModel = this.getModel();
	var oContext = this.getBindingContext();
	var oTaskCollectionTCMMetadata = oInbox.constants.TaskCollection;
	var sTaskInstanceID = oAttachmentModel.getProperty("InstanceID", oContext); 
	var sSapOriginID = oAttachmentModel.getProperty("SAP__Origin", oContext);
	var sAttachmentID = oAttachmentModel.getProperty("ID", oContext);
	
	var sRequestURI = oInbox._getAttachmentValueUrl(sTaskInstanceID, sSapOriginID, sAttachmentID);
	var oModel = oInbox.getCoreModel();
	
	oInbox.oDataManager.removeData(oInbox._getAttachmentValueUrl(sTaskInstanceID, sSapOriginID, sAttachmentID), {
		success : function(data, request) {
			var aParts = oContext.getPath().split("/");
			oAttachmentModel.oData.splice(aParts[1], 1);
			oAttachmentModel.checkUpdate(false);
			oInbox.showMessage("success", oInbox._oBundle.getText("INBOX_MSG_DELETE_ATTACHMENT_SUCCESS"));
		},
		error : function(error) {
			oInbox.showMessage("error", oInbox._oBundle.getText("INBOX_MSG_DELETE_ATTACHMENT_FAILURE"));
		}
	}, true);

};

sap.uiext.inbox.Inbox.prototype._getAttachmentsUrl = function(oContext) {
	var constants = this.constants;
	var oTaskCollectionTCMMetadata = constants.TaskCollection;
	var oModel = this.getModel();
	var sTaskInstanceID = oModel.getProperty("InstanceID",oContext); 
	var sSapOriginID = oModel.getProperty("SAP__Origin",oContext);
	var sAttachmentsUrl = this.bpmSvcUrl
		+ constants.forwardSlash 
			+ oTaskCollectionTCMMetadata.entityName 
				+ "(" 
					+ oTaskCollectionTCMMetadata.properties.instanceID
						+ "='"
							+ sTaskInstanceID + 
								"',"
									+ constants.sapOrigin 
										+ "='" 
											+ sSapOriginID 
												+ "')" 
													+ constants.forwardSlash
														+ constants.attachmentCollection.navParam.attachment;

	return sAttachmentsUrl;
};

sap.uiext.inbox.Inbox.prototype._getAttachmentValueUrl = function(sTaskInstanceID, sSapOriginID, sAttachmentID) {
	
	var constants = this.constants;
	var oTaskCollectionTCMMetadata = constants.TaskCollection;
	var oAttachmentConstants = constants.attachmentCollection;
	
	var sAttachmentValueUrl = constants.forwardSlash 
			+ oAttachmentConstants.entityName 
				+ "(" 
					+ oTaskCollectionTCMMetadata.properties.instanceID
						+ "='"
							+ sTaskInstanceID + 
								"',"
									+ constants.sapOrigin 
										+ "='" 
											+ sSapOriginID + 
												"',"
													+ oAttachmentConstants.properties.id 
														+ "='" 
															+ sAttachmentID 
																+ "')" 
																	+ constants.forwardSlash
																		+ oAttachmentConstants.navParam.value;

	return sAttachmentValueUrl;
};

sap.uiext.inbox.Inbox.prototype._initODataModel = function(){
	var that = this;
	this.oModel.refreshSecurityToken(null, null, true);
	this.oModel.attachMetadataLoaded(function(oEvent){
		var oServiceMetadata = this.getServiceMetadata()
    	if(this.sServiceUrl && oServiceMetadata){
    		that.oTcmMetadata.setServiceMetadata(oServiceMetadata);
    	}
		that._bindTaskActions();
	});
	//store the Service URL if the model is oData
	if(this.getHandleBindings()){
		this.bpmSvcUrl = this.oModel.sServiceUrl;
	}
};

sap.uiext.inbox.Inbox.prototype._getBindingParameters = function(){
	var oParameters = {};
	var oExpandParameters = this._getExpandParameters();
	
	if (this.typeOfModel === "OData") {
		oParameters.countMode = sap.ui.model.odata.CountMode.InlineRepeat;
		oParameters.faultTolerant = true;
		
	}
	
	if(oExpandParameters.length > 0 ){
		oParameters.expand = oExpandParameters;
	}
	
	return oParameters;
};
