/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function(){'use strict';sap.ui.jsview("sap.apf.ui.reuse.view.smartFilterBar",{getControllerName:function(){return"sap.apf.ui.reuse.controller.smartFilterBar";},createContent:function(c){var v=this,e,s,p,S;e=v.getViewData().oSmartFilterBarConfiguration.entitySet;s=v.getViewData().oSmartFilterBarConfiguration.id;p=v.getViewData().oCoreApi.getSmartFilterBarPersistenceKey(s);S=new sap.ui.comp.smartfilterbar.SmartFilterBar(c.createId("idAPFSmartFilterBar"),{entitySet:e,controlConfiguration:v.getViewData().controlConfiguration,initialized:c.afterInitialization.bind(c),search:c.handlePressOfGoButton.bind(c),persistencyKey:p,considerAnalyticalParameters:true,customData:{key:"dateFormatSettings",value:{"UTC":true}},useDateRangeType:true,liveMode:true,filterChange:c.validateFilters.bind(c)});v.setParent(v.getViewData().parent);return S;}});}());
