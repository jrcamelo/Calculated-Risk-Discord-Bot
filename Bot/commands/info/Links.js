const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class LinksCommand extends PaginatedCommand {
  static aliases = ["Links", "L"]
  static description = "Shows a list of links to all the rolls."
  static argsDescription = "[Turn]"
  static category = "Game"

  canDelete = true
  needsGame = true
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
    return this.gamePresenter.makeLinkListEmbed(this.turnIndex, this.index)
  }
}