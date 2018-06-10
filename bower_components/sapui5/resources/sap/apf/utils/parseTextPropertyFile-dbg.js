jQuery.sap.declare("sap.apf.utils.parseTextPropertyFile");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.apf.core.constants");
(function() {
	'use strict';
	/**
	 * @private
	 * @function
	 * @description parses a text property file and returns the text elements and the application id
	 *  plus messages
	 *  @param {string} textFileString property file as string
	 *  @param {object} inject injected instances 
	 *  @param {sap.apf.core.MessageHandler} inject.instance.messageHandler injected messageHandler 
	 * @returns {object} result with properties Application, TextElements, Messages
	 */
	sap.apf.utils.parseTextPropertyFile = function(textFileString, inject) {
		var messageHandler = inject.instances.messageHandler;
		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			pattern : "yyyy/MM/dd HH:mm:ss"
		});
		var oDate;
		var aLines = textFileString.split(/\r?\n/);
		var len = aLines.length;
		var i, j;
		var indexOfExpectedEntry = -1;
		var indexOfLastChangeDate = -1;
		var textElementEntry;
		var formatWithHint, formatWithoutHint, entry;
		var bApplicationIdFound = false;
		var parseResult = {
			Application : undefined,
			TextElements : [],
			Messages : []
		};
		var bSkipNextLine = false;
		function complain(messageNumber, lineNumber) {
			var message = messageHandler.createMessageObject({
				code : messageNumber,
				aParameters : [ lineNumber ]
			});
			parseResult.Messages.push(message);
		}
		function complainWrongFormatApplicationId(lineNumber) {
			complain(11013, lineNumber);
		}
		function complainMissingTextEntry(lineNumber) {
			complain(5411, lineNumber);
		}
		function isValidGuidFormatForTextElement(textElement, lineNumber) {
			var isValid = sap.apf.utils.isValidGuid(textElement);
			if (!isValid) {
				complain(5412, lineNumber);
				return false;
			}
			return true;
		}
		function complainWrongDateFormat(lineNumber) {
			complain(5415, lineNumber);
		}
		function complainInvalidTextEntryGuid(lineNumber) {
			complain(5412, lineNumber);
		}

		for(i = 0; i < len; i++) {
			if (!bApplicationIdFound) {
				var applicationId = /^\#\s*ApfApplicationId=[0-9A-F]+\s*$/.exec(aLines[i]);
				if (applicationId !== null) {
					parseResult.Application = aLines[i].split('=')[1];
					if (!sap.apf.utils.isValidGuid(parseResult.Application)) {
						parseResult.Application = "";
						complainWrongFormatApplicationId(i);
					}
					bApplicationIdFound = true;
					continue;
				}
			}
			if (aLines[i] === "") {
				continue;
			}
			if (bSkipNextLine) {
				bSkipNextLine = false;
				continue;
			}
			if (indexOfLastChangeDate === i && /^\#\s*LastChangeDate/.exec(aLines[i])) {
				//# LastChangeDate=2014/10/07 16:30:29
				entry = aLines[i].split('=');
				if (entry.length === 2) {
					oDate = oDateFormat.parse(entry[1]);
					if (!oDate) {
						complainWrongDateFormat(i);
						textElementEntry.LastChangeUTCDateTime = "";
					} else {
						textElementEntry.LastChangeUTCDateTime = '/Date(' + oDate.getTime() + ')/';
					}
					parseResult.TextElements.push(textElementEntry);
				} else {
					complainWrongDateFormat(i);
				}
				textElementEntry = null;
				continue;
			}
			if (indexOfExpectedEntry === i) {
				entry = aLines[i].split('=');			
				if (entry.length > 1) {
					if (entry[0] === "AnalyticalConfigurationName") {
						indexOfLastChangeDate = 0;
						bSkipNextLine = true;
						continue;
					}
					// take over only proper entries
					if (isValidGuidFormatForTextElement(entry[0], i)) {
						textElementEntry.TextElement = entry[0];
						textElementEntry.TextElementDescription = entry[1];
						for (j = 2; j < entry.length;j++) {
							textElementEntry.TextElementDescription += "=" + entry[j];
						}
					} else {
						complainInvalidTextEntryGuid(i);
					}
				} else {
					complainMissingTextEntry(i);
				} 
				continue;
			}
			formatWithHint = /^\#(X|Y)[A-Z]{3},[0-9]+:/.exec(aLines[i]);
			if (formatWithHint) {
				if (indexOfExpectedEntry === i) {
					complainMissingTextEntry(i);
				}
				textElementEntry = {};
				textElementEntry.Language = sap.apf.core.constants.developmentLanguage; //Default development language
				textElementEntry.Application = parseResult.Application;
				textElementEntry.TextElementType = aLines[i].match(/(X|Y)[A-Z]{3}/)[0];
				textElementEntry.MaximumLength = aLines[i].match(/,[0-9]+/);
				textElementEntry.MaximumLength = parseInt(textElementEntry.MaximumLength[0].substring(1), 10);
				textElementEntry.TranslationHint = aLines[i].match(/:\s*[0-9a-zA-Z\s]+$/);
				textElementEntry.TranslationHint = textElementEntry.TranslationHint[0].substring(1);
				indexOfExpectedEntry = i + 1;
				indexOfLastChangeDate = i + 2;
			} else {
				formatWithoutHint = /^\#(X|Y)[A-Z]{3},[0-9]+/.exec(aLines[i]);
				if (formatWithoutHint) {
					if (indexOfExpectedEntry === i) {
						complainMissingTextEntry(i);
					}
					textElementEntry = {};
					textElementEntry.Language = sap.apf.core.constants.developmentLanguage; //Default development language
					textElementEntry.Application = parseResult.Application;
					textElementEntry.TextElementType = aLines[i].match(/(X|Y)[A-Z]{3}/)[0];
					textElementEntry.MaximumLength = aLines[i].match(/,[0-9]+/);
					textElementEntry.MaximumLength = parseInt(textElementEntry.MaximumLength[0].substring(1), 10);
					textElementEntry.TranslationHint = "";
					indexOfExpectedEntry = i + 1;
					indexOfLastChangeDate = i + 2;
				}
			}
		}
		if (!bApplicationIdFound) {
			complain(5410, 0);
		}
		return parseResult;
	};
}());