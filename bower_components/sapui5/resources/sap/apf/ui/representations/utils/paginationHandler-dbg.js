/* SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.utils.paginationHandler");
(function() {
	'use strict';
	sap.apf.ui.representations.utils.PaginationHandler = function() {
		this.pagingOption = { // initialize the paging option 
			top : 100,
			skip : 0
		};
	};
	sap.apf.ui.representations.utils.PaginationHandler.prototype.constructor = sap.apf.ui.representations.utils.PaginationHandler;
	function _updatePagingOption(oTableDataModel) { //update the top and skip value in the paging option 
		this.pagingOption.skip = oTableDataModel.getData().tableData.length; //the number of records which is already fetched , which have to be skipped
		this.pagingOption.top = 99; //later on 99 records are fetched and added to existing data set. 
	}
	/**
	* @description updates the data in the table after pagination. The updated data is retrieved from the request.
	* The count for data to be fetched and to be skipped is updated after the pagination is triggered.
	*/
	function _triggerPagination(oTableInstance) {
		var oTableDataModel = oTableInstance.oTableRepresentation.getModel();
		var paginatedTableData = oTableDataModel.getData();
		oTableInstance.oTableRepresentation.getParent().setBusy(true); //set the scroll container to busy state
		sap.ui.getCore().applyChanges();
		_updatePagingOption.bind(this)(oTableDataModel);
		var oActiveStep = oTableInstance.oApi.getActiveStep();
		oTableInstance.oApi.updatePath(function(oStep, bStepChanged) {
			if (oStep === oActiveStep) {
				oTableDataModel.setData(paginatedTableData);
				oTableInstance.markSelectionInTable();
				oTableInstance.oTableRepresentation.getParent().setBusy(false);
			}
		});
	}
	function isPaginationRequired(oTableInstance) {
		if (this.pagingOption.skip < oTableInstance.nDataResponseCount) {
			return true;
		}
	}
	function _createLoadMoreLink(oTableInstance) {
		var oLoadMoreLink = new sap.m.Link({ // load more link should be shown for the mobile devices
			text : "More"
		}).addStyleClass("loadMoreLink");
		if (isPaginationRequired.bind(this)(oTableInstance)) {// Add More Button for Mobile Device for
			_appendLoadMoreLinkToTable(oLoadMoreLink);
		}
		return oLoadMoreLink;
	}
	function _appendLoadMoreLinkToTable(loadMoreLink) {
		var oLoadMoreLink, htmlOfLoadMoreLink;
		if (loadMoreLink) {
			oLoadMoreLink = loadMoreLink;
			htmlOfLoadMoreLink = sap.ui.getCore().getRenderManager().getHTML(oLoadMoreLink);
		}
		jQuery(".loadMoreLink").remove();//clear the more link
		jQuery(jQuery(".tableRepresentation > div:first-child")).append(htmlOfLoadMoreLink);
	}
	function _isLastRecordForMobile(oTableInstance) {
		if (!jQuery(".openToggleImage").length && isPaginationRequired.bind(this)(oTableInstance)) {
			return true;
		}
	}
	function _firePaginationOnMobileDevice(oTableInstance, oLoadMoreLink) {
		if (_isLastRecordForMobile.bind(this)(oTableInstance)) {
			_triggerPagination.bind(this)(oTableInstance);
			if (isPaginationRequired.bind(this)(oTableInstance)) {
				_appendLoadMoreLinkToTable(oLoadMoreLink);
			} else {
				jQuery(".loadMoreLink").remove();
			}
		}
	}
	/**
	* @description creates the load more link and appends it below the table after 100 records.
	* Handles the click on the "load more data" and triggers the pagination.
	*/
	function _attachPaginationInMobileDevice(oTableInstance) {
		var self = this;
		var oLoadMoreLink = _createLoadMoreLink.bind(self)(oTableInstance);
		oLoadMoreLink.attachPress(function() {
			_firePaginationOnMobileDevice.bind(self)(oTableInstance, oLoadMoreLink);
		});
	}
	function _isLastRecordForDesktop(oTableInstance, oScrollContainer) {
		var contentHeight = jQuery(oScrollContainer).prop("scrollHeight") - jQuery(oScrollContainer).prop("offsetHeight") - 5;
		var scrollHeight = jQuery(oScrollContainer).prop("scrollTop");
		if ((contentHeight <= scrollHeight) && !jQuery(".openToggleImage").length && isPaginationRequired.bind(this)(oTableInstance)) { //if scroll is at the end and there is more data
			return true;
		}
	}
	function _firePaginationOnDesktop(oTableInstance, oScrollContainer) {
		if (_isLastRecordForDesktop.bind(this)(oTableInstance, oScrollContainer)) {
			_triggerPagination.bind(this)(oTableInstance);
		}
	}
	/**
	* @description Handles the scroll on the table to get more and triggers the pagination.
	*/
	function _attachPaginationInDesktopDevice(oTableInstance) {
		var self = this;
		jQuery('.sapUiTableVSb').on("scroll", function() {// Mouse scroll, Mouse Down and Mouse Up Events for desktop
			_firePaginationOnDesktop.bind(self)(oTableInstance, this);
		});
	}
	/**
	* @method attachPaginationOnTable
	* @description attaches the pagination event on the table after rendering and also triggeres the pagination based on the scroll height.
	* i.e. event should be triggered only when data is being scrolled at the end.
	* Also updates the data in the table after pagination.
	*/
	sap.apf.ui.representations.utils.PaginationHandler.prototype.attachPaginationOnTable = function(oTableInstance) {
		if (sap.ui.Device.system.desktop) {
			_attachPaginationInDesktopDevice.bind(this)(oTableInstance);
		} else {
			_attachPaginationInMobileDevice.bind(this)(oTableInstance);
		}
	};
	/**
	* @method getPagingOption
	* @param topN- the number of records which has to be fetched. It is configured for a step.
	* @description creates the paging option of the request which has the number of records to fetched and records to be skipped.
	* @returns paging object which has top and skip.
	*       e.g. pagingOption = {
	*                       top : 99,
	*                       skip :100,
	*                       inlineCount :true
	*                      } 
	*/
	sap.apf.ui.representations.utils.PaginationHandler.prototype.getPagingOption = function(topN) {
		var top, skip;
		if (topN) { //in case top N is configured , whole data has to be fetched
			top = topN;
			skip = 0;
		} else if (this.pagingOption.top !== 100 && this.pagingOption.skip !== 0) { //else the value of the data to be fetched and skipped has to be according to pagination/ initial data fetching
			top = this.pagingOption.top;
			skip = this.pagingOption.skip;
		} else { // when the data is being fetched for the first time
			top = 100;
			skip = 0;
		}
		this.pagingOption = { //update the paging option
			inlineCount : topN ? false : true,
			top : top,
			skip : skip
		};
		return this.pagingOption;
	};
	/**
	* @method resetPaginationOption
	* @description Resets the paging option to default when there filter change in the path
	*/
	sap.apf.ui.representations.utils.PaginationHandler.prototype.resetPaginationOption = function() {
		this.pagingOption = { //update the paging option
			top : 100,
			skip : 0
		};
	};
}());