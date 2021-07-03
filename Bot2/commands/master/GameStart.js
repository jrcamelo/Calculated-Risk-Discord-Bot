const BaseCommand = require("../base_command")
const Game = require("../../models/game")

module.exports = class GameStartCommand extends BaseCommand {
  static aliases = ["StartGame", "NewGame", "Host"]
  static description = "Starts a new game in this channel. You will be the Game Master."
  static argsDescription = "<Title of the Game> {First Mup}"

  canDelete = false

  async validate() {
    if (this.game != null) {
      return "There is already a game in this channel."
    } else if (!this.args) {
      return "Try again with a name for the game."
    }
  }

  async execute() {
    this.game = new Game(this.database, this.args, this.user)
    if (this.attachment)
      this.game._turn.mup = this.attachment
    if (saveOrReturnWarning()) return
    // TODO: Make it return an embed
    this.sendReply(`${this.game.name} has started!`)
  }
}