/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/commons/util/HtmlElement","sap/suite/ui/commons/statusindicator/SimpleShape"],function(H,S){"use strict";var P=S.extend("sap.suite.ui.commons.statusindicator.Path",{metadata:{library:"sap.suite.ui.commons",properties:{d:{type:"string",defaultValue:null}}}});P.prototype._getSimpleShapeElement=function(p){var o=new H("path");o.setId(this._buildIdString(p));o.setAttribute("d",this.getD());o.setAttribute("stroke-width",this.getStrokeWidth());o.setAttribute("stroke",this._getCssStrokeColor());if(this.aCustomStyleClasses){this.aCustomStyleClasses.forEach(o.addClass.bind(o));}return o;};return P;});
