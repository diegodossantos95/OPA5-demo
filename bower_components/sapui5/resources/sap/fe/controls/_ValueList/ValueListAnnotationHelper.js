/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
(function(){"use strict";jQuery.sap.declare("sap.fe.controls._ValueList.ValueListAnnotationHelper");sap.fe.controls._ValueList.ValueListAnnotationHelper={getCollectionEntitySet:function(v){var V=v.getObject();return V.$model.getMetaModel().createBindingContext("/"+V.CollectionPath);},getValueListProperty:function(p){var v=p.getModel();var V=v.getObject("/");return V.$model.getMetaModel().createBindingContext('/'+V.CollectionPath+'/'+p.getObject());},formatIconTabFilterText:function(i,c){var r=this.getModel("sap.fe.i18n").getResourceBundle();return r.getText(i);},formatSelectedItemTitle:function(s,c){var r=this.getModel("sap.fe.i18n").getResourceBundle();if(c&&c.conditions&&c.conditions.length!==0){return r.getText(s,[c.conditions.length]);}else{return r.getText(s,[0]);}},formatedTokenText:function(f,c){var r="";if(c){var C=this.getModel("cm");var o=C.getFilterOperatorConfig().getOperator(c.operator);r=o.format(c.values,c,f);}return r;}};})();
