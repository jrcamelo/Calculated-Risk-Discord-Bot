const BaseCommand = require("../base_command")
const StatusCommand = require("../info/Status")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class GameEndCommand extends BaseCommand {
  static aliases = ["EndGame", "FinishGame", "Peace", "EndMup"]
  static description = "Finishes the current game and saves it. (Aliases: FinishGame, Peace, EndMup)"
  static argsDescription = "<optional final image>"
  static category = "Master"

  canDelete = false
  needsGame = true
  masterOnly = true
  acceptModerators = true
  acceptAdmins = true
  canMention = true

  async execute() {
    if (this.attachment || this.arg) {
      const mup = this.attachment || this.turn.mup
      this.game.nextTurn(mup, this.arg)
      if (this.saveOrReturnWarning()) return
    }
  
    const status = new StatusCommand(this.message, this.args)
    await status.prepare()
    await status.tryExecute()
  
    const presenter = new GamePresenter(this.game)
  
    await this.game.finishGame()
  
    this.sendReply(presenter.makeGGMessage())
  }
}
