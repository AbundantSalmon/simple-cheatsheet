import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  let showCheatSheetCommand = vscode.commands.registerCommand(
    "vscode-cheatsheet.showCheatSheet",
    () => {
      const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;
      if (currentPanel) {
        currentPanel.reveal(columnToShowIn);
      } else {
        currentPanel = vscode.window.createWebviewPanel(
          "vscodeCheatSheet",
          "VSCode Cheat Sheet",
          vscode.ViewColumn.One,
          {}
        );

        currentPanel.webview.html = getWebviewContent();
      }

      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        context.subscriptions
      );
    }
  );

  let closeCheatSheetCommand = vscode.commands.registerCommand(
    "vscode-cheatsheet.closeCheatSheet",
    () => {
      if (currentPanel) {
        currentPanel.dispose();
      }
    }
  );

  context.subscriptions.push(showCheatSheetCommand, closeCheatSheetCommand);
}

function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
</body>
</html>`;
}

export function deactivate() {
  return;
}
