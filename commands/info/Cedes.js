const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class CedesCommand extends PaginatedCommand {
  static aliases = ["Cedes"]
  static description = "Shows all cedes chronologically."
  static argsDescription = "[Turn]"
  static category = "Game"

  canDelete = true
  needsGame = true
  shouldLoop = true
  hasExtras = true
  hasExpand = true

  async execute() {
    this.index = this.game.turnNumber
    this.ceiling = this.game.turnNumber
    this.getPageArg()

    this.expandIndex = 0

    this.gamePresenter = new GamePresenter(this.game)
    await this.sendReply(this.getReply())
  }

  getReply() {
    let text = this.gamePresenter.makeCedeHistory(this.index, this.expandIndex, this.isShowingExtras)
    if (text.length > 1000) text = this.gamePresenter.makeCedeHistory(this.index, this.expandIndex, this.isShowingExtras, true)
    return text
  }

  async doExpand(_collected, command) {
    if (command.expandIndex > command.turn.cedes.length) {
      command.expandIndex = 0
    } else {
      command.expandIndex = command.expandIndex + 10;
    }
    await command.editReply();
  }
}