const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class AlliancesCommand extends PaginatedCommand {
  static aliases = ["Alliances"]
  static description = "Shows every alliance."
  static argsDescription = ""
  static category = "Game"

  canDelete = true
  needsGame = true

  async execute() {
    this.index = this.game.turnNumber
    this.ceiling = this.game.turnNumber

    this.getPageArg()

    this.gamePresenter = new GamePresenter(this.game)
    await this.sendReply(this.getReply())
  }

  getReply() {
    return this.gamePresenter.makeAlliancesEmbed(this.index)
  }
}