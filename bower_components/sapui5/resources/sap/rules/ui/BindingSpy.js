/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/base/ManagedObject"],function(q,l,M){"use strict";var s=M.extend("sap.rules.ui.BindingSpy",{metadata:{properties:{propertyToSpy:{type:"any",group:"Misc",bindable:"bindable"}},library:"sap.rules.ui",events:{"change":{}}}});sap.rules.ui.BindingSpy.prototype.setPropertyToSpy=function(v){this.setProperty("propertyToSpy",v);if(v!==null){this.fireChange({value:v});}};return s;},true);
