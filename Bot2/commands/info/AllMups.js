const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class MupsCommand extends PaginatedCommand {
  static aliases = ["AllMups", "Mups"]
  static description = "Shows links for the mups of every turn."
  static argsDescription = ""

  canDelete = true
  needsGame = true
  shouldLoop = false
  index = 0
  step = 25

  async execute() {
    this.ceiling = this.turn._rolls.length

    this.gamePresenter = new GamePresenter(this.game)
    await this.sendReply(this.getReply())
  }

  getReply() {
    return this.gamePresenter.makeListOfAllMupsEmbed(this.index)
  }
}