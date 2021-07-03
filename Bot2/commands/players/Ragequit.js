const BaseCommand = require("../base_command")

module.exports = class PlayerRagequitCommand extends BaseCommand {
  static aliases = ["Ragequit", "Leave", "Quit"]
  static description = "Suicide then leave on the next turn."
  static argsDescription = ""

  canDelete = false
  acceptAdmins = false
  acceptModerators = false

  needsGame = true
  playerOnly = true
  aliveOnly = true
  
  canMention = true

  async execute() {
    this.turn.kickPlayer(this.player)
    if (this.saveOrReturnWarning) return
    this.sendReply(`${this.player.ping()} has given up and will be removed next turn.`)
  }
}