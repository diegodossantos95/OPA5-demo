/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function() {
	'use strict';
	var oSelectedRepresentation, oViewSettingDialog;
	/**
		* Creates the sort option for the representation.      
		* @description sets the selected sort item on the view setting dialog. Selects the first property in case the default property has to be selected
		*/
	function _selectSortItemOnViewSettingDialog() {
		var oSelectedSortItem = {}, isDescending;
		//TODO: Unify ascending/descending
		if (oSelectedRepresentation.orderby && oSelectedRepresentation.orderby.length && oSelectedRepresentation.orderby[0].descending !== undefined) {
			isDescending = oSelectedRepresentation.orderby[0].descending;
		} else if (oSelectedRepresentation.orderby && oSelectedRepresentation.orderby.length) {
			isDescending = !oSelectedRepresentation.orderby[0].ascending;
		}
		if (oSelectedRepresentation.orderby && oSelectedRepresentation.orderby.length > 1) { //More than one sorting criterium in config
			oSelectedSortItem = undefined;
		} else if(oSelectedRepresentation.orderby && oSelectedRepresentation.orderby.length == 1) { //One sorting criterium in config
			oSelectedSortItem = oSelectedRepresentation.orderby[0].property;
		} else {
			oSelectedSortItem = undefined; //No sorting criterium in config
			isDescending = false;
		}
		oViewSettingDialog.setSortDescending(isDescending);
		oViewSettingDialog.setSelectedSortItem(oSelectedSortItem);
	}
	function _bIsSortoptionChanged(oSortEvent) {
		var property;
		if(oSortEvent.getParameters().sortItem && oSortEvent.getParameters().sortItem.getKey()){
			property = oSortEvent.getParameters().sortItem.getKey();
		} else {
			return false;
		}
		var oCurrSortOption = {
				property : property, // read the sort property and sort order
				descending : oSortEvent.getParameters().sortDescending
		};
		var oPrevSortOption = {
			property : oViewSettingDialog._oPreviousState.sortItem ? oViewSettingDialog._oPreviousState.sortItem.getKey() : undefined,
			descending : oViewSettingDialog._oPreviousState.sortDescending
		};
		if (oPrevSortOption.property === oCurrSortOption.property && oPrevSortOption.descending === oCurrSortOption.descending) {
			return false;
		}
		return true;
	}
	sap.ui.controller("sap.apf.ui.reuse.controller.viewSetting", {
		/**
		* @method onInit - lifecycle event 
		* @description reads the selected representation and alternate representation (if any) from the view data.
		* Also sets the sort property and sort order on the view setting dialog
		*/
		onInit : function() {
			var oController = this;
			oViewSettingDialog = oController.getView().getContent()[0];
			oSelectedRepresentation = oController.getView().getViewData().oTableInstance;
			_selectSortItemOnViewSettingDialog(); //select the first sort item in case orderby is not available or the previous selected property should be retained (if any)
		},
		/**
		* @method handleConfirmForSort
		* @description handler for the sort property change on press of ok in view setting dialog.
		* Reads the sort property from the event and sorts the data in the table as well as in alternate representation
		*/
		handleConfirmForSort : function(oSortEvent) {
			if (!_bIsSortoptionChanged(oSortEvent)) {
				return;
			}
			oSelectedRepresentation.oApi.selectionChanged(true);
		},
		/**
		* @method handleCancel
		* @description handler for the sort property change on press of cancel in view setting dialog.
		* Cancels the sort dialog
		*/
		handleCancel : function(oSortEvent) {
			oViewSettingDialog.destroy();
			oSelectedRepresentation.oViewSettingDialog = undefined;
		}
	});
}());