sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"./Group",
	"./Node",
	"./Line"
], function (jQuery, BaseObject, Group, Node, Line) {
	var mDirections = {
		LEFT: "left",
		RIGHT: "right",
		UP: "up",
		DOWN: "down"
	};

	var rWrapMethod = /^on.*|setFocus|setItems$/;

	function wrapPublicMethods(oKeyboardNavigatorClass) {
		var sKey,
			oPrototype = oKeyboardNavigatorClass.prototype;
		for (sKey in oPrototype) {
			if (oPrototype.hasOwnProperty(sKey) && (typeof oPrototype[sKey] === "function") && rWrapMethod.test(sKey)) {
				oPrototype[sKey] = wrapMethod(oPrototype[sKey]);
			}
		}
	}

	function wrapMethod(fnOriginal) {
		return function () {
			try {
				return fnOriginal.apply(this, arguments);
			} catch (oError) {
				this._handleError(oError);
			}
			return undefined;
		};
	}

	var KeyboardNavigator = BaseObject.extend("sap.suite.ui.commons.networkgraph.KeyboardNavigator", {
		constructor: function (oGraph) {
			BaseObject.apply(this, arguments);
			this._oGraph = oGraph;
			this._aItems = [[]];
			this._iRows = 0;
			this._iColumns = 0;
			this._iPageSize = 5;
			this._oFocus = null;
			this._oFocusPosition = null;
			this._oWrapperDom = null;
		}
	});

	/* =========================================================== */
	/* Public API */
	/* =========================================================== */

	KeyboardNavigator.prototype.getFocus = function () {
		var oGraphFocus = this._oGraph.getFocus();
		if (this._oFocus !== oGraphFocus) {
			this._oFocus = oGraphFocus ? {item: oGraphFocus.item, button: oGraphFocus.button} : null;
			this._oFocusPosition = null;
		}
		return this._oFocus ? {item: this._oFocus.item, button: this._oFocus.button} : null;
	};

	KeyboardNavigator.prototype.getFocusPosition = function () {
		var oFocus = this.getFocus();
		if (!this._oFocusPosition) {
			var iX, iY;

			this._oFocusPosition = {iX: null, iY: null};
			if (!oFocus) {
				return this._oFocusPosition;
			}

			for (iY = 0; iY < this._aItems.length; iY++) {
				for (iX = 0; iX < this._aItems[iY].length; iX++) {
					if (this._aItems[iY][iX] === oFocus.item) {
						this._oFocusPosition = {iX: iX, iY: iY};
						return this._oFocusPosition;
					}
				}
			}
		}
		return this._oFocusPosition;
	};

	KeyboardNavigator.prototype.setItems = function (aItems) {
		this._aItems = aItems;
		this._iRows = aItems.length;
		this._iColumns = 0;
		aItems.forEach(function (aRow) {
			if (this._iColumns < aRow.length) {
				this._iColumns = aRow.length;
			}
		}, this);
	};

	KeyboardNavigator.prototype.setWrapperDom = function (oDom) {
		this._oWrapperDom = oDom;
	};

	KeyboardNavigator.prototype.setPageSize = function (iSize) {
		this._iPageSize = iSize;
	};

	/* =========================================================== */
	/* Events */
	/* =========================================================== */

	KeyboardNavigator.prototype.onfocusout = function (oEvent) {
		if (this._ignoreEvent(oEvent)) {
			return;
		}
		this._oGraph.defocus();
		this._oGraph._updateAccessibility(null);
	};

	KeyboardNavigator.prototype.onsapend = function (oEvent) {
		this._moveThroughMatrix(oEvent, true, true);
	};

	KeyboardNavigator.prototype.onsaphome = function (oEvent) {
		this._moveThroughMatrix(oEvent, true, false);
	};

	KeyboardNavigator.prototype.onsapendmodifiers = function (oEvent) {
		if (oEvent.ctrlKey) {
			this._moveThroughMatrix(oEvent, false, true);
		}
	};

	KeyboardNavigator.prototype.onsaphomemodifiers = function (oEvent) {
		if (oEvent.ctrlKey) {
			this._moveThroughMatrix(oEvent, false, false);
		}
	};

	KeyboardNavigator.prototype.onsappagedown = function (oEvent) {
		this._moveThroughMatrix(oEvent, false, true, this._iPageSize);
	};

	KeyboardNavigator.prototype.onsappageup = function (oEvent) {
		this._moveThroughMatrix(oEvent, false, false, this._iPageSize);
	};

	KeyboardNavigator.prototype.onsappagedownmodifiers = function (oEvent) {
		if (oEvent.altKey) {
			this._moveThroughMatrix(oEvent, true, true, this._iPageSize);
		}
	};

	KeyboardNavigator.prototype.onsappageupmodifiers = function (oEvent) {
		if (oEvent.altKey) {
			this._moveThroughMatrix(oEvent, true, false, this._iPageSize);
		}
	};

	KeyboardNavigator.prototype.onsapspace = function (oEvent) {
		this._selectElement(false);
		oEvent.stopPropagation();
	};

	KeyboardNavigator.prototype.onsapspacemodifiers = function (oEvent) {
		if (oEvent.ctrlKey) {
			this._selectElement(true);
			oEvent.stopPropagation();
		}
	};

	KeyboardNavigator.prototype.onsapenter = function (oEvent) {
		this._handleEnter();
	};

	KeyboardNavigator.prototype.onsaptabnext = function (oEvent) {
		this._handleTab(oEvent, mDirections.RIGHT);
	};

	KeyboardNavigator.prototype.onsaptabprevious = function (oEvent) {
		this._handleTab(oEvent, mDirections.LEFT);
	};

	KeyboardNavigator.prototype.onsapleft = function (oEvent) {
		this._handleArrow(oEvent, mDirections.LEFT);
	};

	KeyboardNavigator.prototype.onsapright = function (oEvent) {
		this._handleArrow(oEvent, mDirections.RIGHT);
	};

	KeyboardNavigator.prototype.onsapup = function (oEvent) {
		this._handleArrow(oEvent, mDirections.UP);
	};

	KeyboardNavigator.prototype.onsapdown = function (oEvent) {
		this._handleArrow(oEvent, mDirections.DOWN);
	};

	KeyboardNavigator.prototype.onkeydown = function (oEvent) {
		var oItem, oBtn,
			oFocus = this.getFocus();
		if (!oFocus) {
			return;
		}

		oItem = oFocus.item;
		oBtn = oFocus.button;

		if (oEvent.ctrlKey && oEvent.keyCode === jQuery.sap.KeyCodes.A) {
			this._onCtrlA(oEvent);
		} else if (oEvent.keyCode === jQuery.sap.KeyCodes.F2) {
			if (oItem instanceof Node) {
				if (oItem.hasVisibleActionButtons()) {
					oItem._detailClick();
				}
			} else if (oItem instanceof Group) {
				oItem._openDetail();
			}
			oEvent.stopPropagation();
		} else if (oEvent.keyCode === jQuery.sap.KeyCodes.F6) {
			if (oItem && oBtn) {
				oFocus.button = null;
				this._oGraph.setFocus(oFocus);
			}
			this._handleArrow(oEvent, oEvent.shiftKey ? mDirections.LEFT : mDirections.RIGHT);
		} else if (oEvent.keyCode === jQuery.sap.KeyCodes.F7 && !oEvent.shiftKey) {
			if (oItem && oBtn) {
				oFocus.button = null;
				this._oGraph.setFocus(oFocus);
			}
		} else if (oEvent.ctrlKey && oEvent.keyCode === jQuery.sap.KeyCodes.DIGIT_0) {
			this._onCtrl0(oEvent);
		} else if (oEvent.ctrlKey && (oEvent.keyCode === jQuery.sap.KeyCodes.PLUS || oEvent.keyCode === jQuery.sap.KeyCodes.NUMPAD_PLUS)) {
			this._onCtrlPlus(oEvent);
		} else if (oEvent.ctrlKey && (oEvent.keyCode === jQuery.sap.KeyCodes.SLASH || oEvent.keyCode === jQuery.sap.KeyCodes.NUMPAD_MINUS)) {
			this._onCtrlMinus(oEvent);
		}
	};

	/* =========================================================== */
	/* Private methods */
	/* =========================================================== */

	KeyboardNavigator.prototype._handleEnter = function () {
		var oItem, oBtn,
			oFocus = this.getFocus(),
			iBtnIdx;

		if (!oFocus) {
			return;
		}

		oItem = oFocus.item;
		oBtn = oFocus.button;
		if (oItem instanceof Node) {
			if (oBtn) {
				iBtnIdx = oItem.getEnabledActionButtons().indexOf(oBtn);
				oItem._aActionButtonsClicks[iBtnIdx].call();
			} else {
				oItem.showActionButtons(!oItem.hasVisibleActionButtons());
			}
		} else if (oItem instanceof Line) {
			oItem.getParent()._tooltip.openDetail({
				item: oItem,
				point: oItem._getArrowPosition().arrowTo
			});
		} else if (oItem instanceof Group) {
			if (oBtn === Group.BUTTONS.MENU) {
				oItem._openDetail();
			} else if (oBtn === Group.BUTTONS.COLLAPSE) {
				oItem._collapse();
			}
		}
	};

	KeyboardNavigator.prototype._handleTab = function (oEvent, sDirection) {
		if (this._ignoreEvent(oEvent)) {
			return;
		}

		if (this._handleTabOverNodeWithButtons(oEvent, sDirection)
			|| this._handleTabOverGroupWithButtons(oEvent, sDirection)) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
			return;
		}

		this._moveItemFocus(oEvent, sDirection);
	};

	KeyboardNavigator.prototype._handleTabOverNodeWithButtons = function (oEvent, sDirection) {
		var oFocus = this.getFocus(),
			oItem, oBtn,
			aBtns,
			bActionHandled = false,
			idx;

		if (!oFocus) {
			return false;
		}

		oItem = oFocus.item;
		oBtn = oFocus.button;
		aBtns = oItem && oItem.getEnabledActionButtons ? oItem.getEnabledActionButtons() : [];
		if (!(oItem instanceof Node) || !oItem.hasVisibleActionButtons() || aBtns.length === 0) {
			return false;
		}

		if (oBtn) {
			idx = aBtns.indexOf(oBtn);
			if (sDirection === mDirections.RIGHT) {
				if (idx === (aBtns.length - 1)) { // Move to the next node from the last button
					this._moveItemFocus(oEvent, sDirection);
				} else { // Move to the next enabled button
					this._setActionButtonFocus(aBtns[idx + 1]);
				}
				bActionHandled = true;
			} else if (sDirection === mDirections.LEFT) {
				if (idx === 0) { // Move to the parent node from the first button
					this._moveItemFocus(oEvent, this.getFocusPosition());
				} else { // Move to the previous enabled button
					this._setActionButtonFocus(aBtns[idx - 1]);
				}
				bActionHandled = true;
			}
		} else if (sDirection === mDirections.RIGHT) {
			// Move to the first enabled button
			this._setActionButtonFocus(aBtns[0]);
			bActionHandled = true;
		}

		return bActionHandled;
	};

	KeyboardNavigator.prototype._handleTabOverGroupWithButtons = function (oEvent, sDirection) {
		var oFocus = this.getFocus(),
			oItem, oBtn;

		if (!oFocus) {
			return false;
		}

		oItem = oFocus.item;
		oBtn = oFocus.button;

		if (oItem instanceof Group) {
			if (oBtn) {
				if (oBtn === Group.BUTTONS.MENU) {
					if (sDirection === mDirections.RIGHT) {
						oFocus.button = Group.BUTTONS.COLLAPSE;
						this._oGraph.setFocus(oFocus);
						return true;
					} else if (sDirection === mDirections.LEFT) {
						oFocus.button = null;
						this._oGraph.setFocus(oFocus);
						return true;
					}
				} else if (oBtn === Group.BUTTONS.COLLAPSE) {
					if (sDirection === mDirections.RIGHT) {
						this._moveItemFocus(oEvent, sDirection);
						oFocus = this.getFocus(); // refresh from graph
						oFocus.button = null;
						this._oGraph.setFocus(oFocus);
						return true;
					} else if (sDirection === mDirections.LEFT) {
						oFocus.button = Group.BUTTONS.MENU;
						this._oGraph.setFocus(oFocus);
						return true;
					}
				}
			} else {
				if (sDirection === mDirections.RIGHT) {
					oFocus.button = Group.BUTTONS.MENU;
					this._oGraph.setFocus(oFocus);
					return true;
				} else if (sDirection === mDirections.LEFT) {
					this._moveItemFocus(oEvent, sDirection);
					return true;
				}
			}
		}

		return false;
	};

	KeyboardNavigator.prototype._setActionButtonFocus = function (oActionButton) {
		var oFocus = this.getFocus();
		if (!oFocus) {
			return;
		}

		oFocus.button = oActionButton;
		this._oGraph.setFocus(oFocus);
	};

	KeyboardNavigator.prototype._selectElement = function (bCtrl) {
		var oFocus = this.getFocus(),
			oItem;
		if (!oFocus) {
			return;
		}

		oItem = oFocus.item;
		if (oItem instanceof Node) {
			oItem.getParent()._selectNode({
				element: oItem,
				setFocus: false,
				renderActionButtons: false,
				preventDeselect: bCtrl
			});
		} else if (oItem instanceof Line) {
			oItem.getParent()._selectLine({
				element: oItem,
				setFocus: false,
				preventDeselect: bCtrl
			});
		}
	};

	KeyboardNavigator.prototype._moveThroughMatrix = function (oEvent, bRow, bTowardEnd, iThreshold) {
		var oFocus = this.getFocus(),
			oItem,
			oCandidate, iCandidatesFound,
			oNewItem;

		if (this._ignoreEvent(oEvent) || !oFocus) {
			return;
		}

		oItem = oFocus.item;
		// find the last/first (see bTowardEnd) in row/columns (see bRow), if different then move focus there
		iCandidatesFound = 0;
		iThreshold = iThreshold || Number.POSITIVE_INFINITY;
		for (var i = (bRow ? this.getFocusPosition().iX : this.getFocusPosition().iY) + (bTowardEnd ? 1 : -1);
			 (bTowardEnd && i < (bRow ? this._iColumns : this._iRows)) || (!bTowardEnd && i >= 0);
			 i += (bTowardEnd ? 1 : -1)) {

			oCandidate = this._aItems[bRow ? this.getFocusPosition().iY : i][bRow ? i : this.getFocusPosition().iX];
			if (oCandidate && iCandidatesFound < iThreshold) {
				oNewItem = oCandidate;
				iCandidatesFound++;
			}
		}

		if (oNewItem !== oItem) {
			oFocus.item = oNewItem;
			oFocus.button = null;
			this._oGraph.setFocus(oFocus);
			oEvent.stopPropagation();
		}
	};

	KeyboardNavigator.prototype._handleArrow = function (oEvent, sDirection) {
		if (this._ignoreEvent(oEvent) || !this.getFocus()) {
			return;
		}

		this._moveItemFocus(oEvent, sDirection);
	};

	KeyboardNavigator.prototype._moveItemFocus = function (oEvent, sDirection) {
		var oFocus,
			bBackTab = (sDirection === mDirections.LEFT && oEvent.key === "Tab"),
			oPosition,
			oNewItem,
			aBtns;

		if (typeof sDirection === "string") {
			oPosition = this._findNextPosition(sDirection);
		} else {
			oPosition = sDirection;
		}
		oNewItem = this._getItemAtPosition(oPosition);
		oFocus = {item: oNewItem, button: null};

		if (bBackTab && oNewItem !== null) {
			// If the new focused item is a node with visible enabled buttons AND we came from another element, then go to the last of them
			if (oNewItem instanceof Node && oNewItem.hasVisibleActionButtons()) {
				aBtns = oNewItem.getEnabledActionButtons();
				if (aBtns.length > 0) {
					oFocus.button = aBtns[aBtns.length - 1];
				}
			// Returning to a group means focusing its rightmost - collapse - button
			} else if (oNewItem instanceof Group) {
				oFocus.button = Group.BUTTONS.COLLAPSE;
			}
		}

		this._oGraph.setFocus(oFocus);
		if (oEvent && oNewItem) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	KeyboardNavigator.prototype._getItemAtPosition = function (oPosition) {
		var a;
		if (!oPosition || oPosition.iX === null) {
			return null;
		} else {
			a = this._aItems[oPosition.iY];
			return a ? a[oPosition.iX] : null;
		}
	};

	KeyboardNavigator.prototype._findNextPosition = function (sDirection) {
		var x, y;
		if (this.getFocusPosition().iX === null) {
			if (sDirection === mDirections.LEFT) {
				x = this._iColumns - 1;
				y = this._iRows - 1;
			} else {
				x = 0;
				y = 0;
			}
			if (this._aItems[y][x] !== null) {
				return {
					iX: x,
					iY: y
				};
			}
		} else {
			x = this.getFocusPosition().iX;
			y = this.getFocusPosition().iY;
		}
		do {
			switch (sDirection) {
				case mDirections.RIGHT:
					x += 1;
					if (x >= this._iColumns) {
						y += 1;
						x = 0;
					}
					break;
				case mDirections.LEFT:
					x -= 1;
					if (x < 0) {
						y -= 1;
						x = this._iColumns - 1;
					}
					break;
				case mDirections.UP:
					y -= 1;
					if (y < 0 && x > 0) {
						x -= 1;
						y = this._iRows - 1;
					}
					break;
				case mDirections.DOWN:
					y += 1;
					if (y >= this._iRows && x < this._iColumns - 1) {
						x += 1;
						y = 0;
					}
					break;
				default:
					throw new Error("Unexpected direction: " + sDirection);
			}
		} while (y >= 0 && y < this._iRows && this._aItems[y][x] === null);
		if (y < 0 || y >= this._iRows) {
			return null;
		} else {
			return {
				iX: x,
				iY: y
			};
		}
	};

	KeyboardNavigator.prototype._onCtrlA = function (oEvent) {
		if (this._ignoreEvent(oEvent)) {
			return;
		}

		var bAllSelected = true;
		this._forEach(function (oItem) {
			if (oItem instanceof Group) {
				return false;
			}
			if (!oItem.getSelected()) {
				bAllSelected = false;
				return true;
			}
			return false;
		});

		bAllSelected = !bAllSelected;
		this._forEach(function (oItem) {
			if (!(oItem instanceof Group)) {
				oItem.setSelected(bAllSelected);
			}
		});
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	KeyboardNavigator.prototype._forEach = function (fnCallback) {
		var x, y, oItem, bBreak;
		for (y = 0; y < this._iRows; y++) {
			for (x = 0; x < this._iColumns; x++) {
				oItem = this._aItems[y][x];
				if (oItem) {
					bBreak = fnCallback.call(this, oItem, x, y);
					if (bBreak) {
						return;
					}
				}
			}
		}
	};

	KeyboardNavigator.prototype._onCtrl0 = function (oEvent) {
		this._oGraph._zoom({
			newIndex: this._oGraph.ZOOM_100_INDEX
		});
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	KeyboardNavigator.prototype._onCtrlPlus = function (oEvent) {
		this._oGraph._zoom({
			deltaY: 1
		});
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	KeyboardNavigator.prototype._onCtrlMinus = function (oEvent) {
		this._oGraph._zoom({
			deltaY: -1
		});
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	KeyboardNavigator.prototype._ignoreEvent = function (oEvent) {
		return !jQuery.sap.containsOrEquals(this._oWrapperDom, oEvent.target);
	};

	KeyboardNavigator.prototype._handleError = function (oError) {
		jQuery.sap.log.error("An error in KeyboardNavigator: " + oError);
	};

	// This call must be the last thing in the function.
	wrapPublicMethods(KeyboardNavigator);

	return KeyboardNavigator;
});