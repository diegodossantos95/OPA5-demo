
function init(){SXE.initElementDialog('del');if(SXE.currentAction=="update"){setFormValue('datetime',tinyMCEPopup.editor.dom.getAttrib(SXE.updateElement,'datetime'));setFormValue('cite',tinyMCEPopup.editor.dom.getAttrib(SXE.updateElement,'cite'));SXE.showRemoveButton();}}
function setElementAttribs(e){setAllCommonAttribs(e);setAttrib(e,'datetime');setAttrib(e,'cite');e.removeAttribute('data-mce-new');}
function insertDel(){var e=tinyMCEPopup.editor.dom.getParent(SXE.focusElement,'DEL');if(e==null){var s=SXE.inst.selection.getContent();if(s.length>0){insertInlineElement('del');var a=SXE.inst.dom.select('del[data-mce-new]');for(var i=0;i<a.length;i++){var e=a[i];setElementAttribs(e);}}}else{setElementAttribs(e);}tinyMCEPopup.editor.nodeChanged();tinyMCEPopup.execCommand('mceEndUndoLevel');tinyMCEPopup.close();}
function removeDel(){SXE.removeElement('del');tinyMCEPopup.close();}
tinyMCEPopup.onInit.add(init);
