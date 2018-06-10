jQuery.sap.declare('sap.apf.core.utils.annotationHandler');
/**
 * this class looks in the manifest, whether annotations are defined  for a service root in the data sources section.
 * @param {function} inject.functions.getODataPath function to determine an uri
 * @param {sap.apf.core.utils.FileExists} inject.instance.fileExists tests, whether uri exists or not
 * @param {function} inject.functions.getBaseURLOfComponent determine the absolute URI of a component
 * @param {function} inject.functions.addRelativeToAbsoluteURL adds a relative URL to an absolute URL
 * @param {object} [inject.manifests.baseManifest]  base manifest of the component
 * @param {object} [inject.manifests.manifest] manifest of the component
 */
sap.apf.core.utils.AnnotationHandler = function(inject) {
	'use strict';
	var manifest = inject.manifests && inject.manifests.manifest;
	var dataSources = manifest && manifest["sap.app"].dataSources;
	var sapSystem = inject.functions.getSapSystem();
	var apfMinVersion = manifest && manifest["sap.ui5"] &&  manifest["sap.ui5"].dependencies && manifest["sap.ui5"].dependencies.libs && manifest["sap.ui5"].dependencies.libs["sap.apf"] && manifest["sap.ui5"].dependencies.libs["sap.apf"].minVersion;
	/**
	 * @public
	 * returns either the annotations from manifest of the component or the default annotation file, if it exists. Existence of annotations from the manifest definition is not checked, because
	 * if their absence should lead to an error.
	 * @returns {string[]} urisOfAnnotations
	 */
	this.getAnnotationsForService = function(serviceRoot) {
		if (!dataSources) {
			return getDefaultAnnotationFile(serviceRoot);
		}
		return getAnnotationsForServiceFromManifest(serviceRoot);
	};
	/**
	 * @private
	 * returns the default annotation file in array, if it exists;
	 * @returns {string[]} uriOfDefaultAnnotationFile
	 */
	function getDefaultAnnotationFile(serviceRoot) {
		if( !(typeof apfMinVersion === "string")  ||  apfMinVersion < "1.44.0" ){
			
			var sAnnotationUri = inject.functions.getODataPath(serviceRoot) + "annotation.xml";
			if (sapSystem) {
				sAnnotationUri = sap.ui.model.odata.ODataUtils.setOrigin(sAnnotationUri, { force : true, alias : sapSystem});		
			}
			if( inject.instances.fileExists.check(sAnnotationUri)) {
				return [sAnnotationUri];
			}			
		}
		return [];
	}
	/**
	 * @private 
	 * removes a trailing slash from an url and the origin segment
	 * @param {string} str
	 * @returns {string} str without trailing slash
	 */
	function removeTrailingSlashAndOrigin(str) {
		if (str && str[str.length - 1] === '/') {
			str = str.substring(0, str.length - 1);
		}
		var i;
		if (!str) {
			return str;
		}
		var split = str.split(";");
		var normalizedString = split[0];
		for (i = 1; i < split.length; i++) {
			if (split[i].search("o=") === -1) {
				normalizedString = normalizedString + ';' + split[i];
			}
		}
		return normalizedString;
	}
	/**
	 * @private
	 * compares two uris. Neglects trailing slashes
	 * @param {string} uri1
	 * @param {string} uri2
	 * @returns {boolean} compare result 
	 */
	function areEqualUris(uri1, uri2) {
		var normalizedUri1 = removeTrailingSlashAndOrigin(uri1);
		var normalizedUri2 = removeTrailingSlashAndOrigin(uri2);

		return (normalizedUri1 === normalizedUri2);
	}
	/**
	 * @private
	 * helper function, that looks in the manifest, whether an annotation file is returned in service root. Otherwise returns the default annotation file, if it exists.
	 * @returns {string[]} urisOfAnnotationFiles
	 */
	function getAnnotationsForServiceFromManifest(serviceRoot){
		var uris = [];
		var dataSource;

		for (dataSource in dataSources) {

			if (areEqualUris(dataSources[dataSource].uri, serviceRoot)) {
				var annotations = dataSources[dataSource].settings && dataSources[dataSource].settings.annotations;
				if (annotations) {
					annotations.forEach(addAnnotationUri);
				} else {
					return getDefaultAnnotationFile(serviceRoot);
				}
				return uris;
			}
		}
		return getDefaultAnnotationFile(serviceRoot);
		
		function addAnnotationUri(annotationDatasource){
			var annotationUri = dataSources[annotationDatasource] && dataSources[annotationDatasource].uri;
			var localUri  = dataSources[annotationDatasource] && dataSources[annotationDatasource].settings && dataSources[annotationDatasource].settings.localUri;
			var componentUri;

			if (annotationUri) {
				if (sapSystem) {
					annotationUri = sap.ui.model.odata.ODataUtils.setOrigin(annotationUri, { force : true, alias : sapSystem});		
				}
				uris.push(annotationUri);
			}
			if (localUri && localUri[0] !== '/') {
				var componentName = inject.functions.getComponentNameFromManifest(inject.manifests.manifest);
				componentUri = inject.functions.getBaseURLOfComponent(componentName);
				uris.push(inject.functions.addRelativeToAbsoluteURL(componentUri, localUri));
			} else if (localUri && localUri[0] === '/') {
				uris.push(localUri);
			}
		}
	}
};
