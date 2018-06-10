jQuery.sap.declare("sap.zen.crosstab.DimensionHeaderArea");jQuery.sap.require("sap.zen.crosstab.BaseArea");jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");
sap.zen.crosstab.DimensionHeaderArea=function(c){"use strict";sap.zen.crosstab.BaseArea.call(this,c);this.sAreaType=sap.zen.crosstab.rendering.RenderingConstants.TYPE_DIMENSION_HEADER_AREA;};
sap.zen.crosstab.DimensionHeaderArea.prototype=jQuery.sap.newObject(sap.zen.crosstab.BaseArea.prototype);
sap.zen.crosstab.DimensionHeaderArea.prototype.renderArea=function(r){var c="sapzencrosstab-DimensionHeaderArea";if(this.oCrosstab.getPropertyBag().isMobileMode()){c+=" sapzencrosstab-MobileHeaderSeparator";}this.renderContainerStructure(r,c,false,false);};
sap.zen.crosstab.DimensionHeaderArea.prototype.getPageManager=function(){return null;};
