/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define(['sap/m/Panel','sap/ushell/library','sap/ushell/override'],function(P,l,o){"use strict";var a=P.extend("sap.ushell.ui.launchpad.Panel",{metadata:{library:"sap.ushell",properties:{translucent:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{headerContent:{type:"sap.ui.core.Control",multiple:true,singularName:"headerContent"},headerBar:{type:"sap.m.Bar",multiple:false}}}});a.prototype.updateAggregation=o.updateAggregation;return a;});
