
function init(){SXE.initElementDialog('ins');if(SXE.currentAction=="update"){setFormValue('datetime',tinyMCEPopup.editor.dom.getAttrib(SXE.updateElement,'datetime'));setFormValue('cite',tinyMCEPopup.editor.dom.getAttrib(SXE.updateElement,'cite'));SXE.showRemoveButton();}}
function setElementAttribs(e){setAllCommonAttribs(e);setAttrib(e,'datetime');setAttrib(e,'cite');e.removeAttribute('data-mce-new');}
function insertIns(){var e=tinyMCEPopup.editor.dom.getParent(SXE.focusElement,'INS');if(e==null){var s=SXE.inst.selection.getContent();if(s.length>0){insertInlineElement('ins');var a=SXE.inst.dom.select('ins[data-mce-new]');for(var i=0;i<a.length;i++){var e=a[i];setElementAttribs(e);}}}else{setElementAttribs(e);}tinyMCEPopup.editor.nodeChanged();tinyMCEPopup.execCommand('mceEndUndoLevel');tinyMCEPopup.close();}
function removeIns(){SXE.removeElement('ins');tinyMCEPopup.close();}
tinyMCEPopup.onInit.add(init);
