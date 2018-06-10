/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require('sap.apf.modeler.ui.utils.nullObjectChecker');jQuery.sap.declare('sap.apf.modeler.ui.utils.staticValuesBuilder');jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");(function(){'use strict';sap.apf.modeler.ui.utils.StaticValuesBuilder=function(t,o){this.oTextReader=t;this.oOptionsValueModelBuilder=o;};sap.apf.modeler.ui.utils.StaticValuesBuilder.prototype.constructor=sap.apf.modeler.ui.utils.StaticValuesBuilder;sap.apf.modeler.ui.utils.StaticValuesBuilder.prototype.getNavTargetTypeData=function(){var n=[this.oTextReader("globalNavTargets"),this.oTextReader("stepSpecific")];return this.oOptionsValueModelBuilder.convert(n,n.length);};sap.apf.modeler.ui.utils.StaticValuesBuilder.prototype.getSortDirections=function(){var s=[{key:"true",name:this.oTextReader("ascending")},{key:"false",name:this.oTextReader("descending")}];return this.oOptionsValueModelBuilder.prepareModel(s,s.length);};})();
