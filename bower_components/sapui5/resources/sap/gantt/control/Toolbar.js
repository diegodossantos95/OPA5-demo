/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/core/Core","sap/m/OverflowToolbar","sap/m/OverflowToolbarLayoutData","sap/m/OverflowToolbarPriority","sap/m/ToolbarSpacer","sap/m/FlexBox","sap/m/FlexDirection","sap/m/FlexJustifyContent","sap/m/Button","sap/m/ButtonType","sap/m/SegmentedButton","sap/m/Select","sap/ui/core/Item","sap/m/ViewSettingsDialog","sap/m/ViewSettingsCustomTab","sap/m/PlacementType","sap/m/CheckBox","sap/ui/core/Orientation","./AssociateContainer","sap/gantt/legend/LegendContainer","sap/gantt/misc/Utility","sap/m/Slider","sap/m/Popover"],function(C,a,O,b,c,T,F,d,e,B,f,S,g,h,V,j,P,k,l,A,L,U,n,o){"use strict";var p=C.extend("sap.gantt.control.Toolbar",{metadata:{properties:{width:{type:"CSSSize",defaultValue:"100%"},height:{type:"CSSSize",defaultValue:"100%"},type:{type:"string",defaultValue:sap.gantt.control.ToolbarType.Global},sourceId:{type:"string"},zoomLevel:{type:"int",defaultValue:0},enableTimeScrollSync:{type:"boolean",defaultValue:true},enableCursorLine:{type:"boolean",defaultValue:true},enableNowLine:{type:"boolean",defaultValue:true},enableVerticalLine:{type:"boolean",defaultValue:true},enableAdhocLine:{type:"boolean",defaultValue:true},modes:{type:"object[]",defaultValue:[sap.gantt.config.DEFAULT_MODE]},mode:{type:"string",defaultValue:sap.gantt.config.DEFAULT_MODE_KEY},toolbarSchemes:{type:"object[]",defaultValue:[sap.gantt.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME,sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME,sap.gantt.config.EMPTY_TOOLBAR_SCHEME]},hierarchies:{type:"object[]",defaultValue:[sap.gantt.config.DEFAULT_HIERARCHY]},containerLayouts:{type:"object[]",defaultValue:[sap.gantt.config.DEFAULT_CONTAINER_SINGLE_LAYOUT,sap.gantt.config.DEFAULT_CONTAINER_DUAL_LAYOUT]}},aggregations:{legend:{type:"sap.ui.core.Control",multiple:false,visibility:"public"},customToolbarItems:{type:"sap.ui.core.Control",multiple:true,visibility:"public",singularName:"customToolbarItem"},_toolbar:{type:"sap.m.OverflowToolbar",multiple:false,visibility:"hidden"}},events:{sourceChange:{parameters:{id:{type:"string"}}},layoutChange:{parameters:{id:{type:"string"},value:{type:"string"}}},expandChartChange:{parameters:{action:{type:"string"},expandedChartSchemes:{type:"[]"}}},expandTreeChange:{parameters:{action:{type:"string"}}},zoomStopChange:{parameters:{index:{type:"int"},selectedItem:{type:"sap.ui.core.Item"}}},settingsChange:{parameters:{id:{type:"string"},value:{type:"boolean"}}},modeChange:{parameters:{mode:{type:"string"}}}}}});p.ToolbarItemPosition={Left:"Left",Right:"Right"};p.prototype.init=function(){this._oToolbar=new O({width:"auto",design:sap.m.ToolbarDesign.Auto});this.setAggregation("_toolbar",this._oToolbar,true);this._bClearCustomItems=true;this._resetToolbarInfo();this._oModesConfigMap={};this._oModesConfigMap[sap.gantt.config.DEFAULT_MODE_KEY]=sap.gantt.config.DEFAULT_MODE;this._oToolbarSchemeConfigMap={};this._oToolbarSchemeConfigMap[sap.gantt.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME_KEY]=sap.gantt.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME;this._oToolbarSchemeConfigMap[sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME_KEY]=sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME;this._oToolbarSchemeConfigMap[sap.gantt.config.EMPTY_TOOLBAR_SCHEME_KEY]=sap.gantt.config.EMPTY_TOOLBAR_SCHEME;this._oHierarchyConfigMap={};this._oHierarchyConfigMap[sap.gantt.config.DEFAULT_HIERARCHY_KEY]=sap.gantt.config.DEFAULT_HIERARCHY;this._oContainerLayoutConfigMap={};this._oContainerLayoutConfigMap[sap.gantt.config.DEFAULT_CONTAINER_SINGLE_LAYOUT_KEY]=sap.gantt.config.DEFAULT_CONTAINER_SINGLE_LAYOUT;this._oContainerLayoutConfigMap[sap.gantt.config.DEFAULT_CONTAINER_DUAL_LAYOUT_KEY]=sap.gantt.config.DEFAULT_CONTAINER_DUAL_LAYOUT;this._oZoomSlider=null;this._oSelect=null;this._iLiveChangeTimer=-1;this._aTimers=[];this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");};p.prototype._resetToolbarInfo=function(){this._oItemConfiguration={Left:[],Right:[]};this._oAllItems={Left:[],Right:[]};if(this._bClearCustomItems){this._aCustomItems=[];this._iCustomItemInsertIndex=-1;}};p.prototype.applySettings=function(s,i){if(this.getSourceId()&&this.getType()){this._resetAllCompositeControls();}var r=C.prototype.applySettings.apply(this,arguments);return r;};p.prototype.onAfterRendering=function(){if(this._oVHButton&&jQuery("#"+this._oVHButton.getId())[0]){jQuery("#"+this._oVHButton.getId()).attr("aria-label",this._oRb.getText("TLTP_SWITCH_GANTTCHART"));}};p.prototype.setLegend=function(i){this.setAggregation("legend",i);if(!this._oLegendPop){this._oLegendPop=new o({placement:P.Bottom,showArrow:false,showHeader:false});}if(i){this._oLegendPop.removeAllContent();this._oLegendPop.addContent(i);this._oLegendPop.setOffsetX(this._calcOffsetForLegendPopover());}};p.prototype.updateZoomLevel=function(z){if(z>=0){if(this._oZoomSlider){this._oZoomSlider.setValue(z);}if(this._oSelect){this._oSelect.setSelectedItem(this._oSelect.getItems()[z]);}this.setZoomLevel(z);}};p.prototype.setZoomLevel=function(z,i){this.setProperty("zoomLevel",z,i);if(this._oToolbarScheme&&!isNaN(z)&&this._oZoomInButton&&this._oZoomOutButton&&this._oToolbarScheme.getTimeZoom()){var m=this._oToolbarScheme.getTimeZoom().getStepCountOfSlider()-1,M=0;if(z===m){this._oZoomInButton.setEnabled(false);this._oZoomOutButton.setEnabled(true);}else if(z===M){this._oZoomInButton.setEnabled(true);this._oZoomOutButton.setEnabled(false);}else{this._oZoomInButton.setEnabled(true);this._oZoomOutButton.setEnabled(true);}}};p.prototype.setMode=function(m){this.setProperty("mode",m);if(this._oModeSegmentButton){this._oModeSegmentButton.setSelectedButton(this._oModeButtonMap[m]);}return this;};p.prototype.setHierarchies=function(H){this.setProperty("hierarchies",H,true);this._oHierarchyConfigMap={};if(H){for(var i=0;i<H.length;i++){this._oHierarchyConfigMap[H[i].getKey()]=H[i];}}this._resetAllCompositeControls();return this;};p.prototype.setContainerLayouts=function(m){this.setProperty("containerLayouts",m,true);this._oContainerLayoutConfigMap={};if(m){for(var i=0;i<m.length;i++){this._oContainerLayoutConfigMap[m[i].getKey()]=m[i];}}this._resetAllCompositeControls();return this;};p.prototype.setModes=function(m){this.setProperty("modes",m,true);this._oModesConfigMap={};if(m){for(var i=0;i<m.length;i++){this._oModesConfigMap[m[i].getKey()]=m[i];}}return this;};p.prototype.setToolbarDesign=function(t){this._oToolbar.setDesign(t);return this;};p.prototype.setToolbarSchemes=function(t){this.setProperty("toolbarSchemes",t,true);this._oToolbarSchemeConfigMap={};if(t){for(var i=0;i<t.length;i++){this._oToolbarSchemeConfigMap[t[i].getKey()]=t[i];}}this._resetAllCompositeControls();return this;};p.prototype.setSourceId=function(s){this.setProperty("sourceId",s,true);this._resetAllCompositeControls();return this;};p.prototype.setType=function(t){this.setProperty("type",t,true);this._resetAllCompositeControls();return this;};p.prototype.addCustomToolbarItem=function(i){if(this._iCustomItemInsertIndex==-1){this._oToolbar.insertContent(i,0);this._iCustomItemInsertIndex++;}else{this._oToolbar.insertContent(i,this._iCustomItemInsertIndex+1);this._iCustomItemInsertIndex++;}this._aCustomItems.push(i);return this;};p.prototype.insertCustomToolbarItem=function(i,I){var m=this._aCustomItems.length;if(I>=m){I=m;}if(this._iCustomItemInsertIndex===-1){this._oToolbar.insertContent(i,0);this._aCustomItems.push(i);}else{this._oToolbar.insertContent(i,this._iCustomItemInsertIndex-this._aCustomItems.length+1+I);this._aCustomItems.splice(I,0,i);}this._iCustomItemInsertIndex++;return this;};p.prototype.removeCustomToolbarItem=function(v){if(this._aCustomItems.length===0){return this._aCustomItems;}if((typeof v)==="number"){var i=this._aCustomItems.length;var r=v>i?i:v;this._oToolbar.removeContent(this._iCustomItemInsertIndex-i+r+1);this._iCustomItemInsertIndex--;return this._aCustomItems.splice(r,1);}else if(v){this._oToolbar.removeContent(v);this._iCustomItemInsertIndex--;return this._aCustomItems.splice(jQuery.inArray(v,this._aCustomItems),1);}};p.prototype.getCustomToolbarItems=function(){return this._aCustomItems.slice(0);};p.prototype.destroyCustomToolbarItems=function(){var i=this.removeAllCustomToolbarItems();i.forEach(function(m){m.destroy();});return i;};p.prototype.removeAllCustomToolbarItems=function(){var r=[];for(var i=0;i<this._aCustomItems.length;i++){r.push(this._oToolbar.removeContent(this._aCustomItems[i]));}this._iCustomItemInsertIndex=this._iCustomItemInsertIndex-this._aCustomItems.length;this._aCustomItems.splice(0,this._aCustomItems.length);return r;};p.prototype._resetAllCompositeControls=function(){this._determineToolbarSchemeConfig(this.getSourceId());this._destroyCompositeControls();if(!this._sToolbarSchemeKey){return;}this._resolvePositions();var i,q,s=p.ToolbarItemPosition.Left,r=p.ToolbarItemPosition.Right;var t=this._oItemConfiguration[s];for(i=0;i<t.length;i++){if(t[i]){this._createCompositeControl(s,i,t[i]);}}var R=this._oItemConfiguration[r];for(i=R.length-1;i>=0;i--){if(R[i]){this._createCompositeControl(r,i,R[i]);}}var u=function(q){if(jQuery.isArray(q)){for(var m=0;m<q.length;m++){this._oToolbar.addContent(q[m]);}}else if(q){this._oToolbar.addContent(q);}};for(i=0;i<this._oAllItems[s].length;i++){q=this._oAllItems[s][i];u.call(this,q);}if(this._oAllItems[s].length!==0||this._oAllItems[r].length!==0){this._oToolbar.addContent(new T());}for(i=0;i<this._oAllItems[r].length;i++){q=this._oAllItems[r][i];u.call(this,q);}};p.prototype.getAllToolbarItems=function(){return this._oToolbar.getContent();};p.prototype._determineToolbarSchemeConfig=function(s){this._sToolbarSchemeKey=null;if(this.getType()===sap.gantt.control.ToolbarType.Global&&this._oContainerLayoutConfigMap[s]){this._sToolbarSchemeKey=this._oContainerLayoutConfigMap[s].getToolbarSchemeKey();this._sInitMode=this.getMode()!=sap.gantt.config.DEFAULT_MODE_KEY?this.getMode():this._oContainerLayoutConfigMap[s].getActiveModeKey();}else if(this.getType()===sap.gantt.control.ToolbarType.Local&&this._oHierarchyConfigMap[s]){this._sToolbarSchemeKey=this._oHierarchyConfigMap[s].getToolbarSchemeKey();this._sInitMode=this.getMode()!=sap.gantt.config.DEFAULT_MODE_KEY?this.getMode():this._oHierarchyConfigMap[s].getActiveModeKey();}if(this._oToolbarScheme==this._oToolbarSchemeConfigMap[this._sToolbarSchemeKey]){this._bClearCustomItems=false;}else{this._oToolbarScheme=this._oToolbarSchemeConfigMap[this._sToolbarSchemeKey];this._bClearCustomItems=true;}if(this._oToolbarScheme&&this._oToolbarScheme.getProperty("toolbarDesign")){this.setToolbarDesign(this._oToolbarScheme.getProperty("toolbarDesign"));}};p.prototype._destroyCompositeControls=function(){var i=this._oToolbar.removeAllContent();this._resetToolbarInfo();};p.prototype._resolvePositions=function(){if(this._oToolbarScheme){jQuery.each(this._oToolbarScheme.getMetadata().getAllProperties(),function(m){if(m!=="key"&&m!=="toolbarDesign"){var q=this._oToolbarScheme.getProperty(m);if(q){var r=this._parsePosition(q.getPosition());this._oItemConfiguration[r.position][r.idx]=$.extend({},{groupId:m},q);}}}.bind(this));var s=this._oItemConfiguration;var i=Object.keys(s);i.forEach(function(m){var q=s[m],r=[];var t=Object.keys(q).sort();t.forEach(function(u,v){r.push(q[u]);});s[m]=r;});}};p.prototype._parsePosition=function(s){return{position:s.toUpperCase().substr(0,1)==="L"?p.ToolbarItemPosition.Left:p.ToolbarItemPosition.Right,idx:parseInt(s.substr(1,s.length-1),10)};};p.prototype._createCompositeControl=function(s,i,G){var v;switch(G.groupId){case"sourceSelect":v=this._genSourceSelectGroup(G);break;case"layout":v=this._genLayoutGroup(G);break;case"expandChart":v=this._genExpandChartGroup(G);break;case"expandTree":v=this._genExpandTreeGroup(G);break;case"customToolbarItems":v=this._genCustomToolbarItemGroup(s,G);break;case"mode":v=this._genModeButtonGroup(G);break;case"timeZoom":v=this._genTimeZoomGroupControls(G);break;case"legend":v=this._genLegend(G);break;case"settings":v=this._genSettings(G);break;default:break;}if(v){this._oAllItems[s]=this._oAllItems[s].concat(v);}};p.prototype._genSourceSelectGroup=function(G){var s=this.getSourceId();var t=this;var i;this._oSourceSelectBox=new g({layoutData:new b({priority:G.getOverflowPriority()}),width:"200px",change:function(E){var q=E.getParameter("selectedItem");var r=q.oSourceConfig;t.fireSourceChange({id:q.getKey(),config:r});}});switch(this.getType()){case sap.gantt.control.ToolbarType.Global:i=this.getContainerLayouts();this._oSourceSelectBox.setTooltip(this._oRb.getText("TLTP_GLOBAL_HIERARCHY_RESOURCES"));break;case sap.gantt.control.ToolbarType.Local:i=this.getHierarchies();this._oSourceSelectBox.setTooltip(this._oRb.getText("TLTP_LOCAL_HIERARCHY_RESOURCES"));break;default:return null;}var m;for(var I=0;I<i.length;I++){m=new h({key:i[I].getKey(),text:i[I].getText()});m.oSourceConfig=i[I];this._oSourceSelectBox.addItem(m);if(m.getKey()===s){this._oSourceSelectBox.setSelectedItem(m);}}return this._oSourceSelectBox;};p.prototype._genLayoutGroup=function(G){if(this.getType==="LOCAL"){return null;}var t=this,H=this.getHierarchies(),m,i;this._oAddGanttChartSelect=new g({icon:"sap-icon://add",type:sap.m.SelectType.IconOnly,autoAdjustWidth:true,maxWidth:"50px",tooltip:this._oRb.getText("TLTP_ADD_GANTTCHART"),forceSelection:false,layoutData:new b({priority:G.getOverflowPriority()}),change:function(q){if(q.getParameter("selectedItem")){var r=t.data("holder");if(r.getGanttCharts().length<r.getMaxNumOfGanttCharts()){if(!t._oLessGanttChartSelect.getEnabled()){t._oLessGanttChartSelect.setEnabled(true);if(t._oVHButton){t._oVHButton.setEnabled(true);}}if(r.getGanttCharts().length==r.getMaxNumOfGanttCharts()-1){this.setEnabled(false);}t.fireLayoutChange({id:"add",value:{hierarchyKey:q.getParameter("selectedItem").getKey(),hierarchyConfig:q.getParameter("selectedItem").data("hierarchyConfig")}});}if(r.getGanttCharts().length>r.getMaxNumOfGanttCharts()){this.setEnabled(false);}}}});if(H&&H.length>0){for(i=0;i<H.length;i++){m=new h({text:H[i].getText(),key:H[i].getKey()});m.data("hierarchyConfig",H[i]);this._oAddGanttChartSelect.addItem(m);}}var E=this._oContainerLayoutConfigMap[this.getSourceId()].getGanttChartLayouts().length>1?true:false;this._oLessGanttChartSelect=new g({icon:"sap-icon://less",type:sap.m.SelectType.IconOnly,tooltip:this._oRb.getText("TLTP_REMOVE_GANTTCHART"),maxWidth:"50px",autoAdjustWidth:true,forceSelection:false,enabled:E,layoutData:new b({priority:G.getOverflowPriority()}),change:function(q){if(q.getParameter("selectedItem")){var r=t.data("holder");if(r.getGanttCharts().length<=r.getMaxNumOfGanttCharts()){if(!t._oAddGanttChartSelect.getEnabled()){t._oAddGanttChartSelect.setEnabled(true);}}t.fireLayoutChange({id:"less",value:{hierarchyKey:q.getParameter("selectedItem").getKey(),hierarchyConfig:q.getParameter("selectedItem").data("hierarchyConfig"),ganttChartIndex:q.getParameter("selectedItem").data("ganttChartIndex")}});var u=q.getSource().getSelectedItem();if(u){u.setText("");}if(r.getGanttCharts().length==1){this.setEnabled(false);if(t._oVHButton){t._oVHButton.setEnabled(false);}}}}});this._oLessGanttChartSelect.addEventDelegate({onclick:this._fillLessGanttChartSelectItem},this);var I=this._oContainerLayoutConfigMap[this.getSourceId()].getOrientation()===l.Vertical?"sap-icon://resize-vertical":"sap-icon://resize-horizontal";var s=this._oContainerLayoutConfigMap[this.getSourceId()].getOrientation()===l.Vertical?this._oRb.getText("TLTP_ARRANGE_GANTTCHART_VERTICALLY"):this._oRb.getText("TLTP_ARRANGE_GANTTCHART_HORIZONTALLY");this._oVHButton=new B({icon:I,tooltip:s,type:G.getButtonType(),layoutData:new b({priority:G.getOverflowPriority()}),press:function(q){switch(this.getIcon()){case"sap-icon://resize-vertical":this.setIcon("sap-icon://resize-horizontal");this.setTooltip(t._oRb.getText("TLTP_ARRANGE_GANTTCHART_HORIZONTALLY"));t.fireLayoutChange({id:"orientation",value:l.Horizontal});break;case"sap-icon://resize-horizontal":this.setIcon("sap-icon://resize-vertical");this.setTooltip(t._oRb.getText("TLTP_ARRANGE_GANTTCHART_VERTICALLY"));t.fireLayoutChange({id:"orientation",value:l.Vertical});break;default:break;}}});this._oLayoutButton=[this._oAddGanttChartSelect,this._oLessGanttChartSelect,this._oVHButton];return this._oLayoutButton;};p.prototype._fillLessGanttChartSelectItem=function(){var G=this.data("holder").getGanttCharts(),I;this._oLessGanttChartSelect.removeAllItems();if(G&&G.length>0){for(var i=0;i<G.length;i++){I=new h({text:this._oHierarchyConfigMap[G[i].getHierarchyKey()].getText(),key:G[i].getHierarchyKey()});I.data("hierarchyConfig",this._oHierarchyConfigMap[G[i].getHierarchyKey()]);I.data("ganttChartIndex",i);this._oLessGanttChartSelect.insertItem(I,i);}}};p.prototype._genExpandChartGroup=function(G){this._aChartExpandButtons=[];var m=function(s){this.fireExpandChartChange({isExpand:s.getSource().data("isExpand"),expandedChartSchemes:s.getSource().data("chartSchemeKeys")});};var E=G.getExpandCharts(),q;for(var i=0;i<E.length;i++){var r=E[i];q=new B({icon:r.getIcon(),tooltip:r.getTooltip(),layoutData:new b({priority:G.getOverflowPriority()}),press:m.bind(this),type:G.getButtonType(),customData:[new sap.ui.core.CustomData({key:"isExpand",value:r.getIsExpand()}),new sap.ui.core.CustomData({key:"chartSchemeKeys",value:r.getChartSchemeKeys()})]});if(G.getShowArrowText()){q.setText(r.getIsExpand()?"ꜜ":"ꜛ");}this._aChartExpandButtons.push(q);}return this._aChartExpandButtons;};p.prototype._genCustomToolbarItemGroup=function(s,G){if(this._iCustomItemInsertIndex===-1){if(s==p.ToolbarItemPosition.Left){var t=this._oAllItems[s].length;this._iCustomItemInsertIndex=t-1;}else{var t=this._oAllItems[p.ToolbarItemPosition.Left].length+1+this._oAllItems[s].length;this._iCustomItemInsertIndex=t-1;}}return this._aCustomItems;};p.prototype._genExpandTreeGroup=function(G){var t=this;this._oTreeGroup=[new B({icon:"sap-icon://expand",tooltip:this._oRb.getText("TLTP_EXPAND"),type:G.getButtonType(),layoutData:new b({priority:G.getOverflowPriority()}),press:function(E){t.fireExpandTreeChange({action:"expand"});}}),new B({icon:"sap-icon://collapse",tooltip:this._oRb.getText("TLTP_COLLAPSE"),layoutData:new b({priority:G.getOverflowPriority()}),press:function(E){t.fireExpandTreeChange({action:"collapse"});}})];return this._oTreeGroup;};p.prototype._genModeButtonGroup=function(G){var m=function(E){var s=E.getParameter("button");this.fireModeChange({mode:s.data("mode")});};this._oModeSegmentButton=new S({select:m.bind(this)});this._oModeButtonMap={};var J=function(i,M){if(this._oModesConfigMap[M]){var q=new B({icon:this._oModesConfigMap[M].getIcon(),activeIcon:this._oModesConfigMap[M].getActiveIcon(),type:G.getButtonType(),tooltip:this._oModesConfigMap[M].getText(),layoutData:new b({priority:G.getOverflowPriority()}),customData:[new sap.ui.core.CustomData({key:"mode",value:M})]});this._oModeButtonMap[M]=q;this._oModeSegmentButton.addButton(q);}};jQuery.each(G.getModeKeys(),J.bind(this));if(this._sInitMode){this._oModeSegmentButton.setSelectedButton(this._oModeButtonMap[this._sInitMode]);}return this._oModeSegmentButton;};p.prototype._genTimeZoomGroupControls=function(G){var t=this;var z=G.getZoomControlType(),r=[],s,Z,m,q;var u=new b({priority:G.getOverflowPriority()});var v=function(E,H){jQuery.sap.clearDelayedCall(this._iLiveChangeTimer);this._iLiveChangeTimer=-1;var J=this.getZoomLevel();this.setZoomLevel(E,true);if(J===E){return;}this.fireZoomStopChange({index:E,selectedItem:H});jQuery.sap.log.debug("Toolbar Zoom Stop index is changed, zoomLevel is: "+E);};if(z===sap.gantt.config.ZoomControlType.None){return r;}else if(z===sap.gantt.config.ZoomControlType.Select){var w=[],I=this._oToolbarScheme.getTimeZoom().getInfoOfSelectItems();if(I.length>0){if(I[0]instanceof h){w=I;}else{for(var i=0;i<I.length;i++){var x=new h({key:I[i].key,text:I[i].text});w.push(x);}}}s=new g({items:w,layoutData:u,change:function(E){var s=E.getSource();var H=s.getSelectedItem();var J=s.indexOfItem(H);this._iLiveChangeTimer=jQuery.sap.delayedCall(200,t,v,[J,H]);}});this._oSelect=s;r.push(s);}else{var y=this._oToolbarScheme.getTimeZoom().getStepCountOfSlider();if(this.data("holder")&&this.data("holder").getSliderStep()){y=this.data("holder").getSliderStep();}if(z!==sap.gantt.config.ZoomControlType.ButtonsOnly){Z=new n({width:"200px",layoutData:u,max:y-1,value:this.getZoomLevel(),min:0,step:1,liveChange:function(E){var H=parseInt(E.getParameter("value"),10);jQuery.sap.clearDelayedCall(this._iLiveChangeTimer);this._iLiveChangeTimer=jQuery.sap.delayedCall(200,this,v,[H]);}.bind(this)});}if(z!==sap.gantt.config.ZoomControlType.SliderOnly){var D=function(E){return function(H){var J=parseInt(E?this._oZoomSlider.stepUp(1).getValue():this._oZoomSlider.stepDown(1).getValue(),10);this._iLiveChangeTimer=jQuery.sap.delayedCall(200,this,v,[J]);};};m=new sap.m.Button({icon:"sap-icon://zoom-in",type:G.getButtonType(),tooltip:this._oRb.getText("TLTP_SLIDER_ZOOM_IN"),layoutData:u.clone(),press:D(true).bind(this)});q=new B({icon:"sap-icon://zoom-out",type:G.getButtonType(),tooltip:this._oRb.getText("TLTP_SLIDER_ZOOM_OUT"),layoutData:u.clone(),press:D(false).bind(this)});}if(q){r.push(q);this._oZoomOutButton=q;}if(Z){r.push(Z);this._oZoomSlider=Z;}if(m){r.push(m);this._oZoomInButton=m;}}return r;};p.prototype._genLegend=function(G){if(!this._oLegendPop){this._oLegendPop=new o({placement:P.Bottom,showArrow:false,showHeader:false});}if(this.getLegend()){this._oLegendPop.removeAllContent();this._oLegendPop.addContent(this.getLegend());}this._oLegendButton=new B({icon:"sap-icon://legend",type:G.getButtonType(),tooltip:this._oRb.getText("TLTP_SHOW_LEGEND"),layoutData:new b({priority:G.getOverflowPriority(),closeOverflowOnInteraction:false}),press:function(E){this._oLegendPop.setOffsetX(this._calcOffsetForLegendPopover());var i=this._oLegendPop;if(i.isOpen()){i.close();}else{i.openBy(this._oLegendButton);}}.bind(this)});return this._oLegendButton;};p.prototype._genSettings=function(G){var s=G.getItems()||[];var t=this;var m=s.map(function(i){return new k({name:i.getKey(),text:i.getDisplayText(),tooltip:i.getTooltip(),selected:i.getChecked()}).addStyleClass("sapUiSettingBoxItem");});this._aOldSettingState=m.map(function(i){return i.getSelected();});var r=function(m){for(var i=0;i<m.length;i++){switch(m[i].getName()){case sap.gantt.config.SETTING_ITEM_ENABLE_NOW_LINE_KEY:m[i].setSelected(this.getEnableNowLine());break;case sap.gantt.config.SETTING_ITEM_ENABLE_CURSOR_LINE_KEY:m[i].setSelected(this.getEnableCursorLine());break;case sap.gantt.config.SETTING_ITEM_ENABLE_VERTICAL_LINE_KEY:m[i].setSelected(this.getEnableVerticalLine());break;case sap.gantt.config.SETTING_ITEM_ENABLE_ADHOC_LINE_KEY:m[i].setSelected(this.getEnableAdhocLine());break;case sap.gantt.config.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC_KEY:m[i].setSelected(this.getEnableTimeScrollSync());break;default:break;}}}.bind(this);this._oSettingsBox=new F({direction:d.Column,items:m}).addStyleClass("sapUiSettingBox");this._oSettingsDialog=new V({title:this._oRb.getText("SETTINGS_DIALOG_TITLE"),customTabs:[new j({content:this._oSettingsBox})],confirm:function(){var q=this._oSettingsBox.getItems();var u=[];for(var i=0;i<q.length;i++){u.push({id:q[i].getName(),value:q[i].getSelected()});t._aOldSettingState[i]=q[i].getSelected();}this.fireSettingsChange(u);}.bind(this),cancel:function(){r(m);}});this._oSettingsButton=new B({icon:"sap-icon://action-settings",type:G.getButtonType(),tooltip:this._oRb.getText("TLTP_CHANGE_SETTINGS"),layoutData:new b({priority:G.getOverflowPriority()}),press:function(E){this._oSettingsDialog.open();}.bind(this)});return this._oSettingsButton;};p.prototype.getToolbarSchemeKey=function(){return this._sToolbarSchemeKey;};p.prototype.setEnableNowLine=function(E){this.setProperty("enableNowLine",E,true);if(this._oSettingsBox&&this._oSettingsBox.getItems().length>0){this._setSettingItemProperties(sap.gantt.config.SETTING_ITEM_ENABLE_NOW_LINE_KEY,E);}return this;};p.prototype.setEnableCursorLine=function(E){this.setProperty("enableCursorLine",E,true);if(this._oSettingsBox&&this._oSettingsBox.getItems().length>0){this._setSettingItemProperties(sap.gantt.config.SETTING_ITEM_ENABLE_CURSOR_LINE_KEY,E);}return this;};p.prototype.setEnableVerticalLine=function(E){this.setProperty("enableVerticalLine",E,true);if(this._oSettingsBox&&this._oSettingsBox.getItems().length>0){this._setSettingItemProperties(sap.gantt.config.SETTING_ITEM_ENABLE_VERTICAL_LINE_KEY,E);}return this;};p.prototype.setEnableTimeScrollSync=function(E){this.setProperty("enableTimeScrollSync",E,true);if(this._oSettingsBox&&this._oSettingsBox.getItems().length>0){this._setSettingItemProperties(sap.gantt.config.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC_KEY,E);}return this;};p.prototype._setSettingItemProperties=function(s,m){var q=this._oSettingsBox.getItems();for(var i=0;i<q.length;i++){if(q[i].getName()===s){q[i].setSelected(m);break;}}};p.prototype.exit=function(){if(this._oLegendPop){this._oLegendPop.destroy(false);}if(this._oSettingsPop){this._oSettingsPop.destroy(false);}};p.prototype._calcOffsetForLegendPopover=function(){var i=0,m=65;var q=1;var z=1;var r=window.devicePixelRatio||1;r=Math.round(r*100)/100;if(sap.ui.Device.browser.name==="ie"){z=Math.round((screen.deviceXDPI/screen.logicalXDPI)*100)/100;}else if(sap.ui.Device.browser.name==="cr"){z=Math.round((window.outerWidth/window.innerWidth)*100)/100;}else{z=r;}if(z!==1){if(z<1||(z-1)%1===0){m+=m*(z-1)*0.1;}else{m=85;}r=Math.round(r*10)/10;if(z<1){q=r+Math.floor((1-z)*10)/10;}else if(z<=1.1){q=Math.round(z*10)/10*r;}else{q=r-Math.floor((z-1.1)*10)/10;}}if(a.getConfiguration().getRTL()===true){i=140;}else{var s=this._oLegendPop.getContent();if(s&&s.length>0){var t=sap.ui.getCore().byId(s[0].getContent());i=Math.round((m-parseInt(t.getWidth(),10))*q);}}return i;};p.prototype.getZoomLevels=function(){if(this._oToolbarScheme){var t=this._oToolbarScheme.getTimeZoom();if(t){switch(t.getZoomControlType()){case sap.gantt.config.ZoomControlType.Select:return t.getTextsOfSelect()||0;case sap.gantt.config.ZoomControlType.None:return-1;default:return t.getStepCountOfSlider();}}}return-1;};return p;},true);
