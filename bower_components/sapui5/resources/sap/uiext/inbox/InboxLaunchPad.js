/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.InboxLaunchPad");jQuery.sap.require("sap.uiext.inbox.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.uiext.inbox.InboxLaunchPad",{metadata:{deprecated:true,library:"sap.uiext.inbox",properties:{"title":{type:"string",group:"",defaultValue:'Inbox Launch Pad Title'},"logoSrc":{type:"string",group:"Misc",defaultValue:null},"showLogoutButton":{type:"boolean",group:"Misc",defaultValue:true},"showUserName":{type:"boolean",group:"Misc",defaultValue:true},"userName":{type:"string",group:"Misc",defaultValue:null}},aggregations:{"launchPadHeader":{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},"launchPadTileContainer":{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},events:{"tileSelected":{},"logout":{}}}});sap.uiext.inbox.InboxLaunchPad.M_EVENTS={'tileSelected':'tileSelected','logout':'logout'};
/*!
 * @copyright@
 * @deprecated Since version 1.38.0
 */
jQuery.sap.require("sap.ui.core.IconPool");jQuery.sap.require("sap.uiext.inbox.InboxTile");
sap.uiext.inbox.InboxLaunchPad.prototype.init=function(){var t=this;this.oCore=sap.ui.getCore();this._oBundle=this.oCore.getLibraryResourceBundle("sap.uiext.inbox");this.setAggregation("launchPadHeader",new sap.m.Bar("mbar",{contentMiddle:[new sap.m.Label({text:this.getTitle()})],contentRight:[new sap.m.Button({icon:sap.ui.core.IconPool.getIconURI("person-placeholder"),tooltip:this.getUserName(),type:sap.m.ButtonType.Transparent}),new sap.m.Button({tooltip:t._oBundle.getText("INBOX_LP_LOGOFF_TOOLTIP"),icon:sap.ui.core.IconPool.getIconURI("log"),type:sap.m.ButtonType.Default}).attachPress(function(){t.fireLogout();})],contentLeft:[new sap.m.Image({src:this.getLogoSrc()}).addStyleClass("logo")]}));var a=new sap.uiext.inbox.InboxTile({icon:"sap-icon://task",title:"{name}",number:"{numberOfTasks}"}).data("defID","{defID}").attachPress(function(e){t.fireTileSelected({"defID":this.data("defID")});});this.setAggregation("launchPadTileContainer",new sap.m.TileContainer({editable:false,allowAdd:false,tiles:{path:"/Tasks",template:a}}));};
sap.uiext.inbox.InboxLaunchPad.prototype.setTitle=function(t){this.setProperty("title",t,true);this.getAggregation("launchPadHeader").destroyContentMiddle().addContentMiddle(new sap.m.Label({text:this.getTitle()}));return this;};
sap.uiext.inbox.InboxLaunchPad.prototype.setUserName=function(u){if(u!==undefined){this.getAggregation("launchPadHeader").getContentRight()[0].setTooltip(u);}return this;};
sap.uiext.inbox.InboxLaunchPad.prototype.setShowUserName=function(s){if(s===true){this.getAggregation("launchPadHeader").getContentRight()[0].setVisible(true);}else{this.getAggregation("launchPadHeader").getContentRight()[0].setVisible(false);}return this;};
sap.uiext.inbox.InboxLaunchPad.prototype.setShowLogoutButton=function(s){if(s===true){this.getAggregation("launchPadHeader").getContentRight()[1].setVisible(true);}else{this.getAggregation("launchPadHeader").getContentRight()[1].setVisible(false);}return this;};
sap.uiext.inbox.InboxLaunchPad.prototype.setLogoSrc=function(l){this.setProperty("logoSrc",l,true);this.getAggregation("launchPadHeader").destroyContentLeft().addContentLeft(new sap.m.Image({src:this.getLogoSrc()}).addStyleClass("logo"));return this;};
