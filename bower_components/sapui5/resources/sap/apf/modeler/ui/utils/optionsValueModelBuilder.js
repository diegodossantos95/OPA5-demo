/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require('sap.apf.modeler.ui.utils.nullObjectChecker');jQuery.sap.declare('sap.apf.modeler.ui.utils.optionsValueModelBuilder');(function(){'use strict';var D=500;var n=new sap.apf.modeler.ui.utils.NullObjectChecker();sap.apf.modeler.ui.utils.OptionsValueModelBuilder=function(){};sap.apf.modeler.ui.utils.OptionsValueModelBuilder.prototype.constructor=sap.apf.modeler.ui.utils.OptionsValueModelBuilder;sap.apf.modeler.ui.utils.OptionsValueModelBuilder.prototype.prepareModel=function(o,l){var m;if(!n.checkIsNotNullOrUndefined(l)){l=D;}m=new sap.ui.model.json.JSONModel();m.setSizeLimit(l);m.setData({Objects:o});return m;};sap.apf.modeler.ui.utils.OptionsValueModelBuilder.prototype.convert=function(a,l){var o=[],b;if(!n.checkIsNotNullOrUndefinedOrBlank(a)){return;}a.forEach(function(v){if(!n.checkIsNotNullOrUndefined(v)){return;}b={};b.key=v instanceof Object?v.key:v;b.name=v instanceof Object?v.name:v;o.push(b);});return sap.apf.modeler.ui.utils.OptionsValueModelBuilder.prototype.prepareModel(o,l);};})();
