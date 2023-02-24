import vscode from 'vscode';
import fetch from 'node-fetch';
import AuthSettings from './settings';

export default async function updateNote(context: vscode.ExtensionContext, body: string) {
    AuthSettings.init(context);
    const settings = AuthSettings.instance;

    const workspaces = vscode.workspace.workspaceFolders;

    if (workspaces?.length == 0) {
        vscode.window.showErrorMessage('No workspace is open');
        return;
    }

    const tokenOutput = await settings.getAuthData();

    const updateNoteResponse = await fetch('https://notes.informatiqal.com/api/notes', {
        method: 'POST',
        headers: {
            authorization: `${tokenOutput}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: (workspaces as any)[0]?.name,
            content: body,
            path: (workspaces as any)[0].uri,
        }),
    }).catch((e) => vscode.window.showErrorMessage(e.message));
}
