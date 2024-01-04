const PlayerPingCommand = require("../master/PlayerPing")

module.exports = class BonusesCommand extends PlayerPingCommand {
  static aliases = ["Bonuses"]
  static description = "Shows all bonuses."
  static argsDescription = ""
  static category = "Game"

  canDelete = true
  masterOnly = false  
  canMention = false
  
  async execute() {
    this.sendReply(this.turn.listBonuses())
  }
}