/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/m/List','sap/m/PlacementType','sap/m/ResponsivePopover','sap/m/StandardListItem','./BaseValueListProvider','sap/ui/comp/util/FormatUtil','sap/ui/model/json/JSONModel'],function(q,L,P,R,S,B,F,J){"use strict";var V=B.extend("sap.ui.comp.providers.ValueHelpProvider",{constructor:function(p){if(p){this.preventInitialDataFetchInValueHelpDialog=p.preventInitialDataFetchInValueHelpDialog;this.sTitle=p.title;this.bSupportMultiselect=!!p.supportMultiSelect;this.bSupportRanges=p.supportRanges;this.bIsSingleIntervalRange=p.isSingleIntervalRange;this.bIsUnrestrictedFilter=p.isUnrestrictedFilter;this.bTakeOverInputValue=(p.takeOverInputValue===false)?false:true;if(this.bIsSingleIntervalRange){this.bSupportRanges=true;}this._sType=p.type;this._sMaxLength=p.maxLength;this._sScale=p.scale;this._sPrecision=p.precision;}B.apply(this,arguments);this._onInitialise();}});V.prototype._onInitialise=function(){if(this.oControl.attachValueHelpRequest){this._fVHRequested=function(e){if(!this.bInitialised){return;}this.oControl=e.getSource();this.bForceTriggerDataRetreival=e.getParameter("fromSuggestions");if(this.bTakeOverInputValue||this.bForceTriggerDataRetreival){this.sBasicSearchText=e.getSource().getValue();}this._createValueHelpDialog();}.bind(this);this.oControl.attachValueHelpRequest(this._fVHRequested);}};V.prototype._createValueHelpDialog=function(){if(!this.bCreated){this.bCreated=true;if(!this._oValueHelpDialogClass){sap.ui.require(['sap/ui/comp/valuehelpdialog/ValueHelpDialog'],this._onValueHelpDialogRequired.bind(this));}else{this._onValueHelpDialogRequired(this._oValueHelpDialogClass);}}};V.prototype._getTitle=function(){if(this.sTitle){return this.sTitle;}else if(this.oFilterProvider){return this.oFilterProvider._determineFieldLabel(this._fieldViewMetadata);}return"";};V.prototype._onValueHelpDialogRequired=function(a){this._oValueHelpDialogClass=a;var v=this.oControl.getId()+"-valueHelpDialog";this.oValueHelpDialog=new a(v,{stretch:sap.ui.Device.system.phone,basicSearchText:this.sBasicSearchText,supportRangesOnly:this.bIsSingleIntervalRange||!this.oPrimaryValueListAnnotation,supportMultiselect:this.bSupportMultiselect,title:this._getTitle(),supportRanges:this.bSupportRanges,displayFormat:this.sDisplayFormat,ok:this._onOK.bind(this),cancel:this._onCancel.bind(this),afterClose:function(){if(this.oPrimaryValueListAnnotation){this._resolveAnnotationData(this.oPrimaryValueListAnnotation);}this.oValueHelpDialog.destroy();this.bCreated=false;if(this.oControl&&this.oControl.focus&&!sap.ui.Device.system.phone){this.oControl.focus();}}.bind(this)});this.oControl.addDependent(this.oValueHelpDialog);this.oValueHelpDialog.suggest(function(c,f){if(this.oPrimaryValueListAnnotation){q.sap.require("sap.ui.comp.providers.ValueListProvider");c.setShowSuggestion(true);c.setFilterSuggests(false);return new sap.ui.comp.providers.ValueListProvider({control:c,fieldName:f,typeAheadEnabled:true,aggregation:"suggestionRows",displayFormat:this.sDisplayFormat,displayBehaviour:this.sTokenDisplayBehaviour,resolveInOutParams:false,annotation:this.oPrimaryValueListAnnotation,model:this.oODataModel,enableShowTableSuggestionValueHelp:false});}}.bind(this));if(this.bIsSingleIntervalRange){this.oValueHelpDialog.setIncludeRangeOperations([sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.BT,sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EQ],this._sType);this.oValueHelpDialog.setMaxIncludeRanges(1);this.oValueHelpDialog.setMaxExcludeRanges(0);this._updateInitialInterval();}else if((this._sType==="date"||this._sType==="time")&&!this.bIsUnrestrictedFilter){this.oValueHelpDialog.setIncludeRangeOperations([sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation.EQ],this._sType);this.oValueHelpDialog.setMaxExcludeRanges(0);}if(this.oControl.$()&&this.oControl.$().closest(".sapUiSizeCompact").length>0){this.oValueHelpDialog.addStyleClass("sapUiSizeCompact");}else if(this.oControl.$()&&this.oControl.$().closest(".sapUiSizeCozy").length>0){this.oValueHelpDialog.addStyleClass("sapUiSizeCozy");}else if(q("body").hasClass("sapUiSizeCompact")){this.oValueHelpDialog.addStyleClass("sapUiSizeCompact");}else{this.oValueHelpDialog.addStyleClass("sapUiSizeCozy");}if(this.bSupportRanges){this.oValueHelpDialog.setRangeKeyFields([{label:this._getTitle(),key:this.sFieldName,type:this._sType,scale:this._sScale,precision:this._sPrecision,maxLength:this._sMaxLength}]);}if(!(this.bIsSingleIntervalRange||!this.oPrimaryValueListAnnotation)){this.oValueHelpDialog.setModel(this.oODataModel);this._createAdditionalValueHelpControls();this._createCollectiveSearchControls();}if(this.oControl.getTokens){var t=this.oControl.getTokens();this.oValueHelpDialog.setTokens(t);}this.oValueHelpDialog.open();};V.prototype._updateInitialInterval=function(){var i=this.oControl.getValue(),t,r,v;if(i){t=new sap.m.Token();r={exclude:false,keyField:this.sFieldName};if(this._sType==="numeric"){v=F.parseFilterNumericIntervalData(i);}else{v=i.split("-");}if(v&&v.length===2){r.operation="BT";r.value1=v[0];r.value2=v[1];}else{r.operation="EQ";r.value1=i;}t.data("range",r);}if(t){this.oValueHelpDialog.setTokens([t]);}};V.prototype._createCollectiveSearchControls=function(){var p,l,I,i=0,a=0,o,A,r;if(this.additionalAnnotations&&this.additionalAnnotations.length){o=function(e){var s=e.getParameter("listItem"),b;p.close();if(s){b=s.data("_annotation");if(b){this._triggerAnnotationChange(b);}}}.bind(this);l=new L({mode:sap.m.ListMode.SingleSelectMaster,selectionChange:o});r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");p=new R({placement:P.Bottom,showHeader:true,contentHeight:"30rem",title:r.getText("COLLECTIVE_SEARCH_SELECTION_TITLE"),content:[l],afterClose:function(){this.oValueHelpDialog._rotateSelectionButtonIcon(false);}.bind(this)});I=new S({title:this.oPrimaryValueListAnnotation.valueListTitle});I.data("_annotation",this.oPrimaryValueListAnnotation);l.addItem(I);l.setSelectedItem(I);this.oValueHelpDialog.oSelectionTitle.setText(this.oPrimaryValueListAnnotation.valueListTitle);this.oValueHelpDialog.oSelectionTitle.setTooltip(this.oPrimaryValueListAnnotation.valueListTitle);a=this.additionalAnnotations.length;for(i=0;i<a;i++){A=this.additionalAnnotations[i];I=new S({title:A.valueListTitle});I.data("_annotation",A);l.addItem(I);}this.oValueHelpDialog.oSelectionButton.setVisible(true);this.oValueHelpDialog.oSelectionTitle.setVisible(true);this.oValueHelpDialog.oSelectionButton.attachPress(function(){if(!p.isOpen()){this.oValueHelpDialog._rotateSelectionButtonIcon(true);p.openBy(this.oValueHelpDialog.oSelectionButton);}else{p.close();}}.bind(this));}};V.prototype._triggerAnnotationChange=function(a){this.oValueHelpDialog.oSelectionTitle.setText(a.valueListTitle);this.oValueHelpDialog.oSelectionTitle.setTooltip(a.valueListTitle);this.oValueHelpDialog.resetTableState();this._resolveAnnotationData(a);this._createAdditionalValueHelpControls();};V.prototype._createAdditionalValueHelpControls=function(){var b=null;this.oValueHelpDialog.setKey(this.sKey);this.oValueHelpDialog.setKeys(this._aKeys);this.oValueHelpDialog.setDescriptionKey(this.sDescription);this.oValueHelpDialog.setTokenDisplayBehaviour(this.sTokenDisplayBehaviour);var c=new J();c.setData({cols:this._aCols});this.oValueHelpDialog.setModel(c,"columns");if(this.bSupportBasicSearch){b=this.sKey;}if(this.oSmartFilterBar){this.oSmartFilterBar._setCollectiveSearch(null);this.oSmartFilterBar.destroy();}this.oSmartFilterBar=new sap.ui.comp.smartfilterbar.SmartFilterBar(this.oValueHelpDialog.getId()+"-smartFilterBar",{entitySet:this.sValueListEntitySetName,basicSearchFieldName:b,enableBasicSearch:this.bSupportBasicSearch,advancedMode:true,showGoOnFB:!sap.ui.Device.system.phone,expandAdvancedArea:(!this.bForceTriggerDataRetreival&&sap.ui.Device.system.desktop),search:this._onFilterBarSearchPressed.bind(this),reset:this._onFilterBarResetPressed.bind(this),filterChange:this._onFilterBarFilterChange.bind(this),initialise:this._onFilterBarInitialise.bind(this)});if(this._oDateFormatSettings){this.oSmartFilterBar.data("dateFormatSettings",this._oDateFormatSettings);}this.oSmartFilterBar.isRunningInValueHelpDialog=true;this.oValueHelpDialog.setFilterBar(this.oSmartFilterBar);};V.prototype._onFilterBarFilterChange=function(){if(this.oValueHelpDialog.isOpen()){var t=this.oValueHelpDialog.getTable();if(t){t.setShowOverlay(true);this.oValueHelpDialog.TableStateSearchData();}}};V.prototype._onFilterBarSearchPressed=function(){this._rebindTable();};V.prototype._rebindTable=function(){var f,p,b,t,e,s;f=this.oSmartFilterBar.getFilters();p=this.oSmartFilterBar.getParameters()||{};if(this.aSelect&&this.aSelect.length){p["select"]=this.aSelect.toString();}if(this.sKey&&this._oMetadataAnalyser){e=this._oMetadataAnalyser.getFieldsByEntitySetName(this.sValueListEntitySetName);for(var i=0;i<e.length;i++){if(e[i].name===this.sKey&&e[i].sortable!==false){s=new sap.ui.model.Sorter(this.sKey);break;}}}b={path:"/"+this.sValueListEntitySetName,filters:f,parameters:p,sorter:s,events:{dataReceived:function(E){this.oValueHelpDialog.TableStateDataFilled();t.setBusy(false);var o=E.getSource(),a;if(o&&this.oValueHelpDialog&&this.oValueHelpDialog.isOpen()){a=o.getLength();if(a){this.oValueHelpDialog.update();}}}.bind(this)}};t=this.oValueHelpDialog.getTable();t.setShowOverlay(false);this.oValueHelpDialog.TableStateDataSearching();t.setBusy(true);if(t instanceof sap.m.Table){b.factory=function(I,c){var C=t.getModel("columns").getData().cols;return new sap.m.ColumnListItem({cells:C.map(function(a){var d=a.template;return new sap.m.Label({text:"{"+d+"}"});})});};t.bindItems(b);}else{t.bindRows(b);}};V.prototype._onFilterBarResetPressed=function(){this._calculateFilterInputData();if(this.oSmartFilterBar){this.oSmartFilterBar.setFilterData(this.mFilterInputData);}};V.prototype._onFilterBarInitialise=function(){var b=null;this._onFilterBarResetPressed();if(this.oSmartFilterBar&&this.oSmartFilterBar.getBasicSearchControl){b=this.oSmartFilterBar.getBasicSearchControl();if(b){b.setValue(this.sBasicSearchText);if(sap.ui.Device.system.phone&&b instanceof sap.m.SearchField){b.setShowSearchButton(true);}}}if(!this.preventInitialDataFetchInValueHelpDialog||this.bForceTriggerDataRetreival){this._rebindTable();this.bForceTriggerDataRetreival=false;}};V.prototype._onOK=function(c){var t=c.getParameter("tokens"),r,k,i=0,a=[],o=null;this._onCancel();if(this.oControl instanceof sap.m.MultiInput){this.oControl.setValue("");this.oControl.setTokens(t);i=t.length;while(i--){o=t[i].data("row");if(o){a.push(o);}}}else{if(t[0]){if(this.bIsSingleIntervalRange){r=t[0].data("range");if(r){if(r.operation==="BT"){k=r.value1+"-"+r.value2;}else{k=r.value1;}}}else{k=t[0].getKey();}o=t[0].data("row");if(o){a.push(o);}}this.oControl.setValue(k);this.oControl.fireChange({value:k,validated:true});}this._calculateAndSetFilterOutputData(a);};V.prototype._onCancel=function(){this.oValueHelpDialog.close();this.oValueHelpDialog.setModel(null);};V.prototype.destroy=function(){if(this.oControl&&this.oControl.detachValueHelpRequest){this.oControl.detachValueHelpRequest(this._fVHRequested);this._fVHRequested=null;}B.prototype.destroy.apply(this,arguments);if(this.oValueHelpDialog){this.oValueHelpDialog.destroy();this.oValueHelpDialog=null;}if(this.oSmartFilterBar){this.oSmartFilterBar.destroy();this.oSmartFilterBar=null;}this.sTitle=null;this._fieldViewMetadata=null;this._oValueHelpDialogClass=null;};return V;},true);