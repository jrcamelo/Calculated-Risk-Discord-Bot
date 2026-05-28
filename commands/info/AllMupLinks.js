const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class MupLinksCommand extends PaginatedCommand {
  static aliases = ["AllMupLinks", "MupLinks"]
  static description = "Shows links for the mups of every turn."
  static argsDescription = ""
  static category = "Game"

  canDelete = true
  needsGame = true
  shouldLoop = true
  index = 0
  step = 5

  async execute() {
    this.ceiling = this.turn.number

    this.gamePresenter = new GamePresenter(this.game)
    await this.sendReply(this.getReply())
  }

  getReply() {
    return this.gamePresenter.makeListOfAllMupLinks(this.index, this.step)
  }
}