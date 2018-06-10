/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/Object","sap/m/MessageBox","sap/m/MessageToast","sap/m/MessagePage","sap/m/Link"],function(q,B,M,a,b,L){"use strict";function g(t,T){var m;function n(p){if(!m){m=new b({showHeader:false});t.oNavContainer.addPage(m);}m.setText(p.text);m.setIcon("sap-icon://message-error");if(p.technicalMessage){m.setCustomDescription(new L({text:p.description,press:function(){M.show(p.technicalMessage,{icon:M.Icon.ERROR,title:"Error",actions:[M.Action.OK],defaultAction:M.Action.OK,details:p.technicalDetails||"",contentWidth:"60%"});}}));}else{m.setDescription(p.description||'');}t.oNavContainer.to(m);}return{navigateToMessagePage:n};}return B.extend("sap.fe.controller.NavigationController.js",{constructor:function(t,T){q.extend(this,g(t,T));}});});
