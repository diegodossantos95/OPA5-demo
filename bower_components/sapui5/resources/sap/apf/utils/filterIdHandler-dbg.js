/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.utils.filterIdHandler');
/**
 * @private
 * @class Filter ID handler
 * @description Provides methods that allow to manage application specific
 *              filter restrictions for each path update.
 * @param {object}
 *            inject Object containing functions and instances to be used by filter id handler
 * @param {sap.apf.core.MessageHandler} inject.instance.messageHandler Message handler instance
 * @param {function} inject.functions.setRestrictionByProperty {@link sap.apf.utils.StartFilterHandler#setRestrictionByProperty}
 * @param {function} inject.functions.getRestrictionByProperty {@link sap.apf.utils.StartFilterHandler#getRestrictionByProperty}
 * @name sap.apf.utils.FilterIdHandler 
 * @returns {sap.apf.utils.FilterIdHandler}
 */
(function() {
	'use strict';
	sap.apf.utils.FilterIdHandler = function(inject) {
		var msgHandler = inject.instances.messageHandler;
		var uniqueConsumerId = 1;
		var internallyGeneratedIds = [];
		var filterIdToProperty = {};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterIdHandler#add
		 * @description Adds an application specific filter ID and maps it to the property used in the filter.
		 *              Creates a unique fragment and a corresponding identifier.
		 *              Subsequent changes need to be done by the update method
		 *              providing the identifier.
		 *              Limitation: only a single filter equality term or a disjunction of single equality terms over a single property is supported. 
		 * @param {sap.apf.utils.Filter} filter Filter instance
		 * @returns {number} Unique numeric ID to be provided for later updates
		 *          of the same fragment. Consecutive numbers for the different
		 *          unique IDs are not guaranteed.
		 */
		this.add = function(filter) {
			if(!isAcceptedFilter(filter)){
				msgHandler.putMessage(msgHandler.createMessageObject({
					code : '5301'
				}));
			}

			filterIdToProperty[uniqueConsumerId] = getPropertyNameOfFirstFilterTerm(filter);
			internallyGeneratedIds.push(uniqueConsumerId);
			inject.functions.setRestrictionByProperty(filter);
			return uniqueConsumerId++;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterIdHandler#update
		 * @description Updates a context fragment for the given identifier by
		 *              fully replacing the existing one.
		 *              Limitation: only a single filter equality term or a disjunction of single equality terms over a single property is supported. 
		 * @param {number|}
		 *            id Either requires numeric identifier of the context
		 *            fragment that was returned by add method or requires an
		 *            external identifier of type string that has to be
		 *            determined by the consumer. When using identifiers of type
		 *            string the add method must not be used. Update is
		 *            sufficient. It either overwrites an existing context
		 *            fragment for the identifier or creates a new one.
		 * @param {sap.apf.utils.Filter} filter Filter instance
		 */
		this.update = function(id, filter) {
			if (typeof id === 'number') {
				if (id <= 0 || id >= uniqueConsumerId) {
					msgHandler.putMessage(msgHandler.createMessageObject({
						code : '5100',
						aParameters: ['Passed invalid numeric identifier during update of path filter']
					}));
					return;
				}
			} else if (!id || typeof id !== 'string') {
				msgHandler.putMessage(msgHandler.createMessageObject({
					code : '5100',
					aParameters: ['Passed falsity (0,"",undefined,null) or an object as identifier during update of path filter']
				}));
				return;
			} 
			var propertyName = getPropertyNameOfFirstFilterTerm(filter);
			if (filterIdToProperty[id] && filterIdToProperty[id] !== propertyName){
				msgHandler.putMessage(msgHandler.createMessageObject({
					code : '5100',
					aParameters: ['Updating filter with different property not allowed']
				}));
				return;
			}
			if(!isAcceptedFilter(filter)){
				msgHandler.putMessage(msgHandler.createMessageObject({
					code : '5301'
				}));
			}
			inject.functions.setRestrictionByProperty(filter);
			filterIdToProperty[id] = propertyName;
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterIdHandler#get
		 * @description Returns a context fragment for the given identifier
		 * @param {number|string}
		 *            id Identifier of the context fragment. The id was
		 *            returned by the add method.
		 * @returns {sap.apf.utils.Filter} Context assigned to identifier
		 */
		this.get = function(id) {
			switch (typeof id) {
				case 'number':
					msgHandler.check(id > 0 && id < uniqueConsumerId, 'Passed unknown numeric identifier during get from path context handler');
					break;
				case 'string':
					msgHandler.check(filterIdToProperty[id], 'Passed unknown string identifier during get from path context handler');
					break;
				default:
					msgHandler.check(false, "Filter Id handler - wrong type of the id parameter in get");
			}
			return inject.functions.getRestrictionByProperty(filterIdToProperty[id]);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterIdHandler#getAllInternalIds
		 * @description Returns all internally generated IDs.
		 * @returns {array} List of internally generated IDs
		 */
		this.getAllInternalIds = function(id) {
			return jQuery.sap.extend(true, [], internallyGeneratedIds);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterIdHandler#serialize
		 * @description Serializes the content of the filterIdHandler.
		 * @returns {object} Serialized data as deep JS object
		 */
		this.serialize = function() {
			return jQuery.extend(true, {}, filterIdToProperty);
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.utils.FilterIdHandler#deserialize
		 * @description Re-initializes filter ID handler from
		 *              serialized data.
		 * @param {object} deserializableData
		 *            Serialized data used to re-initialize filter ID handler
		 * @returns {object} Re-initialize instance of
		 *          sap.apf.utils.filterIdHandler
		 */
		this.deserialize = function(deserializableData) {
			uniqueConsumerId = 1;
			var property;
			for(property in deserializableData) {
				if (typeof ifPossibleConvertToNumber(property) === 'number') {
					uniqueConsumerId++;
				}
			}
			filterIdToProperty = jQuery.extend(true, {}, deserializableData);
		};
		function getPropertyNameOfFirstFilterTerm(filter) {
			return filter.getInternalFilter().getProperties()[0];
		}
		function ifPossibleConvertToNumber(property) {
			if (isNaN(Number(property))) {
				return property;
			}
			return Number(property);
		}
		function isAcceptedFilter(filter) {
			var internalFilter = filter.getInternalFilter();
			var filterProperties = internalFilter.getProperties();
			if(filterProperties.length > 1){
				return false;
			}
			var visitor = new Visitor();
			internalFilter.traverse(visitor);
			return visitor.isAccepted();
			function Visitor() {
				var visitorContext = this;
				var isOr = false;
				var isAnd = false;
				var isAccepted = true;
				this.isAccepted = function() {
					return isAccepted;
				};
				this.processEmptyFilter = function() {
					return;
				};
				this.processTerm = function(term) {
					var operator = term.getOp();
					if(!isAnd && !isOr){
						if(operator === 'GE' || operator === 'LE' || operator === 'EQ'){
							return;
						}
					}
					if(isAnd && (operator === 'GE' || operator === 'LE')){
						return;
					} 
					if (isOr && operator === 'EQ'){
						return;
					}
					isAccepted = false;
				};
				this.processAnd = function(filter0, aFilters) {
					if(aFilters && aFilters.length > 0){
						isAnd = true;
					}
					this.process(filter0);
					aFilters.forEach(function(filter){
						visitorContext.process(filter);
					});
				};
				this.processOr = function(filter0, aFilters) {
					if(aFilters && aFilters.length > 0){
						isOr = true;
					}
					this.process(filter0);
					aFilters.forEach(function(filter){
						visitorContext.process(filter);
					});
				};
				this.process = function(filter) {
					if(isOr && isAnd){
						isAccepted = false;
					}
					if(!isAccepted){
						return;
					}
					filter.traverse(this);
				};
			}
		}
	};
}());
