const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")

module.exports = class NotesCommand extends PaginatedCommand {
  static aliases = ["Notes", "N"]
  static description = "Shows the notes of all players."
  static argsDescription = ""

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
    return this.gamePresenter.makeNotesEmbed(this.index)
  }
}