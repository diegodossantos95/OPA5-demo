/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
 
 jQuery.sap.declare("sap.uiext.inbox.InboxTaskCategoryFilterList");
 
 sap.ui.ux3.FacetFilterList.extend("sap.uiext.inbox.InboxTaskCategoryFilterList",  {
		init: function(){
			if (sap.ui.ux3.FacetFilterList.prototype.init) { 
			  sap.ui.ux3.FacetFilterList.prototype.init.apply(this, arguments); 
			}
			this._oListBox.removeItem(this._oItemAll);
			this._oItemAll = undefined;
		},
		renderer : function(oRm, oControl) {
			sap.ui.ux3.FacetFilterListRenderer.render.apply(this, arguments);
		},
		removeAllItems : function() {
			this._oListBox.removeAllItems();
		},
		destroyItems : function() {
			this._oListBox.destroyItems();
		},
		updateText4All : function() {
		},
		onBeforeRendering : function() {
			if (this.bFullHeight) {
			} else {
				this._oListBox.setVisibleItems(5)
			}
			var k = this.getSelectedKeys();
			if (k && k.length > 0) {
				this._oListBox.setSelectedKeys(k);
				this._bAllOnly = false
			}
		},updateItems : function() {
			this.updateAggregation('items');
			var s = this._oListBox.getSelectedKeys();

		},onSelect : function(f, e) {
			var s = this._oListBox.getSelectedKeys();
			this._bAllOnly = false
			this.setProperty('selectedKeys', s, true);
			var S = [];
			var a = [];
			var A = this._oListBox.getSelectedItems();
			if (!this._bAllOnly) {
				for (var i = 0; i < A.length; i++) {
					if (A[i] != this._oItemAll) {
						S.push(this.indexOfItem(A[i]));
						a.push(A[i])
					}
				}
			}
			this.fireSelect({id: f.getId(),all: this._bAllOnly,selectedIndices: S,selectedItems: a})
			}
});