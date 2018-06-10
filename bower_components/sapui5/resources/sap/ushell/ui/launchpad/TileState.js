/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define(['sap/m/Text','sap/ui/core/Control','sap/ui/core/IconPool','sap/ushell/library'],function(T,C,I,l){"use strict";var a=C.extend("sap.ushell.ui.launchpad.TileState",{metadata:{library:"sap.ushell",properties:{state:{type:"string",group:"Misc",defaultValue:'Loaded'}}}});a.prototype.init=function(){this._rb=sap.ushell.resources.i18n;this._sFailedToLoad=this._rb.getText("cannotLoadTile");this._oWarningIcon=new sap.ui.core.Icon(this.getId()+"-warn-icon",{src:"sap-icon://notification",size:"1.37rem"});this._oWarningIcon.addStyleClass("sapSuiteGTFtrFldIcnMrk");};a.prototype.exit=function(){this._oWarningIcon.destroy();};a.prototype.setState=function(s,i){this.setProperty("state",s,i);return this;};return a;});
