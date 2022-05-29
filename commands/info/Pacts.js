const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class PactsCommand extends PaginatedCommand {
  static aliases = ["Pacts", "NAPs"]
  static description = "Shows the Non Aggresion Pacts."
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
    return this.gamePresenter.makeNAPsEmbed(this.index)
  }
}