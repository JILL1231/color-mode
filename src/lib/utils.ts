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

const getDressed = (type: string, value: any) => {
  let result: string = '';
  switch (type) {
    case 'rgb':
    case 'hsb':
    case 'hsv':
    case 'hsl':
    case 'yuv':
      result = `${type}(${value})`;
      break;
    case 'kelvin':
      result = `${value}k`;
      break;
    default:
      result = value;
      break;
  }
  return result;
};

export { getSelections, getDressed };