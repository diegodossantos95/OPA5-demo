jQuery.sap.declare("sap.apf.ui.utils.formatter");
jQuery.sap.require("sap.apf.ui.utils.stringToDateFormatter");
jQuery.sap.require("sap.apf.ui.utils.dateTimeFormatter");
jQuery.sap.require("sap.apf.ui.utils.timeFormatter");
jQuery.sap.require("sap.apf.ui.utils.decimalFormatter");
(function() {
	"use strict";
	sap.apf.ui.utils.formatter = function(oFormatterArgs, metadata, dataResponse) {
		this.metadata = metadata;
		this.dataResponse = dataResponse;
		this.oFormatterArgs = oFormatterArgs;
		this.oDataTypeFormatterMap = _dataTypeFormatterMap();
	};
	sap.apf.ui.utils.formatter.prototype.constructor = sap.apf.ui.utils.formatter;
	function _dataTypeFormatterMap() {
		var datatypeFormatterMap = new Map();
		datatypeFormatterMap.set("Edm.String", _typeStringFormatter);
		datatypeFormatterMap.set("Edm.DateTime", _typeDateTimeFormatter);
		datatypeFormatterMap.set("Edm.Time", _typeTimeFormatter);
		datatypeFormatterMap.set("Edm.Decimal", _typeDecimalFormatter);
		return datatypeFormatterMap;
	}
	function _typeStringFormatter(oMetadata, originalFieldValue) {
		var stringToDateFormatterClass = new sap.apf.ui.utils.StringToDateFormatter();
		return stringToDateFormatterClass.getFormattedValue(oMetadata, originalFieldValue, this.oFormatterArgs);
	}
	function _typeDateTimeFormatter(oMetadata, originalFieldValue) {
		var dateTimeFormatterClass = new sap.apf.ui.utils.DateTimeFormatter();
		return dateTimeFormatterClass.getFormattedValue(oMetadata, originalFieldValue);
	}
	function _typeTimeFormatter(oMetadata, originalFieldValue) {
		var timeFormatterClass = new sap.apf.ui.utils.TimeFormatter();
		return timeFormatterClass.getFormattedValue(oMetadata, originalFieldValue);
	}
	function _typeDecimalFormatter(oMetadata, originalFieldValue) {
		var typeDecimalFormatterClass = new sap.apf.ui.utils.DecimalFormatter();
		var oMetaData = oMetadata.unit !== undefined ? _getPropertyMetadata(this, oMetadata.unit) : oMetadata;
		var precision = 0;
		if (oMetadata !== undefined && this.dataResponse !== undefined && this.dataResponse[0] !== undefined) {
			precision = isNaN(oMetadata.scale) ? this.dataResponse[0][oMetadata.scale] : oMetadata.scale;
		}
		return typeDecimalFormatterClass.getFormattedValue(oMetaData, originalFieldValue, precision);
	}
	function _getPropertyMetadata(formatter, fieldName) {
		if (formatter.metadata && formatter.metadata.getPropertyMetadata) {
			return formatter.metadata.getPropertyMetadata(fieldName);
		}
		return formatter.metadata;
	}
	sap.apf.ui.utils.formatter.prototype.getFormattedValue = function(fieldName, originalFieldValue) {
		if (originalFieldValue === null) {
			return "null";
		}
		var formattedFieldValue;
		var oMetadata = _getPropertyMetadata(this, fieldName);
		var oDataType = oMetadata.dataType !== undefined ? oMetadata.dataType.type : undefined;
		if (oDataType === undefined) {
			oDataType = oMetadata.type;
		}
		if (this.oDataTypeFormatterMap.has(oDataType)) {
			formattedFieldValue = this.oDataTypeFormatterMap.get(oDataType).call(this, oMetadata, originalFieldValue);
		} else {
			formattedFieldValue = originalFieldValue;
		}
		var metadataObject = jQuery.extend({}, oMetadata);
		formattedFieldValue = _applyCustomFormatting(metadataObject, fieldName, originalFieldValue, formattedFieldValue, this.oFormatterArgs);
		return formattedFieldValue;
	};
	sap.apf.ui.utils.formatter.prototype.getFormatStringTooltip = function(measure) {
		return this.getFormatString(measure);
	};
	sap.apf.ui.utils.formatter.prototype.getFormatString = function(measure) {
		var self = this;
		var formatterInstance = sap.viz.ui5.format.ChartFormatter.getInstance();
		sap.viz.ui5.api.env.Format.numericFormatter(formatterInstance);
		var fieldName = measure.fieldName;
		formatterInstance.registerCustomFormatter("measureFormatter", function(value) {
			// check with CVOM Team if not supported value
			var formattedMeasureValue = "-";
			if (value !== null) {
				formattedMeasureValue = self.getFormattedValue(fieldName, value);
			}
			return formattedMeasureValue;
		});
		var sFormatString = "measureFormatter";
		return sFormatString;
	};
	/**
	 * @method getFormattedValueForTextProperty
	 * @param {oTextToBeFormatted} -
	 *            the texts which has to be concatenated oTextToBeFormatted ={
	 *            text:textField, key:fieldName }
	 * @description returns the concatenated string (e.g. Customer Name(Customer
	 *              Id) for a text field
	 */
	sap.apf.ui.utils.formatter.prototype.getFormattedValueForTextProperty = function(fieldName, oTextToBeFormatted) {
		var sFormattedText;
		if (oTextToBeFormatted.key) {
			sFormattedText = oTextToBeFormatted.text + " (" + oTextToBeFormatted.key + ")";
		} else {
			sFormattedText = oTextToBeFormatted.text;
		}
		var metadataObject = jQuery.extend({}, _getPropertyMetadata(this, fieldName));
		sFormattedText = _applyCustomFormatting(metadataObject, fieldName, oTextToBeFormatted.text, sFormattedText, this.oFormatterArgs);
		return sFormattedText;
	};
	/**
	 * @private
	 * @method _applyCustomFormatting
	 * @description calls the application specific formatting if it is available
	 */
	function _applyCustomFormatting(metadataObject, fieldName, originalFieldValue, formattedFieldValue, oFormatterArgs) {
		var appFormattedFieldValue;
		var customFormatAvailable = oFormatterArgs.getExits !== undefined ? oFormatterArgs.getExits.customFormat : undefined;
		if (customFormatAvailable === undefined) {
			return formattedFieldValue;
		}
		appFormattedFieldValue = oFormatterArgs.getExits.customFormat.apply(oFormatterArgs, [ metadataObject, fieldName, originalFieldValue, formattedFieldValue ]);
		formattedFieldValue = appFormattedFieldValue !== undefined ? appFormattedFieldValue : formattedFieldValue;
		return formattedFieldValue;
	}
}());
