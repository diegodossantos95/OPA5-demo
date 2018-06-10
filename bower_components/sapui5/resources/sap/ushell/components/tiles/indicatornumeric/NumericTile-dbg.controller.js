sap.ui.define(['sap/ushell/components/tiles/generic'],
	function(generic) {
	"use strict";

    var NumericTileController = generic.extend("sap.ushell.components.tiles.indicatornumeric.NumericTile", {
        onInit :  function(){
            this.KPI_VALUE_REQUIRED = true;
        },

        doProcess : function(kpiValue,sThresholdObject){
            var that = this;
            this.CALCULATED_KPI_VALUE = kpiValue;
            /*var evalValue =*/ this.DEFINITION_DATA.EVALUATION_VALUES;
            var applyColor = this.getTrendColor(sThresholdObject);
            var trendIndicator = this.getTrendIndicator(sThresholdObject.trendValue);
            var oScaledValue = "";
            var calculatedValueForScaling = this.CALCULATED_KPI_VALUE;
            if (this.oConfig.EVALUATION.SCALING == -2){
                calculatedValueForScaling *= 100;
                this.getView().oNVConfContS.setFormatterValue(false);
            }
            var c = this.isCurrencyMeasure(this.oConfig.EVALUATION.COLUMN_NAME);
            oScaledValue = sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(calculatedValueForScaling),this.oConfig.EVALUATION.SCALING,this.oConfig.EVALUATION.DECIMAL_PRECISION, c, this.CURRENCY_CODE);
            if (this.oConfig.EVALUATION.SCALING == -2) {
                this._updateTileModel({
                    scale : "%"
                });
            }
            this._updateTileModel({
                value : oScaledValue.toString(),
                valueColor : applyColor,
                indicator : trendIndicator
            });
            if (that.oConfig.TILE_PROPERTIES.frameType == sap.m.FrameType.OneByOne){
                this.oKpiTileView.oGenericTile.setState(sap.m.LoadState.Loaded);
                this.setToolTip(applyColor,calculatedValueForScaling,"NT");

            } else {
                that.getView().getViewData().parentController._updateTileModel(this.getTile().getModel().getData());
                that.getView().getViewData().deferredObj.resolve();
                sap.ushell.components.tiles.indicatorTileUtils.util.setUnsetCallInProgress(that.oConfig.TILE_PROPERTIES.id + "defferedLeft", false);
            }
            this.setToolTip(applyColor,calculatedValueForScaling,"NT");
            if (!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(this.oConfig)) {
                if (that.chipCacheTime) {
                    sap.ushell.components.tiles.indicatorTileUtils.util.scheduleFetchDataJob.call(this, that.oTileApi.visible.isVisible());
                }
            }
        },

        doDummyProcess : function() {
            var that = this;
            this.setTextInTile();
            if (!(that.oConfig.BLANKTILE || that.oConfig.TILE_PROPERTIES.blankTile)) {
                that._updateTileModel({
                    value : "10.34",
                    scale : "M",
                    valueColor : sap.m.ValueColor.Neutral,
                    indicator : sap.m.DeviationIndicator.None
                });
            } else {
                this.oKpiTileView.oNVConfContS.setIcon('sap-icon://BusinessSuiteInAppSymbols/icon-multiple-charts');
            }
            this.oKpiTileView.oGenericTile.setState(sap.m.LoadState.Loaded);
        }
    });
    return NumericTileController;
});
