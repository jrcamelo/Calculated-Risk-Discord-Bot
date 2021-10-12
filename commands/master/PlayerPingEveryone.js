const BaseCommand = require("../base_command")

module.exports = class PlayerPingEveryoneCommand extends BaseCommand {
  static aliases = ["PingEveryone"]
  static description = "Pings all players."
  static argsDescription = ""
  static category = "Master"

  canDelete = false
  masterOnly = true
  needsGame = true  
  canMention = true

  async execute() {
    this.sendReply(this.turn.pingEveryone())
  }
}