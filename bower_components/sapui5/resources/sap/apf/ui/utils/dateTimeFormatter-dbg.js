jQuery.sap.declare('sap.apf.ui.utils.dateTimeFormatter');
jQuery.sap.require('sap.ui.core.format.DateFormat');
jQuery.sap.require("sap.ui.core.date.Gregorian");
(function() {
	"use strict";
	sap.apf.ui.utils.DateTimeFormatter = function() {
		this.oDisplayFormatterMap = _getMapForDisplayFormat();
	};
	sap.apf.ui.utils.DateTimeFormatter.prototype.constructor = sap.apf.ui.utils.DateTimeFormatter;
	function _getMapForDisplayFormat() {
		var displayFormatterMap = new Map();
		displayFormatterMap.set("Date", _getDisplayDate);
		displayFormatterMap.set(undefined, _returnOriginalValue);
		return displayFormatterMap;
	}
	function _getDisplayDate(originalFieldValue) {
		var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
			pattern : "MM/dd/yyyy"
		});
		var dateFormat = dateFormatter.format(originalFieldValue, false);
		return dateFormat;
	}
	function _returnOriginalValue(originalFieldValue) {
		return originalFieldValue;
	}
	sap.apf.ui.utils.DateTimeFormatter.prototype.getFormattedValue = function(oMetadata, originalFieldValue) {
		var displayFormat = oMetadata["sap:display-format"] !== undefined ? oMetadata["sap:display-format"] : undefined;
		var dateValue = new Date(originalFieldValue);
		if (dateValue.toLocaleString() === "Invalid Date") {
			return "-";
		}
		var formattedDateValue = this.oDisplayFormatterMap.get(displayFormat) !== undefined ? this.oDisplayFormatterMap.get(displayFormat).call(this, dateValue) : dateValue;
		//if null or not instance of date then CVOM has to handle.Requested to CVOM already
		return formattedDateValue;
	};
}());
