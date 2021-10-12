const BaseCommand = require("../base_command")

module.exports = class PlayerPingCommand extends BaseCommand {
  static aliases = ["Ping", "NotPlayed", "Not"]
  static description = "Pings players that need to roll. \nTry `PingAlive` and `PingEveryone` as well."
  static argsDescription = ""
  static category = "Master"

  canDelete = false
  masterOnly = true
  needsGame = true  
  canMention = true

  async execute() {
    this.sendReply(this.turn.pingNotPlayed())
  }
}