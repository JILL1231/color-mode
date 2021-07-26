"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDressed = exports.getSelections = void 0;
const vscode = require("vscode");
// 判断是否打开编辑器，返回编辑器窗口选中的部分区域
const getSelections = () => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return null; // No open text editor
    }
    let selections = editor.selections;
    return selections;
};
exports.getSelections = getSelections;
const getDressed = (type, value) => {
    let result = '';
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
exports.getDressed = getDressed;
//# sourceMappingURL=utils.js.map