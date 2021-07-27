// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { onChangeColorMode } from './lib';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// 注册颜色
	let colorCommand = vscode.commands.registerCommand('color-conv.color', () => {
		
	});

	context.subscriptions.push(colorCommand);

	['hex','yuv','rgb','hsb','hsv','hsl','kelvin'].forEach((mode:string)=>{
		const colorMOde = vscode.commands.registerCommand(`color-conv.${mode}`,()=>{
			onChangeColorMode(mode)	
		});
		context.subscriptions.push(colorMOde)
	})
}

// this method is called when your extension is deactivated
export function deactivate() { }
