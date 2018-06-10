/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","./changeHandler/PropertyChangeMapper"],function(q,P){"use strict";var I=Object.freeze({"-sortIcon":"showSort","-filterIcon":["showItemFilter","showTimeFilter"],"-searchField":"showSearch","-headerBar":"showHeaderBar"});function g(i){var k;for(k in I){if(q.sap.endsWith(i,k)){return I[k];}}q.sap.log.fatal("Unkonw id of an inner component: "+i);return null;}return{"hideToolbarItem":new P(function(s){var i=s.removedElement.id;return g(i);},false),"unhideToolbarItem":new P(function(s){var i=s.revealedElementId;return g(i);},true),"hideControl":"default","unhideControl":"default","moveControls":"default"};},true);
