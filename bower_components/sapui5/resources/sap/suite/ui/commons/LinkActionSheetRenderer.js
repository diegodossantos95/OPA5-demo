/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','sap/m/ActionSheetRenderer','sap/ui/core/Renderer','sap/m/Dialog'],function(q,A,R,D){"use strict";var L=R.extend(A);L.render=function(r,c){var a=c.getItems(),i,m=false;for(i=0;i<a.length;i++){if(a[i].getIcon&&a[i].getIcon()){m=true;break;}}r.write("<div");r.writeControlData(c);r.addClass("sapMActionSheet");r.addClass("sapUILinkActionSheet");if(m){r.addClass("sapMActionSheetMixedButtons");}r.writeClasses();var t=c.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t);}r.write(">");for(i=0;i<a.length;i++){if(a[i].getType){var b=a[i];b.addStyleClass("sapMActionSheetButton");b.addStyleClass("sapUILinkActionSheetButton");r.renderControl(b);}else if(a[i].getHref){r.renderControl(a[i].addStyleClass("sapUILinkActionSheetLink"));}}if((q.device.is.iphone||(D._bOneDesign&&q.device.is.phone))&&c.getShowCancelButton()){r.renderControl(c._getCancelButton());}r.write("</div>");};return L;},true);
