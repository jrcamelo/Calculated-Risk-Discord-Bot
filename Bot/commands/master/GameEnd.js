const BaseCommand = require("../base_command")
const StatusCommand = require("../info/Status")

module.exports = class GameEndCommand extends BaseCommand {
  static aliases = ["EndGame", "FinishGame", "PeaceMup"]
  static description = "Finishes the current game and saves it."
  static argsDescription = ""
  static category = "Master"

  canDelete = false
  needsGame = true
  masterOnly = true

  async execute() {
    const status = new StatusCommand(this.message, this.args)
    await status.prepare()
    await status.tryExecute()
    this.game.finishGame()
  }
}