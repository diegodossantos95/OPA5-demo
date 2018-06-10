/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");
jQuery.sap.declare('sap.apf.modeler.ui.utils.displayOptionsValueBuilder');
(function() {
	'use strict';
	sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder = function(oTextReader, oOptionsValueModelBuilder) {
		this.oTextReader = oTextReader;
		this.oOptionsValueModelBuilder = oOptionsValueModelBuilder;
	};
	sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder.prototype.constructor = sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder;
	sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder.prototype.getLabelDisplayOptions = function() {
		var aLabelDisplayOptionTypes = [ {
			key : "key",
			name : this.oTextReader("key")
		}, {
			key : "text",
			name : this.oTextReader("text")
		}, {
			key : "keyAndText",
			name : this.oTextReader("keyAndText")
		} ];
		return this.oOptionsValueModelBuilder.prepareModel(aLabelDisplayOptionTypes, aLabelDisplayOptionTypes.length);
	};
	sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder.prototype.getValidatedLabelDisplayOptions = function() {
		var oTextManipulator = new sap.apf.modeler.ui.utils.TextManipulator();
		var aLabelDisplayOptionTypes = [ {
			key : "key",
			name : this.oTextReader("key")
		}, {
			key : oTextManipulator.addPrefixText([ "text" ], this.oTextReader)[0],
			name : oTextManipulator.addPrefixText([ this.oTextReader("text") ], this.oTextReader)[0]
		}, {
			key : oTextManipulator.addPrefixText([ "keyAndText" ], this.oTextReader)[0],
			name : oTextManipulator.addPrefixText([ this.oTextReader("keyAndText") ], this.oTextReader)[0]
		} ];
		return this.oOptionsValueModelBuilder.prepareModel(aLabelDisplayOptionTypes, aLabelDisplayOptionTypes.length);
	};
})();