import * as vscode from 'vscode';
import colorLib from './color';

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

const onChangeColorMode = (toType: string) => {
  let editor = vscode.window.activeTextEditor;
  let selections = getSelections();
  // 通过选中色值进行转换
  if (selections?.length) {
    let selectText = editor?.document.getText(selections[0]) || '';
    let isColorType = colorLib.isColorType(selectText);
    // 选中的文本符合色值的规则
    if (isColorType && (isColorType !== toType)) {
      const initArgs = colorLib.color.decode(selectText);
      // @ts-ignore
      const colorFormat = colorLib.color[`${isColorType}2${toType}`](initArgs);
      const result = selectText.replace(selectText, getDressed(toType, colorFormat));
      // 编辑
      editor?.edit((editBuilder: any) => {
        // 单选或多选
        editor?.selections.forEach((sel: any) => {
          const range = sel.isEmpty
            ? editor?.document.getWordRangeAtPosition(sel.start) || sel
            : sel;
          const result = selectText.replace(selectText, getDressed(toType, colorFormat));
          editBuilder.replace(range, result);
        });
      });
    }
  }
};
export { onChangeColorMode };