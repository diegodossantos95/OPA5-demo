/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define(['sap/ushell/library','./TileBase'],function(l,T){"use strict";var D=T.extend("sap.ushell.ui.tile.DynamicTile",{metadata:{library:"sap.ushell",properties:{numberValue:{type:"string",group:"Data",defaultValue:'0.0'},numberState:{type:"sap.ushell.ui.tile.State",group:"Appearance",defaultValue:sap.ushell.ui.tile.State.Neutral},numberUnit:{type:"string",group:"Data",defaultValue:null},numberDigits:{type:"int",group:"Appearance",defaultValue:0},stateArrow:{type:"sap.ushell.ui.tile.StateArrow",group:"Appearance",defaultValue:sap.ushell.ui.tile.StateArrow.None},numberFactor:{type:"string",group:"Data",defaultValue:null}}}});return D;});
