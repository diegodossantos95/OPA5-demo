/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define([
    'jquery.sap.global',
    './ShapeMarker',
    'sap/ui/core/Control',
    'sap/ui/layout/form/SimpleForm',
    'sap/ui/layout/Grid',
    'sap/m/Text',
    'sap/m/ObjectNumber',
    'sap/m/Label',
    'sap/ui/core/TextAlign',
    '../common/utils/SelectionDetailUtil'
],
function(jQuery, ShapeMarker, Control, SimpleForm, Grid, Text, ObjectNumber, Label, TextAlign, SelectionDetailUtil) {
    "use strict";

    var ContentPanel = Control.extend('sap.viz.ui5.controls.chartpopover.ContentPanel', {
        metadata : {
            properties : {
                'showLine' : 'boolean'
            },
            publicMethods : ["setContentData"]
        },

        renderer : {
            render : function(oRm, oControl) {
                oRm.write('<div');
                oRm.addClass("viz-controls-chartPopover-contentPanel");
                oRm.writeClasses();
                oRm.writeControlData(oControl);
                oRm.writeAttribute("aria-labelledby", oControl._oDimLabel.getId() + " " + oControl._oForm.getId());
                oRm.writeAttribute('tabindex', -1);
                oRm.write('>');
                oRm.renderControl(oControl._oShapeLabel);
                oRm.renderControl(oControl._oPanel);
                oRm.write('</div>');
            }
        }
    });

    ContentPanel.prototype.init = function() {
        this._measureItemsLen = 0;
        this._maxMeasureLableLen = 15;
        this._maxMeasureValueLen = 12;

        this._oShapeLabel = new ShapeMarker(this._createId('vizShapeMarker'), {
        }).addStyleClass('viz-controls-chartPopover-dimension-marker');
        this._oDimLabel = new Text(this._createId('vizDimensionLabel'), {
        }).addStyleClass('viz-controls-chartPopover-dimension-label');
        
        this._oForm = new SimpleForm({
            editable : false,
            maxContainerCols : 2,
            layout:"ResponsiveGridLayout",
            labelSpanL: 6,
            labelSpanM: 6,
            labelSpanS: 6,
            emptySpanL: 0,
            emptySpanM: 0,
            emptySpanS: 0,
            columnsL: 2,
            columnsM: 2,
            content: [
            ]
        });
        this._oPanel = new Grid({
            width: '100%',
            defaultSpan:"L12 M12 S12",
            content : [
                this._oDimLabel,
                this._oForm
            ]
        }).addStyleClass('viz-controls-chartPopover-Vlt');

    };

    ContentPanel.prototype.setContentData = function(data) {
        var values = data.val, dims = '', measureValue, dimensionValue, item = {}, name;
        this._measureItemsLen = 0;
        if (values) {
            this._oForm.removeAllContent();

            //Check measure's type long text mode or not
            var isLongMode = false, i, displayValue;
            for (i = 0; i < values.length; i++) {
                if (values[i].type && values[i].type.toLowerCase()  === 'dimension') {
                    if (data.isTimeSeries && values.hasOwnProperty("timeDimensions") &&
                            values.timeDimensions.indexOf(i) > -1) {
                        //Time Dimension
                        dimensionValue = values[i].value;
                        var fiscalLabels = (values[i].timeAxis && values[i].timeAxis.getFiscalUnitLabels &&
                            values[i].timeAxis.getFiscalUnitLabels());
                        if(fiscalLabels && fiscalLabels.length > 0 ) {
                            displayValue = dimensionValue.fiscalperiod;
                            if (dimensionValue.fiscalyear) {
                                if (!displayValue || displayValue.length < dimensionValue.fiscalyear.length) {
                                    displayValue = dimensionValue.fiscalyear;
                                }
                            }
                        }
                        else {
                            displayValue = dimensionValue.time;
                            if (dimensionValue.day) {
                                if (!displayValue || displayValue.length < dimensionValue.day.length) {
                                    displayValue = dimensionValue.day;
                                }
                            }
                        }

                        if(values[i].name.length > this._maxMeasureLableLen ||
                             displayValue.length > this._maxMeasureValueLen){
                            isLongMode = true;
                            break;
                        }
                        else {
                            //for fiscal, one or two labels.
                            if (fiscalLabels && fiscalLabels.length > 0 &&
                                fiscalLabels[0].length > this._maxMeasureLableLen) {
                                isLongMode = true;
                                break;
                            }
                            if (fiscalLabels && fiscalLabels.length > 1 &&
                                fiscalLabels[1].length > this._maxMeasureLableLen) {
                                isLongMode = true;
                              break;
                        }
                    }

                    }
                } else if (values[i].type && values[i].type.toLowerCase()  === 'measure') {
                    measureValue = values[i].value;
                    if (measureValue == null) {
                        measureValue = this._getNoValueLabel();
                    }
                    if ((values[i].dataName || values[i].name).length > this._maxMeasureLableLen ||
                            measureValue.toString().length > this._maxMeasureValueLen) {
                        isLongMode = true;
                        break;
                    }
                }
            }
    
            for (i = 0; i < values.length; i++) {
                name = values[i].dataName || values[i].name;
                if (values[i].type && values[i].type.toLowerCase() === 'dimension') {
                    dimensionValue = values[i].value;
                    if (data.isTimeSeries && values.hasOwnProperty("timeDimensions") &&
                        values.timeDimensions.indexOf(i) > -1){
                        //Time Dimension
                        var fiscalLabels = (values[i].timeAxis && values[i].timeAxis.getFiscalUnitLabels &&
                            values[i].timeAxis.getFiscalUnitLabels());
                        if (fiscalLabels && fiscalLabels.length > 0) {
                            item.name = fiscalLabels[0];
                            item.value = dimensionValue.fiscalyear;
                            this._renderLabels(isLongMode, item, data.isTimeSeries);
                            if (fiscalLabels.length > 1) {
                                item.name = fiscalLabels[1];
                                item.value = dimensionValue.fiscalperiod;
                                this._renderLabels(isLongMode, item, data.isTimeSeries);
                            }
                        }
                        else {
                            if (dimensionValue.time) {
                                item.name = name;
                                item.value = dimensionValue.time;
                                this._renderLabels(isLongMode, item, data.isTimeSeries);
                            }
                            if (dimensionValue.day) {
                                item.name = dimensionValue.time ? "" : name;
                                item.value = dimensionValue.day;
                                this._renderLabels(isLongMode, item, data.isTimeSeries);
                            }
                        }
                    } else {
                        if (dims == null) {
                            dims = this._getNoValueLabel();
                        } else if (dims.length > 0) {
                            if (dimensionValue === null) {
                                dims = dims + ' - ' + this._getNoValueLabel();
                            } else {
                                dims = dims + ' - ' + dimensionValue;
                            }
                        } else {
                            if (dimensionValue === null) {
                                dims = this._getNoValueLabel();
                            } else {
                            dims = dimensionValue.toString();
                            }
                        }
                    }
                } else if (values[i].type && values[i].type.toLowerCase()  === 'measure') {
                    item.name = name;
                    item.value = values[i].value;
                    item.unit = values[i].unit;
                    this._renderLabels(isLongMode, item);
                }
            }

            var isPeriodicWaterfall = function(data) {
				var result = false;
				if (data.selectByTimeAxisGroup && data.val) {
					var measureCount = 0;
					for (var i = 0; i < data.val.length; i++) {
						if (data.val[i].type === 'Measure') {
							measureCount++;
						}
					}
					if (measureCount > 1) {
						result = true;
					}
				}
				return result;
			};
    
            if (!isPeriodicWaterfall(data) && typeof data.color === 'string') {
                var markerSize = this._oDimLabel.$().css('margin-left');
                if (markerSize) {
                    markerSize = parseInt(markerSize.substr(0, markerSize.length - 2), 10);
                    this._oShapeLabel.setMarkerSize(markerSize);
                }
                this._oShapeLabel.setColor(data.color).setType((data.shape ? data.shape : 'square'));
                if (this.getShowLine()) {
                    this._oShapeLabel.setShowWithLine(data.type).setLineInfo(data.lineInfo);
                } else {
                    this._oShapeLabel.setShowWithLine(undefined);
                }
                if (data.stroke && data.stroke.visible) {
                    //Draw marker with stroke
                    this._oShapeLabel.setStroke(data.stroke);
                }
            } else {
                this._oShapeLabel.setType(null);
                this._oShapeLabel.setShowWithLine(undefined);
            }
            
            if (data.pattern) {
                this._oShapeLabel.setPattern(data.pattern);
            } else {
                this._oShapeLabel.setPattern(null);
            }

            if (dims && dims.length > 0) {
                this._oDimLabel.setVisible(true);
                this._oDimLabel.setText(dims);
            } else {
                this._oDimLabel.setVisible(false);
            }
    
            this._measureItemsLen = data.val.length;
        }
    };
    
    ContentPanel.prototype._renderLabels = function(isLongMode, item, isTimeSeries){
        var valueLabel;
        if (isLongMode) {
            this._oForm.setLabelSpanS(12);
            if (item.name !== '') {
                this._oForm.addContent(new Text({
                    text: item.name
                }).addStyleClass('viz-controls-chartPopover-measure-labels viz-controls-chartPopover-measure-labels-wrapper-name'));
            }
            valueLabel = new ObjectNumber({
                number: item.value,
                unit: item.unit,
                textAlign: TextAlign.Begin
            }).addStyleClass('viz-controls-chartPopover-measure-labels viz-controls-chartPopover-measure-labels-wrapper-value');
            this._oForm.addContent(valueLabel);
            if (isTimeSeries && (item.name === '')) {
                valueLabel.addStyleClass('viz-controls-chartPopover-timeDayDimValue');
            }
        } else {
            this._oForm.setLabelSpanS(6);
            this._oForm.addContent(new Label({
                text: item.name
            }).addStyleClass('viz-controls-chartPopover-measure-labels viz-controls-chartPopover-measure-name'));
            if (item.value !== null) {
                valueLabel = new ObjectNumber({
                    number: item.value,
                    unit: item.unit,
                    textAlign: TextAlign.End
                }).addStyleClass('viz-controls-chartPopover-measure-labels viz-controls-chartPopover-measure-value');
            } else {
                valueLabel = new ObjectNumber({
                    number: this._getNoValueLabel(),
                    textAlign: TextAlign.End
                }).addStyleClass('viz-controls-chartPopover-measure-labels viz-controls-chartPopover-measure-value');
            }
            
            if (isTimeSeries && (item.name === '')) {
                //Time axis and min level is second.
                valueLabel.addStyleClass('viz-controls-chartPopover-timeDayValue');
            }
            this._oForm.addContent(valueLabel);
        }
    };

    ContentPanel.prototype.isMultiSelected = function() {
        return this._measureItemsLen === 0;
    };

    /**
     * Creates an id for an Element prefixed with the control id
     *
     * @return {string} id
     * @public
     */
    ContentPanel.prototype._createId = function(sId) {
        return this.getId() + "-" + sId;
    };
    
    ContentPanel.prototype._getNoValueLabel = function(){
        return sap.viz.extapi.env.Language.getResourceString("IDS_ISNOVALUE");
    };

    ContentPanel.prototype.exit = function(sId) {
        if (this._oForm) {
            this._oForm.destroy();
            this._oForm = null;
        }

        if (this._oShapeLabel) {
            this._oShapeLabel.destroy();
            this._oShapeLabel = null;
        }

        if (this._oDimLabel) {
            this._oDimLabel.destroy();
            this._oDimLabel = null;
        }

        if (this._oPanel) {
            this._oPanel.destroy();
            this._oPanel = null;
        }
    };
    
    return ContentPanel;
});
