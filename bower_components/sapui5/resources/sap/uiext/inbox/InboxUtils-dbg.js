/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
// Utility functions for Inbox
/*global URI */// declare unusual global vars for JSLint/SAPUI5 validation
jQuery.sap.declare("sap.uiext.inbox.InboxUtils");

jQuery.sap.require("sap.ui.model.odata.Filter");
jQuery.sap.require("sap.uiext.inbox.InboxConstants");


sap.uiext.inbox.InboxUtils = function(){
	throw new Error();
};

sap.uiext.inbox.InboxUtils._getCategoryFilter = function(sValue) {
	return new sap.ui.model.Filter("TaskDefinitionData/Category", sap.ui.model.FilterOperator.EQ, sValue);
};

sap.uiext.inbox.InboxUtils._getStatusFilters = function(sValue) {
	return new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, sValue);
};


sap.uiext.inbox.InboxUtils._getPriorityFilters = function(sValue) {
	return new sap.ui.model.Filter("Priority", sap.ui.model.FilterOperator.EQ, sValue);
};


sap.uiext.inbox.InboxUtils._getDueDateFilters = function(sValue) {
		var fromDate = new Date(0);
		var formD = undefined;
		switch(sValue){
			case "Today":
				formD = this._getFormattedDueDateTimeOff(1);
				break;
			case "Next_7_days":
				formD = this._getFormattedDueDateTimeOff(7);
				break;
			case "Next_15_days":
				formD = this._getFormattedDueDateTimeOff(15);
				break;
			case "Next_30_days":
				formD = this._getFormattedDueDateTimeOff(30);
				break;
			case "No_Due_Date":
				return new sap.ui.model.Filter("CompletionDeadLine", sap.ui.model.FilterOperator.EQ, null);
		}
		return new sap.ui.model.odata.Filter("CompletionDeadLine", [{operator:sap.ui.model.FilterOperator.LE, value1: formD.toUTCString()},{operator:sap.ui.model.FilterOperator.GE, value1:fromDate.toUTCString()}], true);
};

sap.uiext.inbox.InboxUtils._getDateTimeFilters = function(sValue) {
	var formD = undefined;
	switch(sValue){
		case "Today":
			formD = this._getFormattedDateTimeOff(0, false);
			break;
		case "Last_7_days":
			formD = this._getFormattedDateTimeOff(7, false);
			break;
		case "Last_15_days":
			formD = this._getFormattedDateTimeOff(15, false);
			break;
		case "Last_30_days":
			formD = this._getFormattedDateTimeOff(30, false);
			break;
	}
	return new sap.ui.model.Filter("CreatedOn", sap.ui.model.FilterOperator.GE, formD.toUTCString());
};


//TODO: Inbox should use these utility methods.
sap.uiext.inbox.InboxUtils._getFormattedDueDateTimeOff = function(subT) {
  var myDate = new Date();
  myDate.setDate(myDate.getDate() + subT);
  myDate.setMinutes(0);
  myDate.setHours(0);
  myDate.setSeconds(0);
  return myDate;
};


sap.uiext.inbox.InboxUtils._getFormattedDateTimeOff = function(subT, isNow) {
	var myDate = new Date();
	myDate.setDate(myDate.getDate() - subT);
	if(!isNow){
		myDate.setMinutes(0);
		myDate.setHours(0);
		myDate.setSeconds(0);
	}
	return myDate;
};

sap.uiext.inbox.InboxUtils.inArray = function (key, mapArray){
	var index = -1;
	jQuery.each(mapArray, function(i, map) {
		if(map[key] === key){
			index = i; 
			return false;
		}
	});
	return index;
};

sap.uiext.inbox.InboxUtils._dateFormat = function(dateValue) {
	if (dateValue != undefined && typeof (dateValue) == 'string' && dateValue != "") {
		var date;
		if (dateValue.indexOf('Date') != -1) {
			date = new Date();
			date.setTime(dateValue.substring((dateValue.indexOf("(") + 1), dateValue.indexOf(")")));
		} else {
			date = new Date(dateValue.substring((dateValue.indexOf("'") + 1), dateValue.length - 1));
		}
		dateValue = date;
	}

	if (dateValue != undefined && dateValue != "") {
		var ins = sap.ui.core.format.DateFormat.getDateInstance({
			style : "medium"
		});
		return ins.format(dateValue);
	}
		//FOR Time Zone Support, do not forget to add timeoffset property in inbox control.
		/*var utc = Date.UTC(dateValue.getUTCFullYear(),dateValue.getUTCMonth(),dateValue.getUTCDate(),dateValue.getUTCHours(),dateValue.getUTCMinutes(),dateValue.getUTCSeconds(),dateValue.getUTCMilliseconds())
		var inboxInstance = this;
		while(inboxInstance != undefined && !(inboxInstance instanceof sap.uiext.inbox.Inbox))
		{
			inboxInstance = inboxInstance.getParent();
		}
		var localTime =  utc + inboxInstance.getTimezoneOffset() + (new Date().getTimezoneOffset()*60*1000);
		var ins = sap.ui.core.format.DateFormat.getDateTimeInstance({
			style : "medium"
		});
		return ins.format(new Date(localTime));*/
	return "";
};


sap.uiext.inbox.InboxUtils.scrub = function(data) {
	data = decodeURIComponent(data);
	data = data.replace(/[-:.\/]/g, "");
	data = data.replace(/-/g, "--");
	data = data.replace(/\s+/g, "-");
	if(!(/^([A-Za-z_][-A-Za-z0-9_.:]*)$/.test(data)))
	{
		if( /^[^A-Za-z_]/.test(data)){
			data = data.replace(/^[^A-Za-z_]/, "_");
		}
		data.replace(/[^-\w_.:]/g, "_");
	}
	return data;
};

sap.uiext.inbox.InboxUtils.setCookieValue = function(cookieName, value, expireInYears) {
	var sExpires ="";
	if(expireInYears && expireInYears > 0){
		var oExpireDate = new Date();
		oExpireDate.setTime(oExpireDate.getTime() + (3600 * 1000 * 24 * 365 * expireInYears));
		sExpires = "expires=" + oExpireDate.toGMTString();
	}
    document.cookie = cookieName + "=" + escape(value) + "; " + sExpires;
};

sap.uiext.inbox.InboxUtils.getCookieValue = function(cookieName) {
    var i, x, y, aCookies = document.cookie.split(";");
    for (i = 0; i < aCookies.length; i++) {
                    x = aCookies[i].substr(0, aCookies[i].indexOf("="));
                    y = aCookies[i].substr(aCookies[i].indexOf("=") + 1);
                    x = x.replace(/^\s+|\s+$/g, "");
                    if (x == (cookieName)) {
                                    return unescape(y);
                    }
    }
};

sap.uiext.inbox.InboxUtils.deleteCookie = function(cookieName) {
    var d = new Date();
    document.cookie = cookieName + "=" + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
};

sap.uiext.inbox.InboxUtils.reselectRowsinTable = function(reselectIndices,tableElement){
	var iMin = reselectIndices[0];
	for ( var i = 0; i < reselectIndices.length; i++) {
		tableElement.addSelectionInterval(reselectIndices[i],reselectIndices[i]);
		iMin = Math.min(reselectIndices[i], iMin);
	}
	if(iMin){
		var iFocusRow = Math.floor(iMin/10) * 10;
		tableElement.setFirstVisibleRow(iFocusRow);
	}
};

sap.uiext.inbox.InboxUtils.deSelectOtherActionButtonsinStreamView = function(oToggleButtonElem){
	var oToggleButtonParentRow = oToggleButtonElem.getParent().getParent();
	if(oToggleButtonParentRow){
		var oParentRowCells = oToggleButtonParentRow.getCells();
		var iNumberOfCells = oParentRowCells.length;
		 for(var i=0; i < iNumberOfCells; i++){
			 var oActionToggleButton = oParentRowCells[i].getContent()[0];
			 if(oActionToggleButton && oActionToggleButton !== oToggleButtonElem && oActionToggleButton instanceof sap.ui.commons.ToggleButton){
				 if(oActionToggleButton.getVisible() && oActionToggleButton.getPressed()){
					 oActionToggleButton.setPressed(false);
					 oActionToggleButton.firePress(false);
				 }
			 }
		 }
	}
};

sap.uiext.inbox.InboxUtils._getDefaultFilter = function(){
	return new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.NE, 'COMPLETED');
};

sap.uiext.inbox.InboxUtils._hasFilter = function(aFilters, sPath, sOperator, oValue1, oValue2) {
	var bFilterPathFound = false;
	if(aFilters && aFilters.length > 0){
		//group filters by path
		jQuery.each(aFilters, function(j, oFilter) {
			if (oFilter.sPath === sPath && oFilter.sOperator === sOperator && oFilter.oValue1 === oValue1 && oFilter.oValue2 === oValue2) {
				bFilterPathFound = true;
				return false;
			} 
		});
	}
	return bFilterPathFound;
};


sap.uiext.inbox.InboxUtils.tooltipFormatForDateTime = function(dateValue) {
    if (dateValue != undefined && typeof (dateValue) == 'string' && dateValue != "") {
        var date;
        if (dateValue.indexOf('Date') != -1) {
            date = new Date();
            date.setTime(dateValue.substring((dateValue.indexOf("(") + 1), dateValue.indexOf(")")));
        } else {
            date = new Date(dateValue.substring((dateValue.indexOf("'") + 1), dateValue.length - 1));
        }
        dateValue = date;
    }

    if (dateValue != undefined && dateValue != "") {
        var ins = sap.ui.core.format.DateFormat.getDateTimeInstance({
            style : "full"
        });
        return ins.format(dateValue);
    }       
    return "";

};

sap.uiext.inbox.InboxUtils.dateTimeFormat = function(dateValue, bShowOnlyDate) {
    if (dateValue != undefined && typeof (dateValue) == 'string' && dateValue != "") {
        var date;
        if (dateValue.indexOf('Date') != -1) {
            date = new Date();
            date.setTime(dateValue.substring((dateValue.indexOf("(") + 1), dateValue.indexOf(")")));
        } else {
            date = new Date(dateValue.substring((dateValue.indexOf("'") + 1), dateValue.length - 1));
        }
        dateValue = date;
    }

    if (dateValue != undefined && dateValue != "") {
        var ins = sap.ui.core.format.DateFormat.getDateInstance({
            style : "medium"
        });
        var ins2 = sap.ui.core.format.DateFormat.getTimeInstance({
            style : "short"
        });
        
        if (bShowOnlyDate && bShowOnlyDate === true)
        	return ins.format(dateValue);
        else
        	return ins.format(dateValue) + " " + ins2.format(dateValue);
    }       
    return "";

};

sap.uiext.inbox.InboxUtils._isOverDue = function(value) { //TODO: Remove Duplication already exists in Inbox
	//need to be overrriddedn in app for different timezones
	if(value === undefined || value === null || value === "")
		return false;
	
	var now = new Date().getTime();
	var bOverdue;
	
	if ( typeof (value) === 'string' ) {
		 var sCreationdate = value.substring(value.indexOf("(")+1, value.indexOf(")")-1);
		
		 bOverdue = (parseInt(sCreationdate) - now) < 0 ? true : false;
	}
	else {
		 bOverdue = (value.getTime() - now) < 0 ? true : false;
	}
	return bOverdue;
};

sap.uiext.inbox.InboxUtils.getUserMediaResourceURL = function(bpmSvcUrl, sapOrigin, user) {
	return bpmSvcUrl +"/"+ sap.uiext.inbox.InboxConstants.UserInfoCollection+ "("+sap.uiext.inbox.InboxConstants.sapOrigin+"='"+sapOrigin+"',UniqueName='"+user+"')/$value";
};


/* this function below takes a list of multiple arrays as input and returns an array after intersection.
 * the arrays that need to be intersected, must be put in to an another array aLists
 */
sap.uiext.inbox.InboxUtils._getUniqueArray = function(aLists) {
	
	function intersection(aArray1, aArray2) {
		var results = [];
		var i, j;
		var arr1Length = aArray1.length;
		var arr2Length = aArray2.length;

		for (i = 0; i < arr1Length; i++) {
			for (j = 0; j < arr2Length; j++) {
				if (aArray1[i] === aArray2[j]) {
					results.push(aArray1[i]);
				}
			}
		}
		return results;
	}
	
	if (aLists.length == 0) return [];
	else if (aLists.length == 1) return aLists[0];
	var aIntersection = aLists[0];
	for (var i = 1; i < aLists.length; i++){
	    aIntersection = intersection(aIntersection, aLists[i]);
	}
	return aIntersection;
};

sap.uiext.inbox.InboxUtils._getFileTypeIcon = function(sFileType) {
	var sIcon;
	switch (sFileType)
	  {
	  case "text/plain":
	    sIcon="attachment-text-file";
	    break;
	  case "image/jpeg":
	  case "image/png":
	  case "image/gif":
	  case "image/x-icon":
		sIcon="attachment-photo";
	    break;
	  case "application/pdf":
		sIcon="pdf-attachment";
	    break;
	  case "application/mspowerpoint":
	  case "application/vnd.ms-powerpoint":
	  case "application/powerpoint":
	  case "application/x-mspowerpoint":
		sIcon="ppt-attachment";
	    break;
	  case "application/excel":
	  case "application/x-excel":
	  case "application/x-msexcel":
	  case "application/vnd.ms-excel":
		sIcon="excel-attachment";
	    break;
	  case "application/msword":
		sIcon="doc-attachment";
	    break;
	  case "application/zip":
		sIcon="attachment-zip-file";
	    break;
	  default:
		sIcon="document";
	  }
	return sap.ui.core.IconPool.getIconURI(sIcon);
};

sap.uiext.inbox.InboxUtils._getFileSize = function(iBytes) {
	if(iBytes) {
		
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (iBytes == 0) return '0 Byte';
		var i = parseInt(Math.floor(Math.log(iBytes) / Math.log(1024)));
		var iSize;
		if (i>1) {
			iSize = (iBytes / Math.pow(1024, i)).toFixed(2);
		} else {
			iSize = Math.round(iBytes / Math.pow(1024, i), 2); 
		}
		var sSize = iSize.toString() + ' ' + sizes[i];
		   
		return sSize;
		   
	}
};


sap.uiext.inbox.InboxUtils.appendThemingParameters = function(windowURL,sTaskExecutionThemeURL) {
	var oURI = new URI(windowURL);
	var sWindowURLParams = oURI.search();
	oURI.search( (!sWindowURLParams ? "?" : (sWindowURLParams + "&")) + sTaskExecutionThemeURL.replace (/^(\?|&)/, ''));
	return oURI.toString();
	
};

//We can segregate Util functions into different files based on what they provide Utility functions for. 
sap.uiext.inbox.InboxUtils.calculateLengthofAssociativeArray = function(oAssociativeArray) {
	var iLength = 0, key;
    for (key in oAssociativeArray) {
        if (oAssociativeArray.hasOwnProperty(key)) iLength++;
    }
    return iLength;
};

sap.uiext.inbox.InboxUtils.getErrorMessageFromODataErrorObject = function(oError) {
	var sMessage = "";
	var sBodyValue = "";
	if(oError.hasOwnProperty("response")) {
		try{
			sBodyValue = JSON.parse(oError.response.body)
		} 
		catch(err){
			sMessage=err.name + " : " + err.message;
			console.log(err.stack);
			return sMessage;
		}
		sMessage = sBodyValue.error.message.value+"\n";
	}
	return sMessage;
}