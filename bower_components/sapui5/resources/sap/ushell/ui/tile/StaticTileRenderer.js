// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ui/core/Renderer','./TileBaseRenderer'],function(R,T){"use strict";var S=R.extend(T);S.renderPart=function(r,c){r.write("<span");r.addClass("sapUshellStaticTile");r.writeClasses();r.write(">");r.write("</span>");};return S;},true);
