/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/model/odata/type/SByte"],function(S){"use strict";var a=S.extend("sap.ui.comp.smartfield.type.SByte",{constructor:function(f,c){S.apply(this,arguments);this.oFieldControl=null;}});a.prototype.parseValue=function(v,s){var r=S.prototype.parseValue.apply(this,[v,s]);this.oFieldControl(v,s);return r;};a.prototype.getName=function(){return"sap.ui.comp.smartfield.type.SByte";};return a;});
