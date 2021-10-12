const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class StatusCommand extends PaginatedCommand {
  static aliases = ["Status", "Game"]
  static description = "Shows the status of the current game. Try `S` or `G` for a shorter version."
  static argsDescription = "[Turn]"
  static category = "Game"

  canDelete = true
  needsGame = true
  isExpanded = true
  hasExtras = true

  async execute() {
    this.index = this.game.turnNumber
    this.ceiling = this.game.turnNumber

    this.getPageArg()

    this.gamePresenter = new GamePresenter(this.game)
    await this.sendReply(this.getReply())
  }

  getReply() {
    if (this.isShowingExtras) return this.gamePresenter.makeStatusEmbedExtras(this.index, this.isExpanded)
    let embed = this.gamePresenter.makeStatusEmbed(this.index, this.isExpanded)
    if (embed.length >= 6000) embed = this.gamePresenter.makeStatusEmbed(this.index, false)
    return embed
  }
}