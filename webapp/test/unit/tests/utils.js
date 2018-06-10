sap.ui.require([
  "com/sap/CloudSCAME/OPA5Demo/model/utils",
  "sap/ui/thirdparty/sinon-qunit"
],function (utils) {
  "use strict";

  QUnit.test("Should use Cozy class for touch devices", function (assert) {
    // Arrange
    this.stub(sap.ui.Device, "support", {
      touch: true
    });

    // System under test
    this.sDensityClass = utils.getContentDensityClass();

    // Assert
    assert.strictEqual(this.sDensityClass, "sapUiSizeCozy", "The class is correct");
  });
    
  QUnit.test("Should use Compact class for non-touch devices", function (assert) {
    // Arrange
    this.stub(sap.ui.Device, "support", {
      touch: false
    });

    // System under test
    this.sDensityClass = utils.getContentDensityClass();

    // Assert
    assert.strictEqual(this.sDensityClass, "sapUiSizeCompact", "The class is correct");
  });
});