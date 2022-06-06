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
  hasExpand = true

  async execute() {    
    this.index = this.game.turnNumber
    this.ceiling = this.game.turnNumber
    this.getPageArg()
    this.expandIndex = 0

    this.ceiling = this.turn.history.length
    this.index = 0

    this.gamePresenter = new GamePresenter(this.game)
    await this.sendReply(this.getReply())
  }

  getReply() {
    let text = this.gamePresenter.makeHistoryEmbed(this.index, this.expandIndex, this.isShowingExtras)
    if (this.isShowingExtras && text.length > 6000) {
      this.isShowingExtras = false
      text = this.gamePresenter.makeHistoryEmbed(this.index, this.expandIndex, this.isShowingExtras)
    }
    return text
  }

  
  async doExpand(_collected, command) {
    command.expandIndex = command.expandIndex + 1;
    await command.editReply();
  }
}