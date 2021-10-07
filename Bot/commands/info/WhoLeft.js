const PlayerPingCommand = require("../master/PlayerPing")

module.exports = class WhoIsLeftCommand extends PlayerPingCommand {
  static aliases = ["Who", "Left", "W"]
  static description = "Shows the players who have not played yet."
  static argsDescription = ""
  static category = "Game"

  canDelete = true
  masterOnly = false  
  canMention = false
  
  async execute() {
    this.sendReply(this.turn.listNotPlayed())
  }
}