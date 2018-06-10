jQuery.sap.declare('sap.apf.core.utils.areRequestOptionsEqual');

(function() {
	'use strict';

	/**
	 * checks, whether two request option sets are equal or not. It takes into account, that
	 * the paging options skip, top and inlinecount have default values.
	 * @param {object} options1  @link sap.apf.ui.representations.representationInterface#getRequestOptions
	 * @param {object} options2
	 * @returns {boolean} compareResult true, if equal
	 */
	sap.apf.core.utils.areRequestOptionsEqual = function(options1, options2){
		function arePagingOptionsEqual(pagingOptions1, pagingOptions2) {
			if (pagingOptions1.skip) {
				var skipOptions2 = (pagingOptions2 && pagingOptions2.skip) || 0;
				if (pagingOptions1.skip !== skipOptions2) {
					return false;
				}
			}
			if (pagingOptions1.top) {
				var topOptions2 = (pagingOptions2 && pagingOptions2.top) || 0;
				if (pagingOptions1.top !== topOptions2) {
					return false;
				}
			}
			if (pagingOptions1.inlineCount) {
				var inlineCountOptions2 = (pagingOptions2 && pagingOptions2.inlineCount) || false;
				if (pagingOptions1.inlineCount !== inlineCountOptions2) {
					return false;
				}
			}
			return true;
		}
		function areOptionsEqual(oOptions1, oOptions2) {
			var nLength1 = 0;
			var nLength2 = 0;
			var property;
			for(property in oOptions1) {
				nLength1++;
			}
			for(property in oOptions2) {
				nLength2++;
			}
			if (nLength1 !== nLength2) {
				return false;
			}
			for(property in oOptions1) {
				if (!oOptions1.hasOwnProperty(property)) {
					continue;
				}
				if (typeof oOptions1[property] === 'object') {
					if (!areOptionsEqual(oOptions1[property], oOptions2[property])) {
						return false;
					}
				} else if (oOptions1[property] !== oOptions2[property]) {
						return false;
				}
			}
			return true;
		}
		function compareOptions(options1, options2) {
			var i;
			options1 = options1  || {};
			options2 = options2  || {};
			var keysOfOptions1 = Object.keys(options1);
			for (i = 0; i < keysOfOptions1.length; i++) {
				if (keysOfOptions1[i] === "paging") {
					if (!arePagingOptionsEqual(options1.paging, options2.paging)) {
						return false;
					}
				}
				if (keysOfOptions1[i] === "orderby") {
					if (!areOptionsEqual(options1.orderby, options2.orderby)) {
						return false;
					}
				}
			}
			return true;
		}
		if (compareOptions(options1, options2)) {
			return compareOptions(options2, options1);
		}
		return false;
	};
}());