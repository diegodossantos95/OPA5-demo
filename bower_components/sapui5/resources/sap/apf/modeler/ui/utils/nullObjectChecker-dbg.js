/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.utils.nullObjectChecker');
(function() {
	'use strict';
	/**
	* @class nullObjectChecker
	* @memberOf sap.apf.modeler.ui.utils
	* @name nullObjectChecker
	* @description helps checking for null undefined or blank objects and strings
	*/
	sap.apf.modeler.ui.utils.NullObjectChecker = function() {
	};
	sap.apf.modeler.ui.utils.NullObjectChecker.prototype.constructor = sap.apf.modeler.ui.utils.NullObjectChecker;
	sap.apf.modeler.ui.utils.NullObjectChecker.prototype.checkIsNotUndefined = function(obj) {
		if (obj === undefined) {
			return false;
		}
		return true;
	};
	sap.apf.modeler.ui.utils.NullObjectChecker.prototype.checkIsNotNull = function(obj) {
		if (obj === null) {
			return false;
		}
		return true;
	};
	sap.apf.modeler.ui.utils.NullObjectChecker.prototype.checkIsNotBlank = function(obj) {
		if ((obj instanceof Array) && obj.length === 0) {
			return false;
		}
		if ((obj instanceof Object) && (Object.keys(obj).length === 0)) {
			return false;
		}
		if (obj === "") {
			return false;
		}
		return true;
	};
	sap.apf.modeler.ui.utils.NullObjectChecker.prototype.checkIsNotNullOrBlank = function(obj) {
		return (this.checkIsNotNull(obj) && this.checkIsNotBlank(obj));
	};
	sap.apf.modeler.ui.utils.NullObjectChecker.prototype.checkIsNotNullOrUndefined = function(obj) {
		return (this.checkIsNotNull(obj) && this.checkIsNotUndefined(obj));
	};
	sap.apf.modeler.ui.utils.NullObjectChecker.prototype.checkIsNotUndefinedOrBlank = function(obj) {
		return (this.checkIsNotUndefined(obj) && this.checkIsNotBlank(obj));
	};
	sap.apf.modeler.ui.utils.NullObjectChecker.prototype.checkIsNotNullOrUndefinedOrBlank = function(obj) {
		return (this.checkIsNotNull(obj) && this.checkIsNotUndefined(obj) && this.checkIsNotBlank(obj));
	};
})();