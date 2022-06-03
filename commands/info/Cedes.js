const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class CedesCommand extends PaginatedCommand {
  static aliases = ["Cedes"]
  static description = "Shows all cedes chronologically."
  static argsDescription = "[Turn]"
  static category = "Game"

  canDelete = true
  needsGame = true
  shouldLoop = false
  index = 0
  step = 10

  async execute() {
    this.ceiling = this.game.turnNumber
    this.getPageArg()
    this.turnIndex = this.index || this.game.turnNumber

    this.ceiling = this.turn.cedes.length
    this.index = 0

    this.gamePresenter = new GamePresenter(this.game)
    await this.sendReply(this.getReply())
  }

  getReply() {
    let text = this.gamePresenter.makeCedeHistory(this.turnIndex, this.index)
    return text
  }
}