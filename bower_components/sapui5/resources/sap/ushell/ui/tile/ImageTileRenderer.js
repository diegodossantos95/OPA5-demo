// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ui/core/Renderer','./TileBaseRenderer'],function(R,T){"use strict";var I=R.extend(T);I.renderPart=function(r,c){r.write("<img");r.addClass("sapUshellImageTile");r.writeClasses();r.writeAttributeEscaped("src",c.getImageSource());r.writeAttributeEscaped("alt"," ");r.write("/>");};return I;},true);
