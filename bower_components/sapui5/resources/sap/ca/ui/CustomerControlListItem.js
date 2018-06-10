/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.CustomerControlListItem");jQuery.sap.require("sap.ca.ui.library");jQuery.sap.require("sap.m.CustomListItem");sap.m.CustomListItem.extend("sap.ca.ui.CustomerControlListItem",{metadata:{deprecated:true,library:"sap.ca.ui",properties:{"showSalesArea":{type:"boolean",group:"Misc",defaultValue:false},"customerID":{type:"string",group:"Misc",defaultValue:'CustomerID'},"customerName":{type:"string",group:"Misc",defaultValue:'CustomerName'},"salesOrganizationName":{type:"string",group:"Misc",defaultValue:'SalesOrganizationName'},"distributionChannelName":{type:"string",group:"Misc",defaultValue:'DistributionChannelName'},"divisionName":{type:"string",group:"Misc",defaultValue:'DivisionName'}}}});
/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.CustomerControlListItem");jQuery.sap.require("sap.m.Label");jQuery.sap.require("sap.m.Text");jQuery.sap.require("sap.m.ObjectIdentifier");jQuery.sap.require("sap.ca.ui.utils.resourcebundle");jQuery.sap.require("sap.ca.ui.model.format.FormattingLibrary");
sap.ca.ui.CustomerControlListItem.prototype._getFormattedObjectIdentifier=function(){var n=this.getCustomerName();var i=this.getCustomerID();var f;if(parseInt(i,10)!==0){f=sap.ca.ui.model.format.FormattingLibrary.commonIDFormatter(n,i);}else{f=n;}return f;};
sap.ca.ui.CustomerControlListItem.prototype._getObjectIdentifierControl=function(){var o,c=this._oContent;if(c){var i=c.getItems();if(i&&i.length>0){o=i[0];}}return o;};
sap.ca.ui.CustomerControlListItem.prototype._updateObjectIdentifierControlText=function(){var o=this._getObjectIdentifierControl();if(o){o.setTitle(this._getFormattedObjectIdentifier(),false);}};
sap.ca.ui.CustomerControlListItem.prototype._getSalesArea=function(){var s,c=this._oContent;if(c){var i=c.getItems();if(i&&i.length>2){s=i[2];}}return s;};
sap.ca.ui.CustomerControlListItem.prototype._getFormattedSalesAreaText=function(){return this.getSalesOrganizationName()+", "+this.getDistributionChannelName()+", "+this.getDivisionName();};
sap.ca.ui.CustomerControlListItem.prototype._updateSalesAreaText=function(){var s=this._getSalesArea();if(s){s.setText(this._getFormattedSalesAreaText(),false);}};
sap.ca.ui.CustomerControlListItem.prototype._addSalesArea=function(){if(this._oContent){var l=new sap.m.Label({text:sap.ca.ui.utils.resourcebundle.getText("CustomerContext.SalesArea")});var t=new sap.m.Text({text:this._getFormattedSalesAreaText()});this._oContent.addItem(l);this._oContent.addItem(t);}};
sap.ca.ui.CustomerControlListItem.prototype.getContent=function(){if(typeof this._oContent==='undefined'){this._oContent=new sap.m.VBox();this._oContent.addStyleClass("sapCaUiCustomerContextListItem");this._oContent.addStyleClass("sapMListTblCell");var o=new sap.m.ObjectIdentifier({title:this._getFormattedObjectIdentifier()});this._oContent.addItem(o);if(this.getShowSalesArea()){this._addSalesArea();}}return[this._oContent];};
sap.ca.ui.CustomerControlListItem.prototype.setShowSalesArea=function(v){var i,c=this._oContent;if(c){i=c.getItems();}this.setProperty("showSalesArea",v,true);if(i){var s=this.getShowSalesArea();if(s&&i.length===1){this._addSalesArea();}else if(!s&&i.length===3){var S=i[1];var o=i[2];c.removeItem(o);c.removeItem(S);S.destroy();o.destroy();}}return this;};
sap.ca.ui.CustomerControlListItem.prototype.setCustomerID=function(v){this.setProperty("customerID",v,true);this._updateObjectIdentifierControlText();return this;};
sap.ca.ui.CustomerControlListItem.prototype.setCustomerName=function(v){this.setProperty("customerName",v,true);this._updateObjectIdentifierControlText();return this;};
sap.ca.ui.CustomerControlListItem.prototype.setSalesOrganizationName=function(v){this.setProperty("salesOrganizationName",v,true);this._updateSalesAreaText();return this;};
sap.ca.ui.CustomerControlListItem.prototype.setDistributionChannelName=function(v){this.setProperty("distributionChannelName",v,true);this._updateSalesAreaText();return this;};
sap.ca.ui.CustomerControlListItem.prototype.setDivisionName=function(v){this.setProperty("divisionName",v,true);this._updateSalesAreaText();return this;};
