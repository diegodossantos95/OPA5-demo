/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap, jQuery, window */
/**
  * Static helper functions
  */
jQuery.sap.declare('sap.apf.utils.utils');
jQuery.sap.require('sap.ui.core.format.DateFormat');
(function() {
	'use strict';
	var bFormatInformationIsMissing;
	var saltCounterForPseudoGuidSeperation = 0;
	sap.apf.utils.renderHeaderOfTextPropertyFile = function(applicationId, messageHandler) {
		var translationUuid = applicationId.toLowerCase();
		var checkValidFormatRegex = /^[0-9a-f]+$/;
		var isValid = checkValidFormatRegex.test(translationUuid);
		if (!isValid || applicationId.length !== 32) {
			messageHandler.putMessage(messageHandler.createMessageObject({
				code : "5409",
				aParameters : [ applicationId ]
			}));
			translationUuid = "<please enter valid translation uuid, if you want to upload into a SAP translation system>";
		} else {
			translationUuid = translationUuid.substring(0, 8) + '-' + translationUuid.substring(8, 12) + '-' + translationUuid.substring(12, 16) + '-' + translationUuid.substring(16, 20) + '-' + translationUuid.substring(20);
		}
		return "#FIORI: insert Fiori-Id\n" + "# __ldi.translation.uuid=" + translationUuid + "\n" + "#ApfApplicationId=" + applicationId + "\n\n";
	};
	/**
	 * @description Returns the URL parameters. Is a wrapper function for the jQuery.sap.getUriParameters function. For more details, please see SAPUI5 documentation 
	 * @returns {object}
	 */
	sap.apf.utils.getUriParameters = function() {
		return jQuery.sap.getUriParameters().mParams;
	};
	/**
	 * returns a promise with resolve value
	 */
	sap.apf.utils.createPromise = function(valueToBeResolved) {
		var deferred = jQuery.Deferred();
		deferred.resolve(valueToBeResolved);
		return deferred.promise();
	};
	sap.apf.utils.renderTextEntries = function(hashTableForTexts, messageHandler) {
		bFormatInformationIsMissing = false;
		var keys = hashTableForTexts.getKeys();
		keys.sort(function(a, b) {
			var valueA = hashTableForTexts.getItem(a);
			var valueB = hashTableForTexts.getItem(b);
			if (valueA.LastChangeUTCDateTime < valueB.LastChangeUTCDateTime) {
				return -1;
			}
			if (valueA.LastChangeUTCDateTime > valueB.LastChangeUTCDateTime) {
				return 1;
			}
			return 0;
		});
		var length = keys.length;
		var result = '';
		var i;
		for(i = 0; i < length; i++) {
			result = result + sap.apf.utils.renderEntryOfTextPropertyFile(hashTableForTexts.getItem(keys[i]), messageHandler);
		}
		return result;
	};
	sap.apf.utils.renderEntryOfTextPropertyFile = function(textData, messageHandler) {
		var dateString, oDate;
		if (!bFormatInformationIsMissing && (!textData.TextElementType || !textData.MaximumLength)) {
			bFormatInformationIsMissing = true;
			messageHandler.putMessage(messageHandler.createMessageObject({
				code : "5408",
				aParameters : [ textData.TextElement ]
			}));
		}
		var entry = "#" + (textData.TextElementType || "<Add text type>") + "," + (textData.MaximumLength || "<Add maximum length>");
		if (textData.TranslationHint && textData.TranslationHint !== "") {
			entry = entry + ':' + textData.TranslationHint;
		}
		entry = entry + "\n" + textData.TextElement + "=" + textData.TextElementDescription + "\n";
		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			pattern : "yyyy/MM/dd HH:mm:ss"
		});
		if (textData.LastChangeUTCDateTime && textData.LastChangeUTCDateTime !== "") {
			dateString = textData.LastChangeUTCDateTime.replace(/\/Date\(/, '').replace(/\)\//, '');
			oDate = new Date(parseInt(dateString, 10));
		} else {
			oDate = new Date();
		}
		entry = entry + "# LastChangeDate=" + oDateFormat.format(oDate) + '\n\n';
		return entry;
	};
	/**
	 * @description Eliminates duplicate values in an array. To be used for elementary types only!
	 * @param {*[]} oMsgHandler
	 * @param {*[]} aWithDuplicates
	 * @returns {*[]}
	 */
	sap.apf.utils.eliminateDuplicatesInArray = function(oMsgHandler, aWithDuplicates) {
		oMsgHandler.check((aWithDuplicates !== undefined && typeof aWithDuplicates === 'object' && aWithDuplicates.hasOwnProperty('length') === true), 'Error - aArray is undefined');
		var aReturn = [];
		var i, j;
		for(i = 0; i < aWithDuplicates.length; i++) {
			for(j = i + 1; j < aWithDuplicates.length; j++) {
				// If this[i] is found later in the array
				if (aWithDuplicates[i] === aWithDuplicates[j]) {
					j = ++i;
				}
			}
			aReturn.push(aWithDuplicates[i]);
		}
		return aReturn;
	};
	/**
	 * @description Returns a hash code of a string
	 * @param {string} sValue
	 * @returns {number}
	 */
	sap.apf.utils.hashCode = function(sValue) {
		var nHash = 0;
		var i;
		var nCharCode = 0;
		sValue = sValue.toString();
		var len = sValue.length;
		for(i = 0; i < len; i++) {
			nCharCode = sValue.charCodeAt(i);
			nHash = (17 * nHash + nCharCode) << 0;
		}
		return Math.abs(nHash);
	};
	/**
	 * @description Escapes data according to the SAP XSE OData specification, that is doubling the single quote
	 * @param {string} sValue
	 * @returns {string} || {object}
	 */
	sap.apf.utils.escapeOdata = function(sValue) {
		if (typeof sValue === "string") {
			return sValue.replace("'", "''");
		}
		return sValue;
	};
	/**
	 * @description Formats a value in json format in the javascript object.  
	 * @param {object} value some value
	 * @param {string} sType edm type name
	 * @returns {object} javascriptValue
	 */
	sap.apf.utils.json2javascriptFormat = function(value, sType) {
		var intermediateValue;
		switch (sType) {
			case "Edm.Boolean":
				if (typeof value === "boolean") {
					return value;
				}
				if (typeof value === "string") {
					return value.toLowerCase() === "true";
				}
				return false;
			case "Edm.Decimal":
			case "Edm.Guid":
			case "Edm.Int64":
			case "Edm.String":
				return value;
			case "Edm.Int16":
			case "Edm.Int32":
				return parseInt(value, 10);
			case "Edm.Single":
			case "Edm.Float":
				return parseFloat(value);
			case "Edm.Time":
				return value;
			case "Edm.DateTime":
				intermediateValue = value.replace('/Date(', '').replace(')/', '');
				intermediateValue = parseFloat(intermediateValue);
				return new Date(intermediateValue);
			case "Edm.DateTimeOffset":
				intermediateValue = value.replace('/Date(', '');
				intermediateValue = intermediateValue.replace(')/', '');
				intermediateValue = parseFloat(intermediateValue);
				return new Date(intermediateValue);
			default:
				return value;
		}
		return value; //default
	};
	/**
	  * @description Formats a value for usage in odata conformant url as filter or parameter with given Edm type
	  * @param {object} value some value
	  * @param {string} sType edm type name
	  * @returns {string} sFormatedValue
	  */
	sap.apf.utils.formatValue = function(value, sType) {
		function convertValueToDate(v) {
			var val;
			if (v instanceof Date) {
				return v;
			}
			if (typeof v === 'string') {
				if (v.substring(0, 6) === '/Date(') {
					val = v.replace('/Date(', '');
					val = val.replace(')/', '');
					val = parseInt(val, 10);
					return new Date(val);
				}
				return new Date(v);
			}
		}
		var oDate;
		var sFormatedValue = "";
		// null values should return the null literal
		if (value === null || value === undefined) {
			return "null";
		}
		switch (sType) {
			case "Edm.String":
				// quote
				sFormatedValue = "'" + String(value).replace(/'/g, "''") + "'";
				break;
			case "Edm.Time":
				if (typeof value === 'number') {
					oDate = new Date();
					oDate.setTime(value);
					var hours = oDate.getUTCHours();
					if (hours < 10) {
						hours = '0' + hours;
					}
					var minutes = oDate.getUTCMinutes();
					if (minutes < 10) {
						minutes = '0' + minutes;
					}
					var seconds = oDate.getUTCSeconds();
					if (seconds < 10) {
						seconds = '0' + seconds;
					}
					sFormatedValue = "time'" + hours + ':' + minutes + ':' + seconds + "'";
				} else {
					sFormatedValue = "time'" + value + "'";
				}
				break;
			case "Edm.DateTime":
				if (!sap.apf.utils.formatValue.oDateTimeFormat) {
					sap.apf.utils.formatValue.oDateTimeFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern : "'datetime'''yyyy-MM-dd'T'HH:mm:ss''"
					});
				}
				oDate = convertValueToDate(value);
				sFormatedValue = sap.apf.utils.formatValue.oDateTimeFormat.format(oDate, true);
				break;
			case "Edm.DateTimeOffset":
				if (!sap.apf.utils.formatValue.oDateTimeOffsetFormat) {
					sap.apf.utils.formatValue.oDateTimeOffsetFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern : "'datetimeoffset'''yyyy-MM-dd'T'HH:mm:ss'Z'''"
					});
				}
				oDate = convertValueToDate(value); //
				sFormatedValue = sap.apf.utils.formatValue.oDateTimeOffsetFormat.format(oDate, true);
				break;
			case "Edm.Guid":
				sFormatedValue = "guid'" + value + "'";
				break;
			case "Edm.Decimal":
				sFormatedValue = value + "M";
				break;
			case "Edm.Int64":
				sFormatedValue = String(value) + "L";
				break;
			case "Edm.Single":
				sFormatedValue = value + "f";
				break;
			case "Edm.Binary":
				sFormatedValue = "binary'" + value + "'";
				break;
			default:
				sFormatedValue = value;
				break;
		}
		return sFormatedValue;
	};
	/**
	 * @description Transforms a string into a callable function. Method should only be called internally by APF.
	 * @param {string} sFunctionPath
	 * @returns {function|undefined}
	 */
	sap.apf.utils.extractFunctionFromModulePathString = function(sFunctionPath) {
		if (jQuery.isFunction(sFunctionPath)) {
			return sFunctionPath;
		}
		var oDeepestNameSpaceLevel, aNameSpaceParts, sFunction;
		aNameSpaceParts = sFunctionPath.split('.');
		oDeepestNameSpaceLevel = window;
		var i;
		for(i = 0; i < aNameSpaceParts.length - 1; i++) {
			oDeepestNameSpaceLevel = oDeepestNameSpaceLevel[aNameSpaceParts[i]];
			if (!oDeepestNameSpaceLevel) {
				return undefined;
			}
		}
		sFunction = aNameSpaceParts[aNameSpaceParts.length - 1];
		return oDeepestNameSpaceLevel[sFunction];
	};
	/**
	* @description Checks whether a give string is a valid server guid: exactly 32 digits long and characters only from 0-9 or A-F
	* @param {string} guid
	* @returns {boolean}
	*/
	sap.apf.utils.isValidGuid = function(guid) {
		//noinspection JSLint
		return /^[0-9A-F]{32}$/.test(guid);
	};
	/**
	* @description Checks whether a give string is a valid server guid: exactly 32 digits long and characters only from 0-9 or A-F
	* @param {string} guid
	* @returns {boolean}
	*/
	sap.apf.utils.isValidPseudoGuid = function(guid) {
		//noinspection JSLint
		return /^[0-9A-F]{32}$/.test(guid);
	};
	/**
	* @description Creates a pseudo guid: exactly 32 digits long and created with the date and a random number
	* @param {number} len, length of guid to be created, default is 32
	* @returns {boolean}
	*/
	sap.apf.utils.createPseudoGuid = function(len) {
		if (!len && len !== 0) {
			len = 32;
		}
		var guid = Date.now().toString();
		var digitsToAdd = len - guid.length;
		guid += sap.apf.utils.createRandomNumberString(digitsToAdd);
		return guid;
	};
	/*
	 * returns a string of random numbers of a specified length
	 */
	sap.apf.utils.createRandomNumberString = function(len) {
		var result = "";
		var addOnLength, mathLen, randomNumberBetweenZeroAndOne;
		while (result.length < len) {
			addOnLength = Math.min(10, len - result.length);
			mathLen = Math.pow(10, addOnLength);
			randomNumberBetweenZeroAndOne = getRandomNumberBetweenZeroAndOne(new Date().getTime());
			result += Math.floor(randomNumberBetweenZeroAndOne * mathLen);
		}
		return result;
	};
	/**
	* @description Returns a random number between zero and one by hashing the input
	* @param {number, string} input, 
	* @returns {number}
	*/
	function getRandomNumberBetweenZeroAndOne(input) {
		saltCounterForPseudoGuidSeperation++;
		var randomNumber, randomNumberLen, randomNumberBetweenZeroAndOne;
		input = saltCounterForPseudoGuidSeperation.toString() + input.toString();
		randomNumber = sap.apf.utils.hashCode(input);
		randomNumberLen = randomNumber.toString().length;
		randomNumberBetweenZeroAndOne = randomNumber / Math.pow(10, randomNumberLen);
		return randomNumberBetweenZeroAndOne;
	}
	/**
	 * @description In old analytical configurations categories were assigned to step objects. To enable an individual sorting of steps beneath categories category objects have now step assignments
	 * @param {object} analyticalConfiguration - configuration to migrate, if needed
	 * @param {object} inject - inject logic 
	 * @param {object} inject.instances.messageHandler - constructor for messageHandler 
	 * @param {object} inject.constructors.HashTable - constructor for hashTable
	 */
	sap.apf.utils.migrateConfigToCategoryStepAssignment = function(analyticalConfiguration, inject) {
		var Hashtable = (inject.constructors && inject.constructors.Hashtable) || sap.apf.utils.Hashtable;
		var categoryStepAssignments = new Hashtable(inject.instances.messageHandler);
		if (analyticalConfiguration.steps) {
			analyticalConfiguration.steps.forEach(function(step) {
				if (step.categories) {
					step.categories.forEach(function(category) {
						var categoryStepAssignment = categoryStepAssignments.getItem(category.id);
						if (!categoryStepAssignment) {
							categoryStepAssignment = {
								category : category.id,
								steps : [ {
									type : "step",
									id : step.id
								} ]
							};
							categoryStepAssignments.setItem(category.id, categoryStepAssignment);
						} else {
							categoryStepAssignment.steps.push({
								type : "step",
								id : step.id
							});
						}
					});
					delete step.categories;
				}
			});
		}
		if (analyticalConfiguration.categories) {
			analyticalConfiguration.categories.forEach(function(category) {
				if (!category.steps) {
					var categoryStepAssignment = categoryStepAssignments.getItem(category.id);
					if (categoryStepAssignment) {
						category.steps = categoryStepAssignment.steps;
					} else {
						category.steps = [];
					}
				}
			});
		}
	};
	/**
	 * @description Execute a filter mapping via the given request by creating a disjunction for the given request result data records of conjunctions for the given target properties
	 * @param {sap.apf.utils.Filter} oInputFilter - Input filter for the mapping request
	 * @param {sap.apf.core.Request} oMappingRequest - Request used for the mapping
	 * @param {Array} aTargetProperties - Target properties for the mapping
	 * @param {Function} fnCallback(oMappedFilter) - callback function for the mapped filter
	 * @param {sap.apf.utils.Filter} fnCallback.oMappedFilter - Result of the filter mapping
	 * @param {sap.apf.core.MessageObject} fnCallback.oMessageObject - MessageObject in case of error
	 * @param {sap.apf.core.MessageHandler} oMessageHandler - Message handler
	*/
	sap.apf.utils.executeFilterMapping = function(oInputFilter, oMappingRequest, aTargetProperties, fnCallback, oMessageHandler) {
		oMappingRequest.sendGetInBatch(oInputFilter, callbackAfterMappingRequest);
		function callbackAfterMappingRequest(oResponse) {
			var oFilter;
			if (oResponse && oResponse.type && oResponse.type === "messageObject") {
				oMessageHandler.putMessage(oResponse); // technically logging
				fnCallback(undefined, oResponse);
			} else {
				oFilter = new sap.apf.core.utils.Filter(oMessageHandler);
				oResponse.data.forEach(function(oDataRecord) {
					var oFilterAnd = new sap.apf.core.utils.Filter(oMessageHandler);
					aTargetProperties.forEach(function(sTargetProperty) {
						oFilterAnd.addAnd(new sap.apf.core.utils.Filter(oMessageHandler, sTargetProperty, sap.apf.core.constants.FilterOperators.EQ, oDataRecord[sTargetProperty]));
					});
					oFilter.addOr(oFilterAnd);
				});
				fnCallback(oFilter, undefined);
			}
		}
	};
	/**
	 * gets the component name from a manifest. Either from sap.app/id or from sap.ui5/componentName
	 * @param {object} manifest
	 * @returns {string} componentName
	 */
	sap.apf.utils.getComponentNameFromManifest = function(manifest) {
		var name;
		if (manifest["sap.ui5"] && manifest["sap.ui5"].componentName) {
			name = manifest["sap.ui5"].componentName;
		} else {
			name = manifest["sap.app"].id;
		}
		if (name.search('Component') > -1) {
			return name;
		}
		return name + '.Component';
	};
	/**
	 * Gets a list of selected values and a list of available values and returns an object with a list of valid and invalid (selected) properties.
	 * Valid is the intersection of selectedValues and availableValues and invalid is the rest of the selectedValues
	 * @param {string []} selectedValues
	 * @param {string []} availableValues
	 * @returns {object} object with properties: {string []} valid, {string []} invalid
	 */
	sap.apf.utils.validateSelectedValues = function(selectedValues, availableValues) {
		var returnObject = {
			valid : [],
			invalid : []
		};
		if (!selectedValues || !jQuery.isArray(selectedValues) || selectedValues.length === 0) {
			return returnObject;
		}
		if (!availableValues || !jQuery.isArray(availableValues) || availableValues.length === 0) {
			returnObject.invalid = selectedValues;
			return returnObject;
		}
		selectedValues.forEach(function(selectedValue) {
			if (jQuery.inArray(selectedValue, availableValues) === -1) {
				returnObject.invalid.push(selectedValue);
			} else {
				returnObject.valid.push(selectedValue);
			}
		});
		return returnObject;
	};
	/**
	 * removes the server and port information from an url
	 * @param {string} url 
	 * @returns {string} urlWithoutProtocolServerPort
	 */
	sap.apf.utils.extractPathnameFromUrl = function(url) {
		var elementName = 'a';
		var pathname;
		var element = document.createElement(elementName);
		element.href = url;
		if (element.pathname) {
			pathname = element.pathname;
			if (pathname && pathname[0] !== '/') {
				pathname = '/' + pathname;
			}
			return pathname;
		}
		return url;
	};
	/**
	 * evaluates a error response of type odata 2.0 or 4.0 and returns the messages
	 * @param {string} response 
	 * @returns {string} errorMessage
	 */
	sap.apf.utils.extractOdataErrorResponse = function(response) {
		var responseObject;
		if (typeof response === 'string') {
			responseObject = JSON.parse(response);
		} else {
			responseObject = response;
		}
		var message = (responseObject && responseObject.error && responseObject.error.message && responseObject.error.message.value) || (responseObject && responseObject.error && responseObject.error.message && responseObject.error.message)
				|| response;
		if (responseObject && responseObject.error && responseObject.error.innererror && responseObject.error.innererror.errordetails) {
			message = message + '\n';
			responseObject.error.innererror.errordetails.forEach(function(detail) {
				message = message + detail.message + '\n';
			});
		} else if (responseObject && responseObject.error && responseObject.error.details) {
			message = message + '\n';
			responseObject.error.details.forEach(function(detail) {
				message = message + detail.message + '\n';
			});
		}
		return message;
	};
	/**
	 * Generic way to close dialogs
	 * @param {Object} dialog
	 */
	sap.apf.utils.checkAndCloseDialog = function(dialog) {
		if (dialog !== undefined) {
			if (dialog instanceof sap.m.ViewSettingsDialog) {
				dialog.destroy();
			} else if (dialog.isOpen()) {
				dialog.close();
			}
		}
	};
	/**
	 * convert a string value of format YYYYMMDD to javascript date object. Example value is 20121231
	 * @param {String} yearMonthDay
	 * @returns {Date} date
	 */
	sap.apf.utils.convertFiscalYearMonthDayToDateString = function(yearMonthDay) {
		
		var year = parseInt(yearMonthDay.substr(0,4), 10);
		var month = parseInt(yearMonthDay.substr(4,2), 10);
		var day = parseInt(yearMonthDay.substr(6,2), 10);
		//month january = 0, december = 11 !!!
		return new Date(year, month - 1, day).toDateString();
		
	};
}());
