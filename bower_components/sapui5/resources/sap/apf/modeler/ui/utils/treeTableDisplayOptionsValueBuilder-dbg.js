jQuery.sap.declare('sap.apf.modeler.ui.utils.treeTableDisplayOptionsValueBuilder');
jQuery.sap.require("sap.apf.modeler.ui.utils.displayOptionsValueBuilder");
(function() {
	"use strict";
	sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder = function(oTextReader, oOptionsValueModelBuilder) {
		sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder.apply(this, [ oTextReader, oOptionsValueModelBuilder ]);
	};
	sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder.prototype = Object.create(sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder.prototype);
	sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder.prototype.constructor = sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder;
	sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder.prototype.getLabelDisplayOptions = function() {
		var aLabelDisplayOptionTypes = [ {
			key : "key",
			name : this.oTextReader("key")
		}, {
			key : "text",
			name : this.oTextReader("text")
		} ];
		return this.oOptionsValueModelBuilder.prepareModel(aLabelDisplayOptionTypes, aLabelDisplayOptionTypes.length);
	};
	sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder.prototype.getValidatedLabelDisplayOptions = function() {
		var oTextManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
		var aLabelDisplayOptionTypes = [ {
			key : "key",
			name : this.oTextReader("key")
		}, {
			key : oTextManipulator.addPrefixText([ "text" ], this.oTextReader)[0],
			name : oTextManipulator.addPrefixText([ this.oTextReader("text") ], this.oTextReader)[0]
		} ];
		return this.oOptionsValueModelBuilder.prepareModel(aLabelDisplayOptionTypes, aLabelDisplayOptionTypes.length);
	};
}());
