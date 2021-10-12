const BaseCommand = require("../base_command")
const StatusCommand = require("../info/Status")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class GameEndCommand extends BaseCommand {
  static aliases = ["EndGame", "FinishGame", "Peace"]
  static description = "Finishes the current game and saves it."
  static argsDescription = ""
  static category = "Master"

  canDelete = false
  needsGame = true
  masterOnly = true
  acceptModerators = true
  acceptAdmins = true
  canMention = true

  async execute() {
    const status = new StatusCommand(this.message, this.args)
    await status.prepare()
    await status.tryExecute()
    const presenter = new GamePresenter(this.game)
    await this.game.finishGame()
    this.sendReply(presenter.makeGGMessage())
  }
}