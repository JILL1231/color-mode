"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onChangeColorMode = void 0;
const vscode = require("vscode");
const color_1 = require("./color");
// 判断是否打开编辑器，返回编辑器窗口选中的部分区域
const getSelections = () => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return null; // No open text editor
    }
    let selections = editor.selections;
    return selections;
};
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
const onChangeColorMode = (toType) => {
    let editor = vscode.window.activeTextEditor;
    let selections = getSelections();
    // 通过选中色值进行转换
    if (selections === null || selections === void 0 ? void 0 : selections.length) {
        let selectText = (editor === null || editor === void 0 ? void 0 : editor.document.getText(selections[0])) || '';
        let isColorType = color_1.default.isColorType(selectText);
        // 选中的文本符合色值的规则
        if (isColorType && (isColorType !== toType)) {
            const initArgs = color_1.default.color.decode(selectText);
            // @ts-ignore
            const colorFormat = color_1.default.color[`${isColorType}2${toType}`](initArgs);
            const result = selectText.replace(selectText, getDressed(toType, colorFormat));
            editor.edit((editBuilder) => {
                editBuilder.replace(selections, result);
            });
        }
    }
};
exports.onChangeColorMode = onChangeColorMode;
//# sourceMappingURL=utils.js.map