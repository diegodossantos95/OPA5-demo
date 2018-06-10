sap.ui.define([
	"sap/ui/base/Object"
	],	function(BaseObject) {
		"use strict";
		var ModelUtil = BaseObject.extend("sap.suite.ui.generic.template.AnalyticalListPage.util.ModelUtil");
		//Constants
		var FILTER = "Filter";
		/**
		 * [showFooterBar To determine if footerbar to be shown]
		 * @param  {[oContext]}  sEntitySet [ViewMode]
		 * @return {Boolean}              [Returns status of footerbar to the xml]
		 */
		ModelUtil.hasVisibleChild = function(oContext){
			var oChild = this.getContent();
			for (var i = 0; i < oChild.length; i++) {
				var sType = oChild[i].getMetadata().getName();
				if ( sType === 'sap.m.HBox' ) {
					var customData = oChild[i].data(FILTER);
					if ( oContext.indexOf(customData) !== -1 ) {
						return true;
					}
				}
			}
			return false;
		};
	return ModelUtil;
}, true);