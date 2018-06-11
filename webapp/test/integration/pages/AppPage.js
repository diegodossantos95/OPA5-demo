sap.ui.require([
    'sap/ui/test/Opa5',
    'sap/ui/test/actions/Press',
    'sap/ui/test/matchers/PropertyStrictEquals'
], function (Opa5, Press, PropertyStrictEquals) {
    "use strict";
    
    var arrangements = new Opa5({
        iStartMyApp : function () {
            return this.iStartMyAppInAFrame("../../index.html");
        }
    });
    
    var actions = new Opa5({
        iPressOnTheButton : function () {
            return this.waitFor({
                viewName : "App",
                id : "pressMeButton",
                controlType: "sap.m.Button",
                actions : new Press(),
                success: function () {                                
                    Opa5.assert.ok(true, "Pressed the button");
                }, 
                errorMessage : "did not find the Button"
            });
        }
    });
    
    var assertions = new Opa5({
        theButtonShouldHaveADifferentText : function () {
            return this.waitFor({
                viewName : "App",
                id : "pressMeButton",
                matchers : new PropertyStrictEquals({
                    name : "text",
                    value : "I got pressed"
                }),
                success : function (oButton) {
                    Opa5.assert.ok(true, "The button's text changed to: " + oButton.getText());
                },
                errorMessage : "did not change the Button's text"
            });
        }
    });
    
    Opa5.extendConfig({
        arrangements : arrangements,
        actions : actions,
        assertions : assertions,
        viewNamespace : "com.sap.CloudSCAME.OPA5Demo.view."
    });
});