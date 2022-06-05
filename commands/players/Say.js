const BaseCommand = require("../base_command")
const { makeMessageLink } = require("../../utils/discord");
module.exports = class PlayerCedeCommand extends BaseCommand {
  static aliases = ["Add", "Say"]
  static description = "Add something to the history."
  static argsDescription = "<Message>"
  static category = "Player"

  canDelete = false
  needsGame = true
  aliveOnly = true
  canMention = false
  neededArgsAmount = 1

  async execute() {
    let text = `${this.player.ping()} adds: ${this.arg}`
    this.turn.saveAddendum(this.player, text)
    if (this.saveOrReturnWarning()) return
    await this.sendReply(text || "Error")
  }
}