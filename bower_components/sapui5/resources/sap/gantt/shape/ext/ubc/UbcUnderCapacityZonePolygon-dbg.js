/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/misc/Utility", "sap/gantt/misc/Format", "sap/gantt/shape/ext/ubc/UbcPolygon"
], function(Utility, Format, UbcPolygon){
	"use strict";

	/**
	 * Creates and initializes a fragment of the Utilization Line Chart.
	 * 
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings of the new control
	 * 
	 * @class 
	 * This shape is used to represent an unplanned capacity area.
	 * 
	 * <p>
	 * Graphic Effect is:<br/>
	 * <svg xmlns="http://www.w3.org/2000/svg" width="12cm" height="8.8cm" viewBox="0 0 300 220" version="1.1">
	 * <defs><marker id="arrowend" viewBox="0 0 10 10" refX="10" refY="5" markerUnits="strokeWidth" markerWidth="12" markerHeight="9" orient="auto"><path d="M 0 0 l 10 5 l -10 5 l 4 -5 z" fill="#6d6d6d" /></marker>
	 * 	<marker id="arrowstart" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="12" markerHeight="9" orient="auto"><path d="M 0 5 l 10 -5 l -4 5 l 4 5 z" fill="#6d6d6d" /></marker></defs>
	 * 	<style>.side{stroke-width:2;stroke:#1C75BC;fill:none;} .dashside{stroke-width:1;stroke:#1C75BC;fill:none; stroke-dasharray:5,1;} .dashassist{stroke-width:1;stroke:#6d6d6d;fill:none; stroke-dasharray:5,1;}
	 * 	.arrowline{stroke-width:1;stroke:#6d6d6d;fill:none;marker-end:url(#arrowend);marker-start:url(#arrowstart);} .center{r:3;fill:#6d6d6d;stroke:#9E1F63;} .texthyphon{stroke-width:1;stroke:#9E1F63;fill:none} .propertyText{stroke:#6d6d6d;} .timeText{stroke:#9E1F63;} </style>
	 * 	<rect x="1" y="1" width="298" height="218" fill="none" stroke="blue" stroke-width="0.5"/>
	 * 	<defs><pattern class="pattern" id="pUbc" patternUnits="userSpaceOnUse" x="0" y="0" width="4" height="4"><rect x="0" width="4" height="4" fill="#efefef"></rect><path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2 " stroke="#6d6d6d" stroke-width="0.5"></path></pattern>
	 * 	<pattern class="pattern" id="pEx2" patternUnits="userSpaceOnUse" x="0" y="0" width="4" height="4"><rect x="0" width="4" height="4" fill="#f2a5a5"></rect><path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2 " stroke="#9E1F63" stroke-width="0.5"></path></pattern></defs>
	 * 	<path d="M 10 65 h 280 v 90 h -280 z" class="dashside" />
	 * 	<polygon points="10,65 290,65 290,155 10,155" fill="url(#pUbc)" />
	 * 	<polygon points="50,155 50,110 130,110 130,155 170,155 170,80 210,80 210,155" fill="#ffffff" />
	 * </svg>
	 * </p>
	 * 
	 * @extends sap.gantt.shape.ext.ubc.UbcPolygon
	 * 
	 * @author SAP SE
	 * @version 1.50.5
	 * 
	 * @constructor
	 * @public
	 * @alias sap.gantt.shape.ext.ubc.UbcUnderCapacityZonePolygon
	 */
	var UbcUnderCapacityZonePolygon = UbcPolygon.extend("sap.gantt.shape.ext.ubc.UbcUnderCapacityZonePolygon", /** @lends sap.gantt.shape.ext.ubc.UbcUnderCapacityZonePolygon.prototype */ {});

	/**
	 * Gets the value of property <code>fill</code>.
	 * 
	 * <p> 
	 * Standard SVG 'fill' attribute.
	 * See {@link http://www.w3.org/TR/SVG/painting.html#FillProperty SVG 1.1 specification for 'fill'}.
	 * <b>Note:</b> You can provide the fill attribute with HTML colors and the URL reference to a paint server. Paint server definitions can be retrieved from paint servers rendered by
	 * {@link sap.gantt.GanttChartContainer}, {@link sap.gantt.GanttChartWithTable}, or {@link sap.gantt.GanttChart}.
	 * </p>
	 * <p>The default value is "#40d44c".</p>
	 * 
	 * @param {object} oData Shape data.
	 * @param {object} oRowInfo Information about the row and row data.
	 * @return {string} Value of property <code>fill</code>.
	 * @public
	 */
	UbcUnderCapacityZonePolygon.prototype.getFill = function(oData, oRowInfo) {
		if (this.mShapeConfig.hasShapeProperty("fill")){
			return this._configFirst("fill", oData);
		}
		
		return "#40d44c";
	};

	/**
	 * Gets the value of property <code>points</code>.
	 * 
	 * <p>
	 * points attribute of the polygon element.
	 * See {@link http://www.w3.org/TR/SVG/shapes.html#PolygonElementPointsAttribute SVG 1.1 specification for the 'points' attribute of 'polygon'}.
	 * The value of 'points' is calculated by using the coordinates of all points of the unplanned capacity area.
	 * </p>
	 * 
	 * @param {object} oData Shape data.
	 * @param {object} oRowInfo Information about the row and row data.
	 * @return {string} Value of property <code>points</code>.
	 * @public
	 */
	UbcUnderCapacityZonePolygon.prototype.getPoints = function(oData, oRowInfo) {
		if (this.mShapeConfig.hasShapeProperty("points")) {
			return this._configFirst("points", oData);
		}

		var overCapacityPoints = "";
		var maxY = this._getMaxY(oData, oRowInfo);
		var maxTotalRevised = this._getMaxTotalRevised(oData);
		var drawRowHeight = oRowInfo.rowHeight - 1;

		//oData.drawData is filtered data
		var drawData = oData.drawData ? oData.drawData : oData.period;
		var oAxisTime = this.getAxisTime();
		for (var i = 0; i < drawData.length; i++) {
			var periodData = drawData[i];
			var xPointStart, xPointEnd;
			xPointStart = oAxisTime.timeToView(Format.abapTimestampToDate(periodData.start_date)).toFixed(1);
			if (i < drawData.length - 1) {
				xPointEnd = oAxisTime.timeToView(Format.abapTimestampToDate(drawData[i + 1].start_date)).toFixed(1);
			}else {
				xPointEnd = oAxisTime.timeToView(Format.abapTimestampToDate(drawData[i].start_date)).toFixed(1);
			}
			
			if (!jQuery.isNumeric(xPointStart)) {
				xPointStart = oAxisTime.timeToView(0).toFixed(1);
			}
			if (!jQuery.isNumeric(xPointEnd)) {
				xPointEnd = oAxisTime.timeToView(0).toFixed(1);
			}
			
			if (i === 0) {
				overCapacityPoints += xPointStart + "," + maxY + " ";
			}
			
			var capacityY = maxY - periodData.supply / maxTotalRevised * drawRowHeight;
			capacityY = capacityY.toFixed(1);
			
			overCapacityPoints += xPointStart + "," + capacityY + " ";
			overCapacityPoints += xPointEnd + "," + capacityY + " ";
			
			if (i === drawData.length - 1) {
				overCapacityPoints += xPointStart + "," + capacityY + " ";
				overCapacityPoints += xPointStart + "," + maxY + " ";
			}
		}
		return overCapacityPoints;
	};
	
	return UbcUnderCapacityZonePolygon;
}, true);
