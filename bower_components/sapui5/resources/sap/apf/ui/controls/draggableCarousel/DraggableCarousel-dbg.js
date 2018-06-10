/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global window, document*/
jQuery.sap.declare("sap.apf.ui.controls.draggableCarousel.DraggableCarousel");
(function(un) {
	"use strict";
	var isTouchDevice, isNotTouchDevice; //KS wrong naming? global variables
	(function() {
		var isTouchDeviceInIE = navigator.maxTouchPoints;
		var isTouchDeviceOtherThanIE = 'ontouchstart' in window ? true : false;
		isTouchDevice = isTouchDeviceOtherThanIE || isTouchDeviceInIE;
		if ('onclick' in window) {
			isNotTouchDevice = true;
		}
	})();
	sap.apf.ui.controls.draggableCarousel.DraggableCarousel = function(opts) {//KS no jsdoc for options
		var options = opts || {};
		this.eleRefs = {
			blocks : [],
			containerEle : opts.containerEle
		};
		this._editState = options.editable === un ? true : options.editable;
		this._dragState = this._editState;
		this._removeState = this._editState;
		this.styles = {
			containerHeight : options.containerHeight,
			containerWidth : options.containerWidth,
			blockHeight : options.blockHeight,
			blockWidth : options.blockWidth,
			blockMargin : options.blockMargin,
			separatorHeight : options.separatorHeight,
			removeIconHeight : options.removeIconHeight
		};
		this.elems = {
			separator : options.separator,
			removeIcon : options.removeIcon,
			ariaTextForCarouselBlock : options.ariaTextForCarouselBlock
		};
		this.callbacks = {
			onBeforeDrag : options.onBeforeDrag,
			onAfterDrop : options.onAfterDrop,
			onAfterRemove : options.onAfterRemove,
			onAfterSelect : options.onAfterSelect,
			setAriaTextWhenEnterPressOnBlock : options.setAriaTextWhenEnterPressOnBlock,
			setAriaTextwhenDeleteKeyPressOnBlock : options.setAriaTextwhenDeleteKeyPressOnBlock,
			setAriaTextWhenFocusOnBlock : options.setAriaTextWhenFocusOnBlock
		};
		this.eleRefs.containerEle = this._drawSkeleton();
		this._initDimensions();
		this._isMouseDown = false;
	};
	sap.apf.ui.controls.draggableCarousel.DraggableCarousel.prototype = {
		_initDimensions : function() {
			var sMargin = this.styles.blockMargin;
			this._blockMargin = parseInt(sMargin.replace("px"), 10);
			var sBlockHeight = this.styles.blockHeight;
			this._blockHeight = parseInt(sBlockHeight.replace("px"), 10);
			this._blockTotalHeight = this._blockHeight + (2 * this._blockMargin);
			this._separatorHeight = 0;
			if (this.elems.separator !== un) {
				var sSeparatorHeight = this.styles.separatorHeight;
				this._separatorHeight = parseInt(sSeparatorHeight.replace("px"), 10);
			}
			this._mFactor = this._blockTotalHeight + this._separatorHeight;
		},
		_drawSkeleton : function() {
			var containerEle;
			if (this.eleRefs.containerEle === un) {
				containerEle = document.createElement('div');
			} else {
				containerEle = this.eleRefs.containerEle;
			}
			containerEle.style.cssText += this._getContainerStyles();
			containerEle.classList.add('DnD-container');
			var self = this;
			var tapEndEventFunction = function(e) {
				self._onMouseUp(e, self);
			};
			if (isTouchDevice) {
				document.addEventListener("touchend", tapEndEventFunction);
			}
			if (isNotTouchDevice) {
				document.addEventListener("mouseup", tapEndEventFunction);
			}
			return containerEle;
		},
		_getBlockWrapper : function(blockObj) {
			var block = blockObj.blockElement;
			var blocks = this.eleRefs.blocks;
			var dragState = blockObj.dragState === un ? true : blockObj.dragState;
			var dropState = blockObj.dropState === un ? true : blockObj.dropState;
			var removable = blockObj.removable === un ? true : blockObj.removable;
			var blockWrapper = document.createElement('div');
			blockWrapper.style.cssText += this._getBlockStyles();
			blockWrapper.setAttribute('class', 'DnD-block');
			blockWrapper.setAttribute('drag-state', dragState);
			blockWrapper.setAttribute('drop-state', dropState);
			if (removable) {
				var removeIconEle = this._getRemoveIconEle();
				blockWrapper.appendChild(removeIconEle);
			}
			var self = this;
			var tapEventFunction = function(e) {
				self._onMouseDown(e, self, this);
			};
			if (isTouchDevice) {
				blockWrapper.addEventListener("touchstart", tapEventFunction);
			}
			if (isNotTouchDevice) {
				blockWrapper.addEventListener("mousedown", tapEventFunction);
			}
			var tapMoveEventFunction = function(e) {
				window.clearTimeout(self._TIMEOUTID);
			};
			if (isTouchDevice) {
				blockWrapper.addEventListener("touchmove", tapMoveEventFunction);
			}
			if (isNotTouchDevice) {
				blockWrapper.addEventListener("mousemove", tapMoveEventFunction);
			}
			//Select the block using space + enter key
			this._keypress(blockWrapper, 13, function(ele, e) {
				var selectIndex = blocks.indexOf(ele);
				self.callbacks.onAfterSelect.apply(ele, [ selectIndex ]);
				jQuery('.DnD-block').parent().wrap("<div>").find("[tabindex='0'][drag-state='true']").attr('aria-labelledby', self.elems.ariaTextForCarouselBlock);
				sap.ui.getCore().byId(self.elems.ariaTextForCarouselBlock).setText(self.callbacks.setAriaTextWhenEnterPressOnBlock.apply(ele, [ jQuery('.activeStepTitle').text() ]));
			});
			this._keypress(blockWrapper, 32, function(ele, e) {
				var selectIndex = blocks.indexOf(ele);
				self.callbacks.onAfterSelect.apply(ele, [ selectIndex ]);
			});
			//Home + End Key - focus first and last block
			this._keypress(blockWrapper, 36, function(ele, e) {
				jQuery(blocks).removeAttr("tabindex");
				jQuery(blocks).attr("tabindex", -1);
				jQuery(blocks[0]).attr("tabindex", 0);
				jQuery(blocks[0]).focus();
			});
			this._keypress(blockWrapper, 35, function(ele, e) {
				jQuery(blocks).removeAttr("tabindex");
				jQuery(blocks).attr("tabindex", -1);
				jQuery(blocks[blocks.length - 1]).attr("tabindex", 0);
				jQuery(blocks[blocks.length - 1]).focus();
			});
			//Check the removable state 
			if (removable === true) {
				//Delete Event on press of the block
				this._keypress(blockWrapper, 46, function(ele, e) {
					var removeIndex = blocks.indexOf(ele), i;
					self.removeBlock(removeIndex, self.callbacks.onAfterRemove);
					//Tab Index Grouping
					self._grouping(blocks);
					//Set focus to tab-index active
					jQuery('.DnD-block').parent().wrap("<div>").find("[tabindex='0'][drag-state='true']").attr('aria-labelledby', self.elems.ariaTextForCarouselBlock);
					sap.ui.getCore().byId(self.elems.ariaTextForCarouselBlock).setText(self.callbacks.setAriaTextwhenDeleteKeyPressOnBlock.apply(ele, [ jQuery('.activeStepTitle').text() ]));
					for(i = 0; i < jQuery('.DnD-block').parent().wrap('<div>').find("[drag-state='true']").length; i++) {
						if (jQuery('.DnD-block').parent().wrap('<div>').find("[drag-state='true']")[i].getElementsByClassName('activeStepTitle')[0] !== undefined) {
							var oActiveElement = jQuery('.DnD-block').parent().wrap('<div>').find("[drag-state='true']")[i];
							setTimeout(function() {
								oActiveElement.focus();
							}, 10);
						}
					}
				});
			}
			blockWrapper.appendChild(block);
			return blockWrapper;
		},
		_getSeparatorEle : function() {
			var separator = document.createElement('div');
			separator.style.cssText += this._getSeparatorStyles();
			separator.setAttribute('class', 'DnD-separator');
			separator.innerHTML = this.elems.separator.outerHTML;
			return separator;
		},
		_getRemoveIconEle : function() {
			var removeIcon = this.elems.removeIcon;
			var removeIconWrapper = document.createElement('div');
			removeIconWrapper.style.cssText += this._getRemoveIconStyles();
			removeIconWrapper.setAttribute('class', 'DnD-removeIconWrapper');
			removeIconWrapper.innerHTML = removeIcon.outerHTML;
			var self = this;
			var tapEventFunction = function(e) {
				self._onRemoveBlock(e, self, this);
			};
			if (isTouchDevice) {
				removeIconWrapper.addEventListener("touchstart", tapEventFunction);
			}
			if (isNotTouchDevice) {
				removeIconWrapper.addEventListener("mousedown", tapEventFunction);
			}
			return removeIconWrapper;
		},
		addBlock : function(blockObj) {
			if (blockObj instanceof Array) {
				var i;
				for(i = 0; i < blockObj.length; i++) {
					this.addBlock(blockObj[i]);
				}
				return;
			}
			var blockWrapper = this._getBlockWrapper(blockObj);
			var blockIndex = this.eleRefs.blocks.length;
			var blocks = this.eleRefs.blocks;
			var y = blockIndex * this._mFactor;
			blockWrapper.style.cssText = blockWrapper.style.cssText + this._getTransformCss(y);
			this.eleRefs.blocks.push(blockWrapper);
			var container = this.eleRefs.containerEle;
			container.appendChild(blockWrapper);
			this._setHorizontalBlockMargin();
			if (this.elems.separator !== un) {
				var separator = this._getSeparatorEle();
				var separatorYValue = y + this._blockHeight + 2 * this._blockMargin;
				separator.style.cssText = separator.style.cssText + this._getTransformCss(separatorYValue);
				container.appendChild(separator);
			}
			//Tab Index Grouping
			this._grouping(blocks);
		},
		swapBlocks : function(fromIndex, toIndex) {
			var fromBlock = this.eleRefs.blocks[fromIndex];
			var toBlock = this.eleRefs.blocks[toIndex];
			if ((fromBlock.getAttribute('drag-state') !== "true" && fromBlock.getAttribute('drop-state') !== "true") || (toBlock.getAttribute('drag-state') !== "true" && toBlock.getAttribute('drop-state') !== "true")) {
				return false;
			}
			var fromBlockYValue = fromIndex * this._mFactor;
			var toBlockYValue = toIndex * this._mFactor;
			var toBlockTopValue = toBlockYValue;
			var toBlockBottomValue = toBlockTopValue + this._blockHeight + (2 * this._blockMargin);
			var containerEle = document.getElementsByClassName('scrollContainerEle')[0] ? document.getElementsByClassName('scrollContainerEle')[0] : this.eleRefs.containerEle; // Scroll Container Hack
			var scrollValue = containerEle.scrollTop;
			if ((fromIndex > toIndex) && toBlockTopValue < containerEle.scrollTop) {
				scrollValue = toBlockTopValue;
			}
			if ((fromIndex < toIndex) && toBlockBottomValue - containerEle.offsetHeight > containerEle.scrollTop) {
				scrollValue = toBlockBottomValue - containerEle.offsetHeight;
			}
			var prevScrollTop;
			var damping = 40;
			var easeOutLoop = window.setInterval(function() {
				containerEle.scrollTop += (scrollValue - containerEle.scrollTop) / damping;
				if (containerEle.scrollTop === prevScrollTop) {
					window.clearInterval(easeOutLoop);
				}
				prevScrollTop = containerEle.scrollTop;
			}, 1000 / 60);
			this._setTransformYValue(fromBlock, toBlockYValue);
			this._setTransformYValue(toBlock, fromBlockYValue);
			this._swapArray(this.eleRefs.blocks, fromIndex, toIndex);
			return true;
		},
		insertBlock : function(blockObj, index) {
			var self = this, i;
			var blocks = this.eleRefs.blocks;
			blocks.push({});
			for(i = blocks.length - 1; i > index; i--) {
				blocks[i] = blocks[i - 1];
				var yValue = i * this._mFactor;
				this._setTransformYValue(blocks[i], yValue);
			}
			var blockWrapper = this._getBlockWrapper(blockObj);
			blocks[i] = blockWrapper;
			var y = index * this._mFactor;
			blockWrapper.style.cssText = blockWrapper.style.cssText + this._getTransformCss(y);
			var container = this.eleRefs.containerEle;
			container.appendChild(blockWrapper);
			jQuery('.DnD-block').parent().wrap("<div>").find("[tabindex='0'][drag-state='true']").attr('aria-labelledby', self.elems.ariaTextForCarouselBlock);
			for(i = 0; i < jQuery('.DnD-block').parent().wrap('<div>').find("[drag-state='true']").length; i++) {
				jQuery('.DnD-block').parent().wrap('<div>').find("[drag-state='true']")[i].onkeydown = function(e) {
					if (e.which == 13) {
						setTimeout(function() {
							jQuery('.DnD-block').parent().wrap("<div>").find("[tabindex='0'][drag-state='true']").focus();
						}, 10);
					}
				};
			}
			this._setHorizontalBlockMargin();
			if (this.elems.separator !== un) {
				var separator = this._getSeparatorEle();
				var separatorYValue = y + this._blockHeight + 2 * this._blockMargin;
				separator.style.cssText = separator.style.cssText + this._getTransformCss(separatorYValue);
				container.appendChild(separator);
			}
			//Tab Index Grouping
			this._grouping(blocks);
		},
		removeBlock : function(index, callback) {
			var blocks = this.eleRefs.blocks;
			var containerEle = this.eleRefs.containerEle;
			var i;
			var removeBlock = blocks[index];
			containerEle.removeChild(removeBlock);
			for(i = index; i < blocks.length - 1; i++) {
				blocks[i] = blocks[i + 1];
				var yValue = i * this._mFactor;
				this._setTransformYValue(blocks[i], yValue);
			}
			blocks.pop();
			if (this.elems.separator !== un) {
				var separators = containerEle.querySelectorAll('.DnD-separator');
				var lastSeparator = separators[separators.length - 1];
				containerEle.removeChild(lastSeparator);
			}
			callback.apply(containerEle, [ index ]);
			//Tab Index Grouping
			this._grouping(blocks);
		},
		placeAt : function(id) {
			var ele = document.getElementById(id);
			ele.appendChild(this.eleRefs.containerEle);
			this._setHorizontalBlockMargin();
		},
		getEditable : function() {
			return this._editState;
		},
		setEditable : function(editState) {
			this._editState = editState;
			this._setDragState(editState);
			this._setRemoveState(editState);
		},
		_setDragState : function(dragState) {
			this._dragState = dragState;
		},
		_setRemoveState : function(removeState) {
			this._removeState = removeState;
			var removeIcons = this.eleRefs.containerEle.querySelectorAll('.DnD-removeIconWrapper');
			var displayCss;
			if (removeState) {
				displayCss = "display : block";
			} else {
				displayCss = "display : none";
			}
			var i;
			for(i = 0; i < removeIcons.length; i++) {
				removeIcons[i].style.cssText += displayCss;
			}
		},
		_getContainerStyles : function() {
			var sStyle = [ "height : ", this.styles.containerHeight, ";width : ", this.styles.containerWidth, "; position : relative" ].join("");
			return sStyle;
		},
		_getBlockStyles : function() {
			if (this.styles.horizontalBlockMargin === un) {
				var containerWidth = this.eleRefs.containerEle.clientWidth;
				var blockWidth = this.eleRefs.blocks[0] === un ? 0 : this.eleRefs.blocks[0].clientWidth;
				this.styles.horizontalBlockMargin = ((containerWidth - blockWidth) / 2) + "px";
			}
			var sStyle = [ "height : ", this.styles.blockHeight, ";width : ", this.styles.blockWidth, ";margin : ", this.styles.blockMargin, " ", this.styles.horizontalBlockMargin, ";position : absolute" ].join("");
			return sStyle;
		},
		_getSeparatorStyles : function() {
			var sStyle = [ "height : ", this.styles.separatorHeight, ";width : 100%", ";position : absolute" ].join("");
			return sStyle;
		},
		_getRemoveIconStyles : function() {
			var sStyle = [ "height : ", this.styles.removeIconHeight, ";width : ", this.styles.removeIconHeight, ";float : right", ";margin : -10px -13px -10px 0", ";z-index : 2", ";position : relative", ";cursor : pointer" ].join("");
			if (this._removeState) {
				sStyle += ";display : block";
			} else {
				sStyle += ";display : none";
			}
			return sStyle;
		},
		_getTransformCss : function(yValue) {
			var sYValue = yValue + "px";
			var transformPropertyStrings = [ "transform", "-webkit-transform", "-moz-transform", "-ms-transform", "-o-transform" ];
			var cssString = "";
			var i;
			for(i = 0; i < transformPropertyStrings.length; i++) {
				cssString += transformPropertyStrings[i] + ": translate3d(0px," + sYValue + ", 0px); ";
			}
			return cssString;
		},
		_setTransformYValue : function(ele, yValue) {
			var vendorProperty = [ {
				"WebkitTransform" : "-webkit-transform"
			}, {
				"MozTransform" : "-moz-transform"
			}, {
				"MsTransform" : "-ms-transform"
			}, {
				"OTransform" : "-o-transform"
			} ];
			var transformPropertyString = "transform";
			var i;
			for(i = 0; i < vendorProperty.length; i++) {
				if (ele.style.hasOwnProperty(Object.keys(vendorProperty[i])[0])) {
					transformPropertyString = vendorProperty[i][Object.keys(vendorProperty[i])[0]];
				}
			}
			var sYValue = yValue + 'px';
			ele.style.cssText = ele.style.cssText + " " + transformPropertyString + ": translate3d(0px," + sYValue + ", 0px);";
		},
		_setHorizontalBlockMargin : function() {
			var blocks = this.eleRefs.blocks;
			var container = this.eleRefs.containerEle;
			var blockWidth = blocks[0] === un ? 0 : jQuery(blocks[0]).width();
			var containerWidth = jQuery(container).width();
			this.styles.horizontalBlockMargin = ((containerWidth - blockWidth) / 2) + "px";
			var marginHorizontal = this.styles.horizontalBlockMargin;
			[].forEach.call(blocks, function(block) {
				block.style.cssText += "margin-right : " + marginHorizontal + ";margin-left : " + marginHorizontal;
			});
		},
		_onMouseDown : function(e, ctx, blockWrapper) {
			ctx._isMouseDown = true;
			ctx._TIMEOUTID = window.setTimeout(function() {
				if (ctx._isMouseDown) {
					ctx._onDragStart(e, ctx, blockWrapper);
				}
			}, 500);
		},
		_onMouseUp : function(e, ctx) {
			ctx._isMouseDown = false;
			if (ctx._dragEle !== un && ctx._dragEle.ele !== un) {
				ctx._onDrop(e, ctx);
			}
		},
		_onDragStart : function(e, ctx, blockWrapper) {
			if (!ctx._dragState || blockWrapper.getAttribute('drag-state') !== 'true') {
				return;
			}
			ctx._dragIndex = ctx.eleRefs.blocks.indexOf(blockWrapper);
			var yValue = ctx._dragIndex * ctx._mFactor;
			var containerEle = document.getElementsByClassName('scrollContainerEle')[0] ? document.getElementsByClassName('scrollContainerEle')[0] : ctx.eleRefs.containerEle; // Scroll Container Hack			
			ctx._containerEleOffsetHeight = containerEle.offsetHeight;
			ctx._containerEleScrollHeight = containerEle.scrollHeight;
			ctx._blockEleOffsetHeight = blockWrapper.offsetHeight;
			ctx._containerEleScrollTop = containerEle.scrollTop;
			var eleTopValue = yValue + ctx._blockMargin;
			var eleBottomValue = eleTopValue + ctx._blockHeight;
			if (eleTopValue < ctx._containerEleScrollTop) {
				containerEle.scrollTop = eleTopValue;
				ctx._containerEleScrollTop = Math.max(0, eleTopValue);
			}
			if (eleBottomValue - ctx._containerEleOffsetHeight > containerEle.scrollTop) {
				containerEle.scrollTop = eleBottomValue - ctx._containerEleOffsetHeight;
				ctx._containerEleScrollTop = Math.min(ctx._containerEleScrollHeight - ctx._containerEleOffsetHeight, eleBottomValue - ctx._containerEleOffsetHeight);
			}
			ctx._diffTop = e.pageY - yValue + ctx._containerEleScrollTop;
			ctx._dragEle = {
				ele : blockWrapper,
				pos : {
					y : yValue
				}
			};
			ctx.callbacks.onBeforeDrag.apply(blockWrapper, [ ctx._dragIndex ]);
			ctx._dragEle.ele.className = ctx._dragEle.ele.className + " " + "DnD-drag";
			var tapMoveEventFunction = function(e) {
				if (ctx._dragEle.ele !== un) {
					e.preventDefault();
					ctx._onDrag(e, ctx);
					e.stopPropagation();
				}
			};
			if (isTouchDevice) {
				document.addEventListener("touchmove", tapMoveEventFunction);
			}
			if (isNotTouchDevice) {
				document.addEventListener("mousemove", tapMoveEventFunction);
			}
		},
		_onDrag : function(e, ctx) {
			var containerEle = document.getElementsByClassName('scrollContainerEle')[0] ? document.getElementsByClassName('scrollContainerEle')[0] : ctx.eleRefs.containerEle; // Scroll Container Hack
			var yValue = e.pageY - ctx._diffTop + ctx._containerEleScrollTop;
			var eleTopValue = yValue + ctx._blockMargin;
			var eleBottomValue = eleTopValue + ctx._blockHeight;
			var isDraggingDown = ((e.pageY - ctx._diffTop) > ctx._prevPageY);
			var isDraggingUp = ((e.pageY - ctx._diffTop) < ctx._prevPageY);
			ctx._prevPageY = (e.pageY - ctx._diffTop);
			if (isDraggingUp && (eleTopValue < ctx._containerEleScrollTop)) {
				containerEle.scrollTop = eleTopValue;
				ctx._containerEleScrollTop = Math.max(0, eleTopValue);
				yValue = e.pageY - ctx._diffTop + ctx._containerEleScrollTop;
			}
			if (isDraggingDown && ((eleBottomValue - ctx._containerEleOffsetHeight) > ctx._containerEleScrollTop)) {
				containerEle.scrollTop = eleBottomValue - ctx._containerEleOffsetHeight;
				ctx._containerEleScrollTop = Math.min(ctx._containerEleScrollHeight - ctx._containerEleOffsetHeight, eleBottomValue - ctx._containerEleOffsetHeight);
				yValue = e.pageY - ctx._diffTop + ctx._containerEleScrollTop;
			}
			ctx._setTransformYValue(ctx._dragEle.ele, yValue);
			var currentTopValue = yValue;
			var currentBottomValue = yValue + ctx._blockEleOffsetHeight;
			var minTopValue = ctx._dragEle.pos.y - (ctx._mFactor - (ctx._blockHeight / 2));
			var maxBottomValue = (ctx._dragEle.pos.y + ctx._blockEleOffsetHeight) + (ctx._mFactor - (ctx._blockHeight / 2));
			var eleYValue = ctx._dragEle.pos.y;
			var currentIndex = eleYValue / (ctx._mFactor);
			var blocks = ctx.eleRefs.blocks;
			var aboveSwappableIndex = -1, belowSwappableIndex = blocks.length;
			var i, blockEle;
			for(i = currentIndex - 1; i >= 0; i--) {
				blockEle = blocks[i];
				if (blockEle.getAttribute('drop-state') === 'true') {
					aboveSwappableIndex = i;
					break;
				}
			}
			for(i = currentIndex + 1; i < blocks.length; i++) {
				blockEle = blocks[i];
				if (blockEle.getAttribute('drop-state') === 'true') {
					belowSwappableIndex = i;
					break;
				}
			}
			minTopValue = ctx._dragEle.pos.y - ((currentIndex - aboveSwappableIndex) * ctx._mFactor - (ctx._blockHeight / 2));
			maxBottomValue = (ctx._dragEle.pos.y + ctx._blockEleOffsetHeight) + ((belowSwappableIndex - currentIndex) * ctx._mFactor - (ctx._blockHeight / 2));
			var swapIndex;
			var bSwapNeeded = false;
			if (currentTopValue < minTopValue) {
				bSwapNeeded = true;
				swapIndex = aboveSwappableIndex;
			} else if (currentBottomValue > maxBottomValue) {
				bSwapNeeded = true;
				swapIndex = belowSwappableIndex;
			}
			if (bSwapNeeded && (swapIndex >= 0) && (swapIndex <= blocks.length - 1)) {
				ctx._dragEle.pos.y = swapIndex * (ctx._mFactor);
				var moveEle = blocks[swapIndex];
				if (moveEle !== un) {
					ctx._setTransformYValue(moveEle, eleYValue);
					ctx._swapArray(blocks, currentIndex, swapIndex);
				}
			}
		},
		_onDrop : function(e, ctx) {
			ctx._dragEle.ele.className = ctx._dragEle.ele.className.replace(" DnD-drag", "");
			var blocks = ctx.eleRefs.containerEle.querySelectorAll('.DnD-drag');
			var i;
			for(i = 0; i < blocks.length; i++) {
				blocks[i].className = blocks[i].className.replace(" DnD-drag", "");
			}
			var eleYValue = ctx._dragEle.pos.y;
			ctx._dropIndex = eleYValue / (ctx._mFactor);
			ctx._setTransformYValue(ctx._dragEle.ele, eleYValue);
			ctx.callbacks.onAfterDrop.apply(ctx._dragEle.ele, [ ctx._dragIndex, ctx._dropIndex ]);
			ctx._dragEle = {};
		},
		_onRemoveBlock : function(e, ctx, removeIconWrapper) {
			e.stopPropagation();
			window.setTimeout(function() {
				var removeBlock = removeIconWrapper.parentElement;
				var removeIndex = ctx.eleRefs.blocks.indexOf(removeBlock);
				ctx.removeBlock(removeIndex, ctx.callbacks.onAfterRemove);
			}, 100);
		},
		_swapArray : function(array, from, to) {
			var temp = array[from];
			array[from] = array[to];
			array[to] = temp;
			return array;
		},
		_grouping : function(arrEle) {
			var self = this;
			var childNode = arrEle;
			var activeIndex = (arrEle.length > 2) ? arrEle.length - 2 : 0;
			//Set first child or last child as tabindex active and other inactive
			jQuery(childNode).removeAttr("tabindex");
			jQuery(childNode).attr("tabindex", -1);
			jQuery(childNode[activeIndex]).attr("tabindex", 0);
			//Up arrow key hit
			this._keypress(childNode, 38, function(ele, e) {
				var index = childNode.indexOf(ele);
				if (index === 0) {
					return;
				}
				if (jQuery('.stepTitle')[index - 1]) {
					sap.ui.getCore().byId(self.elems.ariaTextForCarouselBlock).setText(self.callbacks.setAriaTextWhenFocusOnBlock.apply(ele, [ jQuery('.stepTitle')[index - 1].textContent ]));
				}
				jQuery(childNode).removeAttr("tabindex");
				jQuery(childNode).attr("tabindex", -1);
				jQuery(childNode[index - 1]).attr("tabindex", 0);
				jQuery(childNode[index - 1]).focus();
			});
			//Down arrow key hit
			this._keypress(childNode, 40, function(ele, e) {
				var index = childNode.indexOf(ele);
				if (index === childNode.length - 1) {
					return;
				}
				if (jQuery('.stepTitle')[index + 1]) {
					sap.ui.getCore().byId(self.elems.ariaTextForCarouselBlock).setText(self.callbacks.setAriaTextWhenFocusOnBlock.apply(ele, [ jQuery('.stepTitle')[index + 1].textContent ]));
				}
				jQuery(childNode).removeAttr("tabindex");
				jQuery(childNode).attr("tabindex", -1);
				jQuery(childNode[index + 1]).attr("tabindex", 0);
				jQuery(childNode[index + 1]).focus();
			});
		},
		_keypress : function(ele, keyCode, callback) {
			jQuery(ele).keydown(function(e) {
				//e.which is set by jQuery for those browsers that do not normally support e.keyCode.
				var keyCodePress = e.keyCode || e.which;
				if (keyCodePress === keyCode) {
					callback(this, e);
					return false;
				}
			});
		}
	};
}(undefined));