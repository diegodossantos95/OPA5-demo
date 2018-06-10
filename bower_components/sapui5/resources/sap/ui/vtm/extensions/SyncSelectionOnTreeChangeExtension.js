/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Control","../Extension"],function(q,S,a){"use strict";var b=a.extend("sap.ui.vtm.extensions.SyncSelectionOnTreeChangeExtension",{initialize:function(){this._selectedItemsByPanel=new Map();this.applyPanelHandler(function(p){var t=p.getTree();t.attachSelectionChanged(function(e){if(!this.getEnabled()){return;}var s=t.getSelectedItems();this._selectedItemsByPanel.set(p,s);}.bind(this));t.attachModelUpdated(function(e){if(!this.getEnabled()){return;}if(!this._selectedItemsByPanel.has(p)){return;}var s=t.getSelectedItems();var c=this._selectedItemsByPanel.get(p);this._fireSelectionChangedIfSelectedItemsChanged(t,s,c);}.bind(this));}.bind(this));},constructor:function(i,s){a.apply(this,arguments);},_fireSelectionChangedIfSelectedItemsChanged:function(t,n,o){var c=sap.ui.vtm.ArrayUtilities.toSet(n);var d=sap.ui.vtm.ArrayUtilities.toSet(o);var e=[];var r=[];n.forEach(function(i){if(!d.has(i)){e.push(i);}});o.forEach(function(i){if(!c.has(i)){r.push(i);}});if(e.length||r.length){t.fireSelectionChanged({addedItems:e,removedItems:r,userInteraction:false});}}});return b;});
