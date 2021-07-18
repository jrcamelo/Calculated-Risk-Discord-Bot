const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class HistoryCommand extends PaginatedCommand {
  static aliases = ["History", "H", "Rolls", "Rs"]
  static description = "Shows all rolls chronologically."
  static argsDescription = "[Turn]"

  canDelete = true
  needsGame = true
  hasExtras = true
  shouldLoop = false
  index = 0
  step = 10

  async execute() {
    this.ceiling = this.turn._rolls.length

    this.getPageArg()
    this.turnIndex = this.index === 0 ? this.game.turnNumber : this.index
    this.index = 0

    this.gamePresenter = new GamePresenter(this.game)
    await this.sendReply(this.getReply())
  }

  getReply() {
    return this.gamePresenter.makeRollHistory(this.turnIndex, this.index, this.isShowingExtras)
  }
}