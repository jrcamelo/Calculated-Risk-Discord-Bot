const BaseCommand = require("../base_command")

module.exports = class PlayerPingAliveCommand extends BaseCommand {
  static aliases = ["PingAlive"]
  static description = "Pings all players that are still alive."
  static argsDescription = ""

  canDelete = false
  masterOnly = true
  needsGame = true  
  canMention = true

  async execute() {
    this.sendReply(this.turn.pingAlive())
  }
}