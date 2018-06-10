sap.ui.define([
    "sap/ui/comp/smartfilterbar/SmartFilterBar",
    "sap/m/SegmentedButton",
    "sap/m/SegmentedButtonItem"
], function(SmartFilterBar, SegmentedButton, SegmentedButtonItem) {
    "use strict";

	// Need to integrate with the existing smart filter bar integration with the SmartChart and SmartTable.
	// Since we have no control over changing the SmartFilterBar, SmartTable and SmartChart, and we need the
	//   SmartVisualFilterBar to integrate with the SmartChart and SmartTable, it makes sense to extend the SmartFilterBar to act as a fascade.
	//   This fascade will return the correct set of filters when in either Visual Filter mode or the standard Compact filter mode.
	var SmartFilterBarExt = SmartFilterBar.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt", {
		metadata: {
			events: {
				switchToVisualFilter: {}
			}
		},
		renderer: {}
	});

	SmartFilterBarExt.prototype.checkSearchAllowed = function(oState) {
		if (oState && oState.oSmartFilterbar) {
			var aAllFields = oState.oSmartFilterbar.determineMandatoryFilterItems(),
			oFilterData = oState.oSmartFilterbar.getFilterData(),
			oTemplatePrivate = oState.oController.getView().getModel("_templPriv"),
			bIsSearchAllowed = true;
			for (var i = 0; i < aAllFields.length; i++) {
				if (!oFilterData[aAllFields[i].getName()]) {
					// if any one mandatory field/parameters does not have data
					// since sFieldValue = "" when there is no value
					// hence ternary operator to return boolean
					bIsSearchAllowed = false;
					break;
				}
			}

			if (bIsSearchAllowed) {
				// if fields have values check whether they are valid or not
				// if all mandatory fields have data
				var oSearchAllowed = SmartFilterBar.prototype.verifySearchAllowed.apply(this, arguments);
				if (oSearchAllowed.hasOwnProperty("error") || oSearchAllowed.hasOwnProperty("mandatory")) {
					bIsSearchAllowed = false;
				}
			}

			oTemplatePrivate.setProperty("/alp/searchable", bIsSearchAllowed);
		}
	};
});