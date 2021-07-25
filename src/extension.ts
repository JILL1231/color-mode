// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getSelections,colorLib } from './lib';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
		// 注册颜色
		let colorCommand = vscode.commands.registerCommand('color-conv.color', () => {
			let editor = vscode.window.activeTextEditor;
            let selections = getSelections();
			// 通过选中色值进行转换
			if(selections?.length){
				let selectText = editor?.document.getText(selections[0]) || '';
                let isColorType = colorLib.isColorType(selectText);
				// 选中的文本符合色值的规则
				if(isColorType) {
                	vscode.window.showQuickPick(
						[ 
							'HEX', 
							'RGB', 
							'HSB',   
							'HSV',    
							'HSL',   
							'YUV', 
							'KELVIN',
						], 
						{ placeHolder: '选择色彩模式' }
					).then((res) => {        
						editor?.edit((editBuilder)=>{
							editor?.selections.forEach((sel) => {
								const range = sel.isEmpty
								  ? editor?.document.getWordRangeAtPosition(sel.start) || sel
								  : sel;
								const toType = res?.toLowerCase();
								// 更换前后的色彩模式一致，则返回
								if(isColorType === toType) {
									return;
								}
								const initArgs = colorLib.color.decode(selectText);
                                console.log("🚀 ~ file: extension.ts ~ line 41 ~ editor?.selections.forEach ~ initArgs", initArgs)
                                // @ts-ignore
								const colorFormat = colorLib.color[`${isColorType}2${toType}`](initArgs);
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

// this method is called when your extension is deactivated
export function deactivate() { }
