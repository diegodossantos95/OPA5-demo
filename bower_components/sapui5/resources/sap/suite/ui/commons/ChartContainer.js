/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','./library','sap/m/library','sap/viz/library','sap/ui/base/ManagedObject','sap/m/Button','sap/m/ButtonType','sap/m/OverflowToolbar','sap/m/OverflowToolbarButton','sap/m/SegmentedButton','sap/m/Title','sap/m/ToolbarSpacer','sap/ui/Device','sap/ui/core/Control','sap/ui/core/CustomData','sap/ui/core/Popup','sap/ui/core/ResizeHandler','sap/ui/core/delegate/ScrollEnablement','sap/m/ToggleButton'],function(q,l,M,V,a,B,b,O,c,S,T,d,D,C,e,P,R,f,g){"use strict";var h=C.extend("sap.suite.ui.commons.ChartContainer",{metadata:{library:"sap.suite.ui.commons",properties:{showPersonalization:{type:"boolean",group:"Misc",defaultValue:false},showFullScreen:{type:"boolean",group:"Misc",defaultValue:false},fullScreen:{type:"boolean",group:"Misc",defaultValue:false},showLegend:{type:"boolean",group:"Misc",defaultValue:true},title:{type:"string",group:"Misc",defaultValue:''},selectorGroupLabel:{type:"string",group:"Misc",defaultValue:null,deprecated:true},autoAdjustHeight:{type:"boolean",group:"Misc",defaultValue:false},showZoom:{type:"boolean",group:"Misc",defaultValue:true},showLegendButton:{type:"boolean",group:"Misc",defaultValue:true},showSelectionDetails:{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"content",aggregations:{dimensionSelectors:{type:"sap.ui.core.Control",multiple:true,singularName:"dimensionSelector"},content:{type:"sap.suite.ui.commons.ChartContainerContent",multiple:true,singularName:"content"},toolbar:{type:"sap.m.OverflowToolbar",multiple:false},customIcons:{type:"sap.ui.core.Icon",multiple:true,singularName:"customIcon"}},events:{personalizationPress:{},contentChange:{parameters:{selectedItemId:{type:"string"}}},customZoomInPress:{},customZoomOutPress:{}}}});h.prototype.init=function(){this._aUsedContentIcons=[];this._aCustomIcons=[];this._oToolBar=null;this._aDimensionSelectors=[];this._bChartContentHasChanged=false;this._bControlNotRendered=true;this._bSegmentedButtonSaveSelectState=false;this._mOriginalVizFrameHeights={};this._oActiveChartButton=null;this._oSelectedContent=null;this._sResizeListenerId=null;this._bHasApplicationToolbar=false;this._iPlaceholderPosition=0;this._oResBundle=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");this._oFullScreenButton=new g({icon:"sap-icon://full-screen",type:b.Transparent,tooltip:this._oResBundle.getText("CHARTCONTAINER_FULLSCREEN"),press:this._onFullScreenButtonPress.bind(this)});this._oPopup=new P({modal:true,shadow:false,autoClose:false});this._oShowLegendButton=new c({icon:"sap-icon://legend",type:b.Transparent,text:this._oResBundle.getText("CHARTCONTAINER_LEGEND"),tooltip:this._oResBundle.getText("CHARTCONTAINER_LEGEND"),press:this._onShowLegendButtonPress.bind(this)});this._oPersonalizationButton=new c({icon:"sap-icon://action-settings",type:b.Transparent,text:this._oResBundle.getText("CHARTCONTAINER_PERSONALIZE"),tooltip:this._oResBundle.getText("CHARTCONTAINER_PERSONALIZE"),press:this._onPersonalizationButtonPress.bind(this)});this._oZoomInButton=new c({icon:"sap-icon://zoom-in",type:b.Transparent,text:this._oResBundle.getText("CHARTCONTAINER_ZOOMIN"),tooltip:this._oResBundle.getText("CHARTCONTAINER_ZOOMIN"),press:this._zoom.bind(this,true)});this._oZoomOutButton=new c({icon:"sap-icon://zoom-out",type:b.Transparent,text:this._oResBundle.getText("CHARTCONTAINER_ZOOMOUT"),tooltip:this._oResBundle.getText("CHARTCONTAINER_ZOOMOUT"),press:this._zoom.bind(this,false)});this._oChartSegmentedButton=new S({select:this._onChartSegmentButtonSelect.bind(this),width:"auto"});this._oChartTitle=new T();};h.prototype.onAfterRendering=function(){this._sResizeListenerId=R.register(this,this._performHeightChanges.bind(this));if(!D.system.desktop){D.resize.attachHandler(this._performHeightChanges,this);}if(this.getAutoAdjustHeight()||this.getFullScreen()){q.sap.delayedCall(500,this,this._performHeightChanges.bind(this));}var s=this.getSelectedContent(),v=false,i;if(s){i=s.getContent();v=i&&i.getMetadata().getName()==="sap.viz.ui5.controls.VizFrame";}this._oScrollEnablement=new f(this,this.getId()+"-wrapper",{horizontal:!v,vertical:!v});this._bControlNotRendered=false;};h.prototype.onBeforeRendering=function(){if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}if(!D.system.desktop){D.resize.detachHandler(this._performHeightChanges,this);}if(this._bChartContentHasChanged||this._bControlNotRendered){this._chartChange();}var j=this._aCustomIcons;this._aCustomIcons=[];var k=this.getAggregation("customIcons");if(k&&k.length>0){for(var i=0;i<k.length;i++){this._addButtonToCustomIcons(k[i]);}}if(this._bControlNotRendered){if(!this.getToolbar()){this.setAggregation("toolbar",new O({design:"Transparent"}));}}this._adjustDisplay();this._destroyButtons(j);};h.prototype.exit=function(){if(this._oFullScreenButton){this._oFullScreenButton.destroy();this._oFullScreenButton=undefined;}if(this._oPopup){this._oPopup.destroy();this._oPopup=undefined;}if(this._oShowLegendButton){this._oShowLegendButton.destroy();this._oShowLegendButton=undefined;}if(this._oPersonalizationButton){this._oPersonalizationButton.destroy();this._oPersonalizationButton=undefined;}if(this._oActiveChartButton){this._oActiveChartButton.destroy();this._oActiveChartButton=undefined;}if(this._oChartSegmentedButton){this._oChartSegmentedButton.destroy();this._oChartSegmentedButton=undefined;}if(this._oSelectedContent){this._oSelectedContent.destroy();this._oSelectedContent=undefined;}if(this._oToolBar){this._oToolBar.destroy();this._oToolBar=undefined;}if(this._aDimensionSelectors){for(var i=0;i<this._aDimensionSelectors.length;i++){if(this._aDimensionSelectors[i]){this._aDimensionSelectors[i].destroy();}}this._aDimensionSelectors=undefined;}if(this._oScrollEnablement){this._oScrollEnablement.destroy();this._oScrollEnablement=undefined;}if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}if(!D.system.desktop){D.resize.detachHandler(this._performHeightChanges,this);}if(this._oZoomInButton){this._oZoomInButton.destroy();this._oZoomInButton=undefined;}if(this._oZoomOutButton){this._oZoomOutButton.destroy();this._oZoomOutButton=undefined;}};h.prototype._onButtonIconPress=function(E){var s=E.getSource().getCustomData()[0].getValue();this._switchChart(s);};h.prototype._onFullScreenButtonPress=function(E){if(E.getParameter("pressed")===true){this._oFullScreenButton.setTooltip(this._oResBundle.getText("CHARTCONTAINER_FULLSCREEN_CLOSE"));this._oFullScreenButton.setIcon("sap-icon://exit-full-screen");}else{this._oFullScreenButton.setTooltip(this._oResBundle.getText("CHARTCONTAINER_FULLSCREEN"));this._oFullScreenButton.setIcon("sap-icon://full-screen");}this._bSegmentedButtonSaveSelectState=true;this._toggleFullScreen();this._oFullScreenButton.focus();};h.prototype._onShowLegendButtonPress=function(E){this._bSegmentedButtonSaveSelectState=true;this._onLegendButtonPress();};h.prototype._onChartSegmentButtonSelect=function(E){var s=E.getParameter("button").getCustomData()[0].getValue();this._bSegmentedButtonSaveSelectState=true;this._switchChart(s);};h.prototype._onOverflowToolbarButtonPress=function(E,i){i.icon.firePress({controlReference:E.getSource()});};h.prototype._onLegendButtonPress=function(){var s=this.getSelectedContent();if(s){var i=s.getContent();if(q.isFunction(i.getLegendVisible)){var j=i.getLegendVisible();i.setLegendVisible(!j);this.setShowLegend(!j);}else{this.setShowLegend(!this.getShowLegend());}}else{this.setShowLegend(!this.getShowLegend());}};h.prototype._onPersonalizationButtonPress=function(){this.firePersonalizationPress();};h.prototype._setSelectedContent=function(s){var i;if(this.getSelectedContent()===s){return this;}if(s===null){this._oShowLegendButton.setVisible(false);return this;}var o=s.getContent();this._toggleShowLegendButtons(o);i=o&&o.getMetadata&&o.getMetadata().getName()==="sap.viz.ui5.controls.VizFrame";var j=i||q.isFunction(o.setLegendVisible);if(this.getShowLegendButton()){this._oShowLegendButton.setVisible(j);}var k=this.getShowZoom()&&D.system.desktop&&i;this._oZoomInButton.setVisible(k);this._oZoomOutButton.setVisible(k);this._oSelectedContent=s;return this;};h.prototype._getSelectionDetails=function(){var o=this.getSelectedContent();return o&&o._getSelectionDetails();};h.prototype._toggleShowLegendButtons=function(j){var s=j.getId();var r=null;for(var i=0;!r&&i<this._aUsedContentIcons.length;i++){if(this._aUsedContentIcons[i].getCustomData()[0].getValue()===s&&j.getVisible()===true){r=this._aUsedContentIcons[i];this._oChartSegmentedButton.setSelectedButton(r);break;}}};h.prototype._setDefaultOnSegmentedButton=function(){if(!this._bSegmentedButtonSaveSelectState){this._oChartSegmentedButton.setSelectedButton(null);}this._bSegmentedButtonSaveSelectState=false;};h.prototype._toggleFullScreen=function(){var F=this.getProperty("fullScreen");if(F){var j=this.getAggregation("content");this._closeFullScreen();this.setProperty("fullScreen",false,true);var o;var H;for(var i=0;i<j.length;i++){o=j[i].getContent();o.setWidth("100%");H=this._mOriginalVizFrameHeights[o.getId()];if(H){o.setHeight(H);}}this.invalidate();}else{this._openFullScreen();this.setProperty("fullScreen",true,true);}};h.prototype._openFullScreen=function(){var i=P.Dock;this.$content=this.$();if(this.$content){this.$tempNode=q("<div></div>");this.$content.before(this.$tempNode);this._$overlay=q("<div id='"+q.sap.uid()+"'></div>");this._$overlay.addClass("sapSuiteUiCommonsChartContainerOverlay");this._$overlay.addClass("sapSuiteUiCommonsChartContainerChartArea");this._$overlay.append(this.$content);this._oPopup.setContent(this._$overlay);}else{q.sap.log.warn("Overlay: content does not exist or contains more than one child");}this._oPopup.open(200,i.BeginTop,i.BeginTop,q("body"));if(!D.system.desktop){q.sap.delayedCall(500,this,this._performHeightChanges.bind(this));}};h.prototype._closeFullScreen=function(){if(this._oScrollEnablement!==null){this._oScrollEnablement.destroy();this._oScrollEnablement=null;}this.$tempNode.replaceWith(this.$content);this._oToolBar.setDesign(M.ToolbarDesign.Auto);this._oPopup.close();this._$overlay.remove();};h.prototype._performHeightChanges=function(){var t,v;if(this.getAutoAdjustHeight()||this.getFullScreen()){var $=this.$(),s,i,I;t=$.find(".sapSuiteUiCommonsChartContainerToolBarArea :first");v=$.find(".sapSuiteUiCommonsChartContainerChartArea :first");s=this.getSelectedContent();if(t[0]&&v[0]&&s){var j=$.height();var k=t.height();var m=Math.round(parseFloat(t.css("borderBottomWidth")));var n=j-k-m;var E=v.height();i=s.getContent();if(i){I=i.getMetadata().getName();if(I==="sap.viz.ui5.controls.VizFrame"||I==="sap.chart.Chart"){if(n>0&&n!==E){this._rememberOriginalHeight(i);i.setHeight(n+"px");}}else if(i.getDomRef().offsetWidth!==this.getDomRef().clientWidth){this.rerender();}}}}};h.prototype._rememberOriginalHeight=function(i){var H;if(q.isFunction(i.getHeight)){H=i.getHeight();}else{H=0;}this._mOriginalVizFrameHeights[i.getId()]=H;};h.prototype._switchChart=function(i){var o=this._findChartById(i);this._setSelectedContent(o);this.fireContentChange({selectedItemId:i});this.rerender();};h.prototype._chartChange=function(){var j=this.getContent();this._destroyButtons(this._aUsedContentIcons);this._aUsedContentIcons=[];if(this.getContent().length===0){this._oChartSegmentedButton.removeAllButtons();this._setDefaultOnSegmentedButton();this.switchChart(null);}if(j){var s=this.getShowLegend();var I;var o;for(var i=0;i<j.length;i++){if(!j[i].getVisible()){continue;}I=j[i].getContent();if(q.isFunction(I.setVizProperties)){I.setVizProperties({legend:{visible:s},sizeLegend:{visible:s}});}if(q.isFunction(I.setWidth)){I.setWidth("100%");}if(q.isFunction(I.setHeight)&&this._mOriginalVizFrameHeights[I.getId()]){I.setHeight(this._mOriginalVizFrameHeights[I.getId()]);}o=new B({icon:j[i].getIcon(),type:b.Transparent,width:"3rem",tooltip:j[i].getTitle(),customData:[new e({key:'chartId',value:I.getId()})],press:this._onButtonIconPress.bind(this)});this._aUsedContentIcons.push(o);if(i===0){this._setSelectedContent(j[i]);this._oActiveChartButton=o;}}}this._bChartContentHasChanged=false;};h.prototype._findChartById=function(j){var o=this.getAggregation("content");if(o){for(var i=0;i<o.length;i++){if(o[i].getContent().getId()===j){return o[i];}}}return null;};h.prototype._getToolbarPlaceHolderPosition=function(t){var o;for(var i=0;i<t.getContent().length;i++){o=t.getContent()[i];if(o.getMetadata&&o.getMetadata().getName()==="sap.suite.ui.commons.ChartContainerToolbarPlaceholder"){return i;}}return-1;};h.prototype._addContentToolbar=function(i,p){if(!this._bHasApplicationToolbar){if(!p){this._oToolBar.addContent(i);}else{this._oToolBar.insertContent(i,p);}}else{if(i instanceof d){this._iPlaceholderPosition=this._getToolbarPlaceHolderPosition(this._oToolBar);return;}if(p){this._iPlaceholderPosition=this._iPlaceholderPosition+p;}this._oToolBar.insertAggregation("content",i,this._iPlaceholderPosition,true);this._iPlaceholderPosition=this._iPlaceholderPosition+1;}};h.prototype._rearrangeToolbar=function(){var t=this._aToolbarContent.length;for(var i=0;i<t;i++){this._oToolBar.insertContent(this._aToolbarContent[i],i);}};h.prototype._adjustIconsDisplay=function(){if(this.getShowSelectionDetails()){this._addContentToolbar(this._getSelectionDetails());}if(this.getShowLegendButton()){this._addContentToolbar(this._oShowLegendButton);}if(this.getShowZoom()&&D.system.desktop){this._addContentToolbar(this._oZoomInButton);this._addContentToolbar(this._oZoomOutButton);}if(this.getShowPersonalization()){this._addContentToolbar(this._oPersonalizationButton);}if(this.getShowFullScreen()){this._addContentToolbar(this._oFullScreenButton);}var i=0;for(i;i<this._aCustomIcons.length;i++){this._addContentToolbar(this._aCustomIcons[i]);}if(!this._bControlNotRendered){this._oChartSegmentedButton.removeAllButtons();}var I=this._aUsedContentIcons.length;if(I>1){for(i=0;i<I;i++){this._oChartSegmentedButton.addButton(this._aUsedContentIcons[i]);}this._addContentToolbar(this._oChartSegmentedButton);}};h.prototype._adjustSelectorDisplay=function(){if(this._aDimensionSelectors.length===0){this._oChartTitle.setVisible(true);this._addContentToolbar(this._oChartTitle);return;}for(var i=0;i<this._aDimensionSelectors.length;i++){if(q.isFunction(this._aDimensionSelectors[i].setAutoAdjustWidth)){this._aDimensionSelectors[i].setAutoAdjustWidth(true);}this._addContentToolbar(this._aDimensionSelectors[i]);}};h.prototype._adjustDisplay=function(){this._oToolBar=this.getToolbar();this._oToolBar.removeAllContent();this._oToolBar.setProperty("height","3rem",true);if(this._bHasApplicationToolbar){this._rearrangeToolbar();this._iPlaceholderPosition=0;}this._adjustSelectorDisplay();this._addContentToolbar(new d());this._adjustIconsDisplay();};h.prototype._addButtonToCustomIcons=function(i){var I=i;var s=I.getTooltip();var o=new c({icon:I.getSrc(),text:s,tooltip:s,type:b.Transparent,width:"3rem",visible:I.getVisible(),press:[{icon:I},this._onOverflowToolbarButtonPress.bind(this)]});this._aCustomIcons.push(o);};h.prototype._zoom=function(z){var o=this.getSelectedContent().getContent();if(o.getMetadata().getName()==="sap.viz.ui5.controls.VizFrame"){if(z){o.zoom({"direction":"in"});}else{o.zoom({"direction":"out"});}}if(z){this.fireCustomZoomInPress();}else{this.fireCustomZoomOutPress();}};h.prototype._destroyButtons=function(j){for(var i=0;i<j.length;i++){j[i].destroy();}};h.prototype._setShowLegendForAllCharts=function(s){var j=this.getContent();var I;for(var i=0;i<j.length;i++){I=j[i].getContent();if(q.isFunction(I.setLegendVisible)){I.setLegendVisible(s);}else{q.sap.log.info("ChartContainer: chart with id "+I.getId()+" is missing the setVizProperties property");}}};h.prototype.setFullScreen=function(i){if(this._bControlNotRendered){return this;}if(this.getFullScreen()===i){return this;}if(this.getProperty("fullScreen")!==i){this._toggleFullScreen();}return this;};h.prototype.setTitle=function(t){if(this.getTitle()===t){return this;}this._oChartTitle.setText(t);this.setProperty("title",t,true);return this;};h.prototype.setShowLegendButton=function(s){if(this.getShowLegendButton()===s){return this;}this.setProperty("showLegendButton",s,true);if(!this.getShowLegendButton()){this.setShowLegend(false);}return this;};h.prototype.setSelectorGroupLabel=function(s){if(this.getSelectorGroupLabel()===s){return this;}this.setProperty("selectorGroupLabel",s,true);return this;};h.prototype.setShowLegend=function(s){if(this.getShowLegend()===s){return this;}this.setProperty("showLegend",s,true);this._setShowLegendForAllCharts(s);return this;};h.prototype.setToolbar=function(t){if(!t||this._getToolbarPlaceHolderPosition(t)===-1){q.sap.log.info("A placeholder of type 'sap.suite.ui.commons.ChartContainerToolbarPlaceholder' needs to be provided. Otherwise, the toolbar will be ignored");return this;}if(this.getToolbar()!==t){this.setAggregation("toolbar",t);}if(this.getToolbar()){this._aToolbarContent=this.getToolbar().getContent();this._bHasApplicationToolbar=true;}else{this._aToolbarContent=null;this._bHasApplicationToolbar=false;}this.invalidate();return this;};h.prototype.getDimensionSelectors=function(){return this._aDimensionSelectors;};h.prototype.indexOfDimensionSelector=function(j){for(var i=0;i<this._aDimensionSelectors.length;i++){if(this._aDimensionSelectors[i]===j){return i;}}return-1;};h.prototype.addDimensionSelector=function(i){this._aDimensionSelectors.push(i);return this;};h.prototype.insertDimensionSelector=function(j,k){if(!j){return this;}var i;if(k<0){i=0;}else if(k>this._aDimensionSelectors.length){i=this._aDimensionSelectors.length;}else{i=k;}if(i!==k){q.sap.log.warning("ManagedObject.insertAggregation: index '"+k+"' out of range [0,"+this._aDimensionSelectors.length+"], forced to "+i);}this._aDimensionSelectors.splice(i,0,j);return this;};h.prototype.destroyDimensionSelectors=function(){if(this._oToolBar){for(var i=0;i<this._aDimensionSelectors.length;i++){if(this._aDimensionSelectors[i]){this._oToolBar.removeContent(this._aDimensionSelectors[i]);this._aDimensionSelectors[i].destroy();}}}this._aDimensionSelectors=[];return this;};h.prototype.removeDimensionSelector=function(i){if(!i){return null;}if(this._oToolBar){this._oToolBar.removeContent(i);}var j=this.indexOfDimensionSelector(i);if(j===-1){return null;}else{return this._aDimensionSelectors.splice(j,1)[0];}};h.prototype.removeAllDimensionSelectors=function(){var j=this._aDimensionSelectors.slice();if(this._oToolBar){for(var i=0;i<this._aDimensionSelectors.length;i++){if(this._aDimensionSelectors[i]){this._oToolBar.removeContent(this._aDimensionSelectors[i]);}}}this._aDimensionSelectors=[];return j;};h.prototype.addContent=function(i){this.addAggregation("content",i);this._bChartContentHasChanged=true;return this;};h.prototype.insertContent=function(i,j){this.insertAggregation("content",i,j);this._bChartContentHasChanged=true;return this;};h.prototype.updateContent=function(){this.updateAggregation("content");this._bChartContentHasChanged=true;};h.prototype.addAggregation=function(i,o,s){if(i==="dimensionSelectors"){return this.addDimensionSelector(o);}else{return a.prototype.addAggregation.apply(this,arguments);}};h.prototype.getAggregation=function(i,j){if(i==="dimensionSelectors"){return this.getDimensionSelectors();}else{return a.prototype.getAggregation.apply(this,arguments);}};h.prototype.indexOfAggregation=function(i,o){if(i==="dimensionSelectors"){return this.indexOfDimensionSelector(o);}else{return a.prototype.indexOfAggregation.apply(this,arguments);}};h.prototype.insertAggregation=function(i,o,j,s){if(i==="dimensionSelectors"){return this.insertDimensionSelector(o,j);}else{return a.prototype.insertAggregation.apply(this,arguments);}};h.prototype.destroyAggregation=function(i,s){if(i==="dimensionSelectors"){return this.destroyDimensionSelectors();}else{return a.prototype.destroyAggregation.apply(this,arguments);}};h.prototype.removeAggregation=function(i,o,s){if(i==="dimensionSelectors"){return this.removeDimensionSelector(o);}else{return a.prototype.removeAggregation.apply(this,arguments);}};h.prototype.removeAllAggregation=function(i,s){if(i==="dimensionSelectors"){return this.removeAllDimensionSelectors();}else{return a.prototype.removeAllAggregation.apply(this,arguments);}};h.prototype.getSelectedContent=function(){return this._oSelectedContent;};h.prototype.getScrollDelegate=function(){return this._oScrollEnablement;};h.prototype.switchChart=function(i){this._setSelectedContent(i);this.rerender();};h.prototype.updateChartContainer=function(){this._bChartContentHasChanged=true;this.rerender();return this;};return h;});