const PaginatedCommand = require("../paginated_command")
const PollPresenter = require("../../presenters/poll_presenter")

module.exports = class PollCommand extends PaginatedCommand  {
  static aliases = ["Poll", "Election", "Decision"]
  static description = "Sets a question for players and shows the current votes."
  static argsDescription = "[Question]"
  static category = "Master"

  canDelete = true
  needsGame = true
  
  async execute() {
    this.index = this.game.turnNumber
    this.ceiling = this.game.turnNumber

    if (!this.isMaster()) {
      return this.sendReply(this.getReply())
    }

    this.question = this.arg
    if (this.question) {
      this.turn.setPoll(this.question)
    }

    if (this.saveOrReturnWarning()) return
    await this.sendReply(this.getReply())
  }

  getReply() {
    this.pollPresenter = new PollPresenter(this.game)
    return this.pollPresenter.makeEmbed(this.index)
  }
}