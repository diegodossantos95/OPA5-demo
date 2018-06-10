/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/ManagedObject"],function(q,M){"use strict";var C=M.extend("sap.ui.vk.ContentManager",{metadata:{library:"sap.ui.vk",events:{contentChangesStarted:{parameters:{}},contentChangesFinished:{parameters:{content:{type:"any"},failureReason:{type:"object"}}},contentChangesProgress:{parameters:{phase:{type:"string"},percentage:{type:"float"},source:{type:"any"}}}}}});C.prototype.destroyContent=function(c){return this;};C.prototype.collectGarbage=function(){return this;};return C;});
