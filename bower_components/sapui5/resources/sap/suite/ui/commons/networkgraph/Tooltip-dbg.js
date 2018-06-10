sap.ui.define([
	"jquery.sap.global",
	"./SvgBase",
	"./Line",
	"./Node",
	"./Group",
	"sap/m/Popover",
	"sap/m/List",
	"sap/m/OverflowToolbar",
	"sap/m/PlacementType",
	"sap/m/Button",
	"sap/m/CustomListItem",
	"sap/m/FlexBox",
	"sap/m/HBox",
	"sap/m/IconTabBar",
	"sap/m/IconTabFilter",
	"sap/m/Panel",
	"sap/m/StandardListItem",
	"sap/m/Text",
	"sap/m/ToolbarSpacer",
	"sap/ui/core/Icon",
	"sap/m/FlexItemData",
	"sap/ui/core/library"
], function (jQuery, SvgBase, Line, Node, Group, Popover, List, OverflowToolbar, PlacementType, Button,
			 CustomListItem, FlexBox, HBox, IconTabBar, IconTabFilter, Panel, StandardListItem, Text, ToolbarSpacer,
			 Icon, FlexItemData, CoreLibrary) {

	var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");

	var Tooltip = SvgBase.extend("sap.suite.ui.commons.networkgraph.Tooltip", {
		metadata: {
			library: "sap.suite.ui.commons",
			events: {
				/**
				 * Fired after tooltip windows is opened.
				 */
				afterOpen: {},
				afterClose: {}
			}
		}
	});

	Tooltip.prototype.init = function () {
		// popover control for displaying content
		this._oPopover = null;

		// element opening this tooltop (node, group, line)
		this._oElement = null;
	};

	/* =========================================================== */
	/* Public methods */
	/* =========================================================== */
	Tooltip.prototype.create = function (oParent) {
		this._oPopover = new Popover(this.getId() + "-tooltip", {
			showHeader: false,
			placement: this.getParent()._bIsRtl ? PlacementType.PreferredLeftOrFlip : PlacementType.PreferredRightOrFlip,
			afterOpen: function () {
				this.fireAfterOpen();
			}.bind(this),
			afterClose: function () {
				this.fireAfterClose();
			}.bind(this),
			beforeOpen: function () {
				this._fnCreate();
			}.bind(this),
			contentMinWidth: "350px"
		}).addStyleClass("sapSuiteUiCommonsNetworkTooltip");

		this.addDependent(this._oPopover);

		// this fixes position of popover to top
		this._oPopover._afterAdjustPositionAndArrowHook = function () {
			var $arrow = this.$("arrow"),
				iTop = this.$().position().top,
				iArrowTop = $arrow.position().top,
				ARROW_POS = 15,
				iWindowHeight = jQuery(window).height(),
				iNewPos = iTop + iArrowTop - ARROW_POS;

			if (iWindowHeight > iNewPos + this.$().height()) {
				$arrow.css("top", ARROW_POS);
				this.$().css("top", iNewPos);
			}
		};
	};

	Tooltip.prototype.instantClose = function () {
		this._oPopover.oPopup.close(0);
	};

	Tooltip.prototype.close = function () {
		this._oPopover.close();
	};

	Tooltip.prototype.openDetail = function (mArguments) {
		this._fnCreate = this._createDetail;
		this._oElement = mArguments.item;
		this._oPopover.openBy(mArguments.opener || this._getOpener(mArguments.item, mArguments.point));
	};

	Tooltip.prototype._createDetail = function () {
		var fnCreate = this._getTooltipCreateFunction(this._oElement);
		this._oPopover.removeAllContent();
		this._appendFooter();

		fnCreate(this._oElement);
	};

	Tooltip.prototype.openLink = function (mArguments) {
		this._oElement = mArguments.item;
		this._fnCreate = this._createLink;

		this._oPopover.openBy(mArguments.opener);
	};

	Tooltip.prototype._createLink = function (mArguments) {
		var oList = new List(),
			oDataItem = this._oElement;

		this._oPopover.removeAllContent();

		this._appendHeader(oResourceBundle.getText("NETWORK_GRAPH_TOOLTIP_EXTERNAL_LINKS"));
		oDataItem.getActionLinks().forEach(function (oItem) {
			oList.addItem(new CustomListItem({
				content: [
					new HBox({
						renderType: "Bare",
						items: [oItem.clone().addStyleClass("sapUiTinyMargin")]
					})
				]
			}));
		});
		this._oPopover.addContent(oList);
		this._appendFooter();
	};

	/* =========================================================== */
	/* Private methods */
	/* =========================================================== */
	Tooltip.prototype._getOpener = function (oItem, oPoint) {
		if (oItem instanceof Line && oPoint) {
			this._cleanUpLineTooltip();
			this._tooltipRect = this._createElement("rect", {
				x: oPoint.x,
				y: oPoint.y,
				width: 0,
				height: 0
			});
			this.getParent().$svg.append(this._tooltipRect);
			return this._tooltipRect;
		}

		return oItem;
	};

	Tooltip.prototype._getTooltipCreateFunction = function (oItem) {
		if (oItem instanceof Node) {
			return this._createNodeTooltip.bind(this);
		}

		if (oItem instanceof Line) {
			return this._createLineTooltip.bind(this);
		}

		if (oItem instanceof Group) {
			return this._createGroupTooltip.bind(this);
		}

		return null;
	};

	Tooltip.prototype._cleanUpLineTooltip = function () {
		if (this._tooltipRect) {
			jQuery(this._tooltipRect).remove();
		}
	};

	Tooltip.prototype._appendDescription = function (oItem, oWrapper) {
		if (oItem.getDescription()) {
			oWrapper = oWrapper || this._oPopover;
			oWrapper.addContent(new Panel({
				content: new Text({
					textAlign: "Initial",
					text: oItem.getDescription()
				}).addStyleClass("sapSuiteUiCommonsNetworkTooltipDescription")
			}).addStyleClass("sapSuiteUiCommonsNetworkTooltipArea"));
		}
	};

	Tooltip.prototype._appendAttributes = function (aAttributes, oWrapper) {
		var oList = new List(),
			oCheckedWrapper = oWrapper || this._oPopover;

		if (aAttributes.length > 0) {
			aAttributes.forEach(function (oItem) {
				oList.addItem(new CustomListItem({
					content: [
						new HBox({
							items: [
								new Text({
									layoutData: [
										new FlexItemData({
											baseSize: "50%"
										})
									],
									text: oItem.getLabel()
								}), new Text({
									layoutData: [
										new FlexItemData({
											baseSize: "50%"
										})
									],
									text: oItem.getValue(),
									width: "100%",
									textAlign: CoreLibrary.TextAlign.End
								})
							]
						}).addStyleClass("sapSuiteUiCommonsNetworkTooltipLine")
					]
				}));

				oCheckedWrapper.addContent(oList);
			});
		}
	};

	Tooltip.prototype._appendNodesList = function (oGroup, oWrapper) {
		var oList = new List();
		oGroup.aNodes.forEach(function (oNode) {
			if (oNode.getTitle()) {
				oList.addItem(new StandardListItem({
					title: oNode.getTitle(),
					icon: oNode.getIcon()
				}));
			}
		});

		oWrapper.addContent(oList);
	};

	Tooltip.prototype._appendFooter = function () {
		var that = this;
		this.oCloseButton = new Button({
			text: "Close",
			press: function () {
				that._oPopover.close();
			}
		});

		this._oPopover.setFooter(new OverflowToolbar({
			content: [new ToolbarSpacer(), this.oCloseButton]
		}));
		this._oPopover.setInitialFocus(this.oCloseButton);
	};

	Tooltip.prototype._appendHeader = function (sTitle) {
		if (sTitle) {
			this._oPopover.insertContent(new Panel({
				width: "100%",
				content: [
					new Text({
						width: "100%",
						textAlign: CoreLibrary.TextAlign.Center,
						text: sTitle
					})
				]
			}).addStyleClass("sapSuiteUiCommonsNetworkTooltipArea"), 0);
		}
	};

	Tooltip.prototype._createGroupTooltip = function (oGroup) {
		var fnHasDetails = function () {
			return oGroup.getAttributes().length > 0 || oGroup.getDescription();
		};

		var oDataTab, oNodesTab;

		this._appendHeader(oGroup.getTitle());
		if (fnHasDetails()) {
			oNodesTab = new IconTabFilter({
				text: oResourceBundle.getText("NETWORK_GRAPH_TOOLTIP_LIST_OF_NODES")
			});
			oDataTab = new IconTabFilter({
				text: oResourceBundle.getText("NETWORK_GRAPH_TOOLTIP_INFORMATION")
			});

			this._oPopover.addContent(new IconTabBar({
				items: [oDataTab, oNodesTab]
			})).addStyleClass("sapSuiteUiCommonsNetworkGroupTooltipTabBar");

			this._appendDescription(oGroup, oDataTab);
			this._appendAttributes(oGroup.getAttributes(), oDataTab);

			this._appendNodesList(oGroup, oNodesTab);
		} else {
			this._appendNodesList(oGroup, this._oPopover);
		}
	};

	Tooltip.prototype._createNodeTooltip = function (oNode) {
		this._appendDescription(oNode);
		this._appendAttributes(oNode.getAttributes());
		this._appendHeader(oNode.getTitle());
	};

	Tooltip.prototype._createLineTooltip = function (oLine, oPoint) {
		var fnCreateFromTo = function () {
				var sItemFrom = new Text({
						width: "50%",
						text: oLine.getFromNode().getTitle()
					}).addStyleClass("sapSuiteUiCommonsNetworkGraphNoPointerEvents sapSuiteUiCommonsNetworkLineTooltipLabel"),
					oIcon = new Icon({
						src: "sap-icon://arrow-right"
					}).addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginEnd sapSuiteUiCommonsNetworkGraphNoPointerEvents sapSuiteUiCommonsNetworkLineTooltipFromToIcon"),
					sItemTo = new Text({
						textAlign: CoreLibrary.TextAlign.End,
						width: "50%",
						text: oLine.getToNode().getTitle()
					}).addStyleClass("sapSuiteUiCommonsNetworkGraphNoPointerEvents sapSuiteUiCommonsNetworkLineTooltipLabel"),
					oFromToContainer = new FlexBox({
						renderType: "Bare",
						width: "100%",
						justifyContent: "Center",
						items: [sItemFrom, oIcon, sItemTo]
					}).addStyleClass("sapSuiteUiCommonsNetworkLineTooltipFromTo");

				return oFromToContainer;
			},
			fnCreateDetail = function () {
				var sTitle = oLine.getTitle();

				this._oPopover.addContent(fnCreateFromTo());
				if (sTitle) {
					this._appendHeader(sTitle);
				}
				this._appendDescription(oLine);
				this._appendAttributes(oLine.getAttributes());
			}.bind(this);

		fnCreateDetail(oLine);
	};

	return Tooltip;
});
