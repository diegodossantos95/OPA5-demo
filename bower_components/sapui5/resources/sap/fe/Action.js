/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(['sap/m/Button','sap/m/ButtonType'],function(B,a){"use strict";var B=B.extend("sap.fe.Action",{metadata:{properties:{actionName:"string",emphasized:'boolean',mode:'string',multiplicityFrom:{type:"int"},multiplicityTo:{type:"int"}},events:{"callAction":{}}},onBeforeRendering:function(){if(this.getEmphasized()){this.setType(a.Emphasized);}},onclick:function(e){this.fireCallAction({actionName:this.getActionName(),actionLabel:this.getText()});},renderer:{}});return B;},true);
