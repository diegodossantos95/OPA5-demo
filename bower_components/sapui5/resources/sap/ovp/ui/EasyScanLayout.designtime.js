/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/comp/navpopover/RTAHandler","sap/ovp/ui/ComponentContainerDesigntimeMetadata"],function(R,C){"use strict";return{actions:{reveal:{changeType:"unhideControl"}},aggregations:{content:{domRef:".sapUiComponentContainer",actions:{move:"moveControls",changeOnRelevantContainer:true},propagateMetadata:function(e){var t=e.getMetadata().getName();if(t==="sap.ui.core.ComponentContainer"){return C;}else{return{actions:null};}},propagateRelevantContainer:false}},name:{singular:sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Card"),plural:sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Cards")}};},false);
