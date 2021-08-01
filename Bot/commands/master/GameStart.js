const BaseCommand = require("../base_command")
const StatusCommand = require("../info/Status")
const Game = require("../../models/game")

module.exports = class GameStartCommand extends BaseCommand {
  static aliases = ["StartGame", "NewGame", "Host"]
  static description = "Starts a new game in this channel."
  static argsDescription = "<Title of the Game> {First Mup}"
  static category = "Master"

  canDelete = false

  async validate() {
    if (this.game != null) {
      return "There is already a game in this channel."
    } else if (!this.args) {
      return "Try again with a name for the game."
    }
  }

  async execute() {
    this.game = new Game(this.database, this.arg, this.user.id, this.user.username, this.channel.id)
    if (this.attachment)
      this.game._turn.mup = this.attachment
    if (this.saveOrReturnWarning()) return
    const status = new StatusCommand(this.message, this.args)
    await status.prepare()
    await status.tryExecute()
  }
}