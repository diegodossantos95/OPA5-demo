/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global window*/
/**
  * Static helper functions
  */
jQuery.sap.declare('sap.apf.modeler.ui.utils.helper');
(function() {
	"use strict";
	sap.apf.modeler.ui.utils.helper = {
		/**
		 * @description callback on resize of the window
		 */
		onResize : function(callback) {
			jQuery(window).resize(function() {
				callback();
			});
		},
		/**
		 * @description applies height and width to child element from respective parent or values passed
		 */
		applySize : function(wParent, hParent, child, options) {
			var width, height;
			if (hParent !== undefined) {
				if (hParent.getDomRef !== undefined) {
					height = jQuery(hParent.getDomRef()).height();
				} else if (jQuery.isNumeric(hParent)) {
					height = hParent;
				} else {
					height = jQuery(hParent).height();
				}
			}
			if (wParent !== undefined) {
				if (wParent.getDomRef !== undefined) {
					width = jQuery(hParent.getDomRef()).width();
				} else if (jQuery.isNumeric(wParent)) {
					width = wParent;
				} else {
					height = jQuery(wParent).width();
				}
			}
			var childEle = (child.getDomRef !== undefined) ? jQuery(child.getDomRef()) : jQuery(child);
			var offsetHeight = (options === undefined) ? 0 : (options.offsetHeight || 0);
			var offsetWidth = (options === undefined) ? 0 : (options.offsetWidth || 0);
			//Apply Height & Width to Child
			childEle.css({
				height : (hParent === undefined) ? "100%" : height + offsetHeight + "px",
				width : (wParent === undefined) ? "100%" : width + offsetWidth + "px"
			});
		}
	};
}());