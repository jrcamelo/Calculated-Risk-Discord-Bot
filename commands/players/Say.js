const BaseCommand = require("../base_command")
module.exports = class PlayerSayCommand extends BaseCommand {
  static aliases = ["Say"]
  static description = "Add something to the history. Masters can use it as `Announce`"
  static argsDescription = "<Message>"
  static category = "Player"

  canDelete = false
  needsGame = true
  playerOnly = true
  aliveOnly = true
  canMention = false
  neededArgsAmount = 1
  shouldCleanArgsLineBreaks = false

  async execute() {
    let text = `${this.player.ping()} adds: ${this.arg}`
    this.turn.saveAddendum(this.player, text)
    if (this.saveOrReturnWarning()) return
    await this.sendReply(text || "Error")
  }
}