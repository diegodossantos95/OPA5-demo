sap.ui.require([
    'sap/ui/test/Opa5',
    'sap/ui/test/actions/Press',
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/test/matchers/Properties"
], function (Opa5, Press, EnterText, Ancestor, Properties) {
    "use strict";
    
    var arrangements = new Opa5({
        iStartMyApp : function () {
            return this.iStartMyAppInAFrame("../../index.html");
        }
    });
    
    var actions = new Opa5({
        iPressOnTheNavButton : function () {
            return this.waitFor({
                id : "navigationButton",
                // For pressing controls use the press action
                // The button is busy so OPA will automatically wait until you can press it
                actions: new Press(),
                errorMessage: "The navigation-button was not pressable"
            });
        },
        
        iFillAllInputs: function(){
            return this.waitFor({
                controlType: "sap.m.Input",
                actions: new EnterText({
                    text: "Hello from OPA actions"
                }),
                errorMessage: "There was no Input"
            });
        },
        
        iPressOnSelect: function(){
            return this.waitFor({
                id: "mySelect",
                actions: new Press(),
                success: function(oSelect) {
                    this.waitFor({
                        controlType: "sap.ui.core.Item",
                        matchers: [
                            new Ancestor(oSelect),
                            new Properties({ key: "Germany"})
                        ],
                        actions: new Press(),
                        success: function() {
                            Opa5.assert.strictEqual(oSelect.getSelectedKey(), "Germany", "Selected Germany");
                        },
                        errorMessage: "Cannot select Germany from mySelect"
                    });
                },
                errorMessage: "Could not find mySelect"
            });
        }
    });
    
    var assertions = new Opa5({
        iSeeTheFormOnPage2 : function () {
            return this.waitFor({
                id : "myForm",
                success: function () {
                    Opa5.assert.ok(true, "Navigation to page 2 was a success");
                },
                errorMessage: "Was not able to navigate to page 2"
            });
        },
        
        iSeeAllInputsFilled: function(){
            return this.waitFor({
                controlType: "sap.m.Input",
                success: function (aInputs) {
                    aInputs.forEach(function (oInput) {
                        Opa5.assert.strictEqual(oInput.getValue(), "Hello from OPA actions", oInput + " contains the text");
                    });
                },
                errorMessage: "The text was not entered"
            });
        }
    });
    
    Opa5.extendConfig({
        arrangements : arrangements,
        actions : actions,
        assertions : assertions,
        autoWait : true,
        viewName: "App",
        viewNamespace : "com.sap.CloudSCAME.OPA5Demo.view."
    });
});