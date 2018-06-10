jQuery.sap.declare("sap.apf.ui.utils.printView");
jQuery.sap.require("sap.apf.ui.utils.printModel");
sap.apf.ui.utils.PrintView = function(oInject, printModel) {
	this.oUiApi = oInject.uiApi;
	this.oCoreApi = oInject.oCoreApi;
	this.printModel = printModel;
};
sap.apf.ui.utils.PrintView.prototype.constructor = sap.apf.ui.utils.PrintView;
/**
 * @method _getHeaderForFirstPage creates a header for the first page of print
 * @returns header for first page of print
 */
sap.apf.ui.utils.PrintView.prototype.getHeaderForFirstPage = function() {
	var date = new Date();
	var sAppName = this.printModel.getApplicationName();
	sAppName = this.oCoreApi.getTextNotHtmlEncoded(sAppName);
	var sAnalysisPathTitle = this.printModel.getHeaderForFirstPage();
	var appName, analysisPathTitle, appDate;
	appName = new sap.m.Text({
		text : sAppName + ":"
	}).addStyleClass("printHeaderTitle");
	analysisPathTitle = new sap.m.Text({
		text : sAnalysisPathTitle
	}).addStyleClass("printHeaderTitle");
	appDate = new sap.m.Text({
		text : date.toTimeString()
	}).addStyleClass("printHeaderDate");
	var headerFirstPageLayout = new sap.ui.layout.HorizontalLayout({
		id : 'idAPFheaderLayout',
		content : [ appName, analysisPathTitle, appDate ],
		sanitizeContent : true
	}).addStyleClass("subHeaderPrintWrapper");
	return headerFirstPageLayout;
};
sap.apf.ui.utils.PrintView.prototype.getPrintLayoutForFacetFiltersAndFooters = function() {
	var formattedFilters = [];
	var mFilterName = "", mFilterValue = "";
	var oFiltersLayout = new sap.ui.layout.VerticalLayout({
		id : 'idAPFFacetAndFooterLayout'
	});
	formattedFilters = this.printModel.getFiltersToPrint();
	for( var i = 0; i < formattedFilters.length; i++) {
		mFilterName = new sap.m.Text({
			text : formattedFilters[i].sFilterName
		}).addStyleClass("printFilterName");
		mFilterValue = new sap.m.Text({
			text : formattedFilters[i].sFilterValue
		}).addStyleClass("printFilterValue");
		oFiltersLayout.addContent(mFilterName);
		oFiltersLayout.addContent(mFilterValue);
	}
	return oFiltersLayout;
};
/**
 * @method _getPrintLayoutForEachStep defines layout used by each step when being printed
 * @usage _getPrintLayoutForEachStep has to be used to get the layout for individual steps in analysis path.
 * @param oStep
 *            is used to get the step information
 * @param nIndex
 *            is index of the step being printed
 * @param nStepsLength
 *            is the total number of steps in an Analysis Path
 * @returns the printLayout for a step in an Analysis Path.
 */
sap.apf.ui.utils.PrintView.prototype.getPrintLayoutForEachStep = function(oStep, nIndex, nStepsLength) {
	var oChartLayout = new sap.ui.layout.VerticalLayout({
		id : 'idAPFChartLayout' + nIndex
	});
	oChartLayout.addContent(this.printModel.getRepresentationForPrint(oStep));
	var oStepLayout = new sap.ui.layout.VerticalLayout({
		id : 'idAPFStepLayout' + nIndex,
		content : [ _getHeaderForEachStep(nIndex, nStepsLength, this), oChartLayout ]
	}).addStyleClass("representationContent"); // @comment : apfoPrintLayout class not provided in css
	return oStepLayout;
};
/**
 * @method _getHeaderForEachStep creates a header for each step page
 * @returns header for step page
 */
function _getHeaderForEachStep(nIndex, nStepsLength, oPrintViewInstance) {
	var date = new Date();
	var sAppName = oPrintViewInstance.printModel.getApplicationName();
	var sAnalysisPathTitle = oPrintViewInstance.printModel.getHeaderForFirstPage();
	var headerForEachStep = new sap.ui.core.HTML({
		id : 'idAPFHeaderForEachStep' + nIndex,
		content : [ '<div class="subHeaderPrintWrapper"><p class="printHeaderTitle"> ' + oPrintViewInstance.oCoreApi.getTextHtmlEncoded(sAppName) + ' : ' + jQuery.sap.encodeHTML(sAnalysisPathTitle) + '</p>',
				'<p class="printHeaderDate"> ' + date.toTimeString() + ' </p></div><div class="clear"></div>',
				'<br /><div class="printChipName"><p>' + oPrintViewInstance.oCoreApi.getTextHtmlEncoded("print-step-number", [ nIndex, nStepsLength ]) + '</p></div>' ].join(""),
		sanitizeContent : true
	});
	return headerForEachStep;
}
