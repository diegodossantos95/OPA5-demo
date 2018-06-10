sap.ui.define(["sap/m/HeaderContainer","sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterDialogController","sap/m/Label","sap/ui/comp/odata/ODataModelUtil","sap/ui/comp/smartfilterbar/FilterProvider","sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/VisualFilterProvider","sap/ui/comp/smartvariants/PersonalizableInfo","sap/ui/comp/smartvariants/SmartVariantManagement","sap/ui/model/Filter","sap/m/OverflowToolbar","sap/m/ToolbarSpacer","sap/ui/comp/odata/MetadataAnalyser","sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil","sap/suite/ui/generic/template/AnalyticalListPage/util/V4Terms","sap/m/VBox","sap/m/Button"],function(H,V,L,O,F,a,P,S,b,c,T,M,d,e,f,B){"use strict";var D=sap.ui.model.SimpleType.extend("sap.ui.model.DimensionFilterType",{formatValue:function(v){return v;},parseValue:function(v){return v;},validateValue:function(v){}});var g=H.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar",{metadata:{designTime:true,properties:{entitySet:{type:"string",group:"Misc",defaultValue:null},config:{type:"object",group:"Misc",defaultValue:null},persistencyKey:{type:"string",group:"Misc",defaultValue:null},displayCurrency:{type:"string",group:"Misc",defaultValue:null},smartFilterId:{type:"string",group:"Misc",defaultValue:null},textArrangement:{type:"string",group:"Misc",defaultValue:sap.ui.comp.smartfilterbar.DisplayBehaviour.descriptionAndId}},associations:{smartVariant:{type:"sap.ui.core.Control",multiple:false}},events:{filterChange:{}}},renderer:{}});g.prototype.init=function(){if(H.prototype.init){H.prototype.init.apply(this,arguments);}this._cellItemHeightNorth="2.0rem";this._cellItemHeightSouth="7.9rem";this._cellHeight="10.9rem";this._cellWidth="20rem";this.labelHeight=2.0;this.compHeight=7.9;this.cellHeightPadding=1;this.cellHeight=(this.labelHeight+this.compHeight+this.cellHeightPadding)+"rem";this.cellWidth=320;this._dialogFilters={};this._compactFilters={};this._oVariantConfig={};this._smartFilterContext;this._oMetadataAnalyser;this.setModel(new sap.ui.model.json.JSONModel(),'_visualFilterConfigModel');this.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterBar");};g.prototype.propagateProperties=function(){H.prototype.propagateProperties.apply(this,arguments);this._initMetadata();};g.prototype._initMetadata=function(){if(!this.bIsInitialised){O.handleModelInit(this,this._onMetadataInit);}};g.prototype._onMetadataInit=function(){if(this.bIsInitialised){return;}this._annoProvider=this._createVisualFilterProvider();if(!this._annoProvider){return;}this._oMetadataAnalyser=this._annoProvider.getMetadataAnalyser();this.bIsInitialised=true;var h=this._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.getEntitySet());this.setTextArrangement(this._oMetadataAnalyser.getTextArrangementValue(h));this._updateFilterBar();};g.prototype._createVisualFilterProvider=function(){var m=this.getModel();var h=this.getEntitySet();if(!m||!h){return null;}return new a(this);};g.prototype._getBasicGroupTitle=function(){return this.getModel("i18n").getResourceBundle().getText("VIS_FILTER_GRP_BASIC_TITLE");};g.prototype._getFieldGroupForProperty=function(E,C){return this._annoProvider?this._annoProvider._getFieldGroupForProperty(E,C):undefined;};g.prototype._getGroupList=function(){return this._annoProvider?this._annoProvider.getGroupList():[];};g.prototype._getGroupMap=function(){return this._annoProvider?this._annoProvider.getGroupMap():{};};g.prototype._getMeasureMap=function(){return this._annoProvider?this._annoProvider.getMeasureMap():{};};g.prototype._getDimensionMap=function(){return this._annoProvider?this._annoProvider.getDimensionMap():{};};g.prototype.setSmartFilterContext=function(C){this._smartFilterContext=C;};g.prototype._updateFilterBar=function(){var h=this._getAnnotationSettings();if(h&&h.filterList){var i=this._convertSettingsToConfig(h);}else{i={filterCompList:[]};this.getModel('_visualFilterConfigModel').setData(i);return;}var v=this._getVariantConfig();if(v&&v.config){i.filterCompList.forEach(function(j){if(v.config[j.component.properties.parentProperty]){jQuery.extend(true,j,v.config[j.component.properties.parentProperty]);}});this._oVariantConfig=i;}this.unbindAggregation('content',true);this.getModel('_visualFilterConfigModel').setData(i);this.bindAggregation('content',{path:"_visualFilterConfigModel>/filterCompList",factory:function(I,C){var o=C.getProperty('component'),p=o?o.properties:undefined,s=this._resolveChartType(o?o.type:undefined);return this._createHeaderItems(C.sPath,s,p);}.bind(this),filters:new sap.ui.model.Filter("shownInFilterBar",sap.ui.model.FilterOperator.EQ,true)});return;};g.prototype._createHeaderItems=function(p,t,o){var h=this._createFilterItemOfType(t,o),i=h.getInParameters(),j=[],m=this;if(i&&i.length>0){i.forEach(function(s){j.push({path:'_filter>/'+s.localDataProperty});});}h.addCustomData(new sap.ui.core.CustomData({key:'sPath',value:p}));if(m.getEntitySet()===h.getEntitySet()){var k=m._smartFilterContext.determineMandatoryFilterItems();if(k&&k.length>0){k.forEach(function(s){j.push({path:'_filter>/'+s.getName()});});}}h.bindProperty('dimensionFilter',{path:'_filter>/'+h.getParentProperty(),type:new D()});h.bindProperty('measureField',{path:'_visualFilterConfigModel>'+p+'/component/properties/measureField'});h.bindProperty('sortOrder',{path:'_visualFilterConfigModel>'+p+'/component/properties/sortOrder'});h.bindProperty('unitField',{path:'_visualFilterConfigModel>'+p+'/component/properties/measureField',formatter:function(){var s=m._getMeasureMap();var u=s[this.getEntitySet()][this.getMeasureField()];return u?u.fieldInfo.unit:"";}});if(j&&j.length>0){h.bindProperty('dimensionFilterExternal',{parts:j,formatter:function(){var i=this.getInParameters(),s=this.getParentProperty();var u,v;if(!(m.getEntitySet()===this.getEntitySet()&&m._smartFilterContext.getAnalyticBindingPath()!=="")&&(m._smartFilterContext.getAnalyticBindingPath()===""||((m._smartFilterContext.getAnalyticBindingPath().indexOf("P_DisplayCurrency"))!=-1))){var w=m.getProperty("displayCurrency");if(w){var x=this.getMeasureField();var y=m.getModel();var z=y.getMetaModel();var E=z.getODataEntityType(m._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.getEntitySet()));var A=z.getODataProperty(E,x);if(A){var G=A[e.ISOCurrency];if(G){var I=G.Path;for(var J=(i.length-1);J>-1;J--){var K=i[J].valueListProperty;var N=i[J].localDataProperty;if(K===I){var Q=m._smartFilterContext.getFilterData();if(!Q[N]){v=z.getODataProperty(E,I);if(v&&v["sap:filterable"]!=="false"){u=new sap.ui.model.Filter({aFilters:[new sap.ui.model.Filter({path:I,operator:"EQ",value1:w,value2:undefined})],and:false});}}break;}}}}}}return m._getFiltersForFilterItem(i,s,u,I);}});}if(h.attachFilterChange){h.attachFilterChange(this._onFilterChange,this);}if(h.attachTitleChange){h.attachTitleChange(this._onTitleChange,this);}var l=this._createTitleToolbar(o,h),n=new f({height:this._cellItemHeightNorth,items:[l]});var q=new f({width:"100%",height:this._cellItemHeightSouth,items:[new sap.m.Text({width:this.cellWidth+"px",textAlign:sap.ui.core.TextAlign.Center,text:{path:'_visualFilterConfigModel>'+p+'/overlayMessage',formatter:function(s){return this.getModel("i18n").getResourceBundle().getText(s);}}})],visible:{path:'_visualFilterConfigModel>'+p+'/showChartOverlay',formatter:function(v){return v;}}});q.addStyleClass("sapUiOverlay");q.addStyleClass("sapSmartTemplatesAnalyticalListPageVFOverflow");var r=new f({height:this._cellItemHeightSouth,items:[h],visible:{path:"_visualFilterConfigModel>"+p+"/showChartOverlay",formatter:function(v){return!v;}}});var C=new f({fieldGroupIds:["headerBar"],height:this._cellHeight,width:this.cellWidth+"px",items:[n,q,r]});return C;};g.prototype._getAnnotationSettings=function(){return this._annoProvider?this._annoProvider.getVisualFilterConfig():null;};g.prototype._convertSettingsToConfig=function(s,I){var h={filterCompList:[]};var k=this._getGroupList();var l={};for(var i=0;i<k.length;i++){var m=k[i];for(var j=0;j<m.fieldList.length;j++){var n=m.fieldList[j];l[n.name]={name:m.name,label:m.label};}}var o=this._getGroupMap();var p=o["_BASIC"];var q=[];if(p&&p.fieldList){for(var i=0;i<p.fieldList.length;i++){q.push(p.fieldList[i].name);}}var r=this._getMeasureMap(),t=s.filterList,v={};for(var i=0;i<t.length;i++){var u=t[i];var w=u.dimension.field;var x=r[u.collectionPath][u.measure.field];var y=false;if(x.fieldInfo[e.ISOCurrency]){y=true;}var C={shownInFilterBar:u.selected,component:{type:u.type,properties:{sortOrder:u.sortOrder,measureField:u.measure.field,parentProperty:u.parentProperty?u.parentProperty:undefined}}};if(!I){var z={shownInFilterDialog:u.selected||q.indexOf(w)!=-1,group:l[u.parentProperty],component:{properties:{scaleFactor:u.scaleFactor,numberOfFractionalDigits:u.numberOfFractionalDigits,filterRestriction:u.filterRestriction,width:this.cellWidth+"px",height:this.compHeight+"rem",entitySet:u.collectionPath?u.collectionPath:this.getEntitySet(),dimensionField:w,dimensionFieldDisplay:u.dimension.fieldDisplay,dimensionFilter:u.dimensionFilter,unitField:x?x.fieldInfo.unit:"",isCurrency:y,isMandatory:u.isMandatory,outParameter:u.outParameter?u.outParameter:undefined,inParameters:u.inParameters?u.inParameters:undefined,textArrangement:this.getTextArrangement(),chartQualifier:u.chartQualifier?u.chartQualifier:undefined,dimensionFieldIsDateTime:u.dimensionFieldIsDateTime}}};jQuery.extend(true,C,z);h.filterCompList.push(C);}else{v[u.parentProperty]=C;}}return I?v:h;};g.prototype._setVariantModified=function(){if(this._oVariantManagement){this._oVariantManagement.currentVariantSetModified(true);}};g.prototype._onFilterChange=function(h){this._setVariantModified();this.fireFilterChange();};g.prototype._getFiltersForFilterItem=function(i,p,o,h){var j={},m=[],k=new sap.ui.model.Filter({aFilters:[],and:true});if(i){var r=function(q){q.sPath=v;};for(var l=(i.length-1);l>-1;l--){var n=i[l].localDataProperty,v=i[l].valueListProperty;if(n!==p&&m.indexOf(n)===-1){j=this._smartFilterContext.getFilters([n]);if(j&&j.length>0){if(j[0].aFilters){j[0].aFilters.forEach(r.bind(this));}else{r(j[0]);}m.push(n);k.aFilters.push(j[0]);}}}if(o){k.aFilters.push(o);}}return k;};g.prototype._createTitleToolbar=function(p,h){var t=new L({text:{path:"i18n>VIS_FILTER_TITLE_MD",formatter:function(){return h.getTitle();}}});if(h.getProperty("isMandatory")){t.addStyleClass("sapMLabelRequired");}var i=this._smartFilterContext.getControlByKey(p.parentProperty);this._smartFilterContext.ensureLoadedValueHelp(p.parentProperty);if(i){var s;var r=this.getModel("i18n").getResourceBundle();var I=i.getShowValueHelp&&i.getShowValueHelp(),j=new B({text:{path:"_filter>/"+h.getParentProperty(),formatter:function(C){s="";var l=h.getFilterRestriction(),m=0;if(C){if(l==='single'){m=1;}else{if(typeof C==="object"){if(C.value){m++;}if(C.items&&C.items.length){m+=C.items.length;}if(C.ranges&&C.ranges.length){m+=C.ranges.length;}}else{m++;}}}if(m){s=(m===1)?r.getText("SINGLE_SELECTED",m):r.getText("MULTI_SELECTED",m);}return m?"("+m+")":"";}},icon:I?"sap-icon://value-help":"",visible:{path:"_filter>/"+h.getParentProperty(),formatter:function(C){if(I){return true;}else{if(!C){return false;}if(typeof C==="object"){return(C.value||(C.items&&C.items.length)||(C.ranges&&C.ranges.length))?true:false;}return true;}}},press:function(E){if(I){i.fireValueHelpRequest.call(i);}else{V.launchAllFiltersPopup(j,h,E.getSource().getModel('i18n'));}},layoutData:new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.NeverOverflow}),tooltip:{path:"_filter>/"+h.getParentProperty(),formatter:function(){return d.getTooltipForValueHelp(I,r,s);}}});}var k=new c({design:sap.m.ToolbarDesign.Transparent,width:this.cellWidth+"px",content:[t,new T(),j]});k.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterTitleToolbar");return k;};g.prototype.getTitleByFilterItemConfig=function(h,u,s){var p=h.component.properties;var i=p.entitySet;var m=this.getModel();if(!m){return"";}var j="/"+i+"/";var k=m.getData(j+p.measureField+"/#@sap:label");var l=m.getData(j+p.dimensionField+"/#@sap:label");if(!u){u="";}if(!s){s="";}var t="";var r=this.getModel("i18n").getResourceBundle();if(s&&u){t=r.getText("VIS_FILTER_TITLE_MD_UNIT_CURR",[k,l,s,u]);}else if(u){t=r.getText("VIS_FILTER_TITLE_MD_UNIT",[k,l,u]);}else if(s){t=r.getText("VIS_FILTER_TITLE_MD_UNIT",[k,l,s]);}else{t=r.getText("VIS_FILTER_TITLE_MD",[k,l]);}return t;};g.prototype._onTitleChange=function(h){var C=h.getSource().getParent().getParent();var l=C.getItems()[0].getItems()[0].getContent()[0];if(h.getSource().getProperty("isMandatory")){l.addStyleClass("sapMLabelRequired");}l.setText(h.getSource().getTitle());l.setTooltip(h.getSource().getTitle());};g.prototype._getSupportedFilterItemList=function(){if(!this._supportedFilterItemList){this._supportedFilterItemList=[{type:"Bar",className:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroBar",iconLink:"sap-icon://horizontal-bar-chart",textKey:"VISUAL_FILTER_CHART_TYPE_BAR"},{type:"Donut",className:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroDonut",iconLink:"sap-icon://donut-chart",textKey:"VISUAL_FILTER_CHART_TYPE_Donut"},{type:"Line",className:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroLine",iconLink:"sap-icon://line-charts",textKey:"VISUAL_FILTER_CHART_TYPE_Line"}];}return this._supportedFilterItemList;};g.prototype._getSupportedFilterItemMap=function(){if(!this._supportedFilterItemMap){this._supportedFilterItemMap={};var h=this._getSupportedFilterItemList();for(var i=0;i<h.length;i++){var j=h[i];this._supportedFilterItemMap[j.type]=j;}}return this._supportedFilterItemMap;};g.prototype._resolveChartType=function(t){var h=this._getSupportedFilterItemMap();var i=h[t];if(!i){var j;for(j in h){i=h[j];break;}jQuery.sap.log.error("Could not resolve the filter component type: \""+t+"\", falling back to "+j);t=j;}return t;};g.prototype._createFilterItemOfType=function(t,p){var h=this._getSupportedFilterItemMap();var i=h[t];var j=i.className;jQuery.sap.require(j);var k=jQuery.sap.getObject(j);var l=new k(p);l.setSmartFilterId(this.getSmartFilterId());l.setModel(this.getModel('_filter'),'_filter');l.setModel(this.getModel('i18n'),'i18n');l.setModel(this.getModel("_templPriv"),"_templPriv");l.setModel(this.getModel('_visualFilterConfigModel'),"_visualFilterConfigModel");l.setModel(this.getModel());return l;};g.prototype.getConfig=function(I){var h=this.getModel('_visualFilterConfigModel').getData(),v={};if(!h){return{filterCompList:[]};}var j=0;var k=sap.ui.getCore().byFieldGroupId("headerBar");for(var i=0;i<h.filterCompList.length;i++){var l=h.filterCompList[i];if(I){v[l.component.properties.parentProperty]={shownInFilterBar:l.shownInFilterBar,component:{type:l.component.type,properties:{measureField:l.component.properties.measureField,sortOrder:l.component.properties.sortOrder,parentProperty:l.component.properties.parentProperty}}};}else{if(!l.shownInFilterBar){continue;}var m=k[j];if(!m){jQuery.sap.log.error("The configured selected filter bar items do not correspond to the actual filter bar items.  Could be an error during initialization, e.g. a chart class not found");return{filterCompList:[]};}j++;if(m._chart){var n=m;l.component.properties=n.getP13NConfig();}}}return I?v:h;};g.prototype.setSmartVariant=function(s){this.setAssociation("smartVariant",s);if(s){var p=new P({type:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar",keyName:"persistencyKey"});p.setControl(this);}this._oVariantManagement=this._getVariantManagementControl(s);if(this._oVariantManagement){this._oVariantManagement.addPersonalizableControl(p);this._oVariantManagement.initialise(this._variantInitialised,this);this._oVariantManagement.attachSave(this._onVariantSave,this);}else if(s){if(typeof s==="string"){jQuery.sap.log.error("Variant with id="+s+" cannot be found");}else if(s instanceof sap.ui.core.Control){jQuery.sap.log.error("Variant with id="+s.getId()+" cannot be found");}}else{jQuery.sap.log.error("Missing SmartVariant");}};g.prototype._getVariantManagementControl=function(s){var o=null;if(s){o=typeof s=="string"?sap.ui.getCore().byId(s):s;if(o&&!(o instanceof S)){jQuery.sap.log.error("Control with the id="+s.getId?s.getId():s+" not of expected type");return null;}}return o;};g.prototype._variantInitialised=function(){if(!this._oCurrentVariant){this._oCurrentVariant="STANDARD";}};g.prototype._onVariantSave=function(){if(this._oCurrentVariant=="STANDARD"){this._oCurrentVariant={config:this.getConfig(true)};}};g.prototype.applyVariant=function(v,C){this._oCurrentVariant=v;if(this._oCurrentVariant=="STANDARD"){this._oCurrentVariant=null;}if(this._oCurrentVariant&&this._oCurrentVariant.config&&this._oCurrentVariant.config.filterCompList){this._oCurrentVariant.config=null;}if(this._oCurrentVariant&&this._oCurrentVariant.config==null){var h=this._getAnnotationSettings();if(h&&h.filterList){this._oCurrentVariant.config=this._convertSettingsToConfig(h,true);}}this._updateFilterBar();if(this._oVariantManagement){this._oVariantManagement.currentVariantSetModified(false);}};g.prototype._getVariantConfig=function(){return this._oCurrentVariant;};g.prototype.fetchVariant=function(){if(!this._oCurrentVariant||this._oCurrentVariant=="STANDARD"){var h=this._getAnnotationSettings();if(h&&h.filterList){this._oCurrentVariant={config:this._convertSettingsToConfig(h,true)};return this._oCurrentVariant;}else{return{config:null};}}return{config:this.getConfig(true)};};g.prototype.updateVisualFilterBindings=function(A){var h=sap.ui.getCore().byFieldGroupId("headerBar");for(var i=0;i<h.length;i++){if(h[i]._chart){h[i]._updateBinding();h[i]._bAllowBindingUpdateOnPropertyChange=A===true;}}};g.prototype.addVisualFiltersToBasicArea=function(p){var h=jQuery.extend(true,{},this.getModel('_visualFilterConfigModel').getData()),j=(p&&p.constructor===Array&&p.length)?p.length:0,C=0;if(!h){jQuery.sap.log.error("Could not add filter to basic area. No config found!");return false;}else if(!j){jQuery.sap.log.error("Improper parameter passed. Pass an array of properties.");return false;}else{for(var i=0;i<h.filterCompList.length;i++){var k=h.filterCompList[i];if(p.indexOf(d.readProperty(k.component.properties.parentProperty))!==-1&&!k.shownInFilterBar){k.shownInFilterBar=true;k.shownInFilterDialog=true;C++;}}if(C){this.getModel('_visualFilterConfigModel').setData(h);return true;}else{jQuery.sap.log.info("Filters already present in visual filter basic area");return false;}}};return g;},true);
