/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Control","../Extension"],function(q,S,a){"use strict";var b=a.extend("sap.ui.vtm.extensions.SelectionKeepingExtension",{initialize:function(){this._selectionSetsByPanel=new Map();this.applyPanelHandler(function(p){var t=p.getTree();t.attachSelectionChanged(function(e){if(!this.getEnabled()){return;}var i=e.getParameter("addedItems");var c=e.getParameter("removedItems");this._updateSelectionSet(p,i,c);}.bind(this));t.attachExpandedChanged(function(e){if(!this.getEnabled()){return;}if(e.getParameter("expanded")!==true){return;}this._synchroniseSelection(p);}.bind(this));}.bind(this));},constructor:function(i,s){a.apply(this,arguments);},_synchroniseSelection:function(p){var t=p.getTree();var s=this._selectionSetsByPanel.get(p);if(s){var i=[];s.forEach(function(c){if(t.getItem(c.id)){i.push(c);}});t.setSelectedItems(i,false);}},_updateSelectionSet:function(p,s,u){var c=this._selectionSetsByPanel.get(p);if(!c){c=new Set();this._selectionSetsByPanel.set(p,c);}if(u){u.forEach(function(i){c.delete(i);});}if(s){s.forEach(function(i){c.add(i);});}}});return b;});
