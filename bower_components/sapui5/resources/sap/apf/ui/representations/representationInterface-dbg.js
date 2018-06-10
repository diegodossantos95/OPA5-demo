/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.representations.representationInterface');
(function() {
	'use strict';
	/**
	 * @public
	 * @experimental The complete interface is subject to ongoing work and not yet stable (as of Version 1.24.0).
	 * @class The interface proxy passed to a representation which provides access to required APF methods. This constructor is used by apf.api.
	 * It can be also used to build unit tests that need an interface proxy between APF and representations.
	 * @name sap.apf.ui.representations.RepresentationInterfaceProxy
	 * @param {sap.apf.core.Instance} oCoreApi
	 * @param {sap.apf.ui.Instance} oUiApi
	 */
	sap.apf.ui.representations.RepresentationInterfaceProxy = function(oCoreApi, oUiApi) {
		this.type = 'RepresentationInterfaceProxy';
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#putMessage
		 * @description see {@link sap.apf.Api#putMessage}
		 */
		this.putMessage = function(oMessage) {
			return oCoreApi.putMessage(oMessage);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#createMessageObject
		 * @description see {@link sap.apf.Api#createMessageObject}
		 */
		this.createMessageObject = function(oConfig) {
			return oCoreApi.createMessageObject(oConfig);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#getActiveStep
		 * @description see {@link sap.apf.Api#getActiveStep}
		 */
		this.getActiveStep = function() {
			return oCoreApi.getActiveStep();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#setActiveStep
		 * @description see {@link sap.apf.Api#setActiveStep}
		 */
		this.setActiveStep = function(oStep) {
			return oCoreApi.setActiveStep(oStep);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#getTextNotHtmlEncoded
		 * @description see {@link sap.apf.Api#getTextNotHtmlEncoded}
		 */
		this.getTextNotHtmlEncoded = function(oLabel, aParameters) {
			return oCoreApi.getTextNotHtmlEncoded(oLabel, aParameters);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#getExits
		 * @description get exits registered on oInject
		 */
		this.getExits = function() {
			return oUiApi.getCustomFormatExit();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1. Instead use the method {@link sap.apf.ui.representations.RepresentationInterfaceProxy#selectionChanged}.
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#updatePath
		 * @description see {@link sap.apf.Api#updatePath}
		 */
		this.updatePath = function(fnStepProcessedCallback) {
			return oCoreApi.updatePath(fnStepProcessedCallback); //planned change in Wave 7 to call update on uiApi so that UI gets notified on changes.- fixme 
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#createFilter
		 * @description see {@link sap.apf.Api#createFilter}
		 */
		this.createFilter = function() {
			return oCoreApi.createFilter();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#selectionChanged
		 * @description see {@link sap.apf.Api#selectionChanged}
		 */
		this.selectionChanged = function(bRefreshAllSteps) {
			return oUiApi.selectionChanged(bRefreshAllSteps);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#getEventCallback
		 * @description see {@link sap.apf.Api#getEventCallback}
		 */
		this.getEventCallback = function(sEventType) { //to be removed in Wave 7, part of formatter, not representation!-fixme 
			return oUiApi.getEventCallback(sEventType);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#getUiApi
		 * @description returns the oUiAPi
		 */
		this.getUiApi = function() {
			return oUiApi;
		};
	}; // InterfaceProxy
	/**
	 * @public
	 * @experimental The complete interface is subject to ongoing work and not yet stable (as of Version 1.24.0).
	 * @class This is not a runtime class, but it describes the interface that a representation (chart) has to implement for to interact with the APF.
	 * @name sap.apf.ui.representations.representationInterface
	 * @param {sap.apf.ui.representations.RepresentationInterfaceProxy} dependencies - specific interface proxy for communication between the representation and APF.<br>
	 * @param {object} configuration - Configuration object that allows to define representation specific configuration values.<br>
	 * Fixed interface property names:
	 * <ul><li><b>alternateRepresentationTypeId</b>: A reference to a representation type in analytical configuration
	 * <li><b>alternateRepresentationType</b>: A property dynamically added to the parameter object by APF core based on reference in alternateRepresentationTypeId and containing
	 * configuration values of the representation type ID referenced by alternateRepresentationTypeId.
	 * </ul>
	 */
	sap.apf.ui.representations.representationInterface = function(dependencies, configuration) {
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#setData
		 * @description The binding sets the data (received from the request) that has to be visualized. The array aDataResponse is shared between all representations
		 * of a step and the binding. When lines are moved, deleted or changed, you modify the visualization of the original data! When displaying the data, one can determine which record
		 * is selected by aSelectedIndices.
		 * @param {sap.apf.core.Metadata} oMetadata oMetadata holds meta information about the received data.
		 * @param {array} aDataResponse Data response from the request.
		 */
		this.setData = function(oMetadata, aDataResponse) {
			// remember aDataResponse and transform it, so that the chart can display the data
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#updateTreetable
		 * @description Called during path update for treetable representation. As treetable has its own data model, the request handling is done on representation side. 
		 * @param {object} controlObject Contains filters and parameters for treetable request handling
		 * @param {sap.ui.model.odata.v2} oModel OData model for the service of treetable
		 * @param {function} callbackAfterRequest Function to be called after request processing
		 * @param {sap.apf.core.EntityTypeMetadata} entityTypeMetadata Convenience functions for metadata handling
		 */
		this.updateTreetable = function(controlObject, oModel, callbackAfterRequest, entityTypeMetadata) {
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#getSelectionAsArray
		 * @description This is the basic method with which the step can detect data selected in the chart.
		 * @returns {number[]} An array with indices is returned.<br>E.g. if the first and the third line of the array aDataResponse have been selected,
		 * then aIndices = [0, 2]. Counting of indices start from 0.
		 * If all data has been selected, and aDataResponse.length == 4, then the array [0,1,2,3] is returned. In general [ 0 .. aDataResponse.length - 1]
		 * If no data has been selected at all, then [] is returned.
		 * In case of an empty selection, the value undefined has to be returned. An empty selection may occur, when selections in the previous step has been changed,
		 * so that the visual selection on the chart is now empty (empty rectangle).
		 */
		this.getSelectionAsArray = function() {
			return [ 0, 2 ]; // just an example. Here data points/series, that correspond to  aDataResponse[0] and aDataResponse[2] have been selected
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#adoptSelection
		 * @description Called on representation by binding when a representation type is set.
		 * Intention is to trigger transfer of selections that might exist on a representation (source) that is replaced by the "new" representation (target) to be set.
		 * Therefore the target representation receives a reference pointing to the source representation.
		 * In order to check whether selection transfer is possible the target representation initiates a negotiation process with the source representations (3-way-handshake).
		 * If a common method can be determined between target and source representation the selection will be exchanged.
		 * @param {object} oSourceRepresentation Source representation implementing the representationInterface.
		 */
		this.adoptSelection = function(oSourceRepresentation) {
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#getFilterMethodType
		 * @description This method has to be implemented so that binding can determine which method has to be used for the filter retrieval from a representations.
		 * @returns {sap.apf.constants.filterMethodTypes} The filter method type the representation supports
		 */
		this.getFilterMethodType = function() {
			return sap.apf.constants.filterMethodTypes.selectionAsArray; // returns the filter method type the representation supports
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#getRequestOptions
		 * @description Additionally to parameters being set in the request configuration and filter values that are derived from the path logic,
		 * a request can be enriched with additional options such as <b>$top</b>, <b>$skip</b> and <b>$orderby</b>.<p>
		 * Dependent on the actual options a representation may require for a request, an object containing the correspondent properties may be returned by this method.
		 * <br>In case no additional options are required an empty object should be returned.<p>
		 *
		 * The supported optional properties of the return object are:
		 * <ul><li><b>paging</b>: An object containing optional properties<ul><li><b>top</b> for OData system query option $top <br>A numeric value is expected<li><b>skip</b> for query string option $skip<br> A numeric value is expected
		 * <li><b>inlineCount</b> for OData system query option $inlineCount<br>A boolean value 'true' is expected if inline count is requested</ul>
		 * <li><b>orderby</b> for OData system query option $orderby: Values could be of type<ul>
		 *    <li><b>string</b> that holds a property name (in this case the default sort order 'ascending' is applied)
		 *  <li><b>object</b> with properties:<ul>
		 *    <li>'property' A string containing the property name is expected.
		 *    <li>'descending' A boolean value 'true' is expected, if descending sort order is required for the property. If omitted default sort order 'ascending' is applied.
		 *  </ul>
		 *  <li><b>array</b> holding objects with properties 'property' and 'descending' as described above.</ul>
		 * @returns {object}
		 *Example:
		 *<pre class="javascript">
		 *{ paging : {
		*		top : 10,
		*		skip : 30,
		*		inlineCount : true
		*  },
		*  orderby : [ 
		*		{ property : "nameProperty1",
		*		}, {
		*		property : "nameProperty2",
		*		descending : true
		*		}
		*  ]
		*}
		 *</pre>
		 * See also <a href="http://www.odata.org/documentation/odata-version-2-0/uri-conventions/">http://www.odata.org/documentation/odata-version-2-0/uri-conventions/</a>
		 */
		this.getRequestOptions = function() {
			return {}; // Default
			// return { paging : { top : 10, skip : 30, inlineCount : true }, orderby : [ { property : "propertyName", descending : true }] };
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#getParameter
		 * @description The method returns the constructor arguments which will be used to create toggle representation.
		 * @returns {object} oParameters
		 */
		this.getParameter = function() {
			var oParameters = {
				dimensions : [],
				measures : []
			};
			return oParameters;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#getMainContent
		 * @description This method holds the logic to draw the content to be shown on main representation area.
		 * @returns {object} oUiObject The UI object that has to be shown in main representation area. Example: Line chart instance for a line chart representation.
		 */
		this.getMainContent = function() {
			var oUiObject = {};
			return oUiObject;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#getThumbnailContent
		 * @description This method holds the logic to draw the content to be shown on thumbnail area.
		 * @returns {object} oUiObject The UI object that has to be shown in thumbnail area. Example: Line chart instance for a line chart representation.
		 */
		this.getThumbnailContent = function() {
			var oUiObject = {};
			return oUiObject;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#getPrintContent
		 * @description This method holds the logic to draw the content to be printed.
		 * @returns {object} oUiObject The UI object that has to be printed. Example: Line chart instance for a line chart representation.
		 */
		this.getPrintContent = function() {
			var oUiObject = {};
			return oUiObject;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#getTooltipContent
		 * @description This method holds the logic to draw the content to be shown as tooltip for a thumbnail.
		 * It will be shown inside a tooltip Popup when the thumbnail content overflows the thumbnail container area with a gradient effect to indicate that it is overflowing.
		 * @returns {object} oUiObject The UI object that has to be shown as tooltip for a thumbnail. Example: Detailed content of a form representation.
		 */
		this.getTooltipContent = function() {
			var oUiObject = {};
			return oUiObject;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#removeAllSelection
		 * @description This method holds the logic to remove all selection from the chart. It also updates the step.
		 */
		this.removeAllSelection = function() {
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#serialize
		 * @description This method returns the selection for serialization. This is required for the Persisting selection of current representation.
		 * It includes selection mode and selections.
		 * @returns {object} oSerializationInformation
		 */
		this.serialize = function() {
			var oSerializationInformation = {};
			return oSerializationInformation;
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#deserialize
		 * @description This method uses the serialization information from serialized data and sets the selection to representation based on mode and selection string returned.
		 * @param {object} oSerializationInformation
		 */
		this.deserialize = function(oSerializationInformation) {
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#getAlternateRepresentation
		 * @description Returns the alternate representation of current step (i.e. list representation for the charts)
		 * @returns {object} oAlternateRepresentation
		 */
		this.getAlternateRepresentation = function() {
			return this.oAlternateRepresentation; //undefined-fixme
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#getMetaData
		 * @description Returns meta data for representation type
		 * @returns {sap.apf.core.EntityTypeMetadata} metadata
		 */
		this.getMetaData = function() {
			return this.metadata; //undefined-fixme
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.representationInterface#getData
		 * @description Returns data for representation type
		 * @returns {array} aDataResponse
		 */
		this.getData = function() {
			return this.aDataResponse; //undefined-fixme
		};
	};
}());
