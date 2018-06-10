/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var S={};S.render=function(r,c){var i=c.getId();var v=c.getOrientation()===sap.ui.core.Orientation.Vertical;r.write("<div");r.writeControlData(c);r.addClass("sapUshellSpltCont");r.addClass("sapUshellSpltCont"+(v?"V":"H"));if(sap.ui.getCore().getConfiguration().getAnimation()){r.addClass("sapUshellSpltContAnim");}if(!c.getShowSecondaryContent()){r.addClass("sapUshellSpltContPaneHidden");}r.writeClasses();r.write(">");var s=i+"-pane";var w=c.getShowSecondaryContent()?c.getSecondaryContentSize():"0";r.write("<aside id='",s,"' style='width:",w,"'");r.addClass("sapUshellSpltContPane");if(!c.getShowSecondaryContent()){r.addClass("sapUshellSplitContSecondClosed");}r.writeClasses();r.write(">");this.renderSecondaryContent(r,s,c.getSecondaryContent());r.write("</aside>");var C=i+"-canvas";r.write("<section id='",C,"' class='sapUshellSpltContCanvas'>");var o=c.getAggregation('subHeader');this.renderRootContent(r,C,c.getContent(),o);r.write("</section>");r.write("</div>");};S.renderRootContent=function(r,i,c,s){r.write("<div id='",i,"cntnt' class='sapUshellSpltContCntnt'");r.writeAttribute("data-sap-ui-root-content","true");r.write(">");r.write("<div id='",i,"subHeader'>");if(s&&s.length){r.renderControl(s[0]);}r.write("</div>");if(c&&c.length){r.write("<div id='",i,"rootContent' class='sapUshellSpltContainerContentWrapper'>");c.forEach(function(C,a){r.renderControl(C);});r.write("</div>");}r.write("</div>");};S.renderSecondaryContent=function(r,I,c){r.write("<div id='",I,"cntnt' class='sapUshellSpltContCntnt'");r.writeAttribute("data-sap-ui-root-content","true");r.write(">");for(var i=0;i<c.length;i++){r.renderControl(c[i]);}r.write("</div>");};return S;},true);
