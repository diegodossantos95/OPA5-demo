/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define([
	'sap/m/Button',
	'sap/m/ButtonType'
], function (Button, ButtonType) {
	"use strict";

	var Button = Button.extend("sap.fe.Action", {
		metadata: {
			properties: {
				actionName: "string",
				emphasized: 'boolean',
				mode: 'string',           // Inline / Isolated / ChangeSet
				multiplicityFrom: {
					type: "int"
				},
				multiplicityTo: {
					type: "int"
				}

			},
			events: {
				"callAction": {}
			}
		},

		onBeforeRendering: function () {
			if (this.getEmphasized()) {
				this.setType(ButtonType.Emphasized);
			}
		},

		onclick: function (evt) {
			this.fireCallAction({
				actionName: this.getActionName(),
				actionLabel: this.getText()
			});
		},

		renderer: {}
	});

	return Button;

}, /* bExport= */true);
