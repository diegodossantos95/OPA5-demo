/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
 
jQuery.sap.declare("sap.uiext.inbox.InboxToggleTextView");
sap.ui.core.Control.extend("sap.uiext.inbox.InboxToggleTextView", {
    metadata: {
        properties: {
			showMore : {type: "string",defaultValue: 'auto'
				
			}
		},
        
        aggregations: {
            fTV: {
                type: "sap.ui.commons.FormattedTextView",
                multiple: false,
                visibility: "public"
            },
            taskDescriptionLink: {
                type: "sap.ui.commons.Link",
                multiple: false,
                visibility: "hidden"
            }
        },
        events: {
            showMoreClick: {enablePreventDefault: true}
        }
    },
    
    init: function() {
    	var that = this;
    	this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
        this.setAggregation('taskDescriptionLink', new sap.ui.commons.Link({ text:  that._oBundle.getText("INBOX_SHOW_MORE_TEXT"), tooltip: that._oBundle.getText("INBOX_SHOW_MORE_LINK_TOOLTIP"),visible: false}).attachPress(jQuery.proxy(this.showMoreClick, this)));
    },
    
    renderer: {
        render: function(oRm, oControl) {
            
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("InboxToggleTextView");
            oRm.writeClasses();
            oRm.write(">");
            
            oRm.write("<div");
            oRm.addClass("fTV");
            oRm.writeClasses();
            oRm.writeStyles();
            oRm.write(">");
            oRm.renderControl(oControl.getAggregation("fTV"));
            oRm.write("</div>");
            
            if (oControl.getAggregation('taskDescriptionLink').getVisible()) {
                oRm.write("<div");
                oRm.addClass("taskDescriptionLink");
                oRm.writeClasses();
                oRm.writeStyles();
                oRm.write(">");
                oRm.renderControl(oControl.getAggregation("taskDescriptionLink"));
                oRm.write("</div>");
            }
            
            oRm.write("</div>");
        }
    
    },
    
    onAfterRendering: function() {
        var oFTV = this.getAggregation('fTV');
        if (this.getShowMore() === 'true' ||(oFTV.isClamped() && this.getShowMore() === 'auto')) {
            this.getAggregation('taskDescriptionLink').setVisible(true);
        
        } 
    },
    
    showMoreClick: function(oEvent) {
    	var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
    	var sShowMoreLinkText = _oBundle.getText("INBOX_SHOW_MORE_TEXT");
    	var sShowLessLinkText = _oBundle.getText("INBOX_SHOW_LESS_TEXT");
    	
        if (oEvent.getSource().getText() ===  sShowMoreLinkText) {
            oEvent.getSource().setText(_oBundle.getText("INBOX_SHOW_LESS_TEXT"));
            oEvent.getSource().setTooltip(_oBundle.getText("INBOX_SHOW_LESS_LINK_TOOLTIP"))
            this.fireShowMoreClick({text: sShowMoreLinkText});
        } else {
            oEvent.getSource().setText(sShowMoreLinkText);
            oEvent.getSource().setTooltip(_oBundle.getText("INBOX_SHOW_MORE_LINK_TOOLTIP"));
            this.fireShowMoreClick({text: sShowLessLinkText});
        }
    
    }

});
