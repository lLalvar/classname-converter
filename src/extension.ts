// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'class-name-to-template-converter.ClassNameToTemplateConverter',
    () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        return // No open text editor
      }

      const doc = editor.document
      const cursorPosition = editor.selection.active
      const lineText = doc.lineAt(cursorPosition.line).text
      const quoteRegex = /(["'])(.*?)\1/g // Matches text inside single or double quotes

      let match: RegExpExecArray | null
      while ((match = quoteRegex.exec(lineText)) !== null) {
        const matchedText = match[2] // The text inside the quotes
        const newText = `{${'`'}${matchedText} ${'${}'}${'`'}}`

        if (
          cursorPosition.character >= match.index &&
          cursorPosition.character <= match.index + matchedText.length + 2
        ) {
          editor
            .edit((editBuilder) => {
              if (match) {
                const range = new vscode.Range(
                  cursorPosition.line,
                  match.index,
                  cursorPosition.line,
                  match.index + matchedText.length + 2
                )
                editBuilder.replace(range, newText)
              }
            })
            .then((success) => {
              if (success) {
                // Move cursor to the end of the backtick symbol but still inside it
                if (match) {
                  const position = new vscode.Position(
                    cursorPosition.line,
                    match.index + newText.length - 3
                  )
                  editor.selection = new vscode.Selection(position, position)
                }
              }
            })
          break
        }
      }
    }
  )

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
