/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/model/base/ManagedObjectModel',
	'sap/ui/model/BindingMode', 'sap/m/Input', 'sap/m/Text', 'sap/ui/mdc/library'
], function(jQuery, Control, ManagedObjectModel, BindingMode, Input, Text, library) {
	"use strict";

	var DatePicker;
	var DateTimePicker;
	var TimePicker;
	var EditMode = library.EditMode;
	var FieldDisplay = library.FieldDisplay;

	/**
	 * Constructor for a new Field.
	 * A Field can be used to bind its value to data of certain data type. Based on the data type settings, a default
	 * visualization is done by the Field.
	 * The field publishes its properties to the content as a model <code>$field</code> to which the internal content can bind.
	 * This model is local to the content and cannot be used outside the fields context.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 *
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.core.IFormContent
	 *
	 * @author SAP SE
	 * @version 1.50.6
	 *
	 * @constructor
	 * @alias sap.ui.mdc.experimental.Field
	 * @author SAP SE
	 * @version 1.50.6
	 * @since 1.48.1
	 *
	 * @private
	 * @experimental
	 */
	var Field = Control.extend("sap.ui.mdc.experimental.Field", /* @lends sap.ui.mdc.Field.prototype */ {
		metadata: {
			interfaces: ["sap.ui.core.IFormContent"],
			library: "sap.ui.mdc",
			properties: {
				/**
				 * The value of the field
				 *
				 */
				value: {
					type: "any",
					defaultValue: null
				},
				/**
				 * the additional value of the field.
				 *
				 * Depending on the dataType this could be an description, a unit, a key....
				 */
				additionalValue: {
					type: "any",
					defaultValue: null
				},
				/**
				 * The datatype for the field visualization
				 */
				dataType: {
					type: "string",
					group: "Data",
					defaultValue: 'sap.ui.model.type.String'
				},

				dataTypeConstraints: {
					type: "object",
					group: "Data",
					defaultValue: null
				},

				dataTypeFormatOptions: {
					type: "object",
					group: "Data",
					defaultValue: null
				},

				/**
				 * The width of the field
				 */
				width: {
					type: "sap.ui.core.CSSSize",
					group: "Dimension",
					defaultValue: ""
				},

				/**
				 * Whether the field is editable.
				 */
				editMode: {
					type: "sap.ui.mdc.EditMode",
					group: "Data",
					defaultValue: EditMode.Editable
				},

				/**
				 * Whether the field is required.
				 * TODO: create a type FieldControl (auto, false, true) false might lead to error
				 */
				required: {
					type: "boolean",
					group: "Data",
					defaultValue: false
				},

				/**
				 * Icon to be displayed as graphical element before the field.
				 * This can be an image or an icon from the icon font.
				 */
				icon: {
					type: "sap.ui.core.URI",
					group: "Appearance",
					defaultValue: null
				},

				/**
				 * Defines whether the value and/or description of the field is shown.
				 */
				display: {
					type: "sap.ui.mdc.FieldDisplay",
					defaultValue: FieldDisplay.Value
				},

				/**
				 * Defines the horizontal alignment of the text that is shown inside the input field.
				 */
				textAlign: {
					type: "sap.ui.core.TextAlign",
					group: "Appearance",
					defaultValue: sap.ui.core.TextAlign.Initial
				},

				/**
				 * Defines the text directionality of the input field, e.g. <code>RTL</code>, <code>LTR</code>
				 */
				textDirection: {
					type: "sap.ui.core.TextDirection",
					group: "Appearance",
					defaultValue: sap.ui.core.TextDirection.Inherit
				},

				/**
				 * Defines a short hint intended to aid the user with data entry when the control has no value.
				 * If the value is null no placeholder is shown.
				 */
				placeholder: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Visualizes the validation state of the control, e.g. <code>Error</code>, <code>Warning</code>, <code>Success</code>.
				 */
				valueState: {
					type: "sap.ui.core.ValueState",
					group: "Appearance",
					defaultValue: sap.ui.core.ValueState.None
				},

				/**
				 * Defines the text that appears in the value state message pop-up. If this is not specified, a default text is shown from the resource bundle.
				 */
				valueStateText: {
					type: "string",
					group: "Misc",
					defaultValue: null
				}
			},
			events: {
//				/**
//				 * To be used to validate the value CTRL+K checks the values against the constraints.
//				 * This is also fired before a value is put to the data model
//				 */
//				validate: {
//
//				},
				/**
				 * This event is fired when the value property of the field is changed
				 *
				 * <b>Note</b> This event is only triggered if the used content control has a change event
				 */
				change: {
					parameters: {

						/**
						 * The new <code>value</code> of the <code>control</code>.
						 */
						value: { type: "string" },

						/**
						 * Flag indecates if the entered <code>value</code> is valid.
						 */
						valid: { type: "boolean" }
					}
				},
				/**
				 * This event is fired when the value of the field is changed - e.g. at each keypress
				 *
				 * <b>Note</b> This event is only triggered if the used content control has a liveChange event
				 */
				liveChange : {
					parameters : {
						/**
						 * The new value of the input.
						 */
						value : {type : "string"},

						/**
						 * Indicate that ESC key triggered the event.
						 * @since 1.48
						 */
						escPressed : {type : "boolean"},

						/**
						 * The value of the input before pressing ESC key.
						 * @since 1.48
						 */
						previousValue : {type : "string"}
					}
				},
				/**
				 * Change event if the value is the data changed successfully. If value is not data bound the event is
				 */
				dataChanged: {}
			},
			aggregations: {
				/**
				 * optional content to be bound to the value of the field
				 */
				content: {
					type: "sap.ui.core.Control",
					multiple: false
				},

				/**
				 * internal content if no control given
				 */
				_content: {
					type: "sap.ui.core.Control",
					multiple: false,
					visibility: "hidden"
				},

				/**
				 * optional FieldHelp
				 */
				fieldHelp: {
					type: "sap.ui.mdc.experimental.FieldHelpBase",
					multiple: false
				}
			},
			associations: {
				/**
				 * Association to controls / IDs that label this control (see WAI-ARIA attribute aria-labelledby).
				 */
				ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
			},
			publicMethods: [],
			defaultAggregation: "content",
			defaultProperty: "value"
		},
		_oManagedObjectModel: null
	});

	Field.prototype.init = function() {

		this._oManagedObjectModel = new ManagedObjectModel(this);

	};

	Field.prototype.exit = function() {

		this._oManagedObjectModel.destroy();
		delete this._oManagedObjectModel;

	};

	Field.prototype.onBeforeRendering = function() {

		// determine internal control
		_createInternalContent.call(this);

	};

	Field.prototype.setValue = function(vValue) {

		this.setProperty("value", vValue);

		_setAdditionalValueFromKey.call(this, vValue);

		return this;

	};

	Field.prototype.setDisplay = function(sDisplay) {

		this.setProperty("display", sDisplay);

		_setAdditionalValueFromKey.call(this, this.getValue());

		return this;

	};

	function _setAdditionalValueFromKey(sKey) {

		if (!this.isBound("additionalValue")) {
			var oFieldHelp = this.getFieldHelp();
			if (oFieldHelp && this.getDisplay() == sap.ui.mdc.FieldDisplay.Description) {
				var sAdditionalValue;
				if (sKey) {
					sAdditionalValue = oFieldHelp.getTextforKey(sKey);
				}
				this.setAdditionalValue(sAdditionalValue);
			}
		}

	}

	Field.formatText = _formatText;

	function _createInternalContent() {

		if (!this._getContent()) {
			var sEditMode = this.getEditMode();
			var sDataType = this.getDataType();
			var oControl;
			var sId = this.getId() + "-inner";

			switch (sEditMode) {
				case EditMode.Display:
					switch (sDataType) {
						case "Edm.Date":
						case "Edm.DateTimeOffset":
						case "Edm.TimeOfDay":
							oControl = new Text(sId, {
								text: { path: "$field>value", type: this._getDataType() },
								textAlign: "{$field>textAlign}",
								textDirection: "{$field>textDirection}",
								wrapping: false
							});
							break;

						default:
							oControl = new Text(sId, {
								text: { parts: [{ path: "$field>value" }, { path: "$field>additionalValue" }, { path: "$field>display" }], formatter: _formatText },
								textAlign: "{$field>textAlign}",
								textDirection: "{$field>textDirection}",
								wrapping: false
							});
							break;
					}
					break;

				default:
					switch (sDataType) {
						case "Edm.Date":
							oControl = _createDatePicker.call(this, sId);
							break;

						case "Edm.DateTimeOffset":
							oControl = _createDateTimePicker.call(this, sId);
							break;

						case "Edm.TimeOfDay":
							oControl = _createTimePicker.call(this, sId);
							break;

						default:
							var sPath = "$field>value";
							if (this.getDisplay() == sap.ui.mdc.FieldDisplay.Description) {
								sPath = "$field>additionalValue";
							}
							oControl = new Input(sId, {
//								value: "{$field>value}",
								value: {path: sPath},
								placeholder: "{$field>placeholder}",
								textAlign: "{$field>textAlign}",
								textDirection: "{$field>textDirection}",
								required: "{$field>required}",
								editable: { path: "$field>editMode", formatter: _getEditable },
								enabled: { path: "$field>editMode", formatter: _getEnabled },
								valueState: "{$field>valueState}", // TODO: own ValueState handling?
								valueStateText: "{$field>valueStateText}",
								showValueHelp: !!this.getFieldHelp(),
								change: _handleContentChange.bind(this),
								liveChange: _handleContentLiveChange.bind(this),
								valueHelpRequest: _handleValueHelpRequest.bind(this)
							});
							break;
					}
					break;
			}

			if (oControl) {
				this.setAggregation("_content", oControl, true);
				_setModelOnContent.call(this, oControl);
			}
		}

	}

	Field.prototype._getContent = function() {

		return this.getContent() || this.getAggregation("_content");

	};

	function _getEditable(sEditMode) {

		if (sEditMode && sEditMode == EditMode.Editable) {
			return true;
		} else {
			return false;
		}

	}

	function _getEnabled(sEditMode) {

		if (sEditMode && sEditMode != EditMode.Disabled) {
			return true;
		} else {
			return false;
		}

	}

	function _formatText(sValue, sAdditionalValue, sDisplay) {
		//format the values in align with UX
		var sFormattedValue = sValue ? sValue : "";//may be changed to -
		var sFormattedAdditionalValue = sAdditionalValue ? sAdditionalValue : "";//may be changed to -

		var sFormattedText = "";

		switch (sDisplay) {
			case FieldDisplay.Description:
				sFormattedText = sFormattedAdditionalValue;
				break;
			case FieldDisplay.ValueDescription:
				sFormattedText = sFormattedValue + " (" + sFormattedAdditionalValue + ")";
				break;
			case FieldDisplay.DescriptionValue:
				sFormattedText = sFormattedAdditionalValue + " (" + sFormattedValue + ")";
				break;
			default: // Value
				sFormattedText = sFormattedValue;
		}

		//remove empty brakets
		if (sFormattedText.replace) {
			sFormattedText = sFormattedText.replace(" ()", "");
		}

		return sFormattedText;

	}

	// function _formatDate(oDate) {

	// 	if (oDate instanceof Date) {
	// 		if (!this._oDateFormat) {
	// 			var fnDateFormat = sap.ui.require("sap/ui/model/type/Date");
	// 			if (fnDateFormat) {
	// 				_createDateFormat.call(this, fnDateFormat);
	// 			} else {
	// 				this._oDate = oDate;
	// 				sap.ui.require(["sap/ui/model/type/Date"], _createDateFormat.bind(this));
	// 			}
	// 		}
	// 		if (this._oDateFormat) {
	// 			return this._oDateFormat.format(oDate);
	// 		} else {
	// 			return oDate;
	// 		}
	// 	} else {
	// 		return oDate;
	// 	}

	// }

	// function _createDateFormat(DateFormat) {
	// 	this._oDateFormat = sap.ui.core.format.DateFormat.getInstance();
	// 	if (this._oDate) {
	// 		// format date async
	// 		var oControl = this.getAggregation("_content");
	// 		oControl.setText(this._oDateFormat.format(this._oDate));
	// 		delete this._oDate;
	// 	}
	// }

	function _createDatePickerControl(DatePicker, sId) {

		var oDatePicker = new DatePicker(sId, {
			value: { path: "$field>value", type: this._getDataType() },
			placeholder: "{$field>placeholder}",
			textAlign: "{$field>textAlign}",
			textDirection: "{$field>textDirection}",
			required: "{$field>required}",
			editable: { path: "$field>editMode", formatter: _getEditable },
			enabled: { path: "$field>editMode", formatter: _getEnabled },
			valueState: "{$field>valueState}", // TODO: own ValueState handling?
			valueStateText: "{$field>valueStateText}",
			width: "100%",
			change: _handleContentChange.bind(this)
		});

		return oDatePicker;

	}

	function _createDatePickerAsync(DatePicker) {

		var sId = this.getId() + "-inner";
		var oDatePicker = _createDatePickerControl.call(this, DatePicker, sId);

		this.setAggregation("_content", oDatePicker);
		_setModelOnContent.call(this, oDatePicker);

	}

	function _createDatePicker(sId) {

		if (!DatePicker) {
			DatePicker = sap.ui.require("sap/m/DatePicker");
			if (!DatePicker) {
				sap.ui.require(["sap/m/DatePicker"], _createDatePickerAsync.bind(this));
				return null;
			}
		}

		return _createDatePickerControl.call(this, DatePicker, sId);

	}


	function _createDateTimePicker(sId) {

		if (!DateTimePicker) {
			DateTimePicker = sap.ui.require("sap/m/DateTimePicker");
			if (!DateTimePicker) {
				sap.ui.require(["sap/m/DateTimePicker"], _createDatePickerAsync.bind(this));
				return null;
			}
		}

		return _createDatePickerControl.call(this, DateTimePicker, sId);

	}

	function _createTimePicker(sId) {

		if (!TimePicker) {
			TimePicker = sap.ui.require("sap/m/TimePicker");
			if (!TimePicker) {
				sap.ui.require(["sap/m/TimePicker"], _createDatePickerAsync.bind(this));
				return null;
			}
		}

		return _createDatePickerControl.call(this, TimePicker, sId);

	}

	function _setModelOnContent(oContent) {
		oContent.setModel(this._oManagedObjectModel, "$field");
		oContent.bindElement({ path: "/", model: "$field" });
	}

	Field.prototype.setEditMode = function(sEditMode) {

		var sOldEditMode = this.getEditMode();

		if (sOldEditMode != sEditMode) {
			if (this.getAggregation("_content")) {
				this.destroyAggregation("_content");
			}
			this.setProperty("editMode", sEditMode);
			_createInternalContent.call(this);
		}

		return this;

	};

	Field.prototype.setContent = function(oContent) {

		var oOldContent = this.getContent();
		if (oOldContent) {
			oOldContent.unbindElement("$field");
			if (oOldContent.getMetadata().getEvents().change) {
				// oldContent has change event -> detach handler
				oOldContent.detachEvent("change", _handleContentChange, this);
			}
			if (oOldContent.getMetadata().getEvents().liveChange) {
				// oldContent has liveChange event -> detach handler
				oOldContent.detachEvent("liveChange", _handleContentLiveChange, this);
			}
		}

		if (this.getAggregation("_content")) {
			this.destroyAggregation("_content");
		}

		this.setAggregation("content", oContent);

		if (oContent) {
			_setModelOnContent.call(this, oContent);
			if (oContent.getMetadata().getEvents().change) {
				// content has change event -> attach handler
				oContent.attachEvent("change", _handleContentChange, this);
			}
			if (oContent.getMetadata().getEvents().liveChange) {
				// content has liveChange event -> attach handler
				oContent.attachEvent("liveChange", _handleContentLiveChange, this);
			}
		} else {
			// internal control needed
			_createInternalContent.call(this);
		}

		return this;

	};

	Field.prototype.destroyContent = function() {

		var oOldContent = this.getContent();
		if (oOldContent) {
			oOldContent.unbindElement("$field");
			if (oOldContent.getMetadata().getEvents().change) {
				// oldContent has change event -> detach handler
				oOldContent.detachEvent("change", _handleContentChange, this);
			}
		}

		this.destroyAggregation("content");

		// internal control needed
		_createInternalContent.call(this);

		return this;

	};

	Field.prototype.setFieldHelp = function(oFieldHelp) {

		var oOldFieldHelp = this.getFieldHelp();
		if (oOldFieldHelp) {
			oOldFieldHelp.detachEvent("select", _handleFieldHelpSelect, this);
			oOldFieldHelp.detachEvent("navigate", _handleFieldHelpNavigate, this);
			oOldFieldHelp.detachEvent("dataUpdate", _handleDataUpdate, this);
		}

		this.setAggregation("fieldHelp", oFieldHelp);

		if (oFieldHelp) {
			oFieldHelp.attachEvent("select", _handleFieldHelpSelect, this);
			oFieldHelp.attachEvent("navigate", _handleFieldHelpNavigate, this);
			oFieldHelp.attachEvent("dataUpdate", _handleDataUpdate, this);
			_setAdditionalValueFromKey.call(this, this.getValue());
		}

		// toggle valueHelp icon on internal Input
		var oContent = this.getAggregation("_content");
		if (oContent && oContent.setShowValueHelp) {
			oContent.setShowValueHelp(!!oFieldHelp);
		}

		return this;

	};

	Field.prototype.destroyFieldHelp = function() {

		var oOldFieldHelp = this.getFieldHelp();
		if (oOldFieldHelp) {
			oOldFieldHelp.detachEvent("select", _handleFieldHelpSelect, this);
			oOldFieldHelp.detachEvent("navigate", _handleFieldHelpNavigate, this);
		}

		this.destroyAggregation("fieldHelp");

		// hide valueHelp icon on internal Input
		var oContent = this.getAggregation("_content");
		if (oContent && oContent.setShowValueHelp) {
			oContent.setShowValueHelp(false);
		}

		return this;

	};

	Field.prototype.getIdForLabel = function() {

		var sId;
		var oContent = this._getContent();
		if (oContent) {
			sId = oContent.getId();
		} else {
			sId = this.getId();
		}

		return sId;

	};

	function _handleContentChange(oEvent) {

		var vValue;
		var bValid = true;

		if ("value" in oEvent.getParameters()) {
			vValue = oEvent.getParameter("value");
		} else {
			vValue = this.getValue();
		}

		if ("valid" in oEvent.getParameters()) {
			bValid = oEvent.getParameter("valid");
		}

		var oFieldHelp = this.getFieldHelp();
		if (oFieldHelp) {
			oFieldHelp.close();
			if (this.getDisplay() == sap.ui.mdc.FieldDisplay.Description) {
				// value is used as key -> use selected item
				vValue = oFieldHelp.getSelectedKey();
			}
		}

		this.fireChange({ value: vValue, valid: bValid });

	}

	function _handleContentLiveChange(oEvent) {

		var vValue;
		var vPreviousValue;
		var bEscPressed = false;

		if ("value" in oEvent.getParameters()) {
			vValue = oEvent.getParameter("value");
		}

		if ("escPressed" in oEvent.getParameters()) {
			bEscPressed = oEvent.getParameter("escPressed");
		}

		if ("previousValue" in oEvent.getParameters()) {
			vPreviousValue = oEvent.getParameter("previousValue");
		} else {
			vPreviousValue = this.getValue();
		}

		var oFieldHelp = this.getFieldHelp();
		if (oFieldHelp) {
			oFieldHelp.setFilterValue(vValue);
			if (this.getDisplay() == sap.ui.mdc.FieldDisplay.Description) {
				// value is used as key -> while suggestion no item is selected
				oFieldHelp.setSelectedKey("");
			}
			if (oFieldHelp.openByTyping()) {
				oFieldHelp.open();
			}
		}

		this.fireLiveChange({ value: vValue, escPressed: bEscPressed, previousValue: vPreviousValue});

	}

	Field.prototype.getFocusDomRef = function() {

		var oContent = this._getContent();

		if (oContent) {
			return oContent.getFocusDomRef();
		} else {
			return this.getDomRef();
		}

	};

	Field.prototype.setDataType = function(vValue) {
		delete this._oDataType;
		this.setProperty("dataType", vValue, true);
	};

	Field.mapEdmTypes = {
		"Edm.Boolean": "sap.ui.model.odata.type.Boolean",
		"Edm.Byte": "sap.ui.model.odata.type.Byte",
		"Edm.Date": "sap.ui.model.odata.type.Date", // V4 Date
		"Edm.DateTime": "sap.ui.model.odata.type.DateTime", // only for V2  constraints: {displayFormat: 'Date' }
		"Edm.DateTimeOffset": "sap.ui.model.odata.type.DateTimeOffset", //constraints: { V4: true, precision: n }
		"Edm.Decimal": "sap.ui.model.odata.type.Decimal", //constraints: { precision, scale, minimum, maximum, minimumExclusive, maximumExclusive}
		"Edm.Double": "sap.ui.model.odata.type.Double",
		"Edm.Float": "sap.ui.model.odata.type.Single",
		"Edm.Guid": "sap.ui.model.odata.type.Guid",
		"Edm.Int16": "sap.ui.model.odata.type.Int16",
		"Edm.Int32": "sap.ui.model.odata.type.Int32",
		"Edm.Int64": "sap.ui.model.odata.type.Int64",
		//Edm.Raw not supported
		"Edm.SByte": "sap.ui.model.odata.type.SByte",
		"Edm.Single": "sap.ui.model.odata.type.Single",
		"Edm.String": "sap.ui.model.odata.type.String", //constraints: {maxLength, isDigitSequence}
		"Edm.Time": "sap.ui.model.odata.type.Time", // only V2
		"Edm.TimeOfDay": "sap.ui.model.odata.type.TimeOfDay" // V4 constraints: {precision}
	};

	Field.prototype._createDataType = function(sType) {
		var OTypeClass = jQuery.sap.getObject(sType);
		if (!OTypeClass) {
			var sNewType = Field.mapEdmTypes[sType];
			if (!sNewType) {
				jQuery.sap.log.error("Field", "dataType for " + sType + " can not be created!");
				return null;
			}
			return this._createDataType(sNewType);
		}
		return new OTypeClass(this.getDataTypeFormatOptions(), this.getDataTypeConstraints());
	};

	Field.prototype._getDataType = function(sType) {
		if (!this._oDataType) {
			this._oDataType = this.getProperty("dataType");
			if (typeof this._oDataType === "string") {
				this._oDataType = this._createDataType(this._oDataType);
			}
		}
		return this._oDataType;
	};

	/*
	 * If Field is inside of a Form use Forms aria logic for label
	 */
	Field.prototype.enhanceAccessibilityState = function(oElement, mAriaProps) {

		var oParent = this.getParent();

		if (oParent && oParent.enhanceAccessibilityState) {
			// use Field as control, but aria proprties of rendered inner control.
			oParent.enhanceAccessibilityState(this, mAriaProps);
		}

	};

	Field.prototype.onsapup = function(oEvent) {

		var oFieldHelp = this.getFieldHelp();

		if (oFieldHelp) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
			oFieldHelp.navigate(-1);
		}

	};

	Field.prototype.onsapdown = function(oEvent) {

		var oFieldHelp = this.getFieldHelp();

		if (oFieldHelp) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
			oFieldHelp.navigate(1);
		}

	};

	function _handleValueHelpRequest(oEvent) {

		var oFieldHelp = this.getFieldHelp();

		if (oFieldHelp) {
			oFieldHelp.setFilterValue("");
			oFieldHelp.toggleOpen();

			if (this.getDisplay() == sap.ui.mdc.FieldDisplay.Description) {
				// value is used as key
				oFieldHelp.setSelectedKey(this.getValue());
			}
//
//			if (oFieldHelp.getFocusOnField()) {
//				this.focus();
//			}
		}

	}

	function _handleFieldHelpSelect(oEvent) {

		var sValue = oEvent.getParameter("value");
		var sAdditionalValue = oEvent.getParameter("additionalValue");
		var sKey = oEvent.getParameter("key");
		var sNewValue;
		var sNewAdditionalValue;

		if (this.getDisplay() == sap.ui.mdc.FieldDisplay.Description) {
			// value is used as key
			sNewValue = sKey;
			sNewAdditionalValue = sValue;
		} else {
			sNewValue = sValue;
			sNewAdditionalValue = sAdditionalValue;
		}

		this.setProperty("value", sNewValue);
		this.setAdditionalValue(sNewAdditionalValue);
		this.fireChange({value: sNewValue, valid: true});

	}

	function _handleFieldHelpNavigate(oEvent) {

		var sValue = oEvent.getParameter("value");
//		var sAdditionalValue = oEvent.getParameter("additionalValue");
		var sKey = oEvent.getParameter("key");
		var sNewValue;
//		var sNewAdditionalValue;

		if (this.getDisplay() == sap.ui.mdc.FieldDisplay.Description) {
			// value is used as key
			sNewValue = sKey;
//			sNewAdditionalValue = sValue;
		} else {
			sNewValue = sValue;
//			sNewAdditionalValue = sAdditionalValue;
		}
//TODO: API on Input to update value without property????
		var oContent = this.getAggregation("_content");
		if (oContent && oContent._$input) {
			oContent._$input.val(sValue);
			oContent._doSelect();
		}

		this.fireLiveChange({value: sNewValue});

	}

	function _handleDataUpdate() {

		_setAdditionalValueFromKey.call(this, this.getValue());

	}

	return Field;

}, /* bExport= */ true);
