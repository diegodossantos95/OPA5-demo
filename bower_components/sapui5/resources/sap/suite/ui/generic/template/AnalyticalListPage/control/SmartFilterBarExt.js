sap.ui.define(["sap/ui/comp/smartfilterbar/SmartFilterBar","sap/m/SegmentedButton","sap/m/SegmentedButtonItem"],function(S,a,b){"use strict";var c=S.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt",{metadata:{events:{switchToVisualFilter:{}}},renderer:{}});c.prototype.checkSearchAllowed=function(s){if(s&&s.oSmartFilterbar){var A=s.oSmartFilterbar.determineMandatoryFilterItems(),f=s.oSmartFilterbar.getFilterData(),t=s.oController.getView().getModel("_templPriv"),I=true;for(var i=0;i<A.length;i++){if(!f[A[i].getName()]){I=false;break;}}if(I){var o=S.prototype.verifySearchAllowed.apply(this,arguments);if(o.hasOwnProperty("error")||o.hasOwnProperty("mandatory")){I=false;}}t.setProperty("/alp/searchable",I);}};});
