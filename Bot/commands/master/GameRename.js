const BaseCommand = require("../base_command")

module.exports = class GameRename extends BaseCommand {
  static aliases = ["RenameGame", "ChangeTitle", "Title"]
  static description = "Renames the current game."
  static argsDescription = "<New name>"

  needsGame = true
  masterOnly = true
  neededArgsAmount = 1

  async execute() {
    const oldName = this.game.name
    this.game.renameGame(this.arg)
    if (this.saveOrReturnWarning()) return
    this.sendReply(`**${oldName}** shall now be known in history as **${this.game.name}**!`)
  }
}