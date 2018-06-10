sap.ui.define(["./AxisTimeStrategyBase", "sap/gantt/misc/Format"], function (AxisTimeStrategyBase, Format) {
	"use strict";
	
	var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.gantt");
	sap.gantt.axistime.StepwiseTimeLineOptions = {
		"FiveMinutes": {
			text: oRb.getText("SWZS_FIVE_MINUTES"),
			innerInterval: {
				unit: sap.gantt.config.TimeUnit.minute,
				span: 5,
				range: 32 //2rem
			},
			largeInterval: {
				unit: sap.gantt.config.TimeUnit.hour,
				span: 1,
				//first label e.g.: 9AM / July 12, 2016; others e.g.: "10AM"
				pattern: "ha / MMMM dd, yyyy "
			},
			smallInterval: {
				unit: sap.gantt.config.TimeUnit.minute,
				span: 5,
				//e.g. 00, 05, ...55
				pattern: "mm "
			}
		},
		"FifteenMinutes": {
			text: oRb.getText("SWZS_FIFTEEN_MINUTES"),
			innerInterval: {
				unit: sap.gantt.config.TimeUnit.minute,
				span: 15,
				range: 48
			},
			largeInterval: {
				unit: sap.gantt.config.TimeUnit.hour,
				span: 1,
				//first label e.g.: 9AM / July 12, 2016; others e.g.: "10AM"
				pattern: "ha / MMMM dd, yyyy "
			},
			smallInterval: {
				unit: sap.gantt.config.TimeUnit.minute,
				span: 15,
				pattern: "mm "
			}
		},
		"Hour": {
			text: oRb.getText("SWZS_HOUR"),
			innerInterval: {
				unit: sap.gantt.config.TimeUnit.hour,
				span: 1,
				range: 48
			},
			largeInterval: {
				unit: sap.gantt.config.TimeUnit.day,
				span: 1,
				//first label e.g. July 12, 2016; others e.g. July 13
				pattern: "MMMM dd, yyyy "
			},
			smallInterval: {
				unit: sap.gantt.config.TimeUnit.hour,
				span: 1,
				pattern: "HH:mm "
			}
		},
		"SixHours": {
			text: oRb.getText("SWZS_SIX_HOURS"),
			innerInterval: {
				unit: sap.gantt.config.TimeUnit.hour,
				span: 6,
				range: 64
			},
			largeInterval: {
				unit: sap.gantt.config.TimeUnit.day,
				span: 1,
				//first label e.g. July 12, 2016; others e.g. July 13
				pattern: "MMMM dd, yyyy "
			},
			smallInterval: {
				unit: sap.gantt.config.TimeUnit.hour,
				span: 6,
				pattern: "HH:mm "
			}
		},
		"DayDate": {
			text: oRb.getText("SWZS_DATE_1"),
			innerInterval: {
				unit: sap.gantt.config.TimeUnit.day,
				span: 1,
				range: 64
			},
			largeInterval: {
				unit: sap.gantt.config.TimeUnit.week,
				span: 1,
				//first label e.g.: Jan 2015, Week 04; others e.g. Feb, Mar...
				pattern: "MMM yyyy, 'Week' ww  "
			},
			smallInterval: {
				unit: sap.gantt.config.TimeUnit.day,
				span: 1,
				//e.g. Mon 22, Tue 23
				pattern: sap.ui.getCore().getConfiguration().getRTL() ? "dd EEE " : "EEE dd "
			}
		},
		"Date": {
			text: oRb.getText("SWZS_DATE_2"),
			innerInterval: {
				unit: sap.gantt.config.TimeUnit.day,
				span: 1,
				range: 32
			},
			largeInterval: {
				unit: sap.gantt.config.TimeUnit.week,
				span: 1,
				//first label e.g.: Jan 2015, Week 04; others e.g. Feb, Mar...
				pattern: "MMM yyyy, 'Week' ww  "
			},
			smallInterval: {
				unit: sap.gantt.config.TimeUnit.day,
				span: 1,
				pattern: "dd "
			}
		},
		"CWWeek": {
			text: oRb.getText("SWZS_WEEK_1"),
			innerInterval: {
				unit: sap.gantt.config.TimeUnit.week,
				span: 1,
				range: 56
			},
			largeInterval: {
				unit: sap.gantt.config.TimeUnit.month,
				span: 1,
				//first label: Jan 2015, others: Feb, Mar...
				pattern: "MMM yyyy "
			},
			smallInterval: {
				unit: sap.gantt.config.TimeUnit.week,
				span: 1,
				//e.g. CW 01, CW 02...
				pattern: sap.ui.getCore().getConfiguration().getRTL() ? "'CW' ww  " : "'CW' ww  "
			}
		},
		"WeekOfYear": {
			text: oRb.getText("SWZS_WEEK_2"),
			innerInterval: {
				unit: sap.gantt.config.TimeUnit.week,
				span: 1,
				range: 32
			},
			largeInterval: {
				unit: sap.gantt.config.TimeUnit.month,
				span: 1,
				//first label: Jan 2015, others: Feb, Mar...
				pattern: "MMM yyyy "
			},
			smallInterval: {
				unit: sap.gantt.config.TimeUnit.week,
				span: 1,
				//e.g. 01, 02..., 53
				pattern: "ww "
			}
		},
		"Month": {
			text: oRb.getText("SWZS_MONTH"),
			innerInterval: {
				unit: sap.gantt.config.TimeUnit.month,
				span: 1,
				range: 48
			},
			largeInterval: {
				unit: sap.gantt.config.TimeUnit.quarter,
				span: 1,
				pattern: "yyyy QQQ "
			},
			smallInterval: {
				unit: sap.gantt.config.TimeUnit.month,
				span: 1,
				pattern: "MMM "
			}
		},
		"Quarter": {
			text: oRb.getText("SWZS_QUARTER"),
			innerInterval: {
				unit: sap.gantt.config.TimeUnit.month,
				span: 3,
				range: 48
			},
			largeInterval: {
				unit: sap.gantt.config.TimeUnit.year,
				span: 1,
				//first label: 2015, Q1, others Q2, Q3, Q4, 2016 Q1, Q2...
				pattern: "yyyy "
			},
			smallInterval: {
				unit: sap.gantt.config.TimeUnit.month,
				span: 3,
				pattern: "QQQ "
			}
		},
		"Year": {
			text: oRb.getText("SWZS_YEAR"),
			innerInterval: {
				unit: sap.gantt.config.TimeUnit.year,
				span: 1,
				range: 48
			},
			largeInterval: {
				unit: sap.gantt.config.TimeUnit.year,
				span: 5,
				pattern: "yyyy "
			},
			smallInterval: {
				unit: sap.gantt.config.TimeUnit.year,
				span: 1,
				pattern: "yyyy "
			}
		}
	};
	
	var StepwiseTimeLineOptions = sap.gantt.axistime.StepwiseTimeLineOptions;
	
	/**
	 * Constructor for a new StepwiseZoomStrategy.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The class allows you to define a zoom strategy whose time line options are stepwise, i.e. the width of each time line option
	 * is pre-defined and won't be changed during zooming.
	 * @extends sap.gantt.axistime.AxisTimeStrategyBase
	 * @version 1.50.5
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.axistime.StepwiseZoomStrategy
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var StepwiseZoomStrategy = AxisTimeStrategyBase.extend("sap.gantt.axistime.StepwiseZoomStrategy", {
		metadata: {
			library : "sap.gantt"
		}
	});
	
	/**
	 * Initializes member variables which are needed later on.
	 *
	 * @private
	 */
	StepwiseZoomStrategy.prototype.init = function() {
		//set default values for the properties from parent class
		var oTimeLineOption = StepwiseTimeLineOptions.DayDate;
		this.setProperty("timeLineOption", oTimeLineOption, true);
		this.setProperty("timeLineOptions", StepwiseTimeLineOptions, true);
		this.setProperty("zoomLevel", this._getIndexOfTimeLineOption(oTimeLineOption, StepwiseTimeLineOptions), true);
		this.setProperty("mouseWheelZoomType", sap.gantt.MouseWheelZoomType.None, true);
		//set unused properties to null
		this.setProperty("finestTimeLineOption", null, true);
		this.setProperty("coarsestTimeLineOption", null, true);
		this.setProperty("zoomLevels", 0, true);
		
		//private variables
		this._oTotalHorizonBeforeExtension = null;
	};
	
	StepwiseZoomStrategy.prototype.applySettings = function () {
		AxisTimeStrategyBase.prototype.applySettings.apply(this, arguments);
		this._updateZoomRateArray();
		return this;
	};

	StepwiseZoomStrategy.prototype.createAxisTime = function (oLocale) {
		AxisTimeStrategyBase.prototype.createAxisTime.apply(this, arguments);
		this.setZoomLevel(this._getIndexOfTimeLineOption(this.getTimeLineOption(), StepwiseTimeLineOptions));
		this._Locale = oLocale;
		return this;
	};

	/**
	 * Sets the visible horizon of StepwiseZoomStrategy.
	 * 
	 * @param {object} oVisibleHorizon visible horizon of StepwiseZoomStrategy
	 * @public
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setVisibleHorizon = function (oVisibleHorizon) {
		//redraw will call syncContent(), in there rate will be updated
		AxisTimeStrategyBase.prototype.setVisibleHorizon.apply(this, arguments);
		this.fireRedrawRequest(true, "visibleHorizonUpdated");
		return this;
	};
	
	/**
	 * Sets the total horizon of StepwiseZoomStrategy. The time range and view range of this.getAxisTime() will also be updated, the rate will remain unchanged.
	 * 
	 * @param {object} oTotalHorizon total horizon of StepwiseZoomStrategy
	 * @public
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setTotalHorizon = function (oTotalHorizon) {
		//redraw will call syncContent(), in there rate will be updated
		AxisTimeStrategyBase.prototype.setTotalHorizon.apply(this, arguments);
		var oAxisTime = this.getAxisTime();
		if (oAxisTime) {
			//update time range
			oAxisTime.setTimeRange([Format.getTimeStampFormatter().parse(oTotalHorizon.getStartTime()),
			                                 Format.getTimeStampFormatter().parse(oTotalHorizon.getEndTime())]);
			var oHorizonStartTime = Format.getTimeStampFormatter().parse(oTotalHorizon.getStartTime());
			var oHorizonEndTime = Format.getTimeStampFormatter().parse(oTotalHorizon.getEndTime());
			var nHorizonTimeRange = oHorizonEndTime.valueOf() - oHorizonStartTime.valueOf();
			var oTimeLineOption = this.getTimeLineOption();
			var nUnitTimeRange = jQuery.sap.getObject(oTimeLineOption.innerInterval.unit)
									.offset(oHorizonStartTime, oTimeLineOption.innerInterval.span).valueOf() - oHorizonStartTime.valueOf();
			//update view range
			oAxisTime.setViewRange([0, Math.ceil((nHorizonTimeRange * oTimeLineOption.innerInterval.range / nUnitTimeRange) / this._aZoomRate[this.getZoomLevel()])]);
		}
		return this;
	};
	
	/**
	 * Don't use this method to set zoomLevels because its value is determined by timeLineOptions.
	 * The account of entities in timeLineOptions is zoomLevels.
	 * 
	 * @param {int} iZoomLevels zoom levels of StepwiseZoomStrategy
	 * @public
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setZoomLevels = function (iZoomLevels) {
		return this;
	};
	
	/**
	 * Sets the zoom level of StepwiseZoomStrategy.
	 * This method also does below things:
	 * 1. Reverts the total horizon to the one before auto extension.
	 * 2. Extends total horizon if it cannot fulfill the whole visible area according to the current zoom level.
	 * 3. Updates visible horizon and still keeps the same middle date.
	 * 
	 * @param {int} iZoomLevel zoom level of StepwiseZoomStrategy
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setZoomLevel = function (iZoomLevel) {
		if (iZoomLevel >= 0) {
			this.setProperty("zoomLevel", iZoomLevel, true);

			this.setProperty("timeLineOption", this._getTimeLineOptionByIndex(iZoomLevel), true);

			if (this._aZoomRate[iZoomLevel]) {
				var oAxisTime = this.getAxisTime();
				if (oAxisTime) {
					oAxisTime.setZoomRate(this._aZoomRate[iZoomLevel]);
				}
				
				var oTotalHorizon = this.getTotalHorizon();
				if (this._oTotalHorizonBeforeExtension) {
						//Revert total horizon to the one before extension.
						this.setTotalHorizon(new sap.gantt.config.TimeHorizon({
							startTime:this._oTotalHorizonBeforeExtension.getStartTime(),
							endTime: this._oTotalHorizonBeforeExtension.getEndTime()
						}));
				}
				var oNewVisibleHorizon = this._updateVisibleHorizon(this.getGanttVisibleWidth());
				this.setVisibleHorizon(oNewVisibleHorizon);
			}
		}
		return this;
	};
	
	/**
	 * Don't use this method to set coarsestTimeLineOption because its value is determined by timeLineOptions.
	 * The last entry of timeLineOptions is coarsestTimeLineOption.
	 * 
	 * @param {object} oTimeLineOption coarsest time line option of StepwiseZoomStrategy
	 * @public
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setCoarsestTimeLineOption = function (oTimeLineOption) {
		return this;
	};
	
	/**
	 * Don't use this method to set finestTimeLineOption because its value is determined by timeLineOptions.
	 * The first entry of timeLineOptions is finestTimeLineOption.
	 * 
	 * @param {object} oTimeLineOption finest time line option of StepwiseZoomStrategy
	 * @public
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setFinestTimeLineOption = function (oTimeLineOption) {
		return this;
	};
	
	/**
	 * Sets the time line options of StepwiseZoomStrategy.
	 * 
	 * @param {object} oTimeLineOptions time line options of StepwiseZoomStrategy
	 * @public
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setTimeLineOptions = function (oTimeLineOptions) {
		AxisTimeStrategyBase.prototype.setTimeLineOptions.apply(this, arguments);
		//TODO qunit test: the value of zoomLevels, coarsestTimeLineOption and finestTimeLineOption should be changed after calling this method
		this._updateZoomRateArray();
		return this;
	};

	StepwiseZoomStrategy.prototype._updateVisibleHorizon = function (nClientWidth) {
		var iWidthOfTotalHorizon = this._getWidthOfTotalHorizon();
		if (iWidthOfTotalHorizon < this.getGanttVisibleWidth()) {
			//extend the total horizon to fulfill the visible area
			this._extendTotalHorizon(this.getGanttVisibleWidth());
		} else if (iWidthOfTotalHorizon < nClientWidth ){
			this._extendTotalHorizon(nClientWidth);
		} else {
			this._extendTotalHorizon (iWidthOfTotalHorizon);
		}
		
		//Calculate the new visible horizon and still keep the same middle date.
		var oVisibleHorizon = this.getVisibleHorizon();
		var dMiddleOfVisibleHorizon = this.calMiddleDate(Format.getTimeStampFormatter().parse(oVisibleHorizon.getStartTime()),
				Format.getTimeStampFormatter().parse(oVisibleHorizon.getEndTime()));
		var oNewVisibleHorizon = this.calVisibleHorizonByRate(this._aZoomRate[this.getZoomLevel()], dMiddleOfVisibleHorizon);
		//this.setVisibleHorizon(oNewVisibleHorizon);
		AxisTimeStrategyBase.prototype.setVisibleHorizon.call(this, oNewVisibleHorizon);
		return oNewVisibleHorizon;
	};

	StepwiseZoomStrategy.prototype.syncContext = function (nClientWidth) {
		var iOriginalVisibleWidth = this.getGanttVisibleWidth();
		if (nClientWidth !== iOriginalVisibleWidth){ //in situation move Gantt resize
			//when Gantt resize, we can't change zoom rate
			this._updateVisibleHorizon(nClientWidth);
		}
		this.updateGanttVisibleWidth(nClientWidth);


		var oRetVal = {
				zoomLevelChanged : true,
				axisTimeChanged : true
			};
		
		return oRetVal;
	};
	
	/**
	 * @private
	 */
	StepwiseZoomStrategy.prototype._updateZoomRateArray = function () {
		if (this._oZoom) {
			var oTimeLineOptions = this.getTimeLineOptions();

			if (oTimeLineOptions) {
				var i = 0;
				this._aZoomRate = [];
				for (var j in oTimeLineOptions) {
					this._aZoomRate[i] = this._oZoom.base.scale / this.calZoomScale(
							oTimeLineOptions[j].innerInterval.unit,
							oTimeLineOptions[j].innerInterval.span,
							oTimeLineOptions[j].innerInterval.range
					);
					i++;
				}
			} else {
				this._aZoomRate[0] = 1;
			}
			
		}
	};
	
	/**
	 * This method does below things:
	 * 1. Sets time line option according to the stop info object.
	 * 2. Sets zoom level according to the stop info object. The setter of zoom level does some additional things.
	 * 
	 * @param {object} oStopInfo Zoom stop information, which contains the parameters <code>key</code> and <code>text</code>.
	 * @protected
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.updateStopInfo = function (oStopInfo) {
		this.setProperty("timeLineOption", this.getTimeLineOptions()[oStopInfo.selectedItem.getKey()], true);
		this.setZoomLevel(oStopInfo.index);
				
		return this;
	};
	
	/**
	 * Returns index of the given time line option from given time line options or this.timeLineOptions.
	 * 
	 * @param {object} oTimeLineOption time line option object
	 * @param {object} oTimeLineOptions time line options
	 * @private
	 * @returns {int} index of the given time line option from given time line options or this.timeLineOptions
	 */
	StepwiseZoomStrategy.prototype._getIndexOfTimeLineOption = function (oTimeLineOption, oTimeLineOptions) {
		var iIndex = -1, oOptions = oTimeLineOptions;
		if (!oOptions) {
			oOptions = this.getTimeLineOptions();
		}
		for (var i in oOptions) {
			iIndex++;
			if (oTimeLineOption == oOptions[i]) {
				return iIndex;
			}
		}
		
		return -1;
	};
	
	/**
	 * Returns time line option by the given index.
	 * 
	 * @param {int} iIndex index of time line option
	 * @private
	 * @returns {object} the time line option from this.timeLineOptions
	 */
	StepwiseZoomStrategy.prototype._getTimeLineOptionByIndex = function (iIndex) {
		var oTimeLineOptions = this.getTimeLineOptions();
		var iCounter = 0;
		for (var i in oTimeLineOptions) {
			if (iCounter === iIndex) {
				return oTimeLineOptions[i];
			}
			iCounter++;
		}
		
		return null;
	};
	
	/**
	 * @private
	 * @returns {int} width of the total horizon
	 */
	StepwiseZoomStrategy.prototype._getWidthOfTotalHorizon = function(){
		var oTotalHorizon = this.getTotalHorizon();
		var startTime = Format.getTimeStampFormatter().parse(oTotalHorizon.getStartTime());
		var endTime = Format.getTimeStampFormatter().parse(oTotalHorizon.getEndTime());
		var oAxisTime = this.getAxisTime();
		var start = oAxisTime.timeToView(startTime);
		var end = oAxisTime.timeToView(endTime);
		return Math.abs(end - start);
	};
	
	/**
	 * @param {int} nClientWidth the width of the visible area
	 * @private
	 */
	StepwiseZoomStrategy.prototype._extendTotalHorizon = function(nClientWidth){
		var oTotalHorizon = this.getTotalHorizon();
		var oVisibleHorizon = this.getVisibleHorizon();
		if (!this._oTotalHorizonBeforeExtension) {
			this._oTotalHorizonBeforeExtension = new sap.gantt.config.TimeHorizon({
				startTime: oTotalHorizon.getStartTime(),
				endTime: oTotalHorizon.getEndTime()
			});
		}
		var startTime = Format.getTimeStampFormatter().parse(oVisibleHorizon.getStartTime());
		var endTime = Format.getTimeStampFormatter().parse(oVisibleHorizon.getEndTime());
		var middleTime = this.calMiddleDate(startTime, endTime);
		var oTimeLineOption = this.getTimeLineOption();
		var oTimeUnit = jQuery.sap.getObject(oTimeLineOption.innerInterval.unit);
		var oAxisTime = this.getAxisTime();
		var iStart = oAxisTime.timeToView(startTime);
		var iEnd = oAxisTime.timeToView(endTime);
		var iSubtraction = 1;
		//iteratively extend the startTime and endTime from the middle of visible horizon
		while (Math.abs(iEnd - iStart) < nClientWidth) {
			startTime = oTimeUnit.offset(middleTime, -iSubtraction);
			endTime = oTimeUnit.offset(middleTime, iSubtraction);
			iStart = oAxisTime.timeToView(startTime);
			iEnd = oAxisTime.timeToView(endTime);
			iSubtraction++;
		}
		
		//update the startTime and endTime of total horizon
		oTotalHorizon.setStartTime(Format.dateToAbapTimestamp(startTime));
		oTotalHorizon.setEndTime(Format.dateToAbapTimestamp(endTime));
		this.setTotalHorizon(oTotalHorizon);
	};
	
	return StepwiseZoomStrategy;
}, true);