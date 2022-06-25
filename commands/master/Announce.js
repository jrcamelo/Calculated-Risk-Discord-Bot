const BaseCommand = require("../base_command")
module.exports = class PlayerAnnounceCommand extends BaseCommand {
  static aliases = ["Announce", "Proclaim", "An"]
  static description = "Add something to the history."
  static argsDescription = "<Message>"
  static category = "Master"

  canDelete = false
  needsGame = true
  masterOnly = true
  canMention = false
  neededArgsAmount = 1
  shouldCleanArgsLineBreaks = false

  async execute() {
    let text = `<@!${this.game.masterId}> — ${this.arg}`
    this.turn.saveAddendum({id: this.game.masterId}, text)
    if (this.saveOrReturnWarning()) return
    await this.sendReply(text || "Error")
  }
}