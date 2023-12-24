"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    var disposable = vscode.commands.registerCommand('class-name-to-template-converter.ClassNameToTemplateConverter', function () {
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }
        var doc = editor.document;
        var cursorPosition = editor.selection.active;
        var lineText = doc.lineAt(cursorPosition.line).text;
        var quoteRegex = /(["'])(.*?)\1/g; // Matches text inside single or double quotes
        var match;
        var _loop_1 = function () {
            var matchedText = match[2]; // The text inside the quotes
            var newText = "{".concat('`').concat(matchedText, " ").concat('${}').concat('`', "}");
            if (cursorPosition.character >= match.index &&
                cursorPosition.character <= match.index + matchedText.length + 2) {
                editor
                    .edit(function (editBuilder) {
                    if (match) {
                        var range = new vscode.Range(cursorPosition.line, match.index, cursorPosition.line, match.index + matchedText.length + 2);
                        editBuilder.replace(range, newText);
                    }
                })
                    .then(function (success) {
                    if (success) {
                        // Move cursor to the end of the backtick symbol but still inside it
                        if (match) {
                            var position = new vscode.Position(cursorPosition.line, match.index + newText.length - 3);
                            editor.selection = new vscode.Selection(position, position);
                        }
                    }
                });
                return "break";
            }
        };
        while ((match = quoteRegex.exec(lineText)) !== null) {
            var state_1 = _loop_1();
            if (state_1 === "break")
                break;
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
