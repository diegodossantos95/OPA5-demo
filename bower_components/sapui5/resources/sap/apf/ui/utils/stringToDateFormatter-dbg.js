jQuery.sap.declare('sap.apf.ui.utils.stringToDateFormatter');
(function() {
	"use strict";
	sap.apf.ui.utils.StringToDateFormatter = function() {
		this.oSemanticsFormatterMap = _getMapForSemantic();
		this.oAnnotationFormatterMap = _getMapForAnnotation();
	};
	sap.apf.ui.utils.StringToDateFormatter.prototype.constructor = sap.apf.ui.utils.StringToDateFormatter;
	function _getMapForAnnotation() {
		var annotationFormatterMap = new Map();
		annotationFormatterMap.set("isCalendarYearMonth", _calendarYearMonth);
		annotationFormatterMap.set("isCalendarDate", _calendarDate);
		annotationFormatterMap.set("isCalendarYearQuarter", _calendarYearQuarter);
		annotationFormatterMap.set("isCalendarYearWeek", _calendarYearWeek);
		return annotationFormatterMap;
	}
	function _getMapForSemantic() {
		var semanticsFormatterMap = new Map();
		semanticsFormatterMap.set("yearmonth", _yearMonthFormatter);
		semanticsFormatterMap.set("yearmonthday", _yearMonthDayFormatter);
		semanticsFormatterMap.set(undefined, _returnOriginalValue);
		return semanticsFormatterMap;
	}
	function _returnOriginalValue(oMetadata, originalFieldValue) {
		return originalFieldValue;
	}
	function _yearMonthFormatter(map, originalFieldValue, oFormatterArgs) {
		var jan = oFormatterArgs.getTextNotHtmlEncoded("month-1-shortName");
		var feb = oFormatterArgs.getTextNotHtmlEncoded("month-2-shortName");
		var mar = oFormatterArgs.getTextNotHtmlEncoded("month-3-shortName");
		var apr = oFormatterArgs.getTextNotHtmlEncoded("month-4-shortName");
		var may = oFormatterArgs.getTextNotHtmlEncoded("month-5-shortName");
		var jun = oFormatterArgs.getTextNotHtmlEncoded("month-6-shortName");
		var jul = oFormatterArgs.getTextNotHtmlEncoded("month-7-shortName");
		var aug = oFormatterArgs.getTextNotHtmlEncoded("month-8-shortName");
		var sep = oFormatterArgs.getTextNotHtmlEncoded("month-9-shortName");
		var oct = oFormatterArgs.getTextNotHtmlEncoded("month-10-shortName");
		var nov = oFormatterArgs.getTextNotHtmlEncoded("month-11-shortName");
		var dec = oFormatterArgs.getTextNotHtmlEncoded("month-12-shortName");
		var monthsArray = [ jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec ];
		var year = originalFieldValue.substr(0, 4);
		var month = monthsArray[originalFieldValue.substr(4, 6) - 1];
		return month + " " + year;
	}
	function _yearMonthDayFormatter(map, originalFieldValue) {
		var formattedValue = "-";
		var yearMetadata = originalFieldValue.substr(0, 4);
		var monthMetadata = parseInt(originalFieldValue.substr(4, 2), 10) - 1;
		var dateMetadata = originalFieldValue.substr(6, 2);
		var dateObject = new Date(yearMetadata, monthMetadata, dateMetadata);
		if (!isNaN(dateObject.getTime())) {
			var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
				pattern : "MM/dd/yyyy"
			});
			formattedValue = dateFormatter.format(dateObject, false);
		}
		return formattedValue;
	}
	function _calendarYearMonth(oMetadata, originalFieldValue, oFormatterArgs) {
		if (oMetadata.isCalendarYearMonth === undefined) {
			return "";
		}
		var formattedValue = _yearMonthFormatter(this, originalFieldValue, oFormatterArgs);
		return formattedValue;
	}
	function _calendarDate(oMetadata, originalFieldValue) {
		if (oMetadata.isCalendarDate === undefined) {
			return "";
		}
		var formattedValue = _yearMonthDayFormatter(this, originalFieldValue);
		return formattedValue;
	}
	function _calendarYearQuarter(oMetadata, originalFieldValue) {
		if (oMetadata.isCalendarYearQuarter === undefined) {
			return "";
		}
		var yearMetadata = originalFieldValue.substr(0, 4);
		var quarterMetadata = originalFieldValue.substr(4, 1);
		var dateFromMetadata = new Date(yearMetadata);
		var yearInfoFromDate = dateFromMetadata.getFullYear();
		var quarterInfo;
		quarterInfo = "Q" + quarterMetadata;
		var formattedYearQuarter = quarterInfo + " " + yearInfoFromDate;
		return formattedYearQuarter;
	}
	function _calendarYearWeek(oMetadata, originalFieldValue) {
		if (oMetadata.isCalendarYearWeek === undefined) {
			return "";
		}
		var yearMetadata = originalFieldValue.substr(0, 4);
		var weekMetadata = originalFieldValue.substr(4, 2);
		var dateFromMetadata = new Date(yearMetadata);
		var yearInfoFromDate = dateFromMetadata.getFullYear();
		var weekInfo;
		weekInfo = "CW" + weekMetadata;
		var formattedYearWeek = weekInfo + " " + yearInfoFromDate;
		return formattedYearWeek;
	}
	sap.apf.ui.utils.StringToDateFormatter.prototype.getFormattedValue = function(oMetadata, originalFieldValue, oFormatterArgs) {
		var formattedDateValue = "";
		var semantics = oMetadata["sap:semantics"] !== undefined && oMetadata["sap:semantics"].String !== undefined ? oMetadata["sap:semantics"].String : oMetadata["sap:semantics"];
		if (originalFieldValue !== null) {
			var self = this;
			self.oAnnotationFormatterMap.forEach(function(functionName, functionValue) {
				if (formattedDateValue === "") {
					formattedDateValue = self.oAnnotationFormatterMap.get(functionValue).call(self, oMetadata, originalFieldValue, oFormatterArgs);
				}
			});
			if (formattedDateValue === "") {
				formattedDateValue = self.oSemanticsFormatterMap.get(semantics) !== undefined ? self.oSemanticsFormatterMap.get(semantics).call(self, oMetadata, originalFieldValue, oFormatterArgs) : originalFieldValue;
			}
		} else {
			formattedDateValue = originalFieldValue;
		}
		return formattedDateValue;
	};
}());
