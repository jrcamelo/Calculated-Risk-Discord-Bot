const BaseCommand = require("../base_command")
const StatusCommand = require("../info/Status")
const OldGamePresenter = require("../../presenters/old_game_presenter")
const OldDatabase = require("../../database/oldDatabase")
const Game = require("../../models/game")

module.exports = class GameStartCommand extends BaseCommand {
  static aliases = ["ReopenGame", "RestartGame"]
  static description = "Reopens the last finished game in the channel. Currently not available."
  static argsDescription = ""
  static category = "Master"

  canDelete = false

  async validate() {
    if (!this.isOwner())
      return "This command is not available."
    if (this.game != null) {
      return "There is already a game in this channel."
    }
  }

  async execute() {
    this.presenter = new OldGamePresenter(this.serverId, this.step)
    await this.presenter.getOldGamesInChannel(null, null, this.channel.id)
    if (!this.presenter.result || this.presenter.result.length === 0) {
      return this.replyDeletable("There are no games in this channel.")
    }

    const gameObject = this.presenter.result[0]
    this.database = new OldDatabase(gameObject.channel, this.serverId, gameObject.startedAt.toString())
    this.game = this.database.getGame()
    if (this.game != null) this.turn = this.game._turn
    if (!this.game) return this.replyDeletable("Could not read old game.")
    if (!this.database.saveAsNewGame()) return this.replyDeletable("Could not reopen game.")
    this.replyDeletable("Done!")
  }
}