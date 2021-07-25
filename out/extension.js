"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const lib_1 = require("./lib");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // 注册颜色
    let colorCommand = vscode.commands.registerCommand('color-conv.color', () => {
        let editor = vscode.window.activeTextEditor;
        let selections = lib_1.getSelections();
        // 通过选中色值进行转换
        if (selections === null || selections === void 0 ? void 0 : selections.length) {
            let selectText = (editor === null || editor === void 0 ? void 0 : editor.document.getText(selections[0])) || '';
            let isColorType = lib_1.colorLib.isColorType(selectText);
            // 选中的文本符合色值的规则
            if (isColorType) {
                vscode.window.showQuickPick([
                    'HEX',
                    'RGB',
                    'HSB',
                    'HSV',
                    'HSL',
                    'YUV',
                    'KELVIN',
                ], { placeHolder: '选择色彩模式' }).then((res) => {
                    editor === null || editor === void 0 ? void 0 : editor.edit((editBuilder) => {
                        editor === null || editor === void 0 ? void 0 : editor.selections.forEach((sel) => {
                            const range = sel.isEmpty
                                ? (editor === null || editor === void 0 ? void 0 : editor.document.getWordRangeAtPosition(sel.start)) || sel
                                : sel;
                            const toType = res === null || res === void 0 ? void 0 : res.toLowerCase();
                            // 更换前后的色彩模式一致，则返回
                            if (isColorType === toType) {
                                return;
                            }
                            const initArgs = lib_1.colorLib.color.decode(selectText);
                            console.log("🚀 ~ file: extension.ts ~ line 41 ~ editor?.selections.forEach ~ initArgs", initArgs);
                            // @ts-ignore
                            const colorFormat = lib_1.colorLib.color[`${isColorType}2${toType}`](initArgs);
                            const result = selectText.replace(selectText, `${toType}(${colorFormat})`);
                            editBuilder.replace(range, result);
                        });
                    });
                });
            }
        }
    });
    context.subscriptions.push(colorCommand);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map