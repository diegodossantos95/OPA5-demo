/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
 
 jQuery.sap.declare("sap.uiext.inbox.InboxTile");
 
 sap.m.StandardTile.extend("sap.uiext.inbox.InboxTile", {
	init: function(){
		if (sap.m.StandardTile.prototype.init) { 
			sap.m.StandardTile.prototype.init.apply(this, arguments); 
		    }
		this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
	}, 
	
	metadata : {                             
		properties : {}
	},
	renderer : {}
});