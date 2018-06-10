/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */

/*global Promise */

// Provides control sap.ui.richtexteditor.ToolbarWrapper.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', './library', 'sap/ui/core/IconPool', 'sap/ui/core/Item'],
	function (jQuery, Control, library, IconPool, Item) {
		"use strict";


		/**
		 * Constructor for a new RichTextEditor's Custom Toolbar.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * The toolbar control is used to replace the default TinyMCE toolbar, with a custom one, built with SAPUI5 controls.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 *
		 * @constructor
		 * @private
		 * @alias sap.ui.richtexteditor.ToolbarWrapper
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var ToolbarWrapper = Control.extend("sap.ui.richtexteditor.ToolbarWrapper", /** @lends sap.ui.richtexteditor.ToolbarWrapper.prototype */ {
			metadata: {
				interfaces: [
					"sap.ui.richtexteditor.IToolbar"
				],
				library: "sap.ui.richtexteditor",
				aggregations: {
					/**
					 *  The Custom Toolbar control instance
					 */
					_toolbar: {type: "sap.m.OverflowToolbar", multiple: false, visibility: "hidden"},
					/**
					 * The custom insert image dialog for the Rich Text Editor
					 */
					_customInsertImageDialog: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"},
					/**
					 * The custom insert link dialog for the Rich Text Editor
					 */
					_customInsertLinkDialog: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"},
					/**
					 * The custom text color dialog for the Rich Text Editor
					 */
					_customTextColorDialog: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"},
					/**
					 * The custom background color dialog for the Rich Text Editor
					 */
					_customBackgroundColorDialog: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"},
					/**
					 * The custom insert table dialog for the Rich Text Editor
					 */
					_customInsertTableDialog: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"}
				},
				associations: {
					/**
					 * The RichTextEditor control to be linked to the Toolbar control.
					 */
					editor: {type: "sap.ui.richtexteditor.RichTextEditor", multiple: false}
				}
			}
		});

		ToolbarWrapper.prototype.init = function () {
			// This helper is defined within richtexteditor's library.js to provide loose coupling
			// with the controls in sap.m library
			this._helper = library.RichTextEditorHelper;
			this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.richtexteditor");
		};

		ToolbarWrapper.prototype.onBeforeRendering = function () {
			if (!this.getAggregation("_toolbar")) {
				this.setAggregation("_toolbar", this._createCustomToolbar());
				this.setAggregation("_customInsertImageDialog",
					this._helper.createDialog(this._createInsertImageConfig("InsertImage")));
				this.setAggregation("_customInsertLinkDialog",
					this._helper.createDialog(this._createInsertLinkConfig("InsertLink")));
				this.setAggregation("_customTextColorDialog",
					this._helper.createDialog(this._createColorDialogConfig("TextColor")));
				this.setAggregation("_customBackgroundColorDialog",
					this._helper.createDialog(this._createColorDialogConfig("BackgroundColor")));
				this.setAggregation("_customInsertTableDialog",
					this._helper.createDialog(this._createInsertTableConfig("InsertTable")));
			}
		};

		ToolbarWrapper.prototype.exit = function () {
			this._customButtons = null;
		};

		/**
		 * As the toolbar is not direct aggregation of RTE
		 * we should construct a stable ID for the "ancestor" elements.
		 *
		 * @private
		 */
		ToolbarWrapper.prototype._getId = function (sExtension) {
			this._getId.counter = this._getId.counter ? this._getId.counter + 1 : 1;

			var sRTEId = this.getEditor() ? this.getEditor().getId() : "_rte" + this._getId.counter,
				sToolbarId = this.getId(),
				aBuilder = [sRTEId + sToolbarId];

			if (sExtension || sExtension === 0) {
				aBuilder.push(sExtension);
			}

			return aBuilder.join("-");
		};

		/**
		 * Gets the RichTextEditor instance
		 */
		ToolbarWrapper.prototype.getEditor = function () {
			var sId = this.getAssociation("editor"),
				oEditor = sap.ui.getCore().byId(sId);

			return oEditor || null;
		};

		/**
		 * Helper function for extending the configuration of the TinyMCE for the Custom Toolbar
		 * @public
		 *
		 * @param {object} [oConfig] Configuration object to be extended
		 */
		ToolbarWrapper.prototype.modifyRTEToolbarConfig = function (oConfig) {
			var oToolbar = this;

			// Remove the native toolbar. From now on the sap.ui.richtexteditor.ToolbarWrapper will be used
			oConfig.toolbar = false;

			oConfig.setup = function (editor) {
				editor.on('init', function () {
					var oEditorCommands = library.EditorCommands;

					// execute the default font styles to ensure right synchronizing of the custom toolbar
					editor.execCommand("FontName", false, oEditorCommands["FontFamily"]["Verdana"].commandValue);
					editor.execCommand("FontSize", false, "8");
					editor.execCommand("JustifyLeft", false);
				});

				// Sync sap.ui.richtexteditor.ToolbarWrapper buttons with the editor
				editor.on('NodeChange', function () {
					oToolbar._syncToolbarStates(this);
				});
			};

			return oConfig;
		};

		/**
		 * Helper function for synchronizing the button states or selected items with the styles applied on the editor
		 * @private
		 * @param {object} [oNativeEditor] Editor Object
		 */
		ToolbarWrapper.prototype._syncToolbarStates = function (oNativeEditor) {
			var oEditorCommand, oControl, sEditorCommand,
				oEditorCommands = library.EditorCommands,
				oFormatter = oNativeEditor.formatter,
				_syncTextAlign = function (oTextAlignCommand, oEditorFormatter, oControl) {
					var sAlignCommand;

					for (sAlignCommand in oTextAlignCommand) {
						if (oTextAlignCommand.hasOwnProperty(sAlignCommand) && oEditorFormatter.match(oTextAlignCommand[sAlignCommand].style)) {
							if (oControl.getIcon() !== IconPool.getIconURI(oEditorCommand[sAlignCommand].icon)) {
								oControl.setIcon(IconPool.getIconURI(oEditorCommand[sAlignCommand].icon));
							} else {
								// Text Align commands in TinyMCE have a toggle behavior
								// when you set a certain command twice the default
								// command (text-align-left) will be applied
								oControl.setIcon(IconPool.getIconURI(oEditorCommand["Left"].icon));
							}
							break;
						}
					}
				},
				_syncTextFontFamily = function (oEditor, oFontFamilyCommand, oControl) {
					var sFontName, sCommandValue, sText,
						sFontNameCommandValue = oEditor.getDoc().queryCommandValue("FontName");

					// Synchronize the selected item of the Font Family Select with the applied font family style
					for (sFontName in oFontFamilyCommand) {
						if (!oFontFamilyCommand.hasOwnProperty(sFontName)) {
							break;
						}

						sCommandValue = oFontFamilyCommand[sFontName].commandValue.match(/\w+/g).join("").toLowerCase();
						sFontNameCommandValue = sFontNameCommandValue && sFontNameCommandValue.match(/\w+/g).join("").toLowerCase();
						sText = oFontFamilyCommand[sFontName].text.match(/\w+/g).join("").toLowerCase();

						if (sCommandValue === sFontNameCommandValue || sFontNameCommandValue === sText) {
							oControl.setSelectedItemId(oControl.getId() + sFontName);
							break;
						}
					}
				};

			for (sEditorCommand in oEditorCommands) {
				if (!oEditorCommands.hasOwnProperty(sEditorCommand)) {
					continue;
				}

				oEditorCommand = oEditorCommands[sEditorCommand];
				// TODO: Probably there's a better way to handle this
				oControl = sap.ui.getCore().byId(this._getId(sEditorCommand));

				if (!oControl) {
					continue;
				}

				if (sEditorCommand === "TextAlign") {
					// Synchronize the icon of the Text Align MenuButton with the applied text align style
					_syncTextAlign(oEditorCommand, oFormatter, oControl);

				} else if (sEditorCommand === "FontFamily") {
					_syncTextFontFamily(oNativeEditor, oEditorCommand, oControl);

				} else if (sEditorCommand === "FontSize" && oNativeEditor.getDoc().queryCommandValue(sEditorCommand)) {

					// queryCommandValue("FontSize") always returns empty string in FireFox - to be fixed
					// Synchronize the selected item of the Font Name Select with the applied font size style
					oControl.setSelectedItemId(oControl.getId() + oNativeEditor.getDoc().queryCommandValue(sEditorCommand));

				} else if (oControl.getMetadata().getName() === "sap.m.ToggleButton") {
					// Synchronize the pressed state of the ToggleButtons
						oControl.setPressed(oFormatter.match(oEditorCommand.style));
					}
				}
			};

		/**
		 * Helper function for creating Button Control configuration
		 * @private
		 * @param {string} [sCommand] Editor Command
		 */
		ToolbarWrapper.prototype._createButtonConfig = function (sCommand) {
			var oEditorCommands = library.EditorCommands,
				oCommand = oEditorCommands[sCommand],
				oRTE = this.getEditor();


			return {
				id: this._getId(sCommand),
				icon: IconPool.getIconURI(oCommand.icon),
				tooltip: this._oResourceBundle.getText(oCommand.bundleKey),
				press: function () {
					if (oRTE) {
						oRTE.getNativeApi().execCommand(oCommand.command);
					} else {
						jQuery.sap.log.warning("Cannot execute native command: " + oCommand.command);
					}
				}
			};
		};

		/**
		 * Helper function for creating MenuButtonItem Controls
		 * @private
		 * @param {string} [sCommand] Editor Command
		 */
		ToolbarWrapper.prototype._createMenuButtonItems = function (sCommand) {
			var oEditorHelper = this._helper,
				oEditorCommands = library.EditorCommands,
				aItems = [],
				oCommand;

			for (var sEditorCommand in oEditorCommands[sCommand]) {
				if (sEditorCommand === 'bundleKey') {
					continue;
				}

				oCommand = oEditorCommands[sCommand][sEditorCommand];
				aItems.push(oEditorHelper.createMenuItem(this._getId(sCommand + sEditorCommand), oCommand.text, IconPool.getIconURI(oCommand.icon)));
			}

			return aItems;
		};

		/**
		 * Helper function for creating SelectItem Controls for FontStyle Select
		 * @private
		 */
		ToolbarWrapper.prototype._createFontStyleSelectItems = function () {
			var oEditorCommands = library.EditorCommands,
				oFontFamilies = oEditorCommands["FontFamily"],
				aItems = [],
				oItem;

			for (var sFontStyle in oFontFamilies) {
				oItem = {
					id: this._getId("FontFamily" + sFontStyle),
					text: oFontFamilies[sFontStyle].text
				};

				aItems.push(new Item(oItem));
			}

			return aItems;
		};

		/**
		 * Helper function for finding the command value of a given font style command
		 * @param {string} [sItemText] Font Family
		 * @private
		 */
		ToolbarWrapper.prototype._getFontStyleCommand = function (sItemText) {
			var oEditorCommands = library.EditorCommands,
				oFontFamilies = oEditorCommands["FontFamily"];

			for (var sFontStyle in oFontFamilies) {
				if (oFontFamilies.hasOwnProperty(sFontStyle) && oFontFamilies[sFontStyle].text === sItemText) {
					return oFontFamilies[sFontStyle].commandValue;
				}
			}
		};

		/**
		 * Helper function for creating SelectItem Controls for FontSize Select
		 * @private
		 */
		ToolbarWrapper.prototype._createFontSizeSelectItems = function () {
			var aItems = [],
				number = 1, //TinyMCE command values for font sizes have a value from 1 to 7
				oItem,
				oEditorCommands = library.EditorCommands;

			oEditorCommands["FontSize"].forEach(function (item) {
				oItem = {
					id: this._getId("FontSize" + number),
					text: item + "pt"
				};
				aItems.push(new Item(oItem));
				number++;
			}, this);
			return aItems;
		};

		/**
		 * Helper function for getting the color style applied to a current node or at a certain carret position
		 * @param {string} [sCommand] The Editor Command
		 * @private
		 */
		ToolbarWrapper.prototype._getColor = function (sCommand) {
			var oRTE = this.getEditor(),
				oCommandStyle = library.EditorCommands[sCommand].style,
				oNode = oRTE.getNativeApi().selection.getNode(),
				aNodes = oRTE.getNativeApi().dom.getParents(oNode),
				i, aCurrentNode, sColor;

			for (i = 0; i < aNodes.length; i++) {
				aCurrentNode = aNodes[i];
				sColor = aCurrentNode.style[oCommandStyle];

				if (sColor && sColor != "") {
					return sColor;
				}
			}

			// If there is no color style found, return the default color
			return library.EditorCommands[sCommand].defaultValue;
		};

		/**
		 * Helper function for creating Button Control configuration for opening dialogs
		 * @private
		 * @param {string} [sCommand] Editor Command
		 */
		ToolbarWrapper.prototype._createButtonForDialog = function (sCommand) {
			var oCommand = library.EditorCommands[sCommand],
				oToolbar = this;

			if (!oCommand) {
				return;
			}

			return {
				id: this._getId(sCommand),
				icon: sap.ui.core.IconPool.getIconURI(oCommand.icon),
				tooltip: this._oResourceBundle.getText(oCommand.bundleKey),
				press: function () {
					// If the command is for background color or font color,
					// get the applied color and set it to the color picker
					if (sCommand.indexOf("Color") !== -1) {
						oToolbar.getAggregation("_custom" + sCommand + "Dialog")
								.getContent()[0]
								.setColorString(oToolbar._getColor(sCommand));
					}

					oToolbar.getAggregation("_custom" + sCommand + "Dialog").open();
				}
			};
		};

		/**
		 * Helper function for creating Color Dialog configuration
		 * @private
		 * @param {string} [sType] Type of color command.
		 */
		ToolbarWrapper.prototype._createColorDialogConfig = function(sType) {
			var oCommand = library.EditorCommands[sType],
				oEditorHelper = this._helper,
				oColorPicker = oEditorHelper.createColorPicker(),
				oRTE = this.getEditor(),
				oToolbar = this,
				aButtons = [];

				if (!oCommand) {
					return;
				}

				aButtons.push(oEditorHelper.createButton({
					id: this._getId("OKButton" + sType),
					text: "OK",
					press: function () {
						// If the same color is set twice the editor sets the default color,
						// so when the user tries to set the same color again,
						// we should not execute the command
						if (oToolbar._getColor(sType).replace(/,\s/g, ',') !== oColorPicker.getColorString()) {
							oRTE.getNativeApi().execCommand(oCommand.command, false, oColorPicker.Color.hex);
						}
						oToolbar.getAggregation("_custom" + sType + "Dialog").close();
					}
				}));

				aButtons.push(oEditorHelper.createButton({
					id: this._getId("cancelButton" + sType),
					text: "Cancel",
					press: function () {
						oToolbar.getAggregation("_custom" + sType + "Dialog").close();
					}
				}));

			return {
				contentWidth: '320px',
				title: oCommand.title,
				content: [oColorPicker],
				buttons: aButtons
			};
		};


		/**
		 * Helper function for generating image HTML content
		 * @private
		 */
		ToolbarWrapper.prototype._generateImageHTML = function(sURL, sText, sHeight, sWidth, bRatio) {
			var sURLAttr = sURL ? ' src="' + sURL + '"' : '',
				sAltAttr = sText ? ' alt="' + sText + '"' : '',
				sHeightAttr = sHeight ? ' height="' + sHeight + 'px"' : '',
				sWidthAttr = sWidth ? ' width="' + sHeight + 'px"' : '',
				sDimensions = sHeightAttr + sWidthAttr;

			if (bRatio) {
				sDimensions = sHeightAttr ? sHeightAttr : sWidthAttr;
			}

			return '<img' + sURLAttr + sAltAttr + sDimensions + '/>';

		};

		/**
		 * Helper function for creating InsertImage Dialog configuration
		 * @private
		 */
		ToolbarWrapper.prototype._createInsertImageConfig = function() {
			var oURLInput = this._helper.createInput(),
				oURLLabel = this._helper.createLabel({
					text: "Source URL",
					labelFor: oURLInput
				}),
				oTextInput = this._helper.createInput(),
				oTextLabel = this._helper.createLabel({
					text: "Image Description",
					labelFor: oTextInput
				}),
				oDimensionHeightInput = this._helper.createInput({
					width: '8rem',
					fieldWidth:"6rem",
					description: 'px'
				}),
				oTextDimensions = this._helper.createText({
					textAlign: "Center",
					width: '2rem',
					text: 'x'
				}),
				oDimensionWidthInput = this._helper.createInput({
					fieldWidth: "6rem",
					width: '8rem',
					description: 'px'
				}),
				oDimensionsFlexBox = this._helper.createHBox({
					wrap: "Wrap",
					alignItems: "Center",
					justifyContent: "SpaceBetween",
					items: [oDimensionHeightInput,
							oTextDimensions,
							oDimensionWidthInput]
				}),
				oDimensionsLabel = this._helper.createLabel({
					text: "Dimensions"
				}),
				oRatioCheckBox = this._helper.createCheckBox(),
				oRatioLabel = this._helper.createLabel({
					text: "Maintain Aspect Ratio",
					labelFor: oRatioCheckBox
				}),
				oRTE = this.getEditor(),
				oToolbar = this,
				aButtons = [];

				aButtons.push(this._helper.createButton({
					id: this._getId("InsertImageButton"),
					text: "Insert",
					press: function () {
						oRTE.getNativeApi()
							.insertContent(oToolbar._generateImageHTML(oURLInput.getValue(),
																		oTextInput.getValue(),
																		oDimensionHeightInput.getValue(),
																		oDimensionWidthInput.getValue(),
																		oRatioCheckBox.getSelected()));
						oToolbar.getAggregation("_customInsertImageDialog").close();
					}
				}));

				aButtons.push(this._helper.createButton({
					id: this._getId("CancelInsertImageButton"),
					text: "Cancel",
					press: function () {
						oToolbar.getAggregation("_customInsertImageDialog").close();
					}
				}));

				return {
					contentWidth: '320px',
					title: sap.ui.richtexteditor.EditorCommands["InsertImage"].title,
					buttons: aButtons,
					content: [
						oURLLabel,
						oURLInput,
						oTextLabel,
						oTextInput,
						oDimensionsLabel,
						oDimensionsFlexBox,
						oRatioCheckBox,
						oRatioLabel
					]
				};
		};

		/**
		 * Helper function for generating link HTML content
		 * @private
		 */
		ToolbarWrapper.prototype._generateLinkHTML = function (sURL, sText, sTitle, bTarget) {
			var sURLAttr = sURL ? ' href="' + sURL + '"' : '',
				sTitleAttr = sTitle ? ' title="' + sTitle + '"' : '',
				sTargetAttr = bTarget ? ' target="_blank"' : '';

			sText = sText ? sText : '';

			return '<a' + sURLAttr + sTitleAttr + sTargetAttr + '>' + sText + '</a>';
		};

		/**
		 * Helper function for creating InsertLink Dialog configuration
		 * @private
		 */
		ToolbarWrapper.prototype._createInsertLinkConfig = function() {
			var oURLInput = this._helper.createInput(),
				oURLLabel = this._helper.createLabel({
					text: "URL",
					labelFor: oURLInput
				}),
				oTextInput = this._helper.createInput(),
				oTextLabel = this._helper.createLabel({
					text: "Display Text",
					labelFor: oTextInput
				}),
				oTitleInput = this._helper.createInput(),
				oTitleLabel = this._helper.createLabel({
					text: "Title",
					labelFor: oTitleInput
				}),
				oTargetSelect = this._helper.createSelect({
					id: this._getId("InsertLinkSelect"),
					items: [
						new Item({
							id: this._getId("InsertLinkSelectNone"),
							text: "None"
						}),
						new Item({
							id: this._getId("InsertLinkSelectNewWindow"),
							text: "New Window"
						})
					]
				}),
				oTargetLabel = this._helper.createLabel({
					text: "Target",
					labelFor: oTargetSelect
				}),
				oTargetFlexBox = this._helper.createVBox({
					direction: "Column",
					alignItems: "Start",
					items: [oTargetLabel,
							oTargetSelect]
				}),
				oRTE = this.getEditor(),
				oToolbar = this,
				aButtons = [];

				aButtons.push(this._helper.createButton({
					id: this._getId("InsertLinkButton"),
					text: "Insert",
					press: function (oEvent) {
						var bTarget = oTargetSelect.getSelectedItem().getText() === "New Window" ? true : false;
						oRTE.getNativeApi()
							.insertContent(oToolbar._generateLinkHTML(oURLInput.getValue(),
																	oTextInput.getValue(),
																	oTitleInput.getValue(),
																	bTarget));
						oToolbar.getAggregation("_customInsertLinkDialog").close();
					}
				}));

				aButtons.push(this._helper.createButton({
					id: this._getId("CancelInsertLinkButton"),
					text: "Cancel",
					press: function () {
						oToolbar.getAggregation("_customInsertLinkDialog").close();
					}
				}));

				return {
					contentWidth: '320px',
					title: library.EditorCommands["InsertLink"].title,
					buttons: aButtons,
					content: [
						oURLLabel,
						oURLInput,
						oTextLabel,
						oTextInput,
						oTitleLabel,
						oTitleInput,
						oTargetFlexBox
					]
				};
		};

		/**
		 * Helper function for creating Insert Table Dialog configuration
		 * @private
		 */
		ToolbarWrapper.prototype._createInsertTableConfig = function() {
			var oRowsInput = this._helper.createStepInput({
					value: 2,
					min: 0,
					width: "50%"
				}),
				oRowsLabel = this._helper.createLabel({
					text: "Number of Rows:",
					labelFor: oRowsInput
				}),
				oColsInput = this._helper.createStepInput({
					value: 2,
					min: 0,
					width: "50%"
				}),
				oColsLabel = this._helper.createLabel({
					text: "Number of Cols:",
					labelFor: oColsInput
				}),
				oDimensionHeightInput = this._helper.createInput({
					width: '8rem',
					fieldWidth:"6rem",
					description: 'px'
				}),
				oTextDimensions = this._helper.createText({
					textAlign: "Center",
					width: '2rem',
					text: 'x'
				}),
				oDimensionWidthInput = this._helper.createInput({
					fieldWidth: "6rem",
					width: '8rem',
					description: 'px'
				}),
				oDimensionsFlexBox = this._helper.createHBox({
					wrap: "Wrap",
					alignItems: "Center",
					justifyContent: "SpaceBetween",
					items: [oDimensionHeightInput,
							oTextDimensions,
							oDimensionWidthInput]
				}),
				oDimensionsLabel = this._helper.createLabel({
					text: "Dimensions"
				}),
				oRTE = this.getEditor(),
				oToolbar = this,
				aButtons = [];

				aButtons.push(this._helper.createButton({
					id: this._getId("InsertTableButton"),
					text: "Insert",
					press: function () {
						var tableElm = oRTE.getNativeApi().plugins.table
											.insertTable(oRowsInput.getValue(), oColsInput.getValue()),
							dom = oRTE.getNativeApi().dom;

						dom.setStyle(tableElm, 'width', oDimensionWidthInput.getValue() + "px");
						dom.setStyle(tableElm, 'height', oDimensionHeightInput.getValue() + "px");

						oToolbar.getAggregation("_customInsertTableDialog").close();
					}
				}));

				aButtons.push(this._helper.createButton({
					id: this._getId("CancelInsertTableButton"),
					text: "Cancel",
					press: function () {
						oToolbar.getAggregation("_customInsertTableDialog").close();
					}
				}));

				return {
					title: sap.ui.richtexteditor.EditorCommands["InsertTable"].title,
					buttons: aButtons,
					content: this._helper.createVBox({
						direction: "Column",
						alignItems: "Start",
						items: [oRowsLabel,
								oRowsInput,
								oColsLabel,
								oColsInput,
								oDimensionsLabel,
								oDimensionsFlexBox]
						})
				};
		};

		/**
		 * Helper function for creating a sap.m.OverflowToolbar
		 * @private
		 */
		ToolbarWrapper.prototype._createCustomToolbar = function () {
			var oEditorHelper = this._helper,
				aContent = [],
				oButtonGroups = library.ButtonGroups;

			Object.keys(oButtonGroups).forEach(function (sGroupName) {
				aContent = aContent.concat(this.addButtonGroup(sGroupName));
			}, this);

			return oEditorHelper.createOverflowToolbar(this._getId(), aContent);
		};


		/**
		 * Hides/Shows button group
		 * @param {string} [sGroupName] Group name
		 * @param {boolean} [bShow] Indicates if the group should be shown or hidden
		 * @public
		 */
		ToolbarWrapper.prototype.setShowGroup = function (sGroupName, bShow) {
			var aObjects = this._findGroupedControls(sGroupName),
				oToolbar = this.getAggregation("_toolbar");

			aObjects.forEach(function (oObject) {
				oObject.setVisible(bShow);
			});

			oToolbar && oToolbar.rerender();
		};

		/**
		 * Adds a Button Group to the Custom Toolbar
		 * @param {string} [sGroupName] Group name
		 * @returns {Array}
		 *
		 * @public
		 */
		ToolbarWrapper.prototype.addButtonGroup = function (sGroupName) {
			var oRTE = this.getEditor(),
				oEditorHelper = this._helper,
				aContent = [],
				oButtonGroups = library.ButtonGroups,
				oCommands = library.EditorCommands,
				bVisibleGroupClipboard,
				bVisibleGroupStructure,
				bVisibleGroupFont,
				bVisibleGroupFontStyle,
				bVisibleGroupUndo,
				bVisibleGroupTextAlign,
				bVisibleGroupLink,
				bVisibleGroupInsert;


			switch (sGroupName) {
				case "font-style":
					bVisibleGroupFontStyle = oRTE ? oRTE.getShowGroupFontStyle() : false;

					oButtonGroups["font-style"].forEach(function (oCommand) {
						aContent.push(oEditorHelper.createToggleButton(this._createButtonConfig(oCommand)).setVisible(bVisibleGroupFontStyle));
					}, this);
					break;
				case "font":
					bVisibleGroupFont = oRTE ? oRTE.getShowGroupFont() : false;

					aContent.push(
						oEditorHelper.createSelect({
							id: this._getId("FontFamily"),
							items: this._createFontStyleSelectItems(),
							change: function (oEvent) {
								var oItem;

								if (oRTE) {
									oItem = oEvent.getSource().getSelectedItem();
									oRTE.getNativeApi().execCommand('FontName', false, this._getFontStyleCommand(oItem.getText()));
								} else {
									jQuery.sap.log.warning("Cannot execute native command: " + 'FontName');
								}
							}.bind(this)
						}).setVisible(bVisibleGroupFont)
					);
					aContent.push(
						oEditorHelper.createSelect({
							id: this._getId("FontSize"),
							items: this._createFontSizeSelectItems(),
							change: function (oEvent) {
								var oItem;

								if (oRTE) {
									oItem = oEvent.getSource().getSelectedItem();
									oRTE.getNativeApi().execCommand('FontSize', false, oItem.getText());
								} else {
									jQuery.sap.log.warning("Cannot execute native command: " + 'FontSize');
								}
							}
						}).setVisible(bVisibleGroupFont)
					);
					aContent.push(oEditorHelper.createButton(this._createButtonForDialog("TextColor")).setVisible(bVisibleGroupFont));
					aContent.push(oEditorHelper.createButton(this._createButtonForDialog("BackgroundColor")).setVisible(bVisibleGroupFont));
					break;
				case "text-align":
					bVisibleGroupTextAlign = oRTE ? oRTE.getShowGroupTextAlign() : false;
					var aMenuItems = this._createMenuButtonItems("TextAlign");
					aContent.push(
						oEditorHelper.createMenuButton(
							this._getId("TextAlign"),
							aMenuItems,
							function (oEvent) {
								var oSelectedItem;

								if (oRTE) {
									oSelectedItem = oEvent.getParameter("item");
									oRTE.getNativeApi().execCommand('Justify' + oSelectedItem.getText());
									this.getParent().setIcon(oSelectedItem.getIcon()); //  TODO: Check what is this?
								} else {
									jQuery.sap.log.warning("Cannot execute native command: " + 'Justify');
								}
							},
							aMenuItems[0].getIcon(),
							this._oResourceBundle.getText(oCommands["TextAlign"].bundleKey)
						).setVisible(bVisibleGroupTextAlign)
					);
					break;
				case "structure":
					bVisibleGroupStructure = oRTE ? oRTE.getShowGroupStructure() : false;
					oButtonGroups["structure"].forEach(function (oCommand) {
						aContent.push(oEditorHelper.createButton(this._createButtonConfig(oCommand)).setVisible(bVisibleGroupStructure));
					}, this);
					break;
				case "clipboard":
					bVisibleGroupClipboard = oRTE ? oRTE.getShowGroupClipboard() : false;
					oButtonGroups["clipboard"].forEach(function (oCommand) {
						aContent.push(oEditorHelper.createButton(this._createButtonConfig(oCommand)).setVisible(bVisibleGroupClipboard));
					}, this);
					break;
				case "undo":
					bVisibleGroupUndo = oRTE ? oRTE.getShowGroupUndo() : false;
					oButtonGroups["undo"].forEach(function (oCommand) {
						aContent.push(oEditorHelper.createButton(this._createButtonConfig(oCommand)).setVisible(bVisibleGroupUndo));
					}, this);
					break;
				case "insert":
					bVisibleGroupInsert = oRTE ? oRTE.getShowGroupInsert() : false;
					aContent.push(oEditorHelper.createButton(this._createButtonForDialog("InsertImage")).setVisible(bVisibleGroupInsert));
					break;
				case "link":
					bVisibleGroupLink = oRTE ? oRTE.getShowGroupLink() : false;
					aContent.push(oEditorHelper.createButton(this._createButtonForDialog("InsertLink")).setVisible(bVisibleGroupLink));
					aContent.push(oEditorHelper.createButton(this._createButtonConfig("Unlink")).setVisible(bVisibleGroupLink));
					break;
				case "table":
					aContent.push(oEditorHelper.createButton(this._createButtonForDialog("InsertTable")));
					break;
			}

			return aContent;
		};

		/**
		 * Adds a Button Group to an existing Toolbar
		 * @param {map} [mGroup] Group object
		 * @param {Boolean} [bFullGroup] If false the group is generated from a group name
		 *
		 * @public
		 */
		ToolbarWrapper.prototype.addButtonGroupToContent = function (mGroup, bFullGroup) {
			var sGroupName;
			// if the group is generated add it to the button groups object
			// as a custom group (if it contains supported group buttons - ex."table")
			if (!bFullGroup && mGroup.buttons[0] === "table") {
				sGroupName = mGroup.buttons[0];
				sap.ui.richtexteditor.ButtonGroups.custom[mGroup.name] = {
					name: mGroup.buttons[0],
					controls: ["InsertTable"]
				};
			}

			// if the group is supported (ex. "table") add it to the button groups object
			if (bFullGroup && mGroup.name === "table") {
				sGroupName = mGroup.name;
				sap.ui.richtexteditor.ButtonGroups[mGroup.name] = ["InsertTable"];
			}

			// if not supported return and do not add content
			if (!sap.ui.richtexteditor.ButtonGroups[mGroup.name] && !sap.ui.richtexteditor.ButtonGroups.custom[mGroup.name]) {
				return this;
			}

			var oToolbar = this.getAggregation("_toolbar"),
				aContent = this.addButtonGroup(sGroupName),
				iContentSize = aContent.length,
				i;

			for (i = 0; i < iContentSize; i += 1) {
				oToolbar.addContent(aContent[i]);
			}

			return this;
		};

		/**
		 * Removes a button group from the Custom Toolbar
		 * @param {string} [sGroupName] Group name
		 * @public
		 */
		ToolbarWrapper.prototype.removeButtonGroup = function (sGroupName) {
			var aObjects = this._findGroupedControls(sGroupName);

			aObjects.forEach(function (oObject) {
				oObject.destroy();
			});
		};

		/**
		 * Helper function for finding controls from a group
		 * @param {string} [sGroupName] Group name
		 * @private
		 */
		ToolbarWrapper.prototype._findGroupedControls = function (sGroupName) {
			var oButtonGroups = library.ButtonGroups,
				oToolbar = this.getAggregation("_toolbar"),
				aControls;

			if (!oToolbar) {
				return [];
			}

			aControls = oButtonGroups[sGroupName] ?
						oButtonGroups[sGroupName] :
						oButtonGroups.custom[sGroupName].controls;

			var aIds = aControls.map(function (sName) {
				return this._getId(sName);
			}, this);

			return oToolbar.findAggregatedObjects(false, function (oAggregatedObject) {
				return aIds.indexOf(oAggregatedObject.getId()) > -1;
			}) || [];
		};

		/**
		 * Extend Toolbar's content.
		 *
		 * Allows users to add/insert/find/remove/destroy custom buttons from the Toolbar
		 * without modifying the existing content.
		 * All custom buttons are appended to the end of the Toolbar.
		 * Every action is applied *only* on the custom buttons.
		 * For example "insert" with values (new sap.m.Button(), 1) would insert that Object as a second custom button.
		 * but not as a second in the whole Toolbar.
		 *
		 * @public
		 * @param sModifier {string} Action. This is the same as aggregations' prefixes e.g. *add*Aggregation, *destroy*Aggregation, etc.
		 * @returns {*}
		 */
		ToolbarWrapper.prototype.modifyToolbarContent = function (sModifier) {
			var vResult,
				args = Array.prototype.slice.call(arguments);

			args.shift();

			switch (sModifier) {
				case "add":
					vResult = this._proxyToolbarAdd.apply(this, args);
					break;

				case "destroy":
					vResult = this._proxyToolbarDestroy.apply(this, args);
					break;

				case "get":
					vResult = this._proxyToolbarGet.apply(this, args);
					break;

				case "indexOf":
					vResult = this._proxyToolbarIndexOf.apply(this, args);
					break;

				case "insert":
					vResult = this._proxyToolbarInsert.apply(this, args);
					break;

				case "removeAll":
					vResult = this._proxyToolbarRemoveAll.apply(this, args);
					break;

				case "remove":
					vResult = this._proxyToolbarRemove.apply(this, args);
					break;
			}

			return vResult;
		};

		ToolbarWrapper.prototype._updateCustomToolbarRefIds = function (sId, iInsertionIndex) {
			var aCustomButtonGroup, iItemGroupIndex;

			aCustomButtonGroup = this._customButtons || [];
			iItemGroupIndex = aCustomButtonGroup.indexOf(sId);
			if (iItemGroupIndex > -1) {
				aCustomButtonGroup.splice(iItemGroupIndex, 1);
			}

			if (iInsertionIndex !== -1) {
				iInsertionIndex = iInsertionIndex >= 0 && iInsertionIndex <= aCustomButtonGroup.length ?
					iInsertionIndex : aCustomButtonGroup.length;

				aCustomButtonGroup.splice(iInsertionIndex, 0, sId);
			}

			this._customButtons = aCustomButtonGroup;
		};

		ToolbarWrapper.prototype._proxyToolbarAdd = function (oItem) {
			var oToolbar = this.getAggregation("_toolbar"),
				vResult = oToolbar.addContent(oItem);

			oToolbar.rerender();

			if (vResult) {
				this._updateCustomToolbarRefIds(oItem.getId());
			}

			return vResult;
		};

		ToolbarWrapper.prototype._proxyToolbarGet = function () {
			var oToolbar = this.getAggregation("_toolbar"),
				aCustomButtonGroup = this._customButtons || [];

			return oToolbar.findAggregatedObjects(false, function (oAggregatedObject) {
					return aCustomButtonGroup.indexOf(oAggregatedObject.getId()) > -1;
				}) || [];
		};

		ToolbarWrapper.prototype._proxyToolbarDestroy = function () {
			var aItems = this._proxyToolbarGet();

			aItems.forEach(function (oItem) {
				oItem.destroy();
			});

			this._customButtons = [];
		};

		ToolbarWrapper.prototype._proxyToolbarIndexOf = function (vId) {
			var aCustomButtons = this._customButtons || [],
				sId = typeof vId === "object" ? vId.getId() : vId;

			return aCustomButtons.indexOf(sId);
		};

		ToolbarWrapper.prototype._proxyToolbarInsert = function (oItem, iIndex) {
			var vResult,
				oToolbar = this.getAggregation("_toolbar"),
				aToolbarContent = oToolbar.getContent() || [],
				aCustomButtons = this._customButtons || [],
				iCalculatedIndex = aToolbarContent.length - aCustomButtons.length; // Start the index right after the last not custom item.

			// Align with ManagedObject@insertAggregation
			if (iIndex < 0) { // Out of bounds
				iIndex = 0;
			} else if (iIndex > aCustomButtons.length) { // Out of bounds
				iIndex = aCustomButtons.length;
			} else if (!iIndex && iIndex !== 0) { // iIndex is not defined
				iIndex = aCustomButtons.length;
			}

			iCalculatedIndex += iIndex;

			vResult = oToolbar.insertContent(oItem, iCalculatedIndex);
			oToolbar.rerender();

			if (vResult) {
				this._updateCustomToolbarRefIds(oItem.getId(), iIndex);
			}

			return vResult;
		};

		ToolbarWrapper.prototype._proxyToolbarRemoveAll = function () {
			var aItems = this._proxyToolbarGet();

			aItems.forEach(this._proxyToolbarRemove, this);

			return aItems;
		};

		ToolbarWrapper.prototype._proxyToolbarRemove = function (vItem) {
			var sId, vResult,
				oToolbar = this.getAggregation("_toolbar");

			switch (typeof vItem) {
				case "string":
					sId = vItem;
					break;
				case "object":
					sId = vItem.getId();
					break;
				case "number":
					sId = this._customButtons[vItem];
					break;
			}

			vResult = oToolbar.removeContent(sId);

			if (vResult && sId) {
				this._updateCustomToolbarRefIds(sId, -1);
			}

			return vResult;
		};

		return ToolbarWrapper;
	}, /* bExport= */ true);
