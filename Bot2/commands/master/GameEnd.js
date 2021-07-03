const BaseCommand = require("../base_command")

module.exports = class GameEndCommand extends BaseCommand {
  static aliases = ["EndGame", "FinishGame", "PeaceMup"]
  static description = "Finishes the current game." // TODO: And saves it.
  static argsDescription = ""

  canDelete = false
  needsGame = true
  masterOnly = true

  async execute() {
    this.game.finishGame()
    // TODO: Make it return an embed AND SAVE THE GAME
    this.sendReply(`${this.game.name} is over!`)
  }
}