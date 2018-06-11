sap.ui.require([
    "sap/ui/test/opaQunit"
], function (opaTest) {
    "use strict";
    QUnit.module("Navigation using the press action");
    opaTest("Should navigate to page 2", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyApp();

        //Actions
        When.iPressOnTheNavButton();

        // Assertions
        Then.iSeeTheFormOnPage2();
    });
    
    QUnit.module("Entering text in Controls");
    opaTest("Should enter a text to all", function (Given, When, Then) {
        //Actions
        When.iFillAllInputs();

        // Assertions
        Then.iSeeAllInputsFilled();
    });
    
    QUnit.module("Select using the press action");
    opaTest("Should select an item in a Select", function (Given, When, Then) {
        //Actions
        When.iPressOnSelect();
    });
});