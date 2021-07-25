"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isColor = exports.getSelections = void 0;
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
//# sourceMappingURL=utils.js.map