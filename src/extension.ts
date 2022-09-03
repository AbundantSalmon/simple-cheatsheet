import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  let lastDocument: vscode.TextDocument | undefined = undefined;

  const showCheatSheet = () => {
    lastDocument = vscode.window.activeTextEditor?.document;

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
        {
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "media")),
          ],
        }
      );

      let cheatSheetFilePath =
        vscode.workspace.getConfiguration("vscode-cheatsheet").cheatSheetFile;

      if (!cheatSheetFilePath) {
        cheatSheetFilePath = path.join(context.extensionPath, "test.html");
      }

      if (!fs.existsSync(cheatSheetFilePath)) {
        vscode.window.showErrorMessage(
          "Cheat sheet file not found. Please set in settings."
        );
        return;
      }

      const htmlToDisplay = fs.readFileSync(cheatSheetFilePath, "utf8");
      currentPanel.webview.html = htmlToDisplay;

      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        context.subscriptions
      );
    }
  };

  const showCheatSheetCommand = vscode.commands.registerCommand(
    "vscode-cheatsheet.showCheatSheet",
    showCheatSheet
  );

  const closeCheatSheet = () => {
    if (currentPanel) {
      currentPanel.dispose();
      if (lastDocument) {
        vscode.window.showTextDocument(lastDocument);
      }
    }
  };

  const closeCheatSheetCommand = vscode.commands.registerCommand(
    "vscode-cheatsheet.closeCheatSheet",
    closeCheatSheet
  );

  const toggleCheatSheetCommand = vscode.commands.registerCommand(
    "vscode-cheatsheet.toggleCheatSheet",
    () => {
      if (currentPanel) {
        closeCheatSheet();
      } else {
        showCheatSheet();
      }
    }
  );

  context.subscriptions.push(
    showCheatSheetCommand,
    closeCheatSheetCommand,
    toggleCheatSheetCommand
  );
}

export function deactivate() {
  return;
}
