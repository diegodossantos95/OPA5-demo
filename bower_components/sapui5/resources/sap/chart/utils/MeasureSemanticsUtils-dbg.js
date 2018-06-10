/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */

sap.ui.define([
	'sap/chart/coloring/ColoringUtils',
	'sap/chart/coloring/ColorPalette',
	'sap/chart/data/MeasureSemantics',
	'sap/chart/coloring/CriticalityType',
	'sap/chart/ChartLog',
	'sap/chart/ColoringType',
	'sap/chart/coloring/criticality/Criticality',
	'sap/chart/utils/ChartUtils'
], function(
	ColoringUtils,
	ColorPalette,
	MeasureSemantics,
	CriticalityType,
	ChartLog,
	ColoringType,
	Criticality,
	ChartUtils
) {
	"use strict";

	var COLOR_PALETTE = ['sapUiChartPaletteQualitativeHue1',
						 'sapUiChartPaletteQualitativeHue2',
						 'sapUiChartPaletteQualitativeHue3',
						 'sapUiChartPaletteQualitativeHue4',
						 'sapUiChartPaletteQualitativeHue5',
						 'sapUiChartPaletteQualitativeHue6',
						 'sapUiChartPaletteQualitativeHue7',
						 'sapUiChartPaletteQualitativeHue8',
						 'sapUiChartPaletteQualitativeHue9',
						 'sapUiChartPaletteQualitativeHue10',
						 'sapUiChartPaletteQualitativeHue11'
					 ],
		DUAL_COLOR_PALETTE = [['sapUiChartPaletteSequentialHue1',
                    'sapUiChartPaletteSequentialHue1Light2',
                    'sapUiChartPaletteSequentialHue1Dark1'
                ],
                ['sapUiChartPaletteSequentialHue2',
                    'sapUiChartPaletteSequentialHue2Light2',
                    'sapUiChartPaletteSequentialHue2Dark1'
                ]],
		SINGLE_TARGET_COLOR = 'sapUiChartPaletteSequentialNeutralDark2',
		SINGLE_NEUTRAL_COLOR = 'sapUiChartPaletteSemanticNeutral',
		LINE_TYPE = {
			actual : 'solid',
			projected : 'dash',
			reference : 'dot'
		},
		PATTERN = {
			projected : 'diagonalLightStripe',
			reference : 'noFill'
		};
	var aMeasureLegendOrder = [
		CriticalityType.Positive,
		CriticalityType.Neutral,
		CriticalityType.Critical,
		CriticalityType.Negative
	];

	function rel(oMsr) {
		var oResult = {};
		if (oMsr.getSemanticallyRelatedMeasures) {
			var oRel = oMsr.getSemanticallyRelatedMeasures();
			if (oRel) {
				if (oRel.projectedValueMeasure) {
					oResult.projected = oRel.projectedValueMeasure;
				}
				if (oRel.referenceValueMeasure) {
					oResult.reference = oRel.referenceValueMeasure;
				}
				return oResult;
			}
		}

		return oResult;
	}

	function calc(aMsrs, aInvisibleMsrs) {
		var mComputed = aMsrs.reduce(function(mComputed, oMsr) {
			mComputed[oMsr.getName()] = {
				msr: oMsr,
				sem: (oMsr.getSemantics && oMsr.getSemantics()) || "actual",
				rel: rel(oMsr)
			};
			return mComputed;
		}, {});

		// remove mis matched (semantics, relation semantics) from each semantic
		// relation
		jQuery.each(mComputed, function(sMsr, oCfg) {
			if (oCfg.sem === "actual") {
				jQuery.each(oCfg.rel, function(sSem, sTargetMsr) {
					if (mComputed[sTargetMsr] && mComputed[sTargetMsr].sem !== sSem) {
						delete oCfg.rel[sSem];
						var chartLog = new ChartLog("error","Semantic Pattern", sTargetMsr + " shouldn't be used as " + sSem + " in semantic relation. ");
						chartLog.display();
					}
				});
			}
		});

		if (aInvisibleMsrs) {
			for (var i = 0; i < aInvisibleMsrs.length; i++) {
				var oMsr = aInvisibleMsrs[i];
				var oRel = rel(oMsr);
				if (oRel.projected && oRel.reference && mComputed[oRel.projected] && mComputed[oRel.reference]) {
					mComputed[oRel.projected] = {
						msr: oMsr,
						sem: 'projected',
						rel: {
							reference : oRel.reference
						}
					};
				}
			}
		}

		return mComputed;
	}

	function makeTuples(aMsrs, mSems, isRestored) {
		var aTuples = [], index = 0, chartLog;

		jQuery.each(aMsrs.slice().sort(function(a, b) {
			var semA = mSems[a.getName()].sem,
				semB = mSems[b.getName()].sem;
			if (semA < semB) {
				return -1;
			} else if (semA > semB) {
				return 1;
			} else {
				return aMsrs.indexOf(a) - aMsrs.indexOf(b);
			}
		}), function(idx, oMsr) {
			var sName = oMsr.getName();
			if (!mSems[sName]) {
				return;
			}

			var oSemCfg = mSems[sName];
			var oTuple = {};
			var sLabel;

			oTuple[isRestored ? 'actual' : oSemCfg.sem] = sName;
			if (oMsr.getLabel) {
				sLabel = oMsr.getLabel();
				if (sLabel) {
					oTuple.labels = {};
					oTuple.labels[oSemCfg.sem] = sLabel;
				}
			}
			oTuple.index = index++;

			if (!isRestored && (oSemCfg.sem === "actual" || oSemCfg.sem === "projected")) {
				if (oSemCfg.rel.projected) {
					if (mSems[oSemCfg.rel.projected]) {
						oTuple.projected = oSemCfg.rel.projected;
						//Keep labels
						if (mSems[oSemCfg.rel.projected].msr.getLabel) {
							sLabel = mSems[oSemCfg.rel.projected].msr.getLabel();
							if (sLabel) {
								oTuple.labels = jQuery.extend(true, oTuple.labels, {
									projected: sLabel
								});
							}
						}
						delete mSems[oSemCfg.rel.projected];
					} else {
						chartLog = new ChartLog('error', 'Semantic Pattern', oSemCfg.msr.getName() + ' has an invalid projected semantic relation.');
						chartLog.display();
					}
				}
				if (oSemCfg.rel.reference) {
					if (mSems[oSemCfg.rel.reference]) {
						oTuple.reference = oSemCfg.rel.reference;
						if (mSems[oSemCfg.rel.reference].msr.getLabel) {
							sLabel = mSems[oSemCfg.rel.reference].msr.getLabel();
							if (sLabel) {
								oTuple.labels = jQuery.extend(true, oTuple.labels, {
									reference: sLabel
								});
							}
						}
						delete mSems[oSemCfg.rel.reference];
					} else {
						chartLog = new ChartLog('error', 'Semantic Pattern', oSemCfg.msr.getName() + ' has an invalid reference semantic relation.');
						chartLog.display();
					}
				}
				delete mSems[sName];
			}
			oTuple.order = [
				MeasureSemantics.Actual,
				MeasureSemantics.Projected,
				MeasureSemantics.Reference
			];
			aTuples.push(oTuple);

		});

		return aTuples;
	}

	var addDataPointStyleRules = function(semanticProps, rule){
		if (!semanticProps.dataPointStyle) {
			semanticProps = jQuery.extend(true, semanticProps, {
				"dataPointStyle": {
					"rules": [],
					others : null
				}
			});
		}
		semanticProps.dataPointStyle.rules.push(rule);
	};

	var getColorsBySemanticPattern = function(chartType, index, valueAxisID){
		var length, colorPalette;
		if (chartType.indexOf('dual') === -1) {
			colorPalette = COLOR_PALETTE;
			length = COLOR_PALETTE.length;
		} else {
			var axisIndex = (valueAxisID === 'valueAxis') ? 0 : 1;
			colorPalette = DUAL_COLOR_PALETTE[axisIndex];
			length = colorPalette.length;
		}
		return {
			actual : colorPalette[ index % length],
			projected : colorPalette[ index % length],
			reference : colorPalette[ index % length]
		};
	};

	var getCallback = function(oTuple, semantics, fnCb) {
		if (oTuple.projectedValueStartTime && oTuple.timeAxis && semantics !== MeasureSemantics.Reference) {
			fnCb = fnCb || function() {
				return true;
			};
			var isContinuous = function(ctx) {
				return ctx.hasOwnProperty(oTuple.semanticMsrName);
			};
			if (semantics === MeasureSemantics.Actual) {
				return function(ctx) {
					return fnCb(ctx) && isContinuous(ctx) && (new Date(ctx[oTuple.timeAxis]).getTime() < oTuple.projectedValueStartTime);
				};
			} else if (semantics === MeasureSemantics.Projected) {
				return function(ctx) {
					return fnCb(ctx) && isContinuous(ctx) && (new Date(ctx[oTuple.timeAxis]).getTime() >= oTuple.projectedValueStartTime);
				};
			}
		} else {
			fnCb = fnCb || function(ctx){
				return ctx.hasOwnProperty(oTuple[semantics]);
			};
			return fnCb;
		}
	};

	var getColor = function(oTuple, oColorings, semanticRole, options) {
		var colors, color;
		if (oColorings) {
			if (oTuple.iUnMentionedIndex == undefined) {
				// unMentioned measure in tuple with coloring
				color = SINGLE_NEUTRAL_COLOR;
			} else {
				colors = ColoringUtils.assignUnmentionedColor(ColorPalette.CRITICALITY.Neutral, options.unMentionedTuplesNumber);
				color = colors[oTuple.iUnMentionedIndex];
			}
		} else {
			if (semanticRole === MeasureSemantics.Reference && options.hasSingleReference) {
				color = SINGLE_TARGET_COLOR;
			} else {
				colors = getColorsBySemanticPattern(options.chartType, oTuple.index, oTuple.valueAxisID);
				color = colors[semanticRole];
			}
		}
		return color;
	};

	var generateRulesBySemanticRole = function(oTuple, oColorings, semanticRole, semanticProps, options) {
		var color, oColoringSetting, dataName = {}, oProps;
		var sMsrName = oTuple[semanticRole];
		var sColoringType;

		(oColorings || []).forEach(function(oSetting) {
			if (oSetting.parsed.msr && oSetting.parsed.msr.getName() === sMsrName) {
				oColoringSetting = oSetting.parsed;
				sColoringType = oSetting.type;
			}
		});

		var	sLabel = (oTuple.labels && oTuple.labels[semanticRole]) ? oTuple.labels[semanticRole] : sMsrName;
		if (oTuple.semanticMsrName && (semanticRole === MeasureSemantics.Actual || semanticRole === MeasureSemantics.Projected)) {
			dataName[oTuple.semanticMsrName] = sLabel;
		}

		if (oColoringSetting) {
			// handle measure with Coloring
			aMeasureLegendOrder.forEach(function(sCriticalityType) {
				var aCbs = oColoringSetting.callbacks[sCriticalityType];
				if (aCbs) {
					var fnCallback = getCallback(oTuple, semanticRole, aCbs[0]);
					color = ColoringUtils.assignColor(ColorPalette.CRITICALITY[sCriticalityType], aCbs.length)[0];
					oProps = {
						"color": color,
						"pattern": PATTERN[semanticRole]
					};
					if (ChartUtils.CONFIG.lineChartType.indexOf(options.chartType) > -1) {
						oProps.lineType = LINE_TYPE[semanticRole];
						if (sColoringType === 'Static') {
							oProps.lineColor = color;
						}
					}
					addDataPointStyleRules(semanticProps, {
						"callback": fnCallback,
						"properties": oProps,
						"displayName": oColoringSetting.legend[sCriticalityType],
						"dataName": dataName
					});
				}
			});
		} else {
			if (!oColorings || oColorings.bShowUnmentionedMsr) {
				var fnCallback = getCallback(oTuple, semanticRole);
				color = getColor(oTuple, oColorings, semanticRole, options);

				oProps = {
					'color': color,
					"pattern": PATTERN[semanticRole]
				};

				if (ChartUtils.CONFIG.lineChartType.indexOf(options.chartType) > -1) {
					oProps.lineType = LINE_TYPE[semanticRole];
					oProps.lineColor = color;
				}

				addDataPointStyleRules(semanticProps, {
					"callback": fnCallback,
					"properties": oProps,
					"displayName": sLabel,
					"dataName": dataName
				});
			}
		}
	};

	var isReferenceTuple = function(tuple){
		return tuple.reference && (!(tuple.actual || tuple.projected));
	};

	var generateRulesByTuples = function(aTuples, oColorings, semanticProps, chartType) {
		var hasSingleReference = (aTuples.filter(function(oTuple) {
			return oTuple.reference;
		}).length === 1);

		var iUnMentionedTuples = aTuples.filter(function(oTuple) {
			return oTuple.hasOwnProperty('iUnMentionedIndex');
		}).length;

		aTuples.forEach(function(oTuple) {
			oTuple.order.forEach(function(semanticRole) {
				var bNeedSemanticRule = true;
				if (chartType.indexOf('bullet') > -1) {
					bNeedSemanticRule = (semanticRole !== MeasureSemantics.Reference || isReferenceTuple(oTuple));
				}
				if (oTuple.hasOwnProperty(semanticRole) && bNeedSemanticRule) {
					var options = {
						chartType: chartType,
						hasSingleReference: hasSingleReference,
						unMentionedTuplesNumber: iUnMentionedTuples
					};
					generateRulesBySemanticRole(oTuple, oColorings, semanticRole, semanticProps, options);
				}
			});
		});
	};

	var getSemanticVizSettings = function(chartType, semanticTuples, semanticColorings, bEnablePattern, bDataPointStyleSetByUser, bLegendSetByUser) {
		semanticColorings = semanticColorings || {};
		var bCriticalityMeasureValues =
		    (semanticColorings.type === ColoringType.Criticality &&
			semanticColorings.subType === "MeasureValues" &&
			!(semanticColorings.qualifiedSettings && semanticColorings.qualifiedSettings.bMBC));
		var oProps = {
		};
		if (!bDataPointStyleSetByUser) {
			// if user once set dataPointStyle, do not empty it since vizFrame may cache it when lw-uvb is pending for creation
			oProps.plotArea = {
				dataPointStyle: null
			};
		}
		if (!bLegendSetByUser) {
			oProps.legend = {
				title: {
					text: null,
					//hard code template value here since it is not available in Analtyical Chart level
					visible: chartType.indexOf('waterfall') > -1 ? true : false
				}
			};
		}

		var oScales, replace = true;
		if ((bEnablePattern && hasSemanticRelation(semanticTuples)) || bCriticalityMeasureValues) {
			var aColorings = bCriticalityMeasureValues ? semanticColorings.qualifiedSettings : null;
			generateRulesByTuples(semanticTuples, aColorings, oProps.plotArea, chartType);
			jQuery.extend(true, oProps.legend, Criticality.getLegendProps(aColorings));
		} else if (semanticColorings.ruleGenerator) {
			try {
				var rule = semanticColorings.ruleGenerator();
				jQuery.extend(true, oProps, rule.properties);
				oScales = rule.colorScale;
			} catch (e) {
				if (e instanceof ChartLog) {
					e.display();
				} else {
					throw e;
				}
			}
		}
		if (oScales) {
			replace = false;
		}
		return {
			properties: oProps,
			scales: oScales ? [oScales] : [],
			replaceColorScales: replace
		};
	};

	function hasSemanticRelation(aTuples) {
		if (aTuples) {
			return aTuples.some(function(oTuple) {
				return oTuple.hasOwnProperty(MeasureSemantics.Projected)
				|| oTuple.hasOwnProperty(MeasureSemantics.Reference);
			});
		}
		return false;
	}

	return {
		getTuples: function(aMsrs, aInvisibleMsrs, isRestored) {
			return makeTuples(aMsrs, calc(aMsrs, aInvisibleMsrs), isRestored);
		},
		getSemanticVizSettings : getSemanticVizSettings,
		hasSemanticRelation: hasSemanticRelation
	};
});
