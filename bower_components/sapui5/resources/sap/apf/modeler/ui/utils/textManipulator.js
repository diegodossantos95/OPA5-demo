/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.utils.textManipulator');(function(){'use strict';sap.apf.modeler.ui.utils.TextManipulator=function(){};sap.apf.modeler.ui.utils.TextManipulator.prototype.constructor=sap.apf.modeler.ui.utils.TextManipulator;sap.apf.modeler.ui.utils.TextManipulator.prototype.addPrefixText=function(p,t){var P=[];if(p){P=p.map(function(s){return t(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)+": "+s;});}return P;};sap.apf.modeler.ui.utils.TextManipulator.prototype.removePrefixText=function(p,t){var a=p.replace(t,"");return a.replace(": ","");};})();
