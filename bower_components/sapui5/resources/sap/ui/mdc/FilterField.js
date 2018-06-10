/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/model/json/JSONModel','./FilterFieldRenderer','sap/m/MultiInput','sap/ui/mdc/FilterToken','sap/ui/model/Filter','sap/ui/model/Sorter',"sap/ui/model/base/ManagedObjectModel","sap/ui/mdc/model/DateRange",'sap/ui/mdc/library'],function(q,C,J,F,M,a,b,S,c,D,l){"use strict";var E=l.EditMode;var d=C.extend("sap.ui.mdc.FilterField",{constructor:function(i,s){this._oManagedObjectModel=null;this._oActiveDelegate=null;C.apply(this,arguments);},metadata:{properties:{showValueHelp:{type:"boolean",group:"Data",defaultValue:true},dataType:{type:"any",group:"Data",defaultValue:"sap.ui.model.type.String"},dataTypeConstraints:{type:"object",group:"Data",defaultValue:null},dataTypeFormatOptions:{type:"object",group:"Data",defaultValue:null},fieldPath:{type:"string",group:"Data",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"15rem"},editable:{type:"boolean",group:"Data",defaultValue:true},editMode:{type:"sap.ui.mdc.EditMode",group:"Data",defaultValue:E.Editable},maxConditions:{type:"int",group:"Behavior",defaultValue:-1},placeholder:{type:"string",group:"Behavior",defaultValue:""},required:{type:"boolean",group:"Misc",defaultValue:false},valueState:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:sap.ui.core.ValueState.None},valueStateText:{type:"string",group:"Misc",defaultValue:null}},events:{valueHelpRequest:{},change:{parameters:{value:{type:"object"},type:{type:"string"},valid:{type:"boolean"}}},liveChange:{parameters:{value:{type:"string"},escPressed:{type:"boolean"}}}},aggregations:{_input:{type:"sap.ui.core.Control",multiple:false,hidden:true},conditions:{type:"sap.ui.mdc.Condition",multiple:true,_doesNotRequireFactory:true},content:{type:"sap.ui.core.Control",multiple:false}},publicMethods:[],defaultAggregation:"content"}});d.prototype.getFilterOperatorConfig=function(){if(!this._oFilterOpConfig&&this.getBinding("conditions")){var o=this.getBinding("conditions").getModel();this._oFilterOpConfig=o.getFilterOperatorConfig();}return this._oFilterOpConfig;};d.prototype.updateConditions=function(){var B=this.getBinding("conditions");if(B&&this._oManagedObjectModel){this._oManagedObjectModel.checkUpdate(true,true);B.getModel().addFilterField(this);}return this;};d.prototype.setWidth=function(w){var o=this.getWidth();this.setProperty("width",w,true);if(o!=this.getWidth()){var i=this.getAggregation("_input");if(i){i.setWidth(w);}}return this;};d.prototype.setEditable=function(g){var o=this.getEditable();this.setProperty("editable",g,true);if(o!=this.getEditable()){var i=this.getAggregation("_input");if(i){i.setEditable(g);}}return this;};d.prototype.setPlaceholder=function(p){var o=this.getPlaceholder();this.setProperty("placeholder",p,true);if(o!=this.getPlaceholder()){var i=this.getAggregation("_input");if(i){i.setPlaceholder(p);}}return this;};d.prototype.setMaxConditions=function(m){this.setProperty("maxConditions",m,true);return this;};d.prototype.setRequired=function(r){var o=this.getRequired();this.setProperty("required",r,true);if(o!=this.getRequired()){var i=this.getAggregation("_input");if(i){i.setRequired(r);}}return this;};d.prototype.bindAggregation=function(n,B){if(n==="conditions"){var s=this.getFieldPath();if(s&&!B.filters){B.filters=new sap.ui.model.Filter({path:"fieldPath",test:this._matchFieldPath.bind(this)});}if(!B.sorter){B.sorter=new sap.ui.model.Sorter("position",false);}}return C.prototype.bindAggregation.apply(this,[n,B]);};d.prototype._matchFieldPath=function(v){var s=this.getFieldPath().toUpperCase();return s===v;};d.prototype.setFieldPath=function(v){var o=this.getFieldPath();this.setProperty("fieldPath",v);if(o!==this.getFieldPath()&&this.mBindingInfos["conditions"]){var g=new b({path:"fieldPath",test:this._matchFieldPath.bind(this)});var B=this.getBinding("conditions");if(B){B.filter(g);}else{this.mBindingInfos["conditions"].filters=g;}}return this;};d.prototype._handleTokenContentChange=function(o){};d.prototype._handleTokenChange=function(g){var s=g.getId(),v,B,h,O,n,j;if(s==="tokenUpdate"){if(g.getParameter("type")==="added"){s="change";v=g.getParameter("addedTokens")[0].getText().trim();}if(g.getParameter("type")==="removed"){var r=g.getParameter("removedTokens"),k=[];r.forEach(function(o){k.push(o.getBindingContext("$filterField"));});B=this.getBinding("conditions");B.getModel().deleteConditions(k,B);}}if(s==="change"){q.sap.log.info("mdc:FilterField","_handleTokenChange for "+s);var m=g.getSource(),t=this._getDataType(),p=t.getMetadata().getName();if(m._getIsSuggestionPopupOpen&&m._getIsSuggestionPopupOpen()){var u=m.getSuggestionRows();var i=0;u.forEach(function(I){if(I.getVisible()){i++;}});if(i===1){return;}}B=this.getBinding("conditions");if(m instanceof sap.m.Select){v=g.getParameter("selectedItem").getText();}else{v=v||g.getParameter("value");v=v.trim();}q.sap.log.info("mdc:FilterField","_handleTokenChange sValue "+v);if(!v){if(m instanceof sap.m.MultiInput){}else if(this.getMaxConditions()>=0&&B.getModel().getConditions(this.getFieldPath()).length>0){B.getModel().removeCondition(this.getFieldPath(),0);}B.getModel().removeUIMessage(this.getFieldPath());return;}if(m instanceof sap.m.DateRangeSelection){j=this.getFilterOperatorConfig().getOperator("BT");v=v.replace(" - ","...");h=j.getCondition(v,t);if(h){h.fieldPath=this.getFieldPath();B.getModel().addCondition(h);this.fireChange({value:h,type:"added",valid:true});if(this.getMaxConditions()>=0&&B.getModel().getConditions(this.getFieldPath()).length>1){B.getModel().removeCondition(this.getFieldPath(),0);}return;}}O=this.getFilterOperatorConfig().getMatchingOperators(p,v);if(O.length===0){var w=this.getFilterOperatorConfig().getDefaultOperator(p);n=this.getFilterOperatorConfig().getOperator(w);v=n.format([v]);}else{n=O[0];}try{if(n&&n.test(v,t)){j=n;B.getModel().removeUIMessage(this.getFieldPath());}}catch(x){B.getModel().setUIMessage(this.getFieldPath(),x.message);}if(j){h=j.getCondition(v,t);if(h){h.fieldPath=this.getFieldPath();B.getModel().addCondition(h);this.fireChange({value:h,type:"added",valid:true});if(m instanceof sap.m.MultiInput){m.setValue("");}if(m instanceof sap.m.Select||m instanceof sap.m.DatePicker||m instanceof sap.m.TimePicker){if(this.getMaxConditions()>=0&&B.getModel().getConditions(this.getFieldPath()).length>1){B.getModel().removeCondition(this.getFieldPath(),0);}}}}}};d.prototype.getConditions=function(){if(this.getBinding("conditions")){var g=this.getBinding("conditions").getContexts(),h=[];for(var i=0;i<g.length;i++){h.push(g[i].getProperty());}return h;}return[];};var f=function(o){var r="";if(o){var O=this.getFilterOperatorConfig().getOperator(o.operator);var v=o.values;r=O.format(v,o,this._getDataType());}return r;};d.prototype._getDefaultInput=function(){var o;if(!this.getAggregation("_input")){if(this.getProperty("dataType").indexOf("Boolean")>-1&&this.getMaxConditions()===1){o=new sap.m.Select(this.getId()+"-inner",{width:this.getWidth(),selectedKey:"{$filterField>conditions/0/values/0}",valueState:{path:"$filterField>/valueState",mode:"OneWay"},valueStateText:{path:"$filterField>/valueStateText",mode:"OneWay"},items:[new sap.ui.core.Item({key:"",text:""}),new sap.ui.core.Item({key:false,text:this._getDataType().formatValue(false,"string")}),new sap.ui.core.Item({key:true,text:this._getDataType().formatValue(true,"string")})]});}else if(this.getProperty("dataType").indexOf(".Time")>-1&&this.getMaxConditions()===1){o=new sap.m.TimePicker(this.getId()+"-inner",{editable:{path:"$filterField>editMode",formatter:_},enabled:{path:"$filterField>editMode",formatter:e},width:"{$filterField>width}",required:"{$filterField>required}",value:{path:"$filterField>conditions/0/values/0",type:this._getDataType(),mode:"OneWay"},valueState:{path:"$filterField>/valueState",mode:"OneWay"},valueStateText:{path:"$filterField>/valueStateText",mode:"OneWay"}});}else if(this.getProperty("dataType").indexOf("Date")>-1&&this.getMaxConditions()===1){o=new sap.m.DatePicker(this.getId()+"-inner",{editable:{path:"$filterField>editMode",formatter:_},enabled:{path:"$filterField>editMode",formatter:e},width:"{$filterField>width}",required:"{$filterField>required}",value:{path:"$filterField>conditions/0/values/0",type:this._getDataType(),mode:"OneWay"},valueState:{path:"$filterField>/valueState",mode:"OneWay"},valueStateText:{path:"$filterField>/valueStateText",mode:"OneWay"}});}else if(this.getProperty("dataType").indexOf("Date")>-1&&this.getMaxConditions()===2){o=new sap.m.DateRangeSelection(this.getId()+"-inner",{editable:{path:"$filterField>editMode",formatter:_},enabled:{path:"$filterField>editMode",formatter:e},width:"{$filterField>width}",required:"{$filterField>required}",value:{parts:[{path:"$filterField>conditions/0/values/0",type:this._getDataType()},{path:"$filterField>conditions/0/values/1",type:this._getDataType()}],mode:"OneWay",type:"sap.ui.mdc.model.DateRange"},valueState:{path:"$filterField>/valueState",mode:"OneWay"},valueStateText:{path:"$filterField>/valueStateText",mode:"OneWay"}});}else{var t={};t.path="conditions";t.model="$filterField";t.template=new a({tokenChanged:this._handleTokenContentChange.bind(this),text:{path:'$filterField>',formatter:f.bind(this)},tooltip:{path:'$filterField>',formatter:f.bind(this)}});t.templateShareable=false;o=new M(this.getId()+"-inner",{tokens:t,editable:{path:"$filterField>editMode",formatter:_},enabled:{path:"$filterField>editMode",formatter:e},width:"{$filterField>width}",required:"{$filterField>required}",placeholder:"{$filterField>placeholder}",enableMultiLineMode:true,showSuggestion:false,valueState:{path:"$filterField>/valueState",mode:"OneWay"},valueStateText:{path:"$filterField>/valueStateText",mode:"OneWay"},showValueHelp:"{$filterField>showValueHelp}"});o.attachTokenUpdate(this._handleTokenChange,this);o.attachTokenChange(this._handleTokenChange,this);o.attachValueHelpRequest(this.fireValueHelpRequest,this);o.attachLiveChange(this._handleContentLiveChange,this);o.updateTokens=null;}o.attachChange(this._handleTokenChange,this);this.setAggregation("_input",o);this._input=o;this._activateManagedObjectModel();}return this.getAggregation("_input");};function _(s){if(s&&s==E.Editable){return true;}else{return false;}}function e(s){if(s&&s!=E.Disabled){return true;}else{return false;}}d.prototype._handleContentLiveChange=function(o){var v;var g=false;if("value"in o.getParameters()){v=o.getParameter("value");}if("escPressed"in o.getParameters()){g=o.getParameter("escPressed");}this.fireLiveChange({value:v,escPressed:g});};d.prototype.getContent=function(){if(!this.getAggregation("content")){return this._getDefaultInput();}return this.getAggregation("content");};d.prototype.clone=function(){if(this._input){this._input.detachChange(this._handleTokenChange,this);this._input.detachTokenUpdate(this._handleTokenChange,this);this._input.detachTokenChange(this._handleTokenChange,this);this._input.detachValueHelpRequest(this.fireValueHelpRequest,this);var t=this._input.getBindingInfo("tokens").template;if(t){t.detachTokenChanged(this._handleTokenContentChange,this);}var o=C.prototype.clone.apply(this,arguments);if(t){t.attachTokenChanged(this._handleTokenContentChange,this);}this._input.attachChange(this._handleTokenChange,this);this._input.attachTokenUpdate(this._handleTokenChange,this);this._input.attachTokenChange(this._handleTokenChange,this);this._input.attachValueHelpRequest(this.fireValueHelpRequest,this);var g=o.getAggregation("_input");g.attachChange(o._handleTokenChange,o);g.attachTokenUpdate(o._handleTokenChange,o);g.attachTokenChange(o._handleTokenChange,o);g.attachValueHelpRequest(o.fireValueHelpRequest,o);var h=g.getBindingInfo("tokens").template;if(h){h.attachTokenChanged(o._handleTokenContentChange,o);}}return o;};d.prototype.setContent=function(o){this._deactivateManagedObjectModel();this.setAggregation("content",o);this._activateManagedObjectModel();return this;};d.prototype.destroyContent=function(){this._deactivateManagedObjectModel();this.destroyAggregation("content");this._activateManagedObjectModel();return this;};d.prototype._updateConditionModel=function(o){var B=this.getBinding("conditions");if(B&&o.getParameter("resolvedPath").indexOf("/conditions")===0){B.getModel().checkUpdate(true,true);}};d.prototype._activateManagedObjectModel=function(){var o=this.getContent();if(o){if(!this._oManagedObjectModel){this._oManagedObjectModel=new c(this);this._oManagedObjectModel.setSizeLimit(1000);this._oManagedObjectModel.attachEvent("propertyChange",this._updateConditionModel.bind(this));}o.setModel(this._oManagedObjectModel,"$filterField");o.bindElement({path:"/",model:"$filterField"});}};d.prototype._deactivateManagedObjectModel=function(){var o=this.getContent();if(o){o.unbindElement("$filterField");this._oManagedObjectModel.destroy();this._oManagedObjectModel=null;}};d.prototype.setParent=function(){C.prototype.setParent.apply(this,arguments);if(!this.getParent()){this._deactivateManagedObjectModel();}else{this._activateManagedObjectModel();}};d.prototype.setDataType=function(v){delete this._oDataType;this.setProperty("dataType",v,true);};d.mapEdmTypes={"Edm.Boolean":"sap.ui.model.odata.type.Boolean","Edm.Byte":"sap.ui.model.odata.type.Byte","Edm.Date":"sap.ui.model.odata.type.Date","Edm.DateTime":"sap.ui.model.odata.type.DateTime","Edm.DateTimeOffset":"sap.ui.model.odata.type.DateTimeOffset","Edm.Decimal":"sap.ui.model.odata.type.Decimal","Edm.Double":"sap.ui.model.odata.type.Double","Edm.Float":"sap.ui.model.odata.type.Single","Edm.Guid":"sap.ui.model.odata.type.Guid","Edm.Int16":"sap.ui.model.odata.type.Int16","Edm.Int32":"sap.ui.model.odata.type.Int32","Edm.Int64":"sap.ui.model.odata.type.Int64","Edm.SByte":"sap.ui.model.odata.type.SByte","Edm.Single":"sap.ui.model.odata.type.Single","Edm.String":"sap.ui.model.odata.type.String","Edm.Time":"sap.ui.model.odata.type.Time","Edm.TimeOfDay":"sap.ui.model.odata.type.TimeOfDay"};d.prototype._createDataType=function(t){var O=q.sap.getObject(t);if(!O){var o=this.getFilterOperatorConfig(),n;if(o){n=o.getParentType(t);}else{n=d.mapEdmTypes[t];}if(!n){q.sap.log.error("FilterField","dataType for "+t+" can not be created!");return null;}return this._createDataType(n);}return new O(this.getDataTypeFormatOptions(),this.getDataTypeConstraints());};d.prototype._getDataType=function(t){if(!this._oDataType){this._oDataType=this.getProperty("dataType");if(typeof this._oDataType==="string"){this._oDataType=this._createDataType(this._oDataType);}}return this._oDataType;};return d;},true);
