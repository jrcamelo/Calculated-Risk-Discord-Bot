const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class HistoryCommand extends PaginatedCommand {
  static aliases = ["Rolls", "Rs"]
  static description = "Shows all rolls chronologically. Try `Links` for a clickable list. (Aliases: Rs)"
  static argsDescription = "[Turn]"
  static category = "Game"

  canDelete = true
  needsGame = true
  hasExtras = true
  shouldLoop = false
  isShowingExtras = true
  index = 0
  step = 10

  async execute() {
    this.ceiling = this.game.turnNumber
    this.getPageArg()
    this.turnIndex = this.index || this.game.turnNumber

    const turn = this.game.getTurn(this.turnIndex)
    this.ceiling = turn && turn._rolls ? Math.max(0, turn._rolls.length - 1) : 0
    this.index = 0

    this.gamePresenter = new GamePresenter(this.game)
    await this.sendReply(this.getReply())
  }

  getReply() {
    let text = this.gamePresenter.makeRollHistory(this.turnIndex, this.index, this.isShowingExtras)
    if (this.isShowingExtras && text.length > 2000) {
      this.isShowingExtras = false
      text = this.gamePresenter.makeRollHistory(this.turnIndex, this.index, this.isShowingExtras)
    }
    return text
  }

  getSlashButtonLabel(actionId) {
    if (actionId === "extras") return this.isShowingExtras ? "Hide Intentions" : "Show Intentions"
    return super.getSlashButtonLabel(actionId)
  }
}
