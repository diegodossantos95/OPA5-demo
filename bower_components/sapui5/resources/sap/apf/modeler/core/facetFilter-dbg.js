/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.declare("sap.apf.modeler.core.facetFilter");
(function() {
	'use strict';
	/**
	 * @private
	 * @name sap.apf.modeler.core.FacetFilter
	 * @class A facet filter proxy object providing editor methods on configuration objects.
	 * @param {String} facetFilterId - unique Id within configuration.
	 * @param {Object} inject - Injection of required APF object references, constructors and functions.
	 * @param {sap.apf.core.utils.MessageHandler} inject.instances.messageHandler - MessageHandler instance
	 * @param {Object} inject.constructor - Injected constructors
	 * @param {sap.apf.core.utils.Hashtable} inject.constructors.Hashtable - Hashtable constructor
	 * @param {Object} dataFromCopy - Optional parameter to set the internal state of the new instance during a copy operation 
	 * @constructor
	 */
	sap.apf.modeler.core.FacetFilter = function(facetFilterId, inject, dataFromCopy) {
		var request, selectPropertyForValueHelp, selectPropertyForFilterResolution, metadata, label, preselectionDefaults, valueList, property, alias, labelKey, preselectionFunction, hasAutomaticSelection, isMultiSelectionActive, invisible, useSameRequestForValueHelpAndFilterResolution, hasNoneSelection = true;
		if (!dataFromCopy) {
			request = {
				forValueHelp : {
					service : undefined,
					entitySet : undefined
				},
				forFilterResolution : {
					service : undefined,
					entitySet : undefined
				}
			};
			selectPropertyForValueHelp = new inject.constructors.ElementContainer("SelectPropertyValueHelp", undefined, inject);
			selectPropertyForFilterResolution = new inject.constructors.ElementContainer("SelectPropertyFilterResolution", undefined, inject);
			metadata = {};
			label = {};
			preselectionDefaults = [];
			isMultiSelectionActive = false;
			useSameRequestForValueHelpAndFilterResolution = false;
		} else {
			request = dataFromCopy.request;
			selectPropertyForValueHelp = dataFromCopy.selectPropertyForValueHelp;
			selectPropertyForFilterResolution = dataFromCopy.selectPropertyForFilterResolution;
			metadata = dataFromCopy.metadata;
			label = dataFromCopy.label;
			preselectionFunction = dataFromCopy.preselectionFunction;
			preselectionDefaults = dataFromCopy.preselectionDefaults;
			valueList = dataFromCopy.valueList;
			property = dataFromCopy.property;
			alias = dataFromCopy.alias;
			labelKey = dataFromCopy.labelKey;
			invisible = dataFromCopy.invisible;
			isMultiSelectionActive = dataFromCopy.isMultiSelectionActive;
			hasAutomaticSelection = dataFromCopy.hasAutomaticSelection;
			useSameRequestForValueHelpAndFilterResolution = dataFromCopy.useSameRequestForValueHelpAndFilterResolution;
			hasNoneSelection = dataFromCopy.hasNoneSelection;
		}
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getId
		 * @function
		 * @description The immutable id of the facet filter
		 * @returns {String} id
		 */
		this.getId = function() {
			return facetFilterId;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setMultiSelection
		 * @function
		 * @description Set property multiselection
		 * @param {boolean} bool isMultiSelectionActive
		 */
		this.setMultiSelection = function(bool) {
			isMultiSelectionActive = bool;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#isMultiSelection
		 * @function
		 * @description Get property multi selection
		 * @returns {boolean} isMultiSelectionActive
		 */
		this.isMultiSelection = function() {
			return isMultiSelectionActive;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setInvisible
		 * @function
		 * @description Property will hidden from facet filter during runtime
		 */
		this.setInvisible = function() {
			invisible = true;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setVisible
		 * @function
		 * @description Property will be displayed in facet filter during runtime
		 */
		this.setVisible = function() {
		    invisible = undefined;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#isVisible
		 * @function
		 * @description Returns current visibility state
		 * @returns {boolean} true: Facet filter property to be displayed during runtime | false: Facet filter property hidden in runtime
		 */
		this.isVisible = function() {
		    return !invisible;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setAlias
		 * @function
		 * @description Sets alias to facet filter
		 * @param {string} aliasString
		 */
		this.setAlias = function(aliasString) {
			alias = aliasString;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getAlias
		 * @function
		 * @returns {String} alias
		 */
		this.getAlias = function() {
			return alias;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setNoneSelection
		 * @function
		 * @description Sets Indicator, that there will be no default selection.
		 * @param {boolean}
		 */
		this.setNoneSelection = function(value) {
			hasNoneSelection = value;
			if(hasNoneSelection){
				hasAutomaticSelection = false;
				this.removePreselectionDefaults();
				this.removePreselectionFunction();
			}
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getAutomaticSelection
		 * @function
		 * @description gets Indicator, that there will be no default selection.
		 */
		this.getNoneSelection = function() {
			return hasNoneSelection;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setAutomaticSelection
		 * @function
		 * @description Sets Indicator, that there will be a auto selection.
		 * This means, that for single selection the first value will be selected in the facet filter at run time or all values will be selected for multiple selection
		 * @param {boolean} value
		 */
		this.setAutomaticSelection = function(value) {
			inject.instances.messageHandler.check(typeof value === "boolean", "facetFilter wrong input for setAutomaticSelection");
			hasAutomaticSelection = value;
			if (hasAutomaticSelection) {
				hasNoneSelection = false;
				this.removePreselectionFunction();
				this.removePreselectionDefaults();
			}
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getAutomaticSelection
		 * @function
		 * @description gets Indicator, that there will be a auto selection.
		 */
		this.getAutomaticSelection = function() {
			return hasAutomaticSelection;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setPreselectionFunction
		 * @function
		 * @description Sets preselectionFunction to facet filter
		 * @param {string} value preselectionFunction
		 */
		this.setPreselectionFunction = function(value) {
			preselectionFunction = value;
			hasAutomaticSelection = false;
			hasNoneSelection = false;
			this.removePreselectionDefaults();
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getPreselectionFunction
		 * @function
		 * @returns {String} preselectionFunction
		 */
		this.getPreselectionFunction = function() {
			return preselectionFunction;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#removePreselectionFunction
		 * @description Removes preselectionFunction from facet filter
		 * @function
		 */
		this.removePreselectionFunction = function() {
			preselectionFunction = undefined;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setPreselectionDefaults
		 * @function
		 * @description Sets preselectionDefaults to facet filter
		 * @param {String[]} array preselectionDefaults
		 */
		this.setPreselectionDefaults = function(array) {
			preselectionDefaults = array;
			hasAutomaticSelection = false;
			hasNoneSelection = false;
			this.removePreselectionFunction();
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getPreselectionDefaults
		 * @function
		 * @returns {String[]} preselectionDefaults
		 */
		this.getPreselectionDefaults = function() {
			return preselectionDefaults;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#removePreselectionDefaults
		 * @description Removes preselectionDefaults from facet filter
		 * @function
		 */
		this.removePreselectionDefaults = function() {
			preselectionDefaults = [];
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setValueList
		 * @function
		 * @description Sets list of manually configured values for value list.
		 * In order to remove any manually configured values, this method has to be called with an empty array. 
		 * @param {String[]} list Flat array of string values to be set
		 */
		this.setValueList = function(list) {
			var isArray = jQuery.isArray(list); 
			if(isArray && list.length > 0 && listContainsOnlyStrings(list)) {
				valueList = jQuery.extend([], list);
			} else if(isArray && list.length == 0) {
				valueList = undefined;
			}
			function listContainsOnlyStrings(array) {
				for(var i = 0, len = array.length; i < len; i++) {
					if(typeof array[i] != 'string') {
						return false;
					}
				}
				return true;
			}
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getValueList
		 * @description Returns list of manually configured values for value help list 
		 * @function
		 * @returns {String[]} listValues
		 */
		this.getValueList = function() {
			if(!valueList) {
				return [];
			}
			return jQuery.extend([], valueList);
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setLabelKey
		 * @function
		 * @description Sets labelKey to facet filter
		 * @param {string} labelKey_
		 */
		this.setLabelKey = function(labelKey_) {
			labelKey = labelKey_;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getLabelKey
		 * @function
		 * @returns {String} labelKey
		 */
		this.getLabelKey = function() {
			return labelKey;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setProperty
		 * @function
		 * @description Sets property to facet filter
		 * @param {string} prop property
		 */
		this.setProperty = function(prop) {
			property = prop;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getProperty
		 * @function
		 * @returns {String} property
		 */
		this.getProperty = function() {
			return property;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setUseSameRequestForValueHelpAndFilterResolution
		 * @function
		 * @description Set Indicator, whether value help and filter resolution request should use the same request
		 * @param {boolean} OnOff
		 */
		this.setUseSameRequestForValueHelpAndFilterResolution = function(OnOff) {
			var that = this;
			if (OnOff) {
				var service = this.getServiceOfValueHelp();
				this.setServiceOfFilterResolution(service);
				var entitySet = this.getEntitySetOfValueHelp();
				this.setEntitySetOfFilterResolution(entitySet);
				var selectProperties = this.getSelectPropertiesOfFilterResolution();
				selectProperties.forEach(function(property) {
					that.removeSelectPropertyOfFilterResolution(property);
				});
				selectProperties = this.getSelectPropertiesOfValueHelp();
				selectProperties.forEach(function(property) {
					that.addSelectPropertyOfFilterResolution(property);
				});
			}
			useSameRequestForValueHelpAndFilterResolution = OnOff;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getUseSameRequestForValueHelpAndFilterResolution
		 * @function
		 * @description get Indicator, whether value help and filter resolution request should use the same request
		 */
		this.getUseSameRequestForValueHelpAndFilterResolution = function() {
			return useSameRequestForValueHelpAndFilterResolution;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setServiceOfValueHelp
		 * @function
		 * @description Set service of request for value help
		 * @param {string} servicePath
		 */
		this.setServiceOfValueHelp = function(servicePath) {
			request.forValueHelp.service = servicePath;
			if (useSameRequestForValueHelpAndFilterResolution) {
				request.forFilterResolution.service = servicePath;
			}
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getServiceOfValueHelp
		 * @function
		 * @description Returns service of value help
		 * @returns {String} serviceForValueHelp
		 */
		this.getServiceOfValueHelp = function() {
			return request.forValueHelp.service;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setEntitySetOfValueHelp
		 * @function
		 * @description Set entity set to request for value help
		 * @param {String} entitySetName
		 */
		this.setEntitySetOfValueHelp = function(entitySetName) {
			request.forValueHelp.entitySet = entitySetName;
			if (useSameRequestForValueHelpAndFilterResolution) {
				request.forFilterResolution.entitySet = entitySetName;
			}
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getEntitySetOfValueHelp
		 * @function
		 * @description Returns entity set of value help
		 * @returns {String} entityForValueHelp
		 */
		this.getEntitySetOfValueHelp = function() {
			return request.forValueHelp.entitySet;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getSelectPropertiesOfValueHelp
		 * @function
		 * @description Returns select properties of value help request
		 * @returns {String[]} selectProperties
		 */
		this.getSelectPropertiesOfValueHelp = function() {
			var selectProperties = [];
			var elementList;
			elementList = selectPropertyForValueHelp.getElements();
			elementList.forEach(function(element) {
				selectProperties.push(element.getId());
			});
			return selectProperties;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#removeSelectPropertyOfValueHelp
		 * @function
		 * @description Removes select property from request for value help
		 * @param {String} selectProperty
		 */
		this.removeSelectPropertyOfValueHelp = function(selectProperty) {
			selectPropertyForValueHelp.removeElement(selectProperty);
			if (useSameRequestForValueHelpAndFilterResolution) {
				selectPropertyForFilterResolution.removeElement(selectProperty);
			}
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#addSelectPropertyOfValueHelp
		 * @function
		 * @description Add select property to request for value help
		 * @param {String} selectProperty
		 */
		this.addSelectPropertyOfValueHelp = function(selectProperty) {
			selectPropertyForValueHelp.createElementWithProposedId(undefined, selectProperty);
			if (useSameRequestForValueHelpAndFilterResolution) {
				selectPropertyForFilterResolution.createElementWithProposedId(undefined, selectProperty);
			}
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setServiceOfFilterResolution
		 * @function
		 * @description Set service of request for filter resolution
		 * @param {String} servicePath
		 */
		this.setServiceOfFilterResolution = function(servicePath) {
			if (useSameRequestForValueHelpAndFilterResolution) {
				return;
			}
			request.forFilterResolution.service = servicePath;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getServiceOfFilterResolution
		 * @function
		 * @description Returns service of filter resolution
		 * @returns {String} serviceOfFilterResolution
		 */
		this.getServiceOfFilterResolution = function() {
			return request.forFilterResolution.service;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#setEntitySetOfFilterResolution
		 * @function
		 * @description Set entity set to request for filter resolution
		 * @param {String} entitySetName
		 */
		this.setEntitySetOfFilterResolution = function(entitySetName) {
			if (useSameRequestForValueHelpAndFilterResolution) {
				return;
			}
			request.forFilterResolution.entitySet = entitySetName;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getEntitySetOfFilterResolution
		 * @function
		 * @description Returns entity set of filter resolution
		 * @returns {String} entitySetOfFilterResolution
		 */
		this.getEntitySetOfFilterResolution = function() {
			return request.forFilterResolution.entitySet;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#getSelectPropertiesOfFilterResolution
		 * @function
		 * @description Returns select properties of filter resolution
		 * @returns {String[]} selectProperties
		 */
		this.getSelectPropertiesOfFilterResolution = function() {
			var selectProperties = [];
			var elementList;
			elementList = selectPropertyForFilterResolution.getElements();
			elementList.forEach(function(element) {
				selectProperties.push(element.getId());
			});
			return selectProperties;
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#removeSelectPropertyOfFilterResolution
		 * @function
		 * @description Removes select property from request for filter resolution
		 * @param {String} selectProperty
		 */
		this.removeSelectPropertyOfFilterResolution = function(selectProperty) {
			if (useSameRequestForValueHelpAndFilterResolution) {
				return;
			}
			selectPropertyForFilterResolution.removeElement(selectProperty);
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#addSelectPropertyOfFilterResolution
		 * @function
		 * @description Add select property to request for filter resolution
		 * @param {String} selectProperty
		 */
		this.addSelectPropertyOfFilterResolution = function(selectProperty) {
			if (useSameRequestForValueHelpAndFilterResolution) {
				return;
			}
			selectPropertyForFilterResolution.createElementWithProposedId(undefined, selectProperty);
		};
		/**
		 * @private
		 * @name sap.apf.modeler.core.FacetFilter#copy
		 * @function
		 * @description Execute a deep copy of the facet filter and its referenced objects
		 * @param {String} newIdForCopy - New Id for the copied instance
		 * @returns {Object} sap.apf.modeler.core.FacetFilter# - New facet filter object being a copy of this object
		 */
		this.copy = function(newIdForCopy) {
			var dataForCopy = {
				request : request,
				selectPropertyForValueHelp : selectPropertyForValueHelp,
				selectPropertyForFilterResolution : selectPropertyForFilterResolution,
				metadata : metadata,
				label : label,
				preselectionFunction : preselectionFunction,
				preselectionDefaults : preselectionDefaults,
				valueList : valueList,
				property : property,
				alias : alias,
				labelKey : labelKey,
				invisible : invisible, 
				isMultiSelectionActive : isMultiSelectionActive,
				hasAutomaticSelection : hasAutomaticSelection,
				hasNoneSelection : hasNoneSelection
			};
			var dataFromCopy = sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(dataForCopy);
			return new sap.apf.modeler.core.FacetFilter((newIdForCopy || this.getId()), inject, dataFromCopy);
		};
	};
}());