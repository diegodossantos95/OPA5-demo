// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/ui/launchpad/AccessibilityCustomData'],function(A){"use strict";var c=function(){this.aTileWrapperClasses=['.sapUshellTile','.sapUshellLinkTile'];};c.prototype={keyCodes:jQuery.sap.KeyCodes,tileFocusCustomData:new A({key:"tabindex",value:"0",writeToDom:true}),handleCatalogKey:function(){this.oRouter.navTo("appFinder",{'menu':'catalog'});},handleHomepageKey:function(){this.oRouter.navTo("home");var m=sap.ui.getCore().byId("meAreaHeaderButton");if(m&&m.getSelected()){m.firePress();return;}var n=sap.ui.getCore().byId("NotificationsCountButton");if(n&&n.getSelected()){n.firePress();}},handleDoneEditMode:function(){var i=this.oModel.getProperty('/tileActionModeActive');if(i){var d=sap.ui.getCore().byId("sapUshellDashboardFooterDoneBtn");if(d){d.firePress();}}},getNumberOfTileInRow:function(p,i){var j=jQuery(i?".sapUshellLinkTile:first":".sapUshellTile:first");if(!j.length){return false;}var a;if(p==="catalog"){a=jQuery("#catalogTiles .sapUshellTileContainerContent").width();}else{a=jQuery("#dashboardGroups").width();}var n=Math.floor(a/j.outerWidth(true));return n;},goToTileContainer:function(k){var i=this.oModel.getProperty('/tileActionModeActive');if(i){C.goToFirstVisibleTileContainer();}else{C.goToLastVisitedTile();}return true;},goToLastVisitedTile:function(j,l){var a=jQuery('#dashboardGroups').find('.sapUshellTileContainer:visible'),t=this.oModel.getProperty("/topGroupInViewPortIndex");var b=j||jQuery(a.get(t));var d=b.find('.sapUshellTile:visible')["first"](),e,f;if(b&&l){e=b.find(".sapUshellTile:visible[tabindex='0']");f=b.find(".sapMGTLineMode:visible[tabindex='0']");}else{e=jQuery(".sapUshellTile:visible[tabindex='0']");f=jQuery(".sapMGTLineMode:visible[tabindex='0']");}if(!d.length&&!e.length&&!f.length){return false;}if(e.length){this.setTileFocus(e);return true;}if(f.length){this.setTileFocus(f);return true;}this.setTileFocus(d);return true;},goToFirstVisibleTileContainer:function(){var j=jQuery('#dashboardGroups').find('.sapUshellTileContainer:visible'),t=this.oModel.getProperty("/topGroupInViewPortIndex"),a=jQuery(j.get(t));if(!a[0]){return false;}this.setTileContainerSelectiveFocus(a);return true;},goToFirstTileOfSiblingGroup:function(s,e){e.preventDefault();var a=jQuery(document.activeElement).closest(".sapUshellDashboardGroupsContainerItem");if(!a.length)return;var t='first',n=a[s+"All"](".sapUshellDashboardGroupsContainerItem:has(.sapUshellTile:visible):not(.sapUshellCloneArea)");if(!n.length){n=a;t=(s==="next")?'last':'first';}else{n=n.first();}var j=n.find(".sapUshellTile:visible")[t]();this.moveScrollDashboard(j);return false;},animateTileMoveInGroup:function(g,f,s){var d=jQuery.Deferred();sap.ushell.Layout.initGroupDragMode(g);var t=g.getTiles().slice();var a=t.indexOf(f);var b=t.indexOf(s);t.splice(b,1,f);t.splice(a,1,s);var e=sap.ushell.Layout.organizeGroup(t);setTimeout(function(){sap.ushell.Layout.renderLayoutGroup(g,e);},0);setTimeout(function(){sap.ushell.Layout.endDragMode();d.resolve();},300);return d.promise();},_getTileMode:function(t){return t.getMode?t.getMode():'ContentMode';},_moveTileInGroup:function(g,f,s,d){var a=this._getTileMode(f),b=this._getTileMode(s),e=sap.ui.getCore().getEventBus();if(a===b){e.publish("launchpad","movetile",this._getTileMoveInfo({group:g,dstGroup:g,firstTile:f,secondTile:s}));}else{e.publish("launchpad","convertTile",this._getTileConvertInfo({group:g,firstTile:f,secondTile:s,direction:d}));}},_getDestinationTileIndex:function(m){var g=m.group.getBindingContext().getObject(),t,a=m.dstGroup?this._getGroupTiles(m.dstGroup,m.secondTile):this._getGroupTiles(m.group,m.secondTile),f=m.firstTile.getMode?m.firstTile.getMode():'ContentMode',s=m.secondTile.getMode?m.secondTile.getMode():'ContentMode',b=f!==s;if(b||m.dstGroup!==m.group){if(m.direction&&(m.direction==="left"||m.direction==="up")){t=a.length;}else if(m.direction){t=0;}}else{if(s==='LineMode'){t=m.secondTile.getBindingContext()?g.links.indexOf(m.secondTile.getBindingContext().getObject()):0;}else{t=m.secondTile.getBindingContext()?g.tiles.indexOf(m.secondTile.getBindingContext().getObject()):0;}}return t;},moveTileInGroup:function(g,f,s,d){var a=this._getTileMode(f),b=this._getTileMode(s);document.activeElement.blur();if(sap.ushell.Layout.isAnimationsEnabled()&&(a===b)){this.animateTileMoveInGroup(g,f,s,d).then(function(){this._moveTileInGroup(g,f,s,d);}.bind(this));}else{this._moveTileInGroup(g,f,s,d);}},animateMoveTileToDifferentGroup:function(s,d,a,b){var e=jQuery.Deferred();sap.ushell.Layout.initGroupDragMode(s);sap.ushell.Layout.initGroupDragMode(d);var f=s.getTiles().slice();var g=d.getTiles().slice();var t=f.indexOf(a);if(b==="left"||b==="up"){g.push(f.splice(t,1)[0]);}if(b==="right"||b==="down"){g.unshift(f.splice(t,1)[0]);}var h=sap.ushell.Layout.organizeGroup(f);var i=sap.ushell.Layout.organizeGroup(g);var j=sap.ushell.Layout.getTilePositionInMatrix(a,i);var k=d.getDomRef().querySelector(".sapUshellInner").getBoundingClientRect();var l=sap.ushell.Layout.calcTranslate(j.row,j.col);var m=k.left+l.x;var n=k.top+l.y;var o=jQuery("#dashboardGroups");var D=o.get(0).getBoundingClientRect();var p=a.getDomRef().getBoundingClientRect();var q=(-D.top)+p.top;var r=(-D.left)+p.left;var u=(-D.top)+n;var v=(-D.left)+m;o.css("position","relative");var w=a.$().clone().removeAttr("id data-sap-ui").css({"transform":"translate3d("+r+"px, "+q+"px, 0px)","list-style-type":"none","transition":"transform 0.3s cubic-bezier(0.46, 0, 0.44, 1)",position:"absolute",left:0,top:0});o.append(w);a.$().css("visibility","hidden");w.height();w.css("transform","translate3d("+v+"px, "+u+"px, 0px)");setTimeout(function(){sap.ushell.Layout.renderLayoutGroup(s,h);sap.ushell.Layout.renderLayoutGroup(d,i);});setTimeout(function(){sap.ushell.Layout.endDragMode();w.remove();o.removeAttr("style");e.resolve();},300);return e.promise();},_moveTileToDifferentGroup:function(s,d,a,n,b){var t=this._getTileMoveInfo({group:s,dstGroup:d,firstTile:a,secondTile:n,direction:b}),e=this._getTileConvertInfo({group:s,dstGroup:d,firstTile:a,secondTile:n,direction:b}),E=sap.ui.getCore().getEventBus(),f=a.getMode?a.getMode():"ContentMode",g=n.getMode?n.getMode():'ContentMode';if(f===g){E.publish("launchpad","movetile",t);}else{E.publish("launchpad","convertTile",e);}},moveTileToDifferentGroup:function(s,d,a,n,b){var f=this._getTileMode(a),e=this._getTileMode(n);document.activeElement.blur();if(sap.ushell.Layout.isAnimationsEnabled()&&(e===f)){this.animateMoveTileToDifferentGroup(s,d,a,n,b).then(function(){this._moveTileToDifferentGroup(s,d,a,n,b);}.bind(this));}else{this._moveTileToDifferentGroup(s,d,a,n,b);}},moveTile:function(d){var j=jQuery(".sapUshellDashboardView"),a=sap.ui.getCore().byId(j.attr("id")),p=sap.ushell.Container.getService("LaunchPage"),t,i;a.getModel().setProperty('/isInDrag',true);setTimeout(function(){a.getModel().setProperty('/isInDrag',false);},300);if(this.oModel.getProperty("/personalization")){var b=this.getGroupAndTilesInfo();if(!b||b.group.getProperty('isGroupLocked')){return;}t=b.curTile.getBindingContext().getObject().object;i=p.isLinkPersonalizationSupported(t);var m=true,I,n=this.getNextTile(d,b,I,m,!i);if(!n){return;}else{var e=n.getParent();}if(e===b.group){this.moveTileInGroup(b.group,b.curTile,n,d);}else{this.moveTileToDifferentGroup(b.group,e,b.curTile,n,d);}}},_getTileMoveInfo:function(m){var f=m.firstTile.getMode?m.firstTile.getMode():'ContentMode',s=this._getDestinationTileIndex(m),j=jQuery(".sapUshellDashboardView"),d=sap.ui.getCore().byId(j.attr("id")),a=d.getController(),t=a._getTileUuid(m.firstTile),g=m.dstGroup?this._getGroupTiles(m.dstGroup,m.secondTile):this._getGroupTiles(m.group,m.secondTile),G=m.dstGroup?m.dstGroup:m.group,T;T={sTileId:t,sToItems:f==='LineMode'?'links':'tiles',sFromItems:f==='LineMode'?'links':'tiles',sTileType:f==='LineMode'?'link':'tile',toGroupId:G.getGroupId?G.getGroupId():G.groupId,toIndex:s,callBack:function(o){setTimeout(function(){this.setTileFocus(jQuery(o.getDomRef()));}.bind(this),100);}.bind(this)};return T;},_getGroupTiles:function(g,t){var a=this._getTileMode(t);return a==='LineMode'?g.getLinks():g.getTiles();},_getTileConvertInfo:function(m){var d=m.dstGroup?m.dstGroup:m.group,s=this._getDestinationTileIndex(m),t={toGroupId:d.getGroupId?d.getGroupId():d.groupId,toIndex:s,tile:m.firstTile,srcGroupId:m.group.getGroupId?m.group.getGroupId():m.group.groupId,longDrop:false,callBack:function(T){setTimeout(function(){this.setTileFocus(jQuery(T.getDomRef()));}.bind(this),100);}.bind(this)};return t;},_findClosestTile:function(d,t,a){var j;if(a.getMode&&a.getMode()==="LineMode"&&(j=a.$().find(".sapMGTLineStyleHelper"))){if(j.length===1){var b=j.get(0).getBoundingClientRect();}else if(d==="down"){var b=j.get(j.length-1).getBoundingClientRect();}else if(d==="up"){var b=j.get(0).getBoundingClientRect();}}else{var b=(a instanceof HTMLElement)?a.getBoundingClientRect():a.getDomRef().getBoundingClientRect();}var e=b.right-((b.right-b.left)/2);if(a.getMode&&a.getMode()==="LineMode"){var m=a.$().height()>parseInt(a.$().css("line-height"),10);if(m){e=(d==="down")?b.right:b.left;}}var f=t.indexOf(a);var s=d==="down"?1:-1;var n,g,r;var h=Infinity;for(var i=f+s;!n;i+=s){var k=t[i];if(!k){break;}var l;if(k.getMode&&k.getMode()==="LineMode"&&(l=k.$().find(".sapMGTLineStyleHelper"))){if(l.length===1){var o=l.get(0).getBoundingClientRect();}else if(d==="down"){for(var i=0;i<l.length;i++){if(b.bottom<l.get(i).getBoundingClientRect().bottom){var o=l.get(i).getBoundingClientRect();break;}}}else if(d==="up"){for(var i=l.length-1;i>=0;i--){if(b.top>l.get(i).getBoundingClientRect().top){var o=l.get(i).getBoundingClientRect();break;}}}}else{var o=(k instanceof HTMLElement)?k.getBoundingClientRect():k.getDomRef().getBoundingClientRect();}if(d==="down"&&b.bottom>=o.bottom){continue;}if(d==="up"&&b.top<=o.top){continue;}if(g&&r!=o.top){n=g;break;}r=o.top;var p=Math.abs(o.left-e);var q=Math.abs(o.right-e);var u=p>q?q:p;if(h>u){h=u;g=k;r=o.top;}else{n=g;}}return n||g;},getNextUpDownTileWithScreenPosition:function(d,i,m,p){var g=!(p&&m)?i.tiles.concat(i.links):i.tiles;if(!g.length){g.push(i.group.oPlusTile)}var n=this.getNextGroup(d,i);if(n){var a=!(p&&m)?n.getTiles().concat(n.getLinks()):n.getTiles();if(!a.length){a.push(n.oPlusTile);}}a=a?a:[];var b=d==="down"?g.concat(a):a.concat(g);return this._findClosestTile(d,b,i.curTile);},getNextUpDownTileWithLayout:function(d,i,m){var n,a;var b=d==="down"?1:-1;var e=!i.tiles.length&&!i.links.length;var I=i.group.getIsGroupLocked();var f=jQuery(i.curTile.getDomRef()).hasClass('sapUshellPlusTile');var l=i.group.getLinks();var g=sap.ushell.Layout.organizeGroup(i.curTile.isLink?i.links:i.tiles,i.curTile.isLink);var t=sap.ushell.Layout.getTilePositionInMatrix(i.curTile,g);if(!t&&!e&&!f){return;}if(!g[t.row+b]){if(!i.curTile.isLink&&l.length&&d==='down'){if(!m){return l[0];}}if(i.curTile.isLink&&i.tiles.length&&d==='up'){return i.tiles[i.tiles.length-1];}t=e||f?{row:0,col:0}:t;a=this.getNextGroup(d,i);if(!a){return;}e=!a.getTiles().length&&!a.getLinks().length;if(!e){var F=this._getAggregationToFocusInNextGroup(a,d);var N=this._isNextTileLink(F);g=sap.ushell.Layout.organizeGroup(F,N);b=0;t.row=d==="down"?0:g.length-1;}}if(e&&I){return undefined;}if(e){return a.oPlusTile;}if(typeof g[t.row+b][t.col]==="object"&&!e){n=g[t.row+b][t.col];}else{n=this.getNextUpDownTile(g,t.row+b,t.col,d);}return n;},_isNextTileLink:function(t){if(t&&t.length){var j=jQuery(t[0].getDomRef());return j.hasClass("sapUshellLinkTile")||j.hasClass("sapMGTLineMode");}return false;},_getAggregationToFocusInNextGroup:function(n,d,m,p){var g=function(){if(n.getTiles().length){return n.getShowPlaceholder()?[].concat(n.getTiles(),n.oPlusTile):n.getTiles();}};var a=function(){if(n.getLinks().length){return!(p&&m)?n.getLinks():undefined;}};var i=sap.ui.getCore().getConfiguration().getRTL();if(i){if(d==="down"||d==="left"){return g()||a();}else if(d==="up"||d==="right"){return a()||g();}}else{if(d==="down"||d==="right"){return g()||a();}else if(d==="up"||d==="left"){return a()||g();}}},isLastLineFull:function(l){var m=this.getNumberOfTileInRow(),a=l[l.length-1].filter(Boolean);return a.length===m;},getNextUpDownTile:function(l,r,a,d){var n=r,b=l.length,e,f=d==="up"?-1:1;while((n>=0&&n<b)&&!e){if(typeof l[n][a]!=="object"){e=l[n][a];}n=n+f;}if(e){return;}n=r;while((typeof l[n][a]!=="object")&&a>=0){a--;}return l[n][a];},getNextTile:function(d,i,I,m,p){var n,a=sap.ui.getCore().getConfiguration().getRTL()?-1:1,b=d==="right"?1:-1;if(i.pageName==='catalog'){n=this.getNextTileInCatalog(i,d);}else{if(d==="left"||d==="right"){var e=i.curTileIndex+(a*b);var f=i.curTile.isLink?i.links:i.tiles;if(f[e]&&!(m&&f[e].getDomRef().className.indexOf("sapUshellPlusTile")>0)){n=f.length?f[e]:undefined;}if(n){return n;}if(a==1){if(d==="right"&&!i.curTile.isLink&&i.links.length&&!p){return i.links[0];}if(d==="left"&&i.curTile.isLink&&i.tiles.length){return i.group.getShowPlaceholder()?i.group.oPlusTile:i.tiles[i.tiles.length-1];}}else{if(d==="left"&&!i.curTile.isLink&&i.links.length&&!p){return i.links[0];}if(d==="right"&&i.curTile.isLink&&i.tiles.length){return i.group.getShowPlaceholder()?i.group.oPlusTile:i.tiles[i.tiles.length-1];}}var g=this.getNextGroup(d,i);if(!g){return;}else{var h=this._getAggregationToFocusInNextGroup(g,d,m,p);if(h&&h.length){var l=h.length-1;if(d==="right"){n=h[a===1?0:l];}else{n=h[a===1?l:0];}}else{n=g.oPlusTile;}}}if(d==="down"||d==="up"){n=this.getNextUpDownTileWithScreenPosition(d,i,m,p);}}return n;},getNextTileInCatalog:function(a,d){var n,b,e,s,t,l,w,f,o,g=sap.ui.getCore().getConfiguration().getRTL()?-1:1,h=!a.tiles.length,j=d==="right"?1:-1;if(d=='right'||d=='left'){n=!h?a.tiles[a.curTileIndex+(g*j)]:undefined;return n;}if(a.curTileIndex==='0'&&d==='up'){return undefined;}b=this.whichTileRow(a.curTileIndex,a);o=parseFloat(a.curTile.getDomRef().offsetLeft);if(d=="down"){e=a.tiles.slice(a.curTileIndex+1,a.curTileIndex+(a.sizeOfLine*2));}else{s=(s>0)?s:0;e=a.tiles.slice(s,a.curTileIndex).reverse();}for(var i=0,k=e.length;i<k;i++){t=e[i].getDomRef();l=parseFloat(t.offsetLeft);w=parseFloat(t.offsetWidth);f=l+w;if(l<=o&&f>=o){n=e[i];return n;}}if(this.nextRowIsShorter(d,b,a)){n=this.getNextTileInShorterRow(d,b,a);return n;}},getNextTileInShorterRow:function(d,a,i){var l=d==='down'?this.getLastTileIdInRow(i,a+1):this.getLastTileIdInRow(i,a-1);return i.tiles[l];},getLastTileIdInRow:function(a,l){var b=0;for(var i=0;i<a.rowsData.length;i++){b+=a.rowsData[i];if(i===l){break;}}return b-1;},nextRowIsShorter:function(d,a,i){if(d==='down'&&a!=i.rowsData.length-1){return i.rowsData[a]>i.rowsData[a+1];}if(d==='up'&&a!=0){return i.rowsData[a]>i.rowsData[a-1];}else{return false;}},getNextGroup:function(d,i){var n,g=i.group.getParent().getGroups(),a=sap.ui.getCore().getConfiguration().getRTL(),b=g.indexOf(i.group);if(d==="right"||d==="left"){if(a){d=(d==="right")?"up":"down";}else{d=(d==="right")?"down":"up";}}if(d==="down"||d==="up"){var e=d==="up"?-1:1;n=g[b+e];if(!n){return;}while(!n.getVisible()&&(b>=0&&b<g.length)){b=b+e;n=g[b];if(!n){return;}}}if(!n.getVisible()){return;}return n;},getGroupAndTilesInfo:function(j,p){if(!j){j=this.getFocusOnTile(jQuery(document.activeElement));}if(!j.length){return;}if(!j.hasClass("sapUshellTile")&&!j.hasClass("sapUshellLinkTile")){j=j.closest(".sapUshellTile, .sapUshellLinkTile");}var a=sap.ui.getCore().byId(j.attr('id'));var b=j.closest(".sapUshellTileContainer");var g=sap.ui.getCore().byId(b.attr('id'));var r;var t;var l;if(!g.getTiles){a=g;g=g.getParent();}a.isLink=j.hasClass('sapUshellLinkTile')||j.hasClass('sapMGTLineMode');if(g.getTiles){t=g.getTiles();l=g.getLinks();if(g.getShowPlaceholder()&&!a.isLink){t.push(g.oPlusTile);}}var s=this.getNumberOfTileInRow(p,a.isLink);return{pageName:p,curTile:a,curTileIndex:a.isLink?l.indexOf(a):t.indexOf(a),tiles:t,links:l,sizeOfLine:s,group:g,rowsData:r};},whichTileRow:function(a,b){var t=0,i;for(i=0;i<b.rowsData.length;i++){t+=b.rowsData[i];if(a<t){return i;}}},goToSiblingElementInTileContainer:function(d,j,p){var a=j.closest('.sapUshellTileContainer'),b,e,f;if(b=this.getFocusTileContainerBeforeContent(j)){if(d==='up'||d==="left"){this._goToNextTileContainer(b,d);}else{f=a.find('.sapUshellTileContainerHeader:first');this.setTabIndexOnTileContainerHeader(f);f.focus();}return;}if(b=this.getFocusTileContainerHeader(j)){if(d==='up'){this.setTabIndexOnTileContainerHeader(f);if(!this._goToTileContainerBeforeContent(a)){this._goToNextTileContainer(b,d);}}else if(d==="down"){e=a.find('.sapUshellTile:first');if(e.length){var t=jQuery(e);this.moveScrollDashboard(t);}else{this._goToNextTileContainer(b,d);}}else if(d==="left"){if(j.hasClass("sapUshellTileContainerHeader")){if(!this._goToTileContainerBeforeContent(a)){this._goToNextTileContainer(b,"left");}}else{f=j.closest(".sapUshellTileContainerHeader");f.focus();}}else if(d==="right"){var g=j.hasClass("sapMInputBaseInner");if(!g){e=a.find('.sapUshellTile:first');if(e.length){this.setTileFocus(e);}else{this._goToNextTileContainer(b,"down");}}}return;}if(b=this.getFocusOnTile(j)){this.goFromFocusedTile(d,b,p,true);return;}if(b=this.getFocusOnTileContainerAfterContent(j)){if(d==='up'||d==="left"){this._goToFirstTileInTileContainer(b);}else{this._goToNextTileContainer(b,d);}}},_goToNextTileContainer:function(j,d){var a=j.closest('.sapUshellTileContainer'),b=jQuery('.sapUshellTileContainer:visible'),n=(d==='down')?1:-1,e,f;e=jQuery(b[b.index(a)+n]);if(e){f=e.find('.sapUshellTileContainerHeader');if(d==='down'){if(!this._goToTileContainerBeforeContent(e)){this.setTabIndexOnTileContainerHeader(f);this.setTileContainerSelectiveFocus(e);}}else{if(this._goToTileContainerAfterContent(e)){return;}if(d==='up'){if(!this._goToFirstTileInTileContainer(e)){this.setTabIndexOnTileContainerHeader(f);f.focus();}}else if(d==='left'){if(!this._goToLastTileInTileContainer(e)){this.setTabIndexOnTileContainerHeader(f);f.focus();}}}}},_goToLastTileInTileContainer:function(j){var a=j.hasClass('sapUshellTileContainer')?j:j.closest('.sapUshellTileContainer'),b=a.find('.sapUshellTile:last'),d=a.find('.sapUshellLinkTile:last');if(!d.length&&!b.length){return false;}this.setTileFocus(d.length?d:b);return true;},_goToFirstTileInTileContainer:function(j){var a=j.hasClass('sapUshellTileContainer')?j:j.closest('.sapUshellTileContainer'),b=jQuery(a.find('.sapUshellTile').get(0));if(b.length){this.setTileFocus(b);return true;}else{return false;}},_goToTileContainerBeforeContent:function(j){var a=j.hasClass('sapUshellTileContainer')?j:j.closest('.sapUshellTileContainer'),b=a.find('.sapUshellTileContainerBeforeContent button:visible');if(b.length){b.focus();return true;}else{return false;}},_goToTileContainerAfterContent:function(j){var a=j.hasClass('sapUshellTileContainer')?j:j.closest('.sapUshellTileContainer'),b=a.find('.sapUshellTileContainerAfterContent button:visible');if(b.length){b.focus();return true;}else{return false;}},goFromFocusedTile:function(d,j,p,i){var a=this.getGroupAndTilesInfo(j,p),n,b,e,f,g,I;if(!a){return;}n=this.getNextTile(d,a,i);if(i){b=jQuery(j).closest('.sapUshellTileContainer');if(!n){if(d==='down'||d==='right'){g=jQuery(b).find('.sapUshellTileContainerAfterContent button:visible');g.focus();return;}if(d==='up'){this.setTabIndexOnTileContainerHeader(b.find('.sapUshellTileContainerHeader'));this.setTileContainerSelectiveFocus(b);return;}if(d==='left'){f=b.find('.sapUshellTileContainerHeader');f.focus();}}else{e=jQuery(n.getDomRef()).closest('.sapUshellTileContainer');I=b.length&&e.length&&(b.attr('id')===e.attr('id'));if(I){var t=jQuery(n.getDomRef());this.moveScrollDashboard(t);}else{if(d==='down'||d==='right'){if(!this._goToTileContainerAfterContent(b)){this.setTabIndexOnTileContainerHeader(e.find('.sapUshellTileContainerHeader'));this.setTileContainerSelectiveFocus(e);}}else if(d==='up'||'left'){f=b.find('.sapUshellTileContainerHeader');this.setTabIndexOnTileContainerHeader(f);f.focus();}}}}else if(n){var t=jQuery(n.getDomRef());this.moveScrollDashboard(t);}},deleteTile:function(j){var t=j.attr("id");if(!t){return;}var T=sap.ui.getCore().byId(t);var a=this.getGroupAndTilesInfo(j);var n=this.getNextTile("right",a);if(!n||(n&&n.getParent()!=a.group)){n=this.getNextTile("left",a);}if(!n||(n&&n.getParent()!=a.group)){n=a.group.oPlusTile;}if(n){if(!a.curTile.isLink){this.setTileFocus(jQuery(n.getDomRef()));}setTimeout(function(g,b){var d=g.getTiles();if(!d.length){if(a.links.length&&a.curTile.isLink){n=this.getNextTile("right",a);if(!n||(n&&n.getParent()!=a.group)){n=a.curTile;}this.setTileFocus(jQuery(n.getDomRef()));return;}if(a.group.getProperty('defaultGroup')){var f=this.getNextGroup("right",a);n=f.getTiles()[0]||f.oPlusTile;this.setTileFocus(jQuery(n.getDomRef()));}this.setTileFocus(jQuery(g.oPlusTile.getDomRef()));return;}var n;for(var i=0;i<d.length;i++){if(d[i].getProperty('uuid')==b){n=d[i];break;}}if(n){this.setTileFocus(jQuery(n.getDomRef()));}}.bind(this,a.group,n.getProperty('uuid')),100);}var e=sap.ui.getCore().getEventBus();e.publish("launchpad","deleteTile",{tileId:T.getUuid()});},setTabIndexOnTileContainerHeader:function(j){jQuery(".sapUshellTileContainerHeader").attr("tabindex",-1);jQuery(".sapUshellTileContainerHeader .sapUshellContainerTitle").attr("tabindex",-1);jQuery(".sapUshellTileContainerHeader .sapUshellContainerHeaderActions button").attr("tabindex",-1);if(j){var a=j.find('.sapUshellContainerTitle:first'),b=j.find('.sapUshellContainerHeaderActions:first');j.attr('tabindex',0);a.attr('tabindex',0);b.find('button').attr('tabindex',0);}},setTileContainerSelectiveFocus:function(j){var a=j.find('.sapUshellTileContainerBeforeContent button'),b=j.find('.sapUshellTileContainerHeader:first'),B=a.length&&a.is(":visible");if(B){a.focus();}else if(b.length){this.setTabIndexOnTileContainerHeader(b);b.focus();}},setTileFocus:function(j){if(!j.hasClass('sapUshellPlusTile')){var n=sap.ui.getCore().byId('navContainerFlp'),o=n.getCurrentPage(),a=n?n.getCurrentPage().getViewName():undefined,b;var i=!!((a==="sap.ushell.components.flp.launchpad.appfinder.AppFinder")&&(o.getController().getCurrentMenuName()==="catalog"));b=j.find('[tabindex]');if(i){var h=C;h.setFocusOnCatalogTile(b.eq(0));}}jQuery(".sapUshellTile").attr("tabindex",-1);jQuery(".sapMGTLineMode").attr("tabindex",-1);jQuery(".sapUshellLinkTile").attr("tabindex",-1);j.attr("tabindex",0);var d=jQuery("#Fiori2LoadingDialog")[0];if(!d||d.style.visibility==="hidden"){if(j.prop("tagName")==="DIV"&&jQuery(j).hasClass("sapUshellLinkTile")&&j.getMode==undefined){j=j.find("a").length?j.find("a")[0]:j;}j.focus();var t;if(j[0]&&j[0].id){var t=sap.ui.getCore().byId(j[0].id);var e=this.tileFocusCustomData.getParent&&this.tileFocusCustomData.getParent();if(e){e.removeAggregation("customData",this.tileFocusCustomData,true);}if(t&&sap.ui.getCore().byId(t.getId())&&this.tileFocusCustomData&&sap.ui.getCore().byId(this.tileFocusCustomData.getId())){t.addAggregation("customData",this.tileFocusCustomData,true);}}}},setFocusOnCatalogTile:function(j){var p=jQuery(".sapUshellTile[tabindex=0]"),a,v;if(p.length){jQuery(".sapUshellTileContainerContent").find('[tabindex*=0]').attr("tabindex",-1);a=p.find('[tabindex], a').andSelf().filter('[tabindex], a');a.attr("tabindex",-1);}if(!j){v=jQuery(".sapUshellTile:visible,.sapUshellAppBox:visible");if(v.length){j=jQuery(v[0]);}else{return;}}j.attr("tabindex",0);j.find("button").attr("tabindex",0);j.focus();},moveScrollDashboard:function(j){var a=j.closest(".sapUshellTileContainer")[0].id,y=-1*(document.getElementById('dashboardGroups').getBoundingClientRect().top)+document.getElementById(a).getBoundingClientRect().top;y+=49;jQuery('#sapUshellDashboardPage section').stop().animate({scrollTop:y},0,function(){this.setTileFocus(j);}.bind(this));},moveGroupFromDashboard:function(d,j){var a,t=jQuery(".sapUshellDashboardGroupsContainerItem"),i,b;a=j.closest(".sapUshellDashboardGroupsContainerItem");i=t.index(a);b=d=="up"||d=="left"?i-1:i+1;this.moveGroup(i,b);},moveGroup:function(f,t){var g=jQuery(".sapUshellDashboardGroupsContainerItem"),n=jQuery(".sapUshellDisableDragAndDrop").length;if(t<0||t>=g.length||t<n){return;}var a=sap.ui.getCore();var d={fromIndex:f,toIndex:t};var b=a.getEventBus();b.publish("launchpad","moveGroup",d);setTimeout(function(){var e=jQuery(".sapUshellTileContainerHeader")[t];this.setTabIndexOnTileContainerHeader(jQuery(e));jQuery(e).focus();}.bind(this),100);},getFocusGroupFromDashboard:function(j){var i=j.closest('.sapUshellTileContainerHeader').length&&j[0].tagName==='H2';return i?j:false;},getFocusTileContainerBeforeContent:function(j){var a=j.closest('.sapUshellTileContainerBeforeContent');return a.length?a:false;},getFocusTileContainerHeader:function(j){var a=j.closest('.sapUshellTileContainerHeader');return a.length?a:false;},getFocusOnTileContainerAfterContent:function(j){var a=j.closest('.sapUshellTileContainerAfterContent');return a.length?a:false;},getFocusOnTile:function(j){var a;jQuery.each(this.aTileWrapperClasses,function(i,t){var b=j.closest(t);a=b.length?b:false;return!(a);});return a;},renameGroup:function(){var j=jQuery(document.activeElement);var a=this.getFocusGroupFromDashboard(j);if(a){a.click();}},arrowsButtonsHandler:function(d,e){var j=jQuery(document.activeElement),i=this.oModel.getProperty('/tileActionModeActive');if(j.hasClass("sapUshellAnchorItem")){e.preventDefault();this.handleAnchorNavigationItemsArrowKeys(d);}else{if(i){if(!j.hasClass('sapMInputBaseInner')){e.preventDefault();this.goToSiblingElementInTileContainer(d,j);}}else{e.preventDefault();this.goFromFocusedTile(d,j);}}},_preventBrowserDefaultScrollingBehavior:function(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();},handleAnchorNavigationItemsArrowKeys:function(d){var a=jQuery(".sapUshellAnchorItem:visible"),j=jQuery(document.activeElement),i=a.index(j),n=j,I=sap.ui.getCore().getConfiguration().getRTL();if(I){d=d==='left'?'right':'left';}if(d==="left"||d==="up"){if(i>0){n=a.get(i-1);}}else if(d==="right"||d==="down"){if(i<a.length-1){n=a.get(i+1);}}this.setAnchorItemFocus(jQuery(n));},setAnchorItemFocus:function(j){jQuery(".sapUshellAnchorItem").attr("tabindex",-1);j.attr("tabindex",0);j.focus();},appFinderHomeEndButtonsHandler:function(d,k){k.preventDefault();var v=jQuery(".sapUshellTile:visible,.sapUshellAppBox:visible"),j=jQuery(document.activeElement),a;if(v.length){if(d==="home"){a=jQuery(v.get(0));}if(d==="end"){a=jQuery(v.get(v.length-1));}}if(a){this.appFinderFocusAppBox(j,a);}},appFinderPageUpDownButtonsHandler:function(d,k){k.preventDefault();var j=jQuery(document.activeElement);var a=jQuery(j.parents()[2]);var n=this.getNextCatalog(d,a);if(n){var b=n.find("li"),f=jQuery(b.get(0));}if(f.length){this.appFinderFocusAppBox(j,f);}else if(d==="down"){var e=a.find("li"),l=jQuery(e.get(e.length-1));this.appFinderFocusAppBox(j,l);}},homeEndButtonsHandler:function(s,e){var j=jQuery(document.activeElement),t;if(j.hasClass("sapUshellAnchorItem")){e.preventDefault();this.setAnchorItemFocus(jQuery(".sapUshellAnchorItem:visible:"+s));return;}if(j.hasClass("sapUshellTile")&&j.closest("#dashboardGroups").length){e.preventDefault();if(e.ctrlKey===true){t=jQuery(".sapUshellTile:visible:not('.sapUshellPlusTile')")[s]();}else{t=j.parent().find(".sapUshellTile:visible:not('.sapUshellPlusTile')")[s]();}this.setTileFocus(t);return;}},deleteButtonHandler:function(){if(this.oModel.getProperty("/personalization")&&this.oModel.getProperty("/tileActionModeActive")){var j,a=jQuery(document.activeElement);if(j=this.getFocusOnTile(a)){if(!j.hasClass('sapUshellLockedTile')&&!j.hasClass('sapUshellPlusTile')){this.deleteTile(j);}return;}}},ctrlPlusArrowKeyButtonsHandler:function(d){var j,a=jQuery(document.activeElement);if((j=this.getFocusOnTile(a))){this.moveTile(d);return;}if(j=this.getFocusTileContainerHeader(a)){var b=j.closest('.sapUshellTileContainerContent');if(b.hasClass('sapUshellTileContainerDefault')||b.hasClass('sapUshellTileContainerLocked')){return;}else{this.moveGroupFromDashboard(d,j);}}},spaceButtonHandler:function(e){var j=jQuery(document.activeElement);if(j.hasClass("sapUshellTile")){e.preventDefault();var g=j.find('[role="button"]');if(g){var a=g.attr("id");var b=sap.ui.getCore().byId(a),i=this.oModel.getProperty('/tileActionModeActive');if(b&&!i){b.firePress();return false;}}j.click();return false;}},goToFirstAnchorNavigationItem:function(){this.setAnchorItemFocus(jQuery(".sapUshellAnchorItem:visible:first"));},goToSelectedAnchorNavigationItem:function(){this.setAnchorItemFocus(jQuery(".sapUshellAnchorItemSelected"));return jQuery(document.activeElement).hasClass("sapUshellAnchorItemSelected");},handleFocusOnMe:function(k,f){var h=C,n=sap.ui.getCore().byId('navContainerFlp'),o=n.getCurrentPage(),a=o.getViewName();if(a=="sap.ushell.components.flp.launchpad.dashboard.DashboardContent"){if(f){if(k.shiftKey){var b=jQuery("#sapUshellDashboardFooterDoneBtn:visible");if(b.length){b.focus();}else{h.goToTileContainer(k);}}else{if(!h.goToSelectedAnchorNavigationItem()){C.goToLastVisitedTile()}}}else{h.mainKeydownHandler(k);h.dashboardKeydownHandler(k);}}if(a=="sap.ushell.components.flp.launchpad.appfinder.AppFinder"){if(f){if(!k.shiftKey){var d=sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");if(d&&d.getVisible()){d.focus();}else{h.appFinderFocusMenuButtons(k);}}else{h.setFocusOnCatalogTile();}}else{h.mainKeydownHandler(k);h.appFinderKeydownHandler(k);}}},groupHeaderNavigation:function(){var j=jQuery(document.activeElement),a;if(j.hasClass("sapUshellTileContainerHeader")){a=j.find(".sapUshellContainerTitle");a.focus();}else if(a=j.closest(".sapUshellTileContainerHeader")){a.focus();}},handleShortcuts:function(e){var h=C;if(e.altKey){switch(String.fromCharCode(e.keyCode)){case'A':if(h.oModel.getProperty("/personalization")){h.handleCatalogKey();}break;case'H':h.handleHomepageKey();break;}}if(e.ctrlKey&&e.keyCode===13){h.handleDoneEditMode();}},mainKeydownHandler:function(e){e=e||window.event;switch(e.keyCode){case this.keyCodes.SPACE:this.spaceButtonHandler(e);break;case this.keyCodes.HOME:this.homeEndButtonsHandler("first",e);break;case this.keyCodes.END:this.homeEndButtonsHandler("last",e);break;}},appFinderKeydownHandler:function(k){var h=C;if(k.srcElement.id!="appFinderSearch-I"){switch(k.keyCode){case h.keyCodes.ARROW_UP:h.appFinderUpDownHandler("up",k);break;case h.keyCodes.ARROW_DOWN:h.appFinderUpDownHandler("down",k);break;case h.keyCodes.ARROW_RIGHT:h.appFinderRightLeftHandler("right",k);break;case h.keyCodes.ARROW_LEFT:h.appFinderRightLeftHandler("left",k);break;case h.keyCodes.PAGE_UP:h.appFinderPageUpDownButtonsHandler('up',k);break;case h.keyCodes.PAGE_DOWN:h.appFinderPageUpDownButtonsHandler('down',k);break;case h.keyCodes.HOME:h.appFinderHomeEndButtonsHandler("home",k);break;case h.keyCodes.END:h.appFinderHomeEndButtonsHandler("end",k);break;}}},appFinderFocusAppBox:function(j,a){j.attr("tabindex","-1").find(".sapUshellPinButton").attr("tabindex","-1");a.find(".sapUshellPinButton").attr("tabindex","0");a.attr("tabindex","0").focus();},appFinderFocusMenuButtons:function(k){var b=jQuery("#catalog, #userMenu, #sapMenu").filter("[tabindex=0]");if(b.length){b.eq(0).focus();k.preventDefault();return true;}else{return false;}},appFinderUpDownHandler:function(d,k){k.preventDefault();var j=jQuery(document.activeElement);if(!j.is(".sapUshellAppBox, .sapUshellTile")){return;}var a=jQuery(j.parents()[2]);var b=a.find("li.sapUshellAppBox, li.sapUshellTile"),e=jQuery.makeArray(b),n=[];var f=this.getNextCatalog(d,a);if(f){var g=f.find("li.sapUshellAppBox, li.sapUshellTile"),n=jQuery.makeArray(g);}var h=d==="down"?e.concat(n):n.concat(e);var i=jQuery(this._findClosestTile(d,h,j.get(0)));this.appFinderFocusAppBox(j,i);},getNextCatalog:function(d,a){var n;if(d==="down"){n=a.next();}if(d==="up"){n=a.prev();}if(!n){return;}return n;},appFinderRightLeftHandler:function(d,k){k.preventDefault();var j=jQuery(document.activeElement);if(!j.is(".sapUshellAppBox, .sapUshellTile")){return;}var a=jQuery(j.parents()[2]);var b=a.find("li.sapUshellAppBox, li.sapUshellTile");var i=b.index(j);var e=d==="right"?i+1:i-1,f;if(e>=0&&e<b.length){f=jQuery(b[e]);}else if(e<0){var n=this.getNextCatalog("up",a);if(n){var g=n.find("li.sapUshellAppBox, li.sapUshellTile");if(g.length){f=jQuery(g.get(g.length-1));}else{return;}}}else if(e===b.length){var n=this.getNextCatalog("down",a);if(n){var g=n.find("li");if(g.length){f=jQuery(g.get(0));}else{return;}}}this.appFinderFocusAppBox(j,f);},dashboardKeydownHandler:function(k){var h=C;switch(k.keyCode){case h.keyCodes.F2:h.renameGroup();break;case h.keyCodes.F7:h.groupHeaderNavigation();break;case h.keyCodes.DELETE:h.deleteButtonHandler();break;case h.keyCodes.BACKSPACE:h.deleteButtonHandler();break;case h.keyCodes.ARROW_UP:if(k.ctrlKey===true){h._preventBrowserDefaultScrollingBehavior(k);h.ctrlPlusArrowKeyButtonsHandler("up");}else{h.arrowsButtonsHandler("up",k);}break;case h.keyCodes.ARROW_DOWN:if(k.ctrlKey===true){h._preventBrowserDefaultScrollingBehavior(k);h.ctrlPlusArrowKeyButtonsHandler("down");}else{h.arrowsButtonsHandler("down",k);}break;case h.keyCodes.ARROW_RIGHT:if(k.ctrlKey===true){h.ctrlPlusArrowKeyButtonsHandler("right");}else{h.arrowsButtonsHandler("right",k);}break;case h.keyCodes.ARROW_LEFT:if(k.ctrlKey===true){h.ctrlPlusArrowKeyButtonsHandler("left");}else{h.arrowsButtonsHandler("left",k);}break;case h.keyCodes.PAGE_UP:h.goToFirstTileOfSiblingGroup("prev",k);break;case h.keyCodes.PAGE_DOWN:h.goToFirstTileOfSiblingGroup("next",k);break;}return true;},init:function(m,r){this.oModel=m;this.oRouter=r;}};var C=new c();return C},true);