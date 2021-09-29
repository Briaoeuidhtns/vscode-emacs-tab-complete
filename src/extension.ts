import * as vscode from 'vscode'

const truth = <T>(x: T | false | null | undefined): x is T =>
  x != null && x !== false

export const activate = (context: vscode.ExtensionContext) => {
  let disposable = vscode.commands.registerCommand(
    'emacs-tab-complete.indent-or-complete',
    async () => {
      const currentLine = (): [string, boolean] | null => {
        const [selection, hasOtherSelections] =
          vscode.window.activeTextEditor?.selections ?? ([] as undefined[])

        const result =
          hasOtherSelections == null &&
          selection?.isSingleLine &&
          vscode.window.activeTextEditor!.document.lineAt(selection.start).text

        return truth(result) ? [result, false] : null
      }
      const [before, inWhitespace] = currentLine() ?? []
      // TODO: Deal with cycling indent if inWhitespace for things like python
      await vscode.commands.executeCommand(
        'editor.action.reindentselectedlines'
      )

      const [after] = currentLine() ?? []
      if (before === after)
        await vscode.commands.executeCommand('editor.action.triggerSuggest')
    }
  )

  context.subscriptions.push(disposable)
}

export const deactivate = () => {}
