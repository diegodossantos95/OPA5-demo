/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.metadataFactory");

(function() {
	'use strict';
	/**
	 * @class This class creates and manages metadata and entity type metadata instances. 
	 * The class assures that there is a single metadata instance per service root and
	 * that there is a single entity type metadata instance per service root and and entity type.
	 */
	sap.apf.core.MetadataFactory = function(oInject) {
		/**
		 * @description Returns type of metadataFactory.
		 * @returns {String}
		 */
		this.type = "metadataFactory";
		var messageHandler = oInject.instances.messageHandler;
		var Hashtable = oInject.constructors.Hashtable;
		var Metadata = oInject.constructors.Metadata;
		var EntityTypeMetadata = oInject.constructors.EntityTypeMetadata;
		var MetadataFacade = oInject.constructors.MetadataFacade;
		//delete properties from oInject, which are not necessary to be transferred to metadata instances 
		delete oInject.constructors.Metadata;
		delete oInject.constructors.EntityTypeMetadata;
		delete oInject.constructors.MetadataFacade;
		delete oInject.instances.configurationFactory;
		var metadataBuffer = new Hashtable(messageHandler);
		/**
		 * @description Returns metadata object that represents metadata corresponding to the service document.
		 * @param {string} pathToServiceDocument Path to the service document
		 * @returns {jQuery.Deferred.Promise} resolves with an instance of sap.apf.core.Metadata or is rejected in error case
		 */
		this.getMetadata = function(pathToServiceDocument) {
			if (metadataBuffer.hasItem(pathToServiceDocument) === false) {
				metadataBuffer.setItem(pathToServiceDocument, {
					metadataPromise : new Metadata(oInject, pathToServiceDocument).isInitialized()
				});
			}
			return metadataBuffer.getItem(pathToServiceDocument).metadataPromise;
		};
		/**
		 * @description Returns metadata object that represents metadata corresponding to the service document and an entity type that belongs to the service.
		 * @param {string} pathToServiceDocument Absolute path to the service document
		 * @param {string} entityType Entity type
		 * @returns {jQuery.Deferred} will be resolved with {sap.apf.core.EntityTypeMetadata | undefined}
		 */
		this.getEntityTypeMetadata = function(pathToServiceDocument, entityType) {
			var entityTypesOfService;
			var deferredResult;
			var metadataPromise = this.getMetadata(pathToServiceDocument);
			entityTypesOfService = metadataBuffer.getItem(pathToServiceDocument).entityTypes;
			if (!entityTypesOfService) {
				entityTypesOfService = new Hashtable(messageHandler);
				metadataBuffer.getItem(pathToServiceDocument).entityTypes = entityTypesOfService;
			}
			if (!entityTypesOfService.getItem(entityType)) {
				deferredResult = jQuery.Deferred();
				entityTypesOfService.setItem(entityType, deferredResult.promise());
				metadataPromise.then(function(metadata) {
					deferredResult.resolve(new EntityTypeMetadata(messageHandler, entityType, metadata));
				}, function() {
					deferredResult.resolve(undefined);
				});
			}
			return entityTypesOfService.getItem(entityType);
		};
		/**
		 * @description Returns instance of {sap.apf.core.MetadataFacade}
		 * @returns {sap.apf.core.MetadataFacade}
		 */
		this.getMetadataFacade = function(pathToServiceDocument) {
			//TODO Check if it would be better to buffer THE MetadataFaced-instance - kind of singleton
			return new MetadataFacade({
				constructors : {
					MetadataProperty : oInject.constructors.MetadataProperty 
				},
				instances : { 
					messageHandler : messageHandler,
					metadataFactory : this
				}
			}, pathToServiceDocument);
		};
		/**
		 * @description Returns service documents
		 * @returns {Array}
		 */
		this.getServiceDocuments = function() {
			return oInject.functions.getServiceDocuments();
		};
		/**
		 * @description Returns all entity sets of service suitable for configuration of analytical request
		 * @returns {Array}
		 */
		this.getEntitySets = function(sService) {
			var deferred = jQuery.Deferred();
			this.getMetadata(sService).done(function(metadata) {
				deferred.resolve(metadata.getEntitySets());
			}).fail(function(){
				deferred.resolve([]);
			});
			return deferred.promise();
		};
		
		/**
		 * @description Returns all entity sets of service regardless semantics but without parameter entity sets
		 * @returns {Array}
		 */
		this.getAllEntitySetsExceptParameterEntitySets = function(sService) {
			var deferred = jQuery.Deferred();
			this.getMetadata(sService).done(function(metadata) {			
				deferred.resolve(metadata.getAllEntitySetsExceptParameterEntitySets());
			}).fail(function(){
				deferred.resolve([]);
			});
			return deferred.promise();
		};
		/**
		 * @description Returns all entity types of service
		 * @returns {Array}
		 */
		this.getEntityTypes = function(sService) {
			var deferred = jQuery.Deferred();
			this.getMetadata(sService).done(function(metadata) {
				deferred.resolve(metadata.getEntityTypes());
			}).fail(function(){
				deferred.resolve([]);
			});
			return deferred.promise();
		};
	};
}());