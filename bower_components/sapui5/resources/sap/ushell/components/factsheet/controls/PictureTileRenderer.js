/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
*/
sap.ui.define(['sap/m/CustomTileRenderer','sap/ui/core/Renderer'],function(C,R){"use strict";var P=R.extend(C);P.render=function(r,c){jQuery.sap.log.debug("PictureTileRenderer :: begin rendering");r.write("<div ");r.writeControlData(c);r.addClass("sapCaUiPictureTile");r.writeClasses();r.write(">");r.write("<div");r.addClass("sapCaUiPictureTileContent");r.writeClasses();r.write(">");r.write("<div id='"+c.getId()+"-wrapper'>");r.renderControl(c._oDeletePictureButton);this._renderContent(r,c);r.write("</div>");r.write("</div></div>");};P._renderContent=function(r,t){r.renderControl(t.getContent());};return P;},true);
