const BaseCommand = require("../base_command")

module.exports = class ClaimCommand extends BaseCommand {
  static aliases = ["Claim", "Join", "Rename"]
  static description = "Joins the current game as a player or rename your faction."
  static argsDescription = "[Faction]"
  static category = "Player"

  canDelete = false

  needsGame = true  
  canMention = true

  async execute() {
    if (this.player) {
      const existingPlayerName = this.player.name || "[Blank]"
      this.turn.renamePlayer(this.player, this.arg)
      if (this.saveOrReturnWarning()) return
      return this.sendReply(`${existingPlayerName} has been changed to ${this.arg || "[Blank]"}`)
    } else {
      this.turn.addPlayer(this.user, this.arg)
      const newPlayer = this.turn.getPlayer(this.user)
      if (this.saveOrReturnWarning()) return
      this.sendReply(`${newPlayer.pingWithFaction()} has joined!`)
    }
  }
}