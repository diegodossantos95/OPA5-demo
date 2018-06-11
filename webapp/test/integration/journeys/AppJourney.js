sap.ui.require([
    "sap/ui/test/opaQunit"
], function (opaTest) {
    "use strict";
    opaTest("Should press a Button", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyApp();

        //Actions
        When.iPressOnTheButton();

        // Assertions
        Then.theButtonShouldHaveADifferentText();
    });
});