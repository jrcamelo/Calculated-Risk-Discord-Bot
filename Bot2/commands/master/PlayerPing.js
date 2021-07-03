const BaseCommand = require("../base_command")

module.exports = class PlayerPingCommand extends BaseCommand {
  static aliases = ["Ping"]
  static description = "Pings players that need to roll."
  static argsDescription = ""

  canDelete = false
  masterOnly = true
  needsGame = true  
  canMention = true

  async execute() {
    this.sendReply(this.turn.pingNotPlayed())
  }
}