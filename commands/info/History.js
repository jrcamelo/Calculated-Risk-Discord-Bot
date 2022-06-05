const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class HistoryCommand extends PaginatedCommand {
  static aliases = ["History", "Events", "E"]
  static description = "Shows events chronologically. Check other turns by adding it as an argument."
  static argsDescription = "[Turn]"
  static category = "Game"

  canDelete = true
  needsGame = true
  hasExtras = true
  isShowingExtras = true
  shouldLoop = true
  index = 0
  step = 25

  async execute() {
    this.ceiling = this.game.turnNumber
    this.getPageArg()
    this.turnIndex = this.index || this.game.turnNumber

    this.ceiling = this.turn.history.length
    this.index = 0

    this.gamePresenter = new GamePresenter(this.game)
    await this.sendReply(this.getReply())
  }

  getReply() {
    let text = this.gamePresenter.makeHistoryEmbed(this.turnIndex, this.index, this.isShowingExtras)
    if (this.isShowingExtras && text.length > 6000) {
      this.isShowingExtras = false
      text = this.gamePresenter.makeHistoryEmbed(this.turnIndex, this.index, this.isShowingExtras)
    }
    return text
  }
}