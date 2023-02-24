import * as vscode from 'vscode';
import { basename } from 'path';

import updateNote from './notes';
import AuthSettings from './settings';

let globalContext: vscode.ExtensionContext = {} as vscode.ExtensionContext;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    globalContext = context;
    AuthSettings.init(context);
    const settings = AuthSettings.instance;

    context.subscriptions.push(
        vscode.commands.registerCommand('NotesMD.setToken', async () => {
            const tokenInput = await vscode.window.showInputBox();
            await settings.storeAuthData(tokenInput);
        }),
    );
}

vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    const fileName = basename(document.fileName).toLowerCase();
    if (fileName != 'notes.md') return;

    const content = document.getText();

    updateNote(globalContext, content);
});
