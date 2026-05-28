const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class MupsCommand extends PaginatedCommand {
  static aliases = ["AllMup", "Mups"]
  static description = "Shows links for the mups of every turn."
  static argsDescription = ""
  static category = "Game"

  canDelete = true
  needsGame = true
  shouldLoop = true
  index = 0
  step = 20

  async execute() {
    this.ceiling = this.turn.number

    this.gamePresenter = new GamePresenter(this.game)
    await this.sendReply(this.getReply())
  }

  getReply() {
    return this.gamePresenter.makeListOfAllMupsEmbed(this.index, this.step)
  }
}