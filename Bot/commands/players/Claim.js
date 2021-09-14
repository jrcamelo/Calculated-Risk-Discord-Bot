const BaseCommand = require("../base_command")

module.exports = class ClaimCommand extends BaseCommand {
  static aliases = ["Claim", "Join", "Rename"]
  static description = "Joins the current game as a player or rename your faction."
  static argsDescription = "[Faction]"
  static category = "Player"

  canDelete = false

  needsGame = true  
  canMention = false

  async execute() {
    if (this.player) {
      const blank = "[Blank]"
      const ping = this.player.ping()
      const existingPlayerName = this.player.name || blank
      this.turn.renamePlayer(this.player, this.arg)
      if (this.saveOrReturnWarning()) return
      const newName = this.arg || blank
      if (existingPlayerName == blank && newName == blank) {
        return this.sendReply(`${ping} is already in this game`)
      } else if (existingPlayerName == newName) {
        return this.sendReply(`${ping}'s faction is already ${existingPlayerName}`)
      } else if (newName == blank) {
        return this.sendReply(`${ping}'s faction name has been removed`)
      } else {
        return this.sendReply(`${ping}'s faction has been renamed to ${newName}`)
      }
    } else {
      this.turn.addPlayer(this.user, this.arg)
      const newPlayer = this.turn.getPlayer(this.user)
      if (this.saveOrReturnWarning()) return
      this.sendReply(`${newPlayer.pingWithFaction()} has joined!`)
    }
  }
}