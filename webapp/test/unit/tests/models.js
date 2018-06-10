sap.ui.require([
  "com/sap/CloudSCAME/OPA5Demo/model/models",
  "sap/ui/thirdparty/sinon-qunit"
],function (models) {
  "use strict";

  function isPhoneTestCase(assert, bIsPhone) {
    // Arrange
    this.stub(sap.ui.Device, "system", {
      phone: bIsPhone
    });

    // System under test
    this.oDeviceModel = models.getDeviceModel();

    // Assert
    assert.strictEqual(this.oDeviceModel.getData().isPhone, bIsPhone, "IsPhone property is correct");
  }
        
  function isTouchTestCase(assert, bIsTouch) {
    // Arrange
    this.stub(sap.ui.Device, "support", {
      touch: bIsTouch
    });

     // System under test
    this.oDeviceModel = models.getDeviceModel();

    // Assert
    assert.strictEqual(this.oDeviceModel.getData().isTouch, bIsTouch, "IsTouch property is correct");
  }


  QUnit.test("Should initialize a device model for desktop", function (assert) {
    isPhoneTestCase.call(this, assert, false);
  });

  QUnit.test("Should initialize a device model for phone", function (assert) {
    isPhoneTestCase.call(this, assert, true);
  });

  QUnit.test("Should initialize a device model for non touch devices", function (assert) {
    isTouchTestCase.call(this, assert, false);
  });

  QUnit.test("Should initialize a device model for touch devices", function (assert) {
    isTouchTestCase.call(this, assert, true);
  });

  QUnit.test("The binding mode of the device model should be one way", function (assert) {
    // System under test
    this.oDeviceModel = models.getDeviceModel();

    // Assert
    assert.strictEqual(this.oDeviceModel.getDefaultBindingMode(), "OneWay", "Binding mode is correct");
  });
});
