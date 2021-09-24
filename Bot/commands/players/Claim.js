const BaseCommand = require("../base_command")

module.exports = class ClaimCommand extends BaseCommand {
  static aliases = ["Claim", "Join", "Rename", "Faction"]
  static description = "Joins the current game as a player or rename your faction. Get unclaimed factions with a number or its name."
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
      const renamedPlayer = this.turn.renamePlayer(this.player, this.arg)
      if (this.saveOrReturnWarning()) return
      const newName = this.arg || blank
      if (existingPlayerName == blank && newName == blank) {
        return this.sendReply(`You are already playing this game`)
      } else if (existingPlayerName == renamedPlayer.name) {
        return this.sendReply(`Your faction is already ${renamedPlayer.name}`)
      } else if (newName == blank) {
        return this.sendReply(`Your faction name has been removed`)
      } else {
        return this.sendReply(`Your faction has been renamed to ${renamedPlayer.name}`)
      }
    } else {
      this.turn.addPlayer(this.user, this.arg)
      const newPlayer = this.turn.getPlayer(this.user)
      if (this.saveOrReturnWarning()) return
      this.sendReply(`${newPlayer.pingWithFaction()} has joined!`)
    }
  }
}