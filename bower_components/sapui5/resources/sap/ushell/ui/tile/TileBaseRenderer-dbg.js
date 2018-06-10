// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global jQuery, sap*/

sap.ui.define(['sap/ushell/resources'],
	function(resources) {
	"use strict";

    /**
     * @name sap.ushell.ui.tile.TileBaseRenderer
     * @static
     * @private
     */
    var TileBaseRenderer = {};
    var translationBundle = resources.i18n;

    /**
     * Searches for occurrences of given searchTerms and substitutes substrings with themselves wrapped in HTML bold tag
     *
     * @param {array} aHighlightTerms an array of strings that will be detected and replaced
     * @param {string} sText contains the text to be highlighted
     * @returns {string} the text with all occurrences wrapped
     * 
     * @private
     */
    TileBaseRenderer.highlight = function (aHighlightTerms, sText) {
        var i,
            regexpHighlightTerm,
            // immediately escape string for displaying as HTML
            sEscapedText = jQuery.sap.encodeHTML(sText).replace(/&#xa;/g, "<br/>");
        if (aHighlightTerms && aHighlightTerms.length && aHighlightTerms.length > 0) {
            for (i = 0; i < aHighlightTerms.length; i = i + 1) {
                // build regular expression with escaped highlight term (case insensitive + greedy)
                regexpHighlightTerm = new RegExp("(" + jQuery.sap.encodeHTML(aHighlightTerms[i]).replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, "\\$1") + ")", "gi");
                // regexp replace occurrence with wrapped self
                sEscapedText = sEscapedText.replace(regexpHighlightTerm, "<b>$1</b>");
            }
        }
        return sEscapedText;
    };

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     * 
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
     */
    TileBaseRenderer.render = function (oRm, oControl) {
        // is it necessary to wrap the control into a link?
        var sInfoPrefix,
            oIcon;
        oRm.write("<div");
        oRm.writeControlData(oControl);
        if (oControl.getTargetURL()){
            oRm.writeAttributeEscaped("data-targeturl", oControl.getTargetURL());
        }

        oRm.addClass("sapUshellTileBase");
        oRm.writeClasses();
        oRm.write(">");

        // plain title + subtitle wrapper
        oRm.write("<div");
        oRm.addClass("sapUshellTileBaseHeader");
        oRm.writeClasses();
        oRm.write(">");

        // title
        oRm.write("<h3");
        oRm.addClass("sapUshellTileBaseTitle");
        oRm.writeClasses();

        oRm.writeAccessibilityState(oControl, {label : translationBundle.getText("tileTypeListItem") +
        translationBundle.getText("TileDetails_lable") + translationBundle.getText("TileTitle_lable") + oControl.getTitle()});
        oRm.write(">");
        // note: this mustn't be escaped, as highlight already does that
        oRm.write(this.highlight(oControl.getHighlightTerms(), oControl.getTitle() || ""));
        oRm.write("</h3>");

        // subtitle
        if (oControl.getSubtitle()) {
            oRm.write("<h4");
            oRm.addClass("sapUshellTileBaseSubtitle");
            oRm.writeClasses();
            oRm.writeAccessibilityState(oControl, {label : translationBundle.getText("TileSubTitle_lable") + oControl.getSubtitle()});
            oRm.write(">");
            // note: this mustn't be escaped, as highlight already does that
            oRm.write(this.highlight(oControl.getHighlightTerms(), oControl.getSubtitle()));
            oRm.write("</h4>");
        }

        oRm.write("</div>");


        /* render inheriting controls  */
        if (typeof (this.renderPart) === 'function') {
            this.renderPart(oRm, oControl);
        }

        // icon
        if (oControl.getIcon()) {
            oIcon = new sap.ui.core.Icon({src: oControl.getIcon()});
            oIcon.addStyleClass("sapUshellTileBaseIcon");
            oRm.renderControl(oIcon);
        }

        // begin sapUshellTileBaseInfo
        if (oControl.getInfo() || ((typeof (this.getInfoPrefix) === 'function')) && this.getInfoPrefix(oControl)) {
            oRm.write("<div");
            oRm.addClass("sapUshellTileBaseInfo");
            oRm.addClass(oControl.getInfoState() ? "sapUshellTileBase" + oControl.getInfoState() : "sapUshellTileBase" + sap.ushell.ui.tile.State.Neutral);
            oRm.writeClasses();
            oRm.writeAccessibilityState(oControl, {label : translationBundle.getText("TileInfo_lable") + oControl.getInfo()});
            oRm.write(">");

            // it is possible for subclasses to prefix the info with arbitrary information (e.g. unit ex DynamicTiles)
            if (typeof (this.getInfoPrefix) === 'function') {
                sInfoPrefix = this.getInfoPrefix(oControl);
                oRm.writeEscaped(sInfoPrefix);
            }
            // info string
            if (oControl.getInfo()) {
                // number units are separated from info text with a comma
                if (sInfoPrefix) {
                    oRm.write(", ");
                }
                // note: this mustn't be escaped, as highlight already does that
                oRm.write(this.highlight(oControl.getHighlightTerms(), oControl.getInfo()));
            }
            // end sapUshellTileBaseInfo
            oRm.write("</div>");

        }

        // end control div element
        oRm.write("</div>");
    };


	return TileBaseRenderer;

}, /* bExport= */ true);
