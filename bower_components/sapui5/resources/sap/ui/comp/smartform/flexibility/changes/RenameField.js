/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/fl/changeHandler/BaseRename',"sap/ui/fl/Utils"],function(q,B,U){"use strict";var P="label";var C="fieldLabel";var T="XFLD";var R=B.createRenameChangeHandler({changePropertyName:C,translationTextType:T});R.applyChange=function(c,o,p){var m=p.modifier;var a=c.getDefinition();var t=a.texts[C];var v=t.value;if(a.texts&&t&&typeof(v)==="string"){var l=m.getProperty(o,"label");if(U.isBinding(v)){if(l&&(typeof l!=="string")){m.setPropertyBinding(l,"text",v);}else{m.setPropertyBinding(o,P,v);}}else{if(l&&(typeof l!=="string")){m.setProperty(l,"text",v);}else{m.setProperty(o,P,v);}}return true;}else{U.log.error("Change does not contain sufficient information to be applied: ["+a.layer+"]"+a.namespace+"/"+a.fileName+"."+a.fileType);}};return R;},true);
