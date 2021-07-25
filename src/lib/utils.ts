import * as vscode from 'vscode';


// 判断是否打开编辑器，返回编辑器窗口选中的部分区域
const getSelections = (): vscode.Selection[] | null => {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null; // No open text editor
  }
  let selections = editor.selections;
  return selections;
};


export { getSelections,isColor };