/*
* ! SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2017 SAP SE. All rights reserved
*/
sap.ui.define(function(){var P=function(){this._aPendingRequests=[];};P.prototype.contains=function(r){for(var i=0;i<this._aPendingRequests.length;++i){if(this._aPendingRequests[i]===r){return true;}return false;}};P.prototype.add=function(r){if(this.contains(r)){return false;}else{this._aPendingRequests.push(r);return true;}};P.prototype.remove=function(r){for(var i=0;i<this._aPendingRequests.length;++i){if(this._aPendingRequests[i]===r){this._aPendingRequests.splice(i,1);return true;}}return false;};P.prototype.abortAll=function(){var r;while((r=this._aPendingRequests.pop())!==undefined){r.abort();}};return P;},true);
