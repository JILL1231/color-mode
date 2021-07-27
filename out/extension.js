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
    });
    context.subscriptions.push(colorCommand);
    // 右键更新选中颜色
    ['hex', 'yuv', 'rgb', 'hsb', 'hsv', 'hsl', 'kelvin'].forEach((mode) => {
        const colorMode = vscode.commands.registerCommand(`color-conv.${mode}`, () => {
            lib_1.onChangeColorMode(mode);
        });
        context.subscriptions.push(colorMode);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map